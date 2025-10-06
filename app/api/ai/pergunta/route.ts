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
      },
      propertyOrdering: ["resposta"],
    };

    const prompt = `
Analise a seguinte pergunta do usuário: "${question}"

**Escopo de atuação:**
Responda apenas perguntas relacionadas a **inovação, investimentos, startups, tecnologia ou indústria no Brasil**, incluindo temas ligados à **ODS 9 (Indústria, Inovação e Infraestrutura)**.

**Instrução de resposta dentro do escopo:**
Se a pergunta estiver dentro desses temas, forneça uma **resposta completa, clara e informativa**, baseada no conhecimento do modelo sobre o contexto brasileiro.

**Instrução de resposta fora do escopo:**
Se a pergunta não estiver relacionada aos temas acima, responda **exatamente** com:
"Sua pergunta está fora do meu escopo de atuação, que é focado em inovação, investimentos e o setor industrial do Brasil. Tente perguntar sobre startups, ODS 9 ou o ecossistema de tecnologia."
`;


    const data = await generateAIDataWithSchema(prompt, schema);

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