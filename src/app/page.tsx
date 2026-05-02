"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  CalendarCheck,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Gauge,
  ShieldCheck,
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
    {
      label: "Current Time",
      value: dashboardTimeInfo.time,
      icon: Clock3,
    },
    {
      label: "Today",
      value: dashboardTimeInfo.weekName,
      icon: CalendarCheck,
    },
    {
      label: "Date",
      value: dashboardTimeInfo.date,
      icon: CheckCircle2,
    },
  ];

  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,#f8fafc_0%,#eef6ff_48%,#f1f5f9_100%)] px-4 py-6 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-48px)] max-w-6xl items-center justify-center">
        <section className="w-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-300/30">
          <div className="grid lg:grid-cols-[1.08fr_0.92fr]">
            {/* Left Section */}
            <div className="p-5 sm:p-7 lg:p-9">
              <div className="mb-7 flex flex-wrap items-center justify-between gap-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-2 text-xs font-bold uppercase tracking-[0.14em] text-emerald-700">
                  <CheckCircle2 className="h-4 w-4" />
                  After Login
                </div>

                <div className="inline-flex items-center gap-2 rounded-full border border-sky-100 bg-sky-50 px-3.5 py-2 text-xs font-semibold text-slate-700">
                  <ShieldCheck className="h-4 w-4 text-sky-700" />
                  Admin Access Active
                </div>
              </div>

              <div className="max-w-2xl">
                <p className="mb-2 text-sm font-bold uppercase tracking-[0.16em] text-sky-700">
                  Clinic Control Panel
                </p>

                <h1 className="text-3xl font-bold leading-tight tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
                  Welcome back,{" "}
                  <span className="bg-gradient-to-r from-sky-600 via-blue-700 to-slate-950 bg-clip-text text-transparent">
                    Nafiul Sir
                  </span>
                </h1>

                <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
                  You are now signed in. Open the admin dashboard to manage
                  doctors, patients, appointments and website control.
                </p>
              </div>

              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                <Link
                  href="/admin"
                  className="group inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-700 to-blue-700 px-5 text-sm font-bold text-white shadow-md shadow-sky-200/70 transition hover:from-sky-800 hover:to-blue-800 active:scale-[0.99] focus:outline-none focus:shadow-[0_0_0_3px_rgba(14,165,233,0.25)]"
                >
                  <span className="text-white">Open Dashboard</span>
                  <ChevronRight className="h-4 w-4 text-white transition group-hover:translate-x-0.5" />
                </Link>

                <Link
                  href="/admin/website"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-800 shadow-sm transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700 active:scale-[0.99] focus:outline-none focus:shadow-[0_0_0_1px_rgba(14,165,233,0.45)]"
                >
                  Website Control
                  <Gauge className="h-4 w-4" />
                </Link>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {stats.map((stat) => {
                  const Icon = stat.icon;

                  return (
                    <div
                      key={stat.label}
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-sky-200 hover:bg-white hover:shadow-sm"
                    >
                      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-sky-700 shadow-sm">
                        <Icon className="h-4 w-4" />
                      </div>

                      <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                        {stat.label}
                      </p>

                      <p className="mt-1 text-base font-bold text-slate-950">
                        {stat.value}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Section */}
            <aside className="border-t border-slate-200 bg-slate-950 p-5 text-white sm:p-7 lg:border-l lg:border-t-0 lg:p-8">
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <p className="text-lg font-bold text-white">Quick Access</p>
                  <p className="mt-1 text-sm leading-6 text-slate-400">
                    Manage important clinic sections faster.
                  </p>
                </div>

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-slate-950 shadow-sm">
                  <Gauge className="h-5 w-5" />
                </div>
              </div>

              <div className="grid gap-3">
                {shortcuts.map((item) => {
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="group flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.06] p-4 transition hover:border-sky-300/40 hover:bg-white/[0.10]"
                    >
                      <span className="flex min-w-0 items-center gap-3">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-sky-200 transition group-hover:bg-sky-500/20 group-hover:text-sky-100">
                          <Icon className="h-5 w-5" />
                        </span>

                        <span className="min-w-0">
                          <span className="block text-sm font-bold text-white">
                            {item.title}
                          </span>

                          <span className="mt-1 block text-xs leading-5 text-slate-400">
                            {item.description}
                          </span>
                        </span>
                      </span>

                      <ChevronRight className="h-4 w-4 shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-white" />
                    </Link>
                  );
                })}
              </div>

              <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.06] p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
                    <ShieldCheck className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-white">
                      Login status active
                    </p>
                    <p className="mt-1 text-xs leading-5 text-slate-400">
                      Your admin session is ready for dashboard management.
                    </p>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </section>
      </div>
    </main>
  );
}
