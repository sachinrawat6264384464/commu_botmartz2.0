import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Engineer & Software Roles Roadmap 2026 — 6-Stage Career Blueprints",
  description:
    "Explore 6-stage progressive roadmaps for AI/ML Systems Engineers, Agentic AI Architects, Low-Latency Rust Engineers, and Cybersecurity Red-Teamers. Master key skills and link to 50 production PRDs.",
  keywords: [
    "AI engineer roadmap 2026",
    "machine learning roadmap",
    "AI engineering career checklist",
    "agentic AI architect roadmap",
    "PyTorch to LangGraph roadmap",
    "Botmartz arena roadmaps",
  ],
  alternates: {
    canonical: "/arena/roadmaps",
  },
  openGraph: {
    title: "AI Engineer & Software Roles Roadmap 2026 | Botmartz Arena",
    description:
      "Stage-by-stage engineering roadmaps connecting foundational math, PyTorch, RAG, and agent swarms directly to production PRDs.",
    url: "https://community.botmartz.com/arena/roadmaps",
    images: [{ url: "/logo.png", width: 1200, height: 630 }],
  },
};

export default function RoadmapsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
