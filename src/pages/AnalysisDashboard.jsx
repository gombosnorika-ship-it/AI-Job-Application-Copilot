import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Target, FileCheck, Zap, Download, ArrowLeft } from "lucide-react";
import ScoreCard from "@/components/analysis/ScoreCard";
import SkillsSection from "@/components/analysis/SkillsSection";
import ComparisonView from "@/components/analysis/ComparisonView";
import SuggestionsSection from "@/components/analysis/SuggestionsSection";
import StrengthsWeaknesses from "@/components/analysis/StrengthsWeaknesses";
import NextSteps from "@/components/analysis/NextSteps";
import ExportCenter from "@/components/analysis/ExportCenter";
import AnalysisLoading from "@/components/analysis/AnalysisLoading";
import { useApp } from "@/lib/AppContext";
import { calculateMatchScore, calculateATSScore, calculateResumeStrength, getResumeText, generateCoverLetter } from "@/lib/aiService";
import { downloadResumePDF, downloadCoverLetterPDF, downloadApplicationPackage } from "@/lib/exportService";

export default function AnalysisDashboard() {
  const navigate = useNavigate();
  const { applications, resumes, documents, settings } = useApp();
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const exportRef = useRef(null);

  const app = applications[0];
  const resume = app ? resumes.find(r => r.id === app.resumeId) : null;
  const resumeText = resume ? getResumeText(resume) : "";
  const jobText = app?.jobText || app?.jobDescription || "";

  const analysis = useMemo(() => {
    if (!resume || !jobText) return null;
    const match = calculateMatchScore(resumeText, jobText);
    const ats = calculateATSScore(resumeText);
    const strength = calculateResumeStrength(resumeText);
    const coverLetterText = generateCoverLetter(resume, jobText, settings);
    return { match, ats, strength, coverLetterText };
  }, [resume, resumeText, jobText, settings]);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) { clearInterval(interval); setTimeout(() => setLoading(false), 500); return 100; }
        return prev + 2;
      });
    }, 60);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <AnalysisLoading progress={progress} />;

  if (!app || !resume) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">AI Analysis Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Comprehensive analysis of your application against the job description</p>
        </div>
        <div className="text-center py-16">
          <Target className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="font-semibold text-sm">No application to analyze</h3>
          <p className="text-sm text-muted-foreground mt-1 mb-4">Create a new application first to run the AI analysis.</p>
          <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={() => navigate("/new-application")}>New Application</Button>
        </div>
      </div>
    );
  }

  const scrollToExport = () => exportRef.current?.scrollIntoView({ behavior: "smooth" });
  const matchScore = analysis?.match?.score || 0;

  const handleDownloadResume = () => downloadResumePDF(resume);
  const handleDownloadCoverLetter = () => analysis && downloadCoverLetterPDF(analysis.coverLetterText, `Cover_Letter_${app.company}`);
  const handleDownloadPackage = () => downloadApplicationPackage(app, resume, analysis?.coverLetterText);

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">AI Analysis Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">{app.role} at {app.company} — Match Score: {matchScore}%</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => navigate("/application-workspace")}><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={scrollToExport}><Download className="w-4 h-4 mr-2" /> Export</Button>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <ScoreCard title="Overall Match Score" score={matchScore} color="indigo" icon={Target} description="How well you match the role" />
        <ScoreCard title="ATS Compatibility" score={analysis?.ats || 0} color="emerald" icon={FileCheck} description="Resume parsing compatibility" />
        <ScoreCard title="Resume Strength" score={analysis?.strength || 0} color="amber" icon={Zap} description="Content quality & impact" />
      </div>

      <SkillsSection matchData={analysis?.match} jobText={jobText} />
      <ComparisonView resume={resume} jobText={jobText} />
      <SuggestionsSection resumeText={resumeText} jobText={jobText} />
      <StrengthsWeaknesses matchData={analysis?.match} resumeText={resumeText} />
      <NextSteps />

      <div ref={exportRef}>
        <ExportCenter onDownloadResume={handleDownloadResume} onDownloadCoverLetter={handleDownloadCoverLetter} onDownloadPackage={handleDownloadPackage} />
      </div>
    </div>
  );
}