"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Coins,
  Sparkles,
  Trophy,
  Gift,
  ArrowRight,
  TrendingUp,
  History,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Users,
  Search,
  MessageSquare,
  ShieldCheck,
  Zap
} from "lucide-react";

export default function StudentWalletPage() {
  const [email, setEmail] = useState("");
  const [wallet, setWallet] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const EARN_CHANNELS = [
    { title: "Daily PoW Standup Log", reward: "+50 Coins", desc: "Submit your daily GitHub commit and streak report.", icon: Zap },
    { title: "Peer Code Review", reward: "+100 Coins", desc: "Review and approve a peer student's PR on GitHub.", icon: CheckCircle2 },
    { title: "Report Pentest Bug / CVE", reward: "+200 Coins", desc: "Discover and file a verified security vulnerability in a peer project.", icon: ShieldCheck },
    { title: "Discord Blocker Rescue", reward: "+150 Coins", desc: "Help another student or squad solve a technical bug on Discord.", icon: MessageSquare },
    { title: "Ship 45-Day Milestone", reward: "+500 Coins", desc: "Successfully deploy your project to production cloud.", icon: Trophy }
  ];

  const REDEEMABLE_PERKS = [
    { title: "1-on-1 Founder Architecture Clinic", cost: 300, desc: "20-minute private architecture review with Founder Soham Sharma." },
    { title: "Fast-Track 15-Company Referral Dispatch", cost: 1000, desc: "Immediate profile dispatch to 15 partner tech companies & founder LinkedIn rec." },
    { title: "Botmartz Builder Swag & RAG Book", cost: 800, desc: "Official Botmartz Builder T-shirt + printed AI Engineering Roadmap." },
    { title: "Cloud GPU & Compute Credits Grant", cost: 500, desc: "AWS / Qdrant cloud credits grant for production deployment." }
  ];

  const handleLookup = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setMsg("");

    try {
      const res = await fetch(`/api/arena/wallet?email=${encodeURIComponent(email.trim().toLowerCase())}`);
      const data = await res.json();
      if (data.wallet) {
        setWallet(data.wallet);
      }
      if (data.transactions) {
        setTransactions(data.transactions);
      }
    } catch (err: any) {
      setMsg("Failed to load wallet data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 pb-20">
      {/* Header Banner */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 text-amber-800 font-mono text-xs font-bold uppercase tracking-wider mb-2 border border-amber-200">
                <Coins size={14} className="text-amber-600" /> Student Karma Economy
              </div>
              <h1 className="text-3xl font-extrabold text-slate-900">
                Botmartz Builder Wallet &amp; Points Ledger
              </h1>
              <p className="text-slate-600 text-xs sm:text-sm font-mono mt-1">
                Earn coins by shipping, reviewing peer code, and helping others. Spend coins for founder code reviews and 15-company referrals.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/arena/bounties"
                className="px-5 py-3 rounded-2xl bg-[#0066FF] hover:bg-[#0052CC] text-white font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-xs"
              >
                🪙 Open Bounty Board
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-8 space-y-8">
        
        {/* Wallet Lookup Search Bar */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
          <form onSubmit={handleLookup} className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your student email to load your wallet balance (e.g. rahul@college.edu)..."
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-xs font-mono text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              {loading ? <Loader2 size={14} className="animate-spin" /> : <span>Load My Balance</span>}
            </button>
          </form>
        </div>

        {/* Active Wallet Display */}
        {wallet && (
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 animate-fadeIn">
            <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-md">
              <div className="flex items-center justify-between text-xs font-mono font-bold mb-1 opacity-90">
                <span>WALLET BALANCE</span>
                <Coins size={18} />
              </div>
              <div className="text-4xl font-black">{wallet.balance} 🪙</div>
              <p className="text-[11px] font-mono mt-1 text-amber-100">Botmartz Coins (B-Tokens)</p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs">
              <div className="text-xs font-mono font-bold text-slate-400 uppercase mb-1">Total Earned</div>
              <div className="text-3xl font-extrabold text-emerald-700">+{wallet.totalEarned}</div>
              <p className="text-[11px] font-mono text-slate-500 mt-1">PoW + Reviews + Bounties</p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs">
              <div className="text-xs font-mono font-bold text-slate-400 uppercase mb-1">Reputation Level</div>
              <div className="text-3xl font-extrabold text-purple-700">Level {wallet.reputationLevel}</div>
              <p className="text-[11px] font-mono text-slate-500 mt-1">Peer Credibility Score</p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs">
              <div className="text-xs font-mono font-bold text-slate-400 uppercase mb-1">Coins Redeemed</div>
              <div className="text-3xl font-extrabold text-slate-900">{wallet.totalSpent}</div>
              <p className="text-[11px] font-mono text-slate-500 mt-1">Spent on Perks &amp; Bounties</p>
            </div>
          </div>
        )}

        {/* How to Earn Matrix & Redeemable Perks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Earn Matrix */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-700 uppercase mb-2">
              <TrendingUp size={15} /> Earning Rules
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              How to Earn Botmartz Coins
            </h2>

            <div className="space-y-3 font-mono text-xs">
              {EARN_CHANNELS.map((ch, idx) => {
                const IconComponent = ch.icon;
                return (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                        <IconComponent size={16} />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{ch.title}</div>
                        <div className="text-[11px] text-slate-500 font-sans">{ch.desc}</div>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-xl bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 shrink-0">
                      {ch.reward}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Redeemable Perks Matrix */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-purple-700 uppercase mb-2">
              <Gift size={15} /> Store &amp; Perks
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              Redeemable Career &amp; Project Perks
            </h2>

            <div className="space-y-3 font-mono text-xs">
              {REDEEMABLE_PERKS.map((perk, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
                  <div>
                    <div className="font-bold text-slate-900">{perk.title}</div>
                    <div className="text-[11px] text-slate-500 font-sans">{perk.desc}</div>
                  </div>
                  <button className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold shrink-0 transition-all cursor-pointer">
                    {perk.cost} 🪙
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Transaction History Feed */}
        {transactions.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
            <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2 font-mono">
              <History size={16} className="text-slate-500" />
              <span>Recent Wallet Activity ({transactions.length})</span>
            </h2>

            <div className="space-y-2.5 font-mono text-xs">
              {transactions.map((tx, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        tx.type === "EARN"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {tx.type === "EARN" ? `+${tx.amount}` : `-${tx.amount}`}
                    </span>
                    <span className="text-slate-800">{tx.reason}</span>
                  </div>
                  <span className="text-slate-400 text-[10px]">{new Date(tx.timestamp).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
