"use client";

import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

interface DonutChartProps {
  percentage: number; 
  color: string; 
  size?: number;
}

export function DonutChart({ percentage, color, size }: DonutChartProps) {
  const data = [
    { name: "completed", value: percentage },
    { name: "remaining", value: 100 - percentage },
  ];

  const COLORS = [color, "#e0e0e0"];
  return (
    <div style={{ width: size, height: size }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={35}
            outerRadius={45}
            startAngle={90}
            endAngle={-270}
            dataKey="value"
            isAnimationActive={false}
            stroke="none"
            cornerRadius={20}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            dominantBaseline="middle"
            fill={color}
            fontWeight="bold"
            fontSize={20}
            pointerEvents="none"
          >
            {`${Math.round(percentage)}%`}
          </text>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}