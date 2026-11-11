import type { Job } from "@/lib/jobs"

/**
 * Demo listings mirroring the HireLoop 2.0 Figma design.
 * Used as a graceful fallback when the jobs API is unreachable, so the
 * public pages can still be reviewed pixel-perfect against the design.
 */

export interface DemoJob extends Job {
  logo: string
  cover?: string
}

export const DEMO_JOBS: DemoJob[] = [
  {
    _id: "demo-senior-product-designer",
    title: "Senior Product Designer",
    company: "TechFlow Systems",
    location: "San Francisco, CA (Remote)",
    jobType: "Full-time",
    employmentType: "Full-time",
    salaryMin: 140000,
    salaryMax: 180000,
    category: "Design",
    experience: "5+ Years",
    logo: "/images/hireloop2/company-techflow.png",
    applicationEmail: "careers@techflow.example",
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    description:
      "At TechFlow Systems we are building workflow automation loved by operations teams everywhere. We are looking for a Senior Product Designer to lead end-to-end design for our core platform experience.",
    responsibilities: [
      "Lead the end-to-end design process for major platform features, from discovery to high-fidelity implementation.",
      "Collaborate with cross-functional partners to understand user needs and translate them into functional design requirements.",
      "Maintain and evolve our design system, ensuring consistency and accessibility across the entire product suite.",
      "Conduct user research and usability testing to validate design decisions and iterate based on feedback.",
    ],
    requirements: [
      "Figma Expertise",
      "System Thinking",
      "UI/UX Design",
      "Basic Frontend",
      "5+ years of experience designing complex B2B SaaS products.",
      "A strong portfolio showcasing your design process and problem-solving skills.",
    ],
    benefits: [
      "Full Health & Dental",
      "Competitive 401k",
      "Latest Hardware Stipend",
      "Unlimited PTO",
    ],
  },
  {
    _id: "demo-lead-frontend-engineer",
    title: "Lead Frontend Engineer",
    company: "FinGrid Solutions",
    location: "New York, NY",
    jobType: "Full-time",
    employmentType: "Full-time",
    salaryMin: 165000,
    salaryMax: 210000,
    category: "Engineering",
    experience: "7+ Years",
    logo: "/images/hireloop2/company-fingrid.png",
    applicationEmail: "jobs@fingrid.example",
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    description:
      "FinGrid Solutions builds realtime financial dashboards for institutional traders. Join us as Lead Frontend Engineer to own our React architecture and mentor a growing team.",
    responsibilities: [
      "Own the frontend architecture for our realtime trading dashboards.",
      "Mentor engineers and drive frontend best practices across teams.",
      "Partner with design to ship polished, accessible interfaces.",
    ],
    requirements: [
      "React & TypeScript",
      "Team Leadership",
      "Data Visualisation",
      "8+ years of frontend engineering experience.",
    ],
    benefits: ["Equity Package", "Commuter Benefits", "Annual Learning Budget"],
  },
  {
    _id: "demo-ux-researcher",
    title: "UX Researcher",
    company: "CreativeStudio",
    location: "Austin, TX",
    jobType: "Contract",
    employmentType: "Contract",
    salaryMin: 110000,
    salaryMax: 145000,
    category: "Design",
    experience: "3+ Years",
    logo: "/images/hireloop2/company-creativestudio.png",
    applicationEmail: "hello@creativestudio.example",
    createdAt: new Date(Date.now() - 8 * 86400000).toISOString(),
    description:
      "CreativeStudio is hiring a UX Researcher for a 12-month engagement. You will run discovery sprints and usability studies for consumer products used by millions.",
    responsibilities: [
      "Plan and run discovery sprints, interviews and usability studies.",
      "Synthesize findings into actionable insights and journey maps.",
      "Present research outcomes to product and executive stakeholders.",
    ],
    requirements: [
      "User Interviews",
      "Usability Testing",
      "Synthesis & Storytelling",
    ],
    benefits: ["Flexible Hours", "Remote Days"],
  },
  {
    _id: "demo-machine-learning-engineer",
    title: "Machine Learning Engineer",
    company: "HealthAI Corp",
    location: "Boston, MA (Remote)",
    jobType: "Full-time",
    employmentType: "Full-time",
    salaryMin: 180000,
    salaryMax: 250000,
    category: "Engineering",
    experience: "5+ Years",
    logo: "/images/hireloop2/company-healthai.png",
    applicationEmail: "talent@healthai.example",
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    description:
      "HealthAI Corp applies machine learning to early diagnostics. As an ML Engineer you will build and ship models that clinicians rely on every day.",
    responsibilities: [
      "Design, train and evaluate models for clinical prediction tasks.",
      "Own the path from prototype to production inference services.",
      "Collaborate with clinical experts to define model requirements.",
    ],
    requirements: [
      "Python & PyTorch",
      "MLOps",
      "Clinical Data",
      "PhD or 5+ years of applied ML experience.",
    ],
    benefits: [
      "Full Health & Dental",
      "Equity Package",
      "Conference Budget",
      "Unlimited PTO",
    ],
  },
]

export const DEMO_JOB_DETAIL: DemoJob = {
  _id: "demo-senior-product-designer-detail",
  title: "Senior Product Designer",
  company: "CloudScale AI",
  location: "Remote (US)",
  jobType: "Full-time",
  employmentType: "Full-time",
  salaryMin: 140000,
  salaryMax: 180000,
  category: "SaaS / Artificial Intelligence",
  experience: "5+ Years",
  logo: "/images/hireloop2/company-cloudscale-logo.png",
  applicationEmail: "careers@cloudscale.example",
  createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  description:
    "At CloudScale AI, we are building the next generation of infrastructure monitoring tools. We are looking for a Senior Product Designer who is passionate about translating complex technical workflows into elegant, intuitive interfaces. You will be a key member of our design team, working closely with engineering and product leadership to define the vision for our core platform experience.",
  responsibilities: [
    "Lead the end-to-end design process for major platform features, from discovery to high-fidelity implementation.",
    "Collaborate with cross-functional partners to understand user needs and translate them into functional design requirements.",
    "Maintain and evolve our design system, ensuring consistency and accessibility across the entire product suite.",
    "Conduct user research and usability testing to validate design decisions and iterate based on feedback.",
  ],
  requirements: [
    "Figma Expertise",
    "System Thinking",
    "UI/UX Design",
    "Basic Frontend",
    "5+ years of experience designing complex B2B SaaS products or data-heavy applications.",
    "A strong portfolio showcasing your design process and problem-solving skills.",
  ],
  benefits: [
    "Full Health & Dental",
    "Competitive 401k",
    "Latest Hardware Stipend",
    "Unlimited PTO",
  ],
}

export const DEMO_COMPANY_OVERVIEW = {
  logo: "/images/hireloop2/company-cloudscale-logo.png",
  cover: "/images/hireloop2/company-cloudscale-cover.png",
  size: "250 - 500 Employees",
  industry: "SaaS / Artificial Intelligence",
  website: "#",
}
