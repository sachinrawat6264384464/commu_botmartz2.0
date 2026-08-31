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
  Loader2,
  Coins,
  ShieldCheck,
  Award
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import AuthGate from "@/app/_components/AuthGate";

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
      role: "Founder / Director",
      avatarBg: "from-[#0066FF] to-[#00B8F0]",
      github: "https://github.com/soham2710",
      discord: "soham_ai#0001"
    },
    channel: "ai-agents",
    tags: ["LangGraph", "StateMachines", "Production"],
    content: "When running complex 5-step agent loops (e.g. Doc Retrieval -> Schema Validation -> Code Gen -> Sandbox Run -> Output Synthesizer), network timeouts on tool calls can corrupt state. We moved to PostgreSQL checkpointers with idempotent idempotency-keys. What's your setup?",
    upvotes: 64,
    replies: 3,
    commentsList: [
      { id: "c1", author: "Vedansh Trivedi", handle: "@vedansh_t", text: "We use PostgresSaver with WAL journaling in FastAPI — cuts state recovery time to sub-10ms.", timeAgo: "1h ago" },
      { id: "c2", author: "Sachin Rawat", handle: "@sachin_r", text: "Make sure you set auto-retry on 504 gateway timeouts before state rollbacks across microservices.", timeAgo: "45m ago" },
      { id: "c3", author: "Bhavya Jain", handle: "@bhavya_j", text: "Also check token limits when re-hydrating conversation buffers on failover.", timeAgo: "20m ago" }
    ],
    timeAgo: "2 hours ago",
    isHot: true
  },
  {
    id: "disc-2",
    title: "FastAPI + Pydantic v2 serialization benchmarks: 4x throughput with custom orjson response classes",
    author: {
      name: "Vedansh Trivedi",
      handle: "@vedansh_t",
      role: "Full Stack Developer (Python)",
      avatarBg: "from-blue-600 to-indigo-700",
      github: "https://github.com/vedansh-botmartz",
      discord: "vedansh#3412"
    },
    channel: "ai-agents",
    tags: ["FastAPI", "Python", "Performance", "PostgreSQL"],
    content: "We benchmarked standard FastAPI JSONResponse vs ORJSONResponse on 50KB nested vector payload responses. Throughput surged from 850 req/sec to 3,400 req/sec on an 8-core instance. Don't forget to enable connection pooling in async SQLAlchemy 2.0!",
    upvotes: 51,
    replies: 2,
    commentsList: [
      { id: "c4", author: "Ritik Motwani", handle: "@ritik_m", text: "Paired with asyncpg connection pools (min=10, max=50), DB latency drops below 2.5ms consistently.", timeAgo: "1h ago" },
      { id: "c5", author: "Shruti Jadhav", handle: "@shruti_j", text: "Verified this in our k6 load test suite — zero socket dropouts at 2,000 concurrent virtual users.", timeAgo: "30m ago" }
    ],
    timeAgo: "3 hours ago",
    isHot: true
  },
  {
    id: "disc-3",
    title: "Architecting a hybrid Python AI worker with Node.js WebSocket event bus",
    author: {
      name: "Sachin Rawat",
      handle: "@sachin_r",
      role: "Full Stack Developer (Python + Node.js)",
      avatarBg: "from-emerald-600 to-teal-800",
      github: "https://github.com/sachin-botmartz",
      discord: "sachin_rawat#5521"
    },
    channel: "enterprise-rag",
    tags: ["NodeJS", "Python", "RedisStreams", "Architecture"],
    content: "Instead of running heavy WebSockets directly in Python, we offload real-time client pub/sub to a Node.js Fastify gateway connected over Redis Streams to our Python AI worker processes. Dropped server memory footprint by 62%.",
    upvotes: 47,
    replies: 2,
    commentsList: [
      { id: "c6", author: "Vinay Chaware", handle: "@vinay_c", text: "Node.js event loop handles 25,000 idle socket connections effortlessly with minimal CPU usage.", timeAgo: "2h ago" },
      { id: "c7", author: "Soham Sharma", handle: "@soham_ai", text: "This pattern is key for our 50 production systems. Keeps LLM compute strictly decoupled from client I/O.", timeAgo: "1h ago" }
    ],
    timeAgo: "4 hours ago",
    isHot: true
  },
  {
    id: "disc-4",
    title: "Eliminating WebSocket memory leaks in Next.js 15 & real-time state streams",
    author: {
      name: "Vinay Chaware",
      handle: "@vinay_c",
      role: "Full Stack Developer (Node.js)",
      avatarBg: "from-amber-600 to-orange-700",
      github: "https://github.com/vinay-botmartz",
      discord: "vinay_node#9812"
    },
    channel: "show-your-build",
    tags: ["NextJS", "WebSockets", "CRDT", "State"],
    content: "If you're using Yjs CRDTs or live audio visualizers, ensure you clean up event listeners on unmount. We implemented an automatic ping/pong heartbeat with 30-second stale socket cleanup. What's your approach for handling edge reconnection?",
    upvotes: 43,
    replies: 2,
    commentsList: [
      { id: "c8", author: "Sachin Rawat", handle: "@sachin_r", text: "We use exponential backoff with jitter on the client side to avoid thundering herd reconnection storms.", timeAgo: "2h ago" },
      { id: "c9", author: "Shruti Jadhav", handle: "@shruti_j", text: "Added automated disconnect/reconnect tests in Playwright to guarantee zero data loss.", timeAgo: "1h ago" }
    ],
    timeAgo: "5 hours ago",
    isHot: false
  },
  {
    id: "disc-5",
    title: "PRD Architecture Blueprint: Structuring system requirements for cross-functional builder squads",
    author: {
      name: "Vaidehi Banabakode",
      handle: "@vaidehi_b",
      role: "Product Associate & Research Intern",
      avatarBg: "from-pink-600 to-rose-700",
      github: "https://github.com/vaidehi-botmartz",
      discord: "vaidehi_p#4419"
    },
    channel: "show-your-build",
    tags: ["ProductManagement", "PRD", "SystemDesign", "Research"],
    content: "A great developer PRD isn't just user stories — it needs sequence diagrams, database entity models, error code taxonomies, and clear SLA benchmarks (latency, throughput, error rates). We authored PRDs for all 50 production systems across 10 industrial domains.",
    upvotes: 56,
    replies: 2,
    commentsList: [
      { id: "c10", author: "Soham Sharma", handle: "@soham_ai", text: "Strict PRDs are what separate professional engineering squads from amateur hackathons.", timeAgo: "3h ago" },
      { id: "c11", author: "Arunesh Kher", handle: "@arunesh_k", text: "Students sharing these PRD diagrams on LinkedIn get massive engagement from hiring CTOs!", timeAgo: "1h ago" }
    ],
    timeAgo: "6 hours ago",
    isHot: true
  },
  {
    id: "disc-6",
    title: "Fine-tuning PyTorch embedding models with Matryoshka Representation Learning (MRL)",
    author: {
      name: "Bhavya Jain",
      handle: "@bhavya_j",
      role: "AI/ML Intern with Backend in Python",
      avatarBg: "from-purple-600 to-violet-800",
      github: "https://github.com/bhavya-botmartz",
      discord: "bhavya_ai#1109"
    },
    channel: "enterprise-rag",
    tags: ["PyTorch", "MRL", "Embeddings", "Qdrant"],
    content: "With MRL, you can truncate 1536-dim embeddings down to 512-dim or 256-dim while preserving 98.4% of downstream retrieval accuracy in Qdrant, cutting vector RAM costs by 66%! Check out our reference implementation.",
    upvotes: 39,
    replies: 1,
    commentsList: [
      { id: "c12", author: "Vedansh Trivedi", handle: "@vedansh_t", text: "Huge memory savings when running on smaller cloud instances.", timeAgo: "2h ago" }
    ],
    timeAgo: "7 hours ago",
    isHot: false
  },
  {
    id: "disc-7",
    title: "Automated Playwright CI/CD testing gates: Catching hydration mismatches before staging",
    author: {
      name: "Shruti Jadhav",
      handle: "@shruti_j",
      role: "QA Tester & Automation Engineer",
      avatarBg: "from-teal-600 to-emerald-700",
      github: "https://github.com/shruti-botmartz",
      discord: "shruti_qa#8831"
    },
    channel: "ai-agents",
    tags: ["Playwright", "CICD", "Automation", "Quality"],
    content: "We set up automated GitHub Action runs with Playwright testing 45 critical student user flows and k6 load tests for 1,000 concurrent spike loads. Zero broken links or unhandled exceptions allowed to pass to production.",
    upvotes: 42,
    replies: 1,
    commentsList: [
      { id: "c13", author: "Vinay Chaware", handle: "@vinay_c", text: "The automated trace viewer on CI failure saves hours of debugging.", timeAgo: "1h ago" }
    ],
    timeAgo: "8 hours ago",
    isHot: false
  },
  {
    id: "disc-8",
    title: "Building in Public on LinkedIn: How 45-day daily logs convert to inbound recruiter DMs",
    author: {
      name: "Arunesh Kher",
      handle: "@arunesh_k",
      role: "Social Media & Community Growth Intern",
      avatarBg: "from-amber-500 to-red-600",
      github: "https://github.com/arunesh-botmartz",
      discord: "arunesh_growth#6610"
    },
    channel: "resume-review",
    tags: ["LinkedInGrowth", "BuildInPublic", "UGC", "Career"],
    content: "Builders who publish daily 150-word architecture snippets with their commit hashes and latency benchmarks see 3.4x more recruiter profile views. Use our built-in LinkedIn progress diary formatter on the Career Checklist page!",
    upvotes: 61,
    replies: 2,
    commentsList: [
      { id: "c14", author: "Soham Sharma", handle: "@soham_ai", text: "Proof-of-work speaks louder than certificates. Ship in public daily!", timeAgo: "3h ago" },
      { id: "c15", author: "Vaidehi Banabakode", handle: "@vaidehi_b", text: "Tagging the open-source libraries you used creates organic reciprocity from project maintainers.", timeAgo: "2h ago" }
    ],
    timeAgo: "9 hours ago",
    isHot: true
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
  const { user, studentProfile } = useAuth();
  const searchParams = useSearchParams();
  const initialChannel = searchParams.get("channel") || "all";

  const [posts, setPosts] = useState<DiscussionPost[]>(INITIAL_POSTS);
  const [selectedChannel, setSelectedChannel] = useState(initialChannel);
  const [searchQuery, setSearchQuery] = useState("");
  const [upvotedIds, setUpvotedIds] = useState<Record<string, boolean>>({});

  // Active Thread for Comments
  const [activeThread, setActiveThread] = useState<DiscussionPost | null>(null);
  const [newCommentText, setNewCommentText] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [rewardBanner, setRewardBanner] = useState<string | null>(null);

  // User Profile State
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    name: user?.displayName || "Soham Sharma",
    handle: studentProfile?.username ? `@${studentProfile.username}` : "@builder",
    role: studentProfile?.personaType === "STUDENT" ? "AI Engineering Fellow" : "Founder & AI Architect",
    bio: studentProfile?.bio || "Building enterprise RAG, deterministic agents, and applied AI systems.",
    github: studentProfile?.githubUrl || "https://github.com/soham2710",
    linkedin: studentProfile?.linkedinUrl || "https://linkedin.com/in/soham-sharma",
    discord: studentProfile?.discordHandle || "builder#0001",
    whatsapp: studentProfile?.whatsappNumber || "+91 98765 43210"
  });

  useEffect(() => {
    if (user || studentProfile) {
      setProfile({
        name: user?.displayName || studentProfile?.displayName || "Community Builder",
        handle: studentProfile?.username ? `@${studentProfile.username}` : (user?.email ? `@${user.email.split("@")[0]}` : "@builder"),
        role: studentProfile?.personaType === "STUDENT" ? "AI Engineering Fellow" : (studentProfile?.currentRole || "AI Builder"),
        bio: studentProfile?.bio || "Building enterprise RAG and production AI systems.",
        github: studentProfile?.githubUrl || "https://github.com",
        linkedin: studentProfile?.linkedinUrl || "https://linkedin.com",
        discord: studentProfile?.discordHandle || "builder#0001",
        whatsapp: studentProfile?.whatsappNumber || ""
      });
    }
  }, [user, studentProfile]);

  // Modal state for new discussion
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newChannel, setNewChannel] = useState("ai-agents");
  const [newTags, setNewTags] = useState("LangGraph, Production");
  const [creatingPost, setCreatingPost] = useState(false);

  useEffect(() => {
    if (searchParams.get("channel")) {
      setSelectedChannel(searchParams.get("channel")!);
    }
  }, [searchParams]);

  // Fetch live discussions from Firestore
  useEffect(() => {
    fetch("/api/discussions")
      .then(res => res.json())
      .then(data => {
        if (data.discussions && data.discussions.length > 0) {
          setPosts(prev => {
            // merge unique
            const existingIds = new Set(prev.map(p => p.id));
            const newOnes = data.discussions.filter((d: any) => !existingIds.has(d.id));
            return [...newOnes, ...prev];
          });
        }
      })
      .catch(() => null);
  }, []);

  const toggleUpvote = async (id: string) => {
    const isUp = upvotedIds[id];
    setUpvotedIds(prev => ({ ...prev, [id]: !isUp }));
    setPosts(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, upvotes: isUp ? p.upvotes - 1 : p.upvotes + 1 };
      }
      return p;
    }));

    if (!isUp) {
      setRewardBanner("Upvoted! +1 Karma Coin awarded to author.");
      setTimeout(() => setRewardBanner(null), 3000);
      try {
        await fetch("/api/discussions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "UPVOTE", postId: id })
        });
      } catch (err) {}
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim() || !activeThread) return;

    setSubmittingComment(true);
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
    setRewardBanner("🎉 Comment posted! +3 Karma Coins awarded to your wallet.");
    setTimeout(() => setRewardBanner(null), 4000);

    try {
      await fetch("/api/discussions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "REPLY",
          postId: activeThread.id,
          comment: {
            content: newComment.text,
            author: {
              name: profile.name,
              handle: profile.handle,
              email: user?.email || ""
            }
          }
        })
      });
    } catch (err) {} finally {
      setSubmittingComment(false);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    setCreatingPost(true);
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
    setRewardBanner("🚀 Discussion created! +5 Karma Coins awarded to your wallet.");
    setTimeout(() => setRewardBanner(null), 4000);

    try {
      await fetch("/api/discussions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "CREATE",
          title: newPost.title,
          content: newPost.content,
          channel: newPost.channel,
          tags: newPost.tags,
          author: {
            name: profile.name,
            handle: profile.handle,
            email: user?.email || ""
          }
        })
      });
    } catch (err) {} finally {
      setCreatingPost(false);
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const POSTS_PER_PAGE = 4;

  const filteredPosts = posts.filter(p => {
    const matchesChannel = selectedChannel === "all" || p.channel === selectedChannel;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesChannel && matchesSearch;
  });

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE) || 1;
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

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

        {/* Dynamic Reward Banner Notification */}
        {rewardBanner && (
          <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-mono text-xs font-bold shadow-lg flex items-center justify-between animate-fade-in">
            <div className="flex items-center gap-2.5">
              <Coins size={16} className="text-amber-300" />
              <span>{rewardBanner}</span>
            </div>
            <button onClick={() => setRewardBanner(null)} className="p-1 hover:bg-white/20 rounded-lg">
              <X size={14} />
            </button>
          </div>
        )}

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

            {/* Karma Coin Earning Rules Card */}
            <div className="bg-gradient-to-br from-amber-50 to-blue-50 border border-amber-200/80 rounded-3xl p-5 shadow-xs font-mono text-xs">
              <div className="text-xs text-amber-900 font-bold uppercase mb-3 flex items-center gap-1.5">
                <Coins size={14} className="text-amber-600" /> Discussion Karma
              </div>
              <div className="space-y-2 text-[11px] text-slate-700">
                <div className="flex items-center justify-between p-2 rounded-xl bg-white/80 border border-amber-100">
                  <span>Start Discussion Topic</span>
                  <strong className="text-emerald-600 font-bold">+5 Coins</strong>
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-white/80 border border-amber-100">
                  <span>Constructive Reply</span>
                  <strong className="text-emerald-600 font-bold">+3 Coins</strong>
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-white/80 border border-amber-100">
                  <span>Received Peer Upvote</span>
                  <strong className="text-emerald-600 font-bold">+1 Coin</strong>
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-rose-50 border border-rose-100 text-rose-800">
                  <span>Spam / Toxicity Penalty</span>
                  <strong className="text-rose-600 font-bold">-20 Coins</strong>
                </div>
              </div>
              <div className="mt-3 text-[10px] text-slate-500 font-sans leading-relaxed">
                Admins review all posts. Coins are automatically credited/debited to your builder wallet.
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
              {paginatedPosts.map(post => (
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

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-6 border-t border-slate-200 font-mono text-xs">
                  <div className="text-slate-500">
                    Page {currentPage} of {totalPages} ({filteredPosts.length} Total Topics)
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 cursor-pointer font-bold"
                    >
                      Previous
                    </button>
                    <button
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 cursor-pointer font-bold"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
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
    <AuthGate
      featureTitle="Technical Discussions & Engineering Forum"
      featureDescription="Sign in to start technical threads, share code snippets, reply to peers, and earn Karma Coins for solving blockers."
    >
      <Suspense fallback={
        <div className="min-h-screen bg-[#FAFCFF] flex items-center justify-center text-slate-500 py-32">
          <Loader2 className="animate-spin text-[#0066FF]" size={28} />
        </div>
      }>
        <DiscussionsContent />
      </Suspense>
    </AuthGate>
  );
}
