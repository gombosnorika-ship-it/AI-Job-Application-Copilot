import React from "react";
import { Card } from "@/components/ui/card";
import { ThumbsUp, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";

export default function StrengthsWeaknesses({ matchData, resumeText }) {
  const matched = matchData?.matched || [];
  const missing = matchData?.missing || [];

  const strengths = [];
  if (matched.length >= 3) strengths.push(`Strong match with ${matched.length} key skills: ${matched.slice(0, 3).join(", ")}`);
  if (/\d+%|\d+\+|\$[\d,]+|\d+k/i.test(resumeText || "")) strengths.push("Includes quantifiable achievements with metrics");
  if (/\b(led|developed|built|created|managed|designed|implemented|launched|improved|increased|reduced|optimized|architected|delivered)\b/i.test(resumeText || "")) strengths.push("Uses strong action verbs in experience descriptions");
  if ((resumeText || "").length > 200) strengths.push("Well-detailed resume with sufficient content");
  if (strengths.length === 0) strengths.push("Resume has been uploaded and is ready for optimization");

  const weaknesses = [];
  if (missing.length > 0) weaknesses.push(`Missing key keywords: ${missing.slice(0, 3).join(", ")}`);
  if (!/\d+%|\d+\+|\$[\d,]+|\d+k/i.test(resumeText || "")) weaknesses.push("No quantifiable achievements — add metrics to demonstrate impact");
  if (!/\b(led|developed|built|created|managed|designed|implemented|launched|improved|increased|reduced|optimized|architected|delivered)\b/i.test(resumeText || "")) weaknesses.push("Uses passive language — replace with strong action verbs");
  if ((resumeText || "").length < 200) weaknesses.push("Resume content is brief — add more detail about your experience");
  if (weaknesses.length === 0) weaknesses.push("Consider tailoring your summary more specifically to this role");

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Strengths & Weaknesses</h2>
        <p className="text-sm text-muted-foreground mt-0.5">A balanced view of your application's strong and weak points</p>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center"><ThumbsUp className="w-4 h-4" /></div>
            <h3 className="font-semibold text-sm">Strengths</h3>
          </div>
          <div className="space-y-2.5">
            {strengths.map((s, i) => (
              <div key={i} className="flex items-start gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" /><span className="text-sm">{s}</span></div>
            ))}
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center"><AlertTriangle className="w-4 h-4" /></div>
            <h3 className="font-semibold text-sm">Weaknesses</h3>
          </div>
          <div className="space-y-2.5">
            {weaknesses.map((w, i) => (
              <div key={i} className="flex items-start gap-2.5"><XCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" /><span className="text-sm">{w}</span></div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}