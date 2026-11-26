"use client";

import React, { useState, useEffect } from "react";
import { Plus, Edit3, Trash2, RefreshCw, Loader2, X, CheckCircle2 } from "lucide-react";
import type { ManagedRoadmap, RoadmapPurchase } from "@/lib/roadmaps-server";

export default function AdminRoadmapsPage() {
  const [activeTab, setActiveTab] = useState<"roadmaps" | "purchases">("roadmaps");
  const [roadmaps, setRoadmaps] = useState<ManagedRoadmap[]>([]);
  const [purchases, setPurchases] = useState<RoadmapPurchase[]>([]);
  const [loading, setLoading] = useState(true);

  // Create / Edit Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [roleName, setRoleName] = useState("");
  const [category, setCategory] = useState("Core Engineering");
  const [tagline, setTagline] = useState("");
  const [targetCompanies, setTargetCompanies] = useState("OpenAI, Google, Razorpay");
  const [isPaid, setIsPaid] = useState(true);
  const [price, setPrice] = useState(200);
  const [validityDays, setValidityDays] = useState(3);
  const [extendPrice, setExtendPrice] = useState(100);
  const [extendDays, setExtendDays] = useState(2);
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/roadmaps");
      const data = await res.json();
      if (data.success) {
        setRoadmaps(data.roadmaps || []);
        setPurchases(data.purchases || []);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setRoleName("");
    setCategory("Core Engineering");
    setTagline("");
    setTargetCompanies("OpenAI, Google, Razorpay");
    setIsPaid(true);
    setPrice(200);
    setValidityDays(3);
    setExtendPrice(100);
    setExtendDays(2);
    setIsActive(true);
    setModalOpen(true);
  };

  const openEditModal = (rm: ManagedRoadmap) => {
    setEditingId(rm.id);
    setRoleName(rm.roleName);
    setCategory(rm.category);
    setTagline(rm.tagline);
    setTargetCompanies((rm.targetCompanies || []).join(", "));
    setIsPaid(Boolean(rm.isPaid));
    setPrice(Number(rm.price || 200));
    setValidityDays(Number(rm.validityDays || 3));
    setExtendPrice(Number(rm.extendPrice || 100));
    setExtendDays(Number(rm.extendDays || 2));
    setIsActive(rm.isActive !== false);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const method = editingId ? "PATCH" : "POST";
      const res = await fetch("/api/admin/roadmaps", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...(editingId ? { id: editingId } : {}),
          roleName,
          category,
          tagline,
          targetCompanies,
          isPaid,
          price,
          validityDays,
          extendPrice,
          extendDays,
          isActive,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        alert(data.error || "Failed to save roadmap.");
        return;
      }
      setModalOpen(false);
      await loadData();
    } finally {
      setSaving(false);
    }
  };

  const handleQuickTogglePaid = async (rm: ManagedRoadmap) => {
    await fetch("/api/admin/roadmaps", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: rm.id, isPaid: !rm.isPaid }),
    });
    await loadData();
  };

  const handleDeleteRoadmap = async (id: string, name: string) => {
    if (!confirm(`Delete roadmap "${name}"?`)) return;
    await fetch(`/api/admin/roadmaps?id=${encodeURIComponent(id)}&type=roadmap`, { method: "DELETE" });
    await loadData();
  };

  const handleDeletePurchase = async (code: string) => {
    if (!confirm(`Revoke & delete Unique Code ${code}?`)) return;
    await fetch(`/api/admin/roadmaps?id=${encodeURIComponent(code)}&type=purchase`, { method: "DELETE" });
    await loadData();
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 font-sans text-slate-900">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#1D3189]">
            Admin Roadmaps CMS
          </div>
          <h1 className="text-2xl font-extrabold text-slate-950 mt-0.5">
            Career Roadmaps, Pricing &amp; Unique Codes
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Add/Edit/Delete roadmaps, toggle Paid/Free ON/OFF, customize ₹ fees, and inspect all user Unique Codes.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={loadData}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            <span>Refresh</span>
          </button>
          <button
            type="button"
            onClick={openCreateModal}
            className="px-5 py-2.5 rounded-xl bg-[#1D3189] hover:bg-[#152468] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <Plus size={15} />
            <span>Add Roadmap</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-white p-2 rounded-2xl border border-slate-200 w-fit">
        <button
          type="button"
          onClick={() => setActiveTab("roadmaps")}
          className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer ${
            activeTab === "roadmaps" ? "bg-[#070E54] text-white" : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          Manage Roadmaps ({roadmaps.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("purchases")}
          className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer ${
            activeTab === "purchases" ? "bg-[#070E54] text-white" : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          Roadmap Purchases &amp; Codes ({purchases.length})
        </button>
      </div>

      {loading ? (
        <div className="p-12 bg-white rounded-3xl border border-slate-200 flex items-center justify-center gap-2 text-sm font-semibold text-slate-600">
          <Loader2 size={18} className="animate-spin text-[#1D3189]" />
          <span>Loading Roadmaps Data...</span>
        </div>
      ) : activeTab === "roadmaps" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {roadmaps.map((rm) => (
            <div key={rm.id} className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2.5 py-1 rounded-full bg-indigo-50 text-[#1D3189] text-[10px] font-bold uppercase">
                    {rm.category}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleQuickTogglePaid(rm)}
                    className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase cursor-pointer transition-colors ${
                      rm.isPaid ? "bg-[#070E54] text-[#D9F83B]" : "bg-emerald-100 text-emerald-800"
                    }`}
                  >
                    {rm.isPaid ? `Paid: ₹${rm.price} (${rm.validityDays}d) • Click to Free` : "Free • Click to Paid"}
                  </button>
                </div>
                <h3 className="text-base font-extrabold text-slate-950">{rm.roleName}</h3>
                <p className="text-xs text-slate-600 mt-1 line-clamp-2">{rm.tagline}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-500">
                  Extend: ₹{rm.extendPrice || 100} (+{rm.extendDays || 2}d)
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openEditModal(rm)}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-[#1D3189] hover:text-white text-slate-800 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Edit3 size={12} /> Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteRoadmap(rm.id, rm.roleName)}
                    className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-700 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
          {purchases.length === 0 ? (
            <div className="p-10 text-center text-xs text-slate-500">No paid roadmap purchases recorded yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase text-[10px]">
                  <tr>
                    <th className="px-4 py-3">Unique Code</th>
                    <th className="px-4 py-3">User Name &amp; Email</th>
                    <th className="px-4 py-3">Roadmap Taken</th>
                    <th className="px-4 py-3">Paid</th>
                    <th className="px-4 py-3">Expires At</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {purchases.map((p) => {
                    const isExpired = Date.now() > new Date(p.expiresAt).getTime();
                    return (
                      <tr key={p.uniqueCode} className="hover:bg-slate-50">
                        <td className="px-4 py-3 font-extrabold text-[#1D3189]">{p.uniqueCode}</td>
                        <td className="px-4 py-3">
                          <div className="font-bold text-slate-900">{p.userName}</div>
                          <div className="text-[11px] text-slate-500">{p.userEmail}</div>
                        </td>
                        <td className="px-4 py-3 font-semibold text-slate-800">{p.roadmapTitle}</td>
                        <td className="px-4 py-3 font-bold">₹{p.amountPaid}</td>
                        <td className="px-4 py-3 text-[11px] text-slate-600">
                          {new Date(p.expiresAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isExpired ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-800"
                          }`}>
                            {isExpired ? "Expired" : "Active"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() => handleDeletePurchase(p.uniqueCode)}
                            className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 cursor-pointer"
                            title="Revoke code"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* CREATE / EDIT ROADMAP MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-[9999] bg-slate-950/75 backdrop-blur-sm p-4 overflow-y-auto flex items-center justify-center">
          <div className="relative w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-7">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              <X size={18} />
            </button>

            <h3 className="text-lg font-extrabold text-slate-950 mb-4">
              {editingId ? "Edit Career Roadmap" : "Add New Career Roadmap"}
            </h3>

            <form onSubmit={handleSave} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Role / Roadmap Title *</label>
                <input
                  type="text"
                  required
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Domain Category *</label>
                <input
                  type="text"
                  required
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tagline / Summary *</label>
                <textarea
                  rows={2}
                  required
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Target Companies (Comma-separated)</label>
                <input
                  type="text"
                  value={targetCompanies}
                  onChange={(e) => setTargetCompanies(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Unlock Price (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Validity (Days)</label>
                  <input
                    type="number"
                    min={1}
                    value={validityDays}
                    onChange={(e) => setValidityDays(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Extend Price (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={extendPrice}
                    onChange={(e) => setExtendPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Extend Days</label>
                  <input
                    type="number"
                    min={1}
                    value={extendDays}
                    onChange={(e) => setExtendDays(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-1">
                <label className="flex items-center gap-2 font-bold text-slate-700 cursor-pointer">
                  <input type="checkbox" checked={isPaid} onChange={(e) => setIsPaid(e.target.checked)} />
                  <span>Paid Roadmap (Require ₹{price})</span>
                </label>
                <label className="flex items-center gap-2 font-bold text-slate-700 cursor-pointer">
                  <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
                  <span>Active / Visible</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full py-3 rounded-xl bg-[#D9F83B] hover:bg-[#e5ff59] text-slate-950 font-bold text-sm cursor-pointer flex items-center justify-center gap-2"
              >
                {saving ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle2 size={15} />}
                <span>{editingId ? "Update Roadmap" : "Create Roadmap"}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
