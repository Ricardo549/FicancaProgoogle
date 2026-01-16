
import React, { useState, useMemo } from 'react';
import { calculateSac, calculatePrice } from '../utils/financeMath';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar } from 'recharts';
import { Info, Calculator, ArrowRightLeft, TrendingDown, DollarSign, Scale, Percent, Sparkles, ShieldCheck } from 'lucide-react';

const CreditSimulator: React.FC = () => {
  const [params, setParams] = useState({
    amount: 200000,
    rate: 9.5,
    months: 180,
    insuranceRate: 1.5,
    method: 'SAC' as 'SAC' | 'PRICE'
  });

  // Calcula ambos os métodos para comparação
  const comparison = useMemo(() => {
    const sacResults = calculateSac(params.amount, params.rate, params.months, params.insuranceRate);
    const priceResults = calculatePrice(params.amount, params.rate, params.months, params.insuranceRate);

    const getSummary = (results: any[]) => {
      const totalPaid = results.reduce((acc, r) => acc + r.installment, 0);
      const totalInterest = totalPaid - params.amount - ((params.amount * (params.insuranceRate / 100) / 12) * params.months);
      const totalInsurance = (params.amount * (params.insuranceRate / 100) / 12) * params.months;
      return {
        totalPaid,
        totalInterest,
        totalInsurance,
        firstInstallment: results[0]?.installment || 0,
        lastInstallment: results[results.length - 1]?.installment || 0,
        results
      };
    };

    const sac = getSummary(sacResults);
    const price = getSummary(priceResults);

    return {
      sac,
      price,
      interestSaved: price.totalInterest - sac.totalInterest
    };
  }, [params]);

  const activeResults = params.method === 'SAC' ? comparison.sac : comparison.price;

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20 lg:pb-0">
      {/* Header & Inputs */}
      <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-indigo-600 text-white rounded-2xl shadow-xl shadow-indigo-100 dark:shadow-none">
              <Calculator size={28}/>
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">Simulador de Crédito Imobiliário</h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Análise Técnica SAC vs PRICE</p>
            </div>
          </div>
          
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl">
            <button 
              onClick={() => setParams({...params, method: 'SAC'})}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${params.method === 'SAC' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Sistema SAC
            </button>
            <button 
              onClick={() => setParams({...params, method: 'PRICE'})}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${params.method === 'PRICE' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Sistema PRICE
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Valor do Financiamento</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-300">R$</span>
              <input 
                type="number" 
                className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-black text-slate-700 dark:text-white outline-none focus:ring-4 focus:ring-indigo-500/10"
                value={params.amount}
                onChange={e => setParams({...params, amount: Math.max(0, parseFloat(e.target.value))})}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Taxa de Juros (% a.a.)</label>
            <div className="relative">
              <Percent className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="number" step="0.1"
                className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-black text-slate-700 dark:text-white outline-none focus:ring-4 focus:ring-indigo-500/10"
                value={params.rate}
                onChange={e => setParams({...params, rate: parseFloat(e.target.value)})}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Prazo (Meses)</label>
            <div className="relative">
              <input 
                type="number" 
                className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-black text-slate-700 dark:text-white outline-none focus:ring-4 focus:ring-indigo-500/10"
                value={params.months}
                onChange={e => setParams({...params, months: Math.max(1, parseInt(e.target.value))})}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Seguro Obrigatório (%)</label>
            <div className="relative">
              <ShieldCheck className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="number" step="0.01"
                className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-black text-slate-700 dark:text-white outline-none focus:ring-4 focus:ring-indigo-500/10"
                value={params.insuranceRate}
                onChange={e => setParams({...params, insuranceRate: parseFloat(e.target.value)})}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Comparativo Lado a Lado */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card SAC */}
        <div className={`p-8 rounded-[2.5rem] border-2 transition-all ${params.method === 'SAC' ? 'border-emerald-500 bg-emerald-50/30 dark:bg-emerald-900/10 shadow-2xl' : 'border-transparent bg-white dark:bg-slate-900'}`}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-emerald-500 text-white rounded-xl flex items-center justify-center font-black">S</div>
            <h4 className="font-black text-slate-800 dark:text-white uppercase tracking-widest text-sm">Sistema SAC</h4>
          </div>
          <div className="space-y-6">
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Total de Juros</p>
              <p className="text-xl font-black text-emerald-600">R$ {comparison.sac.totalInterest.toLocaleString('pt-BR')}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase mb-1">1ª Parcela</p>
                <p className="text-sm font-black dark:text-white">R$ {comparison.sac.firstInstallment.toLocaleString('pt-BR')}</p>
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Última Parcela</p>
                <p className="text-sm font-black dark:text-white">R$ {comparison.sac.lastInstallment.toLocaleString('pt-BR')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Card PRICE */}
        <div className={`p-8 rounded-[2.5rem] border-2 transition-all ${params.method === 'PRICE' ? 'border-indigo-500 bg-indigo-50/30 dark:bg-indigo-900/10 shadow-2xl' : 'border-transparent bg-white dark:bg-slate-900'}`}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-indigo-500 text-white rounded-xl flex items-center justify-center font-black">P</div>
            <h4 className="font-black text-slate-800 dark:text-white uppercase tracking-widest text-sm">Sistema PRICE</h4>
          </div>
          <div className="space-y-6">
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Total de Juros</p>
              <p className="text-xl font-black text-indigo-600">R$ {comparison.price.totalInterest.toLocaleString('pt-BR')}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Parcela Fixa</p>
                <p className="text-sm font-black dark:text-white">R$ {comparison.price.firstInstallment.toLocaleString('pt-BR')}</p>
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Parcela Final</p>
                <p className="text-sm font-black dark:text-white">R$ {comparison.price.lastInstallment.toLocaleString('pt-BR')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Card Insight / Diferença */}
        <div className="bg-slate-900 dark:bg-emerald-950 p-8 rounded-[2.5rem] text-white flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
             <Scale size={120} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={16} className="text-emerald-400" />
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">Wealth Insight</h4>
            </div>
            <h3 className="text-2xl font-black mb-4">Economia com SAC</h3>
            <p className="text-3xl font-black text-emerald-400 tracking-tighter">
              R$ {comparison.interestSaved.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
            </p>
            <p className="text-xs text-slate-400 dark:text-emerald-100/60 font-medium mt-4 leading-relaxed">
              Ao optar pelo sistema SAC em vez do PRICE, você reduz o custo efetivo total do seu financiamento em aproximadamente 
              <span className="font-bold text-white ml-1">
                {((comparison.interestSaved / comparison.price.totalPaid) * 100).toFixed(1)}%
              </span>.
            </p>
          </div>
          
          <div className="mt-8 pt-6 border-t border-white/10 relative z-10">
             <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                <Info size={14}/> Recomendação Técnica
             </div>
          </div>
        </div>
      </div>

      {/* Gráfico Comparativo de Amortização */}
      <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h4 className="font-black text-slate-800 dark:text-white uppercase tracking-widest text-sm flex items-center gap-2">
              <TrendingDown size={20} className="text-rose-500" /> Composição das Parcelas
            </h4>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Evolução de Juros vs Amortização</p>
          </div>
          <div className="flex items-center gap-6">
             <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span className="text-[10px] font-black text-slate-400 uppercase">Amortização</span>
             </div>
             <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                <span className="text-[10px] font-black text-slate-400 uppercase">Juros</span>
             </div>
          </div>
        </div>
        
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart 
              data={activeResults.results.filter((_, i) => i % Math.max(1, Math.floor(params.months / 24)) === 0)}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorAmort" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorJuros" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} tickFormatter={(val) => `R$ ${val >= 1000 ? (val/1000).toFixed(0) + 'k' : val}`} />
              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 min-w-[150px]">
                        <p className="text-[10px] font-black text-slate-400 uppercase mb-3">Mês {label}</p>
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-xs">
                            <span className="font-bold text-slate-500">Parcela</span>
                            <span className="font-black text-slate-800 dark:text-white">R$ {(payload[0].value! + payload[1].value! + (params.amount * (params.insuranceRate / 100) / 12)).toLocaleString('pt-BR')}</span>
                          </div>
                          <div className="flex justify-between text-[10px] pt-1.5 border-t border-slate-50 dark:border-slate-700">
                            <span className="text-slate-400">Juros</span>
                            <span className="font-black text-rose-500">R$ {payload[1].value?.toLocaleString('pt-BR')}</span>
                          </div>
                          <div className="flex justify-between text-[10px]">
                            <span className="text-slate-400">Amort.</span>
                            <span className="font-black text-emerald-500">R$ {payload[0].value?.toLocaleString('pt-BR')}</span>
                          </div>
                          <div className="flex justify-between text-[10px]">
                            <span className="text-slate-400">Seguro</span>
                            <span className="font-black text-indigo-500">R$ {(params.amount * (params.insuranceRate / 100) / 12).toLocaleString('pt-BR')}</span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area type="monotone" dataKey="amortization" stackId="1" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorAmort)" />
              <Area type="monotone" dataKey="interest" stackId="1" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#colorJuros)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Info Adicional */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-50 dark:bg-blue-900/10 p-6 rounded-[2rem] border border-blue-100 dark:border-blue-900/30 flex gap-4">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-xl h-fit">
            <Info size={20} />
          </div>
          <div>
            <h5 className="font-black text-blue-900 dark:text-blue-400 text-sm uppercase tracking-widest mb-2">Entendendo o SAC</h5>
            <p className="text-xs text-blue-800 dark:text-blue-200/70 leading-relaxed font-medium">
              No Sistema de Amortização Constante, você paga uma parte fixa da dívida todos os meses. Como o saldo devedor cai mais rápido, o valor dos juros também cai rapidamente, gerando parcelas decrescentes.
            </p>
          </div>
        </div>
        <div className="bg-indigo-50 dark:bg-indigo-900/10 p-6 rounded-[2rem] border border-indigo-100 dark:border-indigo-900/30 flex gap-4">
          <div className="p-3 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-xl h-fit">
            <ArrowRightLeft size={20} />
          </div>
          <div>
            <h5 className="font-black text-indigo-900 dark:text-indigo-400 text-sm uppercase tracking-widest mb-2">Entendendo o PRICE</h5>
            <p className="text-xs text-indigo-800 dark:text-indigo-200/70 leading-relaxed font-medium">
              A Tabela Price mantém o valor da parcela fixo. No início, a maior parte da parcela é juros e pouco é amortização. Isso faz com que a dívida demore mais para cair, resultando em um custo total maior que o SAC.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditSimulator;
