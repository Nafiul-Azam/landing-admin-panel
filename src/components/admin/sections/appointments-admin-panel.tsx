"use client";

import Link from "next/link";
import { useMemo, useRef, useState, type FormEvent } from "react";
import {
  ArrowLeft,
  CalendarCheck,
  CalendarDays,
  CheckCircle2,
  Filter,
  Plus,
  RotateCcw,
  Save,
  Search,
  Stethoscope,
  UserCheck,
  X,
} from "lucide-react";

type AppointmentStatus = "Pending" | "Confirmed" | "Completed" | "Cancelled";

type DateCategory =
  | "All"
  | "Yesterday"
  | "Today"
  | "Tomorrow"
  | "Upcoming"
  | "Past";

type Appointment = {
  id: string;
  serialNo: string;
  patientName: string;
  phone: string;
  doctorName: string;
  department: string;
  serviceName: string;
  date: string;
  time: string;
  visitType: string;
  note: string;
  status: AppointmentStatus;
};

type AppointmentForm = Omit<Appointment, "id" | "serialNo">;

type ToastType = "success" | "error" | "info";

type Toast = {
  id: string;
  message: string;
  type: ToastType;
};

const statusOptions: AppointmentStatus[] = [
  "Pending",
  "Confirmed",
  "Completed",
  "Cancelled",
];

const dateCategoryOptions: {
  value: DateCategory;
  label: string;
  helper: string;
}[] = [
  {
    value: "All",
    label: "All Dates",
    helper: "Past + Future সব দেখাবে",
  },
  {
    value: "Yesterday",
    label: "গতকাল",
    helper: "Yesterday appointments",
  },
  {
    value: "Today",
    label: "আজ",
    helper: "Today appointments",
  },
  {
    value: "Tomorrow",
    label: "আগামীকাল",
    helper: "Tomorrow appointments",
  },
  {
    value: "Upcoming",
    label: "Future",
    helper: "আজকের পরের সব date",
  },
  {
    value: "Past",
    label: "Past",
    helper: "আজকের আগের সব date",
  },
];

function dateToDateString(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getTodayDateString() {
  return dateToDateString(new Date());
}

function addDaysToDateString(baseDateString: string, amount: number) {
  const [year, month, day] = baseDateString.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  date.setDate(date.getDate() + amount);

  return dateToDateString(date);
}

function formatDisplayDate(dateString: string) {
  if (!dateString) return "No date";

  return new Intl.DateTimeFormat("en-BD", {
    dateStyle: "medium",
  }).format(new Date(`${dateString}T00:00:00`));
}

function getDateCategoryMatched(
  dateString: string,
  category: DateCategory,
) {
  if (category === "All") return true;

  const today = getTodayDateString();
  const yesterday = addDaysToDateString(today, -1);
  const tomorrow = addDaysToDateString(today, 1);

  if (category === "Yesterday") return dateString === yesterday;
  if (category === "Today") return dateString === today;
  if (category === "Tomorrow") return dateString === tomorrow;
  if (category === "Upcoming") return dateString > today;
  if (category === "Past") return dateString < today;

  return true;
}

function uniqueSorted(values: string[]) {
  return Array.from(new Set(values.filter(Boolean))).sort((a, b) =>
    a.localeCompare(b, "bn"),
  );
}

function createInitialAppointments(): Appointment[] {
  const today = getTodayDateString();
  const yesterday = addDaysToDateString(today, -1);
  const tomorrow = addDaysToDateString(today, 1);
  const futureNine = "2026-05-09";

  return [
    {
      id: "apt-1",
      serialNo: "APT-001",
      patientName: "মোঃ করিম উদ্দিন",
      phone: "01700000001",
      doctorName: "ডা. সাদিয়া রহমান",
      department: "হৃদরোগ",
      serviceName: "Cardiology Consultation",
      date: yesterday,
      time: "৪টা - ৫টা",
      visitType: "Regular Serial",
      note: "Chest pain follow-up",
      status: "Confirmed",
    },
    {
      id: "apt-2",
      serialNo: "APT-002",
      patientName: "সাবিনা ইয়াসমিন",
      phone: "01700000002",
      doctorName: "ডা. সুমাইয়া জাহান",
      department: "গাইনি",
      serviceName: "Pregnancy Checkup",
      date: today,
      time: "৩টা - ৪টা",
      visitType: "Follow-up",
      note: "Regular checkup",
      status: "Pending",
    },
    {
      id: "apt-3",
      serialNo: "APT-003",
      patientName: "আরিফ হাসান",
      phone: "01800000003",
      doctorName: "ডা. মাহমুদুল করিম",
      department: "মেডিসিন",
      serviceName: "Fever & Medicine",
      date: tomorrow,
      time: "১১টা - ১২টা",
      visitType: "Emergency Serial",
      note: "High fever",
      status: "Completed",
    },
    {
      id: "apt-4",
      serialNo: "APT-004",
      patientName: "নাসরিন আক্তার",
      phone: "01900000004",
      doctorName: "ডা. সাদিয়া রহমান",
      department: "হৃদরোগ",
      serviceName: "ECG Review",
      date: futureNine,
      time: "৯টা - ১০টা",
      visitType: "Regular Serial",
      note: "আগামী ৯ তারিখ morning serial",
      status: "Confirmed",
    },
  ];
}

const emptyAppointmentForm: AppointmentForm = {
  patientName: "",
  phone: "",
  doctorName: "ডা. সাদিয়া রহমান",
  department: "হৃদরোগ",
  serviceName: "Cardiology Consultation",
  date: "",
  time: "৪টা - ৫টা",
  visitType: "Regular Serial",
  note: "",
  status: "Pending",
};

function AppointmentStatusBadge({ status }: { status: AppointmentStatus }) {
  const style =
    status === "Confirmed"
      ? "bg-teal-50 text-teal-700"
      : status === "Completed"
        ? "bg-blue-50 text-blue-700"
        : status === "Cancelled"
          ? "bg-red-50 text-red-600"
          : "bg-amber-50 text-amber-700";

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-black ${style}`}>
      {status}
    </span>
  );
}

function TextInput({
  label,
  value,
  placeholder,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">
        {label}
      </span>

      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
      />
    </label>
  );
}

function TextAreaInput({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">
        {label}
      </span>

      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={3}
        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
      />
    </label>
  );
}

function ToastBox({
  toast,
  onClose,
}: {
  toast: Toast;
  onClose: (id: string) => void;
}) {
  const style =
    toast.type === "error"
      ? "border-red-100 bg-white text-red-700"
      : toast.type === "info"
        ? "border-slate-200 bg-white text-slate-700"
        : "border-teal-100 bg-white text-slate-700";

  const iconStyle =
    toast.type === "error"
      ? "text-red-600"
      : toast.type === "info"
        ? "text-slate-600"
        : "text-teal-600";

  return (
    <div
      className={`flex w-full items-start gap-3 rounded-2xl border px-4 py-3 text-sm font-bold shadow-lg shadow-slate-200/60 ${style}`}
    >
      <CheckCircle2 className={`mt-0.5 h-4 w-4 shrink-0 ${iconStyle}`} />

      <div className="min-w-0 flex-1">
        <p className="leading-5">{toast.message}</p>
      </div>

      <button
        type="button"
        onClick={() => onClose(toast.id)}
        className="rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
        aria-label="Close notification"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

export default function AppointmentsAdminPanel() {
  const [appointments, setAppointments] = useState<Appointment[]>(
    createInitialAppointments,
  );

  const [form, setForm] = useState(emptyAppointmentForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [dateCategory, setDateCategory] = useState<DateCategory>("All");
  const [exactDateFilter, setExactDateFilter] = useState("");
  const [doctorFilter, setDoctorFilter] = useState("All");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [serviceFilter, setServiceFilter] = useState("All");
  const [visitTypeFilter, setVisitTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | "All">(
    "All",
  );

  const [toast, setToast] = useState("Ready to manage appointments");
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastIdRef = useRef(0);

  const doctorOptions = useMemo(() => {
    return uniqueSorted(appointments.map((item) => item.doctorName));
  }, [appointments]);

  const departmentOptions = useMemo(() => {
    return uniqueSorted(appointments.map((item) => item.department));
  }, [appointments]);

  const serviceOptions = useMemo(() => {
    return uniqueSorted(appointments.map((item) => item.serviceName));
  }, [appointments]);

  const visitTypeOptions = useMemo(() => {
    return uniqueSorted(appointments.map((item) => item.visitType));
  }, [appointments]);

  const filteredAppointments = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return appointments.filter((item) => {
      const searchMatched =
        keyword.length === 0 ||
        item.patientName.toLowerCase().includes(keyword) ||
        item.phone.toLowerCase().includes(keyword) ||
        item.serialNo.toLowerCase().includes(keyword) ||
        item.doctorName.toLowerCase().includes(keyword) ||
        item.department.toLowerCase().includes(keyword) ||
        item.serviceName.toLowerCase().includes(keyword) ||
        item.visitType.toLowerCase().includes(keyword) ||
        item.status.toLowerCase().includes(keyword) ||
        item.note.toLowerCase().includes(keyword) ||
        item.date.toLowerCase().includes(keyword) ||
        item.time.toLowerCase().includes(keyword);

      const dateCategoryMatched = getDateCategoryMatched(
        item.date,
        dateCategory,
      );

      const exactDateMatched =
        exactDateFilter.length === 0 || item.date === exactDateFilter;

      const doctorMatched =
        doctorFilter === "All" || item.doctorName === doctorFilter;

      const departmentMatched =
        departmentFilter === "All" || item.department === departmentFilter;

      const serviceMatched =
        serviceFilter === "All" || item.serviceName === serviceFilter;

      const visitTypeMatched =
        visitTypeFilter === "All" || item.visitType === visitTypeFilter;

      const statusMatched =
        statusFilter === "All" || item.status === statusFilter;

      return (
        searchMatched &&
        dateCategoryMatched &&
        exactDateMatched &&
        doctorMatched &&
        departmentMatched &&
        serviceMatched &&
        visitTypeMatched &&
        statusMatched
      );
    });
  }, [
    appointments,
    search,
    dateCategory,
    exactDateFilter,
    doctorFilter,
    departmentFilter,
    serviceFilter,
    visitTypeFilter,
    statusFilter,
  ]);

  const todayCount = useMemo(() => {
    const today = getTodayDateString();

    return appointments.filter((item) => item.date === today).length;
  }, [appointments]);

  const tomorrowCount = useMemo(() => {
    const tomorrow = addDaysToDateString(getTodayDateString(), 1);

    return appointments.filter((item) => item.date === tomorrow).length;
  }, [appointments]);

  const pastCount = useMemo(() => {
    const today = getTodayDateString();

    return appointments.filter((item) => item.date < today).length;
  }, [appointments]);

  const futureCount = useMemo(() => {
    const today = getTodayDateString();

    return appointments.filter((item) => item.date > today).length;
  }, [appointments]);

  function notify(message: string, type: ToastType = "success") {
    toastIdRef.current += 1;
    const id = `toast-${toastIdRef.current}`;

    setToast(message);

    setToasts((previous) => [
      ...previous.slice(-2),
      {
        id,
        message,
        type,
      },
    ]);

    window.setTimeout(() => {
      setToasts((previous) => previous.filter((item) => item.id !== id));
    }, 3200);
  }

  function closeToast(id: string) {
    setToasts((previous) => previous.filter((item) => item.id !== id));
  }

  function updateForm<K extends keyof AppointmentForm>(
    key: K,
    value: AppointmentForm[K],
  ) {
    setForm((previous) => ({ ...previous, [key]: value }));
  }

  function openAdd() {
    setEditingId(null);
    setForm({
      ...emptyAppointmentForm,
      date: getTodayDateString(),
    });
    setOpen(true);
    notify("Add appointment form opened", "info");
  }

  function openEdit(appointment: Appointment) {
    setEditingId(appointment.id);
    setForm({
      patientName: appointment.patientName,
      phone: appointment.phone,
      doctorName: appointment.doctorName,
      department: appointment.department,
      serviceName: appointment.serviceName,
      date: appointment.date,
      time: appointment.time,
      visitType: appointment.visitType,
      note: appointment.note,
      status: appointment.status,
    });
    setOpen(true);
    notify(`${appointment.serialNo} edit form opened`, "info");
  }

  function close() {
    setEditingId(null);
    setForm(emptyAppointmentForm);
    setOpen(false);
  }

  function closeWithNotification() {
    close();
    notify("Form closed without saving", "info");
  }

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.patientName.trim()) {
      notify("Patient name required", "error");
      return;
    }

    if (!form.phone.trim()) {
      notify("Phone number required", "error");
      return;
    }

    if (!form.doctorName.trim()) {
      notify("Doctor name required", "error");
      return;
    }

    if (!form.department.trim()) {
      notify("Department required", "error");
      return;
    }

    if (!form.serviceName.trim()) {
      notify("Service / subject required", "error");
      return;
    }

    if (!form.date.trim()) {
      notify("Appointment date required", "error");
      return;
    }

    if (editingId) {
      setAppointments((previous) =>
        previous.map((item) =>
          item.id === editingId
            ? {
                ...item,
                ...form,
                patientName: form.patientName.trim(),
                phone: form.phone.trim(),
                doctorName: form.doctorName.trim(),
                department: form.department.trim(),
                serviceName: form.serviceName.trim(),
              }
            : item,
        ),
      );

      close();
      notify("Appointment updated successfully");
      return;
    }

    const serialNo = `APT-${String(appointments.length + 1).padStart(3, "0")}`;

    setAppointments((previous) => [
      {
        id: `apt-${Date.now()}`,
        serialNo,
        ...form,
        patientName: form.patientName.trim(),
        phone: form.phone.trim(),
        doctorName: form.doctorName.trim(),
        department: form.department.trim(),
        serviceName: form.serviceName.trim(),
      },
      ...previous,
    ]);

    close();
    notify(`${serialNo} appointment created successfully`);
  }

  function remove(id: string) {
    const appointment = appointments.find((item) => item.id === id);

    const isConfirmed = window.confirm(
      `${appointment?.serialNo || "এই appointment"} delete করবেন?`,
    );

    if (!isConfirmed) {
      notify("Delete cancelled", "info");
      return;
    }

    setAppointments((previous) => previous.filter((item) => item.id !== id));
    notify("Appointment deleted successfully");
  }

  function handleDateCategoryChange(value: DateCategory) {
    setDateCategory(value);

    if (value !== "All") {
      setExactDateFilter("");
    }

    notify(
      value === "All"
        ? "Showing all date appointments"
        : `Showing ${value} appointments`,
      "info",
    );
  }

  function handleExactDateChange(value: string) {
    setExactDateFilter(value);

    if (value) {
      setDateCategory("All");
      notify(`Showing appointments for ${formatDisplayDate(value)}`, "info");
    }
  }

  function handleStatusFilterChange(value: AppointmentStatus | "All") {
    setStatusFilter(value);

    if (value === "All") {
      notify("Showing all status appointments", "info");
      return;
    }

    notify(`Showing ${value} appointments`, "info");
  }

  function resetFilters() {
    setSearch("");
    setDateCategory("All");
    setExactDateFilter("");
    setDoctorFilter("All");
    setDepartmentFilter("All");
    setServiceFilter("All");
    setVisitTypeFilter("All");
    setStatusFilter("All");
    notify("All filters reset", "info");
  }

  return (
    <div className="space-y-4">
      <div className="fixed left-4 right-4 top-4 z-[80] flex flex-col gap-2 sm:left-auto sm:w-[360px]">
        {toasts.map((item) => (
          <ToastBox key={item.id} toast={item} onClose={closeToast} />
        ))}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/admin"
          className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm transition hover:text-slate-950"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to dashboard
        </Link>

        <button
          type="button"
          onClick={openAdd}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-black text-white shadow-sm transition hover:bg-teal-700"
        >
          <Plus className="h-4 w-4" />
          Add Appointment
        </button>
      </div>

      <div className="fixed right-4 top-4 z-40 hidden max-w-sm items-center gap-2 rounded-2xl border border-teal-100 bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-lg shadow-slate-200/60 sm:flex">
        <CheckCircle2 className="h-4 w-4 shrink-0 text-teal-600" />
        <span>{toast}</span>
      </div>

      <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1 text-xs font-black text-teal-700">
              <CalendarCheck className="h-3.5 w-3.5" />
              Appointment Control
            </div>

            <h1 className="mt-3 text-2xl font-black text-slate-950">
              Appointments Admin
            </h1>

            <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600">
              Date wise, doctor wise, service wise, status wise এবং past/future
              appointment search করে manage করুন।
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 xl:w-[560px]">
            {[
              ["Total", appointments.length],
              ["Filtered", filteredAppointments.length],
              ["Today", todayCount],
              ["Tomorrow", tomorrowCount],
            ].map(([label, value]) => (
              <div key={String(label)} className="rounded-2xl bg-slate-50 p-3">
                <p className="text-xs font-bold text-slate-500">{label}</p>
                <p className="text-2xl font-black text-slate-950">{value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs font-bold text-slate-500">Past</p>
            <p className="text-xl font-black text-slate-950">{pastCount}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs font-bold text-slate-500">Future</p>
            <p className="text-xl font-black text-slate-950">{futureCount}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs font-bold text-slate-500">Doctors</p>
            <p className="text-xl font-black text-slate-950">
              {doctorOptions.length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs font-bold text-slate-500">Services</p>
            <p className="text-xl font-black text-slate-950">
              {serviceOptions.length}
            </p>
          </div>
        </div>

        <div className="mt-5 rounded-3xl border border-slate-200 bg-slate-50 p-3 sm:p-4">
          <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-black text-slate-700">
                <Filter className="h-3.5 w-3.5" />
                Category Filters
              </div>
              <p className="mt-2 text-xs font-semibold leading-5 text-slate-500">
                যেমন: আগামী ৯ তারিখ + doctor name + কোন service/bishoy — সব
                একসাথে filter করা যাবে।
              </p>
            </div>

            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-black text-slate-700 transition hover:bg-slate-100"
            >
              <RotateCcw className="h-4 w-4" />
              Reset Filter
            </button>
          </div>

          <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
            {dateCategoryOptions.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => handleDateCategoryChange(item.value)}
                className={`rounded-2xl border p-3 text-left transition ${
                  dateCategory === item.value
                    ? "border-teal-500 bg-white shadow-sm"
                    : "border-slate-200 bg-white hover:bg-slate-50"
                }`}
              >
                <p className="text-sm font-black text-slate-950">
                  {item.label}
                </p>
                <p className="mt-1 text-[11px] font-semibold text-slate-500">
                  {item.helper}
                </p>
              </button>
            ))}
          </div>

          <div className="mt-4 grid gap-3 lg:grid-cols-[1.2fr_1fr_1fr_1fr]">
            <label className="relative block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search serial, patient, doctor, service, phone, note..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
              />
            </label>

            <label className="relative block">
              <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={exactDateFilter}
                type="date"
                onChange={(event) => handleExactDateChange(event.target.value)}
                className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm font-bold text-slate-700 outline-none transition focus:border-teal-500"
              />
            </label>

            <label className="relative block">
              <UserCheck className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <select
                value={doctorFilter}
                onChange={(event) => setDoctorFilter(event.target.value)}
                className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm font-bold text-slate-700 outline-none focus:border-teal-500"
              >
                <option value="All">All Doctors</option>
                {doctorOptions.map((doctor) => (
                  <option key={doctor} value={doctor}>
                    {doctor}
                  </option>
                ))}
              </select>
            </label>

            <label className="relative block">
              <Stethoscope className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <select
                value={serviceFilter}
                onChange={(event) => setServiceFilter(event.target.value)}
                className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm font-bold text-slate-700 outline-none focus:border-teal-500"
              >
                <option value="All">All Services / Bishoy</option>
                {serviceOptions.map((service) => (
                  <option key={service} value={service}>
                    {service}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-3 grid gap-3 md:grid-cols-3">
            <select
              value={departmentFilter}
              onChange={(event) => setDepartmentFilter(event.target.value)}
              className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700 outline-none focus:border-teal-500"
            >
              <option value="All">All Departments</option>
              {departmentOptions.map((department) => (
                <option key={department} value={department}>
                  {department}
                </option>
              ))}
            </select>

            <select
              value={visitTypeFilter}
              onChange={(event) => setVisitTypeFilter(event.target.value)}
              className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700 outline-none focus:border-teal-500"
            >
              <option value="All">All Visit Type</option>
              {visitTypeOptions.map((visitType) => (
                <option key={visitType} value={visitType}>
                  {visitType}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(event) =>
                handleStatusFilterChange(
                  event.target.value as AppointmentStatus | "All",
                )
              }
              className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700 outline-none focus:border-teal-500"
            >
              <option value="All">All Status</option>
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
          <div className="overflow-x-auto">
            <div className="min-w-[1050px]">
              <div className="grid grid-cols-[1.2fr_1fr_1.15fr_0.9fr_0.8fr_1fr_0.8fr] gap-3 bg-slate-50 px-4 py-3 text-xs font-black uppercase tracking-[0.12em] text-slate-500">
                <span>Patient</span>
                <span>Doctor</span>
                <span>Service</span>
                <span>Date & Slot</span>
                <span>Status</span>
                <span>Note</span>
                <span className="text-right">Action</span>
              </div>

              <div className="divide-y divide-slate-100">
                {filteredAppointments.length === 0 ? (
                  <div className="p-8 text-center text-sm text-slate-500">
                    No appointments found
                  </div>
                ) : (
                  filteredAppointments.map((item) => (
                    <div
                      key={item.id}
                      className="grid grid-cols-[1.2fr_1fr_1.15fr_0.9fr_0.8fr_1fr_0.8fr] gap-3 p-4 text-sm"
                    >
                      <div>
                        <p className="font-black text-slate-950">
                          {item.patientName}
                        </p>
                        <p className="text-xs text-slate-500">
                          {item.serialNo} · {item.phone}
                        </p>
                      </div>

                      <div>
                        <p className="font-bold text-slate-800">
                          {item.doctorName}
                        </p>
                        <p className="text-xs text-slate-500">
                          {item.department}
                        </p>
                      </div>

                      <div>
                        <p className="font-bold text-slate-800">
                          {item.serviceName}
                        </p>
                        <p className="text-xs text-slate-500">
                          {item.visitType}
                        </p>
                      </div>

                      <div>
                        <p className="font-bold text-slate-800">
                          {formatDisplayDate(item.date)}
                        </p>
                        <p className="text-xs text-slate-500">{item.time}</p>
                      </div>

                      <div>
                        <AppointmentStatusBadge status={item.status} />
                      </div>

                      <div>
                        <p className="line-clamp-2 text-xs leading-5 text-slate-500">
                          {item.note || "No note"}
                        </p>
                      </div>

                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEdit(item)}
                          className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-black text-slate-700 transition hover:bg-slate-50"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => remove(item.id)}
                          className="rounded-lg border border-red-100 px-3 py-2 text-xs font-black text-red-600 transition hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {open ? (
        <div
          onClick={closeWithNotification}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
        >
          <div
            onClick={(event) => event.stopPropagation()}
            className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-xl"
          >
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 bg-slate-950 px-4 py-4 text-white sm:px-6">
              <h2 className="text-lg font-black">
                {editingId ? "Edit Appointment" : "Add Appointment"}
              </h2>

              <button
                type="button"
                onClick={closeWithNotification}
                className="rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20"
                aria-label="Close form"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={save} className="space-y-4 p-4 sm:p-6">
              <div className="grid gap-3 md:grid-cols-2">
                <TextInput
                  label="Patient Name"
                  value={form.patientName}
                  onChange={(value) => updateForm("patientName", value)}
                />

                <TextInput
                  label="Phone"
                  value={form.phone}
                  onChange={(value) => updateForm("phone", value)}
                />

                <TextInput
                  label="Doctor Name"
                  value={form.doctorName}
                  onChange={(value) => updateForm("doctorName", value)}
                />

                <TextInput
                  label="Department"
                  value={form.department}
                  onChange={(value) => updateForm("department", value)}
                />

                <TextInput
                  label="Service / Bishoy"
                  value={form.serviceName}
                  placeholder="Example: ECG Review, Fever, Pregnancy Checkup"
                  onChange={(value) => updateForm("serviceName", value)}
                />

                <TextInput
                  label="Date"
                  value={form.date}
                  type="date"
                  onChange={(value) => updateForm("date", value)}
                />

                <TextInput
                  label="Time"
                  value={form.time}
                  onChange={(value) => updateForm("time", value)}
                />

                <TextInput
                  label="Visit Type"
                  value={form.visitType}
                  onChange={(value) => updateForm("visitType", value)}
                />

                <label className="block md:col-span-2">
                  <span className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">
                    Status
                  </span>

                  <select
                    value={form.status}
                    onChange={(event) =>
                      updateForm(
                        "status",
                        event.target.value as AppointmentStatus,
                      )
                    }
                    className="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold outline-none focus:border-teal-500"
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <TextAreaInput
                label="Note"
                value={form.note}
                onChange={(value) => updateForm("note", value)}
              />

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={closeWithNotification}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-50"
                >
                  <X className="h-4 w-4" />
                  Discard
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-3 text-sm font-black text-white transition hover:bg-teal-700"
                >
                  <Save className="h-4 w-4" />
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}