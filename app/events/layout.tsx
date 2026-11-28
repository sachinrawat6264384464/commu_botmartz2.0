import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Summits, Flagship Conferences & Meetups — Botmartz Events",
  description:
    "Explore upcoming AI Frontier Summits, weekly Indore AI Hub office hours, and online developer meetups. Register for tiered summit passes and live keynotes.",
  keywords: [
    "AI events 2026",
    "upcoming tech events in Indore 2026",
    "upcoming tech events in Indore for students",
    "best tech community in Indore",
    "Indore tech summit 2026",
    "developer conferences in Indore 2026",
    "free seminars in Indore",
    "upcoming hackathons in India 2026",
    "upcoming online hackathons in India 2026",
    "India Agentic AI Open hackathon",
    "AI Frontier summit",
    "Indore AI meetup",
    "developer meetup Indore",
    "AI engineering conferences",
    "hackathon registration 2026",
  ],
  alternates: { canonical: "/events" },
  openGraph: {
    title: "AI Summits & Engineering Events | Botmartz",
    description: "Flagship AI conferences, offline office hours, and technical summits.",
    url: "https://community.botmartz.com/events",
    images: [{ url: "/logo.png", width: 1200, height: 630 }],
  },
};

export default function EventsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
