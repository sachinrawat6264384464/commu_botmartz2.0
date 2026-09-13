"use client";

import React, { useEffect, useState } from "react";
import { Activity, Users, Eye, TrendingUp, RefreshCw, Layers, ShieldCheck, Zap, ArrowRight, Compass } from "lucide-react";

export default function AdminAnalyticsDashboard() {
  const [metrics, setMetrics] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/analytics");
      const data = await res.json();
      if (data.success) {
        setMetrics(data.metrics);
        setEvents(data.recentEvents || []);
      }
    } catch (err) {
      console.error("Failed to load admin analytics telemetry", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  // 10s auto-refresh interval for live telemetry
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      fetchAnalyticsData();
    }, 10000);
    return () => clearInterval(interval);
  }, [autoRefresh]);

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="text-xs font-mono text-[#0066FF] uppercase font-bold tracking-wider mb-1">
            REAL-TIME TELEMETRY & PRODUCT ANALYTICS
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Live Platform Analytics & Funnels</h1>
          <p className="text-xs text-slate-500 font-mono mt-1">
            GTM + GA4 + Firebase + Real-time Firestore Telemetry Pipeline
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-3 py-2 rounded-xl text-xs font-mono font-bold uppercase transition-all flex items-center gap-2 border ${
              autoRefresh
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-slate-100 text-slate-600 border-slate-200"
            }`}
          >
            <div className={`h-2 w-2 rounded-full ${autoRefresh ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`} />
            <span>Auto Refresh: {autoRefresh ? "ON (10s)" : "OFF"}</span>
          </button>

          <button
            onClick={fetchAnalyticsData}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all"
            title="Refresh Data"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-slate-500 uppercase font-bold">Active Users (30m)</span>
            <div className="h-8 w-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="text-3xl font-black font-mono text-emerald-600">{metrics?.activeUsers30m ?? 0}</div>
          <div className="text-[11px] font-mono text-slate-500 mt-1 font-semibold">Live Active Sessions</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-slate-500 uppercase font-bold">Total Page Views</span>
            <div className="h-8 w-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Eye className="h-4 w-4" />
            </div>
          </div>
          <div className="text-3xl font-black font-mono text-slate-900">{metrics?.totalPageViews ?? 0}</div>
          <div className="text-[11px] font-mono text-slate-500 mt-1 font-semibold">Tracked Route Changes</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-slate-500 uppercase font-bold">Events Logged</span>
            <div className="h-8 w-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Activity className="h-4 w-4" />
            </div>
          </div>
          <div className="text-3xl font-black font-mono text-slate-900">{metrics?.totalEventsRecorded ?? 0}</div>
          <div className="text-[11px] font-mono text-slate-500 mt-1 font-semibold">Telemetry Ingested</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-slate-500 uppercase font-bold">Conversion Rate</span>
            <div className="h-8 w-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="text-3xl font-black font-mono text-amber-600">
            {metrics?.totalPageViews
              ? `${(((metrics?.funnel?.newsletterSubs + metrics?.funnel?.signups) / metrics.totalPageViews) * 100).toFixed(1)}%`
              : "0.0%"}
          </div>
          <div className="text-[11px] font-mono text-slate-500 mt-1 font-semibold">Visitor to Lead Ratio</div>
        </div>
      </div>

      {/* Main Grid: Conversion Funnel & Top Pages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* User Conversion Funnel */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Compass className="h-5 w-5 text-[#0066FF]" />
            <h2 className="text-lg font-bold text-slate-900">User Journey & Conversion Funnel</h2>
          </div>
          <p className="text-xs text-slate-500">
            Step-by-step visitor progression from landing page to proof-of-work daily standup submission.
          </p>

          <div className="space-y-3 pt-2 font-mono text-xs">
            <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="h-6 w-6 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-xs">1</span>
                <div>
                  <div className="font-bold text-slate-900">Homepage / Landing Visit</div>
                  <div className="text-[10px] text-slate-500">Path: /</div>
                </div>
              </div>
              <span className="text-sm font-bold text-slate-900">{metrics?.funnel?.landingPageViews ?? 0}</span>
            </div>

            <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="h-6 w-6 rounded-lg bg-purple-600 text-white font-bold flex items-center justify-center text-xs">2</span>
                <div>
                  <div className="font-bold text-slate-900">AI Internship / Arena PRD Catalog</div>
                  <div className="text-[10px] text-slate-500">Path: /virtual-ai-internship &amp; /arena</div>
                </div>
              </div>
              <span className="text-sm font-bold text-slate-900">
                {(metrics?.funnel?.internshipViews || 0) + (metrics?.funnel?.arenaViews || 0)}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="h-6 w-6 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center text-xs">3</span>
                <div>
                  <div className="font-bold text-slate-900">Conversions (Newsletter &amp; Signups)</div>
                  <div className="text-[10px] text-slate-500">Newsletter + Account Registrations</div>
                </div>
              </div>
              <span className="text-sm font-bold text-emerald-600">
                {(metrics?.funnel?.newsletterSubs || 0) + (metrics?.funnel?.signups || 0)}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="h-6 w-6 rounded-lg bg-amber-600 text-white font-bold flex items-center justify-center text-xs">4</span>
                <div>
                  <div className="font-bold text-slate-900">Daily Proof-of-Work Log Submissions</div>
                  <div className="text-[10px] text-slate-500">Event: daily_log_submitted</div>
                </div>
              </div>
              <span className="text-sm font-bold text-amber-600">{metrics?.funnel?.dailyLogs ?? 0}</span>
            </div>
          </div>
        </div>

        {/* Top Pages Breakdown */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Top Visited Routes</h2>
            <span className="text-xs font-mono text-slate-400">Pageview Leaderboard</span>
          </div>

          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1 font-mono text-xs">
            {metrics?.topPages && Object.keys(metrics.topPages).length > 0 ? (
              Object.entries(metrics.topPages).map(([path, count]: [string, any]) => (
                <div key={path} className="p-3 rounded-2xl border border-slate-100 bg-slate-50 flex items-center justify-between">
                  <span className="font-bold text-slate-800 truncate max-w-[280px]">{path}</span>
                  <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 font-bold border border-blue-100">
                    {count} views
                  </span>
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-slate-400">No page views recorded yet.</div>
            )}
          </div>
        </div>
      </div>

      {/* Live Telemetry Event Audit Trail */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Live Telemetry Event Audit Stream</h2>
          <span className="text-xs font-mono text-slate-400">Last 30 Events</span>
        </div>

        <div className="space-y-2.5 max-h-[400px] overflow-y-auto pr-1 font-mono text-xs">
          {events.length === 0 ? (
            <div className="py-12 text-center text-slate-400">No telemetry events logged yet.</div>
          ) : (
            events.map((ev) => (
              <div key={ev.id} className="p-3 rounded-2xl border border-slate-100 bg-slate-50 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 overflow-hidden">
                  <span
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold shrink-0 ${
                      ev.eventName === "page_view"
                        ? "bg-blue-100 text-blue-700"
                        : ev.eventName === "newsletter_subscribed"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-purple-100 text-purple-700"
                    }`}
                  >
                    {ev.eventName}
                  </span>
                  <span className="font-bold text-slate-800 truncate">{ev.pagePath || "/"}</span>
                  <span className="text-[11px] text-slate-400 truncate">ID: {ev.anonymousId?.slice(0, 14)}...</span>
                </div>

                <span className="text-[10px] text-slate-400 shrink-0">
                  {ev.timestamp ? new Date(ev.timestamp).toLocaleTimeString() : ""}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
