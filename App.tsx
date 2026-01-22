
import React, { useState, useEffect, useCallback } from 'react';
import { 
  LayoutDashboard, History, Target, TrendingUp, Calculator, Settings as SettingsIcon,
  LogOut, Menu, X, Shield, Lock, Loader2, Key, User as UserIcon
} from 'lucide-react';
import { supabase } from './utils/supabase';
import { Transaction, FinancialGoal, Investment, Category, User, AppConfig, Account } from './utils/types';
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
  const [session, setSession] = useState<any>(null);
  const [hasApiKey, setHasApiKey] = useState<boolean>(true);
  
  const [user, setUser] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [goals, setGoals] = useState<FinancialGoal[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [config, setConfig] = useState<AppConfig>({
    theme: 'light',
    fontFamily: 'Inter',
    language: 'pt-BR',
    currency: 'BRL',
    privacyMode: false,
    notifications: true
  });

  const loadData = useCallback(async (userId: string) => {
    setIsSyncing(true);
    try {
      const [
        { data: txData },
        { data: goalData },
        { data: accData },
        { data: catData },
        { data: invData }
      ] = await Promise.all([
        supabase.from('transactions').select('*').eq('user_id', userId).order('date', { ascending: false }),
        supabase.from('goals').select('*').eq('user_id', userId),
        supabase.from('accounts').select('*').eq('user_id', userId),
        supabase.from('categories').select('*').or(`user_id.eq.${userId},user_id.is.null`),
        supabase.from('investments').select('*').eq('user_id', userId)
      ]);

      if (txData) setTransactions(txData.map(t => ({
        id: t.id, userId: t.user_id, description: t.description, amount: Number(t.amount),
        date: t.date, type: t.type, categoryId: t.category_id, accountId: t.account_id,
        status: t.status, paymentMethod: t.payment_method, isRecurring: t.is_recurring, notes: t.notes
      })));

      if (goalData) setGoals(goalData.map(g => ({
        id: g.id, userId: g.user_id, title: g.title, targetAmount: Number(g.target_amount),
        currentAmount: Number(g.current_amount), deadline: g.deadline
      })));

      if (accData) setAccounts(accData.map(acc => ({
        id: acc.id, userId: acc.user_id, name: acc.name, balance: Number(acc.balance),
        type: acc.type, color: acc.color
      })));

      if (catData) setCategories(catData.map(cat => ({
        id: cat.id, userId: cat.user_id, name: cat.name, icon: cat.icon, color: cat.color, type: cat.type
      })));

      if (invData) setInvestments(invData.map(inv => ({
        id: inv.id, userId: inv.user_id, name: inv.name, type: inv.type,
        initialAmount: Number(inv.initial_amount), currentAmount: Number(inv.current_amount),
        monthlyAport: Number(inv.monthly_aport), expectedReturn: Number(inv.expected_return)
      })));

    } catch (error) {
      console.error("Erro ao sincronizar dados:", error);
    } finally {
      setIsSyncing(false);
    }
  }, []);

  const handleUserSession = useCallback(async (session: any) => {
    try {
      let { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      setUser({
        id: session.user.id,
        name: profile?.full_name || session.user.user_metadata?.full_name || 'Usuário',
        email: session.user.email,
        avatar: profile?.avatar_url || session.user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${session.user.id}`,
        plan: profile?.plan || 'free',
        createdAt: session.user.created_at
      });
      
      loadData(session.user.id);
    } catch (e) {
      console.error("Erro ao carregar perfil:", e);
    }
  }, [loadData]);

  useEffect(() => {
    const checkApiKey = async () => {
      const aiStudio = (window as any).aistudio;
      if (aiStudio) {
        const selected = await aiStudio.hasSelectedApiKey();
        setHasApiKey(selected);
      }
    };
    checkApiKey();

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) handleUserSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) handleUserSession(session);
      else setUser(null);
    });

    return () => subscription.unsubscribe();
  }, [handleUserSession]);

  const handleOpenKeySelect = async () => {
    const aiStudio = (window as any).aistudio;
    if (aiStudio) {
      await aiStudio.openSelectKey();
      setHasApiKey(true);
    }
  };

  const handleAddTransaction = async (newT: Omit<Transaction, 'id'>) => {
    if (!user) return;
    const { error } = await supabase.from('transactions').insert([{
      user_id: user.id,
      description: newT.description,
      amount: newT.amount,
      date: newT.date,
      type: newT.type,
      category_id: newT.categoryId,
      account_id: newT.accountId,
      status: newT.status,
      payment_method: newT.paymentMethod,
      is_recurring: newT.isRecurring,
      notes: newT.notes
    }]);
    if (!error) loadData(user.id);
  };

  const handleUpdateTransaction = async (updated: Transaction | Transaction[]) => {
    if (!user) return;
    const items = Array.isArray(updated) ? updated : [updated];
    for (const item of items) {
      await supabase.from('transactions').update({
        description: item.description, amount: item.amount, date: item.date,
        type: item.type, category_id: item.categoryId, account_id: item.accountId,
        status: item.status, payment_method: item.paymentMethod, notes: item.notes
      }).eq('id', item.id);
    }
    loadData(user.id);
  };

  const handleDeleteTransaction = async (id: string) => {
    if (!user) return;
    const { error } = await supabase.from('transactions').delete().eq('id', id);
    if (!error) loadData(user.id);
  };

  if (!session) return <Auth onLogin={() => {}} />;

  if (!hasApiKey) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[2.5rem] shadow-2xl max-w-md w-full text-center space-y-6">
          <div className="w-20 h-20 bg-emerald-500/20 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto">
            <Key size={40} />
          </div>
          <h2 className="text-2xl font-black text-white">Gemini 3 Pro Ativo</h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Este sistema utiliza inteligência financeira avançada. Selecione sua chave de API para continuar.
          </p>
          <button onClick={handleOpenKeySelect} className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-widest rounded-2xl transition-all shadow-xl">
            Selecionar Chave de API
          </button>
        </div>
      </div>
    );
  }

  const isAdmin = session.user.email === ADMIN_EMAIL;
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

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden">
      {/* Menu Lateral Desktop */}
      <aside className="hidden lg:flex w-72 shrink-0 h-full flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800">
        <SidebarContent menu={menu} activeView={activeView} isAdmin={isAdmin} setActiveView={handleNavigate} />
      </aside>

      <div className="flex-1 flex flex-col min-w-0 h-full">
        {/* Header Principal */}
        <header className="h-16 shrink-0 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 flex items-center justify-between z-40">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 text-slate-600 dark:text-slate-300">
              <Menu size={20}/>
            </button>
            <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              {menu.find(m => m.id === activeView)?.label || 'Visão'}
            </h2>
            {isSyncing && <Loader2 size={12} className="animate-spin text-emerald-500" />}
          </div>
          <div className="flex items-center gap-3">
             <div className="text-right hidden sm:block">
               <p className="text-xs font-black dark:text-white">{user?.name}</p>
               <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{user?.plan === 'pro' ? 'Premium' : 'Básico'}</p>
             </div>
             <img src={user?.avatar} className="w-8 h-8 rounded-xl shadow-md border border-slate-100 dark:border-slate-700" alt="User" />
          </div>
        </header>

        {/* Área de Conteúdo */}
        <main className="flex-1 overflow-y-auto p-5 lg:p-10 no-scrollbar">
          <div className="max-w-6xl mx-auto pb-10">
            {activeView === 'dashboard' && <Dashboard transactions={transactions} goals={goals} accounts={accounts} categories={categories} userPlan={user?.plan} />}
            {activeView === 'transactions' && <Transactions transactions={transactions} categories={categories} setCategories={setCategories} onAdd={handleAddTransaction} onDelete={handleDeleteTransaction} onUpdate={handleUpdateTransaction} accounts={accounts} />}
            {activeView === 'planning' && <Planning goals={goals} setGoals={() => loadData(user!.id)} transactions={transactions} />}
            {activeView === 'investments' && <Investments userId={user?.id || ''} investments={investments} setInvestments={() => loadData(user!.id)} userPlan={user?.plan} />}
            {activeView === 'credit' && <CreditSimulator />}
            {activeView === 'settings' && <Settings user={user} setUser={setUser} config={config} setConfig={setConfig} categories={categories} setCategories={setCategories} navigateToPrivacy={() => handleNavigate('privacy')} />}
            {activeView === 'privacy' && <PrivacyPolicy onBack={() => handleNavigate('dashboard')} />}
            {activeView === 'checkout' && <Checkout onCancel={() => handleNavigate('dashboard')} onSuccess={() => { handleUserSession(session); handleNavigate('dashboard'); }} user={user} />}
            {activeView === 'admin' && isAdmin && <Admin />}
          </div>
        </main>
      </div>

      {/* Menu Mobile */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-sm lg:hidden animate-in fade-in duration-300">
           <div className="w-72 h-full bg-white dark:bg-slate-900 animate-in slide-in-from-left-4 duration-500">
              <div className="p-6 flex justify-between items-center">
                 <h1 className="text-lg font-black text-slate-800 dark:text-white">Menu</h1>
                 <button onClick={() => setIsMobileMenuOpen(false)}><X size={20}/></button>
              </div>
              <SidebarContent menu={menu} activeView={activeView} isAdmin={isAdmin} setActiveView={handleNavigate} />
           </div>
        </div>
      )}
    </div>
  );
};

const SidebarContent = ({ menu, activeView, isAdmin, setActiveView }: any) => (
  <div className="flex flex-col h-full">
    <div className="p-8 flex items-center gap-3 shrink-0">
      <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
        <span className="text-white font-black text-xl">F</span>
      </div>
      <h1 className="text-lg font-black text-slate-800 dark:text-white leading-none">Finanzo<span className="text-emerald-600">Pro</span></h1>
    </div>
    <nav className="flex-1 px-4 space-y-1">
      {menu.map((item: any) => (
        <button 
          key={item.id} 
          onClick={() => setActiveView(item.id)} 
          className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-[13px] font-bold transition-all ${
            activeView === item.id 
              ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-500/20' 
              : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          {item.icon}
          <span className="flex-1 text-left">{item.label}</span>
        </button>
      ))}
    </nav>
    <div className="p-6 border-t border-slate-50 dark:border-slate-800">
      <button onClick={() => supabase.auth.signOut()} className="w-full flex items-center gap-4 px-4 py-3 text-xs font-black text-rose-500 hover:bg-rose-50 rounded-2xl transition-all">
        <LogOut size={18} /> Sair
      </button>
    </div>
  </div>
);

export default App;
