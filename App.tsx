
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, History, Target, TrendingUp, Calculator, Settings as SettingsIcon,
  LogOut, Menu, X, PlusCircle, ChevronRight, User as UserIcon, Shield, Star, Lock
} from 'lucide-react';
import { Transaction, Account, FinancialGoal, Investment, RecurringFrequency, Category } from './types';
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

type View = 'dashboard' | 'transactions' | 'planning' | 'investments' | 'credit' | 'settings' | 'privacy' | 'admin';

const ADMIN_EMAIL = 'ricardobm647@gmail.com';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [user, setUser] = useState<any>(() => JSON.parse(localStorage.getItem('fpro_user') || 'null'));
  const [transactions, setTransactions] = useState<Transaction[]>(() => JSON.parse(localStorage.getItem('fpro_tx') || '[]'));
  const [goals, setGoals] = useState<FinancialGoal[]>(() => JSON.parse(localStorage.getItem('fpro_goals') || '[]'));
  const [investments, setInvestments] = useState<Investment[]>(() => JSON.parse(localStorage.getItem('fpro_inv') || '[]'));
  const [categories, setCategories] = useState<Category[]>(() => JSON.parse(localStorage.getItem('fpro_categories') || JSON.stringify(INITIAL_CATEGORIES)));
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [config, setConfig] = useState(() => {
    const saved = localStorage.getItem('fin_config');
    return saved ? JSON.parse(saved) : {
      fontSize: 'medium',
      fontFamily: 'Inter',
      language: 'pt-BR',
      openFinance: false,
      autoSync: 'hourly',
      notifications: true,
      theme: 'light',
      dynamicDarkMode: false,
      mfa: false,
      privacyMode: false,
      connectedBank: null
    };
  });

  useEffect(() => {
    localStorage.setItem('fpro_tx', JSON.stringify(transactions));
    localStorage.setItem('fpro_goals', JSON.stringify(goals));
    localStorage.setItem('fpro_inv', JSON.stringify(investments));
    localStorage.setItem('fpro_categories', JSON.stringify(categories));
    if (user) localStorage.setItem('fpro_user', JSON.stringify(user));
    else localStorage.removeItem('fpro_user');
  }, [transactions, goals, investments, user, categories]);

  useEffect(() => {
    document.body.style.fontFamily = `'${config.fontFamily}', sans-serif`;
    if (config.theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    localStorage.setItem('fin_config', JSON.stringify(config));
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

  // Injeção exclusiva do menu Admin
  if (isAdmin) {
    menu.push({ id: 'admin', label: 'Administração', icon: <Lock size={20}/> });
  }

  const renderContent = () => {
    switch(activeView) {
      case 'dashboard': return <Dashboard transactions={transactions} goals={goals} accounts={INITIAL_ACCOUNTS} categories={categories} userPlan={userPlan} />;
      case 'transactions': return <Transactions transactions={transactions} categories={categories} onAdd={(t) => setTransactions([{...t, id: Date.now().toString()}, ...transactions])} onDelete={(id) => setTransactions(transactions.filter(t => t.id !== id))} onUpdate={(updated) => setTransactions(transactions.map(t => t.id === updated.id ? updated : t))} />;
      case 'planning': return <Planning goals={goals} setGoals={setGoals} transactions={transactions} />;
      case 'investments': return <Investments investments={investments} setInvestments={setInvestments} userPlan={userPlan} />;
      case 'credit': return <CreditSimulator />;
      case 'settings': return <Settings user={user} setUser={setUser} config={config} setConfig={setConfig} categories={categories} setCategories={setCategories} navigateToPrivacy={() => setActiveView('privacy')} />;
      case 'privacy': return <PrivacyPolicy onBack={() => setActiveView('dashboard')} />;
      case 'admin': 
        if (!isAdmin) {
            setActiveView('dashboard');
            return null;
        }
        return <Admin />;
      default: return null;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500 overflow-hidden">
      <aside className="hidden lg:flex w-80 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex-col transition-all duration-300">
        <div className="p-8 flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-emerald-200 dark:shadow-emerald-950/20 ring-4 ring-emerald-50 dark:ring-emerald-900/20">
            <span className="text-white font-black text-2xl">F</span>
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-800 dark:text-white leading-none">Finanzo<span className="text-emerald-600">Pro</span></h1>
            <p className="text-[9px] font-black text-slate-300 dark:text-slate-500 uppercase tracking-widest mt-1">Wealth Management</p>
          </div>
        </div>
        
        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto no-scrollbar">
          {menu.map(item => (
            <button 
              key={item.id} 
              onClick={() => setActiveView(item.id as View)} 
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold transition-all duration-200 group ${activeView === item.id ? (item.id === 'admin' ? 'bg-amber-500 shadow-amber-200 dark:shadow-amber-900/10' : 'bg-emerald-600 shadow-emerald-100 dark:shadow-emerald-900/10') + ' text-white shadow-2xl' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
            >
              <span className={`transition-transform duration-300 ${activeView === item.id ? 'scale-110' : 'group-hover:scale-110'}`}>
                {item.icon}
              </span>
              <span className="flex-1 text-left">{item.label}</span>
              {activeView === item.id && <ChevronRight size={14} className="opacity-60" />}
            </button>
          ))}
        </nav>

        <div className="px-6 py-4 mx-4 mb-4 bg-slate-50 dark:bg-slate-800/40 rounded-[2rem] border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3 mb-2">
            {userPlan === 'pro' ? <Star className="text-amber-500" size={16} fill="currentColor"/> : <Shield className="text-slate-400" size={16}/>}
            <span className="text-[10px] font-black uppercase tracking-widest dark:text-white">Plano {userPlan === 'pro' ? 'Premium' : 'Gratuito'}</span>
          </div>
          {userPlan === 'free' && (
            <button className="w-full py-2 bg-indigo-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all">
              Mudar para Pro
            </button>
          )}
        </div>

        <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/20">
          <button onClick={() => setUser(null)} className="w-full flex items-center gap-4 px-5 py-4 text-sm font-black uppercase tracking-widest text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-2xl transition-all border border-transparent hover:border-rose-100 dark:hover:border-rose-900/40">
            <LogOut size={20}/> <span>Encerrar Sessão</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
        <header className="h-20 lg:h-24 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 px-6 lg:px-12 flex items-center justify-between sticky top-0 z-40 transition-all">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-90">
              <Menu size={24}/>
            </button>
            <div className="flex flex-col">
              <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tighter">
                {activeView === 'admin' ? 'Administração Global' : (activeView === 'privacy' ? 'Privacidade' : (menu.find(m => m.id === activeView)?.label.split(' ')[0] || 'Visão'))}
              </h2>
              <div className="flex items-center gap-1">
                 <div className={`w-1.5 h-1.5 rounded-full ${isAdmin ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`}></div>
                 <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{isAdmin ? 'Acesso Root Ativo' : 'Sincronizado'}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-black text-slate-800 dark:text-white leading-none">{user.name}</p>
              <div className="flex items-center justify-end gap-1 mt-1">
                {isAdmin ? (
                  <div className="flex items-center gap-1">
                    <Lock size={10} className="text-amber-500" />
                    <p className="text-[9px] font-black text-amber-600 uppercase tracking-[0.2em]">Global Admin</p>
                  </div>
                ) : userPlan === 'pro' ? (
                  <div className="flex items-center gap-1">
                    <Shield size={10} className="text-emerald-500" />
                    <p className="text-[9px] font-black text-emerald-600 uppercase tracking-[0.2em]">Premium Access</p>
                  </div>
                ) : (
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Free Account</p>
                )}
              </div>
            </div>
            <div className="relative cursor-pointer group" onClick={() => setActiveView('settings')}>
              <img src={user.avatar} className="w-12 h-12 rounded-2xl border-2 border-white dark:border-slate-800 shadow-xl group-hover:ring-4 group-hover:ring-emerald-500/10 transition-all object-cover" alt="User" />
              <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${isAdmin ? 'bg-amber-500' : 'bg-emerald-500'} border-2 border-white dark:border-slate-800 rounded-full shadow-lg`}></div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-12 no-scrollbar">
          <div className="max-w-7xl mx-auto space-y-12">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
