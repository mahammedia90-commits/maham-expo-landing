'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Bell, CalendarCheck, CreditCard, FileText, CheckCircle, Trash2
} from 'lucide-react';
import { useLanguageStore } from '@/shared/store/useLanguageStore';

type NotifType = 'booking' | 'payment' | 'contract' | 'system';

interface Notification {
  id: string;
  type: NotifType;
  titleAr: string;
  titleEn: string;
  messageAr: string;
  messageEn: string;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}

export default function Notifications() {
  const { language, isRtl } = useLanguageStore();
  const isAr = language === 'ar';

  // Mock empty data
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const getTypeIcon = (type: NotifType) => {
    switch (type) {
      case 'booking':
        return <CalendarCheck className="w-4 h-4 text-yellow-400" />;
      case 'payment':
        return <CreditCard className="w-4 h-4 text-green-400" />;
      case 'contract':
        return <FileText className="w-4 h-4 text-purple-400" />;
      default:
        return <Bell className="w-4 h-4 text-blue-400" />;
    }
  };

  const getTypeBg = (type: NotifType) => {
    switch (type) {
      case 'booking': return 'bg-yellow-500/10';
      case 'payment': return 'bg-green-500/10';
      case 'contract': return 'bg-purple-500/10';
      default: return 'bg-blue-500/10';
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', 'Noto Sans Arabic', serif" }}>
          {isAr ? 'الإشعارات' : 'Notifications'}
        </h1>
        <div className="flex gap-2">
          <button
            onClick={markAllRead}
            className="px-3 py-1.5 rounded-lg text-xs border border-border/50 t-secondary flex items-center gap-1 hover:border-[#C5A55A]/30 transition-colors"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            {isAr ? 'تعليم الكل كمقروء' : 'Mark All Read'}
          </button>
          <button
            onClick={clearAll}
            className="px-3 py-1.5 rounded-lg text-xs border border-border/50 text-red-400 flex items-center gap-1 hover:border-red-400/30 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            {isAr ? 'مسح الكل' : 'Clear All'}
          </button>
        </div>
      </div>

      {/* Empty State */}
      {notifications.length === 0 ? (
        <div className="p-12 rounded-xl bg-card border border-border/50 text-center">
          <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground font-medium">
            {isAr ? 'لا توجد إشعارات' : 'No notifications'}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((notif, i) => (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <Link href={notif.actionUrl || '#'}>
                <div
                  onClick={() => markAsRead(notif.id)}
                  className={`p-4 rounded-xl bg-card border cursor-pointer hover:border-[#C5A55A]/20 transition-all ${
                    notif.read ? 'border-border/50' : 'border-[#C5A55A]/20'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-9 h-9 rounded-lg shrink-0 flex items-center justify-center ${getTypeBg(notif.type)}`}>
                      {getTypeIcon(notif.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium t-primary">
                          {isAr ? notif.titleAr : notif.titleEn}
                        </p>
                        {!notif.read && (
                          <div className="w-2 h-2 rounded-full bg-[#C5A55A] shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {isAr ? notif.messageAr : notif.messageEn}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-2">
                        {new Date(notif.createdAt).toLocaleString(isAr ? 'ar-SA' : 'en-US')}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
