'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle, Bell } from 'lucide-react';
import { useLanguageStore } from '@/shared/store/useLanguageStore';

export default function WaitlistPage() {
  const { language, isRtl } = useLanguageStore();
  const isAr = language === 'ar';

  const [joined, setJoined] = useState(false);
  const [position] = useState(Math.floor(Math.random() * 50) + 5);

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      <h1 className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', 'Noto Sans Arabic', serif" }}>
        {isAr ? 'قائمة الانتظار' : 'Waitlist'}
      </h1>

      <div className="max-w-lg mx-auto text-center py-12">
        <div className="w-20 h-20 rounded-2xl bg-[#C5A55A]/10 flex items-center justify-center mx-auto mb-6">
          <Clock className="w-10 h-10 text-[#C5A55A]" />
        </div>

        <h2 className="text-xl font-bold t-primary mb-2">
          {isAr ? 'قائمة الانتظار للأجنحة المميزة' : 'Premium Booth Waitlist'}
        </h2>

        <p className="text-muted-foreground text-sm mb-8">
          {isAr
            ? 'انضم لقائمة الانتظار وسنبلغك فور توفر جناح مميز'
            : 'Join the waitlist and we will notify you when a premium booth becomes available'}
        </p>

        {joined ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="p-6 rounded-xl bg-card border border-green-500/20"
          >
            <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
            <p className="font-semibold text-green-400 mb-2">
              {isAr ? 'تم التسجيل بنجاح!' : 'Successfully Registered!'}
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              {isAr ? 'ترتيبك في القائمة' : 'Your position'}: <span className="text-[#C5A55A] font-bold text-lg">#{position}</span>
            </p>
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Bell className="w-3.5 h-3.5" />
              {isAr ? 'سيتم إشعارك عند توفر جناح' : 'You will be notified when available'}
            </div>
          </motion.div>
        ) : (
          <button
            onClick={() => setJoined(true)}
            className="bg-gradient-to-r from-[#C5A55A] to-[#E8D5A3] text-[#0A0A12] hover:opacity-90 font-semibold px-8 py-4 text-base rounded-lg"
          >
            {isAr ? 'انضم لقائمة الانتظار' : 'Join Waitlist'}
          </button>
        )}
      </div>
    </div>
  );
}
