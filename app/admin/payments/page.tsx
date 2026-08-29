"use client";

import React, { useState, useEffect } from "react";
import { CreditCard, CheckCircle2, XCircle, Clock, Search, RefreshCw, Download, FileText } from "lucide-react";

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<any[]>([
    {
      id: "PAY-9812",
      attendeeName: "Rahul Verma",
      email: "rahul.v@gmail.com",
      eventTitle: "AI Frontier 2026",
      tier: "Professional Builder",
      amount: "₹1,499",
      method: "Razorpay (Card)",
      status: "captured",
      date: "2026-08-28 14:22"
    },
    {
      id: "UTR-5541",
      attendeeName: "Ananya Sharma",
      email: "ananya.ai@outlook.com",
      eventTitle: "AI Frontier 2026",
      tier: "Student Pass",
      amount: "₹499",
      method: "Manual UPI UTR (129849182391)",
      status: "pending_review",
      date: "2026-08-28 18:45"
    },
    {
      id: "PAY-9810",
      attendeeName: "Vikram Mehta",
      email: "vmehta@techcorp.io",
      eventTitle: "AI Frontier 2026",
      tier: "VIP Founder Pass",
      amount: "₹3,999",
      method: "Razorpay (UPI)",
      status: "captured",
      date: "2026-08-27 10:15"
    }
  ]);

  const [searchQuery, setSearchQuery] = useState("");

  const handleApproveUTR = (id: string) => {
    setPayments(prev => prev.map(p => p.id === id ? { ...p, status: "captured" } : p));
    alert(`UTR ${id} verified! Ticket pass email and QR code have been dispatched to attendee.`);
  };

  const handleRejectUTR = (id: string) => {
    setPayments(prev => prev.map(p => p.id === id ? { ...p, status: "rejected" } : p));
  };

  const filtered = payments.filter(p => 
    p.attendeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="text-xs font-mono text-emerald-400 uppercase font-bold">FINANCE &amp; RECONCILIATION</div>
          <h1 className="text-2xl font-bold text-white">Payment &amp; UTR Verification Ledger</h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => alert("Exporting payments CSV...")}
            className="px-4 py-2 bg-[#0B1524] border border-white/15 hover:border-emerald-400 text-white rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2"
          >
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
        <input
          type="text"
          placeholder="Search by transaction ID, name, email, or UTR number..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#0B1524] border border-white/10 rounded-2xl pl-11 pr-4 py-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-400"
        />
      </div>

      {/* Ledger Table */}
      <div className="bg-[#0B1524] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#070E1B] text-slate-400 font-mono uppercase text-[11px] border-b border-white/10">
            <tr>
              <th className="p-4">Tx ID / Method</th>
              <th className="p-4">Attendee</th>
              <th className="p-4">Tier &amp; Amount</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filtered.map((p) => (
              <tr key={p.id} className="hover:bg-white/[0.02]">
                <td className="p-4">
                  <div className="font-mono font-bold text-white">{p.id}</div>
                  <div className="text-slate-400 text-[11px] font-mono">{p.method}</div>
                </td>
                <td className="p-4">
                  <div className="font-bold text-white">{p.attendeeName}</div>
                  <div className="text-slate-400 text-[11px]">{p.email}</div>
                </td>
                <td className="p-4 font-mono">
                  <div className="text-emerald-400 font-bold">{p.amount}</div>
                  <div className="text-slate-500 text-[11px]">{p.tier}</div>
                </td>
                <td className="p-4">
                  {p.status === "captured" && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 font-mono text-[10px] font-bold uppercase">
                      <CheckCircle2 size={12} /> Captured
                    </span>
                  )}
                  {p.status === "pending_review" && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-amber-500/10 text-amber-400 font-mono text-[10px] font-bold uppercase">
                      <Clock size={12} /> UTR Review Needed
                    </span>
                  )}
                  {p.status === "rejected" && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-rose-500/10 text-rose-400 font-mono text-[10px] font-bold uppercase">
                      <XCircle size={12} /> Rejected
                    </span>
                  )}
                </td>
                <td className="p-4 text-right">
                  {p.status === "pending_review" ? (
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleApproveUTR(p.id)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-mono text-[11px] font-bold cursor-pointer"
                      >
                        Approve UTR
                      </button>
                      <button
                        onClick={() => handleRejectUTR(p.id)}
                        className="px-3 py-1.5 bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white rounded-lg font-mono text-[11px] font-bold cursor-pointer"
                      >
                        Reject
                      </button>
                    </div>
                  ) : (
                    <span className="text-slate-500 font-mono text-[11px]">Reconciled</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
