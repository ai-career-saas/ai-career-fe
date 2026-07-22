"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { NearReachCareer } from "@/types";
import { client } from "@/utils/api/client";
import { useSkillUpgradeStore } from "@/utils/store/skillUpgradeStore";
import { TrendingUp, Zap, Loader2, Clock } from "lucide-react";
import { useState } from "react";
import { Button } from "../../../../../components/ui";

export interface SkillUpgradePlan {
  target_career: string;
  current_coverage: number;
  gap_analysis: Array<{
    skill: string;
    current_level: string;
    required_level: string;
    importance: string;
    reason: string;
    learn_time: string;
    resources: Array<{ name: string; url: string; type: string; cost: string }>;
  }>;
  learning_roadmap: Array<{
    phase: string;
    focus: string;
    skills: string[];
    milestone: string;
  }>;
  total_time: string;
  salary_increase: string;
  motivation: string;
}

export const importanceColors: Record<string, string> = {
  critical: "bg-red-100 text-red-700",
  important: "bg-yellow-100 text-yellow-700",
  "nice-to-have": "bg-gray-100 text-gray-600",
};

export default function SkillUpgradePanel({
  career,
  onClose,
  planCache,
  setPlanCache,
}: {
  career: NearReachCareer;
  onClose: () => void;
  planCache: { [key: string]: SkillUpgradePlan };
  setPlanCache: (cache: { [key: string]: SkillUpgradePlan }) => void;
}) {
  const { isOpen, close } = useSkillUpgradeStore();

  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<SkillUpgradePlan | null>(null);

  const fetchPlan = async () => {
    if (planCache[career.title]) {
      setPlan(planCache[career.title]);
      return;
    }

    setLoading(true);

    try {
      const result = await client
        .POST("/ai/skill-upgrade", {
          body: {
            careerTitle: career.title,
          },
        })
        .then((res) => res.data! as SkillUpgradePlan);

      if (result) {
        setPlanCache({
          ...planCache,
          [career.title]: result,
        });
        setPlan(result);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      close();
      onClose();
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-950/55 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 flex max-h-[85vh] w-[min(92vw,600px)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-3xl bg-white p-0 shadow-2xl outline-none">
          {/* Header */}
          <div className="sticky top-0 flex shrink-0 items-center justify-between border-b border-gray-100 bg-white p-4">
            <div>
              <Dialog.Title className="text-lg font-semibold text-slate-900">
                Skill Upgrade Plan
              </Dialog.Title>
              <Dialog.Description className="m-0! text-sm text-brand-600">
                {career.title}
              </Dialog.Description>
            </div>

            <Dialog.Close>
              <button
                aria-label="Close"
                className="text-lg text-gray-400 transition-colors hover:text-gray-600"
              >
                ✕
              </button>
            </Dialog.Close>
          </div>

          <div className="space-y-4 overflow-y-auto p-4">
            {!plan && !loading && (
              <div>
                <div className="bg-brand-50 rounded-xl p-3">
                  <p className="text-sm text-brand-800 font-medium mb-1">
                    Currently at {career.current_coverage}% skill match for this
                    role
                  </p>
                  <p className="text-xs text-gray-600">
                    ~{career.total_upskill_time} of upskilling to close the gap
                  </p>
                  <div className="flex items-center gap-1.5 mt-1 text-xs text-green-600">
                    <TrendingUp size={12} />
                    {career.salary_range}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-semibold text-gray-700">
                    Skills to add
                  </p>
                  {career.missing_skills?.map((s, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between text-xs bg-gray-50 rounded-xl p-2.5"
                    >
                      <span className="font-medium text-gray-700">
                        {s.skill}
                      </span>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded-full font-medium ${
                            importanceColors[s.importance] ||
                            importanceColors["nice-to-have"]
                          }`}
                        >
                          {s.importance}
                        </span>
                        <span className="text-gray-400">{s.learn_time}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-center mt-4">
                  <Button onClick={() => fetchPlan()}>
                    <Zap size={16} />
                    See detailed upgrade plan
                  </Button>
                </div>
              </div>
            )}

            {loading && (
              <div className="flex flex-col items-center py-8 gap-3">
                <Loader2 size={28} className="animate-spin text-brand-500" />
                <p className="text-sm text-gray-500">Building your plan...</p>
              </div>
            )}

            {plan && (
              <div className="space-y-4">
                {/* Gap analysis */}
                <div>
                  <p className="text-xs font-semibold text-gray-700 mb-2">
                    📚 Skills to learn
                  </p>
                  <div className="space-y-2">
                    {plan.gap_analysis?.map((gap, i) => (
                      <div
                        key={i}
                        className="bg-gray-50 rounded-xl p-3 border border-gray-100"
                      >
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="font-medium text-sm text-gray-800">
                            {gap.skill}
                          </span>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                              importanceColors[gap.importance] ||
                              importanceColors["nice-to-have"]
                            }`}
                          >
                            {gap.importance}
                          </span>
                          <span className="text-xs text-gray-400 flex items-center gap-0.5 ml-auto">
                            <Clock size={11} /> {gap.learn_time}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mb-2">
                          {gap.reason}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {gap.resources?.slice(0, 2).map((r, j) => (
                            <a
                              key={j}
                              href={r.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs bg-white border border-brand-200 text-brand-600 px-2 py-0.5 rounded-full hover:bg-brand-50 transition-colors"
                            >
                              {r.cost === "free" ? "🆓" : "💳"} {r.name}
                            </a>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Roadmap */}
                <div>
                  <p className="text-xs font-semibold text-gray-700 mb-2">
                    🗺 Learning roadmap
                  </p>
                  <div className="relative">
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-brand-100" />
                    <div className="space-y-3">
                      {plan.learning_roadmap?.map((phase, i) => (
                        <div key={i} className="relative pl-10">
                          <div className="absolute left-2 top-1 w-4 h-4 rounded-full bg-brand-500 border-2 border-white shadow" />
                          <div className="bg-white rounded-xl border border-gray-100 p-3">
                            <p className="text-xs font-semibold text-brand-600 bg-brand-50 inline-block px-2 py-0.5 rounded-full mb-1">
                              {phase.phase}
                            </p>
                            <p className="text-xs text-gray-600">
                              {phase.focus}
                            </p>
                            <p className="text-xs text-green-600 mt-1">
                              ✓ {phase.milestone}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-linear-to-r from-green-50 to-brand-50 rounded-xl p-3">
                  <p className="text-xs font-semibold text-gray-700">
                    ⏱ Total time: {plan.total_time}
                  </p>
                  {/* <p className="text-xs text-green-700 mt-0.5">
                  💰 {plan.salary_increase}
                </p> */}
                  {/* <p className="text-xs text-gray-600 mt-1 italic">
                  {plan.motivation}
                </p> */}
                </div>
              </div>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
