import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { id, delta } = body;

    if (!id || typeof id !== "string") {
      return NextResponse.json({ success: false, error: "Project ID is required." }, { status: 400 });
    }

    const change = delta === -1 ? -1 : 1;

    if (adminDb && !id.startsWith("proj-")) {
      try {
        const docRef = adminDb.collection("showcase").doc(id);
        const docSnap = await docRef.get();
        if (docSnap.exists) {
          const currentVotes = docSnap.data()?.upvotes || 0;
          const newVotes = Math.max(0, currentVotes + change);
          await docRef.update({
            upvotes: newVotes,
            updatedAt: new Date().toISOString()
          });
          return NextResponse.json({ success: true, upvotes: newVotes });
        }
      } catch (dbErr) {
        console.warn("Firestore showcase upvote update error:", dbErr);
      }
    }

    return NextResponse.json({ success: true, message: "Upvote acknowledged" });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Failed to update upvote" }, { status: 500 });
  }
}
