import { NextResponse } from "next/server";
import { generateAIDataWithSchema } from "../../../../lib/ai";

export async function GET() {
const prompt = `
Utilize apenas dados reais e fontes públicas sobre investimentos em startups no Brasil.

Regras:
1. Considere apenas os 5 estados que mais concentram investimentos.
2. Para cada estado, utilize a sigla oficial (ex: SP, RJ, MG).
3. A resposta deve ser exclusivamente em formato JSON válido.
4. Cada estado deve ter duas chaves internas:
   - "publico": valor numérico em milhões (recursos governamentais, programas de fomento, editais etc.).
   - "privado": valor numérico em milhões (venture capital, fundos, investidores anjo etc.).
5. Caso não exista dado separado entre público e privado para algum estado, utilize null no campo que faltar.
6. Não inclua explicações, apenas o objeto JSON final.

Exemplo de formato esperado:
{
  "SP": { "publico": null, "privado": 5000 },
  "RJ": { "publico": 300, "privado": 1200 },
  ...
}
`;

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
      return NextResponse.json(
        { error: "Dados de investimento indisponíveis ou inválidos." },
        { status: 500 }
      );
    }

    const investimentoPorEstado = Object.entries(
      rawData.investimento_por_estado
    ).map(([state, investment_million_brl]) => ({
      state,
      investment_million_brl,
    }));

    return NextResponse.json({ investimentoPorEstado });
  } catch (err: unknown) {
    console.error("Erro no processamento da API de investimento:", err);
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
