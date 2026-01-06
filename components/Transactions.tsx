
import React, { useState } from 'react';
import { Transaction, Category, PaymentMethod, TransactionType, TransactionStatus, RecurringFrequency } from '../types';
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
  ArrowRightLeft,
  RefreshCcw,
  Repeat,
  Calendar,
  CreditCard,
  ChevronRight,
  Zap,
  Filter,
  Edit2,
  StickyNote,
  Clock
} from 'lucide-react';

interface TransactionsProps {
  transactions: Transaction[];
  // Added categories to props to match App.tsx and fix the Gemini service call
  categories: Category[];
  onAdd: (t: Omit<Transaction, 'id'>) => void;
  onUpdate: (t: Transaction) => void;
  onDelete: (id: string) => void;
}

const Transactions: React.FC<TransactionsProps> = ({ transactions, categories, onAdd, onUpdate, onDelete }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTransactionId, setEditingTransactionId] = useState<string | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importText, setImportText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [pendingTransactions, setPendingTransactions] = useState<Omit<Transaction, 'id'>[]>([]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | TransactionType>('ALL');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  const initialTransactionState: Partial<Transaction> = {
    description: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    type: 'EXPENSE',
    categoryId: categories.find(c => c.type === 'EXPENSE')?.id || '5',
    status: 'PAID',
    paymentMethod: 'DEBIT_CARD',
    isRecurring: false,
    frequency: 'MONTHLY',
    notes: ''
  };

  const [formData, setFormData] = useState<Partial<Transaction>>(initialTransactionState);

  const filtered = transactions.filter(t => {
    const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (t.notes?.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filterType === 'ALL' || t.type === filterType;
    const matchesCategory = filterCategory === 'ALL' || t.categoryId === filterCategory;
    return matchesSearch && matchesFilter && matchesCategory;
  });

  const handleEdit = (t: Transaction) => {
    setFormData({ ...t, notes: t.notes || '', frequency: t.frequency || 'MONTHLY' });
    setEditingTransactionId(t.id);
    setShowAddForm(true);
  };

  const handleOpenNew = () => {
    setFormData(initialTransactionState);
    setEditingTransactionId(null);
    setShowAddForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.description && formData.amount) {
      const finalData = {
        ...formData,
        frequency: formData.isRecurring ? formData.frequency : 'NONE'
      };
      if (editingTransactionId) {
        onUpdate(finalData as Transaction);
      } else {
        onAdd(finalData as Omit<Transaction, 'id'>);
      }
      setShowAddForm(false);
      setFormData(initialTransactionState);
      setEditingTransactionId(null);
    }
  };

  const handleImportStatement = async () => {
    if (!importText.trim()) return;
    setIsProcessing(true);
    try {
      // Fix: Passed categories as the second argument to processFinancialStatement
      const extracted = await processFinancialStatement(importText, categories);
      const mapped = extracted.map((t: any) => ({
        ...t,
        amount: Math.abs(t.amount),
        status: 'PAID',
        paymentMethod: 'TRANSFER',
        isRecurring: false,
        notes: t.notes || '',
        frequency: 'NONE'
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

  // Filtrar categorias baseadas no tipo selecionado para o dropdown de filtro
  const availableCategoriesForFilter = categories.filter(c => filterType === 'ALL' || c.type === filterType);

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      {/* Search & Actions Bar */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar lançamentos ou notas..." 
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-[1.25rem] focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all shadow-sm font-medium text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap lg:flex-nowrap gap-2 w-full lg:w-auto">
          <select 
            className="flex-1 lg:flex-none px-4 py-4 bg-white border border-slate-200 rounded-[1.25rem] outline-none text-[10px] font-black uppercase tracking-widest shadow-sm appearance-none cursor-pointer min-w-[120px]"
            value={filterType}
            onChange={(e) => {
              setFilterType(e.target.value as any);
              setFilterCategory('ALL'); // Resetar categoria ao mudar tipo
            }}
          >
            <option value="ALL">Tipos</option>
            <option value="INCOME">Receitas</option>
            <option value="EXPENSE">Despesas</option>
          </select>

          <select 
            className="flex-1 lg:flex-none px-4 py-4 bg-white border border-slate-200 rounded-[1.25rem] outline-none text-[10px] font-black uppercase tracking-widest shadow-sm appearance-none cursor-pointer min-w-[150px]"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="ALL">Categorias</option>
            {availableCategoriesForFilter.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>

          <button 
            onClick={() => setShowImportModal(true)}
            className="p-4 bg-slate-900 text-white rounded-[1.25rem] hover:bg-slate-800 transition-all shadow-lg active:scale-95 flex items-center justify-center"
            title="Importar Extrato"
          >
            <Sparkles size={20} />
          </button>
          
          <button 
            onClick={handleOpenNew}
            className="flex-grow lg:flex-none flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-4 rounded-[1.25rem] font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-emerald-100 active:scale-95"
          >
            <Plus size={18} /> Novo
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="space-y-4">
        {/* Mobile View: Cards (Hidden on Desktop) */}
        <div className="grid grid-cols-1 gap-4 lg:hidden">
          {filtered.length > 0 ? (
            filtered.map((t) => {
              const category = categories.find(c => c.id === t.categoryId);
              return (
                <div key={t.id} className="bg-white p-5 rounded-[1.5rem] border border-slate-200 shadow-sm flex flex-col gap-3 group active:scale-[0.98] transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-2xl w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100">
                        {category?.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-slate-800 text-sm leading-tight">{t.description}</p>
                          {t.isRecurring && <Repeat size={12} className="text-emerald-500" />}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            {new Date(t.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                          </span>
                          <span className="w-1 h-1 bg-slate-200 rounded-full" />
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.paymentMethod.replace('_', ' ')}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end gap-1">
                      <p className={`font-black text-sm ${t.type === 'INCOME' ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {t.type === 'INCOME' ? '+' : '-'} R$ {t.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                  
                  {t.notes && (
                    <div className="px-3 py-2 bg-slate-50 rounded-xl flex items-start gap-2 border border-slate-100">
                       <StickyNote size={12} className="text-slate-400 mt-0.5 shrink-0" />
                       <p className="text-[10px] font-medium text-slate-500 italic leading-tight line-clamp-2">{t.notes}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-50">
                      <button onClick={() => handleEdit(t)} className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-emerald-600 transition-colors">
                          <Edit2 size={12} /> Editar
                      </button>
                      <button onClick={() => onDelete(t.id)} className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-rose-600 transition-colors">
                          <Trash2 size={12} /> Excluir
                      </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-20 text-center bg-white rounded-[2.5rem] border border-dashed border-slate-200">
                <Search className="mx-auto text-slate-200 mb-4" size={48} />
                <p className="text-slate-400 font-bold">Nenhum lançamento encontrado</p>
            </div>
          )}
        </div>

        {/* Desktop View: Table (Hidden on Mobile) */}
        <div className="hidden lg:block bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                <th className="px-8 py-6">Data</th>
                <th className="px-8 py-6">Descrição</th>
                <th className="px-8 py-6">Categoria</th>
                <th className="px-8 py-6">Meio</th>
                <th className="px-8 py-6 text-right">Valor</th>
                <th className="px-8 py-6 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((t) => {
                const category = categories.find(c => c.id === t.categoryId);
                return (
                  <tr key={t.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                        {new Date(t.date).toLocaleDateString('pt-BR')}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-800 text-sm">{t.description}</span>
                          {t.isRecurring && <Repeat size={12} className="text-emerald-500" />}
                        </div>
                        {t.notes && (
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium italic">
                            <StickyNote size={10} /> {t.notes.substring(0, 40)}{t.notes.length > 40 ? '...' : ''}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="flex items-center gap-2.5 px-3 py-1.5 bg-white border border-slate-100 rounded-xl shadow-sm w-fit text-xs font-bold text-slate-600">
                        {category?.icon} {category?.name}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-[10px] font-black uppercase text-slate-400">{t.paymentMethod.replace('_', ' ')}</span>
                    </td>
                    <td className={`px-8 py-6 font-black text-sm text-right ${t.type === 'INCOME' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      R$ {t.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-8 py-6 text-center">
                      <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                        <button onClick={() => handleEdit(t)} className="text-slate-300 hover:text-emerald-600 p-2.5 hover:bg-emerald-50 rounded-xl transition-all">
                          <Edit2 size={18} />
                        </button>
                        <button onClick={() => onDelete(t.id)} className="text-slate-300 hover:text-rose-600 p-2.5 hover:bg-rose-50 rounded-xl transition-all">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals: Mobile Optimized */}
      {showAddForm && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom sm:zoom-in duration-300">
            <div className={`p-6 sm:p-8 ${editingTransactionId ? 'bg-indigo-600' : 'bg-emerald-600'} text-white flex justify-between items-center`}>
              <h3 className="text-xl font-black">{editingTransactionId ? 'Editar Lançamento' : 'Novo Lançamento'}</h3>
              <button onClick={() => setShowAddForm(false)} className="p-2 hover:bg-white/20 rounded-full transition-all"><X size={24}/></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 max-h-[85vh] overflow-y-auto no-scrollbar">
              {/* Seletor de Tipo */}
              <div className="grid grid-cols-2 gap-3">
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, type: 'EXPENSE', categoryId: categories.find(c => c.type === 'EXPENSE')?.id || '5'})}
                  className={`py-4 rounded-2xl font-black text-xs uppercase tracking-widest border-2 transition-all ${formData.type === 'EXPENSE' ? 'bg-rose-50 border-rose-500 text-rose-700' : 'bg-slate-50 border-transparent text-slate-400'}`}
                >
                  Despesa
                </button>
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, type: 'INCOME', categoryId: categories.find(c => c.type === 'INCOME')?.id || '1'})}
                  className={`py-4 rounded-2xl font-black text-xs uppercase tracking-widest border-2 transition-all ${formData.type === 'INCOME' ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-slate-50 border-transparent text-slate-400'}`}
                >
                  Receita
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Valor (R$)</label>
                    <input required type="number" step="0.01" value={formData.amount || ''} onChange={e => setFormData({...formData, amount: parseFloat(e.target.value)})} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-700" placeholder="0,00" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Data</label>
                    <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-700" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Descrição</label>
                  <input required type="text" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-700" placeholder="Ex: Supermercado" />
                </div>

                {/* Recurrence Fields */}
                <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Repeat size={18} className={formData.isRecurring ? "text-emerald-500" : "text-slate-300"} />
                      <div>
                        <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest leading-none">Recorrência</p>
                        <p className="text-[9px] text-slate-400 font-medium">Repetir transação automaticamente</p>
                      </div>
                    </div>
                    <button 
                      type="button"
                      onClick={() => setFormData({...formData, isRecurring: !formData.isRecurring})}
                      className={`w-12 h-6 rounded-full p-1 transition-all ${formData.isRecurring ? 'bg-emerald-500' : 'bg-slate-300'}`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full transition-transform ${formData.isRecurring ? 'translate-x-6' : 'translate-x-0'}`} />
                    </button>
                  </div>

                  {formData.isRecurring && (
                    <div className="space-y-1.5 animate-in slide-in-from-top-2 duration-300">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-1">
                        <Clock size={12} /> Frequência de Repetição
                      </label>
                      <select 
                        value={formData.frequency} 
                        onChange={e => setFormData({...formData, frequency: e.target.value as RecurringFrequency})}
                        className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl font-bold text-slate-700 appearance-none cursor-pointer"
                      >
                        <option value="WEEKLY">Semanal</option>
                        <option value="MONTHLY">Mensal</option>
                        <option value="YEARLY">Anual</option>
                      </select>
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Observações (Opcional)</label>
                  <textarea 
                    rows={2} 
                    value={formData.notes || ''} 
                    onChange={e => setFormData({...formData, notes: e.target.value})} 
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-700 resize-none outline-none focus:ring-2 focus:ring-emerald-500/20" 
                    placeholder="Adicione detalhes extras aqui..."
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Categoria</label>
                    <select value={formData.categoryId} onChange={e => setFormData({...formData, categoryId: e.target.value})} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-700 appearance-none">
                      {categories.filter(c => c.type === formData.type).map(cat => <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Pagamento</label>
                    <select value={formData.paymentMethod} onChange={e => setFormData({...formData, paymentMethod: e.target.value as PaymentMethod})} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-700 appearance-none">
                      <option value="CREDIT_CARD">Cartão Crédito</option>
                      <option value="DEBIT_CARD">Cartão Débito</option>
                      <option value="PIX">PIX</option>
                      <option value="TRANSFER">Transferência</option>
                      <option value="CASH">Dinheiro</option>
                    </select>
                  </div>
                </div>
              </div>

              <button type="submit" className={`w-full py-5 ${editingTransactionId ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-slate-900 hover:bg-emerald-600'} text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2`}>
                <Check size={18}/> {editingTransactionId ? 'Atualizar Lançamento' : 'Salvar Lançamento'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Import Modal: Full Screen Mobile */}
      {showImportModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in duration-300">
                <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Sparkles className="text-emerald-400" size={20} />
                        <h3 className="text-lg font-black uppercase tracking-widest">Leitor de Extrato IA</h3>
                    </div>
                    <button onClick={() => setShowImportModal(false)}><X size={24}/></button>
                </div>
                <div className="p-6 overflow-y-auto">
                    {pendingTransactions.length === 0 ? (
                        <div className="space-y-4">
                            <textarea 
                                className="w-full h-48 p-4 bg-slate-50 border border-slate-200 rounded-2xl font-mono text-sm resize-none outline-none focus:ring-2 focus:ring-emerald-500"
                                placeholder="Cole aqui o texto do seu extrato..."
                                value={importText}
                                onChange={e => setImportText(e.target.value)}
                            />
                            <button 
                                onClick={handleImportStatement}
                                disabled={isProcessing || !importText}
                                className="w-full py-4 bg-emerald-600 text-white font-black uppercase tracking-widest rounded-2xl disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isProcessing ? <Loader2 className="animate-spin" size={20} /> : <Zap size={20}/>}
                                Analisar com IA
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {pendingTransactions.map((pt, i) => (
                                <div key={i} className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between">
                                    <div className="text-xs">
                                        <p className="font-bold text-slate-800">{pt.description}</p>
                                        <p className="text-slate-400 font-black uppercase tracking-tighter">R$ {pt.amount.toLocaleString('pt-BR')}</p>
                                    </div>
                                    <Check className="text-emerald-500" size={18}/>
                                </div>
                            ))}
                            <button onClick={confirmImport} className="w-full py-4 bg-emerald-600 text-white font-black uppercase rounded-2xl mt-4">Importar Todos</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;
