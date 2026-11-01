import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";

export default function DocumentPreviewDialog({ open, onClose, title, subtitle, content, onDownload, downloadLabel = "Download" }) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            {title}
          </DialogTitle>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </DialogHeader>
        <div className="overflow-y-auto max-h-[55vh] p-5 bg-slate-50 rounded-lg border border-slate-100">
          {content ? (
            <pre className="text-sm text-foreground whitespace-pre-wrap font-body leading-relaxed">{content}</pre>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="w-10 h-10 text-slate-300 mb-3" />
              <p className="text-sm text-muted-foreground">No preview content available for this file type.</p>
              <p className="text-xs text-muted-foreground mt-1">Use the download button to access the original file.</p>
            </div>
          )}
        </div>
        <DialogFooter>
          {onDownload && <Button onClick={onDownload}><Download className="w-4 h-4 mr-2" /> {downloadLabel}</Button>}
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}