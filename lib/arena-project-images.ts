export const ARENA_DOMAIN_IMAGE_MAP: Record<string, string> = {
  "Geospatial & Satellite AI":
    "https://res.cloudinary.com/dnafnxfsf/image/upload/v1795773740/botmartz-arena/arena-geospatial-satellite.jpg",
  "Edge Drone Vision & Robotics":
    "https://res.cloudinary.com/dnafnxfsf/image/upload/v1795773742/botmartz-arena/arena-edge-drone-vision.jpg",
  "Clinical Healthcare AI":
    "https://res.cloudinary.com/dnafnxfsf/image/upload/v1795773743/botmartz-arena/arena-clinical-healthcare.jpg",
  "GraphRAG & Knowledge Topology":
    "https://res.cloudinary.com/dnafnxfsf/image/upload/v1795735062/botmartz-workshops/ws-agentic-rag.svg",
  "AI Agents & State Machines":
    "https://res.cloudinary.com/dnafnxfsf/image/upload/v1795735062/botmartz-workshops/ws-agentic-rag.svg",
  "WebGPU Edge SLMs":
    "https://res.cloudinary.com/dnafnxfsf/image/upload/v1795735062/botmartz-workshops/ws-agentic-rag.svg",
  "Data Science & Predictive ML":
    "https://res.cloudinary.com/dnafnxfsf/image/upload/v1795735066/botmartz-workshops/ws-ml-systems.svg",
  "Statistical Modeling & Econometrics":
    "https://res.cloudinary.com/dnafnxfsf/image/upload/v1795735066/botmartz-workshops/ws-ml-systems.svg",
  "High-Frequency Telemetry":
    "https://res.cloudinary.com/dnafnxfsf/image/upload/v1795735060/botmartz-workshops/ws-python-prod.jpg",
  "Kernel eBPF & Autonomous Cloud":
    "https://res.cloudinary.com/dnafnxfsf/image/upload/v1795735060/botmartz-workshops/ws-python-prod.jpg",
  "QA Mesh & Distributed Load":
    "https://res.cloudinary.com/dnafnxfsf/image/upload/v1795735060/botmartz-workshops/ws-python-prod.jpg",
  "Semiconductor & Embedded Edge":
    "https://res.cloudinary.com/dnafnxfsf/image/upload/v1795735060/botmartz-workshops/ws-python-prod.jpg",
  "Autonomous Red-Team Cybersecurity":
    "https://res.cloudinary.com/dnafnxfsf/image/upload/v1795735069/botmartz-workshops/ws-prompt-evals.jpg",
  "Fullstack Web & Realtime Systems":
    "https://res.cloudinary.com/dnafnxfsf/image/upload/v1795735064/botmartz-workshops/ws-career-roadmap.svg",
  "EdTech & Developer Tooling":
    "https://res.cloudinary.com/dnafnxfsf/image/upload/v1795735064/botmartz-workshops/ws-career-roadmap.svg",
  "Custom Builder Project":
    "https://res.cloudinary.com/dnafnxfsf/image/upload/v1795735064/botmartz-workshops/ws-career-roadmap.svg",
  "Audio DSP & Speech AI":
    "https://res.cloudinary.com/dnafnxfsf/image/upload/v1795735061/botmartz-workshops/ws-rag-arch.jpg",
  "Clean Energy & Smart Grids":
    "https://res.cloudinary.com/dnafnxfsf/image/upload/v1795773740/botmartz-arena/arena-geospatial-satellite.jpg",
  "Agritech & Precision Farming":
    "https://res.cloudinary.com/dnafnxfsf/image/upload/v1795773740/botmartz-arena/arena-geospatial-satellite.jpg",
  "Supply Chain & Logistics":
    "https://res.cloudinary.com/dnafnxfsf/image/upload/v1795773742/botmartz-arena/arena-edge-drone-vision.jpg",
  "Baby Steps & Starter Kits":
    "https://res.cloudinary.com/dnafnxfsf/image/upload/v1795735060/botmartz-workshops/ws-python-prod.jpg",
  "Easy Foundation Projects":
    "https://res.cloudinary.com/dnafnxfsf/image/upload/v1795735061/botmartz-workshops/ws-rag-arch.jpg",
};

export const DEFAULT_ARENA_PROJECT_IMAGE =
  "https://res.cloudinary.com/dnafnxfsf/image/upload/v1795735061/botmartz-workshops/ws-rag-arch.jpg";

export function getDefaultArenaProjectImage(domain?: string): string {
  if (domain && ARENA_DOMAIN_IMAGE_MAP[domain]) {
    return ARENA_DOMAIN_IMAGE_MAP[domain];
  }
  return DEFAULT_ARENA_PROJECT_IMAGE;
}
