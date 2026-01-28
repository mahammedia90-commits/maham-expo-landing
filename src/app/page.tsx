"use client";

import { useState } from "react";
import Image from "next/image";

// Icons Components
const SearchIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const MapIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
  </svg>
);

const ClipboardIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
  </svg>
);

const ShieldIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const ChartIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const BellIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

const UserIcon = () => (
  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const BuildingIcon = () => (
  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const CogIcon = () => (
  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const MenuIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

// FAQ Component
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="faq-item py-3 md:py-4">
      <button
        className="flex justify-between items-center w-full text-right gap-3"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-sm sm:text-base md:text-lg font-semibold text-gray-800">{question}</span>
        <span className={`transform transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}>
          <ChevronDownIcon />
        </span>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 mt-2 md:mt-3' : 'max-h-0'}`}>
        <p className="text-gray-600 leading-relaxed text-xs sm:text-sm md:text-base">{answer}</p>
      </div>
    </div>
  );
}

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const features = [
    {
      icon: <SearchIcon />,
      title: "بحث متقدم",
      description: "ابحث عن المساحات المثالية باستخدام فلاتر متعددة: الموقع، الحجم، السعر، والخدمات المتوفرة"
    },
    {
      icon: <MapIcon />,
      title: "خريطة تفاعلية",
      description: "استعرض الفعاليات والمساحات على خريطة تفاعلية مع إمكانية التنقل بين المستويات المختلفة"
    },
    {
      icon: <ClipboardIcon />,
      title: "نظام طلبات متكامل",
      description: "قدم طلبات الزيارة والإيجار بسهولة مع تتبع حالة كل طلب في الوقت الفعلي"
    },
    {
      icon: <ShieldIcon />,
      title: "معاملات آمنة",
      description: "جميع المعاملات المالية تتم عبر بوابات دفع آمنة مع إشراف إداري كامل"
    },
    {
      icon: <ChartIcon />,
      title: "لوحة تحكم شاملة",
      description: "إحصائيات وتقارير مفصلة لمتابعة أداء مساحاتك وإيراداتك"
    },
    {
      icon: <BellIcon />,
      title: "إشعارات فورية",
      description: "ابقَ على اطلاع بحالة طلباتك والتحديثات المهمة من خلال نظام إشعارات متكامل"
    }
  ];

  const userTypes = [
    {
      icon: <UserIcon />,
      title: "التاجر",
      subtitle: "Dealer",
      color: "bg-orange-500",
      description: "الباحث عن مساحة للإيجار في الفعاليات والمعارض",
      benefits: [
        "تصفح آلاف المساحات المتاحة",
        "بحث متقدم بفلاتر متعددة",
        "طلب زيارة ومعاينة المساحات",
        "إدارة العقود والمدفوعات",
        "تواصل مباشر مع المستثمرين"
      ]
    },
    {
      icon: <BuildingIcon />,
      title: "المستثمر",
      subtitle: "Investor",
      color: "bg-[#1e5f74]",
      description: "مالك المساحات الذي يعرض ويؤجر مساحاته في الفعاليات",
      benefits: [
        "عرض مساحاتك لآلاف التجار",
        "إدارة الطلبات والحجوزات",
        "تتبع الإيرادات والمدفوعات",
        "ترويج المساحات عبر الإعلانات",
        "لوحة تحكم شاملة بالإحصائيات"
      ]
    },
    {
      icon: <CogIcon />,
      title: "المشرف",
      subtitle: "Admin",
      color: "bg-green-600",
      description: "المستوى الأعلى - إدارة كاملة للنظام والإشراف على جميع العمليات",
      benefits: [
        "إدارة الفعاليات والأماكن",
        "مراجعة والموافقة على المساحات",
        "إدارة المستخدمين والصلاحيات",
        "الموافقة النهائية على الطلبات",
        "الإدارة المالية الشاملة"
      ]
    }
  ];

  const dealerSteps = [
    { step: "1", title: "سجّل حسابك", description: "أنشئ حسابك كتاجر وأكمل بيانات نشاطك التجاري" },
    { step: "2", title: "ابحث عن مساحة", description: "استخدم فلاتر البحث والخريطة لإيجاد المساحة المناسبة" },
    { step: "3", title: "اطلب زيارة", description: "قدم طلب زيارة لمعاينة المساحة قبل الحجز" },
    { step: "4", title: "أتمم الإيجار", description: "بعد الموافقة، أكمل عملية الدفع واستلم عقدك" }
  ];

  const investorSteps = [
    { step: "1", title: "سجّل وتحقق", description: "أنشئ حسابك وقدم المستندات للتحقق من هويتك" },
    { step: "2", title: "أضف مساحاتك", description: "أدخل تفاصيل مساحاتك مع الصور والأسعار" },
    { step: "3", title: "استقبل الطلبات", description: "راجع طلبات الزيارة والإيجار من التجار" },
    { step: "4", title: "احصد الأرباح", description: "تابع إيراداتك وأدر مساحاتك بسهولة" }
  ];

  const faqs = [
    {
      question: "ما هو تطبيق مهام إكسبو؟",
      answer: "مهام إكسبو هو تطبيق متكامل لإدارة سوق الفعاليات والمعارض، يربط بين المستثمرين (مالكي المساحات) والتجار (الباحثين عن مساحات للإيجار) تحت إشراف إداري كامل. التطبيق يوفر تجربة سلسة لتصفح وحجز وإدارة المساحات داخل الفعاليات والمعارض."
    },
    {
      question: "كيف يمكنني التسجيل كتاجر؟",
      answer: "يمكنك التسجيل كتاجر من خلال تحميل التطبيق وإنشاء حساب جديد. ستحتاج لتقديم معلومات نشاطك التجاري مثل: اسم النشاط، رقم السجل التجاري، نوع النشاط، معلومات التواصل، والمستندات الثبوتية."
    },
    {
      question: "هل يمكنني معاينة المساحة قبل الإيجار؟",
      answer: "نعم، يوفر التطبيق نظام طلب زيارة يتيح لك معاينة المساحة قبل اتخاذ قرار الإيجار. يتطلب طلب الزيارة موافقة المستثمر ثم المشرف، وقد يتطلب دفع رسوم بسيطة."
    },
    {
      question: "كيف تتم عملية الدفع؟",
      answer: "جميع المدفوعات تتم عبر بوابات دفع آمنة مدمجة في التطبيق. يمكن للتاجر دفع دفعة أولى عند الموافقة على طلب الإيجار، ثم إكمال الدفعات لاحقاً حسب جدول الدفع المتفق عليه."
    },
    {
      question: "ما أنواع المساحات المتاحة للإيجار؟",
      answer: "يتوفر في التطبيق أنواع متعددة من المساحات تشمل: الأكشاك، المطاعم، مساحات العروض، وغيرها. كل مساحة تأتي مع تفاصيل كاملة تشمل: الموقع، الأبعاد، الخدمات المتوفرة (كهرباء، ماء، تكييف)، والسعر."
    },
    {
      question: "هل التطبيق متوفر باللغة الإنجليزية؟",
      answer: "نعم، التطبيق يدعم اللغتين العربية والإنجليزية مع إمكانية التبديل بينهما بسهولة من إعدادات التطبيق."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="fixed top-0 right-0 left-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16 md:h-20">
            {/* Logo */}
            <a href="#" className="flex items-center">
              <Image
                src="/logo.png"
                alt="Maham Expo"
                width={200}
                height={80}
                className="h-10 sm:h-12 md:h-14 lg:h-16 w-auto object-contain"
                priority
                unoptimized
              />
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-600 hover:text-[#1e5f74] transition-colors">الميزات</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-[#1e5f74] transition-colors">كيف يعمل</a>
              <a href="#users" className="text-gray-600 hover:text-[#1e5f74] transition-colors">المستخدمون</a>
              <a href="#faq" className="text-gray-600 hover:text-[#1e5f74] transition-colors">الأسئلة الشائعة</a>
              <a href="#download" className="btn-primary text-white px-6 py-2.5 rounded-full font-medium">
                حمّل التطبيق
              </a>
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <nav className="flex flex-col p-4 gap-4">
              <a href="#features" className="text-gray-600 py-2" onClick={() => setMobileMenuOpen(false)}>الميزات</a>
              <a href="#how-it-works" className="text-gray-600 py-2" onClick={() => setMobileMenuOpen(false)}>كيف يعمل</a>
              <a href="#users" className="text-gray-600 py-2" onClick={() => setMobileMenuOpen(false)}>المستخدمون</a>
              <a href="#faq" className="text-gray-600 py-2" onClick={() => setMobileMenuOpen(false)}>الأسئلة الشائعة</a>
              <a href="#download" className="btn-primary text-white px-6 py-2.5 rounded-full font-medium text-center" onClick={() => setMobileMenuOpen(false)}>
                حمّل التطبيق
              </a>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="gradient-hero min-h-screen pt-14 sm:pt-16 md:pt-20 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-10 md:right-20 w-48 md:w-72 h-48 md:h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-10 md:left-20 w-64 md:w-96 h-64 md:h-96 bg-orange-500 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-16 relative z-10 min-h-[calc(100vh-4rem)] md:min-h-[calc(100vh-5rem)] flex items-center">
          <div className="w-full flex flex-col md:grid md:grid-cols-2 gap-6 md:gap-12 items-center">

            {/* Hero Image - App Screenshot - يظهر أولاً على الموبايل */}
            <div className="flex justify-center order-1 md:order-2">
              <div className="relative">
                <div className="w-36 h-[280px] xs:w-40 xs:h-[320px] sm:w-48 sm:h-[380px] md:w-64 md:h-[520px] lg:w-72 lg:h-[580px] bg-white/10 rounded-[1.5rem] xs:rounded-[1.75rem] sm:rounded-[2rem] md:rounded-[2.5rem] lg:rounded-[3rem] border-2 md:border-4 border-white/20 backdrop-blur-sm p-1 sm:p-1.5 md:p-2 shadow-2xl">
                  <div className="w-full h-full rounded-[1.25rem] xs:rounded-[1.5rem] sm:rounded-[1.75rem] md:rounded-[2rem] lg:rounded-[2.5rem] overflow-hidden">
                    <Image
                      src="/app-screenshot.png"
                      alt="تطبيق مهام إكسبو - شاشة تسجيل الدخول"
                      width={280}
                      height={560}
                      className="w-full h-full object-cover"
                      priority
                    />
                  </div>
                </div>
                {/* Decorative elements */}
                <div className="absolute -top-1.5 -right-1.5 xs:-top-2 xs:-right-2 sm:-top-2.5 sm:-right-2.5 md:-top-3 md:-right-3 lg:-top-4 lg:-right-4 w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 bg-orange-500 rounded-md xs:rounded-lg sm:rounded-xl md:rounded-2xl opacity-80 animate-pulse"></div>
                <div className="absolute -bottom-1.5 -left-1.5 xs:-bottom-2 xs:-left-2 sm:-bottom-2.5 sm:-left-2.5 md:-bottom-3 md:-left-3 lg:-bottom-4 lg:-left-4 w-6 h-6 xs:w-8 xs:h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 bg-white/20 rounded-sm xs:rounded-md sm:rounded-lg md:rounded-xl"></div>
              </div>
            </div>

            {/* Text Content - يظهر ثانياً على الموبايل */}
            <div className="text-white text-center md:text-right order-2 md:order-1">
              <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight mb-3 md:mb-6">
                اكتشف المساحة المثالية
                <span className="text-orange-400"> لنشاطك التجاري</span>
              </h1>
              <p className="text-sm xs:text-base sm:text-lg md:text-xl text-gray-200 mb-4 md:mb-8 leading-relaxed px-2 md:px-0">
                منصة متكاملة تربط بين المستثمرين والتجار في سوق الفعاليات والمعارض.
                ابحث، اعرض، واحجز مساحتك بكل سهولة وأمان.
              </p>
              <div className="flex flex-col xs:flex-row gap-2 xs:gap-3 md:gap-4 justify-center md:justify-start px-4 xs:px-0">
                <a href="#download" className="btn-primary text-white px-4 xs:px-5 sm:px-6 md:px-8 py-2.5 xs:py-3 md:py-4 rounded-full font-semibold text-sm xs:text-base md:text-lg flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 xs:w-5 xs:h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.5 12.5c0-1.58-.79-2.97-2-3.81V5a3 3 0 00-3-3h-1a3 3 0 00-3 3v3.69c-1.21.84-2 2.23-2 3.81v5h12v-5zM10 5a1 1 0 011-1h2a1 1 0 011 1v2.26A4.99 4.99 0 0012.5 7c-.52 0-1.02.08-1.5.22V5zM4 19h16v2H4v-2z"/>
                  </svg>
                  حمّل التطبيق الآن
                </a>
                <a href="#how-it-works" className="btn-secondary text-white px-4 xs:px-5 sm:px-6 md:px-8 py-2.5 xs:py-3 md:py-4 rounded-full font-semibold text-sm xs:text-base md:text-lg text-center">
                  تعرف على المزيد
                </a>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 xs:gap-3 sm:gap-4 md:gap-6 mt-6 md:mt-12 pt-4 md:pt-8 border-t border-white/20 mx-2 md:mx-0">
                <div>
                  <div className="text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-orange-400">+500</div>
                  <div className="text-gray-300 text-[10px] xs:text-xs md:text-sm">فعالية نشطة</div>
                </div>
                <div>
                  <div className="text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-orange-400">+2000</div>
                  <div className="text-gray-300 text-[10px] xs:text-xs md:text-sm">مساحة متاحة</div>
                </div>
                <div>
                  <div className="text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-orange-400">+10K</div>
                  <div className="text-gray-300 text-[10px] xs:text-xs md:text-sm">مستخدم</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Problem & Solution Section */}
      <section className="py-12 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3 md:mb-4">المشكلة والحل</h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-4">
              نحل التحديات التي تواجه سوق إيجار مساحات الفعاليات
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 sm:gap-6 lg:gap-12">
            {/* Problem */}
            <div className="bg-white p-4 sm:p-6 md:p-8 rounded-xl md:rounded-2xl shadow-lg border-r-4 border-red-500">
              <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-red-100 rounded-lg md:rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">المشكلة</h3>
              </div>
              <ul className="space-y-2 sm:space-y-3 md:space-y-4">
                <li className="flex items-start gap-2 sm:gap-3">
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-500 rounded-full mt-2"></span>
                  <span className="text-sm sm:text-base text-gray-600">صعوبة إيجاد المساحات المناسبة في الفعاليات والمعارض</span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-500 rounded-full mt-2"></span>
                  <span className="text-sm sm:text-base text-gray-600">غياب منصة موحدة تجمع بين المستثمرين والتجار</span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-500 rounded-full mt-2"></span>
                  <span className="text-sm sm:text-base text-gray-600">عدم وجود شفافية في الأسعار وشروط الإيجار</span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-500 rounded-full mt-2"></span>
                  <span className="text-sm sm:text-base text-gray-600">إجراءات معقدة وطويلة لإتمام عقود الإيجار</span>
                </li>
              </ul>
            </div>

            {/* Solution */}
            <div className="bg-white p-4 sm:p-6 md:p-8 rounded-xl md:rounded-2xl shadow-lg border-r-4 border-green-500">
              <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-green-100 rounded-lg md:rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">الحل</h3>
              </div>
              <ul className="space-y-2 sm:space-y-3 md:space-y-4">
                <li className="flex items-start gap-2 sm:gap-3">
                  <CheckIcon />
                  <span className="text-sm sm:text-base text-gray-600">منصة موحدة تجمع كل الفعاليات والمساحات في مكان واحد</span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <CheckIcon />
                  <span className="text-sm sm:text-base text-gray-600">خريطة تفاعلية وفلاتر بحث متقدمة لإيجاد المساحة المثالية</span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <CheckIcon />
                  <span className="text-sm sm:text-base text-gray-600">أسعار واضحة وشروط محددة مع إمكانية المقارنة</span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <CheckIcon />
                  <span className="text-sm sm:text-base text-gray-600">نظام طلبات وعقود إلكترونية سريعة وآمنة</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3 md:mb-4">الميزات الرئيسية</h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-4">
              نوفر لك كل الأدوات التي تحتاجها لإدارة مساحاتك في الفعاليات بكفاءة
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-3 sm:p-4 md:p-6 lg:p-8 rounded-xl md:rounded-2xl shadow-lg card-hover border border-gray-100">
                <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-[#1e5f74]/10 rounded-lg md:rounded-xl lg:rounded-2xl flex items-center justify-center text-[#1e5f74] mb-3 md:mb-4 lg:mb-6 [&>svg]:w-5 [&>svg]:h-5 sm:[&>svg]:w-6 sm:[&>svg]:h-6 md:[&>svg]:w-7 md:[&>svg]:h-7 lg:[&>svg]:w-8 lg:[&>svg]:h-8">
                  {feature.icon}
                </div>
                <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-gray-800 mb-1 sm:mb-2 md:mb-3">{feature.title}</h3>
                <p className="text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-12 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3 md:mb-4">كيف يعمل التطبيق؟</h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-4">
              خطوات بسيطة لبدء رحلتك معنا
            </p>
          </div>

          {/* For Dealers */}
          <div className="mb-10 md:mb-16">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-[#1e5f74] text-center mb-6 md:mb-10 flex items-center justify-center gap-2 md:gap-3">
              <span className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-orange-500 rounded-full flex items-center justify-center text-white [&>svg]:w-4 [&>svg]:h-4 sm:[&>svg]:w-5 sm:[&>svg]:h-5 md:[&>svg]:w-6 md:[&>svg]:h-6">
                <UserIcon />
              </span>
              للتجار
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {dealerSteps.map((item, index) => (
                <div key={index} className="relative">
                  <div className="bg-white p-3 sm:p-4 md:p-6 rounded-xl md:rounded-2xl shadow-md text-center h-full">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 gradient-orange rounded-full flex items-center justify-center text-white text-sm sm:text-base md:text-xl font-bold mx-auto mb-2 sm:mb-3 md:mb-4">
                      {item.step}
                    </div>
                    <h4 className="font-bold text-gray-800 mb-1 md:mb-2 text-xs sm:text-sm md:text-base">{item.title}</h4>
                    <p className="text-gray-600 text-[10px] sm:text-xs md:text-sm">{item.description}</p>
                  </div>
                  {index < dealerSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -left-3 transform -translate-y-1/2">
                      <svg className="w-6 h-6 text-orange-300 rotate-180" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* For Investors */}
          <div>
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-[#1e5f74] text-center mb-6 md:mb-10 flex items-center justify-center gap-2 md:gap-3">
              <span className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-[#1e5f74] rounded-full flex items-center justify-center text-white [&>svg]:w-4 [&>svg]:h-4 sm:[&>svg]:w-5 sm:[&>svg]:h-5 md:[&>svg]:w-6 md:[&>svg]:h-6">
                <BuildingIcon />
              </span>
              للمستثمرين
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {investorSteps.map((item, index) => (
                <div key={index} className="relative">
                  <div className="bg-white p-3 sm:p-4 md:p-6 rounded-xl md:rounded-2xl shadow-md text-center h-full">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 gradient-primary rounded-full flex items-center justify-center text-white text-sm sm:text-base md:text-xl font-bold mx-auto mb-2 sm:mb-3 md:mb-4">
                      {item.step}
                    </div>
                    <h4 className="font-bold text-gray-800 mb-1 md:mb-2 text-xs sm:text-sm md:text-base">{item.title}</h4>
                    <p className="text-gray-600 text-[10px] sm:text-xs md:text-sm">{item.description}</p>
                  </div>
                  {index < investorSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -left-3 transform -translate-y-1/2">
                      <svg className="w-6 h-6 text-[#1e5f74]/30 rotate-180" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* User Types Section */}
      <section id="users" className="py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3 md:mb-4">أنواع المستخدمين</h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-4">
              منصة تخدم الجميع في منظومة الفعاليات والمعارض
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            {userTypes.map((user, index) => (
              <div key={index} className="bg-white rounded-xl md:rounded-2xl shadow-lg overflow-hidden card-hover">
                <div className={`${user.color} p-4 md:p-6 text-white text-center`}>
                  <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-4 [&>svg]:w-7 [&>svg]:h-7 sm:[&>svg]:w-8 sm:[&>svg]:h-8 md:[&>svg]:w-10 md:[&>svg]:h-10">
                    {user.icon}
                  </div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold">{user.title}</h3>
                  <p className="text-white/80 text-xs sm:text-sm">{user.subtitle}</p>
                </div>
                <div className="p-3 sm:p-4 md:p-6">
                  <p className="text-gray-600 mb-3 md:mb-6 text-center text-xs sm:text-sm md:text-base">{user.description}</p>
                  <ul className="space-y-2 md:space-y-3">
                    {user.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-center gap-2 md:gap-3">
                        <CheckIcon />
                        <span className="text-gray-700 text-xs sm:text-sm md:text-base">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Download Section */}
      <section id="download" className="py-12 md:py-20 gradient-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 md:mb-6 px-4">
            ابدأ رحلتك مع مهام إكسبو اليوم
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-200 mb-6 md:mb-10 max-w-2xl mx-auto px-4">
            حمّل التطبيق الآن واكتشف الفرص اللامحدودة في سوق الفعاليات والمعارض
          </p>

          <div className="flex flex-col xs:flex-row gap-3 md:gap-4 justify-center mb-8 md:mb-12 px-4">
            {/* App Store Button */}
            <a href="#" className="bg-black text-white px-4 sm:px-6 md:px-8 py-3 md:py-4 rounded-lg md:rounded-xl flex items-center justify-center gap-2 md:gap-3 hover:bg-gray-900 transition-colors">
              <svg className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              <div className="text-right">
                <div className="text-[10px] sm:text-xs opacity-80">حمّل من</div>
                <div className="text-sm sm:text-base md:text-lg font-semibold">App Store</div>
              </div>
            </a>

            {/* Google Play Button */}
            <a href="#" className="bg-black text-white px-4 sm:px-6 md:px-8 py-3 md:py-4 rounded-lg md:rounded-xl flex items-center justify-center gap-2 md:gap-3 hover:bg-gray-900 transition-colors">
              <svg className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
              </svg>
              <div className="text-right">
                <div className="text-[10px] sm:text-xs opacity-80">احصل عليه من</div>
                <div className="text-sm sm:text-base md:text-lg font-semibold">Google Play</div>
              </div>
            </a>
          </div>

          {/* Registration CTA */}
          <div className="glass rounded-xl md:rounded-2xl p-4 sm:p-6 md:p-8 max-w-xl mx-auto">
            <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-2 md:mb-4">هل أنت مستثمر؟</h3>
            <p className="text-gray-200 mb-4 md:mb-6 text-sm md:text-base">
              سجّل الآن واعرض مساحاتك لآلاف التجار الباحثين عن الموقع المثالي
            </p>
            <a href="#" className="inline-block btn-primary text-white px-5 sm:px-6 md:px-8 py-2.5 md:py-3 rounded-full font-semibold text-sm md:text-base">
              سجّل كمستثمر
            </a>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-12 md:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3 md:mb-4">الأسئلة الشائعة</h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-600">
              إجابات على أكثر الأسئلة شيوعاً
            </p>
          </div>

          <div className="bg-white rounded-xl md:rounded-2xl shadow-lg p-4 sm:p-6 md:p-8">
            {faqs.map((faq, index) => (
              <FAQItem key={index} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>
      </section>

      {/* Privacy Policy Section */}
      <section id="privacy" className="py-12 md:py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3 md:mb-4">سياسة الخصوصية</h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-600">
              نحن ملتزمون بحماية خصوصيتك وبياناتك الشخصية
            </p>
          </div>

          <div className="bg-white rounded-xl md:rounded-2xl shadow-lg p-4 sm:p-6 md:p-10 privacy-section space-y-4 sm:space-y-6 md:space-y-8">
            {/* Data Collection */}
            <div>
              <h3 className="text-base sm:text-lg md:text-xl font-bold">البيانات التي نجمعها</h3>
              <p className="text-gray-600 mb-2 md:mb-3 text-xs sm:text-sm md:text-base">نقوم بجمع المعلومات التالية لتقديم خدماتنا:</p>
              <ul className="text-gray-600 text-xs sm:text-sm md:text-base">
                <li>معلومات الحساب: الاسم، البريد الإلكتروني، رقم الهاتف</li>
                <li>معلومات النشاط التجاري: اسم النشاط، السجل التجاري</li>
                <li>معلومات الموقع: لعرض الفعاليات القريبة منك</li>
                <li>معلومات المعاملات: سجل الحجوزات والمدفوعات</li>
                <li>معلومات الجهاز: نوع الجهاز، نظام التشغيل</li>
              </ul>
            </div>

            {/* Data Usage */}
            <div>
              <h3 className="text-xl font-bold">كيف نستخدم بياناتك</h3>
              <p className="text-gray-600 mb-3">نستخدم معلوماتك للأغراض التالية:</p>
              <ul className="text-gray-600">
                <li>توفير وتحسين خدماتنا</li>
                <li>معالجة الحجوزات والمدفوعات</li>
                <li>التواصل معك بشأن حسابك وخدماتنا</li>
                <li>إرسال إشعارات مهمة حول طلباتك</li>
                <li>تحسين تجربة المستخدم وتخصيص المحتوى</li>
              </ul>
            </div>

            {/* Data Sharing */}
            <div>
              <h3 className="text-xl font-bold">مشاركة البيانات</h3>
              <p className="text-gray-600 mb-3">قد نشارك معلوماتك مع:</p>
              <ul className="text-gray-600">
                <li>المستثمرين/التجار عند إتمام عملية الحجز (معلومات التواصل الأساسية فقط)</li>
                <li>مزودي خدمات الدفع لمعالجة المعاملات المالية</li>
                <li>السلطات القانونية عند الطلب وفقاً للقانون</li>
              </ul>
              <p className="text-gray-600 mt-3 font-medium">لا نبيع بياناتك الشخصية لأي طرف ثالث.</p>
            </div>

            {/* User Rights */}
            <div>
              <h3 className="text-xl font-bold">حقوقك</h3>
              <p className="text-gray-600 mb-3">يحق لك:</p>
              <ul className="text-gray-600">
                <li>الوصول إلى بياناتك الشخصية</li>
                <li>تصحيح أو تحديث معلوماتك</li>
                <li>طلب حذف حسابك وبياناتك</li>
                <li>الاعتراض على معالجة بياناتك</li>
                <li>سحب موافقتك في أي وقت</li>
              </ul>
            </div>

            {/* Data Security */}
            <div>
              <h3 className="text-xl font-bold">أمان البيانات</h3>
              <p className="text-gray-600">
                نتخذ إجراءات أمنية صارمة لحماية بياناتك، تشمل التشفير، والخوادم الآمنة،
                والتحقق الثنائي، والمراقبة المستمرة. جميع المعاملات المالية تتم عبر بوابات
                دفع معتمدة ومشفرة.
              </p>
            </div>

            {/* Cookies */}
            <div>
              <h3 className="text-xl font-bold">ملفات تعريف الارتباط (Cookies)</h3>
              <p className="text-gray-600">
                نستخدم ملفات تعريف الارتباط لتحسين تجربتك وتذكر تفضيلاتك. يمكنك إدارة
                إعدادات ملفات تعريف الارتباط من خلال إعدادات متصفحك أو التطبيق.
              </p>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-xl font-bold">تواصل معنا</h3>
              <p className="text-gray-600 mb-4">
                لأي استفسارات حول سياسة الخصوصية أو لممارسة حقوقك، يرجى التواصل معنا:
              </p>
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-gray-700"><strong>البريد الإلكتروني:</strong> privacy@maham.com.sa</p>
                <p className="text-gray-700"><strong>الهاتف:</strong> +966 XX XXX XXXX</p>
                <p className="text-gray-700"><strong>العنوان:</strong> المملكة العربية السعودية</p>
              </div>
            </div>

            <div className="text-center pt-4 border-t">
              <p className="text-gray-500 text-sm">
                آخر تحديث: يناير 2026
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-6 md:mb-8">
            {/* Logo & Description */}
            <div className="col-span-2 md:col-span-2">
              <div className="mb-3 md:mb-4 bg-white p-2 md:p-3 rounded-lg md:rounded-xl inline-block">
                <Image
                  src="/logo.png"
                  alt="Maham Expo"
                  width={200}
                  height={80}
                  className="h-10 md:h-14 w-auto object-contain"
                  unoptimized
                />
              </div>
              <p className="text-gray-400 leading-relaxed max-w-md text-xs sm:text-sm md:text-base">
                منصة متكاملة لإدارة سوق الفعاليات والمعارض، نربط بين المستثمرين والتجار
                لخلق فرص تجارية ناجحة.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold text-sm sm:text-base md:text-lg mb-2 md:mb-4">روابط سريعة</h4>
              <ul className="space-y-1 md:space-y-2">
                <li><a href="#features" className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm md:text-base">الميزات</a></li>
                <li><a href="#how-it-works" className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm md:text-base">كيف يعمل</a></li>
                <li><a href="#users" className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm md:text-base">المستخدمون</a></li>
                <li><a href="#faq" className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm md:text-base">الأسئلة الشائعة</a></li>
                <li><a href="#privacy" className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm md:text-base">سياسة الخصوصية</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-bold text-sm sm:text-base md:text-lg mb-2 md:mb-4">تواصل معنا</h4>
              <ul className="space-y-1 md:space-y-2 text-gray-400 text-xs sm:text-sm md:text-base">
                <li>info@maham.com.sa</li>
                <li>+966 XX XXX XXXX</li>
                <li>المملكة العربية السعودية</li>
              </ul>
              {/* Social Links */}
              <div className="flex gap-2 md:gap-4 mt-3 md:mt-4">
                <a href="#" className="w-8 h-8 md:w-10 md:h-10 bg-white/10 rounded-md md:rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors">
                  <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                </a>
                <a href="#" className="w-8 h-8 md:w-10 md:h-10 bg-white/10 rounded-md md:rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors">
                  <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
                <a href="#" className="w-8 h-8 md:w-10 md:h-10 bg-white/10 rounded-md md:rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors">
                  <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-4 md:pt-8 flex flex-col md:flex-row justify-between items-center gap-2 md:gap-4">
            <p className="text-gray-400 text-xs md:text-sm">
              © 2026 شركة مهام. جميع الحقوق محفوظة.
            </p>
            <p className="text-gray-400 text-xs md:text-sm">
              <a href="https://maham.com.sa" className="hover:text-white transition-colors">maham.com.sa</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
