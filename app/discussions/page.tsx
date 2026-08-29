"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  MessageSquare, 
  ThumbsUp, 
  Flame, 
  Search, 
  Plus, 
  Tag, 
  MessageCircle, 
  Share2, 
  Sparkles,
  CheckCircle2,
  TrendingUp,
  Filter,
  User
} from "lucide-react";

interface DiscussionPost {
  id: string;
  title: string;
  author: {
    name: string;
    handle: string;
    role: string;
    avatarBg: string;
  };
  channel: string;
  tags: string[];
  content: string;
  upvotes: number;
  replies: number;
  timeAgo: string;
  isHot?: boolean;
}

const INITIAL_POSTS: DiscussionPost[] = [
  {
    id: "disc-1",
    title: "How are you handling deterministic state recovery in multi-agent LangGraph workflows?",
    author: {
      name: "Soham Sharma",
      handle: "@soham_ai",
      role: "Founder & AI Architect",
      avatarBg: "from-[#0066FF] to-[#00B8F0]"
    },
    channel: "ai-agents",
    tags: ["LangGraph", "StateMachines", "Production"],
    content: "When running complex 5-step agent loops (e.g. Doc Retrieval -> Schema Validation -> Code Gen -> Sandbox Run -> Output Synthesizer), network timeouts on tool calls can corrupt state. We moved to PostgreSQL checkpointers with idempotent idempotency-keys. What's your setup?",
    upvotes: 48,
    replies: 19,
    timeAgo: "2 hours ago",
    isHot: true
  },
  {
    id: "disc-2",
    title: "BGE-Large vs Cohere Rerank v3: Real-world Latency vs Retrieval Precision benchmarks",
    author: {
      name: "Aarav Nair",
      handle: "@aaravn",
      role: "Senior ML Engineer",
      avatarBg: "from-purple-600 to-indigo-600"
    },
    channel: "enterprise-rag",
    tags: ["Rerankers", "Qdrant", "Benchmarks"],
    content: "Just benchmarked top 50 dense retrieval candidates over 100k insurance policies. Cohere v3 yields +4.2% Hit Rate@3, but adds 85ms roundtrip. Self-hosted BGE on an ONNX Runtime GPU microservice cuts latency down to 14ms. Here are the charts and evaluation scripts.",
    upvotes: 62,
    replies: 27,
    timeAgo: "5 hours ago",
    isHot: true
  },
  {
    id: "disc-3",
    title: "🚀 [Showcase] Built an open-source MCP Server for BigQuery Dataform transformations",
    author: {
      name: "Pooja Reddy",
      handle: "@poojadev",
      role: "Data Systems Builder",
      avatarBg: "from-emerald-500 to-teal-700"
    },
    channel: "show-your-build",
    tags: ["MCP", "BigQuery", "OpenSource"],
    content: "Built a Model Context Protocol tool that lets Claude/Gemini inspect Dataform assertions, lineage trees, and run dry-run compilations directly from your IDE. Check out the GitHub repo and give feedback!",
    upvotes: 35,
    replies: 12,
    timeAgo: "Yesterday"
  },
  {
    id: "disc-4",
    title: "Who is attending AI Frontier 2026 Summit in Indore? Let's coordinate a pre-summit hack night!",
    author: {
      name: "Karan Patel",
      handle: "@karan_p",
      role: "Community Lead",
      avatarBg: "from-amber-500 to-orange-600"
    },
    channel: "events-and-meetups",
    tags: ["AIFrontier2026", "Meetup", "HackNight"],
    content: "A bunch of builders from Bangalore, Pune, and Mumbai are flying in on Saturday before the summit. Setting up an informal hack jam and dinner. Drop your Discord ID below if you'd like an invite.",
    upvotes: 51,
    replies: 34,
    timeAgo: "1 day ago",
    isHot: true
  }
];

const CHANNELS = [
  { id: "all", label: "🔥 All Channels" },
  { id: "ai-agents", label: "🤖 AI Agents & Workflows" },
  { id: "enterprise-rag", label: "📚 Enterprise RAG" },
  { id: "show-your-build", label: "🚀 Show Your Build" },
  { id: "events-and-meetups", label: "🎟️ Events & Hackathons" },
  { id: "prompts-and-evals", label: "🧪 Prompts & Evals" },
];

export default function CommunityDiscussionsPage() {
  const [posts, setPosts] = useState<DiscussionPost[]>(INITIAL_POSTS);
  const [selectedChannel, setSelectedChannel] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [upvotedIds, setUpvotedIds] = useState<Record<string, boolean>>({});
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newChannel, setNewChannel] = useState("ai-agents");
  const [newTags, setNewTags] = useState("AI, Production");

  const toggleUpvote = (id: string) => {
    setUpvotedIds(prev => ({ ...prev, [id]: !prev[id] }));
    setPosts(prev => prev.map(p => {
      if (p.id === id) {
        const isUp = upvotedIds[id];
        return { ...p, upvotes: isUp ? p.upvotes - 1 : p.upvotes + 1 };
      }
      return p;
    }));
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const newPost: DiscussionPost = {
      id: `disc-${Date.now()}`,
      title: newTitle.trim(),
      author: {
        name: "You (Community Builder)",
        handle: "@builder",
        role: "Member",
        avatarBg: "from-blue-500 to-indigo-600"
      },
      channel: newChannel,
      tags: newTags.split(",").map(t => t.trim()).filter(Boolean),
      content: newContent.trim(),
      upvotes: 1,
      replies: 0,
      timeAgo: "Just now"
    };

    setPosts([newPost, ...posts]);
    setUpvotedIds(prev => ({ ...prev, [newPost.id]: true }));
    setShowModal(false);
    setNewTitle("");
    setNewContent("");
  };

  const filteredPosts = posts.filter(p => {
    const matchesChannel = selectedChannel === "all" || p.channel === selectedChannel;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesChannel && matchesSearch;
  });

  return (
    <div className="bg-[#050B14] min-h-screen text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-10 border-b border-white/10 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#00B8F0]/10 border border-[#00B8F0]/30 text-[#00B8F0] font-mono text-xs font-semibold mb-3">
              <MessageSquare size={13} /> 2,400+ ACTIVE AI BUILDERS
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Community Discussions &amp; Forum
            </h1>
            <p className="text-slate-400 text-sm max-w-2xl mt-1">
              Ask technical questions, share architecture diagrams, debate AI frameworks, and show off your production creations.
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="bg-[#0066FF] hover:bg-[#0052CC] text-white px-6 py-3.5 rounded-2xl font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_25px_rgba(0,102,255,0.4)] flex items-center gap-2 cursor-pointer self-start md:self-auto"
          >
            <Plus size={16} /> Start a Discussion
          </button>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left Channels Column */}
          <div className="space-y-6">
            
            <div className="bg-[#0B1524] border border-white/10 rounded-3xl p-5 shadow-xl">
              <div className="text-xs font-mono text-slate-400 uppercase font-bold mb-4 px-2">
                Channels
              </div>
              <div className="space-y-1">
                {CHANNELS.map(ch => (
                  <button
                    key={ch.id}
                    onClick={() => setSelectedChannel(ch.id)}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-mono transition-all flex items-center justify-between ${
                      selectedChannel === ch.id
                        ? "bg-[#0066FF] text-white font-bold shadow-md"
                        : "text-slate-300 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <span>{ch.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Trending Tags Widget */}
            <div className="bg-[#0B1524] border border-white/10 rounded-3xl p-5 shadow-xl">
              <div className="text-xs font-mono text-slate-400 uppercase font-bold mb-3 px-2 flex items-center gap-1.5">
                <Flame size={14} className="text-rose-400" /> Trending Topics
              </div>
              <div className="flex flex-wrap gap-2">
                {["LangGraph", "EnterpriseRAG", "MCP", "Qdrant", "LocalLLMs", "RAGAS", "AgentEvals"].map(tag => (
                  <span
                    key={tag}
                    onClick={() => setSearchQuery(tag)}
                    className="px-2.5 py-1 rounded-lg bg-[#050B14] border border-white/10 hover:border-[#00B8F0] text-slate-300 hover:text-[#00B8F0] text-[11px] font-mono cursor-pointer transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* Center Posts Feed */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Search & Sort bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Search discussions by keyword, question, or tag..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0B1524] border border-white/10 rounded-2xl pl-11 pr-4 py-3 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#00B8F0]"
              />
            </div>

            {/* Post Feed */}
            <div className="space-y-4">
              {filteredPosts.map(post => (
                <div
                  key={post.id}
                  className="bg-[#0B1524] border border-white/10 hover:border-white/20 rounded-3xl p-6 sm:p-7 shadow-xl transition-all"
                >
                  {/* Author Header */}
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${post.author.avatarBg} flex items-center justify-center font-bold font-mono text-white text-xs shadow-md`}>
                        {post.author.name.split(' ').map(n=>n[0]).join('')}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-2">
                          <span>{post.author.name}</span>
                          <span className="text-[10px] font-mono text-slate-400">{post.author.handle}</span>
                        </div>
                        <div className="text-[10px] font-mono text-[#00B8F0]">{post.author.role}</div>
                      </div>
                    </div>

                    <div className="text-[11px] font-mono text-slate-500">{post.timeAgo}</div>
                  </div>

                  {/* Title & Content */}
                  <h2 className="text-lg font-bold text-white mb-2.5 leading-snug">
                    {post.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-5">
                    {post.content}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-5">
                    {post.tags.map(t => (
                      <span key={t} className="px-2 py-0.5 rounded bg-[#050B14] border border-white/10 text-[#00B8F0] font-mono text-[10px]">
                        #{t}
                      </span>
                    ))}
                  </div>

                  {/* Actions Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => toggleUpvote(post.id)}
                        className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-mono text-xs transition-all cursor-pointer ${
                          upvotedIds[post.id]
                            ? "bg-[#0066FF] text-white font-bold shadow-md"
                            : "bg-[#050B14] text-slate-400 hover:text-white border border-white/10"
                        }`}
                      >
                        <ThumbsUp size={13} className={upvotedIds[post.id] ? "fill-current" : ""} />
                        <span>{post.upvotes} Upvotes</span>
                      </button>

                      <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
                        <MessageCircle size={14} />
                        <span>{post.replies} Replies</span>
                      </div>
                    </div>

                    <button
                      onClick={() => alert("Link copied to clipboard!")}
                      className="p-2 text-slate-500 hover:text-white transition-colors"
                      title="Share Post"
                    >
                      <Share2 size={15} />
                    </button>
                  </div>

                </div>
              ))}
            </div>

          </div>

        </div>

      </div>

      {/* New Discussion Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0B1524] border border-white/15 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-1">Start a Discussion</h2>
            <p className="text-xs text-slate-400 mb-6">Ask the community or share insights from your latest builds.</p>
            
            <form onSubmit={handleCreatePost} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Topic Title</label>
                <input
                  type="text"
                  placeholder="e.g. Best practices for streaming structured JSON from LLMs..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-[#050B14] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Channel</label>
                  <select
                    value={newChannel}
                    onChange={(e) => setNewChannel(e.target.value)}
                    className="w-full bg-[#050B14] border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white"
                  >
                    <option value="ai-agents">🤖 AI Agents</option>
                    <option value="enterprise-rag">📚 Enterprise RAG</option>
                    <option value="show-your-build">🚀 Show Your Build</option>
                    <option value="events-and-meetups">🎟️ Events &amp; Meetups</option>
                    <option value="prompts-and-evals">🧪 Prompts &amp; Evals</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={newTags}
                    onChange={(e) => setNewTags(e.target.value)}
                    className="w-full bg-[#050B14] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Your Question / Findings</label>
                <textarea
                  rows={4}
                  placeholder="Share context, code snippet, or details..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full bg-[#050B14] border border-white/15 rounded-xl p-3.5 text-xs text-white"
                  required
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-mono text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-xl text-xs font-mono font-bold uppercase transition-all shadow-md cursor-pointer"
                >
                  Publish Discussion →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
