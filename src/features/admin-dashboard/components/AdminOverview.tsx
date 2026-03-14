'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguageStore } from '@/shared/store/useLanguageStore';
import { usersApi, rolesApi, permissionsApi, servicesApi } from '@/services/adminService';

interface Stats {
  users: number;
  roles: number;
  permissions: number;
  services: number;
}

export function AdminOverview() {
  const { t } = useLanguageStore();
  const [stats, setStats] = useState<Stats>({ users: 0, roles: 0, permissions: 0, services: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [usersRes, rolesRes, permsRes, servicesRes] = await Promise.allSettled([
          usersApi.list({ page: 1 }),
          rolesApi.list(),
          permissionsApi.list(),
          servicesApi.list(),
        ]);
        setStats({
          users: usersRes.status === 'fulfilled' ? (usersRes.value.meta?.total || usersRes.value.data?.length || 0) : 0,
          roles: rolesRes.status === 'fulfilled' ? (rolesRes.value.data?.length || 0) : 0,
          permissions: permsRes.status === 'fulfilled' ? ((permsRes.value.data as any)?.permissions?.length || (permsRes.value.data as any)?.length || 0) : 0,
          services: servicesRes.status === 'fulfilled' ? (servicesRes.value.data?.length || 0) : 0,
        });
      } catch {
        // Stats will remain 0
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const a = t.admin || {} as Record<string, string>;

  const cards = [
    { label: a.totalUsers || 'Total Users', value: stats.users, icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z', color: 'from-blue-500 to-blue-600' },
    { label: a.totalRoles || 'Total Roles', value: stats.roles, icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', color: 'from-green-500 to-green-600' },
    { label: a.totalPermissions || 'Total Permissions', value: stats.permissions, icon: 'M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z', color: 'from-purple-500 to-purple-600' },
    { label: a.totalServices || 'Total Services', value: stats.services, icon: 'M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01', color: 'from-orange-500 to-orange-600' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        {a.overview || 'Overview'}
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {cards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{card.label}</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                  {loading ? '—' : card.value}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center`}>
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={card.icon} />
                </svg>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
