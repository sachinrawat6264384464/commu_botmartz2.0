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
  AlertCircle,
  ShieldCheck
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
      if (data.success && data.coupon) {
        setShowCustomModal(false);
        setCustomForm({ code: "", discountType: "percentage", discountValue: 10, maxUses: 50, isActive: true });
        setCoupons((prev) => [data.coupon, ...prev.filter((c) => c.id !== data.coupon.id)]);
      } else {
        alert(data.error || "Failed to create custom coupon.");
      }
    } catch (err: any) {
      console.error("Failed to create custom coupon:", err);
      alert(err.message || "Failed to create custom coupon.");
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

  const totalCouponsCount = coupons.length;
  const availableCouponsCount = coupons.filter((c) => c.currentUses < c.maxUses).length;
  const redeemedCouponsCount = totalCouponsCount - availableCouponsCount;

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans text-slate-900 pb-12">
      
      {/* ── HEADER & TOP ACTIONS ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-50 text-[#0066FF] border border-blue-200">
              <Tag size={20} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Coupon Generator &amp; Manager
            </h1>
          </div>
          <p className="text-xs font-mono text-slate-500 mt-1">
            Generate unique free pass codes, manage discount limits, track all coupon usage.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
          <button
            onClick={fetchCoupons}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
            title="Refresh Coupon Data"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            <span>Refresh</span>
          </button>

          <button
            onClick={() => {
              setGeneratedBatchCodes([]);
              setShowBatchModal((prev) => !prev);
            }}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer"
          >
            <Gift size={15} />
            <span>Generate Free Coupons</span>
          </button>

          <button
            onClick={() => setShowCustomModal((prev) => !prev)}
            className="px-4 py-2.5 rounded-xl bg-[#0066FF] hover:bg-[#0052CC] text-white font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Plus size={15} />
            <span>+ Custom Coupon</span>
          </button>
        </div>
      </div>

      {/* ── BULK FREE PASS COUPON GENERATOR CARD ── */}
      {showBatchModal && (
        <div className="p-6 rounded-3xl bg-white border border-emerald-200 space-y-5 font-mono text-xs shadow-xl transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                <ShieldCheck size={18} />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 font-sans">
                  Bulk Free Pass Coupon Generator
                </h3>
                <p className="text-xs text-slate-500 font-normal">
                  Generates truly random, unguessable 100% FREE single-use codes. Format:{" "}
                  <span className="text-emerald-600 font-bold">PREFIX-XXXX-XXXX</span>
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowBatchModal(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleBatchGenerate} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-end">
              <div>
                <label className="block text-slate-700 text-[11px] font-bold mb-1.5">
                  Code Prefix
                </label>
                <input
                  type="text"
                  required
                  value={genPrefix}
                  onChange={(e) => setGenPrefix(e.target.value.toUpperCase())}
                  placeholder="BMFREE"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono uppercase focus:bg-white focus:outline-none focus:border-emerald-600"
                />
                <p className="text-[10px] text-slate-400 mt-1">e.g. BMFREE → BMFREE-K7NP-Q3RW</p>
              </div>

              <div>
                <label className="block text-slate-700 text-[11px] font-bold mb-1.5">
                  How Many Codes?
                </label>
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={genCount}
                  onChange={(e) => setGenCount(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono focus:bg-white focus:outline-none focus:border-emerald-600"
                />
                <p className="text-[10px] text-slate-400 mt-1">Max 100 per batch</p>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={generating}
                  className="w-full px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
                >
                  {generating ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Sparkles size={16} />
                  )}
                  <span>{generating ? "Generating..." : `Generate ${genCount} Codes`}</span>
                </button>
              </div>
            </div>
          </form>

          {/* Generated Batch Output Horizontal Badges Bar */}
          {generatedBatchCodes.length > 0 && (
            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
                  <CheckCircle2 size={15} />
                  <span>{generatedBatchCodes.length} codes generated &amp; saved!</span>
                </div>
                <button
                  onClick={() => copyToClipboard(generatedBatchCodes.join("\n"))}
                  className="px-3 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-emerald-200 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Copy size={13} />
                  <span>Copy All</span>
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {generatedBatchCodes.map((code) => (
                  <div
                    key={code}
                    className="px-3 py-1.5 rounded-full bg-white border border-emerald-300 text-emerald-700 font-mono font-bold text-xs flex items-center gap-2 shadow-xs"
                  >
                    <span>{code}</span>
                    <button
                      onClick={() => copyToClipboard(code)}
                      className="text-slate-400 hover:text-slate-700 transition-all cursor-pointer"
                      title="Copy code"
                    >
                      {copiedCode === code ? (
                        <Check size={13} className="text-emerald-600" />
                      ) : (
                        <Copy size={13} />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── CREATE CUSTOM DISCOUNT COUPON CARD ── */}
      {showCustomModal && (
        <div className="p-6 rounded-3xl bg-white border border-blue-200 space-y-4 font-mono text-xs shadow-xl transition-all">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-base font-sans">
              <Tag size={18} className="text-[#0066FF]" />
              <span>Create Custom Discount Coupon</span>
            </div>
            <button
              onClick={() => setShowCustomModal(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleCreateCustom} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-slate-700 text-[11px] font-bold mb-1.5">
                  Coupon Code *
                </label>
                <input
                  type="text"
                  required
                  placeholder="E.G. VIP50"
                  value={customForm.code}
                  onChange={(e) => setCustomForm({ ...customForm, code: e.target.value.toUpperCase() })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono uppercase focus:bg-white focus:outline-none focus:border-[#0066FF]"
                />
              </div>

              <div>
                <label className="block text-slate-700 text-[11px] font-bold mb-1.5">
                  Discount Type
                </label>
                <select
                  value={customForm.discountType}
                  onChange={(e) => setCustomForm({ ...customForm, discountType: e.target.value as any })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-sans focus:bg-white focus:outline-none focus:border-[#0066FF]"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed (₹)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 text-[11px] font-bold mb-1.5">
                  Value ({customForm.discountType === "percentage" ? "%" : "₹"})
                </label>
                <input
                  type="number"
                  value={customForm.discountValue}
                  onChange={(e) => setCustomForm({ ...customForm, discountValue: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono focus:bg-white focus:outline-none focus:border-[#0066FF]"
                />
              </div>

              <div>
                <label className="block text-slate-700 text-[11px] font-bold mb-1.5">
                  Max Uses
                </label>
                <input
                  type="number"
                  value={customForm.maxUses}
                  onChange={(e) => setCustomForm({ ...customForm, maxUses: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono focus:bg-white focus:outline-none focus:border-[#0066FF]"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#0066FF] hover:bg-[#0052CC] text-white font-bold transition-all cursor-pointer shadow-xs"
              >
                Save Custom Coupon &rarr;
              </button>
              <button
                type="button"
                onClick={() => setShowCustomModal(false)}
                className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold transition-all cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── 4 TOP STAT CARDS GRID ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        {/* Card 1: TOTAL COUPONS */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="text-slate-500 font-bold text-xs uppercase tracking-wider">TOTAL COUPONS</div>
          <div className="text-3xl sm:text-4xl font-black text-slate-900 mt-2">{totalCouponsCount}</div>
        </div>

        {/* Card 2: AVAILABLE */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="text-emerald-700 font-bold text-xs uppercase tracking-wider">AVAILABLE</div>
          <div className="text-3xl sm:text-4xl font-black text-emerald-600 mt-2">{availableCouponsCount}</div>
        </div>

        {/* Card 3: USED UP */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="text-rose-700 font-bold text-xs uppercase tracking-wider">USED UP / REDEEMED</div>
          <div className="text-3xl sm:text-4xl font-black text-rose-600 mt-2">{redeemedCouponsCount}</div>
        </div>

        {/* Card 4: BOTMARTZ10 LEFT */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="text-[#0066FF] font-bold text-xs uppercase tracking-wider">BOTMARTZ10 LEFT</div>
          <div className="text-3xl sm:text-4xl font-black text-[#0066FF] mt-2">{botmartz10Left}</div>
        </div>
      </div>

      {/* ── BOTMARTZ10 ADMIN EDITABLE LIMIT CARD BOX ── */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-5 font-mono text-slate-900">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 text-[#0066FF] border border-blue-200">
              <Tag size={18} />
            </div>
            <div>
              <div className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <span>{botmartz10.code}</span>
              </div>
              <p className="text-xs text-slate-500 font-normal">10% Discount Coupon — Admin Editable Limit</p>
            </div>
          </div>

          {editingLimitId === botmartz10.id ? (
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={editingLimitVal}
                onChange={(e) => setEditingLimitVal(Number(e.target.value))}
                className="w-24 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold text-xs"
              />
              <button
                onClick={() => handleSaveLimit(botmartz10.id, editingLimitVal)}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer"
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
              className="px-4 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Edit3 size={14} />
              <span>Edit Limit</span>
            </button>
          )}
        </div>

        {/* 3 Sub-stat boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
            <div className="text-xs text-slate-500 font-bold">Used</div>
            <div className="text-3xl font-black text-[#0066FF] mt-1">{botmartz10.currentUses}</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
            <div className="text-xs text-slate-500 font-bold">Max Limit</div>
            <div className="text-3xl font-black text-slate-900 mt-1">{botmartz10.maxUses}</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
            <div className="text-xs text-slate-500 font-bold">Remaining</div>
            <div className="text-3xl font-black text-emerald-600 mt-1">{botmartz10Left}</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>{botmartz10.currentUses} used / {botmartz10.maxUses} total</span>
            <span className="font-bold text-slate-900">{botmartz10Percent}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
            <div
              className="h-full bg-[#0066FF] rounded-full transition-all"
              style={{ width: `${botmartz10Percent}%` }}
            />
          </div>
        </div>
      </div>

      {/* ── ALL COUPONS TABLE BOX (CUSTOM & FREE PASS) ── */}
      <div className="rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-xs space-y-0 font-mono text-xs text-slate-900">
        <div className="p-5 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Tag size={16} className="text-[#0066FF]" />
            <h3 className="text-base font-bold text-slate-900 font-sans">All Generated Coupons &amp; Custom Discount Codes</h3>
          </div>
          <div className="text-xs text-slate-500 font-normal">
            <strong className="text-slate-900 font-bold">{totalCouponsCount} total</strong> &bull; <span className="text-emerald-600 font-bold">{availableCouponsCount} available</span> &bull; <span className="text-rose-600 font-bold">{redeemedCouponsCount} redeemed</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-3.5 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === coupons.length && coupons.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) setSelectedIds(coupons.map((c) => c.id));
                      else setSelectedIds([]);
                    }}
                    className="rounded cursor-pointer"
                  />
                </th>
                <th className="py-3.5 px-4">CODE</th>
                <th className="py-3.5 px-4">TYPE &amp; DISCOUNT</th>
                <th className="py-3.5 px-4">STATUS</th>
                <th className="py-3.5 px-4">USAGE</th>
                <th className="py-3.5 px-4">CREATED</th>
                <th className="py-3.5 px-4 text-center">DELETE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 font-mono">
                    Loading coupon codes...
                  </td>
                </tr>
              ) : coupons.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 font-mono">
                    No coupon codes generated yet. Click "+ Custom Coupon" or "Generate Free Coupons" above.
                  </td>
                </tr>
              ) : (
                coupons.map((row) => {
                  const isAvailable = row.currentUses < row.maxUses;
                  const isFreePass = row.type === "free-pass" || row.discountValue === 100;
                  return (
                    <tr key={row.id} className="hover:bg-slate-50 transition-colors">
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
                      <td className="py-3.5 px-4 font-bold text-slate-900 font-mono text-xs">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-900 font-mono font-black">
                            {row.code}
                          </span>
                          {isAvailable && (
                            <button
                              onClick={() => copyToClipboard(row.code)}
                              className="p-1 rounded text-slate-400 hover:text-slate-700 transition-all cursor-pointer"
                              title="Copy code"
                            >
                              {copiedCode === row.code ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        {isFreePass ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-[10px]">
                            🎁 Free Pass (100% OFF)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#0066FF] font-bold text-[10px]">
                            🏷️ Custom ({row.discountValue}{row.discountType === "fixed" ? "₹" : "%"} OFF)
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        {isAvailable ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-[10px]">
                            <Check size={11} /> Available
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 font-bold text-[10px]">
                            &times; Redeemed
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-bold font-mono text-slate-900">
                        {row.currentUses}/{row.maxUses}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                        {new Date(row.createdAt).toLocaleDateString("en-US", { month: "short", day: "2-digit" }) +
                          ", " +
                          new Date(row.createdAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }).toLowerCase()}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => handleDelete(row.id)}
                          className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition-all cursor-pointer"
                          title="Delete coupon"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

