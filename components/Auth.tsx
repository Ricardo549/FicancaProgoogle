
import React, { useState } from 'react';
import { supabase } from '../utils/supabase';
import { Mail, Lock, Chrome, ArrowRight, Sparkles, ShieldCheck, User, Star, UserPlus } from 'lucide-react';

interface AuthProps {
  onLogin: (user: any) => void;
}

const Auth: React.FC<AuthProps> = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            data: {
              full_name: fullName,
              avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
            }
          }
        });
        if (error) throw error;
        alert("Cadastro realizado! Verifique seu e-mail para confirmar a conta (se habilitado no Supabase).");
      }
    } catch (error: any) {
      alert(error.message || "Erro na autenticação. Verifique os dados.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    if (error) alert(error.message);
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
          <p className="text-slate-400 text-sm font-medium">Gestão Financeira com Supabase</p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem] shadow-2xl space-y-6">
          <div className="space-y-4">
            <button 
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 py-4 bg-white hover:bg-slate-50 text-slate-900 font-bold rounded-2xl transition-all active:scale-95 shadow-lg"
            >
              <Chrome size={20} className="text-rose-500" />
              Continuar com Google
            </button>
          </div>

          <div className="relative text-center">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
            <span className="relative bg-slate-950 px-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Ou use seu e-mail</span>
          </div>

          <form className="space-y-4" onSubmit={handleEmailAuth}>
            {!isLogin && (
              <div className="relative animate-in slide-in-from-top-2">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="text" 
                  placeholder="Nome Completo" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required={!isLogin}
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                />
              </div>
            )}
            
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="email" 
                placeholder="E-mail" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="password" 
                placeholder="Senha" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              />
            </div>
            
            <button 
              disabled={loading}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              {loading ? 'Processando...' : (isLogin ? 'Entrar Agora' : 'Criar Conta')}
              {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="w-full text-center text-[10px] font-black text-emerald-500 uppercase tracking-widest hover:underline"
          >
            {isLogin ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Faça login'}
          </button>
        </div>

        <div className="mt-8 flex items-center justify-center gap-6 text-slate-500">
           <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest">
              <ShieldCheck size={14} className="text-emerald-500" /> RLS Protegido
           </div>
           <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest">
              <Sparkles size={14} className="text-blue-500" /> Perfil Auto-Sync
           </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
