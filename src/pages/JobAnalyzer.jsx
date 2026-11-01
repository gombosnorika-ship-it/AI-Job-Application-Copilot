import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Search, Sparkles, Building2, MapPin, DollarSign, Clock, CheckCircle2, AlertTriangle, Briefcase, Zap, Save } from "lucide-react";
import { analyzeJobDescription } from "@/lib/aiService";
import { useApp } from "@/lib/AppContext";

export default function JobAnalyzer() {
  const navigate = useNavigate();
  const { addApplication, resumes } = useApp();
  const [jobText, setJobText] = useState("");
  const [analysis, setAnalysis] = useState(null);

  const handleAnalyze = () => {
    setAnalysis(analyzeJobDescription(jobText));
  };

  const handleSaveApplication = () => {
    const a = analysis;
    addApplication({
      company: a.company, role: a.role, location: "",
      jobDescription: jobText, jobText,
      resumeId: resumes[0]?.id || null, coverLetterId: null, documentIds: [],
      status: "preparing", matchScore: 0,
    });
    navigate("/application-workspace");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Job Description Analyzer</h1>
          <p className="text-sm text-muted-foreground mt-1">Paste a job posting to extract key requirements and insights.</p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700 shrink-0" onClick={() => navigate("/new-application")}><Zap className="w-4 h-4 mr-2" /> Full AI Workflow</Button>
      </div>

      <Card className="p-5">
        <label className="text-sm font-medium mb-2 block">Paste Job Description</label>
        <Textarea placeholder="Paste the full job description here..." className="min-h-[160px] resize-none text-sm" value={jobText} onChange={(e) => setJobText(e.target.value)} />
        <div className="flex items-center justify-between mt-4">
          <p className="text-xs text-muted-foreground">{jobText.length} characters</p>
          <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={handleAnalyze} disabled={jobText.length < 20}><Search className="w-4 h-4 mr-2" /> Analyze Job</Button>
        </div>
      </Card>

      {analysis ? (
        <div className="space-y-4">
          <Card className="p-5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0"><Building2 className="w-6 h-6" /></div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{analysis.role}</h3>
                <p className="text-sm text-muted-foreground">{analysis.company}</p>
                <div className="flex flex-wrap gap-3 mt-3">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><Briefcase className="w-3.5 h-3.5" /> Full-time</div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><Clock className="w-3.5 h-3.5" /> Experience required</div>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={handleSaveApplication}><Save className="w-3.5 h-3.5 mr-1.5" /> Save as Application</Button>
            </div>
          </Card>

          <div className="grid md:grid-cols-2 gap-4">
            <Card className="p-5">
              <h3 className="font-semibold text-sm mb-3 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {analysis.skills.length > 0 ? analysis.skills.map(skill => <Badge key={skill} variant="secondary" className="text-xs font-medium">{skill}</Badge>) : <p className="text-xs text-muted-foreground">No skills detected.</p>}
              </div>
            </Card>
            <Card className="p-5">
              <h3 className="font-semibold text-sm mb-3 flex items-center gap-2"><Sparkles className="w-4 h-4 text-amber-500" /> Keywords Found</h3>
              <div className="flex flex-wrap gap-2">
                {analysis.skills.slice(0, 8).map(skill => <Badge key={skill} variant="outline" className="text-xs font-medium">{skill}</Badge>)}
                {analysis.skills.length === 0 && <p className="text-xs text-muted-foreground">No keywords detected.</p>}
              </div>
            </Card>
          </div>

          {analysis.requirements.length > 0 && (
            <Card className="p-5">
              <h3 className="font-semibold text-sm mb-3">Key Requirements Extracted</h3>
              <div className="space-y-2.5">
                {analysis.requirements.map((req, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">{i + 1}</div>
                    <p className="text-sm text-muted-foreground">{req}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {analysis.warnings.length > 0 && (
            <Card className="p-5 border-amber-200 bg-amber-50/30">
              <h3 className="font-semibold text-sm mb-2 flex items-center gap-2 text-amber-700"><AlertTriangle className="w-4 h-4" /> Watch Out For</h3>
              <ul className="space-y-1.5">
                {analysis.warnings.map((w, i) => <li key={i} className="text-sm text-amber-700/80 flex items-start gap-2"><span className="text-amber-500 mt-1">•</span> {w}</li>)}
              </ul>
            </Card>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4"><Search className="w-7 h-7 text-slate-400" /></div>
          <h3 className="font-semibold text-slate-600">No job analyzed yet</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm">Paste a job description above and click Analyze to get AI-powered insights.</p>
        </div>
      )}
    </div>
  );
}