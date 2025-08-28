"use client";

import { useEffect, useState } from "react";
import type { TooltipProps } from "recharts";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import type {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";

import AIResponseCard from "./components/AIResponseCard";
import BrazilMap from "./components/BrazilMap";
import InvestmentBarCharts from "./components/InvestmentBarCharts";
import AsideSidebar from "./components/AsideSidebar";
import EvolutionStartups from "./components/EvolutionStartups";
import IndustryGrowthChart from "./components/IndustryGrowthChart";
import QuickSummaryCard from "./components/QuickSummaryCard";

interface StartupData {
  year: string;
  count: number;
  status: "projecao" | string;
}

interface IndustryGrowthData {
  year: string;
  value_percent: number;
  status: string;
}

interface InvestmentByState {
  state: string;
  investment_million_brl: number;
  status: string;
}

interface AIData {
  resposta: string;
  dados: {
    startups_por_ano: StartupData[];
    investimento_por_estado: InvestmentByState[];
    crescimento_industria: IndustryGrowthData[];
  };
}

interface ChartData {
  name: string;
  value: number;
  color?: string;
  description?: string;
}

interface CustomTooltipProps extends TooltipProps<ValueType, NameType> {
  data?: ChartData[];
}

const DEFAULT_COLORS = [
  "#219ebc", 
  "#ffb703", 
  "#fb8500", 
  "#023047", 
  "#8ecae6", 
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isChartData = (obj: any): obj is ChartData => {
  return (
    typeof obj === "object" && obj !== null && "name" in obj && "value" in obj
  );
};

const CustomTooltip = ({
  active,
  payload,
  data,
}: CustomTooltipProps & { payload?: { payload: ChartData }[] }) => {
  if (active && payload && payload.length > 0 && data) {
    const itemData = payload[0].payload;

    if (isChartData(itemData)) {
      const { name, value, description } = itemData;

      const total = data.reduce((acc, curr) => acc + curr.value, 0);
      const percentage = total > 0 ? (value / total) * 100 : 0;

      return (
        <div className="bg-white p-3 border border-gray-200 shadow-md rounded-lg text-sm">
          <p className="font-bold text-gray-800">{name}</p>
          <p className="text-gray-600 mt-1">Valor: {value}</p>
          <p className="text-gray-600">
            Porcentagem: {Math.round(percentage)}%
          </p>
          {description && (
            <p className="text-gray-500 text-xs mt-2">{description}</p>
          )}
        </div>
      );
    }
  }
  return null;
};

interface StartupComparisonChartsProps {
  data: ChartData[];
}

const StartupComparisonCharts: React.FC<StartupComparisonChartsProps> = ({
  data,
}) => {
  return (
    <div className="w-full bg-white shadow-xl rounded-2xl flex flex-col gap-8 border-4 border-gray-50">
      <h2 className="text-xl sm:text-2xl font-extrabold mb-4 text-center text-gray-900 tracking-tight">
        Evolução de Startups (2023-2025)
      </h2>
      <div className="flex flex-col items-center justify-center w-full min-h-80 transition-transform hover:scale-105 duration-300 ease-in-out">
        <PieChart width={300} height={300}>
          <Pie
            data={data}
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
            {data.map((entry, i) => (
              <Cell
                key={`cell-${i}`}
                fill={entry.color || DEFAULT_COLORS[i % DEFAULT_COLORS.length]}
                className="transition-transform duration-300 ease-in-out"
              />
            ))}
          </Pie>
          <Tooltip
            content={(props) => <CustomTooltip {...props} data={data} />}
          />
          <Legend
            verticalAlign="bottom"
            layout="horizontal"
            wrapperStyle={{ paddingTop: "1rem" }}
          />
        </PieChart>
      </div>
    </div>
  );
};

function useDashboardData() {
  const [data, setData] = useState<AIData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchData() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/ai/dashboard`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question:
            "Gere um relatório completo sobre startups e investimentos no Brasil.",
        }),
      });

      if (!response.ok) {
        throw new Error("Falha na requisição da API.");
      }

      const result = (await response.json()) as Partial<AIData>;

      if (
        !result ||
        !result.dados ||
        !Array.isArray(result.dados.startups_por_ano) ||
        !Array.isArray(result.dados.investimento_por_estado) ||
        !Array.isArray(result.dados.crescimento_industria)
      ) {
        throw new Error(
          "Resposta da IA não contém a estrutura de dados esperada."
        );
      }

      sessionStorage.setItem("dashboard_data", JSON.stringify(result));
      setData(result as AIData);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro desconhecido";
      console.error("Erro no fetch do dashboard:", errorMessage);
      setError(
        "Não foi possível carregar o dashboard. Verifique sua conexão e a API."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const cachedData = sessionStorage.getItem("dashboard_data");
    if (cachedData) {
      try {
        const parsedData = JSON.parse(cachedData) as AIData;
        setData(parsedData);
        setLoading(false);
        return;
      } catch {
        console.error(
          "Erro ao carregar dados do cache, buscando da API novamente."
        );
        sessionStorage.removeItem("dashboard_data");
      }
    }

    fetchData();
  }, []);

  return {
    startupData: data?.dados?.startups_por_ano || [],
    industryGrowthData: data?.dados?.crescimento_industria || [],
    investmentByState: data?.dados?.investimento_por_estado || [],
    aiResponse: data?.resposta || "",
    loading,
    error,
    progress: loading ? 50 : 100,
    refreshData: fetchData,
  };
}

const SkeletonLoader = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
    <div className="bg-gray-200 h-32 rounded-lg shadow-md col-span-1"></div>
    <div className="bg-gray-200 h-32 rounded-lg shadow-md col-span-1"></div>
    <div className="bg-gray-200 h-32 rounded-lg shadow-md col-span-1"></div>

    <div className="lg:col-span-2 bg-gray-200 h-80 rounded-lg shadow-md"></div>
    <div className="lg:col-span-1 bg-gray-200 h-80 rounded-lg shadow-md"></div>

    <div className="lg:col-span-2 bg-gray-200 h-96 rounded-lg shadow-md"></div>
    <div className="lg:col-span-1 bg-gray-200 h-96 rounded-lg shadow-md"></div>

    <div className="lg:col-span-2 bg-gray-200 h-80 rounded-lg shadow-md"></div>
    <div className="lg:col-span-1 bg-gray-200 h-80 rounded-lg shadow-md"></div>

    <div className="lg:col-span-3 bg-gray-200 h-64 rounded-lg shadow-md"></div>
  </div>
);

export default function DashboardPage() {
  const {
    startupData,
    industryGrowthData,
    investmentByState,
    loading,
    error,
    progress,
    refreshData,
  } = useDashboardData();

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

  return (
    <div className="flex bg-gray-50 font-sans min-h-screen relative">
      {loading && (
        <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
          <div
            className="h-1 bg-[#219ebc] transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}

      <AsideSidebar />

      <main
        className={`flex-1 p-4 md:p-8 md:ml-20 pt-24 transition-opacity duration-500`}
      >
        {loading ? (
          <SkeletonLoader />
        ) : error ? (
          <div className="flex justify-center items-center h-[calc(100vh-100px)] w-full text-center">
            <div
              className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-md"
              role="alert"
            >
              <p className="font-bold">Oops! Ocorreu um erro.</p>
              <p>{error}</p>
            </div>
          </div>
        ) : (
          <div className="space-y-8 animate-fadein">
            <header className="mb-8 flex justify-between items-center flex-wrap">
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                Dashboard de Startups & Investimentos
              </h1>
              <button
                onClick={refreshData}
                disabled={loading}
                className="flex items-center space-x-2 px-4 py-2 mt-4 sm:mt-0 bg-[#ffb703] text-white rounded-lg shadow-md hover:bg-[#a8811c] transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span>Carregando...</span>
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.023 9.348h4.992v-.001m-4.992 0a2.25 2.25 0 01-2.244 2.244 2.25 2.25 0 00-2.243 2.243H9.256m10.027-2.243a2.25 2.25 0 00-2.243-2.244m-2.244 2.244L9.256 12m2.244-2.244L16.023 9.348m-4.47-4.47a2.25 2.25 0 012.244-2.244v-.001m-2.244 2.244v-.001m-2.244 2.244h-.001a2.25 2.25 0 00-2.243 2.243h2.243m2.243-2.243a2.25 2.25 0 012.244-2.244h-.001M8.995 2.25L5.75 5.5m0 0a2.25 2.25 0 01-2.243 2.243h-.001m-2.244-2.243a2.25 2.25 0 00-2.243 2.243h-.001m-2.243-2.243a2.25 2.25 0 012.244-2.244v-.001m2.244 2.244v-.001m2.244 2.244h-.001a2.25 2.25 0 00-2.243 2.243h2.243"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v6m0-3h-3m3 0h3m-6 3a9 9 0 111-9a9 9 0 01-1 9z"
                      />
                    </svg>
                    <span>Atualizar dados</span>
                  </>
                )}
              </button>
            </header>

            <p className="text-gray-600 mt-2">
              Análise do crescimento das startups, investimentos e indústria no
              Brasil.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <EvolutionStartups data={startupData} />
              </div>
              <div className="lg:col-span-1">
                <StartupComparisonCharts data={MOCKED_DATA_COMBINED} />
              </div>

              <div className="lg:col-span-2">
                <BrazilMap
                  data={investmentByState.map((item) => ({
                    state: item.state,
                    public:
                      item.status === "public"
                        ? item.investment_million_brl
                        : 0,
                    private:
                      item.status === "private"
                        ? item.investment_million_brl
                        : 0,
                  }))}
                />
              </div>
              <div className="lg:col-span-1">
                <InvestmentBarCharts data={investmentByState} />
              </div>

              <div className="lg:col-span-2">
                <IndustryGrowthChart data={industryGrowthData} />
              </div>
              <div className="lg:col-span-1">
                <QuickSummaryCard />
              </div>

              <div className="lg:col-span-3">
                <AIResponseCard />
              </div>
            </div>
          </div>
        )}
      </main>

      <style jsx>{`
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        @keyframes fadein {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fadein {
          animation: fadein 0.8s forwards;
        }
      `}</style>
    </div>
  );
}
