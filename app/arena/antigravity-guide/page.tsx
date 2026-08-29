import React from "react";
import Link from "next/link";
import {
  Bot,
  Terminal,
  Code2,
  Sparkles,
  Layers,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  Cpu,
  Github
} from "lucide-react";

export default function AntigravityGuidePage() {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 text-[#0066FF] font-mono text-xs font-bold uppercase tracking-wider mb-2 border border-blue-200">
            <Bot size={14} /> Antigravity AI Engineering Track
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-2">
            Build Autonomous Research Agents on Antigravity
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm font-mono leading-relaxed">
            How to configure and deploy a multi-agent literature &amp; architecture research engine to automate paper analysis, schema extraction, and code scaffolding for your 45-day projects.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-8 space-y-8">
        
        {/* Why Antigravity Section */}
        <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#0066FF] uppercase mb-2">
            <Cpu size={14} /> Agent Architecture Blueprint
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-3">
            Why Build a Research Agent First?
          </h2>
          <p className="text-xs text-slate-700 leading-relaxed font-sans mb-4">
            Instead of spending days manually reading arXiv papers or API documentation for satellite imagery, eBPF probes, or DICOM volumetric formats, you can construct an autonomous research agent that crawls technical sources, extracts database schemas, and outputs structured Markdown dossiers.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs mt-6">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="font-bold text-slate-900 mb-1">1. Paper Summarizer</div>
              <p className="text-slate-500 text-[11px]">Extracts mathematical formulations and benchmark metrics from arXiv PDFs.</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="font-bold text-slate-900 mb-1">2. Schema Synthesizer</div>
              <p className="text-slate-500 text-[11px]">Transforms unstructured domain requirements into normalized PostgreSQL schemas.</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="font-bold text-slate-900 mb-1">3. Test Case Generator</div>
              <p className="text-slate-500 text-[11px]">Generates deterministic pytest test cases and k6 load scenarios.</p>
            </div>
          </div>
        </section>

        {/* 4-Step Implementation Guide */}
        <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            Step-by-Step Agent Setup
          </h2>

          {/* Step 1 */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
            <h3 className="font-bold text-slate-900 text-sm mb-2 font-mono flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#0066FF] text-white flex items-center justify-center text-xs">1</span>
              Install the Google Antigravity SDK &amp; Environment
            </h3>
            <div className="bg-slate-950 text-slate-200 p-4 rounded-xl font-mono text-xs overflow-x-auto">
              <code>$ pip install google-antigravity-sdk langchain langgraph qdrant-client</code>
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
            <h3 className="font-bold text-slate-900 text-sm mb-2 font-mono flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#0066FF] text-white flex items-center justify-center text-xs">2</span>
              Configure Autonomous Research Tools &amp; Web Search
            </h3>
            <div className="bg-slate-950 text-slate-200 p-4 rounded-xl font-mono text-xs overflow-x-auto">
              <pre className="leading-relaxed">{`from google_antigravity import AntigravityAgent, Tool
import arxiv

def fetch_arxiv_papers(query: str):
    search = arxiv.Search(query=query, max_results=5)
    return [{"title": r.title, "summary": r.summary, "pdf": r.pdf_url} for r in search.results()]

agent = AntigravityAgent(
    name="Frontier Research Swarm",
    tools=[Tool(name="arxiv_search", func=fetch_arxiv_papers)],
    system_prompt="You are a senior AI research engineer. Conduct deep architectural analyses."
)`}</pre>
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
            <h3 className="font-bold text-slate-900 text-sm mb-2 font-mono flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#0066FF] text-white flex items-center justify-center text-xs">3</span>
              Generate Production Architecture Dossier
            </h3>
            <p className="text-xs text-slate-600 font-mono mb-2">
              Instruct your agent to output standard Markdown files containing your database DDL, API routes, and test harness commands.
            </p>
            <div className="bg-slate-950 text-emerald-400 p-3.5 rounded-xl font-mono text-xs">
              <code>$ python run_research_swarm.py --topic "DICOM Volumetric 3D MONAI" --out architecture_plan.md</code>
            </div>
          </div>
        </section>

        {/* CTA to Custom Proposal */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-md border border-blue-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold mb-1">
              <Sparkles size={14} /> Ready to Ship Your Custom System?
            </div>
            <h3 className="text-xl font-bold mb-1">
              Submit a Custom Student Engineering Proposal
            </h3>
            <p className="text-xs text-blue-200 font-mono max-w-lg leading-relaxed">
              Use your research agent output to draft your PRD and get verified by Founder Soham Sharma for the 45-day cohort.
            </p>
          </div>

          <Link
            href="/arena/custom-project"
            className="px-6 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold font-mono text-xs transition-all shrink-0 flex items-center gap-2 shadow-xs"
          >
            <span>Submit Proposal</span>
            <ArrowRight size={14} />
          </Link>
        </div>

      </div>
    </div>
  );
}
