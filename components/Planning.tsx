
import React, { useState } from 'react';
import { FinancialGoal, Transaction } from '../types';
import { Target, Calendar, Plus, ChevronRight, TrendingUp } from 'lucide-react';

interface PlanningProps {
  goals: FinancialGoal[];
  setGoals: React.Dispatch<React.SetStateAction<FinancialGoal[]>>;
  transactions: Transaction[];
}

const Planning: React.FC<PlanningProps> = ({ goals, setGoals, transactions }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [newGoal, setNewGoal] = useState<Partial<FinancialGoal>>({
    title: '',
    targetAmount: 0,
    currentAmount: 0,
    deadline: new Date().toISOString().split('T')[0]
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newGoal.title && newGoal.targetAmount) {
      setGoals([...goals, { ...newGoal as FinancialGoal, id: Date.now().toString() }]);
      setShowAdd(false);
      setNewGoal({ title: '', targetAmount: 0, currentAmount: 0 });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold text-slate-800">Suas Metas</h3>
          <p className="text-slate-500">Planeje seu futuro e acompanhe seu progresso.</p>
        </div>
        <button 
          onClick={() => setShowAdd(true)}
          className="bg-emerald-600 text-white px-6 py-2 rounded-xl font-bold shadow-lg flex items-center gap-2"
        >
          <Plus size={20} /> Nova Meta
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map(goal => {
          const progress = (goal.currentAmount / goal.targetAmount) * 100;
          return (
            <div key={goal.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                  <Target size={24} />
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-400 uppercase">Progresso</span>
                  <div className="text-xl font-bold text-emerald-600">{progress.toFixed(1)}%</div>
                </div>
              </div>
              
              <h4 className="text-lg font-bold text-slate-800 mb-1">{goal.title}</h4>
              <p className="text-xs text-slate-400 mb-6 flex items-center gap-1">
                <Calendar size={12} /> Expira em: {new Date(goal.deadline).toLocaleDateString('pt-BR')}
              </p>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Acumulado</span>
                  <span className="font-bold text-slate-800">R$ {goal.currentAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Objetivo</span>
                  <span className="font-bold text-slate-800">R$ {goal.targetAmount.toLocaleString()}</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full mt-4">
                  <div 
                    className="h-full bg-emerald-500 rounded-full transition-all duration-1000"
                    style={{ width: `${Math.min(100, progress)}%` }}
                  />
                </div>
              </div>
              
              <button className="w-full mt-6 py-2 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 flex items-center justify-center gap-2">
                Ver detalhes <ChevronRight size={16} />
              </button>
            </div>
          );
        })}

        {goals.length === 0 && (
          <div className="col-span-full py-20 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-slate-400">
            <Target size={48} className="mb-4 opacity-20" />
            <p>Você ainda não definiu nenhuma meta financeira.</p>
          </div>
        )}
      </div>

      {showAdd && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-6 bg-emerald-600 text-white flex justify-between items-center">
              <h3 className="text-xl font-bold">Criar Nova Meta</h3>
              <button onClick={() => setShowAdd(false)}><Plus size={24} className="rotate-45" /></button>
            </div>
            <form onSubmit={handleAdd} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Título da Meta</label>
                <input required className="w-full p-2 bg-slate-50 border rounded-lg" value={newGoal.title} onChange={e=>setNewGoal({...newGoal, title: e.target.value})}/>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">Valor Alvo (R$)</label>
                  <input required type="number" className="w-full p-2 bg-slate-50 border rounded-lg" value={newGoal.targetAmount} onChange={e=>setNewGoal({...newGoal, targetAmount: parseFloat(e.target.value)})}/>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">Prazo</label>
                  <input required type="date" className="w-full p-2 bg-slate-50 border rounded-lg" value={newGoal.deadline} onChange={e=>setNewGoal({...newGoal, deadline: e.target.value})}/>
                </div>
              </div>
              <button className="w-full py-3 bg-emerald-600 text-white font-bold rounded-xl mt-4">Confirmar Meta</button>
            </form>
          </div>
         </div>
      )}
    </div>
  );
};

export default Planning;
