import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarCheck,
  Globe,
  Stethoscope,
  Users,
} from "lucide-react";

const sectionConfig = {
  doctors: {
    title: "Doctors",
    description: "Add doctors, update specialties, and manage availability.",
    icon: Stethoscope,
  },
  patients: {
    title: "Patients",
    description: "Keep patient records, status, and visit info organized.",
    icon: Users,
  },
  appointments: {
    title: "Appointments",
    description: "Review schedules, pending bookings, and visit times.",
    icon: CalendarCheck,
  },
  website: {
    title: "Website control",
    description: "Edit the public clinic content, sections, and messaging.",
    icon: Globe,
  },
  settings: {
    title: "Settings",
    description: "Adjust admin preferences and clinic configuration.",
    icon: Globe,
  },
} as const;

type SectionKey = keyof typeof sectionConfig;

export default async function AdminSectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  const config = sectionConfig[section as SectionKey];

  if (!config) {
    notFound();
  }

  const Icon = config.icon;

  return (
    <div className="space-y-6">
      <Link
        href="/admin"
        className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-950"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to dashboard
      </Link>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Admin section
            </p>
            <h2 className="mt-1 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              {config.title}
            </h2>
          </div>
        </div>

        <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
          {config.description}
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-[1.5rem] bg-slate-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              Layout
            </p>
            <p className="mt-2 text-lg font-bold text-slate-950">Editable</p>
          </div>
          <div className="rounded-[1.5rem] bg-slate-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              Design
            </p>
            <p className="mt-2 text-lg font-bold text-slate-950">Inline</p>
          </div>
          <div className="rounded-[1.5rem] bg-slate-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              Status
            </p>
            <p className="mt-2 text-lg font-bold text-slate-950">Ready</p>
          </div>
        </div>
      </section>
    </div>
  );
}
