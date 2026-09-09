export type PageLockMode = "WORKSHOP_FOCUS" | "SCHEDULED_RELEASE" | "OPEN_ACCESS";

export interface PageLockConfig {
  mode: PageLockMode;
  scheduledUnlockTime: string; // ISO 8601 string, e.g. "2026-09-09T21:00:00+05:30"
  announcementTitle: string;
  announcementMessage: string;
  lockedRoutes: string[];
  publicRoutes: string[];
}

export const DEFAULT_PAGE_LOCK_CONFIG: PageLockConfig = {
  mode: "OPEN_ACCESS",
  // Scheduled release date (platform is now open access)
  scheduledUnlockTime: "2026-09-09T00:00:00+05:30",
  announcementTitle: "Platform Open Access",
  announcementMessage:
    "All community tools, internship playgrounds, 50-system PRD matrix, roadmaps, and discussions are completely open and accessible.",
  lockedRoutes: [],
  publicRoutes: [
    "/",
    "/workshops",
    "/arena",
    "/virtual-ai-internship",
    "/challenges",
    "/discussions",
    "/gallery",
    "/magazine",
    "/showcase",
    "/leaderboard",
    "/member",
    "/event-desk",
    "/product-tour",
    "/login",
    "/certificates",
    "/admin",
    "/api"
  ]
};

// Check if a path is locked based on the configuration (Client-safe)
export function isRouteLocked(
  pathname: string,
  config: PageLockConfig = DEFAULT_PAGE_LOCK_CONFIG,
  isAdmin: boolean = false
): { isLocked: boolean; reason?: string; unlockTime?: string } {
  // Admins always have full bypass
  if (isAdmin) {
    return { isLocked: false };
  }

  // Admin routes and APIs are never locked by this gate
  if (pathname.startsWith("/admin") || pathname.startsWith("/api") || pathname.startsWith("/login")) {
    return { isLocked: false };
  }

  // Open Access mode unlocks everything
  if (config.mode === "OPEN_ACCESS") {
    return { isLocked: false };
  }

  // Scheduled Release: Check if current time has passed the scheduled unlock time
  if (config.mode === "SCHEDULED_RELEASE") {
    const unlockDate = new Date(config.scheduledUnlockTime);
    if (!isNaN(unlockDate.getTime()) && Date.now() >= unlockDate.getTime()) {
      return { isLocked: false };
    }
  }

  // Check if current path matches any explicitly locked route or starts with one
  const matchesLocked = config.lockedRoutes.some((route) => {
    return pathname === route || pathname.startsWith(`${route}/`);
  });

  if (matchesLocked) {
    return {
      isLocked: true,
      reason: config.announcementMessage,
      unlockTime: config.scheduledUnlockTime
    };
  }

  return { isLocked: false };
}
