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

    const prompt = `
      Analise a seguinte pergunta do usuário: "${question}"
      
      Se a pergunta for sobre inovação, investimentos, startups ou indústria no Brasil, gere um relatório completo, incluindo uma análise geral e os dados em formato JSON para os seguintes tópicos:
      1. Evolução do número de startups por ano (de 2018 a 2025, com dados históricos e projeções).
      2. Investimento por estado, com valores em BRL e status (histórico ou projeção).
      3. Crescimento da indústria de tecnologia no Brasil em porcentagem por ano (de 2018 a 2025, com dados históricos e projeções).
      
      Se a pergunta não for sobre esses tópicos, responda estritamente com a seguinte frase: "Parece que sua pergunta está fora do meu escopo de atuação. Posso ajudar com informações sobre inovação, investimentos e o setor industrial no Brasil."
    `;

    const data = await generateAIDataWithSchema(prompt, schema);

    if (!data) {
      return NextResponse.json(
        { error: "Não foi possível obter uma resposta da IA." },
        { status: 500 }
      );
    }

    const aiResponse = data as { resposta?: string };
    if (aiResponse.resposta && aiResponse.resposta.includes("Desculpe")) {
      return NextResponse.json({
        resposta: aiResponse.resposta,
        dados: null,
      });
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
