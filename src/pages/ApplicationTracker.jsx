import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Plus, Search, Building2, MapPin, Calendar,
  MoreVertical, Eye, Trash2, Edit, Zap
} from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useApp } from "@/lib/AppContext";

const statusConfig = {
  preparing: { label: "Preparing", color: "bg-slate-50 text-slate-600 border-slate-200" },
  applied: { label: "Applied", color: "bg-blue-50 text-blue-700 border-blue-200" },
  pending: { label: "Pending", color: "bg-amber-50 text-amber-700 border-amber-200" },
  interviewing: { label: "Interviewing", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  offer: { label: "Offer", color: "bg-violet-50 text-violet-700 border-violet-200" },
  rejected: { label: "Rejected", color: "bg-red-50 text-red-700 border-red-200" },
};

const statusOptions = ["preparing", "applied", "pending", "interviewing", "offer", "rejected"];

function AppCard({ app, onUpdate, onDelete, onNavigate }) {
  const st = statusConfig[app.status] || statusConfig.preparing;
  return (
    <Card className="p-4 hover:shadow-md transition-shadow group">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 text-sm font-bold text-slate-500">{app.company.charAt(0)}</div>
          <div>
            <h4 className="font-semibold text-sm">{app.role}</h4>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5"><Building2 className="w-3 h-3" /> {app.company}</p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"><MoreVertical className="w-4 h-4" /></Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onNavigate("/application-workspace")}><Eye className="w-3.5 h-3.5 mr-2" /> View Details</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onNavigate("/analysis-dashboard")}><Zap className="w-3.5 h-3.5 mr-2" /> View Analysis</DropdownMenuItem>
            <DropdownMenuItem className="text-red-600" onClick={() => onDelete(app.id)}><Trash2 className="w-3.5 h-3.5 mr-2" /> Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-[11px] text-muted-foreground">
        {app.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {app.location}</span>}
        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(app.createdDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
      </div>
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
        <Select value={app.status} onValueChange={(val) => onUpdate(app.id, { status: val })}>
          <SelectTrigger className="h-7 w-auto text-[10px] border-0 p-0 pr-6"><SelectValue /></SelectTrigger>
          <SelectContent>{statusOptions.map(s => <SelectItem key={s} value={s} className="capitalize text-xs">{s}</SelectItem>)}</SelectContent>
        </Select>
        <span className="text-[11px] font-medium text-indigo-600">{app.matchScore || 0}% match</span>
      </div>
    </Card>
  );
}

export default function ApplicationTracker() {
  const navigate = useNavigate();
  const { applications, updateApplication, deleteApplication } = useApp();
  const [search, setSearch] = useState("");
  const tabs = ["all", "preparing", "applied", "pending", "interviewing", "offer", "rejected"];

  const filtered = useMemo(() => {
    return applications.filter(a =>
      (tabs[0] === "all" || true) &&
      (!search || a.company.toLowerCase().includes(search.toLowerCase()) || a.role.toLowerCase().includes(search.toLowerCase()))
    );
  }, [applications, search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Application Tracker</h1>
          <p className="text-sm text-muted-foreground mt-1">Organize and track all your job applications.</p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700 shrink-0" onClick={() => navigate("/new-application")}><Plus className="w-4 h-4 mr-2" /> Add Application</Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: "Total", count: applications.length, color: "text-foreground" },
          { label: "Applied", count: applications.filter(a => a.status === "applied").length, color: "text-blue-600" },
          { label: "Interviewing", count: applications.filter(a => a.status === "interviewing").length, color: "text-emerald-600" },
          { label: "Offers", count: applications.filter(a => a.status === "offer").length, color: "text-violet-600" },
          { label: "Rejected", count: applications.filter(a => a.status === "rejected").length, color: "text-red-500" },
        ].map(s => (
          <Card key={s.label} className="p-3 text-center">
            <p className={`text-xl font-bold ${s.color}`}>{s.count}</p>
            <p className="text-[11px] text-muted-foreground">{s.label}</p>
          </Card>
        ))}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search by company or role..." className="pl-10 h-10" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {applications.length === 0 ? (
        <div className="text-center py-16">
          <Building2 className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground mb-4">No applications yet. Create your first application to start tracking.</p>
          <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={() => navigate("/new-application")}><Plus className="w-4 h-4 mr-2" /> New Application</Button>
        </div>
      ) : (
        <Tabs defaultValue="all">
          <TabsList className="mb-4 flex-wrap">
            {tabs.map(tab => <TabsTrigger key={tab} value={tab} className="capitalize text-xs">{tab}</TabsTrigger>)}
          </TabsList>
          {tabs.map(tab => {
            const list = filtered.filter(a => tab === "all" || a.status === tab);
            return (
              <TabsContent key={tab} value={tab}>
                {list.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">No applications in this category.</p>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {list.map(app => <AppCard key={app.id} app={app} onUpdate={updateApplication} onDelete={deleteApplication} onNavigate={navigate} />)}
                  </div>
                )}
              </TabsContent>
            );
          })}
        </Tabs>
      )}
    </div>
  );
}