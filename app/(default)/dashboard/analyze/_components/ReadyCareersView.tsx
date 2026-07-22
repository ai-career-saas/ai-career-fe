"use client";

import { NearReachCareer, ReadyCareer } from "@/types";
import {
  ArrowRight,
  CheckCircle,
  ChevronRight,
  Clock,
  Loader2,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { Card } from "../../../../../components/ui";
import SkillUpgradePanel, {
  importanceColors,
  SkillUpgradePlan,
} from "./SkillUpgradePanel";
import { useSkillUpgradeStore } from "@/utils/store/skillUpgradeStore";

interface Props {
  readyCareers: ReadyCareer[];
  nearReachCareers: NearReachCareer[];
}

export default function ReadyCareersView({
  readyCareers,
  nearReachCareers,
}: Props) {
  const { openUpgrade, selectedUpgrade, close, isOpen } =
    useSkillUpgradeStore();
  const [planCache, setPlanCache] = useState<{
    [key: string]: SkillUpgradePlan;
  }>({});

  return (
    <>
      <Card className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <CheckCircle size={16} className="text-green-500" />
          <h3 className="font-semibold text-gray-800 text-sm">
            Ready Careers ({readyCareers?.length || 0})
          </h3>
        </div>
        <div className="space-y-3">
          {(readyCareers || []).map((c, i) => (
            <ReadyCareerCard key={i} career={c} />
          ))}
        </div>
      </Card>

      {/* Near reach careers */}
      {nearReachCareers?.length > 0 && (
        <Card className="p-5 mt-5">
          <div className="flex items-center gap-2 mb-3">
            <ArrowRight size={16} className="text-brand-500" />
            <h3 className="font-semibold text-gray-800 text-sm">
              Near Reach Careers ({nearReachCareers.length})
            </h3>
          </div>
          <div className="space-y-2">
            {nearReachCareers.map((career, i) => (
              <button
                key={i}
                onClick={() => {
                  openUpgrade(career);
                }}
                className="cursor-pointer w-full bg-white border border-gray-100 rounded-2xl p-4 text-left hover:border-brand-300 hover:shadow-sm transition-all group"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-gray-800 text-sm">
                        {career.title}
                      </span>
                      <span className="text-xs text-gray-400">
                        Has skill {career.current_coverage}%
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 max-w-32 bg-gray-100 rounded-full h-1.5">
                        <div
                          className="h-1.5 rounded-full bg-brand-400"
                          style={{ width: `${career.current_coverage}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500">
                        ⏱ {career.total_upskill_time}
                      </span>
                      <span className="text-xs text-green-600">
                        {career.salary_range}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {career.missing_skills?.slice(0, 3).map((s, j) => (
                        <span
                          key={j}
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            importanceColors[s.importance] ||
                            importanceColors["nice-to-have"]
                          }`}
                        >
                          + {s.skill}
                        </span>
                      ))}
                      {(career.missing_skills?.length || 0) > 3 && (
                        <span className="text-xs text-gray-400">
                          +{career.missing_skills.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                  <ChevronRight
                    size={16}
                    className="text-gray-300 group-hover:text-brand-400 shrink-0 transition-colors"
                  />
                </div>
              </button>
            ))}
          </div>
        </Card>
      )}

      {/* Skill upgrade modal */}
      {selectedUpgrade && (
        <SkillUpgradePanel
          career={selectedUpgrade}
          onClose={close}
          planCache={planCache}
          setPlanCache={setPlanCache}
        />
      )}
    </>
  );
}

function ReadyCareerCard({ career }: { career: ReadyCareer }) {
  const [expanded, setExpanded] = useState(false);
  const scoreColor =
    career.match_score >= 85
      ? "text-green-600"
      : career.match_score >= 70
        ? "text-yellow-600"
        : "text-gray-500";

  return (
    <div className="bg-white border border-green-200 rounded-2xl p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <CheckCircle size={16} className="text-green-500 shrink-0" />
            <h3 className="font-bold text-gray-800">{career.title}</h3>
            <span className="text-xs bg-green-100 text-green-700 border border-green-200 px-2 py-0.5 rounded-full font-medium">
              {career.time_to_ready}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">{career.description}</p>
        </div>
        <span className={`text-lg font-bold ${scoreColor} shrink-0`}>
          {career.match_score}%
        </span>
      </div>

      <div className="flex items-center gap-1.5 mt-2 text-sm text-green-700 font-medium">
        <TrendingUp size={14} />
        {career.salary_range}
      </div>

      {/* Matched skills */}
      <div className="flex flex-wrap gap-1 mt-2">
        {career.matched_skills?.slice(0, 6).map((s, i) => (
          <span
            key={i}
            className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full"
          >
            {s}
          </span>
        ))}
      </div>

      {/* Minor gaps */}
      {career.missing_minor?.length > 0 && (
        <p className="text-xs text-gray-400 mt-2">
          ⚡ ต้องเพิ่มเล็กน้อย: {career.missing_minor.join(", ")}
        </p>
      )}

      {expanded && (
        <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
          <p className="text-xs text-gray-600">{career.why_good_fit}</p>
          <div className="flex flex-wrap gap-1">
            {career.typical_companies?.map((c, i) => (
              <span
                key={i}
                className="text-xs bg-white border border-gray-200 px-2 py-0.5 rounded-full text-gray-600"
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={() => setExpanded(!expanded)}
        className="text-xs text-brand-500 hover:text-brand-700 mt-2 flex items-center gap-1"
      >
        {expanded ? "Collapse" : "More Info"}
        <ChevronRight
          size={12}
          className={`transition-transform ${expanded ? "rotate-90" : ""}`}
        />
      </button>
    </div>
  );
}
