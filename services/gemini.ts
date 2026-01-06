
import { GoogleGenAI, Type } from "@google/genai";
import { Transaction, FinancialGoal, Category } from "../types";

export const getFinancialInsights = async (
  transactions: Transaction[], 
  goals: FinancialGoal[],
  categories: Category[]
) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const summary = transactions.map(t => ({
    desc: t.description,
    val: t.amount,
    cat: categories.find(c => c.id === t.categoryId)?.name || 'Outros',
    type: t.type,
    date: t.date
  }));

  const prompt = `Você é um consultor financeiro sênior especializado em Wealth Management. 
  Analise os seguintes dados do cliente e forneça 3 insights estratégicos de economia, 
  uma análise de risco e uma projeção de saúde financeira.
  
  DADOS DO CLIENTE:
  Transações recentes: ${JSON.stringify(summary.slice(0, 30))}
  Metas vigentes: ${JSON.stringify(goals)}
  
  Responda estritamente no formato JSON em português do Brasil.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 4000 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            tips: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "3 dicas práticas e acionáveis"
            },
            forecast: { 
              type: Type.STRING,
              description: "Análise narrativa do futuro financeiro"
            },
            healthScore: { 
              type: Type.NUMBER,
              description: "Pontuação de 0 a 100 da saúde financeira"
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
      tips: [
        "Mantenha uma reserva de emergência equivalente a 6 meses de custo fixo.",
        "Automatize seus aportes em investimentos logo após o recebimento do salário.",
        "Revise taxas bancárias e assinaturas digitais que não são utilizadas."
      ],
      forecast: "Sua trajetória atual sugere estabilidade, mas há espaço para otimização em gastos variáveis.",
      healthScore: 65
    };
  }
};

export const processFinancialStatement = async (text: string, categories: Category[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const categoriesList = categories.map(c => ({ id: c.id, name: c.name, type: c.type }));
  
  const prompt = `Extraia transações de extrato bancário. Ignore saldos e textos informativos.
  Retorne apenas as movimentações financeiras.
  Categorias permitidas: ${JSON.stringify(categoriesList)}.
  
  Texto do extrato:
  ${text}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 2000 },
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
              categoryId: { type: Type.STRING },
              notes: { type: Type.STRING }
            },
            required: ["description", "amount", "date", "type", "categoryId"]
          }
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Error:", error);
    throw new Error("Erro na extração de dados via IA.");
  }
};
