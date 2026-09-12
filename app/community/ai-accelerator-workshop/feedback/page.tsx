"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Star,
  Sparkles,
  CheckCircle2,
  Send,
  MessageSquare,
  User,
  Mail,
  Ticket,
  ThumbsUp,
  ThumbsDown,
  Loader2,
  ArrowLeft
} from "lucide-react";

export default function LiveWorkshopFeedbackPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    eventId: "ai-accelerator-workshop",
    workshopId: "ai-accelerator-workshop",
    participantName: "",
    participantEmail: "",
    participantPhone: "",
    registrationCode: "",
    attendeeType: "student",
    overallRating: 5,
    contentRating: 5,
    venueRating: 5,
    recommend: "yes",
    takeaways: "",
    comments: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.participantName) {
      alert("Please enter your full name.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/community/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
      } else {
        alert(data.error || "Failed to submit feedback.");
      }
    } catch (err: any) {
      alert(err.message || "Error submitting feedback.");
    } finally {
      setLoading(false);
    }
  };

  const renderStarPicker = (
    label: string,
    value: number,
    onChange: (val: number) => void
  ) => (
    <div className="space-y-1.5 font-mono text-xs">
      <label className="block text-slate-300 font-bold">{label}</label>
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="p-1 text-slate-600 hover:text-amber-400 transition-colors cursor-pointer"
          >
            <Star
              size={24}
              className={star <= value ? "fill-amber-400 text-amber-400" : "text-slate-700"}
            />
          </button>
        ))}
        <span className="text-amber-400 font-bold ml-2">({value}/5)</span>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#040914] text-white pt-24 pb-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Back Link */}
        <Link
          href="/community/ai-accelerator-workshop"
          className="inline-flex items-center gap-2 font-mono text-xs text-slate-400 hover:text-[#00B8F0] transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to Workshop Overview</span>
        </Link>

        {submitted ? (
          <div className="p-8 sm:p-12 rounded-3xl bg-slate-900 border border-emerald-500/30 text-center space-y-6 animate-in fade-in duration-300">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
              <CheckCircle2 size={36} />
            </div>

            <div className="space-y-2">
              <div className="text-xs font-mono text-emerald-400 uppercase font-bold tracking-wider">
                FEEDBACK SUBMITTED
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                Thank You for Your Feedback!
              </h1>
              <p className="text-xs font-mono text-slate-400 max-w-md mx-auto">
                Your response has been recorded in the Live Feedback Ledger. Your feedback helps us continuously elevate the AI Accelerator curriculum.
              </p>
            </div>

            <div className="pt-4 flex flex-wrap justify-center gap-4 font-mono text-xs">
              <Link
                href="/community/events"
                className="px-6 py-3 rounded-xl bg-[#0066FF] hover:bg-[#0052CC] text-white font-bold transition-all"
              >
                Browse Upcoming Events
              </Link>
              <button
                onClick={() => setSubmitted(false)}
                className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-all border border-white/10"
              >
                Submit Another Response
              </button>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="p-6 sm:p-10 rounded-3xl bg-slate-900/90 border border-white/10 space-y-8 backdrop-blur-md shadow-2xl"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0066FF]/10 border border-[#0066FF]/30 text-[#00B8F0] font-mono text-[11px] font-bold uppercase tracking-wider mb-3">
                <MessageSquare size={14} />
                <span>LIVE WORKSHOP FEEDBACK FORM</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
                AI Accelerator Workshop Survey
              </h1>
              <p className="text-xs font-mono text-slate-400 mt-1">
                Rate your learning experience, content clarity, and venue/session quality.
              </p>
            </div>

            {/* Ratings Section */}
            <div className="p-6 rounded-2xl bg-slate-950 border border-white/5 space-y-6">
              {renderStarPicker("Overall Experience Rating *", formData.overallRating, (val) =>
                setFormData({ ...formData, overallRating: val })
              )}

              {renderStarPicker("Content & Technical Depth *", formData.contentRating, (val) =>
                setFormData({ ...formData, contentRating: val })
              )}

              {renderStarPicker("Instructor & Venue Quality *", formData.venueRating, (val) =>
                setFormData({ ...formData, venueRating: val })
              )}

              {/* Recommendation */}
              <div className="space-y-2 font-mono text-xs pt-2 border-t border-white/5">
                <label className="block text-slate-300 font-bold">Would you recommend this workshop?</label>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, recommend: "yes" })}
                    className={`px-5 py-2.5 rounded-xl font-bold border transition-all cursor-pointer flex items-center gap-2 ${
                      formData.recommend === "yes"
                        ? "bg-emerald-500 text-slate-950 border-emerald-500"
                        : "bg-slate-900 text-slate-400 border-white/10"
                    }`}
                  >
                    <ThumbsUp size={14} /> Yes, Absolutely!
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, recommend: "no" })}
                    className={`px-5 py-2.5 rounded-xl font-bold border transition-all cursor-pointer flex items-center gap-2 ${
                      formData.recommend === "no"
                        ? "bg-rose-600 text-white border-rose-600"
                        : "bg-slate-900 text-slate-400 border-white/10"
                    }`}
                  >
                    <ThumbsDown size={14} /> Needs Improvement
                  </button>
                </div>
              </div>
            </div>

            {/* Attendee Details */}
            <div className="space-y-4 font-mono text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1.5">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ananya Roy"
                    value={formData.participantName}
                    onChange={(e) => setFormData({ ...formData, participantName: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-[#0066FF]"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1.5">Email Address</label>
                  <input
                    type="email"
                    placeholder="e.g. ananya@domain.com"
                    value={formData.participantEmail}
                    onChange={(e) => setFormData({ ...formData, participantEmail: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-[#0066FF]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1.5">Registration Code (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. BMZ-AIF-2026-88"
                    value={formData.registrationCode}
                    onChange={(e) => setFormData({ ...formData, registrationCode: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-[#0066FF]"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1.5">Attendee Category</label>
                  <select
                    value={formData.attendeeType}
                    onChange={(e) => setFormData({ ...formData, attendeeType: e.target.value as any })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-[#0066FF]"
                  >
                    <option value="student">Student / Learner</option>
                    <option value="professional">Working Professional</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Comments & Takeaways */}
            <div className="space-y-4 font-mono text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1.5">Key Takeaways &amp; Favorite Module</label>
                <textarea
                  rows={3}
                  placeholder="What was your main technical takeaway from the session?"
                  value={formData.takeaways}
                  onChange={(e) => setFormData({ ...formData, takeaways: e.target.value })}
                  className="w-full p-4 rounded-xl bg-slate-950 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-[#0066FF]"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1.5">Additional Comments / Suggestions</label>
                <textarea
                  rows={2}
                  placeholder="Any feedback for upcoming cohorts?"
                  value={formData.comments}
                  onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                  className="w-full p-4 rounded-xl bg-slate-950 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-[#0066FF]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-[#0066FF] hover:bg-[#0052CC] text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 shadow-lg shadow-blue-500/25"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Submitting Feedback...</span>
                </>
              ) : (
                <>
                  <Send size={16} />
                  <span>Submit Live Feedback</span>
                </>
              )}
            </button>
          </form>
        )}

      </div>
    </main>
  );
}
