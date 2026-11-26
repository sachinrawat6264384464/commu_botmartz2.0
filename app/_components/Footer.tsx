"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Calendar, ArrowRight } from "lucide-react";
import NewsletterForm from "@/components/NewsletterForm";

export default function CommunityFooter() {
  return (
    <footer
      className="w-full bg-[#070E54] text-blue-100/80 font-sans text-xs border-t border-white/10 relative overflow-hidden"
      style={{
        backgroundImage:
          "linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px)",
        backgroundSize: "72px 72px",
      }}
    >
      {/* Top Banner: Indore Hybrid Hub & Weekly Rituals */}
      <div className="border-b border-white/10 bg-[#1D3189]/40 backdrop-blur-md w-full relative z-10">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 py-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#D9F83B] text-slate-950 flex items-center justify-center shrink-0 shadow-md">
              <MapPin size={20} />
            </div>
            <div>
              <div className="font-bold text-white text-sm font-sans flex flex-wrap items-center gap-2">
                <span>Indore AI Tech Lab</span>
                <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-[#D9F83B] text-[10px] font-bold border border-white/15">
                  Every Saturday 5:00 PM IST (50+ RSVP Trigger)
                </span>
              </div>
              <p className="text-xs text-blue-100/75 mt-0.5">
                In-person architecture teardowns in Indore when 50+ RSVP; otherwise livestreamed globally.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/arena/calendar"
              prefetch={false}
              className="group px-5 py-2.5 rounded-xl bg-[#D9F83B] hover:bg-[#e5ff59] text-slate-950 font-bold transition-all flex items-center gap-2 shadow-lg shadow-lime-400/15"
            >
              <Calendar size={14} />
              <span>Indian Community Calendar</span>
              <ArrowRight size={13} className="transition-transform duration-300 group-hover:-rotate-45" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main 4-Column Navigation */}
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 py-14 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {/* Column 1: Brand Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-10 h-10 flex items-center justify-center shrink-0 rounded-xl bg-white/10 border border-white/15">
                <Image
                  src="/logo.png"
                  alt="Botmartz Logo"
                  width={34}
                  height={34}
                  className="object-contain"
                />
              </div>
              <div>
                <div className="font-black text-white text-base tracking-tight font-sans">BOTMARTZ</div>
                <div className="text-[10px] text-[#D9F83B] font-extrabold uppercase -mt-0.5 tracking-wider">
                  BUILDERS COMMUNITY
                </div>
              </div>
            </Link>

            <p className="text-blue-100/75 text-xs font-sans leading-relaxed">
              <strong className="text-white">Build. Ship. Learn. Connect.</strong> Strictly for authentic builders constructing frontier production architectures in AI, Systems, and Distributed Computing.
            </p>

            <div className="pt-2 text-xs text-blue-100/75 space-y-1 font-sans">
              <div className="text-[#D9F83B] font-bold">⚡ Rolling 45-Day Internship</div>
              <div>Start anytime — your personal 45-day milestone sprint clock begins on enrollment.</div>
            </div>

            <div className="pt-4 border-t border-white/10">
              <NewsletterForm variant="footer" />
            </div>
          </div>

          {/* Column 2: 45-Day Internship & System Catalog */}
          <div className="space-y-3.5">
            <h4 className="text-white font-bold uppercase text-[11px] tracking-wider font-sans">
              Virtual Internship
            </h4>
            <ul className="space-y-2.5 text-xs font-sans">
              <li>
                <Link href="/virtual-ai-internship" className="text-blue-100/80 hover:text-[#D9F83B] transition-colors font-medium block">
                  45-Day Virtual AI Internship
                </Link>
              </li>
              <li>
                <Link href="/arena" className="text-blue-100/80 hover:text-[#D9F83B] transition-colors block">
                  50-System PRD Catalog
                </Link>
              </li>
              <li>
                <Link href="/arena/daily-log" className="text-blue-100/80 hover:text-[#D9F83B] transition-colors block">
                  Daily Standup &amp; Proof-of-Work
                </Link>
              </li>
              <li>
                <Link href="/product-tour" className="text-blue-100/80 hover:text-[#D9F83B] transition-colors block">
                  Platform &amp; Product Tour
                </Link>
              </li>
              <li>
                <Link href="/arena/custom-project" className="text-blue-100/80 hover:text-[#D9F83B] transition-colors block">
                  Propose Custom Blueprint
                </Link>
              </li>
              <li>
                <Link href="/arena/roadmaps" className="text-blue-100/80 hover:text-[#D9F83B] transition-colors block">
                  Stage-by-Stage Roadmaps
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Career OS & Bounties */}
          <div className="space-y-3.5">
            <h4 className="text-white font-bold uppercase text-[11px] tracking-wider font-sans">
              Career OS &amp; Bounties
            </h4>
            <ul className="space-y-2.5 text-xs font-sans">
              <li>
                <Link href="/arena/wallet" className="text-blue-100/80 hover:text-[#D9F83B] transition-colors block">
                  Student Karma Wallet
                </Link>
              </li>
              <li>
                <Link href="/arena/bounties" className="text-blue-100/80 hover:text-[#D9F83B] transition-colors block">
                  Blocker Bounty Board
                </Link>
              </li>
              <li>
                <Link href="/arena/career-checklist" className="text-blue-100/80 hover:text-[#D9F83B] transition-colors block">
                  Career &amp; LinkedIn Strategy
                </Link>
              </li>
              <li>
                <Link href="/arena/collaborate" className="text-blue-100/80 hover:text-[#D9F83B] transition-colors block">
                  Squad Matchmaking
                </Link>
              </li>
              <li>
                <Link href="/showcase" className="text-blue-100/80 hover:text-[#D9F83B] transition-colors block">
                  Proof-of-Work Showcases
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Community & Summits */}
          <div className="space-y-3.5">
            <h4 className="text-white font-bold uppercase text-[11px] tracking-wider font-sans">
              Community &amp; Summits
            </h4>
            <ul className="space-y-2.5 text-xs font-sans">
              <li>
                <Link href="/events" className="text-blue-100/80 hover:text-[#D9F83B] transition-colors font-medium block">
                  AI Summits &amp; Conferences
                </Link>
              </li>
              <li>
                <Link href="/discussions" className="text-blue-100/80 hover:text-[#D9F83B] transition-colors block">
                  Discussions &amp; Technical Q&amp;A
                </Link>
              </li>
              <li>
                <Link href="/workshops" className="text-blue-100/80 hover:text-[#D9F83B] transition-colors block">
                  Hands-on Workshops
                </Link>
              </li>
              <li>
                <Link href="/magazine" className="text-blue-100/80 hover:text-[#D9F83B] transition-colors block">
                  Developer Magazine
                </Link>
              </li>
              <li>
                <Link href="/certificates" className="text-blue-100/80 hover:text-[#D9F83B] transition-colors block">
                  Verify Student Credentials
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Social Links Row */}
      <div className="border-t border-white/10 bg-[#050A40]/70 py-4 w-full relative z-10">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 flex flex-wrap items-center justify-between gap-4 text-xs font-sans">
          <div className="flex flex-wrap items-center gap-4 text-blue-200/75">
            <span className="text-white font-bold">Connect Official:</span>
            <a
              href="https://www.linkedin.com/company/botmartz-ai-solutions"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-100/85 hover:text-[#D9F83B] transition-colors"
            >
              Botmartz LinkedIn
            </a>
            <a
              href="https://www.linkedin.com/in/soham-sharma/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-100/85 hover:text-[#D9F83B] transition-colors"
            >
              Soham Sharma (Founder)
            </a>
            <a
              href="https://x.com/botmartz"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-100/85 hover:text-[#D9F83B] transition-colors"
            >
              Official X
            </a>
            <a
              href="https://twitter.com/sohamsharma"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-100/85 hover:text-[#D9F83B] transition-colors"
            >
              Soham X
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 bg-[#040836] py-5 w-full relative z-10">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-blue-200/65 text-[11px] font-sans">
          <div className="flex items-center gap-2">
            <span>© 2026 Botmartz Community. Governed by Founder Soham Sharma.</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <span className="flex items-center gap-1.5 text-[#D9F83B] font-bold">
              <span className="w-2 h-2 rounded-full bg-[#D9F83B] animate-pulse" />
              <span>Zero-Trust Security WAF Active</span>
            </span>
            <span>•</span>
            <Link href="/refund-policy" className="text-blue-100/85 hover:text-[#D9F83B] transition-colors font-bold">
              Refund Policy
            </Link>
            <span>•</span>
            <Link href="/product-tour" className="text-blue-200/75 hover:text-white transition-colors">
              Platform Tour
            </Link>
            <span>•</span>
            <Link href="/login" className="text-blue-200/75 hover:text-white transition-colors">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
