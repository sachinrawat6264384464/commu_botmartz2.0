"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Activity, ArrowRight } from "lucide-react";

interface ProjectPreview {
  id: string;
  difficulty: string;
  durationDays: number;
  title: string;
  overview: string;
  productionSla: string;
  techStack: string[];
}

export default function FeaturedSystemsGrid({
  projects,
  totalSystemsCount,
}: {
  projects: ProjectPreview[];
  totalSystemsCount: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [splitProgress, setSplitProgress] = useState(1);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isMiddleHovered, setIsMiddleHovered] = useState(false);

  useEffect(() => {
    const updateSplit = () => {
      const desktop = window.innerWidth >= 1024;
      setIsDesktop(desktop);
      if (!desktop || !containerRef.current) {
        setSplitProgress(1);
        return;
      }

      const rect = containerRef.current.getBoundingClientRect();
      const vh = window.innerHeight;
      // Starts stacked on the left as the grid enters bottom (0.98 * vh)
      // Completes full split cleanly by the time the section is comfortably visible (0.52 * vh)
      const startTop = vh * 0.98;
      const endTop = vh * 0.52;
      const raw = (startTop - rect.top) / (startTop - endTop);
      const clamped = Math.max(0, Math.min(1, raw));
      setSplitProgress(clamped);
    };

    updateSplit();
    window.addEventListener("scroll", updateSplit, { passive: true });
    window.addEventListener("resize", updateSplit, { passive: true });
    return () => {
      window.removeEventListener("scroll", updateSplit);
      window.removeEventListener("resize", updateSplit);
    };
  }, []);

  return (
    <div
      className={`w-full max-w-[1440px] mx-auto rounded-3xl p-6 sm:p-8 lg:p-10 border shadow-2xl overflow-hidden relative transition-colors duration-500 ${
        isMiddleHovered
          ? "bg-white text-slate-950 border-slate-200"
          : "bg-[#162774] text-white border-[#1D3189]/20"
      }`}
    >
      {/* Grid Overlay */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-500"
        style={{
          backgroundImage: isMiddleHovered
            ? "linear-gradient(to right, rgba(29, 49, 137, 0.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(29, 49, 137, 0.045) 1px, transparent 1px)"
            : "linear-gradient(to right, rgba(255, 255, 255, 0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.06) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />

      {/* Section Header */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h2
            className={`text-2xl sm:text-3xl font-extrabold tracking-tight font-sans transition-colors duration-300 ${
              isMiddleHovered ? "text-slate-950" : "text-white"
            }`}
          >
            Featured Internship Playground Systems
          </h2>
          <p
            className={`text-sm sm:text-base font-medium font-sans mt-1.5 transition-colors duration-300 ${
              isMiddleHovered ? "text-slate-600" : "text-white/85"
            }`}
          >
            Zero toy apps. Every project has strict test commands and SLA acceptance gates.
          </p>
        </div>

        <Link
          href="/arena"
          className={`px-6 py-2.5 rounded-full font-sans text-xs sm:text-sm font-extrabold transition-all shrink-0 flex items-center gap-2 shadow-lg ${
            isMiddleHovered
              ? "bg-[#1D3189] hover:bg-[#070E54] text-white shadow-[#1D3189]/20"
              : "bg-white hover:bg-slate-100 text-[#162774]"
          }`}
        >
          <span>View All {totalSystemsCount} Projects</span>
          <ArrowRight size={15} />
        </Link>
      </div>

      {/* 3 Cards Grid */}
      <div
        ref={containerRef}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 font-sans text-xs relative z-10"
      >
        {projects.slice(0, 3).map((p, idx) => {
          const offsetMultiplier = idx === 0 ? 0 : idx === 1 ? -104 : -208;
          const translatePercent = isDesktop ? offsetMultiplier * (1 - splitProgress) : 0;

          const activeSideByMiddle = isMiddleHovered && (idx === 0 || idx === 2);

          return (
            <div
              key={p.id}
              onMouseEnter={() => {
                if (idx === 1) setIsMiddleHovered(true);
              }}
              onMouseLeave={() => {
                if (idx === 1) setIsMiddleHovered(false);
              }}
              style={{
                transform: `translate3d(${translatePercent}%, 0, 0)`,
                zIndex: idx === 0 ? 30 : idx === 1 ? 20 : 10,
              }}
              className={`group relative overflow-hidden p-5 sm:p-6 rounded-2xl border flex flex-col justify-between shadow-xl transition-[border-color,box-shadow] duration-300 ${
                idx === 1 && isMiddleHovered
                  ? "bg-white text-slate-900 border-2 border-[#1D3189]"
                  : activeSideByMiddle
                  ? "border-white/70"
                  : "bg-white text-slate-900 border-white/20 hover:border-white"
              }`}
            >
              {/* Base White Background */}
              <div className="absolute inset-0 bg-white pointer-events-none z-0" />

              {/* Sliding Deep Indigo Layer (Right to Left) for Left & Right Cards Only */}
              {idx !== 1 && (
                <div
                  className={`absolute inset-0 bg-gradient-to-br from-[#1D3189] to-[#070E54] transition-transform duration-500 ease-out pointer-events-none z-[1] ${
                    activeSideByMiddle ? "translate-x-0" : "translate-x-full group-hover:translate-x-0"
                  }`}
                />
              )}

              <div className="relative z-10">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span
                    className={`px-3.5 py-1 rounded-full font-extrabold text-xs transition-colors duration-300 ${
                      idx === 1
                        ? "bg-[#1D3189]/10 text-[#1D3189]"
                        : activeSideByMiddle
                        ? "bg-white text-[#162774]"
                        : "bg-[#1D3189]/10 text-[#1D3189] group-hover:bg-white group-hover:text-[#162774]"
                    }`}
                  >
                    {p.difficulty}
                  </span>
                  <span
                    className={`text-xs font-bold transition-colors duration-300 ${
                      idx === 1
                        ? "text-slate-600"
                        : activeSideByMiddle
                        ? "text-white/85"
                        : "text-slate-600 group-hover:text-white/85"
                    }`}
                  >
                    {p.durationDays} Days Cohort
                  </span>
                </div>

                <h3
                  className={`text-lg sm:text-xl font-extrabold tracking-tight font-sans mb-2 transition-colors duration-300 ${
                    idx === 1
                      ? "text-slate-950"
                      : activeSideByMiddle
                      ? "text-white"
                      : "text-slate-950 group-hover:text-white"
                  }`}
                >
                  {p.title}
                </h3>
                <p
                  className={`text-sm font-medium font-sans line-clamp-2 mb-4 leading-relaxed transition-colors duration-300 ${
                    idx === 1
                      ? "text-slate-700"
                      : activeSideByMiddle
                      ? "text-white/90"
                      : "text-slate-700 group-hover:text-white/90"
                  }`}
                >
                  {p.overview}
                </p>

                <div
                  className={`p-3.5 rounded-xl border text-xs sm:text-sm font-medium mb-4 transition-colors duration-300 ${
                    idx === 1
                      ? "bg-slate-50 border-slate-200/80 text-slate-700"
                      : activeSideByMiddle
                      ? "bg-white/10 border-white/15 text-white/95"
                      : "bg-slate-50 border-slate-200/80 text-slate-700 group-hover:bg-white/10 group-hover:border-white/15 group-hover:text-white/95"
                  }`}
                >
                  <span
                    className={`font-extrabold transition-colors duration-300 ${
                      idx === 1
                        ? "text-[#1D3189]"
                        : activeSideByMiddle
                        ? "text-white"
                        : "text-[#1D3189] group-hover:text-white"
                    }`}
                  >
                    Strict SLA:
                  </span>{" "}
                  {p.productionSla}
                </div>
              </div>

              <div
                className={`relative z-10 pt-3.5 border-t flex items-center justify-between transition-colors duration-300 ${
                  idx === 1
                    ? "border-slate-100"
                    : activeSideByMiddle
                    ? "border-white/15"
                    : "border-slate-100 group-hover:border-white/15"
                }`}
              >
                <div className="flex flex-wrap gap-1.5">
                  {p.techStack.slice(0, 2).map((t, ti) => (
                    <span
                      key={ti}
                      className={`text-xs px-2.5 py-1 rounded-md font-bold transition-colors duration-300 ${
                        idx === 1
                          ? "text-slate-800 bg-slate-100"
                          : activeSideByMiddle
                          ? "text-white bg-white/15"
                          : "text-slate-800 bg-slate-100 group-hover:text-white group-hover:bg-white/15"
                      }`}
                    >
                      #{t}
                    </span>
                  ))}
                </div>

                <Link
                  href={`/arena/${p.id}`}
                  className={`px-4 py-2 rounded-full font-extrabold text-xs sm:text-sm flex items-center gap-1.5 transition-all duration-300 ${
                    idx === 1
                      ? "bg-[#1D3189] text-white group-hover:bg-slate-950"
                      : activeSideByMiddle
                      ? "bg-white text-[#162774]"
                      : "bg-[#1D3189] text-white group-hover:bg-white group-hover:text-[#162774]"
                  }`}
                >
                  <span>View Spec</span>
                  <ArrowRight
                    size={13}
                    className={`transition-transform duration-300 ${
                      activeSideByMiddle ? "-rotate-45" : "group-hover:-rotate-45"
                    }`}
                  />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
