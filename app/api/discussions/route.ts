import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function GET(request: Request) {
  try {
    const snap = await adminDb.collection("discussions").orderBy("createdAt", "desc").limit(50).get();
    const discussions = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    return NextResponse.json({ discussions });
  } catch (err: any) {
    return NextResponse.json({ discussions: [] });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, content, channel, tags, author } = body;

    if (!title || !content) {
      return NextResponse.json({ error: "Title and content required" }, { status: 400 });
    }

    const docRef = await adminDb.collection("discussions").add({
      title,
      content,
      channel: channel || "general",
      tags: tags || [],
      author: author || { name: "Community Member", handle: "@builder" },
      upvotes: 1,
      replies: 0,
      createdAt: new Date()
    });

    return NextResponse.json({ success: true, id: docRef.id });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create discussion post" }, { status: 500 });
  }
}
