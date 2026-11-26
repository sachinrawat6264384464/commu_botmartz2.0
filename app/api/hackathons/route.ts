import { NextResponse } from "next/server";
import { ensureDefaultHackathonProjects } from "@/lib/hackathons-server";

export async function GET() {
  try {
    const allProjects = await ensureDefaultHackathonProjects();
    const activeProjects = allProjects.filter((p) => p.isActive !== false);
    return NextResponse.json({ success: true, projects: activeProjects });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to load hackathons." },
      { status: 500 }
    );
  }
}
