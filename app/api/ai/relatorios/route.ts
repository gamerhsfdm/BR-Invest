import { NextResponse } from "next/server";

export async function GET() {
  try {
    const prompt = `Gere dados de startups, indústria e investimentos no Brasil para um relatório. A resposta deve ser um único objeto JSON contendo as chaves 'startupsPorAno' (array de objetos com 'year' e 'count'), 'investimentoPorEstado' (array de objetos com 'state', 'public' e 'private'), e 'crescimentoIndustria' (array de objetos com 'year' e 'value_percent'). As chaves devem seguir esse padrão: 'startupsPorAno', 'investimentoPorEstado', 'crescimentoIndustria'.`;

    const chatHistory = [];
    chatHistory.push({ role: "user", parts: [{ text: prompt }] });

    const payload = {
      contents: chatHistory,
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
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
        },
      },
    };

    const apiKey = process.env.API_KEY;
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

    let response;
    let retries = 0;
    const maxRetries = 5;

    while (retries < maxRetries) {
      try {
        response = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (response.status === 429) {
          const delay = Math.pow(2, retries) * 1000 + Math.random() * 1000;
          console.warn(`API rate limit exceeded. Retrying in ${delay}ms...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
          retries++;
          continue;
        }

        if (!response.ok) {
          throw new Error(
            `API call failed with status: ${response.statusText}`
          );
        }
        break; 
      } catch (err) {
        if (retries === maxRetries - 1) throw err; 
        retries++;
      }
    }

    const result = await response.json();
    const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      console.error("Dados de resposta da IA inválidos.");
      return NextResponse.json(
        { error: "Dados indisponíveis ou inválidos da IA." },
        { status: 500 }
      );
    }

    const data = JSON.parse(text);
    
    return NextResponse.json({
      startupsPorAno: data.startupsPorAno || [],
      investimentoPorEstado: data.investimentoPorEstado || [],
      crescimentoIndustria: data.crescimentoIndustria || [],
    });
  } catch (err: any) {
    console.error("Erro no processamento da API de relatórios:", err);
    return NextResponse.json(
      { error: "Falha interna no servidor. Verifique a API da IA." },
      { status: 500 }
    );
  }
}
