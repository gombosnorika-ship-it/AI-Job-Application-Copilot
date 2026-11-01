import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Target, Shield, CheckCircle2, XCircle, AlertTriangle, Lightbulb,
  TrendingUp, TrendingDown, ArrowRight, FileText, PenTool, Linkedin,
  Sparkles, Download, Save, Zap
} from "lucide-react";
import ComparisonView from "./ComparisonView";

const analysisStages = [
  { id: "job", label: "Analyzing job description", icon: FileText },
  { id: "resume", label: "Scanning your resume", icon: FileText },
  { id: "ats", label: "Checking ATS compatibility", icon: Shield },
  { id: "skills", label: "Identifying skill gaps", icon: Target },
  { id: "keywords", label: "Matching keywords", icon: Sparkles },
  { id: "cover", label: "Reviewing cover letter", icon: PenTool },
  { id: "linkedin", label: "Analyzing LinkedIn profile", icon: Linkedin },
  { id: "optimize", label: "Generating optimized versions", icon: Zap },
];

export function AnalysisLoader({ progress, currentStageIndex }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative w-24 h-24 mb-6">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="42" fill="none" stroke="#f1f5f9" strokeWidth="8" />
          <circle
            cx="50" cy="50" r="42" fill="none" stroke="#6366f1" strokeWidth="8"
            strokeDasharray={`${(progress / 100) * 264} 264`}
            strokeLinecap="round"
            className="transition-all duration-300"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-bold text-indigo-600">{progress}%</span>
        </div>
      </div>
      <h3 className="font-semibold text-base mb-1">AI Analysis in Progress</h3>
      <p className="text-sm text-muted-foreground mb-6">This may take a few moments...</p>

      <div className="w-full max-w-md space-y-2.5">
        {analysisStages.map((stage, i) => {
          const done = i < currentStageIndex;
          const current = i === currentStageIndex;
          return (
            <div
              key={stage.id}
              className={`flex items-center gap-3 p-2.5 rounded-lg transition-all duration-300 ${
                current ? "bg-indigo-50" : ""
              }`}
            >
              <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition ${
                done ? "bg-emerald-500 text-white" : current ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-400"
              }`}>
                {done ? <CheckCircle2 className="w-4 h-4" /> : current ? (
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : <stage.icon className="w-3.5 h-3.5" />}
              </div>
              <span className={`text-sm ${done ? "text-muted-foreground line-through" : current ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                {stage.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function AnalysisResults() {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "Overview", icon: Target },
    { id: "resume", label: "Resume", icon: FileText },
    { id: "cover", label: "Cover Letter", icon: PenTool },
    { id: "linkedin", label: "LinkedIn", icon: Linkedin },
    { id: "next", label: "Next Steps", icon: ArrowRight },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs">
              <CheckCircle2 className="w-3 h-3 mr-1" /> Analysis Complete
            </Badge>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Analysis Results</h1>
          <p className="text-sm text-muted-foreground mt-1">Senior Frontend Developer at Acme Corp</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm"><Save className="w-4 h-4 mr-2" /> Save Results</Button>
          <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700"><Download className="w-4 h-4 mr-2" /> Export Report</Button>
        </div>
      </div>

      {/* Score cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Overall Match", value: 87, icon: Target, color: "text-indigo-600", ring: "#6366f1" },
          { label: "ATS Compatibility", value: 75, icon: Shield, color: "text-amber-600", ring: "#f59e0b" },
          { label: "Keyword Match", value: 78, icon: Sparkles, color: "text-violet-600", ring: "#8b5cf6" },
          { label: "Skills Coverage", value: 65, icon: TrendingUp, color: "text-red-500", ring: "#ef4444" },
        ].map((score) => (
          <Card key={score.label} className="p-5 flex items-center gap-4">
            <div className="relative w-14 h-14 shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 56 56">
                <circle cx="28" cy="28" r="24" fill="none" stroke="#f1f5f9" strokeWidth="5" />
                <circle cx="28" cy="28" r="24" fill="none" stroke={score.ring} strokeWidth="5"
                  strokeDasharray={`${(score.value / 100) * 150} 150`} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-sm font-bold ${score.color}`}>{score.value}%</span>
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">{score.label}</p>
              <p className={`text-xs font-medium mt-0.5 ${score.value >= 80 ? "text-emerald-600" : score.value >= 70 ? "text-amber-600" : "text-red-500"}`}>
                {score.value >= 80 ? "Strong" : score.value >= 70 ? "Good" : "Needs Work"}
              </p>
            </div>
          </Card>
        ))}
      </div>

      {/* Tab navigation */}
      <div className="flex flex-wrap gap-1 border-b border-border pb-px">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition -mb-px ${
              activeTab === tab.id
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Strengths & Weaknesses */}
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="p-5">
              <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4" />
                </div>
                Strengths
              </h3>
              <div className="space-y-2.5">
                {[
                  "Strong React and TypeScript experience matches core requirements",
                  "6+ years of experience exceeds the 5-year minimum",
                  "Measurable achievements in current role (performance improvements)",
                  "Experience with design systems and component libraries",
                  "Education matches the required qualifications",
                ].map((s, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <p className="text-sm text-muted-foreground">{s}</p>
                  </div>
                ))}
              </div>
            </Card>
            <Card className="p-5">
              <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
                  <TrendingDown className="w-4 h-4" />
                </div>
                Weaknesses
              </h3>
              <div className="space-y-2.5">
                {[
                  "Missing GraphQL experience — listed as a required skill",
                  "No AWS or cloud infrastructure experience mentioned",
                  "Docker and containerization skills not present",
                  "Professional summary is too generic and lacks keywords",
                  "Cover letter doesn't reference specific company or role",
                ].map((w, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <p className="text-sm text-muted-foreground">{w}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Missing Skills */}
          <Card className="p-5">
            <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" /> Missing Skills Analysis
            </h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { skill: "GraphQL", importance: "Required", level: "Not mentioned" },
                { skill: "AWS (Lambda, S3, EC2)", importance: "Required", level: "Not mentioned" },
                { skill: "Docker", importance: "Preferred", level: "Not mentioned" },
                { skill: "CI/CD Pipelines", importance: "Required", level: "Partial" },
                { skill: "Cypress Testing", importance: "Preferred", level: "Not mentioned" },
                { skill: "Next.js", importance: "Preferred", level: "Not mentioned" },
              ].map((s) => (
                <div key={s.skill} className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <div>
                    <p className="text-sm font-medium">{s.skill}</p>
                    <p className="text-xs text-muted-foreground">{s.level}</p>
                  </div>
                  <Badge variant="outline" className={`text-[10px] ${
                    s.importance === "Required" ? "bg-red-50 text-red-700 border-red-200" : "bg-amber-50 text-amber-700 border-amber-200"
                  }`}>
                    {s.importance}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>

          {/* Missing Keywords */}
          <Card className="p-5">
            <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-violet-500" /> Missing Keywords
            </h3>
            <p className="text-xs text-muted-foreground mb-3">These keywords from the job description are not found in your resume:</p>
            <div className="flex flex-wrap gap-2">
              {["GraphQL", "AWS", "Docker", "Microservices", "CI/CD", "Next.js", "Server-side Rendering", "Performance Optimization", "Accessibility", "Cross-functional"].map((kw) => (
                <Badge key={kw} variant="outline" className="text-xs bg-red-50/50 text-red-600 border-red-200">
                  <XCircle className="w-3 h-3 mr-1" /> {kw}
                </Badge>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* RESUME TAB */}
      {activeTab === "resume" && (
        <div className="space-y-6">
          <Card className="p-5">
            <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-500" /> Resume Improvement Suggestions
            </h3>
            <div className="space-y-3">
              {[
                { priority: "Critical", text: "Add GraphQL, AWS, and Docker to your skills section — these are required in the job description.", color: "bg-red-50 text-red-700 border-red-200" },
                { priority: "Critical", text: "Rewrite your professional summary to include 6+ years of experience and key technologies (React, TypeScript, Next.js).", color: "bg-red-50 text-red-700 border-red-200" },
                { priority: "High", text: "Quantify your achievements: replace 'Improved performance' with 'Improved page load time by 40%'.", color: "bg-amber-50 text-amber-700 border-amber-200" },
                { priority: "Medium", text: "Add a projects section showcasing work with the required tech stack.", color: "bg-indigo-50 text-indigo-700 border-indigo-200" },
                { priority: "Low", text: "Include your LinkedIn URL in the contact section.", color: "bg-slate-50 text-slate-600 border-slate-200" },
              ].map((s, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg border border-border">
                  <Badge variant="outline" className={`text-[10px] shrink-0 ${s.color}`}>{s.priority}</Badge>
                  <p className="text-sm text-muted-foreground">{s.text}</p>
                </div>
              ))}
            </div>
          </Card>

          <ComparisonView type="resume" />

          <Card className="p-5">
            <h3 className="font-semibold text-sm mb-3">Resume vs. Job Description Comparison</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 px-3 font-medium text-xs text-muted-foreground">Requirement</th>
                    <th className="text-center py-2 px-3 font-medium text-xs text-muted-foreground">In Job Description</th>
                    <th className="text-center py-2 px-3 font-medium text-xs text-muted-foreground">In Your Resume</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { req: "React", job: true, resume: true },
                    { req: "TypeScript", job: true, resume: true },
                    { req: "GraphQL", job: true, resume: false },
                    { req: "AWS", job: true, resume: false },
                    { req: "Docker", job: true, resume: false },
                    { req: "5+ years experience", job: true, resume: true },
                    { req: "Performance optimization", job: true, resume: true },
                    { req: "CI/CD pipelines", job: true, resume: false },
                  ].map((row) => (
                    <tr key={row.req} className="border-b border-border/50">
                      <td className="py-2.5 px-3 font-medium">{row.req}</td>
                      <td className="text-center py-2.5 px-3">
                        {row.job ? <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto" /> : <XCircle className="w-4 h-4 text-slate-300 mx-auto" />}
                      </td>
                      <td className="text-center py-2.5 px-3">
                        {row.resume ? <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto" /> : <XCircle className="w-4 h-4 text-red-400 mx-auto" />}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* COVER LETTER TAB */}
      {activeTab === "cover" && (
        <div className="space-y-6">
          <Card className="p-5">
            <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-500" /> Cover Letter Improvement Suggestions
            </h3>
            <div className="space-y-3">
              {[
                { priority: "Critical", text: "Address the letter to a specific person or use the company name instead of 'Hiring Manager'.", color: "bg-red-50 text-red-700 border-red-200" },
                { priority: "High", text: "Reference specific aspects of the company (recent projects, values, mission) to show genuine interest.", color: "bg-amber-50 text-amber-700 border-amber-200" },
                { priority: "High", text: "Include quantifiable achievements that align with the job requirements.", color: "bg-amber-50 text-amber-700 border-amber-200" },
                { priority: "Medium", text: "Add a strong closing paragraph with a clear call to action for an interview.", color: "bg-indigo-50 text-indigo-700 border-indigo-200" },
              ].map((s, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg border border-border">
                  <Badge variant="outline" className={`text-[10px] shrink-0 ${s.color}`}>{s.priority}</Badge>
                  <p className="text-sm text-muted-foreground">{s.text}</p>
                </div>
              ))}
            </div>
          </Card>
          <ComparisonView type="cover" />
        </div>
      )}

      {/* LINKEDIN TAB */}
      {activeTab === "linkedin" && (
        <div className="space-y-6">
          <Card className="p-5">
            <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <Linkedin className="w-4 h-4 text-[#0A66C2]" /> LinkedIn Profile Recommendations
            </h3>
            <div className="space-y-3">
              {[
                { section: "Headline", text: "Add keywords: 'Senior Frontend Developer | React | TypeScript | Next.js' instead of just your job title.", score: 60 },
                { section: "About", text: "Expand to 300+ words. Include your top achievements, key technologies, and what you're looking for.", score: 45 },
                { section: "Experience", text: "Add quantifiable results to your last two roles using bullet points and action verbs.", score: 82 },
                { section: "Skills", text: "Add GraphQL, AWS, and Docker to your skills section and request endorsements.", score: 70 },
              ].map((rec, i) => (
                <div key={i} className="p-4 rounded-lg border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-semibold">{rec.section}</h4>
                    <span className={`text-xs font-bold ${
                      rec.score >= 80 ? "text-emerald-600" : rec.score >= 60 ? "text-amber-600" : "text-red-500"
                    }`}>{rec.score}%</span>
                  </div>
                  <Progress value={rec.score} className="h-1.5 mb-2" />
                  <p className="text-sm text-muted-foreground">{rec.text}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* NEXT STEPS TAB */}
      {activeTab === "next" && (
        <div className="space-y-6">
          <Card className="p-5">
            <h3 className="font-semibold text-sm mb-4 flex items-center gap-2">
              <ArrowRight className="w-4 h-4 text-indigo-500" /> Recommended Next Steps
            </h3>
            <div className="space-y-3">
              {[
                { num: 1, title: "Apply the optimized resume", desc: "Download the AI-optimized resume and review the highlighted changes before submitting.", action: "Download Resume" },
                { num: 2, title: "Update your cover letter", desc: "Use the generated cover letter or customize it further with the suggested improvements.", action: "Edit Cover Letter" },
                { num: 3, title: "Optimize your LinkedIn profile", desc: "Update your headline, about section, and skills based on the recommendations.", action: "Go to LinkedIn Optimizer" },
                { num: 4, title: "Learn missing skills", desc: "Start with GraphQL and AWS — these are required skills for this role.", action: "View Learning Paths" },
                { num: 5, title: "Track this application", desc: "Add this application to your tracker to monitor its status.", action: "Add to Tracker" },
              ].map((step) => (
                <div key={step.num} className="flex items-start gap-4 p-4 rounded-lg border border-border hover:border-indigo-200 transition">
                  <div className="w-8 h-8 rounded-full bg-indigo-600 text-white text-sm font-bold flex items-center justify-center shrink-0">
                    {step.num}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold">{step.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{step.desc}</p>
                  </div>
                  <Button variant="outline" size="sm" className="shrink-0 text-xs hidden sm:flex">
                    {step.action} <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}