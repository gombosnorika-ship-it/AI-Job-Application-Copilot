import React from "react";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Circle, Save } from "lucide-react";

export default function ProgressSidebar({ steps, currentStep, onSelect }) {
  return (
    <div className="lg:w-64 shrink-0">
      <Card className="p-4 lg:sticky lg:top-6">
        <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-4 px-1">
          <Save className="w-3.5 h-3.5" /> Auto-saving
        </div>
        <ol className="space-y-1">
          {steps.map((step, i) => {
            const active = i === currentStep;
            return (
              <li key={step.id}>
                <button
                  onClick={() => onSelect(i)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-left transition-colors ${
                    active
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  <span className="shrink-0">
                    {step.complete ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <Circle
                        className={`w-5 h-5 ${active ? "text-indigo-400" : "text-slate-300"}`}
                      />
                    )}
                  </span>
                  <span className="truncate">{step.label}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </Card>
    </div>
  );
}