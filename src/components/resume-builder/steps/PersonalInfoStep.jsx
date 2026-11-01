import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function PersonalInfoStep({ data, onChange }) {
  const p = data.personal;
  const set = (field, value) => onChange("personal", { ...p, [field]: value });

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold">Personal Information</h2>
        <p className="text-sm text-muted-foreground mt-1">Let's start with the basics.</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="fullName">Full Name *</Label>
          <Input id="fullName" value={p.fullName} onChange={(e) => set("fullName", e.target.value)} placeholder="Jane Doe" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="title">Professional Title</Label>
          <Input id="title" value={p.professionalTitle} onChange={(e) => set("professionalTitle", e.target.value)} placeholder="Senior Frontend Developer" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={p.email} onChange={(e) => set("email", e.target.value)} placeholder="jane@example.com" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" value={p.phone} onChange={(e) => set("phone", e.target.value)} placeholder="(555) 123-4567" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="location">Location</Label>
          <Input id="location" value={p.location} onChange={(e) => set("location", e.target.value)} placeholder="San Francisco, CA" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="linkedin">LinkedIn URL</Label>
          <Input id="linkedin" value={p.linkedin} onChange={(e) => set("linkedin", e.target.value)} placeholder="linkedin.com/in/janedoe" />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="portfolio">Portfolio / Website</Label>
          <Input id="portfolio" value={p.portfolio} onChange={(e) => set("portfolio", e.target.value)} placeholder="janedoe.dev" />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="summary">Professional Summary</Label>
        <Textarea
          id="summary"
          rows={4}
          value={p.summary}
          onChange={(e) => set("summary", e.target.value)}
          placeholder="A brief summary of your experience, strengths, and career goals…"
        />
      </div>
    </div>
  );
}