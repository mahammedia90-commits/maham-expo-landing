'use client';

/**
 * DashboardLayout — Sidebar + main content area (Next.js adapted)
 */
import { useState, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useThemeStore } from "@/shared/store/useThemeStore";
import { useLanguageStore } from "@/shared/store/useLanguageStore";
import { useAuthStore } from "@/shared/store/useAuthStore";
import {
  LayoutDashboard, Map, CalendarCheck, FileText, CreditCard,
  BarChart3, Bot, User, ChevronLeft, ChevronRight,
  Menu, X, Building2, MessageSquare, Star, Bell,
  Shield, HelpCircle, Sun, Moon, LogOut, ArrowRight,
  Users, Package
} from "lucide-react";

const LOGO_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663193442903/JD8QXNuzByYQGCbDe4iMyc/mahamexpologo_4057b50b.webp";

interface NavItem {
  path: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string; style?: React.CSSProperties }>;
  labelAr: string;
  labelEn: string;
}

function useNavSections() {
  return [
    {
      titleAr: "لوحة التحكم", titleEn: "Dashboard",
      items: [
        { path: "/dashboard", icon: LayoutDashboard, labelAr: "لوحة التحكم", labelEn: "Dashboard" },
        { path: "/dashboard/expos", icon: Building2, labelAr: "المعارض", labelEn: "Exhibitions" },
        { path: "/dashboard/map", icon: Map, labelAr: "الخريطة", labelEn: "Map" },
      ],
    },
    {
      titleAr: "الحجوزات", titleEn: "Bookings",
      items: [
        { path: "/dashboard/bookings", icon: CalendarCheck, labelAr: "الحجوزات", labelEn: "Bookings" },
        { path: "/dashboard/contracts", icon: FileText, labelAr: "العقود", labelEn: "Contracts" },
        { path: "/dashboard/payments", icon: CreditCard, labelAr: "المدفوعات", labelEn: "Payments" },
        { path: "/dashboard/waitlist", icon: Bell, labelAr: "قائمة الانتظار", labelEn: "Waitlist" },
      ],
    },
    {
      titleAr: "الخدمات", titleEn: "Services",
      items: [
        { path: "/dashboard/services", icon: Package, labelAr: "الخدمات", labelEn: "Services" },
        { path: "/dashboard/team", icon: Users, labelAr: "الفريق", labelEn: "Team" },
        { path: "/dashboard/analytics", icon: BarChart3, labelAr: "التحليلات", labelEn: "Analytics" },
        { path: "/dashboard/ai-assistant", icon: Bot, labelAr: "المساعد الذكي", labelEn: "AI Assistant" },
      ],
    },
    {
      titleAr: "الإشعارات", titleEn: "Notifications",
      items: [
        { path: "/dashboard/messages", icon: MessageSquare, labelAr: "الرسائل", labelEn: "Messages" },
        { path: "/dashboard/notifications", icon: Bell, labelAr: "الإشعارات", labelEn: "Notifications" },
        { path: "/dashboard/reviews", icon: Star, labelAr: "التقييمات", labelEn: "Reviews" },
      ],
    },
    {
      titleAr: "الحساب", titleEn: "Account",
      items: [
        { path: "/dashboard/profile", icon: User, labelAr: "الملف الشخصي", labelEn: "Profile" },
        { path: "/dashboard/kyc", icon: Shield, labelAr: "التوثيق", labelEn: "Verification" },
        { path: "/dashboard/help", icon: HelpCircle, labelAr: "المساعدة", labelEn: "Help Center" },
      ],
    },
  ];
}

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useThemeStore();
  const { isRtl, language } = useLanguageStore();
  const { user, logout } = useAuthStore();
  const isAr = language === 'ar';
  const traderName = user?.email?.split('@')[0] || (isAr ? 'التاجر' : 'Trader');

  const navSections = useNavSections();
  const allNavItems = navSections.flatMap(s => s.items);

  const mobileNavItems: NavItem[] = [
    { path: "/dashboard/expos", icon: Building2, labelAr: "المعارض", labelEn: "Expos" },
    { path: "/dashboard/bookings", icon: CalendarCheck, labelAr: "الحجوزات", labelEn: "Bookings" },
    { path: "/dashboard", icon: LayoutDashboard, labelAr: "الرئيسية", labelEn: "Home" },
    { path: "/dashboard/messages", icon: MessageSquare, labelAr: "الرسائل", labelEn: "Messages" },
    { path: "/dashboard/profile", icon: User, labelAr: "حسابي", labelEn: "Profile" },
  ];

  const currentItem = allNavItems.find(n => n.path === pathname) || allNavItems.find(n => pathname.startsWith(n.path) && n.path !== "/dashboard");
  const isSubPage = pathname !== "/dashboard" && pathname !== "/dashboard/expos";
  const closeMobile = useCallback(() => setMobileOpen(false), []);
  const isDark = theme === 'dark';

  const handleLogout = useCallback(() => {
    logout();
    router.push('/login');
  }, [logout, router]);

  const handleBack = useCallback(() => {
    if (window.history.length > 1) router.back();
    else router.push("/dashboard/expos");
  }, [router]);

  const sidebarSide = isRtl ? "right-0" : "left-0";
  const mainMargin = isRtl
    ? (collapsed ? "lg:mr-20" : "lg:mr-64")
    : (collapsed ? "lg:ml-20" : "lg:ml-64");
  const drawerSide = isRtl ? "right-0" : "left-0";
  const drawerBorder = isRtl
    ? { borderLeft: "1px solid var(--glass-border)" }
    : { borderRight: "1px solid var(--glass-border)" };
  const drawerInitial = isRtl ? { x: "100%" } : { x: "-100%" };

  return (
    <div className="dashboard-shell min-h-screen flex" dir={isRtl ? 'rtl' : 'ltr'} style={{ background: 'var(--dash-bg)' }}>
      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex flex-col sidebar-glass fixed top-0 ${sidebarSide} h-screen z-40 transition-all duration-300 ${collapsed ? "w-20" : "w-64"}`}>
        <div className="flex flex-col items-center justify-center py-6 px-4 border-b" style={{ borderColor: "var(--glass-border)" }}>
          <img src={LOGO_URL} alt="Maham Expo" className={`object-contain transition-all duration-300 ${collapsed ? "h-10 w-10" : "h-14 w-auto max-w-[180px]"}`} style={{ filter: isDark ? 'drop-shadow(0 0 10px rgba(212,175,55,0.08))' : 'none' }} />
          {!collapsed && (
            <p className="text-[11px] t-tertiary mt-2 text-center leading-tight font-medium">{isAr ? "شركة مهام إكسبو لتنظيم المعارض والمؤتمرات" : "Maham Expo for Exhibitions & Conferences"}</p>
          )}
        </div>

        <nav className="flex-1 py-3 overflow-y-auto">
          {navSections.map((section, si) => (
            <div key={si} className="mb-2">
              {!collapsed && <p className="px-5 py-1.5 text-[11px] t-muted uppercase tracking-wider font-semibold">{isAr ? section.titleAr : section.titleEn}</p>}
              {section.items.map((item) => {
                const isActive = pathname === item.path || (item.path !== "/dashboard" && pathname.startsWith(item.path));
                return (
                  <Link key={item.path} href={item.path}>
                    <div className={`flex items-center gap-3 mx-3 my-0.5 px-3 py-2.5 rounded-xl transition-all duration-200 cursor-pointer ${isActive ? "bg-gold-subtle border-gold shadow-sm" : "hover:bg-[var(--glass-bg-hover)] border border-transparent"}`} style={isActive ? { border: `1px solid var(--gold-border)` } : undefined}>
                      <item.icon size={18} className="shrink-0" style={{ color: isActive ? "var(--gold-accent)" : "var(--text-tertiary)" }} />
                      {!collapsed && <span className="text-[13px] font-medium" style={{ color: isActive ? "var(--gold-accent)" : "var(--text-secondary)" }}>{isAr ? item.labelAr : item.labelEn}</span>}
                    </div>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="border-t" style={{ borderColor: "var(--glass-border)" }}>
          <button onClick={handleLogout} className="flex items-center gap-3 w-full px-5 py-3 transition-colors hover:bg-[var(--glass-bg-hover)]" style={{ color: "var(--status-red)" }}>
            <LogOut size={16} />
            {!collapsed && <span className="text-xs font-medium">{isAr ? 'تسجيل الخروج' : 'Logout'}</span>}
          </button>
          <button onClick={() => setCollapsed(!collapsed)} className="flex items-center justify-center w-full py-3 transition-colors" style={{ color: "var(--text-muted)" }}>
            {collapsed ? (isRtl ? <ChevronLeft size={16} /> : <ChevronRight size={16} />) : (isRtl ? <ChevronRight size={16} /> : <ChevronLeft size={16} />)}
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50" style={{ background: "var(--dash-bg)", borderTop: "1px solid var(--glass-border)", paddingBottom: "max(env(safe-area-inset-bottom, 8px), 8px)", boxShadow: isDark ? '0 -1px 8px rgba(0,0,0,0.3)' : '0 -1px 4px rgba(0,0,0,0.06)' }}>
        <div className="flex items-center justify-around py-2 px-1">
          {mobileNavItems.map((item) => {
            const isExactActive = pathname === item.path;
            return (
              <Link key={item.path} href={item.path}>
                <div className="flex flex-col items-center gap-0.5 py-1.5 px-2 sm:px-3 rounded-xl transition-all relative min-w-[44px]" style={{ color: isExactActive ? "var(--gold-accent)" : "var(--text-tertiary)" }}>
                  <item.icon size={20} strokeWidth={isExactActive ? 2.5 : 1.8} />
                  <span className="text-[11px] font-medium leading-tight truncate max-w-[56px] text-center">{isAr ? item.labelAr : item.labelEn}</span>
                  {isExactActive && <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-6 h-[3px] rounded-full" style={{ backgroundColor: "var(--gold-accent)" }} />}
                </div>
              </Link>
            );
          })}
          <button onClick={() => setMobileOpen(true)} className="flex flex-col items-center gap-0.5 py-1.5 px-2 sm:px-3 min-w-[44px]" style={{ color: "var(--text-tertiary)" }}>
            <Menu size={20} strokeWidth={1.8} />
            <span className="text-[11px] font-medium">{isAr ? 'المزيد' : 'More'}</span>
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="lg:hidden fixed inset-0 z-[55]" style={{ backgroundColor: "var(--modal-overlay)" }} onClick={closeMobile} />
            <motion.div initial={drawerInitial} animate={{ x: 0 }} exit={drawerInitial} transition={{ type: "spring", stiffness: 300, damping: 30 }} className={`lg:hidden fixed top-0 ${drawerSide} h-full w-[280px] z-[56] overflow-y-auto`} style={{ background: "var(--dash-bg)", ...drawerBorder }}>
              <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: "var(--glass-border)" }}>
                <img src={LOGO_URL} alt="Maham Expo" className="h-9 object-contain" style={{ filter: isDark ? 'none' : 'brightness(0.3)' }} />
                <button onClick={closeMobile} className="p-2 rounded-lg" style={{ color: "var(--text-tertiary)", background: "var(--glass-bg)" }}><X size={16} /></button>
              </div>
              <div className="p-4 border-b" style={{ borderColor: "var(--glass-border)" }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, var(--gold-accent), var(--gold-light))" }}><User size={16} style={{ color: "var(--btn-gold-text)" }} /></div>
                  <p className="text-sm font-bold t-primary truncate">{traderName}</p>
                </div>
              </div>
              <nav className="p-3">
                {navSections.map((section, si) => (
                  <div key={si} className="mb-3">
                    <p className="px-2 py-1 text-[11px] t-muted uppercase tracking-wider font-semibold">{isAr ? section.titleAr : section.titleEn}</p>
                    {section.items.map((item) => {
                      const isActive = pathname === item.path;
                      return (
                        <Link key={item.path} href={item.path}>
                          <div onClick={closeMobile} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all my-0.5 ${isActive ? "bg-gold-subtle" : ""}`} style={isActive ? { border: "1px solid var(--gold-border)" } : { border: "1px solid transparent" }}>
                            <item.icon size={16} style={{ color: isActive ? "var(--gold-accent)" : "var(--text-tertiary)" }} />
                            <span className="text-[13px]" style={{ color: isActive ? "var(--gold-accent)" : "var(--text-secondary)" }}>{isAr ? item.labelAr : item.labelEn}</span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                ))}
              </nav>
              <div className="p-3 border-t" style={{ borderColor: "var(--glass-border)" }}>
                <button onClick={handleLogout} className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl hover:bg-[var(--glass-bg-hover)]" style={{ color: "var(--status-red)" }}>
                  <LogOut size={16} /><span className="text-[13px] font-medium">{isAr ? 'تسجيل الخروج' : 'Logout'}</span>
                </button>
                <p className="text-[11px] t-muted text-center mt-3">{isAr ? "مهام إكسبو — بوابة التاجر" : "Maham Expo — Trader Portal"}</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className={`flex-1 min-w-0 min-h-screen transition-all duration-300 ${mainMargin}`} style={{ paddingBottom: "calc(100px + env(safe-area-inset-bottom, 24px))" }}>
        <header className="sticky top-0 z-30 px-4 sm:px-6 py-3" style={{ background: "var(--dash-bg)", borderBottom: "1px solid var(--glass-border)", boxShadow: isDark ? '0 1px 8px rgba(0,0,0,0.2)' : '0 1px 4px rgba(0,0,0,0.04)' }}>
          <div className="flex items-center justify-between gap-2 min-w-0">
            <div className="flex items-center gap-2">
              {isSubPage && (
                <button onClick={handleBack} className="p-2 rounded-lg transition-colors shrink-0" style={{ color: "var(--text-tertiary)", background: "var(--glass-bg)" }}>
                  {isRtl ? <ArrowRight size={16} /> : <ChevronLeft size={16} />}
                </button>
              )}
              <h1 className="text-sm sm:text-base font-bold text-gold-gradient">
                {currentItem ? (isAr ? currentItem.labelAr : currentItem.labelEn) : (isAr ? 'لوحة التحكم' : 'Dashboard')}
              </h1>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }} onClick={toggleTheme} className="p-2 rounded-xl transition-all" style={{ color: "var(--text-tertiary)", background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)', border: "1px solid var(--glass-border)" }}>
                {isDark ? <Sun size={16} /> : <Moon size={16} />}
              </motion.button>
              <Link href="/dashboard/notifications"><button className="relative p-2 rounded-lg transition-colors" style={{ color: "var(--text-tertiary)" }}><Bell size={16} /></button></Link>
              <Link href="/dashboard/messages"><button className="relative p-2 rounded-lg transition-colors hidden sm:block" style={{ color: "var(--text-tertiary)" }}><MessageSquare size={16} /><span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ backgroundColor: "var(--status-blue)" }} /></button></Link>
              <div className="hidden sm:flex flex-col" style={{ textAlign: isRtl ? "left" : "right" }}><span className="text-xs t-secondary">{traderName}</span></div>
              <Link href="/dashboard/profile">
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer" style={{ background: 'linear-gradient(135deg, var(--gold-accent), var(--gold-light))', boxShadow: '0 2px 12px rgba(212,175,55,0.2)' }}>
                  <User size={14} style={{ color: "var(--btn-gold-text)" }} />
                </motion.div>
              </Link>
            </div>
          </div>
        </header>
        <div className="p-2 sm:p-4 lg:p-6 pb-24 lg:pb-6 overflow-x-hidden">
          <motion.div key={pathname} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, ease: "easeOut" }}>
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
