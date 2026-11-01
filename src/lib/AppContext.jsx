import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "jobcopilot_v2";
const genId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
const now = () => new Date().toISOString();
const fmtDate = (d) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

const seedData = {
  resumes: [
    {
      id: "seed-r1", name: "Senior_Frontend_Dev.pdf", role: "Senior Frontend Developer",
      content: "Senior Frontend Developer with 7+ years of experience in React, TypeScript, and modern web technologies. Led development of customer-facing applications serving 500K+ users. Improved page load performance by 40% through code splitting and lazy loading. Built and maintained design systems using Tailwind CSS and Storybook. Experienced with REST APIs, Git, CI/CD pipelines, and automated testing with Jest and Cypress. Strong communication and collaboration skills.",
      atsScore: 85, status: "optimized", createdDate: "2025-01-15T10:00:00Z", updatedDate: "2025-01-15T10:00:00Z",
      data: {
        personal: { fullName: "Alex Johnson", professionalTitle: "Senior Frontend Developer", email: "alex.johnson@email.com", phone: "+1 (555) 123-4567", location: "San Francisco, CA", linkedin: "linkedin.com/in/alexjohnson", portfolio: "", summary: "Senior Frontend Developer with 7+ years of experience building scalable web applications using React, TypeScript, and modern JavaScript frameworks." },
        experience: [
          { company: "TechStart Inc.", role: "Senior Frontend Developer", startDate: "2021", endDate: "Present", description: "Led development of customer-facing dashboard serving 50,000 daily active users. Improved page load performance by 40% through code splitting and lazy loading." },
          { company: "WebCorp", role: "Frontend Developer", startDate: "2018", endDate: "2021", description: "Built and maintained React-based web applications. Collaborated with design team to implement responsive UI components." }
        ],
        education: [{ school: "UC Berkeley", degree: "B.S. Computer Science", startDate: "2014", endDate: "2018" }],
        skills: ["React", "TypeScript", "JavaScript", "CSS", "Tailwind", "Git", "REST APIs", "Jest", "Cypress"]
      }
    },
    {
      id: "seed-r2", name: "Full_Stack_Engineer.pdf", role: "Full Stack Engineer",
      content: "Full Stack Engineer with 5+ years of experience in Node.js, React, and PostgreSQL. Built microservices architecture handling 1M+ requests per day. Experienced with AWS, Docker, and CI/CD pipelines. Strong problem-solving and collaboration skills.",
      atsScore: 78, status: "needs_review", createdDate: "2025-01-10T10:00:00Z", updatedDate: "2025-01-10T10:00:00Z",
      data: {
        personal: { fullName: "Alex Johnson", professionalTitle: "Full Stack Engineer", email: "alex.johnson@email.com", phone: "+1 (555) 123-4567", location: "San Francisco, CA", linkedin: "linkedin.com/in/alexjohnson", summary: "Full Stack Engineer with 5+ years of experience building scalable web applications." },
        experience: [{ company: "DataFlow", role: "Full Stack Engineer", startDate: "2020", endDate: "Present", description: "Built microservices architecture handling 1M+ requests per day using Node.js and React." }],
        education: [{ school: "UC Berkeley", degree: "B.S. Computer Science", startDate: "2014", endDate: "2018" }],
        skills: ["Node.js", "React", "PostgreSQL", "AWS", "Docker", "JavaScript", "TypeScript"]
      }
    }
  ],
  documents: [
    { id: "seed-d1", name: "Cover_Letter_Google.pdf", type: "cover_letter", date: "Jan 15, 2025", size: "245 KB", createdDate: "2025-01-15T10:00:00Z" },
    { id: "seed-d2", name: "AWS_Certification.pdf", type: "certificate", date: "Dec 10, 2024", size: "1.2 MB", createdDate: "2024-12-10T10:00:00Z" },
    { id: "seed-d3", name: "CS_Degree.pdf", type: "diploma", date: "May 2023", size: "890 KB", createdDate: "2023-05-15T10:00:00Z" },
    { id: "seed-d4", name: "Recommendation_Jane.pdf", type: "recommendation", date: "Nov 2024", size: "320 KB", createdDate: "2024-11-20T10:00:00Z" }
  ],
  applications: [
    {
      id: "seed-a1", company: "Google", role: "Senior Frontend Developer", location: "Mountain View, CA",
      jobDescription: "We are seeking a Senior Frontend Developer to join our team. Requirements: 5+ years of experience with React, TypeScript, and modern JavaScript. Strong proficiency in CSS, HTML, and responsive design. Experience with REST APIs, Git, and CI/CD. Nice to have: GraphQL, AWS, Docker. Must have excellent communication and collaboration skills.",
      jobText: "We are seeking a Senior Frontend Developer to join our team. Requirements: 5+ years of experience with React, TypeScript, and modern JavaScript. Strong proficiency in CSS, HTML, and responsive design. Experience with REST APIs, Git, and CI/CD. Nice to have: GraphQL, AWS, Docker. Must have excellent communication and collaboration skills.",
      resumeId: "seed-r1", coverLetterId: "seed-d1", documentIds: ["seed-d2", "seed-d3"],
      status: "interviewing", matchScore: 87, createdDate: "2025-01-15T10:00:00Z"
    },
    {
      id: "seed-a2", company: "Stripe", role: "Full Stack Engineer", location: "San Francisco, CA",
      jobDescription: "Looking for a Full Stack Engineer with experience in Node.js, React, and PostgreSQL. Must have AWS and Docker experience. Experience with microservices and CI/CD pipelines required.",
      jobText: "Looking for a Full Stack Engineer with experience in Node.js, React, and PostgreSQL. Must have AWS and Docker experience. Experience with microservices and CI/CD pipelines required.",
      resumeId: "seed-r2", coverLetterId: null, documentIds: [],
      status: "applied", matchScore: 82, createdDate: "2025-01-12T10:00:00Z"
    }
  ],
  settings: {
    fullName: "Alex Johnson", email: "alex.johnson@email.com", phone: "+1 (555) 123-4567",
    location: "San Francisco, CA", linkedin: "linkedin.com/in/alexjohnson",
    headline: "Senior Frontend Developer", summary: "Senior Frontend Developer with 7+ years of experience building scalable web applications using React, TypeScript, and modern JavaScript frameworks.",
    targetRole: "Senior Frontend Developer", industry: "tech", experienceLevel: "senior", workType: "hybrid",
    preferences: { autoOptimize: true, coverLetterSuggestions: true, trackDeadlines: false, weeklyReports: true },
    notifications: { statusUpdates: true, jobMatches: true, interviewReminders: true, weeklyDigest: false, productUpdates: false }
  }
};

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return JSON.parse(JSON.stringify(seedData));
}

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [data, setData] = useState(loadData);

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }, [data]);

  const addResume = useCallback((resume) => {
    const r = { id: genId(), createdDate: now(), updatedDate: now(), atsScore: 0, status: "draft", ...resume };
    setData(d => ({ ...d, resumes: [r, ...d.resumes] }));
    return r;
  }, []);
  const updateResume = useCallback((id, updates) => {
    setData(d => ({ ...d, resumes: d.resumes.map(r => r.id === id ? { ...r, ...updates, updatedDate: now() } : r) }));
  }, []);
  const deleteResume = useCallback((id) => { setData(d => ({ ...d, resumes: d.resumes.filter(r => r.id !== id) })); }, []);
  const duplicateResume = useCallback((id) => {
    setData(d => { const r = d.resumes.find(x => x.id === id); if (!r) return d;
      const c = { ...r, id: genId(), name: r.name.replace(/\.(\w+)$/, "_copy.$1"), status: "draft", createdDate: now(), updatedDate: now() };
      return { ...d, resumes: [c, ...d.resumes] }; });
  }, []);

  const addDocument = useCallback((doc) => {
    const d = { id: genId(), createdDate: now(), date: fmtDate(now()), ...doc };
    setData(s => ({ ...s, documents: [d, ...s.documents] }));
    return d;
  }, []);
  const updateDocument = useCallback((id, updates) => { setData(d => ({ ...d, documents: d.documents.map(x => x.id === id ? { ...x, ...updates } : x) })); }, []);
  const deleteDocument = useCallback((id) => { setData(d => ({ ...d, documents: d.documents.filter(x => x.id !== id) })); }, []);
  const duplicateDocument = useCallback((id) => {
    setData(d => { const doc = d.documents.find(x => x.id === id); if (!doc) return d;
      const c = { ...doc, id: genId(), name: doc.name.replace(/\.(\w+)$/, "_copy.$1"), createdDate: now(), date: fmtDate(now()) };
      return { ...d, documents: [c, ...d.documents] }; });
  }, []);

  const addApplication = useCallback((app) => {
    const a = { id: genId(), createdDate: now(), status: "preparing", matchScore: 0, documentIds: [], ...app };
    setData(d => ({ ...d, applications: [a, ...d.applications] }));
    return a;
  }, []);
  const updateApplication = useCallback((id, updates) => { setData(d => ({ ...d, applications: d.applications.map(a => a.id === id ? { ...a, ...updates } : a) })); }, []);
  const deleteApplication = useCallback((id) => { setData(d => ({ ...d, applications: d.applications.filter(a => a.id !== id) })); }, []);

  const updateSettings = useCallback((updates) => { setData(d => ({ ...d, settings: { ...d.settings, ...updates } })); }, []);

  return (
    <AppContext.Provider value={{
      ...data,
      addResume, updateResume, deleteResume, duplicateResume,
      addDocument, updateDocument, deleteDocument, duplicateDocument,
      addApplication, updateApplication, deleteApplication, updateSettings,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}