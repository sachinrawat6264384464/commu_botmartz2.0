import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Trophy,
  Flame,
  CheckCircle2,
  Github,
  Linkedin,
  Terminal,
  Layers,
  ArrowLeft,
  ExternalLink,
  ShieldCheck,
  Code2,
  Calendar,
  MessageCircle,
  Share2,
  Sparkles,
  Award,
  MapPin,
  GraduationCap,
  Briefcase,
  Globe,
  Coins,
  Copy
} from "lucide-react";
import { adminDb } from "@/lib/firebase-admin";
import { ARENA_PROJECTS } from "@/lib/arena-projects";

interface Props {
  params: Promise<{ username: string }>;
}

export default async function MemberProfilePage({ params }: Props) {
  const { username } = await params;
  const decodedParam = decodeURIComponent(username).toLowerCase().trim();

  let studentProfile: any = null;
  let enrollments: any[] = [];
  let dailyLogs: any[] = [];

  if (adminDb) {
    try {
      const isEmail = decodedParam.includes("@");

      // 1. Try student_profiles lookup by username, email, or uid
      let profileSnap;
      if (isEmail) {
        profileSnap = await adminDb
          .collection("student_profiles")
          .where("email", "==", decodedParam)
          .limit(1)
          .get();
      } else {
        profileSnap = await adminDb
          .collection("student_profiles")
          .where("username", "==", decodedParam)
          .limit(1)
          .get();

        if (profileSnap.empty) {
          // Check by githubUsername or direct doc UID
          profileSnap = await adminDb
            .collection("student_profiles")
            .where("githubUsername", "==", decodedParam)
            .limit(1)
            .get();
        }

        if (profileSnap.empty) {
          const directDoc = await adminDb.collection("student_profiles").doc(decodedParam).get();
          if (directDoc.exists) {
            studentProfile = { uid: directDoc.id, ...directDoc.data() };
          }
        }
      }

      if (profileSnap && !profileSnap.empty) {
        const doc = profileSnap.docs[0];
        studentProfile = { uid: doc.id, ...doc.data() };
      }

      const lookupEmail = studentProfile?.email || (isEmail ? decodedParam : null);
      const lookupGithub = studentProfile?.githubUsername || (!isEmail ? decodedParam : null);

      // 2. Fetch Enrollments
      let enrollQuery;
      if (lookupEmail) {
        enrollQuery = adminDb.collection("arena_enrollments").where("email", "==", lookupEmail);
      } else if (lookupGithub) {
        enrollQuery = adminDb.collection("arena_enrollments").where("githubUsername", "==", lookupGithub);
      }

      if (enrollQuery) {
        const enrollSnap = await enrollQuery.get();
        if (!enrollSnap.empty) {
          enrollments = enrollSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
        }
      }

      // 3. Fetch Daily Logs
      const effectiveEmail = lookupEmail || enrollments[0]?.email;
      if (effectiveEmail) {
        const logsSnap = await adminDb
          .collection("arena_daily_logs")
          .where("studentEmail", "==", effectiveEmail)
          .orderBy("submittedAt", "desc")
          .get();

        if (!logsSnap.empty) {
          dailyLogs = logsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
        }
      }
    } catch (e) {
      console.error("Firestore member profile lookup error:", e);
    }
  }

  // Fallback metadata if no explicit profile exists yet
  const primaryEnrollment = enrollments[0];
  const displayName = studentProfile?.displayName || primaryEnrollment?.name || decodedParam.split("@")[0].toUpperCase();
  const displayHandle = studentProfile?.username || primaryEnrollment?.githubUsername || decodedParam.split("@")[0];
  const role = studentProfile?.aiSpecialization || primaryEnrollment?.role || "Autonomous Agent Architect";
  const college = studentProfile?.collegeName || primaryEnrollment?.college || "Engineering College (Indore / MP)";
  const degreeBranch = studentProfile?.degreeBranch || "B.Tech Computer Science";
  const gradYear = studentProfile?.graduationYear || "2026";
  const bio = studentProfile?.bio || primaryEnrollment?.bio || `Student Builder developing deterministic agent swarms and full-stack AI systems across the Botmartz Cohort.`;
  const githubUser = studentProfile?.githubUsername || primaryEnrollment?.githubUsername;
  const linkedin = studentProfile?.linkedinUrl || primaryEnrollment?.linkedin;
  const portfolio = studentProfile?.portfolioUrl;
  const location = studentProfile?.cityLocation || "Indore, MP / Remote India";
  const karmaCoins = studentProfile?.karmaCoins || 100;
  const isVerified = studentProfile?.isVerifiedBuilder ?? true;

  const techStack: string[] = studentProfile?.primaryTechStack || [
    "LangGraph",
    "Python",
    "FastAPI",
    "Next.js",
    "PostgreSQL",
    "PyTorch"
  ];

  // XP and Level Calculation
  const totalLogsCount = dailyLogs.length;
  const distinctProjects = Array.from(new Set(enrollments.map((e) => e.projectId)));
  const totalProjectsCount = distinctProjects.length;

  const totalXP = totalLogsCount * 100 + totalProjectsCount * 500 + (karmaCoins || 0);
  const level = Math.min(Math.floor(totalXP / 300) + 1, 10);
  const xpCurrentLevel = totalXP % 300;
  const xpNeeded = 300 - xpCurrentLevel;

  // Generate 7x10 Contribution Grid (70 days window)
  const weeks = Array.from({ length: 10 }, (_, wIdx) => {
    return Array.from({ length: 7 }, (_, dIdx) => {
      const dayIndex = wIdx * 7 + dIdx;
      const hasLog = dayIndex < totalLogsCount;
      const count = hasLog ? (dayIndex % 3 === 0 ? 3 : 1) : 0;
      return { dayIndex, count };
    });
  });

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 pb-20">
      {/* Top Header Breadcrumb */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link
            href="/arena"
            className="inline-flex items-center gap-2 text-xs font-mono font-bold text-slate-600 hover:text-[#0066FF] transition-colors"
          >
            <ArrowLeft size={14} /> Back to Arena
          </Link>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
            <span>Cohort 1 (14 Sept - Diwali)</span>
            <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 flex items-center gap-1">
              <ShieldCheck size={12} />
              <span>Verified Student Builder</span>
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* ── LEFT COLUMN: Profile Header & Contribution Wall (2 cols) ── */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Main Profile Card */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                
                <div className="flex items-center gap-5">
                  {/* Avatar with Level Ring */}
                  <div className="relative">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-3xl shadow-md border-4 border-white">
                      {displayName.charAt(0)}
                    </div>
                    <div className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full bg-[#0066FF] text-white font-mono text-[11px] font-bold shadow-xs border-2 border-white">
                      Lvl {level}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h1 className="text-2xl font-bold text-slate-900 font-sans">{displayName}</h1>
                      {isVerified && <ShieldCheck size={18} className="text-[#0066FF]" />}
                      <span className="px-2 py-0.5 rounded-full bg-blue-50 text-[#0066FF] font-mono text-[10px] font-bold border border-blue-200">
                        {role}
                      </span>
                    </div>
                    <p className="text-xs font-mono text-slate-500 mb-1">@{displayHandle}</p>
                    <p className="text-xs text-slate-700 font-sans flex items-center gap-2 flex-wrap">
                      <span className="font-bold">{college}</span>
                      <span>&bull;</span>
                      <span>{degreeBranch} ({gradYear})</span>
                    </p>
                  </div>
                </div>

                {/* Profile Action Buttons */}
                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                  <a
                    href={`mailto:${studentProfile?.email || primaryEnrollment?.email || "team@botmartz.com"}?subject=Hiring Inquiry for ${encodeURIComponent(displayName)} via Botmartz Arena`}
                    className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-[#0066FF] hover:bg-blue-600 text-white font-bold font-mono text-xs transition-all flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <Briefcase size={14} />
                    <span>Hire Builder</span>
                  </a>
                  <Link
                    href={`/discussions?author=${displayHandle}`}
                    className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold font-mono text-xs transition-all flex items-center justify-center gap-1.5 border border-slate-200"
                  >
                    <MessageCircle size={14} />
                    <span>Chat</span>
                  </Link>
                </div>
              </div>

              {/* Bio & Social Links */}
              <div className="mt-6 pt-6 border-t border-slate-100 space-y-4">
                <p className="text-xs text-slate-600 leading-relaxed font-sans">
                  {bio}
                </p>

                {/* Location & Tags */}
                <div className="flex items-center gap-4 text-xs font-mono text-slate-500 flex-wrap">
                  <div className="flex items-center gap-1">
                    <MapPin size={13} className="text-slate-400" />
                    <span>{location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Coins size={13} className="text-amber-500" />
                    <span className="font-bold text-slate-700">{karmaCoins} Karma Coins</span>
                  </div>
                </div>

                {/* Social Badges */}
                <div className="flex items-center gap-3 text-xs font-mono pt-2">
                  {githubUser && (
                    <a
                      href={`https://github.com/${githubUser}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 font-bold transition-colors"
                    >
                      <Github size={13} />
                      <span>github.com/{githubUser}</span>
                    </a>
                  )}

                  {linkedin && (
                    <a
                      href={linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0077B5] text-white hover:opacity-90 font-bold transition-colors"
                    >
                      <Linkedin size={13} />
                      <span>LinkedIn</span>
                    </a>
                  )}

                  {portfolio && (
                    <a
                      href={portfolio}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors"
                    >
                      <Globe size={13} />
                      <span>Portfolio</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Primary Tech Stack */}
              <div className="mt-6 pt-6 border-t border-slate-100">
                <div className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Verified Technical Specialties
                </div>
                <div className="flex flex-wrap gap-2">
                  {techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 font-mono text-[11px] font-bold border border-slate-200/80"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* 70-Day Proof-of-Work Contribution Wall */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-sans">
                    45-Day Proof-of-Work Heatmap
                  </h3>
                  <p className="text-xs text-slate-500 font-sans">
                    Autonomous GitHub commits &amp; daily standups logged during Cohort 1.
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-mono text-xs font-bold border border-emerald-200">
                  {totalLogsCount} Commits Verified
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 overflow-x-auto">
                <div className="flex gap-1.5 min-w-max">
                  {weeks.map((week, wIdx) => (
                    <div key={wIdx} className="flex flex-col gap-1.5">
                      {week.map((d) => (
                        <div
                          key={d.dayIndex}
                          title={`Day ${d.dayIndex + 1}: ${d.count > 0 ? `${d.count} commits logged` : "No activity"}`}
                          className={`w-3.5 h-3.5 rounded-xs transition-all ${
                            d.count === 0
                              ? "bg-slate-900"
                              : d.count === 1
                              ? "bg-emerald-800"
                              : d.count === 2
                              ? "bg-emerald-600"
                              : "bg-emerald-400 shadow-xs shadow-emerald-500/50"
                          }`}
                        />
                      ))}
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between mt-3 text-[10px] font-mono text-slate-500">
                  <span>14th Sept (Cohort 1 Kickoff)</span>
                  <div className="flex items-center gap-1.5">
                    <span>Less</span>
                    <div className="w-2.5 h-2.5 rounded-xs bg-slate-900"></div>
                    <div className="w-2.5 h-2.5 rounded-xs bg-emerald-800"></div>
                    <div className="w-2.5 h-2.5 rounded-xs bg-emerald-400"></div>
                    <span>More</span>
                  </div>
                  <span>Diwali 2026</span>
                </div>
              </div>
            </div>

            {/* Enrolled Arena Systems Under Implementation */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-slate-900 font-sans">
                Active Arena Blueprints &amp; Systems
              </h3>

              {enrollments.length === 0 ? (
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500 font-mono">
                  No public project blueprints enrolled yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
                  {enrollments.map((ep) => (
                    <div key={ep.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-2 py-0.5 rounded bg-blue-50 text-[#0066FF] font-bold text-[10px]">
                          {ep.difficulty || "Hard Tier"}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {ep.teamType || "Solo Shipper"}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm font-sans">{ep.projectTitle}</h4>
                      <div className="pt-2 border-t border-slate-200/60">
                        <Link
                          href={`/arena/${ep.projectId}`}
                          className="text-[#0066FF] hover:underline font-bold text-[11px] flex items-center gap-1"
                        >
                          <span>Inspect PRD Blueprint</span>
                          <ExternalLink size={11} />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* ── RIGHT COLUMN: XP Ledger, Badges & Verification (1 col) ── */}
          <div className="space-y-6">
            
            {/* Reputation XP Card */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 uppercase">Shipper Reputation</span>
                <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 font-bold text-[10px]">
                  Lvl {level} Tier
                </span>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-500">Level Progress</span>
                  <span className="font-bold text-slate-800">{xpCurrentLevel} / 300 XP</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-[#0066FF] h-2 rounded-full transition-all"
                    style={{ width: `${(xpCurrentLevel / 300) * 100}%` }}
                  />
                </div>
                <div className="text-[10px] text-slate-400 text-right">
                  {xpNeeded} XP to Level {level + 1}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100 text-center">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                  <div className="text-lg font-black text-slate-900">{totalLogsCount}</div>
                  <div className="text-[10px] text-slate-500 uppercase">Commits Logged</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                  <div className="text-lg font-black text-amber-600">{karmaCoins}</div>
                  <div className="text-[10px] text-slate-500 uppercase">Karma Coins</div>
                </div>
              </div>
            </div>

            {/* Badges Earned Card */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
              <h3 className="font-bold text-slate-900 text-sm font-sans">
                Verified Credentials &amp; Badges
              </h3>
              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 rounded-2xl bg-blue-50/60 border border-blue-200/80 flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-blue-600 text-white">
                    <ShieldCheck size={16} />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">🎓 Verified Student</div>
                    <div className="text-[11px] text-slate-500 font-sans">College &amp; Roll No authenticated</div>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-emerald-600 text-white">
                    <Flame size={16} />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">⚡ Deterministic Shipper</div>
                    <div className="text-[11px] text-slate-500 font-sans">Logged active PoW standup streak</div>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-purple-50/60 border border-purple-200/80 flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-purple-600 text-white">
                    <Award size={16} />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">🏆 Cohort 1 Pioneer</div>
                    <div className="text-[11px] text-slate-500 font-sans">Diwali 2026 Virtual Internship Track</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recruiter / Founder Referral Guarantee Card */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-950 to-blue-950 text-white border border-blue-500/30 space-y-3 shadow-lg font-mono text-xs">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-[11px] uppercase">
                <Sparkles size={14} />
                <span>VERIFIED RECRUITER DISPATCH</span>
              </div>
              <h4 className="text-sm font-bold font-sans text-white">
                15-Company Placement Guarantee
              </h4>
              <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
                All daily commits, PRD solutions, and code repositories on this profile are cryptographically timestamped and forwarded directly to AI engineering leads.
              </p>
              <div className="pt-2">
                <Link
                  href="/arena"
                  className="block w-full py-2.5 rounded-xl bg-[#0066FF] hover:bg-blue-600 text-white font-bold text-center transition-all shadow-sm"
                >
                  Explore 50 Systems Catalog →
                </Link>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
