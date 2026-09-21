"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check, Star, ArrowRight } from "lucide-react";
import RazorpayModal from "./RazorpayModal";
import { TOTAL_SYSTEMS_COUNT } from "@/lib/arena-projects";

export default function PricingTierCards() {
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    amount: number;
    itemName: string;
  }>({
    isOpen: false,
    amount: 299,
    itemName: "Verified Builder Pass (1-Month AI Internship)"
  });

  const handleOpenCheckout = (amount: number, itemName: string) => {
    setModalState({
      isOpen: true,
      amount,
      itemName
    });
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
              Full open access to all {TOTAL_SYSTEMS_COUNT} production PRDs and open Discord channels for self-directed builders.
            </p>

            <div className="space-y-3 pt-4 border-t border-slate-100 mb-8">
              <div className="flex items-start gap-2 text-slate-700">
                <Check size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                <span>Access to all {TOTAL_SYSTEMS_COUNT} Production System PRDs</span>
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
            <span>Start Free (Self-Paced)</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* TIER 2: ₹299 VERIFIED BUILDER PASS */}
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
              Micro-ticket pass for students wanting verified cryptographic credentials, SLA benchmark audits, and weekly reviews.
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
            type="button"
            onClick={() => handleOpenCheckout(299, "Verified Builder Pass (1-Month AI Internship)")}
            className="w-full py-4 rounded-2xl bg-[#0066FF] hover:bg-[#0052CC] text-white font-bold uppercase tracking-wider text-center transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Get Verified Pass (₹299)</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* TIER 3: ₹1,999 FOUNDER PLACEMENT TRACK */}
        <div className="p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl flex flex-col justify-between">
          <div>
            <div className="text-amber-400 font-bold uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1">
              <Star size={13} /> Track 3: Career Fast-Track
            </div>
            <h3 className="text-2xl font-black text-white font-sans mb-2">
              Founder Placement Track
            </h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-black text-white font-sans">₹1,999</span>
              <span className="text-slate-400 text-xs">/ 45-Day Cohort</span>
            </div>
            <p className="text-slate-400 leading-relaxed mb-6 font-sans text-xs">
              Direct mentorship with Founder Soham Sharma, 1-on-1 code reviews, and job referral assistance under strict criteria.
            </p>

            <div className="space-y-3 pt-4 border-t border-slate-800 mb-8">
              <div className="flex items-start gap-2 text-white font-semibold">
                <Check size={15} className="text-amber-400 shrink-0 mt-0.5" />
                <span>Everything in Verified Pass</span>
              </div>
              <div className="flex items-start gap-2 text-slate-300">
                <Check size={15} className="text-amber-400 shrink-0 mt-0.5" />
                <span>1-on-1 Architecture Code Review with Founder Soham</span>
              </div>
              <div className="flex items-start gap-2 text-slate-300">
                <Check size={15} className="text-amber-400 shrink-0 mt-0.5" />
                <span>Personalized LinkedIn Recommendation upon Insane PRD Completion</span>
              </div>
              <div className="flex items-start gap-2 text-slate-300">
                <Check size={15} className="text-amber-400 shrink-0 mt-0.5" />
                <span>Direct Dispatch to 15 Hiring Partner Companies</span>
              </div>
              <div className="flex items-start gap-2 text-slate-300">
                <Check size={15} className="text-amber-400 shrink-0 mt-0.5" />
                <span>1-on-1 Mock Technical Interview &amp; Architecture Defense</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleOpenCheckout(1999, "Founder Placement Track (45-Day Internship + Placement Referral)")}
            className="w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold uppercase tracking-wider text-center transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Join Founder Track (₹1,999)</span>
            <ArrowRight size={14} />
          </button>
        </div>

      </div>

      {/* Razorpay Checkout Modal */}
      <RazorpayModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ ...modalState, isOpen: false })}
        amount={modalState.amount}
        itemName={modalState.itemName}
        itemCategory="FELLOWSHIP_PASS"
        description="Botmartz 45-Day Virtual AI Internship & Builder Pass"
      />
    </>
  );
}
