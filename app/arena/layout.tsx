import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Engineering Arena & Production System PRDs — Botmartz",
  description:
    "Browse 50+ production AI system PRDs across Generative AI, LangGraph, RAG, Defence, FinTech, and Systems. Ship daily GitHub commits and build your AI engineering portfolio.",
  keywords: [
    "AI engineering portfolio projects",
    "multi AI agent project GitHub",
    "agentic AI projects GitHub with source code",
    "production AI system PRDs",
    "LangGraph multi agent projects",
    "LLM RAG projects",
    "GitHub open-source AI projects",
    "AI coding bounties open source paid tasks",
    "paid open source contribution",
    "Botmartz AI arena",
  ],
  alternates: { canonical: "/arena" },
  openGraph: {
    title: "AI Engineering Arena & Production System PRDs | Botmartz",
    description:
      "Pick a production AI PRD, ship daily GitHub proof-of-work, and build a recruiter-ready AI engineering portfolio.",
    url: `${process.env.NEXT_PUBLIC_APP_URL || "https://community.botmartz.com"}/arena`,
    images: [{ url: "/logo.png", width: 1200, height: 630 }],
  },
};

export default function ArenaLayout({ children }: { children: React.ReactNode }) {
  return children;
}
