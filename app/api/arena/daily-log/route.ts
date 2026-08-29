import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const {
      studentEmail,
      studentName,
      projectId,
      projectTitle,
      dayNumber,
      commitUrl,
      researchNotes,
      linkedinPostUrl,
      discordMessageUrl,
      driveFolderUrl,
      blockers,
    } = body;

    if (!studentEmail || !projectId || !dayNumber || !commitUrl) {
      return NextResponse.json(
        { error: "Student email, project, day number, and GitHub commit URL are required." },
        { status: 400 }
      );
    }

    const cleanEmail = studentEmail.trim().toLowerCase();
    const logData = {
      studentEmail: cleanEmail,
      studentName: (studentName || "").trim(),
      projectId,
      projectTitle: projectTitle || "Arena Project",
      dayNumber: Number(dayNumber),
      commitUrl: commitUrl.trim(),
      researchNotes: (researchNotes || "").trim(),
      linkedinPostUrl: (linkedinPostUrl || "").trim(),
      discordMessageUrl: (discordMessageUrl || "").trim(),
      driveFolderUrl: (driveFolderUrl || "https://drive.google.com/drive/folders/1KExMwvCxqd1rn9tgcbIFxAK0vw900CfH").trim(),
      blockers: (blockers || "").trim(),
      submittedAt: new Date().toISOString(),
      score: 10,
      status: "Submitted",
    };

    let logId = `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    if (adminDb) {
      try {
        const docRef = await adminDb.collection("arena_daily_logs").add(logData);
        logId = docRef.id;

        // Try updating enrollment streak
        const enrollSnap = await adminDb
          .collection("arena_enrollments")
          .where("email", "==", cleanEmail)
          .where("projectId", "==", projectId)
          .limit(1)
          .get();

        if (!enrollSnap.empty) {
          const enrollDoc = enrollSnap.docs[0];
          const currentStreak = enrollDoc.data().streak || 0;
          const currentXp = enrollDoc.data().xp || 100;
          await enrollDoc.ref.update({
            streak: currentStreak + 1,
            xp: currentXp + 50,
            lastSubmittedAt: new Date().toISOString(),
          });
        }
      } catch (dbErr) {
        console.error("Firestore daily log write warning:", dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Day ${dayNumber} Proof-of-Work successfully logged!`,
      logId,
      log: logData,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to submit daily proof of work." },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email")?.toLowerCase().trim();
    const projectId = searchParams.get("projectId");

    let logs: any[] = [];

    if (adminDb) {
      try {
        let query: any = adminDb.collection("arena_daily_logs").orderBy("submittedAt", "desc").limit(50);
        if (email) {
          query = query.where("studentEmail", "==", email);
        }
        if (projectId) {
          query = query.where("projectId", "==", projectId);
        }
        const snap = await query.get();
        logs = snap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
      } catch (dbErr) {
        console.error("Firestore daily logs query warning:", dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      logs,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to fetch logs." },
      { status: 500 }
    );
  }
}
