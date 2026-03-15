'use client';

/**
 * DashboardLayout — Manus-style sidebar + main content area
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
  Shield, HelpCircle, Sun, Moon, LogOut,
  Users, Package, Globe
} from "lucide-react";

/* ─── Types ─── */
interface NavItem {
  path: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string; style?: React.CSSProperties }>;
  labelAr: string;
  labelEn: string;
  badge?: number;
}

interface NavSection {
  titleAr: string;
  titleEn: string;
  items: NavItem[];
}

/* ─── Nav Sections (Manus structure) ─── */
function useNavSections(): NavSection[] {
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
        { path: "/dashboard/bookings", icon: CalendarCheck, labelAr: "الحجوزات", labelEn: "Bookings", badge: 3 },
        { path: "/dashboard/contracts", icon: FileText, labelAr: "العقود", labelEn: "Contracts" },
        { path: "/dashboard/payments", icon: CreditCard, labelAr: "المدفوعات", labelEn: "Payments" },
      ],
    },
    {
      titleAr: "العمليات", titleEn: "Operations",
      items: [
        { path: "/dashboard/services", icon: Package, labelAr: "الخدمات", labelEn: "Services" },
        { path: "/dashboard/waitlist", icon: Bell, labelAr: "قائمة الانتظار", labelEn: "Waitlist" },
      ],
    },
    {
      titleAr: "التحليلات", titleEn: "Analytics",
      items: [
        { path: "/dashboard/analytics", icon: BarChart3, labelAr: "التحليلات", labelEn: "Analytics" },
        { path: "/dashboard/ai-assistant", icon: Bot, labelAr: "المساعد الذكي", labelEn: "AI Assistant" },
      ],
    },
    {
      titleAr: "الفريق", titleEn: "Team",
      items: [
        { path: "/dashboard/team", icon: Users, labelAr: "إدارة الفريق", labelEn: "Team" },
      ],
    },
    {
      titleAr: "الحساب", titleEn: "Account",
      items: [
        { path: "/dashboard/profile", icon: User, labelAr: "الملف الشخصي", labelEn: "Profile" },
        { path: "/dashboard/kyc", icon: Shield, labelAr: "التحقق من الهوية", labelEn: "KYC" },
        { path: "/dashboard/messages", icon: MessageSquare, labelAr: "الرسائل", labelEn: "Messages" },
        { path: "/dashboard/reviews", icon: Star, labelAr: "التقييمات", labelEn: "Reviews" },
        { path: "/dashboard/notifications", icon: Bell, labelAr: "الإشعارات", labelEn: "Notifications", badge: 5 },
      ],
    },
    {
      titleAr: "المساعدة", titleEn: "Support",
      items: [
        { path: "/dashboard/help", icon: HelpCircle, labelAr: "مركز المساعدة", labelEn: "Help Center" },
      ],
    },
  ];
}

/* ─── Mobile bottom nav items ─── */
const MOBILE_NAV: NavItem[] = [
  { path: "/dashboard/expos", icon: Building2, labelAr: "المعارض", labelEn: "Expos" },
  { path: "/dashboard/bookings", icon: CalendarCheck, labelAr: "الحجوزات", labelEn: "Bookings" },
  { path: "/dashboard", icon: LayoutDashboard, labelAr: "الرئيسية", labelEn: "Home" },
  { path: "/dashboard/messages", icon: MessageSquare, labelAr: "الرسائل", labelEn: "Messages" },
  { path: "/dashboard/profile", icon: User, labelAr: "حسابي", labelEn: "Profile" },
];

/* ─── Logo "M" ─── */
function LogoMark({ size = 40 }: { size?: number }) {
  return (
    <div
      className="rounded-xl flex items-center justify-center font-bold text-white shrink-0"
      style={{
        width: size,
        height: size,
        background: 'linear-gradient(135deg, #C5A55A, #E8D5A3)',
        fontSize: size * 0.45,
        boxShadow: '0 2px 8px rgba(197,165,90,0.3)',
      }}
    >
      M
    </div>
  );
}

/* ─── Brand name with gold gradient ─── */
function BrandName({ isAr }: { isAr: boolean }) {
  return (
    <div className="flex flex-col min-w-0">
      <span
        className="text-[15px] font-bold leading-tight truncate"
        style={{
          fontFamily: "'Playfair Display', 'Noto Sans Arabic', serif",
          background: 'linear-gradient(135deg, #C5A55A, #E8D5A3, #C5A55A)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        {isAr ? 'مهام إكسبو' : 'Maham Expo'}
      </span>
      <span className="text-[10px] t-muted leading-tight truncate">
        {isAr ? 'بوابة التاجر' : 'Trader Portal'}
      </span>
    </div>
  );
}

/* ═══════════════════════════════════════════
   Main Layout Component
   ═══════════════════════════════════════════ */
export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useThemeStore();
  const { isRtl, language, toggleLanguage } = useLanguageStore();
  const { user, logout } = useAuthStore();
  const isAr = language === 'ar';
  const isDark = theme === 'dark';
  const traderName = user?.email?.split('@')[0] || (isAr ? 'التاجر' : 'Trader');
  const companyName = isAr ? 'شركة مهام إكسبو' : 'Maham Expo Co.';

  const navSections = useNavSections();
  const allNavItems = navSections.flatMap(s => s.items);
  const closeMobile = useCallback(() => setMobileOpen(false), []);

  const handleLogout = useCallback(() => {
    logout();
    router.push('/login');
  }, [logout, router]);

  /* ─── Sidebar positioning ─── */
  const sidebarSide = isRtl ? "right-0" : "left-0";
  const mainMargin = isRtl
    ? (collapsed ? "lg:mr-20" : "lg:mr-64")
    : (collapsed ? "lg:ml-20" : "lg:ml-64");
  const drawerSide = isRtl ? "right-0" : "left-0";
  const drawerBorder = isRtl
    ? { borderLeft: "1px solid var(--glass-border)" }
    : { borderRight: "1px solid var(--glass-border)" };
  const drawerInitial = isRtl ? { x: "100%" } : { x: "-100%" };

  /* ─── Active check helper ─── */
  const isItemActive = (path: string) =>
    pathname === path || (path !== "/dashboard" && pathname.startsWith(path));

  /* ─── Render a single nav item ─── */
  function renderNavItem(item: NavItem, isMobileDrawer = false) {
    const isActive = isItemActive(item.path);
    const iconSize = isMobileDrawer ? 16 : 17;

    return (
      <Link key={item.path} href={item.path} onClick={isMobileDrawer ? closeMobile : undefined}>
        <motion.div
          whileHover={{ x: isRtl ? -3 : 3 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className={`relative flex items-center gap-3 mx-2.5 my-0.5 px-3 py-2 rounded-xl transition-colors duration-200 cursor-pointer ${
            isActive
              ? 'bg-gold-subtle font-medium'
              : 'hover:bg-[var(--glass-bg-hover)]'
          }`}
          style={isActive ? { border: '1px solid var(--gold-border)' } : { border: '1px solid transparent' }}
        >
          {/* Active indicator bar */}
          {isActive && (
            <motion.div
              layoutId={isMobileDrawer ? "sidebar-active-mobile" : "sidebar-active"}
              className="absolute top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-full"
              style={{
                backgroundColor: 'var(--gold-accent)',
                [isRtl ? 'right' : 'left']: -2,
              }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}

          <item.icon
            size={iconSize}
            className="shrink-0"
            style={{ color: isActive ? "var(--gold-accent)" : "var(--text-muted)" }}
            strokeWidth={isActive ? 2.2 : 1.8}
          />

          {(!collapsed || isMobileDrawer) && (
            <span
              className={`text-[13px] flex-1 ${isActive ? 'font-semibold' : 'font-medium'}`}
              style={{ color: isActive ? "var(--gold-accent)" : "var(--text-secondary)" }}
            >
              {isAr ? item.labelAr : item.labelEn}
            </span>
          )}

          {/* Badge */}
          {(!collapsed || isMobileDrawer) && item.badge && item.badge > 0 && (
            <span
              className="text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none"
              style={{ backgroundColor: 'var(--badge-bg)', color: 'var(--badge-text)' }}
            >
              {item.badge}
            </span>
          )}
        </motion.div>
      </Link>
    );
  }

  return (
    <div className="dashboard-shell min-h-screen flex" dir={isRtl ? 'rtl' : 'ltr'} style={{ background: 'var(--dash-bg)' }}>

      {/* ═══════ Desktop Sidebar ═══════ */}
      <aside className={`hidden lg:flex flex-col sidebar-glass fixed top-0 ${sidebarSide} h-screen z-40 transition-all duration-300 ${collapsed ? "w-20" : "w-64"}`}>

        {/* Logo Area */}
        <div className="flex items-center gap-3 py-5 px-4 border-b" style={{ borderColor: "var(--glass-border)" }}>
          <LogoMark size={collapsed ? 36 : 40} />
          {!collapsed && <BrandName isAr={isAr} />}
        </div>

        {/* Nav Sections */}
        <nav className="flex-1 py-2 overflow-y-auto no-scrollbar">
          {navSections.map((section, si) => (
            <div key={si} className="mb-1">
              {!collapsed && (
                <div className="px-5 pt-4 pb-1.5">
                  <p className="text-[10px] t-muted uppercase tracking-[0.08em] font-bold">
                    {isAr ? section.titleAr : section.titleEn}
                  </p>
                </div>
              )}
              {collapsed && si > 0 && <div className="mx-4 my-2 divider-subtle" />}
              {section.items.map((item) => {
                const isActive = isItemActive(item.path);
                // Collapsed: icon-only centered
                if (collapsed) {
                  return (
                    <Link key={item.path} href={item.path}>
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className={`relative flex items-center justify-center mx-2.5 my-0.5 p-2.5 rounded-xl transition-colors cursor-pointer ${
                          isActive ? 'bg-gold-subtle' : 'hover:bg-[var(--glass-bg-hover)]'
                        }`}
                        title={isAr ? item.labelAr : item.labelEn}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="sidebar-active"
                            className="absolute top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-full"
                            style={{
                              backgroundColor: 'var(--gold-accent)',
                              [isRtl ? 'right' : 'left']: 0,
                            }}
                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                          />
                        )}
                        <item.icon
                          size={18}
                          style={{ color: isActive ? "var(--gold-accent)" : "var(--text-muted)" }}
                          strokeWidth={isActive ? 2.2 : 1.8}
                        />
                      </motion.div>
                    </Link>
                  );
                }
                return renderNavItem(item);
              })}
            </div>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="border-t py-3 px-3 space-y-2" style={{ borderColor: "var(--glass-border)" }}>
          {/* Theme + Language toggles */}
          <div className={`flex items-center ${collapsed ? 'flex-col gap-2' : 'gap-2 px-1'}`}>
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="p-2 rounded-lg transition-all hover:bg-[var(--glass-bg-hover)]"
              style={{ color: "var(--text-tertiary)" }}
              title={isDark ? 'Light mode' : 'Dark mode'}
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleLanguage}
              className="p-2 rounded-lg transition-all hover:bg-[var(--glass-bg-hover)] text-[11px] font-bold"
              style={{ color: "var(--text-tertiary)" }}
              title={isAr ? 'English' : 'العربية'}
            >
              {collapsed ? <Globe size={16} /> : (isAr ? 'EN' : 'AR')}
            </motion.button>
            {!collapsed && <div className="flex-1" />}
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="p-2 rounded-lg transition-all hover:bg-[var(--glass-bg-hover)]"
              style={{ color: "var(--status-red)" }}
              title={isAr ? 'تسجيل الخروج' : 'Logout'}
            >
              <LogOut size={16} />
            </motion.button>
          </div>

          {/* User avatar + info */}
          {!collapsed && (
            <Link href="/dashboard/profile">
              <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-[var(--glass-bg-hover)] transition-colors cursor-pointer">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                  style={{
                    background: 'linear-gradient(135deg, #C5A55A, #E8D5A3)',
                    boxShadow: '0 2px 8px rgba(197,165,90,0.25)',
                  }}
                >
                  <User size={14} className="text-white" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[12px] font-semibold t-primary truncate">{traderName}</span>
                  <span className="text-[10px] t-muted truncate">{companyName}</span>
                </div>
              </div>
            </Link>
          )}
          {collapsed && (
            <Link href="/dashboard/profile" className="flex justify-center">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="w-9 h-9 rounded-full flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #C5A55A, #E8D5A3)',
                  boxShadow: '0 2px 8px rgba(197,165,90,0.25)',
                }}
              >
                <User size={14} className="text-white" />
              </motion.div>
            </Link>
          )}
        </div>

        {/* Collapse Toggle — round gold button on sidebar edge */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center z-50 shadow-md transition-all hover:scale-110"
          style={{
            background: 'linear-gradient(135deg, #C5A55A, #E8D5A3)',
            color: '#fff',
            [isRtl ? 'left' : 'right']: -12,
          }}
        >
          {collapsed
            ? (isRtl ? <ChevronLeft size={12} /> : <ChevronRight size={12} />)
            : (isRtl ? <ChevronRight size={12} /> : <ChevronLeft size={12} />)
          }
        </button>
      </aside>

      {/* ═══════ Mobile Top Bar ═══════ */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50" style={{ background: 'var(--dash-bg)', borderBottom: '1px solid var(--glass-border)' }}>
        <div className="flex items-center justify-between px-4 py-3">
          {/* Left: hamburger */}
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-xl transition-all"
            style={{ color: 'var(--text-secondary)', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}
          >
            <Menu size={18} />
          </button>

          {/* Center: logo + brand */}
          <div className="flex items-center gap-2">
            <LogoMark size={32} />
            <span
              className="text-[14px] font-bold"
              style={{
                fontFamily: "'Playfair Display', 'Noto Sans Arabic', serif",
                background: 'linear-gradient(135deg, #C5A55A, #E8D5A3, #C5A55A)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {isAr ? 'مهام إكسبو' : 'Maham Expo'}
            </span>
          </div>

          {/* Right: theme + notifications */}
          <div className="flex items-center gap-1.5">
            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="p-2 rounded-xl transition-all"
              style={{ color: 'var(--text-tertiary)', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}
            >
              {isDark ? <Sun size={15} /> : <Moon size={15} />}
            </motion.button>
            <Link href="/dashboard/notifications">
              <button
                className="relative p-2 rounded-xl transition-all"
                style={{ color: 'var(--text-tertiary)', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}
              >
                <Bell size={15} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--status-red)' }} />
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* ═══════ Mobile Bottom Nav ═══════ */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-50"
        style={{
          background: "var(--dash-bg)",
          borderTop: "1px solid var(--glass-border)",
          paddingBottom: "max(env(safe-area-inset-bottom, 8px), 8px)",
          boxShadow: isDark ? '0 -1px 8px rgba(0,0,0,0.3)' : '0 -1px 4px rgba(0,0,0,0.06)',
        }}
      >
        <div className="flex items-center justify-around py-2 px-1">
          {MOBILE_NAV.map((item) => {
            const isExactActive = pathname === item.path;
            return (
              <Link key={item.path} href={item.path}>
                <div
                  className="flex flex-col items-center gap-0.5 py-1.5 px-2 sm:px-3 rounded-xl transition-all relative min-w-[44px]"
                  style={{ color: isExactActive ? "var(--gold-accent)" : "var(--text-tertiary)" }}
                >
                  <item.icon size={20} strokeWidth={isExactActive ? 2.5 : 1.8} />
                  <span className="text-[11px] font-medium leading-tight truncate max-w-[56px] text-center">
                    {isAr ? item.labelAr : item.labelEn}
                  </span>
                  {isExactActive && (
                    <div
                      className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-6 h-[3px] rounded-full"
                      style={{ backgroundColor: "var(--gold-accent)" }}
                    />
                  )}
                </div>
              </Link>
            );
          })}
          <button
            onClick={() => setMobileOpen(true)}
            className="flex flex-col items-center gap-0.5 py-1.5 px-2 sm:px-3 min-w-[44px]"
            style={{ color: "var(--text-tertiary)" }}
          >
            <Menu size={20} strokeWidth={1.8} />
            <span className="text-[11px] font-medium">{isAr ? 'المزيد' : 'More'}</span>
          </button>
        </div>
      </nav>

      {/* ═══════ Mobile Drawer ═══════ */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 z-[55]"
              style={{ backgroundColor: "var(--modal-overlay)" }}
              onClick={closeMobile}
            />
            <motion.div
              initial={drawerInitial}
              animate={{ x: 0 }}
              exit={drawerInitial}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={`lg:hidden fixed top-0 ${drawerSide} h-full w-[280px] z-[56] overflow-y-auto`}
              style={{ background: "var(--dash-bg)", ...drawerBorder }}
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: "var(--glass-border)" }}>
                <div className="flex items-center gap-2.5">
                  <LogoMark size={34} />
                  <BrandName isAr={isAr} />
                </div>
                <button
                  onClick={closeMobile}
                  className="p-2 rounded-lg"
                  style={{ color: "var(--text-tertiary)", background: "var(--glass-bg)" }}
                >
                  <X size={16} />
                </button>
              </div>

              {/* Drawer User */}
              <div className="p-4 border-b" style={{ borderColor: "var(--glass-border)" }}>
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: "linear-gradient(135deg, #C5A55A, #E8D5A3)" }}
                  >
                    <User size={16} className="text-white" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <p className="text-sm font-bold t-primary truncate">{traderName}</p>
                    <p className="text-[11px] t-muted truncate">{companyName}</p>
                  </div>
                </div>
              </div>

              {/* Drawer Nav */}
              <nav className="p-3">
                {navSections.map((section, si) => (
                  <div key={si} className="mb-3">
                    <p className="px-2 py-1 text-[11px] t-muted uppercase tracking-wider font-semibold">
                      {isAr ? section.titleAr : section.titleEn}
                    </p>
                    {section.items.map((item) => renderNavItem(item, true))}
                  </div>
                ))}
              </nav>

              {/* Drawer Footer */}
              <div className="p-3 border-t" style={{ borderColor: "var(--glass-border)" }}>
                <div className="flex items-center gap-2 px-3 mb-3">
                  <button
                    onClick={toggleTheme}
                    className="p-2 rounded-lg hover:bg-[var(--glass-bg-hover)] transition-all"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    {isDark ? <Sun size={16} /> : <Moon size={16} />}
                  </button>
                  <button
                    onClick={toggleLanguage}
                    className="p-2 rounded-lg hover:bg-[var(--glass-bg-hover)] transition-all text-[11px] font-bold"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    {isAr ? 'EN' : 'AR'}
                  </button>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl hover:bg-[var(--glass-bg-hover)]"
                  style={{ color: "var(--status-red)" }}
                >
                  <LogOut size={16} />
                  <span className="text-[13px] font-medium">{isAr ? 'تسجيل الخروج' : 'Logout'}</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ═══════ Main Content ═══════ */}
      <main
        className={`flex-1 min-w-0 min-h-screen transition-all duration-300 ${mainMargin}`}
        style={{ paddingBottom: "calc(100px + env(safe-area-inset-bottom, 24px))" }}
      >
        {/* Mobile top bar spacer */}
        <div className="lg:hidden h-[60px]" />

        {/* Content */}
        <div className="p-3 sm:p-5 lg:p-6 pb-24 lg:pb-8 overflow-x-hidden">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
