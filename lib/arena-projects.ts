export type ProjectDifficulty = "Baby Step" | "Easy" | "Intermediate" | "Hard" | "Insane" | "Go To Hell";

export interface ArenaProject {
  id: string;
  title: string;
  slug: string;
  tagline: string;
  imageUrl?: string;
  difficulty: ProjectDifficulty | "Expert Tier";
  domain: 
    | "Baby Steps & Starter Kits"
    | "Easy Foundation Projects"
    | "Geospatial & Satellite AI" 
    | "Edge Drone Vision & Robotics" 
    | "Clinical Healthcare AI" 
    | "GraphRAG & Knowledge Topology" 
    | "High-Frequency Telemetry" 
    | "Autonomous Red-Team Cybersecurity" 
    | "AI Agents & State Machines" 
    | "WebGPU Edge SLMs" 
    | "QA Mesh & Distributed Load" 
    | "Kernel eBPF & Autonomous Cloud"
    | "Data Science & Predictive ML"
    | "Statistical Modeling & Econometrics"
    | "Fullstack Web & Realtime Systems"
    | "Audio DSP & Speech AI"
    | "Clean Energy & Smart Grids"
    | "Agritech & Precision Farming"
    | "Semiconductor & Embedded Edge"
    | "Supply Chain & Logistics"
    | "EdTech & Developer Tooling"
    | "Custom Builder Project";
  durationDays: number;
  featured?: boolean;
  prizePool?: string;
  maxSlots?: number;
  techStack: string[];
  partnerTools: string[];
  targetRoles: ("Backend Dev" | "AI Engineer" | "Frontend Dev" | "Fullstack Dev" | "Cloud DevOps" | "Pen-tester" | "QA Tester" | "Product Manager" | "Data & Financial ML")[];
  keywords: string[];
  overview: string;
  architectureNotes: string;
  databaseSchema: string[];
  apiEndpoints: { method: string; path: string; description: string }[];
  milestones: {
    phase: string;
    days: string;
    goal: string;
    deliverables: string[];
  }[];
  evaluationCriteria: {
    metric: string;
    weight: number;
    description: string;
  }[];
  learningResources: {
    title: string;
    type: "YouTube Video" | "Documentation" | "Research Paper" | "GitHub Starter";
    url: string;
  }[];
  pentestAttackSurface?: string[];
  strictTestCommand: string;
  acceptanceGates: {
    rule: string;
    threshold: string;
    description: string;
  }[];
  productionSla: string;
  hint?: string;
  hintCostCoins?: number;
  highLevelDesign?: string;
  lowLevelDesign?: string;
  sdlcPhases?: {
    phase: string;
    details: string;
  }[];
}

// 50 Full Production Systems for the 45-Day Virtual Internship Playground (14th Sept - Diwali 2026)
export const ARENA_PROJECTS: ArenaProject[] = [
  // ── 1. GEOSPATIAL & DEFENCE AI ──
  {
    id: "p1",
    slug: "multispectral-satellite-imagery-geospatial-ai",
    title: "Multi-Spectral Satellite Imagery & Geospatial AI Pipeline",
    tagline: "Ingest multi-gigabyte Sentinel-2 GeoTIFF scenes, compute NDVI/NDWI spectral indices, segment deforestation with U-Net, and index geospatial embeddings in Qdrant.",
    difficulty: "Hard",
    domain: "Geospatial & Satellite AI",
    durationDays: 45,
    featured: true,
    techStack: ["PyTorch", "GDAL", "Rasterio", "FastAPI", "Qdrant Geospatial", "Docker", "Celery", "PostgreSQL PostGIS"],
    partnerTools: ["Qdrant", "PostgreSQL", "AWS S3", "Docker"],
    targetRoles: ["AI Engineer", "Backend Dev", "Data & Financial ML", "QA Tester"],
    keywords: ["satellite", "geospatial", "gdal", "rasterio", "sentinel", "ndvi", "pytorch", "qdrant", "fastapi", "gis", "remote sensing"],
    overview: "Construct an industrial multi-spectral satellite processing pipeline. Stream 500MB+ Sentinel-2 GeoTIFF scenes from AWS S3, compute pixel-wise spectral vegetation indices (NDVI, NDWI, EVI), train a U-Net model to segment land-cover changes, and index geospatial tile vector embeddings in Qdrant.",
    architectureNotes: "Satellite Data Ingest (AWS S3) -> Rasterio / GDAL Tiling Engine -> Spectral Index Compute Grid (Celery + Redis) -> PyTorch U-Net Segmentation -> Qdrant Geospatial Vector Index -> PostGIS Polygon Metadata -> FastAPI Streaming Gateway.",
    databaseSchema: [
      "satellite_scenes (id UUID PK, satellite_source VARCHAR, acquisition_date TIMESTAMP, cloud_coverage_pct NUMERIC, bounding_box GEOMETRY(POLYGON, 4326), s3_url TEXT)",
      "segmented_tiles (id UUID PK, scene_id UUID FK, tile_coords GEOMETRY(POINT, 4326), ndvi_mean NUMERIC, ndwi_mean NUMERIC, land_cover_class VARCHAR, confidence NUMERIC)",
      "geospatial_embeddings (id UUID PK, tile_id UUID FK, vector VECTOR(512), metadata JSONB)",
      "environmental_alerts (id UUID PK, region_name VARCHAR, anomaly_type VARCHAR, detected_area_sqkm NUMERIC, alert_timestamp TIMESTAMP)"
    ],
    apiEndpoints: [
      { method: "POST", path: "/api/v1/satellite/ingest-scene", description: "Stream ingest GeoTIFF satellite scenes and trigger chunked tiling." },
      { method: "POST", path: "/api/v1/satellite/segment-region", description: "Execute U-Net segmentation on bounding-box polygon." },
      { method: "GET", path: "/api/v1/satellite/spectral-indices", description: "Query NDVI/NDWI matrix and deforestation risk heatmap." },
      { method: "POST", path: "/api/v1/satellite/search-similar-terrain", description: "Query Qdrant for visually identical terrain patterns across global tiles." }
    ],
    milestones: [
      { phase: "Phase 1: Rasterio & GDAL Tiling Engine", days: "Days 1-10", goal: "Build streaming GeoTIFF parser and tile chunker with PostGIS indexing.", deliverables: ["Rasterio tile chunker", "PostGIS schema migration", "Dockerized GDAL environment"] },
      { phase: "Phase 2: Spectral Compute & U-Net Segmentation", days: "Days 11-22", goal: "Compute NDVI/NDWI indices and run PyTorch land-cover segmentation model.", deliverables: ["Spectral index math pipeline", "U-Net inference engine", "Validation IoU report"] },
      { phase: "Phase 3: Qdrant Geospatial Vector Indexing", days: "Days 23-35", goal: "Generate 512-dim visual embeddings per tile and index in Qdrant with Geo-filter payloads.", deliverables: ["Qdrant vector collection", "Sub-second similarity search", "Bounding-box filter tests"] },
      { phase: "Phase 4: Cloud Deploy & Disaster Alert Gateway", days: "Days 36-45", goal: "Deploy on AWS EC2 with GPU acceleration, CI/CD pipeline, and public interactive map.", deliverables: ["Live cloud API URL", "GitHub repo with automated test harness", "Demo Day presentation"] }
    ],
    evaluationCriteria: [
      { metric: "Segmentation Accuracy (IoU)", weight: 40, description: "Intersection over Union (IoU) >= 0.88 across cloud-obscured test satellite scenes." },
      { metric: "Throughput & Tile Processing Latency", weight: 30, description: "Process a 500MB Sentinel-2 GeoTIFF file in under 3.5 seconds across worker nodes." },
      { metric: "Geospatial Vector Retrieval Precision", weight: 20, description: "Precision @ 10 > 93% for identical geographical anomaly matches." },
      { metric: "Daily Ship Logs", weight: 10, description: "Consistent daily proof-of-work on LinkedIn and Discord." }
    ],
    learningResources: [
      { title: "Geospatial Deep Learning with Rasterio & PyTorch", type: "YouTube Video", url: "https://www.youtube.com/watch?v=kY3P_lZq_l0" },
      { title: "Sentinel-2 Multi-Spectral Band Math Reference (ESA)", type: "Documentation", url: "https://sentinels.copernicus.eu/web/sentinel/user-guides/sentinel-2-msi/document-library" },
      { title: "Segment Anything in High-Resolution Satellite Imagery", type: "Research Paper", url: "https://arxiv.org/abs/2304.14827" }
    ],
    pentestAttackSurface: ["GeoTIFF decompression bomb (malformed ZIP/deflate header)", "GDAL buffer overflow in C-bindings", "PostGIS spatial injection via unbounded geometry queries"],
    strictTestCommand: "pytest tests/test_satellite_pipeline.py --benchmark --min-iou=0.88",
    acceptanceGates: [
      { rule: "IoU Threshold", threshold: ">= 0.88", description: "Land-cover segmentation must achieve at least 88% IoU on validation dataset." },
      { rule: "p95 Tile Latency", threshold: "< 3,500ms", description: "500MB scene rasterization and inference must complete under 3.5 seconds." },
      { rule: "Memory Overhead", threshold: "< 3.8GB RAM", description: "GDAL raster streaming must not leak memory during batch tile execution." }
    ],
    productionSla: "99.9% uptime, p95 query latency < 120ms for vector terrain search."
  },
  {
    id: "p2",
    slug: "synthetic-aperture-radar-sar-flood-detector",
    title: "Synthetic Aperture Radar (SAR) Flood & Maritime Vessel Detector",
    tagline: "Process Sentinel-1 C-band SAR radar imagery through speckle filtering (Lee/Frost), Otsu binarization, and dual-polarized vessel detection.",
    difficulty: "Hard",
    domain: "Geospatial & Satellite AI",
    durationDays: 45,
    techStack: ["Python", "SNAP / snappy", "Rasterio", "PyTorch", "PostGIS", "FastAPI", "Docker"],
    partnerTools: ["PostgreSQL", "Docker", "AWS S3"],
    targetRoles: ["AI Engineer", "Backend Dev", "Data & Financial ML"],
    keywords: ["sar", "radar", "sentinel-1", "flood detection", "speckle filter", "geospatial", "snappy", "maritime"],
    overview: "Build an all-weather radar analysis engine. Ingest Sentinel-1 C-band Synthetic Aperture Radar GRD scenes, apply radiometric calibration, terrain correction, Lee speckle filtering, and detect flood water inundation through heavy monsoon clouds.",
    architectureNotes: "Sentinel-1 GRD Raw Stream -> Radiometric Calibration -> Refined Lee Speckle Filter -> Otsu Adaptive Thresholding -> PostGIS Vector Geometries -> FastAPI Alert API.",
    databaseSchema: [
      "sar_scenes (id UUID PK, polarizations VARCHAR[], pass_direction VARCHAR, footprint GEOMETRY, raw_url TEXT)",
      "flood_inundation_zones (id UUID PK, scene_id UUID FK, water_extent GEOMETRY(MULTIPOLYGON, 4326), area_ha NUMERIC)",
      "detected_vessels (id UUID PK, scene_id UUID FK, location GEOMETRY(POINT, 4326), length_meters NUMERIC, confidence NUMERIC)"
    ],
    apiEndpoints: [
      { method: "POST", path: "/api/v1/sar/calibrate-scene", description: "Apply calibration and speckle filtering on SAR GRD data." },
      { method: "POST", path: "/api/v1/sar/detect-flooding", description: "Run Otsu binarization to output flood extent polygons." }
    ],
    milestones: [
      { phase: "Phase 1: SAR Preprocessing Pipeline", days: "Days 1-15", goal: "Calibrate VV/VH polarizations and apply Lee speckle filter.", deliverables: ["Calibrated SAR raster", "Speckle noise reduction test"] },
      { phase: "Phase 2: Flood Segmentation & Vectorization", days: "Days 16-30", goal: "Extract water bodies using adaptive thresholding and convert to GeoJSON.", deliverables: ["Flood vector mask", "PostGIS spatial index"] },
      { phase: "Phase 3: Vessel Constant False Alarm Rate (CFAR)", days: "Days 31-45", goal: "Implement CA-CFAR radar vessel detection and deploy API.", deliverables: ["CFAR detector", "FastAPI service", "Live demo"] }
    ],
    evaluationCriteria: [
      { metric: "Flood Mapping Accuracy (F1-Score)", weight: 50, description: "F1-Score >= 0.89 evaluated against ground-truth Copernicus EMS flood activations." },
      { metric: "Inference Speed", weight: 30, description: "Calibrate and segment a 1GB SAR scene in under 12 seconds." },
      { metric: "Documentation & Clean Code", weight: 20, description: "Modular Python code with pytest coverage > 85%." }
    ],
    learningResources: [
      { title: "Synthetic Aperture Radar Processing Basics (NASA ARSET)", type: "YouTube Video", url: "https://www.youtube.com/watch?v=SAR101_NASA" },
      { title: "ESA Sentinel-1 SAR Technical Guide", type: "Documentation", url: "https://sentinels.copernicus.eu/web/sentinel/user-guides/sentinel-1-sar" }
    ],
    strictTestCommand: "pytest tests/test_sar_detector.py --min-f1=0.89",
    acceptanceGates: [
      { rule: "F1 Score", threshold: ">= 0.89", description: "Validation F1 score must meet or exceed 89% on historical flood scenes." }
    ],
    productionSla: "Process full SAR pass in < 15 seconds with 99.9% API uptime."
  },
  {
    id: "p3",
    slug: "autonomous-drone-webrtc-edge-vision-tracker",
    title: "Autonomous Drone WebRTC Edge Telemetry & Vision Tracker",
    tagline: "Real-time 1080p 60fps WebRTC/RTSP drone stream processing, YOLOv11 + ByteTrack multi-object tracking, and geofence breach triggers.",
    difficulty: "Hard",
    domain: "Edge Drone Vision & Robotics",
    durationDays: 45,
    featured: true,
    techStack: ["Python", "OpenCV", "YOLOv11", "ByteTrack", "aiortc", "WebRTC", "FastAPI", "Redis Streams", "WebSockets"],
    partnerTools: ["Redis", "FastAPI", "Docker"],
    targetRoles: ["AI Engineer", "Backend Dev", "Cloud DevOps", "QA Tester"],
    keywords: ["drone", "webrtc", "yolov11", "bytetrack", "aiortc", "computer vision", "edge ai", "telemetry", "geofencing"],
    overview: "Build an industrial drone mission control platform. Connect to live RTSP/WebRTC 1080p 60fps drone camera feeds, run TensorRT-accelerated YOLOv11 object tracking with ByteTrack to track vehicles/personnel, correlate with MAVLink GPS coordinates, and trigger sub-50ms geofence breach webhooks.",
    architectureNotes: "RTSP / WebRTC Ingest (aiortc) -> Frame Buffer Queue -> TensorRT YOLOv11 Detector -> ByteTrack Kalman Filter -> MAVLink Telemetry Sync -> Redis Stream Geo-Publisher -> WebSocket Client Gateway.",
    databaseSchema: [
      "drones (id UUID PK, serial_no VARCHAR, model VARCHAR, last_heartbeat TIMESTAMP, battery_pct NUMERIC)",
      "flight_telemetry (id UUID PK, drone_id UUID FK, timestamp TIMESTAMP, latitude NUMERIC, longitude NUMERIC, altitude_m NUMERIC, heading_deg NUMERIC, speed_mps NUMERIC)",
      "tracked_entities (id UUID PK, drone_id UUID FK, track_id INT, class_label VARCHAR, confidence NUMERIC, bounding_box JSONB, world_coords GEOMETRY(POINT, 4326), first_seen TIMESTAMP, last_seen TIMESTAMP)",
      "geofence_zones (id UUID PK, name VARCHAR, boundary GEOMETRY(POLYGON, 4326), min_alt_m NUMERIC, max_alt_m NUMERIC, alert_severity VARCHAR)"
    ],
    apiEndpoints: [
      { method: "POST", path: "/api/v1/drone/webrtc/offer", description: "Establish WebRTC peer connection for ultra-low-latency video ingest." },
      { method: "POST", path: "/api/v1/drone/telemetry", description: "Ingest MAVLink high-frequency GPS/IMU packets." },
      { method: "GET", path: "/api/v1/drone/live-tracks", description: "WebSocket stream of verified object bounding boxes and geo-coordinates." }
    ],
    milestones: [
      { phase: "Phase 1: WebRTC & RTSP Ingest Pipeline", days: "Days 1-12", goal: "Establish low-latency video decoding pipe using aiortc and OpenCV.", deliverables: ["WebRTC signaling server", "Sub-150ms video pipeline"] },
      { phase: "Phase 2: TensorRT YOLOv11 & ByteTrack Engine", days: "Days 13-25", goal: "Run object detection at 60fps with consistent track ID assignment.", deliverables: ["YOLOv11 TensorRT engine", "ByteTrack MOTA evaluation"] },
      { phase: "Phase 3: MAVLink Telemetry & Geofencing", days: "Days 26-38", goal: "Project pixel coordinates into real-world GPS coordinates and check geofence intersections.", deliverables: ["MAVLink fusion parser", "PostGIS geofence trigger"] },
      { phase: "Phase 4: Cloud Mission Control & WebSockets", days: "Days 39-45", goal: "Deploy web dashboard showing live map, video stream, and alert dispatch.", deliverables: ["Next.js mission dashboard", "Dockerized deployment"] }
    ],
    evaluationCriteria: [
      { metric: "MOTA (Multi-Object Tracking Accuracy)", weight: 40, description: "MOTA >= 78% on aerial drone benchmark datasets with fast camera motion." },
      { metric: "Glass-to-Glass Latency", weight: 35, description: "Total latency from video capture to browser alert <= 180ms." },
      { metric: "Throughput (FPS)", weight: 25, description: "Maintain steady 60fps inference on NVIDIA T4/RTX 4090 GPUs." }
    ],
    learningResources: [
      { title: "Ultra-Low Latency Video Streaming with WebRTC & Python", type: "YouTube Video", url: "https://www.youtube.com/watch?v=WebRTC_Drone" },
      { title: "YOLOv11 & ByteTrack MOT Architecture (Ultralytics)", type: "Documentation", url: "https://docs.ultralytics.com" }
    ],
    strictTestCommand: "pytest tests/test_drone_tracker.py --benchmark --max-latency-ms=180",
    acceptanceGates: [
      { rule: "Latency SLA", threshold: "<= 180ms", description: "Glass-to-glass latency must not exceed 180ms at 1080p." },
      { rule: "MOTA Score", threshold: ">= 78%", description: "Tracking accuracy must maintain >= 78% under camera panning." }
    ],
    productionSla: "Glass-to-glass latency < 180ms, 99.95% stream uptime."
  },
  {
    id: "p4",
    slug: "thermal-flir-uav-wildfire-early-warning",
    title: "Thermal Infrared UAV Payload & Wildfire Detection Engine",
    tagline: "Process 16-bit radiometric thermal infrared FLIR video streams, calibrate temperature gradients, and detect wildfire thermal hotspots in sub-40ms.",
    difficulty: "Hard",
    domain: "Edge Drone Vision & Robotics",
    durationDays: 45,
    techStack: ["Python", "OpenCV", "PyTorch", "FastAPI", "NumPy", "Docker", "Redis"],
    partnerTools: ["FastAPI", "Redis", "Docker"],
    targetRoles: ["AI Engineer", "Backend Dev", "Cloud DevOps"],
    keywords: ["thermal", "flir", "infrared", "radiometric", "wildfire", "drone", "computer vision"],
    overview: "Process raw 14-bit and 16-bit radiometric thermal infrared imagery from drone FLIR payloads. Implement Planck calibration equations to extract absolute surface temperatures and detect micro-fires and electrical substation anomalies in < 40ms.",
    architectureNotes: "FLIR Radiometric Raw Stream -> Temperature Calibration Engine -> Spatial Heat Gradient Clustering -> Deep Thermal CNN -> Geo-alert Dispatch.",
    databaseSchema: [
      "thermal_patrols (id UUID PK, drone_id UUID, flight_path GEOMETRY, ambient_temp_c NUMERIC, start_time TIMESTAMP)",
      "thermal_anomalies (id UUID PK, patrol_id UUID FK, max_temp_c NUMERIC, location GEOMETRY(POINT, 4326), confidence NUMERIC, thermal_snapshot_url TEXT)"
    ],
    apiEndpoints: [
      { method: "POST", path: "/api/v1/thermal/stream-frame", description: "Ingest 16-bit radiometric raw array." },
      { method: "GET", path: "/api/v1/thermal/hotspots", description: "Fetch active hotspots exceeding critical temperature thresholds." }
    ],
    milestones: [
      { phase: "Phase 1: Radiometric Temperature Extraction", days: "Days 1-15", goal: "Decode FLIR 16-bit matrices to calibrated Celsius maps.", deliverables: ["Radiometric calibration module"] },
      { phase: "Phase 2: Hotspot Segmentation & CNN Verification", days: "Days 16-30", goal: "Eliminate solar reflection false positives using deep thermal CNN.", deliverables: ["Trained hotspot CNN", "Precision-Recall curve"] },
      { phase: "Phase 3: Alert Pipeline & Live Staging", days: "Days 31-45", goal: "Deploy FastAPI streaming server with sub-40ms P99 latency.", deliverables: ["Live API", "Automated stress tests"] }
    ],
    evaluationCriteria: [
      { metric: "False Positive Rate", weight: 50, description: "False positive hotspot rate < 0.5% in arid environments." },
      { metric: "Processing Latency", weight: 50, description: "Process thermal frame in < 40ms." }
    ],
    learningResources: [
      { title: "FLIR Radiometric Data Processing Reference", type: "Documentation", url: "https://flir.custhelp.com" }
    ],
    strictTestCommand: "pytest tests/test_thermal_engine.py --max-latency=40ms",
    acceptanceGates: [
      { rule: "Latency", threshold: "< 40ms", description: "Thermal frame inference must complete under 40ms." }
    ],
    productionSla: "P99 latency < 40ms, zero crash under 5-hour continuous streaming."
  },
  {
    id: "p5",
    slug: "monai-unetr-3d-dicom-mri-segmentation",
    title: "Clinical Healthcare AI & 3D DICOM Diagnostic Engine",
    tagline: "HIPAA/FHIR-compliant 3D MRI/CT volumetric scan segmentation with MONAI, BioClinicalBERT notes parsing, and cryptographic diagnosis provenance.",
    difficulty: "Insane",
    domain: "Clinical Healthcare AI",
    durationDays: 45,
    featured: true,
    techStack: ["PyTorch", "MONAI", "TorchIO", "FastAPI", "PostgreSQL", "FHIR / HL7", "Transformers", "Docker"],
    partnerTools: ["MONAI", "PostgreSQL", "Docker", "Hugging Face"],
    targetRoles: ["AI Engineer", "Backend Dev", "Pen-tester", "QA Tester", "Product Manager"],
    keywords: ["monai", "dicom", "mri", "3d segmentation", "healthcare ai", "fhir", "hipaa", "pytorch", "medical imaging", "transformers"],
    overview: "Construct an enterprise clinical AI imaging backend. Ingest raw 3D DICOM / NIfTI volumetric scans (CT, brain MRI), apply MONAI UNETR 3D transformer models to segment tumors and lesions with sub-voxel accuracy, parse clinical EHR notes using BioClinicalBERT, and output standardized FHIR JSON diagnostic reports with cryptographic SHA-256 audit logs.",
    architectureNotes: "PACS / DICOM Web Ingest (WADO-RS) -> TorchIO Preprocessing & Spatial Normalization -> MONAI UNETR 3D Inference Engine -> BioClinicalBERT NLP Parser -> FHIR DiagnosticReport JSON Generator -> PostgreSQL Audit Ledger -> FastAPI Secured Endpoints.",
    databaseSchema: [
      "patients (id UUID PK, anonymized_mrn VARCHAR UNIQUE, birth_year INT, gender VARCHAR, created_at TIMESTAMP)",
      "scans (id UUID PK, patient_id UUID FK, modality VARCHAR, body_part VARCHAR, slice_count INT, voxel_spacing NUMERIC[], dicom_s3_uri TEXT, created_at TIMESTAMP)",
      "segmentation_results (id UUID PK, scan_id UUID FK, target_structure VARCHAR, volume_cc NUMERIC, dice_score NUMERIC, mask_nifti_uri TEXT, model_version VARCHAR)",
      "clinical_reports (id UUID PK, scan_id UUID FK, doctor_notes TEXT, nlp_extracted_findings JSONB, fhir_bundle JSONB, sha256_audit_hash VARCHAR(64), verified_by_radiologist BOOLEAN)"
    ],
    apiEndpoints: [
      { method: "POST", path: "/api/v1/clinical/ingest-dicom", description: "Securely upload and validate 3D multi-slice DICOM series." },
      { method: "POST", path: "/api/v1/clinical/segment-volume", description: "Trigger MONAI 3D UNETR model inference." },
      { method: "POST", path: "/api/v1/clinical/generate-fhir-report", description: "Synthesize BioClinicalBERT notes and segmentation into FHIR R4 Bundle." },
      { method: "GET", path: "/api/v1/clinical/audit-ledger/{reportId}", description: "Verify immutable SHA-256 cryptographic provenance of medical diagnosis." }
    ],
    milestones: [
      { phase: "Phase 1: DICOM/NIfTI Ingest & Spatial Normalization", days: "Days 1-10", goal: "Build DICOM parser with pixel spacing normalization and orientation alignment.", deliverables: ["DICOM normalization pipeline", "HIPAA de-identification filter"] },
      { phase: "Phase 2: MONAI 3D UNETR Segmentation Model", days: "Days 11-25", goal: "Implement sliding-window 3D volumetric inference achieving Dice > 0.85.", deliverables: ["MONAI model checkpoint", "Validation Dice & Hausdorff distance benchmarks"] },
      { phase: "Phase 3: BioClinicalBERT & FHIR R4 Serialization", days: "Days 26-37", goal: "Extract clinical entities from radiologist notes and produce FHIR DiagnosticReport JSON.", deliverables: ["FHIR R4 validation test harness", "Cryptographic ledger module"] },
      { phase: "Phase 4: Production Hardening & Medical UI", days: "Days 38-45", goal: "Deploy authenticated API with 2D/3D slice viewer frontend.", deliverables: ["Live cloud deployment", "Automated HIPAA audit report"] }
    ],
    evaluationCriteria: [
      { metric: "Dice Similarity Coefficient (DSC)", weight: 40, description: "Mean DSC >= 0.85 on test brain MRI / liver CT volumes." },
      { metric: "FHIR R4 Schema Conformance", weight: 30, description: "100% pass rate against official HL7 FHIR validator." },
      { metric: "Inference Latency (3D Volume)", weight: 20, description: "Process a 256x256x128 volume in under 4.0 seconds on NVIDIA T4." },
      { metric: "Security & HIPAA Compliance", weight: 10, description: "Zero plaintext PHI leakage in logs or database." }
    ],
    learningResources: [
      { title: "Deep Learning for Medical Imaging with MONAI", type: "YouTube Video", url: "https://www.youtube.com/watch?v=MONAI_Tutorial" },
      { title: "MONAI UNETR: Transformers for 3D Medical Image Segmentation", type: "Research Paper", url: "https://arxiv.org/abs/2103.10504" },
      { title: "HL7 FHIR R4 Specification for DiagnosticReport", type: "Documentation", url: "https://www.hl7.org/fhir/diagnosticreport.html" }
    ],
    pentestAttackSurface: ["Malicious DICOM header buffer overflow (CVE-2022-XXXX)", "PII leakage in unstripped DICOM Private Tags", "FHIR JSON injection leading to unauthorized patient record modification"],
    strictTestCommand: "pytest tests/test_medical_pipeline.py --min-dice=0.85 --validate-fhir",
    acceptanceGates: [
      { rule: "Dice Score", threshold: ">= 0.85", description: "3D organ segmentation must maintain >= 85% Dice score." },
      { rule: "FHIR Compliance", threshold: "100%", description: "All generated diagnostic outputs must strictly pass HL7 FHIR R4 schema validation." },
      { rule: "PHI Leakage Audit", threshold: "0 Incidents", description: "Automated scan must confirm complete anonymization of patient identifiers." }
    ],
    productionSla: "99.9% uptime, 3D volume inference < 4.0s."
  },
  {
    id: "p6",
    slug: "vcf-genomic-variant-pathogenicity-xgboost",
    title: "Genomic Variant Calling & Pathogenicity ML Engine",
    tagline: "Parse VCF (Variant Call Format) files, annotate single nucleotide polymorphisms (SNPs) with ClinVar, and predict pathogenicity with XGBoost.",
    difficulty: "Hard",
    domain: "Clinical Healthcare AI",
    durationDays: 45,
    techStack: ["Python", "BioPython", "XGBoost", "Pandas", "FastAPI", "Docker", "PostgreSQL"],
    partnerTools: ["PostgreSQL", "Docker"],
    targetRoles: ["Data & Financial ML", "AI Engineer", "Backend Dev"],
    keywords: ["genomics", "vcf", "xgboost", "pathogenicity", "clinvar", "bioinformatics", "dna"],
    overview: "Parse multi-gigabyte Variant Call Format (VCF) files from whole genome sequencing. Annotate variants with ClinVar and CADD scores, and train an explainable XGBoost model with SHAP values to classify benign vs pathogenic mutations with AUC > 0.92.",
    architectureNotes: "VCF Ingest -> BioPython Stream Parser -> ClinVar Feature Join -> XGBoost Inference -> SHAP Explainability -> FastAPI Diagnostic Endpoint.",
    databaseSchema: [
      "genomic_variants (id UUID PK, chromosome VARCHAR, position INT, ref_allele VARCHAR, alt_allele VARCHAR, gene_symbol VARCHAR, cadd_score NUMERIC)",
      "pathogenicity_predictions (id UUID PK, variant_id UUID FK, predicted_class VARCHAR, probability NUMERIC, top_shap_features JSONB)"
    ],
    apiEndpoints: [
      { method: "POST", path: "/api/v1/genomics/upload-vcf", description: "Stream parse VCF file and annotate variants." },
      { method: "GET", path: "/api/v1/genomics/variant/{rsId}", description: "Retrieve pathogenicity score and SHAP feature importance." }
    ],
    milestones: [
      { phase: "Phase 1: VCF Parsing Engine", days: "Days 1-12", goal: "Stream parse multi-million line VCF files without memory exhaustion.", deliverables: ["VCF streaming parser", "Unit test suite"] },
      { phase: "Phase 2: XGBoost Training & Validation", days: "Days 13-28", goal: "Train XGBoost classifier achieving ROC-AUC >= 0.92 on ClinVar test split.", deliverables: ["Trained model artifact", "ROC-AUC curves"] },
      { phase: "Phase 3: SHAP Explainability & API", days: "Days 29-45", goal: "Generate local feature explanations and deploy REST endpoints.", deliverables: ["FastAPI service", "SHAP visualization UI"] }
    ],
    evaluationCriteria: [
      { metric: "ROC-AUC Score", weight: 50, description: "ROC-AUC >= 0.92 on held-out ClinVar test mutations." },
      { metric: "VCF Parsing Throughput", weight: 30, description: "Process 100,000 variants in under 5.0 seconds." },
      { metric: "Code Quality", weight: 20, description: "Clean type-hinted code with 90% pytest coverage." }
    ],
    learningResources: [
      { title: "Genomic Data Science with Python", type: "Documentation", url: "https://biopython.org" }
    ],
    strictTestCommand: "pytest tests/test_genomics_model.py --min-auc=0.92",
    acceptanceGates: [
      { rule: "ROC-AUC", threshold: ">= 0.92", description: "Classification model must achieve >= 0.92 ROC-AUC." }
    ],
    productionSla: "P95 query latency < 100ms per variant lookup."
  },
  {
    id: "p7",
    slug: "bayesian-structural-time-series-monte-carlo",
    title: "Bayesian Time-Series & Monte Carlo Financial Risk Engine",
    tagline: "Statistical risk engine in Python / Polars implementing Bayesian structural time-series (BSTS), MCMC sampling, and 100,000 Monte Carlo paths.",
    difficulty: "Hard",
    domain: "Statistical Modeling & Econometrics",
    durationDays: 45,
    techStack: ["Python", "Polars", "PyMC", "NumPy", "FastAPI", "Docker", "PostgreSQL"],
    partnerTools: ["PostgreSQL", "Docker"],
    targetRoles: ["Data & Financial ML", "AI Engineer", "Backend Dev"],
    keywords: ["bayesian", "monte carlo", "pymc", "polars", "econometrics", "var", "time series", "finance", "mcmc"],
    overview: "Build an institutional quantitative risk engine. Ingest tick-level equity and crypto data using Polars, fit Bayesian Structural Time Series (BSTS) models via PyMC MCMC sampling to decompose trend and seasonality, and simulate 100,000 Monte Carlo paths to calculate Value at Risk (VaR 99%) and Expected Shortfall (CVaR).",
    architectureNotes: "Tick Ingest -> Polars Parallel Resampling -> PyMC BSTS Model -> GPU-accelerated Monte Carlo Engine (100k paths) -> VaR / CVaR Risk Matrix -> FastAPI Endpoint.",
    databaseSchema: [
      "market_ticks (id BIGSERIAL PK, symbol VARCHAR, timestamp TIMESTAMP, price NUMERIC, volume NUMERIC)",
      "risk_simulations (id UUID PK, symbol VARCHAR, simulated_at TIMESTAMP, var_95 NUMERIC, var_99 NUMERIC, expected_shortfall NUMERIC, monte_carlo_paths JSONB)"
    ],
    apiEndpoints: [
      { method: "POST", path: "/api/v1/risk/run-simulation", description: "Execute 100k Monte Carlo paths for portfolio assets." },
      { method: "GET", path: "/api/v1/risk/var-metrics", description: "Fetch calculated VaR and Expected Shortfall metrics." }
    ],
    milestones: [
      { phase: "Phase 1: Polars High-Speed Time-Series Ingest", days: "Days 1-12", goal: "Resample 10M+ tick records into OHLCV candles in sub-500ms.", deliverables: ["Polars ETL pipeline", "Benchmark report"] },
      { phase: "Phase 2: PyMC Bayesian Structural Model", days: "Days 13-28", goal: "Fit BSTS model with MCMC sampling and convergence diagnostics (R-hat < 1.05).", deliverables: ["PyMC model class", "Trace plots & posterior checks"] },
      { phase: "Phase 3: 100k Path Monte Carlo & Risk API", days: "Days 29-45", goal: "Execute vectorised Monte Carlo simulation in < 2.0s and deploy API.", deliverables: ["FastAPI risk endpoint", "Interactive risk dashboard"] }
    ],
    evaluationCriteria: [
      { metric: "Simulation Throughput", weight: 40, description: "Simulate 100,000 paths across 10 assets in under 2.0 seconds." },
      { metric: "Backtest Accuracy", weight: 40, description: "Historical VaR 99% breach rate between 0.8% and 1.2% (Kupiec test)." },
      { metric: "Documentation", weight: 20, description: "Rigorous mathematical write-up of BSTS equations." }
    ],
    learningResources: [
      { title: "Probabilistic Programming and Bayesian Methods for Hackers", type: "Documentation", url: "https://camdavidsonpilon.github.io/Probabilistic-Programming-and-Bayesian-Methods-for-Hackers/" }
    ],
    strictTestCommand: "pytest tests/test_risk_engine.py --benchmark --max-seconds=2.0",
    acceptanceGates: [
      { rule: "Simulation Time", threshold: "< 2.0s", description: "100k Monte Carlo simulation must complete in under 2 seconds." }
    ],
    productionSla: "99.9% uptime, sub-2s risk calculations."
  },
  {
    id: "p8",
    slug: "streaming-fraud-detection-duckdb-feast",
    title: "Real-Time Fraud Detection & Streaming Feature Store",
    tagline: "Industrial fraud detection pipeline with DuckDB / Feast feature store, LightGBM, and sub-15ms streaming transaction scoring.",
    difficulty: "Hard",
    domain: "Data Science & Predictive ML",
    durationDays: 45,
    techStack: ["Python", "DuckDB", "Feast", "LightGBM", "Redis", "Kafka", "FastAPI", "Docker"],
    partnerTools: ["Redis", "PostgreSQL", "Docker"],
    targetRoles: ["Data & Financial ML", "AI Engineer", "Backend Dev"],
    keywords: ["fraud detection", "feast", "feature store", "duckdb", "lightgbm", "kafka", "realtime ml", "streaming"],
    overview: "Build an end-to-end streaming fraud scoring system. Process simulated bank transactions from Kafka, fetch sliding-window aggregation features from a Feast + Redis online feature store, and score transactions with LightGBM in < 15ms with precision > 0.94.",
    architectureNotes: "Kafka Transaction Stream -> Feast Feature Ingest -> Redis Online Feature Store -> LightGBM Low-Latency Scoring -> Webhook Alert Dispatch -> DuckDB Offline Training Warehouse.",
    databaseSchema: [
      "transactions (id UUID PK, user_id UUID, amount NUMERIC, merchant_category VARCHAR, timestamp TIMESTAMP, is_fraud BOOLEAN)",
      "user_risk_profiles (user_id UUID PK, sliding_24h_tx_count INT, sliding_24h_spend NUMERIC, risk_tier VARCHAR, last_updated TIMESTAMP)"
    ],
    apiEndpoints: [
      { method: "POST", path: "/api/v1/fraud/evaluate-transaction", description: "Evaluate transaction in real-time and return fraud probability." }
    ],
    milestones: [
      { phase: "Phase 1: Feast & Redis Online Store Setup", days: "Days 1-12", goal: "Define feature views and verify sub-3ms point feature retrieval.", deliverables: ["Feast feature definitions", "Redis cluster"] },
      { phase: "Phase 2: LightGBM Training on DuckDB Parquet", days: "Days 13-28", goal: "Train gradient boosted decision trees on 10M historical transactions.", deliverables: ["Trained LightGBM model", "PR-AUC curve"] },
      { phase: "Phase 3: Streaming Ingest & Webhook Alerts", days: "Days 29-45", goal: "Connect Kafka consumer and deploy scoring API under 15ms SLA.", deliverables: ["FastAPI scoring service", "Stress test results"] }
    ],
    evaluationCriteria: [
      { metric: "P99 Scoring Latency", weight: 50, description: "Total roundtrip latency <= 15ms at 5,000 transactions/sec." },
      { metric: "Precision-Recall AUC", weight: 35, description: "PR-AUC >= 0.88 on imbalanced 1:1000 fraud dataset." },
      { metric: "System Robustness", weight: 15, description: "Zero message loss during Kafka broker failure." }
    ],
    learningResources: [
      { title: "Building Real-Time Feature Stores with Feast", type: "Documentation", url: "https://docs.feast.dev" }
    ],
    strictTestCommand: "pytest tests/test_fraud_stream.py --benchmark --max-p99=15ms",
    acceptanceGates: [
      { rule: "P99 Latency", threshold: "<= 15ms", description: "Transaction scoring P99 latency must remain under 15ms." }
    ],
    productionSla: "P99 latency < 15ms, 99.99% availability."
  },
  {
    id: "p9",
    slug: "sparse-dense-hybrid-qdrant-reranker",
    title: "Multi-Hop GraphRAG & Knowledge Topology Gateway",
    tagline: "Multi-hop Knowledge Graph + Vector hybrid retrieval indexing 1M+ scientific papers with Leiden community clustering and RRF fusion.",
    difficulty: "Hard",
    domain: "GraphRAG & Knowledge Topology",
    durationDays: 45,
    techStack: ["Neo4j", "Qdrant", "LangGraph", "FastAPI", "BM25", "SentenceTransformers", "BGE Re-ranker", "Docker"],
    partnerTools: ["Qdrant", "Docker", "PostgreSQL"],
    targetRoles: ["AI Engineer", "Backend Dev", "Data & Financial ML", "QA Tester"],
    keywords: ["graphrag", "knowledge graph", "neo4j", "qdrant", "hybrid search", "rrf", "reranking", "rag", "langgraph"],
    overview: "Construct an enterprise GraphRAG search gateway. Extract entity-relationship triplets from 1M+ scientific documents into Neo4j, generate hybrid dense (BGE-M3) and sparse (BM25) embeddings indexed in Qdrant, and fuse search results using Reciprocal Rank Fusion (RRF) with cross-encoder re-ranking.",
    architectureNotes: "Document Ingest -> LLM Triplet Extraction -> Neo4j Knowledge Graph -> Qdrant Dense+Sparse Index -> Reciprocal Rank Fusion (RRF) -> BGE Cross-Encoder -> Synthesized Response.",
    databaseSchema: [
      "entities (id UUID PK, name VARCHAR, entity_type VARCHAR, embedding VECTOR(1024))",
      "relationships (id UUID PK, source_entity UUID, target_entity UUID, relation_type VARCHAR, weight NUMERIC)",
      "document_chunks (id UUID PK, doc_id UUID, chunk_text TEXT, qdrant_point_id VARCHAR)"
    ],
    apiEndpoints: [
      { method: "POST", path: "/api/v1/graphrag/ingest-documents", description: "Batch ingest and extract graph triplets." },
      { method: "POST", path: "/api/v1/graphrag/query", description: "Execute multi-hop graph retrieval with RRF fusion." }
    ],
    milestones: [
      { phase: "Phase 1: Neo4j Graph Construction", days: "Days 1-15", goal: "Extract and index 500k entity triplets with Leiden community detection.", deliverables: ["Neo4j graph schema", "Extraction scripts"] },
      { phase: "Phase 2: Qdrant Hybrid Dense-Sparse Index", days: "Days 16-30", goal: "Index multi-modal embeddings and implement RRF fusion scoring.", deliverables: ["Qdrant hybrid search module", "RRF algorithm"] },
      { phase: "Phase 3: Multi-Hop Retrieval & Evaluation", days: "Days 31-45", goal: "Benchmark against vanilla RAG using RAGAS faithfulness metrics.", deliverables: ["FastAPI service", "RAGAS benchmark report"] }
    ],
    evaluationCriteria: [
      { metric: "RAGAS Faithfulness & Context Recall", weight: 50, description: "RAGAS Faithfulness >= 0.91 and Context Recall >= 0.89 on multi-hop questions." },
      { metric: "Search Latency", weight: 30, description: "Sub-450ms end-to-end multi-hop graph search latency." },
      { metric: "Test Suite", weight: 20, description: "Comprehensive automated test harness." }
    ],
    learningResources: [
      { title: "From Local to Global: A Graph RAG Approach to Query-Focused Summarization (Microsoft)", type: "Research Paper", url: "https://arxiv.org/abs/2404.16130" }
    ],
    strictTestCommand: "pytest tests/test_graphrag.py --min-faithfulness=0.91",
    acceptanceGates: [
      { rule: "Faithfulness", threshold: ">= 0.91", description: "Generated answer faithfulness score must exceed 91%." }
    ],
    productionSla: "P95 latency < 500ms, 99.9% uptime."
  },
  {
    id: "p10",
    slug: "high-frequency-order-book-matching-engine",
    title: "Sub-10ms High-Frequency Market Telemetry & Limit Order Book",
    tagline: "Ultra-low-latency L2 market depth engine in Rust/Python handling 50,000 orders/sec with zero drift, FIFO matching, and WebSocket feeds.",
    difficulty: "Insane",
    domain: "High-Frequency Telemetry",
    durationDays: 45,
    featured: true,
    techStack: ["Rust", "Python", "WebSockets", "PostgreSQL", "Redis Streams", "Docker", "AsyncIO"],
    partnerTools: ["Redis", "PostgreSQL", "Docker"],
    targetRoles: ["Backend Dev", "Data & Financial ML", "Cloud DevOps", "Pen-tester"],
    keywords: ["rust", "limit order book", "high frequency trading", "matching engine", "l2 depth", "websockets", "low latency"],
    overview: "Engineer an institutional-grade Level-2 (L2) Limit Order Book matching engine in Rust. Implement price-time priority (FIFO) matching, lock-free memory arenas, atomic order state updates, cancel/replace operations, and real-time market depth streaming at 50,000 orders/sec with sub-5ms P99 latency.",
    architectureNotes: "WebSocket / TCP Ingest -> Lock-Free Ring Buffer -> Rust L2 Limit Order Book (BTreeMap + Arena Allocator) -> Matching Engine Core -> Fill Execution Engine -> WebSocket L2 Depth Broadcast -> PostgreSQL Trade Ledger.",
    databaseSchema: [
      "orders (id UUID PK, account_id UUID, symbol VARCHAR, side VARCHAR, order_type VARCHAR, price NUMERIC, quantity INT, status VARCHAR, created_at BIGINT)",
      "trades (id UUID PK, symbol VARCHAR, buyer_order_id UUID, seller_order_id UUID, execution_price NUMERIC, quantity INT, executed_at BIGINT)"
    ],
    apiEndpoints: [
      { method: "POST", path: "/api/v1/trade/place-order", description: "Submit Limit/Market order for sub-5ms matching." },
      { method: "POST", path: "/api/v1/trade/cancel-order", description: "Cancel active order in the L2 book." },
      { method: "GET", path: "/ws/market-depth/{symbol}", description: "High-frequency WebSocket feed of top 20 bid/ask levels." }
    ],
    milestones: [
      { phase: "Phase 1: Rust Core Order Book & Memory Allocator", days: "Days 1-15", goal: "Implement lock-free BTreeMap order book with FIFO priority.", deliverables: ["Rust matching core", "Single-thread microbenchmarks"] },
      { phase: "Phase 2: Multi-threaded Ingest & Fill Ledger", days: "Days 16-30", goal: "Handle concurrent order submissions via crossbeam channels.", deliverables: ["Multi-threaded engine", "Stress test results"] },
      { phase: "Phase 3: WebSocket L2 Market Depth & Python Gateway", days: "Days 31-45", goal: "Stream 50k updates/sec to WebSocket clients with zero drift.", deliverables: ["WebSocket server", "k6 load test suite"] }
    ],
    evaluationCriteria: [
      { metric: "Throughput (Ops/sec)", weight: 45, description: "Sustain >= 50,000 order operations/sec without memory fragmentation." },
      { metric: "P99 Execution Latency", weight: 35, description: "P99 matching latency <= 5.0ms under full load." },
      { metric: "Deterministic Correctness", weight: 20, description: "100% pass on race condition stress tests." }
    ],
    learningResources: [
      { title: "Building Low Latency Limit Order Books in Rust", type: "YouTube Video", url: "https://www.youtube.com/watch?v=Rust_LOB_Engine" }
    ],
    strictTestCommand: "cargo test --release && pytest tests/test_matching_engine.py --benchmark",
    acceptanceGates: [
      { rule: "P99 Latency", threshold: "<= 5.0ms", description: "P99 order execution latency must not exceed 5ms." },
      { rule: "Throughput", threshold: ">= 50,000 ops/s", description: "Engine must process at least 50k ops/sec." }
    ],
    productionSla: "P99 latency < 5ms at 50k ops/sec, zero state drift."
  },
  {
    id: "p11",
    slug: "autonomous-redteam-cybersecurity-agent-swarm",
    title: "Autonomous Red-Team Pen-Testing & Vulnerability Swarm",
    tagline: "Multi-agent offensive security swarm discovering OWASP Top 10, SSRF, IDOR, and Prompt Injections in isolated Docker sandboxes.",
    difficulty: "Hard",
    domain: "Autonomous Red-Team Cybersecurity",
    durationDays: 45,
    techStack: ["Python", "FastAPI", "LangGraph", "Docker", "OWASP ZAP", "Burp Suite API", "Bash", "Pydantic"],
    partnerTools: ["Docker", "FastAPI"],
    targetRoles: ["Pen-tester", "Cloud DevOps", "Backend Dev", "QA Tester"],
    keywords: ["red team", "cybersecurity", "penetration testing", "owasp", "ssrf", "idor", "agent swarm", "docker sandbox"],
    overview: "Build an autonomous AI offensive security swarm. Deploy specialized agent nodes (Reconnaissance, Attack Surface Mapping, Exploit Payload Synthesis, Verification Sandbox) that clone target repositories, launch automated penetration tests, verify exploits inside isolated Docker containers, and generate remediation pull requests.",
    architectureNotes: "Target URL / Git Repo -> Recon Agent (Port & Subdomain Scan) -> Attack Surface Graph -> Exploit Synthesis Agent (LLM + Payload DB) -> Docker Sandbox Execution Gate -> Remediation Patch Generator.",
    databaseSchema: [
      "scan_targets (id UUID PK, target_url VARCHAR, repo_url TEXT, authorized_at TIMESTAMP, scan_status VARCHAR)",
      "discovered_vulnerabilities (id UUID PK, target_id UUID FK, cve_identifier VARCHAR, owasp_category VARCHAR, cvss_score NUMERIC, reproduction_steps TEXT, verified_in_sandbox BOOLEAN, patch_diff TEXT)"
    ],
    apiEndpoints: [
      { method: "POST", path: "/api/v1/security/start-scan", description: "Initiate autonomous red-team swarm audit." },
      { method: "GET", path: "/api/v1/security/vulnerabilities/{scanId}", description: "Fetch verified vulnerability reports with CVSS scoring." }
    ],
    milestones: [
      { phase: "Phase 1: Recon & Attack Surface Mapping Agent", days: "Days 1-12", goal: "Automate endpoint discovery and API schema extraction.", deliverables: ["Reconnaissance agent", "Attack surface graph"] },
      { phase: "Phase 2: Exploit Synthesis & Docker Sandboxing", days: "Days 13-28", goal: "Safely execute SSRF, SQLi, and IDOR exploits in isolated containers.", deliverables: ["Sandboxed execution harness", "Exploit verifier"] },
      { phase: "Phase 3: Automated Patch Generation & Report API", days: "Days 29-45", goal: "Generate git diff security patches and deploy API.", deliverables: ["FastAPI service", "Sample security audit report"] }
    ],
    evaluationCriteria: [
      { metric: "Exploit Verification Precision", weight: 50, description: "Zero false positive exploit claims; every vulnerability must be verified inside the Docker sandbox." },
      { metric: "Remediation Quality", weight: 30, description: "Generated patches must successfully resolve the vulnerability without breaking unit tests." },
      { metric: "Security Controls", weight: 20, description: "Strict sandbox containment preventing outbound egress during exploit trials." }
    ],
    learningResources: [
      { title: "Building Autonomous Security Agents with LangGraph & Docker", type: "Documentation", url: "https://owasp.org/www-project-top-ten/" }
    ],
    strictTestCommand: "pytest tests/test_security_swarm.py --validate-sandbox-containment",
    acceptanceGates: [
      { rule: "Exploit False Positive Rate", threshold: "0%", description: "All flagged vulnerabilities must have executable reproduction proofs." }
    ],
    productionSla: "Complete full 100-endpoint web app audit in < 8 minutes."
  },
  {
    id: "p12",
    slug: "langgraph-sql-multiagent-checkpointer",
    title: "Deterministic Agent State Machine & Postgres Checkpointer",
    tagline: "State-machine agent graph with persistent PostgreSQL checkpoints, time-travel rollbacks, and sandboxed tool execution.",
    difficulty: "Hard",
    domain: "AI Agents & State Machines",
    durationDays: 45,
    techStack: ["LangGraph", "FastAPI", "PostgreSQL", "Redis Streams", "Docker", "Pydantic", "OpenTelemetry"],
    partnerTools: ["PostgreSQL", "Redis", "Docker"],
    targetRoles: ["AI Engineer", "Backend Dev", "QA Tester", "Product Manager"],
    keywords: ["langgraph", "ai agents", "state machine", "checkpointer", "postgresql", "time travel", "fastapi", "opentelemetry"],
    overview: "Build a deterministic multi-agent state graph platform. Implement persistent PostgreSQL state checkpoints, time-travel rollbacks to previous conversational nodes, human-in-the-loop tool approval gates, and distributed telemetry tracing using OpenTelemetry.",
    architectureNotes: "Client Input -> LangGraph State Engine -> PostgreSQL Checkpoint Storage -> Sandboxed Tool Executors -> Human Approval Queue -> OpenTelemetry Distributed Tracer.",
    databaseSchema: [
      "agent_threads (id UUID PK, user_id UUID, created_at TIMESTAMP, metadata JSONB)",
      "checkpoints (thread_id UUID FK, checkpoint_id VARCHAR, parent_checkpoint_id VARCHAR, state_blob JSONB, node_name VARCHAR, created_at TIMESTAMP)"
    ],
    apiEndpoints: [
      { method: "POST", path: "/api/v1/agent/run-step", description: "Execute next state machine transition." },
      { method: "POST", path: "/api/v1/agent/rollback", description: "Time-travel rollback to designated checkpoint ID." }
    ],
    milestones: [
      { phase: "Phase 1: LangGraph Postgres Checkpointer Core", days: "Days 1-15", goal: "Implement transactional state serialization and rollback logic.", deliverables: ["PostgreSQL checkpointer", "Time-travel unit tests"] },
      { phase: "Phase 2: Multi-Agent Coordination & Tool Sandbox", days: "Days 16-30", goal: "Coordinate 3 specialized agent nodes with human approval gates.", deliverables: ["Multi-agent graph", "Approval API"] },
      { phase: "Phase 3: OpenTelemetry Tracing & Cloud Deploy", days: "Days 31-45", goal: "Integrate distributed tracing and deploy on AWS.", deliverables: ["Live API", "Jaeger trace dashboard"] }
    ],
    evaluationCriteria: [
      { metric: "State Recovery Determinism", weight: 45, description: "100% bit-for-bit identical state reproduction across 1,000 simulated process crashes." },
      { metric: "Checkpoint Overhead", weight: 35, description: "PostgreSQL state save latency <= 18ms." },
      { metric: "Trace Observability", weight: 20, description: "Full span coverage across all agent state transitions." }
    ],
    learningResources: [
      { title: "LangGraph Persistence & Time Travel Architecture", type: "Documentation", url: "https://langchain-ai.github.io/langgraph/" }
    ],
    strictTestCommand: "pytest tests/test_agent_checkpoints.py --stress-crash-recovery",
    acceptanceGates: [
      { rule: "Crash Recovery", threshold: "100%", description: "Zero state corruption during sudden worker termination." }
    ],
    productionSla: "99.99% state persistence reliability, checkpoint latency < 20ms."
  },
  {
    id: "p13",
    slug: "webgpu-edge-slm-browser-inference",
    title: "Browser-Native SLM Privacy Engine with WebGPU Shaders",
    tagline: "Run 4-bit SmolLM2 / Gemma on-device inside Next.js using WebGPU compute shaders and IndexedDB sharded caching.",
    difficulty: "Insane",
    domain: "WebGPU Edge SLMs",
    durationDays: 45,
    techStack: ["Next.js 16", "WebGPU", "Transformers.js v3", "IndexedDB", "TypeScript", "TailwindCSS"],
    partnerTools: ["Next.js", "Docker"],
    targetRoles: ["Frontend Dev", "AI Engineer", "QA Tester", "Product Manager"],
    keywords: ["webgpu", "slm", "edge ai", "transformers.js", "privacy", "next.js", "indexeddb", "browser ml"],
    overview: "Build an air-gapped, zero-server-cost local AI application. Execute quantized 4-bit SmolLM2 / Gemma models entirely inside the user's browser using WebGPU compute shaders, store model weights in sharded IndexedDB chunks, and stream text at > 25 tokens/second with zero data egress.",
    architectureNotes: "Browser Client -> WebGPU Compute Shader Pipeline -> IndexedDB Sharded Model Cache -> Transformers.js v3 Runtime -> Zero-Egress Local Inference.",
    databaseSchema: [
      "Browser IndexedDB Stores: model_weights_shards (shard_id, chunk_blob), local_conversation_history (id, prompt, response, tokens_per_sec)"
    ],
    apiEndpoints: [
      { method: "GET", path: "/client-only", description: "Zero server endpoints; all compute runs on user's GPU hardware." }
    ],
    milestones: [
      { phase: "Phase 1: WebGPU Runtime & Sharded Model Cache", days: "Days 1-15", goal: "Implement progressive model downloader with IndexedDB resumption.", deliverables: ["IndexedDB chunk cache", "WebGPU device adapter"] },
      { phase: "Phase 2: 4-Bit Quantized Inference Pipeline", days: "Days 16-30", goal: "Achieve >= 25 tokens/sec generation on Apple Silicon / RTX hardware.", deliverables: ["Transformers.js v3 engine", "Token throughput benchmarks"] },
      { phase: "Phase 3: Privacy Verification & Zero-Egress UI", days: "Days 31-45", goal: "Build Next.js interface with network inspection proving 0B outbound traffic.", deliverables: ["Next.js production web app", "Zero-egress proof report"] }
    ],
    evaluationCriteria: [
      { metric: "Generation Throughput", weight: 45, description: ">= 25 tokens/second on M-series / RTX hardware." },
      { metric: "First Load Time", weight: 35, description: "Cached model boot time <= 1.2 seconds from IndexedDB." },
      { metric: "Zero Egress Compliance", weight: 20, description: "Strict CSP blocking all outbound HTTP calls during text generation." }
    ],
    learningResources: [
      { title: "WebGPU Deep Learning & Transformers.js v3", type: "Documentation", url: "https://huggingface.co/docs/transformers.js" }
    ],
    strictTestCommand: "npx playwright test tests/test_webgpu_inference.spec.ts",
    acceptanceGates: [
      { rule: "Token Speed", threshold: ">= 25 tok/s", description: "Local generation must achieve >= 25 tokens/sec on modern GPUs." }
    ],
    productionSla: "100% client-side privacy, zero server egress cost."
  },
  {
    id: "p14",
    slug: "distributed-load-testing-qa-mesh",
    title: "Distributed k6 Performance & Playwright Quality Mesh",
    tagline: "Industrial test automation harness: Parallel Playwright browser matrix + k6 distributed load testing (10,000 VUs) in GitHub Actions.",
    difficulty: "Intermediate",
    domain: "QA Mesh & Distributed Load",
    durationDays: 45,
    techStack: ["Playwright", "k6", "TypeScript", "GitHub Actions", "Docker", "Grafana", "Node.js"],
    partnerTools: ["Docker", "GitHub"],
    targetRoles: ["QA Tester", "Cloud DevOps", "Backend Dev", "Product Manager"],
    keywords: ["playwright", "k6", "qa automation", "distributed load testing", "github actions", "grafana", "performance"],
    overview: "Build an automated quality engineering infrastructure. Author an end-to-end Playwright visual regression suite across Chromium/WebKit/Firefox, orchestrate distributed k6 load testing generating 10,000 virtual users against microservices, and stream real-time metrics to Grafana dashboards.",
    architectureNotes: "GitHub Actions Matrix -> Parallel Playwright Worker Grid -> Distributed k6 Load Cluster (10k VUs) -> InfluxDB Metrics -> Grafana Dashboard -> Slack / Discord Webhook Failure Dispatch.",
    databaseSchema: [
      "test_runs (id UUID PK, suite_name VARCHAR, total_tests INT, passed INT, failed INT, duration_ms INT, created_at TIMESTAMP)",
      "performance_benchmarks (id UUID PK, test_run_id UUID FK, virtual_users INT, p95_response_time_ms NUMERIC, error_rate_pct NUMERIC)"
    ],
    apiEndpoints: [
      { method: "POST", path: "/api/v1/qa/trigger-suite", description: "Trigger distributed k6 load test from CI/CD webhook." },
      { method: "GET", path: "/api/v1/qa/health-report", description: "Fetch aggregate flaky test rates and performance regression deltas." }
    ],
    milestones: [
      { phase: "Phase 1: Playwright Cross-Browser Matrix", days: "Days 1-15", goal: "Author 50+ resilient E2E tests with visual snapshot diffing.", deliverables: ["Playwright test suite", "HTML reporter"] },
      { phase: "Phase 2: Distributed k6 Load Generator (10k VUs)", days: "Days 16-30", goal: "Simulate 10,000 concurrent user spikes and identify API bottlenecks.", deliverables: ["k6 load script suite", "Grafana dashboard"] },
      { phase: "Phase 3: GitHub Actions CI/CD Quality Gate", days: "Days 31-45", goal: "Enforce automated merge blocks on > 2% latency regression.", deliverables: ["GitHub Actions workflow", "Automated Slack alerts"] }
    ],
    evaluationCriteria: [
      { metric: "Test Suite Stability (Zero Flakiness)", weight: 45, description: "Flaky test failure rate < 0.1% over 50 consecutive CI runs." },
      { metric: "Load Generation Capacity", weight: 35, description: "Successfully generate 10,000 sustained virtual users from container clusters." },
      { metric: "Observability Integration", weight: 20, description: "Real-time Grafana telemetry visualization." }
    ],
    learningResources: [
      { title: "Enterprise Playwright Testing Architecture", type: "Documentation", url: "https://playwright.dev" }
    ],
    strictTestCommand: "npx playwright test && k6 run tests/load_test_10k.js",
    acceptanceGates: [
      { rule: "E2E Pass Rate", threshold: "100%", description: "All Playwright E2E tests must pass cleanly." },
      { rule: "Load Error Rate", threshold: "< 0.5%", description: "k6 load test error rate must remain under 0.5% at 10,000 VUs." }
    ],
    productionSla: "Automated regression feedback in < 3 minutes on pull requests."
  },
  {
    id: "p15",
    slug: "kernel-ebpf-chaos-selfhealing-sentinel",
    title: "Autonomous Self-Healing Microservices with eBPF Kernel Probes",
    tagline: "Go To Hell Tier (Insane). Rust eBPF kernel probes, autonomous anomaly mitigation, zero vibe-coding, 1 Lakh INR Prize Pool.",
    difficulty: "Go To Hell",
    domain: "Kernel eBPF & Autonomous Cloud",
    durationDays: 45,
    prizePool: "₹1,00,000 (5 Finalist Slots)",
    maxSlots: 5,
    techStack: ["Rust", "Python", "eBPF", "Kubernetes", "PostgreSQL", "Redis", "OpenTelemetry", "Docker"],
    partnerTools: ["Docker", "PostgreSQL", "Redis"],
    targetRoles: ["Cloud DevOps", "Backend Dev", "AI Engineer", "Pen-tester"],
    keywords: ["ebpf", "rust", "kernel", "self healing", "kubernetes", "chaos engineering", "opentelemetry", "expert tier"],
    overview: "The flagship Expert Tier system. Write low-level eBPF kernel probes in Rust (aya / libbpf) attached to Linux socket syscalls (tcp_connect, sys_enter_write). Detect anomalous network drops and memory leaks in distributed microservices, and execute autonomous sub-3s pod restarts with zero service downtime.",
    architectureNotes: "Linux Kernel Space -> Rust eBPF Probes (XDP / Tracepoints) -> eBPF Ring Buffer -> Userspace Rust Telemetry Daemon -> Anomaly Detection Core -> Kubernetes API Self-Healing Controller.",
    databaseSchema: [
      "kernel_telemetry_events (id BIGSERIAL PK, pid INT, comm VARCHAR(16), syscall_name VARCHAR(32), latency_ns BIGINT, error_code INT, recorded_at TIMESTAMP)",
      "self_healing_actions (id UUID PK, target_pod VARCHAR, trigger_anomaly VARCHAR, action_taken VARCHAR, recovery_time_ms INT, created_at TIMESTAMP)"
    ],
    apiEndpoints: [
      { method: "GET", path: "/api/v1/ebpf/kernel-events", description: "Stream real-time low-level Linux syscall metrics." },
      { method: "POST", path: "/api/v1/ebpf/chaos-inject", description: "Inject synthetic network drops and verify sub-3s autonomous recovery." }
    ],
    milestones: [
      { phase: "Phase 1: Rust eBPF Kernel Probe Development", days: "Days 1-15", goal: "Compile and load verified eBPF programs monitoring TCP socket lifecycles.", deliverables: ["Rust eBPF kernel module", "Verification logs"] },
      { phase: "Phase 2: Anomaly Detection Engine", days: "Days 16-30", goal: "Detect TCP retransmit storms and socket buffer exhaustion in userspace daemon.", deliverables: ["Telemetry daemon", "Benchmark report"] },
      { phase: "Phase 3: Autonomous Chaos Mitigation & Demo", days: "Days 31-45", goal: "Trigger Chaos Mesh injections and demonstrate sub-3s recovery on live cluster.", deliverables: ["Self-healing controller", "Live demonstration video"] }
    ],
    evaluationCriteria: [
      { metric: "Autonomous Recovery Speed", weight: 50, description: "Detect anomaly and complete pod mitigation in <= 3,000ms." },
      { metric: "Kernel Overhead", weight: 35, description: "eBPF probe CPU overhead <= 1.5% under 100k packet/sec load." },
      { metric: "Kernel Safety", weight: 15, description: "Zero kernel panics; strict compliance with Linux eBPF verifier." }
    ],
    learningResources: [
      { title: "Writing eBPF Programs in Rust with Aya", type: "Documentation", url: "https://aya-rs.dev" }
    ],
    strictTestCommand: "cargo test --release && python3 tests/test_ebpf_chaos.py",
    acceptanceGates: [
      { rule: "Self-Healing Time", threshold: "<= 3,000ms", description: "Autonomous system recovery must complete within 3 seconds." },
      { rule: "CPU Overhead", threshold: "<= 1.5%", description: "Probe execution must not exceed 1.5% CPU overhead." }
    ],
    productionSla: "Sub-3s MTTR (Mean Time to Recovery), zero downtime."
  },
  {
    id: "p16",
    slug: "webrtc-infinite-canvas-yjs-crdt",
    title: "Multiplayer WebRTC Canvas & CRDT Collaborative Whiteboard",
    tagline: "Ultra-responsive infinite canvas using Yjs Conflict-Free Replicated Data Types (CRDTs), WebSockets, and P2P WebRTC data channels.",
    difficulty: "Hard",
    domain: "Fullstack Web & Realtime Systems",
    durationDays: 45,
    techStack: ["Next.js 16", "TypeScript", "Yjs (CRDT)", "WebRTC", "WebSockets", "Canvas API", "Node.js", "Redis"],
    partnerTools: ["Next.js", "Redis"],
    targetRoles: ["Frontend Dev", "Fullstack Dev", "Backend Dev", "QA Tester"],
    keywords: ["webrtc", "crdt", "yjs", "multiplayer", "canvas", "websockets", "collaborative", "next.js"],
    overview: "Build an infinite collaborative vector whiteboard. Implement Yjs Conflict-Free Replicated Data Types (CRDTs) over WebRTC data channels and WebSocket signaling to synchronize shapes, handwriting, and cursor positions across 100+ concurrent peers with zero merge conflicts.",
    architectureNotes: "Next.js Canvas Client -> Yjs CRDT State Manager -> WebRTC Mesh P2P Data Channels -> WebSocket Fallback Relay (Redis Pub/Sub) -> Persistent Vector Store.",
    databaseSchema: [
      "whiteboard_rooms (id UUID PK, name VARCHAR, owner_id UUID, yjs_state_snapshot BYTEA, updated_at TIMESTAMP)"
    ],
    apiEndpoints: [
      { method: "GET", path: "/api/v1/whiteboard/room/{id}", description: "Retrieve serialized CRDT document snapshot." }
    ],
    milestones: [
      { phase: "Phase 1: Infinite Canvas Rendering Engine", days: "Days 1-15", goal: "Build 60fps pan/zoom canvas rendering 10,000 shapes without lag.", deliverables: ["Canvas engine", "Viewport culling"] },
      { phase: "Phase 2: Yjs CRDT & WebRTC P2P Sync", days: "Days 16-30", goal: "Synchronize cursor vectors and geometric shapes with < 30ms latency.", deliverables: ["Yjs WebRTC provider", "Offline reconciliation test"] },
      { phase: "Phase 3: Cloud Persistence & Multiplayer Load", days: "Days 31-45", goal: "Deploy with Redis snapshotting and support 100 concurrent users per room.", deliverables: ["Next.js production app", "Load test report"] }
    ],
    evaluationCriteria: [
      { metric: "Synchronization Latency", weight: 45, description: "P95 P2P sync latency <= 30ms on local networks." },
      { metric: "Canvas Frame Rate", weight: 35, description: "Maintain 60fps rendering during continuous multi-cursor updates." },
      { metric: "Conflict Convergence", weight: 20, description: "100% deterministic document convergence across offline re-connections." }
    ],
    learningResources: [
      { title: "Yjs CRDT Real-Time Collaboration Guide", type: "Documentation", url: "https://docs.yjs.dev" }
    ],
    strictTestCommand: "npx playwright test tests/test_whiteboard_sync.spec.ts",
    acceptanceGates: [
      { rule: "Sync Latency", threshold: "<= 30ms", description: "P2P peer synchronization must execute in under 30ms." }
    ],
    productionSla: "60fps render loop, 99.9% room connection uptime."
  },
  {
    id: "p17",
    slug: "realtime-audio-dsp-complex-unet-speech",
    title: "Real-Time Streaming Audio DSP & Noise Reduction Engine",
    tagline: "Low-latency streaming speech enhancement in PyTorch / ONNX with spectral masking, deep recurrent neural networks, and WebRTC AEC.",
    difficulty: "Hard",
    domain: "Audio DSP & Speech AI",
    durationDays: 45,
    techStack: ["PyTorch", "ONNX Runtime", "librosa", "FastAPI", "WebRTC", "C++", "Docker"],
    partnerTools: ["Docker", "FastAPI"],
    targetRoles: ["AI Engineer", "Backend Dev", "Data & Financial ML"],
    keywords: ["audio dsp", "speech enhancement", "pytorch", "onnx", "webrtc", "noise reduction", "deep learning"],
    overview: "Build an ultra-low-latency speech enhancement engine. Process streaming raw PCM audio chunks (16kHz), compute Short-Time Fourier Transforms (STFT), apply a Complex U-Net neural network to suppress background noise by 24dB, and output reconstructed audio in < 20ms frame latency.",
    architectureNotes: "Audio Ingest (WebRTC / PCM) -> STFT Spectral Analysis -> Complex U-Net ONNX Model -> Inverse STFT Synthesis -> Enhanced Audio Output.",
    databaseSchema: [
      "audio_processing_sessions (id UUID PK, client_id VARCHAR, sample_rate_hz INT, snr_improvement_db NUMERIC, duration_seconds NUMERIC)"
    ],
    apiEndpoints: [
      { method: "POST", path: "/api/v1/audio/enhance-chunk", description: "Process 20ms raw PCM audio chunk and return cleaned audio." }
    ],
    milestones: [
      { phase: "Phase 1: STFT / iSTFT Streaming DSP Pipeline", days: "Days 1-15", goal: "Build real-time sliding-window spectral buffer with zero phase distortion.", deliverables: ["DSP pipeline module"] },
      { phase: "Phase 2: Complex U-Net ONNX Model Optimization", days: "Days 16-30", goal: "Quantize neural model to INT8 achieving < 8ms inference time.", deliverables: ["ONNX model", "PESQ & STOI benchmarks"] },
      { phase: "Phase 3: WebRTC Audio Gateway & Live Demo", days: "Days 31-45", goal: "Deploy streaming audio WebSocket server with sub-20ms total latency.", deliverables: ["Live demo app", "PESQ evaluation report"] }
    ],
    evaluationCriteria: [
      { metric: "PESQ Audio Quality Score", weight: 50, description: "PESQ >= 3.1 on noisy speech datasets (DNS Challenge benchmark)." },
      { metric: "Frame Processing Latency", weight: 35, description: "Total frame latency <= 20ms on single CPU core." },
      { metric: "Memory Efficiency", weight: 15, description: "Zero memory allocation inside the real-time audio loop." }
    ],
    learningResources: [
      { title: "Deep Learning for Audio Signal Processing", type: "Documentation", url: "https://librosa.org" }
    ],
    strictTestCommand: "pytest tests/test_audio_dsp.py --min-pesq=3.1 --max-latency=20ms",
    acceptanceGates: [
      { rule: "PESQ Score", threshold: ">= 3.1", description: "Audio quality PESQ must achieve at least 3.1." },
      { rule: "Latency", threshold: "<= 20ms", description: "Frame processing latency must remain under 20ms." }
    ],
    productionSla: "P99 latency < 20ms, 99.9% stream uptime."
  },
  {
    id: "p18",
    slug: "bms-lithium-thermal-runaway-predictor",
    title: "Battery Management System (BMS) Thermal Runaway Predictor",
    tagline: "Edge Kalman filter and LSTM model running on embedded ARM microcontrollers to detect voltage divergence 120 seconds before thermal runaway.",
    difficulty: "Hard",
    domain: "Clean Energy & Smart Grids",
    durationDays: 45,
    techStack: ["Embedded C++ / Rust", "TensorFlow Lite Micro", "MQTT", "Grafana", "Python", "Docker"],
    partnerTools: ["Docker", "Grafana"],
    targetRoles: ["AI Engineer", "Backend Dev", "Cloud DevOps"],
    keywords: ["bms", "battery", "thermal runaway", "ev", "kalman filter", "edge ai", "iot"],
    overview: "Develop an edge predictive safety system for EV battery packs. Ingest high-frequency cell voltage, current, and temperature streams via CAN bus / MQTT, run an Extended Kalman Filter to estimate State of Charge (SoC) and internal resistance, and predict cell thermal runaway 120 seconds before catastrophic failure.",
    architectureNotes: "CAN Bus Telemetry -> Edge Preprocessor (Rust) -> Extended Kalman Filter -> TFLite Micro LSTM -> MQTT Alert Dispatcher -> TimescaleDB.",
    databaseSchema: [
      "battery_telemetry (time TIMESTAMPTZ NOT NULL, pack_id VARCHAR(32), cell_voltages FLOAT[], current_a FLOAT, temp_c FLOAT[], soc_estimated FLOAT)",
      "thermal_alerts (id UUID PK, pack_id VARCHAR(32), predicted_runaway_time TIMESTAMPTZ, confidence FLOAT, severity VARCHAR)"
    ],
    apiEndpoints: [
      { method: "POST", path: "/api/v1/bms/telemetry", description: "Stream 100Hz battery cell voltage and temperature data." },
      { method: "GET", path: "/api/v1/bms/health/{packId}", description: "Query real-time internal resistance and runaway risk score." }
    ],
    milestones: [
      { phase: "Phase 1: Extended Kalman Filter SoC Engine", days: "Days 1-15", goal: "Implement equivalent circuit model for lithium-ion cells with < 2% SoC error.", deliverables: ["Rust EKF module"] },
      { phase: "Phase 2: LSTM Anomaly Detector on TFLite Micro", days: "Days 16-30", goal: "Train neural model to detect internal micro-shorts on synthetic runaway datasets.", deliverables: ["TFLite model artifact", "Evaluation metrics"] },
      { phase: "Phase 3: Real-Time MQTT Dashboard & Alerting", days: "Days 31-45", goal: "Deploy Grafana dashboard and sub-50ms alert dispatch system.", deliverables: ["Grafana telemetry board", "Dockerized pipeline"] }
    ],
    evaluationCriteria: [
      { metric: "Early Warning Lead Time", weight: 50, description: "Detect thermal runaway >= 120 seconds prior to critical temperature threshold." },
      { metric: "False Alarm Rate", weight: 30, description: "False positive alert rate < 0.1% under aggressive driving cycles." },
      { metric: "Edge Execution Speed", weight: 20, description: "Inference latency <= 15ms on ARM Cortex-M4 / Raspberry Pi." }
    ],
    learningResources: [
      { title: "Battery State of Health Estimation with Machine Learning", type: "Research Paper", url: "https://arxiv.org/abs/2103.15345" }
    ],
    strictTestCommand: "pytest tests/test_bms_predictor.py --min-lead-time=120s",
    acceptanceGates: [
      { rule: "Lead Time", threshold: ">= 120s", description: "Warning must trigger at least 120s prior to thermal runaway." }
    ],
    productionSla: "99.99% telemetry ingest availability, sub-50ms alert latency."
  },
  {
    id: "p19",
    slug: "intra-hour-solar-irradiance-forecaster",
    title: "Intra-Hour Solar Irradiance Forecasting with All-Sky Imagers",
    tagline: "Convolutional LSTM optical flow model processing ground-based all-sky camera video to forecast solar output dips 15 minutes in advance.",
    difficulty: "Hard",
    domain: "Clean Energy & Smart Grids",
    durationDays: 45,
    techStack: ["PyTorch", "OpenCV", "DuckDB", "FastAPI", "Docker", "Python"],
    partnerTools: ["Docker", "FastAPI"],
    targetRoles: ["AI Engineer", "Data & Financial ML", "Backend Dev"],
    keywords: ["solar", "clean energy", "optical flow", "all-sky camera", "convlstm", "forecasting"],
    overview: "Build a real-time solar farm power forecasting platform. Stream 4K all-sky video feeds, compute dense optical flow to track cloud vector velocity, and execute a ConvLSTM model predicting Global Horizontal Irradiance (GHI) drops 15 minutes ahead with Mean Absolute Percentage Error (MAPE) < 7.5%.",
    architectureNotes: "All-Sky Video Stream -> OpenCV Cloud Segmentation -> Dense Optical Flow Vector Grid -> ConvLSTM Forecast Model -> Solar Power Inverter Estimator -> Grid Balancing API.",
    databaseSchema: [
      "solar_farms (id UUID PK, name VARCHAR, capacity_mw NUMERIC, lat NUMERIC, lon NUMERIC)",
      "irradiance_forecasts (id UUID PK, farm_id UUID FK, forecast_time TIMESTAMP, predicted_ghi NUMERIC, actual_ghi NUMERIC, cloud_coverage_pct NUMERIC)"
    ],
    apiEndpoints: [
      { method: "POST", path: "/api/v1/solar/ingest-sky-frame", description: "Ingest fish-eye sky camera frame." },
      { method: "GET", path: "/api/v1/solar/forecast-15min", description: "Retrieve 15-minute ahead GHI prediction curve." }
    ],
    milestones: [
      { phase: "Phase 1: Cloud Segmentation & Sun-Masking", days: "Days 1-15", goal: "Segment thick/thin clouds and mask saturated solar disc.", deliverables: ["OpenCV segmentation pipeline"] },
      { phase: "Phase 2: ConvLSTM Spatial Forecast Model", days: "Days 16-30", goal: "Train deep spatio-temporal model predicting cloud shadow maps.", deliverables: ["PyTorch model checkpoint", "MAPE evaluation"] },
      { phase: "Phase 3: Grid Balancing API & Staging Deploy", days: "Days 31-45", goal: "Deploy FastAPI service streaming live forecasts to power grid dispatchers.", deliverables: ["FastAPI service", "Interactive forecast chart"] }
    ],
    evaluationCriteria: [
      { metric: "15-Minute Forecast MAPE", weight: 50, description: "MAPE <= 7.5% evaluated across partly cloudy test days." },
      { metric: "Frame Pipeline Throughput", weight: 30, description: "Process and forecast from 4K frame in under 800ms." },
      { metric: "Code Cleanliness", weight: 20, description: "Modular code with complete pytest suite." }
    ],
    learningResources: [
      { title: "Solar Irradiance Nowcasting with All-Sky Imagers (NREL)", type: "Research Paper", url: "https://www.nrel.gov" }
    ],
    strictTestCommand: "pytest tests/test_solar_forecaster.py --max-mape=7.5",
    acceptanceGates: [
      { rule: "MAPE", threshold: "<= 7.5%", description: "Forecast MAPE must remain below 7.5%." }
    ],
    productionSla: "P95 latency < 800ms per forecast update."
  },
  {
    id: "p20",
    slug: "high-res-satellite-soil-moisture-retrieval",
    title: "High-Resolution Satellite Soil Moisture & Crop Yield Predictor",
    tagline: "Fuse Sentinel-1 SAR backscatter with Sentinel-2 NDVI to train an XGBoost regression model predicting soil moisture at 10m resolution.",
    difficulty: "Hard",
    domain: "Agritech & Precision Farming",
    durationDays: 45,
    techStack: ["Rasterio", "Sentinel-1 SAR", "XGBoost", "GeoPandas", "FastAPI", "Docker", "PostgreSQL PostGIS"],
    partnerTools: ["PostgreSQL", "Docker"],
    targetRoles: ["Data & Financial ML", "AI Engineer", "Backend Dev"],
    keywords: ["agritech", "soil moisture", "sentinel-1", "sar", "ndvi", "xgboost", "crop yield"],
    overview: "Build an automated soil moisture and drought monitoring pipeline. Extract dual-polarized VV/VH radar backscatter from Sentinel-1, co-register with Sentinel-2 optical NDVI, and train an XGBoost regressor predicting volumetric soil moisture percentage at 10m field resolution for crop insurance validation.",
    architectureNotes: "Sentinel-1 GRD & Sentinel-2 L2A Ingest -> GeoPandas Field Mask -> Feature Extraction (SAR Ratio + NDVI + Water Cloud Model) -> XGBoost Regressor -> PostGIS Geospatial Layer -> REST API.",
    databaseSchema: [
      "farm_parcels (id UUID PK, farmer_name VARCHAR, boundary GEOMETRY(POLYGON, 4326), crop_type VARCHAR, sowing_date DATE)",
      "soil_moisture_records (id UUID PK, parcel_id UUID FK, acquisition_date DATE, soil_moisture_pct NUMERIC, drought_risk_level VARCHAR)"
    ],
    apiEndpoints: [
      { method: "POST", path: "/api/v1/agri/analyze-parcel", description: "Compute current soil moisture for agricultural polygon." }
    ],
    milestones: [
      { phase: "Phase 1: SAR-Optical Co-Registration", days: "Days 1-15", goal: "Align Sentinel-1 and Sentinel-2 pixel grids across test agricultural zones.", deliverables: ["Co-registration scripts"] },
      { phase: "Phase 2: XGBoost Regression Model", days: "Days 16-30", goal: "Train regression model achieving RMSE < 0.04 m3/m3 against ground sensors.", deliverables: ["Model artifact", "RMSE validation report"] },
      { phase: "Phase 3: Farm Advisory API & Dashboard", days: "Days 31-45", goal: "Deploy geospatial API and interactive farm drought map.", deliverables: ["FastAPI service", "Interactive field map"] }
    ],
    evaluationCriteria: [
      { metric: "Soil Moisture RMSE", weight: 50, description: "RMSE <= 0.04 m3/m3 compared against in-situ soil moisture sensor probes." },
      { metric: "Geospatial Query Latency", weight: 30, description: "Calculate parcel metrics in < 400ms." },
      { metric: "Documentation", weight: 20, description: "Clear explanation of Water Cloud Model physics." }
    ],
    learningResources: [
      { title: "Synthetic Aperture Radar for Soil Moisture Retrieval", type: "Research Paper", url: "https://ieeexplore.ieee.org" }
    ],
    strictTestCommand: "pytest tests/test_soil_moisture.py --max-rmse=0.04",
    acceptanceGates: [
      { rule: "RMSE", threshold: "<= 0.04", description: "Model RMSE must remain under 0.04 m3/m3." }
    ],
    productionSla: "99.9% uptime, sub-400ms parcel queries."
  },
  {
    id: "p21",
    slug: "agricultural-pest-vision-mandi-pricing",
    title: "Agricultural Pest Vision & Rural Mandi Pricing Engine",
    tagline: "Deploy on-device YOLOv11 pest classification and multi-market Agmarknet time-series price forecasting for rural farmers.",
    difficulty: "Intermediate",
    domain: "Agritech & Precision Farming",
    durationDays: 45,
    techStack: ["PyTorch", "YOLOv11", "FastAPI", "PostgreSQL", "Prophet / Polars", "Docker"],
    partnerTools: ["PostgreSQL", "Docker"],
    targetRoles: ["AI Engineer", "Fullstack Dev", "Backend Dev"],
    keywords: ["pest detection", "mandi prices", "agritech", "yolov11", "agmarknet", "fastapi"],
    overview: "Build an all-in-one agricultural advisory platform. Train a YOLOv11 model to detect and classify 40 common Indian crop diseases and pests from smartphone camera photos in < 100ms, and build a time-series forecasting model for local Mandi wholesale prices using Agmarknet data.",
    architectureNotes: "Mobile Upload -> YOLOv11 Disease Inference Engine -> Chemical Treatment Recommender -> Agmarknet Price Forecaster -> Multi-Lingual Response Generator.",
    databaseSchema: [
      "crop_diseases (id UUID PK, crop_name VARCHAR, disease_name VARCHAR, symptoms TEXT, chemical_treatment TEXT, organic_treatment TEXT)",
      "mandi_prices (id BIGSERIAL PK, state VARCHAR, district VARCHAR, market VARCHAR, commodity VARCHAR, modal_price NUMERIC, arrival_date DATE)"
    ],
    apiEndpoints: [
      { method: "POST", path: "/api/v1/agri/diagnose-crop", description: "Classify crop pest from uploaded photograph." },
      { method: "GET", path: "/api/v1/agri/mandi-forecast/{commodity}", description: "Fetch 14-day Mandi wholesale price prediction." }
    ],
    milestones: [
      { phase: "Phase 1: Pest Vision Classifier", days: "Days 1-15", goal: "Train YOLOv11 model achieving mAP@50 >= 0.91 on Indian crop disease dataset.", deliverables: ["YOLOv11 model weights", "mAP report"] },
      { phase: "Phase 2: Mandi Price Time-Series Model", days: "Days 16-30", goal: "Ingest Agmarknet data and train price forecaster with MAPE < 8%.", deliverables: ["Price forecast model", "Evaluation scripts"] },
      { phase: "Phase 3: Multi-Lingual API Deployment", days: "Days 31-45", goal: "Deploy FastAPI service supporting Hindi and English advisory outputs.", deliverables: ["Live API", "Mobile-ready web UI"] }
    ],
    evaluationCriteria: [
      { metric: "Pest Detection mAP@50", weight: 50, description: "mAP@50 >= 0.91 on validation crop disease image dataset." },
      { metric: "Inference Latency", weight: 30, description: "Image diagnosis in < 120ms." },
      { metric: "User Experience", weight: 20, description: "Clean responsive mobile layout." }
    ],
    learningResources: [
      { title: "Plant Village Dataset & Crop Disease Classification", type: "Documentation", url: "https://plantvillage.psu.edu" }
    ],
    strictTestCommand: "pytest tests/test_agri_engine.py --min-map=0.91",
    acceptanceGates: [
      { rule: "mAP@50", threshold: ">= 0.91", description: "Pest detection model must achieve >= 0.91 mAP." }
    ],
    productionSla: "Sub-150ms image diagnosis latency, 99.9% uptime."
  },
  {
    id: "p22",
    slug: "ulip-multimodal-logistics-optimizer",
    title: "ULIP Multimodal Logistics Router & Freight Cost Optimizer",
    tagline: "Connect to the Unified Logistics Interface Platform (ULIP) API to optimize freight routes across rail, road, and port corridors.",
    difficulty: "Hard",
    domain: "Supply Chain & Logistics",
    durationDays: 45,
    techStack: ["Python", "NetworkX", "FastAPI", "PostgreSQL PostGIS", "Docker", "Redis"],
    partnerTools: ["PostgreSQL", "Redis", "Docker"],
    targetRoles: ["Backend Dev", "Data & Financial ML", "Fullstack Dev"],
    keywords: ["ulip", "logistics", "supply chain", "multimodal", "route optimization", "freight", "fastapi"],
    overview: "Build a national multimodal freight optimization engine. Ingest road toll, rail freight corridor, and maritime port schedules from the ULIP API, construct a multi-modal cost graph in NetworkX, and solve constrained shortest-path problems to reduce carbon emissions and freight transit costs by 18%.",
    architectureNotes: "ULIP API Ingest -> Multimodal Graph (Road/Rail/Port) -> Constrained Dijkstra / A* Optimizer -> Carbon & Cost Calculator -> Dispatch Tracking Webhook.",
    databaseSchema: [
      "logistics_nodes (id UUID PK, node_type VARCHAR, name VARCHAR, location GEOMETRY(POINT, 4326), handling_capacity_tons INT)",
      "freight_routes (id UUID PK, origin_node UUID FK, dest_node UUID FK, transport_mode VARCHAR, distance_km NUMERIC, transit_time_hours NUMERIC, cost_per_ton NUMERIC, co2_kg_per_ton NUMERIC)"
    ],
    apiEndpoints: [
      { method: "POST", path: "/api/v1/logistics/optimize-route", description: "Compute optimal multi-modal route given weight, budget, and deadline." }
    ],
    milestones: [
      { phase: "Phase 1: Multimodal Transport Graph Construction", days: "Days 1-15", goal: "Model Indian highway, dedicated freight rail, and port transit nodes.", deliverables: ["NetworkX graph module"] },
      { phase: "Phase 2: Multi-Objective Routing Algorithm", days: "Days 16-30", goal: "Implement Pareto-optimal route finder balancing cost, transit time, and CO2.", deliverables: ["Routing engine", "Benchmark tests"] },
      { phase: "Phase 3: Live ULIP Simulation & Deployment", days: "Days 31-45", goal: "Deploy cloud service returning routes in < 250ms with interactive map.", deliverables: ["FastAPI service", "Interactive route visualizer"] }
    ],
    evaluationCriteria: [
      { metric: "Cost Reduction vs Single-Mode", weight: 50, description: "Demonstrate >= 15% freight cost savings compared to pure road trucking." },
      { metric: "Routing Latency", weight: 30, description: "Calculate optimal route across 10,000 nodes in under 250ms." },
      { metric: "API Design", weight: 20, description: "Strict OpenAPI 3.0 specification conformance." }
    ],
    learningResources: [
      { title: "National Logistics Policy & ULIP Developer Portal", type: "Documentation", url: "https://gati-shakti.gov.in" }
    ],
    strictTestCommand: "pytest tests/test_logistics_router.py --max-latency=250ms",
    acceptanceGates: [
      { rule: "Calculation Latency", threshold: "< 250ms", description: "Route optimization must execute in under 250ms." }
    ],
    productionSla: "P95 latency < 250ms, 99.95% API availability."
  },
  {
    id: "p23",
    slug: "container-iso-ocr-port-inspection",
    title: "4K Container Code OCR & Automated Gate Inspection",
    tagline: "YOLOv11 text localization and CRNN sequence recognizer fine-tuned on weathered maritime shipping container metal surfaces.",
    difficulty: "Hard",
    domain: "Supply Chain & Logistics",
    durationDays: 45,
    techStack: ["PyTorch", "YOLOv11", "CRNN", "OpenCV", "FastAPI", "Docker"],
    partnerTools: ["Docker", "FastAPI"],
    targetRoles: ["AI Engineer", "Backend Dev", "Cloud DevOps"],
    keywords: ["ocr", "container", "maritime", "yolov11", "crnn", "computer vision", "ports"],
    overview: "Build an automated port gate optical inspection system. Process 4K security camera video streams of trucks entering container terminals, localize ISO 6346 container identification codes, correct perspective distortion on corrugated metal, and extract text with > 98.5% character recognition accuracy in < 80ms.",
    architectureNotes: "4K Video Stream -> YOLOv11 Code Localizer -> Perspective Homography Warper -> CRNN Text Recognizer -> ISO 6346 Checksum Validator -> Port Gate Webhook.",
    databaseSchema: [
      "gate_inspections (id UUID PK, gate_id VARCHAR, timestamp TIMESTAMP, raw_image_url TEXT, container_code VARCHAR(11), is_valid_iso BOOLEAN, confidence NUMERIC)"
    ],
    apiEndpoints: [
      { method: "POST", path: "/api/v1/ports/inspect-frame", description: "Extract and validate ISO 6346 container code from gate image." }
    ],
    milestones: [
      { phase: "Phase 1: Code Localization & Homography Warping", days: "Days 1-15", goal: "Detect container code boxes on corrugated surfaces and unwarp to flat 2D.", deliverables: ["Localization and warp module"] },
      { phase: "Phase 2: CRNN Sequence Recognition Model", days: "Days 16-30", goal: "Train CRNN model with CTC loss achieving > 98.5% character accuracy.", deliverables: ["CRNN weights", "Character accuracy report"] },
      { phase: "Phase 3: ISO 6346 Checksum Engine & API", days: "Days 31-45", goal: "Validate mathematical ISO checksum and deploy sub-80ms API.", deliverables: ["FastAPI service", "Stress test suite"] }
    ],
    evaluationCriteria: [
      { metric: "Container Code Recognition Accuracy", weight: 50, description: "Full 11-character code accuracy >= 95.0% on weathered maritime test images." },
      { metric: "Inference Latency", weight: 30, description: "Process 4K frame in < 80ms." },
      { metric: "Robustness", weight: 20, description: "Zero crash on corrupt or partially obscured images." }
    ],
    learningResources: [
      { title: "ISO 6346 Shipping Container Coding Standard", type: "Documentation", url: "https://en.wikipedia.org/wiki/ISO_6346" }
    ],
    strictTestCommand: "pytest tests/test_container_ocr.py --min-acc=95.0",
    acceptanceGates: [
      { rule: "Accuracy", threshold: ">= 95.0%", description: "Full code recognition accuracy must meet or exceed 95%." }
    ],
    productionSla: "P99 latency < 80ms per gate camera frame."
  },
  {
    id: "p24",
    slug: "riscv-instruction-simulator-emulator",
    title: "RISC-V Instruction Set Simulator & Microarchitecture Benchmark",
    tagline: "Cycle-accurate RV32I / RV64I instruction set emulator written in Rust with dynamic binary translation and cache hierarchy simulator.",
    difficulty: "Insane",
    domain: "Semiconductor & Embedded Edge",
    durationDays: 45,
    techStack: ["Rust", "C++", "LLVM", "Linux", "Docker"],
    partnerTools: ["Docker"],
    targetRoles: ["Backend Dev", "Cloud DevOps", "AI Engineer"],
    keywords: ["riscv", "rust", "emulator", "instruction set", "microarchitecture", "semiconductor", "cache simulation"],
    overview: "Build an instruction set simulator (ISS) for the open-source RISC-V architecture in Rust. Implement the RV64GC base instruction set, dynamic binary translation, multi-level L1/L2 cache latency simulation, and execute bare-metal ELF binaries and Linux kernel boots with cycle-accurate telemetry.",
    architectureNotes: "ELF Binary Loader -> Instruction Fetch & Decode -> Execution Pipeline -> Memory Subsystem (L1 Data/Instruction Cache + L2 Unified) -> CSR & Trap Handler -> Performance Counters.",
    databaseSchema: [
      "simulation_runs (id UUID PK, binary_name VARCHAR, total_cycles BIGINT, instructions_retired BIGINT, ipc NUMERIC, l1_dcache_miss_rate NUMERIC, l2_cache_miss_rate NUMERIC)"
    ],
    apiEndpoints: [
      { method: "POST", path: "/api/v1/riscv/execute-elf", description: "Execute RISC-V ELF binary and output microarchitectural performance report." }
    ],
    milestones: [
      { phase: "Phase 1: RV64I Base Integer Instruction Decoder", days: "Days 1-15", goal: "Implement all 47 base integer instructions and pass official RISC-V compliance tests.", deliverables: ["Rust decoder", "Official compliance test results"] },
      { phase: "Phase 2: Virtual Memory & L1/L2 Cache Hierarchy", days: "Days 16-30", goal: "Simulate MMU page tables and set-associative cache with LRU replacement.", deliverables: ["Cache simulator", "Memory latency benchmarks"] },
      { phase: "Phase 3: Bare-Metal ELF Execution & CLI", days: "Days 31-45", goal: "Execute compiled C programs and output detailed IPC and branch prediction reports.", deliverables: ["CLI tool", "Complete documentation"] }
    ],
    evaluationCriteria: [
      { metric: "RISC-V Compliance Test Suite", weight: 50, description: "100% pass on official riscv-tests repository for RV64I." },
      { metric: "Simulation Throughput", weight: 35, description: "Simulate >= 25 Million Instructions Per Second (MIPS) in userspace." },
      { metric: "Code Elegance", weight: 15, description: "Idiomatic Rust with zero unsafe blocks outside memory allocators." }
    ],
    learningResources: [
      { title: "The RISC-V Reader: An Open Architecture Atlas", type: "Documentation", url: "https://riscv.org" }
    ],
    strictTestCommand: "cargo test --release && ./tests/run_riscv_compliance.sh",
    acceptanceGates: [
      { rule: "Compliance Pass", threshold: "100%", description: "Must pass 100% of official RISC-V architectural tests." }
    ],
    productionSla: "Simulation speed > 25 MIPS on x86_64 host hardware."
  },
  {
    id: "p25",
    slug: "tree-sitter-ast-architectural-code-reviewer",
    title: "AST-Guided Architectural Code Review & Failure Explainer",
    tagline: "Tree-Sitter AST parser + LangGraph reviewer detecting cyclomatic complexity, memory leaks, and anti-patterns with actionable hints.",
    difficulty: "Hard",
    domain: "EdTech & Developer Tooling",
    durationDays: 45,
    techStack: ["Python", "Tree-Sitter", "LangGraph", "FastAPI", "Docker", "Next.js"],
    partnerTools: ["Docker", "FastAPI"],
    targetRoles: ["AI Engineer", "Backend Dev", "Fullstack Dev", "QA Tester"],
    keywords: ["tree-sitter", "ast", "code review", "static analysis", "langgraph", "edtech", "compiler"],
    overview: "Build an automated architectural code grading and review engine for computer science students. Parse code diffs into Abstract Syntax Trees (ASTs) using Tree-Sitter, detect algorithmic anti-patterns (O(N^2) loops, unclosed database handles, race conditions), and use LangGraph to generate educational hints without leaking direct solutions.",
    architectureNotes: "Git Diff Ingest -> Tree-Sitter AST Parser -> Static Pattern Matcher -> LangGraph Educational Reviewer -> Socratic Hint Synthesizer -> GitHub PR Comment Bot.",
    databaseSchema: [
      "code_reviews (id UUID PK, repo_name VARCHAR, commit_sha VARCHAR, cyclomatic_complexity INT, anti_patterns_detected JSONB, generated_hints TEXT, student_rating INT)"
    ],
    apiEndpoints: [
      { method: "POST", path: "/api/v1/reviewer/analyze-diff", description: "Parse AST and generate architectural feedback on pull request." }
    ],
    milestones: [
      { phase: "Phase 1: Tree-Sitter Multi-Language AST Parser", days: "Days 1-15", goal: "Extract AST nodes for Python, TypeScript, and Rust files.", deliverables: ["Tree-sitter parser module"] },
      { phase: "Phase 2: Static Anti-Pattern & Complexity Detector", days: "Days 16-30", goal: "Detect 25+ architectural code smells using AST traversal.", deliverables: ["Pattern detector", "Test suite"] },
      { phase: "Phase 3: Socratic Hint Agent & GitHub App", days: "Days 31-45", goal: "Deploy GitHub webhook bot posting educational hints on student PRs.", deliverables: ["GitHub Webhook App", "FastAPI backend"] }
    ],
    evaluationCriteria: [
      { metric: "Anti-Pattern Detection Precision", weight: 50, description: "Precision >= 95% on benchmark dataset of 500 student code submissions." },
      { metric: "Analysis Latency", weight: 30, description: "Complete AST parsing and review in under 1.8 seconds per PR." },
      { metric: "Socratic Hint Quality", weight: 20, description: "Zero instances of directly revealing final solution code." }
    ],
    learningResources: [
      { title: "Tree-Sitter Language Grammar & AST Documentation", type: "Documentation", url: "https://tree-sitter.github.io/tree-sitter/" }
    ],
    strictTestCommand: "pytest tests/test_ast_reviewer.py --min-precision=0.95",
    acceptanceGates: [
      { rule: "Precision", threshold: ">= 95%", description: "Static anti-pattern detection precision must exceed 95%." }
    ],
    productionSla: "P95 analysis latency < 2.0s per code commit."
  },
  {
    id: "p26",
    slug: "microvm-isolated-code-execution-sandbox",
    title: "Automated Isolated Code Execution Sandbox with MicroVMs",
    tagline: "Build a Firecracker / gVisor isolated code execution sandbox with cgroups v2 resource quotas, seccomp filters, and sub-100ms cold boot.",
    difficulty: "Insane",
    domain: "EdTech & Developer Tooling",
    durationDays: 45,
    techStack: ["Rust / Go", "gVisor / Firecracker", "Linux cgroups v2", "Docker", "FastAPI", "Redis"],
    partnerTools: ["Docker", "Redis"],
    targetRoles: ["Cloud DevOps", "Backend Dev", "Pen-tester"],
    keywords: ["firecracker", "gvisor", "sandbox", "microvm", "cgroups", "seccomp", "code execution", "security"],
    overview: "Build an industrial untrusted code evaluation runtime. Use gVisor / Firecracker microVMs to execute arbitrary student Python/C++/Rust code in complete isolation, enforcing strict cgroups v2 memory (256MB) and CPU (1.0 core) limits, seccomp syscall filtering, and sub-100ms container startup times.",
    architectureNotes: "Code Submission -> API Rate Limiter -> gVisor / Firecracker Sandbox Allocator -> Seccomp Syscall Filter -> Output Capturer -> Ephemeral Cleanup Daemon.",
    databaseSchema: [
      "sandbox_executions (id UUID PK, language VARCHAR, code_hash VARCHAR, execution_time_ms INT, memory_used_mb NUMERIC, exit_code INT, stdout TEXT, stderr TEXT)"
    ],
    apiEndpoints: [
      { method: "POST", path: "/api/v1/sandbox/execute", description: "Execute untrusted code in isolated ephemeral microVM." }
    ],
    milestones: [
      { phase: "Phase 1: gVisor / Firecracker Isolation Harness", days: "Days 1-15", goal: "Launch isolated runtimes blocking network access and host filesystem mounts.", deliverables: ["Isolation harness", "Escape attempt tests"] },
      { phase: "Phase 2: cgroups v2 & Seccomp Profile", days: "Days 16-30", goal: "Enforce strict memory caps and block fork-bombs / unauthorized syscalls.", deliverables: ["Seccomp filter", "Resource limiter tests"] },
      { phase: "Phase 3: High-Throughput Queue & Cloud Deploy", days: "Days 31-45", goal: "Handle 200 concurrent executions with sub-100ms startup overhead.", deliverables: ["FastAPI service", "k6 concurrency benchmark"] }
    ],
    evaluationCriteria: [
      { metric: "Sandbox Security Containment", weight: 50, description: "100% containment pass on 20 known container escape techniques." },
      { metric: "Cold Boot Latency", weight: 35, description: "MicroVM startup and execution initiation <= 100ms." },
      { metric: "Resource Enforcement", weight: 15, description: "Zero host memory degradation under intentional memory leak attacks." }
    ],
    learningResources: [
      { title: "Firecracker MicroVM Architecture & Security", type: "Documentation", url: "https://firecracker-microvm.github.io" }
    ],
    strictTestCommand: "pytest tests/test_sandbox_security.py --run-escape-tests",
    acceptanceGates: [
      { rule: "Escape Rate", threshold: "0%", description: "Zero containment breaches across all security test exploits." }
    ],
    productionSla: "P95 execution boot latency < 100ms, 99.99% isolation integrity."
  },
  {
    id: "p27",
    slug: "zero-knowledge-proof-scheme-eligibility",
    title: "Zero-Knowledge Proof Scheme Eligibility Gateway",
    tagline: "Build a Zero-Knowledge Proof (zk-SNARKs) verification service for citizens to prove subsidy eligibility without exposing raw PII.",
    difficulty: "Insane",
    domain: "Autonomous Red-Team Cybersecurity",
    durationDays: 45,
    techStack: ["Rust", "Circom / SnarkJS", "zk-SNARKs", "FastAPI", "Next.js", "PostgreSQL", "Docker"],
    partnerTools: ["Docker", "PostgreSQL"],
    targetRoles: ["AI Engineer", "Backend Dev", "Pen-tester", "Fullstack Dev"],
    keywords: ["zero knowledge", "zk-snarks", "circom", "privacy", "dpi", "cryptography", "rust"],
    overview: "Construct a privacy-preserving government scheme verification gateway. Using Circom and zk-SNARKs (Groth16), allow citizens to prove that their annual income is below a threshold and their age is above 18 without revealing their exact salary, date of birth, or Aadhaar identity numbers.",
    architectureNotes: "Client Input -> Circom Arithmetic Circuit -> Witness Generation -> zk-SNARK Groth16 Prover -> Verifier Smart Contract / Rust Verifier -> Cryptographic Verification Token.",
    databaseSchema: [
      "verified_claims (id UUID PK, nullifier_hash VARCHAR(64) UNIQUE, scheme_id VARCHAR, verified_at TIMESTAMP, proof_json JSONB)"
    ],
    apiEndpoints: [
      { method: "POST", path: "/api/v1/zk/generate-proof", description: "Generate client-side zero-knowledge proof." },
      { method: "POST", path: "/api/v1/zk/verify-proof", description: "Verify Groth16 cryptographic proof in < 50ms." }
    ],
    milestones: [
      { phase: "Phase 1: Circom Circuit Definition", days: "Days 1-15", goal: "Write and compile arithmetic circuits for range proofs (income < threshold, age >= 18).", deliverables: ["Circom circuit files", "Witness generator"] },
      { phase: "Phase 2: Groth16 Trusted Setup & Rust Verifier", days: "Days 16-30", goal: "Execute powers-of-tau ceremony and implement fast Rust proof verifier.", deliverables: ["Rust verification module", "Benchmarking report"] },
      { phase: "Phase 3: Web Portal & Anti-Double Claiming", days: "Days 31-45", goal: "Deploy web interface using cryptographic nullifiers to prevent double subsidy claims.", deliverables: ["Next.js web portal", "FastAPI verification backend"] }
    ],
    evaluationCriteria: [
      { metric: "Verification Latency", weight: 50, description: "Verify Groth16 zk-SNARK proof in <= 50ms on server." },
      { metric: "Zero Information Leakage", weight: 35, description: "Formal verification proving zero PII leakage in the public proof parameters." },
      { metric: "Nullifier Uniqueness", weight: 15, description: "100% prevention of duplicate claim submissions." }
    ],
    learningResources: [
      { title: "Circom & SnarkJS Zero-Knowledge Proofs Guide", type: "Documentation", url: "https://docs.circom.io" }
    ],
    strictTestCommand: "cargo test --release && pytest tests/test_zk_verifier.py",
    acceptanceGates: [
      { rule: "Verification Time", threshold: "<= 50ms", description: "Cryptographic proof verification must complete in under 50ms." }
    ],
    productionSla: "P99 proof verification < 50ms, zero PII disclosure."
  },
  {
    id: "p28",
    slug: "realtime-options-greeks-volatility-surface",
    title: "Real-Time Options Greeks & Volatility Surface Engine",
    tagline: "Calculate implied volatility surfaces and real-time Delta, Gamma, Vega, Theta using Black-Scholes and Heston stochastic models.",
    difficulty: "Hard",
    domain: "Statistical Modeling & Econometrics",
    durationDays: 45,
    techStack: ["Python", "Rust", "Polars", "FastAPI", "Docker", "PostgreSQL"],
    partnerTools: ["PostgreSQL", "Docker"],
    targetRoles: ["Data & Financial ML", "Backend Dev", "AI Engineer"],
    keywords: ["options", "greeks", "volatility surface", "black scholes", "heston", "quant", "derivatives"],
    overview: "Build an institutional derivatives pricing engine. Ingest real-time NSE/BSE options chains, compute implied volatility across strikes and expirations using Newton-Raphson bisection, calibrate the Heston stochastic volatility model, and stream real-time Greeks (Delta, Gamma, Vega, Theta, Rho) for 10,000 contracts simultaneously.",
    architectureNotes: "Options Chain Stream -> Polars Resampler -> Rust Options Pricing Core -> Heston Model Calibrator -> 3D Volatility Surface Generator -> WebSocket Gateway.",
    databaseSchema: [
      "option_contracts (id UUID PK, underlying VARCHAR, strike NUMERIC, expiration DATE, option_type VARCHAR)",
      "greeks_telemetry (contract_id UUID FK, timestamp TIMESTAMP, implied_vol NUMERIC, delta NUMERIC, gamma NUMERIC, vega NUMERIC, theta NUMERIC)"
    ],
    apiEndpoints: [
      { method: "GET", path: "/api/v1/quant/volatility-surface/{symbol}", description: "Retrieve 3D Implied Volatility Surface matrix." },
      { method: "POST", path: "/api/v1/quant/calculate-portfolio-greeks", description: "Calculate aggregate net Delta and Gamma exposure for portfolio." }
    ],
    milestones: [
      { phase: "Phase 1: Black-Scholes & Greeks Numerical Core", days: "Days 1-15", goal: "Implement vectorized Greeks calculations in Rust/Polars.", deliverables: ["Pricing engine", "Unit test benchmarks"] },
      { phase: "Phase 2: Heston Stochastic Volatility Calibration", days: "Days 16-30", goal: "Calibrate volatility smile parameters to market quotes with RMSE < 0.015.", deliverables: ["Heston calibration module"] },
      { phase: "Phase 3: 3D Volatility Surface Dashboard & API", days: "Days 31-45", goal: "Deploy web dashboard rendering interactive 3D volatility surfaces.", deliverables: ["Live web UI", "FastAPI service"] }
    ],
    evaluationCriteria: [
      { metric: "Pricing Throughput", weight: 45, description: "Calculate Greeks for 10,000 contracts in under 50ms." },
      { metric: "Calibration Accuracy", weight: 35, description: "Heston model calibration RMSE <= 0.015 against market prices." },
      { metric: "Mathematical Precision", weight: 20, description: "Zero division-by-zero or numerical underflow at extreme moneyness." }
    ],
    learningResources: [
      { title: "Options, Futures, and Other Derivatives (John C. Hull)", type: "Documentation", url: "https://www.pearson.com" }
    ],
    strictTestCommand: "pytest tests/test_options_greeks.py --benchmark",
    acceptanceGates: [
      { rule: "Throughput", threshold: "< 50ms / 10k contracts", description: "10,000 contracts must be priced in under 50ms." }
    ],
    productionSla: "P95 latency < 50ms, 99.95% feed uptime."
  },
  {
    id: "p29",
    slug: "fix-protocol-low-latency-financial-gateway",
    title: "FIX Protocol Low-Latency Financial Gateway in Rust",
    tagline: "Build a high-throughput Financial Information eXchange (FIX 4.4 / 5.0) parser and order routing gateway handling 20,000 msg/sec.",
    difficulty: "Hard",
    domain: "High-Frequency Telemetry",
    durationDays: 45,
    techStack: ["Rust", "Tokio", "FastAPI", "PostgreSQL", "Docker", "Linux"],
    partnerTools: ["Docker", "PostgreSQL"],
    targetRoles: ["Backend Dev", "Cloud DevOps", "Pen-tester"],
    keywords: ["fix protocol", "rust", "low latency", "financial exchange", "tokio", "trading gateway"],
    overview: "Build an institutional FIX Protocol (Financial Information eXchange) gateway in Rust. Implement zero-copy byte parsing of tag-value FIX messages, sequence number management, heartbeat heartbeats, order state reconciliation, and session reconnection logic handling 20,000 messages/sec with sub-200 microsecond parsing latency.",
    architectureNotes: "TCP Socket -> Zero-Copy FIX Parser (Rust) -> FIX Session State Machine -> Ring Buffer -> Execution Router -> PostgreSQL Audit Log.",
    databaseSchema: [
      "fix_sessions (session_id VARCHAR PK, target_comp_id VARCHAR, sender_comp_id VARCHAR, in_seq_num INT, out_seq_num INT, status VARCHAR)",
      "fix_messages_audit (id BIGSERIAL PK, session_id VARCHAR, msg_type VARCHAR, raw_fix_string TEXT, timestamp BIGINT)"
    ],
    apiEndpoints: [
      { method: "POST", path: "/api/v1/fix/send-new-order", description: "Encode and dispatch FIX NewOrderSingle (MsgType=D) packet." }
    ],
    milestones: [
      { phase: "Phase 1: Zero-Copy FIX Tag-Value Parser", days: "Days 1-15", goal: "Implement zero-allocation parser for standard FIX 4.4 and FIXT 1.1 messages.", deliverables: ["Rust parser crate", "Microbenchmark suite"] },
      { phase: "Phase 2: Session State & Sequence Recovery", days: "Days 16-30", goal: "Handle Logon, Heartbeat, ResendRequest, and sequence number gaps.", deliverables: ["Session manager", "Recovery tests"] },
      { phase: "Phase 3: High-Throughput Gateway Deployment", days: "Days 31-45", goal: "Benchmark gateway against simulated exchange order simulators.", deliverables: ["Gateway binary", "Throughput report"] }
    ],
    evaluationCriteria: [
      { metric: "Message Parsing Latency", weight: 50, description: "Zero-copy message parse time <= 200 microseconds P99." },
      { metric: "Session Recovery", weight: 35, description: "100% deterministic sequence reconciliation during network disconnects." },
      { metric: "Throughput", weight: 15, description: "Sustain >= 20,000 FIX messages/second on 2 CPU cores." }
    ],
    learningResources: [
      { title: "FIX 4.4 Specification (FIX Trading Community)", type: "Documentation", url: "https://www.fixtrading.org" }
    ],
    strictTestCommand: "cargo test --release && cargo bench",
    acceptanceGates: [
      { rule: "Parsing Latency", threshold: "<= 200us", description: "P99 parsing latency must not exceed 200 microseconds." }
    ],
    productionSla: "P99 parse latency < 200us, zero message loss."
  },
  {
    id: "p30",
    slug: "cloud-iam-kubernetes-attack-simulator",
    title: "Cloud IAM Privilege Escalation & Kubernetes Attack Simulator",
    tagline: "Autonomous security engine simulating AWS IAM role assumption graphs and Kubernetes RBAC cluster takeover paths.",
    difficulty: "Hard",
    domain: "Autonomous Red-Team Cybersecurity",
    durationDays: 45,
    techStack: ["Python", "NetworkX", "FastAPI", "Docker", "Kubernetes Client", "AWS SDK"],
    partnerTools: ["Docker", "FastAPI"],
    targetRoles: ["Pen-tester", "Cloud DevOps", "Backend Dev"],
    keywords: ["cloud security", "iam", "kubernetes", "rbac", "privilege escalation", "cybersecurity", "graph theory"],
    overview: "Construct an automated cloud security auditing platform. Map complex AWS IAM permission graphs and Kubernetes RBAC bindings into a directed graph, run pathfinding algorithms to discover multi-step privilege escalation paths (e.g. PassRole -> EC2 -> Admin), and generate automated terraform least-privilege remediation policies.",
    architectureNotes: "Cloud Config Ingest -> IAM & RBAC Graph Model (NetworkX) -> Shortest Attack Path Engine -> Vulnerability Graph Visualizer -> Remediation Terraform Generator.",
    databaseSchema: [
      "cloud_environments (id UUID PK, provider VARCHAR, account_id VARCHAR, scanned_at TIMESTAMP)",
      "escalation_paths (id UUID PK, env_id UUID FK, initial_identity VARCHAR, target_privilege VARCHAR, hop_count INT, attack_chain JSONB, remediation_hcl TEXT)"
    ],
    apiEndpoints: [
      { method: "POST", path: "/api/v1/cloudsec/scan-iam", description: "Ingest IAM / RBAC policies and calculate escalation paths." }
    ],
    milestones: [
      { phase: "Phase 1: IAM Graph Engine", days: "Days 1-15", goal: "Model 50+ known AWS IAM privilege escalation primitives.", deliverables: ["Graph analyzer module"] },
      { phase: "Phase 2: Kubernetes RBAC Cluster Takeover Hunter", days: "Days 16-30", goal: "Detect dangerous pod exec, secret reads, and cluster-admin escalation.", deliverables: ["K8s RBAC scanner", "Test cluster benchmarks"] },
      { phase: "Phase 3: Automated Remediation & Web UI", days: "Days 31-45", goal: "Deploy web dashboard showing visual attack paths and download least-privilege Terraform.", deliverables: ["Next.js visualizer", "FastAPI backend"] }
    ],
    evaluationCriteria: [
      { metric: "Pathfinding Detection Rate", weight: 50, description: "100% detection of known privilege escalation paths in benchmark cloud environments." },
      { metric: "Analysis Speed", weight: 30, description: "Analyze 5,000 IAM permissions across 200 roles in under 3.0 seconds." },
      { metric: "Remediation Accuracy", weight: 20, description: "Generated Terraform policies resolve the vulnerability without breaking legitimate access." }
    ],
    learningResources: [
      { title: "AWS IAM Privilege Escalation Techniques (Rhino Security Labs)", type: "Research Paper", url: "https://rhinosecuritylabs.com" }
    ],
    strictTestCommand: "pytest tests/test_iam_scanner.py --min-detection=100",
    acceptanceGates: [
      { rule: "Detection Rate", threshold: "100%", description: "Must identify 100% of benchmark attack paths." }
    ],
    productionSla: "P95 scan duration < 3.0 seconds for enterprise accounts."
  },
  {
    id: "p31",
    slug: "biomedical-pubmed-knowledge-graph-nlp",
    title: "Biomedical PubMed Knowledge Graph & Entity Disambiguation",
    tagline: "Extract drug-disease-gene relationships from 500k PubMed papers using BioBERT, NER, and entity linking to UMLS ontology.",
    difficulty: "Hard",
    domain: "Clinical Healthcare AI",
    durationDays: 45,
    techStack: ["PyTorch", "Transformers", "BioBERT", "Neo4j", "FastAPI", "Docker", "PostgreSQL"],
    partnerTools: ["PostgreSQL", "Docker"],
    targetRoles: ["AI Engineer", "Data & Financial ML", "Backend Dev"],
    keywords: ["biobert", "pubmed", "ner", "knowledge graph", "umls", "biomedical", "entity linking"],
    overview: "Construct an automated biomedical literature intelligence graph. Ingest PubMed open-access XML abstracts, extract drug, disease, and gene named entities with BioBERT, link them to the Unified Medical Language System (UMLS) ontology, and index relations into Neo4j for automated drug repurposing hypothesis generation.",
    architectureNotes: "PubMed XML Stream -> BioBERT Named Entity Recognition -> UMLS Entity Disambiguation -> Relation Extraction -> Neo4j Biomedical Graph -> FastAPI Query Endpoint.",
    databaseSchema: [
      "biomedical_entities (id UUID PK, concept_unique_id VARCHAR, name VARCHAR, semantic_type VARCHAR)",
      "extracted_relations (id UUID PK, source_cui VARCHAR, target_cui VARCHAR, predicate VARCHAR, pubmed_id VARCHAR, confidence NUMERIC)"
    ],
    apiEndpoints: [
      { method: "POST", path: "/api/v1/biomed/extract-triplets", description: "Extract clinical entities from medical abstract text." },
      { method: "GET", path: "/api/v1/biomed/drug-interactions/{drugName}", description: "Query multi-hop knowledge graph for known interactions." }
    ],
    milestones: [
      { phase: "Phase 1: BioBERT Named Entity Recognition", days: "Days 1-15", goal: "Fine-tune token classifier achieving F1 >= 0.88 on NCBI Disease and BC5CDR datasets.", deliverables: ["Trained BioBERT model", "F1 evaluation"] },
      { phase: "Phase 2: UMLS Ontology Entity Linking", days: "Days 16-30", goal: "Link extracted mentions to standardized Concept Unique Identifiers (CUIs).", deliverables: ["Entity linker module"] },
      { phase: "Phase 3: Neo4j Biomedical Graph & Query API", days: "Days 31-45", goal: "Index 1M+ relationships and deploy REST search API.", deliverables: ["FastAPI service", "Graph exploration UI"] }
    ],
    evaluationCriteria: [
      { metric: "Named Entity Recognition F1", weight: 50, description: "F1 Score >= 0.88 on benchmark medical entity test datasets." },
      { metric: "Entity Linking Precision", weight: 30, description: "Precision >= 90% for matching mentions to UMLS CUIs." },
      { metric: "Throughput", weight: 20, description: "Process 500 abstracts per minute on single GPU." }
    ],
    learningResources: [
      { title: "BioBERT: a pre-trained biomedical language representation model", type: "Research Paper", url: "https://arxiv.org/abs/1901.08746" }
    ],
    strictTestCommand: "pytest tests/test_biomed_nlp.py --min-f1=0.88",
    acceptanceGates: [
      { rule: "F1 Score", threshold: ">= 0.88", description: "Biomedical NER F1 score must meet or exceed 88%." }
    ],
    productionSla: "P95 query latency < 350ms, 99.9% availability."
  },
  {
    id: "p32",
    slug: "realtime-12lead-ecg-arrhythmia-bilstm",
    title: "12-Lead Real-Time ECG Arrhythmia Classification with Bi-LSTM",
    tagline: "Deploy a real-time signal processing and Bi-LSTM neural network classifying 16 cardiac arrhythmias from 12-lead ECG telemetry.",
    difficulty: "Hard",
    domain: "Clinical Healthcare AI",
    durationDays: 45,
    techStack: ["PyTorch", "SciPy", "FastAPI", "Docker", "PostgreSQL", "Python"],
    partnerTools: ["PostgreSQL", "Docker"],
    targetRoles: ["AI Engineer", "Data & Financial ML", "Backend Dev"],
    keywords: ["ecg", "arrhythmia", "signal processing", "bilstm", "healthcare", "cardiology", "pytorch"],
    overview: "Build an institutional ICU cardiology telemetry monitoring system. Ingest raw 12-lead ECG voltage signals (500Hz), apply Butterworth bandpass filters and Pan-Tompkins QRS wave detection, and classify 16 cardiac arrhythmias (Atrial Fibrillation, PVC, Bradycardia) using a Bi-LSTM network with F1 > 0.90 in < 30ms.",
    architectureNotes: "12-Lead ECG Stream -> Butterworth Bandpass Filter (0.5-45Hz) -> Pan-Tompkins QRS Extractor -> Bi-LSTM + Attention Classifier -> Real-Time Cardiac Alert Gateway.",
    databaseSchema: [
      "ecg_recordings (id UUID PK, patient_id UUID, recorded_at TIMESTAMP, sampling_rate INT, raw_signals JSONB)",
      "arrhythmia_alerts (id UUID PK, recording_id UUID FK, condition_name VARCHAR, confidence NUMERIC, beat_index INT, alert_time TIMESTAMP)"
    ],
    apiEndpoints: [
      { method: "POST", path: "/api/v1/cardio/classify-ecg-window", description: "Classify 10-second 12-lead ECG signal." }
    ],
    milestones: [
      { phase: "Phase 1: DSP Filtering & QRS Wave Detection", days: "Days 1-15", goal: "Eliminate baseline wander and detect R-peaks with 99% accuracy.", deliverables: ["DSP filtering module", "R-peak benchmark"] },
      { phase: "Phase 2: Bi-LSTM Arrhythmia Classifier", days: "Days 16-30", goal: "Train neural model achieving macro F1 >= 0.90 on PhysioNet MIT-BIH dataset.", deliverables: ["PyTorch model artifact", "F1 score report"] },
      { phase: "Phase 3: Real-Time Telemetry API & Viewer", days: "Days 31-45", goal: "Deploy streaming WebSocket ECG visualizer with live anomaly overlay.", deliverables: ["FastAPI service", "Interactive ECG canvas"] }
    ],
    evaluationCriteria: [
      { metric: "Classification F1-Score", weight: 50, description: "Macro F1 >= 0.90 across 16 arrhythmia classes on PhysioNet test split." },
      { metric: "Signal Processing Latency", weight: 35, description: "Filter and classify 10-second 12-lead buffer in under 30ms." },
      { metric: "Noise Invariance", weight: 15, description: "Maintain F1 > 0.85 under synthetic electrode motion artifact noise." }
    ],
    learningResources: [
      { title: "PhysioNet MIT-BIH Arrhythmia Database Reference", type: "Documentation", url: "https://physionet.org" }
    ],
    strictTestCommand: "pytest tests/test_ecg_classifier.py --min-f1=0.90",
    acceptanceGates: [
      { rule: "Macro F1", threshold: ">= 0.90", description: "Arrhythmia classification macro F1 must exceed 0.90." }
    ],
    productionSla: "P99 latency < 30ms, 99.99% critical alert reliability."
  },
  {
    id: "p33",
    slug: "whole-slide-pathology-gigapixel-segmentation",
    title: "Whole Slide Pathology Gigapixel Segmentation Engine",
    tagline: "Process 100,000 x 100,000 pixel gigapixel histopathology WSI slides using multi-resolution deep zooming and tile segmentation.",
    difficulty: "Insane",
    domain: "Clinical Healthcare AI",
    durationDays: 45,
    techStack: ["PyTorch", "OpenSlide", "FastAPI", "Docker", "PostgreSQL", "Python"],
    partnerTools: ["PostgreSQL", "Docker"],
    targetRoles: ["AI Engineer", "Backend Dev", "Data & Financial ML"],
    keywords: ["histopathology", "wsi", "openslide", "gigapixel", "cancer segmentation", "pytorch", "deep learning"],
    overview: "Build an oncology digital pathology server. Stream 2GB+ Whole Slide Images (WSI) at 40x magnification, implement hierarchical multi-resolution deep zooming via OpenSlide and libvips, and run a patch-based DenseNet classifier to generate heatmaps of invasive tumor margins with AUC > 0.94.",
    architectureNotes: "WSI SVS/NDPI File -> OpenSlide Multi-Resolution Tiling Engine -> DeepZoom Protocol -> PyTorch DenseNet Patch Classifier -> Tumor Probability Heatmap -> WebGL Slide Viewer.",
    databaseSchema: [
      "pathology_slides (id UUID PK, patient_id UUID, slide_format VARCHAR, dimensions_px INT[], file_size_mb INT, s3_uri TEXT)",
      "tumor_heatmaps (id UUID PK, slide_id UUID FK, resolution_level INT, tumor_percentage NUMERIC, heatmap_layer_uri TEXT)"
    ],
    apiEndpoints: [
      { method: "GET", path: "/api/v1/pathology/tile/{slideId}/{level}/{x}/{y}", description: "Retrieve 256x256 DeepZoom slide tile." },
      { method: "POST", path: "/api/v1/pathology/segment-tumor", description: "Generate whole-slide tumor margin probability mask." }
    ],
    milestones: [
      { phase: "Phase 1: OpenSlide DeepZoom Tiling Engine", days: "Days 1-15", goal: "Stream and tile gigapixel pyramid images with sub-25ms tile latency.", deliverables: ["DeepZoom tile server"] },
      { phase: "Phase 2: Patch-Based Tumor Classification", days: "Days 16-30", goal: "Train neural model achieving ROC-AUC >= 0.94 on CAMELYON16 dataset.", deliverables: ["Model checkpoint", "ROC-AUC curves"] },
      { phase: "Phase 3: WebGL Pathology Viewer & Staging", days: "Days 31-45", goal: "Deploy web viewer with smooth multi-resolution pan/zoom and heatmap overlays.", deliverables: ["Live web app", "FastAPI backend"] }
    ],
    evaluationCriteria: [
      { metric: "Slide-Level ROC-AUC", weight: 50, description: "ROC-AUC >= 0.94 for tumor detection on CAMELYON16 test slides." },
      { metric: "Tile Delivery Latency", weight: 35, description: "P95 tile serve latency <= 25ms under active panning." },
      { metric: "Memory Control", weight: 15, description: "RAM usage remains < 2.0GB while processing 50k x 50k pixel files." }
    ],
    learningResources: [
      { title: "CAMELYON16 Grand Challenge in Digital Pathology", type: "Documentation", url: "https://camelyon16.grand-challenge.org" }
    ],
    strictTestCommand: "pytest tests/test_pathology_engine.py --min-auc=0.94",
    acceptanceGates: [
      { rule: "ROC-AUC", threshold: ">= 0.94", description: "Slide-level tumor classification AUC must exceed 0.94." }
    ],
    productionSla: "P95 tile delivery < 25ms, 99.9% uptime."
  },
  {
    id: "p34",
    slug: "multi-agent-financial-debate-consensus-swarm",
    title: "Multi-Agent Financial Research & Consensus Debate Swarm",
    tagline: "Multi-agent LangGraph swarm with Bull, Bear, Risk Auditor, and Macro Econometrician agents debating equity portfolio allocation.",
    difficulty: "Hard",
    domain: "AI Agents & State Machines",
    durationDays: 45,
    techStack: ["LangGraph", "FastAPI", "PostgreSQL", "Redis", "Docker", "Python"],
    partnerTools: ["PostgreSQL", "Redis", "Docker"],
    targetRoles: ["AI Engineer", "Data & Financial ML", "Backend Dev"],
    keywords: ["multi agent", "langgraph", "debate", "consensus", "financial research", "portfolio allocation"],
    overview: "Construct an autonomous multi-agent financial committee. Coordinate 4 specialized agents (Bull Researcher, Bear Skeptic, Quantitative Risk Auditor, Macro Strategist) that ingest live SEC 10-K filings, earnings transcripts, and price momentum, engage in structured dialectic debate rounds, and output consensus investment theses with verifiable citations.",
    architectureNotes: "Financial Ingest -> LangGraph Multi-Agent Orchestrator -> Dialectic Debate Loop -> Quantitative Risk Validator -> Consensus Memo Generator.",
    databaseSchema: [
      "investment_theses (id UUID PK, ticker VARCHAR, consensus_recommendation VARCHAR, target_allocation_pct NUMERIC, bull_arguments JSONB, bear_arguments JSONB, generated_at TIMESTAMP)"
    ],
    apiEndpoints: [
      { method: "POST", path: "/api/v1/research/start-debate", description: "Trigger multi-agent equity debate on target ticker." }
    ],
    milestones: [
      { phase: "Phase 1: Specialized Agent Role Definition", days: "Days 1-15", goal: "Define Bull, Bear, and Risk prompt topologies with strict grounding.", deliverables: ["LangGraph agent nodes"] },
      { phase: "Phase 2: Dialectic Consensus State Graph", days: "Days 16-30", goal: "Implement multi-turn critique loops and consensus convergence metrics.", deliverables: ["Debate state graph", "Convergence tests"] },
      { phase: "Phase 3: Financial Tool Ingest & API", days: "Days 31-45", goal: "Connect real-time financial APIs and deploy report generator.", deliverables: ["FastAPI service", "Sample research memo"] }
    ],
    evaluationCriteria: [
      { metric: "Factual Grounding & Hallucination Rate", weight: 50, description: "Zero ungrounded financial claims; 100% of financial figures must match SEC 10-K sources." },
      { metric: "Debate Depth", weight: 30, description: "Balanced consideration of bull and bear theses with explicit downside scenario quantification." },
      { metric: "Execution Latency", weight: 20, description: "Complete 4-agent debate synthesis in under 45 seconds." }
    ],
    learningResources: [
      { title: "Multi-Agent Collaboration with LangGraph", type: "Documentation", url: "https://langchain-ai.github.io/langgraph/" }
    ],
    strictTestCommand: "pytest tests/test_agent_debate.py --verify-factual-grounding",
    acceptanceGates: [
      { rule: "Hallucination Rate", threshold: "0%", description: "All quantitative metrics in debate memos must be verified against source filings." }
    ],
    productionSla: "P95 debate generation < 45 seconds."
  },
  {
    id: "p35",
    slug: "sandboxed-code-interpreter-agent-docker",
    title: "Sandboxed Code Interpreter Agent with Ephemeral Docker Runtimes",
    tagline: "Build a code interpreter agent that autonomously writes, executes, and debugs Python data analysis scripts inside ephemeral micro-containers.",
    difficulty: "Hard",
    domain: "AI Agents & State Machines",
    durationDays: 45,
    techStack: ["LangGraph", "Docker SDK", "FastAPI", "PostgreSQL", "Python"],
    partnerTools: ["Docker", "PostgreSQL"],
    targetRoles: ["AI Engineer", "Backend Dev", "Cloud DevOps"],
    keywords: ["code interpreter", "docker", "sandboxing", "langgraph", "autonomous agents", "data analysis"],
    overview: "Build an autonomous code-interpreting agent. When given raw CSV/Parquet data and natural language questions, the agent writes Python Pandas/Matplotlib code, runs it inside an ephemeral, network-isolated Docker container, analyzes the stdout and generated charts, automatically fixes runtime tracebacks, and returns synthesized charts and insights.",
    architectureNotes: "User Query -> LangGraph Code Synthesizer -> Ephemeral Docker Container Spawner -> Execution & Output Interceptor -> Self-Correction Loop -> Final Chart & Answer Synthesizer.",
    databaseSchema: [
      "interpreter_sessions (id UUID PK, user_id UUID, uploaded_dataset_uri TEXT, created_at TIMESTAMP)",
      "execution_steps (id UUID PK, session_id UUID FK, generated_code TEXT, stdout TEXT, stderr TEXT, plot_png_uri TEXT, iteration_count INT)"
    ],
    apiEndpoints: [
      { method: "POST", path: "/api/v1/interpreter/query", description: "Execute natural language data analysis with automatic code execution." }
    ],
    milestones: [
      { phase: "Phase 1: Ephemeral Docker Execution Manager", days: "Days 1-15", goal: "Launch, execute, and destroy isolated Docker containers in < 600ms.", deliverables: ["Docker execution manager"] },
      { phase: "Phase 2: Self-Correction LangGraph Loop", days: "Days 16-30", goal: "Implement automatic runtime traceback recovery over 3 iterations.", deliverables: ["LangGraph self-repair loop"] },
      { phase: "Phase 3: Chart Serialization & API Deploy", days: "Days 31-45", goal: "Render interactive Matplotlib/Seaborn charts and deploy REST API.", deliverables: ["FastAPI service", "Interactive chat UI"] }
    ],
    evaluationCriteria: [
      { metric: "Code Execution Success Rate", weight: 50, description: ">= 92% first-try or self-corrected execution success on benchmark tabular queries." },
      { metric: "Container Isolation", weight: 35, description: "Zero outbound network egress and strict 512MB RAM ceiling." },
      { metric: "Execution Latency", weight: 15, description: "Complete query, execution, and chart rendering in under 6.0 seconds." }
    ],
    learningResources: [
      { title: "Building Secure Code Interpreters with Docker & Python", type: "Documentation", url: "https://docker-py.readthedocs.io" }
    ],
    strictTestCommand: "pytest tests/test_code_interpreter.py --min-success=92",
    acceptanceGates: [
      { rule: "Success Rate", threshold: ">= 92%", description: "Query execution success rate must meet or exceed 92%." }
    ],
    productionSla: "P95 execution latency < 6.0s, 100% container cleanup."
  },
  {
    id: "p36",
    slug: "stereo-depth-spatial-video-tracker",
    title: "Real-Time Spatial Video Object Localization with Stereo Depth",
    tagline: "Fuse stereo camera disparity maps with YOLOv11 to compute 3D real-world XYZ coordinates of moving obstacles in < 30ms.",
    difficulty: "Hard",
    domain: "Edge Drone Vision & Robotics",
    durationDays: 45,
    techStack: ["OpenCV", "PyTorch", "YOLOv11", "FastAPI", "Docker", "Python"],
    partnerTools: ["Docker", "FastAPI"],
    targetRoles: ["AI Engineer", "Backend Dev", "Cloud DevOps"],
    keywords: ["stereo vision", "depth estimation", "spatial computing", "yolov11", "robotics", "opencv"],
    overview: "Build an industrial robotics spatial perception pipeline. Ingest dual left-right camera video feeds, compute real-time semi-global block matching (SGBM) disparity maps, fuse bounding boxes from YOLOv11 with point clouds, and output precise 3D metric coordinates (X, Y, Z meters) of obstacles for collision avoidance in < 30ms.",
    architectureNotes: "Dual Video Stream -> Camera Epipolar Rectification -> SGBM Stereo Disparity Matcher -> YOLOv11 2D Object Localizer -> 3D Point Cloud Projection -> Obstacle Proximity Telemetry.",
    databaseSchema: [
      "spatial_detections (id UUID PK, timestamp TIMESTAMP, class_label VARCHAR, x_meters NUMERIC, y_meters NUMERIC, z_meters NUMERIC, collision_risk VARCHAR)"
    ],
    apiEndpoints: [
      { method: "POST", path: "/api/v1/spatial/process-stereo-pair", description: "Process stereo image pair and return 3D obstacle coordinates." }
    ],
    milestones: [
      { phase: "Phase 1: Stereo Calibration & SGBM Disparity Engine", days: "Days 1-15", goal: "Calibrate camera intrinsics and compute depth maps in < 15ms.", deliverables: ["Stereo calibration module"] },
      { phase: "Phase 2: 3D Point Cloud & YOLOv11 Fusion", days: "Days 16-30", goal: "Project detected bounding boxes into metric XYZ space with < 3% depth error.", deliverables: ["3D localization module", "Accuracy report"] },
      { phase: "Phase 3: Collision Warning API & Staging Deploy", days: "Days 31-45", goal: "Deploy streaming telemetry server triggering collision warnings.", deliverables: ["FastAPI service", "3D point cloud visualizer"] }
    ],
    evaluationCriteria: [
      { metric: "3D Depth Accuracy", weight: 50, description: "Depth measurement error <= 3.0% at distances from 1m to 15m." },
      { metric: "Processing Latency", weight: 35, description: "Complete stereo rectification, disparity, and YOLO fusion in < 30ms." },
      { metric: "Robustness", weight: 15, description: "Graceful handling of textureless surfaces and glare." }
    ],
    learningResources: [
      { title: "Stereo Vision & Depth Estimation in OpenCV", type: "Documentation", url: "https://docs.opencv.org" }
    ],
    strictTestCommand: "pytest tests/test_stereo_depth.py --max-depth-error=3.0",
    acceptanceGates: [
      { rule: "Depth Error", threshold: "<= 3.0%", description: "Metric distance error must remain under 3%." }
    ],
    productionSla: "P99 latency < 30ms, 60fps capability."
  },
  {
    id: "p37",
    slug: "visual-inertial-odometry-gps-denied-uav",
    title: "Visual-Inertial Odometry in GPS-Denied Environments",
    tagline: "Fused monocular optical flow and 6-axis IMU Extended Kalman Filter for precise UAV trajectory tracking in tunnels and warehouses.",
    difficulty: "Insane",
    domain: "Edge Drone Vision & Robotics",
    durationDays: 45,
    techStack: ["C++ / Rust", "OpenCV", "GTSAM", "Eigen", "Python", "ROS2"],
    partnerTools: ["Docker"],
    targetRoles: ["AI Engineer", "Backend Dev", "Cloud DevOps"],
    keywords: ["vio", "visual odometry", "imu", "kalman filter", "slam", "robotics", "gps denied"],
    overview: "Engineer an autonomous indoor drone navigation state estimator. Ingest 60fps grayscale camera frames and 200Hz 6-axis IMU accelerometer/gyroscope readings, run a FAST feature tracker with Lucas-Kanade optical flow, and fuse with factor-graph optimization (GTSAM) to maintain accurate 6-DoF position in GPS-denied environments with drift < 1.5% of trajectory distance.",
    architectureNotes: "Camera & IMU Stream -> FAST Feature Extractor -> Lucas-Kanade Optical Flow -> IMU Preintegration -> GTSAM Factor Graph Optimizer -> 6-DoF Pose Publisher.",
    databaseSchema: [
      "flight_trajectories (id UUID PK, drone_id VARCHAR, timestamp TIMESTAMP, pos_x NUMERIC, pos_y NUMERIC, pos_z NUMERIC, orientation_quaternion NUMERIC[])"
    ],
    apiEndpoints: [
      { method: "POST", path: "/api/v1/vio/telemetry", description: "Stream high-frequency IMU and visual frame keypoints." }
    ],
    milestones: [
      { phase: "Phase 1: IMU Preintegration & Optical Flow", days: "Days 1-15", goal: "Implement IMU numerical integration and KLT feature tracking.", deliverables: ["KLT tracker module"] },
      { phase: "Phase 2: Factor Graph Optimization with GTSAM", days: "Days 16-30", goal: "Implement sliding-window pose graph optimization achieving drift < 1.5%.", deliverables: ["GTSAM optimizer", "Trajectory evaluation plots"] },
      { phase: "Phase 3: Real-Time Benchmark on EuRoC Dataset", days: "Days 31-45", goal: "Benchmark against ground truth on official EuRoC micro-aerial vehicle datasets.", deliverables: ["Evaluation benchmark report", "Live visualization"] }
    ],
    evaluationCriteria: [
      { metric: "Absolute Trajectory Error (ATE)", weight: 50, description: "ATE <= 1.5% of total trajectory length on EuRoC MAV datasets." },
      { metric: "Execution Rate", weight: 35, description: "Maintain 60fps tracking on single CPU core." },
      { metric: "Loop Closure Stability", weight: 15, description: "Zero pose divergence during rapid 180-degree yaw rotations." }
    ],
    learningResources: [
      { title: "Factor Graphs and GTSAM for Robotics", type: "Documentation", url: "https://gtsam.org" }
    ],
    strictTestCommand: "pytest tests/test_vio_estimator.py --max-ate=1.5",
    acceptanceGates: [
      { rule: "ATE Drift", threshold: "<= 1.5%", description: "Trajectory drift must not exceed 1.5% of total distance." }
    ],
    productionSla: "Real-time 60Hz pose estimation, zero divergence."
  },
  {
    id: "p38",
    slug: "raft-consensus-distributed-key-value-store",
    title: "In-Memory Distributed Key-Value Store with Raft Consensus",
    tagline: "Build a distributed fault-tolerant key-value store in Rust implementing the Raft consensus algorithm with leader election and log replication.",
    difficulty: "Insane",
    domain: "Kernel eBPF & Autonomous Cloud",
    durationDays: 45,
    techStack: ["Rust", "Tokio", "gRPC / Tonic", "Linux", "Docker"],
    partnerTools: ["Docker"],
    targetRoles: ["Backend Dev", "Cloud DevOps", "Pen-tester"],
    keywords: ["raft", "consensus", "distributed systems", "rust", "grpc", "key value store", "fault tolerance"],
    overview: "Build a fault-tolerant, high-performance distributed key-value store in Rust. Implement the complete Raft consensus protocol (Leader Election, Heartbeats, Log Replication, Safety Invariants, Dynamic Cluster Membership, Snapshotting) over gRPC/Tonic, passing Jepsen-style network partition stress tests.",
    architectureNotes: "Client gRPC Request -> Raft Leader Node -> Uncommitted Log Entry -> gRPC Replication to Followers -> Majority Quorum Ack -> State Machine Commit -> Client Response.",
    databaseSchema: [
      "In-Memory State Machine: key (String) -> value (Vec<u8>), Persistent Log: (term: u64, index: u64, command: Vec<u8>)"
    ],
    apiEndpoints: [
      { method: "POST", path: "/raft.v1.KVService/Put", description: "Set key-value pair through Raft leader." },
      { method: "POST", path: "/raft.v1.KVService/Get", description: "Linearizable read of key from cluster." }
    ],
    milestones: [
      { phase: "Phase 1: Raft State Machine & Leader Election", days: "Days 1-15", goal: "Implement randomized election timeouts and vote request protocol.", deliverables: ["Rust Raft state machine", "Leader election tests"] },
      { phase: "Phase 2: Log Replication & Quorum Commits", days: "Days 16-30", goal: "Replicate AppendEntries RPCs across 5 nodes with majority quorum confirmation.", deliverables: ["Log replication module", "Split-brain tests"] },
      { phase: "Phase 3: Chaos Partition Testing & Benchmarks", days: "Days 31-45", goal: "Subject 5-node cluster to automated network partitions and verify zero data loss.", deliverables: ["Jepsen test report", "Throughput benchmarks"] }
    ],
    evaluationCriteria: [
      { metric: "Linearizable Consistency", weight: 50, description: "100% linearizable reads and writes during simulated 2-node cluster partitions." },
      { metric: "Write Throughput", weight: 35, description: ">= 10,000 replicated writes/second on 3-node local cluster." },
      { metric: "Election Latency", weight: 15, description: "Elect new leader in <= 350ms after leader termination." }
    ],
    learningResources: [
      { title: "In Search of an Understandable Consensus Algorithm (Diego Ongaro, Stanford)", type: "Research Paper", url: "https://raft.github.io/raft.pdf" }
    ],
    strictTestCommand: "cargo test --release -- --nocapture && ./tests/run_partition_chaos.sh",
    acceptanceGates: [
      { rule: "Data Loss", threshold: "0 Records", description: "Zero data loss or split-brain inconsistencies under network partition." }
    ],
    productionSla: "P99 write latency < 15ms, 99.999% data durability."
  },
  {
    id: "p39",
    slug: "whisper-speech-speaker-diarization-pipeline",
    title: "Low-Latency Real-Time Audio Transcription & Speaker Diarization",
    tagline: "Streaming audio pipeline combining Whisper ASR with PyAnnote speaker diarization and voice activity detection in < 300ms chunks.",
    difficulty: "Hard",
    domain: "Audio DSP & Speech AI",
    durationDays: 45,
    techStack: ["PyTorch", "Whisper", "PyAnnote", "FastAPI", "WebSockets", "Docker", "PostgreSQL"],
    partnerTools: ["PostgreSQL", "Docker"],
    targetRoles: ["AI Engineer", "Backend Dev", "Fullstack Dev"],
    keywords: ["whisper", "speech to text", "diarization", "pyannote", "audio", "webrtc", "websockets"],
    overview: "Build an enterprise meeting transcription and intelligence platform. Ingest streaming multi-speaker audio over WebSockets, apply Silero VAD (Voice Activity Detection) and PyAnnote embedding clustering to attribute speech to specific speakers, and run Whisper INT8 models to stream synchronized transcripts in real-time.",
    architectureNotes: "WebSocket Audio Stream -> Silero VAD Chunking -> PyAnnote Speaker Embedding Extraction -> Online Spectral Clustering -> Faster-Whisper ASR -> Synchronized Transcript WebSocket Broadcast.",
    databaseSchema: [
      "transcription_sessions (id UUID PK, session_name VARCHAR, created_at TIMESTAMP)",
      "transcript_utterances (id UUID PK, session_id UUID FK, speaker_label VARCHAR, start_time_ms INT, end_time_ms INT, text TEXT)"
    ],
    apiEndpoints: [
      { method: "GET", path: "/ws/audio/transcribe-live", description: "WebSocket stream ingesting audio chunks and broadcasting diarized text." }
    ],
    milestones: [
      { phase: "Phase 1: Voice Activity Detection & Chunking", days: "Days 1-15", goal: "Implement sub-10ms Silero VAD chunking.", deliverables: ["VAD pipeline module"] },
      { phase: "Phase 2: PyAnnote Diarization & Whisper Integration", days: "Days 16-30", goal: "Achieve Diarization Error Rate (DER) < 12% on multi-speaker audio.", deliverables: ["Diarization engine", "DER benchmark report"] },
      { phase: "Phase 3: WebSocket Broadcasting & Staging Deploy", days: "Days 31-45", goal: "Deploy real-time meeting transcriber with live speaker badges.", deliverables: ["FastAPI service", "Next.js transcript viewer"] }
    ],
    evaluationCriteria: [
      { metric: "Diarization Error Rate (DER)", weight: 45, description: "DER <= 12.0% on 3-speaker conversation test benchmarks." },
      { metric: "Word Error Rate (WER)", weight: 35, description: "WER <= 8.5% on standard English speech datasets." },
      { metric: "Streaming Latency", weight: 20, description: "Stream transcript chunk in < 300ms from speech conclusion." }
    ],
    learningResources: [
      { title: "PyAnnote Audio: Neural Building Blocks for Speaker Diarization", type: "Documentation", url: "https://github.com/pyannote/pyannote-audio" }
    ],
    strictTestCommand: "pytest tests/test_diarization_pipeline.py --max-der=12.0",
    acceptanceGates: [
      { rule: "DER", threshold: "<= 12.0%", description: "Diarization error rate must remain under 12%." }
    ],
    productionSla: "P95 transcript delivery < 300ms, 99.9% uptime."
  },
  {
    id: "p40",
    slug: "gnn-financial-fraud-ring-detector",
    title: "Graph Neural Network (GNN) Financial Fraud Ring Detector",
    tagline: "Detect organized money-mule syndicates and circular transaction rings across 1M accounts using PyTorch Geometric and Graph Convolutional Networks.",
    difficulty: "Hard",
    domain: "Data Science & Predictive ML",
    durationDays: 45,
    techStack: ["PyTorch", "PyTorch Geometric", "NetworkX", "PostgreSQL", "FastAPI", "Docker"],
    partnerTools: ["PostgreSQL", "Docker"],
    targetRoles: ["Data & Financial ML", "AI Engineer", "Backend Dev"],
    keywords: ["gnn", "graph neural networks", "fraud ring", "pytorch geometric", "fintech", "money laundering"],
    overview: "Construct an anti-money laundering (AML) graph intelligence platform. Build a heterogeneous transaction graph of 1M+ bank accounts, credit cards, and IP devices in PyTorch Geometric, train a Relational Graph Convolutional Network (R-GCN) to detect circular fund layering and mule accounts, and output risk subgraphs with F1 > 0.91.",
    architectureNotes: "Transaction Stream -> Graph Builder -> PyTorch Geometric R-GCN Model -> Graph Anomaly Scoring -> Subgraph Extraction -> Fraud Analyst Alert UI.",
    databaseSchema: [
      "account_nodes (id UUID PK, account_number VARCHAR, kyc_status VARCHAR, risk_score NUMERIC)",
      "transaction_edges (id UUID PK, sender_account UUID, receiver_account UUID, amount NUMERIC, timestamp TIMESTAMP, device_ip VARCHAR)",
      "fraud_syndicates (id UUID PK, ring_type VARCHAR, member_account_ids UUID[], total_laundered_amount NUMERIC, detected_at TIMESTAMP)"
    ],
    apiEndpoints: [
      { method: "POST", path: "/api/v1/aml/score-account-graph", description: "Evaluate target account and immediate 2-hop neighborhood for fraud ring risk." }
    ],
    milestones: [
      { phase: "Phase 1: Heterogeneous Graph Construction", days: "Days 1-15", goal: "Model account-to-device and transaction bipartite graph structure in PyG.", deliverables: ["Graph construction pipeline"] },
      { phase: "Phase 2: R-GCN Graph Neural Network Training", days: "Days 16-30", goal: "Train node classification and link prediction models achieving F1 >= 0.91.", deliverables: ["Trained GNN model", "ROC-AUC curves"] },
      { phase: "Phase 3: Subgraph Visualization & API Deploy", days: "Days 31-45", goal: "Deploy FastAPI service returning interactive D3.js fraud ring subgraphs.", deliverables: ["FastAPI service", "Interactive graph UI"] }
    ],
    evaluationCriteria: [
      { metric: "Fraud Ring F1-Score", weight: 50, description: "F1 Score >= 0.91 on highly imbalanced synthetic AML transaction graph." },
      { metric: "2-Hop Neighborhood Inference Time", weight: 35, description: "Extract and score 2-hop subgraph in under 150ms." },
      { metric: "Explainability", weight: 15, description: "Highlight top edge weights explaining the fraud syndicate prediction." }
    ],
    learningResources: [
      { title: "PyTorch Geometric Documentation & GNN Tutorials", type: "Documentation", url: "https://pytorch-geometric.readthedocs.io" }
    ],
    strictTestCommand: "pytest tests/test_gnn_fraud.py --min-f1=0.91",
    acceptanceGates: [
      { rule: "F1 Score", threshold: ">= 0.91", description: "Syndicate detection F1 must meet or exceed 0.91." }
    ],
    productionSla: "P95 inference latency < 150ms per account inquiry."
  },
  {
    id: "p41",
    slug: "streaming-anomaly-detection-kafka-flink",
    title: "High-Throughput Streaming Anomaly Detection with Kafka & Flink",
    tagline: "Process 100,000 events/sec through Apache Flink stateful sliding windows and Isolation Forests to flag IoT telemetry spikes in real-time.",
    difficulty: "Hard",
    domain: "Data Science & Predictive ML",
    durationDays: 45,
    techStack: ["Java / Python", "Apache Flink", "Kafka", "Redis", "PostgreSQL", "Docker"],
    partnerTools: ["Redis", "PostgreSQL", "Docker"],
    targetRoles: ["Backend Dev", "Data & Financial ML", "Cloud DevOps"],
    keywords: ["kafka", "flink", "streaming", "anomaly detection", "iot", "high throughput"],
    overview: "Build an industrial streaming telemetry analytics platform. Ingest 100,000 sensor telemetry metrics/second from Kafka, maintain stateful 60-second sliding-window statistics in Apache Flink with RocksDB state backend, run streaming Half-Space Tree anomaly detection, and publish alerts to Redis in < 25ms.",
    architectureNotes: "IoT Telemetry -> Kafka Cluster -> Apache Flink Streaming Engine (RocksDB) -> Streaming Anomaly Model -> Redis Alert Pub/Sub -> PostgreSQL TimescaleDB.",
    databaseSchema: [
      "sensor_metrics_history (time TIMESTAMPTZ NOT NULL, sensor_id VARCHAR, value NUMERIC, z_score NUMERIC, is_anomaly BOOLEAN)",
      "telemetry_alerts (id UUID PK, sensor_id VARCHAR, anomaly_score NUMERIC, triggered_at TIMESTAMP)"
    ],
    apiEndpoints: [
      { method: "POST", path: "/api/v1/streaming/ingest", description: "Kafka producer endpoint for simulated sensor streams." },
      { method: "GET", path: "/api/v1/streaming/live-anomalies", description: "SSE stream of real-time telemetry anomalies." }
    ],
    milestones: [
      { phase: "Phase 1: Kafka & Flink Ingestion Pipeline", days: "Days 1-15", goal: "Process 50k events/sec with exactly-once processing guarantees.", deliverables: ["Flink streaming job", "Throughput benchmarks"] },
      { phase: "Phase 2: Stateful Sliding Window & Anomaly Engine", days: "Days 16-30", goal: "Implement sliding-window z-score and Half-Space Trees.", deliverables: ["Streaming anomaly detector"] },
      { phase: "Phase 3: 100k Events/sec Stress Test & UI", days: "Days 31-45", goal: "Sustain 100k events/sec under full cluster chaos and deploy live dashboard.", deliverables: ["Benchmark dissertation", "Live Grafana dashboard"] }
    ],
    evaluationCriteria: [
      { metric: "Sustained Throughput", weight: 50, description: "Maintain >= 100,000 events/second without backpressure." },
      { metric: "End-to-End Event Latency", weight: 35, description: "Time from Kafka ingress to Redis anomaly publish <= 25ms." },
      { metric: "Exactly-Once Semantics", weight: 15, description: "Zero duplicated or dropped events across simulated Flink task manager restarts." }
    ],
    learningResources: [
      { title: "Stateful Stream Processing with Apache Flink", type: "Documentation", url: "https://flink.apache.org" }
    ],
    strictTestCommand: "pytest tests/test_flink_streaming.py --benchmark-100k",
    acceptanceGates: [
      { rule: "Throughput", threshold: ">= 100k events/s", description: "Must sustain 100,000 events/sec." }
    ],
    productionSla: "P99 latency < 25ms at 100k events/sec."
  },
  {
    id: "p42",
    slug: "autonomous-drone-fleet-geofence-mission-planner",
    title: "Autonomous Drone Fleet Geofencing & Mission Planner",
    tagline: "Build a multi-drone mission planning server with dynamic 4D waypoint routing, automated no-fly zone avoidance, and MAVLink telemetry.",
    difficulty: "Hard",
    domain: "Edge Drone Vision & Robotics",
    durationDays: 45,
    techStack: ["Python", "PostgreSQL PostGIS", "FastAPI", "Docker", "Redis Streams", "Next.js"],
    partnerTools: ["PostgreSQL", "Docker", "Redis"],
    targetRoles: ["Backend Dev", "Fullstack Dev", "AI Engineer"],
    keywords: ["drone fleet", "geofencing", "mission planner", "mavlink", "postgis", "uav", "fastapi"],
    overview: "Construct an autonomous multi-drone UTM (Unmanned Traffic Management) system. Plan collision-free 4D spatial-temporal waypoints for up to 20 concurrent drones, dynamically route around restricted airspace polygons using PostGIS, stream MAVLink mission waypoints, and execute automated emergency return-to-home protocols upon battery degradation.",
    architectureNotes: "Mission Planner UI -> 4D Spatial-Temporal Routing Engine (A* / PostGIS) -> MAVLink Command Serializer -> Drone Fleet Dispatcher -> Real-Time Telemetry Monitor.",
    databaseSchema: [
      "fleet_drones (id UUID PK, callsign VARCHAR, max_speed_mps NUMERIC, battery_capacity_mah INT, status VARCHAR)",
      "flight_plans (id UUID PK, drone_id UUID FK, start_time TIMESTAMP, estimated_duration_min INT, waypoint_linestring GEOMETRY(LINESTRINGZ, 4326), status VARCHAR)",
      "restricted_airspaces (id UUID PK, name VARCHAR, min_alt_m NUMERIC, max_alt_m NUMERIC, geometry GEOMETRY(POLYGON, 4326), is_active BOOLEAN)"
    ],
    apiEndpoints: [
      { method: "POST", path: "/api/v1/mission/plan-flight", description: "Generate collision-free 4D waypoint path avoiding restricted airspace." },
      { method: "POST", path: "/api/v1/mission/emergency-rth/{droneId}", description: "Trigger immediate return-to-home trajectory." }
    ],
    milestones: [
      { phase: "Phase 1: PostGIS 3D Airspace & No-Fly Zones", days: "Days 1-15", goal: "Model restricted airspace polygons with dynamic altitude ceilings.", deliverables: ["PostGIS airspace schema"] },
      { phase: "Phase 2: 4D Multi-Drone Routing Algorithm", days: "Days 16-30", goal: "Calculate collision-free trajectories for 20 drones with minimum 50m separation.", deliverables: ["4D routing engine", "Separation tests"] },
      { phase: "Phase 3: Mission Control Dashboard & MAVLink", days: "Days 31-45", goal: "Deploy web dashboard showing live 3D drone fleet positions.", deliverables: ["Live web app", "FastAPI backend"] }
    ],
    evaluationCriteria: [
      { metric: "Fleet Separation Safety", weight: 50, description: "Zero spatial-temporal collisions across 1,000 simulated simultaneous missions." },
      { metric: "Routing Latency", weight: 35, description: "Compute 20-waypoint optimal mission in < 300ms." },
      { metric: "MAVLink Protocol Compliance", weight: 15, description: "100% valid MAVLink v2 mission item serialization." }
    ],
    learningResources: [
      { title: "MAVLink Micro Air Vehicle Communication Protocol", type: "Documentation", url: "https://mavlink.io" }
    ],
    strictTestCommand: "pytest tests/test_fleet_mission_planner.py --zero-collision-check",
    acceptanceGates: [
      { rule: "Collisions", threshold: "0 Incidents", description: "Zero separation breaches during simulation." }
    ],
    productionSla: "P95 route planning < 300ms, 99.95% availability."
  },
  {
    id: "p43",
    slug: "hyperspectral-mineral-soil-analyzer",
    title: "Hyperspectral Mineral & Soil Composition Analyzer",
    tagline: "Process 200+ contiguous spectral bands from PRISMA / EnMAP satellites to classify mineral signatures and soil carbon content.",
    difficulty: "Hard",
    domain: "Geospatial & Satellite AI",
    durationDays: 45,
    techStack: ["PyTorch", "Spectral Python (SPy)", "Rasterio", "FastAPI", "Docker", "PostgreSQL"],
    partnerTools: ["PostgreSQL", "Docker"],
    targetRoles: ["Data & Financial ML", "AI Engineer", "Backend Dev"],
    keywords: ["hyperspectral", "remote sensing", "mineralogy", "soil carbon", "prisma", "enmap", "pytorch"],
    overview: "Build an advanced hyperspectral remote sensing analytics platform. Ingest 200+ narrow spectral bands (400nm - 2500nm) from PRISMA and EnMAP satellites, remove atmospheric absorption bands, match spectral angle mappers (SAM) against the USGS spectral mineral library, and estimate soil organic carbon percentages with R2 > 0.86.",
    architectureNotes: "Hyperspectral HDF5 Ingest -> Atmospheric Continuum Removal -> Spectral Angle Mapper (SAM) -> 1D-CNN Spectral Regressor -> Mineral Composition Map -> PostGIS Layer.",
    databaseSchema: [
      "hyperspectral_scenes (id UUID PK, satellite VARCHAR, acquisition_date DATE, band_count INT, hdf5_uri TEXT)",
      "mineral_identifications (id UUID PK, scene_id UUID FK, mineral_name VARCHAR, match_score NUMERIC, area_hectares NUMERIC)"
    ],
    apiEndpoints: [
      { method: "POST", path: "/api/v1/hyperspectral/identify-minerals", description: "Execute spectral unmixing and identify mineral signatures." }
    ],
    milestones: [
      { phase: "Phase 1: Hyperspectral Cube Ingest & Calibration", days: "Days 1-15", goal: "Read 200-band HDF5 files and perform continuum removal.", deliverables: ["Hyperspectral preprocessor"] },
      { phase: "Phase 2: Spectral Angle Mapping & 1D-CNN", days: "Days 16-30", goal: "Train 1D convolutional network achieving R2 >= 0.86 on soil carbon estimation.", deliverables: ["Trained CNN", "R2 validation report"] },
      { phase: "Phase 3: Mineral Map Dashboard & API", days: "Days 31-45", goal: "Deploy geospatial web viewer displaying mineral classification layers.", deliverables: ["FastAPI service", "Interactive map UI"] }
    ],
    evaluationCriteria: [
      { metric: "Soil Carbon R2 Score", weight: 50, description: "R2 Score >= 0.86 on validation laboratory soil spectra." },
      { metric: "Mineral Match Precision", weight: 35, description: "Precision >= 92% against USGS reference mineral library." },
      { metric: "Throughput", weight: 15, description: "Process 500MB hyperspectral cube in under 6.0 seconds." }
    ],
    learningResources: [
      { title: "Spectral Python (SPy) Documentation", type: "Documentation", url: "https://www.spectralpython.net" }
    ],
    strictTestCommand: "pytest tests/test_hyperspectral.py --min-r2=0.86",
    acceptanceGates: [
      { rule: "R2 Score", threshold: ">= 0.86", description: "Regression R2 must meet or exceed 0.86." }
    ],
    productionSla: "P95 analysis time < 6.0s per hyperspectral cube."
  },
  {
    id: "p44",
    slug: "serverless-hnsw-vector-database-rust",
    title: "Serverless Edge Vector Search Engine in Rust with HNSW",
    tagline: "Build an in-memory vector database in Rust implementing Hierarchical Navigable Small World (HNSW) graphs and SIMD AVX-512 cosine distance.",
    difficulty: "Insane",
    domain: "Kernel eBPF & Autonomous Cloud",
    durationDays: 45,
    techStack: ["Rust", "SIMD", "Tokio", "gRPC", "Docker"],
    partnerTools: ["Docker"],
    targetRoles: ["Backend Dev", "Cloud DevOps", "AI Engineer"],
    keywords: ["rust", "vector database", "hnsw", "simd", "avx512", "embeddings", "low latency"],
    overview: "Engineer an ultra-fast vector search engine in Rust. Implement the Hierarchical Navigable Small World (HNSW) graph indexing algorithm, optimize cosine and Euclidean distance using explicit SIMD (AVX-512 / NEON) assembly intrinsics, and deliver sub-2ms nearest-neighbor queries across 1,000,000 vectors with Recall@10 > 98.5%.",
    architectureNotes: "Vector Ingest -> SIMD Vector Normalizer -> HNSW Multi-Layer Graph Builder -> Quantization Layer -> Search Executor -> gRPC & REST Interface.",
    databaseSchema: [
      "In-Memory HNSW Graph: layers (Vec<Layer>), vectors (Array2<f32>), metadata_payloads (HashMap<u64, Value>)"
    ],
    apiEndpoints: [
      { method: "POST", path: "/v1/vectors/insert", description: "Insert batch of 1536-dim embeddings." },
      { method: "POST", path: "/v1/vectors/search", description: "Execute sub-2ms k-NN search with metadata filtering." }
    ],
    milestones: [
      { phase: "Phase 1: SIMD Distance Metric Intrinsics", days: "Days 1-15", goal: "Implement AVX-512 cosine and dot product achieving 4x speedup over scalar loops.", deliverables: ["SIMD math crate", "Microbenchmarks"] },
      { phase: "Phase 2: HNSW Graph Construction & Pruning", days: "Days 16-30", goal: "Build multi-layer navigable small world graph with Recall@10 >= 98.5%.", deliverables: ["HNSW engine", "Recall vs QPS benchmarks"] },
      { phase: "Phase 3: 1M Vector Scale & gRPC Server", days: "Days 31-45", goal: "Deploy gRPC service serving 10,000 queries/sec under 2ms P99 latency.", deliverables: ["gRPC server binary", "Ann-benchmarks report"] }
    ],
    evaluationCriteria: [
      { metric: "Recall @ 10", weight: 50, description: "Recall @ 10 >= 98.5% compared to exhaustive brute-force search." },
      { metric: "P99 Query Latency", weight: 35, description: "P99 search latency <= 2.0ms across 1M 1536-dimensional vectors." },
      { metric: "Memory Overhead", weight: 15, description: "RAM usage <= 2.8GB for 1M 1536-dim vectors." }
    ],
    learningResources: [
      { title: "Efficient and robust approximate nearest neighbor search using Hierarchical Navigable Small World graphs (Malkov & Yashunin)", type: "Research Paper", url: "https://arxiv.org/abs/1603.09320" }
    ],
    strictTestCommand: "cargo bench && pytest tests/test_hnsw_engine.py --min-recall=0.985",
    acceptanceGates: [
      { rule: "Recall@10", threshold: ">= 98.5%", description: "Nearest neighbor recall must exceed 98.5%." },
      { rule: "P99 Latency", threshold: "<= 2.0ms", description: "P99 query time must remain under 2.0ms." }
    ],
    productionSla: "P99 query latency < 2.0ms, 10k QPS throughput."
  },
  {
    id: "p45",
    slug: "p2p-webrtc-collaborative-code-editor",
    title: "Real-Time Peer-to-Peer Collaborative Code Editor with WebRTC",
    tagline: "Monaco-powered collaborative code editor with Yjs CRDTs over WebRTC, live terminal sharing, and container execution.",
    difficulty: "Hard",
    domain: "Fullstack Web & Realtime Systems",
    durationDays: 45,
    techStack: ["Next.js 16", "Monaco Editor", "Yjs", "WebRTC", "WebSockets", "Docker", "Node.js"],
    partnerTools: ["Next.js", "Docker"],
    targetRoles: ["Frontend Dev", "Fullstack Dev", "Backend Dev"],
    keywords: ["monaco editor", "webrtc", "crdt", "yjs", "collaborative coding", "next.js", "docker sandbox"],
    overview: "Build an interactive pair-programming platform. Integrate the Monaco Code Editor with Yjs CRDTs over WebRTC peer connections for zero-latency multi-cursor editing, provide a shared web-terminal powered by xterm.js and WebSockets, and execute student code in isolated Docker containers with live streaming output.",
    architectureNotes: "Next.js Frontend -> Monaco Editor + Yjs Binding -> WebRTC P2P Data Channels -> xterm.js Terminal -> Docker Container Executor -> Live Terminal Broadcast.",
    databaseSchema: [
      "code_sessions (id UUID PK, title VARCHAR, language VARCHAR, code_snapshot TEXT, created_at TIMESTAMP)"
    ],
    apiEndpoints: [
      { method: "POST", path: "/api/v1/pair/create-session", description: "Initialize peer-to-peer coding room." },
      { method: "POST", path: "/api/v1/pair/run-code", description: "Execute code inside sandboxed ephemeral container." }
    ],
    milestones: [
      { phase: "Phase 1: Monaco Editor & Yjs CRDT Binding", days: "Days 1-15", goal: "Enable multi-cursor typing with zero conflict resolution delays.", deliverables: ["Monaco Yjs integration"] },
      { phase: "Phase 2: Shared Web Terminal & Docker Execution", days: "Days 16-30", goal: "Connect xterm.js to isolated container pty.", deliverables: ["Terminal streaming module", "Security sandbox"] },
      { phase: "Phase 3: Production Deployment & Staging", days: "Days 31-45", goal: "Deploy fullstack application supporting 20 concurrent pair-programmers.", deliverables: ["Next.js live app", "Automated Playwright tests"] }
    ],
    evaluationCriteria: [
      { metric: "Cursor Sync Latency", weight: 45, description: "P95 cursor position sync latency <= 25ms." },
      { metric: "Container Isolation", weight: 35, description: "Complete filesystem isolation for executed student scripts." },
      { metric: "Reliability", weight: 20, description: "Zero document desynchronization over 1-hour sessions." }
    ],
    learningResources: [
      { title: "Monaco Editor & Collaborative Yjs Bindings", type: "Documentation", url: "https://github.com/yjs/y-monaco" }
    ],
    strictTestCommand: "npx playwright test tests/test_collaborative_editor.spec.ts",
    acceptanceGates: [
      { rule: "Sync Latency", threshold: "<= 25ms", description: "Peer cursor sync must execute in under 25ms." }
    ],
    productionSla: "60fps editor render loop, 99.9% room uptime."
  },
  {
    id: "p46",
    slug: "distributed-chaos-engineering-latency-injector",
    title: "Distributed Chaos Engineering Mesh & Network Latency Injector",
    tagline: "Autonomous chaos orchestration platform injecting network packet loss, CPU throttling, and database latency to verify microservice resilience.",
    difficulty: "Hard",
    domain: "QA Mesh & Distributed Load",
    durationDays: 45,
    techStack: ["Go / Rust", "Linux Traffic Control (tc)", "Docker", "FastAPI", "Prometheus", "Grafana"],
    partnerTools: ["Docker", "Grafana"],
    targetRoles: ["Cloud DevOps", "Backend Dev", "QA Tester"],
    keywords: ["chaos engineering", "fault injection", "traffic control", "microservices", "resilience", "prometheus"],
    overview: "Build an enterprise chaos engineering platform. Use Linux Traffic Control (tc / netem) and Linux cgroups to inject automated network latency (100ms - 500ms), packet loss (5% - 25%), and CPU throttling into Docker microservices, validating that circuit breakers (Hystrix / Envoy) trip correctly without cascading outages.",
    architectureNotes: "Chaos Experiment Controller -> Linux Netem / TC Latency Injector -> Target Microservice Mesh -> Prometheus Telemetry Scraper -> Resilience SLA Validator.",
    databaseSchema: [
      "chaos_experiments (id UUID PK, target_service VARCHAR, fault_type VARCHAR, parameters JSONB, start_time TIMESTAMP, duration_seconds INT, status VARCHAR)",
      "circuit_breaker_events (id UUID PK, experiment_id UUID FK, service_name VARCHAR, state VARCHAR, tripped_at TIMESTAMP, recovery_time_ms INT)"
    ],
    apiEndpoints: [
      { method: "POST", path: "/api/v1/chaos/inject-fault", description: "Inject synthetic network latency or packet drop on target container." },
      { method: "POST", path: "/api/v1/chaos/rollback", description: "Immediately reset all network interfaces to clean state." }
    ],
    milestones: [
      { phase: "Phase 1: Linux TC Netem Fault Injector", days: "Days 1-15", goal: "Automate precise millisecond-level packet delays and packet drops.", deliverables: ["Netem injection module"] },
      { phase: "Phase 2: Microservice Circuit Breaker Validator", days: "Days 16-30", goal: "Verify Envoy / FastAPI circuit breakers open in < 2.0 seconds.", deliverables: ["Resilience validator", "Test reports"] },
      { phase: "Phase 3: Chaos Schedule Daemon & Web UI", days: "Days 31-45", goal: "Deploy web control panel with emergency one-click blast-radius rollback.", deliverables: ["Web dashboard", "FastAPI backend"] }
    ],
    evaluationCriteria: [
      { metric: "Fault Injection Precision", weight: 50, description: "Injected network delay matches target configured latency within +- 2.0ms." },
      { metric: "Rollback Reliability", weight: 35, description: "100% clean recovery of all network interfaces in < 500ms upon experiment termination." },
      { metric: "Safety Controls", weight: 15, description: "Strict blast-radius limits preventing non-target container disruption." }
    ],
    learningResources: [
      { title: "Principles of Chaos Engineering", type: "Documentation", url: "https://principlesofchaos.org" }
    ],
    strictTestCommand: "pytest tests/test_chaos_mesh.py --verify-safe-rollback",
    acceptanceGates: [
      { rule: "Rollback Speed", threshold: "< 500ms", description: "Complete fault cleanup must execute in under 500ms." }
    ],
    productionSla: "Sub-500ms emergency rollback, 100% isolation."
  },
  {
    id: "p47",
    slug: "multimodal-rag-vision-document-extractor",
    title: "Multimodal Visual Document RAG & LayoutLM Parser",
    tagline: "Extract tables, key-value forms, and charts from complex financial and legal PDF scans using LayoutLMv3 and ColPali visual embeddings.",
    difficulty: "Hard",
    domain: "GraphRAG & Knowledge Topology",
    durationDays: 45,
    techStack: ["PyTorch", "LayoutLMv3", "ColPali", "Qdrant", "FastAPI", "Docker", "PostgreSQL"],
    partnerTools: ["Qdrant", "PostgreSQL", "Docker"],
    targetRoles: ["AI Engineer", "Data & Financial ML", "Backend Dev"],
    keywords: ["multimodal rag", "layoutlm", "colpali", "document ai", "pdf parsing", "qdrant", "ocr"],
    overview: "Build an enterprise multi-modal document intelligence engine. Ingest unstructured scanned PDFs, balance sheets, and tax filings, apply LayoutLMv3 and ColPali visual embeddings to preserve spatial coordinate bounding boxes, and execute multi-modal vector search in Qdrant with table extraction accuracy > 93%.",
    architectureNotes: "Scanned PDF -> PDF Plumber / Tesseract OCR -> LayoutLMv3 Spatial Embedding -> ColPali Multi-Vector Index (Qdrant) -> Cross-Modal Retrieval -> Form JSON Generator.",
    databaseSchema: [
      "document_scans (id UUID PK, file_name VARCHAR, page_count INT, s3_uri TEXT, uploaded_at TIMESTAMP)",
      "extracted_tables (id UUID PK, doc_id UUID FK, page_number INT, table_json JSONB, bounding_box JSONB, confidence NUMERIC)"
    ],
    apiEndpoints: [
      { method: "POST", path: "/api/v1/docai/extract-tables", description: "Extract structured tables and key-value fields from PDF." },
      { method: "POST", path: "/api/v1/docai/query-document", description: "Execute visual RAG search over multi-page PDF documents." }
    ],
    milestones: [
      { phase: "Phase 1: LayoutLMv3 Spatial Tokenizer", days: "Days 1-15", goal: "Extract word tokens and 2D bounding boxes from PDF pages.", deliverables: ["Spatial tokenizer module"] },
      { phase: "Phase 2: ColPali Visual Vector Index in Qdrant", days: "Days 16-30", goal: "Index multi-modal page embeddings and implement visual retrieval.", deliverables: ["Qdrant visual index", "Retrieval benchmarks"] },
      { phase: "Phase 3: Table JSON Serializer & REST API", days: "Days 31-45", goal: "Serialize complex nested financial tables into structured JSON schemas.", deliverables: ["FastAPI service", "Interactive PDF query UI"] }
    ],
    evaluationCriteria: [
      { metric: "Table Extraction Accuracy", weight: 50, description: "Cell extraction accuracy >= 93.0% on DocBank / PubTables benchmark datasets." },
      { metric: "Query Retrieval Speed", weight: 35, description: "Multi-modal visual retrieval latency <= 400ms per query." },
      { metric: "Schema Validation", weight: 15, description: "100% valid Pydantic JSON serialization." }
    ],
    learningResources: [
      { title: "LayoutLMv3: Pre-training for Document AI (Microsoft)", type: "Research Paper", url: "https://arxiv.org/abs/2204.08387" }
    ],
    strictTestCommand: "pytest tests/test_docai_rag.py --min-accuracy=93.0",
    acceptanceGates: [
      { rule: "Accuracy", threshold: ">= 93.0%", description: "Table extraction accuracy must exceed 93%." }
    ],
    productionSla: "P95 query latency < 400ms, 99.9% availability."
  },
  {
    id: "p48",
    slug: "distributed-tracing-opentelemetry-collector",
    title: "High-Throughput OpenTelemetry Tracing Collector & APM Backend",
    tagline: "Build a high-performance OpenTelemetry OTLP trace ingestion collector in Go / Rust processing 50,000 spans/sec with ClickHouse storage.",
    difficulty: "Hard",
    domain: "Kernel eBPF & Autonomous Cloud",
    durationDays: 45,
    techStack: ["Go / Rust", "OpenTelemetry (OTLP)", "ClickHouse", "gRPC", "FastAPI", "Docker", "Grafana"],
    partnerTools: ["Docker", "Grafana"],
    targetRoles: ["Cloud DevOps", "Backend Dev", "QA Tester"],
    keywords: ["opentelemetry", "otlp", "clickhouse", "distributed tracing", "apm", "observability", "grpc"],
    overview: "Build an enterprise Application Performance Monitoring (APM) trace collector. Receive OpenTelemetry OTLP/gRPC trace spans at 50,000 spans/second, batch compress and insert into ClickHouse columnar storage, reconstruct distributed service trace graphs, and calculate p50/p95/p99 latency percentiles per microservice endpoint.",
    architectureNotes: "OTLP gRPC Ingest -> Memory Buffer -> ClickHouse Columnar Database -> Trace Graph Reconstruction Engine -> APM Query API -> Jaeger / Grafana UI.",
    databaseSchema: [
      "ClickHouse Engine: otel_traces (trace_id UUID, span_id UUID, parent_span_id UUID, service_name LowCardinality(String), span_name LowCardinality(String), duration_ns UInt64, status_code LowCardinality(String), attributes Map(String, String), timestamp DateTime64(6))"
    ],
    apiEndpoints: [
      { method: "POST", path: "/opentelemetry.proto.collector.trace.v1.TraceService/Export", description: "OTLP/gRPC trace export receiver." },
      { method: "GET", path: "/api/v1/apm/trace/{traceId}", description: "Retrieve full hierarchical distributed trace span waterfall." }
    ],
    milestones: [
      { phase: "Phase 1: OTLP gRPC Ingestion Server", days: "Days 1-15", goal: "Implement high-throughput protobuf decoder handling 50k spans/sec.", deliverables: ["gRPC OTLP receiver"] },
      { phase: "Phase 2: ClickHouse Batch Insertion & Schema", days: "Days 16-30", goal: "Design high-efficiency ClickHouse tables with 10x LZ4 compression.", deliverables: ["ClickHouse schema", "Insertion benchmarks"] },
      { phase: "Phase 3: Trace Graph Reconstruction & Web UI", days: "Days 31-45", goal: "Render interactive span waterfall diagrams and latency percentiles.", deliverables: ["Web dashboard", "Query API"] }
    ],
    evaluationCriteria: [
      { metric: "Ingestion Throughput", weight: 50, description: "Sustain >= 50,000 spans/second on 2 CPU cores with zero dropped spans." },
      { metric: "Trace Query Latency", weight: 35, description: "Fetch and reconstruct 100-span trace graph in under 40ms from ClickHouse." },
      { metric: "Data Compression", weight: 15, description: "Achieve >= 8x raw storage compression ratio." }
    ],
    learningResources: [
      { title: "OpenTelemetry Protocol (OTLP) Specification", type: "Documentation", url: "https://opentelemetry.io/docs/specs/otlp/" }
    ],
    strictTestCommand: "pytest tests/test_otel_collector.py --benchmark-50k",
    acceptanceGates: [
      { rule: "Throughput", threshold: ">= 50k spans/s", description: "Collector must sustain 50,000 spans/second." }
    ],
    productionSla: "P99 trace lookup < 40ms, 99.99% data durability."
  },
  {
    id: "p49",
    slug: "antigravity-autonomous-research-agent-swarm",
    title: "Antigravity Autonomous Research Swarm with Multi-Tool Verification",
    tagline: "Build an autonomous research swarm that searches the web, executes bash terminal checks, runs Python scripts, and produces rigorous whitepapers.",
    difficulty: "Hard",
    domain: "AI Agents & State Machines",
    durationDays: 45,
    techStack: ["Python", "LangGraph", "Docker", "FastAPI", "PostgreSQL", "Next.js"],
    partnerTools: ["Docker", "PostgreSQL", "FastAPI"],
    targetRoles: ["AI Engineer", "Backend Dev", "QA Tester", "Product Manager"],
    keywords: ["antigravity", "research agent", "langgraph", "autonomous", "tools", "fact checking"],
    overview: "Build an autonomous research agent platform inspired by Google Antigravity. Coordinate a swarm of specialized subagents (Web Searcher, Code Runner, Fact Verifier, Technical Writer) equipped with terminal bash and Python tools to perform exhaustive technical research, run empirical code experiments, and compile verified PDF whitepapers with full clickable citations.",
    architectureNotes: "User Research Topic -> Antigravity Lead Agent -> Web Search Subagent + Python Execution Subagent -> Citation Fact Verifier -> LaTeX / Markdown Compiler -> Published Whitepaper.",
    databaseSchema: [
      "research_projects (id UUID PK, topic VARCHAR, status VARCHAR, generated_whitepaper_md TEXT, citation_sources JSONB, completed_at TIMESTAMP)"
    ],
    apiEndpoints: [
      { method: "POST", path: "/api/v1/research/start-investigation", description: "Trigger multi-agent research investigation on technical prompt." },
      { method: "GET", path: "/api/v1/research/whitepaper/{id}", description: "Download compiled research paper with verified citations." }
    ],
    milestones: [
      { phase: "Phase 1: Agent Tool Integration & Sandboxing", days: "Days 1-15", goal: "Equip subagents with isolated search, python, and terminal toolkits.", deliverables: ["Tool runtime harness"] },
      { phase: "Phase 2: Multi-Agent Citation & Fact Verification", days: "Days 16-30", goal: "Verify 100% of claims against primary sources before drafting.", deliverables: ["Verification engine", "Accuracy report"] },
      { phase: "Phase 3: Whitepaper Generation & Web Interface", days: "Days 31-45", goal: "Deploy web interface rendering interactive research papers with clickable proofs.", deliverables: ["Next.js live app", "FastAPI service"] }
    ],
    evaluationCriteria: [
      { metric: "Citation Accuracy", weight: 50, description: "100% of cited claims verifiable in source URLs/papers; zero hallucinated references." },
      { metric: "Research Depth", weight: 30, description: "Comprehensive analysis including architecture diagrams, code snippets, and failure modes." },
      { metric: "Execution Latency", weight: 20, description: "Compile full 10-page research paper in under 3 minutes." }
    ],
    learningResources: [
      { title: "Building Autonomous Agent Swarms with LangGraph", type: "Documentation", url: "https://langchain-ai.github.io/langgraph/" }
    ],
    strictTestCommand: "pytest tests/test_research_agent.py --verify-citations",
    acceptanceGates: [
      { rule: "Citation Accuracy", threshold: "100%", description: "All citations must map to real source URLs." }
    ],
    productionSla: "P95 whitepaper generation < 3 minutes."
  },
  {
    id: "p50",
    slug: "custom-student-engineering-proposal",
    title: "Custom Student Engineering Proposal (Build Your Own Frontier System)",
    tagline: "Propose and ship your own novel architecture across any frontier domain. Approved directly by Founder Soham Sharma.",
    difficulty: "Hard",
    domain: "Custom Builder Project",
    durationDays: 45,
    techStack: ["Custom Stack", "FastAPI / Django", "PyTorch / Rust", "PostgreSQL", "Docker"],
    partnerTools: ["PostgreSQL", "Docker"],
    targetRoles: ["AI Engineer", "Backend Dev", "Frontend Dev", "Fullstack Dev", "Cloud DevOps", "Pen-tester", "QA Tester", "Product Manager", "Data & Financial ML"],
    keywords: ["custom project", "proposal", "startup idea", "independent project", "frontier engineering"],
    overview: "Have your own startup idea or frontier research challenge? Submit a structured technical proposal (Architecture Diagram, Database Schema, Tech Stack, SLA benchmarks). Upon review and approval by Founder Soham Sharma, build and ship your custom system as your official 45-Day Cohort milestone.",
    architectureNotes: "Student Technical Proposal -> Founder Architecture Audit -> Milestone Sign-off -> 45-Day Daily Ship & Office Hours -> Shippers Circle Referral Dispatch.",
    databaseSchema: [
      "custom_proposals (id UUID PK, student_email VARCHAR, project_title VARCHAR, domain VARCHAR, architecture_summary TEXT, approved_by_founder BOOLEAN, submitted_at TIMESTAMP)"
    ],
    apiEndpoints: [
      { method: "POST", path: "/api/v1/arena/custom-proposal", description: "Submit custom project proposal for founder review." }
    ],
    milestones: [
      { phase: "Phase 1: Architecture RFC & Milestone Plan", days: "Days 1-10", goal: "Author technical PRD, database schema, and test suite definitions.", deliverables: ["Technical PRD", "Founder sign-off"] },
      { phase: "Phase 2: Core Engineering & Alpha Build", days: "Days 11-25", goal: "Ship working alpha build with passing automated tests.", deliverables: ["Alpha GitHub repo", "CI/CD pipeline"] },
      { phase: "Phase 3: Production Hardening & Cloud Deploy", days: "Days 26-45", goal: "Deploy to cloud, pass security audit, and present at Showcase Thursday.", deliverables: ["Live production URL", "Demo video"] }
    ],
    evaluationCriteria: [
      { metric: "Technical Novelty & Execution Rigor", weight: 50, description: "System demonstrates production-grade architecture beyond generic CRUD apps." },
      { metric: "Daily Proof-of-Work Consistency", weight: 35, description: "Consistent daily GitHub commit logs and Discord standups." },
      { metric: "Production SLA & Test Coverage", weight: 15, description: "Passing test suite and measured latency/throughput benchmarks." }
    ],
    learningResources: [
      { title: "How to Write an Engineering Design Document", type: "Documentation", url: "https://www.industrialempathy.com/posts/design-docs-at-google/" }
    ],
    strictTestCommand: "pytest tests/ || cargo test || npm test",
    acceptanceGates: [
      { rule: "Test Coverage", threshold: ">= 80%", description: "Custom project must include automated test coverage." }
    ],
    productionSla: "Custom SLA defined in approved Technical PRD."
  },

  // ── BABY STEPS & STARTER KITS (INTRODUCTORY TIER) ──
  {
    id: "b1",
    slug: "cli-markdown-parser-sqlite",
    title: "CLI Markdown Document Parser & Metadata Extractor",
    tagline: "Baby Step Tier. Build a Python CLI that parses markdown frontmatter, extracts headings, and indexes notes into SQLite.",
    difficulty: "Baby Step",
    domain: "Baby Steps & Starter Kits",
    durationDays: 14,
    techStack: ["Python", "Click", "SQLite", "Pydantic", "Pytest"],
    partnerTools: ["Python", "SQLite"],
    targetRoles: ["Backend Dev", "AI Engineer", "Product Manager"],
    keywords: ["python", "cli", "markdown", "sqlite", "parser", "baby step", "beginner"],
    overview: "A beginner-friendly project to build confidence in command-line tooling and structured data persistence. Create a Python CLI tool that parses markdown files, extracts YAML frontmatter, validates metadata schemas with Pydantic, and indexes document headings and tags into a local SQLite database.",
    architectureNotes: "Terminal Input -> Click Command Router -> Frontmatter Regex/YAML Parser -> Pydantic Schema Validation -> SQLite Database -> JSON/Table CLI Output.",
    databaseSchema: [
      "documents (id INTEGER PRIMARY KEY AUTOINCREMENT, file_path TEXT UNIQUE, title TEXT, author TEXT, word_count INT, created_at TIMESTAMP)",
      "document_tags (id INTEGER PRIMARY KEY AUTOINCREMENT, doc_id INT REFERENCES documents(id), tag_name TEXT)"
    ],
    apiEndpoints: [
      { method: "CLI", path: "parse <path> --output json", description: "Parse single or recursive markdown files into structured JSON." },
      { method: "CLI", path: "query --tag <tag_name>", description: "Search indexed documents matching tag filters." }
    ],
    milestones: [
      { phase: "Phase 1: CLI Interface & Frontmatter Parser", days: "Days 1-5", goal: "Implement Click CLI flags and parse YAML frontmatter.", deliverables: ["Working CLI executable", "Unit tests for regex parsing"] },
      { phase: "Phase 2: SQLite Indexing & Search Queries", days: "Days 6-14", goal: "Store document structures in SQLite and add tag filtering.", deliverables: ["SQLite integration", "CLI query command"] }
    ],
    evaluationCriteria: [
      { metric: "CLI Error Handling", weight: 50, description: "Graceful handling of corrupt markdown and missing frontmatter." },
      { metric: "SQLite Query Speed", weight: 35, description: "Sub-10ms query response on 1,000 parsed notes." },
      { metric: "Test Coverage", weight: 15, description: ">= 85% pytest coverage." }
    ],
    learningResources: [
      { title: "Building Python CLIs with Click", type: "Documentation", url: "https://click.palletsprojects.com" }
    ],
    strictTestCommand: "pytest tests/test_parser.py -v",
    acceptanceGates: [
      { rule: "CLI Execution Time", threshold: "< 100ms", description: "Parsing a 100-file directory must complete in <100ms." }
    ],
    productionSla: "< 50ms per parsed document.",
    hint: "Use python-frontmatter or custom regex /yaml.safe_load/ with Pydantic BaseModel to handle dirty frontmatter without throwing unhandled exceptions.",
    hintCostCoins: 1000,
    highLevelDesign: "CLI Entrypoint -> File System Scanner -> Regex YAML Extractor -> Pydantic Validator -> SQLite Transaction Manager.",
    lowLevelDesign: "Class MarkdownParser(file_path: Path) with parse_metadata() -> DocumentSchema and index_to_sqlite(db_conn).",
    sdlcPhases: [
      { phase: "Requirements & PRD", details: "Define CLI parameters (--input, --output, --tag) and schema constraints." },
      { phase: "High-Level Design (HLD)", details: "Design pipeline flow from disk reading to relational SQLite storage." },
      { phase: "Low-Level Design (LLD)", details: "Pydantic models for FrontmatterMeta and DocumentNode." },
      { phase: "Implementation & CI/CD", details: "Python 3.11 with virtualenv, Click CLI, and GitHub Actions test runner." },
      { phase: "QA Test Assertions", details: "Pytest fixtures covering edge cases (empty frontmatter, unicode characters)." },
      { phase: "Production SRE Deploy", details: "Package as standalone pip wheel / pipx executable." }
    ]
  },
  {
    id: "b2",
    slug: "fastapi-json-validator-sqlite",
    title: "FastAPI Schema Sanitizer & JSON Validator",
    tagline: "Baby Step Tier. Build a clean REST endpoint that validates incoming JSON payloads against strict schemas and logs audit history.",
    difficulty: "Baby Step",
    domain: "Baby Steps & Starter Kits",
    durationDays: 14,
    techStack: ["FastAPI", "Python", "Pydantic", "SQLite", "Uvicorn"],
    partnerTools: ["FastAPI", "SQLite"],
    targetRoles: ["Backend Dev", "QA Tester", "Fullstack Dev"],
    keywords: ["fastapi", "python", "pydantic", "json validation", "rest api", "sqlite"],
    overview: "Build a production-structured FastAPI microservice that accepts polymorphic JSON payloads (User Profile, Order Event, Telemetry Log), validates strict types using Pydantic V2, strips dangerous XSS/SQLi characters, and records validated payloads to SQLite with request audit timestamps.",
    architectureNotes: "Client HTTP Request -> Uvicorn -> FastAPI Ingress -> Pydantic Schema Validation -> XSS Sanitizer -> SQLite Repository -> JSON Response.",
    databaseSchema: [
      "audit_logs (id INTEGER PRIMARY KEY AUTOINCREMENT, payload_type TEXT, is_valid BOOLEAN, error_details TEXT, client_ip TEXT, timestamp TIMESTAMP)"
    ],
    apiEndpoints: [
      { method: "POST", path: "/api/v1/validate", description: "Validate and sanitize JSON payload." },
      { method: "GET", path: "/api/v1/audit-logs", description: "Retrieve recent validation logs." }
    ],
    milestones: [
      { phase: "Phase 1: FastAPI Ingress & Pydantic Schemas", days: "Days 1-7", goal: "Build REST endpoints and define strict Pydantic schemas.", deliverables: ["FastAPI app", "Swagger documentation"] },
      { phase: "Phase 2: Sanitization & SQLite Logging", days: "Days 8-14", goal: "Implement XSS sanitization and persist audit records.", deliverables: ["SQLite audit repository", "Pytest suite"] }
    ],
    evaluationCriteria: [
      { metric: "Schema Accuracy", weight: 50, description: "Correct rejection of malformed or malicious JSON fields." },
      { metric: "Latency p95", weight: 35, description: "Endpoint p95 latency <= 15ms under local load." },
      { metric: "Test Suite", weight: 15, description: "100% pass rate on payload test cases." }
    ],
    learningResources: [
      { title: "FastAPI Official Tutorial", type: "Documentation", url: "https://fastapi.tiangolo.com/tutorial/" }
    ],
    strictTestCommand: "pytest tests/ -v",
    acceptanceGates: [
      { rule: "API Response Time", threshold: "< 25ms", description: "Validation latency must stay under 25ms." }
    ],
    productionSla: "< 15ms p95 validation latency.",
    hint: "Use Pydantic's field_validator decorator combined with bleach or html.escape to sanitize string fields without corrupting JSON structures.",
    hintCostCoins: 1000
  },
  {
    id: "b3",
    slug: "llm-prompt-cache-wrapper",
    title: "Prompt Wrapper & LRU Response Caching Middleware",
    tagline: "Baby Step Tier. Build a Python/Node.js proxy that hashes prompt text and serves cached LLM responses with sub-5ms latency.",
    difficulty: "Baby Step",
    domain: "Baby Steps & Starter Kits",
    durationDays: 14,
    techStack: ["Node.js", "Express", "TypeScript", "Crypto", "LRU Cache"],
    partnerTools: ["Node.js", "TypeScript"],
    targetRoles: ["AI Engineer", "Backend Dev"],
    keywords: ["llm", "cache", "prompt engineering", "lru", "token savings", "middleware"],
    overview: "Build an intelligent caching middleware for LLM applications. Compute SHA-256 hashes of system prompts and user inputs, serve instant cached responses for identical queries, and track API token cost savings in real time.",
    architectureNotes: "Client Application -> Cache Middleware -> SHA-256 Prompt Hasher -> LRU Memory Cache (Hit) OR Mock LLM Engine (Miss) -> Token Analytics Collector.",
    databaseSchema: [
      "cache_metrics (id SERIAL PRIMARY KEY, prompt_hash VARCHAR(64), tokens_saved INT, latency_saved_ms INT, hit_count INT, created_at TIMESTAMP)"
    ],
    apiEndpoints: [
      { method: "POST", path: "/v1/chat/completions", description: "Cached OpenAI-compatible completion proxy." },
      { method: "GET", path: "/v1/cache/stats", description: "Retrieve token savings and cache hit ratio." }
    ],
    milestones: [
      { phase: "Phase 1: Hash Algorithm & Memory Store", days: "Days 1-7", goal: "Implement SHA-256 prompt normalization and LRU store.", deliverables: ["Cache engine", "Unit tests"] },
      { phase: "Phase 2: Token Analytics & Metrics Endpoint", days: "Days 8-14", goal: "Build metrics dashboard endpoint calculating cost savings.", deliverables: ["Stats API", "Load test script"] }
    ],
    evaluationCriteria: [
      { metric: "Cache Hit Latency", weight: 50, description: "Cached hits served in <= 5ms." },
      { metric: "Prompt Normalization", weight: 35, description: "Whitespace and case-insensitive prompt hashing." },
      { metric: "Code Cleanliness", weight: 15, description: "TypeScript strict mode without any types." }
    ],
    learningResources: [
      { title: "Building High-Speed Caches in Node.js", type: "Documentation", url: "https://nodejs.org/api/crypto.html" }
    ],
    strictTestCommand: "npm test",
    acceptanceGates: [
      { rule: "Cache Hit SLA", threshold: "< 5ms", description: "In-memory cache lookups must return in under 5ms." }
    ],
    productionSla: "< 5ms for cached prompt hits.",
    hint: "Normalize prompt text by trimming outer whitespace, converting to lowercase for keyword queries, and hashing the JSON-serialized message array.",
    hintCostCoins: 1000
  },
  {
    id: "b4",
    slug: "discord-github-webhook-bot",
    title: "Discord GitHub Webhook & Build Event Dispatcher",
    tagline: "Baby Step Tier. Build a webhook receiver that parses GitHub commit, PR, and release payloads and formats rich Discord embeds.",
    difficulty: "Baby Step",
    domain: "Baby Steps & Starter Kits",
    durationDays: 14,
    techStack: ["TypeScript", "Express", "Discord Webhooks", "Crypto HMAC", "Jest"],
    partnerTools: ["Discord", "GitHub"],
    targetRoles: ["Backend Dev", "Cloud DevOps", "Product Manager"],
    keywords: ["discord", "github", "webhooks", "bot", "embeds", "hmac verification"],
    overview: "Build a reliable GitHub-to-Discord notification gateway. Verify GitHub HMAC SHA-256 signatures, format clean rich markdown cards for commits, pull requests, and CI build failures, and dispatch them to Discord channels.",
    architectureNotes: "GitHub Webhook Event -> HMAC Signature Verifier -> Event Dispatcher -> Discord Webhook API.",
    databaseSchema: [
      "webhook_events (id SERIAL PRIMARY KEY, repo_name VARCHAR(100), event_type VARCHAR(50), author VARCHAR(100), delivered_to_discord BOOLEAN, created_at TIMESTAMP)"
    ],
    apiEndpoints: [
      { method: "POST", path: "/webhooks/github", description: "Receive and verify GitHub webhooks." }
    ],
    milestones: [
      { phase: "Phase 1: HMAC Verification & Parsing", days: "Days 1-7", goal: "Verify GitHub X-Hub-Signature-256 headers.", deliverables: ["Signature middleware", "Security tests"] },
      { phase: "Phase 2: Discord Embed Dispatcher", days: "Days 8-14", goal: "Format and send rich Discord webhook embeds.", deliverables: ["Discord bot gateway", "E2E webhook simulation"] }
    ],
    evaluationCriteria: [
      { metric: "Security Verification", weight: 50, description: "Strict rejection of unauthenticated webhook payloads." },
      { metric: "Embed Visual Polish", weight: 35, description: "Color-coded status (Green for merged, Red for CI fail)." },
      { metric: "Reliability", weight: 15, description: "Graceful error retry on Discord rate limits (HTTP 429)." }
    ],
    learningResources: [
      { title: "Securing GitHub Webhooks", type: "Documentation", url: "https://docs.github.com/en/webhooks/using-webhooks/validating-webhook-deliveries" }
    ],
    strictTestCommand: "npm test",
    acceptanceGates: [
      { rule: "Delivery Success Rate", threshold: "100%", description: "All valid GitHub events must deliver to Discord." }
    ],
    productionSla: "< 150ms webhook processing time.",
    hint: "Use crypto.createHmac('sha256', secret).update(rawBody).digest('hex') with crypto.timingSafeEqual to prevent timing attacks.",
    hintCostCoins: 1000
  },

  // ── EASY FOUNDATION PROJECTS (BEGINNER-FRIENDLY TIER) ──
  {
    id: "e1",
    slug: "postgres-prisma-task-api",
    title: "PostgreSQL Task REST API with Prisma ORM & Pagination",
    tagline: "Easy Foundation Tier. Build an industrial CRUD API with PostgreSQL, Prisma ORM, cursor-based pagination, and Zod validation.",
    difficulty: "Easy",
    domain: "Easy Foundation Projects",
    durationDays: 21,
    techStack: ["Node.js", "TypeScript", "Express", "Prisma ORM", "PostgreSQL", "Zod", "Jest"],
    partnerTools: ["PostgreSQL", "Prisma"],
    targetRoles: ["Backend Dev", "Fullstack Dev", "QA Tester"],
    keywords: ["postgresql", "prisma", "orm", "crud", "pagination", "zod", "easy foundation"],
    overview: "Step up to relational databases. Design a clean task management REST API using PostgreSQL and Prisma ORM. Implement cursor-based pagination for high performance, enforce Zod input validation, handle database foreign key constraints, and write comprehensive integration tests with Jest.",
    architectureNotes: "Express Router -> Zod Validation Middleware -> Prisma Client -> PostgreSQL 16 Engine -> JSON Formatted Response.",
    databaseSchema: [
      "users (id UUID PRIMARY KEY, email VARCHAR UNIQUE, name VARCHAR, created_at TIMESTAMP)",
      "tasks (id UUID PRIMARY KEY, user_id UUID REFERENCES users(id) ON DELETE CASCADE, title VARCHAR, status VARCHAR, priority VARCHAR, due_date TIMESTAMP, created_at TIMESTAMP)",
      "task_labels (id UUID PRIMARY KEY, task_id UUID REFERENCES tasks(id) ON DELETE CASCADE, label VARCHAR)"
    ],
    apiEndpoints: [
      { method: "GET", path: "/api/v1/tasks?limit=20&cursor=UUID", description: "Fetch paginated tasks with cursor navigation." },
      { method: "POST", path: "/api/v1/tasks", description: "Create task with labels and validation." },
      { method: "PATCH", path: "/api/v1/tasks/:id", description: "Update task status." }
    ],
    milestones: [
      { phase: "Phase 1: Prisma Schema & Migrations", days: "Days 1-7", goal: "Define relational schema and run Prisma migrations.", deliverables: ["schema.prisma", "PostgreSQL Docker compose"] },
      { phase: "Phase 2: REST Endpoints & Pagination", days: "Days 8-14", goal: "Build CRUD endpoints with cursor pagination.", deliverables: ["Express controllers", "Zod schemas"] },
      { phase: "Phase 3: Integration Tests & Benchmark", days: "Days 15-21", goal: "Write Jest supertest integration tests.", deliverables: ["Integration test suite", "Latency benchmark"] }
    ],
    evaluationCriteria: [
      { metric: "Cursor Pagination Correctness", weight: 45, description: "Zero record skipping or duplication across pages." },
      { metric: "Query Optimization", weight: 35, description: "Use of compound indexes on (user_id, created_at)." },
      { metric: "Test Suite Pass Rate", weight: 20, description: "100% passing Jest integration tests." }
    ],
    learningResources: [
      { title: "Prisma ORM Getting Started Guide", type: "Documentation", url: "https://www.prisma.io/docs/getting-started" }
    ],
    strictTestCommand: "npx jest --runInBand",
    acceptanceGates: [
      { rule: "Paginated Query Latency", threshold: "< 35ms", description: "Fetching 20 records must complete in under 35ms." }
    ],
    productionSla: "< 25ms p95 for paginated relational queries.",
    hint: "Use take: limit + 1 with cursor: { id: cursorId } and skip: 1 to determine hasNextPage without running expensive SQL COUNT(*) queries.",
    hintCostCoins: 1000,
    highLevelDesign: "Client HTTP Request -> Express Middleware -> Prisma Service Layer -> PostgreSQL Database (with B-tree indices on foreign keys).",
    lowLevelDesign: "Interfaces for TaskCreateInput, TaskQueryFilter, and PaginatedResponse<T>. Repository pattern separating database access from business logic.",
    sdlcPhases: [
      { phase: "Requirements & PRD", details: "Define pagination limits, sorting rules, and relational cascade deletes." },
      { phase: "High-Level Design (HLD)", details: "Design client-server interaction and database connection pooling." },
      { phase: "Low-Level Design (LLD)", details: "Prisma schema models, Zod validation contracts, error middleware." },
      { phase: "Implementation & CI/CD", details: "TypeScript codebase with Dockerized PostgreSQL container." },
      { phase: "QA Test Assertions", details: "Supertest suites validating CRUD, status transitions, and pagination edge cases." },
      { phase: "Production SRE Deploy", details: "Containerized deployment with DATABASE_URL pooling." }
    ]
  },
  {
    id: "e2",
    slug: "chromadb-qa-vector-search",
    title: "ChromaDB Vector Document Search & QA Retrieval Server",
    tagline: "Easy Foundation Tier. Build an embedded vector search microservice that ingests technical PDFs and performs cosine similarity search.",
    difficulty: "Easy",
    domain: "Easy Foundation Projects",
    durationDays: 21,
    techStack: ["Python", "FastAPI", "ChromaDB", "sentence-transformers", "Pytest"],
    partnerTools: ["Python", "ChromaDB"],
    targetRoles: ["AI Engineer", "Backend Dev", "Data & Financial ML"],
    keywords: ["chromadb", "vector search", "embeddings", "rag", "fastapi", "cosine similarity"],
    overview: "Your first practical AI retrieval system. Build a standalone FastAPI vector search microservice that takes plain-text and PDF documents, chunks them into 500-token snippets, generates 384-dimensional dense embeddings using all-MiniLM-L6-v2, and performs cosine similarity queries with sub-50ms latency.",
    architectureNotes: "Document Ingest -> Recursive Character Chunker -> SentenceTransformer Embedder -> ChromaDB Collection -> Cosine Similarity Query -> Top-K Context Return.",
    databaseSchema: [
      "chromadb_collection: documents (id, embedding float[384], document_text, metadata: {source, chunk_index, timestamp})"
    ],
    apiEndpoints: [
      { method: "POST", path: "/api/v1/documents/ingest", description: "Chunk and index text document into ChromaDB." },
      { method: "POST", path: "/api/v1/search", description: "Perform semantic cosine similarity search returning top-k chunks." }
    ],
    milestones: [
      { phase: "Phase 1: Embedding Pipeline & Chroma Setup", days: "Days 1-7", goal: "Initialize ChromaDB and SentenceTransformer embedding engine.", deliverables: ["Embedding service", "Chunking script"] },
      { phase: "Phase 2: FastAPI Search & Ingest Endpoints", days: "Days 8-14", goal: "Build REST endpoints for indexing and semantic querying.", deliverables: ["FastAPI app", "Swagger UI testing"] },
      { phase: "Phase 3: Evaluation & Similarity Benchmarks", days: "Days 15-21", goal: "Evaluate retrieval accuracy against technical FAQs.", deliverables: ["Evaluation benchmark report", "Pytest suite"] }
    ],
    evaluationCriteria: [
      { metric: "Retrieval Latency", weight: 45, description: "Top-5 cosine search completes in <= 50ms." },
      { metric: "Chunking Quality", weight: 35, description: "No mid-sentence truncation; 50-token overlap preserved." },
      { metric: "API Usability", weight: 20, description: "Clean JSON responses with similarity distance scores." }
    ],
    learningResources: [
      { title: "ChromaDB Python Getting Started", type: "Documentation", url: "https://docs.trychroma.com/getting-started" }
    ],
    strictTestCommand: "pytest tests/ -v",
    acceptanceGates: [
      { rule: "Search Latency", threshold: "< 60ms", description: "Semantic search must return top-5 results in under 60ms." }
    ],
    productionSla: "< 45ms p95 for vector similarity queries.",
    hint: "Use chromadb.PersistentClient(path='./data') and batch your document insertions in groups of 50 to prevent memory spikes during ingestion.",
    hintCostCoins: 1000
  },
  {
    id: "e3",
    slug: "redis-token-bucket-rate-limiter",
    title: "Redis Token Bucket API Rate Limiting Middleware",
    tagline: "Easy Foundation Tier. Build an industrial rate limiter with Redis Lua scripts preventing API abuse with sub-2ms overhead.",
    difficulty: "Easy",
    domain: "Easy Foundation Projects",
    durationDays: 21,
    techStack: ["Node.js", "Express", "TypeScript", "Redis", "Lua Scripts", "k6"],
    partnerTools: ["Redis", "Node.js"],
    targetRoles: ["Backend Dev", "Cloud DevOps", "QA Tester"],
    keywords: ["redis", "rate limiting", "token bucket", "lua", "middleware", "express"],
    overview: "Understand production traffic shaping. Implement an atomic Token Bucket rate limiting middleware in Node.js backed by Redis. Use atomic Lua scripts to prevent race conditions across distributed instances, return standard HTTP 429 Retry-After headers, and benchmark throughput with k6.",
    architectureNotes: "HTTP Client -> Rate Limiter Middleware -> Redis Atomic Lua Script (Token Check & Refill) -> Allow (Next) OR 429 Too Many Requests.",
    databaseSchema: [
      "redis_key: ratelimit:{client_ip}:{route} (HASH: tokens, last_refill_timestamp)"
    ],
    apiEndpoints: [
      { method: "GET", path: "/api/v1/protected-resource", description: "Rate-limited endpoint (max 10 requests / min)." },
      { method: "GET", path: "/api/v1/rate-limit/status", description: "Check current token quota." }
    ],
    milestones: [
      { phase: "Phase 1: Lua Script & Token Bucket Logic", days: "Days 1-7", goal: "Write and unit-test atomic Redis Lua script.", deliverables: ["rate_limit.lua", "Jest unit tests"] },
      { phase: "Phase 2: Express Middleware & Headers", days: "Days 8-14", goal: "Integrate middleware with standard X-RateLimit-* headers.", deliverables: ["Express middleware", "Header verification"] },
      { phase: "Phase 3: k6 Load Testing & Concurrency Benchmark", days: "Days 15-21", goal: "Execute 500 VU concurrency test verifying zero race conditions.", deliverables: ["k6 test report", "Sub-2ms latency proof"] }
    ],
    evaluationCriteria: [
      { metric: "Race Condition Resistance", weight: 50, description: "Atomic execution ensures zero over-quota bursts under high concurrency." },
      { metric: "Middleware Overhead", weight: 35, description: "Rate limit evaluation completes in <= 2ms." },
      { metric: "Standard Headers", weight: 15, description: "Accurate X-RateLimit-Limit, Remaining, and Reset headers." }
    ],
    learningResources: [
      { title: "Redis Rate Limiting Patterns", type: "Documentation", url: "https://redis.io/glossary/rate-limiting/" }
    ],
    strictTestCommand: "npm test && k6 run tests/load_test.js",
    acceptanceGates: [
      { rule: "Middleware Latency", threshold: "< 3ms", description: "Redis check overhead must remain under 3ms." }
    ],
    productionSla: "< 2ms Redis evaluation overhead.",
    hint: "Executing the token calculation inside a single Redis EVAL script guarantees atomicity without needing distributed locks.",
    hintCostCoins: 1000
  },
  {
    id: "e4",
    slug: "github-pr-summary-action",
    title: "GitHub Pull Request AI Code Reviewer Action",
    tagline: "Easy Foundation Tier. Build a GitHub Action that inspects git diffs, detects syntax smells, and posts automated PR review comments.",
    difficulty: "Easy",
    domain: "Easy Foundation Projects",
    durationDays: 21,
    techStack: ["TypeScript", "GitHub Actions SDK", "Octokit", "Gemini API", "Jest"],
    partnerTools: ["GitHub", "TypeScript"],
    targetRoles: ["Cloud DevOps", "Backend Dev", "AI Engineer"],
    keywords: ["github actions", "octokit", "ai code review", "git diff", "devops"],
    overview: "Build real developer tooling. Create a custom GitHub Action that triggers on pull request creation, retrieves changed git diffs via Octokit, generates a 3-point architectural summary and security audit using the Gemini API, and comments directly on the PR thread.",
    architectureNotes: "GitHub PR Event -> Action Workflow Trigger -> Octokit Diff Fetcher -> Prompt Formatter -> LLM Inference -> Octokit Issue Comment Creator.",
    databaseSchema: [
      "github_reviews (id SERIAL PRIMARY KEY, repo VARCHAR, pr_number INT, diff_lines INT, review_status VARCHAR, created_at TIMESTAMP)"
    ],
    apiEndpoints: [
      { method: "Action", path: "action.yml", description: "GitHub Action workflow runner." }
    ],
    milestones: [
      { phase: "Phase 1: Octokit PR Diff Extraction", days: "Days 1-7", goal: "Fetch pull request files and diff patches using GitHub token.", deliverables: ["Octokit client", "Mock PR tests"] },
      { phase: "Phase 2: LLM Review & Comment Formatter", days: "Days 8-14", goal: "Generate structured code review summaries.", deliverables: ["Review engine", "Markdown template"] },
      { phase: "Phase 3: Live Action Testing on GitHub Repo", days: "Days 15-21", goal: "Deploy action to a live repository and test PR triggers.", deliverables: ["action.yml release", "Live pull request demo"] }
    ],
    evaluationCriteria: [
      { metric: "Summary Conciseness", weight: 45, description: "Clear, non-hallucinated review comments focused on actual changed lines." },
      { metric: "Execution Speed", weight: 35, description: "Entire action workflow completes in <= 15 seconds." },
      { metric: "Error Handling", weight: 20, description: "Graceful handling of massive diffs (>5,000 lines)." }
    ],
    learningResources: [
      { title: "Creating JavaScript Actions", type: "Documentation", url: "https://docs.github.com/en/actions/creating-actions/creating-a-javascript-action" }
    ],
    strictTestCommand: "npm test",
    acceptanceGates: [
      { rule: "Action Runtime", threshold: "< 20s", description: "Action execution must finish in under 20 seconds." }
    ],
    productionSla: "< 15s end-to-end pull request review.",
    hint: "Filter out package-lock.json and generated dist/ files from the git diff before sending the prompt to prevent token exhaustion.",
    hintCostCoins: 1000
  },
  {
    id: "e5",
    slug: "websocket-realtime-chat-server",
    title: "Real-Time WebSocket Echo & Channel Chat Server",
    tagline: "Easy Foundation Tier. Build a scalable WebSocket room server with Redis pub/sub broadcasting messages to thousands of connected clients.",
    difficulty: "Easy",
    domain: "Easy Foundation Projects",
    durationDays: 21,
    techStack: ["Node.js", "TypeScript", "WebSocket (ws)", "Redis Pub/Sub", "PostgreSQL", "Jest"],
    partnerTools: ["Redis", "PostgreSQL"],
    targetRoles: ["Backend Dev", "Fullstack Dev", "QA Tester"],
    keywords: ["websockets", "realtime", "redis pubsub", "chat", "broadcast", "concurrency"],
    overview: "Master bi-directional real-time communication. Build a high-performance WebSocket server supporting multiple rooms, user join/leave events, message history persistence in PostgreSQL, and horizontal scaling via Redis Pub/Sub channels.",
    architectureNotes: "Browser WebSocket Client -> ws Server -> Room Manager -> Redis Pub/Sub Message Bus -> PostgreSQL Message Archiver.",
    databaseSchema: [
      "chat_rooms (id UUID PRIMARY KEY, name VARCHAR(50) UNIQUE, created_at TIMESTAMP)",
      "room_messages (id UUID PRIMARY KEY, room_id UUID REFERENCES chat_rooms(id), sender_name VARCHAR(50), message_text TEXT, sent_at TIMESTAMP)"
    ],
    apiEndpoints: [
      { method: "WS", path: "/ws/chat?room=general", description: "Bi-directional WebSocket connection for room chat." },
      { method: "GET", path: "/api/v1/rooms/:roomId/messages", description: "Fetch recent 50 messages for room." }
    ],
    milestones: [
      { phase: "Phase 1: WebSocket Room & Connection Lifecycle", days: "Days 1-7", goal: "Implement room joins, heartbeats (ping/pong), and disconnect cleanup.", deliverables: ["ws server", "Connection manager"] },
      { phase: "Phase 2: Redis Pub/Sub & Multi-Instance Broadcast", days: "Days 8-14", goal: "Synchronize messages across two server instances using Redis.", deliverables: ["Redis pub/sub adapter", "Broadcast tests"] },
      { phase: "Phase 3: Database Archiving & Load Testing", days: "Days 15-21", goal: "Archive messages in PostgreSQL and test with 500 concurrent connections.", deliverables: ["PostgreSQL repository", "k6 WebSocket benchmark"] }
    ],
    evaluationCriteria: [
      { metric: "Broadcast Latency", weight: 45, description: "Message received by all room subscribers in <= 15ms." },
      { metric: "Heartbeat Reliability", weight: 35, description: "Automatic termination of zombie connections after 30s timeout." },
      { metric: "Test Suite Pass Rate", weight: 20, description: "100% pass on WebSocket mock client tests." }
    ],
    learningResources: [
      { title: "Node.js WebSocket ws Documentation", type: "Documentation", url: "https://github.com/websockets/ws" }
    ],
    strictTestCommand: "npm test",
    acceptanceGates: [
      { rule: "Broadcast Latency", threshold: "< 20ms", description: "Room broadcast must dispatch in under 20ms." }
    ],
    productionSla: "< 15ms p95 message propagation latency.",
    hint: "Implement an interval timer that pings all clients every 30 seconds and terminates sockets that fail to return a pong frame.",
    hintCostCoins: 1000
  }
];

export const TOTAL_SYSTEMS_COUNT = ARENA_PROJECTS.length;
