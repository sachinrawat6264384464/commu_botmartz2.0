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
import { TOTAL_SYSTEMS_COUNT } from "@/lib/arena-projects";

export default function CommunityNavbar() {
  const pathname = usePathname();
  const { user, studentProfile, logout, loading } = useAuth();

  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [internshipOpen, setInternshipOpen] = useState(false);
  const [communityOpen, setCommunityOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
    { name: "My Learning & Projects", href: "/arena/my-learning", icon: BookOpen, desc: "Enrolled projects, 45-day commit progress & badges", locked: false },
    { name: "45-Day Virtual AI Internship", href: "/virtual-ai-internship", icon: Sparkles, desc: "Curriculum, daily commit tracker & founder reviews", locked: false },
    { name: `Internship Playground (${TOTAL_SYSTEMS_COUNT} PRDs)`, href: "/arena", icon: Layers, desc: "Explore production engineering systems", locked: false },
    { name: "Submit Daily Log", href: "/arena/daily-log", icon: Terminal, desc: "Submit daily PoW & earn Karma Coins", locked: false },
    { name: `${TOTAL_SYSTEMS_COUNT} Career Roadmaps`, href: "/arena/roadmaps", icon: Compass, desc: "Progressive career paths for all roles", locked: false },
    { name: "Career & LinkedIn Checklist", href: "/arena/career-checklist", icon: Briefcase, desc: "Profile checklist, templates & UGC composer", locked: false },
    { name: "Platform & Product Tour", href: "/product-tour", icon: BookOpen, desc: "Interactive guide to all features & pages", locked: false },
    { name: "Propose Custom Project", href: "/arena/custom-project", icon: Edit3, desc: "Submit domain ideas for founder review", locked: false }
  ];

  const COMMUNITY_ITEMS: Array<{ name: string; href: string; icon: any; desc: string; locked?: boolean; external?: boolean }> = [
    { name: "Events Directory", href: "/community/events", icon: Calendar, desc: "Browse upcoming & past AI conferences, summits & meetups", locked: false, external: false },
    { name: "AI Accelerator Workshop", href: "/community/ai-accelerator-workshop", icon: Sparkles, desc: "Hands-on bootcamp series landing page & certificate showcase", locked: false, external: false },
    { name: "Community & Forum Hub", href: "/community", icon: MessageSquare, desc: "Community hub with projects, meetups & reading club", locked: false, external: false },
    { name: "Progress Diaries", href: "/arena/progress", icon: Activity, desc: "Live public feed of daily student commits", locked: false, external: false },
    { name: "Blocker Bounty Board", href: "/arena/bounties", icon: Coins, desc: "Post technical bottlenecks with coin rewards", locked: false, external: false },
    { name: "Squad Matchmaker", href: "/arena/collaborate", icon: Users, desc: "Find cross-functional builder teammates", locked: false, external: false },
    { name: "Builder Leaderboard", href: "/arena/leaderboard", icon: Award, desc: "Real-time student karma rankings", locked: false, external: false }
  ];

  const RESOURCE_ITEMS = [
    { name: "Platform Guide & Tour", href: "/product-tour", icon: BookOpen, desc: "Explore all 14 community engineering tools", locked: false },
    { name: "Botmartz Karma Wallet", href: "/arena/wallet", icon: Coins, desc: "Redeem perks, compute grants & tip peers", locked: false },
    { name: "Verified Certificates", href: "/certificates", icon: ShieldCheck, desc: "Cryptographically verifiable credentials", locked: false },
    { name: "Magazine & Research", href: "/magazine", icon: Presentation, desc: "Deep engineering teardowns & whitepapers", locked: false }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-b-2 border-slate-100 shadow-md transition-all duration-300">
      <div className="w-full px-4 sm:px-8 lg:px-12 h-16 sm:h-20 flex items-center justify-between">
        
        {/* Brand Logo & Live Cohort Badge */}
        <Link href="/" prefetch={false} className="flex items-center gap-2.5 sm:gap-3.5 group shrink-0">
          <div className="relative w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center shrink-0 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200/80 group-hover:border-[#0066FF] group-hover:shadow-md group-hover:shadow-blue-500/15 transition-all duration-300">
            <Image
              src="/logo.png"
              alt="Botmartz Logo"
              width={34}
              height={34}
              className="object-contain drop-shadow-xs group-hover:scale-105 transition-transform duration-300"
              priority
            />
          </div>
          <div className="flex flex-col">
            <div className="font-black text-base sm:text-xl tracking-tight text-slate-900 flex items-center gap-1.5 sm:gap-2 font-sans">
              <span>BOTMARTZ</span>
              <span className="bg-gradient-to-r from-[#0066FF] via-blue-600 to-cyan-500 bg-clip-text text-transparent font-black text-xs sm:text-sm uppercase tracking-wide">
                AI WORKSHOP
              </span>
            </div>
            <div className="flex items-center gap-2 -mt-0.5">
              <span className="text-[10px] font-mono text-slate-500 tracking-wider uppercase font-extrabold hidden sm:inline-block">
                Production Engineering Cohort
              </span>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-mono text-[9px] font-extrabold border border-emerald-300 shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live
              </span>
            </div>
          </div>
        </Link>

        {/* Desktop Pill Navigation */}
        <nav className="hidden lg:flex items-center gap-1.5 bg-slate-100/90 p-1.5 rounded-full border-2 border-slate-200/90 font-sans text-xs font-extrabold shadow-sm backdrop-blur-md">
          
          {/* My Learning Pill */}
          <Link
            href="/arena/my-learning"
            prefetch={false}
            className={`px-4 py-2 rounded-full transition-all duration-200 flex items-center gap-1.5 ${
              pathname === "/arena/my-learning"
                ? "bg-[#0066FF] text-white shadow-lg shadow-blue-500/30 font-black"
                : "text-[#0066FF] hover:text-white hover:bg-[#0066FF] font-black bg-blue-50/80"
            }`}
          >
            <BookOpen size={14} />
            <span>My Learning</span>
          </Link>

          {/* 1. 50 Systems Catalog */}
          <Link
            href="/arena"
            prefetch={false}
            className={`px-4 py-2 rounded-full transition-all duration-200 flex items-center gap-1.5 ${
              pathname === "/arena"
                ? "bg-[#0066FF] text-white shadow-lg shadow-blue-500/30 font-black"
                : "text-slate-700 hover:text-white hover:bg-[#0066FF] font-bold"
            }`}
          >
            <span>{TOTAL_SYSTEMS_COUNT} Systems</span>
          </Link>

          {/* 3. Internship Dropdown */}
          <div className="relative" ref={internshipMenuRef}>
            <button
              onClick={() => {
                setInternshipOpen(!internshipOpen);
                setCommunityOpen(false);
                setResourcesOpen(false);
              }}
              className={`px-4 py-2 rounded-full transition-all duration-200 flex items-center gap-1.5 cursor-pointer group ${
                internshipOpen || pathname.startsWith("/virtual-ai-internship")
                  ? "bg-[#0066FF] text-white shadow-lg shadow-blue-500/30 font-black"
                  : "text-[#334155] hover:text-white hover:bg-[#0066FF] font-bold"
              }`}
            >
              <span>Internship</span>
              <ChevronDown size={13} className={`transition-transform duration-200 ${internshipOpen || pathname.startsWith("/virtual-ai-internship") ? "rotate-180 text-white font-bold" : "text-slate-400 group-hover:text-white"}`} />
            </button>

            {internshipOpen && (
              <div className="absolute top-full left-0 mt-3 w-80 bg-white/98 backdrop-blur-2xl border-2 border-slate-200 rounded-3xl shadow-2xl p-2.5 z-50 animate-in fade-in slide-in-from-top-3 duration-200">
                <div className="text-[10px] font-mono text-slate-500 uppercase font-extrabold px-3 py-1.5 border-b border-slate-100 mb-1">
                  Virtual Internship Playground
                </div>
                {INTERNSHIP_ITEMS.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-start gap-3 p-2.5 rounded-2xl hover:bg-blue-50/80 transition-all group"
                    >
                      <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0066FF] flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-[#0066FF] group-hover:text-white transition-all duration-200 shadow-xs border border-blue-100">
                        <IconComponent size={16} />
                      </div>
                      <div className="flex-1">
                        <div className="text-slate-900 font-bold text-xs font-sans group-hover:text-[#0066FF] transition-colors flex items-center justify-between">
                          <span>{item.name}</span>
                          {item.locked && (
                            <span className="flex items-center gap-0.5 text-[9px] font-mono text-amber-600 font-normal bg-amber-50 px-1.5 py-0.5 rounded-full border border-amber-200">
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

          {/* 5. Resources Dropdown */}
          <div className="relative" ref={resourcesMenuRef}>
            <button
              onClick={() => {
                setResourcesOpen(!resourcesOpen);
                setInternshipOpen(false);
                setCommunityOpen(false);
              }}
              className={`px-4 py-2 rounded-full transition-all duration-200 flex items-center gap-1.5 cursor-pointer group ${
                resourcesOpen || pathname.includes("/product-tour") || pathname.includes("/wallet") || pathname.includes("/magazine")
                  ? "bg-[#0066FF] text-white shadow-lg shadow-blue-500/30 font-black"
                  : "text-[#334155] hover:text-white hover:bg-[#0066FF] font-bold"
              }`}
            >
              <span>Resources</span>
              <ChevronDown size={13} className={`transition-transform duration-200 ${resourcesOpen || pathname.includes("/product-tour") || pathname.includes("/wallet") || pathname.includes("/magazine") ? "rotate-180 text-white font-bold" : "text-slate-400 group-hover:text-white"}`} />
            </button>

            {resourcesOpen && (
              <div className="absolute top-full left-0 mt-3 w-80 bg-white/98 backdrop-blur-2xl border-2 border-slate-200 rounded-3xl shadow-2xl p-2.5 z-50 animate-in fade-in slide-in-from-top-3 duration-200">
                <div className="text-[10px] font-mono text-slate-500 uppercase font-extrabold px-3 py-1.5 border-b border-slate-100 mb-1">
                  Developer Resources &amp; Credentials
                </div>
                {RESOURCE_ITEMS.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-start gap-3 p-2.5 rounded-2xl hover:bg-emerald-50/80 transition-all group"
                    >
                      <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-200 shadow-xs border border-emerald-100">
                        <IconComponent size={16} />
                      </div>
                      <div className="flex-1">
                        <div className="text-slate-900 font-bold text-xs font-sans group-hover:text-emerald-600 transition-colors flex items-center justify-between">
                          <span>{item.name}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono font-normal line-clamp-1">{item.desc}</div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

        </nav>

        {/* Dynamic User Auth Action */}
        <div className="hidden lg:flex items-center gap-3">
          {!mounted || loading ? (
            <div className="flex items-center gap-2 p-2 px-4 rounded-full border border-slate-200 bg-slate-100 text-slate-500 font-mono text-xs animate-pulse">
              <div className="w-5 h-5 rounded-full bg-slate-300" />
              <span>Authenticating...</span>
            </div>
          ) : user ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-3 p-1.5 pr-3.5 rounded-full border-2 border-slate-200 hover:border-[#0066FF] bg-white hover:bg-slate-50 transition-all duration-200 cursor-pointer shadow-xs"
              >
                <div className="relative w-8 h-8 rounded-full bg-gradient-to-tr from-[#0066FF] to-[#00B8F0] text-white font-mono text-xs font-bold flex items-center justify-center shadow-xs">
                  {user.photoURL ? (
                    <Image src={user.photoURL} alt={user.displayName || "User"} width={32} height={32} className="rounded-full object-cover" />
                  ) : (
                    <span>{(user.displayName || user.email || "U")[0].toUpperCase()}</span>
                  )}
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
                </div>

                <div className="text-left font-sans">
                  <div className="text-xs font-black text-slate-900 truncate max-w-[110px]">
                    {user.displayName || user.email?.split("@")[0]}
                  </div>
                </div>

                <ChevronDown size={14} className="text-slate-400" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 top-full mt-3 w-68 bg-white/98 backdrop-blur-2xl border-2 border-slate-200 rounded-3xl shadow-2xl p-2.5 z-50 font-sans text-xs animate-in fade-in slide-in-from-top-3 duration-200">
                  <div className="p-3 border-b border-slate-100 mb-1 rounded-2xl bg-slate-50/80">
                    <div className="font-black text-slate-900 font-sans">{user.displayName || "Student Builder"}</div>
                    <div className="text-[11px] text-slate-500 font-mono truncate">{user.email}</div>
                  </div>

                  <Link
                    href="/arena/my-learning"
                    className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl hover:bg-blue-50 text-[#0066FF] transition-colors font-bold bg-blue-50/50 mb-1"
                  >
                    <BookOpen size={15} /> My Learning &amp; Projects
                  </Link>

                  <Link
                    href="/profile"
                    className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl hover:bg-blue-50 text-slate-700 hover:text-[#0066FF] transition-colors font-bold"
                  >
                    <User size={15} /> My Profile &amp; Passes
                  </Link>

                  {(user.email?.toLowerCase().includes("botmartz.com") || studentProfile?.role === "ADMIN") && (
                    <Link
                      href="/admin"
                      className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl hover:bg-purple-50 text-purple-700 transition-colors font-bold"
                    >
                      <Lock size={15} /> Super Admin CMS
                    </Link>
                  )}

                  <div className="border-t border-slate-100 mt-1 pt-1">
                    <button
                      onClick={() => logout()}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl hover:bg-rose-50 text-rose-600 transition-colors text-left cursor-pointer font-bold"
                    >
                      <LogOut size={15} /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 font-sans text-xs">
              <Link
                href="/login?mode=signup"
                className="px-4 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold transition-all cursor-pointer border border-slate-200"
              >
                Sign Up
              </Link>
              <Link
                href="/login?mode=signin"
                className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#0066FF] via-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-sans text-xs sm:text-sm font-black transition-all duration-300 shadow-lg hover:shadow-blue-500/25 border border-blue-400/30 hover:scale-[1.03] active:scale-[0.97] flex items-center gap-2 cursor-pointer group"
              >
                <span>Sign In</span>
                <Sparkles size={14} className="text-cyan-300 group-hover:rotate-12 transition-transform duration-300" />
              </Link>
            </div>
          )}
        </div>


        {/* Mobile Menu Toggle Button */}
        <div className="lg:hidden flex items-center gap-2">
          {mounted && user && (
            <Link href="/profile" className="p-2 text-slate-700 hover:text-[#0066FF]">
              <User size={20} />
            </Link>
          )}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2.5 rounded-full border border-slate-200/90 hover:bg-slate-50 text-slate-700 shadow-2xs"
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
            {!mounted || loading ? (
              <div className="py-2.5 text-center text-slate-400 font-mono text-xs animate-pulse">Authenticating session...</div>
            ) : user ? (
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
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/login?mode=signup"
                  onClick={() => setMobileOpen(false)}
                  className="py-3 rounded-xl bg-[#0066FF] text-white font-bold text-center block uppercase tracking-wider text-xs"
                >
                  Sign Up
                </Link>
                <Link
                  href="/login?mode=signin"
                  onClick={() => setMobileOpen(false)}
                  className="py-3 rounded-xl bg-slate-900 text-white font-bold text-center block uppercase tracking-wider text-xs"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>

        </div>
      )}

    </header>
  );
}
