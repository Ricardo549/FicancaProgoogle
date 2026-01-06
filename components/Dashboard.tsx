
import React, { useMemo, useState, useEffect } from 'react';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, BarChart, Bar, Legend
} from 'recharts';
import { Transaction, Account, FinancialGoal, Category } from '../types';
import { MONTHS } from '../constants';
import { getFinancialInsights } from '../services/gemini';
import { 
  TrendingUp, TrendingDown, DollarSign, Wallet, Star, Sparkles, 
  Activity, Loader2, BarChart3, ExternalLink, Info, Target, Edit3
} from 'lucide-react';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

interface DashboardProps {
  transactions: Transaction[];
  goals: FinancialGoal[];
  accounts: Account[];
  categories: Category[];
  userPlan?: 'free' | 'pro';
}

const Dashboard: React.FC<DashboardProps> = ({ transactions, goals, accounts, categories, userPlan = 'free' }) => {
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [budget, setBudget] = useState(() => {
    const saved = localStorage.getItem('fpro_budget');
    return saved ? parseFloat(saved) : 3000;
  });

  useEffect(() => {
    localStorage.setItem('fpro_budget', budget.toString());
  }, [budget]);

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
  }, [transactions, goals, categories]);

  const currentMonthExpenses = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    return transactions
      .filter(t => {
        const d = new Date(t.date);
        return t.type === 'EXPENSE' && d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      })
      .reduce((acc, t) => acc + t.amount, 0);
  }, [transactions]);

  const budgetProgress = Math.min(100, (currentMonthExpenses / budget) * 100);
  const remainingBudget = Math.max(0, budget - currentMonthExpenses);
  const isOverBudget = currentMonthExpenses > budget;

  const stats = useMemo(() => {
    const income = transactions.filter(t => t.type === 'INCOME').reduce((acc, t) => acc + t.amount, 0);
    const expense = transactions.filter(t => t.type === 'EXPENSE').reduce((acc, t) => acc + t.amount, 0);
    const totalBalance = accounts.reduce((acc, a) => acc + a.balance, 0);
    return { income, expense, balance: income - expense, totalBalance };
  }, [transactions, accounts]);

  const monthlyHistory = useMemo(() => {
    const data = MONTHS.map(month => ({ month, income: 0, expense: 0 }));
    transactions.forEach(t => {
      const date = new Date(t.date);
      const monthIdx = date.getMonth();
      if (monthIdx >= 0 && monthIdx < 12) {
        if (t.type === 'INCOME') data[monthIdx].income += t.amount;
        else data[monthIdx].expense += t.amount;
      }
    });
    return data;
  }, [transactions]);

  const categoryData = useMemo(() => {
    const data: Record<string, number> = {};
    transactions.filter(t => t.type === 'EXPENSE').forEach(t => {
      const cat = categories.find(c => c.id === t.categoryId)?.name || 'Outros';
      data[cat] = (data[cat] || 0) + t.amount;
    });
    return Object.entries(data).map(([name, value]) => ({ name, value }));
  }, [transactions, categories]);

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-24 lg:pb-0">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Receitas" value={stats.income} icon={<DollarSign/>} color="emerald" />
        <StatCard title="Despesas" value={stats.expense} icon={<TrendingDown/>} color="rose" />
        <StatCard title="Saldo Contas" value={stats.totalBalance} icon={<Wallet/>} color="blue" />
        <StatCard title="Score IA" value={aiAnalysis?.healthScore || 0} icon={<Star/>} color="amber" isScore />
      </div>

      {/* Seção de Orçamento Mensal */}
      <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 relative z-10">
          <div className="flex items-center gap-4">
            <div className={`p-4 rounded-2xl shadow-lg transition-colors ${isOverBudget ? 'bg-rose-500 text-white' : 'bg-emerald-600 text-white'}`}>
              <Target size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">Monitor de Orçamento</h3>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Limite Mensal de Despesas</p>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            {isEditingBudget ? (
              <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700 animate-in zoom-in duration-200">
                <input 
                  autoFocus
                  type="number" 
                  value={budget} 
                  onChange={(e) => setBudget(parseFloat(e.target.value) || 0)}
                  className="bg-transparent border-none outline-none font-black text-slate-700 dark:text-white px-4 py-2 w-32"
                />
                <button 
                  onClick={() => setIsEditingBudget(false)}
                  className="bg-slate-900 dark:bg-emerald-600 text-white p-2 rounded-xl"
                >
                  Ok
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Definido</p>
                  <p className="font-black text-slate-800 dark:text-white">R$ {budget.toLocaleString('pt-BR')}</p>
                </div>
                <button 
                  onClick={() => setIsEditingBudget(true)}
                  className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-emerald-500 rounded-xl transition-all"
                >
                  <Edit3 size={18} />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6 relative z-10">
          <div className="flex justify-between items-end">
            <div className="space-y-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Utilizado este mês</p>
              <h4 className={`text-3xl font-black tracking-tighter ${isOverBudget ? 'text-rose-500' : 'text-emerald-600'}`}>
                R$ {currentMonthExpenses.toLocaleString('pt-BR')}
              </h4>
            </div>
            <div className="text-right space-y-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Disponível</p>
              <h4 className="text-xl font-black text-slate-800 dark:text-white tracking-tighter">
                R$ {remainingBudget.toLocaleString('pt-BR')}
              </h4>
            </div>
          </div>

          <div className="h-6 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-100 dark:border-slate-700 p-1">
            <div 
              className={`h-full rounded-full transition-all duration-1000 shadow-lg ${
                budgetProgress > 90 ? 'bg-rose-500' : budgetProgress > 70 ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${budgetProgress}%` }}
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-2">
            <div className="flex items-center gap-3">
              <div className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                isOverBudget ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'
              }`}>
                {isOverBudget ? 'Limite Excedido' : budgetProgress > 80 ? 'Atenção ao Limite' : 'Gastos sob Controle'}
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {budgetProgress.toFixed(1)}% do total
              </p>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-medium text-slate-400">
              <Info size={12} /> Sugestão IA: {aiAnalysis?.tips?.[0] || 'Acompanhe seus gastos para manter a saúde financeira.'}
            </div>
          </div>
        </div>

        {/* Efeito Visual de Fundo */}
        <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:scale-110 transition-transform pointer-events-none">
          <Target size={240} />
        </div>
      </div>

      {/* Ad Slot for Free Users - Top */}
      {userPlan === 'free' && (
        <div className="w-full p-4 bg-slate-100 dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 rounded-[2rem] flex flex-col items-center justify-center gap-2">
           <span className="text-[8px] font-black uppercase text-slate-400 tracking-widest">Publicidade Google AdSense</span>
           <div className="w-full h-24 bg-slate-200 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 font-bold text-[10px]">Espaço Reservado para Banner</div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
          <h4 className="text-sm font-black dark:text-white uppercase tracking-widest mb-8 flex items-center gap-2">
            <Activity size={18} className="text-emerald-500" /> Fluxo de Caixa
          </h4>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyHistory}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontWeight: 'bold' }}
                />
                <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={4} dot={false} />
                <Line type="monotone" dataKey="expense" stroke="#f43f5e" strokeWidth={4} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
          <h4 className="text-sm font-black dark:text-white uppercase tracking-widest mb-8 text-center">Distribuição</h4>
          <div className="h-[300px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {categoryData.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: any) => `R$ ${value.toLocaleString('pt-BR')}`}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <p className="text-[10px] font-black text-slate-400 uppercase text-center">Gastos por<br/>Categoria</p>
            </div>
          </div>
        </div>
      </div>

      {/* BarChart - Volume de Despesas Mensais */}
      <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <h4 className="text-sm font-black dark:text-white uppercase tracking-widest flex items-center gap-2">
            <BarChart3 size={18} className="text-rose-500" /> Volume de Despesas Mensais
          </h4>
          <div className="flex items-center gap-2 px-4 py-1.5 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-full text-[10px] font-black uppercase tracking-widest">
            Análise Histórica
          </div>
        </div>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyHistory}>
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.4}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} tickFormatter={(val) => `R$ ${val >= 1000 ? (val/1000).toFixed(0) + 'k' : val}`} />
              <Tooltip 
                cursor={{ fill: 'rgba(244, 63, 94, 0.05)' }}
                contentStyle={{ borderRadius: '1.25rem', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '16px' }}
                itemStyle={{ fontSize: '12px', fontWeight: '900' }}
                formatter={(value: any) => [`R$ ${value.toLocaleString('pt-BR')}`, 'Gasto']}
              />
              <Bar dataKey="expense" fill="url(#barGradient)" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-6 flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800">
           <Info className="text-slate-400" size={16}/>
           <p className="text-[10px] font-medium text-slate-500 leading-relaxed uppercase tracking-wide">Este gráfico exibe o total bruto de despesas por mês, ignorando investimentos e receitas para foco em controle de saídas.</p>
        </div>
      </div>

      {/* Ad Slot for Free Users - Bottom */}
      {userPlan === 'free' && (
        <div className="p-8 bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/30 rounded-[2.5rem] flex flex-col items-center gap-4 text-center">
            <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Patrocinado</div>
            <div className="w-full h-32 bg-white dark:bg-slate-800 rounded-2xl border border-indigo-100 dark:border-indigo-900/20 flex items-center justify-center font-black text-slate-300">
              Anúncio Dinâmico AdSense
            </div>
            <button className="flex items-center gap-2 text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:underline">
              Remover anúncios com Upgrade Pro <ExternalLink size={12}/>
            </button>
        </div>
      )}

      <section className="bg-indigo-600 rounded-[2.5rem] p-8 lg:p-12 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-10"><Sparkles size={120}/></div>
        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8">
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-xl"><Sparkles size={20}/></div>
              <h3 className="text-xl font-black uppercase tracking-widest">Insights Estratégicos</h3>
            </div>
            {isLoadingAi ? (
              <div className="flex items-center gap-2 text-indigo-200"><Loader2 className="animate-spin" size={16}/> Consultando analista digital...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {aiAnalysis?.tips?.map((tip: string, i: number) => (
                  <div key={i} className="bg-white/10 p-5 rounded-2xl border border-white/10 text-sm font-medium leading-relaxed">
                    <span className="text-amber-400 font-black mr-2">#{i+1}</span> {tip}
                  </div>
                ))}
              </div>
            )}
            <p className="text-xs text-indigo-200 font-medium italic pt-4">"{aiAnalysis?.forecast || 'Analisando seu padrão de consumo para gerar projeções precisas.'}"</p>
          </div>
        </div>
      </section>
    </div>
  );
};

const StatCard = ({ title, value, icon, color, isScore }: any) => (
  <div className="bg-white dark:bg-slate-900 p-6 rounded-[1.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
    <div className="flex items-center gap-4">
      <div className={`p-3 bg-${color}-50 dark:bg-${color}-900/20 text-${color}-600 dark:text-${color}-400 rounded-2xl`}>{icon}</div>
      <div>
        <p className="text-slate-400 dark:text-slate-500 text-[9px] font-black uppercase tracking-widest">{title}</p>
        <h3 className="text-lg font-black dark:text-white mt-0.5">
          {isScore ? `${value}/100` : `R$ ${value.toLocaleString('pt-BR')}`}
        </h3>
      </div>
    </div>
  </div>
);

export default Dashboard;
