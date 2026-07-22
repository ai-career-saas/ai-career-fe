"use client";

import { cn } from "@/utils/cn";
import {
  ChevronUp,
  ChevronDown,
  TrendingUp,
  Clock,
  Target,
  Zap,
  CircleDollarSign,
  CheckCircle2,
  BookOpen,
  Gift,
  Map,
} from "lucide-react";
import { useState } from "react";

interface SkillGap {
  skill: string;
  importance: "critical" | "important" | "nice-to-have";
  reason: string;
  learn_time: string;
  free_resource?: string;
}

interface Career {
  title: string;
  difficulty: "easy" | "medium" | "hard";
  current_coverage: number;
  match_score: number;
  description: string;
  salary_range: string;
  matched_skills: string[];
  skill_gaps: SkillGap[];
  total_upskill_time: string;
  roadmap_summary: string[];
  typical_companies: string[];
  why_recommended: string;
}

interface Props {
  careers: Career[];
  easiest_path?: string;
  highest_salary_path?: string;
  overall_advice?: string;
  detected_skills: string[];
}

const difficultyConfig = {
  easy: { label: "เริ่มได้เร็ว" },
  medium: { label: "ใช้เวลาปานกลาง" },
  hard: { label: "ต้องพัฒนาเยอะ" },
};

const importanceConfig = {
  critical: { label: "critical", className: "bg-rose-50 text-rose-600" },
  important: { label: "important", className: "bg-slate-100 text-slate-600" },
  "nice-to-have": {
    label: "nice-to-have",
    className: "bg-slate-50 text-slate-400",
  },
};

export default function MultiCareerGapView({
  careers,
  easiest_path,
  highest_salary_path,
  overall_advice,
  detected_skills,
}: Props) {
  return (
    <>
      {/* Summary banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-4">
        <h3 className="flex items-center gap-1.5 font-semibold mb-1">
          <Target size={14} className="text-rose-600" />
          {careers?.length || 0} career paths found for you
        </h3>
        <p className="text-slate-500 text-sm">
          Sort by easiest → hardest. Click on each career to view details.
        </p>
        {(easiest_path || highest_salary_path) && (
          <div className="flex gap-2 mt-3 flex-wrap">
            {easiest_path && (
              <span className="inline-flex items-center gap-1 text-sm border border-slate-200 px-2 py-1 rounded-full text-slate-600">
                <Zap size={11} className="text-rose-600" />
                Easiest path: {easiest_path}
              </span>
            )}
            {highest_salary_path && (
              <span className="inline-flex items-center gap-1 text-sm border border-slate-200 px-2 py-1 rounded-full text-slate-600">
                <CircleDollarSign size={11} className="text-rose-600" />
                Highest salary: {highest_salary_path}
              </span>
            )}
          </div>
        )}
        {overall_advice && (
          <p className="text-sm text-slate-500 mt-3 border-t border-slate-100 pt-3">
            {overall_advice}
          </p>
        )}
      </div>

      {/* Career cards */}
      <div className="space-y-3 mt-3">
        {(careers || []).map((career, i) => (
          <CareerCard key={i} career={career} rank={i} />
        ))}
      </div>
    </>
  );
}

function CareerCard({ career, rank }: { career: Career; rank: number }) {
  const [open, setOpen] = useState(rank === 0);
  const diff = difficultyConfig[career.difficulty] || difficultyConfig.medium;
  const isTopPick = rank === 0;

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
      {/* Header */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full p-4 flex items-start gap-3 hover:bg-slate-50 transition-colors text-left"
      >
        <span className="w-7 h-7 rounded-full border border-slate-200 flex items-center justify-center text-sm font-mono font-bold text-slate-500 shrink-0 mt-0.5">
          {rank + 1}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-bold text-slate-900">{career.title}</h3>
            <span className="text-sm font-mono px-2 py-0.5 rounded-full border border-slate-200 text-slate-500">
              {diff.label}
            </span>
            {isTopPick && (
              <span className="text-sm font-mono px-2 py-0.5 rounded-full bg-rose-600 text-white font-medium">
                Top pick
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500 mt-1 line-clamp-1">
            {career.description}
          </p>

          {/* Coverage bar */}
          <div className="flex items-center gap-2 mt-2">
            <span className="text-sm text-slate-400 shrink-0">
              skill ที่มีแล้ว
            </span>
            <div className="flex-1 bg-slate-100 rounded-full h-1.5">
              <div
                className="h-1.5 rounded-full bg-slate-900"
                style={{ width: `${career.current_coverage}%` }}
              />
            </div>
            <span className="text-sm font-mono font-bold text-slate-700">
              {career.current_coverage}%
            </span>
            <span className="text-sm font-mono text-slate-400 flex items-center gap-1">
              <Clock size={11} />
              {career.total_upskill_time}
            </span>
          </div>
        </div>
        {open ? (
          <ChevronUp size={16} className="text-slate-400 shrink-0" />
        ) : (
          <ChevronDown size={16} className="text-slate-400 shrink-0" />
        )}
      </button>

      {/* Detail */}
      {open && (
        <div className="px-4 pb-4 space-y-4 border-t border-slate-100">
          {/* Salary + companies */}
          <div className="flex flex-wrap gap-3 pt-3">
            <div className="flex items-center gap-1.5 text-sm text-slate-700">
              <TrendingUp size={14} className="text-slate-400" />
              <span className="font-medium font-mono">
                {career.salary_range}
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-1">
            {career.typical_companies?.map((c, i) => (
              <span
                key={i}
                className="text-sm bg-white border border-slate-200 px-2 py-0.5 rounded-full text-slate-500"
              >
                {c}
              </span>
            ))}
          </div>

          {/* Skills already have */}
          {career.matched_skills?.length > 0 && (
            <div>
              <p className="flex items-center gap-1.5 text-sm font-semibold font-mono text-slate-700 mb-1.5">
                <CheckCircle2 size={12} />
                Skill ที่มีแล้ว
              </p>
              <div className="flex flex-wrap gap-1">
                {career.matched_skills.map((s, i) => (
                  <span
                    key={i}
                    className="text-sm bg-slate-900 text-white px-2 py-0.5 rounded-full"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Skill gaps */}
          {career.skill_gaps?.length > 0 && (
            <div>
              <p className="flex items-center gap-1.5 text-sm font-semibold font-mono text-slate-700 mb-2">
                <BookOpen size={12} />
                Skill ที่ต้องเพิ่ม
              </p>
              <div className="space-y-2">
                {career.skill_gaps.map((gap, i) => {
                  const imp =
                    importanceConfig[gap.importance] ||
                    importanceConfig["nice-to-have"];
                  return (
                    <div
                      key={i}
                      className="bg-slate-50 rounded-xl p-3 border border-slate-100"
                    >
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-medium text-sm text-slate-800">
                          {gap.skill}
                        </span>
                        <span
                          className={cn(
                            "text-sm font-mono px-1.5 py-0.5 rounded-full",
                            imp.className,
                          )}
                        >
                          {imp.label}
                        </span>
                        <span className="text-sm font-mono text-slate-400 flex items-center gap-0.5 ml-auto">
                          <Clock size={11} /> {gap.learn_time}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500">{gap.reason}</p>
                      {gap.free_resource && (
                        <a
                          href={gap.free_resource}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-sm text-rose-600 mt-1"
                        >
                          <Gift size={11} />
                          {gap.free_resource}
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Roadmap summary */}
          {career.roadmap_summary?.length > 0 && (
            <div>
              <p className="flex items-center gap-1.5 text-sm font-semibold font-mono text-slate-700 mb-2">
                <Map size={12} />
                แผนภาพรวม
              </p>
              <div className="space-y-1">
                {career.roadmap_summary.map((step, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 text-sm text-slate-600"
                  >
                    <span className="shrink-0 w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center font-mono font-bold text-sm">
                      {i + 1}
                    </span>
                    {step}
                  </div>
                ))}
              </div>
            </div>
          )}

          <p className="text-sm text-slate-500 italic border-t border-slate-100 pt-3">
            {career.why_recommended}
          </p>
        </div>
      )}
    </div>
  );
}
