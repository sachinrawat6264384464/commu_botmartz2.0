import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const {
      challengeId,
      challengeTitle,
      type = "submission", // "registration" | "submission"
      teamName,
      teamSize = "1",
      leadName,
      leadEmail,
      leadPhone = "",
      discordHandle = "",
      githubHandle = "",
      projectTitle = "",
      projectPitch = "",
      techStack = [],
      githubUrl = "",
      demoUrl = "",
      videoUrl = "",
      agreedToRules = true,
    } = data;

    if (!leadName || !leadEmail || !challengeId) {
      return NextResponse.json(
        { error: "Missing required participant information (Name, Email, Challenge ID)." },
        { status: 400 }
      );
    }

    const payload = {
      challengeId,
      challengeTitle: challengeTitle || "AI Challenge",
      type,
      teamName: teamName || `${leadName}'s Team`,
      teamSize: String(teamSize),
      leadName: leadName.trim(),
      leadEmail: leadEmail.trim().toLowerCase(),
      leadPhone: leadPhone.trim(),
      discordHandle: discordHandle.trim(),
      githubHandle: githubHandle.trim(),
      projectTitle: projectTitle.trim(),
      projectPitch: projectPitch.trim(),
      techStack: Array.isArray(techStack) ? techStack : [techStack].filter(Boolean),
      githubUrl: githubUrl.trim(),
      demoUrl: demoUrl.trim(),
      videoUrl: videoUrl.trim(),
      agreedToRules: Boolean(agreedToRules),
      status: "Submitted", // Submitted, Under Review, Shortlisted, Winner, Rejected
      score: 0,
      adminNotes: "",
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const docRef = await adminDb.collection("challenges_submissions").add(payload);

    return NextResponse.json({
      success: true,
      id: docRef.id,
      message: "Challenge entry successfully registered and submitted!",
      submission: { id: docRef.id, ...payload },
    });
  } catch (err: any) {
    console.error("Challenge submit error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to submit challenge entry." },
      { status: 500 }
    );
  }
}
