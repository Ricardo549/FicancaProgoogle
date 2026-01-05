
import { GoogleGenAI, Type } from "@google/genai";
import { Transaction, FinancialGoal } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getFinancialInsights = async (
  transactions: Transaction[], 
  goals: FinancialGoal[]
) => {
  const summary = transactions.map(t => ({
    desc: t.description,
    val: t.amount,
    cat: t.categoryId,
    type: t.type
  }));

  const prompt = `Analise os seguintes dados financeiros e forneça 3 dicas práticas de economia e uma previsão de saúde financeira para os próximos 6 meses.
  Transações: ${JSON.stringify(summary.slice(-20))}
  Metas: ${JSON.stringify(goals)}
  Responda em JSON.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            tips: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3 dicas de economia personalizadas"
            },
            forecast: {
              type: Type.STRING,
              description: "Análise preditiva de saúde financeira"
            },
            healthScore: {
              type: Type.NUMBER,
              description: "Pontuação de 0 a 100"
            }
          },
          required: ["tips", "forecast", "healthScore"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Error:", error);
    return {
      tips: ["Mantenha um fundo de reserva.", "Evite compras por impulso.", "Revise suas assinaturas mensais."],
      forecast: "Não foi possível gerar uma análise detalhada no momento.",
      healthScore: 50
    };
  }
};
