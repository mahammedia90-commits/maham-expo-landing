'use client';

/**
 * Waitlist — Join waiting list for sold-out booths
 */
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Clock, Bell, BellRing, MapPin, Building2,
  X, ArrowRight, ArrowLeft, Trash2, AlertTriangle, Sparkles
} from "lucide-react";
import { toast } from "sonner";
import { useLanguageStore } from "@/shared/store/useLanguageStore";

interface WaitlistItem {
  id: string;
  expoId: string;
  expoNameAr: string;
  expoNameEn: string;
  boothCode: string;
  zone: string;
  boothType: string;
  price: number;
  dateAdded: string;
  position: number;
  status: "waiting" | "available" | "expired";
}

export default function WaitlistPage() {
  const { language, isRtl } = useLanguageStore();
  const isAr = language === 'ar';
  const BackArrow = isRtl ? ArrowRight : ArrowLeft;

  const [waitlist, setWaitlist] = useState<WaitlistItem[]>([
    {
      id: "WL-001",
      expoId: "kafd-expo-2026",
      expoNameAr: "\u0645\u0639\u0631\u0636 KAFD \u0644\u0644\u062A\u0642\u0646\u064A\u0629 \u0648\u0627\u0644\u0627\u0628\u062A\u0643\u0627\u0631 2026",
      expoNameEn: "KAFD Technology & Innovation Expo 2026",
      boothCode: "A-01",
      zone: "A",
      boothType: "island",
      price: 180000,
      dateAdded: "2026-03-10",
      position: 2,
      status: "waiting",
    },
    {
      id: "WL-002",
      expoId: "boulevard-world-2026",
      expoNameAr: "\u0628\u0648\u0644\u064A\u0641\u0627\u0631\u062F \u0648\u0648\u0631\u0644\u062F \u2014 \u0645\u0648\u0633\u0645 \u0627\u0644\u0631\u064A\u0627\u0636 2026",
      expoNameEn: "Boulevard World \u2014 Riyadh Season 2026",
      boothCode: "B-05",
      zone: "B",
      boothType: "premium",
      price: 95000,
      dateAdded: "2026-03-08",
      position: 1,
      status: "available",
    },
  ]);

  const [selectedItem, setSelectedItem] = useState<WaitlistItem | null>(null);

  const removeFromWaitlist = (id: string) => {
    setWaitlist(prev => prev.filter(w => w.id !== id));
    toast.success(isAr ? "\u062A\u0645\u062A \u0627\u0644\u0625\u0632\u0627\u0644\u0629 \u0645\u0646 \u0642\u0627\u0626\u0645\u0629 \u0627\u0644\u0627\u0646\u062A\u0638\u0627\u0631" : "Removed from waitlist");
    setSelectedItem(null);
  };

  const stats = useMemo(() => ({
    total: waitlist.length,
    waiting: waitlist.filter(w => w.status === "waiting").length,
    available: waitlist.filter(w => w.status === "available").length,
  }), [waitlist]);

  const statusLabel = (status: string) => {
    const map: Record<string, string> = {
      waiting: isAr ? "\u0628\u0627\u0646\u062A\u0638\u0627\u0631" : "Waiting",
      available: isAr ? "\u0645\u062A\u0627\u062D \u0627\u0644\u0622\u0646!" : "Available Now!",
      expired: isAr ? "\u0645\u0646\u062A\u0647\u064A" : "Expired",
    };
    return map[status] || status;
  };

  const statusColor: Record<string, string> = {
    waiting: "#FBBF24",
    available: "#4ADE80",
    expired: "#F87171",
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-gold-gradient" style={{ fontFamily: "'IBM Plex Sans Arabic', serif" }}>
            {isAr ? "\u0642\u0627\u0626\u0645\u0629 \u0627\u0644\u0627\u0646\u062A\u0638\u0627\u0631" : "Waitlist"}
          </h2>
          <p className="text-[12px] t-gold/50 font-['Inter']">Booth Waitlist Management</p>
        </div>
        <Link href="/dashboard/expos">
          <button className="btn-gold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5">
            <MapPin size={13} />
            {isAr ? "\u062A\u0635\u0641\u062D \u0627\u0644\u0645\u0639\u0627\u0631\u0636" : "Browse Expos"}
          </button>
        </Link>
      </div>

      {/* Available Now Banner */}
      {stats.available > 0 && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 px-4 py-3 rounded-xl"
          style={{ backgroundColor: "rgba(74, 222, 128, 0.08)", border: "1px solid rgba(74, 222, 128, 0.15)" }}>
          <BellRing size={18} className="text-green-400 animate-bounce shrink-0" />
          <div className="flex-1">
            <p className="text-sm text-green-400 font-bold">
              {isAr ? `${stats.available} \u0648\u062D\u062F\u0629 \u0623\u0635\u0628\u062D\u062A \u0645\u062A\u0627\u062D\u0629!` : `${stats.available} booth(s) now available!`}
            </p>
            <p className="text-[12px] t-muted">
              {isAr ? "\u0633\u0627\u0631\u0639 \u0628\u0627\u0644\u062D\u062C\u0632 \u0642\u0628\u0644 \u0646\u0641\u0627\u0630 \u0627\u0644\u0641\u0631\u0635\u0629" : "Book now before it's taken"}
            </p>
          </div>
        </motion.div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: isAr ? "\u0625\u062C\u0645\u0627\u0644\u064A \u0627\u0644\u0627\u0646\u062A\u0638\u0627\u0631" : "Total Waitlist", value: stats.total, color: "#C5A55A" },
          { label: isAr ? "\u0628\u0627\u0646\u062A\u0638\u0627\u0631" : "Waiting", value: stats.waiting, color: "#FBBF24" },
          { label: isAr ? "\u0645\u062A\u0627\u062D \u0627\u0644\u0622\u0646" : "Available", value: stats.available, color: "#4ADE80" },
        ].map((s, i) => (
          <div key={i} className="glass-card rounded-xl p-3 text-center">
            <p className="text-xl font-bold font-['Inter']" style={{ color: s.color }}>{s.value}</p>
            <p className="text-[11px] t-tertiary mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Waitlist Items */}
      {waitlist.length === 0 ? (
        <div className="glass-card rounded-2xl p-8 text-center">
          <Bell size={36} className="mx-auto t-muted mb-3" />
          <p className="text-sm t-secondary mb-1">
            {isAr ? "\u0642\u0627\u0626\u0645\u0629 \u0627\u0644\u0627\u0646\u062A\u0638\u0627\u0631 \u0641\u0627\u0631\u063A\u0629" : "Your waitlist is empty"}
          </p>
          <p className="text-[12px] t-muted mb-3">
            {isAr ? "\u064A\u0645\u0643\u0646\u0643 \u0627\u0644\u0627\u0646\u0636\u0645\u0627\u0645 \u0644\u0642\u0627\u0626\u0645\u0629 \u0627\u0644\u0627\u0646\u062A\u0638\u0627\u0631 \u0645\u0646 \u0635\u0641\u062D\u0629 \u062A\u0641\u0627\u0635\u064A\u0644 \u0627\u0644\u0645\u0639\u0631\u0636 \u0639\u0646\u062F \u0646\u0641\u0627\u0630 \u0627\u0644\u0648\u062D\u062F\u0627\u062A" : "Join the waitlist from expo details when booths are sold out"}
          </p>
          <Link href="/dashboard/expos">
            <button className="btn-gold px-4 py-2 rounded-xl text-xs">
              {isAr ? "\u062A\u0635\u0641\u062D \u0627\u0644\u0645\u0639\u0627\u0631\u0636" : "Browse Expos"}
            </button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {waitlist.map((item, i) => {
            const sc = statusColor[item.status];
            return (
              <motion.div key={item.id}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                onClick={() => setSelectedItem(item)}
                className="glass-card rounded-xl p-4 cursor-pointer hover:border-[#C5A55A]/20 transition-all active:scale-[0.98]">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-bold t-primary">{item.boothCode}</p>
                      <span className="px-2 py-0.5 rounded-full text-[11px]"
                        style={{ backgroundColor: `${sc}15`, color: sc, border: `1px solid ${sc}25` }}>
                        {statusLabel(item.status)}
                      </span>
                    </div>
                    <p className="text-xs t-tertiary truncate">
                      {isAr ? item.expoNameAr : item.expoNameEn}
                    </p>
                  </div>
                  <div className="text-end shrink-0">
                    <p className="text-sm font-bold text-[#C5A55A] font-['Inter']">
                      {item.price.toLocaleString()}
                    </p>
                    <p className="text-[11px] t-muted">{isAr ? "\u0631.\u0633" : "SAR"}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-[12px] t-muted">
                    <span className="flex items-center gap-1">
                      <Building2 size={10} /> {item.boothType}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin size={10} /> Zone {item.zone}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={10} /> {item.dateAdded}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] t-muted">
                      #{item.position} {isAr ? "\u0641\u064A \u0627\u0644\u0642\u0627\u0626\u0645\u0629" : "in queue"}
                    </span>
                  </div>
                </div>

                {item.status === "available" && (
                  <div className="mt-3 flex gap-2">
                    <Link href={`/dashboard/expos/${item.expoId}`} className="flex-1">
                      <button className="w-full btn-gold py-2 rounded-lg text-xs flex items-center justify-center gap-1.5">
                        <Sparkles size={12} />
                        {isAr ? "\u0627\u062D\u062C\u0632 \u0627\u0644\u0622\u0646" : "Book Now"}
                      </button>
                    </Link>
                    <button onClick={(e) => { e.stopPropagation(); removeFromWaitlist(item.id); }}
                      className="glass-card px-3 py-2 rounded-lg text-xs text-red-400/60 hover:text-red-400 transition-colors">
                      <Trash2 size={13} />
                    </button>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {/* How Waitlist Works */}
      <div className="glass-card rounded-2xl p-5">
        <h3 className="text-sm font-bold t-secondary mb-3 flex items-center gap-2">
          <AlertTriangle size={14} className="t-gold" />
          {isAr ? "\u0643\u064A\u0641 \u062A\u0639\u0645\u0644 \u0642\u0627\u0626\u0645\u0629 \u0627\u0644\u0627\u0646\u062A\u0638\u0627\u0631\u061F" : "How does the waitlist work?"}
        </h3>
        <div className="space-y-2">
          {[
            { ar: "\u0639\u0646\u062F \u0646\u0641\u0627\u0630 \u0648\u062D\u062F\u0629 \u0645\u0639\u064A\u0646\u0629\u060C \u064A\u0645\u0643\u0646\u0643 \u0627\u0644\u0627\u0646\u0636\u0645\u0627\u0645 \u0644\u0642\u0627\u0626\u0645\u0629 \u0627\u0644\u0627\u0646\u062A\u0638\u0627\u0631", en: "When a booth is sold out, you can join the waitlist" },
            { ar: "\u0625\u0630\u0627 \u0623\u0644\u063A\u0649 \u0627\u0644\u062A\u0627\u062C\u0631 \u0627\u0644\u062D\u0627\u0644\u064A \u062D\u062C\u0632\u0647\u060C \u0633\u062A\u062A\u0644\u0642\u0649 \u0625\u0634\u0639\u0627\u0631\u0627\u064B \u0641\u0648\u0631\u064A\u0627\u064B", en: "If the current trader cancels, you'll receive an instant notification" },
            { ar: "\u0644\u062F\u064A\u0643 30 \u062F\u0642\u064A\u0642\u0629 \u0644\u0625\u062A\u0645\u0627\u0645 \u0627\u0644\u062D\u062C\u0632 \u0642\u0628\u0644 \u0627\u0646\u062A\u0642\u0627\u0644 \u0627\u0644\u0641\u0631\u0635\u0629 \u0644\u0644\u062A\u0627\u0644\u064A", en: "You have 30 minutes to complete booking before it moves to the next person" },
            { ar: "\u062A\u0631\u062A\u064A\u0628\u0643 \u0641\u064A \u0627\u0644\u0642\u0627\u0626\u0645\u0629 \u064A\u0639\u062A\u0645\u062F \u0639\u0644\u0649 \u062A\u0627\u0631\u064A\u062E \u0627\u0644\u0627\u0646\u0636\u0645\u0627\u0645", en: "Your position is based on when you joined" },
          ].map((step, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-[#C5A55A]/10 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-[11px] font-bold text-[#C5A55A]">{i + 1}</span>
              </div>
              <p className="text-[11px] t-tertiary leading-relaxed">
                {isAr ? step.ar : step.en}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 backdrop-blur-sm" style={{ backgroundColor: "var(--modal-overlay)" }} onClick={() => setSelectedItem(null)} />
            <motion.div
              initial={{ opacity: 0, y: "100%" }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed bottom-0 left-0 right-0 max-h-[80vh] z-50 overflow-y-auto rounded-t-2xl"
              style={{ background: "var(--modal-bg)", borderTop: "1px solid var(--glass-border)", paddingBottom: "env(safe-area-inset-bottom, 16px)" }}
              dir={isRtl ? "rtl" : "ltr"}>
              <div className="flex justify-center pt-3 pb-1 sm:hidden">
                <div className="w-10 h-1 rounded-full" style={{ background: "var(--glass-border)" }} />
              </div>
              <div className="px-5 py-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold t-primary">
                    {isAr ? "\u062A\u0641\u0627\u0635\u064A\u0644 \u0627\u0644\u0627\u0646\u062A\u0638\u0627\u0631" : "Waitlist Details"}
                  </h3>
                  <button onClick={() => setSelectedItem(null)} className="p-2 rounded-lg t-tertiary" style={{ background: "var(--glass-bg)" }}>
                    <X size={16} />
                  </button>
                </div>

                <div className="glass-card rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-lg font-bold text-[#C5A55A]">{selectedItem.boothCode}</p>
                      <p className="text-[12px] t-muted">Zone {selectedItem.zone} \u00B7 {selectedItem.boothType}</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[12px]"
                      style={{ backgroundColor: `${statusColor[selectedItem.status]}15`, color: statusColor[selectedItem.status] }}>
                      {statusLabel(selectedItem.status)}
                    </span>
                  </div>
                  <p className="text-xs t-tertiary mb-2">
                    {isAr ? selectedItem.expoNameAr : selectedItem.expoNameEn}
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-[12px]">
                    <div className="p-2 rounded-lg" style={{ background: "var(--glass-bg)" }}>
                      <p className="t-muted">{isAr ? "\u0627\u0644\u0633\u0639\u0631" : "Price"}</p>
                      <p className="t-secondary font-bold font-['Inter']">{selectedItem.price.toLocaleString()} {isAr ? "\u0631.\u0633" : "SAR"}</p>
                    </div>
                    <div className="p-2 rounded-lg" style={{ background: "var(--glass-bg)" }}>
                      <p className="t-muted">{isAr ? "\u062A\u0631\u062A\u064A\u0628\u0643" : "Position"}</p>
                      <p className="t-secondary font-bold font-['Inter']">#{selectedItem.position}</p>
                    </div>
                    <div className="p-2 rounded-lg" style={{ background: "var(--glass-bg)" }}>
                      <p className="t-muted">{isAr ? "\u062A\u0627\u0631\u064A\u062E \u0627\u0644\u0627\u0646\u0636\u0645\u0627\u0645" : "Date Joined"}</p>
                      <p className="t-secondary font-['Inter']">{selectedItem.dateAdded}</p>
                    </div>
                    <div className="p-2 rounded-lg" style={{ background: "var(--glass-bg)" }}>
                      <p className="t-muted">{isAr ? "\u0627\u0644\u062D\u0627\u0644\u0629" : "Status"}</p>
                      <p style={{ color: statusColor[selectedItem.status] }}>{statusLabel(selectedItem.status)}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  {selectedItem.status === "available" && (
                    <Link href={`/dashboard/expos/${selectedItem.expoId}`} className="flex-1">
                      <button className="w-full btn-gold py-3 rounded-xl text-sm flex items-center justify-center gap-2">
                        <Sparkles size={14} />
                        {isAr ? "\u0627\u062D\u062C\u0632 \u0627\u0644\u0622\u0646" : "Book Now"}
                      </button>
                    </Link>
                  )}
                  <button onClick={() => removeFromWaitlist(selectedItem.id)}
                    className="glass-card px-4 py-3 rounded-xl text-xs text-red-400/70 hover:text-red-400 transition-colors flex items-center gap-1.5">
                    <Trash2 size={13} />
                    {isAr ? "\u0625\u0632\u0627\u0644\u0629" : "Remove"}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
