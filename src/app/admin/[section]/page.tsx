"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import {
  ArrowLeft,
  BadgePercent,
  BarChart3,
  CalendarCheck,
  CheckCircle2,
  Clock3,
  Globe,
  Eye,
  EyeOff,
  HeartPulse,
  Home,
  ImagePlus,
  Mail,
  MapPin,
  MessageCircle,
  Pencil,
  Phone,
  Plus,
  RotateCcw,
  Save,
  Search,
  ShieldCheck,
  Stethoscope,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";

/* =========================================================
   1. TYPES
   ========================================================= */

type ShowDuration = "24h" | "1d" | "7d" | "until_changed";
type DiscountType = "none" | "flat" | "percent";
type ServiceStatus = "Active" | "Draft" | "Unavailable";
type AppointmentStatus = "Pending" | "Confirmed" | "Completed" | "Cancelled";

type ServiceSectionSettings = {
  badge: string;
  title: string;
  description: string;
  shortDescription: string;
  isVisible: boolean;
  showDuration: ShowDuration;
};

type ServiceCategory = {
  id: string;
  name: string;
  isVisible: boolean;
};

type ServiceItem = {
  id: string;
  name: string;
  categoryId: string;
  categoryName: string;
  description: string;
  regularFee: string;
  testFee: string;
  discountType: DiscountType;
  discountValue: string;
  finalFee: string;
  reportTime: string;
  duration: string;
  preparation: string;
  sampleRequired: string;
  availableDays: string;
  availableTime: string;
  isVisible: boolean;
  isFeatured: boolean;
  isHomeService: boolean;
  isEmergency: boolean;
  isOnlineBooking: boolean;
  status: ServiceStatus;
  showDuration: ShowDuration;
};

type ServiceForm = Omit<ServiceItem, "id" | "categoryName" | "finalFee">;
type SectionKey = "doctors" | "website" | "settings";

type SectionConfig = {
  title: string;
  description: string;
  icon: typeof Stethoscope;
};

type AppointmentItem = {
  id: string;
  serialNo: string;
  patientName: string;
  phone: string;
  doctorName: string;
  department: string;
  date: string;
  time: string;
  visitType: string;
  note: string;
  status: AppointmentStatus;
};

type AppointmentForm = Omit<AppointmentItem, "id" | "serialNo">;

type WebsiteHero = {
  badge: string;
  title: string;
  highlight: string;
  description: string;
};

type WebsiteHeroCard = {
  id: string;
  badge: string;
  title: string;
  description: string;
  imageUrl: string;
};

type WebsiteProgress = {
  badge: string;
  title: string;
  description: string;
  showDuration: ShowDuration;
};

type WebsiteMetric = {
  id: string;
  label: string;
  value: string;
  trend: string;
  direction: "up" | "down";
};

type WebsiteContact = {
  id: string;
  label: string;
  value: string;
  link: string;
};

type WebsiteLocation = {
  id: string;
  name: string;
  address: string;
  mapLink: string;
  callLink: string;
};

type WebsiteFooterLink = {
  id: string;
  label: string;
  href: string;
};

type WebsitePost = {
  id: string;
  type: "Blog" | "Article" | "Health Tip";
  title: string;
  summary: string;
  link: string;
};

type GalleryCategory = {
  id: string;
  name: string;
  subtitle: string;
};

type GalleryImage = {
  id: string;
  categoryId: string;
  title: string;
  imageUrl: string;
  link: string;
};

/* =========================================================
   2. DEFAULT DATA
   ========================================================= */

const showDurationOptions: { label: string; value: ShowDuration }[] = [
  { label: "24 Hour", value: "24h" },
  { label: "1 Day", value: "1d" },
  { label: "7 Days", value: "7d" },
  { label: "Until Changed", value: "until_changed" },
];

const sectionConfig: Record<SectionKey, SectionConfig> = {
  doctors: {
    title: "Doctors",
    description:
      "Doctor profiles, specialties, schedule, and website visibility controls.",
    icon: Stethoscope,
  },
  website: {
    title: "Website Control",
    description:
      "Public clinic website content, sections, and visibility controls.",
    icon: ShieldCheck,
  },
  settings: {
    title: "Settings",
    description:
      "Admin preferences, panel configuration, and clinic setup controls.",
    icon: Home,
  },
};

const appointmentStatusOptions: AppointmentStatus[] = [
  "Pending",
  "Confirmed",
  "Completed",
  "Cancelled",
];

const emptyAppointmentForm: AppointmentForm = {
  patientName: "",
  phone: "",
  doctorName: "ডা. সাদিয়া রহমান",
  department: "হৃদরোগ",
  date: "",
  time: "৪টা - ৫টা",
  visitType: "Regular Serial",
  note: "",
  status: "Pending",
};

const initialAppointments: AppointmentItem[] = [
  {
    id: "apt-1",
    serialNo: "APT-001",
    patientName: "মোঃ করিম উদ্দিন",
    phone: "01700000001",
    doctorName: "ডা. সাদিয়া রহমান",
    department: "হৃদরোগ",
    date: "2026-05-01",
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
    date: "2026-05-01",
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
    date: "2026-05-02",
    time: "১১টা - ১২টা",
    visitType: "Emergency Serial",
    note: "High fever",
    status: "Completed",
  },
];

const defaultWebsiteHero: WebsiteHero = {
  badge: "ADVANCED DIAGNOSTIC CARE",
  title: "আধুনিক প্রযুক্তি, নির্ভরযোগ্য রিপোর্ট এবং আন্তরিক সেবায়",
  highlight: "আপনার আস্থার ঠিকানা",
  description:
    "উন্নত MRI, অভিজ্ঞ চিকিৎসক এবং রোগীকেন্দ্রিক সেবার সমন্বয়ে আমরা প্রতিদিন কাজ করছি আরও নির্ভরযোগ্য স্বাস্থ্যসেবা পৌঁছে দিতে।",
};

const initialHeroCards: WebsiteHeroCard[] = [
  {
    id: "hero-card-1",
    badge: "Main Highlight",
    title: "রংপুরে আমরাই প্রথম উন্নতমানের MRI সেবা প্রদান করছি",
    description: "দ্রুত রিপোর্ট, আধুনিক মেশিন এবং অভিজ্ঞ টেকনিশিয়ান।",
    imageUrl:
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "hero-card-2",
    badge: "Trust & Technology",
    title: "অভিজ্ঞ ডাক্তার ও আধুনিক যন্ত্রপাতির সমন্বয়ে সেরা সেবা",
    description: "পরীক্ষা থেকে রিপোর্ট পর্যন্ত প্রতিটি ধাপে যত্ন।",
    imageUrl:
      "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "hero-card-3",
    badge: "Service & Care",
    title: "দ্রুত, সহজ ও মানসম্মত স্বাস্থ্যসেবা এখন আপনার হাতের মুঠোয়",
    description: "অনলাইন সিরিয়াল, স্বল্প সময়ে রিপোর্ট এবং ২৪/৭ পাশে থাকা।",
    imageUrl:
      "https://images.unsplash.com/photo-1512678080530-7760d81faba6?auto=format&fit=crop&w=900&q=80",
  },
];

const defaultWebsiteProgress: WebsiteProgress = {
  badge: "CLINIC PROGRESS",
  title: "আমাদের সেবার অগ্রগতি",
  description:
    "রোগী ভর্তি, সফল অপারেশন এবং পরীক্ষার সাম্প্রতিক অগ্রগতির সংক্ষিপ্ত পরিসংখ্যান।",
  showDuration: "until_changed",
};

const initialWebsiteMetrics: WebsiteMetric[] = [
  { id: "metric-1", label: "পেশেন্ট ভর্তি", value: "১২৪", trend: "-০.১%", direction: "down" },
  { id: "metric-2", label: "সফল অপারেশন", value: "৪৬", trend: "+০.১%", direction: "up" },
  { id: "metric-3", label: "টেস্ট সংখ্যা", value: "২২২", trend: "+২৬৬.৭%", direction: "up" },
];

const initialWebsiteContacts: WebsiteContact[] = [
  { id: "contact-1", label: "Facebook", value: "Facebook Page", link: "https://facebook.com" },
  { id: "contact-2", label: "YouTube", value: "YouTube Channel", link: "https://youtube.com" },
  { id: "contact-3", label: "WhatsApp", value: "+8801700000000", link: "https://wa.me/8801700000000" },
  { id: "contact-4", label: "Call", value: "09600-000000", link: "tel:09600000000" },
  { id: "contact-5", label: "Google Maps", value: "Main Branch", link: "https://maps.google.com" },
  { id: "contact-6", label: "Gmail", value: "info@clinic.test", link: "mailto:info@clinic.test" },
];

const initialWebsiteLocations: WebsiteLocation[] = [
  {
    id: "location-1",
    name: "আপডেট ক্লিনিক (রংপুর শাখা)",
    address: "ধাপ, জেল রোড, রংপুর - ৫৪০০",
    mapLink: "https://maps.google.com",
    callLink: "tel:09600000000",
  },
  {
    id: "location-2",
    name: "আপডেট ক্লিনিক (কুড়িগ্রাম শাখা)",
    address: "রাজাহাট, কুড়িগ্রাম, রংপুর",
    mapLink: "https://maps.google.com",
    callLink: "tel:09600000000",
  },
];

const initialFooterLinks: WebsiteFooterLink[] = [
  { id: "footer-1", label: "Privacy Policy", href: "/privacy-policy" },
  { id: "footer-2", label: "Terms & Conditions", href: "/terms" },
  { id: "footer-3", label: "FAQ", href: "/faq" },
  { id: "footer-4", label: "Support", href: "/support" },
];

const initialWebsitePosts: WebsitePost[] = [
  {
    id: "post-1",
    type: "Health Tip",
    title: "MRI করার আগে যেসব বিষয় জানা দরকার",
    summary: "পরীক্ষার প্রস্তুতি, সময় এবং রিপোর্ট নিয়ে রোগীদের জন্য সংক্ষিপ্ত গাইড।",
    link: "/health-tips/mri-preparation",
  },
  {
    id: "post-2",
    type: "Blog",
    title: "নিয়মিত স্বাস্থ্য পরীক্ষা কেন জরুরি",
    summary: "প্রাথমিক পর্যায়ে রোগ শনাক্ত করতে নিয়মিত চেকআপের ভূমিকা।",
    link: "/blog/regular-checkup",
  },
];

const initialGalleryCategories: GalleryCategory[] = [
  { id: "gallery-1", name: "রিসিপশন কর্নার", subtitle: "রোগীদের বসার আধুনিক ও আরামদায়ক স্থান" },
  { id: "gallery-2", name: "ডাক্তার ও নার্স", subtitle: "নিবেদিত সেবা টিম" },
  { id: "gallery-3", name: "রোগী ও সেবা", subtitle: "যত্ন ও মানবিক সহায়তা" },
];

const initialGalleryImages: GalleryImage[] = [
  {
    id: "image-1",
    categoryId: "gallery-1",
    title: "Main Reception",
    imageUrl:
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=900&q=80",
    link: "/gallery/reception",
  },
  {
    id: "image-2",
    categoryId: "gallery-2",
    title: "Care Team",
    imageUrl:
      "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=900&q=80",
    link: "/gallery/team",
  },
  {
    id: "image-3",
    categoryId: "gallery-3",
    title: "Patient Care",
    imageUrl:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=900&q=80",
    link: "/gallery/care",
  },
];

const defaultSectionSettings: ServiceSectionSettings = {
  badge: "CLINIC & DIAGNOSTIC SERVICES",
  title: "আমাদের সেবাসমূহ",
  description:
    "আমাদের ক্লিনিক ও ডায়াগনস্টিক সেন্টারে রোগীদের জন্য আধুনিক, নিরাপদ ও নির্ভরযোগ্য স্বাস্থ্যসেবা প্রদান করা হয়। এখানে অভিজ্ঞ ডাক্তার, প্রশিক্ষিত নার্স, আধুনিক ল্যাব সুবিধা এবং উন্নত ডায়াগনস্টিক মেশিনের মাধ্যমে রোগ নির্ণয় ও চিকিৎসা সেবা দেওয়া হয়।",
  shortDescription:
    "Doctor Consultation, Blood Test, X-Ray, Ultrasound, ECG, CT Scan, MRI, Emergency Service, Women & Child Care, Dental Care, Physiotherapy, Health Checkup Package, Home Sample Collection, Online Report এবং Appointment Booking সহ বিভিন্ন স্বাস্থ্যসেবা পাওয়া যায়।",
  isVisible: true,
  showDuration: "until_changed",
};

const initialCategories: ServiceCategory[] = [
  { id: "cat-1", name: "Doctor Consultation", isVisible: true },
  { id: "cat-2", name: "Diagnostic Test", isVisible: true },
  { id: "cat-3", name: "Imaging & Radiology", isVisible: true },
  { id: "cat-4", name: "Emergency Service", isVisible: true },
  { id: "cat-5", name: "Pathology & Laboratory", isVisible: true },
  { id: "cat-6", name: "Women & Child Care", isVisible: true },
  { id: "cat-7", name: "Dental Care", isVisible: true },
  { id: "cat-8", name: "Physiotherapy", isVisible: true },
  { id: "cat-9", name: "Pharmacy", isVisible: true },
  { id: "cat-10", name: "Health Checkup Package", isVisible: true },
  { id: "cat-11", name: "Home Service", isVisible: true },
  { id: "cat-12", name: "Ambulance Service", isVisible: true },
  { id: "cat-13", name: "Online Report & Appointment", isVisible: true },
  { id: "cat-14", name: "Patient Care & Support", isVisible: true },
];

const emptyServiceForm: ServiceForm = {
  name: "",
  categoryId: "cat-2",
  description: "",
  regularFee: "",
  testFee: "",
  discountType: "none",
  discountValue: "",
  reportTime: "",
  duration: "",
  preparation: "",
  sampleRequired: "",
  availableDays: "",
  availableTime: "",
  isVisible: true,
  isFeatured: false,
  isHomeService: false,
  isEmergency: false,
  isOnlineBooking: true,
  status: "Active",
  showDuration: "until_changed",
};

const initialServices: ServiceItem[] = [
  {
    id: "srv-1",
    name: "Doctor Consultation",
    categoryId: "cat-1",
    categoryName: "Doctor Consultation",
    description:
      "মেডিসিন, শিশু, গাইনি, সার্জারি, অর্থোপেডিক, কার্ডিওলজি, নিউরোলজি এবং অন্যান্য বিশেষজ্ঞ ডাক্তারদের পরামর্শ।",
    regularFee: "700",
    testFee: "0",
    discountType: "none",
    discountValue: "",
    finalFee: "700",
    reportTime: "Instant",
    duration: "15-20 min",
    preparation: "Previous prescription আনলে ভালো",
    sampleRequired: "No",
    availableDays: "Everyday",
    availableTime: "10 AM - 8 PM",
    isVisible: true,
    isFeatured: true,
    isHomeService: false,
    isEmergency: false,
    isOnlineBooking: true,
    status: "Active",
    showDuration: "until_changed",
  },
  {
    id: "srv-2",
    name: "CBC Blood Test",
    categoryId: "cat-5",
    categoryName: "Pathology & Laboratory",
    description:
      "CBC, ESR, CRP, Blood Sugar, Serum Creatinine সহ বিভিন্ন প্যাথলজি টেস্ট।",
    regularFee: "550",
    testFee: "550",
    discountType: "percent",
    discountValue: "10",
    finalFee: "495",
    reportTime: "6 Hours",
    duration: "5 min",
    preparation: "No special preparation",
    sampleRequired: "Blood",
    availableDays: "Everyday",
    availableTime: "8 AM - 8 PM",
    isVisible: true,
    isFeatured: true,
    isHomeService: true,
    isEmergency: false,
    isOnlineBooking: true,
    status: "Active",
    showDuration: "7d",
  },
  {
    id: "srv-3",
    name: "Digital X-Ray",
    categoryId: "cat-3",
    categoryName: "Imaging & Radiology",
    description: "Digital X-Ray report support with modern imaging facility.",
    regularFee: "900",
    testFee: "900",
    discountType: "flat",
    discountValue: "100",
    finalFee: "800",
    reportTime: "1 Hour",
    duration: "10 min",
    preparation: "Doctor advice required",
    sampleRequired: "No",
    availableDays: "Sat - Thu",
    availableTime: "9 AM - 6 PM",
    isVisible: true,
    isFeatured: false,
    isHomeService: false,
    isEmergency: true,
    isOnlineBooking: true,
    status: "Active",
    showDuration: "until_changed",
  },
];

/* =========================================================
   3. SMALL UI COMPONENTS
   ========================================================= */

function getDurationLabel(value: ShowDuration) {
  return (
    showDurationOptions.find((option) => option.value === value)?.label ||
    "Until Changed"
  );
}

function money(value: string) {
  if (!value) return "৳0";
  return `৳${value}`;
}

function calculateFinalFee(
  regularFee: string,
  discountType: DiscountType,
  discountValue: string,
) {
  const fee = Number(regularFee || 0);
  const discount = Number(discountValue || 0);

  if (!fee) return "";

  if (discountType === "flat") {
    return String(Math.max(fee - discount, 0));
  }

  if (discountType === "percent") {
    return String(Math.max(Math.round(fee - (fee * discount) / 100), 0));
  }

  return String(fee);
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

function DefaultAdminSection({ config }: { config: SectionConfig }) {
  const Icon = config.icon;

  return (
    <div className="space-y-5">
      <Link
        href="/admin"
        className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:text-slate-950"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to dashboard
      </Link>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white">
            <Icon className="h-5 w-5" />
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
              Admin section
            </p>
            <h2 className="text-2xl font-black text-slate-950">
              {config.title}
            </h2>
          </div>
        </div>

        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
          {config.description}
        </p>
      </section>
    </div>
  );
}

function AppointmentsAdminPanel() {
  const [appointments, setAppointments] = useState(initialAppointments);
  const [appointmentForm, setAppointmentForm] = useState(emptyAppointmentForm);
  const [editingAppointmentId, setEditingAppointmentId] = useState<
    string | null
  >(null);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | "All">(
    "All",
  );
  const [toast, setToast] = useState("Ready to manage appointments");

  const today = new Date().toISOString().slice(0, 10);
  const todayAppointments = appointments.filter((item) => item.date === today);
  const pendingAppointments = appointments.filter(
    (item) => item.status === "Pending",
  );
  const confirmedAppointments = appointments.filter(
    (item) => item.status === "Confirmed",
  );

  const filteredAppointments = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return appointments.filter((appointment) => {
      const searchMatched =
        keyword.length === 0 ||
        appointment.patientName.toLowerCase().includes(keyword) ||
        appointment.phone.toLowerCase().includes(keyword) ||
        appointment.serialNo.toLowerCase().includes(keyword) ||
        appointment.doctorName.toLowerCase().includes(keyword) ||
        appointment.department.toLowerCase().includes(keyword);

      const statusMatched =
        statusFilter === "All" || appointment.status === statusFilter;

      return searchMatched && statusMatched;
    });
  }, [appointments, search, statusFilter]);

  function showToast(message: string) {
    setToast(message);
  }

  function updateAppointmentForm<K extends keyof AppointmentForm>(
    key: K,
    value: AppointmentForm[K],
  ) {
    setAppointmentForm((previous) => ({
      ...previous,
      [key]: value,
    }));
  }

  function openAddAppointmentModal() {
    setEditingAppointmentId(null);
    setAppointmentForm(emptyAppointmentForm);
    setIsAppointmentModalOpen(true);
    showToast("Appointment form opened");
  }

  function openEditAppointmentModal(appointment: AppointmentItem) {
    setEditingAppointmentId(appointment.id);
    setAppointmentForm({
      patientName: appointment.patientName,
      phone: appointment.phone,
      doctorName: appointment.doctorName,
      department: appointment.department,
      date: appointment.date,
      time: appointment.time,
      visitType: appointment.visitType,
      note: appointment.note,
      status: appointment.status,
    });
    setIsAppointmentModalOpen(true);
    showToast(`${appointment.serialNo} edit mode opened`);
  }

  function closeAppointmentModal() {
    setEditingAppointmentId(null);
    setAppointmentForm(emptyAppointmentForm);
    setIsAppointmentModalOpen(false);
    showToast("Action cancelled");
  }

  function saveAppointment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!appointmentForm.patientName.trim()) {
      showToast("Patient name required");
      return;
    }

    if (!appointmentForm.phone.trim()) {
      showToast("Phone number required");
      return;
    }

    if (!appointmentForm.date.trim()) {
      showToast("Appointment date required");
      return;
    }

    if (editingAppointmentId) {
      setAppointments((previous) =>
        previous.map((appointment) =>
          appointment.id === editingAppointmentId
            ? {
                ...appointment,
                ...appointmentForm,
                patientName: appointmentForm.patientName.trim(),
              }
            : appointment,
        ),
      );
      setEditingAppointmentId(null);
      setAppointmentForm(emptyAppointmentForm);
      setIsAppointmentModalOpen(false);
      showToast("Appointment updated successfully");
      return;
    }

    const serialNo = `APT-${String(appointments.length + 1).padStart(3, "0")}`;

    setAppointments((previous) => [
      {
        id: `apt-${Date.now()}`,
        serialNo,
        ...appointmentForm,
        patientName: appointmentForm.patientName.trim(),
      },
      ...previous,
    ]);
    setAppointmentForm(emptyAppointmentForm);
    setIsAppointmentModalOpen(false);
    showToast(`${serialNo} appointment created successfully`);
  }

  function deleteAppointment(id: string) {
    const appointment = appointments.find((item) => item.id === id);
    const confirmDelete = window.confirm(
      `${appointment?.serialNo || "এই appointment"} delete করবেন?`,
    );

    if (!confirmDelete) {
      showToast("Delete cancelled");
      return;
    }

    setAppointments((previous) =>
      previous.filter((appointment) => appointment.id !== id),
    );
    showToast("Appointment deleted successfully");
  }

  function updateAppointmentStatus(id: string, status: AppointmentStatus) {
    setAppointments((previous) =>
      previous.map((appointment) =>
        appointment.id === id ? { ...appointment, status } : appointment,
      ),
    );
    showToast(`Appointment status changed to ${status}`);
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
          onClick={openAddAppointmentModal}
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

      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 bg-slate-950 p-5 text-white">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-black text-teal-100">
                <CalendarCheck className="h-3.5 w-3.5" />
                Appointment Control
              </div>
              <h1 className="mt-3 text-2xl font-black">Appointments Admin</h1>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-300">
                Doctor-wise serial, patient schedule, time slot, visit type,
                status এবং daily appointment workflow manage করুন।
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 xl:w-[520px]">
              {[
                ["Total", appointments.length],
                ["Today", todayAppointments.length],
                ["Pending", pendingAppointments.length],
                ["Confirmed", confirmedAppointments.length],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl bg-white/10 p-3">
                  <p className="text-xs font-bold text-slate-300">{label}</p>
                  <p className="text-2xl font-black">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-5">
          <div className="grid gap-3 lg:grid-cols-[1fr_220px]">
            <label className="relative block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search serial, patient, doctor, phone..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
              />
            </label>

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value as AppointmentStatus | "All")
              }
              className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700 outline-none focus:border-teal-500"
            >
              <option value="All">All Status</option>
              {appointmentStatusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
            <div className="hidden grid-cols-[1fr_1.15fr_0.9fr_0.8fr_1fr] gap-3 bg-slate-50 px-4 py-3 text-xs font-black uppercase tracking-[0.12em] text-slate-500 lg:grid">
              <span>Serial</span>
              <span>Doctor</span>
              <span>Schedule</span>
              <span>Status</span>
              <span className="text-right">Action</span>
            </div>

            <div className="divide-y divide-slate-100">
              {filteredAppointments.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="font-bold text-slate-700">
                    কোনো appointment পাওয়া যায়নি
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Search/filter change করুন অথবা নতুন appointment add করুন।
                  </p>
                </div>
              ) : (
                filteredAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="grid gap-3 p-4 transition hover:bg-slate-50 lg:grid-cols-[1fr_1.15fr_0.9fr_0.8fr_1fr] lg:items-center"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-black text-teal-700">
                        {appointment.serialNo}
                      </p>
                      <h3 className="truncate text-sm font-black text-slate-950">
                        {appointment.patientName}
                      </h3>
                      <p className="mt-1 truncate text-xs text-slate-500">
                        {appointment.phone} · {appointment.visitType}
                      </p>
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-black text-slate-950">
                        {appointment.doctorName}
                      </p>
                      <p className="mt-1 flex items-center gap-1 text-xs font-bold text-slate-500">
                        <Stethoscope className="h-3.5 w-3.5 text-teal-600" />
                        {appointment.department}
                      </p>
                    </div>

                    <div className="text-xs text-slate-600">
                      <p className="font-black text-slate-900">
                        {appointment.date || "No date"}
                      </p>
                      <p className="mt-1 flex items-center gap-1">
                        <Clock3 className="h-3.5 w-3.5 text-teal-600" />
                        {appointment.time}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <AppointmentStatusBadge status={appointment.status} />
                      <select
                        value={appointment.status}
                        onChange={(event) =>
                          updateAppointmentStatus(
                            appointment.id,
                            event.target.value as AppointmentStatus,
                          )
                        }
                        className="h-9 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-black text-slate-700 outline-none focus:border-teal-500"
                      >
                        {appointmentStatusOptions.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-2 lg:flex lg:justify-end">
                      <button
                        type="button"
                        onClick={() => openEditAppointmentModal(appointment)}
                        className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-xs font-black text-slate-700 transition hover:bg-white"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteAppointment(appointment.id)}
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
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-black text-slate-950">
                Today Timeline
              </h2>
              <p className="mt-1 text-xs font-medium text-slate-500">
                আজকের appointment flow.
              </p>
            </div>
            <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-black text-teal-700">
              {todayAppointments.length} Today
            </span>
          </div>

          <div className="mt-4 space-y-3">
            {(todayAppointments.length
              ? todayAppointments
              : appointments.slice(0, 3)
            ).map((appointment) => (
              <div
                key={appointment.id}
                className="flex gap-3 rounded-2xl border border-slate-200 p-3"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white">
                  <Clock3 className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-black text-slate-950">
                      {appointment.time}
                    </p>
                    <AppointmentStatusBadge status={appointment.status} />
                  </div>
                  <p className="mt-1 truncate text-sm font-bold text-slate-700">
                    {appointment.patientName}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {appointment.doctorName} · {appointment.department}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
          <div className="rounded-3xl bg-white p-5">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-teal-700">
              Appointment Preview
            </p>
            <h2 className="mt-2 text-2xl font-black text-slate-950">
              Serial Booking
            </h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              Patient appointment data website/frontend serial flow-এর মতো
              preview হয়। Confirm, complete অথবা cancel status এখান থেকেই
              control করা যাবে।
            </p>
          </div>
        </div>
      </section>

      {isAppointmentModalOpen ? (
        <div
          onClick={closeAppointmentModal}
          className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 p-3 sm:items-center"
        >
          <div
            onClick={(event) => event.stopPropagation()}
            className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl"
          >
            <div className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b border-slate-100 bg-white p-4">
              <div>
                <h2 className="text-xl font-black text-slate-950">
                  {editingAppointmentId
                    ? "Edit Appointment"
                    : "Add Appointment"}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Save করলে appointment list update হবে।
                </p>
              </div>

              <button
                type="button"
                onClick={closeAppointmentModal}
                className="rounded-full border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50 hover:text-slate-950"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={saveAppointment} className="space-y-4 p-4">
              <div className="grid gap-3 md:grid-cols-2">
                <TextInput
                  label="Patient Name"
                  value={appointmentForm.patientName}
                  placeholder="Patient name"
                  onChange={(value) =>
                    updateAppointmentForm("patientName", value)
                  }
                />
                <TextInput
                  label="Phone"
                  value={appointmentForm.phone}
                  placeholder="017..."
                  onChange={(value) => updateAppointmentForm("phone", value)}
                />
                <TextInput
                  label="Doctor Name"
                  value={appointmentForm.doctorName}
                  placeholder="Doctor name"
                  onChange={(value) =>
                    updateAppointmentForm("doctorName", value)
                  }
                />
                <TextInput
                  label="Department"
                  value={appointmentForm.department}
                  placeholder="Department"
                  onChange={(value) =>
                    updateAppointmentForm("department", value)
                  }
                />
                <TextInput
                  label="Date"
                  type="date"
                  value={appointmentForm.date}
                  onChange={(value) => updateAppointmentForm("date", value)}
                />
                <TextInput
                  label="Time Slot"
                  value={appointmentForm.time}
                  placeholder="৪টা - ৫টা"
                  onChange={(value) => updateAppointmentForm("time", value)}
                />
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <TextInput
                  label="Visit Type"
                  value={appointmentForm.visitType}
                  placeholder="Regular / Emergency / Follow-up"
                  onChange={(value) =>
                    updateAppointmentForm("visitType", value)
                  }
                />
                <label className="block rounded-xl border border-slate-200 bg-white px-3 py-2">
                  <span className="text-xs font-bold text-slate-500">
                    Status
                  </span>
                  <select
                    value={appointmentForm.status}
                    onChange={(event) =>
                      updateAppointmentForm(
                        "status",
                        event.target.value as AppointmentStatus,
                      )
                    }
                    className="mt-1 h-7 w-full bg-transparent text-sm font-black text-slate-800 outline-none"
                  >
                    {appointmentStatusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <TextAreaInput
                label="Appointment Note"
                value={appointmentForm.note}
                placeholder="Problem / note লিখুন"
                onChange={(value) => updateAppointmentForm("note", value)}
              />

              <div className="sticky bottom-0 -mx-4 -mb-4 grid grid-cols-2 gap-2 border-t border-slate-100 bg-white p-4">
                <button
                  type="button"
                  onClick={closeAppointmentModal}
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
                  {editingAppointmentId ? "Save Changes" : "Save Appointment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function WebsiteControlPanel() {
  const [hero, setHero] = useState(defaultWebsiteHero);
  const [heroCards, setHeroCards] = useState(initialHeroCards);
  const [progress, setProgress] = useState(defaultWebsiteProgress);
  const [metrics, setMetrics] = useState(initialWebsiteMetrics);
  const [contacts, setContacts] = useState(initialWebsiteContacts);
  const [locations, setLocations] = useState(initialWebsiteLocations);
  const [footerLinks, setFooterLinks] = useState(initialFooterLinks);
  const [posts, setPosts] = useState(initialWebsitePosts);
  const [galleryCategories, setGalleryCategories] = useState(
    initialGalleryCategories,
  );
  const [galleryImages, setGalleryImages] = useState(initialGalleryImages);

  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [toast, setToast] = useState("Ready to manage website control");

  const [heroDraft, setHeroDraft] = useState(defaultWebsiteHero);
  const [cardDraft, setCardDraft] = useState<WebsiteHeroCard>(
    initialHeroCards[0],
  );
  const [progressDraft, setProgressDraft] = useState(defaultWebsiteProgress);
  const [metricDraft, setMetricDraft] = useState<WebsiteMetric>(
    initialWebsiteMetrics[0],
  );
  const [contactDraft, setContactDraft] = useState<WebsiteContact>(
    initialWebsiteContacts[0],
  );
  const [locationDraft, setLocationDraft] = useState<WebsiteLocation>(
    initialWebsiteLocations[0],
  );
  const [footerDraft, setFooterDraft] = useState<WebsiteFooterLink>(
    initialFooterLinks[0],
  );
  const [postDraft, setPostDraft] = useState<WebsitePost>(
    initialWebsitePosts[0],
  );
  const [categoryDraft, setCategoryDraft] = useState<GalleryCategory>(
    initialGalleryCategories[0],
  );
  const [imageDraft, setImageDraft] = useState<GalleryImage>(
    initialGalleryImages[0],
  );

  function showToast(message: string) {
    setToast(message);
  }

  function closeModal(message = "Action cancelled") {
    setActiveModal(null);
    setEditingId(null);
    showToast(message);
  }

  function readImageFile(
    event: ChangeEvent<HTMLInputElement>,
    onLoaded: (url: string) => void,
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        onLoaded(reader.result);
        showToast("Device image loaded");
      }
    };
    reader.readAsDataURL(file);
  }

  function openHeroModal() {
    setHeroDraft(hero);
    setActiveModal("hero");
  }

  function openCardModal(card: WebsiteHeroCard) {
    setCardDraft(card);
    setEditingId(card.id);
    setActiveModal("heroCard");
  }

  function openProgressModal() {
    setProgressDraft(progress);
    setActiveModal("progress");
  }

  function openMetricModal(metric: WebsiteMetric) {
    setMetricDraft(metric);
    setEditingId(metric.id);
    setActiveModal("metric");
  }

  function openContactModal(contact?: WebsiteContact) {
    const draft =
      contact || { id: `contact-${Date.now()}`, label: "", value: "", link: "" };
    setContactDraft(draft);
    setEditingId(contact?.id || null);
    setActiveModal("contact");
  }

  function openLocationModal(location?: WebsiteLocation) {
    const draft =
      location || {
        id: `location-${Date.now()}`,
        name: "",
        address: "",
        mapLink: "",
        callLink: "",
      };
    setLocationDraft(draft);
    setEditingId(location?.id || null);
    setActiveModal("location");
  }

  function openFooterModal(link?: WebsiteFooterLink) {
    const draft = link || { id: `footer-${Date.now()}`, label: "", href: "" };
    setFooterDraft(draft);
    setEditingId(link?.id || null);
    setActiveModal("footer");
  }

  function openPostModal(post?: WebsitePost) {
    const draft =
      post || {
        id: `post-${Date.now()}`,
        type: "Blog" as const,
        title: "",
        summary: "",
        link: "",
      };
    setPostDraft(draft);
    setEditingId(post?.id || null);
    setActiveModal("post");
  }

  function openCategoryModal(category?: GalleryCategory) {
    const draft =
      category || { id: `gallery-${Date.now()}`, name: "", subtitle: "" };
    setCategoryDraft(draft);
    setEditingId(category?.id || null);
    setActiveModal("galleryCategory");
  }

  function openImageModal(image?: GalleryImage) {
    const draft =
      image || {
        id: `image-${Date.now()}`,
        categoryId: galleryCategories[0]?.id || "",
        title: "",
        imageUrl: "",
        link: "",
      };
    setImageDraft(draft);
    setEditingId(image?.id || null);
    setActiveModal("galleryImage");
  }

  function saveWebsiteModal(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (activeModal === "hero") {
      setHero(heroDraft);
      closeModal("Hero section uploaded successfully");
      return;
    }

    if (activeModal === "heroCard") {
      setHeroCards((previous) =>
        previous.map((card) => (card.id === editingId ? cardDraft : card)),
      );
      closeModal("Hero card updated successfully");
      return;
    }

    if (activeModal === "progress") {
      setProgress(progressDraft);
      closeModal("Progress title uploaded successfully");
      return;
    }

    if (activeModal === "metric") {
      setMetrics((previous) =>
        previous.map((metric) =>
          metric.id === editingId ? metricDraft : metric,
        ),
      );
      closeModal("Progress stat updated successfully");
      return;
    }

    if (activeModal === "contact") {
      setContacts((previous) =>
        editingId
          ? previous.map((contact) =>
              contact.id === editingId ? contactDraft : contact,
            )
          : [...previous, contactDraft],
      );
      closeModal("Contact method saved successfully");
      return;
    }

    if (activeModal === "location") {
      setLocations((previous) =>
        editingId
          ? previous.map((location) =>
              location.id === editingId ? locationDraft : location,
            )
          : [...previous, locationDraft],
      );
      closeModal("Location saved successfully");
      return;
    }

    if (activeModal === "footer") {
      setFooterLinks((previous) =>
        editingId
          ? previous.map((link) => (link.id === editingId ? footerDraft : link))
          : [...previous, footerDraft],
      );
      closeModal("Footer link saved successfully");
      return;
    }

    if (activeModal === "post") {
      setPosts((previous) =>
        editingId
          ? previous.map((post) => (post.id === editingId ? postDraft : post))
          : [postDraft, ...previous],
      );
      closeModal("Blog / article saved successfully");
      return;
    }

    if (activeModal === "galleryCategory") {
      setGalleryCategories((previous) =>
        editingId
          ? previous.map((category) =>
              category.id === editingId ? categoryDraft : category,
            )
          : [...previous, categoryDraft],
      );
      closeModal("Gallery category saved successfully");
      return;
    }

    if (activeModal === "galleryImage") {
      setGalleryImages((previous) =>
        editingId
          ? previous.map((image) => (image.id === editingId ? imageDraft : image))
          : [imageDraft, ...previous],
      );
      closeModal("Gallery picture saved successfully");
    }
  }

  function deleteWebsiteItem(kind: string, id: string) {
    if (kind === "contact") setContacts((items) => items.filter((item) => item.id !== id));
    if (kind === "location") setLocations((items) => items.filter((item) => item.id !== id));
    if (kind === "footer") setFooterLinks((items) => items.filter((item) => item.id !== id));
    if (kind === "post") setPosts((items) => items.filter((item) => item.id !== id));
    if (kind === "category") {
      setGalleryCategories((items) => items.filter((item) => item.id !== id));
      setGalleryImages((items) => items.filter((item) => item.categoryId !== id));
    }
    if (kind === "image") setGalleryImages((items) => items.filter((item) => item.id !== id));
    showToast("Item removed successfully");
  }

  return (
    <div className="space-y-4">
      {/* Top action bar */}
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
            onClick={openHeroModal}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-black text-white transition hover:bg-teal-700"
          >
            <Pencil className="h-4 w-4" />
            Edit Hero
          </button>
          <button
            type="button"
            onClick={() => openImageModal()}
            className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-black text-white transition hover:bg-teal-700"
          >
            <ImagePlus className="h-4 w-4" />
            Add Gallery
          </button>
        </div>
      </div>

      <div className="fixed right-4 top-4 z-40 hidden max-w-sm items-center gap-2 rounded-2xl border border-teal-100 bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-lg shadow-slate-200/60 sm:flex">
        <CheckCircle2 className="h-4 w-4 shrink-0 text-teal-600" />
        <span>{toast}</span>
      </div>

      {/* Hero section control */}
      <section className="rounded-3xl border border-teal-100 bg-teal-50/70 p-4 shadow-sm sm:p-6">
        <div className="mx-auto max-w-5xl text-center">
          <span className="inline-flex rounded-full border border-teal-200 bg-white px-4 py-1 text-[10px] font-black uppercase tracking-[0.28em] text-teal-700 shadow-sm">
            {hero.badge}
          </span>
          <h1 className="mx-auto mt-4 max-w-4xl text-3xl font-black leading-tight text-slate-950 md:text-5xl">
            {hero.title}
            <span className="block text-teal-600">{hero.highlight}</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600">
            {hero.description}
          </p>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {heroCards.map((card) => (
            <div
              key={card.id}
              className="overflow-hidden rounded-3xl border border-teal-100 bg-white p-4 shadow-sm"
            >
              <div
                className="h-44 rounded-2xl bg-slate-100 bg-cover bg-center"
                style={{ backgroundImage: `url(${card.imageUrl})` }}
              />
              <span className="mt-4 inline-flex rounded-full border border-teal-200 px-3 py-1 text-[10px] font-black text-teal-700">
                {card.badge}
              </span>
              <h3 className="mt-3 text-lg font-black leading-7 text-slate-950">
                {card.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {card.description}
              </p>
              <button
                type="button"
                onClick={() => openCardModal(card)}
                className="mt-4 inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-black text-slate-700 transition hover:bg-slate-50"
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit Card
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Clinic progress control */}
      <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1 text-xs font-black text-teal-700">
              <BarChart3 className="h-3.5 w-3.5" />
              {progress.badge}
            </div>
            <h2 className="mt-3 text-2xl font-black text-slate-950">
              {progress.title}
            </h2>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600">
              {progress.description}
            </p>
            <p className="mt-2 text-xs font-bold text-slate-500">
              Duration: {getDurationLabel(progress.showDuration)}
            </p>
          </div>
          <button
            type="button"
            onClick={openProgressModal}
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-black text-slate-700 transition hover:bg-slate-50"
          >
            <Pencil className="h-3.5 w-3.5" />
            Edit Heading
          </button>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {metrics.map((metric) => (
            <div key={metric.id} className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm font-black text-slate-950">{metric.label}</p>
              <div className="mt-3 flex items-end justify-between gap-3">
                <p className="text-3xl font-black text-slate-950">
                  {metric.value}
                </p>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-black ${
                    metric.direction === "up"
                      ? "bg-teal-50 text-teal-700"
                      : "bg-red-50 text-red-600"
                  }`}
                >
                  {metric.direction === "up" ? "↑" : "↓"} {metric.trend}
                </span>
              </div>
              <button
                type="button"
                onClick={() => openMetricModal(metric)}
                className="mt-4 inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-black text-slate-700 transition hover:bg-slate-50"
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit Stat
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Contact, location, footer links */}
      <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-black text-slate-950">
                Contact & Social Methods
              </h2>
              <p className="mt-1 text-xs font-medium text-slate-500">
                Link, phone, email, map সব edit করা যাবে।
              </p>
            </div>
            <button
              type="button"
              onClick={() => openContactModal()}
              className="inline-flex items-center gap-1.5 rounded-xl bg-slate-950 px-3 py-2 text-xs font-black text-white transition hover:bg-teal-700"
            >
              <Plus className="h-3.5 w-3.5" />
              Add
            </button>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {contacts.map((contact) => (
              <div key={contact.id} className="rounded-2xl border border-slate-200 p-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                  {contact.label.toLowerCase().includes("mail") ? (
                    <Mail className="h-5 w-5" />
                  ) : contact.label.toLowerCase().includes("call") ? (
                    <Phone className="h-5 w-5" />
                  ) : contact.label.toLowerCase().includes("map") ? (
                    <MapPin className="h-5 w-5" />
                  ) : contact.label.toLowerCase().includes("whatsapp") ? (
                    <MessageCircle className="h-5 w-5" />
                  ) : (
                    <Globe className="h-5 w-5" />
                  )}
                </div>
                <p className="mt-3 text-sm font-black text-slate-950">
                  {contact.label}
                </p>
                <p className="mt-1 truncate text-xs text-slate-500">
                  {contact.value}
                </p>
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => openContactModal(contact)}
                    className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-black text-slate-700 transition hover:bg-slate-50"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteWebsiteItem("contact", contact.id)}
                    className="rounded-xl border border-red-100 px-3 py-2 text-xs font-black text-red-600 transition hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-base font-black text-slate-950">
                Branch & Map Location
              </h2>
              <button
                type="button"
                onClick={() => openLocationModal()}
                className="inline-flex items-center gap-1.5 rounded-xl bg-slate-950 px-3 py-2 text-xs font-black text-white transition hover:bg-teal-700"
              >
                <Plus className="h-3.5 w-3.5" />
                Add
              </button>
            </div>
            <div className="mt-4 space-y-3">
              {locations.map((location) => (
                <div key={location.id} className="rounded-2xl border border-slate-200 p-3">
                  <p className="font-black text-slate-950">{location.name}</p>
                  <p className="mt-1 text-sm text-slate-500">{location.address}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => openLocationModal(location)}
                      className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-black text-slate-700 transition hover:bg-slate-50"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteWebsiteItem("location", location.id)}
                      className="rounded-xl border border-red-100 px-3 py-2 text-xs font-black text-red-600 transition hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-base font-black text-slate-950">
                প্রয়োজনীয় পেজ
              </h2>
              <button
                type="button"
                onClick={() => openFooterModal()}
                className="inline-flex items-center gap-1.5 rounded-xl bg-slate-950 px-3 py-2 text-xs font-black text-white transition hover:bg-teal-700"
              >
                <Plus className="h-3.5 w-3.5" />
                Add
              </button>
            </div>
            <div className="mt-4 space-y-2">
              {footerLinks.map((link) => (
                <div
                  key={link.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 px-3 py-2"
                >
                  <span className="min-w-0 truncate text-sm font-bold text-slate-700">
                    {link.label}
                  </span>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => openFooterModal(link)}>
                      <Pencil className="h-4 w-4 text-slate-500" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteWebsiteItem("footer", link.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Blog, article and health tips */}
      <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-black text-slate-950">
              Blogs, Articles & Health Tips
            </h2>
            <p className="mt-1 text-xs font-medium text-slate-500">
              Later আরও content type add করা সহজ করার জন্য আলাদা cards.
            </p>
          </div>
          <button
            type="button"
            onClick={() => openPostModal()}
            className="inline-flex w-fit items-center gap-1.5 rounded-xl bg-slate-950 px-3 py-2 text-xs font-black text-white transition hover:bg-teal-700"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Post
          </button>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {posts.map((post) => (
            <div key={post.id} className="rounded-2xl border border-slate-200 p-4">
              <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-black text-teal-700">
                {post.type}
              </span>
              <h3 className="mt-3 text-base font-black text-slate-950">
                {post.title}
              </h3>
              <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-500">
                {post.summary}
              </p>
              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => openPostModal(post)}
                  className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-black text-slate-700 transition hover:bg-slate-50"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => deleteWebsiteItem("post", post.id)}
                  className="rounded-xl border border-red-100 px-3 py-2 text-xs font-black text-red-600 transition hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Gallery category and picture management */}
      <section className="rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
        <div className="rounded-3xl bg-white p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-teal-700">
                Gallery Control
              </p>
              <h2 className="mt-2 text-2xl font-black text-slate-950">
                আমাদের সেবার মুহূর্ত
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Category add/remove, picture upload/link, device upload সব এক জায়গায়।
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => openCategoryModal()}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-xs font-black text-slate-700 transition hover:bg-slate-50"
              >
                <Plus className="h-3.5 w-3.5" />
                Category
              </button>
              <button
                type="button"
                onClick={() => openImageModal()}
                className="inline-flex items-center gap-1.5 rounded-xl bg-teal-600 px-3 py-2 text-xs font-black text-white transition hover:bg-teal-700"
              >
                <ImagePlus className="h-3.5 w-3.5" />
                Picture
              </button>
            </div>
          </div>

          <div className="mt-5 space-y-6">
            {galleryCategories.map((category) => (
              <div key={category.id}>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-black text-slate-950">{category.name}</h3>
                    <p className="text-xs text-slate-500">{category.subtitle}</p>
                  </div>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => openCategoryModal(category)}>
                      <Pencil className="h-4 w-4 text-slate-500" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteWebsiteItem("category", category.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </button>
                  </div>
                </div>

                <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {galleryImages
                    .filter((image) => image.categoryId === category.id)
                    .map((image) => (
                      <div
                        key={image.id}
                        className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                      >
                        <div
                          className="h-36 bg-slate-100 bg-cover bg-center"
                          style={{ backgroundImage: `url(${image.imageUrl})` }}
                        />
                        <div className="p-3">
                          <p className="truncate text-sm font-black text-slate-950">
                            {image.title}
                          </p>
                          <div className="mt-3 flex gap-2">
                            <button
                              type="button"
                              onClick={() => openImageModal(image)}
                              className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-black text-slate-700 transition hover:bg-slate-50"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteWebsiteItem("image", image.id)}
                              className="rounded-xl border border-red-100 px-3 py-2 text-xs font-black text-red-600 transition hover:bg-red-50"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {activeModal ? (
        <div
          onClick={() => closeModal()}
          className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 p-3 sm:items-center"
        >
          <div
            onClick={(event) => event.stopPropagation()}
            className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl"
          >
            <div className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b border-slate-100 bg-white p-4">
              <div>
                <h2 className="text-xl font-black text-slate-950">
                  Website Control
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Save করলে popup close হয়ে notification দেখাবে।
                </p>
              </div>
              <button
                type="button"
                onClick={() => closeModal()}
                className="rounded-full border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50 hover:text-slate-950"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={saveWebsiteModal} className="space-y-4 p-4">
              {activeModal === "hero" ? (
                <>
                  <TextInput label="Badge" value={heroDraft.badge} onChange={(value) => setHeroDraft((prev) => ({ ...prev, badge: value }))} />
                  <TextInput label="Hero Title" value={heroDraft.title} onChange={(value) => setHeroDraft((prev) => ({ ...prev, title: value }))} />
                  <TextInput label="Highlight Title" value={heroDraft.highlight} onChange={(value) => setHeroDraft((prev) => ({ ...prev, highlight: value }))} />
                  <TextAreaInput label="Description" value={heroDraft.description} onChange={(value) => setHeroDraft((prev) => ({ ...prev, description: value }))} />
                </>
              ) : null}

              {activeModal === "heroCard" ? (
                <>
                  <TextInput label="Card Badge" value={cardDraft.badge} onChange={(value) => setCardDraft((prev) => ({ ...prev, badge: value }))} />
                  <TextInput label="Card Title" value={cardDraft.title} onChange={(value) => setCardDraft((prev) => ({ ...prev, title: value }))} />
                  <TextAreaInput label="Card Text" value={cardDraft.description} onChange={(value) => setCardDraft((prev) => ({ ...prev, description: value }))} />
                  <TextInput label="Picture Link" value={cardDraft.imageUrl} onChange={(value) => setCardDraft((prev) => ({ ...prev, imageUrl: value }))} />
                  <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-50">
                    <ImagePlus className="h-4 w-4" />
                    Upload From Device
                    <input type="file" accept="image/*" className="hidden" onChange={(event) => readImageFile(event, (url) => setCardDraft((prev) => ({ ...prev, imageUrl: url })))} />
                  </label>
                </>
              ) : null}

              {activeModal === "progress" ? (
                <>
                  <TextInput label="Small Title" value={progressDraft.badge} onChange={(value) => setProgressDraft((prev) => ({ ...prev, badge: value }))} />
                  <TextInput label="Main Title" value={progressDraft.title} onChange={(value) => setProgressDraft((prev) => ({ ...prev, title: value }))} />
                  <TextAreaInput label="Description" value={progressDraft.description} onChange={(value) => setProgressDraft((prev) => ({ ...prev, description: value }))} />
                  <label className="block">
                    <span className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">Time Limit</span>
                    <select value={progressDraft.showDuration} onChange={(event) => setProgressDraft((prev) => ({ ...prev, showDuration: event.target.value as ShowDuration }))} className="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold outline-none focus:border-teal-500">
                      {showDurationOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                    </select>
                  </label>
                </>
              ) : null}

              {activeModal === "metric" ? (
                <>
                  <TextInput label="Metric Label" value={metricDraft.label} onChange={(value) => setMetricDraft((prev) => ({ ...prev, label: value }))} />
                  <TextInput label="Value" value={metricDraft.value} onChange={(value) => setMetricDraft((prev) => ({ ...prev, value }))} />
                  <TextInput label="Trend" value={metricDraft.trend} onChange={(value) => setMetricDraft((prev) => ({ ...prev, trend: value }))} />
                  <label className="block">
                    <span className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">Direction</span>
                    <select value={metricDraft.direction} onChange={(event) => setMetricDraft((prev) => ({ ...prev, direction: event.target.value as "up" | "down" }))} className="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold outline-none focus:border-teal-500">
                      <option value="up">Up</option>
                      <option value="down">Down</option>
                    </select>
                  </label>
                </>
              ) : null}

              {activeModal === "contact" ? (
                <>
                  <TextInput label="Contact Name" value={contactDraft.label} placeholder="Facebook / WhatsApp / Call" onChange={(value) => setContactDraft((prev) => ({ ...prev, label: value }))} />
                  <TextInput label="Display Text" value={contactDraft.value} onChange={(value) => setContactDraft((prev) => ({ ...prev, value }))} />
                  <TextInput label="Link" value={contactDraft.link} placeholder="https:// / tel: / mailto:" onChange={(value) => setContactDraft((prev) => ({ ...prev, link: value }))} />
                </>
              ) : null}

              {activeModal === "location" ? (
                <>
                  <TextInput label="Branch Name" value={locationDraft.name} onChange={(value) => setLocationDraft((prev) => ({ ...prev, name: value }))} />
                  <TextAreaInput label="Address" value={locationDraft.address} onChange={(value) => setLocationDraft((prev) => ({ ...prev, address: value }))} />
                  <TextInput label="Map Link" value={locationDraft.mapLink} onChange={(value) => setLocationDraft((prev) => ({ ...prev, mapLink: value }))} />
                  <TextInput label="Call Link" value={locationDraft.callLink} onChange={(value) => setLocationDraft((prev) => ({ ...prev, callLink: value }))} />
                </>
              ) : null}

              {activeModal === "footer" ? (
                <>
                  <TextInput label="Page Title" value={footerDraft.label} onChange={(value) => setFooterDraft((prev) => ({ ...prev, label: value }))} />
                  <TextInput label="Page Link" value={footerDraft.href} onChange={(value) => setFooterDraft((prev) => ({ ...prev, href: value }))} />
                </>
              ) : null}

              {activeModal === "post" ? (
                <>
                  <label className="block">
                    <span className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">Content Type</span>
                    <select value={postDraft.type} onChange={(event) => setPostDraft((prev) => ({ ...prev, type: event.target.value as WebsitePost["type"] }))} className="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold outline-none focus:border-teal-500">
                      <option value="Blog">Blog</option>
                      <option value="Article">Article</option>
                      <option value="Health Tip">Health Tip</option>
                    </select>
                  </label>
                  <TextInput label="Title" value={postDraft.title} onChange={(value) => setPostDraft((prev) => ({ ...prev, title: value }))} />
                  <TextAreaInput label="Summary" value={postDraft.summary} onChange={(value) => setPostDraft((prev) => ({ ...prev, summary: value }))} />
                  <TextInput label="Link" value={postDraft.link} onChange={(value) => setPostDraft((prev) => ({ ...prev, link: value }))} />
                </>
              ) : null}

              {activeModal === "galleryCategory" ? (
                <>
                  <TextInput label="Category Name" value={categoryDraft.name} onChange={(value) => setCategoryDraft((prev) => ({ ...prev, name: value }))} />
                  <TextInput label="Subtitle" value={categoryDraft.subtitle} onChange={(value) => setCategoryDraft((prev) => ({ ...prev, subtitle: value }))} />
                </>
              ) : null}

              {activeModal === "galleryImage" ? (
                <>
                  <TextInput label="Picture Title" value={imageDraft.title} onChange={(value) => setImageDraft((prev) => ({ ...prev, title: value }))} />
                  <label className="block">
                    <span className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">Category</span>
                    <select value={imageDraft.categoryId} onChange={(event) => setImageDraft((prev) => ({ ...prev, categoryId: event.target.value }))} className="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold outline-none focus:border-teal-500">
                      {galleryCategories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
                    </select>
                  </label>
                  <TextInput label="Picture Link" value={imageDraft.imageUrl} onChange={(value) => setImageDraft((prev) => ({ ...prev, imageUrl: value }))} />
                  <TextInput label="Click Link" value={imageDraft.link} onChange={(value) => setImageDraft((prev) => ({ ...prev, link: value }))} />
                  <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-50">
                    <ImagePlus className="h-4 w-4" />
                    Upload From Device
                    <input type="file" accept="image/*" className="hidden" onChange={(event) => readImageFile(event, (url) => setImageDraft((prev) => ({ ...prev, imageUrl: url })))} />
                  </label>
                </>
              ) : null}

              <div className="grid grid-cols-2 gap-2 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => closeModal()}
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
                  Save & Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}

/* =========================================================
   4. MAIN SERVICE ADMIN PAGE
   ========================================================= */

function ServiceAdminPanel() {
  const [sectionSettings, setSectionSettings] = useState(
    defaultSectionSettings,
  );
  const [sectionDraft, setSectionDraft] = useState(defaultSectionSettings);

  const [categories, setCategories] = useState(initialCategories);
  const [services, setServices] = useState(initialServices);

  const [activeCategory, setActiveCategory] = useState("all");
  const [categoryName, setCategoryName] = useState("");
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  const [serviceForm, setServiceForm] = useState<ServiceForm>(emptyServiceForm);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ServiceStatus | "All">(
    "All",
  );
  const [toast, setToast] = useState("Ready to manage service section");

  const visibleServices = services.filter(
    (service) => service.isVisible && service.status === "Active",
  );

  const hiddenServices = services.filter((service) => !service.isVisible);

  const filteredServices = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return services.filter((service) => {
      const searchMatched =
        keyword.length === 0 ||
        service.name.toLowerCase().includes(keyword) ||
        service.categoryName.toLowerCase().includes(keyword) ||
        service.description.toLowerCase().includes(keyword);

      const categoryMatched =
        activeCategory === "all" || service.categoryId === activeCategory;

      const statusMatched =
        statusFilter === "All" || service.status === statusFilter;

      return searchMatched && categoryMatched && statusMatched;
    });
  }, [activeCategory, search, services, statusFilter]);

  const previewServices = filteredServices.filter(
    (service) => service.isVisible && service.status === "Active",
  );

  function showToast(message: string) {
    setToast(message);
  }

  function getCategoryName(categoryId: string) {
    return (
      categories.find((category) => category.id === categoryId)?.name ||
      "Uncategorized"
    );
  }

  function updateServiceForm<K extends keyof ServiceForm>(
    key: K,
    value: ServiceForm[K],
  ) {
    setServiceForm((previous) => {
      const next = {
        ...previous,
        [key]: value,
      };

      return next;
    });
  }

  function uploadSectionSettings() {
    setSectionSettings(sectionDraft);
    showToast("Service section uploaded successfully");
  }

  function resetSectionSettings() {
    setSectionSettings(defaultSectionSettings);
    setSectionDraft(defaultSectionSettings);
    showToast("Service section reset successfully");
  }

  function openCategoryModal() {
    setCategoryName("");
    setIsCategoryModalOpen(true);
    showToast("Category form opened");
  }

  function closeCategoryModal() {
    setCategoryName("");
    setIsCategoryModalOpen(false);
    showToast("Category action cancelled");
  }

  function addCategory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const name = categoryName.trim();

    if (!name) {
      showToast("Category name required");
      return;
    }

    const exists = categories.some(
      (category) => category.name.toLowerCase() === name.toLowerCase(),
    );

    if (exists) {
      showToast("This category already exists");
      return;
    }

    const newCategory: ServiceCategory = {
      id: `cat-${Date.now()}`,
      name,
      isVisible: true,
    };

    setCategories((previous) => [...previous, newCategory]);
    setCategoryName("");
    setIsCategoryModalOpen(false);
    setActiveCategory(newCategory.id);
    setServiceForm((previous) => ({
      ...previous,
      categoryId: newCategory.id,
    }));
    showToast(`${name} category added`);
  }

  function toggleCategoryVisibility(id: string) {
    setCategories((previous) =>
      previous.map((category) =>
        category.id === id
          ? {
              ...category,
              isVisible: !category.isVisible,
            }
          : category,
      ),
    );

    showToast("Category visibility updated");
  }

  function deleteCategory(id: string) {
    const category = categories.find((item) => item.id === id);

    const used = services.some((service) => service.categoryId === id);

    if (used) {
      showToast("এই category use হচ্ছে। আগে services অন্য category করুন।");
      return;
    }

    const confirmDelete = window.confirm(
      `${category?.name || "এই category"} delete করবেন?`,
    );

    if (!confirmDelete) {
      showToast("Category delete cancelled");
      return;
    }

    setCategories((previous) =>
      previous.filter((category) => category.id !== id),
    );

    if (activeCategory === id) {
      setActiveCategory("all");
    }

    showToast("Category deleted successfully");
  }

  function openAddServiceModal() {
    setEditingServiceId(null);
    setServiceForm(emptyServiceForm);
    setIsServiceModalOpen(true);
    showToast("Add service form opened");
  }

  function openEditServiceModal(service: ServiceItem) {
    setEditingServiceId(service.id);
    setServiceForm({
      name: service.name,
      categoryId: service.categoryId,
      description: service.description,
      regularFee: service.regularFee,
      testFee: service.testFee,
      discountType: service.discountType,
      discountValue: service.discountValue,
      reportTime: service.reportTime,
      duration: service.duration,
      preparation: service.preparation,
      sampleRequired: service.sampleRequired,
      availableDays: service.availableDays,
      availableTime: service.availableTime,
      isVisible: service.isVisible,
      isFeatured: service.isFeatured,
      isHomeService: service.isHomeService,
      isEmergency: service.isEmergency,
      isOnlineBooking: service.isOnlineBooking,
      status: service.status,
      showDuration: service.showDuration,
    });
    setIsServiceModalOpen(true);
    showToast(`${service.name} edit mode opened`);
  }

  function closeServiceModal() {
    setEditingServiceId(null);
    setServiceForm(emptyServiceForm);
    setIsServiceModalOpen(false);
    showToast("Action cancelled");
  }

  function saveService(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!serviceForm.name.trim()) {
      showToast("Service name required");
      return;
    }

    if (!serviceForm.categoryId) {
      showToast("Service category required");
      return;
    }

    const finalFee = calculateFinalFee(
      serviceForm.regularFee,
      serviceForm.discountType,
      serviceForm.discountValue,
    );

    const categoryName = getCategoryName(serviceForm.categoryId);

    if (editingServiceId) {
      setServices((previous) =>
        previous.map((service) =>
          service.id === editingServiceId
            ? {
                id: editingServiceId,
                ...serviceForm,
                name: serviceForm.name.trim(),
                categoryName,
                finalFee,
              }
            : service,
        ),
      );

      setEditingServiceId(null);
      setServiceForm(emptyServiceForm);
      setIsServiceModalOpen(false);
      showToast("Service updated successfully");
      return;
    }

    const newService: ServiceItem = {
      id: `srv-${Date.now()}`,
      ...serviceForm,
      name: serviceForm.name.trim(),
      categoryName,
      finalFee,
    };

    setServices((previous) => [newService, ...previous]);
    setServiceForm(emptyServiceForm);
    setIsServiceModalOpen(false);
    showToast("New service added successfully");
  }

  function deleteService(id: string) {
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

  function toggleServiceVisibility(id: string) {
    setServices((previous) =>
      previous.map((service) =>
        service.id === id
          ? {
              ...service,
              isVisible: !service.isVisible,
            }
          : service,
      ),
    );

    showToast("Service visibility updated");
  }

  function updateServiceStatus(id: string, status: ServiceStatus) {
    setServices((previous) =>
      previous.map((service) =>
        service.id === id
          ? {
              ...service,
              status,
            }
          : service,
      ),
    );

    showToast(`Service status changed to ${status}`);
  }

  function updateServiceDuration(id: string, value: ShowDuration) {
    setServices((previous) =>
      previous.map((service) =>
        service.id === id
          ? {
              ...service,
              showDuration: value,
            }
          : service,
      ),
    );

    showToast("Show duration updated");
  }

  const modalFinalFee = calculateFinalFee(
    serviceForm.regularFee,
    serviceForm.discountType,
    serviceForm.discountValue,
  );

  return (
    <div className="space-y-4">
      {/* =====================================================
          TOP BAR
         ===================================================== */}

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
          onClick={openAddServiceModal}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-black text-white shadow-sm transition hover:bg-teal-700"
        >
          <Plus className="h-4 w-4" />
          Add Service
        </button>
      </div>

      {/* =====================================================
          NOTIFICATION
         ===================================================== */}

      <div className="fixed right-4 top-4 z-40 hidden max-w-sm items-center gap-2 rounded-2xl border border-teal-100 bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-lg shadow-slate-200/60 sm:flex">
        <CheckCircle2 className="h-4 w-4 shrink-0 text-teal-600" />
        <span>{toast}</span>
      </div>

      {/* =====================================================
          HEADER + STATS
         ===================================================== */}

      <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1 text-xs font-black text-teal-700">
              <HeartPulse className="h-3.5 w-3.5" />
              Service Section Control
            </div>

            <h1 className="mt-3 text-2xl font-black text-slate-950">
              Services Admin
            </h1>

            <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600">
              Service add/edit/delete, fee, discount, test fee, report time,
              category, website show/hide এবং booking control করুন।
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-2xl bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 sm:hidden">
            <CheckCircle2 className="h-4 w-4 text-teal-600" />
            {toast}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 xl:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 p-3">
            <p className="text-xs font-bold text-slate-500">Total Services</p>
            <p className="text-2xl font-black text-slate-950">
              {services.length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 p-3">
            <p className="text-xs font-bold text-slate-500">Website Show</p>
            <p className="text-2xl font-black text-slate-950">
              {visibleServices.length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 p-3">
            <p className="text-xs font-bold text-slate-500">Hidden</p>
            <p className="text-2xl font-black text-slate-950">
              {hiddenServices.length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 p-3">
            <p className="text-xs font-bold text-slate-500">Categories</p>
            <p className="text-2xl font-black text-slate-950">
              {categories.length}
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-[390px_1fr]">
        {/* =====================================================
            LEFT SIDE: SECTION + CATEGORY CONTROL
           ===================================================== */}

        <div className="space-y-4">
          <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-base font-black text-slate-950">
              Website Service Heading
            </h2>
            <p className="mt-1 text-xs font-medium text-slate-500">
              Public website service section-এর title ও content control.
            </p>

            <div className="mt-4 space-y-3">
              <TextInput
                label="Small Badge"
                value={sectionDraft.badge}
                onChange={(value) =>
                  setSectionDraft((previous) => ({
                    ...previous,
                    badge: value,
                  }))
                }
              />

              <TextInput
                label="Main Title"
                value={sectionDraft.title}
                onChange={(value) =>
                  setSectionDraft((previous) => ({
                    ...previous,
                    title: value,
                  }))
                }
              />

              <TextAreaInput
                label="Long Description"
                value={sectionDraft.description}
                onChange={(value) =>
                  setSectionDraft((previous) => ({
                    ...previous,
                    description: value,
                  }))
                }
              />

              <TextAreaInput
                label="Short Website Description"
                value={sectionDraft.shortDescription}
                onChange={(value) =>
                  setSectionDraft((previous) => ({
                    ...previous,
                    shortDescription: value,
                  }))
                }
              />

              <ToggleSwitch
                checked={sectionDraft.isVisible}
                onChange={() =>
                  setSectionDraft((previous) => ({
                    ...previous,
                    isVisible: !previous.isVisible,
                  }))
                }
                label="Service Section"
                activeText="Show"
                inactiveText="Hide"
              />

              <label className="block">
                <span className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">
                  Show Duration
                </span>
                <select
                  value={sectionDraft.showDuration}
                  onChange={(event) =>
                    setSectionDraft((previous) => ({
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
                onClick={uploadSectionSettings}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-black text-white transition hover:bg-teal-700"
              >
                <UploadCloud className="h-4 w-4" />
                Upload
              </button>

              <button
                type="button"
                onClick={resetSectionSettings}
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
                  Service category add, filter, hide/delete.
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
              <button
                type="button"
                onClick={() => setActiveCategory("all")}
                className={`rounded-full border px-3 py-1.5 text-xs font-black ${
                  activeCategory === "all"
                    ? "border-teal-600 bg-teal-600 text-white"
                    : "border-slate-200 bg-slate-50 text-slate-700"
                }`}
              >
                সব
              </button>

              {categories.map((category) => (
                <div
                  key={category.id}
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-black ${
                    activeCategory === category.id
                      ? "border-teal-600 bg-teal-600 text-white"
                      : "border-slate-200 bg-slate-50 text-slate-700"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setActiveCategory(category.id)}
                  >
                    {category.name}
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleCategoryVisibility(category.id)}
                    className={
                      category.isVisible ? "text-teal-600" : "text-slate-400"
                    }
                    title="Show / Hide"
                  >
                    {category.isVisible ? (
                      <Eye className="h-3.5 w-3.5" />
                    ) : (
                      <EyeOff className="h-3.5 w-3.5" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => deleteCategory(category.id)}
                    className="text-slate-400 hover:text-red-600"
                    title="Delete"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* =====================================================
            RIGHT SIDE: SERVICE LIST + PREVIEW
           ===================================================== */}

        <div className="space-y-4">
          <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <h2 className="text-base font-black text-slate-950">
                  Service List
                </h2>
                <p className="mt-1 text-xs font-medium text-slate-500">
                  এখানে service fee, discount, test fee, report time সব control
                  করা যাবে।
                </p>
              </div>

              <div className="grid gap-2 sm:grid-cols-2 xl:w-[520px]">
                <label className="relative block">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search service..."
                    className="h-10 w-full rounded-xl border border-slate-200 pl-10 pr-3 text-sm outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
                  />
                </label>

                <select
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(event.target.value as ServiceStatus | "All")
                  }
                  className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700 outline-none focus:border-teal-500"
                >
                  <option value="All">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Draft">Draft</option>
                  <option value="Unavailable">Unavailable</option>
                </select>
              </div>
            </div>

            <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
              <div className="hidden grid-cols-[1.6fr_1fr_1fr_1fr_1fr_1.1fr] gap-3 bg-slate-50 px-4 py-3 text-xs font-black uppercase tracking-[0.12em] text-slate-500 xl:grid">
                <span>Service</span>
                <span>Fee</span>
                <span>Report</span>
                <span>Status</span>
                <span>Duration</span>
                <span className="text-right">Action</span>
              </div>

              <div className="divide-y divide-slate-100">
                {filteredServices.length === 0 ? (
                  <div className="p-8 text-center">
                    <p className="font-bold text-slate-700">
                      কোনো service পাওয়া যায়নি
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Search/filter change করুন অথবা নতুন service add করুন।
                    </p>
                  </div>
                ) : (
                  filteredServices.map((service) => (
                    <div
                      key={service.id}
                      className="grid gap-3 p-4 transition hover:bg-slate-50 xl:grid-cols-[1.6fr_1fr_1fr_1fr_1fr_1.1fr] xl:items-center"
                    >
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="truncate text-sm font-black text-slate-950">
                            {service.name}
                          </h3>

                          {service.isFeatured ? (
                            <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-black text-amber-700">
                              Featured
                            </span>
                          ) : null}
                        </div>

                        <p className="truncate text-xs font-bold text-teal-700">
                          {service.categoryName}
                        </p>

                        <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                          {service.description || "No description"}
                        </p>
                      </div>

                      <div className="text-xs text-slate-600">
                        <p className="font-black text-slate-950">
                          Final: {money(service.finalFee)}
                        </p>
                        <p className="mt-1 line-through">
                          Regular: {money(service.regularFee)}
                        </p>
                        <p className="mt-1">
                          Test Fee: {money(service.testFee)}
                        </p>
                      </div>

                      <div className="text-xs text-slate-600">
                        <p className="flex items-center gap-1 font-bold text-slate-800">
                          <Clock3 className="h-3.5 w-3.5 text-teal-600" />
                          {service.reportTime || "Not set"}
                        </p>
                        <p className="mt-1">{service.duration || "Flexible"}</p>
                      </div>

                      <div className="space-y-2">
                        <ToggleSwitch
                          checked={service.isVisible}
                          onChange={() => toggleServiceVisibility(service.id)}
                          label="Website"
                          activeText="Show"
                          inactiveText="Hide"
                        />

                        <select
                          value={service.status}
                          onChange={(event) =>
                            updateServiceStatus(
                              service.id,
                              event.target.value as ServiceStatus,
                            )
                          }
                          className="h-9 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-black text-slate-700 outline-none focus:border-teal-500"
                        >
                          <option value="Active">Active</option>
                          <option value="Draft">Draft</option>
                          <option value="Unavailable">Unavailable</option>
                        </select>
                      </div>

                      <select
                        value={service.showDuration}
                        onChange={(event) =>
                          updateServiceDuration(
                            service.id,
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

                      <div className="grid grid-cols-2 gap-2 xl:flex xl:justify-end">
                        <button
                          type="button"
                          onClick={() => openEditServiceModal(service)}
                          className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-xs font-black text-slate-700 transition hover:bg-white"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => deleteService(service.id)}
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

          {/* =====================================================
              PUBLIC WEBSITE PREVIEW
             ===================================================== */}

          <section className="rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
            <div className="rounded-3xl bg-white p-5">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-teal-700">
                    {sectionSettings.badge}
                  </p>

                  <h2 className="mt-2 text-2xl font-black text-slate-950">
                    {sectionSettings.title}
                  </h2>

                  <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">
                    {sectionSettings.shortDescription}
                  </p>
                </div>

                <span
                  className={`w-fit rounded-full px-3 py-1.5 text-xs font-black ${
                    sectionSettings.isVisible
                      ? "bg-teal-50 text-teal-700"
                      : "bg-red-50 text-red-600"
                  }`}
                >
                  {sectionSettings.isVisible
                    ? "Section Show"
                    : "Section Hidden"}{" "}
                  · {getDurationLabel(sectionSettings.showDuration)}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setActiveCategory("all")}
                  className={`rounded-full border px-3 py-1.5 text-xs font-black ${
                    activeCategory === "all"
                      ? "border-teal-600 bg-teal-600 text-white"
                      : "border-slate-200 bg-white text-slate-700"
                  }`}
                >
                  সব
                </button>

                {categories
                  .filter((category) => category.isVisible)
                  .map((category) => (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => setActiveCategory(category.id)}
                      className={`rounded-full border px-3 py-1.5 text-xs font-black ${
                        activeCategory === category.id
                          ? "border-teal-600 bg-teal-600 text-white"
                          : "border-slate-200 bg-white text-slate-700"
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
              </div>

              {!sectionSettings.isVisible ? (
                <div className="mt-5 rounded-2xl border border-dashed border-red-200 bg-red-50/40 p-6 text-center">
                  <p className="font-bold text-red-600">
                    Service section website এ hidden আছে
                  </p>
                </div>
              ) : (
                <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {previewServices.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-center md:col-span-2 xl:col-span-3">
                      <p className="font-bold text-slate-700">
                        Website preview তে কোনো service show হচ্ছে না
                      </p>
                    </div>
                  ) : (
                    previewServices.map((service) => (
                      <div
                        key={service.id}
                        className="rounded-2xl border border-slate-200 bg-white p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h3 className="truncate text-sm font-black text-slate-950">
                              {service.name}
                            </h3>

                            <p className="mt-1 text-xs font-bold text-teal-700">
                              {service.categoryName}
                            </p>
                          </div>

                          <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-black text-teal-700">
                            {money(service.finalFee)}
                          </span>
                        </div>

                        <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
                          {service.description || "Description not added."}
                        </p>

                        <div className="mt-3 grid gap-2 text-xs text-slate-600">
                          <p className="rounded-xl bg-slate-50 p-2">
                            <b>Report:</b> {service.reportTime || "Not set"} ·{" "}
                            <b>Duration:</b> {service.duration || "Flexible"}
                          </p>

                          <p className="rounded-xl bg-slate-50 p-2">
                            <b>Sample:</b> {service.sampleRequired || "No"} ·{" "}
                            <b>Time:</b> {service.availableTime || "Not set"}
                          </p>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-2">
                          {service.isEmergency ? (
                            <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-black text-red-600">
                              Emergency
                            </span>
                          ) : null}

                          {service.isHomeService ? (
                            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-700">
                              Home Service
                            </span>
                          ) : null}

                          {service.isOnlineBooking ? (
                            <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-black text-teal-700">
                              Online Booking
                            </span>
                          ) : null}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      {/* =====================================================
          CATEGORY MODAL
         ===================================================== */}

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
                  Add Service Category
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  নতুন category add করলে service form এবং filter button-এ show
                  হবে।
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
                value={categoryName}
                placeholder="যেমন: Dental Care"
                onChange={setCategoryName}
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

      {/* =====================================================
          SERVICE ADD / EDIT MODAL
         ===================================================== */}

      {isServiceModalOpen ? (
        <div
          onClick={closeServiceModal}
          className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 p-3 sm:items-center"
        >
          <div
            onClick={(event) => event.stopPropagation()}
            className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-3xl bg-white shadow-2xl"
          >
            <div className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b border-slate-100 bg-white p-4">
              <div>
                <h2 className="text-xl font-black text-slate-950">
                  {editingServiceId ? "Edit Service" : "Add New Service"}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Save করলে service list এবং website preview update হবে।
                </p>
              </div>

              <button
                type="button"
                onClick={closeServiceModal}
                className="rounded-full border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50 hover:text-slate-950"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={saveService} className="space-y-4 p-4">
              <div className="rounded-2xl border border-slate-200 p-4">
                <div className="mb-3 flex items-center gap-2">
                  <HeartPulse className="h-4 w-4 text-teal-600" />
                  <h3 className="text-sm font-black text-slate-950">
                    Basic Service Information
                  </h3>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <TextInput
                    label="Service Name"
                    value={serviceForm.name}
                    placeholder="যেমন: CBC Blood Test"
                    onChange={(value) => updateServiceForm("name", value)}
                  />

                  <label className="block">
                    <span className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">
                      Category
                    </span>

                    <select
                      value={serviceForm.categoryId}
                      onChange={(event) =>
                        updateServiceForm("categoryId", event.target.value)
                      }
                      className="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold outline-none focus:border-teal-500"
                    >
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </label>

                  <div className="md:col-span-2">
                    <TextAreaInput
                      label="Service Description"
                      value={serviceForm.description}
                      placeholder="Service details লিখুন"
                      onChange={(value) =>
                        updateServiceForm("description", value)
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 p-4">
                <div className="mb-3 flex items-center gap-2">
                  <BadgePercent className="h-4 w-4 text-teal-600" />
                  <h3 className="text-sm font-black text-slate-950">
                    Fee, Test Fee & Discount Control
                  </h3>
                </div>

                <div className="grid gap-3 md:grid-cols-4">
                  <TextInput
                    label="Regular Fee"
                    value={serviceForm.regularFee}
                    placeholder="1000"
                    type="number"
                    onChange={(value) => updateServiceForm("regularFee", value)}
                  />

                  <TextInput
                    label="Test Fee"
                    value={serviceForm.testFee}
                    placeholder="800"
                    type="number"
                    onChange={(value) => updateServiceForm("testFee", value)}
                  />

                  <label className="block">
                    <span className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">
                      Discount Type
                    </span>
                    <select
                      value={serviceForm.discountType}
                      onChange={(event) =>
                        updateServiceForm(
                          "discountType",
                          event.target.value as DiscountType,
                        )
                      }
                      className="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold outline-none focus:border-teal-500"
                    >
                      <option value="none">No Discount</option>
                      <option value="flat">Flat Discount</option>
                      <option value="percent">Percent Discount</option>
                    </select>
                  </label>

                  <TextInput
                    label="Discount Value"
                    value={serviceForm.discountValue}
                    placeholder="10 or 100"
                    type="number"
                    onChange={(value) =>
                      updateServiceForm("discountValue", value)
                    }
                  />
                </div>

                <div className="mt-3 grid gap-3 md:grid-cols-3">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs font-bold text-slate-500">
                      Regular Fee
                    </p>
                    <p className="mt-1 text-xl font-black text-slate-950">
                      {money(serviceForm.regularFee)}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs font-bold text-slate-500">Discount</p>
                    <p className="mt-1 text-xl font-black text-slate-950">
                      {serviceForm.discountType === "none"
                        ? "No"
                        : serviceForm.discountType === "flat"
                          ? money(serviceForm.discountValue)
                          : `${serviceForm.discountValue || 0}%`}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-teal-50 p-4">
                    <p className="text-xs font-bold text-teal-700">Final Fee</p>
                    <p className="mt-1 text-xl font-black text-teal-700">
                      {money(modalFinalFee)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 p-4">
                <div className="mb-3 flex items-center gap-2">
                  <Clock3 className="h-4 w-4 text-teal-600" />
                  <h3 className="text-sm font-black text-slate-950">
                    Time, Report & Preparation
                  </h3>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <TextInput
                    label="Report Time"
                    value={serviceForm.reportTime}
                    placeholder="6 Hours / 1 Day"
                    onChange={(value) => updateServiceForm("reportTime", value)}
                  />

                  <TextInput
                    label="Service Duration"
                    value={serviceForm.duration}
                    placeholder="15 min / 30 min"
                    onChange={(value) => updateServiceForm("duration", value)}
                  />

                  <TextInput
                    label="Available Days"
                    value={serviceForm.availableDays}
                    placeholder="Everyday / Sat-Thu"
                    onChange={(value) =>
                      updateServiceForm("availableDays", value)
                    }
                  />

                  <TextInput
                    label="Available Time"
                    value={serviceForm.availableTime}
                    placeholder="8 AM - 8 PM"
                    onChange={(value) =>
                      updateServiceForm("availableTime", value)
                    }
                  />

                  <TextInput
                    label="Sample Required"
                    value={serviceForm.sampleRequired}
                    placeholder="Blood / Urine / No"
                    onChange={(value) =>
                      updateServiceForm("sampleRequired", value)
                    }
                  />

                  <TextInput
                    label="Preparation"
                    value={serviceForm.preparation}
                    placeholder="Fasting required / No preparation"
                    onChange={(value) =>
                      updateServiceForm("preparation", value)
                    }
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 p-4">
                <div className="mb-3 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-teal-600" />
                  <h3 className="text-sm font-black text-slate-950">
                    Website, Booking & Status Control
                  </h3>
                </div>

                <div className="grid gap-3 md:grid-cols-3">
                  <ToggleSwitch
                    checked={serviceForm.isVisible}
                    onChange={() =>
                      updateServiceForm("isVisible", !serviceForm.isVisible)
                    }
                    label="Website"
                    activeText="Show"
                    inactiveText="Hide"
                  />

                  <ToggleSwitch
                    checked={serviceForm.isFeatured}
                    onChange={() =>
                      updateServiceForm("isFeatured", !serviceForm.isFeatured)
                    }
                    label="Featured"
                    activeText="Yes"
                    inactiveText="No"
                  />

                  <ToggleSwitch
                    checked={serviceForm.isOnlineBooking}
                    onChange={() =>
                      updateServiceForm(
                        "isOnlineBooking",
                        !serviceForm.isOnlineBooking,
                      )
                    }
                    label="Online Booking"
                    activeText="On"
                    inactiveText="Off"
                  />

                  <ToggleSwitch
                    checked={serviceForm.isHomeService}
                    onChange={() =>
                      updateServiceForm(
                        "isHomeService",
                        !serviceForm.isHomeService,
                      )
                    }
                    label="Home Service"
                    activeText="Yes"
                    inactiveText="No"
                  />

                  <ToggleSwitch
                    checked={serviceForm.isEmergency}
                    onChange={() =>
                      updateServiceForm("isEmergency", !serviceForm.isEmergency)
                    }
                    label="Emergency"
                    activeText="Yes"
                    inactiveText="No"
                  />

                  <label className="block rounded-xl border border-slate-200 bg-white px-3 py-2">
                    <span className="text-xs font-bold text-slate-500">
                      Status
                    </span>
                    <select
                      value={serviceForm.status}
                      onChange={(event) =>
                        updateServiceForm(
                          "status",
                          event.target.value as ServiceStatus,
                        )
                      }
                      className="mt-1 h-7 w-full bg-transparent text-sm font-black text-slate-800 outline-none"
                    >
                      <option value="Active">Active</option>
                      <option value="Draft">Draft</option>
                      <option value="Unavailable">Unavailable</option>
                    </select>
                  </label>

                  <label className="block rounded-xl border border-slate-200 bg-white px-3 py-2 md:col-span-3">
                    <span className="text-xs font-bold text-slate-500">
                      Show Duration
                    </span>
                    <select
                      value={serviceForm.showDuration}
                      onChange={(event) =>
                        updateServiceForm(
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
              </div>

              <div className="sticky bottom-0 -mx-4 -mb-4 grid grid-cols-2 gap-2 border-t border-slate-100 bg-white p-4">
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
                  {editingServiceId ? "Save Changes" : "Save Service"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default function AdminSectionPage() {
  const params = useParams<{ section: string }>();
  const defaultConfig = sectionConfig[params.section as SectionKey];

  if (params.section === "appointments") {
    return <AppointmentsAdminPanel />;
  }

  if (params.section === "services") {
    return <ServiceAdminPanel />;
  }

  if (params.section === "website") {
    return <WebsiteControlPanel />;
  }

  if (defaultConfig) {
    return <DefaultAdminSection config={defaultConfig} />;
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
        <Home className="h-5 w-5" />
      </div>
      <h1 className="mt-4 text-2xl font-black text-slate-950">
        Section not found
      </h1>
      <p className="mt-2 text-sm leading-7 text-slate-600">
        এই admin section পাওয়া যায়নি। Sidebar থেকে valid section select করুন।
      </p>
      <Link
        href="/admin"
        className="mt-5 inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-bold text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to dashboard
      </Link>
    </div>
  );
}
