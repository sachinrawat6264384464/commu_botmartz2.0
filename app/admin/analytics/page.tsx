"use client";

import React, { useState } from "react";
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
  Filter
} from "lucide-react";

export default function AnalyticsDashboardPage() {
  const [timeRange, setTimeRange] = useState("30d");

  const STATS = [
    { label: "Total Community Reach", value: "14,820", change: "+28.4%", icon: Eye, color: "text-[#0066FF] bg-blue-50" },
    { label: "Active Registered Builders", value: "2,410", change: "+18.2%", icon: Users, color: "text-emerald-600 bg-emerald-50" },
    { label: "Weekly Ritual Participation", value: "680+", change: "+35.0%", icon: Activity, color: "text-purple-600 bg-purple-50" },
    { label: "Pass Revenue / Conversions", value: "₹4,12,000", change: "+42.5%", icon: Zap, color: "text-amber-600 bg-amber-50" },
  ];

  const RITUAL_METRICS = [
    {
      ritual: "Showcase Thursdays",
      cadence: "Every Thursday",
      attendees: "340 Active Watchers",
      projectsShipped: "18 Builds / week",
      avgUpvotes: "64 upvotes / project",
      health: "98% High Engagement"
    },
    {
      ritual: "Resume & Portfolio Review",
      cadence: "Every Wednesday",
      attendees: "120 Submissions Reviewed",
      projectsShipped: "24 Offers Received",
      avgUpvotes: "1-on-1 Feedback",
      health: "100% Slot Fullness"
    },
    {
      ritual: "Monthly AI Architect AMA",
      cadence: "Every 3rd Saturday",
      attendees: "520 RSVPs",
      projectsShipped: "45 Q&As answered live",
      avgUpvotes: "96% 5-Star Rating",
      health: "Next: Sept 19, 2026"
    }
  ];

  const CITY_DATA = [
    { city: "Indore (Host Hub)", builders: 720, share: "29.8%" },
    { city: "Bangalore", builders: 540, share: "22.4%" },
    { city: "Pune", builders: 380, share: "15.7%" },
    { city: "Mumbai", builders: 310, share: "12.8%" },
    { city: "Delhi NCR", builders: 260, share: "10.7%" },
    { city: "International / Remote", builders: 200, share: "8.6%" },
  ];

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Metric,Value,Period\n" +
      "Community Reach,14820,Last 30 Days\n" +
      "Active Builders,2410,Last 30 Days\n" +
      "Showcase Thursdays Avg,340,Weekly\n" +
      "Wednesday Resume Reviews,120,Weekly\n" +
      "Monthly AMAs RSVPs,520,Monthly\n";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `botmartz-community-analytics-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="text-xs font-mono text-[#0066FF] uppercase font-bold tracking-wider mb-1">
            EXECUTIVE TELEMETRY &amp; SCALE METRICS
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Community Growth &amp; Engagement Analytics</h1>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-700 shadow-2xs focus:outline-none"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="1y">All Time</option>
          </select>

          <button
            onClick={handleExportCSV}
            className="bg-[#0066FF] hover:bg-[#0052CC] text-white px-4 py-2 rounded-xl font-mono text-xs font-bold uppercase transition-all shadow-sm flex items-center gap-2 cursor-pointer"
          >
            <Download size={14} /> Export CSV Report
          </button>
        </div>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {STATS.map((s, idx) => (
          <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono text-slate-500 uppercase">{s.label}</span>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${s.color}`}>
                <s.icon size={18} />
              </div>
            </div>
            <div className="text-3xl font-bold font-mono text-slate-900 mb-2">{s.value}</div>
            <div className="text-[11px] font-mono text-emerald-600 flex items-center gap-1 font-bold">
              <TrendingUp size={12} />
              <span>{s.change} vs previous period</span>
            </div>
          </div>
        ))}
      </div>

      {/* Weekly Community Rituals Telemetry */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Community Ritual Performance</h2>
            <p className="text-xs text-slate-500">Live metrics across Showcase Thursdays, Wednesday Resume Teardowns, and 3rd Saturday AMAs.</p>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono text-[10px] font-bold">
            ALL RITUALS ACTIVE
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {RITUAL_METRICS.map((r, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-[#0066FF] font-bold uppercase">{r.cadence}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white text-slate-600 border border-slate-200 font-bold">
                    {r.health}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-4">{r.ritual}</h3>
                
                <div className="space-y-2 text-xs font-mono text-slate-600">
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-400">Participation:</span>
                    <span className="font-bold text-slate-800">{r.attendees}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-400">Output Metric:</span>
                    <span className="font-bold text-purple-700">{r.projectsShipped}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Quality Score:</span>
                    <span className="font-bold text-emerald-600">{r.avgUpvotes}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Conversion Funnel & Geographic Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Pass Conversion Funnel */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
          <h2 className="text-lg font-bold text-slate-900 mb-2">Summit &amp; Cohort Conversion Funnel</h2>
          <p className="text-xs text-slate-500 mb-6">Visitor journey to paid pass ticket confirmation.</p>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-slate-600 font-semibold">1. Landing Page Views</span>
                <span className="text-slate-900 font-bold">14,820 (100%)</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-[#0066FF] rounded-full" style={{ width: "100%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-slate-600 font-semibold">2. Viewed Event / Pass Tiers</span>
                <span className="text-slate-900 font-bold">6,240 (42.1%)</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-[#0092D7] rounded-full" style={{ width: "42.1%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-slate-600 font-semibold">3. Checkout Initiated (Razorpay / UPI)</span>
                <span className="text-slate-900 font-bold">890 (6.0%)</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-purple-600 rounded-full" style={{ width: "6%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-slate-600 font-semibold">4. Confirmed &amp; Ticket Issued</span>
                <span className="text-emerald-600 font-bold">520 (3.5%)</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: "3.5%" }} />
              </div>
            </div>
          </div>
        </div>

        {/* Geographic Distribution */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900">Builder Demographics by Hub</h2>
            <Globe size={18} className="text-slate-400" />
          </div>
          <p className="text-xs text-slate-500 mb-6">Top metropolitan centers representing registered AI engineers.</p>

          <div className="space-y-3">
            {CITY_DATA.map((c, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                <span className="font-bold text-slate-800">{c.city}</span>
                <div className="flex items-center gap-4 font-mono">
                  <span className="text-slate-600">{c.builders} builders</span>
                  <span className="text-[#0066FF] font-bold">{c.share}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
