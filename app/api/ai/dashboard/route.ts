/* eslint-disable @typescript-eslint/no-explicit-any */
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
        fonte_dados: { type: "STRING" },
      },
      propertyOrdering: ["resposta", "dados", "fonte_dados"],
    };

    const prompt = `Gere um relatório completo sobre o cenário de startups e investimentos no Brasil. Forneça uma análise geral e os dados em formato JSON para os seguintes tópicos, **garantindo que os dados de evolução do número de startups e de crescimento da indústria cubram o período de 2018 a 2025, com dados históricos até 2023 e projeções para 2024 e 2025**. Ao final, inclua uma string em um campo separado com os nomes das fontes de dados utilizadas, como "Distrito Dataminer", "ABVCAP" e outros relatórios de mercado de Venture Capital. **Não inclua links ou URLs, apenas os nomes das fontes.**

  1. Evolução do número de startups por ano.
  2. Investimento por estado, discriminando valores públicos e privados, **em milhões de BRL**.
  3. Crescimento da indústria de tecnologia no país em porcentagem ao longo dos anos.`;

    const rawData: any = await generateAIDataWithSchema(prompt, schema);

    if (!rawData || !rawData.dados?.investimento_por_estado) {
      return NextResponse.json(
        { error: "Não foi possível obter uma resposta da IA ou dados de investimento." },
        { status: 500 }
      );
    }


    const investimento_corrigido = rawData.dados.investimento_por_estado.map(
      (item: any) => ({
        state: item.state,

        public: (item.public as number) * 1000000,
        private: (item.private as number) * 1000000,
      })
    );

    const finalData = {
      ...rawData,
      dados: {
        ...rawData.dados,
        investimento_por_estado: investimento_corrigido,
      },
    };

    return NextResponse.json(finalData);
  } catch (err: unknown) {
    console.error("Erro no processamento da API de dashboard:", err);
    const errorMessage =
      err instanceof Error
        ? err.message
        : "Falha interna no servidor. Verifique a API da IA.";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}