import React from "react";
import Link from "next/link";
import { Calendar, MapPin, Ticket, Sparkles, ArrowRight, Clock, Coins, Image as ImageIcon } from "lucide-react";
import { adminDb } from "@/lib/firebase-admin";

export const revalidate = 60;

export default async function EventsDirectoryPage() {
  let events: any[] = [];
  try {
    const snap = await adminDb.collection("events").get();
    events = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (e) {}

  return (
    <div className="bg-[#FAFCFF] min-h-screen text-slate-900 py-16 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-[#0066FF] font-mono text-xs uppercase tracking-wider mb-4 font-semibold">
            <Calendar size={14} /> Schedule &amp; Conferences
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
            Botmartz Events &amp; Meetups
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto font-mono text-xs">
            Discover in-person summits, technical keynotes, builder hackathons, and developer community gatherings.
          </p>

          {/* Karma Coin Attendance Incentive Banner */}
          <div className="mt-6 max-w-2xl mx-auto p-4 rounded-2xl bg-gradient-to-r from-amber-50 via-blue-50 to-purple-50 border border-amber-200 text-slate-800 font-mono text-xs flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-2.5 text-left">
              <Coins size={18} className="text-amber-500 shrink-0" />
              <span>
                <strong>Earn +300 to +3,000 Karma Coins:</strong> Verified check-in by admin scanner at any meetup/hackathon credits your wallet instantly!
              </span>
            </div>
            <Link
              href="/gallery"
              className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-[#0066FF] text-[#0066FF] font-bold text-[11px] shrink-0 transition-colors flex items-center gap-1"
            >
              <ImageIcon size={12} />
              <span>View Gallery</span>
            </Link>
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* AI Frontier 2026 Featured Card */}
          <div className="bg-white border-2 border-blue-200 hover:border-[#0066FF] rounded-3xl p-8 shadow-sm hover:shadow-md flex flex-col justify-between relative overflow-hidden transition-all">
            <div className="absolute top-0 right-0 px-4 py-1.5 bg-[#0066FF] text-white font-mono text-[10px] font-bold uppercase rounded-bl-xl">
              FLAGSHIP 2026
            </div>
            <div>
              <div className="text-xs font-mono text-[#0066FF] mb-2 uppercase font-bold">Annual AI Conference</div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">AI Frontier 2026 Summit</h2>
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                The premier annual gathering for production AI engineering. Featuring keynotes on Enterprise RAG, LangGraph agents, and retrieval architectures.
              </p>

              <div className="space-y-2.5 text-xs text-slate-500 font-mono mb-8">
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-[#0066FF]" />
                  <span>Sunday, August 23, 2026</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-[#0066FF]" />
                  <span>Indore, India / Hybrid</span>
                </div>
              </div>
            </div>

            <Link
              href="/events/ai-frontier-2026"
              className="w-full bg-[#0066FF] hover:bg-[#0052CC] text-white py-3.5 rounded-xl font-mono text-xs font-bold uppercase text-center transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <Ticket size={14} /> Get Passes &amp; Agenda →
            </Link>
          </div>

          {/* Dynamic Events from Firestore if any */}
          {events.filter(e => e.slug !== 'ai-frontier-2026').map(e => (
            <div key={e.id} className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xs flex flex-col justify-between">
              <div>
                <div className="text-xs font-mono text-slate-400 mb-2 uppercase font-bold">{e.type || "Community Meetup"}</div>
                <h2 className="text-xl font-bold text-slate-900 mb-4">{e.title}</h2>
                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                  {e.description || e.subtitle}
                </p>
              </div>

              <Link
                href={`/events/${e.slug || e.id}`}
                className="w-full bg-slate-50 border border-slate-200 hover:border-[#0066FF] text-slate-700 hover:text-[#0066FF] py-3 rounded-xl font-mono text-xs font-bold uppercase text-center transition-all flex items-center justify-center gap-2"
              >
                <span>View Event</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          ))}

        </div>

      </div>
    </div>
  );
}
