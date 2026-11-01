import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useApp } from "@/lib/AppContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Zap } from "lucide-react";

export default function AnalysisInput({ onResumeChange, onJobChange, onAnalyze, selectedResume, jobText, ctaLabel = "Analyze" }) {
  const { resumes } = useApp();
  return (
    <Card className="p-5 space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-xs">Select Resume</Label>
          <Select value={selectedResume || ""} onValueChange={onResumeChange}>
            <SelectTrigger className="h-10"><SelectValue placeholder="Choose a resume" /></SelectTrigger>
            <SelectContent>
              {resumes.length === 0 ? <SelectItem value="none" disabled>No resumes available</SelectItem> :
                resumes.map(r => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-end">
          <Button onClick={onAnalyze} disabled={!selectedResume || !jobText?.trim()} className="w-full h-10 bg-indigo-600 hover:bg-indigo-700">
            <Zap className="w-4 h-4 mr-2" /> {ctaLabel}
          </Button>
        </div>
      </div>
      <div className="space-y-2">
        <Label className="text-xs">Job Description</Label>
        <Textarea placeholder="Paste the job description here..." className="min-h-[120px] resize-none text-sm" value={jobText || ""} onChange={(e) => onJobChange(e.target.value)} />
      </div>
    </Card>
  );
}