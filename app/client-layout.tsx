"use client";

import React from "react";
import { usePathname } from "next/navigation";
import CommunityNavbar from "./_components/Navbar";
import CommunityFooter from "./_components/Footer";
import { AuthProvider } from "@/lib/auth-context";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Suppress public header and footer on Admin routes and Scanner Desk
  const isAdminOrDesk = pathname.startsWith("/admin") || pathname.startsWith("/event-desk");

  if (isAdminOrDesk) {
    return (
      <AuthProvider>
        <main className="min-h-screen bg-[#FAFCFF] text-slate-900">{children}</main>
      </AuthProvider>
    );
  }

  return (
    <AuthProvider>
      <CommunityNavbar />
      <main className="flex-1 pt-18">{children}</main>
      <CommunityFooter />
    </AuthProvider>
  );
}
