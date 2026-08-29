import React from "react";
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
  Flame
} from "lucide-react";

export default function SquadCollaborationPage() {
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
    <div className="min-h-screen bg-slate-100 text-slate-900 pb-20">
      {/* Header Banner */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 text-[#0066FF] font-mono text-xs font-bold uppercase tracking-wider mb-2 border border-blue-200">
            <Users size={14} /> Peer Squad Matchmaker
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">
            Cross-Team Collaboration &amp; Discord Squads
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm font-mono mt-1">
            Form multi-disciplinary teams (Developers, AI Engineers, Pen-testers, QA) and collaborate live in dedicated Discord group threads.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-8 space-y-8">
        
        {/* Discord Architecture Notice */}
        <div className="p-6 rounded-3xl bg-slate-900 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 font-mono text-xs border border-slate-800 shadow-md">
          <div>
            <span className="text-amber-400 font-bold block mb-1">💬 Discord Dedicated Voice &amp; Chat Rooms</span>
            <p className="text-slate-300 max-w-2xl leading-relaxed">
              To keep our web platform lightweight and zero-trust compliant, all live team text chats, voice debugging sessions, and screen shares occur in private and public Discord squad threads.
            </p>
          </div>
          <a
            href="https://discord.gg/k75ZpEnzp"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shrink-0 flex items-center gap-2 transition-all shadow-sm"
          >
            <span>Open Discord Squad Rooms</span>
            <ExternalLink size={14} />
          </a>
        </div>

        {/* Active Domain Squads */}
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
                <span>Join Discord Squad</span>
                <ExternalLink size={13} />
              </a>
            </div>
          ))}
        </div>

        {/* Squad Formation Rules */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
          <h2 className="text-base font-bold text-slate-900 font-mono mb-4 uppercase tracking-wider text-xs text-slate-500">
            Squad Formation &amp; Collaboration Guidelines
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs text-slate-700">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="font-bold text-slate-900 mb-1">1. Multi-Role Balance</div>
              <p className="text-slate-500 text-[11px]">Teams can have up to 4 members: 1 Lead Dev, 1 AI/Data Engineer, 1 QA/Pentester, 1 PM.</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="font-bold text-slate-900 mb-1">2. Equal Referral Credit</div>
              <p className="text-slate-500 text-[11px]">All squad members receive full 15-company referral credit upon milestone completion.</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="font-bold text-slate-900 mb-1">3. Saturday Syncs</div>
              <p className="text-slate-500 text-[11px]">Weekly progress reviews happen during Saturday office hours (Indore + Discord).</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
