"use client";

import React, { useState, useEffect } from "react";
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
  Loader2
} from "lucide-react";

export default function ArenaCalendarPage() {
  const [customEvents, setCustomEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const COMMUNITY_RITUALS = [
    {
      title: "Saturday Office Hours & Architecture Teardown",
      dayTime: "Every Saturday • 5:00 PM – 7:00 PM IST",
      type: "Hybrid: Indore In-Person + Discord Stage",
      location: "Indore AI Hub (Vijay Nagar / Geeta Bhawan) & Virtual Discord",
      desc: "Live code walkthroughs, direct debugging with Founder Soham Sharma, offline student networking in Indore, and squad standups.",
      badge: "Flagship Ritual",
      badgeColor: "bg-amber-100 text-amber-800 border-amber-200",
      lumaLink: "https://lu.ma/botmartz-saturday-office-hours"
    },
    {
      title: "Showcase Thursdays Demo Arena",
      dayTime: "Every Thursday • 8:00 PM – 9:30 PM IST",
      type: "Virtual Discord Stage",
      location: "Discord #stage-showcase",
      desc: "3-minute lightning demos by builders. Top projects get promoted to the Botmartz LinkedIn Wall and earn direct founder endorsements.",
      badge: "Demo Arena",
      badgeColor: "bg-purple-100 text-purple-800 border-purple-200",
      lumaLink: "https://lu.ma/botmartz-showcase-thursdays"
    },
    {
      title: "Wednesday Resume & Portfolio Teardown",
      dayTime: "Every Wednesday • 7:00 PM – 8:30 PM IST",
      type: "Virtual Google Meet / Discord",
      location: "Discord #resume-review",
      desc: "Brutally honest 1-on-1 resume dissections. Transforming generic student resumes into ATS-bypassing proof-of-work portfolios.",
      badge: "Career Surgery",
      badgeColor: "bg-blue-100 text-blue-800 border-blue-200",
      lumaLink: "https://lu.ma/botmartz-resume-surgery"
    },
    {
      title: "Monthly AI Architect AMA",
      dayTime: "3rd Saturday of Month • 6:00 PM – 8:00 PM IST",
      type: "Virtual Webinar & AMA",
      location: "Lu.ma Stream & YouTube Live",
      desc: "Deep-dives with industry engineers building high-scale distributed backends, biomedical AI models, and satellite pipelines.",
      badge: "Monthly Special",
      badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
      lumaLink: "https://lu.ma/botmartz-architect-ama"
    }
  ];

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

  const allEvents = [...customEvents, ...COMMUNITY_RITUALS];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 pb-20">
      {/* Header Banner */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 text-[#0066FF] font-mono text-xs font-bold uppercase tracking-wider mb-2 border border-blue-200">
            <Calendar size={14} /> Weekly Community Schedule
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 font-sans">
            Community Rituals &amp; Indore Hub Meetups
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm font-mono mt-1">
            Official 45-day schedule (Cohort 1 active). Join offline in Indore or stream virtually from anywhere on Discord.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-8 space-y-8">
        
        {/* Lu.ma Live Calendar Card */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-md border border-blue-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold mb-1">
              <Sparkles size={14} /> Integrated Lu.ma Registration
            </div>
            <h2 className="text-xl sm:text-2xl font-bold mb-2">
              Subscribe to the Botmartz Builders Lu.ma Calendar
            </h2>
            <p className="text-xs text-blue-200 font-mono max-w-xl leading-relaxed">
              Auto-sync all Saturday office hours, Indore offline meetups, and demo sessions directly to your Google Calendar / Apple Calendar.
            </p>
          </div>

          <a
            href="https://lu.ma/botmartz-community"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold font-mono text-xs transition-all shrink-0 flex items-center gap-2 shadow-xs"
          >
            <span>Subscribe on Lu.ma</span>
            <ExternalLink size={14} />
          </a>
        </div>

        {/* Rituals Timeline */}
        <div className="space-y-4">
          {allEvents.map((ritual, idx) => (
            <div
              key={ritual.id || idx}
              className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs transition-all hover:border-slate-300"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <span className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold border ${ritual.badgeColor || "bg-blue-100 text-blue-800 border-blue-200"}`}>
                    {ritual.badge || "Live Milestone"}
                  </span>
                  <h3 className="font-bold text-slate-900 text-lg font-sans">{ritual.title}</h3>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-700 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                  <Clock size={13} className="text-[#0066FF]" />
                  <span>{ritual.dayTime}</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 font-sans leading-relaxed mb-4">
                {ritual.desc}
              </p>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-slate-100 text-xs font-mono">
                <div className="flex items-center gap-4 text-slate-500">
                  <span className="flex items-center gap-1.5 font-bold text-slate-700">
                    <MapPin size={14} className="text-rose-500" />
                    <span>{ritual.location}</span>
                  </span>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <Link
                    href="/discussions"
                    className="px-4 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold border border-slate-200 text-center flex-1 sm:flex-initial"
                  >
                    Discuss in Forum
                  </Link>
                  <a
                    href={ritual.lumaLink || "https://chat.whatsapp.com/DkzKwpjuktaCYAofOtMlAQ"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-[#0066FF] hover:bg-[#0052CC] text-white font-bold text-center flex-1 sm:flex-initial"
                  >
                    RSVP / Join Stream
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 1-on-1 Indore & Virtual Founder Meetup Booking */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-700 uppercase mb-1">
                <Coffee size={14} /> Indore Offline &amp; Virtual 1-on-1
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1 font-sans">
                Want to meet Founder Soham Sharma in Indore or Virtual?
              </h3>
              <p className="text-xs text-slate-600 font-mono leading-relaxed">
                If you are based in Indore, Madhya Pradesh, or want a 20-minute 1-on-1 virtual architecture audit, you can request an office hours slot directly.
              </p>
            </div>

            <a
              href="https://discord.gg/k75ZpEnzp"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-mono text-xs font-bold uppercase tracking-wider transition-all shrink-0 text-center"
            >
              Request 1-on-1 Slot on Discord
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
