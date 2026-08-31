import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const filter = searchParams.get("filter") || "ALL";

    if (!adminDb) {
      return NextResponse.json({ error: "Database unavailable" }, { status: 500 });
    }

    const activities: any[] = [];

    // 1. Daily Logs
    if (filter === "ALL" || filter === "DAILY_LOGS") {
      const logsSnap = await adminDb
        .collection("arena_daily_logs")
        .orderBy("createdAt", "desc")
        .limit(25)
        .get();

      logsSnap.docs.forEach((d) => {
        const data = d.data();
        activities.push({
          id: `log-${d.id}`,
          type: "DAILY_LOG",
          title: `Day ${data.dayNumber} Standup: ${data.projectTitle || "Arena PRD"}`,
          userEmail: data.email,
          userName: data.studentName || data.email?.split("@")[0],
          details: data.description || "Daily proof-of-work commit",
          commitUrl: data.commitUrl,
          reward: `+${data.coinsAwarded || 50} Coins`,
          timestamp: data.createdAt || data.submittedAt || new Date().toISOString()
        });
      });
    }

    // 2. Wallet Transactions (Credits, Debits, Hint Unlocks)
    if (filter === "ALL" || filter === "WALLET") {
      const walletSnap = await adminDb
        .collection("wallet_transactions")
        .orderBy("createdAt", "desc")
        .limit(25)
        .get();

      walletSnap.docs.forEach((d) => {
        const data = d.data();
        activities.push({
          id: `tx-${d.id}`,
          type: "WALLET_TX",
          title: data.type === "EARN" ? "Karma Coins Credited" : "Karma Coins Debited",
          userEmail: data.email,
          userName: data.email?.split("@")[0],
          details: data.reason || "Wallet transaction",
          reward: data.type === "EARN" ? `+${data.amount} Coins` : `-${data.amount} Coins`,
          timestamp: data.createdAt || new Date().toISOString()
        });
      });
    }

    // 3. Project Enrollments & Unenrollments
    if (filter === "ALL" || filter === "ENROLLMENTS") {
      const enrollSnap = await adminDb
        .collection("arena_enrollments")
        .orderBy("createdAt", "desc")
        .limit(25)
        .get();

      enrollSnap.docs.forEach((d) => {
        const data = d.data();
        activities.push({
          id: `enroll-${d.id}`,
          type: "ENROLLMENT",
          title: `Enrolled in ${data.projectTitle || data.projectId}`,
          userEmail: data.email,
          userName: data.studentName || data.email?.split("@")[0],
          details: `Role Track: ${data.roleTrack || "Core Software"} • Tier: ${data.tier || "Standard"}`,
          timestamp: data.createdAt || new Date().toISOString()
        });
      });
    }

    // 4. Custom Project Proposals
    if (filter === "ALL" || filter === "PROPOSALS") {
      const propSnap = await adminDb
        .collection("custom_projects")
        .orderBy("createdAt", "desc")
        .limit(20)
        .get();

      propSnap.docs.forEach((d) => {
        const data = d.data();
        activities.push({
          id: `prop-${d.id}`,
          type: "CUSTOM_PROPOSAL",
          title: `Custom PRD Proposed: ${data.projectTitle}`,
          userEmail: data.email,
          userName: data.name || data.email?.split("@")[0],
          details: `Domain: ${data.domain} • Target: ${data.targetCompanies || "Top Tech"}`,
          timestamp: data.createdAt || new Date().toISOString()
        });
      });
    }

    // Sort all activities by timestamp descending
    activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return NextResponse.json({
      success: true,
      activities: activities.slice(0, 50)
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
