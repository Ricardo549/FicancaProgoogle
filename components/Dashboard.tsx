
import React, { useMemo, useState, useEffect } from 'react';
import { Transaction, Account, FinancialGoal, Category } from '../utils/types';
import { getFinancialInsights } from '../utils/gemini';
import { MONTHS } from '../constants';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Cell, PieChart, Pie, Legend
} from 'recharts';
import { 
  TrendingUp, TrendingDown, Wallet, Star, Activity, Loader2, Target, BarChart3, PieChart as PieIcon, Sparkles, Filter
} from 'lucide-react';

interface DashboardProps {
  transactions: Transaction[];
  goals: FinancialGoal[];
  accounts: Account[];
  categories: Category[];
  userPlan?: string;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 animate-in fade-in zoom-in duration-200">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 border-b border-slate-50 dark:border-slate-800 pb-2">{label}</p>
        <div className="space-y-1.5">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color || entry.fill }} />
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">{entry.name}</span>
              </div>
              <span className="text-xs font-black text-slate-800 dark:text-white">
                R$ {entry.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

const Dashboard: React.FC<DashboardProps> = ({ transactions, goals, accounts, categories }) => {
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [activeChartTab, setActiveChartTab] = useState<'area' | 'bar'>('area');

  useEffect(() => {
    const fetchAi = async () => {
      if (transactions.length >= 3) {
        setIsLoadingAi(true);
        const res = await getFinancialInsights(transactions, goals, categories);
        setAiAnalysis(res);
        setIsLoadingAi(false);
      }
    };
    fetchAi();
  }, [transactions]);

  const stats = useMemo(() => {
    const income = transactions.filter(t => t.type === 'INCOME').reduce((acc, t) => acc + t.amount, 0);
    const expense = transactions.filter(t => t.type === 'EXPENSE').reduce((acc, t) => acc + t.amount, 0);
    const balance = income - expense;
    return { income, expense, balance };
  }, [transactions]);

  const monthlyHistory = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return MONTHS.map((month, index) => {
      const filtered = transactions.filter(t => {
        const d = new Date(t.date);
        return d.getMonth() === index && d.getFullYear() === currentYear;
      });

      const income = filtered.filter(t => t.type === 'INCOME').reduce((acc, t) => acc + t.amount, 0);
      const expense = filtered.filter(t => t.type === 'EXPENSE').reduce((acc, t) => acc + t.amount, 0);

      return {
        month,
        income,
        expense,
        balance: income - expense
      };
    });
  }, [transactions]);

  const categoryBreakdown = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'EXPENSE');
    const totals: Record<string, number> = {};
    
    expenses.forEach(t => {
      totals[t.categoryId] = (totals[t.categoryId] || 0) + t.amount;
    });

    return Object.entries(totals).map(([catId, amount]) => {
      const category = categories.find(c => c.id === catId);
      return {
        name: category?.name || 'Outros',
        value: amount,
        color: category?.color || '#94a3b8'
      };
    }).sort((a, b) => b.value - a.value);
  }, [transactions, categories]);

  const pieData = useMemo(() => categoryBreakdown.slice(0, 5), [categoryBreakdown]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Indicadores Principais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Receitas" value={stats.income} color="emerald" icon={<TrendingUp size={20}/>} />
        <StatCard title="Total Despesas" value={stats.expense} color="rose" icon={<TrendingDown size={20}/>} />
        <StatCard title="Saldo Consolidado" value={stats.balance} color="blue" icon={<Wallet size={20}/>} />
        <StatCard title="Score Financeiro" value={aiAnalysis?.healthScore || '--'} color="amber" icon={<Star size={20}/>} suffix="/100" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Gráfico de Evolução e Detalhamento */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white dark:bg-slate-900 p-8 lg:p-10 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm space-y-8">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              <div>
                <h4 className="text-sm font-black dark:text-white uppercase tracking-tighter">Análise de Fluxo</h4>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Visão temporal e por categoria</p>
              </div>
              <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                <button 
                  onClick={() => setActiveChartTab('area')}
                  className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${activeChartTab === 'area' ? 'bg-white dark:bg-slate-700 text-emerald-600 shadow-sm' : 'text-slate-400'}`}
                >
                  Evolução
                </button>
                <button 
                  onClick={() => setActiveChartTab('bar')}
                  className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${activeChartTab === 'bar' ? 'bg-white dark:bg-slate-700 text-rose-600 shadow-sm' : 'text-slate-400'}`}
                >
                  Categorias
                </button>
              </div>
            </header>

            <div className="h-[350px] w-full">
              {activeChartTab === 'area' ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} tickFormatter={(val) => `R$ ${val >= 1000 ? (val/1000).toFixed(0) + 'k' : val}`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="income" name="Receitas" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorIncome)" />
                    <Area type="monotone" dataKey="expense" name="Despesas" stroke="#f43f5e" strokeWidth={4} fillOpacity={1} fill="url(#colorExpense)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryBreakdown.slice(0, 10)} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 9, fontWeight: 800}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                    <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(0,0,0,0.02)'}} />
                    <Bar dataKey="value" name="Gasto Total" radius={[8, 8, 0, 0]} barSize={32}>
                      {categoryBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Insights IA */}
          <div className="bg-slate-900 rounded-[2.5rem] p-8 lg:p-10 text-white relative overflow-hidden group border border-white/5">
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
              <Sparkles size={180}/>
            </div>
            <div className="relative z-10 space-y-8">
              <div className="flex items-center justify-between">
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-400 flex items-center gap-2">
                   <Activity size={14} /> Gemini 3 Pro AI Engine
                 </h4>
                 {isLoadingAi && <Loader2 className="animate-spin text-emerald-500" size={16}/>}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {aiAnalysis?.tips?.map((tip: string, i: number) => (
                    <div key={i} className="p-6 bg-white/5 rounded-3xl border border-white/10 text-[11px] font-medium leading-relaxed hover:bg-white/10 transition-all group/tip">
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-4 group-hover/tip:scale-110 transition-transform">
                        {i + 1}
                      </div>
                      {tip}
                    </div>
                 )) || (
                   <div className="col-span-full py-10 flex flex-col items-center gap-4 text-slate-500 italic text-sm">
                     <Loader2 className="animate-spin" />
                     Analisando comportamento financeiro...
                   </div>
                 )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Distribuição e Metas */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm space-y-8">
            <header>
              <h4 className="text-sm font-black dark:text-white uppercase tracking-widest flex items-center gap-2">
                <PieIcon size={18} className="text-blue-500" /> Distribuição de Gastos
              </h4>
              <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">Top 5 categorias críticas</p>
            </header>

            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-50 dark:border-slate-800">
              {pieData.map((cat, i) => (
                <div key={i} className="flex justify-between items-center group cursor-default">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full shadow-sm" style={{backgroundColor: cat.color}} />
                    <span className="text-[10px] font-black uppercase text-slate-500 group-hover:text-slate-800 dark:group-hover:text-white transition-colors">{cat.name}</span>
                  </div>
                  <span className="text-xs font-black dark:text-white">R$ {cat.value.toLocaleString('pt-BR')}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm space-y-8">
            <h4 className="text-sm font-black dark:text-white uppercase tracking-widest flex items-center gap-2">
              <Target size={18} className="text-indigo-500" /> Metas em Foco
            </h4>
            <div className="space-y-6">
              {goals.slice(0, 3).map(goal => (
                <div key={goal.id} className="space-y-3 group">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black text-slate-700 dark:text-white group-hover:text-emerald-600 transition-colors">{goal.title}</span>
                    <span className="text-[10px] font-black text-emerald-500">{Math.round((goal.currentAmount / goal.targetAmount) * 100)}%</span>
                  </div>
                  <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
                    <div 
                      className="h-full bg-emerald-500 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(16,185,129,0.2)]" 
                      style={{ width: `${Math.min(100, (goal.currentAmount / goal.targetAmount) * 100)}%` }} 
                    />
                  </div>
                </div>
              ))}
              {goals.length === 0 && (
                <p className="text-[10px] font-medium text-slate-400 italic text-center py-4">Nenhuma meta ativa definida.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, color, icon, suffix = "" }: any) => (
  <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm group hover:-translate-y-2 hover:shadow-xl transition-all duration-500">
    <div className={`w-14 h-14 rounded-2xl bg-${color}-500/10 text-${color}-600 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-${color}-500 group-hover:text-white transition-all duration-500 shadow-sm`}>
      {icon}
    </div>
    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">{title}</p>
    <h3 className="text-3xl font-black text-slate-800 dark:text-white tracking-tighter">
      {typeof value === 'number' ? `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : value}{suffix}
    </h3>
  </div>
);

export default Dashboard;
