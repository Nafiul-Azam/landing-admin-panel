"use client";

import type { ReactNode } from "react";

type AuthShellProps = {
  children: ReactNode;
  eyebrow?: string;
};

export function AuthShell({ children }: AuthShellProps) {
  return (
    <main className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-[#f7fbff] px-4 py-8 text-slate-900 sm:px-6">
      <style>{`
        @keyframes auth-card-in {
          from { opacity: 0; transform: translateY(12px) scale(0.99); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        @keyframes auth-toast-in {
          from { opacity: 0; transform: translate(-50%, -10px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
      `}</style>

      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(186,230,253,0.55),transparent_34%),linear-gradient(135deg,rgba(240,249,255,0.95),rgba(255,255,255,0.9)_46%,rgba(207,250,254,0.5))]" />
        <div className="absolute left-[8%] top-[14%] h-40 w-40 rounded-full bg-white/55 blur-3xl" />
        <div className="absolute bottom-[10%] right-[12%] h-56 w-56 rounded-full bg-sky-100/70 blur-3xl" />
      </div>

      <section className="w-full max-w-[430px] animate-[auth-card-in_420ms_ease-out] rounded-[28px] border border-white/70 bg-white/65 p-5 shadow-[0_24px_70px_rgba(14,116,144,0.14)] backdrop-blur-2xl sm:p-7">
        {children}
      </section>
    </main>
  );
}
