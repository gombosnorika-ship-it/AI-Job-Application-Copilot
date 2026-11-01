const SKILL_DB = [
  "React","TypeScript","JavaScript","Python","Java","Node.js","Node","AWS","Docker","Kubernetes",
  "GraphQL","REST API","REST","API","SQL","MongoDB","PostgreSQL","Redis","CSS","HTML","HTML5",
  "Tailwind","Tailwind CSS","Sass","SCSS","Webpack","Vite","Jest","Cypress","Testing","Git",
  "CI/CD","Agile","Scrum","Kanban","Jira","Figma","Sketch","Leadership","Communication",
  "Collaboration","Problem Solving","Problem-solving","Project Management","Stakeholder Management",
  "Mentoring","Microservices","Serverless","Lambda","S3","EC2","Accessibility",
  "Performance Optimization","Performance","SEO","PWA","Redux","Next.js","Vue","Vue.js","Angular",
  "Express","Django","Flask","Machine Learning","Data Analysis","Tableau","Power BI",
  "Product Management","User Research","A/B Testing","Analytics","DevOps","Terraform","Linux",
  "Go","Rust","C++","C#",".NET","Ruby","Rails","PHP","Laravel","UI/UX","User Experience",
  "User Interface","Design System","Responsive Design","Mobile First","Storybook","Playwright",
  "Selenium","Kafka","RabbitMQ","Elasticsearch","OAuth","JWT","Authentication","WebSockets",
  "D3.js","Three.js","Stripe","Payment Integration","Docker Compose","Helm","Prometheus",
  "Grafana","Jenkins","GitHub Actions","Stakeholder","Cross-functional","Cross functional",
  "HTML/CSS","RESTful","APIs","NoSQL","GCP","Azure","Cloud","CI","CD","TDD","BDD",
];

export function extractKeywords(text) {
  if (!text) return [];
  const lower = (text || "").toLowerCase();
  const found = new Set();
  SKILL_DB.forEach(skill => { if (lower.includes(skill.toLowerCase())) found.add(skill); });
  return Array.from(found);
}

export function calculateMatchScore(resumeText, jobText) {
  const jobKw = extractKeywords(jobText);
  const resumeKw = extractKeywords(resumeText || "");
  if (jobKw.length === 0) return { score: 0, matched: [], missing: [] };
  const matched = jobKw.filter(k => resumeKw.includes(k));
  const missing = jobKw.filter(k => !resumeKw.includes(k));
  return { score: Math.round((matched.length / jobKw.length) * 100), matched, missing };
}

export function calculateATSScore(resumeText) {
  if (!resumeText) return 50;
  let score = 50;
  if (/\b(led|developed|built|created|managed|designed|implemented|launched|improved|increased|reduced|optimized|architected|delivered)\b/i.test(resumeText)) score += 15;
  if (/\d+%|\d+\+|\$[\d,]+|\d+k/i.test(resumeText)) score += 15;
  if (resumeText.length > 200) score += 10;
  if (extractKeywords(resumeText).length >= 5) score += 10;
  if (/email|phone|@/i.test(resumeText)) score += 5;
  return Math.min(score, 95);
}

export function calculateResumeStrength(resumeText) {
  if (!resumeText) return 40;
  let score = 40;
  if (/\d+%|\d+\+|\$[\d,]+|\d+k/i.test(resumeText)) score += 20;
  if (/\b(led|developed|built|created|managed|designed|implemented|launched|improved|increased|reduced|optimized|architected|delivered)\b/i.test(resumeText)) score += 15;
  if (resumeText.length > 300) score += 10;
  if (extractKeywords(resumeText).length >= 8) score += 15;
  return Math.min(score, 95);
}

export function generateSuggestions(resumeText, jobText) {
  const { missing } = calculateMatchScore(resumeText, jobText);
  const s = [];
  if (missing.length > 0) s.push({ type: "critical", title: "Add missing keywords", detail: `Your resume is missing: ${missing.slice(0, 5).join(", ")}. Adding them will improve ATS compatibility.` });
  if (!/\d+%|\d+\+|\$[\d,]+|\d+k/i.test(resumeText || "")) s.push({ type: "critical", title: "Add quantifiable achievements", detail: 'Include specific metrics (e.g., "increased revenue by 30%", "managed a team of 5").' });
  if (!/\b(led|developed|built|created|managed|designed|implemented|launched|improved|increased|reduced|optimized|architected|delivered)\b/i.test(resumeText || "")) s.push({ type: "suggestion", title: "Use strong action verbs", detail: 'Start bullet points with action verbs like "Led", "Developed", "Architected" instead of "Responsible for".' });
  s.push({ type: "improvement", title: "Tailor your summary", detail: "Customize your professional summary to highlight experience most relevant to this specific role." });
  return s;
}

export function analyzeJobDescription(jobText) {
  if (!jobText) return null;
  const skills = extractKeywords(jobText);
  const companyMatch = jobText.match(/(?:at|@|join\s+)([A-Z][a-zA-Z]+)/);
  const company = companyMatch ? companyMatch[1] : "the company";
  const roleMatch = jobText.match(/(?:seeking|hiring|looking for|position:?\s*)\s*(?:a\s+|an\s+)?([A-Z][a-zA-Z\s]+?)(?:\.|,|to|with|who|that|$)/);
  const role = roleMatch ? roleMatch[1].trim() : "the position";
  const lines = jobText.split(/[.\n]/).map(l => l.trim()).filter(l => l.length > 15);
  const requirements = lines.filter(l => /require|must have|should have|need|essential|qualif|experience|year|skill|proficien|knowledge|ability|strong|excellent|familiar/i.test(l)).slice(0, 6);
  const warnings = [];
  if (/fast-paced|fast paced/i.test(jobText)) warnings.push('Mentions "fast-paced environment" — may indicate high workload expectations');
  if (/overtime|weekend|on.call/i.test(jobText)) warnings.push("May require overtime or on-call work");
  if (!/remote/i.test(jobText)) warnings.push("No remote option mentioned");
  return { company, role, skills, requirements, warnings };
}

export function generateCoverLetter(resume, jobText, settings) {
  const { matched } = calculateMatchScore(resume?.content || "", jobText || "");
  const name = settings?.fullName || resume?.data?.personal?.fullName || "[Your Name]";
  const analysis = analyzeJobDescription(jobText);
  const company = analysis?.company || "[Company Name]";
  const role = analysis?.role || "the position";
  const topSkills = matched.slice(0, 3).join(", ") || "software development";
  return `Dear Hiring Manager,

I am excited to apply for the ${role} position at ${company}. With my experience in ${topSkills}, I am confident I would be a valuable addition to your team.

In my previous roles, I have demonstrated strong capabilities in ${matched.slice(0, 2).join(" and ") || "software development"}, delivering measurable results and driving innovation. I am particularly drawn to this opportunity because it aligns with my expertise and career goals.

I would welcome the chance to discuss how my background can contribute to ${company}'s success.

Thank you for your consideration. I look forward to speaking with you.

Sincerely,
${name}`;
}

export function generateLinkedInSuggestions(resumeText, jobText) {
  const { missing } = calculateMatchScore(resumeText, jobText);
  return [
    { name: "Headline", score: 60, suggestion: "Add industry keywords like 'React' and 'Frontend Architecture' to improve searchability." },
    { name: "About Section", score: 45, suggestion: "Expand your summary to 300+ words. Include measurable achievements and key technologies." },
    { name: "Experience", score: 82, suggestion: "Add quantifiable results to your last two roles. Use bullet points and action verbs." },
    { name: "Skills & Endorsements", score: 70, suggestion: missing.length > 0 ? `Add these skills: ${missing.slice(0, 3).join(", ")}.` : "Your skills section looks good. Request endorsements from colleagues." },
    { name: "Education", score: 90, suggestion: "Looks great. Consider adding relevant coursework or certifications." },
  ];
}

export function generateSkillsGap(resumeText, jobText) {
  const { matched, missing } = calculateMatchScore(resumeText, jobText);
  return {
    matched,
    missing: missing.map((skill, i) => ({
      skill, gap: 20 + (i * 7) % 35,
      timeToLearn: ["1-2 weeks", "2-3 weeks", "3-4 weeks"][i % 3],
      resources: 3 + (i % 5),
    })),
  };
}

export function getResumeText(resume) {
  if (!resume) return "";
  if (resume.content) return resume.content;
  const d = resume.data;
  if (!d) return "";
  const parts = [d.personal?.summary || "", ...(d.experience || []).map(e => `${e.role} at ${e.company}: ${e.description}`), (d.skills || []).join(", ")];
  return parts.join(" ");
}