import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Summits, Flagship Conferences & Meetups — Botmartz Events",
  description:
    "Explore upcoming AI Frontier Summits, weekly Indore AI Hub office hours, and online developer meetups. Register for tiered summit passes and live keynotes.",
  keywords: [
    "AI events 2026",
    "AI Frontier summit",
    "Indore AI meetup",
    "AI engineering conferences",
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
