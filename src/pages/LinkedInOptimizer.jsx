import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Linkedin, Lightbulb, User, Briefcase, GraduationCap, MessageSquare, Star } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import AnalysisInput from "@/components/analysis/AnalysisInput";
import { useApp } from "@/lib/AppContext";
import { generateLinkedInSuggestions, getResumeText } from "@/lib/aiService";

const sectionIcons = { Headline: User, "About Section": MessageSquare, Experience: Briefcase, "Skills & Endorsements": Star, Education: GraduationCap };

export default function LinkedInOptimizer() {
  const { resumes } = useApp();
  const [selectedResume, setSelectedResume] = useState(resumes[0]?.id || "");
  const [jobText, setJobText] = useState("");
  const [analyzed, setAnalyzed] = useState(false);

  const resume = resumes.find(r => r.id === selectedResume);
  const resumeText = resume ? getResumeText(resume) : "";
  const sections = generateLinkedInSuggestions(resumeText, jobText);
  const overallScore = Math.round(sections.reduce((s, sec) => s + sec.score, 0) / sections.length);

  const keywordSuggestions = [
    { keyword: "Frontend Architecture", priority: "high" },
    { keyword: "React.js", priority: "high" },
    { keyword: "TypeScript", priority: "high" },
    { keyword: "Design Systems", priority: "medium" },
    { keyword: "Performance Optimization", priority: "medium" },
    { keyword: "Agile Development", priority: "low" },
    { keyword: "Cross-functional Collaboration", priority: "low" },
  ];
  const priorityConfig = { high: "bg-red-50 text-red-700 border-red-200", medium: "bg-amber-50 text-amber-700 border-amber-200", low: "bg-slate-50 text-slate-600 border-slate-200" };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">LinkedIn Profile Optimizer</h1>
          <p className="text-sm text-muted-foreground mt-1">Improve your LinkedIn profile to attract recruiters.</p>
        </div>
        <Button className="bg-[#0A66C2] hover:bg-[#004182]" onClick={() => toast({ title: "Coming soon", description: "LinkedIn integration will be available in a future update." })}><Linkedin className="w-4 h-4 mr-2" /> Connect LinkedIn</Button>
      </div>

      <AnalysisInput onResumeChange={setSelectedResume} onJobChange={setJobText} onAnalyze={() => setAnalyzed(true)} selectedResume={selectedResume} jobText={jobText} ctaLabel="Analyze Profile" />

      {analyzed && resume ? (
        <>
          <Card className="p-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative w-32 h-32 shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="#f1f5f9" strokeWidth="10" />
                  <circle cx="60" cy="60" r="50" fill="none" stroke="#0A66C2" strokeWidth="10" strokeDasharray={`${(overallScore / 100) * 314} 314`} strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-extrabold text-[#0A66C2]">{overallScore}%</span>
                  <span className="text-[10px] text-muted-foreground font-medium">Profile Score</span>
                </div>
              </div>
              <div className="text-center sm:text-left">
                <h2 className="text-lg font-bold">{overallScore >= 75 ? "Good profile" : overallScore >= 50 ? "Needs improvement" : "Significant work needed"}</h2>
                <p className="text-sm text-muted-foreground mt-1 max-w-lg leading-relaxed">
                  {overallScore >= 75 ? "Your LinkedIn profile is in good shape. A few tweaks could make it even better." : "Your LinkedIn profile needs attention. Implementing the suggestions below could boost your visibility by up to 40%."}
                </p>
              </div>
            </div>
          </Card>

          <div className="space-y-3">
            <h3 className="font-semibold text-sm">Section Analysis</h3>
            {sections.map(section => {
              const Icon = sectionIcons[section.name] || User;
              return (
                <Card key={section.name} className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${section.score >= 80 ? "bg-emerald-50 text-emerald-600" : section.score >= 60 ? "bg-amber-50 text-amber-600" : "bg-red-50 text-red-600"}`}><Icon className="w-4 h-4" /></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-sm">{section.name}</h4>
                        <span className={`text-xs font-bold ${section.score >= 80 ? "text-emerald-600" : section.score >= 60 ? "text-amber-600" : "text-red-500"}`}>{section.score}%</span>
                      </div>
                      <Progress value={section.score} className="h-1.5 mb-2" />
                      <p className="text-xs text-muted-foreground leading-relaxed">{section.suggestion}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          <Card className="p-5">
            <h3 className="font-semibold text-sm mb-3 flex items-center gap-2"><Lightbulb className="w-4 h-4 text-amber-500" /> Recommended Keywords</h3>
            <p className="text-xs text-muted-foreground mb-4">Add these keywords to improve discoverability by recruiters.</p>
            <div className="flex flex-wrap gap-2">
              {keywordSuggestions.map(kw => <Badge key={kw.keyword} variant="outline" className={`text-xs font-medium cursor-pointer hover:shadow-sm transition ${priorityConfig[kw.priority]}`}>{kw.keyword}</Badge>)}
            </div>
          </Card>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4"><Linkedin className="w-7 h-7 text-slate-400" /></div>
          <h3 className="font-semibold text-slate-600">Select a resume to analyze</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm">Choose a resume and optionally paste a job description, then click Analyze Profile.</p>
        </div>
      )}
    </div>
  );
}