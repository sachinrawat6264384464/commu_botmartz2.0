import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      studentName,
      studentEmail,
      college,
      githubUsername,
      projectTitle,
      domain,
      techStack,
      prdMarkdown,
      githubRepo,
      dpdpConsent
    } = body;

    if (!studentName || !studentEmail || !projectTitle || !prdMarkdown) {
      return NextResponse.json(
        { error: "Missing required proposal fields (Name, Email, Title, PRD Markdown)." },
        { status: 400 }
      );
    }

    if (!dpdpConsent) {
      return NextResponse.json(
        { error: "Explicit DPDP Act consent is mandatory." },
        { status: 400 }
      );
    }

    const cleanEmail = studentEmail.toLowerCase().trim();

    if (!adminDb) {
      return NextResponse.json({
        success: true,
        message: "Proposal received in local simulation mode.",
        proposalId: "sim_proposal_" + Date.now()
      });
    }

    const proposalRef = await adminDb.collection("arena_custom_proposals").add({
      studentName: studentName.trim(),
      studentEmail: cleanEmail,
      college: college?.trim() || "Engineering College",
      githubUsername: githubUsername?.trim() || "",
      projectTitle: projectTitle.trim(),
      domain: domain || "Custom Frontier Domain",
      techStack: Array.isArray(techStack) ? techStack : [techStack || "Python/Rust"],
      prdMarkdown: prdMarkdown.trim(),
      githubRepo: githubRepo?.trim() || "",
      status: "under_review",
      submittedAt: new Date(),
      dpdpConsentGiven: true,
      dpdpConsentTimestamp: new Date().toISOString()
    });

    return NextResponse.json({
      success: true,
      message: "Custom engineering proposal submitted successfully to Founder Soham Sharma!",
      proposalId: proposalRef.id
    });
  } catch (error: any) {
    console.error("Custom proposal submission error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to submit proposal." },
      { status: 500 }
    );
  }
}
