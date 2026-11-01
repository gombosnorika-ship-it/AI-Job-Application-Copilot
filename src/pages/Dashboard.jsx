import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useApp } from "@/lib/AppContext";
import {
  FileText, Target, Sparkles, PenTool, ClipboardList,
  BarChart3, ArrowRight, TrendingUp, CheckCircle2, Clock, Send, Plus,
  FolderOpen, ClipboardCheck
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hrs = Math.floor(diff / 3600000);
  if (hrs < 1) return "Just now";
  if (hrs < 24) return `${hrs} hour${hrs > 1 ? "s" : ""} ago`;
  const days = Math.floor(hrs / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
}

const quickActions = [
  { label: "Create Resume", icon: FileText, path: "/resume-builder", color: "bg-indigo-50 text-indigo-600" },
  { label: "New Application", icon: Target, path: "/new-application", color: "bg-emerald-50 text-emerald-600" },
  { label: "App Workspace", icon: ClipboardCheck, path: "/application-workspace", color: "bg-cyan-50 text-cyan-600" },
  { label: "Document Center", icon: FolderOpen, path: "/document-center", color: "bg-amber-50 text-amber-600" },
  { label: "Cover Letter", icon: PenTool, path: "/cover-letter", color: "bg-violet-50 text-violet-600" },
  { label: "Track Apps", icon: ClipboardList, path: "/tracker", color: "bg-blue-50 text-blue-600" },
];

export default function Dashboard() {
  const { resumes, applications, documents } = useApp();

  const stats = useMemo(() => {
    const total = applications.length;
    const interviewing = applications.filter(a => a.status === "interviewing" || a.status === "offer").length;
    const avgMatch = total > 0 ? Math.round(applications.reduce((s, a) => s + (a.matchScore || 0), 0) / total) : 0;
    const optimized = resumes.filter(r => r.status === "optimized").length;
    return { total, interviewRate: total > 0 ? Math.round((interviewing / total) * 100) : 0, avgMatch, activeResumes: resumes.length, optimized };
  }, [resumes, applications]);

  const weeklyData = useMemo(() => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const today = new Date();
    return days.map((day, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() - (6 - i));
      const count = applications.filter(a => new Date(a.createdDate).toDateString() === date.toDateString()).length;
      return { day, applications: count };
    });
  }, [applications]);

  const statusData = useMemo(() => [
    { name: "Applied", value: applications.filter(a => a.status === "applied").length, color: "#6366f1" },
    { name: "Interviewing", value: applications.filter(a => a.status === "interviewing").length, color: "#22c55e" },
    { name: "Pending", value: applications.filter(a => a.status === "pending" || a.status === "preparing").length, color: "#f59e0b" },
    { name: "Rejected", value: applications.filter(a => a.status === "rejected").length, color: "#ef4444" },
  ], [applications]);

  const recentActivity = useMemo(() => {
    return [...applications].sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate)).slice(0, 4).map(a => ({
      icon: a.status === "interviewing" ? Clock : a.status === "offer" ? CheckCircle2 : Send,
      text: `${a.status === "interviewing" ? "Interview scheduled" : "Applied to"} ${a.role} at ${a.company}`,
      time: timeAgo(a.createdDate),
      color: a.status === "interviewing" ? "text-amber-500" : a.status === "offer" ? "text-emerald-500" : "text-indigo-500",
    }));
  }, [applications]);

  const weeklyGoals = [
    { label: "Applications Sent", current: Math.min(stats.total, 15), target: 15 },
    { label: "Resumes Tailored", current: Math.min(stats.optimized, 5), target: 5 },
    { label: "Documents Uploaded", current: Math.min(documents.length, 10), target: 10 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Welcome back. Here's your job search overview.</p>
        </div>
        <Link to="/new-application">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 shadow-sm transition">
            <Plus className="w-4 h-4" /> New Application
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Applications", value: stats.total, change: `${stats.total} total`, icon: ClipboardList },
          { label: "Interview Rate", value: `${stats.interviewRate}%`, change: `${applications.filter(a => a.status === "interviewing").length} interviewing`, icon: TrendingUp },
          { label: "Avg Match Score", value: `${stats.avgMatch}%`, change: stats.avgMatch >= 80 ? "Strong" : "Needs work", icon: Target },
          { label: "Active Resumes", value: stats.activeResumes, change: `${stats.optimized} optimized`, icon: FileText },
        ].map((stat) => (
          <Card key={stat.label} className="p-4 sm:p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
                <p className="text-xs text-emerald-600 font-medium mt-1">{stat.change}</p>
              </div>
              <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <stat.icon className="w-4 h-4" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-4">
        <Card className="lg:col-span-3 p-5">
          <h3 className="font-semibold text-sm mb-4">Applications This Week</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#94a3b8" }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#94a3b8" }} allowDecimals={false} />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 12 }} />
                <Bar dataKey="applications" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="lg:col-span-2 p-5">
          <h3 className="font-semibold text-sm mb-4">Application Status</h3>
          <div className="h-36 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={4} dataKey="value">
                  {statusData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 justify-center">
            {statusData.map((s) => (
              <div key={s.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />{s.name}
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-5 gap-4">
        <Card className="lg:col-span-3 p-5">
          <h3 className="font-semibold text-sm mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {quickActions.map((action) => (
              <Link key={action.path} to={action.path}>
                <div className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border hover:border-indigo-200 hover:shadow-sm transition-all group cursor-pointer">
                  <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center`}>
                    <action.icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-medium text-center">{action.label}</span>
                </div>
              </Link>
            ))}
          </div>
        </Card>
        <Card className="lg:col-span-2 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm">Recent Activity</h3>
            <Link to="/tracker" className="text-xs text-indigo-600 hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {recentActivity.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-8">No activity yet. Create your first application!</p>
          ) : (
            <div className="space-y-3">
              {recentActivity.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`mt-0.5 ${item.color}`}><item.icon className="w-4 h-4" /></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground leading-snug">{item.text}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <Card className="p-5">
        <h3 className="font-semibold text-sm mb-4">Weekly Goals</h3>
        <div className="space-y-4">
          {weeklyGoals.map((goal) => (
            <div key={goal.label}>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-medium">{goal.label}</span>
                <span className="text-muted-foreground">{goal.current}/{goal.target}</span>
              </div>
              <Progress value={(goal.current / goal.target) * 100} className="h-2" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}