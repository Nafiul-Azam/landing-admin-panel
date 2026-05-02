"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BadgeCheck,
  Building2,
  CalendarCheck2,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  LockKeyhole,
  Mail,
  Phone,
  ShieldCheck,
  UserPlus,
} from "lucide-react";
import { FormEvent, useMemo, useState } from "react";

import { AuthToast, useAuthToast } from "@/components/auth/AuthToast";

type LoginMode = "email" | "phone";

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

function SocialIconButton({
  label,
  iconSrc,
  onClick,
}: {
  label: string;
  iconSrc: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="flex h-12 w-full items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-sky-300 hover:bg-sky-50 active:scale-[0.98] focus:outline-none focus:border-sky-500 focus:shadow-[0_0_0_1px_rgba(14,165,233,0.45)]"
    >
      <img src={iconSrc} alt="" className="h-5 w-5 object-contain" />
    </button>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const { toast, setToast, showToast } = useAuthToast();

  const [mode, setMode] = useState<LoginMode>("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const emailError = useMemo(() => getEmailError(email), [email]);
  const isValidGmail = email.length > 0 && !emailError;
  const showEmailFeedback = emailTouched && !emailFocused;
  const showEmailSuccess = showEmailFeedback && isValidGmail;
  const showEmailError = showEmailFeedback && !!emailError;

  const cleanPhone = phone.replace(/\D/g, "");
  const isValidPhone = bdPhonePattern.test(cleanPhone);

  const handleEmailLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setEmailTouched(true);
    setEmailFocused(false);
    setPasswordError("");

    if (emailError) return;

    if (!password.trim()) {
      setPasswordError("Password is required");
      return;
    }

    showToast("Sign in clicked");
  };

  const handlePhoneLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPasswordError("");

    if (!bdPhonePattern.test(cleanPhone)) {
      setPhoneError("Use a valid Bangladesh phone number, like 017XXXXXXXX");
      return;
    }

    if (!password.trim()) {
      setPasswordError("Password is required");
      return;
    }

    setPhoneError("");
    router.push(`/verify-otp?phone=${encodeURIComponent(cleanPhone)}`);
  };

  const inputClass =
    "h-12 w-full rounded-xl border bg-white pl-11 pr-11 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-sky-500 focus:shadow-[0_0_0_1px_rgba(14,165,233,0.45)]";

  return (
    <>
      <AuthToast toast={toast} onClose={() => setToast(null)} />

      <main className="min-h-screen bg-slate-100 px-4 py-5 text-slate-900 sm:px-6 lg:px-8">
        <section className="mx-auto flex min-h-[calc(100vh-40px)] w-full max-w-6xl items-center justify-center">
          <div className="grid w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-300/40 lg:grid-cols-[0.9fr_1.1fr]">
            <aside className="relative hidden min-h-[620px] overflow-hidden bg-slate-950 p-8 text-white lg:flex lg:flex-col lg:justify-between">
              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-sky-500/20 blur-3xl" />
              <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />

              <div className="relative">
                <div className="mb-10 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-500">
                    <ShieldCheck className="h-6 w-6" />
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-300">
                      Clinic Admin
                    </p>
                    <h2 className="text-lg font-bold text-white">
                      Secure Login Panel
                    </h2>
                  </div>
                </div>

                <h1 className="max-w-md text-4xl font-bold leading-tight tracking-tight">
                  Simple, secure and clean access for your clinic dashboard.
                </h1>

                <p className="mt-5 max-w-md text-sm leading-7 text-slate-300">
                  Email অথবা phone দিয়ে login করুন। Admin panel, appointment
                  control, doctor access এবং patient request সহজে manage করুন।
                </p>
              </div>

              <div className="relative grid gap-3">
                {[
                  {
                    title: "Secure admin access",
                    icon: ShieldCheck,
                  },
                  {
                    title: "Appointment management ready",
                    icon: CalendarCheck2,
                  },
                  {
                    title: "Clinic workflow friendly",
                    icon: Building2,
                  },
                ].map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.title}
                      className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.06] p-4"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-400/15 text-sky-200">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-sm font-semibold text-slate-100">
                        {item.title}
                      </span>
                    </div>
                  );
                })}
              </div>
            </aside>

            <div className="flex min-h-[620px] items-center justify-center px-4 py-8 sm:px-6 lg:px-10">
              <div className="w-full max-w-[430px]">
                <div className="mb-7 text-center lg:hidden">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-950 text-white">
                    <ShieldCheck className="h-6 w-6" />
                  </div>

                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-700">
                    Clinic Admin
                  </p>

                  <h1 className="mt-1 text-2xl font-bold text-slate-950">
                    Secure Sign In
                  </h1>

                  <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-slate-500">
                    Login with Gmail or phone number to continue.
                  </p>
                </div>

                <div className="hidden lg:mb-7 lg:block">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-700">
                    Welcome Back
                  </p>

                  <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
                    Sign in to continue
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    Use your registered Gmail or Bangladesh phone number to
                    access the clinic admin panel.
                  </p>
                </div>

                <div className="mb-5 rounded-xl border border-slate-200 bg-slate-100 p-1">
                  <div className="grid grid-cols-2 gap-1">
                    <button
                      type="button"
                      aria-pressed={mode === "email"}
                      onClick={() => {
                        setMode("email");
                        setPhoneError("");
                        setPasswordError("");
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
                        setPasswordError("");
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

                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                  {mode === "email" ? (
                    <form onSubmit={handleEmailLogin} className="space-y-4">
                      <label className="block">
                        <span className="mb-2 block text-sm font-semibold text-slate-700">
                          Email address
                        </span>

                        <div className="group relative">
                          <Mail className="pointer-events-none absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-slate-400 transition group-focus-within:text-sky-600" />

                          <input
                            type="email"
                            value={email}
                            onChange={(event) => {
                              setEmail(event.target.value);
                            }}
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

                      <label className="block">
                        <span className="mb-2 block text-sm font-semibold text-slate-700">
                          Password
                        </span>

                        <div className="group relative">
                          <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-slate-400 transition group-focus-within:text-sky-600" />

                          <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(event) => {
                              setPassword(event.target.value);
                              if (passwordError) setPasswordError("");
                            }}
                            placeholder="Enter your password"
                            className={`${inputClass} ${
                              passwordError
                                ? "border-rose-300 focus:border-rose-500 focus:shadow-[0_0_0_1px_rgba(244,63,94,0.45)]"
                                : "border-slate-200"
                            }`}
                          />

                          <button
                            type="button"
                            onClick={() => setShowPassword((value) => !value)}
                            aria-label={
                              showPassword ? "Hide password" : "Show password"
                            }
                            className="absolute right-2.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 active:scale-95"
                          >
                            {showPassword ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </button>
                        </div>

                        {passwordError ? (
                          <span className="mt-2 block text-sm font-medium text-rose-600">
                            {passwordError}
                          </span>
                        ) : null}
                      </label>

                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <label className="flex cursor-pointer select-none items-center gap-2 text-sm font-medium text-slate-600">
                          <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(event) =>
                              setRememberMe(event.target.checked)
                            }
                            className="h-4 w-4 rounded border-slate-300 accent-slate-950"
                          />
                          Remember me
                        </label>

                        <Link
                          href="/forgot-password"
                          className="text-sm font-semibold text-sky-700 transition hover:text-sky-950 hover:underline"
                        >
                          Forgot password?
                        </Link>
                      </div>

                      <button
                        type="submit"
                        className="flex h-12 w-full items-center justify-center rounded-xl bg-slate-950 px-5 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800 active:scale-[0.99] focus:outline-none focus:border-sky-500 focus:shadow-[0_0_0_2px_rgba(14,165,233,0.35)]"
                      >
                        Sign In
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handlePhoneLogin} className="space-y-4">
                      <label className="block">
                        <span className="mb-2 block text-sm font-semibold text-slate-700">
                          Phone number
                        </span>

                        <div className="group relative">
                          <Phone className="pointer-events-none absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-slate-400 transition group-focus-within:text-sky-600" />

                          <input
                            inputMode="numeric"
                            value={phone}
                            onChange={(event) => {
                              setPhone(event.target.value);
                              if (phoneError) setPhoneError("");
                            }}
                            placeholder="017XXXXXXXX"
                            className={`${inputClass} ${
                              phoneError
                                ? "border-rose-300 focus:border-rose-500 focus:shadow-[0_0_0_1px_rgba(244,63,94,0.45)]"
                                : isValidPhone
                                  ? "border-emerald-300 focus:border-emerald-500 focus:shadow-[0_0_0_1px_rgba(16,185,129,0.45)]"
                                  : "border-slate-200"
                            }`}
                          />

                          {isValidPhone ? (
                            <CheckCircle2 className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-emerald-500" />
                          ) : null}
                        </div>

                        {phoneError ? (
                          <span className="mt-2 block text-sm font-medium text-rose-600">
                            {phoneError}
                          </span>
                        ) : isValidPhone ? (
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

                      <label className="block">
                        <span className="mb-2 block text-sm font-semibold text-slate-700">
                          Password
                        </span>

                        <div className="group relative">
                          <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-slate-400 transition group-focus-within:text-sky-600" />

                          <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(event) => {
                              setPassword(event.target.value);
                              if (passwordError) setPasswordError("");
                            }}
                            placeholder="Enter your password"
                            className={`${inputClass} ${
                              passwordError
                                ? "border-rose-300 focus:border-rose-500 focus:shadow-[0_0_0_1px_rgba(244,63,94,0.45)]"
                                : "border-slate-200"
                            }`}
                          />

                          <button
                            type="button"
                            onClick={() => setShowPassword((value) => !value)}
                            aria-label={
                              showPassword ? "Hide password" : "Show password"
                            }
                            className="absolute right-2.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 active:scale-95"
                          >
                            {showPassword ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </button>
                        </div>

                        {passwordError ? (
                          <span className="mt-2 block text-sm font-medium text-rose-600">
                            {passwordError}
                          </span>
                        ) : null}
                      </label>

                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <label className="flex cursor-pointer select-none items-center gap-2 text-sm font-medium text-slate-600">
                          <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(event) =>
                              setRememberMe(event.target.checked)
                            }
                            className="h-4 w-4 rounded border-slate-300 accent-slate-950"
                          />
                          Remember me
                        </label>

                        <Link
                          href="/forgot-password"
                          className="text-sm font-semibold text-sky-700 transition hover:text-sky-950 hover:underline"
                        >
                          Forgot password?
                        </Link>
                      </div>

                      <button
                        type="submit"
                        className="flex h-12 w-full items-center justify-center rounded-xl bg-slate-950 px-5 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800 active:scale-[0.99] focus:outline-none focus:border-sky-500 focus:shadow-[0_0_0_2px_rgba(14,165,233,0.35)]"
                      >
                        Send OTP
                      </button>
                    </form>
                  )}

                  <div className="my-6 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                    <span className="h-px flex-1 bg-slate-200" />
                    Social
                    <span className="h-px flex-1 bg-slate-200" />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <SocialIconButton
                      label="Continue with Google"
                      iconSrc="/google.png"
                      onClick={() => showToast("Google login clicked")}
                    />

                    <SocialIconButton
                      label="Continue with Facebook"
                      iconSrc="/facebook.png"
                      onClick={() => showToast("Facebook login clicked")}
                    />

                    <SocialIconButton
                      label="Continue with Apple"
                      iconSrc="/apple-logo.png"
                      onClick={() => showToast("Apple login clicked")}
                    />
                  </div>

                  <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-center">
                    <p className="text-sm font-medium text-slate-600">
                      Don&apos;t have an account?{" "}
                      <Link
                        href="/register"
                        className="inline-flex items-center gap-1 font-bold text-sky-700 transition hover:text-sky-950 hover:underline"
                      >
                        <UserPlus className="h-4 w-4" />
                        Sign up
                      </Link>
                    </p>
                  </div>
                </div>

                <p className="mt-5 text-center text-xs font-medium leading-5 text-slate-500">
                  By continuing, you agree to access this clinic admin panel
                  securely with your registered account.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
