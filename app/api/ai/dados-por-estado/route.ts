import { NextResponse } from "next/server";
import { generateAIDataWithSchema } from "../../../../lib/ai";

export async function GET() {
const prompt = `
Gere dados atualizados de investimento em startups no Brasil, incluindo TODOS os 26 estados brasileiros e o Distrito Federal (total de 27 entradas). 
Para cada entrada, forneça as seguintes propriedades:

- "state": nome completo do estado;
- "publicInvestment": valor de investimento público em milhões de BRL (número flutuante);
- "privateInvestment": valor de investimento privado em milhões de BRL (número flutuante);
- "mainSector": área principal do investimento;
- "sourceName": nome da empresa, publicação ou site que forneceu a informação (ex: "PwC Brasil");
- "sourceUrl": URL direta do relatório, estudo ou notícia que comprova a informação.

Use apenas fontes confiáveis brasileiras, preferencialmente relatórios oficiais, publicações de grandes empresas ou notícias de sites especializados em economia e startups. Evite URLs genéricas, inválidas ou desatualizadas. 
Retorne os dados em um array JSON, sem explicações adicionais.
`;

  const schema = {
    type: "ARRAY",
    items: {
      type: "OBJECT",
      properties: {
        state: {
          type: "STRING",
          description:
            "Nome do Estado brasileiro (ex: 'São Paulo', 'Rio Grande do Sul')",
        },
        public: {
          type: "NUMBER",
          description: "Investimento público em milhões de BRL (ex: 150.5)",
        },
        private: {
          type: "NUMBER",
          description: "Investimento privado em milhões de BRL (ex: 420.75)",
        },
        area: {
          type: "STRING",
          description:
            "Área de foco do investimento (ex: Fintech, Agrotech, Saúde Digital)",
        },
        source: {
          type: "STRING",
          description:
            "O nome da publicação, empresa de pesquisa ou URL direta para a fonte dos dados (ex: 'ABStartups Report' ou 'https://exemplo.com/report').",
        },
      },
      required: ["state", "public", "private", "area", "source"],
    },
  };

  try {
    const finalData = await generateAIDataWithSchema(prompt, schema);

    if (!finalData || !Array.isArray(finalData) || finalData.length === 0) {
      console.error(
        "A função generateAIDataWithSchema não retornou dados de investimento válidos ou retornou um array vazio."
      );
      return NextResponse.json(
        { error: "Dados indisponíveis da IA ou formato inválido." },
        { status: 500 }
      );
    }
    return NextResponse.json(finalData);
  } catch (err: unknown) {
    console.error("Erro no processamento da API de dados-por-estado:", err);
    const errorMessage =
      err instanceof Error ? err.message : "Falha interna no servidor.";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
