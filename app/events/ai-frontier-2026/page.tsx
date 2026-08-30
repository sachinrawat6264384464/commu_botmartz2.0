"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Sparkles, 
  Calendar, 
  MapPin, 
  Clock, 
  Ticket, 
  ShieldCheck, 
  Award, 
  Users, 
  Terminal, 
  CheckCircle2,
  ArrowRight,
  Flame,
  Linkedin
} from "lucide-react";
import RazorpayModal from "@/app/_components/RazorpayModal";

const SPEAKERS = [
  {
    name: "Soham Sharma",
    role: "Founder & Director, Botmartz AI Solutions Pvt Ltd",
    bio: "AI Engineer and Architect specializing in Enterprise RAG, deterministic agent workflows, and moving LLMs into production.",
    image: "/Sohamsharma.jpeg",
    linkedin: "https://www.linkedin.com/in/soham-sharma/"
  },
  {
    name: "Dr. Promit Ray",
    role: "Cofounder & Chief AI Officer, RAYOL AI Solutions | Lead Consultant, Scivalon",
    bio: "Leading researcher focused on foundation models, reasoning architectures, and inference economics.",
    image: "/promit-headshot.png",
    linkedin: "https://www.linkedin.com/in/promit-ray/"
  },
  {
    name: "Harsh Sahu",
    role: "AI Engineer, Walkover",
    bio: "Specializes in building autonomous agents, orchestration pipelines, and evaluation harnesses.",
    image: "/harsh_sahu.jpeg",
    linkedin: "https://www.linkedin.com/in/harshhsahu/"
  }
];

const TICKETS = [
  {
    name: "Student / Explorer Pass",
    price: "₹499",
    tag: "Early Learner",
    features: [
      "Access to all keynote sessions",
      "Live Q&A with speakers",
      "Digital verifiable Certificate of Attendance",
      "Community Discord badge"
    ],
    popular: false,
    cta: "Book Student Pass"
  },
  {
    name: "Professional / Builder Pass",
    price: "₹1,499",
    tag: "Most Popular",
    features: [
      "All Student Pass benefits",
      "Hands-on Code Labs & Workbooks",
      "Networking lunch & VIP lounge access",
      "Official AI Frontier Merch Kit",
      "Priority Question Queuing"
    ],
    popular: true,
    cta: "Book Builder Pass"
  },
  {
    name: "VIP / Founder Pass",
    price: "₹3,999",
    tag: "Executive",
    features: [
      "All Builder Pass benefits",
      "Private VIP Speaker Dinner",
      "Exclusive 1-on-1 AI Architecture Advisory",
      "Full recording archive & workshop slides",
      "Fast-track priority registration"
    ],
    popular: false,
    cta: "Book VIP Pass"
  }
];

export default function AIFrontierPage() {
  const [selectedTicket, setSelectedTicket] = useState<{
    name: string;
    amount: number;
    description: string;
  } | null>(null);

  const handleTicketClick = (ticketName: string, priceStr: string) => {
    const numericAmount = parseInt(priceStr.replace(/[^0-9]/g, ""), 10) || 499;
    setSelectedTicket({
      name: `${ticketName} - AI Frontier 2026`,
      amount: numericAmount,
      description: "Official Admission Pass for AI Frontier 2026 Summit (Indore / Hybrid)."
    });
  };

  return (
    <div className="bg-[#FAFCFF] min-h-screen text-slate-900">
      
      {/* ── HERO ── */}
      <section className="relative pt-24 pb-20 overflow-hidden border-b border-slate-200 bg-gradient-to-b from-blue-50/50 via-slate-50/20 to-[#FAFCFF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-[#0066FF] font-mono text-xs uppercase tracking-wider mb-6 font-semibold">
            <Flame size={13} className="text-[#0066FF]" /> Flagship AI Engineering Summit
          </div>

          <h1 className="text-[clamp(36px,5vw,68px)] font-bold tracking-tight leading-[1.08] max-w-4xl mb-6 text-slate-900">
            AI Frontier 2026: <br />
            <span className="bg-gradient-to-r from-[#0066FF] via-[#0092D7] to-[#0678BE] bg-clip-text text-transparent">
              The Production AI Summit
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed mb-8">
            A premier gathering of AI engineers, researchers, and founders exploring Enterprise RAG, LangGraph Agent state machines, and hardware-accelerated inference.
          </p>

          <div className="flex flex-wrap gap-6 text-xs text-slate-700 font-mono mb-10 p-4 rounded-2xl bg-white border border-slate-200 max-w-xl shadow-2xs">
            <div className="flex items-center gap-2">
              <Calendar size={15} className="text-[#0066FF]" />
              <span>Sunday, August 23, 2026</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={15} className="text-[#0066FF]" />
              <span>Indore, India / Hybrid</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={15} className="text-[#0066FF]" />
              <span>9:30 AM – 6:00 PM IST</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <a
              href="#tickets"
              className="bg-[#0066FF] hover:bg-[#0052CC] text-white px-8 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md"
            >
              Get Your Pass Now ↓
            </a>
            <Link
              href="/certificates"
              className="bg-white border border-slate-300 hover:border-[#0066FF] text-slate-700 hover:text-[#0066FF] px-6 py-3.5 rounded-xl text-xs font-mono transition-all shadow-2xs"
            >
              Verify Past Certificates ↗
            </Link>
          </div>
        </div>
      </section>

      {/* ── SPEAKERS ── */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="font-mono text-xs text-[#0066FF] uppercase tracking-wider font-bold mb-1.5">KEYNOTE LINEUP</div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Featured Speakers</h2>
            <p className="text-sm text-slate-600">Leading AI practitioners and researchers driving real-world systems into production.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {SPEAKERS.map((s, idx) => (
              <div key={idx} className="bg-[#FAFCFF] border border-slate-200 rounded-3xl p-6 shadow-xs hover:shadow-md flex flex-col justify-between transition-all">
                <div>
                  <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center font-mono font-bold text-xl text-[#0066FF] mb-6">
                    {s.name.split(' ').map(n=>n[0]).join('')}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">{s.name}</h3>
                  <div className="text-xs text-[#0066FF] font-mono mb-4">{s.role}</div>
                  <p className="text-xs text-slate-600 leading-relaxed mb-6">{s.bio}</p>
                </div>
                <a
                  href={s.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-500 hover:text-[#0066FF]"
                >
                  <Linkedin size={14} /> Connect on LinkedIn
                </a>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── TICKETS ── */}
      <section id="tickets" className="py-20 bg-[#FAFCFF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="font-mono text-xs text-[#0066FF] uppercase tracking-wider font-bold mb-1.5">REGISTRATION TIERS</div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Choose Your Pass</h2>
            <p className="text-sm text-slate-600">All passes include full keynote access, interactive workshops, and verifiable credentials.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {TICKETS.map((t, idx) => (
              <div
                key={idx}
                className={`rounded-3xl p-8 shadow-xs flex flex-col justify-between relative transition-all bg-white ${
                  t.popular
                    ? "border-2 border-[#0066FF] shadow-lg"
                    : "border border-slate-200"
                }`}
              >
                {t.popular && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-[#0066FF] text-white font-mono text-[10px] font-bold uppercase tracking-wider shadow-sm">
                    {t.tag}
                  </span>
                )}

                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{t.name}</h3>
                  <div className="text-3xl font-bold font-mono text-slate-900 mb-6">{t.price}</div>

                  <div className="space-y-3 pt-6 border-t border-slate-100 mb-8">
                    {t.features.map((feat, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs text-slate-600">
                        <CheckCircle2 size={14} className="text-[#0066FF] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handleTicketClick(t.name, t.price)}
                  className={`w-full py-3.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    t.popular
                      ? "bg-[#0066FF] hover:bg-[#0052CC] text-white shadow-md"
                      : "bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200"
                  }`}
                >
                  {t.cta} →
                </button>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Razorpay Checkout Modal */}
      {selectedTicket && (
        <RazorpayModal
          isOpen={Boolean(selectedTicket)}
          onClose={() => setSelectedTicket(null)}
          amount={selectedTicket.amount}
          itemName={selectedTicket.name}
          description={selectedTicket.description}
          itemCategory="EVENT_TICKET"
          metadata={{
            eventId: "ai-frontier-2026",
            eventTitle: "AI Frontier 2026 Summit"
          }}
        />
      )}

    </div>
  );
}
