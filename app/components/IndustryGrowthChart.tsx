"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import SmartSummaryGenerator from "./SmartSummaryGenerator";

interface IndustryGrowthData {
  year: string;
  value_percent: number; 
  status: string; 
}
interface IndustryGrowthChartProps {
  data: IndustryGrowthData[];
}

export default function IndustryGrowthChart({
  data: industryGrowthData,
}: IndustryGrowthChartProps) {
  const startupData = [
    { year: "2023", count: 155 },
    { year: "2024", count: 180 },
    { year: "2025", count: 200 },
  ];

  const investmentByState = [
    { state: "São Paulo", public: 50, private: 120 },
    { state: "Rio de Janeiro", public: 30, private: 80 },
    { state: "Minas Gerais", public: 20, private: 60 },
  ];

  const industryDataForSummary = industryGrowthData.map((item) => ({
    year: item.year,
    value: item.value_percent, 
  }));

  const maxValue =
    industryGrowthData.length > 0
      ? Math.max(...industryGrowthData.map((d) => d.value_percent))
      : 0;
  const domainMax = Math.ceil(maxValue * 1.2);

  const isEmpty = industryGrowthData.length === 0;

  return (
    <div className="p-6 bg-white shadow-lg rounded-2xl border border-gray-100">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Crescimento da Indústria 4.0
      </h1>

      {isEmpty ? (
        <div className="w-full h-[450px] flex items-center justify-center bg-gray-50 rounded-xl shadow-inner">
          <p className="text-gray-500">Nenhum dado disponível.</p>
        </div>
      ) : (
        <div className="w-full h-[350px] mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={industryGrowthData}
              margin={{ top: 30, right: 40, left: 20, bottom: 20 }}
            >
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.9} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.2} />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#e5e7eb"
              />
              <XAxis
                dataKey="year"
                tick={{ fill: "#6b7280", fontSize: 14, fontWeight: 600 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#6b7280", fontSize: 14 }}
                tickFormatter={(value) => `${value}%`}
                domain={[0, domainMax]}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                formatter={(value: number) => [`${value}%`, "Crescimento"]}
                labelFormatter={(label) => `Ano ${label}`}
                contentStyle={{
                  backgroundColor: "#fff",
                  borderRadius: 12,
                  boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
                  border: "1px solid #e5e7eb",
                  fontSize: 14,
                  fontWeight: 500,
                }}
              />
              <Legend
                verticalAlign="top"
                align="right"
                wrapperStyle={{ paddingBottom: 12 }}
                iconType="circle"
                iconSize={12}
                formatter={(value) => (
                  <span style={{ color: "#4F46E5", fontWeight: 600 }}>
                    {value}
                  </span>
                )}
              />

              <Area
                type="monotone"
                dataKey="value_percent"
                name="Crescimento (%)"
                stroke="#6366f1"
                strokeWidth={3.5}
                fill="url(#colorValue)"
                activeDot={{ r: 7, stroke: "#fff", strokeWidth: 3 }}
                dot={{ r: 4, strokeWidth: 2, fill: "#fff", stroke: "#6366f1" }}
                isAnimationActive={true}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      <SmartSummaryGenerator
        startupData={startupData}
        industryGrowthData={industryDataForSummary}
        investmentByState={investmentByState}
      />
    </div>
  );
}