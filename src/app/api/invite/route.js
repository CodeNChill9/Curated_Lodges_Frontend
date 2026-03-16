import { NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/mongodb";
import InviteToken from "@/models/InviteToken";

// ── Helper: verify admin key ──────────────────────────────────────────────────
function isAdmin(req) {
  const key = req.headers.get("x-admin-key");
  return key && key === process.env.ADMIN_SECRET;
}

// ── GET /api/invite?token=xxx  →  validate a token (public)
// ── GET /api/invite            →  list all invites (admin only)
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  await connectDB();

  // ── Validate a specific token (public — used by the form page) ────────────
  if (token) {
    const invite = await InviteToken.findOne({ token }).lean();
    if (!invite) {
      return NextResponse.json({ valid: false, reason: "not_found" }, { status: 404 });
    }
    if (invite.used) {
      return NextResponse.json({ valid: false, reason: "already_used" });
    }
    if (invite.expiresAt && invite.expiresAt < new Date()) {
      return NextResponse.json({ valid: false, reason: "expired" });
    }
    return NextResponse.json({ valid: true });
  }

  // ── List all invites (admin only) ─────────────────────────────────────────
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const invites = await InviteToken.find({}).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ invites });
}

// ── POST /api/invite  →  create an invite link (admin only) ──────────────────
// Body (JSON): { label?: string, email?: string, expiresInDays?: number }
// Headers:     x-admin-key: <ADMIN_SECRET>
export async function POST(req) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const { label = "", email = "", expiresInDays } = body;

  await connectDB();

  let slugLabel = label ? label.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') : '';
  let token = slugLabel ? slugLabel : crypto.randomBytes(24).toString('hex');
  let isUnique = false;
  let counter = 1;
  let baseToken = token;
  while (!isUnique) {
    const existing = await InviteToken.findOne({ token });
    if (existing) {
      if (!slugLabel) { token = crypto.randomBytes(24).toString('hex'); }
      else { token = `${baseToken}-${counter}`; counter++; }
    } else {
      isUnique = true;
    }
  }
  const expiresAt = expiresInDays
    ? new Date(Date.now() + Number(expiresInDays) * 24 * 60 * 60 * 1000)
    : null;

  const invite = await InviteToken.create({ token, label, email, expiresAt });

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const inviteUrl = `${baseUrl}/register-lodge?invite=${token}`;

  return NextResponse.json(
    {
      token:     invite.token,
      inviteUrl,
      label:     invite.label,
      email:     invite.email,
      expiresAt: invite.expiresAt,
      createdAt: invite.createdAt,
    },
    { status: 201 }
  );
}

// ── DELETE /api/invite?token=xxx  →  revoke/delete an invite (admin only) ────
export async function DELETE(req) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");
  if (!token) {
    return NextResponse.json({ error: "token param required" }, { status: 400 });
  }

  await connectDB();
  const result = await InviteToken.deleteOne({ token });
  if (result.deletedCount === 0) {
    return NextResponse.json({ error: "Token not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}

