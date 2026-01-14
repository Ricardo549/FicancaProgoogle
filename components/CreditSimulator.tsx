
import React, { useState, useMemo } from 'react';
import { calculateSac, calculatePrice } from '../utils/financeMath';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar } from 'recharts';
import { Info, Calculator, ArrowRightLeft, TrendingDown, DollarSign, Scale, Percent, Sparkles, X } from 'lucide-react';

const CreditSimulator: React.FC = () => {
  const [params, setParams] = useState({
    amount: 200000,
    rate: 9.5,
    months: 180,
    method: 'SAC' as 'SAC' | 'PRICE'
  });

  const comparison = useMemo(() => {
    const sacResults = calculateSac(params.amount, params.rate, params.months);
    const priceResults = calculatePrice(params.amount, params.rate, params.months);

    const getSummary = (results: any[]) => {
      const totalPaid = results.reduce((acc, r) => acc + r.installment, 0);
      const totalInterest = totalPaid - params.amount;
      return {
        totalPaid,
        totalInterest,
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
      <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-indigo-600 text-white rounded-2xl shadow-xl">
              <Calculator size={28}/>
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">Simulador de Crédito</h3>
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Valor do Financiamento</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-300">R$</span>
              <input 
                type="number" 
                className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-black text-slate-700 dark:text-white outline-none"
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
                className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-black text-slate-700 dark:text-white"
                value={params.rate}
                onChange={e => setParams({...params, rate: parseFloat(e.target.value)})}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Prazo (Meses)</label>
            <input 
              type="number" 
              className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-black text-slate-700 dark:text-white"
              value={params.months}
              onChange={e => setParams({...params, months: Math.max(1, parseInt(e.target.value))})}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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

        <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10">
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
            <p className="text-xs text-slate-400 font-medium mt-4 leading-relaxed">
              Ao optar pelo sistema SAC em vez do PRICE, você reduz o custo efetivo total significativamente.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-sm">
        <h4 className="font-black text-slate-800 dark:text-white uppercase tracking-widest text-sm mb-10 flex items-center gap-2">
          <TrendingDown size={20} className="text-rose-500" /> Evolução de Juros vs Amortização
        </h4>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={activeResults.results.filter((_, i) => i % Math.max(1, Math.floor(params.months / 24)) === 0)}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
              <Tooltip />
              <Area type="monotone" dataKey="amortization" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.1} />
              <Area type="monotone" dataKey="interest" stackId="1" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.1} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default CreditSimulator;
