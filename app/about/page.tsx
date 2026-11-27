"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Mail } from "lucide-react";
import { BOTMARTZ_TEAM } from "@/lib/team";
import { TOTAL_SYSTEMS_COUNT } from "@/lib/arena-projects";

const HERO_COLLAB_IMAGE =
  "https://res.cloudinary.com/dnafnxfsf/image/upload/v1795776978/botmartz-about/about-hero-team-collab.jpg";
const APPROACH_STUDENTS_IMAGE =
  "https://res.cloudinary.com/dnafnxfsf/image/upload/v1795776979/botmartz-about/about-approach-students.jpg";

const ECOSYSTEM_OFFERINGS = [
  {
    num: "01",
    tag: "Community",
    title: "Developer Community",
    subtitle: "Connect and collaborate",
    desc: "Join active builders in technical discussions, squad matchmaking, peer code reviews, and collaborative problem solving.",
    href: "/discussions",
    cta: "Join Discussions",
  },
  {
    num: "02",
    tag: "Hands-On PRDs",
    title: "Projects",
    subtitle: "Build practical skills",
    desc: `Ship ${TOTAL_SYSTEMS_COUNT}+ production-grade engineering blueprints across AI Agents, RAG, Cloud, and Backend Systems.`,
    href: "/arena",
    cta: "Explore Projects",
  },
  {
    num: "03",
    tag: "Live Events",
    title: "Workshops & Hackathons",
    subtitle: "Learn through events",
    desc: "Compete in 24-hour online and offline hackathons and attend live hands-on technical workshops with working code.",
    href: "/hackathons",
    cta: "View Events",
  },
  {
    num: "04",
    tag: "Structured Tracks",
    title: "Learning",
    subtitle: "Roadmaps and courses",
    desc: "Follow step-by-step domain roadmaps with prerequisites, architecture checklists, and milestone gates.",
    href: "/arena/roadmaps",
    cta: "Browse Roadmaps",
  },
  {
    num: "05",
    tag: "Guidance",
    title: "Mentorship",
    subtitle: "Get technical guidance",
    desc: "Receive direct architecture teardowns, debugging help, and live office-hour feedback from engineers and founders.",
    href: "/virtual-ai-internship",
    cta: "Explore Internship",
  },
  {
    num: "06",
    tag: "Hiring & Proof",
    title: "Career Opportunities",
    subtitle: "Jobs and internships",
    desc: "Convert verified Git commits, deployed builds, and SHA-256 credentials into direct job screening and internships.",
    href: "/showcase",
    cta: "View Showcases",
  },
];

const FAQS = [
  {
    q: "Who is Botmartz Community built for?",
    a: "Botmartz is built for students, self-taught developers, early-career engineers, mentors, colleges, and hiring startups who value real working software over static certificates.",
  },
  {
    q: "Do I need prior industry experience before joining?",
    a: "No. Our catalog starts from Baby Step and Easy Foundation blueprints and progresses all the way to production AI, backend, and distributed systems.",
  },
  {
    q: "Do I need an account to join Hackathons or Workshops?",
    a: "No account is required to register for Online Hackathons or Live Workshops — you receive your Unique ID or joining link directly via email.",
  },
  {
    q: "How can companies partner with Botmartz for hiring or training?",
    a: "Companies can partner with us for proof-of-work hiring pipelines, sponsored hackathons, industry workshops, and custom corporate engineering training via team@botmartz.com.",
  },
];

function SectionBadge({ num, label }: { num: string; label: string }) {
  return (
    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#162774] text-white text-[11px] font-extrabold uppercase tracking-wider">
      <span className="px-1.5 py-0.5 rounded-full bg-white text-[#162774] text-[10px]">
        {num}
      </span>
      <span>{label}</span>
    </div>
  );
}

export default function AboutPage() {
  const [liveStats, setLiveStats] = useState({
    registeredMembers: 0,
    publishedProjects: 0,
    completedWorkshops: 0,
    activeMentors: BOTMARTZ_TEAM.length,
    communityContributions: 0,
  });
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    fetch("/api/about/stats", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.stats) {
          setLiveStats(data.stats);
        }
      })
      .catch(() => null);
  }, []);

  return (
    <div className="bg-white min-h-screen text-slate-900 pt-24 pb-20 font-sans">
      <div className="w-full px-4 sm:px-8 lg:px-12 space-y-14 relative z-10">
        {/* ── 01. HERO SECTION — WHO WE ARE ── */}
        <section
          className="rounded-3xl bg-[#162774] text-white p-6 sm:p-11 border border-white/15 shadow-2xl overflow-hidden"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255, 255, 255, 0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.06) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -36, filter: "blur(6px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.65, ease: "easeOut" }}
              className="lg:col-span-7 space-y-5"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/15 border border-white/20 text-white text-[11px] font-extrabold uppercase tracking-wider">
                <span>01 &bull; Who We Are</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
                Building a Community Where Developers Learn, Build &amp; Grow.
              </h1>

              <p className="text-xs sm:text-base text-blue-100/90 leading-relaxed max-w-2xl">
                Botmartz Community is an applied engineering ecosystem built to bridge the gap between classroom theory and real-world software production. We empower developers to ship verifiable projects, collaborate with peers and mentors, and unlock genuine industry opportunities.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Link
                  href="/login"
                  className="group relative overflow-hidden px-6 py-3.5 rounded-full bg-[#D9F83B] text-slate-950 font-extrabold text-xs sm:text-sm transition-all flex items-center gap-3 shadow-lg cursor-pointer"
                >
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-white -translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-in-out"
                  />
                  <span className="relative z-10">Join Community</span>
                  <span className="relative z-10 w-7 h-7 rounded-full bg-slate-950 text-[#D9F83B] flex items-center justify-center transition-transform duration-300 group-hover:rotate-[60deg]">
                    <ArrowRight size={13} />
                  </span>
                </Link>

                <Link
                  href="/arena"
                  className="group relative overflow-hidden px-6 py-3.5 rounded-full bg-white text-[#162774] border border-white font-extrabold text-xs sm:text-sm transition-all flex items-center gap-2 shadow-sm cursor-pointer"
                >
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-[#D9F83B] -translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-in-out"
                  />
                  <span className="relative z-10 group-hover:text-slate-950 transition-colors duration-500">
                    Explore {TOTAL_SYSTEMS_COUNT}+ Systems
                  </span>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 36, filter: "blur(6px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
              className="lg:col-span-5"
            >
              <div className="relative rounded-3xl overflow-hidden border border-white/20 shadow-2xl bg-[#070E54]">
                <img
                  src={HERO_COLLAB_IMAGE}
                  alt="Developers collaborating at Botmartz engineering workspace"
                  className="w-full h-60 sm:h-80 object-cover"
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── 02. OUR STORY — HOW BOTMARTZ STARTED ── */}
        <section className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-5">
            <div className="space-y-2">
              <SectionBadge num="02" label="Our Story" />
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
                How Botmartz Started
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl font-medium">
              Born out of a simple observation: talented students and developers were stuck watching passive tutorials while companies struggled to find engineers who could ship production code.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {[
              {
                num: "01",
                title: "Why We Started",
                desc: "To replace passive certificate-chasing with real engineering environments where builders write, test, and deploy actual systems.",
              },
              {
                num: "02",
                title: "The Developer Struggle",
                desc: "Students face scattered roadmaps, zero architecture feedback, isolated learning, and resumes filled with identical toy clones.",
              },
              {
                num: "03",
                title: "Platform Vision",
                desc: "We built one unified hub combining structured PRDs, live workshops, 24-hour hackathons, mentorship, and verified credentials.",
              },
              {
                num: "04",
                title: "Where We Are Going",
                desc: "Becoming India's most trusted proof-of-work developer network connecting ambitious builders directly with engineering-first teams.",
              },
            ].map((story, idx) => {
              const splitInit =
                idx === 0
                  ? { opacity: 0, x: -32, y: 0, filter: "blur(6px)" }
                  : idx === 1
                    ? { opacity: 0, x: 0, y: 28, filter: "blur(6px)" }
                    : idx === 2
                      ? { opacity: 0, x: 0, y: -28, filter: "blur(6px)" }
                      : { opacity: 0, x: 32, y: 0, filter: "blur(6px)" };
              return (
                <motion.div
                  key={story.num}
                  initial={splitInit}
                  whileInView={{ opacity: 1, x: 0, y: 0, filter: "blur(0px)" }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.6, delay: idx * 0.08, ease: "easeOut" }}
                  className="p-5 rounded-3xl bg-[#F4F6FB] border border-slate-200 border-l-4 border-l-[#162774] space-y-2.5 shadow-xs"
                >
                  <span className="w-7 h-7 rounded-full bg-[#162774] text-white font-extrabold text-[11px] flex items-center justify-center">
                    {story.num}
                  </span>
                  <h3 className="text-base font-extrabold text-slate-950">{story.title}</h3>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">{story.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ── 03. MISSION & VISION ── */}
        <section className="space-y-6">
          <div className="space-y-2">
            <SectionBadge num="03" label="Mission & Vision" />
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
              Purpose That Guides Every Program
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch overflow-hidden">
            <motion.div
              initial={{ opacity: 0, x: -44, filter: "blur(6px)" }}
              whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.65, ease: "easeOut" }}
              className="rounded-3xl bg-[#F4F6FB] border border-slate-200 border-l-4 border-l-[#162774] p-7 sm:p-9 space-y-4 shadow-sm flex flex-col justify-between"
            >
              <div className="space-y-3">
                <span className="inline-block px-3.5 py-1 rounded-full bg-[#162774] text-[#D9F83B] text-[10px] font-extrabold uppercase tracking-wider">
                  Our Mission
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-950">
                  Practical Learning, Real Projects &amp; Industry Exposure
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                  To provide developers with practical hands-on learning, production-grade projects, mentor guidance, and real industry exposure — so every learner graduates with verifiable engineering skill rather than just theory.
                </p>
              </div>
              <div className="pt-3 border-t border-slate-200 text-xs font-bold text-[#162774]">
                Practical Execution &bull; Mentorship &bull; Industry Readiness
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 44, filter: "blur(6px)" }}
              whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.65, delay: 0.08, ease: "easeOut" }}
              className="rounded-3xl bg-[#162774] text-white border border-white/15 p-7 sm:p-9 space-y-4 shadow-xl flex flex-col justify-between"
              style={{
                backgroundImage:
                  "linear-gradient(to right, rgba(255, 255, 255, 0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.06) 1px, transparent 1px)",
                backgroundSize: "48px 48px",
              }}
            >
              <div className="space-y-3">
                <span className="inline-block px-3.5 py-1 rounded-full bg-white/15 border border-white/20 text-white text-[10px] font-extrabold uppercase tracking-wider">
                  Our Vision
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                  One Connected Ecosystem From Learning to Career Growth
                </h3>
                <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed font-medium">
                  To build a connected technology ecosystem where a developer can go seamlessly from learning fundamentals and shipping real products to earning verified credentials and landing high-impact roles.
                </p>
              </div>
              <div className="pt-3 border-t border-white/15 text-xs font-bold text-white">
                Connected Community &bull; Proof-of-Work &bull; Career Growth
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── 04. WHAT WE OFFER — OUR ECOSYSTEM ── */}
        <section className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-5">
            <div className="space-y-2">
              <SectionBadge num="04" label="What We Offer" />
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
                Our Ecosystem — Six Clear Pillars
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md font-medium">
              Every pillar is cleanly separated so students, builders, and partners know exactly where to go and what outcome they unlock.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 overflow-hidden">
            {ECOSYSTEM_OFFERINGS.map((item, idx) => {
              const colMod = idx % 3;
              const initPos =
                colMod === 0
                  ? { opacity: 0, x: -34, y: 12, filter: "blur(6px)" }
                  : colMod === 1
                    ? { opacity: 0, x: 0, y: 32, filter: "blur(6px)" }
                    : { opacity: 0, x: 34, y: 12, filter: "blur(6px)" };
              return (
              <motion.div
                key={item.num}
                initial={initPos}
                whileInView={{ opacity: 1, x: 0, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, amount: 0.12 }}
                transition={{ duration: 0.6, delay: colMod * 0.08, ease: "easeOut" }}
                className="relative overflow-hidden rounded-3xl bg-[#F4F6FB] hover:bg-white border border-slate-200 border-l-4 border-l-[#162774] hover:border-[#162774] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 flex flex-col justify-between group"
              >
                <div className="p-6 pb-4 space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="w-8 h-8 rounded-full bg-[#162774] text-white font-extrabold text-xs flex items-center justify-center transition-colors duration-500">
                      {item.num}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-white border border-slate-200 text-[#162774] text-[10px] font-extrabold uppercase tracking-wider">
                      {item.tag}
                    </span>
                  </div>

                  <Link
                    href={item.href}
                    className="flex items-center justify-between gap-3 p-4 rounded-2xl bg-[#162774] text-white shadow-sm"
                    style={{
                      backgroundImage:
                        "linear-gradient(to right, rgba(255, 255, 255, 0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.06) 1px, transparent 1px)",
                      backgroundSize: "28px 28px",
                    }}
                  >
                    <div>
                      <h3 className="text-base font-extrabold text-white transition-colors leading-snug">
                        {item.title}
                      </h3>
                      <div className="text-[11px] text-blue-200/90 font-semibold mt-0.5">
                        {item.subtitle}
                      </div>
                    </div>
                    <span className="w-7 h-7 rounded-full bg-white text-[#162774] flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:rotate-[60deg]">
                      <ArrowRight size={13} />
                    </span>
                  </Link>

                  <p className="text-xs sm:text-[13px] text-slate-700 leading-relaxed font-medium">
                    {item.desc}
                  </p>
                </div>

                <div className="px-6 py-4 border-t border-slate-200/80 bg-white/70">
                  <Link
                    href={item.href}
                    className="group/btn relative overflow-hidden w-full py-2.5 px-4 rounded-xl bg-[#162774] text-white font-extrabold text-xs flex items-center justify-between transition-all"
                  >
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 bg-[#070E54] -translate-y-full group-hover/btn:translate-y-0 transition-transform duration-700 ease-in-out"
                    />
                    <span className="relative z-10 text-white transition-colors duration-500">
                      {item.cta}
                    </span>
                    <ArrowRight
                      size={13}
                      className="relative z-10 text-white transition-all duration-300 group-hover/btn:rotate-[60deg]"
                    />
                  </Link>
                </div>
              </motion.div>
              );
            })}
          </div>
        </section>

        {/* ── 05. OUR APPROACH — LEARN → BUILD → CONNECT → GROW ── */}
        <section className="rounded-3xl bg-[#F4F6FB] border border-slate-200 p-6 sm:p-10 space-y-8 shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -38, filter: "blur(6px)" }}
              whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.65, ease: "easeOut" }}
              className="lg:col-span-7 space-y-5"
            >
              <SectionBadge num="05" label="Our Approach" />
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
                Learn &rarr; Build &rarr; Connect &rarr; Grow
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                At Botmartz, students don&apos;t just read theory or copy slides. You learn concepts through structured roadmaps, build real company-grade projects, solve technical doubts with peers and mentors, and connect directly with industry leaders.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {[
                  {
                    step: "01",
                    title: "Learn",
                    desc: "Master core engineering foundations via curated roadmaps and live technical workshops.",
                  },
                  {
                    step: "02",
                    title: "Build",
                    desc: "Ship production PRDs, pass automated test gates, and deploy live systems on cloud.",
                  },
                  {
                    step: "03",
                    title: "Connect",
                    desc: "Solve doubts in discussions, team up for hackathons, and get mentored by practitioners.",
                  },
                  {
                    step: "04",
                    title: "Grow",
                    desc: "Showcase verified proof-of-work to unlock recommendations, internships, and jobs.",
                  },
                ].map((a) => (
                  <div
                    key={a.step}
                    className="p-4 rounded-2xl bg-white border border-slate-200 border-l-4 border-l-[#162774] space-y-1.5"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#162774] text-white text-[10px] font-extrabold flex items-center justify-center">
                        {a.step}
                      </span>
                      <h3 className="text-sm font-extrabold text-slate-950">{a.title}</h3>
                    </div>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed">{a.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 38, filter: "blur(6px)" }}
              whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.65, delay: 0.1, ease: "easeOut" }}
              className="lg:col-span-5"
            >
              <div className="relative rounded-3xl overflow-hidden border-2 border-[#162774]/20 shadow-xl bg-white">
                <img
                  src={APPROACH_STUDENTS_IMAGE}
                  alt="Students building real software projects together with a mentor"
                  className="w-full h-64 sm:h-96 object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/90 via-slate-950/45 to-transparent p-4 sm:p-5">
                  <div className="text-xs font-extrabold text-white uppercase tracking-wider">
                    Hands-On Engineering Cohort
                  </div>
                  <div className="text-xs text-white/90 font-medium mt-0.5">
                    Real code reviews, live debugging, and collaborative sprints.
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── 06. WHO CAN JOIN + VALUES & GUIDELINES ── */}
        <section className="space-y-6">
          <div className="space-y-2">
            <SectionBadge num="06" label="Who Can Join?" />
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
              Built for Every Stage of the Tech Ecosystem
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 overflow-hidden">
            {[
              {
                num: "01",
                title: "Students & Beginners",
                desc: "Build your first real-world portfolio projects and learn modern engineering workflows.",
              },
              {
                num: "02",
                title: "Developers & Tech Enthusiasts",
                desc: "Compete in 24h hackathons, sharpen system design, and ship frontier AI systems.",
              },
              {
                num: "03",
                title: "Mentors & Industry Experts",
                desc: "Guide upcoming builders, conduct architecture reviews, and host live clinics.",
              },
              {
                num: "04",
                title: "Startups & Tech Companies",
                desc: "Discover pre-vetted engineers with verifiable Git history and deployed builds.",
              },
              {
                num: "05",
                title: "Colleges & Institutions",
                desc: "Partner for campus hackathons, bootcamps, and practical industry readiness.",
              },
            ].map((who, idx) => (
              <motion.div
                key={who.num}
                initial={{ opacity: 0, y: idx % 2 === 0 ? 28 : -24, filter: "blur(5px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.55, delay: idx * 0.06, ease: "easeOut" }}
                className="p-5 rounded-3xl bg-white border border-slate-200 border-t-4 border-t-[#162774] shadow-xs space-y-2"
              >
                <span className="w-7 h-7 rounded-full bg-[#162774] text-white text-[11px] font-extrabold flex items-center justify-center">
                  {who.num}
                </span>
                <h3 className="text-sm font-extrabold text-slate-950">{who.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">{who.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Our Values & Community Guidelines */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 pt-2">
            <div className="group relative overflow-hidden p-6 rounded-3xl bg-[#F4F6FB] border border-slate-200 hover:border-[#162774] space-y-3 transition-colors duration-500 cursor-pointer">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[#162774] translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-in-out"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, rgba(255, 255, 255, 0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.06) 1px, transparent 1px)",
                  backgroundSize: "28px 28px",
                }}
              />
              <div className="relative z-10 text-xs font-extrabold uppercase tracking-wider text-[#162774] group-hover:text-white transition-colors duration-500">
                Our Core Values
              </div>
              <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { title: "Innovation", desc: "Build forward-looking AI & cloud systems." },
                  { title: "Collaboration", desc: "Learn faster together in squads & reviews." },
                  { title: "Practical Learning", desc: "Shipping code beats passive theory." },
                ].map((v) => (
                  <div key={v.title} className="p-3.5 rounded-2xl bg-white border border-slate-200">
                    <div className="text-xs font-extrabold text-slate-950">{v.title}</div>
                    <div className="text-[11px] text-slate-600 mt-1 font-medium">{v.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="group relative overflow-hidden p-6 rounded-3xl bg-[#F4F6FB] border border-slate-200 hover:border-[#162774] space-y-3 transition-colors duration-500 cursor-pointer">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[#162774] translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-in-out"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, rgba(255, 255, 255, 0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.06) 1px, transparent 1px)",
                  backgroundSize: "28px 28px",
                }}
              />
              <div className="relative z-10 text-xs font-extrabold uppercase tracking-wider text-[#162774] group-hover:text-white transition-colors duration-500">
                Community Guidelines
              </div>
              <ul className="relative z-10 space-y-2 text-xs text-slate-700 group-hover:text-blue-50 font-medium transition-colors duration-500">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#162774] group-hover:bg-white mt-1.5 shrink-0 transition-colors duration-500" />
                  <span>Respectful, constructive technical discussions and zero spam or self-promotion abuse.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#162774] group-hover:bg-white mt-1.5 shrink-0 transition-colors duration-500" />
                  <span>Authentic Proof-of-Work only — plagiarized code or fake metrics result in immediate removal.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#162774] group-hover:bg-white mt-1.5 shrink-0 transition-colors duration-500" />
                  <span>Help peers debug cleanly and share reproducible logs, repos, and benchmarks.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* ── 07. COMMUNITY & IMPACT — VERIFIED LIVE STATS ── */}
        <section
          className="rounded-3xl bg-[#162774] text-white p-6 sm:p-10 border border-white/15 shadow-2xl space-y-6"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255, 255, 255, 0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.06) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        >
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/15 pb-5">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#D9F83B] text-slate-950 text-[11px] font-extrabold uppercase tracking-wider">
                <span>07 &bull; Our Growing Community</span>
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                Verified Community &amp; Impact
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-blue-100/85 max-w-md font-medium">
              100% live numbers fetched directly from our database — zero inflated or fake statistics.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {[
              { label: "Registered Members", value: liveStats.registeredMembers },
              { label: "Published & Catalog Projects", value: liveStats.publishedProjects },
              { label: "Active & Completed Workshops", value: liveStats.completedWorkshops },
              { label: "Active Mentors & Team", value: liveStats.activeMentors },
              { label: "Community Contributions", value: liveStats.communityContributions },
            ].map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.92, y: 20, filter: "blur(5px)" }}
                whileInView={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.55, delay: idx * 0.07, ease: "easeOut" }}
                className="p-4 sm:p-5 rounded-2xl bg-white text-slate-950 border border-white/20 shadow-md space-y-1.5"
              >
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#162774]">
                  0{idx + 1} &bull; Live DB
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-950">
                  {stat.value}
                </div>
                <div className="text-xs font-semibold text-slate-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── 08. TEAM & PEOPLE — MEET THE PEOPLE BEHIND BOTMARTZ ── */}
        <section className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-5">
            <div className="space-y-2">
              <SectionBadge num="08" label="Team & People" />
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
                Meet the People Behind Botmartz
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md font-medium">
              Engineers, researchers, mentors, and community builders shipping the Botmartz platform and reviewing your projects.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {BOTMARTZ_TEAM.map((member) => {
              const isFounder = member.id === "soham-sharma";
              return (
                <div
                  key={member.id}
                  className="p-5 sm:p-6 rounded-3xl bg-[#F4F6FB] hover:bg-white border border-slate-200 hover:border-[#162774] transition-all duration-300 shadow-xs hover:shadow-lg space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-3.5">
                      {isFounder ? (
                        <img
                          src="/Sohamsharma.jpeg"
                          alt={member.name}
                          className="w-12 h-12 rounded-2xl object-cover border-2 border-[#D9F83B] shrink-0"
                        />
                      ) : (
                        <div
                          className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${member.avatarBg} text-white font-extrabold text-sm flex items-center justify-center shrink-0`}
                        >
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)}
                        </div>
                      )}
                      <div className="min-w-0">
                        <h3 className="text-base font-extrabold text-slate-950 truncate">
                          {member.name}
                        </h3>
                        <div className="text-xs font-bold text-[#162774] truncate">
                          {member.role}
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed font-medium">
                      {member.bio}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-200/70">
                    {member.specialties.slice(0, 4).map((spec) => (
                      <span
                        key={spec}
                        className="px-2.5 py-0.5 rounded-lg bg-white border border-slate-200 text-[10px] font-bold text-slate-700"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── 09. FOR COMPANIES & PARTNERS ── */}
        <section
          className="rounded-3xl bg-[#162774] text-white p-7 sm:p-10 border border-white/15 shadow-2xl space-y-6"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255, 255, 255, 0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.06) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="inline-block px-3.5 py-1 rounded-full bg-white/15 border border-white/20 text-white text-[11px] font-extrabold uppercase tracking-wider">
                09 &bull; For Companies &amp; Partners
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                Let&apos;s Build Something Together
              </h2>
              <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed font-medium">
                Partner with Botmartz Community to hire vetted builders, sponsor technical challenges, or upskill your engineering teams with practical production cohorts.
              </p>

              <div className="flex flex-wrap gap-3 pt-1">
                <a
                  href="mailto:team@botmartz.com?subject=Company%20Partnership%20%26%20Hiring%20Inquiry"
                  className="group relative overflow-hidden px-6 py-3.5 rounded-full bg-[#D9F83B] text-slate-950 font-extrabold text-xs sm:text-sm flex items-center gap-2.5 shadow-lg cursor-pointer"
                >
                  <span>Partner With Us</span>
                  <span className="w-6 h-6 rounded-full bg-slate-950 text-[#D9F83B] flex items-center justify-center transition-transform duration-300 group-hover:rotate-[60deg]">
                    <ArrowRight size={12} />
                  </span>
                </a>
                <Link
                  href="/certificates"
                  className="px-6 py-3.5 rounded-full bg-white text-[#162774] hover:bg-blue-50 font-extrabold text-xs sm:text-sm transition-all"
                >
                  Verify Candidate Credentials
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                "Hiring Partnerships",
                "Industry Workshops",
                "Sponsored Hackathons",
                "Corporate Training",
                "Technology Collaborations",
                "Campus Innovation Drives",
              ].map((collab, idx) => (
                <div
                  key={collab}
                  className="p-4 rounded-2xl bg-white text-slate-950 border-l-4 border-l-[#162774] flex items-center gap-3 shadow-sm"
                >
                  <span className="w-6 h-6 rounded-full bg-[#162774] text-white text-[10px] font-extrabold flex items-center justify-center shrink-0">
                    0{idx + 1}
                  </span>
                  <span className="text-xs font-extrabold text-slate-950">{collab}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 10. FAQS + CONTACT & SOCIALS ── */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start overflow-hidden">
          <motion.div
            initial={{ opacity: 0, x: -36, filter: "blur(6px)" }}
            whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.65, ease: "easeOut" }}
            className="lg:col-span-7 space-y-4"
          >
            <SectionBadge num="10" label="FAQs" />
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
              Frequently Asked Questions
            </h2>

            <div className="space-y-3">
              {FAQS.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={faq.q}
                    className={`rounded-2xl border overflow-hidden transition-all duration-300 ${
                      isOpen
                        ? "border-[#162774] shadow-md bg-white"
                        : "border-slate-200 hover:border-[#162774] bg-[#F4F6FB]"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="group relative overflow-hidden w-full p-4 sm:p-5 text-left flex items-center justify-between gap-3 cursor-pointer"
                    >
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 bg-[#162774] -translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-in-out"
                      />
                      <span className="relative z-10 text-xs sm:text-sm font-extrabold text-slate-950 group-hover:text-white transition-colors duration-500">
                        {faq.q}
                      </span>
                      <span
                        className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                          isOpen
                            ? "bg-[#162774] text-white"
                            : "bg-[#162774] group-hover:bg-white text-white group-hover:text-[#162774]"
                        }`}
                      >
                        <ArrowRight
                          size={13}
                          className={`transition-transform duration-300 ${
                            isOpen ? "rotate-90" : "group-hover:rotate-[60deg]"
                          }`}
                        />
                      </span>
                    </button>
                    {isOpen && (
                      <div className="px-4 sm:px-5 pb-4 text-xs text-slate-700 leading-relaxed font-medium border-t border-slate-200/70 pt-3 bg-white">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 36, filter: "blur(6px)" }}
            whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.65, delay: 0.08, ease: "easeOut" }}
            className="lg:col-span-5 rounded-3xl bg-[#F4F6FB] border border-slate-200 p-6 sm:p-8 space-y-5"
          >
            <SectionBadge num="Connect" label="Contact & Socials" />
            <h3 className="text-xl font-extrabold text-slate-950">
              Reach Out to Botmartz Team
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              For business enquiries, college collaborations, hackathon sponsorships, or hiring partnerships:
            </p>

            <a
              href="mailto:team@botmartz.com?subject=Botmartz%20Community%20Inquiry"
              className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-slate-200 hover:border-[#162774] transition-all"
            >
              <span className="w-9 h-9 rounded-xl bg-[#162774] text-white flex items-center justify-center shrink-0">
                <Mail size={16} />
              </span>
              <div>
                <div className="text-[11px] font-bold text-slate-500 uppercase">Email Us</div>
                <div className="text-sm font-extrabold text-[#162774]">team@botmartz.com</div>
              </div>
            </a>

            <div className="space-y-2">
              <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                Official Channels
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: "LinkedIn", href: "https://www.linkedin.com/company/botmartz-ai-solutions" },
                  { label: "Official X", href: "https://x.com/botmartz" },
                  { label: "Instagram", href: "https://www.instagram.com/botmartz" },
                  { label: "YouTube", href: "https://www.youtube.com/@botmartz" },
                ].map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-full bg-white hover:bg-[#162774] text-[#162774] hover:text-white border border-slate-200 text-xs font-extrabold transition-all"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        </section>

        {/* ── 11. FINAL CTA ── */}
        <motion.section
          initial={{ opacity: 0, scale: 0.96, y: 24, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          className="rounded-3xl bg-[#162774] text-white p-8 sm:p-12 border border-white/15 shadow-2xl text-center space-y-5"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255, 255, 255, 0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.06) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        >
          <span className="inline-block px-4 py-1 rounded-full bg-[#D9F83B] text-slate-950 text-[11px] font-extrabold uppercase tracking-wider">
            11 &bull; Final Call To Action
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold max-w-2xl mx-auto tracking-tight">
            Your Journey Starts Here.
          </h2>
          <p className="text-xs sm:text-base text-blue-100/90 max-w-xl mx-auto leading-relaxed font-medium">
            Join a community of learners, builders and innovators.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/login"
              className="group relative overflow-hidden px-7 py-3.5 rounded-full bg-[#D9F83B] text-slate-950 font-extrabold text-xs sm:text-sm transition-all flex items-center gap-2.5 shadow-lg cursor-pointer"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-white -translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-in-out"
              />
              <span className="relative z-10">Join Botmartz Today</span>
              <span className="relative z-10 w-6 h-6 rounded-full bg-slate-950 text-[#D9F83B] flex items-center justify-center transition-transform duration-300 group-hover:rotate-[60deg]">
                <ArrowRight size={12} />
              </span>
            </Link>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
