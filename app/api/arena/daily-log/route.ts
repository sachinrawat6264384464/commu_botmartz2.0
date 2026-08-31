import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { adjustStudentWallet } from "@/lib/wallet";

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
      isLearningPause,
      learningTopic
    } = body;

    if (!studentEmail || !projectId || !dayNumber || !commitUrl) {
      return NextResponse.json(
        { error: "Student email, project selection, day number, and GitHub commit URL are required." },
        { status: 400 }
      );
    }

    const cleanEmail = studentEmail.trim().toLowerCase();
    const cleanCommit = commitUrl.trim();
    const cleanLinkedin = (linkedinPostUrl || "").trim();
    const hasLinkedin = cleanLinkedin.length > 10 && cleanLinkedin.includes("linkedin.com");

    // Base reward: +20 coins for commit log. Extra +50 coins if LinkedIn post attached.
    let baseCoins = 20;
    let linkedinBonus = hasLinkedin ? 50 : 0;
    let totalCoinsAwarded = baseCoins + linkedinBonus;

    const logData = {
      studentEmail: cleanEmail,
      studentName: (studentName || "Builder").trim(),
      projectId,
      projectTitle: projectTitle || "Arena Production System",
      dayNumber: Number(dayNumber),
      commitUrl: cleanCommit,
      researchNotes: (researchNotes || "").trim(),
      linkedinPostUrl: cleanLinkedin,
      linkedinStatus: hasLinkedin ? "PENDING_AUDIT" : "NONE", // "PENDING_AUDIT" | "VERIFIED" | "REJECTED_SPAM" | "NONE"
      discordMessageUrl: (discordMessageUrl || "").trim(),
      driveFolderUrl: (driveFolderUrl || "").trim(),
      blockers: (blockers || "").trim(),
      isLearningPause: Boolean(isLearningPause),
      learningTopic: (learningTopic || "").trim(),
      coinsAwarded: totalCoinsAwarded,
      baseCoins,
      linkedinBonus,
      submittedAt: new Date().toISOString(),
      status: "Verified",
    };

    let logId = `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    if (adminDb) {
      try {
        const docRef = await adminDb.collection("arena_daily_logs").add(logData);
        logId = docRef.id;

        // 1. Award Karma Coins via Atomic Transaction
        await adjustStudentWallet(
          cleanEmail,
          totalCoinsAwarded,
          "EARN",
          `Day ${dayNumber} Proof-of-Work Log${hasLinkedin ? " (+50 LinkedIn Bonus)" : ""}: ${projectTitle || projectId}`,
          logId
        );

        // 2. Update Enrollment Streak and XP
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
            lastDayLogged: Number(dayNumber)
          });
        }
      } catch (dbErr) {
        console.error("Firestore daily log write warning:", dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Day ${dayNumber} Proof-of-Work logged! Earned +${totalCoinsAwarded} Karma Coins.`,
      logId,
      log: logData,
      coinsAwarded: totalCoinsAwarded,
      hasLinkedinBonus: hasLinkedin
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
    const status = searchParams.get("status");

    let logs: any[] = [];

    if (adminDb) {
      try {
        let query: any = adminDb.collection("arena_daily_logs").orderBy("submittedAt", "desc").limit(100);
        if (email) {
          query = query.where("studentEmail", "==", email);
        }
        if (projectId) {
          query = query.where("projectId", "==", projectId);
        }
        if (status) {
          query = query.where("linkedinStatus", "==", status);
        }
        const snap = await query.get();
        logs = snap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
      } catch (dbErr) {
        console.warn("Firestore daily logs query index fallback:", dbErr);
        let query: any = adminDb.collection("arena_daily_logs");
        if (email) query = query.where("studentEmail", "==", email);
        if (projectId) query = query.where("projectId", "==", projectId);
        const snap = await query.get();
        logs = snap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
        logs.sort((a, b) => new Date(b.submittedAt || 0).getTime() - new Date(a.submittedAt || 0).getTime());
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
