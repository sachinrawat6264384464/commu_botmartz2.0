"use client";

import React, { useState } from "react";
import { Tag, Plus, Trash2, CheckCircle2 } from "lucide-react";

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([
    { id: "1", code: "EARLYBIRD50", discount: "50%", maxUses: 100, used: 64, active: true },
    { id: "2", code: "STUDENTVIP", discount: "100%", maxUses: 30, used: 28, active: true },
    { id: "3", code: "COMMUNITY20", discount: "20%", maxUses: 500, used: 112, active: true },
  ]);

  const [newCode, setNewCode] = useState("");
  const [newDiscount, setNewDiscount] = useState("20%");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim()) return;
    setCoupons(prev => [
      ...prev,
      { id: Date.now().toString(), code: newCode.trim().toUpperCase(), discount: newDiscount, maxUses: 100, used: 0, active: true }
    ]);
    setNewCode("");
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-white/10">
        <div>
          <div className="text-xs font-mono text-[#00B8F0] uppercase font-bold">DISCOUNTS &amp; OFFERS</div>
          <h1 className="text-2xl font-bold text-white">Coupon &amp; Promo Code Manager</h1>
        </div>
      </div>

      {/* Add Coupon */}
      <div className="bg-[#0B1524] border border-white/10 rounded-2xl p-6 shadow-xl">
        <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="PROMO CODE (e.g. SPECIAL30)"
            value={newCode}
            onChange={(e) => setNewCode(e.target.value)}
            className="flex-1 bg-[#050B14] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white font-mono uppercase"
            required
          />
          <input
            type="text"
            placeholder="Discount (e.g. 30% or ₹500)"
            value={newDiscount}
            onChange={(e) => setNewDiscount(e.target.value)}
            className="w-full sm:w-48 bg-[#050B14] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white font-mono"
            required
          />
          <button
            type="submit"
            className="bg-[#0066FF] hover:bg-[#0052CC] text-white px-6 py-2.5 rounded-xl text-xs font-mono font-bold uppercase transition-all shadow-md cursor-pointer"
          >
            + Create Coupon
          </button>
        </form>
      </div>

      {/* Coupons Table */}
      <div className="bg-[#0B1524] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#070E1B] text-slate-400 font-mono uppercase text-[11px] border-b border-white/10">
            <tr>
              <th className="p-4">Coupon Code</th>
              <th className="p-4">Discount</th>
              <th className="p-4">Usage Count</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {coupons.map((c) => (
              <tr key={c.id} className="hover:bg-white/[0.02]">
                <td className="p-4 font-mono font-bold text-[#00B8F0]">{c.code}</td>
                <td className="p-4 font-mono text-white font-bold">{c.discount}</td>
                <td className="p-4 font-mono text-slate-300">{c.used} / {c.maxUses}</td>
                <td className="p-4">
                  <span className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 font-mono text-[10px] font-bold uppercase">
                    Active
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => setCoupons(prev => prev.filter(item => item.id !== c.id))}
                    className="p-1.5 text-slate-400 hover:text-rose-400"
                  >
                    <Trash2 size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
