import { NextResponse } from "next/server";
import { generateAIData } from "../../../../lib/ai";

export async function GET() {
  try {
    const rawData = await generateAIData(
      "Gere dados de investimento e crescimento de startups no Brasil."
    );
    if (!Array.isArray(rawData) || rawData.length === 0) {
      console.error(
        "A função generateAIData não retornou um array de dados válido."
      );
      return NextResponse.json(
        { error: "Dados indisponíveis da IA." },
        { status: 500 }
      );
    }
    const investmentByStateMap: { [key: string]: number } = {};

    rawData.forEach((item: any) => {
      if (item.investimento_por_estado) {
        Object.entries(item.investimento_por_estado).forEach(
          ([state, value]) => {
            if (typeof value === "number") {
              investmentByStateMap[state] =
                (investmentByStateMap[state] || 0) + value;
            }
          }
        );
      }
    });
    const finalData = Object.entries(investmentByStateMap).map(
      ([state, investment_million_brl]) => ({
        state,
        investment_million_brl,
      })
    );

    return NextResponse.json(finalData);
  } catch (err: any) {
    console.error("Erro no processamento da API de dados-por-estado:", err);
    return NextResponse.json(
      { error: "Falha interna no servidor." },
      { status: 500 }
    );
  }
}