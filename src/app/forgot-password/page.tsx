"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BadgeCheck,
  CheckCircle2,
  KeyRound,
  Mail,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { FormEvent, useMemo, useState } from "react";

import { AuthToast, useAuthToast } from "@/components/auth/AuthToast";

type RecoveryMode = "email" | "phone";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const bdPhonePattern = /^01\d{9}$/;

function getEmailError(email: string) {
  if (!email.trim()) return "Email is required";
  if (!emailPattern.test(email)) return "Please enter a valid email address";
  if (!email.toLowerCase().endsWith("@gmail.com")) {
    return "Please use a valid Gmail address";
  }
  return "";
}

function getPhoneError(phone: string) {
  const cleanPhone = phone.replace(/\D/g, "");

  if (!cleanPhone.trim()) return "Phone number is required";
  if (!bdPhonePattern.test(cleanPhone)) {
    return "Use a valid Bangladesh phone number, like 017XXXXXXXX";
  }

  return "";
}

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { toast, setToast, showToast } = useAuthToast();

  const [mode, setMode] = useState<RecoveryMode>("email");

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [emailTouched, setEmailTouched] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);

  const [phoneTouched, setPhoneTouched] = useState(false);
  const [phoneFocused, setPhoneFocused] = useState(false);

  const emailError = useMemo(() => getEmailError(email), [email]);
  const phoneError = useMemo(() => getPhoneError(phone), [phone]);

  const isValidGmail = email.length > 0 && !emailError;
  const cleanPhone = phone.replace(/\D/g, "");
  const isValidPhone = cleanPhone.length > 0 && !phoneError;

  const showEmailFeedback = emailTouched && !emailFocused;
  const showEmailSuccess = showEmailFeedback && isValidGmail;
  const showEmailError = showEmailFeedback && !!emailError;

  const showPhoneFeedback = phoneTouched && !phoneFocused;
  const showPhoneSuccess = showPhoneFeedback && isValidPhone;
  const showPhoneError = showPhoneFeedback && !!phoneError;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (mode === "email") {
      setEmailTouched(true);
      setEmailFocused(false);

      if (emailError) {
        showToast("Please enter a valid Gmail address");
        return;
      }

      showToast("OTP sent successfully");

      window.setTimeout(() => {
        router.push(`/verify-otp?email=${encodeURIComponent(email.trim())}`);
      }, 500);

      return;
    }

    setPhoneTouched(true);
    setPhoneFocused(false);

    if (phoneError) {
      showToast("Please enter a valid phone number");
      return;
    }

    showToast("OTP sent successfully");

    window.setTimeout(() => {
      router.push(`/verify-otp?phone=${encodeURIComponent(cleanPhone)}`);
    }, 500);
  };

  const inputClass =
    "h-12 w-full rounded-xl border bg-white pl-11 pr-11 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-sky-500 focus:shadow-[0_0_0_1px_rgba(14,165,233,0.45)]";

  return (
    <>
      <AuthToast toast={toast} onClose={() => setToast(null)} />

      <main className="min-h-screen bg-slate-100 px-4 py-6 text-slate-900 sm:px-6">
        <section className="mx-auto flex min-h-[calc(100vh-48px)] w-full max-w-md items-center justify-center">
          <div className="w-full">
            <div className="mb-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-950 text-white shadow-sm">
                <ShieldCheck className="h-6 w-6" />
              </div>

              <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-700">
                Clinic Admin
              </p>

              <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
                Forgot password?
              </h1>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                Enter your Gmail or phone number and we will send a demo OTP.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
              <div className="mb-5 rounded-xl border border-slate-200 bg-slate-100 p-1">
                <div className="grid grid-cols-2 gap-1">
                  <button
                    type="button"
                    aria-pressed={mode === "email"}
                    onClick={() => {
                      setMode("email");
                      setPhoneTouched(false);
                    }}
                    className={`flex h-11 items-center justify-center gap-2 rounded-lg text-sm font-bold transition ${
                      mode === "email"
                        ? "bg-white text-slate-950 shadow-sm"
                        : "text-slate-500 hover:bg-white/70 hover:text-slate-900"
                    }`}
                  >
                    <Mail className="h-4 w-4" />
                    Email
                  </button>

                  <button
                    type="button"
                    aria-pressed={mode === "phone"}
                    onClick={() => {
                      setMode("phone");
                      setEmailTouched(false);
                    }}
                    className={`flex h-11 items-center justify-center gap-2 rounded-lg text-sm font-bold transition ${
                      mode === "phone"
                        ? "bg-white text-slate-950 shadow-sm"
                        : "text-slate-500 hover:bg-white/70 hover:text-slate-900"
                    }`}
                  >
                    <KeyRound className="h-4 w-4" />
                    Phone
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === "email" ? (
                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-slate-700">
                      Email address
                    </span>

                    <div className="group relative">
                      <Mail className="pointer-events-none absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-slate-400 transition group-focus-within:text-sky-600" />

                      <input
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        onFocus={() => setEmailFocused(true)}
                        onBlur={() => {
                          setEmailFocused(false);
                          setEmailTouched(true);
                        }}
                        placeholder="user@gmail.com"
                        className={`${inputClass} ${
                          showEmailError
                            ? "border-rose-300 focus:border-rose-500 focus:shadow-[0_0_0_1px_rgba(244,63,94,0.45)]"
                            : showEmailSuccess
                              ? "border-emerald-300 focus:border-emerald-500 focus:shadow-[0_0_0_1px_rgba(16,185,129,0.45)]"
                              : "border-slate-200"
                        }`}
                      />

                      {showEmailSuccess ? (
                        <CheckCircle2 className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-emerald-500" />
                      ) : null}
                    </div>

                    {showEmailError ? (
                      <span className="mt-2 block text-sm font-medium text-rose-600">
                        {emailError}
                      </span>
                    ) : showEmailSuccess ? (
                      <span className="mt-2 flex items-center gap-1.5 text-sm font-medium text-emerald-600">
                        <BadgeCheck className="h-4 w-4" />
                        Gmail address looks good
                      </span>
                    ) : null}
                  </label>
                ) : (
                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-slate-700">
                      Phone number
                    </span>

                    <div className="group relative">
                      <Phone className="pointer-events-none absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-slate-400 transition group-focus-within:text-sky-600" />

                      <input
                        inputMode="numeric"
                        value={phone}
                        onChange={(event) => setPhone(event.target.value)}
                        onFocus={() => setPhoneFocused(true)}
                        onBlur={() => {
                          setPhoneFocused(false);
                          setPhoneTouched(true);
                        }}
                        placeholder="017XXXXXXXX"
                        className={`${inputClass} ${
                          showPhoneError
                            ? "border-rose-300 focus:border-rose-500 focus:shadow-[0_0_0_1px_rgba(244,63,94,0.45)]"
                            : showPhoneSuccess
                              ? "border-emerald-300 focus:border-emerald-500 focus:shadow-[0_0_0_1px_rgba(16,185,129,0.45)]"
                              : "border-slate-200"
                        }`}
                      />

                      {showPhoneSuccess ? (
                        <CheckCircle2 className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-emerald-500" />
                      ) : null}
                    </div>

                    {showPhoneError ? (
                      <span className="mt-2 block text-sm font-medium text-rose-600">
                        {phoneError}
                      </span>
                    ) : showPhoneSuccess ? (
                      <span className="mt-2 flex items-center gap-1.5 text-sm font-medium text-emerald-600">
                        <BadgeCheck className="h-4 w-4" />
                        Phone number looks good
                      </span>
                    ) : (
                      <span className="mt-2 block text-xs font-medium text-slate-500">
                        Use Bangladesh format: 017XXXXXXXX
                      </span>
                    )}
                  </label>
                )}

                <button
                  type="submit"
                  className="flex h-12 w-full items-center justify-center rounded-xl bg-slate-950 px-5 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800 active:scale-[0.99] focus:outline-none focus:border-sky-500 focus:shadow-[0_0_0_2px_rgba(14,165,233,0.35)]"
                >
                  Send OTP
                </button>
              </form>

              <Link
                href="/login"
                className="mt-5 block text-center text-sm font-semibold text-sky-700 transition hover:text-sky-950 hover:underline"
              >
                Back to login
              </Link>
            </div>

            <p className="mt-5 text-center text-xs font-medium leading-5 text-slate-500">
              We will send a 6 digit verification code for password recovery.
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
