import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, XCircle, BookOpen, TrendingUp, Target, Lightbulb } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import AnalysisInput from "@/components/analysis/AnalysisInput";
import { useApp } from "@/lib/AppContext";
import { generateSkillsGap, getResumeText } from "@/lib/aiService";

const learningPaths = [
  { title: "Master GraphQL with Apollo", type: "Course", duration: "12 hours", platform: "Udemy" },
  { title: "AWS Certified Developer", type: "Certification", duration: "40 hours", platform: "AWS Training" },
  { title: "Docker for Developers", type: "Tutorial", duration: "6 hours", platform: "Docker Docs" },
  { title: "Advanced Testing with Cypress", type: "Course", duration: "8 hours", platform: "TestingJS" },
];

export default function SkillsGap() {
  const { resumes } = useApp();
  const [selectedResume, setSelectedResume] = useState(resumes[0]?.id || "");
  const [jobText, setJobText] = useState("");
  const [analyzed, setAnalyzed] = useState(false);

  const resume = resumes.find(r => r.id === selectedResume);
  const resumeText = resume ? getResumeText(resume) : "";
  const { matched, missing } = generateSkillsGap(resumeText, jobText);

  const chartData = [
    ...matched.map(s => ({ name: s, yours: 85, required: 80, status: "strong" })),
    ...missing.map(s => ({ name: s.skill, yours: 30, required: 70, status: "gap" })),
  ];

  const totalSkills = matched.length + missing.length;
  const avgGap = missing.length > 0 ? Math.round(missing.reduce((s, m) => s + m.gap, 0) / missing.length) : 0;
  const estWeeks = missing.length > 0 ? Math.ceil(missing.length * 1.5) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Skills Gap Analysis</h1>
        <p className="text-sm text-muted-foreground mt-1">Identify skill gaps and get improvement recommendations.</p>
      </div>

      <AnalysisInput onResumeChange={setSelectedResume} onJobChange={setJobText} onAnalyze={() => setAnalyzed(true)} selectedResume={selectedResume} jobText={jobText} ctaLabel="Analyze Skills" />

      {analyzed && resume && jobText ? (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Skills Matched", value: `${matched.length}/${totalSkills}`, icon: CheckCircle2, color: "text-emerald-600 bg-emerald-50" },
              { label: "Skills to Improve", value: missing.length, icon: TrendingUp, color: "text-amber-600 bg-amber-50" },
              { label: "Avg. Gap Size", value: `${avgGap}%`, icon: Target, color: "text-red-500 bg-red-50" },
              { label: "Est. Learning Time", value: `${estWeeks} wks`, icon: BookOpen, color: "text-indigo-600 bg-indigo-50" },
            ].map(stat => (
              <Card key={stat.label} className="p-4">
                <div className="flex items-start justify-between">
                  <div><p className="text-xs text-muted-foreground font-medium">{stat.label}</p><p className="text-xl font-bold mt-1">{stat.value}</p></div>
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${stat.color}`}><stat.icon className="w-4 h-4" /></div>
                </div>
              </Card>
            ))}
          </div>

          {chartData.length > 0 && (
            <Card className="p-5">
              <h3 className="font-semibold text-sm mb-4">Your Skills vs. Requirements</h3>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} layout="vertical" barGap={4}>
                    <XAxis type="number" domain={[0, 100]} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#94a3b8" }} />
                    <YAxis type="category" dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#64748b" }} width={80} />
                    <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 12 }} />
                    <Bar dataKey="yours" name="Your Level" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={10} />
                    <Bar dataKey="required" name="Required" fill="#e2e8f0" radius={[0, 4, 4, 0]} barSize={10} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center gap-4 mt-3 justify-center">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><div className="w-3 h-3 rounded-sm bg-indigo-500" /> Your Level</div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><div className="w-3 h-3 rounded-sm bg-slate-200" /> Required</div>
              </div>
            </Card>
          )}

          {missing.length > 0 && (
            <div>
              <h3 className="font-semibold text-sm mb-3 flex items-center gap-2"><XCircle className="w-4 h-4 text-red-500" /> Skills to Develop</h3>
              <div className="grid md:grid-cols-3 gap-4">
                {missing.map(skill => (
                  <Card key={skill.skill} className="p-5">
                    <h4 className="font-semibold text-sm mb-2">{skill.skill}</h4>
                    <div className="space-y-2 mb-3">
                      <div className="flex justify-between text-xs"><span className="text-muted-foreground">Gap</span><span className="font-medium text-red-500">{skill.gap}%</span></div>
                      <Progress value={100 - skill.gap} className="h-1.5" />
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground"><span>Est. {skill.timeToLearn}</span><span>{skill.resources} resources</span></div>
                    <Button variant="outline" size="sm" className="w-full mt-3 text-xs" onClick={() => toast({ title: "Learning resource", description: "Check out the recommended learning paths below for this skill." })}><BookOpen className="w-3.5 h-3.5 mr-1.5" /> Start Learning</Button>
                  </Card>
                ))}
              </div>
            </div>
          )}

          <Card className="p-5">
            <h3 className="font-semibold text-sm mb-3 flex items-center gap-2"><Lightbulb className="w-4 h-4 text-amber-500" /> Recommended Learning Paths</h3>
            <div className="space-y-3">
              {learningPaths.map((path, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-border hover:border-indigo-200 transition">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0"><BookOpen className="w-4 h-4" /></div>
                    <div><h4 className="text-sm font-medium">{path.title}</h4><p className="text-[11px] text-muted-foreground">{path.platform} · {path.duration}</p></div>
                  </div>
                  <Badge variant="outline" className="text-[10px] shrink-0">{path.type}</Badge>
                </div>
              ))}
            </div>
          </Card>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4"><Target className="w-7 h-7 text-slate-400" /></div>
          <h3 className="font-semibold text-slate-600">Select a resume and paste a job description</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm">Choose a resume and paste the job description above, then click Analyze Skills.</p>
        </div>
      )}
    </div>
  );
}