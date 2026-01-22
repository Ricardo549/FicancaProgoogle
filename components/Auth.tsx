
import React, { useState } from 'react';
import { supabase } from '../utils/supabase';
import { Mail, Lock, Chrome, ArrowRight, Sparkles, ShieldCheck, User, ShieldAlert, ShieldX } from 'lucide-react';

interface AuthProps {
  onLogin: (user: any) => void;
}

const Auth: React.FC<AuthProps> = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [msg, setMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        if (fullName.trim().length < 3) throw new Error("Insira seu nome completo.");

        const { data, error } = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            data: {
              full_name: fullName,
              avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`
            }
          }
        });

        if (error) throw error;

        if (data.user && !data.session) {
          setMsg({ 
            type: 'success', 
            text: "Verifique seu e-mail para confirmar o cadastro!" 
          });
          setIsLogin(true);
        }
      }
    } catch (error: any) {
      setMsg({ type: 'error', text: error.message || "Erro inesperado." });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setMsg(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        }
      });
      
      if (error) {
        // Se o erro for "Provider not enabled", damos uma mensagem mais clara
        if (error.message.includes('not enabled')) {
          throw new Error("O login com Google não foi ativado no painel do Supabase. Use e-mail/senha ou configure o Provider.");
        }
        throw error;
      }
    } catch (error: any) {
      console.error("Erro Google Login:", error);
      setMsg({ type: 'error', text: error.message });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-600/20 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-600 rounded-[2rem] shadow-2xl mb-6 transform hover:rotate-12 transition-transform duration-500">
            <span className="text-white font-black text-3xl">F</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight mb-2">
            Finanzo<span className="text-emerald-500">Pro</span>
          </h1>
          <p className="text-slate-400 text-sm font-medium">Controle Total com Segurança Bancária</p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem] shadow-2xl space-y-6">
          {msg && (
            <div className={`p-4 rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300 ${
              msg.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
            }`}>
              {msg.type === 'success' ? <ShieldCheck size={18} className="shrink-0" /> : <ShieldAlert size={18} className="shrink-0" />}
              <p className="text-[11px] font-bold leading-relaxed">{msg.text}</p>
            </div>
          )}

          <div className="space-y-4">
            <button 
              type="button"
              disabled={loading}
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 py-4 bg-white hover:bg-slate-50 text-slate-900 font-black text-xs uppercase tracking-widest rounded-2xl transition-all active:scale-95 shadow-lg disabled:opacity-50"
            >
              <Chrome size={18} className="text-rose-500" />
              Continuar com Google
            </button>
          </div>

          <div className="relative text-center">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
            <span className="relative bg-slate-950 px-4 text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]">Ou credenciais</span>
          </div>

          <form className="space-y-4" onSubmit={handleEmailAuth}>
            {!isLogin && (
              <div className="relative animate-in slide-in-from-top-4 duration-500">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="text" 
                  placeholder="Seu Nome Completo" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required={!isLogin}
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-bold text-sm"
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
                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-bold text-sm"
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
                minLength={6}
                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-bold text-sm"
              />
            </div>
            
            <button 
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              {loading ? "Processando..." : (
                <>
                  {isLogin ? 'Acessar Painel' : 'Criar minha conta'}
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <button 
            type="button"
            onClick={() => { setIsLogin(!isLogin); setMsg(null); }}
            className="w-full text-center text-[10px] font-black text-emerald-500 uppercase tracking-widest hover:text-emerald-400 transition-colors"
          >
            {isLogin ? 'Não tem conta? Comece grátis' : 'Já é membro? Fazer login'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
