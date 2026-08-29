export interface ProblemStatement {
  title: string;
  bottleneck: string;
  promptIdea: string;
  recommendedStack: string[];
}

export interface EcosystemDossier {
  id: string;
  name: string;
  category: "Deep Tech & Defence" | "Public Sector & Infrastructure" | "Enterprise & Finance" | "Healthcare & Life Sciences" | "Industrial & Supply Chain";
  tagline: string;
  marketOverview: string;
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
    name: "Defence, Aerospace & UAV Systems",
    category: "Deep Tech & Defence",
    tagline: "High-security edge computing, satellite remote sensing, GPS-denied drone vision, and private defence manufacturing.",
    marketOverview: "India's defence sector has transitioned toward private indigenization with positive indigenization lists and DAP 2020. The single major buyer is the Indian Armed Forces / MoD, while private OEMs build subsystems.",
    buyerLandscape: "Indian Armed Forces (Army, Navy, Air Force), DRDO, ISRO, Ministry of Defence (MoD), Coast Guard, Paramilitary Forces.",
    manufacturingLandscape: "Private manufacturers (Zen Technologies, Tonbo Imaging, IdeaForge, Solar Industries, Tata Advanced Systems, Bharat Forge, Alpha Design Technologies, Astra Microwave).",
    governmentGrants: [
      {
        name: "iDEX (Innovations for Defence Excellence)",
        link: "https://idex.gov.in",
        grantAmount: "₹1.5 Crore to ₹10 Crore (SPARK / DISC)",
        description: "Direct grant funding for startups and student engineering teams solving specific operational challenges for the Army, Navy, and Air Force."
      },
      {
        name: "DRDO Technology Development Fund (TDF)",
        link: "https://tdf.drdo.gov.in",
        grantAmount: "Up to ₹10 Crore (90% project cost)",
        description: "Promotes indigenous defense design, prototype fabrication, and military-standard qualification."
      },
      {
        name: "IN-SPACe Seed Fund & ISRO RESPOND",
        link: "https://www.inspace.gov.in",
        grantAmount: "Up to ₹1 Crore",
        description: "Non-dilutive grants for satellite payload processing, earth observation algorithms, and orbital telemetry."
      }
    ],
    targetCompanies: [
      { name: "Tonbo Imaging", domain: "Thermal FLIR Vision & Electro-Optics", careerLink: "https://tonboimaging.com/careers" },
      { name: "IdeaForge", domain: "UAV Platforms & Drone Surveillance", careerLink: "https://ideaforge.co.in" },
      { name: "Zen Technologies", domain: "Combat Simulation & Drone Defense", careerLink: "https://zentechnologies.com" },
      { name: "Skyroot Aerospace", domain: "Launch Vehicles & Space Propulsion", careerLink: "https://skyroot.in" },
      { name: "SatSure", domain: "Satellite Geospatial Intelligence", careerLink: "https://satsure.co" },
      { name: "GalaxEye Space", domain: "SAR + Multi-Spectral Satellites", careerLink: "https://galaxeye.space" }
    ],
    unsolvedProblems: [
      {
        title: "Autonomous Drone Visual Odometry Under Electronic Jamming",
        bottleneck: "Drones operating in border environments suffer from GNSS jamming and cannot rely on GPS waypoints or cloud connections. They require purely visual-inertial edge odometry.",
        promptIdea: "Build a TensorRT-accelerated edge pipeline that fuses WebRTC video frames with ByteTrack visual odometry to maintain accurate relative geo-coordinates without GNSS.",
        recommendedStack: ["PyTorch", "TensorRT", "YOLOv11", "ByteTrack", "WebRTC / aiortc"]
      },
      {
        title: "SAR and Optical Satellite Band Alignment for All-Weather Surveillance",
        bottleneck: "Optical satellite sensors (Sentinel-2) are blinded by dense monsoon cloud cover, while Synthetic Aperture Radar (SAR) contains speckle noise and requires specialized interpretation.",
        promptIdea: "Build a multi-modal U-Net model that takes Sentinel-1 C-band SAR and generates synthetic cloud-free optical ground moisture and flood maps.",
        recommendedStack: ["Sentinel-1 SAR", "GDAL / Rasterio", "PyTorch U-Net", "Qdrant Spatial HNSW"]
      },
      {
        title: "Radiometric Thermal LWIR Micro-Fire Detection at 60fps",
        bottleneck: "FLIR thermal cameras produce 14-bit radiometric raw frames where high ambient temperatures cause false positive alarms in arid terrains.",
        promptIdea: "Design a calibrated temperature thresholding and spatial clustering engine that isolates wildfire flame cores with zero false positives.",
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
    id: "govtech-digital-public-infrastructure",
    name: "GovTech, Digital Public Infrastructure & National MOUs",
    category: "Public Sector & Infrastructure",
    tagline: "Open network protocols (ONDC), DigiLocker zero-knowledge proofs, Indic speech DSP (Bhashini), and smart governance.",
    marketOverview: "India's Digital Public Infrastructure (DPI) model (India Stack, ONDC, ABDM, Bhashini) enables sovereign open protocols where public rails power private sector innovation.",
    buyerLandscape: "Ministry of Electronics and Information Technology (MeitY), NPCI, UIDAI, Digital India Corporation, Smart Cities Mission, State e-Governance Societies.",
    manufacturingLandscape: "System integrators (NIC, CDAC, TCS, Infosys, Wipro, L&T Infotech) and specialized GovTech protocol startups.",
    governmentGrants: [
      {
        name: "MeitY TIDE 2.0 & GenAI Innovation Fellowship",
        link: "https://meitystartuphub.in",
        grantAmount: "₹4 Lakh to ₹25 Lakh (EiR & Prototype Grant)",
        description: "Support for student and early-stage engineering teams developing indigenous software solutions for public service delivery."
      },
      {
        name: "NIDHI-EIR (DST National Initiative)",
        link: "https://nidhi-eir.in",
        grantAmount: "₹30,000 / month for 12 months",
        description: "Government fellowship grant allowing student innovators to build prototypes with zero financial friction."
      },
      {
        name: "ONDC Open Innovation Protocol Bounties",
        link: "https://ondc.org",
        grantAmount: "Bounties up to ₹15 Lakh",
        description: "Developer rewards for open-source adapter modules, buyer-app protocols, and multi-lingual catalog search."
      }
    ],
    targetCompanies: [
      { name: "CDAC", domain: "Supercomputing & Language Technologies", careerLink: "https://cdac.in" },
      { name: "NPCI", domain: "UPI, IMPS, CBDC & National Rails", careerLink: "https://npci.org.in" },
      { name: "Setu (Pine Labs)", domain: "Account Aggregator & DigiLocker APIs", careerLink: "https://setu.co" },
      { name: "Sarvam AI", domain: "Indic Large Language Models & Speech", careerLink: "https://sarvam.ai" },
      { name: "Krutrim", domain: "Indigenous AI Cloud Infrastructure", careerLink: "https://olakrutrim.com" }
    ],
    unsolvedProblems: [
      {
        title: "Multi-Dialect Indic Speech Recognition in High-Noise Environments",
        bottleneck: "Standard ASR models degrade rapidly when citizens speak mixed regional dialects (e.g., Malwi-Hindi, Bhojpuri) in background acoustic noise.",
        promptIdea: "Build a low-latency Complex U-Net speech enhancement model trained to isolate vocal formants before feeding into Bhashini ASR pipelines.",
        recommendedStack: ["PyTorch", "Complex U-Net", "Bhashini API", "FastAPI"]
      },
      {
        title: "Zero-Knowledge Proof Verification for Government Scheme Eligibility",
        bottleneck: "Citizens upload raw Aadhaar and income certificates to untrusted portals, exposing PII and violating data minimization principles.",
        promptIdea: "Design a Zero-Knowledge Proof verification gateway where beneficiaries prove eligibility without disclosing raw identification numbers.",
        recommendedStack: ["Rust", "zk-SNARKs", "DigiLocker API", "Next.js"]
      }
    ],
    matchingProjectIds: [
      "realtime-audio-dsp-complex-unet-speech",
      "webrtc-infinite-canvas-yjs-crdt",
      "sparse-dense-hybrid-qdrant-reranker"
    ]
  },
  {
    id: "clinical-healthcare-biomedical",
    name: "Clinical Healthcare & Biomedical Diagnostics",
    category: "Healthcare & Life Sciences",
    tagline: "3D volumetric DICOM segmentation, ABDM FHIR interoperability, clinical NLP, and genomic variant discovery.",
    marketOverview: "The Ayushman Bharat Digital Mission (ABDM) mandates standardized electronic health records (EHR) and FHIR standards. Clinical AI demand is surging across radiology, pathology, and genomics.",
    buyerLandscape: "Hospital chains (Apollo, Fortis, Max, Manipal), Diagnostic Networks (Dr. Lal Pathlabs, Metropolis), ABDM National Health Authority, Health Insurance TPAs.",
    manufacturingLandscape: "Medical device manufacturers (Siemens Healthineers, GE Healthcare, Philips, Agilus Diagnostics, Qure.ai).",
    governmentGrants: [
      {
        name: "BIRAC Biotechnology Ignition Grant (BIG)",
        link: "https://birac.nic.in",
        grantAmount: "Up to ₹50 Lakh",
        description: "India's flagship non-dilutive grant for biomedical diagnostic prototypes, medical imaging software, and clinical AI algorithms."
      },
      {
        name: "ICMR Medical Innovation Fund",
        link: "https://icmr.gov.in",
        grantAmount: "Up to ₹25 Lakh",
        description: "Supports clinical validation trials and algorithmic accuracy validation on multi-center hospital datasets."
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
        bottleneck: "Standard 3D convolutions require substantial GPU VRAM and take 30+ seconds per CT scan, preventing real-time surgical guidance.",
        promptIdea: "Train a MONAI UNETR transformer using sliding-window mixed precision inference to segment brain lesions in < 2 seconds with Dice > 0.85.",
        recommendedStack: ["MONAI", "PyTorch", "SimpleITK / pydicom", "TorchScript"]
      },
      {
        title: "Genomic Variant Pathogenicity Classification on High-Dimension VCFs",
        bottleneck: "Whole Genome Sequencing outputs millions of variants; clinical geneticists lack automated tooling to isolate pathogenic mutations from benign polymorphisms.",
        promptIdea: "Build an automated XGBoost + SHAP explainability pipeline that parses multi-gigabyte VCF files and predicts ACMG pathogenicity tiers.",
        recommendedStack: ["XGBoost", "BioPython", "DuckDB", "Streamlit"]
      }
    ],
    matchingProjectIds: [
      "monai-unetr-3d-dicom-mri-segmentation",
      "vcf-genomic-variant-pathogenicity-xgboost"
    ]
  },
  {
    id: "capital-markets-high-frequency-fintech",
    name: "Capital Markets & High-Frequency FinTech",
    category: "Enterprise & Finance",
    tagline: "Sub-millisecond L2 order matching, real-time risk engines, SEBI algo compliance, and streaming fraud prevention.",
    marketOverview: "India's equity and derivatives market (NSE) leads global exchange volumes. Stringent SEBI algo-trading regulations and GIFT City IFSCA incentives create huge demand for low-latency systems engineers.",
    buyerLandscape: "Stock Exchanges (NSE, BSE, MCX), Clearing Corporations, Registered Stock Brokers, Asset Management Companies (AMCs), Prop Trading Desks.",
    manufacturingLandscape: "Financial technology providers, algorithmic trading vendors, high-throughput banking ledger architects.",
    governmentGrants: [
      {
        name: "IFSCA FinTech Incentive Scheme (GIFT City)",
        link: "https://ifsca.gov.in",
        grantAmount: "Up to ₹75 Lakh",
        description: "Grants for developing cutting-edge financial algorithms and global exchange infrastructure in Gujarat International Finance Tec-City."
      },
      {
        name: "Reserve Bank Innovation Hub (RBIH)",
        link: "https://rbihub.in",
        grantAmount: "Cohort Grants & Incubation",
        description: "Support for low-latency security rails, fraud mitigation, and next-generation payment infrastructure."
      }
    ],
    targetCompanies: [
      { name: "Zerodha / Rainmatter", domain: "Brokerage Infrastructure & Capital Rails", careerLink: "https://zerodha.com" },
      { name: "Tower Research Capital", domain: "High-Frequency Quantitative Trading", careerLink: "https://tower-research.com" },
      { name: "Razorpay", domain: "Payment Gateway & Banking Neobank", careerLink: "https://razorpay.com" },
      { name: "CRED", domain: "High-Throughput Financial Ledgers", careerLink: "https://cred.club" },
      { name: "Groww", domain: "Mutual Funds & Equities Platform", careerLink: "https://groww.in" }
    ],
    unsolvedProblems: [
      {
        title: "Sub-10ms Limit Order Book Execution Under High Volatility",
        bottleneck: "During market opening bursts or monetary policy releases, order rates surge 50x, causing memory allocator lock contention in order matching engines.",
        promptIdea: "Implement a lock-free Rust L2 Limit Order Book using arena memory allocators and price-time priority queues handling 50k ops/sec.",
        recommendedStack: ["Rust", "Tokio", "BTreeMap", "Redis Streams", "WebSocket"]
      },
      {
        title: "Real-Time Streaming Fraud Scoring with Sub-5ms Feature Retrieval",
        bottleneck: "Batch fraud analytics are too slow; incoming payment transactions must be evaluated in-flight before the bank authorization webhook expires.",
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
    name: "Cybersecurity & Critical Infrastructure Defense",
    category: "Deep Tech & Defence",
    tagline: "Autonomous red-team swarms, kernel eBPF runtime tracing, CERT-In compliance, and zero-trust perimeter defense.",
    marketOverview: "Strict CERT-In directives mandate 6-hour incident reporting and strict log retention. Critical sectors (power, banking, telecom) require autonomous runtime vulnerability discovery and patching.",
    buyerLandscape: "National Critical Information Infrastructure Protection Centre (NCIIPC), CERT-In, Power Grid Corporation, Telecom Operators, Scheduled Commercial Banks.",
    manufacturingLandscape: "Managed Detection & Response (MDR) providers, vulnerability management firms, secure cloud infrastructure vendors.",
    governmentGrants: [
      {
        name: "Cybersecurity Grand Challenge (MeitY / DSCI)",
        link: "https://dsci.in",
        grantAmount: "Up to ₹1 Crore Prize Fund",
        description: "National initiative to build indigenous cybersecurity products across malware discovery, hardware trust, and OS security."
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
        title: "Autonomous CVE Discovery and Exploit Verification Swarms",
        bottleneck: "Static analysis generates a 90% false positive alert volume; human security engineers spend days crafting reproducible exploit proof-of-concepts.",
        promptIdea: "Build an autonomous multi-agent AI swarm that clones git repositories, writes automated exploit test harnesses inside isolated Docker containers, and generates pull-request patches.",
        recommendedStack: ["Python", "Docker SDK", "LangGraph", "CVE Mitre API", "Git"]
      },
      {
        title: "Kernel eBPF Microservice Self-Healing Under Chaos",
        bottleneck: "Distributed cloud microservices experience transient socket drops and memory leaks that take minutes for cloud alerts to detect.",
        promptIdea: "Implement a Rust eBPF probe daemon that listens to Linux syscalls and triggers sub-3s pod restarts with zero downtime.",
        recommendedStack: ["Rust", "aya / libbpf", "eBPF tracepoints", "Prometheus"]
      }
    ],
    matchingProjectIds: [
      "autonomous-redteam-cybersecurity-agent-swarm",
      "kernel-ebpf-chaos-selfhealing-sentinel"
    ]
  },
  {
    id: "clean-energy-smart-grid-ev",
    name: "Clean Energy, Smart Grids & EV Telemetry",
    category: "Industrial & Supply Chain",
    tagline: "Battery Management Systems (BMS), solar generation forecasting, smart grid frequency balancing, and EV fleet telemetry.",
    marketOverview: "India's target of 500 GW non-fossil capacity by 2030 and rapid EV adoption create immense engineering challenges in grid balancing and battery thermal runaway prevention.",
    buyerLandscape: "State Electricity Distribution Companies (DISCOMs), Central Electricity Authority (CEA), National Load Despatch Centre (NLDC), EV Fleet Operators (Ola Electric, Ather, BluSmart).",
    manufacturingLandscape: "BMS firmware developers, solar inverter manufacturers, smart meter IoT providers (Tata Power, Adani Green, Ather Energy, Exicom).",
    governmentGrants: [
      {
        name: "National Green Hydrogen & Clean Tech Challenge",
        link: "https://mnre.gov.in",
        grantAmount: "Up to ₹50 Lakh",
        description: "Ministry of New and Renewable Energy grants for algorithmic smart grid balancing and battery lifetime optimization."
      }
    ],
    targetCompanies: [
      { name: "Ather Energy", domain: "EV Powertrain & BMS Intelligence", careerLink: "https://atherenergy.com" },
      { name: "Ola Electric", domain: "Electric Vehicles & Battery Gigafactory", careerLink: "https://olaelectric.com" },
      { name: "Tata Power Renewables", domain: "Smart Grids & Solar Farm Analytics", careerLink: "https://tatapower.com" },
      { name: "BluSmart", domain: "All-Electric Fleet Charging Telemetry", careerLink: "https://blu-smart.com" }
    ],
    unsolvedProblems: [
      {
        title: "Real-Time Lithium-Ion Battery Thermal Runaway Prediction",
        bottleneck: "Battery management systems rely on simple voltage thresholds, failing to detect internal short circuits before thermal runaway occurs.",
        promptIdea: "Train an edge Kalman filter + LSTM model running on embedded ARM microcontrollers to detect voltage delta divergence 120 seconds before thermal runaway.",
        recommendedStack: ["Embedded C++ / Rust", "TensorFlow Lite Micro", "MQTT", "Grafana"]
      },
      {
        title: "Intra-Hour Solar Irradiance Forecasting with Sky Imager Video",
        bottleneck: "Passing cloud shadows cause sudden 40% drops in solar farm power output, triggering grid imbalance penalties.",
        promptIdea: "Build a convolutional LSTM optical flow model processing all-sky camera video to forecast solar output dips 15 minutes in advance.",
        recommendedStack: ["PyTorch", "OpenCV", "DuckDB", "FastAPI"]
      }
    ],
    matchingProjectIds: [
      "bayesian-structural-time-series-monte-carlo",
      "autonomous-drone-webrtc-edge-vision-tracker"
    ]
  },
  {
    id: "agritech-precision-farming",
    name: "Agritech, Precision Farming & Remote Crop Analytics",
    category: "Industrial & Supply Chain",
    tagline: "Satellite soil moisture retrieval, multi-spectral crop yield prediction, pest vision models, and rural mandi pricing engines.",
    marketOverview: "Over 50% of India's workforce depends on agriculture. Government initiatives (PM Fasal Bima Yojana, AgriStack) demand automated satellite insurance verification and yield estimation.",
    buyerLandscape: "Ministry of Agriculture, ICAR, State Agriculture Departments, General Insurance Companies, Agricultural Export Promotion Councils.",
    manufacturingLandscape: "AgriTech startups (DeHaat, Ninjacart, CropIn, Fasal), drone spray manufacturers, smart irrigation IoT providers.",
    governmentGrants: [
      {
        name: "RKVY-RAFTAAR Agri-Startup Grant",
        link: "https://rkvy.nic.in",
        grantAmount: "Up to ₹25 Lakh",
        description: "Ministry of Agriculture seed fund for innovative precision farming, IoT crop monitoring, and supply chain solutions."
      }
    ],
    targetCompanies: [
      { name: "CropIn", domain: "Satellite Farming & Agri-Data Cloud", careerLink: "https://cropin.com" },
      { name: "DeHaat", domain: "Full-Stack Agricultural Ecosystem", careerLink: "https://agrevolution.in" },
      { name: "Ninjacart", domain: "Agritech Supply Chain & B2B Logistics", careerLink: "https://ninjacart.com" },
      { name: "Fasal", domain: "Precision Horticulture IoT & AI", careerLink: "https://fasal.co" }
    ],
    unsolvedProblems: [
      {
        title: "High-Resolution Satellite Soil Moisture Estimation",
        bottleneck: "Optical indices only reflect canopy greenness; microwave radar is required to estimate root-zone moisture through dense foliage.",
        promptIdea: "Fuse Sentinel-1 SAR backscatter with Sentinel-2 NDVI to train an XGBoost regression model predicting soil moisture percentage at 10m resolution.",
        recommendedStack: ["Rasterio", "Sentinel-1 SAR", "XGBoost", "GeoPandas"]
      }
    ],
    matchingProjectIds: [
      "multispectral-satellite-imagery-geospatial-ai",
      "synthetic-aperture-radar-sar-flood-detector"
    ]
  },
  {
    id: "semiconductor-embedded-edge-silicon",
    name: "Semiconductor, Embedded Systems & Edge Silicon",
    category: "Deep Tech & Defence",
    tagline: "RISC-V architecture, FPGA accelerators, WebGPU compute shaders, and micro-power edge AI deployment.",
    marketOverview: "The India Semiconductor Mission (ISM) with ₹76,000 Crore incentive support is accelerating domestic silicon design, packaging (OSAT), and edge AI chip architecture.",
    buyerLandscape: "Semiconductor design houses, automotive OEMs, aerospace contractors, industrial automation conglomerates.",
    manufacturingLandscape: "Fabless chip startups (Mindgrove, InCore Semiconductors), OSAT providers (Tata Electronics, CG Power), FPGA designers.",
    governmentGrants: [
      {
        name: "Design Linked Incentive (DLI) Scheme (MeitY)",
        link: "https://chips-india.org",
        grantAmount: "Up to 50% of eligible expenditure (Up to ₹15 Crore)",
        description: "Government financial reimbursement and infrastructure access for semiconductor and silicon design teams."
      }
    ],
    targetCompanies: [
      { name: "Mindgrove Technologies", domain: "Indigenous Edge RISC-V Silicon", careerLink: "https://mindgrove.tech" },
      { name: "InCore Semiconductors", domain: "Configurable RISC-V Processor Cores", careerLink: "https://incoresemi.com" },
      { name: "Tata Electronics", domain: "Semiconductor Fab & Precision Assembly", careerLink: "https://tata.com" },
      { name: "Texas Instruments India", domain: "Analog & Embedded Processing", careerLink: "https://ti.com" }
    ],
    unsolvedProblems: [
      {
        title: "Client-Side In-Browser SLM Execution Without WebAssembly Overhead",
        bottleneck: "Standard WASM compilation creates memory copy overheads; browser applications need direct GPU compute shader execution.",
        promptIdea: "Build an ONNX Runtime Web + WebGPU compute shader pipeline that executes quantized 4-bit SmolLM2 models at 25 tokens/second directly on client hardware.",
        recommendedStack: ["WebGPU", "ONNX Runtime Web", "Transformers.js", "JavaScript / WGSL"]
      }
    ],
    matchingProjectIds: [
      "webgpu-edge-slm-browser-inference",
      "autonomous-drone-webrtc-edge-vision-tracker"
    ]
  },
  {
    id: "logistics-maritime-supply-chain",
    name: "Supply Chain, Logistics & Maritime Port Automation",
    category: "Industrial & Supply Chain",
    tagline: "Unified Logistics Interface Platform (ULIP), automated container OCR, fleet routing optimization, and cold-chain monitoring.",
    marketOverview: "India's National Logistics Policy aims to reduce logistics costs to single digits of GDP. The ULIP protocol integrates 33 systems across railway, port, and road registries.",
    buyerLandscape: "Ministry of Ports, Shipping and Waterways, Dedicated Freight Corridor (DFCCIL), Port Authorities (JNPT, Adani Ports), 3PL Logistics Giants.",
    manufacturingLandscape: "Fleet management SaaS, automated container OCR vendors, cold-chain sensor manufacturers (Delhivery, Shiprocket, BlackBuck).",
    governmentGrants: [
      {
        name: "Logistics Innovation Challenge (DPIIT)",
        link: "https://dpiit.gov.in",
        grantAmount: "Up to ₹20 Lakh",
        description: "Grants for open-source ULIP API integration, freight route optimization, and multimodal tracking."
      }
    ],
    targetCompanies: [
      { name: "Delhivery", domain: "Automated Parcel Logistics & Sorting", careerLink: "https://delhivery.com" },
      { name: "BlackBuck", domain: "Trucking Fleet Network & Freight APIs", careerLink: "https://blackbuck.com" },
      { name: "Shiprocket", domain: "E-commerce Shipping Enablement", careerLink: "https://shiprocket.in" },
      { name: "Adani Ports & SEZ", domain: "Maritime Port & Container Logistics", careerLink: "https://adaniports.com" }
    ],
    unsolvedProblems: [
      {
        title: "Automated 4K Container Code OCR Under Harsh Weather Conditions",
        bottleneck: "Damaged shipping container ISO 6346 codes and torrential rains cause optical character recognition to fail at automated port toll gates.",
        promptIdea: "Implement a YOLOv11 text localization and CRNN sequence recognizer pipeline fine-tuned on weathered container metal surfaces.",
        recommendedStack: ["PyTorch", "YOLOv11", "CRNN", "OpenCV", "FastAPI"]
      }
    ],
    matchingProjectIds: [
      "distributed-load-testing-qa-mesh",
      "streaming-fraud-detection-duckdb-feast"
    ]
  },
  {
    id: "edtech-adaptive-learning-systems",
    name: "Education Technology & Adaptive Learning Systems",
    category: "Public Sector & Infrastructure",
    tagline: "Automated coding feedback, student psychometrics, NEP 2020 multi-lingual assessments, and automated exam proctoring.",
    marketOverview: "The National Education Policy (NEP 2020) prioritizes experiential learning, coding from secondary school, and multi-lingual assessment infrastructure.",
    buyerLandscape: "Ministry of Education, AICTE, State Higher Education Boards, Public & Private Universities, EdTech platforms.",
    manufacturingLandscape: "LMS developers, proctoring AI vendors, code evaluation platforms (Unacademy, PhysicsWallah, Scaler, UpGrad).",
    governmentGrants: [
      {
        name: "AICTE NEAT (National Educational Alliance for Technology)",
        link: "https://neat.aicte-india.org",
        grantAmount: "Institutional Deployment Grants",
        description: "Partnership and distribution grant for software tools that improve learning outcomes in higher engineering education."
      }
    ],
    targetCompanies: [
      { name: "PhysicsWallah", domain: "Mass-Scale Affordable Higher Education", careerLink: "https://pw.live" },
      { name: "Scaler Academy", domain: "Applied Computer Science & AI Curriculum", careerLink: "https://scaler.com" },
      { name: "BrowserStack", domain: "Developer Infrastructure & Test Clouds", careerLink: "https://browserstack.com" }
    ],
    unsolvedProblems: [
      {
        title: "Automated Architectural Code Review & Failure Explanation",
        bottleneck: "Standard unit test runners tell students that a test failed, but cannot explain why their memory complexity or state graph caused the crash.",
        promptIdea: "Build an AST-guided LLM reviewer that parses student code diffs, identifies architectural anti-patterns, and generates hints without giving away solutions.",
        recommendedStack: ["Python AST", "LangGraph", "Tree-Sitter", "Next.js"]
      }
    ],
    matchingProjectIds: [
      "langgraph-sql-multiagent-checkpointer",
      "distributed-load-testing-qa-mesh"
    ]
  }
];
