"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import AsideSidebar from "../components/AsideSidebar";

// Cores da nova paleta
const PRIMARY_COLOR = "#219ebc";
const DARK_COLOR = "#023047";
const LIGHT_COLOR = "#8ecae6";

function LoadingBar() {
  return (
    <div className="w-full flex flex-col items-center py-10">
      <div className="w-3/4 h-2 bg-gray-200 rounded-full overflow-hidden relative">
        <div className="absolute top-0 left-0 h-2 w-1/4 bg-[${PRIMARY_COLOR}] animate-loading" />
      </div>
      <p className={`mt-4 text-[${PRIMARY_COLOR}] font-semibold`}>
        Processando sua pergunta...
      </p>
    </div>
  );
}

interface ApiResponse {
  answer?: string;
  resposta?: string;
}

export default function PerguntarPage() {
  const [question, setQuestion] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const [answered, setAnswered] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const answerRef = useRef<HTMLDivElement | null>(null);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!question.trim()) return;

      setIsLoading(true);
      setAnswered(false);
      setAnswer("");

      try {
        const res = await fetch(`/api/ai/pergunta`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question }),
        });

        if (!res.ok) throw new Error(`Erro na requisição: ${res.status}`);

        const data = (await res.json()) as unknown as ApiResponse;
        const textoResposta =
          data.answer ?? data.resposta ?? "Nenhuma resposta recebida.";
        setAnswer(textoResposta);
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "Erro desconhecido";
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
    <div className="flex h-screen bg-gray-50 font-sans text-gray-800">
      <AsideSidebar />
      <div className="flex-1 overflow-auto p-6 pt-24 md:p-10 ml-0 md:ml-20 flex justify-center">
        <div className="w-full max-w-3xl flex flex-col space-y-6">
          <div className="bg-white rounded-3xl shadow-lg p-10 flex flex-col space-y-6 border border-gray-200">
            <header className="flex items-center space-x-4 justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`text-[${PRIMARY_COLOR}] w-10 h-10`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="16" height="16" x="4" y="2" rx="2" ry="2"></rect>
                <path d="M7 11v-4"></path>
                <path d="M17 11v-4"></path>
                <path d="M12 2v2"></path>
                <path d="M12 20v2"></path>
                <path d="M10 22h4"></path>
                <path d="M2 12h2"></path>
                <path d="M20 12h2"></path>
                <path d="M17.5 17.5l-2-2"></path>
                <path d="M6.5 6.5l-2-2"></path>
                <path d="M4 20v-2"></path>
                <path d="M20 20v-2"></path>
                <path d="M9 16c.99-1.2 1.48-1.79 3-2s2.01.8 3 2"></path>
              </svg>
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
                className={`rounded-lg p-5 text-lg border border-gray-300 shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-[${PRIMARY_COLOR}] transition text-gray-900`}
                aria-label="Pergunta"
              />
              <button
                type="submit"
                disabled={isLoading}
                className={`self-end bg-[${PRIMARY_COLOR}] hover:bg-[${DARK_COLOR}] transition-colors text-white font-semibold px-8 py-3 rounded-xl shadow-md focus:outline-none focus:ring-4 focus:ring-[${LIGHT_COLOR}] ${
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
                Resposta para:{" "}
                <span className={`italic text-[${PRIMARY_COLOR}]`}>
                  {question}
                </span>
              </h2>

              <article
                className="mb-8 bg-gray-100 p-6 rounded-lg text-gray-900 leading-relaxed border border-gray-300 shadow-inner prose max-w-none"
                role="region"
                aria-live="polite"
                aria-atomic="true"
              >
                <ReactMarkdown>{answer}</ReactMarkdown>
              </article>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
