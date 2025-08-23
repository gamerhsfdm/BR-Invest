"use client";

import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import type { TooltipProps } from "recharts";
import type {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";

interface ChartData {
  name: string;
  value: number;
  color?: string;
  description?: string;
}

interface Dataset {
  title: string;
  data: ChartData[];
}

const DEFAULT_COLORS = [
  "#1A73E8",
  "#EA4335",
  "#F7B500",
  "#34A853",
  "#4285F4",
  "#FBBC04",
];

interface CustomTooltipProps extends TooltipProps<ValueType, NameType> {
  data?: ChartData[];
}

const CustomTooltip = ({ active, payload, data }: CustomTooltipProps) => {
  if (active && payload && payload.length && data) {
    const { name, value, description } = payload[0].payload as ChartData;

    const total = data.reduce((acc, curr) => acc + curr.value, 0);
    const percentage = total > 0 ? (value / total) * 100 : 0;

    return (
      <div className="bg-white p-3 border border-gray-200 shadow-md rounded-lg text-sm">
        <p className="font-bold text-gray-800">{name}</p>
        <p className="text-gray-600 mt-1">Valor: {value}</p>
        <p className="text-gray-600">Porcentagem: {Math.round(percentage)}%</p>
        {description && (
          <p className="text-gray-500 text-xs mt-2">{description}</p>
        )}
      </div>
    );
  }
  return null;
};

const StartupComparisonCharts: React.FC = () => {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const MOCKED_DATA_COMBINED: ChartData[] = [
    {
      name: "Ativas (2023-2025)",
      value: 155 + 180 + 200,
      description: "Total de startups ativas nos três anos.",
    },
    {
      name: "Adquiridas (2023-2025)",
      value: 20 + 25 + 30,
      description: "Total de startups adquiridas nos três anos.",
    },
    {
      name: "Fechadas (2023-2025)",
      value: 12 + 10 + 15,
      description: "Total de startups fechadas nos três anos.",
    },
  ];

  useEffect(() => {
    const cachedData = sessionStorage.getItem("startup_chart_data");
    if (cachedData) {
      try {
        setDatasets(JSON.parse(cachedData));
        setLoading(false);
        return;
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "Erro desconhecido";
        console.error(
          "Erro ao carregar dados do cache, buscando da API novamente.",
          errorMessage
        );
        sessionStorage.removeItem("startup_chart_data");
      }
    }

    setLoading(true);
    setTimeout(() => {
      try {
        const dataToSave: Dataset[] = [
          {
            title: "Evolução de Startups (2023-2025)",
            data: MOCKED_DATA_COMBINED,
          },
        ];
        setDatasets(dataToSave);
        sessionStorage.setItem(
          "startup_chart_data",
          JSON.stringify(dataToSave)
        );
        setError(null);
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "Erro desconhecido";
        console.error("Erro na requisição da API:", errorMessage);
        setError("Erro inesperado");
      } finally {
        setLoading(false);
      }
    }, 1000);
  }, []);

  return (
    <div className="w-full bg-white shadow-xl rounded-2xl flex flex-col gap-8 border-4 border-gray-50">
      <h2 className="text-xl sm:text-2xl font-extrabold mb-4 text-center text-gray-900 tracking-tight">
        Evolução de Startups (2023-2025)
      </h2>

      {loading ? (
        <p className="text-center text-gray-500">
          Carregando dados... <span className="animate-pulse ml-2">⏳</span>
        </p>
      ) : error ? (
        <p className="text-center text-red-500">
          Erro: {error} <span className="ml-2">⚠️</span>
        </p>
      ) : datasets.length === 0 ? (
        <p className="text-center text-gray-500">Nenhum gráfico disponível.</p>
      ) : (
        <div className="flex flex-col items-center justify-center w-full min-h-80 transition-transform hover:scale-105 duration-300 ease-in-out">
          <PieChart width={300} height={300}>
            <Pie
              data={datasets[0].data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={100}
              paddingAngle={4}
              stroke="none"
              isAnimationActive={true}
              animationDuration={500}
            >
              {datasets[0].data.map((entry, i) => (
                <Cell
                  key={`cell-${i}`}
                  fill={
                    entry.color || DEFAULT_COLORS[i % DEFAULT_COLORS.length]
                  }
                  className="transition-transform duration-300 ease-in-out"
                />
              ))}
            </Pie>
            <Tooltip
              content={(props) => (
                <CustomTooltip {...props} data={datasets[0].data} />
              )}
            />
            <Legend
              verticalAlign="bottom"
              layout="horizontal"
              wrapperStyle={{ paddingTop: "1rem" }}
            />
          </PieChart>
        </div>
      )}
    </div>
  );
};

export default StartupComparisonCharts;
