import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const challengeId = searchParams.get("challengeId");

    let query = adminDb.collection("challenges_submissions").orderBy("submittedAt", "desc");
    
    if (challengeId && challengeId !== "all") {
      query = query.where("challengeId", "==", challengeId) as any;
    }

    const snap = await query.get();
    const submissions = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({
      success: true,
      count: submissions.length,
      submissions,
    });
  } catch (err: any) {
    console.error("List challenges submissions error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to load challenge submissions" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, status, score, adminNotes } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Missing submission ID" }, { status: 400 });
    }

    const updates: Record<string, any> = {
      updatedAt: new Date().toISOString(),
    };

    if (status !== undefined) updates.status = status;
    if (score !== undefined) updates.score = Number(score);
    if (adminNotes !== undefined) updates.adminNotes = String(adminNotes);

    await adminDb.collection("challenges_submissions").doc(id).update(updates);

    return NextResponse.json({
      success: true,
      message: `Submission ${id} updated successfully.`,
      updates,
    });
  } catch (err: any) {
    console.error("Update challenge submission error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to update submission" },
      { status: 500 }
    );
  }
}
