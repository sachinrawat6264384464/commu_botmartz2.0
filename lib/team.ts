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
    id: "vedansh-trivedi",
    name: "Vedansh Trivedi",
    handle: "@vedansh_t",
    email: "vedansh@botmartz.com",
    role: "Full Stack Developer (Python)",
    department: "Engineering",
    bio: "Full Stack Python specialist focused on FastAPI microservices, asynchronous task queues (Celery/Redis), and PostgreSQL performance tuning.",
    avatarBg: "from-blue-600 to-indigo-700",
    github: "https://github.com/vedansh-botmartz",
    linkedin: "https://linkedin.com/in/vedansh-trivedi",
    discord: "vedansh#3412",
    kpis: {
      reviewsCompleted: 34,
      avgReviewTimeHours: 3.5,
      bugsVerified: 11,
      officeHoursAttended: 8
    },
    specialties: ["FastAPI", "Python AsyncIO", "SQLAlchemy", "Docker Microservices"]
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
    specialties: ["Python", "Node.js", "Next.js", "Redis Pub/Sub", "REST/GraphQL APIs"]
  },
  {
    id: "vinay-chaware",
    name: "Vinay Chaware",
    handle: "@vinay_c",
    email: "vinay@botmartz.com",
    role: "Full Stack Developer (Node.js)",
    department: "Engineering",
    bio: "Full stack Node.js & TypeScript architect building real-time collaboration engines, WebSocket servers, and performant React applications.",
    avatarBg: "from-amber-600 to-orange-700",
    github: "https://github.com/vinay-botmartz",
    linkedin: "https://linkedin.com/in/vinay-chaware",
    discord: "vinay_node#9812",
    kpis: {
      reviewsCompleted: 31,
      avgReviewTimeHours: 4.0,
      bugsVerified: 9,
      officeHoursAttended: 7
    },
    specialties: ["Node.js", "TypeScript", "WebSockets", "Prisma", "Real-time State"]
  },
  {
    id: "vaidehi-banabakode",
    name: "Vaidehi Banabakode",
    handle: "@vaidehi_b",
    email: "vaidehi@botmartz.com",
    role: "Product Associate & Research Intern",
    department: "Product & Research",
    bio: "Product strategist and user research specialist designing intuitive developer onboarding flows, PRD blueprints, and industrial ecosystem telemetry.",
    avatarBg: "from-pink-600 to-rose-700",
    github: "https://github.com/vaidehi-botmartz",
    linkedin: "https://linkedin.com/in/vaidehi-banabakode",
    discord: "vaidehi_p#4419",
    kpis: {
      reviewsCompleted: 42,
      avgReviewTimeHours: 2.5,
      bugsVerified: 16,
      officeHoursAttended: 11
    },
    specialties: ["Technical PRDs", "User Research", "Product Telemetry", "Ecosystem Mapping"]
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
    id: "bhavya-jain",
    name: "Bhavya Jain",
    handle: "@bhavya_j",
    email: "bhavya@botmartz.com",
    role: "AI/ML Intern with Backend in Python",
    department: "AI/ML",
    bio: "Machine learning engineer working on PyTorch neural network training, vector search retrieval (Qdrant), and FastAPI model serving pipelines.",
    avatarBg: "from-purple-600 to-violet-800",
    github: "https://github.com/bhavya-botmartz",
    linkedin: "https://linkedin.com/in/bhavya-jain",
    discord: "bhavya_ai#1109",
    kpis: {
      reviewsCompleted: 25,
      avgReviewTimeHours: 3.2,
      bugsVerified: 7,
      officeHoursAttended: 8
    },
    specialties: ["PyTorch", "Transformers", "Qdrant Vector DB", "Python Backend", "Model Evaluation"]
  },
  {
    id: "shruti-jadhav",
    name: "Shruti Jadhav",
    handle: "@shruti_j",
    email: "shruti@botmartz.com",
    role: "QA Tester & Automation Engineer",
    department: "QA",
    bio: "Quality assurance engineer building automated Playwright end-to-end testing suites, k6 performance load tests, and security regression checks.",
    avatarBg: "from-teal-600 to-emerald-700",
    github: "https://github.com/shruti-botmartz",
    linkedin: "https://linkedin.com/in/shruti-jadhav",
    discord: "shruti_qa#8831",
    kpis: {
      reviewsCompleted: 45,
      avgReviewTimeHours: 2.1,
      bugsVerified: 27,
      officeHoursAttended: 10
    },
    specialties: ["Playwright E2E", "k6 Load Testing", "API Automation", "Regression Testing", "OWASP Checks"]
  },
  {
    id: "arunesh-kher",
    name: "Arunesh Kher",
    handle: "@arunesh_k",
    email: "arunesh@botmartz.com",
    role: "Social Media & Community Growth Intern",
    department: "Marketing",
    bio: "Community marketer driving builder UGC loops, LinkedIn progress diary spotlights, technical viral campaigns, and college campus ambassador programs.",
    avatarBg: "from-amber-500 to-red-600",
    github: "https://github.com/arunesh-botmartz",
    linkedin: "https://linkedin.com/in/arunesh-kher",
    discord: "arunesh_growth#6610",
    kpis: {
      reviewsCompleted: 22,
      avgReviewTimeHours: 3.0,
      bugsVerified: 5,
      officeHoursAttended: 9
    },
    specialties: ["LinkedIn Growth", "Developer Marketing", "UGC Campaigns", "Campus Outreach"]
  }
];
