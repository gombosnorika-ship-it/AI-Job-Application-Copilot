import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, CheckCircle2, Save } from "lucide-react";
import ProgressSidebar from "@/components/resume-builder/ProgressSidebar";
import PersonalInfoStep from "@/components/resume-builder/steps/PersonalInfoStep";
import WorkExperienceStep from "@/components/resume-builder/steps/WorkExperienceStep";
import EducationStep from "@/components/resume-builder/steps/EducationStep";
import SkillsStep from "@/components/resume-builder/steps/SkillsStep";
import PreviewStep from "@/components/resume-builder/steps/PreviewStep";
import { useApp } from "@/lib/AppContext";
import { calculateATSScore, getResumeText } from "@/lib/aiService";

const STORAGE_KEY = "jobcopilot_resume_builder";

const defaultData = {
  personal: {
    fullName: "",
    professionalTitle: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    portfolio: "",
    summary: "",
  },
  experience: [],
  education: [],
  skills: [],
};

const steps = [
  { id: "personal", label: "Personal Information", component: PersonalInfoStep },
  { id: "experience", label: "Work Experience", component: WorkExperienceStep },
  { id: "education", label: "Education", component: EducationStep },
  { id: "skills", label: "Skills", component: SkillsStep },
  { id: "preview", label: "Preview & Finalize", component: PreviewStep },
];

export default function ResumeBuilder() {
  const navigate = useNavigate();
  const { addResume } = useApp();
  const [currentStep, setCurrentStep] = useState(0);
  const [resumeData, setResumeData] = useState(defaultData);
  const [savedFlash, setSavedFlash] = useState(false);
  const [finalized, setFinalized] = useState(false);

  // Load saved progress on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setResumeData({ ...defaultData, ...parsed });
      } catch {
        /* ignore */
      }
    }
  }, []);

  // Auto-save whenever data changes
  useEffect(() => {
    const t = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(resumeData));
      setSavedFlash(true);
      const flash = setTimeout(() => setSavedFlash(false), 1800);
      return () => clearTimeout(flash);
    }, 500);
    return () => clearTimeout(t);
  }, [resumeData]);

  const updateField = useCallback((field, value) => {
    setResumeData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const isStepComplete = (index) => {
    if (index === 0) return resumeData.personal.fullName.trim() !== "";
    if (index === 1) return resumeData.experience.some((e) => e.company?.trim());
    if (index === 2) return resumeData.education.some((e) => e.school?.trim());
    if (index === 3) return resumeData.skills.length > 0;
    if (index === 4) return finalized;
    return false;
  };

  const canAdvance = () => {
    if (currentStep === 4) return true;
    return isStepComplete(currentStep);
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((s) => s + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleFinalize = () => {
    setFinalized(true);
    localStorage.removeItem(STORAGE_KEY);
    const content = getResumeText({ data: resumeData });
    addResume({
      name: `${resumeData.personal.fullName || "New"}_Resume.pdf`,
      role: resumeData.personal.professionalTitle || "Custom Resume",
      content,
      data: resumeData,
      atsScore: calculateATSScore(content),
      status: "draft",
    });
  };

  const StepComponent = steps[currentStep].component;
  const isLastStep = currentStep === steps.length - 1;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Create Your Resume</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Step {currentStep + 1} of {steps.length} — your progress saves automatically.
          </p>
        </div>
        <div
          className={`flex items-center gap-1.5 text-xs font-medium transition-opacity ${
            savedFlash ? "opacity-100 text-emerald-600" : "opacity-0"
          }`}
        >
          <Save className="w-3.5 h-3.5" /> Progress saved
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Progress sidebar */}
        <ProgressSidebar
          steps={steps.map((s, i) => ({
            ...s,
            complete: isStepComplete(i),
            active: i === currentStep,
          }))}
          currentStep={currentStep}
          onSelect={(i) => setCurrentStep(i)}
        />

        {/* Step content */}
        <div className="flex-1 min-w-0">
          <Card className="p-6 sm:p-8">
            <StepComponent
              data={resumeData}
              onChange={updateField}
              onFinalize={handleFinalize}
              finalized={finalized}
            />

            {/* Navigation */}
            {!finalized && (
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={currentStep === 0}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </Button>

                {isLastStep ? (
                  <Button
                    className="bg-indigo-600 hover:bg-indigo-700"
                    onClick={handleFinalize}
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" /> Finalize Resume
                  </Button>
                ) : (
                  <Button
                    className="bg-indigo-600 hover:bg-indigo-700"
                    onClick={handleNext}
                    disabled={!canAdvance()}
                  >
                    Continue <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            )}

            {finalized && (
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
                <div className="flex items-center gap-2 text-emerald-600 text-sm font-medium">
                  <CheckCircle2 className="w-5 h-5" /> Resume finalized and saved!
                </div>
                <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={() => navigate("/resumes")}>
                  Go to Resume Manager
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}