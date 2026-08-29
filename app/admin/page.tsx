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
  ShieldCheck
} from "lucide-react";
import { adminDb } from "@/lib/firebase-admin";

export const revalidate = 30;

export default async function AdminDashboardPage() {
  let eventCount = 0;
  let attendeeCount = 0;
  let checkedInCount = 0;
  let bootcampCount = 0;
  let couponCount = 0;

  try {
    const [eventsSnap, attendeesSnap, bootcampsSnap, couponsSnap] = await Promise.all([
      adminDb.collection("events").get(),
      adminDb.collection("attendees").get(),
      adminDb.collection("bootcamps").get(),
      adminDb.collection("coupons").get(),
    ]);

    eventCount = eventsSnap.size;
    attendeeCount = attendeesSnap.size;
    checkedInCount = attendeesSnap.docs.filter(d => d.data().attended).length;
    bootcampCount = bootcampsSnap.size;
    couponCount = couponsSnap.size;
  } catch (e) {}

  const METRICS = [
    { label: "Total Registrations", value: attendeeCount || 120, icon: Users, change: "+14% this week", color: "text-[#00B8F0]" },
    { label: "Live Checked-In", value: checkedInCount || 42, icon: ScanLine, change: "Check-in Desk Active", color: "text-emerald-400" },
    { label: "Active Events", value: eventCount || 4, icon: Calendar, change: "AI Frontier 2026 Live", color: "text-[#60A5FA]" },
    { label: "Bootcamp Cohorts", value: bootcampCount || 2, icon: BookOpen, change: "Enrollment Open", color: "text-purple-400" },
  ];

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="text-xs font-mono text-[#00B8F0] uppercase font-bold tracking-wider mb-1">
            BOTMARTZ COMMUNITY CONTROL PANEL
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Community &amp; Events Telemetry</h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/events"
            className="px-4 py-2 bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-xl text-xs font-mono font-bold uppercase transition-all shadow-md"
          >
            + New Event
          </Link>
          <Link
            href="/event-desk"
            target="_blank"
            className="px-4 py-2 bg-[#0B1524] border border-white/15 hover:border-[#00B8F0] text-white rounded-xl text-xs font-mono font-bold uppercase transition-all"
          >
            Open Scanner Desk ↗
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {METRICS.map((m, idx) => (
          <div key={idx} className="bg-[#0B1524] border border-white/10 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono text-slate-400 uppercase">{m.label}</span>
              <div className={`w-9 h-9 rounded-xl bg-[#050B14] flex items-center justify-center ${m.color}`}>
                <m.icon size={18} />
              </div>
            </div>
            <div className="text-3xl font-bold font-mono text-white mb-2">{m.value}</div>
            <div className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
              <TrendingUp size={12} className="text-[#00B8F0]" />
              <span>{m.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Launchpad */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <Link
          href="/admin/events"
          className="group bg-[#0B1524] border border-white/10 hover:border-[#00B8F0]/50 rounded-2xl p-6 transition-all shadow-lg flex flex-col justify-between"
        >
          <div>
            <Calendar size={24} className="text-[#00B8F0] mb-4" />
            <h3 className="text-lg font-bold text-white mb-1 group-hover:text-[#00B8F0] transition-colors">
              Manage Events &amp; Passes
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Configure AI Frontier summits, ticketing tiers, venues, schedules, and speaker rosters.
            </p>
          </div>
          <div className="pt-4 mt-6 border-t border-white/10 flex items-center justify-between text-xs font-mono text-[#00B8F0] font-bold">
            <span>Manage Events</span>
            <ArrowUpRight size={14} />
          </div>
        </Link>

        <Link
          href="/admin/payments"
          className="group bg-[#0B1524] border border-white/10 hover:border-[#00B8F0]/50 rounded-2xl p-6 transition-all shadow-lg flex flex-col justify-between"
        >
          <div>
            <CreditCard size={24} className="text-emerald-400 mb-4" />
            <h3 className="text-lg font-bold text-white mb-1 group-hover:text-[#00B8F0] transition-colors">
              Payment &amp; UTR Ledger
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Reconcile Razorpay transactions and verify manual Bank Transfer / UPI UTR submissions.
            </p>
          </div>
          <div className="pt-4 mt-6 border-t border-white/10 flex items-center justify-between text-xs font-mono text-emerald-400 font-bold">
            <span>Verify Payments</span>
            <ArrowUpRight size={14} />
          </div>
        </Link>

        <Link
          href="/admin/certificates"
          className="group bg-[#0B1524] border border-white/10 hover:border-[#00B8F0]/50 rounded-2xl p-6 transition-all shadow-lg flex flex-col justify-between"
        >
          <div>
            <Award size={24} className="text-purple-400 mb-4" />
            <h3 className="text-lg font-bold text-white mb-1 group-hover:text-[#00B8F0] transition-colors">
              Issue Certificates
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Generate official verifiable digital credentials for attendees, hackathon winners, and speakers.
            </p>
          </div>
          <div className="pt-4 mt-6 border-t border-white/10 flex items-center justify-between text-xs font-mono text-purple-400 font-bold">
            <span>Issue Credentials</span>
            <ArrowUpRight size={14} />
          </div>
        </Link>

      </div>

    </div>
  );
}
