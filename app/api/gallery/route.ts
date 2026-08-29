import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

const DEFAULT_GALLERY_IMAGES = [
  {
    id: "g1",
    url: "/gallery/event-1.png",
    title: "AI Frontier Summit Keynote & Stage Panel",
    category: "AI Frontier",
    caption: "Packed auditorium listening to real-world Enterprise RAG deployment case studies and LangGraph architectures.",
    createdAt: "2026-08-20"
  },
  {
    id: "g2",
    url: "/gallery/event-2.png",
    title: "Community Builder Spotlight & Speaker Session",
    category: "AI Frontier",
    caption: "Technical speaker delivering insights on deterministic agent workflows, state recovery, and inference benchmarking.",
    createdAt: "2026-08-20"
  },
  {
    id: "g3",
    url: "/gallery/event-3.png",
    title: "Hands-on AI Engineering Code Lab",
    category: "Workshops",
    caption: "Engineers collaborating on deterministic state checkpoints, tool calling error handling, and sandbox runs.",
    createdAt: "2026-07-15"
  },
  {
    id: "g4",
    url: "/gallery/event-4.png",
    title: "Pre-Summit Hack Night & Builder Networking",
    category: "Community Meetups",
    caption: "Informal networking, open-source brainstorming, and hack sprints between developers from 15+ cities.",
    createdAt: "2026-08-19"
  },
  {
    id: "g5",
    url: "/gallery/event-5.png",
    title: "Agent Challenge Demo Day Presentations",
    category: "AI Frontier",
    caption: "Finalist teams demonstrating autonomous agents executing complex financial and legal extraction pipelines.",
    createdAt: "2026-06-25"
  },
  {
    id: "g6",
    url: "/gallery/event-6.png",
    title: "Hybrid RAG & Vector Indexing Cohort",
    category: "Workshops",
    caption: "Benchmarking dense embeddings against BM25 Reciprocal Rank Fusion on large real-world doc datasets.",
    createdAt: "2026-07-22"
  },
  {
    id: "g7",
    url: "/gallery/event-7.png",
    title: "AI Frontier Summit Delegate Group & Community Gathering",
    category: "AI Frontier",
    caption: "Community builders, founders, students, and enterprise architects celebrating applied AI innovation.",
    createdAt: "2026-08-20"
  },
  {
    id: "g8",
    url: "/gallery/event-8.png",
    title: "Live Agent State Machine Architecture Breakdown",
    category: "Workshops",
    caption: "Interactive breakdown of checkpoint persistence in PostgreSQL and human-in-the-loop pause nodes.",
    createdAt: "2026-08-20"
  },
  {
    id: "g9",
    url: "/gallery/event-9.png",
    title: "Fireside Keynote: Future of Autonomous Multi-Agent Swarms",
    category: "AI Frontier",
    caption: "Keynote presentation on real-time agent observability, evaluation frameworks, and latency optimization.",
    createdAt: "2026-08-20"
  },
  {
    id: "g10",
    url: "/gallery/event-10.png",
    title: "Behind The Scenes: Speaker Stage Setup & AV Prep",
    category: "Behind The Scenes",
    caption: "Technical checks, wireless mic calibration, and live streaming setup before the keynote hall opened.",
    createdAt: "2026-08-20"
  },
  {
    id: "g11",
    url: "/gallery/event-11.png",
    title: "Developer Hackathon Workspace & Team Collaboration",
    category: "Workshops",
    caption: "Teams coding 48-hour sprint projects with cash prizes and cloud infrastructure credits.",
    createdAt: "2026-06-24"
  },
  {
    id: "g12",
    url: "/gallery/event-12.png",
    title: "AI Summit Speaker Panel & Applied Research Discussion",
    category: "AI Frontier",
    caption: "Distinguished panel discussion on open-weight SLMs, on-device WebGPU inference, and production agent safety.",
    createdAt: "2026-08-20"
  }
];

export async function GET() {
  try {
    let images = [...DEFAULT_GALLERY_IMAGES];

    try {
      if (adminDb) {
        const snap = await adminDb.collection("gallery").orderBy("createdAt", "desc").get();
        if (!snap.empty) {
          const dbImages = snap.docs.map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              url: data.url || "",
              title: data.title || "Community Moment",
              category: data.category || "AI Frontier",
              caption: data.caption || "",
              createdAt: data.createdAt || new Date().toISOString()
            };
          });
          images = [...dbImages, ...DEFAULT_GALLERY_IMAGES];
        }
      }
    } catch (e) {
      // Fall back to default images
    }

    return NextResponse.json({
      success: true,
      images
    });
  } catch (error: any) {
    return NextResponse.json({
      success: true,
      images: DEFAULT_GALLERY_IMAGES
    });
  }
}
