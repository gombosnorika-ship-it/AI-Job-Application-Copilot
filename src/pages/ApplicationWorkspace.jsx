import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Search, FileText, PenTool, Award, GraduationCap, Star, Briefcase,
  Zap, ArrowLeft, Eye, FolderOpen
} from "lucide-react";
import ApplicationChecklist from "@/components/ApplicationChecklist";
import DocumentPreviewDialog from "@/components/DocumentPreviewDialog";
import { useApp } from "@/lib/AppContext";
import { calculateMatchScore, getResumeText } from "@/lib/aiService";
import { toast } from "@/components/ui/use-toast";

const docIcons = { certificate: Award, diploma: GraduationCap, recommendation: Star, portfolio: Briefcase, cover_letter: PenTool };

export default function ApplicationWorkspace() {
  const navigate = useNavigate();
  const { applications, resumes, documents } = useApp();
  const app = applications[0];
  const [preview, setPreview] = useState(null);

  if (!app) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Application Workspace</h1>
          <p className="text-sm text-muted-foreground mt-1">Review your application materials before starting AI analysis.</p>
        </div>
        <Card className="p-12 text-center">
          <FolderOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="font-semibold text-sm">No application selected</h3>
          <p className="text-sm text-muted-foreground mt-1 mb-4">Create a new application to get started with the AI analysis workflow.</p>
          <Link to="/new-application"><Button className="bg-indigo-600 hover:bg-indigo-700"><Zap className="w-4 h-4 mr-2" /> New Application</Button></Link>
        </Card>
      </div>
    );
  }

  const resume = resumes.find(r => r.id === app.resumeId);
  const resumeText = resume ? getResumeText(resume) : "";
  const { matched, missing } = calculateMatchScore(resumeText, app.jobText || app.jobDescription || "");
  const coverLetter = app.coverLetterId ? documents.find(d => d.id === app.coverLetterId) : null;
  const supportingDocs = (app.documentIds || []).map(id => documents.find(d => d.id === id)).filter(Boolean);

  const checklistReady = {
    job_description: !!(app.jobDescription || app.jobText),
    resume: !!resume,
    cover_letter: !!coverLetter,
    certificate: supportingDocs.some(d => d.type === "certificate"),
    diploma: supportingDocs.some(d => d.type === "diploma"),
    recommendation: supportingDocs.some(d => d.type === "recommendation"),
    portfolio: supportingDocs.some(d => d.type === "portfolio"),
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Application Workspace</h1>
          <p className="text-sm text-muted-foreground mt-1">Review your application materials before starting AI analysis.</p>
        </div>
        <Button variant="outline" onClick={() => navigate("/new-application")}><ArrowLeft className="w-4 h-4 mr-2" /> Edit Selection</Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center"><Search className="w-4 h-4" /></div>
              <h3 className="font-semibold text-sm">Job Description</h3>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="secondary">{app.role}</Badge>
              <Badge variant="outline">{app.company}</Badge>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-4">{app.jobDescription || app.jobText}</p>
            <Button variant="ghost" size="sm" className="mt-2 text-xs" onClick={() => setPreview({ title: "Job Description", content: app.jobDescription || app.jobText, subtitle: `${app.role} at ${app.company}` })}>
              <Eye className="w-3.5 h-3.5 mr-1.5" /> View Full Description
            </Button>
          </Card>

          {resume && (
            <Card className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center"><FileText className="w-4 h-4" /></div>
                <h3 className="font-semibold text-sm">Selected Resume</h3>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-indigo-600" />
                  <div><p className="text-sm font-medium">{resume.name}</p><p className="text-xs text-muted-foreground">ATS Score: {resume.atsScore || 0}%</p></div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setPreview({ title: resume.name, content: resume.content || getResumeText(resume), subtitle: resume.role })}><Eye className="w-3.5 h-3.5 mr-1.5" /> Preview</Button>
              </div>
            </Card>
          )}

          {coverLetter && (
            <Card className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center"><PenTool className="w-4 h-4" /></div>
                <h3 className="font-semibold text-sm">Cover Letter</h3>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                <div className="flex items-center gap-3"><PenTool className="w-5 h-5 text-violet-600" /><p className="text-sm font-medium">{coverLetter.name}</p></div>
                <Button variant="ghost" size="sm" onClick={() => toast({ title: "Preview", description: "Open this cover letter in the Document Center for full preview." })}><Eye className="w-3.5 h-3.5 mr-1.5" /> Preview</Button>
              </div>
            </Card>
          )}

          {supportingDocs.length > 0 && (
            <Card className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center"><Briefcase className="w-4 h-4" /></div>
                <h3 className="font-semibold text-sm">Supporting Documents</h3>
              </div>
              <div className="space-y-2">
                {supportingDocs.map(doc => {
                  const Icon = docIcons[doc.type] || FileText;
                  return (
                    <div key={doc.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                      <div className="flex items-center gap-3"><Icon className="w-5 h-5 text-slate-500" /><p className="text-sm font-medium">{doc.name}</p></div>
                      <Button variant="ghost" size="sm" onClick={() => toast({ title: "Preview", description: "Open this document in the Document Center for full preview." })}><Eye className="w-3.5 h-3.5 mr-1.5" /> Preview</Button>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <Card className="p-5"><ApplicationChecklist ready={checklistReady} /></Card>
          <Card className="p-5 bg-gradient-to-br from-indigo-50 to-violet-50 border-indigo-100">
            <div className="flex items-start gap-3 mb-4">
              <Zap className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-indigo-900">Ready for AI Analysis</p>
                <p className="text-xs text-indigo-700/80 mt-1">We'll analyze your resume against the job description, check ATS compatibility, identify skill gaps, and generate optimized versions.</p>
              </div>
            </div>
            <Button className="w-full bg-indigo-600 hover:bg-indigo-700" onClick={() => navigate("/analysis-dashboard")}><Zap className="w-4 h-4 mr-2" /> Start AI Analysis</Button>
          </Card>
        </div>
      </div>

      <DocumentPreviewDialog
        open={!!preview}
        onClose={() => setPreview(null)}
        title={preview?.title || "Preview"}
        subtitle={preview?.subtitle}
        content={preview?.content}
      />
    </div>
  );
}