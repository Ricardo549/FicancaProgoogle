
import React, { useState } from 'react';
import { 
  User, Monitor, Lock, Check, RefreshCw, Sun, Moon, Type, ShieldAlert, Tag, Trash2, Plus, X
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

const Settings: React.FC<SettingsProps> = ({ user, setUser, config, setConfig, categories, setCategories, navigateToPrivacy }) => {
  const [activeTab, setActiveTab] = useState('perfil');
  const [isSaving, setIsSaving] = useState(false);

  const handleUpdate = (key: string, val: any) => {
    setIsSaving(true);
    setConfig({ ...config, [key]: val });
    setTimeout(() => setIsSaving(false), 500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-500">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black tracking-tight">Preferências</h2>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Personalize sua experiência</p>
        </div>
        {isSaving && <RefreshCw size={16} className="animate-spin text-emerald-500" />}
      </header>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-64 shrink-0 bg-white dark:bg-slate-900 p-2 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-1 h-fit">
          <TabBtn active={activeTab === 'perfil'} onClick={() => setActiveTab('perfil')} icon={<User size={16}/>} label="Perfil" />
          <TabBtn active={activeTab === 'visual'} onClick={() => setActiveTab('visual')} icon={<Monitor size={16}/>} label="Visual" />
          <TabBtn active={activeTab === 'seguranca'} onClick={() => setActiveTab('seguranca')} icon={<Lock size={16}/>} label="Segurança" />
        </aside>

        <main className="flex-1 space-y-8">
          {activeTab === 'perfil' && (
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 space-y-8">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-3xl bg-slate-100 dark:bg-slate-800 border-4 border-white dark:border-slate-800 shadow-xl flex items-center justify-center text-2xl font-black text-slate-300">
                  {user.name.charAt(0)}
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-black">{user.name}</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{user.email}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'visual' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 space-y-6">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tema do App</p>
                <div className="flex gap-4">
                  <button onClick={() => handleUpdate('theme', 'light')} className={`flex-1 p-6 rounded-3xl border-2 flex flex-col items-center gap-2 transition-all ${config.theme === 'light' ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20' : 'border-slate-100 dark:border-slate-800'}`}>
                    <Sun size={20} className="text-amber-500" />
                    <span className="text-[10px] font-black uppercase">Claro</span>
                  </button>
                  <button onClick={() => handleUpdate('theme', 'dark')} className={`flex-1 p-6 rounded-3xl border-2 flex flex-col items-center gap-2 transition-all ${config.theme === 'dark' ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20' : 'border-slate-100 dark:border-slate-800'}`}>
                    <Moon size={20} className="text-blue-500" />
                    <span className="text-[10px] font-black uppercase">Escuro</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'seguranca' && (
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 space-y-6">
              <button 
                onClick={navigateToPrivacy}
                className="w-full flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border dark:border-slate-700 hover:bg-slate-100 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <ShieldAlert size={20} className="text-slate-400 group-hover:text-emerald-500" />
                  <div className="text-left">
                    <p className="text-xs font-black uppercase tracking-widest">Política de Privacidade</p>
                    <p className="text-[10px] text-slate-400 font-bold mt-0.5">Gestão de Dados FinanzoPro</p>
                  </div>
                </div>
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

const TabBtn = ({ active, onClick, icon, label }: any) => (
  <button onClick={onClick} className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${active ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/10' : 'text-slate-400 hover:bg-slate-50'}`}>
    {icon} {label}
  </button>
);

export default Settings;
