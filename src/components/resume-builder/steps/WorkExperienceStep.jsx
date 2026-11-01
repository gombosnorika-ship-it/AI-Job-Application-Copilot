import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Briefcase } from "lucide-react";

const emptyExp = { company: "", title: "", startDate: "", endDate: "", current: false, description: "" };

export default function WorkExperienceStep({ data, onChange }) {
  const list = data.experience;

  const update = (index, field, value) => {
    const next = list.map((e, i) => (i === index ? { ...e, [field]: value } : e));
    onChange("experience", next);
  };

  const add = () => onChange("experience", [...list, { ...emptyExp }]);
  const remove = (index) => onChange("experience", list.filter((_, i) => i !== index));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Work Experience</h2>
          <p className="text-sm text-muted-foreground mt-1">Add your most recent roles first.</p>
        </div>
        <Button variant="outline" size="sm" onClick={add}>
          <Plus className="w-4 h-4 mr-1.5" /> Add Role
        </Button>
      </div>

      {list.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl">
          <Briefcase className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground mb-4">No experience added yet.</p>
          <Button variant="outline" size="sm" onClick={add}>
            <Plus className="w-4 h-4 mr-1.5" /> Add your first role
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {list.map((exp, i) => (
            <div key={i} className="p-4 rounded-xl border border-border space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">Role {i + 1}</span>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500" onClick={() => remove(i)}>
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Job Title</Label>
                  <Input value={exp.title} onChange={(e) => update(i, "title", e.target.value)} placeholder="Frontend Developer" />
                </div>
                <div className="space-y-1.5">
                  <Label>Company</Label>
                  <Input value={exp.company} onChange={(e) => update(i, "company", e.target.value)} placeholder="Acme Inc." />
                </div>
                <div className="space-y-1.5">
                  <Label>Start Date</Label>
                  <Input type="month" value={exp.startDate} onChange={(e) => update(i, "startDate", e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label>End Date</Label>
                  <Input
                    type="month"
                    value={exp.current ? "" : exp.endDate}
                    onChange={(e) => update(i, "endDate", e.target.value)}
                    disabled={exp.current}
                    placeholder={exp.current ? "Present" : ""}
                  />
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={exp.current}
                  onChange={(e) => update(i, "current", e.target.checked)}
                  className="rounded border-input"
                />
                I currently work here
              </label>
              <div className="space-y-1.5">
                <Label>Description</Label>
                <Textarea
                  rows={3}
                  value={exp.description}
                  onChange={(e) => update(i, "description", e.target.value)}
                  placeholder="Describe your achievements and responsibilities…"
                />
              </div>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={add}>
            <Plus className="w-4 h-4 mr-1.5" /> Add another role
          </Button>
        </div>
      )}
    </div>
  );
}