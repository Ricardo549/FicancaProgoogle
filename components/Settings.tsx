
import React, { useState } from 'react';
import { 
  User, Monitor, Lock, Check, RefreshCw, Sun, Moon, Type, ShieldAlert, Tag, Trash2, Plus, X, Edit3, TrendingUp, ChevronRight
} from 'lucide-react';
import { Category, TransactionType } from '../utils/types';

interface SettingsProps {
  user: any;
  setUser: (user: any) => void;
  config: any;
  setConfig: (config: any) => void;
  categories: Category[];
  setCategories: (categories: Category[]) => void;
  navigateToPrivacy: () => void;
}

const FONTS = [
  { id: 'Inter', name: 'Inter', desc: 'Moderno e legível' },
  { id: 'Roboto', name: 'Roboto', desc: 'Geométrico e amigável' },
  { id: 'Open Sans', name: 'Open Sans', desc: 'Clássico e equilibrado' },
];

const Settings: React.FC<SettingsProps> = ({ user, setUser, config, setConfig, categories, setCategories, navigateToPrivacy }) => {
  const [activeTab, setActiveTab] = useState('perfil');
  const [isSaving, setIsSaving] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null);

  const handleUpdate = (key: string, val: any) => {
    setIsSaving(true);
    setConfig({ ...config, [key]: val });
    setTimeout(() => setIsSaving(false), 500);
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory?.name || !editingCategory?.icon) return;
    
    if (editingCategory.id) {
      setCategories(categories.map(c => c.id === editingCategory.id ? (editingCategory as Category) : c));
    } else {
      const newCat: Category = {
        ...editingCategory as Category,
        id: Date.now().toString(),
        color: editingCategory.color || '#10b981'
      };
      setCategories([...categories, newCat]);
    }
    setIsCategoryModalOpen(false);
    setEditingCategory(null);
  };

  const handleDeleteCategory = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta categoria? Isso não afetará transações existentes, mas a categoria não poderá mais ser selecionada.')) {
      setCategories(categories.filter(c => c.id !== id));
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-500">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-800 dark:text-white">Preferências</h2>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Personalize sua experiência</p>
        </div>
        {isSaving && <RefreshCw size={16} className="animate-spin text-emerald-500" />}
      </header>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-64 shrink-0 bg-white dark:bg-slate-900 p-2 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-1 h-fit shadow-sm">
          <TabBtn active={activeTab === 'perfil'} onClick={() => setActiveTab('perfil')} icon={<User size={16}/>} label="Perfil" />
          <TabBtn active={activeTab === 'categories'} onClick={() => setActiveTab('categories')} icon={<Tag size={16}/>} label="Categorias" />
          <TabBtn active={activeTab === 'visual'} onClick={() => setActiveTab('visual')} icon={<Monitor size={16}/>} label="Visual" />
          <TabBtn active={activeTab === 'seguranca'} onClick={() => setActiveTab('seguranca')} icon={<Lock size={16}/>} label="Segurança" />
        </aside>

        <main className="flex-1 space-y-8">
          {activeTab === 'perfil' && (
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 space-y-8 shadow-sm">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-3xl bg-slate-100 dark:bg-slate-800 border-4 border-white dark:border-slate-800 shadow-xl flex items-center justify-center text-2xl font-black text-slate-300">
                  {user.name.charAt(0)}
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-black dark:text-white">{user.name}</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{user.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-50 dark:border-slate-800">
                 <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Nome Completo</label>
                    <input 
                      type="text" 
                      value={user.name} 
                      onChange={e => setUser({...user, name: e.target.value})}
                      className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold dark:text-white outline-none focus:ring-2 focus:ring-emerald-500/20" 
                    />
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Plano Atual</label>
                    <div className="w-full px-5 py-3.5 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-slate-500 uppercase text-[10px] tracking-widest flex items-center justify-between">
                      {user.plan || 'Free'}
                      <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    </div>
                 </div>
              </div>
            </div>
          )}

          {activeTab === 'categories' && (
            <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
              {['INCOME', 'EXPENSE'].map(type => (
                <section key={type} className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="text-sm font-black dark:text-white uppercase tracking-widest flex items-center gap-2">
                        {type === 'INCOME' ? <TrendingUp size={18} className="text-emerald-500" /> : <TrendingUp size={18} className="text-rose-500 rotate-180" />}
                        Categorias de {type === 'INCOME' ? 'Receita' : 'Despesa'}
                      </h3>
                      <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">Gerencie como você classifica seu fluxo</p>
                    </div>
                    <button 
                      onClick={() => { setEditingCategory({ name: '', icon: '📁', color: '#10b981', type: type as TransactionType }); setIsCategoryModalOpen(true); }}
                      className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
                    >
                      <Plus size={14} /> Adicionar
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categories.filter(c => c.type === type).map(cat => (
                      <div key={cat.id} className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-700 flex items-center gap-4 relative group hover:border-emerald-500/30 transition-all">
                        <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center text-2xl shadow-sm">
                          {cat.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-black uppercase text-slate-700 dark:text-slate-200 truncate">{cat.name}</p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{type === 'INCOME' ? 'Entrada' : 'Saída'}</p>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => { setEditingCategory(cat); setIsCategoryModalOpen(true); }}
                            className="p-2 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-all"
                            title="Editar"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button 
                            onClick={() => handleDeleteCategory(cat.id)}
                            className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-all"
                            title="Excluir"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                    {categories.filter(c => c.type === type).length === 0 && (
                       <div className="col-span-full py-8 text-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-3xl">
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Nenhuma categoria cadastrada</p>
                       </div>
                    )}
                  </div>
                </section>
              ))}
            </div>
          )}

          {activeTab === 'visual' && (
            <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
              <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 space-y-8 shadow-sm">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Aparência do Sistema</p>
                  <div className="flex gap-4">
                    <button onClick={() => handleUpdate('theme', 'light')} className={`flex-1 p-6 rounded-3xl border-2 flex flex-col items-center gap-3 transition-all ${config.theme === 'light' ? 'border-emerald-500 bg-emerald-50/30 dark:bg-emerald-900/10' : 'border-slate-50 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                      <div className="w-10 h-10 bg-white shadow-sm rounded-xl flex items-center justify-center text-amber-500"><Sun size={20} /></div>
                      <span className="text-[10px] font-black uppercase tracking-widest dark:text-white">Modo Claro</span>
                    </button>
                    <button onClick={() => handleUpdate('theme', 'dark')} className={`flex-1 p-6 rounded-3xl border-2 flex flex-col items-center gap-3 transition-all ${config.theme === 'dark' ? 'border-emerald-500 bg-emerald-50/30 dark:bg-emerald-900/10' : 'border-slate-50 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                      <div className="w-10 h-10 bg-slate-800 shadow-sm rounded-xl flex items-center justify-center text-indigo-400"><Moon size={20} /></div>
                      <span className="text-[10px] font-black uppercase tracking-widest dark:text-white">Modo Escuro</span>
                    </button>
                  </div>
                </div>

                <div className="pt-8 border-t border-slate-50 dark:border-slate-800">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Família de Fontes</p>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {FONTS.map(f => (
                        <button 
                          key={f.id} 
                          onClick={() => handleUpdate('fontFamily', f.id)} 
                          className={`p-5 rounded-2xl border-2 text-left transition-all ${config.fontFamily === f.id ? 'border-emerald-500 bg-emerald-50/30 dark:bg-emerald-900/10' : 'border-slate-50 dark:border-slate-800 hover:bg-slate-50'}`}
                        >
                          <p className="font-black text-sm dark:text-white" style={{fontFamily: f.id}}>{f.name}</p>
                          <p className="text-[9px] text-slate-400 font-bold uppercase mt-1">{f.desc}</p>
                        </button>
                      ))}
                   </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'seguranca' && (
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm animate-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-4">
                <SecurityAction icon={<Lock size={18}/>} label="Autenticação em Duas Etapas" desc="Proteção adicional para sua conta" checked={config.mfa} onToggle={() => handleUpdate('mfa', !config.mfa)} />
                <SecurityAction icon={<ShieldAlert size={18}/>} label="Modo de Privacidade" desc="Ocultar valores na tela principal" checked={config.privacyMode} onToggle={() => handleUpdate('privacyMode', !config.privacyMode)} />
              </div>

              <div className="pt-6 border-t border-slate-50 dark:border-slate-800">
                <button 
                  onClick={navigateToPrivacy}
                  className="w-full flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] border dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white dark:bg-slate-700 rounded-xl text-slate-400 group-hover:text-emerald-500 transition-colors shadow-sm">
                      <ShieldAlert size={20} />
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-black uppercase tracking-widest dark:text-white">Diretrizes de Privacidade</p>
                      <p className="text-[10px] text-slate-400 font-bold mt-0.5">Como tratamos seus dados financeiros</p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-slate-300 group-hover:text-slate-600 group-hover:translate-x-1 transition-all" />
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] w-full max-w-md shadow-2xl animate-in zoom-in duration-300 border border-white/10">
            <div className={`p-8 ${editingCategory?.type === 'INCOME' ? 'bg-emerald-600' : 'bg-rose-600'} text-white flex justify-between items-center rounded-t-[2.5rem]`}>
              <h3 className="font-black uppercase tracking-widest">{editingCategory?.id ? 'Editar Categoria' : 'Nova Categoria'}</h3>
              <button onClick={() => setIsCategoryModalOpen(false)} className="hover:rotate-90 transition-transform"><X size={24}/></button>
            </div>
            <form onSubmit={handleSaveCategory} className="p-8 space-y-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Nome da Categoria</label>
                <input 
                  required 
                  type="text" 
                  value={editingCategory?.name} 
                  onChange={e => setEditingCategory({...editingCategory, name: e.target.value})} 
                  className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-2xl font-black dark:text-white outline-none focus:ring-2 focus:ring-emerald-500/20" 
                  placeholder="Ex: Alimentação, Bônus..." 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Ícone (Emoji)</label>
                <input 
                  required 
                  type="text" 
                  value={editingCategory?.icon} 
                  onChange={e => setEditingCategory({...editingCategory, icon: e.target.value})} 
                  className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-2xl text-center text-3xl outline-none" 
                  placeholder="📁" 
                />
              </div>
              <button className={`w-full py-5 ${editingCategory?.type === 'INCOME' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'} text-white font-black uppercase rounded-2xl shadow-xl hover:-translate-y-1 transition-all active:scale-95`}>
                {editingCategory?.id ? 'Salvar Alterações' : 'Criar Categoria'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const SecurityAction = ({ icon, label, desc, checked, onToggle }: any) => (
  <div className="flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border dark:border-slate-700">
    <div className="flex items-center gap-3">
      <div className="text-slate-400 p-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm">{icon}</div>
      <div>
        <p className="text-[11px] font-black dark:text-white uppercase tracking-tight">{label}</p>
        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{desc}</p>
      </div>
    </div>
    <button onClick={onToggle} className={`w-11 h-6 rounded-full p-1 transition-all ${checked ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'}`}>
      <div className={`w-4 h-4 bg-white rounded-full transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'} shadow-sm`} />
    </button>
  </div>
);

const TabBtn = ({ active, onClick, icon, label }: any) => (
  <button onClick={onClick} className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${active ? 'bg-slate-900 dark:bg-emerald-600 text-white shadow-xl shadow-slate-900/10' : 'text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
    {icon} {label}
  </button>
);

export default Settings;
