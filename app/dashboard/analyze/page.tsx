"use client";

import { useCallback, useRef, useState } from "react";
import {
  ChevronDown, ChevronUp, Clock, FileText, Loader2,
  Map, Plus, Sparkles, Target, TrendingUp, X,
} from "lucide-react";
import {
  Button, Card, SectionHeader, Badge, Alert, Textarea,
} from "@/components/ui";
import { aiApi } from "@/lib/api";
import { cn } from "@/utils/cn";

/* ── tiny local sub-components ─────────────────────────────────────── */
function Section({ title, icon, children, defaultOpen = true }: {
  title: string; icon: React.ReactNode; children: React.ReactNode; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Card className="overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-2 font-semibold text-slate-700 text-sm">
          {icon} {title}
        </div>
        {open ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
      </button>
      {open && <div className="px-4 pb-4 border-t border-slate-100">{children}</div>}
    </Card>
  );
}

const IMPORTANCE_COLOR: Record<string, string> = {
  critical:     "bg-red-100 text-red-700 border-red-200",
  important:    "bg-yellow-100 text-yellow-700 border-yellow-200",
  "nice-to-have": "bg-green-100 text-green-700 border-green-200",
};

export default function AnalyzePage() {
  const [message, setMessage] = useState("");
  const [careerGoal, setCareerGoal] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("");
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleSubmit = useCallback(async () => {
    if (!message.trim()) return;
    setError(""); setResult(null); setLoading(true);
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
      setLoading(false); setStep("");
    }
  }, [message, careerGoal, file]);

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
            <label className="text-sm font-medium text-slate-700">Career Goal (optional)</label>
            <input
              type="text"
              value={careerGoal}
              onChange={(e) => setCareerGoal(e.target.value)}
              placeholder="e.g. Data Engineer, Full Stack Developer..."
              className="rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">Resume (optional)</label>
            {file ? (
              <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-green-300 bg-green-50">
                <FileText size={16} className="text-green-600 shrink-0" />
                <span className="text-sm text-green-700 truncate flex-1">{file.name}</span>
                <button onClick={() => setFile(null)}><X size={14} className="text-green-500 hover:text-green-700" /></button>
              </div>
            ) : (
              <button
                onClick={() => fileRef.current?.click()}
                className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-dashed border-slate-300 text-sm text-slate-500 hover:border-blue-400 hover:text-blue-600 transition-colors"
              >
                <Plus size={16} /> Upload PDF/DOCX
              </button>
            )}
            <input ref={fileRef} type="file" accept=".pdf,.docx" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
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
          <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 rounded-xl px-4 py-3">
            <Loader2 size={16} className="animate-spin shrink-0" />
            <span>{step}</span>
          </div>
        )}
      </Card>

      {error && <Alert variant="error">{error}</Alert>}

      {/* Results */}
      {result && (
        <div className="space-y-4 animate-fade-in">
          {/* AI Message */}
          <Card className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
                <Sparkles size={14} className="text-white" />
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">{result.message}</p>
            </div>
          </Card>

          {/* Detected Skills */}
          {result.analysis?.detected_skills?.length > 0 && (
            <Section title={`Detected Skills (${result.analysis.detected_skills.length})`} icon={<TrendingUp size={16} />}>
              <div className="flex flex-wrap gap-2 pt-3">
                {result.analysis.detected_skills.map((s: any, i: number) => (
                  <span key={i} className={cn(
                    "px-2.5 py-1 rounded-full text-xs font-medium border",
                    s.level === "advanced" ? "bg-purple-100 text-purple-700 border-purple-200" :
                    s.level === "intermediate" ? "bg-blue-100 text-blue-700 border-blue-200" :
                    "bg-slate-100 text-slate-600 border-slate-200"
                  )}>{s.name}</span>
                ))}
              </div>
            </Section>
          )}

          {/* Skill Gaps */}
          {result.analysis?.skill_gaps?.length > 0 && (
            <Section title={`Skill Gaps (${result.analysis.skill_gaps.length})`} icon={<Target size={16} />}>
              <div className="space-y-2 pt-3">
                {result.analysis.skill_gaps.map((g: any, i: number) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-sm text-slate-800">{g.skill}</span>
                        <span className={cn("px-2 py-0.5 rounded-full text-xs border", IMPORTANCE_COLOR[g.importance] || IMPORTANCE_COLOR["nice-to-have"])}>
                          {g.importance}
                        </span>
                      </div>
                      {g.reason && <p className="text-xs text-slate-500 mt-1">{g.reason}</p>}
                    </div>
                    {g.learn_time && (
                      <span className="text-xs text-slate-400 flex items-center gap-1 shrink-0">
                        <Clock size={12} />{g.learn_time}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Roadmap */}
          {result.analysis?.roadmap && (
            <Section title={`Roadmap: ${result.analysis.roadmap.target_role}`} icon={<Map size={16} />}>
              <div className="space-y-1 pt-3">
                {/* Duration */}
                <div className="flex gap-4 text-xs text-slate-500 mb-4">
                  <span className="flex items-center gap-1"><Clock size={12} />{result.analysis.roadmap.total_duration}</span>
                  {result.analysis.roadmap.daily_commitment && (
                    <span>{result.analysis.roadmap.daily_commitment}/day</span>
                  )}
                </div>
                {/* Milestones */}
                <div className="relative pl-4">
                  <div className="absolute left-1.5 top-0 bottom-0 w-0.5 bg-blue-100" />
                  <div className="space-y-4">
                    {result.analysis.roadmap.milestones?.map((m: any, i: number) => (
                      <div key={i} className="relative pl-6">
                        <div className="absolute -left-2 top-2 w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow-sm" />
                        <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="blue" className="text-xs">{m.week}</Badge>
                            <span className="font-semibold text-sm text-slate-800">{m.title}</span>
                          </div>
                          <ul className="space-y-1">
                            {m.tasks?.map((t: string, j: number) => (
                              <li key={j} className="text-xs text-slate-600 flex items-start gap-2">
                                <span className="text-blue-400 mt-0.5">▸</span>{t}
                              </li>
                            ))}
                          </ul>
                          {m.resources?.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                              {m.resources.slice(0, 3).map((r: any, k: number) => (
                                r.url ? (
                                  <a key={k} href={r.url} target="_blank" rel="noopener noreferrer"
                                    className="text-xs text-blue-600 hover:underline">
                                    📚 {r.name}
                                  </a>
                                ) : (
                                  <span key={k} className="text-xs text-slate-400">📚 {r.name}</span>
                                )
                              ))}
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

          {/* Ready Careers */}
          {result.analysis?.ready_careers?.length > 0 && (
            <Section title={`Ready Careers (${result.analysis.ready_careers.length})`} icon={<TrendingUp size={16} />}>
              <div className="space-y-3 pt-3">
                {result.analysis.ready_careers.map((c: any, i: number) => (
                  <div key={i} className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-semibold text-slate-800">{c.title}</h4>
                      <span className="text-green-700 font-bold text-sm">{c.match_score}%</span>
                    </div>
                    {c.salary_range && <p className="text-sm text-green-700 mt-1">💰 {c.salary_range}</p>}
                    {c.description && <p className="text-xs text-slate-600 mt-2">{c.description}</p>}
                  </div>
                ))}
              </div>
            </Section>
          )}
        </div>
      )}
    </div>
  );
}
