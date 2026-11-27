import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { getAllArenaProjectsFromDb } from "@/lib/arena-projects-server";
import { getDefaultArenaProjectImage } from "@/lib/arena-project-images";

export const dynamic = "force-dynamic";

const COLLECTION_NAME = "arena_projects";

function parseCommaList(val: unknown, fallback: string[]): string[] {
  if (Array.isArray(val)) {
    const cleaned = val.map((v) => String(v).trim()).filter(Boolean);
    return cleaned.length ? cleaned : fallback;
  }
  if (typeof val === "string") {
    const cleaned = val.split(",").map((s) => s.trim()).filter(Boolean);
    return cleaned.length ? cleaned : fallback;
  }
  return fallback;
}

function parseLineList(val: unknown, fallback: string[]): string[] {
  if (Array.isArray(val)) {
    const cleaned = val.map((v) => String(v).trim()).filter(Boolean);
    return cleaned.length ? cleaned : fallback;
  }
  if (typeof val === "string") {
    const cleaned = val.split("\n").map((s) => s.trim()).filter(Boolean);
    return cleaned.length ? cleaned : fallback;
  }
  return fallback;
}

export async function GET() {
  try {
    const projects = await getAllArenaProjectsFromDb();
    const customProjects = projects.filter((p) => p.isCustom);
    return NextResponse.json({
      success: true,
      projects,
      customProjects,
    });
  } catch (err: any) {
    return NextResponse.json({ success: true, projects: [], customProjects: [] });
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
      imageUrl,
    } = body;

    if (!title || !tagline || !overview) {
      return NextResponse.json({ error: "Title, tagline, and overview are required." }, { status: 400 });
    }

    const resolvedDomain = domain || "AI Agents & State Machines";
    const slug = `${title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")}-${Date.now().toString().slice(-4)}`;

    const stackArray = parseCommaList(techStack, ["Python", "FastAPI", "Docker"]);
    const rolesArray = parseCommaList(targetRoles, ["AI Engineer", "Backend Dev"]);
    const dbSchemaArray = parseLineList(databaseSchema, [
      "entities (id UUID PRIMARY KEY, data JSONB, created_at TIMESTAMP)",
    ]);

    const id = `arena_p_${Date.now()}`;
    const now = new Date().toISOString();

    const projectData = {
      id,
      title: String(title).trim(),
      slug,
      tagline: String(tagline).trim(),
      imageUrl: String(imageUrl || "").trim() || getDefaultArenaProjectImage(resolvedDomain),
      difficulty: difficulty || "Hard",
      domain: resolvedDomain,
      durationDays: Number(durationDays || 45),
      techStack: stackArray,
      partnerTools: stackArray.slice(0, 4),
      targetRoles: rolesArray,
      overview: String(overview).trim(),
      architectureNotes:
        String(architectureNotes || "").trim() ||
        "Production microservice architecture with Docker containerization and observability.",
      databaseSchema: dbSchemaArray,
      apiEndpoints: [
        { method: "POST", path: "/api/v1/process", description: "Main asynchronous batch processing pipeline" },
        { method: "GET", path: "/api/v1/health", description: "Healthcheck and p95 latency telemetry" },
      ],
      milestones: [
        {
          phase: "Phase 1: Core Architecture & Schema",
          days: "Days 1-10",
          goal: "Architecture topology, database schema setup & Docker configuration.",
          deliverables: ["Database migrations", "Docker Compose stack", "API contract tests"],
        },
        {
          phase: "Phase 2: Core Pipeline Implementation",
          days: "Days 11-22",
          goal: "Core algorithm / state machine implementation with latency benchmarks.",
          deliverables: ["Core service engine", "Unit & integration suite"],
        },
        {
          phase: "Phase 3: Reliability & SLA Hardening",
          days: "Days 23-35",
          goal: "Automated test suite achieving sub-150ms SLAs and edge failure simulation.",
          deliverables: ["Load test report", "Circuit breaker & retry handlers"],
        },
        {
          phase: "Phase 4: Cloud Deployment & Demo",
          days: "Days 36-45",
          goal: "Cloud deployment, CI/CD pipeline, and public 90s video walkthrough.",
          deliverables: ["Live deployed URL", "Public GitHub repository"],
        },
      ],
      evaluationCriteria: [
        { metric: "System Correctness & Edge Handling", weight: 40, description: "Passes all automated integration and failure-recovery gates." },
        { metric: "Latency & Throughput SLA", weight: 30, description: "Meets p95 latency and concurrency benchmarks." },
        { metric: "Architecture & Code Quality", weight: 20, description: "Clean modular structure, schema design, and API contracts." },
        { metric: "Daily Ship Logs", weight: 10, description: "Consistent proof-of-work commits and documentation." },
      ],
      learningResources: [],
      strictTestCommand: "pytest -v --maxfail=1",
      acceptanceGates: [
        { rule: "p95 Latency", threshold: "< 200ms", description: "Primary inference/API endpoint responds under 200ms at p95." },
        { rule: "Zero Unhandled Exceptions", threshold: "100%", description: "Graceful error responses for malformed payloads." },
      ],
      productionSla: "99.9% uptime, < 200ms p95 API latency",
      keywords: stackArray,
      isCustom: true,
      orderIndex: -1,
      status: "Active",
      createdAt: now,
      updatedAt: now,
    };

    if (adminDb) {
      await adminDb.collection(COLLECTION_NAME).doc(id).set(projectData);
    }

    return NextResponse.json({
      success: true,
      message: "New Arena Project PRD saved to Firestore database!",
      projectId: id,
      project: projectData,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to create project." }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const {
      id,
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
      imageUrl,
    } = body;

    if (!id) {
      return NextResponse.json({ error: "Project id is required for update." }, { status: 400 });
    }
    if (!title || !tagline || !overview) {
      return NextResponse.json({ error: "Title, tagline, and overview are required." }, { status: 400 });
    }

    const resolvedDomain = domain || "AI Agents & State Machines";
    const updates: Record<string, any> = {
      title: String(title).trim(),
      tagline: String(tagline).trim(),
      difficulty: difficulty || "Hard",
      domain: resolvedDomain,
      durationDays: Number(durationDays || 45),
      techStack: parseCommaList(techStack, ["Python", "FastAPI", "Docker"]),
      targetRoles: parseCommaList(targetRoles, ["AI Engineer", "Backend Dev"]),
      overview: String(overview).trim(),
      architectureNotes: String(architectureNotes || "").trim(),
      databaseSchema: parseLineList(databaseSchema, []),
      imageUrl: String(imageUrl || "").trim() || getDefaultArenaProjectImage(resolvedDomain),
      updatedAt: new Date().toISOString(),
    };

    if (adminDb) {
      await adminDb.collection(COLLECTION_NAME).doc(String(id)).set(updates, { merge: true });
    }

    return NextResponse.json({
      success: true,
      message: "Arena Project updated in Firestore database!",
      projectId: id,
      updates,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to update project." }, { status: 500 });
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
      await adminDb.collection(COLLECTION_NAME).doc(projectId).delete().catch(() => null);
      await adminDb.collection("custom_arena_projects").doc(projectId).delete().catch(() => null);
    }

    return NextResponse.json({ success: true, message: "Project deleted from database successfully." });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to delete project." }, { status: 500 });
  }
}
