
import React, { useState, useEffect } from 'react';
import { 
  User, 
  Monitor, 
  Globe, 
  Database, 
  Lock, 
  Bell, 
  Type, 
  Smartphone, 
  ChevronRight,
  Info,
  Check,
  CreditCard,
  Building2,
  RefreshCw,
  Zap
} from 'lucide-react';

interface SettingsProps {
  user: any;
  setUser: (user: any) => void;
}

const Settings: React.FC<SettingsProps> = ({ user, setUser }) => {
  const [config, setConfig] = useState(() => {
    const saved = localStorage.getItem('fin_config');
    return saved ? JSON.parse(saved) : {
      fontSize: 'medium',
      language: 'pt-BR',
      openFinance: false,
      autoSync: false,
      notifications: true,
      theme: 'light',
      mfa: false
    };
  });

  const [saving, setSaving] = useState(false);

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

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Configurações</h2>
          <p className="text-slate-500 font-medium">Personalize sua experiência no Finanzo Pro.</p>
        </div>
        {saving && (
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold animate-pulse border border-emerald-100">
            <RefreshCw size={14} className="animate-spin" /> Salvando alterações...
          </div>
        )}
      </div>

      {/* Perfil Section */}
      <section className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl">
            <User size={24} />
          </div>
          <h3 className="text-xl font-bold text-slate-800">Seu Perfil</h3>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="relative group">
            <div className="w-24 h-24 rounded-3xl bg-slate-100 border-4 border-white shadow-xl overflow-hidden">
              <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <button className="absolute -bottom-2 -right-2 p-2 bg-white border border-slate-200 rounded-xl shadow-lg text-slate-600 hover:text-emerald-600 transition-all opacity-0 group-hover:opacity-100">
              <RefreshCw size={16} />
            </button>
          </div>
          <div className="flex-1 space-y-4 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Nome Completo</label>
                <input 
                  type="text" 
                  value={user.name} 
                  onChange={(e) => setUser({...user, name: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-slate-700" 
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">E-mail</label>
                <input 
                  type="email" 
                  value={user.email} 
                  disabled
                  className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-2xl text-slate-400 font-bold cursor-not-allowed" 
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Preferências Visuais Section */}
      <section className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-indigo-100 text-indigo-600 rounded-2xl">
            <Monitor size={24} />
          </div>
          <h3 className="text-xl font-bold text-slate-800">Aparência & Idioma</h3>
        </div>
        
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 hover:bg-slate-50 rounded-3xl transition-all">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-slate-100 text-slate-500 rounded-xl"><Type size={20} /></div>
              <div>
                <p className="font-bold text-slate-800">Tamanho da Fonte</p>
                <p className="text-xs text-slate-500">Ajuste para melhor legibilidade.</p>
              </div>
            </div>
            <div className="flex bg-slate-100 p-1 rounded-2xl">
              {['small', 'medium', 'large'].map((size) => (
                <button
                  key={size}
                  onClick={() => handleChange('fontSize', size)}
                  className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${config.fontSize === size ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  {size === 'small' ? 'P' : size === 'medium' ? 'M' : 'G'}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 hover:bg-slate-50 rounded-3xl transition-all">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-slate-100 text-slate-500 rounded-xl"><Globe size={20} /></div>
              <div>
                <p className="font-bold text-slate-800">Idioma do Sistema</p>
                <p className="text-xs text-slate-500">Defina o idioma das interfaces e relatórios.</p>
              </div>
            </div>
            <select 
              value={config.language}
              onChange={(e) => handleChange('language', e.target.value)}
              className="px-6 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="pt-BR">Português (Brasil)</option>
              <option value="en-US">English (US)</option>
              <option value="es-ES">Español</option>
            </select>
          </div>
        </div>
      </section>

      {/* Conectividade Section */}
      <section className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm overflow-hidden relative">
        <Zap className="absolute -top-6 -right-6 text-emerald-50 opacity-50" size={120} />
        
        <div className="flex items-center gap-4 mb-8 relative">
          <div className="p-3 bg-amber-100 text-amber-600 rounded-2xl">
            <Database size={24} />
          </div>
          <h3 className="text-xl font-bold text-slate-800">Dados & Conectividade</h3>
        </div>

        <div className="space-y-6 relative">
          <div className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl text-white">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500 rounded-xl"><Building2 size={24}/></div>
                <div>
                  <p className="font-bold">Open Finance</p>
                  <p className="text-xs text-slate-400">Integração oficial Banco Central</p>
                </div>
              </div>
              <div 
                onClick={() => handleToggle('openFinance')}
                className={`w-14 h-8 rounded-full p-1 cursor-pointer transition-colors duration-300 ${config.openFinance ? 'bg-emerald-500' : 'bg-slate-700'}`}
              >
                <div className={`w-6 h-6 bg-white rounded-full shadow-lg transition-transform duration-300 transform ${config.openFinance ? 'translate-x-6' : 'translate-x-0'}`} />
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Ao ativar o Open Finance, o Finanzo Pro sincroniza automaticamente suas contas de outros bancos em tempo real com segurança total.
            </p>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 hover:bg-slate-50 rounded-3xl transition-all border border-transparent hover:border-slate-100">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-slate-100 text-slate-500 rounded-xl"><RefreshCw size={20} /></div>
              <div>
                <p className="font-bold text-slate-800">Sincronização Bancária</p>
                <p className="text-xs text-slate-500">Atualizar saldos a cada abertura do app.</p>
              </div>
            </div>
            <div 
              onClick={() => handleToggle('autoSync')}
              className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors duration-300 ${config.autoSync ? 'bg-emerald-500' : 'bg-slate-200'}`}
            >
              <div className={`w-4 h-4 bg-white rounded-full shadow-lg transition-transform duration-300 transform ${config.autoSync ? 'translate-x-6' : 'translate-x-0'}`} />
            </div>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex items-start gap-3">
            <Info size={18} className="text-blue-500 shrink-0 mt-0.5" />
            <p className="text-[11px] text-blue-800 font-medium leading-relaxed">
              <b>Sugestão:</b> Use a sincronização automática com cartões XP, Nubank e Itaú para que a IA Gemini classifique seus gastos assim que eles ocorrerem.
            </p>
          </div>
        </div>
      </section>

      {/* Segurança & Notificações Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-rose-100 text-rose-600 rounded-2xl">
              <Lock size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Segurança</h3>
          </div>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-700">Autenticação (MFA)</p>
                <p className="text-[10px] text-slate-400">Verificação em duas etapas</p>
              </div>
              <div 
                onClick={() => handleToggle('mfa')}
                className={`w-10 h-5 rounded-full p-0.5 cursor-pointer transition-colors duration-300 ${config.mfa ? 'bg-emerald-500' : 'bg-slate-200'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full shadow-lg transition-transform duration-300 transform ${config.mfa ? 'translate-x-5' : 'translate-x-0'}`} />
              </div>
            </div>
            <button className="w-full py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all">
              Redefinir Senha de Acesso
            </button>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl">
              <Bell size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Alertas</h3>
          </div>
          <div className="space-y-6">
             <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-700">Push Notifications</p>
                <p className="text-[10px] text-slate-400">Avisos de gastos elevados</p>
              </div>
              <div 
                onClick={() => handleToggle('notifications')}
                className={`w-10 h-5 rounded-full p-0.5 cursor-pointer transition-colors duration-300 ${config.notifications ? 'bg-emerald-500' : 'bg-slate-200'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full shadow-lg transition-transform duration-300 transform ${config.notifications ? 'translate-x-5' : 'translate-x-0'}`} />
              </div>
            </div>
            <button className="w-full py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all">
              Configurar Alertas de IA
            </button>
          </div>
        </div>
      </section>

      {/* Footer Info */}
      <div className="text-center space-y-2">
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Finanzo Pro v2.4.0</p>
        <p className="text-[10px] text-slate-400 font-medium">Seus dados são criptografados de ponta a ponta com AES-256.</p>
      </div>
    </div>
  );
};

export default Settings;
