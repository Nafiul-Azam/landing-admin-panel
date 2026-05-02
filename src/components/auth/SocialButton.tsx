"use client";

import Image from "next/image";

type SocialButtonProps = {
  label: string;
  iconSrc: string;
  onClick: () => void;
};

export function SocialButton({ label, iconSrc, onClick }: SocialButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-12 w-full items-center justify-center gap-3 rounded-2xl border border-white/55 bg-white/45 px-4 text-sm font-semibold text-slate-800 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/70 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-sky-300"
    >
      <Image src={iconSrc} alt="" width={20} height={20} className="h-5 w-5 object-contain" />
      <span>{label}</span>
    </button>
  );
}
