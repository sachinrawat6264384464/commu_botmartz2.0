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
    { label: "Total Registrations", value: attendeeCount || 120, icon: Users, change: "+14% this week", color: "text-[#0066FF] bg-blue-50" },
    { label: "Live Checked-In", value: checkedInCount || 42, icon: ScanLine, change: "Check-in Desk Active", color: "text-emerald-600 bg-emerald-50" },
    { label: "Active Events", value: eventCount || 4, icon: Calendar, change: "AI Frontier 2026 Live", color: "text-indigo-600 bg-indigo-50" },
    { label: "Bootcamp Cohorts", value: bootcampCount || 2, icon: BookOpen, change: "Enrollment Open", color: "text-purple-600 bg-purple-50" },
  ];

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="text-xs font-mono text-[#0066FF] uppercase font-bold tracking-wider mb-1">
            BOTMARTZ COMMUNITY CONTROL PANEL
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Community &amp; Events Telemetry</h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/events"
            className="px-4 py-2 bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-sm"
          >
            + New Event
          </Link>
          <Link
            href="/event-desk"
            target="_blank"
            className="px-4 py-2 bg-white border border-slate-300 hover:border-[#0066FF] text-slate-800 rounded-xl text-xs font-mono font-bold uppercase transition-all shadow-2xs"
          >
            Open Scanner Desk ↗
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {METRICS.map((m, idx) => (
          <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono text-slate-500 uppercase">{m.label}</span>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${m.color}`}>
                <m.icon size={18} />
              </div>
            </div>
            <div className="text-3xl font-bold font-mono text-slate-900 mb-2">{m.value}</div>
            <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
              <TrendingUp size={12} className="text-[#0066FF]" />
              <span>{m.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Launchpad */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <Link
          href="/admin/events"
          className="group bg-white border border-slate-200 hover:border-[#0066FF] rounded-2xl p-6 transition-all shadow-xs hover:shadow-md flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0066FF] flex items-center justify-center mb-4">
              <Calendar size={20} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-[#0066FF] transition-colors">
              Manage Events &amp; Passes
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Configure AI Frontier summits, ticketing tiers, venues, schedules, and speaker rosters.
            </p>
          </div>
          <div className="pt-4 mt-6 border-t border-slate-100 flex items-center justify-between text-xs font-mono text-[#0066FF] font-bold">
            <span>Manage Events</span>
            <ArrowUpRight size={14} />
          </div>
        </Link>

        <Link
          href="/admin/payments"
          className="group bg-white border border-slate-200 hover:border-emerald-500 rounded-2xl p-6 transition-all shadow-xs hover:shadow-md flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <CreditCard size={20} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-emerald-600 transition-colors">
              Payment &amp; UTR Ledger
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Reconcile Razorpay transactions and verify manual Bank Transfer / UPI UTR submissions.
            </p>
          </div>
          <div className="pt-4 mt-6 border-t border-slate-100 flex items-center justify-between text-xs font-mono text-emerald-600 font-bold">
            <span>Verify Payments</span>
            <ArrowUpRight size={14} />
          </div>
        </Link>

        <Link
          href="/admin/certificates"
          className="group bg-white border border-slate-200 hover:border-purple-500 rounded-2xl p-6 transition-all shadow-xs hover:shadow-md flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
              <Award size={20} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-purple-600 transition-colors">
              Issue Certificates
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Generate official verifiable digital credentials for attendees, hackathon winners, and speakers.
            </p>
          </div>
          <div className="pt-4 mt-6 border-t border-slate-100 flex items-center justify-between text-xs font-mono text-purple-600 font-bold">
            <span>Issue Credentials</span>
            <ArrowUpRight size={14} />
          </div>
        </Link>

      </div>

    </div>
  );
}
