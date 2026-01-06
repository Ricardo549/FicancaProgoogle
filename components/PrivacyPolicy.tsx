
import React from 'react';
import { ShieldCheck, ArrowLeft, ExternalLink, Lock, Eye, FileText } from 'lucide-react';

interface PrivacyPolicyProps {
  onBack: () => void;
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onBack }) => {
  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-slate-400 hover:text-emerald-600 font-black text-[10px] uppercase tracking-widest transition-all group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        Voltar ao Início
      </button>

      <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
        <div className="p-10 lg:p-14 bg-slate-900 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-10">
            <ShieldCheck size={180} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-emerald-500 rounded-xl">
                <Lock size={20} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400">Jurídico & Compliance</p>
            </div>
            <h1 className="text-4xl font-black tracking-tight">Política de Privacidade</h1>
            <p className="text-slate-400 mt-2 font-medium">Resumo Executivo para Usuários FinanzoPro</p>
          </div>
        </div>

        <div className="p-10 lg:p-14 space-y-12">
          <section className="space-y-4">
            <div className="flex items-center gap-3 text-slate-800 dark:text-white">
              <FileText className="text-emerald-500" size={24} />
              <h2 className="text-xl font-black">FinanzoPro | Inforric Nexus</h2>
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              O FinanzoPro respeita a sua privacidade. Esta é uma versão resumida da nossa Política de Privacidade. 
              Para detalhes completos, consulte a versão integral disponível em nosso site/canal oficial.
            </p>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] border border-slate-100 dark:border-slate-800 space-y-4">
              <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl shadow-sm flex items-center justify-center text-emerald-500">
                <Eye size={24} />
              </div>
              <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-widest text-xs">1. Coleta de Informações</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Coletamos apenas as informações necessárias para o funcionamento do aplicativo e melhoria da sua experiência financeira.
              </p>
            </div>

            <div className="p-8 bg-emerald-50 dark:bg-emerald-900/10 rounded-[2rem] border border-emerald-100 dark:border-emerald-900/30 space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="font-black text-emerald-900 dark:text-emerald-400 uppercase tracking-widest text-xs mb-2">Canal Oficial</h3>
                <p className="text-sm text-emerald-800 dark:text-emerald-300/70 font-medium">
                  Acesse nosso portal para transparência total e gestão de dados.
                </p>
              </div>
              <a 
                href="https://www.ricardocosta.org" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-xl text-emerald-600 dark:text-emerald-400 font-black text-[10px] uppercase tracking-widest shadow-sm hover:scale-[1.02] transition-all"
              >
                Visitar Website <ExternalLink size={14} />
              </a>
            </div>
          </div>

          <div className="pt-10 border-t border-slate-100 dark:border-slate-800 flex flex-col items-center gap-4 text-center">
            <p className="text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-[0.2em]">
              Última atualização: Março de 2024
            </p>
            <div className="flex gap-4">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <div className="w-2 h-2 rounded-full bg-slate-200 dark:bg-slate-700"></div>
              <div className="w-2 h-2 rounded-full bg-slate-200 dark:bg-slate-700"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
