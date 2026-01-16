
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
    const invested = data.invested;
    const interest = data.interest;
    const total = data.amount;

    return (
      <div className="bg-white/80 dark:bg-slate-900/90 backdrop-blur-xl p-6 rounded-[2rem] shadow-2xl border border-white/20 dark:border-slate-800/50 min-w-[280px] animate-in zoom-in duration-200">
        <div className="flex items-center justify-between mb-4 border-b border-slate-100 dark:border-slate-800 pb-3">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ano {data.year}</p>
          <Sparkles size={14} className="text-emerald-500" />
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-slate-400"></div>
              <span className="text-[10px] font-black text-slate-500 uppercase">Capital Investido</span>
            </div>
            <span className="text-xs font-black dark:text-white">R$ {invested.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <span className="text-[10px] font-black text-emerald-500 uppercase">Juros Ganhos</span>
            </div>
            <span className="text-xs font-black text-emerald-600">R$ {interest.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </div>

          <div className="pt-3 mt-1 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <span className="text-[10px] font-black text-slate-800 dark:text-white uppercase tracking-tighter">Patrimônio Total</span>
            <span className="text-lg font-black text-slate-900 dark:text-white tracking-tighter">R$ {total.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}</span>
          </div>
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

  const projection = useMemo(() => {
    return calculateCompoundInterest(params.initial, params.monthly, params.rate, params.years);
  }, [params]);

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <header>
        <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">Investimentos</h2>
        <p className="text-slate-500 text-sm font-medium">Simule o poder dos juros compostos em tempo real.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm space-y-8">
            <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2"><Calculator size={20}/> Simulador</h3>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Aporte Mensal</label>
                <div className="relative">
                   <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-300">R$</span>
                   <input 
                    type="number" 
                    className="w-full pl-12 pr-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-black text-slate-700 dark:text-white outline-none"
                    value={params.monthly}
                    onChange={e => setParams({...params, monthly: Number(e.target.value)})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Anos</label>
                   <input type="number" className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-2xl font-black" value={params.years} onChange={e => setParams({...params, years: Number(e.target.value)})}/>
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Taxa %</label>
                   <input type="number" step="0.1" className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-2xl font-black" value={params.rate} onChange={e => setParams({...params, rate: Number(e.target.value)})}/>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 bg-white dark:bg-slate-900 p-8 lg:p-10 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex justify-between items-center mb-10">
            <h4 className="text-sm font-black dark:text-white uppercase tracking-widest flex items-center gap-2">
              <LineChartIcon size={18} className="text-emerald-500" /> Progressão Patrimonial
            </h4>
          </div>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={projection.growth.filter((_, i) => i % 12 === 0 || i === projection.growth.length - 1)}>
                <defs>
                  <linearGradient id="colorInvested" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#94a3b8" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorInterest" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} dy={10} />
                <YAxis hide />
                <Tooltip content={<EvolutionTooltip />} />
                <Area 
                  stackId="1" 
                  type="monotone" 
                  dataKey="invested" 
                  stroke="#94a3b8" 
                  strokeWidth={2} 
                  fillOpacity={1} 
                  fill="url(#colorInvested)" 
                />
                <Area 
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
      </div>
    </div>
  );
};

export default Investments;
