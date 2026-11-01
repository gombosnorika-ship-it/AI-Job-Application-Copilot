import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import AIAssistant from "@/components/ai-assistant/AIAssistant";

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="lg:pl-60 pt-14 lg:pt-0 min-h-screen">
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
      <AIAssistant />
    </div>
  );
}