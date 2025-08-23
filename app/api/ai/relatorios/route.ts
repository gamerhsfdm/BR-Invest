import { NextResponse } from "next/server";
import { generateAIDataWithSchema } from "../../../../lib/ai";

export async function GET() {
  const prompt = `Gere dados de startups, indústria e investimentos no Brasil para um relatório. A resposta deve ser um único objeto JSON contendo as chaves 'startupsPorAno' (array de objetos com 'year' e 'count'), 'investimentoPorEstado' (array de objetos com 'state', 'public' e 'private'), e 'crescimentoIndustria' (array de objetos com 'year' e 'value_percent'). As chaves devem seguir esse padrão: 'startupsPorAno', 'investimentoPorEstado', 'crescimentoIndustria'.`;

  const schema = {
    type: "OBJECT",
    properties: {
      startupsPorAno: {
        type: "ARRAY",
        items: {
          type: "OBJECT",
          properties: {
            year: { type: "NUMBER" },
            count: { type: "NUMBER" },
          },
        },
      },
      investimentoPorEstado: {
        type: "ARRAY",
        items: {
          type: "OBJECT",
          properties: {
            state: { type: "STRING" },
            public: { type: "NUMBER" },
            private: { type: "NUMBER" },
          },
        },
      },
      crescimentoIndustria: {
        type: "ARRAY",
        items: {
          type: "OBJECT",
          properties: {
            year: { type: "NUMBER" },
            value_percent: { type: "NUMBER" },
          },
        },
      },
    },
    propertyOrdering: [
      "startupsPorAno",
      "investimentoPorEstado",
      "crescimentoIndustria",
    ],
  };

  try {
   
    const data = await generateAIDataWithSchema(prompt, schema);

    if (!data) {
      return NextResponse.json(
        { error: "Dados indisponíveis ou inválidos da IA." },
        { status: 500 }
      );
    }

   
    const parsedData = data || {};

    return NextResponse.json({
      startupsPorAno: parsedData.startupsPorAno || [],
      investimentoPorEstado: parsedData.investimentoPorEstado || [],
      crescimentoIndustria: parsedData.crescimentoIndustria || [],
    });
  } catch (err: unknown) {
    console.error("Erro no processamento da API de relatórios:", err);
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
