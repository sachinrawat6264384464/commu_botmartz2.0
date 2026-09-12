"use client";

import React, { useState, useEffect } from "react";
import {
  Tag,
  Plus,
  Trash2,
  Check,
  X,
  Sparkles,
  Gift,
  Copy,
  RefreshCw,
  Edit3,
  Loader2,
  Percent,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

interface CouponItem {
  id: string;
  code: string;
  type: "free-pass" | "custom";
  discountType: "percentage" | "fixed";
  discountValue: number;
  isActive: boolean;
  maxUses: number;
  currentUses: number;
  createdAt: string;
}

// Unguessable 8-character random code generator omitting 0/O/1/I
function generateUniqueCode(prefix: string): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let rand = "";
  for (let i = 0; i < 8; i++) {
    rand += chars[Math.floor(Math.random() * chars.length)];
  }
  return `${prefix.toUpperCase()}-${rand.slice(0, 4)}-${rand.slice(4, 8)}`;
}

export default function CouponManagerDashboard() {
  const [coupons, setCoupons] = useState<CouponItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Selection state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modals state
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [genPrefix, setGenPrefix] = useState("BMFREE");
  const [genCount, setGenCount] = useState(5);
  const [generating, setGenerating] = useState(false);
  const [generatedBatchCodes, setGeneratedBatchCodes] = useState<string[]>([]);

  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customForm, setCustomForm] = useState({
    code: "",
    discountType: "percentage" as const,
    discountValue: 10,
    maxUses: 50,
    isActive: true
  });

  const [editingLimitId, setEditingLimitId] = useState<string | null>(null);
  const [editingLimitVal, setEditingLimitVal] = useState<number>(50);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/coupons");
      const data = await res.json();
      if (data.success && Array.isArray(data.coupons)) {
        setCoupons(data.coupons);
      }
    } catch (e) {
      console.error("Failed to fetch coupons:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(text);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Metric Computations
  const freePassCoupons = coupons.filter((c) => c.type === "free-pass");
  const freeTotal = freePassCoupons.length;
  const freeAvailable = freePassCoupons.filter((c) => c.currentUses < c.maxUses).length;
  const freeUsedUp = freeTotal - freeAvailable;

  const botmartz10 = coupons.find((c) => c.code.toUpperCase() === "BOTMARTZ10") || {
    id: "cp-009",
    code: "BOTMARTZ10",
    currentUses: 27,
    maxUses: 50,
    isActive: true
  };
  const botmartz10Left = Math.max(0, botmartz10.maxUses - botmartz10.currentUses);
  const botmartz10Percent = Math.min(100, Math.round((botmartz10.currentUses / botmartz10.maxUses) * 100));

  // Batch Generation Handler
  const handleBatchGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);
    const codes: string[] = [];
    const cleanPrefix = genPrefix.trim().toUpperCase() || "BMFREE";
    const count = Math.min(100, Math.max(1, genCount));

    for (let i = 0; i < count; i++) {
      codes.push(generateUniqueCode(cleanPrefix));
    }

    try {
      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "batch_generate",
          batchCodes: codes
        }),
      });
      const data = await res.json();
      if (data.success) {
        setGeneratedBatchCodes(codes);
        fetchCoupons();
      } else {
        alert(data.error || "Batch generation failed.");
      }
    } catch (err: any) {
      alert(err.message || "Error generating codes.");
    } finally {
      setGenerating(false);
    }
  };

  // Single Custom Coupon Handler
  const handleCreateCustom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customForm.code.trim()) return;
    try {
      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create",
          couponData: customForm
        }),
      });
      const data = await res.json();
      if (data.success) {
        setShowCustomModal(false);
        setCustomForm({ code: "", discountType: "percentage", discountValue: 10, maxUses: 50, isActive: true });
        fetchCoupons();
      }
    } catch (err) {
      console.error("Failed to create custom coupon:", err);
    }
  };

  // Edit Limit Handler
  const handleSaveLimit = async (id: string, newMax: number) => {
    try {
      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "edit_limit", id, maxUses: newMax }),
      });
      const data = await res.json();
      if (data.success) {
        setCoupons((prev) => prev.map((c) => (c.id === id ? { ...c, maxUses: newMax } : c)));
        setEditingLimitId(null);
      }
    } catch (e) {
      console.error("Failed to save limit:", e);
    }
  };

  // Delete Coupon Handler
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this coupon code permanently?")) return;
    try {
      const res = await fetch("/api/admin/coupons", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.success) {
        setCoupons((prev) => prev.filter((c) => c.id !== id));
      }
    } catch (e) {
      console.error("Error deleting coupon:", e);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans text-slate-100 pb-12">
      
      {/* ── HEADER & TOP ACTIONS ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-[#00B8F0]">
              <Tag size={20} />
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Coupon Generator &amp; Manager
            </h1>
          </div>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Generate unique free pass codes, manage discount limits, track all coupon usage.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
          <button
            onClick={fetchCoupons}
            className="p-2.5 rounded-xl bg-[#091124] hover:bg-[#111C38] text-white border border-slate-700 font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
            title="Refresh Coupon Data"
          >
            <RefreshCw size={14} />
            <span>Refresh</span>
          </button>

          <button
            onClick={() => {
              setGeneratedBatchCodes([]);
              setShowBatchModal(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow-lg shadow-emerald-600/20 flex items-center gap-2 cursor-pointer"
          >
            <Gift size={15} />
            <span>Generate Free Coupons</span>
          </button>

          <button
            onClick={() => setShowCustomModal((prev) => !prev)}
            className="px-4 py-2.5 rounded-xl bg-[#0066FF] hover:bg-[#0052CC] text-white font-bold transition-all shadow-lg shadow-blue-600/30 flex items-center gap-1.5 cursor-pointer"
          >
            <Plus size={15} />
            <span>Custom Coupon</span>
          </button>
        </div>
      </div>

      {/* ── CREATE CUSTOM DISCOUNT COUPON CARD (EXACT USER SPECIFIED DESIGN) ── */}
      {showCustomModal && (
        <div className="p-6 rounded-2xl bg-[#091124] border border-[#00B8F0]/40 space-y-4 font-mono text-xs shadow-2xl transition-all">
          <div className="flex items-center gap-2 text-white font-bold text-base font-sans">
            <Tag size={18} className="text-[#00B8F0]" />
            <span>Create Custom Discount Coupon</span>
          </div>

          <form onSubmit={handleCreateCustom} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-slate-400 text-[11px] font-medium mb-1.5">
                  Coupon Code *
                </label>
                <input
                  type="text"
                  required
                  placeholder="E.G. VIP50"
                  value={customForm.code}
                  onChange={(e) => setCustomForm({ ...customForm, code: e.target.value.toUpperCase() })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#040914] border border-slate-700 text-white font-mono uppercase focus:outline-none focus:border-[#00B8F0]"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-[11px] font-medium mb-1.5">
                  Discount Type
                </label>
                <select
                  value={customForm.discountType}
                  onChange={(e) => setCustomForm({ ...customForm, discountType: e.target.value as any })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#040914] border border-slate-700 text-white font-sans focus:outline-none focus:border-[#00B8F0]"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed (₹)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 text-[11px] font-medium mb-1.5">
                  Value
                </label>
                <input
                  type="number"
                  value={customForm.discountValue}
                  onChange={(e) => setCustomForm({ ...customForm, discountValue: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#040914] border border-slate-700 text-white font-mono focus:outline-none focus:border-[#00B8F0]"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-[11px] font-medium mb-1.5">
                  Max Uses
                </label>
                <input
                  type="number"
                  value={customForm.maxUses}
                  onChange={(e) => setCustomForm({ ...customForm, maxUses: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#040914] border border-slate-700 text-white font-mono focus:outline-none focus:border-[#00B8F0]"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-full bg-[#00B8F0] hover:bg-[#0096C7] text-slate-950 font-bold transition-all cursor-pointer shadow-lg shadow-cyan-500/20"
              >
                Save Coupon
              </button>
              <button
                type="button"
                onClick={() => setShowCustomModal(false)}
                className="px-5 py-2.5 rounded-full bg-[#091124] hover:bg-slate-800 text-slate-300 border border-slate-700 font-bold transition-all cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── 4 TOP STAT CARDS GRID ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        {/* Card 1: FREE COUPONS TOTAL */}
        <div className="p-6 rounded-2xl bg-[#091124] border border-slate-800 relative overflow-hidden">
          <div className="text-slate-400 font-bold text-xs uppercase tracking-wider">FREE COUPONS TOTAL</div>
          <div className="text-4xl font-extrabold text-white mt-3">{freeTotal}</div>
        </div>

        {/* Card 2: FREE — AVAILABLE */}
        <div className="p-6 rounded-2xl bg-[#091124] border border-slate-800 relative overflow-hidden">
          <div className="text-emerald-400 font-bold text-xs uppercase tracking-wider">FREE — AVAILABLE</div>
          <div className="text-4xl font-extrabold text-emerald-400 mt-3">{freeAvailable}</div>
        </div>

        {/* Card 3: FREE — USED UP */}
        <div className="p-6 rounded-2xl bg-[#091124] border border-slate-800 relative overflow-hidden">
          <div className="text-rose-400 font-bold text-xs uppercase tracking-wider">FREE — USED UP</div>
          <div className="text-4xl font-extrabold text-rose-400 mt-3">{freeUsedUp}</div>
        </div>

        {/* Card 4: BOTMARTZ10 LEFT */}
        <div className="p-6 rounded-2xl bg-[#091124] border border-slate-800 relative overflow-hidden">
          <div className="text-cyan-400 font-bold text-xs uppercase tracking-wider">BOTMARTZ10 LEFT</div>
          <div className="text-4xl font-extrabold text-cyan-400 mt-3">{botmartz10Left}</div>
        </div>
      </div>

      {/* ── BOTMARTZ10 ADMIN EDITABLE LIMIT CARD BOX ── */}
      <div className="p-6 rounded-3xl bg-[#091124] border border-slate-800 space-y-5 font-mono shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-500/10 text-[#00B8F0]">
              <Tag size={18} />
            </div>
            <div>
              <div className="text-lg font-bold text-white flex items-center gap-2">
                <span>{botmartz10.code}</span>
              </div>
              <p className="text-xs text-slate-400 font-normal">10% Discount Coupon — Admin Editable Limit</p>
            </div>
          </div>

          {editingLimitId === botmartz10.id ? (
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={editingLimitVal}
                onChange={(e) => setEditingLimitVal(Number(e.target.value))}
                className="w-24 px-3 py-1.5 rounded-xl bg-[#040914] border border-slate-700 text-white font-bold text-xs"
              />
              <button
                onClick={() => handleSaveLimit(botmartz10.id, editingLimitVal)}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
              >
                Save
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setEditingLimitId(botmartz10.id);
                setEditingLimitVal(botmartz10.maxUses);
              }}
              className="px-4 py-2 rounded-xl bg-[#040914] hover:bg-[#111C38] text-slate-300 hover:text-white border border-slate-700 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Edit3 size={14} />
              <span>Edit Limit</span>
            </button>
          )}
        </div>

        {/* 3 Sub-stat boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-[#040914] border border-slate-800 text-center">
            <div className="text-xs text-slate-400 font-bold">Used</div>
            <div className="text-3xl font-extrabold text-blue-400 mt-1">{botmartz10.currentUses}</div>
          </div>
          <div className="p-4 rounded-2xl bg-[#040914] border border-slate-800 text-center">
            <div className="text-xs text-slate-400 font-bold">Max Limit</div>
            <div className="text-3xl font-extrabold text-white mt-1">{botmartz10.maxUses}</div>
          </div>
          <div className="p-4 rounded-2xl bg-[#040914] border border-slate-800 text-center">
            <div className="text-xs text-slate-400 font-bold">Remaining</div>
            <div className="text-3xl font-extrabold text-emerald-400 mt-1">{botmartz10Left}</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>{botmartz10.currentUses} used / {botmartz10.maxUses} total</span>
            <span className="font-bold text-white">{botmartz10Percent}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#0066FF] rounded-full transition-all"
              style={{ width: `${botmartz10Percent}%` }}
            />
          </div>
        </div>
      </div>

      {/* ── FREE PASS COUPONS TABLE BOX ── */}
      <div className="p-6 rounded-3xl bg-[#091124] border border-slate-800 space-y-4 font-mono text-xs shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Gift size={16} className="text-emerald-400" />
            <h3 className="text-base font-bold text-white">Free Pass Coupons — 100% OFF (Single Use)</h3>
          </div>
          <div className="text-xs text-slate-400 font-normal">
            <strong className="text-white">{freeTotal} total</strong> &bull; <span className="text-emerald-400 font-bold">{freeAvailable} available</span> &bull; <span className="text-rose-400 font-bold">{freeUsedUp} redeemed</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === freePassCoupons.length && freePassCoupons.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) setSelectedIds(freePassCoupons.map((c) => c.id));
                      else setSelectedIds([]);
                    }}
                    className="rounded cursor-pointer"
                  />
                </th>
                <th className="py-3 px-4">CODE</th>
                <th className="py-3 px-4">STATUS</th>
                <th className="py-3 px-4">USED</th>
                <th className="py-3 px-4">CREATED</th>
                <th className="py-3 px-4 text-center">DELETE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {freePassCoupons.map((row) => {
                const isAvailable = row.currentUses < row.maxUses;
                return (
                  <tr key={row.id}>
                    <td className="py-3.5 px-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(row.id)}
                        onChange={(e) => {
                          if (e.target.checked) setSelectedIds((prev) => [...prev, row.id]);
                          else setSelectedIds((prev) => prev.filter((id) => id !== row.id));
                        }}
                        className="rounded cursor-pointer"
                      />
                    </td>
                    <td className="py-3.5 px-4 font-bold text-white font-mono text-sm">
                      <div className="flex items-center gap-2">
                        <span>{row.code}</span>
                        {isAvailable && (
                          <button
                            onClick={() => copyToClipboard(row.code)}
                            className="p-1 rounded text-slate-400 hover:text-white transition-all cursor-pointer"
                            title="Copy code"
                          >
                            {copiedCode === row.code ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      {isAvailable ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-[10px]">
                          <Check size={11} /> Available
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 font-bold text-[10px]">
                          &times; Redeemed
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-bold font-mono text-white">
                      {row.currentUses}/{row.maxUses}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                      {new Date(row.createdAt).toLocaleDateString("en-US", { month: "short", day: "2-digit" }) +
                        ", " +
                        new Date(row.createdAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }).toLowerCase()}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleDelete(row.id)}
                        className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-all cursor-pointer"
                        title="Delete coupon"
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
      </div>

      {/* ── BATCH FREE COUPONS GENERATOR MODAL ── */}
      {showBatchModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl bg-[#091124] border border-slate-800 p-6 space-y-6 font-mono text-xs shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <Gift className="text-emerald-400" size={18} />
                <h3 className="text-lg font-bold text-white font-sans">Generate 100% Free Pass Coupons</h3>
              </div>
              <button onClick={() => setShowBatchModal(false)} className="text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            {generatedBatchCodes.length > 0 ? (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
                  <div className="font-bold text-sm mb-1 flex items-center gap-2">
                    <CheckCircle2 size={16} /> Generated {generatedBatchCodes.length} Codes!
                  </div>
                  <p className="text-xs font-sans text-slate-300">
                    All generated codes have been saved to Firestore database.
                  </p>
                </div>

                <div className="max-h-48 overflow-y-auto p-3 rounded-xl bg-[#040914] border border-slate-800 space-y-1">
                  {generatedBatchCodes.map((code) => (
                    <div key={code} className="flex items-center justify-between py-1 text-white font-bold">
                      <span>{code}</span>
                      <button
                        onClick={() => copyToClipboard(code)}
                        className="text-slate-400 hover:text-white text-[10px]"
                      >
                        Copy
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={() => copyToClipboard(generatedBatchCodes.join("\n"))}
                    className="px-4 py-2 rounded-xl bg-[#0066FF] text-white font-bold hover:bg-[#0052CC]"
                  >
                    Copy All Codes
                  </button>
                  <button
                    onClick={() => setShowBatchModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold hover:text-white"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleBatchGenerate} className="space-y-4">
                <div>
                  <label className="block text-slate-300 font-bold uppercase tracking-wider text-[10px] mb-1.5">
                    COUPON PREFIX *
                  </label>
                  <input
                    type="text"
                    required
                    value={genPrefix}
                    onChange={(e) => setGenPrefix(e.target.value.toUpperCase())}
                    placeholder="e.g. BMFREE"
                    className="w-full px-4 py-3 rounded-xl bg-[#040914] border border-slate-700 text-white font-mono uppercase focus:outline-none focus:border-[#0066FF]"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold uppercase tracking-wider text-[10px] mb-1.5">
                    NUMBER OF CODES TO GENERATE (1 to 100) *
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={genCount}
                    onChange={(e) => setGenCount(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl bg-[#040914] border border-slate-700 text-white font-mono focus:outline-none focus:border-[#0066FF]"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowBatchModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={generating}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {generating ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                    <span>{generating ? "Generating..." : `Generate ${genCount} Free Codes`}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
