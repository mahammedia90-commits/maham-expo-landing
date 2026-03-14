'use client';

/**
 * Reviews — Post-Exhibition Rating & Review System
 */
import { useState } from "react";
import { motion } from "framer-motion";
import { Star, MessageSquare, ThumbsUp, ThumbsDown, Award, TrendingUp, Users, Building2, Zap, Shield, CheckCircle2, Clock, BarChart3, Send, Camera, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { useLanguageStore } from "@/shared/store/useLanguageStore";

function StarRating({ value, onChange, size = 20 }: { value: number; onChange: (v: number) => void; size?: number }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button key={star} onMouseEnter={() => setHover(star)} onMouseLeave={() => setHover(0)} onClick={() => onChange(star)} className="transition-transform hover:scale-110">
          <Star size={size} className={`${(hover || value) >= star ? "text-[#FBBF24] fill-[#FBBF24]" : "t-muted"} transition-colors`} />
        </button>
      ))}
    </div>
  );
}

export default function Reviews() {
  const { language, isRtl } = useLanguageStore();
  const isAr = language === 'ar';
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [comment, setComment] = useState("");
  const [overallRating, setOverallRating] = useState(0);
  const [showROIForm, setShowROIForm] = useState(false);
  const [roiData, setRoiData] = useState({ revenue: "", leads: "", deals: "" });
  const [submitted, setSubmitted] = useState(false);

  const ratingCategories = [
    { key: "organization", label: isAr ? "التنظيم" : "Organization", icon: Building2 },
    { key: "services", label: isAr ? "جودة الخدمات" : "Service Quality", icon: Zap },
    { key: "visitors", label: isAr ? "جودة الزوار" : "Visitor Quality", icon: Users },
    { key: "roi", label: isAr ? "العائد على الاستثمار" : "ROI", icon: TrendingUp },
    { key: "security", label: isAr ? "الأمان" : "Security", icon: Shield },
    { key: "logistics", label: isAr ? "اللوجستيات" : "Logistics", icon: BarChart3 },
  ];

  const handleSubmit = () => {
    if (overallRating === 0) { toast.error(isAr ? "يرجى إضافة تقييم أولاً" : "Please add a rating first"); return; }
    setSubmitted(true);
    toast.success(isAr ? "تم إرسال تقييمك بنجاح" : "Your review has been submitted");
  };

  const avgRating = Object.values(ratings).length > 0 ? (Object.values(ratings).reduce((a, b) => a + b, 0) / Object.values(ratings).length).toFixed(1) : "0.0";

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-gold-gradient" style={{ fontFamily: "'IBM Plex Sans Arabic', serif" }}>{isAr ? "التقييمات والمراجعات" : "Ratings & Reviews"}</h2>
        <p className="text-[12px] sm:text-xs t-gold/50 font-['Inter']">Ratings & Reviews</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
        {[
          { label: isAr ? "تقييمات معلقة" : "Pending Reviews", value: "1", icon: Clock, color: "text-[var(--status-yellow)]" },
          { label: isAr ? "تقييمات مرسلة" : "Submitted Reviews", value: "2", icon: CheckCircle2, color: "text-[var(--status-green)]" },
          { label: isAr ? "متوسط التقييم" : "Avg Rating", value: "4.5", icon: Star, color: "text-[#FBBF24]" },
          { label: isAr ? "شارة الجودة" : "Quality Badge", value: isAr ? "ذهبي" : "Gold", icon: Award, color: "t-gold" },
        ].map((s, i) => (
          <div key={i} className="glass-card rounded-xl p-2.5 sm:p-4">
            <div className="flex items-center gap-2 mb-2">
              <s.icon size={14} className={`${s.color} opacity-60`} />
              <span className="text-[12px] t-tertiary">{s.label}</span>
            </div>
            <p className={`text-lg font-bold font-['Inter'] ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Review Form */}
      {!submitted && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-xl sm:rounded-2xl p-3 sm:p-6 border-[var(--gold-border)]">
          <div className="flex items-center gap-2 mb-5">
            <MessageSquare size={16} className="t-gold" />
            <h3 className="text-sm font-bold t-primary">{isAr ? "تقييم جديد" : "New Review"}</h3>
          </div>

          <div className="glass-card rounded-xl p-4 mb-5">
            <p className="text-sm font-bold t-secondary">{isAr ? "معرض المنتجات العربية — الرياض" : "Arab Products Expo — Riyadh"}</p>
            <div className="flex items-center gap-4 mt-2">
              <span className="text-[12px] t-tertiary">{isAr ? "الوحدة" : "Unit"}: A21</span>
              <span className="text-[12px] t-tertiary font-['Inter']">2026-04-19</span>
            </div>
          </div>

          <div className="mb-6 text-center">
            <p className="text-xs t-secondary mb-2">{isAr ? "التقييم العام" : "Overall Rating"}</p>
            <div className="flex justify-center">
              <StarRating value={overallRating} onChange={setOverallRating} size={32} />
            </div>
            {overallRating > 0 && <p className="text-lg font-bold text-[#FBBF24] font-['Inter'] mt-2">{overallRating}.0 / 5.0</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4 mb-4 sm:mb-6">
            {ratingCategories.map((cat) => (
              <div key={cat.key} className="flex items-center justify-between p-3 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)]">
                <div className="flex items-center gap-2">
                  <cat.icon size={14} className="t-tertiary" />
                  <p className="text-xs t-secondary">{cat.label}</p>
                </div>
                <StarRating value={ratings[cat.key] || 0} onChange={(v) => setRatings(prev => ({ ...prev, [cat.key]: v }))} size={16} />
              </div>
            ))}
          </div>

          {/* ROI */}
          <div className="mb-6">
            <button onClick={() => setShowROIForm(!showROIForm)} className="flex items-center gap-2 text-xs t-gold/70 hover:t-gold transition-colors">
              <TrendingUp size={14} />
              <span>{isAr ? "العائد على الاستثمار (اختياري)" : "ROI (Optional)"}</span>
              <ChevronDown size={14} className={`transition-transform ${showROIForm ? "rotate-180" : ""}`} />
            </button>
            {showROIForm && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
                <div>
                  <label className="text-[11px] t-tertiary block mb-1">{isAr ? "الإيرادات" : "Revenue"} ({isAr ? "ر.س" : "SAR"})</label>
                  <input type="number" value={roiData.revenue} onChange={(e) => setRoiData(prev => ({ ...prev, revenue: e.target.value }))} placeholder="0"
                    className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-lg px-3 py-2 text-xs t-secondary focus:outline-none focus:border-[var(--gold-border)]" />
                </div>
                <div>
                  <label className="text-[11px] t-tertiary block mb-1">{isAr ? "العملاء المحتملين" : "Leads"}</label>
                  <input type="number" value={roiData.leads} onChange={(e) => setRoiData(prev => ({ ...prev, leads: e.target.value }))} placeholder="0"
                    className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-lg px-3 py-2 text-xs t-secondary focus:outline-none focus:border-[var(--gold-border)]" />
                </div>
                <div>
                  <label className="text-[11px] t-tertiary block mb-1">{isAr ? "الصفقات المغلقة" : "Closed Deals"}</label>
                  <input type="number" value={roiData.deals} onChange={(e) => setRoiData(prev => ({ ...prev, deals: e.target.value }))} placeholder="0"
                    className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-lg px-3 py-2 text-xs t-secondary focus:outline-none focus:border-[var(--gold-border)]" />
                </div>
              </motion.div>
            )}
          </div>

          <div className="mb-5">
            <label className="text-xs t-tertiary block mb-2">{isAr ? "تعليقك" : "Your Comment"}</label>
            <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder={isAr ? "شاركنا تجربتك في المعرض..." : "Share your exhibition experience..."} rows={4}
              className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl px-4 py-3 text-xs t-secondary placeholder:t-muted focus:outline-none focus:border-[var(--gold-border)] resize-none" />
          </div>

          <div className="mb-5">
            <button className="flex items-center gap-2 text-xs t-tertiary hover:t-secondary transition-colors">
              <Camera size={14} />
              <span>{isAr ? "إرفاق صور" : "Attach Photos"}</span>
            </button>
          </div>

          <button onClick={handleSubmit} className="w-full btn-gold py-3 rounded-xl text-sm flex items-center justify-center gap-2">
            <Send size={14} />
            {isAr ? "إرسال التقييم" : "Submit Review"}
          </button>
        </motion.div>
      )}

      {/* Success */}
      {submitted && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card rounded-2xl p-8 text-center border-green-400/15">
          <CheckCircle2 size={48} className="mx-auto text-[var(--status-green)] mb-4" />
          <h3 className="text-lg font-bold t-primary mb-2">{isAr ? "شكراً لك!" : "Thank You!"}</h3>
          <p className="text-xs t-tertiary mb-1">{isAr ? "تم إرسال تقييمك بنجاح" : "Your review has been submitted successfully"}</p>
        </motion.div>
      )}

      {/* Past Reviews */}
      <div>
        <h3 className="text-sm font-bold t-secondary mb-4">{isAr ? "التقييمات السابقة" : "Past Reviews"}</h3>
        <div className="space-y-4">
          {[
            { id: "prev-1", expo: isAr ? "معرض الغذاء والضيافة — جدة" : "Food & Hospitality Expo — Jeddah", date: "2024-12-15", rating: 4, comment: isAr ? "تنظيم ممتاز وزوار بجودة عالية. الخدمات كانت جيدة لكن تحتاج تحسين في التكييف." : "Excellent organization and high-quality visitors. Services were good but AC needs improvement.", response: isAr ? "شكراً لتقييمك، سنعمل على تحسين أنظمة التكييف في النسخة القادمة." : "Thank you for your review, we will improve the AC systems in the next edition." },
            { id: "prev-2", expo: isAr ? "معرض التقنية والابتكار — الرياض" : "Tech & Innovation Expo — Riyadh", date: "2024-09-20", rating: 5, comment: isAr ? "أفضل معرض شاركت فيه — عائد استثمار ممتاز وفرص استثمارية حقيقية." : "Best expo I participated in — excellent ROI and real investment opportunities." },
          ].map((review) => (
            <div key={review.id} className="glass-card rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm font-bold t-secondary">{review.expo}</p>
                  <p className="text-[12px] t-tertiary font-['Inter']">{review.date}</p>
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={14} className={s <= review.rating ? "text-[#FBBF24] fill-[#FBBF24]" : "t-muted"} />
                  ))}
                </div>
              </div>
              <p className="text-xs t-secondary leading-relaxed mb-3">{review.comment}</p>
              {review.response && (
                <div className="p-3 rounded-xl bg-gold-subtle border border-[rgba(197,165,90,0.1)]">
                  <div className="flex items-center gap-1.5 mb-1">
                    <MessageSquare size={10} className="t-gold" />
                    <span className="text-[11px] t-gold/70">{isAr ? "رد المنظم" : "Organizer Reply"}</span>
                  </div>
                  <p className="text-[11px] t-tertiary">{review.response}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
