import React from "react";
import { Card } from "@/components/ui/card";
import { FileText, PenTool, Linkedin, Send } from "lucide-react";

const steps = [
  { icon: FileText, title: "Update your resume", desc: "Apply the AI-suggested changes to incorporate missing keywords and quantifiable achievements.", color: "bg-indigo-50 text-indigo-600" },
  { icon: PenTool, title: "Tailor your cover letter", desc: "Personalize the opening, address company needs, and add specific examples of your achievements.", color: "bg-violet-50 text-violet-600" },
  { icon: Linkedin, title: "Optimize your LinkedIn profile", desc: "Update your headline, About section, and skills to align with the target role.", color: "bg-blue-50 text-blue-600" },
  { icon: Send, title: "Apply with confidence", desc: "Use the Export Center to download your optimized materials and submit your application.", color: "bg-emerald-50 text-emerald-600" },
];

export default function NextSteps() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Recommended Next Steps</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Your action plan to maximize your chances of landing an interview</p>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {steps.map((step, i) => (
          <Card key={i} className="p-5">
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-xl ${step.color} flex items-center justify-center shrink-0`}>
                <step.icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <span className="text-xs font-bold text-muted-foreground">STEP {i + 1}</span>
                <h3 className="font-semibold text-sm mt-0.5">{step.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">{step.desc}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}