'use client';

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowRight, ArrowLeft, Star, Users, CalendarDays, TrendingUp,
  Globe, Tag, Heart, Share2, MapPin, Clock, CheckCircle2,
  Megaphone, Eye, Target, BarChart3,
} from "lucide-react";
import { useLanguageStore } from "@/shared/store/useLanguageStore";
import { events2026, type ExpoEvent } from "@/features/merchant-dashboard/data/events2026";
// ExpoDetailClient is now rendered on /dashboard/expos/[id]/map

// ─── Extra expo data (mock — would come from API later) ──────────────
interface ExpoExtra {
  targetIndustries: { ar: string; en: string }[];
  visitorDemographics: { labelAr: string; labelEn: string; pct: number }[];
  marketingReach: { labelAr: string; labelEn: string; value: string }[];
  highlights: { ar: string; en: string }[];
}

const defaultExtra: ExpoExtra = {
  targetIndustries: [
    { ar: "تجارة التجزئة", en: "Retail" },
    { ar: "الضيافة", en: "Hospitality" },
    { ar: "التقنية", en: "Technology" },
    { ar: "الأغذية والمشروبات", en: "Food & Beverage" },
  ],
  visitorDemographics: [
    { labelAr: "رجال أعمال", labelEn: "Business Professionals", pct: 45 },
    { labelAr: "عائلات", labelEn: "Families", pct: 30 },
    { labelAr: "شباب 18-35", labelEn: "Youth 18-35", pct: 15 },
    { labelAr: "دوليون", labelEn: "International Visitors", pct: 10 },
  ],
  marketingReach: [
    { labelAr: "وسائل التواصل", labelEn: "Social Media", value: "2M+" },
    { labelAr: "إعلانات رقمية", labelEn: "Digital Ads", value: "5M+" },
    { labelAr: "تغطية إعلامية", labelEn: "Media Coverage", value: "150+" },
    { labelAr: "شراكات", labelEn: "Partnerships", value: "40+" },
  ],
  highlights: [
    { ar: "واي فاي مجاني فائق السرعة", en: "Free high-speed WiFi" },
    { ar: "مواقف سيارات VIP مجانية", en: "Free VIP parking" },
    { ar: "أمن على مدار الساعة", en: "24/7 security" },
    { ar: "منطقة استراحة للعارضين", en: "Exhibitor lounge area" },
    { ar: "دعم فني وتقني في الموقع", en: "On-site technical support" },
    { ar: "تسويق مشترك للعارضين", en: "Co-marketing for exhibitors" },
    { ar: "تطبيق المعرض الذكي", en: "Smart expo mobile app" },
    { ar: "خدمات ترجمة فورية", en: "Simultaneous translation services" },
  ],
};

const expoExtras: Record<string, Partial<ExpoExtra>> = {
  "KAFD-001": {
    targetIndustries: [
      { ar: "أغذية ومشروبات", en: "Food & Beverage" },
      { ar: "ضيافة", en: "Hospitality" },
      { ar: "ترفيه", en: "Entertainment" },
      { ar: "تجارة تجزئة", en: "Retail" },
    ],
    visitorDemographics: [
      { labelAr: "عائلات", labelEn: "Families", pct: 40 },
      { labelAr: "شباب", labelEn: "Youth", pct: 30 },
      { labelAr: "رجال أعمال", labelEn: "Business", pct: 20 },
      { labelAr: "سياح", labelEn: "Tourists", pct: 10 },
    ],
  },
  "RYD-001": {
    targetIndustries: [
      { ar: "تقنية المعلومات", en: "Information Technology" },
      { ar: "ذكاء اصطناعي", en: "Artificial Intelligence" },
      { ar: "أمن سيبراني", en: "Cybersecurity" },
      { ar: "حوسبة سحابية", en: "Cloud Computing" },
      { ar: "إنترنت الأشياء", en: "IoT" },
    ],
    visitorDemographics: [
      { labelAr: "متخصصون تقنيون", labelEn: "Tech Professionals", pct: 50 },
      { labelAr: "مستثمرون", labelEn: "Investors", pct: 25 },
      { labelAr: "طلاب وباحثون", labelEn: "Students & Researchers", pct: 15 },
      { labelAr: "حكومي", labelEn: "Government", pct: 10 },
    ],
  },
  "RYD-003": {
    targetIndustries: [
      { ar: "نفط وغاز", en: "Oil & Gas" },
      { ar: "طاقة متجددة", en: "Renewable Energy" },
      { ar: "بتروكيماويات", en: "Petrochemicals" },
      { ar: "هندسة", en: "Engineering" },
    ],
  },
  "RYD-005": {
    targetIndustries: [
      { ar: "بناء وتشييد", en: "Construction" },
      { ar: "عقارات", en: "Real Estate" },
      { ar: "مواد بناء", en: "Building Materials" },
      { ar: "تصميم داخلي", en: "Interior Design" },
    ],
  },
};

function getExtra(id: string): ExpoExtra {
  const override = expoExtras[id] || {};
  return { ...defaultExtra, ...override };
}

// ─── Status helpers ──────────────────────────────────────────────────
function getStatusConfig(status: ExpoEvent["status"], isAr: boolean) {
  const map: Record<ExpoEvent["status"], { label: string; cls: string }> = {
    open: { label: isAr ? "متاح" : "Open", cls: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
    closing_soon: { label: isAr ? "يغلق قريباً" : "Closing Soon", cls: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
    upcoming: { label: isAr ? "قريباً" : "Upcoming", cls: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
    full: { label: isAr ? "مكتمل" : "Full", cls: "bg-neutral-500/20 text-neutral-400 border-neutral-500/30" },
  };
  return map[status];
}

function formatDate(dateStr: string, isAr: boolean) {
  const d = new Date(dateStr);
  return d.toLocaleDateString(isAr ? "ar-SA" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// ─── Page Component ──────────────────────────────────────────────────
export default function ExpoInfoClient() {
  const params = useParams();
  const { t, isRtl } = useLanguageStore();
  const isAr = isRtl;
  const boothMapRef = useRef<HTMLDivElement>(null); // kept for compatibility
  const [isFavorite, setIsFavorite] = useState(false);

  const event = events2026.find((e) => e.id === params.id);

  if (!event) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="glass-card p-8 text-center">
          <p className="t-primary text-xl font-bold mb-2">
            {isAr ? "المعرض غير موجود" : "Expo not found"}
          </p>
          <Link href="/dashboard/expos" className="t-gold hover:underline">
            {isAr ? "العودة للمعارض" : "Back to Expos"}
          </Link>
        </div>
      </div>
    );
  }

  const extra = getExtra(event.id);
  const statusCfg = getStatusConfig(event.status, isAr);
  const boothPct = event.totalUnits > 0 ? (event.availableUnits / event.totalUnits) * 100 : 0;
  const barColor = boothPct > 50 ? "bg-emerald-500" : boothPct > 20 ? "bg-amber-500" : "bg-red-500";

  const scrollToBoothMap = () => {
    // Navigate to dedicated map page for this expo
    window.location.href = `/dashboard/expos/${params.id}/map`;
  };

  // Find similar expos (same category, different id)
  const similarExpos = events2026
    .filter((e) => e.id !== event.id && e.category === event.category)
    .slice(0, 3);
  // If not enough in same category, fill with featured
  const extraSimilar = similarExpos.length < 3
    ? events2026.filter((e) => e.id !== event.id && e.featured && !similarExpos.find((s) => s.id === e.id)).slice(0, 3 - similarExpos.length)
    : [];
  const allSimilar = [...similarExpos, ...extraSimilar].slice(0, 3);

  const BackArrow = isRtl ? ArrowRight : ArrowLeft;
  const name = isAr ? event.nameAr : event.nameEn;
  const desc = isAr ? event.descAr : event.descEn;
  const city = isAr ? event.city : event.cityEn;
  const venue = isAr ? event.venue : event.venueEn;

  return (
    <div className="space-y-6">
      {/* ═══ Back Button ═══ */}
      <Link
        href="/dashboard/expos"
        className="inline-flex items-center gap-2 t-secondary hover:t-gold transition-colors text-sm font-medium"
      >
        <BackArrow className="w-4 h-4" />
        {isAr ? "العودة للمعارض" : "Back to Expos"}
      </Link>

      {/* ═══ Hero Section ═══ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative rounded-2xl overflow-hidden h-56 lg:h-80"
      >
        <Image
          src={event.image}
          alt={name}
          fill
          className="object-cover"
          priority
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        {/* Top-right actions */}
        <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center hover:bg-black/60 transition-colors"
          >
            <Heart className={`w-5 h-5 ${isFavorite ? "fill-red-500 text-red-500" : "text-white"}`} />
          </button>
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: name, url: window.location.href });
              } else {
                navigator.clipboard.writeText(window.location.href);
              }
            }}
            className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center hover:bg-black/60 transition-colors"
          >
            <Share2 className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Badges */}
        <div className={`absolute top-4 ${isRtl ? "right-auto left-4" : "left-4"} flex items-center gap-2 z-10`}>
          <span className={`px-3 py-1 text-xs font-bold rounded-full border ${statusCfg.cls}`}>
            {statusCfg.label}
          </span>
          {event.featured && (
            <span className="px-3 py-1 text-xs font-bold rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
              {isAr ? "رسمي" : "Official"}
            </span>
          )}
        </div>

        {/* Bottom info */}
        <div className={`absolute bottom-0 inset-x-0 p-6 ${isRtl ? "text-right" : "text-left"}`}>
          <h1 className="text-2xl lg:text-4xl font-bold text-white mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
            {name}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-white/80 text-sm">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              {city} — {venue}
            </span>
            <span className="flex items-center gap-1.5">
              <CalendarDays className="w-4 h-4" />
              {formatDate(event.dateStart, isAr)} – {formatDate(event.dateEnd, isAr)}
            </span>
          </div>
        </div>
      </motion.div>

      {/* ═══ Grid Layout ═══ */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* ─── Left Column ─── */}
        <div className="lg:col-span-2 space-y-6">

          {/* Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {[
              {
                icon: Star,
                value: event.rating.toFixed(1),
                label: isAr ? "التقييم" : "Rating",
                iconCls: "text-yellow-500",
                bgCls: "bg-yellow-500/10",
              },
              {
                icon: Users,
                value: event.footfall.replace(/\+.*/, "+"),
                label: isAr ? "الزوار المتوقعون" : "Expected Visitors",
                iconCls: "text-emerald-500",
                bgCls: "bg-emerald-500/10",
              },
              {
                icon: CalendarDays,
                value: event.totalUnits.toString(),
                label: isAr ? "إجمالي الأجنحة" : "Total Booths",
                iconCls: "text-blue-500",
                bgCls: "bg-blue-500/10",
              },
              {
                icon: TrendingUp,
                value: event.availableUnits.toString(),
                label: isAr ? "متاح" : "Available",
                iconCls: "t-gold",
                bgCls: "bg-gold-subtle",
              },
            ].map((stat, i) => (
              <div key={i} className="glass-card gold-border-glow p-4 flex flex-col items-center text-center gap-2">
                <div className={`w-10 h-10 rounded-xl ${stat.bgCls} flex items-center justify-center`}>
                  <stat.icon className={`w-5 h-5 ${stat.iconCls}`} />
                </div>
                <span className="t-primary text-lg font-bold">{stat.value}</span>
                <span className="t-muted text-xs">{stat.label}</span>
              </div>
            ))}
          </motion.div>

          {/* About Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Globe className="w-5 h-5 t-gold" />
              <h2 className="t-primary text-lg font-bold">{isAr ? "عن المعرض" : "About the Expo"}</h2>
            </div>
            <p className="t-secondary text-sm leading-relaxed">{desc}</p>
          </motion.div>

          {/* Categories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Tag className="w-5 h-5 t-gold" />
              <h2 className="t-primary text-lg font-bold">{isAr ? "التصنيفات" : "Categories"}</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-gold-subtle t-gold border border-[var(--gold-border)]">
                {isAr ? event.category : event.categoryEn}
              </span>
            </div>
          </motion.div>

          {/* Target Industries */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 t-gold" />
              <h2 className="t-primary text-lg font-bold">{isAr ? "القطاعات المستهدفة" : "Target Industries"}</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {extra.targetIndustries.map((ind, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 rounded-full text-xs font-medium t-gold border border-[var(--gold-border)] hover:bg-gold-subtle transition-colors"
                >
                  {isAr ? ind.ar : ind.en}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Visitor Demographics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-5 h-5 t-gold" />
              <h2 className="t-primary text-lg font-bold">{isAr ? "توزيع الزوار" : "Visitor Demographics"}</h2>
            </div>
            <div className="space-y-4">
              {extra.visitorDemographics.map((demo, i) => (
                <div key={i}>
                  <div className="flex justify-between mb-1.5">
                    <span className="t-secondary text-sm">{isAr ? demo.labelAr : demo.labelEn}</span>
                    <span className="t-primary text-sm font-bold">{demo.pct}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-neutral-200 dark:bg-white/10 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${demo.pct}%` }}
                      transition={{ duration: 1, delay: 0.4 + i * 0.1, ease: "easeOut" }}
                      className="h-full rounded-full"
                      style={{
                        background: "linear-gradient(90deg, #B8941E, #D4AF37, #F0D878)",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Marketing Reach */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Megaphone className="w-5 h-5 t-gold" />
              <h2 className="t-primary text-lg font-bold">{isAr ? "الوصول التسويقي" : "Marketing Reach"}</h2>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {extra.marketingReach.map((reach, i) => (
                <div key={i} className="text-center p-3 rounded-xl bg-gold-subtle">
                  <div className="text-xl font-bold gold-gradient-text mb-1">{reach.value}</div>
                  <div className="t-muted text-xs">{isAr ? reach.labelAr : reach.labelEn}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Highlights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-5 h-5 t-gold" />
              <h2 className="t-primary text-lg font-bold">{isAr ? "مميزات المعرض" : "Highlights"}</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {extra.highlights.map((hl, i) => (
                <div key={i} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 t-gold shrink-0" />
                  <span className="t-secondary text-sm">{isAr ? hl.ar : hl.en}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ─── Right Column (Sidebar) ─── */}
        <div className="space-y-6">
          {/* Booking Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass-card gold-border-glow p-6 lg:sticky lg:top-4"
          >
            {/* Available booths */}
            <div className="mb-4">
              <div className="flex justify-between items-baseline mb-2">
                <span className="t-secondary text-sm">{isAr ? "الأجنحة المتاحة" : "Available Booths"}</span>
                <span className="t-primary font-bold">
                  {event.availableUnits} / {event.totalUnits}
                </span>
              </div>
              <div className="h-2.5 rounded-full bg-neutral-200 dark:bg-white/10 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${boothPct}%` }}
                  transition={{ duration: 1, delay: 0.3 }}
                  className={`h-full rounded-full ${barColor}`}
                />
              </div>
            </div>

            {/* Price range */}
            <div className="mb-4 p-3 rounded-xl bg-gold-subtle text-center">
              <span className="t-muted text-xs block mb-1">{isAr ? "نطاق الأسعار" : "Price Range"}</span>
              <span className="gold-gradient-text text-lg font-bold">
                {event.priceRange} {isAr ? "ر.س" : "SAR"}
              </span>
            </div>

            {/* Dates */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-gold-subtle flex items-center justify-center">
                  <Clock className="w-4 h-4 t-gold" />
                </div>
                <div>
                  <span className="t-muted text-xs block">{isAr ? "يبدأ" : "Starts"}</span>
                  <span className="t-primary text-sm font-medium">{formatDate(event.dateStart, isAr)}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-gold-subtle flex items-center justify-center">
                  <Clock className="w-4 h-4 t-gold" />
                </div>
                <div>
                  <span className="t-muted text-xs block">{isAr ? "ينتهي" : "Ends"}</span>
                  <span className="t-primary text-sm font-medium">{formatDate(event.dateEnd, isAr)}</span>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            {event.status !== "full" && event.availableUnits > 0 ? (
              <div className="space-y-3">
                <button
                  onClick={scrollToBoothMap}
                  className="btn-gold w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  {isAr ? "عرض الخريطة والحجز" : "View Map & Book"}
                </button>
                <Link
                  href="/dashboard/services"
                  className="block w-full py-3 rounded-xl text-sm font-bold text-center t-gold border border-[var(--gold-border)] hover:bg-gold-subtle transition-colors"
                >
                  {isAr ? "تصفح الخدمات" : "Browse Services"}
                </Link>
              </div>
            ) : (
              <button className="btn-gold w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2">
                {isAr ? "انضم لقائمة الانتظار" : "Join Waitlist"}
              </button>
            )}
          </motion.div>

          {/* Similar Expos */}
          {allSimilar.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="glass-card p-6"
            >
              <h3 className="t-primary text-lg font-bold mb-4">
                {isAr ? "معارض مشابهة" : "Similar Expos"}
              </h3>
              <div className="space-y-3">
                {allSimilar.map((expo) => (
                  <Link
                    key={expo.id}
                    href={`/dashboard/expos/${expo.id}`}
                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-gold-subtle transition-colors group"
                  >
                    <div className="w-16 h-12 rounded-lg overflow-hidden shrink-0 relative">
                      <Image
                        src={expo.image}
                        alt={isAr ? expo.nameAr : expo.nameEn}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="t-primary text-sm font-medium truncate group-hover:t-gold transition-colors">
                        {isAr ? expo.nameAr : expo.nameEn}
                      </p>
                      <p className="t-muted text-xs truncate">
                        {isAr ? expo.city : expo.cityEn} — {formatDate(expo.dateStart, isAr)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Booth map is on a dedicated page: /dashboard/expos/[id]/map */}
    </div>
  );
}
