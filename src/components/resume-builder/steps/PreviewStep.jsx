import React from "react";
import { Button } from "@/components/ui/button";
import { Download, Printer } from "lucide-react";

function fmtDate(d) {
  if (!d) return "";
  const date = new Date(d + "-01");
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export default function PreviewStep({ data, finalized }) {
  const { personal, experience, education, skills } = data;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold">Preview & Finalize</h2>
        <p className="text-sm text-muted-foreground mt-1">Review your resume, then finalize to save it.</p>
      </div>

      <div className="flex gap-2 print:hidden">
        <Button variant="outline" size="sm" onClick={() => window.print()}>
          <Printer className="w-4 h-4 mr-1.5" /> Print
        </Button>
        <Button variant="outline" size="sm" onClick={() => window.print()}>
          <Download className="w-4 h-4 mr-1.5" /> Save as PDF
        </Button>
      </div>

      {/* Resume preview */}
      <div className="bg-white border border-border rounded-xl p-8 shadow-sm max-w-3xl mx-auto" id="resume-preview">
        {/* Header */}
        <div className="text-center pb-4 border-b-2 border-slate-200">
          <h1 className="text-2xl font-bold text-slate-900">{personal.fullName || "Your Name"}</h1>
          {personal.professionalTitle && (
            <p className="text-sm text-indigo-600 font-medium mt-0.5">{personal.professionalTitle}</p>
          )}
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-2 text-xs text-slate-500">
            {personal.email && <span>{personal.email}</span>}
            {personal.phone && <span>{personal.phone}</span>}
            {personal.location && <span>{personal.location}</span>}
            {personal.linkedin && <span>{personal.linkedin}</span>}
            {personal.portfolio && <span>{personal.portfolio}</span>}
          </div>
        </div>

        {/* Summary */}
        {personal.summary && (
          <div className="mt-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Summary</h2>
            <p className="text-sm text-slate-700 leading-relaxed">{personal.summary}</p>
          </div>
        )}

        {/* Experience */}
        {experience.filter((e) => e.company || e.title).length > 0 && (
          <div className="mt-5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Experience</h2>
            <div className="space-y-3">
              {experience
                .filter((e) => e.company || e.title)
                .map((exp, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-baseline">
                      <span className="text-sm font-semibold text-slate-900">
                        {exp.title || "Title"} · <span className="font-normal text-slate-600">{exp.company || "Company"}</span>
                      </span>
                      <span className="text-xs text-slate-400">
                        {fmtDate(exp.startDate)} – {exp.current ? "Present" : fmtDate(exp.endDate)}
                      </span>
                    </div>
                    {exp.description && <p className="text-sm text-slate-600 mt-1 whitespace-pre-line">{exp.description}</p>}
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Education */}
        {education.filter((e) => e.school).length > 0 && (
          <div className="mt-5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Education</h2>
            <div className="space-y-2">
              {education
                .filter((e) => e.school)
                .map((edu, i) => (
                  <div key={i} className="flex justify-between items-baseline">
                    <span className="text-sm font-semibold text-slate-900">
                      {edu.school}
                      {edu.degree && <span className="font-normal text-slate-600"> — {edu.degree}{edu.field ? `, ${edu.field}` : ""}</span>}
                      {edu.gpa && <span className="font-normal text-slate-500"> · GPA: {edu.gpa}</span>}
                    </span>
                    <span className="text-xs text-slate-400">
                      {fmtDate(edu.startDate)} – {fmtDate(edu.endDate)}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <div className="mt-5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Skills</h2>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((s) => (
                <span key={s} className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded">
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}