import React from "react";
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from "recharts";
import { Card } from "@/components/ui/card";

const colorConfig = {
  indigo: { hex: "#6366f1", bg: "bg-indigo-50", text: "text-indigo-600" },
  emerald: { hex: "#10b981", bg: "bg-emerald-50", text: "text-emerald-600" },
  amber: { hex: "#f59e0b", bg: "bg-amber-50", text: "text-amber-600" },
};

export default function ScoreCard({ title, score, color, icon: Icon, description }) {
  const c = colorConfig[color] || colorConfig.indigo;
  const data = [{ name: title, value: score, fill: c.hex }];
  return (
    <Card className="p-5">
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-8 h-8 rounded-lg ${c.bg} ${c.text} flex items-center justify-center`}>
          <Icon className="w-4 h-4" />
        </div>
        <h3 className="font-semibold text-sm">{title}</h3>
      </div>
      <div className="relative h-32">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart innerRadius="70%" outerRadius="100%" data={data} startAngle={90} endAngle={-270}>
            <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
            <RadialBar background dataKey="value" cornerRadius={10} />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl font-bold">{score}%</span>
        </div>
      </div>
      <p className="text-xs text-muted-foreground text-center mt-2">{description}</p>
    </Card>
  );
}