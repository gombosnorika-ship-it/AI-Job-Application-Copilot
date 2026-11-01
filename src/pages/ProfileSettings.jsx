import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { User, Mail, MapPin, Globe, Bell, Shield, Palette, Save, Camera, CheckCircle2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useApp } from "@/lib/AppContext";

export default function ProfileSettings() {
  const { settings, updateSettings } = useApp();
  const [form, setForm] = useState(settings);
  const [saved, setSaved] = useState(false);

  useEffect(() => { setForm(settings); }, [settings]);

  const setField = (field, value) => setForm(prev => ({ ...prev, [field]: value }));
  const setPref = (field, value) => setForm(prev => ({ ...prev, preferences: { ...prev.preferences, [field]: value } }));
  const setNotif = (field, value) => setForm(prev => ({ ...prev, notifications: { ...prev.notifications, [field]: value } }));

  const handleSave = () => {
    updateSettings(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handlePrefChange = (field, value) => { setPref(field, value); updateSettings({ preferences: { ...form.preferences, [field]: value } }); };
  const handleNotifChange = (field, value) => { setNotif(field, value); updateSettings({ notifications: { ...form.notifications, [field]: value } }); };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Profile & Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your personal information and preferences.</p>
        </div>
        {saved && <div className="flex items-center gap-1.5 text-sm text-emerald-600 font-medium"><CheckCircle2 className="w-4 h-4" /> Settings saved</div>}
      </div>

      <Tabs defaultValue="profile">
        <TabsList className="mb-6">
          <TabsTrigger value="profile" className="text-xs"><User className="w-3.5 h-3.5 mr-1.5" /> Profile</TabsTrigger>
          <TabsTrigger value="preferences" className="text-xs"><Palette className="w-3.5 h-3.5 mr-1.5" /> Preferences</TabsTrigger>
          <TabsTrigger value="notifications" className="text-xs"><Bell className="w-3.5 h-3.5 mr-1.5" /> Notifications</TabsTrigger>
          <TabsTrigger value="security" className="text-xs"><Shield className="w-3.5 h-3.5 mr-1.5" /> Security</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card className="p-5">
            <h3 className="font-semibold text-sm mb-4">Personal Information</h3>
            <div className="flex items-center gap-4 mb-6">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600"><User className="w-7 h-7" /></div>
                <button className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-700 transition"><Camera className="w-3 h-3" /></button>
              </div>
              <div><p className="font-semibold text-sm">{form.fullName || "Your Name"}</p><p className="text-xs text-muted-foreground">{form.email || "your@email.com"}</p></div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2"><Label className="text-xs">Full Name</Label><Input value={form.fullName || ""} onChange={(e) => setField("fullName", e.target.value)} className="h-10" /></div>
              <div className="space-y-2"><Label className="text-xs">Headline</Label><Input value={form.headline || ""} onChange={(e) => setField("headline", e.target.value)} className="h-10" /></div>
              <div className="space-y-2"><Label className="text-xs">Email</Label><div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input value={form.email || ""} onChange={(e) => setField("email", e.target.value)} className="h-10 pl-10" /></div></div>
              <div className="space-y-2"><Label className="text-xs">Phone</Label><Input value={form.phone || ""} onChange={(e) => setField("phone", e.target.value)} className="h-10" /></div>
              <div className="space-y-2"><Label className="text-xs">Location</Label><div className="relative"><MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input value={form.location || ""} onChange={(e) => setField("location", e.target.value)} className="h-10 pl-10" /></div></div>
              <div className="space-y-2"><Label className="text-xs">LinkedIn URL</Label><div className="relative"><Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input value={form.linkedin || ""} onChange={(e) => setField("linkedin", e.target.value)} className="h-10 pl-10" /></div></div>
            </div>
            <div className="space-y-2 mt-4"><Label className="text-xs">Professional Summary</Label><Textarea value={form.summary || ""} onChange={(e) => setField("summary", e.target.value)} className="min-h-[80px] resize-none text-sm" /></div>
          </Card>

          <Card className="p-5">
            <h3 className="font-semibold text-sm mb-4">Job Preferences</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2"><Label className="text-xs">Desired Role</Label><Input value={form.targetRole || ""} onChange={(e) => setField("targetRole", e.target.value)} className="h-10" /></div>
              <div className="space-y-2"><Label className="text-xs">Industry</Label>
                <Select value={form.industry || "tech"} onValueChange={(v) => setField("industry", v)}><SelectTrigger className="h-10"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="tech">Technology</SelectItem><SelectItem value="finance">Finance</SelectItem><SelectItem value="healthcare">Healthcare</SelectItem><SelectItem value="education">Education</SelectItem></SelectContent></Select>
              </div>
              <div className="space-y-2"><Label className="text-xs">Experience Level</Label>
                <Select value={form.experienceLevel || "senior"} onValueChange={(v) => setField("experienceLevel", v)}><SelectTrigger className="h-10"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="entry">Entry Level</SelectItem><SelectItem value="mid">Mid Level</SelectItem><SelectItem value="senior">Senior Level</SelectItem><SelectItem value="lead">Lead / Principal</SelectItem></SelectContent></Select>
              </div>
              <div className="space-y-2"><Label className="text-xs">Work Type</Label>
                <Select value={form.workType || "hybrid"} onValueChange={(v) => setField("workType", v)}><SelectTrigger className="h-10"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="remote">Remote</SelectItem><SelectItem value="hybrid">Hybrid</SelectItem><SelectItem value="onsite">On-site</SelectItem></SelectContent></Select>
              </div>
            </div>
            <div className="flex justify-end mt-6"><Button className="bg-indigo-600 hover:bg-indigo-700" onClick={handleSave}><Save className="w-4 h-4 mr-2" /> Save Changes</Button></div>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6">
          <Card className="p-5 space-y-5">
            <h3 className="font-semibold text-sm">Application Preferences</h3>
            <div className="space-y-4">
              {[
                { key: "autoOptimize", label: "Auto-optimize resume for each application", desc: "Automatically tailor your resume to match job descriptions." },
                { key: "coverLetterSuggestions", label: "Generate cover letter suggestions", desc: "Receive AI cover letter drafts when analyzing jobs." },
                { key: "trackDeadlines", label: "Track application deadlines", desc: "Get reminders for upcoming application deadlines." },
                { key: "weeklyReports", label: "Weekly progress reports", desc: "Receive a weekly summary of your job search progress." },
              ].map(pref => (
                <div key={pref.key} className="flex items-center justify-between">
                  <div><p className="text-sm font-medium">{pref.label}</p><p className="text-xs text-muted-foreground mt-0.5">{pref.desc}</p></div>
                  <Switch checked={form.preferences?.[pref.key] || false} onCheckedChange={(v) => handlePrefChange(pref.key, v)} />
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="p-5 space-y-5">
            <h3 className="font-semibold text-sm">Email Notifications</h3>
            <div className="space-y-4">
              {[
                { key: "statusUpdates", label: "Application status updates" },
                { key: "jobMatches", label: "New job matches" },
                { key: "interviewReminders", label: "Interview reminders" },
                { key: "weeklyDigest", label: "Weekly digest" },
                { key: "productUpdates", label: "Product updates" },
              ].map(notif => (
                <div key={notif.key} className="flex items-center justify-between"><p className="text-sm font-medium">{notif.label}</p><Switch checked={form.notifications?.[notif.key] || false} onCheckedChange={(v) => handleNotifChange(notif.key, v)} /></div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className="p-5 space-y-4">
            <h3 className="font-semibold text-sm">Change Password</h3>
            <div className="space-y-3 max-w-md">
              <div className="space-y-2"><Label className="text-xs">Current Password</Label><Input type="password" placeholder="••••••••" className="h-10" /></div>
              <div className="space-y-2"><Label className="text-xs">New Password</Label><Input type="password" placeholder="••••••••" className="h-10" /></div>
              <div className="space-y-2"><Label className="text-xs">Confirm New Password</Label><Input type="password" placeholder="••••••••" className="h-10" /></div>
              <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2500); }}>Update Password</Button>
            </div>
          </Card>
          <Card className="p-5">
            <h3 className="font-semibold text-sm mb-2">Danger Zone</h3>
            <p className="text-xs text-muted-foreground mb-4">Once you delete your account, there is no going back.</p>
            <Button variant="destructive" size="sm">Delete Account</Button>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}