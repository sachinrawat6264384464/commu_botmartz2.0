import { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://community.botmartz.com";

export const metadata: Metadata = {
  title: "AI Engineer & Software Roles Roadmap 2026 — Skills, Projects & Career Blueprints",
  description:
    "Explore 6-stage AI Engineer Roadmaps for 2026: foundational math, PyTorch, LangGraph RAG pipelines, Agentic AI, Rust, and Cybersecurity. Link skills directly to GitHub portfolio projects.",
  keywords: [
    "AI engineer roadmap 2026",
    "AI engineer roadmap 2026 skills projects",
    "guide to becoming an AI engineer",
    "AI engineer career path",
    "skills for AI engineer",
    "AI engineer learning path",
    "generative AI engineer",
    "python for AI engineer",
    "machine learning engineer roadmap",
    "AI engineer roadmap for beginners",
    "AI engineer roadmap 2026 GitHub",
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
    url: `${SITE_URL}/arena/roadmaps`,
    images: [{ url: "/logo.png", width: 1200, height: 630 }],
  },
};

const roadmapFaqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is the roadmap for AI engineers in 2026?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The 2026 AI Engineer roadmap progresses through 6 stages: Python & systems fundamentals, linear algebra and PyTorch, transformer architectures, enterprise RAG and vector databases, LangGraph multi-agent orchestration, and production LLMOps with automated SLA benchmarks.",
      },
    },
    {
      "@type": "Question",
      name: "What AI skills should I learn in 2026?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Key AI engineering skills in 2026 include LLM application engineering, hybrid RAG pipelines, LangGraph agent workflows, MCP integrations, evaluation benchmarks, and shipping verifiable GitHub portfolio projects.",
      },
    },
  ],
};

export default function RoadmapsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(roadmapFaqJsonLd) }}
      />
      {children}
    </>
  );
}
