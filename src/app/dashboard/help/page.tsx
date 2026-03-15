'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MessageCircle, Phone, Mail, Search, ChevronUp, ChevronDown, FileText
} from 'lucide-react';
import { useLanguageStore } from '@/shared/store/useLanguageStore';
import { toast } from 'sonner';

export default function HelpPage() {
  const { language } = useLanguageStore();
  const isAr = language === 'ar';

  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const contactCards = [
    { icon: MessageCircle, title: isAr ? 'محادثة مباشرة' : 'Live Chat', desc: isAr ? 'تحدث مع فريق الدعم' : 'Chat with support team', color: '#C5A55A' },
    { icon: Phone, title: isAr ? 'اتصل بنا' : 'Call Us', desc: '0535555900', color: '#4ADE80' },
    { icon: Mail, title: isAr ? 'البريد' : 'Email', desc: 'info@mahamexpo.sa', color: '#38BDF8' },
  ];

  const faqs = [
    {
      q: isAr ? 'كيف أحجز جناح في المعرض؟' : 'How to book a booth?',
      a: isAr ? 'يمكنك حجز جناح من خلال تصفح المعارض المتاحة، اختيار المعرض، فتح الخريطة التفاعلية، واختيار الجناح المناسب. بعد إرسال الطلب، سيتم مراجعته من المشرف.' : 'Browse available expos, select one, open the interactive map, and choose your booth. After submitting, it will be reviewed by the supervisor.',
    },
    {
      q: isAr ? 'ما هي طرق الدفع المتاحة؟' : 'What payment methods are available?',
      a: isAr ? 'نقبل بطاقات الائتمان، التحويل البنكي، Apple Pay، ومدى.' : 'We accept credit cards, bank transfers, Apple Pay, and Mada.',
    },
    {
      q: isAr ? 'كيف أوقع العقد إلكترونيا؟' : 'How to sign contracts digitally?',
      a: isAr ? 'بعد الموافقة على حجزك، سيظهر العقد في صفحة العقود. يمكنك مراجعة الشروط والتوقيع بضغطة زر.' : 'After booking approval, the contract appears in Contracts page. Review terms and sign with one click.',
    },
    {
      q: isAr ? 'ما هي خدمات العارضين المتاحة؟' : 'What exhibitor services are available?',
      a: isAr ? 'نوفر أكثر من 36 خدمة تشمل: تصميم البوث، الكهرباء، اللوجستيات، التسويق، الضيافة، التصوير، والمزيد.' : 'We offer 36+ services including booth design, electricity, logistics, marketing, hospitality, photography, and more.',
    },
    {
      q: isAr ? 'كيف أتواصل مع الدعم الفني؟' : 'How to contact support?',
      a: isAr ? 'يمكنك التواصل عبر الرسائل في المنصة، أو الاتصال على 0535555900، أو إرسال بريد إلكتروني إلى info@mahamexpo.sa' : 'Contact us via platform messages, call +966535555900, or email info@mahamexpo.sa',
    },
  ].filter(faq => faq.q.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      <h1 className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', 'Noto Sans Arabic', serif" }}>
        {isAr ? 'مركز المساعدة' : 'Help Center'}
      </h1>

      {/* Contact Cards */}
      <div className="grid lg:grid-cols-3 gap-4 mb-6">
        {contactCards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -2 }}
            className="p-4 rounded-xl bg-card border border-border/50 hover:border-[#C5A55A]/30 transition-all cursor-pointer"
            onClick={() => toast.info(isAr ? 'قريبا' : 'Coming soon')}
          >
            <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: `${card.color}15` }}>
              <card.icon className="w-5 h-5" style={{ color: card.color }} />
            </div>
            <h3 className="font-semibold text-sm">{card.title}</h3>
            <p className="text-xs text-muted-foreground mt-1">{card.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* FAQ Section */}
      <div>
        <h2 className="text-lg font-semibold mb-4">{isAr ? 'الأسئلة الشائعة' : 'FAQ'}</h2>

        <div className="relative mb-4">
          <Search className="absolute top-1/2 -translate-y-1/2 start-3 w-4 h-4 text-muted-foreground" />
          <input
            placeholder={isAr ? 'ابحث في الأسئلة...' : 'Search FAQ...'}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full ps-10 pe-4 py-2.5 rounded-lg bg-card border border-border/50 text-sm focus:outline-none focus:border-[#C5A55A]/50"
          />
        </div>

        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl bg-card border border-border/50 overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full p-4 flex items-center justify-between text-start"
              >
                <span className="font-medium text-sm">{faq.q}</span>
                {openFaq === i
                  ? <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
                  : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                }
              </button>
              {openFaq === i && (
                <div className="px-4 pb-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Create Ticket */}
      <div className="p-6 rounded-xl bg-card border border-[#C5A55A]/20 text-center">
        <FileText className="w-10 h-10 text-[#C5A55A] mx-auto mb-3" />
        <h3 className="font-semibold mb-2">{isAr ? 'إنشاء تذكرة دعم' : 'Create Support Ticket'}</h3>
        <p className="text-sm text-muted-foreground mb-4">
          {isAr ? 'لم تجد إجابة؟ أنشئ تذكرة دعم وسنرد عليك خلال 24 ساعة' : "Didn't find an answer? Create a support ticket and we'll respond within 24 hours"}
        </p>
        <button
          onClick={() => toast.info(isAr ? 'قريبا' : 'Coming soon')}
          className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-[#C5A55A] to-[#E8D5A3] text-[#0A0A12] hover:opacity-90 font-semibold"
        >
          {isAr ? 'إنشاء تذكرة دعم' : 'Create Support Ticket'}
        </button>
      </div>
    </div>
  );
}
