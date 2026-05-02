"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { ChangeEvent, PointerEvent as ReactPointerEvent } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  Bell,
  Camera,
  CheckCircle2,
  Clock,
  Eye,
  EyeOff,
  Link2,
  Move,
  Save,
  Settings,
  ShieldCheck,
  ToggleLeft,
  ToggleRight,
  UploadCloud,
  UserRound,
  X,
} from "lucide-react";

type DurationValue = "24h" | "7d" | "15d" | "30d" | "untilChanged";

type AccessControl = {
  id: string;
  title: string;
  group: string;
  description: string;
  enabled: boolean;
  disabledUntil: number | null;
  lastAction?: string;
};

type DesktopNotificationPermission =
  | "default"
  | "denied"
  | "granted"
  | "unsupported";

const STORAGE_KEY = "clinic_settings_admin_panel_v2";

const durationOptions: {
  value: DurationValue;
  label: string;
  helper: string;
}[] = [
  {
    value: "24h",
    label: "24 Hours",
    helper: "আগামী ২৪ ঘণ্টার জন্য disable থাকবে।",
  },
  {
    value: "7d",
    label: "7 Days",
    helper: "৭ দিনের জন্য website থেকে hide/disable থাকবে।",
  },
  {
    value: "15d",
    label: "15 Days",
    helper: "১৫ দিনের জন্য disable থাকবে।",
  },
  {
    value: "30d",
    label: "30 Days",
    helper: "৩০ দিনের জন্য disable থাকবে।",
  },
  {
    value: "untilChanged",
    label: "Until Changed",
    helper: "আপনি manually enable না করা পর্যন্ত disable থাকবে।",
  },
];

const defaultAccessControls: AccessControl[] = [
  {
    id: "hero-section",
    title: "Hero Section",
    group: "Homepage Sections",
    description: "Website homepage এর main hero/banner section show/hide করুন।",
    enabled: true,
    disabledUntil: null,
  },
  {
    id: "title-bar",
    title: "Title Bar",
    group: "Homepage Sections",
    description: "Public website এর top title bar visible থাকবে কি না।",
    enabled: true,
    disabledUntil: null,
  },
  {
    id: "our-services",
    title: "Our Services",
    group: "Homepage Sections",
    description:
      "Clinic service list এবং service cards website এ show/hide করুন।",
    enabled: true,
    disabledUntil: null,
  },
  {
    id: "clinic-process",
    title: "Clinic Process",
    group: "Homepage Sections",
    description: "Patient journey / clinic process section visible রাখুন।",
    enabled: true,
    disabledUntil: null,
  },
  {
    id: "contact-location",
    title: "Contact & Location",
    group: "Homepage Sections",
    description: "Phone, address, map এবং location info show/hide করুন।",
    enabled: true,
    disabledUntil: null,
  },
  {
    id: "appointment-inquiry",
    title: "Appointment & Inquiry Form",
    group: "Homepage Sections",
    description: "Patient appointment ও inquiry form active থাকবে কি না।",
    enabled: true,
    disabledUntil: null,
  },
  {
    id: "clinic-logo-update",
    title: "Update Clinic Logo",
    group: "Website Settings",
    description:
      "Clinic logo update option/page admin panel এ accessible থাকবে কি না।",
    enabled: true,
    disabledUntil: null,
  },
  {
    id: "nav-home",
    title: "হোম",
    group: "Main Navigation",
    description: "Navbar এর Home menu visible থাকবে কি না।",
    enabled: true,
    disabledUntil: null,
  },
  {
    id: "nav-about",
    title: "আমাদের সম্পর্কে",
    group: "Main Navigation",
    description: "About page/menu public website এ show/hide করুন।",
    enabled: true,
    disabledUntil: null,
  },
  {
    id: "nav-services",
    title: "সেবাসমূহ",
    group: "Main Navigation",
    description: "Services navigation item visible থাকবে কি না।",
    enabled: true,
    disabledUntil: null,
  },
  {
    id: "nav-doctors",
    title: "ডাক্তারবৃন্দ",
    group: "Main Navigation",
    description: "Doctor list page/menu website এ visible রাখুন।",
    enabled: true,
    disabledUntil: null,
  },
  {
    id: "nav-gallery",
    title: "গ্যালারি",
    group: "Main Navigation",
    description: "Gallery page/menu show/hide control করুন।",
    enabled: true,
    disabledUntil: null,
  },
  {
    id: "nav-contact",
    title: "যোগাযোগ",
    group: "Main Navigation",
    description: "Contact page/menu visible থাকবে কি না।",
    enabled: true,
    disabledUntil: null,
  },
  {
    id: "privacy-policy",
    title: "Privacy Policy",
    group: "প্রয়োজনীয় পেজ",
    description: "Privacy Policy page accessible থাকবে কি না।",
    enabled: true,
    disabledUntil: null,
  },
  {
    id: "terms-conditions",
    title: "Terms & Conditions",
    group: "প্রয়োজনীয় পেজ",
    description: "Terms & Conditions page visible/access enabled রাখুন।",
    enabled: true,
    disabledUntil: null,
  },
  {
    id: "faq",
    title: "FAQ",
    group: "প্রয়োজনীয় পেজ",
    description: "FAQ page public user দেখতে পারবে কি না।",
    enabled: true,
    disabledUntil: null,
  },
  {
    id: "support",
    title: "Support",
    group: "প্রয়োজনীয় পেজ",
    description: "Support page/menu accessible থাকবে কি না।",
    enabled: true,
    disabledUntil: null,
  },
];

function clampPosition(value: number) {
  return Math.min(100, Math.max(0, value));
}

function getDurationMs(value: DurationValue) {
  if (value === "24h") return 24 * 60 * 60 * 1000;
  if (value === "7d") return 7 * 24 * 60 * 60 * 1000;
  if (value === "15d") return 15 * 24 * 60 * 60 * 1000;
  if (value === "30d") return 30 * 24 * 60 * 60 * 1000;
  return null;
}

function getDurationLabel(value: DurationValue) {
  return durationOptions.find((item) => item.value === value)?.label ?? value;
}

function formatDateTime(timestamp: number) {
  return new Intl.DateTimeFormat("en-BD", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(timestamp));
}

function getTimeLeftLabel(disabledUntil: number | null, currentTime: number) {
  if (!disabledUntil) return "Until Changed";

  const diff = disabledUntil - currentTime;

  if (diff <= 0) return "Ending now";

  const day = 24 * 60 * 60 * 1000;
  const hour = 60 * 60 * 1000;
  const minute = 60 * 1000;

  const days = Math.floor(diff / day);
  const hours = Math.floor((diff % day) / hour);
  const minutes = Math.max(1, Math.floor((diff % hour) / minute));

  if (days > 0) return `${days}d ${hours}h left`;
  if (hours > 0) return `${hours}h ${minutes}m left`;
  return `${minutes}m left`;
}

export default function SettingsAdminPanel() {
  const [storageLoaded, setStorageLoaded] = useState(false);

  const [autoSave, setAutoSave] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [toast, setToast] = useState("Ready to manage settings");
  const [currentTime, setCurrentTime] = useState(Date.now());

  const [notificationPermission, setNotificationPermission] =
    useState<DesktopNotificationPermission>("default");

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const [profileName, setProfileName] = useState("Clinic Admin");
  const [profileRole, setProfileRole] = useState("Admin Manager");
  const [profilePhone, setProfilePhone] = useState("+880 1700-000000");
  const [profileEmail, setProfileEmail] = useState("admin@clinic.com");

  const [profileImage, setProfileImage] = useState<string>("");
  const [imageUrl, setImageUrl] = useState("");
  const [imagePosition, setImagePosition] = useState({ x: 50, y: 50 });
  const [isDraggingImage, setIsDraggingImage] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const lastPointerRef = useRef({ x: 0, y: 0 });

  const [accessControls, setAccessControls] = useState<AccessControl[]>(
    defaultAccessControls,
  );

  const [pendingDisableItem, setPendingDisableItem] =
    useState<AccessControl | null>(null);
  const [disableDuration, setDisableDuration] = useState<DurationValue>("24h");

  const enabledAccessCount = useMemo(() => {
    return accessControls.filter((item) => item.enabled).length;
  }, [accessControls]);

  const groupedAccessControls = useMemo(() => {
    return accessControls.reduce<Record<string, AccessControl[]>>(
      (groups, item) => {
        if (!groups[item.group]) groups[item.group] = [];
        groups[item.group].push(item);
        return groups;
      },
      {},
    );
  }, [accessControls]);

  function showToast(message: string) {
    setToast(message);

    if (
      typeof window !== "undefined" &&
      "Notification" in window &&
      Notification.permission === "granted"
    ) {
      new Notification("Clinic Admin Settings", {
        body: message,
      });
    }
  }

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!("Notification" in window)) {
      setNotificationPermission("unsupported");
      return;
    }

    setNotificationPermission(Notification.permission);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);

      if (saved) {
        const parsed = JSON.parse(saved);

        if (typeof parsed.autoSave === "boolean") {
          setAutoSave(parsed.autoSave);
        }

        if (typeof parsed.maintenanceMode === "boolean") {
          setMaintenanceMode(parsed.maintenanceMode);
        }

        if (typeof parsed.profileName === "string") {
          setProfileName(parsed.profileName);
        }

        if (typeof parsed.profileRole === "string") {
          setProfileRole(parsed.profileRole);
        }

        if (typeof parsed.profilePhone === "string") {
          setProfilePhone(parsed.profilePhone);
        }

        if (typeof parsed.profileEmail === "string") {
          setProfileEmail(parsed.profileEmail);
        }

        if (typeof parsed.profileImage === "string") {
          setProfileImage(parsed.profileImage);
        }

        if (typeof parsed.imageUrl === "string") {
          setImageUrl(parsed.imageUrl);
        }

        if (
          parsed.imagePosition &&
          typeof parsed.imagePosition.x === "number" &&
          typeof parsed.imagePosition.y === "number"
        ) {
          setImagePosition(parsed.imagePosition);
        }

        if (Array.isArray(parsed.accessControls)) {
          setAccessControls(parsed.accessControls);
        }
      }
    } catch {
      setToast("Saved settings could not be loaded");
    } finally {
      setStorageLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!storageLoaded || typeof window === "undefined") return;

    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          autoSave,
          maintenanceMode,
          profileName,
          profileRole,
          profilePhone,
          profileEmail,
          profileImage,
          imageUrl,
          imagePosition,
          accessControls,
        }),
      );
    } catch {
      // Large image files can exceed localStorage limit.
    }
  }, [
    storageLoaded,
    autoSave,
    maintenanceMode,
    profileName,
    profileRole,
    profilePhone,
    profileEmail,
    profileImage,
    imageUrl,
    imagePosition,
    accessControls,
  ]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentTime(Date.now());
    }, 30000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const expiredItems = accessControls.filter(
      (item) =>
        !item.enabled &&
        item.disabledUntil !== null &&
        item.disabledUntil <= currentTime,
    );

    if (expiredItems.length === 0) return;

    setAccessControls((previous) =>
      previous.map((item) => {
        if (
          !item.enabled &&
          item.disabledUntil !== null &&
          item.disabledUntil <= currentTime
        ) {
          return {
            ...item,
            enabled: true,
            disabledUntil: null,
            lastAction: "Automatically enabled after disable duration ended",
          };
        }

        return item;
      }),
    );

    showToast(`${expiredItems.length} access automatically enabled`);
  }, [currentTime, accessControls]);

  async function enableDesktopNotifications() {
    if (typeof window === "undefined" || !("Notification" in window)) {
      setNotificationPermission("unsupported");
      showToast("Desktop notification is not supported in this browser");
      return;
    }

    const permission = await Notification.requestPermission();
    setNotificationPermission(permission);

    if (permission === "granted") {
      showToast("Desktop notification enabled");
    } else {
      showToast("Desktop notification permission not allowed");
    }
  }

  function saveSettings() {
    showToast("Settings saved successfully");
  }

  function toggleAutoSave() {
    setAutoSave((previous) => {
      const next = !previous;
      showToast(next ? "Auto save enabled" : "Auto save disabled");
      return next;
    });
  }

  function toggleMaintenanceMode() {
    setMaintenanceMode((previous) => {
      const next = !previous;
      showToast(
        next ? "Maintenance mode enabled" : "Maintenance mode disabled",
      );
      return next;
    });
  }

  function requestDisableAccess(item: AccessControl) {
    setPendingDisableItem(item);
    setDisableDuration("24h");
    showToast(`Disable confirmation opened for ${item.title}`);
  }

  function cancelDisableAccess() {
    setPendingDisableItem(null);
    showToast("Disable action cancelled");
  }

  function confirmDisableAccess() {
    if (!pendingDisableItem) return;

    const durationMs = getDurationMs(disableDuration);
    const disabledUntil = durationMs ? Date.now() + durationMs : null;

    setAccessControls((previous) =>
      previous.map((item) =>
        item.id === pendingDisableItem.id
          ? {
              ...item,
              enabled: false,
              disabledUntil,
              lastAction: `Disabled for ${getDurationLabel(disableDuration)}`,
            }
          : item,
      ),
    );

    showToast(
      `${pendingDisableItem.title} disabled for ${getDurationLabel(
        disableDuration,
      )}`,
    );

    setPendingDisableItem(null);
  }

  function enableAccess(id: string) {
    const accessItem = accessControls.find((item) => item.id === id);

    setAccessControls((previous) =>
      previous.map((item) =>
        item.id === id
          ? {
              ...item,
              enabled: true,
              disabledUntil: null,
              lastAction: "Manually enabled",
            }
          : item,
      ),
    );

    if (accessItem) {
      showToast(`${accessItem.title} enabled successfully`);
    }
  }

  function handleAccessClick(item: AccessControl) {
    if (item.enabled) {
      requestDisableAccess(item);
      return;
    }

    enableAccess(item.id);
  }

  function openProfileModal() {
    setIsProfileModalOpen(true);
    showToast("Profile editor opened");
  }

  function closeProfileModal() {
    setIsProfileModalOpen(false);
    showToast("Profile editor closed");
  }

  function handleDeviceImageUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("Please upload a valid image file");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      showToast("Please upload an image under 2MB");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result;

      if (typeof result === "string") {
        setProfileImage(result);
        setImagePosition({ x: 50, y: 50 });
        showToast("Profile picture uploaded from device");
      }
    };

    reader.readAsDataURL(file);
  }

  function useImageFromUrl() {
    const cleanUrl = imageUrl.trim();

    if (!cleanUrl) {
      showToast("Please paste an image URL first");
      return;
    }

    setProfileImage(cleanUrl);
    setImagePosition({ x: 50, y: 50 });
    showToast("Profile picture added from URL");
  }

  function handleImagePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (!profileImage) return;

    setIsDraggingImage(true);
    lastPointerRef.current = {
      x: event.clientX,
      y: event.clientY,
    };

    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handleImagePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (!isDraggingImage || !profileImage) return;

    const deltaX = event.clientX - lastPointerRef.current.x;
    const deltaY = event.clientY - lastPointerRef.current.y;

    lastPointerRef.current = {
      x: event.clientX,
      y: event.clientY,
    };

    setImagePosition((previous) => ({
      x: clampPosition(previous.x + deltaX * 0.35),
      y: clampPosition(previous.y + deltaY * 0.35),
    }));
  }

  function handleImagePointerUp(event: ReactPointerEvent<HTMLDivElement>) {
    setIsDraggingImage(false);

    try {
      event.currentTarget.releasePointerCapture(event.pointerId);
    } catch {
      // pointer capture may already be released on some browsers
    }
  }

  function resetImagePosition() {
    setImagePosition({ x: 50, y: 50 });
    showToast("Profile picture position reset");
  }

  function removeProfileImage() {
    setProfileImage("");
    setImageUrl("");
    setImagePosition({ x: 50, y: 50 });
    showToast("Profile picture removed");
  }

  function saveProfile() {
    setIsProfileModalOpen(false);
    showToast("Profile updated successfully");
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

      <div className="fixed inset-x-4 bottom-4 z-40 flex items-center gap-2 rounded-2xl border border-teal-100 bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-lg shadow-slate-200/60 sm:hidden">
        <CheckCircle2 className="h-4 w-4 shrink-0 text-teal-600" />
        <span>{toast}</span>
      </div>

      <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1 text-xs font-black text-teal-700">
          <Settings className="h-3.5 w-3.5" />
          Settings
        </div>

        <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-950">Settings</h1>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600">
              Admin preferences, website access, page visibility এবং clinic
              configuration manage করুন।
            </p>
          </div>

          <div className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-3 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <div className="relative h-14 w-14 overflow-hidden rounded-full border-2 border-white bg-white shadow-sm">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="h-full w-full object-cover"
                    style={{
                      objectPosition: `${imagePosition.x}% ${imagePosition.y}%`,
                    }}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-teal-50 text-teal-700">
                    <UserRound className="h-7 w-7" />
                  </div>
                )}
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-black text-slate-950">
                  {profileName}
                </p>
                <p className="truncate text-xs font-bold text-slate-500">
                  {profileRole}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={openProfileModal}
              className="rounded-full bg-slate-950 px-4 py-2 text-xs font-black text-white transition hover:bg-slate-800"
            >
              Edit Profile
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-black text-slate-950">
                Panel Preferences
              </h2>
              <p className="mt-1 text-xs font-semibold text-slate-500">
                Admin panel behavior control করুন।
              </p>
            </div>
            <ShieldCheck className="h-5 w-5 text-teal-600" />
          </div>

          <div className="mt-4 space-y-3">
            <button
              type="button"
              onClick={toggleAutoSave}
              className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left font-bold text-slate-700 transition hover:bg-slate-50"
            >
              <span>Auto save settings locally</span>
              {autoSave ? (
                <ToggleRight className="h-5 w-5 text-teal-600" />
              ) : (
                <ToggleLeft className="h-5 w-5 text-slate-400" />
              )}
            </button>

            <button
              type="button"
              onClick={toggleMaintenanceMode}
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
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-black text-slate-950">
                Quick Actions
              </h2>
              <p className="mt-1 text-xs font-semibold text-slate-500">
                Settings save, notification enable বা dashboard এ ফিরে যান।
              </p>
            </div>
            <Save className="h-5 w-5 text-teal-600" />
          </div>

          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <button
              type="button"
              onClick={saveSettings}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-3 text-sm font-black text-white transition hover:bg-teal-700"
            >
              <Save className="h-4 w-4" />
              Save Settings
            </button>

            <button
              type="button"
              onClick={enableDesktopNotifications}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-50"
            >
              <Bell className="h-4 w-4" />
              {notificationPermission === "granted"
                ? "Notification On"
                : "Enable Notification"}
            </button>

            <Link
              href="/admin"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-50 sm:col-span-2"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-700">
              <Eye className="h-3.5 w-3.5" />
              Page Access
            </div>
            <h2 className="mt-3 text-lg font-black text-slate-950">
              Website Section & Page Access Control
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Hero Section, Title Bar, Services, Clinic Process, Contact,
              Appointment Form, Navigation এবং প্রয়োজনীয় pages enable/disable
              করুন। Disable করলে duration select করতে হবে।
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-black text-slate-700">
            {enabledAccessCount}/{accessControls.length} Enabled
          </div>
        </div>

        <div className="mt-5 space-y-5">
          {Object.entries(groupedAccessControls).map(([group, items]) => (
            <div key={group} className="rounded-3xl bg-slate-50 p-3">
              <div className="mb-3 flex items-center justify-between gap-3 px-1">
                <h3 className="text-sm font-black text-slate-950">{group}</h3>
                <span className="rounded-full bg-white px-3 py-1 text-[11px] font-black text-slate-500">
                  {items.filter((item) => item.enabled).length}/{items.length}{" "}
                  Active
                </span>
              </div>

              <div className="grid gap-3 lg:grid-cols-2">
                {items.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleAccessClick(item)}
                    className="flex items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 text-left transition hover:bg-slate-50"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-sm font-black text-slate-950">
                          {item.title}
                        </h4>

                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-black ${
                            item.enabled
                              ? "bg-teal-50 text-teal-700"
                              : "bg-rose-50 text-rose-700"
                          }`}
                        >
                          {item.enabled ? (
                            <Eye className="h-3 w-3" />
                          ) : (
                            <EyeOff className="h-3 w-3" />
                          )}
                          {item.enabled ? "Enabled" : "Disabled"}
                        </span>

                        {!item.enabled ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-black text-amber-700">
                            <Clock className="h-3 w-3" />
                            {getTimeLeftLabel(item.disabledUntil, currentTime)}
                          </span>
                        ) : null}
                      </div>

                      <p className="mt-1 text-xs font-semibold leading-5 text-slate-500">
                        {item.description}
                      </p>

                      {!item.enabled ? (
                        <p className="mt-2 text-[11px] font-bold leading-5 text-slate-500">
                          {item.disabledUntil
                            ? `Will enable automatically: ${formatDateTime(
                                item.disabledUntil,
                              )}`
                            : "Manual enable required"}
                        </p>
                      ) : null}

                      {item.lastAction ? (
                        <p className="mt-1 text-[11px] font-semibold text-slate-400">
                          Last action: {item.lastAction}
                        </p>
                      ) : null}
                    </div>

                    <div className="shrink-0 pt-1">
                      {item.enabled ? (
                        <ToggleRight className="h-6 w-6 text-teal-600" />
                      ) : (
                        <ToggleLeft className="h-6 w-6 text-slate-400" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {pendingDisableItem ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 p-4">
              <div className="flex gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
                  <AlertTriangle className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-lg font-black text-slate-950">
                    Are you sure?
                  </h2>
                  <p className="mt-1 text-sm font-semibold leading-6 text-slate-500">
                    আপনি{" "}
                    <span className="font-black text-slate-950">
                      {pendingDisableItem.title}
                    </span>{" "}
                    disable করতে যাচ্ছেন।
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={cancelDisableAccess}
                className="rounded-full border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50 hover:text-slate-950"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 p-4">
              <div className="rounded-2xl border border-amber-100 bg-amber-50 p-3 text-sm font-bold leading-6 text-amber-800">
                Disable করলে selected section/page website বা admin access থেকে
                hide/disable থাকবে। Time শেষ হলে automatic enable হবে, আর Until
                Changed দিলে manually enable করতে হবে।
              </div>

              <div>
                <p className="mb-2 text-sm font-black text-slate-700">
                  Disable duration
                </p>

                <div className="grid gap-2 sm:grid-cols-2">
                  {durationOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setDisableDuration(option.value)}
                      className={`rounded-2xl border p-3 text-left transition ${
                        disableDuration === option.value
                          ? "border-teal-500 bg-teal-50"
                          : "border-slate-200 bg-white hover:bg-slate-50"
                      }`}
                    >
                      <p className="text-sm font-black text-slate-950">
                        {option.label}
                      </p>
                      <p className="mt-1 text-[11px] font-semibold leading-5 text-slate-500">
                        {option.helper}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={cancelDisableAccess}
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-4 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={confirmDisableAccess}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 py-3 text-sm font-black text-white transition hover:bg-rose-700"
                >
                  <EyeOff className="h-4 w-4" />
                  Yes, Disable
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {isProfileModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-slate-200 bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white/95 p-4 backdrop-blur">
              <div>
                <h2 className="text-lg font-black text-slate-950">
                  Edit Profile
                </h2>
                <p className="mt-1 text-xs font-semibold text-slate-500">
                  Profile info এবং picture update করুন।
                </p>
              </div>

              <button
                type="button"
                onClick={closeProfileModal}
                className="rounded-full border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50 hover:text-slate-950"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid gap-5 p-4 lg:grid-cols-[280px_1fr]">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex flex-col items-center">
                  <div
                    role="button"
                    tabIndex={0}
                    onPointerDown={handleImagePointerDown}
                    onPointerMove={handleImagePointerMove}
                    onPointerUp={handleImagePointerUp}
                    onPointerCancel={handleImagePointerUp}
                    className={`relative h-48 w-48 touch-none overflow-hidden rounded-full border-4 border-white bg-white shadow-sm ${
                      profileImage
                        ? isDraggingImage
                          ? "cursor-grabbing"
                          : "cursor-grab"
                        : "cursor-default"
                    }`}
                  >
                    {profileImage ? (
                      <img
                        src={profileImage}
                        alt="Profile preview"
                        draggable={false}
                        className="h-full w-full select-none object-cover"
                        style={{
                          objectPosition: `${imagePosition.x}% ${imagePosition.y}%`,
                        }}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-teal-50 text-teal-700">
                        <UserRound className="h-20 w-20" />
                      </div>
                    )}

                    <div className="absolute bottom-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1 rounded-full bg-slate-950/80 px-3 py-1.5 text-[11px] font-black text-white">
                      <Move className="h-3 w-3" />
                      Drag adjust
                    </div>
                  </div>

                  <p className="mt-3 text-center text-xs font-semibold leading-5 text-slate-500">
                    Picture circle এর ভিতরে fit হবে। Mouse বা finger দিয়ে drag
                    করে position adjust করতে পারবেন।
                  </p>

                  <div className="mt-4 grid w-full gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleDeviceImageUpload}
                      className="hidden"
                    />

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-black text-white transition hover:bg-slate-800"
                    >
                      <UploadCloud className="h-4 w-4" />
                      Upload from Device
                    </button>

                    <button
                      type="button"
                      onClick={resetImagePosition}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-50"
                    >
                      <Move className="h-4 w-4" />
                      Reset Position
                    </button>

                    <button
                      type="button"
                      onClick={removeProfileImage}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-black text-rose-700 transition hover:bg-rose-100"
                    >
                      <X className="h-4 w-4" />
                      Remove Picture
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-3xl border border-slate-200 bg-white p-4">
                  <div className="flex items-center gap-2">
                    <Camera className="h-4 w-4 text-teal-600" />
                    <h3 className="text-sm font-black text-slate-950">
                      Image URL
                    </h3>
                  </div>

                  <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                    <input
                      value={imageUrl}
                      onChange={(event) => setImageUrl(event.target.value)}
                      placeholder="Paste profile image URL"
                      className="min-h-11 flex-1 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 outline-none transition focus:border-teal-500"
                    />

                    <button
                      type="button"
                      onClick={useImageFromUrl}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-3 text-sm font-black text-white transition hover:bg-teal-700"
                    >
                      <Link2 className="h-4 w-4" />
                      Use URL
                    </button>
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-4">
                  <div className="flex items-center gap-2">
                    <UserRound className="h-4 w-4 text-teal-600" />
                    <h3 className="text-sm font-black text-slate-950">
                      Profile Information
                    </h3>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <label className="space-y-1">
                      <span className="text-xs font-black text-slate-600">
                        Name
                      </span>
                      <input
                        value={profileName}
                        onChange={(event) => setProfileName(event.target.value)}
                        className="min-h-11 w-full rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 outline-none transition focus:border-teal-500"
                      />
                    </label>

                    <label className="space-y-1">
                      <span className="text-xs font-black text-slate-600">
                        Role
                      </span>
                      <input
                        value={profileRole}
                        onChange={(event) => setProfileRole(event.target.value)}
                        className="min-h-11 w-full rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 outline-none transition focus:border-teal-500"
                      />
                    </label>

                    <label className="space-y-1">
                      <span className="text-xs font-black text-slate-600">
                        Phone
                      </span>
                      <input
                        value={profilePhone}
                        onChange={(event) =>
                          setProfilePhone(event.target.value)
                        }
                        className="min-h-11 w-full rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 outline-none transition focus:border-teal-500"
                      />
                    </label>

                    <label className="space-y-1">
                      <span className="text-xs font-black text-slate-600">
                        Email
                      </span>
                      <input
                        value={profileEmail}
                        onChange={(event) =>
                          setProfileEmail(event.target.value)
                        }
                        className="min-h-11 w-full rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 outline-none transition focus:border-teal-500"
                      />
                    </label>
                  </div>
                </div>

                <div className="rounded-3xl border border-teal-100 bg-teal-50 p-4">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-700" />
                    <p className="text-xs font-bold leading-5 text-teal-800">
                      Save Profile দিলে popup close হবে এবং success notification
                      show হবে। Close করলেও notification show হবে।
                    </p>
                  </div>
                </div>

                <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={closeProfileModal}
                    className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-4 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-50"
                  >
                    Close
                  </button>

                  <button
                    type="button"
                    onClick={saveProfile}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-3 text-sm font-black text-white transition hover:bg-teal-700"
                  >
                    <Save className="h-4 w-4" />
                    Save Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
