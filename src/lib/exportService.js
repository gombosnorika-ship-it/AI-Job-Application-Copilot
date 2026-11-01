import jsPDF from "jspdf";

export function downloadResumePDF(resume) {
  const doc = new jsPDF();
  let y = 20;
  const d = resume.data;
  const p = d?.personal || {};

  doc.setFontSize(22); doc.setFont("helvetica", "bold");
  doc.text(p.fullName || resume.name || "Resume", 20, y); y += 10;

  doc.setFontSize(10); doc.setFont("helvetica", "normal");
  const contact = [p.email, p.phone, p.location, p.linkedin].filter(Boolean);
  if (contact.length) { doc.text(contact.join("  |  "), 20, y); y += 8; }

  if (p.summary) {
    y += 4; doc.setFontSize(12); doc.setFont("helvetica", "bold"); doc.text("Summary", 20, y); y += 6;
    doc.setFontSize(10); doc.setFont("helvetica", "normal");
    doc.splitTextToSize(p.summary, 170).forEach(l => { doc.text(l, 20, y); y += 5; }); y += 4;
  }

  if (d?.experience?.length) {
    y += 2; doc.setFontSize(12); doc.setFont("helvetica", "bold"); doc.text("Experience", 20, y); y += 6;
    d.experience.forEach(exp => {
      doc.setFontSize(11); doc.setFont("helvetica", "bold");
      doc.text(`${exp.role || ""} at ${exp.company || ""}`, 20, y); y += 5;
      doc.setFontSize(9); doc.setFont("helvetica", "italic");
      doc.text(`${exp.startDate || ""} - ${exp.endDate || "Present"}`, 20, y); y += 5;
      if (exp.description) {
        doc.setFontSize(10); doc.setFont("helvetica", "normal");
        doc.splitTextToSize(exp.description, 170).forEach(l => { doc.text(l, 20, y); y += 5; });
      }
      y += 4;
    });
  }

  if (d?.education?.length) {
    y += 2; doc.setFontSize(12); doc.setFont("helvetica", "bold"); doc.text("Education", 20, y); y += 6;
    d.education.forEach(edu => {
      doc.setFontSize(10); doc.setFont("helvetica", "bold");
      doc.text(`${edu.degree || ""} - ${edu.school || ""}`, 20, y); y += 5;
      doc.setFontSize(9); doc.setFont("helvetica", "normal");
      doc.text(`${edu.startDate || ""} - ${edu.endDate || ""}`, 20, y); y += 6;
    });
  }

  if (d?.skills?.length) {
    y += 2; doc.setFontSize(12); doc.setFont("helvetica", "bold"); doc.text("Skills", 20, y); y += 6;
    doc.setFontSize(10); doc.setFont("helvetica", "normal");
    doc.splitTextToSize(d.skills.join(", "), 170).forEach(l => { doc.text(l, 20, y); y += 5; });
  }

  doc.save(`${(resume.name || "Resume").replace(/\.\w+$/, "")}.pdf`);
}

export function downloadCoverLetterPDF(content, name = "Cover_Letter") {
  const doc = new jsPDF();
  doc.setFontSize(11); doc.setFont("helvetica", "normal");
  let y = 30;
  doc.splitTextToSize(content, 170).forEach(line => {
    if (y > 270) { doc.addPage(); y = 30; }
    doc.text(line, 20, y); y += 5.5;
  });
  doc.save(`${name.replace(/\.\w+$/, "")}.pdf`);
}

export function downloadApplicationPackage(app, resume, coverLetter) {
  const doc = new jsPDF();
  let y = 20;
  doc.setFontSize(20); doc.setFont("helvetica", "bold");
  doc.text("Application Package", 20, y); y += 12;
  doc.setFontSize(12); doc.setFont("helvetica", "normal");
  doc.text(`Company: ${app.company}`, 20, y); y += 7;
  doc.text(`Role: ${app.role}`, 20, y); y += 7;
  doc.text(`Status: ${app.status}`, 20, y); y += 7;
  doc.text(`Match Score: ${app.matchScore}%`, 20, y); y += 10;

  doc.setFont("helvetica", "bold"); doc.text("Job Description", 20, y); y += 7;
  doc.setFont("helvetica", "normal"); doc.setFontSize(10);
  doc.splitTextToSize(app.jobDescription || app.jobText || "", 170).slice(0, 15).forEach(l => { doc.text(l, 20, y); y += 5; });
  y += 5;

  doc.setFontSize(12); doc.setFont("helvetica", "bold"); doc.text("Resume Summary", 20, y); y += 7;
  doc.setFont("helvetica", "normal"); doc.setFontSize(10);
  if (resume?.content) doc.splitTextToSize(resume.content, 170).slice(0, 10).forEach(l => { doc.text(l, 20, y); y += 5; });

  if (coverLetter) {
    doc.addPage(); y = 20;
    doc.setFontSize(16); doc.setFont("helvetica", "bold"); doc.text("Cover Letter", 20, y); y += 10;
    doc.setFontSize(11); doc.setFont("helvetica", "normal");
    doc.splitTextToSize(coverLetter, 170).forEach(l => { if (y > 270) { doc.addPage(); y = 20; } doc.text(l, 20, y); y += 5.5; });
  }

  doc.save(`Application_${app.company}.pdf`);
}

export function downloadTextFile(content, filename) {
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}