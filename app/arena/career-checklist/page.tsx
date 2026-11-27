"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
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
  Coins,
  Lock,
  Loader2
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import BuilderProfileGateModal from "@/app/_components/BuilderProfileGateModal";
import AuthGate from "@/app/_components/AuthGate";

export default function CareerChecklistPage() {
  const { user, studentProfile, loading } = useAuth();
  const [showGateModal, setShowGateModal] = useState(false);

  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [loadingData, setLoadingData] = useState(false);

  // UGC LinkedIn Composer State
  const [dayNumber, setDayNumber] = useState<number>(1);
  const [projectTitle, setProjectTitle] = useState<string>("Multispectral Satellite Geospatial AI");
  const [techStackUsed, setTechStackUsed] = useState<string>("PyTorch, GDAL, Sentinel-2 Bands");
  const [todayLearning, setTodayLearning] = useState<string>("Implemented NDVI raster band mathematics and cut tile processing latency by 45%.");
  const [commitUrl, setCommitUrl] = useState<string>("https://github.com/my-username/botmartz-project");
  const [linkedInPostUrl, setLinkedInPostUrl] = useState<string>("");
  const [submittedUGC, setSubmittedUGC] = useState<boolean>(false);
  const [pointsEarned, setPointsEarned] = useState<number>(0);
  const [submittingUgc, setSubmittingUgc] = useState<boolean>(false);

  // Fetch saved checklist from backend on load
  useEffect(() => {
    if (user?.email) {
      setLoadingData(true);
      fetch(`/api/arena/career-checklist?email=${encodeURIComponent(user.email)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.checklist) {
            setCompletedTasks(data.checklist.completedTasks || {});
            setSubmittedUGC(Boolean(data.checklist.submittedUGC));
            setPointsEarned(data.checklist.pointsEarned || 0);
          }
        })
        .catch((err) => console.error("Error fetching checklist:", err))
        .finally(() => setLoadingData(false));
    }
  }, [user]);

  const toggleTask = (taskId: string) => {
    if (!user?.email) {
      window.location.href = "/login?redirect=/arena/career-checklist";
      return;
    }

    setCompletedTasks((prev) => {
      const next = { ...prev, [taskId]: !prev[taskId] };
      
      // Sync with backend API
      fetch("/api/arena/career-checklist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          name: user.displayName || studentProfile?.displayName,
          completedTasks: next,
        }),
      }).catch((err) => console.error("Sync error:", err));

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

  const handleSubmitLinkedInUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.email || !studentProfile?.collegeName) {
      setShowGateModal(true);
      return;
    }
    if (!linkedInPostUrl) return;

    setSubmittingUgc(true);

    try {
      const res = await fetch("/api/arena/career-checklist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          name: user.displayName || studentProfile?.displayName,
          ugcSubmission: {
            dayNumber,
            projectTitle,
            techStackUsed,
            commitUrl,
            linkedInPostUrl,
          },
        }),
      });

      const data = await res.json();
      if (data.success) {
        setPointsEarned((prev) => prev + 50);
        setSubmittedUGC(true);
      }
    } catch (err) {
      console.error("Error submitting UGC:", err);
    } finally {
      setSubmittingUgc(false);
    }
  };

  const CHECKLIST_PHASES = [
    {
      phaseName: "Phase 1: Architecture-First Profile Optimization",
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

I've been following [Company Name]'s recent work on [Topic, e.g. multi-tenant vector search / low-latency order routing].

I recently engineered and benchmarked [Your Project Name, e.g. A multi-spectral Sentinel-2 satellite pipeline in PyTorch & Qdrant / Rust L3 Order Book] as part of the Botmartz Builders Cohort.

Key Architecture Wins:
1. Achieved sub-150ms p95 latency under 5,000 req/sec load.
2. Built custom zero-copy memory pipelines in Docker.
3. Automated test suite achieving 92% coverage with strict SLA verification.

I documented the failure teardown and architecture specs here:
- Live Repo & Tests: [GitHub URL]
- Architecture Spec: [PRD Link]

Would you be open to a 10-minute chat about engineering roles at [Company Name]?

Best,
[Your Name]
[LinkedIn Profile Link]`
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
    <AuthGate
      featureTitle="Career OS & Profile Strategy"
      featureDescription="Sign in with your builder profile to access the 8-step recruiter checklist, copy cold outreach templates, and claim +50 Karma Coins for LinkedIn posts."
    >
      <div className="min-h-screen bg-white text-slate-800 pt-24 pb-24 font-sans">
        
        {/* Header Banner */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2">
          <motion.div
            initial={{ opacity: 0, y: -20, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="bg-[#162774] text-white rounded-3xl p-7 sm:p-10 border border-white/15 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(255, 255, 255, 0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.06) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          >
            <div className="max-w-3xl">
              <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
                LinkedIn Build Log &amp; Career Checklist
              </h1>
              <p className="text-blue-100/90 text-sm sm:text-base font-sans font-medium mt-3 leading-relaxed">
                Follow two clear steps: (1) Publish your daily LinkedIn build update to earn +50 Karma Coins, and (2) Complete your 10-step recruiter readiness checklist saved directly in Firestore.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0 font-sans text-sm">
              <Link
                href="/profile"
                className="group relative overflow-hidden px-6 py-3.5 rounded-full bg-white text-[#162774] font-extrabold transition-all shadow-md flex items-center gap-2.5"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-blue-50 -translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-in-out"
                />
                <span className="relative z-10">View Builder Profile</span>
                <span className="relative z-10 w-6 h-6 rounded-full bg-[#162774] text-white flex items-center justify-center transition-transform duration-300 group-hover:rotate-[60deg]">
                  <ArrowRight size={12} />
                </span>
              </Link>
            </div>
          </motion.div>
        </div>

      {/* Auth Gating Notice if not logged in */}
      {!user && !loading && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          <div className="p-8 rounded-3xl bg-[#162774] text-white border border-white/15 shadow-xl font-sans">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-extrabold font-sans text-white">
                  Sign In to Save Your Career Checklist &amp; Claim +50 Karma Coins
                </h2>
                <p className="text-blue-100/85 max-w-2xl leading-relaxed text-sm sm:text-base font-medium">
                  To prevent unverified activity and accurately track your milestone readiness for the 15-company referral dispatch, your checklist tasks and LinkedIn proof links are saved directly to your verified profile.
                </p>
              </div>
              <Link
                href="/login?redirect=/arena/career-checklist"
                className="px-7 py-4 rounded-2xl bg-white hover:bg-blue-50 text-[#162774] font-extrabold text-sm uppercase tracking-wider transition-all shadow-md shrink-0 text-center flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Sign In to Track Progress</span>
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Logged in student badge */}
      {user && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5 rounded-2xl bg-[#F4F6FB] border border-[#162774]/20 border-l-4 border-l-[#162774] text-[#162774] font-sans text-sm shadow-xs">
            <div className="font-semibold">
              Verified Student: <strong className="font-extrabold">{user.email}</strong> &bull; Real-time Firestore sync active ({doneCount}/{totalTasks} tasks completed)
            </div>
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="font-extrabold text-white bg-[#162774] px-4 py-1.5 rounded-full text-xs shadow-xs">
                +{pointsEarned} Karma Coins Earned
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-10">
        
        {/* =========================================================================
            SECTION 1: STEP 1 — VIRAL LINKEDIN POST COMPOSER (+50 KARMA)
        ========================================================================= */}
        <motion.div
          initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="bg-[#162774] text-white rounded-3xl p-6 sm:p-9 border border-white/15 shadow-2xl"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255, 255, 255, 0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.06) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/15 mb-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-sans tracking-tight">
                Compose Today&apos;s Build Log &amp; Earn +50 Karma Points
              </h2>
            </div>

            <div className="px-4 py-2 rounded-full bg-white text-[#162774] font-sans text-xs font-extrabold shrink-0 shadow-sm">
              {pointsEarned > 0 ? `+${pointsEarned} Points Earned Today` : "+50 Points per Post"}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-sans text-sm">
            {/* Input Controls */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-blue-100 font-bold mb-1.5 uppercase text-xs tracking-wider">Cohort Day # (1-45)</label>
                  <input
                    type="number"
                    min={1}
                    max={45}
                    value={dayNumber}
                    onChange={(e) => setDayNumber(parseInt(e.target.value) || 1)}
                    className="w-full bg-white border border-white/25 text-slate-800 font-medium text-sm sm:text-base rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </div>
                <div>
                  <label className="block text-blue-100 font-bold mb-1.5 uppercase text-xs tracking-wider">Current Project Name</label>
                  <input
                    type="text"
                    value={projectTitle}
                    onChange={(e) => setProjectTitle(e.target.value)}
                    className="w-full bg-white border border-white/25 text-slate-800 font-medium text-sm sm:text-base rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-blue-100 font-bold mb-1.5 uppercase text-xs tracking-wider">Technologies Deployed Today</label>
                <input
                  type="text"
                  value={techStackUsed}
                  onChange={(e) => setTechStackUsed(e.target.value)}
                  className="w-full bg-white border border-white/25 text-slate-800 font-medium text-sm sm:text-base rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>

              <div>
                <label className="block text-blue-100 font-bold mb-1.5 uppercase text-xs tracking-wider">Key Architectural Breakthrough / Benchmark</label>
                <textarea
                  rows={2}
                  value={todayLearning}
                  onChange={(e) => setTodayLearning(e.target.value)}
                  className="w-full bg-white border border-white/25 text-slate-800 font-medium text-sm sm:text-base rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>

              <div>
                <label className="block text-blue-100 font-bold mb-1.5 uppercase text-xs tracking-wider">GitHub Commit URL</label>
                <input
                  type="text"
                  value={commitUrl}
                  onChange={(e) => setCommitUrl(e.target.value)}
                  className="w-full bg-white border border-white/25 text-slate-800 font-medium text-sm sm:text-base rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>

              <button
                onClick={handleCopyLinkedInPost}
                className="group relative overflow-hidden w-full py-3.5 rounded-xl bg-white hover:bg-blue-50 text-[#162774] font-sans font-extrabold text-sm sm:text-base transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md"
              >
                {copiedId === "linkedin_ugc" ? <Check size={16} /> : <Copy size={16} />}
                <span>{copiedId === "linkedin_ugc" ? "Copied! Opening LinkedIn..." : "Copy Formatted Post & Open LinkedIn"}</span>
              </button>
            </div>

            {/* Generated Preview & Submission */}
            <div className="bg-white/10 border border-white/15 rounded-2xl p-5 flex flex-col justify-between backdrop-blur-xs">
              <div>
                <div className="text-xs text-blue-100 uppercase font-extrabold tracking-wider mb-2.5 flex items-center justify-between">
                  <span>Live Post Preview</span>
                  <span className="text-white">Ready to Publish</span>
                </div>
                <pre className="text-sm text-white font-sans font-medium whitespace-pre-wrap leading-relaxed bg-[#070E54]/80 p-4 rounded-xl border border-white/15 max-h-60 overflow-y-auto">
                  {generatedLinkedInPost}
                </pre>
              </div>

              {/* Submit Post Link */}
              <form onSubmit={handleSubmitLinkedInUrl} className="mt-4 pt-4 border-t border-white/15">
                <label className="block text-blue-100 font-bold mb-2 text-xs uppercase tracking-wider">
                  Paste Your Published LinkedIn Post URL for +50 Points:
                </label>
                <div className="flex gap-2.5">
                  <input
                    type="url"
                    required
                    placeholder="https://linkedin.com/posts/..."
                    value={linkedInPostUrl}
                    onChange={(e) => setLinkedInPostUrl(e.target.value)}
                    className="flex-1 bg-white border border-white text-slate-800 font-medium text-sm placeholder:text-slate-400 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                  <button
                    type="submit"
                    className="px-5 py-3 rounded-xl bg-white hover:bg-blue-50 text-[#162774] font-sans font-extrabold text-sm transition-all cursor-pointer shrink-0 shadow-sm"
                  >
                    Claim +50 Points
                  </button>
                </div>
                {submittedUGC && (
                  <p className="text-xs text-white mt-2 font-bold">
                    Verified! +50 Points awarded to your profile.
                  </p>
                )}
              </form>
            </div>
          </div>
        </motion.div>

        {/* =========================================================================
            SECTION 2: 3-TIER VERIFICATION PROTOCOL
        ========================================================================= */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-9 shadow-sm">
          <div className="max-w-3xl mb-7">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#162774] font-sans tracking-tight">
              How Projects Are Verified by Botmartz Engineers
            </h2>
            <p className="text-slate-700 text-sm sm:text-base font-sans font-medium mt-2 leading-relaxed">
              Every project submission passes through 3 rigorous quality gates before unlocking verified credentials and referrals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 font-sans">
            <div className="p-6 rounded-2xl bg-[#F4F6FB] border border-slate-200 border-l-4 border-l-[#162774] flex flex-col justify-between">
              <div>
                <div className="w-8 h-8 rounded-full bg-[#162774] text-white flex items-center justify-center font-extrabold text-xs mb-3.5">
                  01
                </div>
                <h3 className="font-extrabold text-slate-800 text-lg mb-2">Automated CI/CD Test Gate</h3>
                <p className="text-slate-700 text-sm font-medium leading-relaxed mb-4">
                  Automated runners execute your test suite (pytest, cargo test, k6). Must pass 100% unit tests and verify p95 latency thresholds.
                </p>
              </div>
              <span className="text-xs text-[#162774] font-extrabold uppercase tracking-wider">Automated Benchmark Pass</span>
            </div>

            <div className="p-6 rounded-2xl bg-[#F4F6FB] border border-slate-200 border-l-4 border-l-[#162774] flex flex-col justify-between">
              <div>
                <div className="w-8 h-8 rounded-full bg-[#162774] text-white flex items-center justify-center font-extrabold text-xs mb-3.5">
                  02
                </div>
                <h3 className="font-extrabold text-slate-800 text-lg mb-2">Core Engineering Audit</h3>
                <p className="text-slate-700 text-sm font-medium leading-relaxed mb-4">
                  Founder Soham Sharma and the core engineering squad audit code architecture, database indexing, state machines, and README clarity.
                </p>
              </div>
              <span className="text-xs text-[#162774] font-extrabold uppercase tracking-wider">1-on-1 Code Review</span>
            </div>

            <div className="p-6 rounded-2xl bg-[#F4F6FB] border border-slate-200 border-l-4 border-l-[#162774] flex flex-col justify-between">
              <div>
                <div className="w-8 h-8 rounded-full bg-[#162774] text-white flex items-center justify-center font-extrabold text-xs mb-3.5">
                  03
                </div>
                <h3 className="font-extrabold text-slate-800 text-lg mb-2">Peer Red-Team Pen-Test</h3>
                <p className="text-slate-700 text-sm font-medium leading-relaxed mb-4">
                  Student pen-testers attack live staging deployments to hunt OWASP Top 10 vulnerabilities, SSRF, and prompt injections before sign-off.
                </p>
              </div>
              <span className="text-xs text-[#162774] font-extrabold uppercase tracking-wider">Security Hardened</span>
            </div>
          </div>
        </div>

        {/* =========================================================================
            SECTION 3: CAREER CHECKLIST & OUTREACH TEMPLATES
        ========================================================================= */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-9 shadow-sm">
          
          {/* Progress Overview Bar */}
          <div className="pb-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-sans text-[#162774] uppercase font-extrabold tracking-wider mb-2">
                Your Career Conversion Progress ({doneCount}/{totalTasks} Completed)
              </div>
              <div className="w-full sm:w-96 bg-[#F4F6FB] rounded-full h-3.5 overflow-hidden border border-slate-200">
                <div
                  className="bg-[#162774] h-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <div className="font-sans text-sm font-extrabold text-[#162774]">
              {progressPercent}% Complete
            </div>
          </div>

          {/* Checklist Phases */}
          <div className="mt-7 space-y-8">
            {CHECKLIST_PHASES.map((phase) => (
              <div key={phase.phaseName} className="space-y-4">
                <h3 className="text-lg sm:text-xl font-extrabold text-[#162774] font-sans">
                  {phase.phaseName}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {phase.tasks.map((task) => {
                    const isDone = !!completedTasks[task.id];
                    return (
                      <button
                        key={task.id}
                        onClick={() => toggleTask(task.id)}
                        className={`p-5 rounded-2xl border text-left transition-all flex items-start gap-3.5 cursor-pointer ${
                          isDone
                            ? "bg-blue-50/60 border-[#162774]/40 text-slate-800"
                            : "bg-[#F4F6FB] hover:bg-white border-slate-200 hover:border-[#162774] text-slate-700"
                        }`}
                      >
                        <div className="mt-0.5 shrink-0">
                          {isDone ? (
                            <CheckSquare className="text-[#162774]" size={20} />
                          ) : (
                            <Square className="text-slate-400" size={20} />
                          )}
                        </div>
                        <div>
                          <div className={`text-sm sm:text-base font-extrabold ${isDone ? "line-through text-slate-500" : "text-slate-800"}`}>
                            {task.title}
                          </div>
                          <div className="text-sm font-medium text-slate-600 mt-1.5 leading-relaxed">
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
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#162774] font-sans tracking-tight">
                Cold Email &amp; LinkedIn DM Pitch Formats
              </h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-sans">
              {OUTREACH_TEMPLATES.map((tmpl) => (
                <div key={tmpl.id} className="p-6 rounded-2xl bg-[#F4F6FB] border border-slate-200 border-l-4 border-l-[#162774] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="font-extrabold text-base sm:text-lg text-slate-800">{tmpl.title}</span>
                      <span className="text-xs font-bold text-[#162774] uppercase tracking-wider shrink-0">{tmpl.role}</span>
                    </div>
                    <div className="text-sm text-slate-700 font-medium mb-3">
                      <strong className="font-extrabold text-slate-800">Subject:</strong> {tmpl.subject}
                    </div>
                    <pre className="text-sm font-sans font-medium text-slate-700 bg-white p-4 rounded-xl border border-slate-200 whitespace-pre-wrap max-h-64 overflow-y-auto leading-relaxed mb-4">
                      {tmpl.body}
                    </pre>
                  </div>

                  <button
                    onClick={() => copyToClipboard(tmpl.body, tmpl.id)}
                    className="w-full py-3 rounded-xl bg-[#162774] hover:bg-[#1D3189] text-white font-extrabold text-sm transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm"
                  >
                    {copiedId === tmpl.id ? <Check size={15} /> : <Copy size={15} />}
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
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-9 shadow-sm">
          <div className="max-w-3xl mb-7">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#162774] font-sans tracking-tight">
              Where to Apply After Completing Projects
            </h2>
            <p className="text-slate-700 text-sm sm:text-base font-sans font-medium mt-2 leading-relaxed">
              Direct technical career portals hiring builders with verified production portfolio repos:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-sans">
            {TARGET_HIRING_COMPANIES.map((company) => (
              <a
                key={company.name}
                href={company.link}
                target="_blank"
                rel="noopener noreferrer"
                className="p-5 rounded-2xl bg-[#F4F6FB] hover:bg-white border border-slate-200 hover:border-[#162774] transition-all flex flex-col justify-between group shadow-xs hover:shadow-md"
              >
                <div>
                  <div className="font-extrabold text-slate-800 text-base sm:text-lg group-hover:text-[#162774] transition-colors mb-1">
                    {company.name}
                  </div>
                  <div className="text-sm text-slate-600 font-medium">{company.category}</div>
                </div>
                <div className="mt-4 text-xs text-[#162774] font-extrabold uppercase tracking-wider">
                  Open Portal &rarr;
                </div>
              </a>
            ))}
          </div>
        </div>

      </div>

      {/* Builder Profile Gate Modal */}
      <BuilderProfileGateModal
        isOpen={showGateModal}
        onClose={() => setShowGateModal(false)}
        title="Complete Profile to Claim UGC Rewards"
        description="To credit your +50 Karma Coins and verify your LinkedIn proof link for hiring managers, an authenticated student profile is mandatory."
        requiredActionName="Claiming UGC Rewards"
      />

      </div>
    </AuthGate>
  );
}
