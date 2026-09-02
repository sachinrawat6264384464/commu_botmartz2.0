import React from "react";
import Link from "next/link";
import { getActivePageLockConfigServer } from "@/lib/page-locks-server";
import { Lock, Clock, Calendar, ShieldCheck, Sparkles, ArrowUpRight } from "lucide-react";
import PageLocksClientManager from "./client-manager";

export const dynamic = "force-dynamic";

export default async function AdminPageLocksPage() {
  const initialConfig = await getActivePageLockConfigServer();

  return (
    <div className="space-y-8 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="text-xs font-mono text-[#0066FF] uppercase font-bold tracking-wider mb-1">
            SITE ACCESS CONTROL &amp; COHORT SCHEDULER
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Page Access &amp; Scheduling Controller</h1>
          <p className="text-xs text-slate-500 font-mono mt-1">
            Dynamically lock or unlock pages, schedule automated release dates with live countdown timers, or focus the platform on the Flagship Workshop.
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <Link
            href="/admin/workshops"
            className="px-4 py-2 bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-xl font-bold uppercase tracking-wider transition-all shadow-xs"
          >
            Workshop Registrations &rarr;
          </Link>
          <Link
            href="/"
            target="_blank"
            className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 rounded-xl font-bold uppercase tracking-wider transition-all shadow-2xs flex items-center gap-1.5"
          >
            <span>Live Site</span>
            <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>

      {/* Interactive Manager */}
      <PageLocksClientManager initialConfig={initialConfig} />

    </div>
  );
}
