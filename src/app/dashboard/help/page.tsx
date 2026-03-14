'use client';

/**
 * HelpCenter — Support & FAQ
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, Search, ChevronDown, MessageSquare, Phone, Mail, FileText, Book, Video, Shield, CreditCard, Calendar, Map, Send, CheckCircle2, Clock, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { useLanguageStore } from "@/shared/store/useLanguageStore";

export default function HelpCenter() {
  const { language, isRtl } = useLanguageStore();
  const isAr = language === 'ar';
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketMessage, setTicketMessage] = useState("");
  const [ticketSubmitted, setTicketSubmitted] = useState(false);

  const categories = [
    { id: "all", label: isAr ? "الكل" : "All" },
    { id: "booking", label: isAr ? "الحجوزات" : "Bookings" },
    { id: "payment", label: isAr ? "المدفوعات" : "Payments" },
    { id: "security", label: isAr ? "الأمان" : "Security" },
    { id: "contracts", label: isAr ? "العقود" : "Contracts" },
    { id: "kyc", label: isAr ? "التحقق" : "KYC" },
  ];

  const faqs = [
    { id: "f1", category: "booking", question: isAr ? "كيف أحجز وحدة في المعرض؟" : "How do I book a booth at an expo?", answer: isAr ? "يمكنك تصفح المعارض المتاحة واختيار الوحدة المناسبة، ثم الضغط على 'احجز الآن' وإتمام عملية الدفع." : "Browse available expos, select a suitable booth, click 'Book Now' and complete payment." },
    { id: "f2", category: "payment", question: isAr ? "ما هي طرق الدفع المتاحة؟" : "What payment methods are available?", answer: isAr ? "نقبل الدفع عبر بطاقات الائتمان (فيزا/ماستركارد)، التحويل البنكي، و Apple Pay. يمكنك أيضاً الدفع على أقساط." : "We accept credit cards (Visa/Mastercard), bank transfer, and Apple Pay. Installment plans are also available." },
    { id: "f3", category: "security", question: isAr ? "هل معلوماتي الشخصية آمنة؟" : "Is my personal information secure?", answer: isAr ? "نعم، نستخدم تشفير SSL 256-bit وجميع البيانات مخزنة في خوادم آمنة. نلتزم بمعايير PCI DSS للمدفوعات." : "Yes, we use 256-bit SSL encryption and all data is stored on secure servers. We comply with PCI DSS standards." },
    { id: "f4", category: "contracts", question: isAr ? "متى أوقع العقد؟" : "When do I sign the contract?", answer: isAr ? "بعد تأكيد الحجز ودفع العربون، سيتم إنشاء العقد الإلكتروني تلقائياً ويمكنك توقيعه رقمياً من حسابك." : "After booking confirmation and deposit payment, a digital contract is generated and can be signed electronically from your account." },
    { id: "f5", category: "booking", question: isAr ? "هل يمكنني تغيير الوحدة بعد الحجز؟" : "Can I change my booth after booking?", answer: isAr ? "نعم، يمكنك طلب تغيير الوحدة خلال 48 ساعة من الحجز، حسب التوفر. قد تطبق رسوم إضافية." : "Yes, you can request a booth change within 48 hours of booking, subject to availability. Additional fees may apply." },
    { id: "f6", category: "kyc", question: isAr ? "ما المستندات المطلوبة للتحقق؟" : "What documents are needed for KYC?", answer: isAr ? "تحتاج إلى: السجل التجاري، الهوية الوطنية/الإقامة، شهادة الزكاة والدخل، وعنوان النشاط التجاري." : "You need: Commercial Registration, National ID/Iqama, ZATCA Certificate, and business address." },
  ];

  const filteredFaqs = faqs.filter(f => {
    const matchSearch = searchQuery === "" || f.question.includes(searchQuery) || f.answer.includes(searchQuery);
    const matchCategory = activeCategory === "all" || f.category === activeCategory;
    return matchSearch && matchCategory;
  });

  const handleSubmitTicket = () => {
    if (!ticketSubject.trim() || !ticketMessage.trim()) {
      toast.error(isAr ? "يرجى ملء جميع الحقول" : "Please fill all fields");
      return;
    }
    setTicketSubmitted(true);
    toast.success(isAr ? "تم إرسال التذكرة بنجاح" : "Ticket submitted successfully");
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-gold-gradient" style={{ fontFamily: "'IBM Plex Sans Arabic', serif" }}>{isAr ? "مركز المساعدة" : "Help Center"}</h2>
        <p className="text-[12px] t-gold/50 font-['Inter']">Help Center & Support</p>
      </div>

      {/* Contact Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        {[
          { icon: Phone, label: isAr ? "الهاتف" : "Phone", value: "+966 53 555 5900" },
          { icon: Mail, label: isAr ? "البريد" : "Email", value: "info@mahamexpo.sa" },
          { icon: MessageSquare, label: isAr ? "الدردشة" : "Live Chat", value: isAr ? "متاح 24/7" : "Available 24/7" },
          { icon: Clock, label: isAr ? "ساعات العمل" : "Work Hours", value: isAr ? "أحد-خميس 9ص-6م" : "Sun-Thu 9AM-6PM" },
        ].map((c, i) => (
          <div key={i} className="glass-card rounded-xl p-3 text-center">
            <c.icon size={16} className="t-gold mx-auto mb-2" />
            <p className="text-[11px] t-secondary font-medium">{c.label}</p>
            <p className="text-[11px] t-muted mt-0.5">{c.value}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className={`absolute ${isRtl ? "right-4" : "left-4"} top-1/2 -translate-y-1/2 t-muted`} />
        <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={isAr ? "ابحث في الأسئلة الشائعة..." : "Search FAQs..."}
          className={`w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl ${isRtl ? "pr-11 pl-4" : "pl-11 pr-4"} py-3 text-sm t-secondary placeholder:t-muted focus:outline-none focus:border-[var(--gold-border)]`} />
      </div>

      {/* Category Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => (
          <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
            className={`px-3 py-1.5 rounded-lg text-[11px] whitespace-nowrap transition-all ${activeCategory === cat.id ? "bg-gold-subtle border border-[var(--gold-border)] t-gold-light" : "glass-card t-tertiary hover:t-secondary"}`}>
            {cat.label}
          </button>
        ))}
      </div>

      {/* FAQ List */}
      <div className="space-y-3">
        {filteredFaqs.map((faq) => (
          <div key={faq.id} className="glass-card rounded-xl overflow-hidden">
            <button onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
              className="w-full flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <HelpCircle size={16} className="t-gold/50 shrink-0" />
                <p className="text-xs t-secondary text-start">{faq.question}</p>
              </div>
              <ChevronDown size={14} className={`t-tertiary transition-transform shrink-0 ${expandedFaq === faq.id ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {expandedFaq === faq.id && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                  <div className={`px-4 pb-4 ${isRtl ? "pr-12" : "pl-12"}`}>
                    <p className="text-xs t-tertiary leading-relaxed">{faq.answer}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Submit Ticket */}
      <div className="glass-card rounded-xl sm:rounded-2xl p-3 sm:p-6">
        <div className="flex items-center gap-2 mb-5">
          <Send size={16} className="t-gold" />
          <h3 className="text-sm font-bold t-primary">{isAr ? "إرسال تذكرة دعم" : "Submit Support Ticket"}</h3>
        </div>
        {!ticketSubmitted ? (
          <div className="space-y-4">
            <div>
              <label className="text-[12px] t-tertiary mb-1.5 block">{isAr ? "الموضوع" : "Subject"}</label>
              <input type="text" value={ticketSubject} onChange={(e) => setTicketSubject(e.target.value)}
                placeholder={isAr ? "موضوع التذكرة" : "Ticket subject"}
                className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl px-4 py-2.5 text-xs t-secondary placeholder:t-muted focus:outline-none focus:border-[var(--gold-border)]" />
            </div>
            <div>
              <label className="text-[12px] t-tertiary mb-1.5 block">{isAr ? "الرسالة" : "Message"}</label>
              <textarea value={ticketMessage} onChange={(e) => setTicketMessage(e.target.value)}
                placeholder={isAr ? "اكتب رسالتك هنا..." : "Type your message here..."} rows={4}
                className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl px-4 py-3 text-xs t-secondary placeholder:t-muted focus:outline-none focus:border-[var(--gold-border)] resize-none" />
            </div>
            <button onClick={handleSubmitTicket} className="btn-gold px-6 py-2.5 rounded-xl text-xs flex items-center gap-2">
              <Send size={14} />
              {isAr ? "إرسال" : "Send"}
            </button>
          </div>
        ) : (
          <div className="text-center py-6">
            <CheckCircle2 size={40} className="mx-auto text-[var(--status-green)] mb-3" />
            <p className="text-sm t-secondary">{isAr ? "تم إرسال التذكرة بنجاح" : "Ticket submitted successfully"}</p>
            <p className="text-xs t-tertiary">{isAr ? "رقم التذكرة" : "Ticket Number"}: #TK-2026-0847</p>
            <p className="text-[12px] t-muted font-['Inter'] mt-1">{isAr ? "سيتم الرد خلال 24 ساعة" : "Response within 24 hours"}</p>
          </div>
        )}
      </div>
    </div>
  );
}
