import React from "react";
import { Check } from "lucide-react";

export default function StepProgress({ steps, currentStep, completedSteps }) {
  return (
    <div className="w-full">
      {/* Desktop horizontal stepper */}
      <div className="hidden sm:flex items-center justify-between max-w-3xl mx-auto">
        {steps.map((step, i) => {
          const isComplete = completedSteps.includes(step.id);
          const isCurrent = currentStep === step.id;
          const isLast = i === steps.length - 1;
          return (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center gap-2 relative z-10">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 shrink-0 ${
                    isComplete
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                      : isCurrent
                      ? "bg-white text-indigo-600 border-2 border-indigo-600 shadow-md shadow-indigo-100"
                      : "bg-slate-100 text-slate-400 border-2 border-slate-200"
                  }`}
                >
                  {isComplete ? <Check className="w-5 h-5" /> : step.id}
                </div>
                <span
                  className={`text-xs font-medium whitespace-nowrap ${
                    isCurrent || isComplete ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {!isLast && (
                <div className="flex-1 h-0.5 mx-2 -mt-6 relative">
                  <div className="absolute inset-0 bg-slate-200 rounded-full" />
                  <div
                    className={`absolute inset-0 bg-indigo-600 rounded-full transition-all duration-500 ${
                      isComplete ? "w-full" : "w-0"
                    }`}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Mobile compact stepper */}
      <div className="sm:hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold">
            Step {currentStep} of {steps.length}
          </span>
          <span className="text-xs text-muted-foreground">
            {steps.find((s) => s.id === currentStep)?.label}
          </span>
        </div>
        <div className="flex gap-1.5">
          {steps.map((step) => {
            const isComplete = completedSteps.includes(step.id);
            const isCurrent = currentStep === step.id;
            return (
              <div
                key={step.id}
                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                  isComplete ? "bg-indigo-600" : isCurrent ? "bg-indigo-400" : "bg-slate-200"
                }`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}