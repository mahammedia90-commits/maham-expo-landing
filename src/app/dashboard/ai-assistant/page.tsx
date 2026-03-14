'use client';

/**
 * AIAssistant — Advanced AI-powered assistant for traders
 * Adapted from reference project for Next.js App Router
 */
import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bot, Send, Sparkles, MessageSquare, Lightbulb, HelpCircle,
  FileText, MapPin, TrendingUp, Shield, CreditCard, Building2,
  Calendar, Star, Users, BarChart3, Zap, Brain, Target,
  CheckCircle, AlertTriangle, Clock, ArrowLeft
} from "lucide-react";
import { useAuthStore } from "@/shared/store/useAuthStore";
import { useLanguageStore } from "@/shared/store/useLanguageStore";
import { events2026, eventStats, type ExpoEvent } from "@/features/merchant-dashboard/data/events2026";

// Use empty arrays since we don't have the full auth context
const bookings: any[] = [];
const payments: any[] = [];
const contracts: any[] = [];

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  time: string;
  actions?: { label: string; path: string }[];
  analysis?: { label: string; value: string; color: string }[];
}

export default function AIAssistantPage() {
  const { language, isRtl } = useLanguageStore();
  const isAr = language === 'ar';
  const isRTL = isRtl;
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [aiMode, setAiMode] = useState<"general" | "analysis" | "recommendation">("general");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuthStore();
  const router = useRouter();

  const canBook = false; // Placeholder — no KYC context available

  useEffect(() => {
    const name = user?.name || (isAr ? 'تاجر' : 'Trader');
    const kycStatus = isAr ? 'غير موثق' : 'Not Verified';
    const bookingCount = bookings.length;
    const pendingPayments = 0;

    setMessages([{
      id: 1, role: "assistant",
      content: `${isAr ? 'مرحبًا' : 'Welcome'} ${name}! ${isAr ? 'أنا مساعدك الذكي من ماهم. كيف يمكنني مساعدتك اليوم؟' : 'I am your smart assistant from MAHAM. How can I help you today?'}\n\n${isAr ? '📊 ملخص حسابك' : '📊 Account Summary'}:\n${isAr ? '• حالة التوثيق' : '• Verification Status'}: ${kycStatus}\n${isAr ? '• الحجوزات' : '• Bookings'}: ${bookingCount}\n${isAr ? '• المدفوعات المعلقة' : '• Pending Payments'}: ${pendingPayments}\n${isAr ? '• العقود' : '• Contracts'}: ${contracts.length}\n${isAr ? '• الفعاليات المتاحة' : '• Available Events'}: ${eventStats.openEvents}\n\n${isAr ? 'كيف يمكنني مساعدتك؟' : 'How can I help you?'}`,
      time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }),
    }]);
  }, [user, isAr]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const generateAIResponse = (query: string): Message => {
    const q = query.toLowerCase();
    const now = new Date();
    const time = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });

    // EVENTS
    if (q.includes("فعالي") || q.includes("معرض") || q.includes("event") || q.includes("expo") || q.includes("متاح")) {
      const openEvents = events2026.filter(e => e.status === "open" || e.status === "closing_soon");
      const closingSoon = events2026.filter(e => e.status === "closing_soon");
      const featured = events2026.filter(e => e.featured);
      const eName = (e: ExpoEvent) => isAr ? e.nameAr : e.nameEn;
      const eventList = openEvents.slice(0, 5).map(e => `• ${eName(e)} — ${e.city} | ${e.availableUnits} ${isAr ? 'وحدة متاحة' : 'units available'} | ${e.priceRange} ${isAr ? 'ر.س' : 'SAR'}`).join("\n");

      return {
        id: Date.now() + 1, role: "assistant", time,
        content: `${isAr ? '📊 تحليل الفعاليات' : '📊 Events Analysis'}:\n\n🟢 ${isAr ? 'مفتوحة للحجز' : 'Open for Booking'}: ${openEvents.length}\n🟡 ${isAr ? 'ستُغلق قريبًا' : 'Closing Soon'}: ${closingSoon.length}\n⭐ ${isAr ? 'مميزة' : 'Featured'}: ${featured.length}\n📍 ${isAr ? 'إجمالي الوحدات المتاحة' : 'Total Available Units'}: ${eventStats.availableUnits.toLocaleString()}\n\n${isAr ? 'أفضل الفعاليات' : 'Top Events'}:\n${eventList}\n\n💡 ${isAr ? 'توصية الذكاء الاصطناعي' : 'AI Recommendation'}: ${closingSoon.length > 0 ? `${closingSoon.length} ${isAr ? 'فعاليات ستُغلق قريبًا — بادر بالحجز' : 'events closing soon — book now'}` : isAr ? 'جميع الفعاليات متاحة' : 'All events available'}`,
        actions: [
          { label: isAr ? 'تصفح المعارض' : 'Browse Expos', path: "/dashboard/expos" },
          { label: isAr ? 'عرض الخريطة' : 'View Map', path: "/dashboard/map" },
        ],
      };
    }

    // BOOKINGS
    if (q.includes("حجز") || q.includes("حجوز") || q.includes("booking") || q.includes("status")) {
      if (bookings.length === 0) {
        return {
          id: Date.now() + 1, role: "assistant", time,
          content: `📋 ${isAr ? 'لا توجد حجوزات حاليًا' : 'No bookings yet'}\n\n💡 ${isAr ? 'توصية الذكاء الاصطناعي' : 'AI Recommendation'}: ${isAr ? 'ابدأ بتصفح' : 'Start browsing'} ${eventStats.openEvents} ${isAr ? 'فعالية مفتوحة' : 'open events'}`,
          actions: [{ label: isAr ? 'تصفح المعارض' : 'Browse Expos', path: "/dashboard/expos" }],
        };
      }
      const pending = bookings.filter((b: any) => b.paymentStatus === "unpaid");
      const confirmed = bookings.filter((b: any) => b.status === "confirmed");
      const totalValue = bookings.reduce((a: number, b: any) => a + b.price, 0);

      return {
        id: Date.now() + 1, role: "assistant", time,
        content: `${isAr ? '📊 تحليل الحجوزات' : '📊 Bookings Analysis'}:\n\n📋 ${isAr ? 'الإجمالي' : 'Total'}: ${bookings.length}\n✅ ${isAr ? 'مؤكدة' : 'Confirmed'}: ${confirmed.length}\n⏳ ${isAr ? 'بانتظار الدفع' : 'Pending Payment'}: ${pending.length}\n💰 ${isAr ? 'القيمة الإجمالية' : 'Total Value'}: ${totalValue.toLocaleString()} ${isAr ? 'ر.س' : 'SAR'}\n\n${pending.length > 0 ? `⚠️ ${isAr ? 'تنبيه' : 'Alert'}: ${pending.length} ${isAr ? 'حجوزات تحتاج إلى دفع' : 'bookings need payment'}` : `✅ ${isAr ? 'جميع الحجوزات مؤكدة' : 'All bookings confirmed'}`}`,
        actions: [
          { label: isAr ? 'الحجوزات' : 'Bookings', path: "/dashboard/bookings" },
          ...(pending.length > 0 ? [{ label: isAr ? 'إكمال الدفع' : 'Complete Payment', path: "/dashboard/payments" }] : []),
        ],
        analysis: [
          { label: isAr ? 'الإجمالي' : 'Total', value: String(bookings.length), color: "var(--status-blue)" },
          { label: isAr ? 'مؤكدة' : 'Confirmed', value: String(confirmed.length), color: "var(--status-green)" },
          { label: isAr ? 'معلقة' : 'Pending', value: String(pending.length), color: "var(--status-yellow)" },
          { label: isAr ? 'القيمة الإجمالية' : 'Total Value', value: `${(totalValue / 1000).toFixed(0)}K`, color: "var(--gold-accent)" },
        ],
      };
    }

    // PAYMENTS
    if (q.includes("دفع") || q.includes("مدفوع") || q.includes("سداد") || q.includes("payment") || q.includes("pay")) {
      const totalPaid = payments.filter((p: any) => p.status === "completed").reduce((a: number, p: any) => a + p.amount, 0);
      const pendingBookings = bookings.filter((b: any) => b.paymentStatus !== "fully_paid");
      const totalRemaining = pendingBookings.reduce((a: number, b: any) => a + b.remainingAmount, 0);

      return {
        id: Date.now() + 1, role: "assistant", time,
        content: `💳 ${isAr ? 'تحليل المدفوعات' : 'Payment Analysis'}:\n\n✅ ${isAr ? 'إجمالي المدفوع' : 'Total Paid'}: ${totalPaid.toLocaleString()} ${isAr ? 'ر.س' : 'SAR'}\n⏳ ${isAr ? 'المتبقي' : 'Remaining'}: ${totalRemaining.toLocaleString()} ${isAr ? 'ر.س' : 'SAR'}\n📋 ${isAr ? 'المعاملات' : 'Transactions'}: ${payments.length}\n\n${pendingBookings.length > 0 ? `⚠️ ${pendingBookings.length} ${isAr ? 'حجوزات تحتاج إلى دفع' : 'bookings need payment'}\n\n💡 ${isAr ? 'سيتم إصدار العقد بعد إتمام الدفع' : 'Contract will be issued after payment completion'}` : `✅ ${isAr ? 'جميع المدفوعات مكتملة' : 'All payments complete'}`}`,
        actions: [{ label: isAr ? 'المدفوعات' : 'Payments', path: "/dashboard/payments" }],
      };
    }

    // CONTRACTS
    if (q.includes("عقد") || q.includes("عقود") || q.includes("contract")) {
      if (contracts.length === 0) {
        return {
          id: Date.now() + 1, role: "assistant", time,
          content: `📄 ${isAr ? 'لا توجد عقود حاليًا' : 'No contracts yet'}\n\n💡 ${isAr ? 'خطوات الحصول على عقد' : 'Steps to get a contract'}:\n1. ${isAr ? 'إكمال التوثيق (KYC)' : 'Complete KYC verification'}\n2. ${isAr ? 'حجز جناح في فعالية' : 'Book a booth at an event'}\n3. ${isAr ? 'إتمام الدفع' : 'Complete payment'}\n\n${isAr ? 'سيتم إرسال العقد تلقائيًا' : 'Contract will be sent automatically'}`,
          actions: [{ label: isAr ? 'العقود' : 'Contracts', path: "/dashboard/contracts" }],
        };
      }
      const eName = (c: any) => isAr ? c.expoNameAr : c.expoNameEn;
      return {
        id: Date.now() + 1, role: "assistant", time,
        content: `📄 ${isAr ? 'العقود الصادرة' : 'Contracts Issued'}: ${contracts.length}\n\n${contracts.map((c: any) => `• ${c.id} — ${eName(c)}\n  ${isAr ? 'الجناح' : 'Booth'}: ${c.boothNumber} | ${isAr ? 'القيمة الإجمالية' : 'Total Value'}: ${c.totalValue.toLocaleString()} ${isAr ? 'ر.س' : 'SAR'}\n  ${isAr ? 'الحالة' : 'Status'}: ${c.status === "signed" ? (isAr ? 'موقّع ✅' : 'Signed ✅') : (isAr ? 'بانتظار التوقيع ⏳' : 'Awaiting Signature ⏳')}`).join("\n\n")}`,
        actions: [{ label: isAr ? 'العقود' : 'Contracts', path: "/dashboard/contracts" }],
      };
    }

    // KYC
    if (q.includes("توثيق") || q.includes("kyc") || q.includes("تحقق") || q.includes("verif")) {
      return {
        id: Date.now() + 1, role: "assistant", time,
        content: `⚠️ ${isAr ? 'حسابك غير موثق!' : 'Account Not Verified!'}\n\n${isAr ? 'يجب إكمال التوثيق للحجز' : 'Verification needed to book'}:\n1. ✅ ${isAr ? 'المعلومات الشخصية' : 'Personal Info'}\n2. ✅ ${isAr ? 'معلومات الشركة' : 'Company Info'}\n3. ✅ ${isAr ? 'المعلومات البنكية' : 'Bank Info'}\n4. ✅ ${isAr ? 'المستندات' : 'Documents'}\n5. ✅ ${isAr ? 'الإقرار القانوني' : 'Legal Declaration'}\n\n💡 ${isAr ? 'لا يمكن الحجز بدون إكمال التوثيق' : 'Cannot book without completing KYC'}`,
        actions: [{ label: isAr ? 'التوثيق' : 'KYC', path: "/dashboard/kyc" }],
      };
    }

    // RECOMMENDATIONS
    if (q.includes("نصيح") || q.includes("توصي") || q.includes("أفضل") || q.includes("recommend") || q.includes("best") || q.includes("suggest")) {
      const recommended = events2026.filter(e => e.featured).slice(0, 4);
      const eName = (e: ExpoEvent) => isAr ? e.nameAr : e.nameEn;
      return {
        id: Date.now() + 1, role: "assistant", time,
        content: `🤖 ${isAr ? 'توصيات الذكاء الاصطناعي' : 'AI Recommendations'}:\n\n${recommended.map((e, i) => `${i + 1}. ${eName(e)}\n   📍 ${e.venue} | 📅 ${e.dateStart}\n   👥 ${e.footfall} | ⭐ ${e.rating}\n   💰 ${e.priceRange} ${isAr ? 'ر.س' : 'SAR'} | 🏢 ${e.availableUnits} ${isAr ? 'وحدة متاحة' : 'units available'}`).join("\n\n")}\n\n💡 ${isAr ? 'اختر الأقرب لنشاطك التجاري' : 'Choose the one closest to your business activity'}`,
        actions: [{ label: isAr ? 'تصفح المعارض' : 'Browse Expos', path: "/dashboard/expos" }],
      };
    }

    // SERVICES
    if (q.includes("خدم") || q.includes("service") || q.includes("تصميم") || q.includes("design") || q.includes("كهرباء") || q.includes("electric") || q.includes("لوجست") || q.includes("logist") || q.includes("تسويق") || q.includes("market") || q.includes("ضيافة") || q.includes("cater") || q.includes("تصوير") || q.includes("photo") || q.includes("ترجمة") || q.includes("translat") || q.includes("طباعة") || q.includes("print") || q.includes("تأمين") || q.includes("insur") || q.includes("خدمات")) {
      return {
        id: Date.now() + 1, role: "assistant", time,
        content: `🛠️ ${isAr ? "خدمات التاجر المتاحة" : "Available Exhibitor Services"}:\n\n📐 ${isAr ? "تصميم وبناء البوث" : "Booth Design & Build"} — ${isAr ? "تصميم 3D، بناء مخصص، أثاث، إضاءة" : "3D design, custom build, furniture, lighting"}\n⚡ ${isAr ? "الكهرباء والإنترنت" : "Electricity & Internet"} — ${isAr ? "توصيلات كهرباء، إنترنت فائق السرعة، شاشات" : "Power connections, high-speed internet, screens"}\n🚚 ${isAr ? "اللوجستيات" : "Logistics"} — ${isAr ? "نقل، شحن، تركيب وتفكيك" : "Transport, shipping, setup & dismantling"}\n📢 ${isAr ? "التسويق" : "Marketing"} — ${isAr ? "إعلانات، تسويق رقمي، هدايا ترويجية" : "Ads, digital marketing, promotional gifts"}\n☕ ${isAr ? "الضيافة" : "Hospitality"} — ${isAr ? "قهوة، بوفيه، طاقم ضيافة" : "Coffee, buffet, hospitality staff"}\n📸 ${isAr ? "التصوير" : "Photography"} — ${isAr ? "تصوير فوتو وفيديو، بث مباشر" : "Photo & video, live streaming"}\n🌐 ${isAr ? "الترجمة" : "Translation"} — ${isAr ? "مترجم فوري، مقدم فعاليات" : "Interpreter, event MC"}\n🛡️ ${isAr ? "التأمين" : "Insurance"} — ${isAr ? "تأمين شامل، تراخيص" : "Full insurance, permits"}\n🖨️ ${isAr ? "الطباعة" : "Printing"} — ${isAr ? "بانرات، بروشورات، بطاقات أعمال" : "Banners, brochures, business cards"}\n\n💡 ${isAr ? "يمكنك طلب أي خدمة مباشرة من صفحة الخدمات وإضافتها للسلة" : "You can order any service directly from the services page"}`,
        actions: [
          { label: isAr ? "خدمات التاجر" : "Exhibitor Services", path: "/dashboard/services" },
        ],
      };
    }

    // HELP
    if (q.includes("مساعد") || q.includes("help") || q.includes("دعم") || q.includes("support")) {
      return {
        id: Date.now() + 1, role: "assistant", time,
        content: `🤝 ${isAr ? 'مركز المساعدة' : 'Help Center'}:\n\n${isAr ? 'يمكنني مساعدتك في' : 'I can help with'}:\n\n1. 🏢 ${isAr ? 'الفعاليات والمعارض' : 'Events & Expos'}\n2. 📋 ${isAr ? 'الحجوزات' : 'Bookings'}\n3. 💳 ${isAr ? 'المدفوعات' : 'Payments'}\n4. 📄 ${isAr ? 'العقود' : 'Contracts'}\n5. 🔐 ${isAr ? 'التوثيق' : 'KYC Verification'}\n6. 🤖 ${isAr ? 'التوصيات' : 'Recommendations'}\n7. 📊 ${isAr ? 'التحليلات' : 'Analytics'}\n8. 🔧 ${isAr ? 'الخدمات التشغيلية' : 'Operations'}`,
        actions: [{ label: isAr ? 'المساعدة' : 'Help', path: "/dashboard/help" }],
      };
    }

    // DEFAULT
    return {
      id: Date.now() + 1, role: "assistant", time,
      content: `${isAr ? 'شكرًا لتواصلك!' : 'Thanks for reaching out!'}\n\n${!canBook ? `⚠️ ${isAr ? 'حسابك يحتاج إلى توثيق' : 'Your account needs verification'}\n\n` : ""}📌 ${isAr ? 'معلومات مفيدة' : 'Useful Info'}:\n• ${eventStats.openEvents} ${isAr ? 'فعالية مفتوحة' : 'open events'}\n• ${eventStats.availableUnits.toLocaleString()} ${isAr ? 'وحدة متاحة' : 'units available'}\n• ${bookings.filter((b: any) => b.paymentStatus !== "fully_paid").length} ${isAr ? 'حجوزات تحتاج إلى دفع' : 'bookings need payment'}\n\n${isAr ? 'يمكنك السؤال عن' : 'Ask about'}:\n• ${isAr ? 'الفعاليات والمعارض' : 'Events & Expos'}\n• ${isAr ? 'الحجوزات' : 'Bookings'}\n• ${isAr ? 'التوصيات' : 'Recommendations'}\n• ${isAr ? 'العقود' : 'Contracts'}`,
      actions: [
        { label: isAr ? 'تصفح المعارض' : 'Browse Expos', path: "/dashboard/expos" },
        { label: isAr ? 'الحجوزات' : 'Bookings', path: "/dashboard/bookings" },
      ],
    };
  };

  const handleSend = (text?: string) => {
    const msg = text || input.trim();
    if (!msg) return;
    const userMsg: Message = {
      id: Date.now(), role: "user", content: msg,
      time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);
    setTimeout(() => {
      const response = generateAIResponse(msg);
      setMessages(prev => [...prev, response]);
      setIsTyping(false);
    }, 1200 + Math.random() * 800);
  };

  const suggestions = [
    { text: isAr ? 'ما الفعاليات المتاحة؟' : 'What events are available?', icon: Building2 },
    { text: isAr ? 'حالة حجوزاتي' : 'My bookings status', icon: FileText },
    { text: isAr ? 'أعطني توصيات' : 'Give me recommendations', icon: Target },
    { text: isAr ? 'حالة المدفوعات' : 'Payment status', icon: BarChart3 },
    { text: isAr ? 'حالة التوثيق' : 'KYC status', icon: Shield },
    { text: isAr ? 'تحليلات حسابي' : 'My account analytics', icon: Brain },
  ];

  return (
    <div className="flex flex-col" style={{ height: "calc(100vh - 140px)" }}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C5A55A] to-[#E8D5A3] flex items-center justify-center">
          <Bot size={20} className="text-[var(--btn-gold-text)]" />
        </div>
        <div>
          <h2 className="text-lg font-bold t-primary">{isAr ? 'المساعد الذكي' : 'AI Assistant'}</h2>
          <p className="text-[12px] t-gold/50 font-['Inter']">AI Smart Assistant — Powered by MAHAM AI</p>
        </div>
        <div className={`${isRTL ? "mr-auto" : "ml-auto"} flex items-center gap-1.5`}>
          <div className="w-2 h-2 rounded-full bg-[var(--status-green)] animate-pulse" />
          <span className="text-[12px] text-[var(--status-green)]/70">{isAr ? 'متصل' : 'Online'}</span>
        </div>
      </div>

      {/* AI Mode Tabs */}
      <div className="flex gap-2 mb-3 overflow-x-auto no-scrollbar">
        {[
          { id: "general" as const, label: isAr ? 'عام' : 'General', icon: MessageSquare },
          { id: "analysis" as const, label: isAr ? 'تحليل' : 'Analysis', icon: BarChart3 },
          { id: "recommendation" as const, label: isAr ? 'توصيات' : 'Recommendations', icon: Target },
        ].map(mode => (
          <button key={mode.id} onClick={() => setAiMode(mode.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] transition-all whitespace-nowrap ${aiMode === mode.id ? "btn-gold" : "glass-card t-tertiary"}`}>
            <mode.icon size={12} />
            {mode.label}
          </button>
        ))}
      </div>

      {/* Chat Area */}
      <div className="flex-1 glass-card rounded-2xl p-4 overflow-y-auto mb-4 space-y-4">
        <AnimatePresence>
          {messages.map((m) => (
            <motion.div key={m.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className={`flex ${m.role === "user" ? (isRTL ? "justify-start" : "justify-end") : (isRTL ? "justify-end" : "justify-start")}`}>
              <div className={`max-w-[85%] rounded-2xl p-4 ${
                m.role === "user"
                  ? "bg-gold-subtle border border-[#C5A55A]/15"
                  : "bg-[var(--glass-bg)] border border-[var(--glass-border)]"
              }`}>
                {m.role === "assistant" && (
                  <div className="flex items-center gap-1.5 mb-2">
                    <Sparkles size={12} className="t-gold" />
                    <span className="text-[12px] t-gold/70 font-['Inter']">MAHAM AI</span>
                  </div>
                )}
                <p className="text-sm t-primary whitespace-pre-line leading-relaxed">{m.content}</p>

                {m.analysis && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3">
                    {m.analysis.map((a, i) => (
                      <div key={i} className="p-2 rounded-lg text-center" style={{ backgroundColor: "var(--glass-bg)", border: "1px solid var(--glass-border)" }}>
                        <p className="text-sm font-bold font-['Inter']" style={{ color: a.color }}>{a.value}</p>
                        <p className="text-[11px] t-muted">{a.label}</p>
                      </div>
                    ))}
                  </div>
                )}

                {m.actions && (
                  <div className="flex gap-2 mt-3 flex-wrap">
                    {m.actions.map((a, i) => (
                      <button key={i} onClick={() => router.push(a.path)}
                        className="px-3 py-1.5 rounded-lg text-[12px] bg-gold-subtle t-gold border border-[#C5A55A]/20 hover:bg-[#C5A55A]/20 transition-colors flex items-center gap-1">
                        {isRTL ? <ArrowLeft size={10} /> : null}
                        {a.label}
                      </button>
                    ))}
                  </div>
                )}
                <p className="text-[11px] t-muted font-['Inter'] mt-2">{m.time}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`flex ${isRTL ? "justify-end" : "justify-start"}`}>
            <div className="bg-[var(--glass-bg)] rounded-2xl px-4 py-3 border border-[var(--glass-border)]">
              <div className="flex items-center gap-1.5">
                <Brain size={12} className="t-gold animate-pulse" />
                <span className="text-xs t-tertiary">{isAr ? 'جاري التحليل...' : 'Analyzing...'}</span>
                <div className="flex gap-1">
                  {[0, 1, 2].map(i => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#C5A55A]/40 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Suggestions */}
      {messages.length <= 1 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
          {suggestions.map((s, i) => (
            <button key={i} onClick={() => handleSend(s.text)}
              className="glass-card rounded-xl p-3 hover:bg-[var(--glass-bg)] hover:border-[var(--gold-border)] transition-all text-start">
              <s.icon size={14} className="t-gold mb-1.5" />
              <p className="text-[11px] t-secondary">{s.text}</p>
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="glass-card rounded-2xl p-3 flex items-center gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder={isAr ? 'اكتب سؤالك هنا...' : 'Type your question here...'}
          className="flex-1 bg-transparent text-sm t-primary placeholder:t-muted outline-none"
          dir={isRTL ? "rtl" : "ltr"}
        />
        <button onClick={() => handleSend()} disabled={!input.trim()}
          className="w-10 h-10 rounded-xl btn-gold flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed">
          <Send size={16} className={isRTL ? "rotate-180" : ""} />
        </button>
      </div>
    </div>
  );
}
