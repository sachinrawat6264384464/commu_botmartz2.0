import { NextResponse } from "next/server";
import { getAllArenaProjectsFromDb } from "@/lib/arena-projects-server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const projects = await getAllArenaProjectsFromDb();
    return NextResponse.json({
      success: true,
      projects,
      total: projects.length,
    });
  } catch (err: any) {
    console.error("[Arena Projects GET] Error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to load arena projects." },
      { status: 500 }
    );
  }
}
