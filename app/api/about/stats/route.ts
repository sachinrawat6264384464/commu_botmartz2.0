import { NextResponse } from "next/server";
import { adminDb, hasAdminCredentials } from "@/lib/firebase-admin";
import { BOTMARTZ_TEAM } from "@/lib/team";

export const dynamic = "force-dynamic";

async function safeCount(collectionName: string): Promise<number> {
  if (!adminDb || !hasAdminCredentials) return 0;
  try {
    const snap = await Promise.race([
      adminDb.collection(collectionName).count().get(),
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error("timeout")), 2500)),
    ]);
    return snap.data().count || 0;
  } catch {
    return 0;
  }
}

export async function GET() {
  try {
    const [
      enrollmentsCount,
      showcaseCount,
      workshopsCount,
      discussionsCount,
      dailyLogsCount,
      arenaProjectsCount,
    ] = await Promise.all([
      safeCount("arena_enrollments"),
      safeCount("showcase_projects"),
      safeCount("managed_workshops"),
      safeCount("discussions"),
      safeCount("daily_logs"),
      safeCount("arena_projects"),
    ]);

    return NextResponse.json({
      success: true,
      stats: {
        registeredMembers: enrollmentsCount,
        publishedProjects: showcaseCount + arenaProjectsCount,
        completedWorkshops: workshopsCount,
        activeMentors: BOTMARTZ_TEAM.length,
        communityContributions: dailyLogsCount + discussionsCount,
      },
    });
  } catch {
    return NextResponse.json({
      success: true,
      stats: {
        registeredMembers: 0,
        publishedProjects: 0,
        completedWorkshops: 0,
        activeMentors: BOTMARTZ_TEAM.length,
        communityContributions: 0,
      },
    });
  }
}
