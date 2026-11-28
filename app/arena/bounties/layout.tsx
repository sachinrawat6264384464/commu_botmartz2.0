import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Coding Bounties & Paid Open-Source Tasks — Botmartz Arena",
  description:
    "Solve open-source AI coding bounties, ship production PRs, and earn rewards. Build real-world experience with LangGraph, RAG, and systems engineering tasks.",
  keywords: [
    "AI coding bounties open source paid tasks",
    "paid open source projects GitHub",
    "open source bounties",
    "paid open source contribution",
    "GitHub open-source AI projects",
    "AI engineering bounties",
  ],
  alternates: { canonical: "/arena/bounties" },
  openGraph: {
    title: "AI Coding Bounties & Paid Open-Source Tasks | Botmartz",
    description: "Earn rewards by shipping verified open-source AI & systems engineering bounties.",
    url: `${process.env.NEXT_PUBLIC_APP_URL || "https://community.botmartz.com"}/arena/bounties`,
    images: [{ url: "/logo.png", width: 1200, height: 630 }],
  },
};

export default function BountiesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
