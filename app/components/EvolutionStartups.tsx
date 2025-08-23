"use client";

import { useMemo } from "react";
import { StartupEvolutionChart } from "./StartupEvolutionChart"; 
interface StartupData {
  year: string;
  count: number;
}

interface Props {
  data: StartupData[] | null; 
}

const EvolutionStartups = ({ data }: Props) => {
  const sortedData = useMemo(() => {
    if (!data) return [];
    return [...data].sort((a, b) => parseInt(a.year) - parseInt(b.year));
  }, [data]);

  if (sortedData.length === 0) {
    return (
      <div className="flex items-center justify-center h-full min-h-[300px]">
        <p className="text-gray-500">Nenhum dado de evolução disponível.</p>
      </div>
    );
  }
  return (
    <div className="w-full h-full">
      <StartupEvolutionChart data={sortedData} />
    </div>
  );
};

export default EvolutionStartups;