"use client";

import React, { useState, useEffect, Suspense } from "react";
import { usePathname } from "next/navigation";
import CommunityNavbar from "./_components/Navbar";
import CommunityFooter from "./_components/Footer";
import PageLockGate from "./_components/PageLockGate";
import AccessibilityToolbox from "./_components/AccessibilityToolbox";
import AnalyticsProvider from "@/components/AnalyticsProvider";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import { ToastProvider } from "@/lib/toast-context";
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

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Suppress public header and footer on Admin routes and Scanner Desk
  const isAdminOrDesk = mounted && (pathname.startsWith("/admin") || pathname.startsWith("/event-desk"));

  if (isAdminOrDesk) {
    return (
      <main className="min-h-screen bg-[#FAFCFF] text-slate-900">
        {children}
        <AccessibilityToolbox />
      </main>
    );
  }

  // Check if route is locked
  const lockStatus = isRouteLocked(pathname, lockConfig, isAdmin || hasBypass);

  return (
    <>
      <CommunityNavbar />
      <main className="flex-1 pt-20 sm:pt-24">
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
      <AccessibilityToolbox />
    </>
  );
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ToastProvider>
        <Suspense fallback={null}>
          <AnalyticsProvider>
            <LayoutContent>{children}</LayoutContent>
          </AnalyticsProvider>
        </Suspense>
      </ToastProvider>
    </AuthProvider>
  );
}
