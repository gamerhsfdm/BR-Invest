import React from "react";
interface QuickSummaryCardProps {
  title?: string;
  description?: string;
  features?: string[];
}

export const QuickSummaryCard = ({
  title = "Resumo do Projeto",
  description = "Esta dashboard apresenta o crescimento de startups, investimentos públicos e privados, e a evolução da indústria no Brasil. Visualize gráficos, mapas e resumos inteligentes gerados pela IA para entender tendências e oportunidades.",
  features = [
    "Evolução de startups ano a ano",
    "Investimentos por estado",
    "Análise de crescimento da indústria",
    "Resumo inteligente gerado pela IA",
  ],
}: QuickSummaryCardProps) => {
  return (
    <div className="w-full max-w-3xl mx-auto p-4 sm:p-6 bg-white rounded-2xl shadow-lg flex flex-col">
      <h2 className="text-xl sm:text-2xl font-bold mb-3 text-gray-800 text-center">
        {title}
      </h2>
      <p className="text-gray-600 mb-4 text-sm sm:text-base text-justify">
        {description}
      </p>
      <ul className="list-disc list-inside text-gray-600 space-y-1 sm:space-y-2 text-sm sm:text-base">
        {features.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

export default QuickSummaryCard;