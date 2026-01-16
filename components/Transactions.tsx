
import React, { useState, useMemo } from 'react';
import { Transaction, Category, PaymentMethod, TransactionType, TransactionStatus, RecurringFrequency } from '../utils/types';
import { processFinancialStatement } from '../utils/gemini';
import { 
  Search, Plus, Trash2, Sparkles, X, Check, Loader2, Repeat, Edit2, Zap, Calendar, ArrowRightLeft, AlertCircle
} from 'lucide-react';

interface TransactionsProps {
  transactions: Transaction[];
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  onAdd: (t: Omit<Transaction, 'id'>) => void;
  onUpdate: (t: Transaction | Transaction[]) => void;
  onDelete: (id: string) => void;
}

type UpdateMode = 'SINGLE' | 'FUTURE' | 'ALL';

const Transactions: React.FC<TransactionsProps> = ({ transactions, categories, setCategories, onAdd, onUpdate, onDelete }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTransactionId, setEditingTransactionId] = useState<string | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importText, setImportText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [pendingTransactions, setPendingTransactions] = useState<Omit<Transaction, 'id'>[]>([]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | TransactionType>('ALL');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  
  const [updateMode, setUpdateMode] = useState<UpdateMode>('SINGLE');

  const initialTransactionState: Partial<Transaction> = {
    description: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    type: 'EXPENSE',
    categoryId: '',
    status: 'PAID',
    paymentMethod: 'DEBIT_CARD',
    isRecurring: false,
    frequency: 'NONE',
    installments: 1,
    notes: '',
    seriesId: null
  };

  const [formData, setFormData] = useState<Partial<Transaction>>(initialTransactionState);

  const filtered = useMemo(() => {
    return transactions.filter(t => {
      const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterType === 'ALL' || t.type === filterType;
      const matchesCategory = filterCategory === 'ALL' || t.categoryId === filterCategory;
      return matchesSearch && matchesFilter && matchesCategory;
    });
  }, [transactions, searchTerm, filterType, filterCategory]);

  const handleEdit = (t: Transaction) => {
    setFormData({ ...t });
    setEditingTransactionId(t.id);
    setUpdateMode('SINGLE');
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
      if (editingTransactionId) {
        if (formData.isRecurring && formData.seriesId && updateMode !== 'SINGLE') {
          // Lógica de atualização em massa
          const updates: Transaction[] = [];
          transactions.forEach(t => {
            if (t.seriesId === formData.seriesId) {
              const isFuture = new Date(t.date) >= new Date(formData.date!);
              if (updateMode === 'ALL' || (updateMode === 'FUTURE' && isFuture)) {
                updates.push({
                  ...t,
                  description: formData.description!,
                  amount: formData.amount!,
                  categoryId: formData.categoryId!,
                  paymentMethod: formData.paymentMethod!,
                });
              }
            }
          });
          onUpdate(updates);
        } else {
          onUpdate(formData as Transaction);
        }
      } else {
        const payload = { ...formData } as Omit<Transaction, 'id'>;
        if (payload.isRecurring) {
          payload.seriesId = `series_${Date.now()}`;
        }
        onAdd(payload);
      }
      setShowAddForm(false);
      setFormData(initialTransactionState);
    }
  };

  const categoriesForCurrentType = categories.filter(c => c.type === (formData.type || 'EXPENSE'));

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Barra de Busca e Filtros */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar lançamentos..." 
            className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all shadow-sm font-bold text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button onClick={handleOpenNew} className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-2 shadow-xl shadow-emerald-500/20 active:scale-95 transition-all">
          <Plus size={18} /> Novo Lançamento
        </button>
      </div>

      {/* Tabela de Transações */}
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-50 dark:border-slate-800 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <th className="px-8 py-6">Data</th>
                <th className="px-8 py-6">Descrição</th>
                <th className="px-8 py-6">Categoria</th>
                <th className="px-8 py-6">Valor</th>
                <th className="px-8 py-6 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {filtered.map(t => (
                <tr key={t.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-8 py-6 text-xs font-bold text-slate-500">{new Date(t.date).toLocaleDateString('pt-BR')}</td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="text-sm font-black dark:text-white">{t.description}</span>
                      {t.isRecurring && (
                        <span className="flex items-center gap-1 text-[8px] font-black text-emerald-500 uppercase mt-1">
                          <Repeat size={10} /> Série inteligente ativa
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-[10px] font-black uppercase text-slate-500 tracking-widest">
                      {categories.find(c => c.id === t.categoryId)?.name || 'Outros'}
                    </span>
                  </td>
                  <td className={`px-8 py-6 text-sm font-black ${t.type === 'INCOME' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    R$ {t.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEdit(t)} className="p-2 text-slate-400 hover:text-emerald-500 transition-colors"><Edit2 size={16}/></button>
                      <button onClick={() => onDelete(t.id)} className="p-2 text-slate-400 hover:text-rose-500 transition-colors"><Trash2 size={16}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Formulário */}
      {showAddForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in duration-300">
            <div className={`p-8 ${formData.type === 'INCOME' ? 'bg-emerald-600' : 'bg-rose-600'} text-white flex justify-between items-center`}>
              <h3 className="text-lg font-black uppercase tracking-widest">{editingTransactionId ? 'Ajustar Lançamento' : 'Novo Lançamento'}</h3>
              <button onClick={() => setShowAddForm(false)} className="hover:rotate-90 transition-transform"><X size={24}/></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Descrição</label>
                  <input required className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-2xl font-bold dark:text-white" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Valor (R$)</label>
                  <input required type="number" step="0.01" className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-2xl font-black text-lg dark:text-white" value={formData.amount || ''} onChange={e => setFormData({...formData, amount: parseFloat(e.target.value)})} />
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                <Repeat size={20} className={formData.isRecurring ? 'text-emerald-500' : 'text-slate-300'} />
                <div className="flex-1">
                  <p className="text-[10px] font-black uppercase text-slate-600 dark:text-slate-400">Repetir Lançamento</p>
                  <p className="text-[9px] font-bold text-slate-400">Gera parcelas automáticas baseadas na frequência</p>
                </div>
                <button type="button" onClick={() => setFormData({...formData, isRecurring: !formData.isRecurring})} className={`w-10 h-5 rounded-full p-1 transition-all ${formData.isRecurring ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                  <div className={`w-3 h-3 bg-white rounded-full transition-transform ${formData.isRecurring ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>

              {/* Seletor de Inteligência de Recorrência (Apenas Edição) */}
              {editingTransactionId && formData.isRecurring && formData.seriesId && (
                <div className="p-5 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl border border-emerald-100 dark:border-emerald-800/50 space-y-4">
                  <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                    <AlertCircle size={16} />
                    <p className="text-[10px] font-black uppercase tracking-widest">Escopo da Alteração</p>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    <UpdateModeBtn active={updateMode === 'SINGLE'} onClick={() => setUpdateMode('SINGLE')} label="Apenas esta parcela" desc="Mantém o histórico e o futuro intactos." />
                    <UpdateModeBtn active={updateMode === 'FUTURE'} onClick={() => setUpdateMode('FUTURE')} label="Esta e próximas" desc="Reajusta o valor de hoje em diante." />
                    <UpdateModeBtn active={updateMode === 'ALL'} onClick={() => setUpdateMode('ALL')} label="Toda a série" desc="Aplica a todos os meses (passado e futuro)." />
                  </div>
                </div>
              )}

              <button className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest text-xs text-white shadow-xl hover:-translate-y-1 transition-all active:scale-95 ${formData.type === 'INCOME' ? 'bg-emerald-600' : 'bg-rose-600'}`}>
                {editingTransactionId ? 'Salvar Alteração' : 'Confirmar Lançamento'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const UpdateModeBtn = ({ active, onClick, label, desc }: any) => (
  <button type="button" onClick={onClick} className={`text-left p-3 rounded-xl border-2 transition-all ${active ? 'border-emerald-500 bg-white dark:bg-slate-800 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'}`}>
    <p className="text-[10px] font-black uppercase dark:text-white">{label}</p>
    <p className="text-[8px] font-bold text-slate-400 leading-none mt-1">{desc}</p>
  </button>
);

export default Transactions;
