"use client";

import React, { useState, useEffect } from "react";
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
  Filter,
  Loader2,
  AlertCircle
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

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
  const { user, studentProfile } = useAuth();
  const [projects, setProjects] = useState<ShowcaseProject[]>(INITIAL_PROJECTS);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [upvotedIds, setUpvotedIds] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newCategory, setNewCategory] = useState("AI Agents");
  const [newGithub, setNewGithub] = useState("");
  const [newDemo, setNewDemo] = useState("");
  const [newStack, setNewStack] = useState("Next.js, Python, Qdrant");
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState("");

  // Fetch projects directly from Firebase Database API
  const fetchDbProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/showcase");
      const data = await res.json();
      if (data.success && Array.isArray(data.projects) && data.projects.length > 0) {
        // Merge DB projects with sample initial projects
        const dbList: ShowcaseProject[] = data.projects;
        const dbIds = new Set(dbList.map((p) => p.id));
        const merged = [...dbList, ...INITIAL_PROJECTS.filter((p) => !dbIds.has(p.id))];
        setProjects(merged);
      }
    } catch (err) {
      console.warn("Failed to fetch database showcase projects:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDbProjects();
  }, []);

  // Check URL query parameters for pre-filling submission modal (from Arena completion)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const autoOpen = params.get("autoOpen");
      const title = params.get("title");
      const desc = params.get("desc");
      const category = params.get("category");
      const github = params.get("github");
      const demo = params.get("demo");
      const stack = params.get("stack");

      if (title) setNewTitle(title);
      if (desc) setNewDesc(desc);
      if (category) setNewCategory(category);
      if (github) setNewGithub(github);
      if (demo) setNewDemo(demo);
      if (stack) setNewStack(stack);

      if (autoOpen === "true" || title) {
        setShowModal(true);
      }
    }
  }, []);

  const toggleUpvote = async (id: string) => {
    const isCurrentlyUpvoted = Boolean(upvotedIds[id]);
    const delta = isCurrentlyUpvoted ? -1 : 1;

    setUpvotedIds((prev) => ({ ...prev, [id]: !isCurrentlyUpvoted }));
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          return { ...p, upvotes: Math.max(0, p.upvotes + delta) };
        }
        return p;
      })
    );

    try {
      await fetch("/api/showcase/upvote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, delta }),
      });
    } catch (e) {
      console.warn("Upvote database sync warning:", e);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim()) return;

    setSubmitting(true);
    setSubmitError("");

    const creatorName = user?.displayName || studentProfile?.displayName || "You (Community Builder)";
    const creatorHandle = studentProfile?.username ? `@${studentProfile.username}` : user?.email ? `@${user.email.split("@")[0]}` : "@builder";

    const payload = {
      title: newTitle.trim(),
      description: newDesc.trim(),
      category: newCategory,
      tags: newStack.split(",").map((s) => s.trim()).filter(Boolean),
      builtWith: newStack.split(",").map((s) => s.trim()).filter(Boolean),
      githubUrl: newGithub.trim() || undefined,
      demoUrl: newDemo.trim() || undefined,
      creator: {
        name: creatorName,
        handle: creatorHandle
      }
    };

    try {
      const res = await fetch("/api/showcase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to save project to database.");
      }

      const createdProject: ShowcaseProject = data.project || {
        id: data.id || `proj-${Date.now()}`,
        ...payload,
        upvotes: 1
      };

      setProjects((prev) => [createdProject, ...prev]);
      setUpvotedIds((prev) => ({ ...prev, [createdProject.id]: true }));
      setSubmitSuccess(`🎉 "${createdProject.title}" saved successfully to Firebase database & published to Showcase!`);
      setShowModal(false);
      setNewTitle("");
      setNewDesc("");
      setNewGithub("");
      setNewDemo("");

      setTimeout(() => setSubmitSuccess(null), 5000);
    } catch (err: any) {
      setSubmitError(err.message || "Failed to submit project to database.");
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = projects.filter((p) => {
    const matchesCat = selectedCategory === "All" || p.category === selectedCategory;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });


  return (
    <div className="bg-[#FAFCFF] min-h-screen text-slate-900 pb-12 pt-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-slate-200 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700 font-mono text-xs font-semibold mb-3">
              <Code2 size={13} /> BUILDER SHOWCASE ARENA
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Community AI Projects &amp; Demos
            </h1>
            <p className="text-slate-600 text-sm max-w-2xl mt-1">
              Explore production agents, open-source MCP servers, and RAG pipelines crafted by our community engineers.
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="bg-[#0066FF] hover:bg-[#0052CC] text-white px-6 py-3.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-sm flex items-center gap-2 cursor-pointer self-start md:self-auto"
          >
            <Plus size={16} /> Submit Your Project
          </button>
        </div>

        {submitSuccess && (
          <div className="mb-8 p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 font-mono text-xs flex items-center gap-3 shadow-sm">
            <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
            <span>{submitSuccess}</span>
          </div>
        )}


        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-[#0066FF] text-white font-bold shadow-2xs"
                    : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200"
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
              className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0066FF] shadow-2xs"
            />
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filtered.map(proj => (
            <div
              key={proj.id}
              className="bg-white border border-slate-200 hover:border-purple-300 rounded-3xl p-7 shadow-xs hover:shadow-md flex flex-col justify-between transition-all relative overflow-hidden"
            >
              {proj.featured && (
                <div className="absolute top-0 right-0 px-3.5 py-1 bg-purple-600 text-white font-mono text-[9px] font-bold uppercase rounded-bl-xl flex items-center gap-1">
                  <Award size={11} /> COMMUNITY PICK
                </div>
              )}

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#0066FF] border border-blue-100 font-mono text-[10px] font-bold">
                    {proj.category}
                  </span>
                  <span className="text-slate-400 font-mono text-xs">• by {proj.creator.name}</span>
                </div>

                <h2 className="text-xl font-bold text-slate-900 mb-2.5 leading-snug">
                  {proj.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                  {proj.description}
                </p>

                {/* Built With Tags */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {proj.builtWith.map(tech => (
                    <span key={tech} className="px-2 py-0.5 rounded bg-slate-50 border border-slate-200 text-slate-600 font-mono text-[10px]">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex items-center justify-between pt-5 border-t border-slate-100">
                <button
                  onClick={() => toggleUpvote(proj.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-xs transition-all cursor-pointer ${
                    upvotedIds[proj.id]
                      ? "bg-purple-600 text-white font-bold shadow-2xs"
                      : "bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200"
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
                      className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors"
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
                      className="px-3.5 py-2 rounded-xl bg-[#0066FF] hover:bg-[#0052CC] text-white font-mono text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs"
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
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl">
            <h2 className="text-xl font-bold text-slate-900 mb-1">Submit Your Project</h2>
            <p className="text-xs text-slate-500 mb-6">Showcase your AI creations to the Botmartz engineering community.</p>
            
            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-700 mb-1">Project Title</label>
                <input
                  type="text"
                  placeholder="e.g. DocuGraph — LangGraph Visualizer"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-slate-700 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                  >
                    <option value="AI Agents">🤖 AI Agents</option>
                    <option value="RAG & Search">📚 RAG &amp; Search</option>
                    <option value="DevTools">🛠️ DevTools &amp; MCP</option>
                    <option value="Fullstack AI">⚡ Fullstack AI</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-700 mb-1">Tech Stack</label>
                  <input
                    type="text"
                    value={newStack}
                    onChange={(e) => setNewStack(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="What does it do? How does it solve problems?"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-slate-700 mb-1">GitHub URL (optional)</label>
                  <input
                    type="url"
                    placeholder="https://github.com/..."
                    value={newGithub}
                    onChange={(e) => setNewGithub(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-700 mb-1">Live Demo URL (optional)</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={newDemo}
                    onChange={(e) => setNewDemo(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                  />
                </div>
              </div>

              {submitError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-mono flex items-center gap-2">
                  <AlertCircle size={14} className="shrink-0 text-rose-600" />
                  <span>{submitError}</span>
                </div>
              )}

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  disabled={submitting}
                  className="px-4 py-2 text-xs font-mono text-slate-500 hover:text-slate-800 cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-[#0066FF] hover:bg-[#0052CC] disabled:bg-blue-400 text-white rounded-xl text-xs font-mono font-bold uppercase transition-all shadow-sm cursor-pointer flex items-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span>Saving to Database...</span>
                    </>
                  ) : (
                    <span>Submit Project →</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

