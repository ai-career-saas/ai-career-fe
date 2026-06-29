"use client";

import { useRef, useState } from "react";
import {
  BookOpen, Brain, ChevronDown, ChevronUp, Clock,
  FileText, Lightbulb, MessageSquare, Plus, RefreshCw,
  Sparkles, Target, X,
} from "lucide-react";
import {
  Alert, Badge, Button, Card, SectionHeader, Spinner, Textarea,
} from "@/components/ui";
import { aiApi } from "@/lib/api";
import { InterviewQuestion, InterviewQuestionSet } from "@/types";
import { cn } from "@/utils/cn";

/* ── helpers ───────────────────────────────────────────────────────── */
const CATEGORY_META: Record<string, { label: string; color: string; bg: string }> = {
  technical:    { label: "Technical",    color: "text-blue-700",   bg: "bg-blue-50 border-blue-200"   },
  behavioral:   { label: "Behavioral",   color: "text-purple-700", bg: "bg-purple-50 border-purple-200" },
  situational:  { label: "Situational",  color: "text-orange-700", bg: "bg-orange-50 border-orange-200" },
  culture_fit:  { label: "Culture Fit",  color: "text-green-700",  bg: "bg-green-50 border-green-200"  },
};

const DIFFICULTY_BADGE: Record<string, string> = {
  easy:   "bg-green-100 text-green-700 border-green-200",
  medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
  hard:   "bg-red-100 text-red-700 border-red-200",
};

/* ── Question Card ─────────────────────────────────────────────────── */
function QuestionCard({ q, index }: { q: InterviewQuestion; index: number }) {
  const [open, setOpen] = useState(index === 0);
  const meta = CATEGORY_META[q.category] || CATEGORY_META.technical;

  return (
    <div className={cn("rounded-2xl border overflow-hidden", meta.bg)}>
      {/* Header */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start gap-3 p-4 text-left hover:bg-white/50 transition-colors"
      >
        <span className="w-7 h-7 rounded-full bg-white border border-current/20 flex items-center justify-center text-xs font-bold text-slate-500 shrink-0 mt-0.5">
          {index + 1}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full border", meta.bg, meta.color)}>
              {meta.label}
            </span>
            <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full border", DIFFICULTY_BADGE[q.difficulty])}>
              {q.difficulty}
            </span>
          </div>
          <p className="text-sm font-semibold text-slate-800 leading-snug">{q.question}</p>
        </div>
        {open
          ? <ChevronUp size={16} className="text-slate-400 shrink-0 mt-1" />
          : <ChevronDown size={16} className="text-slate-400 shrink-0 mt-1" />
        }
      </button>

      {/* Body */}
      {open && (
        <div className="px-4 pb-4 space-y-4 border-t border-white/60">
          {/* Why asked */}
          <div className="pt-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-1.5">
              <Brain size={12} /> ทำไมถึงถาม
            </div>
            <p className="text-sm text-slate-700 bg-white/70 rounded-xl px-3 py-2">{q.why_asked}</p>
          </div>

          {/* Key points */}
          {q.key_points?.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-1.5">
                <Target size={12} /> สิ่งที่ควรพูดถึง
              </div>
              <ul className="space-y-1">
                {q.key_points.map((p, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                    <span className="text-blue-500 mt-0.5 shrink-0">▸</span>{p}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Answer tip */}
          <div className="bg-white/80 rounded-xl p-3 border border-white">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-1.5">
              <Lightbulb size={12} className="text-yellow-500" /> เคล็ดลับการตอบ
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">{q.sample_answer_tip}</p>
          </div>

          {/* Follow-up */}
          {q.follow_up && (
            <div className="flex items-start gap-2 text-xs text-slate-500 bg-white/50 rounded-xl px-3 py-2">
              <MessageSquare size={12} className="mt-0.5 shrink-0 text-slate-400" />
              <span><strong>Follow-up:</strong> {q.follow_up}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Main Page ─────────────────────────────────────────────────────── */
export default function InterviewPrepPage() {
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    targetRole: "",
    jobDescription: "",
    experienceLevel: "mid" as "junior" | "mid" | "senior",
  });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<InterviewQuestionSet | null>(null);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const handleGenerate = async () => {
    if (!form.targetRole.trim()) return;
    setError(""); setResult(null); setLoading(true);

    const fd = new FormData();
    fd.append("target_role", form.targetRole);
    fd.append("job_description", form.jobDescription);
    fd.append("experience_level", form.experienceLevel);
    if (file) fd.append("resume_file", file);

    try {
      const { data } = await aiApi.generateInterview(fd);
      setResult(data);
    } catch (e: any) {
      setError(e.response?.data?.message || "Failed to generate questions");
    } finally {
      setLoading(false);
    }
  };

  const filtered =
    activeFilter === "all"
      ? result?.questions ?? []
      : result?.questions.filter((q) => q.category === activeFilter) ?? [];

  const categories = result
    ? ["all", ...Array.from(new Set(result.questions.map((q) => q.category)))]
    : [];

  return (
    <div className="space-y-6 animate-fade-in">
      <SectionHeader
        title="Interview Prep"
        subtitle="Generate tailored interview questions for any role."
        icon={<MessageSquare size={18} />}
      />

      {/* Input Card */}
      <Card className="p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Target Role */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">
              Target Role <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.targetRole}
              onChange={(e) => setForm({ ...form, targetRole: e.target.value })}
              placeholder="e.g. Senior Backend Developer"
              className="rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          {/* Experience Level */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">Experience Level</label>
            <div className="flex gap-2">
              {(["junior", "mid", "senior"] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setForm({ ...form, experienceLevel: lvl })}
                  className={cn(
                    "flex-1 py-2.5 rounded-xl text-sm font-medium border transition-all capitalize",
                    form.experienceLevel === lvl
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-slate-600 border-slate-300 hover:border-blue-300"
                  )}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Job Description */}
        <Textarea
          label="Job Description (optional — improves question quality)"
          placeholder="Paste the job description here..."
          rows={4}
          value={form.jobDescription}
          onChange={(e) => setForm({ ...form, jobDescription: e.target.value })}
        />

        {/* Resume upload */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">Resume (optional)</label>
          {file ? (
            <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-green-300 bg-green-50">
              <FileText size={16} className="text-green-600 shrink-0" />
              <span className="text-sm text-green-700 flex-1 truncate">{file.name}</span>
              <button onClick={() => setFile(null)}>
                <X size={14} className="text-green-500 hover:text-green-700" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => fileRef.current?.click()}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-dashed border-slate-300 text-sm text-slate-500 hover:border-blue-400 hover:text-blue-600 transition-colors w-fit"
            >
              <Plus size={16} /> Upload Resume (PDF/DOCX)
            </button>
          )}
          <input
            ref={fileRef} type="file" accept=".pdf,.docx" className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
        </div>

        <Button
          onClick={handleGenerate}
          loading={loading}
          disabled={!form.targetRole.trim()}
          size="lg"
          icon={<Sparkles size={16} />}
        >
          Generate Questions
        </Button>
      </Card>

      {error && <Alert variant="error">{error}</Alert>}

      {loading && (
        <Card className="p-8 flex flex-col items-center gap-3">
          <Spinner size={32} />
          <p className="text-sm text-slate-500">Generating tailored questions…</p>
        </Card>
      )}

      {/* Results */}
      {result && !loading && (
        <div className="space-y-4 animate-fade-in">
          {/* Summary banner */}
          <Card className="p-5 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-600 flex items-center justify-center shrink-0">
                <MessageSquare size={16} className="text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">
                  {result.total_questions} Questions for {result.target_role}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 capitalize">
                  {result.experience_level} level · {categories.slice(1).map(c => CATEGORY_META[c]?.label).join(", ")}
                </p>
              </div>
              <button
                onClick={handleGenerate}
                className="ml-auto p-2 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                title="Regenerate"
              >
                <RefreshCw size={16} />
              </button>
            </div>
          </Card>

          {/* Category filter */}
          {categories.length > 2 && (
            <div className="flex gap-2 flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={cn(
                    "px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all capitalize",
                    activeFilter === cat
                      ? "bg-slate-800 text-white border-slate-800"
                      : "bg-white text-slate-600 border-slate-300 hover:border-slate-400"
                  )}
                >
                  {cat === "all" ? `All (${result.questions.length})` : CATEGORY_META[cat]?.label || cat}
                </button>
              ))}
            </div>
          )}

          {/* Questions */}
          <div className="space-y-3">
            {filtered.map((q, i) => (
              <QuestionCard key={q.id} q={q} index={i} />
            ))}
          </div>

          {/* Prep tips */}
          {result.preparation_tips?.length > 0 && (
            <Card className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen size={16} className="text-blue-600" />
                <h3 className="font-semibold text-slate-800">Preparation Tips</h3>
              </div>
              <ul className="space-y-2">
                {result.preparation_tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                    <span className="text-blue-400 mt-0.5 shrink-0">•</span>{tip}
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {/* Overall advice */}
          {result.overall_advice && (
            <Card className="p-5 bg-amber-50 border-amber-200">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb size={16} className="text-amber-600" />
                <h3 className="font-semibold text-slate-800">Overall Advice</h3>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">{result.overall_advice}</p>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
