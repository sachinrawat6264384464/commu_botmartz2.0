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
  ShieldCheck,
  Trophy,
  Flame,
  Lock,
  Coins,
  Activity,
  UserCheck
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
    { label: "Workshop Registrations", href: "/admin/workshops", icon: UserCheck, allowed: permissions.canManageEvents },
    { label: "Page Locks & Scheduler", href: "/admin/page-locks", icon: Lock, allowed: permissions.canManageFinance },
    { label: "Zero-Trust Security", href: "/admin/security", icon: ShieldCheck, allowed: permissions.canManageFinance },
    { label: "Activity Audit Stream", href: "/admin/activity", icon: Activity, allowed: true },
    { label: "Wallets & Karma Coins", href: "/admin/wallets", icon: Coins, allowed: permissions.canManageFinance },
    { label: "Builder Arena & 45D Logs", href: "/admin/arena", icon: Flame, allowed: permissions.canManageEvents },
    { label: "Online Hackathons", href: "/admin/hackathons", icon: Trophy, allowed: permissions.canManageEvents },
    { label: "Admin Team & Custom Roles", href: "/admin/team", icon: Users, allowed: permissions.canManageFinance },
    { label: "Deep Analytics", href: "/admin/analytics", icon: BarChart3, allowed: permissions.canViewAnalytics },
    { label: "Discussions & Moderation", href: "/admin/discussions", icon: MessageSquare, allowed: permissions.canModerateDiscussions },
    { label: "Newsletters & Broadcasts", href: "/admin/newsletter", icon: Mail, allowed: permissions.canSendNewsletters },
    { label: "Events & Summits", href: "/admin/events", icon: Calendar, allowed: permissions.canManageEvents },
    { label: "Challenges Review", href: "/admin/challenges", icon: Trophy, allowed: permissions.canManageEvents },
    { label: "Payments & Ledger", href: "/admin/payments", icon: CreditCard, allowed: permissions.canManageFinance },
    { label: "Coupons & Promo Codes", href: "/admin/coupons", icon: Tag, allowed: permissions.canManageCoupons },
    { label: "Ticket Scanner", href: "/admin/scanner", icon: ScanLine, allowed: permissions.canScanTickets },
    { label: "Certificates", href: "/admin/certificates", icon: Award, allowed: permissions.canIssueCertificates },
    { label: "Event Feedback", href: "/admin/feedback", icon: MessageSquare, allowed: permissions.canManageEvents },
    { label: "Bootcamps", href: "/admin/bootcamps", icon: Flame, allowed: permissions.canManageEvents },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 h-full flex flex-col justify-between p-4 shrink-0 font-sans z-30 overflow-hidden shadow-xs">
      {/* Brand Logo Header */}
      <div className="flex items-center gap-3 px-2 py-3 mb-2 border-b border-slate-100 shrink-0">
        <div className="relative w-10 h-10 flex items-center justify-center shrink-0">
          <Image
            src="/logo.png"
            alt="Botmartz Logo"
            width={38}
            height={38}
            className="object-contain"
            priority
          />
        </div>
        <div className="overflow-hidden">
          <div className="font-extrabold text-slate-900 text-sm leading-none tracking-tight">BOTMARTZ</div>
          <div className="text-[10px] font-mono text-[#0066FF] tracking-wider uppercase font-bold mt-1 truncate">
            {permissions.label.split(' ')[0]} CMS
          </div>
        </div>
      </div>

      {/* Scrollable Navigation Items Container (Zero Gap) */}
      <div className="flex-1 overflow-y-auto py-1 pr-1 space-y-1 font-mono scrollbar-thin scrollbar-thumb-slate-200 hover:scrollbar-thumb-slate-300">
        <nav className="space-y-1">
          {NAV_ITEMS.filter(item => item.allowed).map((item) => {
            const active = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  active
                    ? "bg-[#0066FF] text-white font-bold shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                }`}
              >
                <item.icon size={16} className={active ? "text-white" : "text-slate-500"} />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Docked Footer Profile */}
      <div className="pt-3 mt-2 border-t border-slate-100 space-y-2.5 font-mono shrink-0 bg-white">
        <div className="px-2 py-1 rounded-xl bg-slate-50 border border-slate-100">
          <div className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Authenticated Session</div>
          <div className="text-xs text-slate-800 font-extrabold truncate">{userEmail || "soham@botmartz.com"}</div>
          <div className="flex items-center justify-between mt-1">
            <span className="inline-block px-2 py-0.5 rounded bg-blue-50 text-[#0066FF] border border-blue-200 text-[10px] font-extrabold">
              {userRole.toUpperCase()}
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Active Session" />
          </div>
        </div>

        <div className="flex items-center justify-between px-1 pt-1">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#0066FF] transition-colors"
          >
            <span>← Public Site</span>
          </Link>

          {onLogout && (
            <button
              onClick={onLogout}
              className="flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
              title="End session and log out"
            >
              <LogOut size={12} />
              <span>Exit</span>
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
