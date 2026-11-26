"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface ProjectPreview {
  id: string;
  difficulty: string;
  durationDays: number;
  title: string;
  overview: string;
  productionSla: string;
  techStack: string[];
}

export default function FeaturedSystemsGrid({ projects }: { projects: ProjectPreview[] }) {
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
      // Starts stacked on the left as section enters bottom (0.95 * vh)
      // Finishes splitting into place when section reaches center (~0.32 * vh)
      const startTop = vh * 0.95;
      const endTop = vh * 0.32;
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
      ref={containerRef}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 font-sans text-xs relative"
    >
      {projects.slice(0, 3).map((p, idx) => {
        // Scroll-driven split from on top of the left card (idx === 0)
        // idx 1 starts at -104% (over idx 0), idx 2 starts at -208% (over idx 0)
        const offsetMultiplier = idx === 0 ? 0 : idx === 1 ? -104 : -208;
        const translatePercent = isDesktop ? offsetMultiplier * (1 - splitProgress) : 0;

        // When middle card is hovered:
        // - Left card (idx === 0) turns vibrant lime (#D9F83B)
        // - Right card (idx === 2) turns deep indigo (#070E54)
        const activeLimeByMiddle = isMiddleHovered && idx === 0;
        const activeIndigoByMiddle = isMiddleHovered && idx === 2;

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
              activeLimeByMiddle
                ? "border-[#D9F83B]"
                : activeIndigoByMiddle
                ? "border-[#D9F83B]/70"
                : "bg-white text-slate-900 border-white/20 hover:border-[#D9F83B]"
            }`}
          >
            {/* Base White Background */}
            <div className="absolute inset-0 bg-white pointer-events-none z-0" />

            {/* Sliding Color Layer (Right to Left) */}
            {idx === 0 && (
              <div
                className={`absolute inset-0 bg-[#D9F83B] transition-transform duration-500 ease-out pointer-events-none z-[1] ${
                  activeLimeByMiddle ? "translate-x-0" : "translate-x-full group-hover:translate-x-0"
                }`}
              />
            )}
            {idx === 1 && (
              <div className="absolute inset-0 bg-gradient-to-br from-[#1D3189] to-[#070E54] translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out pointer-events-none z-[1]" />
            )}
            {idx === 2 && (
              <div
                className={`absolute inset-0 bg-gradient-to-br from-[#1D3189] to-[#070E54] transition-transform duration-500 ease-out pointer-events-none z-[1] ${
                  activeIndigoByMiddle ? "translate-x-0" : "translate-x-full group-hover:translate-x-0"
                }`}
              />
            )}

            <div className="relative z-10">
              <div className="flex items-center justify-between gap-2 mb-3">
                <span
                  className={`px-3 py-0.5 rounded-full font-bold text-[11px] transition-colors duration-300 ${
                    idx === 0
                      ? activeLimeByMiddle
                        ? "bg-slate-950 text-[#D9F83B]"
                        : "bg-[#1D3189]/10 text-[#1D3189] group-hover:bg-slate-950 group-hover:text-[#D9F83B]"
                      : activeIndigoByMiddle
                      ? "bg-[#D9F83B] text-slate-950"
                      : "bg-[#1D3189]/10 text-[#1D3189] group-hover:bg-[#D9F83B] group-hover:text-slate-950"
                  }`}
                >
                  {p.difficulty}
                </span>
                <span
                  className={`text-xs font-medium transition-colors duration-300 ${
                    idx === 0
                      ? activeLimeByMiddle
                        ? "text-slate-800"
                        : "text-slate-500 group-hover:text-slate-800"
                      : activeIndigoByMiddle
                      ? "text-blue-200"
                      : "text-slate-500 group-hover:text-blue-200"
                  }`}
                >
                  {p.durationDays} Days Cohort
                </span>
              </div>

              <h3
                className={`text-base sm:text-lg font-bold font-sans mb-1.5 transition-colors duration-300 ${
                  idx === 0
                    ? "text-slate-950"
                    : activeIndigoByMiddle
                    ? "text-white"
                    : "text-slate-950 group-hover:text-white"
                }`}
              >
                {p.title}
              </h3>
              <p
                className={`text-xs sm:text-sm font-sans line-clamp-2 mb-4 leading-relaxed transition-colors duration-300 ${
                  idx === 0
                    ? activeLimeByMiddle
                      ? "text-slate-800"
                      : "text-slate-600 group-hover:text-slate-800"
                    : activeIndigoByMiddle
                    ? "text-blue-100/85"
                    : "text-slate-600 group-hover:text-blue-100/85"
                }`}
              >
                {p.overview}
              </p>

              <div
                className={`p-3 rounded-xl border text-xs mb-4 transition-colors duration-300 ${
                  idx === 0
                    ? activeLimeByMiddle
                      ? "bg-black/5 border-black/10 text-slate-900"
                      : "bg-slate-50 border-slate-200/80 text-slate-700 group-hover:bg-black/5 group-hover:border-black/10 group-hover:text-slate-900"
                    : activeIndigoByMiddle
                    ? "bg-white/10 border-white/15 text-blue-100"
                    : "bg-slate-50 border-slate-200/80 text-slate-700 group-hover:bg-white/10 group-hover:border-white/15 group-hover:text-blue-100"
                }`}
              >
                <span
                  className={`font-bold transition-colors duration-300 ${
                    idx === 0
                      ? activeLimeByMiddle
                        ? "text-slate-950"
                        : "text-[#1D3189] group-hover:text-slate-950"
                      : activeIndigoByMiddle
                      ? "text-[#D9F83B]"
                      : "text-[#1D3189] group-hover:text-[#D9F83B]"
                  }`}
                >
                  Strict SLA:
                </span>{" "}
                {p.productionSla}
              </div>
            </div>

            <div
              className={`relative z-10 pt-3.5 border-t flex items-center justify-between transition-colors duration-300 ${
                idx === 0
                  ? activeLimeByMiddle
                    ? "border-black/10"
                    : "border-slate-100 group-hover:border-black/10"
                  : activeIndigoByMiddle
                  ? "border-white/15"
                  : "border-slate-100 group-hover:border-white/15"
              }`}
            >
              <div className="flex flex-wrap gap-1.5">
                {p.techStack.slice(0, 2).map((t, ti) => (
                  <span
                    key={ti}
                    className={`text-[11px] px-2.5 py-1 rounded-md font-medium transition-colors duration-300 ${
                      idx === 0
                        ? activeLimeByMiddle
                          ? "text-slate-900 bg-black/10"
                          : "text-slate-700 bg-slate-100 group-hover:text-slate-900 group-hover:bg-black/10"
                        : activeIndigoByMiddle
                        ? "text-blue-100 bg-white/10"
                        : "text-slate-700 bg-slate-100 group-hover:text-blue-100 group-hover:bg-white/10"
                    }`}
                  >
                    #{t}
                  </span>
                ))}
              </div>

              <Link
                href={`/arena/${p.id}`}
                className={`px-4 py-2 rounded-full font-bold text-xs flex items-center gap-1.5 transition-all duration-300 ${
                  idx === 0
                    ? activeLimeByMiddle
                      ? "bg-slate-950 text-[#D9F83B]"
                      : "bg-[#1D3189] text-white group-hover:bg-slate-950 group-hover:text-[#D9F83B]"
                    : activeIndigoByMiddle
                    ? "bg-[#D9F83B] text-slate-950"
                    : "bg-[#1D3189] text-white group-hover:bg-[#D9F83B] group-hover:text-slate-950"
                }`}
              >
                <span>View Spec</span>
                <ArrowRight
                  size={13}
                  className={`transition-transform duration-300 ${
                    activeLimeByMiddle || activeIndigoByMiddle
                      ? "-rotate-45"
                      : "group-hover:-rotate-45"
                  }`}
                />
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
