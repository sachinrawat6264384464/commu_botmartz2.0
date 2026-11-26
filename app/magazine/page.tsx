"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, X } from "lucide-react";

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
    },
    featured: true,
    upvotes: 148,
    summary:
      "A deep architectural teardown of checkpoint persistence in SQLite/PostgreSQL, human-in-the-loop pause nodes, and rollback graphs for enterprise multi-agent workflows.",
    content: `When transitioning multi-agent systems from prototype demos to enterprise workflows (such as insurance claims underwriting or continuous code review), non-deterministic failure modes become the primary bottleneck.

### The Memory Corruption Trap
In naive agent implementations with cyclic loops, a network timeout on a third-party tool call leaves the conversation state half-mutated. Subsequent agent steps hallucinate assumptions about previous outputs.

### The Solution: Idempotent Postgres Checkpointers
By storing graph state transitions as append-only write-ahead logs with deterministic sequence IDs, you achieve:
1. **Zero State Mutation on Exceptions**: If a tool crashes, the state reverts to the preceding verified checkpoint.
2. **Deterministic Time-Travel**: Debuggers can inspect the exact snapshot of state vector before any node execution.
3. **Resilient Human Gates**: Pauses for human confirmation can survive worker restarts without session loss.`,
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
    },
    featured: true,
    upvotes: 124,
    summary:
      "Why single-vector dense similarity fails on exact part numbers and domain jargon, and how multi-stage cross-encoder reranking solves recall degradation.",
    content: `Vector embeddings compress semantics into high-dimensional space, but they frequently lose precision on exact alpha-numeric part codes, error strings, and niche legal clauses.

### Hybrid Dense-Sparse Pipeline
Combining dense vector representations with sparse BM25 token frequencies via Reciprocal Rank Fusion (RRF) delivers significant recall gains:
- **BM25 Retrieval**: Captures exact serial identifiers and specialized terminology.
- **Dense Cosine Similarity**: Captures contextual meaning and synonyms.
- **Cross-Encoder Reranker**: Computes pairwise relevance between top-50 fused candidates to select top-5 pristine context windows.`,
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
    },
    featured: true,
    upvotes: 95,
    summary:
      "Step-by-step implementation guide using ONNX Runtime Web and WebGPU shaders to power on-device summarization with zero cloud latency.",
    content: `Running small language models (SLMs) directly in the user's browser unlocks client-side privacy, zero server billing, and offline availability.

### Technical Stack:
- **Quantization**: 4-bit INT4 quantization with AWQ reduces memory footprint under 1.2GB.
- **Execution Engine**: ONNX Runtime Web utilizing the WebGPU execution provider.
- **Shader Pipeline**: Direct GPU buffer binding eliminates CPU-GPU copy overheads.`,
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
    },
    upvotes: 82,
    summary:
      "How standardizing tool definitions and resource streaming across IDEs and backend workers eliminates custom integrations for every new database or API.",
    content: `Model Context Protocol (MCP) provides a standardized JSON-RPC interface for LLMs to inspect resources, execute tools, and receive reactive notifications.

By decoupling tool implementation from specific agent orchestration frameworks, developers can build an MCP server once (e.g. for BigQuery or Firestore) and plug it into Claude Desktop, Antigravity, or custom agent swarms.`,
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
    },
    upvotes: 67,
    summary:
      "Building deterministic evaluation gates in GitHub Actions to catch hallucination regressions before deploying new prompts or chunking parameters.",
    content: `Prompt engineering without automated benchmarks is guesswork. Establishing quantitative evaluation metrics prevents regression:
1. **Faithfulness**: Are all claims supported by the retrieved context?
2. **Answer Relevance**: Did the agent directly answer the query without fluff?
3. **Context Recall**: Did the retrieval stage fetch all ground-truth reference chunks?`,
  },
  {
    id: "mag-06",
    title: "eBPF-Based Microservice Tracing for Distributed LLM Inference Swarms",
    category: "AgentSystems",
    tag: "eBPF",
    readingTime: "11 min read",
    publishedDate: "July 2026",
    author: {
      name: "Vikram Malhotra",
      role: "Infrastructure Lead",
      handle: "@vikram_ebpf",
    },
    upvotes: 112,
    summary:
      "Kernel-level observability for tracking inter-node prompt payloads, token stream latency overheads, and network socket buffer bottlenecks.",
    content: `Monitoring latency spikes in decentralized multi-agent topologies requires non-intrusive kernel-level instrumentation.

### Why User-Space Logging Fails
Traditional HTTP tracing libraries introduce GC pauses and buffer serialization overhead that skew micro-benchmark measurements.

### The eBPF Approach
Attaching kernel probes to socket read/write syscalls allows zero-overhead capture of raw token stream throughput across GPU nodes.`,
  },
  {
    id: "mag-07",
    title: "WebGPU Accelerated Speculative Decoding for Real-Time On-Device Voice Agents",
    category: "LocalAI",
    tag: "EdgeAI",
    readingTime: "7 min read",
    publishedDate: "July 2026",
    author: {
      name: "Ananya Iyer",
      role: "Graphics & AI Engineer",
      handle: "@ananya_webgpu",
    },
    upvotes: 99,
    summary:
      "Combining draft 0.5B target models with quantized 8B backbone models in WebGPU compute shaders for 3x decoding speedups.",
    content: `Speculative decoding uses a small draft model to generate candidate tokens in parallel before verification by the main target model.

### Key Innovations:
- **Parallel Compute Pass**: Draft model generates 4 candidate tokens in a single WebGPU command buffer dispatch.
- **Verification Shader**: Target model verifies candidate tokens in a single forward pass, achieving 3.2x latency improvement in browser engines.`,
  },
  {
    id: "mag-08",
    title: "Geospatial SAM 2: Fine-Tuning Segment Anything for Real-Time Satellite Intelligence",
    category: "Evaluations",
    tag: "VisionAI",
    readingTime: "14 min read",
    publishedDate: "June 2026",
    author: {
      name: "Kabir Mehta",
      role: "Computer Vision Researcher",
      handle: "@kabir_sam",
    },
    upvotes: 135,
    summary:
      "Adapting Meta's SAM 2 architecture for multi-temporal optical and SAR satellite imagery segmentation at 30fps pipeline throughput.",
    content: `Zero-shot segmentation models like SAM 2 excel at natural images but encounter domain drift when analyzing orbital synthetic aperture radar (SAR) data.

### Domain Adaptation Strategy:
1. **LoRA Fine-Tuning**: Injecting Low-Rank Adaptation matrices into image encoder attention layers.
2. **Temporal Mask Propagation**: Leveraging SAM 2's memory module to track building footprint changes over time.`,
  },
];

const CATEGORIES = ["All", "AgentSystems", "HybridRAG", "LocalAI", "Protocols", "Evaluations"];

export default function MagazinePage() {
  const [selectedCat, setSelectedCat] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [copiedCitation, setCopiedCitation] = useState(false);

  const filtered = ARTICLES.filter((a) => {
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
    <div
      className="bg-white min-h-screen text-slate-900 py-12 pt-24 font-sans selection:bg-[#D9F83B] selection:text-slate-950"
      style={{
        backgroundImage:
          "linear-gradient(to right, rgba(29, 49, 137, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(29, 49, 137, 0.08) 1px, transparent 1px)",
        backgroundSize: "72px 72px",
      }}
    >
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-8 space-y-12 relative z-10">
        {/* ── 1. EDITORIAL MASTHEAD HERO (NO BOXES, CLEAN TYPOGRAPHY) ── */}
        <section
          className="rounded-3xl bg-[#162774] text-white p-7 sm:p-11 border border-white/15 shadow-2xl"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255, 255, 255, 0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.06) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        >
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="space-y-4 max-w-3xl">
              <div className="inline-flex items-center px-3.5 py-1 rounded-full bg-[#D9F83B] text-slate-950 text-[11px] font-extrabold uppercase tracking-wider">
                Vol. IV &bull; Quarterly Research Journal &bull; 2026
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
                Botmartz Applied AI <span className="text-[#D9F83B]">Magazine</span>
              </h1>

              <p className="text-xs sm:text-sm text-blue-100/85 leading-relaxed">
                In-depth architectural teardowns, production evaluation benchmarks, and applied engineering dissertations published by Botmartz researchers and fellows.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setSubmitModalOpen(true)}
              className="px-6 py-3.5 rounded-full bg-[#D9F83B] hover:bg-[#e5ff59] text-slate-950 font-bold text-xs sm:text-sm transition-all flex items-center gap-3 group cursor-pointer shrink-0 shadow-lg"
            >
              <span>Submit Research Article</span>
              <span className="w-7 h-7 rounded-full bg-slate-950 text-[#D9F83B] flex items-center justify-center transition-transform duration-500 group-hover:rotate-180">
                <ArrowRight size={14} />
              </span>
            </button>
          </div>

          {/* Inline Editorial Metrics Strip (No Boxes) */}
          <div className="mt-8 pt-6 border-t border-white/15 flex flex-wrap items-center gap-x-10 gap-y-3 text-xs">
            <div>
              <span className="text-[#D9F83B] font-extrabold">15+ Dissertations</span>
              <span className="text-blue-200/80 ml-2">Applied AI Teardowns</span>
            </div>
            <div>
              <span className="text-[#D9F83B] font-extrabold">Peer Reviewed</span>
              <span className="text-blue-200/80 ml-2">Editorial Board</span>
            </div>
            <div>
              <span className="text-[#D9F83B] font-extrabold">100% Code</span>
              <span className="text-blue-200/80 ml-2">Verifiable Repos</span>
            </div>
            <div>
              <span className="text-[#D9F83B] font-extrabold">Quarterly</span>
              <span className="text-blue-200/80 ml-2">Open Research</span>
            </div>
          </div>
        </section>

        {/* ── 2. FEATURED LEAD STORY (EDITORIAL BROADSHEET STRIP, NOT A BOX) ── */}
        <section
          onClick={() => setActiveArticle(leadArticle)}
          className="border-y-2 border-[#162774] py-8 cursor-pointer group transition-colors hover:bg-[#F4F6FB]/70 px-2 sm:px-4"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="flex flex-wrap items-center gap-3 text-[11px] font-bold uppercase tracking-wider">
                <span className="px-3 py-0.5 rounded-full bg-[#162774] text-[#D9F83B]">
                  Lead Research Story
                </span>
                <span className="text-[#1D3189]">#{leadArticle.tag}</span>
                <span className="text-slate-500">{leadArticle.readingTime}</span>
                <span className="text-slate-400">{leadArticle.publishedDate}</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-950 group-hover:text-[#162774] transition-colors leading-tight">
                {leadArticle.title}
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {leadArticle.summary}
              </p>

              <div className="text-xs font-semibold text-slate-700 pt-1">
                By <span className="text-slate-950 font-bold">{leadArticle.author.name}</span> &mdash;{" "}
                <span className="text-slate-500">{leadArticle.author.role}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#162774]">
                Read Teardown
              </span>
              <span className="w-11 h-11 rounded-full bg-[#162774] group-hover:bg-[#D9F83B] text-[#D9F83B] group-hover:text-slate-950 flex items-center justify-center transition-all duration-500 group-hover:rotate-180 shadow-md">
                <ArrowRight size={17} />
              </span>
            </div>
          </div>
        </section>

        {/* ── 3. MINIMAL FILTER & SEARCH BAR (NO BOXES, NO ICONS) ── */}
        <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCat(cat)}
                className={`px-3.5 py-1.5 rounded-full font-bold transition-all cursor-pointer ${
                  selectedCat === cat
                    ? "bg-[#162774] text-[#D9F83B]"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {cat === "All" ? "All Issues" : `#${cat}`}
              </button>
            ))}
          </div>

          <input
            type="text"
            placeholder="Search dissertations, topics, authors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-72 px-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#162774] font-medium"
          />
        </section>

        {/* ── 4. EDITORIAL INDEX LIST (NO CARD BOXES, CLEAN DIVIDED ROWS + 180° CIRCLE ARROW) ── */}
        <section className="divide-y divide-slate-200 border-b border-slate-200">
          {filtered.length === 0 ? (
            <div className="py-14 text-center text-sm font-semibold text-slate-500">
              No matching articles found. Try clearing your search or selecting All Issues.
            </div>
          ) : (
            filtered.map((article, idx) => (
              <article
                key={article.id}
                onClick={() => setActiveArticle(article)}
                className="py-7 px-3 sm:px-5 flex flex-col md:flex-row md:items-center justify-between gap-6 cursor-pointer group hover:bg-[#F4F6FB]/90 transition-colors duration-300"
              >
                <div className="flex items-start gap-5 flex-1 min-w-0">
                  {/* Issue Numeral */}
                  <span className="w-9 h-9 rounded-full bg-slate-100 group-hover:bg-[#D9F83B] text-slate-700 group-hover:text-slate-950 font-extrabold text-xs flex items-center justify-center shrink-0 transition-colors duration-300 mt-0.5">
                    {String(idx + 1).padStart(2, "0")}
                  </span>

                  <div className="space-y-1.5 min-w-0">
                    <div className="flex flex-wrap items-center gap-3 text-[11px] font-bold uppercase tracking-wider">
                      <span className="text-[#162774]">#{article.tag}</span>
                      <span className="text-slate-400">&bull;</span>
                      <span className="text-slate-500">{article.readingTime}</span>
                      <span className="text-slate-400">&bull;</span>
                      <span className="text-slate-400">{article.publishedDate}</span>
                    </div>

                    <h3 className="text-lg sm:text-xl font-extrabold text-slate-950 group-hover:text-[#162774] transition-colors leading-snug">
                      {article.title}
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 max-w-3xl">
                      {article.summary}
                    </p>

                    <div className="text-[11px] text-slate-500 pt-1">
                      <span className="font-bold text-slate-800">{article.author.name}</span> &bull; {article.author.role}
                    </div>
                  </div>
                </div>

                {/* Right Action: Circle Arrow rotating 180deg */}
                <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 group-hover:text-[#162774] transition-colors">
                    Read
                  </span>
                  <span className="w-10 h-10 rounded-full bg-slate-100 group-hover:bg-[#162774] text-slate-900 group-hover:text-[#D9F83B] flex items-center justify-center transition-all duration-500 group-hover:rotate-180">
                    <ArrowRight size={15} />
                  </span>
                </div>
              </article>
            ))
          )}
        </section>
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
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100 mb-6">
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#162774] font-mono text-[10px] font-bold">
                  #{activeArticle.tag} &bull; {activeArticle.readingTime}
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 leading-tight">
                  {activeArticle.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setActiveArticle(null)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-[#F4F6FB] border border-slate-200 mb-8 text-xs">
              <div>
                <div className="font-bold text-slate-900">{activeArticle.author.name}</div>
                <div className="text-slate-500 text-[11px]">
                  {activeArticle.author.role} &bull; {activeArticle.author.handle}
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleCopyCitation(activeArticle)}
                className="px-4 py-1.5 rounded-full bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold transition-all cursor-pointer"
              >
                {copiedCitation ? "Citation Copied" : "Cite Article"}
              </button>
            </div>

            <div className="prose prose-slate max-w-none text-slate-700 text-sm leading-relaxed space-y-4 whitespace-pre-line">
              {activeArticle.content}
            </div>

            <div className="pt-8 mt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => alert("Thanks for upvoting this research article!")}
                  className="px-4 py-2 rounded-full bg-blue-50 hover:bg-blue-100 text-[#162774] font-bold cursor-pointer"
                >
                  Upvote ({activeArticle.upvotes})
                </button>
                <Link
                  href="/discussions"
                  className="px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold"
                >
                  Discuss in Forum
                </Link>
              </div>

              <button
                type="button"
                onClick={() => setActiveArticle(null)}
                className="text-xs font-bold text-slate-500 hover:text-slate-900 cursor-pointer"
              >
                Close Article
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
              <h3 className="text-xl font-bold text-slate-900">Submit Research Proposal</h3>
              <button
                type="button"
                onClick={() => setSubmitModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
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
                className="w-full bg-[#162774] hover:bg-[#1D3189] text-[#D9F83B] py-3 rounded-full font-bold uppercase tracking-wider transition-all mt-2 cursor-pointer shadow-md"
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
