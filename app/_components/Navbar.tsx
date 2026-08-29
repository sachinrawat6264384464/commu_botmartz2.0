"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Sparkles,
  ChevronDown,
  Menu,
  X,
  Calendar,
  Award,
  FileText,
  ImageIcon,
  MessageSquare,
  Trophy,
  Flame,
  Rocket,
  User,
  Bot,
  Coins,
  Users,
  Compass,
  Globe,
  Briefcase,
  LogOut,
  ShieldCheck,
  Edit3
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export default function CommunityNavbar() {
  const pathname = usePathname();
  const { user, studentProfile, logout } = useAuth();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const PRIMARY_LINKS = [
    { name: "Arena ⚡", href: "/arena" },
    { name: "Roadmaps 🗺️", href: "/arena/roadmaps" },
    { name: "Ecosystems 🌐", href: "/arena/ecosystems" },
    { name: "Progress Diaries 🔥", href: "/arena/progress" },
    { name: "Leaderboard 🏆", href: "/arena/leaderboard" },
    { name: "Calendar 🗓️", href: "/arena/calendar" },
  ];

  const BUILD_LINKS = [
    { name: "Student Karma Wallet 🪙", href: "/arena/wallet", icon: Coins, desc: "Earn & redeem coins for perks & reviews" },
    { name: "Blocker Bounty Board", href: "/arena/bounties", icon: Sparkles, desc: "Post roadblocks with coin rewards" },
    { name: "Discord Squad Matchmaker", href: "/arena/collaborate", icon: Users, desc: "Form cross-functional teams" },
    { name: "Antigravity Research Agents", href: "/arena/antigravity-guide", icon: Bot, desc: "Build autonomous research swarms" },
  ];

  const CAREER_LINKS = [
    { name: "Shippers Circle (15 Referrals)", href: "/arena/shippers", icon: Rocket, desc: "3 Projects → 15 Company Referrals" },
    { name: "Stage-Based Roadmaps 🗺️", href: "/arena/roadmaps", icon: Compass, desc: "6 Engineering tracks (Stage 1 to 4)" },
    { name: "Industry Ecosystems Radar 🌐", href: "/arena/ecosystems", icon: Globe, desc: "Defence, GovTech & Government Grants" },
    { name: "LinkedIn & HR Outreach 💼", href: "/arena/career-checklist", icon: Briefcase, desc: "ATS profile surgery & cold email scripts" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        
        {/* Brand Logo with /logo.png */}
        <Link href="/" className="flex items-center gap-3.5 group shrink-0">
          <div className="relative w-11 h-11 flex items-center justify-center shrink-0">
            <Image
              src="/logo.png"
              alt="Botmartz Logo"
              width={42}
              height={42}
              className="object-contain drop-shadow-xs group-hover:scale-105 transition-transform"
              priority
            />
          </div>
          <div>
            <div className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 flex items-center gap-1.5">
              <span>BOTMARTZ</span>
              <span className="text-[#0066FF] font-black text-sm">BUILDERS</span>
            </div>
            <p className="text-[10px] font-mono text-slate-500 tracking-wider uppercase font-bold -mt-0.5">
              Student Arena &amp; Internship
            </p>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1.5 font-mono text-xs font-bold text-slate-700">
          {PRIMARY_LINKS.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-xl transition-all ${
                  isActive
                    ? "bg-slate-100 text-slate-950 font-black"
                    : "hover:bg-slate-50 hover:text-slate-950 text-slate-600"
                }`}
              >
                {link.name}
              </Link>
            );
          })}

          {/* More Exploration Mega Dropdown */}
          <div className="relative" ref={moreMenuRef}>
            <button
              onClick={() => setMoreOpen(!moreOpen)}
              className="px-3 py-2 rounded-xl hover:bg-slate-50 text-slate-600 hover:text-slate-950 transition-all flex items-center gap-1 cursor-pointer"
            >
              <span>Explore</span>
              <ChevronDown size={13} className={`transition-transform duration-200 ${moreOpen ? "rotate-180" : ""}`} />
            </button>

            {moreOpen && (
              <div className="absolute top-full right-0 mt-2 w-96 bg-white border border-slate-200 rounded-3xl p-4 shadow-xl font-mono text-xs animate-fadeIn">
                
                <div className="mb-3">
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2 px-2">
                    Build &amp; Collaborate
                  </div>
                  <div className="space-y-1">
                    {BUILD_LINKS.map((item, idx) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={idx}
                          href={item.href}
                          onClick={() => setMoreOpen(false)}
                          className="p-2 rounded-2xl hover:bg-slate-50 transition-all flex items-start gap-3 group"
                        >
                          <div className="w-7 h-7 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 group-hover:bg-[#0066FF] group-hover:text-white transition-colors">
                            <Icon size={14} />
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 text-xs">{item.name}</div>
                            <div className="text-[10px] text-slate-500 font-sans">{item.desc}</div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2 px-2">
                    Careers &amp; Grants
                  </div>
                  <div className="space-y-1">
                    {CAREER_LINKS.map((item, idx) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={idx}
                          href={item.href}
                          onClick={() => setMoreOpen(false)}
                          className="p-2 rounded-2xl hover:bg-slate-50 transition-all flex items-start gap-3 group"
                        >
                          <div className="w-7 h-7 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 group-hover:bg-[#0066FF] group-hover:text-white transition-colors">
                            <Icon size={14} />
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 text-xs">{item.name}</div>
                            <div className="text-[10px] text-slate-500 font-sans">{item.desc}</div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>

              </div>
            )}
          </div>
        </nav>

        {/* User Authentication & Action CTA */}
        <div className="flex items-center gap-3">
          
          {user ? (
            /* Logged In State */
            <div className="relative" ref={userMenuRef}>
              <div className="flex items-center gap-2">
                
                {/* Karma Coins Pill */}
                <Link
                  href="/arena/wallet"
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 font-mono text-xs font-bold hover:bg-amber-100 transition-all"
                >
                  <Coins size={13} className="text-amber-600" />
                  <span>{studentProfile?.karmaCoins || 100} 🪙</span>
                </Link>

                {/* User Avatar Button */}
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1 pl-2 pr-2.5 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all cursor-pointer"
                >
                  <div className="relative">
                    {user.photoURL ? (
                      <Image
                        src={user.photoURL}
                        alt="User"
                        width={28}
                        height={28}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-[#0066FF] text-white font-mono font-bold text-xs flex items-center justify-center">
                        {user.displayName?.charAt(0) || "S"}
                      </div>
                    )}
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
                  </div>
                  <span className="hidden sm:inline font-mono text-xs font-bold text-slate-800 max-w-[100px] truncate">
                    {studentProfile?.displayName?.split(" ")[0] || "Student"}
                  </span>
                  <ChevronDown size={12} className="text-slate-400" />
                </button>
              </div>

              {/* User Dropdown Menu */}
              {userDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-72 bg-white border border-slate-200 rounded-3xl p-4 shadow-xl font-mono text-xs animate-fadeIn">
                  
                  {/* Student Card Summary */}
                  <div className="pb-3 border-b border-slate-100 mb-2">
                    <div className="font-bold text-slate-900 font-sans text-sm">
                      {studentProfile?.displayName || user.displayName || "Student Builder"}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      @{studentProfile?.username || user.email?.split("@")[0]}
                    </div>
                    {studentProfile?.collegeName && (
                      <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200 truncate max-w-full">
                        <ShieldCheck size={10} /> {studentProfile.collegeName}
                      </div>
                    )}
                  </div>

                  {/* Navigation Links */}
                  <div className="space-y-1">
                    <Link
                      href="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 text-slate-700 font-bold transition-all"
                    >
                      <User size={14} className="text-[#0066FF]" />
                      <span>My Profile &amp; Heatmap</span>
                    </Link>

                    <Link
                      href="/arena/wallet"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 text-slate-700 font-bold transition-all"
                    >
                      <Coins size={14} className="text-amber-600" />
                      <span>Karma Wallet ({studentProfile?.karmaCoins || 100} Coins)</span>
                    </Link>

                    <Link
                      href="/arena/roadmaps"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 text-slate-700 font-bold transition-all"
                    >
                      <Compass size={14} className="text-purple-600" />
                      <span>My Role Roadmap</span>
                    </Link>

                    <Link
                      href="/arena/shippers"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 text-slate-700 font-bold transition-all"
                    >
                      <Rocket size={14} className="text-emerald-600" />
                      <span>Shippers Circle (15 Referrals)</span>
                    </Link>

                    <Link
                      href="/arena/bounties"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 text-slate-700 font-bold transition-all"
                    >
                      <Sparkles size={14} className="text-blue-600" />
                      <span>Post Blocker Bounty</span>
                    </Link>

                    <Link
                      href="/login"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 text-slate-700 font-bold transition-all"
                    >
                      <Edit3 size={14} className="text-slate-500" />
                      <span>Update College Details</span>
                    </Link>
                  </div>

                  <div className="pt-2 border-t border-slate-100 mt-2">
                    <button
                      onClick={() => { logout(); setUserDropdownOpen(false); }}
                      className="w-full flex items-center gap-2 p-2 rounded-xl hover:bg-rose-50 text-rose-600 font-bold transition-all cursor-pointer"
                    >
                      <LogOut size={14} />
                      <span>Sign Out</span>
                    </button>
                  </div>

                </div>
              )}
            </div>
          ) : (
            /* Logged Out State */
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-xs flex items-center gap-1.5"
              >
                <span>Sign In / Join</span>
                <span className="text-amber-400">⚡</span>
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

        </div>

      </div>

      {/* Mobile Slide-Down Drawer */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 p-6 space-y-4 font-mono text-xs animate-fadeIn">
          
          {user ? (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900">{studentProfile?.displayName || user.displayName}</div>
                <div className="text-[11px] text-slate-500">{studentProfile?.collegeName || "Verified Student"}</div>
              </div>
              <div className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-bold text-xs">
                {studentProfile?.karmaCoins || 100} 🪙
              </div>
            </div>
          ) : (
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="w-full py-3 rounded-2xl bg-slate-900 text-white font-bold flex items-center justify-center gap-2 uppercase"
            >
              <span>Sign In with Google / Phone OTP</span>
            </Link>
          )}

          <div className="grid grid-cols-2 gap-2 pt-2">
            {PRIMARY_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="p-3 rounded-xl bg-slate-50 border border-slate-100 font-bold text-slate-800 text-center"
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 space-y-2">
            <Link
              href="/arena/wallet"
              onClick={() => setMobileOpen(false)}
              className="block p-2 text-slate-600 font-bold"
            >
              🪙 Student Karma Wallet
            </Link>
            <Link
              href="/arena/bounties"
              onClick={() => setMobileOpen(false)}
              className="block p-2 text-slate-600 font-bold"
            >
              🚨 Blocker Bounty Board
            </Link>
            <Link
              href="/arena/career-checklist"
              onClick={() => setMobileOpen(false)}
              className="block p-2 text-slate-600 font-bold"
            >
              💼 LinkedIn &amp; HR Outreach Checklist
            </Link>
          </div>

          {user && (
            <div className="pt-2 border-t border-slate-100">
              <button
                onClick={() => { logout(); setMobileOpen(false); }}
                className="w-full py-2.5 rounded-xl bg-rose-50 text-rose-700 font-bold text-center"
              >
                Sign Out
              </button>
            </div>
          )}

        </div>
      )}
    </header>
  );
}
