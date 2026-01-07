
import React, { useState } from 'react';
import { 
  CreditCard, 
  CheckCircle, 
  ArrowLeft, 
  ShieldCheck, 
  Zap, 
  Star, 
  Lock, 
  Loader2, 
  ChevronRight,
  QrCode,
  FileText,
  BadgeCheck,
  Sparkles
} from 'lucide-react';

interface CheckoutProps {
  onCancel: () => void;
  onSuccess: () => void;
  user: any;
}

type PaymentMethod = 'STRIPE' | 'MERCADOPAGO';
type Step = 'PLANS' | 'PAYMENT' | 'PROCESSING' | 'SUCCESS';

const Checkout: React.FC<CheckoutProps> = ({ onCancel, onSuccess, user }) => {
  const [step, setStep] = useState<Step>('PLANS');
  const [method, setMethod] = useState<PaymentMethod>('STRIPE');
  const [loading, setLoading] = useState(false);

  const plans = {
    pro: {
      name: 'Finanzo Pro',
      price: 'R$ 29,90',
      period: 'por mês',
      features: [
        'Insights Financeiros com IA Ilimitados',
        'Extração de Extratos via IA Gemini',
        'Relatórios de Investimentos Avançados',
        'Simulador de Crédito (SAC/PRICE)',
        'Personalização Visual de Categorias',
        'Exportação de Dados em CSV/PDF',
        'Acesso prioritário a novas ferramentas'
      ]
    }
  };

  const handleStartPayment = () => {
    setStep('PAYMENT');
  };

  const handleConfirmPayment = () => {
    setLoading(true);
    setStep('PROCESSING');
    
    // Simulação de processamento de pagamento (Stripe/Mercado Pago)
    setTimeout(() => {
      setLoading(false);
      setStep('SUCCESS');
    }, 3500);
  };

  const renderPlans = () => (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">Escolha sua Liberdade</h2>
        <p className="text-slate-500 dark:text-slate-400 font-medium max-w-lg mx-auto leading-relaxed">
          Desbloqueie o poder total da inteligência financeira e leve sua gestão de patrimônio para o próximo nível.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        {/* Plano Atual */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm opacity-60 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Plano Atual</span>
            <h3 className="text-2xl font-black text-slate-800 dark:text-white mt-1">Free Tier</h3>
            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
                <CheckCircle size={18} className="text-slate-300" /> Dashboard Básico
              </div>
              <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
                <CheckCircle size={18} className="text-slate-300" /> Fluxo de Caixa Simples
              </div>
              <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
                <CheckCircle size={18} className="text-slate-300" /> Anúncios Ativados
              </div>
            </div>
          </div>
          <button disabled className="w-full py-4 mt-12 bg-slate-100 dark:bg-slate-800 text-slate-400 font-black text-xs uppercase tracking-widest rounded-2xl cursor-not-allowed">
            Ativo
          </button>
        </div>

        {/* Plano Pro */}
        <div className="bg-slate-900 dark:bg-emerald-950 p-1 rounded-[2.5rem] shadow-2xl relative group transform hover:-translate-y-2 transition-all duration-500">
          <div className="absolute -top-4 -right-4 bg-amber-500 text-slate-900 font-black text-[10px] uppercase tracking-widest px-4 py-1 rounded-full shadow-lg z-10 animate-bounce">
            Recomendado
          </div>
          <div className="bg-slate-900 dark:bg-emerald-950 p-8 rounded-[2.4rem] h-full flex flex-col justify-between border border-white/10">
            <div>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-500 rounded-2xl text-white shadow-lg shadow-emerald-500/20">
                  <Star size={24} fill="currentColor" />
                </div>
                <h3 className="text-2xl font-black text-white mt-1">Finanzo Pro</h3>
              </div>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-black text-white">{plans.pro.price}</span>
                <span className="text-sm font-bold text-slate-400">/mês</span>
              </div>
              <div className="mt-8 space-y-4">
                {plans.pro.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm font-bold text-slate-300">
                    <CheckCircle size={18} className="text-emerald-500" /> {feature}
                  </div>
                ))}
              </div>
            </div>
            <button 
              onClick={handleStartPayment}
              className="w-full py-5 mt-12 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 group"
            >
              Fazer Upgrade Agora <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPaymentSelection = () => (
    <div className="max-w-2xl mx-auto space-y-10 animate-in slide-in-from-bottom-6 duration-500">
      <div className="flex items-center gap-4">
        <button onClick={() => setStep('PLANS')} className="p-3 bg-white dark:bg-slate-800 rounded-2xl text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Checkout Seguro</h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Conclua seu upgrade para o plano Pro</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button 
          onClick={() => setMethod('STRIPE')}
          className={`p-6 rounded-[2rem] border-2 text-left transition-all relative overflow-hidden group ${method === 'STRIPE' ? 'border-indigo-500 bg-indigo-50/10' : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50'}`}
        >
          <div className="flex items-center justify-between mb-4">
             <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 rounded-xl">
               <CreditCard size={24} />
             </div>
             {method === 'STRIPE' && <CheckCircle size={20} className="text-indigo-500" />}
          </div>
          <h4 className="font-black text-slate-800 dark:text-white text-sm">Cartão via Stripe</h4>
          <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Internacional & Instantâneo</p>
          <div className="absolute -bottom-4 -right-4 opacity-[0.05] group-hover:scale-110 transition-transform">
            <ShieldCheck size={100} />
          </div>
        </button>

        <button 
          onClick={() => setMethod('MERCADOPAGO')}
          className={`p-6 rounded-[2rem] border-2 text-left transition-all relative overflow-hidden group ${method === 'MERCADOPAGO' ? 'border-blue-500 bg-blue-50/10' : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50'}`}
        >
          <div className="flex items-center justify-between mb-4">
             <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-xl">
               <QrCode size={24} />
             </div>
             {method === 'MERCADOPAGO' && <CheckCircle size={20} className="text-blue-500" />}
          </div>
          <h4 className="font-black text-slate-800 dark:text-white text-sm">PIX via Mercado Pago</h4>
          <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Pagamento Local & Seguro</p>
          <div className="absolute -bottom-4 -right-4 opacity-[0.05] group-hover:scale-110 transition-transform">
            <Zap size={100} />
          </div>
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex justify-between items-center pb-6 border-b border-slate-50 dark:border-slate-800">
          <div>
            <h4 className="font-black text-slate-800 dark:text-white">Assinatura Finanzo Pro</h4>
            <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Renovação Mensal Automática</p>
          </div>
          <span className="text-2xl font-black text-slate-900 dark:text-white">R$ 29,90</span>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <Lock size={14} className="text-emerald-500" /> Ambiente Criptografado TLS 1.3
          </div>
          <button 
            onClick={handleConfirmPayment}
            className="w-full py-5 bg-slate-900 dark:bg-emerald-600 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3"
          >
            Confirmar e Assinar Agora
          </button>
        </div>
      </div>
    </div>
  );

  const renderProcessing = () => (
    <div className="max-w-md mx-auto py-24 text-center space-y-8 animate-in zoom-in duration-500">
      <div className="relative inline-block">
        <div className="w-24 h-24 border-4 border-slate-100 dark:border-slate-800 border-t-emerald-500 rounded-full animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <ShieldCheck size={32} className="text-emerald-500 animate-pulse" />
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Processando seu Upgrade</h3>
        <p className="text-slate-500 dark:text-slate-400 font-medium">Comunicação segura via {method === 'STRIPE' ? 'Stripe Gateway' : 'Mercado Pago Engine'}...</p>
      </div>
      <div className="flex justify-center gap-2">
        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></span>
      </div>
    </div>
  );

  const renderSuccess = () => (
    <div className="max-w-2xl mx-auto py-12 text-center space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="inline-flex p-8 bg-emerald-600 text-white rounded-[3rem] shadow-2xl shadow-emerald-500/30 animate-bounce">
        <BadgeCheck size={80} />
      </div>
      
      <div className="space-y-4">
        <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">Upgrade Concluído!</h2>
        <p className="text-slate-500 dark:text-slate-400 font-medium max-w-sm mx-auto leading-relaxed">
          Parabéns, <strong>{user.name}</strong>! Você agora faz parte do nível Pro. Suas ferramentas avançadas já estão disponíveis.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-6 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm">
          <Zap size={24} className="text-amber-500 mx-auto mb-3" />
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Poder de IA</p>
          <p className="text-xs font-bold dark:text-white mt-1">Ilimitado</p>
        </div>
        <div className="p-6 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm">
          <FileText size={24} className="text-blue-500 mx-auto mb-3" />
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Relatórios</p>
          <p className="text-xs font-bold dark:text-white mt-1">Avançados</p>
        </div>
        <div className="p-6 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm">
          <Sparkles size={24} className="text-emerald-500 mx-auto mb-3" />
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Experiência</p>
          <p className="text-xs font-bold dark:text-white mt-1">Sem Ads</p>
        </div>
      </div>

      <button 
        onClick={onSuccess}
        className="w-full py-5 bg-slate-900 dark:bg-white dark:text-slate-900 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-2xl hover:scale-[1.02] transition-all"
      >
        Ir para o Painel Pro
      </button>
    </div>
  );

  return (
    <div className="min-h-full pb-32">
      {step === 'PLANS' && renderPlans()}
      {step === 'PAYMENT' && renderPaymentSelection()}
      {step === 'PROCESSING' && renderProcessing()}
      {step === 'SUCCESS' && renderSuccess()}

      {step === 'PLANS' && (
        <div className="mt-12 flex justify-center">
           <button 
            onClick={onCancel}
            className="flex items-center gap-2 text-slate-400 hover:text-rose-500 font-black text-[10px] uppercase tracking-[0.2em] transition-all"
           >
            <X size={14} /> Cancelar Upgrade
           </button>
        </div>
      )}
    </div>
  );
};

const X = ({ size, className }: { size: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
  </svg>
);

export default Checkout;
