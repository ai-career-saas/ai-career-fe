"use client";

import { useRef, useState } from "react";
import {
  AlertTriangle, CheckCircle, FileText, Plus,
  RefreshCw, Sparkles, Target, TrendingUp, X, XCircle,
} from "lucide-react";
import {
  Alert, Badge, Button, Card, ProgressBar,
  SectionHeader, Spinner, Textarea,
} from "@/components/ui";
import { aiApi } from "@/lib/api";
import { ATSScoreResult } from "@/types";
import { cn } from "@/utils/cn";

/* ── Score Ring ────────────────────────────────────────────────────── */
function ScoreRing({ score, grade }: { score: number; grade: string }) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const color =
    score >= 70 ? "#16a34a" :
    score >= 50 ? "#d97706" :
    "#dc2626";

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="128" height="128" className="-rotate-90">
        <circle cx="64" cy="64" r={radius} stroke="#e2e8f0" strokeWidth="10" fill="none" />
        <circle
          cx="64" cy="64" r={radius}
          stroke={color} strokeWidth="10" fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: "stroke-dashoffset 1s ease" }}
        />
      </svg>
      <div className="absolute text-center">
        <div className="text-3xl font-bold text-slate-900">{score}</div>
        <div className="text-lg font-bold" style={{ color }}>{grade}</div>
      </div>
    </div>
  );
}

/* ── Keyword Chip ──────────────────────────────────────────────────── */
function KeywordChip({ keyword, found, importance }: {
  keyword: string; found: boolean; importance: string;
}) {
  return (
    <div className={cn(
      "flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-medium",
      found
        ? "bg-green-50 border-green-200 text-green-800"
        : importance === "critical"
          ? "bg-red-50 border-red-200 text-red-800"
          : "bg-slate-50 border-slate-200 text-slate-600"
    )}>
      {found
        ? <CheckCircle size={11} className="text-green-600 shrink-0" />
        : <XCircle size={11} className={cn("shrink-0", importance === "critical" ? "text-red-500" : "text-slate-400")} />
      }
      {keyword}
    </div>
  );
}

/* ── Section Score ─────────────────────────────────────────────────── */
function SectionScore({ section, score, feedback, issues }: {
  section: string; score: number; feedback: string; issues: string[];
}) {
  const [open, setOpen] = useState(false);
  const colorClass =
    score >= 70 ? "bg-green-500" :
    score >= 50 ? "bg-yellow-500" :
    "bg-red-500";

  const label = section.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="bg-slate-50 rounded-xl p-3">
      <div className="flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-sm font-medium text-slate-700">{label}</span>
            <span className="text-sm font-bold text-slate-900">{score}%</span>
          </div>
          <ProgressBar value={score} colorClass={colorClass} />
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="text-slate-400 hover:text-slate-600 shrink-0 p-1"
        >
          {open ? <X size={14} /> : <Plus size={14} />}
        </button>
      </div>
      {open && (
        <div className="mt-3 space-y-1.5">
          {feedback && <p className="text-xs text-slate-600">{feedback}</p>}
          {issues?.map((issue, i) => (
            <div key={i} className="flex items-start gap-1.5 text-xs text-red-700">
              <AlertTriangle size={11} className="mt-0.5 shrink-0" />
              {issue}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Main Page ─────────────────────────────────────────────────────── */
export default function ATSScorePage() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [jobDesc, setJobDesc] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ATSScoreResult | null>(null);
  const [error, setError] = useState("");

  const handleScore = async () => {
    if (!file || !jobDesc.trim()) return;
    setError(""); setResult(null); setLoading(true);

    const fd = new FormData();
    fd.append("job_description", jobDesc);
    fd.append("resume_file", file);

    try {
      const { data } = await aiApi.scoreAts(fd);
      setResult(data);
    } catch (e: any) {
      setError(e.response?.data?.message || "ATS scoring failed");
    } finally {
      setLoading(false);
    }
  };

  const passRate = result?.estimated_pass_rate;
  const passRateColor =
    passRate === "สูง" ? "text-green-600" :
    passRate === "ปานกลาง" ? "text-yellow-600" :
    "text-red-600";

  return (
    <div className="space-y-6 animate-fade-in">
      <SectionHeader
        title="ATS Resume Score"
        subtitle="See how well your resume passes through Applicant Tracking Systems."
        icon={<FileText size={18} />}
      />

      {/* Input */}
      <Card className="p-6 space-y-4">
        <Textarea
          label="Job Description *"
          placeholder="Paste the full job description here…"
          rows={6}
          value={jobDesc}
          onChange={(e) => setJobDesc(e.target.value)}
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">
            Resume <span className="text-red-500">*</span>
          </label>
          {file ? (
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-blue-300 bg-blue-50">
              <FileText size={18} className="text-blue-600 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-blue-800 truncate">{file.name}</p>
                <p className="text-xs text-blue-500">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
              <button
                onClick={() => setFile(null)}
                className="p-1.5 rounded-lg text-blue-400 hover:text-blue-700 hover:bg-blue-100 transition-all"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => fileRef.current?.click()}
              className="flex flex-col items-center gap-2 py-8 rounded-xl border-2 border-dashed border-slate-300 text-slate-400 hover:border-blue-400 hover:text-blue-500 transition-all"
            >
              <FileText size={28} />
              <span className="text-sm font-medium">Click to upload resume</span>
              <span className="text-xs">PDF or DOCX, max 10 MB</span>
            </button>
          )}
          <input
            ref={fileRef} type="file" accept=".pdf,.docx" className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
        </div>

        <Button
          onClick={handleScore}
          loading={loading}
          disabled={!file || !jobDesc.trim()}
          size="lg"
          icon={<Sparkles size={16} />}
        >
          Analyze Resume
        </Button>
      </Card>

      {error && <Alert variant="error">{error}</Alert>}

      {loading && (
        <Card className="p-10 flex flex-col items-center gap-3">
          <Spinner size={32} />
          <p className="text-sm text-slate-500">Scanning your resume against ATS criteria…</p>
        </Card>
      )}

      {/* Results */}
      {result && !loading && (
        <div className="space-y-4 animate-fade-in">
          {/* Score Summary */}
          <Card className="p-6">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex flex-col items-center">
                <ScoreRing score={result.overall_score} grade={result.grade} />
                <p className="text-xs text-slate-500 mt-2">ATS Score</p>
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">Score Summary</h3>
                  <p className="text-sm text-slate-600 mt-1 leading-relaxed">{result.summary}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 rounded-xl p-3">
                    <p className="text-xs text-slate-500 mb-1">Keyword Match</p>
                    <p className="text-2xl font-bold text-slate-900">{result.keyword_match_rate}%</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3">
                    <p className="text-xs text-slate-500 mb-1">ATS Pass Rate</p>
                    <p className={cn("text-xl font-bold", passRateColor)}>{result.estimated_pass_rate}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Keywords */}
            <Card className="p-5">
              <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <Target size={16} className="text-blue-600" /> Keyword Analysis
              </h3>

              {result.missing_critical_keywords?.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs font-semibold text-red-600 mb-2">
                    ❌ Missing Critical Keywords ({result.missing_critical_keywords.length})
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {result.missing_critical_keywords.map((kw, i) => (
                      <KeywordChip key={i} keyword={kw} found={false} importance="critical" />
                    ))}
                  </div>
                </div>
              )}

              {result.missing_important_keywords?.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs font-semibold text-yellow-600 mb-2">
                    ⚠️ Missing Important Keywords ({result.missing_important_keywords.length})
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {result.missing_important_keywords.map((kw, i) => (
                      <KeywordChip key={i} keyword={kw} found={false} importance="important" />
                    ))}
                  </div>
                </div>
              )}

              <div>
                <p className="text-xs font-semibold text-green-600 mb-2">
                  ✅ Found Keywords ({result.keyword_matches.filter((k) => k.found).length})
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {result.keyword_matches
                    .filter((k) => k.found)
                    .slice(0, 15)
                    .map((k, i) => (
                      <KeywordChip key={i} keyword={k.keyword} found={true} importance={k.importance} />
                    ))}
                </div>
              </div>
            </Card>

            {/* Section Scores */}
            {result.sections?.length > 0 && (
              <Card className="p-5">
                <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                  <TrendingUp size={16} className="text-purple-600" /> Section Scores
                </h3>
                <div className="space-y-2">
                  {result.sections.map((s, i) => (
                    <SectionScore
                      key={i}
                      section={s.section}
                      score={s.score}
                      feedback={s.feedback}
                      issues={s.issues}
                    />
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Strengths */}
          {result.strengths?.length > 0 && (
            <Card className="p-5">
              <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <CheckCircle size={16} className="text-green-600" /> Strengths
              </h3>
              <ul className="space-y-2">
                {result.strengths.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                    <CheckCircle size={14} className="text-green-500 mt-0.5 shrink-0" /> {s}
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {/* Improvements */}
          {(result.formatting_issues?.length > 0 || result.suggestions?.length > 0) && (
            <Card className="p-5">
              <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <AlertTriangle size={16} className="text-amber-600" /> How to Improve
              </h3>
              <div className="space-y-2">
                {result.formatting_issues?.map((iss, i) => (
                  <div key={`fmt-${i}`} className="flex items-start gap-2 text-sm text-slate-700 bg-red-50 rounded-xl px-3 py-2">
                    <AlertTriangle size={14} className="text-red-500 mt-0.5 shrink-0" /> {iss}
                  </div>
                ))}
                {result.suggestions?.map((sug, i) => (
                  <div key={`sug-${i}`} className="flex items-start gap-2 text-sm text-slate-700 bg-amber-50 rounded-xl px-3 py-2">
                    <span className="text-amber-500 mt-0.5 shrink-0">→</span> {sug}
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Re-analyze */}
          <div className="flex justify-center">
            <Button variant="outline" onClick={handleScore} icon={<RefreshCw size={14} />}>
              Re-analyze
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
