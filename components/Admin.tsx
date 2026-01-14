
import React from 'react';
import { ShieldCheck, Database, RefreshCcw, Activity } from 'lucide-react';

const Admin: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="bg-slate-900 rounded-[2.5rem] p-12 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          <ShieldCheck size={280}/>
        </div>
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500 rounded-2xl">
              <Database size={24} className="text-slate-900"/>
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tighter">Root Console</h2>
          </div>
          <p className="text-slate-400 font-medium text-sm">Acesso restrito à infraestrutura do sistema.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <HealthMetric label="API Gateway" status="Healthy" load="15%" />
        <HealthMetric label="Gemini Engine" status="Active" load="32%" />
        <HealthMetric label="Cloud DB" status="Synced" load="8%" />
      </div>
    </div>
  );
};

const HealthMetric = ({ label, status, load }: any) => (
  <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
    <div className="flex justify-between items-center">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
      <Activity size={14} className="text-emerald-500" />
    </div>
    <h4 className="text-lg font-black tracking-tight">{status}</h4>
    <div className="space-y-1.5">
      <div className="flex justify-between text-[8px] font-black text-slate-400 uppercase tracking-widest">
        <span>Load</span>
        <span>{load}</span>
      </div>
      <div className="h-1 bg-slate-100 dark:bg-slate-800 rounded-full">
        <div className="h-full bg-emerald-500" style={{ width: load }} />
      </div>
    </div>
  </div>
);

export default Admin;
