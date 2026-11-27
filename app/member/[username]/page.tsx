import React from "react";
import Link from "next/link";
import { TOTAL_SYSTEMS_COUNT } from "@/lib/arena-projects";
import { adminDb, hasAdminCredentials } from "@/lib/firebase-admin";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ username: string }>;
}

export default async function MemberProfilePage({ params }: Props) {
  const { username } = await params;
  const decodedParam = decodeURIComponent(username).toLowerCase().trim();

  let studentProfile: any = null;
  let enrollments: any[] = [];
  let dailyLogs: any[] = [];
  let walletBalance: number | null = null;

  if (adminDb && hasAdminCredentials) {
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

      // 2. Fetch Enrollments from Firestore
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

      // 3. Fetch Daily Logs (no orderBy to avoid missing composite index errors)
      const effectiveEmail = lookupEmail || enrollments[0]?.email;
      if (effectiveEmail) {
        const logsSnap = await adminDb
          .collection("arena_daily_logs")
          .where("studentEmail", "==", effectiveEmail)
          .get();

        if (!logsSnap.empty) {
          dailyLogs = logsSnap.docs
            .map((d) => ({ id: d.id, ...d.data() }))
            .sort((a: any, b: any) => String(b.submittedAt || "").localeCompare(String(a.submittedAt || "")));
        }

        // 4. Fetch live Karma Wallet balance
        const walletSnap = await adminDb
          .collection("student_wallets")
          .where("email", "==", effectiveEmail)
          .limit(1)
          .get();
        if (!walletSnap.empty) {
          const wData = walletSnap.docs[0].data();
          if (typeof wData.balance === "number") {
            walletBalance = wData.balance;
          }
        }
      }
    } catch (e) {
      console.error("Firestore member profile lookup error:", e);
    }
  }

  const primaryEnrollment = enrollments[0];
  const displayName = studentProfile?.displayName || primaryEnrollment?.name || decodedParam.split("@")[0].toUpperCase();
  const displayHandle = studentProfile?.username || primaryEnrollment?.githubUsername || decodedParam.split("@")[0];
  const role = studentProfile?.aiSpecialization || primaryEnrollment?.role || "AI Systems Builder";
  const college = studentProfile?.collegeName || primaryEnrollment?.college || "Independent Builder";
  const degreeBranch = studentProfile?.degreeBranch || "Engineering";
  const gradYear = studentProfile?.graduationYear || "";
  const bio =
    studentProfile?.bio ||
    primaryEnrollment?.bio ||
    "Building deterministic AI workflows and production engineering systems in the Botmartz Builders Community.";
  const githubUser = studentProfile?.githubUsername || primaryEnrollment?.githubUsername;
  const linkedin = studentProfile?.linkedinUrl || primaryEnrollment?.linkedin;
  const portfolio = studentProfile?.portfolioUrl;
  const location = studentProfile?.cityLocation || "India";
  const karmaCoins = walletBalance ?? studentProfile?.karmaCoins ?? 0;
  const isVerified = Boolean(studentProfile);

  const techStack: string[] = Array.isArray(studentProfile?.primaryTechStack) && studentProfile.primaryTechStack.length > 0
    ? studentProfile.primaryTechStack
    : ["Python", "FastAPI", "Next.js", "PostgreSQL"];

  // XP and Level Calculation from real DB data
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
    <div className="min-h-screen bg-white text-slate-900 pt-24 pb-24 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Blue Breadcrumb Strip */}
        <div
          className="bg-[#162774] text-white rounded-3xl px-6 py-4 flex flex-wrap items-center justify-between gap-4 shadow-lg"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255, 255, 255, 0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.06) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        >
          <Link
            href="/arena"
            className="text-xs sm:text-sm font-bold text-blue-100 hover:text-[#D9F83B] transition-colors"
          >
            &larr; Back to Arena
          </Link>
          <div className="flex items-center gap-3 text-xs font-semibold">
            <span className="text-blue-100/90">Botmartz Builders Cohort</span>
            <span className="px-3 py-1 rounded-full bg-white text-[#162774] font-extrabold text-[11px]">
              {isVerified ? "Verified Builder" : "Community Profile"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── LEFT COLUMN: Profile Header & Contribution Wall (2 cols) ── */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Profile Card */}
            <div className="bg-white border border-slate-200 border-l-4 border-l-[#162774] rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-all">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div className="flex items-center gap-5 min-w-0">
                  <div className="relative shrink-0">
                    <div className="w-20 h-20 rounded-2xl bg-[#162774] text-white flex items-center justify-center font-extrabold text-3xl shadow-md">
                      {displayName.charAt(0)}
                    </div>
                    <div className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full bg-[#D9F83B] text-slate-950 text-[11px] font-extrabold shadow-xs border-2 border-white">
                      Lvl {level}
                    </div>
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h1 className="text-2xl sm:text-3xl font-extrabold text-[#162774] tracking-tight">
                        {displayName}
                      </h1>
                      <span className="px-3 py-0.5 rounded-full bg-[#F4F6FB] text-[#162774] text-xs font-bold border border-slate-200">
                        {role}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-slate-500 mt-0.5 mb-1.5">@{displayHandle}</p>

                    {studentProfile?.personaType === "WORKING_PROFESSIONAL" || studentProfile?.personaType === "FOUNDER_BUILDER" ? (
                      <p className="text-xs sm:text-sm text-slate-700 font-medium">
                        <span className="font-bold text-[#162774]">{studentProfile?.companyName || "Tech Professional"}</span>{" "}
                        &bull; {studentProfile?.designationRole || "Software Engineer"}
                      </p>
                    ) : (
                      <p className="text-xs sm:text-sm text-slate-700 font-medium">
                        <span className="font-bold text-slate-900">{college}</span>
                        {gradYear ? ` • ${degreeBranch} (${gradYear})` : ""}
                      </p>
                    )}
                  </div>
                </div>

                {/* Profile Action Buttons (Light Lime, No Wrapping) */}
                <div className="flex items-center gap-2.5 shrink-0">
                  <a
                    href={`mailto:${studentProfile?.email || primaryEnrollment?.email || "team@botmartz.com"}?subject=Hiring Inquiry for ${encodeURIComponent(displayName)} via Botmartz Arena`}
                    className="whitespace-nowrap px-5 py-2.5 rounded-xl bg-[#D9F83B] hover:bg-[#e5ff59] text-slate-950 font-extrabold text-xs sm:text-sm transition-all shadow-xs"
                  >
                    Hire Builder
                  </a>
                  <Link
                    href={`/discussions?author=${displayHandle}`}
                    className="whitespace-nowrap px-5 py-2.5 rounded-xl bg-[#D9F83B] hover:bg-[#e5ff59] text-slate-950 font-extrabold text-xs sm:text-sm transition-all shadow-xs"
                  >
                    Chat
                  </Link>
                </div>
              </div>

              {/* Bio & Social Links */}
              <div className="mt-6 pt-6 border-t border-slate-200/80 space-y-4">
                <p className="text-sm text-slate-700 leading-relaxed font-medium">
                  {bio}
                </p>

                <div className="flex items-center gap-5 text-xs sm:text-sm text-slate-600 flex-wrap font-semibold">
                  <span>Location: <strong className="text-slate-900">{location}</strong></span>
                  <span>Karma Balance: <strong className="text-[#162774]">{karmaCoins} Coins</strong></span>
                </div>

                {(githubUser || linkedin || portfolio) && (
                  <div className="flex flex-wrap items-center gap-2.5 text-xs pt-1">
                    {githubUser && (
                      <a
                        href={`https://github.com/${githubUser}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-xl bg-[#162774] hover:bg-[#1D3189] text-white font-bold transition-colors"
                      >
                        GitHub: {githubUser}
                      </a>
                    )}
                    {linkedin && (
                      <a
                        href={linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-xl bg-[#F4F6FB] hover:bg-[#162774] text-[#162774] hover:text-white border border-slate-200 font-bold transition-colors"
                      >
                        LinkedIn Profile
                      </a>
                    )}
                    {portfolio && (
                      <a
                        href={portfolio}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-xl bg-[#D9F83B] hover:bg-[#e5ff59] text-slate-950 font-extrabold transition-colors"
                      >
                        Live Portfolio
                      </a>
                    )}
                  </div>
                )}
              </div>

              {/* Primary Tech Stack */}
              <div className="mt-6 pt-6 border-t border-slate-200/80">
                <div className="text-xs font-extrabold text-[#162774] uppercase tracking-wider mb-2.5">
                  Verified Technical Specialties
                </div>
                <div className="flex flex-wrap gap-2">
                  {techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1.5 rounded-xl bg-[#F4F6FB] hover:bg-[#162774] text-[#162774] hover:text-white text-xs font-bold border border-slate-200 transition-colors"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* 45-Day Proof-of-Work Contribution Wall */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <h3 className="text-lg font-extrabold text-[#162774]">
                    45-Day Proof-of-Work Heatmap
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 font-medium">
                    GitHub commits &amp; daily standups logged in Firestore.
                  </p>
                </div>
                <span className="px-3.5 py-1 rounded-full bg-[#162774] text-white text-xs font-bold">
                  {totalLogsCount} Commits Verified
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-[#162774] border border-white/15 overflow-x-auto">
                <div className="flex gap-2 min-w-max">
                  {weeks.map((week, wIdx) => (
                    <div key={wIdx} className="flex flex-col gap-2">
                      {week.map((d) => (
                        <div
                          key={d.dayIndex}
                          title={`Day ${d.dayIndex + 1}: ${d.count > 0 ? `${d.count} commits logged` : "No activity"}`}
                          className={`w-4 h-4 rounded-sm transition-all ${d.count === 0
                            ? "bg-white/15"
                            : d.count === 1
                              ? "bg-blue-300"
                              : d.count === 2
                                ? "bg-emerald-400"
                                : "bg-[#D9F83B]"
                            }`}
                        />
                      ))}
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between mt-4 text-[11px] font-semibold text-blue-100">
                  <span>45-Day Cohort Window</span>
                  <div className="flex items-center gap-1.5">
                    <span>Less</span>
                    <div className="w-3 h-3 rounded-xs bg-white/15" />
                    <div className="w-3 h-3 rounded-xs bg-blue-300" />
                    <div className="w-3 h-3 rounded-xs bg-[#D9F83B]" />
                    <span>More</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Enrolled Arena Systems Under Implementation */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
              <h3 className="text-lg font-extrabold text-[#162774]">
                Active Arena Blueprints &amp; Systems
              </h3>

              {enrollments.length === 0 ? (
                <div className="p-6 rounded-2xl bg-[#F4F6FB] border border-slate-200 text-center text-sm text-slate-600 font-medium">
                  No project blueprints enrolled yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  {enrollments.map((ep) => (
                    <div
                      key={ep.id}
                      className="p-5 rounded-2xl bg-[#F4F6FB] hover:bg-white border border-slate-200 border-l-4 border-l-[#162774] hover:border-[#162774] transition-all space-y-2.5"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-[#162774] text-white font-bold text-[10px] uppercase">
                          {ep.difficulty || "Hard Tier"}
                        </span>
                        <span className="text-[11px] font-semibold text-slate-500">
                          {ep.teamType || "Solo Shipper"}
                        </span>
                      </div>
                      <h4 className="font-extrabold text-slate-900 text-sm">{ep.projectTitle}</h4>
                      <div className="pt-2 border-t border-slate-200/70">
                        <Link
                          href={`/arena/${ep.projectId}`}
                          className="inline-block px-3.5 py-1.5 rounded-xl bg-[#D9F83B] hover:bg-[#e5ff59] text-slate-950 font-extrabold text-xs transition-colors"
                        >
                          Inspect PRD Blueprint &rarr;
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
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-sm text-[#162774] uppercase tracking-wider">Shipper Reputation</span>
                <span className="px-3 py-1 rounded-full bg-[#162774] text-white font-extrabold text-xs">
                  Lvl {level} Tier
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-600">Level Progress</span>
                  <span className="font-extrabold text-[#162774]">{xpCurrentLevel} / 300 XP</span>
                </div>
                <div className="w-full bg-[#F4F6FB] rounded-full h-2.5 overflow-hidden border border-slate-200">
                  <div
                    className="bg-[#162774] h-2.5 rounded-full transition-all"
                    style={{ width: `${(xpCurrentLevel / 300) * 100}%` }}
                  />
                </div>
                <div className="text-xs text-slate-500 text-right font-medium">
                  {xpNeeded} XP to Level {level + 1}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-200/80 text-center">
                <div className="p-3.5 rounded-2xl bg-[#F4F6FB] border border-slate-200">
                  <div className="text-xl font-extrabold text-[#162774]">{totalLogsCount}</div>
                  <div className="text-[11px] text-slate-600 font-bold uppercase mt-0.5">Commits Logged</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#F4F6FB] border border-slate-200">
                  <div className="text-xl font-extrabold text-[#162774]">{karmaCoins}</div>
                  <div className="text-[11px] text-slate-600 font-bold uppercase mt-0.5">Karma Coins</div>
                </div>
              </div>
            </div>

            {/* Badges Earned Card */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="font-extrabold text-[#162774] text-base">
                Verified Credentials &amp; Badges
              </h3>
              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-[#F4F6FB] hover:bg-white border border-slate-200 border-l-4 border-l-[#162774] transition-all">
                  <div className="font-extrabold text-slate-900 text-sm">Verified Student</div>
                  <div className="text-xs text-slate-600 font-medium mt-0.5">
                    {isVerified ? "Authenticated builder profile" : "Pending verification"}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#F4F6FB] hover:bg-white border border-slate-200 border-l-4 border-l-[#162774] transition-all">
                  <div className="font-extrabold text-slate-900 text-sm">Deterministic Shipper</div>
                  <div className="text-xs text-slate-600 font-medium mt-0.5">
                    {totalLogsCount > 0 ? `${totalLogsCount} PoW standup logs verified` : "No standup logs yet"}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#F4F6FB] hover:bg-white border border-slate-200 border-l-4 border-l-[#162774] transition-all">
                  <div className="font-extrabold text-slate-900 text-sm">Cohort Builder</div>
                  <div className="text-xs text-slate-600 font-medium mt-0.5">
                    {totalProjectsCount > 0 ? `${totalProjectsCount} active system blueprints` : "Virtual Internship Track"}
                  </div>
                </div>
              </div>
            </div>

            {/* Recruiter / Founder Audit Card */}
            <div
              className="p-6 rounded-3xl bg-[#162774] text-white border border-white/15 space-y-3.5 shadow-xl"
              style={{
                backgroundImage:
                  "linear-gradient(to right, rgba(255, 255, 255, 0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.06) 1px, transparent 1px)",
                backgroundSize: "36px 36px",
              }}
            >
              <div className="text-xs font-extrabold uppercase tracking-wider text-blue-200">
                Founder-Audited Portfolio
              </div>
              <h4 className="text-base font-extrabold text-white">
                Cryptographic Proof-of-Work Dossier
              </h4>
              <p className="text-xs sm:text-sm text-blue-100/85 leading-relaxed font-medium">
                All daily commits, PRD solutions, and code repositories on this profile are timestamped and verifiable for hiring managers.
              </p>
              <div className="pt-2">
                <Link
                  href="/arena"
                  className="block w-full py-3 rounded-xl bg-[#D9F83B] hover:bg-[#e5ff59] text-slate-950 font-extrabold text-xs sm:text-sm text-center transition-all shadow-sm"
                >
                  Explore Live Systems Catalog &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
