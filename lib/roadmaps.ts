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
  tagline: string;
  badgeColor: string;
  targetCompanies: string[];
  stages: RoadmapStage[];
}

export const ROLE_ROADMAPS: RoleRoadmap[] = [
  {
    id: "ai-ml-engineer",
    roleName: "AI & Machine Learning Systems Engineer",
    tagline: "From PyTorch internals to deterministic multi-agent state machines and WebGPU SLMs.",
    badgeColor: "text-purple-600 bg-purple-50 border-purple-200",
    targetCompanies: ["OpenAI", "Anthropic", "Cohere", "Sarvam AI", "Krutrim", "Observe.ai", "Qdrant"],
    stages: [
      {
        stageNumber: 1,
        stageName: "Foundations & Vector Representation",
        duration: "Week 1 - 2",
        focus: "PyTorch tensor operations, semantic embedding generation, similarity metrics, and basic chunking strategies.",
        coreSkills: ["PyTorch", "HuggingFace Transformers", "Sentence Transformers", "NumPy", "Vector Cosine/Dot Product"],
        deliverables: ["Custom text embedding pipeline with benchmarking against OpenAI text-embedding-3-small.", "Vector similarity search engine with NumPy from scratch."],
        recommendedProjectIds: ["multi-hop-graphrag-knowledge-topology", "sparse-dense-hybrid-qdrant-reranker"]
      },
      {
        stageNumber: 2,
        stageName: "Production RAG & Evaluation Tightening",
        duration: "Week 3 - 4",
        focus: "Hybrid sparse-dense retrieval, cross-encoder reranking, RAGAS synthetic test suites, and strict SLA benchmarking (cost/latency).",
        coreSkills: ["Qdrant / Milvus", "BM25 / Splade", "FlashRank / Cohere Rerank", "RAGAS", "Prometheus Telemetry"],
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
    id: "geospatial-defence-ai",
    roleName: "Geospatial & Defence AI Engineer",
    tagline: "Remote sensing, multi-spectral band mathematics, SAR flood mapping, and edge drone tracking.",
    badgeColor: "text-blue-600 bg-blue-50 border-blue-200",
    targetCompanies: ["IdeaForge", "Tonbo Imaging", "Zen Technologies", "Skyroot Aerospace", "MapmyIndia", "SatSure", "GalaxEye Space"],
    stages: [
      {
        stageNumber: 1,
        stageName: "Remote Sensing & Band Mathematics",
        duration: "Week 1 - 2",
        focus: "Sentinel-2 L2A optical bands (B02, B03, B04, B08), NDVI/NDWI indexing, GDAL raster processing, and GeoTIFF tiling.",
        coreSkills: ["GDAL / Rasterio", "Shapely / GeoPandas", "Sentinel-2 Multi-spectral Bands", "PySTAC API", "OpenCV"],
        deliverables: ["Automated cloud-free optical tile mosaic processor with NDVI vegetation indexing.", "GeoTIFF tile server with slippy map XYZ support."],
        recommendedProjectIds: ["multispectral-satellite-imagery-geospatial-ai", "synthetic-aperture-radar-sar-flood-detector"]
      },
      {
        stageNumber: 2,
        stageName: "Synthetic Aperture Radar (SAR) & Thermal Vision",
        duration: "Week 3 - 4",
        focus: "Sentinel-1 SAR C-band dual-polarization (VV/VH), speckle filtering (Lee filter), thresholding water masks, and FLIR thermal calibration.",
        coreSkills: ["Sentinel-1 SAR", "Lee Speckle Filtering", "FLIR Thermal LWIR", "PyTorch U-Net", "Dice Loss Optimization"],
        deliverables: ["SAR flood inundation segmentation pipeline with > 0.88 Dice coefficient.", "Thermal UAV wildfire smoke/hotspot detector."],
        recommendedProjectIds: ["synthetic-aperture-radar-sar-flood-detector", "thermal-flir-uav-wildfire-early-warning"]
      },
      {
        stageNumber: 3,
        stageName: "Edge Drone Vision & Real-Time Telemetry",
        duration: "Week 5 - 6",
        focus: "WebRTC / RTSP 1080p 60fps video ingestion, YOLOv11 TensorRT optimization, ByteTrack multi-target association, and Kalman filter trajectory.",
        coreSkills: ["WebRTC / aiortc", "TensorRT", "YOLOv11", "ByteTrack", "Kalman Filtering"],
        deliverables: ["End-to-end edge drone stream analyzer processing 60fps video with < 35ms frame latency.", "Automated target lock & GPS bounding coordinate projector."],
        recommendedProjectIds: ["autonomous-drone-webrtc-edge-vision-tracker"]
      },
      {
        stageNumber: 4,
        stageName: "Defence Procurement Readiness & Field Hardening",
        duration: "Week 7 - 8",
        focus: "GPS-denied visual odometry, offline standalone edge packaging, military-grade MIL-STD audit trails, and iDEX grant readiness.",
        coreSkills: ["Visual Odometry", "Offline Containerization", "Zero-Trust Encryption", "MIL-STD Validation", "iDEX Pitch Prep"],
        deliverables: ["Zero-dependency offline container bundle ready for field demonstration.", "Defence RFP architecture proposal document."],
        recommendedProjectIds: ["autonomous-drone-webrtc-edge-vision-tracker", "multispectral-satellite-imagery-geospatial-ai"]
      }
    ]
  },
  {
    id: "cybersecurity-pentester",
    roleName: "Cybersecurity & Autonomous Red-Team Engineer",
    tagline: "From OWASP Top 10 to autonomous multi-agent vulnerability discovery and eBPF kernel security.",
    badgeColor: "text-rose-600 bg-rose-50 border-rose-200",
    targetCompanies: ["CrowdStrike", "Palo Alto Networks", "Qualys", "Quick Heal", "TCS Cyber", "Lucideus / Safe Security", "CERT-In"],
    stages: [
      {
        stageNumber: 1,
        stageName: "Network Security & Web Application Scanning",
        duration: "Week 1 - 2",
        focus: "TCP/IP handshake analysis, OWASP Top 10 vulnerabilities, automated Burp Suite / Nuclei templating, and JWT attack vectors.",
        coreSkills: ["Wireshark", "Nuclei", "OWASP ZAP", "Python Requests / Scapy", "JWT Cryptography"],
        deliverables: ["Automated headless vulnerability scanner targeting GraphQL and REST APIs.", "Proof-of-concept exploit for Broken Object Level Authorization (BOLA)."],
        recommendedProjectIds: ["autonomous-redteam-cybersecurity-agent-swarm"]
      },
      {
        stageNumber: 2,
        stageName: "Exploit Payload Generation & Sandboxing",
        duration: "Week 3 - 4",
        focus: "Isolated Docker execution sandboxes, dynamic taint analysis, AST inspection, and payload verification loops.",
        coreSkills: ["Docker SDK", "Seccomp Profiles", "AST Parsing", "Dynamic Taint Analysis", "Python Subprocess Isolation"],
        deliverables: ["Zero-escape sandbox harness evaluating untrusted scripts in ephemeral Docker containers.", "AST-based static code analyzer detecting hardcoded credentials and SQLi."],
        recommendedProjectIds: ["autonomous-redteam-cybersecurity-agent-swarm", "kernel-ebpf-chaos-selfhealing-sentinel"]
      },
      {
        stageNumber: 3,
        stageName: "Autonomous Red-Team AI Swarms",
        duration: "Week 5 - 6",
        focus: "Multi-agent offensive security orchestration: Recon Agent -> Exploit Crafter -> Validator -> Auto-Patch Generator.",
        coreSkills: ["LangChain / LangGraph", "CVE Mitre API", "Automated Patch Generation", "Git Diff Verification"],
        deliverables: ["End-to-end swarm that ingests a target git repository, detects CVEs, verifies with reproducible test cases, and submits a patched PR.", ""],
        recommendedProjectIds: ["autonomous-redteam-cybersecurity-agent-swarm"]
      },
      {
        stageNumber: 4,
        stageName: "Kernel eBPF Probing & Zero-Trust Defense",
        duration: "Week 7 - 8",
        focus: "Rust eBPF kernel tracepoints, real-time syscall monitoring, anomaly detection, and automated pod isolation.",
        coreSkills: ["Rust aya / libbpf", "eBPF kprobes/tracepoints", "Linux Syscalls", "Kubernetes NetworkPolicies"],
        deliverables: ["Kernel-level runtime intrusion detection probe blocking unauthorized socket connections in < 5ms.", ""],
        recommendedProjectIds: ["kernel-ebpf-chaos-selfhealing-sentinel"]
      }
    ]
  },
  {
    id: "fullstack-backend-systems",
    roleName: "High-Scale Backend & Distributed Systems Engineer",
    tagline: "Event-driven microservices, Redis Streams, WebSockets, CRDTs, and low-latency API gateways.",
    badgeColor: "text-emerald-600 bg-emerald-50 border-emerald-200",
    targetCompanies: ["Razorpay", "Swiggy", "Postman", "Zerodha", "CRED", "Jio Platforms", "BrowserStack"],
    stages: [
      {
        stageNumber: 1,
        stageName: "Relational Modeling & Async APIs",
        duration: "Week 1 - 2",
        focus: "PostgreSQL schema normalization, indexing strategies (B-Tree, GIN, BRIN), query EXPLAIN ANALYZE, and async FastAPI / Go handlers.",
        coreSkills: ["PostgreSQL", "FastAPI / Node.js", "Prisma / SQLAlchemy", "EXPLAIN ANALYZE", "Docker Compose"],
        deliverables: ["High-throughput CRUD API processing 5,000 req/sec with connection pooling and p99 latency < 25ms.", ""],
        recommendedProjectIds: ["langgraph-sql-multiagent-checkpointer", "distributed-load-testing-qa-mesh"]
      },
      {
        stageNumber: 2,
        stageName: "Streaming Architecture & Pub/Sub",
        duration: "Week 3 - 4",
        focus: "Redis Streams, consumer groups, Apache Kafka event schemas, idempotent message processing, and dead-letter queues.",
        coreSkills: ["Redis Streams", "Kafka / Redpanda", "Avro / Protobuf", "Idempotency Keys", "Dead Letter Queues"],
        deliverables: ["Distributed telemetry ingestion pipeline consuming 20,000 events/sec with zero message loss.", ""],
        recommendedProjectIds: ["high-frequency-order-book-matching-engine", "streaming-fraud-detection-duckdb-feast"]
      },
      {
        stageNumber: 3,
        stageName: "Real-Time Collaboration & CRDTs",
        duration: "Week 5 - 6",
        focus: "WebSockets, Yjs CRDTs (Conflict-free Replicated Data Types), binary delta sync, and peer-to-peer WebRTC data channels.",
        coreSkills: ["WebSockets", "Yjs / Automerge CRDT", "WebRTC DataChannels", "Binary Delta Encoding"],
        deliverables: ["Real-time collaborative multiplayer canvas supporting 50 simultaneous editors with zero conflict divergence.", ""],
        recommendedProjectIds: ["webrtc-infinite-canvas-yjs-crdt"]
      },
      {
        stageNumber: 4,
        stageName: "Distributed Load Testing & Chaos Engineering",
        duration: "Week 7 - 8",
        focus: "Distributed k6 cluster orchestration (10,000 virtual users), Playwright parallel browsers, and sub-3s self-healing cloud microservices.",
        coreSkills: ["k6 Distributed", "Playwright Matrix", "GitHub Actions CI/CD", "Chaos Mesh", "Prometheus / Grafana"],
        deliverables: ["Automated CI/CD test harness simulating 10,000 concurrent checkouts and validating SLA thresholds.", ""],
        recommendedProjectIds: ["distributed-load-testing-qa-mesh", "kernel-ebpf-chaos-selfhealing-sentinel"]
      }
    ]
  },
  {
    id: "data-science-quantitative-risk",
    roleName: "Data Science & Quantitative Risk Modeler",
    tagline: "Bayesian structural time series, Monte Carlo copulas, Feast feature stores, and streaming fraud detection.",
    badgeColor: "text-amber-600 bg-amber-50 border-amber-200",
    targetCompanies: ["BlackRock", "Goldman Sachs", "Morgan Stanley", "Tiger Analytics", "Mu Sigma", "Groww", "Pine Labs"],
    stages: [
      {
        stageNumber: 1,
        stageName: "High-Performance Data Ingestion & Polars",
        duration: "Week 1 - 2",
        focus: "Polars / DuckDB columnar processing, vectorized operations, parquet partitioning, and memory-efficient aggregations.",
        coreSkills: ["Polars", "DuckDB", "Apache Parquet", "NumPy / SciPy", "Statsmodels"],
        deliverables: ["Processing 10GB financial tick-level dataset in under 4 seconds with zero memory spillover.", ""],
        recommendedProjectIds: ["bayesian-structural-time-series-monte-carlo", "streaming-fraud-detection-duckdb-feast"]
      },
      {
        stageNumber: 2,
        stageName: "Bayesian Modeling & Monte Carlo Simulation",
        duration: "Week 3 - 4",
        focus: "PyMC probabilistic programming, Markov Chain Monte Carlo (MCMC), Bayesian Structural Time Series (BSTS), and Value at Risk (VaR).",
        coreSkills: ["PyMC", "ArviZ", "BSTS Decomposition", "Copula Joint Distributions", "VaR / CVaR Calculation"],
        deliverables: ["Multi-asset risk engine generating 100,000 Monte Carlo paths with confidence intervals.", ""],
        recommendedProjectIds: ["bayesian-structural-time-series-monte-carlo"]
      },
      {
        stageNumber: 3,
        stageName: "Feature Store & Streaming Inference",
        duration: "Week 5 - 6",
        focus: "Feast feature store setup, point-in-time correct join keys, streaming sliding-window features, and LightGBM / XGBoost inference.",
        coreSkills: ["Feast", "LightGBM", "Redis Feature Cache", "Kafka Sliding Windows", "SHAP Explainability"],
        deliverables: ["Streaming fraud detection service scoring incoming transactions with < 10ms feature retrieval latency.", ""],
        recommendedProjectIds: ["streaming-fraud-detection-duckdb-feast"]
      },
      {
        stageNumber: 4,
        stageName: "Model Governance & Regulatory Stress Testing",
        duration: "Week 7 - 8",
        focus: "Model drift monitoring (PSI / KS tests), Basel III / SEBI compliance reports, automated retraining pipelines, and Grafana dashboards.",
        coreSkills: ["Evidently AI", "MLflow", "SEBI Risk Guidelines", "Prometheus Drift Exporters"],
        deliverables: ["End-to-end model observability pipeline with automated slack alerts upon distribution drift.", ""],
        recommendedProjectIds: ["bayesian-structural-time-series-monte-carlo", "streaming-fraud-detection-duckdb-feast"]
      }
    ]
  },
  {
    id: "low-latency-systems-rust",
    roleName: "Low-Latency & Kernel Systems Engineer",
    tagline: "Rust memory safety, cache-friendly data structures, sub-10ms limit order books, and eBPF probes.",
    badgeColor: "text-slate-800 bg-slate-100 border-slate-300",
    targetCompanies: ["Tower Research Capital", "Graviton Research", "AlphaGrep", "Citadel Securities", "Jump Trading", "CoinDCX"],
    stages: [
      {
        stageNumber: 1,
        stageName: "Rust Memory Safety & Zero-Cost Abstractions",
        duration: "Week 1 - 2",
        focus: "Borrow checker, lifetimes, unsafe Rust boundaries, cache line alignment, and SIMD vectorization.",
        coreSkills: ["Rust", "Cargo", "Criterion.rs Benchmarking", "Valgrind / Cachegrind", "SIMD"],
        deliverables: ["Lock-free ring buffer achieving > 10M operations/second with zero allocations in hot path.", ""],
        recommendedProjectIds: ["high-frequency-order-book-matching-engine"]
      },
      {
        stageNumber: 2,
        stageName: "L2 Limit Order Book & Price-Time Priority",
        duration: "Week 3 - 4",
        focus: "Bid/Ask price levels (BTreeMap / Arena allocators), trade execution, cancel logic, and deterministic snapshot generation.",
        coreSkills: ["L2 Order Book Design", "Arena Allocators", "Tokio Async", "WebSocket Depth Feeds"],
        deliverables: ["Matching engine processing 50,000 order cancellations and fills/second with deterministic order states.", ""],
        recommendedProjectIds: ["high-frequency-order-book-matching-engine"]
      },
      {
        stageNumber: 3,
        stageName: "Kernel eBPF Tracing & Chaos Survival",
        duration: "Week 5 - 6",
        focus: "eBPF kernel tracepoints, TCP socket drops, process memory leaks, and autonomous sub-3s self-healing microservice sentinels.",
        coreSkills: ["Rust aya / libbpf", "eBPF tracepoints", "Kubernetes Pod Eviction", "Prometheus Exporters"],
        deliverables: ["Autonomous eBPF daemon surviving 48-hour continuous chaos monkey injection with 0 unhandled failures.", ""],
        recommendedProjectIds: ["kernel-ebpf-chaos-selfhealing-sentinel"]
      },
      {
        stageNumber: 4,
        stageName: "Hardware Profiling & Production Deployment",
        duration: "Week 7 - 8",
        focus: "CPU core pinning (`taskset`), kernel bypass (DPDK/io_uring), zero-copy serialization (Cap'n Proto / FlatBuffers), and SLA verification.",
        coreSkills: ["io_uring", "FlatBuffers", "CPU Core Pinning", "Perf / Flamegraphs"],
        deliverables: ["Production benchmark report verifying p99.9 latency under 2.5ms under full load.", ""],
        recommendedProjectIds: ["high-frequency-order-book-matching-engine", "kernel-ebpf-chaos-selfhealing-sentinel"]
      }
    ]
  }
];
