import { ARENA_PROJECTS, ArenaProject } from "./arena-projects";

export interface MatchResult {
  project: ArenaProject;
  matchScore: number; // 0 - 100%
  matchedKeywords: string[];
  missingKeywords: string[];
  recommendedRole: string;
  learningGaps: {
    skill: string;
    resource: {
      title: string;
      type: string;
      url: string;
    };
  }[];
}

export interface AnalysisResponse {
  extractedSkills: string[];
  experienceLevel: "Beginner / Learner" | "Intermediate Builder" | "Advanced Engineer" | "Hardcore Shipper";
  topMatches: MatchResult[];
  recommendedTrack: string;
  summary: string;
}

const COMMON_SKILL_KEYWORDS: Record<string, string[]> = {
  python: ["python", "py", "python3"],
  fastapi: ["fastapi", "uvicorn", "starlette", "asyncio", "async python"],
  django: ["django", "django rest framework", "drf", "django channels", "celery"],
  postgresql: ["postgresql", "postgres", "psql", "sql", "postgis", "prisma", "sqlalchemy"],
  nextjs: ["next.js", "nextjs", "next 14", "next 15", "next 16", "react", "react.js", "typescript", "tailwind", "tailwindcss"],
  satellite_geospatial: ["satellite", "geospatial", "gdal", "rasterio", "sentinel", "ndvi", "gis", "remote sensing", "geotiff", "earth observation"],
  drone_vision: ["drone", "robotics", "webrtc", "yolo", "bytetrack", "opencv", "computer vision", "rtsp", "streaming", "edge ai", "kalman filter"],
  healthcare_ai: ["healthcare", "dicom", "monai", "medical ai", "clinical nlp", "fhir", "hl7", "mri", "ct scan", "biomedical", "torchio"],
  graphrag: ["graphrag", "knowledge graph", "neo4j", "leiden", "cypher", "multi-hop", "graph", "embeddings", "vector search"],
  langgraph: ["langgraph", "state machine", "agentic workflows", "autonomous agents", "langchain"],
  hft_telemetry: ["hft", "order book", "market data", "high frequency", "limit order", "financial telemetry", "trading"],
  qdrant: ["qdrant", "vector database", "vector search", "pinecone", "weaviate", "milvus", "chromadb", "embeddings"],
  pytorch: ["pytorch", "torch", "deep learning", "machine learning", "neural networks", "scikit-learn", "pandas", "numpy", "transformers"],
  docker: ["docker", "dockerfile", "docker-compose", "containerization", "kubernetes", "k8s", "helm"],
  aws: ["aws", "amazon web services", "ec2", "s3", "ecs", "lambda", "cloud", "devops", "ci/cd", "github actions"],
  redteam_security: ["cybersecurity", "security", "pentesting", "penetration testing", "owasp", "burp suite", "red team", "ethical hacking", "vulnerability assessment", "ssrf", "idor"],
  qa_testing: ["qa", "testing", "playwright", "cypress", "selenium", "k6", "load testing", "automation testing"],
  rust_ebpf: ["rust", "rustlang", "cargo", "ebpf", "systems programming", "memory safety", "kernel"]
};

export function extractSkillsFromText(text: string): string[] {
  const lower = text.toLowerCase();
  const detected = new Set<string>();

  for (const [canonical, variations] of Object.entries(COMMON_SKILL_KEYWORDS)) {
    for (const v of variations) {
      const regex = new RegExp(`(?:\\b|[^a-zA-Z0-9])${v.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?:\\b|[^a-zA-Z0-9])`, "i");
      if (regex.test(lower)) {
        detected.add(canonical);
        break;
      }
    }
  }

  return Array.from(detected);
}

export function matchResumeToArenaProjects(resumeText: string): AnalysisResponse {
  const extractedSkills = extractSkillsFromText(resumeText);

  let experienceLevel: AnalysisResponse["experienceLevel"] = "Intermediate Builder";
  if (extractedSkills.length <= 2) {
    experienceLevel = "Beginner / Learner";
  } else if (extractedSkills.length >= 7) {
    experienceLevel = "Hardcore Shipper";
  } else if (extractedSkills.length >= 4) {
    experienceLevel = "Advanced Engineer";
  }

  const matches: MatchResult[] = ARENA_PROJECTS.map((project) => {
    const projectKeywords = project.keywords.map((k) => k.toLowerCase());
    const matched: string[] = [];
    const missing: string[] = [];

    for (const kw of projectKeywords) {
      const isMatched = extractedSkills.some((skill) => {
        const variants = COMMON_SKILL_KEYWORDS[skill] || [skill];
        return variants.some((v) => v.includes(kw) || kw.includes(v));
      });

      if (isMatched) {
        matched.push(kw);
      } else {
        missing.push(kw);
      }
    }

    const rawScore = (matched.length / projectKeywords.length) * 100;
    const score = Math.min(Math.round(Math.max(rawScore, 20)), 100);

    let recommendedRole = project.targetRoles[0];
    if (extractedSkills.includes("redteam_security") && project.targetRoles.includes("Pen-tester")) {
      recommendedRole = "Pen-tester";
    } else if (extractedSkills.includes("qa_testing") && project.targetRoles.includes("QA Tester")) {
      recommendedRole = "QA Tester";
    } else if (extractedSkills.includes("pytorch") && project.targetRoles.includes("AI Engineer")) {
      recommendedRole = "AI Engineer";
    } else if (extractedSkills.includes("rust_ebpf") && project.targetRoles.includes("Cloud DevOps")) {
      recommendedRole = "Cloud DevOps";
    }

    const learningGaps = missing.slice(0, 3).map((gap) => {
      const relatedResource = project.learningResources[0] || {
        title: `${gap.toUpperCase()} Documentation & Mastery Guide`,
        type: "Documentation",
        url: "https://docs.botmartz.com"
      };
      return {
        skill: gap,
        resource: relatedResource
      };
    });

    return {
      project,
      matchScore: score,
      matchedKeywords: matched,
      missingKeywords: missing,
      recommendedRole,
      learningGaps
    };
  });

  matches.sort((a, b) => b.matchScore - a.matchScore);

  const topMatches = matches.slice(0, 4);
  const primaryProject = topMatches[0]?.project;

  return {
    extractedSkills,
    experienceLevel,
    topMatches,
    recommendedTrack: primaryProject ? `${primaryProject.domain} Track` : "Frontier AI & Systems Engineering",
    summary: `We detected ${extractedSkills.length} core technical domains from your background. Your highest alignment is with the ${primaryProject?.title || "Frontier AI Systems"} track with an estimated ${topMatches[0]?.matchScore || 85}% profile match.`
  };
}
