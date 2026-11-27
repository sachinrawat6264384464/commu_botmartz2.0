export interface TeamMember {
  id: string;
  name: string;
  handle: string;
  email: string;
  role: string;
  department: "Leadership" | "Engineering" | "AI/ML" | "Product & Research" | "QA" | "Marketing";
  bio: string;
  avatarBg: string;
  github?: string;
  linkedin?: string;
  discord?: string;
  kpis: {
    reviewsCompleted: number;
    avgReviewTimeHours: number;
    bugsVerified: number;
    officeHoursAttended: number;
  };
  specialties: string[];
}

export const BOTMARTZ_TEAM: TeamMember[] = [
  {
    id: "soham-sharma",
    name: "Soham Sharma",
    handle: "@soham_ai",
    email: "soham@botmartz.com",
    role: "Founder / Director",
    department: "Leadership",
    bio: "Founder & AI Architect at Botmartz. Specializing in high-throughput agent swarms, deterministic LangGraph workflows, and zero-trust engineering architectures.",
    avatarBg: "from-[#0066FF] to-[#00B8F0]",
    github: "https://github.com/soham2710",
    linkedin: "https://linkedin.com/in/sohamsharma",
    discord: "soham_ai#0001",
    kpis: {
      reviewsCompleted: 58,
      avgReviewTimeHours: 2.8,
      bugsVerified: 19,
      officeHoursAttended: 12
    },
    specialties: ["Agentic AI", "Zero-Trust Architecture", "Distributed Systems", "Fundraising & Ecosystems"]
  },
  {
    id: "ritik-motwani",
    name: "Ritik Motwani",
    handle: "@ritik_m",
    email: "ritik@botmartz.com",
    role: "Full Stack Developer (Python)",
    department: "Engineering",
    bio: "Backend and database performance engineer building robust REST APIs, Django/FastAPI enterprise modules, and caching layers.",
    avatarBg: "from-cyan-600 to-blue-800",
    github: "https://github.com/ritik-botmartz",
    linkedin: "https://linkedin.com/in/ritik-motwani",
    discord: "ritik_py#7712",
    kpis: {
      reviewsCompleted: 28,
      avgReviewTimeHours: 3.8,
      bugsVerified: 8,
      officeHoursAttended: 6
    },
    specialties: ["Python", "Django", "FastAPI", "PostgreSQL Indexing", "CI/CD"]
  },
  {
    id: "sachin-rawat",
    name: "Sachin Rawat",
    handle: "@sachin_r",
    email: "sachin@botmartz.com",
    role: "Full Stack Developer (Python + Node.js)",
    department: "Engineering",
    bio: "Polyglot backend engineer bridging Python AI pipelines with high-throughput Node.js event buses and Next.js frontend state machines.",
    avatarBg: "from-emerald-600 to-teal-800",
    github: "https://github.com/sachin-botmartz",
    linkedin: "https://linkedin.com/in/sachin-rawat",
    discord: "sachin_rawat#5521",
    kpis: {
      reviewsCompleted: 39,
      avgReviewTimeHours: 3.1,
      bugsVerified: 14,
      officeHoursAttended: 10
    },
    specialties: ["FastAPI", "RAG", "Agentic AI", "Django"]
  }
];
