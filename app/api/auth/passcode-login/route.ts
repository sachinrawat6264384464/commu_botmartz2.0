import { NextResponse } from "next/server";
import { adminDb, hasAdminCredentials } from "@/lib/firebase-admin";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, passcode } = body;

    if (!email || typeof email !== "string" || !email.trim()) {
      return NextResponse.json(
        { success: false, error: "Validation Error: Please enter your email address." },
        { status: 400 }
      );
    }

    if (!passcode || typeof passcode !== "string" || !passcode.trim()) {
      return NextResponse.json(
        { success: false, error: "Validation Error: Please enter your Passcode / Access Code." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const cleanPasscode = passcode.trim().toUpperCase();

    let matchedUserDoc: any = null;

    if (adminDb && hasAdminCredentials) {
      try {
        // Query users, bootcamp_registrations, and student_profiles collections
        const [usersSnap, regSnap, profileSnap] = await Promise.all([
          adminDb.collection("users").where("email", "==", normalizedEmail).get(),
          adminDb.collection("bootcamp_registrations").where("email", "==", normalizedEmail).get(),
          adminDb.collection("student_profiles").where("email", "==", normalizedEmail).get(),
        ]);

        const allDocs = [
          ...usersSnap.docs.map((d) => d.data()),
          ...regSnap.docs.map((d) => d.data()),
          ...profileSnap.docs.map((d) => d.data()),
        ];

        for (const docData of allDocs) {
          const storedPasscode = (docData.passcode || docData.checkInCode || docData.code || "").toString().trim().toUpperCase();
          if (storedPasscode && (storedPasscode === cleanPasscode || storedPasscode === `BM-${cleanPasscode}`)) {
            matchedUserDoc = docData;
            break;
          }
        }
      } catch (dbErr: any) {
        console.error("Passcode auth Firestore error:", dbErr);
      }
    }

    // Fallback check if Firestore matching found user or if test/demo match
    if (matchedUserDoc) {
      return NextResponse.json({
        success: true,
        message: "Authenticated successfully with Passcode",
        user: {
          email: matchedUserDoc.email || normalizedEmail,
          displayName: matchedUserDoc.name || matchedUserDoc.displayName || "Builder",
          passcode: matchedUserDoc.passcode || matchedUserDoc.checkInCode || cleanPasscode,
          plan: matchedUserDoc.plan || "bundle",
          karmaCoins: matchedUserDoc.karmaCoins ?? 100,
        },
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: "Invalid email or Passcode. Please check the Passcode sent in your Welcome Email.",
      },
      { status: 400 }
    );
  } catch (err: any) {
    console.error("Passcode auth unexpected error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "An unexpected authentication error occurred." },
      { status: 500 }
    );
  }
}
