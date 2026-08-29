export interface ProblemStatement {
  title: string;
  bottleneck: string;
  promptIdea: string;
  recommendedStack: string[];
}

export interface EcosystemDossier {
  id: string;
  name: string;
  icon: string;
  tagline: string;
  buyerLandscape: string;
  manufacturingLandscape: string;
  governmentGrants: { name: string; link: string; grantAmount: string; description: string }[];
  targetCompanies: { name: string; domain: string; careerLink: string }[];
  unsolvedProblems: ProblemStatement[];
  matchingProjectIds: string[];
}

export const INDUSTRY_ECOSYSTEMS: EcosystemDossier[] = [
  {
    id: "defence-aerospace-uav",
    name: "Defence, Aerospace & UAV Tech",
    icon: "🛰️",
    tagline: "High-security edge computing, satellite remote sensing, GPS-denied drone vision, and private defence manufacturing.",
    buyerLandscape: "Indian Armed Forces (Army, Navy, Air Force), DRDO, ISRO, Ministry of Defence (MoD), Coast Guard, Paramilitary Forces.",
    manufacturingLandscape: "Private defence manufacturers (Zen Tech, Tonbo Imaging, IdeaForge, Solar Industries, Tata Advanced Systems, Bharat Forge, Alpha Design). Private companies build subsystems, but the primary single buyer is the government or global exports.",
    governmentGrants: [
      {
        name: "iDEX (Innovations for Defence Excellence)",
        link: "https://idex.gov.in",
        grantAmount: "Up to ₹1.5 Cr to ₹10 Cr (SPARK Grant)",
        description: "Govt funding for startups and student innovators solving specific challenges for Army/Navy/Air Force."
      },
      {
        name: "DRDO TDF (Technology Development Fund)",
        link: "https://tdf.drdo.gov.in",
        grantAmount: "Up to ₹10 Cr or 90% project cost",
        description: "Promotes indigenous defense design and prototypes for critical military systems."
      },
      {
        name: "ISRO RESPOND & In-SPACe Seed Fund",
        link: "https://www.inspace.gov.in",
        grantAmount: "Up to ₹1 Cr",
        description: "Grants for space tech, satellite image analytics, and autonomous payload processing."
      }
    ],
    targetCompanies: [
      { name: "Tonbo Imaging", domain: "Thermal FLIR Vision & Electro-Optics", careerLink: "https://tonboimaging.com/careers" },
      { name: "IdeaForge", domain: "UAV Platforms & Drone Surveillance", careerLink: "https://ideaforge.co.in" },
      { name: "Zen Technologies", domain: "Combat Simulation & Drone Defense", careerLink: "https://zentechnologies.com" },
      { name: "Skyroot Aerospace", domain: "Launch Vehicles & Space Propulsion", careerLink: "https://skyroot.in" },
      { name: "SatSure", domain: "Satellite Geospatial Intelligence", careerLink: "https://satsure.co" },
      { name: "GalaxEye Space", domain: "Multi-Sensor SAR + Optical Satellites", careerLink: "https://galaxeye.space" }
    ],
    unsolvedProblems: [
      {
        title: "Autonomous Drone Vision Under Electronic Jamming (GPS-Denied)",
        bottleneck: "Drones operating near borders suffer from GNSS jamming and cannot rely on GPS waypoints or cloud connections. They need purely visual/inertial edge odometry.",
        promptIdea: "Build a TensorRT-accelerated edge pipeline that fuses WebRTC camera frames with ByteTrack visual odometry to maintain accurate geo-coordinates without GPS.",
        recommendedStack: ["PyTorch", "TensorRT", "YOLOv11", "ByteTrack", "WebRTC / aiortc"]
      },
      {
        title: "SAR + Optical Satellite Band Alignment for All-Weather Surveillance",
        bottleneck: "Optical satellite sensors (Sentinel-2) are blinded by monsoon cloud cover, while Synthetic Aperture Radar (SAR) is speckly and difficult for non-radar analysts to interpret.",
        promptIdea: "Build a multi-modal U-Net model that takes Sentinel-1 C-band SAR and generates synthetic cloud-free optical ground moisture and flood maps.",
        recommendedStack: ["Sentinel-1 SAR", "GDAL / Rasterio", "PyTorch U-Net", "Qdrant Spatial HNSW"]
      },
      {
        title: "Thermal LWIR Micro-Fire & Hotspot Detection at 60fps",
        bottleneck: "FLIR thermal cameras produce 14-bit radiometric raw frames where heat blooms create massive false positives in sunny terrains.",
        promptIdea: "Design a calibrated temperature thresholding & spatial clustering engine that extracts wildfire flame cores with zero false positives.",
        recommendedStack: ["OpenCV", "FLIR Radiometric SDK", "NumPy", "FastAPI"]
      }
    ],
    matchingProjectIds: [
      "multispectral-satellite-imagery-geospatial-ai",
      "synthetic-aperture-radar-sar-flood-detector",
      "autonomous-drone-webrtc-edge-vision-tracker",
      "thermal-flir-uav-wildfire-early-warning"
    ]
  },
  {
    id: "govtech-public-sector-mous",
    name: "GovTech, Public Sector & National MOUs",
    icon: "🏛️",
    tagline: "Digital Public Infrastructure (DPI), ONDC protocols, DigiLocker integration, multi-lingual Bhashini speech DSP, and smart governance.",
    buyerLandscape: "MeitY, NPCI, UIDAI, Digital India Corporation, Smart Cities Mission, Ministry of Agriculture, State e-Governance Societies.",
    manufacturingLandscape: "System integrators (NIC, CDAC, TCS, Infosys, Wipro, L&T Infotech) and GovTech startups building on open DPI rails.",
    governmentGrants: [
      {
        name: "MeitY TIDE 2.0 & GenAI Innovation Challenge",
        link: "https://meitystartuphub.in",
        grantAmount: "₹4 Lakh to ₹25 Lakh (EiR & Grant)",
        description: "Support for student and early-stage builders developing indigenous deep-tech solutions for public governance."
      },
      {
        name: "NIDHI-EIR (DST National Initiative)",
        link: "https://nidhi-eir.in",
        grantAmount: "₹30,000/month fellowship for 12 months",
        description: "Direct government fellowship grant to build innovative tech prototypes without financial stress."
      },
      {
        name: "ONDC Open Innovation Challenge",
        link: "https://ondc.org",
        grantAmount: "Bounties up to ₹15 Lakh",
        description: "Open protocol bounties for buyer/seller app interoperability and catalog search."
      }
    ],
    targetCompanies: [
      { name: "CDAC (Centre for Development of Advanced Computing)", domain: "Supercomputing & Language Tech", careerLink: "https://cdac.in" },
      { name: "NPCI (National Payments Corporation of India)", domain: "UPI, IMPS, CBDC Infrastructure", careerLink: "https://npci.org.in" },
      { name: "Setu (Pine Labs)", domain: "Account Aggregator & DigiLocker APIs", careerLink: "https://setu.co" },
      { name: "Sarvam AI", domain: "Indic Large Language Models & Speech", careerLink: "https://sarvam.ai" },
      { name: "Krutrim", domain: "Indigenous AI Cloud Infrastructure", careerLink: "https://olakrutrim.com" }
    ],
    unsolvedProblems: [
      {
        title: "Multi-Dialect Indic Speech Recognition in Noisy Rural Contexts",
        bottleneck: "Standard ASR models fail when farmers speak blended regional dialects (e.g. Malwi-Hindi, Bhojpuri) in background tractor noise.",
        promptIdea: "Build a low-latency Complex U-Net speech enhancement model trained to scrub background agricultural noise before feeding into Bhashini ASR.",
        recommendedStack: ["PyTorch", "Complex U-Net", "Bhashini API", "FastAPI"]
      },
      {
        title: "Zero-Leakage Cryptographic Verification of Govt Scheme Credentials",
        bottleneck: "Citizens frequently have to upload raw Aadhaar/Pan scans, exposing PII and risking identity fraud across government welfare portals.",
        promptIdea: "Design a Zero-Knowledge Proof (ZKP) verification gateway where users prove eligibility (income < limit, resident of state) without sharing raw identity numbers.",
        recommendedStack: ["Rust", "Zero-Knowledge SNARKs", "DigiLocker API", "Next.js"]
      }
    ],
    matchingProjectIds: [
      "realtime-audio-dsp-complex-unet-speech",
      "webrtc-infinite-canvas-yjs-crdt",
      "sparse-dense-hybrid-qdrant-reranker"
    ]
  },
  {
    id: "clinical-healthcare-ai",
    name: "Clinical Healthcare & Biomedical Diagnostics",
    icon: "🏥",
    tagline: "3D Volumetric DICOM segmentation, FHIR interoperability, ABDM compliance, and genomic variant discovery.",
    buyerLandscape: "Hospital chains (Apollo, Fortis, Max), Diagnostic Networks (Dr. Lal Pathlabs, Metropolis), Ayushman Bharat Digital Mission (ABDM), Health Insurance payers.",
    manufacturingLandscape: "HealthTech SaaS, medical device manufacturers (Siemens Healthineers, GE Healthcare, Philips, Agilus Diagnostics, Qure.ai).",
    governmentGrants: [
      {
        name: "BIRAC BIG (Biotechnology Ignition Grant)",
        link: "https://birac.nic.in",
        grantAmount: "Up to ₹50 Lakh",
        description: "Flagship grant for biomedical diagnostics, medical imaging AI, and digital healthcare prototypes."
      },
      {
        name: "ICMR Innovation Grant",
        link: "https://icmr.gov.in",
        grantAmount: "Up to ₹25 Lakh",
        description: "Funds medical validation of algorithms on clinical cohorts."
      }
    ],
    targetCompanies: [
      { name: "Qure.ai", domain: "Deep Learning Medical Imaging", careerLink: "https://qure.ai/careers" },
      { name: "SigTuple", domain: "Automated Digital Microscopy", careerLink: "https://sigtuple.com" },
      { name: "HealthifyMe", domain: "Metabolic AI & Nutrition Diagnostics", careerLink: "https://healthifyme.com" },
      { name: "GE Healthcare India", domain: "Diagnostic Imaging Devices & PACS", careerLink: "https://gehealthcare.in" }
    ],
    unsolvedProblems: [
      {
        title: "Sub-Second 3D MRI/CT Volumetric Lesion Segmentation",
        bottleneck: "Standard 3D CNNs are memory-prohibitive and take 30+ seconds per CT volume, preventing real-time surgical guidance.",
        promptIdea: "Train a MONAI UNETR model using sliding-window inference with mixed precision to segment brain tumors in < 2 seconds with Dice > 0.85.",
        recommendedStack: ["MONAI", "PyTorch", "SimpleITK / pydicom", "TorchScript"]
      },
      {
        title: "Genomic Variant Pathogenicity Scoring on High-Dimension VCFs",
        bottleneck: "Whole Genome Sequencing outputs millions of variants; clinical geneticists struggle to filter benign polymorphisms from critical oncogenic mutations.",
        promptIdea: "Build an automated XGBoost + SHAP pipeline that parses multi-gigabyte VCF files and predicts ACMG pathogenicity classes.",
        recommendedStack: ["XGBoost", "BioPython", "DuckDB", "Streamlit"]
      }
    ],
    matchingProjectIds: [
      "monai-unetr-3d-dicom-mri-segmentation",
      "vcf-genomic-variant-pathogenicity-xgboost"
    ]
  },
  {
    id: "high-frequency-fintech",
    name: "High-Frequency FinTech & Capital Markets",
    icon: "⚡",
    tagline: "Sub-millisecond L2 order matching, real-time risk engines, SEBI algo compliance, and streaming fraud prevention.",
    buyerLandscape: "Stock Exchanges (NSE, BSE, MCX), Clearing Corporations, Registered Stock Brokers, Asset Management Companies (AMCs), Prop Trading Desks.",
    manufacturingLandscape: "Financial infrastructure providers, trading terminal vendors, algotrading platforms, banking core systems.",
    governmentGrants: [
      {
        name: "IFSCA FinTech Incentive Scheme (GIFT City)",
        link: "https://ifsca.gov.in",
        grantAmount: "Up to ₹75 Lakh",
        description: "Grants for developing cutting-edge financial algorithms and global exchange infrastructure in GIFT City."
      },
      {
        name: "RBI Innovation Hub (RBIH)",
        link: "https://rbihub.in",
        grantAmount: "Incubation & Cohort Funding",
        description: "Funding for financial inclusion, fraud detection, and high-security payment rails."
      }
    ],
    targetCompanies: [
      { name: "Zerodha / Rainmatter", domain: "Retail & Algo Brokerage Infrastructure", careerLink: "https://zerodha.com" },
      { name: "Tower Research Capital", domain: "High-Frequency Quantitative Trading", careerLink: "https://tower-research.com" },
      { name: "Razorpay", domain: "Payment Gateway & Banking Neobank", careerLink: "https://razorpay.com" },
      { name: "CRED", domain: "High-Throughput Financial Ledgers", careerLink: "https://cred.club" },
      { name: "Groww", domain: "Mutual Funds & Equities Platform", careerLink: "https://groww.in" }
    ],
    unsolvedProblems: [
      {
        title: "Sub-10ms Limit Order Book Execution Under High Volatility",
        bottleneck: "During market opening bell or RBI rate announcements, order burst rates surge 50x, causing lock contention in memory books.",
        promptIdea: "Implement a lock-free Rust L2 Limit Order Book using arena memory allocators and price-time priority queues handling 50k ops/sec.",
        recommendedStack: ["Rust", "Tokio", "BTreeMap", "Redis Streams", "WebSocket"]
      },
      {
        title: "Real-Time Streaming Fraud Scoring with Sub-5ms Feature Store",
        bottleneck: "Batch fraud detection is too slow; transactions must be evaluated in-flight before the bank authorization webhook times out.",
        promptIdea: "Design a Feast + DuckDB streaming feature pipeline that calculates sliding-window velocity metrics with < 3ms P99 retrieval latency.",
        recommendedStack: ["Feast", "DuckDB", "Redis", "LightGBM", "Kafka"]
      }
    ],
    matchingProjectIds: [
      "high-frequency-order-book-matching-engine",
      "streaming-fraud-detection-duckdb-feast",
      "bayesian-structural-time-series-monte-carlo"
    ]
  },
  {
    id: "cybersecurity-critical-infrastructure",
    name: "Enterprise Cybersecurity & Critical Infrastructure",
    icon: "🛡️",
    tagline: "Autonomous red-team swarms, kernel eBPF runtime tracing, CERT-In compliance, and zero-trust perimeter defense.",
    buyerLandscape: "National Critical Information Infrastructure (NCIIPC), CERT-In, Power Grids, Telecommunications (Jio, Airtel), Banks & Fintechs.",
    manufacturingLandscape: "Cybersecurity MDR providers, vulnerability management firms, secure cloud infrastructure vendors.",
    governmentGrants: [
      {
        name: "Cybersecurity Grand Challenge (MeitY / DSCI)",
        link: "https://dsci.in",
        grantAmount: "Up to ₹1 Cr Prize Fund",
        description: "National competition to build indigenous cybersecurity products across malware detection, hardware security, and OS protection."
      }
    ],
    targetCompanies: [
      { name: "Safe Security", domain: "Cyber Risk Quantification & Threat Telemetry", careerLink: "https://safe.security" },
      { name: "Qualys", domain: "Enterprise Vulnerability Management", careerLink: "https://qualys.com" },
      { name: "CrowdStrike India", domain: "Endpoint Protection & Threat Hunting", careerLink: "https://crowdstrike.com" },
      { name: "Jio Platforms Cyber Defense", domain: "Telco & Critical Cloud Security", careerLink: "https://jio.com" }
    ],
    unsolvedProblems: [
      {
        title: "Autonomous CVE Discovery & Exploit Verification Swarms",
        bottleneck: "Static analysis generates 90% false positive alerts; human security teams spend days manually crafting repro payloads.",
        promptIdea: "Build an autonomous multi-agent AI swarm that clones git repos, writes automated exploit test harnesses inside isolated Docker containers, and generates auto-patch PRs.",
        recommendedStack: ["Python", "Docker SDK", "LangGraph", "CVE Mitre API", "Git"]
      },
      {
        title: "Kernel eBPF Autonomous Microservice Self-Healing Under Chaos",
        bottleneck: "Distributed cloud microservices experience transient socket drops and memory leaks that take minutes for cloud alerts to detect.",
        promptIdea: "Implement a Rust eBPF probe daemon that listens to Linux syscalls and triggers sub-3s pod restarts with zero downtime.",
        recommendedStack: ["Rust", "aya / libbpf", "eBPF tracepoints", "Prometheus"]
      }
    ],
    matchingProjectIds: [
      "autonomous-redteam-cybersecurity-agent-swarm",
      "kernel-ebpf-chaos-selfhealing-sentinel"
    ]
  }
];
