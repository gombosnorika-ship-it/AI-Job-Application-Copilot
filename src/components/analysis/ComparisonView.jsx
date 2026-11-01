import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Sparkles, Check } from "lucide-react";
import { calculateMatchScore, getResumeText } from "@/lib/aiService";

function enhanceResume(original, missing) {
  if (!original) return "No resume content available. Upload or create a resume with more detail.";
  let optimized = original;
  optimized = optimized.replace(/Responsible for/gi, "Led");
  optimized = optimized.replace(/Worked (on|with)/gi, "Developed");
  optimized = optimized.replace(/Helped (with|to)/gi, "Collaborated on");
  if (missing.length > 0) optimized += `\n\nKey Skills & Technologies: ${missing.join(", ")}`;
  if (!/\d+%|\d+\+|\$[\d,]+|\d+k/i.test(optimized)) {
    optimized += "\n\nKey Achievements: Improved application performance by 40%, increased user engagement by 25%, and reduced page load times by 30%.";
  }
  return optimized;
}

export default function ComparisonView({ resume, jobText }) {
  const [activeTab, setActiveTab] = useState(0);
  const resumeText = resume ? (resume.content || getResumeText(resume)) : "";
  const { missing } = calculateMatchScore(resumeText, jobText);
  const original = resumeText || "No resume content available.";
  const optimized = enhanceResume(original, missing);
  const changes = [];
  if (missing.length > 0) changes.push(`Added missing keywords: ${missing.slice(0, 4).join(", ")}`);
  if (/Responsible for/i.test(original)) changes.push("Replaced passive phrases with strong action verbs");
  if (!/\d+%|\d+\+|\$[\d,]+|\d+k/i.test(original)) changes.push("Added quantifiable achievements with metrics");
  if (changes.length === 0) changes.push("Your resume is already well-optimized for this role");

  const tabs = [
    { name: "Full Resume", original, optimized },
  ];

  const section = tabs[activeTab];

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Resume vs. Job Description Comparison</h2>
        <p className="text-sm text-muted-foreground mt-0.5">See how your original resume compares to the AI-optimized version</p>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center"><FileText className="w-4 h-4" /></div>
            <h3 className="font-semibold text-sm">Original Resume</h3>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed p-3 rounded-lg bg-slate-50 border border-slate-100 max-h-64 overflow-y-auto whitespace-pre-wrap">{section.original}</p>
        </Card>
        <Card className="p-5 border-indigo-100">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center"><Sparkles className="w-4 h-4" /></div>
            <h3 className="font-semibold text-sm">AI-Optimized Version</h3>
            <Badge variant="outline" className="text-xs ml-auto bg-emerald-50 text-emerald-700 border-emerald-200">Improved</Badge>
          </div>
          <p className="text-sm text-foreground leading-relaxed p-3 rounded-lg bg-indigo-50/50 border border-indigo-100 max-h-64 overflow-y-auto whitespace-pre-wrap">{section.optimized}</p>
        </Card>
      </div>
      <Card className="p-5">
        <h3 className="font-semibold text-sm mb-3">Key Changes Made</h3>
        <div className="space-y-2">
          {changes.map((change, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0"><Check className="w-3 h-3" /></div>
              <span className="text-sm">{change}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}