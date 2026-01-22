
import { GoogleGenAI, Type } from "@google/genai";
import { Transaction, FinancialGoal, Category } from "./types";

export const getFinancialInsights = async (
  transactions: Transaction[], 
  goals: FinancialGoal[],
  categories: Category[]
) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const summary = {
    totalIncome: transactions.filter(t => t.type === 'INCOME').reduce((acc, t) => acc + t.amount, 0),
    totalExpense: transactions.filter(t => t.type === 'EXPENSE').reduce((acc, t) => acc + t.amount, 0),
    recentTransactions: transactions.slice(0, 10).map(t => ({
      d: t.description,
      v: t.amount,
      c: categories.find(c => c.id === t.categoryId)?.name
    })),
    goals: goals.map(g => ({ t: g.title, p: (g.currentAmount / g.targetAmount) * 100 }))
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Analise meu perfil financeiro: ${JSON.stringify(summary)}. 
      Gere 3 dicas estratégicas para economizar e uma nota de saúde financeira de 0 a 100 baseada no balanço mensal.`,
      config: {
        thinkingConfig: { thinkingBudget: 4000 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            tips: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Dicas personalizadas para o usuário."
            },
            healthScore: { 
              type: Type.NUMBER,
              description: "Nota de 0 a 100 da saúde financeira."
            },
            reasoning: { 
              type: Type.STRING,
              description: "Breve explicação do score."
            }
          },
          required: ["tips", "healthScore"]
        }
      }
    });

    // IMPORTANTE: No novo SDK do @google/genai, .text é uma propriedade getter, não um método.
    const textOutput = response.text || "{}";
    return JSON.parse(textOutput);
  } catch (error) {
    console.error("Gemini AI Error:", error);
    return {
      tips: [
        "Revise seus gastos fixos mensais para identificar oportunidades de corte.",
        "Tente poupar ao menos 10% da sua renda mensal para sua reserva de emergência.",
        "Mantenha seu fluxo de caixa atualizado diariamente para evitar surpresas no fim do mês."
      ],
      healthScore: 70
    };
  }
};
