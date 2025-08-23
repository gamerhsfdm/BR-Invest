import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.API_KEY as string);

export async function POST(req: NextRequest) {
  try {
    const { startups, industria, investimento } = await req.json();

    if (!startups && !industria && !investimento) {
      return NextResponse.json(
        { error: "Dados para o resumo são obrigatórios." },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `Gere um resumo detalhado e inteligente sobre o cenário de startups no Brasil, considerando os seguintes dados:
      
      Evolução de Startups por Ano: ${JSON.stringify(startups)}
      Crescimento da Indústria: ${JSON.stringify(industria)}
      Investimento por Estado (Público e Privado): ${JSON.stringify(
        investimento
      )}
      
      Analise a tendência de crescimento, os principais estados que recebem investimentos e a participação dos setores público e privado. O resumo deve ser em português, bem estruturado, e destacar as informações mais relevantes.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const resumo = response.text();

    return NextResponse.json({ resumo });
  } catch (error) {
    console.error("Erro na rota resumointeligente:", error);
    return NextResponse.json(
      { error: "Erro interno no servidor." },
      { status: 500 }
    );
  }
}
