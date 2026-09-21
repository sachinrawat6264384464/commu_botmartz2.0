import { NextResponse } from "next/server";
import { adminDb, hasAdminCredentials } from "@/lib/firebase-admin";
import { fetchDocsFromFirestoreRest } from "@/lib/firestore-rest";
import { ARENA_PROJECTS } from "@/lib/arena-projects";

export async function GET() {
  try {
    let enrollments: any[] = [];
    let recentLogs: any[] = [];
    let recentBugs: any[] = [];
    let recentClaims: any[] = [];

    if (adminDb && hasAdminCredentials) {
      try {
        const enrollSnap = await adminDb.collection("arena_enrollments").get();
        if (!enrollSnap.empty) {
          enrollments = enrollSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        }

        const logsSnap = await adminDb.collection("arena_daily_logs").orderBy("submittedAt", "desc").limit(50).get();
        if (!logsSnap.empty) {
          recentLogs = logsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        }

        const bugsSnap = await adminDb.collection("arena_bug_reports").orderBy("submittedAt", "desc").limit(30).get();
        if (!bugsSnap.empty) {
          recentBugs = bugsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        }

        const claimsSnap = await adminDb.collection("arena_referral_claims").orderBy("submittedAt", "desc").limit(30).get();
        if (!claimsSnap.empty) {
          recentClaims = claimsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        }
      } catch (dbErr) {
        console.error("Firestore arena stats warning:", dbErr);
      }
    }

    // Direct Firestore Database REST API Fallback
    if (enrollments.length === 0) {
      enrollments = await fetchDocsFromFirestoreRest("arena_enrollments");
    }
    if (recentLogs.length === 0) {
      recentLogs = await fetchDocsFromFirestoreRest("arena_daily_logs");
    }
    if (recentBugs.length === 0) {
      recentBugs = await fetchDocsFromFirestoreRest("arena_bug_reports");
    }
    if (recentClaims.length === 0) {
      recentClaims = await fetchDocsFromFirestoreRest("arena_referral_claims");
    }

    const totalEnrolled = enrollments.length;
    const totalLogs = recentLogs.length;
    const totalBugs = recentBugs.length;
    const totalClaims = recentClaims.length;
    const gthApplicants = enrollments.filter(e => e.difficulty === "Expert Tier" || e.difficulty === "Go To Hell 💀" || e.projectId === "p10" || e.projectId === "p40" || e.projectId === "p50").length;

    // Dynamic Role Distribution
    const roleCounts: Record<string, number> = {
      "Backend Dev": 0,
      "AI Engineer": 0,
      "Frontend Dev": 0,
      "Cloud DevOps": 0,
      "Pen-tester": 0,
      "QA Tester": 0,
      "Product Manager": 0,
    };

    for (const e of enrollments) {
      if (e.role) {
        roleCounts[e.role] = (roleCounts[e.role] || 0) + 1;
      }
    }

    return NextResponse.json({
      success: true,
      stats: {
        totalEnrolled,
        totalLogs,
        totalBugs,
        gthApplicants,
        totalClaims,
        roleCounts,
        totalProjects: ARENA_PROJECTS.length,
      },
      enrollments,
      recentLogs,
      recentBugs,
      recentClaims,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to fetch arena statistics." },
      { status: 500 }
    );
  }
}
