"use client";

import { useEffect, useState } from "react";
import {
  LineChart as ReLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import {
  BarChart as BarChartIcon,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AsideSidebar from "../components/AsideSidebar";

interface StartupData {
  year: string;
  count: number;
}
interface InvestmentData {
  state: string;
  public: number;
  private: number;
}
interface ChartCardProps {
  title: string;
  children: React.ReactNode;
}

const ChartCard = ({ title, children }: ChartCardProps) => (
  <div className="bg-white rounded-xl shadow-lg p-6 transition-transform duration-300 hover:scale-[1.01]">
    <h2 className="text-xl font-semibold text-gray-700 mb-4">{title}</h2>
    {children}
  </div>
);

const InvestmentBarCharts = ({ data }: { data: InvestmentData[] }) => (
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
      <XAxis dataKey="state" stroke="#023047" />
      <YAxis stroke="#023047" />
      <Tooltip
        contentStyle={{
          backgroundColor: "#f9fafb",
          borderRadius: 8,
          border: "none",
        }}
        labelStyle={{ color: "#023047", fontWeight: 600 }}
      />
      <Legend />
      <Bar dataKey="public" fill="#219ebc" name="Público" />
      <Bar dataKey="private" fill="#ffb703" name="Privado" />
    </BarChart>
  </ResponsiveContainer>
);

export default function RelatoriosPage() {
  const [startupData, setStartupData] = useState<StartupData[]>([]);
  const [investimentoData, setInvestimentoData] = useState<InvestmentData[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/ai/relatorios");
      if (!response.ok)
        throw new Error("Falha na requisição da API de relatórios.");
      const data = await response.json();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const startupsParsed = (data.startupsPorAno || []).map((item: any) => ({
        ...item,
        year: String(item.year),
      }));

      sessionStorage.setItem("relatorios_data", JSON.stringify(data));
      setStartupData(startupsParsed);
      setInvestimentoData(data.investimentoPorEstado || []);
    } catch (err) {
      console.error("Erro ao buscar dados:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const cachedData = sessionStorage.getItem("relatorios_data");
    if (cachedData) {
      try {
        const parsedData = JSON.parse(cachedData);
        setStartupData(parsedData.startupsPorAno || []);
        setInvestimentoData(parsedData.investimentoPorEstado || []);
        setLoading(false);
        return;
      } catch {
        sessionStorage.removeItem("relatorios_data");
      }
    }
    fetchData();
  }, []);

  const topInvestimento = [...investimentoData].sort(
    (a, b) => b.public + b.private - (a.public + a.private)
  )[0];

  return (
    <div className="flex min-h-screen bg-gray-50 relative">
      <AsideSidebar />
      <main className="flex-1 p-4 md:p-8 w-full min-w-0 pt-24 overflow-auto transition-all duration-300 relative z-0">
        {loading && (
          <div className="fixed inset-0 bg-gray-50/70 z-50 flex items-center justify-center">
            <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16"></div>
          </div>
        )}

        <div
          className="max-w-7xl mx-auto space-y-8 transition-opacity duration-500"
          style={{ opacity: loading ? 0.5 : 1 }}
        >
          <section className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end">
            <div>
              <h1 className="text-4xl font-extrabold text-gray-900">
                Relatórios
              </h1>
              <p className="text-gray-500 mt-2">
                Visualize os dados e métricas do seu projeto de forma clara e
                moderna.
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <button
                onClick={fetchData}
                disabled={loading}
                className="flex items-center space-x-2 px-4 py-2 bg-[#219ebc] text-white rounded-lg shadow-md hover:bg-[#1e89a5] transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
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
                    <span>Atualizar dados</span>
                  </>
                )}
              </button>
            </div>
          </section>

          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 bg-gradient-to-br from-[#8ecae6] to-[#219ebc] border-none">
              <CardHeader className="flex items-center gap-3">
                <BarChartIcon className="text-white w-6 h-6" />
                <CardTitle className="text-lg font-medium text-white">
                  Startups Recentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-white">
                  {startupData.at(-1)?.count ?? "—"}
                </p>
                <p className="text-sm text-gray-200 mt-1">
                  {`em ${startupData.at(-1)?.year ?? "—"}`}
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 bg-gradient-to-br from-[#ffb703] to-[#fb8500] border-none">
              <CardHeader className="flex items-center gap-3">
                <PieChartIcon className="text-white w-6 h-6" />
                <CardTitle className="text-lg font-medium text-white">
                  Maior Investimento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-white">
                  {topInvestimento?.state ?? "—"}
                </p>
                <p className="text-sm text-gray-200 mt-1">
                  estado com mais aporte
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 bg-gradient-to-br from-gray-500 to-gray-700 border-none">
              <CardHeader className="flex items-center gap-3">
                <LineChartIcon className="text-white w-6 h-6" />
                <CardTitle className="text-lg font-medium text-white">
                  Estados mapeados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-white">
                  {investimentoData.length}
                </p>
                <p className="text-sm text-gray-200 mt-1">em todo o Brasil</p>
              </CardContent>
            </Card>
          </section>

          <section className="mt-8 space-y-8">
            <ChartCard title="Startups por Ano">
              <ResponsiveContainer width="100%" height={300}>
                <ReLineChart
                  data={startupData}
                  margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
                >
                  <CartesianGrid strokeDasharray="5 5" stroke="#e5e7eb" />
                  <XAxis dataKey="year" stroke="#023047" />
                  <YAxis stroke="#023047" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#f9fafb",
                      borderRadius: 8,
                      border: "none",
                    }}
                    labelStyle={{ color: "#023047", fontWeight: 600 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#219ebc"
                    strokeWidth={3}
                    dot={{
                      r: 6,
                      fill: "#219ebc",
                      stroke: "#fff",
                      strokeWidth: 2,
                    }}
                    activeDot={{ r: 8 }}
                    animationDuration={1500}
                  />
                </ReLineChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Investimento por Estado">
              <InvestmentBarCharts data={investimentoData} />
            </ChartCard>
          </section>
        </div>
      </main>

      <style jsx>{`
        .loader {
          border-top-color: #219ebc;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
