"use client";

import React, { useState } from "react";
import { Image as ImageIcon, Sparkles, Filter, X, ZoomIn } from "lucide-react";

interface MediaItem {
  id: string;
  title: string;
  category: "Conferences" | "Workshops" | "Community Meetups" | "Hackathons";
  date: string;
  location: string;
  image: string;
  description: string;
}

const SAMPLE_MEDIA: MediaItem[] = [
  {
    id: "g1",
    title: "AI Frontier Summit Keynote Hall",
    category: "Conferences",
    date: "Aug 2025",
    location: "Main Auditorium",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80",
    description: "Packed auditorium listening to real-world Enterprise RAG deployment case studies."
  },
  {
    id: "g2",
    title: "LangGraph State Machine Live Code Lab",
    category: "Workshops",
    date: "July 2025",
    location: "Indore Tech Hub",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80",
    description: "Engineers collaborating on deterministic state checkpoints and tool calling pipelines."
  },
  {
    id: "g3",
    title: "Pre-Summit Hack Night & Dinner",
    category: "Community Meetups",
    date: "Aug 2025",
    location: "Cafe & Lounge",
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80",
    description: "Informal networking and hack sprints between developers from 12+ cities."
  },
  {
    id: "g4",
    title: "Agent Challenge Demo Day Presentations",
    category: "Hackathons",
    date: "June 2025",
    location: "Stage 2",
    image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=80",
    description: "Finalist teams demonstrating autonomous agents executing complex workflows."
  }
];

const CATEGORIES = ["All", "Conferences", "Workshops", "Community Meetups", "Hackathons"];

export default function GalleryPage() {
  const [selectedCat, setSelectedCat] = useState("All");
  const [activeItem, setActiveItem] = useState<MediaItem | null>(null);

  const filtered = SAMPLE_MEDIA.filter(m => selectedCat === "All" || m.category === selectedCat);

  return (
    <div className="bg-[#FAFCFF] min-h-screen text-slate-900 py-16 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-[#0066FF] font-mono text-xs uppercase tracking-wider mb-4 font-semibold">
            <ImageIcon size={14} /> Community Visuals
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-slate-900 mb-4">
            Summit &amp; Meetup Memories
          </h1>
          <p className="text-sm sm:text-base text-slate-600">
            Highlights from Botmartz AI summits, hands-on developer workshops, hack nights, and builder meetups.
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedCat === cat
                  ? "bg-[#0066FF] text-white font-bold shadow-sm"
                  : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(item => (
            <div
              key={item.id}
              onClick={() => setActiveItem(item)}
              className="group bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col"
            >
              <div className="relative aspect-video overflow-hidden bg-slate-100">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                  <ZoomIn size={24} />
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-[#0066FF] mb-2">
                    <span>{item.category}</span>
                    <span className="text-slate-400">{item.date}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-base mb-1">{item.title}</h3>
                  <p className="text-xs text-slate-600 line-clamp-2">{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Lightbox Modal */}
      {activeItem && (
        <div
          onClick={() => setActiveItem(null)}
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-200"
          >
            <div className="relative aspect-video bg-slate-100">
              <img
                src={activeItem.image}
                alt={activeItem.title}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setActiveItem(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between text-xs font-mono text-[#0066FF] mb-2">
                <span>{activeItem.category} • {activeItem.location}</span>
                <span className="text-slate-400">{activeItem.date}</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">{activeItem.title}</h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{activeItem.description}</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
