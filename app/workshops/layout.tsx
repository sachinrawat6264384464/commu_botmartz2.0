import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hands-on AI Bootcamps & Engineering Cohorts — Botmartz Workshops",
  description:
    "Intensive, hands-on live coding workshops on LangGraph agent state machines, hybrid dense/sparse RAG indexing, and LLMOps production deployments.",
  keywords: [
    "AI workshops 2026",
    "AI workshops webinars for students India",
    "online workshop with certificate",
    "free online workshops for engineering students",
    "AI training in India online",
    "AI learning platform",
    "career path for developers",
    "job ready developer training",
    "free seminars in Indore",
    "developer training",
    "codelabs",
    "LangGraph bootcamp",
    "RAG live coding cohort",
    "AI engineering workshops",
  ],
  alternates: { canonical: "/workshops" },
  openGraph: {
    title: "Hands-on AI Bootcamps & Workshops | Botmartz",
    description: "Live interactive coding cohorts on LangGraph and production RAG pipelines.",
    url: "https://community.botmartz.com/workshops",
    images: [{ url: "/logo.png", width: 1200, height: 630 }],
  },
};

export default function WorkshopsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
