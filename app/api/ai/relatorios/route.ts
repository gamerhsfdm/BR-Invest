/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { generateAIDataWithSchema } from "../../../../lib/ai";

export async function GET() {
  const prompt = `Gere um objeto JSON contendo dados realistas sobre o cenário de startups, indústria e investimentos no Brasil, baseados em tendências históricas (2018-2023) e projeções (2024).

O objeto JSON deve ter as seguintes chaves, estritamente: 'startupsPorAno', 'investimentoPorEstado', 'crescimentoIndustria'.

Detalhes dos Dados Requeridos:

1. **startupsPorAno:** Array de objetos (year, count) cobrindo **2018 a 2024**. O 'count' representa o número total de startups no Brasil.
2. **investimentoPorEstado:** Array de objetos (state, public, private) com valores em **milhões de BRL**.
* **Instrução Crítica de Escala:** Os valores 'public' e 'private' devem ser o **número que representa a quantia em milhões de BRL**.
 * **Exemplo de Escala (BILHÕES):** Se o investimento privado em SP foi de R$ 5 BILHÕES, o valor deve ser **5000**. Se for R$ 800 MILHÕES, o valor deve ser **800**.
 * **Foco Realista:** Mantenha a forte concentração em SP e RJ e garanta que os valores refletem a magnitude do mercado (bilhões anuais).
3. **crescimentoIndustria:** Array de objetos (year, value_percent) cobrindo **2018 a 2024**. O 'value_percent' representa o crescimento anual da indústria de tecnologia do país.

**Instrução Extra:** Garanta que os dados de investimento reflitam a alta em 2021 e a correção nos anos seguintes.`;

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
    const data: any = await generateAIDataWithSchema(prompt, schema);

    if (!data) {
      return NextResponse.json(
        { error: "Dados indisponíveis ou inválidos da IA." },
        { status: 500 }
      );
    }
    
    const parsedData = data || {};

    const investimento_corrigido = (parsedData.investimentoPorEstado || []).map(
      (item: any) => ({
        state: item.state,
        public: (item.public as number) * 1000000,
        private: (item.private as number) * 1000000,
      })
    );
    
    return NextResponse.json({
      startupsPorAno: parsedData.startupsPorAno || [],
      investimentoPorEstado: investimento_corrigido, 
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