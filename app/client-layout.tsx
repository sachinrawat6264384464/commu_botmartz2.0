"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import CommunityNavbar from "./_components/Navbar";
import CommunityFooter from "./_components/Footer";
import PageLockGate from "./_components/PageLockGate";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import { isRouteLocked, DEFAULT_PAGE_LOCK_CONFIG, PageLockConfig } from "@/lib/page-locks";

function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, studentProfile } = useAuth();
  const [lockConfig, setLockConfig] = useState<PageLockConfig>(DEFAULT_PAGE_LOCK_CONFIG);
  const [hasBypass, setHasBypass] = useState(false);

  // Check if current user is admin
  const isAdmin =
    user?.email?.toLowerCase() === "soham@botmartz.com" ||
    user?.email?.toLowerCase().includes("botmartz.com") ||
    studentProfile?.role === "ADMIN";

  // Check session storage bypass
  useEffect(() => {
    if (typeof window !== "undefined") {
      const bypass = sessionStorage.getItem("botmartz_lock_bypass");
      if (bypass === "true") {
        setHasBypass(true);
      }
    }
  }, []);

  // Optionally fetch dynamic lock settings
  useEffect(() => {
    fetch("/api/admin/page-locks")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success && data.config) {
          setLockConfig(data.config);
        }
      })
      .catch(() => {
        // graceful fallback to default
      });
  }, []);

  // Suppress public header and footer on Admin routes and Scanner Desk
  const isAdminOrDesk = pathname.startsWith("/admin") || pathname.startsWith("/event-desk");

  if (isAdminOrDesk) {
    return <main className="min-h-screen bg-[#FAFCFF] text-slate-900">{children}</main>;
  }

  // Check if route is locked
  const lockStatus = isRouteLocked(pathname, lockConfig, isAdmin || hasBypass);

  return (
    <>
      <CommunityNavbar />
      <main className="flex-1 pt-18">
        {lockStatus.isLocked ? (
          <PageLockGate
            pathname={pathname}
            unlockTime={lockStatus.unlockTime || lockConfig.scheduledUnlockTime}
            announcementMessage={lockStatus.reason || lockConfig.announcementMessage}
          />
        ) : (
          children
        )}
      </main>
      <CommunityFooter />
    </>
  );
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <LayoutContent>{children}</LayoutContent>
    </AuthProvider>
  );
}
