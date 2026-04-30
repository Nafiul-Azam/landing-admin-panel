"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  CalendarCheck,
  ChevronRight,
  Gauge,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Users,
} from "lucide-react";

const shortcuts = [
  {
    title: "Doctors",
    description: "Manage doctor profiles and availability.",
    href: "/admin/doctors",
    icon: Stethoscope,
  },
  {
    title: "Patients",
    description: "Check patient records and visit history.",
    href: "/admin/patients",
    icon: Users,
  },
  {
    title: "Appointments",
    description: "Review bookings and clinic schedules.",
    href: "/admin/appointments",
    icon: CalendarCheck,
  },
];

type DashboardTimeInfo = {
  time: string;
  weekName: string;
  date: string;
};

function getDashboardTimeInfo(): DashboardTimeInfo {
  const now = new Date();

  return {
    time: new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Dhaka",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    }).format(now),

    weekName: new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Dhaka",
      weekday: "long",
    }).format(now),

    date: new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Dhaka",
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(now),
  };
}

export default function HomePage() {
  const [dashboardTimeInfo, setDashboardTimeInfo] = useState<DashboardTimeInfo>(
    {
      time: "--:--:--",
      weekName: "Loading",
      date: "-- --- ----",
    },
  );

  useEffect(() => {
    const updateTime = () => {
      setDashboardTimeInfo(getDashboardTimeInfo());
    };

    updateTime();

    const timer = window.setInterval(updateTime, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  const stats = [
    { label: "Time", value: dashboardTimeInfo.time },
    { label: "Week", value: dashboardTimeInfo.weekName },
    { label: "Date", value: dashboardTimeInfo.date },
  ];

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.14),_transparent_34%),linear-gradient(180deg,#f8fafc_0%,#eef6ff_100%)] px-4 py-8 text-slate-950 sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl flex-col justify-center">
        <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_24px_90px_rgba(15,23,42,0.10)]">
          <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[1.15fr_0.85fr] lg:p-9">
            {/* Left Welcome Area */}
            <div className="flex flex-col justify-between gap-8 rounded-[1.6rem] p-5 sm:p-7">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-sky-700 shadow-sm">
                  <ShieldCheck className="h-4 w-4" />
                  After Login
                </div>

                <div className="space-y-4">
                  <h1 className="max-w-2xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
                    Welcome, Nafiul Sir.
                  </h1>

                  <p className="max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
                    Your clinic control panel is ready. To preview and manage
                    the page, please click the button below and open the
                    dashboard.
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/admin"
                    className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-2xl bg-slate-950 px-6 py-3.5 text-sm font-bold text-white shadow-[0_12px_30px_rgba(15,23,42,0.20)] transition hover:-translate-y-0.5 hover:bg-slate-900"
                  >
                    <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition duration-700 group-hover:translate-x-full" />

                    <span className="relative z-10 text-white transition duration-300 group-hover:[text-shadow:0_0_12px_rgba(255,255,255,0.95)]">
                      Open Dashboard
                    </span>

                    <ChevronRight className="relative z-10 h-4 w-4 text-white transition group-hover:translate-x-0.5" />
                  </Link>

                  <Link
                    href="/admin/website"
                    className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-2xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white hover:shadow-md"
                  >
                    <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-slate-100 to-transparent transition duration-700 group-hover:translate-x-full" />
                    <span className="relative">Website Control</span>
                    <Gauge className="relative h-4 w-4" />
                  </Link>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                      {stat.label}
                    </p>

                    <p className="mt-2 text-lg font-black text-slate-950">
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Quick Access Area */}
            <div className="rounded-[1.6rem] bg-slate-950 p-5 text-white shadow-inner sm:p-6">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-white">Quick Access</p>
                  <p className="mt-1 text-xs text-slate-400">
                    Click any option to manage fast.
                  </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-slate-950 shadow-[0_0_30px_rgba(255,255,255,0.18)]">
                  <Sparkles className="h-4 w-4" />
                </div>
              </div>

              <div className="space-y-3">
                {shortcuts.map((item) => {
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="group relative flex items-center justify-between overflow-hidden rounded-2xl border border-white/10 bg-white/[0.08] px-4 py-4 shadow-sm transition hover:-translate-y-0.5 hover:border-white/35 hover:bg-white hover:text-slate-950 hover:shadow-[0_16px_40px_rgba(255,255,255,0.14)]"
                    >
                      <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/45 to-transparent transition duration-700 group-hover:translate-x-full" />

                      <span className="relative flex min-w-0 items-center gap-3">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/12 text-white ring-1 ring-white/10 transition group-hover:bg-slate-950 group-hover:text-white group-hover:ring-slate-950">
                          <Icon className="h-4 w-4" />
                        </span>

                        <span className="min-w-0">
                          <span className="block text-sm font-bold text-white transition group-hover:text-slate-950">
                            {item.title}
                          </span>
                          <span className="mt-1 block text-xs leading-5 text-slate-300 transition group-hover:text-slate-600">
                            {item.description}
                          </span>
                        </span>
                      </span>

                      <ChevronRight className="relative h-4 w-4 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-slate-950" />
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
