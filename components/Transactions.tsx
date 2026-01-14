
import React, { useState } from 'react';
import { Transaction, Category, PaymentMethod, TransactionType, TransactionStatus, RecurringFrequency } from '../utils/types';
import { CATEGORIES } from '../constants';
import { processFinancialStatement } from '../utils/gemini';
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
  Clock,
  Tag,
  Palette,
  Save,
  CheckCircle,
  Repeat1,
  History as HistoryIcon
} from 'lucide-react';

interface TransactionsProps {
  transactions: Transaction[];
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  onAdd: (t: Omit<Transaction, 'id'>) => void;
  onUpdate: (t: Transaction) => void;
  onDelete: (id: string) => void;
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'];

const Transactions: React.FC<TransactionsProps> = ({ transactions, categories, setCategories, onAdd, onUpdate, onDelete }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTransactionId, setEditingTransactionId] = useState<string | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [importText, setImportText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [pendingTransactions, setPendingTransactions] = useState<Omit<Transaction, 'id'>[]>([]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | TransactionType>('ALL');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const initialTransactionState: Partial<Transaction> = {
    description: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    type: 'EXPENSE',
    categoryId: '',
    status: 'PAID',
    paymentMethod: 'DEBIT_CARD',
    isRecurring: false,
    frequency: 'MONTHLY',
    installments: 1,
    notes: ''
  };

  const [formData, setFormData] = useState<Partial<Transaction>>(initialTransactionState);

  const [newCatData, setNewCatData] = useState<Partial<Category>>({
    name: '',
    icon: '📂',
    color: '#10b981',
    type: 'EXPENSE'
  });

  const filtered = transactions.filter(t => {
    const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (t.notes?.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filterType === 'ALL' || t.type === filterType;
    const matchesCategory = filterCategory === 'ALL' || t.categoryId === filterCategory;
    
    const transactionDate = t.date;
    const matchesStartDate = !startDate || transactionDate >= startDate;
    const matchesEndDate = !endDate || transactionDate <= endDate;
    
    return matchesSearch && matchesFilter && matchesCategory && matchesStartDate && matchesEndDate;
  });

  const handleEdit = (t: Transaction) => {
    setFormData({ 
      ...t, 
      notes: t.notes || '', 
      frequency: t.frequency || 'MONTHLY',
      installments: t.installments || 1 
    });
    setEditingTransactionId(t.id);
    setShowAddForm(true);
  };

  const handleOpenNew = () => {
    setFormData({
      ...initialTransactionState,
      categoryId: categories.find(c => c.type === 'EXPENSE')?.id || ''
    });
    setEditingTransactionId(null);
    setShowAddForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.description && formData.amount && formData.categoryId) {
      const finalData = {
        ...formData,
        frequency: formData.isRecurring ? formData.frequency : 'NONE',
        installments: formData.isRecurring ? formData.installments : 1
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

  const handleAddQuickCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCatData.name && newCatData.icon) {
      const newCategory: Category = {
        ...newCatData as Category,
        id: Date.now().toString(),
        type: formData.type as TransactionType
      };
      setCategories(prev => [...prev, newCategory]);
      setFormData(prev => ({ ...prev, categoryId: newCategory.id }));
      setShowAddCategoryModal(false);
      setNewCatData({ name: '', icon: '📂', color: '#10b981', type: 'EXPENSE' });
    }
  };

  const handleImportStatement = async () => {
    if (!importText.trim()) return;
    setIsProcessing(true);
    try {
      const extracted = await processFinancialStatement(importText, categories);
      const mapped = extracted.map((t: any) => ({
        ...t,
        amount: Math.abs(t.amount),
        status: 'PAID',
        paymentMethod: 'TRANSFER',
        isRecurring: false,
        notes: t.notes || '',
        frequency: 'NONE',
        installments: 1
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

  const handleAddIndividualPending = (index: number) => {
    const t = pendingTransactions[index];
    onAdd(t);
    const newList = pendingTransactions.filter((_, i) => i !== index);
    setPendingTransactions(newList);
    if (newList.length === 0) {
      setImportText('');
      setShowImportModal(false);
    }
  };

  const availableCategoriesForFilter = categories.filter(c => filterType === 'ALL' || c.type === filterType);
  const categoriesForCurrentType = categories.filter(c => c.type === (formData.type || 'EXPENSE'));

  return (
    <div className="space-y-6 pb-20 lg:pb-0 animate-in fade-in duration-500">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar lançamentos ou notas..." 
              className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[1.25rem] focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all shadow-sm font-medium text-sm dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap lg:flex-nowrap gap-2 w-full lg:w-auto">
            <select 
              className="flex-1 lg:flex-none px-4 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[1.25rem] outline-none text-[10px] font-black uppercase tracking-widest shadow-sm appearance-none cursor-pointer min-w-[120px] dark:text-white"
              value={filterType}
              onChange={(e) => {
                setFilterType(e.target.value as any);
                setFilterCategory('ALL');
              }}
            >
              <option value="ALL">Tipos</option>
              <option value="INCOME">Receitas</option>
              <option value="EXPENSE">Despesas</option>
            </select>

            <select 
              className="flex-1 lg:flex-none px-4 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[1.25rem] outline-none text-[10px] font-black uppercase tracking-widest shadow-sm appearance-none cursor-pointer min-w-[150px] dark:text-white"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="ALL">Categorias</option>
              {availableCategoriesForFilter.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
              ))}
            </select>

            <button 
              onClick={() => setShowImportModal(true)}
              className="p-4 bg-slate-900 dark:bg-slate-800 text-white rounded-[1.25rem] hover:bg-slate-800 dark:hover:bg-slate-700 transition-all shadow-lg active:scale-95 flex items-center justify-center"
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
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-50 dark:border-slate-800">
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Data</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Descrição</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Categoria</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Valor</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {filtered.map((t) => {
                const category = categories.find(c => c.id === t.categoryId);
                return (
                  <tr key={t.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-8 py-6">
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        {new Date(t.date).toLocaleDateString('pt-BR')}
                      </p>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-slate-900 dark:text-white tracking-tight">{t.description}</span>
                        {t.isRecurring && (
                          <span className="flex items-center gap-1 text-[8px] font-black text-indigo-500 uppercase mt-1">
                            <Repeat size={10} /> Recorrente ({t.frequency}) {t.installments && t.installments > 1 && `• ${t.installments} meses`}
                          </span>
                        )}
                        {t.notes && (
                          <span className="text-[10px] text-slate-400 font-medium italic truncate max-w-[200px] mt-0.5">{t.notes}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <span className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-lg">{category?.icon || '📂'}</span>
                        <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">{category?.name || 'Outros'}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`text-sm font-black ${t.type === 'INCOME' ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {t.type === 'INCOME' ? '+' : '-'} R$ {t.amount.toLocaleString('pt-BR')}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleEdit(t)}
                          className="p-3 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl transition-all"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => onDelete(t.id)}
                          className="p-3 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-all"
                        >
                          <Trash2 size={16} />
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

      {showAddForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="p-8 bg-emerald-600 text-white flex justify-between items-center">
              <h3 className="text-xl font-black uppercase tracking-tight">{editingTransactionId ? 'Editar Lançamento' : 'Novo Lançamento'}</h3>
              <button onClick={() => setShowAddForm(false)} className="p-2 hover:bg-white/20 rounded-full transition-all"><X size={24}/></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Descrição</label>
                  <input required className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold dark:text-white" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}/>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Valor (R$)</label>
                  <input required type="number" step="0.01" className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-black text-slate-800 dark:text-white" value={formData.amount || ''} onChange={e => setFormData({...formData, amount: parseFloat(e.target.value)})}/>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Data</label>
                  <input required type="date" className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold dark:text-white" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})}/>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Categoria</label>
                  <select required className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold dark:text-white" value={formData.categoryId} onChange={e => setFormData({...formData, categoryId: e.target.value})}>
                    <option value="" disabled>Selecione...</option>
                    {categoriesForCurrentType.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button className="w-full py-5 bg-slate-900 dark:bg-slate-800 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl hover:-translate-y-1 active:scale-95 transition-all">
                {editingTransactionId ? 'Salvar Alterações' : 'Confirmar Lançamento'}
              </button>
            </form>
          </div>
        </div>
      )}

      {showImportModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl w-full max-w-3xl overflow-hidden animate-in zoom-in duration-300">
            <div className="p-8 bg-slate-900 dark:bg-slate-800 text-white flex justify-between items-center">
              <h3 className="text-xl font-black uppercase tracking-tight">Extração por IA</h3>
              <button onClick={() => setShowImportModal(false)}><X size={24}/></button>
            </div>
            
            <div className="p-8 space-y-8">
              {pendingTransactions.length === 0 ? (
                <div className="space-y-6">
                  <textarea rows={8} placeholder="Cole aqui o conteúdo do extrato..." className="w-full p-6 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[2rem] font-mono text-xs text-slate-600 dark:text-slate-300 outline-none" value={importText} onChange={e => setImportText(e.target.value)}/>
                  <button onClick={handleImportStatement} disabled={isProcessing || !importText.trim()} className="w-full py-5 bg-emerald-600 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl flex items-center justify-center gap-3">
                    {isProcessing ? <Loader2 className="animate-spin" size={20}/> : <Zap size={20}/>}
                    Iniciar Processamento Inteligente
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h4 className="font-black text-slate-800 dark:text-white uppercase tracking-widest text-sm">Transações Identificadas ({pendingTransactions.length})</h4>
                  </div>
                  <div className="max-h-[400px] overflow-y-auto space-y-3">
                    {pendingTransactions.map((pt, i) => (
                      <div key={i} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 flex justify-between items-center">
                        <div className="flex items-center gap-4">
                          <span className="text-lg">{categories.find(c => c.id === pt.categoryId)?.icon || '📂'}</span>
                          <div>
                            <p className="text-xs font-black text-slate-800 dark:text-white">{pt.description}</p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase">{new Date(pt.date).toLocaleDateString('pt-BR')}</p>
                          </div>
                        </div>
                        <p className={`text-sm font-black ${pt.type === 'INCOME' ? 'text-emerald-600' : 'text-rose-600'}`}>
                          R$ {pt.amount.toLocaleString('pt-BR')}
                        </p>
                      </div>
                    ))}
                  </div>
                  <button onClick={confirmImport} className="w-full py-5 bg-emerald-600 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl">
                    Salvar Todas as Transações
                  </button>
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
