"use client";

import React, { useState } from "react";
import { MessageSquare, Star, ThumbsUp } from "lucide-react";

export default function AdminFeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<any[]>([
    { id: "1", name: "Kavya Deshmukh", event: "AI Frontier 2026", rating: 5, comment: "The breakdown of LangGraph state machines and RAGAS evaluations was world class.", date: "2026-08-28" },
    { id: "2", name: "Aman Gupta", event: "AI Frontier 2026", rating: 5, comment: "Hands-down the best AI engineering conference in India this year.", date: "2026-08-28" },
  ]);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-white/10">
        <div>
          <div className="text-xs font-mono text-[#00B8F0] uppercase font-bold">ATTENDEE SENTIMENT &amp; NPS</div>
          <h1 className="text-2xl font-bold text-white">Event Feedback &amp; Testimonials</h1>
        </div>
      </div>

      {/* Feedback List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {feedbacks.map((f) => (
          <div key={f.id} className="bg-[#0B1524] border border-white/10 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <div className="font-bold text-white text-sm">{f.name}</div>
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(f.rating)].map((_, i) => (
                  <Star key={i} size={13} fill="currentColor" />
                ))}
              </div>
            </div>
            <div className="text-xs font-mono text-[#00B8F0] mb-3">{f.event}</div>
            <p className="text-xs text-slate-300 leading-relaxed italic mb-4">"{f.comment}"</p>
            <div className="text-[10px] font-mono text-slate-500">{f.date}</div>
          </div>
        ))}
      </div>

    </div>
  );
}
