
import React, { useState, useMemo } from 'react';
import { calculateSac, calculatePrice } from '../utils/financeMath';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Info, Calculator } from 'lucide-react';

const CreditSimulator: React.FC = () => {
  const [params, setParams] = useState({
    amount: 150000,
    rate: 10,
    months: 120,
    method: 'SAC' as 'SAC' | 'PRICE'
  });

  const results = useMemo(() => {
    return params.method === 'SAC' 
      ? calculateSac(params.amount, params.rate, params.months)
      : calculatePrice(params.amount, params.rate, params.months);
  }, [params]);

  const summary = useMemo(() => {
    const totalPaid = results.reduce((acc, r) => acc + r.installment, 0);
    const totalInterest = totalPaid - params.amount;
    const firstInstallment = results[0]?.installment || 0;
    const lastInstallment = results[results.length - 1]?.installment || 0;
    return { totalPaid, totalInterest, firstInstallment, lastInstallment };
  }, [results, params.amount]);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><Calculator size={24}/></div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">Simulador de Financiamento</h3>
            <p className="text-sm text-slate-500">Compare sistemas de amortização SAC e PRICE.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Valor do Imóvel/Bem</label>
            <input 
              type="number" 
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              value={params.amount}
              onChange={e => setParams({...params, amount: parseFloat(e.target.value)})}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Taxa de Juros (% a.a.)</label>
            <input 
              type="number" 
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              value={params.rate}
              onChange={e => setParams({...params, rate: parseFloat(e.target.value)})}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Prazo (meses)</label>
            <input 
              type="number" 
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              value={params.months}
              onChange={e => setParams({...params, months: parseInt(e.target.value)})}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Amortização</label>
            <select 
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              value={params.method}
              onChange={e => setParams({...params, method: e.target.value as any})}
            >
              <option value="SAC">SAC (Decrescente)</option>
              <option value="PRICE">PRICE (Fixa)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-lg">
            <p className="text-slate-400 text-sm mb-1">Total a Pagar</p>
            <h4 className="text-2xl font-bold">R$ {summary.totalPaid.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}</h4>
            <div className="mt-4 pt-4 border-t border-slate-800 space-y-2">
              <div className="flex justify-between text-xs">
                <span>Juros Totais</span>
                <span className="font-bold text-rose-400">R$ {summary.totalInterest.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>1ª Parcela</span>
                <span className="font-bold">R$ {summary.firstInstallment.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Última Parcela</span>
                <span className="font-bold">R$ {summary.lastInstallment.toLocaleString()}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-xl flex gap-3 text-blue-800 border border-blue-100">
            <Info size={20} className="shrink-0" />
            <p className="text-xs leading-relaxed">
              {params.method === 'SAC' 
                ? "No SAC, as parcelas são maiores no início e diminuem mensalmente. Você paga menos juros no total."
                : "No sistema PRICE, as parcelas são iguais durante todo o período, facilitando o planejamento mensal."}
            </p>
          </div>
        </div>

        <div className="lg:col-span-3 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h4 className="font-bold mb-6">Evolução da Parcela (Amortização vs Juros)</h4>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={results.filter((_, i) => i % Math.max(1, Math.floor(params.months / 12)) === 0)}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" label={{ value: 'Mês', position: 'bottom', offset: 0, fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                <Tooltip />
                <Legend iconType="circle" wrapperStyle={{paddingTop: '20px', fontSize: '12px'}} />
                <Bar dataKey="amortization" name="Amortização" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
                <Bar dataKey="interest" name="Juros" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditSimulator;
