"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  BarChart3,
  CalendarCheck,
  Globe,
  LayoutDashboard,
  Settings,
  Stethoscope,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type RangeType = "24h" | "7d" | "15d" | "30d";

// Mock data structure with comprehensive monitoring
const analyticsData: Record<
  RangeType,
  {
    website: {
      views: number;
      visitors: number;
      activity: number;
      seoScore: number;
    };
    doctors: {
      total: number;
      active: number;
      tomorrowAvailable: number;
    };
    patients: {
      total: number;
      today: number;
    };
    appointments: {
      today: number;
      sevenDays: number;
      fifteenDays: number;
      thirtyDays: number;
      pending: number;
      completed: number;
      cancelled: number;
    };
    trafficTrend: { time: string; views: number; visitors: number }[];
    appointmentTrend: { time: string; appointments: number }[];
    doctorPerformance: {
      name: string;
      today: number;
      tomorrow: number;
      performance: number;
    }[];
    patientsByDoctor: {
      name: string;
      patients: number;
      percentage: number;
    }[];
    appointmentStatus: {
      name: string;
      value: number;
      color: string;
    }[];
    websiteSections: { name: string; views: number }[];
  }
> = {
  "24h": {
    website: { views: 1240, visitors: 342, activity: 845, seoScore: 78 },
    doctors: { total: 12, active: 8, tomorrowAvailable: 10 },
    patients: { total: 542, today: 28 },
    appointments: {
      today: 42,
      sevenDays: 258,
      fifteenDays: 542,
      thirtyDays: 1025,
      pending: 8,
      completed: 34,
      cancelled: 2,
    },
    trafficTrend: [
      { time: "00:00", views: 48, visitors: 12 },
      { time: "04:00", views: 35, visitors: 8 },
      { time: "08:00", views: 92, visitors: 28 },
      { time: "12:00", views: 156, visitors: 45 },
      { time: "16:00", views: 128, visitors: 38 },
      { time: "20:00", views: 78, visitors: 26 },
      { time: "23:59", views: 62, visitors: 15 },
    ],
    appointmentTrend: [
      { time: "00:00", appointments: 2 },
      { time: "06:00", appointments: 8 },
      { time: "12:00", appointments: 16 },
      { time: "18:00", appointments: 12 },
      { time: "23:59", appointments: 4 },
    ],
    doctorPerformance: [
      { name: "Dr. Ahmed", today: 6, tomorrow: 7, performance: 96 },
      { name: "Dr. Fatima", today: 5, tomorrow: 6, performance: 94 },
      { name: "Dr. Karim", today: 4, tomorrow: 5, performance: 89 },
      { name: "Dr. Noor", today: 3, tomorrow: 4, performance: 85 },
    ],
    patientsByDoctor: [
      { name: "Dr. Ahmed", patients: 6, percentage: 29 },
      { name: "Dr. Fatima", patients: 5, percentage: 24 },
      { name: "Dr. Karim", patients: 4, percentage: 19 },
      { name: "Dr. Noor", patients: 3, percentage: 14 },
      { name: "Others", patients: 4, percentage: 14 },
    ],
    appointmentStatus: [
      { name: "Completed", value: 34, color: "#0f172a" },
      { name: "Pending", value: 8, color: "#64748b" },
      { name: "Cancelled", value: 2, color: "#cbd5e1" },
    ],
    websiteSections: [
      { name: "Home", views: 245 },
      { name: "Doctors", views: 189 },
      { name: "Patients", views: 156 },
      { name: "Booking", views: 128 },
      { name: "Website", views: 94 },
      { name: "Settings", views: 42 },
    ],
  },
  "7d": {
    website: { views: 8450, visitors: 2180, activity: 5840, seoScore: 82 },
    doctors: { total: 12, active: 10, tomorrowAvailable: 11 },
    patients: { total: 542, today: 156 },
    appointments: {
      today: 258,
      sevenDays: 258,
      fifteenDays: 542,
      thirtyDays: 1025,
      pending: 42,
      completed: 198,
      cancelled: 12,
    },
    trafficTrend: [
      { time: "Mon", views: 980, visitors: 280 },
      { time: "Tue", views: 1125, visitors: 320 },
      { time: "Wed", views: 1245, visitors: 356 },
      { time: "Thu", views: 1420, visitors: 402 },
      { time: "Fri", views: 1680, visitors: 480 },
      { time: "Sat", views: 1245, visitors: 356 },
      { time: "Sun", views: 855, visitors: 245 },
    ],
    appointmentTrend: [
      { time: "Mon", appointments: 32 },
      { time: "Tue", appointments: 38 },
      { time: "Wed", appointments: 35 },
      { time: "Thu", appointments: 42 },
      { time: "Fri", appointments: 45 },
      { time: "Sat", appointments: 38 },
      { time: "Sun", appointments: 28 },
    ],
    doctorPerformance: [
      { name: "Dr. Ahmed", today: 42, tomorrow: 38, performance: 94 },
      { name: "Dr. Fatima", today: 38, tomorrow: 35, performance: 91 },
      { name: "Dr. Karim", today: 31, tomorrow: 28, performance: 87 },
      { name: "Dr. Noor", today: 24, tomorrow: 21, performance: 82 },
    ],
    patientsByDoctor: [
      { name: "Dr. Ahmed", patients: 42, percentage: 32 },
      { name: "Dr. Fatima", patients: 38, percentage: 29 },
      { name: "Dr. Karim", patients: 31, percentage: 23 },
      { name: "Dr. Noor", patients: 24, percentage: 18 },
    ],
    appointmentStatus: [
      { name: "Completed", value: 198, color: "#0f172a" },
      { name: "Pending", value: 42, color: "#64748b" },
      { name: "Cancelled", value: 12, color: "#cbd5e1" },
    ],
    websiteSections: [
      { name: "Home", views: 1680 },
      { name: "Doctors", views: 1425 },
      { name: "Patients", views: 1245 },
      { name: "Booking", views: 945 },
      { name: "Website", views: 745 },
      { name: "Settings", views: 380 },
    ],
  },
  "15d": {
    website: { views: 18900, visitors: 4820, activity: 12840, seoScore: 85 },
    doctors: { total: 12, active: 11, tomorrowAvailable: 12 },
    patients: { total: 542, today: 312 },
    appointments: {
      today: 542,
      sevenDays: 542,
      fifteenDays: 542,
      thirtyDays: 1025,
      pending: 89,
      completed: 421,
      cancelled: 28,
    },
    trafficTrend: [
      { time: "D1", views: 980, visitors: 280 },
      { time: "D5", views: 1420, visitors: 402 },
      { time: "D10", views: 1560, visitors: 445 },
      { time: "D13", views: 1840, visitors: 525 },
      { time: "D15", views: 1485, visitors: 425 },
    ],
    appointmentTrend: [
      { time: "D1", appointments: 32 },
      { time: "D5", appointments: 38 },
      { time: "D10", appointments: 42 },
      { time: "D13", appointments: 45 },
      { time: "D15", appointments: 35 },
    ],
    doctorPerformance: [
      { name: "Dr. Ahmed", today: 89, tomorrow: 82, performance: 95 },
      { name: "Dr. Fatima", today: 76, tomorrow: 72, performance: 92 },
      { name: "Dr. Karim", today: 62, tomorrow: 58, performance: 89 },
      { name: "Dr. Noor", today: 48, tomorrow: 45, performance: 84 },
    ],
    patientsByDoctor: [
      { name: "Dr. Ahmed", patients: 89, percentage: 32 },
      { name: "Dr. Fatima", patients: 76, percentage: 27 },
      { name: "Dr. Karim", patients: 62, percentage: 22 },
      { name: "Dr. Noor", patients: 48, percentage: 17 },
    ],
    appointmentStatus: [
      { name: "Completed", value: 421, color: "#0f172a" },
      { name: "Pending", value: 89, color: "#64748b" },
      { name: "Cancelled", value: 28, color: "#cbd5e1" },
    ],
    websiteSections: [
      { name: "Home", views: 3680 },
      { name: "Doctors", views: 3125 },
      { name: "Patients", views: 2845 },
      { name: "Booking", views: 2145 },
      { name: "Website", views: 1845 },
      { name: "Settings", views: 880 },
    ],
  },
  "30d": {
    website: { views: 38200, visitors: 9840, activity: 26280, seoScore: 88 },
    doctors: { total: 12, active: 12, tomorrowAvailable: 12 },
    patients: { total: 542, today: 582 },
    appointments: {
      today: 1025,
      sevenDays: 1025,
      fifteenDays: 1025,
      thirtyDays: 1025,
      pending: 182,
      completed: 812,
      cancelled: 54,
    },
    trafficTrend: [
      { time: "W1", views: 2120, visitors: 610 },
      { time: "W2", views: 2480, visitors: 720 },
      { time: "W3", views: 2890, visitors: 840 },
      { time: "W4", views: 3120, visitors: 920 },
    ],
    appointmentTrend: [
      { time: "W1", appointments: 245 },
      { time: "W2", appointments: 258 },
      { time: "W3", appointments: 278 },
      { time: "W4", appointments: 264 },
    ],
    doctorPerformance: [
      { name: "Dr. Ahmed", today: 192, tomorrow: 185, performance: 96 },
      { name: "Dr. Fatima", today: 167, tomorrow: 160, performance: 93 },
      { name: "Dr. Karim", today: 142, tomorrow: 135, performance: 90 },
      { name: "Dr. Noor", today: 108, tomorrow: 102, performance: 85 },
    ],
    patientsByDoctor: [
      { name: "Dr. Ahmed", patients: 192, percentage: 32 },
      { name: "Dr. Fatima", patients: 167, percentage: 28 },
      { name: "Dr. Karim", patients: 142, percentage: 23 },
      { name: "Dr. Noor", patients: 108, percentage: 17 },
    ],
    appointmentStatus: [
      { name: "Completed", value: 812, color: "#0f172a" },
      { name: "Pending", value: 182, color: "#64748b" },
      { name: "Cancelled", value: 54, color: "#cbd5e1" },
    ],
    websiteSections: [
      { name: "Home", views: 7240 },
      { name: "Doctors", views: 6320 },
      { name: "Patients", views: 5680 },
      { name: "Booking", views: 4290 },
      { name: "Website", views: 3580 },
      { name: "Settings", views: 1760 },
    ],
  },
};

const rangeButtons: { label: string; value: RangeType }[] = [
  { label: "24 Hours", value: "24h" },
  { label: "7 Days", value: "7d" },
  { label: "15 Days", value: "15d" },
  { label: "30 Days", value: "30d" },
];

const adminCards = [
  {
    title: "Dashboard",
    description: "Preview clinic overview and control summary.",
    href: "/admin",
    icon: LayoutDashboard,
    value: "Active",
  },
  {
    title: "Doctors",
    description: "Manage doctor profiles, specialties, and availability.",
    href: "/admin/doctors",
    icon: Stethoscope,
    value: "12",
  },
  {
    title: "Patients",
    description: "Track patient records and clinic history in one place.",
    href: "/admin/patients",
    icon: Users,
    value: "542",
  },
  {
    title: "Appointments",
    description: "Review bookings and keep daily schedules organized.",
    href: "/admin/appointments",
    icon: CalendarCheck,
    value: "8.2k",
  },
  {
    title: "Website Control",
    description: "Edit public clinic content and service sections.",
    href: "/admin/website",
    icon: Globe,
    value: "Live",
  },
  {
    title: "Settings",
    description: "Control admin preferences and panel configuration.",
    href: "/admin/settings",
    icon: Settings,
    value: "Ready",
  },
];

function ChartFrame({
  children,
  className,
}: {
  children: (size: { width: number; height: number }) => ReactNode;
  className: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const chartElement = element;

    function updateSize() {
      const rect = chartElement.getBoundingClientRect();
      const nextSize = {
        width: Math.floor(rect.width),
        height: Math.floor(rect.height),
      };

      setSize((currentSize) =>
        currentSize.width === nextSize.width &&
        currentSize.height === nextSize.height
          ? currentSize
          : nextSize,
      );
    }

    updateSize();

    const observer = new ResizeObserver(updateSize);
    observer.observe(chartElement);

    window.addEventListener("orientationchange", updateSize);

    return () => {
      observer.disconnect();
      window.removeEventListener("orientationchange", updateSize);
    };
  }, []);

  const hasSize = size.width > 0 && size.height > 0;

  return (
    <div
      ref={ref}
      className={`relative w-full min-w-0 overflow-hidden ${className}`}
    >
      {hasSize ? children(size) : null}
    </div>
  );
}

export default function AdminHomePage() {
  const [selectedRange, setSelectedRange] = useState<RangeType>("7d");

  const data = analyticsData[selectedRange];

  const kpis = useMemo(
    () => [
      {
        label: "Website Views",
        value: data.website.views.toLocaleString(),
        subtext: `${data.website.visitors} visitors`,
      },
      {
        label: "Active Doctors",
        value: `${data.doctors.active}/${data.doctors.total}`,
        subtext: `Tomorrow: ${data.doctors.tomorrowAvailable}`,
      },
      {
        label: "Patients Today",
        value: data.patients.today.toLocaleString(),
        subtext: `Total: ${data.patients.total}`,
      },
      {
        label: "Appointments",
        value: data.appointments.today.toLocaleString(),
        subtext: `Pending: ${data.appointments.pending}`,
      },
      {
        label: "Activity Views",
        value: data.website.activity.toLocaleString(),
        subtext: `SEO: ${data.website.seoScore}%`,
      },
      {
        label: "Time Period",
        value:
          selectedRange === "24h"
            ? "Last 24h"
            : selectedRange === "7d"
              ? "Last 7 days"
              : selectedRange === "15d"
                ? "Last 15 days"
                : "Last 30 days",
        subtext: `${data.appointments.sevenDays} - ${data.appointments.fifteenDays} appointments`,
      },
    ],
    [data, selectedRange],
  );

  return (
    <div className="space-y-3 pb-28 sm:space-y-4 sm:pb-24 lg:pb-0">
      {/* Time Range Filter */}
      <div className="flex flex-wrap gap-2 rounded-2xl bg-slate-50 p-3 sm:p-4">
        {rangeButtons.map((button) => {
          const active = selectedRange === button.value;
          return (
            <button
              key={button.value}
              type="button"
              onClick={() => setSelectedRange(button.value)}
              className={`rounded-xl px-3 py-2 text-xs font-bold transition active:scale-95 sm:px-4 sm:py-2 ${
                active
                  ? "bg-slate-950 text-white shadow-sm"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-950"
              }`}
            >
              {button.label}
            </button>
          );
        })}
      </div>

      {/* KPI Summary Cards */}
      <section className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-6">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="rounded-2xl border border-slate-200 bg-white p-2.5 shadow-sm sm:p-3"
          >
            <p className="text-[9px] font-bold uppercase tracking-[0.06em] text-slate-500 sm:text-[10px]">
              {kpi.label}
            </p>
            <p className="mt-1.5 text-sm font-black text-slate-950 sm:text-base">
              {kpi.value}
            </p>
            <p className="mt-0.5 text-[10px] text-slate-500 sm:text-xs">
              {kpi.subtext}
            </p>
          </div>
        ))}
      </section>

      {/* Website Traffic Chart */}
      <section className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
        <div className="mb-3 flex items-center gap-2 sm:mb-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-950 text-white">
            <TrendingUp className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-base font-black text-slate-950 sm:text-lg">
              Website Traffic
            </h3>
            <p className="text-xs font-semibold text-slate-500">
              Views & visitors
            </p>
          </div>
        </div>

        <ChartFrame className="h-[240px] sm:h-[280px]">
          {({ width, height }) => (
            <AreaChart
              key={`traffic-${selectedRange}`}
              width={width}
              height={height}
              data={data.trafficTrend}
              margin={{ top: 8, right: 4, left: -18, bottom: 0 }}
            >
              <defs>
                <linearGradient id="viewsFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0f172a" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="#0f172a" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="time"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 9, fill: "#94a3b8" }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 9, fill: "#94a3b8" }}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "10px",
                  border: "1px solid #e2e8f0",
                  backgroundColor: "#ffffff",
                  padding: "6px 10px",
                  fontSize: "12px",
                }}
              />
              <Area
                type="monotone"
                dataKey="views"
                name="Views"
                stroke="#0f172a"
                strokeWidth={2}
                fill="url(#viewsFill)"
                animationDuration={700}
              />
            </AreaChart>
          )}
        </ChartFrame>
      </section>

      {/* Appointment Trend & Doctor Performance */}
      <section className="grid gap-3 sm:gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
          <div className="mb-3 flex items-center gap-2 sm:mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-950 text-white">
              <CalendarCheck className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <h3 className="truncate text-base font-black text-slate-950 sm:text-lg">
                Appointment Trend
              </h3>
              <p className="text-xs font-semibold text-slate-500">
                This period
              </p>
            </div>
          </div>

          <ChartFrame className="h-[220px] sm:h-[260px]">
            {({ width, height }) => (
              <AreaChart
                key={`appointments-${selectedRange}`}
                width={width}
                height={height}
                data={data.appointmentTrend}
                margin={{ top: 8, right: 4, left: -18, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="appointmentFill"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#64748b" stopOpacity={0.12} />
                    <stop offset="95%" stopColor="#64748b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="time"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 9, fill: "#94a3b8" }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 9, fill: "#94a3b8" }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "10px",
                    border: "1px solid #e2e8f0",
                    backgroundColor: "#ffffff",
                    padding: "6px 10px",
                    fontSize: "12px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="appointments"
                  name="Appointments"
                  stroke="#64748b"
                  strokeWidth={2}
                  fill="url(#appointmentFill)"
                  animationDuration={700}
                />
              </AreaChart>
            )}
          </ChartFrame>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
          <div className="mb-3 flex items-center gap-2 sm:mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-950 text-white">
              <Stethoscope className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <h3 className="truncate text-base font-black text-slate-950 sm:text-lg">
                Doctor Performance
              </h3>
              <p className="text-xs font-semibold text-slate-500">
                Today vs tomorrow
              </p>
            </div>
          </div>

          <div className="space-y-2">
            {data.doctorPerformance.map((doctor) => (
              <div
                key={doctor.name}
                className="rounded-xl border border-slate-100 bg-slate-50 p-2.5 sm:p-3"
              >
                <div className="flex items-center justify-between">
                  <p className="truncate text-xs font-bold text-slate-950 sm:text-sm">
                    {doctor.name}
                  </p>
                  <p className="ml-1 text-xs font-bold text-slate-950">
                    {doctor.performance}%
                  </p>
                </div>
                <div className="mt-1.5 flex items-center gap-2 text-[10px]">
                  <span className="rounded-full bg-slate-950 px-2 py-0.5 text-white">
                    Today: {doctor.today}
                  </span>
                  <span className="rounded-full bg-slate-200 px-2 py-0.5 text-slate-700">
                    Tomorrow: {doctor.tomorrow}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Patients by Doctor & Appointment Status */}
      <section className="grid gap-3 sm:gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
          <div className="mb-3 flex items-center gap-2 sm:mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-950 text-white">
              <Users className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <h3 className="truncate text-base font-black text-slate-950 sm:text-lg">
                Patients by Doctor
              </h3>
              <p className="text-xs font-semibold text-slate-500">
                Distribution
              </p>
            </div>
          </div>

          <div className="space-y-2">
            {data.patientsByDoctor.map((doctor) => (
              <div
                key={doctor.name}
                className="rounded-xl bg-slate-50 p-2.5 sm:p-3"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-slate-950 sm:text-sm">
                    {doctor.name}
                  </p>
                  <span className="text-xs font-black text-slate-700">
                    {doctor.patients} ({doctor.percentage}%)
                  </span>
                </div>
                <div className="mt-1.5 h-1.5 w-full rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-slate-950 transition-all duration-500"
                    style={{ width: `${doctor.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
          <div className="mb-3 flex items-center gap-2 sm:mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-950 text-white">
              <CalendarCheck className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <h3 className="truncate text-base font-black text-slate-950 sm:text-lg">
                Appointment Status
              </h3>
              <p className="text-xs font-semibold text-slate-500">
                Health check
              </p>
            </div>
          </div>

          <ChartFrame className="h-[200px] sm:h-[240px]">
            {({ width, height }) => (
              <PieChart
                key={`status-${selectedRange}`}
                width={width}
                height={height}
              >
                <Pie
                  data={data.appointmentStatus}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={35}
                  outerRadius={60}
                  paddingAngle={3}
                  animationDuration={700}
                >
                  {data.appointmentStatus.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: "10px",
                    border: "1px solid #e2e8f0",
                    backgroundColor: "#ffffff",
                    padding: "6px 10px",
                    fontSize: "12px",
                  }}
                />
              </PieChart>
            )}
          </ChartFrame>

          <div className="mt-3 space-y-1.5 border-t border-slate-100 pt-3">
            {data.appointmentStatus.map((status) => (
              <div
                key={status.name}
                className="flex items-center justify-between text-xs sm:text-sm"
              >
                <div className="flex items-center gap-1.5">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: status.color }}
                  />
                  <p className="font-semibold text-slate-950">{status.name}</p>
                </div>
                <p className="font-black text-slate-950">{status.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Website Sections */}
      <section className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
        <div className="mb-3 flex items-center gap-2 sm:mb-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-950 text-white">
            <BarChart3 className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-base font-black text-slate-950 sm:text-lg">
              Website Sections
            </h3>
            <p className="text-xs font-semibold text-slate-500">Page views</p>
          </div>
        </div>

        <ChartFrame className="h-[220px] sm:h-[260px]">
          {({ width, height }) => (
            <BarChart
              key={`sections-${selectedRange}`}
              width={width}
              height={height}
              data={data.websiteSections}
              margin={{ top: 8, right: 4, left: -18, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 9, fill: "#94a3b8" }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 9, fill: "#94a3b8" }}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "10px",
                  border: "1px solid #e2e8f0",
                  backgroundColor: "#ffffff",
                  padding: "6px 10px",
                  fontSize: "12px",
                }}
              />
              <Bar
                dataKey="views"
                name="Views"
                radius={[6, 6, 0, 0]}
                fill="#0f172a"
                animationDuration={700}
              />
            </BarChart>
          )}
        </ChartFrame>
      </section>

      {/* Admin Navigation Cards */}
      <section className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 lg:grid-cols-6">
        {adminCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.href}
              href={card.href}
              className="group rounded-2xl border border-slate-200 bg-white p-2.5 shadow-sm transition duration-200 hover:border-slate-300 hover:shadow-md sm:p-3"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-950 text-white transition group-hover:scale-105 sm:h-10 sm:w-10">
                <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </div>
              <h3 className="mt-2 truncate text-xs font-black text-slate-950 sm:text-sm">
                {card.title}
              </h3>
              <p className="mt-0.5 truncate text-[10px] text-slate-500 sm:text-xs">
                {card.value}
              </p>
            </Link>
          );
        })}
      </section>
    </div>
  );
}
