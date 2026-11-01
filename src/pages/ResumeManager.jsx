import React, { useState, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Plus, Search, FileText } from "lucide-react";
import DocumentCard from "@/components/DocumentCard";
import DocumentPreviewDialog from "@/components/DocumentPreviewDialog";
import { useApp } from "@/lib/AppContext";
import { downloadResumePDF } from "@/lib/exportService";
import { calculateATSScore, getResumeText } from "@/lib/aiService";
import { toast } from "@/components/ui/use-toast";

const statusConfig = {
  optimized: { label: "Optimized", badge: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  needs_review: { label: "Needs Review", badge: "bg-amber-50 text-amber-700 border-amber-200" },
  draft: { label: "Draft", badge: "bg-slate-50 text-slate-600 border-slate-200" },
};

export default function ResumeManager() {
  const { resumes, addResume, updateResume, deleteResume, duplicateResume } = useApp();
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [dragActive, setDragActive] = useState(false);
  const [previewDoc, setPreviewDoc] = useState(null);
  const fileRef = useRef(null);

  const filtered = useMemo(() => {
    let result = resumes;
    if (search.trim()) {
      result = result.filter(r => r.name.toLowerCase().includes(search.toLowerCase()) || (r.role || "").toLowerCase().includes(search.toLowerCase()));
    }
    return [...result].sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "ats") return (b.atsScore || 0) - (a.atsScore || 0);
      return new Date(b.createdDate) - new Date(a.createdDate);
    });
  }, [resumes, search, sortBy]);

  const handleUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const content = typeof reader.result === "string" ? reader.result : "";
      const ats = calculateATSScore(content);
      addResume({ name: file.name, role: "Uploaded Resume", content, atsScore: ats, status: ats >= 75 ? "optimized" : "needs_review" });
      toast({ title: "Resume uploaded", description: `${file.name} has been added to your library.` });
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleRename = (id, newName) => { updateResume(id, { name: newName }); toast({ title: "Resume renamed" }); };
  const handleDuplicate = (id) => { duplicateResume(id); toast({ title: "Resume duplicated" }); };
  const handleDelete = (id) => { deleteResume(id); toast({ title: "Resume deleted", description: "The resume has been removed from your library." }); };
  const handleDownload = (doc) => { const resume = resumes.find(r => r.id === doc.id); if (resume) downloadResumePDF(resume); };
  const handlePreview = (doc) => { const resume = resumes.find(r => r.id === doc.id); setPreviewDoc({ ...doc, content: resume?.content || getResumeText(resume) || "" }); };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Resume Library</h1>
          <p className="text-sm text-muted-foreground mt-1">Upload, create, and manage your resumes.</p>
        </div>
        <Link to="/resume-builder"><Button className="bg-indigo-600 hover:bg-indigo-700"><Plus className="w-4 h-4 mr-2" /> New Resume</Button></Link>
      </div>

      <Card
        className={`p-8 border-2 border-dashed transition-colors cursor-pointer ${dragActive ? "border-indigo-400 bg-indigo-50/50" : "border-slate-200 hover:border-indigo-300"}`}
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => { e.preventDefault(); setDragActive(false); if (e.dataTransfer.files?.[0]) { handleUpload({ target: { files: e.dataTransfer.files, value: "" } }); } }}
        onClick={() => fileRef.current?.click()}
      >
        <input type="file" ref={fileRef} className="hidden" accept=".pdf,.docx,.txt" onChange={handleUpload} />
        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4"><Upload className="w-6 h-6" /></div>
          <h3 className="font-semibold text-sm">Drop your resume here</h3>
          <p className="text-xs text-muted-foreground mt-1 mb-4">PDF, DOCX, or TXT — up to 10MB</p>
          <Button variant="outline" size="sm">Browse Files</Button>
        </div>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search resumes..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
        </div>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="h-9 rounded-md border border-input bg-transparent px-3 text-sm">
          <option value="date">Sort by Date</option>
          <option value="name">Sort by Name</option>
          <option value="ats">Sort by ATS Score</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">{search ? "No resumes found. Try adjusting your search." : "No resumes yet. Upload one or create a new resume to get started."}</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {filtered.map((resume) => {
            const st = statusConfig[resume.status] || statusConfig.draft;
            return (
              <DocumentCard
                key={resume.id}
                doc={{ ...resume, date: new Date(resume.updatedDate || resume.createdDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }), score: resume.atsScore, statusLabel: st.label, statusBadge: st.badge }}
                onRename={handleRename}
                onDuplicate={handleDuplicate}
                onDelete={handleDelete}
                onPreview={handlePreview}
                onDownload={handleDownload}
              />
            );
          })}
        </div>
      )}

      <DocumentPreviewDialog
        open={!!previewDoc}
        onClose={() => setPreviewDoc(null)}
        title={previewDoc?.name || "Preview"}
        subtitle={previewDoc?.role}
        content={previewDoc?.content}
        onDownload={() => previewDoc && handleDownload(previewDoc)}
        downloadLabel="Download PDF"
      />
    </div>
  );
}