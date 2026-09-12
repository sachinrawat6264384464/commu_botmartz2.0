"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  BookOpen, 
  Sparkles, 
  Clock, 
  User, 
  Search, 
  Filter, 
  ArrowRight, 
  Bookmark, 
  Share2, 
  ThumbsUp, 
  Tag, 
  ChevronRight, 
  X, 
  MessageSquare,
  FileText,
  Send,
  CheckCircle2,
  Cpu,
  Terminal,
  ExternalLink,
  ShieldCheck,
  Zap,
  Award,
  Layers,
  Copy
} from "lucide-react";

interface Article {
  id: string;
  title: string;
  category: "AgentSystems" | "HybridRAG" | "LocalAI" | "Protocols" | "Evaluations" | "Inference";
  tag: string;
  readingTime: string;
  publishedDate: string;
  author: {
    name: string;
    role: string;
    handle: string;
    avatar: string;
  };
  summary: string;
  content: string;
  upvotes: number;
  featured?: boolean;
}

const ARTICLES: Article[] = [
  {
    id: "mag-01",
    title: "Deterministic State Machines in LangGraph: Handling Tool Failures Without Corrupted Memory",
    category: "AgentSystems",
    tag: "MultiAgent",
    readingTime: "8 min read",
    publishedDate: "August 2026",
    author: {
      name: "Soham Sharma",
      role: "AI Systems Architect",
      handle: "@soham_ai",
      avatar: "bg-blue-600",
    },
    featured: true,
    upvotes: 148,
    summary: "A deep architectural teardown of checkpoint persistence in SQLite/PostgreSQL, human-in-the-loop pause nodes, and rollback graphs for enterprise multi-agent workflows.",
    content: `When transitioning multi-agent systems from prototype demos to enterprise workflows (such as insurance claims underwriting or continuous code review), non-deterministic failure modes become the primary bottleneck.

### The Memory Corruption Trap
In naive agent implementations with cyclic loops, a network timeout on a third-party tool call leaves the conversation state half-mutated. Subsequent agent steps hallucinate assumptions about previous outputs.

### The Solution: Idempotent Postgres Checkpointers
By storing graph state transitions as append-only write-ahead logs with deterministic sequence IDs, you achieve:
1. **Zero State Mutation on Exceptions**: If a tool crashes, the state reverts to the preceding verified checkpoint.
2. **Deterministic Time-Travel**: Debuggers can inspect the exact snapshot of state vector before any node execution.
3. **Resilient Human Gates**: Pauses for human confirmation can survive worker restarts without session loss.`
  },
  {
    id: "mag-02",
    title: "BM25 + Dense Embeddings with Reciprocal Rank Fusion: Production Benchmarks at 1M Chunks",
    category: "HybridRAG",
    tag: "VectorSearch",
    readingTime: "12 min read",
    publishedDate: "August 2026",
    author: {
      name: "Dr. Promit Ray",
      role: "Chief AI Fellow",
      handle: "@promit_ray",
      avatar: "bg-emerald-600",
    },
    featured: true,
    upvotes: 124,
    summary: "Why single-vector dense similarity fails on exact part numbers and domain jargon, and how multi-stage cross-encoder reranking solves recall degradation.",
    content: `Vector embeddings compress semantics into high-dimensional space, but they frequently lose precision on exact alpha-numeric part codes, error strings, and niche legal clauses.

### Hybrid Dense-Sparse Pipeline
Combining dense vector representations with sparse BM25 token frequencies via Reciprocal Rank Fusion (RRF) delivers significant recall gains:
- **BM25 Retrieval**: Captures exact serial identifiers and specialized terminology.
- **Dense Cosine Similarity**: Captures contextual meaning and synonyms.
- **Cross-Encoder Reranker**: Computes pairwise relevance between top-50 fused candidates to select top-5 pristine context windows.`
  },
  {
    id: "mag-03",
    title: "Running Quantized Gemma 2 & Llama 3.2 In-Browser via WebGPU: Zero Cloud Cost Inference",
    category: "LocalAI",
    tag: "EdgeAI",
    readingTime: "6 min read",
    publishedDate: "August 2026",
    author: {
      name: "Aarav Nair",
      role: "Lead RAG Architect",
      handle: "@aaravn",
      avatar: "bg-purple-600",
    },
    featured: true,
    upvotes: 95,
    summary: "Step-by-step implementation guide using ONNX Runtime Web and WebGPU shaders to power on-device summarization with zero cloud latency.",
    content: `Running small language models (SLMs) directly in the user's browser unlocks client-side privacy, zero server billing, and offline availability.

### Technical Stack:
- **Quantization**: 4-bit INT4 quantization with AWQ reduces memory footprint under 1.2GB.
- **Execution Engine**: ONNX Runtime Web utilizing the WebGPU execution provider.
- **Shader Pipeline**: Direct GPU buffer binding eliminates CPU-GPU copy overheads.`
  },
  {
    id: "mag-04",
    title: "Model Context Protocol (MCP): Building Standardized Tool Servers for Enterprise Agents",
    category: "Protocols",
    tag: "MCP",
    readingTime: "10 min read",
    publishedDate: "August 2026",
    author: {
      name: "Pooja Reddy",
      role: "Open Source Maintainer",
      handle: "@poojadev",
      avatar: "bg-indigo-600",
    },
    upvotes: 82,
    summary: "How standardizing tool definitions and resource streaming across IDEs and backend workers eliminates custom integrations for every new database or API.",
    content: `Model Context Protocol (MCP) provides a standardized JSON-RPC interface for LLMs to inspect resources, execute tools, and receive reactive notifications.

By decoupling tool implementation from specific agent orchestration frameworks, developers can build an MCP server once (e.g. for BigQuery or Firestore) and plug it into Claude Desktop, Antigravity, or custom agent swarms.`
  },
  {
    id: "mag-05",
    title: "Automated Evaluation Pipelines with RAGAS and Synthetic Test Sets in CI/CD",
    category: "Evaluations",
    tag: "Evals",
    readingTime: "9 min read",
    publishedDate: "July 2026",
    author: {
      name: "Rohan Varma",
      role: "Evaluation Engineer",
      handle: "@rohan_v",
      avatar: "bg-amber-600",
    },
    upvotes: 67,
    summary: "Building deterministic evaluation gates in GitHub Actions to catch hallucination regressions before deploying new prompts or chunking parameters.",
    content: `Prompt engineering without automated benchmarks is guesswork. Establishing quantitative evaluation metrics prevents regression:
1. **Faithfulness**: Are all claims supported by the retrieved context?
2. **Answer Relevance**: Did the agent directly answer the query without fluff?
3. **Context Recall**: Did the retrieval stage fetch all ground-truth reference chunks?`
  }
];

const CATEGORIES = ["All", "AgentSystems", "HybridRAG", "LocalAI", "Protocols", "Evaluations"];

export default function MagazinePage() {
  const [selectedCat, setSelectedCat] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [copiedCitation, setCopiedCitation] = useState(false);

  const toggleBookmark = (id: string) => {
    setBookmarkedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const filtered = ARTICLES.filter(a => {
    const matchesCat = selectedCat === "All" || a.category === selectedCat;
    const matchesSearch = 
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.author.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const leadArticle = ARTICLES[0];

  const handleCopyCitation = (article: Article) => {
    const citation = `Sharma, S. et al. (2026). "${article.title}". Botmartz Applied AI Magazine, Vol. IV. https://botmartz.com/magazine#${article.id}`;
    navigator.clipboard.writeText(citation);
    setCopiedCitation(true);
    setTimeout(() => setCopiedCitation(false), 2500);
  };

  return (
    <div className="bg-[#FAFCFF] min-h-screen text-slate-900 py-12 pt-24 font-sans selection:bg-[#0066FF] selection:text-white">
      
      {/* 100% Full-Width Container */}
      <div className="w-full px-4 sm:px-8 lg:px-12 relative z-10">
        
        {/* ── 1. REDESIGNED TECH HERO BANNER CARD ── */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 p-6 sm:p-12 border border-slate-800 shadow-2xl mb-12">
          {/* Background Ambient Glows */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            {/* Left Column: Title & Description */}
            <div className="space-y-4 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 text-cyan-400 font-mono text-xs font-bold border border-cyan-500/20 backdrop-blur-md shadow-xs">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                </span>
                <BookOpen size={14} className="text-cyan-400" />
                <span>VOL. IV &bull; QUARTERLY ISSUE &bull; AUGUST 2026</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-sans leading-tight">
                Botmartz Applied AI <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-300 bg-clip-text text-transparent">Magazine</span>
              </h1>

              <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
                In-depth architectural teardowns, production evaluation benchmarks, and applied engineering dissertations published by Botmartz researchers and community fellows.
              </p>

              {/* Stats Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 font-mono text-xs">
                <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                  <BookOpen size={16} className="text-blue-400 shrink-0" />
                  <div>
                    <div className="text-white font-bold text-sm">15+ Dissertations</div>
                    <div className="text-slate-400 text-[10px]">Applied AI Teardowns</div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                  <ShieldCheck size={16} className="text-emerald-400 shrink-0" />
                  <div>
                    <div className="text-white font-bold text-sm">Peer Reviewed</div>
                    <div className="text-slate-400 text-[10px]">Editorial Board</div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                  <Code2 size={16} className="text-cyan-400 shrink-0" />
                  <div>
                    <div className="text-white font-bold text-sm">100% Code</div>
                    <div className="text-slate-400 text-[10px]">Verifiable Repos</div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                  <Award size={16} className="text-purple-400 shrink-0" />
                  <div>
                    <div className="text-white font-bold text-sm">Quarterly</div>
                    <div className="text-slate-400 text-[10px]">Open Research</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: CTA Buttons */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 font-mono text-xs shrink-0 self-start lg:self-center">
              <button
                onClick={() => setSubmitModalOpen(true)}
                className="px-7 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-600 text-white font-bold transition-all shadow-lg hover:shadow-blue-500/25 flex items-center justify-center gap-2.5 group cursor-pointer"
              >
                <Send size={15} className="text-cyan-300 group-hover:scale-110 transition-transform" />
                <span>Submit Research Article</span>
                <ArrowRight size={14} className="text-cyan-300 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* ── 2. EDITORIAL FEATURED LEAD STORY BANNER (ADD-ON) ── */}
        <div 
          onClick={() => setActiveArticle(leadArticle)}
          className="bg-white border-2 border-blue-500/50 rounded-3xl p-6 sm:p-10 mb-12 shadow-lg hover:shadow-xl transition-all cursor-pointer relative overflow-hidden group"
        >
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600" />
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="space-y-3 flex-1">
              <div className="flex items-center gap-2 flex-wrap font-mono text-xs">
                <span className="px-3 py-1 rounded-full bg-blue-100/80 text-[#0066FF] font-bold uppercase border border-blue-200">
                  ⭐ Lead Research Story
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold border border-slate-200">
                  #{leadArticle.tag}
                </span>
                <span className="text-slate-400 flex items-center gap-1">
                  <Clock size={12} /> {leadArticle.readingTime}
                </span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-950 font-sans group-hover:text-[#0066FF] transition-colors leading-tight">
                {leadArticle.title}
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 font-sans leading-relaxed line-clamp-2">
                {leadArticle.summary}
              </p>
            </div>

            <div className="flex items-center gap-4 shrink-0 font-mono text-xs border-t lg:border-t-0 lg:border-l border-slate-100 pt-4 lg:pt-0 lg:pl-8">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full text-white font-bold flex items-center justify-center text-sm font-mono ${leadArticle.author.avatar}`}>
                  {leadArticle.author.name[0]}
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-sm font-sans">{leadArticle.author.name}</div>
                  <div className="text-slate-500 text-[11px]">{leadArticle.author.role}</div>
                </div>
              </div>

              <span className="px-5 py-3 rounded-2xl bg-[#0066FF] text-white font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-blue-500/20 group-hover:bg-blue-600 transition-colors">
                <span>Read Teardown</span>
                <ArrowRight size={14} />
              </span>
            </div>
          </div>
        </div>

        {/* ── 3. SEARCH & CATEGORY FILTER BAR ── */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 mb-8 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Category Pills */}
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto font-mono text-xs">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCat(cat)}
                  className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                    selectedCat === cat
                      ? "bg-[#0066FF] text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  #{cat}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-80 font-mono text-xs">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search articles, topics, authors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF] transition-all"
              />
            </div>
          </div>
        </div>

        {/* ── 4. 4-COLUMN RESPONSIVE ARTICLES GRID ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
          {filtered.map(article => (
            <article
              key={article.id}
              onClick={() => setActiveArticle(article)}
              className={`bg-white border rounded-3xl p-6 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group ${
                article.featured ? "border-blue-400/80 bg-gradient-to-b from-blue-50/20 to-white" : "border-slate-200"
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#0066FF] border border-blue-100 font-mono text-[10px] font-bold">
                    #{article.tag}
                  </span>
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
                    <Clock size={12} />
                    <span>{article.readingTime}</span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-900 font-sans group-hover:text-[#0066FF] transition-colors leading-snug mb-2 line-clamp-2">
                  {article.title}
                </h3>

                <p className="text-xs text-slate-500 font-sans leading-relaxed line-clamp-3 mb-4">
                  {article.summary}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between font-mono text-xs">
                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-full text-white text-xs font-bold flex items-center justify-center font-mono ${article.author.avatar}`}>
                    {article.author.name[0]}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800 font-sans">{article.author.name}</div>
                    <div className="text-[10px] text-slate-400">{article.author.role}</div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleBookmark(article.id);
                    }}
                    className={`p-1.5 rounded-lg border transition-colors ${
                      bookmarkedIds.includes(article.id)
                        ? "bg-blue-50 text-[#0066FF] border-blue-200"
                        : "text-slate-400 hover:text-slate-700 border-slate-200"
                    }`}
                  >
                    <Bookmark size={13} />
                  </button>
                  <span className="text-xs font-bold text-[#0066FF] group-hover:translate-x-0.5 transition-transform">
                    Read →
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

      </div>

      {/* ── Article Detail Modal ── */}
      {activeArticle && (
        <div 
          onClick={() => setActiveArticle(null)}
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-10 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto relative text-slate-900"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100 mb-6">
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#0066FF] font-mono text-[10px] font-bold">
                  #{activeArticle.tag} • {activeArticle.readingTime}
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 leading-tight font-sans">
                  {activeArticle.title}
                </h2>
              </div>
              <button 
                onClick={() => setActiveArticle(null)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Author bar */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200 mb-8 text-xs font-mono">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full text-white font-bold flex items-center justify-center font-mono ${activeArticle.author.avatar}`}>
                  {activeArticle.author.name[0]}
                </div>
                <div>
                  <div className="font-bold text-slate-900 font-sans">{activeArticle.author.name}</div>
                  <div className="text-slate-500 text-[11px]">{activeArticle.author.role} • {activeArticle.author.handle}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopyCitation(activeArticle)}
                  className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Copy size={12} className="text-[#0066FF]" />
                  <span>{copiedCitation ? "Citation Copied!" : "Cite Article"}</span>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="prose prose-slate max-w-none text-slate-700 text-sm leading-relaxed space-y-4 font-sans whitespace-pre-line">
              {activeArticle.content}
            </div>

            {/* Footer */}
            <div className="pt-8 mt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => alert("Thanks for upvoting this research article!")}
                  className="px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#0066FF] font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <ThumbsUp size={14} />
                  <span>Upvote ({activeArticle.upvotes})</span>
                </button>
                <Link
                  href="/discussions"
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold flex items-center gap-1.5"
                >
                  <MessageSquare size={14} />
                  <span>Discuss in Forum</span>
                </Link>
              </div>

              <button
                onClick={() => setActiveArticle(null)}
                className="text-xs font-bold text-slate-500 hover:text-slate-900 cursor-pointer"
              >
                Close Article ✕
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Proposal Submission Modal ── */}
      {submitModalOpen && (
        <div 
          onClick={() => setSubmitModalOpen(false)}
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 text-slate-900"
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <h3 className="text-xl font-bold font-sans text-slate-900">Submit Research Proposal</h3>
              <button onClick={() => setSubmitModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X size={18} />
              </button>
            </div>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed font-sans">
              We publish technical deep-dives on Agent State Machines, Hybrid RAG, SLMs, and Production Evaluations. Submissions are peer-reviewed by the Botmartz Editorial Board.
            </p>
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                alert("Proposal submitted! Our editorial team will review your pitch within 48 hours.");
                setSubmitModalOpen(false);
              }}
              className="space-y-3 font-mono text-xs"
            >
              <div>
                <label className="block text-slate-700 font-bold mb-1">Author Name *</label>
                <input required type="text" placeholder="e.g. Soham Sharma" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5" />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Email Address *</label>
                <input required type="email" placeholder="soham@botmartz.com" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5" />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Article Title &amp; Outline *</label>
                <textarea required rows={4} placeholder="Summarize your key thesis, benchmark methodology, and code snippets..." className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5" />
              </div>
              <button
                type="submit"
                className="w-full bg-[#0066FF] hover:bg-blue-600 text-white py-3 rounded-xl font-bold uppercase tracking-wider transition-all mt-2 cursor-pointer shadow-md shadow-blue-500/20"
              >
                Submit Proposal to Editorial Board
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
