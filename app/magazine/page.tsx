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
  ExternalLink
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

  return (
    <div className="bg-[#FAFCFF] min-h-screen text-slate-900 py-12 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Masthead */}
        <div className="border-b border-slate-200 pb-12 mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-blue-50 text-[#0066FF] border border-blue-200 font-mono text-xs font-bold uppercase">
                Vol. IV • Quarterly Issue
              </span>
              <span className="text-xs font-mono text-slate-400">August 2026</span>
            </div>

            <button
              onClick={() => setSubmitModalOpen(true)}
              className="self-start sm:self-auto px-4 py-2 rounded-xl bg-[#0066FF] hover:bg-[#0052CC] text-white text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <Send size={13} />
              <span>Submit Research Article</span>
            </button>
          </div>

          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-slate-900 mb-4">
            Botmartz Applied AI Magazine
          </h1>
          <p className="text-slate-600 text-sm sm:text-base max-w-3xl leading-relaxed">
            In-depth architectural teardowns, production evaluation benchmarks, and applied engineering dissertations published by Botmartz researchers and community fellows.
          </p>
        </div>

        {/* Toolbar & Filter */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer ${
                  selectedCat === cat
                    ? "bg-slate-900 text-white font-bold shadow-xs"
                    : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200"
                }`}
              >
                #{cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search articles, topics, authors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#0066FF]"
            />
          </div>
        </div>

        {/* Featured Top Stories Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {filtered.map(article => (
            <article
              key={article.id}
              onClick={() => setActiveArticle(article)}
              className={`bg-white border rounded-3xl p-6 sm:p-7 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group ${
                article.featured ? "border-[#0066FF]/40 bg-gradient-to-b from-blue-50/20 to-white" : "border-slate-200"
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#0066FF] border border-blue-100 font-mono text-[10px] font-bold">
                    #{article.tag}
                  </span>
                  <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
                    <Clock size={12} />
                    <span>{article.readingTime}</span>
                  </div>
                </div>

                <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-3 leading-snug group-hover:text-[#0066FF] transition-colors">
                  {article.title}
                </h2>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 mb-6">
                  {article.summary}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`w-7 h-7 rounded-full text-white text-xs font-bold flex items-center justify-center font-mono ${article.author.avatar}`}>
                    {article.author.name[0]}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800">{article.author.name}</div>
                    <div className="text-[10px] font-mono text-slate-400">{article.author.role}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
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
                  <span className="text-xs font-mono text-[#0066FF] font-bold group-hover:translate-x-1 transition-transform">
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
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-10 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100 mb-6">
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#0066FF] font-mono text-[10px] font-bold">
                  #{activeArticle.tag} • {activeArticle.readingTime}
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2 leading-tight">
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
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200 mb-8 text-xs">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full text-white font-bold flex items-center justify-center font-mono ${activeArticle.author.avatar}`}>
                  {activeArticle.author.name[0]}
                </div>
                <div>
                  <div className="font-bold text-slate-900">{activeArticle.author.name}</div>
                  <div className="text-slate-500 font-mono text-[11px]">{activeArticle.author.role} • {activeArticle.author.handle}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-mono">{activeArticle.publishedDate}</span>
              </div>
            </div>

            {/* Content */}
            <div className="prose prose-slate max-w-none text-slate-700 text-sm leading-relaxed space-y-4 font-sans whitespace-pre-line">
              {activeArticle.content}
            </div>

            {/* Footer */}
            <div className="pt-8 mt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => alert("Thanks for upvoting this research article!")}
                  className="px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#0066FF] font-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <ThumbsUp size={14} />
                  <span>Upvote ({activeArticle.upvotes})</span>
                </button>
                <Link
                  href="/discussions"
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-mono text-xs font-bold flex items-center gap-1.5"
                >
                  <MessageSquare size={14} />
                  <span>Discuss in Forum</span>
                </Link>
              </div>

              <button
                onClick={() => setActiveArticle(null)}
                className="text-xs font-mono text-slate-500 hover:text-slate-900 cursor-pointer"
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
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200"
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <h3 className="text-xl font-bold text-slate-900">Submit Research Proposal</h3>
              <button onClick={() => setSubmitModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X size={18} />
              </button>
            </div>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              We publish technical deep-dives on Agent State Machines, Hybrid RAG, SLMs, and Production Evaluations. Submissions are peer-reviewed by the Botmartz Editorial Board.
            </p>
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                alert("Proposal submitted! Our editorial team will review your pitch within 48 hours.");
                setSubmitModalOpen(false);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block font-mono text-slate-700 font-bold mb-1">Author Name *</label>
                <input required type="text" placeholder="e.g. Soham Sharma" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5" />
              </div>
              <div>
                <label className="block font-mono text-slate-700 font-bold mb-1">Email Address *</label>
                <input required type="email" placeholder="soham@botmartz.com" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5" />
              </div>
              <div>
                <label className="block font-mono text-slate-700 font-bold mb-1">Article Title &amp; Outline *</label>
                <textarea required rows={4} placeholder="Summarize your key thesis, benchmark methodology, and code snippets..." className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5" />
              </div>
              <button
                type="submit"
                className="w-full bg-[#0066FF] hover:bg-[#0052CC] text-white py-3 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all mt-2 cursor-pointer"
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
