import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Hackathons & 48-Hour Engineering Sprints — Botmartz Challenges",
  description:
    "Compete in 48-hour AI hackathons, prompt battles, and production engineering challenges. Win cash prizes, GPU cloud credits, and unlock partner company job referrals.",
  keywords: [
    "AI hackathons 2026",
    "online AI engineering challenges",
    "prompt engineering battles",
    "LangGraph hackathon",
    "generative AI sprint",
  ],
  alternates: { canonical: "/challenges" },
  openGraph: {
    title: "AI Hackathons & 48-Hour Engineering Challenges | Botmartz",
    description: "Compete in 48-hour AI hackathons and prompt battles with cash prizes and cloud credits.",
    url: "https://community.botmartz.com/challenges",
    images: [{ url: "/logo.png", width: 1200, height: 630 }],
  },
};

export default function ChallengesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
