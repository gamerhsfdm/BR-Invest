const API_KEY = process.env.API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${API_KEY}`;
const MAX_RETRIES = 5;

interface JsonObject {
  [key: string]: unknown;
}

/**
 * @param prompt
 * @param schema 
 * @returns 
 */
export const generateAIDataWithSchema = async (
  prompt: string,
  schema: object
): Promise<JsonObject | null> => {
  const payload = {
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: schema,
    },
  };

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        if (response.status === 429 && attempt < MAX_RETRIES - 1) {
          const delay = Math.pow(2, attempt) * 1000 + Math.random() * 1000;
          console.warn(
            `Tentativa ${attempt + 1} falhou com status ${
              response.status
            }. Retentando em ${delay / 1000}s...`
          );
          await new Promise((res) => setTimeout(res, delay));
          continue;
        } else {
          const errorText = await response.text();
          throw new Error(
            `Erro na API da IA: ${response.statusText} - ${errorText}`
          );
        }
      }

      const result = await response.json();
      const jsonData = result?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!jsonData) {
        console.error("Resposta da IA não contém dados JSON válidos.");
        return null;
      }

      return JSON.parse(jsonData);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro desconhecido";
      console.error(`Erro na requisição para a IA: ${errorMessage}`);
      if (attempt === MAX_RETRIES - 1) {
        return null;
      }
    }
  }

  return null;
};
