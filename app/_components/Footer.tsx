"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck,
  Compass,
  Globe,
  Briefcase,
  Coins,
  Users,
  MapPin,
  Calendar,
  Lock,
  ExternalLink,
  Activity,
  Award,
  Terminal,
  Sparkles
} from "lucide-react";

export default function CommunityFooter() {
  return (
    <footer className="bg-slate-950 text-slate-400 font-mono text-xs border-t border-slate-800">
      
      {/* Top Banner: Indore Hybrid Hub & Next Cohort */}
      <div className="border-b border-slate-800/80 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center shrink-0">
              <MapPin size={20} />
            </div>
            <div>
              <div className="font-bold text-white text-sm font-sans flex items-center gap-2">
                <span>Indore AI Hub &amp; Global Discord Stage</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] border border-emerald-500/30">
                  Every Saturday 5:00 PM – 7:00 PM IST
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Join in-person technical architecture teardowns in Indore or livestream via Discord Voice &amp; Stage.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/arena/calendar"
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition-all border border-slate-700 flex items-center gap-1.5 shadow-2xs"
            >
              <Calendar size={13} className="text-amber-400" />
              <span>Sync Lu.ma Calendar</span>
            </Link>
            <a
              href="https://discord.gg/k75ZpEnzp"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all flex items-center gap-1.5 shadow-2xs"
            >
              <span>Join Discord</span>
              <ExternalLink size={13} />
            </a>
          </div>
        </div>
      </div>

      {/* Main 4-Column Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
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
                <div className="text-[10px] text-[#0066FF] font-black uppercase -mt-1">BUILDERS</div>
              </div>
            </Link>

            <p className="text-slate-400 text-xs font-sans leading-relaxed">
              <strong>Build. Ship. Learn. Connect.</strong> Strictly for authentic students building frontier production systems in AI, Defence, FinTech, and Systems.
            </p>

            <div className="pt-2 text-[11px] text-slate-500 space-y-1">
              <div><strong>Cohort 1:</strong> 14th Sept – Diwali 2026</div>
              <div><strong>Cohort 2:</strong> January 2027</div>
            </div>
          </div>

          {/* Column 2: 45-Day Internship Playground & Roadmaps */}
          <div className="space-y-3">
            <h4 className="text-white font-bold uppercase text-[11px] tracking-wider text-slate-300">
              Internship Playground
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/virtual-ai-internship" className="hover:text-white transition-colors flex items-center gap-1.5 text-blue-400 font-bold">
                  <Sparkles size={13} />
                  <span>45-Day Virtual AI Internship</span>
                </Link>
              </li>
              <li>
                <Link href="/arena" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <Terminal size={13} className="text-blue-400" />
                  <span>50-Project Matrix</span>
                </Link>
              </li>
              <li>
                <Link href="/arena/roadmaps" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <Compass size={13} className="text-purple-400" />
                  <span>Role Stage Roadmaps</span>
                </Link>
              </li>
              <li>
                <Link href="/arena/progress" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <Activity size={13} className="text-emerald-400" />
                  <span>Live Progress Diaries</span>
                </Link>
              </li>
              <li>
                <Link href="/arena/antigravity-guide" className="hover:text-white transition-colors">
                  Antigravity Research Swarms
                </Link>
              </li>
              <li>
                <Link href="/arena/custom-project" className="hover:text-white transition-colors">
                  Pitch Custom Project
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Career OS & Bounties */}
          <div className="space-y-3">
            <h4 className="text-white font-bold uppercase text-[11px] tracking-wider text-slate-300">
              Career OS &amp; Bounties
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/arena/wallet" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <Coins size={13} className="text-amber-400" />
                  <span>Student Karma Wallet</span>
                </Link>
              </li>
              <li>
                <Link href="/arena/bounties" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <Terminal size={13} className="text-blue-400" />
                  <span>Blocker Bounty Board</span>
                </Link>
              </li>
              <li>
                <Link href="/arena/antigravity-guide" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <Award size={13} className="text-emerald-400" />
                  <span>Platform Guide &amp; Tour</span>
                </Link>
              </li>
              <li>
                <Link href="/arena/career-checklist" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <Briefcase size={13} className="text-purple-400" />
                  <span>LinkedIn &amp; HR Outreach</span>
                </Link>
              </li>
              <li>
                <Link href="/arena/collaborate" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <Users size={13} className="text-indigo-400" />
                  <span>Discord Squad Matchmaker</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Community & Resources */}
          <div className="space-y-3">
            <h4 className="text-white font-bold uppercase text-[11px] tracking-wider text-slate-300">
              Community &amp; Resources
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/discussions" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <Terminal size={13} className="text-blue-400" />
                  <span>Discussions &amp; Technical Q&amp;A</span>
                </Link>
              </li>
              <li>
                <Link href="/arena/antigravity-guide" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <Compass size={13} className="text-purple-400" />
                  <span>System Design &amp; AI Core</span>
                </Link>
              </li>
              <li>
                <a href="https://luma.com/botmartz" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1.5 text-amber-400 font-bold">
                  <ExternalLink size={13} />
                  <span>Free AMAs on Luma</span>
                </a>
              </li>
              <li>
                <Link href="/certificates" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ShieldCheck size={13} className="text-emerald-400" />
                  <span>Verify Student Credentials</span>
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition-colors flex items-center gap-1.5 text-blue-400 font-bold">
                  <span>Student Verification Portal</span>
                </Link>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-900 bg-slate-950 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <div className="flex items-center gap-2">
            <span>© 2026 Botmartz Community. Governed by Founder Soham Sharma.</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Zero-Trust Score: 100/100</span>
            </span>
            <span>•</span>
            <Link href="/admin/login" className="hover:text-slate-400 transition-colors">
              Admin Portal
            </Link>
          </div>
        </div>
      </div>

    </footer>
  );
}
