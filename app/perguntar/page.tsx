"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import { FaRobot } from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import AsideSidebar from "../components/AsideSidebar";

interface InvestmentDataItem {
  state: string;
  publicValue: number;
  privateValue: number;
}

interface StartupDataItem {
  year: number;
  count: number;
}

interface InvestmentBarChartProps {
  data: InvestmentDataItem[];
}

interface StartupLineChartProps {
  data: StartupDataItem[];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function pickString(...vals: unknown[]): string {
  for (const v of vals) {
    if (typeof v === "string") return v;
  }
  return "";
}

function pickNumber(...vals: unknown[]): number {
  for (const v of vals) {
    if (typeof v === "number" && Number.isFinite(v)) return v;
    if (typeof v === "string") {
      const n = Number(v);
      if (Number.isFinite(n)) return n;
    }
  }
  return 0;
}

function toInvestmentDataItem(rec: Record<string, unknown>): InvestmentDataItem {
  return {
    state: pickString(rec["state"], rec["estado"], rec["category"]),
    publicValue: pickNumber(rec["public"], rec["publico"]),
    privateValue: pickNumber(rec["private"], rec["privado"]),
  };
}

function toStartupDataItem(rec: Record<string, unknown>): StartupDataItem {
  return {
    year: pickNumber(rec["year"], rec["ano"]),
    count: pickNumber(rec["count"], rec["quantidade"]),
  };
}

const InvestmentBarChart: React.FC<InvestmentBarChartProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 my-4">
      <h3 className="text-lg font-semibold text-gray-800">Investimento por Estado</h3>
      <p className="text-sm text-gray-600">Dados de investimento simulados para o exemplo.</p>
      <ul className="mt-4 space-y-2">
        {data.map((item, index) => (
          <li key={index} className="flex justify-between items-center text-sm">
            <span>{item.state}</span>
            <div className="flex items-center">
              <span className="text-blue-500 mr-2">Público: R${item.publicValue}M</span>
              <span className="text-green-500">Privado: R${item.privateValue}M</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

const StartupLineChart: React.FC<StartupLineChartProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 my-4">
      <h3 className="text-lg font-semibold text-gray-800">Startups por Ano</h3>
      <p className="text-sm text-gray-600">Dados de startups simulados para o exemplo.</p>
      <ul className="mt-4 space-y-2">
        {data.map((item, index) => (
          <li key={index} className="flex justify-between items-center text-sm">
            <span>Ano: {item.year}</span>
            <span>Contagem: {item.count}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

function LoadingBar() {
  return (
    <div className="w-full flex flex-col items-center py-10">
      <div className="w-3/4 h-2 bg-gray-200 rounded-full overflow-hidden relative">
        <div className="absolute top-0 left-0 h-2 w-1/4 bg-blue-600 animate-loading" />
      </div>
      <p className="mt-4 text-blue-600 font-semibold">Processando sua pergunta...</p>
    </div>
  );
}

interface ApiDados {
  investimentoPorEstado?: unknown;
  investimento_por_estado?: unknown;
  startupsPorAno?: unknown;
  startups_por_ano?: unknown;
}

interface ApiResponse {
  answer?: string;
  resposta?: string;
  dados?: ApiDados;
}

export default function PerguntarPage() {
  const [question, setQuestion] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const [answered, setAnswered] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [investmentData, setInvestmentData] = useState<InvestmentDataItem[]>([]);
  const [startupData, setStartupData] = useState<StartupDataItem[]>([]);
  const answerRef = useRef<HTMLDivElement | null>(null);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!question.trim()) return;

      setIsLoading(true);
      setAnswered(false);
      setAnswer("");
      setInvestmentData([]);
      setStartupData([]);

      try {
        const res = await fetch(`/api/ai/pergunta`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question }),
        });

        if (!res.ok) throw new Error(`Erro na requisição: ${res.status}`);

        const data = (await res.json()) as unknown as ApiResponse;

        const textoResposta = data.answer ?? data.resposta ?? "Nenhuma resposta recebida.";
        setAnswer(textoResposta);

        const investimentoRawUnknown: unknown =
          data.dados?.investimentoPorEstado ?? data.dados?.investimento_por_estado ?? [];

        const investimentoItems: InvestmentDataItem[] = Array.isArray(investimentoRawUnknown)
          ? (investimentoRawUnknown
              .filter(isRecord)
              .map((rec) => toInvestmentDataItem(rec)))
          : [];

        setInvestmentData(investimentoItems);

        const startupsRawUnknown: unknown =
          data.dados?.startupsPorAno ?? data.dados?.startups_por_ano ?? [];

        const startupItems: StartupDataItem[] = Array.isArray(startupsRawUnknown)
          ? (startupsRawUnknown
              .filter(isRecord)
              .map((rec) => toStartupDataItem(rec)))
          : [];

        setStartupData(startupItems);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : "Erro desconhecido";
        console.error("Erro ao buscar resposta:", errorMessage);
        setAnswer("Erro ao buscar resposta da IA.");
      } finally {
        setIsLoading(false);
        setAnswered(true);
      }
    },
    [question]
  );

  useEffect(() => {
    if (answered && answerRef.current) {
      answerRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [answered]);

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      <AsideSidebar />
      <main className="flex-1 overflow-auto p-6 pt-24 md:p-10 ml-0 md:ml-20 flex justify-center">
        <div className="w-full max-w-3xl flex flex-col space-y-6">
          <div className="bg-white rounded-3xl shadow-xl p-10 flex flex-col space-y-6">
            <header className="flex items-center space-x-4 justify-center">
              <FaRobot className="text-blue-600 w-10 h-10" aria-hidden="true" />
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900">
                Faça sua pergunta
              </h1>
            </header>

            <form onSubmit={handleSubmit} className="flex flex-col space-y-5">
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                rows={4}
                placeholder="Digite sua pergunta aqui..."
                className="rounded-lg p-5 text-lg border border-gray-300 shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                aria-label="Pergunta"
              />
              <button
                type="submit"
                disabled={isLoading}
                className={`self-end bg-blue-600 hover:bg-blue-700 transition-colors text-white font-semibold px-8 py-3 rounded-xl shadow-md focus:outline-none focus:ring-4 focus:ring-blue-300 ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                Perguntar
              </button>
            </form>
          </div>

          {isLoading && <LoadingBar />}

          {answered && !isLoading && (
            <section
              ref={answerRef}
              className="mt-8 bg-white rounded-xl p-8 shadow-2xl text-gray-800 animate-fadeIn"
              aria-live="polite"
              aria-atomic="true"
            >
              <h2 className="text-2xl font-bold mb-6">
                Resposta para: <span className="italic text-indigo-600">{question}</span>
              </h2>

              <article
                className="mb-8 bg-gray-100 p-6 rounded-lg text-gray-900 leading-relaxed border border-gray-300 shadow-inner prose max-w-none"
                role="region"
                aria-live="polite"
                aria-atomic="true"
              >
                <ReactMarkdown>{answer}</ReactMarkdown>
              </article>

              {investmentData.length > 0 && <InvestmentBarChart data={investmentData} />}
              {startupData.length > 0 && <StartupLineChart data={startupData} />}
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
