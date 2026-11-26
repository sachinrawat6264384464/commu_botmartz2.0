export interface ManagedWorkshop {
  id: string;
  slug: string;
  title: string;
  category: string;
  tagline: string;
  description: string;
  imageUrl: string;
  whatYouWillBuild: string[];
  curriculum: string[];
  instructor: string;
  scheduleDate: string;
  duration: string;
  mode: string;
  price: number;
  isPaid: boolean;
  seatsLimit: number;
  registrationCount: number;
  joinLink?: string;
  status: "UPCOMING" | "LIVE" | "COMPLETED";
  createdAt: number;
  updatedAt: number;
}

export interface WorkshopRegistration {
  registrationId: string;
  workshopId: string;
  workshopTitle: string;
  name: string;
  email: string;
  phone: string;
  organization: string;
  experienceLevel: string;
  amountPaid: number;
  currency: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  paymentStatus: "PAID" | "FREE";
  ticketCode: string;
  registeredAt: number;
}

export const DEFAULT_WORKSHOPS: ManagedWorkshop[] = [
  {
    id: "ws-python-prod",
    slug: "python-production-engineering",
    title: "Python Production Engineering Workshop",
    category: "Python & Backend",
    tagline: "Master async FastAPI services, Pydantic v2 validation, background workers, and clean packaging.",
    description:
      "Move beyond Jupyter scripts into production-grade Python backend systems. You will build a high-concurrency FastAPI service with structured logging, retry queues, and automated pytest suites.",
    imageUrl: "https://res.cloudinary.com/dnafnxfsf/image/upload/v1795735060/botmartz-workshops/ws-python-prod.jpg",
    whatYouWillBuild: [
      "Async FastAPI microservice with rate limiting & Pydantic v2 schemas",
      "Background task worker with idempotent retries & structured telemetry",
      "Pytest + Dockerized production deployment pipeline",
    ],
    curriculum: [
      "Asyncio internals, connection pooling & FastAPI dependency injection",
      "Schema-first API design, error contracts & memory profiling",
      "Testing, Docker optimization & live deployment walkthrough",
    ],
    instructor: "Soham Sharma",
    scheduleDate: "Every Saturday • 6:00 PM IST",
    duration: "3 Hours Live",
    mode: "Live Online + Q&A",
    price: 699,
    isPaid: true,
    seatsLimit: 100,
    registrationCount: 0,
    joinLink: "",
    status: "UPCOMING",
    createdAt: 1756000001000,
    updatedAt: 1756000001000,
  },
  {
    id: "ws-rag-arch",
    slug: "production-rag-architecture",
    title: "Production RAG Architecture Workshop",
    category: "RAG & Search",
    tagline: "Build Hybrid BM25 + Dense Vector retrieval with Reciprocal Rank Fusion and citation grounding.",
    description:
      "Learn why basic naive RAG fails in enterprise production and how to engineer a deterministic hybrid retrieval pipeline with semantic chunking, cross-encoder reranking, and strict citation verification.",
    imageUrl: "https://res.cloudinary.com/dnafnxfsf/image/upload/v1795735061/botmartz-workshops/ws-rag-arch.jpg",
    whatYouWillBuild: [
      "Hybrid BM25 + dense vector retrieval engine with Reciprocal Rank Fusion",
      "Cross-encoder reranking stage for high-precision context windows",
      "Inline page-citation grounding & hallucination guardrail layer",
    ],
    curriculum: [
      "Document ingestion, layout-aware chunking & metadata indexing",
      "Hybrid search scoring, RRF tuning & reranker latency optimization",
      "RAGAS faithfulness benchmarks & production deployment",
    ],
    instructor: "Dr. Promit Ray",
    scheduleDate: "Sunday • 5:00 PM IST",
    duration: "3.5 Hours Live",
    mode: "Live Online + Repo",
    price: 699,
    isPaid: true,
    seatsLimit: 100,
    registrationCount: 0,
    joinLink: "",
    status: "UPCOMING",
    createdAt: 1756000002000,
    updatedAt: 1756000002000,
  },
  {
    id: "ws-agentic-rag",
    slug: "agentic-rag-multi-agent",
    title: "Agentic RAG & Multi-Agent Workflows",
    category: "Agents & LangGraph",
    tagline: "Engineer stateful tool-calling agents, query routing, self-correction loops, and persistent memory.",
    description:
      "Combine autonomous reasoning agents with enterprise retrieval. You will construct a stateful LangGraph agent workflow capable of query decomposition, tool retries, and human-in-the-loop checkpoints.",
    imageUrl: "https://res.cloudinary.com/dnafnxfsf/image/upload/v1795735062/botmartz-workshops/ws-agentic-rag.svg",
    whatYouWillBuild: [
      "Stateful LangGraph orchestrator with deterministic checkpoints",
      "Self-correcting query router & multi-source tool execution",
      "Safe tool fallback & timeout recovery architecture",
    ],
    curriculum: [
      "Agent state machines vs. fragile prompt chains",
      "Tool-calling contracts, memory persistence & loop prevention",
      "Live debugging & latency tracing for multi-agent graphs",
    ],
    instructor: "Soham Sharma",
    scheduleDate: "Wednesday • 8:00 PM IST",
    duration: "3 Hours Live",
    mode: "Live Online + Q&A",
    price: 699,
    isPaid: true,
    seatsLimit: 100,
    registrationCount: 0,
    joinLink: "",
    status: "UPCOMING",
    createdAt: 1756000003000,
    updatedAt: 1756000003000,
  },
  {
    id: "ws-career-roadmap",
    slug: "tech-career-system-roadmap",
    title: "Tech Career & System Design Roadmap",
    category: "Career Roadmap",
    tagline: "Actionable 2026 engineering roadmap: portfolio systems, resume positioning, and interview strategy.",
    description:
      "Stop guessing what recruiters and engineering founders actually evaluate. Get a clear role-by-role execution roadmap covering system design, GitHub proof-of-work, and live resume teardowns.",
    imageUrl: "https://res.cloudinary.com/dnafnxfsf/image/upload/v1795735064/botmartz-workshops/ws-career-roadmap.svg",
    whatYouWillBuild: [
      "Personalized 90-day engineering skill & project execution roadmap",
      "Recruiter-ready resume & GitHub portfolio structure",
      "System design interview defense & cold outreach playbook",
    ],
    curriculum: [
      "What hiring managers filter for in AI, Backend & Full-Stack resumes",
      "Selecting company-grade projects that stand out immediately",
      "Live Q&A + personalized career path teardown",
    ],
    instructor: "Soham Sharma",
    scheduleDate: "Saturday • 4:00 PM IST",
    duration: "2.5 Hours Live",
    mode: "Live Online + Audit",
    price: 699,
    isPaid: true,
    seatsLimit: 120,
    registrationCount: 0,
    joinLink: "",
    status: "UPCOMING",
    createdAt: 1756000004000,
    updatedAt: 1756000004000,
  },
  {
    id: "ws-ml-systems",
    slug: "end-to-end-ml-systems",
    title: "End-to-End Machine Learning Systems",
    category: "Machine Learning",
    tagline: "From feature pipelines and model training to quantized serving, drift checks, and API scaling.",
    description:
      "Bridge the gap between notebook accuracy and live ML serving. Build an end-to-end machine learning pipeline with reproducible feature stores, model versioning, and low-latency inference APIs.",
    imageUrl: "https://res.cloudinary.com/dnafnxfsf/image/upload/v1795735066/botmartz-workshops/ws-ml-systems.svg",
    whatYouWillBuild: [
      "Reproducible feature engineering & model training pipeline",
      "Fast inference API server with batching & latency monitoring",
      "Automated data drift & model regression alert checks",
    ],
    curriculum: [
      "Data leakage prevention, validation splits & baseline benchmarking",
      "Model serialization (ONNX / PyTorch) & serving optimization",
      "Production monitoring, A/B rollout & CI/CD for ML",
    ],
    instructor: "Dr. Promit Ray",
    scheduleDate: "Sunday • 7:00 PM IST",
    duration: "3.5 Hours Live",
    mode: "Live Online + Code",
    price: 699,
    isPaid: true,
    seatsLimit: 100,
    registrationCount: 0,
    joinLink: "",
    status: "UPCOMING",
    createdAt: 1756000005000,
    updatedAt: 1756000005000,
  },
  {
    id: "ws-prompt-evals",
    slug: "applied-prompt-engineering-evals",
    title: "Applied Prompt Engineering & Evals",
    category: "Prompt & Evals",
    tagline: "Structured JSON outputs, systematic prompt optimization, injection defense & automated eval gates.",
    description:
      "Treat prompts like production code. Master deterministic JSON schema enforcement, chain-of-thought calibration, prompt-injection defense, and automated regression evaluation pipelines.",
    imageUrl: "https://res.cloudinary.com/dnafnxfsf/image/upload/v1795735069/botmartz-workshops/ws-prompt-evals.jpg",
    whatYouWillBuild: [
      "Schema-enforced structured output pipeline with automatic repair",
      "Golden dataset & automated LLM-as-a-Judge evaluation suite",
      "Prompt injection & PII redaction security middleware",
    ],
    curriculum: [
      "Prompt architecture patterns: system contracts, few-shot & rubrics",
      "Designing quantitative eval metrics for accuracy & cost",
      "Red-teaming prompts against jailbreaks & edge-case drift",
    ],
    instructor: "Soham Sharma",
    scheduleDate: "Friday • 7:30 PM IST",
    duration: "2.5 Hours Live",
    mode: "Live Online + Labs",
    price: 699,
    isPaid: true,
    seatsLimit: 100,
    registrationCount: 0,
    joinLink: "",
    status: "UPCOMING",
    createdAt: 1756000006000,
    updatedAt: 1756000006000,
  },
];
