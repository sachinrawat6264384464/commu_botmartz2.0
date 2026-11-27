"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface GalleryShowcaseItem {
  id: string;
  num: string;
  category: "Training" | "Workshops" | "Hackathons" | "Jobs & Internships" | "Live Sessions";
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
    title: "Production AI & Systems Training",
    subtitle: "Hands-on cohort training on LangGraph, FastAPI, Docker, and real SLA engineering.",
    image: "/gallery/event-3.png",
    href: "/arena",
    ctaLabel: "Explore 59+ Systems",
    meta: "45-Day Structured Track",
  },
  {
    id: "workshops",
    num: "02",
    category: "Workshops",
    title: "Live Architecture Workshops",
    subtitle: "Weekend deep-dive labs covering Hybrid RAG, Vector Indexing, and Agentic Workflows.",
    image: "/gallery/event-6.png",
    href: "/workshops",
    ctaLabel: "View Workshops",
    meta: "Hands-On Code Labs",
  },
  {
    id: "hackathons",
    num: "03",
    category: "Hackathons",
    title: "24-Hour & 48-Hour Hackathons",
    subtitle: "Ship real production systems in solo or squad sprints for bounties and direct interviews.",
    image: "/gallery/event-11.png",
    href: "/hackathons",
    ctaLabel: "Join Hackathons",
    meta: "Solo & Team Sprints",
  },
  {
    id: "jobs-internships",
    num: "04",
    category: "Jobs & Internships",
    title: "Jobs & Virtual AI Internships",
    subtitle: "Convert daily GitHub proof-of-work and demo days into verified internship & job screening.",
    image: "/gallery/event-5.png",
    href: "/virtual-ai-internship",
    ctaLabel: "Apply for Internship",
    meta: "Direct Job Screening",
  },
  {
    id: "live-sessions",
    num: "05",
    category: "Live Sessions",
    title: "Live Sessions & Founder Clinics",
    subtitle: "Weekly Saturday office hours, live system teardowns, and architecture code reviews.",
    image: "/gallery/event-8.png",
    href: "/arena/calendar",
    ctaLabel: "See Live Schedule",
    meta: "Weekly Interactive",
  },
  {
    id: "summits",
    num: "06",
    category: "Live Sessions",
    title: "AI Frontier Summits & Demo Days",
    subtitle: "In-person & virtual community summits where builders showcase shipped products to founders.",
    image: "/gallery/event-1.png",
    href: "/gallery",
    ctaLabel: "Open Full Gallery",
    meta: "Community Showcase",
  },
];

const FILTERS = ["All", "Training", "Workshops", "Hackathons", "Jobs & Internships", "Live Sessions"] as const;

export default function HomeGalleryShowcase() {
  const [activeFilter, setActiveFilter] = useState<(typeof FILTERS)[number]>("All");

  const filteredItems =
    activeFilter === "All"
      ? GALLERY_ITEMS
      : GALLERY_ITEMS.filter((item) => item.category === activeFilter);

  return (
    <section className="py-16 sm:py-20 bg-[#F4F6FB] border-b border-slate-200/80 font-sans">
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
              Community in Action &bull; Real Sessions
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#162774] tracking-tight leading-tight">
              Inside Botmartz: Training, Workshops, Hackathons &amp; Hiring
            </h2>
            <p className="text-slate-600 text-sm sm:text-base font-medium mt-2 max-w-2xl">
              Glimpses from our live engineering training cohorts, hands-on workshops, 24-hour hackathons, and job-ready demo sessions.
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

        {/* Structured Gallery Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, idx) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35, delay: idx * 0.04, ease: "easeOut" }}
              >
                <Link
                  href={item.href}
                  className="group block h-full bg-white rounded-[26px] border border-slate-200 hover:border-[#162774] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
                >
                  {/* Image Container */}
                  <div className="relative h-56 sm:h-60 w-full overflow-hidden bg-[#162774]">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#162774]/85 via-[#162774]/20 to-transparent" />

                    {/* Top Badges */}
                    <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2">
                      <span className="px-3 py-1 rounded-full bg-[#D9F83B] text-[#162774] text-[11px] font-extrabold uppercase tracking-wider shadow-xs">
                        {item.category}
                      </span>
                      <span className="w-7 h-7 rounded-full bg-[#162774]/90 border border-white/25 text-[#D9F83B] text-[11px] font-extrabold flex items-center justify-center">
                        {item.num}
                      </span>
                    </div>

                    {/* Bottom Meta */}
                    <div className="absolute bottom-3.5 left-4 right-4">
                      <span className="inline-block text-xs font-bold text-white/95 tracking-wide">
                        {item.meta}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between gap-4">
                    <div>
                      <h3 className="text-lg sm:text-xl font-extrabold text-[#162774] tracking-tight group-hover:text-[#0d1952] transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-sm font-medium text-slate-600 mt-1.5 leading-relaxed">
                        {item.subtitle}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs sm:text-sm font-extrabold text-[#162774]">
                        {item.ctaLabel}
                      </span>
                      <span className="w-8 h-8 rounded-full bg-[#F4F6FB] group-hover:bg-[#162774] text-[#162774] group-hover:text-[#D9F83B] flex items-center justify-center transition-colors">
                        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:rotate-[60deg]" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
