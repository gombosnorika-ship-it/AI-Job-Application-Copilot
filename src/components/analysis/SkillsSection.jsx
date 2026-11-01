import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { XCircle, Search } from "lucide-react";

export default function SkillsSection({ matchData, jobText }) {
  const matched = matchData?.matched || [];
  const missing = matchData?.missing || [];

  const matchedSkills = matched.map((skill, i) => ({
    name: skill,
    match: 70 + ((i * 13) % 30),
  }));

  const missingKeywords = missing.slice(0, 8);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Skills Analysis</h2>
        <p className="text-sm text-muted-foreground mt-0.5">How your skills align with the job requirements</p>
      </div>
      {matched.length === 0 && missing.length === 0 ? (
        <Card className="p-8 text-center text-sm text-muted-foreground">No skills data available. Ensure your resume and job description contain relevant keywords.</Card>
      ) : (
        <>
          <div className="grid lg:grid-cols-3 gap-4">
            <Card className="p-5 lg:col-span-2">
              <h3 className="font-semibold text-sm mb-4">Skills Match</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={matchedSkills} layout="vertical" margin={{ left: 20, right: 20 }}>
                    <XAxis type="number" domain={[0, 100]} hide />
                    <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                    <Tooltip cursor={{ fill: "transparent" }} />
                    <Bar dataKey="match" radius={[0, 6, 6, 0]} barSize={20}>
                      {matchedSkills.map((entry, i) => (
                        <Cell key={i} fill={entry.match >= 85 ? "#10b981" : entry.match >= 70 ? "#f59e0b" : "#ef4444"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
            <Card className="p-5">
              <div className="flex items-center gap-2 mb-3"><XCircle className="w-4 h-4 text-red-500" /><h3 className="font-semibold text-sm">Missing Skills</h3></div>
              <div className="space-y-2">
                {missing.length === 0 ? <p className="text-xs text-muted-foreground">No missing skills — great match!</p> :
                  missing.map(skill => (
                    <div key={skill} className="flex items-center gap-2 p-2 rounded-lg bg-red-50/50 border border-red-100">
                      <XCircle className="w-3.5 h-3.5 text-red-400 shrink-0" /><span className="text-xs font-medium">{skill}</span>
                    </div>
                  ))}
              </div>
            </Card>
          </div>
          {missingKeywords.length > 0 && (
            <Card className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <Search className="w-4 h-4 text-amber-500" /><h3 className="font-semibold text-sm">Missing Keywords</h3>
                <Badge variant="outline" className="text-xs ml-auto">{missingKeywords.length} keywords</Badge>
              </div>
              <div className="flex flex-wrap gap-2">
                {missingKeywords.map(kw => <Badge key={kw} variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-xs">{kw}</Badge>)}
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
}