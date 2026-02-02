'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguageStore } from '@/shared/store/useLanguageStore';
import { DownloadIcon, ArrowRightIcon } from '@/shared/components/Icons';
import {
  heroSlideVariants,
  heroTextReveal,
  staggerContainer,
  staggerItem,
  float,
  pulse,
  glow,
  springPresets,
} from '@/shared/utils/animations';

// Slideshow data
const slides = [
  {
    id: 1,
    image: '/hero-slide-2.png',
    titleAr: 'معارض احترافية',
    titleEn: 'Professional Exhibitions',
    subtitleAr: 'نظم فعالياتك بأسلوب عصري',
    subtitleEn: 'Organize your events in a modern style',
  },
  {
    id: 2,
    image: '/hero-slide-3.png',
    titleAr: 'تجربة مميزة',
    titleEn: 'Unique Experience',
    subtitleAr: 'اكتشف عالم المعارض والفعاليات',
    subtitleEn: 'Discover the world of exhibitions and events',
  },
];

// Counter animation hook
function useCounter(end: number, duration: number = 2000, start: number = 0) {
  const [count, setCount] = useState(start);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (!isInView) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * (end - start) + start));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, start, isInView]);

  return { count, setIsInView };
}

// Stat Counter Component
function StatCounter({
  value,
  label,
  suffix = '+',
  delay = 0
}: {
  value: number;
  label: string;
  suffix?: string;
  delay?: number;
}) {
  const { count, setIsInView } = useCounter(value, 2000);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      onViewportEnter={() => setIsInView(true)}
      className="text-center group"
    >
      <motion.div
        initial={{ scale: 0.5 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: delay + 0.2, ...springPresets.bouncy }}
        className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#E6B830] via-[#F5D677] to-[#E6B830] bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300"
      >
        {count.toLocaleString()}{suffix}
      </motion.div>
      <div className="text-white/80 text-xs sm:text-sm md:text-base mt-2 font-medium">
        {label}
      </div>
    </motion.div>
  );
}

// Slide Navigation Dots
function SlideDots({
  total,
  current,
  onChange
}: {
  total: number;
  current: number;
  onChange: (index: number) => void;
}) {
  return (
    <div className="flex gap-3 justify-center">
      {Array.from({ length: total }).map((_, index) => (
        <motion.button
          key={index}
          onClick={() => onChange(index)}
          className={`relative h-3 rounded-full transition-all duration-500 overflow-hidden ${
            index === current
              ? 'w-12 bg-gradient-to-r from-[#E6B830] to-[#987012]'
              : 'w-3 bg-white/30 hover:bg-white/50'
          }`}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          aria-label={`Go to slide ${index + 1}`}
        >
          {index === current && (
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ duration: 6, ease: 'linear' }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
            />
          )}
        </motion.button>
      ))}
    </div>
  );
}

// Navigation Arrow Button
function NavArrow({
  direction,
  onClick,
  isRtl
}: {
  direction: 'prev' | 'next';
  onClick: () => void;
  isRtl: boolean;
}) {
  const isPrev = direction === 'prev';
  const shouldFlip = isRtl ? !isPrev : isPrev;

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className={`absolute top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 ${
        isPrev ? 'left-2 md:left-6' : 'right-2 md:right-6'
      }`}
      aria-label={isPrev ? 'Previous slide' : 'Next slide'}
    >
      <svg
        className={`w-5 h-5 ${shouldFlip ? 'rotate-180' : ''}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </motion.button>
  );
}

export function HeroSectionV2() {
  const { t, isRtl, language } = useLanguageStore();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const stats = {
    activeEvents: 500,
    availableSpaces: 2000,
    totalUsers: 10000,
  };

  // Auto-advance slideshow
  useEffect(() => {
    if (isPaused || slides.length <= 1) return;

    const interval = setInterval(() => {
      setDirection(1);
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const goToSlide = useCallback((index: number) => {
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
  }, [currentSlide]);

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  const currentSlideData = slides[currentSlide];

  return (
    <section
      className="relative min-h-screen overflow-hidden bg-[#0A0A0A]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Black Background */}
      <div className="absolute inset-0 bg-black" />

      {/* Background Slideshow Image */}
      <div className="absolute inset-0 flex items-start justify-center pt-8 md:pt-12">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentSlide}
            custom={direction}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative w-[80%] md:w-[70%] lg:w-[60%] h-[50%] md:h-[60%]"
          >
            <img
              src={currentSlideData.image}
              alt="Maham Expo"
              className="absolute inset-0 w-full h-full object-contain object-top"
            />
          </motion.div>
        </AnimatePresence>
        {/* Bottom fade to black */}
        <div className="absolute bottom-0 left-0 right-0 h-[50%] bg-gradient-to-t from-black via-black/80 to-transparent" />
      </div>

      {/* Animated Background Elements - Hidden on mobile to prevent overflow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none hidden sm:block">
        <motion.div
          variants={pulse}
          initial="initial"
          animate="animate"
          className="absolute top-20 right-20 w-96 h-96 bg-[#E6B830]/10 rounded-full blur-[120px]"
        />
        <motion.div
          variants={float}
          initial="initial"
          animate="animate"
          className="absolute bottom-40 left-20 w-80 h-80 bg-[#987012]/15 rounded-full blur-[100px]"
        />
      </div>

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <NavArrow direction="prev" onClick={prevSlide} isRtl={isRtl} />
          <NavArrow direction="next" onClick={nextSlide} isRtl={isRtl} />
        </>
      )}

      {/* Phone Mockup - Positioned for Balance */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, x: isRtl ? -50 : 50 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={`hidden md:flex absolute top-[35%] -translate-y-1/2 z-10 ${
          isRtl
            ? 'left-[8%] lg:left-[12%] xl:left-[15%]'
            : 'right-[8%] lg:right-[12%] xl:right-[15%]'
        }`}
      >
        <div className="relative perspective-1000">
          <motion.div
            variants={float}
            initial="initial"
            animate="animate"
            className="relative"
          >
            {/* Glow effect behind phone */}
            <motion.div
              variants={glow}
              initial="initial"
              animate="animate"
              className="absolute inset-0 bg-[#E6B830]/30 rounded-[3rem] blur-3xl scale-110"
            />

            {/* Phone container */}
            <div className="relative w-[220px] h-[440px] lg:w-[260px] lg:h-[520px] xl:w-[280px] xl:h-[560px]">
              {/* Phone bezel */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 rounded-[2.5rem] sm:rounded-[3rem] p-2 shadow-2xl shadow-black/50">
                <div className="absolute inset-2 bg-gradient-to-br from-gray-700 to-gray-800 rounded-[2rem] sm:rounded-[2.5rem]" />
                <div className="relative h-full w-full rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden bg-black">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 bg-black rounded-b-xl z-10" />
                  <img
                    src="/app-screenshot.png"
                    alt="Maham Expo App"
                    className="absolute inset-0 w-full h-full object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent rounded-[2.5rem] sm:rounded-[3rem] pointer-events-none" />
            </div>

            {/* Floating decorative elements */}
            <motion.div
              variants={pulse}
              initial="initial"
              animate="animate"
              className="absolute -top-4 -right-4 w-14 h-14 bg-gradient-to-br from-[#E6B830] to-[#987012] rounded-2xl shadow-lg shadow-[#987012]/40 flex items-center justify-center"
            >
              <span className="text-2xl">🎪</span>
            </motion.div>
            <motion.div
              variants={float}
              initial="initial"
              animate="animate"
              className="absolute -bottom-4 -left-4 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 flex items-center justify-center"
            >
              <span className="text-xl">✨</span>
            </motion.div>
            <motion.div
              animate={{ y: [0, -8, 0], rotate: [0, 5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-1/2 -right-10 w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg shadow-lg flex items-center justify-center"
            >
              <span className="text-lg">📱</span>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen flex flex-col justify-center py-20">
        {/* Mobile Phone Mockup with Slideshow Background */}
        <div className="md:hidden relative mb-8">
          {/* Slideshow Image Behind Phone */}
          <div className="absolute inset-0 flex items-center justify-center">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={`mobile-slide-${currentSlide}`}
                custom={direction}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 0.7, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="absolute w-[600px] h-[600px] xs:w-[700px] xs:h-[700px] -top-24"
              >
                <img
                  src={currentSlideData.image}
                  alt="Maham Expo"
                  className="w-full h-full object-contain"
                />
                {/* Fade overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/95" />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Phone Mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 flex justify-center pt-8"
          >
            <div className="relative w-[180px] h-[360px]">
              <div className="absolute inset-0 bg-[#E6B830]/20 rounded-[2rem] blur-2xl scale-110" />
              <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 rounded-[2rem] p-1.5 shadow-2xl">
                <div className="relative h-full w-full rounded-[1.5rem] overflow-hidden bg-black">
                  <img
                    src="/app-screenshot.png"
                    alt="Maham Expo App"
                    className="absolute inset-0 w-full h-full object-cover object-top"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className={`md:max-w-[60%] lg:max-w-[55%] xl:max-w-[50%] ${
          isRtl
            ? 'md:mr-0 md:ml-auto'
            : 'md:ml-0 md:mr-auto'
        }`}>

          {/* Text Content */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            dir={isRtl ? 'rtl' : 'ltr'}
            className={`text-white text-center ${isRtl ? 'md:text-right' : 'md:text-left'}`}
          >
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentSlide}
                custom={direction}
                variants={heroTextReveal}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="space-y-6"
              >
                {/* Animated Badge */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="inline-flex items-center gap-3 px-5 py-2.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20"
                >
                  <motion.span
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-2.5 h-2.5 bg-[#E6B830] rounded-full shadow-lg shadow-[#E6B830]/50"
                  />
                  <span className="text-sm text-white/90 font-medium">
                    {language === 'ar' ? 'منصة الفعاليات والمعارض الأولى' : 'The #1 Events & Exhibitions Platform'}
                  </span>
                </motion.div>

                {/* Main Title */}
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.7 }}
                  className="text-3xl xs:text-4xl sm:text-5xl md:text-5xl lg:text-6xl font-bold leading-tight"
                >
                  {t.home.heroTitle}
                  <span className="text-[#E6B830] block mt-2">
                    {t.home.heroTitleHighlight}
                  </span>
                </motion.h1>

                {/* Slide Subtitle */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="text-lg sm:text-xl md:text-2xl text-[#E6B830]/90 font-medium"
                >
                  {language === 'ar' ? currentSlideData.subtitleAr : currentSlideData.subtitleEn}
                </motion.p>

                {/* Description */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className={`text-base sm:text-lg text-white/70 max-w-xl leading-relaxed ${!isRtl ? 'mx-auto md:mx-0' : ''}`}
                >
                  {t.home.heroDescription}
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  className={`flex flex-col sm:flex-row gap-4 ${isRtl ? 'md:justify-start' : 'md:justify-start'} justify-center pt-2`}
                >
                  <motion.div
                    whileHover={{ scale: 1.05, y: -3 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link
                      href="#download"
                      className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-[#E6B830] via-[#D4A628] to-[#987012] rounded-2xl font-bold text-lg text-[#1A1A1A] shadow-xl shadow-[#E6B830]/30 overflow-hidden"
                    >
                      <span className="relative z-10 flex items-center gap-3">
                        <DownloadIcon className="w-6 h-6 group-hover:animate-bounce" />
                        {t.home.downloadNow}
                      </span>
                      <motion.div
                        initial={{ x: '-100%' }}
                        whileHover={{ x: '100%' }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                      />
                    </Link>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.05, y: -3 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link
                      href="/about"
                      className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-md border-2 border-white/30 rounded-2xl font-bold text-lg text-white hover:bg-white/20 hover:border-white/50 transition-all duration-300"
                    >
                      {t.home.learnMore}
                      <ArrowRightIcon className={`w-5 h-5 transition-transform group-hover:translate-x-1 ${isRtl ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
                    </Link>
                  </motion.div>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mt-12 md:mt-20"
        >
          <div className="grid grid-cols-3 gap-4 md:gap-8 py-6 md:py-10 px-6 md:px-12 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10">
            <StatCounter
              value={stats.activeEvents}
              label={t.home.activeEvents}
              delay={0.2}
            />
            <StatCounter
              value={stats.availableSpaces}
              label={t.home.availableSpaces}
              delay={0.4}
            />
            <StatCounter
              value={stats.totalUsers}
              label={t.home.users}
              suffix="+"
              delay={0.6}
            />
          </div>
        </motion.div>

        {/* Slide Navigation Dots */}
        {slides.length > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-8"
          >
            <SlideDots
              total={slides.length}
              current={currentSlide}
              onChange={goToSlide}
            />
          </motion.div>
        )}

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-3"
        >
          <span className="text-white/50 text-sm">
            {language === 'ar' ? 'اكتشف المزيد' : 'Discover More'}
          </span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-7 h-12 rounded-full border-2 border-white/30 flex items-start justify-center p-2"
          >
            <motion.div
              animate={{ opacity: [1, 0.3, 1], y: [0, 16, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-2 h-2 bg-[#E6B830] rounded-full shadow-lg shadow-[#E6B830]/50"
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#FFFDF9] to-transparent dark:from-[#1A1A1A]" />
    </section>
  );
}
