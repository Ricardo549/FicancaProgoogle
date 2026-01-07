
import React, { useState, useMemo } from 'react';
import { Investment } from '../utils/types';
import { calculateCompoundInterest } from '../utils/financeMath';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, Legend, BarChart, Bar
} from 'recharts';
import { 
  TrendingUp, Plus, Zap, Shield, Target, 
  Calculator, ListChecks, Briefcase, Trash2, Activity,
  LineChart as LineChartIcon, Info, ExternalLink, ArrowRightLeft,
  ChevronRight, Sparkles, Scale
} from 'lucide-react';

interface InvestmentsProps {
  investments: Investment[];
  setInvestments: React.Dispatch<React.SetStateAction<Investment[]>>;
  userPlan?: 'free' | 'pro';
}

const EvolutionTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white dark:bg-slate-800 p-5 rounded-[2rem] shadow-2xl border border-slate-100 dark:border-slate-700 min-w-[260px] animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-50 dark:border-slate-700">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tempo Decorrido</p>
          <span className="text-[11px] font-black text-slate-800 dark:text-white bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-lg border border-slate-200 dark:border-slate-600">
            {data.year} Anos
          </span>
        </div>
        <div className="space-y-3">
          {payload.map((p: any, idx: number) => (
            <div key={idx} className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color || p.stroke }} />
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">{p.name}</span>
              </div>
              <span className="text-sm font-black text-slate-800 dark:text-white">
                R$ {p.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

const Investments: React.FC<InvestmentsProps> = ({ investments, setInvestments, userPlan = 'free' }) => {
  const [params, setParams] = useState({
    initial: 10000,
    monthly: 500,
    rate: 11.5,
    years: 10,
    targetMonthlyIncome: 5000
  });

  const [viewMode, setViewMode] = useState<'single' | 'compare'>('single');

  const projection = useMemo(() => {
    return calculateCompoundInterest(
      params.initial, 
      params.monthly, 
      params.rate, 
      params.years
    );
  }, [params]);

  const comparisonData = useMemo(() => {
    const profiles = [
      { name: 'Conservador', rate: 8.0, color: '#94a3b8' },
      { name: 'Moderado', rate: 11.5, color: '#10b981' },
      { name: 'Agressivo', rate: 15.0, color: '#8b5cf6' }
    ];

    const results = profiles.map(p => ({
      ...p,
      result: calculateCompoundInterest(params.initial, params.monthly, p.rate, params.years)
    }));

    const maxLength = results[0].result.growth.length;
    const combinedGrowth = [];
    for (let i = 0; i < maxLength; i++) {
      if (i % 6 === 0 || i === maxLength - 1) {
        const entry: any = { year: results[0].result.growth[i].year };
        results.forEach(r => {
          entry[r.name] = r.result.growth[i].amount;
        });
        combinedGrowth.push(entry);
      }
    }

    return { results, combinedGrowth };
  }, [params.initial, params.monthly, params.years]);

  const handleAddGoal = () => {
    const newInv: Investment = {
      id: Date.now().toString(),
      name: `Meta ${params.years} anos @ ${params.rate}%`,
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

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-32 lg:pb-0">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">Investimentos</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium tracking-tight">Simule cenários e planeje sua liberdade financeira.</p>
        </div>
        <div className="flex bg-white dark:bg-slate-900 p-1 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <button 
            onClick={() => setViewMode('single')}
            className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'single' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400'}`}
          >
            Individual
          </button>
          <button 
            onClick={() => setViewMode('compare')}
            className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'compare' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400'}`}
          >
            Comparar Perfis
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm space-y-8 relative overflow-hidden">
            <div className="flex items-center gap-3 relative z-10">
              <div className="p-3 bg-slate-900 dark:bg-slate-800 text-white rounded-2xl">
                <Calculator size={24}/>
              </div>
              <h3 className="font-bold text-slate-800 dark:text-white text-lg">Parâmetros Base</h3>
            </div>

            <div className="space-y-8 relative z-10">
              <div>
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 block">Investimento Inicial (R$)</label>
                <input 
                  type="number" 
                  className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 outline-none font-black text-slate-700 dark:text-white transition-all"
                  value={params.initial}
                  onChange={e => setParams({...params, initial: Number(e.target.value)})}
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Aporte Mensal (R$)</label>
                  <span className="text-emerald-600 dark:text-emerald-400 font-black text-xs">R$ {params.monthly.toLocaleString()}</span>
                </div>
                <input 
                  type="range" min="0" max="20000" step="100"
                  className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                  value={params.monthly}
                  onChange={e => setParams({...params, monthly: Number(e.target.value)})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block">Prazo (Anos)</label>
                  <input 
                    type="number" 
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-black text-slate-700 dark:text-white"
                    value={params.years}
                    onChange={e => setParams({...params, years: Number(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block">Taxa Alvo (% a.a.)</label>
                  <input 
                    disabled={viewMode === 'compare'}
                    type="number" step="0.1"
                    className={`w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-black transition-all ${viewMode === 'compare' ? 'opacity-50 cursor-not-allowed' : 'text-slate-700 dark:text-white'}`}
                    value={params.rate}
                    onChange={e => setParams({...params, rate: Number(e.target.value)})}
                  />
                </div>
              </div>

              <button 
                onClick={handleAddGoal}
                className="w-full py-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-emerald-500/20 transition-all flex items-center justify-center gap-3 active:scale-95"
              >
                <Plus size={18}/> Fixar como Meta
              </button>
            </div>
          </div>

          {userPlan === 'free' && (
            <div className="p-6 bg-slate-100 dark:bg-slate-800/50 rounded-[2.5rem] border border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center text-center gap-4">
              <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Patrocinado por Google AdSense</div>
              <div className="w-full h-40 bg-slate-200 dark:bg-slate-800 rounded-2xl flex items-center justify-center border border-slate-200 dark:border-slate-700">
                <div className="text-slate-400 font-bold text-xs">Publicidade Dinâmica</div>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-8 space-y-8">
          {viewMode === 'single' ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between group overflow-hidden relative">
                  <div className="absolute -right-4 -top-4 p-8 text-emerald-500/5 group-hover:scale-110 transition-transform">
                    <TrendingUp size={120} />
                  </div>
                  <div className="relative z-10">
                    <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Montante Final Estimado</p>
                    <h3 className="text-3xl font-black text-emerald-600 dark:text-emerald-400 tracking-tighter">
                      R$ {projection.total.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 mt-4 uppercase tracking-widest relative z-10">
                    <Activity size={14}/> {params.years} anos de acumulação
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between group overflow-hidden relative">
                  <div className="absolute -right-4 -top-4 p-8 text-blue-500/5 group-hover:scale-110 transition-transform">
                    <Zap size={120} />
                  </div>
                  <div className="relative z-10">
                    <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Rendimento Passivo Estimado</p>
                    <h3 className="text-3xl font-black text-blue-600 dark:text-blue-400 tracking-tighter">
                      R$ {(projection.total * (params.rate/100/12)).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}/mês
                    </h3>
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 mt-4 uppercase tracking-widest italic relative z-10">Baseado na taxa de {params.rate}% a.a.</p>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
                <h4 className="text-sm font-black dark:text-white uppercase tracking-widest mb-8 flex items-center gap-2">
                  <TrendingUp size={18} className="text-emerald-500" /> Curva de Crescimento Patrimonial
                </h4>
                <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={projection.growth.filter((_, i) => i % 6 === 0 || i === projection.growth.length - 1)}>
                      <defs>
                        <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} tickFormatter={(val) => `R$ ${val >= 1000 ? (val/1000).toFixed(0) + 'k' : val}`} />
                      <Tooltip content={<EvolutionTooltip />} />
                      <Area name="Montante Acumulado" type="monotone" dataKey="amount" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorAmount)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {comparisonData.results.map((r, i) => (
                  <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-500/50 transition-all group">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-2 h-6 rounded-full" style={{ backgroundColor: r.color }} />
                      <h4 className="font-black text-[10px] uppercase tracking-widest text-slate-400 group-hover:text-slate-800 dark:group-hover:text-white transition-colors">{r.name} ({r.rate}% a.a)</h4>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">Montante Final</p>
                        <p className="text-lg font-black dark:text-white">R$ {r.result.total.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}</p>
                      </div>
                      <div className="pt-3 border-t border-slate-50 dark:border-slate-800">
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">Renda Passiva</p>
                        <p className={`text-md font-black`} style={{ color: r.color }}>
                          R$ {(r.result.total * (r.rate/100/12)).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}/mês
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <h4 className="text-sm font-black dark:text-white uppercase tracking-widest flex items-center gap-2">
                    <Scale size={18} className="text-indigo-500" /> Comparativo de Crescimento
                  </h4>
                  <div className="hidden sm:flex items-center gap-4">
                    {comparisonData.results.map(r => (
                      <div key={r.name} className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: r.color }} />
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{r.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={comparisonData.combinedGrowth}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} tickFormatter={(val) => `R$ ${val >= 1000 ? (val/1000).toFixed(0) + 'k' : val}`} />
                      <Tooltip content={<EvolutionTooltip />} />
                      <Legend 
                        className="sm:hidden"
                        verticalAlign="bottom" 
                        height={36} 
                        iconType="circle"
                        formatter={(value) => <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{value}</span>}
                      />
                      {comparisonData.results.map(r => (
                        <Line 
                          key={r.name}
                          name={r.name}
                          type="monotone" 
                          dataKey={r.name} 
                          stroke={r.color} 
                          strokeWidth={r.name === 'Moderado' ? 4 : 2} 
                          dot={false}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-6 flex items-start gap-4 p-5 bg-indigo-50 dark:bg-indigo-900/10 rounded-2xl border border-indigo-100 dark:border-indigo-900/20">
                  <div className="p-2 bg-white dark:bg-slate-800 rounded-lg text-indigo-500 shrink-0 shadow-sm">
                    <Sparkles size={16}/>
                  </div>
                  <p className="text-[11px] font-medium text-indigo-900 dark:text-indigo-200/60 leading-relaxed">
                    A diferença entre os perfis demonstra o impacto drástico que pequenas variações de taxa têm no longo prazo. O perfil 
                    <span className="font-black text-indigo-600 dark:text-indigo-400 mx-1">Agressivo</span> 
                    gera um montante 
                    <span className="font-black">
                      {((comparisonData.results[2].result.total / comparisonData.results[0].result.total)).toFixed(1)}x maior 
                    </span> 
                    que o Conservador neste cenário de {params.years} anos.
                  </p>
                </div>
              </div>
            </>
          )}

          {viewMode === 'single' && (
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
              <h4 className="text-sm font-black dark:text-white uppercase tracking-widest mb-8 flex items-center gap-2">
                <LineChartIcon size={18} className="text-blue-500" /> Evolução: Valor Atual vs Investido
              </h4>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={projection.growth.filter((_, i) => i % 6 === 0 || i === projection.growth.length - 1)}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} tickFormatter={(val) => `R$ ${val >= 1000 ? (val/1000).toFixed(0) + 'k' : val}`} />
                    <Tooltip content={<EvolutionTooltip />} />
                    <Legend 
                      verticalAlign="top" 
                      height={36} 
                      iconType="circle"
                      formatter={(value) => <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{value === 'amount' ? 'Valor Acumulado' : 'Capital Investido'}</span>}
                    />
                    <Line name="Valor Acumulado" type="monotone" dataKey="amount" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                    <Line name="Capital Investido" type="monotone" dataKey="invested" stroke="#3b82f6" strokeWidth={3} strokeDasharray="5 5" dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-6 flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/20">
                <Info className="text-blue-500 shrink-0" size={16}/>
                <p className="text-[10px] font-medium text-blue-800 dark:text-blue-200/60 leading-relaxed">
                  A linha pontilhada azul representa o capital retirado do seu bolso. A diferença entre a linha verde e a azul é o "Poder do Tempo": juros compostos trabalhando por você.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <ListChecks className="text-emerald-500" size={24}/>
          <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-widest">Estratégias Salvas</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {investments.map(inv => (
            <div key={inv.id} className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm group hover:shadow-xl transition-all relative overflow-hidden">
               <div className="flex justify-between items-start mb-6">
                 <div className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-400 rounded-xl">
                   <Briefcase size={20}/>
                 </div>
                 <button 
                  onClick={() => removeInvestment(inv.id)}
                  className="p-2 text-slate-300 hover:text-rose-500 transition-colors"
                 >
                   <Trash2 size={16}/>
                 </button>
               </div>
               <h4 className="font-black text-slate-800 dark:text-white mb-1 truncate">{inv.name}</h4>
               <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-6">Projeção Concluída</p>
               
               <div className="space-y-3">
                 <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Aporte</span>
                    <span className="text-xs font-black dark:text-white">R$ {inv.monthlyAport}/mês</span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Taxa</span>
                    <span className="text-xs font-black dark:text-white">{inv.expectedReturn}% a.a.</span>
                 </div>
                 <div className="pt-3 border-t border-slate-50 dark:border-slate-800 flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase">Patrimônio</span>
                    <span className="text-sm font-black text-emerald-600">R$ {inv.currentAmount.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}</span>
                 </div>
               </div>
            </div>
          ))}
          
          {investments.length === 0 && (
            <div className="col-span-full py-16 bg-slate-50/50 dark:bg-slate-900/50 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2.5rem] flex flex-col items-center justify-center text-center px-8">
              <TrendingUp size={32} className="text-slate-300 mb-4" />
              <p className="text-sm font-bold text-slate-400">Nenhuma estratégia fixada ainda.</p>
              <p className="text-[10px] font-medium text-slate-400 mt-1">Simule uma projeção acima e clique em "Fixar como Meta".</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Investments;
