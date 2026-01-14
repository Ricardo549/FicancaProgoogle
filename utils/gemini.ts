
import { GoogleGenAI, Type } from "@google/genai";
import { Transaction, FinancialGoal, Category } from "./types";

export const getFinancialInsights = async (
  transactions: Transaction[], 
  goals: FinancialGoal[],
  categories: Category[]
) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const summary = transactions.slice(0, 30).map(t => ({
    desc: t.description,
    val: t.amount,
    cat: categories.find(c => c.id === t.categoryId)?.name || 'Geral',
    type: t.type
  }));

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Analise estes dados: Transações: ${JSON.stringify(summary)}. Metas: ${JSON.stringify(goals)}. Forneça 3 dicas práticas e uma nota de saúde (0-100).`,
      config: {
        thinkingConfig: { thinkingBudget: 2000 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            tips: { type: Type.ARRAY, items: { type: Type.STRING } },
            healthScore: { type: Type.NUMBER }
          },
          required: ["tips", "healthScore"]
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    return {
      tips: ["Mantenha sua reserva de emergência ativa.", "Evite parcelamentos longos.", "Diversifique seus aportes."],
      healthScore: 65
    };
  }
};

export const processFinancialStatement = async (text: string, categories: Category[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const cats = categories.map(c => ({ id: c.id, name: c.name, type: c.type }));
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Extraia transações deste texto: "${text}". Categorias: ${JSON.stringify(cats)}. Retorne array de objetos.`,
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
              type: { type: Type.STRING },
              categoryId: { type: Type.STRING }
            },
            required: ["description", "amount", "date", "type", "categoryId"]
          }
        }
      }
    });

    return JSON.parse(response.text || "[]");
  } catch (error) {
    throw new Error("Falha ao processar.");
  }
};
