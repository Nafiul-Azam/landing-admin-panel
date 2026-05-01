"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Save,
  Settings,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";

export default function SettingsAdminPanel() {
  const [autoSave, setAutoSave] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [toast, setToast] = useState("Ready to manage settings");

  function showToast(message: string) {
    setToast(message);
  }

  function saveSettings() {
    showToast("Settings saved successfully");
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/admin"
          className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm transition hover:text-slate-950"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to dashboard
        </Link>
      </div>

      <div className="fixed right-4 top-4 z-40 hidden max-w-sm items-center gap-2 rounded-2xl border border-teal-100 bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-lg shadow-slate-200/60 sm:flex">
        <CheckCircle2 className="h-4 w-4 shrink-0 text-teal-600" />
        <span>{toast}</span>
      </div>

      <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1 text-xs font-black text-teal-700">
          <Settings className="h-3.5 w-3.5" />
          Settings
        </div>
        <h1 className="mt-3 text-2xl font-black text-slate-950">Settings</h1>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600">
          Admin preferences and clinic configuration control করুন।
        </p>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="text-base font-black text-slate-950">
            Panel Preferences
          </h2>
          <div className="mt-4 space-y-3">
            <button
              type="button"
              onClick={() => setAutoSave((previous) => !previous)}
              className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left font-bold text-slate-700 transition hover:bg-slate-50"
            >
              <span>Auto save drafts</span>
              {autoSave ? (
                <ToggleRight className="h-5 w-5 text-teal-600" />
              ) : (
                <ToggleLeft className="h-5 w-5 text-slate-400" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setMaintenanceMode((previous) => !previous)}
              className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left font-bold text-slate-700 transition hover:bg-slate-50"
            >
              <span>Maintenance mode</span>
              {maintenanceMode ? (
                <ToggleRight className="h-5 w-5 text-teal-600" />
              ) : (
                <ToggleLeft className="h-5 w-5 text-slate-400" />
              )}
            </button>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="text-base font-black text-slate-950">Quick Actions</h2>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <button
              type="button"
              onClick={saveSettings}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-3 text-sm font-black text-white transition hover:bg-teal-700"
            >
              <Save className="h-4 w-4" />
              Save Settings
            </button>
            <Link
              href="/admin"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-50"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
