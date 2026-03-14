'use client';

/**
 * ExpoDetail — Exhibition Detail Page with Interactive Booth Map
 * Design: Obsidian Glass with interactive SVG booth map, countdown timer, booking flow
 * Features: Booth selection, temporary hold (30min), pricing, AI suggestions
 * Adapted from reference ExpoDetail.tsx for Next.js App Router
 */
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, ArrowLeft, MapPin, Calendar, Users, Star, Clock, Shield,
  CheckCircle2, Lock, Sparkles, Building2, Ruler, Zap, Eye,
  CreditCard, Timer, Info, Flame, Globe, AlertTriangle, FileText, Phone, Mail,
  Image as ImageIcon, Layers, BarChart3, ChevronLeft, ChevronRight, Maximize2, X
} from "lucide-react";
import { useLanguageStore } from "@/shared/store/useLanguageStore";
import { useAuthStore } from "@/shared/store/useAuthStore";
import { useThemeStore } from "@/shared/store/useThemeStore";
import { events2026 } from "@/features/merchant-dashboard/data/events2026";

// ─── Types ───────────────────────────────────────────────────────
type BoothStatus = "available" | "reserved" | "sold" | "my-hold";
type BoothType = "standard" | "premium" | "corner" | "island" | "kiosk";

interface Booth {
  id: string;
  code: string;
  type: BoothType;
  size: string;
  sizeM2: number;
  price: number;
  status: BoothStatus;
  x: number;
  y: number;
  w: number;
  h: number;
  zone: string;
  featureKeys: string[];
  faces: number;
  dimensions: string;
}

// ─── Booth gallery images by type (Unsplash) ────────────────────
const boothGallery: Record<BoothType, { url: string; label: string; labelEn: string }[]> = {
  standard: [
    { url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop", label: "واجهة البوث", labelEn: "Front View" },
    { url: "https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=400&h=300&fit=crop", label: "منظر داخلي", labelEn: "Interior" },
    { url: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=400&h=300&fit=crop", label: "أثناء التشغيل", labelEn: "During Operation" },
  ],
  premium: [
    { url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop&q=80", label: "واجهة البوث", labelEn: "Front View" },
    { url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop", label: "منظر داخلي", labelEn: "Interior" },
    { url: "https://images.unsplash.com/photo-1559223607-a43c990c692c?w=400&h=300&fit=crop", label: "أثناء التشغيل", labelEn: "During Operation" },
  ],
  corner: [
    { url: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400&h=300&fit=crop", label: "واجهة البوث", labelEn: "Front View" },
    { url: "https://images.unsplash.com/photo-1560439514-4e9645039924?w=400&h=300&fit=crop", label: "منظر جانبي", labelEn: "Side View" },
    { url: "https://images.unsplash.com/photo-1531058020387-3be344556be6?w=400&h=300&fit=crop", label: "أثناء التشغيل", labelEn: "During Operation" },
  ],
  island: [
    { url: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=300&fit=crop", label: "منظر علوي", labelEn: "Top View" },
    { url: "https://images.unsplash.com/photo-1551818255-e6e10975bc17?w=400&h=300&fit=crop", label: "منظر داخلي", labelEn: "Interior" },
    { url: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=300&fit=crop", label: "أثناء التشغيل", labelEn: "During Operation" },
  ],
  kiosk: [
    { url: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400&h=300&fit=crop", label: "واجهة الكشك", labelEn: "Kiosk Front" },
    { url: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop", label: "منظر داخلي", labelEn: "Interior" },
  ],
};

const boothColors: Record<BoothStatus, string> = {
  available: "rgba(74, 222, 128, 0.4)",
  reserved: "rgba(251, 191, 36, 0.3)",
  sold: "rgba(239, 68, 68, 0.2)",
  "my-hold": "rgba(197, 165, 90, 0.5)",
};

const boothBorders: Record<BoothStatus, string> = {
  available: "rgba(74, 222, 128, 0.6)",
  reserved: "rgba(251, 191, 36, 0.5)",
  sold: "rgba(239, 68, 68, 0.3)",
  "my-hold": "rgba(197, 165, 90, 0.8)",
};

// ─── Generate Booths ─────────────────────────────────────────────
const generateBooths = (): Booth[] => {
  const booths: Booth[] = [];
  const zones = [
    { name: "A", startX: 55, startY: 50, cols: 4, rows: 4 },
    { name: "B", startX: 485, startY: 50, cols: 4, rows: 4 },
    { name: "C", startX: 915, startY: 50, cols: 4, rows: 4 },
    { name: "D", startX: 1345, startY: 50, cols: 4, rows: 4 },
    { name: "E", startX: 55, startY: 510, cols: 4, rows: 4 },
    { name: "F", startX: 485, startY: 510, cols: 4, rows: 4 },
    { name: "G", startX: 915, startY: 510, cols: 4, rows: 4 },
    { name: "H", startX: 1345, startY: 510, cols: 4, rows: 4 },
  ];

  const types: { type: BoothType; w: number; h: number; price: number; size: string; sizeM2: number; featureKeys: string[]; faces: number; dimensions: string }[] = [
    { type: "standard", w: 75, h: 55, price: 8000, size: "3×3", sizeM2: 9, featureKeys: ["electricity", "internet"], faces: 1, dimensions: "3m × 3m" },
    { type: "premium", w: 80, h: 55, price: 15000, size: "4×3", sizeM2: 12, featureKeys: ["electricity", "internet", "premium_location"], faces: 1, dimensions: "4m × 3m" },
    { type: "corner", w: 80, h: 60, price: 20000, size: "4×4", sizeM2: 16, featureKeys: ["electricity", "internet", "two_facades"], faces: 2, dimensions: "4m × 4m" },
    { type: "island", w: 90, h: 65, price: 45000, size: "6×4", sizeM2: 24, featureKeys: ["electricity_3phase", "high_speed_internet", "central_ac", "led_screen"], faces: 4, dimensions: "6m × 4m" },
    { type: "kiosk", w: 55, h: 45, price: 5000, size: "2×2", sizeM2: 4, featureKeys: ["electricity"], faces: 1, dimensions: "2m × 2m" },
  ];

  const statuses: BoothStatus[] = ["available", "available", "available", "reserved", "sold", "available", "available", "reserved"];

  zones.forEach((zone) => {
    for (let row = 0; row < zone.rows; row++) {
      for (let col = 0; col < zone.cols; col++) {
        const idx = row * zone.cols + col;
        const tp = types[idx % types.length];
        const s = statuses[(idx + zone.name.charCodeAt(0)) % statuses.length];
        booths.push({
          id: `${zone.name}-${row + 1}${col + 1}`,
          code: `${zone.name}${(row + 1) * 10 + col + 1}`,
          type: tp.type,
          size: tp.size,
          sizeM2: tp.sizeM2,
          price: tp.price + (zone.name === "H" ? 5000 : zone.name === "D" ? 3000 : 0),
          status: s,
          x: zone.startX + col * 90,
          y: zone.startY + 40 + row * 70,
          w: tp.w,
          h: tp.h,
          zone: zone.name,
          featureKeys: tp.featureKeys,
          faces: tp.faces,
          dimensions: tp.dimensions,
        });
      }
    }
  });
  return booths;
};

// ─── Feature key label helper ────────────────────────────────────
function featureLabel(key: string, isAr: boolean): string {
  const map: Record<string, { ar: string; en: string }> = {
    electricity: { ar: "كهرباء", en: "Electricity" },
    internet: { ar: "إنترنت", en: "Internet" },
    premium_location: { ar: "موقع مميز", en: "Premium Location" },
    two_facades: { ar: "واجهتان", en: "Two Facades" },
    electricity_3phase: { ar: "كهرباء 3 فاز", en: "3-Phase Electricity" },
    high_speed_internet: { ar: "إنترنت عالي السرعة", en: "High-Speed Internet" },
    central_ac: { ar: "تكييف مركزي", en: "Central AC" },
    led_screen: { ar: "شاشة LED", en: "LED Screen" },
  };
  return map[key] ? (isAr ? map[key].ar : map[key].en) : key;
}

// ─── Inline ContractPreview Placeholder ──────────────────────────
function ContractPreview({
  boothCode, boothType, boothSize, boothSizeM2, boothZone, boothPrice, depositAmount,
  expoNameAr, expoNameEn, expoLocation, expoDate, onAccept, onBack,
}: {
  boothCode: string; boothType: string; boothSize: string; boothSizeM2: number;
  boothZone: string; boothPrice: number; depositAmount: number;
  expoNameAr: string; expoNameEn: string; expoLocation: string; expoDate: string;
  onAccept: () => void; onBack: () => void;
}) {
  const { language } = useLanguageStore();
  const isAr = language === 'ar';
  return (
    <div className="space-y-4">
      <div className="glass-card rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <FileText size={18} className="text-[#C5A55A]" />
          <h4 className="text-sm font-bold t-primary">{isAr ? "عقد حجز الجناح" : "Booth Booking Contract"}</h4>
        </div>
        <div className="space-y-2 text-xs t-secondary">
          <p><span className="t-tertiary">{isAr ? "المعرض:" : "Expo:"}</span> {isAr ? expoNameAr : expoNameEn}</p>
          <p><span className="t-tertiary">{isAr ? "الموقع:" : "Location:"}</span> {expoLocation}</p>
          <p><span className="t-tertiary">{isAr ? "التاريخ:" : "Date:"}</span> {expoDate}</p>
          <p><span className="t-tertiary">{isAr ? "الجناح:" : "Booth:"}</span> {boothCode} — {boothType}</p>
          <p><span className="t-tertiary">{isAr ? "المساحة:" : "Area:"}</span> {boothSizeM2} m² ({boothSize})</p>
          <p><span className="t-tertiary">{isAr ? "المنطقة:" : "Zone:"}</span> {boothZone}</p>
          <div className="border-t border-[var(--glass-border)] pt-2 mt-2">
            <p><span className="t-tertiary">{isAr ? "إجمالي السعر:" : "Total Price:"}</span> <span className="font-bold text-[#C5A55A] font-['Inter']">{boothPrice.toLocaleString()} {isAr ? "ر.س" : "SAR"}</span></p>
            <p><span className="t-tertiary">{isAr ? "العربون المدفوع:" : "Deposit Paid:"}</span> <span className="text-green-400 font-['Inter']">{depositAmount.toLocaleString()} {isAr ? "ر.س" : "SAR"}</span></p>
          </div>
        </div>
        <div className="mt-4 p-3 rounded-lg text-[10px] t-muted leading-relaxed" style={{ backgroundColor: "var(--glass-bg)", border: "1px solid var(--glass-border)" }}>
          {isAr
            ? "بالموافقة على هذا العقد، أقر بأنني قرأت واطلعت على جميع الشروط والأحكام الخاصة بحجز الأجنحة في معرض مهام إكسبو، وأوافق على الالتزام بها. يعد هذا العقد ملزماً قانونياً عند إتمام عملية الدفع."
            : "By accepting this contract, I acknowledge that I have read and understood all terms and conditions for booth booking at Maham Expo, and agree to comply with them. This contract becomes legally binding upon payment completion."}
        </div>
      </div>
      <button onClick={onAccept} className="w-full btn-gold py-3 rounded-xl text-sm flex items-center justify-center gap-2">
        <CheckCircle2 size={14} />
        {isAr ? "أوافق على العقد وإرسال للمشرف" : "Accept Contract & Submit for Review"}
      </button>
      <button onClick={onBack} className="w-full glass-card py-2.5 rounded-xl text-xs t-tertiary hover:t-secondary transition-colors">
        {isAr ? "رجوع" : "Back"}
      </button>
    </div>
  );
}

// ─── Inline InteractiveFloorMap Placeholder ──────────────────────
function InteractiveFloorMap({
  booths, selectedBooth, onBoothClick, isAr,
}: {
  booths: Booth[]; selectedBooth: Booth | null; onBoothClick: (b: Booth) => void;
  zoneFilter: string; typeFilter: string; isRTL: boolean; isAr: boolean;
}) {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const MAP_W = 1800;
  const MAP_H = 900;

  const zoneNames: Record<string, { ar: string; en: string; x: number; y: number }> = {
    A: { ar: "غار ثور", en: "Ghar Thawr", x: 175, y: 55 },
    B: { ar: "الجحفة", en: "Al-Juhfah", x: 605, y: 55 },
    C: { ar: "الريم", en: "Al-Reem", x: 1035, y: 55 },
    D: { ar: "العرج", en: "Al-Arj", x: 1465, y: 55 },
    E: { ar: "القاهة", en: "Al-Qahah", x: 175, y: 515 },
    F: { ar: "الروحاء", en: "Al-Rawha", x: 605, y: 515 },
    G: { ar: "ذو الحليفة", en: "Dhul Hulayfah", x: 1035, y: 515 },
    H: { ar: "المدينة المنورة", en: "Al-Madinah", x: 1465, y: 515 },
  };

  return (
    <div className="glass-card rounded-2xl p-4 overflow-x-auto" style={{ boxShadow: isDark ? 'var(--glow-gold)' : '0 4px 20px rgba(0,0,0,0.05)' }}>
      <svg viewBox={`0 0 ${MAP_W} ${MAP_H}`} className="w-full h-auto min-w-[700px]" style={{ minHeight: 350 }}>
        {/* Background */}
        <rect width={MAP_W} height={MAP_H} rx={20} fill={isDark ? "#0A0A14" : "#f8f8f8"} stroke={isDark ? "rgba(197,165,90,0.15)" : "rgba(0,0,0,0.1)"} strokeWidth={2} />
        {/* Zone Labels */}
        {Object.entries(zoneNames).map(([key, z]) => (
          <text key={key} x={z.x} y={z.y} textAnchor="middle" fill="rgba(197,165,90,0.5)" fontSize={13} fontWeight="bold">
            {isAr ? z.ar : z.en} ({key})
          </text>
        ))}
        {/* Booths */}
        {booths.map((b) => {
          const isSelected = selectedBooth?.id === b.id;
          return (
            <g key={b.id} onClick={() => onBoothClick(b)} style={{ cursor: b.status === "sold" ? "not-allowed" : "pointer" }}>
              <rect
                x={b.x} y={b.y} width={b.w} height={b.h} rx={4}
                fill={boothColors[b.status]}
                stroke={isSelected ? "#C5A55A" : boothBorders[b.status]}
                strokeWidth={isSelected ? 3 : 1.5}
              />
              <text x={b.x + b.w / 2} y={b.y + b.h / 2 - 4} textAnchor="middle" fill={isDark ? "#ddd" : "#333"} fontSize={9} fontWeight="bold">
                {b.code}
              </text>
              <text x={b.x + b.w / 2} y={b.y + b.h / 2 + 8} textAnchor="middle" fill={isDark ? "#999" : "#666"} fontSize={7}>
                {b.sizeM2}m²
              </text>
            </g>
          );
        })}
        {/* Central path */}
        <line x1={50} y1={MAP_H / 2} x2={MAP_W - 50} y2={MAP_H / 2} stroke="rgba(197,165,90,0.1)" strokeWidth={2} strokeDasharray="8 4" />
        <text x={MAP_W / 2} y={MAP_H / 2 - 8} textAnchor="middle" fill="rgba(197,165,90,0.3)" fontSize={11}>
          {isAr ? "الممر الرئيسي" : "Main Corridor"}
        </text>
      </svg>
    </div>
  );
}

// ─── Toast helper (simple inline) ────────────────────────────────
function showToast(msg: string, type: "success" | "error" | "info" = "info") {
  if (typeof window === "undefined") return;
  const toast = document.createElement("div");
  toast.className = `fixed top-4 left-1/2 -translate-x-1/2 z-[100] px-5 py-3 rounded-xl text-xs font-semibold shadow-lg transition-all ${
    type === "success" ? "bg-green-500/90 text-white" :
    type === "error" ? "bg-red-500/90 text-white" :
    "bg-[#C5A55A]/90 text-white"
  }`;
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => { toast.style.opacity = "0"; setTimeout(() => toast.remove(), 300); }, 3000);
}

// ═══════════════════════════════════════════════════════════════════
// Main Page Component
// ═══════════════════════════════════════════════════════════════════
export default function ExpoDetailPage() {
  const { language, isRtl } = useLanguageStore();
  const { theme } = useThemeStore();
  const { user } = useAuthStore();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const isDark = theme === "dark";
  const isAr = language === "ar";

  // Mock auth functions (not available in our store yet)
  const canBook = !!user;

  const [pendingBookingId, setPendingBookingId] = useState<string | null>(null);

  // Find the expo from events data
  const expo = events2026.find(e => e.id === id) || events2026[0];
  const [booths, setBooths] = useState<Booth[]>(generateBooths);
  const [selectedBooth, setSelectedBooth] = useState<Booth | null>(null);
  const [holdBooth, setHoldBooth] = useState<Booth | null>(null);
  const [countdown, setCountdown] = useState(0);
  const [zoneFilter, setZoneFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [bookingStep, setBookingStep] = useState<"select" | "confirm" | "deposit_info" | "deposit_pay" | "contract" | "review" | "approved" | "rejected" | "payment">("select");
  const [showVisitRequest, setShowVisitRequest] = useState(false);
  const [depositPaid, setDepositPaid] = useState(false);
  const [reviewStatus, setReviewStatus] = useState<"pending" | "approved" | "rejected">("pending");
  const [reviewTimer, setReviewTimer] = useState(0);
  const [rejectionReason, setRejectionReason] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIdx, setGalleryIdx] = useState(0);
  const [compareList, setCompareList] = useState<Booth[]>([]);
  const [showCompare, setShowCompare] = useState(false);

  const boothTypeLabel = (type: BoothType): string => {
    const map: Record<BoothType, { ar: string; en: string }> = {
      standard: { ar: "عادي", en: "Standard" },
      premium: { ar: "مميز", en: "Premium" },
      corner: { ar: "ركني", en: "Corner" },
      island: { ar: "جزيرة", en: "Island" },
      kiosk: { ar: "كشك", en: "Kiosk" },
    };
    return isAr ? map[type].ar : map[type].en;
  };

  const zoneLabel = (zone: string): string => {
    const map: Record<string, { ar: string; en: string }> = {
      A: { ar: "غار ثور", en: "Ghar Thawr" },
      B: { ar: "الجحفة", en: "Al-Juhfah" },
      C: { ar: "الريم", en: "Al-Reem" },
      D: { ar: "العرج", en: "Al-Arj" },
      E: { ar: "القاهة", en: "Al-Qahah" },
      F: { ar: "الروحاء", en: "Al-Rawha" },
      G: { ar: "ذو الحليفة", en: "Dhul Hulayfah" },
      H: { ar: "المدينة المنورة", en: "Al-Madinah" },
    };
    return map[zone] ? (isAr ? map[zone].ar : map[zone].en) : zone;
  };

  const statusLabel = (status: BoothStatus): string => {
    const map: Record<BoothStatus, { ar: string; en: string }> = {
      available: { ar: "متاح", en: "Available" },
      reserved: { ar: "محجوز", en: "Reserved" },
      sold: { ar: "مباع", en: "Sold" },
      "my-hold": { ar: "تثبيتي", en: "My Hold" },
    };
    return isAr ? map[status].ar : map[status].en;
  };

  // ─── Countdown Timer ──────────────────────────────────────────
  useEffect(() => {
    if (!holdBooth || countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setHoldBooth(null);
          setBookingStep("select");
          showToast(isAr ? "انتهت مدة التثبيت المؤقت" : "Temporary hold expired", "error");
          setBooths(prev2 => prev2.map(b => b.id === holdBooth.id ? { ...b, status: "available" as BoothStatus } : b));
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [holdBooth, countdown, isAr]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  // ─── Booth Handlers ───────────────────────────────────────────
  const handleBoothClick = (booth: Booth) => {
    if (booth.status === "sold") {
      showToast(isAr ? "هذه الوحدة مباعة" : "This unit is sold", "error");
      return;
    }
    if (booth.status === "reserved") {
      showToast(isAr ? "هذه الوحدة محجوزة" : "This unit is reserved", "error");
      return;
    }
    setSelectedBooth(booth);
    setBookingStep("select");
  };

  const handleHoldBooth = () => {
    if (!selectedBooth) return;
    if (!canBook) {
      showToast(isAr ? "يرجى توثيق حسابك أولاً" : "Please verify your account first", "error");
      return;
    }
    setBooths(prev => prev.map(b => b.id === selectedBooth.id ? { ...b, status: "my-hold" as BoothStatus } : b));
    setHoldBooth(selectedBooth);
    setCountdown(30 * 60);
    setBookingStep("confirm");
    showToast(isAr ? "تم تثبيت الوحدة مؤقتاً" : "Unit temporarily held", "success");
  };

  const handleProceedToContract = () => {
    setBookingStep("deposit_info");
  };

  const handleAcceptDepositTerms = () => {
    setBookingStep("deposit_pay");
  };

  const handlePayDeposit = () => {
    if (!holdBooth || !selectedBooth) return;
    const depositAmount = holdBooth.price * 0.05;
    setDepositPaid(true);
    showToast(isAr ? `تم دفع العربون ${depositAmount.toLocaleString()} ر.س بنجاح` : `Deposit of ${depositAmount.toLocaleString()} SAR paid successfully`, "success");
    setBookingStep("contract");
  };

  const handleRequestVisit = () => {
    showToast(isAr ? "تم إرسال طلب الزيارة — سيتم التواصل معك خلال 24 ساعة" : "Visit request sent — we will contact you within 24 hours", "success");
    setShowVisitRequest(false);
  };

  const handleContractAccepted = () => {
    if (!holdBooth) return;
    // Generate a mock booking ID
    const newBookingId = `BK-${Date.now().toString(36).toUpperCase()}`;
    setPendingBookingId(newBookingId);
    setBookingStep("review");
    setReviewStatus("pending");
    setReviewTimer(0);
    showToast(isAr ? "تم إرسال طلبك للمشرف — بانتظار الموافقة (الرد خلال 30 دقيقة)" : "Request sent to supervisor — awaiting approval (response within 30 minutes)", "success");
  };

  // Simulate admin review process (10-15 seconds)
  useEffect(() => {
    if (bookingStep !== "review" || reviewStatus !== "pending") return;
    const timer = setInterval(() => {
      setReviewTimer(prev => {
        const next = prev + 1;
        if (next >= 10 + Math.floor(Math.random() * 5)) {
          clearInterval(timer);
          const approved = Math.random() > 0.1; // 90% approval
          if (approved) {
            setReviewStatus("approved");
            setBookingStep("approved");
            showToast(isAr ? "تمت الموافقة على طلبك! يمكنك الدفع الآن" : "Your request has been approved! You can pay now", "success");
          } else {
            setReviewStatus("rejected");
            setBookingStep("rejected");
            setRejectionReason(isAr ? "لا يتوافق النشاط التجاري مع فئة المعرض. سيتم استرداد العربون كاملاً خلال 5-7 أيام عمل." : "Business activity does not match expo category. Deposit will be fully refunded within 5-7 business days.");
            showToast(isAr ? "تم رفض الطلب — يرجى مراجعة السبب" : "Request rejected — please review the reason", "error");
          }
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [bookingStep, reviewStatus, holdBooth, isAr]);

  const handleProceedToPayment = () => {
    setBookingStep("payment");
  };

  const handleRetryAfterRejection = () => {
    if (!holdBooth) return;
    setBooths(prev => prev.map(b => b.id === holdBooth.id ? { ...b, status: "available" as BoothStatus } : b));
    setHoldBooth(null);
    setSelectedBooth(null);
    setCountdown(0);
    setBookingStep("select");
    setReviewStatus("pending");
    setRejectionReason("");
    showToast(isAr ? "يمكنك اختيار وحدة أخرى" : "You can select another unit", "info");
  };

  const handleBackToConfirm = () => {
    setBookingStep("confirm");
  };

  const handleConfirmPayment = () => {
    if (!holdBooth || !selectedBooth || !pendingBookingId) return;

    setBooths(prev => prev.map(b => b.id === holdBooth.id ? { ...b, status: "sold" as BoothStatus } : b));
    setHoldBooth(null);
    setSelectedBooth(null);
    setCountdown(0);
    setBookingStep("select");

    showToast(isAr ? `تم تأكيد الحجز بنجاح — رقم الحجز: ${pendingBookingId}` : `Booking confirmed — ID: ${pendingBookingId}`, "success");
    setPendingBookingId(null);
    setTimeout(() => router.push("/dashboard"), 2000);
  };

  const handleCancelHold = () => {
    if (!holdBooth) return;
    setBooths(prev => prev.map(b => b.id === holdBooth.id ? { ...b, status: "available" as BoothStatus } : b));
    setHoldBooth(null);
    setSelectedBooth(null);
    setCountdown(0);
    setBookingStep("select");
    showToast(isAr ? "تم إلغاء التثبيت المؤقت" : "Hold cancelled", "info");
  };

  const filteredBooths = useMemo(() => {
    return booths.filter(b => {
      const matchZone = zoneFilter === "all" || b.zone === zoneFilter;
      const matchType = typeFilter === "all" || b.type === typeFilter;
      return matchZone && matchType;
    });
  }, [booths, zoneFilter, typeFilter]);

  const stats = useMemo(() => ({
    total: booths.length,
    available: booths.filter(b => b.status === "available").length,
    reserved: booths.filter(b => b.status === "reserved" || b.status === "my-hold").length,
    sold: booths.filter(b => b.status === "sold").length,
  }), [booths]);

  // Simulated viewer count
  const [viewerCount, setViewerCount] = useState(Math.floor(Math.random() * 15) + 8);
  useEffect(() => {
    const interval = setInterval(() => {
      setViewerCount(prev => Math.max(3, prev + (Math.random() > 0.5 ? 1 : -1)));
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  const scarcityPct = (stats.available / stats.total) * 100;
  const isScarcity = scarcityPct <= 30;

  const BackArrow = isRtl ? ArrowRight : ArrowLeft;

  return (
    <div className="space-y-6">
      {/* Back Navigation */}
      <div className="flex items-center gap-3">
        <Link href="/dashboard/expos">
          <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}
            className="glass-card p-2.5 rounded-xl t-secondary hover:text-[#C5A55A] transition-colors">
            <BackArrow size={18} />
          </motion.button>
        </Link>
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-bold text-gold-gradient" style={{ fontFamily: "'Playfair Display', 'IBM Plex Sans Arabic', serif" }}>
            {isAr ? "مخطط الطابق" : "Floor Plan"}
          </h2>
          <p className="text-[10px] t-muted truncate">{isAr ? expo.nameAr : expo.nameEn}</p>
        </div>
        {/* Live viewers */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ backgroundColor: "rgba(74, 222, 128, 0.08)", border: "1px solid rgba(74, 222, 128, 0.15)" }}>
          <div className="w-1.5 h-1.5 rounded-full bg-[var(--status-green)] animate-pulse" />
          <Eye size={11} className="text-[var(--status-green)]" />
          <span className="text-[10px] text-[var(--status-green)] font-['Inter']">{viewerCount}</span>
          <span className="text-[9px] t-muted">{isAr ? "يشاهدون الآن" : "viewing now"}</span>
        </div>
      </div>

      {/* Scarcity Alert */}
      {isScarcity && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 px-3 py-2 rounded-xl"
          style={{ backgroundColor: scarcityPct <= 15 ? "rgba(239, 68, 68, 0.08)" : "rgba(251, 191, 36, 0.08)", border: `1px solid ${scarcityPct <= 15 ? "rgba(239, 68, 68, 0.15)" : "rgba(251, 191, 36, 0.15)"}` }}>
          <Flame size={14} className={scarcityPct <= 15 ? "text-[var(--status-red)] animate-pulse" : "text-[var(--status-yellow)]"} />
          <p className="text-[11px] t-secondary flex-1">
            {isAr ? `بقي ${stats.available} وحدة فقط!` : `Only ${stats.available} units left!`}
          </p>
          <span className="text-[9px] t-muted font-['Inter']">
            {isAr ? `${viewerCount} يشاهدون الآن` : `${viewerCount} viewing now`}
          </span>
        </motion.div>
      )}

      {/* Countdown Banner */}
      <AnimatePresence>
        {holdBooth && countdown > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass-card rounded-2xl p-4 border-[rgba(197,165,90,0.3)] bg-[rgba(197,165,90,0.05)]"
          >
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#C5A55A]/15 flex items-center justify-center">
                  <Timer size={18} className="text-[#C5A55A]" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#E8D5A3]">
                    {isAr ? "تثبيت مؤقت" : "Temporary Hold"} — {holdBooth.code}
                  </p>
                  <p className="text-[10px] t-tertiary">
                    {isAr ? "أكمل الدفع قبل انتهاء المدة" : "Complete payment before time expires"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className={`text-2xl font-bold font-['Inter'] tabular-nums ${countdown < 300 ? "text-red-400 animate-pulse" : "text-[#C5A55A]"}`}>
                  {formatTime(countdown)}
                </div>
                <button
                  onClick={handleCancelHold}
                  className="glass-card px-3 py-1.5 rounded-lg text-xs text-red-400/70 hover:text-red-400 transition-colors"
                >
                  {isAr ? "إلغاء" : "Cancel"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expo Info Bar */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
        className="glass-card rounded-2xl p-5" style={{ boxShadow: isDark ? 'var(--glow-gold)' : '0 4px 20px rgba(0,0,0,0.05)' }}>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="flex items-center gap-2">
            <MapPin size={14} className="text-[#C5A55A]/60" />
            <p className="text-xs t-secondary">{isAr ? expo.city : expo.cityEn}</p>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-[#C5A55A]/60" />
            <p className="text-xs t-secondary font-['Inter']">{expo.dateStart} — {expo.dateEnd}</p>
          </div>
          <div className="flex items-center gap-2">
            <Users size={14} className="text-[#C5A55A]/60" />
            <p className="text-xs t-secondary">45,000+ {isAr ? "زائر متوقع" : "expected visitors"}</p>
          </div>
          <div className="flex items-center gap-2">
            <Star size={14} className="text-[#FBBF24]" />
            <p className="text-xs t-secondary font-['Inter']">4.8/5 {isAr ? "تقييم" : "rating"}</p>
          </div>
          <div className="flex items-center gap-2">
            <Shield size={14} className="text-green-400/60" />
            <p className="text-xs text-green-400/70">{isAr ? "مرخص رسمياً" : "Officially Licensed"}</p>
          </div>
        </div>
      </motion.div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: isAr ? "إجمالي الوحدات" : "Total Units", value: stats.total, color: "t-secondary" },
          { label: isAr ? "متاح" : "Available", value: stats.available, color: "text-green-400" },
          { label: isAr ? "محجوز" : "Reserved", value: stats.reserved, color: "text-yellow-400" },
          { label: isAr ? "مباع" : "Sold", value: stats.sold, color: "text-red-400" },
        ].map((s, i) => (
          <motion.div key={i} whileHover={{ scale: 1.03, y: -2 }} className="glass-card rounded-xl p-3 text-center cursor-default">
            <p className={`text-xl font-bold font-['Inter'] ${s.color}`}>{s.value}</p>
            <p className="text-[10px] t-tertiary mt-0.5">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Action Buttons: Visit Request + Compare */}
      <div className="flex gap-3 flex-wrap">
        <button
          onClick={() => setShowVisitRequest(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all hover:scale-[1.02]" style={{ backgroundColor: "rgba(197,165,90,0.08)", border: "1px solid rgba(197,165,90,0.2)", color: "#C5A55A" }}
        >
          <MapPin size={14} />
          {isAr ? "طلب زيارة الموقع — 1,500 ر.س" : "Request Site Visit — 1,500 SAR"}
        </button>
      </div>

      {/* Visit Request Modal */}
      <AnimatePresence>
        {showVisitRequest && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
            onClick={() => setShowVisitRequest(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card rounded-2xl p-6 max-w-md w-full space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center" style={{ background: "rgba(197,165,90,0.1)", border: "2px solid rgba(197,165,90,0.2)" }}>
                  <MapPin size={28} className="text-[#C5A55A]" />
                </div>
                <h3 className="text-lg font-bold t-secondary mb-1">
                  {isAr ? "طلب زيارة الموقع" : "Request Site Visit"}
                </h3>
                <p className="text-xs t-tertiary leading-relaxed">
                  {isAr
                    ? "يمكنك زيارة الموقع والاطلاع على الوحدات المتاحة ميدانياً قبل اتخاذ قرار الحجز. سيتم ترتيب الزيارة مع فريق مهام إكسبو خلال 24 ساعة."
                    : "Visit the site and view available units in person before making a booking decision. The visit will be arranged with the Maham Expo team within 24 hours."}
                </p>
              </div>

              <div className="glass-card rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="t-tertiary">{isAr ? "رسوم الزيارة" : "Visit Fee"}</span>
                  <span className="t-secondary font-bold font-['Inter']">1,500 {isAr ? "ر.س" : "SAR"}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="t-tertiary">{isAr ? "المدة" : "Duration"}</span>
                  <span className="t-secondary">{isAr ? "ساعتان" : "2 hours"}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="t-tertiary">{isAr ? "يشمل" : "Includes"}</span>
                  <span className="t-secondary">{isAr ? "جولة + مرافق + استشارة" : "Tour + Guide + Consultation"}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl text-[9px] t-muted" style={{ backgroundColor: "rgba(74,222,128,0.03)", border: "1px solid rgba(74,222,128,0.1)" }}>
                {isAr
                  ? "ملاحظة: في حال حجز وحدة بعد الزيارة، يتم خصم رسوم الزيارة من إجمالي قيمة العقد."
                  : "Note: If you book a unit after the visit, the visit fee will be deducted from the total contract value."}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowVisitRequest(false)}
                  className="flex-1 glass-card py-2.5 rounded-xl text-xs t-tertiary hover:t-secondary transition-colors"
                >
                  {isAr ? "إلغاء" : "Cancel"}
                </button>
                <button
                  onClick={handleRequestVisit}
                  className="flex-1 btn-gold py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2"
                >
                  <CheckCircle2 size={12} />
                  {isAr ? "تأكيد طلب الزيارة" : "Confirm Visit Request"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <select
          value={zoneFilter}
          onChange={(e) => setZoneFilter(e.target.value)}
          className="bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-lg px-3 py-2 text-xs t-secondary focus:outline-none gold-focus"
        >
          <option value="all" className="bg-[#0A0A12]">{isAr ? "جميع المناطق" : "All Zones"}</option>
          <option value="A" className="bg-[#0A0A12]">{isAr ? "غار ثور" : "Ghar Thawr"} (A)</option>
          <option value="B" className="bg-[#0A0A12]">{isAr ? "الجحفة" : "Al-Juhfah"} (B)</option>
          <option value="C" className="bg-[#0A0A12]">{isAr ? "الريم" : "Al-Reem"} (C)</option>
          <option value="D" className="bg-[#0A0A12]">{isAr ? "العرج" : "Al-Arj"} (D)</option>
          <option value="E" className="bg-[#0A0A12]">{isAr ? "القاهة" : "Al-Qahah"} (E)</option>
          <option value="F" className="bg-[#0A0A12]">{isAr ? "الروحاء" : "Al-Rawha"} (F)</option>
          <option value="G" className="bg-[#0A0A12]">{isAr ? "ذو الحليفة" : "Dhul Hulayfah"} (G)</option>
          <option value="H" className="bg-[#0A0A12]">{isAr ? "المدينة المنورة" : "Al-Madinah"} (H)</option>
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-lg px-3 py-2 text-xs t-secondary focus:outline-none gold-focus"
        >
          <option value="all" className="bg-[#0A0A12]">{isAr ? "جميع الأنواع" : "All Types"}</option>
          <option value="standard" className="bg-[#0A0A12]">{isAr ? "عادي" : "Standard"}</option>
          <option value="premium" className="bg-[#0A0A12]">{isAr ? "مميز" : "Premium"}</option>
          <option value="corner" className="bg-[#0A0A12]">{isAr ? "ركني" : "Corner"}</option>
          <option value="island" className="bg-[#0A0A12]">{isAr ? "جزيرة" : "Island"}</option>
          <option value="kiosk" className="bg-[#0A0A12]">{isAr ? "كشك" : "Kiosk"}</option>
        </select>
        {/* Legend */}
        <div className={`flex items-center gap-4 ${isRtl ? 'mr-auto' : 'ml-auto'}`}>
          {(["available", "reserved", "sold", "my-hold"] as BoothStatus[]).map((s) => (
            <div key={s} className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: boothColors[s], border: `1px solid ${boothBorders[s]}` }} />
              <span className="text-[10px] t-tertiary">{statusLabel(s)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Booth Map + Detail Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Interactive Floor Map */}
        <div className="lg:col-span-2">
          <InteractiveFloorMap
            booths={filteredBooths}
            selectedBooth={selectedBooth}
            onBoothClick={handleBoothClick}
            zoneFilter={zoneFilter}
            typeFilter={typeFilter}
            isRTL={isRtl}
            isAr={isAr}
          />
        </div>

        {/* Detail Panel */}
        <div className="space-y-4">
          {selectedBooth ? (
            <motion.div
              initial={{ opacity: 0, x: isRtl ? -10 : 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card rounded-2xl p-5 border-[rgba(197,165,90,0.15)]"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-[#E8D5A3]">{selectedBooth.code}</h3>
                  <p className="text-[10px] t-tertiary">{zoneLabel(selectedBooth.zone)}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-lg text-[10px] ${
                  selectedBooth.status === "available" ? "bg-green-400/15 text-green-400" :
                  selectedBooth.status === "my-hold" ? "bg-[#C5A55A]/15 text-[#C5A55A]" :
                  "bg-yellow-400/15 text-yellow-400"
                }`}>
                  {statusLabel(selectedBooth.status)}
                </span>
              </div>

              {/* Booth Gallery */}
              {bookingStep === "select" && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <ImageIcon size={12} className="t-gold" />
                      <span className="text-[10px] font-bold t-secondary">{isAr ? "صور الوحدة" : "Unit Gallery"}</span>
                    </div>
                    <button onClick={() => { setGalleryOpen(true); setGalleryIdx(0); }} className="text-[9px] t-gold hover:underline">
                      {isAr ? "عرض الكل" : "View All"}
                    </button>
                  </div>
                  <div className="flex gap-1.5 overflow-x-auto pb-1">
                    {boothGallery[selectedBooth.type]?.map((img, i) => (
                      <button key={i} onClick={() => { setGalleryOpen(true); setGalleryIdx(i); }}
                        className="shrink-0 w-20 h-14 rounded-lg overflow-hidden border border-[var(--glass-border)] hover:border-[#C5A55A] transition-colors">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={img.url} alt={isAr ? img.label : img.labelEn} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Gallery Lightbox */}
              <AnimatePresence>
                {galleryOpen && selectedBooth && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.9)" }}
                    onClick={() => setGalleryOpen(false)}>
                    <div className="relative max-w-lg w-full" onClick={e => e.stopPropagation()}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={boothGallery[selectedBooth.type]?.[galleryIdx]?.url} className="w-full rounded-xl" alt="" />
                      <p className="text-center text-xs t-secondary mt-2">
                        {isAr ? boothGallery[selectedBooth.type]?.[galleryIdx]?.label : boothGallery[selectedBooth.type]?.[galleryIdx]?.labelEn}
                      </p>
                      <div className="flex justify-center gap-3 mt-3">
                        <button onClick={() => setGalleryIdx(prev => Math.max(0, prev - 1))} className="glass-card p-2 rounded-full"><ChevronLeft size={16} className="t-secondary" /></button>
                        <span className="text-xs t-muted self-center font-['Inter']">{galleryIdx + 1} / {boothGallery[selectedBooth.type]?.length}</span>
                        <button onClick={() => setGalleryIdx(prev => Math.min((boothGallery[selectedBooth.type]?.length || 1) - 1, prev + 1))} className="glass-card p-2 rounded-full"><ChevronRight size={16} className="t-secondary" /></button>
                      </div>
                      <button onClick={() => setGalleryOpen(false)} className="absolute top-2 right-2 glass-card p-1.5 rounded-full">
                        <X size={14} className="t-secondary" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Booth Details */}
              <div className="space-y-3 mb-5">
                <div className="flex items-center justify-between py-2 border-b border-[var(--glass-border)]">
                  <span className="text-xs t-tertiary flex items-center gap-2"><Building2 size={12} /> {isAr ? "النوع" : "Type"}</span>
                  <span className="text-xs t-secondary">{boothTypeLabel(selectedBooth.type)}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-[var(--glass-border)]">
                  <span className="text-xs t-tertiary flex items-center gap-2"><Ruler size={12} /> {isAr ? "المساحة" : "Area"}</span>
                  <span className="text-xs t-secondary font-['Inter']">{selectedBooth.sizeM2} m² ({selectedBooth.size})</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-[var(--glass-border)]">
                  <span className="text-xs t-tertiary flex items-center gap-2"><Maximize2 size={12} /> {isAr ? "الأبعاد" : "Dimensions"}</span>
                  <span className="text-xs t-secondary font-['Inter']">{selectedBooth.dimensions}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-[var(--glass-border)]">
                  <span className="text-xs t-tertiary flex items-center gap-2"><Layers size={12} /> {isAr ? "الواجهات" : "Frontage"}</span>
                  <span className="text-xs t-secondary font-['Inter']">{selectedBooth.faces} {isAr ? "واجهة" : "face(s)"}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-[var(--glass-border)]">
                  <span className="text-xs t-tertiary flex items-center gap-2"><MapPin size={12} /> {isAr ? "المنطقة" : "Zone"}</span>
                  <span className="text-xs t-secondary">{zoneLabel(selectedBooth.zone)}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-xs t-tertiary flex items-center gap-2"><Zap size={12} /> {isAr ? "المميزات" : "Features"}</span>
                  <div className="flex gap-1 flex-wrap justify-end">
                    {selectedBooth.featureKeys.map((fk, i) => (
                      <span key={i} className="px-1.5 py-0.5 rounded bg-[var(--glass-bg)] text-[9px] t-secondary">{featureLabel(fk, isAr)}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="glass-card rounded-xl p-4 mb-4 text-center">
                <p className="text-[10px] t-tertiary mb-1">{isAr ? "السعر الإجمالي" : "Total Price"}</p>
                <p className="text-2xl font-bold text-[#C5A55A] font-['Inter']">
                  {selectedBooth.price.toLocaleString()} <span className="text-sm t-tertiary">{isAr ? "ر.س" : "SAR"}</span>
                </p>
                <p className="text-[10px] t-muted mt-1">{isAr ? "شامل ضريبة القيمة المضافة" : "VAT included"}</p>
              </div>

              {/* Booking Steps Indicator */}
              {bookingStep !== "select" && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    {[
                      { key: "confirm", ar: "التأكيد", en: "Confirm" },
                      { key: "deposit_info", ar: "العربون", en: "Deposit" },
                      { key: "contract", ar: "العقد", en: "Contract" },
                      { key: "review", ar: "المراجعة", en: "Review" },
                      { key: "payment", ar: "الدفع", en: "Payment" },
                    ].map((step, i, arr) => {
                      const stepOrder = ["confirm", "deposit_info", "deposit_pay", "contract", "review", "approved", "payment"];
                      const currentIdx = stepOrder.indexOf(bookingStep);
                      const stepIdx = stepOrder.indexOf(step.key);
                      const isActive = stepIdx <= currentIdx;
                      const isCurrent = step.key === bookingStep || (bookingStep === "approved" && step.key === "review");
                      return (
                        <div key={step.key} className="flex items-center flex-1">
                          <div className="flex flex-col items-center flex-1">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold transition-all ${
                              isCurrent ? "bg-[#C5A55A] text-[#0A0A12]" :
                              isActive ? "bg-green-400/20 text-green-400 border border-green-400/30" :
                              "bg-[var(--glass-bg)] t-muted border border-[var(--glass-border)]"
                            }`}>{i + 1}</div>
                            <span className={`text-[8px] mt-1 ${isCurrent ? "text-[#C5A55A] font-bold" : isActive ? "text-green-400" : "t-muted"}`}>
                              {isAr ? step.ar : step.en}
                            </span>
                          </div>
                          {i < arr.length - 1 && (
                            <div className={`h-0.5 flex-1 mx-1 rounded-full transition-all ${stepIdx < currentIdx ? "bg-green-400/30" : "bg-[var(--glass-border)]"}`} />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Booking Actions */}
              {bookingStep === "select" && selectedBooth.status === "available" && (
                <div className="space-y-3">
                  <button
                    onClick={handleHoldBooth}
                    className="w-full btn-gold py-3 rounded-xl text-sm flex items-center justify-center gap-2"
                  >
                    <Lock size={14} />
                    {isAr ? "تثبيت الوحدة (30 دقيقة)" : "Hold Unit (30 min)"}
                  </button>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        if (compareList.find(b => b.id === selectedBooth.id)) {
                          setCompareList(prev => prev.filter(b => b.id !== selectedBooth.id));
                        } else if (compareList.length < 3) {
                          setCompareList(prev => [...prev, selectedBooth]);
                        } else {
                          showToast(isAr ? "الحد الأقصى 3 وحدات للمقارنة" : "Max 3 booths to compare", "info");
                        }
                      }}
                      className={`flex-1 py-2 rounded-xl text-[11px] flex items-center justify-center gap-1.5 border transition-colors ${
                        compareList.find(b => b.id === selectedBooth.id)
                          ? "border-[#C5A55A] bg-[#C5A55A]/10 text-[#C5A55A]"
                          : "border-[var(--glass-border)] t-tertiary hover:border-[#C5A55A]/50"
                      }`}
                    >
                      <BarChart3 size={12} />
                      {compareList.find(b => b.id === selectedBooth.id)
                        ? (isAr ? "تمت الإضافة" : "Added")
                        : (isAr ? "أضف للمقارنة" : "Compare")}
                    </button>
                    {compareList.length >= 2 && (
                      <button
                        onClick={() => setShowCompare(true)}
                        className="flex-1 py-2 rounded-xl text-[11px] btn-gold flex items-center justify-center gap-1.5"
                      >
                        <BarChart3 size={12} />
                        {isAr ? `قارن (${compareList.length})` : `Compare (${compareList.length})`}
                      </button>
                    )}
                  </div>
                  <p className="text-[9px] t-muted text-center flex items-center justify-center gap-1">
                    <Info size={10} /> {isAr ? "التثبيت مؤقت لمدة 30 دقيقة فقط" : "Hold is temporary for 30 minutes only"}
                  </p>
                </div>
              )}

              {bookingStep === "confirm" && (
                <div className="space-y-3">
                  <div className="glass-card rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield size={14} className="text-green-400/70" />
                      <p className="text-xs text-green-400/70">{isAr ? "إقرار قانوني" : "Legal Acknowledgment"}</p>
                    </div>
                    <p className="text-[10px] t-tertiary leading-relaxed">
                      {isAr
                        ? "أقر بأنني اطلعت على جميع تفاصيل الوحدة المختارة وشروط الحجز والإلغاء، وأوافق على الالتزام بسياسات المعرض."
                        : "I acknowledge that I have reviewed all details of the selected unit and booking/cancellation terms, and agree to comply with expo policies."}
                    </p>
                    <label className="flex items-start gap-2 mt-3 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                        className="mt-0.5 accent-[var(--gold-accent)] w-4 h-4 rounded shrink-0"
                      />
                      <span className="text-[11px] t-secondary leading-relaxed">
                        {isAr ? "أوافق على الشروط والأحكام" : "I accept the terms and conditions"}
                      </span>
                    </label>
                  </div>
                  <button
                    onClick={handleProceedToContract}
                    disabled={!termsAccepted}
                    className={`w-full py-3 rounded-xl text-sm flex items-center justify-center gap-2 transition-all ${
                      termsAccepted ? "btn-gold" : "opacity-40 cursor-not-allowed bg-gray-600"
                    }`}
                  >
                    <FileText size={14} />
                    {isAr ? "معاينة العقد والمتابعة" : "Review Contract & Continue"}
                  </button>
                  <button
                    onClick={handleCancelHold}
                    className="w-full glass-card py-2.5 rounded-xl text-xs text-red-400/60 hover:text-red-400 transition-colors"
                  >
                    {isAr ? "إلغاء التثبيت" : "Cancel Hold"}
                  </button>
                </div>
              )}

              {/* Deposit Info Step */}
              {bookingStep === "deposit_info" && holdBooth && (
                <div className="space-y-3">
                  <div className="glass-card rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <CreditCard size={16} className="text-[#C5A55A]" />
                      <h4 className="text-sm font-bold t-primary">{isAr ? "عربون تثبيت الحجز" : "Booking Deposit"}</h4>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="t-secondary">{isAr ? "سعر الوحدة" : "Unit Price"}</span>
                        <span className="t-primary font-bold font-['Inter']">{holdBooth.price.toLocaleString()} {isAr ? "ر.س" : "SAR"}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="t-secondary">{isAr ? "نسبة العربون" : "Deposit Rate"}</span>
                        <span className="text-[#C5A55A] font-bold font-['Inter']">5%</span>
                      </div>
                      <div className="border-t border-[var(--glass-border)] pt-2 flex justify-between text-xs">
                        <span className="t-primary font-bold">{isAr ? "مبلغ العربون المطلوب" : "Required Deposit"}</span>
                        <span className="text-[#C5A55A] font-bold text-base font-['Inter']">{(holdBooth.price * 0.05).toLocaleString()} {isAr ? "ر.س" : "SAR"}</span>
                      </div>
                    </div>
                  </div>
                  <div className="glass-card rounded-xl p-3 border-l-2 border-amber-500/50">
                    <div className="flex items-start gap-2">
                      <Info size={14} className="text-amber-400 shrink-0 mt-0.5" />
                      <div className="text-[10px] t-secondary leading-relaxed space-y-1">
                        <p className="font-semibold t-primary">{isAr ? "سياسة العربون:" : "Deposit Policy:"}</p>
                        <p>{isAr ? "يُدفع العربون (5%) لتثبيت حجزك قبل إرسال الطلب للمشرف" : "Deposit (5%) is paid to secure your booking before supervisor review"}</p>
                        <p>{isAr ? "سيتم مراجعة طلبك خلال 30 دقيقة كحد أقصى" : "Your request will be reviewed within 30 minutes maximum"}</p>
                        <p className="text-green-400">{isAr ? "في حال الرفض: يُسترد العربون كاملاً خلال 5-7 أيام عمل" : "If rejected: deposit is fully refunded within 5-7 business days"}</p>
                        <p>{isAr ? "في حال الموافقة: يُخصم العربون من إجمالي المبلغ عند إتمام الدفع" : "If approved: deposit is deducted from total amount upon final payment"}</p>
                      </div>
                    </div>
                  </div>
                  <button onClick={handleAcceptDepositTerms} className="w-full btn-gold py-3 rounded-xl text-sm flex items-center justify-center gap-2">
                    <CreditCard size={14} />
                    {isAr ? "موافق — المتابعة لدفع العربون" : "Agree — Proceed to Pay Deposit"}
                  </button>
                  <button onClick={() => setBookingStep("confirm")} className="w-full glass-card py-2.5 rounded-xl text-xs t-tertiary hover:t-secondary transition-colors">
                    {isAr ? "رجوع" : "Back"}
                  </button>
                </div>
              )}

              {/* Deposit Payment Step */}
              {bookingStep === "deposit_pay" && holdBooth && (
                <div className="space-y-3">
                  <div className="glass-card rounded-xl p-4 text-center">
                    <div className="w-14 h-14 mx-auto mb-3 rounded-full flex items-center justify-center" style={{ background: "rgba(197,165,90,0.1)", border: "2px solid rgba(197,165,90,0.3)" }}>
                      <CreditCard size={24} className="text-[#C5A55A]" />
                    </div>
                    <h4 className="text-sm font-bold t-primary mb-1">{isAr ? "دفع العربون" : "Pay Deposit"}</h4>
                    <p className="text-2xl font-bold text-[#C5A55A] font-['Inter'] mb-1">{(holdBooth.price * 0.05).toLocaleString()} <span className="text-sm">{isAr ? "ر.س" : "SAR"}</span></p>
                    <p className="text-[10px] t-muted">{isAr ? "شامل ضريبة القيمة المضافة" : "VAT included"}</p>
                  </div>
                  <div className="glass-card rounded-xl p-3">
                    <p className="text-[10px] t-secondary text-center">{isAr ? "اختر طريقة الدفع" : "Select Payment Method"}</p>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {[
                        { icon: "CC", label: isAr ? "بطاقة ائتمان" : "Credit Card" },
                        { icon: "MD", label: isAr ? "مدى" : "Mada" },
                        { icon: "BT", label: isAr ? "تحويل بنكي" : "Bank Transfer" },
                        { icon: "AP", label: "Apple Pay" },
                      ].map((m, i) => (
                        <button key={i} onClick={handlePayDeposit} className="glass-card p-2.5 rounded-lg text-center hover:border-[#C5A55A]/50 transition-all border border-transparent">
                          <span className="text-lg block mb-0.5 font-bold text-[#C5A55A]">{m.icon}</span>
                          <span className="text-[10px] t-secondary">{m.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <button onClick={() => setBookingStep("deposit_info")} className="w-full glass-card py-2.5 rounded-xl text-xs t-tertiary hover:t-secondary transition-colors">
                    {isAr ? "رجوع" : "Back"}
                  </button>
                </div>
              )}

              {bookingStep === "contract" && selectedBooth && (
                <ContractPreview
                  boothCode={selectedBooth.code}
                  boothType={boothTypeLabel(selectedBooth.type)}
                  boothSize={selectedBooth.size}
                  boothSizeM2={selectedBooth.sizeM2}
                  boothZone={`${isAr ? "المنطقة" : "Zone"} ${selectedBooth.zone} — ${zoneLabel(selectedBooth.zone)}`}
                  boothPrice={selectedBooth.price}
                  depositAmount={selectedBooth.price * 0.05}
                  expoNameAr={expo.nameAr}
                  expoNameEn={expo.nameEn}
                  expoLocation={expo.location}
                  expoDate={`${expo.dateStart} — ${expo.dateEnd}`}
                  onAccept={handleContractAccepted}
                  onBack={handleBackToConfirm}
                />
              )}

              {/* Admin Review Step */}
              {bookingStep === "review" && (
                <div className="space-y-4">
                  <div className="glass-card rounded-xl p-5 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: "rgba(251,191,36,0.1)", border: "2px solid rgba(251,191,36,0.2)" }}>
                      <Clock size={28} className="text-yellow-400 animate-spin" style={{ animationDuration: "3s" }} />
                    </div>
                    <h4 className="text-sm font-bold t-secondary mb-2">
                      {isAr ? "بانتظار موافقة المشرف" : "Awaiting Supervisor Approval"}
                    </h4>
                    <p className="text-[10px] t-tertiary leading-relaxed mb-3">
                      {isAr
                        ? "تم إرسال طلبك للمشرف لمراجعة ملفك التجاري والتحقق من توافق نشاطك مع فئة المعرض. ستتلقى إشعاراً بالنتيجة خلال دقائق."
                        : "Your request has been sent to the supervisor to review your business profile and verify compatibility with the expo category. You will receive a notification shortly."}
                    </p>
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                      <span className="text-[11px] text-yellow-400 font-['Inter']">
                        {isAr ? `جاري المراجعة... (${reviewTimer}s)` : `Reviewing... (${reviewTimer}s)`}
                      </span>
                    </div>
                    {/* Progress bar */}
                    <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "var(--glass-bg)" }}>
                      <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${Math.min(reviewTimer * 8, 95)}%`, background: "linear-gradient(90deg, var(--gold-accent), var(--status-yellow))" }} />
                    </div>
                    <p className="text-[8px] t-muted mt-2">
                      {isAr ? "المراجعة تتم عادة خلال 1-5 دقائق" : "Review usually takes 1-5 minutes"}
                    </p>
                  </div>

                  {/* What's being reviewed */}
                  <div className="glass-card rounded-xl p-3">
                    <p className="text-[9px] t-muted mb-2">{isAr ? "ما يتم مراجعته:" : "What's being reviewed:"}</p>
                    <div className="space-y-1.5">
                      {[
                        { ar: "الملف التجاري والسجل التجاري", en: "Business profile & commercial registration", done: reviewTimer > 3 },
                        { ar: "توافق النشاط مع فئة المعرض", en: "Activity compatibility with expo category", done: reviewTimer > 6 },
                        { ar: "التحقق من بيانات KYC", en: "KYC data verification", done: reviewTimer > 8 },
                        { ar: "الموافقة النهائية", en: "Final approval", done: false },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-2">
                          {item.done ? (
                            <CheckCircle2 size={12} className="text-green-400 shrink-0" />
                          ) : (
                            <div className="w-3 h-3 rounded-full border border-[var(--glass-border)] shrink-0" />
                          )}
                          <span className={`text-[10px] ${item.done ? "t-secondary" : "t-muted"}`}>
                            {isAr ? item.ar : item.en}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleCancelHold}
                    className="w-full glass-card py-2.5 rounded-xl text-xs text-red-400/60 hover:text-red-400 transition-colors"
                  >
                    {isAr ? "إلغاء التثبيت" : "Cancel Hold"}
                  </button>
                </div>
              )}

              {/* Approved — Proceed to Payment */}
              {bookingStep === "approved" && (
                <div className="space-y-4">
                  <div className="glass-card rounded-xl p-5 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: "rgba(74,222,128,0.1)", border: "2px solid rgba(74,222,128,0.2)" }}>
                      <CheckCircle2 size={28} className="text-green-400" />
                    </div>
                    <h4 className="text-sm font-bold text-green-400 mb-2">
                      {isAr ? "تمت الموافقة على طلبك!" : "Your Request is Approved!"}
                    </h4>
                    <p className="text-[10px] t-tertiary leading-relaxed mb-3">
                      {isAr
                        ? `تمت الموافقة على طلبك من قبل المشرف. تم دفع العربون (${(selectedBooth!.price * 0.05).toLocaleString()} ر.س) مسبقاً. المتبقي: ${(selectedBooth!.price * 0.95).toLocaleString()} ر.س لإتمام الحجز.`
                        : `Your request has been approved. Deposit (${(selectedBooth!.price * 0.05).toLocaleString()} SAR) already paid. Remaining: ${(selectedBooth!.price * 0.95).toLocaleString()} SAR to complete booking.`}
                    </p>
                    <div className="flex items-center justify-center gap-3 mb-3">
                      <div className="flex items-center gap-1 px-2 py-1 rounded-full" style={{ backgroundColor: "rgba(74,222,128,0.08)" }}>
                        <Phone size={10} className="text-green-400" />
                        <span className="text-[8px] text-green-400">SMS</span>
                      </div>
                      <div className="flex items-center gap-1 px-2 py-1 rounded-full" style={{ backgroundColor: "rgba(74,222,128,0.08)" }}>
                        <Mail size={10} className="text-green-400" />
                        <span className="text-[8px] text-green-400">Email</span>
                      </div>
                      <div className="flex items-center gap-1 px-2 py-1 rounded-full" style={{ backgroundColor: "rgba(74,222,128,0.08)" }}>
                        <CreditCard size={10} className="text-green-400" />
                        <span className="text-[8px] text-green-400">Apple Pay</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleProceedToPayment}
                    className="w-full btn-gold py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 font-bold"
                  >
                    <CreditCard size={14} />
                    {isAr ? `ادفع المتبقي — ${(selectedBooth!.price * 0.95).toLocaleString()} ر.س` : `Pay Remaining — ${(selectedBooth!.price * 0.95).toLocaleString()} SAR`}
                  </button>
                  <p className="text-[8px] t-muted text-center">
                    {isAr ? "يجب إتمام الدفع خلال فترة التثبيت المؤقت — العربون تم دفعه مسبقاً" : "Payment must be completed within the hold period — deposit already paid"}
                  </p>
                </div>
              )}

              {/* Rejected */}
              {bookingStep === "rejected" && (
                <div className="space-y-4">
                  <div className="glass-card rounded-xl p-5 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: "rgba(239,68,68,0.1)", border: "2px solid rgba(239,68,68,0.2)" }}>
                      <AlertTriangle size={28} className="text-red-400" />
                    </div>
                    <h4 className="text-sm font-bold text-red-400 mb-2">
                      {isAr ? "تم رفض الطلب" : "Request Rejected"}
                    </h4>
                    <p className="text-[10px] t-tertiary leading-relaxed mb-3">
                      {isAr
                        ? "نأسف، تم رفض طلبك من قبل الجهة المشغلة. يمكنك التواصل مع الدعم أو اختيار وحدة أخرى."
                        : "Sorry, your request has been rejected by the operator. You can contact support or select another unit."}
                    </p>
                    {/* Deposit Refund Notice */}
                    <div className="p-3 rounded-xl mb-3" style={{ backgroundColor: "rgba(74,222,128,0.05)", border: "1px solid rgba(74,222,128,0.15)" }}>
                      <div className="flex items-center gap-2 mb-1">
                        <CreditCard size={12} className="text-green-400" />
                        <span className="text-[10px] text-green-400 font-bold">
                          {isAr ? "استرداد العربون" : "Deposit Refund"}
                        </span>
                      </div>
                      <p className="text-[9px] t-secondary leading-relaxed">
                        {isAr
                          ? `سيتم استرداد مبلغ العربون (${selectedBooth ? (selectedBooth.price * 0.05).toLocaleString() : "0"} ر.س) كاملاً إلى حسابك خلال 5-7 أيام عمل.`
                          : `Your deposit (${selectedBooth ? (selectedBooth.price * 0.05).toLocaleString() : "0"} SAR) will be fully refunded to your account within 5-7 business days.`}
                      </p>
                    </div>
                    {rejectionReason && (
                      <div className="p-2.5 rounded-lg mb-3" style={{ backgroundColor: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.15)" }}>
                        <p className="text-[9px] t-muted mb-1">{isAr ? "سبب الرفض:" : "Reason:"}</p>
                        <p className="text-[10px] text-red-400">{rejectionReason}</p>
                      </div>
                    )}
                    <div className="flex items-center justify-center gap-2 text-[9px] t-muted">
                      <Phone size={10} />
                      <span>00966535555900</span>
                      <span>|</span>
                      <Mail size={10} />
                      <span>rent@mahamexpo.sa</span>
                    </div>
                  </div>

                  <button
                    onClick={handleRetryAfterRejection}
                    className="w-full btn-gold py-3 rounded-xl text-sm flex items-center justify-center gap-2"
                  >
                    {isAr ? "اختيار وحدة أخرى" : "Select Another Unit"}
                  </button>
                  <Link href="/dashboard/help">
                    <button className="w-full glass-card py-2.5 rounded-xl text-xs t-tertiary hover:t-secondary transition-colors text-center">
                      {isAr ? "تواصل مع الدعم" : "Contact Support"}
                    </button>
                  </Link>
                </div>
              )}

              {bookingStep === "payment" && (
                <div className="space-y-4">
                  {/* Contract Accepted Badge */}
                  <div className="flex items-center gap-2 p-3 rounded-xl" style={{ backgroundColor: "rgba(74,222,128,0.05)", border: "1px solid rgba(74,222,128,0.15)" }}>
                    <CheckCircle2 size={14} className="text-green-400" />
                    <span className="text-[10px] text-green-400 font-semibold">
                      {isAr ? "تم قبول العقد بنجاح — يمكنك المتابعة للدفع" : "Contract accepted — proceed to payment"}
                    </span>
                  </div>

                  {/* Enhanced Payment Summary */}
                  <div className="glass-card rounded-xl p-4">
                    <h4 className="text-xs font-bold t-secondary mb-3">{isAr ? "ملخص الدفع" : "Payment Summary"}</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="t-tertiary">{isAr ? "سعر الوحدة" : "Unit Price"}</span>
                        <span className="t-secondary font-['Inter']">{(selectedBooth.price * 0.87).toLocaleString()} {isAr ? "ر.س" : "SAR"}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="t-tertiary">{isAr ? "ضريبة القيمة المضافة 15%" : "VAT 15%"}</span>
                        <span className="t-secondary font-['Inter']">{(selectedBooth.price * 0.13).toLocaleString()} {isAr ? "ر.س" : "SAR"}</span>
                      </div>
                      <div className="flex justify-between text-xs pt-2 border-t border-[var(--glass-border)]">
                        <span className="t-secondary font-bold">{isAr ? "الإجمالي" : "Total"}</span>
                        <span className="t-secondary font-bold font-['Inter']">{selectedBooth.price.toLocaleString()} {isAr ? "ر.س" : "SAR"}</span>
                      </div>
                    </div>
                    <div className="mt-3 p-2.5 rounded-lg" style={{ backgroundColor: "rgba(74,222,128,0.05)", border: "1px solid rgba(74,222,128,0.15)" }}>
                      <div className="flex justify-between text-[9px] mb-1">
                        <span className="text-green-400">{isAr ? "العربون المدفوع" : "Deposit Paid"}</span>
                        <span className="text-green-400 font-['Inter'] font-bold">-{(selectedBooth.price * 0.05).toLocaleString()} {isAr ? "ر.س" : "SAR"}</span>
                      </div>
                    </div>
                    <div className="mt-2 p-2.5 rounded-lg text-center" style={{ backgroundColor: "rgba(197,165,90,0.05)", border: "1px solid rgba(197,165,90,0.15)" }}>
                      <p className="text-[9px] t-tertiary mb-1">{isAr ? "المبلغ المتبقي المطلوب" : "Remaining Amount Due"}</p>
                      <p className="text-lg font-bold text-[#C5A55A] font-['Inter']">{(selectedBooth.price * 0.95).toLocaleString()} <span className="text-xs">{isAr ? "ر.س" : "SAR"}</span></p>
                      <p className="text-[8px] t-muted">{isAr ? "إجمالي الوحدة بعد خصم العربون" : "Unit total after deposit deduction"}</p>
                    </div>
                  </div>

                  {/* Cancellation Policy */}
                  <div className="p-3 rounded-xl" style={{ backgroundColor: "rgba(251,191,36,0.03)", border: "1px solid rgba(251,191,36,0.1)" }}>
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle size={10} className="text-yellow-400" />
                      <span className="text-[9px] font-bold text-yellow-400">{isAr ? "سياسة الإلغاء" : "Cancellation Policy"}</span>
                    </div>
                    <div className="space-y-1 text-[8px] t-muted">
                      <p>{isAr ? "العربون غير مسترد في جميع الحالات" : "Deposit (5%) is non-refundable after approval and full payment"}</p>
                      <p>{isAr ? "إلغاء قبل 15+ يوماً: استرداد 50% من المتبقي" : "Cancel 15+ days before: 50% refund of remaining"}</p>
                      <p>{isAr ? "إلغاء قبل أقل من 15 يوماً: لا يوجد استرداد" : "Cancel <15 days: no refund"}</p>
                    </div>
                  </div>

                  {/* Payment Methods */}
                  <div className="space-y-2">
                    <p className="text-[10px] t-tertiary">{isAr ? "طريقة الدفع" : "Payment Method"}</p>
                    {["Credit Card", "Mada", "Apple Pay", "Bank Transfer"].map((m, i) => (
                      <label key={i} className="flex items-center gap-3 glass-card rounded-xl p-3 cursor-pointer hover:bg-[var(--glass-bg)] transition-colors">
                        <input type="radio" name="payment" defaultChecked={i === 0} className="accent-[#C5A55A]" />
                        <span className="text-xs t-secondary">{m}</span>
                      </label>
                    ))}
                  </div>

                  <button
                    onClick={handleConfirmPayment}
                    className="w-full btn-gold py-3 rounded-xl text-sm flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 size={14} />
                    {isAr ? `تأكيد الدفع — ${(selectedBooth.price * 0.95).toLocaleString()} ر.س` : `Confirm Payment — ${(selectedBooth.price * 0.95).toLocaleString()} SAR`}
                  </button>
                  <p className="text-[9px] t-muted text-center">
                    {isAr ? "العربون تم خصمه من الإجمالي — المبلغ المعروض هو المتبقي فقط" : "Deposit deducted from total — amount shown is remaining only"}
                  </p>
                </div>
              )}
            </motion.div>
          ) : (
            <div className="glass-card rounded-2xl p-8 text-center">
              <Eye size={32} className="mx-auto t-muted mb-3" />
              <p className="text-sm t-tertiary">{isAr ? "اختر وحدة من الخريطة" : "Select a unit from the map"}</p>
            </div>
          )}

          {/* AI Suggestion */}
          <div className="glass-card rounded-2xl p-4 border-purple-400/10">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={14} className="text-purple-400" />
              <h4 className="text-xs font-bold text-purple-300">{isAr ? "اقتراح الذكاء الاصطناعي" : "AI Suggestion"}</h4>
            </div>
            <p className="text-[11px] t-tertiary leading-relaxed">
              {isAr
                ? "بناءً على نشاطك التجاري، ننصحك بالمنطقة D (العرج) — موقع استراتيجي مع حركة زوار عالية ومناسب لقطاع التجزئة."
                : "Based on your business activity, we recommend Zone D (Al-Arj) — strategic location with high foot traffic, ideal for retail sector."}
            </p>
          </div>

          {/* Participating Countries */}
          <div className="glass-card rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Globe size={14} className="t-gold" />
              <h4 className="text-xs font-bold t-secondary">{isAr ? "الدول المشاركة" : "Participating Countries"}</h4>
            </div>
            <div className="flex gap-2 flex-wrap">
              {["\u{1F1F8}\u{1F1E6}", "\u{1F1E6}\u{1F1EA}", "\u{1F1F6}\u{1F1E6}", "\u{1F1F0}\u{1F1FC}", "\u{1F1E7}\u{1F1ED}", "\u{1F1F4}\u{1F1F2}", "\u{1F1EA}\u{1F1EC}", "\u{1F1F9}\u{1F1F7}", "\u{1F1E8}\u{1F1F3}", "\u{1F1EC}\u{1F1E7}"].map((flag, i) => (
                <span key={i} className="text-lg">{flag}</span>
              ))}
            </div>
          </div>

          {/* Sponsorship Opportunities */}
          <div className="glass-card rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={14} className="t-gold" />
              <h4 className="text-xs font-bold t-secondary">{isAr ? "فرص الرعاية" : "Sponsorship Opportunities"}</h4>
            </div>
            <div className="space-y-2">
              {[
                { name: isAr ? "ذهبي" : "Gold", price: "150,000", color: "#C5A55A", avail: true },
                { name: isAr ? "فضي" : "Silver", price: "75,000", color: "#94A3B8", avail: true },
                { name: isAr ? "ناشئ" : "Startup", price: "25,000", color: "#60A5FA", avail: false },
              ].map((sp, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-lg" style={{ backgroundColor: "var(--glass-bg)", border: "1px solid var(--glass-border)" }}>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: sp.color }} />
                    <span className="text-[10px] t-secondary">{sp.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] t-gold font-['Inter']">{sp.price} {isAr ? "ر.س" : "SAR"}</span>
                    <span className="text-[8px] px-1.5 py-0.5 rounded-full" style={{
                      backgroundColor: sp.avail ? "rgba(74, 222, 128, 0.1)" : "rgba(239, 68, 68, 0.1)",
                      color: sp.avail ? "var(--status-green)" : "var(--status-red)",
                    }}>
                      {sp.avail ? (isAr ? "متاح" : "Available") : (isAr ? "محجوز" : "Reserved")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Compare Booths Modal */}
      <AnimatePresence>
        {showCompare && compareList.length >= 2 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.85)" }}
            onClick={() => setShowCompare(false)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="glass-card rounded-2xl p-5 max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold t-primary flex items-center gap-2">
                  <BarChart3 size={16} className="t-gold" />
                  {isAr ? "مقارنة الوحدات" : "Compare Booths"}
                </h3>
                <button onClick={() => setShowCompare(false)} className="glass-card p-1.5 rounded-full"><X size={14} className="t-secondary" /></button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-[var(--glass-border)]">
                      <th className="py-2 px-3 text-start t-tertiary">{isAr ? "الخاصية" : "Feature"}</th>
                      {compareList.map(b => (
                        <th key={b.id} className="py-2 px-3 text-center text-[#C5A55A] font-bold">{b.code}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[var(--glass-border)]">
                      <td className="py-2 px-3 t-tertiary">{isAr ? "النوع" : "Type"}</td>
                      {compareList.map(b => <td key={b.id} className="py-2 px-3 text-center t-secondary">{boothTypeLabel(b.type)}</td>)}
                    </tr>
                    <tr className="border-b border-[var(--glass-border)]">
                      <td className="py-2 px-3 t-tertiary">{isAr ? "المساحة" : "Area"}</td>
                      {compareList.map(b => <td key={b.id} className="py-2 px-3 text-center t-secondary font-['Inter']">{b.sizeM2} m²</td>)}
                    </tr>
                    <tr className="border-b border-[var(--glass-border)]">
                      <td className="py-2 px-3 t-tertiary">{isAr ? "الأبعاد" : "Dimensions"}</td>
                      {compareList.map(b => <td key={b.id} className="py-2 px-3 text-center t-secondary font-['Inter']">{b.dimensions}</td>)}
                    </tr>
                    <tr className="border-b border-[var(--glass-border)]">
                      <td className="py-2 px-3 t-tertiary">{isAr ? "الواجهات" : "Faces"}</td>
                      {compareList.map(b => <td key={b.id} className="py-2 px-3 text-center t-secondary font-['Inter']">{b.faces}</td>)}
                    </tr>
                    <tr className="border-b border-[var(--glass-border)]">
                      <td className="py-2 px-3 t-tertiary">{isAr ? "المنطقة" : "Zone"}</td>
                      {compareList.map(b => <td key={b.id} className="py-2 px-3 text-center t-secondary">{zoneLabel(b.zone)}</td>)}
                    </tr>
                    <tr className="border-b border-[var(--glass-border)]">
                      <td className="py-2 px-3 t-tertiary">{isAr ? "المميزات" : "Features"}</td>
                      {compareList.map(b => <td key={b.id} className="py-2 px-3 text-center t-secondary text-[10px]">{b.featureKeys.map(f => featureLabel(f, isAr)).join(", ")}</td>)}
                    </tr>
                    <tr>
                      <td className="py-2 px-3 t-tertiary font-bold">{isAr ? "السعر" : "Price"}</td>
                      {compareList.map(b => <td key={b.id} className="py-2 px-3 text-center text-[#C5A55A] font-bold font-['Inter']">{b.price.toLocaleString()} {isAr ? "ر.س" : "SAR"}</td>)}
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="flex gap-2 mt-4">
                {compareList.map(b => (
                  <button key={b.id} onClick={() => { setSelectedBooth(b); setShowCompare(false); }}
                    className="flex-1 py-2 rounded-xl text-[11px] btn-gold flex items-center justify-center gap-1">
                    {isAr ? `اختر ${b.code}` : `Select ${b.code}`}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
