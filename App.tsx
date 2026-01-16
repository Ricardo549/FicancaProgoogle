
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, History, Target, TrendingUp, Calculator, Settings as SettingsIcon,
  LogOut, Menu, X, Shield, Star, Lock, Loader2
} from 'lucide-react';
import { Transaction, Account, FinancialGoal, Investment, Category, User, AppConfig } from './utils/types';
import { INITIAL_ACCOUNTS, CATEGORIES as INITIAL_CATEGORIES } from './constants';
import Dashboard from './components/Dashboard';
import Transactions from './components/Transactions';
import Planning from './components/Planning';
import Investments from './components/Investments';
import CreditSimulator from './components/CreditSimulator';
import Auth from './components/Auth';
import Settings from './components/Settings';
import PrivacyPolicy from './components/PrivacyPolicy';
import Admin from './components/Admin';
import Checkout from './components/Checkout';

type View = 'dashboard' | 'transactions' | 'planning' | 'investments' | 'credit' | 'settings' | 'privacy' | 'admin' | 'checkout';

const ADMIN_EMAIL = 'ricardobm647@gmail.com';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [isSyncing, setIsSyncing] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [user, setUser] = useState<User | null>(() => {
    try {
      return JSON.parse(localStorage.getItem('fpro_user') || 'null');
    } catch {
      return null;
    }
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    return JSON.parse(localStorage.getItem('fpro_tx') || '[]');
  });
  
  const [goals, setGoals] = useState<FinancialGoal[]>(() => {
    return JSON.parse(localStorage.getItem('fpro_goals') || '[]');
  });

  const [investments, setInvestments] = useState<Investment[]>([]);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);

  const [config, setConfig] = useState<AppConfig>(() => {
    try {
      const saved = localStorage.getItem('fin_config');
      return saved ? JSON.parse(saved) : {
        theme: 'light',
        fontFamily: 'Inter',
        language: 'pt-BR',
        currency: 'BRL',
        privacyMode: false,
        notifications: true
      };
    } catch {
      return { theme: 'light', fontFamily: 'Inter', language: 'pt-BR', currency: 'BRL', privacyMode: false, notifications: true };
    }
  });

  useEffect(() => {
    localStorage.setItem('fpro_tx', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('fpro_goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    if (user) localStorage.setItem('fpro_user', JSON.stringify(user));
    else localStorage.removeItem('fpro_user');
    localStorage.setItem('fin_config', JSON.stringify(config));
  }, [user, config]);

  useEffect(() => {
    document.body.style.fontFamily = `'${config.fontFamily}', sans-serif`;
    if (config.theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [config.fontFamily, config.theme]);

  const handleUpdateTransaction = (updated: Transaction | Transaction[]) => {
    if (Array.isArray(updated)) {
      setTransactions(prev => {
        const next = [...prev];
        updated.forEach(u => {
          const idx = next.findIndex(t => t.id === u.id);
          if (idx !== -1) next[idx] = u;
        });
        return next;
      });
    } else {
      setTransactions(prev => prev.map(t => t.id === updated.id ? updated : t));
    }
  };

  if (!user) return <Auth onLogin={setUser} />;

  const userPlan = user.plan || 'free';
  const isAdmin = user.email === ADMIN_EMAIL;

  const menu = [
    { id: 'dashboard', label: 'Painel Geral', icon: <LayoutDashboard size={20}/> },
    { id: 'transactions', label: 'Fluxo de Caixa', icon: <History size={20}/> },
    { id: 'planning', label: 'Metas e Sonhos', icon: <Target size={20}/> },
    { id: 'investments', label: 'Investimentos', icon: <TrendingUp size={20}/> },
    { id: 'credit', label: 'Simulador Crédito', icon: <Calculator size={20}/> },
    { id: 'settings', label: 'Ajustes', icon: <SettingsIcon size={20}/> },
    { id: 'privacy', label: 'Privacidade', icon: <Shield size={20}/> },
  ];

  const handleNavigate = (view: View) => {
    setActiveView(view);
    setIsMobileMenuOpen(false);
  };

  const SidebarContent = ({ onToggleClose }: { onToggleClose?: () => void }) => (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800">
      <div className="p-8 pb-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 transform hover:scale-105 transition-transform duration-300">
            <span className="text-white font-black text-xl">F</span>
          </div>
          <div>
            <h1 className="text-lg font-black text-slate-800 dark:text-white leading-none tracking-tighter">
              Finanzo<span className="text-emerald-600">Pro</span>
            </h1>
          </div>
        </div>
        {onToggleClose && (
          <button onClick={onToggleClose} className="lg:hidden p-2 text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        )}
      </div>
      
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto no-scrollbar">
        {menu.map(item => (
          <button 
            key={item.id} 
            onClick={() => handleNavigate(item.id as View)} 
            className={`w-full group flex items-center gap-4 px-4 py-3.5 rounded-2xl text-[13px] font-bold transition-all duration-300 ${
              activeView === item.id 
                ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-500/20 translate-x-1' 
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <div className={`transition-transform duration-300 group-hover:scale-110 ${activeView === item.id ? 'text-white' : 'text-slate-400 dark:text-slate-500'}`}>
              {item.icon}
            </div>
            <span className="flex-1 text-left tracking-tight">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-6 pt-4 mt-auto border-t border-slate-50 dark:border-slate-800 space-y-2">
        {isAdmin && (
          <button 
            onClick={() => handleNavigate('admin')} 
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-[12px] font-bold transition-all duration-300 ${
              activeView === 'admin' 
                ? 'bg-amber-600 text-white shadow-lg' 
                : 'text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/10'
            }`}
          >
            <Lock size={18} /> Administração
          </button>
        )}
        <button 
          onClick={() => setUser(null)} 
          className="w-full flex items-center gap-4 px-4 py-3 text-[12px] font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/10 rounded-2xl transition-all duration-300"
        >
          <LogOut size={18} /> Sair do Sistema
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden text-slate-900 dark:text-slate-100">
      <aside className="hidden lg:block w-72 shrink-0 h-full overflow-hidden">
        <SidebarContent />
      </aside>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px]" onClick={() => setIsMobileMenuOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-[280px] bg-white dark:bg-slate-900 shadow-2xl animate-in slide-in-from-left duration-300 ease-out">
            <SidebarContent onToggleClose={() => setIsMobileMenuOpen(false)} />
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <header className="h-16 shrink-0 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 lg:px-8 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-emerald-50 active:scale-90 transition-all">
              <Menu size={20}/>
            </button>
            <div className="flex items-center gap-2">
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                {menu.find(m => m.id === activeView)?.label || 'Visão Geral'}
              </h2>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             {userPlan === 'pro' && (
               <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-500 rounded-full border border-amber-500/20">
                 <Star size={12} className="fill-amber-500" />
                 <span className="text-[9px] font-black uppercase tracking-widest">Premium</span>
               </div>
             )}
             <div className="flex items-center gap-3">
               <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center border border-emerald-200 dark:border-emerald-800 shadow-sm">
                 <span className="text-sm font-black text-emerald-600">{user.name.charAt(0)}</span>
               </div>
             </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-5 lg:p-10 no-scrollbar bg-slate-50/50 dark:bg-slate-950/50">
          <div className="max-w-6xl mx-auto pb-10">
            {activeView === 'dashboard' && <Dashboard transactions={transactions} goals={goals} accounts={INITIAL_ACCOUNTS} categories={categories} userPlan={userPlan} />}
            {activeView === 'transactions' && <Transactions transactions={transactions} categories={categories} setCategories={setCategories} onAdd={(t) => setTransactions(prev => [ { ...t, id: Date.now().toString() }, ...prev ])} onDelete={(id) => setTransactions(prev => prev.filter(t => t.id !== id))} onUpdate={handleUpdateTransaction} />}
            {activeView === 'planning' && <Planning goals={goals} setGoals={setGoals} transactions={transactions} />}
            {activeView === 'investments' && <Investments userId={user.id} investments={investments} setInvestments={setInvestments} userPlan={userPlan} />}
            {activeView === 'credit' && <CreditSimulator />}
            {activeView === 'settings' && <Settings user={user} setUser={setUser} config={config} setConfig={setConfig} categories={categories} setCategories={setCategories} navigateToPrivacy={() => handleNavigate('privacy')} />}
            {activeView === 'privacy' && <PrivacyPolicy onBack={() => handleNavigate('dashboard')} />}
            {activeView === 'checkout' && <Checkout onCancel={() => handleNavigate('dashboard')} onSuccess={() => { setUser({...user, plan: 'pro'}); handleNavigate('dashboard'); }} user={user} />}
            {activeView === 'admin' && isAdmin && <Admin />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
