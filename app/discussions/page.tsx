"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
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
  User,
  Github,
  Linkedin,
  X,
  Send,
  Calendar,
  FileText,
  HelpCircle,
  Loader2
} from "lucide-react";

interface Comment {
  id: string;
  author: string;
  handle: string;
  text: string;
  timeAgo: string;
}

interface DiscussionPost {
  id: string;
  title: string;
  author: {
    name: string;
    handle: string;
    role: string;
    avatarBg: string;
    github?: string;
    discord?: string;
  };
  channel: string;
  tags: string[];
  content: string;
  upvotes: number;
  replies: number;
  commentsList?: Comment[];
  timeAgo: string;
  isHot?: boolean;
}

interface UserProfile {
  name: string;
  handle: string;
  role: string;
  bio: string;
  github: string;
  linkedin: string;
  discord: string;
  whatsapp: string;
}

const INITIAL_POSTS: DiscussionPost[] = [
  {
    id: "disc-1",
    title: "How are you handling deterministic state recovery in multi-agent LangGraph workflows?",
    author: {
      name: "Soham Sharma",
      handle: "@soham_ai",
      role: "Founder & AI Architect",
      avatarBg: "from-[#0066FF] to-[#00B8F0]",
      github: "https://github.com/soham2710",
      discord: "soham_ai#0001"
    },
    channel: "ai-agents",
    tags: ["LangGraph", "StateMachines", "Production"],
    content: "When running complex 5-step agent loops (e.g. Doc Retrieval -> Schema Validation -> Code Gen -> Sandbox Run -> Output Synthesizer), network timeouts on tool calls can corrupt state. We moved to PostgreSQL checkpointers with idempotent idempotency-keys. What's your setup?",
    upvotes: 52,
    replies: 3,
    commentsList: [
      { id: "c1", author: "Aarav Nair", handle: "@aaravn", text: "We use PostgresSaver with WAL journaling — cuts recover time to sub-10ms.", timeAgo: "1h ago" },
      { id: "c2", author: "Pooja Reddy", handle: "@poojadev", text: "Make sure you set auto-retry on 504 gateway timeouts before state rollbacks.", timeAgo: "30m ago" },
    ],
    timeAgo: "2 hours ago",
    isHot: true
  },
  {
    id: "disc-2",
    title: "📄 [Wednesday Resume Review] AI Engineer (2 YoE) seeking RAG Architect roles — Tear down my resume!",
    author: {
      name: "Rohan Varma",
      handle: "@rohan_v",
      role: "Junior AI Engineer",
      avatarBg: "from-emerald-500 to-teal-700",
      github: "https://github.com",
      discord: "rohan_v#1234"
    },
    channel: "resume-review",
    tags: ["ResumeReview", "Wednesday", "Career"],
    content: "Hey community! It's Resume Review Wednesday. I've built 2 production RAG pipelines with Qdrant & FastAPI. Should I emphasize latency optimization benchmarks more than model fine-tuning? Here is my GitHub portfolio.",
    upvotes: 41,
    replies: 2,
    commentsList: [
      { id: "c3", author: "Dr. Promit Ray", handle: "@promit_ray", text: "Lead with your evaluation numbers: Hit Rate@K, latency per query, and token savings. Hiring managers care about measurable precision.", timeAgo: "45m ago" }
    ],
    timeAgo: "4 hours ago",
    isHot: true
  },
  {
    id: "disc-3",
    title: "🎙️ [AMA Questions] Submit your questions for our 3rd Saturday AMA on Foundation Model Reasoning",
    author: {
      name: "Dr. Promit Ray",
      handle: "@promit_ray",
      role: "Chief AI Officer",
      avatarBg: "from-amber-400 to-amber-600"
    },
    channel: "ama-questions",
    tags: ["AMA", "3rdSaturday", "Inference"],
    content: "This 3rd Saturday at 6 PM IST, we are diving deep into test-time compute, reasoning token scaling, and ONNX Runtime GPU optimizations. Drop your technical questions below so I can prepare deep dive code walk-throughs!",
    upvotes: 68,
    replies: 4,
    timeAgo: "Yesterday",
    isHot: true
  },
  {
    id: "disc-4",
    title: "🔥 [Showcase Thursday] Shipped an open-source MCP Server for BigQuery Dataform transformations",
    author: {
      name: "Pooja Reddy",
      handle: "@poojadev",
      role: "Data Systems Builder",
      avatarBg: "from-purple-500 to-indigo-600"
    },
    channel: "show-your-build",
    tags: ["ShowcaseThursday", "MCP", "BigQuery"],
    content: "Built a Model Context Protocol tool that lets Claude/Gemini inspect Dataform assertions, lineage trees, and run dry-run compilations directly from your IDE. Check out the GitHub repo and give feedback!",
    upvotes: 38,
    replies: 1,
    timeAgo: "2 days ago"
  }
];

const CHANNELS = [
  { id: "all", label: "All Channels" },
  { id: "show-your-build", label: "Showcase Thursdays" },
  { id: "resume-review", label: "Wednesday Resume Reviews" },
  { id: "ama-questions", label: "Saturday AMA Questions" },
  { id: "ai-agents", label: "AI Agents & Systems" },
  { id: "enterprise-rag", label: "Enterprise RAG & Search" },
  { id: "events-and-meetups", label: "Events & Hackathons" },
];

function DiscussionsContent() {
  const searchParams = useSearchParams();
  const initialChannel = searchParams.get("channel") || "all";

  const [posts, setPosts] = useState<DiscussionPost[]>(INITIAL_POSTS);
  const [selectedChannel, setSelectedChannel] = useState(initialChannel);
  const [searchQuery, setSearchQuery] = useState("");
  const [upvotedIds, setUpvotedIds] = useState<Record<string, boolean>>({});

  // Active Thread for Comments
  const [activeThread, setActiveThread] = useState<DiscussionPost | null>(null);
  const [newCommentText, setNewCommentText] = useState("");

  // User Profile State
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    name: "Soham Sharma",
    handle: "@soham_ai",
    role: "Founder & AI Architect",
    bio: "Building enterprise RAG, deterministic agents, and applied AI systems.",
    github: "https://github.com/soham2710",
    linkedin: "https://linkedin.com/in/soham-sharma",
    discord: "soham_ai#0001",
    whatsapp: "+91 98765 43210"
  });

  // Modal state for new discussion
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newChannel, setNewChannel] = useState("ai-agents");
  const [newTags, setNewTags] = useState("LangGraph, Production");

  useEffect(() => {
    if (searchParams.get("channel")) {
      setSelectedChannel(searchParams.get("channel")!);
    }
  }, [searchParams]);

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

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim() || !activeThread) return;

    const newComment: Comment = {
      id: `c-${Date.now()}`,
      author: profile.name,
      handle: profile.handle,
      text: newCommentText.trim(),
      timeAgo: "Just now"
    };

    setPosts(prev => prev.map(p => {
      if (p.id === activeThread.id) {
        const updatedComments = [...(p.commentsList || []), newComment];
        const updatedPost = { ...p, replies: p.replies + 1, commentsList: updatedComments };
        setActiveThread(updatedPost);
        return updatedPost;
      }
      return p;
    }));

    setNewCommentText("");
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const newPost: DiscussionPost = {
      id: `disc-${Date.now()}`,
      title: newTitle.trim(),
      author: {
        name: profile.name,
        handle: profile.handle,
        role: profile.role,
        avatarBg: "from-[#0066FF] to-[#0092D7]",
        github: profile.github,
        discord: profile.discord
      },
      channel: newChannel,
      tags: newTags.split(",").map(t => t.trim()).filter(Boolean),
      content: newContent.trim(),
      upvotes: 1,
      replies: 0,
      commentsList: [],
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
    <div className="bg-[#FAFCFF] min-h-screen text-slate-900 py-12 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-slate-200 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#0066FF] font-mono text-xs font-semibold mb-3">
              <MessageSquare size={13} /> 2,400+ ACTIVE AI BUILDERS
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Community Discussions &amp; Forum
            </h1>
            <p className="text-slate-600 text-sm max-w-2xl mt-1">
              Ask technical questions, share architecture diagrams, join Wednesday Resume Reviews, and submit 3rd Saturday AMA questions.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowProfileModal(true)}
              className="bg-white border border-slate-200 hover:border-[#0066FF] text-slate-700 hover:text-[#0066FF] px-4 py-3 rounded-xl font-mono text-xs font-bold transition-all shadow-2xs flex items-center gap-2 cursor-pointer"
            >
              <User size={15} className="text-[#0066FF]" />
              <span>My Builder Profile</span>
            </button>

            <button
              onClick={() => setShowModal(true)}
              className="bg-[#0066FF] hover:bg-[#0052CC] text-white px-5 py-3 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-sm flex items-center gap-2 cursor-pointer"
            >
              <Plus size={16} /> Start Topic
            </button>
          </div>
        </div>

        {/* WhatsApp & Discord Callout Bar */}
        <div className="bg-gradient-to-r from-emerald-50 via-indigo-50 to-blue-50 border border-slate-200 rounded-2xl p-4 sm:p-5 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-center gap-3 text-xs text-slate-700">
            <Sparkles size={16} className="text-[#0066FF] shrink-0" />
            <span>Join our real-time developer groups for daily voice jams, instant debugging, and job openings.</span>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="https://chat.whatsapp.com/DkzKwpjuktaCYAofOtMlAQ"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-xs font-bold shadow-2xs flex items-center gap-1.5"
            >
              <MessageCircle size={13} />
              <span>WhatsApp Group</span>
            </a>
            <a
              href="https://discord.gg/k75ZpEnzp"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-mono text-xs font-bold shadow-2xs"
            >
              Discord Server
            </a>
          </div>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left Channels Column */}
          <div className="space-y-6">
            
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs">
              <div className="text-xs font-mono text-slate-400 uppercase font-bold mb-4 px-2">
                Discussion Channels
              </div>
              <div className="space-y-1">
                {CHANNELS.map(ch => (
                  <button
                    key={ch.id}
                    onClick={() => setSelectedChannel(ch.id)}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all flex items-center justify-between ${
                      selectedChannel === ch.id
                        ? "bg-[#0066FF] text-white font-bold shadow-xs"
                        : "text-slate-700 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    <span>{ch.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Weekly Community Rituals Card */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs">
              <div className="text-xs font-mono text-slate-400 uppercase font-bold mb-3 px-2 flex items-center gap-1.5">
                <Calendar size={14} className="text-[#0066FF]" /> Weekly Rituals
              </div>
              <div className="space-y-2.5 text-xs">
                <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-100">
                  <div className="font-bold text-purple-900">Showcase Thursdays</div>
                  <div className="text-[11px] text-purple-700">Live community project demos &amp; voting</div>
                </div>
                <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-100">
                  <div className="font-bold text-blue-900">Wednesday Resume Reviews</div>
                  <div className="text-[11px] text-blue-700">1-on-1 portfolio &amp; CV teardowns</div>
                </div>
                <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-100">
                  <div className="font-bold text-amber-900">3rd Saturday AMAs</div>
                  <div className="text-[11px] text-amber-700">Live technical Q&amp;A with founders</div>
                </div>
              </div>
            </div>

          </div>

          {/* Center Posts Feed */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Search bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Search discussions by keyword, question, or tag..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-2xl pl-11 pr-4 py-3 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0066FF] shadow-2xs"
              />
            </div>

            {/* Post Feed */}
            <div className="space-y-4">
              {filteredPosts.map(post => (
                <div
                  key={post.id}
                  className="bg-white border border-slate-200 hover:border-slate-300 rounded-3xl p-6 sm:p-7 shadow-xs hover:shadow-md transition-all"
                >
                  {/* Author Header */}
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${post.author.avatarBg} flex items-center justify-center font-bold font-mono text-white text-xs shadow-xs`}>
                        {post.author.name.split(' ').map(n=>n[0]).join('')}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                          <span>{post.author.name}</span>
                          <span className="text-[10px] font-mono text-slate-400">{post.author.handle}</span>
                        </div>
                        <div className="text-[10px] font-mono text-[#0066FF]">{post.author.role}</div>
                      </div>
                    </div>

                    <div className="text-[11px] font-mono text-slate-400">{post.timeAgo}</div>
                  </div>

                  {/* Title & Content */}
                  <h2 className="text-lg font-bold text-slate-900 mb-2 leading-snug">
                    {post.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-5">
                    {post.content}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {post.tags.map(t => (
                      <span key={t} className="px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-100 text-[#0066FF] font-mono text-[10px]">
                        #{t}
                      </span>
                    ))}
                  </div>

                  {/* Actions Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleUpvote(post.id)}
                        className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-mono text-xs transition-all cursor-pointer ${
                          upvotedIds[post.id]
                            ? "bg-[#0066FF] text-white font-bold shadow-xs"
                            : "bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200"
                        }`}
                      >
                        <ThumbsUp size={13} className={upvotedIds[post.id] ? "fill-current" : ""} />
                        <span>{post.upvotes} Upvotes</span>
                      </button>

                      <button
                        onClick={() => setActiveThread(post)}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-mono border border-slate-200 transition-colors cursor-pointer"
                      >
                        <MessageCircle size={14} className="text-[#0066FF]" />
                        <span>{post.replies} Comments / Live Replies</span>
                      </button>
                    </div>

                    <button
                      onClick={() => alert("Link copied to clipboard!")}
                      className="p-2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
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

      {/* Live Comments Thread Modal */}
      {activeThread && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl flex flex-col max-h-[85vh]">
            
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-200 mb-4">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#0066FF] font-bold">LIVE THREAD</span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">{activeThread.title}</h3>
              </div>
              <button
                onClick={() => setActiveThread(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-2 mb-4">
              {(!activeThread.commentsList || activeThread.commentsList.length === 0) ? (
                <div className="text-center py-8 text-xs font-mono text-slate-400">
                  No replies yet. Be the first builder to answer!
                </div>
              ) : (
                activeThread.commentsList.map(c => (
                  <div key={c.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-slate-900">{c.author} <span className="text-slate-400 font-mono text-[10px]">{c.handle}</span></span>
                      <span className="text-[10px] font-mono text-slate-400">{c.timeAgo}</span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">{c.text}</p>
                  </div>
                ))
              )}
            </div>

            {/* Comment Input */}
            <form onSubmit={handleAddComment} className="pt-3 border-t border-slate-100 flex gap-2">
              <input
                type="text"
                placeholder={`Replying as ${profile.name}...`}
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
              />
              <button
                type="submit"
                className="bg-[#0066FF] hover:bg-[#0052CC] text-white px-5 py-2.5 rounded-xl font-mono text-xs font-bold uppercase transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <span>Reply</span>
                <Send size={12} />
              </button>
            </form>

          </div>
        </div>
      )}

      {/* User Profile Registration / Edit Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Builder Profile &amp; Social Links</h3>
                <p className="text-xs text-slate-500">Visible to other builders on discussions and showcase arena.</p>
              </div>
              <button
                onClick={() => setShowProfileModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setShowProfileModal(false);
                alert("Profile updated successfully!");
              }}
              className="space-y-3.5"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-slate-600 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-600 mb-1">Handle</label>
                  <input
                    type="text"
                    value={profile.handle}
                    onChange={(e) => setProfile({ ...profile, handle: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-600 mb-1">Title / Focus Area</label>
                <input
                  type="text"
                  value={profile.role}
                  onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                  placeholder="e.g. AI Engineer • LangGraph Specialist"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-slate-600 mb-1">GitHub URL</label>
                  <input
                    type="url"
                    value={profile.github}
                    onChange={(e) => setProfile({ ...profile, github: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-600 mb-1">Discord Tag</label>
                  <input
                    type="text"
                    value={profile.discord}
                    onChange={(e) => setProfile({ ...profile, discord: e.target.value })}
                    placeholder="user#1234"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-600 mb-1">WhatsApp Phone (for group invites)</label>
                <input
                  type="text"
                  value={profile.whatsapp}
                  onChange={(e) => setProfile({ ...profile, whatsapp: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                />
              </div>

              <div className="pt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowProfileModal(false)}
                  className="px-4 py-2 text-xs font-mono text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-xl text-xs font-mono font-bold uppercase transition-all shadow-sm cursor-pointer"
                >
                  Save Profile →
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* New Discussion Topic Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl">
            <h2 className="text-xl font-bold text-slate-900 mb-1">Start a Discussion Topic</h2>
            <p className="text-xs text-slate-500 mb-6">Ask the community or post in Wednesday Resume Reviews &amp; 3rd Saturday AMAs.</p>
            
            <form onSubmit={handleCreatePost} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-700 mb-1">Topic Title</label>
                <input
                  type="text"
                  placeholder="e.g. Best practices for streaming structured JSON from LLMs..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-slate-700 mb-1">Channel</label>
                  <select
                    value={newChannel}
                    onChange={(e) => setNewChannel(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                  >
                    <option value="show-your-build">Showcase Thursdays</option>
                    <option value="resume-review">Wednesday Resume Reviews</option>
                    <option value="ama-questions">Saturday AMA Questions</option>
                    <option value="ai-agents">AI Agents &amp; Systems</option>
                    <option value="enterprise-rag">Enterprise RAG</option>
                    <option value="events-and-meetups">Events &amp; Meetups</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-700 mb-1">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={newTags}
                    onChange={(e) => setNewTags(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-700 mb-1">Your Question / Findings / Resume Details</label>
                <textarea
                  rows={4}
                  placeholder="Share context, code snippet, or portfolio links..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                  required
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-mono text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-xl text-xs font-mono font-bold uppercase transition-all shadow-sm cursor-pointer"
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

export default function CommunityDiscussionsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FAFCFF] flex items-center justify-center text-slate-500 py-32">
        <Loader2 className="animate-spin text-[#0066FF]" size={28} />
      </div>
    }>
      <DiscussionsContent />
    </Suspense>
  );
}
