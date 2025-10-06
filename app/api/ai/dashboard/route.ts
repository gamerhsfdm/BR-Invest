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

    const prompt = `Gere um relatório completo e conciso sobre o cenário de startups e investimentos no Brasil. A resposta deve seguir estritamente o formato JSON definido pelo schema de saída, sem qualquer texto adicional fora do campo 'resposta'.

O relatório deve incluir:
1. Uma **análise geral concisa** (campo 'resposta') sobre o ecossistema brasileiro, mencionando a relevância da **ODS 9 (Indústria, Inovação e Infraestrutura)** para o crescimento sustentável e tecnológico do setor.
2. Dados detalhados (campo 'dados') para o período de **2018 a 2025**, sendo **dados históricos até 2023** e **projeções/estimativas para 2024 e 2025**.

Os campos de dados devem conter:
- **startups_por_ano**: Evolução do número de startups por ano. Use o campo 'status' para indicar 'histórico' ou 'projeção'.
- **investimento_por_estado**: Investimento anual. Os campos 'public' e 'private' devem conter **apenas o valor numérico que representa a quantia total em milhões de BRL**.
    - **Instrução de Unidade:** Para valores em bilhões, converta para milhões (Ex: R$ 1.500.000.000,00 deve ser **1500**). Para valores em milhões, use o valor direto (Ex: R$ 850.000.000,00 deve ser **850**).
- **crescimento_industria**: Crescimento percentual da indústria de tecnologia do país. O campo 'value_percent' deve ser o **valor numérico percentual** (Ex: para 10.5% o valor é 10.5).

O campo **fonte_dados** deve conter uma lista separada por vírgulas dos nomes das principais fontes de dados de Venture Capital e tecnologia (ex: "Distrito Dataminer, ABVCAP, Sebrae, Brasscom"). **Não inclua links ou URLs.**`;

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