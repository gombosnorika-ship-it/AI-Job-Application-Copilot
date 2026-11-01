import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, PenTool, Linkedin, Lightbulb } from "lucide-react";
import { generateSuggestions, calculateMatchScore } from "@/lib/aiService";

export default function SuggestionsSection({ resumeText, jobText }) {
  const suggestions = generateSuggestions(resumeText, jobText);
  const { missing } = calculateMatchScore(resumeText, jobText);

  const resumeSuggestions = suggestions;
  const coverLetterSuggestions = [
    { title: "Personalize the opening", detail: "Address the hiring manager by name and mention the specific role and company." },
    { title: "Address company needs", detail: "Reference the company's goals and explain how your experience directly addresses them." },
    { title: "Add specific examples", detail: "Include 1-2 concrete examples of relevant achievements that align with the job requirements." },
    { title: "Strong closing CTA", detail: "End with a confident call-to-action requesting an interview." },
  ];
  const linkedinSuggestions = [
    { title: "Update your headline", detail: "Include your target role: 'Senior Frontend Developer | React & TypeScript Expert'." },
    { title: "Optimize the About section", detail: "Add a compelling summary with keywords from the job description." },
    { title: missing.length > 0 ? "Add missing skills" : "Request recommendations", detail: missing.length > 0 ? `Include ${missing.slice(0, 3).join(", ")} in your skills section.` : "Ask 2-3 colleagues to write recommendations highlighting relevant strengths." },
    { title: "Engage with content", detail: "Like and comment on industry posts to increase your visibility to recruiters." },
  ];

  function SuggestionList({ icon: Icon, title, items, color }) {
    return (
      <Card className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className={`w-8 h-8 rounded-lg ${color} flex items-center justify-center`}><Icon className="w-4 h-4" /></div>
          <h3 className="font-semibold text-sm">{title}</h3>
          <Badge variant="outline" className="text-xs ml-auto">{items.length} tips</Badge>
        </div>
        <div className="space-y-3">
          {items.map((s, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 mt-0.5"><Lightbulb className="w-3 h-3" /></div>
              <div><p className="text-sm font-medium">{s.title}</p><p className="text-xs text-muted-foreground mt-0.5">{s.detail}</p></div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Optimization Suggestions</h2>
        <p className="text-sm text-muted-foreground mt-0.5">AI-powered recommendations to improve your application</p>
      </div>
      <div className="grid lg:grid-cols-3 gap-4">
        <SuggestionList icon={FileText} title="Resume Optimization" items={resumeSuggestions} color="bg-indigo-50 text-indigo-600" />
        <SuggestionList icon={PenTool} title="Cover Letter Improvements" items={coverLetterSuggestions} color="bg-violet-50 text-violet-600" />
        <SuggestionList icon={Linkedin} title="LinkedIn Recommendations" items={linkedinSuggestions} color="bg-blue-50 text-blue-600" />
      </div>
    </div>
  );
}