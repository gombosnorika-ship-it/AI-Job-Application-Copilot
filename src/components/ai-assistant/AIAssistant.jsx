import React, { useState, useRef, useEffect } from "react";
import { Sparkles, X, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useApp } from "@/lib/AppContext";
import { base44 } from "@/api/base44Client";

const initialMessage = {
  role: "assistant",
  text: "Hi! I'm your AI Assistant. I can help you with your resumes, cover letters, job applications, documents, and any feature in the app. What would you like to know?",
};

function buildContext(app) {
  const resumes = app.resumes.map(r => `${r.name} (${r.role}, ATS ${r.atsScore}%)`).join("; ") || "none";
  const docs = app.documents.map(d => `${d.name} (${d.type})`).join("; ") || "none";
  const apps = app.applications.map(a => `${a.role} at ${a.company} (${a.status})`).join("; ") || "none";
  return `You are an AI assistant for JobCopilot, a job application platform. The user has:
- Resumes: ${resumes}
- Documents: ${docs}
- Applications: ${apps}
- Target role: ${app.settings?.targetRole || "not set"}
Answer the user's question helpfully and concisely (2-4 sentences). Reference their actual data when relevant. Be encouraging and practical.`;
}

function getFallbackResponse(question, app) {
  const l = question.toLowerCase();
  if (l.includes("resume")) return `You have ${app.resumes.length} resume(s). ${app.resumes[0] ? `Your top resume is "${app.resumes[0].name}" with an ATS score of ${app.resumes[0].atsScore}%.` : ""} Try the Resume Optimization tool to improve it.`;
  if (l.includes("cover letter")) return "You can generate a tailored cover letter from the Cover Letter page — select a resume, enter the company and role, and click Generate.";
  if (l.includes("job") || l.includes("application")) return `You have ${app.applications.length} application(s). ${app.applications[0] ? `Your most recent is for ${app.applications[0].role} at ${app.applications[0].company} (${app.applications[0].status}).` : ""} Use New Application to add more.`;
  if (l.includes("skill")) return "Visit the Skills Gap Analysis page to see how your skills compare to job requirements and get personalized learning recommendations.";
  if (l.includes("ats")) return "Your ATS score measures how well your resume is parsed by Applicant Tracking Systems. Add keywords from the job description and use standard formatting to improve it.";
  if (l.includes("document")) return `You have ${app.documents.length} document(s) in your Document Center — cover letters, certificates, diplomas, and more. Upload new ones anytime.`;
  if (l.includes("linkedin")) return "The LinkedIn Optimizer analyzes your profile sections and suggests keywords. Focus on your headline and About section first for the biggest impact.";
  if (l.includes("match") || l.includes("score")) return "Your match score compares your resume's keywords with the job description. Add missing keywords to push your score higher.";
  if (l.includes("export") || l.includes("download")) return "Use the Export Center on the Analysis Dashboard to download your optimized resume, cover letter, or the complete application package as PDF.";
  if (l.includes("how") && l.includes("improve")) return "Start by running an analysis from the New Application workflow. It'll show your match score, missing keywords, and specific suggestions to improve your resume and cover letter.";
  return "I can help with resumes, cover letters, job applications, document management, skills analysis, LinkedIn optimization, and more. What would you like to explore?";
}

export default function AIAssistant() {
  const app = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([initialMessage]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (text) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;
    setMessages(prev => [...prev, { role: "user", text: msg }]);
    setInput("");
    setLoading(true);
    try {
      const res = await base44.functions.invoke("ai-assistant", {
  prompt: `${buildContext(app)}\n\nUser question: ${msg}`,
});
      const reply = typeof res === "string" ? res : (res?.text || res?.response || JSON.stringify(res));
      setMessages(prev => [...prev, { role: "assistant", text: reply }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: "assistant", text: getFallbackResponse(msg, app) }]);
    }
    setLoading(false);
  };

  const quickQuestions = ["How to improve my resume?", "What are my biggest gaps?", "How many applications do I have?"];

  return (
    <>
      {!isOpen && (
        <button onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg flex items-center justify-center transition-all hover:scale-105">
          <Sparkles className="w-6 h-6" />
        </button>
      )}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-80 h-[500px] bg-card rounded-2xl shadow-2xl border border-border flex flex-col overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-border bg-indigo-600 text-white">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center"><Sparkles className="w-4 h-4" /></div>
              <div><p className="text-sm font-semibold">AI Assistant</p><p className="text-[10px] text-white/80">Ask about your analysis</p></div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-1 rounded-md hover:bg-white/20 transition"><X className="w-4 h-4" /></button>
          </div>
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-xs leading-relaxed ${msg.role === "user" ? "bg-indigo-600 text-white rounded-br-sm" : "bg-white border border-border text-foreground rounded-bl-sm shadow-sm"}`}>{msg.text}</div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="px-3 py-2.5 rounded-2xl rounded-bl-sm bg-white border border-border shadow-sm">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
          </div>
          {messages.length <= 1 && (
            <div className="px-4 pb-2 flex flex-wrap gap-1.5">
              {quickQuestions.map(q => (
                <button key={q} onClick={() => handleSend(q)} className="text-[11px] px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition border border-indigo-100">{q}</button>
              ))}
            </div>
          )}
          <div className="p-3 border-t border-border bg-card flex items-center gap-2">
            <Input placeholder="Ask a question..." value={input} onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()} className="h-9 text-sm" />
            <Button size="icon" className="h-9 w-9 shrink-0 bg-indigo-600 hover:bg-indigo-700" onClick={() => handleSend()} disabled={!input.trim() || loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      )}
    </>
  );
}