import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import {
  LayoutDashboard, FileText, Search, Target, Sparkles,
  PenTool, Linkedin, BarChart3, ClipboardList, User,
  LogOut, ChevronLeft, ChevronRight, Briefcase, Menu, X, Plus,
  FolderOpen, ClipboardCheck, LineChart
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "New Application", path: "/new-application", icon: Plus, highlight: true },
  { label: "App Workspace", path: "/application-workspace", icon: ClipboardCheck },
  { label: "Analysis", path: "/analysis-dashboard", icon: LineChart },
  { label: "Resume Library", path: "/resumes", icon: FileText },
  { label: "Create Resume", path: "/resume-builder", icon: Plus, highlight: true },
  { label: "Document Center", path: "/document-center", icon: FolderOpen },
  { label: "Job Analyzer", path: "/job-analyzer", icon: Search },
  { label: "AI Match Score", path: "/match-score", icon: Target },
  { label: "Resume Optimize", path: "/resume-optimization", icon: Sparkles },
  { label: "Cover Letter", path: "/cover-letter", icon: PenTool },
  { label: "LinkedIn Optimizer", path: "/linkedin", icon: Linkedin },
  { label: "Skills Gap", path: "/skills-gap", icon: BarChart3 },
  { label: "App Tracker", path: "/tracker", icon: ClipboardList },
  { label: "Profile & Settings", path: "/settings", icon: User },
];

export default function Sidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    base44.auth.logout("/login");
  };

  const NavContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2.5 px-4 h-16 border-b border-sidebar-border shrink-0">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
          <Briefcase className="w-4 h-4 text-primary-foreground" />
        </div>
        {!collapsed && (
          <span className="font-bold text-base tracking-tight whitespace-nowrap">JobCopilot</span>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-3 px-2.5 space-y-0.5">
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group
                ${active
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : item.highlight
                  ? "bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }
                ${collapsed ? "justify-center" : ""}
              `}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="w-[18px] h-[18px] shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-sidebar-border p-2.5 space-y-1 shrink-0">
        <button
          onClick={handleLogout}
          className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-red-50 hover:text-red-600 transition-all w-full ${collapsed ? "justify-center" : ""}`}
        >
          <LogOut className="w-[18px] h-[18px] shrink-0" />
          {!collapsed && <span>Log out</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-card border-b border-border z-40 flex items-center px-4">
        <Button variant="ghost" size="icon" onClick={() => setMobileOpen(true)} className="mr-3">
          <Menu className="w-5 h-5" />
        </Button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <Briefcase className="w-3.5 h-3.5 text-primary-foreground" />
          </div>
          <span className="font-bold text-sm">JobCopilot</span>
        </div>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-64 bg-card shadow-xl">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-md hover:bg-muted"
            >
              <X className="w-4 h-4" />
            </button>
            <NavContent />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex flex-col fixed left-0 top-0 bottom-0 bg-card border-r border-sidebar-border z-30 transition-all duration-200
          ${collapsed ? "w-16" : "w-60"}
        `}
      >
        <NavContent />
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-card border border-border shadow-sm flex items-center justify-center hover:bg-muted transition"
        >
          {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>
      </aside>
    </>
  );
}

export function useSidebarWidth() {
  return { desktop: "lg:pl-60", collapsed: "lg:pl-16" };
}