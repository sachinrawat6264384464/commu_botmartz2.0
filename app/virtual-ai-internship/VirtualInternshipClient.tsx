"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Check,
  Star,
  ShieldCheck,
  Sparkles,
  Award
} from "lucide-react";
import RazorpayModal from "@/app/_components/RazorpayModal";

export default function VirtualInternshipPricingClient() {
  const [selectedPlan, setSelectedPlan] = useState<{
    amount: number;
    itemName: string;
    description: string;
  } | null>(null);

  const handleOpenCheckout = (amount: number, itemName: string, description: string) => {
    setSelectedPlan({ amount, itemName, description });
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch font-mono text-xs">
        
        {/* TIER 1: FREE OPEN BUILDER */}
        <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="text-slate-500 font-bold uppercase tracking-wider text-[11px] mb-2">
              Track 1: Self-Paced
            </div>
            <h3 className="text-2xl font-black text-slate-900 font-sans mb-2">
              Open Builder
            </h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-black text-slate-950 font-sans">₹0</span>
              <span className="text-slate-500 text-xs">/ Forever Free</span>
            </div>
            <p className="text-slate-600 leading-relaxed mb-6 font-sans text-xs">
              For independent self-learners who want open access to production system PRDs and community Discord.
            </p>

            <div className="space-y-3 pt-4 border-t border-slate-100 mb-8">
              <div className="flex items-start gap-2 text-slate-700">
                <Check size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                <span>Access to all 50 Production System PRDs</span>
              </div>
              <div className="flex items-start gap-2 text-slate-700">
                <Check size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                <span>Open Discord Builder Community</span>
              </div>
              <div className="flex items-start gap-2 text-slate-700">
                <Check size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                <span>6 Progressive Role Roadmaps</span>
              </div>
              <div className="flex items-start gap-2 text-slate-700">
                <Check size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                <span>Public GitHub Proof-of-Work Log</span>
              </div>
            </div>
          </div>

          <Link
            href="/arena"
            className="w-full py-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold uppercase tracking-wider text-center transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Start Free in Arena</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* TIER 2: ₹299 VERIFIED BUILDER PASS (SWEET SPOT) */}
        <div className="p-8 rounded-3xl bg-blue-50/70 border-2 border-blue-500 shadow-xl flex flex-col justify-between relative">
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#0066FF] text-white font-mono text-[10px] font-bold uppercase tracking-wider shadow-sm">
            Most Popular for Students ⭐
          </div>

          <div>
            <div className="text-blue-600 font-bold uppercase tracking-wider text-[11px] mb-2">
              Track 2: Verified Cohort
            </div>
            <h3 className="text-2xl font-black text-slate-950 font-sans mb-2">
              Verified Builder Pass
            </h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-black text-slate-950 font-sans">₹299</span>
              <span className="text-slate-500 text-xs">/ One-time micro fee</span>
            </div>
            <p className="text-slate-700 leading-relaxed mb-6 font-sans text-xs">
              Pocket-friendly pass for students who want official milestone tracking, verified credentials, and weekly reviews.
            </p>

            <div className="space-y-3 pt-4 border-t border-blue-200/60 mb-8">
              <div className="flex items-start gap-2 text-slate-900 font-semibold">
                <Check size={15} className="text-[#0066FF] shrink-0 mt-0.5" />
                <span>Everything in Open Builder</span>
              </div>
              <div className="flex items-start gap-2 text-slate-900">
                <Check size={15} className="text-[#0066FF] shrink-0 mt-0.5" />
                <span>Cryptographic PDF Certificate with QR Verification</span>
              </div>
              <div className="flex items-start gap-2 text-slate-900">
                <Check size={15} className="text-[#0066FF] shrink-0 mt-0.5" />
                <span>Automated SLA Benchmark &amp; Acceptance Gates</span>
              </div>
              <div className="flex items-start gap-2 text-slate-900">
                <Check size={15} className="text-[#0066FF] shrink-0 mt-0.5" />
                <span>Saturday Live Architecture Teardowns (Indore / Discord)</span>
              </div>
              <div className="flex items-start gap-2 text-slate-900">
                <Check size={15} className="text-[#0066FF] shrink-0 mt-0.5" />
                <span>Wednesday Resume Teardown &amp; LinkedIn Profile Audit</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => handleOpenCheckout(
              299,
              "Verified Builder Pass (1-Month AI Internship)",
              "Includes Cryptographic QR Certificate, Weekly Reviews & Automated SLA Gates."
            )}
            className="w-full py-4 rounded-2xl bg-[#0066FF] hover:bg-[#0052CC] text-white font-bold uppercase tracking-wider text-center transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Get Verified Pass (₹299)</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* TIER 3: ₹1,999 ELITE FOUNDER TRACK */}
        <div className="p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl flex flex-col justify-between">
          <div>
            <div className="text-amber-400 font-bold uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1">
              <Star size={13} /> Track 3: Founder Mentorship
            </div>
            <h3 className="text-2xl font-black text-white font-sans mb-2">
              Elite Founder Track
            </h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-black text-white font-sans">₹1,999</span>
              <span className="text-slate-400 text-xs">/ 45-Day Cohort</span>
            </div>
            <p className="text-slate-400 leading-relaxed mb-6 font-sans text-xs">
              Direct mentorship with Founder Soham Sharma, 1-on-1 architecture code audits, and personalized portfolio recommendations.
            </p>

            <div className="space-y-3 pt-4 border-t border-slate-800 mb-8">
              <div className="flex items-start gap-2 text-white font-semibold">
                <Check size={15} className="text-amber-400 shrink-0 mt-0.5" />
                <span>Everything in Verified Pass</span>
              </div>
              <div className="flex items-start gap-2 text-slate-300">
                <Check size={15} className="text-amber-400 shrink-0 mt-0.5" />
                <span>1-on-1 Architecture Code Audit with Founder Soham Sharma</span>
              </div>
              <div className="flex items-start gap-2 text-slate-300">
                <Check size={15} className="text-amber-400 shrink-0 mt-0.5" />
                <span>Personalized LinkedIn Recommendation upon Insane PRD Completion</span>
              </div>
              <div className="flex items-start gap-2 text-slate-300">
                <Check size={15} className="text-amber-400 shrink-0 mt-0.5" />
                <span>In-Depth System Architecture Audit &amp; Optimization Blueprint</span>
              </div>
              <div className="flex items-start gap-2 text-slate-300">
                <Check size={15} className="text-amber-400 shrink-0 mt-0.5" />
                <span>1-on-1 Mock Technical Interview &amp; Architecture Defense</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => handleOpenCheckout(
              1999,
              "Elite Founder Track (45-Day Mentorship & Code Audit)",
              "Includes 1-on-1 Code Audits with Founder Soham Sharma & Mock Technical Defense."
            )}
            className="w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold uppercase tracking-wider text-center transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <span>Join Founder Track (₹1,999)</span>
            <ArrowRight size={14} />
          </button>
        </div>

      </div>

      {/* Razorpay Checkout Modal */}
      {selectedPlan && (
        <RazorpayModal
          isOpen={Boolean(selectedPlan)}
          onClose={() => setSelectedPlan(null)}
          amount={selectedPlan.amount}
          itemName={selectedPlan.itemName}
          description={selectedPlan.description}
          itemCategory="FELLOWSHIP_PASS"
        />
      )}
    </>
  );
}
