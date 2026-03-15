'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, Sparkles, Loader2, User } from 'lucide-react';
import { useLanguageStore } from '@/shared/store/useLanguageStore';
import { useAuthStore } from '@/shared/store/useAuthStore';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function AIAssistantPage() {
  const { language, isRtl } = useLanguageStore();
  const isAr = language === 'ar';
  const { user } = useAuthStore();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      timestamp: new Date(),
      content: isAr
        ? `مرحبا ${user?.name || 'تاجر'}! \n\nأنا **MAHAM AI** — مساعدك الذكي لإدارة المعارض. يمكنني مساعدتك في:\n\n- اختيار المعرض الأنسب لنشاطك التجاري\n- توصيات الأجنحة بناء على حركة الزوار والموقع\n- مقارنة الأسعار والعروض المتاحة\n- تحليل أدائك في المعارض السابقة\n- خدمات العارضين والباقات المتاحة\n\nكيف يمكنني مساعدتك اليوم؟`
        : `Hello ${user?.name || 'Trader'}!\n\nI'm **MAHAM AI** — your smart expo management assistant. I can help with:\n\n- Choosing the best expo for your business\n- Booth recommendations based on traffic and location\n- Price comparison and available offers\n- Performance analysis from previous expos\n- Exhibitor services and available packages\n\nHow can I help you today?`,
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(scrollToBottom, [messages, scrollToBottom]);

  const suggestions = isAr
    ? ['ما أفضل معرض لنشاطي؟', 'أريد مقارنة أسعار الأجنحة', 'ما الخدمات الأكثر طلبا؟', 'كيف أختار موقع الجناح المثالي؟', 'ما المعارض القادمة في الرياض؟', 'نصائح للمشاركة الأولى في معرض']
    : ['Best expo for my business?', 'Compare booth prices', 'Most popular services?', 'How to choose ideal booth location?', 'Upcoming expos in Riyadh?', 'Tips for first-time exhibitors'];

  const generateResponse = (query: string): string => {
    const q = query.toLowerCase();

    if (q.includes('معرض') || q.includes('expo') || q.includes('أفضل') || q.includes('best')) {
      return isAr
        ? `بناء على نشاطك، أنصحك بشدة بـ:\n\n**معرض الرياض الدولي للتقنية**\nالرياض - مركز المعارض\n2026-04-15\n45 جناح متاح\n8,000 - 45,000 ر.س\n\n**لماذا هذا المعرض؟**\n- يتوقع أكثر من 50,000 زائر\n- موقع استراتيجي في الرياض\n- خصم 15% للحجز المبكر\n\nهل تريد أن أساعدك في اختيار الجناح المناسب؟`
        : `Based on your business, I strongly recommend:\n\n**Riyadh International Tech Expo**\nRiyadh - Exhibition Center\n2026-04-15\n45 booths available\n8,000 - 45,000 SAR\n\n**Why this expo?**\n- Expected 50,000+ visitors\n- Strategic location in Riyadh\n- 15% early bird discount\n\nWould you like help choosing the right booth?`;
    }

    if (q.includes('سعر') || q.includes('price') || q.includes('مقارنة') || q.includes('compare')) {
      return isAr
        ? `**مقارنة أسعار الأجنحة:**\n\n| النوع | المساحة | السعر (ر.س) |\n|-------|---------|-------------|\n| عادي | 9م | 8,000 - 12,000 |\n| مميز | 12م | 12,000 - 18,000 |\n| زاوية | 16م | 18,000 - 25,000 |\n| جزيرة | 24م | 35,000 - 50,000 |\n\n**نصيحتي:** الأجنحة الزاوية تقدم أفضل قيمة مقابل السعر — رؤية من واجهتين بسعر أقل من الجزيرة بـ 40%.`
        : `**Booth Price Comparison:**\n\n| Type | Area | Price (SAR) |\n|------|------|-------------|\n| Standard | 9m | 8,000 - 12,000 |\n| Premium | 12m | 12,000 - 18,000 |\n| Corner | 16m | 18,000 - 25,000 |\n| Island | 24m | 35,000 - 50,000 |\n\n**My tip:** Corner booths offer the best value — two-sided visibility at 40% less than island booths.`;
    }

    if (q.includes('خدم') || q.includes('service') || q.includes('طلب') || q.includes('popular')) {
      return isAr
        ? `**أكثر الخدمات طلبا من العارضين:**\n\n1. **تصميم وتجهيز البوث** — من 5,000 ر.س\n   الأكثر طلبا! تصميم 3D + تنفيذ كامل\n\n2. **كهرباء وإنارة متقدمة** — من 800 ر.س\n\n3. **شاشات عرض رقمية** — من 1,500 ر.س\n\n4. **ضيافة VIP** — من 2,000 ر.س\n\n5. **تصوير احترافي** — من 3,000 ر.س\n\n**باقة الانطلاقة:** وفّر 20% عند طلب 3 خدمات أو أكثر!`
        : `**Most Popular Exhibitor Services:**\n\n1. **Booth Design & Setup** — from 5,000 SAR\n   Most requested! 3D design + full execution\n\n2. **Advanced Electrical & Lighting** — from 800 SAR\n\n3. **Digital Display Screens** — from 1,500 SAR\n\n4. **VIP Hospitality** — from 2,000 SAR\n\n5. **Professional Photography** — from 3,000 SAR\n\n**Starter Bundle:** Save 20% when ordering 3+ services!`;
    }

    if (q.includes('موقع') || q.includes('location') || q.includes('مثالي') || q.includes('ideal')) {
      return isAr
        ? `**نصائح اختيار موقع الجناح المثالي:**\n\n**المواقع الذهبية (الأعلى حركة):**\n- بجانب المدخل الرئيسي — 40% زيارات أكثر\n- على الممر الرئيسي — رؤية مستمرة\n- بالقرب من منطقة المسرح\n\n**المواقع الفضية:**\n- الأجنحة الزاوية — واجهتين بسعر أقل\n- بالقرب من منطقة الطعام\n\n**تجنب:**\n- الأجنحة في نهاية الممرات\n- المواقع بعيدا عن المداخل\n\nاستخدم **الخريطة التفاعلية** لرؤية مؤشر الحركة!`
        : `**Tips for Choosing the Ideal Booth Location:**\n\n**Golden Spots (Highest Traffic):**\n- Next to main entrance — 40% more visits\n- On main aisle — continuous visibility\n- Near stage area\n\n**Silver Spots:**\n- Corner booths — two-sided at lower cost\n- Near food court — natural foot traffic\n\n**Avoid:**\n- End-of-aisle booths\n- Locations far from entrances\n\nUse the **Interactive Map** to see traffic scores!`;
    }

    if (q.includes('نصائح') || q.includes('tips') || q.includes('أول') || q.includes('first')) {
      return isAr
        ? `**نصائح للمشاركة الأولى في معرض:**\n\n1. **احجز مبكرا** — أفضل المواقع تُحجز أولا\n2. **استثمر في تصميم البوث** — الانطباع الأول مهم\n3. **جهّز مواد تسويقية** — بروشورات + بطاقات أعمال\n4. **درّب فريقك** — التواصل الفعال مع الزوار\n5. **استخدم شاشات عرض** — المحتوى المرئي يجذب 3x أكثر\n6. **وفّر ضيافة** — القهوة تطيل وقت التفاعل\n7. **صوّر كل شيء** — للتسويق بعد المعرض\n8. **اجمع بيانات الزوار** — لمتابعة العملاء\n\n**ميزانية مقترحة:** 60% للجناح، 25% للخدمات، 15% للتسويق.`
        : `**Tips for First-Time Exhibitors:**\n\n1. **Book early** — best spots go first\n2. **Invest in booth design** — first impressions matter\n3. **Prepare marketing materials** — brochures + cards\n4. **Train your team** — effective visitor communication\n5. **Use display screens** — visual content attracts 3x more\n6. **Offer hospitality** — extends engagement time\n7. **Document everything** — for post-expo marketing\n8. **Collect visitor data** — for lead follow-up\n\n**Suggested budget:** 60% booth, 25% services, 15% marketing.`;
    }

    return isAr
      ? `شكرا لسؤالك!\n\nيمكنني مساعدتك في:\n- اختيار المعرض المناسب\n- مقارنة أسعار الأجنحة\n- توصيات الموقع المثالي\n- خدمات العارضين\n- تحليل الأداء\n\nجرّب أحد الاقتراحات أدناه أو اسألني بشكل مباشر!`
      : `Thanks for your question!\n\nI can help with:\n- Choosing the right expo\n- Comparing booth prices\n- Ideal location recommendations\n- Exhibitor services\n- Performance analysis\n\nTry one of the suggestions below or ask me directly!`;
  };

  const handleSend = () => {
    if (!input.trim() || isTyping) return;
    const userText = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userText, timestamp: new Date() }]);
    setInput('');
    setIsTyping(true);
    setTimeout(() => {
      const response = generateResponse(userText);
      setMessages(prev => [...prev, { role: 'assistant', content: response, timestamp: new Date() }]);
      setIsTyping(false);
    }, 1200 + Math.random() * 800);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] lg:h-[calc(100vh-48px)] pb-16 lg:pb-0">
      {/* Header */}
      <div className="mb-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C5A55A] to-[#E8D5A3] flex items-center justify-center">
          <Bot className="w-5 h-5 text-[#0A0A12]" />
        </div>
        <div>
          <h1 className="text-xl font-bold" style={{ fontFamily: "'Playfair Display', 'Noto Sans Arabic', serif" }}>
            {isAr ? 'المساعد الذكي' : 'AI Assistant'}
          </h1>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            {isAr ? 'متصل ومستعد للمساعدة' : 'Online and ready to help'}
          </p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-4 rounded-xl bg-card border border-border/50">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center ${msg.role === 'assistant' ? 'bg-gradient-to-br from-[#C5A55A]/20 to-[#E8D5A3]/10' : 'bg-primary/10'}`}>
              {msg.role === 'assistant'
                ? <Bot className="w-4 h-4 text-[#C5A55A]" />
                : <User className="w-4 h-4 text-primary" />
              }
            </div>
            <div className={`max-w-[85%] p-3 rounded-xl text-sm whitespace-pre-line ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-accent/50'}`}>
              {msg.content}
            </div>
          </motion.div>
        ))}

        {isTyping && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#C5A55A]/20 to-[#E8D5A3]/10 flex items-center justify-center">
              <Loader2 className="w-4 h-4 text-[#C5A55A] animate-spin" />
            </div>
            <div className="p-3 rounded-xl bg-accent/50">
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggestion Chips */}
      <div className="flex flex-wrap gap-2 mb-3 max-h-16 overflow-y-auto">
        {suggestions.map((s, i) => (
          <button
            key={i}
            onClick={() => { setInput(s); inputRef.current?.focus(); }}
            className="px-3 py-1.5 rounded-full text-xs bg-accent/50 hover:bg-accent text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 border border-border/30 whitespace-nowrap"
          >
            <Sparkles className="w-3 h-3 text-[#C5A55A]" />
            {s}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder={isAr ? 'اكتب سؤالك هنا...' : 'Type your question here...'}
          className="flex-1 px-4 py-2.5 rounded-lg bg-card border border-border/50 text-sm focus:outline-none focus:border-[#C5A55A]/50"
        />
        <button
          onClick={handleSend}
          disabled={isTyping || !input.trim()}
          className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-[#C5A55A] to-[#E8D5A3] text-[#0A0A12] hover:opacity-90 disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
