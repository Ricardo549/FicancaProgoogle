
import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Target, 
  TrendingUp, 
  Calculator, 
  History,
  Settings as SettingsIcon,
  PlusCircle,
  Menu,
  X,
  User,
  MoreHorizontal
} from 'lucide-react';
import { Transaction, Account, FinancialGoal, Investment, Category } from './types';
import { CATEGORIES, INITIAL_ACCOUNTS } from './constants';
import Dashboard from './components/Dashboard';
import Transactions from './components/Transactions';
import Planning from './components/Planning';
import Investments from './components/Investments';
import CreditSimulator from './components/CreditSimulator';

type View = 'dashboard' | 'transactions' | 'planning' | 'investments' | 'credit';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  
  // Persistence Mock
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('fin_transactions');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [goals, setGoals] = useState<FinancialGoal[]>(() => {
    const saved = localStorage.getItem('fin_goals');
    return saved ? JSON.parse(saved) : [
      { id: '1', title: 'Reserva de Emergência', targetAmount: 20000, currentAmount: 5000, deadline: '2025-12-31' }
    ];
  });

  const [investments, setInvestments] = useState<Investment[]>(() => {
    const saved = localStorage.getItem('fin_investments');
    return saved ? JSON.parse(saved) : [];
  });

  const [accounts] = useState<Account[]>(INITIAL_ACCOUNTS);

  useEffect(() => {
    localStorage.setItem('fin_transactions', JSON.stringify(transactions));
    localStorage.setItem('fin_goals', JSON.stringify(goals));
    localStorage.setItem('fin_investments', JSON.stringify(investments));
  }, [transactions, goals, investments]);

  const addTransaction = (t: Omit<Transaction, 'id'>) => {
    const newT = { ...t, id: Math.random().toString(36).substr(2, 9) };
    setTransactions(prev => [newT, ...prev]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const menuItems = [
    { id: 'dashboard', label: 'Início', icon: <LayoutDashboard size={20}/>, fullLabel: 'Painel Geral' },
    { id: 'transactions', label: 'Extrato', icon: <History size={20}/>, fullLabel: 'Lançamentos' },
    { id: 'planning', label: 'Metas', icon: <Target size={20}/>, fullLabel: 'Planejamento' },
    { id: 'investments', label: 'Investir', icon: <TrendingUp size={20}/>, fullLabel: 'Investimentos' },
    { id: 'credit', label: 'Crédito', icon: <Calculator size={20}/>, fullLabel: 'Crédito & Finan.' },
  ];

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard': return <Dashboard transactions={transactions} goals={goals} accounts={accounts} />;
      case 'transactions': return <Transactions transactions={transactions} onAdd={addTransaction} onDelete={deleteTransaction} />;
      case 'planning': return <Planning goals={goals} setGoals={setGoals} transactions={transactions} />;
      case 'investments': return <Investments investments={investments} setInvestments={setInvestments} />;
      case 'credit': return <CreditSimulator />;
      default: return <Dashboard transactions={transactions} goals={goals} accounts={accounts} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden flex-col lg:flex-row">
      
      {/* Sidebar - Desktop Only or Drawer on Mobile */}
      <aside className={`
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 transition-transform lg:relative lg:translate-x-0 lg:flex lg:flex-col
      `}>
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200">
              <span className="text-white font-black text-2xl">F</span>
            </div>
            <h1 className="text-xl font-black text-slate-800 tracking-tight">Finanzo<span className="text-emerald-600">Pro</span></h1>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-2 text-slate-500 hover:bg-slate-50 rounded-xl transition-colors">
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 mt-4 px-4 space-y-1 overflow-y-auto">
          <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Menu Principal</p>
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveView(item.id as View);
                if (window.innerWidth < 1024) setSidebarOpen(false);
              }}
              className={`
                w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all
                ${activeView === item.id 
                  ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-100 scale-[1.02]' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
              `}
            >
              <span className={`${activeView === item.id ? 'text-white' : 'text-slate-400'}`}>
                {item.icon}
              </span>
              {item.fullLabel}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-100 bg-slate-50/50">
           <div className="flex items-center gap-3 p-2 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-slate-100 overflow-hidden border-2 border-emerald-500 shrink-0">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-800 truncate">João Silva</p>
                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Premium</p>
              </div>
           </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        
        {/* Mobile Header */}
        <header className="lg:hidden bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">F</span>
            </div>
            <h2 className="text-base font-black text-slate-800">{menuItems.find(m => m.id === activeView)?.label}</h2>
          </div>
          <div className="flex items-center gap-3">
             <button className="p-2 text-slate-400 hover:text-emerald-600 transition-colors">
                <PlusCircle size={24} />
             </button>
             <button onClick={() => setSidebarOpen(true)} className="p-2 text-slate-500">
                <Menu size={24} />
             </button>
          </div>
        </header>

        {/* Desktop Header */}
        <header className="hidden lg:flex bg-white/80 backdrop-blur-md border-b border-slate-200 h-20 items-center justify-between px-10 sticky top-0 z-30">
          <div>
            <h2 className="text-xl font-black text-slate-800 tracking-tight">
              {menuItems.find(m => m.id === activeView)?.fullLabel}
            </h2>
            <p className="text-xs font-medium text-slate-400">Bem-vindo de volta, João!</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl">
               <TrendingUp size={16} className="text-emerald-500" />
               <span className="text-xs font-bold text-slate-700">Meta: 85% Concluída</span>
            </div>
            <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
              <button className="text-slate-400 hover:text-slate-600 transition-colors relative">
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></div>
                <SettingsIcon size={22} />
              </button>
              <button className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-100 hover:scale-105 active:scale-95 transition-all">
                <PlusCircle size={22} />
              </button>
            </div>
          </div>
        </header>

        {/* View Content */}
        <main className="flex-1 overflow-y-auto bg-slate-50/50 pb-24 lg:pb-0">
          <div className="p-4 lg:p-10 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-500">
            {renderContent()}
          </div>
        </main>

        {/* Mobile Dynamic Navigation Bar (Bottom Nav) */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-slate-200 px-2 py-2 flex items-center justify-around z-40 pb-safe">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id as View)}
              className={`
                flex flex-col items-center justify-center py-2 px-1 min-w-[64px] rounded-2xl transition-all
                ${activeView === item.id 
                  ? 'text-emerald-600 scale-110' 
                  : 'text-slate-400'}
              `}
            >
              <div className={`p-1 rounded-xl transition-all ${activeView === item.id ? 'bg-emerald-50' : ''}`}>
                {item.icon}
              </div>
              <span className={`text-[10px] font-black mt-1 uppercase tracking-tighter ${activeView === item.id ? 'opacity-100' : 'opacity-60'}`}>
                {item.label}
              </span>
              {activeView === item.id && (
                <div className="w-1 h-1 bg-emerald-600 rounded-full mt-0.5"></div>
              )}
            </button>
          ))}
          <button 
            onClick={() => setSidebarOpen(true)}
            className="flex flex-col items-center justify-center py-2 px-1 min-w-[64px] text-slate-400"
          >
            <div className="p-1">
              <MoreHorizontal size={20} />
            </div>
            <span className="text-[10px] font-black mt-1 uppercase tracking-tighter opacity-60">Mais</span>
          </button>
        </nav>
      </div>

      {/* Backdrop for mobile drawer */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 animate-in fade-in duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .pb-safe {
          padding-bottom: env(safe-area-inset-bottom);
        }
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}} />
    </div>
  );
};

export default App;
