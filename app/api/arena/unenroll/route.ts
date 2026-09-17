import { NextResponse } from "next/server";
import { adminDb, hasAdminCredentials } from "@/lib/firebase-admin";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { email, enrollmentId, projectId } = body;

    const cleanEmail = email?.toLowerCase()?.trim();

    if (!cleanEmail || (!enrollmentId && !projectId)) {
      return NextResponse.json(
        { error: "Email and enrollmentId or projectId are required to unenroll." },
        { status: 400 }
      );
    }

    if (!adminDb || !hasAdminCredentials) {
      return NextResponse.json({ success: true, message: "Unenrolled successfully (mock mode)." });
    }

    if (enrollmentId) {
      // Verify ownership before deleting
      const docRef = adminDb.collection("arena_enrollments").doc(enrollmentId);
      const docSnap = await docRef.get();

      if (docSnap.exists) {
        const data = docSnap.data();
        if (data?.email?.toLowerCase() === cleanEmail) {
          await docRef.delete();
          return NextResponse.json({ success: true, message: "Successfully unenrolled from project track." });
        }
      }
    }

    if (projectId) {
      const snap = await adminDb
        .collection("arena_enrollments")
        .where("email", "==", cleanEmail)
        .where("projectId", "==", projectId)
        .get();

      const batch = adminDb.batch();
      snap.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });
      await batch.commit();

      return NextResponse.json({ success: true, message: "Successfully unenrolled from project." });
    }

    return NextResponse.json({ success: true, message: "Unenrollment completed." });
  } catch (err: any) {
    console.error("Unenroll API error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to unenroll from project." },
      { status: 500 }
    );
  }
}
