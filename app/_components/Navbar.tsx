"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { 
  ChevronDown, 
  Menu, 
  X, 
  ArrowRight, 
  Sparkles,
  Calendar,
  MessageSquare,
  Code2,
  Trophy,
  Award,
  BookOpen,
  Image as ImageIcon,
  FileText,
  HelpCircle,
  MessageCircle,
  Flame,
  Rocket,
  User,
  Bot,
  Coins,
  Users,
  Compass,
  Globe,
  Briefcase
} from "lucide-react";

export default function CommunityNavbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [ritualsOpen, setRitualsOpen] = useState(false);

  const PRIMARY_LINKS = [
    { name: "Arena ⚡", href: "/arena" },
    { name: "Roadmaps 🗺️", href: "/arena/roadmaps" },
    { name: "Ecosystems 🌐", href: "/arena/ecosystems" },
    { name: "Wallet 🪙", href: "/arena/wallet" },
    { name: "Progress Diaries 🔥", href: "/arena/progress" },
    { name: "Leaderboard 🏆", href: "/arena/leaderboard" },
    { name: "Calendar 🗓️", href: "/arena/calendar" },
  ];

  const RITUALS_LINKS = [
    { 
      name: "Saturday Indore & Virtual Office Hours", 
      href: "/arena/calendar", 
      desc: "Every Saturday 5 PM – 7 PM — Architecture teardowns with Founder",
      tag: "Weekly Flagship",
      color: "text-amber-600 bg-amber-50"
    },
    { 
      name: "Role Progression Roadmaps", 
      href: "/arena/roadmaps", 
      desc: "6 Engineering tracks (Stage 1 to 4) + Project matching",
      tag: "Roadmaps",
      color: "text-purple-600 bg-purple-50"
    },
    { 
      name: "Ecosystems & Gov Grants Radar", 
      href: "/arena/ecosystems", 
      desc: "Defence, GovTech, HealthTech & iDEX / TIDE 2.0 grants",
      tag: "Opportunity Radar",
      color: "text-emerald-700 bg-emerald-50"
    },
    { 
      name: "LinkedIn & HR Outreach Checklist", 
      href: "/arena/career-checklist", 
      desc: "ATS profile surgery & engineering founder cold outreach scripts",
      tag: "Career Flywheel",
      color: "text-blue-600 bg-blue-50"
    },
    { 
      name: "Student Karma Wallet & Points", 
      href: "/arena/wallet", 
      desc: "Earn Botmartz Coins for daily PoW, reviews & bounties",
      tag: "Karma Economy",
      color: "text-amber-700 bg-amber-50"
    },
    { 
      name: "Blocker & Help Bounty Board", 
      href: "/arena/bounties", 
      desc: "Post roadblocks with coin rewards & solve on Discord",
      tag: "Peer Rescue",
      color: "text-blue-600 bg-blue-50"
    },
  ];

  const DROPDOWN_LINKS = [
    { name: "Stage-Based Roadmaps 🗺️", href: "/arena/roadmaps", icon: Compass, desc: "6 Engineering tracks & matched projects" },
    { name: "Industry Ecosystems Radar 🌐", href: "/arena/ecosystems", icon: Globe, desc: "Defence, GovTech & Government Grants" },
    { name: "LinkedIn & HR Outreach 💼", href: "/arena/career-checklist", icon: Briefcase, desc: "ATS profile surgery & cold email scripts" },
    { name: "Student Karma Wallet 🪙", href: "/arena/wallet", icon: Coins, desc: "Earn & redeem coins for perks & code reviews" },
    { name: "Blocker Bounty Board", href: "/arena/bounties", icon: Sparkles, desc: "Post technical blockers with coin rewards" },
    { name: "Discord Squad Matchmaker", href: "/arena/collaborate", icon: Users, desc: "Form cross-functional builder teams" },
    { name: "My Builder Profile & Heatmap", href: "/profile", icon: User, desc: "Personal proof-of-work heatmap & stats" },
    { name: "Shippers Circle (15 Referrals)", href: "/arena/shippers", icon: Rocket, desc: "3 Projects → 15 Company Referrals & Endorsement" },
    { name: "Builder Arena (50 Projects)", href: "/arena", icon: Flame, desc: "45-Day multi-domain student internship" },
    { name: "Live Progress Diaries", href: "/arena/progress", icon: MessageSquare, desc: "Real-time community standup stream" },
    { name: "Dual Arena Leaderboard", href: "/arena/leaderboard", icon: Trophy, desc: "Top builders & shipped projects" },
    { name: "Indore & Virtual Calendar", href: "/arena/calendar", icon: Calendar, desc: "Saturday office hours & Lu.ma events" },
    { name: "Antigravity Research Agents", href: "/arena/antigravity-guide", icon: Bot, desc: "Build autonomous research swarms" },
    { name: "Submit Custom Proposal", href: "/arena/custom-project", icon: Sparkles, desc: "Propose your own independent project" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        
        {/* Brand Logo with /logo.png */}
        <Link href="/" className="flex items-center gap-3.5 group">
          <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
            <Image
              src="/logo.png"
              alt="Botmartz Logo"
              width={46}
              height={46}
              className="object-contain drop-shadow-xs group-hover:scale-105 transition-transform"
              priority
            />
          </div>
          <div>
            <div className="font-bold text-slate-900 tracking-tight text-lg leading-none">
              BOTMARTZ
            </div>
            <div className="font-mono text-[11px] text-[#0066FF] tracking-wider uppercase font-bold mt-1">
              COMMUNITY
            </div>
          </div>
        </Link>

        {/* Clean Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-7">
          {PRIMARY_LINKS.map((link) => {
            const active = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-xs font-semibold tracking-wide transition-colors ${
                  active ? "text-[#0066FF] font-bold" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {link.name}
              </Link>
            );
          })}

          {/* Weekly Rituals Dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => setRitualsOpen(true)}
            onMouseLeave={() => setRitualsOpen(false)}
          >
            <button
              onClick={() => setRitualsOpen(!ritualsOpen)}
              className="flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900 tracking-wide transition-colors py-2 cursor-pointer"
            >
              <span>Weekly Rituals</span>
              <ChevronDown size={14} className={`transition-transform duration-200 ${ritualsOpen ? "rotate-180 text-[#0066FF]" : ""}`} />
            </button>

            {ritualsOpen && (
              <div className="absolute top-full left-0 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl p-2.5 animate-in fade-in slide-in-from-top-2 duration-150">
                {RITUALS_LINKS.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setRitualsOpen(false)}
                    className="block p-3 rounded-xl hover:bg-slate-50 transition-colors group"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-xs font-bold text-slate-900 group-hover:text-[#0066FF] transition-colors">
                        {item.name}
                      </span>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${item.color}`}>
                        {item.tag}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-1">
                      {item.desc}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Explore Dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => setMoreOpen(true)}
            onMouseLeave={() => setMoreOpen(false)}
          >
            <button
              onClick={() => setMoreOpen(!moreOpen)}
              className="flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900 tracking-wide transition-colors py-2 cursor-pointer"
            >
              <span>Explore</span>
              <ChevronDown size={14} className={`transition-transform duration-200 ${moreOpen ? "rotate-180 text-[#0066FF]" : ""}`} />
            </button>

            {moreOpen && (
              <div className="absolute top-full left-0 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 animate-in fade-in slide-in-from-top-2 duration-150">
                {DROPDOWN_LINKS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMoreOpen(false)}
                    className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
                  >
                    <div className="p-2 rounded-lg bg-blue-50 text-[#0066FF] group-hover:bg-[#0066FF] group-hover:text-white transition-colors shrink-0">
                      <item.icon size={15} />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 group-hover:text-[#0066FF] transition-colors">
                        {item.name}
                      </div>
                      <div className="text-[11px] text-slate-500 line-clamp-1">
                        {item.desc}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Right Action & Community Links */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="https://chat.whatsapp.com/DkzKwpjuktaCYAofOtMlAQ"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-mono text-xs font-bold transition-colors flex items-center gap-1.5 border border-emerald-200"
            title="Join WhatsApp Developer Hub"
          >
            <MessageCircle size={14} />
            <span>WhatsApp</span>
          </a>

          <a
            href="https://discord.gg/k75ZpEnzp"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-mono text-xs font-bold transition-colors flex items-center gap-1.5 border border-indigo-200"
            title="Join Discord Community"
          >
            <span>Discord</span>
          </a>

          <Link
            href="/events/ai-frontier-2026"
            className="bg-[#0066FF] hover:bg-[#0052CC] text-white px-4.5 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all shadow-2xs flex items-center gap-1.5"
          >
            <span>Summit Pass</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-slate-600 hover:text-slate-900"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-6 py-6 space-y-4 shadow-xl">
          <nav className="flex flex-col space-y-3">
            {PRIMARY_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-sm font-semibold text-slate-700 hover:text-[#0066FF] py-1.5"
              >
                {link.name}
              </Link>
            ))}
            
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <div className="text-[11px] font-mono text-slate-400 uppercase font-bold">Community Rituals</div>
              {RITUALS_LINKS.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between text-xs text-slate-700 hover:text-[#0066FF] py-1"
                >
                  <span>{item.name}</span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${item.color}`}>
                    {item.tag}
                  </span>
                </Link>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-2">
              <div className="text-[11px] font-mono text-slate-400 uppercase font-bold">More Resources</div>
              {DROPDOWN_LINKS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2.5 text-xs text-slate-600 hover:text-[#0066FF] py-1"
                >
                  <item.icon size={14} className="text-slate-400" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
          </nav>
          
          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
            <div className="grid grid-cols-2 gap-2">
              <a
                href="https://chat.whatsapp.com/DkzKwpjuktaCYAofOtMlAQ"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-center py-2.5 rounded-xl text-xs font-mono font-bold"
              >
                WhatsApp Hub
              </a>
              <a
                href="https://discord.gg/k75ZpEnzp"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-indigo-50 border border-indigo-200 text-indigo-700 text-center py-2.5 rounded-xl text-xs font-mono font-bold"
              >
                Discord Server
              </a>
            </div>
            <Link
              href="/events/ai-frontier-2026"
              onClick={() => setMobileOpen(false)}
              className="w-full bg-[#0066FF] text-white text-center py-3 rounded-xl text-xs font-bold uppercase tracking-wider mt-2"
            >
              Get Summit Pass →
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
