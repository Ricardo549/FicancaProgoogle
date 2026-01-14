
import React, { useMemo, useState, useEffect } from 'react';
import { Transaction, Account, FinancialGoal, Category } from '../utils/types';
import { getFinancialInsights } from '../utils/gemini';
import { MONTHS } from '../constants';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, BarChart, Bar, Cell
} from 'recharts';
import { 
  TrendingUp, TrendingDown, Wallet, Star, Activity, Loader2, Target, Calendar, ArrowUpRight, BarChart3, PieChart
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
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: entry.color || entry.fill }} />
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">{entry.name}</span>
              </div>
              <span className="text-xs font-black text-slate-800 dark:text-white">
                R$ {entry.value.toLocaleString('pt-BR')}
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
    const data = MONTHS.map((month, index) => {
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
    return data;
  }, [transactions]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Header Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Entradas" value={stats.income} color="emerald" icon={<TrendingUp size={20}/>} />
        <StatCard title="Saídas" value={stats.expense} color="rose" icon={<TrendingDown size={20}/>} />
        <StatCard title="Fluxo" value={stats.balance} color="blue" icon={<Wallet size={20}/>} />
        <StatCard title="Saúde IA" value={aiAnalysis?.healthScore || '--'} color="amber" icon={<Star size={20}/>} suffix="/100" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Trends Area */}
        <div className="lg:col-span-8 space-y-8">
          {/* Predictive Analysis Card */}
          <div className="bg-white dark:bg-slate-900 p-8 lg:p-10 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group transition-all hover:shadow-xl">
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-700">
              <Activity size={180}/>
            </div>
            <div className="relative z-10 space-y-8">
              <div className="flex items-center justify-between">
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                   <Sparkles size={14} className="text-emerald-500" /> Análise Preditiva Gemini
                 </h4>
                 {isLoadingAi && <Loader2 className="animate-spin text-emerald-500" size={16}/>}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {aiAnalysis?.tips?.map((tip: string, i: number) => (
                    <div key={i} className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border dark:border-slate-700/50 text-[11px] font-bold leading-relaxed flex items-start gap-3 group/tip hover:bg-white dark:hover:bg-slate-800 transition-all">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 group-hover/tip:bg-emerald-500 group-hover/tip:text-white transition-all">
                        {i + 1}
                      </div>
                      <p className="text-slate-600 dark:text-slate-300">{tip}</p>
                    </div>
                 )) || (
                   <p className="text-xs text-slate-400 font-medium italic">Consolidando dados transacionais para gerar insights preditivos...</p>
                 )}
              </div>
            </div>
          </div>

          {/* Monthly Trend Charts */}
          <div className="bg-white dark:bg-slate-900 p-8 lg:p-10 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm space-y-10">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h4 className="text-sm font-black dark:text-white uppercase tracking-tighter">Histórico de Fluxo</h4>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Visão Geral Anual de Gastos e Receitas</p>
              </div>
              <div className="flex items-center gap-4 px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border dark:border-slate-700">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-[9px] font-black text-slate-400 uppercase">Receita</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-rose-500" />
                  <span className="text-[9px] font-black text-slate-400 uppercase">Despesa</span>
                </div>
              </div>
            </header>

            {/* Bar Chart: Income vs Expense Comparison */}
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyHistory} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} tickFormatter={(val) => `R$ ${val >= 1000 ? (val/1000).toFixed(0) + 'k' : val}`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} name="Receita" />
                  <Bar dataKey="expense" fill="#f43f5e" radius={[4, 4, 0, 0]} barSize={20} name="Despesa" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Expense Breakdown Bar Chart */}
            <div className="pt-6 border-t border-slate-50 dark:border-slate-800">
              <div className="flex items-center justify-between mb-6">
                <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                  <BarChart3 size={14} className="text-rose-500" /> Volume de Despesas Mensais
                </h5>
              </div>
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyHistory} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 9, fontWeight: 700}} />
                    <YAxis axisLine={false} tickLine={false} hide />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="expense" name="Gasto Mensal" radius={[10, 10, 10, 10]}>
                      {monthlyHistory.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.expense > 5000 ? '#f43f5e' : '#fb7185'} 
                          fillOpacity={0.8}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
        
        {/* Sidebar Info Area */}
        <div className="lg:col-span-4 space-y-8">
          {/* Budget Progress Card */}
          <div className="bg-white dark:bg-slate-900 p-8 lg:p-10 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm space-y-8">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <Target size={14} className="text-emerald-500" /> Teto de Orçamento
            </h4>
            <div className="space-y-6">
               <div className="flex justify-between items-end">
                  <span className="text-[10px] font-black text-slate-400 uppercase">Saídas do Mês</span>
                  <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">R$ {stats.expense.toLocaleString()}</span>
               </div>
               <div className="relative h-4 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ease-out shadow-lg ${stats.expense > 5000 ? 'bg-rose-500 shadow-rose-500/30' : 'bg-emerald-500 shadow-emerald-500/30'}`} 
                    style={{ width: `${Math.min(100, (stats.expense / 5000) * 100)}%` }} 
                  />
               </div>
               <div className="flex justify-between text-[8px] font-black text-slate-400 uppercase tracking-widest px-1">
                 <span>Consumido: {Math.round((stats.expense / 5000) * 100)}%</span>
                 <span>Limite: R$ 5.000</span>
               </div>
            </div>
          </div>

          {/* Mini Calendar/Info Card */}
          <div className="bg-slate-900 dark:bg-emerald-950 p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform duration-700">
               <Calendar size={120} />
            </div>
            <div className="relative z-10 space-y-4">
              <p className="text-[9px] font-black uppercase tracking-widest text-emerald-400">Próximos Passos</p>
              <h4 className="text-xl font-black leading-tight">Mantenha seu foco nos aportes mensais.</h4>
              <p className="text-xs text-slate-400 font-medium leading-relaxed">
                Você já registrou {transactions.length} transações este ano. Continue alimentando o sistema para obter análises cada vez mais precisas via Gemini Pro.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, color, icon, suffix = "" }: any) => (
  <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm group hover:-translate-y-1 transition-all duration-300">
    <div className={`w-12 h-12 rounded-2xl bg-${color}-50 dark:bg-${color}-900/20 text-${color}-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
      {icon}
    </div>
    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">{title}</p>
    <h3 className="text-2xl font-black text-slate-800 dark:text-white tracking-tighter">
      {typeof value === 'number' ? `R$ ${value.toLocaleString('pt-BR')}` : value}{suffix}
    </h3>
  </div>
);

const Sparkles = ({ size, className }: { size: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
    <path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>
  </svg>
);

export default Dashboard;
