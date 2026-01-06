
import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Key, 
  ExternalLink, 
  Zap, 
  Activity, 
  Save, 
  CheckCircle2, 
  AlertCircle,
  Database,
  Globe,
  MonitorCheck,
  Layout,
  RefreshCcw,
  Users
} from 'lucide-react';

const Admin: React.FC = () => {
  const [adsense, setAdsense] = useState(() => {
    const saved = localStorage.getItem('fpro_admin_adsense');
    return saved ? JSON.parse(saved) : {
      active: true,
      client: 'ca-pub-6472024000000000',
      slot: '9876543210',
      script: '<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>'
    };
  });

  const [apiConfig, setApiConfig] = useState(() => {
    const saved = localStorage.getItem('fpro_admin_api_config');
    return saved ? JSON.parse(saved) : {
      groundingEnabled: true,
      searchEnabled: true,
      mapsEnabled: true,
      syncInterval: '60'
    };
  });

  const [saving, setSaving] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date().toLocaleTimeString());

  const handleSaveAdsense = () => {
    setSaving(true);
    localStorage.setItem('fpro_admin_adsense', JSON.stringify(adsense));
    setTimeout(() => {
      setSaving(false);
      setLastUpdate(new Date().toLocaleTimeString());
    }, 800);
  };

  const handleSaveApi = () => {
    setSaving(true);
    localStorage.setItem('fpro_admin_api_config', JSON.stringify(apiConfig));
    setTimeout(() => {
      setSaving(false);
      setLastUpdate(new Date().toLocaleTimeString());
    }, 800);
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
      {/* Header Admin */}
      <div className="bg-slate-900 rounded-[2.5rem] p-10 lg:p-14 text-white relative overflow-hidden shadow-2xl border border-white/5">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          <ShieldCheck size={280}/>
        </div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-500 rounded-2xl shadow-lg shadow-amber-500/20">
                <Database size={24} className="text-slate-900"/>
              </div>
              <h2 className="text-3xl font-black uppercase tracking-tighter">Centro de Comando Root</h2>
            </div>
            <p className="max-w-2xl text-slate-400 font-medium leading-relaxed">
              Bem-vindo, <span className="text-white font-black underline decoration-amber-500 underline-offset-4">Ricardo Costa</span>. 
              Aqui você controla a infraestrutura vital, monetização e integrações de IA do FinanzoPro.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
               <StatusTag icon={<Activity size={14} />} label="Sistema Operacional" color="emerald" />
               <StatusTag icon={<Globe size={14} />} label="Gateway Seguro" color="blue" />
               <StatusTag icon={<Users size={14} />} label="Cluster v3.1" color="amber" />
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Última Sincronização</p>
            <p className="text-xl font-mono text-amber-500 font-black">{lastUpdate}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Google AdSense Control Panel */}
        <section className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm p-8 lg:p-10 space-y-10 group hover:border-amber-500/30 transition-all duration-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-2xl group-hover:scale-110 transition-transform">
                <Layout size={26} />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">Google AdSense</h3>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Monetização Híbrida Ativa</p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Status Global</p>
                <button 
                  onClick={() => setAdsense({...adsense, active: !adsense.active})}
                  className={`w-14 h-7 rounded-full p-1 transition-all duration-300 ${adsense.active ? 'bg-emerald-500 shadow-lg shadow-emerald-500/20' : 'bg-slate-300 dark:bg-slate-700'}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform duration-300 ${adsense.active ? 'translate-x-7' : 'translate-x-0'}`} />
                </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">ID do Fornecedor (Publisher ID)</label>
              <input 
                type="text" 
                value={adsense.client} 
                onChange={(e) => setAdsense({...adsense, client: e.target.value})}
                className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-black text-slate-700 dark:text-white focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Script de Ativação do Header</label>
              <textarea 
                rows={3}
                value={adsense.script}
                onChange={(e) => setAdsense({...adsense, script: e.target.value})}
                className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-mono text-[10px] text-emerald-600 dark:text-emerald-400 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none resize-none"
              />
            </div>
            <button 
              onClick={handleSaveAdsense}
              disabled={saving}
              className="w-full py-5 bg-slate-900 dark:bg-slate-800 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:bg-slate-800 flex items-center justify-center gap-2 transition-all shadow-xl hover:-translate-y-1 active:scale-95 disabled:opacity-50"
            >
              {saving ? <RefreshCcw className="animate-spin" size={18}/> : <Save size={18}/>}
              Commit Alterações AdSense
            </button>
          </div>
        </section>

        {/* API Infrastructure & Tools */}
        <section className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm p-8 lg:p-10 space-y-10 group hover:border-emerald-500/30 transition-all duration-500">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-2xl group-hover:scale-110 transition-transform">
              <Zap size={26} />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">API Infrastructure</h3>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Integrações Gemini & Grounding</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ApiToggleItem 
                    label="Grounding" 
                    desc="Busca em tempo real" 
                    active={apiConfig.groundingEnabled} 
                    onToggle={() => setApiConfig({...apiConfig, groundingEnabled: !apiConfig.groundingEnabled})} 
                />
                <ApiToggleItem 
                    label="Search Tools" 
                    desc="Google Search API" 
                    active={apiConfig.searchEnabled} 
                    onToggle={() => setApiConfig({...apiConfig, searchEnabled: !apiConfig.searchEnabled})} 
                />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1 flex items-center gap-2">
                Intervalo de Sincronização (segundos)
              </label>
              <input 
                type="number" 
                value={apiConfig.syncInterval} 
                onChange={(e) => setApiConfig({...apiConfig, syncInterval: e.target.value})}
                className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-black text-slate-700 dark:text-white"
              />
            </div>
            
            <button 
              onClick={handleSaveApi}
              disabled={saving}
              className="w-full py-5 bg-emerald-600 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:bg-emerald-700 flex items-center justify-center gap-2 transition-all shadow-xl shadow-emerald-500/20 hover:-translate-y-1 active:scale-95"
            >
              {saving ? <RefreshCcw className="animate-spin" size={18}/> : <CheckCircle2 size={18}/>}
              Atualizar Core Config
            </button>
          </div>
        </section>
      </div>

      {/* Infrastructure Health Monitor */}
      <section className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-sm p-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
            <div>
                <h4 className="text-sm font-black dark:text-white uppercase tracking-widest flex items-center gap-2">
                  <MonitorCheck size={18} className="text-emerald-500" /> Monitor de Saúde do Cluster
                </h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Status de Latência e Requisições</p>
            </div>
            <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 border border-slate-100 dark:border-slate-700">
                <RefreshCcw size={12} /> Auto-refresh: 10s
            </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <HealthItem label="Core API" status="online" ping="18ms" load="12%" />
          <HealthItem label="Gemini AI Engine" status="online" ping="412ms" load="45%" />
          <HealthItem label="Storage Cluster" status="online" ping="8ms" load="28%" />
        </div>
      </section>

      {/* Protocolo de Emergência */}
      <div className="p-10 bg-rose-50 dark:bg-rose-900/10 rounded-[2.5rem] border border-rose-100 dark:border-rose-900/20 flex flex-col md:flex-row gap-6">
        <div className="p-4 bg-rose-100 dark:bg-rose-900/40 text-rose-600 rounded-2xl h-fit">
            <AlertCircle size={28}/>
        </div>
        <div className="space-y-2">
          <h5 className="font-black text-rose-900 dark:text-rose-400 text-lg uppercase tracking-tighter">Protocolo de Segurança Crítico</h5>
          <p className="text-sm text-rose-800 dark:text-rose-200/60 leading-relaxed font-medium">
            Qualquer alteração nestas configurações afeta instantaneamente o faturamento e a experiência de todos os usuários finais. 
            O cancelamento de anúncios para usuários Free impactará diretamente o LTV (Lifetime Value) do projeto. 
            Prossiga com cautela analítica.
          </p>
          <div className="pt-2">
             <button className="text-[10px] font-black text-rose-600 dark:text-rose-400 uppercase tracking-widest hover:underline flex items-center gap-2">
                Acessar Logs de Erro <ExternalLink size={12}/>
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatusTag = ({ icon, label, color }: any) => (
    <div className={`px-4 py-2 bg-${color}-500/10 text-${color}-600 dark:text-${color}-400 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border border-${color}-500/20`}>
        {icon} {label}
    </div>
);

const ApiToggleItem = ({ label, desc, active, onToggle }: any) => (
    <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700 flex justify-between items-center group/item hover:bg-white dark:hover:bg-slate-800 transition-all">
        <div>
            <p className="text-[10px] font-black text-slate-800 dark:text-white uppercase tracking-widest">{label}</p>
            <p className="text-[9px] text-slate-400 font-bold uppercase">{desc}</p>
        </div>
        <button 
          onClick={onToggle}
          className={`w-10 h-5 rounded-full p-1 transition-all ${active ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}`}
        >
          <div className={`w-3 h-3 bg-white rounded-full transition-transform ${active ? 'translate-x-5' : 'translate-x-0'}`} />
        </button>
    </div>
);

const HealthItem = ({ label, status, ping, load }: any) => (
  <div className="p-8 bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] border border-slate-100 dark:border-slate-700 flex flex-col justify-between gap-4">
    <div className="flex justify-between items-start">
        <div className="space-y-1">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.4)]"></div>
            <span className="text-sm font-black dark:text-white capitalize tracking-tight">{status}</span>
          </div>
        </div>
        <span className="text-[10px] font-black text-slate-400 font-mono bg-white dark:bg-slate-900 px-3 py-1 rounded-lg border border-slate-100 dark:border-slate-700">{ping}</span>
    </div>
    <div className="space-y-2">
        <div className="flex justify-between text-[8px] font-black text-slate-400 uppercase tracking-widest">
            <span>Server Load</span>
            <span>{load}</span>
        </div>
        <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: load }} />
        </div>
    </div>
  </div>
);

export default Admin;
