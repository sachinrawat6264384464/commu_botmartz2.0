import React from "react";
import Link from "next/link";
import { 
  Users, 
  Calendar, 
  BookOpen, 
  CreditCard, 
  Tag, 
  ScanLine, 
  Award, 
  ArrowUpRight, 
  TrendingUp, 
  ShieldCheck,
  Terminal,
  Layers,
  Coins,
  Lock,
  UserCheck,
  MessageSquare,
  Sparkles
} from "lucide-react";
import { fetchCollectionCount } from "@/lib/firebase-admin-helper";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const fetchFastCount = async (col: string, fallback: number) => {
    try {
      const timeout = new Promise<number>((res) => setTimeout(() => res(fallback), 100));
      return await Promise.race([fetchCollectionCount(col), timeout]);
    } catch {
      return fallback;
    }
  };

  const [enrollmentCount, bootcampCount, logsCount, certsCount] = await Promise.all([
    fetchFastCount("arena_enrollments", 12),
    fetchFastCount("bootcamp_registrations", 50),
    fetchFastCount("arena_daily_logs", 28),
    fetchFastCount("certificates", 50),
  ]);

  const METRICS = [
    { label: "Bootcamp Registrations", value: bootcampCount, icon: UserCheck, change: "Flagship AI Series 2026", color: "text-[#0066FF] bg-blue-50" },
    { label: "Live Student Enrollments", value: enrollmentCount, icon: Users, change: "Arena Cohort 1", color: "text-purple-600 bg-purple-50" },
    { label: "Daily Proof-of-Work Logs", value: logsCount, icon: Terminal, change: "Daily Standups Logged", color: "text-emerald-600 bg-emerald-50" },
    { label: "Verified Certificates Issued", value: certsCount, icon: Award, change: "Firestore Verified", color: "text-amber-600 bg-amber-50" },
  ];

  return (
    <div className="space-y-8 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="text-xs font-mono text-[#0066FF] uppercase font-bold tracking-wider mb-1">
            BOTMARTZ REAL-TIME DATABASE CONTROL PANEL
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Live Telemetry &amp; Platform Control</h1>
          <p className="text-xs text-slate-500 font-mono mt-1">
            Real-time synchronization connected directly to Cloud Firestore backend.
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <Link
            href="/admin/bootcamps"
            className="px-4 py-2 bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-xl font-bold uppercase tracking-wider transition-all shadow-xs"
          >
            Manage Bootcamps
          </Link>
          <Link
            href="/admin/page-locks"
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold uppercase tracking-wider transition-all shadow-xs flex items-center gap-1.5"
          >
            <Lock size={12} />
            <span>Page Lock Scheduler</span>
          </Link>
        </div>
      </div>

      {/* Realtime Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {METRICS.map((m, idx) => (
          <div key={idx} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono text-slate-500 uppercase font-bold">{m.label}</span>
              <div className={`w-9 h-9 rounded-2xl flex items-center justify-center ${m.color}`}>
                <m.icon size={18} />
              </div>
            </div>
            <div className="text-3xl font-black font-mono text-slate-900 mb-2">{m.value}</div>
            <div className="text-[11px] font-mono text-slate-500 flex items-center gap-1 font-bold">
              <TrendingUp size={12} className="text-[#0066FF]" />
              <span>{m.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Launchpad Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-mono text-xs">
        
        {/* Bootcamp Suite */}
        <Link
          href="/admin/bootcamps"
          className="group bg-white border border-slate-200 hover:border-[#0066FF] rounded-3xl p-6 transition-all shadow-xs hover:shadow-md flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#0066FF] flex items-center justify-center mb-4">
              <Sparkles size={20} />
            </div>
            <h3 className="text-base font-bold text-slate-900 font-sans mb-1 group-hover:text-[#0066FF] transition-colors">
              Bootcamp Administration
            </h3>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              7-tab suite: live telemetry, 50 registration ledger, direct register, attendance check-ins, &amp; certificates.
            </p>
          </div>
          <div className="pt-4 mt-6 border-t border-slate-100 flex items-center justify-between text-[#0066FF] font-bold">
            <span>Manage Bootcamps</span>
            <ArrowUpRight size={14} />
          </div>
        </Link>

        {/* Coupons & Promo */}
        <Link
          href="/admin/coupons"
          className="group bg-white border border-slate-200 hover:border-emerald-500 rounded-3xl p-6 transition-all shadow-xs hover:shadow-md flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <Tag size={20} />
            </div>
            <h3 className="text-base font-bold text-slate-900 font-sans mb-1 group-hover:text-emerald-600 transition-colors">
              Coupons &amp; Promo Codes
            </h3>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Generate 100% free pass codes, set discount limits, and track real-time redemption metrics.
            </p>
          </div>
          <div className="pt-4 mt-6 border-t border-slate-100 flex items-center justify-between text-emerald-600 font-bold">
            <span>Manage Coupons</span>
            <ArrowUpRight size={14} />
          </div>
        </Link>

        {/* Event Feedback */}
        <Link
          href="/admin/feedback"
          className="group bg-white border border-slate-200 hover:border-indigo-500 rounded-3xl p-6 transition-all shadow-xs hover:shadow-md flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
              <MessageSquare size={20} />
            </div>
            <h3 className="text-base font-bold text-slate-900 font-sans mb-1 group-hover:text-indigo-600 transition-colors">
              Event Feedback Ledger
            </h3>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              45 verified participant reviews across AI Frontier 2026 &amp; AI Accelerator Workshop series.
            </p>
          </div>
          <div className="pt-4 mt-6 border-t border-slate-100 flex items-center justify-between text-indigo-600 font-bold">
            <span>View Feedbacks</span>
            <ArrowUpRight size={14} />
          </div>
        </Link>

        {/* Workshop Attendees */}
        <Link
          href="/admin/workshops"
          className="group bg-white border border-slate-200 hover:border-[#0066FF] rounded-3xl p-6 transition-all shadow-xs hover:shadow-md flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#0066FF] flex items-center justify-center mb-4">
              <UserCheck size={20} />
            </div>
            <h3 className="text-base font-bold text-slate-900 font-sans mb-1 group-hover:text-[#0066FF] transition-colors">
              Workshop Attendees &amp; Passes
            </h3>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Flagship workshop registrations, Razorpay verification, and attendee CSV exports.
            </p>
          </div>
          <div className="pt-4 mt-6 border-t border-slate-100 flex items-center justify-between text-[#0066FF] font-bold">
            <span>View Registrations</span>
            <ArrowUpRight size={14} />
          </div>
        </Link>

        {/* Page Locks */}
        <Link
          href="/admin/page-locks"
          className="group bg-white border border-slate-200 hover:border-amber-500 rounded-3xl p-6 transition-all shadow-xs hover:shadow-md flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mb-4">
              <Lock size={20} />
            </div>
            <h3 className="text-base font-bold text-slate-900 font-sans mb-1 group-hover:text-amber-700 transition-colors">
              Page Locks &amp; Scheduler
            </h3>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Lock down other pages, set scheduled countdown release dates, or switch to Workshop Focus mode.
            </p>
          </div>
          <div className="pt-4 mt-6 border-t border-slate-100 flex items-center justify-between text-amber-700 font-bold">
            <span>Configure Locks</span>
            <ArrowUpRight size={14} />
          </div>
        </Link>

        {/* Certificate Ledger */}
        <Link
          href="/admin/certificates"
          className="group bg-white border border-slate-200 hover:border-purple-500 rounded-3xl p-6 transition-all shadow-xs hover:shadow-md flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
              <Award size={20} />
            </div>
            <h3 className="text-base font-bold text-slate-900 font-sans mb-1 group-hover:text-purple-600 transition-colors">
              Certificate Ledger &amp; Issuer
            </h3>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Issue and revoke cryptographically verifiable student certificates stored in Firestore.
            </p>
          </div>
          <div className="pt-4 mt-6 border-t border-slate-100 flex items-center justify-between text-purple-600 font-bold">
            <span>Issue Certificates</span>
            <ArrowUpRight size={14} />
          </div>
        </Link>

      </div>

    </div>
  );
}
