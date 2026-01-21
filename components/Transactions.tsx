
import React, { useState, useMemo, useEffect } from 'react';
import { Transaction, Category, PaymentMethod, TransactionType, TransactionStatus, RecurringFrequency, Account } from '../utils/types';
import { 
  Search, Plus, Trash2, X, Repeat, Edit2, Zap, Calendar, 
  AlertCircle, FileText, Tag, CreditCard, Clock, Wallet
} from 'lucide-react';

interface TransactionsProps {
  transactions: Transaction[];
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  onAdd: (t: Omit<Transaction, 'id'>) => void;
  onUpdate: (t: Transaction | Transaction[]) => void;
  onDelete: (id: string) => void;
  accounts?: Account[]; // Adicionado para permitir seleção de conta
}

type UpdateMode = 'SINGLE' | 'FUTURE' | 'ALL';

const Transactions: React.FC<TransactionsProps> = ({ 
  transactions, 
  categories, 
  setCategories, 
  onAdd, 
  onUpdate, 
  onDelete,
  accounts = [] 
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTransactionId, setEditingTransactionId] = useState<string | null>(null);
  const [viewingTransaction, setViewingTransaction] = useState<Transaction | null>(null);
  
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
    accountId: accounts[0]?.id || '',
    status: 'PAID',
    paymentMethod: 'DEBIT_CARD',
    isRecurring: false,
    notes: '',
    seriesId: null
  };

  const [formData, setFormData] = useState<Partial<Transaction>>(initialTransactionState);

  // Filtragem inteligente de categorias para o formulário
  const categoriesForCurrentType = useMemo(() => {
    return categories.filter(c => c.type === formData.type);
  }, [categories, formData.type]);

  // Atualiza a categoria padrão quando o tipo muda no formulário
  useEffect(() => {
    if (showAddForm && !editingTransactionId) {
      const firstValidCat = categoriesForCurrentType[0]?.id || '';
      setFormData(prev => ({ ...prev, categoryId: firstValidCat }));
    }
  }, [formData.type, categoriesForCurrentType, showAddForm, editingTransactionId]);

  const filtered = useMemo(() => {
    return transactions.filter(t => {
      const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterType === 'ALL' || t.type === filterType;
      const matchesCategory = filterCategory === 'ALL' || t.categoryId === filterCategory;
      return matchesSearch && matchesFilter && matchesCategory;
    });
  }, [transactions, searchTerm, filterType, filterCategory]);

  const handleEdit = (t: Transaction, e: React.MouseEvent) => {
    e.stopPropagation();
    setFormData({ ...t });
    setEditingTransactionId(t.id);
    setUpdateMode('SINGLE');
    setShowAddForm(true);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Deseja realmente excluir este lançamento?')) {
      onDelete(id);
    }
  };

  const handleOpenNew = () => {
    setFormData({
      ...initialTransactionState,
      categoryId: categories.find(c => c.type === 'EXPENSE')?.id || '',
      accountId: accounts[0]?.id || ''
    });
    setEditingTransactionId(null);
    setShowAddForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.description && formData.amount && formData.categoryId && formData.accountId) {
      if (editingTransactionId) {
        if (formData.isRecurring && formData.seriesId && updateMode !== 'SINGLE') {
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
                  accountId: formData.accountId!,
                  paymentMethod: formData.paymentMethod!,
                  notes: formData.notes
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

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
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
                <tr 
                  key={t.id} 
                  onClick={() => setViewingTransaction(t)}
                  className="group hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                >
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
                      <button onClick={(e) => handleEdit(t, e)} className="p-2 text-slate-400 hover:text-emerald-500 transition-colors"><Edit2 size={16}/></button>
                      <button onClick={(e) => handleDelete(t.id, e)} className="p-2 text-slate-400 hover:text-rose-500 transition-colors"><Trash2 size={16}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Detalhes da Transação */}
      {viewingTransaction && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4" onClick={() => setViewingTransaction(null)}>
          <div 
            className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in duration-300 border border-slate-200 dark:border-slate-800"
            onClick={e => e.stopPropagation()}
          >
            <div className={`p-10 ${viewingTransaction.type === 'INCOME' ? 'bg-emerald-600' : 'bg-rose-600'} text-white relative`}>
              <button onClick={() => setViewingTransaction(null)} className="absolute top-6 right-6 p-2 hover:bg-white/20 rounded-full transition-all">
                <X size={24}/>
              </button>
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80">
                  {viewingTransaction.type === 'INCOME' ? 'Entrada Registrada' : 'Saída Registrada'}
                </p>
                <h3 className="text-3xl font-black tracking-tight">{viewingTransaction.description}</h3>
              </div>
              <div className="mt-8">
                <p className="text-4xl font-black">R$ {viewingTransaction.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              </div>
            </div>

            <div className="p-10 space-y-8">
              <div className="grid grid-cols-2 gap-8">
                <DetailItem icon={<Calendar size={18}/>} label="Data" value={new Date(viewingTransaction.date).toLocaleDateString('pt-BR', { dateStyle: 'long' })} />
                <DetailItem 
                  icon={<Tag size={18}/>} 
                  label="Categoria" 
                  value={categories.find(c => c.id === viewingTransaction.categoryId)?.name || 'Não definida'} 
                />
                <DetailItem icon={<CreditCard size={18}/>} label="Pagamento" value={viewingTransaction.paymentMethod || '--'} />
                <DetailItem 
                  icon={<Clock size={18}/>} 
                  label="Status" 
                  value={viewingTransaction.status === 'PAID' ? 'Liquidado' : 'Pendente'} 
                  color={viewingTransaction.status === 'PAID' ? 'text-emerald-500' : 'text-amber-500'}
                />
              </div>

              {viewingTransaction.notes && (
                <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-3">
                  <div className="flex items-center gap-2 text-slate-400">
                    <FileText size={16} />
                    <p className="text-[10px] font-black uppercase tracking-widest">Anotações Internas</p>
                  </div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-300 leading-relaxed italic">
                    "{viewingTransaction.notes}"
                  </p>
                </div>
              )}

              <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex gap-3">
                <button 
                  onClick={(e) => { handleEdit(viewingTransaction, e); setViewingTransaction(null); }}
                  className="flex-1 py-4 bg-slate-900 dark:bg-slate-800 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
                >
                  <Edit2 size={14}/> Editar Lançamento
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Formulário (Add/Edit) */}
      {showAddForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in duration-300 border border-white/10">
            <div className={`p-8 ${formData.type === 'INCOME' ? 'bg-emerald-600' : 'bg-rose-600'} text-white flex justify-between items-center`}>
              <h3 className="text-lg font-black uppercase tracking-widest">{editingTransactionId ? 'Ajustar Lançamento' : 'Novo Lançamento'}</h3>
              <button onClick={() => setShowAddForm(false)} className="hover:rotate-90 transition-transform"><X size={24}/></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Tipo</label>
                  <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                    <button type="button" onClick={() => setFormData({...formData, type: 'EXPENSE'})} className={`flex-1 py-2 text-[10px] font-black uppercase rounded-lg transition-all ${formData.type === 'EXPENSE' ? 'bg-white dark:bg-slate-700 text-rose-600 shadow-sm' : 'text-slate-400'}`}>Despesa</button>
                    <button type="button" onClick={() => setFormData({...formData, type: 'INCOME'})} className={`flex-1 py-2 text-[10px] font-black uppercase rounded-lg transition-all ${formData.type === 'INCOME' ? 'bg-white dark:bg-slate-700 text-emerald-600 shadow-sm' : 'text-slate-400'}`}>Receita</button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Conta / Origem</label>
                  <select 
                    required
                    className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-2xl font-bold dark:text-white outline-none"
                    value={formData.accountId}
                    onChange={e => setFormData({...formData, accountId: e.target.value})}
                  >
                    {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Descrição</label>
                  <input required className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-2xl font-bold dark:text-white outline-none focus:ring-2 focus:ring-emerald-500/20" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Valor (R$)</label>
                  <input required type="number" step="0.01" className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-2xl font-black text-lg dark:text-white outline-none focus:ring-2 focus:ring-emerald-500/20" value={formData.amount || ''} onChange={e => setFormData({...formData, amount: parseFloat(e.target.value)})} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Categoria</label>
                  <select 
                    required
                    className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-2xl font-bold dark:text-white outline-none"
                    value={formData.categoryId}
                    onChange={e => setFormData({...formData, categoryId: e.target.value})}
                  >
                    {categoriesForCurrentType.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
                    {categoriesForCurrentType.length === 0 && <option value="">Nenhuma categoria</option>}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Data</label>
                  <input type="date" className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-2xl font-bold dark:text-white outline-none" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                </div>
              </div>

              <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Notas Adicionais</label>
                  <textarea 
                    rows={2}
                    className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-2xl font-medium dark:text-white outline-none focus:ring-2 focus:ring-emerald-500/20 resize-none" 
                    placeholder="Ex: Referente ao serviço X..."
                    value={formData.notes || ''} 
                    onChange={e => setFormData({...formData, notes: e.target.value})}
                  />
              </div>

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

const DetailItem = ({ icon, label, value, color }: any) => (
  <div className="space-y-1">
    <div className="flex items-center gap-2 text-slate-400">
      {icon}
      <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
    </div>
    <p className={`text-sm font-black dark:text-white ${color || 'text-slate-800'}`}>{value}</p>
  </div>
);

export default Transactions;
