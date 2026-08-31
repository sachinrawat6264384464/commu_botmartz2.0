import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { adjustStudentWallet } from "@/lib/wallet";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { checkInCode, email, password } = body;

    if (email !== "botmartz@gmail.com" || password !== "Admin@2026##") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    if (!checkInCode) {
      return NextResponse.json({ error: "Check-in code required" }, { status: 400 });
    }

    if (!adminDb) {
      return NextResponse.json({
        success: true,
        attendee: {
          id: "mock_123",
          name: "Verified Attendee",
          email: "attendee@botmartz.com",
          attendeeType: "Builder Pass"
        }
      });
    }

    const snap = await adminDb.collection("attendees").where("checkInCode", "==", checkInCode.trim().toUpperCase()).get();

    if (snap.empty) {
      return NextResponse.json({ error: "Invalid ticket / check-in code." }, { status: 404 });
    }

    const doc = snap.docs[0];
    const data = doc.data();

    if (data.attended) {
      return NextResponse.json({ 
        error: `Pass already scanned at ${data.checkedInAt?.toDate ? data.checkedInAt.toDate().toLocaleTimeString() : 'earlier'}` 
      }, { status: 400 });
    }

    await doc.ref.update({
      attended: true,
      checkedInAt: new Date()
    });

    // Award +300 to +3,000 Karma Coins for verified physical/virtual attendance
    const awardCoins = Number(data.coinsReward) || (data.tier === "VIP" || data.tier === "HACKATHON_BUILDER" ? 1000 : 300);
    if (data.email) {
      await adjustStudentWallet(
        data.email,
        awardCoins,
        "EARN",
        `Event Attendance Verified: ${data.eventName || "Botmartz Frontier Summit"}`,
        doc.id
      ).catch(() => null);
    }

    return NextResponse.json({
      success: true,
      awardCoins,
      attendee: {
        id: doc.id,
        name: data.name || "Attendee",
        email: data.email,
        attendeeType: data.tier || "General"
      }
    });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
