import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function POST(request: Request) {
  try {
    const { email, badgeId, badgeIds } = await request.json();

    if (!email || (!badgeId && (!badgeIds || badgeIds.length === 0))) {
      return NextResponse.json(
        { success: false, error: "Email and badge selection are required." },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const toClaim: string[] = Array.isArray(badgeIds) && badgeIds.length > 0 ? badgeIds : [badgeId];

    if (adminDb) {
      try {
        const userRef = adminDb.collection("users").doc(cleanEmail);
        const userDoc = await userRef.get();

        let currentClaimed: string[] = [];
        if (userDoc.exists) {
          currentClaimed = userDoc.data()?.claimedBadges || [];
        }

        for (const id of toClaim) {
          if (!currentClaimed.includes(id)) {
            currentClaimed.push(id);
          }
        }

        await userRef.set(
          {
            claimedBadges: currentClaimed,
            updatedAt: new Date().toISOString()
          },
          { merge: true }
        );

        // Also update student_profiles
        const profileSnap = await adminDb.collection("student_profiles").where("email", "==", cleanEmail).limit(1).get();
        if (!profileSnap.empty) {
          await profileSnap.docs[0].ref.set(
            { claimedBadges: currentClaimed, updatedAt: new Date().toISOString() },
            { merge: true }
          );
        }

        return NextResponse.json({
          success: true,
          claimedBadges: currentClaimed,
          message: `Successfully claimed ${toClaim.length} badge(s)!`
        });
      } catch (dbErr) {
        console.warn("Firestore badge claim warning:", dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      claimedBadges: toClaim,
      message: `Badges claimed locally.`
    });
  } catch (err: any) {
    console.error("Badge claim error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to claim badges." },
      { status: 500 }
    );
  }
}

