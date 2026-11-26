import { NextRequest, NextResponse } from "next/server";
import { adminDb, hasAdminCredentials } from "@/lib/firebase-admin";
import { ensureDefaultHackathonProjects } from "@/lib/hackathons-server";
import { SOLO_HACKATHON_FEE, TEAM_HACKATHON_FEE } from "@/lib/hackathons";

export async function GET() {
  try {
    const projects = await ensureDefaultHackathonProjects();
    const registrationsByProject: Record<string, any[]> = {};
    let submissions: any[] = [];

    if (adminDb && hasAdminCredentials) {
      const nowMs = Date.now();

      for (const proj of projects) {
        try {
          const regSnap = await adminDb
            .collection("hackathon_projects")
            .doc(proj.id)
            .collection("registrations")
            .get();

          const activeRegs: any[] = [];
          for (const doc of regSnap.docs) {
            const data = doc.data();
            const expMs = new Date(data.expiresAt || 0).getTime();
            if (Number.isFinite(expMs) && nowMs > expMs && !data.submitted) {
              // Auto-delete expired unsubmitted codes (>24h)
              await doc.ref.delete();
            } else {
              activeRegs.push({ id: doc.id, ...data });
            }
          }
          activeRegs.sort(
            (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
          );
          registrationsByProject[proj.id] = activeRegs;
        } catch {
          registrationsByProject[proj.id] = [];
        }
      }

      const subSnap = await adminDb.collection("hackathon_submissions").get();
      submissions = subSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      submissions.sort(
        (a, b) => new Date(b.submittedAt || 0).getTime() - new Date(a.submittedAt || 0).getTime()
      );
    }

    return NextResponse.json({
      success: true,
      projects,
      registrationsByProject,
      submissions,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to load admin hackathon data." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!adminDb || !hasAdminCredentials) {
      return NextResponse.json({ success: false, error: "Database unavailable." }, { status: 503 });
    }

    const body = await req.json();
    const { title, domain, difficulty, tagline, problemStatement, deliverables, techStack, isActive } = body;

    if (!title || !tagline || !problemStatement) {
      return NextResponse.json(
        { success: false, error: "Title, tagline, and problem statement are required." },
        { status: 400 }
      );
    }

    const slug = String(title)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    const id = `hack-${slug}-${Date.now().toString().slice(-4)}`;
    const now = new Date().toISOString();

    const newProject = {
      id,
      title: String(title).trim(),
      domain: String(domain || "AI Systems").trim(),
      difficulty: difficulty || "Hard",
      tagline: String(tagline).trim(),
      problemStatement: String(problemStatement).trim(),
      deliverables: Array.isArray(deliverables)
        ? deliverables
        : String(deliverables || "")
            .split("\n")
            .map((s) => s.trim())
            .filter(Boolean),
      techStack: Array.isArray(techStack)
        ? techStack
        : String(techStack || "")
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
      soloFee: SOLO_HACKATHON_FEE,
      teamFee: TEAM_HACKATHON_FEE,
      isActive: isActive !== false,
      createdAt: now,
      updatedAt: now,
    };

    await adminDb.collection("hackathon_projects").doc(id).set(newProject);
    return NextResponse.json({ success: true, project: newProject });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to create hackathon project." },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    if (!adminDb || !hasAdminCredentials) {
      return NextResponse.json({ success: false, error: "Database unavailable." }, { status: 503 });
    }

    const body = await req.json();

    // Update submission status
    if (body.type === "submission" && body.submissionId) {
      await adminDb.collection("hackathon_submissions").doc(body.submissionId).update({
        status: body.status || "Submitted",
        updatedAt: new Date().toISOString(),
      });
      return NextResponse.json({ success: true });
    }

    // Update hackathon project
    const { id, title, domain, difficulty, tagline, problemStatement, deliverables, techStack, isActive } = body;
    if (!id) {
      return NextResponse.json({ success: false, error: "Project ID is required." }, { status: 400 });
    }

    const updatePayload: Record<string, any> = {
      updatedAt: new Date().toISOString(),
    };
    if (title !== undefined) updatePayload.title = String(title).trim();
    if (domain !== undefined) updatePayload.domain = String(domain).trim();
    if (difficulty !== undefined) updatePayload.difficulty = difficulty;
    if (tagline !== undefined) updatePayload.tagline = String(tagline).trim();
    if (problemStatement !== undefined) updatePayload.problemStatement = String(problemStatement).trim();
    if (isActive !== undefined) updatePayload.isActive = Boolean(isActive);
    if (deliverables !== undefined) {
      updatePayload.deliverables = Array.isArray(deliverables)
        ? deliverables
        : String(deliverables)
            .split("\n")
            .map((s) => s.trim())
            .filter(Boolean);
    }
    if (techStack !== undefined) {
      updatePayload.techStack = Array.isArray(techStack)
        ? techStack
        : String(techStack)
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
    }

    await adminDb.collection("hackathon_projects").doc(id).update(updatePayload);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to update hackathon record." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    if (!adminDb || !hasAdminCredentials) {
      return NextResponse.json({ success: false, error: "Database unavailable." }, { status: 503 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const type = searchParams.get("type") || "project";

    if (!id) {
      return NextResponse.json({ success: false, error: "ID is required." }, { status: 400 });
    }

    if (type === "submission") {
      await adminDb.collection("hackathon_submissions").doc(id).delete();
      return NextResponse.json({ success: true });
    }

    // Delete project and its registrations subcollection
    const projRef = adminDb.collection("hackathon_projects").doc(id);
    const regs = await projRef.collection("registrations").get();
    const batch = adminDb.batch();
    regs.docs.forEach((d) => batch.delete(d.ref));
    batch.delete(projRef);
    await batch.commit();

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to delete hackathon record." },
      { status: 500 }
    );
  }
}
