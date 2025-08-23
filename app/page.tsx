"use client";

import { useEffect, useState } from "react";
import AIResponseCard from "./components/AIResponseCard";
import BrazilMap from "./components/BrazilMap";
import InvestmentBarCharts from "./components/InvestmentBarCharts";
import AsideSidebar from "./components/AsideSidebar";
import EvolutionStartups from "./components/EvolutionStartups";
import IndustryGrowthChart from "./components/IndustryGrowthChart";
import QuickSummaryCard from "./components/QuickSummaryCard";
import StartupComparisonCharts from "./components/StartupComparisonCharts";
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

      const result: AIData = await response.json();

      if (!result || !result.dados || !result.dados.startups_por_ano) {
        throw new Error(
          "Resposta da IA não contém a estrutura de dados esperada."
        );
      }

      sessionStorage.setItem("dashboard_data", JSON.stringify(result));

      setData(result);
    } catch (err: any) {
      console.error("Erro no fetch do dashboard:", err);
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
        const parsedData = JSON.parse(cachedData);
        setData(parsedData);
        setLoading(false);
        return; 
      } catch (e) {
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
    aiResponse,
    loading,
    error,
    progress,
    refreshData,
  } = useDashboardData();

  return (
    <div className="flex bg-gray-50 font-sans min-h-screen relative">
      {loading && (
        <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
          <div
            className="h-1 bg-blue-500 transition-all duration-300"
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
                className="flex items-center space-x-2 px-4 py-2 mt-4 sm:mt-0 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
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
                <StartupComparisonCharts data={startupData} />
              </div>

              <div className="lg:col-span-2">
                <BrazilMap data={investmentByState} />
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
                <AIResponseCard responseText={aiResponse} />
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
