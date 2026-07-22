"use client";

import type { HasGoalAnalysis } from "@/types";
import { Badge, Section } from "@/components/ui";
import { Clock, Target, TrendingUp, Map, User } from "lucide-react";
import { cn } from "@/utils/cn";

interface AnalysisPanelProps {
  analysis: HasGoalAnalysis;
  sessionType: "with_goal" | "without_goal";
}

const IMPORTANCE_COLOR: Record<string, string> = {
  critical: "bg-red-100 text-red-700 border-red-200",
  important: "bg-yellow-100 text-yellow-700 border-yellow-200",
  "nice-to-have": "bg-green-100 text-green-700 border-green-200",
};

export default function HasGoalAnalysis({
  analysis,
  sessionType,
}: AnalysisPanelProps) {

  return (
    <>
      {/* Profile Summary */}
      {analysis.current_profile && (
        <Section icon={<User size={16} />} title="โปรไฟล์ของคุณ">
          <div className="grid grid-cols-2 gap-3 text-sm pt-3">
            {analysis.current_profile.current_role && (
              <div>
                <span className="text-gray-500">Current Role</span>
                <p className="font-medium text-gray-800">
                  {analysis.current_profile.current_role}
                </p>
              </div>
            )}

            {analysis.current_profile.years_experience !== undefined && (
              <div>
                <span className="text-gray-500">Years of Experience</span>
                <p className="font-medium text-gray-800">
                  {analysis.current_profile.years_experience} years
                </p>
              </div>
            )}

            {analysis.current_profile.education && (
              <div className="col-span-2">
                <span className="text-gray-500">Education</span>
                <p className="font-medium text-gray-800">
                  {analysis.current_profile.education}
                </p>
              </div>
            )}
          </div>
        </Section>
      )}

      {/* Skills */}
      {analysis.detected_skills?.length > 0 && (
        <Section
          title={`Detected Skills (${analysis.detected_skills.length})`}
          icon={<TrendingUp size={16} />}
        >
          <div className="flex flex-wrap gap-2 pt-3">
            {analysis.detected_skills.map((s: any, i: number) => (
              <span
                key={i}
                className={cn(
                  "px-2.5 py-1 rounded-full text-xs font-medium border",
                  s.level === "advanced"
                    ? "bg-purple-100 text-purple-700 border-purple-200"
                    : s.level === "intermediate"
                      ? "bg-blue-100 text-blue-700 border-blue-200"
                      : "bg-slate-100 text-slate-600 border-slate-200",
                )}
              >
                {s.name}
              </span>
            ))}
          </div>
        </Section>
      )}

      {/* Career Recommendations */}
      {analysis.recommended_careers?.length > 0 && (
        <Section
          icon={<Target size={16} />}
          title={
            sessionType === "without_goal"
              ? "Recommend Career"
              : "Recommended Career"
          }
        >
          {/* <CareerCards careers={analysis.recommended_careers} /> */}
          <p>test</p>
        </Section>
      )}

      {/* Skill Gaps */}
      {analysis?.skill_gaps?.length > 0 && (
        <Section
          title={`Skill Gaps (${analysis.skill_gaps.length})`}
          icon={<Target size={16} />}
        >
          <div className="space-y-2 pt-3">
            {analysis.skill_gaps.map((g: any, i: number) => (
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
                    <p className="text-xs text-slate-500 mt-1">{g.reason}</p>
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
      )}

      {/* Roadmap */}
      {analysis?.roadmap && (
        <Section
          title={`Roadmap: ${analysis.roadmap.target_role}`}
          icon={<Map size={16} />}
        >
          <div className="space-y-1 pt-3">
            {/* Duration */}
            <div className="flex gap-4 text-xs text-slate-500 mb-4">
              <span className="flex items-center gap-1">
                <Clock size={12} />
                {analysis.roadmap.total_duration}
              </span>
              {analysis.roadmap.daily_commitment && (
                <span>{analysis.roadmap.daily_commitment}/day</span>
              )}
            </div>
            {/* Milestones */}
            <div className="relative pl-4">
              <div className="absolute left-1.5 top-0 bottom-0 w-0.5 bg-blue-100" />
              <div className="space-y-4">
                {analysis.roadmap.milestones?.map((m: any, i: number) => (
                  <div key={i} className="relative pl-6">
                    <div className="absolute -left-2 top-2 w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow-sm" />
                    <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="blue" className="text-xs">
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
                            <span className="text-blue-400 mt-0.5">▸</span>
                            {t}
                          </li>
                        ))}
                      </ul>
                      {m.resources?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {m.resources.slice(0, 3).map((r: any, k: number) =>
                            r.url ? (
                              <a
                                key={k}
                                href={r.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-blue-600 hover:underline"
                              >
                                📚 {r.name}
                              </a>
                            ) : (
                              <span key={k} className="text-xs text-slate-400">
                                📚 {r.name}
                              </span>
                            ),
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Section>
      )}
    </>
  );
}
