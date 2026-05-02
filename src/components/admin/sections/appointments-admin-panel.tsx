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
  Printer,
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

function getDateCategoryMatched(dateString: string, category: DateCategory) {
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

  const appointmentSeedData: Appointment[] = [
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
    {
      id: "apt-5",
      serialNo: "APT-005",
      patientName: "রফিকুল ইসলাম",
      phone: "01700000005",
      doctorName: "ডা. তানভীর আহমেদ",
      department: "চর্মরোগ",
      serviceName: "Skin Allergy Consultation",
      date: today,
      time: "১০টা - ১১টা",
      visitType: "Regular Serial",
      note: "Skin rash and itching",
      status: "Pending",
    },
    {
      id: "apt-6",
      serialNo: "APT-006",
      patientName: "মাহমুদা বেগম",
      phone: "01800000006",
      doctorName: "ডা. ইমরান হোসেন",
      department: "শিশু",
      serviceName: "Child Fever Checkup",
      date: tomorrow,
      time: "২টা - ৩টা",
      visitType: "Emergency Serial",
      note: "Child fever for 2 days",
      status: "Confirmed",
    },
    {
      id: "apt-7",
      serialNo: "APT-007",
      patientName: "সাইফুল ইসলাম",
      phone: "01900000007",
      doctorName: "ডা. রাকিবুল হাসান",
      department: "ডায়াবেটিস",
      serviceName: "Diabetes Follow-up",
      date: yesterday,
      time: "৫টা - ৬টা",
      visitType: "Follow-up",
      note: "Sugar level review",
      status: "Completed",
    },
    {
      id: "apt-8",
      serialNo: "APT-008",
      patientName: "জান্নাতুল ফেরদৌস",
      phone: "01600000008",
      doctorName: "ডা. সুমাইয়া জাহান",
      department: "গাইনি",
      serviceName: "Women Health Consultation",
      date: futureNine,
      time: "১২টা - ১টা",
      visitType: "Regular Serial",
      note: "General gynae consultation",
      status: "Cancelled",
    },
    {
      id: "apt-9",
      serialNo: "APT-009",
      patientName: "ইমরান হোসেন",
      phone: "01700000009",
      doctorName: "ডা. মাহমুদুল করিম",
      department: "মেডিসিন",
      serviceName: "General Medicine",
      date: today,
      time: "৬টা - ৭টা",
      visitType: "Regular Serial",
      note: "Weakness and headache",
      status: "Confirmed",
    },
    {
      id: "apt-10",
      serialNo: "APT-010",
      patientName: "তাসনিম আক্তার",
      phone: "01800000010",
      doctorName: "ডা. নাবিলা ইসলাম",
      department: "চক্ষু",
      serviceName: "Eye Checkup",
      date: tomorrow,
      time: "৯টা - ১০টা",
      visitType: "Regular Serial",
      note: "Blurred vision",
      status: "Pending",
    },
    {
      id: "apt-11",
      serialNo: "APT-011",
      patientName: "মোঃ আলমগীর হোসেন",
      phone: "01900000011",
      doctorName: "ডা. আরমান কবির",
      department: "ইএনটি",
      serviceName: "ENT Consultation",
      date: yesterday,
      time: "১০টা - ১১টা",
      visitType: "Follow-up",
      note: "Ear pain follow-up",
      status: "Completed",
    },
    {
      id: "apt-12",
      serialNo: "APT-012",
      patientName: "রাবেয়া খাতুন",
      phone: "01700000012",
      doctorName: "ডা. সাদিয়া রহমান",
      department: "হৃদরোগ",
      serviceName: "Blood Pressure Review",
      date: today,
      time: "১১টা - ১২টা",
      visitType: "Follow-up",
      note: "High BP review",
      status: "Confirmed",
    },
    {
      id: "apt-13",
      serialNo: "APT-013",
      patientName: "মামুনুর রশিদ",
      phone: "01800000013",
      doctorName: "ডা. শফিকুল ইসলাম",
      department: "অর্থোপেডিক",
      serviceName: "Bone & Joint Pain",
      date: tomorrow,
      time: "৩টা - ৪টা",
      visitType: "Regular Serial",
      note: "Knee pain",
      status: "Pending",
    },
    {
      id: "apt-14",
      serialNo: "APT-014",
      patientName: "মৌসুমী আক্তার",
      phone: "01900000014",
      doctorName: "ডা. ফারহানা রহমান",
      department: "ডেন্টাল",
      serviceName: "Dental Checkup",
      date: futureNine,
      time: "৪টা - ৫টা",
      visitType: "Regular Serial",
      note: "Tooth pain",
      status: "Confirmed",
    },
    {
      id: "apt-15",
      serialNo: "APT-015",
      patientName: "হাসান মাহমুদ",
      phone: "01600000015",
      doctorName: "ডা. তানভীর আহমেদ",
      department: "চর্মরোগ",
      serviceName: "Acne Treatment",
      date: today,
      time: "৭টা - ৮টা",
      visitType: "Follow-up",
      note: "Acne medication review",
      status: "Completed",
    },
    {
      id: "apt-16",
      serialNo: "APT-016",
      patientName: "আসমা বেগম",
      phone: "01700000016",
      doctorName: "ডা. ইমরান হোসেন",
      department: "শিশু",
      serviceName: "Child Nutrition",
      date: yesterday,
      time: "১টা - ২টা",
      visitType: "Regular Serial",
      note: "Child nutrition advice",
      status: "Cancelled",
    },
    {
      id: "apt-17",
      serialNo: "APT-017",
      patientName: "ফয়সাল আহমেদ",
      phone: "01800000017",
      doctorName: "ডা. রাকিবুল হাসান",
      department: "ডায়াবেটিস",
      serviceName: "Insulin Review",
      date: tomorrow,
      time: "৫টা - ৬টা",
      visitType: "Follow-up",
      note: "Insulin dose review",
      status: "Confirmed",
    },
    {
      id: "apt-18",
      serialNo: "APT-018",
      patientName: "নুসরাত জাহান",
      phone: "01900000018",
      doctorName: "ডা. নাবিলা ইসলাম",
      department: "চক্ষু",
      serviceName: "Eye Pressure Test",
      date: futureNine,
      time: "২টা - ৩টা",
      visitType: "Regular Serial",
      note: "Eye pressure check",
      status: "Pending",
    },
    {
      id: "apt-19",
      serialNo: "APT-019",
      patientName: "মোঃ শরিফুল ইসলাম",
      phone: "01700000019",
      doctorName: "ডা. আরমান কবির",
      department: "ইএনটি",
      serviceName: "Throat Infection",
      date: today,
      time: "১২টা - ১টা",
      visitType: "Emergency Serial",
      note: "Severe throat pain",
      status: "Confirmed",
    },
    {
      id: "apt-20",
      serialNo: "APT-020",
      patientName: "শারমিন সুলতানা",
      phone: "01800000020",
      doctorName: "ডা. সুমাইয়া জাহান",
      department: "গাইনি",
      serviceName: "Ultrasound Review",
      date: yesterday,
      time: "৬টা - ৭টা",
      visitType: "Follow-up",
      note: "Report review",
      status: "Completed",
    },
    {
      id: "apt-21",
      serialNo: "APT-021",
      patientName: "রাশেদুল করিম",
      phone: "01900000021",
      doctorName: "ডা. মাহমুদুল করিম",
      department: "মেডিসিন",
      serviceName: "Cold & Cough",
      date: tomorrow,
      time: "১০টা - ১১টা",
      visitType: "Regular Serial",
      note: "Cold and cough",
      status: "Pending",
    },
    {
      id: "apt-22",
      serialNo: "APT-022",
      patientName: "লাবনী আক্তার",
      phone: "01600000022",
      doctorName: "ডা. ফারহানা রহমান",
      department: "ডেন্টাল",
      serviceName: "Root Canal Consultation",
      date: futureNine,
      time: "১১টা - ১২টা",
      visitType: "Regular Serial",
      note: "Root canal advice",
      status: "Confirmed",
    },
    {
      id: "apt-23",
      serialNo: "APT-023",
      patientName: "মোঃ জাহিদ হাসান",
      phone: "01700000023",
      doctorName: "ডা. শফিকুল ইসলাম",
      department: "অর্থোপেডিক",
      serviceName: "Back Pain Consultation",
      date: today,
      time: "৮টা - ৯টা",
      visitType: "Emergency Serial",
      note: "Severe back pain",
      status: "Confirmed",
    },
    {
      id: "apt-24",
      serialNo: "APT-024",
      patientName: "তানিয়া রহমান",
      phone: "01800000024",
      doctorName: "ডা. সাদিয়া রহমান",
      department: "হৃদরোগ",
      serviceName: "Echo Report Review",
      date: yesterday,
      time: "৯টা - ১০টা",
      visitType: "Follow-up",
      note: "Echo report review",
      status: "Completed",
    },
    {
      id: "apt-25",
      serialNo: "APT-025",
      patientName: "মোঃ মিজানুর রহমান",
      phone: "01900000025",
      doctorName: "ডা. তানভীর আহমেদ",
      department: "চর্মরোগ",
      serviceName: "Fungal Infection",
      date: tomorrow,
      time: "৪টা - ৫টা",
      visitType: "Regular Serial",
      note: "Skin infection",
      status: "Pending",
    },
    {
      id: "apt-26",
      serialNo: "APT-026",
      patientName: "সালমা খাতুন",
      phone: "01700000026",
      doctorName: "ডা. ইমরান হোসেন",
      department: "শিশু",
      serviceName: "Vaccination Advice",
      date: futureNine,
      time: "৩টা - ৪টা",
      visitType: "Regular Serial",
      note: "Child vaccination schedule",
      status: "Confirmed",
    },
    {
      id: "apt-27",
      serialNo: "APT-027",
      patientName: "আরমান আলী",
      phone: "01800000027",
      doctorName: "ডা. রাকিবুল হাসান",
      department: "ডায়াবেটিস",
      serviceName: "Sugar Test Review",
      date: today,
      time: "৫টা - ৬টা",
      visitType: "Follow-up",
      note: "Fasting sugar report",
      status: "Completed",
    },
    {
      id: "apt-28",
      serialNo: "APT-028",
      patientName: "সুমাইয়া আক্তার",
      phone: "01900000028",
      doctorName: "ডা. নাবিলা ইসলাম",
      department: "চক্ষু",
      serviceName: "Eye Allergy",
      date: tomorrow,
      time: "১২টা - ১টা",
      visitType: "Regular Serial",
      note: "Eye redness",
      status: "Cancelled",
    },
    {
      id: "apt-29",
      serialNo: "APT-029",
      patientName: "মোঃ রুবেল হোসেন",
      phone: "01600000029",
      doctorName: "ডা. আরমান কবির",
      department: "ইএনটি",
      serviceName: "Sinus Consultation",
      date: yesterday,
      time: "২টা - ৩টা",
      visitType: "Follow-up",
      note: "Sinus problem",
      status: "Confirmed",
    },
    {
      id: "apt-30",
      serialNo: "APT-030",
      patientName: "মারিয়া ইসলাম",
      phone: "01700000030",
      doctorName: "ডা. সুমাইয়া জাহান",
      department: "গাইনি",
      serviceName: "Hormone Checkup",
      date: futureNine,
      time: "৬টা - ৭টা",
      visitType: "Regular Serial",
      note: "Hormone issue",
      status: "Pending",
    },
    {
      id: "apt-31",
      serialNo: "APT-031",
      patientName: "আব্দুল জলিল",
      phone: "01800000031",
      doctorName: "ডা. মাহমুদুল করিম",
      department: "মেডিসিন",
      serviceName: "Gastric Problem",
      date: today,
      time: "৯টা - ১০টা",
      visitType: "Regular Serial",
      note: "Acidity and gastric pain",
      status: "Confirmed",
    },
    {
      id: "apt-32",
      serialNo: "APT-032",
      patientName: "রুনা লায়লা",
      phone: "01900000032",
      doctorName: "ডা. ফারহানা রহমান",
      department: "ডেন্টাল",
      serviceName: "Teeth Cleaning",
      date: tomorrow,
      time: "১টা - ২টা",
      visitType: "Regular Serial",
      note: "Scaling appointment",
      status: "Completed",
    },
    {
      id: "apt-33",
      serialNo: "APT-033",
      patientName: "মোঃ সাগর মিয়া",
      phone: "01700000033",
      doctorName: "ডা. শফিকুল ইসলাম",
      department: "অর্থোপেডিক",
      serviceName: "Fracture Follow-up",
      date: yesterday,
      time: "৩টা - ৪টা",
      visitType: "Follow-up",
      note: "Fracture recovery check",
      status: "Completed",
    },
    {
      id: "apt-34",
      serialNo: "APT-034",
      patientName: "সানজিদা ইসলাম",
      phone: "01800000034",
      doctorName: "ডা. সাদিয়া রহমান",
      department: "হৃদরোগ",
      serviceName: "Heart Checkup",
      date: futureNine,
      time: "৭টা - ৮টা",
      visitType: "Regular Serial",
      note: "Routine heart checkup",
      status: "Pending",
    },
    {
      id: "apt-35",
      serialNo: "APT-035",
      patientName: "মোঃ কামরুল ইসলাম",
      phone: "01900000035",
      doctorName: "ডা. তানভীর আহমেদ",
      department: "চর্মরোগ",
      serviceName: "Skin Infection Review",
      date: today,
      time: "১১টা - ১২টা",
      visitType: "Follow-up",
      note: "Medicine follow-up",
      status: "Confirmed",
    },
    {
      id: "apt-36",
      serialNo: "APT-036",
      patientName: "নাহিদা আক্তার",
      phone: "01600000036",
      doctorName: "ডা. ইমরান হোসেন",
      department: "শিশু",
      serviceName: "Child Cough",
      date: tomorrow,
      time: "৬টা - ৭টা",
      visitType: "Emergency Serial",
      note: "Child severe cough",
      status: "Pending",
    },
    {
      id: "apt-37",
      serialNo: "APT-037",
      patientName: "মোঃ আজিজুল ইসলাম",
      phone: "01700000037",
      doctorName: "ডা. রাকিবুল হাসান",
      department: "ডায়াবেটিস",
      serviceName: "Diabetes New Patient",
      date: futureNine,
      time: "১০টা - ১১টা",
      visitType: "Regular Serial",
      note: "New diabetes patient",
      status: "Confirmed",
    },
    {
      id: "apt-38",
      serialNo: "APT-038",
      patientName: "শিমু আক্তার",
      phone: "01800000038",
      doctorName: "ডা. নাবিলা ইসলাম",
      department: "চক্ষু",
      serviceName: "Vision Test",
      date: today,
      time: "২টা - ৩টা",
      visitType: "Regular Serial",
      note: "Power check",
      status: "Completed",
    },
    {
      id: "apt-39",
      serialNo: "APT-039",
      patientName: "মোঃ রাকিব মিয়া",
      phone: "01900000039",
      doctorName: "ডা. আরমান কবির",
      department: "ইএনটি",
      serviceName: "Nose Bleeding",
      date: tomorrow,
      time: "৯টা - ১০টা",
      visitType: "Emergency Serial",
      note: "Nose bleeding issue",
      status: "Confirmed",
    },
    {
      id: "apt-40",
      serialNo: "APT-040",
      patientName: "শিউলি বেগম",
      phone: "01700000040",
      doctorName: "ডা. সুমাইয়া জাহান",
      department: "গাইনি",
      serviceName: "Post Pregnancy Checkup",
      date: yesterday,
      time: "১২টা - ১টা",
      visitType: "Follow-up",
      note: "Post pregnancy check",
      status: "Completed",
    },
    {
      id: "apt-41",
      serialNo: "APT-041",
      patientName: "মোঃ ফরহাদ হোসেন",
      phone: "01800000041",
      doctorName: "ডা. মাহমুদুল করিম",
      department: "মেডিসিন",
      serviceName: "Migraine Consultation",
      date: futureNine,
      time: "৪টা - ৫টা",
      visitType: "Regular Serial",
      note: "Migraine headache",
      status: "Pending",
    },
    {
      id: "apt-42",
      serialNo: "APT-042",
      patientName: "আয়েশা সিদ্দিকা",
      phone: "01900000042",
      doctorName: "ডা. ফারহানা রহমান",
      department: "ডেন্টাল",
      serviceName: "Tooth Extraction",
      date: today,
      time: "৫টা - ৬টা",
      visitType: "Emergency Serial",
      note: "Severe tooth pain",
      status: "Confirmed",
    },
    {
      id: "apt-43",
      serialNo: "APT-043",
      patientName: "মোঃ রায়হান কবির",
      phone: "01600000043",
      doctorName: "ডা. শফিকুল ইসলাম",
      department: "অর্থোপেডিক",
      serviceName: "Shoulder Pain",
      date: tomorrow,
      time: "১১টা - ১২টা",
      visitType: "Regular Serial",
      note: "Shoulder movement pain",
      status: "Pending",
    },
    {
      id: "apt-44",
      serialNo: "APT-044",
      patientName: "মিনা আক্তার",
      phone: "01700000044",
      doctorName: "ডা. সাদিয়া রহমান",
      department: "হৃদরোগ",
      serviceName: "ECG Test",
      date: yesterday,
      time: "১টা - ২টা",
      visitType: "Regular Serial",
      note: "ECG required",
      status: "Cancelled",
    },
    {
      id: "apt-45",
      serialNo: "APT-045",
      patientName: "মোঃ সোহেল রানা",
      phone: "01800000045",
      doctorName: "ডা. তানভীর আহমেদ",
      department: "চর্মরোগ",
      serviceName: "Hair Fall Consultation",
      date: futureNine,
      time: "২টা - ৩টা",
      visitType: "Regular Serial",
      note: "Hair fall issue",
      status: "Confirmed",
    },
    {
      id: "apt-46",
      serialNo: "APT-046",
      patientName: "রোকসানা আক্তার",
      phone: "01900000046",
      doctorName: "ডা. ইমরান হোসেন",
      department: "শিশু",
      serviceName: "Child Stomach Pain",
      date: today,
      time: "৬টা - ৭টা",
      visitType: "Emergency Serial",
      note: "Child stomach pain",
      status: "Pending",
    },
    {
      id: "apt-47",
      serialNo: "APT-047",
      patientName: "মোঃ নাঈম ইসলাম",
      phone: "01700000047",
      doctorName: "ডা. রাকিবুল হাসান",
      department: "ডায়াবেটিস",
      serviceName: "HbA1c Review",
      date: tomorrow,
      time: "৭টা - ৮টা",
      visitType: "Follow-up",
      note: "HbA1c report",
      status: "Confirmed",
    },
    {
      id: "apt-48",
      serialNo: "APT-048",
      patientName: "সাদিয়া আক্তার",
      phone: "01800000048",
      doctorName: "ডা. নাবিলা ইসলাম",
      department: "চক্ষু",
      serviceName: "Eye Infection",
      date: yesterday,
      time: "৮টা - ৯টা",
      visitType: "Emergency Serial",
      note: "Eye infection",
      status: "Completed",
    },
    {
      id: "apt-49",
      serialNo: "APT-049",
      patientName: "মোঃ জুয়েল মিয়া",
      phone: "01900000049",
      doctorName: "ডা. আরমান কবির",
      department: "ইএনটি",
      serviceName: "Tonsil Consultation",
      date: futureNine,
      time: "৫টা - ৬টা",
      visitType: "Regular Serial",
      note: "Tonsil problem",
      status: "Pending",
    },
    {
      id: "apt-50",
      serialNo: "APT-050",
      patientName: "পারভীন আক্তার",
      phone: "01600000050",
      doctorName: "ডা. সুমাইয়া জাহান",
      department: "গাইনি",
      serviceName: "Menstrual Problem",
      date: today,
      time: "১০টা - ১১টা",
      visitType: "Regular Serial",
      note: "Irregular cycle",
      status: "Confirmed",
    },
    {
      id: "apt-51",
      serialNo: "APT-051",
      patientName: "মোঃ সেলিম উদ্দিন",
      phone: "01700000051",
      doctorName: "ডা. মাহমুদুল করিম",
      department: "মেডিসিন",
      serviceName: "Blood Test Review",
      date: tomorrow,
      time: "২টা - ৩টা",
      visitType: "Follow-up",
      note: "Blood report review",
      status: "Completed",
    },
    {
      id: "apt-52",
      serialNo: "APT-052",
      patientName: "রিমা খাতুন",
      phone: "01800000052",
      doctorName: "ডা. ফারহানা রহমান",
      department: "ডেন্টাল",
      serviceName: "Dental Filling",
      date: yesterday,
      time: "৪টা - ৫টা",
      visitType: "Regular Serial",
      note: "Cavity filling",
      status: "Confirmed",
    },
    {
      id: "apt-53",
      serialNo: "APT-053",
      patientName: "মোঃ আনোয়ার হোসেন",
      phone: "01900000053",
      doctorName: "ডা. শফিকুল ইসলাম",
      department: "অর্থোপেডিক",
      serviceName: "Neck Pain",
      date: futureNine,
      time: "১টা - ২টা",
      visitType: "Regular Serial",
      note: "Neck pain",
      status: "Pending",
    },
    {
      id: "apt-54",
      serialNo: "APT-054",
      patientName: "ফারজানা ইসলাম",
      phone: "01700000054",
      doctorName: "ডা. সাদিয়া রহমান",
      department: "হৃদরোগ",
      serviceName: "Cardiac Risk Review",
      date: today,
      time: "৩টা - ৪টা",
      visitType: "Follow-up",
      note: "Family history review",
      status: "Confirmed",
    },
    {
      id: "apt-55",
      serialNo: "APT-055",
      patientName: "মোঃ হেলাল উদ্দিন",
      phone: "01800000055",
      doctorName: "ডা. তানভীর আহমেদ",
      department: "চর্মরোগ",
      serviceName: "Eczema Treatment",
      date: tomorrow,
      time: "৬টা - ৭টা",
      visitType: "Follow-up",
      note: "Eczema medicine review",
      status: "Completed",
    },
    {
      id: "apt-56",
      serialNo: "APT-056",
      patientName: "শান্তা আক্তার",
      phone: "01900000056",
      doctorName: "ডা. ইমরান হোসেন",
      department: "শিশু",
      serviceName: "Child Growth Check",
      date: yesterday,
      time: "৯টা - ১০টা",
      visitType: "Regular Serial",
      note: "Growth tracking",
      status: "Pending",
    },
    {
      id: "apt-57",
      serialNo: "APT-057",
      patientName: "মোঃ মিলন রহমান",
      phone: "01600000057",
      doctorName: "ডা. রাকিবুল হাসান",
      department: "ডায়াবেটিস",
      serviceName: "Diet Chart Advice",
      date: futureNine,
      time: "১২টা - ১টা",
      visitType: "Regular Serial",
      note: "Diet chart needed",
      status: "Confirmed",
    },
    {
      id: "apt-58",
      serialNo: "APT-058",
      patientName: "নাজমা বেগম",
      phone: "01700000058",
      doctorName: "ডা. নাবিলা ইসলাম",
      department: "চক্ষু",
      serviceName: "Cataract Screening",
      date: today,
      time: "১টা - ২টা",
      visitType: "Regular Serial",
      note: "Cataract check",
      status: "Pending",
    },
    {
      id: "apt-59",
      serialNo: "APT-059",
      patientName: "মোঃ বাবুল মিয়া",
      phone: "01800000059",
      doctorName: "ডা. আরমান কবির",
      department: "ইএনটি",
      serviceName: "Hearing Problem",
      date: tomorrow,
      time: "৪টা - ৫টা",
      visitType: "Regular Serial",
      note: "Low hearing issue",
      status: "Confirmed",
    },
    {
      id: "apt-60",
      serialNo: "APT-060",
      patientName: "শাহানা আক্তার",
      phone: "01900000060",
      doctorName: "ডা. সুমাইয়া জাহান",
      department: "গাইনি",
      serviceName: "Fertility Consultation",
      date: yesterday,
      time: "৭টা - ৮টা",
      visitType: "Regular Serial",
      note: "Fertility advice",
      status: "Cancelled",
    },
    {
      id: "apt-61",
      serialNo: "APT-061",
      patientName: "মোঃ সজিব হোসেন",
      phone: "01700000061",
      doctorName: "ডা. মাহমুদুল করিম",
      department: "মেডিসিন",
      serviceName: "Dengue Follow-up",
      date: futureNine,
      time: "৩টা - ৪টা",
      visitType: "Follow-up",
      note: "Platelet count review",
      status: "Confirmed",
    },
    {
      id: "apt-62",
      serialNo: "APT-062",
      patientName: "মিতু আক্তার",
      phone: "01800000062",
      doctorName: "ডা. ফারহানা রহমান",
      department: "ডেন্টাল",
      serviceName: "Braces Consultation",
      date: today,
      time: "১১টা - ১২টা",
      visitType: "Regular Serial",
      note: "Braces planning",
      status: "Pending",
    },
    {
      id: "apt-63",
      serialNo: "APT-063",
      patientName: "মোঃ জিয়াউর রহমান",
      phone: "01900000063",
      doctorName: "ডা. শফিকুল ইসলাম",
      department: "অর্থোপেডিক",
      serviceName: "Leg Pain",
      date: tomorrow,
      time: "৮টা - ৯টা",
      visitType: "Emergency Serial",
      note: "Sudden leg pain",
      status: "Confirmed",
    },
    {
      id: "apt-64",
      serialNo: "APT-064",
      patientName: "সামিয়া রহমান",
      phone: "01600000064",
      doctorName: "ডা. সাদিয়া রহমান",
      department: "হৃদরোগ",
      serviceName: "Chest Pain Emergency",
      date: today,
      time: "৮টা - ৯টা",
      visitType: "Emergency Serial",
      note: "Urgent chest pain",
      status: "Pending",
    },
    {
      id: "apt-65",
      serialNo: "APT-065",
      patientName: "মোঃ নয়ন আলী",
      phone: "01700000065",
      doctorName: "ডা. তানভীর আহমেদ",
      department: "চর্মরোগ",
      serviceName: "Rash Emergency",
      date: tomorrow,
      time: "১টা - ২টা",
      visitType: "Emergency Serial",
      note: "Sudden rash",
      status: "Confirmed",
    },
    {
      id: "apt-66",
      serialNo: "APT-066",
      patientName: "সেলিনা খাতুন",
      phone: "01800000066",
      doctorName: "ডা. ইমরান হোসেন",
      department: "শিশু",
      serviceName: "Newborn Checkup",
      date: yesterday,
      time: "১০টা - ১১টা",
      visitType: "Regular Serial",
      note: "Newborn routine check",
      status: "Completed",
    },
    {
      id: "apt-67",
      serialNo: "APT-067",
      patientName: "মোঃ রনি মিয়া",
      phone: "01900000067",
      doctorName: "ডা. রাকিবুল হাসান",
      department: "ডায়াবেটিস",
      serviceName: "Low Sugar Emergency",
      date: today,
      time: "১২টা - ১টা",
      visitType: "Emergency Serial",
      note: "Low sugar symptoms",
      status: "Confirmed",
    },
    {
      id: "apt-68",
      serialNo: "APT-068",
      patientName: "সুমনা আক্তার",
      phone: "01700000068",
      doctorName: "ডা. নাবিলা ইসলাম",
      department: "চক্ষু",
      serviceName: "Eye Injury",
      date: futureNine,
      time: "৯টা - ১০টা",
      visitType: "Emergency Serial",
      note: "Minor eye injury",
      status: "Pending",
    },
    {
      id: "apt-69",
      serialNo: "APT-069",
      patientName: "মোঃ রাসেল আহমেদ",
      phone: "01800000069",
      doctorName: "ডা. আরমান কবির",
      department: "ইএনটি",
      serviceName: "Ear Block",
      date: tomorrow,
      time: "৫টা - ৬টা",
      visitType: "Regular Serial",
      note: "Ear block issue",
      status: "Completed",
    },
    {
      id: "apt-70",
      serialNo: "APT-070",
      patientName: "মুনিয়া আক্তার",
      phone: "01900000070",
      doctorName: "ডা. সুমাইয়া জাহান",
      department: "গাইনি",
      serviceName: "Pregnancy Emergency",
      date: today,
      time: "৭টা - ৮টা",
      visitType: "Emergency Serial",
      note: "Emergency pregnancy advice",
      status: "Confirmed",
    },
    {
      id: "apt-71",
      serialNo: "APT-071",
      patientName: "মোঃ ইকবাল হোসেন",
      phone: "01600000071",
      doctorName: "ডা. মাহমুদুল করিম",
      department: "মেডিসিন",
      serviceName: "Liver Function Review",
      date: yesterday,
      time: "১১টা - ১২টা",
      visitType: "Follow-up",
      note: "LFT report review",
      status: "Completed",
    },
    {
      id: "apt-72",
      serialNo: "APT-072",
      patientName: "নাজিয়া ইসলাম",
      phone: "01700000072",
      doctorName: "ডা. ফারহানা রহমান",
      department: "ডেন্টাল",
      serviceName: "Gum Problem",
      date: tomorrow,
      time: "৩টা - ৪টা",
      visitType: "Follow-up",
      note: "Gum bleeding follow-up",
      status: "Pending",
    },
    {
      id: "apt-73",
      serialNo: "APT-073",
      patientName: "মোঃ আরাফাত হোসেন",
      phone: "01800000073",
      doctorName: "ডা. শফিকুল ইসলাম",
      department: "অর্থোপেডিক",
      serviceName: "Sports Injury",
      date: futureNine,
      time: "৬টা - ৭টা",
      visitType: "Emergency Serial",
      note: "Sports injury",
      status: "Confirmed",
    },
    {
      id: "apt-74",
      serialNo: "APT-074",
      patientName: "শামীমা আক্তার",
      phone: "01900000074",
      doctorName: "ডা. সাদিয়া রহমান",
      department: "হৃদরোগ",
      serviceName: "Pulse Check",
      date: today,
      time: "৯টা - ১০টা",
      visitType: "Regular Serial",
      note: "Irregular pulse",
      status: "Pending",
    },
    {
      id: "apt-75",
      serialNo: "APT-075",
      patientName: "মোঃ সুমন আলী",
      phone: "01700000075",
      doctorName: "ডা. তানভীর আহমেদ",
      department: "চর্মরোগ",
      serviceName: "Burn Mark Consultation",
      date: yesterday,
      time: "৬টা - ৭টা",
      visitType: "Follow-up",
      note: "Burn mark treatment",
      status: "Completed",
    },
    {
      id: "apt-76",
      serialNo: "APT-076",
      patientName: "নিশাত তাসনিম",
      phone: "01800000076",
      doctorName: "ডা. ইমরান হোসেন",
      department: "শিশু",
      serviceName: "Child Asthma",
      date: futureNine,
      time: "৮টা - ৯টা",
      visitType: "Follow-up",
      note: "Asthma medicine review",
      status: "Confirmed",
    },
    {
      id: "apt-77",
      serialNo: "APT-077",
      patientName: "মোঃ তৌহিদুল ইসলাম",
      phone: "01900000077",
      doctorName: "ডা. রাকিবুল হাসান",
      department: "ডায়াবেটিস",
      serviceName: "Foot Care Advice",
      date: tomorrow,
      time: "১২টা - ১টা",
      visitType: "Regular Serial",
      note: "Diabetic foot care",
      status: "Pending",
    },
    {
      id: "apt-78",
      serialNo: "APT-078",
      patientName: "আফরোজা বেগম",
      phone: "01600000078",
      doctorName: "ডা. নাবিলা ইসলাম",
      department: "চক্ষু",
      serviceName: "Retina Review",
      date: today,
      time: "৪টা - ৫টা",
      visitType: "Follow-up",
      note: "Retina report review",
      status: "Completed",
    },
    {
      id: "apt-79",
      serialNo: "APT-079",
      patientName: "মোঃ তানভীর হোসেন",
      phone: "01700000079",
      doctorName: "ডা. আরমান কবির",
      department: "ইএনটি",
      serviceName: "Voice Problem",
      date: futureNine,
      time: "১১টা - ১২টা",
      visitType: "Regular Serial",
      note: "Voice problem",
      status: "Confirmed",
    },
    {
      id: "apt-80",
      serialNo: "APT-080",
      patientName: "লামিয়া আক্তার",
      phone: "01800000080",
      doctorName: "ডা. সুমাইয়া জাহান",
      department: "গাইনি",
      serviceName: "PCOS Consultation",
      date: tomorrow,
      time: "১০টা - ১১টা",
      visitType: "Regular Serial",
      note: "PCOS advice",
      status: "Pending",
    },
    {
      id: "apt-81",
      serialNo: "APT-081",
      patientName: "মোঃ রাকিবুল ইসলাম",
      phone: "01900000081",
      doctorName: "ডা. মাহমুদুল করিম",
      department: "মেডিসিন",
      serviceName: "Kidney Function Review",
      date: yesterday,
      time: "৫টা - ৬টা",
      visitType: "Follow-up",
      note: "Kidney report review",
      status: "Completed",
    },
    {
      id: "apt-82",
      serialNo: "APT-082",
      patientName: "সাবিহা নওরিন",
      phone: "01700000082",
      doctorName: "ডা. ফারহানা রহমান",
      department: "ডেন্টাল",
      serviceName: "Wisdom Tooth Pain",
      date: today,
      time: "২টা - ৩টা",
      visitType: "Emergency Serial",
      note: "Wisdom tooth pain",
      status: "Confirmed",
    },
    {
      id: "apt-83",
      serialNo: "APT-083",
      patientName: "মোঃ শাওন মিয়া",
      phone: "01800000083",
      doctorName: "ডা. শফিকুল ইসলাম",
      department: "অর্থোপেডিক",
      serviceName: "Hand Pain",
      date: tomorrow,
      time: "৭টা - ৮টা",
      visitType: "Regular Serial",
      note: "Hand joint pain",
      status: "Pending",
    },
    {
      id: "apt-84",
      serialNo: "APT-084",
      patientName: "সুমাইয়া বিনতে রহমান",
      phone: "01900000084",
      doctorName: "ডা. সাদিয়া রহমান",
      department: "হৃদরোগ",
      serviceName: "BP Emergency",
      date: futureNine,
      time: "১টা - ২টা",
      visitType: "Emergency Serial",
      note: "High blood pressure",
      status: "Confirmed",
    },
    {
      id: "apt-85",
      serialNo: "APT-085",
      patientName: "মোঃ রাজু ইসলাম",
      phone: "01600000085",
      doctorName: "ডা. তানভীর আহমেদ",
      department: "চর্মরোগ",
      serviceName: "Dry Skin Treatment",
      date: today,
      time: "৩টা - ৪টা",
      visitType: "Regular Serial",
      note: "Dry skin issue",
      status: "Pending",
    },
    {
      id: "apt-86",
      serialNo: "APT-086",
      patientName: "মিম আক্তার",
      phone: "01700000086",
      doctorName: "ডা. ইমরান হোসেন",
      department: "শিশু",
      serviceName: "Child Vomiting",
      date: tomorrow,
      time: "৯টা - ১০টা",
      visitType: "Emergency Serial",
      note: "Vomiting problem",
      status: "Confirmed",
    },
    {
      id: "apt-87",
      serialNo: "APT-087",
      patientName: "মোঃ পারভেজ হোসেন",
      phone: "01800000087",
      doctorName: "ডা. রাকিবুল হাসান",
      department: "ডায়াবেটিস",
      serviceName: "Medicine Change",
      date: yesterday,
      time: "২টা - ৩টা",
      visitType: "Follow-up",
      note: "Medicine not working well",
      status: "Cancelled",
    },
    {
      id: "apt-88",
      serialNo: "APT-088",
      patientName: "সুরাইয়া আক্তার",
      phone: "01900000088",
      doctorName: "ডা. নাবিলা ইসলাম",
      department: "চক্ষু",
      serviceName: "Glasses Power Check",
      date: futureNine,
      time: "৪টা - ৫টা",
      visitType: "Regular Serial",
      note: "New glass power",
      status: "Confirmed",
    },
    {
      id: "apt-89",
      serialNo: "APT-089",
      patientName: "মোঃ মেহেদী হাসান",
      phone: "01700000089",
      doctorName: "ডা. আরমান কবির",
      department: "ইএনটি",
      serviceName: "Ear Infection",
      date: today,
      time: "৬টা - ৭টা",
      visitType: "Emergency Serial",
      note: "Ear infection and pain",
      status: "Pending",
    },
    {
      id: "apt-90",
      serialNo: "APT-090",
      patientName: "রিয়া মনি",
      phone: "01800000090",
      doctorName: "ডা. সুমাইয়া জাহান",
      department: "গাইনি",
      serviceName: "Cervical Screening",
      date: tomorrow,
      time: "১১টা - ১২টা",
      visitType: "Regular Serial",
      note: "Screening appointment",
      status: "Confirmed",
    },
    {
      id: "apt-91",
      serialNo: "APT-091",
      patientName: "মোঃ জসিম উদ্দিন",
      phone: "01900000091",
      doctorName: "ডা. মাহমুদুল করিম",
      department: "মেডিসিন",
      serviceName: "Asthma Review",
      date: futureNine,
      time: "৭টা - ৮টা",
      visitType: "Follow-up",
      note: "Breathing issue follow-up",
      status: "Completed",
    },
    {
      id: "apt-92",
      serialNo: "APT-092",
      patientName: "নাহার বেগম",
      phone: "01600000092",
      doctorName: "ডা. ফারহানা রহমান",
      department: "ডেন্টাল",
      serviceName: "Gum Swelling",
      date: today,
      time: "১০টা - ১১টা",
      visitType: "Emergency Serial",
      note: "Swollen gum",
      status: "Pending",
    },
    {
      id: "apt-93",
      serialNo: "APT-093",
      patientName: "মোঃ কাইয়ুম আলী",
      phone: "01700000093",
      doctorName: "ডা. শফিকুল ইসলাম",
      department: "অর্থোপেডিক",
      serviceName: "Hip Pain",
      date: yesterday,
      time: "১২টা - ১টা",
      visitType: "Regular Serial",
      note: "Hip pain",
      status: "Confirmed",
    },
    {
      id: "apt-94",
      serialNo: "APT-094",
      patientName: "ইসরাত জাহান",
      phone: "01800000094",
      doctorName: "ডা. সাদিয়া রহমান",
      department: "হৃদরোগ",
      serviceName: "Cardiology Follow-up",
      date: tomorrow,
      time: "৫টা - ৬টা",
      visitType: "Follow-up",
      note: "Medication review",
      status: "Completed",
    },
    {
      id: "apt-95",
      serialNo: "APT-095",
      patientName: "মোঃ আমিনুল ইসলাম",
      phone: "01900000095",
      doctorName: "ডা. তানভীর আহমেদ",
      department: "চর্মরোগ",
      serviceName: "Skin Spot Check",
      date: futureNine,
      time: "১০টা - ১১টা",
      visitType: "Regular Serial",
      note: "Skin spot checking",
      status: "Confirmed",
    },
    {
      id: "apt-96",
      serialNo: "APT-096",
      patientName: "আফসানা আক্তার",
      phone: "01700000096",
      doctorName: "ডা. ইমরান হোসেন",
      department: "শিশু",
      serviceName: "Child Regular Checkup",
      date: today,
      time: "১টা - ২টা",
      visitType: "Regular Serial",
      note: "Monthly child checkup",
      status: "Pending",
    },
    {
      id: "apt-97",
      serialNo: "APT-097",
      patientName: "মোঃ হাসিবুল ইসলাম",
      phone: "01800000097",
      doctorName: "ডা. রাকিবুল হাসান",
      department: "ডায়াবেটিস",
      serviceName: "Diabetes Emergency",
      date: tomorrow,
      time: "৮টা - ৯টা",
      visitType: "Emergency Serial",
      note: "High sugar emergency",
      status: "Confirmed",
    },
    {
      id: "apt-98",
      serialNo: "APT-098",
      patientName: "নাদিয়া সুলতানা",
      phone: "01900000098",
      doctorName: "ডা. নাবিলা ইসলাম",
      department: "চক্ষু",
      serviceName: "Dry Eye Treatment",
      date: yesterday,
      time: "৪টা - ৫টা",
      visitType: "Follow-up",
      note: "Dry eye follow-up",
      status: "Completed",
    },
    {
      id: "apt-99",
      serialNo: "APT-099",
      patientName: "মোঃ তারেক আজিজ",
      phone: "01600000099",
      doctorName: "ডা. আরমান কবির",
      department: "ইএনটি",
      serviceName: "Allergy Consultation",
      date: futureNine,
      time: "৩টা - ৪টা",
      visitType: "Regular Serial",
      note: "ENT allergy",
      status: "Pending",
    },
    {
      id: "apt-100",
      serialNo: "APT-100",
      patientName: "ফারিয়া তাবাসসুম",
      phone: "01700000100",
      doctorName: "ডা. সুমাইয়া জাহান",
      department: "গাইনি",
      serviceName: "Routine Gynae Checkup",
      date: today,
      time: "৭টা - ৮টা",
      visitType: "Regular Serial",
      note: "Routine checkup",
      status: "Confirmed",
    },
  ];

  return appointmentSeedData;
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
  function printFilteredAppointments() {
    if (filteredAppointments.length === 0) {
      notify("No appointment found to print", "error");
      return;
    }

    const escapeHtml = (value: string | number) =>
      String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

    const generatedAt = new Intl.DateTimeFormat("en-BD", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date());

    const statusClass = (status: AppointmentStatus) => {
      if (status === "Confirmed") return "confirmed";
      if (status === "Completed") return "completed";
      if (status === "Cancelled") return "cancelled";
      return "pending";
    };

    const confirmedCount = filteredAppointments.filter(
      (item) => item.status === "Confirmed",
    ).length;

    const pendingCount = filteredAppointments.filter(
      (item) => item.status === "Pending",
    ).length;

    const completedCount = filteredAppointments.filter(
      (item) => item.status === "Completed",
    ).length;

    const cancelledCount = filteredAppointments.filter(
      (item) => item.status === "Cancelled",
    ).length;

    const activeDateFilter = exactDateFilter
      ? formatDisplayDate(exactDateFilter)
      : dateCategory;

    const rows = filteredAppointments
      .map(
        (item, index) => `
        <tr>
          <td class="center serial-cell">${index + 1}</td>

          <td>
            <strong>${escapeHtml(item.patientName)}</strong>
            <small>${escapeHtml(item.serialNo)} · ${escapeHtml(item.phone)}</small>
          </td>

          <td>
            <strong>${escapeHtml(item.doctorName)}</strong>
            <small>${escapeHtml(item.department)}</small>
          </td>

          <td>
            <strong>${escapeHtml(item.serviceName)}</strong>
            <small>${escapeHtml(item.visitType)}</small>
          </td>

          <td>
            <strong>${escapeHtml(formatDisplayDate(item.date))}</strong>
            <small>${escapeHtml(item.time)}</small>
          </td>

          <td class="center">
            <span class="status ${statusClass(item.status)}">
              ${escapeHtml(item.status)}
            </span>
          </td>

          <td>${escapeHtml(item.note || "No note")}</td>
        </tr>
      `,
      )
      .join("");

    const printWindow = window.open("", "_blank", "width=1200,height=800");

    if (!printWindow) {
      notify("Please allow popup to print appointment sheet", "error");
      return;
    }

    printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Update Clinic Diagnostic Center - Appointment Sheet</title>

        <style>
          @page {
            size: A4 landscape;
            margin: 8mm;
          }

          * {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            padding: 0;
            background: #ffffff;
            color: #0f172a;
            font-family: Arial, "Noto Sans Bengali", "SolaimanLipi", sans-serif;
          }

          .sheet {
            width: 100%;
          }

          .top-header {
            display: grid;
            grid-template-columns: 78px 1fr 260px;
            gap: 14px;
            align-items: center;
            border: 1px solid #b6c7bd;
            border-bottom: 0;
            padding: 12px 14px;
            background: linear-gradient(135deg, #ecfdf5 0%, #f8fafc 58%, #eefcf5 100%);
          }

          .logo-box {
            width: 68px;
            height: 68px;
            border: 2px solid #0f766e;
            border-radius: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #ffffff;
            overflow: hidden;
            padding: 6px;
            box-shadow: 0 8px 18px rgba(15, 118, 110, 0.12);
          }

          .logo-box img {
            width: 100%;
            height: 100%;
            object-fit: contain;
            display: block;
          }

          .clinic-title h1 {
            margin: 0;
            font-size: 24px;
            line-height: 1.15;
            font-weight: 900;
            letter-spacing: 0.07em;
            text-transform: uppercase;
            color: #064e3b;
          }

          .clinic-title .subtitle {
            margin: 5px 0 0;
            font-size: 12px;
            font-weight: 900;
            color: #0f766e;
          }

          .clinic-title .location {
            margin: 6px 0 0;
            font-size: 10.5px;
            line-height: 1.5;
            font-weight: 700;
            color: #475569;
          }

          .report-meta {
            text-align: right;
            border-left: 1px dashed #94a3b8;
            padding-left: 12px;
            font-size: 10.5px;
            line-height: 1.6;
            color: #334155;
          }

          .report-meta div {
            white-space: nowrap;
          }

          .report-meta strong {
            display: inline;
            font-size: 10.5px;
            font-weight: 900;
            color: #0f172a;
          }

          .report-title {
            border-left: 1px solid #b6c7bd;
            border-right: 1px solid #b6c7bd;
            background: #0f766e;
            color: #ffffff;
            padding: 8px 14px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
          }

          .report-title h2 {
            margin: 0;
            font-size: 14px;
            font-weight: 900;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            color: #ffffff;
          }

          .report-title p {
            margin: 0;
            font-size: 10px;
            font-weight: 800;
            color: #dffcf5;
          }

          .summary {
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            border-left: 1px solid #b6c7bd;
            border-right: 1px solid #b6c7bd;
            border-bottom: 1px solid #b6c7bd;
            background: #f8fafc;
          }

          .summary-item {
            padding: 8px 10px;
            border-right: 1px solid #dbe4df;
          }

          .summary-item:last-child {
            border-right: 0;
          }

          .summary-item span {
            display: block;
            font-size: 9.5px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            color: #64748b;
          }

          .summary-item strong {
            display: block;
            margin-top: 3px;
            font-size: 16px;
            font-weight: 900;
            color: #0f172a;
          }

          .filter-row {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
            border-left: 1px solid #b6c7bd;
            border-right: 1px solid #b6c7bd;
            padding: 8px 10px;
            background: #ffffff;
          }

          .filter-pill {
            border: 1px solid #cbd5e1;
            border-radius: 999px;
            padding: 4px 8px;
            font-size: 9.5px;
            font-weight: 800;
            color: #334155;
            background: #f8fafc;
          }

          .filter-pill b {
            color: #0f766e;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            table-layout: fixed;
            border-left: 1px solid #94a3b8;
            border-right: 1px solid #94a3b8;
            border-bottom: 1px solid #94a3b8;
          }

          thead {
            display: table-header-group;
          }

          thead th {
            background: #bbf7d0;
            color: #052e16;
            border: 1px solid #94a3b8;
            padding: 7px 6px;
            font-size: 10px;
            line-height: 1.2;
            text-align: left;
            text-transform: uppercase;
            letter-spacing: 0.08em;
          }

          tbody td {
            border: 1px solid #cbd5e1;
            padding: 7px 6px;
            font-size: 10.5px;
            line-height: 1.35;
            vertical-align: top;
            word-break: break-word;
          }

          tbody tr:nth-child(even) {
            background: #f8fafc;
          }

          tbody tr:nth-child(odd) {
            background: #ffffff;
          }

          tr {
            page-break-inside: avoid;
          }

          strong {
            display: block;
            font-size: 11px;
            font-weight: 900;
            color: #0f172a;
          }

          small {
            display: block;
            margin-top: 3px;
            font-size: 9.3px;
            font-weight: 700;
            color: #64748b;
          }

          .center {
            text-align: center;
          }

          .serial-cell {
            font-weight: 900;
            color: #0f766e;
          }

          .status {
            display: inline-block;
            min-width: 74px;
            border-radius: 999px;
            padding: 4px 7px;
            font-size: 9.3px;
            font-weight: 900;
            text-align: center;
            border: 1px solid transparent;
          }

          .confirmed {
            background: #ccfbf1;
            color: #0f766e;
            border-color: #99f6e4;
          }

          .pending {
            background: #fef3c7;
            color: #b45309;
            border-color: #fde68a;
          }

          .completed {
            background: #dbeafe;
            color: #1d4ed8;
            border-color: #bfdbfe;
          }

          .cancelled {
            background: #fee2e2;
            color: #dc2626;
            border-color: #fecaca;
          }

          .footer {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 12px;
            border: 1px solid #b6c7bd;
            border-top: 0;
            padding: 10px 12px;
            background: #f8fafc;
            font-size: 10px;
            font-weight: 800;
            color: #475569;
          }

          .footer .center-footer {
            text-align: center;
          }

          .footer .right-footer {
            text-align: right;
          }

          @media print {
            body {
              print-color-adjust: exact;
              -webkit-print-color-adjust: exact;
            }

            .sheet {
              page-break-after: auto;
            }
          }
        </style>
      </head>

      <body>
        <div class="sheet">
          <div class="top-header">
            <div class="logo-box">
              <img src="/update.png" alt="Update Clinic Logo" />
            </div>

            <div class="clinic-title">
              <h1>Update Clinic Diagnostic Center</h1>
              <p class="subtitle">Appointment Management Report</p>
              <p class="location">
                Location: Rangpur Sadar, Rangpur, Bangladesh · Phone: 01700-000000 · Email: updateclinic@example.com
              </p>
            </div>

            <div class="report-meta">
              <div><strong>Report:</strong> Appointment Sheet</div>
              <div><strong>Total:</strong> ${filteredAppointments.length} Appointments</div>
              <div><strong>Generated:</strong> ${escapeHtml(generatedAt)}</div>
              <div><strong>Printed By:</strong> Admin Panel</div>
            </div>
          </div>

          <div class="report-title">
            <h2>Printable Appointment Sheet</h2>
            <p>A4 landscape · Excel style · Filtered result</p>
          </div>

          <div class="summary">
            <div class="summary-item">
              <span>Total</span>
              <strong>${filteredAppointments.length}</strong>
            </div>

            <div class="summary-item">
              <span>Confirmed</span>
              <strong>${confirmedCount}</strong>
            </div>

            <div class="summary-item">
              <span>Pending</span>
              <strong>${pendingCount}</strong>
            </div>

            <div class="summary-item">
              <span>Completed</span>
              <strong>${completedCount}</strong>
            </div>

            <div class="summary-item">
              <span>Cancelled</span>
              <strong>${cancelledCount}</strong>
            </div>
          </div>

          <div class="filter-row">
            <span class="filter-pill"><b>Date:</b> ${escapeHtml(activeDateFilter)}</span>
            <span class="filter-pill"><b>Status:</b> ${escapeHtml(statusFilter)}</span>
            <span class="filter-pill"><b>Doctor:</b> ${escapeHtml(doctorFilter)}</span>
            <span class="filter-pill"><b>Department:</b> ${escapeHtml(departmentFilter)}</span>
            <span class="filter-pill"><b>Service:</b> ${escapeHtml(serviceFilter)}</span>
            <span class="filter-pill"><b>Visit Type:</b> ${escapeHtml(visitTypeFilter)}</span>
          </div>

          <table>
            <thead>
              <tr>
                <th style="width: 38px; text-align: center;">SL</th>
                <th style="width: 18%;">Patient</th>
                <th style="width: 18%;">Doctor</th>
                <th style="width: 20%;">Service</th>
                <th style="width: 14%;">Date & Slot</th>
                <th style="width: 10%; text-align: center;">Status</th>
                <th style="width: 20%;">Note</th>
              </tr>
            </thead>

            <tbody>
              ${rows}
            </tbody>
          </table>

          <div class="footer">
            <span>Prepared by Appointment Admin Panel</span>
            <span class="center-footer">Update Clinic Diagnostic Center</span>
            <span class="right-footer">Signature: __________________</span>
          </div>
        </div>

        <script>
          window.onload = function () {
            window.focus();
            window.print();
          };
        </script>
      </body>
    </html>
  `);

    printWindow.document.close();
    notify("Beautiful appointment sheet print opened", "success");
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

        <div className="grid gap-2 sm:flex sm:items-center">
          <button
            type="button"
            onClick={printFilteredAppointments}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-black text-emerald-700 shadow-sm transition hover:border-emerald-300 hover:bg-emerald-100 active:scale-[0.99]"
          >
            <Printer className="h-4 w-4" />
            Print Sheet
          </button>

          <button
            type="button"
            onClick={openAdd}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-black text-white shadow-sm transition hover:bg-teal-700 active:scale-[0.99]"
          >
            <Plus className="h-4 w-4" />
            Add Appointment
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
