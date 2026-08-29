"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Sparkles, 
  Calendar, 
  Award, 
  Image, 
  Menu, 
  X, 
  ArrowRight, 
  MessageSquare, 
  Code2, 
  Trophy, 
  Zap,
  Flame
} from "lucide-react";

const NAV_LINKS = [
  { name: "Events", href: "/events", badge: "AI Summit" },
  { name: "Discussions", href: "/discussions", badge: "Hot" },
  { name: "Showcase", href: "/showcase", badge: "New" },
  { name: "Challenges", href: "/challenges" },
  { name: "Leaderboard", href: "/leaderboard" },
  { name: "Bootcamps", href: "/workshops" },
  { name: "Certificates", href: "/certificates" },
  { name: "Gallery", href: "/gallery" },
];

export default function CommunityNavbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#050B14]/85 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0066FF] to-[#00B8F0] flex items-center justify-center font-bold font-mono text-white text-lg shadow-[0_0_20px_rgba(0,102,255,0.5)]">
            B
          </div>
          <div>
            <div className="font-bold text-white tracking-tight text-base leading-none flex items-center gap-1.5">
              <span>BOTMARTZ</span>
              <span className="px-1.5 py-0.5 rounded-full bg-[#00B8F0]/20 text-[#00B8F0] font-mono text-[9px] font-bold">HUB</span>
            </div>
            <div className="font-mono text-[10px] text-[#00B8F0] tracking-widest uppercase font-semibold mt-1">
              BUILDER COMMUNITY
            </div>
          </div>
        </Link>

        {/* Desktop Links */}
        <nav className="hidden xl:flex items-center gap-6">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative text-xs font-mono tracking-wider transition-colors flex items-center gap-1.5 ${
                  active ? "text-[#00B8F0] font-bold" : "text-slate-300 hover:text-white"
                }`}
              >
                <span>{link.name}</span>
                {link.badge && (
                  <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                    link.badge === 'Hot' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                    link.badge === 'New' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                    'bg-[#0066FF]/20 text-[#60A5FA]'
                  }`}>
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/discussions"
            className="px-3.5 py-2 rounded-xl bg-[#0B1524] border border-white/10 hover:border-[#00B8F0]/50 text-slate-300 hover:text-white font-mono text-xs transition-all flex items-center gap-1.5"
          >
            <MessageSquare size={13} className="text-[#00B8F0]" />
            <span>Join Chat</span>
          </Link>

          <Link
            href="/events/ai-frontier-2026"
            className="bg-[#0066FF] hover:bg-[#0052CC] text-white px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(0,102,255,0.4)] flex items-center gap-2"
          >
            <Flame size={14} className="text-amber-300 animate-pulse" />
            <span>Summit Pass</span>
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="xl:hidden p-2 text-slate-400 hover:text-white"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="xl:hidden bg-[#070E1B] border-b border-white/10 px-6 py-6 space-y-4">
          <nav className="flex flex-col space-y-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-sm font-mono text-slate-300 hover:text-white py-2 flex items-center justify-between"
              >
                <span>{link.name}</span>
                {link.badge && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#0066FF]/20 text-[#60A5FA]">
                    {link.badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>
          <div className="pt-4 border-t border-white/10 space-y-2">
            <Link
              href="/events/ai-frontier-2026"
              onClick={() => setMobileOpen(false)}
              className="w-full block bg-[#0066FF] text-white text-center py-3 rounded-xl text-xs font-mono font-bold uppercase"
            >
              Get AI Frontier 2026 Pass →
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
