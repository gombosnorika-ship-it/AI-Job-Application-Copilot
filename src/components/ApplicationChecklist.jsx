import React from "react";
import { CheckCircle2, XCircle, Search, FileText, PenTool, Award, GraduationCap, Star, Briefcase } from "lucide-react";

const checklistItems = [
  { id: "job_description", label: "Job Description", icon: Search, required: true },
  { id: "resume", label: "Resume", icon: FileText, required: true },
  { id: "cover_letter", label: "Cover Letter", icon: PenTool, required: true },
  { id: "certificate", label: "Certificates", icon: Award, required: false },
  { id: "diploma", label: "Diploma / Transcripts", icon: GraduationCap, required: false },
  { id: "recommendation", label: "Recommendation Letters", icon: Star, required: false },
  { id: "portfolio", label: "Portfolio", icon: Briefcase, required: false },
];

export default function ApplicationChecklist({ ready = {} }) {
  const readyCount = checklistItems.filter((item) => ready[item.id]).length;
  const requiredReady = checklistItems.filter((item) => item.required && ready[item.id]).length;
  const requiredTotal = checklistItems.filter((item) => item.required).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-sm">Application Checklist</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {requiredReady} of {requiredTotal} required documents ready
          </p>
        </div>
        <div className={`text-2xl font-bold ${requiredReady === requiredTotal ? "text-emerald-600" : "text-amber-600"}`}>
          {readyCount}/{checklistItems.length}
        </div>
      </div>
      <div className="space-y-2">
        {checklistItems.map((item) => {
          const isReady = ready[item.id];
          return (
            <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg border border-border">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                isReady ? "bg-emerald-50 text-emerald-600" : "bg-slate-50 text-slate-400"
              }`}>
                <item.icon className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{item.label}</p>
                {item.required && <p className="text-[11px] text-muted-foreground">Required</p>}
              </div>
              {isReady ? (
                <span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                  <CheckCircle2 className="w-4 h-4" /> Ready
                </span>
              ) : (
                <span className="flex items-center gap-1 text-xs font-medium text-slate-400">
                  <XCircle className="w-4 h-4" /> {item.required ? "Missing" : "Optional"}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}