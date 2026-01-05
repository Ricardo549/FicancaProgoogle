
import React, { useState, useMemo } from 'react';
import { Investment } from '../types';
import { calculateCompoundInterest } from '../utils/financeMath';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  TrendingUp, 
  Plus, 
  PieChart as PieIcon, 
  Zap, 
  Shield, 
  Target, 
  Clock, 
  Percent, 
  DollarSign, 
  Calendar, 
  Trash2,
  Info,
  ArrowRight
} from 'lucide-react';

interface InvestmentsProps {
  investments: Investment[];
  setInvestments: React.Dispatch<React.SetStateAction<Investment[]>>;
}

const SCENARIOS = [
  { name: 'Conservador', rate: 8.5, icon: <Shield size={14} />, desc: 'Foco em segurança (Ex: Tesouro Selic)' },
  { name: 'Moderado', rate: 11.5, icon: <Target size={14} />, desc: 'Equilíbrio (Ex: Fundos Imobiliários)' },
  { name: 'Arrojado', rate: 16.0, icon: <Zap size={14} />, desc: 'Busca por ganho (Ex: Ações/Cripto)' },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-4 rounded-2xl shadow-2xl border border-slate-100 min-w-[220px] animate-in fade-in zoom-in duration-200">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 pb-2 border-b border-slate-50 flex items-center justify-between">
          <span>Tempo decorrido</span>
          <span className="text-slate-800">Ano {label}</span>
        </p>
        <div className="space-y-3">
          <div className="flex justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-[11px] font-bold text-slate-500">Patrimônio</span>
            </div>
            <span className="text-[13px] font-black text-emerald-600">R$ {data.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="flex justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
              <span className="text-[11px] font-bold text-slate-500">Investido</span>
            </div>
            <span className="text-[13px] font-black text-slate-700">R$ {data.invested.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="flex justify-between items-center gap-4 pt-2 border-t border-slate-50">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              <span className="text-[11px] font-bold text-slate-500">Juros Ganhos</span>
            </div>
            <span className="text-[13px] font-black text-indigo-600">R$ {data.interest.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const Investments: React.FC<InvestmentsProps> = ({ investments, setInvestments }) => {
  // Simulator State
  const [params, setParams] = useState({
    initial: 10000,   // Initial Investment
    monthly: 500,     // Monthly Contribution
    rate: 11.5,       // Yearly Interest Rate (%)
    years: 10         // Number of Years
  });

  const projection = useMemo(() => {
    return calculateCompoundInterest(
      params.initial, 
      params.monthly, 
      params.rate, 
      params.years
    );
  }, [params]);

  const handleAddFromSimulation = () => {
    const newInv: Investment = {
      id: Date.now().toString(),
      name: `Meta ${params.years} Anos`,
      type: 'FUNDS',
      initialAmount: params.initial,
      currentAmount: projection.total,
      monthlyAport: params.monthly,
      expectedReturn: params.rate
    };
    setInvestments(prev => [newInv, ...prev]);
  };

  const deleteInvestment = (id: string) => {
    setInvestments(prev => prev.filter(i => i.id !== id));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Simulation Engine Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Simulador de Patrimônio</h2>
          <p className="text-slate-500">Projete sua liberdade financeira com juros compostos.</p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-xl text-emerald-700 font-semibold">
          <SparklesIcon size={18} />
          IA Estimou: R$ {projection.total.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Configuration Panel */}
        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
            <TrendingUp size={120} />
          </div>

          <div className="flex items-center gap-3 mb-2 relative">
            <div className="p-3 bg-emerald-600 text-white rounded-2xl shadow-lg shadow-emerald-200">
              <Clock size={24}/>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">Configuração</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ajuste os parâmetros</p>
            </div>
          </div>
          
          <div className="space-y-5 relative">
            {/* 1. Initial Investment Input */}
            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase mb-2 flex items-center justify-between tracking-wider">
                <span className="flex items-center gap-1.5"><DollarSign size={14} className="text-emerald-500" /> Investimento Inicial</span>
                <Info size={12} className="text-slate-300 cursor-help" title="O valor que você tem hoje para começar." />
              </label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">R$</span>
                <input 
                  type="number" 
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all font-bold text-slate-800" 
                  value={params.initial} 
                  onChange={e => setParams({...params, initial: parseFloat(e.target.value) || 0})}
                />
              </div>
            </div>
            
            {/* 2. Monthly Contribution Input */}
            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase mb-2 flex items-center justify-between tracking-wider">
                <span className="flex items-center gap-1.5"><ArrowRight size={14} className="text-blue-500" /> Aporte Mensal</span>
                <Info size={12} className="text-slate-300 cursor-help" title="Quanto você pretende investir todos os meses." />
              </label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">R$</span>
                <input 
                  type="number" 
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all font-bold text-slate-800" 
                  value={params.monthly} 
                  onChange={e => setParams({...params, monthly: parseFloat(e.target.value) || 0})}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* 3. Yearly Interest Rate Input */}
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase mb-2 block tracking-wider">
                  <span className="flex items-center gap-1.5"><Percent size={14} className="text-amber-500" /> Taxa Anual</span>
                </label>
                <div className="relative">
                  <input 
                    type="number" 
                    step="0.1"
                    className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all font-bold text-slate-800" 
                    value={params.rate} 
                    onChange={e => setParams({...params, rate: parseFloat(e.target.value) || 0})}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">%</span>
                </div>
              </div>

              {/* 4. Number of Years Input */}
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase mb-2 block tracking-wider">
                  <span className="flex items-center gap-1.5"><Calendar size={14} className="text-indigo-500" /> Prazo (Anos)</span>
                </label>
                <input 
                  type="number" 
                  min="1"
                  max="50"
                  className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all font-bold text-slate-800" 
                  value={params.years} 
                  onChange={e => setParams({...params, years: parseFloat(e.target.value) || 0})}
                />
              </div>
            </div>

            {/* Quick Presets Slider for years */}
            <div className="pt-2">
              <input 
                type="range"
                min="1"
                max="50"
                step="1"
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                value={params.years}
                onChange={e => setParams({...params, years: parseInt(e.target.value)})}
              />
              <div className="flex justify-between mt-2 px-1">
                <span className="text-[10px] font-bold text-slate-400">1 ano</span>
                <span className="text-[10px] font-bold text-slate-400">25 anos</span>
                <span className="text-[10px] font-bold text-slate-400">50 anos</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <label className="text-[10px] font-black text-slate-400 uppercase mb-4 block text-center tracking-widest">Simular Perfil de Risco</label>
              <div className="grid grid-cols-1 gap-2">
                {SCENARIOS.map(s => (
                  <button
                    key={s.name}
                    onClick={() => setParams({...params, rate: s.rate})}
                    className={`
                      flex items-center justify-between p-3 rounded-2xl text-xs font-bold border transition-all text-left
                      ${params.rate === s.rate 
                        ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg' 
                        : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100 hover:border-slate-200'}
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${params.rate === s.rate ? 'bg-emerald-500' : 'bg-white shadow-sm'}`}>
                        {s.icon}
                      </div>
                      <div>
                        <p>{s.name}</p>
                        <p className={`text-[9px] font-normal ${params.rate === s.rate ? 'text-emerald-100' : 'text-slate-400'}`}>{s.desc}</p>
                      </div>
                    </div>
                    <span className={`text-[11px] font-black ${params.rate === s.rate ? 'text-emerald-50' : 'text-emerald-600'}`}>{s.rate}%</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Projection Results Panel */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900 text-white p-8 rounded-[2rem] shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-700">
                <DollarSign size={80} />
              </div>
              <div className="relative">
                <p className="text-emerald-400 text-[10px] uppercase font-black tracking-[0.2em] mb-3">Saldo Final Estimado</p>
                <h4 className="text-5xl font-black mb-8 tracking-tighter">
                  <span className="text-2xl font-medium text-slate-500 mr-2">R$</span>
                  {projection.total.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                </h4>
                
                <div className="grid grid-cols-2 gap-8 pt-6 border-t border-slate-800">
                  <div className="space-y-1">
                    <p className="text-slate-500 text-[10px] uppercase font-bold tracking-wider flex items-center gap-1.5">
                      <ArrowRight size={10} /> Total Investido
                    </p>
                    <p className="text-lg font-bold text-slate-200">R$ {projection.totalInvested.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-emerald-500 text-[10px] uppercase font-bold tracking-wider flex items-center gap-1.5">
                      <SparklesIcon size={10} /> Rendimento
                    </p>
                    <p className="text-lg font-bold text-emerald-400">R$ {projection.totalInterest.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}</p>
                  </div>
                </div>

                <button 
                  onClick={handleAddFromSimulation}
                  className="w-full mt-10 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95 group"
                >
                  <Plus size={20} className="group-hover:rotate-90 transition-transform" /> 
                  Fixar como Meta na Carteira
                </button>
              </div>
            </div>

            {/* Growth Table / Summary */}
            <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Info size={18} className="text-slate-400" />
                  <h4 className="font-bold text-slate-800">Resumo da Projeção</h4>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-slate-50">
                    <span className="text-sm text-slate-500">Média de Juros Mensal</span>
                    <span className="text-sm font-bold text-slate-700">{(params.rate / 12).toFixed(2)}% ao mês</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-50">
                    <span className="text-sm text-slate-500">Poder dos Juros</span>
                    <span className="text-sm font-bold text-emerald-600">{( (projection.totalInterest / projection.totalInvested) * 100 ).toFixed(1)}% do principal</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-50">
                    <span className="text-sm text-slate-500">Meses de Aplicação</span>
                    <span className="text-sm font-bold text-slate-700">{params.years * 12} meses</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-slate-500">Retorno p/ cada R$1,00</span>
                    <span className="text-sm font-bold text-indigo-600">R$ {(projection.total / projection.totalInvested).toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <div className="mt-6 p-4 bg-indigo-50 rounded-2xl border border-indigo-100 flex items-start gap-3">
                <Zap size={20} className="text-indigo-600 shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed text-indigo-800 font-medium">
                  Com aportes mensais de <b>R$ {params.monthly}</b>, você terá acumulado mais de <b>R$ {projection.totalInterest.toLocaleString()}</b> apenas em juros ao final de {params.years} anos.
                </p>
              </div>
            </div>
          </div>

          {/* Evolution Chart */}
          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col min-h-[400px]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
              <div>
                <h4 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <TrendingUp size={20} className="text-emerald-500" />
                  Progressão Patrimonial
                </h4>
                <p className="text-xs text-slate-400 mt-1 font-medium tracking-tight">Comparativo entre capital investido e patrimônio acumulado.</p>
              </div>
              <div className="flex items-center gap-6 bg-slate-50/80 px-4 py-2 rounded-xl border border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Patrimônio</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Aportes</span>
                </div>
              </div>
            </div>
            
            <div className="flex-1 w-full min-h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={projection.growth.filter((_, i, arr) => {
                   if (arr.length < 50) return true;
                   return i % Math.ceil(arr.length / 50) === 0 || i === arr.length - 1;
                })} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorInvested" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#94a3b8" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="year" 
                    tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 800}} 
                    axisLine={false} 
                    tickLine={false}
                    interval="preserveStartEnd"
                  />
                  <YAxis 
                    tickFormatter={(val) => `R$ ${val >= 1000000 ? (val/1000000).toFixed(1) + 'M' : (val/1000).toFixed(0) + 'k'}`} 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 800}} 
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#10b981" 
                    strokeWidth={4} 
                    fillOpacity={1} 
                    fill="url(#colorAmount)" 
                    name="Patrimônio"
                    animationDuration={1500}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="invested" 
                    stroke="#94a3b8" 
                    strokeWidth={2} 
                    strokeDasharray="6 6"
                    fillOpacity={1} 
                    fill="url(#colorInvested)" 
                    name="Total Investido"
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Assets Portfolio List */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10 relative">
          <div>
            <h4 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <PieIcon className="text-emerald-600" size={24}/>
              Minha Carteira de Projeções
            </h4>
            <p className="text-sm text-slate-400 mt-1 font-medium">Acompanhe seus objetivos e metas financeiras salvas.</p>
          </div>
          <button 
            onClick={() => setInvestments(prev => [{ id: Date.now().toString(), name: 'Nova Meta Financeira', type: 'FUNDS', initialAmount: 0, currentAmount: 0, monthlyAport: 0, expectedReturn: 10 }, ...prev])}
            className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-8 py-4 rounded-2xl transition-all flex items-center justify-center gap-2 active:scale-95 shadow-xl shadow-slate-200"
          >
            <Plus size={18}/> Novo Ativo Manual
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {investments.map(inv => (
            <div key={inv.id} className="p-6 rounded-[2rem] border border-slate-100 bg-slate-50/50 transition-all hover:shadow-2xl hover:shadow-emerald-100/50 hover:bg-white hover:border-emerald-100 group">
              <div className="flex justify-between items-center mb-6">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-3 py-1.5 bg-white rounded-full border border-slate-100 shadow-sm">
                  {inv.type}
                </span>
                <span className="text-[11px] font-black text-emerald-600 px-3 py-1.5 bg-emerald-50 rounded-full border border-emerald-100">
                  {inv.expectedReturn}% a.a.
                </span>
              </div>
              
              <h5 className="font-bold text-slate-800 truncate mb-1 text-base group-hover:text-emerald-700 transition-colors">{inv.name}</h5>
              
              <div className="mt-6">
                <p className="text-[9px] text-slate-400 font-black uppercase mb-1 tracking-widest">Objetivo Final</p>
                <p className="text-3xl font-black text-slate-800 tracking-tighter">
                  <span className="text-sm font-medium text-slate-400 mr-1.5">R$</span>
                  {inv.currentAmount.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-200/60 flex justify-between items-center">
                 <div className="flex flex-col">
                    <span className="text-[9px] text-slate-400 uppercase font-black tracking-tighter">Aporte Mensal</span>
                    <span className="text-sm text-slate-700 font-bold">R$ {inv.monthlyAport.toLocaleString('pt-BR')}</span>
                 </div>
                 <button 
                  onClick={() => deleteInvestment(inv.id)}
                  className="text-slate-300 hover:text-rose-500 transition-colors p-2.5 hover:bg-rose-50 rounded-xl"
                  title="Remover Meta"
                 >
                   <Trash2 size={18} />
                 </button>
              </div>
            </div>
          ))}

          {investments.length === 0 && (
            <div className="col-span-full py-24 text-center text-slate-400 bg-slate-50/20 border-2 border-dashed border-slate-200 rounded-[3rem] flex flex-col items-center gap-4">
              <div className="p-6 bg-white rounded-full shadow-lg shadow-slate-100">
                <Target size={48} className="text-slate-200" />
              </div>
              <div className="space-y-1">
                <p className="font-black text-slate-600 text-lg uppercase tracking-widest">Sua carteira está vazia</p>
                <p className="text-xs max-w-xs mx-auto text-slate-400 leading-relaxed font-medium">Use o simulador acima para projetar o futuro do seu dinheiro e salve os resultados clicando em <b>Fixar como Meta</b>.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const SparklesIcon = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="currentColor" />
  </svg>
);

export default Investments;
