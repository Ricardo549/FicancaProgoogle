
import React, { useState, useMemo } from 'react';
import { Investment } from '../types';
import { calculateCompoundInterest, calculateIndependenceNeeded } from '../utils/financeMath';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';
import { 
  TrendingUp, Plus, PieChart as PieIcon, Zap, Shield, Target, Clock, 
  Percent, DollarSign, Calendar, Trash2, Info, ArrowRight, Activity,
  ArrowUpRight, Scale, Calculator, Landmark, ListChecks, HeartPulse
} from 'lucide-react';

interface InvestmentsProps {
  investments: Investment[];
  setInvestments: React.Dispatch<React.SetStateAction<Investment[]>>;
}

const SCENARIOS = [
  { name: 'Conservador', rate: 8.5, color: '#94a3b8', icon: <Shield size={14} />, desc: 'Selic / CDB' },
  { name: 'Moderado', rate: 11.5, color: '#3b82f6', icon: <Target size={14} />, desc: 'FIIs / IPCA+' },
  { name: 'Arrojado', rate: 16.0, color: '#10b981', icon: <Zap size={14} />, desc: 'Ações / Cripto' },
];

const EvolutionTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-5 rounded-[2rem] shadow-2xl border border-slate-100 min-w-[260px] animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-50">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tempo Decorrido</p>
          <span className="text-[11px] font-black text-slate-800 bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200">
            {data.year} Anos
          </span>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-[11px] font-bold text-slate-500">Patrimônio</span>
            </div>
            <span className="text-sm font-black text-slate-800">
              R$ {data.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-slate-300" />
              <span className="text-[11px] font-bold text-slate-500">Investido</span>
            </div>
            <span className="text-sm font-black text-slate-600">
              R$ {data.invested.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-slate-50">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="text-[11px] font-bold text-slate-500">Lucro (Juros)</span>
            </div>
            <span className="text-sm font-black text-blue-600">
              R$ {(data.amount - data.invested).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const Investments: React.FC<InvestmentsProps> = ({ investments, setInvestments }) => {
  const [params, setParams] = useState({
    initial: 10000,
    monthly: 500,
    rate: 11.5,
    years: 10,
    targetMonthlyIncome: 5000
  });

  const projection = useMemo(() => {
    return calculateCompoundInterest(
      params.initial, 
      params.monthly, 
      params.rate, 
      params.years
    );
  }, [params]);

  const independenceNeeded = useMemo(() => {
    return calculateIndependenceNeeded(params.targetMonthlyIncome);
  }, [params.targetMonthlyIncome]);

  const independenceProgress = Math.min(100, (projection.total / independenceNeeded) * 100);

  const multiScenarioData = useMemo(() => {
    const results = SCENARIOS.map(s => calculateCompoundInterest(params.initial, params.monthly, s.rate, params.years));
    const chartData = results[0].growth.filter((_, i) => i % 6 === 0).map((point, idx) => {
      const dataPoint: any = { year: point.year };
      SCENARIOS.forEach((s, sIdx) => {
        dataPoint[s.name] = results[sIdx].growth[idx * 6]?.amount || results[sIdx].total;
      });
      return dataPoint;
    });
    return chartData;
  }, [params.initial, params.monthly, params.years]);

  const compositionData = [
    { name: 'Investido', value: projection.totalInvested, color: '#cbd5e1' },
    { name: 'Juros', value: projection.totalInterest, color: '#10b981' },
  ];

  const handleAddGoal = () => {
    const newInv: Investment = {
      id: Date.now().toString(),
      name: `Simulação ${params.years} anos @ ${params.rate}%`,
      type: 'FUNDS',
      initialAmount: params.initial,
      currentAmount: projection.total,
      monthlyAport: params.monthly,
      expectedReturn: params.rate
    };
    setInvestments(prev => [newInv, ...prev]);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Laboratório de Investimentos</h2>
          <p className="text-slate-500 font-medium tracking-tight">Projete seu futuro financeiro com precisão matemática.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Painel de Controle */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8 relative overflow-hidden">
            <div className="flex items-center gap-3 relative z-10">
              <div className="p-3 bg-slate-900 text-white rounded-2xl">
                <Calculator size={24}/>
              </div>
              <h3 className="font-bold text-slate-800 text-lg">Parâmetros do Simulado</h3>
            </div>

            <div className="space-y-8 relative z-10">
              <div className="group">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Investimento Inicial (R$)</label>
                <input 
                  type="number" 
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-slate-700 transition-all"
                  value={params.initial}
                  onChange={e => setParams({...params, initial: Number(e.target.value)})}
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Aporte Mensal (R$)</label>
                  <span className="text-emerald-600 font-black text-xs">R$ {params.monthly.toLocaleString()}</span>
                </div>
                <input 
                  type="range" min="0" max="20000" step="100"
                  className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                  value={params.monthly}
                  onChange={e => setParams({...params, monthly: Number(e.target.value)})}
                />
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Clock size={12} className="text-slate-500" /> Prazo (Anos)
                    </label>
                    <span className="text-slate-800 font-black text-xs">{params.years} anos</span>
                  </div>
                  <input 
                    type="range" min="1" max="50" step="1"
                    className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-slate-800"
                    value={params.years}
                    onChange={e => setParams({...params, years: Number(e.target.value)})}
                  />
                  <input 
                    type="number"
                    className="mt-3 w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-600"
                    value={params.years}
                    onChange={e => setParams({...params, years: Math.max(1, Number(e.target.value))})}
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Percent size={12} className="text-blue-500" /> Taxa de Juros Anual
                    </label>
                    <span className="text-blue-600 font-black text-xs">{params.rate}% a.a.</span>
                  </div>
                  <input 
                    type="range" min="0" max="30" step="0.1"
                    className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    value={params.rate}
                    onChange={e => setParams({...params, rate: Number(e.target.value)})}
                  />
                  <div className="relative mt-3">
                    <input 
                      type="number" step="0.1"
                      className="w-full pl-4 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-blue-600 outline-none focus:ring-2 focus:ring-blue-500"
                      value={params.rate}
                      onChange={e => setParams({...params, rate: Number(e.target.value)})}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-300 font-bold">%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 block text-center">Referência de Perfil</label>
              <div className="grid grid-cols-3 gap-2">
                {SCENARIOS.map(s => (
                  <button 
                    key={s.name}
                    onClick={() => setParams({...params, rate: s.rate})}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all ${params.rate === s.rate ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-white border-slate-100 text-slate-400 hover:bg-slate-50'}`}
                  >
                    <span className="mb-1">{s.icon}</span>
                    <span className="text-[9px] font-black uppercase tracking-tighter">{s.name}</span>
                    <span className="text-[10px] font-bold">{s.rate}%</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-indigo-900 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-125 transition-transform duration-700">
              <HeartPulse size={120} />
            </div>
            <h4 className="text-indigo-300 text-[10px] font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
              <Zap size={14} className="text-amber-400" /> Aceleração FIRE
            </h4>
            <div className="space-y-4 relative z-10">
              <div>
                <p className="text-[10px] text-indigo-300 uppercase font-black tracking-widest mb-1">Poder Multiplicador</p>
                <p className="text-3xl font-black">{projection.yieldOnCost.toFixed(2)}x <span className="text-sm font-medium text-indigo-400 ml-1">o capital</span></p>
              </div>
              <p className="text-[10px] text-indigo-300 leading-relaxed font-medium italic">
                Sua taxa de <b>{params.rate}%</b> gera um rendimento mensal médio de <b>{projection.monthlyRatePerc.toFixed(3)}%</b>.
              </p>
            </div>
          </div>
        </div>

        {/* Visualização de Resultados */}
        <div className="lg:col-span-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm flex flex-col justify-between relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 text-emerald-50/50 -z-0">
                  <TrendingUp size={160} />
               </div>
               <div className="relative z-10">
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mb-2">Estimativa Total em {params.years} anos</p>
                  <h3 className="text-5xl font-black text-slate-900 tracking-tighter mb-8">
                    <span className="text-2xl font-medium text-slate-300 mr-2">R$</span>
                    {projection.total.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                  </h3>
                  
                  <div className="space-y-4 pt-8 border-t border-slate-50">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-500">Capital Investido</span>
                      <span className="text-sm font-black text-slate-700">R$ {projection.totalInvested.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-500">Lucro Acumulado</span>
                      <span className="text-sm font-black text-emerald-600">R$ {projection.totalInterest.toLocaleString()}</span>
                    </div>
                  </div>

                  <button 
                    onClick={handleAddGoal}
                    className="w-full mt-10 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-widest py-4 rounded-2xl transition-all shadow-xl shadow-emerald-100 flex items-center justify-center gap-2 active:scale-95"
                  >
                    <Target size={18} /> Fixar Meta de Projeção
                  </button>
               </div>
            </div>

            <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm flex flex-col items-center justify-center">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Divisão do Patrimônio Final</h4>
              <div className="h-56 w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={compositionData}
                      cx="50%" cy="50%"
                      innerRadius={65}
                      outerRadius={85}
                      paddingAngle={8}
                      dataKey="value"
                    >
                      {compositionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(val: any) => `R$ ${val.toLocaleString()}`}
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <p className="text-[10px] font-black text-slate-400 uppercase">Juros</p>
                  <p className="text-xl font-black text-emerald-600">{((projection.totalInterest / projection.total) * 100).toFixed(0)}%</p>
                </div>
              </div>
              <div className="flex gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Aportes</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Juros</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h4 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                  <Activity size={20} className="text-emerald-500" /> Curva de Crescimento Composto
                </h4>
                <p className="text-xs text-slate-400 mt-1">Simulação temporal de <b>{params.years} anos</b> a <b>{params.rate}% a.a.</b></p>
              </div>
            </div>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={projection.growth.filter((_, i) => i % 6 === 0)}>
                  <defs>
                    <linearGradient id="colorPat" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="year" 
                    axisLine={false} tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}}
                    label={{ value: 'Anos', position: 'bottom', offset: -10, fontSize: 10, fill: '#cbd5e1' }}
                  />
                  <YAxis 
                    axisLine={false} tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}}
                    tickFormatter={(val) => `R$ ${val >= 1000 ? (val/1000).toFixed(0) + 'k' : val}`}
                  />
                  <Tooltip content={<EvolutionTooltip />} />
                  <Area type="monotone" dataKey="amount" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorPat)" />
                  <Area type="monotone" dataKey="invested" stroke="#cbd5e1" strokeWidth={2} strokeDasharray="5 5" fill="transparent" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Investments;
