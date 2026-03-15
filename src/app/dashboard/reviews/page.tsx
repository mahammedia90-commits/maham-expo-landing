'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ThumbsUp, Building2, Calendar, X, MessageSquarePlus } from 'lucide-react';
import { useLanguageStore } from '@/shared/store/useLanguageStore';
import { toast } from 'sonner';

interface Review {
  id: number;
  expo: string;
  rating: number;
  organization: number;
  services: number;
  location: number;
  value: number;
  comment: string;
  date: string;
  helpful: number;
}

export default function ReviewsPage() {
  const { language } = useLanguageStore();
  const isAr = language === 'ar';

  const [showModal, setShowModal] = useState(false);
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState('');

  const [reviews, setReviews] = useState<Review[]>([
    {
      id: 1, expo: isAr ? 'معرض الرياض الدولي للتقنية' : 'Riyadh Tech Expo',
      rating: 5, organization: 5, services: 4, location: 5, value: 4,
      comment: isAr ? 'تجربة رائعة! التنظيم ممتاز والخدمات متكاملة. الموقع استراتيجي وحركة الزوار كانت ممتازة. أنصح بشدة بالمشاركة في النسخة القادمة.' : 'Amazing experience! Excellent organization and complete services. Strategic location and visitor traffic was excellent. Highly recommend participating in the next edition.',
      date: '2026-02-15', helpful: 12,
    },
    {
      id: 2, expo: isAr ? 'معرض الغذاء والضيافة' : 'Food & Hospitality Expo',
      rating: 4, organization: 4, services: 4, location: 3, value: 5,
      comment: isAr ? 'معرض جيد جدا، الموقع مناسب والزوار كثر. الخدمات كانت جيدة والأسعار معقولة. يحتاج تحسين في التنظيم الداخلي.' : 'Very good expo, great location and many visitors. Services were good and prices reasonable. Needs improvement in internal organization.',
      date: '2026-01-20', helpful: 8,
    },
    {
      id: 3, expo: isAr ? 'معرض الدمام الصناعي' : 'Dammam Industrial Expo',
      rating: 5, organization: 5, services: 5, location: 4, value: 5,
      comment: isAr ? 'من أفضل المعارض التي شاركت فيها. الفريق المنظم محترف جدا والخدمات اللوجستية ممتازة. حققنا نتائج تجارية ممتازة.' : 'One of the best expos I have participated in. The organizing team is very professional and logistics services are excellent. We achieved excellent business results.',
      date: '2025-11-10', helpful: 15,
    },
  ]);

  const avgRating = reviews.length > 0 ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1) : '0';

  const submitReview = () => {
    if (newRating === 0) {
      toast.error(isAr ? 'يرجى اختيار التقييم' : 'Please select a rating');
      return;
    }
    setReviews(prev => [{
      id: Date.now(),
      expo: isAr ? 'معرض الرياض الدولي للتقنية' : 'Riyadh Tech Expo',
      rating: newRating, organization: newRating, services: newRating, location: newRating, value: newRating,
      comment: newComment, date: new Date().toISOString().split('T')[0], helpful: 0,
    }, ...prev]);
    setShowModal(false);
    setNewRating(0);
    setNewComment('');
    toast.success(isAr ? 'تم إرسال التقييم بنجاح' : 'Review submitted successfully');
  };

  const subcategories = [
    { key: 'organization' as const, label: isAr ? 'التنظيم' : 'Organization' },
    { key: 'services' as const, label: isAr ? 'الخدمات' : 'Services' },
    { key: 'location' as const, label: isAr ? 'الموقع' : 'Location' },
    { key: 'value' as const, label: isAr ? 'القيمة' : 'Value' },
  ];

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', 'Noto Sans Arabic', serif" }}>
          {isAr ? 'التقييمات' : 'Reviews'}
        </h1>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#C5A55A] to-[#E8D5A3] text-[#0A0A12] hover:opacity-90 font-semibold text-sm flex items-center gap-1"
        >
          <MessageSquarePlus className="w-4 h-4" />
          {isAr ? 'كتابة تقييم' : 'Write Review'}
        </button>
      </div>

      {/* Summary */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-5 rounded-xl bg-card border border-border/50">
        <div className="flex items-center gap-6 flex-wrap">
          <div className="text-center">
            <p className="text-4xl font-bold text-[#C5A55A]">{avgRating}</p>
            <div className="flex items-center gap-0.5 mt-1 justify-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`w-3.5 h-3.5 ${i < Math.round(Number(avgRating)) ? 'text-[#C5A55A] fill-[#C5A55A]' : 'text-muted-foreground'}`} />
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-1">{reviews.length} {isAr ? 'تقييم' : 'reviews'}</p>
          </div>
          <div className="flex-1 space-y-1.5">
            {[5, 4, 3, 2, 1].map(star => {
              const count = reviews.filter(r => r.rating === star).length;
              const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
              return (
                <div key={star} className="flex items-center gap-2 text-xs">
                  <span className="w-3 text-end">{star}</span>
                  <Star className="w-3 h-3 text-[#C5A55A] fill-[#C5A55A]" />
                  <div className="flex-1 h-2 rounded-full bg-accent/50 overflow-hidden">
                    <div className="h-full rounded-full bg-[#C5A55A]" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="w-6 text-muted-foreground">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review, idx) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="p-5 rounded-xl bg-card border border-border/50 hover:border-[#C5A55A]/20 transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#C5A55A]" />
                <h3 className="font-semibold text-sm">{review.expo}</h3>
              </div>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="w-3 h-3" />{review.date}
              </span>
            </div>

            <div className="flex items-center gap-1 mb-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-[#C5A55A] fill-[#C5A55A]' : 'text-muted-foreground'}`} />
              ))}
              <span className="text-sm font-bold ms-1">{review.rating}.0</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
              {subcategories.map(sub => (
                <div key={sub.key} className="p-2 rounded-lg bg-accent/30 text-center">
                  <p className="text-[10px] text-muted-foreground mb-0.5">{sub.label}</p>
                  <p className="text-sm font-bold">{review[sub.key]}/5</p>
                </div>
              ))}
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">{review.comment}</p>

            <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/30">
              <button
                onClick={() => toast.success(isAr ? 'شكرا لتقييمك' : 'Thanks for your feedback')}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                {isAr ? 'مفيد' : 'Helpful'} ({review.helpful})
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Write Review Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-50"
              onClick={() => setShowModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[95vw] max-w-md p-6 rounded-xl bg-card border border-border/50 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">{isAr ? 'كتابة تقييم' : 'Write Review'}</h3>
                <button onClick={() => setShowModal(false)}><X className="w-5 h-5 text-muted-foreground" /></button>
              </div>

              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-2">{isAr ? 'التقييم العام' : 'Overall Rating'}</p>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(s => (
                    <button key={s} onClick={() => setNewRating(s)}>
                      <Star className={`w-8 h-8 transition-colors ${s <= newRating ? 'text-[#C5A55A] fill-[#C5A55A]' : 'text-muted-foreground'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-2">{isAr ? 'تعليقك' : 'Your Comment'}</p>
                <textarea
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                  className="w-full h-24 p-3 rounded-lg bg-accent/50 border border-border/50 text-sm resize-none focus:outline-none focus:border-[#C5A55A]/50"
                  placeholder={isAr ? 'شاركنا تجربتك في المعرض...' : 'Share your expo experience...'}
                />
              </div>

              <button
                onClick={submitReview}
                className="w-full py-2.5 rounded-lg bg-gradient-to-r from-[#C5A55A] to-[#E8D5A3] text-[#0A0A12] hover:opacity-90 font-semibold"
              >
                {isAr ? 'إرسال التقييم' : 'Submit Review'}
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
