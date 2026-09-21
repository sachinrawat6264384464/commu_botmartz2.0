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
    <div className="font-sans text-slate-900 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 font-mono text-xs font-bold uppercase mb-2 border border-amber-200">
            <ShieldCheck size={14} className="text-amber-600" /> Founder Governance Matrix
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
            Admin Team &amp; Custom Role Governance
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-mono mt-1">
            Strict governance by Founder Soham Sharma (<span className="text-slate-800 font-bold">{superAdminEmail}</span>). Define custom roles, control granular RBAC permissions, and track reviewer velocity.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 font-mono text-xs">
          <button
            onClick={() => setShowRoleModal(true)}
            className="px-4 py-2.5 rounded-2xl bg-[#0066FF] hover:bg-blue-600 text-white font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Plus size={14} />
            <span>Create Custom Role</span>
          </button>
          <div className="px-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-slate-700 font-bold flex items-center gap-2 shadow-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Capacity: <strong className="text-slate-900">{admins.length} / 5 Admins</strong></span>
          </div>
        </div>
      </div>

      {/* Top KPI Targets Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 font-mono text-xs">
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="text-[10px] text-slate-400 font-bold uppercase">Review SLA Target</div>
          <div className="text-2xl font-black text-slate-900 font-sans">12 Hours</div>
          <p className="text-[10px] text-emerald-600 font-bold">Daily PoW feedback SLA</p>
        </div>
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="text-[10px] text-slate-400 font-bold uppercase">Bug Audit Velocity</div>
          <div className="text-2xl font-black text-slate-900 font-sans">100% Verified</div>
          <p className="text-[10px] text-blue-600 font-bold">Pentest CVE validation</p>
        </div>
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="text-[10px] text-slate-400 font-bold uppercase">Office Hours Pres.</div>
          <div className="text-2xl font-black text-slate-900 font-sans">Every Saturday</div>
          <p className="text-[10px] text-amber-600 font-bold">Indore Hub + Discord Stage</p>
        </div>
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="text-[10px] text-slate-400 font-bold uppercase">Founder Approval</div>
          <div className="text-2xl font-black text-rose-600 font-sans">Strict Single Key</div>
          <p className="text-[10px] text-slate-500 font-medium">Zero mock credentials</p>
        </div>
      </div>

      {/* Custom Roles Matrix */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 font-sans flex items-center gap-2">
              <Key size={18} className="text-amber-500" />
              <span>Available Admin &amp; Reviewer Roles ({customRoles.length})</span>
            </h2>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              Granular permission matrices configured for cohort managers, wallet finance auditors, and technical leads.
            </p>
          </div>

          <button
            onClick={() => setShowRoleModal(true)}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-mono text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <Plus size={14} />
            <span>New Role</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {customRoles.map((r) => (
            <div key={r.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 flex flex-col justify-between">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-900 text-sm font-sans">{r.name}</span>
                  <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-700 text-[10px] font-mono font-bold border border-blue-200">Active Role</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-sans">{r.description}</p>
              </div>
              
              <div className="pt-3 border-t border-slate-200 flex flex-wrap gap-1.5 text-[10px] font-mono font-bold">
                {r.permissions.canManageWallets && <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md border border-emerald-200">Wallets</span>}
                {r.permissions.canReviewLogs && <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-md border border-blue-200">Review Logs</span>}
                {r.permissions.canIssueCertificates && <span className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded-md border border-purple-200">Certificates</span>}
                {r.permissions.canModerateDiscussions && <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded-md border border-amber-200">Moderate</span>}
                {r.permissions.canViewAnalytics && <span className="px-2 py-0.5 bg-cyan-100 text-cyan-800 rounded-md border border-cyan-200">Analytics</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Active Admins List (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-slate-900 font-sans">
                Approved Community Admins ({admins.length})
              </h2>
              <span className="text-xs text-slate-500 font-mono">Governed by Soham Sharma</span>
            </div>

            {loading ? (
              <div className="py-12 text-center text-slate-400 font-mono text-xs flex items-center justify-center gap-2">
                <Loader2 size={16} className="animate-spin text-[#0066FF]" /> Loading team matrix...
              </div>
            ) : admins.length === 0 ? (
              <div className="py-12 text-center text-slate-400 font-mono text-xs">
                No extra approved admins in database yet. Super Admin key active.
              </div>
            ) : (
              <div className="space-y-4">
                {admins.map((adm, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-[#0066FF] text-white font-extrabold text-sm flex items-center justify-center shadow-xs shrink-0">
                          {adm.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-extrabold text-slate-900 text-sm flex items-center gap-2 font-sans">
                            <span>{adm.name}</span>
                            {adm.email === superAdminEmail && (
                              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-mono font-bold border border-amber-300">
                                Founder &amp; Super Admin
                              </span>
                            )}
                          </div>
                          <span className="text-slate-500 text-xs font-mono">{adm.email}</span>
                        </div>
                      </div>

                      <span className="px-3 py-1 rounded-xl bg-white text-slate-700 text-xs font-mono font-bold border border-slate-200 shadow-2xs">
                        {adm.role}
                      </span>
                    </div>

                    {/* KPI Performance Metrics */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-slate-200 font-mono text-[11px]">
                      <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                        <span className="text-slate-400 block font-bold">PoW Reviews:</span>
                        <span className="font-extrabold text-emerald-600 text-sm">{adm.kpis?.reviewsCompleted ?? 0}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                        <span className="text-slate-400 block font-bold">Avg Response:</span>
                        <span className="font-extrabold text-blue-600 text-sm">{adm.kpis?.avgReviewTimeHours ?? 4.2}h</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                        <span className="text-slate-400 block font-bold">Bugs Verified:</span>
                        <span className="font-extrabold text-purple-600 text-sm">{adm.kpis?.bugsVerified ?? 0}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                        <span className="text-slate-400 block font-bold">Office Hours:</span>
                        <span className="font-extrabold text-amber-600 text-sm">{adm.kpis?.officeHoursAttended ?? 0}</span>
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
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-6">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 font-mono text-[10px] font-bold uppercase border border-amber-200">
                <UserPlus size={12} className="text-amber-600" /> Founder Authorization
              </div>
              <h2 className="text-lg font-extrabold text-slate-900 font-sans">
                Approve New Admin
              </h2>
              <p className="text-xs text-slate-500 font-mono leading-relaxed">
                Only Founder Soham Sharma can approve additional cohort reviewers. Limit 5 total admins.
              </p>
            </div>

            <form onSubmit={handleAddAdmin} className="space-y-4 font-mono text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Admin Full Name:</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Priyanshu Sharma"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 font-mono outline-none focus:bg-white focus:border-[#0066FF]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Admin Email:</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. priyanshu@botmartz.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 font-mono outline-none focus:bg-white focus:border-[#0066FF]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Role Track:</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 font-mono outline-none focus:bg-white focus:border-[#0066FF]"
                >
                  {customRoles.map((r) => (
                    <option key={r.id} value={r.name}>{r.name}</option>
                  ))}
                </select>
              </div>

              {statusMsg && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] flex items-center gap-2 font-mono">
                  <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                  <span>{statusMsg}</span>
                </div>
              )}

              {errorMsg && (
                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-[11px] flex items-center gap-2 font-mono">
                  <AlertCircle size={15} className="text-rose-600 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting || admins.length >= 5}
                className="w-full py-3.5 rounded-2xl bg-[#0066FF] hover:bg-blue-600 text-white font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                {isSubmitting ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  <>
                    <Lock size={14} />
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
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 font-mono text-xs">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 text-slate-900 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center font-bold">
                  <Key size={18} />
                </div>
                <div>
                  <h3 className="font-extrabold text-base font-sans text-slate-900">Create Custom Admin Role</h3>
                  <p className="text-[10px] text-slate-500">Configure custom RBAC permissions matrix</p>
                </div>
              </div>
              <button onClick={() => setShowRoleModal(false)} className="text-slate-400 hover:text-slate-700 p-1">✕</button>
            </div>

            <form onSubmit={handleCreateCustomRole} className="space-y-4">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Role Name</label>
                <input
                  type="text"
                  required
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  placeholder="e.g. Lead Technical Reviewer"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 outline-none focus:bg-white focus:border-[#0066FF]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Role Description</label>
                <input
                  type="text"
                  value={newRoleDesc}
                  onChange={(e) => setNewRoleDesc(e.target.value)}
                  placeholder="e.g. Audits architecture PRDs and grants verified certificates"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 outline-none focus:bg-white focus:border-[#0066FF]"
                />
              </div>

              <div className="space-y-2 pt-2">
                <label className="block text-slate-700 font-bold">Role Permissions</label>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  {[
                    { key: "canManageWallets", label: "Manage Wallets & Coins" },
                    { key: "canReviewLogs", label: "Review Daily PoW Logs" },
                    { key: "canIssueCertificates", label: "Issue Verified Certificates" },
                    { key: "canModerateDiscussions", label: "Moderate Discussions" },
                    { key: "canManageEvents", label: "Manage Events & Summits" },
                    { key: "canViewAnalytics", label: "View Deep Analytics" }
                  ].map((p) => (
                    <label key={p.key} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
                      <input
                        type="checkbox"
                        checked={(newRolePerms as any)[p.key]}
                        onChange={(e) => setNewRolePerms({ ...newRolePerms, [p.key]: e.target.checked })}
                        className="w-4 h-4 rounded text-[#0066FF] border-slate-300 focus:ring-0"
                      />
                      <span className="font-semibold text-slate-800">{p.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 font-mono">
                <button
                  type="button"
                  onClick={() => setShowRoleModal(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-2xl bg-[#0066FF] hover:bg-blue-600 text-white font-bold transition-all shadow-xs cursor-pointer"
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
