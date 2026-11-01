import React from "react";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Loader2, Brain, FileSearch, Target, Sparkles, FileCheck } from "lucide-react";

const stages = [
  { label: "Parsing job description", icon: FileSearch },
  { label: "Analyzing your resume", icon: FileCheck },
  { label: "Matching skills & keywords", icon: Target },
  { label: "Checking ATS compatibility", icon: Brain },
  { label: "Generating optimization suggestions", icon: Sparkles },
];

export default function AnalysisLoading({ progress }) {
  const currentStage = Math.min(Math.floor((progress / 100) * stages.length), stages.length - 1);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">AI Analysis in Progress</h1>
        <p className="text-sm text-muted-foreground mt-1">Analyzing your application materials against the job description...</p>
      </div>
      <Card className="p-8">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
            <Brain className="w-8 h-8 animate-pulse" />
          </div>
          <h2 className="text-lg font-semibold">Running AI Analysis</h2>
          <p className="text-sm text-muted-foreground mt-1">This usually takes about 30 seconds</p>
        </div>
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-muted-foreground">Progress</span>
            <span className="text-xs font-bold">{progress}%</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-600 rounded-full transition-all duration-200" style={{ width: `${progress}%` }} />
          </div>
        </div>
        <div className="space-y-3">
          {stages.map((stage, i) => {
            const done = i < currentStage;
            const active = i === currentStage;
            return (
              <div key={i} className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  done ? "bg-emerald-50 text-emerald-600" : active ? "bg-indigo-50 text-indigo-600" : "bg-slate-50 text-slate-300"
                }`}>
                  {done ? <CheckCircle2 className="w-4 h-4" /> : active ? <Loader2 className="w-4 h-4 animate-spin" /> : <stage.icon className="w-4 h-4" />}
                </div>
                <span className={`text-sm ${done || active ? "font-medium text-foreground" : "text-muted-foreground"}`}>
                  {stage.label}
                </span>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}