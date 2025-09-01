import { NextResponse } from "next/server";
import { generateAIDataWithSchema } from "../../../../lib/ai";

export async function GET() {
  const prompt =
    "Gere dados sobre o número de startups por ano no Brasil para um relatório. Inclua anos de 2018 a 2025 e categorize como 'histórico' ou 'projeção'.";
  const schema = {
    type: "ARRAY",
    items: {
      type: "OBJECT",
      properties: {
        ano: { type: "INTEGER" },
        startups_por_ano: { type: "INTEGER" },
        data_tipo: { type: "STRING" },
      },
      propertyOrdering: ["ano", "startups_por_ano", "data_tipo"],
    },
  };

  try {
    const data = await generateAIDataWithSchema(prompt, schema);
    if (!data) {
      return NextResponse.json(
        { error: "Dados indisponíveis ou inválidos da IA." },
        { status: 500 }
      );
    }
    return NextResponse.json({ startupsPorAno: data });
  } catch (err: unknown) {
    console.error("Erro no processamento da API de startups:", err);
    const errorMessage = err instanceof Error ? err.message : "Erro inesperado";
    return NextResponse.json(
      { error: `Falha interna no servidor: ${errorMessage}` },
      { status: 500 }
    );
  }
}
