"use client";

import React, { useState, useEffect } from "react";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Calendar, 
  Download, 
  Activity, 
  Zap, 
  Globe, 
  Eye, 
  Share2, 
  MessageSquare, 
  Sparkles, 
  Filter,
  Loader2,
  RefreshCw,
  Trophy,
  Flame,
  CheckCircle2,
  GraduationCap
} from "lucide-react";

export default function AnalyticsDashboardPage() {
  const [timeRange, setTimeRange] = useState("30d");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/analytics?timeRange=${timeRange}`);
      const json = await res.json();
      if (json.success) {
        setData(json.metrics);
      }
    } catch (e) {
      console.error("Failed to load live analytics:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const stats = [
    {
      label: "Registered Builders",
      value: data ? (data.totalStudents || 0).toLocaleString("en-IN") : "...",
      sub: `${data?.sortedColleges?.length || 0} Universities`,
      icon: Users,
      color: "text-emerald-600 bg-emerald-50",
    },
    {
      label: "Arena Project Enrollments",
      value: data ? (data.totalEnrollments || 0).toLocaleString("en-IN") : "...",
      sub: `${data?.difficultyBreakdown?.Insane || 0} Insane Tier`,
      icon: Flame,
      color: "text-[#0066FF] bg-blue-50",
    },
    {
      label: "Daily PoW Logs Submitted",
      value: data ? (data.totalDailyLogs || 0).toLocaleString("en-IN") : "...",
      sub: `${data?.totalUgcSubmissions || 0} LinkedIn Proofs`,
      icon: Activity,
      color: "text-purple-600 bg-purple-50",
    },
    {
      label: "Pass Revenue / Paid Conversions",
      value: data ? `₹${(data.totalPassRevenue || 0).toLocaleString("en-IN")}` : "...",
      sub: `${data?.totalPaidOrders || 0} Verified Passes`,
      icon: Zap,
      color: "text-amber-600 bg-amber-50",
    },
  ];

  const handleExportCSV = () => {
    if (!data) return;

    const rows = [
      ["Metric", "Value", "Notes"],
      ["Total Registered Students", data.totalStudents, "student_profiles collection"],
      ["Total Arena Enrollments", data.totalEnrollments, "arena_enrollments collection"],
      ["Insane Tier Enrollments", data.difficultyBreakdown?.Insane || 0, "Crucible PRDs"],
      ["Hard Tier Enrollments", data.difficultyBreakdown?.Hard || 0, "Advanced PRDs"],
      ["Intermediate Tier Enrollments", data.difficultyBreakdown?.Intermediate || 0, "Warmup PRDs"],
      ["Expert Championship Applicants", data.difficultyBreakdown?.["Expert Tier"] || 0, "Kernel eBPF"],
      ["Daily Standup PoW Logs", data.totalDailyLogs, "Daily commit records"],
      ["LinkedIn UGC Proofs", data.totalUgcSubmissions, "Career checklist verified"],
      ["Total Pass Revenue", `₹${data.totalPassRevenue}`, "Razorpay & verified payments"],
      ["Active Discussions", data.totalDiscussions, "Community forum threads"],
      ["Event Registrations", data.totalEventsRsvps, "Luma & onsite attendees"],
    ];

    if (data.sortedColleges && data.sortedColleges.length > 0) {
      rows.push(["", "", ""]);
      rows.push(["Top Colleges", "Student Count", ""]);
      data.sortedColleges.forEach((c: any) => {
        rows.push([c.name, c.count, ""]);
      });
    }

    const csvContent = "data:text/csv;charset=utf-8," + rows.map((e) => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `botmartz-live-telemetry-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="text-xs font-mono text-[#0066FF] uppercase font-bold tracking-wider mb-1 flex items-center gap-2">
            <Activity size={13} className="animate-pulse text-emerald-500" />
            <span>LIVE FIRESTORE TELEMETRY &amp; METRICS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-sans">
            Community Growth &amp; Engagement Analytics
          </h1>
          <p className="text-xs text-slate-500 font-mono mt-1">
            Real-time aggregates querying authentic student profiles, commit streaks, and verified pass revenue.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchAnalytics}
            className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 cursor-pointer transition-all"
            title="Refresh Live Metrics"
          >
            <RefreshCw size={14} className={loading ? "animate-spin text-[#0066FF]" : ""} />
          </button>

          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-700 shadow-2xs focus:outline-none cursor-pointer"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="1y">All Time (Active Cohort)</option>
          </select>

          <button
            onClick={handleExportCSV}
            disabled={loading || !data}
            className="bg-[#0066FF] hover:bg-[#0052CC] text-white px-4 py-2 rounded-xl font-mono text-xs font-bold uppercase transition-all shadow-xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Download size={14} /> Export Live CSV
          </button>
        </div>
      </div>

      {/* Top Real Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, idx) => (
          <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono text-slate-500 uppercase font-semibold">{s.label}</span>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${s.color}`}>
                <s.icon size={18} />
              </div>
            </div>
            <div className="text-3xl font-bold font-mono text-slate-900 mb-2">
              {loading ? <Loader2 size={24} className="animate-spin text-slate-400" /> : s.value}
            </div>
            <div className="text-[11px] font-mono text-slate-600 flex items-center gap-1 font-semibold">
              <CheckCircle2 size={12} className="text-emerald-500" />
              <span>{s.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Difficulty Breakdown & Track Health */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs font-mono text-xs">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900 font-sans">Arena Difficulty Breakdown &amp; Track Funnel</h2>
            <p className="text-xs text-slate-500 font-sans mt-0.5">Real-time enrollment distribution across 50 production systems.</p>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
            LIVE SYNC
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200">
            <div className="text-[10px] text-blue-700 uppercase font-bold mb-1">Intermediate Warmups</div>
            <div className="text-2xl font-bold text-slate-900">
              {data?.difficultyBreakdown?.Intermediate || 0}
            </div>
            <p className="text-[11px] text-slate-600 mt-1 font-sans">Foundational fullstack &amp; ETL warmups</p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200">
            <div className="text-[10px] text-amber-700 uppercase font-bold mb-1">Hard Production</div>
            <div className="text-2xl font-bold text-slate-900">
              {data?.difficultyBreakdown?.Hard || 0}
            </div>
            <p className="text-[11px] text-slate-600 mt-1 font-sans">Distributed pipelines &amp; SLM agents</p>
          </div>

          <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200">
            <div className="text-[10px] text-purple-700 uppercase font-bold mb-1">🔥 Insane Crucible Track</div>
            <div className="text-2xl font-bold text-slate-900">
              {data?.difficultyBreakdown?.Insane || 0}
            </div>
            <p className="text-[11px] text-slate-600 mt-1 font-sans">Founder Referral &amp; SLA Crucible</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 text-white border border-purple-500/40">
            <div className="text-[10px] text-purple-300 uppercase font-bold mb-1">Expert Championship</div>
            <div className="text-2xl font-bold text-amber-400">
              {data?.difficultyBreakdown?.["Expert Tier"] || 0}
            </div>
            <p className="text-[11px] text-slate-400 mt-1 font-sans">Kernel eBPF &amp; Sub-10µs Sandboxing</p>
          </div>
        </div>
      </div>

      {/* College & Role Distribution Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 font-mono text-xs">
        
        {/* Top Colleges */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 font-sans">Top Builder Colleges &amp; Campuses</h2>
              <p className="text-xs text-slate-500 font-sans mt-0.5">Institutions with the highest active shippers.</p>
            </div>
            <GraduationCap size={20} className="text-[#0066FF]" />
          </div>

          <div className="space-y-2.5 mt-4">
            {data?.sortedColleges && data.sortedColleges.length > 0 ? (
              data.sortedColleges.map((c: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="font-bold text-slate-800 font-sans truncate max-w-[280px]">
                    {idx + 1}. {c.name || "Independent Learner"}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-[#0066FF] font-bold">
                    {c.count} builders
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-slate-400 font-sans">
                Awaiting student profile university submissions...
              </div>
            )}
          </div>
        </div>

        {/* Top Squad Roles */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 font-sans">Role Representation</h2>
              <p className="text-xs text-slate-500 font-sans mt-0.5">Primary discipline chosen by enrolled builders.</p>
            </div>
            <Users size={20} className="text-purple-600" />
          </div>

          <div className="space-y-2.5 mt-4">
            {data?.sortedRoles && data.sortedRoles.length > 0 ? (
              data.sortedRoles.map((r: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="font-bold text-slate-800 font-sans">{r.name}</span>
                  <span className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 font-bold">
                    {r.count} slots
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-slate-400 font-sans">
                Awaiting role registrations...
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Recent Enrollment Activity */}
      {data?.recentActivity && data.recentActivity.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs font-mono text-xs">
          <h2 className="text-lg font-bold text-slate-900 font-sans mb-4">Recent Verified Enrollments</h2>
          <div className="divide-y divide-slate-100">
            {data.recentActivity.map((act: any) => (
              <div key={act.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="font-bold text-slate-900 font-sans">{act.name}</span>{" "}
                  <span className="text-slate-500 font-mono">({act.email})</span>
                  <p className="text-[11px] text-slate-600 font-sans mt-0.5">
                    Project: <strong>{act.projectTitle}</strong> &bull; Role: {act.role} &bull; Team: {act.teamType}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-[#0066FF] border border-blue-200">
                    {act.difficulty}
                  </span>
                  <div className="text-[10px] text-slate-400 mt-1">
                    {act.createdAt ? new Date(act.createdAt).toLocaleDateString("en-IN") : "Recent"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
