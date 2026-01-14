
import React, { useState, useMemo } from 'react';
import { Investment } from '../utils/types';
import { calculateCompoundInterest } from '../utils/financeMath';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line
} from 'recharts';
import { 
  TrendingUp, Plus, Zap, Shield, Target, 
  Calculator, Briefcase, Trash2, Activity,
  LineChart as LineChartIcon, Scale, Layers, Gem, Coins, Sparkles, Wallet,
  Share2, ArrowRightLeft
} from 'lucide-react';

interface InvestmentsProps {
  userId: string;
  investments: Investment[];
  setInvestments: React.Dispatch<React.SetStateAction<Investment[]>>;
  userPlan?: 'free' | 'pro';
}

const EvolutionTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    // Determine if we're in the stacked area chart (wealth progression)
    const isWealthProgression = payload.some(p => p.dataKey === 'invested' || p.dataKey === 'interest');
    // Determine if we're in comparison mode
    const isComparison = payload.length > 1 && !isWealthProgression;
    // Single line/area (legacy or fallback)
    const isSingle = payload.length === 1 && !isWealthProgression;

    return (
      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-6 rounded-[2.5rem] shadow-2xl border border-slate-200/50 dark:border-slate-800/50 min-w-[320px] animate-in fade-in zoom-in duration-300">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Marco Temporal</p>
            <p className="text-base font-black text-slate-900 dark:text-white">Ano {data.year} <span className="text-slate-400 font-medium ml-1">({data.month} meses)</span></p>
          </div>
          <div className="p-2.5 bg-emerald-500/10 rounded-2xl">
             <Sparkles size={18} className="text-emerald-600 dark:text-emerald-400" />
          </div>
        </div>
        
        <div className="space-y-6">
          {isWealthProgression ? (
            <>
              <div className="space-y-4">
                <div className="flex justify-between items-center group">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-500 transition-colors group-hover:bg-slate-200 dark:group-hover:bg-slate-700">
                       <Coins size={16} />
                    </div>
                    <div>
                      <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Investido</span>
                      <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Capital Próprio</span>
                    </div>
                  </div>
                  <span className="text-sm font-black text-slate-800 dark:text-white">
                    R$ {data.invested.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="flex justify-between items-center group">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 transition-colors group-hover:bg-emerald-200 dark:group-hover:bg-emerald-800/50">
                       <TrendingUp size={16} />
                    </div>
                    <div>
                      <span className="block text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Juros Ganhos</span>
                      <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Rendimento Acumulado</span>
                    </div>
                  </div>
                  <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                    R$ {data.interest.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              <div className="space-y-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden flex">
                   <div className="h-full bg-slate-400 dark:bg-slate-500 transition-all duration-500" style={{ width: `${(data.invested / data.amount) * 100}%` }} />
                   <div className="h-full bg-emerald-500 transition-all duration-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" style={{ width: `${(data.interest / data.amount) * 100}%` }} />
                </div>
                <div className="flex justify-between text-[9px] font-black uppercase tracking-[0.1em] text-slate-400">
                   <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-slate-400" /> Principal: {((data.invested / data.amount) * 100).toFixed(0)}%</span>
                   <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Rendimento: {((data.interest / data.amount) * 100).toFixed(0)}%</span>
                </div>
              </div>

              <div className="pt-4 mt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <div className="flex items-center gap-3">
                   <div className="p-2.5 bg-slate-900 dark:bg-emerald-600 rounded-xl text-white shadow-lg">
                      <Wallet size={16} />
                   </div>
                   <span className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Patrimônio Bruto</span>
                </div>
                <div className="text-right">
                  <span className="block text-2xl font-black text-slate-900 dark:text-white tracking-tighter">
                    R$ {data.amount.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                  </span>
                </div>
              </div>
            </>
          ) : isComparison ? (
            <div className="space-y-4">
              {payload.map((p: any, idx: number) => (
                <div key={idx} className="flex justify-between items-center group">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: p.color || p.stroke }} />
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{p.name}</span>
                  </div>
                  <span className="text-sm font-black text-slate-900 dark:text-white">
                    R$ {p.value.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                  </span>
                </div>
              ))}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Diferença de Estratégia</span>
                 <span className="text-xs font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-lg">
                   {(payload[payload.length-1].value / payload[0].value).toFixed(1)}x mais
                 </span>
              </div>
            </div>
          ) : (
            payload.map((p: any, idx: number) => (
              <div key={idx} className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: p.color || p.stroke }} />
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{p.name}</span>
                </div>
                <span className="text-sm font-black text-slate-900 dark:text-white">
                  R$ {p.value.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }
  return null;
};

const Investments: React.FC<InvestmentsProps> = ({ userId, investments, setInvestments }) => {
  const [params, setParams] = useState({
    initial: 10000,
    monthly: 1000,
    rate: 11.5,
    years: 15
  });

  const [viewMode, setViewMode] = useState<'single' | 'compare'>('compare');

  const projection = useMemo(() => {
    return calculateCompoundInterest(params.initial, params.monthly, params.rate, params.years);
  }, [params]);

  const comparisonData = useMemo(() => {
    const profiles = [
      { id: 'cons', name: 'Conservador', rate: 8.5, color: '#94a3b8', icon: <Shield size={14}/> },
      { id: 'mod', name: 'Moderado', rate: 12.0, color: '#10b981', icon: <Target size={14}/> },
      { id: 'aggr', name: 'Agressivo', rate: 16.5, color: '#8b5cf6', icon: <Zap size={14}/> }
    ];

    const results = profiles.map(p => {
      const res = calculateCompoundInterest(params.initial, params.monthly, p.rate, params.years);
      return { ...p, result: res, passive: res.total * (p.rate / 100 / 12) };
    });

    const combinedGrowth = results[0].result.growth
      .filter((_, i) => i % 6 === 0 || i === results[0].result.growth.length - 1)
      .map((g) => {
        const entry: any = { year: g.year, month: g.month };
        results.forEach(r => {
          entry[r.name] = r.result.growth.find(rg => rg.month === g.month)?.amount || 0;
        });
        return entry;
      });

    return { results, combinedGrowth };
  }, [params.initial, params.monthly, params.years]);

  const handleAddGoal = () => {
    const newInv: Investment = {
      id: Date.now().toString(),
      userId,
      name: `Meta ${params.years} anos`,
      type: 'FUNDS',
      initialAmount: params.initial,
      currentAmount: projection.total,
      monthlyAport: params.monthly,
      expectedReturn: params.rate
    };
    setInvestments(prev => [newInv, ...prev]);
  };

  const removeInvestment = (id: string) => {
    setInvestments(prev => prev.filter(inv => inv.id !== id));
  };

  const handleShare = async () => {
    const text = `Minha projeção financeira no FinanzoPro: Com um aporte mensal de R$ ${params.monthly.toLocaleString('pt-BR')}, meu patrimônio estimado em ${params.years} anos é de R$ ${projection.total.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}! 🚀`;
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Minha Projeção FinanzoPro',
          text: text,
          url: url,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${text} Veja em: ${url}`);
        alert('Resumo copiado para a área de transferência!');
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-32 lg:pb-0">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">Investimentos</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Projete seu futuro com inteligência matemática.</p>
        </div>
        <div className="flex bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <button 
            onClick={() => setViewMode('single')}
            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'single' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
          >
            Modo Simples
          </button>
          <button 
            onClick={() => setViewMode('compare')}
            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'compare' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
          >
            Comparativo PRO
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm space-y-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-slate-900 dark:bg-slate-800 text-white rounded-2xl">
                <Calculator size={20}/>
              </div>
              <h3 className="font-bold text-slate-800 dark:text-white text-md">Simulador</h3>
            </div>

            <div className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Patrimônio Inicial</label>
                <div className="relative">
                   <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-300">R$</span>
                   <input 
                    type="number" 
                    className="w-full pl-12 pr-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-black text-slate-700 dark:text-white outline-none focus:border-emerald-500/50"
                    value={params.initial}
                    onChange={e => setParams({...params, initial: Number(e.target.value)})}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between px-1">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Aporte Mensal</label>
                   <span className="text-[10px] font-black text-emerald-600">R$ {params.monthly}</span>
                </div>
                <input 
                  type="range" min="0" max="20000" step="100"
                  className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full appearance-none accent-emerald-600 cursor-pointer"
                  value={params.monthly}
                  onChange={e => setParams({...params, monthly: Number(e.target.value)})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block px-1">Anos</label>
                   <input type="number" className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-2xl font-black text-slate-700 dark:text-white" value={params.years} onChange={e => setParams({...params, years: Number(e.target.value)})}/>
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block px-1">Taxa (% a.a.)</label>
                   <input type="number" step="0.1" className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-2xl font-black text-slate-700 dark:text-white" value={params.rate} onChange={e => setParams({...params, rate: Number(e.target.value)})}/>
                </div>
              </div>

              <button 
                onClick={handleAddGoal}
                className="w-full py-5 bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl transition-all flex items-center justify-center gap-3 active:scale-95"
              >
                <Plus size={18}/> Salvar como Objetivo
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-600 to-indigo-950 p-8 rounded-[2.5rem] text-white space-y-4 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform duration-700">
               <Gem size={100} />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-indigo-300">Curiosidade Financeira</p>
            <h4 className="font-bold text-lg leading-tight">Juros sobre Juros</h4>
            <p className="text-xs text-indigo-100/60 font-medium leading-relaxed">
              O tempo é o componente mais importante da equação. Iniciar 5 anos mais cedo pode triplicar o patrimônio final.
            </p>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-8">
          {viewMode === 'single' ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm group relative overflow-hidden">
                  <div className="absolute -right-4 -top-4 p-8 text-emerald-500/5 group-hover:scale-110 transition-transform">
                    <TrendingUp size={120} />
                  </div>
                  <div className="relative z-10">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Montante Final Estimado</p>
                    <h3 className="text-4xl font-black text-emerald-600 dark:text-emerald-400 tracking-tighter">
                      R$ {projection.total.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                    </h3>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm group relative overflow-hidden">
                  <div className="absolute -right-4 -top-4 p-8 text-blue-500/5 group-hover:scale-110 transition-transform">
                    <Zap size={120} />
                  </div>
                  <div className="relative z-10">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Renda Mensal Passiva</p>
                    <h3 className="text-4xl font-black text-blue-600 dark:text-blue-400 tracking-tighter">
                      R$ {(projection.total * (params.rate/100/12)).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                    </h3>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
                   <div>
                      <h4 className="text-sm font-black dark:text-white uppercase tracking-widest flex items-center gap-2">
                        <LineChartIcon size={18} className="text-emerald-500" /> Progressão Patrimonial
                      </h4>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Composição de Capital e Rendimento</p>
                   </div>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={handleShare}
                      className="p-2.5 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-emerald-600 rounded-xl border border-slate-100 dark:border-slate-700 transition-all active:scale-95"
                      title="Compartilhar Projeção"
                    >
                      <Share2 size={16} />
                    </button>
                    <div className="flex items-center gap-4 px-4 py-1.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-slate-400" />
                        <span className="text-[8px] font-black text-slate-400 uppercase">Capital</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span className="text-[8px] font-black text-slate-400 uppercase">Juros</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={projection.growth.filter((_, i) => i % 12 === 0 || i === projection.growth.length - 1)}>
                      <defs>
                        <linearGradient id="colorInvested" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#94a3b8" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorInterest" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0.05}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} tickFormatter={(val) => `R$ ${val >= 1000 ? (val/1000).toFixed(0) + 'k' : val}`} />
                      <Tooltip content={<EvolutionTooltip />} />
                      <Area 
                        name="Capital Investido" 
                        stackId="1" 
                        type="monotone" 
                        dataKey="invested" 
                        stroke="#94a3b8" 
                        strokeWidth={2} 
                        fillOpacity={1} 
                        fill="url(#colorInvested)" 
                      />
                      <Area 
                        name="Juros Ganhos" 
                        stackId="1" 
                        type="monotone" 
                        dataKey="interest" 
                        stroke="#10b981" 
                        strokeWidth={3} 
                        fillOpacity={1} 
                        fill="url(#colorInterest)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between mb-10">
                   <h4 className="text-sm font-black dark:text-white uppercase tracking-widest flex items-center gap-2">
                    <ArrowRightLeft size={18} className="text-indigo-500" /> Evolução de Capital vs Patrimônio
                  </h4>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                       <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                       <span className="text-[9px] font-black text-slate-400 uppercase">Patrimônio</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                       <div className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                       <span className="text-[9px] font-black text-slate-400 uppercase">Capital Investido</span>
                    </div>
                  </div>
                </div>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={projection.growth.filter((_, i) => i % 6 === 0 || i === projection.growth.length - 1)}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} tickFormatter={(val) => `R$ ${val >= 1000 ? (val/1000).toFixed(0) + 'k' : val}`} />
                      <Tooltip content={<EvolutionTooltip />} />
                      <Line name="Patrimônio Total" type="monotone" dataKey="amount" stroke="#10b981" strokeWidth={3} dot={false} activeDot={{ r: 6, strokeWidth: 0 }} />
                      <Line name="Capital Investido" type="monotone" dataKey="invested" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" dot={false} activeDot={{ r: 4, strokeWidth: 0 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {comparisonData.results.map((r) => (
                  <div key={r.id} className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm group">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white" style={{ backgroundColor: r.color }}>
                          {r.icon}
                        </div>
                        <h4 className="font-black text-[10px] uppercase tracking-widest text-slate-800 dark:text-white">{r.name}</h4>
                      </div>
                      <span className="text-[10px] font-black text-slate-400">{r.rate}% a.a</span>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Montante Final</p>
                        <p className="text-xl font-black dark:text-white tracking-tighter">R$ {r.result.total.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}</p>
                      </div>
                      <div className="pt-4 border-t border-slate-50 dark:border-slate-800">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Renda Passiva</p>
                        <p className="text-sm font-black text-slate-800 dark:text-white">R$ {r.passive.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}/m</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between mb-10">
                   <h4 className="text-sm font-black dark:text-white uppercase tracking-widest flex items-center gap-2">
                    <Scale size={18} className="text-indigo-500" /> Disparidade de Rendimento
                  </h4>
                  <div className="flex items-center gap-4">
                    {comparisonData.results.map(r => (
                      <div key={r.name} className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: r.color }} />
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{r.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={comparisonData.combinedGrowth}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} tickFormatter={(val) => `R$ ${val >= 1000 ? (val/1000).toFixed(0) + 'k' : val}`} />
                      <Tooltip content={<EvolutionTooltip />} />
                      {comparisonData.results.map(r => (
                        <Line key={r.name} name={r.name} type="monotone" dataKey={r.name} stroke={r.color} strokeWidth={4} dot={false} activeDot={{ r: 6, strokeWidth: 0 }} />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Coins className="text-emerald-500" size={28}/>
            <h3 className="text-2xl font-black text-slate-800 dark:text-white tracking-tighter">Planos Fixados</h3>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {investments.map(inv => (
            <div key={inv.id} className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm group hover:shadow-xl transition-all relative overflow-hidden">
               <div className="flex justify-between items-start mb-8">
                 <div className="p-4 bg-slate-50 dark:bg-slate-800 text-slate-400 rounded-2xl group-hover:text-emerald-500 transition-colors">
                   <Briefcase size={24}/>
                 </div>
                 <button 
                  onClick={() => removeInvestment(inv.id)}
                  className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-xl transition-all"
                 >
                   <Trash2 size={18}/>
                 </button>
               </div>
               
               <h4 className="font-black text-slate-800 dark:text-white text-lg mb-1">{inv.name}</h4>
               <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-8">Base: {inv.expectedReturn}% a.a.</p>
               
               <div className="space-y-4">
                 <div className="flex justify-between items-center px-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Aporte Mensal</span>
                    <span className="text-sm font-black dark:text-white">R$ {inv.monthlyAport.toLocaleString()}</span>
                 </div>
                 <div className="pt-6 border-t border-slate-50 dark:border-slate-800 flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Alvo Final</span>
                    <span className="text-xl font-black text-emerald-600 dark:text-emerald-400 tracking-tighter">
                      R$ {inv.currentAmount.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                    </span>
                 </div>
               </div>
            </div>
          ))}
          
          {investments.length === 0 && (
            <div className="col-span-full py-20 bg-white dark:bg-slate-900 border-4 border-dashed border-slate-100 dark:border-slate-800 rounded-[2.5rem] flex flex-col items-center justify-center text-center p-10">
              <TrendingUp size={48} className="text-slate-200 dark:text-slate-700 mb-4" />
              <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Nenhuma meta arquivada</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Investments;
