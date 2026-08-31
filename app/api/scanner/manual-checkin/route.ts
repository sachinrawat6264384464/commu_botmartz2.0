import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { adjustStudentWallet } from "@/lib/wallet";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { registrationId, email, password } = body;

    if (email !== "botmartz@gmail.com" || password !== "Admin@2026##") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    if (!registrationId) {
      return NextResponse.json({ error: "Registration ID required" }, { status: 400 });
    }

    if (!adminDb) {
      return NextResponse.json({ success: true });
    }

    const docRef = adminDb.collection("attendees").doc(registrationId);
    const snap = await docRef.get();
    
    if (snap.exists) {
      const data = snap.data();
      await docRef.update({
        attended: true,
        checkedInAt: new Date()
      });

      // Award Karma Coins for verified attendance
      const awardCoins = Number(data?.coinsReward) || (data?.tier === "VIP" || data?.tier === "HACKATHON_BUILDER" ? 1000 : 300);
      if (data?.email) {
        await adjustStudentWallet(
          data.email,
          awardCoins,
          "EARN",
          `Event Attendance Verified (Manual Desk): ${data?.eventName || "Botmartz Summit"}`,
          registrationId
        ).catch(() => null);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: "Check-in failed" }, { status: 500 });
  }
}
