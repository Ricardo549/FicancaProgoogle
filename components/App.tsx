
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, History, Target, TrendingUp, Calculator, Settings as SettingsIcon,
  LogOut, Menu, X, PlusCircle, ChevronRight, User as UserIcon, Shield, Star, Lock, Sparkles, Loader2
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
  
  const [user, setUser] = useState<User | null>(() => {
    try {
      return JSON.parse(localStorage.getItem('fpro_user') || 'null');
    } catch {
      return null;
    }
  });

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [goals, setGoals] = useState<FinancialGoal[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  // Fetch all data from PHP API when user is logged in
  useEffect(() => {
    if (user) {
      loadAllData();
    }
  }, [user]);

  const loadAllData = async () => {
    if (!user) return;
    setIsSyncing(true);
    try {
      // Fetch Transactions
      const txRes = await fetch(`./api/transactions.php?userId=${user.id}`);
      if (txRes.ok) {
        const data = await txRes.json();
        if (Array.isArray(data)) setTransactions(data);
      }

      // Fetch Goals
      const goalRes = await fetch(`./api/goals.php?userId=${user.id}`);
      if (goalRes.ok) {
        const data = await goalRes.json();
        if (Array.isArray(data)) setGoals(data);
      }
    } catch (error) {
      console.warn("PHP API not reachable, using local storage fallback.");
      const savedTx = localStorage.getItem('fpro_tx');
      if (savedTx) setTransactions(JSON.parse(savedTx));
      const savedGoals = localStorage.getItem('fpro_goals');
      if (savedGoals) setGoals(JSON.parse(savedGoals));
    } finally {
      setIsSyncing(false);
    }
  };

  const handleAddTransaction = async (newT: Omit<Transaction, 'id'>) => {
    if (!user) return;
    const txId = Date.now().toString();
    const fullTx = { ...newT, id: txId, userId: user.id } as Transaction;
    
    setTransactions(prev => [fullTx, ...prev]);

    try {
      await fetch(`./api/transactions.php?userId=${user.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fullTx)
      });
    } catch (error) {
      console.error("Sync error with PHP:", error);
      localStorage.setItem('fpro_tx', JSON.stringify([fullTx, ...transactions]));
    }
  };

  const handleUpdateTransaction = async (updated: Transaction) => {
    if (!user) return;
    setTransactions(prev => prev.map(t => t.id === updated.id ? updated : t));
    try {
      await fetch(`./api/transactions.php?userId=${user.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
    } catch (error) {
      console.error("Update sync error:", error);
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    if (!user) return;
    setTransactions(prev => prev.filter(t => t.id !== id));
    try {
      await fetch(`./api/transactions.php?userId=${user.id}&id=${id}`, { method: 'DELETE' });
    } catch (error) {
      console.error("Delete sync error:", error);
    }
  };

  const handleSetGoals = async (updatedGoals: FinancialGoal[] | ((prev: FinancialGoal[]) => FinancialGoal[])) => {
    if (!user) return;
    const nextGoals = typeof updatedGoals === 'function' ? updatedGoals(goals) : updatedGoals;
    setGoals(nextGoals);
    
    // Simplificado: Para uma meta específica adicionada, faríamos o POST. 
    // Em um sistema real, Planning.tsx chamaria uma função de onAddGoal.
    localStorage.setItem('fpro_goals', JSON.stringify(nextGoals));
  };

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

  if (!user) return <Auth onLogin={setUser} />;

  const userPlan = user.plan || 'free';
  const isAdmin = user.email === ADMIN_EMAIL;

  const menu = [
    { id: 'dashboard', label: 'Painel Geral', icon: <LayoutDashboard size={20}/> },
    { id: 'transactions', label: 'Extrato de Fluxo', icon: <History size={20}/> },
    { id: 'planning', label: 'Metas e Sonhos', icon: <Target size={20}/> },
    { id: 'investments', label: 'Estratégia & Investir', icon: <TrendingUp size={20}/> },
    { id: 'credit', label: 'Simulador Crédito', icon: <Calculator size={20}/> },
    { id: 'settings', label: 'Configurações', icon: <SettingsIcon size={20}/> },
    { id: 'privacy', label: 'Privacidade', icon: <Shield size={20}/> },
  ];

  if (isAdmin) menu.push({ id: 'admin', label: 'Administração', icon: <Lock size={20}/> });

  const handleNavigate = (view: View) => {
    setActiveView(view);
    setIsMobileMenuOpen(false);
  };

  const renderContent = () => {
    switch(activeView) {
      case 'dashboard': return <Dashboard transactions={transactions} goals={goals} accounts={INITIAL_ACCOUNTS} categories={categories} userPlan={userPlan} />;
      case 'transactions': return <Transactions transactions={transactions} categories={categories} setCategories={setCategories} onAdd={handleAddTransaction} onDelete={handleDeleteTransaction} onUpdate={handleUpdateTransaction} />;
      case 'planning': return <Planning goals={goals} setGoals={handleSetGoals} transactions={transactions} />;
      case 'investments': return <Investments userId={user.id} investments={investments} setInvestments={setInvestments} userPlan={userPlan} />;
      case 'credit': return <CreditSimulator />;
      case 'settings': return <Settings user={user} setUser={setUser} config={config} setConfig={setConfig} categories={categories} setCategories={setCategories} navigateToPrivacy={() => handleNavigate('privacy')} />;
      case 'privacy': return <PrivacyPolicy onBack={() => handleNavigate('dashboard')} />;
      case 'checkout': return <Checkout onCancel={() => handleNavigate('dashboard')} onSuccess={() => { setUser({...user, plan: 'pro'}); handleNavigate('dashboard'); }} user={user} />;
      case 'admin': return isAdmin ? <Admin /> : null;
      default: return null;
    }
  };

  const SidebarContent = () => (
    <>
      <div className="p-8 flex items-center gap-4 shrink-0">
        <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-2xl">
          <span className="text-white font-black text-2xl">F</span>
        </div>
        <div>
          <h1 className="text-xl font-black text-slate-800 dark:text-white leading-none">Finanzo<span className="text-emerald-600">Pro</span></h1>
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Sincronização PHP</p>
        </div>
      </div>
      
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto no-scrollbar">
        {menu.map(item => (
          <button 
            key={item.id} 
            onClick={() => handleNavigate(item.id as View)} 
            className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-sm font-bold transition-all ${
              activeView === item.id 
                ? 'bg-emerald-600 text-white shadow-lg' 
                : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            {item.icon} <span className="flex-1 text-left">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-6 mt-auto">
        <button onClick={() => setUser(null)} className="w-full flex items-center gap-4 px-4 py-4 text-xs font-black uppercase text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-2xl transition-all">
          <LogOut size={18} /> Sair do Sistema
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950">
      <aside className="hidden lg:flex w-80 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex-col">
        <SidebarContent />
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 px-8 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 bg-slate-100 dark:bg-slate-800 rounded-xl"><Menu size={20}/></button>
            <h2 className="text-xl font-black dark:text-white">{menu.find(m => m.id === activeView)?.label || 'Visão'}</h2>
            {isSyncing && <Loader2 size={14} className="animate-spin text-emerald-500 ml-2" />}
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-black dark:text-white">{user.name}</p>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Sessão {userPlan === 'pro' ? 'Premium' : 'Básica'}</p>
            </div>
            <img src={user.avatar} className="w-10 h-10 rounded-xl border-2 border-white dark:border-slate-800 shadow-md" alt="User" />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 lg:p-12 no-scrollbar">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
