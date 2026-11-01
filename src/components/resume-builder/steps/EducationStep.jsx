import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, GraduationCap } from "lucide-react";

const emptyEdu = { school: "", degree: "", field: "", startDate: "", endDate: "", gpa: "" };

export default function EducationStep({ data, onChange }) {
  const list = data.education;

  const update = (index, field, value) => {
    const next = list.map((e, i) => (i === index ? { ...e, [field]: value } : e));
    onChange("education", next);
  };

  const add = () => onChange("education", [...list, { ...emptyEdu }]);
  const remove = (index) => onChange("education", list.filter((_, i) => i !== index));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Education</h2>
          <p className="text-sm text-muted-foreground mt-1">Add your academic background.</p>
        </div>
        <Button variant="outline" size="sm" onClick={add}>
          <Plus className="w-4 h-4 mr-1.5" /> Add Education
        </Button>
      </div>

      {list.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl">
          <GraduationCap className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground mb-4">No education added yet.</p>
          <Button variant="outline" size="sm" onClick={add}>
            <Plus className="w-4 h-4 mr-1.5" /> Add your first entry
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {list.map((edu, i) => (
            <div key={i} className="p-4 rounded-xl border border-border space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">Entry {i + 1}</span>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500" onClick={() => remove(i)}>
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>School / University</Label>
                  <Input value={edu.school} onChange={(e) => update(i, "school", e.target.value)} placeholder="Stanford University" />
                </div>
                <div className="space-y-1.5">
                  <Label>Degree</Label>
                  <Input value={edu.degree} onChange={(e) => update(i, "degree", e.target.value)} placeholder="B.S." />
                </div>
                <div className="space-y-1.5">
                  <Label>Field of Study</Label>
                  <Input value={edu.field} onChange={(e) => update(i, "field", e.target.value)} placeholder="Computer Science" />
                </div>
                <div className="space-y-1.5">
                  <Label>GPA (optional)</Label>
                  <Input value={edu.gpa} onChange={(e) => update(i, "gpa", e.target.value)} placeholder="3.8" />
                </div>
                <div className="space-y-1.5">
                  <Label>Start Date</Label>
                  <Input type="month" value={edu.startDate} onChange={(e) => update(i, "startDate", e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label>End Date</Label>
                  <Input type="month" value={edu.endDate} onChange={(e) => update(i, "endDate", e.target.value)} />
                </div>
              </div>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={add}>
            <Plus className="w-4 h-4 mr-1.5" /> Add another entry
          </Button>
        </div>
      )}
    </div>
  );
}