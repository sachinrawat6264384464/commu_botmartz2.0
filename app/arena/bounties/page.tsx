"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Coins,
  MessageSquare,
  PlusCircle,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Flame,
  ArrowRight,
  ShieldCheck,
  Search,
  Filter,
  Sparkles,
  Zap
} from "lucide-react";

export default function BountiesBoardPage() {
  const [bounties, setBounties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // New Bounty Form State
  const [showModal, setShowModal] = useState(false);
  const [authorName, setAuthorName] = useState("");
  const [authorEmail, setAuthorEmail] = useState("");
  const [projectTitle, setProjectTitle] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [bountyCoins, setBountyCoins] = useState("100");
  const [domain, setDomain] = useState("AI & Machine Learning");
  const [discordUrl, setDiscordUrl] = useState("https://discord.gg/k75ZpEnzp");

  const [submitting, setSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const fetchBounties = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/arena/bounties");
      const data = await res.json();
      if (data.bounties && Array.isArray(data.bounties)) {
        setBounties(data.bounties);
      }
    } catch (e) {
      console.warn("Failed to load bounties:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBounties();
  }, []);

  const handleCreateBounty = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setStatusMsg("");
    setErrorMsg("");

    try {
      const res = await fetch("/api/arena/bounties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authorName,
          authorEmail,
          projectTitle,
          title,
          description,
          bountyCoins: parseInt(bountyCoins, 10),
          domain,
          discordThreadUrl: discordUrl
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to post bounty.");
      }

      setStatusMsg(data.message || "Bounty created successfully!");
      setTitle("");
      setDescription("");
      fetchBounties();
      setTimeout(() => setShowModal(false), 2000);
    } catch (err: any) {
      setErrorMsg(err.message || "Error posting bounty.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24 font-sans selection:bg-[#0066FF] selection:text-white">
      
      {/* ── HERO HEADER BANNER ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-850 to-blue-950 text-white pt-24 pb-16 border-b-2 border-slate-800 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-xs font-black border border-amber-400/30 backdrop-blur-md">
                <Coins size={14} className="text-amber-400" />
                <span>PEER ASSISTANCE BOUNTY ESCROW</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white font-sans leading-tight">
                Community Blocker &amp; <span className="bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent">Bounty Board</span>
              </h1>
              <p className="text-sm sm:text-base text-slate-300 font-sans leading-relaxed">
                Post technical roadblocks with Karma coin rewards. Debug and solve issues live in dedicated Discord squad rooms.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowModal(true)}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#0066FF] to-blue-600 hover:from-blue-700 hover:to-blue-600 text-white font-mono text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-blue-500/25 flex items-center gap-2 cursor-pointer border border-blue-400/30"
              >
                <PlusCircle size={16} />
                <span>Post Blocker Bounty</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 mt-10 space-y-8">
        
        {/* ── DISCORD LIVE COLLABORATION BANNER ── */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-2 border-indigo-500/30 shadow-xl font-sans relative overflow-hidden group">
          <div className="space-y-2 relative z-10">
            <span className="flex items-center gap-2 text-xs font-mono font-black text-amber-300 uppercase tracking-wider">
              <Zap size={15} className="text-amber-400 animate-bounce" />
              <span>Live Squad Debugging Rooms Active</span>
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Solve Roadblocks &amp; Earn Karma Coins Live on Discord
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Discussions and squad debugging sessions happen directly on the official Discord server in dedicated voice &amp; text rooms with Founder Soham Sharma.
            </p>
          </div>

          <a
            href="https://discord.gg/k75ZpEnzp"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-black uppercase tracking-wider shrink-0 flex items-center gap-2 transition-all shadow-lg shadow-indigo-600/30 border border-indigo-400/30 hover:scale-[1.02] cursor-pointer relative z-10"
          >
            <MessageSquare size={16} />
            <span>Join Discord Hub</span>
            <ExternalLink size={14} />
          </a>
        </div>

        {/* ── BOUNTIES GRID ── */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b-2 border-slate-200 pb-3 font-mono text-xs">
            <span className="font-black text-slate-900 text-sm uppercase">Open Technical Bounties ({bounties.length})</span>
            <span className="text-slate-500">Sorted by Newest First</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-full py-20 text-center text-slate-400 font-mono text-xs flex items-center justify-center gap-2">
                <Loader2 size={18} className="animate-spin text-[#0066FF]" />
                <span>Loading open blocker bounties...</span>
              </div>
            ) : bounties.length === 0 ? (
              <div className="col-span-full py-16 text-center bg-white rounded-3xl border-2 border-slate-200 p-8 font-sans space-y-3">
                <Coins size={36} className="mx-auto text-amber-500" />
                <h3 className="text-lg font-black text-slate-900">No Open Bounties Right Now</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Be the first builder to post a blocker bounty with a coin reward!
                </p>
                <button
                  onClick={() => setShowModal(true)}
                  className="px-5 py-2.5 rounded-xl bg-[#0066FF] text-white font-mono text-xs font-bold"
                >
                  + Post First Bounty
                </button>
              </div>
            ) : (
              bounties.map((b, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-3xl bg-white border-2 border-slate-200 shadow-lg flex flex-col justify-between hover:border-[#0066FF] hover:shadow-xl transition-all duration-300 font-sans group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 font-mono text-xs font-black border border-amber-300 flex items-center gap-1.5 shadow-2xs">
                        <Coins size={14} className="text-amber-500" />
                        <span>{b.bountyCoins} Coins Reward</span>
                      </span>
                      <span className="text-[10px] font-mono font-extrabold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                        {b.domain}
                      </span>
                    </div>

                    <h3 className="font-black text-slate-900 text-base leading-snug group-hover:text-[#0066FF] transition-colors">
                      {b.title}
                    </h3>
                    
                    <p className="text-xs text-slate-500 font-mono font-medium">
                      Project: <strong className="text-slate-800">{b.projectTitle}</strong>
                    </p>

                    {b.description && (
                      <p className="text-slate-700 text-xs font-sans leading-relaxed line-clamp-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                        {b.description}
                      </p>
                    )}
                  </div>

                  <div className="pt-4 mt-5 border-t border-slate-100 flex items-center justify-between gap-2 font-mono text-xs">
                    <div className="flex items-center gap-1.5 text-slate-600 font-bold">
                      <ShieldCheck size={14} className="text-[#0066FF]" />
                      <span>{b.authorName}</span>
                    </div>

                    <a
                      href={b.discordThreadUrl || "https://discord.gg/k75ZpEnzp"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-[#0066FF] text-white font-mono text-xs font-bold flex items-center gap-1.5 transition-all shadow-md"
                    >
                      <span>Solve on Discord</span>
                      <ExternalLink size={13} />
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* ── POST BLOCKER BOUNTY MODAL ── */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border-2 border-slate-200 font-sans text-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-xl font-black text-slate-900 tracking-tight">Post a Technical Blocker Bounty</h2>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 font-black flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateBounty} className="space-y-4 font-sans">
              <div>
                <label className="block text-slate-800 font-bold mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl p-3 font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                />
              </div>

              <div>
                <label className="block text-slate-800 font-bold mb-1">Your Student Email *</label>
                <input
                  type="email"
                  required
                  value={authorEmail}
                  onChange={(e) => setAuthorEmail(e.target.value)}
                  placeholder="e.g. rahul@college.edu"
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl p-3 font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                />
              </div>

              <div>
                <label className="block text-slate-800 font-bold mb-1">Project Name *</label>
                <input
                  type="text"
                  required
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  placeholder="e.g. Autonomous Drone WebRTC Edge Telemetry"
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl p-3 font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                />
              </div>

              <div>
                <label className="block text-slate-800 font-bold mb-1">Blocker Headline / Error Summary *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Fixing CUDA memory leak in PyTorch MONAI UNETR 3D batch training"
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl p-3 font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-800 font-bold mb-1">Bounty Reward *</label>
                  <select
                    value={bountyCoins}
                    onChange={(e) => setBountyCoins(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl p-3 font-mono font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                  >
                    <option value="50">50 Coins</option>
                    <option value="100">100 Coins</option>
                    <option value="150">150 Coins</option>
                    <option value="200">200 Coins</option>
                    <option value="300">300 Coins</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-800 font-bold mb-1">Domain Track *</label>
                  <select
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl p-3 font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                  >
                    <option value="AI & Machine Learning">AI &amp; ML</option>
                    <option value="Backend & Distributed">Backend &amp; DB</option>
                    <option value="Cloud DevOps & eBPF">DevOps &amp; eBPF</option>
                    <option value="Cybersecurity Pentesting">Pentesting</option>
                    <option value="Frontend & WebGPU">Frontend &amp; WebGPU</option>
                  </select>
                </div>
              </div>

              {statusMsg && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
                  <CheckCircle2 size={16} className="shrink-0 text-emerald-600" />
                  <span>{statusMsg}</span>
                </div>
              )}

              {errorMsg && (
                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle size={16} className="shrink-0 text-rose-600" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#0066FF] to-blue-600 hover:from-blue-700 hover:to-blue-600 text-white font-mono text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer shadow-lg shadow-blue-500/25"
              >
                {submitting ? <Loader2 size={16} className="animate-spin" /> : <span>Escrow Coins &amp; Post Bounty</span>}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
