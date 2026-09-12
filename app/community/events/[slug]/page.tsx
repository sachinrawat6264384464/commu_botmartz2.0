"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Calendar,
  MapPin,
  Sparkles,
  ArrowLeft,
  Users,
  CheckCircle2,
  Share2,
  Clock,
  Ticket,
  ExternalLink
} from "lucide-react";
import EventRegistrationWizard from "./EventRegistrationWizard";

export default function EventDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [eventData, setEventData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [wizardOpen, setWizardOpen] = useState(false);

  useEffect(() => {
    async function fetchEvent() {
      try {
        const res = await fetch("/api/admin/events");
        const data = await res.json();
        if (data.success && Array.isArray(data.events)) {
          const matched = data.events.find((e: any) => e.slug === slug || e.id === slug);
          if (matched) {
            setEventData(matched);
          } else {
            // Fallback default info
            setEventData({
              title: slug === "ai-frontier-2026" ? "AI Frontier 2026 — The Future of AI Engineering" : "AI Accelerator Summit & Meetup",
              slug,
              description: "Central India's largest flagship Artificial Intelligence summit gathering 500+ student builders, researchers & founders.",
              date: "August 23, 2026",
              location: "Indore, India & Virtual Stream",
              status: "upcoming",
              category: "Conference",
              coverImage: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80",
            });
          }
        }
      } catch (err) {
        console.error("Failed to load event details:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchEvent();
  }, [slug]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#040914] text-white pt-32 text-center font-mono text-xs">
        Loading event details...
      </main>
    );
  }

  const evt = eventData || {
    title: "AI Frontier 2026 Summit",
    slug,
    description: "Join developers and founders in Indore.",
    date: "August 23, 2026",
    location: "Indore, India",
    status: "upcoming",
  };

  return (
    <main className="min-h-screen bg-[#040914] text-white pt-24 pb-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* Back Button */}
        <Link
          href="/community/events"
          className="inline-flex items-center gap-2 font-mono text-xs text-slate-400 hover:text-[#00B8F0] transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to All Events</span>
        </Link>

        {/* Hero Section */}
        <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-slate-900">
          <div className="h-64 sm:h-80 w-full relative">
            <img
              src={evt.coverImage || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80"}
              alt={evt.title}
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#040914] via-transparent to-transparent" />
          </div>

          <div className="p-6 sm:p-10 -mt-20 relative z-10 space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-[#0066FF] text-white font-mono text-xs font-bold uppercase tracking-wider">
                {evt.status || "upcoming"}
              </span>
              <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-slate-300 font-mono text-xs font-bold">
                {evt.category || "AI Summit"}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight">
              {evt.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 font-mono text-xs text-slate-300 pt-2 border-t border-white/10">
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-[#00B8F0]" />
                <span>{evt.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-rose-400" />
                <span>{evt.location}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Overview & Agenda */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="md:col-span-2 space-y-8">
            <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md space-y-4">
              <h2 className="text-xl font-extrabold text-white">About the Event</h2>
              <p className="text-sm font-sans text-slate-300 leading-relaxed whitespace-pre-line">
                {evt.description}
              </p>

              <div className="pt-4 border-t border-white/10 space-y-3">
                <div className="text-xs font-mono text-[#00B8F0] font-bold uppercase">Highlights</div>
                <ul className="space-y-2 font-mono text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-emerald-400" />
                    <span>Live Keynotes &amp; LLM Architecture Teardowns</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-emerald-400" />
                    <span>Networking with Founders &amp; AI Engineers</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-emerald-400" />
                    <span>QR Verified Pass &amp; Certificate of Participation</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Registration Sidebar Card */}
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-gradient-to-b from-blue-900/40 to-slate-900 border border-[#0066FF]/40 space-y-6 font-mono text-xs">
              <div>
                <div className="text-[10px] text-[#00B8F0] uppercase font-bold tracking-wider">REGISTRATION OPEN</div>
                <div className="text-2xl font-extrabold text-white mt-1">Free Ticket Pass</div>
                <p className="text-slate-400 mt-1">Limited seats available for live venue &amp; stream.</p>
              </div>

              <button
                onClick={() => setWizardOpen(true)}
                className="w-full py-4 rounded-2xl bg-[#0066FF] hover:bg-[#0052CC] text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-blue-500/25"
              >
                <Ticket size={16} />
                <span>Register Now</span>
              </button>

              <div className="text-[11px] text-slate-400 text-center">
                Instant PNG QR Pass + Calendar (.ics) download
              </div>
            </div>
          </div>

        </div>

        {/* Wizard Modal */}
        {wizardOpen && (
          <EventRegistrationWizard
            eventTitle={evt.title}
            eventSlug={evt.slug}
            eventDate={evt.date}
            eventLocation={evt.location}
            onClose={() => setWizardOpen(false)}
          />
        )}

      </div>
    </main>
  );
}
