import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Briefcase, ArrowRight, FileText, Target, Sparkles, PenTool,
  Linkedin, BarChart3, ClipboardList, Shield, Zap, CheckCircle2
} from "lucide-react";

const features = [
  { icon: FileText, title: "Smart Resume Manager", desc: "Upload and manage multiple resumes, each tailored for different roles." },
  { icon: Target, title: "AI Match Scoring", desc: "Instantly see how well your resume matches any job description." },
  { icon: Sparkles, title: "Resume Optimization", desc: "Get AI-powered suggestions to beat ATS systems and impress recruiters." },
  { icon: PenTool, title: "Cover Letter Generator", desc: "Generate compelling, personalized cover letters in seconds." },
  { icon: Linkedin, title: "LinkedIn Optimizer", desc: "Improve your LinkedIn profile with keyword and content suggestions." },
  { icon: BarChart3, title: "Skills Gap Analysis", desc: "Identify missing skills and get learning recommendations." },
];

const stats = [
  { value: "87%", label: "Average match improvement" },
  { value: "3x", label: "More interview callbacks" },
  { value: "10k+", label: "Resumes optimized" },
  { value: "2 min", label: "To generate a cover letter" },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">JobCopilot</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" className="text-sm font-medium">Sign In</Button>
            </Link>
            <Link to="/register">
              <Button className="text-sm font-medium bg-indigo-600 hover:bg-indigo-700 shadow-sm">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/70 via-white to-white" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-indigo-100/40 blur-3xl" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-20 pb-24 sm:pt-28 sm:pb-32">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-semibold mb-6">
              <Zap className="w-3.5 h-3.5" />
              AI-Powered Job Application Assistant
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Land your dream job with{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
                AI precision
              </span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
              Optimize your resumes, generate tailored cover letters, analyze job descriptions, and track applications — all powered by intelligent AI.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/register">
                <Button size="lg" className="h-12 px-8 text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200">
                  Start Free <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="h-12 px-8 text-sm font-semibold">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-2xl sm:text-3xl font-extrabold text-indigo-600">{s.value}</div>
                <div className="text-xs sm:text-sm text-slate-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Everything you need to succeed
            </h2>
            <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto">
              A complete toolkit designed to give you a competitive edge in your job search.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="group p-6 rounded-2xl border border-slate-100 bg-white hover:shadow-lg hover:shadow-slate-100 hover:border-indigo-100 transition-all duration-300">
                <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                  <f.icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-slate-900 text-base">{f.title}</h3>
                <p className="mt-2 text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 sm:py-28 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              How it works
            </h2>
            <p className="mt-4 text-lg text-slate-500">Three simple steps to optimize your applications.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: "01", title: "Upload Your Resume", desc: "Drop your existing resume and let our AI analyze it in seconds." },
              { step: "02", title: "Paste a Job Posting", desc: "Add a job description and get an instant AI match score with insights." },
              { step: "03", title: "Get Optimized", desc: "Receive tailored recommendations, a custom cover letter, and ATS tips." },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 rounded-full bg-indigo-600 text-white text-sm font-bold flex items-center justify-center mx-auto mb-5">
                  {item.step}
                </div>
                <h3 className="font-semibold text-slate-900 text-lg">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 sm:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="p-10 sm:p-16 rounded-3xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white">
            <Shield className="w-10 h-10 mx-auto mb-4 opacity-80" />
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Ready to land more interviews?
            </h2>
            <p className="mt-4 text-indigo-100 text-lg max-w-xl mx-auto">
              Join thousands of professionals who use JobCopilot to optimize every aspect of their job applications.
            </p>
            <Link to="/register">
              <Button size="lg" className="mt-8 h-12 px-10 bg-white text-indigo-600 hover:bg-indigo-50 font-semibold shadow-lg">
                Get Started Free <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-indigo-600 flex items-center justify-center">
              <Briefcase className="w-3 h-3 text-white" />
            </div>
            <span className="font-semibold text-sm text-slate-900">JobCopilot</span>
          </div>
          <p className="text-xs text-slate-400">© 2025 JobCopilot. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}