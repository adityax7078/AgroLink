import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const ToastContext = createContext(undefined);

/**
 * Toast Provider that wraps the application and supplies toast context.
 * 
 * @param {Object} props - Component props.
 * @param {React.ReactNode} props.children - Application nodes.
 */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success', duration = 3000) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type, duration }]);

    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {/* Toast Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

/**
 * Hook to trigger toast notifications.
 * 
 * @returns {{ addToast: (message: string, type?: 'success'|'error'|'info', duration?: number) => void }} Toast trigger.
 */
export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

function ToastItem({ toast, onClose }) {
  const icons = {
    success: <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" />,
    error: <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400 shrink-0" />,
    info: <Info className="h-5 w-5 text-sky-500 dark:text-sky-400 shrink-0" />,
  };

  const borderColors = {
    success: 'border-emerald-100 dark:border-emerald-900/50 bg-emerald-50/90 dark:bg-emerald-950/80',
    error: 'border-red-100 dark:border-red-900/50 bg-red-50/90 dark:bg-red-950/80',
    info: 'border-sky-100 dark:border-sky-900/50 bg-sky-50/90 dark:bg-sky-950/80',
  };

  return (
    <div
      className={`pointer-events-auto flex items-center justify-between gap-3 p-4 border rounded-2xl shadow-lg backdrop-blur-md transition-all duration-300 animate-slide-in-right ${borderColors[toast.type]}`}
    >
      <div className="flex items-center gap-3">
        {icons[toast.type]}
        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{toast.message}</p>
      </div>
      <button
        onClick={onClose}
        className="text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 p-0.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
        aria-label="Dismiss notification"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
