import { NextResponse } from "next/server";
import { generateAIDataWithSchema } from "../../../../lib/ai";

export async function GET() {
  const prompt =
    "Gere dados sobre investimento (em milhões de BRL) em startups por estado no Brasil para um relatório. A resposta deve ser um objeto onde as chaves são as siglas dos estados e os valores são os investimentos.";
  const schema = {
    type: "OBJECT",
    properties: {
      investimento_por_estado: {
        type: "OBJECT",
        additionalProperties: {
          type: "INTEGER",
        },
      },
    },
  };

  try {
    const rawData = await generateAIDataWithSchema(prompt, schema);
    if (!rawData || !rawData.investimento_por_estado) {
      return NextResponse.json(
        { error: "Dados de investimento indisponíveis ou inválidos." },
        { status: 500 }
      );
    }

    const investimentoPorEstado = Object.entries(
      rawData.investimento_por_estado
    ).map(([state, investment_million_brl]) => ({
      state,
      investment_million_brl,
    }));

    return NextResponse.json({ investimentoPorEstado });
  } catch (err: unknown) {
    console.error("Erro no processamento da API de investimento:", err);
    const errorMessage =
      err instanceof Error
        ? err.message
        : "Erro inesperado ao processar a API.";
    return NextResponse.json(
      { error: `Falha interna no servidor: ${errorMessage}` },
      { status: 500 }
    );
  }
}
