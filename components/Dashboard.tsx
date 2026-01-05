
import React, { useMemo, useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, Legend 
} from 'recharts';
import { Transaction, Account, FinancialGoal } from '../types';
import { CATEGORIES, MONTHS } from '../constants';
import { getFinancialInsights } from '../services/gemini';
import { TrendingUp, TrendingDown, DollarSign, Wallet, Star, Sparkles, BarChart3 } from 'lucide-react';

interface DashboardProps {
  transactions: Transaction[];
  goals: FinancialGoal[];
  accounts: Account[];
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

const Dashboard: React.FC<DashboardProps> = ({ transactions, goals, accounts }) => {
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  useEffect(() => {
    const fetchAi = async () => {
      if (transactions.length > 3) {
        setIsLoadingAi(true);
        const res = await getFinancialInsights(transactions, goals);
        setAiAnalysis(res);
        setIsLoadingAi(false);
      }
    };
    fetchAi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stats = useMemo(() => {
    const income = transactions.filter(t => t.type === 'INCOME').reduce((acc, t) => acc + t.amount, 0);
    const expense = transactions.filter(t => t.type === 'EXPENSE').reduce((acc, t) => acc + t.amount, 0);
    const totalBalance = accounts.reduce((acc, a) => acc + a.balance, 0);
    const balance = income - expense;
    return { income, expense, balance, totalBalance };
  }, [transactions, accounts]);

  const categoryData = useMemo(() => {
    const data: Record<string, number> = {};
    transactions.filter(t => t.type === 'EXPENSE').forEach(t => {
      const cat = CATEGORIES.find(c => c.id === t.categoryId)?.name || 'Outros';
      data[cat] = (data[cat] || 0) + t.amount;
    });
    return Object.entries(data).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  const monthlyHistory = useMemo(() => {
    const data = MONTHS.map(month => ({ month, income: 0, expense: 0 }));
    transactions.forEach(t => {
      const date = new Date(t.date);
      const monthIdx = date.getMonth();
      if (t.type === 'INCOME') data[monthIdx].income += t.amount;
      else data[monthIdx].expense += t.amount;
    });
    return data;
  }, [transactions]);

  const healthIndex = aiAnalysis?.healthScore || 75;

  return (
    <div className="space-y-6">
      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><DollarSign size={20}/></div>
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">+12%</span>
          </div>
          <p className="text-slate-500 text-sm font-medium">Receitas Mensais</p>
          <h3 className="text-2xl font-bold text-slate-800 mt-1">
            R$ {stats.income.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </h3>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-rose-50 text-rose-600 rounded-lg"><TrendingDown size={20}/></div>
            <span className="text-xs font-medium text-rose-600 bg-rose-50 px-2 py-1 rounded-full">-5%</span>
          </div>
          <p className="text-slate-500 text-sm font-medium">Despesas Mensais</p>
          <h3 className="text-2xl font-bold text-slate-800 mt-1">
            R$ {stats.expense.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </h3>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Wallet size={20}/></div>
          </div>
          <p className="text-slate-500 text-sm font-medium">Saldo em Contas</p>
          <h3 className="text-2xl font-bold text-slate-800 mt-1">
            R$ {stats.totalBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </h3>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg"><Star size={20}/></div>
          </div>
          <p className="text-slate-500 text-sm font-medium">Índice de Saúde</p>
          <div className="flex items-center gap-2 mt-1">
            <h3 className="text-2xl font-bold text-slate-800">{healthIndex}/100</h3>
            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500 transition-all duration-1000" 
                style={{ width: `${healthIndex}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-lg font-bold text-slate-800">Evolução Financeira</h4>
            <div className="flex items-center gap-4 text-xs font-semibold text-slate-500">
               <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-emerald-500 rounded-sm"></div> Receita</div>
               <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-rose-500 rounded-sm"></div> Despesa</div>
            </div>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyHistory}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => `R$ ${value.toFixed(2)}`}
                />
                <Area type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorIncome)" name="Receita" />
                <Area type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorExpense)" name="Despesa" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h4 className="text-lg font-bold text-slate-800 mb-6">Gastos por Categoria</h4>
          <div className="h-80 w-full">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    formatter={(value: number) => `R$ ${value.toFixed(2)}`}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400">
                 <p className="text-sm">Sem despesas registradas</p>
              </div>
            )}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {categoryData.slice(0, 4).map((item, idx) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[idx % COLORS.length]}} />
                <span className="text-xs text-slate-500 truncate">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly Comparison Bar Chart */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-100 text-slate-600 rounded-lg">
              <BarChart3 size={20} />
            </div>
            <div>
              <h4 className="text-lg font-bold text-slate-800">Comparativo Mensal</h4>
              <p className="text-xs text-slate-400 font-medium">Receitas vs Despesas por mês</p>
            </div>
          </div>
        </div>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyHistory} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11, fontWeight: 500}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11, fontWeight: 500}} />
              <Tooltip 
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }}
                itemStyle={{ fontSize: '12px', fontWeight: 600 }}
                formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR')}`, '']}
              />
              <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ paddingBottom: '20px', fontSize: '12px', fontWeight: 600 }} />
              <Bar dataKey="income" name="Receitas" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
              <Bar dataKey="expense" name="Despesas" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Insights & Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-indigo-900 to-indigo-950 p-6 rounded-2xl shadow-xl text-white relative overflow-hidden">
          <Sparkles className="absolute top-4 right-4 text-indigo-400 opacity-50" size={32} />
          <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
            Insights da IA Gemini
            {isLoadingAi && <span className="text-xs font-normal animate-pulse text-indigo-300">Analisando...</span>}
          </h4>
          
          <div className="space-y-4">
            {aiAnalysis ? (
              <>
                <div className="bg-indigo-800/40 p-4 rounded-xl border border-indigo-700/50">
                  <p className="text-sm italic text-indigo-100 line-clamp-3">"{aiAnalysis.forecast}"</p>
                </div>
                <div className="space-y-2">
                  {aiAnalysis.tips.map((tip: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-3 text-sm">
                      <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center text-[10px] shrink-0 font-bold">
                        {idx + 1}
                      </div>
                      <p className="text-indigo-50">{tip}</p>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-indigo-300 text-sm">Adicione mais transações para que a IA possa analisar seu perfil financeiro.</p>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h4 className="text-lg font-bold text-slate-800 mb-6">Metas Ativas</h4>
          <div className="space-y-6">
            {goals.map(goal => {
              const progress = (goal.currentAmount / goal.targetAmount) * 100;
              return (
                <div key={goal.id}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-slate-700">{goal.title}</span>
                    <span className="text-xs text-slate-500">
                      R$ {goal.currentAmount.toLocaleString()} / {goal.targetAmount.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500 rounded-full transition-all duration-1000" 
                      style={{ width: `${Math.min(100, progress)}%` }}
                    />
                  </div>
                </div>
              );
            })}
            {goals.length === 0 && <p className="text-slate-400 text-sm text-center py-4">Nenhuma meta ativa no momento.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
