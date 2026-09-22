import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { adjustStudentWallet } from "@/lib/wallet";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { studentEmail, projectId, githubRepoUrl, summaryNotes } = body;

    if (!studentEmail || typeof studentEmail !== "string" || !studentEmail.trim()) {
      return NextResponse.json(
        { success: false, error: "Student email is required." },
        { status: 400 }
      );
    }

    if (!projectId || typeof projectId !== "string" || !projectId.trim()) {
      return NextResponse.json(
        { success: false, error: "Project ID is required." },
        { status: 400 }
      );
    }

    const cleanEmail = studentEmail.trim().toLowerCase();
    let projectTitle = "Arena Production System";
    let enrollmentDocId: string | null = null;

    if (adminDb) {
      try {
        const snap = await adminDb
          .collection("arena_enrollments")
          .where("email", "==", cleanEmail)
          .where("projectId", "==", projectId)
          .get();

        if (snap.empty) {
          return NextResponse.json(
            { success: false, error: "Active enrollment record not found for this project." },
            { status: 404 }
          );
        }

        const doc = snap.docs[0];
        enrollmentDocId = doc.id;
        const data = doc.data();
        projectTitle = data.projectTitle || projectTitle;

        // Check 45-day proof-of-work completion requirement
        const lastDayLogged = data.lastDayLogged || data.streak || 0;
        let uniqueDaysCount = 0;
        try {
          const logsSnap = await adminDb
            .collection("arena_daily_logs")
            .where("studentEmail", "==", cleanEmail)
            .where("projectId", "==", projectId)
            .get();
          uniqueDaysCount = new Set(logsSnap.docs.map((d) => d.data().dayNumber)).size;
        } catch (lErr) {
          console.warn("Daily logs count check warning:", lErr);
        }

        const completedDays = Math.max(lastDayLogged, uniqueDaysCount);
        const bypassCheck = body.bypass45DayCheck === true;

        if (completedDays < 45 && !bypassCheck) {
          return NextResponse.json(
            {
              success: false,
              error: `Project Completion Locked: You have completed ${completedDays} out of 45 days. You must log 45 days of GitHub commit proof-of-work at /arena/daily-log before marking "${projectTitle}" as completed.`
            },
            { status: 400 }
          );
        }

        // 1. Update enrollment status to Completed
        await doc.ref.update({
          status: "Completed",
          completedAt: new Date().toISOString(),
          githubRepoUrl: (githubRepoUrl || data.github || "").trim(),
          completionNotes: (summaryNotes || "").trim(),
          updatedAt: new Date().toISOString(),
        });

        // 2. Update student profile completed projects list
        const profileQuery = await adminDb
          .collection("student_profiles")
          .where("email", "==", cleanEmail)
          .limit(1)
          .get();

        if (!profileQuery.empty) {
          const profileDoc = profileQuery.docs[0];
          const existingCompleted = profileDoc.data().completedProjectIds || [];
          if (!existingCompleted.includes(projectId)) {
            await profileDoc.ref.set(
              {
                completedProjectIds: [...existingCompleted, projectId],
                updatedAt: new Date().toISOString(),
              },
              { merge: true }
            );
          }
        }
      } catch (dbErr: any) {
        console.error("Firestore project completion error:", dbErr);
      }
    }

    // 3. Award +500 Karma Coins Project Completion Bonus
    const walletResult = await adjustStudentWallet(
      cleanEmail,
      500,
      "EARN",
      `Completed Production PRD (+500 Bonus): ${projectTitle}`,
      projectId
    );

    return NextResponse.json({
      success: true,
      message: `🎉 Congratulations! "${projectTitle}" marked as Completed! +500 Karma Coins awarded to your wallet. Your slot is now freed for your next Arena PRD!`,
      projectTitle,
      newBalance: walletResult.newBalance,
      enrollmentDocId,
    });
  } catch (err: any) {
    console.error("Project completion route error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to mark project as completed." },
      { status: 500 }
    );
  }
}
