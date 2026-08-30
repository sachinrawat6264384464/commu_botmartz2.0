import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Engineering Discussions & Builder Community Forum — Botmartz",
  description:
    "Join discussions on AI Agents, Enterprise RAG, LangGraph state machines, MCP plugins, and prompt evaluation benchmarks with senior AI engineers and builders.",
  keywords: [
    "AI developer discussions",
    "RAG forum",
    "LangGraph community",
    "AI agent state machines",
    "MCP plugins discussion",
  ],
  alternates: { canonical: "/discussions" },
  openGraph: {
    title: "AI Engineering Discussions & Community Forum | Botmartz",
    description: "Multi-channel technical discussions for AI engineers, prompt researchers, and open-source contributors.",
    url: "https://community.botmartz.com/discussions",
    images: [{ url: "/logo.png", width: 1200, height: 630 }],
  },
};

export default function DiscussionsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
