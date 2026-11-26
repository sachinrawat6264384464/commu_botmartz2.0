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
import { TOTAL_SYSTEMS_COUNT } from "@/lib/arena-projects";

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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch font-sans text-xs">

        {/* TIER 1: FREE OPEN BUILDER */}
        <div className="relative overflow-hidden p-8 rounded-3xl bg-white border border-slate-200 shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-500 flex flex-col justify-between group">
          <div>
            <div className="text-slate-500 font-bold uppercase tracking-wider text-[11px] mb-2">
              Track 1: Self-Paced
            </div>
            <h3 className="text-2xl font-black text-slate-950 font-sans mb-2">
              Open Builder
            </h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-black text-slate-950 font-sans">₹0</span>
              <span className="text-slate-500 text-xs font-medium">/ Forever Free</span>
            </div>
            <p className="text-slate-600 leading-relaxed mb-6 font-sans text-xs font-medium">
              For independent self-learners who want open access to production system PRDs and community resources.
            </p>

            <div className="space-y-3 pt-4 border-t border-slate-100 mb-8 font-medium">
              <div className="flex items-start gap-2.5 text-slate-700">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1D3189] mt-1.5 shrink-0" />
                <span>Access to all {TOTAL_SYSTEMS_COUNT} Production System PRDs</span>
              </div>
              <div className="flex items-start gap-2.5 text-slate-700">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1D3189] mt-1.5 shrink-0" />
                <span>Open Builder Community</span>
              </div>
              <div className="flex items-start gap-2.5 text-slate-700">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1D3189] mt-1.5 shrink-0" />
                <span>6 Progressive Role Roadmaps</span>
              </div>
              <div className="flex items-start gap-2.5 text-slate-700">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1D3189] mt-1.5 shrink-0" />
                <span>Public GitHub Proof-of-Work Log</span>
              </div>
            </div>
          </div>

          <Link
            href="/arena"
            className="w-full py-3.5 rounded-2xl bg-slate-100 hover:bg-[#070E54] hover:text-white text-slate-900 font-bold text-center transition-all duration-300 cursor-pointer"
          >
            Start Free in Arena &rarr;
          </Link>
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#1D3189] to-[#D9F83B] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-700 ease-in-out" />
        </div>

        {/* TIER 2: ₹299 VERIFIED BUILDER PASS (SWEET SPOT) */}
        <div className="relative overflow-hidden p-8 rounded-3xl bg-white border-2 border-[#1D3189] shadow-xl hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-500 flex flex-col justify-between group">
          <div className="inline-block w-fit px-3.5 py-1 rounded-full bg-[#D9F83B] text-slate-950 font-sans text-[10px] font-extrabold uppercase tracking-wider mb-3">
            Most Popular for Students
          </div>

          <div>
            <div className="text-[#1D3189] font-bold uppercase tracking-wider text-[11px] mb-2">
              Track 2: Verified Cohort
            </div>
            <h3 className="text-2xl font-black text-slate-950 font-sans mb-2">
              Verified Builder Pass
            </h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-black text-slate-950 font-sans">₹299</span>
              <span className="text-slate-500 text-xs font-medium">/ One-time micro fee</span>
            </div>
            <p className="text-slate-600 leading-relaxed mb-6 font-sans text-xs font-medium">
              Pocket-friendly pass for students who want official milestone tracking, verified credentials, and weekly reviews.
            </p>

            <div className="space-y-3 pt-4 border-t border-slate-100 mb-8 font-medium">
              <div className="flex items-start gap-2.5 text-slate-950 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1D3189] mt-1.5 shrink-0" />
                <span>Everything in Open Builder</span>
              </div>
              <div className="flex items-start gap-2.5 text-slate-700">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1D3189] mt-1.5 shrink-0" />
                <span>Cryptographic PDF Certificate with QR Verification</span>
              </div>
              <div className="flex items-start gap-2.5 text-slate-700">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1D3189] mt-1.5 shrink-0" />
                <span>Automated SLA Benchmark &amp; Acceptance Gates</span>
              </div>
              <div className="flex items-start gap-2.5 text-slate-700">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1D3189] mt-1.5 shrink-0" />
                <span>Saturday Live Architecture Teardowns (Indore / Online)</span>
              </div>
              <div className="flex items-start gap-2.5 text-slate-700">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1D3189] mt-1.5 shrink-0" />
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
            className="w-full py-3.5 rounded-2xl bg-[#1D3189] hover:bg-[#152468] text-white font-bold text-center transition-all duration-300 shadow-md cursor-pointer"
          >
            Get Verified Pass (₹299) &rarr;
          </button>
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#1D3189] to-[#D9F83B] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-700 ease-in-out" />
        </div>

        {/* TIER 3: ₹1,999 ELITE FOUNDER TRACK */}
        <div className="relative overflow-hidden p-8 rounded-3xl bg-[#070E54] text-white border border-white/15 shadow-xl hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-500 flex flex-col justify-between group">
          <div>
            <div className="text-[#D9F83B] font-bold uppercase tracking-wider text-[11px] mb-2">
              Track 3: Founder Mentorship
            </div>
            <h3 className="text-2xl font-black text-white font-sans mb-2">
              Elite Founder Track
            </h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-black text-white font-sans">₹1,999</span>
              <span className="text-blue-200/80 text-xs font-medium">/ 4-Week Cohort</span>
            </div>
            <p className="text-blue-100/85 leading-relaxed mb-6 font-sans text-xs font-medium">
              Direct mentorship with Founder Soham Sharma, 1-on-1 architecture code audits, and personalized portfolio recommendations.
            </p>

            <div className="space-y-3 pt-4 border-t border-white/15 mb-8 font-medium">
              <div className="flex items-start gap-2.5 text-white font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D9F83B] mt-1.5 shrink-0" />
                <span>Everything in Verified Pass</span>
              </div>
              <div className="flex items-start gap-2.5 text-blue-100/85">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D9F83B] mt-1.5 shrink-0" />
                <span>1-on-1 Architecture Code Audit with Founder Soham Sharma</span>
              </div>
              <div className="flex items-start gap-2.5 text-blue-100/85">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D9F83B] mt-1.5 shrink-0" />
                <span>Personalized LinkedIn Recommendation upon Insane PRD Completion</span>
              </div>
              <div className="flex items-start gap-2.5 text-blue-100/85">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D9F83B] mt-1.5 shrink-0" />
                <span>In-Depth System Architecture Audit &amp; Optimization Blueprint</span>
              </div>
              <div className="flex items-start gap-2.5 text-blue-100/85">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D9F83B] mt-1.5 shrink-0" />
                <span>1-on-1 Mock Technical Interview &amp; Architecture Defense</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => handleOpenCheckout(
              1999,
              "Elite Founder Track (4-Week Mentorship & Code Audit)",
              "Includes 1-on-1 Code Audits with Founder Soham Sharma & Mock Technical Defense."
            )}
            className="w-full py-3.5 rounded-2xl bg-[#D9F83B] hover:bg-[#e5ff59] text-slate-950 font-bold text-center transition-all duration-300 cursor-pointer shadow-lg shadow-lime-400/20"
          >
            Join Founder Track (₹1,999) &rarr;
          </button>
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-1.5 bg-[#D9F83B] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-700 ease-in-out" />
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
