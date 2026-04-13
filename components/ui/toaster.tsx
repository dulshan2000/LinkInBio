"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface ToastProps {
  id: string;
  title?: string;
  description?: string;
  variant?: "default" | "destructive" | "success";
}

interface ToastContextValue {
  toasts: ToastProps[];
  toast: (props: Omit<ToastProps, "id">) => void;
  dismiss: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastProps[]>([]);

  const toast = React.useCallback((props: Omit<ToastProps, "id">) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { ...props, id }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  }, []);

  const dismiss = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

export function Toaster() {
  const [toasts, setToasts] = React.useState<ToastProps[]>([]);

  // Global toast store
  React.useEffect(() => {
    const handler = (e: CustomEvent<Omit<ToastProps, "id">>) => {
      const id = Math.random().toString(36).slice(2);
      setToasts((prev) => [...prev, { ...e.detail, id }]);
      setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
    };
    window.addEventListener("show-toast", handler as EventListener);
    return () => window.removeEventListener("show-toast", handler as EventListener);
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            "glass rounded-xl px-4 py-3 shadow-xl animate-slide-in pointer-events-auto",
            "border min-w-[280px] max-w-sm",
            t.variant === "destructive" && "border-red-500/30 bg-red-950/50",
            t.variant === "success" && "border-green-500/30 bg-green-950/50",
            !t.variant || t.variant === "default" ? "border-violet-500/20" : ""
          )}
        >
          {t.title && <p className="text-sm font-semibold text-foreground">{t.title}</p>}
          {t.description && <p className="text-xs text-zinc-400 mt-0.5">{t.description}</p>}
        </div>
      ))}
    </div>
  );
}

// Global toast function
export function toast(props: Omit<ToastProps, "id">) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("show-toast", { detail: props }));
  }
}
