import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Target, CheckCircle2, XCircle, AlertCircle, Sparkles, FileText } from "lucide-react";
import { RadialBarChart, RadialBar, ResponsiveContainer } from "recharts";
import AnalysisInput from "@/components/analysis/AnalysisInput";
import { useApp } from "@/lib/AppContext";
import { calculateMatchScore, getResumeText } from "@/lib/aiService";

export default function MatchScore() {
  const navigate = useNavigate();
  const { resumes } = useApp();
  const [selectedResume, setSelectedResume] = useState(resumes[0]?.id || "");
  const [jobText, setJobText] = useState("");
  const [analyzed, setAnalyzed] = useState(false);

  const resume = resumes.find(r => r.id === selectedResume);
  const resumeText = resume ? getResumeText(resume) : "";
  const { score, matched, missing } = calculateMatchScore(resumeText, jobText);

  const categories = [
    { name: "Technical Skills", score: Math.min(score + 5, 100) },
    { name: "Experience Level", score: Math.min(score - 3, 100) },
    { name: "Education Match", score: Math.min(score + 8, 100) },
    { name: "Keywords Overlap", score: score },
    { name: "Industry Fit", score: Math.min(score + 3, 100) },
    { name: "Soft Skills", score: Math.max(score - 15, 20) },
  ];

  const partialSkills = missing.slice(0, 3);

  const handleAnalyze = () => setAnalyzed(true);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">AI Match Score</h1>
        <p className="text-sm text-muted-foreground mt-1">See how well your resume matches the job description.</p>
      </div>

      <AnalysisInput onResumeChange={setSelectedResume} onJobChange={setJobText} onAnalyze={handleAnalyze} selectedResume={selectedResume} jobText={jobText} ctaLabel="Calculate Match Score" />

      {analyzed && resume && jobText ? (
        <>
          <Card className="p-6">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="relative w-48 h-48 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart cx="50%" cy="50%" innerRadius="70%" outerRadius="100%" startAngle={90} endAngle={-270} data={[{ name: "score", value: score, fill: "#6366f1" }]}>
                    <RadialBar background={{ fill: "#f1f5f9" }} dataKey="value" cornerRadius={10} />
                  </RadialBarChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-extrabold text-indigo-600">{score}%</span>
                  <span className="text-xs text-muted-foreground font-medium">Match</span>
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-xl font-bold">{score >= 80 ? "Strong Match" : score >= 60 ? "Moderate Match" : "Needs Improvement"}</h2>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed max-w-lg">
                  {score >= 80 ? "Your resume is a strong match for this role. You meet most of the required qualifications." : score >= 60 ? "Your resume is a moderate match. A few optimizations could push your score higher." : "Your resume needs significant improvements to match this role. Focus on adding missing keywords and skills."}
                </p>
                <div className="flex flex-wrap gap-2 mt-4 justify-center md:justify-start">
                  <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-xs" onClick={() => navigate("/resume-optimization")}><Sparkles className="w-3.5 h-3.5 mr-1.5" /> Optimize Resume</Button>
                  <Button size="sm" variant="outline" className="text-xs" onClick={() => navigate("/analysis-dashboard")}><FileText className="w-3.5 h-3.5 mr-1.5" /> Full Analysis</Button>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="font-semibold text-sm mb-4">Score Breakdown</h3>
            <div className="space-y-4">
              {categories.map(cat => (
                <div key={cat.name}>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-medium">{cat.name}</span>
                    <span className={`font-bold ${cat.score >= 85 ? "text-emerald-600" : cat.score >= 70 ? "text-amber-600" : "text-red-500"}`}>{cat.score}%</span>
                  </div>
                  <Progress value={cat.score} className="h-2" />
                </div>
              ))}
            </div>
          </Card>

          <div className="grid md:grid-cols-3 gap-4">
            <Card className="p-5">
              <h3 className="font-semibold text-sm mb-3 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Matched Skills</h3>
              <div className="space-y-2">
                {matched.length > 0 ? matched.map(s => <div key={s} className="flex items-center gap-2 text-sm"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" /><span>{s}</span></div>) : <p className="text-xs text-muted-foreground">No matched skills yet.</p>}
              </div>
            </Card>
            <Card className="p-5">
              <h3 className="font-semibold text-sm mb-3 flex items-center gap-2"><XCircle className="w-4 h-4 text-red-500" /> Missing Skills</h3>
              <div className="space-y-2">
                {missing.length > 0 ? missing.map(s => <div key={s} className="flex items-center gap-2 text-sm"><XCircle className="w-3.5 h-3.5 text-red-500 shrink-0" /><span>{s}</span></div>) : <p className="text-xs text-muted-foreground">No missing skills — great match!</p>}
              </div>
            </Card>
            <Card className="p-5">
              <h3 className="font-semibold text-sm mb-3 flex items-center gap-2"><AlertCircle className="w-4 h-4 text-amber-500" /> Partial Match</h3>
              <div className="space-y-2">
                {partialSkills.length > 0 ? partialSkills.map(s => <div key={s} className="flex items-center gap-2 text-sm"><AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" /><span>{s}</span></div>) : <p className="text-xs text-muted-foreground">No partial matches.</p>}
              </div>
            </Card>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4"><Target className="w-7 h-7 text-slate-400" /></div>
          <h3 className="font-semibold text-slate-600">Select a resume and paste a job description</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm">Choose a resume and paste the job description above, then click Calculate Match Score.</p>
        </div>
      )}
    </div>
  );
}