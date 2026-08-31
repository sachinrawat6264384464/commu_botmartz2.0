import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { adjustStudentWallet } from "@/lib/wallet";

export async function GET(req: NextRequest) {
  try {
    if (!adminDb) {
      return NextResponse.json({ error: "Database not connected" }, { status: 500 });
    }

    const { searchParams } = new URL(req.url);
    const filter = searchParams.get("filter") || "ALL"; // "ALL" | "PENDING" | "VERIFIED" | "SPAM"

    let query: any = adminDb.collection("arena_daily_logs").orderBy("submittedAt", "desc").limit(100);
    if (filter === "PENDING") {
      query = query.where("linkedinStatus", "==", "PENDING_AUDIT");
    } else if (filter === "VERIFIED") {
      query = query.where("linkedinStatus", "==", "VERIFIED");
    } else if (filter === "SPAM") {
      query = query.where("linkedinStatus", "==", "REJECTED_SPAM");
    }

    const snap = await query.get();
    const logs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

    return NextResponse.json({ success: true, logs });
  } catch (err: any) {
    console.error("Admin daily logs fetch error:", err);
    return NextResponse.json({ error: err.message || "Failed to fetch logs" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!adminDb) {
      return NextResponse.json({ error: "Database not connected" }, { status: 500 });
    }

    const body = await req.json();
    const { logId, action, notes } = body; // action: "APPROVE" | "REJECT_SPAM"

    if (!logId || !action) {
      return NextResponse.json({ error: "logId and action are required." }, { status: 400 });
    }

    const logRef = adminDb.collection("arena_daily_logs").doc(logId);
    const logSnap = await logRef.get();

    if (!logSnap.exists) {
      return NextResponse.json({ error: "Log entry not found." }, { status: 404 });
    }

    const logData = logSnap.data() || {};
    const studentEmail = logData.studentEmail;

    if (action === "APPROVE") {
      await logRef.update({
        linkedinStatus: "VERIFIED",
        auditNotes: notes || "Approved by Admin Audit",
        auditedAt: new Date().toISOString()
      });

      return NextResponse.json({
        success: true,
        message: "Log and LinkedIn post marked as Verified."
      });
    } else if (action === "REJECT_SPAM") {
      await logRef.update({
        linkedinStatus: "REJECTED_SPAM",
        auditNotes: notes || "Flagged as invalid/spam URL",
        auditedAt: new Date().toISOString()
      });

      // Deduct the 50 bonus coins if they were previously awarded
      if (studentEmail && logData.linkedinBonus) {
        await adjustStudentWallet(
          studentEmail,
          -Number(logData.linkedinBonus),
          "SPEND",
          `Revoked +50 Karma Coins: LinkedIn post flagged as invalid/spam for Day ${logData.dayNumber} log`,
          `revoked_${logId}`
        );
      }

      return NextResponse.json({
        success: true,
        message: "Log flagged as spam and 50 bonus coins reversed."
      });
    }

    return NextResponse.json({ error: "Invalid action." }, { status: 400 });
  } catch (err: any) {
    console.error("Admin daily log audit error:", err);
    return NextResponse.json({ error: err.message || "Failed to process log audit" }, { status: 500 });
  }
}
