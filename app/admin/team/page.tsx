"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  ShieldCheck,
  UserPlus,
  Trophy,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Lock,
  Mail,
  Sparkles
} from "lucide-react";
import AdminSidebar from "../components/AdminSidebar";

export default function AdminTeamGovernancePage() {
  const [admins, setAdmins] = useState<any[]>([]);
  const [superAdminEmail, setSuperAdminEmail] = useState("soham@botmartz.com");
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Community Admin (Cohort Reviewer)");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const fetchTeam = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/team");
      const data = await res.json();
      if (data.admins) {
        setAdmins(data.admins);
      }
      if (data.superAdmin) {
        setSuperAdminEmail(data.superAdmin);
      }
    } catch (e) {
      console.error("Failed to load admin team:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");
    setStatusMsg("");

    try {
      const res = await fetch("/api/admin/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, role })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to add admin.");
      }

      setStatusMsg(data.message || "Admin approved by Founder Soham Sharma.");
      setName("");
      setEmail("");
      fetchTeam();
    } catch (err: any) {
      setErrorMsg(err.message || "Error adding admin.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-900 text-slate-100 font-mono">
      <AdminSidebar />

      <main className="flex-1 p-6 sm:p-10 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs text-amber-400 uppercase font-bold mb-1">
              <ShieldCheck size={16} /> Founder Governance Matrix
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              Admin Team &amp; Review Velocity KPIs
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Strict governance by Founder Soham Sharma ({superAdminEmail}). Maximum 5 approved cohort admins.
            </p>
          </div>

          <div className="px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Capacity: <strong>{admins.length} / 5 Admins</strong></span>
          </div>
        </div>

        {/* Top KPI Targets Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
            <div className="text-[11px] text-slate-400 uppercase font-bold mb-1">Review SLA Target</div>
            <div className="text-xl font-bold text-white">&lt; 12 Hours</div>
            <p className="text-[10px] text-emerald-400 mt-0.5">Daily PoW feedback SLA</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
            <div className="text-[11px] text-slate-400 uppercase font-bold mb-1">Bug Audit Velocity</div>
            <div className="text-xl font-bold text-white">100% Verified</div>
            <p className="text-[10px] text-blue-400 mt-0.5">Pentest CVE validation</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
            <div className="text-[11px] text-slate-400 uppercase font-bold mb-1">Office Hours Pres.</div>
            <div className="text-xl font-bold text-white">Every Saturday</div>
            <p className="text-[10px] text-amber-400 mt-0.5">Indore Hub + Discord Stage</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
            <div className="text-[11px] text-slate-400 uppercase font-bold mb-1">Founder Approval</div>
            <div className="text-xl font-bold text-rose-400">Strict Single Key</div>
            <p className="text-[10px] text-slate-400 mt-0.5">Zero mock credentials</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Active Admins List (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="p-6 rounded-3xl bg-slate-800/90 border border-slate-700 shadow-xl">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center justify-between">
                <span>Approved Community Admins ({admins.length})</span>
                <span className="text-xs text-slate-400">Governed by Soham Sharma</span>
              </h2>

              {loading ? (
                <div className="py-8 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
                  <Loader2 size={16} className="animate-spin" /> Loading team matrix...
                </div>
              ) : (
                <div className="space-y-4">
                  {admins.map((adm, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl bg-slate-900 border border-slate-700/80 text-xs"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-blue-600/30 border border-blue-500 text-blue-300 font-bold flex items-center justify-center">
                            {adm.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-white text-sm flex items-center gap-2">
                              <span>{adm.name}</span>
                              {adm.email === superAdminEmail && (
                                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/40">
                                  Founder &amp; Super Admin
                                </span>
                              )}
                            </div>
                            <span className="text-slate-400 text-[11px]">{adm.email}</span>
                          </div>
                        </div>

                        <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 text-[11px] border border-slate-700">
                          {adm.role}
                        </span>
                      </div>

                      {/* KPI Performance Metrics */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-slate-800 text-[11px]">
                        <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800">
                          <span className="text-slate-400 block">PoW Reviews:</span>
                          <span className="font-bold text-emerald-400">{adm.kpis?.reviewsCompleted ?? 0}</span>
                        </div>
                        <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800">
                          <span className="text-slate-400 block">Avg Response:</span>
                          <span className="font-bold text-blue-400">{adm.kpis?.avgReviewTimeHours ?? 4.2}h</span>
                        </div>
                        <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800">
                          <span className="text-slate-400 block">Bugs Verified:</span>
                          <span className="font-bold text-purple-400">{adm.kpis?.bugsVerified ?? 0}</span>
                        </div>
                        <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800">
                          <span className="text-slate-400 block">Office Hours:</span>
                          <span className="font-bold text-amber-400">{adm.kpis?.officeHoursAttended ?? 0}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Add / Approve Admin Form (1 col) */}
          <div>
            <div className="p-6 rounded-3xl bg-slate-800/90 border border-slate-700 shadow-xl">
              <div className="flex items-center gap-2 text-xs text-amber-400 uppercase font-bold mb-2">
                <UserPlus size={15} /> Founder Authorization
              </div>
              <h2 className="text-base font-bold text-white mb-2">
                Approve New Admin
              </h2>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                Only Founder Soham Sharma can approve additional cohort reviewers. Limit 5 total admins.
              </p>

              <form onSubmit={handleAddAdmin} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Admin Full Name:</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Priyanshu Sharma"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Admin Email:</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. priyanshu@botmartz.com"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Role Track:</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Cohort Reviewer & Evaluator">Cohort Reviewer &amp; Evaluator</option>
                    <option value="Cybersecurity Bug Auditor">Cybersecurity Bug Auditor</option>
                    <option value="Indore Hub Event Host">Indore Hub Event Host</option>
                    <option value="Discord Community Lead">Discord Community Lead</option>
                  </select>
                </div>

                {statusMsg && (
                  <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[11px] flex items-center gap-1.5">
                    <CheckCircle2 size={13} className="shrink-0" />
                    <span>{statusMsg}</span>
                  </div>
                )}

                {errorMsg && (
                  <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-[11px] flex items-center gap-1.5">
                    <AlertCircle size={13} className="shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting || admins.length >= 5}
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  {isSubmitting ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <>
                      <Lock size={13} />
                      <span>Authorize &amp; Approve Admin</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
