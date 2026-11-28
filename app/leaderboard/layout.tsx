import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hall of Fame Leaderboard & Top Shippers — Botmartz Community",
  description:
    "Live rankings of top open-source builders, hackathon winners, and discussion leaders. Track Botmartz Karma Coins, shipped PRs, and builder ranks.",
  keywords: [
    "AI builder leaderboard",
    "top open source contributors",
    "GitHub open-source AI projects",
    "Botmartz hall of fame",
    "developer karma ranking",
    "student developer community",
  ],
  alternates: { canonical: "/leaderboard" },
  openGraph: {
    title: "Hall of Fame Leaderboard | Botmartz Community",
    description: "Top AI engineers, open-source contributors, and hackathon champions.",
    url: "https://community.botmartz.com/leaderboard",
    images: [{ url: "/logo.png", width: 1200, height: 630 }],
  },
};

export default function LeaderboardLayout({ children }: { children: React.ReactNode }) {
  return children;
}
