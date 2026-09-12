import { NextResponse } from "next/server";
import { adminDb, hasAdminCredentials } from "@/lib/firebase-admin";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { registrationId, attendance } = body;

    if (!registrationId) {
      return NextResponse.json({ success: false, error: "Registration ID is required." }, { status: 400 });
    }

    const newStatus = Boolean(attendance);

    if (adminDb && hasAdminCredentials) {
      try {
        await adminDb.collection("bootcamp_registrations").doc(registrationId).set(
          { attendance: newStatus, attended: newStatus },
          { merge: true }
        );
      } catch (e) {}
    }

    return NextResponse.json({
      success: true,
      registrationId,
      attendance: newStatus,
      message: `Check-in status updated to ${newStatus ? "Attended" : "Pending"}.`
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
