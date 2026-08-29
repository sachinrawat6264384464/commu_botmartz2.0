export interface ArenaProject {
  id: string;
  title: string;
  slug: string;
  tagline: string;
  difficulty: "Intermediate" | "Hard" | "Insane" | "Go To Hell 💀";
  domain: 
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
    | "Fullstack Web & Mobile Systems"
    | "Audio DSP & Speech AI"
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
}

// 50 Production Projects for the 45-Day Student Cohort (14th Sept - Diwali)
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
      { phase: "Phase 4: Cloud Deploy & Disaster Alert Gateway", days: "Days 36-45", goal: "Deploy on AWS EC2 with GPU acceleration, CI/CD pipeline, and public interactive map.", deliverables: ["Live cloud API URL", "GitHub repo with automated test harness", "Demo Day dissertation"] }
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
    keywords: ["sar", "radar", "flood detection", "maritime", "sentinel-1", "geospatial", "snappy", "pytorch", "gis"],
    overview: "Build an all-weather flood mapping and maritime vessel detection pipeline using Sentinel-1 Synthetic Aperture Radar (SAR) imagery. Apply Lee/Frost speckle filtering to VV/VH polarization channels, perform thresholding for standing water extent extraction, and deploy a CFAR (Constant False Alarm Rate) target detector for ocean vessel tracking.",
    architectureNotes: "Sentinel-1 SAR Data -> SNAP Graph Processing Tool (Calibrate & Speckle Filter) -> Dual-Polarization Tensor Stack -> Water Extent Classifier + CFAR Vessel Detector -> GeoJSON Vector Exporter -> Web Tile Server.",
    databaseSchema: [
      "sar_scenes (id UUID PK, acquisition_time TIMESTAMP, pass_direction VARCHAR, polarization VARCHAR, footprint GEOMETRY(POLYGON, 4326))",
      "flood_events (id UUID PK, region_name VARCHAR, inundated_area_sqkm NUMERIC, water_mask_geojson JSONB, detected_at TIMESTAMP)",
      "vessel_detections (id UUID PK, lat NUMERIC, lng NUMERIC, estimated_length_m NUMERIC, confidence NUMERIC, radar_cross_section NUMERIC)"
    ],
    apiEndpoints: [
      { method: "POST", path: "/api/v1/sar/process-scene", description: "Trigger speckle filtering and flood extent binarization." },
      { method: "GET", path: "/api/v1/sar/maritime-vessels", description: "Query detected maritime vessels in specified EEZ bounding box." }
    ],
    milestones: [
      { phase: "Phase 1: SAR Calibration & Speckle Filtering", days: "Days 1-15", goal: "Implement radiometric calibration and Lee/Frost speckle filtering on SAR GRD products.", deliverables: ["SAR preprocessing pipeline", "Docker container with ESA SNAP", "Speckle noise reduction test"] },
      { phase: "Phase 2: Water Segmentation & CFAR Vessel Detection", days: "Days 16-30", goal: "Implement Otsu thresholding for flood mapping and CFAR detector for vessels.", deliverables: ["Flood polygon extractor", "CFAR vessel detector", "Precision/Recall benchmark"] },
      { phase: "Phase 3: Real-Time Disaster API & Cloud Deploy", days: "Days 31-45", goal: "Deploy FastAPI tile server and automated disaster alerting trigger on AWS.", deliverables: ["Live API on AWS", "GeoJSON flood overlay map", "Dissertation report"] }
    ],
    evaluationCriteria: [
      { metric: "Flood Mapping Accuracy (F1)", weight: 45, description: "F1 score >= 0.90 against ground-truth Copernicus Emergency Management maps." },
      { metric: "Vessel Detection Precision", weight: 35, description: "Precision >= 92% with false alarm rate < 1 vessel per 1,000 sq km of open ocean." },
      { metric: "Daily Ship Logs", weight: 20, description: "Consistent daily logs on LinkedIn and Discord." }
    ],
    learningResources: [
      { title: "Synthetic Aperture Radar (SAR) Principles & Flood Mapping (NASA ARSET)", type: "YouTube Video", url: "https://www.youtube.com/watch?v=F_Yv2U23g7M" },
      { title: "ESA Sentinel-1 SAR User Guide", type: "Documentation", url: "https://sentinels.copernicus.eu/web/sentinel/user-guides/sentinel-1-sar" }
    ],
    strictTestCommand: "pytest tests/test_sar_pipeline.py --min-f1=0.90",
    acceptanceGates: [
      { rule: "Flood F1 Score", threshold: ">= 0.90", description: "Flood water boundary classification must exceed 90% F1 score." },
      { rule: "Vessel False Alarm Rate", threshold: "< 0.001/sqkm", description: "CFAR detector must produce fewer than 1 false alarm per 1000 km²." }
    ],
    productionSla: "Sub-5 second processing time per 250MB SAR sub-swath."
  },

  // ── 2. EDGE DRONE VISION & ROBOTICS ──
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
    partnerTools: ["Docker", "Redis", "AWS EC2", "OpenCV"],
    targetRoles: ["AI Engineer", "Backend Dev", "Cloud DevOps", "QA Tester"],
    keywords: ["drone", "robotics", "webrtc", "yolo", "bytetrack", "opencv", "computer vision", "object tracking", "rtsp", "streaming", "edge ai"],
    overview: "Engineer an ultra-low-latency vision telemetry engine for autonomous drones. Ingest high-framerate 1080p 60fps video streams over WebRTC (aiortc) / RTSP, execute hardware-accelerated YOLOv11 object detection, track 100+ simultaneous targets with ByteTrack Kalman filtering, compute dynamic polygon geofence infractions, and stream live coordinate overlays to a WebSocket mission control dashboard.",
    architectureNotes: "Drone RTSP/WebRTC Video Ingest -> aiortc Asynchronous Media Stream -> OpenCV Frame Buffer -> TensorRT / ONNX YOLOv11 Detector -> ByteTrack Association & Kalman Filter -> Geofence Evaluation Engine -> Redis Stream Producer -> WebSocket Dispatcher -> Mission Control UI.",
    databaseSchema: [
      "drone_missions (id UUID PK, drone_callsign VARCHAR, start_time TIMESTAMP, end_time TIMESTAMP, status VARCHAR)",
      "telemetry_frames (id UUID PK, mission_id UUID FK, frame_index INT, timestamp TIMESTAMP, drone_lat NUMERIC, drone_lng NUMERIC, altitude NUMERIC, battery_pct INT)",
      "tracked_entities (id UUID PK, mission_id UUID FK, track_id INT, object_class VARCHAR, confidence NUMERIC, bounding_box JSONB, trajectory JSONB)",
      "geofence_violations (id UUID PK, mission_id UUID FK, track_id INT, geofence_zone_name VARCHAR, violation_timestamp TIMESTAMP, snapshot_url TEXT)"
    ],
    apiEndpoints: [
      { method: "POST", path: "/api/v1/drone/webrtc/offer", description: "Establish WebRTC peer connection for low-latency video stream." },
      { method: "POST", path: "/api/v1/drone/geofences", description: "Define dynamic polygon boundaries and breach trigger rules." },
      { method: "GET", path: "/api/v1/drone/missions/{id}/trajectories", description: "Fetch historical object tracking trajectories and speed vectors." },
      { method: "WS", path: "/ws/v1/mission-control/{id}", description: "Real-time 60fps stream of bounding boxes, telemetry, and breach alerts." }
    ],
    milestones: [
      { phase: "Phase 1: WebRTC / RTSP Ingest & Buffer", days: "Days 1-15", goal: "Set up asynchronous aiortc server handling 1080p 60fps video stream with zero jitter.", deliverables: ["aiortc video pipeline", "Frame drop benchmark report", "Docker Compose setup"] },
      { phase: "Phase 2: YOLOv11 & ByteTrack Integration", days: "Days 16-30", goal: "Integrate TensorRT/ONNX YOLOv11 detector and ByteTrack Kalman filter tracking.", deliverables: ["Inference pipeline (<25ms)", "Kalman trajectory tracker", "Multi-object test suite"] },
      { phase: "Phase 3: Polygon Geofence Engine & Cloud Launch", days: "Days 31-45", goal: "Implement ray-casting polygon math, WebSocket broadcasting, and live cloud deployment.", deliverables: ["Geofence evaluation engine", "Live mission control dashboard", "Final dissertation"] }
    ],
    evaluationCriteria: [
      { metric: "Frame Processing Latency", weight: 40, description: "Sustained 60 FPS (sub-28ms end-to-end latency per frame) under simulated network packet loss." },
      { metric: "Tracking Consistency (ID Switch Rate)", weight: 30, description: "ID switch rate < 2% across 100 moving entities in dense occluded video." },
      { metric: "Geofence Violation Accuracy", weight: 20, description: "100% detection of perimeter breaches within 1 frame timestamp." },
      { metric: "Daily Ship Logs", weight: 10, description: "Daily architecture and tracking logs on LinkedIn and Discord." }
    ],
    learningResources: [
      { title: "Building Real-Time WebRTC Computer Vision Pipelines with Python", type: "YouTube Video", url: "https://www.youtube.com/watch?v=FjC5p2L5Xk8" },
      { title: "ByteTrack: Multi-Object Tracking by Associating Every Detection Box", type: "Research Paper", url: "https://arxiv.org/abs/2110.06864" },
      { title: "YOLOv11 TensorRT Hardware Acceleration Guide", type: "Documentation", url: "https://docs.ultralytics.com/integrations/tensorrt/" }
    ],
    pentestAttackSurface: ["WebRTC SDP parameter injection / MITM hijacking", "RTSP unauthenticated video feed tapping", "Buffer overflow in OpenCV image decoding loop"],
    strictTestCommand: "python -m pytest tests/test_drone_vision.py --min-fps=55 --max-id-switch=0.02",
    acceptanceGates: [
      { rule: "Sustained Framerate", threshold: ">= 55 FPS", description: "Stream must maintain at least 55 frames per second on 1080p stream." },
      { rule: "End-to-End Latency", threshold: "< 35ms", description: "Latency from frame arrival to WebSocket coordinate broadcast must be < 35ms." },
      { rule: "ID Switch Frequency", threshold: "< 2%", description: "Object tracking must maintain stable IDs during target crossings." }
    ],
    productionSla: "p95 pipeline latency < 28ms, zero memory leaks over 24h continuous streaming."
  },
  {
    id: "p4",
    slug: "thermal-infrared-uav-payload-pipeline",
    title: "Thermal Infrared UAV Payload & Wildfire Detection Engine",
    tagline: "Process 16-bit radiometric thermal infrared FLIR video streams, calibrate temperature gradients, and detect wildfire thermal hotspots in sub-40ms.",
    difficulty: "Hard",
    domain: "Edge Drone Vision & Robotics",
    durationDays: 45,
    techStack: ["Python", "OpenCV", "PyTorch", "FastAPI", "NumPy", "Docker", "Redis"],
    partnerTools: ["Docker", "AWS S3", "PostgreSQL"],
    targetRoles: ["AI Engineer", "Backend Dev", "Cloud DevOps"],
    keywords: ["thermal", "infrared", "flir", "wildfire", "drone", "computer vision", "opencv", "pytorch", "temperature calibration"],
    overview: "Develop a radiometric thermal infrared (TIR) payload pipeline for aerial search-and-rescue and wildfire prevention. Convert raw 16-bit sensor ADC digital counts into calibrated Celsius temperature grids, execute isotherm thresholding to isolate sub-surface heat signatures, and train a CNN to classify active fire fronts with 99.4% precision.",
    architectureNotes: "Raw 16-Bit Thermal Ingest -> Radiometric Planck Curve Calibration Engine -> Isotherm Segmentation Filter -> PyTorch Thermal Hotspot Classifier -> Geo-Referenced Heatmap Exporter -> Alert Webhook Dispatcher.",
    databaseSchema: [
      "thermal_flights (id UUID PK, drone_id VARCHAR, sensor_model VARCHAR, ambient_temp_c NUMERIC, humidity_pct NUMERIC, created_at TIMESTAMP)",
      "hotspot_detections (id UUID PK, flight_id UUID FK, max_temp_c NUMERIC, min_temp_c NUMERIC, hotspot_contour GEOMETRY(POLYGON, 4326), confidence NUMERIC, is_fire_threat BOOLEAN)"
    ],
    apiEndpoints: [
      { method: "POST", path: "/api/v1/thermal/calibrate-frame", description: "Convert raw 16-bit FLIR frame into calibrated temperature matrix." },
      { method: "POST", path: "/api/v1/thermal/detect-hotspots", description: "Segment temperature anomalies above critical threshold." }
    ],
    milestones: [
      { phase: "Phase 1: Radiometric Conversion & Isotherms", days: "Days 1-15", goal: "Implement sensor calibration formula mapping 16-bit digital numbers to temperature.", deliverables: ["Calibration algorithm", "Isotherm visualizer", "Unit tests for sensor math"] },
      { phase: "Phase 2: PyTorch Hotspot Classifier & Georeferencing", days: "Days 16-30", goal: "Train CNN to distinguish between solar glare reflections and genuine fire hotspots.", deliverables: ["CNN classifier", "Georeferencing matrix module", "Confusion matrix report"] },
      { phase: "Phase 3: Production API & Alert Dispatcher", days: "Days 31-45", goal: "Deploy FastAPI container on AWS with automated SMS/Webhook emergency dispatch.", deliverables: ["Cloud deployment", "Emergency dispatch API", "Public GitHub repo"] }
    ],
    evaluationCriteria: [
      { metric: "Thermal Detection Precision", weight: 50, description: "Precision >= 98.5% with false alarm rate < 1% on sunny reflection test videos." },
      { metric: "Processing Speed", weight: 35, description: "Sub-40ms end-to-end latency per 640x512 thermal frame." },
      { metric: "Daily Ship Logs", weight: 15, description: "Daily proof of work on LinkedIn and Discord." }
    ],
    learningResources: [
      { title: "Radiometric Thermal Image Processing in Python", type: "YouTube Video", url: "https://www.youtube.com/watch?v=nO2XfK4Z1g0" },
      { title: "FLIR Radiometric SDK Calibration Guide", type: "Documentation", url: "https://www.flir.com/developer/rdk/" }
    ],
    strictTestCommand: "pytest tests/test_thermal_pipeline.py --min-precision=0.985",
    acceptanceGates: [
      { rule: "Precision Threshold", threshold: ">= 98.5%", description: "Fire front hotspot classification precision must exceed 98.5%." },
      { rule: "Latency per Frame", threshold: "< 40ms", description: "Calibration and inference must complete in under 40 milliseconds." }
    ],
    productionSla: "99.9% alert delivery SLA under 2.5 seconds from anomaly detection."
  },

  // ── 3. CLINICAL HEALTHCARE AI ──
  {
    id: "p5",
    slug: "clinical-healthcare-ai-3d-dicom-diagnostic-engine",
    title: "Clinical Healthcare AI & 3D DICOM Diagnostic Engine",
    tagline: "HIPAA/FHIR-compliant 3D MRI/CT volumetric scan segmentation with MONAI, BioClinicalBERT notes parsing, and cryptographic diagnosis provenance.",
    difficulty: "Insane",
    domain: "Clinical Healthcare AI",
    durationDays: 45,
    featured: true,
    techStack: ["PyTorch", "MONAI", "TorchIO", "FastAPI", "PostgreSQL", "FHIR / HL7", "Transformers", "Docker"],
    partnerTools: ["PyTorch", "PostgreSQL", "Hugging Face", "Docker"],
    targetRoles: ["AI Engineer", "Backend Dev", "Pen-tester", "QA Tester", "Product Manager"],
    keywords: ["healthcare", "dicom", "monai", "medical ai", "pytorch", "clinical nlp", "fhir", "hipaa", "mri", "ct scan", "biomedical"],
    overview: "Construct an enterprise clinical AI platform capable of processing 3D volumetric MRI and CT scans in DICOM/NIfTI formats. Utilize MONAI to segment pulmonary nodules and brain lesions, parse physician clinical notes with BioClinicalBERT, and output structured FHIR-compliant diagnostic recommendations backed by SHA-256 cryptographic audit chains and strict HIPAA PII de-identification.",
    architectureNotes: "DICOM PACS Ingestion -> TorchIO Volumetric Normalization -> MONAI UNETR 3D Segmentation Engine -> BioClinicalBERT Entity Extractor -> Hallucination & Dosage Guardrails -> FHIR Diagnostic Report Generator -> SHA-256 Medical Audit Ledger.",
    databaseSchema: [
      "patient_cases (id UUID PK, fhir_patient_id VARCHAR, study_date TIMESTAMP, modality VARCHAR, deidentified_metadata JSONB)",
      "volumetric_scans (id UUID PK, case_id UUID FK, voxel_dimensions JSONB, slice_count INT, storage_path TEXT, dicom_hash VARCHAR)",
      "segmented_findings (id UUID PK, scan_id UUID FK, anatomical_region VARCHAR, lesion_volume_mm3 NUMERIC, dice_score NUMERIC, mask_blob_url TEXT)",
      "clinical_recommendations (id UUID PK, case_id UUID FK, recommendation_text TEXT, confidence_score NUMERIC, flagged_contraindications JSONB, hash_signature VARCHAR)"
    ],
    apiEndpoints: [
      { method: "POST", path: "/api/v1/clinical/dicom-upload", description: "Upload multi-slice DICOM series with automated HIPAA PII scrubbing." },
      { method: "POST", path: "/api/v1/clinical/segment-volume", description: "Execute MONAI 3D volumetric segmentation on CT/MRI scan." },
      { method: "POST", path: "/api/v1/clinical/analyze-notes", description: "Extract biomedical entities (SNOMED-CT / ICD-10) from clinical text." },
      { method: "GET", path: "/api/v1/clinical/cases/{id}/fhir-report", description: "Generate cryptographically verified FHIR DiagnosticReport JSON." }
    ],
    milestones: [
      { phase: "Phase 1: DICOM Parser & PII Scrubbing", days: "Days 1-15", goal: "Implement DICOM voxel extraction and 100% HIPAA de-identification sanitization.", deliverables: ["DICOM anonymizer tool", "TorchIO 3D normalization script", "Unit tests for zero PII leaks"] },
      { phase: "Phase 2: MONAI 3D Volumetric Segmentation", days: "Days 16-30", goal: "Train/run MONAI 3D UNETR for organ and lesion volumetric boundary segmentation.", deliverables: ["3D segmentation pipeline", "Dice score validation report", "Voxel volume calculator"] },
      { phase: "Phase 3: BioClinicalBERT & FHIR Guardrails", days: "Days 31-45", goal: "Parse clinical notes, map to ICD-10 codes, enforce dosage contraindications, and deploy.", deliverables: ["Clinical NLP extractor", "FHIR JSON serializer", "HIPAA audit report"] }
    ],
    evaluationCriteria: [
      { metric: "Volumetric Segmentation Accuracy", weight: 40, description: "Dice similarity coefficient >= 0.91 on multi-organ volumetric validation scans." },
      { metric: "HIPAA De-Identification Security", weight: 35, description: "100% redaction of all 18 HIPAA Safe Harbor direct identifiers in DICOM headers." },
      { metric: "Clinical NLP Entity Extraction", weight: 15, description: "F1 Score >= 0.89 on ICD-10 medical condition entity identification." },
      { metric: "Daily Ship Logs", weight: 10, description: "Daily research and code logs on LinkedIn and Discord." }
    ],
    learningResources: [
      { title: "Deep Learning for Healthcare with MONAI & PyTorch", type: "YouTube Video", url: "https://www.youtube.com/watch?v=kY3P_lZq_l0" },
      { title: "MONAI: Medical Open Network for AI Documentation", type: "Documentation", url: "https://monai.io/docs.html" },
      { title: "UNETR: Transformers for 3D Medical Image Segmentation", type: "Research Paper", url: "https://arxiv.org/abs/2103.10504" }
    ],
    pentestAttackSurface: ["HIPAA Direct Identifier leakage in DICOM private metadata tags", "Prompt injection in Clinical NLP diagnostic synthesis", "Tampering with volumetric mask storage blobs"],
    strictTestCommand: "pytest tests/test_clinical_ai.py --min-dice=0.91 --verify-hipaa-zero-leak",
    acceptanceGates: [
      { rule: "Segmentation Dice Score", threshold: ">= 0.91", description: "3D Volumetric lesion segmentation must achieve Dice score of at least 0.91." },
      { rule: "Zero HIPAA Direct Identifiers", threshold: "0 Leaks", description: "Zero patient names, dates, or MRNs present in extracted diagnostic reports." },
      { rule: "Audit Hash Integrity", threshold: "100% Match", description: "All diagnostic reports must have verifiable SHA-256 cryptographic signatures." }
    ],
    productionSla: "Sub-4 second processing time per 200-slice 3D CT volume."
  },
  {
    id: "p6",
    slug: "genomic-variant-pathogenicity-classifier",
    title: "Genomic Variant Calling & Pathogenicity ML Engine",
    tagline: "Parse VCF (Variant Call Format) files, annotate single nucleotide polymorphisms (SNPs) with ClinVar, and predict pathogenicity with XGBoost.",
    difficulty: "Hard",
    domain: "Clinical Healthcare AI",
    durationDays: 45,
    techStack: ["Python", "BioPython", "XGBoost", "Pandas", "FastAPI", "Docker", "PostgreSQL"],
    partnerTools: ["PostgreSQL", "Docker", "Hugging Face"],
    targetRoles: ["Data & Financial ML", "AI Engineer", "Backend Dev"],
    keywords: ["genomics", "bioinformatics", "vcf", "snps", "clinvar", "xgboost", "machine learning", "pathogenicity", "biopython"],
    overview: "Build a high-throughput bioinformatics pipeline that parses multi-gigabyte VCF (Variant Call Format) human genome sequencing files. Annotate genetic mutations against ClinVar, gnomAD, and dbSNP databases, engineer evolutionary conservation features (PhyloP, CADD), and train an ensemble model predicting clinical disease pathogenicity.",
    architectureNotes: "Raw VCF Stream -> BioPython / cyvcf2 Fast Parser -> ClinVar & gnomAD SQLite Feature Annotator -> XGBoost Pathogenicity Predictor -> Clinical ACMG Classification Matrix -> JSON Report API.",
    databaseSchema: [
      "genomic_samples (id UUID PK, sample_code VARCHAR, sequencing_depth INT, total_variants_found INT, created_at TIMESTAMP)",
      "variant_annotations (id UUID PK, sample_id UUID FK, chromosome VARCHAR, position BIGINT, ref_allele VARCHAR, alt_allele VARCHAR, cadd_score NUMERIC, pathogenicity_class VARCHAR, confidence NUMERIC)"
    ],
    apiEndpoints: [
      { method: "POST", path: "/api/v1/genomics/upload-vcf", description: "Stream parse compressed VCF file and annotate variants." },
      { method: "GET", path: "/api/v1/genomics/samples/{id}/pathogenic-variants", description: "Query high-confidence disease causing mutations." }
    ],
    milestones: [
      { phase: "Phase 1: VCF Ingestion & Feature Annotation", days: "Days 1-15", goal: "Build fast cyvcf2 parser extracting 1,000,000+ variants/min and joining ClinVar annotations.", deliverables: ["VCF parser script", "SQLite annotation database", "Benchmark report"] },
      { phase: "Phase 2: XGBoost Pathogenicity Classifier", days: "Days 16-30", goal: "Train gradient boosted model with 94%+ ROC-AUC on ClinVar benchmark test splits.", deliverables: ["XGBoost training pipeline", "Feature importance matrix", "ROC-AUC evaluation plot"] },
      { phase: "Phase 3: ACMG Guidelines & Cloud Deployment", days: "Days 31-45", goal: "Deploy FastAPI service on AWS and format output to match ACMG clinical guidelines.", deliverables: ["Live API", "ACMG report generator", "GitHub repo & dissertation"] }
    ],
    evaluationCriteria: [
      { metric: "Pathogenicity ROC-AUC", weight: 50, description: "ROC-AUC >= 0.94 on independent ClinVar benign vs. pathogenic test split." },
      { metric: "VCF Parsing Throughput", weight: 35, description: "Parse and annotate at least 500,000 variants per minute on single CPU worker." },
      { metric: "Daily Ship Logs", weight: 15, description: "Daily proof of work on LinkedIn and Discord." }
    ],
    learningResources: [
      { title: "Introduction to Computational Genomics & VCF Parsing in Python", type: "YouTube Video", url: "https://www.youtube.com/watch?v=FjC5p2L5Xk8" },
      { title: "ClinVar & ACMG Variant Interpretation Guidelines", type: "Documentation", url: "https://www.ncbi.nlm.nih.gov/clinvar/docs/acmg/" }
    ],
    strictTestCommand: "pytest tests/test_genomics.py --min-roc-auc=0.94",
    acceptanceGates: [
      { rule: "ROC-AUC Accuracy", threshold: ">= 0.94", description: "Variant pathogenicity classifier must exceed 0.94 ROC-AUC." },
      { rule: "Parsing Velocity", threshold: ">= 500,000 variants/min", description: "VCF streaming parser must process at least 500k variants per minute." }
    ],
    productionSla: "Sub-15 second end-to-end analysis per whole-exome sequencing VCF file."
  },

  // ── 4. DATA SCIENCE & STATISTICAL MODELING ──
  {
    id: "p7",
    slug: "bayesian-time-series-monte-carlo-risk-engine",
    title: "Bayesian Time-Series & Monte Carlo Financial Risk Engine",
    tagline: "Statistical risk engine in Python / Polars implementing Bayesian structural time-series (BSTS), MCMC sampling, and 100,000 Monte Carlo paths.",
    difficulty: "Hard",
    domain: "Statistical Modeling & Econometrics",
    durationDays: 45,
    techStack: ["Python", "Polars", "PyMC", "NumPy", "FastAPI", "Docker", "PostgreSQL"],
    partnerTools: ["PostgreSQL", "Docker", "AWS EC2"],
    targetRoles: ["Data & Financial ML", "AI Engineer", "Backend Dev"],
    keywords: ["statistics", "bayesian", "monte carlo", "pymc", "polars", "econometrics", "time series", "var", "cvar", "risk modeling", "mcmc"],
    overview: "Construct an econometric financial risk engine utilizing Bayesian Structural Time Series (BSTS) and Markov Chain Monte Carlo (MCMC) sampling via PyMC. Simulate 100,000 correlated portfolio value paths using Copula distributions, compute Value at Risk (VaR 99%) and Expected Shortfall (CVaR), and optimize capital allocation under uncertainty with Polars multi-threading.",
    architectureNotes: "Tick & Bar Data Ingest -> Polars Parallel Feature Matrix -> PyMC Bayesian Structural Model (MCMC Sampling) -> Gaussian / Clayton Copula Joint Distribution -> Monte Carlo 100k Path Simulator (C-extension / Numba) -> VaR / CVaR Risk Exporter.",
    databaseSchema: [
      "portfolios (id UUID PK, name VARCHAR, target_return NUMERIC, asset_weights JSONB, created_at TIMESTAMP)",
      "risk_simulations (id UUID PK, portfolio_id UUID FK, var_95 NUMERIC, var_99 NUMERIC, cvar_99 NUMERIC, max_drawdown NUMERIC, simulation_paths_json JSONB, timestamp TIMESTAMP)"
    ],
    apiEndpoints: [
      { method: "POST", path: "/api/v1/risk/simulate-portfolio", description: "Run 100,000 Monte Carlo simulations with Copula dependencies." },
      { method: "GET", path: "/api/v1/risk/bayesian-forecast/{symbol}", description: "Fetch BSTS Bayesian trend, seasonality, and credible intervals." }
    ],
    milestones: [
      { phase: "Phase 1: Polars Data Layer & Copula Modeling", days: "Days 1-15", goal: "Build lightning-fast Polars matrix and fit multivariate Copula distributions.", deliverables: ["Polars data loader", "Copula dependency estimator", "Unit tests for covariance math"] },
      { phase: "Phase 2: PyMC Bayesian MCMC & Monte Carlo Simulator", days: "Days 16-30", goal: "Implement MCMC sampling and simulate 100,000 paths in under 2 seconds with Numba.", deliverables: ["PyMC BSTS model", "Numba Monte Carlo engine", "VaR/CVaR validation test"] },
      { phase: "Phase 3: Production API & Cloud Risk Dashboard", days: "Days 31-45", goal: "Deploy FastAPI container on AWS with interactive risk distribution visualizer.", deliverables: ["Live API on AWS", "Risk dashboard UI", "Dissertation report"] }
    ],
    evaluationCriteria: [
      { metric: "Simulation Speed", weight: 45, description: "Execute 100,000 correlated 252-day portfolio paths in under 1.8 seconds." },
      { metric: "Backtesting Kupiec POF Test", weight: 35, description: "Pass Kupiec Proportion of Failures test for 99% VaR at 5% significance level." },
      { metric: "Daily Ship Logs", weight: 20, description: "Consistent daily proof-of-work on LinkedIn and Discord." }
    ],
    learningResources: [
      { title: "Bayesian Statistics & PyMC Tutorial", type: "YouTube Video", url: "https://www.youtube.com/watch?v=FjC5p2L5Xk8" },
      { title: "PyMC Official Documentation & MCMC Guide", type: "Documentation", url: "https://www.pymc.io/welcome.html" }
    ],
    strictTestCommand: "pytest tests/test_risk_engine.py --benchmark --max-time=1.8s",
    acceptanceGates: [
      { rule: "Monte Carlo Latency", threshold: "< 1,800ms", description: "100k simulation paths must complete under 1.8 seconds." },
      { rule: "Kupiec VaR Test", threshold: "p-value > 0.05", description: "Value at Risk must pass regulatory Kupiec POF statistical backtest." }
    ],
    productionSla: "Sub-2 second risk calculation SLA across 50-asset portfolios."
  },
  {
    id: "p8",
    slug: "realtime-credit-card-fraud-feature-store",
    title: "Real-Time Fraud Detection & Streaming Feature Store",
    tagline: "Industrial fraud detection pipeline with DuckDB / Feast feature store, LightGBM, and sub-15ms streaming transaction scoring.",
    difficulty: "Hard",
    domain: "Data Science & Predictive ML",
    durationDays: 45,
    techStack: ["Python", "DuckDB", "Feast", "LightGBM", "Redis", "Kafka", "FastAPI", "Docker"],
    partnerTools: ["Redis", "Docker", "PostgreSQL"],
    targetRoles: ["Data & Financial ML", "AI Engineer", "Backend Dev"],
    keywords: ["data science", "fraud detection", "feature store", "feast", "duckdb", "lightgbm", "redis", "kafka", "streaming ml"],
    overview: "Build an industrial financial fraud detection platform handling 10,000 transactions/sec. Set up a point-in-time correct Feature Store with Feast and DuckDB, compute real-time sliding window aggregates in Redis (e.g., transaction velocity in last 10 minutes), and execute LightGBM model inference with SHAP explainability in under 15ms.",
    architectureNotes: "Transaction Ingest -> Kafka Event Stream -> Redis Online Feature Store + DuckDB Offline Store (Feast) -> LightGBM Inference Engine -> TreeSHAP Explanation Generator -> Fraud Decision Gateway.",
    databaseSchema: [
      "transactions (id UUID PK, card_id VARCHAR, merchant_category VARCHAR, amount NUMERIC, lat NUMERIC, lng NUMERIC, timestamp TIMESTAMP, is_fraud_label BOOLEAN)",
      "fraud_scores (id UUID PK, transaction_id UUID FK, fraud_probability NUMERIC, decision VARCHAR, top_shap_features JSONB, latency_ms NUMERIC)"
    ],
    apiEndpoints: [
      { method: "POST", path: "/api/v1/fraud/evaluate-transaction", description: "Score transaction in real-time with sub-15ms latency and SHAP explainability." },
      { method: "GET", path: "/api/v1/fraud/features/{card_id}", description: "Query online sliding window velocity features from Redis." }
    ],
    milestones: [
      { phase: "Phase 1: Feature Store & Redis Online Sync", days: "Days 1-15", goal: "Configure Feast with DuckDB offline store and Redis online cache with sliding window features.", deliverables: ["Feast feature definitions", "Redis feature synchronizer", "Point-in-time correctness test"] },
      { phase: "Phase 2: LightGBM Training & SHAP Explainer", days: "Days 16-30", goal: "Train LightGBM on highly imbalanced dataset (PR-AUC >= 0.88) and integrate fast TreeSHAP.", deliverables: ["Model training pipeline", "TreeSHAP C-inference module", "PR-AUC benchmark report"] },
      { phase: "Phase 3: 10,000 req/sec Load Test & Cloud Deploy", days: "Days 31-45", goal: "Benchmark on AWS with k6/Locust simulating 10k req/sec with p99 latency < 15ms.", deliverables: ["AWS ECS cluster", "Live fraud dashboard", "Final dissertation"] }
    ],
    evaluationCriteria: [
      { metric: "Precision-Recall AUC (PR-AUC)", weight: 45, description: "PR-AUC >= 0.88 on 0.1% positive class imbalanced fraud test dataset." },
      { metric: "p99 Scoring Latency", weight: 35, description: "Sub-15ms roundtrip latency including Redis feature lookup and SHAP computation." },
      { metric: "Daily Ship Logs", weight: 20, description: "Daily proof of work on LinkedIn and Discord." }
    ],
    learningResources: [
      { title: "Building Real-Time ML Feature Stores with Feast & Redis", type: "YouTube Video", url: "https://www.youtube.com/watch?v=FjC5p2L5Xk8" },
      { title: "Feast Official Feature Store Documentation", type: "Documentation", url: "https://docs.feast.dev/" }
    ],
    strictTestCommand: "pytest tests/test_fraud_pipeline.py --min-prauc=0.88 --max-p99=15ms",
    acceptanceGates: [
      { rule: "PR-AUC Metric", threshold: ">= 0.88", description: "LightGBM model must exceed 0.88 PR-AUC on imbalanced test data." },
      { rule: "p99 Decision Latency", threshold: "< 15ms", description: "99% of transaction scoring calls must complete in under 15ms." }
    ],
    productionSla: "99.99% uptime, p99 transaction scoring latency < 15ms."
  },

  // ── 5. GRAPHRAG & KNOWLEDGE TOPOLOGY ──
  {
    id: "p9",
    slug: "multihop-graphrag-knowledge-topology-gateway",
    title: "Multi-Hop GraphRAG & Knowledge Topology Gateway",
    tagline: "Multi-hop Knowledge Graph + Vector hybrid retrieval indexing 1M+ scientific papers with Leiden community clustering and RRF fusion.",
    difficulty: "Hard",
    domain: "GraphRAG & Knowledge Topology",
    durationDays: 45,
    featured: true,
    techStack: ["Neo4j", "Qdrant", "LangGraph", "FastAPI", "BM25", "SentenceTransformers", "BGE Re-ranker", "Docker"],
    partnerTools: ["Neo4j", "Qdrant", "Docker", "PostgreSQL"],
    targetRoles: ["AI Engineer", "Backend Dev", "Data & Financial ML", "QA Tester"],
    keywords: ["graphrag", "knowledge graph", "neo4j", "qdrant", "rag", "langgraph", "embeddings", "vector search", "information retrieval", "leiden"],
    overview: "Construct an advanced GraphRAG knowledge topology engine over a corpus of 1,000,000+ scientific papers. Merge deep Neo4j graph relationships with Qdrant dense vector embeddings. Apply the Leiden community detection algorithm to pre-summarize thematic sub-graphs, traverse 4-hop entity relations, and fuse results via Reciprocal Rank Fusion (RRF) for zero-hallucination multi-hop reasoning.",
    architectureNotes: "Corpus Ingestion -> Entity & Relation Extraction (LangGraph) -> Neo4j Graph DB (Leiden Clustering) + Qdrant Dense Index -> 4-Hop Graph Traversal Engine -> BM25 Sparse Index -> Reciprocal Rank Fusion -> Cross-Encoder Re-ranker -> Context Synthesizer.",
    databaseSchema: [
      "Neo4j Nodes: Paper, Author, Entity, Concept, Method, Metric",
      "Neo4j Relationships: CITATION, MENTIONS, PROPOSES, EVALUATES_ON, COLLABORATES_WITH",
      "Qdrant: paper_abstract_vectors (1024-dim, payload: graph_node_id, cluster_id)",
      "graph_cluster_summaries (id UUID PK, cluster_id VARCHAR, theme_title VARCHAR, summary_text TEXT, member_count INT)"
    ],
    apiEndpoints: [
      { method: "POST", path: "/api/v1/graphrag/ingest-corpus", description: "Stream ingest papers, extract RDF triples, and build Neo4j topology." },
      { method: "POST", path: "/api/v1/graphrag/multi-hop-query", description: "Execute 4-hop graph expansion + vector hybrid retrieval with RRF." },
      { method: "GET", path: "/api/v1/graphrag/clusters/{id}/map", description: "Fetch Leiden community topology sub-graph as D3/Cytoscape JSON." }
    ],
    milestones: [
      { phase: "Phase 1: Triple Extraction & Neo4j Ingest", days: "Days 1-15", goal: "Build async entity/relation extraction and populate Neo4j graph database.", deliverables: ["Neo4j Docker setup", "Entity extraction pipeline", "100,000-node graph ingest"] },
      { phase: "Phase 2: Leiden Clustering & Vector Hybrid", days: "Days 16-30", goal: "Implement Leiden community detection clustering and sync embeddings with Qdrant.", deliverables: ["Leiden cluster generator", "Qdrant vector collection", "Graph-aware embedding pipeline"] },
      { phase: "Phase 3: 4-Hop Traversal & Cloud Deploy", days: "Days 31-45", goal: "Build 4-hop Cypher traversal engine, combine with BGE re-ranking, and deploy on AWS.", deliverables: ["Multi-hop query resolver", "AWS cloud deployment", "RAGAS benchmark report"] }
    ],
    evaluationCriteria: [
      { metric: "Multi-Hop Retrieval Faithfulness (RAGAS)", weight: 40, description: "Faithfulness >= 0.94 and Context Precision >= 0.92 across 200 multi-hop reasoning questions." },
      { metric: "Graph Traversal Latency", weight: 30, description: "Sub-150ms 4-hop traversal and synthesis over a 500,000-node graph." },
      { metric: "Daily Ship Logs", weight: 30, description: "Daily architecture breakdowns on LinkedIn and Discord." }
    ],
    learningResources: [
      { title: "GraphRAG Deep Dive: Knowledge Graphs + Vector Search", type: "YouTube Video", url: "https://www.youtube.com/watch?v=knDDGYHmsdQ" },
      { title: "From Local to Global: A Graph RAG Approach to Query-Focused Summarization (Microsoft)", type: "Research Paper", url: "https://arxiv.org/abs/2404.16130" }
    ],
    strictTestCommand: "pytest tests/test_graphrag.py --ragas-eval --min-faithfulness=0.94",
    acceptanceGates: [
      { rule: "RAGAS Faithfulness", threshold: ">= 0.94", description: "Multi-hop answers must achieve >= 94% factual grounding against source papers." },
      { rule: "Context Precision", threshold: ">= 0.92", description: "Top-k retrieved chunks must contain relevant graph relationship context." }
    ],
    productionSla: "p95 end-to-end response latency < 450ms, 99.9% query resolution reliability."
  },

  // ── 6. HIGH-FREQUENCY TELEMETRY & FINTECH ──
  {
    id: "p10",
    slug: "sub-10ms-high-frequency-market-telemetry-order-book",
    title: "Sub-10ms High-Frequency Market Telemetry & Limit Order Book",
    tagline: "Ultra-low-latency L2 market depth engine in Rust/Python handling 50,000 orders/sec with zero drift, FIFO matching, and WebSocket feeds.",
    difficulty: "Insane",
    domain: "High-Frequency Telemetry",
    durationDays: 45,
    featured: true,
    techStack: ["Rust", "Python", "WebSockets", "PostgreSQL", "Redis Streams", "Docker", "AsyncIO"],
    partnerTools: ["Rust", "Redis", "PostgreSQL", "Docker"],
    targetRoles: ["Backend Dev", "Data & Financial ML", "Cloud DevOps", "Pen-tester"],
    keywords: ["rust", "hft", "order book", "market data", "websockets", "redis", "postgresql", "distributed systems", "concurrency", "low latency"],
    overview: "Architect an industrial Level-2 Limit Order Book (LOB) matching engine capable of processing 50,000 order insertions, cancellations, and modifications per second. Written with high-performance Rust core primitives and FastAPI WebSocket broadcast servers, guaranteeing zero numerical drift, deterministic FIFO matching, sub-10ms p99 execution, and automated margin risk liquidation triggers.",
    architectureNotes: "Order Ingress API -> High-Speed In-Memory Limit Order Book (Rust BTreeMap & Doubly Linked List) -> Zero-Copy Ring Buffer -> Trade Settlement Ledger (PostgreSQL) -> Redis Stream Publisher -> WebSocket Market Depth Broadcast.",
    databaseSchema: [
      "order_records (id UUID PK, client_id VARCHAR, symbol VARCHAR, side VARCHAR, order_type VARCHAR, price NUMERIC, quantity NUMERIC, filled_quantity NUMERIC, status VARCHAR, created_at TIMESTAMP)",
      "matched_trades (id UUID PK, maker_order_id UUID FK, taker_order_id UUID FK, price NUMERIC, volume NUMERIC, match_timestamp TIMESTAMP)",
      "market_depth_snapshots (id UUID PK, symbol VARCHAR, bids JSONB, asks JSONB, timestamp TIMESTAMP)"
    ],
    apiEndpoints: [
      { method: "POST", path: "/api/v1/market/orders", description: "Insert new limit, market, or stop-loss order into matching engine." },
      { method: "DELETE", path: "/api/v1/market/orders/{id}", description: "Cancel active order with sub-millisecond confirmation." },
      { method: "GET", path: "/api/v1/market/depth/{symbol}", description: "Fetch real-time L2 order book depth (top 50 bids/asks)." },
      { method: "WS", path: "/ws/v1/market-feed/{symbol}", description: "Stream microsecond trade prints and delta depth updates." }
    ],
    milestones: [
      { phase: "Phase 1: Rust In-Memory LOB Core", days: "Days 1-15", goal: "Build lock-free BTreeMap Limit Order Book in Rust with FIFO price-time priority.", deliverables: ["Rust matching engine crate", "Unit tests for price-time matching", "Benchmark harness"] },
      { phase: "Phase 2: Redis Stream Producer & Settlement DB", days: "Days 16-30", goal: "Stream matched trades into Redis and persist to PostgreSQL with connection pooling.", deliverables: ["Trade persistence worker", "PostgreSQL schema", "Zero-drift reconciliation script"] },
      { phase: "Phase 3: 50,000 ops/sec Load Test & Cloud Deploy", days: "Days 31-45", goal: "Deploy multi-node cluster to AWS ECS, survive network partitions, and publish code.", deliverables: ["AWS ECS cluster", "Live market trading dashboard", "Final engineering dissertation"] }
    ],
    evaluationCriteria: [
      { metric: "Throughput & Matching Latency", weight: 40, description: "Deterministic p99 order execution latency < 8ms under continuous 50,000 ops/sec traffic load." },
      { metric: "State Consistency & Zero Drift", weight: 30, description: "100% balance and volume match between in-memory book and PostgreSQL audit ledger." },
      { metric: "Daily Ship Logs", weight: 30, description: "Daily commit logs and latency profiling on LinkedIn and Discord." }
    ],
    learningResources: [
      { title: "Building High-Performance Trading Systems in Rust", type: "YouTube Video", url: "https://www.youtube.com/watch?v=b0wF1kK_a4E" },
      { title: "Limit Order Book Architecture & Algorithms (L3 Matching)", type: "Research Paper", url: "https://arxiv.org/abs/1312.0563" }
    ],
    strictTestCommand: "cargo test --release && python load_test.py --ops=50000 --max-latency=8ms",
    acceptanceGates: [
      { rule: "Throughput Benchmark", threshold: ">= 50,000 ops/sec", description: "Engine must process at least 50,000 order insertions/cancellations per second." },
      { rule: "p99 Execution Latency", threshold: "< 8ms", description: "99% of order matching events must complete under 8 milliseconds." }
    ],
    productionSla: "p99 order matching latency < 8ms, 99.999% data consistency guarantee."
  },

  // ── 7. AUTONOMOUS RED-TEAM CYBERSECURITY ──
  {
    id: "p11",
    slug: "autonomous-red-team-vulnerability-swarm",
    title: "Autonomous Red-Team Pen-Testing & Vulnerability Swarm",
    tagline: "Multi-agent offensive security swarm discovering OWASP Top 10, SSRF, IDOR, and Prompt Injections in isolated Docker sandboxes.",
    difficulty: "Hard",
    domain: "Autonomous Red-Team Cybersecurity",
    durationDays: 45,
    featured: true,
    techStack: ["Python", "FastAPI", "LangGraph", "Docker", "OWASP ZAP", "Burp Suite API", "Bash", "Pydantic"],
    partnerTools: ["Docker", "GitHub", "AWS EC2"],
    targetRoles: ["Pen-tester", "Cloud DevOps", "Backend Dev", "QA Tester"],
    keywords: ["cybersecurity", "red team", "pentesting", "owasp", "autonomous agents", "vulnerability scanner", "ssrf", "idor", "docker", "ethical hacking"],
    overview: "Build an autonomous multi-agent offensive security system. Deploy a coordinator swarm that probes target web architectures, dynamically generates targeted payloads (SSRF, Insecure Direct Object References, JWT tampering, SQLi, and LLM Prompt Injections) in isolated ephemeral Docker sandboxes, verifies exploit execution with screen recording traces, and automatically drafts pull request security patches.",
    architectureNotes: "Target Ingress Recon Agent -> Attack Surface Graph -> Payload Generator Agent (FastAPI + LangGraph) -> Ephemeral Docker Sandbox Runner -> Exploit Proof-of-Concept Verifier -> Automated Patch Generator Agent -> Security Dossier Exporter.",
    databaseSchema: [
      "target_environments (id UUID PK, target_url VARCHAR, staging_auth_token VARCHAR, discovered_endpoints JSONB, created_at TIMESTAMP)",
      "attack_surfaces (id UUID PK, target_id UUID FK, endpoint VARCHAR, method VARCHAR, parameters JSONB, threat_category VARCHAR)",
      "vulnerability_proofs (id UUID PK, attack_surface_id UUID FK, cve_title VARCHAR, severity VARCHAR, payload_executed TEXT, response_snapshot TEXT, poc_video_url TEXT)",
      "remediation_prs (id UUID PK, vulnerability_id UUID FK, patch_diff TEXT, git_pr_url VARCHAR, is_verified_fixed BOOLEAN)"
    ],
    apiEndpoints: [
      { method: "POST", path: "/api/v1/redteam/launch-recon", description: "Map all routes, headers, and parameters of target staging environment." },
      { method: "POST", path: "/api/v1/redteam/execute-swarm", description: "Trigger multi-agent exploit generation and sandbox testing." },
      { method: "GET", path: "/api/v1/redteam/reports/{id}/pdf", description: "Generate executive security audit PDF dossier with PoC logs." }
    ],
    milestones: [
      { phase: "Phase 1: Recon & Attack Surface Graph", days: "Days 1-15", goal: "Build async URL crawler, OpenAPI schema parser, and endpoint inventory graph.", deliverables: ["Crawler agent", "Attack surface mapper", "Docker Compose sandbox"] },
      { phase: "Phase 2: Exploit Payload Generation & Docker Sandbox", days: "Days 16-30", goal: "Write payload generation agents executing in isolated containerized runners.", deliverables: ["Docker execution sandbox", "OWASP payload generator", "PoC verifier"] },
      { phase: "Phase 3: Peer Pentesting & Auto-Patching", days: "Days 31-45", goal: "Execute red-team swarm against peer student projects and generate automated PR fixes.", deliverables: ["10 verified bug reports", "Auto-patching engine", "Executive PDF dossier"] }
    ],
    evaluationCriteria: [
      { metric: "Vulnerability Discovery Rate", weight: 40, description: "100% detection and PoC proof generation for all 20 intentional vulnerabilities in benchmark environment." },
      { metric: "Sandbox Isolation Security", weight: 35, description: "Zero container escape or un-sandboxed network leakage during exploit executions." },
      { metric: "Daily Ship Logs", weight: 25, description: "Daily vulnerability findings logged on LinkedIn and Discord." }
    ],
    learningResources: [
      { title: "Automated Web Penetration Testing with Python & AI Agents", type: "YouTube Video", url: "https://www.youtube.com/watch?v=2_lwwZ4V0vg" },
      { title: "OWASP Top 10 API Security Risks Standard", type: "Documentation", url: "https://owasp.org/www-project-api-security/" }
    ],
    strictTestCommand: "pytest tests/test_redteam_swarm.py --verify-docker-isolation --min-detection=1.0",
    acceptanceGates: [
      { rule: "Vulnerability Detection Rate", threshold: "100% (20/20)", description: "Must discover all 20 intentional vulnerabilities in testbed." },
      { rule: "Zero Sandbox Breakout", threshold: "0 Violations", description: "100% containment of all generated exploit payloads within ephemeral containers." }
    ],
    productionSla: "Full environment surface audit completing under 8 minutes."
  },

  // ── 8. AI AGENTS & STATE MACHINES ──
  {
    id: "p12",
    slug: "deterministic-agent-workflow-engine",
    title: "Deterministic Agent State Machine & Postgres Checkpointer",
    tagline: "State-machine agent graph with persistent PostgreSQL checkpoints, time-travel rollbacks, and sandboxed tool execution.",
    difficulty: "Hard",
    domain: "AI Agents & State Machines",
    durationDays: 45,
    techStack: ["LangGraph", "FastAPI", "PostgreSQL", "Redis Streams", "Docker", "Pydantic", "OpenTelemetry"],
    partnerTools: ["LangChain", "Qdrant", "PostgreSQL", "Docker"],
    targetRoles: ["AI Engineer", "Backend Dev", "QA Tester", "Product Manager"],
    keywords: ["langgraph", "langchain", "agents", "state machine", "fastapi", "python", "postgresql", "redis", "docker", "llm", "async"],
    overview: "Build an industrial-grade deterministic agent orchestration engine where autonomous LLM tools can be paused, resumed, rolled back to state checkpoints in PostgreSQL, and executed in isolated Docker containers with latency and cost telemetry.",
    architectureNotes: "Client -> FastAPI Gateway -> LangGraph State Engine (Postgres Checkpointer) -> Redis Queue -> Worker Sandboxes -> Vector Retrieval (Qdrant) -> Telemetry Exporter.",
    databaseSchema: [
      "agent_threads (id UUID PK, title VARCHAR, created_at TIMESTAMP, metadata JSONB)",
      "agent_checkpoints (id UUID PK, thread_id UUID FK, state_blob BYTEA, step INT, parent_id UUID)",
      "tool_execution_logs (id UUID PK, thread_id UUID FK, tool_name VARCHAR, latency_ms INT, cost_cents NUMERIC, status VARCHAR)"
    ],
    apiEndpoints: [
      { method: "POST", path: "/api/v1/threads", description: "Initialize a new agent state thread." },
      { method: "POST", path: "/api/v1/threads/{id}/run", description: "Execute agent graph step or resume execution." }
    ],
    milestones: [
      { phase: "Phase 1: Graph & State Persistence", days: "Days 1-15", goal: "Set up FastAPI, PostgreSQL checkpoint tables, and compile a 4-node LangGraph cycle.", deliverables: ["Postgres migration script", "Unit tests for state rollbacks", "Docker Compose setup"] },
      { phase: "Phase 2: Tool Sandboxing & Queuing", days: "Days 16-30", goal: "Integrate Redis worker queues and dynamic tool execution with timeout guarantees.", deliverables: ["Redis worker", "Python code execution sandbox", "Tool error fallback graph"] },
      { phase: "Phase 3: Telemetry & Cloud Deploy", days: "Days 31-45", goal: "Instrument OpenTelemetry tracing, compute per-step latency (p95 < 800ms) and deploy on AWS.", deliverables: ["AWS deployment", "Cost estimator middleware", "RAGAS benchmark report"] }
    ],
    evaluationCriteria: [
      { metric: "Deterministic State Recovery", weight: 45, description: "Ability to restart dropped executions from exact Postgres checkpoints without state loss." },
      { metric: "Latency & Cost Optimization", weight: 35, description: "Sub-800ms p95 graph execution time and strict token budget enforcement." },
      { metric: "Daily Proof & Documentation", weight: 20, description: "Daily LinkedIn & Discord logs with GitHub PR commit trail." }
    ],
    learningResources: [
      { title: "LangGraph Full Course: State Machines for LLMs", type: "YouTube Video", url: "https://www.youtube.com/watch?v=R8KB-ZcYNbc" },
      { title: "PostgreSQL Checkpointer Deep Dive (LangGraph Docs)", type: "Documentation", url: "https://langchain-ai.github.io/langgraph/reference/checkpoints/" }
    ],
    strictTestCommand: "pytest tests/test_agent_state.py --benchmark --max-p95=800ms",
    acceptanceGates: [
      { rule: "Zero State Loss", threshold: "100% Recovery", description: "Agent thread must cleanly restore exact state after worker process crash." },
      { rule: "p95 Graph Latency", threshold: "< 800ms", description: "Per-node transition time must be under 800ms." }
    ],
    productionSla: "p95 graph execution latency < 800ms, 99.99% state recovery SLA."
  },

  // ── 9. WEBGPU EDGE SLMS ──
  {
    id: "p13",
    slug: "on-device-slm-privacy-engine",
    title: "Browser-Native SLM Privacy Engine with WebGPU Shaders",
    tagline: "Run 4-bit SmolLM2 / Gemma on-device inside Next.js using WebGPU compute shaders and IndexedDB sharded caching.",
    difficulty: "Insane",
    domain: "WebGPU Edge SLMs",
    durationDays: 45,
    featured: true,
    techStack: ["Next.js 16", "WebGPU", "Transformers.js v3", "IndexedDB", "TypeScript", "TailwindCSS"],
    partnerTools: ["Hugging Face", "WebGPU", "Vercel"],
    targetRoles: ["Frontend Dev", "AI Engineer", "QA Tester", "Product Manager"],
    keywords: ["nextjs", "webgpu", "slm", "transformers.js", "local ai", "privacy", "wasm", "typescript", "react", "indexeddb"],
    overview: "Construct a zero-data-leakage client-side AI workplace using WebGPU acceleration in the browser. Run 4-bit quantized SLMs on-device for real-time document summarization, PII redaction, and offline semantic search with zero server GPU costs.",
    architectureNotes: "Next.js App -> WebGPU Device Initialization -> ONNX / Transformers.js Runtime (WASM Worker) -> IndexedDB Sharded Model Cache -> Chunked Stream Processor -> Reactive React UI.",
    databaseSchema: [
      "IndexedDB: models_cache (model_id, version, weights_buffer, last_used)",
      "IndexedDB: local_documents (id, name, original_text, pii_redacted_text, vector_embedding)",
      "IndexedDB: inference_metrics (prompt_tokens, completion_tokens, time_to_first_token_ms, tokens_per_sec)"
    ],
    apiEndpoints: [
      { method: "CLIENT", path: "engine.initializeModel(modelId)", description: "Download and cache ONNX weights with progress stream." },
      { method: "CLIENT", path: "engine.streamInference(prompt, options)", description: "Stream tokens directly from WebGPU compute shader." }
    ],
    milestones: [
      { phase: "Phase 1: WebGPU Runtime & Model Streaming", days: "Days 1-15", goal: "Set up WebGPU detection, fallback to WASM, and stream SmolLM2-135M weights.", deliverables: ["Next.js 16 WebGPU hook", "Progressive download progress bar", "Initial token generation"] },
      { phase: "Phase 2: IndexedDB Sharded Caching", days: "Days 16-30", goal: "Cache 1.5GB quantized model shards into IndexedDB for instant offline reloads.", deliverables: ["IndexedDB storage manager", "Offline PWA service worker", "Cache eviction policy"] },
      { phase: "Phase 3: Real-Time Tokens & Production Release", days: "Days 31-45", goal: "Achieve 25+ tokens/sec on laptop GPUs, conduct network zero-leak audit, and deploy.", deliverables: ["Vercel live deployment", "Network zero-telemetry proof video", "Open-source GitHub release"] }
    ],
    evaluationCriteria: [
      { metric: "Inference Speed (Tokens/Sec)", weight: 45, description: "Generate >= 25 tokens/second on M1/M2/RTX GPUs via WebGPU." },
      { metric: "Zero Data Leakage Security", weight: 35, description: "Strict CSP headers and network audit verifying zero prompt exfiltration." },
      { metric: "Daily Ship Logs", weight: 20, description: "Daily progress documented on LinkedIn and Discord." }
    ],
    learningResources: [
      { title: "Transformers.js v3 & WebGPU in the Browser", type: "YouTube Video", url: "https://www.youtube.com/watch?v=F_fK2Q35q3Q" },
      { title: "WebGPU Explainer & Compute Shaders (W3C)", type: "Documentation", url: "https://gpuweb.github.io/gpuweb/" }
    ],
    strictTestCommand: "npx playwright test tests/webgpu_inference.spec.ts --grep @performance",
    acceptanceGates: [
      { rule: "Generation Speed", threshold: ">= 25 Tokens/Sec", description: "WebGPU inference must stream at least 25 tokens per second." },
      { rule: "Network Zero-Leak", threshold: "0 Outbound Packets", description: "Zero prompt payload data sent across browser network interfaces." }
    ],
    productionSla: "100% offline operational capability, 0 cloud GPU operating cost."
  },

  // ── 10. QA MESH & DISTRIBUTED LOAD ──
  {
    id: "p14",
    slug: "automated-e2e-testing-k6-performance-harness",
    title: "Distributed k6 Performance & Playwright Quality Mesh",
    tagline: "Industrial test automation harness: Parallel Playwright browser matrix + k6 distributed load testing (10,000 VUs) in GitHub Actions.",
    difficulty: "Intermediate",
    domain: "QA Mesh & Distributed Load",
    durationDays: 45,
    techStack: ["Playwright", "k6", "TypeScript", "GitHub Actions", "Docker", "Grafana", "Node.js"],
    partnerTools: ["GitHub", "Grafana", "Docker"],
    targetRoles: ["QA Tester", "Cloud DevOps", "Backend Dev", "Product Manager"],
    keywords: ["qa", "testing", "playwright", "k6", "load testing", "ci/cd", "automation", "typescript", "performance", "devops"],
    overview: "Build an enterprise quality engineering harness that executes parallel cross-browser E2E regression tests on every pull request and runs distributed k6 load tests benchmarking 10,000 virtual users with automated Grafana performance reporting.",
    architectureNotes: "GitHub PR Trigger -> GitHub Actions Matrix Runner -> Parallel Playwright Workers (Chromium, Firefox, WebKit) -> k6 Distributed Load Cluster -> InfluxDB / Grafana Telemetry Dashboard -> PR Comment Reporter.",
    databaseSchema: [
      "test_runs (id UUID PK, commit_sha VARCHAR, branch VARCHAR, total_tests INT, passed INT, failed INT, duration_sec NUMERIC)",
      "performance_benchmarks (id UUID PK, test_run_id UUID FK, endpoint VARCHAR, p50_ms NUMERIC, p95_ms NUMERIC, p99_ms NUMERIC, error_rate NUMERIC)"
    ],
    apiEndpoints: [
      { method: "POST", path: "/api/v1/harness/run", description: "Trigger on-demand Playwright and k6 test suites." },
      { method: "GET", path: "/api/v1/harness/runs/{id}", description: "Fetch detailed test execution breakdown and video traces." }
    ],
    milestones: [
      { phase: "Phase 1: Playwright Page Object Architecture", days: "Days 1-15", goal: "Structure scalable TypeScript Page Object Model (POM) for full user journey testing.", deliverables: ["POM framework structure", "20 critical user journey tests", "Video trace recorder"] },
      { phase: "Phase 2: k6 Distributed Load Scenarios", days: "Days 16-30", goal: "Write realistic k6 load scenarios simulating 5,000 to 10,000 concurrent user traffic spikes.", deliverables: ["k6 test scripts", "Threshold failure triggers", "InfluxDB + Grafana dashboard"] },
      { phase: "Phase 3: CI/CD Pipeline & Peer QA Certification", days: "Days 31-45", goal: "Integrate into GitHub Actions with automated retries and QA certify 3 peer student projects.", deliverables: ["GitHub Actions workflow", "3 peer QA certification reports", "Public repository"] }
    ],
    evaluationCriteria: [
      { metric: "Test Suite Reliability & Coverage", weight: 45, description: "Zero false-positive flaky tests and comprehensive test coverage across edge cases." },
      { metric: "Load Testing Rigor", weight: 35, description: "Realistic k6 user personas with realistic think times and strict p95 SLA assertions." },
      { metric: "Daily Ship Logs", weight: 20, description: "Daily testing logs on LinkedIn and Discord." }
    ],
    learningResources: [
      { title: "Playwright Complete Masterclass with TypeScript", type: "YouTube Video", url: "https://www.youtube.com/watch?v=Xz6lhEzgI5I" },
      { title: "k6 Performance & Load Testing In-Depth Guide", type: "Documentation", url: "https://k6.io/docs/" }
    ],
    strictTestCommand: "npx playwright test --workers=4 && k6 run --vus=5000 --duration=30s tests/k6_mesh.js",
    acceptanceGates: [
      { rule: "Zero Flaky Tests", threshold: "0 Retries Needed", description: "E2E suite must achieve 100% deterministic pass without flaky retries." },
      { rule: "5,000 VU Load Stability", threshold: "Error Rate < 0.1%", description: "System under load must maintain < 0.1% error rate during 5,000 VU traffic spike." }
    ],
    productionSla: "100% CI pipeline execution pass guarantee on main branch."
  },

  // ── 11. KERNEL EBPF & AUTONOMOUS CLOUD (GO TO HELL 💀) ──
  {
    id: "p15",
    slug: "go-to-hell-self-healing-cloud-microservices",
    title: "Go To Hell (GTH): Autonomous Self-Healing Microservices with eBPF",
    tagline: "The legendary 45-Day extreme tier. Rust eBPF kernel probes, autonomous anomaly mitigation, zero vibe-coding, 1 Lakh INR Prize Pool.",
    difficulty: "Go To Hell 💀",
    domain: "Kernel eBPF & Autonomous Cloud",
    durationDays: 45,
    featured: true,
    prizePool: "₹1,00,000 (₹20,000 / Finalist Slot)",
    maxSlots: 5,
    techStack: ["Rust", "Python", "eBPF", "Kubernetes", "PostgreSQL", "Redis", "OpenTelemetry", "Docker"],
    partnerTools: ["AWS", "Docker", "Qdrant", "PostgreSQL"],
    targetRoles: ["Cloud DevOps", "Backend Dev", "AI Engineer", "Pen-tester"],
    keywords: ["rust", "ebpf", "kubernetes", "distributed systems", "self healing", "opentelemetry", "microservices", "docker", "aws", "systems programming"],
    overview: "STRICT ARCHITECTURAL PURITY. ZERO VIBE-CODING. Build an autonomous self-healing distributed cluster where eBPF kernel probes detect microservice latency spikes, memory leaks, and network partitions in real-time, trigger automated rollback and traffic-rerouting state engines, and restore 99.99% cluster SLA with zero human intervention. Limited to exactly 5 qualified slots.",
    architectureNotes: "Kubernetes Cluster Nodes -> eBPF Kernel Probes (BCC / Aya in Rust) -> Stream Aggregator (Redis) -> Autonomous Anomaly Remediation Agent -> Kubernetes Dynamic Patch API -> Grafana Observability Wall.",
    databaseSchema: [
      "cluster_nodes (id VARCHAR PK, ip_address VARCHAR, cpu_usage NUMERIC, memory_leak_score NUMERIC, status VARCHAR)",
      "ebpf_telemetry_events (id UUID PK, node_id VARCHAR, pid INT, syscall VARCHAR, latency_ns BIGINT, timestamp TIMESTAMP)",
      "healing_actions (id UUID PK, anomaly_detected VARCHAR, root_cause_diagnosis TEXT, action_taken VARCHAR, recovery_time_ms INT, success BOOLEAN)"
    ],
    apiEndpoints: [
      { method: "GET", path: "/api/v1/gth/cluster/topology", description: "Real-time live map of cluster pods and eBPF kernel hooks." },
      { method: "POST", path: "/api/v1/gth/chaos/inject", description: "Inject synthetic kernel deadlock, memory leak, or network partition." }
    ],
    milestones: [
      { phase: "Phase 1: Rust eBPF Kernel Probes", days: "Days 1-15", goal: "Compile Rust eBPF programs attaching to socket and memory syscalls.", deliverables: ["Rust eBPF kernel crate", "Dockerized microservices", "Kernel telemetry stdout"] },
      { phase: "Phase 2: Real-Time Stream Anomaly Engine", days: "Days 16-30", goal: "Ingest eBPF syscall streams into Redis and compute statistical p99 anomaly deviations.", deliverables: ["Streaming anomaly detector", "Real-time Prometheus exporter", "Baseline benchmark"] },
      { phase: "Phase 3: Autonomous K8s Remediation & Chaos Gauntlet", days: "Days 31-45", goal: "Survive continuous 48-hour automated chaos bombardment and present architecture defense to founder.", deliverables: ["Live cluster surviving chaos", "30-page engineering dissertation", "Demo Day defense"] }
    ],
    evaluationCriteria: [
      { metric: "Autonomous Chaos Recovery", weight: 50, description: "Cluster autonomously recovers from 100% of injected memory leaks and network partitions under 5 seconds." },
      { metric: "Low-Level Systems Code Quality", weight: 30, description: "Zero unsafe memory bugs, rigorous Rust/C eBPF code with 0% vibe-coding." },
      { metric: "Continuous 45-Day Ship Proof", weight: 20, description: "Unbroken daily commits, screen recordings of debugging sessions, and technical blog dissertations." }
    ],
    learningResources: [
      { title: "eBPF Programming in Rust with Aya", type: "YouTube Video", url: "https://www.youtube.com/watch?v=Jm_2a_yVb0M" },
      { title: "BCC & eBPF Linux Kernel Tracing Reference", type: "Documentation", url: "https://github.com/iovisor/bcc" }
    ],
    strictTestCommand: "cargo test --release && bash chaos_gauntlet_48h.sh --assert-autonomous-recovery",
    acceptanceGates: [
      { rule: "Autonomous Recovery Time", threshold: "< 3,000ms", description: "Cluster must detect anomaly and execute remediation within 3 seconds." },
      { rule: "Zero Human Intervention", threshold: "0 Manual Actions", description: "100% automated self-healing during 48-hour continuous chaos bombardment." }
    ],
    productionSla: "99.999% high availability SLA under continuous chaos bombardment."
  },

  // ── 12. FULLSTACK WEB & MOBILE SYSTEMS ──
  {
    id: "p16",
    slug: "distributed-webrtc-collaborative-whiteboard",
    title: "Multiplayer WebRTC Canvas & CRDT Collaborative Whiteboard",
    tagline: "Ultra-responsive infinite canvas using Yjs Conflict-Free Replicated Data Types (CRDTs), WebSockets, and P2P WebRTC data channels.",
    difficulty: "Hard",
    domain: "Fullstack Web & Mobile Systems",
    durationDays: 45,
    techStack: ["Next.js 16", "TypeScript", "Yjs (CRDT)", "WebRTC", "WebSockets", "Canvas API", "Node.js", "Redis"],
    partnerTools: ["Vercel", "Redis", "Docker"],
    targetRoles: ["Frontend Dev", "Fullstack Dev", "Backend Dev", "QA Tester"],
    keywords: ["crdt", "yjs", "webrtc", "websockets", "canvas", "nextjs", "realtime", "multiplayer", "collaboration"],
    overview: "Build a high-performance multiplayer vector whiteboard capable of synchronizing 50+ concurrent users with zero merge conflicts. Uses Yjs CRDT state vector syncing, P2P WebRTC DataChannels for low-latency cursor broadcasting, and snapshot persistence in PostgreSQL/S3.",
    architectureNotes: "Next.js 16 Client -> HTML5 High-DPI Canvas Renderer -> Yjs Local CRDT Doc -> WebRTC DataChannel (P2P Mesh) -> Node.js WebSocket Central Fallback -> PostgreSQL Document Store.",
    databaseSchema: [
      "canvas_rooms (id UUID PK, slug VARCHAR UNIQUE, owner_id VARCHAR, created_at TIMESTAMP)",
      "canvas_snapshots (id UUID PK, room_id UUID FK, snapshot_blob BYTEA, version INT, created_at TIMESTAMP)"
    ],
    apiEndpoints: [
      { method: "POST", path: "/api/v1/canvas/create", description: "Initialize collaborative canvas room." },
      { method: "GET", path: "/api/v1/canvas/{slug}/snapshot", description: "Fetch compressed CRDT state vector binary." }
    ],
    milestones: [
      { phase: "Phase 1: Infinite Canvas & Yjs CRDT Core", days: "Days 1-15", goal: "Implement pan/zoom vector canvas and attach Yjs shared types.", deliverables: ["Canvas engine", "Yjs binding layer", "Unit tests for conflict resolution"] },
      { phase: "Phase 2: WebRTC DataChannels & Cursor Mesh", days: "Days 16-30", goal: "Broadcast live 60fps cursor movements and stroke updates via WebRTC mesh.", deliverables: ["WebRTC signaling server", "P2P data sync module", "50-user simulated test"] },
      { phase: "Phase 3: Persistence & Vercel Production Release", days: "Days 31-45", goal: "Snapshot state to PostgreSQL and deploy live to Vercel.", deliverables: ["Live Vercel URL", "Public GitHub repository", "Video demo"] }
    ],
    evaluationCriteria: [
      { metric: "State Synchronization Convergence", weight: 50, description: "100% deterministic convergence across 50 simulated concurrent clients." },
      { metric: "Cursor Broadcast Latency", weight: 35, description: "Sub-20ms cursor propagation latency over WebRTC data channels." },
      { metric: "Daily Ship Logs", weight: 15, description: "Daily proof of work on LinkedIn and Discord." }
    ],
    learningResources: [
      { title: "Real-Time Collaboration with Yjs & CRDTs Explained", type: "YouTube Video", url: "https://www.youtube.com/watch?v=0lkhvy2yPCQ" },
      { title: "Yjs CRDT Official Documentation", type: "Documentation", url: "https://docs.yjs.dev/" }
    ],
    strictTestCommand: "npm test -- tests/crdt_convergence.test.ts",
    acceptanceGates: [
      { rule: "Zero Merge Conflicts", threshold: "100% Deterministic", description: "Concurrent asynchronous drawing strokes must converge identically." },
      { rule: "Cursor Latency", threshold: "< 25ms", description: "P2P WebRTC cursor broadcast latency must be under 25ms." }
    ],
    productionSla: "99.99% real-time session uptime."
  },

  // ── 13. AUDIO DSP & SPEECH AI ──
  {
    id: "p17",
    slug: "realtime-streaming-audio-dsp-speech-enhancer",
    title: "Real-Time Streaming Audio DSP & Noise Reduction Engine",
    tagline: "Low-latency streaming speech enhancement in PyTorch / ONNX with spectral masking, deep recurrent neural networks, and WebRTC AEC.",
    difficulty: "Hard",
    domain: "Audio DSP & Speech AI",
    durationDays: 45,
    techStack: ["PyTorch", "ONNX Runtime", "librosa", "FastAPI", "WebRTC", "C++", "Docker"],
    partnerTools: ["Docker", "Hugging Face", "AWS EC2"],
    targetRoles: ["AI Engineer", "Backend Dev", "Data & Financial ML"],
    keywords: ["audio", "dsp", "speech ai", "noise suppression", "webrtc", "pytorch", "onnx", "acoustic", "spectral", "deep learning"],
    overview: "Construct an ultra-low-latency streaming speech enhancement and background acoustic noise removal engine. Process chunked 20ms raw PCM audio frames, compute Short-Time Fourier Transforms (STFT), apply Deep Complex U-Net spectral masks for noise suppression, and re-synthesize high-fidelity voice with sub-25ms algorithmic latency.",
    architectureNotes: "Microphone Audio Ingest (WebRTC / WebSocket) -> 20ms Frame Ring Buffer -> STFT Spectrogram Transformer -> PyTorch Deep Complex U-Net -> ISTFT Phase Reconstruct -> Noise-Free Audio Stream.",
    databaseSchema: [
      "audio_sessions (id UUID PK, sample_rate INT, channels INT, duration_sec NUMERIC, snr_improvement_db NUMERIC, created_at TIMESTAMP)"
    ],
    apiEndpoints: [
      { method: "WS", path: "/ws/v1/audio/stream-enhance", description: "Stream 20ms PCM audio chunks and receive denoised speech." }
    ],
    milestones: [
      { phase: "Phase 1: STFT & Streaming Ring Buffer", days: "Days 1-15", goal: "Implement circular audio buffer and short-time Fourier transform processing.", deliverables: ["C++/Python audio buffer", "STFT/ISTFT math pipeline", "Latency profiling"] },
      { phase: "Phase 2: Complex U-Net Noise Suppression", days: "Days 16-30", goal: "Train/export ONNX model achieving >= 12dB SNR improvement in noisy environments.", deliverables: ["ONNX model checkpoint", "SNR improvement benchmark", "PESQ/STOI evaluation"] },
      { phase: "Phase 3: WebRTC Integration & Cloud Deploy", days: "Days 31-45", goal: "Connect WebRTC audio track and deploy low-latency server on AWS EC2.", deliverables: ["Live demo page", "Cloud deployment", "Dissertation report"] }
    ],
    evaluationCriteria: [
      { metric: "Speech Quality (PESQ Score)", weight: 45, description: "PESQ score >= 3.2 on diverse background noise test sets." },
      { metric: "Algorithmic Frame Latency", weight: 35, description: "Sub-25ms end-to-end processing latency per 20ms audio frame." },
      { metric: "Daily Ship Logs", weight: 20, description: "Daily proof of work on LinkedIn and Discord." }
    ],
    learningResources: [
      { title: "Deep Learning for Audio & Speech Processing with PyTorch", type: "YouTube Video", url: "https://www.youtube.com/watch?v=F_Yv2U23g7M" },
      { title: "ONNX Runtime High-Performance Audio Inference", type: "Documentation", url: "https://onnxruntime.ai/docs/" }
    ],
    strictTestCommand: "pytest tests/test_audio_dsp.py --min-pesq=3.2 --max-latency=25ms",
    acceptanceGates: [
      { rule: "PESQ Score", threshold: ">= 3.2", description: "Enhanced audio quality must exceed 3.2 PESQ score." },
      { rule: "Frame Latency", threshold: "< 25ms", description: "Processing latency per chunk must be under 25ms." }
    ],
    productionSla: "Sub-25ms latency with 0 buffer underruns."
  },

  // ── 14. CUSTOM STUDENT PROPOSAL ──
  {
    id: "p50",
    slug: "custom-student-engineering-proposal",
    title: "Custom Student Engineering Proposal (Build Your Own)",
    tagline: "Propose and ship your own novel architecture across any frontier domain. Approved directly by Founder Soham Sharma.",
    difficulty: "Hard",
    domain: "Custom Builder Project",
    durationDays: 45,
    featured: true,
    techStack: ["Custom Stack", "FastAPI / Django", "PyTorch / Rust", "PostgreSQL", "Docker"],
    partnerTools: ["Docker", "GitHub", "AWS"],
    targetRoles: ["AI Engineer", "Backend Dev", "Frontend Dev", "Fullstack Dev", "Cloud DevOps", "Pen-tester", "QA Tester", "Product Manager", "Data & Financial ML"],
    keywords: ["custom", "proposal", "independent project", "research", "architecture", "antigravity", "innovation"],
    overview: "Have an extraordinary idea in robotics, quantum computing, compiler engineering, or applied AI that isn't listed? Submit your technical PRD, system architecture diagram, and 45-day milestone roadmap. Once approved by Founder Soham Sharma, build and ship it with full mentorship and 15-company referral eligibility!",
    architectureNotes: "Custom Architecture Diagram -> Founder Technical Review -> GitHub Repository Setup -> 45-Day Milestone Tracking -> Demo Day Defense.",
    databaseSchema: [
      "custom_proposals (id UUID PK, student_email VARCHAR, project_title VARCHAR, domain VARCHAR, technical_prd_markdown TEXT, status VARCHAR, created_at TIMESTAMP)"
    ],
    apiEndpoints: [
      { method: "POST", path: "/api/v1/proposals/submit", description: "Submit custom project proposal and architecture PRD." }
    ],
    milestones: [
      { phase: "Phase 1: Architecture Defense & Core Setup", days: "Days 1-15", goal: "Defend PRD architecture with founder and complete core repository infrastructure.", deliverables: ["Approved PRD", "GitHub repo", "Core infrastructure setup"] },
      { phase: "Phase 2: Feature Implementation & Evals", days: "Days 16-30", goal: "Implement primary business logic and automated test suites.", deliverables: ["Core feature code", "Automated test suite", "Midterm demo video"] },
      { phase: "Phase 3: Production Deploy & Final Defense", days: "Days 31-45", goal: "Deploy to production cloud and present final architecture defense.", deliverables: ["Live URL", "Public GitHub repo", "Final dissertation"] }
    ],
    evaluationCriteria: [
      { metric: "Architectural Originality & Rigor", weight: 50, description: "Deep technical complexity with zero vibe-coding and complete test coverage." },
      { metric: "Milestone Execution Velocity", weight: 30, description: "Consistent shipping against defined 45-day milestones." },
      { metric: "Daily Ship Logs", weight: 20, description: "Daily proof of work on LinkedIn and Discord." }
    ],
    learningResources: [
      { title: "How to Architect Novel Software Systems from First Principles", type: "YouTube Video", url: "https://www.youtube.com/watch?v=0kF416rM7oM" }
    ],
    strictTestCommand: "npm test || pytest || cargo test",
    acceptanceGates: [
      { rule: "Automated Test Pass Rate", threshold: "100% Pass", description: "Project must include automated regression tests with 100% pass rate." }
    ],
    productionSla: "99.9% uptime for cloud-deployed demo."
  }
];
