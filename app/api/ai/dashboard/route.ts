import { NextResponse } from "next/server";
import { generateAIDataWithSchema } from "../../../../lib/ai";

export async function POST() {
  try {
    const schema = {
      type: "OBJECT",
      properties: {
        resposta: { type: "STRING" },
        dados: {
          type: "OBJECT",
          properties: {
            startups_por_ano: {
              type: "ARRAY",
              items: {
                type: "OBJECT",
                properties: {
                  year: { type: "STRING" },
                  count: { type: "NUMBER" },
                  status: { type: "STRING" },
                },
                propertyOrdering: ["year", "count", "status"],
              },
            },
            investimento_por_estado: {
              type: "ARRAY",
              items: {
                type: "OBJECT",
                properties: {
                  state: { type: "STRING" },
                  public: { type: "NUMBER" },
                  private: { type: "NUMBER" },
                },
                propertyOrdering: ["state", "public", "private"],
              },
            },
            crescimento_industria: {
              type: "ARRAY",
              items: {
                type: "OBJECT",
                properties: {
                  year: { type: "STRING" },
                  value_percent: { type: "NUMBER" },
                  status: { type: "STRING" },
                },
                propertyOrdering: ["year", "value_percent", "status"],
              },
            },
          },
          propertyOrdering: [
            "startups_por_ano",
            "investimento_por_estado",
            "crescimento_industria",
          ],
        },
      },
      propertyOrdering: ["resposta", "dados"],
    };
    const data = await generateAIDataWithSchema(
      `Gere um relatório completo sobre o cenário de startups e investimentos no Brasil. Forneça uma análise geral e os dados em formato JSON para os seguintes tópicos: 
      1. Evolução do número de startups por ano.
      2. Investimento por estado, discriminando valores públicos e privados.
      3. Crescimento da indústria de tecnologia no país em porcentagem ao longo dos anos.`,
      schema
    );

    if (!data) {
      return NextResponse.json(
        { error: "Não foi possível obter uma resposta da IA." },
        { status: 500 }
      );
    }
    return NextResponse.json(data);
  } catch (err: unknown) {
    console.error("Erro no processamento da API de dashboard:", err);
    const errorMessage =
      err instanceof Error
        ? err.message
        : "Falha interna no servidor. Verifique a API da IA.";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
