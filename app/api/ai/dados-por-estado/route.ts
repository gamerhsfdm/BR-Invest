import { NextResponse } from "next/server";
import { generateAIDataWithSchema } from "../../../../lib/ai";

export async function GET() {
  const prompt =
    "Gere dados de investimento e crescimento de startups no Brasil.";
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
      console.error(
        "A função generateAIDataWithSchema não retornou dados de investimento válidos."
      );
      return NextResponse.json(
        { error: "Dados indisponíveis da IA." },
        { status: 500 }
      );
    }


    const finalData = Object.entries(rawData.investimento_por_estado).map(
      ([state, investment_million_brl]) => ({
        state,
        investment_million_brl,
      })
    );

    return NextResponse.json(finalData);
  } catch (err: unknown) {
    console.error("Erro no processamento da API de dados-por-estado:", err);
    const errorMessage =
      err instanceof Error ? err.message : "Falha interna no servidor.";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
