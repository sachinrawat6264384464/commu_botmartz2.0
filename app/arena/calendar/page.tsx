"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  MapPin,
  Video,
  Users,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  Coffee,
  MessageSquare,
  Loader2,
  Check,
  AlertCircle,
  Flag,
  Flame,
  Award,
  Layers,
  Terminal
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import AuthGate from "@/app/_components/AuthGate";

interface CalendarEvent {
  id?: string;
  title: string;
  dayTime: string;
  type: string;
  location: string;
  desc: string;
  badge: string;
  badgeColor: string;
  lumaLink?: string;
  category?: "RITUAL" | "HOLIDAY" | "MILESTONE";
}

export default function ArenaCalendarPage() {
  const { user, studentProfile } = useAuth();
  const [customEvents, setCustomEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [rsvpd, setRsvpd] = useState(false);
  const [rsvpCount, setRsvpCount] = useState(42);
  const [enrolledProjects, setEnrolledProjects] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"ALL" | "RITUALS" | "PERSONAL" | "INDIAN_HOLIDAYS">("ALL");

  useEffect(() => {
    fetch("/api/arena/calendar")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.events) {
          setCustomEvents(data.events);
        }
      })
      .catch((e) => console.warn("Failed to load custom events:", e))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (user?.email) {
      fetch(`/api/arena/enroll?email=${encodeURIComponent(user.email)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setEnrolledProjects(data.enrollments || []);
          }
        })
        .catch(() => {});
    }
  }, [user?.email]);

  // Earliest enrollment timestamp
  const earliestEnrollmentDate = useMemo(() => {
    if (!enrolledProjects || enrolledProjects.length === 0) {
      return studentProfile?.createdAt ? new Date(studentProfile.createdAt).getTime() : Date.now();
    }
    const dates = enrolledProjects
      .map((p) => (p.createdAt ? new Date(p.createdAt).getTime() : null))
      .filter((t): t is number => Boolean(t && !isNaN(t)));
    if (dates.length === 0) return Date.now();
    return Math.min(...dates);
  }, [enrolledProjects, studentProfile]);

  const daysElapsed = earliestEnrollmentDate
    ? Math.min(45, Math.max(1, Math.floor((Date.now() - earliestEnrollmentDate) / (1000 * 60 * 60 * 24)) + 1))
    : 1;

  const daysRemaining = Math.max(0, 45 - daysElapsed);

  // Compute Personal Milestone Dates
  const getMilestoneDateStr = (dayOffset: number) => {
    const d = new Date(earliestEnrollmentDate + (dayOffset - 1) * 24 * 60 * 60 * 1000);
    return d.toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" });
  };

  const PERSONAL_MILESTONES: CalendarEvent[] = [
    {
      title: "Day 1: Sprint Kickoff & Repository Provisioning",
      dayTime: `${getMilestoneDateStr(1)} (Day 1 of 45)`,
      type: "Personal Milestone",
      location: "Your GitHub Repository",
      desc: "Clone starter repo, configure .env secrets, setup Docker environment, and commit initial README architecture.",
      badge: daysElapsed >= 1 ? "✓ Commenced" : "Upcoming",
      badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
      category: "MILESTONE"
    },
    {
      title: "Day 10: Architecture Review & HLD/LLD Schema Lock",
      dayTime: `${getMilestoneDateStr(10)} (Day 10 of 45)`,
      type: "Personal Milestone",
      location: "Botmartz Architecture Board",
      desc: "Lock data schemas, database migration scripts, Redis cache strategy, and REST/gRPC endpoints with founder SLA guidelines.",
      badge: daysElapsed >= 10 ? "✓ Passed" : daysElapsed >= 1 ? "In Flight" : "Upcoming",
      badgeColor: daysElapsed >= 10 ? "bg-emerald-100 text-emerald-800 border-emerald-200" : "bg-blue-100 text-blue-800 border-blue-200",
      category: "MILESTONE"
    },
    {
      title: "Day 25: Core Microservices & Agent Pipeline Alpha",
      dayTime: `${getMilestoneDateStr(25)} (Day 25 of 45)`,
      type: "Personal Milestone",
      location: "Your Local / Staging Docker",
      desc: "Complete the core AI inference / distributed processing pipeline and conduct initial local integration testing.",
      badge: daysElapsed >= 25 ? "✓ Passed" : daysElapsed >= 11 ? "In Flight" : "Upcoming",
      badgeColor: daysElapsed >= 25 ? "bg-emerald-100 text-emerald-800 border-emerald-200" : "bg-blue-100 text-blue-800 border-blue-200",
      category: "MILESTONE"
    },
    {
      title: "Day 35: QA Test Suite & SLA Assertions (<150ms)",
      dayTime: `${getMilestoneDateStr(35)} (Day 35 of 45)`,
      type: "Personal Milestone",
      location: "k6 / Locust Test Runner",
      desc: "Execute end-to-end load tests, ensure zero-trust security compliance, and achieve 100% QA test case pass rate.",
      badge: daysElapsed >= 35 ? "✓ Passed" : daysElapsed >= 26 ? "In Flight" : "Upcoming",
      badgeColor: daysElapsed >= 35 ? "bg-emerald-100 text-emerald-800 border-emerald-200" : "bg-purple-100 text-purple-800 border-purple-200",
      category: "MILESTONE"
    },
    {
      title: "Day 45: Cloud Deployment & Final Founder Audit",
      dayTime: `${getMilestoneDateStr(45)} (Day 45 of 45)`,
      type: "Personal Milestone",
      location: "AWS / GCP / Cloud Live Link",
      desc: "Ship production Docker containers to cloud, submit final Proof-of-Work audit report, and qualify for founder referral dispatch.",
      badge: daysElapsed >= 45 ? "🏆 Completed" : "Final Gate",
      badgeColor: daysElapsed >= 45 ? "bg-amber-100 text-amber-800 border-amber-200" : "bg-rose-100 text-rose-800 border-rose-200",
      category: "MILESTONE"
    }
  ];

  const COMMUNITY_RITUALS: CalendarEvent[] = [
    {
      title: "Saturday Office Hours & Architecture Teardown",
      dayTime: "Every Saturday • 5:00 PM – 7:00 PM IST",
      type: "Hybrid: Indore In-Person (50+ RSVPs) + Discord Stage",
      location: "Indore AI Hub (Active when 50+ RSVPs confirmed; otherwise streamed globally via Discord)",
      desc: "Live code walkthroughs, direct debugging with Founder Soham Sharma, offline networking in Indore (physical venue activates when 50+ builders RSVP), or join online globally via Discord Voice Stage & Google Meet.",
      badge: "Flagship Ritual",
      badgeColor: "bg-amber-100 text-amber-800 border-amber-200",
      lumaLink: "https://lu.ma/botmartz-saturday-office-hours",
      category: "RITUAL"
    },
    {
      title: "Showcase Thursdays Demo Arena",
      dayTime: "Every Thursday • 8:00 PM – 9:30 PM IST",
      type: "Virtual Discord Stage",
      location: "Discord #stage-showcase",
      desc: "3-minute lightning demos by builders. Top projects get promoted to the Botmartz LinkedIn Wall and earn direct founder endorsements.",
      badge: "Demo Arena",
      badgeColor: "bg-purple-100 text-purple-800 border-purple-200",
      lumaLink: "https://lu.ma/botmartz-showcase-thursdays",
      category: "RITUAL"
    },
    {
      title: "Wednesday Resume & LinkedIn Profile Optimization",
      dayTime: "Every Wednesday • 7:00 PM – 8:30 PM IST",
      type: "Virtual Google Meet / Discord",
      location: "Discord #resume-review",
      desc: "Constructive 1-on-1 resume dissections. Transforming generic student resumes into ATS-bypassing proof-of-work portfolios.",
      badge: "Career Lab",
      badgeColor: "bg-blue-100 text-blue-800 border-blue-200",
      lumaLink: "https://lu.ma/botmartz-resume-review",
      category: "RITUAL"
    },
    {
      title: "Monthly AI Architect AMA",
      dayTime: "3rd Saturday of Month • 6:00 PM – 8:00 PM IST",
      type: "Virtual Webinar & AMA",
      location: "Lu.ma Stream & YouTube Live",
      desc: "Deep-dives with industry engineers building high-scale distributed backends, biomedical AI models, and satellite pipelines.",
      badge: "Monthly Special",
      badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
      lumaLink: "https://lu.ma/botmartz-architect-ama",
      category: "RITUAL"
    }
  ];

  const INDIAN_TECH_CALENDAR: CalendarEvent[] = [
    {
      title: "Republic Day of India 🇮🇳 (National Holiday)",
      dayTime: "26 January • All Day IST",
      type: "National Gazetted Holiday",
      location: "India-wide",
      desc: "Celebration of the Indian Constitution. Community hack sprint running online on Discord with doubled Karma coin rewards.",
      badge: "National Holiday",
      badgeColor: "bg-orange-100 text-orange-900 border-orange-200",
      category: "HOLIDAY"
    },
    {
      title: "National Science Day (Sir C.V. Raman Discovery)",
      dayTime: "28 February • Special Keynote IST",
      type: "National STEM Celebration",
      location: "Discord Tech Stage",
      desc: "Commemorating the Raman Effect. Lightning workshops on physics-informed neural networks and quantum computing fundamentals.",
      badge: "STEM Day",
      badgeColor: "bg-cyan-100 text-cyan-900 border-cyan-200",
      category: "HOLIDAY"
    },
    {
      title: "Holi (Festival of Colors 🎨)",
      dayTime: "March (Annual Date) • Community Break",
      type: "National Festival",
      location: "India-wide",
      desc: "Community festival celebration. Asynchronous daily standup logging remains open for builders maintaining active commit streaks.",
      badge: "National Festival",
      badgeColor: "bg-pink-100 text-pink-900 border-pink-200",
      category: "HOLIDAY"
    },
    {
      title: "National Technology Day (Pokhran-II Anniversary)",
      dayTime: "11 May • 5:00 PM IST",
      type: "National Innovation Day",
      location: "Discord Stage & Indore AI Lab",
      desc: "Celebrating Indian sovereign technological breakthroughs in defence, aerospace, and semiconductor architectures.",
      badge: "Tech Day",
      badgeColor: "bg-indigo-100 text-indigo-900 border-indigo-200",
      category: "HOLIDAY"
    },
    {
      title: "Independence Day of India 🇮🇳 (National Holiday)",
      dayTime: "15 August • All Day IST",
      type: "National Gazetted Holiday",
      location: "India-wide",
      desc: "79th Independence Day. Launching the Annual Sovereign AI & Open Source India Sprint with special cloud compute sponsorships.",
      badge: "National Holiday",
      badgeColor: "bg-emerald-100 text-emerald-900 border-emerald-200",
      category: "HOLIDAY"
    },
    {
      title: "National Engineers' Day 📐 (Sir M. Visvesvaraya Tribute)",
      dayTime: "15 September • 6:00 PM IST",
      type: "National Engineers Tribute",
      location: "Indore AI Hub & Global Livestream",
      desc: "Annual Flagship Engineering Summit celebrating Sir Mokshagundam Visvesvaraya. Keynote demos by top Botmartz system design graduates.",
      badge: "Engineers' Day",
      badgeColor: "bg-blue-100 text-blue-900 border-blue-200",
      category: "HOLIDAY"
    },
    {
      title: "Gandhi Jayanti (National Gazetted Holiday)",
      dayTime: "2 October • All Day IST",
      type: "National Holiday",
      location: "India-wide",
      desc: "Commemorating Mahatma Gandhi. Community Hackathon for Good (Civic Tech, Agritech & Healthcare AI systems).",
      badge: "National Holiday",
      badgeColor: "bg-slate-100 text-slate-800 border-slate-200",
      category: "HOLIDAY"
    },
    {
      title: "Diwali (Festival of Lights 🪔) & Tech New Year",
      dayTime: "October / November • Annual Celebration",
      type: "National Festival",
      location: "India-wide",
      desc: "Diwali celebrations across Indore & online. Annual Builder Awards ceremony honoring top contributors and highest karma earners.",
      badge: "Grand Festival",
      badgeColor: "bg-amber-100 text-amber-900 border-amber-200",
      category: "HOLIDAY"
    },
    {
      title: "National Mathematics Day (Srinivasa Ramanujan Tribute)",
      dayTime: "22 December • 7:00 PM IST",
      type: "STEM Keynote",
      location: "Discord Math & AI Track",
      desc: "Tribute to genius Srinivasa Ramanujan. Special masterclass on linear algebra, matrix decomposition, and attention math in SLMs.",
      badge: "Mathematics Day",
      badgeColor: "bg-purple-100 text-purple-900 border-purple-200",
      category: "HOLIDAY"
    }
  ];

  const filteredEvents = useMemo(() => {
    let list: CalendarEvent[] = [];
    if (activeTab === "ALL") {
      list = [...PERSONAL_MILESTONES, ...COMMUNITY_RITUALS, ...INDIAN_TECH_CALENDAR, ...customEvents];
    } else if (activeTab === "RITUALS") {
      list = [...COMMUNITY_RITUALS, ...customEvents];
    } else if (activeTab === "PERSONAL") {
      list = [...PERSONAL_MILESTONES];
    } else if (activeTab === "INDIAN_HOLIDAYS") {
      list = [...INDIAN_TECH_CALENDAR];
    }
    return list;
  }, [activeTab, customEvents, earliestEnrollmentDate]);

  return (
    <AuthGate
      featureTitle="Community & Personal Calendar"
      featureDescription="Sign in to view Indian holidays, sync weekly Indore AI lab sessions to Lu.ma, and track your personal 45-day milestone schedule."
    >
      <div className="min-h-screen bg-slate-100 text-slate-900 pb-20 font-sans">
        
        {/* Header Banner */}
        <div className="bg-white border-b border-slate-200 pt-24 pb-10">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 text-[#0066FF] font-mono text-xs font-bold uppercase tracking-wider mb-2 border border-blue-200">
              <Calendar size={14} /> Indian Community &amp; Milestone Calendar (IST)
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Community Rituals &amp; Personal 45-Day Schedule
            </h1>
            <p className="text-slate-600 text-xs sm:text-sm font-mono mt-1 max-w-2xl">
              All dates structured in Indian Standard Time (IST). Track your rolling 45-day sprint, weekly Saturday Indore teardowns, and national tech days.
            </p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-8 space-y-8">
          
          {/* Indore In-Person 50+ RSVP Activation Tracker */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs font-mono text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <div className="text-xs font-bold text-[#0066FF] uppercase mb-1 flex items-center gap-1.5">
                  <MapPin size={14} className="text-rose-500" /> INDORE IN-PERSON HUB PROTOCOL
                </div>
                <h3 className="text-lg font-bold text-slate-900 font-sans">
                  Physical Office Hours Threshold (50+ RSVPs Rule)
                </h3>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  In-person Indore AI Hub meetups unlock when 50+ builders RSVP. Otherwise, sessions are conducted live online via Discord Voice Stage.
                </p>
              </div>

              <button
                onClick={() => {
                  if (!rsvpd) {
                    setRsvpCount((c) => c + 1);
                    setRsvpd(true);
                  }
                }}
                className={`px-5 py-2.5 rounded-2xl font-bold transition-all cursor-pointer shrink-0 flex items-center gap-2 ${
                  rsvpd
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "bg-[#0066FF] hover:bg-blue-600 text-white shadow-xs"
                }`}
              >
                {rsvpd ? <Check size={14} /> : <Users size={14} />}
                <span>{rsvpd ? "RSVP Confirmed (+50 Coins)" : "RSVP for this Saturday"}</span>
              </button>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-600 font-bold">This Saturday&apos;s Confirmed RSVPs</span>
                <span className="font-bold text-slate-900">{rsvpCount} / 50 RSVPs ({Math.round((rsvpCount / 50) * 100)}%)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className={`h-2.5 rounded-full transition-all ${
                    rsvpCount >= 50 ? "bg-emerald-500" : "bg-[#0066FF]"
                  }`}
                  style={{ width: `${Math.min((rsvpCount / 50) * 100, 100)}%` }}
                />
              </div>
              <div className="text-[10px] text-slate-500">
                {rsvpCount >= 50
                  ? "🎉 Threshold reached! In-Person Indore Hub (Vijay Nagar) is ACTIVE this Saturday."
                  : `⚡ ${50 - rsvpCount} more RSVPs needed to activate physical Indore venue. Online Discord Stage is ready!`}
              </div>
            </div>
          </div>

          {/* Personal Progress Milestone Summary Card */}
          <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-md border border-blue-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 font-mono text-xs">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 font-bold text-[10px] uppercase">
                <Flame size={12} /> Personal 45-Day Progress Map
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-sans">
                You are currently on Day {daysElapsed} of 45
              </h2>
              <p className="text-xs text-blue-200 max-w-xl leading-relaxed">
                {daysRemaining > 0
                  ? `You have ${daysRemaining} days remaining in your rolling internship sprint. Check your personal milestones below to stay on schedule.`
                  : "🎉 Congratulations on completing your 45-day sprint! Your proof-of-work is ready for final founder verification."}
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/profile"
                className="px-5 py-3 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-bold transition-all shadow-xs"
              >
                View Full Profile &rarr;
              </Link>
              <a
                href="https://lu.ma/botmartz-community"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold transition-all flex items-center gap-1.5 shadow-xs"
              >
                <span>Lu.ma Calendar</span>
                <ExternalLink size={13} />
              </a>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 font-mono text-xs">
            {[
              { id: "ALL", label: `All Events (${PERSONAL_MILESTONES.length + COMMUNITY_RITUALS.length + INDIAN_TECH_CALENDAR.length})` },
              { id: "PERSONAL", label: `🎯 My 45-Day Milestones (${PERSONAL_MILESTONES.length})` },
              { id: "RITUALS", label: `🎙️ Community Rituals (${COMMUNITY_RITUALS.length})` },
              { id: "INDIAN_HOLIDAYS", label: `🇮🇳 Indian Calendar & Tech Days (${INDIAN_TECH_CALENDAR.length})` }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-2xl font-bold transition-all shrink-0 cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-[#0066FF] text-white shadow-xs"
                    : "bg-white text-slate-700 hover:bg-slate-200 border border-slate-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Events List */}
          <div className="space-y-4 font-mono text-xs">
            {filteredEvents.map((evt, idx) => (
              <div
                key={evt.id || idx}
                className={`bg-white border rounded-3xl p-6 sm:p-8 shadow-xs transition-all hover:border-slate-300 ${
                  evt.category === "MILESTONE"
                    ? "border-blue-200 bg-blue-50/20"
                    : evt.category === "HOLIDAY"
                    ? "border-amber-200 bg-amber-50/20"
                    : "border-slate-200"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${evt.badgeColor || "bg-blue-100 text-blue-800 border-blue-200"}`}>
                      {evt.badge || "Calendar Event"}
                    </span>
                    <h3 className="font-bold text-slate-900 text-lg font-sans">{evt.title}</h3>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 shrink-0">
                    <Clock size={13} className="text-[#0066FF]" />
                    <span>{evt.dayTime}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-500 mb-3 flex-wrap">
                  <span className="flex items-center gap-1">
                    <MapPin size={12} className="text-slate-400" />
                    <span>{evt.location}</span>
                  </span>
                  <span>•</span>
                  <span className="text-[#0066FF] font-bold">{evt.type}</span>
                </div>

                <p className="text-xs text-slate-600 font-sans leading-relaxed mb-4">
                  {evt.desc}
                </p>

                {evt.lumaLink && (
                  <div className="pt-2">
                    <a
                      href={evt.lumaLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0066FF] hover:underline"
                    >
                      <span>RSVP on Lu.ma &rarr;</span>
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>

      </div>
    </AuthGate>
  );
}
