"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import ReactMarkdown from "react-markdown";
import { RefreshCcw, Brain } from "lucide-react";

interface StartupData {
  year: string;
  count: number;
}

interface IndustryGrowthData {
  year: string;
  value_percent: number;
}

interface InvestmentByState {
  state: string;
  public: number;
  private: number;
}

interface Props {
  startupData: StartupData[];
  industryGrowthData: IndustryGrowthData[];
  investmentByState: InvestmentByState[];
}

export default function SmartSummaryGenerator({
  startupData,
  industryGrowthData,
  investmentByState,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  async function generateSummary() {
    setLoading(true);
    setError(null);
    setIsOpen(false);

    try {
      const cachedSummary = sessionStorage.getItem("smart_summary_cache");
      if (cachedSummary) {
        setSummary(cachedSummary);
        setIsOpen(true);
        return;
      }

      const response = await fetch(`/api/ai/resumointeligente`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          startups: startupData,
          industria: industryGrowthData,
          investimento: investmentByState,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro HTTP: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      const newSummary = data.resumo || "Nenhum resumo disponível.";

      sessionStorage.setItem("smart_summary_cache", newSummary);

      setSummary(newSummary);
      setIsOpen(true);
    } catch (err: unknown) {
      console.error("Erro ao gerar resumo inteligente:", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Erro desconhecido ao gerar resumo inteligente.";
      setError(errorMessage);
      setIsOpen(true);
    } finally {
      setLoading(false);
    }
  }

  function closeModal() {
    setIsOpen(false);
    setSummary("");
    setError(null);
  }

  return (
    <div className="mt-4">
      <Button onClick={generateSummary} disabled={loading} className="w-full bg-[#219ebc] hover:bg-[#1e89a5] text-white">
        {loading ? (
          <>
            <RefreshCcw className="animate-spin h-4 w-4 mr-2" /> Gerando...
          </>
        ) : (
          <>
            <Brain className="h-4 w-4 mr-2" /> Gerar resumo inteligente
          </>
        )}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl w-full max-h-[80vh] rounded-lg p-6 bg-white shadow-lg flex flex-col">
          <DialogHeader>
            <DialogTitle>Resumo Inteligente</DialogTitle>
          </DialogHeader>

          <DialogDescription asChild>
            <div className="flex-1 overflow-y-auto prose max-w-none text-gray-800 mt-4 mb-4">
              {loading && <span>Carregando resumo, aguarde...</span>}
              {!loading && error && (
                <span className="text-red-500">{error}</span>
              )}
              {!loading && !error && <ReactMarkdown>{summary}</ReactMarkdown>}
            </div>
          </DialogDescription>

          <DialogFooter className="flex justify-end pt-4 border-t border-gray-200">
            <Button variant="secondary" onClick={closeModal}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
