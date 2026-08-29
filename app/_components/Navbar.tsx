"use client";

import React, { useState } from "react";
import Link from "next/link";
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
  Image as ImageIcon
} from "lucide-react";

export default function CommunityNavbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  const PRIMARY_LINKS = [
    { name: "Events", href: "/events" },
    { name: "Discussions", href: "/discussions" },
    { name: "Showcase", href: "/showcase" },
    { name: "Challenges", href: "/challenges" },
  ];

  const DROPDOWN_LINKS = [
    { name: "AI Bootcamps & Cohorts", href: "/workshops", icon: BookOpen, desc: "Hands-on engineering workshops" },
    { name: "Leaderboard & Hall of Fame", href: "/leaderboard", icon: Trophy, desc: "Top builders & karma ranks" },
    { name: "Verify Certificates", href: "/certificates", icon: Award, desc: "Official credential verification" },
    { name: "Community Photo Wall", href: "/gallery", icon: ImageIcon, desc: "Summit & meetup memories" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#0066FF] flex items-center justify-center font-bold font-mono text-white text-base shadow-sm">
            B
          </div>
          <div>
            <div className="font-bold text-slate-900 tracking-tight text-base leading-none">
              BOTMARTZ
            </div>
            <div className="font-mono text-[10px] text-[#0066FF] tracking-wider uppercase font-semibold mt-1">
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

          {/* More Dropdown */}
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

        {/* Right CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/events/ai-frontier-2026"
            className="bg-[#0066FF] hover:bg-[#0052CC] text-white px-5 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all shadow-sm flex items-center gap-2"
          >
            <span>AI Frontier 2026</span>
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
          <div className="pt-4 border-t border-slate-100">
            <Link
              href="/events/ai-frontier-2026"
              onClick={() => setMobileOpen(false)}
              className="w-full block bg-[#0066FF] text-white text-center py-3 rounded-xl text-xs font-bold uppercase tracking-wider"
            >
              Get Summit Pass →
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
