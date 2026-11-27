"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Check, Star, ArrowRight } from "lucide-react";
import RazorpayModal from "./RazorpayModal";
import { TOTAL_SYSTEMS_COUNT } from "@/lib/arena-projects";

export default function PricingTierCards() {
  const gridRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(1);
  const [isDesktop, setIsDesktop] = useState(false);

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    amount: number;
    itemName: string;
  }>({
    isOpen: false,
    amount: 299,
    itemName: "Verified Builder Pass (1-Month AI Internship)"
  });

  useEffect(() => {
    const updateScroll = () => {
      const desktop = window.innerWidth >= 1024;
      setIsDesktop(desktop);
      if (!desktop || !gridRef.current) {
        setProgress(1);
        return;
      }

      const rect = gridRef.current.getBoundingClientRect();
      const vh = window.innerHeight;
      const startTop = vh * 0.98;
      const endTop = vh * 0.56;
      const raw = (startTop - rect.top) / (startTop - endTop);
      setProgress(Math.max(0, Math.min(1, raw)));
    };

    updateScroll();
    window.addEventListener("scroll", updateScroll, { passive: true });
    window.addEventListener("resize", updateScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", updateScroll);
      window.removeEventListener("resize", updateScroll);
    };
  }, []);

  const inv = 1 - progress;
  const sideScale = isDesktop ? 0.9 + progress * 0.1 : 1;
  const centerScale = isDesktop ? 0.94 + progress * 0.06 : 1;
  const opacityVal = isDesktop ? 0.4 + progress * 0.6 : 1;

  const leftTransform = isDesktop
    ? `translate3d(${68 * inv}%, ${24 * inv}px, 0) rotate(${-5 * inv}deg) scale(${sideScale})`
    : undefined;
  const centerTransform = isDesktop
    ? `translate3d(0, ${36 * inv}px, 0) scale(${centerScale})`
    : undefined;
  const rightTransform = isDesktop
    ? `translate3d(${-68 * inv}%, ${24 * inv}px, 0) rotate(${5 * inv}deg) scale(${sideScale})`
    : undefined;

  const handleOpenCheckout = (amount: number, itemName: string) => {
    setModalState({
      isOpen: true,
      amount,
      itemName
    });
  };

  return (
    <>
      <div ref={gridRef} className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch font-sans relative">
        
        {/* TIER 1: FREE OPEN BUILDER */}
        <div
          style={{
            transform: leftTransform,
            opacity: opacityVal,
            zIndex: 10,
          }}
          className="group p-7 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-[#1D3189]/40 transition-[border-color,box-shadow] duration-300 flex flex-col justify-between"
        >
          <div>
            <div className="inline-flex items-center px-3.5 py-1 rounded-full bg-slate-100 text-slate-900 font-extrabold uppercase tracking-wider text-xs mb-4">
              Track 1 &bull; Self-Paced
            </div>
            <h3 className="text-2xl font-extrabold text-slate-950 tracking-tight font-sans mb-2">
              Open Builder
            </h3>
            <div className="flex items-baseline gap-2 mb-5">
              <span className="text-4xl sm:text-5xl font-black text-slate-950 font-sans">₹0</span>
              <span className="text-slate-600 text-sm font-bold">/ Forever Free</span>
            </div>
            <p className="text-slate-700 font-medium leading-relaxed mb-6 text-sm sm:text-[15px]">
              Full open access to all {TOTAL_SYSTEMS_COUNT} production PRDs and open community channels for self-directed builders.
            </p>

            <div className="space-y-3 pt-5 border-t border-slate-100 mb-8 text-sm font-semibold">
              <div className="flex items-start gap-2.5 text-slate-800">
                <Check size={16} className="text-[#1D3189] shrink-0 mt-0.5" />
                <span>Access to all {TOTAL_SYSTEMS_COUNT} Production System PRDs</span>
              </div>
              <div className="flex items-start gap-2.5 text-slate-800">
                <Check size={16} className="text-[#1D3189] shrink-0 mt-0.5" />
                <span>Open Builder Community</span>
              </div>
              <div className="flex items-start gap-2.5 text-slate-800">
                <Check size={16} className="text-[#1D3189] shrink-0 mt-0.5" />
                <span>6 Progressive Role Roadmaps</span>
              </div>
              <div className="flex items-start gap-2.5 text-slate-800">
                <Check size={16} className="text-[#1D3189] shrink-0 mt-0.5" />
                <span>Public GitHub Proof-of-Work Log</span>
              </div>
            </div>
          </div>

          <Link
            href="/arena"
            className="w-full py-2.5 pl-6 pr-3 rounded-full bg-slate-100 hover:bg-[#1D3189] text-slate-950 hover:text-white font-extrabold text-sm text-center transition-all flex items-center justify-between gap-2 cursor-pointer"
          >
            <span>Start Free (Self-Paced)</span>
            <span className="w-7 h-7 rounded-full bg-[#1D3189] group-hover:bg-[#D9F83B] text-white group-hover:text-slate-950 inline-flex items-center justify-center shrink-0 transition-colors">
              <ArrowRight size={14} className="transition-transform duration-300 group-hover:-rotate-45" />
            </span>
          </Link>
        </div>

        {/* TIER 2: ₹299 VERIFIED BUILDER PASS */}
        <div
          style={{
            transform: centerTransform,
            opacity: opacityVal,
            zIndex: 30,
          }}
          className="group p-7 sm:p-8 rounded-3xl bg-white border-2 border-[#1D3189] shadow-2xl shadow-[#1D3189]/10 transition-[box-shadow] duration-300 flex flex-col justify-between relative"
        >
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#D9F83B] text-slate-950 font-sans text-[11px] font-extrabold uppercase tracking-wider shadow-sm whitespace-nowrap">
            Most Popular for Students
          </div>

          <div>
            <div className="inline-flex items-center px-3.5 py-1 rounded-full bg-[#1D3189]/10 text-[#1D3189] font-extrabold uppercase tracking-wider text-xs mb-4">
              Track 2 &bull; Verified Cohort
            </div>
            <h3 className="text-2xl font-extrabold text-slate-950 tracking-tight font-sans mb-2">
              Verified Builder Pass
            </h3>
            <div className="flex items-baseline gap-2 mb-5">
              <span className="text-4xl sm:text-5xl font-black text-slate-950 font-sans">₹299</span>
              <span className="text-slate-600 text-sm font-bold">/ One-time micro fee</span>
            </div>
            <p className="text-slate-700 font-medium leading-relaxed mb-6 text-sm sm:text-[15px]">
              Micro-ticket pass for students wanting verified cryptographic credentials, SLA benchmark audits, and weekly reviews.
            </p>

            <div className="space-y-3 pt-5 border-t border-slate-100 mb-8 text-sm font-semibold">
              <div className="flex items-start gap-2.5 text-slate-950 font-bold">
                <Check size={16} className="text-[#1D3189] shrink-0 mt-0.5" />
                <span>Everything in Open Builder</span>
              </div>
              <div className="flex items-start gap-2.5 text-slate-800">
                <Check size={16} className="text-[#1D3189] shrink-0 mt-0.5" />
                <span>Cryptographic PDF Certificate with QR Verification</span>
              </div>
              <div className="flex items-start gap-2.5 text-slate-800">
                <Check size={16} className="text-[#1D3189] shrink-0 mt-0.5" />
                <span>Automated SLA Benchmark &amp; Acceptance Gates</span>
              </div>
              <div className="flex items-start gap-2.5 text-slate-800">
                <Check size={16} className="text-[#1D3189] shrink-0 mt-0.5" />
                <span>Saturday Live Architecture Teardowns (Indore / Online)</span>
              </div>
              <div className="flex items-start gap-2.5 text-slate-800">
                <Check size={16} className="text-[#1D3189] shrink-0 mt-0.5" />
                <span>Wednesday Resume Teardown &amp; LinkedIn Profile Audit</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleOpenCheckout(299, "Verified Builder Pass (1-Month AI Internship)")}
            className="w-full py-2.5 pl-6 pr-3 rounded-full bg-[#1D3189] hover:bg-[#070E54] text-white font-extrabold text-sm text-center transition-all shadow-lg shadow-[#1D3189]/20 flex items-center justify-between gap-2 cursor-pointer"
          >
            <span>Get Verified Pass (₹299)</span>
            <span className="w-7 h-7 rounded-full bg-[#D9F83B] text-slate-950 inline-flex items-center justify-center shrink-0">
              <ArrowRight size={14} className="transition-transform duration-300 group-hover:-rotate-45" />
            </span>
          </button>
        </div>

        {/* TIER 3: ₹1,999 FOUNDER PLACEMENT TRACK */}
        <div
          style={{
            transform: rightTransform,
            opacity: opacityVal,
            zIndex: 20,
          }}
          className="group p-7 sm:p-8 rounded-3xl bg-gradient-to-br from-[#1D3189] to-[#070E54] text-white border border-[#1D3189] shadow-2xl transition-[box-shadow] duration-300 flex flex-col justify-between relative overflow-hidden"
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(255, 255, 255, 0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.06) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />

          <div className="relative z-10">
            <div className="inline-flex items-center px-3.5 py-1 rounded-full bg-[#D9F83B] text-slate-950 font-extrabold uppercase tracking-wider text-xs mb-4">
              Track 3 &bull; Career Fast-Track
            </div>
            <h3 className="text-2xl font-extrabold text-white tracking-tight font-sans mb-2">
              Founder Placement Track
            </h3>
            <div className="flex items-baseline gap-2 mb-5">
              <span className="text-4xl sm:text-5xl font-black text-white font-sans">₹1,999</span>
              <span className="text-white/85 text-sm font-bold">/ 45-Day Cohort</span>
            </div>
            <p className="text-white/90 font-medium leading-relaxed mb-6 text-sm sm:text-[15px]">
              Direct mentorship with Founder Soham Sharma, 1-on-1 code reviews, and job referral assistance under strict criteria.
            </p>

            <div className="space-y-3 pt-5 border-t border-white/15 mb-8 text-sm font-semibold">
              <div className="flex items-start gap-2.5 text-white font-bold">
                <Check size={16} className="text-[#D9F83B] shrink-0 mt-0.5" />
                <span>Everything in Verified Pass</span>
              </div>
              <div className="flex items-start gap-2.5 text-white/95">
                <Check size={16} className="text-[#D9F83B] shrink-0 mt-0.5" />
                <span>1-on-1 Architecture Code Review with Founder Soham</span>
              </div>
              <div className="flex items-start gap-2.5 text-white/95">
                <Check size={16} className="text-[#D9F83B] shrink-0 mt-0.5" />
                <span>Personalized LinkedIn Recommendation upon Insane PRD Completion</span>
              </div>
              <div className="flex items-start gap-2.5 text-white/95">
                <Check size={16} className="text-[#D9F83B] shrink-0 mt-0.5" />
                <span>Direct Dispatch to 15 Hiring Partner Companies</span>
              </div>
              <div className="flex items-start gap-2.5 text-white/95">
                <Check size={16} className="text-[#D9F83B] shrink-0 mt-0.5" />
                <span>1-on-1 Mock Technical Interview &amp; Architecture Defense</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleOpenCheckout(1999, "Founder Placement Track (45-Day Internship + Placement Referral)")}
            className="relative z-10 w-full py-2.5 pl-6 pr-3 rounded-full bg-[#D9F83B] hover:bg-[#e5ff59] text-slate-950 font-extrabold text-sm text-center transition-all shadow-lg shadow-lime-400/20 flex items-center justify-between gap-2 cursor-pointer"
          >
            <span>Join Founder Track (₹1,999)</span>
            <span className="w-7 h-7 rounded-full bg-slate-950 text-[#D9F83B] inline-flex items-center justify-center shrink-0">
              <ArrowRight size={14} className="transition-transform duration-300 group-hover:-rotate-45" />
            </span>
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
