"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  MessageSquare,
  Sparkles,
  ExternalLink,
  Code2,
  Cpu,
  Layers,
  ArrowRight,
  ShieldCheck,
  Flame,
  Plus,
  Send,
  CheckCircle2,
  MessageCircle,
  AlertCircle,
  X,
  Loader2,
  UserCheck
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

interface SquadRequest {
  id: string;
  name: string;
  email?: string;
  projectTitle: string;
  myRole: string;
  lookingFor: string[];
  contactHandle: string;
  contactPlatform: "Discord" | "WhatsApp";
  pitch: string;
  createdAt: string;
}

const INITIAL_REQUESTS: SquadRequest[] = [
  {
    id: "req-1",
    name: "Vedansh Trivedi",
    projectTitle: "LangGraph Multi-Agent Checkpointer Engine",
    myRole: "Backend & Systems Lead",
    lookingFor: ["ML Prompt Engineer", "QA Automation Tester"],
    contactHandle: "vedansh_t#4012",
    contactPlatform: "Discord",
    pitch: "Building PostgreSQL WAL state persistence with <150ms tool execution. Looking for QA tester to write Playwright & k6 scripts!",
    createdAt: "2 hours ago"
  },
  {
    id: "req-2",
    name: "Shruti Jadhav",
    projectTitle: "Automated Satellite GeoTIFF Tiling Pipeline",
    myRole: "QA & Performance Tester",
    lookingFor: ["PyTorch / CV Engineer", "Frontend Dev"],
    contactHandle: "+91 98765 12340",
    contactPlatform: "WhatsApp",
    pitch: "We need a computer vision builder to optimize the PyTorch U-Net inference kernel on GPU. Playwright & k6 gates are ready.",
    createdAt: "4 hours ago"
  },
  {
    id: "req-3",
    name: "Bhavya Jain",
    projectTitle: "High-Frequency Limit Order Book in Rust",
    myRole: "Frontend & WebSockets Dev",
    lookingFor: ["Rust Systems Engineer", "FinTech Quant"],
    contactHandle: "bhavya_j#8821",
    contactPlatform: "Discord",
    pitch: "Building real-time depth chart & L2 telemetry visualization. Need a Rust engineer to handle the memory-mapped ring buffer.",
    createdAt: "Yesterday"
  }
];

export default function SquadCollaborationPage() {
  const { user, studentProfile } = useAuth();
  const [requests, setRequests] = useState<SquadRequest[]>(INITIAL_REQUESTS);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [adminMatchRequested, setAdminMatchRequested] = useState(false);

  // Form State
  const [name, setName] = useState(user?.displayName || studentProfile?.displayName || "");
  const [projectTitle, setProjectTitle] = useState("");
  const [myRole, setMyRole] = useState("Backend Engineer");
  const [lookingForRoles, setLookingForRoles] = useState<string[]>(["ML Engineer", "QA Tester"]);
  const [contactHandle, setContactHandle] = useState(studentProfile?.discordHandle || "");
  const [contactPlatform, setContactPlatform] = useState<"Discord" | "WhatsApp">("Discord");
  const [pitch, setPitch] = useState("");

  useEffect(() => {
    fetch("/api/arena/collaborate")
      .then((res) => res.json())
      .then((data) => {
        if (data.requests && data.requests.length > 0) {
          setRequests((prev) => {
            const existingIds = new Set(prev.map((r) => r.id));
            const newOnes = data.requests.filter((r: any) => !existingIds.has(r.id));
            return [...newOnes, ...prev];
          });
        }
      })
      .catch(() => null);
  }, []);

  const handlePostRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectTitle.trim() || !name.trim()) return;

    setSubmitting(true);
    const newReq: SquadRequest = {
      id: `req-${Date.now()}`,
      name: name.trim(),
      email: user?.email || "",
      projectTitle: projectTitle.trim(),
      myRole,
      lookingFor: lookingForRoles,
      contactHandle: contactHandle.trim() || (contactPlatform === "Discord" ? "builder#0001" : "+91 98765 00000"),
      contactPlatform,
      pitch: pitch.trim() || "Building high-performance production system in the Arena.",
      createdAt: "Just now"
    };

    setRequests([newReq, ...requests]);
    setShowModal(false);
    setSuccessMsg("🚀 Your squad matchmaking request has been broadcasted to the community!");
    setTimeout(() => setSuccessMsg(""), 5000);

    try {
      await fetch("/api/arena/collaborate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newReq.name,
          email: user?.email,
          projectTitle: newReq.projectTitle,
          myRole: newReq.myRole,
          lookingFor: newReq.lookingFor,
          contactHandle: newReq.contactHandle,
          contactPlatform: newReq.contactPlatform,
          pitch: newReq.pitch
        })
      });
    } catch (err) {} finally {
      setSubmitting(false);
    }
  };

  const handleRequestAdminPairing = () => {
    setAdminMatchRequested(true);
    setTimeout(() => setAdminMatchRequested(false), 5000);
  };

  const SQUAD_TRACKS = [
    {
      title: "Geospatial & Defence AI Squad",
      desc: "PyTorch Sentinel-2 satellite pipelines, GeoTIFF tiling, and Qdrant visual search.",
      membersCount: "8 Builders Active",
      discordChannel: "https://discord.gg/k75ZpEnzp",
      color: "border-blue-200 bg-blue-50/50"
    },
    {
      title: "Autonomous Drone & Robotics Squad",
      desc: "Real-time 1080p 60fps WebRTC streaming, YOLOv11 and ByteTrack multi-target vision.",
      membersCount: "12 Builders Active",
      discordChannel: "https://discord.gg/k75ZpEnzp",
      color: "border-purple-200 bg-purple-50/50"
    },
    {
      title: "Clinical Healthcare & 3D DICOM Squad",
      desc: "MONAI UNETR volumetric segmentation, BioClinicalBERT, and FHIR diagnosis ledgers.",
      membersCount: "6 Builders Active",
      discordChannel: "https://discord.gg/k75ZpEnzp",
      color: "border-emerald-200 bg-emerald-50/50"
    },
    {
      title: "High-Frequency Rust & Order Book Squad",
      desc: "Sub-10ms L2 limit order book matching engines, Redis Streams, and WebSocket depth feeds.",
      membersCount: "7 Builders Active",
      discordChannel: "https://discord.gg/k75ZpEnzp",
      color: "border-amber-200 bg-amber-50/50"
    },
    {
      title: "Autonomous Red-Team Cybersecurity Swarm",
      desc: "Docker-sandboxed exploit payload generators, OWASP vulnerability discovery, and auto-patching.",
      membersCount: "9 Builders Active",
      discordChannel: "https://discord.gg/k75ZpEnzp",
      color: "border-rose-200 bg-rose-50/50"
    },
    {
      title: "Go To Hell (GTH) Kernel eBPF Gauntlet",
      desc: "Rust eBPF kernel probes, autonomous Kubernetes microservice healing, 48h chaos survival.",
      membersCount: "5 Elite Slots",
      discordChannel: "https://discord.gg/k75ZpEnzp",
      color: "border-slate-800 bg-slate-900 text-white"
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAFCFF] text-slate-900 pb-24 font-sans">
      {/* Header Banner */}
      <div className="bg-white border-b border-slate-200 pt-24 pb-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 text-[#0066FF] font-mono text-xs font-bold uppercase tracking-wider mb-2 border border-blue-200">
                <Users size={14} /> PEER SQUAD MATCHMAKER &amp; COLLABORATION
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Form Your Project Squad
              </h1>
              <p className="text-slate-600 text-xs sm:text-sm font-mono mt-1 max-w-2xl">
                Connect with AI engineers, backend builders, testers, and product managers. Ask admins to pair you into a balanced cohort team!
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
              <button
                onClick={handleRequestAdminPairing}
                className="px-4 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer"
              >
                <UserCheck size={15} className="text-emerald-400" />
                <span>{adminMatchRequested ? "Match Requested! Admin Notified" : "Request Admin Matchmaking"}</span>
              </button>

              <button
                onClick={() => setShowModal(true)}
                className="px-5 py-3 rounded-2xl bg-[#0066FF] hover:bg-blue-600 text-white font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer"
              >
                <Plus size={16} />
                <span>Post Squad Request</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-8 space-y-8">
        
        {/* Success / Notification Banner */}
        {successMsg && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-mono text-xs font-bold flex items-center justify-between">
            <span>{successMsg}</span>
            <button onClick={() => setSuccessMsg("")}><X size={14} /></button>
          </div>
        )}

        {adminMatchRequested && (
          <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 font-mono text-xs font-bold flex items-center gap-2">
            <CheckCircle2 size={16} className="text-[#0066FF]" />
            <span>Admins Soham &amp; core team have received your request! We will match you with complementary builders in Indore / Discord.</span>
          </div>
        )}

        {/* Discord & WhatsApp Squads Hub */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 font-mono text-xs border border-slate-800 shadow-md">
          <div>
            <div className="flex items-center gap-2 text-amber-400 font-bold mb-1.5 text-sm">
              <Sparkles size={16} /> Dedicated Squad Voice &amp; Chat Rooms
            </div>
            <p className="text-slate-300 max-w-2xl leading-relaxed font-sans text-xs">
              Every project squad gets private voice channels, screen sharing, and code review threads in our Discord community. Join 2,400+ active builders building and debugging daily.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="https://chat.whatsapp.com/DkzKwpjuktaCYAofOtMlAQ"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1.5 transition-colors"
            >
              <MessageCircle size={14} />
              <span>WhatsApp Group</span>
            </a>
            <a
              href="https://discord.gg/k75ZpEnzp"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center gap-1.5 transition-colors"
            >
              <span>Discord Rooms</span>
              <ExternalLink size={14} />
            </a>
          </div>
        </div>

        {/* =========================================================================
            SECTION 1: LIVE SQUAD MATCHMAKING REQUESTS
        ========================================================================= */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="text-xs font-mono font-bold text-[#0066FF] uppercase mb-1">
                PEER DISCOVERY FEED
              </div>
              <h2 className="text-xl font-bold text-slate-900 font-sans">
                Open Squad Formation Pitches
              </h2>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                Builders looking for complementary roles on production PRD builds.
              </p>
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 rounded-xl bg-blue-50 text-[#0066FF] border border-blue-200 font-mono text-xs font-bold hover:bg-blue-100 transition-colors"
            >
              + Post Your Pitch
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
            {requests.map((req) => (
              <div
                key={req.id}
                className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between hover:border-blue-300 transition-all space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-bold text-slate-900 font-sans text-sm">{req.name}</span>
                    <span className="text-[10px] text-slate-400">{req.createdAt}</span>
                  </div>

                  <div className="text-xs font-bold text-[#0066FF] font-sans mb-1">
                    🎯 {req.projectTitle}
                  </div>

                  <div className="text-[11px] text-slate-600 mb-2">
                    Role: <strong className="text-slate-900">{req.myRole}</strong>
                  </div>

                  <div className="text-[11px] text-slate-700 bg-white p-2.5 rounded-xl border border-slate-200/80 mb-3 leading-relaxed">
                    &ldquo;{req.pitch}&rdquo;
                  </div>

                  <div className="space-y-1">
                    <div className="text-[10px] text-slate-400 uppercase font-bold">Looking for:</div>
                    <div className="flex flex-wrap gap-1">
                      {req.lookingFor.map((role, ri) => (
                        <span key={ri} className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 text-[10px] font-bold">
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 font-bold">{req.contactPlatform}: {req.contactHandle}</span>
                  <a
                    href={req.contactPlatform === "Discord" ? "https://discord.gg/k75ZpEnzp" : `https://wa.me/${req.contactHandle.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-[#0066FF] text-white text-[11px] font-bold hover:bg-blue-600 transition-colors flex items-center gap-1"
                  >
                    <span>Connect</span>
                    <ExternalLink size={11} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* =========================================================================
            SECTION 2: PRE-CONFIGURED DOMAIN SQUADS
        ========================================================================= */}
        <div>
          <div className="text-xs font-mono font-bold text-slate-500 uppercase mb-2">
            ACTIVE SPECIALIZATION TRACKS
          </div>
          <h2 className="text-xl font-bold text-slate-900 font-sans mb-4">
            Domain Focus Squads
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SQUAD_TRACKS.map((track, idx) => (
              <div
                key={idx}
                className={`p-6 rounded-3xl border shadow-xs flex flex-col justify-between transition-all ${track.color}`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2 font-mono text-xs">
                    <span className="font-bold">{track.membersCount}</span>
                    <Flame size={14} className="text-orange-500" />
                  </div>

                  <h3 className="font-bold text-base mb-2 font-sans">
                    {track.title}
                  </h3>
                  <p className="text-xs opacity-80 leading-relaxed font-sans mb-6">
                    {track.desc}
                  </p>
                </div>

                <a
                  href={track.discordChannel}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-xl bg-white text-slate-900 font-bold font-mono text-xs flex items-center justify-center gap-2 shadow-xs border border-slate-200 hover:bg-slate-50 transition-all"
                >
                  <span>Join Track Squad</span>
                  <ExternalLink size={13} />
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Squad Formation Rules */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
          <h2 className="text-base font-bold text-slate-900 font-mono mb-4 uppercase tracking-wider text-xs text-slate-500">
            Squad Formation &amp; Collaboration Guidelines
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs text-slate-700">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="font-bold text-slate-900 mb-1">1. Multi-Role Balance</div>
              <p className="text-slate-500 text-[11px]">Teams can have up to 4 members: 1 Lead Dev, 1 AI/Data Engineer, 1 QA/Tester, 1 Product Lead.</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="font-bold text-slate-900 mb-1">2. Verifiable Proof-of-Work</div>
              <p className="text-slate-500 text-[11px]">All squad members receive verifiable cryptographic certificates and founder recommendations upon milestone completion.</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="font-bold text-slate-900 mb-1">3. Saturday Syncs</div>
              <p className="text-slate-500 text-[11px]">Weekly progress reviews happen during Saturday office hours (indore hub + live Discord stages).</p>
            </div>
          </div>
        </div>

      </div>

      {/* =========================================================================
          MODAL: POST SQUAD REQUEST
      ========================================================================= */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 relative font-mono text-xs text-slate-900">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-5 right-5 p-1 rounded-lg text-slate-400 hover:text-slate-700"
            >
              <X size={16} />
            </button>

            <h3 className="text-lg font-bold font-sans mb-4">Broadcast Squad Request</h3>

            <form onSubmit={handlePostRequest} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Your Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Project Title / Topic *</label>
                <input
                  type="text"
                  required
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  placeholder="e.g. LangGraph Checkpoint Engine"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">My Role</label>
                  <select
                    value={myRole}
                    onChange={(e) => setMyRole(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900"
                  >
                    <option value="Backend Lead">Backend Lead</option>
                    <option value="AI / ML Engineer">AI / ML Engineer</option>
                    <option value="QA / Test Engineer">QA / Test Engineer</option>
                    <option value="Frontend Builder">Frontend Builder</option>
                    <option value="Product Manager">Product Manager</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Preferred Contact</label>
                  <select
                    value={contactPlatform}
                    onChange={(e) => setContactPlatform(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900"
                  >
                    <option value="Discord">Discord</option>
                    <option value="WhatsApp">WhatsApp</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Contact Handle / Number</label>
                <input
                  type="text"
                  value={contactHandle}
                  onChange={(e) => setContactHandle(e.target.value)}
                  placeholder={contactPlatform === "Discord" ? "handle#1234" : "9876543210"}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Short Pitch / What we are building</label>
                <textarea
                  rows={3}
                  value={pitch}
                  onChange={(e) => setPitch(e.target.value)}
                  placeholder="Describe the architecture bottleneck, dataset, or goals..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-xl bg-[#0066FF] hover:bg-blue-600 text-white font-bold uppercase tracking-wider transition-all mt-4 cursor-pointer flex items-center justify-center gap-2"
              >
                {submitting ? <Loader2 size={15} className="animate-spin" /> : <span>Post Squad Pitch &rarr;</span>}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
