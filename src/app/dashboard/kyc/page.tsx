'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Building2, User, FileText, CreditCard, CheckCircle2,
  AlertCircle, Clock, Upload, Eye, X, Info, FileCheck
} from 'lucide-react';
import { useLanguageStore } from '@/shared/store/useLanguageStore';
import { useAuthStore } from '@/shared/store/useAuthStore';
import { toast } from 'sonner';

type KycStatus = 'pending' | 'submitted' | 'verified' | 'rejected';

export default function KYCPage() {
  const { language } = useLanguageStore();
  const isAr = language === 'ar';
  const { user } = useAuthStore();

  const [uploading, setUploading] = useState<string | null>(null);
  const [docs, setDocs] = useState<Record<string, { uploaded: boolean; fileName?: string; uploadedAt?: string }>>({
    commercial_register: { uploaded: false },
    national_id: { uploaded: false },
    vat_certificate: { uploaded: false },
    bank_certificate: { uploaded: false },
  });

  const kycStatus: KycStatus = 'pending';

  const handleUpload = (docKey: string) => {
    setUploading(docKey);
    setTimeout(() => {
      setDocs(prev => ({
        ...prev,
        [docKey]: {
          uploaded: true,
          fileName: `${docKey}_scan.pdf`,
          uploadedAt: new Date().toLocaleDateString(isAr ? 'ar-SA' : 'en-US'),
        },
      }));
      toast.success(isAr ? 'تم رفع المستند بنجاح' : 'Document uploaded successfully');
      setUploading(null);
    }, 2000);
  };

  const removeDoc = (docKey: string) => {
    setDocs(prev => ({ ...prev, [docKey]: { uploaded: false } }));
    toast.info(isAr ? 'تم حذف المستند' : 'Document removed');
  };

  const statusConfig: Record<KycStatus, { icon: typeof Clock; color: string; bg: string; border: string; label: string; desc: string }> = {
    pending: { icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', label: isAr ? 'في الانتظار' : 'Pending', desc: isAr ? 'يرجى رفع المستندات المطلوبة لإكمال التحقق' : 'Please upload required documents to complete verification' },
    submitted: { icon: AlertCircle, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', label: isAr ? 'تم الإرسال' : 'Submitted', desc: isAr ? 'تم إرسال مستنداتك وهي قيد المراجعة. سيتم إشعارك بالنتيجة خلال 24-48 ساعة.' : 'Your documents are under review. You will be notified within 24-48 hours.' },
    verified: { icon: CheckCircle2, color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20', label: isAr ? 'موثق' : 'Verified', desc: isAr ? 'تم التحقق من هويتك بنجاح. يمكنك الآن حجز الأجنحة وتوقيع العقود.' : 'Your identity has been verified. You can now book booths and sign contracts.' },
    rejected: { icon: X, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', label: isAr ? 'مرفوض' : 'Rejected', desc: isAr ? 'تم رفض المستندات. يرجى إعادة رفع مستندات واضحة وسارية المفعول.' : 'Documents rejected. Please re-upload clear and valid documents.' },
  };

  const currentStatus = statusConfig[kycStatus];
  const StatusIcon = currentStatus.icon;

  const uploadedCount = Object.values(docs).filter(d => d.uploaded).length;
  const totalDocs = 4;
  const progressPct = Math.round((uploadedCount / totalDocs) * 100);

  const documentTypes = [
    { key: 'commercial_register', icon: Building2, title: isAr ? 'السجل التجاري' : 'Commercial Register', desc: isAr ? 'صورة من السجل التجاري ساري المفعول' : 'Valid commercial register copy', required: true },
    { key: 'national_id', icon: User, title: isAr ? 'الهوية الوطنية' : 'National ID', desc: isAr ? 'صورة من الهوية الوطنية أو الإقامة' : 'National ID or Iqama copy', required: true },
    { key: 'vat_certificate', icon: FileText, title: isAr ? 'شهادة ضريبة القيمة المضافة' : 'VAT Certificate', desc: isAr ? 'شهادة التسجيل في ضريبة القيمة المضافة' : 'VAT registration certificate', required: false },
    { key: 'bank_certificate', icon: CreditCard, title: isAr ? 'شهادة بنكية' : 'Bank Certificate', desc: isAr ? 'خطاب من البنك يؤكد بيانات الحساب' : 'Bank letter confirming account details', required: false },
  ];

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      <h1 className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', 'Noto Sans Arabic', serif" }}>
        {isAr ? 'التحقق من الهوية' : 'Identity Verification (KYC)'}
      </h1>

      <div className="max-w-3xl">
        {/* Status Banner */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`p-5 rounded-xl ${currentStatus.bg} border ${currentStatus.border} mb-6`}>
          <div className="flex items-start gap-3">
            <StatusIcon className={`w-6 h-6 ${currentStatus.color} shrink-0 mt-0.5`} />
            <div>
              <p className={`font-bold ${currentStatus.color}`}>{currentStatus.label}</p>
              <p className="text-sm text-muted-foreground mt-1">{currentStatus.desc}</p>
            </div>
          </div>
        </motion.div>

        {/* Progress */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="p-4 rounded-xl bg-card border border-border/50 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">{isAr ? 'تقدم التحقق' : 'Verification Progress'}</span>
            <span className="text-sm font-bold text-[#C5A55A]">{progressPct}%</span>
          </div>
          <div className="h-2 rounded-full bg-accent/50 overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: `${progressPct}%` }} transition={{ duration: 0.8 }} className="h-full rounded-full bg-gradient-to-r from-[#C5A55A] to-[#E8D5A3]" />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {isAr ? `${uploadedCount} من ${totalDocs} مستندات تم رفعها` : `${uploadedCount} of ${totalDocs} documents uploaded`}
          </p>
        </motion.div>

        {/* Document Upload Sections */}
        <div className="space-y-4">
          {documentTypes.map((doc, i) => {
            const docState = docs[doc.key];
            const isUploading = uploading === doc.key;
            return (
              <motion.div
                key={doc.key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                className={`p-4 rounded-xl bg-card border transition-all ${docState.uploaded ? 'border-green-500/30' : 'border-border/50'}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${docState.uploaded ? 'bg-green-500/10' : 'bg-accent/50'}`}>
                      {docState.uploaded ? <CheckCircle2 className="w-5 h-5 text-green-400" /> : <doc.icon className="w-5 h-5 text-muted-foreground" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="font-medium text-sm">{doc.title}</p>
                        {doc.required ? (
                          <span className="bg-red-500/10 text-red-400 text-[10px] border-0 px-1.5 py-0.5 rounded-full">{isAr ? 'مطلوب' : 'Required'}</span>
                        ) : (
                          <span className="bg-accent text-muted-foreground text-[10px] border-0 px-1.5 py-0.5 rounded-full">{isAr ? 'اختياري' : 'Optional'}</span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{doc.desc}</p>
                      {docState.uploaded && (
                        <div className="flex items-center gap-2 mt-2 text-xs text-green-400">
                          <FileCheck className="w-3 h-3" />
                          <span>{docState.fileName}</span>
                          <span className="text-muted-foreground">-- {docState.uploadedAt}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    {docState.uploaded ? (
                      <>
                        <button onClick={() => toast.info(isAr ? 'عرض المستند' : 'Viewing document')} className="px-3 py-1.5 rounded-lg border border-border/50 text-xs flex items-center gap-1 hover:bg-accent/50">
                          <Eye className="w-3 h-3" />{isAr ? 'عرض' : 'View'}
                        </button>
                        <button onClick={() => removeDoc(doc.key)} className="px-2 py-1.5 rounded-lg border border-border/50 hover:bg-accent/50">
                          <X className="w-3 h-3" />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleUpload(doc.key)}
                        disabled={isUploading || (kycStatus as string) === 'verified'}
                        className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#C5A55A] to-[#E8D5A3] text-[#0A0A12] hover:opacity-90 text-xs font-semibold flex items-center gap-1 disabled:opacity-50"
                      >
                        {isUploading ? (
                          <span className="animate-pulse">{isAr ? 'جاري الرفع...' : 'Uploading...'}</span>
                        ) : (
                          <><Upload className="w-3.5 h-3.5" />{isAr ? 'رفع' : 'Upload'}</>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Notes */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-6 p-4 rounded-xl bg-accent/30 border border-border/30">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
            <div className="text-xs text-muted-foreground space-y-1">
              <p className="font-medium text-foreground">{isAr ? 'ملاحظات مهمة:' : 'Important Notes:'}</p>
              <p>{isAr ? '- يجب أن تكون جميع المستندات سارية المفعول وواضحة' : '- All documents must be valid and clearly readable'}</p>
              <p>{isAr ? '- الصيغ المقبولة: PDF, JPG, PNG (حد أقصى 5MB)' : '- Accepted formats: PDF, JPG, PNG (max 5MB)'}</p>
              <p>{isAr ? '- يتم مراجعة المستندات خلال 24-48 ساعة عمل' : '- Documents are reviewed within 24-48 business hours'}</p>
              <p>{isAr ? '- التحقق مطلوب لحجز الأجنحة وتوقيع العقود' : '- Verification is required for booking booths and signing contracts'}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
