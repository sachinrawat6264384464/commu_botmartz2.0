"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Activity,
  Terminal,
  Coins,
  Layers,
  FileText,
  User,
  Sparkles,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Filter,
  Clock,
  ArrowUpRight,
  ArrowDownLeft,
  Loader2
} from "lucide-react";

export default function AdminActivityStreamPage() {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const loadActivities = async (selectedFilter = filter) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/activity?filter=${selectedFilter}`);
      const data = await res.json();
      if (data.success) {
        setActivities(data.activities || []);
      }
    } catch (e) {
      console.warn("Failed to load activity stream:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadActivities(filter);
  }, [filter]);

  const filteredList = activities.filter((act) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      act.title?.toLowerCase().includes(q) ||
      act.userEmail?.toLowerCase().includes(q) ||
      act.details?.toLowerCase().includes(q) ||
      act.type?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-6 sm:p-8 space-y-8 font-sans text-slate-900">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#0066FF] font-mono text-xs font-bold uppercase mb-2 border border-blue-200">
            <Activity size={14} /> Real-Time Activity Ledger
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Platform-Wide Activity Stream
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-mono mt-1">
            Real-time audit trails of daily Git commits, hint unlocks, project enrollments, custom PRD proposals, and wallet transactions.
          </p>
        </div>

        <button
          onClick={() => loadActivities(filter)}
          className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
        >
          <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
          <span>Refresh Stream</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 font-mono text-xs">
        <div className="flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by student email, commit description, or project name..."
            className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-900 outline-none focus:border-[#0066FF] shadow-2xs font-mono"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 shrink-0">
          {[
            { id: "ALL", label: "All Activity" },
            { id: "DAILY_LOGS", label: "Daily Logs" },
            { id: "WALLET", label: "Wallet & Hints" },
            { id: "ENROLLMENTS", label: "Enrollments" },
            { id: "PROPOSALS", label: "Custom PRDs" }
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-3.5 py-2.5 rounded-xl font-bold transition-all shrink-0 cursor-pointer ${
                filter === f.id
                  ? "bg-[#0066FF] text-white shadow-xs"
                  : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Activity Timeline List */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs font-mono text-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <span className="font-bold text-slate-900">Total Filtered Events: {filteredList.length}</span>
          <span className="text-[11px] text-slate-400">Auto-Refreshed via Firestore</span>
        </div>

        {loading ? (
          <div className="py-16 text-center text-slate-400 flex flex-col items-center gap-3">
            <Loader2 size={24} className="animate-spin text-[#0066FF]" />
            <span>Loading live event stream...</span>
          </div>
        ) : filteredList.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            No activities found matching the selected filter.
          </div>
        ) : (
          <div className="space-y-3">
            {filteredList.map((act) => {
              let Icon = Activity;
              let iconBg = "bg-blue-100 text-blue-700";

              if (act.type === "DAILY_LOG") {
                Icon = Terminal;
                iconBg = "bg-emerald-100 text-emerald-700";
              } else if (act.type === "WALLET_TX") {
                Icon = Coins;
                iconBg = "bg-amber-100 text-amber-700";
              } else if (act.type === "ENROLLMENT") {
                Icon = Layers;
                iconBg = "bg-purple-100 text-purple-700";
              } else if (act.type === "CUSTOM_PROPOSAL") {
                Icon = FileText;
                iconBg = "bg-cyan-100 text-cyan-700";
              }

              return (
                <div
                  key={act.id}
                  className="p-4 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3.5 overflow-hidden">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${iconBg}`}>
                      <Icon size={16} />
                    </div>

                    <div className="space-y-1 overflow-hidden">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-slate-900 font-sans text-sm">{act.title}</span>
                        {act.reward && (
                          <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 font-bold text-[10px]">
                            {act.reward}
                          </span>
                        )}
                      </div>

                      <div className="text-[11px] text-slate-600 truncate max-w-xl">
                        {act.details}
                      </div>

                      <div className="flex items-center gap-3 text-[10px] text-slate-400 flex-wrap">
                        <span className="text-blue-600 font-bold">{act.userEmail}</span>
                        <span>•</span>
                        <span>{new Date(act.timestamp).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {act.commitUrl && (
                      <a
                        href={act.commitUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 hover:border-slate-900 text-slate-800 font-bold text-[10px] transition-all flex items-center gap-1"
                      >
                        <span>View Commit</span>
                        <ExternalLink size={10} />
                      </a>
                    )}
                    <Link
                      href={`/admin/wallets`}
                      className="px-3 py-1.5 rounded-xl bg-blue-50 text-[#0066FF] hover:bg-blue-100 font-bold text-[10px] transition-all"
                    >
                      Audit Wallet
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

    </div>
  );
}
