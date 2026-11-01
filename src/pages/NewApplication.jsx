import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Upload, FileText, Search, PenTool, Sparkles,
  ArrowRight, ArrowLeft, X, Plus, FileUp,
  Save, Loader2, FolderOpen, CheckCircle2, Zap
} from "lucide-react";
import StepProgress from "@/components/workflow/StepProgress";
import ApplicationChecklist from "@/components/ApplicationChecklist";
import DocumentCard from "@/components/DocumentCard";
import { useApp } from "@/lib/AppContext";
import { analyzeJobDescription, calculateMatchScore, getResumeText } from "@/lib/aiService";

const steps = [
  { id: 1, label: "Job Description" },
  { id: 2, label: "Resume" },
  { id: 3, label: "Cover Letter" },
  { id: 4, label: "Supporting Docs" },
  { id: 5, label: "Checklist" },
];

export default function NewApplication() {
  const navigate = useNavigate();
  const { resumes, documents, addApplication } = useApp();
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [saved, setSaved] = useState(false);

  const [jobInputType, setJobInputType] = useState("paste");
  const [jobText, setJobText] = useState("");
  const [jobFileName, setJobFileName] = useState("");

  const [resumeSource, setResumeSource] = useState("library");
  const [selectedResume, setSelectedResume] = useState(resumes[0]?.id || "");
  const [resumeFileName, setResumeFileName] = useState("");

  const [coverLetterChoice, setCoverLetterChoice] = useState("generate");
  const [selectedCoverLetter, setSelectedCoverLetter] = useState("");
  const [coverFileName, setCoverFileName] = useState("");

  const [selectedDocs, setSelectedDocs] = useState([]);

  useEffect(() => {
    setSaved(false);
    const t = setTimeout(() => setSaved(true), 800);
    return () => clearTimeout(t);
  }, [currentStep, jobText, selectedResume, coverLetterChoice, selectedDocs, resumeFileName, jobFileName, selectedCoverLetter, coverFileName]);

  const canProceed = () => {
    if (currentStep === 1) return jobInputType === "paste" ? jobText.trim().length > 20 : !!jobFileName;
    if (currentStep === 2) return resumeSource === "library" ? !!selectedResume : !!resumeFileName;
    return true;
  };

  const handleNext = () => {
    if (!completedSteps.includes(currentStep)) setCompletedSteps([...completedSteps, currentStep]);
    if (currentStep < 5) setCurrentStep(currentStep + 1);
  };
  const handleBack = () => { if (currentStep > 1) setCurrentStep(currentStep - 1); };
  const toggleDoc = (id) => setSelectedDocs(prev => prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]);

  const checklistReady = {
    job_description: jobInputType === "paste" ? jobText.trim().length > 20 : !!jobFileName,
    resume: resumeSource === "library" ? !!selectedResume : !!resumeFileName,
    cover_letter: coverLetterChoice === "skip" ? false : coverLetterChoice === "generate" ? true : coverLetterChoice === "library" ? !!selectedCoverLetter : !!coverFileName,
    certificate: selectedDocs.some(id => documents.find(d => d.id === id)?.type === "certificate"),
    diploma: selectedDocs.some(id => documents.find(d => d.id === id)?.type === "diploma"),
    recommendation: selectedDocs.some(id => documents.find(d => d.id === id)?.type === "recommendation"),
    portfolio: selectedDocs.some(id => documents.find(d => d.id === id)?.type === "portfolio"),
  };

  const handleOpenWorkspace = () => {
    const analysis = analyzeJobDescription(jobText);
    const resume = resumes.find(r => r.id === selectedResume);
    const resumeText = resume ? getResumeText(resume) : "";
    const { score } = calculateMatchScore(resumeText, jobText);
    addApplication({
      company: analysis?.company || "Unknown Company",
      role: analysis?.role || "Unknown Role",
      location: "",
      jobDescription: jobText,
      jobText,
      resumeId: selectedResume,
      coverLetterId: coverLetterChoice === "library" ? selectedCoverLetter : null,
      documentIds: selectedDocs,
      status: "preparing",
      matchScore: score,
    });
    navigate("/application-workspace");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">New Application</h1>
          <p className="text-sm text-muted-foreground mt-1">Complete each step to prepare your application for AI analysis.</p>
        </div>
        <div className="flex items-center gap-2">
          {saved ? <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200"><Save className="w-3 h-3 mr-1" /> Progress saved</Badge>
            : <Badge variant="outline" className="text-xs text-muted-foreground"><Loader2 className="w-3 h-3 mr-1 animate-spin" /> Saving...</Badge>}
          <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}><X className="w-4 h-4" /></Button>
        </div>
      </div>

      <Card className="p-5"><StepProgress steps={steps} currentStep={currentStep} completedSteps={completedSteps} /></Card>

      <Card className="p-5 sm:p-6">
        {currentStep === 1 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-semibold">Paste the Job Description</h2>
              <p className="text-sm text-muted-foreground mt-1">Add the job posting you want to analyze. You can paste text or upload a file.</p>
            </div>
            <div className="flex gap-2 p-1 bg-slate-100 rounded-lg w-fit">
              <button onClick={() => setJobInputType("paste")} className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium transition ${jobInputType === "paste" ? "bg-white shadow-sm text-foreground" : "text-muted-foreground"}`}><PenTool className="w-4 h-4" /> Paste Text</button>
              <label className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium transition cursor-pointer ${jobInputType === "upload" ? "bg-white shadow-sm text-foreground" : "text-muted-foreground"}`}>
                <FileUp className="w-4 h-4" /> Upload File
                <input type="file" className="hidden" onChange={(e) => { setJobInputType("upload"); setJobFileName(e.target.files?.[0]?.name || ""); }} accept=".pdf,.txt,.png,.jpg" />
              </label>
            </div>
            {jobInputType === "paste" ? (
              <div className="space-y-2">
                <Label className="text-xs">Job Description</Label>
                <Textarea placeholder="Paste the full job description here..." className="min-h-[200px] resize-none text-sm" value={jobText} onChange={(e) => setJobText(e.target.value)} />
                <p className="text-xs text-muted-foreground">{jobText.length} characters</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl p-10">
                <Upload className="w-10 h-10 text-slate-400 mb-3" />
                <p className="text-sm font-medium">{jobFileName || "Drop a file or click to browse"}</p>
                <p className="text-xs text-muted-foreground mt-1">PDF, PNG, or JPG — up to 10MB</p>
              </div>
            )}
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-semibold">Select or Upload Your Resume</h2>
              <p className="text-sm text-muted-foreground mt-1">Choose a resume from your library, upload a new one, or create one from scratch.</p>
            </div>
            <div className="flex flex-wrap gap-2 p-1 bg-slate-100 rounded-lg w-fit">
              <button onClick={() => setResumeSource("library")} className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium transition ${resumeSource === "library" ? "bg-white shadow-sm text-foreground" : "text-muted-foreground"}`}><FileText className="w-4 h-4" /> From Library</button>
              <label className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium transition cursor-pointer ${resumeSource === "upload" ? "bg-white shadow-sm text-foreground" : "text-muted-foreground"}`}>
                <Upload className="w-4 h-4" /> Upload New
                <input type="file" className="hidden" onChange={(e) => { setResumeSource("upload"); setResumeFileName(e.target.files?.[0]?.name || ""); }} accept=".pdf,.docx,.txt" />
              </label>
              <Link to="/resume-builder" className="flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground transition"><Plus className="w-4 h-4" /> Create New</Link>
            </div>
            {resumeSource === "library" ? (
              <div className="space-y-2.5">
                {resumes.length === 0 ? (
                  <div className="text-center py-8 text-sm text-muted-foreground">
                    No resumes in your library. <Link to="/resume-builder" className="text-indigo-600 hover:underline">Create one</Link> or upload a new one.
                  </div>
                ) : resumes.map(r => (
                  <label key={r.id} className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition ${selectedResume === r.id ? "border-indigo-500 bg-indigo-50/50" : "border-border hover:border-slate-300"}`}>
                    <input type="radio" name="resume" checked={selectedResume === r.id} onChange={() => setSelectedResume(r.id)} className="sr-only" />
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${selectedResume === r.id ? "border-indigo-600 bg-indigo-600" : "border-slate-300"}`}>{selectedResume === r.id && <div className="w-2 h-2 rounded-full bg-white" />}</div>
                    <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0"><FileText className="w-5 h-5" /></div>
                    <div className="flex-1"><p className="text-sm font-medium">{r.name}</p><p className="text-xs text-muted-foreground">Tailored for: {r.role}</p></div>
                    <Badge variant="outline" className="text-xs">{r.atsScore || 0}% ATS</Badge>
                  </label>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl p-10">
                <Upload className="w-10 h-10 text-slate-400 mb-3" />
                <p className="text-sm font-medium">{resumeFileName || "Drop your resume or click to browse"}</p>
                <p className="text-xs text-muted-foreground mt-1">PDF or DOCX — up to 10MB</p>
              </div>
            )}
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-semibold">Cover Letter <span className="text-sm font-normal text-muted-foreground">(optional)</span></h2>
              <p className="text-sm text-muted-foreground mt-1">Choose from your document center, let AI generate one, or upload a file.</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { id: "skip", icon: X, label: "Skip", desc: "No cover letter" },
                { id: "generate", icon: Sparkles, label: "Generate with AI", desc: "Create a tailored letter" },
                { id: "library", icon: FolderOpen, label: "From Document Center", desc: "Use an existing file" },
                { id: "upload", icon: Upload, label: "Upload", desc: "Upload a new file" },
              ].map(opt => (
                <button key={opt.id} onClick={() => setCoverLetterChoice(opt.id)} className={`flex flex-col items-center gap-2 p-5 rounded-xl border-2 transition text-center ${coverLetterChoice === opt.id ? "border-indigo-500 bg-indigo-50/50" : "border-border hover:border-slate-300"}`}>
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${coverLetterChoice === opt.id ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500"}`}><opt.icon className="w-5 h-5" /></div>
                  <div><p className="text-sm font-medium">{opt.label}</p><p className="text-xs text-muted-foreground mt-0.5">{opt.desc}</p></div>
                </button>
              ))}
            </div>
            {coverLetterChoice === "library" && (
              <div className="space-y-2.5">
                {documents.filter(d => d.type === "cover_letter").map(c => (
                  <label key={c.id} className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition ${selectedCoverLetter === c.id ? "border-indigo-500 bg-indigo-50/50" : "border-border hover:border-slate-300"}`}>
                    <input type="radio" name="coverLetter" checked={selectedCoverLetter === c.id} onChange={() => setSelectedCoverLetter(c.id)} className="sr-only" />
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${selectedCoverLetter === c.id ? "border-indigo-600 bg-indigo-600" : "border-slate-300"}`}>{selectedCoverLetter === c.id && <div className="w-2 h-2 rounded-full bg-white" />}</div>
                    <div className="w-10 h-10 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center shrink-0"><PenTool className="w-5 h-5" /></div>
                    <div className="flex-1"><p className="text-sm font-medium">{c.name}</p><p className="text-xs text-muted-foreground">Updated {c.date}</p></div>
                  </label>
                ))}
                {documents.filter(d => d.type === "cover_letter").length === 0 && <p className="text-sm text-muted-foreground">No cover letters in your Document Center. Try generating one or uploading a file.</p>}
              </div>
            )}
            {coverLetterChoice === "upload" && (
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl p-8 hover:border-indigo-300 transition cursor-pointer">
                <Upload className="w-10 h-10 text-slate-400 mb-3" />
                <p className="text-sm font-medium">{coverFileName || "Drop your cover letter or click to browse"}</p>
                <p className="text-xs text-muted-foreground mt-1">PDF or DOCX</p>
                <input type="file" className="hidden" onChange={(e) => setCoverFileName(e.target.files?.[0]?.name || "")} accept=".pdf,.docx" />
              </label>
            )}
            {coverLetterChoice === "generate" && (
              <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-100 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <div><p className="text-sm font-medium text-indigo-900">AI will generate a cover letter</p><p className="text-xs text-indigo-700/80 mt-1">Based on your resume and the job description, we'll create a tailored cover letter. You can review and edit it in the results.</p></div>
              </div>
            )}
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-semibold">Supporting Documents <span className="text-sm font-normal text-muted-foreground">(optional)</span></h2>
              <p className="text-sm text-muted-foreground mt-1">Select certificates, diplomas, recommendation letters, and portfolio files from your Document Center.</p>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-2 text-sm text-muted-foreground"><FolderOpen className="w-4 h-4" />{selectedDocs.length} document{selectedDocs.length !== 1 ? "s" : ""} selected</div>
              <Link to="/document-center"><Button variant="ghost" size="sm" className="text-xs">Manage Documents <ArrowRight className="w-3 h-3 ml-1" /></Button></Link>
            </div>
            {documents.length === 0 ? (
              <div className="text-center py-8 text-sm text-muted-foreground">No documents available. <Link to="/document-center" className="text-indigo-600 hover:underline">Upload documents</Link> to your Document Center.</div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {documents.map(doc => (
                  <div key={doc.id} onClick={() => toggleDoc(doc.id)} className="cursor-pointer">
                    <DocumentCard doc={doc} selected={selectedDocs.includes(doc.id)} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {currentStep === 5 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-semibold">Application Checklist</h2>
              <p className="text-sm text-muted-foreground mt-1">Review which documents are ready and which are still missing before proceeding.</p>
            </div>
            <ApplicationChecklist ready={checklistReady} />
            <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <div><p className="text-sm font-semibold text-indigo-900">Ready for the Application Workspace</p><p className="text-xs text-indigo-700/80 mt-1">Open the Application Workspace to review all your materials side-by-side before starting the AI analysis.</p></div>
              </div>
            </div>
          </div>
        )}
      </Card>

      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={handleBack} disabled={currentStep === 1}><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button>
        {currentStep < 5 ? (
          <Button onClick={handleNext} disabled={!canProceed()} className="bg-indigo-600 hover:bg-indigo-700">Continue <ArrowRight className="w-4 h-4 ml-2" /></Button>
        ) : (
          <Button onClick={handleOpenWorkspace} className="bg-indigo-600 hover:bg-indigo-700"><Zap className="w-4 h-4 mr-2" /> Open Application Workspace</Button>
        )}
      </div>
    </div>
  );
}