"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function WeeklyRitualsBento() {
  const bentoRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(1);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const updateScroll = () => {
      const desktop = window.innerWidth >= 1024;
      setIsDesktop(desktop);
      if (!desktop || !bentoRef.current) {
        setProgress(1);
        return;
      }

      const rect = bentoRef.current.getBoundingClientRect();
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
  const leftOffset = isDesktop ? -48 * inv : 0;
  const rightOffset = isDesktop ? 48 * inv : 0;
  const opacityVal = isDesktop ? 0.35 + progress * 0.65 : 1;
  const scaleVal = isDesktop ? 0.96 + progress * 0.04 : 1;

  return (
    <div ref={bentoRef} className="grid grid-cols-1 lg:grid-cols-12 gap-5 font-sans">
      {/* Left Tall Feature Card */}
      <div
        style={{
          transform: `translate3d(${leftOffset}px, 0, 0) scale(${scaleVal})`,
          opacity: opacityVal,
        }}
        className="group lg:col-span-5 rounded-3xl bg-gradient-to-br from-[#1D3189] to-[#070E54] text-white p-7 sm:p-9 flex flex-col justify-between relative overflow-hidden shadow-xl border border-[#1D3189]/20"
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255, 255, 255, 0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.06) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        {/* Right-to-Left Sliding White Layer on Hover (Slow Motion) */}
        <div className="absolute inset-0 bg-white translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-out pointer-events-none z-[1]" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white group-hover:bg-[#1D3189] text-[#162774] group-hover:text-white text-xs font-extrabold uppercase tracking-wider mb-5 transition-colors duration-500">
            Saturday &bull; 5:00 PM – 7:00 PM IST
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-snug mb-3 text-white group-hover:text-slate-950 transition-colors duration-500">
            Indore AI Hub &amp; Live Architecture Teardowns
          </h3>
          <p className="text-white/90 group-hover:text-slate-700 text-sm sm:text-[15px] font-medium leading-relaxed mb-6 transition-colors duration-500">
            In-person meetups at the Indore AI Hub unlock whenever 50+ builders RSVP (or join live online) for 1-on-1 architecture audits and bug fixes with Founder Soham Sharma.
          </p>
        </div>

        <div className="relative z-10 pt-5 border-t border-white/15 group-hover:border-slate-200 grid grid-cols-3 gap-3 text-center transition-colors duration-500">
          <div className="p-3 rounded-2xl bg-white/10 group-hover:bg-slate-50 border border-transparent group-hover:border-slate-200/80 backdrop-blur-sm transition-colors duration-500">
            <div className="text-lg sm:text-xl font-black text-white group-hover:text-[#1D3189] transition-colors duration-500">
              50+
            </div>
            <div className="text-xs font-bold text-white/90 group-hover:text-slate-700 transition-colors duration-500">
              RSVP Trigger
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-white/10 group-hover:bg-slate-50 border border-transparent group-hover:border-slate-200/80 backdrop-blur-sm transition-colors duration-500">
            <div className="text-lg sm:text-xl font-black text-white group-hover:text-slate-950 transition-colors duration-500">
              1-on-1
            </div>
            <div className="text-xs font-bold text-white/90 group-hover:text-slate-700 transition-colors duration-500">
              Code Audits
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-white/10 group-hover:bg-slate-50 border border-transparent group-hover:border-slate-200/80 backdrop-blur-sm transition-colors duration-500">
            <div className="text-lg sm:text-xl font-black text-white group-hover:text-[#1D3189] transition-colors duration-500">
              15+
            </div>
            <div className="text-xs font-bold text-white/90 group-hover:text-slate-700 transition-colors duration-500">
              Hiring Partners
            </div>
          </div>
        </div>
      </div>

      {/* Right Bento Stack */}
      <div
        style={{
          transform: `translate3d(${rightOffset}px, 0, 0) scale(${scaleVal})`,
          opacity: opacityVal,
        }}
        className="lg:col-span-7 flex flex-col gap-5"
      >
        {/* Top Wide Card */}
        <Link
          href="/arena/career-checklist"
          className="group p-6 sm:p-7 rounded-3xl bg-slate-50 hover:bg-white border border-slate-200/90 hover:border-[#1D3189]/40 hover:shadow-lg transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center px-3.5 py-1 rounded-full bg-[#1D3189]/10 text-[#1D3189] text-xs font-extrabold uppercase tracking-wider">
              Wednesday &bull; 6:00 PM IST &bull; Career
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-950 tracking-tight group-hover:text-[#1D3189] transition-colors">
              Resume Teardown &amp; LinkedIn Profile Audit
            </h3>
            <p className="text-slate-700 text-sm sm:text-[15px] font-medium leading-relaxed">
              ATS optimization, GitHub proof-of-work pinned carousels, and direct HR cold-pitch templates reviewed live.
            </p>
          </div>
          <span className="w-10 h-10 rounded-full bg-white border border-slate-200 group-hover:bg-[#162774] group-hover:border-[#162774] text-slate-900 group-hover:text-white flex items-center justify-center shrink-0 transition-all duration-300">
            <ArrowRight size={16} className="transition-transform duration-300 group-hover:-rotate-45" />
          </span>
        </Link>

        {/* Bottom 2 Side-by-Side Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 flex-1">
          <Link
            href="/showcase"
            className="group overflow-hidden rounded-3xl bg-slate-50 hover:bg-white border border-slate-200/90 hover:border-[#1D3189]/40 hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
          >
            <div className="p-6 pb-4">
              <div className="inline-flex items-center px-3.5 py-1 rounded-full bg-[#1D3189]/10 text-[#1D3189] text-xs font-extrabold uppercase tracking-wider mb-3">
                Thursday &bull; 7:00 PM IST
              </div>
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-950 tracking-tight group-hover:text-[#1D3189] transition-colors mb-2">
                Showcase Thursdays
              </h3>
              <p className="text-slate-700 text-sm font-medium leading-relaxed">
                Demo live working systems to peers and invited engineering leads.
              </p>
            </div>
            <div className="relative overflow-hidden px-6 py-4 mt-2 border-t border-slate-200/70 group-hover:border-[#1D3189] flex items-center justify-between text-xs sm:text-sm font-extrabold text-[#1D3189] group-hover:text-white transition-colors duration-500">
              {/* Slow-Motion Sliding Indigo Fill Layer */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#1D3189] to-[#070E54] -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-out pointer-events-none" />
              <span className="relative z-10">Explore Showcases</span>
              <span className="relative z-10 w-8 h-8 rounded-full bg-white border border-slate-200 group-hover:bg-white group-hover:border-white text-[#162774] flex items-center justify-center transition-all duration-500">
                <ArrowRight size={14} className="transition-transform duration-500 group-hover:-rotate-45" />
              </span>
            </div>
          </Link>

          <Link
            href="/arena/daily-log"
            className="group overflow-hidden rounded-3xl bg-slate-50 hover:bg-white border border-slate-200/90 hover:border-[#1D3189]/40 hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
          >
            <div className="p-6 pb-4">
              <div className="inline-flex items-center px-3.5 py-1 rounded-full bg-[#1D3189]/10 text-[#1D3189] text-xs font-extrabold uppercase tracking-wider mb-3">
                Daily &bull; Proof of Work
              </div>
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-950 tracking-tight group-hover:text-[#1D3189] transition-colors mb-2">
                Daily Commits &amp; Karma
              </h3>
              <p className="text-slate-700 text-sm font-medium leading-relaxed">
                Log daily progress, clear technical bounties, and climb the builder leaderboard.
              </p>
            </div>
            <div className="relative overflow-hidden px-6 py-4 mt-2 border-t border-slate-200/70 group-hover:border-[#1D3189] flex items-center justify-between text-xs sm:text-sm font-extrabold text-[#1D3189] group-hover:text-white transition-colors duration-500">
              {/* Slow-Motion Sliding Indigo Fill Layer */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#1D3189] to-[#070E54] -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-out pointer-events-none" />
              <span className="relative z-10">Submit Daily Log</span>
              <span className="relative z-10 w-8 h-8 rounded-full bg-white border border-slate-200 group-hover:bg-white group-hover:border-white text-[#162774] flex items-center justify-center transition-all duration-500">
                <ArrowRight size={14} className="transition-transform duration-500 group-hover:-rotate-45" />
              </span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
