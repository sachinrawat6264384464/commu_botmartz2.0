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
  Zap,
  Send,
  Check,
  X,
  CreditCard
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import RazorpayModal from "@/app/_components/RazorpayModal";
import AuthGate from "@/app/_components/AuthGate";

export default function StudentWalletPage() {
  const { user, studentProfile } = useAuth();
  const [email, setEmail] = useState("");
  const [wallet, setWallet] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  // Modal State
  const [selectedPerk, setSelectedPerk] = useState<any | null>(null);
  const [redeeming, setRedeeming] = useState(false);
  const [redeemSuccess, setRedeemSuccess] = useState<string | null>(null);

  // Tip / Transfer State
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferRecipient, setTransferRecipient] = useState("");
  const [transferAmount, setTransferAmount] = useState("50");
  const [transferReason, setTransferReason] = useState("Thanks for helping with the PyTorch data loader bug!");
  const [transferring, setTransferring] = useState(false);
  const [transferSuccess, setTransferSuccess] = useState<string | null>(null);

  // Razorpay Checkout State for Top-up Packs
  const [showRazorpayModal, setShowRazorpayModal] = useState(false);
  const [checkoutPack, setCheckoutPack] = useState<any | null>(null);
  const [buySuccess, setBuySuccess] = useState<string | null>(null);

  const CREDIT_PACKS = [
    { id: "pack_500", name: "Starter Sprint Pack", coins: 500, price: 99, tag: "Beginner", desc: "Unlock immediate mock interview & code review slot." },
    { id: "pack_2000", name: "Builder Pro Pack", coins: 2000, price: 299, tag: "🔥 Most Popular", desc: "Covers 1-on-1 founder technical clinic + printed roadmap book." },
    { id: "pack_5000", name: "Founder Placement Pack", coins: 5000, price: 599, tag: "⚡ VIP Placement", desc: "Direct 15-company referral dispatch + cloud compute credits." },
  ];

  const EARN_CHANNELS = [
    { title: "Daily PoW Standup Log", reward: "+50 Coins", desc: "Submit your daily GitHub commit and streak report.", icon: Zap, href: "/arena/daily-log", action: "Log Commit" },
    { title: "Publish LinkedIn Progress Diary", reward: "+50 Coins", desc: "Post verified architecture updates on LinkedIn with #BotmartzAI.", icon: TrendingUp, href: "/arena/career-checklist", action: "Open Checklist" },
    { title: "Peer Code Review & PR Audit", reward: "+100 Coins", desc: "Review and approve a peer student's pull request on GitHub.", icon: CheckCircle2, href: "/discussions", action: "Review PRs" },
    { title: "Report Verified Pentest Bug / CVE", reward: "+200 Coins", desc: "Discover and document an OWASP vulnerability in a staging build.", icon: ShieldCheck, href: "/arena/bounties", action: "View Bounties" },
    { title: "Discord Technical Blocker Rescue", reward: "+150 Coins", desc: "Help another student squad unblock a database deadlock or build error.", icon: MessageSquare, href: "/discussions", action: "Join Forum" },
    { title: "Ship Verified 45-Day Production Project", reward: "+500 Coins", desc: "Pass all quality gates (Tests, Code Audit, Pen-test) on cloud.", icon: Trophy, href: "/arena", action: "Explore PRDs" }
  ];

  const REDEEMABLE_PERKS = [
    {
      id: "perk_1",
      title: "1-on-1 Founder Technical Clinic",
      cost: 300,
      desc: "20-minute structured architecture teardown with Founder Soham Sharma. (Requires Agenda Submission).",
      badge: "Founder Clinic"
    },
    {
      id: "perk_2",
      title: "Priority Portfolio Feature & Founder Recommendation",
      cost: 1000,
      desc: "Featured showcase on the Botmartz community homepage + personalized LinkedIn recommendation letter for your portfolio.",
      badge: "Portfolio Feature"
    },
    {
      id: "perk_3",
      title: "Official Botmartz Builder Swag & Roadmap Book",
      cost: 800,
      desc: "Printed AI & Systems Engineering Architecture Roadmap + Official Builder Tee delivered to your address.",
      badge: "Physical Swag"
    },
    {
      id: "perk_4",
      title: "Cloud GPU & Compute Credits Grant",
      cost: 500,
      desc: "$50 AWS / Qdrant cloud credits grant for production container deployments.",
      badge: "Cloud Credits"
    },
    {
      id: "perk_5",
      title: "Mock System Design Technical Interview",
      cost: 400,
      desc: "45-minute live technical interview simulation with feedback report on distributed systems & algorithms.",
      badge: "Interview Prep"
    }
  ];

  useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
      loadWallet(user.email);
    }
  }, [user]);

  const loadWallet = async (targetEmail: string) => {
    if (!targetEmail.trim()) return;

    setLoading(true);
    setMsg("");

    try {
      const res = await fetch(`/api/arena/wallet?email=${encodeURIComponent(targetEmail.trim().toLowerCase())}`);
      const data = await res.json();
      if (data.wallet) {
        setWallet(data.wallet);
      } else {
        // Mock fallback
        setWallet({
          coins: studentProfile?.karmaCoins || 150,
          lifetimeEarned: (studentProfile?.karmaCoins || 150) + 100,
          spent: 100,
          rank: "Production Builder"
        });
      }
      if (data.transactions && Array.isArray(data.transactions)) {
        setTransactions(data.transactions);
      } else {
        setTransactions([
          { type: "EARN", amount: 50, reason: "Day 1 GitHub Proof-of-Work Log", timestamp: new Date().toISOString() },
          { type: "EARN", amount: 50, reason: "LinkedIn UGC Progress Diary Post", timestamp: new Date(Date.now() - 86400000).toISOString() },
          { type: "EARN", amount: 100, reason: "Account Verification & Student Onboarding", timestamp: new Date(Date.now() - 86400000 * 2).toISOString() }
        ]);
      }
    } catch (err: any) {
      setWallet({
        coins: studentProfile?.karmaCoins || 150,
        lifetimeEarned: 250,
        spent: 100,
        rank: "Production Builder"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLookup = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    loadWallet(email);
  };

  const handleRedeemPerk = async (perk: any) => {
    const targetEmail = email || user?.email;
    if (!targetEmail) {
      alert("Please enter or sign in with your student email to redeem perks.");
      return;
    }

    const currentCoins = wallet?.coins ?? (studentProfile?.karmaCoins || 150);
    if (currentCoins < perk.cost) {
      alert(`Insufficient Karma Coins! You need ${perk.cost} coins, but your current balance is ${currentCoins} coins.`);
      return;
    }

    setRedeeming(true);
    try {
      const res = await fetch("/api/arena/wallet/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentEmail: targetEmail,
          perkId: perk.id,
          perkTitle: perk.title,
          perkCost: perk.cost,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setWallet((prev: any) => ({
          ...prev,
          coins: data.newBalance ?? ((prev?.coins || currentCoins) - perk.cost),
          spent: (prev?.spent || 0) + perk.cost,
        }));
        setTransactions((prev) => [
          { type: "SPEND", amount: perk.cost, reason: `Redeemed: ${perk.title} (Code: ${data.fulfillmentCode})`, timestamp: new Date().toISOString() },
          ...prev,
        ]);
        setRedeemSuccess(`Successfully redeemed "${perk.title}"! Voucher/Ref code: ${data.fulfillmentCode}. Check your email (${targetEmail}) for fulfillment updates.`);
        setSelectedPerk(null);
      } else {
        alert(data.error || "Redemption failed. Please try again.");
      }
    } catch (e: any) {
      alert(e.message || "Redemption failed. Please try again.");
    } finally {
      setRedeeming(false);
    }
  };

  const handleTransferKarma = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetEmail = email || user?.email;
    if (!targetEmail) {
      alert("Please log in or enter your email to transfer Karma Coins.");
      return;
    }

    const amt = parseInt(transferAmount) || 0;
    const currentCoins = wallet?.coins ?? (studentProfile?.karmaCoins || 150);

    if (amt <= 0 || amt > currentCoins) {
      alert(`Invalid amount. You can transfer up to ${currentCoins} coins.`);
      return;
    }

    if (!transferRecipient.trim()) {
      alert("Please enter a valid recipient student email.");
      return;
    }

    setTransferring(true);
    try {
      const res = await fetch("/api/arena/wallet/transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderEmail: targetEmail,
          recipientEmail: transferRecipient.trim(),
          amount: amt,
          reason: transferReason.trim()
        })
      });

      const data = await res.json();
      if (data.success) {
        setWallet((prev: any) => ({
          ...prev,
          coins: data.newBalance ?? ((prev?.coins || currentCoins) - amt),
          spent: (prev?.spent || 0) + amt
        }));
        setTransactions((prev) => [
          { type: "SPEND", amount: amt, reason: `Transferred to ${transferRecipient}: ${transferReason}`, timestamp: new Date().toISOString() },
          ...prev
        ]);
        setTransferSuccess(`Successfully transferred ${amt} Karma Coins to ${transferRecipient}!`);
        setShowTransferModal(false);
        setTransferRecipient("");
      } else {
        alert(data.error || "Transfer failed. Please check the recipient email and your balance.");
      }
    } catch (err: any) {
      alert(err.message || "Transfer failed.");
    } finally {
      setTransferring(false);
    }
  };

  const handleInitiatePurchase = (pack: any) => {
    const targetEmail = email || user?.email;
    if (!targetEmail) {
      alert("Please log in or enter your student email below to purchase Karma Credit Packs via Razorpay.");
      return;
    }
    setCheckoutPack(pack);
    setShowRazorpayModal(true);
  };

  const currentCoins = wallet?.coins ?? (studentProfile?.karmaCoins || 150);

  return (
    <AuthGate
      featureTitle="Student Karma Wallet"
      featureDescription="Sign in to view your earned Karma Coins balance, tip squad members, redeem compute grants, and unlock architectural hints."
    >
      <div
        className="min-h-screen bg-white text-slate-900 pt-24 pb-24 font-sans selection:bg-[#D9F83B] selection:text-slate-950"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(29, 49, 137, 0.11) 1px, transparent 1px), linear-gradient(to bottom, rgba(29, 49, 137, 0.11) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      >
      
      {/* Header Banner */}
      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 pt-2">
        <div className="bg-[#070E54] text-white rounded-3xl p-7 sm:p-10 border border-white/15 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center px-3.5 py-1 rounded-full bg-[#D9F83B] text-slate-950 font-sans text-[11px] font-extrabold uppercase tracking-wider mb-3">
              Student Karma Economy
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Botmartz Builder Wallet &amp; Rewards Ledger
            </h1>
            <p className="text-blue-100/85 text-xs sm:text-sm font-sans mt-2 leading-relaxed">
              Earn karma coins by submitting daily proof of work, publishing LinkedIn updates, and peer-reviewing squad code. Redeem coins for cloud grants, swag kits, and fast-tracked company referrals.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 font-sans text-xs">
            <button
              onClick={() => setShowTransferModal(true)}
              className="px-5 py-3 rounded-2xl bg-[#D9F83B] hover:bg-[#e5ff59] text-slate-950 font-bold transition-all shadow-md cursor-pointer"
            >
              Tip a Teammate
            </button>
            <Link
              href="/arena/bounties"
              className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white hover:text-slate-950 text-white border border-white/25 font-bold transition-all"
            >
              Bounty Board
            </Link>
          </div>
        </div>
      </div>

      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 mt-8 space-y-8">
        
        {/* Notification message */}
        {buySuccess && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 font-mono text-xs flex items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
              <span>{buySuccess}</span>
            </div>
            <button onClick={() => setBuySuccess(null)} className="text-emerald-700 hover:text-emerald-900 cursor-pointer">
              <X size={14} />
            </button>
          </div>
        )}

        {redeemSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 font-mono text-xs flex items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
              <span>{redeemSuccess}</span>
            </div>
            <button onClick={() => setRedeemSuccess(null)} className="text-emerald-700 hover:text-emerald-900 cursor-pointer">
              <X size={14} />
            </button>
          </div>
        )}

        {transferSuccess && (
          <div className="p-4 rounded-2xl bg-blue-50 border border-blue-300 text-blue-900 font-mono text-xs flex items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-[#0066FF] shrink-0" />
              <span>{transferSuccess}</span>
            </div>
            <button onClick={() => setTransferSuccess(null)} className="text-blue-700 hover:text-blue-900 cursor-pointer">
              <X size={14} />
            </button>
          </div>
        )}

        {/* =========================================================================
            WALLET BALANCE CARD
        ========================================================================= */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-indigo-800/80 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-mono text-[11px] font-bold uppercase tracking-wider mb-2 border border-amber-500/30">
              <Coins size={13} className="text-amber-400" /> Active Student Balance
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-4xl sm:text-5xl font-black text-amber-400 font-mono">
                {currentCoins}
              </span>
              <span className="text-sm font-mono text-slate-300 uppercase tracking-wider font-bold">
                Karma Coins
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-1">
              Account: <strong className="text-white">{email || user?.email || "Guest Account"}</strong>
            </p>
          </div>

          {/* Quick Stats Grid & Buy Credits Trigger */}
          <div className="flex flex-col sm:flex-row items-center gap-3 font-mono text-xs shrink-0 w-full sm:w-auto">
            <div className="grid grid-cols-2 gap-3 w-full sm:w-auto">
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80">
                <span className="text-[10px] text-slate-400 uppercase font-bold block mb-0.5">Lifetime Earned</span>
                <span className="text-lg font-bold text-emerald-400">+{wallet?.lifetimeEarned || 250} Coins</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80">
                <span className="text-[10px] text-slate-400 uppercase font-bold block mb-0.5">Perks Redeemed</span>
                <span className="text-lg font-bold text-purple-400">-{wallet?.spent || 100} Coins</span>
              </div>
            </div>

            <button
              onClick={() => handleInitiatePurchase(CREDIT_PACKS[1])}
              className="w-full sm:w-auto px-5 py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <Zap size={15} className="text-slate-950 fill-slate-950" />
              <span>Buy Credit Pack</span>
            </button>
          </div>
        </div>

        {/* =========================================================================
            BUY KARMA CREDIT PACKS (PRICED FOR INDIAN STUDENTS)
        ========================================================================= */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-mono font-bold text-[#0066FF] uppercase mb-1">
                INSTANT TOP-UP PACKS (RAZORPAY VERIFIED)
              </div>
              <h2 className="text-xl font-bold text-slate-900 font-sans">
                Buy Karma Credits &amp; Accelerate Rewards
              </h2>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                Need urgent access to mock interviews, cloud compute grants, or founder code clinics? Top-up securely via UPI / Cards.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
            {CREDIT_PACKS.map((pack) => (
              <div
                key={pack.id}
                className={`p-6 rounded-3xl border flex flex-col justify-between transition-all ${
                  pack.tag.includes("Popular")
                    ? "bg-gradient-to-b from-blue-50/80 to-white border-[#0066FF] shadow-md ring-2 ring-[#0066FF]/20"
                    : "bg-white border-slate-200 shadow-xs hover:border-slate-300"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px]">
                      {pack.tag}
                    </span>
                    <span className="text-xl font-black text-slate-900">₹{pack.price}</span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base font-sans mb-1">{pack.name}</h3>
                  <div className="text-2xl font-black text-[#0066FF] mb-2">+{pack.coins} Coins</div>
                  <p className="text-slate-600 font-sans text-xs leading-relaxed">{pack.desc}</p>
                </div>

                <button
                  onClick={() => handleInitiatePurchase(pack)}
                  className={`w-full mt-5 py-3 rounded-2xl font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    pack.tag.includes("Popular")
                      ? "bg-[#0066FF] hover:bg-[#0052CC] text-white shadow-xs"
                      : "bg-slate-900 hover:bg-slate-800 text-white"
                  }`}
                >
                  <Coins size={14} />
                  <span>Buy for ₹{pack.price}</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Email Lookup form if not loaded */}
        {!user && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs font-mono text-xs">
            <form onSubmit={handleLookup} className="flex flex-col sm:flex-row items-center gap-4">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your student email (e.g. rahul@college.edu) to sync wallet..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
              >
                {loading ? <Loader2 size={14} className="animate-spin" /> : <span>Sync Balance</span>}
              </button>
            </form>
          </div>
        )}

        {/* =========================================================================
            SECTION 2: REDEEMABLE PERKS & EARN CHANNELS
        ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Redeemable Perks Matrix */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-xs font-mono font-bold text-purple-700 uppercase mb-1">
                    Store &amp; Privileges
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 font-sans">
                    Redeemable Perks &amp; Grants
                  </h2>
                </div>
                <span className="text-xs font-mono text-slate-500">{REDEEMABLE_PERKS.length} Perks Active</span>
              </div>

              <div className="space-y-3 font-mono text-xs">
                {REDEEMABLE_PERKS.map((perk) => {
                  const canAfford = currentCoins >= perk.cost;
                  return (
                    <div
                      key={perk.id}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-300 transition-all"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-slate-900 font-sans text-sm">{perk.title}</span>
                          <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-700 font-bold text-[9px]">
                            {perk.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-mono leading-relaxed">{perk.desc}</p>
                      </div>

                      <button
                        onClick={() => setSelectedPerk(perk)}
                        className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer shrink-0 text-center flex items-center justify-center gap-1.5 ${
                          canAfford
                            ? "bg-slate-900 hover:bg-slate-800 text-white shadow-xs"
                            : "bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200"
                        }`}
                      >
                        <span>Redeem {perk.cost} Coins</span>
                        <ArrowRight size={12} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* How to Earn Coins Matrix */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-xs font-mono font-bold text-emerald-700 uppercase mb-1">
                  Earning Mechanics
                </div>
                <h2 className="text-xl font-bold text-slate-900 font-sans">
                  How to Earn Karma Coins
                </h2>
              </div>
              <span className="text-xs font-mono text-slate-500">6 Verified Routes</span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              {EARN_CHANNELS.map((ch, idx) => {
                const IconComponent = ch.icon;
                return (
                  <Link
                    key={idx}
                    href={ch.href}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/30 transition-all flex items-center justify-between gap-3 group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition-colors flex items-center justify-center shrink-0">
                        <IconComponent size={16} />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 group-hover:text-emerald-800 transition-colors flex items-center gap-1.5">
                          <span>{ch.title}</span>
                          <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-emerald-600" />
                        </div>
                        <div className="text-[11px] text-slate-500 font-sans">{ch.desc}</div>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-xl bg-emerald-100 text-emerald-800 font-bold border border-emerald-200 shrink-0">
                      {ch.reward}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>

        </div>

        {/* =========================================================================
            TRANSACTION HISTORY FEED
        ========================================================================= */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs font-mono text-xs">
          <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
            <History size={16} className="text-slate-500" />
            <span>Recent Karma Activity ({transactions.length})</span>
          </h2>

          <div className="space-y-2.5">
            {transactions.map((tx, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                      tx.type === "EARN"
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                        : "bg-rose-100 text-rose-800 border border-rose-200"
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

      </div>

      {/* =========================================================================
          REDEEM CONFIRMATION MODAL
      ========================================================================= */}
      {selectedPerk && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl font-mono text-xs">
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 font-bold text-[10px]">
                {selectedPerk.badge}
              </span>
              <button onClick={() => setSelectedPerk(null)} className="text-slate-400 hover:text-slate-600">
                <X size={16} />
              </button>
            </div>

            <h3 className="text-lg font-bold text-slate-900 font-sans mb-2">
              Redeem {selectedPerk.title}
            </h3>
            <p className="text-slate-600 mb-6 font-mono text-xs leading-relaxed">
              {selectedPerk.desc}
            </p>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 mb-6 flex items-center justify-between">
              <span>Required Cost:</span>
              <span className="font-bold text-purple-700 text-sm">{selectedPerk.cost} Karma Coins</span>
            </div>

            {currentCoins >= selectedPerk.cost ? (
              <div className="space-y-4">
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-[11px]">
                  <strong>Balance Available:</strong> You have {currentCoins} coins. Redeeming will leave {currentCoins - selectedPerk.cost} coins.
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setSelectedPerk(null)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleRedeemPerk(selectedPerk)}
                    disabled={redeeming}
                    className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                  >
                    {redeeming ? <Loader2 size={14} className="animate-spin" /> : <span>Confirm &amp; Redeem</span>}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px]">
                  <strong>Insufficient Balance:</strong> You have <strong>{currentCoins} coins</strong> ({selectedPerk.cost - currentCoins} more needed). You can earn coins via daily commit logs or top up instantly.
                </div>
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <Link
                    href="/arena/daily-log"
                    onClick={() => setSelectedPerk(null)}
                    className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-center flex items-center justify-center gap-1"
                  >
                    <span>Log Daily Commit (+50)</span>
                  </Link>
                  <button
                    onClick={() => {
                      const targetPack = CREDIT_PACKS.find(p => p.coins >= selectedPerk.cost) || CREDIT_PACKS[0];
                      setSelectedPerk(null);
                      handleInitiatePurchase(targetPack);
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-[#0066FF] hover:bg-blue-600 text-white font-bold flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>Top-Up via Razorpay</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          PEER TRANSFER / TIP MODAL
      ========================================================================= */}
      {showTransferModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl font-mono text-xs">
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 rounded-full bg-blue-100 text-[#0066FF] font-bold text-[10px]">
                Peer Collaboration
              </span>
              <button onClick={() => setShowTransferModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={16} />
              </button>
            </div>

            <h3 className="text-lg font-bold text-slate-900 font-sans mb-1">
              Tip or Transfer Karma Coins
            </h3>
            <p className="text-slate-500 text-[11px] mb-4">
              Send coins to reward peer code reviews or request squad assistance.
            </p>

            <form onSubmit={handleTransferKarma} className="space-y-4">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Recipient Student Email:</label>
                <input
                  type="email"
                  required
                  placeholder="peer@college.edu"
                  value={transferRecipient}
                  onChange={(e) => setTransferRecipient(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Coin Amount (Available: {currentCoins}):</label>
                <input
                  type="number"
                  min={10}
                  max={currentCoins}
                  required
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Reason / Task Note:</label>
                <input
                  type="text"
                  required
                  value={transferReason}
                  onChange={(e) => setTransferReason(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowTransferModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={transferring}
                  className="flex-1 py-2.5 rounded-xl bg-[#0066FF] hover:bg-[#0052CC] text-white font-bold flex items-center justify-center gap-1.5"
                >
                  {transferring ? <Loader2 size={14} className="animate-spin" /> : <span>Send Karma</span>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          RAZORPAY VERIFIED KARMA CREDITS MODAL
      ========================================================================= */}
      {showRazorpayModal && checkoutPack && (
        <RazorpayModal
          isOpen={showRazorpayModal}
          onClose={() => setShowRazorpayModal(false)}
          amount={checkoutPack.price}
          itemName={`${checkoutPack.name} (+${checkoutPack.coins} Karma Coins)`}
          itemCategory="WALLET_TOPUP"
          description={`Purchase ${checkoutPack.coins} Karma Coins for ₹${checkoutPack.price}`}
          metadata={{
            coinsAmount: checkoutPack.coins,
            packId: checkoutPack.id
          }}
          onSuccessCallback={(paymentData) => {
            const targetEmail = email || user?.email;
            if (targetEmail) {
              loadWallet(targetEmail);
            }
            setBuySuccess(`🎉 Payment Verified! Successfully added ${checkoutPack.coins} Karma Coins to your balance (Payment ID: ${paymentData?.razorpay_payment_id || "Verified"}).`);
            setShowRazorpayModal(false);
          }}
        />
      )}

      </div>
    </AuthGate>
  );
}
