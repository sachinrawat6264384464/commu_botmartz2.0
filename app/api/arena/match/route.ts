import { NextResponse } from "next/server";
import { matchResumeToArenaProjects } from "@/lib/resume-matcher";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { resumeText } = body;

    if (!resumeText || typeof resumeText !== "string" || resumeText.trim().length < 10) {
      return NextResponse.json(
        { error: "Please provide valid resume text or upload a readable PDF document." },
        { status: 400 }
      );
    }

    const analysis = matchResumeToArenaProjects(resumeText);

    return NextResponse.json({
      success: true,
      analysis,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to analyze resume." },
      { status: 500 }
    );
  }
}
