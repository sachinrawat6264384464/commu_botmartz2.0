export interface HackathonProject {
  id: string;
  title: string;
  domain: string;
  difficulty: "Intermediate" | "Hard" | "Insane";
  tagline: string;
  problemStatement: string;
  deliverables: string[];
  techStack: string[];
  soloFee: number;
  teamFee: number;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface HackathonMember {
  name: string;
  email: string;
  phone?: string;
  role?: string;
}

export interface HackathonRegistration {
  id: string;
  uniqueCode: string;
  projectId: string;
  projectTitle: string;
  mode: "solo" | "team";
  teamName: string;
  leader: {
    name: string;
    email: string;
    phone: string;
    organization?: string;
    github?: string;
  };
  members: HackathonMember[];
  amountPaid: number;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  paymentStatus: "paid";
  createdAt: string;
  expiresAt: string;
  submitted?: boolean;
}

export interface HackathonSubmission {
  id: string;
  uniqueCode: string;
  projectId: string;
  projectTitle: string;
  mode: "solo" | "team";
  teamName: string;
  leader: {
    name: string;
    email: string;
    phone: string;
  };
  members: HackathonMember[];
  githubUrl: string;
  deployedUrl: string;
  notes?: string;
  submittedAt: string;
  status: "Submitted" | "Under Review" | "Shortlisted" | "Winner";
}

export const SOLO_HACKATHON_FEE = 159;
export const TEAM_HACKATHON_FEE = 450;

export const DEFAULT_HACKATHON_PROJECTS: Omit<HackathonProject, "createdAt">[] = [
  {
    id: "hack-autonomous-incident-agent",
    title: "Autonomous Production Incident Triage Agent",
    domain: "AI Agents & DevOps",
    difficulty: "Hard",
    tagline: "Multi-agent root-cause analyzer for live server logs, stack traces, and rollback PRs.",
    problemStatement:
      "Build an autonomous AI incident responder that ingests webhook alerts and raw error logs, correlates recent Git commits, identifies the failing service, and drafts a verified remediation patch with confidence scoring.",
    deliverables: [
      "Working GitHub repository with clean README & architecture diagram",
      "Live deployed dashboard accepting webhook payloads & showing root-cause trace",
      "Automated patch/runbook output with latency under 10 seconds",
    ],
    techStack: ["Next.js", "Python", "FastAPI", "LangGraph", "Redis"],
    soloFee: SOLO_HACKATHON_FEE,
    teamFee: TEAM_HACKATHON_FEE,
    isActive: true,
  },
  {
    id: "hack-realtime-fraud-shield",
    title: "Real-Time UPI & FinTech Anomaly Shield",
    domain: "FinTech & Streaming ML",
    difficulty: "Hard",
    tagline: "Sub-50ms transaction risk scoring engine with live velocity alerts and rule explainability.",
    problemStatement:
      "Design a streaming fraud detection gateway that evaluates incoming payment events against velocity rules, device fingerprinting, and behavioral anomalies, returning allow/challenge/block decisions in real time.",
    deliverables: [
      "Streaming risk-scoring API with deterministic rule + ML scoring",
      "Live monitoring UI displaying flagged transactions and risk reasons",
      "Public GitHub repo + deployed interactive simulator",
    ],
    techStack: ["TypeScript", "Node.js", "PostgreSQL", "Kafka / Redis", "Next.js"],
    soloFee: SOLO_HACKATHON_FEE,
    teamFee: TEAM_HACKATHON_FEE,
    isActive: true,
  },
  {
    id: "hack-clinical-triage-rag",
    title: "Verifiable Clinical Guidelines RAG Copilot",
    domain: "Healthcare AI",
    difficulty: "Intermediate",
    tagline: "Citation-grounded medical triage assistant with zero-hallucination evidence links.",
    problemStatement:
      "Build a clinical reference copilot that answers symptom and protocol queries strictly from indexed medical guidelines, returning inline page citations, confidence flags, and escalation warnings.",
    deliverables: [
      "Hybrid vector + keyword retrieval pipeline with strict citation enforcement",
      "Clean web interface highlighting exact source passages",
      "Deployed live demo + reproducible GitHub repository",
    ],
    techStack: ["Python", "FastAPI", "pgvector", "React", "Tailwind"],
    soloFee: SOLO_HACKATHON_FEE,
    teamFee: TEAM_HACKATHON_FEE,
    isActive: true,
  },
  {
    id: "hack-zero-trust-api-gateway",
    title: "Zero-Trust API Rate Limiter & Threat WAF",
    domain: "Cybersecurity & Cloud",
    difficulty: "Insane",
    tagline: "Programmable reverse proxy with token-bucket throttling, JWT introspection, and bot traps.",
    problemStatement:
      "Create a lightweight API gateway middleware that blocks credential stuffing, enforces per-tenant sliding-window rate limits, detects payload injection patterns, and logs security events live.",
    deliverables: [
      "Working proxy/middleware with live attack simulation dashboard",
      "Configurable rate-limit & WAF policy engine",
      "GitHub repo with load-test benchmarks + live deployed portal",
    ],
    techStack: ["Go / Node.js", "Redis", "Docker", "Next.js", "TypeScript"],
    soloFee: SOLO_HACKATHON_FEE,
    teamFee: TEAM_HACKATHON_FEE,
    isActive: true,
  },
  {
    id: "hack-supply-chain-optimizer",
    title: "Dynamic Last-Mile Logistics Route Optimizer",
    domain: "Logistics & Geospatial",
    difficulty: "Intermediate",
    tagline: "Multi-stop fleet dispatch planner optimizing fuel cost, SLA windows, and live delays.",
    problemStatement:
      "Build a dispatch optimization platform that assigns delivery orders to vehicles under capacity and time-window constraints, recalculating routes dynamically when traffic or order spikes occur.",
    deliverables: [
      "Route optimization solver with interactive map visualization",
      "Dispatcher dashboard showing ETA, utilization, and SLA compliance",
      "Clean GitHub repository + live deployed web app",
    ],
    techStack: ["Next.js", "TypeScript", "OR-Tools / Python", "Leaflet / Mapbox", "Firestore"],
    soloFee: SOLO_HACKATHON_FEE,
    teamFee: TEAM_HACKATHON_FEE,
    isActive: true,
  },
  {
    id: "hack-code-review-guardian",
    title: "PR Architecture & Security Review Bot",
    domain: "Developer Tooling",
    difficulty: "Intermediate",
    tagline: "Automated pull-request reviewer catching N+1 queries, leaked secrets, and type regressions.",
    problemStatement:
      "Develop a developer-tooling web app and GitHub diff analyzer that inspects pull requests for security anti-patterns, secret leaks, performance bottlenecks, and outputs actionable inline review comments.",
    deliverables: [
      "Diff parser + static/LLM security & performance rule engine",
      "Interactive PR review UI accepting any public GitHub PR URL",
      "Public GitHub repo + live deployed reviewer tool",
    ],
    techStack: ["Next.js", "TypeScript", "Octokit", "AST / Tree-sitter", "Tailwind"],
    soloFee: SOLO_HACKATHON_FEE,
    teamFee: TEAM_HACKATHON_FEE,
    isActive: true,
  },
];

export function generateHackathonUniqueCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return `BM-HACK-${code}`;
}
