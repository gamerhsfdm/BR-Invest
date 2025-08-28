"use client";

import React, { useState, useEffect } from "react";

const AIResponseCard = () => {
  const [open, setOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    setIsDesktop(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mediaQuery.addEventListener("change", handler);

    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-[#219ebc] flex items-center justify-center text-white shadow-lg z-50 transition-transform duration-300 hover:scale-110 active:scale-95"
        aria-label="Abrir card da IA"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5.121 17.804A4 4 0 018 16h8a4 4 0 012.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </button>
      <div
        className={`fixed z-50 bg-white p-5 rounded-2xl shadow-lg border border-gray-200 overflow-y-auto max-h-[80vh]
          transition-all duration-300 ease-out transform
          ${
            isDesktop
              ? "bottom-20 right-6 w-80"
              : "inset-x-0 bottom-0 rounded-t-2xl"
          }
          ${
            open
              ? "scale-100 opacity-100"
              : "scale-90 opacity-0 pointer-events-none"
          }
        `}
        role="region"
        aria-label="Resposta da IA"
      >
        <button
          onClick={() => setOpen(false)}
          className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors duration-200"
          aria-label="Fechar card da IA"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        <h2 className="text-xl font-bold text-gray-900 mb-4 tracking-wide">
          Resposta da IA
        </h2>

        <div className="flex items-start gap-4 mb-6">
          <div className="w-9 h-9 rounded-full bg-[#219ebc] flex items-center justify-center text-white shadow-sm flex-shrink-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5.121 17.804A4 4 0 018 16h8a4 4 0 012.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <p className="text-gray-700 text-sm leading-snug">
            São Paulo lidera o investimento em startups, com mais de{" "}
            <strong className="text-[#219ebc]">R$500 milhões</strong> investidos
            em 2024.
          </p>
        </div>

        <a
          href="/perguntar"
          className="w-full bg-[#219ebc] hover:bg-[#1e89a5] active:bg-[#1b7f95] focus:outline-none focus:ring-2 focus:ring-[#8ecae6] focus:ring-opacity-50 text-white font-semibold py-2 rounded-xl shadow-sm transition-colors duration-200 text-center block"
          aria-label="Perguntar para a IA"
        >
          Perguntar
        </a>
      </div>
    </>
  );
};

export default AIResponseCard;
