import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { adjustStudentWallet } from "@/lib/wallet";
import { ARENA_PROJECTS } from "@/lib/arena-projects";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { email, projectId } = body;

    const cleanEmail = email?.toLowerCase()?.trim();
    if (!cleanEmail || !projectId) {
      return NextResponse.json({ error: "Email and projectId are required." }, { status: 400 });
    }

    const project = ARENA_PROJECTS.find((p) => p.id === projectId || p.slug === projectId);
    if (!project) {
      return NextResponse.json({ error: "Project blueprint not found." }, { status: 404 });
    }

    // Determine coin cost: 1000 coins for Baby Step / Easy, 300 coins for others
    const isIntro = project.difficulty === "Baby Step" || project.difficulty === "Easy";
    const coinCost = isIntro ? 1000 : 300;

    const unlockId = `${cleanEmail.replace(/[^a-zA-Z0-9]/g, "_")}_${project.id}`;

    // Check if already unlocked in Firestore
    if (adminDb) {
      const existingSnap = await adminDb.collection("unlocked_project_hints").doc(unlockId).get();
      if (existingSnap.exists) {
        return NextResponse.json({
          success: true,
          alreadyUnlocked: true,
          hint: project.hint || project.architectureNotes || "Follow the step-by-step SDLC and Low-Level Design specs in the PRD.",
          highLevelDesign: project.highLevelDesign,
          lowLevelDesign: project.lowLevelDesign,
          message: "Hint already unlocked!"
        });
      }
    }

    // Atomic wallet deduction
    const adjustment = await adjustStudentWallet(
      cleanEmail,
      coinCost,
      "SPEND",
      `Unlocked Architecture Hint for ${project.title}`,
      project.id
    );

    if (!adjustment.success) {
      return NextResponse.json(
        { error: adjustment.error || `Insufficient Karma Coins. You need ${coinCost} coins to unlock this architectural hint.` },
        { status: 400 }
      );
    }

    // Record unlocked hint in Firestore
    if (adminDb) {
      await adminDb.collection("unlocked_project_hints").doc(unlockId).set({
        email: cleanEmail,
        projectId: project.id,
        projectTitle: project.title,
        costPaid: coinCost,
        unlockedAt: new Date().toISOString()
      });
    }

    return NextResponse.json({
      success: true,
      hint: project.hint || project.architectureNotes || "Follow the step-by-step SDLC and Low-Level Design specs in the PRD.",
      highLevelDesign: project.highLevelDesign,
      lowLevelDesign: project.lowLevelDesign,
      remainingBalance: adjustment.newBalance,
      message: `Unlocked architectural hint! Deducted ${coinCost} Karma Coins.`
    });
  } catch (err: any) {
    console.error("Unlock hint error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to unlock architecture hint." },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email")?.toLowerCase()?.trim();
    const projectId = searchParams.get("projectId");

    if (!email || !projectId) {
      return NextResponse.json({ unlocked: false });
    }

    const unlockId = `${email.replace(/[^a-zA-Z0-9]/g, "_")}_${projectId}`;
    if (adminDb) {
      const snap = await adminDb.collection("unlocked_project_hints").doc(unlockId).get();
      if (snap.exists) {
        const project = ARENA_PROJECTS.find((p) => p.id === projectId || p.slug === projectId);
        return NextResponse.json({
          unlocked: true,
          hint: project?.hint || project?.architectureNotes,
          highLevelDesign: project?.highLevelDesign,
          lowLevelDesign: project?.lowLevelDesign
        });
      }
    }

    return NextResponse.json({ unlocked: false });
  } catch (err: any) {
    return NextResponse.json({ unlocked: false });
  }
}
