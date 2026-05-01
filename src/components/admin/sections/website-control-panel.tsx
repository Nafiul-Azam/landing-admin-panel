"use client";

import Link from "next/link";
import { useState, type ChangeEvent, type FormEvent } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  Globe,
  ImageIcon,
  ImagePlus,
  MapPin,
  Plus,
  RotateCcw,
  Save,
  UploadCloud,
  X,
} from "lucide-react";

type ShowDuration = "24h" | "7d" | "15d" | "30d" | "until_changed";
type Direction = "up" | "down";

type VisibilityControl = {
  isVisible: boolean;
  showDuration: ShowDuration;
};

type HeroContent = VisibilityControl & {
  badge: string;
  title: string;
  highlight: string;
  description: string;
};

type HeroCard = VisibilityControl & {
  id: string;
  badge: string;
  title: string;
  description: string;
  imageUrl: string;
};

type NoticeContent = VisibilityControl & {
  text: string;
};

type ProgressContent = VisibilityControl & {
  badge: string;
  title: string;
  description: string;
};

type Metric = VisibilityControl & {
  id: string;
  label: string;
  value: string;
  trend: string;
  direction: Direction;
};

type ContactSection = VisibilityControl & {
  badge: string;
  title: string;
  description: string;
};

type ContactMethod = VisibilityControl & {
  id: string;
  label: string;
  value: string;
  link: string;
  iconText: string;
};

type LocationItem = VisibilityControl & {
  id: string;
  name: string;
  address: string;
  mapLink: string;
  callLink: string;
};

type GallerySection = VisibilityControl & {
  title: string;
  subtitle: string;
};

type GalleryGroup = VisibilityControl & {
  id: string;
  title: string;
  subtitle: string;
};

type GalleryImage = VisibilityControl & {
  id: string;
  groupId: string;
  title: string;
  imageUrl: string;
  link: string;
};

type ModalName =
  | "hero"
  | "heroCard"
  | "notice"
  | "progress"
  | "metric"
  | "contactSection"
  | "contact"
  | "location"
  | "gallerySection"
  | "galleryGroup"
  | "galleryImage"
  | null;

const showDurationOptions: { label: string; value: ShowDuration }[] = [
  { label: "24 Hour", value: "24h" },
  { label: "7 Days", value: "7d" },
  { label: "15 Days", value: "15d" },
  { label: "30 Days", value: "30d" },
  { label: "Until Changed", value: "until_changed" },
];

function getDurationLabel(value: ShowDuration) {
  return (
    showDurationOptions.find((option) => option.value === value)?.label ||
    "Until Changed"
  );
}

const defaultVisibility: VisibilityControl = {
  isVisible: true,
  showDuration: "until_changed",
};

const defaultHero: HeroContent = {
  ...defaultVisibility,
  badge: "ADVANCED DIAGNOSTIC CARE",
  title: "আধুনিক প্রযুক্তি, নির্ভরযোগ্য রিপোর্ট এবং আন্তরিক সেবায়",
  highlight: "আপনার আস্থার ঠিকানা",
  description:
    "উন্নত MRI, অভিজ্ঞ চিকিৎসক এবং রোগীকেন্দ্রিক সেবার সমন্বয়ে আমরা প্রতিদিন কাজ করছি আরও নির্ভরযোগ্য স্বাস্থ্যসেবা পৌঁছে দিতে।",
};

const initialHeroCards: HeroCard[] = [
  {
    id: "hero-card-1",
    ...defaultVisibility,
    badge: "Main Highlight",
    title: "রংপুরে আমরাই প্রথম উন্নতমানের MRI সেবা প্রদান করছি",
    description: "দ্রুত রিপোর্ট, আধুনিক মেশিন এবং অভিজ্ঞ টেকনিশিয়ান।",
    imageUrl: "",
  },
  {
    id: "hero-card-2",
    ...defaultVisibility,
    badge: "Trust & Technology",
    title: "অভিজ্ঞ ডাক্তার ও আধুনিক যন্ত্রপাতির সমন্বয়ে সেরা সেবা",
    description: "প্রতিটি পরীক্ষায় নির্ভুলতা ও রোগীর নিরাপত্তা।",
    imageUrl: "",
  },
  {
    id: "hero-card-3",
    ...defaultVisibility,
    badge: "Service & Care",
    title: "দ্রুত, সহজ ও মানসম্মত স্বাস্থ্যসেবা এখন আপনার হাতের মুঠোয়",
    description: "অনলাইন সিরিয়াল, রিপোর্ট এবং সার্বক্ষণিক সহায়তা।",
    imageUrl: "",
  },
];

const defaultNotice: NoticeContent = {
  ...defaultVisibility,
  showDuration: "24h",
  text: "🚨 আজকের জন্য বিশেষ অফার — ক্যান্সার ও ডায়ালাইসিস রোগীদের জন্য সকল পরীক্ষায় ৩০% ছাড় · আজ বসছেন বিশেষজ্ঞ ডাক্তার · সিরিয়ালের জন্য এখনই কল করুন 📞",
};

const defaultProgress: ProgressContent = {
  ...defaultVisibility,
  badge: "CLINIC PROGRESS",
  title: "আমাদের সেবার অগ্রগতি",
  description:
    "রোগী ভর্তি, সফল অপারেশন এবং পরীক্ষার সাম্প্রতিক অগ্রগতির সংক্ষিপ্ত পরিসংখ্যান।",
};

const initialMetrics: Metric[] = [
  {
    id: "metric-1",
    ...defaultVisibility,
    label: "পেশেন্ট ভর্তি",
    value: "৫৮৭",
    trend: "-০.১%",
    direction: "down",
  },
  {
    id: "metric-2",
    ...defaultVisibility,
    label: "সফল অপারেশন",
    value: "৪৬",
    trend: "+০.১%",
    direction: "up",
  },
  {
    id: "metric-3",
    ...defaultVisibility,
    label: "টেস্ট সংখ্যা",
    value: "২২২",
    trend: "+২৬৬.৭%",
    direction: "up",
  },
];

const defaultContactSection: ContactSection = {
  ...defaultVisibility,
  badge: "CONTACT & LOCATION",
  title: "আমাদের সাথে যোগাযোগ করুন",
  description:
    "যেকোনো প্রয়োজনে আমাদের সাথে সহজেই যোগাযোগ করুন। কল, ম্যাপ, ইমেইল কিংবা সামাজিক যোগাযোগমাধ্যম — সবকিছু এক জায়গাতেই।",
};

const initialContacts: ContactMethod[] = [
  {
    id: "contact-1",
    ...defaultVisibility,
    label: "Facebook",
    value: "Facebook Page",
    link: "https://facebook.com",
    iconText: "f",
  },
  {
    id: "contact-2",
    ...defaultVisibility,
    label: "YouTube",
    value: "YouTube Channel",
    link: "https://youtube.com",
    iconText: "▶",
  },
  {
    id: "contact-3",
    ...defaultVisibility,
    label: "Twitter",
    value: "Twitter/X",
    link: "https://x.com",
    iconText: "𝕏",
  },
  {
    id: "contact-4",
    ...defaultVisibility,
    label: "Instagram",
    value: "Instagram",
    link: "https://instagram.com",
    iconText: "◎",
  },
  {
    id: "contact-5",
    ...defaultVisibility,
    label: "WhatsApp",
    value: "+8801700000000",
    link: "https://wa.me/8801700000000",
    iconText: "☎",
  },
  {
    id: "contact-6",
    ...defaultVisibility,
    label: "Call",
    value: "09600-000000",
    link: "tel:09600000000",
    iconText: "📞",
  },
  {
    id: "contact-7",
    ...defaultVisibility,
    label: "Google Maps",
    value: "Main Branch",
    link: "https://maps.google.com",
    iconText: "📍",
  },
  {
    id: "contact-8",
    ...defaultVisibility,
    label: "Gmail",
    value: "info@clinic.test",
    link: "mailto:info@clinic.test",
    iconText: "M",
  },
];

const initialLocations: LocationItem[] = [
  {
    id: "location-1",
    ...defaultVisibility,
    name: "আপডেট ক্লিনিক (রংপুর শাখা)",
    address: "ধাপ, জেল রোড, রংপুর - ৫৪০০",
    mapLink: "https://maps.google.com",
    callLink: "tel:09600000000",
  },
  {
    id: "location-2",
    ...defaultVisibility,
    name: "আপডেট ক্লিনিক (কুড়িগ্রাম শাখা)",
    address: "রাজারহাট, কুড়িগ্রাম, রংপুর",
    mapLink: "https://maps.google.com",
    callLink: "tel:09600000000",
  },
];

const defaultGallerySection: GallerySection = {
  ...defaultVisibility,
  title: "আমাদের সেবার স্ন্যাপশট",
  subtitle: "সেবা, যন্ত্র এবং আস্থার প্রতিচ্ছবি",
};

const initialGalleryGroups: GalleryGroup[] = [
  {
    id: "gallery-1",
    ...defaultVisibility,
    title: "নোটিশ সেকশন",
    subtitle: "গুরুত্বপূর্ণ আপডেট ও তথ্য",
  },
  {
    id: "gallery-2",
    ...defaultVisibility,
    title: "ডাক্তার ও নার্স",
    subtitle: "নিবেদিত সেবার মুহূর্ত",
  },
];

const initialGalleryImages: GalleryImage[] = [
  {
    id: "image-1",
    ...defaultVisibility,
    groupId: "gallery-1",
    title: "Notice 1",
    imageUrl: "",
    link: "",
  },
  {
    id: "image-2",
    ...defaultVisibility,
    groupId: "gallery-1",
    title: "Notice 2",
    imageUrl: "",
    link: "",
  },
  {
    id: "image-3",
    ...defaultVisibility,
    groupId: "gallery-1",
    title: "Notice 3",
    imageUrl: "",
    link: "",
  },
  {
    id: "image-4",
    ...defaultVisibility,
    groupId: "gallery-2",
    title: "Team 1",
    imageUrl: "",
    link: "",
  },
  {
    id: "image-5",
    ...defaultVisibility,
    groupId: "gallery-2",
    title: "Team 2",
    imageUrl: "",
    link: "",
  },
];

const emptyHeroCard: HeroCard = {
  id: "",
  badge: "",
  title: "",
  description: "",
  imageUrl: "",
  ...defaultVisibility,
};

const emptyMetric: Metric = {
  id: "",
  label: "",
  value: "",
  trend: "",
  direction: "up",
  ...defaultVisibility,
};

const emptyContact: ContactMethod = {
  id: "",
  label: "",
  value: "",
  link: "",
  iconText: "•",
  ...defaultVisibility,
};

const emptyLocation: LocationItem = {
  id: "",
  name: "",
  address: "",
  mapLink: "",
  callLink: "",
  ...defaultVisibility,
};

const emptyGalleryGroup: GalleryGroup = {
  id: "",
  title: "",
  subtitle: "",
  ...defaultVisibility,
};

const emptyGalleryImage: GalleryImage = {
  id: "",
  groupId: "gallery-1",
  title: "",
  imageUrl: "",
  link: "",
  ...defaultVisibility,
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
  rows = 3,
  onChange,
}: {
  label: string;
  value: string;
  placeholder?: string;
  rows?: number;
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
        rows={rows}
        className="mt-1 w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
      />
    </label>
  );
}

function VisibilityDurationFields({
  isVisible,
  showDuration,
  visibleLabel = "Visible on website",
  onVisibleChange,
  onDurationChange,
}: {
  isVisible: boolean;
  showDuration: ShowDuration;
  visibleLabel?: string;
  onVisibleChange: (value: boolean) => void;
  onDurationChange: (value: ShowDuration) => void;
}) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <label className="flex items-center gap-3 rounded-xl border border-slate-200 px-3 py-2 text-sm font-bold text-slate-700">
        <input
          type="checkbox"
          checked={isVisible}
          onChange={(event) => onVisibleChange(event.target.checked)}
        />
        {visibleLabel}
      </label>

      <label className="block rounded-xl border border-slate-200 bg-white px-3 py-2">
        <span className="text-xs font-bold text-slate-500">Show Duration</span>
        <select
          value={showDuration}
          onChange={(event) =>
            onDurationChange(event.target.value as ShowDuration)
          }
          className="mt-1 h-8 w-full bg-transparent text-sm font-black text-slate-800 outline-none"
        >
          {showDurationOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

function VisibilityMeta({
  isVisible,
  showDuration,
}: {
  isVisible: boolean;
  showDuration: ShowDuration;
}) {
  return (
    <div className="mt-3 flex flex-wrap gap-2 text-[10px] font-black">
      <span
        className={`rounded-full px-2.5 py-1 ${
          isVisible ? "bg-teal-50 text-teal-700" : "bg-red-50 text-red-600"
        }`}
      >
        {isVisible ? "Website Visible" : "Website Hidden"}
      </span>
      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-600">
        {getDurationLabel(showDuration)}
      </span>
    </div>
  );
}

function ImagePreview({
  imageUrl,
  label = "No image",
}: {
  imageUrl: string;
  label?: string;
}) {
  return (
    <div
      className="flex h-44 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 bg-cover bg-center text-center text-slate-400"
      style={{ backgroundImage: imageUrl ? `url(${imageUrl})` : undefined }}
    >
      {!imageUrl ? (
        <div>
          <ImageIcon className="mx-auto h-8 w-8" />
          <p className="mt-2 text-xs font-bold">{label}</p>
        </div>
      ) : null}
    </div>
  );
}

function FormFooter({
  onCancel,
  saveLabel = "Save",
}: {
  onCancel: () => void;
  saveLabel?: string;
}) {
  return (
    <div className="grid grid-cols-2 gap-2 pt-2">
      <button
        type="button"
        onClick={onCancel}
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
        {saveLabel}
      </button>
    </div>
  );
}

export default function WebsiteControlPanel() {
  const [hero, setHero] = useState(defaultHero);
  const [heroDraft, setHeroDraft] = useState(defaultHero);

  const [heroCards, setHeroCards] = useState(initialHeroCards);
  const [heroCardDraft, setHeroCardDraft] = useState<HeroCard>(emptyHeroCard);

  const [notice, setNotice] = useState(defaultNotice);
  const [noticeDraft, setNoticeDraft] = useState(defaultNotice);

  const [progress, setProgress] = useState(defaultProgress);
  const [progressDraft, setProgressDraft] = useState(defaultProgress);

  const [metrics, setMetrics] = useState(initialMetrics);
  const [metricDraft, setMetricDraft] = useState<Metric>(emptyMetric);

  const [contactSection, setContactSection] = useState(defaultContactSection);
  const [contactSectionDraft, setContactSectionDraft] = useState(
    defaultContactSection,
  );

  const [contacts, setContacts] = useState(initialContacts);
  const [contactDraft, setContactDraft] = useState<ContactMethod>(emptyContact);

  const [locations, setLocations] = useState(initialLocations);
  const [locationDraft, setLocationDraft] =
    useState<LocationItem>(emptyLocation);

  const [gallerySection, setGallerySection] = useState(defaultGallerySection);
  const [gallerySectionDraft, setGallerySectionDraft] = useState(
    defaultGallerySection,
  );

  const [galleryGroups, setGalleryGroups] = useState(initialGalleryGroups);
  const [galleryGroupDraft, setGalleryGroupDraft] =
    useState<GalleryGroup>(emptyGalleryGroup);

  const [galleryImages, setGalleryImages] = useState(initialGalleryImages);
  const [galleryImageDraft, setGalleryImageDraft] =
    useState<GalleryImage>(emptyGalleryImage);

  const [activeModal, setActiveModal] = useState<ModalName>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [toast, setToast] = useState("Ready to manage website control");

  const visibleHeroCards = heroCards.filter((card) => card.isVisible);
  const visibleMetrics = metrics.filter((metric) => metric.isVisible);
  const visibleContacts = contacts.filter((contact) => contact.isVisible);
  const visibleLocations = locations.filter((location) => location.isVisible);
  const visibleGalleryGroups = galleryGroups.filter((group) => group.isVisible);

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
        showToast("Image uploaded successfully");
      }
    };

    reader.readAsDataURL(file);
  }

  function openHeroModal() {
    setHeroDraft(hero);
    setActiveModal("hero");
  }

  function openHeroCardModal(card?: HeroCard) {
    if (card) {
      setEditingId(card.id);
      setHeroCardDraft(card);
    } else {
      setEditingId(null);
      setHeroCardDraft({
        ...emptyHeroCard,
        id: `hero-card-${Date.now()}`,
      });
    }

    setActiveModal("heroCard");
  }

  function openNoticeModal() {
    setNoticeDraft(notice);
    setActiveModal("notice");
  }

  function openProgressModal() {
    setProgressDraft(progress);
    setActiveModal("progress");
  }

  function openMetricModal(metric?: Metric) {
    if (metric) {
      setEditingId(metric.id);
      setMetricDraft(metric);
    } else {
      setEditingId(null);
      setMetricDraft({
        ...emptyMetric,
        id: `metric-${Date.now()}`,
      });
    }

    setActiveModal("metric");
  }

  function openContactSectionModal() {
    setContactSectionDraft(contactSection);
    setActiveModal("contactSection");
  }

  function openContactModal(contact?: ContactMethod) {
    if (contact) {
      setEditingId(contact.id);
      setContactDraft(contact);
    } else {
      setEditingId(null);
      setContactDraft({
        ...emptyContact,
        id: `contact-${Date.now()}`,
      });
    }

    setActiveModal("contact");
  }

  function openLocationModal(location?: LocationItem) {
    if (location) {
      setEditingId(location.id);
      setLocationDraft(location);
    } else {
      setEditingId(null);
      setLocationDraft({
        ...emptyLocation,
        id: `location-${Date.now()}`,
      });
    }

    setActiveModal("location");
  }

  function openGallerySectionModal() {
    setGallerySectionDraft(gallerySection);
    setActiveModal("gallerySection");
  }

  function openGalleryGroupModal(group?: GalleryGroup) {
    if (group) {
      setEditingId(group.id);
      setGalleryGroupDraft(group);
    } else {
      setEditingId(null);
      setGalleryGroupDraft({
        ...emptyGalleryGroup,
        id: `gallery-${Date.now()}`,
      });
    }

    setActiveModal("galleryGroup");
  }

  function openGalleryImageModal(image?: GalleryImage, groupId?: string) {
    if (image) {
      setEditingId(image.id);
      setGalleryImageDraft(image);
    } else {
      setEditingId(null);
      setGalleryImageDraft({
        ...emptyGalleryImage,
        id: `image-${Date.now()}`,
        groupId: groupId || galleryGroups[0]?.id || "",
      });
    }

    setActiveModal("galleryImage");
  }

  function saveModal(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (activeModal === "hero") {
      setHero(heroDraft);
      closeModal("Hero section saved successfully");
      return;
    }

    if (activeModal === "heroCard") {
      if (!heroCardDraft.title.trim()) {
        showToast("Hero card title required");
        return;
      }

      setHeroCards((previous) =>
        editingId
          ? previous.map((card) =>
              card.id === editingId ? heroCardDraft : card,
            )
          : [heroCardDraft, ...previous],
      );

      closeModal("Hero card saved successfully");
      return;
    }

    if (activeModal === "notice") {
      setNotice(noticeDraft);
      closeModal("Notice bar saved successfully");
      return;
    }

    if (activeModal === "progress") {
      setProgress(progressDraft);
      closeModal("Progress section saved successfully");
      return;
    }

    if (activeModal === "metric") {
      if (!metricDraft.label.trim()) {
        showToast("Metric label required");
        return;
      }

      setMetrics((previous) =>
        editingId
          ? previous.map((metric) =>
              metric.id === editingId ? metricDraft : metric,
            )
          : [...previous, metricDraft],
      );

      closeModal("Metric saved successfully");
      return;
    }

    if (activeModal === "contactSection") {
      setContactSection(contactSectionDraft);
      closeModal("Contact section saved successfully");
      return;
    }

    if (activeModal === "contact") {
      if (!contactDraft.label.trim()) {
        showToast("Contact label required");
        return;
      }

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
      if (!locationDraft.name.trim()) {
        showToast("Location name required");
        return;
      }

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

    if (activeModal === "gallerySection") {
      setGallerySection(gallerySectionDraft);
      closeModal("Gallery section saved successfully");
      return;
    }

    if (activeModal === "galleryGroup") {
      if (!galleryGroupDraft.title.trim()) {
        showToast("Gallery title required");
        return;
      }

      setGalleryGroups((previous) =>
        editingId
          ? previous.map((group) =>
              group.id === editingId ? galleryGroupDraft : group,
            )
          : [...previous, galleryGroupDraft],
      );

      closeModal("Gallery group saved successfully");
      return;
    }

    if (activeModal === "galleryImage") {
      if (!galleryImageDraft.groupId) {
        showToast("Please select gallery group");
        return;
      }

      setGalleryImages((previous) =>
        editingId
          ? previous.map((image) =>
              image.id === editingId ? galleryImageDraft : image,
            )
          : [galleryImageDraft, ...previous],
      );

      closeModal("Gallery image saved successfully");
    }
  }

  function deleteHeroCard(id: string) {
    setHeroCards((previous) => previous.filter((card) => card.id !== id));
    showToast("Hero card removed");
  }

  function deleteMetric(id: string) {
    setMetrics((previous) => previous.filter((metric) => metric.id !== id));
    showToast("Metric removed");
  }

  function deleteContact(id: string) {
    setContacts((previous) => previous.filter((contact) => contact.id !== id));
    showToast("Contact removed");
  }

  function deleteLocation(id: string) {
    setLocations((previous) =>
      previous.filter((location) => location.id !== id),
    );
    showToast("Location removed");
  }

  function deleteGalleryGroup(id: string) {
    setGalleryGroups((previous) => previous.filter((group) => group.id !== id));
    setGalleryImages((previous) =>
      previous.filter((image) => image.groupId !== id),
    );
    showToast("Gallery group removed");
  }

  function deleteGalleryImage(id: string) {
    setGalleryImages((previous) => previous.filter((image) => image.id !== id));
    showToast("Gallery image removed");
  }

  function resetAll() {
    setHero(defaultHero);
    setHeroCards(initialHeroCards);
    setNotice(defaultNotice);
    setProgress(defaultProgress);
    setMetrics(initialMetrics);
    setContactSection(defaultContactSection);
    setContacts(initialContacts);
    setLocations(initialLocations);
    setGallerySection(defaultGallerySection);
    setGalleryGroups(initialGalleryGroups);
    setGalleryImages(initialGalleryImages);
    showToast("Website control reset successfully");
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
          onClick={resetAll}
          className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-black text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          <RotateCcw className="h-4 w-4" />
          Reset All
        </button>
      </div>

      <div className="fixed right-4 top-4 z-40 hidden max-w-sm items-center gap-2 rounded-2xl border border-teal-100 bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-lg shadow-slate-200/60 sm:flex">
        <CheckCircle2 className="h-4 w-4 shrink-0 text-teal-600" />
        <span>{toast}</span>
      </div>

      <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1 text-xs font-black text-teal-700">
          <Globe className="h-3.5 w-3.5" />
          Website Control
        </div>

        <h1 className="mt-3 text-2xl font-black text-slate-950">
          Website Control
        </h1>

        <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-600">
          Hero, card, notice, progress, contact, location এবং gallery/snapshot
          section এখান থেকে edit/add/delete/upload করা যাবে।
        </p>

        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <button
            type="button"
            onClick={openHeroModal}
            className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-50"
          >
            Edit Hero
          </button>

          <button
            type="button"
            onClick={() => openHeroCardModal()}
            className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-50"
          >
            Add Hero Card
          </button>

          <button
            type="button"
            onClick={openNoticeModal}
            className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-50"
          >
            Edit Notice
          </button>

          <button
            type="button"
            onClick={openProgressModal}
            className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-50"
          >
            Edit Progress
          </button>

          <button
            type="button"
            onClick={openContactSectionModal}
            className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-50"
          >
            Edit Contact Heading
          </button>

          <button
            type="button"
            onClick={() => openContactModal()}
            className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-50"
          >
            Add Contact
          </button>

          <button
            type="button"
            onClick={() => openLocationModal()}
            className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-50"
          >
            Add Location
          </button>

          <button
            type="button"
            onClick={openGallerySectionModal}
            className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-50"
          >
            Edit Gallery
          </button>
        </div>
      </section>

      {/* WEBSITE PREVIEW */}
      <section className="overflow-hidden rounded-3xl border border-teal-100 bg-teal-50/70 p-4 shadow-sm sm:p-6">
        {hero.isVisible ? (
          <div className="text-center">
            <button
              type="button"
              onClick={openHeroModal}
              className="mx-auto inline-flex rounded-full border border-teal-100 bg-white px-4 py-1 text-[10px] font-black uppercase tracking-[0.28em] text-teal-700 shadow-sm"
            >
              {hero.badge}
            </button>

            <h2 className="mx-auto mt-5 max-w-4xl text-3xl font-black leading-tight text-teal-900 md:text-5xl">
              {hero.title}
              <span className="block text-teal-600">{hero.highlight}</span>
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-teal-700/80">
              {hero.description}
            </p>

            <div className="mt-6 grid gap-5 lg:grid-cols-3">
              {visibleHeroCards.map((card) => (
                <div
                  key={card.id}
                  className="group relative rounded-3xl bg-white/80 p-5 text-left shadow-sm ring-1 ring-teal-100"
                >
                  <ImagePreview imageUrl={card.imageUrl} label="Hero image" />

                  <span className="mt-4 inline-flex rounded-full border border-teal-100 bg-teal-50 px-3 py-1 text-[10px] font-black text-teal-700">
                    {card.badge}
                  </span>

                  <h3 className="mt-3 text-xl font-black leading-7 text-teal-900">
                    {card.title}
                  </h3>

                  <p className="mt-4 text-sm leading-6 text-slate-500">
                    {card.description}
                  </p>

                  <VisibilityMeta
                    isVisible={card.isVisible}
                    showDuration={card.showDuration}
                  />

                  <div className="mt-4 flex gap-2">
                    <button
                      type="button"
                      onClick={() => openHeroCardModal(card)}
                      className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-black text-slate-700 transition hover:bg-white"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteHeroCard(card.id)}
                      className="rounded-xl border border-red-100 px-3 py-2 text-xs font-black text-red-600 transition hover:bg-red-50"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-red-200 bg-red-50 p-8 text-center text-sm font-bold text-red-600">
            Hero section hidden
          </div>
        )}
      </section>

      {notice.isVisible ? (
        <section className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <p className="truncate text-sm font-black text-teal-900">
              {notice.text}
            </p>

            <button
              type="button"
              onClick={openNoticeModal}
              className="shrink-0 rounded-full border border-slate-200 px-3 py-1 text-xs font-black text-slate-700 hover:bg-slate-50"
            >
              Edit
            </button>
          </div>
        </section>
      ) : null}

      {progress.isVisible ? (
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <button
                type="button"
                onClick={openProgressModal}
                className="inline-flex rounded-full border border-teal-100 bg-white px-4 py-1 text-[10px] font-black uppercase tracking-[0.24em] text-teal-700 shadow-sm"
              >
                {progress.badge}
              </button>

              <h2 className="mt-4 text-3xl font-black text-teal-900">
                {progress.title}
              </h2>

              <p className="mt-2 text-sm leading-7 text-slate-600">
                {progress.description}
              </p>
            </div>

            <button
              type="button"
              onClick={() => openMetricModal()}
              className="inline-flex w-fit items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-black text-white hover:bg-teal-700"
            >
              <Plus className="h-4 w-4" />
              Add Stat
            </button>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {visibleMetrics.map((metric) => (
              <div
                key={metric.id}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-black text-teal-900">
                    {metric.label}
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

                <p className="mt-3 text-3xl font-black text-teal-900">
                  {metric.value}
                </p>

                <div className="mt-4 h-1.5 rounded-full bg-slate-200">
                  <div
                    className={`h-1.5 rounded-full ${
                      metric.direction === "up" ? "bg-teal-600" : "bg-red-500"
                    }`}
                    style={{ width: metric.direction === "up" ? "84%" : "46%" }}
                  />
                </div>

                <VisibilityMeta
                  isVisible={metric.isVisible}
                  showDuration={metric.showDuration}
                />

                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => openMetricModal(metric)}
                    className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-black text-slate-700 hover:bg-white"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => deleteMetric(metric.id)}
                    className="rounded-xl border border-red-100 px-3 py-2 text-xs font-black text-red-600 hover:bg-red-50"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {contactSection.isVisible ? (
        <section className="rounded-3xl bg-teal-50/70 p-5 shadow-sm">
          <div className="text-center">
            <button
              type="button"
              onClick={openContactSectionModal}
              className="mx-auto inline-flex rounded-full border border-teal-100 bg-white px-4 py-1 text-[10px] font-black uppercase tracking-[0.24em] text-teal-700 shadow-sm"
            >
              {contactSection.badge}
            </button>

            <h2 className="mt-4 text-3xl font-black text-teal-900">
              {contactSection.title}
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-600">
              {contactSection.description}
            </p>
          </div>

          <div className="mt-8 grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-3xl bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-xl font-black text-teal-900">
                    সরাসরি যোগাযোগের মাধ্যম
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    আপনার সুবিধামতো যেকোনো মাধ্যমে যোগাযোগ করতে পারবেন।
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => openContactModal()}
                  className="rounded-xl bg-teal-600 px-3 py-2 text-xs font-black text-white hover:bg-teal-700"
                >
                  Add
                </button>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {visibleContacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm"
                  >
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-2xl font-black text-teal-700">
                      {contact.iconText}
                    </div>

                    <p className="mt-3 text-sm font-black text-teal-900">
                      {contact.label}
                    </p>

                    <p className="mt-1 truncate text-xs text-slate-500">
                      {contact.value}
                    </p>

                    <VisibilityMeta
                      isVisible={contact.isVisible}
                      showDuration={contact.showDuration}
                    />

                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => openContactModal(contact)}
                        className="rounded-lg border border-slate-200 py-1.5 text-xs font-black text-slate-700 hover:bg-slate-50"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteContact(contact.id)}
                        className="rounded-lg border border-red-100 py-1.5 text-xs font-black text-red-600 hover:bg-red-50"
                      >
                        Del
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {visibleLocations.map((location) => (
                <div
                  key={location.id}
                  className="rounded-3xl bg-white p-5 shadow-sm"
                >
                  <div className="flex gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                      <MapPin className="h-6 w-6" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg font-black text-teal-900">
                        {location.name}
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {location.address}
                      </p>

                      <VisibilityMeta
                        isVisible={location.isVisible}
                        showDuration={location.showDuration}
                      />

                      <div className="mt-4 flex flex-wrap gap-2">
                        <a
                          href={location.mapLink}
                          target="_blank"
                          className="rounded-full bg-teal-600 px-4 py-2 text-xs font-black text-white hover:bg-teal-700"
                        >
                          ম্যাপে দেখুন
                        </a>

                        <a
                          href={location.callLink}
                          className="rounded-full border border-teal-100 px-4 py-2 text-xs font-black text-teal-700 hover:bg-teal-50"
                        >
                          কল করুন
                        </a>

                        <button
                          type="button"
                          onClick={() => openLocationModal(location)}
                          className="rounded-full border border-slate-200 px-4 py-2 text-xs font-black text-slate-700 hover:bg-slate-50"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => deleteLocation(location.id)}
                          className="rounded-full border border-red-100 px-4 py-2 text-xs font-black text-red-600 hover:bg-red-50"
                        >
                          Del
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={() => openLocationModal()}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-teal-200 bg-white/70 px-4 py-4 text-sm font-black text-teal-700 hover:bg-white"
              >
                <Plus className="h-4 w-4" />
                Add Location
              </button>
            </div>
          </div>
        </section>
      ) : null}

      {gallerySection.isVisible ? (
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-center">
            <button
              type="button"
              onClick={openGallerySectionModal}
              className="text-3xl font-black text-teal-900"
            >
              {gallerySection.title}
            </button>

            <p className="mt-2 text-sm text-slate-500">
              {gallerySection.subtitle}
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => openGalleryGroupModal()}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-black text-slate-700 hover:bg-slate-50"
            >
              <Plus className="h-4 w-4" />
              Add Gallery Group
            </button>

            <button
              type="button"
              onClick={() => openGalleryImageModal()}
              className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2 text-sm font-black text-white hover:bg-teal-700"
            >
              <ImagePlus className="h-4 w-4" />
              Add Picture
            </button>
          </div>

          <div className="mt-6 space-y-10">
            {visibleGalleryGroups.map((group) => {
              const groupImages = galleryImages.filter(
                (image) => image.groupId === group.id && image.isVisible,
              );

              return (
                <div key={group.id}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-xl font-black text-teal-900">
                        {group.title}
                      </h3>
                      <p className="mt-1 text-sm text-slate-500">
                        {group.subtitle}
                      </p>

                      <VisibilityMeta
                        isVisible={group.isVisible}
                        showDuration={group.showDuration}
                      />
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          openGalleryImageModal(undefined, group.id)
                        }
                        className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-black text-slate-700 hover:bg-slate-50"
                      >
                        Add Image
                      </button>

                      <button
                        type="button"
                        onClick={() => openGalleryGroupModal(group)}
                        className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-black text-slate-700 hover:bg-slate-50"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteGalleryGroup(group.id)}
                        className="rounded-xl border border-red-100 px-3 py-2 text-xs font-black text-red-600 hover:bg-red-50"
                      >
                        Del
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {groupImages.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm font-bold text-slate-500">
                        No picture in this group
                      </div>
                    ) : (
                      groupImages.map((image) => (
                        <div
                          key={image.id}
                          className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200"
                        >
                          <ImagePreview
                            imageUrl={image.imageUrl}
                            label="Gallery image"
                          />

                          <div className="p-3">
                            <p className="font-black text-slate-900">
                              {image.title}
                            </p>

                            <VisibilityMeta
                              isVisible={image.isVisible}
                              showDuration={image.showDuration}
                            />

                            <div className="mt-3 flex gap-2">
                              <button
                                type="button"
                                onClick={() => openGalleryImageModal(image)}
                                className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-black text-slate-700 hover:bg-slate-50"
                              >
                                Edit
                              </button>

                              <button
                                type="button"
                                onClick={() => deleteGalleryImage(image.id)}
                                className="rounded-xl border border-red-100 px-3 py-2 text-xs font-black text-red-600 hover:bg-red-50"
                              >
                                Remove
                              </button>

                              {image.link ? (
                                <a
                                  href={image.link}
                                  target="_blank"
                                  className="inline-flex items-center gap-1 rounded-xl border border-teal-100 px-3 py-2 text-xs font-black text-teal-700 hover:bg-teal-50"
                                >
                                  <ExternalLink className="h-3.5 w-3.5" />
                                  Link
                                </a>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ) : null}

      {/* MODALS */}
      {activeModal ? (
        <div
          onClick={() => closeModal()}
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-4"
        >
          <div
            onClick={(event) => event.stopPropagation()}
            className="my-8 w-full max-w-3xl rounded-3xl bg-white shadow-xl"
          >
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 bg-slate-950 px-4 py-4 text-white sm:px-6">
              <h2 className="text-lg font-black">
                {activeModal === "hero" ? "Edit Hero Section" : null}
                {activeModal === "heroCard" ? "Hero Card" : null}
                {activeModal === "notice" ? "Edit Notice Bar" : null}
                {activeModal === "progress" ? "Edit Progress Section" : null}
                {activeModal === "metric" ? "Metric / Stat" : null}
                {activeModal === "contactSection"
                  ? "Edit Contact Section"
                  : null}
                {activeModal === "contact" ? "Contact Method" : null}
                {activeModal === "location" ? "Location" : null}
                {activeModal === "gallerySection"
                  ? "Edit Gallery Section"
                  : null}
                {activeModal === "galleryGroup" ? "Gallery Group" : null}
                {activeModal === "galleryImage" ? "Gallery Picture" : null}
              </h2>

              <button
                type="button"
                onClick={() => closeModal()}
                className="rounded-full bg-white/10 p-2 transition hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={saveModal} className="space-y-4 p-4 sm:p-6">
              {activeModal === "hero" ? (
                <>
                  <div className="grid gap-3 md:grid-cols-2">
                    <TextInput
                      label="Badge"
                      value={heroDraft.badge}
                      onChange={(value) =>
                        setHeroDraft((prev) => ({ ...prev, badge: value }))
                      }
                    />

                    <TextInput
                      label="Highlight"
                      value={heroDraft.highlight}
                      onChange={(value) =>
                        setHeroDraft((prev) => ({
                          ...prev,
                          highlight: value,
                        }))
                      }
                    />
                  </div>

                  <TextAreaInput
                    label="Title"
                    value={heroDraft.title}
                    rows={2}
                    onChange={(value) =>
                      setHeroDraft((prev) => ({ ...prev, title: value }))
                    }
                  />

                  <TextAreaInput
                    label="Description"
                    value={heroDraft.description}
                    onChange={(value) =>
                      setHeroDraft((prev) => ({
                        ...prev,
                        description: value,
                      }))
                    }
                  />

                  <VisibilityDurationFields
                    isVisible={heroDraft.isVisible}
                    showDuration={heroDraft.showDuration}
                    visibleLabel="Hero visible on website"
                    onVisibleChange={(value) =>
                      setHeroDraft((prev) => ({ ...prev, isVisible: value }))
                    }
                    onDurationChange={(value) =>
                      setHeroDraft((prev) => ({
                        ...prev,
                        showDuration: value,
                      }))
                    }
                  />
                </>
              ) : null}

              {activeModal === "heroCard" ? (
                <>
                  <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
                    <div className="space-y-4">
                      <TextInput
                        label="Badge"
                        value={heroCardDraft.badge}
                        onChange={(value) =>
                          setHeroCardDraft((prev) => ({
                            ...prev,
                            badge: value,
                          }))
                        }
                      />

                      <TextAreaInput
                        label="Title"
                        value={heroCardDraft.title}
                        rows={2}
                        onChange={(value) =>
                          setHeroCardDraft((prev) => ({
                            ...prev,
                            title: value,
                          }))
                        }
                      />

                      <TextAreaInput
                        label="Description"
                        value={heroCardDraft.description}
                        onChange={(value) =>
                          setHeroCardDraft((prev) => ({
                            ...prev,
                            description: value,
                          }))
                        }
                      />

                      <TextInput
                        label="Image URL"
                        value={heroCardDraft.imageUrl}
                        onChange={(value) =>
                          setHeroCardDraft((prev) => ({
                            ...prev,
                            imageUrl: value,
                          }))
                        }
                      />
                    </div>

                    <VisibilityDurationFields
                      isVisible={heroCardDraft.isVisible}
                      showDuration={heroCardDraft.showDuration}
                      visibleLabel="Hero card visible on website"
                      onVisibleChange={(value) =>
                        setHeroCardDraft((prev) => ({
                          ...prev,
                          isVisible: value,
                        }))
                      }
                      onDurationChange={(value) =>
                        setHeroCardDraft((prev) => ({
                          ...prev,
                          showDuration: value,
                        }))
                      }
                    />

                    <div className="space-y-3">
                      <ImagePreview imageUrl={heroCardDraft.imageUrl} />

                      <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-black text-slate-700 hover:bg-slate-50">
                        <UploadCloud className="h-4 w-4" />
                        Upload Picture
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(event) =>
                            readImageFile(event, (url) =>
                              setHeroCardDraft((prev) => ({
                                ...prev,
                                imageUrl: url,
                              })),
                            )
                          }
                        />
                      </label>

                      <button
                        type="button"
                        onClick={() =>
                          setHeroCardDraft((prev) => ({
                            ...prev,
                            imageUrl: "",
                          }))
                        }
                        className="w-full rounded-xl border border-red-100 px-4 py-3 text-sm font-black text-red-600 hover:bg-red-50"
                      >
                        Remove Picture
                      </button>
                    </div>
                  </div>
                </>
              ) : null}

              {activeModal === "notice" ? (
                <>
                  <TextAreaInput
                    label="Notice Text"
                    value={noticeDraft.text}
                    rows={4}
                    onChange={(value) =>
                      setNoticeDraft((prev) => ({ ...prev, text: value }))
                    }
                  />

                  <VisibilityDurationFields
                    isVisible={noticeDraft.isVisible}
                    showDuration={noticeDraft.showDuration}
                    visibleLabel="Notice visible on website"
                    onVisibleChange={(value) =>
                      setNoticeDraft((prev) => ({ ...prev, isVisible: value }))
                    }
                    onDurationChange={(value) =>
                      setNoticeDraft((prev) => ({
                        ...prev,
                        showDuration: value,
                      }))
                    }
                  />
                </>
              ) : null}

              {activeModal === "progress" ? (
                <>
                  <TextInput
                    label="Badge"
                    value={progressDraft.badge}
                    onChange={(value) =>
                      setProgressDraft((prev) => ({ ...prev, badge: value }))
                    }
                  />

                  <TextInput
                    label="Title"
                    value={progressDraft.title}
                    onChange={(value) =>
                      setProgressDraft((prev) => ({ ...prev, title: value }))
                    }
                  />

                  <TextAreaInput
                    label="Description"
                    value={progressDraft.description}
                    onChange={(value) =>
                      setProgressDraft((prev) => ({
                        ...prev,
                        description: value,
                      }))
                    }
                  />

                  <VisibilityDurationFields
                    isVisible={progressDraft.isVisible}
                    showDuration={progressDraft.showDuration}
                    visibleLabel="Progress visible on website"
                    onVisibleChange={(value) =>
                      setProgressDraft((prev) => ({
                        ...prev,
                        isVisible: value,
                      }))
                    }
                    onDurationChange={(value) =>
                      setProgressDraft((prev) => ({
                        ...prev,
                        showDuration: value,
                      }))
                    }
                  />
                </>
              ) : null}

              {activeModal === "metric" ? (
                <>
                  <div className="grid gap-3 md:grid-cols-2">
                    <TextInput
                      label="Label"
                      value={metricDraft.label}
                      onChange={(value) =>
                        setMetricDraft((prev) => ({ ...prev, label: value }))
                      }
                    />

                    <TextInput
                      label="Value"
                      value={metricDraft.value}
                      onChange={(value) =>
                        setMetricDraft((prev) => ({ ...prev, value }))
                      }
                    />

                    <TextInput
                      label="Trend"
                      value={metricDraft.trend}
                      placeholder="+0.1%"
                      onChange={(value) =>
                        setMetricDraft((prev) => ({ ...prev, trend: value }))
                      }
                    />

                    <label className="block">
                      <span className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">
                        Direction
                      </span>
                      <select
                        value={metricDraft.direction}
                        onChange={(event) =>
                          setMetricDraft((prev) => ({
                            ...prev,
                            direction: event.target.value as Direction,
                          }))
                        }
                        className="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold outline-none focus:border-teal-500"
                      >
                        <option value="up">Up</option>
                        <option value="down">Down</option>
                      </select>
                    </label>
                  </div>

                  <VisibilityDurationFields
                    isVisible={metricDraft.isVisible}
                    showDuration={metricDraft.showDuration}
                    visibleLabel="Metric visible on website"
                    onVisibleChange={(value) =>
                      setMetricDraft((prev) => ({ ...prev, isVisible: value }))
                    }
                    onDurationChange={(value) =>
                      setMetricDraft((prev) => ({
                        ...prev,
                        showDuration: value,
                      }))
                    }
                  />
                </>
              ) : null}

              {activeModal === "contactSection" ? (
                <>
                  <TextInput
                    label="Badge"
                    value={contactSectionDraft.badge}
                    onChange={(value) =>
                      setContactSectionDraft((prev) => ({
                        ...prev,
                        badge: value,
                      }))
                    }
                  />

                  <TextInput
                    label="Title"
                    value={contactSectionDraft.title}
                    onChange={(value) =>
                      setContactSectionDraft((prev) => ({
                        ...prev,
                        title: value,
                      }))
                    }
                  />

                  <TextAreaInput
                    label="Description"
                    value={contactSectionDraft.description}
                    onChange={(value) =>
                      setContactSectionDraft((prev) => ({
                        ...prev,
                        description: value,
                      }))
                    }
                  />

                  <VisibilityDurationFields
                    isVisible={contactSectionDraft.isVisible}
                    showDuration={contactSectionDraft.showDuration}
                    visibleLabel="Contact section visible on website"
                    onVisibleChange={(value) =>
                      setContactSectionDraft((prev) => ({
                        ...prev,
                        isVisible: value,
                      }))
                    }
                    onDurationChange={(value) =>
                      setContactSectionDraft((prev) => ({
                        ...prev,
                        showDuration: value,
                      }))
                    }
                  />
                </>
              ) : null}

              {activeModal === "contact" ? (
                <>
                  <div className="grid gap-3 md:grid-cols-2">
                    <TextInput
                      label="Label"
                      value={contactDraft.label}
                      placeholder="Facebook"
                      onChange={(value) =>
                        setContactDraft((prev) => ({ ...prev, label: value }))
                      }
                    />

                    <TextInput
                      label="Icon Text"
                      value={contactDraft.iconText}
                      placeholder="f / ▶ / 📞"
                      onChange={(value) =>
                        setContactDraft((prev) => ({
                          ...prev,
                          iconText: value,
                        }))
                      }
                    />

                    <TextInput
                      label="Value"
                      value={contactDraft.value}
                      placeholder="Facebook Page"
                      onChange={(value) =>
                        setContactDraft((prev) => ({ ...prev, value }))
                      }
                    />

                    <TextInput
                      label="Link"
                      value={contactDraft.link}
                      placeholder="https://..."
                      onChange={(value) =>
                        setContactDraft((prev) => ({ ...prev, link: value }))
                      }
                    />
                  </div>

                  <VisibilityDurationFields
                    isVisible={contactDraft.isVisible}
                    showDuration={contactDraft.showDuration}
                    visibleLabel="Contact item visible on website"
                    onVisibleChange={(value) =>
                      setContactDraft((prev) => ({ ...prev, isVisible: value }))
                    }
                    onDurationChange={(value) =>
                      setContactDraft((prev) => ({
                        ...prev,
                        showDuration: value,
                      }))
                    }
                  />
                </>
              ) : null}

              {activeModal === "location" ? (
                <>
                  <TextInput
                    label="Location Name"
                    value={locationDraft.name}
                    onChange={(value) =>
                      setLocationDraft((prev) => ({ ...prev, name: value }))
                    }
                  />

                  <TextAreaInput
                    label="Address"
                    value={locationDraft.address}
                    onChange={(value) =>
                      setLocationDraft((prev) => ({
                        ...prev,
                        address: value,
                      }))
                    }
                  />

                  <div className="grid gap-3 md:grid-cols-2">
                    <TextInput
                      label="Map Link"
                      value={locationDraft.mapLink}
                      onChange={(value) =>
                        setLocationDraft((prev) => ({
                          ...prev,
                          mapLink: value,
                        }))
                      }
                    />

                    <TextInput
                      label="Call Link"
                      value={locationDraft.callLink}
                      placeholder="tel:09600000000"
                      onChange={(value) =>
                        setLocationDraft((prev) => ({
                          ...prev,
                          callLink: value,
                        }))
                      }
                    />
                  </div>

                  <VisibilityDurationFields
                    isVisible={locationDraft.isVisible}
                    showDuration={locationDraft.showDuration}
                    visibleLabel="Location visible on website"
                    onVisibleChange={(value) =>
                      setLocationDraft((prev) => ({
                        ...prev,
                        isVisible: value,
                      }))
                    }
                    onDurationChange={(value) =>
                      setLocationDraft((prev) => ({
                        ...prev,
                        showDuration: value,
                      }))
                    }
                  />
                </>
              ) : null}

              {activeModal === "gallerySection" ? (
                <>
                  <TextInput
                    label="Title"
                    value={gallerySectionDraft.title}
                    onChange={(value) =>
                      setGallerySectionDraft((prev) => ({
                        ...prev,
                        title: value,
                      }))
                    }
                  />

                  <TextInput
                    label="Subtitle"
                    value={gallerySectionDraft.subtitle}
                    onChange={(value) =>
                      setGallerySectionDraft((prev) => ({
                        ...prev,
                        subtitle: value,
                      }))
                    }
                  />

                  <VisibilityDurationFields
                    isVisible={gallerySectionDraft.isVisible}
                    showDuration={gallerySectionDraft.showDuration}
                    visibleLabel="Gallery section visible on website"
                    onVisibleChange={(value) =>
                      setGallerySectionDraft((prev) => ({
                        ...prev,
                        isVisible: value,
                      }))
                    }
                    onDurationChange={(value) =>
                      setGallerySectionDraft((prev) => ({
                        ...prev,
                        showDuration: value,
                      }))
                    }
                  />
                </>
              ) : null}

              {activeModal === "galleryGroup" ? (
                <>
                  <div className="grid gap-3 md:grid-cols-2">
                    <TextInput
                      label="Group Title"
                      value={galleryGroupDraft.title}
                      onChange={(value) =>
                        setGalleryGroupDraft((prev) => ({
                          ...prev,
                          title: value,
                        }))
                      }
                    />

                    <TextInput
                      label="Subtitle"
                      value={galleryGroupDraft.subtitle}
                      onChange={(value) =>
                        setGalleryGroupDraft((prev) => ({
                          ...prev,
                          subtitle: value,
                        }))
                      }
                    />
                  </div>

                  <VisibilityDurationFields
                    isVisible={galleryGroupDraft.isVisible}
                    showDuration={galleryGroupDraft.showDuration}
                    visibleLabel="Gallery group visible on website"
                    onVisibleChange={(value) =>
                      setGalleryGroupDraft((prev) => ({
                        ...prev,
                        isVisible: value,
                      }))
                    }
                    onDurationChange={(value) =>
                      setGalleryGroupDraft((prev) => ({
                        ...prev,
                        showDuration: value,
                      }))
                    }
                  />
                </>
              ) : null}

              {activeModal === "galleryImage" ? (
                <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
                  <div className="space-y-4">
                    <label className="block">
                      <span className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">
                        Gallery Group
                      </span>
                      <select
                        value={galleryImageDraft.groupId}
                        onChange={(event) =>
                          setGalleryImageDraft((prev) => ({
                            ...prev,
                            groupId: event.target.value,
                          }))
                        }
                        className="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold outline-none focus:border-teal-500"
                      >
                        {galleryGroups.map((group) => (
                          <option key={group.id} value={group.id}>
                            {group.title}
                          </option>
                        ))}
                      </select>
                    </label>

                    <TextInput
                      label="Image Title"
                      value={galleryImageDraft.title}
                      onChange={(value) =>
                        setGalleryImageDraft((prev) => ({
                          ...prev,
                          title: value,
                        }))
                      }
                    />

                    <TextInput
                      label="Image URL"
                      value={galleryImageDraft.imageUrl}
                      onChange={(value) =>
                        setGalleryImageDraft((prev) => ({
                          ...prev,
                          imageUrl: value,
                        }))
                      }
                    />

                    <TextInput
                      label="Optional Link"
                      value={galleryImageDraft.link}
                      placeholder="https://..."
                      onChange={(value) =>
                        setGalleryImageDraft((prev) => ({
                          ...prev,
                          link: value,
                        }))
                      }
                    />
                  </div>

                  <VisibilityDurationFields
                    isVisible={galleryImageDraft.isVisible}
                    showDuration={galleryImageDraft.showDuration}
                    visibleLabel="Gallery image visible on website"
                    onVisibleChange={(value) =>
                      setGalleryImageDraft((prev) => ({
                        ...prev,
                        isVisible: value,
                      }))
                    }
                    onDurationChange={(value) =>
                      setGalleryImageDraft((prev) => ({
                        ...prev,
                        showDuration: value,
                      }))
                    }
                  />

                  <div className="space-y-3">
                    <ImagePreview imageUrl={galleryImageDraft.imageUrl} />

                    <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-black text-slate-700 hover:bg-slate-50">
                      <UploadCloud className="h-4 w-4" />
                      Upload Picture
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(event) =>
                          readImageFile(event, (url) =>
                            setGalleryImageDraft((prev) => ({
                              ...prev,
                              imageUrl: url,
                            })),
                          )
                        }
                      />
                    </label>

                    <button
                      type="button"
                      onClick={() =>
                        setGalleryImageDraft((prev) => ({
                          ...prev,
                          imageUrl: "",
                        }))
                      }
                      className="w-full rounded-xl border border-red-100 px-4 py-3 text-sm font-black text-red-600 hover:bg-red-50"
                    >
                      Remove Picture
                    </button>
                  </div>
                </div>
              ) : null}

              <FormFooter onCancel={() => closeModal()} />
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
