import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { ARENA_PROJECTS } from "@/lib/arena-projects";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email")?.toLowerCase().trim();

    if (!email) {
      return NextResponse.json(
        { error: "Email query parameter is required." },
        { status: 400 }
      );
    }

    let enrollments: any[] = [];
    let dailyLogs: any[] = [];
    let referralClaim: any = null;

    if (adminDb) {
      try {
        // Fetch student enrollments
        const enrollSnap = await adminDb
          .collection("arena_enrollments")
          .where("email", "==", email)
          .get();

        if (!enrollSnap.empty) {
          enrollments = enrollSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        }

        // Fetch student daily logs
        const logsSnap = await adminDb
          .collection("arena_daily_logs")
          .where("studentEmail", "==", email)
          .orderBy("submittedAt", "desc")
          .get();

        if (!logsSnap.empty) {
          dailyLogs = logsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        }

        // Fetch referral claim if any
        const claimSnap = await adminDb
          .collection("arena_referral_claims")
          .where("email", "==", email)
          .limit(1)
          .get();

        if (!claimSnap.empty) {
          referralClaim = { id: claimSnap.docs[0].id, ...claimSnap.docs[0].data() };
        }
      } catch (dbErr) {
        console.error("Firestore builder lookup error:", dbErr);
      }
    }

    // Determine distinct projects worked on
    const distinctProjectIds = Array.from(new Set(enrollments.map((e) => e.projectId)));
    const completedProjects = distinctProjectIds.map((pId) => {
      const proj = ARENA_PROJECTS.find((p) => p.id === pId) || {
        id: pId,
        title: "Arena Project",
        difficulty: "Hard",
        domain: "AI & Fullstack",
      };
      const enroll = enrollments.find((e) => e.projectId === pId);
      const projectLogs = dailyLogs.filter((l) => l.projectId === pId);
      return {
        project: proj,
        teamType: enroll?.teamType || "Solo",
        role: enroll?.role || "Developer",
        logsCount: projectLogs.length,
        isCompleted: projectLogs.length >= 1 || enroll?.status === "Completed",
      };
    });

    const soloCount = completedProjects.filter((p) => p.teamType === "Solo").length;
    const squadCount = completedProjects.filter((p) => p.teamType === "Squad").length;
    const totalProjectsCount = completedProjects.length;

    // Determine Shipper Tier
    let tier = "Explorer";
    if (totalProjectsCount >= 3) {
      tier = "Elite Shipper 🚀";
    } else if (totalProjectsCount >= 1) {
      tier = "Production Builder ⚡";
    }

    const isEligibleForReferrals = totalProjectsCount >= 3;

    return NextResponse.json({
      success: true,
      builder: {
        email,
        name: enrollments[0]?.name || "Arena Builder",
        whatsapp: enrollments[0]?.whatsapp || "",
        discord: enrollments[0]?.discord || "",
        github: enrollments[0]?.github || "",
        linkedin: enrollments[0]?.linkedin || "",
        tier,
        totalProjectsCount,
        soloCount,
        squadCount,
        isEligibleForReferrals,
        referralClaim,
        completedProjects,
        totalDailyLogs: dailyLogs.length,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to fetch builder profile." },
      { status: 500 }
    );
  }
}
