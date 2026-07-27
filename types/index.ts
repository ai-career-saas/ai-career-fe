export * from "./analysisResult";

// ── Auth ─────────────────────────────────────────────────────────────────
export interface User {
  id: string;
  email: string;
  name: string;
  created_at?: string;
  plan_name?: string;
  sub_status?: string;
  quota?: Record<string, number>;
  current_period_end?: string;
}

export interface AuthResponse {
  user: User;
  access_token: string;
  refresh_token: string;
}

// ── Plans ─────────────────────────────────────────────────────────────────
export interface Plan {
  id: string;
  name: string;
  price_thb: number;
  description: string;
  stripe_price_id: string | null;
  quota: Record<string, number>;
  features: string[];
}

// ── Subscription ──────────────────────────────────────────────────────────
export interface Subscription {
  status: "active" | "created" | "halted" | "cancelled";
  current_period_end: string | null;
  stripe_subscription_id: string | null;
  plan_name: string;
  price_thb: number;
  quota: Record<string, number>;
  features: string[];
}

// ── Usage ─────────────────────────────────────────────────────────────────
export interface UsageItem {
  used: number;
  limit: number;
  remaining: number;
}

export type UsageMap = Record<string, UsageItem>;

// ── Interview ─────────────────────────────────────────────────────────────
export interface InterviewQuestion {
  id: number;
  category: "technical" | "behavioral" | "situational" | "culture_fit";
  difficulty: "easy" | "medium" | "hard";
  question: string;
  why_asked: string;
  key_points: string[];
  sample_answer_tip: string;
  follow_up?: string;
}

export interface InterviewQuestionSet {
  target_role: string;
  experience_level: string;
  total_questions: number;
  questions: InterviewQuestion[];
  preparation_tips: string[];
  overall_advice: string;
}

// ── ATS ───────────────────────────────────────────────────────────────────
export interface ATSKeywordMatch {
  keyword: string;
  found: boolean;
  importance: "critical" | "important" | "nice-to-have";
  context?: string;
}

export interface ATSSection {
  section: string;
  score: number;
  feedback: string;
  issues: string[];
}

export interface ATSScoreResult {
  overall_score: number;
  grade: string;
  keyword_match_rate: number;
  keyword_matches: ATSKeywordMatch[];
  missing_critical_keywords: string[];
  missing_important_keywords: string[];
  sections: ATSSection[];
  formatting_issues: string[];
  strengths: string[];
  suggestions: string[];
  summary: string;
  estimated_pass_rate: string;
}
