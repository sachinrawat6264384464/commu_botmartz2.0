"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CheckSquare,
  Square,
  Copy,
  Check,
  CheckCircle2,
  Send,
  Linkedin,
  Mail,
  Briefcase,
  Target,
  Sparkles,
  ArrowRight,
  TrendingUp,
  FileText,
  UserCheck,
  Award,
  ShieldCheck,
  ExternalLink,
  Zap,
  Globe,
  Coins
} from "lucide-react";

export default function CareerChecklistPage() {
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // UGC LinkedIn Composer State
  const [dayNumber, setDayNumber] = useState<number>(1);
  const [projectTitle, setProjectTitle] = useState<string>("Multispectral Satellite Geospatial AI");
  const [techStackUsed, setTechStackUsed] = useState<string>("PyTorch, GDAL, Sentinel-2 Bands");
  const [todayLearning, setTodayLearning] = useState<string>("Implemented NDVI raster band mathematics and cut tile processing latency by 45%.");
  const [commitUrl, setCommitUrl] = useState<string>("https://github.com/my-username/botmartz-project");
  const [linkedInPostUrl, setLinkedInPostUrl] = useState<string>("");
  const [submittedUGC, setSubmittedUGC] = useState<boolean>(false);
  const [pointsEarned, setPointsEarned] = useState<number>(0);

  const toggleTask = (taskId: string) => {
    setCompletedTasks((prev) => {
      const next = { ...prev, [taskId]: !prev[taskId] };
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

  // Generate LinkedIn Post
  const generatedLinkedInPost = `Day ${dayNumber}/45 of building production engineering systems at the Botmartz Builders Virtual Internship!

Today's System: ${projectTitle}
Tech Stack: ${techStackUsed}

What I Built & Benchmarked:
${todayLearning}

Proof-of-Work Artifacts:
GitHub Commit: ${commitUrl}
Verified Profile Heatmap: https://community.botmartz.com/profile

Building in public alongside 500+ builders across India at Indore AI Hub.

#BotmartzInternship #BuildInPublic #IndoreAIHub #Engineering #SoftwareEngineering #Indore`;

  const handleCopyLinkedInPost = () => {
    copyToClipboard(generatedLinkedInPost, "linkedin_ugc");
    window.open("https://www.linkedin.com/feed/", "_blank");
  };

  const handleSubmitLinkedInUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkedInPostUrl) return;

    setPointsEarned((prev) => prev + 50);
    setSubmittedUGC(true);

    fetch("/api/arena/telemetry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventType: "LINKEDIN_UGC_SUBMITTED",
        metadata: { url: linkedInPostUrl, day: dayNumber, project: projectTitle }
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
- Botmartz Profile: [Your Botmartz Profile Link]
- GitHub Repository: [GitHub Repository]

I would love to be considered for open engineering roles at [Company Name]. Would you be available for a brief introductory call?

Best,
[Your Name]`
    }
  ];

  const TARGET_HIRING_COMPANIES = [
    { name: "Razorpay", category: "FinTech & Payments", link: "https://razorpay.com/jobs/" },
    { name: "CRED", category: "High-Scale Consumer", link: "https://cred.club/careers" },
    { name: "Sarvam AI", category: "Foundation AI", link: "https://www.sarvam.ai/careers" },
    { name: "IdeaForge", category: "UAV & Defence AI", link: "https://ideaforge.co.in/careers" },
    { name: "Postman", category: "Developer Tools", link: "https://www.postman.com/company/careers/" },
    { name: "Qdrant", category: "Vector Database", link: "https://qdrant.tech/careers/" },
    { name: "Tonbo Imaging", category: "Electro-Optics", link: "https://tonboimaging.com/careers/" },
    { name: "BrowserStack", category: "Cloud Infrastructure", link: "https://www.browserstack.com/careers" }
  ];

  return (
    <div className="min-h-screen bg-[#FAFCFF] text-slate-900 pb-24 font-sans selection:bg-[#0066FF] selection:text-white">
      
      {/* Header Banner */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 text-[#0066FF] font-mono text-xs font-bold uppercase tracking-wider mb-3">
                <Target size={14} /> Career Growth &amp; Proof-of-Work Referral Engine
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                LinkedIn UGC &amp; Career Conversion Checklist
              </h1>
              <p className="text-slate-600 text-xs sm:text-sm font-mono mt-2 leading-relaxed">
                Turn your daily proof-of-work into inbound recruiter interview calls. Compose daily LinkedIn progress updates, submit your post links to earn +50 Karma Coins, and unlock 15 direct tech company referrals.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0 font-mono text-xs">
              <Link
                href="/arena/shippers"
                className="px-5 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold uppercase tracking-wider transition-all shadow-xs"
              >
                Claim 15 Referrals
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        
        {/* =========================================================================
            SECTION 1: VIRAL LINKEDIN POST COMPOSER & UGC REWARDS (+50 KARMA)
        ========================================================================= */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-indigo-800/80 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-indigo-900 mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 font-mono text-[11px] font-bold uppercase tracking-wider mb-2 border border-indigo-500/30">
                <Linkedin size={13} /> Viral UGC &amp; Daily LinkedIn Post Engine
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white font-sans">
                Compose Today's Build Log &amp; Earn +50 Karma Points
              </h2>
            </div>

            <div className="px-4 py-2 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono text-xs font-bold flex items-center gap-2 shrink-0">
              <Coins size={16} className="text-amber-400" />
              <span>{pointsEarned > 0 ? `+${pointsEarned} Points Earned Today` : "+50 Points per Post"}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-mono text-xs">
            {/* Input Controls */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-bold mb-1 uppercase text-[10px]">Cohort Day # (1-45):</label>
                  <input
                    type="number"
                    min={1}
                    max={45}
                    value={dayNumber}
                    onChange={(e) => setDayNumber(parseInt(e.target.value) || 1)}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 focus:outline-none focus:border-[#00B8F0]"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1 uppercase text-[10px]">Current Project Name:</label>
                  <input
                    type="text"
                    value={projectTitle}
                    onChange={(e) => setProjectTitle(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 focus:outline-none focus:border-[#00B8F0]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1 uppercase text-[10px]">Technologies Deployed Today:</label>
                <input
                  type="text"
                  value={techStackUsed}
                  onChange={(e) => setTechStackUsed(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 focus:outline-none focus:border-[#00B8F0]"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1 uppercase text-[10px]">Key Architectural Breakthrough / Benchmark:</label>
                <textarea
                  rows={2}
                  value={todayLearning}
                  onChange={(e) => setTodayLearning(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 focus:outline-none focus:border-[#00B8F0]"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1 uppercase text-[10px]">GitHub Commit URL:</label>
                <input
                  type="text"
                  value={commitUrl}
                  onChange={(e) => setCommitUrl(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 focus:outline-none focus:border-[#00B8F0]"
                />
              </div>

              <button
                onClick={handleCopyLinkedInPost}
                className="w-full py-3 rounded-xl bg-[#0066FF] hover:bg-[#0052CC] text-white font-bold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md"
              >
                {copiedId === "linkedin_ugc" ? <Check size={14} /> : <Copy size={14} />}
                <span>{copiedId === "linkedin_ugc" ? "Copied! Opening LinkedIn..." : "Copy Formatted Post & Open LinkedIn"}</span>
              </button>
            </div>

            {/* Generated Preview & Submission */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-bold mb-2 flex items-center justify-between">
                  <span>Live Post Preview:</span>
                  <span className="text-emerald-400">Ready to Publish</span>
                </div>
                <pre className="text-xs text-slate-300 font-mono whitespace-pre-wrap leading-relaxed bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 max-h-56 overflow-y-auto">
                  {generatedLinkedInPost}
                </pre>
              </div>

              {/* Submit Post Link */}
              <form onSubmit={handleSubmitLinkedInUrl} className="mt-4 pt-4 border-t border-slate-800">
                <label className="block text-slate-400 font-bold mb-1 text-[10px] uppercase">
                  Paste Your Published LinkedIn Post URL for +50 Points:
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    required
                    placeholder="https://linkedin.com/posts/..."
                    value={linkedInPostUrl}
                    onChange={(e) => setLinkedInPostUrl(e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-700 text-white placeholder:text-slate-500 rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-400"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all cursor-pointer shrink-0"
                  >
                    Claim +50 Points
                  </button>
                </div>
                {submittedUGC && (
                  <p className="text-[11px] text-emerald-400 mt-1.5 flex items-center gap-1 font-bold">
                    <CheckCircle2 size={13} /> Verified! +50 Points awarded to your profile.
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>

        {/* =========================================================================
            SECTION 2: 3-TIER VERIFICATION PROTOCOL
        ========================================================================= */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
          <div className="max-w-3xl mb-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 font-mono text-xs font-bold uppercase tracking-wider mb-2 border border-emerald-200">
              <ShieldCheck size={14} /> Production Quality Gate Protocol
            </div>
            <h2 className="text-2xl font-bold text-slate-900 font-sans">
              How Projects Are Verified by Botmartz Engineers
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm font-mono mt-1 leading-relaxed">
              Every project submission passes through 3 rigorous quality gates before unlocking verified credentials and referrals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-[#0066FF] flex items-center justify-center font-bold mb-3">
                1
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1.5 font-sans">Automated CI/CD Test Gate</h3>
              <p className="text-slate-600 text-[11px] leading-relaxed mb-3 font-mono">
                Automated runners execute your test suite (`pytest`, `cargo test`, `k6`). Must pass 100% unit tests and verify p95 latency thresholds.
              </p>
              <span className="text-[10px] text-[#0066FF] font-bold">Automated Benchmark Pass</span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold mb-3">
                2
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1.5 font-sans">Core Engineering Audit</h3>
              <p className="text-slate-600 text-[11px] leading-relaxed mb-3 font-mono">
                Founder Soham Sharma and the core engineering squad audit code architecture, database indexing, state machines, and README clarity.
              </p>
              <span className="text-[10px] text-purple-700 font-bold">1-on-1 Code Review</span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold mb-3">
                3
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1.5 font-sans">Peer Red-Team Pen-Test</h3>
              <p className="text-slate-600 text-[11px] leading-relaxed mb-3 font-mono">
                Student pen-testers attack live staging deployments to hunt OWASP Top 10 vulnerabilities, SSRF, and prompt injections before sign-off.
              </p>
              <span className="text-[10px] text-rose-700 font-bold">Security Hardened</span>
            </div>
          </div>
        </div>

        {/* =========================================================================
            SECTION 3: CAREER CHECKLIST & OUTREACH TEMPLATES
        ========================================================================= */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
          
          {/* Progress Overview Bar */}
          <div className="pb-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-mono text-slate-500 uppercase font-bold mb-1">
                Your Career Conversion Progress ({doneCount}/{totalTasks} Completed)
              </div>
              <div className="w-full sm:w-80 bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200">
                <div
                  className="bg-[#0066FF] h-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <div className="font-mono text-xs font-bold text-slate-700">
              {progressPercent}% Complete
            </div>
          </div>

          {/* Checklist Phases */}
          <div className="mt-6 space-y-8">
            {CHECKLIST_PHASES.map((phase) => (
              <div key={phase.phaseName} className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 font-mono text-[10px] font-bold uppercase">
                    {phase.badge}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 font-sans">{phase.phaseName}</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {phase.tasks.map((task) => {
                    const isDone = !!completedTasks[task.id];
                    return (
                      <button
                        key={task.id}
                        onClick={() => toggleTask(task.id)}
                        className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3 cursor-pointer ${
                          isDone
                            ? "bg-emerald-50/50 border-emerald-300 text-slate-900"
                            : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700"
                        }`}
                      >
                        <div className="mt-0.5 shrink-0">
                          {isDone ? (
                            <CheckSquare className="text-emerald-600" size={18} />
                          ) : (
                            <Square className="text-slate-400" size={18} />
                          )}
                        </div>
                        <div>
                          <div className={`text-xs font-mono font-bold ${isDone ? "line-through text-slate-500" : "text-slate-900"}`}>
                            {task.title}
                          </div>
                          <div className="text-[11px] font-mono text-slate-500 mt-1 leading-relaxed">
                            {task.desc}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Outreach Templates */}
          <div className="mt-10 pt-8 border-t border-slate-200">
            <div className="max-w-2xl mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#0066FF] font-mono text-xs font-bold uppercase tracking-wider mb-2">
                <Mail size={13} /> Architecture-First Outreach Templates
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-sans">
                Cold Email &amp; LinkedIn DM Pitch Formats
              </h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-mono text-xs">
              {OUTREACH_TEMPLATES.map((tmpl) => (
                <div key={tmpl.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-slate-900 font-sans">{tmpl.title}</span>
                      <span className="text-[10px] text-slate-500 uppercase">{tmpl.role}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mb-3">
                      <strong>Subject:</strong> {tmpl.subject}
                    </div>
                    <pre className="text-[11px] text-slate-700 bg-white p-3.5 rounded-xl border border-slate-200 whitespace-pre-wrap max-h-56 overflow-y-auto leading-relaxed mb-4">
                      {tmpl.body}
                    </pre>
                  </div>

                  <button
                    onClick={() => copyToClipboard(tmpl.body, tmpl.id)}
                    className="w-full py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    {copiedId === tmpl.id ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                    <span>{copiedId === tmpl.id ? "Template Copied!" : "Copy Pitch Template"}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* =========================================================================
            SECTION 4: WHERE TO APPLY — HIRING DIRECTORY
        ========================================================================= */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
          <div className="max-w-3xl mb-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 text-purple-700 font-mono text-xs font-bold uppercase tracking-wider mb-2 border border-purple-200">
              <Briefcase size={14} /> Open Placement Application Directory
            </div>
            <h2 className="text-2xl font-bold text-slate-900 font-sans">
              Where to Apply After Completing Projects
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm font-mono mt-1 leading-relaxed">
              Direct technical career portals hiring builders with verified production portfolio repos:
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
            {TARGET_HIRING_COMPANIES.map((company) => (
              <a
                key={company.name}
                href={company.link}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="font-bold text-slate-900 text-sm group-hover:text-[#0066FF] transition-colors font-sans mb-1">
                    {company.name}
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono">{company.category}</div>
                </div>
                <div className="mt-3 text-[10px] text-[#0066FF] font-bold inline-flex items-center gap-1">
                  <span>Open Portal</span>
                  <ExternalLink size={11} />
                </div>
              </a>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
