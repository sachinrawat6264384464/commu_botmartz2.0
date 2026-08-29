"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import AdminSidebar from "./components/AdminSidebar";
import { UserRole, isPathAllowed } from "@/lib/rbac";
import { ShieldAlert, Loader2 } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  
  // Simulated or Auth-backed state
  const [role, setRole] = useState<UserRole>("super-admin");
  const [userEmail, setUserEmail] = useState("soham@botmartz.com");
  const [loading, setLoading] = useState(false);

  // If visiting /admin/login, bypass layout wrapper
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const allowed = isPathAllowed(role, pathname);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050B14] flex items-center justify-center text-white">
        <Loader2 className="animate-spin text-[#00B8F0]" size={32} />
      </div>
    );
  }

  if (!allowed) {
    return (
      <div className="min-h-screen bg-[#050B14] text-white flex">
        <AdminSidebar userRole={role} userEmail={userEmail} />
        <main className="flex-1 p-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mb-6">
            <ShieldAlert size={32} />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Access Restricted (RBAC)</h1>
          <p className="text-sm text-slate-400 max-w-md mb-6">
            Your role (<strong className="text-rose-400 uppercase font-mono">{role}</strong>) does not have permission to access <code>{pathname}</code>.
          </p>
          <button
            onClick={() => router.push("/admin")}
            className="px-6 py-2.5 bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-xl text-xs font-mono font-bold"
          >
            Return to Dashboard →
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050B14] text-white flex">
      <AdminSidebar userRole={role} userEmail={userEmail} />
      <main className="flex-1 overflow-y-auto min-h-screen p-8 lg:p-10">
        {children}
      </main>
    </div>
  );
}
