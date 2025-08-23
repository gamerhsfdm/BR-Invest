import { NextResponse } from "next/server";
import { generateAIDataWithSchema } from "../../../../lib/ai";

export async function GET() {
  const prompt =
    "Gere dados fictícios sobre o crescimento percentual da Indústria 4.0 por ano no Brasil. Inclua anos de 2018 a 2025 e categorize como 'histórico' ou 'projeção'.";
  const schema = {
    type: "ARRAY",
    items: {
      type: "OBJECT",
      properties: {
        ano: { type: "INTEGER" },
        crescimento_industria: { type: "NUMBER" },
        data_tipo: { type: "STRING" },
      },
      propertyOrdering: ["ano", "crescimento_industria", "data_tipo"],
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
    return NextResponse.json({ crescimentoIndustria: data });
  } catch (err: any) {
    console.error("Erro no processamento da API da indústria:", err);
    return NextResponse.json(
      { error: "Falha interna no servidor. Verifique a API da IA." },
      { status: 500 }
    );
  }
}
