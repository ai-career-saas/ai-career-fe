"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Clock,
  FileText,
  Loader2,
  Map,
  Plus,
  Sparkles,
  Target,
  TrendingUp,
  X,
} from "lucide-react";
import {
  Button,
  Card,
  SectionHeader,
  Badge,
  Alert,
  Textarea,
} from "@/components/ui";
import { aiApi } from "@/lib/api";
import {
  AnalysisResponse,
  NoGoalInsufficientAnalysis,
  NoGoalSufficientAnalysis,
} from "@/types";
import HasGoalAnalysis from "@/app/(default)/dashboard/analyze/_components/HasGoalAnalysis";
import ReadyCareersView from "@/app/(default)/dashboard/analyze/_components/ReadyCareersView";
import MultiCareerGapView from "@/app/(default)/dashboard/analyze/_components/MultiCareerGapView";

const MOCK_DATA_HAS_GOAL: AnalysisResponse = {
  user_id: "2a1e6127-346a-4df9-9a78-dee13a3817d4",
  path_type: "has_goal",
  message:
    "ยินดีด้วยนะครับที่คุณมีเป้าหมายที่ชัดเจนและน่าตื่นเต้นมาก! การเป็น Fullstack Developer เป็นเส้นทางที่ท้าทายแต่คุ้มค่าสุดๆ โดยเฉพาะเมื่อพิจารณาจากฐานเงินเดือนที่สูงถึง 45,000 - 90,000 บาท ซึ่งถือเป็นเป้าหมายที่จับต้องได้หากคุณวางแผนให้ดีครับ\n\nจากการวิเคราะห์ทักษะที่คุณมีอยู่ 8 อย่าง เทียบกับความต้องการของตลาดในปัจจุบัน พบว่าคุณยังมี Gap อีก 5 ทักษะที่ต้องเติมเต็มเพื่อให้พร้อมสำหรับบทบาทนี้ ผมได้ออกแบบ Roadmap ระยะเวลา 12 สัปดาห์มาให้ โดยแบ่งเป็น 3 เฟสหลัก:\n*   **Weeks 1-4 (Deep Dive into Backend):** โฟกัสที่การทำความเข้าใจ Server-side logic, Database Management (SQL/NoSQL) และ API Design\n*   **Weeks 5-8 (Frontend Mastery & Integration):** ยกระดับทักษะ Frontend ด้วย Framework ยอดนิยม (เช่น React หรือ Next.js) และฝึกเชื่อมต่อ API เข้ากับ UI\n*   **Weeks 9-12 (Project-Based Learning):** ลงมือทำโปรเจกต์จริงแบบ End-to-end เพื่อสร้าง Portfolio ที่แสดงให้เห็นว่าคุณสามารถจัดการทั้งระบบได้ด้วยตัวเอง\n\nอย่าเพิ่งกังวลกับ Gap ที่เหลือนะครับ เพราะการเรียนรู้คือส่วนหนึ่งของงานสาย Tech อยู่แล้ว ให้มองว่าทุกทักษะที่คุณเติมเต็มคือการเพิ่มมูลค่าให้กับตัวคุณเองในตลาดแรงงานครับ ผมแนะนำให้เริ่มจากโปรเจกต์เล็กๆ ที่คุณสนใจก่อน แล้วค่อยๆ ขยายขอบเขตงานให้ซับซ้อนขึ้นเรื่อยๆ \n\n**Believe in your potential, stay consistent, and you will definitely become the developer you aspire to be!**",
  analysis: {
    path_type: "has_goal",
    current_profile: {
      current_role: "Full-Stack Developer Intern",
      years_experience: 0.5,
      education:
        "Bachelor of Science in Computer Science, King Mongkut’s University of Technology North Bangkok",
      summary:
        "คุณ Satapon เป็นบัณฑิตจบใหม่ที่มีศักยภาพสูงมากครับ มีประสบการณ์ฝึกงานในบริษัทระดับอุตสาหกรรมอย่าง SCGC และมีทักษะที่ครบเครื่องทั้ง Next.js, NestJS และ PostgreSQL รวมถึงมีความสนใจด้าน AI Agent (LangGraph) ซึ่งเป็นจุดแข็งที่โดดเด่นมากในตลาดงานปัจจุบัน โปรไฟล์นี้พร้อมสำหรับการเป็น Junior Fullstack Developer ในบริษัท Tech ชั้นนำได้ทันทีครับ",
    },
    detected_skills: [
      {
        name: "TypeScript",
        level: "intermediate",
        category: "technical",
      },
      {
        name: "React/Next.js",
        level: "intermediate",
        category: "technical",
      },
      {
        name: "NestJS/Node.js",
        level: "intermediate",
        category: "technical",
      },
      {
        name: "PostgreSQL",
        level: "intermediate",
        category: "technical",
      },
      {
        name: "Python",
        level: "intermediate",
        category: "technical",
      },
      {
        name: "Flutter",
        level: "beginner",
        category: "technical",
      },
      {
        name: "Docker",
        level: "beginner",
        category: "technical",
      },
      {
        name: "Git",
        level: "intermediate",
        category: "technical",
      },
    ],
    recommended_careers: [
      {
        title: "Fullstack Developer",
        match_score: 0,
      },
    ],
    skill_gaps: [
      {
        skill: "System Architecture & Scalability",
        importance: "critical",
        reason:
          "Moving from intern to full-time requires understanding microservices, load balancing, and caching strategies (Redis) for production-grade apps.",
        demand_score: 9.2,
      },
      {
        skill: "Cloud Infrastructure (AWS/GCP)",
        importance: "critical",
        reason:
          "Companies prioritize candidates who can handle end-to-end deployment, CI/CD pipelines, and cloud-native services over those who only code locally.",
        demand_score: 9.5,
      },
      {
        skill: "Advanced Testing (Playwright/Cypress)",
        importance: "important",
        reason:
          "Enterprise-level projects demand robust E2E testing to ensure stability; manual testing is no longer sufficient for production environments.",
        demand_score: 8,
      },
      {
        skill: "TypeScript Design Patterns & SOLID",
        importance: "important",
        reason:
          "Writing maintainable, scalable code is a key differentiator for junior-to-mid level transitions in 2026.",
        demand_score: 7.5,
      },
      {
        skill: "AI-Assisted Development Workflow",
        importance: "important",
        reason:
          "The market now expects developers to leverage AI tools (GitHub Copilot, Cursor) to boost productivity and handle boilerplate tasks efficiently.",
        demand_score: 8.8,
      },
    ],
    roadmap: {
      target_role: "Fullstack Developer",
      total_duration: "12 weeks",
      milestones: [
        {
          week: "Week 1-2",
          title: "Clean Code & Design Patterns",
          tasks: [
            "Deep dive into SOLID principles with TypeScript",
            "Refactor existing NestJS projects using Design Patterns (Factory, Strategy, Repository)",
            "Master AI-assisted coding workflow using Cursor/GitHub Copilot for boilerplate reduction",
          ],
          resources: [
            {
              name: "Refactoring.Guru (Design Patterns)",
              url: "https://refactoring.guru/design-patterns",
              type: "documentation",
              cost: "free",
            },
          ],
          success_metric:
            "Successfully refactored a legacy module into a clean, testable, and SOLID-compliant structure.",
        },
        {
          week: "Week 3-5",
          title: "System Architecture & Scalability",
          tasks: [
            "Implement Redis for caching in NestJS applications",
            "Design a microservices architecture diagram for a high-traffic scenario",
            "Learn load balancing concepts and database indexing strategies for PostgreSQL",
          ],
          resources: [
            {
              name: "System Design Primer",
              url: "https://github.com/donnemartin/system-design-primer",
              type: "github-repo",
              cost: "free",
            },
          ],
          success_metric:
            "Reduced API response time by 30% using Redis caching in a sample project.",
        },
        {
          week: "Week 6-8",
          title: "Cloud Infrastructure & CI/CD",
          tasks: [
            "Containerize full-stack apps with Docker and Docker Compose",
            "Set up a CI/CD pipeline using GitHub Actions to AWS/Vercel",
            "Deploy a production-ready Next.js + NestJS app to AWS (EC2/ECS)",
          ],
          resources: [
            {
              name: "AWS Cloud Practitioner Essentials",
              url: "https://explore.skillbuilder.aws/",
              type: "course",
              cost: "free",
            },
          ],
          success_metric:
            "Automated deployment pipeline that triggers on push to main branch.",
        },
        {
          week: "Week 9-10",
          title: "Advanced Testing & Quality Assurance",
          tasks: [
            "Write E2E tests for critical user flows using Playwright",
            "Implement unit testing for NestJS services with Jest",
            "Integrate testing into the CI/CD pipeline to prevent regressions",
          ],
          resources: [
            {
              name: "Playwright Documentation",
              url: "https://playwright.dev/docs/intro",
              type: "documentation",
              cost: "free",
            },
          ],
          success_metric:
            "Achieved >80% test coverage for core business logic.",
        },
        {
          week: "Week 11-12",
          title: "Portfolio Polish & AI Integration",
          tasks: [
            "Integrate an LLM API (OpenAI/Anthropic) into your project to solve a real-world problem",
            "Update portfolio with production-ready links (AWS/Vercel)",
            "Practice explaining technical debt and architecture decisions for interviews",
          ],
          resources: [
            {
              name: "OpenAI API Cookbook",
              url: "https://github.com/openai/openai-cookbook",
              type: "documentation",
              cost: "free",
            },
          ],
          success_metric:
            "A live, deployed project that showcases architecture, testing, and AI integration.",
        },
      ],
      key_certifications: [
        "AWS Certified Developer – Associate",
        "Docker Certified Associate (Optional)",
      ],
      daily_commitment: "2-3 hours",
      motivational_message:
        "การเปลี่ยนผ่านจากนักศึกษาฝึกงานสู่ Full-time Developer คือก้าวที่สำคัญมากครับ! แม้เนื้อหาจะดูท้าทาย แต่ถ้าคุณค่อยๆ เก็บสะสมความรู้ทีละส่วนแบบนี้ รับรองว่าคุณจะกลายเป็น Developer ที่บริษัทชั้นนำแย่งตัวแน่นอน สู้ๆ นะครับ ผมเชื่อมั่นในศักยภาพของคุณ!",
    },
    market_insights: [
      "The market is shifting from 'generalist' to 'specialized full-stack' where depth in one stack (e.g., Next.js + NestJS) is valued over breadth.",
      "Soft skills like clear communication and the ability to explain technical debt to non-technical stakeholders are major hiring factors for 2026.",
      "Companies are increasingly looking for 'AI-augmented' developers who can integrate LLM APIs and optimize workflows using AI tools.",
      "Focus on building a portfolio that demonstrates production-ready deployments (AWS/Vercel) rather than just local prototypes.",
    ],
    salary_range: {
      min: "45,000",
      max: "90,000",
      currency: "THB",
      period: "month",
    },
    preferences_applied: {
      exclude_work_type: [],
      prefer_work_type: [],
      exclude_industry: [],
      prefer_industry: [],
      location: "Lamlukka, Phathum Thani",
      exclude_company_size: [],
      prefer_company_size: [],
    },
  },
  validation: {
    passed: false,
    quality_score: 85,
    summary:
      "ข้อมูลมีความครบถ้วนในส่วนของทักษะและ Roadmap แต่พบปัญหาสำคัญในส่วนของ Careers ที่ขาดคำอธิบายและมีคะแนน Match Score เป็น 0 ซึ่งไม่สมเหตุสมผลกับทักษะที่มีอยู่ นอกจากนี้ยังมีข้อความที่ถูกตัดทอนในส่วนของ Motivational Message",
    warnings: [
      {
        section: "roadmap",
        severity: "warning",
        field: "motivational_message",
        issue: "The motivational_message string is truncated at the end.",
        fix: "Complete the sentence in the motivational_message field.",
      },
    ],
    critical_issues: [
      {
        section: "careers",
        severity: "critical",
        field: "careers",
        issue:
          "The 'careers' array contains an object with 'match_score' of 0 and is missing the required 'description' field.",
        fix: "Add a professional description for the Fullstack Developer role and update the match_score to a realistic value (e.g., 85) based on the provided skills.",
      },
    ],
    retry_count: 1,
  },
};

const noGoalSufficientMock: AnalysisResponse = {
  user_id: "user_123456",
  path_type: "no_goal_sufficient",
  message:
    "Your current skills already qualify you for several entry-level software engineering roles.",
  analysis: {
    path_type: "no_goal_sufficient",
    skill_sufficient: true,

    detected_skills: [
      {
        name: "TypeScript",
        level: "advanced",
        category: "technical",
      },
      {
        name: "React",
        level: "advanced",
        category: "technical",
      },
      {
        name: "Next.js",
        level: "advanced",
        category: "technical",
      },
      {
        name: "Node.js",
        level: "intermediate",
        category: "technical",
      },
      {
        name: "NestJS",
        level: "intermediate",
        category: "technical",
      },
      {
        name: "PostgreSQL",
        level: "intermediate",
        category: "technical",
      },
      {
        name: "Docker",
        level: "intermediate",
        category: "technical",
      },
      {
        name: "Git",
        level: "advanced",
        category: "technical",
      },
      {
        name: "Problem Solving",
        level: "advanced",
        category: "soft",
      },
      {
        name: "Communication",
        level: "intermediate",
        category: "soft",
      },
    ],

    ready_careers: [
      {
        title: "Frontend Developer",
        match_score: 94,
        description:
          "Build modern web applications using React, Next.js, and TypeScript.",
        matched_skills: ["React", "Next.js", "TypeScript", "Git"],
        missing_minor: ["Testing (Jest/Vitest)"],
        salary_range: "$45,000 - $70,000 / year",
        why_good_fit:
          "Your frontend stack closely matches common industry requirements.",
        typical_companies: [
          "Tech Startups",
          "SaaS Companies",
          "Digital Agencies",
        ],
        time_to_ready: "Ready now",
      },
      {
        title: "Full Stack Developer",
        match_score: 90,
        description:
          "Develop frontend and backend applications using modern JavaScript technologies.",
        matched_skills: [
          "React",
          "Next.js",
          "NestJS",
          "Node.js",
          "PostgreSQL",
          "Docker",
        ],
        missing_minor: ["CI/CD"],
        salary_range: "$50,000 - $80,000 / year",
        why_good_fit:
          "You already have experience across frontend, backend, and databases.",
        typical_companies: ["Software Houses", "Product Companies", "FinTech"],
        time_to_ready: "Ready now",
      },
      {
        title: "Backend Developer",
        match_score: 86,
        description:
          "Build scalable APIs and backend services using NestJS and PostgreSQL.",
        matched_skills: ["Node.js", "NestJS", "PostgreSQL", "Docker"],
        missing_minor: ["Redis", "Microservices"],
        salary_range: "$50,000 - $82,000 / year",
        why_good_fit:
          "You already possess the core backend development skills.",
        typical_companies: ["Enterprise Software", "Cloud Companies"],
        time_to_ready: "Ready now",
      },
    ],

    near_reach_careers: [
      {
        title: "Cloud Engineer",
        current_coverage: 78,
        missing_skills: [
          {
            skill: "AWS",
            importance: "critical",
            learn_time: "4-6 weeks",
          },
          {
            skill: "Terraform",
            importance: "important",
            learn_time: "2-3 weeks",
          },
        ],
        total_upskill_time: "2 months",
        salary_range: "$65,000 - $95,000 / year",
        why_worth_it:
          "Cloud engineering has high demand and complements your backend experience.",
      },
      {
        title: "DevOps Engineer",
        current_coverage: 74,
        missing_skills: [
          {
            skill: "Kubernetes",
            importance: "critical",
            learn_time: "5-6 weeks",
          },
          {
            skill: "CI/CD Pipelines",
            importance: "important",
            learn_time: "2 weeks",
          },
        ],
        total_upskill_time: "2-3 months",
        salary_range: "$70,000 - $105,000 / year",
        why_worth_it:
          "You already know Docker and backend development, making DevOps a natural progression.",
      },
      {
        title: "AI Application Developer",
        current_coverage: 72,
        missing_skills: [
          {
            skill: "LLM Integration",
            importance: "important",
            learn_time: "3 weeks",
          },
          {
            skill: "Vector Databases",
            importance: "important",
            learn_time: "2 weeks",
          },
        ],
        total_upskill_time: "1-2 months",
        salary_range: "$75,000 - $110,000 / year",
        why_worth_it:
          "Your full-stack foundation makes it easy to transition into AI-powered application development.",
      },
    ],

    recommended_careers: [
      {
        title: "Frontend Developer",
        match_score: 94,
        description:
          "Build modern web applications using React, Next.js, and TypeScript.",
        matched_skills: ["React", "Next.js", "TypeScript", "Git"],
        missing_minor: ["Testing (Jest/Vitest)"],
        salary_range: "$45,000 - $70,000 / year",
        why_good_fit:
          "Your frontend stack closely matches common industry requirements.",
        typical_companies: [
          "Tech Startups",
          "SaaS Companies",
          "Digital Agencies",
        ],
        time_to_ready: "Ready now",
      },
      {
        title: "Full Stack Developer",
        match_score: 90,
        description:
          "Develop frontend and backend applications using modern JavaScript technologies.",
        matched_skills: [
          "React",
          "Next.js",
          "NestJS",
          "Node.js",
          "PostgreSQL",
          "Docker",
        ],
        missing_minor: ["CI/CD"],
        salary_range: "$50,000 - $80,000 / year",
        why_good_fit:
          "You already have experience across frontend, backend, and databases.",
        typical_companies: ["Software Houses", "Product Companies", "FinTech"],
        time_to_ready: "Ready now",
      },
      {
        title: "Backend Developer",
        match_score: 86,
        description:
          "Build scalable APIs and backend services using NestJS and PostgreSQL.",
        matched_skills: ["Node.js", "NestJS", "PostgreSQL", "Docker"],
        missing_minor: ["Redis", "Microservices"],
        salary_range: "$50,000 - $82,000 / year",
        why_good_fit:
          "You already possess the core backend development skills.",
        typical_companies: ["Enterprise Software", "Cloud Companies"],
        time_to_ready: "Ready now",
      },
    ],
  },

  validation: {
    passed: true,
    quality_score: 95,
    summary: "Analysis completed successfully with sufficient confidence.",
    retry_count: 0,
    warnings: [],
    critical_issues: [],
  },
};

const noGoalInsufficientMock: AnalysisResponse = {
  user_id: "user_789012",
  path_type: "no_goal_insufficient",
  message:
    "Your current skill set is a good starting point, but additional learning is recommended before applying for most software engineering roles.",

  analysis: {
    path_type: "no_goal_insufficient",
    skill_sufficient: false,

    detected_skills: [
      {
        name: "HTML",
        level: "intermediate",
        category: "technical",
      },
      {
        name: "CSS",
        level: "intermediate",
        category: "technical",
      },
      {
        name: "JavaScript",
        level: "beginner",
        category: "technical",
      },
      {
        name: "Git",
        level: "beginner",
        category: "technical",
      },
      {
        name: "Communication",
        level: "intermediate",
        category: "soft",
      },
      {
        name: "Problem Solving",
        level: "intermediate",
        category: "soft",
      },
    ],

    easiest_path: "Frontend Developer",

    highest_salary_path: "Cloud Engineer",

    overall_advice:
      "Focus on mastering one development stack instead of learning many technologies at once. Build several portfolio projects while strengthening your programming fundamentals.",

    recommended_careers: [
      {
        title: "Frontend Developer",
        difficulty: "easy",
        current_coverage: 58,
        match_score: 62,
        description:
          "Create responsive web applications using modern frontend frameworks.",

        salary_range: "$45,000 - $70,000 / year",

        matched_skills: ["HTML", "CSS", "JavaScript", "Communication"],

        skill_gaps: [
          {
            skill: "React",
            importance: "critical",
            reason:
              "Most modern frontend positions require React or a similar framework.",
            learn_time: "4-6 weeks",
            free_resource: "https://react.dev/learn",
            demand_score: 97,
          },
          {
            skill: "TypeScript",
            importance: "important",
            reason:
              "Type safety is commonly expected in professional frontend projects.",
            learn_time: "2-3 weeks",
            free_resource: "https://www.typescriptlang.org/docs/",
            demand_score: 92,
          },
          {
            skill: "REST API Integration",
            importance: "important",
            reason: "Frontend applications frequently consume backend APIs.",
            learn_time: "1-2 weeks",
            free_resource:
              "https://developer.mozilla.org/docs/Learn/JavaScript/Client-side_web_APIs",
            demand_score: 88,
          },
        ],

        total_upskill_time: "2-3 months",

        roadmap_summary: [
          "Learn React fundamentals",
          "Build 3 portfolio projects",
          "Learn TypeScript",
          "Deploy projects to Vercel",
        ],

        typical_companies: ["Digital Agencies", "Startups", "SaaS Companies"],

        why_recommended:
          "Your HTML and CSS foundation makes frontend development the quickest path into the software industry.",
      },

      {
        title: "Backend Developer",
        difficulty: "medium",
        current_coverage: 42,
        match_score: 50,
        description:
          "Develop APIs, databases, and business logic for web applications.",

        salary_range: "$50,000 - $80,000 / year",

        matched_skills: ["JavaScript", "Problem Solving"],

        skill_gaps: [
          {
            skill: "Node.js",
            importance: "critical",
            reason: "Core backend runtime for JavaScript developers.",
            learn_time: "3-4 weeks",
            free_resource: "https://nodejs.org/en/learn",
            demand_score: 94,
          },
          {
            skill: "SQL",
            importance: "critical",
            reason: "Backend systems require database knowledge.",
            learn_time: "3 weeks",
            free_resource: "https://sqlbolt.com/",
            demand_score: 95,
          },
          {
            skill: "NestJS",
            importance: "important",
            reason: "Widely used for enterprise Node.js development.",
            learn_time: "2-3 weeks",
            free_resource: "https://docs.nestjs.com/",
            demand_score: 83,
          },
        ],

        total_upskill_time: "4-5 months",

        roadmap_summary: [
          "Learn Node.js",
          "Practice SQL and PostgreSQL",
          "Build REST APIs",
          "Learn NestJS",
        ],

        typical_companies: [
          "FinTech",
          "Enterprise Software",
          "Cloud Companies",
        ],

        why_recommended:
          "Backend development provides strong long-term career growth and complements frontend skills.",
      },

      {
        title: "Cloud Engineer",
        difficulty: "hard",
        current_coverage: 28,
        match_score: 35,
        description:
          "Manage cloud infrastructure, deployments, and scalable systems.",

        salary_range: "$70,000 - $110,000 / year",

        matched_skills: ["Git"],

        skill_gaps: [
          {
            skill: "Linux",
            importance: "critical",
            reason: "Most cloud environments are Linux-based.",
            learn_time: "4 weeks",
            free_resource: "https://linuxjourney.com/",
            demand_score: 95,
          },
          {
            skill: "AWS",
            importance: "critical",
            reason: "AWS is the most commonly requested cloud platform.",
            learn_time: "6-8 weeks",
            free_resource: "https://skillbuilder.aws/",
            demand_score: 99,
          },
          {
            skill: "Docker",
            importance: "important",
            reason: "Containerization is a standard DevOps skill.",
            learn_time: "2 weeks",
            free_resource: "https://docs.docker.com/get-started/",
            demand_score: 94,
          },
          {
            skill: "Kubernetes",
            importance: "important",
            reason: "Common orchestration platform for production systems.",
            learn_time: "4-5 weeks",
            free_resource: "https://kubernetes.io/docs/tutorials/",
            demand_score: 91,
          },
        ],

        total_upskill_time: "6-8 months",

        roadmap_summary: [
          "Master Linux",
          "Learn Docker",
          "Earn AWS Cloud Practitioner",
          "Deploy applications to AWS",
          "Learn Kubernetes",
        ],

        typical_companies: [
          "Cloud Providers",
          "Large Enterprises",
          "FinTech",
          "Consulting Firms",
        ],

        why_recommended:
          "Although it requires more learning, cloud engineering offers excellent salary growth and demand.",
      },
    ],
  },

  validation: {
    passed: true,
    quality_score: 91,
    summary: "Analysis completed successfully with moderate confidence.",

    retry_count: 0,

    warnings: [
      {
        section: "Resume",
        severity: "warning",
        field: "Projects",
        issue: "Portfolio projects are limited.",
        fix: "Complete 2-3 end-to-end projects and publish them on GitHub.",
      },
    ],

    critical_issues: [],
  },
};

export default function AnalyzePage() {
  const [message, setMessage] = useState("");
  const [careerGoal, setCareerGoal] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("");
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  // useEffect(() => {
  //   loadMockData();
  // }, []);

  const loadMockData = useCallback(() => {
    setResult(noGoalInsufficientMock);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!message.trim()) return;
    setError("");
    setResult(null);
    setLoading(true);
    setStep("Starting analysis...");

    const form = new FormData();
    form.append("message", message);
    if (careerGoal) form.append("career_goal", careerGoal);
    if (file) form.append("resume_file", file);

    try {
      const { data } = await aiApi.analyze(form);
      setResult(data);
    } catch (e: any) {
      setError(e.response?.data?.message || e.message || "Analysis failed");
    } finally {
      setLoading(false);
      setStep("");
    }
  }, [message, careerGoal, file]);

  const renderAnalysis = (analysis: AnalysisResponse) => {
    switch (analysis.path_type) {
      case "has_goal":
        return (
          <HasGoalAnalysis
            analysis={analysis.analysis as any}
            sessionType="with_goal"
          />
        );
      case "no_goal_sufficient":
        const analy = analysis.analysis as NoGoalSufficientAnalysis & {
          user_id?: string;
        };

        return (
          <ReadyCareersView
            readyCareers={analy.ready_careers || []}
            nearReachCareers={analy.near_reach_careers || []}
          />
        );
      case "no_goal_insufficient":
        const result = analysis.analysis as NoGoalInsufficientAnalysis & {
          user_id?: string;
        };

        const normalizedCareers = (result.recommended_careers || []).map(
          (career) => ({
            ...career,
            skill_gaps: (career.skill_gaps || []).map((gap) => ({
              ...gap,
              // `MultiCareerGapView` expects learn_time always be a string.
              learn_time: gap.learn_time ?? "",
              // Normalize `null` -> `undefined` to match `MultiCareerGapView` prop types.
              free_resource: gap.free_resource ?? undefined,
            })),
          }),
        );

        return (
          <MultiCareerGapView
            careers={normalizedCareers}
            easiest_path={result.easiest_path}
            highest_salary_path={result.highest_salary_path}
            overall_advice={result.overall_advice}
            detected_skills={(result.detected_skills || []).map((s) => s.name)}
          />
        );
      default:
        return <div>Analysis type not supported yet.</div>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <SectionHeader
        title="Career Analysis"
        subtitle="Describe your situation and get an AI-powered career roadmap."
        icon={<Target size={18} />}
      />

      {/* Input Card */}
      <Card className="p-6 space-y-4">
        <Textarea
          label="Tell me about yourself"
          placeholder="e.g. I'm a Python developer with 2 years experience looking to become a Data Engineer..."
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">
              Career Goal (optional)
            </label>
            <input
              type="text"
              value={careerGoal}
              onChange={(e) => setCareerGoal(e.target.value)}
              placeholder="e.g. Data Engineer, Full Stack Developer..."
              className="rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">
              Resume (optional)
            </label>
            {file ? (
              <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-green-300 bg-green-50">
                <FileText size={16} className="text-green-600 shrink-0" />
                <span className="text-sm text-green-700 truncate flex-1">
                  {file.name}
                </span>
                <button onClick={() => setFile(null)}>
                  <X
                    size={14}
                    className="text-green-500 hover:text-green-700"
                  />
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileRef.current?.click()}
                className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-dashed border-slate-300 text-sm text-slate-500 hover:border-rose-400 hover:text-rose-600 transition-colors"
              >
                <Plus size={16} /> Upload PDF/DOCX
              </button>
            )}
            <input
              ref={fileRef}
              type="file"
              accept=".pdf,.docx"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </div>
        </div>

        <Button
          onClick={handleSubmit}
          loading={loading}
          disabled={!message.trim()}
          size="lg"
          icon={<Sparkles size={16} />}
        >
          Analyze Career
        </Button>

        {loading && step && (
          <div className="flex items-center gap-2 text-sm text-rose-600 bg-rose-50 rounded-xl px-4 py-3">
            <Loader2 size={16} className="animate-spin shrink-0" />
            <span>{step}</span>
          </div>
        )}
      </Card>

      {error && <Alert variant="error">{error}</Alert>}

      {/* Results */}
      {result && (
        <div className="space-y-4 animate-fade-in">
          {renderAnalysis(result)}
        </div>
      )}

      {result && (
        <div className="space-y-4 animate-fade-in">
          {/* AI Message */}
          {/* <Card className="p-5 bg-gradient-to-r from-rose-50 to-rose-50 border-rose-200">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center shrink-0">
                <Sparkles size={14} className="text-white" />
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">{result.message}</p>
            </div>
          </Card> */}

          {/* Detected Skills */}
          {/* {result.analysis?.detected_skills?.length > 0 && (
            <Section
              title={`Detected Skills (${result.analysis.detected_skills.length})`}
              icon={<TrendingUp size={16} />}
            >
              <div className="flex flex-wrap gap-2 pt-3">
                {result.analysis.detected_skills.map((s: any, i: number) => (
                  <span
                    key={i}
                    className={cn(
                      "px-2.5 py-1 rounded-full text-xs font-medium border",
                      s.level === "advanced"
                        ? "bg-purple-100 text-purple-700 border-purple-200"
                        : s.level === "intermediate"
                          ? "bg-rose-100 text-rose-700 border-rose-200"
                          : "bg-slate-100 text-slate-600 border-slate-200",
                    )}
                  >
                    {s.name}
                  </span>
                ))}
              </div>
            </Section>
          )} */}

          {/* Skill Gaps */}
          {/* {result.analysis?.skill_gaps?.length > 0 && (
            <Section
              title={`Skill Gaps (${result.analysis.skill_gaps.length})`}
              icon={<Target size={16} />}
            >
              <div className="space-y-2 pt-3">
                {result.analysis.skill_gaps.map((g: any, i: number) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3 rounded-xl bg-slate-50"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-sm text-slate-800">
                          {g.skill}
                        </span>
                        <span
                          className={cn(
                            "px-2 py-0.5 rounded-full text-xs border",
                            IMPORTANCE_COLOR[g.importance] ||
                              IMPORTANCE_COLOR["nice-to-have"],
                          )}
                        >
                          {g.importance}
                        </span>
                      </div>
                      {g.reason && (
                        <p className="text-xs text-slate-500 mt-1">
                          {g.reason}
                        </p>
                      )}
                    </div>
                    {g.learn_time && (
                      <span className="text-xs text-slate-400 flex items-center gap-1 shrink-0">
                        <Clock size={12} />
                        {g.learn_time}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </Section>
          )} */}

          {/* Roadmap */}
          {/* {result.analysis?.roadmap && (
            <Section
              title={`Roadmap: ${result.analysis.roadmap.target_role}`}
              icon={<Map size={16} />}
            >
              <div className="space-y-1 pt-3">
                {/* Duration
                <div className="flex gap-4 text-xs text-slate-500 mb-4">
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {result.analysis.roadmap.total_duration}
                  </span>
                  {result.analysis.roadmap.daily_commitment && (
                    <span>{result.analysis.roadmap.daily_commitment}/day</span>
                  )}
                </div>
                {/* Milestones */}
          {/* <div className="relative pl-4">
                  <div className="absolute left-1.5 top-0 bottom-0 w-0.5 bg-rose-100" />
                  <div className="space-y-4">
                    {result.analysis.roadmap.milestones?.map(
                      (m: any, i: number) => (
                        <div key={i} className="relative pl-6">
                          <div className="absolute -left-2 top-2 w-4 h-4 rounded-full bg-rose-500 border-2 border-white shadow-sm" />
                          <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="rose" className="text-xs">
                                {m.week}
                              </Badge>
                              <span className="font-semibold text-sm text-slate-800">
                                {m.title}
                              </span>
                            </div>
                            <ul className="space-y-1">
                              {m.tasks?.map((t: string, j: number) => (
                                <li
                                  key={j}
                                  className="text-xs text-slate-600 flex items-start gap-2"
                                >
                                  <span className="text-rose-400 mt-0.5">
                                    ▸
                                  </span>
                                  {t}
                                </li>
                              ))}
                            </ul>
                            {m.resources?.length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-3">
                                {m.resources
                                  .slice(0, 3)
                                  .map((r: any, k: number) =>
                                    r.url ? (
                                      <a
                                        key={k}
                                        href={r.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-rose-600 hover:underline"
                                      >
                                        📚 {r.name}
                                      </a>
                                    ) : (
                                      <span
                                        key={k}
                                        className="text-xs text-slate-400"
                                      >
                                        📚 {r.name}
                                      </span>
                                    ),
                                  )}
                              </div>
                            )}
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </div>
            </Section> */}
          {/* )} } */}

          {/* Ready Careers */}
          {/* {result.analysis?.ready_careers?.length > 0 && (
            <Section
              title={`Ready Careers (${result.analysis.ready_careers.length})`}
              icon={<TrendingUp size={16} />}
            >
              <div className="space-y-3 pt-3">
                {result.analysis.ready_careers.map((c: any, i: number) => (
                  <div
                    key={i}
                    className="bg-green-50 border border-green-200 rounded-xl p-4"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-semibold text-slate-800">
                        {c.title}
                      </h4>
                      <span className="text-green-700 font-bold text-sm">
                        {c.match_score}%
                      </span>
                    </div>
                    {c.salary_range && (
                      <p className="text-sm text-green-700 mt-1">
                        💰 {c.salary_range}
                      </p>
                    )}
                    {c.description && (
                      <p className="text-xs text-slate-600 mt-2">
                        {c.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </Section>
          )} */}
        </div>
      )}
    </div>
  );
}
