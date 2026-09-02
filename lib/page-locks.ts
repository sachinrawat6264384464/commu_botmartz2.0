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
  mode: "WORKSHOP_FOCUS",
  // Scheduled release date for 9th September, 9:00 PM IST
  scheduledUnlockTime: "2026-09-09T21:00:00+05:30",
  announcementTitle: "Going Live on 9th September at 9:00 PM IST",
  announcementMessage:
    "This section is currently restricted and will unlock live on 9th September at 9:00 PM IST with the ₹9 Flagship AI Workshop. Register now for the ₹9 pass to secure your seat and receive early VIP platform access.",
  lockedRoutes: [
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
    "/product-tour"
  ],
  publicRoutes: [
    "/",
    "/workshops",
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
