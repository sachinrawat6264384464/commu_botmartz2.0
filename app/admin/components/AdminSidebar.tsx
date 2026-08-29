"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Calendar, 
  BookOpen, 
  CreditCard, 
  Tag, 
  ScanLine, 
  Award, 
  MessageSquare, 
  Settings, 
  LogOut,
  ShieldCheck
} from "lucide-react";
import { UserRole, ROLE_PERMISSIONS } from "@/lib/rbac";

interface AdminSidebarProps {
  userRole?: UserRole;
  userEmail?: string;
  onLogout?: () => void;
}

export default function AdminSidebar({ userRole = 'super-admin', userEmail = '', onLogout }: AdminSidebarProps) {
  const pathname = usePathname();
  const permissions = ROLE_PERMISSIONS[userRole] || ROLE_PERMISSIONS['volunteer'];

  const NAV_ITEMS = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard, allowed: true },
    { label: "Events & Summits", href: "/admin/events", icon: Calendar, allowed: permissions.canManageEvents },
    { label: "AI Bootcamps", href: "/admin/bootcamps", icon: BookOpen, allowed: permissions.canManageEvents },
    { label: "Payments & Ledger", href: "/admin/payments", icon: CreditCard, allowed: permissions.canManageFinance },
    { label: "Coupons & Discounts", href: "/admin/coupons", icon: Tag, allowed: permissions.canManageCoupons },
    { label: "Ticket Scanner", href: "/admin/scanner", icon: ScanLine, allowed: permissions.canScanTickets },
    { label: "Certificates", href: "/admin/certificates", icon: Award, allowed: permissions.canIssueCertificates },
    { label: "Attendee Feedback", href: "/admin/feedback", icon: MessageSquare, allowed: permissions.canManageEvents },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-screen flex flex-col justify-between p-4">
      <div>
        {/* Brand */}
        <div className="flex items-center gap-3 px-3 py-4 mb-6 border-b border-slate-100">
          <div className="w-9 h-9 rounded-xl bg-[#0066FF] flex items-center justify-center font-mono font-bold text-white shadow-sm">
            B
          </div>
          <div>
            <div className="font-bold text-slate-900 text-sm">COMMUNITY CMS</div>
            <div className="text-[10px] font-mono text-[#0066FF] tracking-wider uppercase font-semibold">
              {permissions.label}
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {NAV_ITEMS.filter(item => item.allowed).map((item) => {
            const active = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  active
                    ? "bg-[#0066FF] text-white font-bold shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <item.icon size={16} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer / User Profile */}
      <div className="pt-4 border-t border-slate-100 space-y-3">
        <div className="px-3">
          <div className="text-[11px] font-mono text-slate-400 uppercase">Logged in as</div>
          <div className="text-xs text-slate-800 font-semibold truncate">{userEmail || "admin@botmartz.com"}</div>
          <span className="inline-block mt-1 px-2 py-0.5 rounded bg-blue-50 text-[#0066FF] border border-blue-200 text-[10px] font-mono font-bold">
            {userRole.toUpperCase()}
          </span>
        </div>

        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <span>← Back to Public Site</span>
        </Link>
      </div>
    </aside>
  );
}
