"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Code2, 
  ExternalLink, 
  Github, 
  ThumbsUp, 
  Plus, 
  Sparkles, 
  Flame, 
  Search, 
  CheckCircle2, 
  Award,
  Filter
} from "lucide-react";

interface ShowcaseProject {
  id: string;
  title: string;
  creator: {
    name: string;
    handle: string;
  };
  description: string;
  category: string;
  tags: string[];
  githubUrl?: string;
  demoUrl?: string;
  upvotes: number;
  featured?: boolean;
  builtWith: string[];
}

const INITIAL_PROJECTS: ShowcaseProject[] = [
  {
    id: "proj-1",
    title: "DocuGraph — Visual LangGraph Workflow Debugger",
    creator: {
      name: "Rohan Varma",
      handle: "@rohan_v"
    },
    description: "An interactive web debugger that renders real-time state transitions, token counts, and tool payloads for LangGraph agent nodes.",
    category: "DevTools",
    tags: ["LangGraph", "ReactFlow", "FastAPI"],
    githubUrl: "https://github.com",
    demoUrl: "https://demo.example.com",
    upvotes: 89,
    featured: true,
    builtWith: ["LangGraph", "Next.js", "Python"]
  },
  {
    id: "proj-2",
    title: "InsureIntel — Sub-second Claim Policy Parser",
    creator: {
      name: "Sneha Patel",
      handle: "@sneha_p"
    },
    description: "Layout-aware PDF table extraction pipeline that answers zero-hallucination coverage questions with exact page and clause provenance.",
    category: "RAG & Search",
    tags: ["Qdrant", "CrossEncoder", "BGE"],
    githubUrl: "https://github.com",
    demoUrl: "https://demo.example.com",
    upvotes: 74,
    featured: true,
    builtWith: ["Qdrant", "FastAPI", "Docker"]
  },
  {
    id: "proj-3",
    title: "SQL-Agent-MCP — Natural Language to Schema-Safe PostgreSQL",
    creator: {
      name: "Vikram Mehta",
      handle: "@vmehta"
    },
    description: "Model Context Protocol integration with automated SQL validation, read-only transaction locks, and query plan explainers.",
    category: "AI Agents",
    tags: ["MCP", "PostgreSQL", "Claude"],
    githubUrl: "https://github.com",
    upvotes: 53,
    builtWith: ["TypeScript", "MCP SDK", "PostgreSQL"]
  },
  {
    id: "proj-4",
    title: "RAGAS-Automator — GitHub Actions Continuous RAG Benchmarking",
    creator: {
      name: "Ananya Sharma",
      handle: "@ananya_ai"
    },
    description: "A CI/CD action that runs automated RAGAS synthetic test suites on every pull request to catch retrieval regressions before production.",
    category: "DevTools",
    tags: ["CI/CD", "RAGAS", "GitHub Actions"],
    githubUrl: "https://github.com",
    upvotes: 41,
    builtWith: ["Python", "Docker", "GitHub Actions"]
  }
];

const CATEGORIES = ["All", "AI Agents", "RAG & Search", "DevTools", "Fullstack AI"];

export default function ShowcasePage() {
  const [projects, setProjects] = useState<ShowcaseProject[]>(INITIAL_PROJECTS);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [upvotedIds, setUpvotedIds] = useState<Record<string, boolean>>({});
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newCategory, setNewCategory] = useState("AI Agents");
  const [newGithub, setNewGithub] = useState("");
  const [newDemo, setNewDemo] = useState("");
  const [newStack, setNewStack] = useState("Next.js, Python, Qdrant");

  const toggleUpvote = (id: string) => {
    setUpvotedIds(prev => ({ ...prev, [id]: !prev[id] }));
    setProjects(prev => prev.map(p => {
      if (p.id === id) {
        const isUp = upvotedIds[id];
        return { ...p, upvotes: isUp ? p.upvotes - 1 : p.upvotes + 1 };
      }
      return p;
    }));
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim()) return;

    const newProj: ShowcaseProject = {
      id: `proj-${Date.now()}`,
      title: newTitle.trim(),
      creator: {
        name: "You (Community Builder)",
        handle: "@builder"
      },
      description: newDesc.trim(),
      category: newCategory,
      tags: newStack.split(",").map(s => s.trim()).filter(Boolean),
      githubUrl: newGithub.trim() || undefined,
      demoUrl: newDemo.trim() || undefined,
      upvotes: 1,
      builtWith: newStack.split(",").map(s => s.trim()).filter(Boolean)
    };

    setProjects([newProj, ...projects]);
    setUpvotedIds(prev => ({ ...prev, [newProj.id]: true }));
    setShowModal(false);
    setNewTitle("");
    setNewDesc("");
    setNewGithub("");
    setNewDemo("");
  };

  const filtered = projects.filter(p => {
    const matchesCat = selectedCategory === "All" || p.category === selectedCategory;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="bg-[#050B14] min-h-screen text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-10 border-b border-white/10 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 font-mono text-xs font-semibold mb-3">
              <Code2 size={13} /> BUILDER SHOWCASE ARENA
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Community AI Projects &amp; Demos
            </h1>
            <p className="text-slate-400 text-sm max-w-2xl mt-1">
              Explore production agents, open-source MCP servers, and RAG pipelines crafted by our community engineers.
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="bg-[#0066FF] hover:bg-[#0052CC] text-white px-6 py-3.5 rounded-2xl font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_25px_rgba(0,102,255,0.4)] flex items-center gap-2 cursor-pointer self-start md:self-auto"
          >
            <Plus size={16} /> Submit Your Project
          </button>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-mono transition-all ${
                  selectedCategory === cat
                    ? "bg-[#0066FF] text-white font-bold shadow-md"
                    : "bg-[#0B1524] text-slate-400 hover:text-white border border-white/10"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0B1524] border border-white/10 rounded-xl pl-9 pr-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#00B8F0]"
            />
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filtered.map(proj => (
            <div
              key={proj.id}
              className="bg-[#0B1524] border border-white/10 hover:border-purple-500/40 rounded-3xl p-7 shadow-xl flex flex-col justify-between transition-all relative overflow-hidden"
            >
              {proj.featured && (
                <div className="absolute top-0 right-0 px-3.5 py-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-mono text-[9px] font-bold uppercase rounded-bl-xl flex items-center gap-1">
                  <Award size={11} /> COMMUNITY PICK
                </div>
              )}

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#00B8F0]/10 text-[#00B8F0] font-mono text-[10px] font-bold">
                    {proj.category}
                  </span>
                  <span className="text-slate-500 font-mono text-xs">• by {proj.creator.name}</span>
                </div>

                <h2 className="text-xl font-bold text-white mb-2.5 leading-snug">
                  {proj.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
                  {proj.description}
                </p>

                {/* Built With Tags */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {proj.builtWith.map(tech => (
                    <span key={tech} className="px-2 py-0.5 rounded bg-[#050B14] border border-white/10 text-slate-300 font-mono text-[10px]">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex items-center justify-between pt-5 border-t border-white/10">
                <button
                  onClick={() => toggleUpvote(proj.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-xs transition-all cursor-pointer ${
                    upvotedIds[proj.id]
                      ? "bg-purple-600 text-white font-bold shadow-md"
                      : "bg-[#050B14] text-slate-400 hover:text-white border border-white/10"
                  }`}
                >
                  <ThumbsUp size={13} className={upvotedIds[proj.id] ? "fill-current" : ""} />
                  <span>{proj.upvotes} Upvotes</span>
                </button>

                <div className="flex items-center gap-3">
                  {proj.githubUrl && (
                    <a
                      href={proj.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-[#050B14] border border-white/10 text-slate-400 hover:text-white transition-colors"
                      title="View GitHub Code"
                    >
                      <Github size={15} />
                    </a>
                  )}
                  {proj.demoUrl && (
                    <a
                      href={proj.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 rounded-xl bg-[#0066FF] hover:bg-[#0052CC] text-white font-mono text-xs font-bold transition-all flex items-center gap-1.5"
                    >
                      <span>Live Demo</span>
                      <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* Submit Project Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0B1524] border border-white/15 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-1">Submit Your Project</h2>
            <p className="text-xs text-slate-400 mb-6">Showcase your AI creations to the Botmartz engineering community.</p>
            
            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Project Title</label>
                <input
                  type="text"
                  placeholder="e.g. DocuGraph — LangGraph Visualizer"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-[#050B14] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-[#050B14] border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white"
                  >
                    <option value="AI Agents">🤖 AI Agents</option>
                    <option value="RAG & Search">📚 RAG &amp; Search</option>
                    <option value="DevTools">🛠️ DevTools &amp; MCP</option>
                    <option value="Fullstack AI">⚡ Fullstack AI</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Tech Stack</label>
                  <input
                    type="text"
                    value={newStack}
                    onChange={(e) => setNewStack(e.target.value)}
                    className="w-full bg-[#050B14] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="What does it do? How does it solve problems?"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full bg-[#050B14] border border-white/15 rounded-xl p-3.5 text-xs text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">GitHub URL (optional)</label>
                  <input
                    type="url"
                    placeholder="https://github.com/..."
                    value={newGithub}
                    onChange={(e) => setNewGithub(e.target.value)}
                    className="w-full bg-[#050B14] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Live Demo URL (optional)</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={newDemo}
                    onChange={(e) => setNewDemo(e.target.value)}
                    className="w-full bg-[#050B14] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white"
                  />
                </div>
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
                  Submit Project →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
