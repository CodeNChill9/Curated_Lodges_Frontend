import { NextResponse } from "next/server";
import { Readable } from "stream";
import { google } from "googleapis";
import { connectDB } from "@/lib/mongodb";
import LodgeApplication from "@/models/LodgeApplication";
import InviteToken from "@/models/InviteToken";

export const dynamic = "force-dynamic";

// ── Google Drive helpers ──────────────────────────────────────────────────────

// Module-level cache — reused across warm serverless invocations
let _driveClient = null;

async function getDriveClient() {
  if (_driveClient) return _driveClient;

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/drive.file"],
  });

  // Pre-fetch the OAuth access token now so the first Drive API call is instant
  await auth.getClient();

  _driveClient = google.drive({ version: "v3", auth });
  return _driveClient;
}

async function createSubfolder(drive, folderName, parentFolderId) {
  // Sanitise the name so it's safe for Drive
  const safeName = folderName.replace(/[/\\?%*:|"<>]/g, "-").trim() || "Unknown Resort";

  const folder = await drive.files.create({
    supportsAllDrives: true,
    requestBody: {
      name: safeName,
      mimeType: "application/vnd.google-apps.folder",
      parents: parentFolderId ? [parentFolderId] : undefined,
    },
    fields: "id",
  });
  return folder.data.id;
}

async function uploadToDrive(drive, fileBuffer, fileName, mimeType, folderId) {
  // Validate file size server-side (10 MB limit)
  if (fileBuffer.byteLength > 10 * 1024 * 1024) {
    throw new Error(`File "${fileName}" exceeds the 10 MB limit.`);
  }

  const readable = new Readable();
  readable.push(fileBuffer);
  readable.push(null);

  // Returns { fileId, webViewLink }. Permissions are set separately via setFilePublic()
  // so that the permissions call can overlap with the MongoDB save in the POST handler.
  const created = await drive.files.create({
    supportsAllDrives: true,
    requestBody: {
      name: fileName,
      parents: folderId ? [folderId] : undefined,
    },
    media: { mimeType, body: readable },
    fields: "id,webViewLink",
  });

  return { fileId: created.data.id, webViewLink: created.data.webViewLink };
}

// Shared Drive files do NOT inherit folder-level sharing — must be set per file.
async function setFilePublic(drive, fileId) {
  await drive.permissions.create({
    supportsAllDrives: true,
    fileId,
    requestBody: { role: "reader", type: "anyone" },
  });
}

// ── Route handler ─────────────────────────────────────────────────────────────

export async function POST(request) {
  try {
    const formData = await request.formData();

    // ── Verify invite token (server-side guard) ────────────────────────────
    const inviteTokenValue = formData.get("inviteToken");
    if (!inviteTokenValue) {
      return NextResponse.json({ error: "Invitation required." }, { status: 401 });
    }

    // DB connection and Drive OAuth warm-up run simultaneously
    const [, drive] = await Promise.all([connectDB(), getDriveClient()]);

    const invite = await InviteToken.findOne({ token: inviteTokenValue });
    if (!invite || invite.used || (invite.expiresAt && invite.expiresAt < new Date())) {
      return NextResponse.json({ error: "Invalid or expired invitation." }, { status: 401 });
    }

    // Allowed MIME types for uploads
    const ALLOWED_MIME = new Set([
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ]);

    // Create a subfolder named after the resort inside the root folder
    const resortName = formData.get("resortName") || "Unknown Resort";
    const subFolderId = await createSubfolder(
      drive,
      resortName,
      process.env.GOOGLE_DRIVE_FOLDER_ID
    );

    // ── Step A: Build upload descriptors + validate MIME types ────────────────
    const uploads = [];

    const factSheetFile = formData.get("factSheet");
    if (factSheetFile && factSheetFile.size > 0) {
      if (!ALLOWED_MIME.has(factSheetFile.type)) {
        return NextResponse.json({ error: "Fact sheet must be a PDF file." }, { status: 400 });
      }
      uploads.push({
        key: "factSheet",
        name: factSheetFile.name,
        mimeType: factSheetFile.type,
        bufferPromise: factSheetFile.arrayBuffer().then(ab => Buffer.from(ab)),
      });
    }

    const cancelPolicyFile = formData.get("cancelPolicyFile");
    if (cancelPolicyFile && cancelPolicyFile.size > 0) {
      if (!ALLOWED_MIME.has(cancelPolicyFile.type)) {
        return NextResponse.json({ error: "Cancellation policy must be a PDF or DOCX file." }, { status: 400 });
      }
      uploads.push({
        key: "cancelPolicy",
        name: cancelPolicyFile.name,
        mimeType: cancelPolicyFile.type,
        bufferPromise: cancelPolicyFile.arrayBuffer().then(ab => Buffer.from(ab)),
      });
    }

    // Upload files concurrently (files.create only — permissions set in Step B)
    const uploadResults = await Promise.all(
      uploads.map(async ({ key, name, mimeType, bufferPromise }) => {
        const buffer = await bufferPromise;
        const { fileId, webViewLink } = await uploadToDrive(drive, buffer, name, mimeType, subFolderId);
        return { key, name, fileId, webViewLink };
      })
    );

    const factSheetResult    = uploadResults.find(r => r.key === "factSheet");
    const cancelPolicyResult = uploadResults.find(r => r.key === "cancelPolicy");

    // ── Step B: Set file permissions + save to MongoDB simultaneously ──────────
    // permissions.create (B1) and LodgeApplication.create (B2) have no dependency
    // on each other — MongoDB only needs the webViewLinks already returned in Step A.
    const [, application] = await Promise.all([
      // B1: Grant "Anyone with the link" on each uploaded file (required on Shared Drive)
      Promise.all(uploadResults.map(r => setFilePublic(drive, r.fileId))),

      // B2: Save application to MongoDB
      LodgeApplication.create({
        // Section 1
        email:       formData.get("email"),
        fullName:    formData.get("fullName"),
        resortName:  formData.get("resortName"),
        website:     formData.get("website") || undefined,
        mainContact: formData.get("mainContact"),

        // Section 2
        address:        formData.get("address"),
        mapsLink:       formData.get("mapsLink") || undefined,
        numberOfRooms:  Number(formData.get("numberOfRooms")) || undefined,
        resortCategory: formData.get("resortCategory"),
        roomTypes:      formData.get("roomTypes"),
        mealPlans:      formData.getAll("mealPlans"),

        // Section 3
        originStory:          formData.get("originStory"),
        natureBlend:          formData.get("natureBlend"),
        naturalistPhilosophy: formData.get("naturalistPhilosophy"),
        afterSafariVibe:      formData.get("afterSafariVibe"),
        conservation:         formData.get("conservation"),
        uniquePoints:         formData.get("uniquePoints"),

        // Section 4
        mediaLink:             formData.get("mediaLink"),
        factSheetDriveLink:    factSheetResult?.webViewLink    ?? null,
        factSheetFileName:     factSheetResult?.name           ?? null,
        paymentMethod:         formData.get("paymentMethod"),
        cancelPolicyDriveLink: cancelPolicyResult?.webViewLink ?? null,
        cancelPolicyFileName:  cancelPolicyResult?.name        ?? null,
        cancelPolicyText:      formData.get("cancelPolicyText") || undefined,
      }),
    ]);

    // Mark invite as used so the link can't be resubmitted
    await InviteToken.findByIdAndUpdate(invite._id, {
      used:         true,
      usedAt:       new Date(),
      submissionId: application._id,
    });

    return NextResponse.json(
      { success: true, id: application._id },
      { status: 201 }
    );
  } catch (error) {
    console.error("[register-lodge] POST error:", error);
    return NextResponse.json(
      { error: error.message || "Submission failed. Please try again." },
      { status: 500 }
    );
  }
}
