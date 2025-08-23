import { NextResponse } from "next/server";
import { generateAIDataWithSchema } from "../../../../lib/ai";

export async function POST(req: Request) {
  try {
    const { question } = await req.json();

    if (!question) {
      return NextResponse.json(
        { error: "A pergunta é necessária para a requisição." },
        { status: 400 }
      );
    }
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
                  investment_million_brl: { type: "NUMBER" },
                  status: { type: "STRING" },
                },
                propertyOrdering: ["state", "investment_million_brl", "status"],
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
      `Gere um relatório completo sobre startups e investimentos no Brasil, incluindo uma análise geral e dados em formato JSON para os seguintes temas: evolução do número de startups por ano, investimento por estado e crescimento da indústria.`,
      schema
    );

    if (!data) {
      return NextResponse.json(
        { error: "Não foi possível obter uma resposta da IA." },
        { status: 500 }
      );
    }
    return NextResponse.json(data);
  } catch (err) {
    console.error("Erro no processamento da API de perguntas:", err);
    return NextResponse.json(
      { error: "Falha interna no servidor. Verifique a API da IA." },
      { status: 500 }
    );
  }
}
