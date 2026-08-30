import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email")?.toLowerCase().trim();

    if (!email) {
      return NextResponse.json({ error: "Email query param is required." }, { status: 400 });
    }

    let checklistData = {
      completedTasks: {},
      submittedUGC: false,
      ugcSubmissions: [],
      pointsEarned: 0,
    };

    if (adminDb) {
      try {
        const docRef = adminDb.collection("career_checklists").doc(email);
        const snap = await docRef.get();
        if (snap.exists) {
          checklistData = { ...checklistData, ...snap.data() };
        }
      } catch (dbErr) {
        console.error("Error reading career checklist:", dbErr);
      }
    }

    return NextResponse.json({ success: true, checklist: checklistData });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to fetch checklist." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { email, name, completedTasks, ugcSubmission } = body;

    if (!email) {
      return NextResponse.json({ error: "Authenticated user email is required." }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    const updatePayload: any = {
      email: cleanEmail,
      name: (name || "Verified Builder").trim(),
      updatedAt: new Date().toISOString(),
    };

    if (completedTasks !== undefined) {
      updatePayload.completedTasks = completedTasks;
    }

    if (ugcSubmission) {
      updatePayload.submittedUGC = true;
      updatePayload.latestUgc = {
        ...ugcSubmission,
        submittedAt: new Date().toISOString(),
        verified: false,
      };
    }

    if (adminDb) {
      try {
        const docRef = adminDb.collection("career_checklists").doc(cleanEmail);
        const snap = await docRef.get();
        
        if (snap.exists) {
          const existing = snap.data() || {};
          const submissions = existing.ugcSubmissions || [];
          if (ugcSubmission) {
            submissions.push({
              ...ugcSubmission,
              submittedAt: new Date().toISOString(),
              verified: false,
            });
            updatePayload.ugcSubmissions = submissions;
            updatePayload.pointsEarned = (existing.pointsEarned || 0) + 50;
          }
          await docRef.set(updatePayload, { merge: true });
        } else {
          updatePayload.createdAt = new Date().toISOString();
          updatePayload.pointsEarned = ugcSubmission ? 50 : 0;
          updatePayload.ugcSubmissions = ugcSubmission ? [{
            ...ugcSubmission,
            submittedAt: new Date().toISOString(),
            verified: false,
          }] : [];
          await docRef.set(updatePayload);
        }
      } catch (dbErr) {
        console.error("Error writing career checklist:", dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: ugcSubmission
        ? "LinkedIn Proof-of-Work submitted and recorded for admin verification (+50 Karma Coins queued)!"
        : "Checklist updated successfully.",
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to update checklist." }, { status: 500 });
  }
}
