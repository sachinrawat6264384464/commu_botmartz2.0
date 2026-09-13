"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, Diamond } from "lucide-react";

export default function CommunityHubPage() {
  return (
    <div className="min-h-screen bg-[#040914] text-white font-sans selection:bg-[#0066FF] selection:text-white">
      
      {/* SECTION 1: HERO (DARK THEME) */}
      <section className="relative pt-28 pb-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800/60 overflow-hidden bg-[#040914]">
        {/* Subtle grid pattern background overlay */}
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#38bdf8 1px, transparent 1px)`,
            backgroundSize: `28px 28px`
          }}
        />

        {/* Glow Effects */}
        <div className="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#0066FF]/15 rounded-full blur-[140px] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs text-slate-400 mb-8 font-medium">
            <Link href="/" className="hover:text-slate-200 transition-colors">Home</Link>
            <span className="text-slate-600">›</span>
            <span className="text-slate-200 font-semibold">Community</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Content (Col 7) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-block text-[#00B8F0] font-mono text-xs font-bold uppercase tracking-widest">
                BOTMARTZ AI ENGINEERING COMMUNITY
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
                One Community.<br />
                <span className="text-[#00B8F0]">Many Ways to Build.</span>
              </h1>

              <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl font-normal">
                Launched at AI Frontier 2026 — meetups, a Discord, an open-source GitHub org, a reading club and hackathons, all in one place for engineers who want to build, not just watch.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href="https://discord.gg/QfxuHQAZz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-7 py-3.5 rounded-xl bg-[#0066FF] hover:bg-[#0052CC] text-white font-semibold text-sm tracking-wide transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2 group cursor-pointer"
                >
                  <span>Join the Discord</span>
                  <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                </a>

                <Link
                  href="/community/events"
                  className="px-6 py-3.5 rounded-xl bg-[#0B132B]/80 hover:bg-[#111A38] text-white border border-slate-700/80 font-semibold text-sm transition-all flex items-center gap-2 cursor-pointer"
                >
                  See Upcoming Events
                </Link>
              </div>
            </div>

            {/* Right Stats Grid (2x2) (Col 5) */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              
              {/* Stat 1 */}
              <div className="p-6 sm:p-7 rounded-2xl bg-[#0B132B]/70 border border-slate-800/80 backdrop-blur-sm flex flex-col justify-center">
                <div className="text-4xl sm:text-5xl font-extrabold text-[#00B8F0] tracking-tight">
                  5
                </div>
                <div className="text-slate-400 text-xs sm:text-sm font-medium mt-2">
                  Community Pillars
                </div>
              </div>

              {/* Stat 2 */}
              <div className="p-6 sm:p-7 rounded-2xl bg-[#0B132B]/70 border border-slate-800/80 backdrop-blur-sm flex flex-col justify-center">
                <div className="text-4xl sm:text-5xl font-extrabold text-[#00B8F0] tracking-tight">
                  2026
                </div>
                <div className="text-slate-400 text-xs sm:text-sm font-medium mt-2">
                  Community Launch
                </div>
              </div>

              {/* Stat 3 */}
              <div className="p-6 sm:p-7 rounded-2xl bg-[#0B132B]/70 border border-slate-800/80 backdrop-blur-sm flex flex-col justify-center">
                <div className="text-4xl sm:text-5xl font-extrabold text-[#00B8F0] tracking-tight">
                  6+
                </div>
                <div className="text-slate-400 text-xs sm:text-sm font-medium mt-2">
                  Events / Year
                </div>
              </div>

              {/* Stat 4 */}
              <div className="p-6 sm:p-7 rounded-2xl bg-[#0B132B]/70 border border-slate-800/80 backdrop-blur-sm flex flex-col justify-center">
                <div className="text-4xl sm:text-5xl font-extrabold text-[#00B8F0] tracking-tight">
                  100+
                </div>
                <div className="text-slate-400 text-xs sm:text-sm font-medium mt-2">
                  Members &amp; Growing
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* FEATURED HACKATHON & CAMPUS TOUR SPOTLIGHT BANNER */}
      <section className="py-5 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-rose-950 via-slate-900 to-slate-950 border-b border-rose-500/30 text-white font-mono text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-rose-600 text-white font-bold uppercase tracking-wider text-[10px] shrink-0">
              FEATURED HACKATHON
            </span>
            <span className="text-slate-200 font-sans text-xs sm:text-sm">
              <strong className="text-white">HACK IT BROS &apos;26:</strong> SlowBros LABS &times; Technical Partner: Botmartz AI Solutions (Sept 20)
            </span>
          </div>
          <Link
            href="/community/events"
            className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold transition-all shadow-md shrink-0 flex items-center gap-1.5"
          >
            <span>Scan QR Pass &amp; Details &rarr;</span>
          </Link>
        </div>
      </section>
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#F8FAFC] text-slate-900">
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="text-center space-y-2 mb-14">
            <div className="text-[#0066FF] font-bold text-xs uppercase tracking-widest">
              SIX PILLARS
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Everything Under One Roof
            </h2>
          </div>

          {/* 6 Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            
            {/* Card 1: Monthly Meetups */}
            <div className="bg-white rounded-2xl p-7 sm:p-8 border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#0066FF] font-bold text-xs flex items-center justify-center uppercase tracking-wider">
                  MU
                </div>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-[#0066FF] transition-colors">
                  Monthly Meetups
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  In-person sessions in Indore for engineers to share projects and production lessons.
                </p>
              </div>
              <div className="pt-6">
                <Link
                  href="/community/events"
                  className="text-[#0066FF] font-semibold text-sm inline-flex items-center gap-1 hover:underline"
                >
                  <span>See meetups</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Card 2: Discord */}
            <div className="bg-white rounded-2xl p-7 sm:p-8 border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#0066FF] font-bold text-xs flex items-center justify-center uppercase tracking-wider">
                  DC
                </div>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-[#0066FF] transition-colors">
                  Discord
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  The daily home for questions, job posts, and project feedback.
                </p>
              </div>
              <div className="pt-6">
                <a
                  href="https://discord.gg/QfxuHQAZz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#0066FF] font-semibold text-sm inline-flex items-center gap-1 hover:underline"
                >
                  <span>Join server</span>
                  <ArrowRight size={14} />
                </a>
              </div>
            </div>

            {/* Card 3: Open-Source GitHub Org */}
            <div className="bg-white rounded-2xl p-7 sm:p-8 border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#0066FF] font-bold text-xs flex items-center justify-center uppercase tracking-wider">
                  GH
                </div>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-[#0066FF] transition-colors">
                  Open-Source GitHub Org
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Community-maintained tools and starter kits for AI engineers.
                </p>
              </div>
              <div className="pt-6">
                <a
                  href="https://github.com/botmartz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#0066FF] font-semibold text-sm inline-flex items-center gap-1 hover:underline"
                >
                  <span>View org</span>
                  <ArrowRight size={14} />
                </a>
              </div>
            </div>

            {/* Card 4: Reading Club */}
            <div className="bg-white rounded-2xl p-7 sm:p-8 border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#0066FF] font-bold text-xs flex items-center justify-center uppercase tracking-wider">
                  RC
                </div>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-[#0066FF] transition-colors">
                  Reading Club
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  A biweekly deep dive into papers and posts shaping AI engineering.
                </p>
              </div>
              <div className="pt-6">
                <a
                  href="https://discord.gg/QfxuHQAZz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#0066FF] font-semibold text-sm inline-flex items-center gap-1 hover:underline"
                >
                  <span>Read along</span>
                  <ArrowRight size={14} />
                </a>
              </div>
            </div>

            {/* Card 5: Hackathons */}
            <div className="bg-white rounded-2xl p-7 sm:p-8 border-2 border-rose-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group relative overflow-hidden">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-lg bg-rose-100 text-rose-600 font-bold text-xs flex items-center justify-center uppercase tracking-wider">
                  HK
                </div>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-rose-600 transition-colors">
                  Hackathons &amp; Build Sprints
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Featured Hackathon: <strong>HACK IT BROS &apos;26</strong> (SlowBros LABS x Botmartz AI Solutions) on Sept 20.
                </p>
              </div>
              <div className="pt-6">
                <Link
                  href="/community/events"
                  className="text-rose-600 font-semibold text-sm inline-flex items-center gap-1 hover:underline"
                >
                  <span>Explore Hackathons &amp; Scan QR Pass &rarr;</span>
                </Link>
              </div>
            </div>

            {/* Card 6: Newsletter */}
            <div className="bg-white rounded-2xl p-7 sm:p-8 border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#0066FF] font-bold text-xs flex items-center justify-center uppercase tracking-wider">
                  NL
                </div>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-[#0066FF] transition-colors">
                  Newsletter
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  A monthly roundup of community highlights, jobs and events.
                </p>
              </div>
              <div className="pt-6">
                <a
                  href="https://discord.gg/QfxuHQAZz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#0066FF] font-semibold text-sm inline-flex items-center gap-1 hover:underline"
                >
                  <span>Subscribe</span>
                  <ArrowRight size={14} />
                </a>
              </div>
            </div>

          </div>

          {/* SECTION 3: SCORECARD & DISCORD CTA */}
          <div className="mt-16 space-y-8">
            
            {/* Dark Scorecard Card */}
            <div className="bg-[#060D1E] rounded-3xl p-8 sm:p-12 border border-slate-800 text-white shadow-2xl relative overflow-hidden">
              <div className="text-[#00B8F0] font-mono text-xs font-bold uppercase tracking-widest mb-3">
                COMMUNITY SCORECARD
              </div>
              
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                How We Measure Success
              </h2>

              <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-3xl leading-relaxed">
                We track this community on three separate scorecards — never just the commercial one.
              </p>

              {/* Divider Line */}
              <div className="w-full h-px bg-slate-800/90 my-8" />

              {/* 3 Columns */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
                <div className="space-y-2">
                  <h4 className="text-lg font-bold text-white">
                    Community
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    Satisfaction, repeat attendance, and steady member growth.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-lg font-bold text-white">
                    Brand
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    Reach, followers, traffic, GitHub activity, and speaker relationships.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-lg font-bold text-white">
                    Commercial
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    Discovery calls, follow-up meetings, pilots and partnerships — over time.
                  </p>
                </div>
              </div>
            </div>

            {/* White Banner CTA Card */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-50 text-[#0066FF] flex items-center justify-center shrink-0">
                  <Diamond size={20} className="fill-[#0066FF]/20 text-[#0066FF]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Not on Discord Yet?
                  </h3>
                  <p className="text-sm text-slate-600 mt-0.5">
                    Join hundreds of AI engineers already sharing projects, jobs and ideas.
                  </p>
                </div>
              </div>

              <a
                href="https://discord.gg/QfxuHQAZz"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 rounded-xl bg-[#0066FF] hover:bg-[#0052CC] text-white font-semibold text-sm transition-all shadow-md shadow-blue-500/20 flex items-center gap-2 shrink-0 cursor-pointer"
              >
                <span>Join the Discord</span>
                <ArrowRight size={16} />
              </a>

            </div>

            {/* Official Social Links Card */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
              <div className="text-xs font-bold text-[#0066FF] uppercase tracking-wider mb-2">
                OFFICIAL CONNECT &amp; CHANNELS
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-4">
                Follow Botmartz &amp; Founder Soham Sharma
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-semibold">
                <a
                  href="https://www.linkedin.com/company/botmartz-ai-solutions"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 text-slate-700 hover:text-[#0066FF] flex items-center gap-2.5 transition-all"
                >
                  <div className="w-7 h-7 rounded-lg bg-blue-100 text-[#0066FF] font-bold flex items-center justify-center text-[10px]">in</div>
                  <span>Botmartz LinkedIn Page</span>
                </a>

                <a
                  href="https://www.linkedin.com/in/soham-sharma/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 text-slate-700 hover:text-[#0066FF] flex items-center gap-2.5 transition-all"
                >
                  <div className="w-7 h-7 rounded-lg bg-blue-100 text-[#0066FF] font-bold flex items-center justify-center text-[10px]">in</div>
                  <span>Soham Sharma (Founder)</span>
                </a>

                <a
                  href="https://x.com/botmartz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 text-slate-700 hover:text-[#0066FF] flex items-center gap-2.5 transition-all"
                >
                  <div className="w-7 h-7 rounded-lg bg-slate-900 text-white font-bold flex items-center justify-center text-[10px]">𝕏</div>
                  <span>Botmartz Official X</span>
                </a>

                <a
                  href="https://twitter.com/sohamsharma"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 text-slate-700 hover:text-[#0066FF] flex items-center gap-2.5 transition-all"
                >
                  <div className="w-7 h-7 rounded-lg bg-slate-900 text-white font-bold flex items-center justify-center text-[10px]">𝕏</div>
                  <span>Soham Sharma X</span>
                </a>
              </div>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}

