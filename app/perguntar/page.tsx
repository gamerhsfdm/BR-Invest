"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import { FaRobot } from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import AsideSidebar from "../components/AsideSidebar";

type InvestmentDataItem = {
  state: string;
  public: number;
  private: number;
};

type StartupDataItem = {
  year: number;
  count: number;
};

function LoadingBar() {
  return (
    <div className="w-full flex flex-col items-center py-10">
      <div className="w-3/4 h-2 bg-gray-200 rounded-full overflow-hidden relative">
        <div className="absolute top-0 left-0 h-2 w-1/4 bg-blue-600 animate-loading"></div>
      </div>
      <p className="mt-4 text-blue-600 font-semibold">
        Processando sua pergunta...
      </p>

      <style jsx>{`
        @keyframes loading {
          0% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(50%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-loading {
          animation: loading 1.5s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}

export default function PerguntarPage() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [answered, setAnswered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [investmentData, setInvestmentData] = useState<InvestmentDataItem[]>(
    []
  );
  const [startupData, setStartupData] = useState<StartupDataItem[]>([]);
  const answerRef = useRef<HTMLDivElement>(null);

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
        const res = await fetch(
          `/api/ai/pergunta`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ question }),
          }
        );

        if (!res.ok) throw new Error(`Erro na requisição: ${res.status}`);

        const data = await res.json();
        setAnswer(data.answer || data.resposta || "Nenhuma resposta recebida.");

        if (data.dados) {
          const investimentoRaw =
            data.dados.investimentoPorEstado ||
            data.dados.investimento_por_estado ||
            [];
          if (Array.isArray(investimentoRaw)) {
            const processedInvestmentData = investimentoRaw.map((d: any) => ({
              state: d.state || d.estado || d.category || "",
              public: d.public ?? d.publico ?? 0,
              private: d.private ?? d.privado ?? 0,
            }));
            setInvestmentData(processedInvestmentData);
          }

          const startupsRaw =
            data.dados.startupsPorAno || data.dados.startups_por_ano || [];
          if (Array.isArray(startupsRaw)) {
            const processedStartupData = startupsRaw.map((d: any) => ({
              year: String(d.year || d.ano || 0), 
              count: d.count || d.quantidade || 0,
            }));
            setStartupData(processedStartupData);
          }
        }
      } catch (err) {
        console.error("Erro ao buscar resposta:", err);
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
    <main className="flex-1 overflow-auto p-6 pt-24 md:p-10 ml-0 md:ml-48 flex justify-center">
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

        {answered && (
          <section
            ref={answerRef}
            className="mt-8 bg-white rounded-xl p-8 shadow-2xl text-gray-800 animate-fadeIn"
            style={{
              animationDuration: "0.6s",
              animationFillMode: "forwards",
            }}
            aria-live="polite"
            aria-atomic="true"
          >
            <h2 className="text-2xl font-bold mb-6">
              Resposta para: <span className="italic text-indigo-600">{question}</span>
            </h2>

            {isLoading ? (
              <LoadingBar />
            ) : (
              <article
                className="mb-8 bg-gray-100 p-6 rounded-lg text-gray-900 leading-relaxed border border-gray-300 shadow-inner prose max-w-none"
                role="region"
                aria-live="polite"
                aria-atomic="true"
              >
                <ReactMarkdown>{answer}</ReactMarkdown>
              </article>
            )}
            
          </section>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation-name: fadeIn;
          animation-duration: 0.5s;
          animation-timing-function: ease-out;
          animation-fill-mode: forwards;
        }
      `}</style>
    </main>
  </div>
)}