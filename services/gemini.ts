
import { GoogleGenAI, Type } from "@google/genai";
import { Transaction, FinancialGoal, Category } from "../types";
import { CATEGORIES } from "../constants";

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

export const processFinancialStatement = async (text: string) => {
  const categoriesList = CATEGORIES.map(c => ({ id: c.id, name: c.name, type: c.type }));
  
  const prompt = `Extraia as transações financeiras do seguinte texto (extrato bancário ou fatura). 
  Identifique a data, descrição, valor (positivo para receita, negativo ou explícito para despesa) e o tipo (INCOME ou EXPENSE).
  Mapeie cada transação para o ID da categoria mais provável desta lista: ${JSON.stringify(categoriesList)}.
  
  Texto do extrato:
  """
  ${text}
  """
  
  Retorne um array de objetos JSON.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
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
              date: { type: Type.STRING, description: "Formato YYYY-MM-DD" },
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
    console.error("Gemini Statement Error:", error);
    throw new Error("Não foi possível processar o extrato. Verifique o formato do texto.");
  }
};
