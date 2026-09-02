"use client";

import React, { useState } from "react";
import {
  Lock,
  Unlock,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  ShieldCheck,
  Layers,
  Terminal,
  Save
} from "lucide-react";
import { PageLockConfig, PageLockMode } from "@/lib/page-locks";

const ALL_POSSIBLE_ROUTES = [
  { path: "/arena", name: "Internship Playground (50 PRDs Matrix)", desc: "Engineering system PRDs, SLA benchmarks, and daily standups" },
  { path: "/virtual-ai-internship", name: "45-Day Virtual AI Fellowship Page", desc: "Curriculum roadmap and 3-tier track selection" },
  { path: "/challenges", name: "Algorithmic Challenges & Sandboxes", desc: "Coding tests and live automated evaluators" },
  { path: "/discussions", name: "Community Discussions", desc: "Public discussion boards and architecture questions" },
  { path: "/magazine", name: "Research Magazine & Whitepapers", desc: "Technical engineering deep dives" },
  { path: "/showcase", name: "Project Showcase Gallery", desc: "Community project submissions and demos" },
  { path: "/leaderboard", name: "Karma Leaderboard", desc: "Student reputation rankings and scores" },
  { path: "/member", name: "Member Directory & Profiles", desc: "Searchable builder profiles and badges" },
  { path: "/product-tour", name: "Platform Guide & Tour", desc: "Interactive feature walkthrough" }
];

export default function PageLocksClientManager({ initialConfig }: { initialConfig: PageLockConfig }) {
  const [mode, setMode] = useState<PageLockMode>(initialConfig.mode || "WORKSHOP_FOCUS");
  const [scheduledUnlockTime, setScheduledUnlockTime] = useState(
    initialConfig.scheduledUnlockTime || "2026-09-14T10:00:00+05:30"
  );
  const [announcementTitle, setAnnouncementTitle] = useState(
    initialConfig.announcementTitle || "Upcoming Workshop Cohort Launch"
  );
  const [announcementMessage, setAnnouncementMessage] = useState(
    initialConfig.announcementMessage ||
      "This section is currently restricted and will unlock during the upcoming Live AI Engineering Workshop. Register now for the flagship workshop to secure your seat and receive early VIP platform access."
  );
  const [lockedRoutes, setLockedRoutes] = useState<string[]>(
    initialConfig.lockedRoutes || ALL_POSSIBLE_ROUTES.map((r) => r.path)
  );

  const [saving, setSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const toggleRouteLock = (path: string) => {
    if (lockedRoutes.includes(path)) {
      setLockedRoutes(lockedRoutes.filter((p) => p !== path));
    } else {
      setLockedRoutes([...lockedRoutes, path]);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setToastMsg("");
    setErrorMsg("");

    try {
      const res = await fetch("/api/admin/page-locks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode,
          scheduledUnlockTime,
          announcementTitle,
          announcementMessage,
          lockedRoutes
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to update page lock configuration.");
      }

      setToastMsg("✔ Page lock configuration successfully deployed and synced with Firestore!");
      setTimeout(() => setToastMsg(""), 4000);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to save configuration.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 font-sans">
      
      {/* ── 1. GLOBAL MODE SELECTOR ── */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-mono text-[#0066FF] uppercase font-bold mb-2">
          <ShieldCheck size={14} />
          <span>Step 1: Choose Active Operating Mode</span>
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-4 font-sans">Platform Access Mode</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
          
          {/* WORKSHOP FOCUS */}
          <div
            onClick={() => setMode("WORKSHOP_FOCUS")}
            className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
              mode === "WORKSHOP_FOCUS"
                ? "border-[#0066FF] bg-blue-50/70 shadow-sm"
                : "border-slate-200 bg-slate-50 hover:border-slate-300"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-slate-900 font-sans text-sm">Workshop Focus Mode</span>
                <span className="px-2 py-0.5 rounded bg-blue-100 text-[#0066FF] text-[10px] font-bold">Recommended</span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed mb-4">
                Locks sub-pages and redirects/focuses all visitors to the Flagship Workshop Landing &amp; Payment on <code>/</code>.
              </p>
            </div>
            <div className="text-[11px] font-bold text-[#0066FF] flex items-center gap-1">
              <Lock size={13} />
              <span>Sub-pages Locked (Workshop Active)</span>
            </div>
          </div>

          {/* SCHEDULED RELEASE */}
          <div
            onClick={() => setMode("SCHEDULED_RELEASE")}
            className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
              mode === "SCHEDULED_RELEASE"
                ? "border-amber-500 bg-amber-50/70 shadow-sm"
                : "border-slate-200 bg-slate-50 hover:border-slate-300"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-slate-900 font-sans text-sm">Scheduled Release</span>
                <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">Countdown</span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed mb-4">
                Displays live countdown timer on locked pages until the scheduled unlock date/time arrives, then unlocks automatically.
              </p>
            </div>
            <div className="text-[11px] font-bold text-amber-700 flex items-center gap-1">
              <Clock size={13} />
              <span>Auto-Unlocks at Target Date</span>
            </div>
          </div>

          {/* OPEN ACCESS */}
          <div
            onClick={() => setMode("OPEN_ACCESS")}
            className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
              mode === "OPEN_ACCESS"
                ? "border-emerald-600 bg-emerald-50/70 shadow-sm"
                : "border-slate-200 bg-slate-50 hover:border-slate-300"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-slate-900 font-sans text-sm">Open Access</span>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">Public</span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed mb-4">
                All pages (Arena, Fellowship, Discussions, Magazine, Leaderboard) are fully open and accessible to all visitors.
              </p>
            </div>
            <div className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
              <Unlock size={13} />
              <span>100% Unlocked</span>
            </div>
          </div>

        </div>
      </div>

      {/* ── 2. SCHEDULE & ANNOUNCEMENT CUSTOMIZATION ── */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-mono text-[#0066FF] uppercase font-bold mb-2">
          <Calendar size={14} />
          <span>Step 2: Schedule &amp; Lock Banner Copy</span>
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-4 font-sans">Schedule &amp; Announcement Details</h2>

        <div className="space-y-4 font-mono text-xs">
          
          <div>
            <label className="block text-slate-700 font-bold mb-1">
              Scheduled Unlock Timestamp (ISO 8601 Format / Date-Time)
            </label>
            <input
              type="text"
              value={scheduledUnlockTime}
              onChange={(e) => setScheduledUnlockTime(e.target.value)}
              placeholder="2026-09-14T10:00:00+05:30"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
            />
            <p className="text-[10px] text-slate-400 mt-1">
              Current Target: <strong>{new Date(scheduledUnlockTime).toString()}</strong>
            </p>
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Announcement Headline</label>
            <input
              type="text"
              value={announcementTitle}
              onChange={(e) => setAnnouncementTitle(e.target.value)}
              placeholder="Upcoming Workshop Cohort Launch"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Announcement Message (Displayed on Lock Screen)</label>
            <textarea
              rows={3}
              value={announcementMessage}
              onChange={(e) => setAnnouncementMessage(e.target.value)}
              placeholder="This section is currently restricted and will unlock during the upcoming Live AI Engineering Workshop..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
            />
          </div>

        </div>
      </div>

      {/* ── 3. INDIVIDUAL ROUTE LOCK SELECTOR ── */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#0066FF] uppercase font-bold mb-1">
              <Layers size={14} />
              <span>Step 3: Route Lock Matrix</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 font-sans">Individual Page Locks</h2>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <button
              onClick={() => setLockedRoutes(ALL_POSSIBLE_ROUTES.map((r) => r.path))}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer"
            >
              Lock All
            </button>
            <button
              onClick={() => setLockedRoutes([])}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer"
            >
              Unlock All
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-xs">
          {ALL_POSSIBLE_ROUTES.map((r) => {
            const isLocked = lockedRoutes.includes(r.path);
            return (
              <div
                key={r.path}
                onClick={() => toggleRouteLock(r.path)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                  isLocked
                    ? "bg-rose-50/50 border-rose-200 text-slate-900"
                    : "bg-emerald-50/50 border-emerald-200 text-slate-900"
                }`}
              >
                <div>
                  <div className="font-bold font-sans text-sm flex items-center gap-1.5">
                    <span>{r.name}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono mt-0.5">{r.path}</div>
                  <div className="text-[10px] text-slate-400 mt-1">{r.desc}</div>
                </div>

                <div className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase shrink-0 flex items-center gap-1 ${
                  isLocked
                    ? "bg-rose-100 text-rose-800"
                    : "bg-emerald-100 text-emerald-800"
                }`}>
                  {isLocked ? (
                    <>
                      <Lock size={11} />
                      <span>LOCKED</span>
                    </>
                  ) : (
                    <>
                      <Unlock size={11} />
                      <span>OPEN</span>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── SAVE ACTION & TOAST ── */}
      <div className="sticky bottom-6 z-40 bg-white/95 backdrop-blur-md border border-slate-300 rounded-3xl p-4 sm:p-5 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
        <div>
          <div className="font-bold text-slate-900 font-sans text-sm">
            Active Mode: <span className="text-[#0066FF] uppercase">{mode}</span> ({lockedRoutes.length} Locked Routes)
          </div>
          <p className="text-[11px] text-slate-500">
            Changes will take effect instantly across the entire platform.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {toastMsg && (
            <div className="text-emerald-700 font-bold text-xs flex items-center gap-1.5 animate-in fade-in">
              <CheckCircle2 size={15} />
              <span>{toastMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="text-rose-600 font-bold text-xs flex items-center gap-1.5">
              <AlertCircle size={15} />
              <span>{errorMsg}</span>
            </div>
          )}

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full sm:w-auto px-8 py-3.5 bg-[#0066FF] hover:bg-[#0052CC] text-white font-bold uppercase tracking-wider rounded-2xl transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Deploying Changes...</span>
              </>
            ) : (
              <>
                <Save size={16} />
                <span>Save &amp; Deploy Settings</span>
              </>
            )}
          </button>
        </div>
      </div>

    </div>
  );
}
