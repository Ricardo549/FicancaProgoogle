
import React, { useState, useEffect } from 'react';
import { 
  User, 
  Monitor, 
  Globe, 
  Database, 
  Lock, 
  Bell, 
  ChevronRight,
  Check,
  Building2,
  RefreshCw,
  Zap,
  Moon,
  Sun,
  Contrast,
  ShieldCheck,
  KeyRound,
  Eye,
  History,
  LogOut,
  Users,
  Search,
  ExternalLink,
  Ban,
  Fingerprint
} from 'lucide-react';

interface SettingsProps {
  user: any;
  setUser: (user: any) => void;
}

const BANKS = [
  { id: 'itau', name: 'Itaú Unibanco', color: '#ec7000', text: 'white' },
  { id: 'bradesco', name: 'Bradesco', color: '#cc092f', text: 'white' },
  { id: 'nubank', name: 'Nubank', color: '#8a05be', text: 'white' },
  { id: 'inter', name: 'Banco Inter', color: '#ff7a00', text: 'white' },
  { id: 'santander', name: 'Santander', color: '#ec0000', text: 'white' },
  { id: 'bb', name: 'Banco do Brasil', color: '#fcf000', text: '#0038a8' },
  { id: 'caixa', name: 'Caixa Econômica', color: '#005ca9', text: 'white' },
  { id: 'btg', name: 'BTG Pactual', color: '#001529', text: 'white' },
];

const Settings: React.FC<SettingsProps> = ({ user, setUser }) => {
  const [config, setConfig] = useState(() => {
    const saved = localStorage.getItem('fin_config');
    return saved ? JSON.parse(saved) : {
      fontSize: 'medium',
      fontFamily: 'sans',
      language: 'pt-BR',
      openFinance: false,
      autoSync: 'hourly',
      notifications: true,
      theme: 'light',
      mfa: false,
      privacyMode: false,
      connectedBank: null
    };
  });

  const [saving, setSaving] = useState(false);
  const [bankSearch, setBankSearch] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    localStorage.setItem('fin_config', JSON.stringify(config));
  }, [config]);

  const handleToggle = (key: string) => {
    setConfig((prev: any) => ({ ...prev, [key]: !prev[key] }));
    triggerSaving();
  };

  const handleChange = (key: string, value: any) => {
    setConfig((prev: any) => ({ ...prev, [key]: value }));
    triggerSaving();
  };

  const triggerSaving = () => {
    setSaving(true);
    setTimeout(() => setSaving(false), 800);
  };

  const handleConnectBank = (bank: any) => {
    setIsConnecting(true);
    // Simulando protocolo de autenticação segura
    setTimeout(() => {
      setConfig((prev: any) => ({ ...prev, connectedBank: bank.id }));
      setIsConnecting(false);
      triggerSaving();
    }, 2000);
  };

  const handleDisconnectBank = () => {
    if (window.confirm("Isso interromperá a sincronização automática. Confirmar?")) {
      setConfig((prev: any) => ({ ...prev, connectedBank: null }));
      triggerSaving();
    }
  };

  const filteredBanks = BANKS.filter(b => b.name.toLowerCase().includes(bankSearch.toLowerCase()));

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-800 tracking-tight">Configurações</h2>
          <p className="text-slate-500 font-medium mt-1">Gerencie sua conta, aparência e conexões de dados.</p>
        </div>
        {saving ? (
          <div className="flex items-center gap-2 px-5 py-2.5 bg-emerald-50 text-emerald-600 rounded-2xl text-xs font-black animate-pulse border border-emerald-100 shadow-sm">
            <RefreshCw size={14} className="animate-spin" /> SALVANDO...
          </div>
        ) : (
          <div className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-slate-200">
            <Check size={14} /> Sistema Atualizado
          </div>
        )}
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-3 space-y-2 hidden lg:block">
            <div className="p-2 space-y-1">
                <NavButton active icon={<User size={18}/>} label="Perfil" />
                <NavButton icon={<Monitor size={18}/>} label="Aparência" />
                <NavButton icon={<Zap size={18}/>} label="Conectividade" />
                <NavButton icon={<Lock size={18}/>} label="Segurança" />
                <NavButton icon={<Bell size={18}/>} label="Notificações" />
            </div>
            
            <div className="mt-4 p-4 space-y-2 border-t border-slate-100 pt-6">
                <button onClick={() => {
                  const name = window.prompt("Nome do novo perfil:", user.name);
                  if (name) setUser({...user, name});
                }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 hover:bg-blue-100 transition-all border border-blue-100">
                  <Users size={14} /> Alterar Usuário
                </button>
                <button onClick={() => window.confirm("Sair?") && setUser(null)} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-rose-600 bg-rose-50 hover:bg-rose-100 transition-all border border-rose-100">
                  <LogOut size={14} /> Sair da Conta
                </button>
            </div>

            <div className="mt-8 p-6 bg-emerald-600 rounded-[2rem] text-white shadow-xl shadow-emerald-100 relative overflow-hidden">
                <Sparkles className="absolute -top-2 -right-2 opacity-20" size={80} />
                <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-2">Suporte VIP</p>
                <p className="text-xs font-bold leading-relaxed mb-4">Você tem acesso ao gerente de contas 24/7.</p>
                <button className="w-full py-2 bg-white text-emerald-600 rounded-xl text-[10px] font-black uppercase">Falar agora</button>
            </div>
        </div>

        {/* Main */}
        <div className="lg:col-span-9 space-y-8">
          
          <section className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-4 mb-10">
              <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl">
                <User size={24} />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-800 tracking-tight">Identidade Visual</h3>
                <p className="text-xs text-slate-400 font-medium">Como você aparece no Finanzo Pro</p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-center gap-10">
              <div className="relative group cursor-pointer">
                <div className="w-32 h-32 rounded-[2.5rem] bg-slate-100 border-4 border-white shadow-2xl overflow-hidden transition-transform group-hover:scale-105 duration-500">
                  <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                </div>
                <div className="absolute inset-0 bg-black/40 rounded-[2.5rem] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <RefreshCw className="text-white" size={24} />
                </div>
              </div>
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Nome de Exibição</label>
                  <input type="text" value={user.name} onChange={(e) => setUser({...user, name: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 outline-none font-bold text-slate-700 transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">E-mail Corporativo</label>
                  <div className="relative">
                    <input type="email" value={user.email} disabled className="w-full px-5 py-4 bg-slate-100 border border-slate-200 rounded-2xl text-slate-400 font-bold cursor-not-allowed" />
                    <ShieldCheck className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500" size={18} />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* OPEN FINANCE HUB */}
          <section className="bg-slate-900 rounded-[2.5rem] p-8 md:p-10 text-white shadow-2xl relative overflow-hidden group">
            <Zap className="absolute -top-10 -right-10 text-emerald-500/10 group-hover:scale-110 transition-transform duration-1000" size={300} />
            
            <div className="flex items-center justify-between mb-8 relative z-10">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-500 text-white rounded-2xl shadow-xl shadow-emerald-500/20">
                  <Building2 size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black tracking-tight">Conectividade Open Finance</h3>
                  <p className="text-xs text-emerald-400 font-bold uppercase tracking-widest">Protocolo Centralizado v3.0</p>
                </div>
              </div>
              <button 
                  onClick={() => handleToggle('openFinance')}
                  className={`w-14 h-8 rounded-full p-1 transition-colors duration-500 ${config.openFinance ? 'bg-emerald-500' : 'bg-slate-700'}`}
              >
                  <div className={`w-6 h-6 bg-white rounded-full shadow-lg transition-transform duration-500 transform ${config.openFinance ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>

            {config.openFinance ? (
              <div className="space-y-8 relative z-10 animate-in fade-in slide-in-from-top-4 duration-500">
                {!config.connectedBank ? (
                  <div className="space-y-6">
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="relative flex-1">
                          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                          <input 
                            type="text" 
                            placeholder="Buscar seu banco..." 
                            className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold outline-none focus:ring-2 focus:ring-emerald-500"
                            value={bankSearch}
                            onChange={(e) => setBankSearch(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {filteredBanks.map(bank => (
                          <button 
                            key={bank.id}
                            disabled={isConnecting}
                            onClick={() => handleConnectBank(bank)}
                            className="group flex flex-col items-center p-6 rounded-3xl bg-white/5 border border-white/5 hover:border-emerald-500/50 hover:bg-emerald-500/10 transition-all active:scale-95 disabled:opacity-50"
                          >
                            <div 
                              className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg mb-3 shadow-xl group-hover:scale-110 transition-transform"
                              style={{ backgroundColor: bank.color, color: bank.text }}
                            >
                              {bank.name.charAt(0)}
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-center leading-tight">{bank.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-5 bg-white/5 rounded-2xl border border-white/5 italic text-xs text-slate-400">
                      <ShieldCheck size={24} className="text-emerald-500 shrink-0" />
                      Seus dados são criptografados com RSA-4096. Nós nunca temos acesso às suas senhas bancárias, apenas ao extrato de leitura autorizado.
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6 animate-in zoom-in duration-500">
                    <div className="bg-gradient-to-br from-emerald-500/20 to-transparent border border-emerald-500/30 rounded-[2.5rem] p-8 flex flex-col md:flex-row items-center justify-between gap-8">
                      <div className="flex items-center gap-6">
                        <div 
                          className="w-20 h-20 rounded-[1.5rem] flex items-center justify-center text-4xl font-black shadow-2xl"
                          style={{ 
                            backgroundColor: BANKS.find(b => b.id === config.connectedBank)?.color,
                            color: BANKS.find(b => b.id === config.connectedBank)?.text 
                          }}
                        >
                          {BANKS.find(b => b.id === config.connectedBank)?.name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-2xl font-black">{BANKS.find(b => b.id === config.connectedBank)?.name}</h4>
                            <span className="px-3 py-1 bg-emerald-500 text-[10px] font-black uppercase rounded-full">Ativo</span>
                          </div>
                          <p className="text-emerald-400 font-bold text-xs uppercase tracking-widest">Sincronização em tempo real</p>
                          <p className="text-slate-400 text-[10px] mt-2 font-medium">Última atualização: {new Date().toLocaleTimeString()} - {new Date().toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex gap-3 w-full md:w-auto">
                        <button className="flex-1 md:flex-none px-6 py-4 bg-white/10 hover:bg-white/20 rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                          <RefreshCw size={14} /> Atualizar
                        </button>
                        <button 
                          onClick={handleDisconnectBank}
                          className="flex-1 md:flex-none px-6 py-4 bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                        >
                          <Ban size={14} /> Desconectar
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                        <label className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-4 block">Frequência de Atualização</label>
                        <div className="flex gap-2">
                            {['realtime', 'hourly', 'daily'].map((f) => (
                                <button
                                    key={f}
                                    onClick={() => handleChange('autoSync', f)}
                                    className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${config.autoSync === f ? 'bg-emerald-500 text-white shadow-lg' : 'bg-white/5 text-slate-400'}`}
                                >
                                    {f === 'realtime' ? 'Instantâneo' : f === 'hourly' ? 'Horário' : 'Diário'}
                                </button>
                            ))}
                        </div>
                      </div>
                      <div className="bg-white/5 p-6 rounded-3xl border border-white/5 flex flex-col justify-center gap-2">
                        <div className="flex items-center gap-3 text-emerald-400">
                          <Fingerprint size={24} />
                          <span className="font-bold text-sm">Autenticação Biométrica</span>
                        </div>
                        <p className="text-[10px] text-slate-400 leading-relaxed font-medium">Exigir reconhecimento para novas sincronizações em dispositivos desconhecidos.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white/5 rounded-3xl p-10 text-center border border-white/5 animate-in fade-in duration-500">
                <div className="inline-flex p-4 bg-slate-800 rounded-2xl mb-4">
                  <Ban size={32} className="text-slate-500" />
                </div>
                <h4 className="text-lg font-bold mb-2">Open Finance Desativado</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                  Ative o protocolo para importar extratos automaticamente sem precisar colar textos ou fazer upload de arquivos.
                </p>
              </div>
            )}

            {/* Overlay de carregamento ao conectar */}
            {isConnecting && (
              <div className="absolute inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in duration-300">
                <div className="relative mb-8">
                  <div className="w-24 h-24 border-4 border-emerald-500/20 rounded-full animate-ping" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <RefreshCw className="text-emerald-500 animate-spin" size={40} />
                  </div>
                </div>
                <h4 className="text-xl font-black tracking-widest uppercase">Estabelecendo Conexão</h4>
                <p className="text-xs text-emerald-500 font-black animate-pulse mt-2">AUTENTICANDO VIA OAUTH 2.0...</p>
              </div>
            )}
          </section>

          {/* APARÊNCIA */}
          <section className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-slate-200 shadow-sm space-y-12">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-100 text-indigo-600 rounded-2xl">
                <Monitor size={24} />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-800 tracking-tight">Experiência Visual</h3>
                <p className="text-xs text-slate-400 font-medium">Personalize o visual da sua plataforma</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <ThemeCard active={config.theme === 'light'} onClick={() => handleChange('theme', 'light')} icon={<Sun size={20} />} label="Claro" desc="Minimalista e limpo" colors="bg-slate-50" />
                <ThemeCard active={config.theme === 'dark'} onClick={() => handleChange('theme', 'dark')} icon={<Moon size={20} />} label="Escuro" desc="Conforto visual" colors="bg-slate-900" />
                <ThemeCard active={config.theme === 'mixed'} onClick={() => handleChange('theme', 'mixed')} icon={<Contrast size={20} />} label="Misto" desc="Ciclo Solar" colors="bg-gradient-to-r from-slate-50 to-slate-900" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
                <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Tipografia do Sistema</label>
                    <div className="grid grid-cols-3 gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                        {['sans', 'serif', 'mono'].map((f) => (
                            <button key={f} onClick={() => handleChange('fontFamily', f)} className={`py-3 rounded-xl text-[10px] font-black uppercase transition-all ${config.fontFamily === f ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-400'}`} style={{ fontFamily: f === 'mono' ? 'monospace' : f === 'serif' ? 'serif' : 'sans-serif' }}>
                                {f}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Linguagem do Sistema</label>
                    <div className="relative">
                        <Globe size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <select value={config.language} onChange={(e) => handleChange('language', e.target.value)} className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/10 appearance-none transition-all">
                            <option value="pt-BR">Português (Brasil)</option>
                            <option value="en-US">English (US)</option>
                            <option value="es-ES">Español</option>
                        </select>
                    </div>
                </div>
            </div>
          </section>

          {/* SEGURANÇA */}
          <section className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-slate-200 shadow-sm space-y-10">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-rose-100 text-rose-600 rounded-2xl">
                <Lock size={24} />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-800 tracking-tight">Segurança & Privacidade</h3>
                <p className="text-xs text-slate-400 font-medium">Gestão de credenciais e auditoria de acesso</p>
              </div>
            </div>

            <div className="space-y-4">
                <SecurityAction icon={<KeyRound size={20} className="text-slate-400"/>} label="Duplo Fator de Autenticação (2FA)" desc="Aumenta drasticamente a segurança da conta" toggle checked={config.mfa} onToggle={() => handleToggle('mfa')} />
                <SecurityAction icon={<Eye size={20} className="text-slate-400"/>} label="Ocultar Valores Sensíveis" desc="Privacidade total ao usar o app em público" toggle checked={config.privacyMode} onToggle={() => handleToggle('privacyMode')} />
                <SecurityAction icon={<History size={20} className="text-slate-400"/>} label="Monitor de Dispositivos" desc="Auditar locais e horários dos últimos logins" action={() => alert("Logs exportados para seu e-mail.")} />
                <div className="pt-6">
                    <button className="w-full py-5 bg-rose-50 hover:bg-rose-100 text-rose-600 font-black text-xs uppercase tracking-[0.2em] rounded-[1.5rem] transition-all border border-rose-100 flex items-center justify-center gap-2">
                        Redefinir Tokens de Acesso
                    </button>
                </div>
            </div>
          </section>

          <div className="text-center py-10 space-y-3 opacity-40">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Finanzo Pro v3.1.2 Revision 2024</p>
            <div className="flex items-center justify-center gap-4">
                <span className="text-[9px] font-bold">Privacy Policy</span>
                <span className="text-[9px] font-bold">API Status</span>
                <span className="text-[9px] font-bold">Data Sovereignty</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Utils
const NavButton = ({ icon, label, active = false }: any) => (
    <button className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-wider transition-all ${active ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:bg-slate-50'}`}>
        {icon} {label}
    </button>
);

const ThemeCard = ({ active, onClick, icon, label, desc, colors }: any) => (
    <div onClick={onClick} className={`p-6 rounded-[2rem] border-2 cursor-pointer transition-all duration-300 group ${active ? 'border-indigo-500 bg-indigo-50/30' : 'border-slate-100 bg-white hover:border-slate-200 shadow-sm'}`}>
        <div className={`w-12 h-12 rounded-2xl ${colors} flex items-center justify-center mb-4 shadow-inner group-hover:scale-110 transition-transform`}>
            {icon}
        </div>
        <p className={`font-black text-sm ${active ? 'text-indigo-900' : 'text-slate-800'}`}>{label}</p>
        <p className="text-[10px] text-slate-400 font-bold">{desc}</p>
    </div>
);

const SecurityAction = ({ icon, label, desc, toggle, checked, onToggle, action }: any) => (
    <div className="flex items-center justify-between p-5 hover:bg-slate-50 rounded-3xl transition-all border border-transparent hover:border-slate-100 group">
        <div className="flex items-center gap-4">
            <div className="p-2.5 bg-slate-100 text-slate-500 rounded-xl group-hover:bg-white transition-all">{icon}</div>
            <div>
                <p className="text-sm font-bold text-slate-800">{label}</p>
                <p className="text-[10px] text-slate-400 font-medium">{desc}</p>
            </div>
        </div>
        {toggle ? (
            <button onClick={onToggle} className={`w-12 h-6 rounded-full p-1 transition-colors duration-500 ${checked ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                <div className={`w-4 h-4 bg-white rounded-full shadow-lg transition-transform duration-500 transform ${checked ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
        ) : (
            <button onClick={action} className="p-2 text-slate-300 hover:text-slate-900 transition-colors">
                <ChevronRight size={20} />
            </button>
        )}
    </div>
);

const Sparkles = ({ className, size }: any) => (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
        <path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>
    </svg>
);

export default Settings;
