'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Download, Pen, CheckCircle, Clock, CircleAlert,
  ChevronUp, ChevronDown, FileCheck, Printer, Stamp, X
} from 'lucide-react';
import { useLanguageStore } from '@/shared/store/useLanguageStore';

interface Contract {
  id: string;
  expoTitle: string;
  expoTitleAr?: string;
  unitDetails: string;
  totalAmount: number;
  status: 'draft' | 'signed' | 'active' | 'expired';
  createdAt: string;
  terms: string[];
}

export default function Contracts() {
  const { language, isRtl } = useLanguageStore();
  const isAr = language === 'ar';

  // Mock empty data
  const contracts: Contract[] = [];

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [signModalId, setSignModalId] = useState<string | null>(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const statusConfig: Record<string, { icon: typeof CheckCircle; color: string; bg: string; label: string }> = {
    draft: { icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-500/10', label: isAr ? 'مسودة - بانتظار التوقيع' : 'Draft - Awaiting Signature' },
    signed: { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/10', label: isAr ? 'تم التوقيع' : 'Signed' },
    active: { icon: FileText, color: 'text-blue-400', bg: 'bg-blue-500/10', label: isAr ? 'نشط' : 'Active' },
    expired: { icon: CircleAlert, color: 'text-gray-400', bg: 'bg-gray-500/10', label: isAr ? 'منتهي' : 'Expired' },
  };

  const handleSign = (contractId: string) => {
    setSignModalId(contractId);
    setAgreedToTerms(false);
  };

  const confirmSign = () => {
    // In real app, call API to sign contract
    setSignModalId(null);
    setAgreedToTerms(false);
  };

  return (
    <div className="space-y-5 pb-20 lg:pb-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', 'Noto Sans Arabic', serif" }}>
          {isAr ? 'العقود' : 'Contracts'}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {isAr ? `${contracts.length} عقد` : `${contracts.length} contracts`}
        </p>
      </div>

      {/* Empty State */}
      {contracts.length === 0 ? (
        <div className="p-12 rounded-xl bg-card border border-border/50 text-center">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground font-medium">
            {isAr ? 'لا توجد عقود' : 'No contracts yet'}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {isAr ? 'ستظهر العقود هنا بعد الموافقة على حجزك' : 'Contracts will appear here after your booking is approved'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {contracts.map((contract, i) => {
            const config = statusConfig[contract.status] || statusConfig.draft;
            const StatusIcon = config.icon;
            const isExpanded = expandedId === contract.id;

            return (
              <motion.div
                key={contract.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-xl bg-card border border-border/50 overflow-hidden"
              >
                {/* Card Header */}
                <div
                  className="p-5 cursor-pointer"
                  onClick={() => setExpandedId(isExpanded ? null : contract.id)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg ${config.bg} flex items-center justify-center shrink-0`}>
                        <StatusIcon className={`w-5 h-5 ${config.color}`} />
                      </div>
                      <div>
                        <span className="font-mono text-xs text-muted-foreground block">{contract.id}</span>
                        <h3 className="font-semibold t-primary">
                          {isAr ? (contract.expoTitleAr || contract.expoTitle) : contract.expoTitle}
                        </h3>
                        <p className="text-xs text-muted-foreground">{contract.unitDetails}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`${config.bg} ${config.color} text-[10px] px-2 py-0.5 rounded-full border-0`}>
                        {config.label}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {contract.createdAt || '2026-03-15'}
                      </span>
                    </div>
                    <p className="text-lg font-bold text-[#C5A55A]">
                      {contract.totalAmount.toLocaleString()} {isAr ? 'ر.س' : 'SAR'}
                    </p>
                  </div>
                </div>

                {/* Expanded Content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 space-y-4 border-t border-border/30 pt-4">
                        {/* Contract Terms */}
                        <div className="p-4 rounded-lg bg-card/50 border border-border/30">
                          <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                            <FileCheck className="w-4 h-4 text-[#C5A55A]" />
                            {isAr ? 'بنود العقد' : 'Contract Terms'}
                          </h4>
                          <ul className="space-y-2">
                            {contract.terms.map((term, idx) => (
                              <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                                <span className="text-[#C5A55A] mt-0.5 shrink-0">&#8226;</span>
                                <span>{term}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Amount Breakdown */}
                        <div className="p-4 rounded-lg bg-card/50 border border-border/30">
                          <h4 className="text-sm font-semibold mb-3">
                            {isAr ? 'تفاصيل المبلغ' : 'Amount Breakdown'}
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">{isAr ? 'سعر الجناح' : 'Booth Price'}</span>
                              <span className="t-primary">{(contract.totalAmount * 0.87).toLocaleString()} {isAr ? 'ر.س' : 'SAR'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">{isAr ? 'رسوم الخدمة' : 'Service Fee'}</span>
                              <span className="t-primary">{(contract.totalAmount * 0.05).toLocaleString()} {isAr ? 'ر.س' : 'SAR'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">{isAr ? 'ضريبة القيمة المضافة 15%' : 'VAT 15%'}</span>
                              <span className="t-primary">{(contract.totalAmount * 0.08).toLocaleString()} {isAr ? 'ر.س' : 'SAR'}</span>
                            </div>
                            <div className="flex justify-between pt-2 border-t border-border/30 font-bold">
                              <span className="t-primary">{isAr ? 'الإجمالي' : 'Total'}</span>
                              <span className="text-[#C5A55A]">{contract.totalAmount.toLocaleString()} {isAr ? 'ر.س' : 'SAR'}</span>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-2">
                          {contract.status === 'draft' && (
                            <button
                              onClick={() => handleSign(contract.id)}
                              className="bg-gradient-to-r from-[#C5A55A] to-[#E8D5A3] text-[#0A0A12] hover:opacity-90 font-semibold px-4 py-2 rounded-lg text-sm flex items-center gap-1.5"
                            >
                              <Pen className="w-4 h-4" />
                              {isAr ? 'توقيع العقد' : 'Sign Contract'}
                            </button>
                          )}
                          <button className="px-4 py-2 rounded-lg text-sm border border-border/50 t-secondary flex items-center gap-1.5 hover:border-[#C5A55A]/30 transition-colors">
                            <Download className="w-4 h-4" />
                            {isAr ? 'تحميل' : 'Download'}
                          </button>
                          <button className="px-4 py-2 rounded-lg text-sm border border-border/50 t-secondary flex items-center gap-1.5 hover:border-[#C5A55A]/30 transition-colors">
                            <Printer className="w-4 h-4" />
                            {isAr ? 'طباعة' : 'Print'}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Sign Contract Modal */}
      <AnimatePresence>
        {signModalId && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-50"
              onClick={() => setSignModalId(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[95vw] max-w-md p-6 rounded-xl bg-card border border-border/50 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <Stamp className="w-5 h-5 text-[#C5A55A]" />
                  {isAr ? 'توقيع العقد' : 'Sign Contract'}
                </h3>
                <button onClick={() => setSignModalId(null)}>
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-card/50 border border-border/30 text-center">
                  <Stamp className="w-12 h-12 text-[#C5A55A] mx-auto mb-2" />
                  <p className="text-sm font-medium t-primary">{isAr ? 'التوقيع الرقمي' : 'Digital Signature'}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {isAr
                      ? 'بالنقر على "تأكيد التوقيع" فإنك توافق على جميع بنود العقد'
                      : 'By clicking "Confirm Signature" you agree to all contract terms'}
                  </p>
                </div>

                <div className="p-4 rounded-lg border border-dashed border-[#C5A55A]/30 text-center">
                  <p className="text-lg font-bold text-[#C5A55A]" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {isAr ? 'التاجر' : 'Trader'}
                  </p>
                </div>

                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="mt-1 rounded border-border accent-[#C5A55A]"
                  />
                  <span className="text-xs text-muted-foreground">
                    {isAr
                      ? 'أقر بأنني قرأت وفهمت جميع بنود العقد وأوافق عليها'
                      : 'I confirm that I have read, understood, and agree to all contract terms'}
                  </span>
                </label>

                <button
                  onClick={confirmSign}
                  disabled={!agreedToTerms}
                  className="w-full bg-gradient-to-r from-[#C5A55A] to-[#E8D5A3] text-[#0A0A12] hover:opacity-90 font-semibold px-4 py-2.5 rounded-lg text-sm flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  <Pen className="w-4 h-4" />
                  {isAr ? 'تأكيد التوقيع' : 'Confirm Signature'}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
