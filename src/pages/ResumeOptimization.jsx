import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, CheckCircle2, AlertTriangle, XCircle, Lightbulb, Shield, Type, ArrowRight } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import AnalysisInput from "@/components/analysis/AnalysisInput";
import { useApp } from "@/lib/AppContext";
import { calculateATSScore, calculateMatchScore, generateSuggestions, getResumeText } from "@/lib/aiService";

const typeConfig = {
  critical: { color: "bg-red-50 text-red-700 border-red-200", badge: "Critical", icon: AlertTriangle, bg: "bg-red-50 text-red-600" },
  suggestion: { color: "bg-amber-50 text-amber-700 border-amber-200", badge: "Suggestion", icon: Lightbulb, bg: "bg-amber-50 text-amber-600" },
  improvement: { color: "bg-indigo-50 text-indigo-700 border-indigo-200", badge: "Improvement", icon: Sparkles, bg: "bg-indigo-50 text-indigo-600" },
};

export default function ResumeOptimization() {
  const navigate = useNavigate();
  const { resumes } = useApp();
  const [selectedResume, setSelectedResume] = useState(resumes[0]?.id || "");
  const [jobText, setJobText] = useState("");
  const [analyzed, setAnalyzed] = useState(false);

  const resume = resumes.find(r => r.id === selectedResume);
  const resumeText = resume ? getResumeText(resume) : "";
  const atsScore = calculateATSScore(resumeText);
  const recommendations = generateSuggestions(resumeText, jobText);

  const atsChecks = [
    { label: "Contact information present", passed: /email|phone|@/i.test(resumeText) },
    { label: "Professional summary included", passed: resumeText.length > 50 },
    { label: "Action verbs used in experience", passed: /\b(led|developed|built|created|managed|designed|implemented|launched|improved|increased|reduced|optimized|architected|delivered)\b/i.test(resumeText) },
    { label: "Measurable achievements included", passed: /\d+%|\d+\+|\$[\d,]+|\d+k/i.test(resumeText) },
    { label: "Keywords match job description", passed: jobText ? calculateMatchScore(resumeText, jobText).score >= 60 : false },
    { label: "Sufficient content length", passed: resumeText.length > 200 },
  ];
  const passedChecks = atsChecks.filter(c => c.passed).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Resume Optimization</h1>
          <p className="text-sm text-muted-foreground mt-1">AI-powered recommendations to improve your resume.</p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={() => navigate("/analysis-dashboard")}><Sparkles className="w-4 h-4 mr-2" /> Full Analysis</Button>
      </div>

      <AnalysisInput onResumeChange={setSelectedResume} onJobChange={setJobText} onAnalyze={() => setAnalyzed(true)} selectedResume={selectedResume} jobText={jobText} ctaLabel="Analyze Resume" />

      {analyzed && resume ? (
        <>
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="md:col-span-1 p-6 flex flex-col items-center justify-center text-center">
              <div className="relative w-28 h-28 mb-3">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="#f1f5f9" strokeWidth="10" />
                  <circle cx="60" cy="60" r="50" fill="none" stroke="#6366f1" strokeWidth="10" strokeDasharray={`${(atsScore / 100) * 314} 314`} strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-extrabold text-indigo-600">{atsScore}%</span>
                  <span className="text-[10px] text-muted-foreground font-medium">ATS Score</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">{passedChecks}/{atsChecks.length} checks passed</p>
            </Card>
            <Card className="md:col-span-2 p-5">
              <h3 className="font-semibold text-sm mb-3 flex items-center gap-2"><Shield className="w-4 h-4 text-indigo-500" /> ATS Compatibility Checks</h3>
              <div className="grid sm:grid-cols-2 gap-2">
                {atsChecks.map((check) => (
                  <div key={check.label} className="flex items-center gap-2.5 py-1.5">
                    {check.passed ? <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> : <XCircle className="w-4 h-4 text-red-500 shrink-0" />}
                    <span className="text-xs">{check.label}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div>
            <h3 className="font-semibold text-sm mb-3">Recommendations</h3>
            <div className="space-y-3">
              {recommendations.map((rec, i) => {
                const config = typeConfig[rec.type];
                return (
                  <Card key={i} className="p-4 hover:shadow-sm transition-shadow">
                    <div className="flex items-start gap-3">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${config.bg}`}><config.icon className="w-4 h-4" /></div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1"><h4 className="font-semibold text-sm">{rec.title}</h4><Badge variant="outline" className={`text-[10px] ${config.color}`}>{config.badge}</Badge></div>
                        <p className="text-xs text-muted-foreground leading-relaxed">{rec.detail}</p>
                      </div>
                      <Button variant="ghost" size="sm" className="shrink-0 text-xs text-indigo-600" onClick={() => toast({ title: "Suggestion noted", description: "Apply this suggestion in the Resume Builder to improve your resume." })}>Apply <ArrowRight className="w-3 h-3 ml-1" /></Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4"><Sparkles className="w-7 h-7 text-slate-400" /></div>
          <h3 className="font-semibold text-slate-600">Select a resume to analyze</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm">Choose a resume and optionally paste a job description, then click Analyze Resume.</p>
        </div>
      )}
    </div>
  );
}