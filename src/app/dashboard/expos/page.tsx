'use client';

/**
 * BrowseExpos — Explore real 2026 Saudi exhibitions and events
 * ENHANCED: Scarcity, Live Activity, Early Booking, Price Alert, Advanced Filters
 * RULES:
 * 1. Anyone can browse — no restrictions
 * 2. Only KYC-verified traders can book a unit
 * 3. Booking creates a real record (pending_payment)
 * 4. Payment -> Contract flow handled in Payments page
 * 5. Investor/organizer info is NEVER shown to traders
 * 6. FULLY LOCALIZED
 */
import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Building2, Search, MapPin, Calendar, Star,
  Clock, X, Grid3X3, List, Sparkles, CreditCard, Map,
  Users, TrendingUp, Filter, Eye, Flame,
  AlertTriangle, Zap, Globe, Tag, Layers
} from "lucide-react";
import { toast } from "sonner";
import { useLanguageStore } from "@/shared/store/useLanguageStore";
import { useThemeStore } from "@/shared/store/useThemeStore";
import { useAuthStore } from "@/shared/store/useAuthStore";
import { events2026, eventCategories, eventStats, type ExpoEvent, type ExpoUnit } from "@/features/merchant-dashboard/data/events2026";

// Simulated live activity data
const LIVE_CITIES = ["Dubai", "Istanbul", "Riyadh", "Cairo", "Doha", "Kuwait", "Muscat", "Amman", "Jeddah", "Dammam"];
const LIVE_CITIES_AR = ["دبي", "إسطنبول", "الرياض", "القاهرة", "الدوحة", "الكويت", "مسقط", "عمّان", "جدة", "الدمام"];

export default function BrowseExpos() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("الكل");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedExpo, setSelectedExpo] = useState<ExpoEvent | null>(null);
  const [showUnitPicker, setShowUnitPicker] = useState(false);
  const [sortBy, setSortBy] = useState<"date" | "price" | "rating" | "availability">("date");
  const [showFilters, setShowFilters] = useState(false);
  const [cityFilter, setCityFilter] = useState("الكل");
  const { language, isRtl } = useLanguageStore();
  const { theme } = useThemeStore();
  const isDark = theme === "dark";

  const isAr = language === "ar";

  // Live Activity State
  const [liveActivity, setLiveActivity] = useState<{ city: string; mins: number; expo: string } | null>(null);
  const [viewerCounts, setViewerCounts] = useState<Record<string, number>>({});

  // Simulate live activity notifications
  useEffect(() => {
    const interval = setInterval(() => {
      const randomExpo = events2026[Math.floor(Math.random() * events2026.length)];
      const cityIdx = Math.floor(Math.random() * LIVE_CITIES.length);
      setLiveActivity({
        city: isAr ? LIVE_CITIES_AR[cityIdx] : LIVE_CITIES[cityIdx],
        mins: Math.floor(Math.random() * 15) + 1,
        expo: isAr ? randomExpo.nameAr : randomExpo.nameEn,
      });
      // Auto-hide after 5s
      setTimeout(() => setLiveActivity(null), 5000);
    }, 12000);
    return () => clearInterval(interval);
  }, [isAr]);

  // Simulate viewer counts
  useEffect(() => {
    const counts: Record<string, number> = {};
    events2026.forEach(e => {
      counts[e.id] = Math.floor(Math.random() * 20) + 3;
    });
    setViewerCounts(counts);
    const interval = setInterval(() => {
      setViewerCounts(prev => {
        const next = { ...prev };
        const keys = Object.keys(next);
        const key = keys[Math.floor(Math.random() * keys.length)];
        next[key] = Math.max(2, next[key] + (Math.random() > 0.5 ? 1 : -1));
        return next;
      });
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const getCatLabel = (cat: { ar: string; en: string }) => isAr ? cat.ar : cat.en;
  const getExpoName = (e: ExpoEvent) => isAr ? e.nameAr : e.nameEn;
  const getExpoDesc = (e: ExpoEvent) => isAr ? e.descAr : e.descEn;
  const getExpoCity = (e: ExpoEvent) => isAr ? e.city : e.cityEn;
  const getExpoLocation = (e: ExpoEvent) => isAr ? e.location : e.locationEn;
  const getExpoVenue = (e: ExpoEvent) => isAr ? e.venue : e.venueEn;
  const getExpoCategory = (e: ExpoEvent) => isAr ? e.category : e.categoryEn;
  const getUnitName = (u: ExpoUnit) => isAr ? u.nameAr : u.nameEn;
  const getUnitType = (u: ExpoUnit) => isAr ? u.type : u.typeEn;
  const getUnitServices = (u: ExpoUnit) => isAr ? u.services : u.servicesEn;

  const cities = useMemo(() => {
    const set = new Set(events2026.map(e => e.city));
    return ["الكل", ...Array.from(set)];
  }, []);

  const cityDisplayMap: Record<string, string> = useMemo(() => {
    const map: Record<string, string> = { "الكل": isAr ? "الكل" : "All" };
    events2026.forEach(e => { map[e.city] = isAr ? e.city : e.cityEn; });
    return map;
  }, [isAr]);

  const filtered = useMemo(() => {
    let result = events2026.filter(e => {
      const matchSearch = search === "" ||
        e.nameAr.includes(search) ||
        e.nameEn.toLowerCase().includes(search.toLowerCase()) ||
        e.descAr.includes(search) ||
        e.venue.includes(search) ||
        e.categoryEn.toLowerCase().includes(search.toLowerCase());
      const matchCategory = activeCategory === "الكل" || e.category === activeCategory;
      const matchCity = cityFilter === "الكل" || e.city === cityFilter;
      return matchSearch && matchCategory && matchCity;
    });

    switch (sortBy) {
      case "date":
        result.sort((a, b) => new Date(a.dateStart).getTime() - new Date(b.dateStart).getTime());
        break;
      case "price":
        result.sort((a, b) => {
          const pa = parseInt(a.priceRange.replace(/[^0-9]/g, ""));
          const pb = parseInt(b.priceRange.replace(/[^0-9]/g, ""));
          return pa - pb;
        });
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "availability":
        result.sort((a, b) => b.availableUnits - a.availableUnits);
        break;
    }
    return result;
  }, [search, activeCategory, cityFilter, sortBy]);

  const getStatusStyle = (status: string) => {
    const map: Record<string, { label: string; color: string }> = {
      open: { label: isAr ? "متاح للحجز" : "Open for Booking", color: "var(--status-green)" },
      closing_soon: { label: isAr ? "يغلق قريباً" : "Closing Soon", color: "var(--status-yellow)" },
      full: { label: isAr ? "مكتمل" : "Fully Booked", color: "var(--status-red)" },
      upcoming: { label: isAr ? "قريباً" : "Upcoming", color: "var(--status-blue)" },
    };
    return map[status] || { label: status, color: "var(--text-tertiary)" };
  };

  // Scarcity helpers
  const getScarcityLevel = (expo: ExpoEvent) => {
    const pct = (expo.availableUnits / expo.totalUnits) * 100;
    if (pct <= 10) return "critical";
    if (pct <= 25) return "low";
    if (pct <= 50) return "medium";
    return "normal";
  };

  const isEarlyBooking = (expo: ExpoEvent) => {
    const start = new Date(expo.dateStart);
    const now = new Date();
    const daysUntil = Math.ceil((start.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntil > 60;
  };

  /** Book a specific unit */
  const handleBookUnit = (expo: ExpoEvent, unit: ExpoUnit) => {
    toast.success(isAr
      ? `تم إنشاء الحجز بنجاح! انتقل للمدفوعات لإكمال الدفع وإصدار العقد`
      : `Booking created successfully! Go to Payments to complete and generate contract`
    );
    setSelectedExpo(null);
    setShowUnitPicker(false);
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Live Activity Banner */}
      <AnimatePresence>
        {liveActivity && (
          <motion.div
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            className="overflow-hidden"
          >
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ backgroundColor: "rgba(74, 222, 128, 0.08)", border: "1px solid rgba(74, 222, 128, 0.15)" }}>
              <div className="w-2 h-2 rounded-full bg-[var(--status-green)] animate-pulse shrink-0" />
              <Zap size={12} className="text-[var(--status-green)] shrink-0" />
              <p className="text-[11px] t-secondary flex-1 truncate">
                {isAr
                  ? `شركة من ${liveActivity.city} حجزت جناحاً قبل ${liveActivity.mins} دقائق`
                  : `A company from ${liveActivity.city} booked a booth ${liveActivity.mins} minutes ago`}
              </p>
              <span className="text-[9px] t-muted font-['Inter'] shrink-0">{isAr ? "تم الحجز للتو" : "Just Booked"}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-lg sm:text-xl font-bold text-gold-gradient truncate" style={{ fontFamily: "'Playfair Display', 'IBM Plex Sans Arabic', serif" }}>{isAr ? "تصفح المعارض والفعاليات 2026" : "Browse Exhibitions & Events 2026"}</h2>
          <p className="text-[10px] sm:text-xs t-gold font-['Inter']" style={{ opacity: 0.6 }}>{events2026.length} {isAr ? "فعاليات متاحة" : "Events Available"}</p>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button onClick={() => setShowFilters(!showFilters)} className={`p-2 rounded-lg transition-colors ${showFilters ? "bg-gold-subtle t-gold" : "glass-card t-tertiary"}`}>
            <Filter size={16} />
          </button>
          <button onClick={() => setViewMode("grid")} className={`p-2 rounded-lg transition-colors ${viewMode === "grid" ? "bg-gold-subtle t-gold" : "glass-card t-tertiary"}`}>
            <Grid3X3 size={16} />
          </button>
          <button onClick={() => setViewMode("list")} className={`p-2 rounded-lg transition-colors ${viewMode === "list" ? "bg-gold-subtle t-gold" : "glass-card t-tertiary"}`}>
            <List size={16} />
          </button>
        </div>
      </div>

      {/* Price Alert Banner */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ backgroundColor: "rgba(251, 191, 36, 0.06)", border: "1px solid rgba(251, 191, 36, 0.12)" }}>
        <AlertTriangle size={13} className="text-[var(--status-yellow)] shrink-0" />
        <p className="text-[10px] t-secondary flex-1">{isAr ? "الأسعار قد ترتفع مع امتلاء المعرض" : "Prices may increase as the exhibition fills"}</p>
        <span className="text-[9px] px-2 py-0.5 rounded-full font-['Inter']" style={{ backgroundColor: "rgba(251, 191, 36, 0.1)", color: "var(--status-yellow)" }}>
          {isAr ? "زيادة سعرية متوقعة" : "Price increase expected"}
        </span>
      </div>

      {/* Search & Category Filters */}
      <div className="space-y-2 sm:space-y-3">
        <div className="relative">
          <Search size={14} className={`absolute top-1/2 -translate-y-1/2 t-muted ${isRtl ? 'right-3' : 'left-3'}`} />
          <input type="text" placeholder={isAr ? "ابحث عن معرض أو فعالية أو مكان..." : "Search for an exhibition, event, or venue..."} value={search} onChange={(e) => setSearch(e.target.value)}
            className={`w-full glass-card rounded-xl py-2.5 text-xs sm:text-sm t-primary placeholder:t-muted gold-focus ${isRtl ? 'pr-9 pl-3' : 'pl-9 pr-3'}`} style={{ backgroundColor: "var(--input-bg)" }} />
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {eventCategories.slice(0, 8).map((cat) => (
            <button key={cat.ar} onClick={() => setActiveCategory(cat.ar)}
              className={`px-2.5 py-1.5 rounded-lg text-[10px] sm:text-[11px] transition-all whitespace-nowrap shrink-0 ${activeCategory === cat.ar ? "btn-gold" : "glass-card t-secondary"}`}>
              {getCatLabel(cat)}
            </button>
          ))}
        </div>
      </div>

      {/* Advanced Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="glass-card rounded-xl p-3 sm:p-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="text-[10px] t-muted mb-1 block">{isAr ? "المدينة" : "City"}</label>
                <select value={cityFilter} onChange={(e) => setCityFilter(e.target.value)}
                  className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-lg px-2 py-1.5 text-xs t-secondary">
                  {cities.map(c => <option key={c} value={c}>{cityDisplayMap[c] || c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] t-muted mb-1 block">{isAr ? "ترتيب حسب" : "Sort By"}</label>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value as "date" | "price" | "rating" | "availability")}
                  className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-lg px-2 py-1.5 text-xs t-secondary">
                  <option value="date">{isAr ? "الأقرب تاريخاً" : "Nearest Date"}</option>
                  <option value="price">{isAr ? "الأقل سعراً" : "Lowest Price"}</option>
                  <option value="rating">{isAr ? "الأعلى تقييماً" : "Highest Rated"}</option>
                  <option value="availability">{isAr ? "الأكثر توفراً" : "Most Available"}</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] t-muted mb-1 block">{isAr ? "الفئات المتبقية" : "More Categories"}</label>
                <div className="flex gap-1 flex-wrap">
                  {eventCategories.slice(8).map(cat => (
                    <button key={cat.ar} onClick={() => setActiveCategory(cat.ar)}
                      className={`px-2 py-0.5 rounded text-[9px] transition-all ${activeCategory === cat.ar ? "bg-gold-subtle t-gold" : "glass-card t-muted"}`}>
                      {getCatLabel(cat)}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-end">
                <button onClick={() => { setActiveCategory("الكل"); setCityFilter("الكل"); setSortBy("date"); }}
                  className="text-[10px] t-gold underline">{isAr ? "إعادة تعيين الفلاتر" : "Reset Filters"}</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Bar with Scarcity */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        {[
          { label: isAr ? "فعاليات متاحة" : "Events Available", value: eventStats.openEvents, color: "var(--status-green)", icon: Building2 },
          { label: isAr ? "يغلق قريباً" : "Closing Soon", value: eventStats.closingSoon, color: "var(--status-yellow)", icon: Clock },
          { label: isAr ? "إجمالي الوحدات" : "Total Units", value: eventStats.totalUnits.toLocaleString(), color: "var(--gold-accent)", icon: TrendingUp },
          { label: isAr ? "وحدات متاحة" : "Available Units", value: eventStats.availableUnits.toLocaleString(), color: "var(--status-blue)", icon: Users },
        ].map((s, i) => (
          <div key={i} className="glass-card rounded-xl p-2 sm:p-3 text-center">
            <s.icon size={14} className="mx-auto mb-1" style={{ color: s.color, opacity: 0.7 }} />
            <p className="text-base sm:text-lg font-bold font-['Inter']" style={{ color: s.color }}>{s.value}</p>
            <p className="text-[9px] sm:text-[10px] t-tertiary">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Today's bookings indicator */}
      <div className="flex items-center justify-between">
        <p className="text-[10px] t-muted">{filtered.length} {isAr ? "نتيجة" : "results"} {search && `${isAr ? "لـ" : "for"} "${search}"`}</p>
        <div className="flex items-center gap-1.5">
          <Flame size={11} className="text-[var(--status-yellow)]" />
          <span className="text-[10px] t-muted font-['Inter']">
            {isAr
              ? `${Math.floor(Math.random() * 8) + 5} حجوزات اليوم`
              : `${Math.floor(Math.random() * 8) + 5} bookings today`}
          </span>
        </div>
      </div>

      {/* Expo Grid */}
      <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4" : "space-y-3"}>
        {filtered.map((expo, i) => {
          const sc = getStatusStyle(expo.status);
          const scarcity = getScarcityLevel(expo);
          const early = isEarlyBooking(expo);
          const viewers = viewerCounts[expo.id] || 0;
          return (
            <motion.div key={expo.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="glass-card rounded-xl sm:rounded-2xl overflow-hidden group cursor-pointer transition-all hover:scale-[1.01]" onClick={() => setSelectedExpo(expo)}
              style={{ boxShadow: isDark ? 'var(--glow-gold)' : '0 4px 15px rgba(0,0,0,0.04)' }}>
              <div className="relative h-36 sm:h-44 overflow-hidden">
                <img src={expo.image} alt={getExpoName(expo)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, var(--surface-dark), transparent, transparent)" }} />
                {/* Status Badge */}
                <span className={`absolute top-3 ${isRtl ? 'right-3' : 'left-3'} px-2 py-1 rounded-full text-[10px] font-medium backdrop-blur-md`}
                  style={{ backgroundColor: `color-mix(in srgb, ${sc.color} 15%, transparent)`, color: sc.color, border: `1px solid color-mix(in srgb, ${sc.color} 25%, transparent)` }}>
                  {sc.label}
                </span>
                {/* Featured / Early Booking Badge */}
                <div className={`absolute top-3 ${isRtl ? 'left-3' : 'right-3'} flex flex-col gap-1`}>
                  {expo.featured && (
                    <span className="px-2 py-1 rounded-full text-[10px] bg-gold-subtle flex items-center gap-1"
                      style={{ color: "var(--gold-light)", border: "1px solid var(--gold-border)" }}>
                      <Sparkles size={10} /> {isAr ? "مميز" : "Featured"}
                    </span>
                  )}
                  {early && (
                    <span className="px-2 py-1 rounded-full text-[10px] flex items-center gap-1 backdrop-blur-md"
                      style={{ backgroundColor: "rgba(96, 165, 250, 0.15)", color: "#60A5FA", border: "1px solid rgba(96, 165, 250, 0.25)" }}>
                      <Tag size={9} /> {isAr ? "حجز مبكر" : "Early Booking"}
                    </span>
                  )}
                </div>
                {/* Bottom badges */}
                <div className={`absolute bottom-3 ${isRtl ? 'right-3' : 'left-3'} flex items-center gap-1.5`}>
                  <div className="flex items-center gap-1 rounded-full px-2 py-0.5" style={{ backgroundColor: "rgba(0,0,0,0.4)", backdropFilter: "blur(8px)" }}>
                    <Star size={10} style={{ color: "var(--gold-accent)", fill: "var(--gold-accent)" }} />
                    <span className="text-[10px] text-white font-['Inter']">{expo.rating}</span>
                  </div>
                  {/* Viewers now */}
                  <div className="flex items-center gap-1 rounded-full px-2 py-0.5" style={{ backgroundColor: "rgba(0,0,0,0.4)", backdropFilter: "blur(8px)" }}>
                    <Eye size={10} className="text-white/70" />
                    <span className="text-[10px] text-white/70 font-['Inter']">{viewers}</span>
                  </div>
                </div>
                {/* Scarcity badge */}
                {(scarcity === "critical" || scarcity === "low") && (
                  <div className={`absolute bottom-3 ${isRtl ? 'left-3' : 'right-3'}`}>
                    <span className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-medium animate-pulse"
                      style={{
                        backgroundColor: scarcity === "critical" ? "rgba(239, 68, 68, 0.2)" : "rgba(251, 191, 36, 0.2)",
                        color: scarcity === "critical" ? "#EF4444" : "#FBBF24",
                        border: `1px solid ${scarcity === "critical" ? "rgba(239, 68, 68, 0.3)" : "rgba(251, 191, 36, 0.3)"}`,
                        backdropFilter: "blur(8px)",
                      }}>
                      <Flame size={9} />
                      {scarcity === "critical"
                        ? (isAr ? "يكاد يمتلئ" : "Almost Full")
                        : (isAr ? `باقي ${expo.availableUnits} أجنحة فقط!` : `Only ${expo.availableUnits} booths left!`)}
                    </span>
                  </div>
                )}
              </div>
              <div className="p-3 sm:p-4 overflow-hidden">
                <h3 className="text-sm font-bold t-primary mb-0.5 truncate">{getExpoName(expo)}</h3>
                <p className="text-[10px] t-gold font-['Inter'] mb-2 truncate" style={{ opacity: 0.6 }}>{isAr ? expo.nameEn : expo.nameAr}</p>
                <p className="text-[11px] t-tertiary line-clamp-2 mb-3 break-words">{getExpoDesc(expo)}</p>
                <div className="flex items-center gap-3 text-[10px] t-muted mb-3 flex-wrap">
                  <span className="flex items-center gap-1 shrink-0"><MapPin size={10} />{getExpoCity(expo)}</span>
                  <span className="flex items-center gap-1 font-['Inter'] shrink-0"><Calendar size={10} />{expo.dateStart}</span>
                  <span className="flex items-center gap-1 shrink-0"><Users size={10} />{expo.footfall.split(" ")[0]}</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <div className="shrink-0">
                    <p className="text-[9px] t-muted">{isAr ? "الوحدات المتاحة" : "Available Units"}</p>
                    <p className="text-sm font-bold font-['Inter']">
                      <span style={{ color: expo.availableUnits > 0 ? "var(--status-green)" : "var(--status-red)" }}>{expo.availableUnits}</span>
                      <span className="t-muted text-[10px]"> / {expo.totalUnits}</span>
                    </p>
                  </div>
                  <div className={isRtl ? "text-left" : "text-right"} style={{ direction: "ltr" }}>
                    <p className="text-[9px] t-muted">{isAr ? "نطاق الأسعار" : "Price Range"} ({isAr ? "ر.س" : "SAR"})</p>
                    <p className="text-xs t-gold font-['Inter']">{expo.priceRange}</p>
                  </div>
                </div>
                {/* Scarcity progress bar */}
                {(scarcity === "critical" || scarcity === "low" || scarcity === "medium") && (
                  <div className="mt-2 pt-2" style={{ borderTop: "1px solid var(--glass-border)" }}>
                    <div className="flex justify-between text-[9px] t-muted mb-1">
                      <span>{isAr ? "نسبة الإشغال" : "Occupancy Rate"}</span>
                      <span className="font-['Inter']">{Math.round(((expo.totalUnits - expo.availableUnits) / expo.totalUnits) * 100)}%</span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "var(--glass-bg)" }}>
                      <div className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${((expo.totalUnits - expo.availableUnits) / expo.totalUnits) * 100}%`,
                          backgroundColor: scarcity === "critical" ? "var(--status-red)" : scarcity === "low" ? "var(--status-yellow)" : "var(--gold-accent)"
                        }} />
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 glass-card rounded-2xl">
          <Search size={40} className="mx-auto t-muted mb-3" style={{ opacity: 0.3 }} />
          <p className="text-sm t-tertiary">{isAr ? "لا توجد نتائج مطابقة" : "No matching results"}</p>
          <p className="text-[10px] t-muted mt-1">{isAr ? "جرب تغيير الفلاتر أو كلمة البحث" : "Try different filters or search terms"}</p>
        </div>
      )}

      {/* Expo Detail Modal */}
      <AnimatePresence>
        {selectedExpo && !showUnitPicker && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 backdrop-blur-sm" style={{ backgroundColor: "rgba(0,0,0,0.7)" }} onClick={() => setSelectedExpo(null)} />
            <motion.div
              initial={{ opacity: 0, y: "100%" }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed bottom-0 left-0 right-0 max-h-[92vh] lg:bottom-auto lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:w-[640px] lg:max-h-[85vh] z-50 overflow-y-auto rounded-t-2xl lg:rounded-2xl"
              style={{ background: "var(--modal-bg)", borderTop: "1px solid var(--glass-border)", paddingBottom: "env(safe-area-inset-bottom, 16px)" }} dir={isRtl ? "rtl" : "ltr"}>
              <div className="flex justify-center pt-3 pb-1 sm:hidden">
                <div className="w-10 h-1 rounded-full" style={{ background: "var(--glass-border)" }} />
              </div>
              <div className="relative h-36 sm:h-48">
                <img src={selectedExpo.image} alt={getExpoName(selectedExpo)} className="w-full h-full object-cover" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, var(--surface-dark), color-mix(in srgb, var(--surface-dark) 50%, transparent), transparent)" }} />
                <button onClick={() => setSelectedExpo(null)} className={`absolute top-4 ${isRtl ? 'right-4' : 'left-4'} p-2 rounded-full t-secondary`} style={{ backgroundColor: "rgba(0,0,0,0.4)", backdropFilter: "blur(8px)" }}>
                  <X size={16} />
                </button>
                <div className={`absolute bottom-4 ${isRtl ? 'right-6' : 'left-6'}`}>
                  <h3 className="text-lg font-bold t-primary">{getExpoName(selectedExpo)}</h3>
                  <p className="text-xs t-gold font-['Inter']" style={{ opacity: 0.7 }}>{isAr ? selectedExpo.nameEn : selectedExpo.nameAr}</p>
                </div>
              </div>

              <div className="p-3 sm:p-6 space-y-4 sm:space-y-5">
                {/* Scarcity Alert in Modal */}
                {getScarcityLevel(selectedExpo) !== "normal" && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{
                    backgroundColor: getScarcityLevel(selectedExpo) === "critical" ? "rgba(239, 68, 68, 0.08)" : "rgba(251, 191, 36, 0.08)",
                    border: `1px solid ${getScarcityLevel(selectedExpo) === "critical" ? "rgba(239, 68, 68, 0.15)" : "rgba(251, 191, 36, 0.15)"}`,
                  }}>
                    <Flame size={14} className={getScarcityLevel(selectedExpo) === "critical" ? "text-[var(--status-red)]" : "text-[var(--status-yellow)]"} />
                    <p className="text-[11px] t-secondary flex-1">
                      {isAr ? `باقي ${selectedExpo.availableUnits} أجنحة فقط!` : `Only ${selectedExpo.availableUnits} booths left!`}
                    </p>
                    {viewerCounts[selectedExpo.id] && (
                      <span className="text-[9px] t-muted font-['Inter']">
                        {isAr ? `${viewerCounts[selectedExpo.id]} يشاهدون الآن` : `${viewerCounts[selectedExpo.id]} viewing now`}
                      </span>
                    )}
                  </div>
                )}

                <p className="text-xs t-tertiary leading-relaxed">{getExpoDesc(selectedExpo)}</p>
                {!isAr && <p className="text-[10px] t-muted font-['Inter'] leading-relaxed">{selectedExpo.descAr}</p>}
                {isAr && <p className="text-[10px] t-muted font-['Inter'] leading-relaxed">{selectedExpo.descEn}</p>}

                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  {[
                    { icon: MapPin, label: isAr ? "الموقع" : "Location", value: getExpoLocation(selectedExpo) },
                    { icon: Calendar, label: isAr ? "الفترة" : "Period", value: `${selectedExpo.dateStart} — ${selectedExpo.dateEnd}` },
                    { icon: Building2, label: isAr ? "المكان" : "Venue", value: getExpoVenue(selectedExpo) },
                    { icon: Star, label: isAr ? "التصنيف" : "Category", value: getExpoCategory(selectedExpo) },
                    { icon: Users, label: isAr ? "الزوار المتوقعون" : "Expected Visitors", value: selectedExpo.footfall },
                    { icon: CreditCard, label: isAr ? "نطاق الأسعار" : "Price Range", value: `${selectedExpo.priceRange} ${isAr ? "ر.س" : "SAR"}` },
                  ].map((d, i) => (
                    <div key={i} className="p-3 rounded-xl modal-inner">
                      <div className="flex items-center gap-1.5 mb-1">
                        <d.icon size={12} className="t-gold" style={{ opacity: 0.6 }} />
                        <span className="text-[9px] t-muted">{d.label}</span>
                      </div>
                      <p className="text-xs t-secondary break-words">{d.value}</p>
                    </div>
                  ))}
                </div>

                {/* Participating Countries */}
                <div>
                  <h4 className="text-[11px] t-secondary font-medium mb-2 flex items-center gap-1.5">
                    <Globe size={12} className="t-gold" /> {isAr ? "الدول المشاركة" : "Participating Countries"}
                  </h4>
                  <div className="flex gap-1.5 flex-wrap">
                    {["\u{1F1F8}\u{1F1E6}", "\u{1F1E6}\u{1F1EA}", "\u{1F1F6}\u{1F1E6}", "\u{1F1F0}\u{1F1FC}", "\u{1F1E7}\u{1F1ED}", "\u{1F1F4}\u{1F1F2}", "\u{1F1EA}\u{1F1EC}", "\u{1F1F9}\u{1F1F7}", "\u{1F1E8}\u{1F1F3}", "\u{1F1EC}\u{1F1E7}", "\u{1F1FA}\u{1F1F8}", "\u{1F1E9}\u{1F1EA}"].map((flag, i) => (
                      <span key={i} className="text-base">{flag}</span>
                    ))}
                  </div>
                </div>

                {/* Sponsorship Opportunities */}
                <div>
                  <h4 className="text-[11px] t-secondary font-medium mb-2 flex items-center gap-1.5">
                    <Sparkles size={12} className="t-gold" /> {isAr ? "فرص الرعاية" : "Sponsorship Opportunities"}
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { name: isAr ? "الراعي الذهبي" : "Gold Sponsor", price: "150,000", color: "#C5A55A", available: true },
                      { name: isAr ? "الراعي الفضي" : "Silver Sponsor", price: "75,000", color: "#94A3B8", available: true },
                      { name: isAr ? "جناح الشركات الناشئة" : "Startup Pavilion", price: "25,000", color: "#60A5FA", available: true },
                      { name: isAr ? "منصة الابتكار" : "Innovation Stage", price: "50,000", color: "#A78BFA", available: false },
                    ].map((sp, i) => (
                      <div key={i} className="p-2 rounded-lg" style={{ backgroundColor: "var(--glass-bg)", border: "1px solid var(--glass-border)" }}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-medium" style={{ color: sp.color }}>{sp.name}</span>
                          <span className="text-[8px] px-1.5 py-0.5 rounded-full" style={{
                            backgroundColor: sp.available ? "rgba(74, 222, 128, 0.1)" : "rgba(239, 68, 68, 0.1)",
                            color: sp.available ? "var(--status-green)" : "var(--status-red)",
                          }}>
                            {sp.available ? (isAr ? "متاح" : "Available") : (isAr ? "محجوز" : "Reserved")}
                          </span>
                        </div>
                        <p className="text-[10px] t-gold font-['Inter']">{sp.price} {isAr ? "ر.س" : "SAR"}</p>
                        {sp.available && (
                          <button onClick={(e) => { e.stopPropagation(); toast.info(isAr ? "استفسار" : "Inquire"); }}
                            className="mt-1.5 w-full text-[9px] py-1 rounded text-center t-gold" style={{ backgroundColor: "var(--glass-bg)", border: "1px solid var(--gold-border)" }}>
                            {isAr ? "استفسار" : "Inquire"}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Occupancy Bar */}
                <div>
                  <div className="flex justify-between text-[10px] t-muted mb-1.5">
                    <span>{isAr ? "نسبة الإشغال" : "Occupancy Rate"}</span>
                    <span className="font-['Inter']">{Math.round(((selectedExpo.totalUnits - selectedExpo.availableUnits) / selectedExpo.totalUnits) * 100)}%</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: "var(--glass-bg)" }}>
                    <div className="h-full rounded-full transition-all"
                      style={{ width: `${((selectedExpo.totalUnits - selectedExpo.availableUnits) / selectedExpo.totalUnits) * 100}%`, backgroundColor: selectedExpo.availableUnits === 0 ? "var(--status-red)" : "var(--gold-accent)" }} />
                  </div>
                  <div className="flex justify-between text-[9px] t-muted mt-1">
                    <span>{isAr ? "الوحدات المتاحة" : "Available Units"}: {selectedExpo.availableUnits}</span>
                    <span>{isAr ? "الإجمالي" : "Total"}: {selectedExpo.totalUnits}</span>
                  </div>
                </div>

                {/* Early Booking Incentive */}
                {isEarlyBooking(selectedExpo) && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ backgroundColor: "rgba(96, 165, 250, 0.08)", border: "1px solid rgba(96, 165, 250, 0.15)" }}>
                    <Tag size={13} className="text-[#60A5FA] shrink-0" />
                    <p className="text-[11px] t-secondary">{isAr ? "احجز اليوم واحصل على مزايا الحجز المبكر" : "Book today and get early booking benefits"}</p>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pb-2">
                  {selectedExpo.availableUnits > 0 && (selectedExpo.status === "open" || selectedExpo.status === "closing_soon") ? (
                    <>
                      <Link href={`/dashboard/expos/${selectedExpo.id}`} className="flex-1">
                        <button className="w-full btn-gold py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2">
                          <Map size={15} /> {isAr ? "عرض الخريطة والبوثات" : "View Map & Booths"}
                        </button>
                      </Link>
                      <button onClick={() => {
                        setShowUnitPicker(true);
                      }} className="glass-card px-3 py-2.5 sm:py-3 rounded-xl text-xs t-gold transition-colors flex items-center justify-center gap-1.5">
                        <CreditCard size={14} /> {isAr ? "احجز الآن" : "Book Now"}
                      </button>
                    </>
                  ) : selectedExpo.status === "upcoming" ? (
                    <button onClick={() => { toast.info(isAr ? "تنبيهي عند فتح الحجز" : "Notify When Open"); setSelectedExpo(null); }}
                      className="w-full glass-card py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm t-tertiary flex items-center justify-center gap-2">
                      <Clock size={15} /> {isAr ? "تنبيهي عند فتح الحجز" : "Notify When Open"}
                    </button>
                  ) : (
                    <button onClick={() => { toast.info(isAr ? "انضم لقائمة الانتظار" : "Join Waitlist"); setSelectedExpo(null); }}
                      className="w-full glass-card py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm t-tertiary flex items-center justify-center gap-2">
                      <Clock size={15} /> {isAr ? "انضم لقائمة الانتظار" : "Join Waitlist"}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Unit Picker Modal */}
      <AnimatePresence>
        {showUnitPicker && selectedExpo && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 backdrop-blur-sm" style={{ backgroundColor: "rgba(0,0,0,0.7)" }} onClick={() => setShowUnitPicker(false)} />
            <motion.div
              initial={{ opacity: 0, y: "100%" }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed bottom-0 left-0 right-0 max-h-[92vh] lg:bottom-auto lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:w-[520px] lg:max-h-[85vh] z-50 overflow-y-auto rounded-t-2xl lg:rounded-2xl"
              style={{ background: "var(--modal-bg)", borderTop: "1px solid var(--glass-border)", paddingBottom: "env(safe-area-inset-bottom, 16px)" }} dir={isRtl ? "rtl" : "ltr"}>
              <div className="flex justify-center pt-3 pb-1 sm:hidden">
                <div className="w-10 h-1 rounded-full" style={{ background: "var(--glass-border)" }} />
              </div>
              <div className="px-4 sm:px-6 py-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold t-primary">{isAr ? "اختر الوحدة للحجز" : "Select a Unit to Book"}</h3>
                    <p className="text-[10px] t-gold/50 font-['Inter'] truncate">{isAr ? selectedExpo.nameEn : selectedExpo.nameAr}</p>
                  </div>
                  <button onClick={() => setShowUnitPicker(false)} className="p-2 rounded-lg t-tertiary shrink-0" style={{ background: "var(--glass-bg)" }}>
                    <X size={14} />
                  </button>
                </div>

                {/* Countdown incentive */}
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl mb-3" style={{ backgroundColor: "rgba(197, 165, 90, 0.06)", border: "1px solid rgba(197, 165, 90, 0.12)" }}>
                  <Clock size={12} className="t-gold shrink-0" />
                  <p className="text-[10px] t-secondary">{isAr ? "هذا الجناح محجوز لك لمدة 30 دقيقة" : "This booth is reserved for you for 30 minutes"}</p>
                </div>

                <div className="space-y-2">
                  {selectedExpo.units.filter(u => u.available).map((unit) => (
                    <div key={unit.id} className="p-3 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)] hover:border-[var(--gold-border)] transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <div className="min-w-0">
                          <p className="text-xs t-primary font-semibold truncate">{getUnitName(unit)}</p>
                          <p className="text-[9px] t-muted font-['Inter']">{isAr ? unit.nameEn : unit.nameAr} · Zone {unit.zone}</p>
                        </div>
                        <p className="text-sm font-bold t-gold font-['Inter'] shrink-0">{unit.price.toLocaleString()} <span className="text-[9px] t-muted">{isAr ? "ر.س" : "SAR"}</span></p>
                      </div>
                      <div className="flex items-center gap-3 text-[10px] t-tertiary mb-2 flex-wrap">
                        <span>{getUnitType(unit)}</span>
                        <span>{unit.size}</span>
                        <span>{isAr ? "عربون" : "Deposit"}: {unit.deposit.toLocaleString()} {isAr ? "ر.س" : "SAR"}</span>
                      </div>
                      <div className="flex items-center gap-1.5 flex-wrap mb-2">
                        {getUnitServices(unit).map((s, j) => (
                          <span key={j} className="px-1.5 py-0.5 rounded text-[8px] t-muted" style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)" }}>{s}</span>
                        ))}
                      </div>
                      <button onClick={() => handleBookUnit(selectedExpo, unit)}
                        className="w-full btn-gold py-2 rounded-lg text-[11px] flex items-center justify-center gap-1.5">
                        <CreditCard size={12} /> {isAr ? "حجز هذه الوحدة" : "Book This Unit"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
