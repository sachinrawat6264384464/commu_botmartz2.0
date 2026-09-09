"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  Menu,
  X,
  Calendar,
  Layers,
  Compass,
  Briefcase,
  Users,
  Coins,
  ShieldCheck,
  User,
  LogOut,
  Edit3,
  Bot,
  Activity,
  Award,
  Terminal,
  MessageSquare,
  Sparkles,
  ExternalLink,
  Presentation,
  CheckCircle2,
  Lock,
  Globe,
  BookOpen,
  Code2
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export default function CommunityNavbar() {
  const pathname = usePathname();
  const { user, studentProfile, logout } = useAuth();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [internshipOpen, setInternshipOpen] = useState(false);
  const [communityOpen, setCommunityOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const internshipMenuRef = useRef<HTMLDivElement>(null);
  const communityMenuRef = useRef<HTMLDivElement>(null);
  const resourcesMenuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (internshipMenuRef.current && !internshipMenuRef.current.contains(e.target as Node)) {
        setInternshipOpen(false);
      }
      if (communityMenuRef.current && !communityMenuRef.current.contains(e.target as Node)) {
        setCommunityOpen(false);
      }
      if (resourcesMenuRef.current && !resourcesMenuRef.current.contains(e.target as Node)) {
        setResourcesOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setInternshipOpen(false);
    setCommunityOpen(false);
    setResourcesOpen(false);
    setUserDropdownOpen(false);
  }, [pathname]);

  const INTERNSHIP_ITEMS = [
    { name: "45-Day Virtual AI Internship", href: "/virtual-ai-internship", icon: Sparkles, desc: "Curriculum, daily commit tracker & founder reviews", locked: false },
    { name: "Internship Playground (50 PRDs)", href: "/arena", icon: Layers, desc: "Explore production engineering systems", locked: false },
    { name: "Submit Daily Log", href: "/arena/daily-log", icon: Terminal, desc: "Submit daily PoW & earn Karma Coins", locked: false },
    { name: "50 Career Roadmaps", href: "/arena/roadmaps", icon: Compass, desc: "Progressive career paths for all roles", locked: false },
    { name: "Career & LinkedIn Checklist", href: "/arena/career-checklist", icon: Briefcase, desc: "Profile checklist, templates & UGC composer", locked: false },
    { name: "Platform & Product Tour", href: "/product-tour", icon: BookOpen, desc: "Interactive guide to all features & pages", locked: false },
    { name: "Propose Custom Project", href: "/arena/custom-project", icon: Edit3, desc: "Submit domain ideas for founder review", locked: false }
  ];

  const COMMUNITY_ITEMS = [
    { name: "Progress Diaries", href: "/arena/progress", icon: Activity, desc: "Live public feed of daily student commits", locked: false },
    { name: "Blocker Bounty Board", href: "/arena/bounties", icon: Coins, desc: "Post technical bottlenecks with coin rewards", locked: false },
    { name: "Squad Matchmaker", href: "/arena/collaborate", icon: Users, desc: "Find cross-functional builder teammates", locked: false },
    { name: "Builder Leaderboard", href: "/arena/leaderboard", icon: Award, desc: "Real-time student karma rankings", locked: false },
    { name: "Free Community Events (Luma)", href: "https://luma.com/botmartz", icon: ExternalLink, desc: "Weekly AMAs, workshops & teardowns", external: true },
    { name: "Schedule & Calendar", href: "/arena/calendar", icon: Calendar, desc: "Cohort milestones and office hours", locked: false }
  ];

  const RESOURCE_ITEMS = [
    { name: "Platform Guide & Tour", href: "/product-tour", icon: BookOpen, desc: "Explore all 14 community engineering tools", locked: false },
    { name: "Botmartz Karma Wallet", href: "/arena/wallet", icon: Coins, desc: "Redeem perks, compute grants & tip peers", locked: false },
    { name: "Verified Certificates", href: "/certificates", icon: ShieldCheck, desc: "Cryptographically verifiable credentials", locked: false },
    { name: "Magazine & Research", href: "/magazine", icon: Presentation, desc: "Deep engineering teardowns & whitepapers", locked: false }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        
        {/* Brand Logo */}
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
            <div className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 flex items-center gap-1.5 font-sans">
              <span>BOTMARTZ</span>
              <span className="text-[#0066FF] font-black text-sm">AI WORKSHOP</span>
            </div>
            <p className="text-[10px] font-mono text-slate-500 tracking-wider uppercase font-bold -mt-0.5">
              Production Engineering Cohort
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1.5 font-mono text-xs font-bold">
          
          {/* 1. Flagship Workshop Direct Tab */}
          <Link
            href="/"
            className={`px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5 ${
              pathname === "/"
                ? "text-[#0066FF] bg-blue-50/80 font-bold"
                : "text-slate-700 hover:text-[#0066FF] hover:bg-slate-50"
            }`}
          >
            <Sparkles size={14} className="text-[#0066FF]" />
            <span>AI Workshop (Live)</span>
            <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 text-[9px] font-bold">₹9</span>
          </Link>

          {/* 2. All Workshops */}
          <Link
            href="/workshops"
            className={`px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5 ${
              pathname.startsWith("/workshops")
                ? "text-[#0066FF] bg-blue-50/80 font-bold"
                : "text-slate-700 hover:text-[#0066FF] hover:bg-slate-50"
            }`}
          >
            <span>All Bootcamps</span>
          </Link>

          {/* 3. Internship Dropdown */}
          <div className="relative" ref={internshipMenuRef}>
            <button
              onClick={() => {
                setInternshipOpen(!internshipOpen);
                setCommunityOpen(false);
                setResourcesOpen(false);
              }}
              className={`px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer ${
                pathname.startsWith("/arena") || pathname.startsWith("/virtual-ai-internship")
                  ? "text-[#0066FF] bg-blue-50/80 font-bold"
                  : "text-slate-700 hover:text-[#0066FF] hover:bg-slate-50"
              }`}
            >
              <span>Internship</span>
              <ChevronDown size={14} className={`transition-transform duration-200 ${internshipOpen ? "rotate-180 text-[#0066FF]" : "text-slate-400"}`} />
            </button>

            {internshipOpen && (
              <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                {INTERNSHIP_ITEMS.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0066FF] flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-[#0066FF] group-hover:text-white transition-colors">
                        <IconComponent size={16} />
                      </div>
                      <div className="flex-1">
                        <div className="text-slate-900 font-bold text-xs font-sans group-hover:text-[#0066FF] transition-colors flex items-center justify-between">
                          <span>{item.name}</span>
                          {item.locked && (
                            <span className="flex items-center gap-0.5 text-[9px] font-mono text-amber-600 font-normal bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                              <Lock size={9} /> Scheduled
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono font-normal line-clamp-1">{item.desc}</div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* 4. Community Dropdown */}
          <div className="relative" ref={communityMenuRef}>
            <button
              onClick={() => {
                setCommunityOpen(!communityOpen);
                setInternshipOpen(false);
                setResourcesOpen(false);
              }}
              className={`px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer ${
                pathname.includes("/progress") || pathname.includes("/bounties") || pathname.includes("/collaborate") || pathname.includes("/leaderboard") || pathname.includes("/calendar")
                  ? "text-[#0066FF] bg-blue-50/80 font-bold"
                  : "text-slate-700 hover:text-[#0066FF] hover:bg-slate-50"
              }`}
            >
              <span>Community</span>
              <ChevronDown size={14} className={`transition-transform duration-200 ${communityOpen ? "rotate-180 text-[#0066FF]" : "text-slate-400"}`} />
            </button>

            {communityOpen && (
              <div className="absolute top-full left-0 mt-2 w-84 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                {COMMUNITY_ITEMS.map((item) => {
                  const IconComponent = item.icon;
                  if (item.external) {
                    return (
                      <a
                        key={item.name}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                          <IconComponent size={16} />
                        </div>
                        <div>
                          <div className="text-slate-900 font-bold text-xs font-sans group-hover:text-purple-600 transition-colors flex items-center gap-1">
                            <span>{item.name}</span>
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono font-normal line-clamp-1">{item.desc}</div>
                        </div>
                      </a>
                    );
                  }
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0066FF] flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-[#0066FF] group-hover:text-white transition-colors">
                        <IconComponent size={16} />
                      </div>
                      <div className="flex-1">
                        <div className="text-slate-900 font-bold text-xs font-sans group-hover:text-[#0066FF] transition-colors flex items-center justify-between">
                          <span>{item.name}</span>
                          {item.locked && (
                            <span className="flex items-center gap-0.5 text-[9px] font-mono text-amber-600 font-normal bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                              <Lock size={9} /> Scheduled
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono font-normal line-clamp-1">{item.desc}</div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* 5. Certificates */}
          <Link
            href="/certificates"
            className={`px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5 ${
              pathname.startsWith("/certificates")
                ? "text-[#0066FF] bg-blue-50/80 font-bold"
                : "text-slate-700 hover:text-[#0066FF] hover:bg-slate-50"
            }`}
          >
            <span>Certificates</span>
          </Link>

        </nav>

        {/* User Auth Action & Register CTA */}
        <div className="hidden lg:flex items-center gap-3">
          
          <a
            href="/#registration"
            className="px-5 py-2.5 rounded-2xl bg-[#0066FF] hover:bg-[#0052CC] text-white font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-blue-500/20 flex items-center gap-1.5 cursor-pointer"
          >
            <span>Register &amp; Pay (₹9)</span>
            <Sparkles size={13} />
          </a>

          {user ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 pr-3 rounded-2xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 transition-all cursor-pointer shadow-2xs"
              >
                <div className="relative w-8 h-8 rounded-xl bg-gradient-to-tr from-[#0066FF] to-[#00B8F0] text-white font-mono text-xs font-bold flex items-center justify-center shadow-xs">
                  {user.photoURL ? (
                    <Image src={user.photoURL} alt={user.displayName || "User"} width={32} height={32} className="rounded-xl object-cover" />
                  ) : (
                    <span>{(user.displayName || user.email || "U")[0].toUpperCase()}</span>
                  )}
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
                </div>

                <div className="text-left font-mono">
                  <div className="text-xs font-bold text-slate-900 truncate max-w-[110px]">
                    {user.displayName || user.email?.split("@")[0]}
                  </div>
                </div>

                <ChevronDown size={14} className="text-slate-400" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-50 font-mono text-xs animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="p-3 border-b border-slate-100 mb-1">
                    <div className="font-bold text-slate-900 font-sans">{user.displayName || "Student Builder"}</div>
                    <div className="text-[11px] text-slate-500 truncate">{user.email}</div>
                  </div>

                  <Link
                    href="/profile"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-50 text-slate-700 hover:text-[#0066FF] transition-colors"
                  >
                    <User size={14} /> My Profile &amp; Passes
                  </Link>

                  {(user.email?.toLowerCase().includes("botmartz.com") || studentProfile?.role === "ADMIN") && (
                    <Link
                      href="/admin"
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-purple-50 text-purple-700 transition-colors font-bold"
                    >
                      <Lock size={14} /> Super Admin CMS
                    </Link>
                  )}

                  <div className="border-t border-slate-100 mt-1 pt-1">
                    <button
                      onClick={() => logout()}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-rose-50 text-rose-600 transition-colors text-left cursor-pointer"
                    >
                      <LogOut size={14} /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-xs"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile Menu Toggle Button */}
        <div className="lg:hidden flex items-center gap-2">
          {user && (
            <Link href="/profile" className="p-2 text-slate-700 hover:text-[#0066FF]">
              <User size={20} />
            </Link>
          )}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700"
            aria-label="Toggle Menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-8 space-y-4 font-mono text-xs max-h-[85vh] overflow-y-auto">
          
          <a
            href="/#registration"
            className="w-full py-3.5 rounded-2xl bg-[#0066FF] text-white font-bold text-center block uppercase tracking-wider shadow-md"
          >
            Register for Workshop (₹9)
          </a>

          <div className="space-y-1">
            <div className="text-[10px] text-slate-400 uppercase font-bold px-3 py-1">Virtual AI Internship &amp; Arena</div>
            {INTERNSHIP_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl text-slate-800 hover:bg-slate-50"
              >
                <div className="flex items-center gap-2.5">
                  <item.icon size={15} className="text-[#0066FF]" />
                  <span className="font-bold">{item.name}</span>
                </div>
              </Link>
            ))}
          </div>

          <div className="space-y-1 border-t border-slate-100 pt-3">
            <div className="text-[10px] text-slate-400 uppercase font-bold px-3 py-1">Community Hub</div>
            {COMMUNITY_ITEMS.map((item) => {
              if (item.external) {
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between px-3 py-2.5 rounded-xl text-slate-800 hover:bg-slate-50"
                  >
                    <div className="flex items-center gap-2.5">
                      <item.icon size={15} className="text-purple-600" />
                      <span className="font-bold">{item.name}</span>
                    </div>
                  </a>
                );
              }
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl text-slate-800 hover:bg-slate-50"
                >
                  <div className="flex items-center gap-2.5">
                    <item.icon size={15} className="text-[#0066FF]" />
                    <span className="font-bold">{item.name}</span>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="space-y-1 border-t border-slate-100 pt-3">
            <div className="text-[10px] text-slate-400 uppercase font-bold px-3 py-1">Resources &amp; Credentials</div>
            {RESOURCE_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl text-slate-800 hover:bg-slate-50"
              >
                <div className="flex items-center gap-2.5">
                  <item.icon size={15} className="text-emerald-600" />
                  <span className="font-bold">{item.name}</span>
                </div>
              </Link>
            ))}
          </div>

          <div className="border-t border-slate-100 pt-4">
            {user ? (
              <div className="space-y-2">
                <Link
                  href="/profile"
                  className="w-full py-3 rounded-xl bg-slate-900 text-white font-bold text-center block"
                >
                  My Verified Profile
                </Link>
                <button
                  onClick={() => logout()}
                  className="w-full py-2.5 rounded-xl border border-rose-200 text-rose-600 font-bold"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="w-full py-3 rounded-xl bg-slate-900 text-white font-bold text-center block uppercase tracking-wider"
              >
                Sign In
              </Link>
            )}
          </div>

        </div>
      )}
    </header>
  );
}
