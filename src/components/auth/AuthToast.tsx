"use client";

import { CheckCircle2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

type ToastState = {
  id: number;
  message: string;
};

export function useAuthToast() {
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = useCallback((message: string) => {
    setToast({ id: Date.now(), message });
  }, []);

  return { toast, setToast, showToast };
}

type AuthToastProps = {
  toast: ToastState | null;
  onClose: () => void;
};

export function AuthToast({ toast, onClose }: AuthToastProps) {
  useEffect(() => {
    if (!toast) return;

    const timer = window.setTimeout(onClose, 2200);
    return () => window.clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  return (
    <div className="fixed left-1/2 top-5 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 animate-[auth-toast-in_220ms_ease-out] rounded-2xl border border-white/60 bg-white/80 px-4 py-3 text-sm font-medium text-slate-800 shadow-xl shadow-sky-200/40 backdrop-blur-xl">
      <div className="flex items-center gap-2">
        <CheckCircle2 className="h-5 w-5 flex-none text-emerald-500" />
        <span>{toast.message}</span>
      </div>
    </div>
  );
}
