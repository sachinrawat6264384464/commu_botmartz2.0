import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function GET(req: Request) {
  try {
    let customProjects: any[] = [];
    if (adminDb) {
      const snap = await adminDb.collection("custom_arena_projects").orderBy("createdAt", "desc").get();
      customProjects = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    }
    return NextResponse.json({ success: true, customProjects });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to fetch projects." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const {
      title,
      tagline,
      difficulty,
      domain,
      techStack,
      targetRoles,
      overview,
      architectureNotes,
      databaseSchema,
      durationDays,
    } = body;

    if (!title || !tagline || !overview) {
      return NextResponse.json({ error: "Title, tagline, and overview are required." }, { status: 400 });
    }

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const stackArray = Array.isArray(techStack)
      ? techStack
      : (techStack || "").split(",").map((s: string) => s.trim()).filter(Boolean);

    const rolesArray = Array.isArray(targetRoles)
      ? targetRoles
      : (targetRoles || "").split(",").map((r: string) => r.trim()).filter(Boolean);

    const dbSchemaArray = Array.isArray(databaseSchema)
      ? databaseSchema
      : (databaseSchema || "").split("\n").map((s: string) => s.trim()).filter(Boolean);

    const projectData = {
      title: title.trim(),
      slug,
      tagline: tagline.trim(),
      difficulty: difficulty || "Hard",
      domain: domain || "AI Agents & State Machines",
      durationDays: Number(durationDays || 45),
      techStack: stackArray.length ? stackArray : ["Python", "FastAPI", "Docker"],
      targetRoles: rolesArray.length ? rolesArray : ["AI Engineer", "Backend Dev"],
      overview: overview.trim(),
      architectureNotes: architectureNotes || "Production microservice architecture with Docker containerization.",
      databaseSchema: dbSchemaArray.length ? dbSchemaArray : ["CREATE TABLE entities (id UUID PRIMARY KEY, data JSONB);"],
      apiEndpoints: [
        { method: "POST", path: "/api/v1/process", description: "Main asynchronous batch processing pipeline" },
        { method: "GET", path: "/api/v1/health", description: "Healthcheck and p95 latency telemetry" }
      ],
      milestones: {
        week1: "Architecture topology, database schema setup & Docker configuration.",
        week2: "Core algorithm / state machine implementation with latency tests.",
        week3: "Automated test suite achieving sub-150ms SLAs and edge failure simulation.",
        week4: "Cloud deployment, CI/CD pipeline, and public 90s video walkthrough."
      },
      keywords: stackArray,
      isCustom: true,
      status: "Active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    let id = `custom_p_${Date.now()}`;
    if (adminDb) {
      const docRef = await adminDb.collection("custom_arena_projects").add(projectData);
      id = docRef.id;
    }

    return NextResponse.json({
      success: true,
      message: "New Arena Project PRD added successfully to live catalog!",
      projectId: id,
      project: { id, ...projectData },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to create project." }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId");

    if (!projectId) {
      return NextResponse.json({ error: "projectId is required." }, { status: 400 });
    }

    if (adminDb) {
      await adminDb.collection("custom_arena_projects").doc(projectId).delete();
    }

    return NextResponse.json({ success: true, message: "Project deleted successfully." });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to delete project." }, { status: 500 });
  }
}
