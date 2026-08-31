"use client";

import React, { useState, useEffect } from "react";
import {
  Coins,
  Search,
  Plus,
  Minus,
  CheckCircle2,
  AlertCircle,
  Loader2,
  History,
  TrendingUp,
  CreditCard,
  User,
  ShieldCheck,
  ArrowUpRight,
  ArrowDownLeft,
  Sparkles,
  RefreshCw
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export default function AdminWalletsPage() {
  const { user } = useAuth();
  const [searchEmail, setSearchEmail] = useState("");
  const [activeWallet, setActiveWallet] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [recentWallets, setRecentWallets] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Adjustment Modal State
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [adjustAction, setAdjustAction] = useState<"CREDIT" | "DEBIT">("CREDIT");
  const [adjustAmount, setAdjustAmount] = useState("500");
  const [adjustReason, setAdjustReason] = useState("Paid via UPI (botmartz-5@oksbi)");
  const [adjustPaymentRef, setAdjustPaymentRef] = useState("");
  const [adjusting, setAdjusting] = useState(false);

  const loadGlobalOverview = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/wallets");
      const data = await res.json();
      if (data.success) {
        setRecentTransactions(data.recentTransactions || []);
        setRecentWallets(data.wallets || []);
      }
    } catch (e) {
      console.warn("Failed to load global wallet overview:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGlobalOverview();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchEmail.trim()) return;

    setSearching(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const res = await fetch(`/api/admin/wallets?email=${encodeURIComponent(searchEmail.trim())}`);
      const data = await res.json();
      if (data.success) {
        setActiveWallet(data.wallet);
        setTransactions(data.transactions || []);
      } else {
        setErrorMsg(data.error || "Student wallet not found.");
      }
    } catch (e: any) {
      setErrorMsg(e.message || "Failed to search student wallet.");
    } finally {
      setSearching(false);
    }
  };

  const handleExecuteAdjustment = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetEmail = activeWallet?.email || searchEmail.trim();
    if (!targetEmail) {
      alert("Please search for a student first.");
      return;
    }

    setAdjusting(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const res = await fetch("/api/admin/wallets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: targetEmail,
          amount: adjustAmount,
          action: adjustAction,
          reason: adjustReason,
          paymentRef: adjustPaymentRef,
          adminEmail: user?.email || "Admin"
        })
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMsg(data.message);
        setActiveWallet(data.wallet);
        setShowAdjustModal(false);
        setAdjustPaymentRef("");
        // Reload transactions
        const txRes = await fetch(`/api/admin/wallets?email=${encodeURIComponent(targetEmail)}`);
        const txData = await txRes.json();
        if (txData.success) {
          setTransactions(txData.transactions || []);
        }
        loadGlobalOverview();
      } else {
        setErrorMsg(data.error || "Failed to adjust wallet balance.");
      }
    } catch (e: any) {
      setErrorMsg(e.message || "Adjustment failed.");
    } finally {
      setAdjusting(false);
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-8 font-sans text-slate-900">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 font-mono text-xs font-bold uppercase mb-2 border border-amber-200">
            <Coins size={14} className="text-amber-600" /> Karma Economy Master Ledger
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Student Wallets &amp; Coins Governance
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-mono mt-1">
            Search student balances, manually credit paid packages (UPI: botmartz-5@oksbi), deduct coins, and review full transaction audit logs.
          </p>
        </div>

        <button
          onClick={loadGlobalOverview}
          className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono text-xs font-bold transition-all flex items-center gap-1.5 shrink-0"
        >
          <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Alerts */}
      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-mono text-xs flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 font-mono text-xs flex items-center gap-2">
          <AlertCircle size={16} className="text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Student Lookup Search Bar */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs font-mono text-xs">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              placeholder="Search by student email (e.g. rahul.sharma@gmail.com)..."
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-[#0066FF] outline-none text-xs text-slate-900 font-mono"
            />
          </div>
          <button
            type="submit"
            disabled={searching}
            className="px-6 py-3 rounded-2xl bg-[#0066FF] hover:bg-blue-600 text-white font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer shrink-0 disabled:opacity-50"
          >
            {searching ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
            <span>Lookup Wallet</span>
          </button>
        </form>
      </div>

      {/* Selected Student Wallet Card */}
      {activeWallet && (
        <div className="bg-white border-2 border-blue-200 rounded-3xl p-6 sm:p-8 shadow-sm font-mono text-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div className="space-y-1">
              <div className="text-[10px] font-bold text-[#0066FF] uppercase">Active Student Account</div>
              <h2 className="text-xl font-bold font-sans text-slate-900">{activeWallet.email}</h2>
              <p className="text-slate-500 text-[11px]">
                Wallet ID: <span className="font-mono text-slate-700">{activeWallet.id || activeWallet.email}</span> • Last Active: {activeWallet.updatedAt ? new Date(activeWallet.updatedAt).toLocaleString() : "Recently"}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setAdjustAction("CREDIT");
                  setShowAdjustModal(true);
                }}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Plus size={14} />
                <span>Credit Coins</span>
              </button>

              <button
                onClick={() => {
                  setAdjustAction("DEBIT");
                  setShowAdjustModal(true);
                }}
                className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Minus size={14} />
                <span>Debit Coins</span>
              </button>
            </div>
          </div>

          {/* Metric Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-amber-950 space-y-1">
              <div className="text-[10px] font-bold uppercase text-amber-700">Current Balance</div>
              <div className="text-3xl font-extrabold font-sans flex items-center gap-2">
                <Coins size={24} className="text-amber-600" />
                <span>{activeWallet.coins ?? 150}</span>
              </div>
              <div className="text-[10px] text-amber-800">Available Karma Coins</div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-emerald-950 space-y-1">
              <div className="text-[10px] font-bold uppercase text-emerald-700">Lifetime Earned</div>
              <div className="text-3xl font-extrabold font-sans flex items-center gap-2">
                <ArrowUpRight size={24} className="text-emerald-600" />
                <span>{activeWallet.lifetimeEarned ?? (activeWallet.coins ?? 150)}</span>
              </div>
              <div className="text-[10px] text-emerald-800">Total PoW, Tips &amp; Grants</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 space-y-1">
              <div className="text-[10px] font-bold uppercase text-slate-500">Lifetime Spent</div>
              <div className="text-3xl font-extrabold font-sans flex items-center gap-2">
                <ArrowDownLeft size={24} className="text-slate-600" />
                <span>{activeWallet.lifetimeSpent ?? 0}</span>
              </div>
              <div className="text-[10px] text-slate-500">Perks, Hints &amp; Bounties</div>
            </div>
          </div>

          {/* Transaction History for Student */}
          <div className="space-y-3 pt-4">
            <h3 className="font-bold text-sm font-sans text-slate-900">
              Transaction History for {activeWallet.email} ({transactions.length})
            </h3>

            {transactions.length === 0 ? (
              <p className="text-slate-400 py-4 text-center">No transactions recorded for this wallet yet.</p>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                {transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px]"
                  >
                    <div className="space-y-0.5">
                      <div className="font-bold text-slate-900">{tx.reason || "Wallet Transaction"}</div>
                      <div className="text-slate-500 text-[10px]">
                        Ref: {tx.refId || tx.id} • {tx.createdAt ? new Date(tx.createdAt).toLocaleString() : "Recent"}
                      </div>
                    </div>

                    <div className={`font-bold text-xs shrink-0 ${
                      tx.type === "EARN" ? "text-emerald-600" : "text-rose-600"
                    }`}>
                      {tx.type === "EARN" ? `+${tx.amount}` : `-${tx.amount}`} Coins
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Global Recent Activity & Top Wallets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 font-mono text-xs">
        
        {/* Global Recent Transactions */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm font-sans text-slate-900 flex items-center gap-2">
              <History size={16} className="text-[#0066FF]" />
              <span>Platform-Wide Coin Transactions</span>
            </h3>
            <span className="text-[10px] text-slate-400">Live Audit Stream</span>
          </div>

          <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
            {recentTransactions.map((tx) => (
              <div
                key={tx.id}
                onClick={() => {
                  setSearchEmail(tx.email);
                  // trigger search
                  fetch(`/api/admin/wallets?email=${encodeURIComponent(tx.email)}`)
                    .then((r) => r.json())
                    .then((d) => {
                      if (d.success) {
                        setActiveWallet(d.wallet);
                        setTransactions(d.transactions || []);
                      }
                    });
                }}
                className="p-3 rounded-2xl bg-slate-50 hover:bg-blue-50/50 border border-slate-200 transition-colors cursor-pointer flex items-center justify-between gap-2 text-[11px]"
              >
                <div className="space-y-0.5 overflow-hidden">
                  <div className="font-bold text-slate-900 truncate">{tx.email}</div>
                  <div className="text-slate-500 text-[10px] truncate">{tx.reason}</div>
                </div>

                <div className={`font-bold text-xs shrink-0 ${
                  tx.type === "EARN" ? "text-emerald-600" : "text-rose-600"
                }`}>
                  {tx.type === "EARN" ? `+${tx.amount}` : `-${tx.amount}`}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Global Recent Wallets */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm font-sans text-slate-900 flex items-center gap-2">
              <Coins size={16} className="text-amber-500" />
              <span>Recently Active Wallets</span>
            </h3>
            <span className="text-[10px] text-slate-400">Total: {recentWallets.length}</span>
          </div>

          <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
            {recentWallets.map((w) => (
              <div
                key={w.id}
                onClick={() => {
                  setSearchEmail(w.email || w.id);
                  fetch(`/api/admin/wallets?email=${encodeURIComponent(w.email || w.id)}`)
                    .then((r) => r.json())
                    .then((d) => {
                      if (d.success) {
                        setActiveWallet(d.wallet);
                        setTransactions(d.transactions || []);
                      }
                    });
                }}
                className="p-3 rounded-2xl bg-slate-50 hover:bg-amber-50/50 border border-slate-200 transition-colors cursor-pointer flex items-center justify-between gap-2 text-[11px]"
              >
                <div className="space-y-0.5 overflow-hidden">
                  <div className="font-bold text-slate-900 truncate">{w.email || w.id}</div>
                  <div className="text-slate-500 text-[10px]">
                    Earned: {w.lifetimeEarned || w.coins || 0} • Spent: {w.lifetimeSpent || 0}
                  </div>
                </div>

                <div className="font-bold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-xl text-xs shrink-0">
                  {w.coins || 0} Coins
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Manual Credit / Debit Modal */}
      {showAdjustModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 font-mono text-xs">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-150">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                  adjustAction === "CREDIT" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                }`}>
                  {adjustAction === "CREDIT" ? <Plus size={16} /> : <Minus size={16} />}
                </div>
                <div>
                  <h3 className="font-bold text-base font-sans text-slate-900">
                    {adjustAction === "CREDIT" ? "Manual Coin Credit" : "Manual Coin Debit"}
                  </h3>
                  <p className="text-[10px] text-slate-500">{activeWallet?.email || searchEmail}</p>
                </div>
              </div>

              <button
                onClick={() => setShowAdjustModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleExecuteAdjustment} className="space-y-4">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Coin Amount</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-bold text-slate-900 outline-none focus:border-[#0066FF]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Reason / Description</label>
                <input
                  type="text"
                  required
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  placeholder="e.g. Paid ₹499 via UPI botmartz-5@oksbi"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 outline-none focus:border-[#0066FF]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Payment Reference / UTR / Note</label>
                <input
                  type="text"
                  value={adjustPaymentRef}
                  onChange={(e) => setAdjustPaymentRef(e.target.value)}
                  placeholder="e.g. UPI-UTR-4029103948 or Cash Indore Hub"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 outline-none focus:border-[#0066FF]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAdjustModal(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={adjusting}
                  className={`px-6 py-2.5 rounded-xl text-white font-bold shadow-xs cursor-pointer flex items-center gap-2 ${
                    adjustAction === "CREDIT" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-rose-600 hover:bg-rose-700"
                  }`}
                >
                  {adjusting ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                  <span>{adjusting ? "Processing..." : adjustAction === "CREDIT" ? "Confirm Credit" : "Confirm Debit"}</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
