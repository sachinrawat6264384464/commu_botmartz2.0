export interface RoadmapStage {
  stageNumber: number;
  stageName: string;
  duration: string;
  focus: string;
  coreSkills: string[];
  deliverables: string[];
  recommendedProjectIds: string[];
}

export interface RoleRoadmap {
  id: string;
  roleName: string;
  category: "Core Engineering" | "Product & Design" | "MBA, Business & Finance" | "Cybersecurity & Defense" | "Cross-Discipline Hybrids";
  disciplines: string[]; // for fusion matching e.g. ["Music", "Software"], ["Biology", "AI"]
  tagline: string;
  badgeColor: string;
  targetCompanies: string[];
  stages: RoadmapStage[];
}

export const ROLE_ROADMAPS: RoleRoadmap[] = [
  // ==========================================
  // 1. CORE ENGINEERING (1-15)
  // ==========================================
  {
    id: "ai-ml-engineer",
    roleName: "AI & Machine Learning Systems Engineer",
    category: "Core Engineering",
    disciplines: ["AI/ML", "Software Engineering"],
    tagline: "PyTorch tensor architectures, deterministic agent state machines, and WebGPU in-browser inference.",
    badgeColor: "text-purple-600 bg-purple-50 border-purple-200",
    targetCompanies: ["OpenAI", "Anthropic", "Cohere", "Sarvam AI", "Krutrim", "Observe.ai", "Qdrant"],
    stages: [
      {
        stageNumber: 1,
        stageName: "Foundations & Vector Representation",
        duration: "Week 1 - 2",
        focus: "PyTorch tensor operations, semantic embedding generation, similarity metrics, and chunking strategies.",
        coreSkills: ["PyTorch", "HuggingFace Transformers", "Sentence Transformers", "NumPy", "Vector Cosine/Dot Product"],
        deliverables: ["Custom text embedding pipeline with latency benchmarking.", "Vector similarity search engine with NumPy from scratch."],
        recommendedProjectIds: ["multi-hop-graphrag-knowledge-topology", "sparse-dense-hybrid-qdrant-reranker"]
      },
      {
        stageNumber: 2,
        stageName: "Production RAG & Hybrid Retrieval",
        duration: "Week 3 - 4",
        focus: "Hybrid sparse-dense retrieval, cross-encoder reranking, RAGAS synthetic test suites, and strict SLA benchmarking.",
        coreSkills: ["Qdrant", "BM25 / Splade", "FlashRank / Cohere Rerank", "RAGAS", "Prometheus Telemetry"],
        deliverables: ["Hybrid search pipeline achieving > 0.85 RAGAS Faithfulness score.", "Latency profiling report tracking p95 latency under 150ms."],
        recommendedProjectIds: ["sparse-dense-hybrid-qdrant-reranker", "monai-unetr-3d-dicom-mri-segmentation"]
      },
      {
        stageNumber: 3,
        stageName: "Stateful Multi-Agent Swarms & Checkpointing",
        duration: "Week 5 - 6",
        focus: "LangGraph cyclical state graphs, PostgreSQL checkpointing, dynamic tool schemas, and human-in-the-loop fallback controls.",
        coreSkills: ["LangGraph", "PostgreSQL Checkpointer", "Tool Calling APIs", "Asyncio Worker Pools", "OpenTelemetry"],
        deliverables: ["Deterministic multi-agent workflow with time-travel replay and zero state loss upon crash.", "Live memory-augmented agent running autonomous research."],
        recommendedProjectIds: ["langgraph-sql-multiagent-checkpointer", "autonomous-redteam-cybersecurity-agent-swarm"]
      },
      {
        stageNumber: 4,
        stageName: "Edge SLMs & WebGPU In-Browser Inference",
        duration: "Week 7 - 8",
        focus: "Model quantization (GGUF / AWQ / INT4), ONNX Runtime Web, WebGPU compute shaders, and sub-50ms local inference.",
        coreSkills: ["WebGPU", "ONNX Runtime Web", "Transformers.js", "SmolLM2 / Llama-3.2", "Quantization"],
        deliverables: ["100% client-side zero-server AI workspace running inside Chrome WebGPU shaders.", "Production packaging and cloud deploy."],
        recommendedProjectIds: ["webgpu-edge-slm-browser-inference", "webrtc-infinite-canvas-yjs-crdt"]
      }
    ]
  },
  {
    id: "full-stack-python-architect",
    roleName: "Full-Stack Python & Distributed Systems Architect",
    category: "Core Engineering",
    disciplines: ["Python", "Full Stack", "Distributed Systems"],
    tagline: "High-concurrency FastAPI microservices, Celery/Redis task engines, and Next.js frontend state.",
    badgeColor: "text-blue-600 bg-blue-50 border-blue-200",
    targetCompanies: ["Razorpay", "CRED", "Swiggy", "Postman", "Zomato", "Jio Platforms", "BrowserStack"],
    stages: [
      {
        stageNumber: 1,
        stageName: "FastAPI Core & Async Architecture",
        duration: "Week 1 - 2",
        focus: "Asynchronous I/O, Pydantic v2 validation, dependency injection, and connection pooling.",
        coreSkills: ["FastAPI", "AsyncIO", "Pydantic v2", "SQLAlchemy 2.0 Async", "PostgreSQL"],
        deliverables: ["High-throughput CRUD API handling 2,000 req/sec with async connection pooling.", "Strict OpenAPI schema validation."],
        recommendedProjectIds: ["langgraph-sql-multiagent-checkpointer", "sparse-dense-hybrid-qdrant-reranker"]
      },
      {
        stageNumber: 2,
        stageName: "Task Queues, WebSockets & Real-Time State",
        duration: "Week 3 - 4",
        focus: "Background worker queues, Redis Streams, WebSocket pub/sub broadcasting, and distributed locking.",
        coreSkills: ["Celery", "Redis Streams", "WebSockets", "Redlock Algorithm", "Background Workers"],
        deliverables: ["Distributed job orchestration system with automatic retries, dead-letter queues, and live WebSocket dashboard."],
        recommendedProjectIds: ["autonomous-drone-webrtc-edge-vision-tracker", "webrtc-infinite-canvas-yjs-crdt"]
      },
      {
        stageNumber: 3,
        stageName: "Next.js Integration & Server Actions",
        duration: "Week 5 - 6",
        focus: "Next.js App Router, SSR/SSG caching strategies, optimistic UI updates, and Tailwind CSS design systems.",
        coreSkills: ["Next.js 15", "React 19", "Server Components", "TailwindCSS", "Zustand"],
        deliverables: ["Enterprise web dashboard with zero layout shifts, optimistic mutation updates, and sub-100ms LCP."],
        recommendedProjectIds: ["webrtc-infinite-canvas-yjs-crdt", "ebpf-linux-kernel-security-probe"]
      }
    ]
  },
  {
    id: "full-stack-nodejs-architect",
    roleName: "Full-Stack Node.js & TypeScript Architect",
    category: "Core Engineering",
    disciplines: ["Node.js", "TypeScript", "WebSockets"],
    tagline: "Event-driven microservices, real-time WebSockets, CRDT state sync, and high-performance React frontends.",
    badgeColor: "text-emerald-600 bg-emerald-50 border-emerald-200",
    targetCompanies: ["Vercel", "Stripe", "Uber", "Coinbase", "Atlassian", "CleverTap", "InMobi"],
    stages: [
      {
        stageNumber: 1,
        stageName: "TypeScript Internals & Event-Loop Optimization",
        duration: "Week 1 - 2",
        focus: "Non-blocking event loop, stream processing, worker threads, and type-safe schema validation.",
        coreSkills: ["TypeScript Strict", "Node.js Streams", "Worker Threads", "Zod", "Fastify"],
        deliverables: ["High-throughput stream processing pipeline handling 100MB chunked multipart uploads with zero memory leaks."],
        recommendedProjectIds: ["webrtc-infinite-canvas-yjs-crdt", "sparse-dense-hybrid-qdrant-reranker"]
      },
      {
        stageNumber: 2,
        stageName: "CRDTs & Collaborative Real-Time Sync",
        duration: "Week 3 - 4",
        focus: "Yjs CRDT algorithms, conflict-free state resolution, WebRTC peer data channels, and undo/redo histories.",
        coreSkills: ["Yjs / Automerge", "WebRTC DataChannels", "WebSocket Multiplexing", "IndexedDB Caching"],
        deliverables: ["Multiplayer whiteboard system supporting 50 concurrent real-time editing cursors without server conflicts."],
        recommendedProjectIds: ["webrtc-infinite-canvas-yjs-crdt"]
      },
      {
        stageNumber: 3,
        stageName: "Production Containerization & Edge Deployments",
        duration: "Week 5 - 6",
        focus: "Multi-stage Docker builds, Cloudflare Workers / Edge runtime, and Prometheus / Grafana observability.",
        coreSkills: ["Docker", "Cloudflare Workers", "OpenTelemetry", "Grafana", "k6 Load Testing"],
        deliverables: ["Globally distributed edge service with sub-20ms cold starts and comprehensive Grafana telemetry."],
        recommendedProjectIds: ["rust-high-frequency-order-book-matching-engine", "ebpf-linux-kernel-security-probe"]
      }
    ]
  },
  {
    id: "low-latency-rust-engineer",
    roleName: "Low-Latency & Rust Systems Engineer",
    category: "Core Engineering",
    disciplines: ["Rust", "Systems Programming", "Low-Latency"],
    tagline: "Lock-free data structures, SIMD vectorization, cache-line alignment, and sub-microsecond matching engines.",
    badgeColor: "text-amber-700 bg-amber-50 border-amber-200",
    targetCompanies: ["Jane Street", "Tower Research Capital", "Graviton Research", "Jump Trading", "Cloudflare", "Fastly", "Polygon"],
    stages: [
      {
        stageNumber: 1,
        stageName: "Memory Safety, Ownership & Cache Locality",
        duration: "Week 1 - 2",
        focus: "Rust borrow checker, zero-cost abstractions, memory alignment (64-byte cache line boundaries), and criterion.rs micro-benchmarks.",
        coreSkills: ["Rust", "Criterion.rs", "Cache-Line Alignment", "SIMD", "Cargo Profiling"],
        deliverables: ["Lock-free Ring Buffer queue processing 10M events/sec without heap allocation in hot path."],
        recommendedProjectIds: ["rust-high-frequency-order-book-matching-engine"]
      },
      {
        stageNumber: 2,
        stageName: "Lock-Free Order Book & ITCH/OUCH Protocols",
        duration: "Week 3 - 4",
        focus: "Price-time priority matching engine, binary wire protocol parsing (NASDAQ ITCH 5.0), and ring-buffer lockless synchronization.",
        coreSkills: ["ITCH/OUCH 5.0", "Lock-Free Crossbeam", "Atomic Primitives", "SIMD Price Parsing"],
        deliverables: ["Matching engine processing 500,000 orders/sec with p99 latency < 850 nanoseconds."],
        recommendedProjectIds: ["rust-high-frequency-order-book-matching-engine"]
      },
      {
        stageNumber: 3,
        stageName: "Kernel Bypass & Zero-Copy Networking",
        duration: "Week 5 - 6",
        focus: "Linux io_uring asynchronous system calls, AF_XDP zero-copy socket interfaces, and CPU core pinning.",
        coreSkills: ["io_uring", "AF_XDP", "Taskset / CPU Pinning", "eBPF XDP"],
        deliverables: ["High-speed network packet ingest daemon running with zero syscall overhead on dedicated isolated CPU cores."],
        recommendedProjectIds: ["ebpf-linux-kernel-security-probe", "rust-high-frequency-order-book-matching-engine"]
      }
    ]
  },
  {
    id: "devops-sre-cloud-architect",
    roleName: "Cloud Infrastructure, DevOps & SRE Architect",
    category: "Core Engineering",
    disciplines: ["Cloud", "DevOps", "Kubernetes", "SRE"],
    tagline: "Terraform IaC, multi-region Kubernetes clusters, GitOps pipelines, and chaos engineering resilience.",
    badgeColor: "text-sky-600 bg-sky-50 border-sky-200",
    targetCompanies: ["AWS", "Google Cloud", "Microsoft Azure", "Datadog", "HashiCorp", "Groww", "Zepto"],
    stages: [
      {
        stageNumber: 1,
        stageName: "Infrastructure as Code & Zero-Trust Networking",
        duration: "Week 1 - 2",
        focus: "Modular Terraform, AWS VPC peering, IAM least-privilege security policies, and KMS envelope encryption.",
        coreSkills: ["Terraform", "AWS / GCP", "VPC Networking", "KMS Encryption", "IAM Role Least-Privilege"],
        deliverables: ["Multi-tier automated cloud infrastructure deployment with zero public database exposure."],
        recommendedProjectIds: ["ebpf-linux-kernel-security-probe", "langgraph-sql-multiagent-checkpointer"]
      },
      {
        stageNumber: 2,
        stageName: "Kubernetes Orchestration & Service Mesh",
        duration: "Week 3 - 4",
        focus: "EKS / GKE cluster management, Helm chart packaging, Istio mTLS service mesh, and Horizontal Pod Autoscaling (HPA).",
        coreSkills: ["Kubernetes", "Helm", "Istio Service Mesh", "ArgoCD GitOps", "HPA / KEDA"],
        deliverables: ["Production-ready Kubernetes cluster running GitOps continuous sync and canary deployments."],
        recommendedProjectIds: ["autonomous-drone-webrtc-edge-vision-tracker", "ebpf-linux-kernel-security-probe"]
      },
      {
        stageNumber: 3,
        stageName: "Observability, SLOs & Chaos Engineering",
        duration: "Week 5 - 6",
        focus: "Prometheus scraping, Grafana dashboards, Jaeger distributed tracing, and Chaos Mesh fault-injection tests.",
        coreSkills: ["Prometheus", "Grafana", "Jaeger Tracing", "Chaos Mesh", "SLO/SLI Error Budgets"],
        deliverables: ["Complete enterprise observability dashboard tracking 99.99% availability SLAs under simulated pod termination."],
        recommendedProjectIds: ["ebpf-linux-kernel-security-probe"]
      }
    ]
  },
  {
    id: "qa-automation-load-engineer",
    roleName: "QA Automation & Performance Load Testing Engineer",
    category: "Core Engineering",
    disciplines: ["QA Automation", "Testing", "Performance"],
    tagline: "Playwright E2E suites, distributed k6 stress tests for 100K users, and CI/CD quality gates.",
    badgeColor: "text-teal-600 bg-teal-50 border-teal-200",
    targetCompanies: ["BrowserStack", "Thoughtworks", "EPAM", "Accenture", "Infosys", "TCS", "Wipro"],
    stages: [
      {
        stageNumber: 1,
        stageName: "Playwright E2E Automation & Component Testing",
        duration: "Week 1 - 2",
        focus: "Page Object Model (POM), parallel browser execution, visual regression assertions, and flaky test mitigation.",
        coreSkills: ["Playwright", "TypeScript", "Page Object Model", "Visual Regression", "GitHub Actions CI"],
        deliverables: ["Comprehensive test suite covering 50 user flows with automatic video/trace recording on failure."],
        recommendedProjectIds: ["webrtc-infinite-canvas-yjs-crdt", "langgraph-sql-multiagent-checkpointer"]
      },
      {
        stageNumber: 2,
        stageName: "Distributed Load Testing & k6 Spike Simulations",
        duration: "Week 3 - 4",
        focus: "k6 distributed test harnesses, virtual user concurrency modeling, p95/p99 latency thresholds, and API stress benchmarks.",
        coreSkills: ["k6 Load Testing", "JavaScript / Go", "Latency Percentiles", "Spike / Soak Testing", "Grafana k6 Cloud"],
        deliverables: ["10,000 concurrent user load test report identifying database connection pool exhaustion bottlenecks."],
        recommendedProjectIds: ["rust-high-frequency-order-book-matching-engine", "sparse-dense-hybrid-qdrant-reranker"]
      }
    ]
  },
  {
    id: "computer-vision-edge-ai",
    roleName: "Computer Vision & Edge AI Engineer",
    category: "Core Engineering",
    disciplines: ["Computer Vision", "Edge AI", "Robotics"],
    tagline: "YOLOv11 TensorRT optimization, ByteTrack multi-target association, and sub-30ms edge inference.",
    badgeColor: "text-indigo-600 bg-indigo-50 border-indigo-200",
    targetCompanies: ["NVIDIA", "Qualcomm", "IdeaForge", "Tonbo Imaging", "Tesla", "Skydio", "Verkada"],
    stages: [
      {
        stageNumber: 1,
        stageName: "Deep Learning Vision Backbones & Object Detection",
        duration: "Week 1 - 2",
        focus: "CNNs, Vision Transformers (ViT), YOLOv11 architectural layers, and loss function tuning (CIoU / DFL).",
        coreSkills: ["PyTorch", "OpenCV", "YOLOv11", "Albumentations", "Vision Transformers"],
        deliverables: ["Custom trained high-precision object detector with mAP@50 > 0.88 on domain-specific datasets."],
        recommendedProjectIds: ["autonomous-drone-webrtc-edge-vision-tracker", "multispectral-satellite-imagery-geospatial-ai"]
      },
      {
        stageNumber: 2,
        stageName: "TensorRT Hardware Quantization & WebRTC Streams",
        duration: "Week 3 - 4",
        focus: "FP16 / INT8 calibration, TensorRT engine compilation, NVIDIA DeepStream pipelines, and WebRTC streaming.",
        coreSkills: ["TensorRT", "CUDA", "NVIDIA Jetson", "DeepStream", "WebRTC / RTSP"],
        deliverables: ["Edge inference pipeline processing 60 FPS 1080p video feed on Jetson Orin with < 25ms frame latency."],
        recommendedProjectIds: ["autonomous-drone-webrtc-edge-vision-tracker"]
      }
    ]
  },
  {
    id: "mobile-android-systems-engineer",
    roleName: "Android & Mobile Systems Engineer",
    category: "Core Engineering",
    disciplines: ["Mobile", "Android", "Kotlin"],
    tagline: "Kotlin Coroutines, Jetpack Compose, on-device ML with MediaPipe, and offline-first Room databases.",
    badgeColor: "text-green-600 bg-green-50 border-green-200",
    targetCompanies: ["Google", "PhonePe", "CRED", "Flipkart", "Meta", "Samsung", "Paytm"],
    stages: [
      {
        stageNumber: 1,
        stageName: "Jetpack Compose & Clean Architecture",
        duration: "Week 1 - 2",
        focus: "Declarative UI state management, Kotlin Coroutines / Flow, Dagger Hilt dependency injection, and MVVM / MVI architecture.",
        coreSkills: ["Kotlin", "Jetpack Compose", "Coroutines / Flow", "Dagger Hilt", "Room Database"],
        deliverables: ["Offline-first Android application with encrypted local SQLite storage and seamless background sync."],
        recommendedProjectIds: ["webrtc-infinite-canvas-yjs-crdt"]
      }
    ]
  },
  {
    id: "blockchain-smart-contract-security",
    roleName: "Blockchain & Smart Contract Security Engineer",
    category: "Core Engineering",
    disciplines: ["Web3", "Blockchain", "Smart Contracts"],
    tagline: "EVM bytecode mechanics, Solidity reentrancy defenses, Foundry testing harnesses, and zero-knowledge rollups.",
    badgeColor: "text-amber-600 bg-amber-50 border-amber-200",
    targetCompanies: ["Polygon", "ConsenSys", "Chainlink", "Uniswap Labs", "OpenZeppelin", "CoinDCX", "Binance"],
    stages: [
      {
        stageNumber: 1,
        stageName: "EVM Internals, Gas Optimization & Foundry",
        duration: "Week 1 - 2",
        focus: "Solidity inline assembly (Yul), EVM memory/storage layout, gas optimization techniques, and fuzz testing with Foundry.",
        coreSkills: ["Solidity", "Foundry", "Yul / EVM Assembly", "Slither", "Gas Profiling"],
        deliverables: ["High-efficiency liquidity vault contract audited with zero vulnerabilities and optimized gas execution."],
        recommendedProjectIds: ["rust-high-frequency-order-book-matching-engine"]
      }
    ]
  },
  {
    id: "embedded-iot-firmware-engineer",
    roleName: "Embedded Systems & IoT Firmware Engineer",
    category: "Core Engineering",
    disciplines: ["Embedded", "IoT", "C/C++", "Hardware"],
    tagline: "FreeRTOS task scheduling, SPI/I2C sensor drivers, low-power BLE, and MQTT telemetry gateways.",
    badgeColor: "text-cyan-700 bg-cyan-50 border-cyan-200",
    targetCompanies: ["Texas Instruments", "STM / STMicroelectronics", "Bosch", "Ather Energy", "Ola Electric", "Boat", "Schneider Electric"],
    stages: [
      {
        stageNumber: 1,
        stageName: "Bare-Metal Microcontrollers & FreeRTOS",
        duration: "Week 1 - 2",
        focus: "ARM Cortex-M architecture, register-level peripheral configuration (GPIO, Timers, UART), and preemptive FreeRTOS tasks.",
        coreSkills: ["C / Embedded C", "ARM Cortex-M", "FreeRTOS", "STM32CubeIDE", "SPI / I2C / CAN Bus"],
        deliverables: ["Multi-threaded firmware managing sensor sampling, ring-buffer logging, and power-saving sleep states."],
        recommendedProjectIds: ["autonomous-drone-webrtc-edge-vision-tracker"]
      }
    ]
  },

  // ==========================================
  // 2. PRODUCT MANAGEMENT & DESIGN (11-20)
  // ==========================================
  {
    id: "ai-product-manager",
    roleName: "AI & Machine Learning Product Manager",
    category: "Product & Design",
    disciplines: ["Product Management", "AI/ML", "Strategy"],
    tagline: "Defining evals, hallucination risk guardrails, cost-per-token unit economics, and AI product roadmaps.",
    badgeColor: "text-purple-700 bg-purple-50 border-purple-200",
    targetCompanies: ["Google", "Microsoft", "Notion", "Perplexity", "Glean", "Krutrim", "Freshworks"],
    stages: [
      {
        stageNumber: 1,
        stageName: "AI Opportunity Assessment & PRD Authoring",
        duration: "Week 1 - 2",
        focus: "User pain point synthesis, feasibility vs viability analysis, defining precision/recall trade-offs, and authoring technical PRDs.",
        coreSkills: ["Technical PRD Writing", "Model Feasibility Analysis", "LLM Benchmark Metrics", "User Stories", "Figma Wireframing"],
        deliverables: ["End-to-end Technical PRD for an enterprise RAG agent with SLA benchmarks, fallback heuristics, and ROI model."],
        recommendedProjectIds: ["langgraph-sql-multiagent-checkpointer", "multi-hop-graphrag-knowledge-topology"]
      },
      {
        stageNumber: 2,
        stageName: "Eval Strategy, Safety Guardrails & Token Economics",
        duration: "Week 3 - 4",
        focus: "Automated eval design (RAGAS/TruLens), human-in-the-loop escalation workflows, prompt injection guardrails, and unit economics.",
        coreSkills: ["LLM Evals", "RAGAS", "NeMo Guardrails", "Cost-per-Query Modeling", "A/B Testing"],
        deliverables: ["Product Evaluation Matrix showing hallucination rate reduction from 12% to < 1.5% with financial cost forecast."],
        recommendedProjectIds: ["sparse-dense-hybrid-qdrant-reranker", "webgpu-edge-slm-browser-inference"]
      }
    ]
  },
  {
    id: "technical-product-manager",
    roleName: "Technical Product Manager (TPM / Platform PM)",
    category: "Product & Design",
    disciplines: ["Product Management", "Backend", "APIs"],
    tagline: "API developer experience, database schema lifecycles, microservice SLAs, and developer platform adoption.",
    badgeColor: "text-blue-700 bg-blue-50 border-blue-200",
    targetCompanies: ["Stripe", "Postman", "Twilio", "AWS", "Atlassian", "Jio", "Zoho"],
    stages: [
      {
        stageNumber: 1,
        stageName: "API Contract Design & System Topology",
        duration: "Week 1 - 2",
        focus: "REST & GraphQL specification standards, rate-limiting policies, backward compatibility deprecation schedules, and OpenAPI design.",
        coreSkills: ["OpenAPI Specification", "Mermaid Architecture Diagrams", "API Monetization", "Postman Collections"],
        deliverables: ["Comprehensive Platform PRD with sequence diagrams, error code taxonomies, and developer portal documentation."],
        recommendedProjectIds: ["langgraph-sql-multiagent-checkpointer", "ebpf-linux-kernel-security-probe"]
      }
    ]
  },
  {
    id: "growth-product-manager",
    roleName: "Growth & Product-Led Growth (PLG) Manager",
    category: "Product & Design",
    disciplines: ["Product Management", "Growth", "Analytics"],
    tagline: "Funnel activation telemetry, onboarding viral loops, retention cohort analysis, and self-serve freemium conversion.",
    badgeColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
    targetCompanies: ["Canva", "Duolingo", "Miro", "Figma", "Groww", "CRED", "Zerodha"],
    stages: [
      {
        stageNumber: 1,
        stageName: "User Activation Funnels & North Star Telemetry",
        duration: "Week 1 - 2",
        focus: "Time-to-value (TTV) optimization, onboarding friction removal, event taxonomy definition, and retention curve modeling.",
        coreSkills: ["Mixpanel / PostHog", "Cohort Retention Analysis", "North Star Metric Definition", "Friction Audit"],
        deliverables: ["Product Growth Blueprint mapping user activation from signup to Day-7 retention with 4 A/B experiment proposals."],
        recommendedProjectIds: ["webrtc-infinite-canvas-yjs-crdt"]
      }
    ]
  },
  {
    id: "uiux-product-designer",
    roleName: "UI/UX Product Designer & Design Systems Architect",
    category: "Product & Design",
    disciplines: ["UI/UX Design", "Design Systems", "Figma"],
    tagline: "Component tokens, responsive micro-interactions, accessibility (WCAG 2.1 AA), and zero-layout-shift UI engineering.",
    badgeColor: "text-pink-600 bg-pink-50 border-pink-200",
    targetCompanies: ["Airbnb", "Apple", "CRED", "Figma", "Linear", "Vercel", "Razorpay"],
    stages: [
      {
        stageNumber: 1,
        stageName: "Design Tokens, Typography & Component Libraries",
        duration: "Week 1 - 2",
        focus: "Figma variable tokens, semantic color systems, dark/light contrast ratios, and accessible component architectures.",
        coreSkills: ["Figma Variables", "Design Tokens", "WCAG 2.1 AA", "Auto-Layout", "Interactive Prototyping"],
        deliverables: ["Complete 40-component Design System in Figma with auto-layout variants, micro-interaction states, and token handoff docs."],
        recommendedProjectIds: ["webrtc-infinite-canvas-yjs-crdt"]
      }
    ]
  },

  // ==========================================
  // 3. MBA, BUSINESS STRATEGY & QUANT (21-30)
  // ==========================================
  {
    id: "quant-finance-algo-trader",
    roleName: "Quantitative Finance & Algorithmic Trading Strategist",
    category: "MBA, Business & Finance",
    disciplines: ["Finance", "Python", "Mathematics", "Quant"],
    tagline: "Statistical arbitrage, order-flow imbalance modeling, backtesting engines with slippage, and Sharpe ratio optimization.",
    badgeColor: "text-amber-800 bg-amber-50 border-amber-200",
    targetCompanies: ["WorldQuant", "Millennium Management", "Two Sigma", "Citadel", "AlphaGrep", "Quadeye", "D.E. Shaw"],
    stages: [
      {
        stageNumber: 1,
        stageName: "Financial Econometrics & Time-Series Statistics",
        duration: "Week 1 - 2",
        focus: "Stationarity tests (ADF/KPSS), cointegration, GARCH volatility modeling, and risk-adjusted metrics (Sharpe/Sortino/Max Drawdown).",
        coreSkills: ["Python (NumPy / Pandas)", "Statsmodels", "GARCH Models", "Cointegration Testing", "Backtesting"],
        deliverables: ["Statistical arbitrage pairs-trading backtesting engine with realistic transaction costs and slippage simulation."],
        recommendedProjectIds: ["statistical-econometric-copula-risk-engine", "rust-high-frequency-order-book-matching-engine"]
      },
      {
        stageNumber: 2,
        stageName: "Extreme Value Theory & Copula Tail Risk",
        duration: "Week 3 - 4",
        focus: "Clayton/Gumbel Archimedean Copulas, Conditional Value at Risk (CVaR), and Basel III stress testing simulation.",
        coreSkills: ["Copula Modeling", "Value at Risk (VaR)", "Monte Carlo Simulation", "Portfolio Optimization"],
        deliverables: ["Non-linear multi-asset portfolio risk engine calculating CVaR under simulated Lehman/COVID crash scenarios."],
        recommendedProjectIds: ["statistical-econometric-copula-risk-engine"]
      }
    ]
  },
  {
    id: "product-marketing-manager",
    roleName: "Product Marketing Manager (PMM)",
    category: "MBA, Business & Finance",
    disciplines: ["Marketing", "Strategy", "MBA", "Product"],
    tagline: "Go-to-market (GTM) strategy, ICP messaging frameworks, competitive battlecards, and customer win/loss analysis.",
    badgeColor: "text-rose-600 bg-rose-50 border-rose-200",
    targetCompanies: ["HubSpot", "Salesforce", "Snowflake", "Zoho", "Freshworks", "Postman", "MongoDB"],
    stages: [
      {
        stageNumber: 1,
        stageName: "ICP Persona Mapping & Positioning Strategy",
        duration: "Week 1 - 2",
        focus: "Ideal Customer Profile (ICP) definition, value proposition matrix, feature-to-benefit mapping, and competitor battlecards.",
        coreSkills: ["Positioning Frameworks", "Competitor Battlecards", "Messaging Hierarchy", "Customer Interviews"],
        deliverables: ["Full Enterprise GTM Launch Dossier with positioning statements, one-page sales battlecards, and email nurture sequences."],
        recommendedProjectIds: ["langgraph-sql-multiagent-checkpointer"]
      }
    ]
  },
  {
    id: "tech-strategy-operations-manager",
    roleName: "Tech Strategy & Business Operations Manager (BizOps)",
    category: "MBA, Business & Finance",
    disciplines: ["Business Strategy", "MBA", "Operations", "Analytics"],
    tagline: "Unit economics decomposition, operational bottleneck resolution, cross-functional OKR alignment, and executive reporting.",
    badgeColor: "text-indigo-700 bg-indigo-50 border-indigo-200",
    targetCompanies: ["McKinsey & Company", "Boston Consulting Group (BCG)", "Bain & Company", "Swiggy", "Zomato", "Uber", "CRED"],
    stages: [
      {
        stageNumber: 1,
        stageName: "Financial Modeling & Unit Economics Teardown",
        duration: "Week 1 - 2",
        focus: "LTV/CAC ratio sensitivity modeling, contribution margin breakdown, cohort lifetime value forecasting, and EBITDA modeling.",
        coreSkills: ["Financial Modeling (Excel)", "Unit Economics", "SQL Querying", "Cohort Analysis", "Executive Presentations"],
        deliverables: ["3-Statement Financial Operating Model for a high-growth SaaS startup with dynamic sensitivity scenarios."],
        recommendedProjectIds: ["statistical-econometric-copula-risk-engine"]
      }
    ]
  },
  {
    id: "venture-capital-analyst",
    roleName: "Venture Capital & Early-Stage Tech Investment Analyst",
    category: "MBA, Business & Finance",
    disciplines: ["Venture Capital", "Finance", "MBA", "Tech Analysis"],
    tagline: "Market sizing (TAM/SAM/SOM), deep tech due diligence, cap table modeling, and founder investment memos.",
    badgeColor: "text-purple-800 bg-purple-50 border-purple-200",
    targetCompanies: ["Sequoia Capital / Peak XV", "Accel", "Lightspeed Venture Partners", "Blume Ventures", "Matrix Partners", "Nexus VP"],
    stages: [
      {
        stageNumber: 1,
        stageName: "Deep Tech Market Mapping & Investment Memo Authoring",
        duration: "Week 1 - 2",
        focus: "Bottom-up TAM calculation, competitive moat analysis (network effects / switching costs), and IC memo writing.",
        coreSkills: ["Investment Memo Writing", "TAM/SAM/SOM Modeling", "Cap Table Math", "Technical Due Diligence"],
        deliverables: ["5-Page Investment Committee (IC) Memo evaluating an AI Infrastructure seed-stage startup with valuation math."],
        recommendedProjectIds: ["multi-hop-graphrag-knowledge-topology", "webgpu-edge-slm-browser-inference"]
      }
    ]
  },

  // ==========================================
  // 4. CYBERSECURITY & DEFENSE (31-38)
  // ==========================================
  {
    id: "cybersecurity-redteam-engineer",
    roleName: "Cybersecurity & Autonomous Red-Team Engineer",
    category: "Cybersecurity & Defense",
    disciplines: ["Cybersecurity", "Pen-testing", "Zero-Trust"],
    tagline: "Autonomous vulnerability exploitation, OWASP Top 10, SSRF/IDOR hunting, and LLM prompt injection defenses.",
    badgeColor: "text-rose-700 bg-rose-50 border-rose-200",
    targetCompanies: ["CrowdStrike", "Palo Alto Networks", "Mandiant", "HackerOne", "Bugcrowd", "Tenable", "Wiz"],
    stages: [
      {
        stageNumber: 1,
        stageName: "Web Application Pen-Testing & OWASP Exploitation",
        duration: "Week 1 - 2",
        focus: "SQL Injection, SSRF cloud metadata exfiltration, Broken Object Level Auth (BOLA/IDOR), and JWT signature tampering.",
        coreSkills: ["Burp Suite Professional", "OWASP Top 10", "JWT Vulnerabilities", "SSRF / IDOR", "Python Requests Exploits"],
        deliverables: ["Full Pen-testing Report detailing 5 verified vulnerability findings with reproducible PoC payloads and CVSS scores."],
        recommendedProjectIds: ["autonomous-redteam-cybersecurity-agent-swarm", "ebpf-linux-kernel-security-probe"]
      },
      {
        stageNumber: 2,
        stageName: "LLM Security, Prompt Injection & Agent Jailbreaks",
        duration: "Week 3 - 4",
        focus: "Indirect prompt injections, tool-call hijacking, ASCII smuggling, guardrail circumvention, and data exfiltration vectors.",
        coreSkills: ["Prompt Injection", "Garak LLM Scanner", "PyRIT", "Tool-Calling Hijack", "NeMo Guardrails"],
        deliverables: ["Automated agentic penetration test suite attacking multi-step agent tools with remediation patches."],
        recommendedProjectIds: ["autonomous-redteam-cybersecurity-agent-swarm"]
      }
    ]
  },
  {
    id: "ebpf-kernel-security-architect",
    roleName: "eBPF Linux Kernel & Zero-Trust Security Architect",
    category: "Cybersecurity & Defense",
    disciplines: ["Linux Kernel", "eBPF", "C/Rust", "Security"],
    tagline: "Kernel tracepoints, kprobes/kretprobes, ring buffer ring-0 monitoring, and container escape detection.",
    badgeColor: "text-slate-800 bg-slate-100 border-slate-300",
    targetCompanies: ["Isovalent / Cisco", "Sysdig", "Datadog", "Red Hat", "Aqua Security", "Canonical", "Google Cloud"],
    stages: [
      {
        stageNumber: 1,
        stageName: "eBPF Program Lifecycle & Verifier Invariants",
        duration: "Week 1 - 2",
        focus: "eBPF bytecode verifier rules, BPF CO-RE (Compile Once Run Everywhere), kprobes on sys_execve, and perf event ring buffers.",
        coreSkills: ["C / Rust (Aya)", "eBPF / libbpf", "BPF CO-RE", "Kernel Tracepoints", "Linux Syscalls"],
        deliverables: ["High-speed kernel probe monitoring all process execution events with zero user-space latency penalty."],
        recommendedProjectIds: ["ebpf-linux-kernel-security-probe"]
      }
    ]
  },

  // ==========================================
  // 5. CROSS-DISCIPLINE & HYBRID ROLES (39-50)
  // ==========================================
  {
    id: "acoustic-audio-dsp-engineer",
    roleName: "Acoustic & Audio DSP Engineer (Music + Tech)",
    category: "Cross-Discipline Hybrids",
    disciplines: ["Music", "Audio", "DSP", "Software Engineering"],
    tagline: "Digital signal processing, Fast Fourier Transforms (FFT), spatial audio rendering, and real-time audio plugin development.",
    badgeColor: "text-fuchsia-600 bg-fuchsia-50 border-fuchsia-200",
    targetCompanies: ["Spotify", "Dolby Laboratories", "Sennheiser", "Native Instruments", "Apple Music", "Bose", "JBL"],
    stages: [
      {
        stageNumber: 1,
        stageName: "Fourier Analysis, Spectrograms & Filter Design",
        duration: "Week 1 - 2",
        focus: "Discrete Fourier Transform (DFT/FFT), STFT time-frequency analysis, IIR/FIR filter design, and audio buffer management in C++.",
        coreSkills: ["C++ / JUCE", "Python Librosa / Scipy", "FFT / STFT", "IIR/FIR Digital Filters", "Audio Buffers"],
        deliverables: ["Real-time audio visualizer & parametric EQ VST plugin processing 48kHz audio streams with < 5ms latency."],
        recommendedProjectIds: ["webgpu-edge-slm-browser-inference"]
      },
      {
        stageNumber: 2,
        stageName: "Neural Audio Synthesis & Spatial HRTF Acoustics",
        duration: "Week 3 - 4",
        focus: "Head-Related Transfer Functions (HRTF), binaural 3D audio convolution, and neural audio codecs (EnCodec / SoundStream).",
        coreSkills: ["HRTF 3D Convolution", "Neural Audio Codecs", "PyTorch Audio", "Spatial Audio Rendering"],
        deliverables: ["Spatial 3D binaural sound rendering engine positioning multiple moving sound sources in 3D space."],
        recommendedProjectIds: ["webgpu-edge-slm-browser-inference"]
      }
    ]
  },
  {
    id: "bioinformatics-computational-biology",
    roleName: "Bioinformatics & Computational Biology Engineer (Biology + AI)",
    category: "Cross-Discipline Hybrids",
    disciplines: ["Biology", "Genomics", "AI/ML", "Data Science"],
    tagline: "DNA/RNA sequence alignment, AlphaFold protein structure analysis, single-cell RNA-seq, and CRISPR target prediction.",
    badgeColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
    targetCompanies: ["Illumina", "Schrodinger", "Deep Genomics", "Strand Life Sciences", "MedGenome", "AstraZeneca", "Genentech"],
    stages: [
      {
        stageNumber: 1,
        stageName: "Genomic Sequence Alignment & Variant Calling",
        duration: "Week 1 - 2",
        focus: "FASTA/FASTQ parsing, Burrows-Wheeler Transform (BWA), Smith-Waterman alignment, and VCF variant calling pipelines.",
        coreSkills: ["BioPython", "BWA / Samtools", "VCF Variant Calling", "Nextflow / Snakemake", "Genomic Algorithms"],
        deliverables: ["Automated DNA variant detection pipeline identifying pathogenic single-nucleotide polymorphisms (SNPs)."],
        recommendedProjectIds: ["monai-unetr-3d-dicom-mri-segmentation"]
      },
      {
        stageNumber: 2,
        stageName: "Protein Folding & Molecular Graph Neural Networks",
        duration: "Week 3 - 4",
        focus: "PDB file processing, 3D molecular graphs (PyTorch Geometric), equivariant neural networks, and binding affinity scoring.",
        coreSkills: ["PyTorch Geometric", "BioPandas / RDKit", "Molecular GNNs", "ESM-2 / AlphaFold Models"],
        deliverables: ["Graph neural network predicting small-molecule drug binding affinity to target viral proteins."],
        recommendedProjectIds: ["monai-unetr-3d-dicom-mri-segmentation", "multi-hop-graphrag-knowledge-topology"]
      }
    ]
  },
  {
    id: "computational-neuroscience-bci",
    roleName: "Computational Neuroscience & BCI Engineer (Neuroscience + AI)",
    category: "Cross-Discipline Hybrids",
    disciplines: ["Neuroscience", "BCI", "Signal Processing", "AI/ML"],
    tagline: "EEG signal decoding, brain-computer interface (BCI) motor imagery classification, and spiking neural networks.",
    badgeColor: "text-violet-700 bg-violet-50 border-violet-200",
    targetCompanies: ["Neuralink", "Kernel", "Blackrock Neurotech", "Emotiv", "NeuroSky", "NIMHANS Research"],
    stages: [
      {
        stageNumber: 1,
        stageName: "EEG Preprocessing, Artifact Removal & Wavelet Transforms",
        duration: "Week 1 - 2",
        focus: "Raw EEG bandpass filtering (Delta, Theta, Alpha, Beta, Gamma), Independent Component Analysis (ICA), and continuous wavelets.",
        coreSkills: ["MNE-Python", "ICA Artifact Removal", "Wavelet Transform", "Common Spatial Patterns (CSP)"],
        deliverables: ["Real-time EEG motor-imagery decoder achieving > 82% classification accuracy across 4 imagined limb movements."],
        recommendedProjectIds: ["monai-unetr-3d-dicom-mri-segmentation"]
      }
    ]
  },
  {
    id: "spatial-computing-xr-architect",
    roleName: "Spatial Computing & XR Systems Architect (3D + Hardware + AI)",
    category: "Cross-Discipline Hybrids",
    disciplines: ["3D/XR", "Spatial Computing", "Computer Graphics", "Hardware"],
    tagline: "Apple Vision Pro visionOS, WebXR, Gaussian Splatting rendering, 6DoF hand-tracking, and spatial audio sync.",
    badgeColor: "text-blue-800 bg-blue-50 border-blue-200",
    targetCompanies: ["Apple", "Meta Reality Labs", "Unity Technologies", "Epic Games", "Magic Leap", "Snap Inc"],
    stages: [
      {
        stageNumber: 1,
        stageName: "3D Gaussian Splatting & WebXR Real-Time Shaders",
        duration: "Week 1 - 2",
        focus: "Volumetric 3D scene reconstruction, Gaussian Splat rasterization in WebGPU, 6DoF ray-marching, and spatial anchors.",
        coreSkills: ["Three.js / WebXR", "WebGPU Shaders", "3D Gaussian Splatting", "visionOS / Swift", "Spatial Anchors"],
        deliverables: ["WebGPU-powered in-browser spatial viewer rendering 1M Gaussian splats at 90 FPS with hand-gesture navigation."],
        recommendedProjectIds: ["webgpu-edge-slm-browser-inference", "webrtc-infinite-canvas-yjs-crdt"]
      }
    ]
  },
  {
    id: "generative-media-creative-technologist",
    roleName: "Generative Media & Creative Technologist (Art + AI)",
    category: "Cross-Discipline Hybrids",
    disciplines: ["Art & Design", "Generative AI", "Creative Tech", "Media"],
    tagline: "Diffusion model LoRA fine-tuning, ControlNet conditioning, ComfyUI custom nodes, and procedural real-time visuals.",
    badgeColor: "text-rose-600 bg-rose-50 border-rose-200",
    targetCompanies: ["Runway ML", "Midjourney", "Adobe", "Stability AI", "Canva", "Luma AI", "Pika Labs"],
    stages: [
      {
        stageNumber: 1,
        stageName: "Diffusion Internals, LoRA Training & ComfyUI Nodes",
        duration: "Week 1 - 2",
        focus: "Latent Diffusion architecture, Cross-Attention layers, LoRA weight fine-tuning on custom artistic styles, and ComfyUI custom nodes.",
        coreSkills: ["PyTorch Diffusers", "ComfyUI", "LoRA / ControlNet", "CUDA", "FastAPI Serving"],
        deliverables: ["End-to-end generative design workstation producing style-consistent 4K rendering assets with ControlNet depth conditioning."],
        recommendedProjectIds: ["webgpu-edge-slm-browser-inference"]
      }
    ]
  },
  {
    id: "clean-energy-bms-engineer",
    roleName: "Clean Energy & EV Battery Management Engineer (Renewables + Firmware)",
    category: "Cross-Discipline Hybrids",
    disciplines: ["Clean Energy", "EV/Automotive", "Firmware", "Physics"],
    tagline: "Lithium-ion State of Charge (SoC/SoH) Kalman estimation, thermal runaway modeling, and CAN bus telemetry.",
    badgeColor: "text-emerald-800 bg-emerald-50 border-emerald-200",
    targetCompanies: ["Tesla", "Ather Energy", "Ola Electric", "Tata Motors EV", "Exide Energy", "Enphase Energy"],
    stages: [
      {
        stageNumber: 1,
        stageName: "Battery Physics, Equivalent Circuit Models & Extended Kalman Filter",
        duration: "Week 1 - 2",
        focus: "Thevenin equivalent battery circuit, OCV-SoC lookup calibration, Extended Kalman Filter (EKF) estimation, and cell balancing.",
        coreSkills: ["C / Embedded", "Extended Kalman Filter (EKF)", "State of Charge (SoC)", "CAN Bus J1939", "MATLAB / Simulink"],
        deliverables: ["Firmware module estimating battery pack SoC with < 1.5% error under rapid dynamic acceleration discharge profiles."],
        recommendedProjectIds: ["autonomous-drone-webrtc-edge-vision-tracker"]
      }
    ]
  },
  {
    id: "precision-agritech-iot-engineer",
    roleName: "Precision Agritech & IoT Systems Engineer (Agriculture + IoT)",
    category: "Cross-Discipline Hybrids",
    disciplines: ["Agriculture", "IoT", "Sensors", "Data Science"],
    tagline: "LoRaWAN soil sensor meshes, NDVI multispectral crop stress detection, and automated smart irrigation valves.",
    badgeColor: "text-lime-700 bg-lime-50 border-lime-200",
    targetCompanies: ["DeHaat", "CropIn", "Fasal", "John Deere", "Bayer CropScience", "Netafim"],
    stages: [
      {
        stageNumber: 1,
        stageName: "LoRaWAN Mesh Telemetry & Soil Sensor Integration",
        duration: "Week 1 - 2",
        focus: "Long-range LoRaWAN telemetry (868/915 MHz), capacitive soil moisture & NPK nutrient sensors, low-power sleep cycles.",
        coreSkills: ["LoRa / LoRaWAN", "ChirpStack", "MQTT", "ESP32 / Low-Power", "TimescaleDB"],
        deliverables: ["Distributed farm sensor network transmitting moisture/temperature data over 5km with solar battery endurance."],
        recommendedProjectIds: ["multispectral-satellite-imagery-geospatial-ai"]
      }
    ]
  },
  {
    id: "semiconductor-riscv-verification",
    roleName: "Semiconductor RTL & RISC-V Verification Engineer (Hardware + RTL)",
    category: "Cross-Discipline Hybrids",
    disciplines: ["Semiconductors", "Hardware", "RISC-V", "Verilog"],
    tagline: "SystemVerilog UVM testbenches, RV32I pipeline hazard simulation, formal verification, and FPGA emulation.",
    badgeColor: "text-amber-900 bg-amber-50 border-amber-200",
    targetCompanies: ["Intel", "AMD", "Qualcomm", "ARM", "SiFive", "Mindgrove Technologies", "Ineda Systems"],
    stages: [
      {
        stageNumber: 1,
        stageName: "RISC-V RV32I 5-Stage Pipeline Design & Hazard Unit",
        duration: "Week 1 - 2",
        focus: "Instruction decode, ALU operations, data forwarding hazard detection, branch prediction, and Verilator cycle-accurate simulation.",
        coreSkills: ["SystemVerilog", "Verilator", "RISC-V RV32I ISA", "GTKWave", "UVM Testbench"],
        deliverables: ["Cycle-accurate 5-stage RISC-V processor executing C benchmarks with full hazard forwarding in Verilator."],
        recommendedProjectIds: ["ebpf-linux-kernel-security-probe"]
      }
    ]
  },
  {
    id: "govtech-dpi-system-architect",
    roleName: "GovTech & Digital Public Infrastructure (DPI) Architect (Civic + Systems)",
    category: "Cross-Discipline Hybrids",
    disciplines: ["GovTech", "Public Policy", "DPI", "Distributed Systems"],
    tagline: "Beckn protocol decentralization, Aadhaar/ABDM consent-based data sharing, and million-QPS state architectures.",
    badgeColor: "text-orange-800 bg-orange-50 border-orange-200",
    targetCompanies: ["ONDC", "NPCI", "UIDAI", "EkStep Foundation", "Sahamati", "FIDE", "Thoughtworks Gov"],
    stages: [
      {
        stageNumber: 1,
        stageName: "Beckn Protocol Specifications & Decoupled BAP/BPP Gateways",
        duration: "Week 1 - 2",
        focus: "Beckn open protocol schema (search, init, confirm, track), cryptographic signing (Ed25519), and asynchronous webhook orchestration.",
        coreSkills: ["Beckn Protocol", "Ed25519 Signing", "Async Webhooks", "PostgreSQL Sharding", "Redis Lock"],
        deliverables: ["Decentralized mobility booking gateway implementing Beckn protocol compliance with sub-100ms discovery response."],
        recommendedProjectIds: ["langgraph-sql-multiagent-checkpointer"]
      }
    ]
  },
  {
    id: "legaltech-ai-compliance-architect",
    roleName: "LegalTech & AI Regulatory Compliance Architect (Law + Tech)",
    category: "Cross-Discipline Hybrids",
    disciplines: ["Law", "LegalTech", "AI Governance", "Compliance"],
    tagline: "Automated clause extraction, EU AI Act risk classification, DPDP consent tracking, and contract graph lineage.",
    badgeColor: "text-slate-700 bg-slate-100 border-slate-300",
    targetCompanies: ["Ironclad", "Robin AI", "Harvey AI", "Cyril Amarchand Mangaldas", "Shardul Amarchand Mangaldas", "PwC"],
    stages: [
      {
        stageNumber: 1,
        stageName: "Legal Entity Extraction & Contract Graph Lineage",
        duration: "Week 1 - 2",
        focus: "Named Entity Recognition for legal clauses (Indemnity, Force Majeure, IP Assignment), contract hierarchy parsing, and Neo4j graphs.",
        coreSkills: ["Legal NLP (SpaCy / LLMs)", "Neo4j Graph Database", "DPDP Act 2023 Rules", "JSON-LD Schemas"],
        deliverables: ["Contract clause extraction & risk-auditing pipeline highlighting non-compliant liability clauses automatically."],
        recommendedProjectIds: ["multi-hop-graphrag-knowledge-topology"]
      }
    ]
  },
  {
    id: "edtech-cognitive-learning-architect",
    roleName: "EdTech & Cognitive Learning Sciences Architect (Education + AI)",
    category: "Cross-Discipline Hybrids",
    disciplines: ["Education", "Cognitive Science", "AI/ML", "Product"],
    tagline: "Spaced repetition algorithms (SM-2 / FSRS), knowledge tracing graphs, and adaptive student difficulty calibrators.",
    badgeColor: "text-yellow-800 bg-yellow-50 border-yellow-200",
    targetCompanies: ["Duolingo", "Khan Academy", "Coursera", "PhysicsWallah", "Unacademy", "Quizlet"],
    stages: [
      {
        stageNumber: 1,
        stageName: "Bayesian Knowledge Tracing & Memory Decay Models",
        duration: "Week 1 - 2",
        focus: "Free Spaced Repetition Scheduler (FSRS), Bayesian Knowledge Tracing (BKT), item response theory (IRT), and student mastery graphs.",
        coreSkills: ["FSRS / SM-2 Algorithms", "Bayesian Statistics", "Graph Neural Networks", "Next.js UI"],
        deliverables: ["Adaptive learning engine calculating personalized optimal review intervals with > 90% retention accuracy."],
        recommendedProjectIds: ["multi-hop-graphrag-knowledge-topology"]
      }
    ]
  },
  {
    id: "medical-robotics-surgical-ai",
    roleName: "Medical Robotics & Surgical Vision AI Engineer (Healthcare + Robotics)",
    category: "Cross-Discipline Hybrids",
    disciplines: ["Healthcare", "Robotics", "Computer Vision", "Biomedical"],
    tagline: "Endoscopic surgical instrument tracking, 3D point-cloud organ registration, and sub-millimeter trajectory planning.",
    badgeColor: "text-red-700 bg-red-50 border-red-200",
    targetCompanies: ["Intuitive Surgical", "Medtronic", "Stryker", "Johnson & Johnson MedTech", "Siemens Healthineers"],
    stages: [
      {
        stageNumber: 1,
        stageName: "Endoscopic Video Instrument Segmentation & Depth Estimation",
        duration: "Week 1 - 2",
        focus: "MONAI surgical video backbones, monocular depth estimation, point-cloud organ deformation, and latency-critical vision loops.",
        coreSkills: ["MONAI / PyTorch", "Point Cloud Library (PCL)", "OpenCV", "ROS 2", "CUDA C++"],
        deliverables: ["Real-time surgical tool tracking pipeline running on 1080p endoscopic video at 60 FPS with < 1mm spatial error."],
        recommendedProjectIds: ["monai-unetr-3d-dicom-mri-segmentation", "autonomous-drone-webrtc-edge-vision-tracker"]
      }
    ]
  }
];
