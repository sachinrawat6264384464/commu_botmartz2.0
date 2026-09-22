"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { CheckCircle2, AlertCircle, AlertTriangle, Sparkles, X } from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType>({
  showToast: () => {},
  removeToast: () => {}
});

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: ToastType = "success", duration: number = 4000) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    setToasts((prev) => [...prev.slice(-4), { id, message, type, duration }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  // Expose global window helper for easy integration across non-context modules
  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as any).showToast = showToast;
    }
  }, [showToast]);

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}

      {/* Floating On-Page Toast Notification Container */}
      <div className="fixed top-24 right-4 sm:right-6 z-[99999] flex flex-col gap-2.5 max-w-md w-full pointer-events-none font-mono text-xs">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto p-4 rounded-2xl border shadow-2xl backdrop-blur-xl transition-all duration-300 transform translate-y-0 flex items-start justify-between gap-3 animate-in fade-in slide-in-from-top-4 ${
              t.type === "success"
                ? "bg-slate-900/95 text-emerald-300 border-emerald-500/40 shadow-emerald-500/10"
                : t.type === "error"
                ? "bg-slate-900/95 text-rose-300 border-rose-500/40 shadow-rose-500/10"
                : t.type === "warning"
                ? "bg-slate-900/95 text-amber-300 border-amber-500/40 shadow-amber-500/10"
                : "bg-slate-900/95 text-cyan-300 border-cyan-500/40 shadow-cyan-500/10"
            }`}
          >
            <div className="flex items-start gap-2.5 min-w-0">
              {t.type === "success" && <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />}
              {t.type === "error" && <AlertCircle size={18} className="text-rose-400 shrink-0 mt-0.5" />}
              {t.type === "warning" && <AlertTriangle size={18} className="text-amber-400 shrink-0 mt-0.5" />}
              {t.type === "info" && <Sparkles size={18} className="text-cyan-400 shrink-0 mt-0.5" />}

              <div className="space-y-0.5">
                <div className="font-bold uppercase tracking-wider text-[10px] text-slate-400">
                  {t.type === "success" ? "Success Notification" : t.type === "error" ? "System Alert" : t.type === "warning" ? "Attention Required" : "System Notice"}
                </div>
                <p className="font-sans text-xs text-slate-100 leading-snug font-medium break-words">
                  {t.message}
                </p>
              </div>
            </div>

            <button
              onClick={() => removeToast(t.id)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors shrink-0"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
