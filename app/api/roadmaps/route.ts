import { NextResponse } from "next/server";
import { ensureManagedRoadmaps } from "@/lib/roadmaps-server";

export async function GET() {
  try {
    const allRoadmaps = await ensureManagedRoadmaps();
    const active = allRoadmaps.filter((r) => r.isActive !== false);

    // For paid roadmaps, strip full stages payload from public listing so locked content
    // is only delivered after Unique Code verification.
    const safeRoadmaps = active.map((r) => {
      if (!r.isPaid) return r;
      return {
        ...r,
        stages: r.stages.map((s) => ({
          stageNumber: s.stageNumber,
          stageName: s.stageName,
          duration: s.duration,
          focus: "Unlock with Unique Code to view full syllabus, skills & deliverables.",
          coreSkills: [],
          deliverables: [],
          recommendedProjectIds: [],
        })),
      };
    });

    return NextResponse.json({ success: true, roadmaps: safeRoadmaps });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to load career roadmaps." },
      { status: 500 }
    );
  }
}
