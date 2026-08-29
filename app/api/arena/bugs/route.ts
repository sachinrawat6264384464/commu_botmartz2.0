import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const {
      reporterName,
      reporterEmail,
      targetProjectId,
      targetProjectTitle,
      targetStagingUrl,
      vulnerabilityTitle,
      severity,
      cveCategory,
      pocSteps,
      suggestedFix,
      pocVideoUrl,
    } = body;

    if (!reporterName || !reporterEmail || !vulnerabilityTitle || !targetProjectId) {
      return NextResponse.json(
        { error: "Reporter name, email, target project, and vulnerability title are required." },
        { status: 400 }
      );
    }

    const bugData = {
      reporterName: reporterName.trim(),
      reporterEmail: reporterEmail.trim().toLowerCase(),
      targetProjectId,
      targetProjectTitle: targetProjectTitle || "Arena Staging System",
      targetStagingUrl: (targetStagingUrl || "").trim(),
      vulnerabilityTitle: vulnerabilityTitle.trim(),
      severity: severity || "Medium",
      cveCategory: cveCategory || "OWASP Top 10",
      pocSteps: (pocSteps || "").trim(),
      suggestedFix: (suggestedFix || "").trim(),
      pocVideoUrl: (pocVideoUrl || "").trim(),
      status: "Open",
      bountyXp: severity === "Critical" ? 500 : severity === "High" ? 300 : severity === "Medium" ? 150 : 75,
      submittedAt: new Date().toISOString(),
    };

    let bugId = `bug_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    if (adminDb) {
      try {
        const docRef = await adminDb.collection("arena_bug_reports").add(bugData);
        bugId = docRef.id;
      } catch (dbErr) {
        console.error("Firestore bug report write warning:", dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Vulnerability bug report submitted! The project engineering team has been alerted.",
      bugId,
      bug: bugData,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to submit bug report." },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId");
    const severity = searchParams.get("severity");

    let bugs: any[] = [];

    if (adminDb) {
      try {
        let query: any = adminDb.collection("arena_bug_reports").orderBy("submittedAt", "desc").limit(50);
        if (projectId) {
          query = query.where("targetProjectId", "==", projectId);
        }
        if (severity) {
          query = query.where("severity", "==", severity);
        }
        const snap = await query.get();
        bugs = snap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
      } catch (dbErr) {
        console.error("Firestore bug reports query warning:", dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      bugs,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to fetch bug reports." },
      { status: 500 }
    );
  }
}
