"use client";

import { CheckCircle2, XCircle } from "lucide-react";

export type PasswordChecks = {
  minLength: boolean;
  uppercase: boolean;
  number: boolean;
  special: boolean;
  noSpaces: boolean;
};

type PasswordChecklistProps = {
  checks: PasswordChecks;
};

const requirements: Array<{ key: keyof PasswordChecks; label: string }> = [
  { key: "minLength", label: "Minimum 8 characters" },
  { key: "uppercase", label: "At least 1 uppercase letter" },
  { key: "number", label: "At least 1 number" },
  { key: "special", label: "At least 1 special character like # @ $ ! %" },
  { key: "noSpaces", label: "No spaces" },
];

export function PasswordChecklist({ checks }: PasswordChecklistProps) {
  return (
    <div className="space-y-2 rounded-2xl border border-white/45 bg-white/30 p-4 text-sm">
      {requirements.map((item) => {
        const passed = checks[item.key];

        return (
          <div key={item.key} className="flex items-center gap-2 text-slate-700">
            {passed ? (
              <CheckCircle2 className="h-4 w-4 flex-none text-emerald-500" />
            ) : (
              <XCircle className="h-4 w-4 flex-none text-rose-500" />
            )}
            <span>{item.label}</span>
          </div>
        );
      })}
    </div>
  );
}
