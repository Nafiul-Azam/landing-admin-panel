"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  CalendarCheck,
  Gauge,
  Globe,
  HeartPulse,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  Stethoscope,
  Users,
} from "lucide-react";

const menuItems = [
  {
    title: "Dashboard",
    shortTitle: "Home",
    href: "/admin",
    icon: Gauge,
  },
  {
    title: "Doctors",
    shortTitle: "Doctors",
    href: "/admin/doctors",
    icon: Stethoscope,
  },
  {
    title: "Patients",
    shortTitle: "Patients",
    href: "/admin/patients",
    icon: Users,
  },
  {
    title: "Appointments",
    shortTitle: "Booking",
    href: "/admin/appointments",
    icon: CalendarCheck,
  },
  {
    title: "Services",
    shortTitle: "Service",
    href: "/admin/services",
    icon: HeartPulse,
  },
  {
    title: "Website Control",
    shortTitle: "Website",
    href: "/admin/website",
    icon: Globe,
  },
  {
    title: "Settings",
    shortTitle: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

function isMenuActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminResponsiveNav() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setCollapsed(
        localStorage.getItem("clinic-admin-sidebar-collapsed") === "true",
      );
    });

    return () => cancelAnimationFrame(frame);
  }, []);

  function toggleSidebar() {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("clinic-admin-sidebar-collapsed", String(next));
      return next;
    });
  }

  function reloadPage() {
    window.location.reload();
  }

  return (
    <>
      <div
        aria-hidden="true"
        className={`hidden shrink-0 transition-all duration-300 lg:block ${
          collapsed ? "w-[82px]" : "w-72"
        }`}
      />

      {/* Desktop Left Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 hidden h-dvh overflow-hidden border-r border-slate-200 bg-white px-3 py-4 shadow-sm transition-all duration-300 lg:flex lg:flex-col ${
          collapsed ? "w-[82px]" : "w-72"
        }`}
      >
        {/* Brand Logo Center */}
        <div className="relative mb-6 flex h-14 items-center justify-center">
          <button
            type="button"
            onClick={reloadPage}
            className={`flex shrink-0 items-center justify-center overflow-hidden transition-all duration-300 active:scale-95 ${
              collapsed ? "h-11 w-11" : "h-12 w-40"
            }`}
            aria-label="Reload page"
            title="Reload page"
          >
            <Image
              src="/update.png"
              alt="Clinic Admin Logo"
              width={160}
              height={48}
              className="h-full w-full object-contain"
              priority
            />
          </button>

          {!collapsed && (
            <button
              type="button"
              onClick={toggleSidebar}
              className="group absolute right-0 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-950 active:scale-95"
              aria-label="Sidebar On"
              title="Sidebar On"
            >
              <PanelLeftClose className="h-[18px] w-[18px]" strokeWidth={2.2} />

              <span className="pointer-events-none absolute right-11 top-1/2 z-50 -translate-y-1/2 whitespace-nowrap rounded-xl bg-slate-950 px-3 py-2 text-xs font-bold text-white opacity-0 shadow-lg transition group-hover:opacity-100">
                Sidebar On
              </span>
            </button>
          )}
        </div>

        {collapsed && (
          <button
            type="button"
            onClick={toggleSidebar}
            className="group mx-auto mb-5 flex h-10 w-10 items-center justify-center rounded-2xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-950 active:scale-95"
            aria-label="Open sidebar"
            title="Open sidebar"
          >
            <PanelLeftOpen className="h-[18px] w-[18px]" strokeWidth={2.2} />
          </button>
        )}

        {/* Desktop Menu */}
        <nav className="grid min-h-0 flex-1 content-start gap-2 overflow-y-auto overflow-x-hidden pr-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isMenuActive(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`group relative flex h-12 items-center rounded-2xl text-sm font-bold transition-all duration-200 active:scale-[0.98] ${
                  collapsed
                    ? "mx-auto w-12 justify-center"
                    : "justify-between px-4"
                } ${
                  active
                    ? "bg-slate-950 text-white"
                    : "bg-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-950 hover:ring-1 hover:ring-slate-200"
                }`}
              >
                <span
                  className={`flex min-w-0 items-center ${
                    collapsed ? "justify-center" : "gap-3"
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 shrink-0 transition-colors duration-200 ${
                      active
                        ? "text-white"
                        : "text-slate-500 group-hover:text-slate-950"
                    }`}
                  />

                  {!collapsed && (
                    <span
                      className={`truncate transition-colors duration-200 ${
                        active
                          ? "text-white"
                          : "text-slate-600 group-hover:text-slate-950"
                      }`}
                    >
                      {item.title}
                    </span>
                  )}
                </span>

                {!collapsed && active && (
                  <span className="h-2 w-2 rounded-full bg-white" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Profile Info */}
        <div className="shrink-0 pt-6">
          <div className={`${collapsed ? "p-2" : "p-3"}`}>
            <div
              className={`flex items-center ${
                collapsed ? "justify-center" : "gap-3"
              }`}
            >
              <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-2xl bg-slate-950 shadow-sm ring-2 ring-white">
                <div
                  className="flex h-full w-full items-center justify-center text-sm font-black text-white"
                  aria-label="MD Nafiul Azam"
                >
                  NA
                </div>

                <span className="absolute bottom-0.5 right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
              </div>

              {!collapsed && (
                <div className="min-w-0">
                  <p className="truncate text-sm font-black text-slate-950">
                    MD Nafiul Azam
                  </p>
                  <p className="mt-0.5 text-xs font-semibold text-slate-500">
                    Admin
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navbar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/35 bg-white/55 shadow-[0_-10px_35px_rgba(15,23,42,0.10)] backdrop-blur-2xl supports-[backdrop-filter]:bg-white/45 lg:hidden">
        <div className="grid grid-cols-7 items-center px-1 pb-[calc(env(safe-area-inset-bottom)+6px)] pt-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isMenuActive(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className="group flex h-[48px] flex-col items-center justify-center gap-1 transition active:scale-95"
              >
                <Icon
                  className={`h-[17px] w-[17px] transition-colors duration-200 ${
                    active
                      ? "text-slate-950"
                      : "text-slate-400 group-hover:text-slate-700"
                  }`}
                />

                <span
                  className={`max-w-full truncate text-[10px] font-bold leading-none transition-colors duration-200 ${
                    active
                      ? "text-slate-950"
                      : "text-slate-400 group-hover:text-slate-700"
                  }`}
                >
                  {item.shortTitle}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
