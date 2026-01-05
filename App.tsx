
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, History, Target, TrendingUp, Calculator, Settings as SettingsIcon,
  LogOut, Menu, X, PlusCircle
} from 'lucide-react';
import { Transaction, Account, FinancialGoal, Investment, RecurringFrequency } from './types';
import { INITIAL_ACCOUNTS } from './constants';
import Dashboard from './components/Dashboard';
import Transactions from './components/Transactions';
import Planning from './components/Planning';
import Investments from './components/Investments';
import CreditSimulator from './components/CreditSimulator';
import Auth from './components/Auth';
import Settings from './components/Settings';

type View = 'dashboard' | 'transactions' | 'planning' | 'investments' | 'credit' | 'settings';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [user, setUser] = useState<any>(() => JSON.parse(localStorage.getItem('fpro_user') || 'null'));
  const [transactions, setTransactions] = useState<Transaction[]>(() => JSON.parse(localStorage.getItem('fpro_tx') || '[]'));
  const [goals, setGoals] = useState<FinancialGoal[]>(() => JSON.parse(localStorage.getItem('fpro_goals') || '[]'));
  const [investments, setInvestments] = useState<Investment[]>(() => JSON.parse(localStorage.getItem('fpro_inv') || '[]'));
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('fpro_tx', JSON.stringify(transactions));
    localStorage.setItem('fpro_goals', JSON.stringify(goals));
    localStorage.setItem('fpro_inv', JSON.stringify(investments));
    if (user) localStorage.setItem('fpro_user', JSON.stringify(user));
    else localStorage.removeItem('fpro_user');
  }, [transactions, goals, investments, user]);

  // Motor de Recorrência
  useEffect(() => {
    if (!user || transactions.length === 0) return;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let updated = [...transactions];
    let changed = false;

    transactions.forEach(t => {
      if (t.isRecurring && t.frequency !== 'NONE') {
        let lastDate = new Date(t.lastGeneratedDate || t.date);
        let nextDate = new Date(lastDate);

        const advance = (d: Date, freq: RecurringFrequency) => {
          const n = new Date(d);
          if (freq === 'WEEKLY') n.setDate(n.getDate() + 7);
          else if (freq === 'MONTHLY') n.setMonth(n.getMonth() + 1);
          else if (freq === 'YEARLY') n.setFullYear(n.getFullYear() + 1);
          return n;
        };

        nextDate = advance(lastDate, t.frequency!);
        while (nextDate <= today) {
          const newTx = { ...t, id: Math.random().toString(36).substr(2, 9), date: nextDate.toISOString().split('T')[0], isRecurring: false };
          updated.unshift(newTx);
          const idx = updated.findIndex(item => item.id === t.id);
          if (idx !== -1) updated[idx].lastGeneratedDate = nextDate.toISOString().split('T')[0];
          lastDate = new Date(nextDate);
          nextDate = advance(lastDate, t.frequency!);
          changed = true;
        }
      }
    });

    if (changed) setTransactions(updated);
  }, [user]);

  if (!user) return <Auth onLogin={setUser} />;

  const menu = [
    { id: 'dashboard', label: 'Painel', icon: <LayoutDashboard size={20}/> },
    { id: 'transactions', label: 'Extrato', icon: <History size={20}/> },
    { id: 'planning', label: 'Metas', icon: <Target size={20}/> },
    { id: 'investments', label: 'Investir', icon: <TrendingUp size={20}/> },
    { id: 'credit', label: 'Crédito', icon: <Calculator size={20}/> },
  ];

  const renderContent = () => {
    switch(activeView) {
      case 'dashboard': return <Dashboard transactions={transactions} goals={goals} accounts={INITIAL_ACCOUNTS} />;
      case 'transactions': return <Transactions transactions={transactions} onAdd={(t) => setTransactions([{...t, id: Date.now().toString()}, ...transactions])} onDelete={(id) => setTransactions(transactions.filter(t => t.id !== id))} />;
      // Added missing transactions prop to Planning component
      case 'planning': return <Planning goals={goals} setGoals={setGoals} transactions={transactions} />;
      case 'investments': return <Investments investments={investments} setInvestments={setInvestments} />;
      case 'credit': return <CreditSimulator />;
      case 'settings': return <Settings user={user} setUser={setUser} />;
      default: return null;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex w-72 bg-white border-r border-slate-200 flex-col">
        <div className="p-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200">
            <span className="text-white font-black text-2xl">F</span>
          </div>
          <h1 className="text-xl font-black text-slate-800">Finanzo<span className="text-emerald-600">Pro</span></h1>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          {menu.map(item => (
            <button key={item.id} onClick={() => setActiveView(item.id as View)} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all ${activeView === item.id ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-100' : 'text-slate-500 hover:bg-slate-50'}`}>
              {item.icon} {item.label}
            </button>
          ))}
        </nav>
        <div className="p-6 border-t border-slate-100">
          <button onClick={() => setActiveView('settings')} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors">
            <SettingsIcon size={20}/> Ajustes
          </button>
          <button onClick={() => setUser(null)} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-rose-500 hover:bg-rose-50 rounded-xl mt-2 transition-all">
            <LogOut size={20}/> Sair
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 lg:h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 lg:px-10 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 text-slate-500"><Menu size={24}/></button>
            <h2 className="text-lg font-black text-slate-800 tracking-tight">{menu.find(m => m.id === activeView)?.label || 'Configurações'}</h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-bold text-slate-800 leading-none">{user.name}</p>
              <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mt-1">Plano Premium</p>
            </div>
            <img src={user.avatar} className="w-10 h-10 rounded-xl border border-slate-200" alt="User"/>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-10">
          <div className="max-w-7xl mx-auto">{renderContent()}</div>
        </main>
      </div>

      {/* Mobile Menu Backdrop */}
      {isMobileMenuOpen && <div onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex">
        <div className="w-72 bg-white h-full animate-in slide-in-from-left duration-300">
          <div className="p-8 flex justify-between items-center"><h1 className="font-black">Menu</h1><X size={24}/></div>
          <nav className="p-4 space-y-2">
            {menu.map(item => (
              <button key={item.id} onClick={() => { setActiveView(item.id as View); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold ${activeView === item.id ? 'bg-emerald-600 text-white' : 'text-slate-500'}`}>
                {item.icon} {item.label}
              </button>
            ))}
          </nav>
        </div>
      </div>}
    </div>
  );
};

export default App;
