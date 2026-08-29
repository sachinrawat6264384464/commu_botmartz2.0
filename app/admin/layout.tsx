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
  
  const [role, setRole] = useState<UserRole>("super-admin");
  const [userEmail, setUserEmail] = useState("soham@botmartz.com");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (pathname === "/admin/login") {
      setLoading(false);
      return;
    }

    if (typeof window !== "undefined") {
      const storedRole = localStorage.getItem("botmartz_admin_role") as UserRole;
      const storedEmail = localStorage.getItem("botmartz_admin_email");

      if (!storedRole) {
        router.push("/admin/login");
        return;
      }

      if (storedRole) setRole(storedRole);
      if (storedEmail) setUserEmail(storedEmail);
    }
    setLoading(false);
  }, [pathname, router]);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("botmartz_admin_role");
      localStorage.removeItem("botmartz_admin_email");
    }
    router.push("/admin/login");
  };

  // If visiting /admin/login, bypass layout wrapper
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const allowed = isPathAllowed(role, pathname);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFCFF] flex items-center justify-center text-slate-900">
        <Loader2 className="animate-spin text-[#0066FF]" size={32} />
      </div>
    );
  }

  if (!allowed) {
    return (
      <div className="min-h-screen bg-[#FAFCFF] text-slate-900 flex">
        <AdminSidebar userRole={role} userEmail={userEmail} onLogout={handleLogout} />
        <main className="flex-1 p-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mb-6">
            <ShieldAlert size={32} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Access Restricted (RBAC)</h1>
          <p className="text-sm text-slate-600 max-w-md mb-6">
            Your role (<strong className="text-rose-600 uppercase font-mono">{role}</strong>) does not have permission to access <code>{pathname}</code>.
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
    <div className="min-h-screen bg-[#FAFCFF] text-slate-900 flex">
      <AdminSidebar userRole={role} userEmail={userEmail} onLogout={handleLogout} />
      <main className="flex-1 overflow-y-auto min-h-screen p-8 lg:p-10">
        {children}
      </main>
    </div>
  );
}

