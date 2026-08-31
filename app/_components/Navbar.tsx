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
  BookOpen
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
    { name: "45-Day Virtual AI Internship", href: "/virtual-ai-internship", icon: Sparkles, desc: "Curriculum, daily commit tracker & founder reviews" },
    { name: "Internship Playground (50 PRDs)", href: "/arena", icon: Layers, desc: "Explore production engineering systems" },
    { name: "Submit Daily Log", href: "/arena/daily-log", icon: Terminal, desc: "Submit daily PoW & earn Karma Coins" },
    { name: "50 Career Roadmaps", href: "/arena/roadmaps", icon: Compass, desc: "Progressive career paths for all roles" },
    { name: "Career & LinkedIn Checklist", href: "/arena/career-checklist", icon: Briefcase, desc: "Profile checklist, templates & UGC composer" },
    { name: "Platform Guide & Ecosystem Tour", href: "/arena/antigravity-guide", icon: BookOpen, desc: "Interactive guide to all features & pages" },
    { name: "Propose Custom Project", href: "/arena/custom-project", icon: Edit3, desc: "Submit domain ideas for founder review" }
  ];

  const COMMUNITY_ITEMS = [
    { name: "Progress Diaries", href: "/arena/progress", icon: Activity, desc: "Live public feed of daily student commits" },
    { name: "Blocker Bounty Board", href: "/arena/bounties", icon: Coins, desc: "Post technical bottlenecks with coin rewards" },
    { name: "Squad Matchmaker", href: "/arena/collaborate", icon: Users, desc: "Find cross-functional builder teammates" },
    { name: "Builder Leaderboard", href: "/arena/leaderboard", icon: Award, desc: "Real-time student karma rankings" },
    { name: "Free Community Events (Luma)", href: "https://luma.com/botmartz", icon: ExternalLink, desc: "Weekly AMAs, workshops & teardowns", external: true },
    { name: "Schedule & Calendar", href: "/arena/calendar", icon: Calendar, desc: "Cohort milestones and office hours" }
  ];

  const RESOURCE_ITEMS = [
    { name: "System Design & AI Core Curriculum", href: "/arena/antigravity-guide", icon: BookOpen, desc: "Anti-vibe coding concepts & AWS foundation" },
    { name: "Botmartz Karma Wallet", href: "/arena/wallet", icon: Coins, desc: "Redeem perks, compute grants & tip peers" },
    { name: "Verified Certificates", href: "/certificates", icon: ShieldCheck, desc: "Cryptographically verifiable credentials" },
    { name: "Magazine & Research", href: "/magazine", icon: Presentation, desc: "Deep engineering teardowns & whitepapers" }
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
              <span className="text-[#0066FF] font-black text-sm">BUILDERS</span>
            </div>
            <p className="text-[10px] font-mono text-slate-500 tracking-wider uppercase font-bold -mt-0.5">
              Virtual Internship Playground
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1.5 font-mono text-xs font-bold">
          
          {/* 1. Internship Dropdown */}
          <div className="relative" ref={internshipMenuRef}>
            <button
              onClick={() => {
                setInternshipOpen(!internshipOpen);
                setCommunityOpen(false);
                setResourcesOpen(false);
              }}
              className={`px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer ${
                pathname.startsWith("/arena") && !pathname.includes("/progress") && !pathname.includes("/calendar") && !pathname.includes("/bounties") && !pathname.includes("/wallet")
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
                      <div>
                        <div className="text-slate-900 font-bold text-xs font-sans group-hover:text-[#0066FF] transition-colors">{item.name}</div>
                        <div className="text-[11px] text-slate-500 font-mono font-normal line-clamp-1">{item.desc}</div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* 2. Direct Discussions Link */}
          <Link
            href="/discussions"
            className={`px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5 ${
              pathname.startsWith("/discussions")
                ? "text-[#0066FF] bg-blue-50/80 font-bold"
                : "text-slate-700 hover:text-[#0066FF] hover:bg-slate-50"
            }`}
          >
            <span>Discussions</span>
          </Link>

          {/* 3. Community Dropdown */}
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
                      <div>
                        <div className="text-slate-900 font-bold text-xs font-sans group-hover:text-[#0066FF] transition-colors">{item.name}</div>
                        <div className="text-[11px] text-slate-500 font-mono font-normal line-clamp-1">{item.desc}</div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* 4. Resources Dropdown */}
          <div className="relative" ref={resourcesMenuRef}>
            <button
              onClick={() => {
                setResourcesOpen(!resourcesOpen);
                setInternshipOpen(false);
                setCommunityOpen(false);
              }}
              className={`px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer ${
                pathname.includes("/wallet") || pathname.includes("/certificates") || pathname.includes("/magazine") || pathname.includes("/antigravity-guide")
                  ? "text-[#0066FF] bg-blue-50/80 font-bold"
                  : "text-slate-700 hover:text-[#0066FF] hover:bg-slate-50"
              }`}
            >
              <span>Resources</span>
              <ChevronDown size={14} className={`transition-transform duration-200 ${resourcesOpen ? "rotate-180 text-[#0066FF]" : "text-slate-400"}`} />
            </button>

            {resourcesOpen && (
              <div className="absolute top-full right-0 mt-2 w-84 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                {RESOURCE_ITEMS.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                        <IconComponent size={16} />
                      </div>
                      <div>
                        <div className="text-slate-900 font-bold text-xs font-sans group-hover:text-emerald-700 transition-colors">{item.name}</div>
                        <div className="text-[11px] text-slate-500 font-mono font-normal line-clamp-1">{item.desc}</div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

        </nav>

        {/* User Auth Action & Profile */}
        <div className="hidden lg:flex items-center gap-3">
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
                  <div className="text-xs font-bold text-slate-900 truncate max-w-[120px]">
                    {user.displayName || user.email?.split("@")[0]}
                  </div>
                  <div className="text-[10px] text-amber-600 font-bold flex items-center gap-1">
                    <Coins size={10} />
                    <span>{studentProfile?.karmaCoins || 100} Coins</span>
                  </div>
                </div>

                <ChevronDown size={14} className="text-slate-400" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-50 font-mono text-xs animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="p-3 border-b border-slate-100 mb-1">
                    <div className="font-bold text-slate-900 font-sans">{user.displayName || "Student Builder"}</div>
                    <div className="text-[11px] text-slate-500 truncate">{user.email}</div>
                    <div className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 rounded px-1.5 py-0.5 mt-1.5 inline-block font-bold">
                      {studentProfile?.collegeName || "Verified Student"}
                    </div>
                  </div>

                  <Link
                    href="/profile"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-50 text-slate-700 hover:text-[#0066FF] transition-colors"
                  >
                    <User size={14} /> My Profile &amp; Heatmap
                  </Link>
                  <Link
                    href="/arena/daily-log"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-50 text-slate-700 hover:text-[#0066FF] transition-colors"
                  >
                    <Terminal size={14} /> Submit Daily PoW
                  </Link>
                  <Link
                    href="/arena/wallet"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-50 text-slate-700 hover:text-[#0066FF] transition-colors"
                  >
                    <Coins size={14} /> Karma Wallet ({studentProfile?.karmaCoins || 100})
                  </Link>

                  {user.email?.toLowerCase().includes("botmartz.com") && (
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
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-5 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-xs"
              >
                Sign In / Verify
              </Link>
            </div>
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
          
          <div className="space-y-1">
            <div className="text-[10px] text-slate-400 uppercase font-bold px-3 py-1">Virtual Internship</div>
            {INTERNSHIP_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-slate-800 hover:bg-slate-50"
              >
                <item.icon size={15} className="text-[#0066FF]" />
                <span className="font-bold">{item.name}</span>
              </Link>
            ))}
          </div>

          <div className="space-y-1 border-t border-slate-100 pt-3">
            <div className="text-[10px] text-slate-400 uppercase font-bold px-3 py-1">Community &amp; Discussions</div>
            <Link
              href="/discussions"
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-slate-800 hover:bg-slate-50 font-bold"
            >
              <MessageSquare size={15} className="text-[#0066FF]" />
              <span>Discussions &amp; Q&amp;A</span>
            </Link>
            {COMMUNITY_ITEMS.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-slate-800 hover:bg-slate-50"
              >
                <item.icon size={15} className="text-[#0066FF]" />
                <span>{item.name}</span>
              </Link>
            ))}
          </div>

          <div className="space-y-1 border-t border-slate-100 pt-3">
            <div className="text-[10px] text-slate-400 uppercase font-bold px-3 py-1">Resources &amp; Grants</div>
            {RESOURCE_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-slate-800 hover:bg-slate-50"
              >
                <item.icon size={15} className="text-emerald-600" />
                <span>{item.name}</span>
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
                className="w-full py-3 rounded-xl bg-[#0066FF] text-white font-bold text-center block uppercase tracking-wider"
              >
                Sign In / Student Register
              </Link>
            )}
          </div>

        </div>
      )}
    </header>
  );
}
