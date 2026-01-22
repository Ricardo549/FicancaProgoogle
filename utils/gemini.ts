
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
            tips: { type: Type.ARRAY, items: { type: Type.STRING } },
            healthScore: { type: Type.NUMBER },
            reasoning: { type: Type.STRING }
          },
          required: ["tips", "healthScore"]
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Gemini AI Error:", error);
    return {
      tips: ["Revise seus gastos fixos mensais.", "Tente poupar ao menos 10% da sua renda.", "Mantenha sua planilha atualizada diariamente."],
      healthScore: 70
    };
  }
};
