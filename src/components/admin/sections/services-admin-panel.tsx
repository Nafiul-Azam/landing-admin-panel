"use client";

import Link from "next/link";
import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  HeartPulse,
  ImagePlus,
  Pencil,
  Plus,
  Save,
  Search,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";

type ServiceStatus = "Active" | "Draft" | "Unavailable";

type Service = {
  id: string;
  name: string;
  category: string;
  fee: string;
  status: ServiceStatus;
  isVisible: boolean;
  description: string;
  imageUrl: string;
  buttonText: string;
  smallButtonText: string;
};

type ServiceForm = Omit<Service, "id">;

type SectionContent = {
  badge: string;
  title: string;
  description: string;
  listTitle: string;
  listSubtitle: string;
};

const defaultSectionContent: SectionContent = {
  badge: "SERVICES & DOCTORS",
  title: "সেবাসমূহ ও ডাক্তার তথ্য",
  description:
    "আমাদের ক্লিনিকে কোন কোন সেবা পাওয়া যায় এবং কোন সমস্যার জন্য কোন ডাক্তার বসেন — তা সহজে বুঝতে এখানে সুন্দরভাবে সাজানো হয়েছে।",
  listTitle: "আমাদের সেবাসমূহ",
  listSubtitle: "পরীক্ষা করার আগে সেবার ধরন দেখে নিন",
};

const initialServices: Service[] = [
  {
    id: "srv-1",
    name: "ম্যাগনেটিক রেজোন্যান্স ইমেজিং (MRI)",
    category: "Imaging & Radiology",
    fee: "3500",
    status: "Active",
    isVisible: true,
    description: "নির্ভুল MRI পরীক্ষা ও দ্রুত রিপোর্ট সুবিধা",
    imageUrl:
      "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&w=900&q=80",
    buttonText: "যোগাযোগ করুন",
    smallButtonText: "কল",
  },
  {
    id: "srv-2",
    name: "কম্পিউটেড টমোগ্রাফি (CT Scan)",
    category: "Imaging & Radiology",
    fee: "2500",
    status: "Active",
    isVisible: true,
    description: "উন্নত CT Scan সেবা ও নির্ভরযোগ্য বিশ্লেষণ",
    imageUrl:
      "https://images.unsplash.com/photo-1581093458791-9f3c3a4f913b?auto=format&fit=crop&w=900&q=80",
    buttonText: "যোগাযোগ করুন",
    smallButtonText: "কল",
  },
  {
    id: "srv-3",
    name: "প্যাথলজি ও ল্যাব টেস্ট",
    category: "Pathology & Laboratory",
    fee: "550",
    status: "Active",
    isVisible: true,
    description: "রক্ত ও বিভিন্ন পরীক্ষার আধুনিক সুবিধা",
    imageUrl:
      "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=900&q=80",
    buttonText: "যোগাযোগ করুন",
    smallButtonText: "কল",
  },
  {
    id: "srv-4",
    name: "ইসিজি (ECG) পরীক্ষা",
    category: "Cardiology",
    fee: "700",
    status: "Active",
    isVisible: true,
    description: "হার্ট পর্যবেক্ষণের দ্রুত ও নির্ভরযোগ্য সেবা",
    imageUrl:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=900&q=80",
    buttonText: "যোগাযোগ করুন",
    smallButtonText: "কল",
  },
  {
    id: "srv-5",
    name: "আল্ট্রাসনোগ্রাফি সেবা",
    category: "Diagnostic Test",
    fee: "1200",
    status: "Active",
    isVisible: true,
    description: "বিশেষজ্ঞ তত্ত্বাবধানে উন্নত আল্ট্রাসনোগ্রাফি",
    imageUrl:
      "https://images.unsplash.com/photo-1580281657527-47f249e8f4df?auto=format&fit=crop&w=900&q=80",
    buttonText: "যোগাযোগ করুন",
    smallButtonText: "কল",
  },
  {
    id: "srv-6",
    name: "ডিজিটাল এক্স-রে",
    category: "Imaging & Radiology",
    fee: "900",
    status: "Active",
    isVisible: true,
    description: "দ্রুত ও নির্ভরযোগ্য X-Ray রিপোর্ট সুবিধা",
    imageUrl:
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=900&q=80",
    buttonText: "যোগাযোগ করুন",
    smallButtonText: "কল",
  },
];

const emptyForm: ServiceForm = {
  name: "",
  category: "Diagnostic Test",
  fee: "",
  status: "Active",
  isVisible: true,
  description: "",
  imageUrl: "",
  buttonText: "যোগাযোগ করুন",
  smallButtonText: "কল",
};

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
        className="mt-1 w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
      />
    </label>
  );
}

function ServiceStatusBadge({ status }: { status: ServiceStatus }) {
  const style =
    status === "Active"
      ? "bg-teal-50 text-teal-700"
      : status === "Draft"
        ? "bg-amber-50 text-amber-700"
        : "bg-red-50 text-red-600";

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-black ${style}`}>
      {status}
    </span>
  );
}

export default function ServicesAdminPanel() {
  const [sectionContent, setSectionContent] = useState(defaultSectionContent);
  const [sectionDraft, setSectionDraft] = useState(defaultSectionContent);

  const [services, setServices] = useState(initialServices);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [sectionModalOpen, setSectionModalOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [toast, setToast] = useState("Ready to manage services");

  const visibleServices = services.filter(
    (service) => service.isVisible && service.status === "Active",
  );

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return services.filter(
      (service) =>
        keyword.length === 0 ||
        service.name.toLowerCase().includes(keyword) ||
        service.category.toLowerCase().includes(keyword) ||
        service.description.toLowerCase().includes(keyword),
    );
  }, [search, services]);

  function showToast(message: string) {
    setToast(message);
  }

  function updateForm<K extends keyof ServiceForm>(
    key: K,
    value: ServiceForm[K],
  ) {
    setForm((previous) => ({ ...previous, [key]: value }));
  }

  function updateSectionDraft<K extends keyof SectionContent>(
    key: K,
    value: SectionContent[K],
  ) {
    setSectionDraft((previous) => ({ ...previous, [key]: value }));
  }

  function openAdd() {
    setEditingId(null);
    setForm(emptyForm);
    setServiceModalOpen(true);
    showToast("Add service form opened");
  }

  function openEdit(service: Service) {
    setEditingId(service.id);
    setForm({
      name: service.name,
      category: service.category,
      fee: service.fee,
      status: service.status,
      isVisible: service.isVisible,
      description: service.description,
      imageUrl: service.imageUrl,
      buttonText: service.buttonText,
      smallButtonText: service.smallButtonText,
    });
    setServiceModalOpen(true);
    showToast("Edit service form opened");
  }

  function closeServiceModal() {
    setEditingId(null);
    setForm(emptyForm);
    setServiceModalOpen(false);
  }

  function openSectionEdit() {
    setSectionDraft(sectionContent);
    setSectionModalOpen(true);
    showToast("Section content edit form opened");
  }

  function closeSectionModal() {
    setSectionDraft(sectionContent);
    setSectionModalOpen(false);
  }

  function saveSection(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!sectionDraft.title.trim()) {
      showToast("Section title required");
      return;
    }

    setSectionContent(sectionDraft);
    setSectionModalOpen(false);
    showToast("Section content updated successfully");
  }

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.name.trim()) {
      showToast("Service name required");
      return;
    }

    if (!form.description.trim()) {
      showToast("Service description required");
      return;
    }

    if (!form.imageUrl.trim()) {
      showToast("Service image required");
      return;
    }

    if (editingId) {
      setServices((previous) =>
        previous.map((service) =>
          service.id === editingId
            ? { ...service, ...form, name: form.name.trim() }
            : service,
        ),
      );
      showToast("Service updated successfully");
    } else {
      setServices((previous) => [
        { id: `srv-${Date.now()}`, ...form, name: form.name.trim() },
        ...previous,
      ]);
      showToast("New service added successfully");
    }

    closeServiceModal();
  }

  function remove(id: string) {
    const service = services.find((item) => item.id === id);
    const confirmDelete = window.confirm(
      `${service?.name || "এই service"} delete করবেন?`,
    );

    if (!confirmDelete) {
      showToast("Delete cancelled");
      return;
    }

    setServices((previous) => previous.filter((service) => service.id !== id));
    showToast("Service deleted successfully");
  }

  function toggleVisible(id: string) {
    setServices((previous) =>
      previous.map((service) =>
        service.id === id
          ? { ...service, isVisible: !service.isVisible }
          : service,
      ),
    );
    showToast("Website visibility updated");
  }

  function handleImageUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        updateForm("imageUrl", reader.result);
        showToast("Image uploaded successfully");
      }
    };

    reader.readAsDataURL(file);
  }

  function removeImage() {
    updateForm("imageUrl", "");
    showToast("Image removed");
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

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={openSectionEdit}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-black text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <Pencil className="h-4 w-4" />
            Edit Section
          </button>

          <button
            type="button"
            onClick={openAdd}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-black text-white shadow-sm transition hover:bg-teal-700"
          >
            <Plus className="h-4 w-4" />
            Add Service
          </button>
        </div>
      </div>

      <div className="fixed right-4 top-4 z-40 hidden max-w-sm items-center gap-2 rounded-2xl border border-teal-100 bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-lg shadow-slate-200/60 sm:flex">
        <CheckCircle2 className="h-4 w-4 shrink-0 text-teal-600" />
        <span>{toast}</span>
      </div>

      <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1 text-xs font-black text-teal-700">
              <HeartPulse className="h-3.5 w-3.5" />
              Service Section Control
            </div>

            <h1 className="mt-3 text-2xl font-black text-slate-950">
              Services Admin
            </h1>

            <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600">
              Screenshot-এর মতো service card, heading, description, image,
              visibility, edit এবং delete এখান থেকে manage করুন।
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 sm:hidden">
            {toast}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 xl:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 p-3">
            <p className="text-xs font-bold text-slate-500">Total</p>
            <p className="text-2xl font-black text-slate-950">
              {services.length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 p-3">
            <p className="text-xs font-bold text-slate-500">Visible</p>
            <p className="text-2xl font-black text-slate-950">
              {services.filter((item) => item.isVisible).length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 p-3">
            <p className="text-xs font-bold text-slate-500">Draft</p>
            <p className="text-2xl font-black text-slate-950">
              {services.filter((item) => item.status === "Draft").length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 p-3">
            <p className="text-xs font-bold text-slate-500">Unavailable</p>
            <p className="text-2xl font-black text-slate-950">
              {services.filter((item) => item.status === "Unavailable").length}
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search service..."
            className="h-11 w-full rounded-xl border border-slate-200 pl-10 pr-3 text-sm outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
          />
        </label>

        <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
          <div className="hidden grid-cols-[1.4fr_1fr_0.7fr_0.8fr_0.8fr_1fr] gap-3 bg-slate-50 px-4 py-3 text-xs font-black uppercase tracking-[0.12em] text-slate-500 xl:grid">
            <span>Service</span>
            <span>Category</span>
            <span>Fee</span>
            <span>Status</span>
            <span>Visible</span>
            <span className="text-right">Action</span>
          </div>

          <div className="divide-y divide-slate-100">
            {filtered.length === 0 ? (
              <div className="p-8 text-center text-sm font-bold text-slate-500">
                No service found
              </div>
            ) : (
              filtered.map((service) => (
                <div
                  key={service.id}
                  className="grid gap-3 p-4 text-sm transition hover:bg-slate-50 xl:grid-cols-[1.4fr_1fr_0.7fr_0.8fr_0.8fr_1fr] xl:items-center"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className="h-14 w-20 shrink-0 rounded-xl bg-slate-100 bg-cover bg-center"
                      style={{ backgroundImage: `url(${service.imageUrl})` }}
                    />

                    <div className="min-w-0">
                      <p className="truncate font-black text-slate-950">
                        {service.name}
                      </p>
                      <p className="line-clamp-1 text-xs text-slate-500">
                        {service.description}
                      </p>
                    </div>
                  </div>

                  <div className="text-xs font-bold text-slate-600">
                    {service.category}
                  </div>

                  <div className="font-bold text-slate-800">৳{service.fee}</div>

                  <div>
                    <ServiceStatusBadge status={service.status} />
                  </div>

                  <div className="text-xs font-black">
                    {service.isVisible ? (
                      <span className="text-teal-700">Visible</span>
                    ) : (
                      <span className="text-red-600">Hidden</span>
                    )}
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => openEdit(service)}
                      className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-black text-slate-700 transition hover:bg-white"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleVisible(service.id)}
                      className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-black text-slate-700 transition hover:bg-white"
                    >
                      {service.isVisible ? (
                        <EyeOff className="h-3.5 w-3.5" />
                      ) : (
                        <Eye className="h-3.5 w-3.5" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => remove(service.id)}
                      className="rounded-lg border border-red-100 px-3 py-2 text-xs font-black text-red-600 transition hover:bg-red-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
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
          <div className="text-center">
            <p className="mx-auto w-fit rounded-full border border-teal-100 bg-white px-4 py-1 text-[10px] font-black uppercase tracking-[0.28em] text-teal-700 shadow-sm">
              {sectionContent.badge}
            </p>

            <h2 className="mt-4 text-3xl font-black text-teal-900 md:text-4xl">
              {sectionContent.title}
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-600">
              {sectionContent.description}
            </p>
          </div>

          <div className="mt-10">
            <h3 className="text-2xl font-black text-teal-900">
              {sectionContent.listTitle}
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              {sectionContent.listSubtitle}
            </p>

            <div className="mt-6 grid gap-5 lg:grid-cols-3">
              {visibleServices.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm font-bold text-slate-500 lg:col-span-3">
                  Website preview-তে কোনো visible active service নেই।
                </div>
              ) : (
                visibleServices.map((service) => (
                  <div
                    key={service.id}
                    className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200"
                  >
                    <div
                      className="relative h-48 bg-slate-100 bg-cover bg-center"
                      style={{ backgroundImage: `url(${service.imageUrl})` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-teal-950/70 via-teal-950/20 to-transparent" />

                      <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-white/20 bg-slate-900/45 px-4 py-3 text-white backdrop-blur">
                        <h4 className="text-sm font-black">{service.name}</h4>
                      </div>
                    </div>

                    <div className="p-4">
                      <p className="min-h-[40px] text-sm leading-6 text-slate-600">
                        {service.description}
                      </p>

                      <div className="mt-4 grid grid-cols-[1fr_auto] gap-2">
                        <button
                          type="button"
                          className="rounded-full bg-teal-600 px-4 py-2.5 text-xs font-black text-white transition hover:bg-teal-700"
                        >
                          {service.buttonText}
                        </button>

                        <button
                          type="button"
                          className="rounded-full border border-teal-100 px-4 py-2.5 text-xs font-black text-teal-700 transition hover:bg-teal-50"
                        >
                          {service.smallButtonText}
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {sectionModalOpen ? (
        <div
          onClick={closeSectionModal}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
        >
          <div
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-2xl rounded-3xl bg-white shadow-xl"
          >
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 bg-slate-950 px-4 py-4 text-white sm:px-6">
              <h2 className="text-lg font-black">Edit Section Content</h2>

              <button
                type="button"
                onClick={closeSectionModal}
                className="rounded-full bg-white/10 p-2 transition hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={saveSection} className="space-y-4 p-4 sm:p-6">
              <div className="grid gap-3 md:grid-cols-2">
                <TextInput
                  label="Top Badge"
                  value={sectionDraft.badge}
                  onChange={(value) => updateSectionDraft("badge", value)}
                />

                <TextInput
                  label="Main Title"
                  value={sectionDraft.title}
                  onChange={(value) => updateSectionDraft("title", value)}
                />

                <TextInput
                  label="List Title"
                  value={sectionDraft.listTitle}
                  onChange={(value) => updateSectionDraft("listTitle", value)}
                />

                <TextInput
                  label="List Subtitle"
                  value={sectionDraft.listSubtitle}
                  onChange={(value) =>
                    updateSectionDraft("listSubtitle", value)
                  }
                />
              </div>

              <TextAreaInput
                label="Section Description"
                value={sectionDraft.description}
                onChange={(value) => updateSectionDraft("description", value)}
              />

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={closeSectionModal}
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

      {serviceModalOpen ? (
        <div
          onClick={closeServiceModal}
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-4"
        >
          <div
            onClick={(event) => event.stopPropagation()}
            className="my-8 w-full max-w-3xl rounded-3xl bg-white shadow-xl"
          >
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 bg-slate-950 px-4 py-4 text-white sm:px-6">
              <h2 className="text-lg font-black">
                {editingId ? "Edit Service" : "Add Service"}
              </h2>

              <button
                type="button"
                onClick={closeServiceModal}
                className="rounded-full bg-white/10 p-2 transition hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={save} className="space-y-4 p-4 sm:p-6">
              <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
                <div className="space-y-4">
                  <div className="grid gap-3 md:grid-cols-2">
                    <TextInput
                      label="Service Name"
                      value={form.name}
                      placeholder="MRI / CT Scan / ECG"
                      onChange={(value) => updateForm("name", value)}
                    />

                    <TextInput
                      label="Category"
                      value={form.category}
                      placeholder="Imaging & Radiology"
                      onChange={(value) => updateForm("category", value)}
                    />

                    <TextInput
                      label="Fee"
                      value={form.fee}
                      type="number"
                      placeholder="700"
                      onChange={(value) => updateForm("fee", value)}
                    />

                    <label className="block">
                      <span className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">
                        Status
                      </span>
                      <select
                        value={form.status}
                        onChange={(event) =>
                          updateForm(
                            "status",
                            event.target.value as ServiceStatus,
                          )
                        }
                        className="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold outline-none focus:border-teal-500"
                      >
                        <option value="Active">Active</option>
                        <option value="Draft">Draft</option>
                        <option value="Unavailable">Unavailable</option>
                      </select>
                    </label>

                    <TextInput
                      label="Main Button Text"
                      value={form.buttonText}
                      placeholder="যোগাযোগ করুন"
                      onChange={(value) => updateForm("buttonText", value)}
                    />

                    <TextInput
                      label="Small Button Text"
                      value={form.smallButtonText}
                      placeholder="কল"
                      onChange={(value) => updateForm("smallButtonText", value)}
                    />
                  </div>

                  <TextAreaInput
                    label="Description"
                    value={form.description}
                    placeholder="Service short description"
                    onChange={(value) => updateForm("description", value)}
                  />

                  <TextInput
                    label="Image URL"
                    value={form.imageUrl}
                    placeholder="Paste image URL or upload from device"
                    onChange={(value) => updateForm("imageUrl", value)}
                  />

                  <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700">
                    <input
                      type="checkbox"
                      checked={form.isVisible}
                      onChange={(event) =>
                        updateForm("isVisible", event.target.checked)
                      }
                    />
                    Website visible
                  </label>
                </div>

                <div className="space-y-3">
                  <div
                    className="h-48 rounded-2xl border border-slate-200 bg-slate-100 bg-cover bg-center"
                    style={{
                      backgroundImage: form.imageUrl
                        ? `url(${form.imageUrl})`
                        : "none",
                    }}
                  >
                    {!form.imageUrl ? (
                      <div className="flex h-full flex-col items-center justify-center text-center text-slate-400">
                        <ImagePlus className="h-8 w-8" />
                        <p className="mt-2 text-xs font-bold">No image</p>
                      </div>
                    ) : null}
                  </div>

                  <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-50">
                    <UploadCloud className="h-4 w-4" />
                    Upload Picture
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>

                  <button
                    type="button"
                    onClick={removeImage}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-red-100 px-4 py-3 text-sm font-black text-red-600 transition hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                    Remove Picture
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={closeServiceModal}
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
