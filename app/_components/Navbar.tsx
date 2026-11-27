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
  Code2,
  Home,
  ArrowRight
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { TOTAL_SYSTEMS_COUNT } from "@/lib/arena-projects";

export default function CommunityNavbar() {
  const pathname = usePathname();
  const { user, studentProfile, logout, loading } = useAuth();

  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [internshipOpen, setInternshipOpen] = useState(false);
  const [communityOpen, setCommunityOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
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
    { name: "My Learning & Projects", href: "/arena/my-learning", icon: BookOpen, desc: "Enrolled projects, 45-day commit progress & badges", locked: false, requiresAuth: true },
    { name: "45-Day Virtual AI Internship", href: "/virtual-ai-internship", icon: Sparkles, desc: "Curriculum, daily commit tracker & founder reviews", locked: false, requiresAuth: false },
    { name: `Internship Playground (${TOTAL_SYSTEMS_COUNT} PRDs)`, href: "/arena", icon: Layers, desc: "Explore production engineering systems", locked: false, requiresAuth: false },
    { name: "Submit Daily Log", href: "/arena/daily-log", icon: Terminal, desc: "Submit daily PoW & earn Karma Coins", locked: false, requiresAuth: true },
    { name: "20 Career Roadmaps", href: "/arena/roadmaps", icon: Compass, desc: "Progressive career paths for all roles", locked: false, requiresAuth: false },
    { name: "Career & LinkedIn Checklist", href: "/arena/career-checklist", icon: Briefcase, desc: "Profile checklist, templates & UGC composer", locked: false, requiresAuth: true },
    { name: "Propose Custom Project", href: "/arena/custom-project", icon: Edit3, desc: "Submit domain ideas for founder review", locked: false, requiresAuth: true }
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
    { name: "Platform Guide & Tour", href: "/product-tour", icon: BookOpen, desc: "Explore all 14 community engineering tools", locked: false, requiresAuth: false },
    { name: "Botmartz Karma Wallet", href: "/arena/wallet", icon: Coins, desc: "Redeem perks, compute grants & tip peers", locked: false, requiresAuth: true },
    { name: "Verified Certificates", href: "/certificates", icon: ShieldCheck, desc: "Cryptographically verifiable credentials", locked: false, requiresAuth: false },
    { name: "Magazine & Research", href: "/magazine", icon: Presentation, desc: "Deep engineering teardowns & whitepapers", locked: false, requiresAuth: false }
  ];

  const isInternshipActive =
    pathname.startsWith("/virtual-ai-internship") ||
    pathname.startsWith("/arena/roadmaps") ||
    pathname.startsWith("/arena/daily-log") ||
    pathname.startsWith("/arena/career-checklist") ||
    pathname.startsWith("/arena/custom-project");

  const isResourcesActive =
    pathname.startsWith("/product-tour") ||
    pathname.startsWith("/arena/wallet") ||
    pathname.startsWith("/certificates") ||
    pathname.startsWith("/magazine");

  const isTransparentHero = pathname === "/" && !isScrolled && !mobileOpen;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isTransparentHero
          ? "bg-transparent border-b border-transparent shadow-none"
          : "bg-[#162774]/95 backdrop-blur-xl border-b border-white/10 shadow-lg"
      }`}
    >
      <div className="w-full px-4 sm:px-8 lg:px-12 h-16 sm:h-20 flex items-center justify-between">
        
        {/* Brand Logo & Live Cohort Badge */}
        <Link href="/" prefetch={false} className="flex items-center gap-2.5 sm:gap-3.5 group shrink-0">
          <div className="relative w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center shrink-0 rounded-2xl bg-white/10 border border-white/20 group-hover:border-[#D9F83B] transition-all duration-300">
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
            <div className="font-black text-base sm:text-xl tracking-tight text-white flex items-center gap-1.5 sm:gap-2 font-sans">
              <span>BOTMARTZ</span>
              <span className="text-[#D9F83B] font-black text-xs sm:text-sm uppercase tracking-wide">
                AI WORKSHOP
              </span>
            </div>
            <div className="flex items-center gap-2 -mt-0.5">
              <span className="text-[10px] font-mono text-blue-200/80 tracking-wider uppercase font-bold hidden sm:inline-block">
                Production Engineering Cohort
              </span>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-400/15 text-emerald-300 font-mono text-[9px] font-bold border border-emerald-400/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live
              </span>
            </div>
          </div>
        </Link>

        {/* Desktop Pill Navigation */}
        <nav className="hidden lg:flex items-center gap-1.5 bg-white/10 p-1.5 rounded-full border border-white/15 font-sans text-xs font-bold shadow-sm backdrop-blur-md">
          
          {/* Home Pill */}
          <Link
            href="/"
            prefetch={false}
            className={`px-4 py-2 rounded-full transition-all duration-200 flex items-center gap-1.5 ${
              pathname === "/"
                ? "bg-[#D9F83B] text-slate-950 shadow-sm font-extrabold"
                : "text-blue-100 hover:text-white hover:bg-white/10"
            }`}
          >
            <Home size={14} />
            <span>Home</span>
          </Link>

          {/* My Learning Pill (Visible only after login) */}
          {mounted && user && (
            <Link
              href="/arena/my-learning"
              prefetch={false}
              className={`px-4 py-2 rounded-full transition-all duration-200 flex items-center gap-1.5 ${
                pathname === "/arena/my-learning"
                  ? "bg-[#D9F83B] text-slate-950 shadow-sm font-extrabold"
                  : "text-blue-100 hover:text-white hover:bg-white/10"
              }`}
            >
              <BookOpen size={14} />
              <span>My Learning</span>
            </Link>
          )}

          {/* 1. 50 Systems Catalog */}
          <Link
            href="/arena"
            prefetch={false}
            className={`px-4 py-2 rounded-full transition-all duration-200 flex items-center gap-1.5 ${
              pathname === "/arena"
                ? "bg-[#D9F83B] text-slate-950 shadow-sm font-extrabold"
                : "text-blue-100 hover:text-white hover:bg-white/10"
            }`}
          >
            <span>{TOTAL_SYSTEMS_COUNT} Systems</span>
          </Link>

          {/* 2. Online Hackathons */}
          <Link
            href="/hackathons"
            prefetch={false}
            className={`px-4 py-2 rounded-full transition-all duration-200 flex items-center gap-1.5 ${
              pathname === "/hackathons"
                ? "bg-[#D9F83B] text-slate-950 shadow-sm font-extrabold"
                : "text-blue-100 hover:text-white hover:bg-white/10"
            }`}
          >
            <span>Hackathons</span>
          </Link>

          {/* Workshops Pill */}
          <Link
            href="/workshops"
            prefetch={false}
            className={`px-4 py-2 rounded-full transition-all duration-200 flex items-center gap-1.5 ${
              pathname === "/workshops"
                ? "bg-[#D9F83B] text-slate-950 shadow-sm font-extrabold"
                : "text-blue-100 hover:text-white hover:bg-white/10"
            }`}
          >
            <span>Workshops</span>
          </Link>

          {/* About Us Pill */}
          <Link
            href="/about"
            prefetch={false}
            className={`px-4 py-2 rounded-full transition-all duration-200 flex items-center gap-1.5 ${
              pathname === "/about"
                ? "bg-[#D9F83B] text-slate-950 shadow-sm font-extrabold"
                : "text-blue-100 hover:text-white hover:bg-white/10"
            }`}
          >
            <span>About</span>
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
                isInternshipActive
                  ? "bg-[#D9F83B] text-slate-950 shadow-sm font-extrabold"
                  : internshipOpen
                  ? "bg-white/25 text-white shadow-sm font-extrabold ring-1 ring-white/30"
                  : "text-blue-100 hover:text-white hover:bg-white/10"
              }`}
            >
              <span>Internship</span>
              <ChevronDown
                size={13}
                className={`transition-transform duration-200 ${
                  internshipOpen ? "rotate-180" : ""
                } ${isInternshipActive ? "text-slate-950" : "text-blue-200 group-hover:text-white"}`}
              />
            </button>

            {internshipOpen && (
              <div className="absolute top-full left-0 mt-3 w-[340px] bg-white/98 backdrop-blur-2xl border border-[#1D3189]/15 rounded-2xl shadow-2xl shadow-[#070E54]/15 p-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="text-[10px] font-sans text-[#1D3189] uppercase font-extrabold tracking-widest px-3.5 py-2 border-b border-slate-100 mb-1.5 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D9F83B] ring-1 ring-[#1D3189]/30" />
                  <span>Virtual Internship Playground</span>
                </div>
                <div className="space-y-1">
                  {INTERNSHIP_ITEMS.filter(
                    (item) => !item.requiresAuth || (mounted && user)
                  ).map((item) => {
                    const itemActive =
                      item.href === "/arena"
                        ? pathname === "/arena"
                        : pathname === item.href || pathname.startsWith(item.href + "/");
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-200 group ${
                          itemActive
                            ? "bg-[#1D3189] text-white shadow-sm"
                            : "hover:bg-[#1D3189]"
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <div
                            className={`font-bold text-xs font-sans transition-colors flex items-center gap-2 ${
                              itemActive ? "text-white" : "text-slate-900 group-hover:text-white"
                            }`}
                          >
                            <span className="truncate">{item.name}</span>
                            {item.locked && (
                              <span className="flex items-center gap-0.5 text-[9px] font-mono text-amber-600 font-normal bg-amber-50 px-1.5 py-0.5 rounded-full border border-amber-200">
                                <Lock size={9} /> Scheduled
                              </span>
                            )}
                          </div>
                          <div
                            className={`text-[11px] font-sans font-normal mt-0.5 line-clamp-1 transition-colors ${
                              itemActive ? "text-blue-100/90" : "text-slate-500 group-hover:text-blue-100/85"
                            }`}
                          >
                            {item.desc}
                          </div>
                        </div>
                        <span
                          className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                            itemActive
                              ? "bg-[#D9F83B] text-slate-950"
                              : "bg-slate-100 group-hover:bg-[#D9F83B] text-slate-700 group-hover:text-slate-950"
                          }`}
                        >
                          <ArrowRight
                            size={13}
                            className={`transition-transform duration-300 ${
                              itemActive ? "-rotate-45" : "group-hover:-rotate-45"
                            }`}
                          />
                        </span>
                      </Link>
                    );
                  })}
                </div>
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
                isResourcesActive
                  ? "bg-[#D9F83B] text-slate-950 shadow-sm font-extrabold"
                  : resourcesOpen
                  ? "bg-white/25 text-white shadow-sm font-extrabold ring-1 ring-white/30"
                  : "text-blue-100 hover:text-white hover:bg-white/10"
              }`}
            >
              <span>Resources</span>
              <ChevronDown
                size={13}
                className={`transition-transform duration-200 ${
                  resourcesOpen ? "rotate-180" : ""
                } ${isResourcesActive ? "text-slate-950" : "text-blue-200 group-hover:text-white"}`}
              />
            </button>

            {resourcesOpen && (
              <div className="absolute top-full left-0 mt-3 w-[340px] bg-white/98 backdrop-blur-2xl border border-[#1D3189]/15 rounded-2xl shadow-2xl shadow-[#070E54]/15 p-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="text-[10px] font-sans text-[#1D3189] uppercase font-extrabold tracking-widest px-3.5 py-2 border-b border-slate-100 mb-1.5 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D9F83B] ring-1 ring-[#1D3189]/30" />
                  <span>Developer Resources &amp; Credentials</span>
                </div>
                <div className="space-y-1">
                  {RESOURCE_ITEMS.filter(
                    (item) => !item.requiresAuth || (mounted && user)
                  ).map((item) => {
                    const itemActive =
                      pathname === item.href || pathname.startsWith(item.href + "/");
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-200 group ${
                          itemActive
                            ? "bg-[#1D3189] text-white shadow-sm"
                            : "hover:bg-[#1D3189]"
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <div
                            className={`font-bold text-xs font-sans transition-colors truncate ${
                              itemActive ? "text-white" : "text-slate-900 group-hover:text-white"
                            }`}
                          >
                            {item.name}
                          </div>
                          <div
                            className={`text-[11px] font-sans font-normal mt-0.5 line-clamp-1 transition-colors ${
                              itemActive ? "text-blue-100/90" : "text-slate-500 group-hover:text-blue-100/85"
                            }`}
                          >
                            {item.desc}
                          </div>
                        </div>
                        <span
                          className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                            itemActive
                              ? "bg-[#D9F83B] text-slate-950"
                              : "bg-slate-100 group-hover:bg-[#D9F83B] text-slate-700 group-hover:text-slate-950"
                          }`}
                        >
                          <ArrowRight
                            size={13}
                            className={`transition-transform duration-300 ${
                              itemActive ? "-rotate-45" : "group-hover:-rotate-45"
                            }`}
                          />
                        </span>
                      </Link>
                    );
                  })}
                </div>
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
            <div className="flex items-center gap-2.5 font-sans text-xs">
              <Link
                href="/login?mode=signup"
                className="px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold transition-all cursor-pointer border border-white/20"
              >
                Sign Up
              </Link>
              <Link
                href="/login?mode=signin"
                className="px-5 py-2.5 rounded-full bg-[#D9F83B] hover:bg-[#e5ff59] text-slate-950 font-sans text-xs sm:text-sm font-bold transition-all duration-200 shadow-md shadow-lime-400/15 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>


        {/* Mobile Menu Toggle Button */}
        <div className="lg:hidden flex items-center gap-2">
          {mounted && user && (
            <Link href="/profile" className="p-2 text-blue-100 hover:text-white">
              <User size={20} />
            </Link>
          )}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2.5 rounded-full border border-white/20 hover:bg-white/10 text-white"
            aria-label="Toggle Menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-[#F4F6FB] border-b border-slate-200 px-4 pt-4 pb-8 space-y-4 font-sans text-xs max-h-[85vh] overflow-y-auto shadow-2xl">
          {/* Primary Navigation Grid (2-column pairs with 60deg circle arrows) */}
          <div className="grid grid-cols-2 gap-2">
            {[
              { href: "/", label: "Home", icon: <Home size={14} /> },
              { href: "/arena", label: `${TOTAL_SYSTEMS_COUNT} Systems`, icon: <Layers size={14} /> },
              { href: "/hackathons", label: "Hackathons", icon: <Award size={14} /> },
              { href: "/workshops", label: "Workshops", icon: <Calendar size={14} /> },
              { href: "/about", label: "About Us", icon: <Globe size={14} /> },
              ...(mounted && user
                ? [{ href: "/arena/my-learning", label: "My Learning", icon: <BookOpen size={14} /> }]
                : []),
            ].map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`group flex items-center justify-between gap-2 p-3 rounded-2xl border transition-all duration-300 ${
                    active
                      ? "bg-[#162774] text-white border-[#162774] shadow-md"
                      : "bg-white text-slate-900 border-slate-200/90 hover:border-[#162774]"
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={active ? "text-[#D9F83B]" : "text-[#162774]"}>
                      {item.icon}
                    </span>
                    <span className="font-extrabold text-xs truncate">{item.label}</span>
                  </div>
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-colors duration-300 ${
                      active
                        ? "bg-[#D9F83B] text-slate-950"
                        : "bg-slate-100 group-hover:bg-[#162774] text-[#162774] group-hover:text-[#D9F83B]"
                    }`}
                  >
                    <ArrowRight
                      size={12}
                      className="transition-transform duration-300 group-hover:rotate-[60deg]"
                    />
                  </span>
                </Link>
              );
            })}
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/90 p-3 space-y-1.5">
            <div className="text-[10px] font-sans text-[#162774] uppercase font-extrabold tracking-widest px-1.5 py-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D9F83B] ring-1 ring-[#162774]/30" />
              <span>Virtual AI Internship &amp; Arena</span>
            </div>
            <div className="grid grid-cols-1 gap-1">
              {INTERNSHIP_ITEMS.filter(
                (item) => !item.requiresAuth || (mounted && user)
              ).map((item) => {
                const active =
                  item.href === "/arena"
                    ? pathname === "/arena"
                    : pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`group flex items-center justify-between gap-2 px-3 py-2 rounded-xl transition-all duration-200 ${
                      active
                        ? "bg-[#162774] text-white"
                        : "text-slate-800 hover:bg-slate-50"
                    }`}
                  >
                    <span className="font-bold text-xs truncate">{item.name}</span>
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-colors duration-300 ${
                        active
                          ? "bg-[#D9F83B] text-slate-950"
                          : "bg-slate-100 group-hover:bg-[#162774] text-[#162774] group-hover:text-[#D9F83B]"
                      }`}
                    >
                      <ArrowRight
                        size={11}
                        className="transition-transform duration-300 group-hover:rotate-[60deg]"
                      />
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/90 p-3 space-y-1.5">
            <div className="text-[10px] font-sans text-[#162774] uppercase font-extrabold tracking-widest px-1.5 py-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D9F83B] ring-1 ring-[#162774]/30" />
              <span>Resources &amp; Credentials</span>
            </div>
            <div className="grid grid-cols-1 gap-1">
              {RESOURCE_ITEMS.filter(
                (item) => !item.requiresAuth || (mounted && user)
              ).map((item) => {
                const active = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`group flex items-center justify-between gap-2 px-3 py-2 rounded-xl transition-all duration-200 ${
                      active
                        ? "bg-[#162774] text-white"
                        : "text-slate-800 hover:bg-slate-50"
                    }`}
                  >
                    <span className="font-bold text-xs truncate">{item.name}</span>
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-colors duration-300 ${
                        active
                          ? "bg-[#D9F83B] text-slate-950"
                          : "bg-slate-100 group-hover:bg-[#162774] text-[#162774] group-hover:text-[#D9F83B]"
                      }`}
                    >
                      <ArrowRight
                        size={11}
                        className="transition-transform duration-300 group-hover:rotate-[60deg]"
                      />
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="pt-1">
            {!mounted || loading ? (
              <div className="py-2.5 text-center text-slate-400 font-mono text-xs animate-pulse">Authenticating session...</div>
            ) : user ? (
              <div className="grid grid-cols-2 gap-2.5">
                <Link
                  href="/profile"
                  onClick={() => setMobileOpen(false)}
                  className="group py-3 px-4 rounded-2xl bg-[#162774] text-white font-extrabold text-xs flex items-center justify-between gap-2 shadow-sm"
                >
                  <span>My Profile</span>
                  <span className="w-6 h-6 rounded-full bg-[#D9F83B] text-slate-950 flex items-center justify-center shrink-0">
                    <ArrowRight size={11} className="transition-transform duration-300 group-hover:rotate-[60deg]" />
                  </span>
                </Link>
                <button
                  onClick={() => logout()}
                  className="py-3 px-4 rounded-2xl bg-white border border-rose-200 text-rose-600 font-extrabold text-xs cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2.5">
                <Link
                  href="/login?mode=signup"
                  onClick={() => setMobileOpen(false)}
                  className="group py-3 px-4 rounded-2xl bg-[#162774] text-white font-extrabold text-xs flex items-center justify-between gap-2 shadow-sm"
                >
                  <span>Sign Up</span>
                  <span className="w-6 h-6 rounded-full bg-[#D9F83B] text-slate-950 flex items-center justify-center shrink-0">
                    <ArrowRight size={11} className="transition-transform duration-300 group-hover:rotate-[60deg]" />
                  </span>
                </Link>
                <Link
                  href="/login?mode=signin"
                  onClick={() => setMobileOpen(false)}
                  className="group py-3 px-4 rounded-2xl bg-[#D9F83B] text-slate-950 font-extrabold text-xs flex items-center justify-between gap-2 shadow-sm"
                >
                  <span>Sign In</span>
                  <span className="w-6 h-6 rounded-full bg-slate-950 text-[#D9F83B] flex items-center justify-center shrink-0">
                    <ArrowRight size={11} className="transition-transform duration-300 group-hover:rotate-[60deg]" />
                  </span>
                </Link>
              </div>
            )}
          </div>

        </div>
      )}

    </header>
  );
}
