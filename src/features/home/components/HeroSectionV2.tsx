'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
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

// Slideshow data - can be fetched from API later
const slides = [
  {
    id: 1,
    titleKey: 'heroTitle',
    highlightKey: 'heroTitleHighlight',
    descKey: 'heroDescription',
    image: '/app-screenshot.png',
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

      // Easing function for smooth animation
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
      className="text-center"
    >
      <motion.div
        initial={{ scale: 0.5 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: delay + 0.2, ...springPresets.bouncy }}
        className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold text-[#E6B830]"
      >
        {suffix}{count.toLocaleString()}
      </motion.div>
      <div className="text-gray-300 text-xs sm:text-sm md:text-base mt-1">
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
    <div className="flex gap-2 justify-center">
      {Array.from({ length: total }).map((_, index) => (
        <motion.button
          key={index}
          onClick={() => onChange(index)}
          className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
            index === current
              ? 'bg-[#E6B830] w-8'
              : 'bg-white/30 hover:bg-white/50'
          }`}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          aria-label={`Go to slide ${index + 1}`}
        />
      ))}
    </div>
  );
}

export function HeroSectionV2() {
  const { t, isRtl } = useLanguageStore();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const stats = {
    activeEvents: 500,
    availableSpaces: 2000,
    totalUsers: '10K',
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

  return (
    <section
      className="relative min-h-screen overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Premium Gradient Background */}
      <div className="absolute inset-0 gradient-hero" />

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Glowing orbs */}
        <motion.div
          variants={pulse}
          initial="initial"
          animate="animate"
          className="absolute top-20 right-10 md:right-20 w-48 md:w-80 h-48 md:h-80 bg-[#987012]/20 rounded-full blur-[100px]"
        />
        <motion.div
          variants={float}
          initial="initial"
          animate="animate"
          className="absolute bottom-40 left-10 md:left-20 w-64 md:w-96 h-64 md:h-96 bg-[#E6B830]/15 rounded-full blur-[120px]"
        />
        <motion.div
          variants={pulse}
          initial="initial"
          animate="animate"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#3F341C]/30 rounded-full blur-[150px]"
        />

        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen flex flex-col justify-center py-20 md:py-0">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">

          {/* Text Content */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className={`text-white text-center ${isRtl ? 'md:text-right' : 'md:text-left'} order-2 md:order-1`}
          >
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentSlide}
                custom={direction}
                variants={heroTextReveal}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                {/* Badge */}
                <motion.div
                  variants={staggerItem}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6"
                >
                  <motion.span
                    variants={glow}
                    initial="initial"
                    animate="animate"
                    className="w-2 h-2 bg-[#E6B830] rounded-full"
                  />
                  <span className="text-sm text-gray-200">منصة الفعاليات والمعارض الأولى</span>
                </motion.div>

                {/* Title */}
                <motion.h1
                  variants={staggerItem}
                  className="text-3xl xs:text-4xl sm:text-5xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-6"
                >
                  {t.home.heroTitle}
                  <motion.span
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className="text-[#E6B830] block mt-2"
                  >
                    {t.home.heroTitleHighlight}
                  </motion.span>
                </motion.h1>

                {/* Description */}
                <motion.p
                  variants={staggerItem}
                  className="text-base sm:text-lg md:text-xl text-gray-300 mb-8 leading-relaxed max-w-xl mx-auto md:mx-0"
                >
                  {t.home.heroDescription}
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                  variants={staggerItem}
                  className={`flex flex-col sm:flex-row gap-4 justify-center ${isRtl ? 'md:justify-start' : 'md:justify-start'}`}
                >
                  <motion.div
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link
                      href="#download"
                      className="group btn-primary text-white px-8 py-4 rounded-2xl font-semibold text-lg flex items-center justify-center gap-3 shadow-lg shadow-[#987012]/30"
                    >
                      <DownloadIcon className="w-6 h-6 group-hover:animate-bounce" />
                      {t.home.downloadNow}
                    </Link>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link
                      href="/about"
                      className="group btn-secondary px-8 py-4 rounded-2xl font-semibold text-lg flex items-center justify-center gap-2"
                    >
                      {t.home.learnMore}
                      <ArrowRightIcon className={`w-5 h-5 transition-transform group-hover:translate-x-1 ${isRtl ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
                    </Link>
                  </motion.div>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* App Screenshot */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotateY: isRtl ? 15 : -15 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
            className={`flex justify-center order-1 md:order-2 ${isRtl ? 'md:justify-start' : 'md:justify-end'}`}
          >
            <div className="relative perspective-1000">
              {/* Phone Frame */}
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
                  className="absolute inset-0 bg-[#E6B830]/20 rounded-[3rem] blur-3xl scale-110"
                />

                {/* Phone container */}
                <div className="relative w-[200px] h-[400px] xs:w-[220px] xs:h-[440px] sm:w-[260px] sm:h-[520px] md:w-[280px] md:h-[560px] lg:w-[320px] lg:h-[640px]">
                  {/* Phone bezel */}
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 rounded-[2.5rem] sm:rounded-[3rem] p-2 shadow-2xl shadow-black/50">
                    {/* Inner bezel */}
                    <div className="absolute inset-2 bg-gradient-to-br from-gray-700 to-gray-800 rounded-[2rem] sm:rounded-[2.5rem]" />

                    {/* Screen */}
                    <div className="relative h-full w-full rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden bg-black">
                      {/* Notch */}
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-b-2xl z-10" />

                      {/* Screenshot */}
                      <AnimatePresence mode="wait" custom={direction}>
                        <motion.div
                          key={currentSlide}
                          custom={direction}
                          variants={heroSlideVariants}
                          initial="enter"
                          animate="center"
                          exit="exit"
                          className="absolute inset-0"
                        >
                          <Image
                            src={slides[currentSlide].image}
                            alt="Maham Expo App"
                            fill
                            className="object-cover object-top"
                            priority
                            sizes="(max-width: 768px) 260px, 320px"
                          />
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Reflection effect */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent rounded-[2.5rem] sm:rounded-[3rem] pointer-events-none" />
                </div>

                {/* Floating decorative elements */}
                <motion.div
                  variants={pulse}
                  initial="initial"
                  animate="animate"
                  className={`absolute -top-4 ${isRtl ? '-right-4' : '-left-4'} w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[#E6B830] to-[#987012] rounded-2xl shadow-lg shadow-[#987012]/30`}
                />
                <motion.div
                  variants={float}
                  initial="initial"
                  animate="animate"
                  className={`absolute -bottom-4 ${isRtl ? '-left-4' : '-right-4'} w-12 h-12 sm:w-16 sm:h-16 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20`}
                />
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-12 md:mt-20"
        >
          <div className="grid grid-cols-3 gap-4 md:gap-8 py-8 px-6 md:px-12 bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10">
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
              value={parseInt(stats.totalUsers.replace('K', '')) * 1000}
              label={t.home.users}
              suffix="+"
              delay={0.6}
            />
          </div>
        </motion.div>

        {/* Slide Navigation (only show if multiple slides) */}
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
          className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2"
        >
          <span className="text-white/50 text-sm">اكتشف المزيد</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2"
          >
            <motion.div
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-[#E6B830] rounded-full"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
