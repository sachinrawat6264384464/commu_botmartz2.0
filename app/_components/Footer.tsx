"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Calendar, ArrowRight } from "lucide-react";
import NewsletterForm from "@/components/NewsletterForm";

const FOOTER_LINK_CLASS =
  "group inline-flex items-center gap-2 text-sm font-medium text-blue-100/80 hover:text-[#D9F83B] hover:translate-x-1.5 transition-all duration-200 cursor-pointer";

export default function CommunityFooter() {
  return (
    <footer
      className="w-full bg-[#070E54] text-blue-100/85 font-sans border-t border-white/10 relative overflow-hidden"
      style={{
        backgroundImage:
          "linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px)",
        backgroundSize: "72px 72px",
      }}
    >
      {/* Top Banner: Indore Hybrid Hub & Weekly Rituals */}
      <div className="border-b border-white/10 bg-[#1D3189]/30 w-full relative z-10">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 py-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/15 text-[#D9F83B] flex items-center justify-center shrink-0">
              <MapPin size={20} />
            </div>
            <div>
              <div className="font-bold text-white text-base font-sans flex flex-wrap items-center gap-2.5">
                <span>Indore AI Tech Lab</span>
                <span className="px-3 py-0.5 rounded-full bg-white/10 text-blue-100 text-xs font-medium border border-white/15">
                  Every Saturday 5:00 PM IST &bull; 50+ RSVP
                </span>
              </div>
              <p className="text-xs sm:text-sm text-blue-100/75 mt-1">
                In-person architecture teardowns in Indore when 50+ RSVP; otherwise livestreamed globally.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/arena/calendar"
              prefetch={false}
              className="group pl-5 pr-2.5 py-2.5 rounded-xl bg-[#D9F83B] hover:bg-[#e5ff59] text-slate-950 font-bold text-sm transition-all flex items-center gap-3 shadow-lg shadow-lime-400/15 cursor-pointer"
            >
              <span className="inline-flex items-center gap-2">
                <Calendar size={15} />
                <span>Indian Community Calendar</span>
              </span>
              <span className="w-7 h-7 rounded-full bg-slate-950 text-[#D9F83B] inline-flex items-center justify-center shrink-0">
                <ArrowRight size={14} className="transition-transform duration-300 group-hover:-rotate-45" />
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main 4-Column Navigation */}
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 py-12 sm:py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Column 1: Brand Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3 group w-fit">
              <div className="relative w-11 h-11 flex items-center justify-center shrink-0 rounded-xl bg-white/10 border border-white/15 group-hover:border-[#D9F83B] transition-colors">
                <Image
                  src="/logo.png"
                  alt="Botmartz Logo"
                  width={34}
                  height={34}
                  className="object-contain"
                />
              </div>
              <div>
                <div className="font-extrabold text-white text-lg tracking-tight font-sans">BOTMARTZ</div>
                <div className="text-[11px] text-blue-200/80 font-semibold uppercase tracking-widest -mt-0.5">
                  Builders Community
                </div>
              </div>
            </Link>

            <p className="text-blue-100/80 text-sm font-sans leading-relaxed">
              <strong className="text-white font-semibold">Build. Ship. Learn. Connect.</strong> Strictly for authentic builders constructing frontier production architectures in AI and Systems.
            </p>

            <div className="rounded-xl bg-white/[0.04] border border-white/10 p-3.5 text-xs sm:text-[13px] text-blue-100/85 space-y-1 font-sans">
              <div className="text-[#D9F83B] font-bold">Flexible 3-Week &amp; 4-Week Sprints</div>
              <div className="leading-relaxed text-blue-100/75 text-xs">
                Sprint duration depends on your chosen project (3-week or 4-week tracks) — start anytime and ship real production systems.
              </div>
            </div>

            <div className="pt-3 border-t border-white/10">
              <NewsletterForm variant="footer" />
            </div>
          </div>

          {/* Column 2: Virtual Internship & System Catalog */}
          <div className="space-y-4 rounded-2xl bg-white/[0.03] border border-white/10 p-6 hover:border-white/20 transition-colors">
            <h4 className="text-white font-bold uppercase text-xs tracking-widest font-sans flex items-center gap-2 pb-3 border-b border-white/10">
              <span className="w-2 h-2 rounded-full bg-[#D9F83B]" />
              <span>Virtual Internship</span>
            </h4>
            <ul className="space-y-3 font-sans">
              <li>
                <Link href="/virtual-ai-internship" className={FOOTER_LINK_CLASS}>
                  <span>Virtual AI Internship</span>
                  <ArrowRight size={13} className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                </Link>
              </li>
              <li>
                <Link href="/arena" className={FOOTER_LINK_CLASS}>
                  <span>59+ System PRD Catalog</span>
                  <ArrowRight size={13} className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                </Link>
              </li>
              <li>
                <Link href="/arena/daily-log" className={FOOTER_LINK_CLASS}>
                  <span>Daily Standup &amp; Proof-of-Work</span>
                  <ArrowRight size={13} className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                </Link>
              </li>
              <li>
                <Link href="/product-tour" className={FOOTER_LINK_CLASS}>
                  <span>Platform &amp; Product Tour</span>
                  <ArrowRight size={13} className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                </Link>
              </li>
              <li>
                <Link href="/arena/custom-project" className={FOOTER_LINK_CLASS}>
                  <span>Propose Custom Blueprint</span>
                  <ArrowRight size={13} className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                </Link>
              </li>
              <li>
                <Link href="/arena/roadmaps" className={FOOTER_LINK_CLASS}>
                  <span>Stage-by-Stage Roadmaps</span>
                  <ArrowRight size={13} className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Career OS & Bounties */}
          <div className="space-y-4 rounded-2xl bg-white/[0.03] border border-white/10 p-6 hover:border-white/20 transition-colors">
            <h4 className="text-white font-bold uppercase text-xs tracking-widest font-sans flex items-center gap-2 pb-3 border-b border-white/10">
              <span className="w-2 h-2 rounded-full bg-[#D9F83B]" />
              <span>Career OS &amp; Bounties</span>
            </h4>
            <ul className="space-y-3 font-sans">
              <li>
                <Link href="/arena/wallet" className={FOOTER_LINK_CLASS}>
                  <span>Student Karma Wallet</span>
                  <ArrowRight size={13} className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                </Link>
              </li>
              <li>
                <Link href="/arena/bounties" className={FOOTER_LINK_CLASS}>
                  <span>Blocker Bounty Board</span>
                  <ArrowRight size={13} className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                </Link>
              </li>
              <li>
                <Link href="/arena/career-checklist" className={FOOTER_LINK_CLASS}>
                  <span>Career &amp; LinkedIn Strategy</span>
                  <ArrowRight size={13} className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                </Link>
              </li>
              <li>
                <Link href="/arena/collaborate" className={FOOTER_LINK_CLASS}>
                  <span>Squad Matchmaking</span>
                  <ArrowRight size={13} className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                </Link>
              </li>
              <li>
                <Link href="/showcase" className={FOOTER_LINK_CLASS}>
                  <span>Proof-of-Work Showcases</span>
                  <ArrowRight size={13} className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Community & Summits */}
          <div className="space-y-4 rounded-2xl bg-white/[0.03] border border-white/10 p-6 hover:border-white/20 transition-colors">
            <h4 className="text-white font-bold uppercase text-xs tracking-widest font-sans flex items-center gap-2 pb-3 border-b border-white/10">
              <span className="w-2 h-2 rounded-full bg-[#D9F83B]" />
              <span>Community &amp; Summits</span>
            </h4>
            <ul className="space-y-3 font-sans">
              <li>
                <Link href="/events" className={FOOTER_LINK_CLASS}>
                  <span>AI Summits &amp; Conferences</span>
                  <ArrowRight size={13} className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                </Link>
              </li>
              <li>
                <Link href="/discussions" className={FOOTER_LINK_CLASS}>
                  <span>Discussions &amp; Technical Q&amp;A</span>
                  <ArrowRight size={13} className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                </Link>
              </li>
              <li>
                <Link href="/workshops" className={FOOTER_LINK_CLASS}>
                  <span>Hands-on Workshops</span>
                  <ArrowRight size={13} className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                </Link>
              </li>
              <li>
                <Link href="/magazine" className={FOOTER_LINK_CLASS}>
                  <span>Developer Magazine</span>
                  <ArrowRight size={13} className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                </Link>
              </li>
              <li>
                <Link href="/certificates" className={FOOTER_LINK_CLASS}>
                  <span>Verify Student Credentials</span>
                  <ArrowRight size={13} className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Social Links Row */}
      <div className="border-t border-white/10 py-4 w-full relative z-10">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm font-sans">
          <div className="flex flex-wrap items-center gap-3 text-blue-100/80">
            <span className="text-white font-semibold mr-1">Connect Official:</span>
            <a
              href="https://www.linkedin.com/company/botmartz-ai-solutions"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-[#D9F83B] text-blue-100 hover:text-slate-950 border border-white/10 hover:border-[#D9F83B] transition-all duration-200 font-medium text-xs cursor-pointer"
            >
              Botmartz LinkedIn
            </a>
            <a
              href="https://www.linkedin.com/in/soham-sharma/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-[#D9F83B] text-blue-100 hover:text-slate-950 border border-white/10 hover:border-[#D9F83B] transition-all duration-200 font-medium text-xs cursor-pointer"
            >
              Soham Sharma (Founder)
            </a>
            <a
              href="https://x.com/botmartz"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-[#D9F83B] text-blue-100 hover:text-slate-950 border border-white/10 hover:border-[#D9F83B] transition-all duration-200 font-medium text-xs cursor-pointer"
            >
              Official X
            </a>
            <a
              href="https://twitter.com/sohamsharma"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-[#D9F83B] text-blue-100 hover:text-slate-950 border border-white/10 hover:border-[#D9F83B] transition-all duration-200 font-medium text-xs cursor-pointer"
            >
              Soham X
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 py-5 w-full relative z-10">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-blue-100/75 text-xs font-sans">
          <div>
            <span>© 2026 Botmartz Community. Governed by Founder Soham Sharma.</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <span className="flex items-center gap-1.5 text-white font-medium">
              <span className="w-2 h-2 rounded-full bg-[#D9F83B] animate-pulse" />
              <span>Zero-Trust Security WAF Active</span>
            </span>
            <span className="text-white/20">•</span>
            <Link href="/refund-policy" className="text-blue-100 hover:text-[#D9F83B] transition-colors font-medium cursor-pointer">
              Refund Policy
            </Link>
            <span className="text-white/20">•</span>
            <Link href="/product-tour" className="hover:text-[#D9F83B] transition-colors cursor-pointer">
              Platform Tour
            </Link>
            <span className="text-white/20">•</span>
            <Link href="/login" className="hover:text-[#D9F83B] transition-colors cursor-pointer">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
