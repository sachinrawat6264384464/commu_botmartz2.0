import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const timeRange = searchParams.get("timeRange") || "30d";

    let totalStudents = 0;
    let totalEnrollments = 0;
    let totalDailyLogs = 0;
    let totalPassRevenue = 0;
    let totalPaidOrders = 0;
    let totalUgcSubmissions = 0;
    let totalDiscussions = 0;
    let totalEventsRsvps = 0;

    let difficultyBreakdown: Record<string, number> = {
      Intermediate: 0,
      Hard: 0,
      Insane: 0,
      "Expert Tier": 0,
    };

    let roleDistribution: Record<string, number> = {};
    let collegeDistribution: Record<string, number> = {};
    let cityDistribution: Record<string, number> = {};
    let recentActivity: any[] = [];

    if (adminDb) {
      try {
        // 1. Registered Student Profiles
        const studentsSnap = await adminDb.collection("student_profiles").get();
        totalStudents = studentsSnap.size;

        studentsSnap.docs.forEach((doc) => {
          const data = doc.data();
          if (data.collegeName) {
            const col = data.collegeName.trim();
            collegeDistribution[col] = (collegeDistribution[col] || 0) + 1;
          }
          if (data.degreeBranch) {
            const role = data.degreeBranch.trim();
            roleDistribution[role] = (roleDistribution[role] || 0) + 1;
          }
        });

        // 2. Arena Project Enrollments
        const enrollmentsSnap = await adminDb.collection("arena_enrollments").get();
        totalEnrollments = enrollmentsSnap.size;

        enrollmentsSnap.docs.forEach((doc) => {
          const data = doc.data();
          const diff = data.difficulty || "Hard";
          difficultyBreakdown[diff] = (difficultyBreakdown[diff] || 0) + 1;

          if (data.role) {
            const role = data.role.trim();
            roleDistribution[role] = (roleDistribution[role] || 0) + 1;
          }

          if (data.isPaidInternship || data.tier === "Verified Fellow") {
            totalPaidOrders += 1;
          }
        });

        // 3. Daily Logs
        const logsSnap = await adminDb.collection("arena_daily_logs").get().catch(() => ({ size: 0, docs: [] } as any));
        totalDailyLogs = logsSnap.size;

        // Fallback or additional check for daily_logs
        if (totalDailyLogs === 0) {
          const altLogs = await adminDb.collection("daily_logs").get().catch(() => ({ size: 0, docs: [] } as any));
          totalDailyLogs = altLogs.size;
        }

        // 4. Payments & Pass Revenue
        const paymentsSnap = await adminDb.collection("payments").get().catch(() => ({ docs: [] } as any));
        paymentsSnap.docs?.forEach((doc: any) => {
          const data = doc.data();
          if (data.status === "captured" || data.status === "paid" || data.status === "verified") {
            const amt = Number(data.amount || data.amountPaid || 0);
            totalPassRevenue += amt > 1000 ? amt / 100 : amt; // Handle paise vs rupees
            totalPaidOrders += 1;
          }
        });

        // Check event orders collection
        const ordersSnap = await adminDb.collection("orders").get().catch(() => ({ docs: [] } as any));
        ordersSnap.docs?.forEach((doc: any) => {
          const data = doc.data();
          if (data.status === "paid" || data.paymentStatus === "paid") {
            const amt = Number(data.amount || 0);
            totalPassRevenue += amt > 1000 ? amt / 100 : amt;
          }
        });

        // 5. Career Checklists & UGC Submissions
        const checklistSnap = await adminDb.collection("career_checklists").get().catch(() => ({ docs: [] } as any));
        checklistSnap.docs?.forEach((doc: any) => {
          const data = doc.data();
          if (data.ugcSubmissions && Array.isArray(data.ugcSubmissions)) {
            totalUgcSubmissions += data.ugcSubmissions.length;
          }
        });

        // 6. Discussions
        const discSnap = await adminDb.collection("discussions").get().catch(() => ({ size: 0 } as any));
        totalDiscussions = discSnap.size;

        // 7. Event Registrations
        const eventRegSnap = await adminDb.collection("event_registrations").get().catch(() => ({ size: 0 } as any));
        totalEventsRsvps = eventRegSnap.size;

        // 8. Recent Activity Ledger
        const recentEnrollments = await adminDb
          .collection("arena_enrollments")
          .orderBy("createdAt", "desc")
          .limit(10)
          .get()
          .catch(() => ({ docs: [] } as any));

        recentActivity = recentEnrollments.docs.map((d: any) => ({
          id: d.id,
          type: "ENROLLMENT",
          ...d.data(),
        }));
      } catch (dbErr) {
        console.error("Firestore analytics aggregation warning:", dbErr);
      }
    }

    // Format Top Colleges
    const sortedColleges = Object.entries(collegeDistribution)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    // Format Top Roles
    const sortedRoles = Object.entries(roleDistribution)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    return NextResponse.json({
      success: true,
      timeRange,
      metrics: {
        totalStudents,
        totalEnrollments,
        totalDailyLogs,
        totalPassRevenue: Math.round(totalPassRevenue),
        totalPaidOrders,
        totalUgcSubmissions,
        totalDiscussions,
        totalEventsRsvps,
        difficultyBreakdown,
        sortedColleges,
        sortedRoles,
        recentActivity,
        syncedAt: new Date().toISOString(),
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to generate deep analytics." },
      { status: 500 }
    );
  }
}
