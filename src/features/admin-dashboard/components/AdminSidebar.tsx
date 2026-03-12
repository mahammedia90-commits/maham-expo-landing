'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguageStore } from '@/shared/store/useLanguageStore';
import { useLogout } from '@/features/auth/hooks/useAuth';
import { ROUTES } from '@/shared/constants';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const { t, isRtl } = useLanguageStore();
  const pathname = usePathname();
  const logout = useLogout();

  const navItems = [
    { href: ROUTES.ADMIN_DASHBOARD, label: t.admin?.overview || 'Overview', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { href: ROUTES.ADMIN_USERS, label: t.admin?.users || 'Users', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
    { href: ROUTES.ADMIN_ROLES, label: t.admin?.roles || 'Roles', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
    { href: ROUTES.ADMIN_PERMISSIONS, label: t.admin?.permissions || 'Permissions', icon: 'M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z' },
    { href: ROUTES.ADMIN_SERVICES, label: t.admin?.services || 'Services', icon: 'M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01' },
  ];

  const isActive = (href: string) => {
    if (href === ROUTES.ADMIN_DASHBOARD) return pathname === ROUTES.ADMIN_DASHBOARD || pathname === ROUTES.ADMIN_DASHBOARD + '/';
    return pathname.startsWith(href);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#987012] to-[#D4B85A] flex items-center justify-center">
            <span className="text-white font-bold text-lg">M</span>
          </div>
          <div>
            <span className="text-lg font-bold text-gray-900 dark:text-white">Maham Expo</span>
            <span className="block text-xs text-[#987012] dark:text-[#D4B85A] font-medium">{t.admin?.dashboard || 'Admin'}</span>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              isActive(item.href)
                ? 'bg-[#987012]/10 dark:bg-[#D4B85A]/10 text-[#987012] dark:text-[#D4B85A]'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
            </svg>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={() => logout.mutate()}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all"
        >
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          {t.admin?.logout || t.dashboard.logout}
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside className={`hidden lg:flex flex-col w-64 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 h-screen sticky top-0 ${isRtl ? 'border-l' : 'border-r'}`}>
        {sidebarContent}
      </aside>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: isRtl ? 280 : -280 }}
              animate={{ x: 0 }}
              exit={{ x: isRtl ? 280 : -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className={`fixed top-0 ${isRtl ? 'right-0' : 'left-0'} w-72 bg-white dark:bg-gray-800 h-screen z-50 shadow-2xl lg:hidden`}
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
