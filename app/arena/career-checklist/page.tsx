"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CheckSquare,
  Square,
  Copy,
  Check,
  Send,
  Linkedin,
  Mail,
  Briefcase,
  Target,
  Sparkles,
  ArrowRight,
  TrendingUp,
  FileText,
  UserCheck
} from "lucide-react";

export default function CareerChecklistPage() {
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const toggleTask = (taskId: string) => {
    setCompletedTasks((prev) => {
      const next = { ...prev, [taskId]: !prev[taskId] };
      // Log Telemetry
      fetch("/api/arena/telemetry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventType: "CAREER_CHECKLIST_TOGGLE",
          metadata: { taskId, state: next[taskId] }
        })
      }).catch(() => {});
      return next;
    });
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);

    fetch("/api/arena/telemetry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventType: "OUTREACH_TEMPLATE_COPIED",
        metadata: { templateId: id }
      })
    }).catch(() => {});
  };

  const CHECKLIST_PHASES = [
    {
      phaseName: "Phase 1: Architecture-First Profile Surgery",
      badge: "Foundations",
      tasks: [
        { id: "p1_1", title: "ATS Headline Optimization", desc: "Change headline to: '[Role Aspirant] | Building [Key Production System] (PyTorch / Rust / WebGPU) | Botmartz 45D Cohort'." },
        { id: "p1_2", title: "Pin Architecture Diagram Carousel", desc: "Create a 3-slide diagram on Figma showing system topology, failure rate benchmarks, and latency stats." },
        { id: "p1_3", title: "Pin 90-Second Loom Demo Video", desc: "Record a concise walkthrough of your deployed repo showing live request benchmarks." },
        { id: "p1_4", title: "Add Botmartz Verification Link in About", desc: "Link your verified `/member/[username]` proof-of-work heatmap directly in your LinkedIn bio." }
      ]
    },
    {
      phaseName: "Phase 2: Proof-of-Work Social Loops",
      badge: "Shipping Proof",
      tasks: [
        { id: "p2_1", title: "Day 1-45 Daily Build Log Snippet", desc: "Post concise 150-word updates with commit hash & one architectural trade-off learned." },
        { id: "p2_2", title: "Publish Failure & Stress Test Report", desc: "Disclose your system's p95 latency, cost per request, and how you fixed your primary bottleneck." },
        { id: "p2_3", title: "Tag Target Tech Stack & Founders", desc: "Tag the open-source library authors and engineering leaders whose tech you deployed (e.g. Qdrant, MONAI, LangGraph)." }
      ]
    },
    {
      phaseName: "Phase 3: Founder & HR Cold Outreach Engine",
      badge: "Interview Conversion",
      tasks: [
        { id: "p3_1", title: "Identify 15 Target Ecosystem Companies", desc: "Select 15 companies across your domain from the Ecosystems Radar (Defence, FinTech, HealthTech)." },
        { id: "p3_2", title: "Find VP of Engineering / CTO Verified Email", desc: "Use Apollo.io / Hunter.co or check their GitHub commit metadata for official engineering emails." },
        { id: "p3_3", title: "Send 3 Personalized Cold Pitches / Day", desc: "Use the architecture-first email template below demonstrating how your project solves their specific engineering pain." }
      ]
    }
  ];

  const totalTasks = CHECKLIST_PHASES.reduce((acc, p) => acc + p.tasks.length, 0);
  const doneCount = Object.values(completedTasks).filter(Boolean).length;
  const progressPercent = Math.round((doneCount / totalTasks) * 100);

  const OUTREACH_TEMPLATES = [
    {
      id: "eng_founder_template",
      title: "Cold Email to VP of Engineering / CTO",
      role: "Engineering Leadership",
      subject: "Solved [Specific Bottleneck / Latency Issue] for [Target System] — Quick Demo & Code",
      body: `Hi [Name],

I've been following [Company Name]'s work on [Specific Product Feature / Infrastructure]. 

I noticed teams scaling [Domain, e.g. multi-spectral remote sensing / L2 order books] often face bottlenecks in [Specific Pain, e.g. p95 latency spikes / frame drops under GPS denial].

Over the past 45 days in the Botmartz Builders Cohort, I built an end-to-end production system solving this exact issue:
- System: [Your Project Name, e.g. Synthetic Aperture Radar Flood Segmenter]
- Benchmarks: [Key Metric, e.g. 0.88 Dice Score, sub-35ms p95 latency, zero memory leaks]
- Live Code & Architecture: [Your GitHub Repo / Live Link]
- 90s Video Demo: [Your Loom / YouTube Link]

I'd love to contribute to [Company Name]'s engineering team as an intern / junior engineer. Are you open for a 10-minute technical chat this Thursday?

Best regards,
[Your Name]
[Your Phone / WhatsApp]
[Your Botmartz Profile Link]`
    },
    {
      id: "hr_recruiter_template",
      title: "LinkedIn DM to Technical Recruiter / Talent Lead",
      role: "HR & Talent Acquisition",
      subject: "N/A (LinkedIn Message)",
      body: `Hi [Name],

I noticed you're leading technical hiring for [Role Name, e.g. AI / Backend Engineers] at [Company Name].

I recently shipped [Your Project Name], an end-to-end production system ([List 2 Tech, e.g. PyTorch, TensorRT, Rust]) evaluated under strict production SLAs ([Metric, e.g. 60fps edge inference / sub-10ms matching]).

You can review my verified proof-of-work heatmap, daily GitHub commits, and architecture documentation here:
👉 [Your Botmartz Profile Link]
👉 [GitHub Repository]

I would love to be considered for open engineering roles at [Company Name]. Would you be available for a brief introductory call?

Best,
[Your Name]`
    }
  ];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 pb-20">
      {/* Header Banner */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 text-[#0066FF] font-mono text-xs font-bold uppercase tracking-wider mb-2 border border-blue-200">
                <Briefcase size={14} /> Career Flywheel Operating System
              </div>
              <h1 className="text-3xl font-extrabold text-slate-900">
                LinkedIn &amp; HR Cold Outreach Checklists
              </h1>
              <p className="text-slate-600 text-xs sm:text-sm font-mono mt-1">
                Turn your proof-of-work into inbound interview calls with structured profile surgery, social loops, and engineering founder email templates.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/arena/shippers"
                className="px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-xs"
              >
                🚀 Claim 15 Company Referrals
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-8 space-y-8">
        
        {/* Progress Overview Bar */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-mono text-slate-500 uppercase font-bold mb-1">
              Your Career Checklist Progress ({doneCount}/{totalTasks} Completed)
            </div>
            <div className="text-2xl font-extrabold text-slate-900">
              {progressPercent}% Complete
            </div>
          </div>

          <div className="w-full sm:w-72 bg-slate-100 rounded-full h-3.5 border border-slate-200 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Checklists Phases */}
        <div className="space-y-6">
          {CHECKLIST_PHASES.map((phase, pIdx) => (
            <div key={pIdx} className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
              <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100 font-mono">
                <h2 className="text-base font-bold text-slate-900 font-sans">
                  {phase.phaseName}
                </h2>
                <span className="px-2.5 py-0.5 rounded bg-blue-50 text-[#0066FF] font-bold text-[10px] border border-blue-200">
                  {phase.badge}
                </span>
              </div>

              <div className="space-y-3 font-mono text-xs">
                {phase.tasks.map((task) => {
                  const isDone = !!completedTasks[task.id];
                  return (
                    <div
                      key={task.id}
                      onClick={() => toggleTask(task.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                        isDone
                          ? "bg-emerald-50/60 border-emerald-300 text-slate-800"
                          : "bg-slate-50 border-slate-200 hover:bg-slate-100/80 text-slate-700"
                      }`}
                    >
                      <button className="mt-0.5 shrink-0 text-slate-600">
                        {isDone ? (
                          <CheckSquare className="text-emerald-600" size={18} />
                        ) : (
                          <Square className="text-slate-400" size={18} />
                        )}
                      </button>

                      <div>
                        <div className={`font-bold font-sans text-xs ${isDone ? "line-through text-slate-500" : "text-slate-900"}`}>
                          {task.title}
                        </div>
                        <p className="text-[11px] text-slate-500 font-sans mt-0.5">
                          {task.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Cold Outreach Templates Section */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#0066FF] uppercase mb-1">
              <Mail size={15} /> High-Conversion Templates
            </div>
            <h2 className="text-xl font-bold text-slate-900 font-sans">
              Personalized Engineering Founder &amp; HR Cold Outreach Scripts
            </h2>
            <p className="text-xs text-slate-500 font-mono mt-1">
              Copy and personalize these proven templates with your actual benchmarks and GitHub links.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {OUTREACH_TEMPLATES.map((tmpl) => (
              <div key={tmpl.id} className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between font-mono text-xs">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="font-bold text-slate-900 text-sm font-sans">{tmpl.title}</span>
                    <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 font-bold text-[10px] border border-purple-200">
                      {tmpl.role}
                    </span>
                  </div>

                  <div className="p-3 bg-white border border-slate-200 rounded-xl mb-3 text-[11px] text-slate-600 font-sans">
                    <strong>Subject:</strong> {tmpl.subject}
                  </div>

                  <pre className="p-4 bg-slate-950 text-slate-200 rounded-xl text-[11px] font-mono whitespace-pre-wrap overflow-x-auto border border-slate-800 leading-relaxed">
                    {tmpl.body}
                  </pre>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200 flex justify-end">
                  <button
                    onClick={() => copyToClipboard(tmpl.body, tmpl.id)}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    {copiedId === tmpl.id ? (
                      <>
                        <Check size={13} className="text-emerald-400" />
                        <span>Copied Script!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={13} />
                        <span>Copy Script</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
