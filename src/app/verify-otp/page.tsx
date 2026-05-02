"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { KeyboardEvent, Suspense, useMemo, useRef, useState } from "react";
import { KeyRound, ShieldCheck } from "lucide-react";

import { AuthToast, useAuthToast } from "@/components/auth/AuthToast";

const OTP_LENGTH = 6;
const DEMO_OTP = "123456";

function VerifyOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast, setToast, showToast } = useAuthToast();

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [error, setError] = useState("");
  const [isClearing, setIsClearing] = useState(false);
  const [clearingIndex, setClearingIndex] = useState<number | null>(null);

  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const email = searchParams.get("email") ?? "";
  const phone = searchParams.get("phone") ?? "";
  const destinationLabel = email || phone || "your account";

  const otpValue = useMemo(() => otp.join(""), [otp]);

  const focusInput = (index: number) => {
    const safeIndex = Math.max(0, Math.min(index, OTP_LENGTH - 1));
    inputRefs.current[safeIndex]?.focus();
    inputRefs.current[safeIndex]?.select();
  };

  const applyOtpValue = (value: string, startIndex = 0) => {
    const cleanDigits = value.replace(/\D/g, "").slice(0, OTP_LENGTH);

    if (!cleanDigits) return;

    setOtp((current) => {
      const next = [...current];

      if (cleanDigits.length >= OTP_LENGTH || startIndex === 0) {
        cleanDigits.split("").forEach((digit, digitIndex) => {
          if (digitIndex < OTP_LENGTH) {
            next[digitIndex] = digit;
          }
        });
      } else {
        cleanDigits.split("").forEach((digit, digitIndex) => {
          const targetIndex = startIndex + digitIndex;
          if (targetIndex < OTP_LENGTH) {
            next[targetIndex] = digit;
          }
        });
      }

      return next;
    });

    const targetFocusIndex =
      cleanDigits.length >= OTP_LENGTH
        ? OTP_LENGTH - 1
        : Math.min(startIndex + cleanDigits.length, OTP_LENGTH - 1);

    window.setTimeout(() => focusInput(targetFocusIndex), 0);
    setError("");
  };

  const handleOtpChange = (value: string, index: number) => {
    const cleanDigits = value.replace(/\D/g, "");

    if (!cleanDigits) {
      setOtp((current) => {
        const next = [...current];
        next[index] = "";
        return next;
      });

      setError("");
      return;
    }

    if (cleanDigits.length > 1) {
      applyOtpValue(cleanDigits, index);
      return;
    }

    setOtp((current) => {
      const next = [...current];
      next[index] = cleanDigits;
      return next;
    });

    setError("");

    if (index < OTP_LENGTH - 1) {
      window.setTimeout(() => focusInput(index + 1), 0);
    }
  };

  const handleOtpKeyDown = (
    event: KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    const isShortcut = event.ctrlKey || event.metaKey;

    if (isShortcut) {
      const shortcutKey = event.key.toLowerCase();

      if (
        shortcutKey === "v" ||
        shortcutKey === "c" ||
        shortcutKey === "x" ||
        shortcutKey === "a"
      ) {
        return;
      }
    }

    if (event.key === "Backspace") {
      event.preventDefault();
      setError("");

      setOtp((current) => {
        const next = [...current];

        if (next[index]) {
          next[index] = "";
          window.setTimeout(() => focusInput(Math.max(index - 1, 0)), 0);
          return next;
        }

        if (index > 0) {
          next[index - 1] = "";
          window.setTimeout(() => focusInput(index - 1), 0);
        }

        return next;
      });

      return;
    }

    if (event.key === "ArrowLeft" && index > 0) {
      event.preventDefault();
      focusInput(index - 1);
      return;
    }

    if (event.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      event.preventDefault();
      focusInput(index + 1);
      return;
    }

    if (event.key.length === 1 && !/\d/.test(event.key)) {
      event.preventDefault();
    }
  };

  const clearOtpWithAnimation = (toastMessage?: string) => {
    if (isClearing) return;

    setError("");
    setIsClearing(true);

    for (let index = OTP_LENGTH - 1; index >= 0; index -= 1) {
      const delay = (OTP_LENGTH - 1 - index) * 80;

      window.setTimeout(() => {
        setClearingIndex(index);

        setOtp((current) => {
          const next = [...current];
          next[index] = "";
          return next;
        });
      }, delay);
    }

    window.setTimeout(
      () => {
        setClearingIndex(null);
        setIsClearing(false);
        focusInput(0);

        if (toastMessage) {
          showToast(toastMessage);
        }
      },
      OTP_LENGTH * 80 + 140,
    );
  };

  const handleResetOtp = () => {
    clearOtpWithAnimation("OTP cleared");
  };

  const handleResendOtp = () => {
    clearOtpWithAnimation("OTP resent successfully");
  };

  const handleVerify = () => {
    if (otpValue.length !== OTP_LENGTH) {
      setError("Please enter the 6 digit OTP");

      const firstEmptyIndex = otp.findIndex((digit) => !digit);
      focusInput(firstEmptyIndex === -1 ? 0 : firstEmptyIndex);
      return;
    }

    if (otpValue !== DEMO_OTP) {
      setError("Wrong OTP. Use demo OTP 123456");
      focusInput(0);
      return;
    }

    const target = email
      ? `/reset-password?email=${encodeURIComponent(email)}`
      : "/reset-password";

    router.push(target);
  };

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
                Verify OTP
              </h1>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                OTP sent to{" "}
                <span className="font-semibold text-slate-800">
                  {destinationLabel}
                </span>
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
              <div className="mb-5 flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-600">
                <KeyRound className="h-5 w-5 text-sky-600" />
                <span>Demo OTP:</span>
                <span className="font-bold text-slate-950">{DEMO_OTP}</span>
              </div>

              <div
                className="grid grid-cols-6 gap-2 sm:gap-3"
                onPaste={(event) => {
                  event.preventDefault();

                  const pastedText = event.clipboardData.getData("text");
                  const activeIndex = inputRefs.current.findIndex(
                    (input) => input === document.activeElement,
                  );

                  applyOtpValue(
                    pastedText,
                    activeIndex === -1 ? 0 : activeIndex,
                  );
                }}
              >
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(node) => {
                      inputRefs.current[index] = node;
                    }}
                    inputMode="numeric"
                    autoComplete={index === 0 ? "one-time-code" : "off"}
                    maxLength={OTP_LENGTH}
                    value={digit}
                    onChange={(event) =>
                      handleOtpChange(event.target.value, index)
                    }
                    onFocus={(event) => event.target.select()}
                    onPaste={(event) => {
                      event.preventDefault();
                      applyOtpValue(event.clipboardData.getData("text"), index);
                    }}
                    onKeyDown={(event) => handleOtpKeyDown(event, index)}
                    aria-label={`OTP digit ${index + 1}`}
                    disabled={isClearing}
                    className={`aspect-square min-w-0 rounded-xl border bg-white text-center text-xl font-bold text-slate-950 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-sky-500 focus:shadow-[0_0_0_1px_rgba(14,165,233,0.45)] disabled:cursor-not-allowed ${
                      digit
                        ? "border-emerald-300 bg-emerald-50/40 text-emerald-700"
                        : "border-slate-200"
                    } ${
                      clearingIndex === index
                        ? "scale-90 rotate-[-2deg] border-sky-300 bg-sky-50 text-transparent opacity-70"
                        : "scale-100 rotate-0 opacity-100"
                    }`}
                  />
                ))}
              </div>

              {error ? (
                <p className="mt-3 text-sm font-medium text-rose-600">
                  {error}
                </p>
              ) : null}

              <div className="mt-4 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleResetOtp}
                  disabled={isClearing}
                  className="flex h-10 items-center justify-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:border-sky-500 focus:shadow-[0_0_0_1px_rgba(14,165,233,0.45)]"
                >
                  Reset OTP
                </button>

                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={isClearing}
                  className="flex h-10 items-center justify-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:border-sky-500 focus:shadow-[0_0_0_1px_rgba(14,165,233,0.45)]"
                >
                  Resend OTP
                </button>
              </div>

              <button
                type="button"
                onClick={handleVerify}
                disabled={isClearing}
                className="mt-3 flex h-12 w-full items-center justify-center rounded-xl bg-slate-950 px-5 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:shadow-[0_0_0_2px_rgba(14,165,233,0.35)]"
              >
                Verify OTP
              </button>

              <Link
                href="/forgot-password"
                className="mt-5 block text-center text-sm font-semibold text-sky-700 transition hover:text-sky-950 hover:underline"
              >
                Back to forgot password
              </Link>
            </div>

            <p className="mt-5 text-center text-xs font-medium leading-5 text-slate-500">
              Enter the 6 digit verification code to continue securely.
            </p>
          </div>
        </section>
      </main>
    </>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={null}>
      <VerifyOtpContent />
    </Suspense>
  );
}
