"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  KanbanSquare,
  CheckCircle2,
  AlertCircle,
  Clock,
  Plus,
  ArrowLeft,
  Terminal,
  ShieldCheck,
  Cpu,
  Users,
  Play,
  FileText,
  Copy,
  Check,
  Layers,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Filter,
  X,
  Bug,
  Activity,
  MessageSquare,
  Send
} from "lucide-react";
import { ArenaProject } from "@/lib/arena-projects";
import { useAuth } from "@/lib/auth-context";
import AuthGate from "@/app/_components/AuthGate";

interface Props {
  project: ArenaProject;
}

interface AgileTask {
  id: string;
  title: string;
  role: "Backend" | "ML / AI" | "Frontend" | "QA / Test" | "DevOps / Infra";
  priority: "CRITICAL" | "HIGH" | "MEDIUM";
  status: "BACKLOG" | "IN_PROGRESS" | "REVIEW" | "QA_TESTING" | "SHIPPED";
  assignee: string;
  storyPoints: number;
  slaTarget: string;
}

interface QATestCase {
  id: string;
  title: string;
  component: string;
  endpointOrMethod: string;
  preconditions: string;
  expectedSla: string;
  status: "PASSED" | "FAILED" | "BLOCKED" | "PENDING";
  testerName: string;
  lastExecuted: string;
  failureNotes?: string;
}

interface SquadChatMessage {
  id: string;
  senderName: string;
  senderRole: string;
  message: string;
  codeSnippet?: string;
  timeAgo: string;
}

export default function ProjectWorkspaceClient({ project }: Props) {
  const { user, studentProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<"KANBAN" | "QA_TESTS" | "SQUAD" | "CHAT">("KANBAN");
  const [filterRole, setFilterRole] = useState<string>("ALL");

  // Squad Common Chat State
  const [chatMessages, setChatMessages] = useState<SquadChatMessage[]>([
    {
      id: "msg-1",
      senderName: "Vedansh Trivedi",
      senderRole: "Backend Lead",
      message: `Hey team! I just configured the connection pool and PostgreSQL indexing for ${project.title}. Check the WAL test case in the QA tab.`,
      timeAgo: "2h ago"
    },
    {
      id: "msg-2",
      senderName: "Shruti Jadhav",
      senderRole: "QA Tester",
      message: "Spike test executed with k6! p95 latency is comfortably at 74ms under 100 concurrent workers. Zero memory leaks.",
      codeSnippet: "k6 run --vus 100 --duration 30s load_test.js // p95: 74.2ms | Error Rate: 0.00%",
      timeAgo: "1h ago"
    },
    {
      id: "msg-3",
      senderName: "Soham Sharma",
      senderRole: "Founder / Architect",
      message: "Solid work squad! Remember to log daily commit hashes on /arena/daily-log to earn +50 Karma Coins and maintain your streak.",
      timeAgo: "35m ago"
    }
  ]);
  const [newChatInput, setNewChatInput] = useState("");
  const [newChatSnippet, setNewChatSnippet] = useState("");

  // Initial Sprint Tasks
  const [tasks, setTasks] = useState<AgileTask[]>([
    {
      id: "TASK-101",
      title: "Design PostgreSQL schema & ACID transactional indices",
      role: "Backend",
      priority: "CRITICAL",
      status: "SHIPPED",
      assignee: "Soham Sharma",
      storyPoints: 5,
      slaTarget: "Zero schema lock timeouts"
    },
    {
      id: "TASK-102",
      title: "Implement sub-150ms inference pipeline with LangGraph / ONNX runtime",
      role: "ML / AI",
      priority: "CRITICAL",
      status: "QA_TESTING",
      assignee: user?.displayName || "Lead ML Engineer",
      storyPoints: 8,
      slaTarget: project.productionSla || "<150ms p95 latency"
    },
    {
      id: "TASK-103",
      title: "Write automated Playwright E2E test suite for user onboarding & telemetry",
      role: "QA / Test",
      priority: "HIGH",
      status: "IN_PROGRESS",
      assignee: "QA Automation Tester",
      storyPoints: 3,
      slaTarget: "100% flow pass rate"
    },
    {
      id: "TASK-104",
      title: "Containerize microservices with multi-stage Docker & healthchecks",
      role: "DevOps / Infra",
      priority: "HIGH",
      status: "REVIEW",
      assignee: "DevOps Engineer",
      storyPoints: 5,
      slaTarget: "<10s container cold boot"
    },
    {
      id: "TASK-105",
      title: "Build responsive analytics dashboard & real-time telemetry stream",
      role: "Frontend",
      priority: "MEDIUM",
      status: "IN_PROGRESS",
      assignee: "Frontend Dev",
      storyPoints: 5,
      slaTarget: "<60fps render smoothness"
    },
    {
      id: "TASK-106",
      title: "Configure k6 1,000 concurrent user spike load testing script",
      role: "QA / Test",
      priority: "CRITICAL",
      status: "BACKLOG",
      assignee: "QA Lead",
      storyPoints: 5,
      slaTarget: "0.0% error rate under load"
    }
  ]);

  // Initial QA Test Cases
  const [testCases, setTestCases] = useState<QATestCase[]>([
    {
      id: "TC-01",
      title: "High-Throughput Ingestion Latency SLA Test",
      component: "API Gateway / Ingestion",
      endpointOrMethod: "POST /v1/ingest/telemetry",
      preconditions: "Database connection pool healthy, 100 concurrent workers active",
      expectedSla: project.productionSla || "<150ms p95 response time",
      status: "PASSED",
      testerName: "QA Automated Bot",
      lastExecuted: "Today, 08:30 AM"
    },
    {
      id: "TC-02",
      title: "Vector Embedding Retrieval Consistency & Zero NaN Check",
      component: "Vector DB / Qdrant",
      endpointOrMethod: "POST /v1/search/similarity",
      preconditions: "10,000 vector records indexed with Matryoshka compression",
      expectedSla: "Recall@10 > 95%, query latency < 80ms",
      status: "PASSED",
      testerName: user?.displayName || "Soham Sharma",
      lastExecuted: "Today, 09:15 AM"
    },
    {
      id: "TC-03",
      title: "Agent Loop State Checkpoint Recovery under Network Timeout",
      component: "LangGraph State Machine",
      endpointOrMethod: "POST /v1/agent/execute-step",
      preconditions: "Inject 504 Gateway timeout at Step 3 of 5",
      expectedSla: "Idempotent state rollback without data corruption",
      status: "PASSED",
      testerName: "Vedansh Trivedi",
      lastExecuted: "Yesterday"
    },
    {
      id: "TC-04",
      title: "1,000 Concurrent Spike Load & Memory Leak Verification",
      component: "FastAPI Core Worker",
      endpointOrMethod: "GET /health/metrics",
      preconditions: "k6 load runner running 1000 VU ramp-up for 10 minutes",
      expectedSla: "RAM usage delta < 50MB, zero OOM kill triggers",
      status: "PENDING",
      testerName: "Shruti Jadhav",
      lastExecuted: "Pending Run",
      failureNotes: "Scheduled for Sprint 2 CI test run."
    }
  ]);

  // Modal States
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskRole, setNewTaskRole] = useState<AgileTask["role"]>("Backend");
  const [newTaskPriority, setNewTaskPriority] = useState<AgileTask["priority"]>("HIGH");
  const [newTaskPoints, setNewTaskPoints] = useState(3);
  const [newTaskSla, setNewTaskSla] = useState("<150ms latency");

  const [showTestModal, setShowTestModal] = useState(false);
  const [newTestTitle, setNewTestTitle] = useState("");
  const [newTestComponent, setNewTestComponent] = useState("");
  const [newTestEndpoint, setNewTestEndpoint] = useState("");
  const [newTestPreconditions, setNewTestPreconditions] = useState("");
  const [newTestSla, setNewTestSla] = useState("<150ms p95");

  const [copiedReport, setCopiedReport] = useState(false);

  // Kanban Columns
  const KANBAN_COLUMNS: { id: AgileTask["status"]; label: string; bg: string; border: string; text: string }[] = [
    { id: "BACKLOG", label: "Backlog", bg: "bg-slate-50", border: "border-slate-200", text: "text-slate-700" },
    { id: "IN_PROGRESS", label: "In Development", bg: "bg-blue-50/50", border: "border-blue-200", text: "text-blue-700" },
    { id: "REVIEW", label: "Peer Code Review", bg: "bg-purple-50/50", border: "border-purple-200", text: "text-purple-700" },
    { id: "QA_TESTING", label: "QA & SLA Testing", bg: "bg-amber-50/50", border: "border-amber-200", text: "text-amber-700" },
    { id: "SHIPPED", label: "Production Shipped", bg: "bg-emerald-50/50", border: "border-emerald-200", text: "text-emerald-700" }
  ];

  // Move Task to Next or Previous Column
  const moveTask = (taskId: string, direction: "next" | "prev") => {
    const statuses: AgileTask["status"][] = ["BACKLOG", "IN_PROGRESS", "REVIEW", "QA_TESTING", "SHIPPED"];
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const currentIndex = statuses.indexOf(t.status);
        const newIndex = direction === "next" ? Math.min(currentIndex + 1, statuses.length - 1) : Math.max(currentIndex - 1, 0);
        return { ...t, status: statuses[newIndex] };
      })
    );
  };

  // Toggle QA Test Case Status
  const cycleTestStatus = (testId: string) => {
    const statuses: QATestCase["status"][] = ["PENDING", "PASSED", "FAILED", "BLOCKED"];
    setTestCases((prev) =>
      prev.map((tc) => {
        if (tc.id !== testId) return tc;
        const currIdx = statuses.indexOf(tc.status);
        const nextIdx = (currIdx + 1) % statuses.length;
        return {
          ...tc,
          status: statuses[nextIdx],
          lastExecuted: "Just now",
          testerName: user?.displayName || tc.testerName
        };
      })
    );
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask: AgileTask = {
      id: `TASK-${Date.now().toString().slice(-3)}`,
      title: newTaskTitle.trim(),
      role: newTaskRole,
      priority: newTaskPriority,
      status: "BACKLOG",
      assignee: user?.displayName || "Assigned Builder",
      storyPoints: Number(newTaskPoints) || 3,
      slaTarget: newTaskSla.trim() || "<150ms"
    };

    setTasks([...tasks, newTask]);
    setShowTaskModal(false);
    setNewTaskTitle("");
  };

  const handleAddTestCase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTestTitle.trim()) return;

    const newTest: QATestCase = {
      id: `TC-0${testCases.length + 1}`,
      title: newTestTitle.trim(),
      component: newTestComponent.trim() || "Core Module",
      endpointOrMethod: newTestEndpoint.trim() || "POST /v1/endpoint",
      preconditions: newTestPreconditions.trim() || "Default test environment initialized",
      expectedSla: newTestSla.trim() || "<150ms p95",
      status: "PENDING",
      testerName: user?.displayName || "QA Engineer",
      lastExecuted: "Pending Run"
    };

    setTestCases([...testCases, newTest]);
    setShowTestModal(false);
    setNewTestTitle("");
    setNewTestComponent("");
    setNewTestEndpoint("");
  };

  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChatInput.trim()) return;

    const newMsg: SquadChatMessage = {
      id: `msg-${Date.now()}`,
      senderName: user?.displayName || studentProfile?.displayName || "Community Builder",
      senderRole: studentProfile?.personaType === "STUDENT" ? "AI Engineering Fellow" : "Builder Lead",
      message: newChatInput.trim(),
      codeSnippet: newChatSnippet.trim() || undefined,
      timeAgo: "Just now"
    };

    setChatMessages([...chatMessages, newMsg]);
    setNewChatInput("");
    setNewChatSnippet("");
  };

  const copySprintAuditReport = () => {
    const passedCount = testCases.filter((t) => t.status === "PASSED").length;
    const totalCount = testCases.length;
    const passRate = Math.round((passedCount / totalCount) * 100);
    const shippedTasks = tasks.filter((t) => t.status === "SHIPPED").length;

    const report = `# Sprint & QA Quality Audit Report: ${project.title}
Generated: ${new Date().toLocaleDateString()}
Production Target SLA: ${project.productionSla || "<150ms p95"}

## 1. Agile Sprint Summary
- Total Sprint Tasks: ${tasks.length}
- Shipped to Production: ${shippedTasks} / ${tasks.length}
- In-Flight / Review: ${tasks.filter((t) => t.status === "IN_PROGRESS" || t.status === "REVIEW" || t.status === "QA_TESTING").length}

## 2. QA Test Case Execution Matrix
- Total Test Cases: ${totalCount}
- Passed: ${passedCount} (${passRate}% Pass Rate)
- Pending / Blocked: ${testCases.filter((t) => t.status !== "PASSED").length}

### Test Suite Details:
${testCases
  .map(
    (tc) =>
      `- [${tc.status === "PASSED" ? "x" : " "}] ${tc.id}: ${tc.title} (${tc.endpointOrMethod}) | SLA: ${tc.expectedSla} | Status: ${tc.status}`
  )
  .join("\n")}

---
Audited & Verified via Botmartz Agile Workspace Simulator`;

    navigator.clipboard.writeText(report);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2500);
  };

  const filteredTasks = filterRole === "ALL" ? tasks : tasks.filter((t) => t.role === filterRole);

  const passedTests = testCases.filter((t) => t.status === "PASSED").length;
  const passRatePercent = Math.round((passedTests / testCases.length) * 100) || 0;

  return (
    <AuthGate
      featureTitle="Agile Workspace & QA Suite"
      featureDescription="Sign in with your builder profile to access the Kanban board, execute automated QA test suites, and collaborate in the live squad chat room."
    >
      <div className="bg-[#FAFCFF] min-h-screen text-slate-900 pt-24 pb-28 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <Link
            href={`/arena/${project.slug || project.id}`}
            className="inline-flex items-center gap-2 text-xs font-mono font-bold text-slate-500 hover:text-[#0066FF] transition-colors"
          >
            <ArrowLeft size={14} /> Back to PRD Blueprint
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href={`/arena/daily-log?projectId=${project.id}`}
              className="px-4 py-2 rounded-xl bg-[#0066FF] text-white font-mono text-xs font-bold shadow-xs hover:bg-blue-600 transition-colors flex items-center gap-1.5"
            >
              <Terminal size={14} />
              <span>Log Daily Commit (+50 Coins)</span>
            </Link>
          </div>
        </div>

        {/* Hero Header Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 mb-8 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 font-mono text-xs font-bold mb-2">
                <KanbanSquare size={13} /> SPRINT 1 AGILE WORKSPACE &amp; QA SUITE
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {project.title} Workspace
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-mono mt-1">
                Role-based sprint tracking, Jira-style task boards, and automated QA test-case logging for your squad.
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center min-w-24">
                <div className="text-[10px] text-slate-500 uppercase font-bold">Sprint Tasks</div>
                <div className="text-xl font-bold text-slate-900 mt-0.5">{tasks.length}</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center min-w-24">
                <div className="text-[10px] text-emerald-700 uppercase font-bold">QA Pass Rate</div>
                <div className="text-xl font-bold text-emerald-700 mt-0.5">{passRatePercent}%</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 text-center min-w-28">
                <div className="text-[10px] text-[#0066FF] uppercase font-bold">SLA Target</div>
                <div className="text-xs font-bold text-blue-900 mt-1">{project.productionSla || "<150ms p95"}</div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-4 mt-8 pt-6 border-t border-slate-200 font-mono text-xs">
            <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl">
              <button
                onClick={() => setActiveTab("KANBAN")}
                className={`px-4 py-2 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "KANBAN" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <KanbanSquare size={13} />
                <span>Sprint Kanban Board</span>
              </button>
              <button
                onClick={() => setActiveTab("QA_TESTS")}
                className={`px-4 py-2 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "QA_TESTS" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Bug size={13} />
                <span>QA Test Case Suite ({testCases.length})</span>
              </button>
              <button
                onClick={() => setActiveTab("SQUAD")}
                className={`px-4 py-2 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "SQUAD" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Users size={13} />
                <span>Squad Roles &amp; Team</span>
              </button>
              <button
                onClick={() => setActiveTab("CHAT")}
                className={`px-4 py-2 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "CHAT" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <MessageSquare size={13} className="text-[#0066FF]" />
                <span>Squad Common Chat ({chatMessages.length})</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={copySprintAuditReport}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                {copiedReport ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                <span>{copiedReport ? "Report Copied!" : "Export Sprint Audit"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* =========================================================================
            TAB 1: SPRINT KANBAN BOARD
        ========================================================================= */}
        {activeTab === "KANBAN" && (
          <div className="space-y-6">
            {/* Filter & Add Task Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-500 font-bold flex items-center gap-1">
                  <Filter size={13} /> Filter by Role:
                </span>
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 font-bold focus:outline-none focus:border-[#0066FF]"
                >
                  <option value="ALL">All Roles ({tasks.length})</option>
                  <option value="Backend">Backend</option>
                  <option value="ML / AI">ML / AI</option>
                  <option value="Frontend">Frontend</option>
                  <option value="QA / Test">QA / Test</option>
                  <option value="DevOps / Infra">DevOps / Infra</option>
                </select>
              </div>

              <button
                onClick={() => setShowTaskModal(true)}
                className="px-4 py-2 rounded-xl bg-[#0066FF] hover:bg-blue-600 text-white font-bold transition-colors flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
              >
                <Plus size={14} />
                <span>Add Sprint Task</span>
              </button>
            </div>

            {/* Kanban Columns Grid */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {KANBAN_COLUMNS.map((col) => {
                const colTasks = filteredTasks.filter((t) => t.status === col.id);
                return (
                  <div key={col.id} className={`rounded-3xl p-4 border ${col.border} ${col.bg} flex flex-col min-h-96`}>
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 mb-3 font-mono">
                      <span className={`text-xs font-extrabold uppercase ${col.text}`}>{col.label}</span>
                      <span className="w-5 h-5 rounded-full bg-white border border-slate-200 text-slate-600 text-[10px] font-bold flex items-center justify-center">
                        {colTasks.length}
                      </span>
                    </div>

                    <div className="space-y-3 flex-1">
                      {colTasks.map((t) => (
                        <div
                          key={t.id}
                          className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-xs transition-all space-y-2.5"
                        >
                          <div className="flex items-center justify-between text-[10px] font-mono">
                            <span className="text-slate-400 font-bold">{t.id}</span>
                            <span
                              className={`px-2 py-0.5 rounded-md font-bold uppercase ${
                                t.priority === "CRITICAL"
                                  ? "bg-rose-100 text-rose-700"
                                  : t.priority === "HIGH"
                                  ? "bg-amber-100 text-amber-800"
                                  : "bg-slate-100 text-slate-700"
                              }`}
                            >
                              {t.priority}
                            </span>
                          </div>

                          <h4 className="text-xs font-bold text-slate-900 leading-snug">{t.title}</h4>

                          <div className="text-[11px] font-mono text-slate-500 flex items-center justify-between pt-1 border-t border-slate-100">
                            <span className="text-[#0066FF] font-bold">{t.role}</span>
                            <span>{t.storyPoints} pts</span>
                          </div>

                          <div className="text-[10px] font-mono text-slate-400 truncate">
                            🎯 SLA: <span className="text-slate-600">{t.slaTarget}</span>
                          </div>

                          {/* Quick Move Buttons */}
                          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10px] font-mono">
                            <button
                              onClick={() => moveTask(t.id, "prev")}
                              disabled={col.id === "BACKLOG"}
                              className="px-2 py-1 rounded bg-slate-50 hover:bg-slate-100 text-slate-600 disabled:opacity-30 cursor-pointer"
                            >
                              &larr; Prev
                            </button>
                            <span className="text-slate-400">{t.assignee.split(" ")[0]}</span>
                            <button
                              onClick={() => moveTask(t.id, "next")}
                              disabled={col.id === "SHIPPED"}
                              className="px-2 py-1 rounded bg-blue-50 hover:bg-blue-100 text-[#0066FF] font-bold disabled:opacity-30 cursor-pointer"
                            >
                              Next &rarr;
                            </button>
                          </div>
                        </div>
                      ))}

                      {colTasks.length === 0 && (
                        <div className="h-32 border-2 border-dashed border-slate-200/80 rounded-2xl flex items-center justify-center text-slate-400 font-mono text-[11px]">
                          No tasks in {col.label}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: QA TEST CASE SUITE LOGGER
        ========================================================================= */}
        {activeTab === "QA_TESTS" && (
          <div className="space-y-6 font-mono text-xs">
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-sans">
                  Automated &amp; Manual QA Test Case Suite
                </h3>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  Testers and engineers verify SLA latencies, deterministic rollbacks, and schema integrity.
                </p>
              </div>

              <button
                onClick={() => setShowTestModal(true)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
              >
                <Plus size={14} />
                <span>Add QA Test Case</span>
              </button>
            </div>

            {/* Test Cases Table / Cards */}
            <div className="space-y-3">
              {testCases.map((tc) => (
                <div
                  key={tc.id}
                  className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-slate-900">{tc.id}: {tc.title}</span>
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold">
                        {tc.component}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-600">
                      <strong>Endpoint:</strong> <code className="bg-slate-100 px-1.5 py-0.5 rounded text-blue-700">{tc.endpointOrMethod}</code>
                    </div>

                    <div className="text-[11px] text-slate-500">
                      <strong>Preconditions:</strong> {tc.preconditions}
                    </div>

                    <div className="text-[11px] text-slate-700">
                      <strong>Expected SLA:</strong> <span className="font-bold text-purple-700">{tc.expectedSla}</span>
                    </div>
                  </div>

                  {/* Status & Action */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                    <div className="text-right sm:text-left text-[11px] text-slate-500">
                      <div>Tested by: <strong>{tc.testerName}</strong></div>
                      <div className="text-[10px] text-slate-400">{tc.lastExecuted}</div>
                    </div>

                    <button
                      onClick={() => cycleTestStatus(tc.id)}
                      className={`px-4 py-2 rounded-xl font-bold uppercase tracking-wider text-[11px] transition-all cursor-pointer flex items-center justify-center gap-1.5 min-w-32 ${
                        tc.status === "PASSED"
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                          : tc.status === "FAILED"
                          ? "bg-rose-100 text-rose-800 border border-rose-300"
                          : tc.status === "BLOCKED"
                          ? "bg-amber-100 text-amber-800 border border-amber-300"
                          : "bg-slate-100 text-slate-700 border border-slate-300"
                      }`}
                      title="Click to cycle status: PASSED -> FAILED -> BLOCKED -> PENDING"
                    >
                      {tc.status === "PASSED" && <CheckCircle2 size={13} />}
                      {tc.status === "FAILED" && <AlertCircle size={13} />}
                      {tc.status === "BLOCKED" && <ShieldCheck size={13} />}
                      {tc.status === "PENDING" && <Clock size={13} />}
                      <span>{tc.status}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 3: SQUAD ROLES & TEAM COLLABORATION
        ========================================================================= */}
        {activeTab === "SQUAD" && (
          <div className="space-y-6 font-mono text-xs">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 font-sans">
                    Squad Role Allocation &amp; Teammates
                  </h3>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">
                    Real engineering teams distribute ownership across specialised responsibilities.
                  </p>
                </div>

                <Link
                  href="/arena/collaborate"
                  className="px-4 py-2 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 font-bold hover:bg-purple-100 transition-colors"
                >
                  Find Teammates on Matchmaking &rarr;
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  {
                    role: "AI / ML Architect",
                    person: user?.displayName || "Lead ML Engineer",
                    responsibilities: "Inference pipelines, embeddings, prompt chains, LangGraph checkpoints",
                    badge: "ML Lead"
                  },
                  {
                    role: "Backend & Systems Engineer",
                    person: "Soham Sharma",
                    responsibilities: "PostgreSQL schema, FastAPI REST/gRPC endpoints, connection pools, Docker",
                    badge: "Backend Lead"
                  },
                  {
                    role: "QA Automation Tester",
                    person: "Shruti Jadhav",
                    responsibilities: "Playwright E2E suites, k6 spike load testing, SLA latency assertion",
                    badge: "QA Lead"
                  },
                  {
                    role: "Frontend & Product Builder",
                    person: "Bhavya Jain",
                    responsibilities: "Next.js UI, real-time WebSocket telemetry, interactive dashboards",
                    badge: "Frontend Lead"
                  }
                ].map((member, mi) => (
                  <div key={mi} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] text-[#0066FF] font-bold uppercase">{member.badge}</span>
                        <Users size={14} className="text-slate-400" />
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm font-sans mb-1">{member.role}</h4>
                      <div className="text-slate-600 font-bold mb-3">{member.person}</div>
                      <p className="text-[11px] text-slate-500 leading-relaxed">{member.responsibilities}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-200/80 text-[10px] text-emerald-700 font-bold">
                      ✔ Active in Sprint 1
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 4: SQUAD COMMON CHAT (PROJECT BUILDER CHAT ROOM)
        ========================================================================= */}
        {activeTab === "CHAT" && (
          <div className="space-y-6 font-mono text-xs">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 mb-6">
                <div>
                  <div className="flex items-center gap-2 text-[#0066FF] font-bold uppercase text-[11px] mb-1">
                    <MessageSquare size={14} /> Real-Time Project Builder Chat
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 font-sans">
                    {project.title} Squad Room
                  </h3>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">
                    Connect, unblock architecture questions, share test outputs, and coordinate with all builders working on this project.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href="https://discord.gg/k75ZpEnzp"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 font-bold transition-colors flex items-center gap-1.5"
                  >
                    <span>Discord Squad Voice</span>
                    <ExternalLink size={12} />
                  </a>
                  <a
                    href="https://chat.whatsapp.com/DkzKwpjuktaCYAofOtMlAQ"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 font-bold transition-colors flex items-center gap-1.5"
                  >
                    <span>WhatsApp Group</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>

              {/* Message Feed */}
              <div className="space-y-4 mb-8 max-h-[480px] overflow-y-auto pr-2">
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3.5"
                  >
                    <div className="w-9 h-9 rounded-xl bg-[#0066FF] text-white flex items-center justify-center font-bold text-xs shrink-0 font-sans">
                      {msg.senderName.charAt(0)}
                    </div>
                    <div className="flex-1 space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 font-sans text-xs">{msg.senderName}</span>
                          <span className="px-2 py-0.5 rounded-md bg-blue-50 text-[#0066FF] text-[10px] font-bold border border-blue-200">
                            {msg.senderRole}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400">{msg.timeAgo}</span>
                      </div>

                      <p className="text-slate-700 leading-relaxed font-sans text-xs">
                        {msg.message}
                      </p>

                      {msg.codeSnippet && (
                        <div className="p-3 rounded-xl bg-slate-900 text-emerald-400 font-mono text-[11px] overflow-x-auto border border-slate-800">
                          <code>{msg.codeSnippet}</code>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input Form */}
              <form onSubmit={handleSendChatMessage} className="space-y-3 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between text-[11px] text-slate-500 font-bold">
                  <span>Send Message to Project Squad</span>
                  <span>Posting as: <strong className="text-slate-900">{user?.displayName || studentProfile?.displayName || "Community Builder"}</strong></span>
                </div>

                <div className="space-y-2">
                  <textarea
                    rows={2}
                    value={newChatInput}
                    onChange={(e) => setNewChatInput(e.target.value)}
                    placeholder={`Ask a question, propose an architecture fix, or discuss test outputs with other builders working on ${project.title}...`}
                    className="w-full p-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:border-[#0066FF] focus:bg-white text-slate-900 outline-none transition-all resize-none text-xs font-sans"
                  />

                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <input
                      type="text"
                      value={newChatSnippet}
                      onChange={(e) => setNewChatSnippet(e.target.value)}
                      placeholder="Optional: attach code snippet, test assertion, or command (e.g. k6 run --vus 50)"
                      className="flex-1 w-full p-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#0066FF] text-slate-900 outline-none text-xs font-mono"
                    />

                    <button
                      type="submit"
                      disabled={!newChatInput.trim()}
                      className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#0066FF] hover:bg-blue-600 disabled:opacity-50 text-white font-bold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs shrink-0"
                    >
                      <Send size={14} />
                      <span>Post to Squad</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>

      {/* =========================================================================
          MODAL 1: ADD SPRINT TASK MODAL
      ========================================================================= */}
      {showTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 relative font-mono text-xs text-slate-900">
            <button
              onClick={() => setShowTaskModal(false)}
              className="absolute top-5 right-5 p-1 rounded-lg text-slate-400 hover:text-slate-700"
            >
              <X size={16} />
            </button>

            <h3 className="text-lg font-bold font-sans mb-4">Add New Sprint Task</h3>

            <form onSubmit={handleAddTask} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Task Title *</label>
                <input
                  type="text"
                  required
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="e.g. Implement WAL journaling in FastAPI"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Role *</label>
                  <select
                    value={newTaskRole}
                    onChange={(e) => setNewTaskRole(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900"
                  >
                    <option value="Backend">Backend</option>
                    <option value="ML / AI">ML / AI</option>
                    <option value="Frontend">Frontend</option>
                    <option value="QA / Test">QA / Test</option>
                    <option value="DevOps / Infra">DevOps / Infra</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Priority</label>
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900"
                  >
                    <option value="CRITICAL">Critical</option>
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Story Points</label>
                  <input
                    type="number"
                    min={1}
                    max={13}
                    value={newTaskPoints}
                    onChange={(e) => setNewTaskPoints(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Target SLA</label>
                  <input
                    type="text"
                    value={newTaskSla}
                    onChange={(e) => setNewTaskSla(e.target.value)}
                    placeholder="<150ms"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#0066FF] hover:bg-blue-600 text-white font-bold uppercase tracking-wider transition-all mt-4 cursor-pointer"
              >
                Create Task &rarr;
              </button>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: ADD QA TEST CASE MODAL
      ========================================================================= */}
      {showTestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 relative font-mono text-xs text-slate-900">
            <button
              onClick={() => setShowTestModal(false)}
              className="absolute top-5 right-5 p-1 rounded-lg text-slate-400 hover:text-slate-700"
            >
              <X size={16} />
            </button>

            <h3 className="text-lg font-bold font-sans mb-4">Add QA Test Case</h3>

            <form onSubmit={handleAddTestCase} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Test Title *</label>
                <input
                  type="text"
                  required
                  value={newTestTitle}
                  onChange={(e) => setNewTestTitle(e.target.value)}
                  placeholder="e.g. Ingestion Latency SLA Test"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0066FF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Component</label>
                  <input
                    type="text"
                    value={newTestComponent}
                    onChange={(e) => setNewTestComponent(e.target.value)}
                    placeholder="e.g. API Gateway"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Endpoint / Method</label>
                  <input
                    type="text"
                    value={newTestEndpoint}
                    onChange={(e) => setNewTestEndpoint(e.target.value)}
                    placeholder="POST /v1/ingest"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Preconditions</label>
                <input
                  type="text"
                  value={newTestPreconditions}
                  onChange={(e) => setNewTestPreconditions(e.target.value)}
                  placeholder="e.g. 100 concurrent workers active"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Expected SLA Latency</label>
                <input
                  type="text"
                  value={newTestSla}
                  onChange={(e) => setNewTestSla(e.target.value)}
                  placeholder="<150ms p95 response time"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold uppercase tracking-wider transition-all mt-4 cursor-pointer"
              >
                Save QA Test Case &rarr;
              </button>
            </form>
          </div>
        </div>
      )}

      </div>
    </AuthGate>
  );
}
