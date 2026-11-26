import { NextRequest, NextResponse } from "next/server";
import { adminDb, hasAdminCredentials } from "@/lib/firebase-admin";
import { findRegistrationByCode } from "@/lib/hackathons-server";

export async function POST(req: NextRequest) {
  try {
    const { uniqueCode } = await req.json();
    const cleanCode = String(uniqueCode || "").trim().toUpperCase();

    if (!cleanCode) {
      return NextResponse.json(
        { success: false, valid: false, error: "Please enter your Unique ID." },
        { status: 400 }
      );
    }

    if (!adminDb || !hasAdminCredentials) {
      return NextResponse.json(
        { success: false, valid: false, error: "Database connection unavailable." },
        { status: 503 }
      );
    }

    const found = await findRegistrationByCode(cleanCode);
    if (!found) {
      return NextResponse.json(
        { success: false, valid: false, error: "Invalid Unique ID or 24-hour window already expired." },
        { status: 404 }
      );
    }

    const reg = found.data;
    const nowMs = Date.now();
    const expiresMs = new Date(reg.expiresAt).getTime();

    if (!Number.isFinite(expiresMs) || nowMs > expiresMs) {
      // Auto-delete expired record from the project's registrations table
      await found.ref.delete();
      return NextResponse.json(
        {
          success: false,
          valid: false,
          expired: true,
          error: "Invalid Code: 24-hour window expired and this code has been removed from the database.",
        },
        { status: 410 }
      );
    }

    // Check if already submitted in hackathon_submissions
    const subSnap = await adminDb.collection("hackathon_submissions").doc(cleanCode).get();

    return NextResponse.json({
      success: true,
      valid: true,
      alreadySubmitted: subSnap.exists,
      registration: {
        uniqueCode: reg.uniqueCode,
        projectId: reg.projectId,
        projectTitle: reg.projectTitle,
        mode: reg.mode,
        teamName: reg.teamName,
        leaderName: reg.leader?.name || reg.teamName,
        leaderEmail: reg.leader?.email || "",
        expiresAt: reg.expiresAt,
      },
    });
  } catch (err: any) {
    console.error("lookup-code error:", err);
    return NextResponse.json(
      { success: false, valid: false, error: err.message || "Failed to verify Unique ID." },
      { status: 500 }
    );
  }
}
