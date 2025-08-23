import React from "react";
import { Button } from "@/components/ui/button";

interface ReportModalProps {
  onClose: () => void;
  onGenerate: () => void;
  loading: boolean;
  reportStatus?: string | null;
  error?: string | null;
}

export default function ReportModal({
  onClose,
  onGenerate,
  loading,
  reportStatus,
  error,
}: ReportModalProps) {
  return (
    <div
      className="
        fixed inset-0
        bg-black bg-opacity-30 backdrop-blur-md
        flex justify-center items-center
        z-50
        p-6
      "
      aria-modal="true"
      role="dialog"
      aria-labelledby="report-modal-title"
      aria-describedby="report-modal-description"
    >
      <div
        className="
          bg-white bg-opacity-95
          rounded-3xl
          shadow-2xl
          max-w-lg
          w-full
          p-10
          flex flex-col
          relative
          overflow-hidden
        "
      >
        <button
          onClick={onClose}
          aria-label="Fechar relatório"
          className="
            absolute top-5 right-5
            text-gray-400 hover:text-gray-700
            transition-colors duration-200
            text-3xl font-bold
            focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-offset-2
            rounded-full
            select-none
            z-10
          "
        >
          ×
        </button>

        <h2
          id="report-modal-title"
          className="text-2xl font-extrabold mb-6 text-gray-900"
        >
          Gerar Relatório
        </h2>

        <div
          id="report-modal-description"
          className="flex-grow text-gray-700 text-lg mb-8 min-h-[6rem] flex items-center justify-center whitespace-pre-wrap text-center"
        >
          {error ? (
            <p className="text-red-600 font-semibold">{error}</p>
          ) : loading ? (
            <p>Gerando relatório, aguarde...</p>
          ) : reportStatus ? (
            <p>{reportStatus}</p>
          ) : (
            <p>Clique no botão abaixo para gerar o relatório.</p>
          )}
        </div>

        <div className="flex justify-end gap-6">
          <Button
            onClick={onClose}
            variant="outline"
            className="px-6 py-3 font-semibold rounded-xl text-gray-700 hover:bg-gray-100"
            disabled={loading}
          >
            Fechar
          </Button>

          <Button
            onClick={onGenerate}
            className="px-6 py-3 font-semibold rounded-xl"
            disabled={loading}
          >
            {loading ? "Gerando..." : "Gerar relatório"}
          </Button>
        </div>
      </div>
    </div>
  );
}