"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface GalleryShowcaseItem {
  id: string;
  num: string;
  category: "Training" | "Workshops" | "Hackathons" | "Jobs & Internships" | "Live Sessions";
  mode: string;
  title: string;
  subtitle: string;
  image: string;
  href: string;
  ctaLabel: string;
  meta: string;
}

const GALLERY_ITEMS: GalleryShowcaseItem[] = [
  {
    id: "training",
    num: "01",
    category: "Training",
    mode: "Online",
    title: "Production AI & Systems Training",
    subtitle: "Hands-on online cohort training on LangGraph, FastAPI, Docker, and real SLA engineering.",
    image: "/gallery/event-3.png",
    href: "/arena",
    ctaLabel: "Explore 59+ Systems",
    meta: "Online • 45-Day Structured Track",
  },
  {
    id: "workshops",
    num: "02",
    category: "Workshops",
    mode: "Online",
    title: "Live Architecture Workshops",
    subtitle: "Weekend online deep-dive labs covering Hybrid RAG, Vector Indexing, and Agentic Workflows.",
    image: "/gallery/event-6.png",
    href: "/workshops",
    ctaLabel: "View Workshops",
    meta: "Online • Hands-On Code Labs",
  },
  {
    id: "hackathons",
    num: "03",
    category: "Hackathons",
    mode: "Online",
    title: "24-Hour & 48-Hour Hackathons",
    subtitle: "Ship real production systems in online solo or squad sprints for bounties and direct interviews.",
    image: "/gallery/event-11.png",
    href: "/hackathons",
    ctaLabel: "Join Hackathons",
    meta: "Online • Solo & Team Sprints",
  },
  {
    id: "jobs-internships",
    num: "04",
    category: "Jobs & Internships",
    mode: "Online",
    title: "Jobs & Virtual AI Internships",
    subtitle: "Convert daily GitHub proof-of-work and online demo days into verified internship & job screening.",
    image: "/gallery/online-internship.jpg",
    href: "/virtual-ai-internship",
    ctaLabel: "Apply for Internship",
    meta: "Online • Direct Job Screening",
  },
  {
    id: "live-sessions",
    num: "05",
    category: "Live Sessions",
    mode: "Online",
    title: "Live Sessions & Founder Clinics",
    subtitle: "Weekly online Saturday office hours, live system teardowns, and architecture code reviews.",
    image: "/gallery/online-live-session.jpg",
    href: "/arena/calendar",
    ctaLabel: "See Live Schedule",
    meta: "Online • Weekly Interactive",
  },
  {
    id: "summits",
    num: "06",
    category: "Live Sessions",
    mode: "Online",
    title: "AI Frontier Summits & Demo Days",
    subtitle: "Virtual & hybrid community summits where builders showcase shipped products live to founders.",
    image: "/gallery/online-demo-day.jpg",
    href: "/gallery",
    ctaLabel: "Open Full Gallery",
    meta: "Online • Community Showcase",
  },
];

const FILTERS = ["All", "Training", "Workshops", "Hackathons", "Jobs & Internships", "Live Sessions"] as const;

export default function HomeGalleryShowcase() {
  const [activeFilter, setActiveFilter] = useState<(typeof FILTERS)[number]>("All");
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
      const startTop = vh * 0.98;
      const endTop = vh * 0.48;
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

  const filteredItems =
    activeFilter === "All"
      ? GALLERY_ITEMS
      : GALLERY_ITEMS.filter((item) => item.category === activeFilter);

  const inv = 1 - progress;
  const blurPx = isDesktop && activeFilter === "All" ? inv * 6 : 0;
  const opacityVal = isDesktop && activeFilter === "All" ? 0.4 + progress * 0.6 : 1;

  const getSplitStyle = (idx: number): React.CSSProperties => {
    if (!isDesktop || activeFilter !== "All") return {};
    const col = idx % 3;
    const row = Math.floor(idx / 3);
    const xPct = col === 0 ? 102 * inv : col === 2 ? -102 * inv : 0;
    const yPx = row === 0 ? 28 * inv : -28 * inv;
    const scaleVal = col === 1 ? 0.93 + progress * 0.07 : 0.9 + progress * 0.1;

    return {
      transform: `translate3d(${xPct}%, ${yPx}px, 0) scale(${scaleVal})`,
      filter: blurPx > 0.1 ? `blur(${blurPx.toFixed(1)}px)` : "none",
      opacity: opacityVal,
      zIndex: col === 1 ? 30 : col === 0 ? 20 : 10,
    };
  };

  return (
    <section className="py-16 sm:py-20 bg-white border-b border-slate-200/80 font-sans overflow-hidden">
      <div className="w-full px-4 sm:px-8 lg:px-12 max-w-[1440px] mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8"
        >
          <div>
            <span className="inline-block px-4 py-1.5 rounded-full bg-white border border-slate-200 text-[#162774] text-xs font-extrabold uppercase tracking-wider mb-3 shadow-xs">
              Online Community &bull; Live Sessions
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#162774] tracking-tight leading-tight">
              Inside Botmartz: Online Training, Workshops, Hackathons &amp; Hiring
            </h2>
            <p className="text-slate-700 text-sm sm:text-base font-medium mt-2 max-w-2xl">
              Glimpses from our online engineering training cohorts, live workshops, 24-hour hackathons, and job-ready demo sessions.
            </p>
          </div>

          <Link
            href="/gallery"
            className="group pl-5 pr-2 py-2 rounded-full bg-[#162774] hover:bg-[#0d1952] text-white text-xs sm:text-sm font-extrabold transition-all shrink-0 inline-flex items-center gap-3 shadow-md self-start lg:self-auto"
          >
            <span>Explore Full Gallery</span>
            <span className="w-7 h-7 rounded-full bg-[#D9F83B] text-[#162774] inline-flex items-center justify-center shrink-0">
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-[60deg]" />
            </span>
          </Link>
        </motion.div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-8">
          {FILTERS.map((filter) => {
            const active = activeFilter === filter;
            return (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer border ${
                  active
                    ? "bg-[#162774] text-[#D9F83B] border-[#162774] shadow-sm"
                    : "bg-white text-[#162774] border-slate-200 hover:border-[#162774]"
                }`}
              >
                {filter}
              </button>
            );
          })}
        </div>

        {/* Structured Gallery Grid with Scroll-Split Assemble Transition */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, idx) => (
              <motion.div
                key={item.id}
                layout={activeFilter !== "All"}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                style={getSplitStyle(idx)}
                className="relative"
              >
                <Link
                  href={item.href}
                  className="group block h-full bg-white rounded-2xl border border-slate-200 hover:border-[#162774]/40 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col"
                >
                  {/* Clean Raw Image (Zero Overlay, Zero Badges, Zero Text) */}
                  <div className="relative h-52 sm:h-56 w-full overflow-hidden bg-slate-100">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  </div>

                  {/* Clean Card Body */}
                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between gap-5">
                    <div>
                      <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight group-hover:text-[#162774] transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-sm font-medium text-slate-600 mt-2 leading-relaxed">
                        {item.subtitle}
                      </p>
                    </div>

                    <div>
                      <span className="inline-block px-4 py-2 rounded-lg bg-[#162774] group-hover:bg-[#0d1952] text-white text-xs sm:text-sm font-bold transition-colors">
                        {item.ctaLabel}
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
