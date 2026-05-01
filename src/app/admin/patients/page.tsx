"use client";

import Link from "next/link";
import { useMemo, useState, type FormEvent } from "react";
import {
  ArrowLeft,
  CalendarCheck,
  CheckCircle2,
  Clock3,
  Eye,
  FileText,
  MapPin,
  Pencil,
  Plus,
  RotateCcw,
  Save,
  Search,
  Trash2,
  UploadCloud,
  UserRound,
  X,
} from "lucide-react";

/* =========================================================
   1. TYPES + DEFAULT DATA
   ========================================================= */

type ShowDuration = "24h" | "1d" | "7d" | "until_changed";

type UserType = "Patient" | "General User";

type PatientStatus = "Pending" | "Confirmed" | "Visited" | "Cancelled";

type ReportDelivery = "Clinic Pickup" | "Email" | "WhatsApp" | "Courier";

type CustomFieldType = "input" | "checkbox" | "popup";

type FormSectionKey =
  | "userType"
  | "basic"
  | "appointment"
  | "medical"
  | "diagnostic"
  | "address"
  | "emergency"
  | "payment"
  | "extra"
  | "report"
  | "consent"
  | "generalInquiry";

type PatientFormSettings = {
  badge: string;
  title: string;
  description: string;
  isVisible: boolean;
  showDuration: ShowDuration;
};

type DoctorOption = {
  id: string;
  name: string;
  department: string;
  timeSlots: string[];
};

type CustomField = {
  id: string;
  label: string;
  placeholder: string;
  fieldType: CustomFieldType;
  options: string[];
  isVisible: boolean;
};

type PatientRecord = {
  id: string;
  serialNo: string;
  userType: UserType;

  fullName: string;
  age: string;
  gender: string;
  phone: string;
  email: string;

  doctorId: string;
  doctorName: string;
  department: string;
  date: string;
  timeSlot: string;
  serialType: string;

  symptoms: string;
  medicalHistory: string;
  currentMedication: string;
  allergies: string;
  tests: string[];

  address: string;
  district: string;
  upazila: string;

  emergencyName: string;
  emergencyRelation: string;
  emergencyPhone: string;

  paymentMethod: string;
  transactionId: string;

  onlineConsultation: boolean;
  homeService: boolean;
  reportDelivery: ReportDelivery;

  consentConfirmed: boolean;
  privacyAccepted: boolean;

  inquirySubject: string;
  inquiryMessage: string;

  customAnswers: Record<string, string>;

  status: PatientStatus;
  createdAt: string;
};

type PatientForm = Omit<PatientRecord, "id" | "serialNo" | "createdAt">;

const showDurationOptions: { label: string; value: ShowDuration }[] = [
  { label: "24 Hour", value: "24h" },
  { label: "1 Day", value: "1d" },
  { label: "7 Days", value: "7d" },
  { label: "Until Changed", value: "until_changed" },
];

const doctors: DoctorOption[] = [
  {
    id: "dr-1",
    name: "ডা. সাদিয়া রহমান",
    department: "হৃদরোগ",
    timeSlots: ["৪টা - ৫টা", "৫টা - ৬টা", "৬টা - ৮টা"],
  },
  {
    id: "dr-2",
    name: "ডা. মাহমুদুল করিম",
    department: "মেডিসিন",
    timeSlots: ["১০টা - ১১টা", "১১টা - ১২টা", "১২টা - ১টা"],
  },
  {
    id: "dr-3",
    name: "ডা. সুমাইয়া জাহান",
    department: "গাইনি",
    timeSlots: ["৩টা - ৪টা", "৪টা - ৫টা", "৫টা - ৭টা"],
  },
];

const defaultFormSettings: PatientFormSettings = {
  badge: "APPOINTMENT & INQUIRY FORM",
  title: "সিরিয়াল ও যোগাযোগ ফর্ম",
  description:
    "আপনার প্রয়োজন অনুযায়ী Patient অথবা General Inquiry সিলেক্ট করুন। প্রয়োজনীয় তথ্য পূরণ করে appointment submit করুন।",
  isVisible: true,
  showDuration: "until_changed",
};

const defaultSectionVisibility: Record<FormSectionKey, boolean> = {
  userType: true,
  basic: true,
  appointment: true,
  medical: true,
  diagnostic: true,
  address: true,
  emergency: true,
  payment: true,
  extra: true,
  report: true,
  consent: true,
  generalInquiry: true,
};

const formSectionLabels: {
  key: FormSectionKey;
  title: string;
  note: string;
}[] = [
  {
    key: "userType",
    title: "ব্যবহারকারীর ধরন নির্বাচন করুন",
    note: "Patient / General User",
  },
  {
    key: "basic",
    title: "Patient Basic Information",
    note: "Name, age, phone, email",
  },
  {
    key: "appointment",
    title: "Appointment / Serial Information",
    note: "Doctor, date, slot",
  },
  {
    key: "medical",
    title: "Medical Information",
    note: "Symptoms, history",
  },
  {
    key: "diagnostic",
    title: "Diagnostic / Test Section",
    note: "MRI, CT Scan, X-Ray",
  },
  {
    key: "address",
    title: "Address Information",
    note: "Address, district, upazila",
  },
  {
    key: "emergency",
    title: "Emergency Contact",
    note: "Emergency person",
  },
  {
    key: "payment",
    title: "Payment Information",
    note: "Optional payment",
  },
  {
    key: "extra",
    title: "Extra Options",
    note: "Online, home service",
  },
  {
    key: "report",
    title: "Report Delivery Method",
    note: "Pickup, email, WhatsApp",
  },
  {
    key: "consent",
    title: "Consent Section",
    note: "Confirm, policy, terms",
  },
  {
    key: "generalInquiry",
    title: "General Inquiry Information",
    note: "Subject, message",
  },
];

const diagnosticOptions = [
  "MRI",
  "CT Scan",
  "X-Ray",
  "ECG",
  "Ultrasound",
  "Blood Test / Pathology",
];

const serialTypeOptions = ["Regular Serial", "Emergency Serial", "Follow-up"];

const paymentOptions = ["Cash", "bKash", "Nagad", "Rocket", "Card"];

const reportDeliveryOptions: ReportDelivery[] = [
  "Clinic Pickup",
  "Email",
  "WhatsApp",
  "Courier",
];

const customFieldTypeOptions: {
  label: string;
  value: CustomFieldType;
  note: string;
}[] = [
  {
    label: "Input",
    value: "input",
    note: "Normal text field",
  },
  {
    label: "Checkbox",
    value: "checkbox",
    note: "Multiple choices",
  },
  {
    label: "Popup",
    value: "popup",
    note: "Popup selection",
  },
];

const firstDoctor = doctors[0];

const emptyPatientForm: PatientForm = {
  userType: "Patient",

  fullName: "",
  age: "",
  gender: "",
  phone: "",
  email: "",

  doctorId: firstDoctor.id,
  doctorName: firstDoctor.name,
  department: firstDoctor.department,
  date: "",
  timeSlot: firstDoctor.timeSlots[0],
  serialType: "Regular Serial",

  symptoms: "",
  medicalHistory: "",
  currentMedication: "",
  allergies: "",
  tests: [],

  address: "",
  district: "",
  upazila: "",

  emergencyName: "",
  emergencyRelation: "",
  emergencyPhone: "",

  paymentMethod: "Cash",
  transactionId: "",

  onlineConsultation: false,
  homeService: false,
  reportDelivery: "Clinic Pickup",

  consentConfirmed: false,
  privacyAccepted: false,

  inquirySubject: "",
  inquiryMessage: "",

  customAnswers: {},

  status: "Pending",
};

const initialPatients: PatientRecord[] = [
  {
    id: "1",
    serialNo: "SL-001",
    ...emptyPatientForm,
    fullName: "মোঃ করিম উদ্দিন",
    age: "42",
    gender: "Male",
    phone: "01700000001",
    email: "karim@example.com",
    doctorId: "dr-1",
    doctorName: "ডা. সাদিয়া রহমান",
    department: "হৃদরোগ",
    date: "2026-05-01",
    timeSlot: "৪টা - ৫টা",
    symptoms: "বুকে ব্যথা, শ্বাসকষ্ট",
    tests: ["ECG", "Blood Test / Pathology"],
    address: "রংপুর সদর",
    district: "রংপুর",
    upazila: "সদর",
    emergencyName: "রহিম",
    emergencyRelation: "ভাই",
    emergencyPhone: "01800000001",
    reportDelivery: "WhatsApp",
    consentConfirmed: true,
    privacyAccepted: true,
    status: "Confirmed",
    createdAt: "2026-05-01",
  },
  {
    id: "2",
    serialNo: "SL-002",
    ...emptyPatientForm,
    fullName: "সাবিনা ইয়াসমিন",
    age: "31",
    gender: "Female",
    phone: "01700000002",
    doctorId: "dr-3",
    doctorName: "ডা. সুমাইয়া জাহান",
    department: "গাইনি",
    date: "2026-05-01",
    timeSlot: "৩টা - ৪টা",
    symptoms: "Regular checkup",
    status: "Pending",
    createdAt: "2026-05-01",
  },
];

const initialCustomFields: CustomField[] = [
  {
    id: "cf-1",
    label: "Referral Source",
    placeholder: "Facebook / Doctor reference / Walk-in",
    fieldType: "input",
    options: [],
    isVisible: true,
  },
];

/* =========================================================
   2. SMALL UI COMPONENTS
   ========================================================= */

function getDurationLabel(value: ShowDuration) {
  return (
    showDurationOptions.find((option) => option.value === value)?.label ||
    "Until Changed"
  );
}

function getInitials(name: string) {
  const words = name.trim().split(" ").filter(Boolean);

  if (!words.length) return "PT";

  return words
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
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

function StatusBadge({ status }: { status: PatientStatus }) {
  const style =
    status === "Confirmed"
      ? "bg-teal-50 text-teal-700"
      : status === "Visited"
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

function PreviewInput({ placeholder }: { placeholder: string }) {
  return (
    <input
      disabled
      placeholder={placeholder}
      className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-500"
    />
  );
}

function getCustomFieldTypeLabel(type: CustomFieldType) {
  return (
    customFieldTypeOptions.find((option) => option.value === type)?.label ||
    "Input"
  );
}

function getCustomAnswerOptions(answer: string) {
  if (!answer) return [];

  return answer
    .split("||")
    .map((option) => option.trim())
    .filter(Boolean);
}

function createCustomAnswer(options: string[]) {
  return options.join("||");
}

function PreviewCustomField({ field }: { field: CustomField }) {
  if (field.fieldType === "checkbox") {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-3">
        <p className="text-xs font-black text-slate-700">{field.label}</p>
        <div className="mt-2 space-y-1.5">
          {field.options.map((option) => (
            <label
              key={option}
              className="flex items-center gap-2 text-xs font-bold text-slate-600"
            >
              <input disabled type="checkbox" />
              {option}
            </label>
          ))}
        </div>
      </div>
    );
  }

  if (field.fieldType === "popup") {
    return (
      <button
        disabled
        type="button"
        className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-left text-xs font-bold text-slate-500"
      >
        {field.label} · {field.options.length} options
      </button>
    );
  }

  return <PreviewInput placeholder={field.placeholder} />;
}

/* =========================================================
   3. MAIN PATIENT PANEL
   ========================================================= */

export default function PatientAdminPage() {
  const [formSettings, setFormSettings] = useState(defaultFormSettings);
  const [formSettingsDraft, setFormSettingsDraft] =
    useState(defaultFormSettings);

  const [sectionVisibility, setSectionVisibility] = useState(
    defaultSectionVisibility,
  );

  const [customFields, setCustomFields] = useState(initialCustomFields);
  const [isCustomFieldModalOpen, setIsCustomFieldModalOpen] = useState(false);
  const [customFieldLabel, setCustomFieldLabel] = useState("");
  const [customFieldPlaceholder, setCustomFieldPlaceholder] = useState("");
  const [customFieldType, setCustomFieldType] =
    useState<CustomFieldType>("input");
  const [customFieldOptionInput, setCustomFieldOptionInput] = useState("");
  const [customFieldOptions, setCustomFieldOptions] = useState<string[]>([]);

  const [patients, setPatients] = useState<PatientRecord[]>(initialPatients);
  const [patientForm, setPatientForm] = useState<PatientForm>(emptyPatientForm);

  const [editingPatientId, setEditingPatientId] = useState<string | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<PatientRecord | null>(
    null,
  );

  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [activeCustomPopupFieldId, setActiveCustomPopupFieldId] = useState<
    string | null
  >(null);
  const [customPopupDraft, setCustomPopupDraft] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<PatientStatus | "All">(
    "All",
  );
  const [doctorFilter, setDoctorFilter] = useState("All");

  const [toast, setToast] = useState("Ready to manage patient panel");

  const today = new Date().toISOString().slice(0, 10);

  const todaySerials = patients.filter((patient) => patient.date === today);
  const pendingSerials = patients.filter(
    (patient) => patient.status === "Pending",
  );
  const confirmedSerials = patients.filter(
    (patient) => patient.status === "Confirmed",
  );

  const visibleCustomFields = customFields.filter((field) => field.isVisible);
  const activeCustomPopupField = visibleCustomFields.find(
    (field) => field.id === activeCustomPopupFieldId,
  );

  const filteredPatients = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return patients.filter((patient) => {
      const searchMatched =
        keyword.length === 0 ||
        patient.fullName.toLowerCase().includes(keyword) ||
        patient.phone.toLowerCase().includes(keyword) ||
        patient.serialNo.toLowerCase().includes(keyword) ||
        patient.doctorName.toLowerCase().includes(keyword) ||
        patient.department.toLowerCase().includes(keyword);

      const statusMatched =
        statusFilter === "All" || patient.status === statusFilter;

      const doctorMatched =
        doctorFilter === "All" || patient.doctorId === doctorFilter;

      return searchMatched && statusMatched && doctorMatched;
    });
  }, [doctorFilter, patients, search, statusFilter]);

  const selectedDoctorSlots =
    doctors.find((doctor) => doctor.id === patientForm.doctorId)?.timeSlots ||
    [];

  function showToast(message: string) {
    setToast(message);
  }

  function updatePatientForm<K extends keyof PatientForm>(
    key: K,
    value: PatientForm[K],
  ) {
    setPatientForm((previous) => ({
      ...previous,
      [key]: value,
    }));
  }

  function handleDoctorChange(doctorId: string) {
    const doctor = doctors.find((item) => item.id === doctorId);

    if (!doctor) return;

    setPatientForm((previous) => ({
      ...previous,
      doctorId: doctor.id,
      doctorName: doctor.name,
      department: doctor.department,
      timeSlot: doctor.timeSlots[0] || "",
    }));
  }

  function uploadFormSettings() {
    setFormSettings(formSettingsDraft);
    showToast("Patient form uploaded successfully");
  }

  function resetFormSettings() {
    setFormSettings(defaultFormSettings);
    setFormSettingsDraft(defaultFormSettings);
    setSectionVisibility(defaultSectionVisibility);
    showToast("Patient form settings reset successfully");
  }

  function toggleFormSection(key: FormSectionKey) {
    setSectionVisibility((previous) => ({
      ...previous,
      [key]: !previous[key],
    }));

    showToast("Form section visibility updated");
  }

  function openCustomFieldModal() {
    setCustomFieldLabel("");
    setCustomFieldPlaceholder("");
    setCustomFieldType("input");
    setCustomFieldOptionInput("");
    setCustomFieldOptions([]);
    setIsCustomFieldModalOpen(true);
    showToast("Custom field form opened");
  }

  function closeCustomFieldModal() {
    setCustomFieldLabel("");
    setCustomFieldPlaceholder("");
    setCustomFieldType("input");
    setCustomFieldOptionInput("");
    setCustomFieldOptions([]);
    setIsCustomFieldModalOpen(false);
    showToast("Custom field action cancelled");
  }

  function resetCustomFieldForm() {
    setCustomFieldLabel("");
    setCustomFieldPlaceholder("");
    setCustomFieldType("input");
    setCustomFieldOptionInput("");
    setCustomFieldOptions([]);
    showToast("Custom field form reset");
  }

  function addCustomFieldOption() {
    const option = customFieldOptionInput.trim();

    if (!option) {
      showToast("Option text required");
      return;
    }

    if (customFieldOptions.includes(option)) {
      showToast("This option already exists");
      return;
    }

    setCustomFieldOptions((previous) => [...previous, option]);
    setCustomFieldOptionInput("");
    showToast(`${option} option added`);
  }

  function deleteCustomFieldOption(option: string) {
    setCustomFieldOptions((previous) =>
      previous.filter((item) => item !== option),
    );
    showToast(`${option} option removed`);
  }

  function addCustomField(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const label = customFieldLabel.trim();

    if (!label) {
      showToast("Custom field label required");
      return;
    }

    if (customFieldType !== "input" && customFieldOptions.length === 0) {
      showToast("Checkbox/Popup field needs at least one option");
      return;
    }

    const newField: CustomField = {
      id: `cf-${Date.now()}`,
      label,
      placeholder: customFieldPlaceholder.trim() || label,
      fieldType: customFieldType,
      options: customFieldType === "input" ? [] : customFieldOptions,
      isVisible: true,
    };

    setCustomFields((previous) => [...previous, newField]);
    setPatientForm((previous) => ({
      ...previous,
      customAnswers: {
        ...previous.customAnswers,
        [newField.id]: "",
      },
    }));

    setCustomFieldLabel("");
    setCustomFieldPlaceholder("");
    setCustomFieldType("input");
    setCustomFieldOptionInput("");
    setCustomFieldOptions([]);
    setIsCustomFieldModalOpen(false);
    showToast(`${label} ${getCustomFieldTypeLabel(customFieldType)} field saved`);
  }

  function toggleCustomField(id: string) {
    setCustomFields((previous) =>
      previous.map((field) =>
        field.id === id
          ? {
              ...field,
              isVisible: !field.isVisible,
            }
          : field,
      ),
    );

    showToast("Custom field visibility updated");
  }

  function deleteCustomField(id: string) {
    const field = customFields.find((item) => item.id === id);

    const confirmDelete = window.confirm(
      `${field?.label || "এই field"} delete করবেন?`,
    );

    if (!confirmDelete) {
      showToast("Custom field delete cancelled");
      return;
    }

    setCustomFields((previous) => previous.filter((field) => field.id !== id));
    setPatientForm((previous) => {
      const customAnswers = { ...previous.customAnswers };

      delete customAnswers[id];

      return {
        ...previous,
        customAnswers,
      };
    });
    showToast("Custom field deleted successfully");
  }

  function updateCustomAnswer(fieldId: string, value: string) {
    setPatientForm((previous) => ({
      ...previous,
      customAnswers: {
        ...previous.customAnswers,
        [fieldId]: value,
      },
    }));
  }

  function toggleCustomAnswerOption(fieldId: string, option: string) {
    setPatientForm((previous) => {
      const selectedOptions = getCustomAnswerOptions(
        previous.customAnswers[fieldId] || "",
      );
      const nextOptions = selectedOptions.includes(option)
        ? selectedOptions.filter((item) => item !== option)
        : [...selectedOptions, option];

      return {
        ...previous,
        customAnswers: {
          ...previous.customAnswers,
          [fieldId]: createCustomAnswer(nextOptions),
        },
      };
    });
  }

  function openCustomPopup(fieldId: string) {
    setActiveCustomPopupFieldId(fieldId);
    setCustomPopupDraft(patientForm.customAnswers[fieldId] || "");
    showToast("Custom field popup opened");
  }

  function closeCustomPopup() {
    setActiveCustomPopupFieldId(null);
    setCustomPopupDraft("");
    showToast("Custom field popup closed");
  }

  function openAddPatientModal() {
    setEditingPatientId(null);
    setPatientForm(emptyPatientForm);
    setIsPatientModalOpen(true);
    showToast("Patient form opened");
  }

  function openEditPatientModal(patient: PatientRecord) {
    setEditingPatientId(patient.id);
    setPatientForm({
      userType: patient.userType,
      fullName: patient.fullName,
      age: patient.age,
      gender: patient.gender,
      phone: patient.phone,
      email: patient.email,
      doctorId: patient.doctorId,
      doctorName: patient.doctorName,
      department: patient.department,
      date: patient.date,
      timeSlot: patient.timeSlot,
      serialType: patient.serialType,
      symptoms: patient.symptoms,
      medicalHistory: patient.medicalHistory,
      currentMedication: patient.currentMedication,
      allergies: patient.allergies,
      tests: patient.tests,
      address: patient.address,
      district: patient.district,
      upazila: patient.upazila,
      emergencyName: patient.emergencyName,
      emergencyRelation: patient.emergencyRelation,
      emergencyPhone: patient.emergencyPhone,
      paymentMethod: patient.paymentMethod,
      transactionId: patient.transactionId,
      onlineConsultation: patient.onlineConsultation,
      homeService: patient.homeService,
      reportDelivery: patient.reportDelivery,
      consentConfirmed: patient.consentConfirmed,
      privacyAccepted: patient.privacyAccepted,
      inquirySubject: patient.inquirySubject,
      inquiryMessage: patient.inquiryMessage,
      customAnswers: patient.customAnswers,
      status: patient.status,
    });

    setIsPatientModalOpen(true);
    showToast(`${patient.fullName} edit mode opened`);
  }

  function closePatientModal() {
    setEditingPatientId(null);
    setPatientForm(emptyPatientForm);
    setIsPatientModalOpen(false);
    setActiveCustomPopupFieldId(null);
    setCustomPopupDraft("");
    showToast("Action cancelled");
  }

  function savePatient(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!patientForm.fullName.trim()) {
      showToast("Patient name required");
      return;
    }

    if (!patientForm.phone.trim()) {
      showToast("Phone number required");
      return;
    }

    if (patientForm.userType === "Patient" && !patientForm.date.trim()) {
      showToast("Appointment date required");
      return;
    }

    if (
      patientForm.userType === "Patient" &&
      sectionVisibility.consent &&
      (!patientForm.consentConfirmed || !patientForm.privacyAccepted)
    ) {
      showToast("Consent and Privacy Policy required");
      return;
    }

    if (
      patientForm.userType === "General User" &&
      !patientForm.inquirySubject.trim()
    ) {
      showToast("Inquiry subject required");
      return;
    }

    if (editingPatientId) {
      setPatients((previous) =>
        previous.map((patient) =>
          patient.id === editingPatientId
            ? {
                ...patient,
                ...patientForm,
              }
            : patient,
        ),
      );

      setEditingPatientId(null);
      setPatientForm(emptyPatientForm);
      setIsPatientModalOpen(false);
      showToast("Patient serial updated successfully");
      return;
    }

    const serialNo = `SL-${String(patients.length + 1).padStart(3, "0")}`;

    const newPatient: PatientRecord = {
      id: Date.now().toString(),
      serialNo,
      ...patientForm,
      createdAt: today,
    };

    setPatients((previous) => [newPatient, ...previous]);
    setPatientForm(emptyPatientForm);
    setIsPatientModalOpen(false);
    showToast(`${serialNo} serial created successfully`);
  }

  function deletePatient(id: string) {
    const patient = patients.find((item) => item.id === id);

    const confirmDelete = window.confirm(
      `${patient?.fullName || "এই patient"} delete করবেন?`,
    );

    if (!confirmDelete) {
      showToast("Delete cancelled");
      return;
    }

    setPatients((previous) => previous.filter((patient) => patient.id !== id));
    showToast("Patient deleted successfully");
  }

  function updatePatientStatus(id: string, status: PatientStatus) {
    setPatients((previous) =>
      previous.map((patient) =>
        patient.id === id
          ? {
              ...patient,
              status,
            }
          : patient,
      ),
    );

    showToast(`Patient status changed to ${status}`);
  }

  function openPatientDetails(patient: PatientRecord) {
    setSelectedPatient(patient);
    setIsDetailsModalOpen(true);
    showToast(`${patient.serialNo} details opened`);
  }

  function closePatientDetails() {
    setSelectedPatient(null);
    setIsDetailsModalOpen(false);
    showToast("Details closed");
  }

  function toggleTest(test: string) {
    setPatientForm((previous) => {
      const exists = previous.tests.includes(test);

      return {
        ...previous,
        tests: exists
          ? previous.tests.filter((item) => item !== test)
          : [...previous.tests, test],
      };
    });
  }

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
          onClick={openAddPatientModal}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-black text-white shadow-sm transition hover:bg-teal-700"
        >
          <Plus className="h-4 w-4" />
          Add Patient / Serial
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
              <UserRound className="h-3.5 w-3.5" />
              Patient Panel Control
            </div>

            <h1 className="mt-3 text-2xl font-black text-slate-950">
              Patients & Serial Admin
            </h1>

            <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600">
              Patient form section control, serial create/edit/delete, doctor
              wise appointment list এবং patient information manage করুন।
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-2xl bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 sm:hidden">
            <CheckCircle2 className="h-4 w-4 text-teal-600" />
            {toast}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 xl:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 p-3">
            <p className="text-xs font-bold text-slate-500">Total Serial</p>
            <p className="text-2xl font-black text-slate-950">
              {patients.length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 p-3">
            <p className="text-xs font-bold text-slate-500">Today</p>
            <p className="text-2xl font-black text-slate-950">
              {todaySerials.length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 p-3">
            <p className="text-xs font-bold text-slate-500">Pending</p>
            <p className="text-2xl font-black text-slate-950">
              {pendingSerials.length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 p-3">
            <p className="text-xs font-bold text-slate-500">Confirmed</p>
            <p className="text-2xl font-black text-slate-950">
              {confirmedSerials.length}
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-[380px_1fr]">
        {/* =====================================================
            LEFT SIDE: FORM CONTROL
           ===================================================== */}

        <div className="space-y-4">
          <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-base font-black text-slate-950">
              Patient Form Control
            </h2>
            <p className="mt-1 text-xs font-medium text-slate-500">
              Public patient form title, visibility and duration control.
            </p>

            <div className="mt-4 space-y-3">
              <TextInput
                label="Small Badge"
                value={formSettingsDraft.badge}
                onChange={(value) =>
                  setFormSettingsDraft((previous) => ({
                    ...previous,
                    badge: value,
                  }))
                }
              />

              <TextInput
                label="Form Title"
                value={formSettingsDraft.title}
                onChange={(value) =>
                  setFormSettingsDraft((previous) => ({
                    ...previous,
                    title: value,
                  }))
                }
              />

              <TextAreaInput
                label="Description"
                value={formSettingsDraft.description}
                onChange={(value) =>
                  setFormSettingsDraft((previous) => ({
                    ...previous,
                    description: value,
                  }))
                }
              />

              <ToggleSwitch
                checked={formSettingsDraft.isVisible}
                onChange={() =>
                  setFormSettingsDraft((previous) => ({
                    ...previous,
                    isVisible: !previous.isVisible,
                  }))
                }
                label="Form Visibility"
                activeText="Show"
                inactiveText="Hide"
              />

              <label className="block">
                <span className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">
                  Show Duration
                </span>
                <select
                  value={formSettingsDraft.showDuration}
                  onChange={(event) =>
                    setFormSettingsDraft((previous) => ({
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
                onClick={uploadFormSettings}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-black text-white transition hover:bg-teal-700"
              >
                <UploadCloud className="h-4 w-4" />
                Upload
              </button>

              <button
                type="button"
                onClick={resetFormSettings}
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
                  Form Section Control
                </h2>
                <p className="mt-1 text-xs font-medium text-slate-500">
                  কোন section public form-এ show হবে control করুন।
                </p>
              </div>

              <button
                type="button"
                onClick={openCustomFieldModal}
                className="inline-flex items-center gap-1.5 rounded-xl bg-slate-950 px-3 py-2 text-xs font-black text-white transition hover:bg-teal-700"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Field
              </button>
            </div>

            <div className="mt-4 space-y-2">
              {formSectionLabels.map((section) => (
                <ToggleSwitch
                  key={section.key}
                  checked={sectionVisibility[section.key]}
                  onChange={() => toggleFormSection(section.key)}
                  label={section.title}
                  activeText={section.note}
                  inactiveText="Hidden"
                />
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-base font-black text-slate-950">
              Custom Fields
            </h2>
            <p className="mt-1 text-xs font-medium text-slate-500">
              Form-এ extra field add / hide / delete করা যাবে।
            </p>

            <div className="mt-4 space-y-2">
              {customFields.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 p-5 text-center text-sm font-bold text-slate-500">
                  কোনো custom field নেই
                </div>
              ) : (
                customFields.map((field) => (
                  <div
                    key={field.id}
                    className="rounded-2xl border border-slate-200 p-3"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-black text-slate-950">
                          {field.label}
                        </p>
                        <p className="truncate text-xs text-slate-500">
                          {field.placeholder}
                        </p>
                        <p className="mt-1 w-fit rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.12em] text-slate-500">
                          {getCustomFieldTypeLabel(field.fieldType)}
                        </p>
                        {field.options.length ? (
                          <p className="mt-1 truncate text-xs text-slate-500">
                            Options: {field.options.join(", ")}
                          </p>
                        ) : null}
                      </div>

                      <button
                        type="button"
                        onClick={() => deleteCustomField(field.id)}
                        className="rounded-xl border border-red-100 p-2 text-red-600 transition hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="mt-3">
                      <ToggleSwitch
                        checked={field.isVisible}
                        onChange={() => toggleCustomField(field.id)}
                        label="Field Visibility"
                        activeText="Show"
                        inactiveText="Hide"
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        {/* =====================================================
            RIGHT SIDE: PATIENT LIST + FORM PREVIEW
           ===================================================== */}

        <div className="space-y-4">
          <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-base font-black text-slate-950">
                  Serial & Patient List
                </h2>
                <p className="mt-1 text-xs font-medium text-slate-500">
                  কার serial, কোন doctor, কোন date/time — সব এখান থেকে দেখুন।
                </p>
              </div>

              <div className="grid gap-2 sm:grid-cols-3 lg:w-[650px]">
                <label className="relative block sm:col-span-1">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search..."
                    className="h-10 w-full rounded-xl border border-slate-200 pl-10 pr-3 text-sm outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
                  />
                </label>

                <select
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(event.target.value as PatientStatus | "All")
                  }
                  className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700 outline-none focus:border-teal-500"
                >
                  <option value="All">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Visited">Visited</option>
                  <option value="Cancelled">Cancelled</option>
                </select>

                <select
                  value={doctorFilter}
                  onChange={(event) => setDoctorFilter(event.target.value)}
                  className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700 outline-none focus:border-teal-500"
                >
                  <option value="All">All Doctors</option>
                  {doctors.map((doctor) => (
                    <option key={doctor.id} value={doctor.id}>
                      {doctor.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
              <div className="hidden grid-cols-[0.8fr_1.4fr_1.4fr_1fr_1fr_1.1fr] gap-3 bg-slate-50 px-4 py-3 text-xs font-black uppercase tracking-[0.12em] text-slate-500 xl:grid">
                <span>Serial</span>
                <span>Patient</span>
                <span>Doctor / Inquiry</span>
                <span>Date/Time</span>
                <span>Status</span>
                <span className="text-right">Action</span>
              </div>

              <div className="divide-y divide-slate-100">
                {filteredPatients.length === 0 ? (
                  <div className="p-8 text-center">
                    <p className="font-bold text-slate-700">
                      কোনো patient পাওয়া যায়নি
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Search/filter change করুন অথবা নতুন serial add করুন।
                    </p>
                  </div>
                ) : (
                  filteredPatients.map((patient) => (
                    <div
                      key={patient.id}
                      className="grid gap-3 p-4 transition hover:bg-slate-50 xl:grid-cols-[0.8fr_1.4fr_1.4fr_1fr_1fr_1.1fr] xl:items-center"
                    >
                      <div>
                        <p className="text-sm font-black text-slate-950">
                          {patient.serialNo}
                        </p>
                        <p className="text-xs text-slate-500">
                          {patient.userType}
                        </p>
                      </div>

                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-xs font-black text-white">
                          {getInitials(patient.fullName)}
                        </div>

                        <div className="min-w-0">
                          <h3 className="truncate text-sm font-black text-slate-950">
                            {patient.fullName}
                          </h3>
                          <p className="truncate text-xs text-slate-500">
                            {patient.phone}
                          </p>
                        </div>
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-teal-700">
                          {patient.userType === "Patient"
                            ? patient.doctorName
                            : patient.inquirySubject || "General Inquiry"}
                        </p>
                        <p className="truncate text-xs text-slate-500">
                          {patient.userType === "Patient"
                            ? patient.department
                            : patient.inquiryMessage || "No message"}
                        </p>
                      </div>

                      <div className="text-xs text-slate-600">
                        <p className="font-bold text-slate-800">
                          {patient.date || "No date"}
                        </p>
                        <p className="mt-1 flex items-center gap-1">
                          <Clock3 className="h-3.5 w-3.5 text-teal-600" />
                          {patient.timeSlot || "No slot"}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <StatusBadge status={patient.status} />
                        <select
                          value={patient.status}
                          onChange={(event) =>
                            updatePatientStatus(
                              patient.id,
                              event.target.value as PatientStatus,
                            )
                          }
                          className="h-8 w-full rounded-lg border border-slate-200 bg-white px-2 text-xs font-bold outline-none focus:border-teal-500"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Visited">Visited</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-3 gap-2 xl:flex xl:justify-end">
                        <button
                          type="button"
                          onClick={() => openPatientDetails(patient)}
                          className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-xs font-black text-slate-700 transition hover:bg-white"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          View
                        </button>

                        <button
                          type="button"
                          onClick={() => openEditPatientModal(patient)}
                          className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-xs font-black text-slate-700 transition hover:bg-white"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => deletePatient(patient.id)}
                          className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-red-100 px-3 py-2 text-xs font-black text-red-600 transition hover:bg-red-50"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Del
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>

          {/* =====================================================
              PUBLIC FORM PREVIEW
             ===================================================== */}

          <section className="rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
            <div className="rounded-3xl bg-white p-5">
              <div className="text-center">
                <p className="mx-auto w-fit rounded-full border border-teal-100 bg-teal-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-teal-700">
                  {formSettings.badge}
                </p>

                <h2 className="mt-3 text-2xl font-black text-slate-950">
                  {formSettings.title}
                </h2>

                <p className="mx-auto mt-2 max-w-2xl text-sm leading-7 text-slate-600">
                  {formSettings.description}
                </p>

                <div className="mt-3 flex justify-center">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-black ${
                      formSettings.isVisible
                        ? "bg-teal-50 text-teal-700"
                        : "bg-red-50 text-red-600"
                    }`}
                  >
                    {formSettings.isVisible ? "Form Show" : "Form Hidden"} ·{" "}
                    {getDurationLabel(formSettings.showDuration)}
                  </span>
                </div>
              </div>

              {!formSettings.isVisible ? (
                <div className="mt-5 rounded-2xl border border-dashed border-red-200 bg-red-50/40 p-6 text-center">
                  <p className="font-bold text-red-600">
                    Patient form website এ hidden আছে
                  </p>
                </div>
              ) : (
                <div className="mt-5 space-y-4">
                  {sectionVisibility.userType ? (
                    <div className="rounded-2xl border border-slate-200 p-4">
                      <p className="text-sm font-black text-slate-950">
                        ব্যবহারকারীর ধরন নির্বাচন করুন
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        ফর্ম পূরণের আগে নিচের যেকোনো একটি অপশন নির্বাচন করুন
                      </p>

                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        <div className="rounded-2xl border border-teal-200 bg-teal-50 p-4">
                          <p className="text-sm font-black text-teal-700">
                            Patient
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            সিরিয়াল, চিকিৎসা ও টেস্টের জন্য
                          </p>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-4">
                          <p className="text-sm font-black text-slate-700">
                            General User
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            সাধারণ যোগাযোগ ও inquiry
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : null}

                  {sectionVisibility.basic ? (
                    <div className="rounded-2xl border border-slate-200 p-4">
                      <p className="text-sm font-black text-slate-950">
                        Patient Basic Information
                      </p>
                      <div className="mt-3 grid gap-3 md:grid-cols-3">
                        <PreviewInput placeholder="Full Name" />
                        <PreviewInput placeholder="Age" />
                        <PreviewInput placeholder="Gender" />
                        <PreviewInput placeholder="Phone Number" />
                        <PreviewInput placeholder="Email optional" />
                      </div>
                    </div>
                  ) : null}

                  {sectionVisibility.appointment ? (
                    <div className="rounded-2xl border border-slate-200 p-4">
                      <p className="text-sm font-black text-slate-950">
                        Appointment / Serial Information
                      </p>
                      <div className="mt-3 grid gap-3 md:grid-cols-3">
                        <PreviewInput placeholder="Select Doctor" />
                        <PreviewInput placeholder="Department" />
                        <PreviewInput placeholder="Date" />
                        <PreviewInput placeholder="Time Slot" />
                        <PreviewInput placeholder="Serial Type" />
                      </div>
                    </div>
                  ) : null}

                  {sectionVisibility.medical ? (
                    <div className="rounded-2xl border border-slate-200 p-4">
                      <p className="text-sm font-black text-slate-950">
                        Medical Information
                      </p>
                      <div className="mt-3 grid gap-3 md:grid-cols-4">
                        <PreviewInput placeholder="Problem / Symptoms" />
                        <PreviewInput placeholder="Medical History" />
                        <PreviewInput placeholder="Current Medication" />
                        <PreviewInput placeholder="Allergies" />
                      </div>
                    </div>
                  ) : null}

                  {sectionVisibility.diagnostic ? (
                    <div className="rounded-2xl border border-slate-200 p-4">
                      <p className="text-sm font-black text-slate-950">
                        Diagnostic / Test Section
                      </p>
                      <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                        {diagnosticOptions.map((test) => (
                          <label
                            key={test}
                            className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700"
                          >
                            <input disabled type="checkbox" />
                            {test}
                          </label>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {sectionVisibility.address ? (
                    <div className="rounded-2xl border border-slate-200 p-4">
                      <p className="text-sm font-black text-slate-950">
                        Address Information
                      </p>
                      <div className="mt-3 grid gap-3 md:grid-cols-3">
                        <PreviewInput placeholder="Full Address" />
                        <PreviewInput placeholder="District" />
                        <PreviewInput placeholder="Upazila" />
                      </div>
                    </div>
                  ) : null}

                  {sectionVisibility.emergency ? (
                    <div className="rounded-2xl border border-slate-200 p-4">
                      <p className="text-sm font-black text-slate-950">
                        Emergency Contact
                      </p>
                      <div className="mt-3 grid gap-3 md:grid-cols-3">
                        <PreviewInput placeholder="Emergency Contact Name" />
                        <PreviewInput placeholder="Relation" />
                        <PreviewInput placeholder="Phone Number" />
                      </div>
                    </div>
                  ) : null}

                  {sectionVisibility.payment ? (
                    <div className="rounded-2xl border border-slate-200 p-4">
                      <p className="text-sm font-black text-slate-950">
                        Payment Information Optional
                      </p>
                      <div className="mt-3 grid gap-3 md:grid-cols-2">
                        <PreviewInput placeholder="Payment Method" />
                        <PreviewInput placeholder="Transaction ID" />
                      </div>
                    </div>
                  ) : null}

                  {sectionVisibility.extra ? (
                    <div className="rounded-2xl border border-slate-200 p-4">
                      <p className="text-sm font-black text-slate-950">
                        Extra Options
                      </p>
                      <div className="mt-3 grid gap-2 sm:grid-cols-2">
                        <label className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700">
                          <input disabled type="checkbox" />
                          Online Consultation
                        </label>

                        <label className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700">
                          <input disabled type="checkbox" />
                          Home Service
                        </label>
                      </div>
                    </div>
                  ) : null}

                  {sectionVisibility.report ? (
                    <div className="rounded-2xl border border-slate-200 p-4">
                      <p className="text-sm font-black text-slate-950">
                        Report Delivery Method
                      </p>
                      <div className="mt-3 grid gap-3 md:grid-cols-2">
                        <PreviewInput placeholder="Clinic Pickup / Email / WhatsApp" />
                      </div>
                    </div>
                  ) : null}

                  {sectionVisibility.consent ? (
                    <div className="rounded-2xl border border-slate-200 p-4">
                      <p className="text-sm font-black text-slate-950">
                        Consent Section
                      </p>
                      <div className="mt-3 space-y-2">
                        <label className="flex items-start gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700">
                          <input disabled type="checkbox" />
                          আমি নিশ্চিত করছি যে প্রদত্ত তথ্য সঠিক ও সম্পূর্ণ।
                        </label>

                        <label className="flex items-start gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700">
                          <input disabled type="checkbox" />
                          আমি Privacy Policy ও Terms গ্রহণ করছি।
                        </label>
                      </div>
                    </div>
                  ) : null}

                  {sectionVisibility.generalInquiry ? (
                    <div className="rounded-2xl border border-slate-200 p-4">
                      <p className="text-sm font-black text-slate-950">
                        General Inquiry Information
                      </p>
                      <div className="mt-3 grid gap-3 md:grid-cols-2">
                        <PreviewInput placeholder="Inquiry Subject" />
                        <PreviewInput placeholder="Phone / Email" />
                        <textarea
                          disabled
                          placeholder="Inquiry Message"
                          rows={3}
                          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-500 md:col-span-2"
                        />
                      </div>
                    </div>
                  ) : null}

                  {visibleCustomFields.length ? (
                    <div className="rounded-2xl border border-slate-200 p-4">
                      <p className="text-sm font-black text-slate-950">
                        Custom Fields
                      </p>
                      <div className="mt-3 grid gap-3 md:grid-cols-2">
                        {visibleCustomFields.map((field) => (
                          <PreviewCustomField key={field.id} field={field} />
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      {/* =====================================================
          CUSTOM FIELD ADD MODAL
         ===================================================== */}

      {isCustomFieldModalOpen ? (
        <div
          onClick={closeCustomFieldModal}
          className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 p-3 sm:items-center"
        >
          <div
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-md rounded-3xl bg-white shadow-2xl"
          >
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 p-4">
              <div>
                <h2 className="text-xl font-black text-slate-950">
                  Add Custom Field
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Form-এ নতুন extra input field add করুন।
                </p>
              </div>

              <button
                type="button"
                onClick={closeCustomFieldModal}
                className="rounded-full border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50 hover:text-slate-950"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={addCustomField} className="space-y-4 p-4">
              <TextInput
                label="Field Label"
                value={customFieldLabel}
                placeholder="যেমন: Patient Note"
                onChange={setCustomFieldLabel}
              />

              <TextInput
                label="Placeholder"
                value={customFieldPlaceholder}
                placeholder="যেমন: Extra note লিখুন"
                onChange={setCustomFieldPlaceholder}
              />

              <div>
                <p className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">
                  Field Type
                </p>
                <div className="mt-2 grid gap-2 sm:grid-cols-3">
                  {customFieldTypeOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        setCustomFieldType(option.value);
                        if (option.value === "input") {
                          setCustomFieldOptionInput("");
                          setCustomFieldOptions([]);
                        }
                        showToast(`${option.label} field type selected`);
                      }}
                      className={`rounded-2xl border px-3 py-3 text-left transition ${
                        customFieldType === option.value
                          ? "border-teal-600 bg-teal-50 text-teal-800"
                          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <span className="block text-sm font-black">
                        {option.label}
                      </span>
                      <span className="mt-1 block text-xs font-medium">
                        {option.note}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {customFieldType !== "input" ? (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                  <p className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">
                    {customFieldType === "checkbox"
                      ? "Checkbox Options"
                      : "Popup Selection Options"}
                  </p>

                  <div className="mt-2 flex gap-2">
                    <input
                      value={customFieldOptionInput}
                      onChange={(event) =>
                        setCustomFieldOptionInput(event.target.value)
                      }
                      placeholder="Option name লিখুন"
                      className="h-10 min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
                    />

                    <button
                      type="button"
                      onClick={addCustomFieldOption}
                      className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl bg-slate-950 px-3 text-xs font-black text-white transition hover:bg-teal-700"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Add
                    </button>
                  </div>

                  <div className="mt-3 space-y-2">
                    {customFieldOptions.length === 0 ? (
                      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-3 text-center text-xs font-bold text-slate-500">
                        Option add করলে save করা যাবে।
                      </div>
                    ) : (
                      customFieldOptions.map((option) => (
                        <div
                          key={option}
                          className="flex items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2"
                        >
                          <span className="min-w-0 truncate text-sm font-bold text-slate-700">
                            {option}
                          </span>

                          <button
                            type="button"
                            onClick={() => deleteCustomFieldOption(option)}
                            className="rounded-lg p-1 text-red-600 transition hover:bg-red-50"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ) : null}

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={closeCustomFieldModal}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-50"
                >
                  <X className="h-4 w-4" />
                  Discard
                </button>

                <button
                  type="button"
                  onClick={resetCustomFieldForm}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-50"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-3 text-sm font-black text-white transition hover:bg-teal-700"
                >
                  <Save className="h-4 w-4" />
                  Save Field
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {/* =====================================================
          ADD / EDIT PATIENT MODAL
         ===================================================== */}

      {isPatientModalOpen ? (
        <div
          onClick={closePatientModal}
          className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 p-3 sm:items-center"
        >
          <div
            onClick={(event) => event.stopPropagation()}
            className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-3xl bg-white shadow-2xl"
          >
            <div className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b border-slate-100 bg-white p-4">
              <div>
                <h2 className="text-xl font-black text-slate-950">
                  {editingPatientId
                    ? "Edit Patient Serial"
                    : "Add Patient / Inquiry"}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Save করলে serial list update হবে।
                </p>
              </div>

              <button
                type="button"
                onClick={closePatientModal}
                className="rounded-full border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50 hover:text-slate-950"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={savePatient} className="space-y-4 p-4">
              {sectionVisibility.userType ? (
                <div className="rounded-2xl border border-slate-200 p-4">
                  <h3 className="text-sm font-black text-slate-950">
                    ব্যবহারকারীর ধরন নির্বাচন করুন
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    ফর্ম পূরণের আগে নিচের যেকোনো একটি অপশন নির্বাচন করুন
                  </p>

                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => updatePatientForm("userType", "Patient")}
                      className={`rounded-2xl border p-4 text-left ${
                        patientForm.userType === "Patient"
                          ? "border-teal-500 bg-teal-50"
                          : "border-slate-200 bg-white"
                      }`}
                    >
                      <p className="font-black text-slate-950">Patient</p>
                      <p className="mt-1 text-xs text-slate-500">
                        সিরিয়াল, চিকিৎসা ও টেস্টের জন্য
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        updatePatientForm("userType", "General User")
                      }
                      className={`rounded-2xl border p-4 text-left ${
                        patientForm.userType === "General User"
                          ? "border-teal-500 bg-teal-50"
                          : "border-slate-200 bg-white"
                      }`}
                    >
                      <p className="font-black text-slate-950">General User</p>
                      <p className="mt-1 text-xs text-slate-500">
                        সাধারণ যোগাযোগ ও inquiry
                      </p>
                    </button>
                  </div>
                </div>
              ) : null}

              {sectionVisibility.basic ? (
                <div className="rounded-2xl border border-slate-200 p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <UserRound className="h-4 w-4 text-teal-600" />
                    <h3 className="text-sm font-black text-slate-950">
                      Patient Basic Information
                    </h3>
                  </div>

                  <div className="grid gap-3 md:grid-cols-3">
                    <TextInput
                      label="Full Name"
                      value={patientForm.fullName}
                      placeholder="Patient full name"
                      onChange={(value) => updatePatientForm("fullName", value)}
                    />

                    <TextInput
                      label="Age"
                      value={patientForm.age}
                      placeholder="Age"
                      onChange={(value) => updatePatientForm("age", value)}
                    />

                    <label className="block">
                      <span className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">
                        Gender
                      </span>
                      <select
                        value={patientForm.gender}
                        onChange={(event) =>
                          updatePatientForm("gender", event.target.value)
                        }
                        className="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold outline-none focus:border-teal-500"
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </label>

                    <TextInput
                      label="Phone"
                      value={patientForm.phone}
                      placeholder="Phone number"
                      onChange={(value) => updatePatientForm("phone", value)}
                    />

                    <TextInput
                      label="Email optional"
                      value={patientForm.email}
                      placeholder="Email"
                      onChange={(value) => updatePatientForm("email", value)}
                    />
                  </div>
                </div>
              ) : null}

              {patientForm.userType === "Patient" ? (
                <>
                  {sectionVisibility.appointment ? (
                    <div className="rounded-2xl border border-slate-200 p-4">
                      <div className="mb-3 flex items-center gap-2">
                        <CalendarCheck className="h-4 w-4 text-teal-600" />
                        <h3 className="text-sm font-black text-slate-950">
                          Appointment / Serial Information
                        </h3>
                      </div>

                      <div className="grid gap-3 md:grid-cols-3">
                        <label className="block">
                          <span className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">
                            Select Doctor
                          </span>
                          <select
                            value={patientForm.doctorId}
                            onChange={(event) =>
                              handleDoctorChange(event.target.value)
                            }
                            className="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold outline-none focus:border-teal-500"
                          >
                            {doctors.map((doctor) => (
                              <option key={doctor.id} value={doctor.id}>
                                {doctor.name}
                              </option>
                            ))}
                          </select>
                        </label>

                        <TextInput
                          label="Department"
                          value={patientForm.department}
                          onChange={(value) =>
                            updatePatientForm("department", value)
                          }
                        />

                        <TextInput
                          label="Date"
                          type="date"
                          value={patientForm.date}
                          onChange={(value) => updatePatientForm("date", value)}
                        />

                        <label className="block">
                          <span className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">
                            Time Slot
                          </span>
                          <select
                            value={patientForm.timeSlot}
                            onChange={(event) =>
                              updatePatientForm("timeSlot", event.target.value)
                            }
                            className="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold outline-none focus:border-teal-500"
                          >
                            {selectedDoctorSlots.map((slot) => (
                              <option key={slot} value={slot}>
                                {slot}
                              </option>
                            ))}
                          </select>
                        </label>

                        <label className="block">
                          <span className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">
                            Serial Type
                          </span>
                          <select
                            value={patientForm.serialType}
                            onChange={(event) =>
                              updatePatientForm(
                                "serialType",
                                event.target.value,
                              )
                            }
                            className="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold outline-none focus:border-teal-500"
                          >
                            {serialTypeOptions.map((type) => (
                              <option key={type} value={type}>
                                {type}
                              </option>
                            ))}
                          </select>
                        </label>

                        <label className="block">
                          <span className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">
                            Status
                          </span>
                          <select
                            value={patientForm.status}
                            onChange={(event) =>
                              updatePatientForm(
                                "status",
                                event.target.value as PatientStatus,
                              )
                            }
                            className="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold outline-none focus:border-teal-500"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Visited">Visited</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </label>
                      </div>
                    </div>
                  ) : null}

                  {sectionVisibility.medical ? (
                    <div className="rounded-2xl border border-slate-200 p-4">
                      <div className="mb-3 flex items-center gap-2">
                        <FileText className="h-4 w-4 text-teal-600" />
                        <h3 className="text-sm font-black text-slate-950">
                          Medical Information
                        </h3>
                      </div>

                      <div className="grid gap-3 md:grid-cols-2">
                        <TextAreaInput
                          label="Problem / Symptoms"
                          value={patientForm.symptoms}
                          placeholder="Problem / symptoms"
                          onChange={(value) =>
                            updatePatientForm("symptoms", value)
                          }
                        />

                        <TextAreaInput
                          label="Medical History"
                          value={patientForm.medicalHistory}
                          placeholder="Medical history"
                          onChange={(value) =>
                            updatePatientForm("medicalHistory", value)
                          }
                        />

                        <TextInput
                          label="Current Medication"
                          value={patientForm.currentMedication}
                          placeholder="Current medication"
                          onChange={(value) =>
                            updatePatientForm("currentMedication", value)
                          }
                        />

                        <TextInput
                          label="Allergies"
                          value={patientForm.allergies}
                          placeholder="Allergies"
                          onChange={(value) =>
                            updatePatientForm("allergies", value)
                          }
                        />
                      </div>
                    </div>
                  ) : null}

                  {sectionVisibility.diagnostic ? (
                    <div className="rounded-2xl border border-slate-200 p-4">
                      <h3 className="text-sm font-black text-slate-950">
                        Diagnostic / Test Section
                      </h3>

                      <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                        {diagnosticOptions.map((test) => (
                          <label
                            key={test}
                            className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-bold text-slate-700"
                          >
                            <input
                              type="checkbox"
                              checked={patientForm.tests.includes(test)}
                              onChange={() => toggleTest(test)}
                              className="h-4 w-4 accent-teal-600"
                            />
                            {test}
                          </label>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </>
              ) : null}

              {patientForm.userType === "General User" &&
              sectionVisibility.generalInquiry ? (
                <div className="rounded-2xl border border-slate-200 p-4">
                  <h3 className="text-sm font-black text-slate-950">
                    General Inquiry Information
                  </h3>

                  <div className="mt-3 grid gap-3 md:grid-cols-2">
                    <TextInput
                      label="Inquiry Subject"
                      value={patientForm.inquirySubject}
                      placeholder="Inquiry subject"
                      onChange={(value) =>
                        updatePatientForm("inquirySubject", value)
                      }
                    />

                    <TextInput
                      label="Contact Email optional"
                      value={patientForm.email}
                      placeholder="Email"
                      onChange={(value) => updatePatientForm("email", value)}
                    />

                    <div className="md:col-span-2">
                      <TextAreaInput
                        label="Inquiry Message"
                        value={patientForm.inquiryMessage}
                        placeholder="আপনার inquiry লিখুন"
                        onChange={(value) =>
                          updatePatientForm("inquiryMessage", value)
                        }
                      />
                    </div>
                  </div>
                </div>
              ) : null}

              {sectionVisibility.address ? (
                <div className="rounded-2xl border border-slate-200 p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-teal-600" />
                    <h3 className="text-sm font-black text-slate-950">
                      Address Information
                    </h3>
                  </div>

                  <div className="grid gap-3 md:grid-cols-3">
                    <TextInput
                      label="Full Address"
                      value={patientForm.address}
                      placeholder="Full address"
                      onChange={(value) => updatePatientForm("address", value)}
                    />

                    <TextInput
                      label="District"
                      value={patientForm.district}
                      placeholder="District"
                      onChange={(value) => updatePatientForm("district", value)}
                    />

                    <TextInput
                      label="Upazila"
                      value={patientForm.upazila}
                      placeholder="Upazila"
                      onChange={(value) => updatePatientForm("upazila", value)}
                    />
                  </div>
                </div>
              ) : null}

              {patientForm.userType === "Patient" &&
              sectionVisibility.emergency ? (
                <div className="rounded-2xl border border-slate-200 p-4">
                  <h3 className="text-sm font-black text-slate-950">
                    Emergency Contact
                  </h3>

                  <div className="mt-3 grid gap-3 md:grid-cols-3">
                    <TextInput
                      label="Emergency Name"
                      value={patientForm.emergencyName}
                      placeholder="Emergency contact name"
                      onChange={(value) =>
                        updatePatientForm("emergencyName", value)
                      }
                    />

                    <TextInput
                      label="Relation"
                      value={patientForm.emergencyRelation}
                      placeholder="Relation"
                      onChange={(value) =>
                        updatePatientForm("emergencyRelation", value)
                      }
                    />

                    <TextInput
                      label="Emergency Phone"
                      value={patientForm.emergencyPhone}
                      placeholder="Phone number"
                      onChange={(value) =>
                        updatePatientForm("emergencyPhone", value)
                      }
                    />
                  </div>
                </div>
              ) : null}

              {patientForm.userType === "Patient" &&
              sectionVisibility.payment ? (
                <div className="rounded-2xl border border-slate-200 p-4">
                  <h3 className="text-sm font-black text-slate-950">
                    Payment Information Optional
                  </h3>

                  <div className="mt-3 grid gap-3 md:grid-cols-2">
                    <label className="block">
                      <span className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">
                        Payment Method
                      </span>
                      <select
                        value={patientForm.paymentMethod}
                        onChange={(event) =>
                          updatePatientForm("paymentMethod", event.target.value)
                        }
                        className="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold outline-none focus:border-teal-500"
                      >
                        {paymentOptions.map((method) => (
                          <option key={method} value={method}>
                            {method}
                          </option>
                        ))}
                      </select>
                    </label>

                    <TextInput
                      label="Transaction ID"
                      value={patientForm.transactionId}
                      placeholder="Transaction ID"
                      onChange={(value) =>
                        updatePatientForm("transactionId", value)
                      }
                    />
                  </div>
                </div>
              ) : null}

              {patientForm.userType === "Patient" && sectionVisibility.extra ? (
                <div className="rounded-2xl border border-slate-200 p-4">
                  <h3 className="text-sm font-black text-slate-950">
                    Extra Options
                  </h3>

                  <div className="mt-3 grid gap-3 md:grid-cols-2">
                    <ToggleSwitch
                      checked={patientForm.onlineConsultation}
                      onChange={() =>
                        updatePatientForm(
                          "onlineConsultation",
                          !patientForm.onlineConsultation,
                        )
                      }
                      label="Online Consultation"
                      activeText="Required"
                      inactiveText="Not Required"
                    />

                    <ToggleSwitch
                      checked={patientForm.homeService}
                      onChange={() =>
                        updatePatientForm(
                          "homeService",
                          !patientForm.homeService,
                        )
                      }
                      label="Home Service"
                      activeText="Required"
                      inactiveText="Not Required"
                    />
                  </div>
                </div>
              ) : null}

              {patientForm.userType === "Patient" &&
              sectionVisibility.report ? (
                <div className="rounded-2xl border border-slate-200 p-4">
                  <h3 className="text-sm font-black text-slate-950">
                    Report Delivery Method
                  </h3>

                  <div className="mt-3">
                    <label className="block">
                      <span className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">
                        Delivery Method
                      </span>
                      <select
                        value={patientForm.reportDelivery}
                        onChange={(event) =>
                          updatePatientForm(
                            "reportDelivery",
                            event.target.value as ReportDelivery,
                          )
                        }
                        className="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold outline-none focus:border-teal-500"
                      >
                        {reportDeliveryOptions.map((method) => (
                          <option key={method} value={method}>
                            {method}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                </div>
              ) : null}

              {visibleCustomFields.length ? (
                <div className="rounded-2xl border border-slate-200 p-4">
                  <h3 className="text-sm font-black text-slate-950">
                    Custom Fields
                  </h3>

                  <div className="mt-3 grid gap-3 md:grid-cols-2">
                    {visibleCustomFields.map((field) => {
                      if (field.fieldType === "checkbox") {
                        const selectedOptions = getCustomAnswerOptions(
                          patientForm.customAnswers[field.id] || "",
                        );

                        return (
                          <div
                            key={field.id}
                            className="rounded-xl border border-slate-200 bg-white px-3 py-3"
                          >
                            <p className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">
                              {field.label}
                            </p>
                            <p className="mt-1 text-xs font-medium text-slate-500">
                              {field.placeholder}
                            </p>

                            <div className="mt-3 space-y-2">
                              {field.options.map((option) => (
                                <label
                                  key={option}
                                  className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-bold text-slate-700"
                                >
                                  <input
                                    type="checkbox"
                                    checked={selectedOptions.includes(option)}
                                    onChange={() =>
                                      toggleCustomAnswerOption(field.id, option)
                                    }
                                    className="h-4 w-4 accent-teal-600"
                                  />
                                  {option}
                                </label>
                              ))}
                            </div>
                          </div>
                        );
                      }

                      if (field.fieldType === "popup") {
                        return (
                          <div
                            key={field.id}
                            className="rounded-xl border border-slate-200 bg-white px-3 py-3"
                          >
                            <p className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">
                              {field.label}
                            </p>
                            <button
                              type="button"
                              onClick={() => openCustomPopup(field.id)}
                              className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-black text-white transition hover:bg-teal-700"
                            >
                              <FileText className="h-4 w-4" />
                              {patientForm.customAnswers[field.id]
                                ? "Edit Popup"
                                : "Select Option"}
                            </button>
                            {patientForm.customAnswers[field.id] ? (
                              <p className="mt-2 line-clamp-2 text-xs text-slate-500">
                                {patientForm.customAnswers[field.id]}
                              </p>
                            ) : null}
                          </div>
                        );
                      }

                      return (
                        <TextInput
                          key={field.id}
                          label={field.label}
                          value={patientForm.customAnswers[field.id] || ""}
                          placeholder={field.placeholder}
                          onChange={(value) =>
                            updateCustomAnswer(field.id, value)
                          }
                        />
                      );
                    })}
                  </div>
                </div>
              ) : null}

              {patientForm.userType === "Patient" &&
              sectionVisibility.consent ? (
                <div className="rounded-2xl border border-slate-200 p-4">
                  <h3 className="text-sm font-black text-slate-950">
                    Consent Section
                  </h3>

                  <div className="mt-3 space-y-2">
                    <label className="flex items-start gap-2 rounded-xl border border-slate-200 px-3 py-3 text-sm font-bold text-slate-700">
                      <input
                        type="checkbox"
                        checked={patientForm.consentConfirmed}
                        onChange={(event) =>
                          updatePatientForm(
                            "consentConfirmed",
                            event.target.checked,
                          )
                        }
                        className="mt-0.5 h-4 w-4 accent-teal-600"
                      />
                      আমি নিশ্চিত করছি যে প্রদত্ত তথ্য সঠিক ও সম্পূর্ণ।
                    </label>

                    <label className="flex items-start gap-2 rounded-xl border border-slate-200 px-3 py-3 text-sm font-bold text-slate-700">
                      <input
                        type="checkbox"
                        checked={patientForm.privacyAccepted}
                        onChange={(event) =>
                          updatePatientForm(
                            "privacyAccepted",
                            event.target.checked,
                          )
                        }
                        className="mt-0.5 h-4 w-4 accent-teal-600"
                      />
                      আমি Privacy Policy ও Terms গ্রহণ করছি।
                    </label>
                  </div>
                </div>
              ) : null}

              <div className="sticky bottom-0 -mx-4 -mb-4 grid grid-cols-2 gap-2 border-t border-slate-100 bg-white p-4">
                <button
                  type="button"
                  onClick={closePatientModal}
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
                  {editingPatientId ? "Save Changes" : "Save Serial"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {isPatientModalOpen && activeCustomPopupField ? (
        <div
          onClick={closeCustomPopup}
          className="fixed inset-0 z-[60] flex items-end justify-center bg-slate-950/55 p-3 sm:items-center"
        >
          <div
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-lg rounded-3xl bg-white shadow-2xl"
          >
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 p-4">
              <div>
                <h2 className="text-xl font-black text-slate-950">
                  {activeCustomPopupField.label}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {activeCustomPopupField.placeholder}
                </p>
              </div>

              <button
                type="button"
                onClick={closeCustomPopup}
                className="rounded-full border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50 hover:text-slate-950"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 p-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">
                  Select Option
                </p>
                <div className="mt-3 space-y-2">
                  {activeCustomPopupField.options.map((option) => (
                    <label
                      key={option}
                      className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-3 text-sm font-bold transition ${
                        customPopupDraft === option
                          ? "border-teal-600 bg-teal-50 text-teal-800"
                          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="custom-popup-option"
                        checked={customPopupDraft === option}
                        onChange={() => setCustomPopupDraft(option)}
                        className="h-4 w-4 accent-teal-600"
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={closeCustomPopup}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-50"
                >
                  <X className="h-4 w-4" />
                  Discard
                </button>

                <button
                  type="button"
                  onClick={() => {
                    updateCustomAnswer(
                      activeCustomPopupField.id,
                      customPopupDraft,
                    );
                    setActiveCustomPopupFieldId(null);
                    setCustomPopupDraft("");
                    showToast("Popup answer saved");
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-3 text-sm font-black text-white transition hover:bg-teal-700"
                >
                  <Save className="h-4 w-4" />
                  Save Popup
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* =====================================================
          PATIENT DETAILS MODAL
         ===================================================== */}

      {isDetailsModalOpen && selectedPatient ? (
        <div
          onClick={closePatientDetails}
          className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 p-3 sm:items-center"
        >
          <div
            onClick={(event) => event.stopPropagation()}
            className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white shadow-2xl"
          >
            <div className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b border-slate-100 bg-white p-4">
              <div>
                <h2 className="text-xl font-black text-slate-950">
                  {selectedPatient.fullName}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {selectedPatient.serialNo} · {selectedPatient.userType}
                </p>
              </div>

              <button
                type="button"
                onClick={closePatientDetails}
                className="rounded-full border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50 hover:text-slate-950"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 p-4">
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-bold text-slate-500">Phone</p>
                  <p className="mt-1 font-black text-slate-950">
                    {selectedPatient.phone}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-bold text-slate-500">Date</p>
                  <p className="mt-1 font-black text-slate-950">
                    {selectedPatient.date || "No date"}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-bold text-slate-500">Status</p>
                  <div className="mt-1">
                    <StatusBadge status={selectedPatient.status} />
                  </div>
                </div>
              </div>

              {selectedPatient.userType === "Patient" ? (
                <>
                  <div className="rounded-2xl border border-slate-200 p-4">
                    <h3 className="font-black text-slate-950">Appointment</h3>
                    <p className="mt-2 text-sm leading-7 text-slate-600">
                      <b>Doctor:</b> {selectedPatient.doctorName}
                      <br />
                      <b>Department:</b> {selectedPatient.department}
                      <br />
                      <b>Time:</b> {selectedPatient.timeSlot}
                      <br />
                      <b>Serial Type:</b> {selectedPatient.serialType}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 p-4">
                    <h3 className="font-black text-slate-950">Medical Info</h3>
                    <p className="mt-2 text-sm leading-7 text-slate-600">
                      <b>Symptoms:</b> {selectedPatient.symptoms || "Not added"}
                      <br />
                      <b>History:</b>{" "}
                      {selectedPatient.medicalHistory || "Not added"}
                      <br />
                      <b>Medication:</b>{" "}
                      {selectedPatient.currentMedication || "Not added"}
                      <br />
                      <b>Allergies:</b>{" "}
                      {selectedPatient.allergies || "Not added"}
                      <br />
                      <b>Tests:</b>{" "}
                      {selectedPatient.tests.length
                        ? selectedPatient.tests.join(", ")
                        : "No test selected"}
                    </p>
                  </div>
                </>
              ) : (
                <div className="rounded-2xl border border-slate-200 p-4">
                  <h3 className="font-black text-slate-950">General Inquiry</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    <b>Subject:</b>{" "}
                    {selectedPatient.inquirySubject || "Not added"}
                    <br />
                    <b>Message:</b>{" "}
                    {selectedPatient.inquiryMessage || "Not added"}
                  </p>
                </div>
              )}

              <div className="rounded-2xl border border-slate-200 p-4">
                <h3 className="font-black text-slate-950">Address</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  <b>Address:</b> {selectedPatient.address || "Not added"}
                  <br />
                  <b>District:</b> {selectedPatient.district || "Not added"}
                  <br />
                  <b>Upazila:</b> {selectedPatient.upazila || "Not added"}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
