'use client';

/**
 * Notifications — Smart Alert System
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Bell, BellOff, Check, CheckCheck, CreditCard, FileText, Calendar, Shield, Sparkles, Trash2, MessageSquare, Star, Zap, Info } from "lucide-react";
import { toast } from "sonner";
import { useLanguageStore } from "@/shared/store/useLanguageStore";

type NotifType = "booking" | "payment" | "contract" | "security" | "system" | "ai" | "message" | "review";

interface Notification { id: string; type: NotifType; priority: "high" | "medium" | "low"; title: string; desc: string; time: string; read: boolean; actionUrl?: string; actionLabel?: string; }

const iconMap: Record<NotifType, any> = { booking: Calendar, payment: CreditCard, contract: FileText, security: Shield, system: Info, ai: Sparkles, message: MessageSquare, review: Star };
const typeColors: Record<NotifType, string> = { booking: "var(--status-blue)", payment: "var(--status-green)", contract: "#A855F7", security: "var(--status-red)", system: "var(--text-muted)", ai: "var(--gold-accent)", message: "#22D3EE", review: "var(--status-yellow)" };

export default function Notifications() {
  const { language, isRtl } = useLanguageStore();
  const isAr = language === 'ar';

  const [notifications, setNotifications] = useState<Notification[]>([
    { id: "n1", type: "security", priority: "high", title: isAr ? "تنبيه أمني" : "Security Alert", desc: isAr ? "تم محاولة مشاركة معلومات اتصال في المحادثة" : "An attempt to share contact info was detected in chat", time: isAr ? "منذ 5 دقائق" : "5 min ago", read: false, actionUrl: "/dashboard/messages", actionLabel: isAr ? "عرض المحادثة" : "View Chat" },
    { id: "n2", type: "payment", priority: "high", title: isAr ? "تذكير بالدفع" : "Payment Reminder", desc: isAr ? "يرجى سداد دفعة العربون قبل انتهاء المهلة" : "Please pay the deposit before the deadline", time: isAr ? "منذ ساعة" : "1 hour ago", read: false, actionUrl: "/dashboard/payments", actionLabel: isAr ? "ادفع الآن" : "Pay Now" },
    { id: "n3", type: "booking", priority: "medium", title: isAr ? "تأكيد الحجز" : "Booking Confirmed", desc: isAr ? "تم تأكيد حجزك في معرض التقنية — الوحدة A21" : "Your booking at Tech Expo confirmed — Unit A21", time: isAr ? "منذ 3 ساعات" : "3 hours ago", read: false, actionUrl: "/dashboard/contracts", actionLabel: isAr ? "توقيع العقد" : "Sign Contract" },
    { id: "n4", type: "ai", priority: "medium", title: isAr ? "توصية ذكية" : "AI Recommendation", desc: isAr ? "بناءً على نشاطك، نوصي بمعرض الغذاء القادم" : "Based on your activity, we recommend the upcoming Food Expo", time: isAr ? "منذ 5 ساعات" : "5 hours ago", read: true, actionUrl: "/dashboard/expos", actionLabel: isAr ? "عرض المعرض" : "View Expo" },
    { id: "n5", type: "contract", priority: "low", title: isAr ? "تحديث العقد" : "Contract Update", desc: isAr ? "تم تحديث شروط العقد — يرجى المراجعة" : "Contract terms have been updated — please review", time: isAr ? "أمس" : "Yesterday", read: true, actionUrl: "/dashboard/contracts", actionLabel: isAr ? "مراجعة العقد" : "Review Contract" },
    { id: "n6", type: "review", priority: "low", title: isAr ? "تقييم مطلوب" : "Review Required", desc: isAr ? "شاركنا رأيك في معرض الغذاء الذي شاركت فيه" : "Share your feedback on the Food Expo you participated in", time: isAr ? "الأسبوع الماضي" : "Last week", read: true, actionUrl: "/dashboard/reviews", actionLabel: isAr ? "قيّم الآن" : "Review Now" },
    { id: "n7", type: "message", priority: "medium", title: isAr ? "رسالة جديدة" : "New Message", desc: isAr ? "لديك رسالة جديدة من مشرف المعرض" : "You have a new message from the expo supervisor", time: isAr ? "منذ ساعتين" : "2 hours ago", read: false, actionUrl: "/dashboard/messages", actionLabel: isAr ? "عرض الرسالة" : "View Message" },
  ]);

  const [filter, setFilter] = useState<"all" | NotifType>("all");
  const [showRead, setShowRead] = useState(true);

  const unreadCount = notifications.filter(n => !n.read).length;
  const filtered = notifications.filter(n => {
    const matchType = filter === "all" || n.type === filter;
    const matchRead = showRead || !n.read;
    return matchType && matchRead;
  });

  const markAsRead = (id: string) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const markAllRead = () => { setNotifications(prev => prev.map(n => ({ ...n, read: true }))); toast.success(isAr ? "تم تعليم الكل كمقروء" : "All marked as read"); };
  const deleteNotification = (id: string) => { setNotifications(prev => prev.filter(n => n.id !== id)); toast.success(isAr ? "تم الحذف" : "Deleted"); };

  const filterTabs = [
    { value: "all", label: isAr ? "الكل" : "All", count: notifications.length },
    { value: "security", label: isAr ? "الأمان" : "Security", count: notifications.filter(n => n.type === "security").length },
    { value: "payment", label: isAr ? "المدفوعات" : "Payments", count: notifications.filter(n => n.type === "payment").length },
    { value: "booking", label: isAr ? "الحجوزات" : "Bookings", count: notifications.filter(n => n.type === "booking").length },
    { value: "message", label: isAr ? "الرسائل" : "Messages", count: notifications.filter(n => n.type === "message").length },
    { value: "ai", label: "AI", count: notifications.filter(n => n.type === "ai").length },
  ];

  return (
    <div className="space-y-3 sm:space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-gold-gradient" style={{ fontFamily: "'Playfair Display', 'IBM Plex Sans Arabic', serif" }}>{isAr ? "الإشعارات" : "Notifications"}</h2>
          <p className="text-[10px] sm:text-xs t-gold font-['Inter']" style={{ opacity: 0.6 }}>Notifications — {unreadCount} unread</p>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="glass-card px-3 py-1.5 rounded-lg text-[10px] t-gold transition-colors flex items-center gap-1">
            <CheckCheck size={12} /> {isAr ? "تعليم الكل كمقروء" : "Mark All Read"}
          </button>
        )}
      </div>

      <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {filterTabs.map((f) => (
          <button key={f.value} onClick={() => setFilter(f.value as any)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] whitespace-nowrap transition-all ${filter === f.value ? "bg-gold-subtle border-gold t-gold" : "glass-card t-tertiary"}`}
            style={filter === f.value ? { border: "1px solid var(--gold-border)" } : undefined}>
            {f.label}
            {f.count > 0 && <span className="px-1.5 py-0.5 rounded-full text-[9px]" style={{ backgroundColor: "var(--glass-bg)" }}>{f.count}</span>}
          </button>
        ))}
      </div>

      <button onClick={() => setShowRead(!showRead)} className="flex items-center gap-1.5 text-[10px] t-muted transition-colors">
        {showRead ? <Bell size={12} /> : <BellOff size={12} />}
        {showRead ? (isAr ? "إخفاء المقروءة" : "Hide Read") : (isAr ? "عرض الكل" : "Show All")}
      </button>

      <div className="space-y-3">
        <AnimatePresence>
          {filtered.map((notif, i) => {
            const Icon = iconMap[notif.type];
            const color = typeColors[notif.type];
            return (
              <motion.div key={notif.id} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ delay: i * 0.05 }}
                className="glass-card rounded-xl p-3 sm:p-4"
                style={{
                  borderInlineStart: notif.priority === "high" ? `2px solid color-mix(in srgb, var(--status-red) 50%, transparent)` : notif.priority === "medium" ? `2px solid var(--gold-border)` : undefined,
                  backgroundColor: !notif.read ? "var(--glass-bg-hover)" : undefined,
                }}>
                <div className="flex gap-3">
                  <div className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `color-mix(in srgb, ${color} 15%, transparent)` }}>
                    <Icon size={16} style={{ color }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-sm font-medium ${!notif.read ? "t-primary" : "t-secondary"}`}>{notif.title}</p>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[9px] t-muted">{notif.time}</span>
                        {!notif.read && <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "var(--gold-accent)" }} />}
                      </div>
                    </div>
                    <p className="text-xs t-tertiary mt-1.5 leading-relaxed">{notif.desc}</p>
                    <div className="flex items-center gap-3 mt-3">
                      {notif.actionUrl && (
                        <Link href={notif.actionUrl}>
                          <span className="text-[10px] t-gold flex items-center gap-1 cursor-pointer"><Zap size={10} />{notif.actionLabel}</span>
                        </Link>
                      )}
                      {!notif.read && (
                        <button onClick={() => markAsRead(notif.id)} className="text-[10px] t-muted transition-colors flex items-center gap-1">
                          <Check size={10} /> {isAr ? "تعليم كمقروء" : "Mark Read"}
                        </button>
                      )}
                      <button onClick={() => deleteNotification(notif.id)} className="text-[10px] t-muted transition-colors flex items-center gap-1">
                        <Trash2 size={10} /> {isAr ? "حذف" : "Delete"}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <Bell size={40} className="mx-auto t-muted mb-4" />
          <p className="text-sm t-tertiary">{isAr ? "لا توجد إشعارات" : "No notifications"}</p>
        </div>
      )}
    </div>
  );
}
