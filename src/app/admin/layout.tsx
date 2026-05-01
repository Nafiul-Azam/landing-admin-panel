"use client";

import { useEffect, useRef, useState } from "react";
import { AdminResponsiveNav } from "@/components/admin/admin-responsive-nav";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (ticking.current) return;

      ticking.current = true;

      window.requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;

        // Top area te thakle header always show
        if (currentScrollY < 40) {
          setIsHeaderVisible(true);
          setIsScrolled(false);
          lastScrollY.current = currentScrollY;
          ticking.current = false;
          return;
        }

        setIsScrolled(true);

        // Nicher dike scroll korle header hide
        if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
          setIsHeaderVisible(false);
        }

        // Uporer dike scroll korle header show
        if (currentScrollY < lastScrollY.current) {
          setIsHeaderVisible(true);
        }

        lastScrollY.current = currentScrollY;
        ticking.current = false;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 lg:flex">
      <AdminResponsiveNav />

      <div className="min-w-0 flex-1">
        <header
          className={`sticky top-0 z-30 border-b border-slate-200 bg-white/90 px-4 py-4 backdrop-blur transition-all duration-300 ease-in-out lg:px-6 ${
            isHeaderVisible
              ? "translate-y-0 opacity-100"
              : "-translate-y-full opacity-0"
          } ${isScrolled ? "shadow-sm" : "shadow-none"}`}
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-base font-bold text-slate-950 md:text-lg">
                Clinic Admin Panel
              </h1>
              <p className="text-xs text-slate-500">
                Manage your clinic website frontend
              </p>
            </div>

            <div className="rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700">
              Admin
            </div>
          </div>
        </header>

        {/* pb-28 mobile bottom navbar er jonno, jeno content niche hide na hoy */}
        <main className="px-4 py-5 pb-28 lg:px-6 lg:pb-8">{children}</main>
      </div>
    </div>
  );
}
