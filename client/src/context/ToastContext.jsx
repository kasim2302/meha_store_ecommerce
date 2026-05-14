import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

const ToastContext = createContext(null);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};

const ICONS = {
  success: <CheckCircle className="h-5 w-5 text-green-500" />,
  error:   <XCircle    className="h-5 w-5 text-red-500"   />,
  info:    <AlertCircle className="h-5 w-5 text-blue-500"  />,
};

const STYLES = {
  success: 'border-l-4 border-green-400',
  error:   'border-l-4 border-red-400',
  info:    'border-l-4 border-blue-400',
};

const ToastItem = ({ toast, onRemove }) => (
  <div
    className={`flex items-start gap-3 bg-white shadow-xl rounded-2xl px-5 py-4 min-w-[300px] max-w-sm animate-slide-in ${STYLES[toast.type]}`}
    role="alert"
  >
    <div className="flex-shrink-0 mt-0.5">{ICONS[toast.type]}</div>
    <div className="flex-1">
      {toast.title && <p className="font-semibold text-gray-900 text-sm">{toast.title}</p>}
      <p className="text-gray-600 text-sm mt-0.5">{toast.message}</p>
    </div>
    <button
      onClick={() => onRemove(toast.id)}
      className="flex-shrink-0 text-gray-300 hover:text-gray-500 transition-colors"
    >
      <X className="h-4 w-4" />
    </button>
  </div>
);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ type = 'info', title, message, duration = 4000 }) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const toast = {
    success: (message, title) => addToast({ type: 'success', title, message }),
    error:   (message, title) => addToast({ type: 'error',   title, message }),
    info:    (message, title) => addToast({ type: 'info',    title, message }),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3">
        {toasts.map(t => (
          <ToastItem key={t.id} toast={t} onRemove={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};
