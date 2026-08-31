import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function GET(req: Request) {
  try {
    if (!adminDb) {
      return NextResponse.json({ requests: [] });
    }
    const snap = await adminDb.collection("squad_requests").orderBy("createdAt", "desc").limit(30).get();
    const requests = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate().toISOString() : doc.data().createdAt
    }));
    return NextResponse.json({ success: true, requests });
  } catch (err: any) {
    return NextResponse.json({ requests: [] });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { name, email, projectTitle, myRole, lookingFor, contactHandle, contactPlatform, pitch } = body;

    if (!name || !projectTitle || !myRole || !lookingFor) {
      return NextResponse.json({ error: "Please fill out all required fields." }, { status: 400 });
    }

    if (!adminDb) {
      return NextResponse.json({ success: true, message: "Mock squad request posted." });
    }

    const docRef = await adminDb.collection("squad_requests").add({
      name: name.trim(),
      email: email?.trim() || "",
      projectTitle: projectTitle.trim(),
      myRole: myRole.trim(),
      lookingFor: Array.isArray(lookingFor) ? lookingFor : [lookingFor],
      contactHandle: contactHandle?.trim() || "@builder",
      contactPlatform: contactPlatform || "Discord",
      pitch: pitch?.trim() || "Building a high-throughput production AI system.",
      status: "OPEN",
      createdAt: new Date().toISOString()
    });

    return NextResponse.json({ success: true, id: docRef.id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to post squad request." }, { status: 500 });
  }
}
