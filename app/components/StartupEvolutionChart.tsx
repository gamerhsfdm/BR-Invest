"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface StartupData {
  year: string;
  count: number;
}
interface StartupEvolutionChartProps {
  data: StartupData[];
}

export function StartupEvolutionChart({ data }: StartupEvolutionChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white shadow-md rounded-xl p-4 flex flex-col items-center justify-center h-[300px]">
        <h2 className="text-lg sm:text-xl font-semibold text-center mb-1 text-gray-800">
          Evolução das Startups
        </h2>
        <p className="text-gray-500 mt-4">Não há dados disponíveis para exibir o gráfico.</p>
      </div>
    );
  }
  const maxCount = Math.max(...data.map((d) => d.count));
  const domainMax = Math.ceil(maxCount * 1.1);

  return (
    <div className="w-full bg-white shadow-md rounded-xl p-4">
      <h2 className="text-lg sm:text-xl font-semibold text-center mb-1 text-gray-800">
        Evolução das Startups
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
          barCategoryGap="20%"
        >
          <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#e5e7eb" />

          <XAxis
            dataKey="year"
            padding={{ left: 15, right: 15 }}
            tick={{ fill: "#6b7280", fontSize: 12, fontWeight: 500 }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            tick={{ fill: "#6b7280", fontSize: 12 }}
            domain={[0, domainMax]}
            axisLine={false}
            tickLine={false}
          />

          <Tooltip
            formatter={(value: number) => `${value} startups`}
            labelFormatter={(label) => `Ano: ${label}`}
            contentStyle={{
              backgroundColor: "#fff",
              borderRadius: 10,
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              border: "1px solid #e5e7eb",
              fontSize: 12,
              padding: "8px 12px",
            }}
          />

          <Legend
            verticalAlign="top"
            align="center"
            wrapperStyle={{ paddingBottom: 6 }}
            iconType="circle"
            iconSize={10}
            formatter={(value) => (
              <span style={{ color: "#219ebc", fontWeight: 600, fontSize: 12 }}>
                {value}
              </span>
            )}
          />

          <Bar
            dataKey="count"
            name="Número de startups"
            fill="#219ebc"
            radius={[8, 8, 0, 0]}
            barSize={32}
            animationDuration={900}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}