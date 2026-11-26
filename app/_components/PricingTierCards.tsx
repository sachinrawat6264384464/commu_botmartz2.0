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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch font-sans">
        
        {/* TIER 1: FREE OPEN BUILDER */}
        <div className="group p-7 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-[#1D3189]/40 transition-all duration-300 flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-bold uppercase tracking-wider text-[11px] mb-4">
              Track 1 &bull; Self-Paced
            </div>
            <h3 className="text-2xl font-extrabold text-slate-950 font-sans mb-2">
              Open Builder
            </h3>
            <div className="flex items-baseline gap-1.5 mb-5">
              <span className="text-4xl sm:text-5xl font-black text-slate-950 font-sans">₹0</span>
              <span className="text-slate-500 text-xs font-medium">/ Forever Free</span>
            </div>
            <p className="text-slate-600 leading-relaxed mb-6 text-sm">
              Full open access to all {TOTAL_SYSTEMS_COUNT} production PRDs and open community channels for self-directed builders.
            </p>

            <div className="space-y-3 pt-5 border-t border-slate-100 mb-8 text-sm">
              <div className="flex items-start gap-2.5 text-slate-700">
                <Check size={16} className="text-[#1D3189] shrink-0 mt-0.5" />
                <span>Access to all {TOTAL_SYSTEMS_COUNT} Production System PRDs</span>
              </div>
              <div className="flex items-start gap-2.5 text-slate-700">
                <Check size={16} className="text-[#1D3189] shrink-0 mt-0.5" />
                <span>Open Builder Community</span>
              </div>
              <div className="flex items-start gap-2.5 text-slate-700">
                <Check size={16} className="text-[#1D3189] shrink-0 mt-0.5" />
                <span>6 Progressive Role Roadmaps</span>
              </div>
              <div className="flex items-start gap-2.5 text-slate-700">
                <Check size={16} className="text-[#1D3189] shrink-0 mt-0.5" />
                <span>Public GitHub Proof-of-Work Log</span>
              </div>
            </div>
          </div>

          <Link
            href="/arena"
            className="w-full py-3.5 px-6 rounded-full bg-slate-100 hover:bg-[#1D3189] text-slate-900 hover:text-white font-bold text-xs sm:text-sm text-center transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Start Free (Self-Paced)</span>
            <ArrowRight size={15} className="transition-transform duration-300 group-hover:-rotate-45" />
          </Link>
        </div>

        {/* TIER 2: ₹299 VERIFIED BUILDER PASS */}
        <div className="group p-7 sm:p-8 rounded-3xl bg-white border-2 border-[#1D3189] shadow-2xl shadow-[#1D3189]/10 flex flex-col justify-between relative">
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#D9F83B] text-slate-950 font-sans text-[11px] font-extrabold uppercase tracking-wider shadow-sm whitespace-nowrap">
            Most Popular for Students
          </div>

          <div>
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#1D3189]/10 text-[#1D3189] font-bold uppercase tracking-wider text-[11px] mb-4">
              Track 2 &bull; Verified Cohort
            </div>
            <h3 className="text-2xl font-extrabold text-slate-950 font-sans mb-2">
              Verified Builder Pass
            </h3>
            <div className="flex items-baseline gap-1.5 mb-5">
              <span className="text-4xl sm:text-5xl font-black text-slate-950 font-sans">₹299</span>
              <span className="text-slate-500 text-xs font-medium">/ One-time micro fee</span>
            </div>
            <p className="text-slate-600 leading-relaxed mb-6 text-sm">
              Micro-ticket pass for students wanting verified cryptographic credentials, SLA benchmark audits, and weekly reviews.
            </p>

            <div className="space-y-3 pt-5 border-t border-slate-100 mb-8 text-sm">
              <div className="flex items-start gap-2.5 text-slate-950 font-semibold">
                <Check size={16} className="text-[#1D3189] shrink-0 mt-0.5" />
                <span>Everything in Open Builder</span>
              </div>
              <div className="flex items-start gap-2.5 text-slate-700">
                <Check size={16} className="text-[#1D3189] shrink-0 mt-0.5" />
                <span>Cryptographic PDF Certificate with QR Verification</span>
              </div>
              <div className="flex items-start gap-2.5 text-slate-700">
                <Check size={16} className="text-[#1D3189] shrink-0 mt-0.5" />
                <span>Automated SLA Benchmark &amp; Acceptance Gates</span>
              </div>
              <div className="flex items-start gap-2.5 text-slate-700">
                <Check size={16} className="text-[#1D3189] shrink-0 mt-0.5" />
                <span>Saturday Live Architecture Teardowns (Indore / Online)</span>
              </div>
              <div className="flex items-start gap-2.5 text-slate-700">
                <Check size={16} className="text-[#1D3189] shrink-0 mt-0.5" />
                <span>Wednesday Resume Teardown &amp; LinkedIn Profile Audit</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleOpenCheckout(299, "Verified Builder Pass (1-Month AI Internship)")}
            className="w-full py-3.5 px-6 rounded-full bg-[#1D3189] hover:bg-[#070E54] text-white font-bold text-xs sm:text-sm text-center transition-all shadow-lg shadow-[#1D3189]/20 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Get Verified Pass (₹299)</span>
            <ArrowRight size={15} className="transition-transform duration-300 group-hover:-rotate-45" />
          </button>
        </div>

        {/* TIER 3: ₹1,999 FOUNDER PLACEMENT TRACK */}
        <div className="group p-7 sm:p-8 rounded-3xl bg-gradient-to-br from-[#1D3189] to-[#070E54] text-white border border-[#1D3189] shadow-2xl flex flex-col justify-between relative overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(255, 255, 255, 0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.06) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D9F83B] text-slate-950 font-bold uppercase tracking-wider text-[11px] mb-4">
              <Star size={12} className="fill-slate-950" /> Track 3 &bull; Career Fast-Track
            </div>
            <h3 className="text-2xl font-extrabold text-white font-sans mb-2">
              Founder Placement Track
            </h3>
            <div className="flex items-baseline gap-1.5 mb-5">
              <span className="text-4xl sm:text-5xl font-black text-white font-sans">₹1,999</span>
              <span className="text-blue-200/80 text-xs font-medium">/ 45-Day Cohort</span>
            </div>
            <p className="text-blue-100/85 leading-relaxed mb-6 text-sm">
              Direct mentorship with Founder Soham Sharma, 1-on-1 code reviews, and job referral assistance under strict criteria.
            </p>

            <div className="space-y-3 pt-5 border-t border-white/15 mb-8 text-sm">
              <div className="flex items-start gap-2.5 text-white font-semibold">
                <Check size={16} className="text-[#D9F83B] shrink-0 mt-0.5" />
                <span>Everything in Verified Pass</span>
              </div>
              <div className="flex items-start gap-2.5 text-blue-100/90">
                <Check size={16} className="text-[#D9F83B] shrink-0 mt-0.5" />
                <span>1-on-1 Architecture Code Review with Founder Soham</span>
              </div>
              <div className="flex items-start gap-2.5 text-blue-100/90">
                <Check size={16} className="text-[#D9F83B] shrink-0 mt-0.5" />
                <span>Personalized LinkedIn Recommendation upon Insane PRD Completion</span>
              </div>
              <div className="flex items-start gap-2.5 text-blue-100/90">
                <Check size={16} className="text-[#D9F83B] shrink-0 mt-0.5" />
                <span>Direct Dispatch to 15 Hiring Partner Companies</span>
              </div>
              <div className="flex items-start gap-2.5 text-blue-100/90">
                <Check size={16} className="text-[#D9F83B] shrink-0 mt-0.5" />
                <span>1-on-1 Mock Technical Interview &amp; Architecture Defense</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleOpenCheckout(1999, "Founder Placement Track (45-Day Internship + Placement Referral)")}
            className="relative z-10 w-full py-3.5 px-6 rounded-full bg-[#D9F83B] hover:bg-[#e5ff59] text-slate-950 font-bold text-xs sm:text-sm text-center transition-all shadow-lg shadow-lime-400/20 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Join Founder Track (₹1,999)</span>
            <ArrowRight size={15} className="transition-transform duration-300 group-hover:-rotate-45" />
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
