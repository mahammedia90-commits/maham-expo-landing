'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CreditCard, CheckCircle, Clock, Receipt, Download,
  ChevronUp, ChevronDown, Landmark, Smartphone, Wallet, X, Banknote
} from 'lucide-react';
import { useLanguageStore } from '@/shared/store/useLanguageStore';

interface Invoice {
  id: string;
  bookingId: string;
  orderId: string;
  expoTitle: string;
  boothId: string;
  zone: string;
  subtotal: number;
  serviceFee: number;
  vat: number;
  total: number;
  status: 'paid' | 'pending' | 'refunded';
  dueDate: string;
  createdAt: string;
}

export default function Payments() {
  const { language, isRtl } = useLanguageStore();
  const isAr = language === 'ar';

  // Mock empty data
  const invoices: Invoice[] = [];

  const [filterStatus, setFilterStatus] = useState('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showPayModal, setShowPayModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [processing, setProcessing] = useState(false);

  const filtered = useMemo(() =>
    filterStatus === 'all' ? invoices : invoices.filter(inv => inv.status === filterStatus),
    [invoices, filterStatus]
  );

  const totalPaid = invoices.filter(i => i.status === 'paid').reduce((a, b) => a + b.total, 0);
  const totalPending = invoices.filter(i => i.status === 'pending').reduce((a, b) => a + b.total, 0);

  const statusConfig: Record<string, { icon: typeof CheckCircle; color: string; bg: string; label: string }> = {
    paid: { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/10', label: isAr ? 'مدفوع' : 'Paid' },
    pending: { icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-500/10', label: isAr ? 'قيد الانتظار' : 'Pending' },
    refunded: { icon: Banknote, color: 'text-blue-400', bg: 'bg-blue-500/10', label: isAr ? 'مسترد' : 'Refunded' },
  };

  const summaryCards = [
    { icon: Receipt, label: isAr ? 'إجمالي الفواتير' : 'Total Invoices', value: invoices.length, color: '#C5A55A' },
    { icon: CheckCircle, label: isAr ? 'المدفوعة' : 'Paid', value: `${totalPaid.toLocaleString()} ${isAr ? 'ر.س' : 'SAR'}`, color: '#4ADE80' },
    { icon: Clock, label: isAr ? 'قيد الانتظار' : 'Pending', value: `${totalPending.toLocaleString()} ${isAr ? 'ر.س' : 'SAR'}`, color: '#F59E0B' },
    { icon: Wallet, label: isAr ? 'الرصيد المستحق' : 'Balance Due', value: `${totalPending.toLocaleString()} ${isAr ? 'ر.س' : 'SAR'}`, color: '#EF4444' },
  ];

  const handlePay = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowPayModal(true);
  };

  const processPayment = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setShowPayModal(false);
      setSelectedInvoice(null);
    }, 2000);
  };

  return (
    <div className="space-y-5 pb-20 lg:pb-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', 'Noto Sans Arabic', serif" }}>
          {isAr ? 'المدفوعات' : 'Payments'}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {isAr ? 'إدارة الفواتير والمدفوعات' : 'Manage invoices and payments'}
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="p-4 rounded-xl bg-card border border-border/50"
          >
            <card.icon className="w-5 h-5 mb-2" style={{ color: card.color }} />
            <p className="text-lg font-bold t-primary">{card.value}</p>
            <p className="text-[10px] text-muted-foreground">{card.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {['all', 'pending', 'paid', 'refunded'].map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`px-3 py-1.5 rounded-lg text-xs border transition-all ${
              filterStatus === s
                ? 'bg-[#C5A55A]/10 text-[#C5A55A] border-[#C5A55A]/30 font-medium'
                : 'bg-card/30 text-muted-foreground border-border/30'
            }`}
          >
            {s === 'all' ? (isAr ? 'الكل' : 'All') : statusConfig[s]?.label || s}
          </button>
        ))}
      </div>

      {/* Empty State */}
      {filtered.length === 0 ? (
        <div className="p-12 rounded-xl bg-card border border-border/50 text-center">
          <Receipt className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground font-medium">
            {isAr ? 'لا توجد فواتير' : 'No invoices'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((invoice, i) => {
            const config = statusConfig[invoice.status] || statusConfig.pending;
            const StatusIcon = config.icon;
            const isExpanded = expandedId === invoice.id;

            return (
              <motion.div
                key={invoice.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="rounded-xl bg-card border border-border/50 overflow-hidden"
              >
                {/* Card Header */}
                <div
                  className="p-4 cursor-pointer"
                  onClick={() => setExpandedId(isExpanded ? null : invoice.id)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg ${config.bg} flex items-center justify-center shrink-0`}>
                        <StatusIcon className={`w-5 h-5 ${config.color}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-mono text-xs text-muted-foreground">{invoice.id}</span>
                          <span className={`${config.bg} ${config.color} text-[10px] px-2 py-0.5 rounded-full border-0`}>
                            {config.label}
                          </span>
                        </div>
                        <h3 className="font-semibold text-sm t-primary">{invoice.expoTitle}</h3>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-[#C5A55A]">
                        {invoice.total.toLocaleString()} {isAr ? 'ر.س' : 'SAR'}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{isAr ? 'جناح' : 'Booth'}: {invoice.boothId}</span>
                    <span>{isAr ? 'تاريخ الاستحقاق' : 'Due'}: <span dir="ltr">{invoice.dueDate}</span></span>
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
                      <div className="px-4 pb-4 space-y-4 border-t border-border/30 pt-4">
                        {/* Invoice Breakdown */}
                        <div className="p-4 rounded-lg bg-card/50 border border-border/30">
                          <h4 className="text-sm font-semibold mb-3">
                            {isAr ? 'تفاصيل الفاتورة' : 'Invoice Breakdown'}
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">{isAr ? 'سعر الجناح' : 'Booth Price'}</span>
                              <span className="t-primary">{invoice.subtotal.toLocaleString()} {isAr ? 'ر.س' : 'SAR'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">{isAr ? 'رسوم الخدمة (5%)' : 'Service Fee (5%)'}</span>
                              <span className="t-primary">{invoice.serviceFee.toLocaleString()} {isAr ? 'ر.س' : 'SAR'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">{isAr ? 'ضريبة القيمة المضافة (15%)' : 'VAT (15%)'}</span>
                              <span className="t-primary">{invoice.vat.toLocaleString()} {isAr ? 'ر.س' : 'SAR'}</span>
                            </div>
                            <div className="flex justify-between pt-2 border-t border-border/30 font-bold">
                              <span className="t-primary">{isAr ? 'الإجمالي' : 'Total'}</span>
                              <span className="text-[#C5A55A]">{invoice.total.toLocaleString()} {isAr ? 'ر.س' : 'SAR'}</span>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-2">
                          {invoice.status === 'pending' && (
                            <button
                              onClick={() => handlePay(invoice)}
                              className="bg-gradient-to-r from-[#C5A55A] to-[#E8D5A3] text-[#0A0A12] hover:opacity-90 font-semibold text-sm px-4 py-2 rounded-lg flex items-center gap-1.5"
                            >
                              <CreditCard className="w-4 h-4" />
                              {isAr ? 'ادفع الآن' : 'Pay Now'}
                            </button>
                          )}
                          <button className="px-4 py-2 rounded-lg text-sm border border-border/50 t-secondary flex items-center gap-1.5 hover:border-[#C5A55A]/30 transition-colors">
                            <Download className="w-4 h-4" />
                            {isAr ? 'تحميل الفاتورة' : 'Download Invoice'}
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

      {/* Payment Modal */}
      <AnimatePresence>
        {showPayModal && selectedInvoice && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-50"
              onClick={() => !processing && setShowPayModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[95vw] max-w-md p-6 rounded-xl bg-card border border-border/50 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-[#C5A55A]" />
                  {isAr ? 'بوابة الدفع' : 'Payment Gateway'}
                </h3>
                {!processing && (
                  <button onClick={() => setShowPayModal(false)}>
                    <X className="w-5 h-5 text-muted-foreground" />
                  </button>
                )}
              </div>

              <div className="space-y-4">
                {/* Amount */}
                <div className="p-4 rounded-lg bg-card/50 border border-border/30 text-center">
                  <p className="text-xs text-muted-foreground mb-1">{isAr ? 'المبلغ المستحق' : 'Amount Due'}</p>
                  <p className="text-3xl font-bold text-[#C5A55A]">
                    {selectedInvoice.total.toLocaleString()} <span className="text-sm">{isAr ? 'ر.س' : 'SAR'}</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{selectedInvoice.id}</p>
                </div>

                {/* Payment Method */}
                <div>
                  <label className="text-sm font-medium block mb-2 t-primary">
                    {isAr ? 'طريقة الدفع' : 'Payment Method'}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { key: 'card', icon: CreditCard, label: isAr ? 'بطاقة' : 'Card' },
                      { key: 'bank', icon: Landmark, label: isAr ? 'تحويل بنكي' : 'Bank' },
                      { key: 'wallet', icon: Smartphone, label: 'Apple Pay' },
                    ].map((m) => (
                      <button
                        key={m.key}
                        onClick={() => setPaymentMethod(m.key)}
                        className={`p-3 rounded-lg border text-center transition-all ${
                          paymentMethod === m.key
                            ? 'border-[#C5A55A] bg-[#C5A55A]/10'
                            : 'border-border/50 hover:border-border'
                        }`}
                      >
                        <m.icon className={`w-5 h-5 mx-auto mb-1 ${paymentMethod === m.key ? 'text-[#C5A55A]' : 'text-muted-foreground'}`} />
                        <span className="text-xs t-primary">{m.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Card Fields */}
                {paymentMethod === 'card' && (
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-muted-foreground block mb-1">{isAr ? 'رقم البطاقة' : 'Card Number'}</label>
                      <input type="text" placeholder="4242 4242 4242 4242" className="w-full h-9 px-3 rounded-lg border border-border/50 bg-card/50 text-sm t-primary placeholder:text-muted-foreground focus:outline-none focus:border-[#C5A55A]/50" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-muted-foreground block mb-1">{isAr ? 'تاريخ الانتهاء' : 'Expiry'}</label>
                        <input type="text" placeholder="MM/YY" className="w-full h-9 px-3 rounded-lg border border-border/50 bg-card/50 text-sm t-primary placeholder:text-muted-foreground focus:outline-none focus:border-[#C5A55A]/50" />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground block mb-1">CVV</label>
                        <input type="text" placeholder="123" className="w-full h-9 px-3 rounded-lg border border-border/50 bg-card/50 text-sm t-primary placeholder:text-muted-foreground focus:outline-none focus:border-[#C5A55A]/50" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Bank Transfer Details */}
                {paymentMethod === 'bank' && (
                  <div className="p-4 rounded-lg bg-card/50 border border-border/30 space-y-2 text-sm">
                    <p className="font-medium t-primary">{isAr ? 'تفاصيل التحويل البنكي' : 'Bank Transfer Details'}</p>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{isAr ? 'البنك' : 'Bank'}</span>
                      <span className="t-primary">Al Rajhi Bank</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">IBAN</span>
                      <span className="t-primary" dir="ltr">SA0380000000608010167519</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{isAr ? 'المستفيد' : 'Beneficiary'}</span>
                      <span className="t-primary">Maham Expo LLC</span>
                    </div>
                  </div>
                )}

                {/* Pay Button */}
                <button
                  onClick={processPayment}
                  disabled={processing}
                  className="w-full bg-gradient-to-r from-[#C5A55A] to-[#E8D5A3] text-[#0A0A12] hover:opacity-90 font-semibold px-4 py-2.5 rounded-lg text-sm disabled:opacity-50"
                >
                  {processing ? (
                    <span className="animate-pulse">{isAr ? 'جاري المعالجة...' : 'Processing...'}</span>
                  ) : (
                    isAr ? `ادفع ${selectedInvoice.total.toLocaleString()} ر.س` : `Pay ${selectedInvoice.total.toLocaleString()} SAR`
                  )}
                </button>

                <p className="text-[10px] text-muted-foreground text-center">
                  {isAr ? 'جميع المعاملات مشفرة ومحمية بمعايير PCI DSS' : 'All transactions are encrypted and PCI DSS compliant'}
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
