"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import NewsletterForm from "@/components/NewsletterForm";

const FOOTER_LINK_CLASS =
  "group/link inline-flex items-center gap-2 text-sm font-medium text-blue-100/80 group-hover/card:text-slate-700 hover:!text-slate-950 hover:font-semibold hover:translate-x-1.5 transition-all duration-200 cursor-pointer";

const FOOTER_COLUMNS = [
  {
    title: "Virtual Internship",
    links: [
      { label: "Virtual AI Internship", href: "/virtual-ai-internship" },
      { label: "59+ System PRD Catalog", href: "/arena" },
      { label: "Daily Standup & Proof-of-Work", href: "/arena/daily-log" },
      { label: "Platform & Product Tour", href: "/product-tour" },
      { label: "Propose Custom Blueprint", href: "/arena/custom-project" },
      { label: "Stage-by-Stage Roadmaps", href: "/arena/roadmaps" },
    ],
  },
  {
    title: "Career OS & Bounties",
    links: [
      { label: "Student Karma Wallet", href: "/arena/wallet" },
      { label: "Blocker Bounty Board", href: "/arena/bounties" },
      { label: "Career & LinkedIn Strategy", href: "/arena/career-checklist" },
      { label: "Squad Matchmaking", href: "/arena/collaborate" },
      { label: "Proof-of-Work Showcases", href: "/showcase" },
    ],
  },
  {
    title: "Community & Summits",
    links: [
      { label: "AI Summits & Conferences", href: "/events" },
      { label: "Discussions & Technical Q&A", href: "/discussions" },
      { label: "Hands-on Workshops", href: "/workshops" },
      { label: "Developer Magazine", href: "/magazine" },
      { label: "Verify Student Credentials", href: "/certificates" },
    ],
  },
];

export default function CommunityFooter() {
  return (
    <footer
      className="w-full bg-[#070E54] text-blue-100/85 font-sans border-t border-white/10 relative overflow-hidden"
      style={{
        backgroundImage:
          "linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px)",
        backgroundSize: "72px 72px",
      }}
    >
      {/* Main 4-Column Navigation */}
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 py-12 sm:py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Column 1: Brand Info */}
          <div className="flex flex-col justify-between gap-6">
            <div className="space-y-4">
              <Link href="/" className="flex items-center gap-3 group w-fit">
                <div className="relative w-11 h-11 flex items-center justify-center shrink-0 rounded-xl bg-white/10 border border-white/15 group-hover:border-[#D9F83B] transition-colors">
                  <Image
                    src="/logo.png"
                    alt="Botmartz Logo"
                    width={34}
                    height={34}
                    className="object-contain"
                  />
                </div>
                <div>
                  <div className="font-extrabold text-white text-lg tracking-tight font-sans">BOTMARTZ</div>
                  <div className="text-[11px] text-blue-200/80 font-semibold uppercase tracking-widest -mt-0.5">
                    Builders Community
                  </div>
                </div>
              </Link>

              <p className="text-blue-100/80 text-sm font-sans leading-relaxed">
                <strong className="text-white font-semibold">Build. Ship. Learn. Connect.</strong> Strictly for authentic builders constructing frontier production architectures in AI and Systems.
              </p>
            </div>

            <div className="pt-5 border-t border-white/10">
              <NewsletterForm variant="footer" />
            </div>
          </div>

          {/* Columns 2, 3, 4 */}
          {FOOTER_COLUMNS.map((col, idx) => {
            const isDefaultWhite = idx === 0;
            return (
              <div
                key={col.title}
                className={`group/card space-y-4 rounded-2xl border p-6 transition-all duration-300 ${
                  isDefaultWhite
                    ? "bg-white border-white shadow-2xl"
                    : "bg-white/[0.03] hover:bg-white border-white/10 hover:border-white shadow-sm hover:shadow-2xl"
                }`}
              >
                <h4
                  className={`font-bold uppercase text-xs tracking-widest font-sans flex items-center justify-between gap-2 pb-3 border-b transition-colors duration-300 ${
                    isDefaultWhite
                      ? "text-slate-950 border-slate-200"
                      : "text-white group-hover/card:text-slate-950 border-white/10 group-hover/card:border-slate-200"
                  }`}
                >
                  <span className="inline-flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                        isDefaultWhite
                          ? "bg-[#1D3189]"
                          : "bg-[#D9F83B] group-hover/card:bg-[#1D3189]"
                      }`}
                    />
                    <span>{col.title}</span>
                  </span>
                  <span
                    className={`w-7 h-7 rounded-full inline-flex items-center justify-center shrink-0 transition-all duration-300 ${
                      isDefaultWhite
                        ? "bg-[#D9F83B] text-slate-950"
                        : "bg-white/10 group-hover/card:bg-[#D9F83B] text-white group-hover/card:text-slate-950"
                    }`}
                  >
                    <ArrowRight size={13} className="transition-transform duration-300 group-hover/card:-rotate-[50deg]" />
                  </span>
                </h4>
                <ul className="space-y-3 font-sans">
                  {col.links.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={
                          isDefaultWhite
                            ? "group/link inline-flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-slate-950 hover:font-semibold hover:translate-x-1.5 transition-all duration-200 cursor-pointer"
                            : FOOTER_LINK_CLASS
                        }
                      >
                        <span>{item.label}</span>
                        <ArrowRight
                          size={13}
                          className="opacity-0 -translate-x-1 group-hover/link:opacity-100 group-hover/link:translate-x-0 group-hover/link:-rotate-[50deg] text-[#1D3189] transition-all duration-200"
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      {/* Social Links Row */}
      <div className="border-t border-white/10 py-4 w-full relative z-10">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm font-sans">
          <div className="flex flex-wrap items-center gap-3 text-blue-100/80">
            <span className="text-white font-semibold mr-1">Connect Official:</span>
            <a
              href="https://www.linkedin.com/company/botmartz-ai-solutions"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-full bg-white hover:bg-[#D9F83B] text-[#162774] hover:text-slate-950 border border-white hover:border-[#D9F83B] shadow-sm transition-all duration-200 font-bold text-xs cursor-pointer"
            >
              Botmartz LinkedIn
            </a>
            <a
              href="https://www.linkedin.com/in/soham-sharma/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-full bg-white hover:bg-[#D9F83B] text-[#162774] hover:text-slate-950 border border-white hover:border-[#D9F83B] shadow-sm transition-all duration-200 font-bold text-xs cursor-pointer"
            >
              Soham Sharma (Founder)
            </a>
            <a
              href="https://x.com/botmartz"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-full bg-white hover:bg-[#D9F83B] text-[#162774] hover:text-slate-950 border border-white hover:border-[#D9F83B] shadow-sm transition-all duration-200 font-bold text-xs cursor-pointer"
            >
              Official X
            </a>
            <a
              href="https://twitter.com/sohamsharma"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-full bg-white hover:bg-[#D9F83B] text-[#162774] hover:text-slate-950 border border-white hover:border-[#D9F83B] shadow-sm transition-all duration-200 font-bold text-xs cursor-pointer"
            >
              Soham X
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 py-5 w-full relative z-10">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-blue-100/75 text-xs font-sans">
          <div>
            <span>© 2026 Botmartz Community. Governed by Founder Soham Sharma.</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <span className="flex items-center gap-1.5 text-white font-medium">
              <span className="w-2 h-2 rounded-full bg-[#D9F83B] animate-pulse" />
              <span>Zero-Trust Security WAF Active</span>
            </span>
            <span className="text-white/20">•</span>
            <Link href="/refund-policy" className="text-blue-100 hover:text-[#D9F83B] transition-colors font-medium cursor-pointer">
              Refund Policy
            </Link>
            <span className="text-white/20">•</span>
            <Link href="/product-tour" className="hover:text-[#D9F83B] transition-colors cursor-pointer">
              Platform Tour
            </Link>
            <span className="text-white/20">•</span>
            <Link href="/login" className="hover:text-[#D9F83B] transition-colors cursor-pointer">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
