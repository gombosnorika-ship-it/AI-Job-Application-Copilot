import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, PenTool, Package, Download, Check } from "lucide-react";

export default function ExportCenter({ onDownloadResume, onDownloadCoverLetter, onDownloadPackage }) {
  const exports = [
    { icon: FileText, title: "Optimized Resume", desc: "AI-optimized resume with all suggested changes applied", formats: ["PDF"], color: "bg-indigo-50 text-indigo-600", badge: "Ready", onClick: onDownloadResume },
    { icon: PenTool, title: "Tailored Cover Letter", desc: "Personalized cover letter for this specific role", formats: ["PDF"], color: "bg-violet-50 text-violet-600", badge: "Ready", onClick: onDownloadCoverLetter },
    { icon: Package, title: "Complete Application Package", desc: "All documents bundled: resume, cover letter, and job description", formats: ["PDF"], color: "bg-emerald-50 text-emerald-600", badge: "Recommended", onClick: onDownloadPackage },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Export Center</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Download your optimized application materials</p>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        {exports.map((item, i) => (
          <Card key={i} className="p-5 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center`}><item.icon className="w-5 h-5" /></div>
              <Badge variant="outline" className={`text-xs ${item.badge === "Recommended" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-slate-50 text-slate-600 border-slate-200"}`}>
                {item.badge === "Recommended" && <Check className="w-3 h-3 mr-1" />}{item.badge}
              </Badge>
            </div>
            <h3 className="font-semibold text-sm">{item.title}</h3>
            <p className="text-xs text-muted-foreground mt-1 mb-4 flex-1">{item.desc}</p>
            <div className="flex items-center gap-2 mb-3">{item.formats.map(f => <Badge key={f} variant="outline" className="text-xs">{f}</Badge>)}</div>
            <Button className="w-full" variant="outline" onClick={item.onClick} disabled={!item.onClick}>
              <Download className="w-4 h-4 mr-2" /> Download
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}