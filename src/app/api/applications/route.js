import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import LodgeApplication from "@/models/LodgeApplication";

// ── Helper: verify admin key ──────────────────────────────────────────
function isAdmin(req) {
  const key = req.headers.get("x-admin-key");
  return key && key === process.env.ADMIN_SECRET;
}

// ── GET /api/applications  →  list all applications (admin only) ──
export async function GET(req) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const applications = await LodgeApplication.find({}).sort({ createdAt: -1 }).lean();
  
  return NextResponse.json({ applications });
}
