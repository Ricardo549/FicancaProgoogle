
import React, { useState } from 'react';
import { Transaction, Category, PaymentMethod, TransactionType, TransactionStatus } from '../types';
import { CATEGORIES } from '../constants';
import { processFinancialStatement } from '../services/gemini';
import { 
  Search, 
  Plus, 
  Trash2, 
  FileText, 
  Sparkles, 
  X, 
  Check, 
  Loader2, 
  AlertCircle,
  ArrowRightLeft
} from 'lucide-react';

interface TransactionsProps {
  transactions: Transaction[];
  onAdd: (t: Omit<Transaction, 'id'>) => void;
  onDelete: (id: string) => void;
}

const Transactions: React.FC<TransactionsProps> = ({ transactions, onAdd, onDelete }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importText, setImportText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [pendingTransactions, setPendingTransactions] = useState<Omit<Transaction, 'id'>[]>([]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | TransactionType>('ALL');

  const [newTransaction, setNewTransaction] = useState<Partial<Transaction>>({
    description: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    type: 'EXPENSE',
    categoryId: CATEGORIES.find(c => c.type === 'EXPENSE')?.id || '5',
    status: 'PAID',
    paymentMethod: 'DEBIT_CARD',
    isRecurring: false
  });

  const filtered = transactions.filter(t => {
    const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'ALL' || t.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTransaction.description && newTransaction.amount) {
      onAdd(newTransaction as Omit<Transaction, 'id'>);
      setShowAddForm(false);
      setNewTransaction({
        ...newTransaction,
        description: '',
        amount: 0
      });
    }
  };

  const handleImportStatement = async () => {
    if (!importText.trim()) return;
    setIsProcessing(true);
    try {
      const extracted = await processFinancialStatement(importText);
      // Map to standard format
      const mapped = extracted.map((t: any) => ({
        ...t,
        amount: Math.abs(t.amount),
        status: 'PAID',
        paymentMethod: 'TRANSFER',
        isRecurring: false
      }));
      setPendingTransactions(mapped);
    } catch (error) {
      alert("Erro ao processar com IA. Tente colar um texto mais claro.");
    } finally {
      setIsProcessing(false);
    }
  };

  const confirmImport = () => {
    pendingTransactions.forEach(t => onAdd(t));
    setPendingTransactions([]);
    setImportText('');
    setShowImportModal(false);
  };

  const updatePendingCategory = (index: number, catId: string) => {
    const updated = [...pendingTransactions];
    updated[index].categoryId = catId;
    setPendingTransactions(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="relative w-full lg:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar lançamentos..." 
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2 w-full lg:w-auto overflow-x-auto pb-1 lg:pb-0">
          <select 
            className="px-4 py-2 bg-white border border-slate-200 rounded-xl outline-none text-sm font-medium shadow-sm"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
          >
            <option value="ALL">Todos os Tipos</option>
            <option value="INCOME">Receitas</option>
            <option value="EXPENSE">Despesas</option>
          </select>
          <button 
            onClick={() => setShowImportModal(true)}
            className="flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl font-semibold transition-all shadow-sm shrink-0"
          >
            <FileText size={18} /> Importar Extrato
          </button>
          <button 
            onClick={() => setShowAddForm(true)}
            className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-xl font-semibold transition-all shadow-md active:scale-95 shrink-0"
          >
            <Plus size={18} /> Novo Lançamento
          </button>
        </div>
      </div>

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-emerald-600 to-emerald-500 text-white">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-xl"><Sparkles size={24}/></div>
                <div>
                  <h3 className="text-xl font-black">Importar via IA Gemini</h3>
                  <p className="text-xs text-emerald-100 font-medium">Cole o texto do seu extrato ou fatura</p>
                </div>
              </div>
              <button onClick={() => setShowImportModal(false)} className="hover:bg-white/20 p-2 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8">
              {pendingTransactions.length === 0 ? (
                <div className="space-y-6">
                  <div className="relative">
                    <textarea 
                      className="w-full h-64 p-6 bg-slate-50 border-2 border-slate-100 rounded-[2rem] outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/30 transition-all font-mono text-sm resize-none"
                      placeholder="Exemplo:
02/10 COMPRA AMAZON R$ 150,00
05/10 SALARIO R$ 5.000,00
10/10 RESTAURANTE R$ 85,90..."
                      value={importText}
                      onChange={(e) => setImportText(e.target.value)}
                    />
                    <div className="absolute bottom-4 right-4 text-[10px] font-black text-slate-300 uppercase tracking-widest bg-white/50 px-3 py-1 rounded-full border border-slate-100">
                      Entrada de texto bruto
                    </div>
                  </div>
                  
                  <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex items-start gap-3">
                    <AlertCircle className="text-amber-500 shrink-0 mt-0.5" size={18} />
                    <p className="text-xs text-amber-800 leading-relaxed">
                      <b>Dica:</b> Você pode copiar o texto diretamente do aplicativo do seu banco ou PDF. A IA identificará os valores, datas e sugerirá as categorias.
                    </p>
                  </div>

                  <button 
                    disabled={!importText.trim() || isProcessing}
                    onClick={handleImportStatement}
                    className={`
                      w-full py-4 rounded-[1.5rem] font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-xl
                      ${isProcessing ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-slate-900 text-white hover:bg-emerald-600 hover:shadow-emerald-200'}
                    `}
                  >
                    {isProcessing ? <Loader2 size={20} className="animate-spin" /> : <Sparkles size={20} />}
                    {isProcessing ? 'Processando Dados...' : 'Analisar com Inteligência Artificial'}
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs">Revisão de Lançamentos ({pendingTransactions.length})</h4>
                    <button onClick={() => setPendingTransactions([])} className="text-rose-500 text-[10px] font-black uppercase hover:underline">Limpar e Recomeçar</button>
                  </div>
                  
                  <div className="space-y-3">
                    {pendingTransactions.map((pt, idx) => (
                      <div key={idx} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-sm border ${pt.type === 'INCOME' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-rose-50 border-rose-100 text-rose-600'}`}>
                            {pt.type === 'INCOME' ? <Plus size={18}/> : <Trash2 size={18}/>}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-800 line-clamp-1">{pt.description}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[10px] font-black text-slate-400 uppercase">{new Date(pt.date).toLocaleDateString('pt-BR')}</span>
                              <span className={`text-xs font-black ${pt.type === 'INCOME' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                R$ {pt.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="shrink-0">
                          <select 
                            className="w-full sm:w-48 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500"
                            value={pt.categoryId}
                            onChange={(e) => updatePendingCategory(idx, e.target.value)}
                          >
                            {CATEGORIES.filter(c => c.type === pt.type).map(cat => (
                              <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-6 border-t border-slate-100 flex gap-4">
                    <button 
                      onClick={() => setPendingTransactions([])}
                      className="flex-1 py-4 bg-slate-100 text-slate-600 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-slate-200 transition-all"
                    >
                      Cancelar
                    </button>
                    <button 
                      onClick={confirmImport}
                      className="flex-[2] py-4 bg-emerald-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-emerald-700 shadow-xl shadow-emerald-100 transition-all flex items-center justify-center gap-2"
                    >
                      <Check size={18} /> Confirmar Importação
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Manual Add Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200 border border-slate-100">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-emerald-600 text-white">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-xl"><Plus size={24}/></div>
                <h3 className="text-xl font-black">Novo Lançamento</h3>
              </div>
              <button onClick={() => setShowAddForm(false)} className="hover:bg-white/20 p-2 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <button 
                  type="button"
                  onClick={() => setNewTransaction({...newTransaction, type: 'EXPENSE', categoryId: CATEGORIES.find(c => c.type === 'EXPENSE')?.id || '5'})}
                  className={`py-4 rounded-2xl font-black text-xs uppercase tracking-widest border-2 transition-all flex items-center justify-center gap-2 ${newTransaction.type === 'EXPENSE' ? 'bg-rose-50 border-rose-500 text-rose-700' : 'bg-slate-50 border-transparent text-slate-400'}`}
                >
                  <ArrowRightLeft size={16} /> Despesa
                </button>
                <button 
                  type="button"
                  onClick={() => setNewTransaction({...newTransaction, type: 'INCOME', categoryId: CATEGORIES.find(c => c.type === 'INCOME')?.id || '1'})}
                  className={`py-4 rounded-2xl font-black text-xs uppercase tracking-widest border-2 transition-all flex items-center justify-center gap-2 ${newTransaction.type === 'INCOME' ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-slate-50 border-transparent text-slate-400'}`}
                >
                  <Sparkles size={16} /> Receita
                </button>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Descrição</label>
                  <input 
                    required
                    type="text" 
                    className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/30 transition-all font-bold text-slate-700"
                    placeholder="Ex: Aluguel, Supermercado..."
                    value={newTransaction.description}
                    onChange={e => setNewTransaction({...newTransaction, description: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Valor</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">R$</span>
                      <input 
                        required
                        type="number" 
                        step="0.01"
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/30 transition-all font-bold text-slate-700"
                        placeholder="0.00"
                        value={newTransaction.amount || ''}
                        onChange={e => setNewTransaction({...newTransaction, amount: parseFloat(e.target.value)})}
                      />
                    </div>
                  </div>
                   <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Data</label>
                    <input 
                      type="date" 
                      className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/30 transition-all font-bold text-slate-700"
                      value={newTransaction.date}
                      onChange={e => setNewTransaction({...newTransaction, date: e.target.value})}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Categoria</label>
                    <select 
                      className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/30 transition-all font-bold text-slate-700"
                      value={newTransaction.categoryId}
                      onChange={e => setNewTransaction({...newTransaction, categoryId: e.target.value})}
                    >
                      {CATEGORIES.filter(c => c.type === newTransaction.type).map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Pagamento</label>
                    <select 
                      className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/30 transition-all font-bold text-slate-700"
                      value={newTransaction.paymentMethod}
                      onChange={e => setNewTransaction({...newTransaction, paymentMethod: e.target.value as PaymentMethod})}
                    >
                      <option value="CREDIT_CARD">Cartão Crédito</option>
                      <option value="DEBIT_CARD">Cartão Débito</option>
                      <option value="PIX">PIX</option>
                      <option value="CASH">Dinheiro</option>
                      <option value="TRANSFER">Transferência</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button type="submit" className="w-full bg-slate-900 hover:bg-emerald-600 text-white font-black text-xs uppercase tracking-[0.2em] py-5 rounded-[1.5rem] transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2 active:scale-95">
                  <Check size={18}/> Salvar Lançamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Transactions Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden mb-24 lg:mb-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                <th className="px-8 py-6">Data</th>
                <th className="px-8 py-6">Descrição</th>
                <th className="px-8 py-6">Categoria</th>
                <th className="px-8 py-6">Meio</th>
                <th className="px-8 py-6">Valor</th>
                <th className="px-8 py-6 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length > 0 ? (
                filtered.map((t) => {
                  const category = CATEGORIES.find(c => c.id === t.categoryId);
                  return (
                    <tr key={t.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-8 py-6">
                        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                          {new Date(t.date).toLocaleDateString('pt-BR')}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="font-bold text-slate-800 text-sm">{t.description}</div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-tighter mt-0.5">{t.status === 'PAID' ? 'Liquidado' : 'Pendente'}</div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="flex items-center gap-2.5 px-3 py-1.5 bg-white border border-slate-100 rounded-xl shadow-sm w-fit">
                          <span className="text-lg">{category?.icon}</span>
                          <span className="text-xs font-bold text-slate-600">{category?.name}</span>
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2 text-slate-500">
                           <span className="text-[10px] font-black uppercase tracking-tighter">{t.paymentMethod.replace('_', ' ')}</span>
                        </div>
                      </td>
                      <td className={`px-8 py-6 font-black text-sm text-right ${t.type === 'INCOME' ? 'text-emerald-600' : 'text-rose-600'}`}>
                        <div className="flex items-center justify-end gap-1.5">
                          {t.type === 'INCOME' ? <Plus size={14}/> : <Trash2 size={14} className="opacity-0"/>}
                          R$ {t.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </div>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <button 
                          onClick={() => onDelete(t.id)}
                          className="text-slate-300 hover:text-rose-600 p-2.5 hover:bg-rose-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                          title="Remover Transação"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-8 py-24 text-center">
                    <div className="flex flex-col items-center gap-4 text-slate-300">
                      <Search size={48} className="opacity-20" />
                      <div>
                        <p className="font-black text-slate-400 uppercase tracking-widest text-lg">Sem resultados</p>
                        <p className="text-xs font-medium">Tente ajustar sua busca ou importar um extrato.</p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Transactions;
