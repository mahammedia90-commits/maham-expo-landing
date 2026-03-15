'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowRight, ArrowLeft, MapPin } from 'lucide-react';
import { useLanguageStore } from '@/shared/store/useLanguageStore';
import { events2026 } from '@/features/merchant-dashboard/data/events2026';
import ExpoDetailClient from '../ExpoDetailClient';

export default function ExpoMapClient() {
  const params = useParams();
  const id = params?.id as string;
  const { language, isRtl } = useLanguageStore();
  const isAr = language === 'ar';

  const event = events2026.find((e) => e.id === id);
  const BackArrow = isRtl ? ArrowRight : ArrowLeft;

  return (
    <div className="space-y-5 pb-20 lg:pb-6">
      {/* Back button */}
      <Link
        href={`/dashboard/expos/${id}`}
        className="inline-flex items-center gap-2 text-sm t-muted hover:t-gold transition-colors"
      >
        <BackArrow className="w-4 h-4" />
        {isAr ? 'العودة لتفاصيل المعرض' : 'Back to Expo Details'}
      </Link>

      {/* Title */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gold-subtle flex items-center justify-center">
          <MapPin className="w-5 h-5 t-gold" />
        </div>
        <div>
          <h1
            className="text-xl font-bold t-primary"
            style={{ fontFamily: "'Playfair Display', 'Noto Sans Arabic', serif" }}
          >
            {isAr ? 'خريطة الأجنحة والحجز' : 'Booth Map & Booking'}
          </h1>
          {event && (
            <p className="text-sm t-tertiary">
              {isAr ? event.nameAr : event.nameEn}
            </p>
          )}
        </div>
      </div>

      {/* Booth Map Component */}
      <ExpoDetailClient />
    </div>
  );
}
