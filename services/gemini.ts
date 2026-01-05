
import { GoogleGenAI, Type } from "@google/genai";
import { Transaction, FinancialGoal } from "../types";
import { CATEGORIES } from "../constants";

export const getFinancialInsights = async (
  transactions: Transaction[], 
  goals: FinancialGoal[]
) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const summary = transactions.map(t => ({
    desc: t.description,
    val: t.amount,
    cat: t.categoryId,
    type: t.type
  }));

  const prompt = `Analise os seguintes dados financeiros e forneça 3 dicas práticas de economia e uma previsão de saúde financeira para os próximos 6 meses.
  Transações (últimas 20): ${JSON.stringify(summary.slice(-20))}
  Metas: ${JSON.stringify(goals)}
  Responda em JSON em português do Brasil.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            tips: { type: Type.ARRAY, items: { type: Type.STRING } },
            forecast: { type: Type.STRING },
            healthScore: { type: Type.NUMBER }
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
      forecast: "IA temporariamente indisponível para análise profunda.",
      healthScore: 60
    };
  }
};

export const processFinancialStatement = async (text: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const categoriesList = CATEGORIES.map(c => ({ id: c.id, name: c.name, type: c.type }));
  
  const prompt = `Extraia as transações financeiras do seguinte texto (extrato bancário). 
  Identifique a data (YYYY-MM-DD), descrição, valor (positivo para receita, negativo para despesa) e o tipo (INCOME ou EXPENSE).
  Mapeie para o ID da categoria mais próxima desta lista: ${JSON.stringify(categoriesList)}.
  Texto: ${text}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              description: { type: Type.STRING },
              amount: { type: Type.NUMBER },
              date: { type: Type.STRING },
              type: { type: Type.STRING, enum: ["INCOME", "EXPENSE"] },
              categoryId: { type: Type.STRING }
            },
            required: ["description", "amount", "date", "type", "categoryId"]
          }
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Error:", error);
    throw new Error("Falha ao processar extrato.");
  }
};
