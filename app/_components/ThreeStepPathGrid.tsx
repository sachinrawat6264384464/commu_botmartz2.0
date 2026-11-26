"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function ThreeStepPathGrid({ totalSystemsCount }: { totalSystemsCount: number }) {
  const gridRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(1);
  const [isDesktop, setIsDesktop] = useState(false);

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
      // Starts stacked over Step 2 in the center with blur when entering bottom (0.98 * vh)
      // Settles cleanly & sharply into all 3 positions by 0.55 * vh
      const startTop = vh * 0.98;
      const endTop = vh * 0.55;
      const raw = (startTop - rect.top) / (startTop - endTop);
      const clamped = Math.max(0, Math.min(1, raw));
      setProgress(clamped);
    };

    updateScroll();
    window.addEventListener("scroll", updateScroll, { passive: true });
    window.addEventListener("resize", updateScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", updateScroll);
      window.removeEventListener("resize", updateScroll);
    };
  }, []);

  const blurPx = isDesktop ? (1 - progress) * 8 : 0;
  const opacityVal = isDesktop ? 0.35 + progress * 0.65 : 1;
  const scaleVal = isDesktop ? 0.94 + progress * 0.06 : 1;

  // Step 1 starts over Step 2 (+104%), Step 2 stays center (0%), Step 3 starts over Step 2 (-104%)
  const step1X = isDesktop ? 104 * (1 - progress) : 0;
  const step3X = isDesktop ? -104 * (1 - progress) : 0;

  return (
    <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 relative">
      {/* Step 1 */}
      <Link
        href="/arena"
        style={{
          transform: `translate3d(${step1X}%, 0, 0) scale(${scaleVal})`,
          filter: blurPx > 0.1 ? `blur(${blurPx.toFixed(1)}px)` : "none",
          opacity: opacityVal,
          zIndex: 20,
        }}
        className="group relative bg-white rounded-2xl border border-slate-200/90 p-7 sm:p-8 shadow-sm hover:shadow-xl hover:border-[#1D3189]/40 transition-[border-color,box-shadow] duration-300 flex flex-col justify-between overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-slate-100 group-hover:bg-[#1D3189] transition-colors duration-300" />
        <span className="absolute top-4 right-6 text-6xl font-black text-slate-100 group-hover:text-[#1D3189]/10 transition-colors select-none font-sans">
          01
        </span>

        <div className="relative z-10">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 text-slate-800 group-hover:bg-[#1D3189] group-hover:text-white font-sans text-[11px] font-bold uppercase tracking-wider mb-5 transition-colors">
            Step 01
          </div>
          <h3 className="text-xl font-bold text-slate-950 mb-2.5 font-sans">
            Pick a Track &amp; Warmup PRD
          </h3>
          <p className="text-slate-600 text-sm font-sans leading-relaxed">
            Select from {totalSystemsCount} projects (AI Agents, Defence, RAG, Embedded Edge, High-Frequency Telemetry) or follow our 6 Role Roadmaps.
          </p>
        </div>

        <div className="relative z-10 pt-5 mt-7 border-t border-slate-100 flex items-center justify-between text-[#1D3189] font-sans text-sm font-bold">
          <span>Browse {totalSystemsCount} Projects Matrix</span>
          <span className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-[#D9F83B] text-slate-900 flex items-center justify-center transition-all duration-300">
            <ArrowRight size={15} className="transition-transform duration-300 group-hover:-rotate-45" />
          </span>
        </div>
      </Link>

      {/* Step 2 (Center Anchor) */}
      <Link
        href="/arena/daily-log"
        style={{
          transform: `scale(${scaleVal})`,
          filter: blurPx > 0.1 ? `blur(${blurPx.toFixed(1)}px)` : "none",
          opacity: opacityVal,
          zIndex: 10,
        }}
        className="group relative bg-white rounded-2xl border border-slate-200/90 p-7 sm:p-8 shadow-sm hover:shadow-xl hover:border-[#1D3189]/40 transition-[border-color,box-shadow] duration-300 flex flex-col justify-between overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-slate-100 group-hover:bg-[#1D3189] transition-colors duration-300" />
        <span className="absolute top-4 right-6 text-6xl font-black text-slate-100 group-hover:text-[#1D3189]/10 transition-colors select-none font-sans">
          02
        </span>

        <div className="relative z-10">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 text-slate-800 group-hover:bg-[#1D3189] group-hover:text-white font-sans text-[11px] font-bold uppercase tracking-wider mb-5 transition-colors">
            Step 02
          </div>
          <h3 className="text-xl font-bold text-slate-950 mb-2.5 font-sans">
            Conquer the &quot;Insane&quot; Project
          </h3>
          <p className="text-slate-600 text-sm font-sans leading-relaxed">
            Build one of the high-difficulty systems (Satellite AI, 3D MRI, Rust Order Book, LangGraph Swarm) and pass automated SLA benchmarks with daily GitHub commit logs.
          </p>
        </div>

        <div className="relative z-10 pt-5 mt-7 border-t border-slate-100 flex items-center justify-between text-[#1D3189] font-sans text-sm font-bold">
          <span>Daily Proof-of-Work Log</span>
          <span className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-[#D9F83B] text-slate-900 flex items-center justify-center transition-all duration-300">
            <ArrowRight size={15} className="transition-transform duration-300 group-hover:-rotate-45" />
          </span>
        </div>
      </Link>

      {/* Step 3 */}
      <Link
        href="/virtual-ai-internship#pricing"
        style={{
          transform: `translate3d(${step3X}%, 0, 0) scale(${scaleVal})`,
          filter: blurPx > 0.1 ? `blur(${blurPx.toFixed(1)}px)` : "none",
          opacity: opacityVal,
          zIndex: 30,
        }}
        className="group relative bg-gradient-to-br from-[#1D3189] to-[#070E54] rounded-2xl border border-[#1D3189] p-7 sm:p-8 shadow-xl hover:shadow-2xl transition-[border-color,box-shadow] duration-300 flex flex-col justify-between overflow-hidden text-white"
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#D9F83B]" />
        <span className="absolute top-4 right-6 text-6xl font-black text-white/25 group-hover:text-[#D9F83B]/40 transition-colors select-none font-sans">
          03
        </span>

        <div className="relative z-10">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#D9F83B] text-slate-950 font-sans text-[11px] font-bold uppercase tracking-wider mb-5">
            Step 03
          </div>
          <h3 className="text-xl font-bold text-white mb-2.5 font-sans">
            Founder Recommendation &amp; Referral
          </h3>
          <p className="text-blue-100/85 text-sm font-sans leading-relaxed">
            Pass strict code review on your Insane Project to unlock a personalized recommendation from Founder Soham Sharma and direct job referral assistance to 15 partner companies.
          </p>
        </div>

        <div className="relative z-10 pt-5 mt-7 border-t border-white/15 flex items-center justify-between text-[#D9F83B] font-sans text-sm font-bold">
          <span>View Plans (Free / ₹299 / ₹1,999)</span>
          <span className="w-8 h-8 rounded-full bg-[#D9F83B] text-slate-950 flex items-center justify-center group-hover:scale-105 transition-all duration-300">
            <ArrowRight size={15} className="transition-transform duration-300 group-hover:-rotate-45" />
          </span>
        </div>
      </Link>
    </div>
  );
}
