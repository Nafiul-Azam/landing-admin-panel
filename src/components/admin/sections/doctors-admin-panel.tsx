"use client";

import Link from "next/link";
import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  ImagePlus,
  Pencil,
  Plus,
  RotateCcw,
  Save,
  Search,
  Stethoscope,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";

type ShowDuration = "24h" | "1d" | "7d" | "until_changed";

type WebsiteContent = {
  smallTitle: string;
  heading: string;
  description: string;
  isVisible: boolean;
  showDuration: ShowDuration;
};

type Doctor = {
  id: string;
  name: string;
  specialty: string;
  degree: string;
  category: string;
  problems: string;
  room: string;
  days: string;
  timeSlots: string[];
  imageUrl: string;
  isToday: boolean;
  isVisible: boolean;
  showDuration: ShowDuration;
};

type DoctorForm = Omit<Doctor, "id">;

const showDurationOptions: { label: string; value: ShowDuration }[] = [
  { label: "24 Hour", value: "24h" },
  { label: "1 Day", value: "1d" },
  { label: "7 Days", value: "7d" },
  { label: "Until Changed", value: "until_changed" },
];

const defaultWebsiteContent: WebsiteContent = {
  smallTitle: "EXPERT DOCTORS",
  heading: "আজকে ডাক্তার বসেছেন",
  description:
    "অভিজ্ঞ ও বিশ্বস্ত চিকিৎসকদের প্রোফাইল, যোগ্যতা এবং সময়সূচি সহজেই দেখুন।",
  isVisible: true,
  showDuration: "until_changed",
};

const initialCategories = [
  "সব",
  "হৃদরোগ",
  "মেডিসিন",
  "গাইনি",
  "অর্থোপেডিক",
  "নিউরোলজি",
  "শিশু",
];

const emptyDoctorForm: DoctorForm = {
  name: "",
  specialty: "",
  degree: "",
  category: "মেডিসিন",
  problems: "",
  room: "",
  days: "",
  timeSlots: ["৪টা - ৮টা"],
  imageUrl: "",
  isToday: true,
  isVisible: true,
  showDuration: "until_changed",
};

const initialDoctors: Doctor[] = [
  {
    id: "1",
    name: "ডা. সাদিয়া রহমান",
    specialty: "হৃদরোগ বিশেষজ্ঞ",
    degree: "MBBS, FCPS (Cardiology)",
    category: "হৃদরোগ",
    problems: "হার্ট, বুক ধড়ফড়, বুকে ব্যথা",
    room: "রুম ২০৪",
    days: "শনি, সোম, বুধ",
    timeSlots: ["৪টা - ৮টা", "৮টা - ৯টা"],
    imageUrl: "",
    isToday: true,
    isVisible: true,
    showDuration: "until_changed",
  },
  {
    id: "2",
    name: "ডা. মাহমুদুল করিম",
    specialty: "মেডিসিন বিশেষজ্ঞ",
    degree: "MBBS, MD (Medicine)",
    category: "মেডিসিন",
    problems: "জ্বর, প্রেসার, ডায়াবেটিস",
    room: "রুম ৩০১",
    days: "রবি, মঙ্গল, বৃহস্পতিবার",
    timeSlots: ["১০টা - ১টা"],
    imageUrl: "",
    isToday: true,
    isVisible: true,
    showDuration: "7d",
  },
  {
    id: "3",
    name: "ডা. সুমাইয়া জাহান",
    specialty: "গাইনি বিশেষজ্ঞ",
    degree: "MBBS, FCPS (Gynecology)",
    category: "গাইনি",
    problems: "মহিলা স্বাস্থ্য, গর্ভাবস্থা",
    room: "রুম ১০৫",
    days: "শনি, মঙ্গল, শুক্রবার",
    timeSlots: ["৩টা - ৭টা"],
    imageUrl: "",
    isToday: false,
    isVisible: true,
    showDuration: "until_changed",
  },
];

function getInitials(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "DR";
  return words
    .slice(-2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

function getDurationLabel(value: ShowDuration) {
  return (
    showDurationOptions.find((option) => option.value === value)?.label ||
    "Until Changed"
  );
}

function ToggleSwitch({
  checked,
  onChange,
  label,
  activeText,
  inactiveText,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
  activeText: string;
  inactiveText: string;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      className="flex w-full items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2 text-left transition hover:bg-slate-50"
    >
      <span>
        <span className="block text-xs font-bold text-slate-500">{label}</span>
        <span
          className={`block text-sm font-black ${
            checked ? "text-teal-700" : "text-slate-500"
          }`}
        >
          {checked ? activeText : inactiveText}
        </span>
      </span>

      <span
        className={`relative h-6 w-11 rounded-full transition ${
          checked ? "bg-teal-600" : "bg-slate-300"
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
            checked ? "left-6" : "left-1"
          }`}
        />
      </span>
    </button>
  );
}

function TextInput({
  label,
  value,
  placeholder,
  type = "text",
  onChange,
}: {
  label: string;
  value: string;
  placeholder?: string;
  type?: string;
  onChange: (value: string) => void;
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
        className="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-900 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
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
        className="mt-1 w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium leading-6 text-slate-900 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
      />
    </label>
  );
}

export default function DoctorsAdminPanel() {
  const [websiteContent, setWebsiteContent] = useState(defaultWebsiteContent);
  const [contentForm, setContentForm] = useState(defaultWebsiteContent);
  const [categories, setCategories] = useState(initialCategories);
  const [categoryInput, setCategoryInput] = useState("");
  const [activeCategory, setActiveCategory] = useState("সব");
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [doctors, setDoctors] = useState(initialDoctors);
  const [doctorForm, setDoctorForm] = useState<DoctorForm>(emptyDoctorForm);
  const [editingDoctorId, setEditingDoctorId] = useState<string | null>(null);
  const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState("Ready to manage doctor section");

  const visibleDoctors = doctors.filter((doctor) => doctor.isVisible);
  const todayDoctors = doctors.filter(
    (doctor) => doctor.isVisible && doctor.isToday,
  );

  const filteredDoctors = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return doctors.filter((doctor) => {
      const categoryMatched =
        activeCategory === "সব" || doctor.category === activeCategory;

      const searchMatched =
        keyword.length === 0 ||
        doctor.name.toLowerCase().includes(keyword) ||
        doctor.specialty.toLowerCase().includes(keyword) ||
        doctor.category.toLowerCase().includes(keyword) ||
        doctor.problems.toLowerCase().includes(keyword);

      return categoryMatched && searchMatched;
    });
  }, [activeCategory, doctors, search]);

  const previewDoctors = filteredDoctors.filter((doctor) => doctor.isVisible);

  function showToast(message: string) {
    setToast(message);
  }

  function selectCategory(category: string) {
    setActiveCategory(category);
    showToast(`${category} filter selected`);
  }

  function updateDoctorForm<K extends keyof DoctorForm>(
    key: K,
    value: DoctorForm[K],
  ) {
    setDoctorForm((previous) => ({
      ...previous,
      [key]: value,
    }));
  }

  function saveWebsiteContent() {
    setWebsiteContent(contentForm);
    showToast("Website heading uploaded successfully");
  }

  function resetWebsiteContent() {
    setWebsiteContent(defaultWebsiteContent);
    setContentForm(defaultWebsiteContent);
    showToast("Website section reset successfully");
  }

  function openCategoryModal() {
    setCategoryInput("");
    setIsCategoryModalOpen(true);
    showToast("Category add form opened");
  }

  function closeCategoryModal() {
    setCategoryInput("");
    setIsCategoryModalOpen(false);
    showToast("Category action cancelled");
  }

  function addCategory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const value = categoryInput.trim();

    if (!value) {
      showToast("Category name লিখুন");
      return;
    }

    const alreadyExists = categories.some(
      (category) => category.toLowerCase() === value.toLowerCase(),
    );

    if (alreadyExists) {
      showToast("এই category আগে থেকেই আছে");
      return;
    }

    setCategories((previous) => [...previous, value]);
    setCategoryInput("");
    setActiveCategory(value);
    setDoctorForm((previous) => ({
      ...previous,
      category: value,
    }));
    setIsCategoryModalOpen(false);
    showToast(`${value} category added successfully`);
  }

  function deleteCategory(category: string) {
    if (category === "সব") return;

    const fallbackCategory =
      categories.find((item) => item !== "সব" && item !== category) ||
      "General";

    const confirmDelete = window.confirm(
      `"${category}" category delete করবেন? এই category এর doctors "${fallbackCategory}" এ চলে যাবে।`,
    );

    if (!confirmDelete) {
      showToast("Category delete cancelled");
      return;
    }

    setCategories((previous) => {
      const next = previous.filter((item) => item !== category);
      return next.includes(fallbackCategory)
        ? next
        : [...next, fallbackCategory];
    });

    setDoctors((previous) =>
      previous.map((doctor) =>
        doctor.category === category
          ? {
              ...doctor,
              category: fallbackCategory,
            }
          : doctor,
      ),
    );

    if (doctorForm.category === category) {
      setDoctorForm((previous) => ({
        ...previous,
        category: fallbackCategory,
      }));
    }

    if (activeCategory === category) {
      setActiveCategory("সব");
    }

    showToast(`${category} category deleted`);
  }

  function openAddDoctorModal() {
    setEditingDoctorId(null);
    setDoctorForm(emptyDoctorForm);
    setIsDoctorModalOpen(true);
    showToast("Add doctor form opened");
  }

  function openEditDoctorModal(doctor: Doctor) {
    setEditingDoctorId(doctor.id);
    setDoctorForm({
      name: doctor.name,
      specialty: doctor.specialty,
      degree: doctor.degree,
      category: doctor.category,
      problems: doctor.problems,
      room: doctor.room,
      days: doctor.days,
      timeSlots: doctor.timeSlots.length ? doctor.timeSlots : [""],
      imageUrl: doctor.imageUrl,
      isToday: doctor.isToday,
      isVisible: doctor.isVisible,
      showDuration: doctor.showDuration,
    });
    setIsDoctorModalOpen(true);
    showToast(`${doctor.name} edit mode opened`);
  }

  function closeDoctorModal() {
    setEditingDoctorId(null);
    setDoctorForm(emptyDoctorForm);
    setIsDoctorModalOpen(false);
    showToast("Action cancelled");
  }

  function saveDoctor(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!doctorForm.name.trim()) {
      showToast("Doctor name required");
      return;
    }

    if (!doctorForm.specialty.trim()) {
      showToast("Specialty required");
      return;
    }

    const cleanedForm: DoctorForm = {
      ...doctorForm,
      timeSlots: doctorForm.timeSlots
        .map((slot) => slot.trim())
        .filter(Boolean),
    };

    if (editingDoctorId) {
      setDoctors((previous) =>
        previous.map((doctor) =>
          doctor.id === editingDoctorId
            ? {
                id: editingDoctorId,
                ...cleanedForm,
              }
            : doctor,
        ),
      );

      setEditingDoctorId(null);
      setDoctorForm(emptyDoctorForm);
      setIsDoctorModalOpen(false);
      showToast("Doctor updated successfully");
      return;
    }

    const newDoctor: Doctor = {
      id: Date.now().toString(),
      ...cleanedForm,
    };

    setDoctors((previous) => [newDoctor, ...previous]);
    setDoctorForm(emptyDoctorForm);
    setIsDoctorModalOpen(false);
    showToast("New doctor added successfully");
  }

  function deleteDoctor(id: string) {
    const doctor = doctors.find((item) => item.id === id);

    const confirmDelete = window.confirm(
      `${doctor?.name || "এই doctor"} delete করবেন?`,
    );

    if (!confirmDelete) {
      showToast("Delete cancelled");
      return;
    }

    setDoctors((previous) => previous.filter((doctor) => doctor.id !== id));
    showToast("Doctor deleted successfully");
  }

  function toggleDoctorVisibility(id: string) {
    setDoctors((previous) =>
      previous.map((doctor) =>
        doctor.id === id
          ? {
              ...doctor,
              isVisible: !doctor.isVisible,
            }
          : doctor,
      ),
    );

    showToast("Website show/hide updated");
  }

  function toggleTodayStatus(id: string) {
    setDoctors((previous) =>
      previous.map((doctor) =>
        doctor.id === id
          ? {
              ...doctor,
              isToday: !doctor.isToday,
            }
          : doctor,
      ),
    );

    showToast("Today status updated");
  }

  function updateDoctorDuration(id: string, value: ShowDuration) {
    setDoctors((previous) =>
      previous.map((doctor) =>
        doctor.id === id
          ? {
              ...doctor,
              showDuration: value,
            }
          : doctor,
      ),
    );

    showToast("Show duration updated");
  }

  function handlePhotoUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    updateDoctorForm("imageUrl", previewUrl);
    showToast("Profile photo selected from device");
  }

  function clearProfilePhoto() {
    updateDoctorForm("imageUrl", "");
    showToast("Profile photo removed");
  }

  function updateTimeSlot(index: number, value: string) {
    setDoctorForm((previous) => ({
      ...previous,
      timeSlots: previous.timeSlots.map((slot, slotIndex) =>
        slotIndex === index ? value : slot,
      ),
    }));
  }

  function addTimeSlot() {
    setDoctorForm((previous) => ({
      ...previous,
      timeSlots: [...previous.timeSlots, ""],
    }));
  }

  function removeTimeSlot(index: number) {
    setDoctorForm((previous) => ({
      ...previous,
      timeSlots:
        previous.timeSlots.length === 1
          ? [""]
          : previous.timeSlots.filter((_, slotIndex) => slotIndex !== index),
    }));
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

        <button
          type="button"
          onClick={openAddDoctorModal}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-black text-white shadow-sm transition hover:bg-teal-700"
        >
          <Plus className="h-4 w-4" />
          Add Doctor
        </button>
      </div>

      <div className="fixed right-4 top-4 z-40 hidden max-w-sm items-center gap-2 rounded-2xl border border-teal-100 bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-lg shadow-slate-200/60 sm:flex">
        <CheckCircle2 className="h-4 w-4 shrink-0 text-teal-600" />
        <span>{toast}</span>
      </div>

      <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1 text-xs font-black text-teal-700">
              <Stethoscope className="h-3.5 w-3.5" />
              Doctor Section Control
            </div>

            <h1 className="mt-3 text-2xl font-black text-slate-950">
              Doctors Admin
            </h1>

            <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600">
              Doctor add/edit/delete, show/hide, today status, time slot এবং
              website duration control করুন।
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-2xl bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 sm:hidden">
            <CheckCircle2 className="h-4 w-4 text-teal-600" />
            {toast}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 xl:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 p-3">
            <p className="text-xs font-bold text-slate-500">Total</p>
            <p className="text-2xl font-black text-slate-950">
              {doctors.length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 p-3">
            <p className="text-xs font-bold text-slate-500">Website Show</p>
            <p className="text-2xl font-black text-slate-950">
              {visibleDoctors.length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 p-3">
            <p className="text-xs font-bold text-slate-500">আজকে বসেছেন</p>
            <p className="text-2xl font-black text-slate-950">
              {todayDoctors.length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 p-3">
            <p className="text-xs font-bold text-slate-500">Categories</p>
            <p className="text-2xl font-black text-slate-950">
              {categories.length - 1}
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-[360px_1fr]">
        <div className="space-y-4">
          <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-base font-black text-slate-950">
              Website Heading
            </h2>
            <p className="mt-1 text-xs font-medium text-slate-500">
              Public doctor section title control.
            </p>

            <div className="mt-4 space-y-3">
              <TextInput
                label="Small Title"
                value={contentForm.smallTitle}
                onChange={(value) =>
                  setContentForm((previous) => ({
                    ...previous,
                    smallTitle: value,
                  }))
                }
              />

              <TextInput
                label="Main Heading"
                value={contentForm.heading}
                onChange={(value) =>
                  setContentForm((previous) => ({
                    ...previous,
                    heading: value,
                  }))
                }
              />

              <TextAreaInput
                label="Description"
                value={contentForm.description}
                onChange={(value) =>
                  setContentForm((previous) => ({
                    ...previous,
                    description: value,
                  }))
                }
              />

              <ToggleSwitch
                checked={contentForm.isVisible}
                onChange={() =>
                  setContentForm((previous) => ({
                    ...previous,
                    isVisible: !previous.isVisible,
                  }))
                }
                label="Website Section"
                activeText="Show"
                inactiveText="Hide"
              />

              <label className="block">
                <span className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">
                  Show Duration
                </span>
                <select
                  value={contentForm.showDuration}
                  onChange={(event) =>
                    setContentForm((previous) => ({
                      ...previous,
                      showDuration: event.target.value as ShowDuration,
                    }))
                  }
                  className="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold outline-none focus:border-teal-500"
                >
                  {showDurationOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={saveWebsiteContent}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-black text-white transition hover:bg-teal-700"
              >
                <UploadCloud className="h-4 w-4" />
                Upload
              </button>

              <button
                type="button"
                onClick={resetWebsiteContent}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-black text-slate-700 transition hover:bg-slate-50"
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </button>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-black text-slate-950">
                  Category Control
                </h2>
                <p className="mt-1 text-xs font-medium text-slate-500">
                  Add, filter, delete category.
                </p>
              </div>

              <button
                type="button"
                onClick={openCategoryModal}
                className="inline-flex items-center gap-1.5 rounded-xl bg-slate-950 px-3 py-2 text-xs font-black text-white transition hover:bg-teal-700"
              >
                <Plus className="h-3.5 w-3.5" />
                Add
              </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {categories.map((category) => (
                <div
                  key={category}
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-black ${
                    activeCategory === category
                      ? "border-teal-600 bg-teal-600 text-white"
                      : "border-slate-200 bg-slate-50 text-slate-700"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => selectCategory(category)}
                  >
                    {category}
                  </button>

                  {category !== "সব" ? (
                    <button
                      type="button"
                      onClick={() => deleteCategory(category)}
                      className={
                        activeCategory === category
                          ? "text-white"
                          : "text-slate-400 hover:text-red-600"
                      }
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  ) : null}
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-4">
          <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-base font-black text-slate-950">
                  Doctor List
                </h2>
                <p className="mt-1 text-xs font-medium text-slate-500">
                  Compact backend list. Edit করলে popup form open হবে।
                </p>
              </div>

              <label className="relative block lg:w-80">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search doctor..."
                  className="h-10 w-full rounded-xl border border-slate-200 pl-10 pr-3 text-sm outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
                />
              </label>
            </div>

            <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
              <div className="hidden grid-cols-[1.7fr_1fr_1fr_1.1fr_1.1fr] gap-3 bg-slate-50 px-4 py-3 text-xs font-black uppercase tracking-[0.12em] text-slate-500 lg:grid">
                <span>Doctor</span>
                <span>Schedule</span>
                <span>Status</span>
                <span>Duration</span>
                <span className="text-right">Action</span>
              </div>

              <div className="divide-y divide-slate-100">
                {filteredDoctors.length === 0 ? (
                  <div className="p-8 text-center">
                    <p className="font-bold text-slate-700">
                      কোনো doctor পাওয়া যায়নি
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Search/category change করুন অথবা নতুন doctor add করুন।
                    </p>
                  </div>
                ) : (
                  filteredDoctors.map((doctor) => (
                    <div
                      key={doctor.id}
                      className="grid gap-3 p-4 transition hover:bg-slate-50 lg:grid-cols-[1.7fr_1fr_1fr_1.1fr_1.1fr] lg:items-center"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        {doctor.imageUrl ? (
                          <img
                            src={doctor.imageUrl}
                            alt={doctor.name}
                            className="h-11 w-11 shrink-0 rounded-xl object-cover"
                          />
                        ) : (
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-xs font-black text-white">
                            {getInitials(doctor.name)}
                          </div>
                        )}

                        <div className="min-w-0">
                          <h3 className="truncate text-sm font-black text-slate-950">
                            {doctor.name}
                          </h3>
                          <p className="truncate text-xs font-bold text-teal-700">
                            {doctor.specialty}
                          </p>
                          <p className="truncate text-xs text-slate-500">
                            {doctor.category} · {doctor.room || "No room"}
                          </p>
                        </div>
                      </div>

                      <div className="text-xs text-slate-600">
                        <p className="font-bold text-slate-800">
                          {doctor.days || "No days"}
                        </p>
                        <p className="mt-1 flex items-center gap-1">
                          <Clock3 className="h-3.5 w-3.5 text-teal-600" />
                          {doctor.timeSlots.length
                            ? doctor.timeSlots.join(", ")
                            : "No slot"}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-2 lg:block lg:space-y-2">
                        <ToggleSwitch
                          checked={doctor.isVisible}
                          onChange={() => toggleDoctorVisibility(doctor.id)}
                          label="Website"
                          activeText="Show"
                          inactiveText="Hide"
                        />

                        <ToggleSwitch
                          checked={doctor.isToday}
                          onChange={() => toggleTodayStatus(doctor.id)}
                          label="Today"
                          activeText="Yes"
                          inactiveText="No"
                        />
                      </div>

                      <select
                        value={doctor.showDuration}
                        onChange={(event) =>
                          updateDoctorDuration(
                            doctor.id,
                            event.target.value as ShowDuration,
                          )
                        }
                        className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-black text-slate-700 outline-none focus:border-teal-500"
                      >
                        {showDurationOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>

                      <div className="grid grid-cols-2 gap-2 lg:flex lg:justify-end">
                        <button
                          type="button"
                          onClick={() => openEditDoctorModal(doctor)}
                          className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-xs font-black text-slate-700 transition hover:bg-white"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => deleteDoctor(doctor.id)}
                          className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-red-100 px-3 py-2 text-xs font-black text-red-600 transition hover:bg-red-50"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
            <div className="rounded-3xl bg-white p-5">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-teal-700">
                    {websiteContent.smallTitle}
                  </p>

                  <h2 className="mt-2 text-2xl font-black text-slate-950">
                    {websiteContent.heading}
                  </h2>

                  <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
                    {websiteContent.description}
                  </p>
                </div>

                <span
                  className={`w-fit rounded-full px-3 py-1.5 text-xs font-black ${
                    websiteContent.isVisible
                      ? "bg-teal-50 text-teal-700"
                      : "bg-red-50 text-red-600"
                  }`}
                >
                  {websiteContent.isVisible ? "Section Show" : "Section Hidden"}{" "}
                  ·{getDurationLabel(websiteContent.showDuration)}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => selectCategory(category)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-black ${
                      activeCategory === category
                        ? "border-teal-600 bg-teal-600 text-white"
                        : "border-slate-200 bg-white text-slate-700"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {!websiteContent.isVisible ? (
                  <div className="rounded-2xl border border-dashed border-red-200 bg-red-50/40 p-6 text-center md:col-span-2 xl:col-span-3">
                    <p className="font-bold text-red-600">
                      Doctor section website এ hidden আছে
                    </p>
                  </div>
                ) : previewDoctors.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-center md:col-span-2 xl:col-span-3">
                    <p className="font-bold text-slate-700">
                      Website preview তে কোনো doctor show হচ্ছে না
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Doctor visible করুন অথবা category filter change করুন।
                    </p>
                  </div>
                ) : (
                  previewDoctors.map((doctor) => (
                    <div
                      key={doctor.id}
                      className="rounded-2xl border border-slate-200 bg-white p-4"
                    >
                      <div className="flex items-center gap-3">
                        {doctor.imageUrl ? (
                          <img
                            src={doctor.imageUrl}
                            alt={doctor.name}
                            className="h-12 w-12 shrink-0 rounded-xl object-cover"
                          />
                        ) : (
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-600 text-xs font-black text-white">
                            {getInitials(doctor.name)}
                          </div>
                        )}

                        <div className="min-w-0">
                          <h3 className="truncate text-sm font-black text-slate-950">
                            {doctor.name}
                          </h3>
                          <p className="truncate text-xs font-bold text-teal-700">
                            {doctor.specialty}
                          </p>
                          <p className="truncate text-xs text-slate-500">
                            {doctor.degree}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 space-y-2 text-xs text-slate-700">
                        <p className="rounded-xl bg-slate-50 p-2">
                          <b>সমস্যা:</b> {doctor.problems || "Not added"}
                        </p>
                        <p className="rounded-xl bg-slate-50 p-2">
                          <b>সময়:</b>{" "}
                          {doctor.timeSlots.length
                            ? doctor.timeSlots.join(", ")
                            : "Not set"}
                        </p>
                        <p className="rounded-xl bg-slate-50 p-2">
                          <b>দিন:</b> {doctor.days || "Not set"} · <b>রুম:</b>{" "}
                          {doctor.room || "Not set"}
                        </p>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-black ${
                            doctor.isToday
                              ? "bg-teal-50 text-teal-700"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {doctor.isToday ? "আজকে বসেছেন" : "Schedule only"}
                        </span>

                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-500">
                          {getDurationLabel(doctor.showDuration)}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>
        </div>
      </div>

      {isCategoryModalOpen ? (
        <div
          onClick={closeCategoryModal}
          className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 p-3 sm:items-center"
        >
          <div
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-md rounded-3xl bg-white shadow-2xl"
          >
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 p-4">
              <div>
                <h2 className="text-xl font-black text-slate-950">
                  Add Category
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  নতুন category add করলে filter button-এ show হবে।
                </p>
              </div>

              <button
                type="button"
                onClick={closeCategoryModal}
                className="rounded-full border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50 hover:text-slate-950"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={addCategory} className="space-y-4 p-4">
              <TextInput
                label="Category Name"
                value={categoryInput}
                placeholder="যেমন: ডেন্টাল"
                onChange={setCategoryInput}
              />

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={closeCategoryModal}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-50"
                >
                  <X className="h-4 w-4" />
                  Cancel
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

      {isDoctorModalOpen ? (
        <div
          onClick={closeDoctorModal}
          className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 p-3 sm:items-center"
        >
          <div
            onClick={(event) => event.stopPropagation()}
            className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white shadow-2xl"
          >
            <div className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b border-slate-100 bg-white p-4">
              <div>
                <h2 className="text-xl font-black text-slate-950">
                  {editingDoctorId ? "Edit Doctor" : "Add New Doctor"}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Save করলে doctor list এবং website preview update হবে।
                </p>
              </div>

              <button
                type="button"
                onClick={closeDoctorModal}
                className="rounded-full border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50 hover:text-slate-950"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={saveDoctor} className="space-y-4 p-4">
              <div className="grid gap-3 md:grid-cols-2">
                <TextInput
                  label="Doctor Name"
                  value={doctorForm.name}
                  placeholder="ডা. নাম লিখুন"
                  onChange={(value) => updateDoctorForm("name", value)}
                />

                <TextInput
                  label="Specialty"
                  value={doctorForm.specialty}
                  placeholder="মেডিসিন বিশেষজ্ঞ"
                  onChange={(value) => updateDoctorForm("specialty", value)}
                />

                <TextInput
                  label="Degree"
                  value={doctorForm.degree}
                  placeholder="MBBS, FCPS"
                  onChange={(value) => updateDoctorForm("degree", value)}
                />

                <label className="block">
                  <span className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">
                    Category
                  </span>
                  <select
                    value={doctorForm.category}
                    onChange={(event) =>
                      updateDoctorForm("category", event.target.value)
                    }
                    className="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold outline-none focus:border-teal-500"
                  >
                    {categories
                      .filter((category) => category !== "সব")
                      .map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                  </select>
                </label>

                <TextInput
                  label="Room"
                  value={doctorForm.room}
                  placeholder="রুম ২০৪"
                  onChange={(value) => updateDoctorForm("room", value)}
                />

                <TextInput
                  label="Days"
                  value={doctorForm.days}
                  placeholder="শনি, সোম, বুধ"
                  onChange={(value) => updateDoctorForm("days", value)}
                />
              </div>

              <TextAreaInput
                label="Problems"
                value={doctorForm.problems}
                placeholder="জ্বর, প্রেসার, ডায়াবেটিস"
                onChange={(value) => updateDoctorForm("problems", value)}
              />

              <div className="rounded-2xl border border-slate-200 p-3">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  {doctorForm.imageUrl ? (
                    <img
                      src={doctorForm.imageUrl}
                      alt="Doctor profile preview"
                      className="h-16 w-16 rounded-2xl object-cover"
                    />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-950 text-sm font-black text-white">
                      {getInitials(doctorForm.name)}
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <TextInput
                      label="Image URL optional"
                      value={doctorForm.imageUrl}
                      placeholder="https://example.com/doctor.jpg"
                      onChange={(value) => updateDoctorForm("imageUrl", value)}
                    />
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2">
                  <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-black text-slate-700 transition hover:bg-slate-50">
                    <ImagePlus className="h-4 w-4" />
                    Add Photo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>

                  <button
                    type="button"
                    onClick={clearProfilePhoto}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-100 px-4 py-2.5 text-sm font-black text-red-600 transition hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                    Remove
                  </button>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 p-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-black text-slate-950">
                      Time Slots
                    </h3>
                    <p className="text-xs text-slate-500">
                      একাধিক schedule time add করা যাবে।
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={addTimeSlot}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-slate-950 px-3 py-2 text-xs font-black text-white transition hover:bg-teal-700"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add Slot
                  </button>
                </div>

                <div className="mt-3 space-y-2">
                  {doctorForm.timeSlots.map((slot, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        value={slot}
                        onChange={(event) =>
                          updateTimeSlot(index, event.target.value)
                        }
                        placeholder="৪টা - ৮টা"
                        className="h-10 min-w-0 flex-1 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-teal-500"
                      />

                      <button
                        type="button"
                        onClick={() => removeTimeSlot(index)}
                        className="rounded-xl border border-red-100 px-3 text-red-600 transition hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                <ToggleSwitch
                  checked={doctorForm.isVisible}
                  onChange={() =>
                    updateDoctorForm("isVisible", !doctorForm.isVisible)
                  }
                  label="Website"
                  activeText="Show"
                  inactiveText="Hide"
                />

                <ToggleSwitch
                  checked={doctorForm.isToday}
                  onChange={() =>
                    updateDoctorForm("isToday", !doctorForm.isToday)
                  }
                  label="Today"
                  activeText="বসেছেন"
                  inactiveText="বসেননি"
                />

                <label className="block rounded-xl border border-slate-200 bg-white px-3 py-2">
                  <span className="text-xs font-bold text-slate-500">
                    Show Duration
                  </span>
                  <select
                    value={doctorForm.showDuration}
                    onChange={(event) =>
                      updateDoctorForm(
                        "showDuration",
                        event.target.value as ShowDuration,
                      )
                    }
                    className="mt-1 h-7 w-full bg-transparent text-sm font-black text-slate-800 outline-none"
                  >
                    {showDurationOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="sticky bottom-0 -mx-4 -mb-4 grid grid-cols-2 gap-2 border-t border-slate-100 bg-white p-4">
                <button
                  type="button"
                  onClick={closeDoctorModal}
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
                  {editingDoctorId ? "Save Changes" : "Save Doctor"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
