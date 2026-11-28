import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Project Showcase & Builder Demos — Botmartz Community",
  description:
    "Explore open-source production AI agents, RAG engines, and MCP plugins built and shipped by the Botmartz builder community. Live demos, GitHub repos, and peer reviews.",
  keywords: [
    "AI project showcase",
    "AI agent demos",
    "open source AI projects",
    "RAG live demo",
    "LLM RAG projects",
    "AI engineering portfolio projects",
    "show and tell developer community",
    "Botmartz builders showcase",
  ],
  alternates: { canonical: "/showcase" },
  openGraph: {
    title: "AI Project Showcase & Builder Demos | Botmartz",
    description: "Explore verified production AI projects with GitHub repositories and live deployments.",
    url: "https://community.botmartz.com/showcase",
    images: [{ url: "/logo.png", width: 1200, height: 630 }],
  },
};

export default function ShowcaseLayout({ children }: { children: React.ReactNode }) {
  return children;
}
