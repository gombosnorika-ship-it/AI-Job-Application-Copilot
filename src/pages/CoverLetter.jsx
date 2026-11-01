import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { PenTool, Wand2, Copy, Download, RefreshCw, CheckCircle2, Loader2, Save } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useApp } from "@/lib/AppContext";
import { generateCoverLetter } from "@/lib/aiService";
import { downloadCoverLetterPDF } from "@/lib/exportService";

export default function CoverLetter() {
  const { resumes, settings, addDocument } = useApp();
  const [selectedResume, setSelectedResume] = useState(resumes[0]?.id || "");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [tone, setTone] = useState("professional");
  const [notes, setNotes] = useState("");
  const [generated, setGenerated] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleGenerate = () => {
    setLoading(true);
    setTimeout(() => {
      const resume = resumes.find(r => r.id === selectedResume);
      const jobText = `${role} at ${company}. ${notes}`;
      const letter = generateCoverLetter(resume, jobText, settings);
      setGenerated(letter);
      setLoading(false);
    }, 1200);
  };

  const handleCopy = () => { navigator.clipboard.writeText(generated); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const handleDownload = () => downloadCoverLetterPDF(generated, `Cover_Letter_${company || "Application"}`);
  const handleSave = () => { addDocument({ name: `Cover_Letter_${company || "Application"}.pdf`, type: "cover_letter", size: "245 KB" }); toast({ title: "Saved to Document Center", description: "Your cover letter has been saved." }); };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Cover Letter Generator</h1>
        <p className="text-sm text-muted-foreground mt-1">Generate personalized cover letters tailored to each job.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Card className="p-5 space-y-4">
            <h3 className="font-semibold text-sm">Input Details</h3>
            <div className="space-y-2">
              <Label className="text-xs">Select Resume</Label>
              <Select value={selectedResume} onValueChange={setSelectedResume}>
                <SelectTrigger className="h-10"><SelectValue placeholder="Choose a resume" /></SelectTrigger>
                <SelectContent>{resumes.length === 0 ? <SelectItem value="none" disabled>No resumes available</SelectItem> : resumes.map(r => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label className="text-xs">Company Name</Label><Input placeholder="e.g., Acme Corp" className="h-10" value={company} onChange={(e) => setCompany(e.target.value)} /></div>
            <div className="space-y-2"><Label className="text-xs">Job Title</Label><Input placeholder="e.g., Senior Frontend Developer" className="h-10" value={role} onChange={(e) => setRole(e.target.value)} /></div>
            <div className="space-y-2"><Label className="text-xs">Tone</Label>
              <Select value={tone} onValueChange={setTone}><SelectTrigger className="h-10"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="professional">Professional</SelectItem><SelectItem value="enthusiastic">Enthusiastic</SelectItem><SelectItem value="confident">Confident</SelectItem><SelectItem value="conversational">Conversational</SelectItem></SelectContent></Select>
            </div>
            <div className="space-y-2"><Label className="text-xs">Additional Notes (optional)</Label><Textarea placeholder="Anything specific you'd like to highlight..." className="min-h-[80px] resize-none text-sm" value={notes} onChange={(e) => setNotes(e.target.value)} /></div>
            <Button className="w-full bg-indigo-600 hover:bg-indigo-700" onClick={handleGenerate} disabled={!selectedResume || !company || !role || loading}>
              {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating...</> : <><Wand2 className="w-4 h-4 mr-2" /> Generate Cover Letter</>}
            </Button>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm flex items-center gap-2"><PenTool className="w-4 h-4 text-indigo-500" /> Generated Cover Letter</h3>
              {generated && (
                <div className="flex items-center gap-1.5">
                  <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={handleCopy}>{copied ? <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 mr-1" />}{copied ? "Copied" : "Copy"}</Button>
                  <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={handleDownload}><Download className="w-3.5 h-3.5 mr-1" /> Export</Button>
                  <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={handleGenerate}><RefreshCw className="w-3.5 h-3.5 mr-1" /> Regenerate</Button>
                </div>
              )}
            </div>
            {generated ? (
              <div>
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                  <pre className="text-sm text-foreground whitespace-pre-wrap font-body leading-relaxed">{generated}</pre>
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <Badge className="bg-indigo-50 text-indigo-700 border-indigo-200 text-[10px]">{generated.split(/\s+/).length} words</Badge>
                  <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] capitalize">{tone} tone</Badge>
                  <Badge className="bg-violet-50 text-violet-700 border-violet-200 text-[10px]">Tailored to job</Badge>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-4" onClick={handleSave}><Save className="w-3.5 h-3.5 mr-1.5" /> Save to Document Center</Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4"><PenTool className="w-6 h-6 text-slate-400" /></div>
                <h4 className="font-semibold text-sm text-slate-600">No letter generated yet</h4>
                <p className="text-xs text-muted-foreground mt-1 max-w-xs">Fill in the details and click Generate to create a tailored cover letter.</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}