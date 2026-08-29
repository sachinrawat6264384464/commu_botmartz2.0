"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
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
  BarChart3,
  Mail,
  Users,
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
    { label: "Deep Analytics", href: "/admin/analytics", icon: BarChart3, allowed: permissions.canViewAnalytics },
    { label: "Newsletters & Broadcasts", href: "/admin/newsletter", icon: Mail, allowed: permissions.canSendNewsletters },
    { label: "Events & Summits", href: "/admin/events", icon: Calendar, allowed: permissions.canManageEvents },
    { label: "AI Bootcamps", href: "/admin/bootcamps", icon: BookOpen, allowed: permissions.canManageEvents },
    { label: "Payments & Ledger", href: "/admin/payments", icon: CreditCard, allowed: permissions.canManageFinance },
    { label: "Coupons & Promo Codes", href: "/admin/coupons", icon: Tag, allowed: permissions.canManageCoupons },
    { label: "Ticket Scanner", href: "/admin/scanner", icon: ScanLine, allowed: permissions.canScanTickets },
    { label: "Certificates", href: "/admin/certificates", icon: Award, allowed: permissions.canIssueCertificates },
    { label: "Attendee Feedback", href: "/admin/feedback", icon: MessageSquare, allowed: permissions.canManageEvents },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-screen flex flex-col justify-between p-4 shrink-0">
      <div>
        {/* Brand Logo with /logo.png */}
        <div className="flex items-center gap-3 px-3 py-4 mb-6 border-b border-slate-100">
          <div className="relative w-9 h-9 rounded-xl overflow-hidden shadow-2xs border border-slate-200 bg-white flex items-center justify-center p-1">
            <Image
              src="/logo.png"
              alt="Botmartz Logo"
              width={32}
              height={32}
              className="object-contain"
              priority
            />
          </div>
          <div>
            <div className="font-bold text-slate-900 text-sm leading-none">BOTMARTZ</div>
            <div className="text-[10px] font-mono text-[#0066FF] tracking-wider uppercase font-semibold mt-1">
              {permissions.label.split(' ')[0]} CMS
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

      {/* Footer Profile */}
      <div className="pt-4 border-t border-slate-100 space-y-3">
        <div className="px-3">
          <div className="text-[10px] font-mono text-slate-400 uppercase">Authenticated Session</div>
          <div className="text-xs text-slate-800 font-bold truncate">{userEmail || "soham@botmartz.com"}</div>
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
