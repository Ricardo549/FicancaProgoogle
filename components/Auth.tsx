
import React, { useState } from 'react';
import { Mail, Lock, Chrome, Facebook, ArrowRight, Sparkles, ShieldCheck, User, Star } from 'lucide-react';

interface AuthProps {
  onLogin: (user: any) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'pro'>('free');
  const [email, setEmail] = useState('');

  const handleSocialLogin = (provider: string) => {
    // Se o e-mail for o do Ricardo, forçar o nome e dados dele
    if (email === 'ricardobm647@gmail.com') {
      onLogin({ 
        name: 'Ricardo Costa', 
        email: 'ricardobm647@gmail.com', 
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ricardo',
        plan: 'pro' 
      });
      return;
    }

    onLogin({ 
      name: `Usuário ${provider}`, 
      email: email || 'user@example.com', 
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${provider}`,
      plan: selectedPlan 
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-600/20 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-600 rounded-[2rem] shadow-2xl shadow-emerald-500/20 mb-6">
            <span className="text-white font-black text-3xl">F</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight mb-2">
            Finanzo<span className="text-emerald-500">Pro</span>
          </h1>
          <p className="text-slate-400 text-sm font-medium">O controle total do seu patrimônio começa aqui.</p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem] shadow-2xl space-y-6">
          <div className="flex gap-4 p-1 bg-white/5 rounded-2xl">
            <button 
              onClick={() => setSelectedPlan('free')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedPlan === 'free' ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
              <User size={14}/> Plano Free
            </button>
            <button 
              onClick={() => setSelectedPlan('pro')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedPlan === 'pro' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
              <Star size={14} fill="currentColor"/> Plano Pro
            </button>
          </div>

          <div className="space-y-4">
            <button 
              onClick={() => handleSocialLogin('Google')}
              className="w-full flex items-center justify-center gap-3 py-4 bg-white hover:bg-slate-50 text-slate-900 font-bold rounded-2xl transition-all active:scale-95 shadow-lg"
            >
              <Chrome size={20} className="text-rose-500" />
              {isLogin ? 'Entrar com Google' : 'Cadastrar com Google'}
            </button>
          </div>

          <div className="relative text-center">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
            <span className="relative bg-slate-950 px-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Ou use e-mail</span>
          </div>

          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleSocialLogin('Email'); }}>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="email" 
                placeholder="E-mail" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input type="password" placeholder="Senha" className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:ring-2 focus:ring-emerald-500 transition-all"/>
            </div>
            <button className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 group">
              {isLogin ? 'Acessar Conta' : 'Criar minha Conta'}
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>

        <div className="mt-8 flex items-center justify-center gap-6 text-slate-500">
           <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest">
              <ShieldCheck size={14} className="text-emerald-500" /> 100% Seguro
           </div>
           <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest">
              <Sparkles size={14} className="text-blue-500" /> Analisado por IA
           </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
