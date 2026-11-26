"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Calendar,
  ExternalLink
} from "lucide-react";
import NewsletterForm from "@/components/NewsletterForm";

export default function CommunityFooter() {
  return (
    <footer className="w-full bg-slate-950 text-slate-400 font-sans text-xs border-t border-slate-800">
      
      {/* Top Banner: Indore Hybrid Hub & Weekly Rituals */}
      <div className="border-b border-slate-800/80 bg-slate-900/50 w-full">
        <div className="w-full px-4 sm:px-8 lg:px-12 py-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center shrink-0">
              <MapPin size={20} />
            </div>
            <div>
              <div className="font-bold text-white text-sm font-sans flex items-center gap-2">
                <span>Indore AI Tech Lab</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] border border-emerald-500/30">
                  Every Saturday 5:00 PM IST (50+ RSVP Trigger)
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                In-person architecture teardowns in Indore when 50+ RSVP; otherwise livestreamed globally.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/arena/calendar"
              prefetch={false}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition-all border border-slate-700 flex items-center gap-1.5 shadow-2xs"
            >
              <Calendar size={13} className="text-amber-400" />
              <span>Indian Community Calendar</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main 4-Column Navigation */}
      <div className="w-full px-4 sm:px-8 lg:px-12 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Column 1: Brand Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-10 h-10 flex items-center justify-center shrink-0">
                <Image
                  src="/logo.png"
                  alt="Botmartz Logo"
                  width={38}
                  height={38}
                  className="object-contain"
                />
              </div>
              <div>
                <div className="font-bold text-white text-base tracking-tight font-sans">BOTMARTZ</div>
                <div className="text-[10px] text-[#0066FF] font-black uppercase -mt-1">BUILDERS COMMUNITY</div>
              </div>
            </Link>

            <p className="text-slate-400 text-xs font-sans leading-relaxed">
              <strong className="text-slate-200">Build. Ship. Learn. Connect.</strong> Strictly for authentic builders constructing frontier production architectures in AI, Systems, and Distributed Computing.
            </p>

            <div className="pt-2 text-[11px] text-slate-400 space-y-1 font-sans">
              <div className="text-[#0066FF] font-bold">⚡ Rolling 45-Day Internship</div>
              <div>Start anytime — your personal 45-day milestone sprint clock begins on enrollment.</div>
            </div>

            <div className="pt-4 border-t border-slate-800">
              <NewsletterForm variant="footer" />
            </div>
          </div>

          {/* Column 2: 45-Day Internship & System Catalog */}
          <div className="space-y-3">
            <h4 className="text-slate-200 font-bold uppercase text-[11px] tracking-wider font-sans">
              Virtual Internship
            </h4>
            <ul className="space-y-2.5 text-xs font-sans">
              <li>
                <Link href="/virtual-ai-internship" className="text-slate-300 hover:text-[#0066FF] transition-colors font-medium block">
                  45-Day Virtual AI Internship
                </Link>
              </li>
              <li>
                <Link href="/arena" className="text-slate-300 hover:text-[#0066FF] transition-colors block">
                  50-System PRD Catalog
                </Link>
              </li>
              <li>
                <Link href="/arena/daily-log" className="text-slate-300 hover:text-[#0066FF] transition-colors block">
                  Daily Standup &amp; Proof-of-Work
                </Link>
              </li>
              <li>
                <Link href="/product-tour" className="text-slate-300 hover:text-[#0066FF] transition-colors block">
                  Platform &amp; Product Tour
                </Link>
              </li>
              <li>
                <Link href="/arena/custom-project" className="text-slate-300 hover:text-[#0066FF] transition-colors block">
                  Propose Custom Blueprint
                </Link>
              </li>
              <li>
                <Link href="/arena/roadmaps" className="text-slate-300 hover:text-[#0066FF] transition-colors block">
                  Stage-by-Stage Roadmaps
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Career OS & Bounties */}
          <div className="space-y-3">
            <h4 className="text-slate-200 font-bold uppercase text-[11px] tracking-wider font-sans">
              Career OS &amp; Bounties
            </h4>
            <ul className="space-y-2.5 text-xs font-sans">
              <li>
                <Link href="/arena/wallet" className="text-slate-300 hover:text-[#0066FF] transition-colors block">
                  Student Karma Wallet
                </Link>
              </li>
              <li>
                <Link href="/arena/bounties" className="text-slate-300 hover:text-[#0066FF] transition-colors block">
                  Blocker Bounty Board
                </Link>
              </li>
              <li>
                <Link href="/arena/career-checklist" className="text-slate-300 hover:text-[#0066FF] transition-colors block">
                  Career &amp; LinkedIn Strategy
                </Link>
              </li>
              <li>
                <Link href="/arena/collaborate" className="text-slate-300 hover:text-[#0066FF] transition-colors block">
                  Squad Matchmaking
                </Link>
              </li>
              <li>
                <Link href="/showcase" className="text-slate-300 hover:text-[#0066FF] transition-colors block">
                  Proof-of-Work Showcases
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Community & Summits */}
          <div className="space-y-3">
            <h4 className="text-slate-200 font-bold uppercase text-[11px] tracking-wider font-sans">
              Community &amp; Summits
            </h4>
            <ul className="space-y-2.5 text-xs font-sans">
              <li>
                <Link href="/events" className="text-slate-300 hover:text-[#0066FF] transition-colors font-medium block">
                  AI Summits &amp; Conferences
                </Link>
              </li>
              <li>
                <Link href="/discussions" className="text-slate-300 hover:text-[#0066FF] transition-colors block">
                  Discussions &amp; Technical Q&amp;A
                </Link>
              </li>
              <li>
                <Link href="/workshops" className="text-slate-300 hover:text-[#0066FF] transition-colors block">
                  Hands-on Workshops
                </Link>
              </li>
              <li>
                <Link href="/magazine" className="text-slate-300 hover:text-[#0066FF] transition-colors block">
                  Developer Magazine
                </Link>
              </li>
              <li>
                <Link href="/certificates" className="text-slate-300 hover:text-[#0066FF] transition-colors block">
                  Verify Student Credentials
                </Link>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Social Links Row */}
      <div className="border-t border-slate-900 bg-slate-950/80 py-4 w-full">
        <div className="w-full px-4 sm:px-8 lg:px-12 flex flex-wrap items-center justify-between gap-4 text-xs font-sans">
          <div className="flex flex-wrap items-center gap-4 text-slate-400">
            <span className="text-slate-200 font-bold">Connect Official:</span>
            <a href="https://www.linkedin.com/company/botmartz-ai-solutions" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-[#0066FF] transition-colors">
              Botmartz LinkedIn
            </a>
            <a href="https://www.linkedin.com/in/soham-sharma/" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-[#0066FF] transition-colors">
              Soham Sharma (Founder)
            </a>
            <a href="https://x.com/botmartz" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-[#0066FF] transition-colors">
              Official X
            </a>
            <a href="https://twitter.com/sohamsharma" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-[#0066FF] transition-colors">
              Soham X
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-900 bg-slate-950 py-6 w-full">
        <div className="w-full px-4 sm:px-8 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px] font-sans">
          <div className="flex items-center gap-2">
            <span>© 2026 Botmartz Community. Governed by Founder Soham Sharma.</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Zero-Trust Security WAF Active</span>
            </span>
            <span>•</span>
            <Link href="/refund-policy" className="text-slate-300 hover:text-[#0066FF] transition-colors font-bold">
              Refund Policy
            </Link>
            <span>•</span>
            <Link href="/product-tour" className="text-slate-400 hover:text-slate-200 transition-colors">
              Platform Tour
            </Link>
            <span>•</span>
            <Link href="/login" className="text-slate-400 hover:text-slate-200 transition-colors">
              Sign In
            </Link>
          </div>
        </div>
      </div>

    </footer>
  );
}
