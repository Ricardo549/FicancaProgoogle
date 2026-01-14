
import React, { useState } from 'react';
import { 
  User, Monitor, Globe, Lock, Check, RefreshCw, Zap, Moon, Sun, 
  Contrast, ShieldCheck, Eye, LogOut, Type, ChevronRight, Fingerprint, 
  Search, Ban, Clock, Plus, Trash2, Tag, Palette, LayoutGrid, TrendingUp, X, ShieldAlert,
  Languages
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

const BANKS = [
  { id: 'itau', name: 'Itaú', color: '#ec7000', text: 'white' },
  { id: 'bradesco', name: 'Bradesco', color: '#cc092f', text: 'white' },
  { id: 'nubank', name: 'Nubank', color: '#8a05be', text: 'white' },
  { id: 'inter', name: 'Inter', color: '#ff7a00', text: 'white' },
  { id: 'santander', name: 'Santander', color: '#ec0000', text: 'white' },
  { id: 'bb', name: 'BB', color: '#fcf000', text: '#0038a8' },
];

const FONTS = [
  { id: 'Inter', name: 'Inter', desc: 'Moderno e legível' },
  { id: 'Roboto', name: 'Roboto', desc: 'Geométrico e amigável' },
  { id: 'Open Sans', name: 'Open Sans', desc: 'Clássico e equilibrado' },
];

const LANGUAGES_LIST = [
  { id: 'pt-BR', name: 'Português', flag: '🇧🇷', label: 'Brasil' },
  { id: 'en-US', name: 'English', flag: '🇺🇸', label: 'United States' },
];

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'];

const Settings: React.FC<SettingsProps> = ({ user, setUser, config, setConfig, categories, setCategories, navigateToPrivacy }) => {
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('perfil');
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null);

  const handleToggle = (key: string) => {
    setConfig((prev: any) => ({ ...prev, [key]: !prev[key] }));
    triggerSaving();
  };

  const handleChange = (key: string, value: any) => {
    setConfig((prev: any) => ({ ...prev, [key]: value }));
    triggerSaving();
  };

  const triggerSaving = () => {
    setSaving(true);
    setTimeout(() => setSaving(false), 800);
  };

  const menu = [
    { id: 'perfil', label: 'Perfil', icon: <User size={18}/> },
    { id: 'categories', label: 'Categorias', icon: <Tag size={18}/> },
    { id: 'finance', label: 'Conexões', icon: <Zap size={18}/> },
    { id: 'visual', label: 'Visual', icon: <Monitor size={18}/> },
    { id: 'security', label: 'Segurança', icon: <Lock size={18}/> },
  ];

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory?.name || !editingCategory?.icon) return;
    if (editingCategory.id) {
      setCategories(categories.map(c => c.id === editingCategory.id ? (editingCategory as Category) : c));
    } else {
      setCategories([...categories, { ...editingCategory, id: Date.now().toString() } as Category]);
    }
    setIsCategoryModalOpen(false);
    setEditingCategory(null);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-32 lg:pb-0 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">Ajustes</h2>
          <p className="text-slate-400 dark:text-slate-500 text-sm font-medium">Configurações globais do sistema</p>
        </div>
        {saving && (
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-full text-[10px] font-black uppercase border border-emerald-100 dark:border-emerald-800 animate-pulse">
            <RefreshCw size={12} className="animate-spin" /> Salvando
          </div>
        )}
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <aside className="lg:col-span-3 space-y-4">
          <div className="bg-white dark:bg-slate-900 p-2 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
            {menu.map(item => (
              <button 
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === item.id ? 'bg-slate-900 dark:bg-emerald-600 text-white shadow-xl' : 'text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
              >
                {item.icon} {item.label}
              </button>
            ))}
          </div>
        </aside>

        <main className="lg:col-span-9 space-y-8">
          {activeTab === 'perfil' && (
            <section className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-8 animate-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-6">
                <img src={user.avatar} className="w-24 h-24 rounded-3xl border-4 border-slate-100 dark:border-slate-800 shadow-lg" alt="Avatar" />
                <div className="space-y-1">
                  <h3 className="text-xl font-black dark:text-white">{user.name}</h3>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{user.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Nome de Exibição</label>
                  <input type="text" value={user.name} onChange={e => setUser({...user, name: e.target.value})} className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold dark:text-white" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">E-mail</label>
                  <input type="email" value={user.email} disabled className="w-full px-5 py-3.5 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-slate-400 cursor-not-allowed" />
                </div>
              </div>
            </section>
          )}

          {activeTab === 'categories' && (
            <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
              {['INCOME', 'EXPENSE'].map(type => (
                <section key={type} className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-sm font-black dark:text-white uppercase tracking-widest flex items-center gap-2">
                      {type === 'INCOME' ? <TrendingUp className="text-emerald-500" /> : <TrendingUp className="text-rose-500 rotate-180" />}
                      Categorias de {type === 'INCOME' ? 'Receita' : 'Despesa'}
                    </h3>
                    <button 
                      onClick={() => { setEditingCategory({ name: '', icon: '📁', color: '#10b981', type: type as TransactionType }); setIsCategoryModalOpen(true); }}
                      className="p-2 bg-slate-900 dark:bg-emerald-600 text-white rounded-xl hover:scale-110 transition-transform"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {categories.filter(c => c.type === type).map(cat => (
                      <div key={cat.id} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 flex flex-col items-center gap-2 relative group">
                        <span className="text-2xl">{cat.icon}</span>
                        <span className="text-[10px] font-black uppercase text-slate-600 dark:text-slate-300 truncate w-full text-center">{cat.name}</span>
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                          <button onClick={() => setCategories(categories.filter(c => c.id !== cat.id))} className="text-rose-500 p-1 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg"><Trash2 size={12}/></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}

          {activeTab === 'finance' && (
            <section className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between mb-8 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-emerald-500 rounded-2xl"><Zap size={20} /></div>
                  <h3 className="text-lg font-black uppercase tracking-widest">Open Finance</h3>
                </div>
                <button 
                  onClick={() => handleToggle('openFinance')}
                  className={`w-12 h-6 rounded-full p-1 transition-all ${config.openFinance ? 'bg-emerald-500' : 'bg-slate-700'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${config.openFinance ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 relative z-10">
                {BANKS.map(bank => (
                  <button 
                    key={bank.id}
                    onClick={() => handleChange('connectedBank', bank.id)}
                    className={`p-5 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${config.connectedBank === bank.id ? 'border-emerald-500 bg-white/10' : 'border-white/5 bg-white/5 hover:bg-white/10'}`}
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black" style={{backgroundColor: bank.color, color: bank.text}}>{bank.name.charAt(0)}</div>
                    <span className="text-[10px] font-black uppercase tracking-widest">{bank.name}</span>
                  </button>
                ))}
              </div>
            </section>
          )}

          {activeTab === 'visual' && (
            <section className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-10 animate-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Temas</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <ThemeCard active={config.theme === 'light'} onClick={() => handleChange('theme', 'light')} icon={<Sun size={18}/>} label="Claro" colors="bg-slate-50" />
                  <ThemeCard active={config.theme === 'dark'} onClick={() => handleChange('theme', 'dark')} icon={<Moon size={18}/>} label="Escuro" colors="bg-slate-900" />
                  <ThemeCard active={config.dynamicDarkMode} onClick={() => handleToggle('dynamicDarkMode')} icon={<Clock size={18}/>} label="Dinâmico" colors="bg-gradient-to-r from-slate-50 to-slate-900" />
                </div>
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tipografia</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {FONTS.map(f => (
                    <button key={f.id} onClick={() => handleChange('fontFamily', f.id)} className={`p-5 rounded-2xl border-2 text-left transition-all ${config.fontFamily === f.id ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'border-slate-100 dark:border-slate-800 hover:bg-slate-50'}`}>
                      <Type size={20} className="mb-2 text-slate-400" />
                      <p className="font-black text-sm dark:text-white" style={{fontFamily: f.id}}>{f.name}</p>
                      <p className="text-[10px] text-slate-400 font-bold">{f.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Idioma do Aplicativo</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {LANGUAGES_LIST.map(lang => (
                    <button 
                      key={lang.id} 
                      onClick={() => handleChange('language', lang.id)} 
                      className={`p-5 rounded-2xl border-2 text-left transition-all flex items-center gap-4 ${config.language === lang.id ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'border-slate-100 dark:border-slate-800 hover:bg-slate-50'}`}
                    >
                      <span className="text-3xl filter grayscale-[0.2]">{lang.flag}</span>
                      <div>
                        <p className="font-black text-sm dark:text-white uppercase tracking-tight">{lang.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{lang.label}</p>
                      </div>
                      {config.language === lang.id && (
                        <div className="ml-auto p-1 bg-emerald-500 text-white rounded-full">
                          <Check size={12} />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </section>
          )}

          {activeTab === 'security' && (
            <section className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 animate-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-4">
                <SecurityAction icon={<Fingerprint size={18}/>} label="Autenticação Biométrica" desc="Exigir digital ao abrir" checked={config.mfa} onToggle={() => handleToggle('mfa')} />
                <SecurityAction icon={<Eye size={18}/>} label="Modo Privado" desc="Ocultar saldos sensíveis" checked={config.privacyMode} onToggle={() => handleToggle('privacyMode')} />
              </div>

              <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                <button 
                  onClick={navigateToPrivacy}
                  className="w-full flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white dark:bg-slate-700 rounded-xl text-slate-400 group-hover:text-emerald-500 transition-colors">
                      <ShieldAlert size={20} />
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-black dark:text-white uppercase tracking-widest">Política de Privacidade</p>
                      <p className="text-[10px] text-slate-400 font-bold">Resumo FinanzoPro | Inforric Nexus</p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-slate-300 group-hover:text-slate-600 transition-all" />
                </button>
              </div>
            </section>
          )}
        </main>
      </div>

      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] w-full max-w-md shadow-2xl animate-in zoom-in duration-300">
            <div className="p-8 bg-slate-900 dark:bg-slate-800 text-white flex justify-between items-center rounded-t-[2.5rem]">
              <h3 className="font-black uppercase tracking-widest">Gerenciar Categoria</h3>
              <button onClick={() => setIsCategoryModalOpen(false)}><X size={24}/></button>
            </div>
            <form onSubmit={handleSaveCategory} className="p-8 space-y-6">
              <input required type="text" value={editingCategory?.name} onChange={e => setEditingCategory({...editingCategory, name: e.target.value})} className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-2xl font-black dark:text-white" placeholder="Nome" />
              <input required type="text" value={editingCategory?.icon} onChange={e => setEditingCategory({...editingCategory, icon: e.target.value})} className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-2xl text-center text-2xl" placeholder="Emoji" />
              <button className="w-full py-5 bg-emerald-600 text-white font-black uppercase rounded-2xl shadow-xl hover:scale-[1.02] transition-all">Salvar</button>
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
      <div className="text-slate-400">{icon}</div>
      <div><p className="text-xs font-black dark:text-white">{label}</p><p className="text-[10px] text-slate-400 font-bold">{desc}</p></div>
    </div>
    <button onClick={onToggle} className={`w-10 h-5 rounded-full p-1 transition-all ${checked ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}`}>
      <div className={`w-3 h-3 bg-white rounded-full transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  </div>
);

const ThemeCard = ({ active, onClick, icon, label, colors }: any) => (
  <button onClick={onClick} className={`p-6 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-3 ${active ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800/50 hover:bg-slate-50'}`}>
    <div className={`w-10 h-10 rounded-xl ${colors} flex items-center justify-center text-slate-500`}>{icon}</div>
    <span className="text-[10px] font-black uppercase dark:text-white">{label}</span>
  </button>
);

export default Settings;
