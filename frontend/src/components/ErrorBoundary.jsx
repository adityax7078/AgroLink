import React from 'react';
import { ShieldAlert, RefreshCw, Home } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    // Reset app state
    localStorage.clear(); // Clear storage to resolve corrupted state
    window.location.href = '/';
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden font-sans">
          {/* Glassmorphism glows */}
          <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-red-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl"></div>

          <div className="max-w-md w-full bg-slate-950/80 backdrop-blur-md rounded-3xl border border-red-500/20 p-8 shadow-2xl space-y-6 text-center relative z-10">
            <div className="inline-flex p-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
              <ShieldAlert className="h-10 w-10 text-red-500 animate-pulse" />
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-extrabold tracking-tight text-white">Something Went Wrong</h1>
              <p className="text-sm text-slate-400 font-light leading-relaxed">
                An unexpected rendering error occurred in the AgroLink client interface. No data was lost.
              </p>
            </div>

            {/* Error Message Details */}
            {this.state.error && (
              <div className="text-left bg-slate-900/90 border border-slate-800 p-4 rounded-xl max-h-40 overflow-y-auto font-mono text-[10px] text-red-400/90 space-y-1.5 scrollbar-thin">
                <p className="font-bold text-red-400">Error: {this.state.error.message || this.state.error.toString()}</p>
                {this.state.errorInfo && (
                  <pre className="whitespace-pre-wrap leading-tight text-slate-500 text-[9px]">
                    {this.state.errorInfo.componentStack}
                  </pre>
                )}
              </div>
            )}

            <div className="pt-4 border-t border-slate-800/80 flex flex-col gap-3">
              <button
                onClick={this.handleReload}
                className="w-full bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-bold py-3 rounded-xl shadow-lg shadow-emerald-600/25 transition-all text-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Reload Interface</span>
              </button>
              <button
                onClick={this.handleReset}
                className="w-full border border-slate-700 hover:bg-slate-800/60 text-slate-400 hover:text-slate-200 py-3 rounded-xl transition-all text-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <Home className="h-4 w-4" />
                <span>Reset Local Session & Home</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
