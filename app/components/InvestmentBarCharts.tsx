/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface RawInvestmentData {
  state: string;
  public?: number;
  private?: number;
}

interface InvestmentBarChartsProps {
  data: RawInvestmentData[];
}

const formatYAxisCurrency = (value: number): string => {
  if (value >= 1000000000) {
    return `R$ ${(value / 1000000000).toFixed(1).replace(".", ",")}B`;
  }
  if (value >= 1000000) {
    return `R$ ${(value / 1000000).toFixed(1).replace(".", ",")}M`;
  }
  if (value >= 1000) {
    return `R$ ${(value / 1000).toFixed(1).replace(".", ",")}K`;
  }
  return `R$ ${value.toLocaleString("pt-BR")}`;
};

const formatTooltipCurrency = (value: number | undefined): string => {
  if (typeof value !== "number") {
    return "R$ 0,00";
  }
  return `R$ ${value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

export default function InvestmentBarCharts({
  data,
}: InvestmentBarChartsProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const processedData = data.map((item) => ({
    state: item.state,
    investment_brl: (item.public || 0) + (item.private || 0),
  }));

  const chartData = [...processedData]
    .sort((a, b) => b.investment_brl - a.investment_brl)
    .slice(0, 10);

  const isEmpty = chartData.length === 0;

  if (isEmpty) {
    return (
      <div className="w-full flex items-center justify-center p-6 h-[420px] bg-white rounded-2xl shadow-md">
        <p className="text-gray-500 text-center text-sm">
          Nenhum dado de investimento disponível.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col p-4 bg-white rounded-2xl shadow-lg border border-gray-100 h-[420px]">
      <h2 className="text-xl font-bold mb-4 text-center text-gray-800">
        Top 5 Investimento Total por Estado
      </h2>

      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 5, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f0f0f0"
            />
            <XAxis
              dataKey="state"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#023047", fontSize: isMobile ? 8 : 10 }}
              interval={0}
              angle={isMobile ? -45 : -25}
              textAnchor={isMobile ? "end" : "middle"}
              height={isMobile ? 50 : 50}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#023047", fontSize: isMobile ? 10 : 12 }}
              width={isMobile ? 60 : 80}
              tickFormatter={formatYAxisCurrency}
            />
            <Tooltip
              formatter={(value: any) => [
                formatTooltipCurrency(value),
                "Investimento",
              ]}
              labelFormatter={(label) => `Estado: ${label}`}
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                backdropFilter: "blur(5px)",
                border: "1px solid #e0e0e0",
                borderRadius: "12px",
                fontSize: "14px",
                padding: "16px",
                boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
              }}
              labelStyle={{ color: "#023047", fontWeight: "bold" }}
              itemStyle={{ color: "#219ebc" }}
            />
            <Bar
              dataKey="investment_brl"
              name="Investimento"
              barSize={isMobile ? 18 : 24}
              radius={[6, 6, 0, 0]}
              fill="#fb8500"
              style={{ fill: `url(#barGradient)` }}
            />
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8ecae6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#219ebc" stopOpacity={0.2} />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
