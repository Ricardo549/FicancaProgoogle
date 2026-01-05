
import React, { useMemo, useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area, Legend, LineChart, Line
} from 'recharts';
import { Transaction, Account, FinancialGoal } from '../types';
import { CATEGORIES, MONTHS } from '../constants';
import { getFinancialInsights } from '../services/gemini';
import { 
  TrendingUp, TrendingDown, DollarSign, Wallet, Star, Sparkles, 
  BarChart3, ArrowDownCircle, Activity, LayoutPanelLeft
} from 'lucide-react';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

interface DashboardProps {
  transactions: Transaction[];
  goals: FinancialGoal[];
  accounts: Account[];
}

const CustomTrendTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const income = payload.find((p: any) => p.dataKey === 'income')?.value || 0;
    const expense = payload.find((p: any) => p.dataKey === 'expense')?.value || 0;
    const net = income - expense;
    const savingRate = income > 0 ? (net / income) * 100 : 0;

    return (
      <div className="bg-white p-5 rounded-[1.5rem] shadow-2xl border border-slate-100 min-w-[220px] animate-in fade-in zoom-in duration-200">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 border-b border-slate-50 pb-2">{label}</p>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-[11px] font-bold text-slate-500">Receitas</span>
            <span className="text-sm font-black text-emerald-600">R$ {income.toLocaleString('pt-BR')}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[11px] font-bold text-slate-500">Despesas</span>
            <span className="text-sm font-black text-rose-600">R$ {expense.toLocaleString('pt-BR')}</span>
          </div>
          <div className="pt-2 mt-2 border-t border-slate-50 flex justify-between items-center">
            <span className="text-[11px] font-black text-slate-800 uppercase">Saldo</span>
            <span className={`text-sm font-black ${net >= 0 ? 'text-blue-600' : 'text-rose-600'}`}>
              R$ {net.toLocaleString('pt-BR')}
            </span>
          </div>
          {income > 0 && (
            <div className="text-[9px] font-black text-slate-400 uppercase mt-1">
              Taxa de Poupança: <span className="text-emerald-500">{savingRate.toFixed(1)}%</span>
            </div>
          )}
        </div>
      </div>
    );
  }
  return null;
};

const Dashboard: React.FC<DashboardProps> = ({ transactions, goals, accounts }) => {
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  useEffect(() => {
    const fetchAi = async () => {
      if (transactions.length >= 3) {
        setIsLoadingAi(true);
        const res = await getFinancialInsights(transactions, goals);
        setAiAnalysis(res);
        setIsLoadingAi(false);
      }
    };
    fetchAi();
  }, [transactions, goals]);

  const stats = useMemo(() => {
    const income = transactions.filter(t => t.type === 'INCOME').reduce((acc, t) => acc + t.amount, 0);
    const expense = transactions.filter(t => t.type === 'EXPENSE').reduce((acc, t) => acc + t.amount, 0);
    const totalBalance = accounts.reduce((acc, a) => acc + a.balance, 0);
    return { income, expense, balance: income - expense, totalBalance };
  }, [transactions, accounts]);

  const monthlyHistory = useMemo(() => {
    const data = MONTHS.map(month => ({ month, income: 0, expense: 0, net: 0 }));
    transactions.forEach(t => {
      const date = new Date(t.date);
      const monthIdx = date.getMonth();
      if (monthIdx >= 0 && monthIdx < 12) {
        if (t.type === 'INCOME') data[monthIdx].income += t.amount;
        else data[monthIdx].expense += t.amount;
        data[monthIdx].net = data[monthIdx].income - data[monthIdx].expense;
      }
    });
    return data;
  }, [transactions]);

  const categoryData = useMemo(() => {
    const data: Record<string, number> = {};
    transactions.filter(t => t.type === 'EXPENSE').forEach(t => {
      const cat = CATEGORIES.find(c => c.id === t.categoryId)?.name || 'Outros';
      data[cat] = (data[cat] || 0) + t.amount;
    });
    return Object.entries(data).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Receitas Totais" value={stats.income} icon={<DollarSign/>} color="emerald" />
        <StatCard title="Despesas Totais" value={stats.expense} icon={<TrendingDown/>} color="rose" />
        <StatCard title="Saldo em Contas" value={stats.totalBalance} icon={<Wallet/>} color="blue" />
        <StatCard title="Saúde Financeira" value={aiAnalysis?.healthScore || 0} icon={<Star/>} color="amber" isScore />
      </div>

      {/* Seção Principal: Tendência e Fluxo de Caixa */}
      <div className="bg-white p-8 lg:p-10 rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden relative">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-slate-900 text-white rounded-2xl shadow-xl shadow-slate-200">
              <LayoutPanelLeft size={24} />
            </div>
            <div>
              <h4 className="text-xl font-black text-slate-800 tracking-tight">Tendências de Fluxo de Caixa</h4>
              <p className="text-sm text-slate-400 font-medium tracking-tight">Análise comparativa de performance financeira mensal</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Receitas</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Despesas</span>
            </div>
          </div>
        </div>

        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyHistory} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="month" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}} 
                dy={15}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}} 
                tickFormatter={(val) => val >= 1000 ? `R$ ${(val/1000).toFixed(0)}k` : `R$ ${val}`}
              />
              <Tooltip content={<CustomTrendTooltip />} />
              <Line 
                type="monotone" 
                dataKey="income" 
                stroke="#10b981" 
                strokeWidth={4} 
                dot={{ r: 6, fill: '#10b981', strokeWidth: 3, stroke: '#fff' }} 
                activeDot={{ r: 8, strokeWidth: 0 }}
                animationDuration={1500}
              />
              <Line 
                type="monotone" 
                dataKey="expense" 
                stroke="#f43f5e" 
                strokeWidth={4} 
                dot={{ r: 6, fill: '#f43f5e', strokeWidth: 3, stroke: '#fff' }} 
                activeDot={{ r: 8, strokeWidth: 0 }}
                animationDuration={1500}
              />
              <Line 
                type="monotone" 
                dataKey="net" 
                stroke="#3b82f6" 
                strokeWidth={2} 
                strokeDasharray="5 5"
                dot={false}
                name="Saldo"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm">
          <h4 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2"><Activity size={20} className="text-emerald-500" /> Evolução de Saldo Acumulado</h4>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyHistory}>
                <defs>
                  <linearGradient id="colorInc" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/><stop offset="95%" stopColor="#10b981" stopOpacity={0}/></linearGradient>
                  <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/><stop offset="95%" stopColor="#ef4444" stopOpacity={0}/></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                <Area type="monotone" dataKey="income" stroke="#10b981" fillOpacity={1} fill="url(#colorInc)" name="Receita" />
                <Area type="monotone" dataKey="expense" stroke="#ef4444" fillOpacity={1} fill="url(#colorExp)" name="Despesa" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm">
          <h4 className="text-lg font-bold text-slate-800 mb-6">Gastos por Categoria</h4>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {categoryData.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm">
          <h4 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2"><ArrowDownCircle size={20} className="text-rose-500" /> Histórico de Despesas</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyHistory}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="expense" fill="#f43f5e" radius={[6, 6, 0, 0]} name="Despesas" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-indigo-900 p-8 rounded-[2.5rem] shadow-xl text-white relative overflow-hidden">
          <Sparkles className="absolute top-4 right-4 text-indigo-400 opacity-40" size={32} />
          <h4 className="text-xl font-bold mb-6 flex items-center gap-2">Insights Finanzo AI {isLoadingAi && <div className="w-2 h-2 bg-emerald-400 rounded-full animate-ping"/>}</h4>
          <div className="space-y-4">
            {aiAnalysis ? (
              <>
                <p className="text-indigo-100 italic text-sm">"{aiAnalysis.forecast}"</p>
                <div className="grid grid-cols-1 gap-3">
                  {aiAnalysis.tips.map((tip: string, i: number) => (
                    <div key={i} className="flex items-start gap-3 bg-white/10 p-3 rounded-xl">
                      <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0">{i+1}</div>
                      <p className="text-xs">{tip}</p>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-indigo-300 text-sm">Realizando análise inteligente dos seus hábitos...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color, isScore }: any) => (
  <div className="bg-white p-6 rounded-[1.5rem] border border-slate-200 shadow-sm transition-all hover:shadow-md">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-2 bg-${color}-50 text-${color}-600 rounded-xl`}>{icon}</div>
      {isScore && <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-emerald-500" style={{width: `${value}%`}}/></div>}
    </div>
    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{title}</p>
    <h3 className="text-2xl font-black text-slate-800 mt-1">
      {isScore ? `${value}/100` : `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
    </h3>
  </div>
);

export default Dashboard;
