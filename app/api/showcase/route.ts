import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function GET(request: Request) {
  try {
    if (!adminDb) {
      return NextResponse.json({ success: true, projects: [] });
    }

    let snap;
    try {
      snap = await adminDb.collection("showcase").orderBy("createdAt", "desc").limit(100).get();
    } catch (orderErr) {
      console.warn("Showcase order by error, falling back to simple fetch:", orderErr);
      snap = await adminDb.collection("showcase").limit(100).get();
    }

    const projects = snap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        title: data.title || "",
        description: data.description || "",
        category: data.category || "AI Agents",
        tags: Array.isArray(data.tags) ? data.tags : [],
        builtWith: Array.isArray(data.builtWith) ? data.builtWith : (Array.isArray(data.tags) ? data.tags : []),
        githubUrl: data.githubUrl || undefined,
        demoUrl: data.demoUrl || undefined,
        creator: data.creator || { name: "Community Builder", handle: "@builder" },
        upvotes: typeof data.upvotes === "number" ? data.upvotes : 1,
        featured: Boolean(data.featured),
        createdAt: data.createdAt ? (typeof data.createdAt === "string" ? data.createdAt : new Date(data.createdAt.toDate?.() || data.createdAt).toISOString()) : new Date().toISOString()
      };
    });

    return NextResponse.json({ success: true, projects });
  } catch (err: any) {
    console.error("Showcase GET error:", err);
    return NextResponse.json({ success: false, error: err.message || "Failed to fetch showcase projects", projects: [] }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { title, description, category, tags, builtWith, githubUrl, demoUrl, creator } = body;

    if (!title || typeof title !== "string" || !title.trim()) {
      return NextResponse.json({ success: false, error: "Project title is required." }, { status: 400 });
    }

    if (!description || typeof description !== "string" || !description.trim()) {
      return NextResponse.json({ success: false, error: "Project description is required." }, { status: 400 });
    }

    const cleanTags = (Array.isArray(tags) ? tags : typeof tags === "string" ? tags.split(",") : [])
      .map((t: string) => t.trim())
      .filter(Boolean);

    const cleanBuiltWith = (Array.isArray(builtWith) ? builtWith : typeof builtWith === "string" ? builtWith.split(",") : cleanTags)
      .map((t: string) => t.trim())
      .filter(Boolean);

    const projectData = {
      title: title.trim(),
      description: description.trim(),
      category: category || "AI Agents",
      tags: cleanTags.length > 0 ? cleanTags : ["Next.js", "Python"],
      builtWith: cleanBuiltWith.length > 0 ? cleanBuiltWith : ["Next.js", "Python"],
      githubUrl: githubUrl && typeof githubUrl === "string" ? githubUrl.trim() : null,
      demoUrl: demoUrl && typeof demoUrl === "string" ? demoUrl.trim() : null,
      creator: creator && typeof creator === "object" ? {
        name: creator.name || "Community Builder",
        handle: creator.handle || "@builder"
      } : { name: "Community Builder", handle: "@builder" },
      upvotes: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    let docId = `proj_${Date.now()}`;

    if (adminDb) {
      const docRef = await adminDb.collection("showcase").add(projectData);
      docId = docRef.id;
    }

    return NextResponse.json({
      success: true,
      id: docId,
      project: { id: docId, ...projectData }
    });
  } catch (err: any) {
    console.error("Showcase POST error:", err);
    return NextResponse.json({ success: false, error: err.message || "Failed to submit showcase project" }, { status: 500 });
  }
}

