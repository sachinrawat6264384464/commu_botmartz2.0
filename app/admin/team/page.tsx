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
  Sparkles,
  Plus,
  Check,
  Tag,
  Key
} from "lucide-react";

interface CustomRole {
  id: string;
  name: string;
  description: string;
  permissions: {
    canManageWallets: boolean;
    canReviewLogs: boolean;
    canIssueCertificates: boolean;
    canModerateDiscussions: boolean;
    canManageEvents: boolean;
    canViewAnalytics: boolean;
  };
}

export default function AdminTeamGovernancePage() {
  const [admins, setAdmins] = useState<any[]>([]);
  const [superAdminEmail, setSuperAdminEmail] = useState("soham@botmartz.com");
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Cohort Reviewer & Evaluator");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Custom Roles State
  const [customRoles, setCustomRoles] = useState<CustomRole[]>([
    {
      id: "cohort-reviewer",
      name: "Cohort Reviewer & Evaluator",
      description: "Reviews daily GitHub proof-of-work logs and grants daily Karma Coins",
      permissions: { canManageWallets: true, canReviewLogs: true, canIssueCertificates: false, canModerateDiscussions: true, canManageEvents: true, canViewAnalytics: true }
    },
    {
      id: "payment-auditor",
      name: "Finance & Karma Coins Auditor",
      description: "Manages student wallets, verifies UPI transactions, and handles coin grants",
      permissions: { canManageWallets: true, canReviewLogs: false, canIssueCertificates: false, canModerateDiscussions: false, canManageEvents: false, canViewAnalytics: true }
    },
    {
      id: "qa-lead",
      name: "Lead Technical Reviewer & QA",
      description: "Audits architectural PRDs, k6 test assertions, and Docker deployments",
      permissions: { canManageWallets: false, canReviewLogs: true, canIssueCertificates: true, canModerateDiscussions: true, canManageEvents: true, canViewAnalytics: true }
    }
  ]);

  // Modal to create custom role
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleDesc, setNewRoleDesc] = useState("");
  const [newRolePerms, setNewRolePerms] = useState({
    canManageWallets: true,
    canReviewLogs: true,
    canIssueCertificates: false,
    canModerateDiscussions: true,
    canManageEvents: false,
    canViewAnalytics: true
  });

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

  const handleCreateCustomRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleName.trim()) return;

    const createdRole: CustomRole = {
      id: newRoleName.toLowerCase().replace(/[^a-z0-9]/g, "-"),
      name: newRoleName.trim(),
      description: newRoleDesc.trim() || "Custom community admin role with granular permissions",
      permissions: { ...newRolePerms }
    };

    setCustomRoles((prev) => [...prev, createdRole]);
    setRole(createdRole.name);
    setShowRoleModal(false);
    setNewRoleName("");
    setNewRoleDesc("");
  };

  return (
    <div className="text-slate-100 font-mono max-w-7xl space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-amber-400 uppercase font-bold mb-1">
            <ShieldCheck size={16} /> Founder Governance Matrix
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white font-sans">
            Admin Team &amp; Custom Role Governance
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Strict governance by Founder Soham Sharma ({superAdminEmail}). Define custom roles, control granular RBAC permissions, and track reviewer velocity.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowRoleModal(true)}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Plus size={14} />
            <span>Create Custom Role</span>
          </button>
          <div className="px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Capacity: <strong>{admins.length} / 5 Admins</strong></span>
          </div>
        </div>
      </div>

      {/* Top KPI Targets Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
          <div className="text-[11px] text-slate-400 uppercase font-bold mb-1">Review SLA Target</div>
          <div className="text-xl font-bold text-white font-sans">&lt; 12 Hours</div>
          <p className="text-[10px] text-emerald-400 mt-0.5">Daily PoW feedback SLA</p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
          <div className="text-[11px] text-slate-400 uppercase font-bold mb-1">Bug Audit Velocity</div>
          <div className="text-xl font-bold text-white font-sans">100% Verified</div>
          <p className="text-[10px] text-blue-400 mt-0.5">Pentest CVE validation</p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
          <div className="text-[11px] text-slate-400 uppercase font-bold mb-1">Office Hours Pres.</div>
          <div className="text-xl font-bold text-white font-sans">Every Saturday</div>
          <p className="text-[10px] text-amber-400 mt-0.5">Indore Hub + Discord Stage</p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
          <div className="text-[11px] text-slate-400 uppercase font-bold mb-1">Founder Approval</div>
          <div className="text-xl font-bold text-rose-400 font-sans">Strict Single Key</div>
          <p className="text-[10px] text-slate-400 mt-0.5">Zero mock credentials</p>
        </div>
      </div>

      {/* Custom Roles Matrix */}
      <div className="p-6 rounded-3xl bg-slate-800/90 border border-slate-700 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white font-sans flex items-center gap-2">
              <Key size={16} className="text-amber-400" />
              <span>Available Admin &amp; Reviewer Roles ({customRoles.length})</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Granular permission matrices configured for cohort managers, wallet finance auditors, and technical leads.
            </p>
          </div>

          <button
            onClick={() => setShowRoleModal(true)}
            className="px-3 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
          >
            <Plus size={13} />
            <span>New Role</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {customRoles.map((r) => (
            <div key={r.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-700/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-xs font-sans">{r.name}</span>
                <span className="px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 text-[10px] border border-blue-500/30">Active Role</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">{r.description}</p>
              
              <div className="pt-2 border-t border-slate-800 flex flex-wrap gap-1 text-[10px]">
                {r.permissions.canManageWallets && <span className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 rounded">Wallets</span>}
                {r.permissions.canReviewLogs && <span className="px-1.5 py-0.5 bg-blue-500/10 text-blue-400 rounded">Review Logs</span>}
                {r.permissions.canIssueCertificates && <span className="px-1.5 py-0.5 bg-purple-500/10 text-purple-400 rounded">Certificates</span>}
                {r.permissions.canModerateDiscussions && <span className="px-1.5 py-0.5 bg-amber-500/10 text-amber-400 rounded">Moderate</span>}
                {r.permissions.canViewAnalytics && <span className="px-1.5 py-0.5 bg-cyan-500/10 text-cyan-400 rounded">Analytics</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Active Admins List (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-6 rounded-3xl bg-slate-800/90 border border-slate-700 shadow-xl">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center justify-between font-sans">
              <span>Approved Community Admins ({admins.length})</span>
              <span className="text-xs text-slate-400 font-mono">Governed by Soham Sharma</span>
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
                          <div className="font-bold text-white text-sm flex items-center gap-2 font-sans">
                            <span>{adm.name}</span>
                            {adm.email === superAdminEmail && (
                              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/40 font-mono">
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
          <div className="p-6 rounded-3xl bg-slate-800/90 border border-slate-700 shadow-xl space-y-4">
            <div className="flex items-center gap-2 text-xs text-amber-400 uppercase font-bold">
              <UserPlus size={15} /> Founder Authorization
            </div>
            <h2 className="text-base font-bold text-white font-sans">
              Approve New Admin
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
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
                  {customRoles.map((r) => (
                    <option key={r.id} value={r.name}>{r.name}</option>
                  ))}
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

      {/* Create Custom Role Modal */}
      {showRoleModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 font-mono text-xs">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 text-white animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 flex items-center justify-center">
                  <Key size={16} />
                </div>
                <h3 className="font-bold text-base font-sans">Create Custom Admin Role</h3>
              </div>
              <button onClick={() => setShowRoleModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateCustomRole} className="space-y-4">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Role Name</label>
                <input
                  type="text"
                  required
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  placeholder="e.g. Lead Technical Reviewer"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Role Description</label>
                <input
                  type="text"
                  value={newRoleDesc}
                  onChange={(e) => setNewRoleDesc(e.target.value)}
                  placeholder="e.g. Audits architecture PRDs and grants verified certificates"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-2 pt-2">
                <label className="block text-slate-300 font-bold">Role Permissions</label>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  {[
                    { key: "canManageWallets", label: "Manage Wallets & Coins" },
                    { key: "canReviewLogs", label: "Review Daily PoW Logs" },
                    { key: "canIssueCertificates", label: "Issue Verified Certificates" },
                    { key: "canModerateDiscussions", label: "Moderate Discussions" },
                    { key: "canManageEvents", label: "Manage Events & Summits" },
                    { key: "canViewAnalytics", label: "View Deep Analytics" }
                  ].map((p) => (
                    <label key={p.key} className="flex items-center gap-2 p-2 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={(newRolePerms as any)[p.key]}
                        onChange={(e) => setNewRolePerms({ ...newRolePerms, [p.key]: e.target.checked })}
                        className="w-4 h-4 rounded text-blue-600 border-slate-700"
                      />
                      <span>{p.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowRoleModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all shadow-xs cursor-pointer"
                >
                  Save Custom Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
