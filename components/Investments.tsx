
import React, { useState, useMemo, useEffect } from 'react';
import { Investment } from '../utils/types';
import { calculateCompoundInterest } from '../utils/financeMath';
import { supabase } from '../utils/supabase';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { 
  TrendingUp, Plus, Zap, Calculator, Trash2, Activity, LineChart as LineIcon, Loader2, Sparkles, PlusCircle, X
} from 'lucide-react';

interface InvestmentsProps {
  userId: string;
  investments: Investment[];
  setInvestments: () => void;
  userPlan?: 'free' | 'pro';
}

const Investments: React.FC<InvestmentsProps> = ({ userId, investments, setInvestments }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [newInv, setNewInv] = useState<Partial<Investment>>({
    name: '', type: 'FIXED_INCOME', initialAmount: 0, currentAmount: 0, monthlyAport: 0, expectedReturn: 10
  });

  const [simParams, setSimParams] = useState({
    initial: 10000, monthly: 1000, rate: 11.5, years: 10
  });

  const projection = useMemo(() => {
    return calculateCompoundInterest(simParams.initial, simParams.monthly, simParams.rate, simParams.years);
  }, [simParams]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const { error } = await supabase.from('investments').insert([{
        user_id: userId,
        name: newInv.name,
        type: newInv.type,
        initial_amount: newInv.initialAmount,
        current_amount: newInv.initialAmount, // Começa igual ao inicial
        monthly_aport: newInv.monthlyAport,
        expected_return: newInv.expectedReturn
      }]);
      if (!error) {
        setInvestments();
        setShowAdd(false);
        setNewInv({ name: '', type: 'FIXED_INCOME', initialAmount: 0, currentAmount: 0, monthlyAport: 0, expectedReturn: 10 });
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Excluir este investimento?")) {
      await supabase.from('investments').delete().eq('id', id);
      setInvestments();
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">Investimentos</h2>
          <p className="text-slate-500 text-sm font-medium">Gestão de patrimônio e simulações de longo prazo.</p>
        </div>
        <button 
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-6 py-4 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-500/20 active:scale-95 transition-all"
        >
          <Plus size={18} /> Novo Ativo
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm space-y-8">
            <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2 text-sm uppercase tracking-widest">
              <Calculator size={16} className="text-emerald-500" /> Simulador Livre
            </h3>
            <div className="space-y-5">
              <InputGroup label="Aporte Inicial" value={simParams.initial} onChange={v => setSimParams({...simParams, initial: v})} />
              <InputGroup label="Aporte Mensal" value={simParams.monthly} onChange={v => setSimParams({...simParams, monthly: v})} />
              <div className="grid grid-cols-2 gap-4">
                <InputGroup label="Anos" value={simParams.years} onChange={v => setSimParams({...simParams, years: v})} />
                <InputGroup label="Taxa % a.a" value={simParams.rate} onChange={v => setSimParams({...simParams, rate: v})} />
              </div>
            </div>
            <div className="pt-6 border-t border-slate-50 dark:border-slate-800">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Resultado Projetado</p>
              <p className="text-3xl font-black text-emerald-600 tracking-tighter">
                R$ {projection.total.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white dark:bg-slate-900 p-8 lg:p-10 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h4 className="text-sm font-black dark:text-white uppercase tracking-widest flex items-center gap-2">
                <LineIcon size={18} className="text-emerald-500" /> Progressão de Patrimônio
              </h4>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={projection.growth.filter((_, i) => i % 12 === 0)}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                  <YAxis hide />
                  <Tooltip 
                    content={({ active, payload }: any) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 min-w-[180px]">
                            <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Ano {payload[0].payload.year}</p>
                            <p className="text-sm font-black dark:text-white">R$ {payload[0].payload.amount.toLocaleString('pt-BR')}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area type="monotone" dataKey="amount" stroke="#10b981" strokeWidth={3} fillOpacity={0.1} fill="#10b981" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {investments.map(inv => (
               <div key={inv.id} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 flex justify-between items-center group">
                 <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{inv.type}</p>
                   <h4 className="font-black text-slate-800 dark:text-white">{inv.name}</h4>
                   {/* Changed inv.current_amount to inv.currentAmount to match Investment interface */}
                   <p className="text-sm font-black text-emerald-600 mt-1">R$ {Number(inv.currentAmount).toLocaleString('pt-BR')}</p>
                 </div>
                 <button onClick={() => handleDelete(inv.id)} className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl transition-all opacity-0 group-hover:opacity-100">
                   <Trash2 size={16} />
                 </button>
               </div>
             ))}
          </div>
        </div>
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] w-full max-w-lg shadow-2xl animate-in zoom-in duration-300 border border-white/10">
            <div className="p-8 bg-emerald-600 text-white flex justify-between items-center rounded-t-[2.5rem]">
              <h3 className="font-black uppercase tracking-widest">Novo Ativo</h3>
              <button onClick={() => setShowAdd(false)}><X size={24}/></button>
            </div>
            <form onSubmit={handleSave} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nome do Ativo</label>
                  <input required value={newInv.name} onChange={e => setNewInv({...newInv, name: e.target.value})} className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-2xl font-bold dark:text-white outline-none" placeholder="Ex: CDB Prefixado" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tipo</label>
                  <select value={newInv.type} onChange={e => setNewInv({...newInv, type: e.target.value as any})} className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-2xl font-bold dark:text-white outline-none">
                    <option value="FIXED_INCOME">Renda Fixa</option>
                    <option value="STOCKS">Ações</option>
                    <option value="FUNDS">Fundos</option>
                    <option value="CRYPTO">Cripto</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Valor Inicial</label>
                  <input type="number" step="0.01" value={newInv.initialAmount} onChange={e => setNewInv({...newInv, initialAmount: Number(e.target.value)})} className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-2xl font-black dark:text-white outline-none" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Retorno Esperado (% a.a)</label>
                  <input type="number" step="0.1" value={newInv.expectedReturn} onChange={e => setNewInv({...newInv, expectedReturn: Number(e.target.value)})} className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-2xl font-black dark:text-white outline-none" />
                </div>
              </div>
              <button disabled={isSaving} className="w-full py-5 bg-emerald-600 text-white font-black uppercase rounded-2xl shadow-xl hover:-translate-y-1 transition-all flex justify-center items-center gap-2">
                {isSaving ? <Loader2 className="animate-spin" size={20} /> : <PlusCircle size={20} />}
                Confirmar Ativo
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const InputGroup = ({ label, value, onChange }: any) => (
  <div className="space-y-1.5">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">{label}</label>
    <input 
      type="number" 
      step="0.01"
      className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-black text-slate-700 dark:text-white outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all"
      value={value}
      onChange={e => onChange(Number(e.target.value))}
    />
  </div>
);

export default Investments;
