
import React, { useState } from 'react';
import { FinancialGoal, Transaction } from '../utils/types';
import { Target, Calendar, Plus, ChevronRight, TrendingUp, X, Check, DollarSign } from 'lucide-react';

interface PlanningProps {
  goals: FinancialGoal[];
  setGoals: React.Dispatch<React.SetStateAction<FinancialGoal[]>>;
  transactions: Transaction[];
}

const Planning: React.FC<PlanningProps> = ({ goals, setGoals, transactions }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [showContribute, setShowContribute] = useState<string | null>(null);
  const [contributionAmount, setContributionAmount] = useState<number>(0);
  
  const [newGoal, setNewGoal] = useState<Partial<FinancialGoal>>({
    title: '',
    targetAmount: 0,
    currentAmount: 0,
    deadline: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newGoal.title && newGoal.targetAmount) {
      setGoals([...goals, { ...newGoal as FinancialGoal, id: Date.now().toString() }]);
      setShowAdd(false);
      setNewGoal({ 
        title: '', 
        targetAmount: 0, 
        currentAmount: 0, 
        deadline: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0] 
      });
    }
  };

  const handleContribute = (goalId: string) => {
    if (contributionAmount <= 0) return;
    setGoals(prev => prev.map(g => 
      g.id === goalId ? { ...g, currentAmount: g.currentAmount + contributionAmount } : g
    ));
    setShowContribute(null);
    setContributionAmount(0);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">Suas Metas</h3>
          <p className="text-slate-500 dark:text-slate-400 font-medium tracking-tight">Visualize o progresso dos seus sonhos financeiros.</p>
        </div>
        <button 
          onClick={() => setShowAdd(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-[1.25rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-100 dark:shadow-none transition-all active:scale-95 flex items-center gap-2"
        >
          <Plus size={20} /> Nova Meta
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map(goal => {
          const progress = Math.min(100, (goal.currentAmount / goal.targetAmount) * 100);
          const remaining = goal.targetAmount - goal.currentAmount;
          
          return (
            <div key={goal.id} className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
              <div className="flex justify-between items-start mb-6">
                <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-2xl group-hover:scale-110 transition-transform">
                  <Target size={28} />
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Progresso</span>
                  <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 tracking-tighter">{progress.toFixed(1)}%</div>
                </div>
              </div>
              
              <h4 className="text-lg font-black text-slate-800 dark:text-white mb-1">{goal.title}</h4>
              <p className="text-[10px] text-slate-400 mb-8 font-black uppercase tracking-widest flex items-center gap-1.5">
                <Calendar size={14} className="text-slate-300" /> Expira em: {new Date(goal.deadline).toLocaleDateString('pt-BR')}
              </p>

              <div className="space-y-4">
                <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Acumulado</p>
                    <p className="text-sm font-black text-slate-800 dark:text-white">R$ {goal.currentAmount.toLocaleString('pt-BR')}</p>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Objetivo</p>
                    <p className="text-sm font-black text-slate-800 dark:text-white">R$ {goal.targetAmount.toLocaleString('pt-BR')}</p>
                  </div>
                </div>

                <div className="pt-2">
                   <p className="text-[10px] text-center font-bold text-slate-400 italic">Faltam R$ {remaining > 0 ? remaining.toLocaleString('pt-BR') : '0'} para concluir</p>
                </div>
              </div>
              
              <div className="mt-8 flex gap-2">
                <button 
                  onClick={() => setShowContribute(goal.id)}
                  className="flex-1 py-4 bg-slate-900 dark:bg-slate-800 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg active:scale-95"
                >
                  Fazer Aporte
                </button>
                <button className="p-4 border border-slate-200 dark:border-slate-800 text-slate-400 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                   <ChevronRight size={18} />
                </button>
              </div>
            </div>
          );
        })}

        {goals.length === 0 && (
          <div className="col-span-full py-24 bg-white dark:bg-slate-900 border-4 border-dashed border-slate-100 dark:border-slate-800 rounded-[3rem] flex flex-col items-center justify-center text-center p-10">
            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
                <Target size={40} className="text-slate-200 dark:text-slate-700" />
            </div>
            <h4 className="text-xl font-black text-slate-800 dark:text-white mb-2">Suas metas aparecerão aqui</h4>
            <p className="text-slate-400 text-sm font-medium max-w-xs">Defina objetivos como "Reserva de Emergência" ou "Viagem dos Sonhos" para começar a poupar.</p>
          </div>
        )}
      </div>

      {showAdd && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in duration-300 border border-white/10">
            <div className="p-8 bg-emerald-600 text-white flex justify-between items-center">
              <h3 className="text-xl font-black">Criar Nova Meta</h3>
              <button onClick={() => setShowAdd(false)} className="p-2 hover:bg-white/20 rounded-full transition-all"><X size={24} /></button>
            </div>
            <form onSubmit={handleAdd} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">O que você deseja conquistar?</label>
                <input required placeholder="Ex: Comprar um carro" className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-slate-700 dark:text-white" value={newGoal.title} onChange={e=>setNewGoal({...newGoal, title: e.target.value})}/>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Valor Alvo (R$)</label>
                  <input required type="number" step="0.01" className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-slate-700 dark:text-white" value={newGoal.targetAmount || ''} onChange={e=>setNewGoal({...newGoal, targetAmount: parseFloat(e.target.value)})}/>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Prazo Estimado</label>
                  <input required type="date" className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-slate-700 dark:text-white" value={newGoal.deadline} onChange={e=>setNewGoal({...newGoal, deadline: e.target.value})}/>
                </div>
              </div>
              <button className="w-full py-5 bg-slate-900 dark:bg-slate-800 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl mt-4 shadow-xl hover:bg-emerald-600 transition-all flex items-center justify-center gap-2">
                <Check size={18} /> Confirmar Planejamento
              </button>
            </form>
          </div>
         </div>
      )}

      {showContribute && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in duration-300 border border-white/10">
                <div className="p-6 bg-slate-900 dark:bg-slate-800 text-white flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <DollarSign size={20} className="text-emerald-400" />
                        <h3 className="font-black text-xs uppercase tracking-widest">Realizar Aporte</h3>
                    </div>
                    <button onClick={() => setShowContribute(null)}><X size={20}/></button>
                </div>
                <div className="p-8 space-y-6 text-center">
                    <div>
                        <p className="text-xs font-bold text-slate-500 mb-4">Quanto você deseja poupar hoje para "{goals.find(g => g.id === showContribute)?.title}"?</p>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-300">R$</span>
                            <input 
                                autoFocus
                                type="number" 
                                className="w-full pl-12 pr-4 py-5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-black text-2xl text-slate-800 dark:text-white outline-none focus:ring-4 focus:ring-emerald-500/10" 
                                value={contributionAmount || ''}
                                onChange={e => setContributionAmount(parseFloat(e.target.value))}
                            />
                        </div>
                    </div>
                    <button 
                        onClick={() => handleContribute(showContribute)}
                        className="w-full py-4 bg-emerald-600 text-white font-black uppercase text-xs tracking-widest rounded-2xl shadow-xl shadow-emerald-100 transition-all"
                    >
                        Confirmar Aporte
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default Planning;
