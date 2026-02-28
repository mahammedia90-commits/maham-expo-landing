'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguageStore } from '@/shared/store/useLanguageStore';
import { useInvestorSettings, useUpdateInvestorSettings } from '../hooks/useInvestorData';
import { ToggleSwitch } from '@/features/merchant-dashboard/components/ToggleSwitch';
import { LoadingSkeleton } from '@/features/merchant-dashboard/components/LoadingSkeleton';
import type { InvestorSettings } from '@/shared/types';

export function InvestorSettingsSection() {
  const { t } = useLanguageStore();
  const { data, isLoading } = useInvestorSettings();
  const updateSettings = useUpdateInvestorSettings();

  const [localSettings, setLocalSettings] = useState<InvestorSettings | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (data?.data) setLocalSettings(data.data);
  }, [data]);

  if (isLoading || !localSettings) return <LoadingSkeleton type="stat" count={3} />;

  const updateNotification = (key: keyof InvestorSettings['notifications'], value: boolean) => {
    setLocalSettings((prev) => prev ? {
      ...prev,
      notifications: { ...prev.notifications, [key]: value },
    } : prev);
  };

  const updateDisplay = (key: keyof InvestorSettings['display'], value: InvestorSettings['display'][typeof key]) => {
    setLocalSettings((prev) => prev ? {
      ...prev,
      display: { ...prev.display, [key]: value },
    } : prev);
  };

  const updateSecurity = (key: keyof InvestorSettings['security'], value: boolean) => {
    setLocalSettings((prev) => prev ? {
      ...prev,
      security: { ...prev.security, [key]: value },
    } : prev);
  };

  const handleSave = () => {
    if (!localSettings) return;
    updateSettings.mutate(localSettings, {
      onSuccess: () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      },
    });
  };

  return (
    <div>
      <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        {t.investorDashboard.settingsTitle}
      </motion.h1>

      <div className="max-w-2xl space-y-6">
        {/* Notification Settings */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t.investorDashboard.notificationSettings}</h3>
          <div className="divide-y divide-gray-100 dark:divide-gray-750">
            <ToggleSwitch enabled={localSettings.notifications.emailNotifications} onChange={(v) => updateNotification('emailNotifications', v)} label={t.investorDashboard.emailNotifications} description={t.investorDashboard.emailNotificationsDesc} />
            <ToggleSwitch enabled={localSettings.notifications.smsNotifications} onChange={(v) => updateNotification('smsNotifications', v)} label={t.investorDashboard.smsNotifications} description={t.investorDashboard.smsNotificationsDesc} />
            <ToggleSwitch enabled={localSettings.notifications.pushNotifications} onChange={(v) => updateNotification('pushNotifications', v)} label={t.investorDashboard.pushNotifications} description={t.investorDashboard.pushNotificationsDesc} />
            <ToggleSwitch enabled={localSettings.notifications.bookingAlerts} onChange={(v) => updateNotification('bookingAlerts', v)} label={t.investorDashboard.bookingAlerts} description={t.investorDashboard.bookingAlertsDesc} />
            <ToggleSwitch enabled={localSettings.notifications.spaceUpdates} onChange={(v) => updateNotification('spaceUpdates', v)} label={t.investorDashboard.spaceUpdates} description={t.investorDashboard.spaceUpdatesDesc} />
            <ToggleSwitch enabled={localSettings.notifications.eventReminders} onChange={(v) => updateNotification('eventReminders', v)} label={t.investorDashboard.eventReminders} description={t.investorDashboard.eventRemindersDesc} />
            <ToggleSwitch enabled={localSettings.notifications.revenueReports} onChange={(v) => updateNotification('revenueReports', v)} label={t.investorDashboard.revenueReports} description={t.investorDashboard.revenueReportsDesc} />
          </div>
        </motion.div>

        {/* Display Settings */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t.investorDashboard.displaySettings}</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <p className="text-sm font-medium text-gray-900 dark:text-white">{t.investorDashboard.languageSetting}</p>
              <select value={localSettings.display.language} onChange={(e) => updateDisplay('language', e.target.value as 'ar' | 'en')} className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm">
                <option value="ar">العربية</option>
                <option value="en">English</option>
              </select>
            </div>
            <div className="flex items-center justify-between py-2">
              <p className="text-sm font-medium text-gray-900 dark:text-white">{t.investorDashboard.themeSetting}</p>
              <select value={localSettings.display.theme} onChange={(e) => updateDisplay('theme', e.target.value as 'light' | 'dark')} className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm">
                <option value="light">{t.investorDashboard.lightTheme}</option>
                <option value="dark">{t.investorDashboard.darkTheme}</option>
              </select>
            </div>
            <ToggleSwitch enabled={localSettings.display.compactMode} onChange={(v) => updateDisplay('compactMode', v)} label={t.investorDashboard.compactMode} description={t.investorDashboard.compactModeDesc} />
          </div>
        </motion.div>

        {/* Security Settings */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t.investorDashboard.securitySettings}</h3>
          <div className="divide-y divide-gray-100 dark:divide-gray-750">
            <ToggleSwitch enabled={localSettings.security.twoFactorAuth} onChange={(v) => updateSecurity('twoFactorAuth', v)} label={t.investorDashboard.twoFactorAuth} description={t.investorDashboard.twoFactorAuthDesc} />
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{t.investorDashboard.changePassword}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{t.investorDashboard.changePasswordDesc}</p>
              </div>
              <button className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-xs font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                {t.investorDashboard.changePassword}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Save Button */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="flex items-center gap-4">
          <button onClick={handleSave} disabled={updateSettings.isPending} className="px-6 py-2.5 rounded-xl bg-[#987012] hover:bg-[#876010] text-white font-medium transition-colors disabled:opacity-50">
            {updateSettings.isPending ? t.investorDashboard.savingSettings : t.investorDashboard.saveSettings}
          </button>
          {saved && (
            <motion.p initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-sm text-green-500 font-medium">
              {t.investorDashboard.settingsSaved}
            </motion.p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
