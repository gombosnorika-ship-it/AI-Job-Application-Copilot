import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Wrench } from "lucide-react";

export default function SkillsStep({ data, onChange }) {
  const [skill, setSkill] = useState("");
  const skills = data.skills;

  const addSkill = () => {
    const trimmed = skill.trim();
    if (trimmed && !skills.includes(trimmed)) {
      onChange("skills", [...skills, trimmed]);
    }
    setSkill("");
  };

  const removeSkill = (s) => onChange("skills", skills.filter((x) => x !== s));

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold">Skills</h2>
        <p className="text-sm text-muted-foreground mt-1">Add your technical and soft skills. Press Enter or click Add.</p>
      </div>

      <div className="flex gap-2">
        <Input
          value={skill}
          onChange={(e) => setSkill(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="e.g. React, TypeScript, Project Management"
        />
        <Button onClick={addSkill} className="bg-indigo-600 hover:bg-indigo-700 shrink-0">
          <Plus className="w-4 h-4 mr-1.5" /> Add
        </Button>
      </div>

      {skills.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl">
          <Wrench className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">No skills added yet. Start typing above.</p>
        </div>
      ) : (
        <div>
          <Label className="mb-3 block">{skills.length} skill{skills.length !== 1 ? "s" : ""} added</Label>
          <div className="flex flex-wrap gap-2">
            {skills.map((s) => (
              <Badge key={s} variant="secondary" className="pl-3 pr-1.5 py-1.5 text-sm gap-1.5">
                {s}
                <button onClick={() => removeSkill(s)} className="ml-1 rounded-full hover:bg-slate-200 p-0.5">
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}