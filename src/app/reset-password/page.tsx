"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Check,
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
  ShieldCheck,
  X,
} from "lucide-react";
import { FormEvent, Suspense, useMemo, useState } from "react";

import { AuthToast, useAuthToast } from "@/components/auth/AuthToast";

type PasswordChecks = {
  minLength: boolean;
  uppercase: boolean;
  number: boolean;
  special: boolean;
  noSpaces: boolean;
};

function getPasswordChecks(password: string): PasswordChecks {
  return {
    minLength: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /\d/.test(password),
    special: /[#@$!%]/.test(password),
    noSpaces: password.length > 0 && !/\s/.test(password),
  };
}

function PasswordRule({ passed, label }: { passed: boolean; label: string }) {
  return (
    <div
      className={`flex h-9 items-center gap-2 rounded-lg border px-2.5 text-xs font-semibold transition-all duration-300 ${
        passed
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-slate-200 bg-white text-slate-500"
      }`}
    >
      <span
        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
          passed ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-500"
        }`}
      >
        {passed ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
      </span>
      <span className="truncate">{label}</span>
    </div>
  );
}

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast, setToast, showToast } = useAuthToast();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [confirmTouched, setConfirmTouched] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const email = searchParams.get("email") ?? "";

  const checks = useMemo(() => getPasswordChecks(password), [password]);
  const passedCount = Object.values(checks).filter(Boolean).length;
  const allChecksPass = Object.values(checks).every(Boolean);

  const passwordsMatch =
    confirmPassword.length > 0 && password === confirmPassword;

  const showConfirmError =
    (submitted || confirmTouched) &&
    confirmPassword.length > 0 &&
    !passwordsMatch;

  const showConfirmSuccess =
    confirmTouched && confirmPassword.length > 0 && passwordsMatch;

  const canSubmit = allChecksPass && passwordsMatch;

  const strengthWidth = `${(passedCount / 5) * 100}%`;

  const strengthLabel =
    passedCount === 0
      ? "Start typing"
      : passedCount <= 2
        ? "Weak"
        : passedCount <= 4
          ? "Good"
          : "Strong";

  const strengthColor =
    passedCount === 0
      ? "bg-slate-300"
      : passedCount <= 2
        ? "bg-rose-500"
        : passedCount <= 4
          ? "bg-sky-500"
          : "bg-emerald-500";

  const strengthTextColor =
    passedCount === 0
      ? "text-slate-500"
      : passedCount <= 2
        ? "text-rose-600"
        : passedCount <= 4
          ? "text-sky-600"
          : "text-emerald-600";

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    setConfirmTouched(true);

    if (!canSubmit) return;

    showToast("Password reset successfully");

    window.setTimeout(() => {
      router.push("/login");
    }, 800);
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
                Reset password
              </h1>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                {email ? (
                  <>
                    Create a new password for{" "}
                    <span className="font-semibold text-slate-800">
                      {email}
                    </span>
                    .
                  </>
                ) : (
                  "Create a new password for your clinic admin account."
                )}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
              <form onSubmit={handleSubmit} className="space-y-4">
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">
                    New password
                  </span>

                  <div className="group relative">
                    <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-slate-400 transition group-focus-within:text-sky-600" />

                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="#Username1234"
                      className={`${inputClass} ${
                        submitted && !allChecksPass
                          ? "border-rose-300 focus:border-rose-500 focus:shadow-[0_0_0_1px_rgba(244,63,94,0.45)]"
                          : allChecksPass
                            ? "border-emerald-300 focus:border-emerald-500 focus:shadow-[0_0_0_1px_rgba(16,185,129,0.45)]"
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
                </label>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 transition-all duration-300">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                        Password strength
                      </p>
                      <p
                        className={`mt-0.5 text-sm font-bold ${strengthTextColor}`}
                      >
                        {strengthLabel} · {passedCount}/5
                      </p>
                    </div>

                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-full transition-all duration-300 ${
                        allChecksPass
                          ? "bg-emerald-100 text-emerald-600"
                          : "bg-white text-slate-400"
                      }`}
                    >
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                  </div>

                  <div className="mb-3 h-2 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${strengthColor}`}
                      style={{ width: strengthWidth }}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <PasswordRule
                      passed={checks.minLength}
                      label="8+ characters"
                    />
                    <PasswordRule passed={checks.uppercase} label="Uppercase" />
                    <PasswordRule passed={checks.number} label="Number" />
                    <PasswordRule passed={checks.noSpaces} label="No spaces" />
                    <div className="col-span-2">
                      <PasswordRule
                        passed={checks.special}
                        label="Special character: # @ $ ! %"
                      />
                    </div>
                  </div>
                </div>

                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">
                    Confirm password
                  </span>

                  <div className="group relative">
                    <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-slate-400 transition group-focus-within:text-sky-600" />

                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onBlur={() => setConfirmTouched(true)}
                      onChange={(event) => {
                        setConfirmPassword(event.target.value);
                        if (!confirmTouched) setConfirmTouched(true);
                      }}
                      placeholder="Confirm your password"
                      className={`${inputClass} ${
                        showConfirmError
                          ? "border-rose-300 focus:border-rose-500 focus:shadow-[0_0_0_1px_rgba(244,63,94,0.45)]"
                          : showConfirmSuccess
                            ? "border-emerald-300 focus:border-emerald-500 focus:shadow-[0_0_0_1px_rgba(16,185,129,0.45)]"
                            : "border-slate-200"
                      }`}
                    />

                    {showConfirmSuccess ? (
                      <CheckCircle2 className="absolute right-11 top-1/2 h-5 w-5 -translate-y-1/2 text-emerald-500" />
                    ) : null}

                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((value) => !value)}
                      aria-label={
                        showConfirmPassword
                          ? "Hide confirm password"
                          : "Show confirm password"
                      }
                      className="absolute right-2.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 active:scale-95"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>

                  {showConfirmError ? (
                    <span className="mt-2 block text-sm font-medium text-rose-600">
                      Passwords do not match
                    </span>
                  ) : showConfirmSuccess ? (
                    <span className="mt-2 flex items-center gap-1.5 text-sm font-medium text-emerald-600">
                      <CheckCircle2 className="h-4 w-4" />
                      Password matched
                    </span>
                  ) : null}
                </label>

                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="flex h-12 w-full items-center justify-center rounded-xl bg-slate-950 px-5 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 disabled:hover:bg-slate-300 focus:outline-none focus:shadow-[0_0_0_2px_rgba(14,165,233,0.35)]"
                >
                  Reset Password
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
              Password must be strong before you can continue.
            </p>
          </div>
        </section>
      </main>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordContent />
    </Suspense>
  );
}
