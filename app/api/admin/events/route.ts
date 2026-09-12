import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

const DEFAULT_EVENTS = [
  {
    id: "ai-frontier-2026",
    title: "AI Frontier 2026 — The Future of AI Engineering",
    slug: "ai-frontier-2026",
    description: "Central India's largest flagship Artificial Intelligence summit gathering 500+ student builders, researchers & founders. Featuring keynotes on Enterprise RAG, LangGraph agents, and retrieval architectures.",
    date: "August 23, 2026",
    location: "Indore, India / Hybrid Stream",
    status: "upcoming",
    category: "Conference",
    coverImage: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80",
    createdAt: "2026-01-15T00:00:00.000Z",
  },
  {
    id: "ai-accelerator-workshop",
    title: "Hands-on AI Accelerator Bootcamp & Certificate Showcase",
    slug: "ai-accelerator-workshop",
    description: "4-week live intensive workshop series building full-stack LLM apps, RAG pipelines, and agentic workflows with cryptographically verified credentials.",
    date: "September 15, 2026",
    location: "Online & Indore AI Lab",
    status: "monthly",
    category: "Bootcamp Series",
    coverImage: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&q=80",
    createdAt: "2026-02-01T00:00:00.000Z",
  },
  {
    id: "open-source-ai-hackathon-2026",
    title: "Central India Open-Source AI Hackathon 2026",
    slug: "open-source-ai-hackathon-2026",
    description: "36-hour non-stop AI buildathon where teams build production agents, fine-tuned models, and developer tools with 1,000,000+ Karma coin pool rewards.",
    date: "October 10-12, 2026",
    location: "Indore Tech Park & Discord",
    status: "upcoming",
    category: "Hackathon",
    coverImage: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=1200&q=80",
    createdAt: "2026-02-10T00:00:00.000Z",
  },
  {
    id: "ai-engineers-monthly-meetup",
    title: "Indore AI Engineers Monthly Teardown & AMA",
    slug: "ai-engineers-monthly-meetup",
    description: "Monthly community meetup bringing together engineers to tear down real-world AI PRDs, discuss vector search optimizations, and network.",
    date: "First Saturday of Every Month",
    location: "Botmartz Campus, Indore",
    status: "monthly",
    category: "Meetup",
    coverImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80",
    createdAt: "2026-02-15T00:00:00.000Z",
  },
  {
    id: "paper-reading-club-deepseek",
    title: "DeepSeek-V3 & Reasoning Models Research Teardown",
    slug: "paper-reading-club-deepseek",
    description: "Deep-dive technical paper reading session analyzing Mixture of Experts (MoE), Multi-head Latent Attention (MLA), and reinforcement learning techniques.",
    date: "July 28, 2026",
    location: "Botmartz Discord Voice Stage",
    status: "completed",
    category: "Research Club",
    coverImage: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1200&q=80",
    createdAt: "2026-02-20T00:00:00.000Z",
  },
];

export async function GET() {
  try {
    let events = [];
    try {
      const snap = await adminDb.collection("events").get();
      events = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (e) {
      console.warn("Firestore events fetch warning:", e);
    }

    if (events.length === 0) {
      events = DEFAULT_EVENTS;
    }

    return NextResponse.json({ success: true, events });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to fetch events." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, title, slug, description, date, location, status, category, coverImage } = body;

    if (!title || !slug) {
      return NextResponse.json(
        { success: false, error: "Title and slug are required." },
        { status: 400 }
      );
    }

    const eventData = {
      title: title.trim(),
      slug: slug.trim().toLowerCase(),
      description: description ? description.trim() : "",
      date: date ? date.trim() : "TBD",
      location: location ? location.trim() : "Online",
      status: status || "upcoming",
      category: category || "Conference",
      coverImage: coverImage || "",
      updatedAt: new Date().toISOString(),
    };

    let docId = id;
    if (docId) {
      await adminDb.collection("events").doc(docId).set(eventData, { merge: true });
    } else {
      const created = await adminDb.collection("events").add({
        ...eventData,
        createdAt: new Date().toISOString(),
      });
      docId = created.id;
    }

    return NextResponse.json({
      success: true,
      event: { id: docId, ...eventData },
      message: "Event saved successfully.",
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to save event." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, error: "Event ID required." }, { status: 400 });
    }

    await adminDb.collection("events").doc(id).delete();
    return NextResponse.json({ success: true, message: "Event deleted." });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
