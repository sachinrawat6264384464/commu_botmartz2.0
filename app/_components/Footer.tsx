"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Calendar, ArrowRight } from "lucide-react";
import NewsletterForm from "@/components/NewsletterForm";

export default function CommunityFooter() {
  return (
    <footer
      className="w-full bg-[#070E54] text-slate-300 font-sans text-xs border-t border-white/10 relative overflow-hidden"
      style={{
        backgroundImage:
          "linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px)",
        backgroundSize: "72px 72px",
      }}
    >
      {/* Top Banner: Indore Hybrid Hub & Weekly Rituals */}
      <div className="border-b border-white/10 w-full relative z-10">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 py-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 text-white flex items-center justify-center shrink-0">
              <MapPin size={18} />
            </div>
            <div>
              <div className="font-semibold text-white text-sm font-sans flex flex-wrap items-center gap-2.5">
                <span>Indore AI Tech Lab</span>
                <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-slate-200 text-[11px] font-medium border border-white/15">
                  Every Saturday 5:00 PM IST &bull; 50+ RSVP
                </span>
              </div>
              <p className="text-xs text-slate-300/80 mt-1">
                In-person architecture teardowns in Indore when 50+ RSVP; otherwise livestreamed globally.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/arena/calendar"
              prefetch={false}
              className="group pl-4 pr-2.5 py-2 rounded-xl bg-[#D9F83B] hover:bg-[#e5ff59] text-slate-950 font-bold text-xs sm:text-sm transition-all flex items-center gap-3 shadow-lg shadow-lime-400/15"
            >
              <span className="inline-flex items-center gap-2">
                <Calendar size={14} />
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
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 py-12 sm:py-14 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Column 1: Brand Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-10 h-10 flex items-center justify-center shrink-0 rounded-xl bg-white/10 border border-white/15">
                <Image
                  src="/logo.png"
                  alt="Botmartz Logo"
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>
              <div>
                <div className="font-extrabold text-white text-base tracking-tight font-sans">BOTMARTZ</div>
                <div className="text-[10px] text-slate-300 font-semibold uppercase tracking-widest -mt-0.5">
                  Builders Community
                </div>
              </div>
            </Link>

            <p className="text-slate-300/85 text-[13px] font-sans leading-relaxed">
              <strong className="text-white font-semibold">Build. Ship. Learn. Connect.</strong> Strictly for authentic builders constructing frontier production architectures in AI and Systems.
            </p>

            <div className="pt-1 text-xs text-slate-300/80 space-y-1 font-sans">
              <div className="text-white font-semibold">Rolling 45-Day Internship</div>
              <div className="leading-relaxed">Start anytime — your personal 45-day milestone sprint begins on enrollment.</div>
            </div>

            <div className="pt-4 border-t border-white/10">
              <NewsletterForm variant="footer" />
            </div>
          </div>

          {/* Column 2: 45-Day Internship & System Catalog */}
          <div className="space-y-4">
            <h4 className="text-white font-bold uppercase text-[11px] tracking-widest font-sans">
              Virtual Internship
            </h4>
            <ul className="space-y-2.5 text-[13px] font-sans">
              <li>
                <Link href="/virtual-ai-internship" className="text-slate-300 hover:text-white transition-colors block">
                  45-Day Virtual AI Internship
                </Link>
              </li>
              <li>
                <Link href="/arena" className="text-slate-300 hover:text-white transition-colors block">
                  50-System PRD Catalog
                </Link>
              </li>
              <li>
                <Link href="/arena/daily-log" className="text-slate-300 hover:text-white transition-colors block">
                  Daily Standup &amp; Proof-of-Work
                </Link>
              </li>
              <li>
                <Link href="/product-tour" className="text-slate-300 hover:text-white transition-colors block">
                  Platform &amp; Product Tour
                </Link>
              </li>
              <li>
                <Link href="/arena/custom-project" className="text-slate-300 hover:text-white transition-colors block">
                  Propose Custom Blueprint
                </Link>
              </li>
              <li>
                <Link href="/arena/roadmaps" className="text-slate-300 hover:text-white transition-colors block">
                  Stage-by-Stage Roadmaps
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Career OS & Bounties */}
          <div className="space-y-4">
            <h4 className="text-white font-bold uppercase text-[11px] tracking-widest font-sans">
              Career OS &amp; Bounties
            </h4>
            <ul className="space-y-2.5 text-[13px] font-sans">
              <li>
                <Link href="/arena/wallet" className="text-slate-300 hover:text-white transition-colors block">
                  Student Karma Wallet
                </Link>
              </li>
              <li>
                <Link href="/arena/bounties" className="text-slate-300 hover:text-white transition-colors block">
                  Blocker Bounty Board
                </Link>
              </li>
              <li>
                <Link href="/arena/career-checklist" className="text-slate-300 hover:text-white transition-colors block">
                  Career &amp; LinkedIn Strategy
                </Link>
              </li>
              <li>
                <Link href="/arena/collaborate" className="text-slate-300 hover:text-white transition-colors block">
                  Squad Matchmaking
                </Link>
              </li>
              <li>
                <Link href="/showcase" className="text-slate-300 hover:text-white transition-colors block">
                  Proof-of-Work Showcases
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Community & Summits */}
          <div className="space-y-4">
            <h4 className="text-white font-bold uppercase text-[11px] tracking-widest font-sans">
              Community &amp; Summits
            </h4>
            <ul className="space-y-2.5 text-[13px] font-sans">
              <li>
                <Link href="/events" className="text-slate-300 hover:text-white transition-colors block">
                  AI Summits &amp; Conferences
                </Link>
              </li>
              <li>
                <Link href="/discussions" className="text-slate-300 hover:text-white transition-colors block">
                  Discussions &amp; Technical Q&amp;A
                </Link>
              </li>
              <li>
                <Link href="/workshops" className="text-slate-300 hover:text-white transition-colors block">
                  Hands-on Workshops
                </Link>
              </li>
              <li>
                <Link href="/magazine" className="text-slate-300 hover:text-white transition-colors block">
                  Developer Magazine
                </Link>
              </li>
              <li>
                <Link href="/certificates" className="text-slate-300 hover:text-white transition-colors block">
                  Verify Student Credentials
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Social Links Row */}
      <div className="border-t border-white/10 py-4 w-full relative z-10">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 flex flex-wrap items-center justify-between gap-4 text-xs font-sans">
          <div className="flex flex-wrap items-center gap-5 text-slate-300/80">
            <span className="text-white font-semibold">Connect Official:</span>
            <a
              href="https://www.linkedin.com/company/botmartz-ai-solutions"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              Botmartz LinkedIn
            </a>
            <a
              href="https://www.linkedin.com/in/soham-sharma/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              Soham Sharma (Founder)
            </a>
            <a
              href="https://x.com/botmartz"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              Official X
            </a>
            <a
              href="https://twitter.com/sohamsharma"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              Soham X
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 py-5 w-full relative z-10">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-300/70 text-xs font-sans">
          <div>
            <span>© 2026 Botmartz Community. Governed by Founder Soham Sharma.</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <span className="flex items-center gap-1.5 text-slate-200 font-medium">
              <span className="w-2 h-2 rounded-full bg-[#D9F83B] animate-pulse" />
              <span>Zero-Trust Security WAF Active</span>
            </span>
            <span className="text-white/20">•</span>
            <Link href="/refund-policy" className="text-slate-200 hover:text-white transition-colors font-medium">
              Refund Policy
            </Link>
            <span className="text-white/20">•</span>
            <Link href="/product-tour" className="hover:text-white transition-colors">
              Platform Tour
            </Link>
            <span className="text-white/20">•</span>
            <Link href="/login" className="hover:text-white transition-colors">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
