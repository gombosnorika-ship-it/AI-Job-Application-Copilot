import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Eye, Code, Check, ArrowRight } from "lucide-react";

const originalResume = [
  { type: "text", content: "Alex Johnson" },
  { type: "text", content: "San Francisco, CA | alex@email.com | (555) 123-4567" },
  { type: "heading", content: "Professional Summary" },
  { type: "text", content: "Frontend developer with experience building web applications." },
  { type: "heading", content: "Experience" },
  { type: "text", content: "Senior Developer, TechStart Inc. (2021 - Present)" },
  { type: "text", content: "Built customer-facing dashboard using React" },
  { type: "text", content: "Improved page performance" },
  { type: "text", content: "Worked with the design team on UI components" },
  { type: "heading", content: "Skills" },
  { type: "text", content: "React, JavaScript, HTML, CSS, Git" },
];

const optimizedResume = [
  { type: "text", content: "Alex Johnson" },
  { type: "text", content: "San Francisco, CA | alex@email.com | (555) 123-4567 | linkedin.com/in/alexjohnson" },
  { type: "heading", content: "Professional Summary" },
  { type: "added", content: "Senior Frontend Developer with 6+ years of experience building scalable web applications using React, TypeScript, and Next.js. Proven track record of improving performance and leading cross-functional teams." },
  { type: "heading", content: "Experience" },
  { type: "text", content: "Senior Developer, TechStart Inc. (2021 - Present)" },
  { type: "added", content: "Architected and built a customer-facing dashboard serving 50,000+ daily active users using React and TypeScript" },
  { type: "added", content: "Improved page load performance by 40% through code splitting and lazy loading, reducing bounce rate by 15%" },
  { type: "added", content: "Led cross-functional collaboration with design and backend teams to deliver a reusable component library" },
  { type: "heading", content: "Skills" },
  { type: "added", content: "React, TypeScript, Next.js, Tailwind CSS, REST APIs, GraphQL, Docker, AWS, CI/CD, Jest, Cypress, Git" },
];

const originalLetter = [
  { type: "text", content: "Dear Hiring Manager," },
  { type: "text", content: "I am writing to apply for the Senior Frontend Developer position. I have experience with React and JavaScript and I think I would be a good fit for the role." },
  { type: "text", content: "I have built several web applications and worked on performance improvements. I am interested in joining your team." },
  { type: "text", content: "Thank you for your consideration." },
  { type: "text", content: "Best regards, Alex Johnson" },
];

const optimizedLetter = [
  { type: "text", content: "Dear Hiring Manager," },
  { type: "added", content: "I am writing to express my strong interest in the Senior Frontend Developer position at Acme Corp. With over 6 years of experience building scalable web applications using React, TypeScript, and Next.js, I am confident I would be a valuable addition to your team." },
  { type: "added", content: "In my current role at TechStart Inc., I led the development of a customer-facing dashboard serving 50,000+ daily active users. I improved page load performance by 40% through code splitting and lazy loading strategies, directly contributing to a 15% reduction in bounce rates." },
  { type: "added", content: "I am particularly drawn to Acme Corp's commitment to building accessible, user-centric products, and I would welcome the opportunity to discuss how my skills align with your team's needs." },
  { type: "text", content: "Thank you for your consideration." },
  { type: "text", content: "Best regards, Alex Johnson" },
];

function DocumentView({ lines, showHighlights }) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-5 min-h-[400px]">
      {lines.map((line, i) => {
        if (line.type === "heading") {
          return (
            <h4 key={i} className="font-bold text-sm text-slate-900 mt-4 mb-1.5 first:mt-0">
              {line.content}
            </h4>
          );
        }
        if (line.type === "added" && showHighlights) {
          return (
            <p key={i} className="text-sm text-slate-700 leading-relaxed mb-1.5 bg-emerald-50 border-l-2 border-emerald-400 pl-2 py-0.5 rounded-r">
              {line.content}
            </p>
          );
        }
        return (
          <p key={i} className="text-sm text-slate-700 leading-relaxed mb-1.5">
            {line.content}
          </p>
        );
      })}
    </div>
  );
}

export default function ComparisonView({ type = "resume" }) {
  const [view, setView] = useState("split"); // split | original | optimized
  const [showHighlights, setShowHighlights] = useState(true);

  const original = type === "resume" ? originalResume : originalLetter;
  const optimized = type === "resume" ? optimizedResume : optimizedLetter;

  return (
    <Card className="p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <h3 className="font-semibold text-sm flex items-center gap-2">
          <FileText className="w-4 h-4 text-indigo-500" />
          {type === "resume" ? "Resume" : "Cover Letter"} Comparison
        </h3>
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100 rounded-lg p-0.5">
            <button
              onClick={() => setView("original")}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition ${
                view === "original" ? "bg-white text-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >
              Original
            </button>
            <button
              onClick={() => setView("optimized")}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition ${
                view === "optimized" ? "bg-white text-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >
              Optimized
            </button>
            <button
              onClick={() => setView("split")}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition ${
                view === "split" ? "bg-white text-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >
              Split
            </button>
          </div>
        </div>
      </div>

      {view === "split" && (
        <label className="flex items-center gap-2 mb-3 text-xs text-muted-foreground cursor-pointer">
          <input
            type="checkbox"
            checked={showHighlights}
            onChange={(e) => setShowHighlights(e.target.checked)}
            className="rounded"
          />
          Highlight changes
        </label>
      )}

      {view === "split" ? (
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <div className="w-2 h-2 rounded-full bg-slate-400" />
              <span className="text-xs font-semibold text-muted-foreground">Original</span>
            </div>
            <DocumentView lines={original} showHighlights={false} />
          </div>
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-xs font-semibold text-emerald-600">AI-Optimized</span>
            </div>
            <DocumentView lines={optimized} showHighlights={showHighlights} />
          </div>
        </div>
      ) : view === "original" ? (
        <DocumentView lines={original} showHighlights={false} />
      ) : (
        <DocumentView lines={optimized} showHighlights={showHighlights} />
      )}

      {view === "split" && showHighlights && (
        <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-emerald-50 border border-emerald-400" />
            Added / Improved
          </div>
        </div>
      )}
    </Card>
  );
}