export interface BadgeDef {
  id: string;
  title: string;
  category: "streak" | "project" | "skill";
  description: string;
  requiredCount: number;
  iconName: string;
  badgeBg: string; // Tailored gradient/hex color
  borderColor: string;
  textColor: string;
  shape: "hexagon" | "shield" | "star";
}

export const COMMUNITY_BADGES: BadgeDef[] = [
  // Streak Badges
  {
    id: "streak-10",
    title: "10-Day Streak",
    category: "streak",
    description: "Logged 10 consecutive daily proof-of-work standups.",
    requiredCount: 10,
    iconName: "Flame",
    badgeBg: "from-blue-600 to-cyan-500",
    borderColor: "border-blue-400",
    textColor: "text-blue-400",
    shape: "hexagon"
  },
  {
    id: "streak-20",
    title: "20-Day Streak",
    category: "streak",
    description: "Maintained a 20-day production commit streak in the Arena.",
    requiredCount: 20,
    iconName: "Zap",
    badgeBg: "from-purple-600 to-[#0066FF]",
    borderColor: "border-purple-400",
    textColor: "text-purple-400",
    shape: "hexagon"
  },
  {
    id: "streak-45",
    title: "45-Day Sprint Master",
    category: "streak",
    description: "Completed the entire 45-day proof-of-work AI engineering sprint.",
    requiredCount: 45,
    iconName: "Trophy",
    badgeBg: "from-pink-600 to-rose-500",
    borderColor: "border-pink-400",
    textColor: "text-pink-400",
    shape: "hexagon"
  },

  // Project Milestone Badges
  {
    id: "proj-1",
    title: "1 Project Completed",
    category: "project",
    description: "Successfully built and passed audit for 1 full production project.",
    requiredCount: 1,
    iconName: "Award",
    badgeBg: "from-emerald-600 to-teal-500",
    borderColor: "border-emerald-400",
    textColor: "text-emerald-400",
    shape: "shield"
  },
  {
    id: "proj-2",
    title: "2 Projects Completed",
    category: "project",
    description: "Architected and shipped 2 production AI systems.",
    requiredCount: 2,
    iconName: "ShieldCheck",
    badgeBg: "from-amber-500 to-orange-600",
    borderColor: "border-amber-400",
    textColor: "text-amber-400",
    shape: "shield"
  },
  {
    id: "proj-4",
    title: "4 Projects Architect",
    category: "project",
    description: "Mastered 4 core system PRDs across cloud, AI agents, and RAG.",
    requiredCount: 4,
    iconName: "Crown",
    badgeBg: "from-indigo-600 to-purple-600",
    borderColor: "border-indigo-400",
    textColor: "text-indigo-400",
    shape: "shield"
  },

  // Skill Curriculum Badges (As shown on Certificate)
  {
    id: "mod-foundations",
    title: "Foundations & AI",
    category: "skill",
    description: "Core AI architecture, prompt design, and system patterns.",
    requiredCount: 1,
    iconName: "Sparkles",
    badgeBg: "from-teal-500 to-emerald-600",
    borderColor: "border-teal-400",
    textColor: "text-teal-300",
    shape: "hexagon"
  },
  {
    id: "mod-linux-gcp",
    title: "Linux & GCP",
    category: "skill",
    description: "Production Linux administration, GCP IAM, and container runtime.",
    requiredCount: 1,
    iconName: "Terminal",
    badgeBg: "from-orange-500 to-rose-600",
    borderColor: "border-orange-400",
    textColor: "text-orange-300",
    shape: "hexagon"
  },
  {
    id: "mod-aws",
    title: "AWS Services",
    category: "skill",
    description: "Cloud Infrastructure, EC2, S3, and Serverless deployment.",
    requiredCount: 1,
    iconName: "Layers",
    badgeBg: "from-amber-500 to-[#0066FF]",
    borderColor: "border-amber-400",
    textColor: "text-amber-300",
    shape: "hexagon"
  }
];

export function computeUserBadgeStatuses(
  streakDays: number,
  completedProjectsCount: number,
  claimedBadgeIds: string[] = []
) {
  return COMMUNITY_BADGES.map((badge) => {
    let isEligible = false;
    if (badge.category === "streak") {
      isEligible = streakDays >= badge.requiredCount;
    } else if (badge.category === "project") {
      isEligible = completedProjectsCount >= badge.requiredCount;
    } else if (badge.category === "skill") {
      isEligible = completedProjectsCount >= 1 || streakDays >= 10;
    }

    const isClaimed = claimedBadgeIds.includes(badge.id);

    return {
      ...badge,
      isEligible,
      isClaimed,
      canClaim: isEligible && !isClaimed
    };
  });
}
