import React, { useState, useMemo, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Search, FolderOpen } from "lucide-react";
import DocumentCard from "@/components/DocumentCard";
import DocumentPreviewDialog from "@/components/DocumentPreviewDialog";
import { useApp } from "@/lib/AppContext";
import { downloadTextFile } from "@/lib/exportService";
import { toast } from "@/components/ui/use-toast";

const typeFilters = [
  { id: "all", label: "All" },
  { id: "cover_letter", label: "Cover Letters" },
  { id: "certificate", label: "Certificates" },
  { id: "diploma", label: "Diplomas" },
  { id: "recommendation", label: "Recommendations" },
  { id: "portfolio", label: "Portfolio" },
];

function detectType(filename) {
  const l = filename.toLowerCase();
  if (l.includes("cover") || l.includes("letter")) return "cover_letter";
  if (l.includes("cert")) return "certificate";
  if (l.includes("diplo") || l.includes("degree") || l.includes("transcript")) return "diploma";
  if (l.includes("recommend") || l.includes("ref")) return "recommendation";
  if (l.includes("portfolio") || l.includes("project")) return "portfolio";
  return "cover_letter";
}

export default function DocumentCenter() {
  const { documents, addDocument, updateDocument, deleteDocument, duplicateDocument } = useApp();
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [previewDoc, setPreviewDoc] = useState(null);
  const fileRef = useRef(null);

  const filtered = useMemo(() => {
    let result = documents;
    if (activeFilter !== "all") result = result.filter(d => d.type === activeFilter);
    if (search.trim()) result = result.filter(d => d.name.toLowerCase().includes(search.toLowerCase()));
    return [...result].sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return new Date(b.createdDate) - new Date(a.createdDate);
    });
  }, [documents, activeFilter, search, sortBy]);

  const handleUpload = (e) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      const size = file.size > 1024 * 1024 ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` : `${Math.round(file.size / 1024)} KB`;
      addDocument({ name: file.name, type: detectType(file.name), size });
    });
    if (files.length > 0) toast({ title: "Document uploaded", description: `${files.length} file${files.length > 1 ? "s" : ""} added to your Document Center.` });
    e.target.value = "";
  };

  const handleRename = (id, newName) => { updateDocument(id, { name: newName }); toast({ title: "Document renamed" }); };
  const handleDuplicate = (id) => { duplicateDocument(id); toast({ title: "Document duplicated" }); };
  const handleDelete = (id) => { deleteDocument(id); toast({ title: "Document deleted", description: "The document has been removed." }); };
  const handleDownload = (doc) => downloadTextFile(`Document: ${doc.name}\nType: ${doc.type}\nDate: ${doc.date}${doc.size ? `\nSize: ${doc.size}` : ""}`, doc.name.replace(/\.\w+$/, ".txt"));
  const handlePreview = (doc) => setPreviewDoc(doc);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Document Center</h1>
          <p className="text-sm text-muted-foreground mt-1">Upload, organize, and manage all your application documents.</p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={() => fileRef.current?.click()}><Upload className="w-4 h-4 mr-2" /> Upload Document</Button>
        <input type="file" ref={fileRef} className="hidden" multiple accept=".pdf,.docx,.txt,.png,.jpg,.jpeg" onChange={handleUpload} />
      </div>

      <Card className="p-6 border-2 border-dashed border-slate-200 hover:border-indigo-300 transition-colors cursor-pointer" onClick={() => fileRef.current?.click()}>
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3"><Upload className="w-6 h-6" /></div>
          <h3 className="font-semibold text-sm">Drop documents here</h3>
          <p className="text-xs text-muted-foreground mt-1 mb-4">Cover letters, certificates, diplomas, recommendations, portfolio — PDF, DOCX, PNG, JPG up to 10MB</p>
          <Button variant="outline" size="sm">Browse Files</Button>
        </div>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search documents..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
        </div>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="h-9 rounded-md border border-input bg-transparent px-3 text-sm">
          <option value="date">Sort by Date</option>
          <option value="name">Sort by Name</option>
        </select>
      </div>

      <div className="flex flex-wrap gap-2">
        {typeFilters.map(f => (
          <button key={f.id} onClick={() => setActiveFilter(f.id)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${activeFilter === f.id ? "bg-indigo-600 text-white" : "bg-slate-100 text-muted-foreground hover:bg-slate-200"}`}>{f.label}</button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <FolderOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">{search || activeFilter !== "all" ? "No documents found. Try adjusting your search or filters." : "No documents yet. Upload your first document to get started."}</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(doc => (
            <DocumentCard key={doc.id} doc={doc} onRename={handleRename} onDuplicate={handleDuplicate} onDelete={handleDelete} onPreview={handlePreview} onDownload={handleDownload} />
          ))}
        </div>
      )}

      <DocumentPreviewDialog
        open={!!previewDoc}
        onClose={() => setPreviewDoc(null)}
        title={previewDoc?.name || "Preview"}
        subtitle={previewDoc ? `${previewDoc.type?.replace("_", " ")} · ${previewDoc.date}` : ""}
        content={null}
        onDownload={() => previewDoc && handleDownload(previewDoc)}
        downloadLabel="Download"
      />
    </div>
  );
}