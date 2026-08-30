"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  User, 
  ShieldCheck, 
  Flame, 
  Trophy, 
  ExternalLink, 
  Github, 
  Linkedin, 
  Coins, 
  Calendar, 
  Layers, 
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Lock,
  Search,
  BookOpen,
  MessageSquare,
  Edit3,
  Zap,
  Star,
  Activity,
  AlertCircle
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export default function StudentProfilePortal() {
  const { user, studentProfile, loading: authLoading } = useAuth();
  const [searchHandle, setSearchHandle] = useState("");
  const [enrolledProjects, setEnrolledProjects] = useState<any[]>([]);
  const [loadingEnrollments, setLoadingEnrollments] = useState(false);

  useEffect(() => {
    if (user?.email) {
      setLoadingEnrollments(true);
      fetch(`/api/arena/enroll?email=${encodeURIComponent(user.email)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setEnrolledProjects(data.enrollments || []);
          }
        })
        .catch((e) => console.warn("Failed to load user enrollments:", e))
        .finally(() => setLoadingEnrollments(false));
    }
  }, [user?.email]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchHandle.trim()) {
      window.location.href = `/profile/${encodeURIComponent(searchHandle.trim().toLowerCase())}`;
    }
  };

  // Generate 70 dummy heat map days
  const heatmapDays = Array.from({ length: 70 }, (_, i) => ({
    day: i + 1,
    active: i % 3 === 0 || i % 7 === 0 || i > 55,
    level: (i % 4),
  }));

  const isProfileComplete = Boolean(
    studentProfile?.displayName &&
    studentProfile?.collegeName &&
    studentProfile?.degreeBranch &&
    studentProfile?.githubUsername
  );

  return (
    <div className="min-h-screen bg-[#FAFCFF] text-slate-900 pb-24">
      {/* Hero Header */}
      <div className="bg-white border-b border-slate-200 py-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-xs font-mono text-[#0066FF] uppercase font-bold tracking-wider mb-2 flex items-center gap-2">
            <ShieldCheck size={14} className="text-emerald-500" />
            <span>VERIFIED STUDENT &amp; BUILDER WORKSPACE</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-sans tracking-tight">
            Engineering Profile &amp; Internship Portal
          </h1>
          <p className="text-sm text-slate-600 font-mono mt-2 max-w-2xl leading-relaxed">
            Your centralized command center for 50 Arena PRDs, daily proof-of-work streaks, Karma coins, and 15-company referral placement.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-8 space-y-8">
        
        {/* Profile Completeness Alert if Incomplete */}
        {user && !isProfileComplete && (
          <div className="p-5 rounded-3xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs shadow-xs">
            <div className="flex items-start gap-3">
              <AlertCircle size={20} className="text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-900 font-bold block mb-0.5">Complete Your Builder Profile (Mandatory for Earning &amp; Referrals)</strong>
                <p className="text-amber-800 font-sans text-xs">
                  Fill in your College, GitHub username, and Roll No to unlock verified Karma Coin payouts, standup validation, and referral dispatches.
                </p>
              </div>
            </div>
            <Link
              href="/login"
              className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-center shrink-0 transition-all"
            >
              Complete Profile →
            </Link>
          </div>
        )}

        {/* If Logged In: Show Personal Verified Profile Dashboard */}
        {user && studentProfile ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-8">
            
            {/* Profile Header Grid */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
              <div className="flex items-center gap-4">
                {user.photoURL ? (
                  <Image
                    src={user.photoURL}
                    alt={studentProfile.displayName || "User"}
                    width={64}
                    height={64}
                    className="rounded-2xl border border-slate-200 shadow-xs"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-[#0066FF] text-white flex items-center justify-center font-bold text-2xl font-sans">
                    {studentProfile.displayName?.charAt(0) || user.email?.charAt(0).toUpperCase() || "B"}
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-xl font-extrabold text-slate-900 font-sans">
                      {studentProfile.displayName || user.displayName || "Botmartz Builder"}
                    </h2>
                    <span className="text-xs font-mono text-slate-500 font-bold">
                      @{studentProfile.username || user.email?.split("@")[0]}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono font-bold text-[10px] flex items-center gap-1">
                      <ShieldCheck size={11} /> 🎓 Verified Student
                    </span>
                  </div>

                  <p className="text-xs font-mono text-slate-600 mt-1 flex items-center gap-2 flex-wrap">
                    <span>{studentProfile.collegeName || "College Verification Pending"}</span>
                    <span>•</span>
                    <span>{studentProfile.degreeBranch || "B.Tech"}</span>
                    <span>•</span>
                    <span>Class of {studentProfile.graduationYear || "2026"}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-mono text-xs font-bold flex items-center gap-1.5 transition-all"
                >
                  <Edit3 size={13} />
                  <span>Update Profile</span>
                </Link>
                {studentProfile.githubUsername && (
                  <a
                    href={`https://github.com/${studentProfile.githubUsername}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-all"
                  >
                    <Github size={15} />
                  </a>
                )}
                {studentProfile.linkedinUrl && (
                  <a
                    href={studentProfile.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-[#0077B5] text-white hover:opacity-90 transition-all"
                  >
                    <Linkedin size={15} />
                  </a>
                )}
              </div>
            </div>

            {/* Quick Stats Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] text-amber-800 font-bold uppercase block mb-1">Karma Coins</span>
                  <div className="text-2xl font-black text-amber-900 font-mono">
                    {studentProfile.karmaCoins || 100} Coins
                  </div>
                </div>
                <Link
                  href="/arena/wallet"
                  className="text-[11px] text-[#0066FF] hover:underline font-bold mt-2 flex items-center gap-1"
                >
                  <span>+ Buy Credits</span>
                  <ArrowRight size={10} />
                </Link>
              </div>

              <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200">
                <span className="text-[10px] text-purple-800 font-bold uppercase block mb-1">Reputation Tier</span>
                <div className="text-2xl font-black text-purple-900 font-mono">
                  Level {studentProfile.reputationLevel || 1}
                </div>
                <span className="text-[10px] text-slate-500">Shipper Level</span>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200">
                <span className="text-[10px] text-emerald-800 font-bold uppercase block mb-1">Daily Streak</span>
                <div className="text-2xl font-black text-emerald-900 font-mono">
                  {enrolledProjects.length > 0 ? (enrolledProjects[0].streak || 1) : 0} Days
                </div>
                <span className="text-[10px] text-slate-500">Active PoW Commit</span>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200">
                <span className="text-[10px] text-blue-800 font-bold uppercase block mb-1">Enrolled Systems</span>
                <div className="text-2xl font-black text-blue-900 font-mono">
                  {enrolledProjects.length} PRDs
                </div>
                <span className="text-[10px] text-slate-500">Active Projects</span>
              </div>
            </div>

            {/* Enrolled Projects Workspace Section */}
            <div className="space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-sans">Enrolled Arena Projects &amp; Internship Tracks</h3>
                  <p className="text-xs text-slate-500 font-sans mt-0.5">
                    Your active systems under implementation. Daily commits to these repositories build your verified proof-of-work.
                  </p>
                </div>
                <Link
                  href="/arena"
                  className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all flex items-center gap-1"
                >
                  <span>Explore More PRDs</span>
                  <ArrowRight size={12} />
                </Link>
              </div>

              {loadingEnrollments ? (
                <div className="p-8 text-center text-slate-400">Loading your project enrollments...</div>
              ) : enrolledProjects.length === 0 ? (
                <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-3">
                  <p className="text-slate-600 font-sans text-sm">
                    You haven&apos;t enrolled in an Arena Project yet. Pick from 50 production-grade PRDs to start your virtual internship!
                  </p>
                  <Link
                    href="/arena"
                    className="inline-block px-5 py-2.5 rounded-xl bg-[#0066FF] text-white font-bold uppercase tracking-wider shadow-sm hover:bg-[#0052CC] transition-all"
                  >
                    Browse 50 Systems Catalog →
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {enrolledProjects.map((ep) => (
                    <div key={ep.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-4">
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="px-2 py-0.5 rounded bg-blue-50 text-[#0066FF] font-bold text-[10px]">
                            {ep.difficulty || "Hard Tier"}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold text-[10px]">
                            {ep.tier || "Free Explorer"}
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm font-sans mb-1">{ep.projectTitle}</h4>
                        <p className="text-slate-500 text-[11px] font-sans">
                          Role: <strong>{ep.role}</strong> &bull; Format: {ep.teamType} &bull; Enrolled: {ep.createdAt ? new Date(ep.createdAt).toLocaleDateString("en-IN") : "Active"}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-slate-200/60">
                        <Link
                          href={`/arena/${ep.projectId}`}
                          className="flex-1 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-center transition-all"
                        >
                          View PRD
                        </Link>
                        <Link
                          href="/arena/daily-log"
                          className="flex-1 py-2 rounded-xl bg-[#0066FF] hover:bg-[#0052CC] text-white font-bold text-center transition-all"
                        >
                          Log Daily PoW
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 1-Month Paid Internship Track Upgrade Card */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white border border-blue-500/30 space-y-4 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="px-2.5 py-1 rounded-full bg-blue-500/20 text-cyan-300 font-mono text-[10px] font-bold border border-blue-500/40">
                    ⚡ 1-MONTH VIRTUAL AI INTERNSHIP TRACK
                  </span>
                  <h3 className="text-xl font-bold font-sans mt-2">
                    Upgrade to Verified 1-Month Fellow (Solo ₹299 / Squad ₹1,999)
                  </h3>
                  <p className="text-xs text-slate-300 font-sans mt-1 max-w-xl">
                    Get your GitHub codebase audited by founders, receive formal internship completion certification, and unlock 15 direct hiring referrals to AI startups in Indore &amp; Bangalore.
                  </p>
                </div>
                <Link
                  href="/arena/shippers"
                  className="px-6 py-3 rounded-2xl bg-[#0066FF] hover:bg-[#0052CC] text-white font-mono text-xs font-bold uppercase tracking-wider shrink-0 text-center transition-all shadow-lg"
                >
                  Upgrade Track (₹299) →
                </Link>
              </div>
            </div>

            {/* Free Tools Hub */}
            <div className="space-y-4 font-mono text-xs">
              <h3 className="text-base font-bold text-slate-900 font-sans">Free Builder &amp; Career Acceleration Tools</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <Link
                  href="/arena/roadmaps"
                  className="p-4 rounded-2xl bg-blue-50/50 hover:bg-blue-50 border border-blue-200 transition-all block"
                >
                  <BookOpen size={18} className="text-[#0066FF] mb-2" />
                  <div className="font-bold text-slate-900 font-sans text-sm">50 Role Roadmaps</div>
                  <p className="text-slate-500 text-[11px] font-sans mt-1">Step-by-step technical prerequisites for every AI discipline.</p>
                </Link>

                <Link
                  href="/arena/career-checklist"
                  className="p-4 rounded-2xl bg-emerald-50/50 hover:bg-emerald-50 border border-emerald-200 transition-all block"
                >
                  <Star size={18} className="text-emerald-600 mb-2" />
                  <div className="font-bold text-slate-900 font-sans text-sm">LinkedIn UGC Promoter</div>
                  <p className="text-slate-500 text-[11px] font-sans mt-1">Share project updates on LinkedIn and earn +50 Karma per post.</p>
                </Link>

                <Link
                  href="/discussions"
                  className="p-4 rounded-2xl bg-purple-50/50 hover:bg-purple-50 border border-purple-200 transition-all block"
                >
                  <MessageSquare size={18} className="text-purple-600 mb-2" />
                  <div className="font-bold text-slate-900 font-sans text-sm">Discussions &amp; Q&amp;A</div>
                  <p className="text-slate-500 text-[11px] font-sans mt-1">Ask questions, share code snippets, and review architecture.</p>
                </Link>

                <Link
                  href="/arena/calendar"
                  className="p-4 rounded-2xl bg-amber-50/50 hover:bg-amber-50 border border-amber-200 transition-all block"
                >
                  <Calendar size={18} className="text-amber-600 mb-2" />
                  <div className="font-bold text-slate-900 font-sans text-sm">Office Hours &amp; AMAs</div>
                  <p className="text-slate-500 text-[11px] font-sans mt-1">Live weekend mentorship &amp; architecture teardowns with founders.</p>
                </Link>
              </div>
            </div>

            {/* 70-Day Contribution Heatmap */}
            <div>
              <div className="flex items-center justify-between mb-3 font-mono text-xs">
                <span className="font-bold text-slate-900 uppercase">
                  45-Day Cohort Proof-of-Work Heatmap
                </span>
                <span className="text-slate-400 text-[11px]">70-Day Grid</span>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 overflow-x-auto">
                <div className="flex gap-1.5 min-w-max">
                  {heatmapDays.map((d) => (
                    <div
                      key={d.day}
                      title={`Day ${d.day}: ${d.active ? "Verified Commit Logged" : "No Activity"}`}
                      className={`w-3.5 h-3.5 rounded-xs transition-all ${
                        d.level === 0
                          ? "bg-slate-900"
                          : d.level === 1
                          ? "bg-emerald-900"
                          : d.level === 2
                          ? "bg-emerald-700"
                          : d.level === 3
                          ? "bg-emerald-500"
                          : "bg-emerald-400"
                      }`}
                    />
                  ))}
                </div>
                <div className="flex items-center justify-between mt-3 text-[10px] font-mono text-slate-500">
                  <span>14th Sept (Cohort 1 Launch)</span>
                  <div className="flex items-center gap-1.5">
                    <span>Less</span>
                    <div className="w-2.5 h-2.5 rounded-xs bg-slate-900"></div>
                    <div className="w-2.5 h-2.5 rounded-xs bg-emerald-700"></div>
                    <div className="w-2.5 h-2.5 rounded-xs bg-emerald-400"></div>
                    <span>More</span>
                  </div>
                  <span>Diwali 2026</span>
                </div>
              </div>
            </div>

          </div>
        ) : (
          /* Non-logged in banner directing to sign up / login */
          <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-200 text-[#0066FF] flex items-center justify-center mx-auto">
              <Lock size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 font-sans">
                Sign In to Access Your Builder Profile &amp; Tracks
              </h2>
              <p className="text-sm text-slate-600 font-mono mt-2 max-w-lg mx-auto">
                Authentication is mandatory to track your enrolled systems, submit daily logs, earn Karma points, and access 15-company referrals.
              </p>
            </div>

            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link
                href="/login"
                className="px-6 py-3 rounded-2xl bg-[#0066FF] hover:bg-[#0052CC] text-white font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-md"
              >
                Sign In / Register →
              </Link>
              <Link
                href="/arena"
                className="px-6 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono text-xs font-bold uppercase tracking-wider transition-all"
              >
                Explore PRDs
              </Link>
            </div>
          </div>
        )}

        {/* Member Lookup Bar */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 font-sans">
            Search Any Community Member Profile
          </h2>
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full font-mono">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                value={searchHandle}
                onChange={(e) => setSearchHandle(e.target.value)}
                placeholder="Enter GitHub handle or student username (e.g. rahulsharma)..."
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#0066FF]"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              <span>View Heatmap</span>
              <ArrowRight size={13} />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
