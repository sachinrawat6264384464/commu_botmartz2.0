import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function GET(request: Request) {
  try {
    const snap = await adminDb.collection("showcase").orderBy("upvotes", "desc").limit(50).get();
    const projects = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    return NextResponse.json({ projects });
  } catch (err: any) {
    return NextResponse.json({ projects: [] });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, category, tags, githubUrl, demoUrl, creator } = body;

    if (!title || !description) {
      return NextResponse.json({ error: "Title and description required" }, { status: 400 });
    }

    const docRef = await adminDb.collection("showcase").add({
      title,
      description,
      category: category || "AI Agents",
      tags: tags || [],
      githubUrl: githubUrl || null,
      demoUrl: demoUrl || null,
      creator: creator || { name: "Community Builder", handle: "@builder" },
      upvotes: 1,
      createdAt: new Date()
    });

    return NextResponse.json({ success: true, id: docRef.id });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: "Failed to submit showcase project" }, { status: 500 });
  }
}
