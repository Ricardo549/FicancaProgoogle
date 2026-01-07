
import React, { Component, ErrorInfo, ReactNode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

class ErrorBoundary extends Component<{children: ReactNode}, {hasError: boolean, error: Error | null}> {
  constructor(props: {children: ReactNode}) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-10 bg-rose-50 text-rose-900 min-h-screen flex flex-col items-center justify-center font-sans">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl border border-rose-100 max-w-2xl w-full">
            <h1 className="text-2xl font-black mb-4 flex items-center gap-3">
              <span className="p-2 bg-rose-100 rounded-xl text-rose-600">⚠️</span>
              Erro Inesperado Identificado
            </h1>
            <p className="text-sm font-medium text-rose-700/70 mb-6">
              O sistema encontrou uma falha técnica durante a execução. Detalhes técnicos abaixo:
            </p>
            <pre className="bg-slate-900 text-rose-300 p-6 rounded-2xl overflow-auto text-xs font-mono leading-relaxed mb-8 border border-rose-900/20">
              {this.state.error?.stack || this.state.error?.toString()}
            </pre>
            <button 
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }} 
              className="w-full py-4 bg-rose-600 text-white font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-rose-200 hover:bg-rose-700 transition-all active:scale-95"
            >
              Resetar Dados e Recarregar
            </button>
            <p className="mt-4 text-[10px] text-center text-rose-400 font-bold uppercase tracking-widest">
              Aviso: Resetar dados irá limpar seu cache local para corrigir possíveis corrupções.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
