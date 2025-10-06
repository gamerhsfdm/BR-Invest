"use client"
import React, { useState, useCallback, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import AsideSidebar from "../components/AsideSidebar";

const PRIMARY_COLOR = "#219ebc";
const DARK_COLOR = "#023047";
const LIGHT_COLOR = "#8ecae6";

function LoadingBar() {
  return (
    <div className="w-full flex flex-col items-center py-10">
      <div className="w-3/4 h-2 bg-gray-200 rounded-full overflow-hidden relative">
        <div
          className="absolute top-0 left-0 h-2 bg-[#219ebc] animate-pulse"
          style={{ width: "40%" }}
        />
      </div>
      <p className="mt-4 text-[#219ebc] font-medium tracking-wide">
        Processando sua pergunta...
      </p>
    </div>
  );
}

interface ApiResponse {
  resposta: string; 
}

export default function App() { 
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

        if (!res.ok) {
          const errorBody = await res.json();
          throw new Error(
            `Erro na requisição: ${res.status} - ${
              errorBody.error || res.statusText
            }`
          );
        }

        const data = (await res.json()) as ApiResponse;

        const textoResposta =
          data.resposta ??
          "Nenhuma resposta recebida ou campo 'resposta' vazio.";
        
        setAnswer(textoResposta);
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "Erro desconhecido";
        console.error("Erro ao buscar resposta:", errorMessage);

        setAnswer(
          `Desculpe, ocorreu um erro ao buscar a resposta: ${errorMessage}`
        );
      } finally {
        setIsLoading(false);
        setAnswered(true);
      }
    },
    [question]
  );

  const handleReset = useCallback(() => {
    setQuestion("");
    setAnswer("");
    setAnswered(false);
    setIsLoading(false);
  }, []);


  useEffect(() => {
    if (answered && answerRef.current) {
      answerRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [answered]);

  return (
    <div className="flex h-screen bg-gradient-to-br from-[#e3f2fd] via-[#f5fbff] to-[#f8fafc] font-sans text-gray-800">
      <AsideSidebar /> 

      <div className="flex-1 overflow-auto p-6 pt-24 md:p-10 ml-0 md:ml-20 flex justify-center">
        <div className="w-full max-w-3xl flex flex-col space-y-10">
          
          <div className="relative group bg-white/60 backdrop-blur-2xl border border-white/30 rounded-3xl p-10 shadow-[0_8px_40px_rgba(33,158,188,0.15)] transition-all duration-500 hover:shadow-[0_12px_60px_rgba(33,158,188,0.3)] hover:-translate-y-1 overflow-hidden min-h-[500px]">
            <div className="absolute inset-0 bg-gradient-to-br from-[#8ecae6]/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-3xl pointer-events-none" />
            <header className="flex flex-col items-center justify-center space-y-4">
              <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-[#219ebc]/10 backdrop-blur-md border border-[#219ebc]/20 shadow-inner">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-8 h-8 text-[#219ebc] drop-shadow-md"
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
                </svg>
              </div>

              <h1 className="text-4xl font-extrabold text-[#023047] tracking-tight text-center">
                Faça sua pergunta
              </h1>
              <p className="text-gray-600 text-base text-center max-w-md">
                Pergunte sobre inovação, startups, tecnologia ou ODS 9 no Brasil.
              </p>
            </header>
            {!isLoading ? (
                <form onSubmit={handleSubmit} className="flex flex-col space-y-6 mt-8">
                <textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    rows={4}
                    placeholder="Digite sua pergunta aqui..."
                    className="rounded-2xl p-5 text-lg border border-gray-200 shadow-inner resize-none focus:outline-none focus:ring-4 focus:ring-[#8ecae6]/70 transition-all duration-300 text-gray-900 bg-white/70 backdrop-blur-md hover:bg-white/90 placeholder:text-gray-400"
                    aria-label="Pergunta"
                />

                <button
                    type="submit"
                    disabled={isLoading || !question.trim() || answered}
                    aria-busy={isLoading}
                    aria-disabled={isLoading || !question.trim() || answered}
                    className={`
                    self-end px-8 py-3 rounded-2xl font-semibold text-white shadow-md
                    bg-gradient-to-r from-[#219ebc] to-[#023047]
                    transition-all duration-500 focus:outline-none focus:ring-4 focus:ring-[#8ecae6]/50
                    ${isLoading || !question.trim() || answered
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:-translate-y-0.5 hover:shadow-lg hover:from-[#219ebc] hover:to-[#035272]"
                    }
                    `}
                >
                    {"Perguntar"}
                </button>
                </form>
            ) : (
                <div className="mt-8 text-center text-gray-500">
                    Sua pergunta foi enviada.
                </div>
            )}
          </div>
          {isLoading && <LoadingBar />}
          {answered && !isLoading && answer.trim() && ( 
            <section
              ref={answerRef}
              className="mt-8 bg-white/70 backdrop-blur-2xl border border-white/30 rounded-3xl p-8 shadow-[0_8px_32px_rgba(2,48,71,0.1)] text-gray-800 transition-all duration-500"
            >
              <h2 className="text-2xl font-bold mb-6 text-[#023047]">
                Resposta para:{" "}
                <span className="italic text-[#219ebc]">{question}</span>
              </h2>

              <article className="mb-8 bg-gray-50/80 p-6 rounded-xl text-gray-900 leading-relaxed border border-gray-200 shadow-inner prose max-w-none break-words prose-p:mb-2 prose-li:my-1">
                <ReactMarkdown>{answer}</ReactMarkdown>
              </article>
              <div className="flex justify-end pt-4 border-t border-gray-200">
                <button
                    onClick={handleReset}
                    className="flex items-center space-x-2 px-6 py-2 rounded-xl font-semibold text-[#023047] border border-gray-300 bg-gray-100 shadow-sm
                    transition-all duration-300 hover:bg-white hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#8ecae6]"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path><path d="M21 3v5h-5"></path><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path><path d="M3 21v-5h5"></path></svg>
                    <span>Nova Pergunta</span>
                </button>
              </div>

            </section>
          )}
        </div>
      </div>
    </div>
  );
}