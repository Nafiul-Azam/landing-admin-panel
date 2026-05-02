"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, Mail, ShieldCheck } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";

import { AuthShell } from "@/components/auth/AuthShell";
import { AuthToast, useAuthToast } from "@/components/auth/AuthToast";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getEmailError(email: string) {
  if (!email.trim()) return "Email is required";
  if (!emailPattern.test(email)) return "Please enter a valid email address";
  if (!email.toLowerCase().endsWith("@gmail.com")) return "Please use a valid Gmail address";
  return "";
}

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { toast, setToast, showToast } = useAuthToast();
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);

  const emailError = useMemo(() => getEmailError(email), [email]);
  const isValidGmail = email.length > 0 && !emailError;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setTouched(true);

    if (emailError) {
      showToast("Please enter a valid Gmail address");
      return;
    }

    showToast("OTP sent successfully");
    window.setTimeout(() => {
      router.push(`/verify-otp?email=${encodeURIComponent(email.trim())}`);
    }, 500);
  };

  return (
    <>
      <AuthToast toast={toast} onClose={() => setToast(null)} />
      <AuthShell eyebrow="Clinic Admin">
        <div className="mb-7 flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-sky-500 text-white shadow-lg shadow-sky-300/50">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">Secure recovery</p>
            <h1 className="text-2xl font-bold text-slate-950">Forgot password?</h1>
          </div>
        </div>

        <p className="mb-6 text-sm leading-6 text-slate-600">Enter your Gmail address and we will send a demo OTP.</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Email address</span>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                onBlur={() => setTouched(true)}
                placeholder="user@gmail.com"
                className="h-[52px] w-full rounded-2xl border border-white/55 bg-white/55 pl-12 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-300 focus:bg-white/75 focus:ring-4 focus:ring-sky-200/45"
              />
              {isValidGmail ? (
                <CheckCircle2 className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-emerald-500" />
              ) : null}
            </div>
            {touched && emailError ? <span className="mt-2 block text-sm text-rose-600">{emailError}</span> : null}
          </label>

          <button
            type="submit"
            className="h-[52px] w-full rounded-2xl bg-slate-950 px-5 text-sm font-bold text-white shadow-lg shadow-slate-300/60 transition hover:-translate-y-0.5 hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-sky-200"
          >
            Send OTP
          </button>
        </form>

        <Link href="/login" className="mt-6 block text-center text-sm font-semibold text-sky-700 transition hover:text-sky-900">
          Back to login
        </Link>
      </AuthShell>
    </>
  );
}
