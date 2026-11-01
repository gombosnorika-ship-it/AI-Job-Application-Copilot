import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FileText, PenTool, Award, GraduationCap, Star, Briefcase,
  MoreVertical, Eye, Download, Trash2, Copy, Pencil, Check
} from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

export const docTypeConfig = {
  resume: { label: "Resume", icon: FileText, color: "bg-indigo-50 text-indigo-600" },
  cover_letter: { label: "Cover Letter", icon: PenTool, color: "bg-violet-50 text-violet-600" },
  certificate: { label: "Certificate", icon: Award, color: "bg-amber-50 text-amber-600" },
  diploma: { label: "Diploma", icon: GraduationCap, color: "bg-emerald-50 text-emerald-600" },
  recommendation: { label: "Recommendation", icon: Star, color: "bg-rose-50 text-rose-600" },
  portfolio: { label: "Portfolio", icon: Briefcase, color: "bg-blue-50 text-blue-600" },
};

export default function DocumentCard({ doc, selected, onSelect, onPreview, onDownload, onRename, onDuplicate, onDelete }) {
  const [renaming, setRenaming] = useState(false);
  const [name, setName] = useState(doc.name);
  const config = docTypeConfig[doc.type] || docTypeConfig.resume;
  const Icon = config.icon;

  const saveRename = () => {
    if (name.trim() && onRename) onRename(doc.id, name.trim());
    setRenaming(false);
  };

  return (
    <Card className={`p-5 hover:shadow-md transition-shadow group ${selected ? "ring-2 ring-indigo-500" : ""}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className={`w-10 h-10 rounded-lg ${config.color} flex items-center justify-center shrink-0`}>
            <Icon className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            {renaming ? (
              <div className="flex items-center gap-1">
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-7 text-sm"
                  onKeyDown={(e) => { if (e.key === "Enter") saveRename(); if (e.key === "Escape") setRenaming(false); }}
                  autoFocus
                />
                <Button size="icon" className="h-7 w-7 shrink-0" onClick={saveRename}>
                  <Check className="w-3.5 h-3.5" />
                </Button>
              </div>
            ) : (
              <h3 className="font-semibold text-sm truncate">{doc.name}</h3>
            )}
            <p className="text-xs text-muted-foreground mt-0.5">{config.label}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {doc.date}{doc.size ? ` · ${doc.size}` : ""}
            </p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onPreview?.(doc)}><Eye className="w-3.5 h-3.5 mr-2" /> Preview</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setRenaming(true)}><Pencil className="w-3.5 h-3.5 mr-2" /> Rename</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDuplicate?.(doc.id)}><Copy className="w-3.5 h-3.5 mr-2" /> Duplicate</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDownload?.(doc)}><Download className="w-3.5 h-3.5 mr-2" /> Download</DropdownMenuItem>
            <DropdownMenuItem className="text-red-600" onClick={() => onDelete?.(doc.id)}><Trash2 className="w-3.5 h-3.5 mr-2" /> Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {doc.score !== undefined && (
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
          {doc.statusLabel && (
            <Badge variant="outline" className={`text-[11px] ${doc.statusBadge || ""}`}>
              {doc.statusLabel}
            </Badge>
          )}
          <div className="flex items-center gap-1.5 ml-auto">
            <span className="text-[11px] text-muted-foreground">ATS Score</span>
            <span className={`text-xs font-bold ${doc.score >= 85 ? "text-emerald-600" : doc.score >= 70 ? "text-amber-600" : "text-red-500"}`}>
              {doc.score}%
            </span>
          </div>
        </div>
      )}
    </Card>
  );
}