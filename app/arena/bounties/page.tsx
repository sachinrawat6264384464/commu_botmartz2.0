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
  Filter
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
    <div className="min-h-screen bg-slate-100 text-slate-900 pb-20">
      {/* Header Banner */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 text-amber-800 font-mono text-xs font-bold uppercase tracking-wider mb-2 border border-amber-200">
                <Coins size={14} className="text-amber-600" /> Peer Assistance Bounties
              </div>
              <h1 className="text-3xl font-extrabold text-slate-900">
                Community Blocker &amp; Help Bounty Board
              </h1>
              <p className="text-slate-600 text-xs sm:text-sm font-mono mt-1">
                Post technical roadblocks with a coin reward. Collaborate and solve issues live in Discord squad rooms.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowModal(true)}
                className="px-5 py-3 rounded-2xl bg-[#0066FF] hover:bg-[#0052CC] text-white font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-xs flex items-center gap-2 cursor-pointer"
              >
                <PlusCircle size={15} />
                <span>Post Blocker Bounty</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-8 space-y-6">
        
        {/* Discord Bridge Banner */}
        <div className="p-6 rounded-3xl bg-slate-900 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 font-mono text-xs border border-slate-800 shadow-md">
          <div>
            <span className="text-amber-400 font-bold block mb-1">⚡ Live Discord Collaboration</span>
            <p className="text-slate-300">
              Discussions and squad debugging sessions happen directly on the official Discord server in dedicated voice &amp; text rooms with Founder Soham Sharma.
            </p>
          </div>
          <a
            href="https://discord.gg/k75ZpEnzp"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shrink-0 flex items-center gap-2 transition-all"
          >
            <span>Join Discord Hub</span>
            <ExternalLink size={14} />
          </a>
        </div>

        {/* Bounties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full py-16 text-center text-slate-400 font-mono text-xs flex items-center justify-center gap-2">
              <Loader2 size={16} className="animate-spin" /> Loading open bounties...
            </div>
          ) : (
            bounties.map((b, idx) => (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between hover:border-blue-300 transition-all font-mono text-xs"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 font-bold text-[11px] border border-amber-200 flex items-center gap-1">
                      <Coins size={12} className="text-amber-600" /> {b.bountyCoins} Coins Reward
                    </span>
                    <span className="text-[10px] text-slate-400">{b.domain}</span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm mb-1 leading-snug font-sans">
                    {b.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 mb-3">
                    Project: <strong>{b.projectTitle}</strong>
                  </p>

                  {b.description && (
                    <p className="text-slate-600 text-xs font-sans mb-4 line-clamp-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      {b.description}
                    </p>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  <span className="text-slate-500 text-[11px]">
                    By <strong>{b.authorName}</strong>
                  </span>

                  <a
                    href={b.discordThreadUrl || "https://discord.gg/k75ZpEnzp"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 transition-all"
                  >
                    <span>Solve on Discord</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            ))
          )}
        </div>

      </div>

      {/* Post Blocker Bounty Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 font-mono text-xs">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900 font-sans">Post a Technical Blocker Bounty</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateBounty} className="space-y-4">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Your Full Name:</label>
                <input
                  type="text"
                  required
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Your Student Email:</label>
                <input
                  type="email"
                  required
                  value={authorEmail}
                  onChange={(e) => setAuthorEmail(e.target.value)}
                  placeholder="e.g. rahul@college.edu"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Project Name:</label>
                <input
                  type="text"
                  required
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  placeholder="e.g. Autonomous Drone WebRTC Edge Telemetry"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Blocker Headline / Error Summary:</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Fixing CUDA memory leak in PyTorch MONAI UNETR 3D batch training"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Bounty Reward:</label>
                  <select
                    value={bountyCoins}
                    onChange={(e) => setBountyCoins(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                  >
                    <option value="50">50 Coins</option>
                    <option value="100">100 Coins</option>
                    <option value="150">150 Coins</option>
                    <option value="200">200 Coins</option>
                    <option value="300">300 Coins</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Domain Track:</label>
                  <select
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:outline-none focus:border-[#0066FF]"
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
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
                  <CheckCircle2 size={14} className="shrink-0" />
                  <span>{statusMsg}</span>
                </div>
              )}

              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle size={14} className="shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-2xl bg-[#0066FF] hover:bg-[#0052CC] text-white font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer shadow-xs"
              >
                {submitting ? <Loader2 size={14} className="animate-spin" /> : <span>Escrow Coins &amp; Post Bounty</span>}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
