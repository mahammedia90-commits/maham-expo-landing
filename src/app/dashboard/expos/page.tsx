'use client';

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Building2, Search, SlidersHorizontal, Calendar, Users, MapPin,
  Star, Heart, ArrowUpRight, Tag, Eye
} from "lucide-react";
import { useLanguageStore } from "@/shared/store/useLanguageStore";
import { events2026, type ExpoEvent } from "@/features/merchant-dashboard/data/events2026";

type StatusFilter = "all" | "upcoming" | "active" | "completed";

export default function BrowseExpos() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const { language, isRtl } = useLanguageStore();

  const isAr = language === "ar";

  const getExpoName = (e: ExpoEvent) => isAr ? e.nameAr : e.nameEn;
  const getExpoCity = (e: ExpoEvent) => isAr ? e.city : e.cityEn;
  const getExpoCategory = (e: ExpoEvent) => isAr ? e.category : e.categoryEn;

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Map existing statuses to the Manus filter model
  const getDisplayStatus = (status: ExpoEvent["status"]): StatusFilter => {
    switch (status) {
      case "upcoming": return "upcoming";
      case "open":
      case "closing_soon": return "active";
      case "full": return "completed";
      default: return "active";
    }
  };

  const getStatusLabel = (status: ExpoEvent["status"]) => {
    const map: Record<string, { label: string; color: string }> = {
      upcoming: { label: isAr ? "قادم" : "Upcoming", color: "blue" },
      open: { label: isAr ? "نشط" : "Active", color: "green" },
      closing_soon: { label: isAr ? "يغلق قريبا" : "Closing Soon", color: "yellow" },
      full: { label: isAr ? "منتهي" : "Completed", color: "gray" },
    };
    return map[status] || { label: status, color: "gray" };
  };

  const getStatusBadgeClasses = (color: string) => {
    switch (color) {
      case "blue": return "bg-blue-500/15 text-blue-400 border border-blue-500/25";
      case "green": return "bg-green-500/15 text-green-400 border border-green-500/25";
      case "yellow": return "bg-yellow-500/15 text-yellow-400 border border-yellow-500/25";
      case "gray": return "bg-gray-500/15 text-gray-400 border border-gray-500/25";
      default: return "bg-gray-500/15 text-gray-400 border border-gray-500/25";
    }
  };

  const filtered = useMemo(() => {
    return events2026.filter(e => {
      const matchSearch = search === "" ||
        e.nameAr.includes(search) ||
        e.nameEn.toLowerCase().includes(search.toLowerCase()) ||
        e.venue.includes(search) ||
        e.venueEn.toLowerCase().includes(search.toLowerCase()) ||
        e.categoryEn.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "all" || getDisplayStatus(e.status) === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [search, statusFilter]);

  const getAvailabilityPct = (e: ExpoEvent) => {
    if (e.totalUnits === 0) return 0;
    return Math.round((e.availableUnits / e.totalUnits) * 100);
  };

  const getAvailabilityColor = (pct: number) => {
    if (pct > 50) return { bar: "bg-green-500", text: "text-green-400" };
    if (pct > 20) return { bar: "bg-yellow-500", text: "text-yellow-400" };
    return { bar: "bg-red-500", text: "text-red-400" };
  };

  const filterTabs: { key: StatusFilter; labelAr: string; labelEn: string }[] = [
    { key: "all", labelAr: "الكل", labelEn: "All" },
    { key: "upcoming", labelAr: "قادم", labelEn: "Upcoming" },
    { key: "active", labelAr: "نشط", labelEn: "Active" },
    { key: "completed", labelAr: "منتهي", labelEn: "Completed" },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#C5A55A]/10">
            <Building2 size={22} className="t-gold" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold t-primary">
              {isAr ? "المعارض المتاحة" : "Available Expos"}
            </h1>
            <p className="text-xs t-tertiary mt-0.5">
              {events2026.length} {isAr ? "معرض متاح للتصفح" : "expos available to browse"}
            </p>
          </div>
        </div>

        {/* Search + Filter Button */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search size={16} className={`absolute top-1/2 -translate-y-1/2 t-muted ${isRtl ? 'right-3' : 'left-3'}`} />
            <input
              type="text"
              placeholder={isAr ? "ابحث عن معرض..." : "Search expos..."}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`w-full glass-card rounded-xl py-2.5 text-sm t-primary placeholder:t-muted gold-focus ${isRtl ? 'pr-10 pl-3' : 'pl-10 pr-3'}`}
              style={{ backgroundColor: "var(--input-bg)" }}
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2.5 rounded-xl transition-colors shrink-0 ${showFilters ? "bg-[#C5A55A]/15 t-gold border border-[#C5A55A]/30" : "glass-card t-tertiary"}`}
          >
            <SlidersHorizontal size={18} />
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {filterTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap shrink-0 ${
                statusFilter === tab.key
                  ? "btn-gold"
                  : "glass-card t-secondary hover:t-primary"
              }`}
            >
              {isAr ? tab.labelAr : tab.labelEn}
            </button>
          ))}
        </div>
      </div>

      {/* Advanced Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="glass-card rounded-xl p-4 text-xs t-muted text-center">
              {isAr ? "فلاتر متقدمة قريبا..." : "Advanced filters coming soon..."}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-xs t-muted">
          {filtered.length} {isAr ? "نتيجة" : "results"}
          {search && ` ${isAr ? "لـ" : "for"} "${search}"`}
        </p>
      </div>

      {/* Expo Cards Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((expo, i) => {
          const status = getStatusLabel(expo.status);
          const availPct = getAvailabilityPct(expo);
          const availColor = getAvailabilityColor(availPct);
          const bookedPct = expo.totalUnits > 0 ? Math.round(((expo.totalUnits - expo.availableUnits) / expo.totalUnits) * 100) : 0;

          return (
            <motion.div
              key={expo.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              whileHover={{ y: -3 }}
              className="glass-card rounded-xl overflow-hidden border border-transparent hover:border-[#C5A55A]/30 transition-all duration-300 group"
            >
              {/* Image Section */}
              <div className="relative h-40 overflow-hidden">
                <img
                  src={expo.image}
                  alt={getExpoName(expo)}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Status Badge - top left */}
                <div className={`absolute top-3 ${isRtl ? 'right-3' : 'left-3'} flex flex-col gap-1.5`}>
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-medium backdrop-blur-sm ${getStatusBadgeClasses(status.color)}`}>
                    {status.label}
                  </span>
                  {expo.featured && (
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-medium backdrop-blur-sm bg-[#C5A55A]/20 text-[#D4B85A] border border-[#C5A55A]/30 flex items-center gap-1">
                      <Star size={10} className="fill-current" />
                      {isAr ? "رسمي" : "Official"}
                    </span>
                  )}
                </div>

                {/* Heart Button - top right */}
                <button
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFavorite(expo.id); }}
                  className={`absolute top-3 ${isRtl ? 'left-3' : 'right-3'} p-2 rounded-full backdrop-blur-sm transition-colors ${
                    favorites.has(expo.id)
                      ? "bg-red-500/20 text-red-400"
                      : "bg-black/30 text-white/70 hover:text-white"
                  }`}
                >
                  <Heart size={16} className={favorites.has(expo.id) ? "fill-current" : ""} />
                </button>

                {/* Bottom overlay: title + city */}
                <div className={`absolute bottom-3 ${isRtl ? 'right-3 left-3' : 'left-3 right-3'}`}>
                  <h3 className="text-sm font-bold text-white truncate">{getExpoName(expo)}</h3>
                  <div className="flex items-center gap-1 text-white/70 text-xs mt-0.5">
                    <MapPin size={12} />
                    <span>{getExpoCity(expo)}</span>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 space-y-3">
                {/* Date range */}
                <div className="flex items-center gap-2 text-xs t-secondary">
                  <Calendar size={14} className="t-muted shrink-0" />
                  <span className="font-['Inter']">{expo.dateStart} - {expo.dateEnd}</span>
                </div>

                {/* Expected visitors */}
                <div className="flex items-center gap-2 text-xs t-secondary">
                  <Users size={14} className="t-muted shrink-0" />
                  <span>{expo.footfall}</span>
                </div>

                {/* Available booths progress bar */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="t-muted">{isAr ? "الأجنحة المتاحة" : "Available Booths"}</span>
                    <span className={`font-medium font-['Inter'] ${availColor.text}`}>
                      {expo.availableUnits}/{expo.totalUnits}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden bg-white/5">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${availColor.bar}`}
                      style={{ width: `${bookedPct}%` }}
                    />
                  </div>
                </div>

                {/* Price range */}
                <div className="flex items-center justify-between text-xs">
                  <span className="t-muted">{isAr ? "نطاق الأسعار" : "Price Range"}</span>
                  <span className="t-gold font-medium font-['Inter']">{expo.priceRange} {isAr ? "ر.س" : "SAR"}</span>
                </div>

                {/* Categories */}
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 rounded-md text-[11px] t-muted bg-white/5 border border-white/10">
                    <Tag size={10} className="inline mr-1 -mt-0.5" />
                    {getExpoCategory(expo)}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-1">
                  <Link href={`/dashboard/expos/${expo.id}`} className="flex-1">
                    <button className="w-full btn-gold py-2.5 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5">
                      <Eye size={14} />
                      {isAr ? "عرض التفاصيل" : "View Details"}
                    </button>
                  </Link>
                  {expo.availableUnits > 0 && expo.status !== "full" && (
                    <Link href={`/dashboard/expos/${expo.id}`}>
                      <button className="glass-card px-4 py-2.5 rounded-xl text-xs t-gold font-medium border border-[#C5A55A]/20 hover:border-[#C5A55A]/40 transition-colors flex items-center gap-1.5">
                        <ArrowUpRight size={14} />
                        {isAr ? "احجز" : "Book Now"}
                      </button>
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Empty State */}
      {filtered.length === 0 && (
        <div className="text-center py-16 glass-card rounded-2xl">
          <Search size={48} className="mx-auto t-muted mb-4" style={{ opacity: 0.2 }} />
          <p className="text-sm t-secondary font-medium">
            {isAr ? "لا توجد نتائج مطابقة" : "No matching results"}
          </p>
          <p className="text-xs t-muted mt-2">
            {isAr ? "جرب تغيير الفلاتر أو كلمة البحث" : "Try different filters or search terms"}
          </p>
          <button
            onClick={() => { setSearch(""); setStatusFilter("all"); }}
            className="mt-4 text-xs t-gold underline"
          >
            {isAr ? "إعادة تعيين الفلاتر" : "Reset Filters"}
          </button>
        </div>
      )}
    </div>
  );
}
