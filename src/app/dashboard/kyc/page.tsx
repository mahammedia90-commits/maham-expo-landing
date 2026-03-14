'use client';

/**
 * KYC — Know Your Customer Verification
 * Adapted from reference project for Next.js App Router
 */
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Shield, Upload, CheckCircle2, AlertTriangle, User,
  Building2, CreditCard, FileText, Lock,
  ChevronLeft, ChevronRight, Globe, Phone, Mail,
  MapPin, Calendar, Hash, Award, Info, Scale,
  BookOpen, Stamp, Eye, BadgeCheck, FileWarning, Gavel, ArrowRight
} from "lucide-react";
import { useAuthStore } from "@/shared/store/useAuthStore";
import { useLanguageStore } from "@/shared/store/useLanguageStore";

type KYCStep = "personal" | "business" | "bank" | "documents" | "declaration" | "complete";

interface FormData {
  fullName: string; idNumber: string; phone: string; email: string; dob: string;
  nationality: string; city: string; address: string; companyName: string; crNumber: string;
  businessType: string; founded: string; employees: string; website: string; vatNumber: string;
  nationalAddress: string; bankName: string; iban: string; accountHolder: string; accountNumber: string;
}

export default function KYCPage() {
  const { language, isRtl } = useLanguageStore();
  const isAr = language === 'ar';
  const isRTL = isRtl;
  const [currentStep, setCurrentStep] = useState<KYCStep>("personal");
  const [completedSteps, setCompletedSteps] = useState<KYCStep[]>([]);
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [agreedPrivacy, setAgreedPrivacy] = useState(false);
  const [agreedIP, setAgreedIP] = useState(false);
  const [agreedPenalty, setAgreedPenalty] = useState(false);
  const [agreedAll, setAgreedAll] = useState(false);
  const [showFullTerms, setShowFullTerms] = useState(false);
  const [uploadedDocs, setUploadedDocs] = useState<Record<string, boolean>>({});
  const [formData, setFormData] = useState<FormData>({
    fullName: "", idNumber: "", phone: "", email: "", dob: "", nationality: "",
    city: "", address: "", companyName: "", crNumber: "", businessType: "",
    founded: "", employees: "", website: "", vatNumber: "", nationalAddress: "",
    bankName: "", iban: "", accountHolder: "", accountNumber: ""
  });

  const { user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.name || "",
        phone: user.phone || "",
        email: user.email || "",
      }));
    }
  }, [user]);

  const allAgreed = agreedTerms && agreedPrivacy && agreedIP && agreedPenalty;
  useEffect(() => { if (agreedAll) { setAgreedTerms(true); setAgreedPrivacy(true); setAgreedIP(true); setAgreedPenalty(true); } }, [agreedAll]);
  useEffect(() => { setAgreedAll(allAgreed); }, [agreedTerms, agreedPrivacy, agreedIP, agreedPenalty]);

  const steps = [
    { id: "personal" as KYCStep, label: isAr ? 'المعلومات الشخصية' : 'Personal Info', icon: User, completed: completedSteps.includes("personal") },
    { id: "business" as KYCStep, label: isAr ? 'معلومات الشركة' : 'Business Info', icon: Building2, completed: completedSteps.includes("business") },
    { id: "bank" as KYCStep, label: isAr ? 'الحساب البنكي' : 'Bank Account', icon: CreditCard, completed: completedSteps.includes("bank") },
    { id: "documents" as KYCStep, label: isAr ? 'المستندات' : 'Documents', icon: FileText, completed: completedSteps.includes("documents") },
    { id: "declaration" as KYCStep, label: isAr ? 'الإقرار القانوني' : 'Legal Declaration', icon: Shield, completed: completedSteps.includes("declaration") },
  ];

  const currentIndex = steps.findIndex(s => s.id === currentStep);

  const handleNext = () => {
    setCompletedSteps(prev => prev.includes(currentStep) ? prev : [...prev, currentStep]);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].id);
      alert(isAr ? 'تم حفظ البيانات' : 'Data saved');
    } else {
      setCurrentStep("complete");
      alert(isAr ? 'تم إكمال التوثيق بنجاح!' : 'Verification complete!');
    }
  };

  const handlePrev = () => { if (currentIndex > 0) setCurrentStep(steps[currentIndex - 1].id); };
  const handleUpload = (docId: string) => { setUploadedDocs(prev => ({ ...prev, [docId]: true })); alert(isAr ? 'تم رفع الملف' : 'File uploaded'); };
  const updateField = (field: keyof FormData, value: string) => { setFormData(prev => ({ ...prev, [field]: value })); };

  const InputField = ({ label, placeholder, icon: Icon, field, type = "text", optional = false }: {
    label: string; placeholder: string; icon: any; field: keyof FormData; type?: string; optional?: boolean;
  }) => (
    <div>
      <label className="text-[11px] t-tertiary mb-1.5 block font-medium">
        {label}
        {optional && <span className="text-[11px] t-muted mx-1">({isAr ? 'اختياري' : 'Optional'})</span>}
      </label>
      <div className="relative">
        <Icon size={14} className={`absolute ${isRTL ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 t-muted`} />
        <input type={type} value={formData[field]} onChange={(e) => updateField(field, e.target.value)} placeholder={placeholder}
          className={`w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl ${isRTL ? "pr-10 pl-4" : "pl-10 pr-4"} py-3 text-sm t-secondary placeholder:t-muted focus:outline-none focus:border-[var(--gold-border)] transition-colors`} />
      </div>
    </div>
  );

  return (
    <div className="space-y-4 sm:space-y-6 max-w-4xl mx-auto px-1">
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-gold-gradient" style={{ fontFamily: "'IBM Plex Sans Arabic', serif" }}>{isAr ? 'التوثيق والتحقق' : 'KYC Verification'}</h2>
        <p className="text-[12px] sm:text-xs t-gold/50 font-['Inter']">Know Your Customer — Required before booking</p>
      </div>

      <div className="glass-card rounded-xl p-3 sm:p-4 border-[var(--gold-border)]/20 bg-gold-subtle">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-[var(--gold-border)]/10 flex items-center justify-center flex-shrink-0">
            <Stamp size={16} className="t-gold" />
          </div>
          <div className="min-w-0">
            <p className="text-xs sm:text-sm font-bold t-gold">{isAr ? 'اسم الشركة' : 'Company Name'}</p>
            <p className="text-[11px] sm:text-[12px] t-muted font-['Inter']">Maham Company for Services and Information Technology</p>
            <p className="text-[11px] sm:text-[12px] t-tertiary mt-1">{isAr ? 'رقم السجل التجاري' : 'CR Number'}: 4030163376 | {isAr ? 'مسجلة في ضريبة القيمة المضافة' : 'VAT Registered'}</p>
          </div>
        </div>
      </div>

      {currentStep !== "complete" && (
        <div className="glass-card rounded-xl sm:rounded-2xl p-3 sm:p-5">
          <div className="flex items-center justify-between mb-3 sm:mb-4 overflow-x-auto">
            {steps.map((step, i) => (
              <div key={step.id} className="flex items-center flex-shrink-0">
                <div className={`flex items-center gap-1 sm:gap-2 ${step.id === currentStep ? "t-gold" : step.completed ? "text-[var(--status-green)]" : "t-muted"}`}>
                  <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[12px] sm:text-xs font-bold border ${step.id === currentStep ? "border-[#C5A55A] bg-gold-subtle" : step.completed ? "border-green-400/50 bg-[var(--status-green)]/10" : "border-[var(--glass-border)] bg-[var(--glass-bg)]"}`}>
                    {step.completed ? <CheckCircle2 size={12} /> : i + 1}
                  </div>
                  <span className="hidden lg:block text-[12px]">{step.label}</span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`w-4 sm:w-8 lg:w-16 h-px mx-1 sm:mx-2 ${step.completed ? "bg-[var(--status-green)]/30" : "bg-[var(--glass-bg)]"}`} />
                )}
              </div>
            ))}
          </div>
          <div className="h-1.5 rounded-full bg-[var(--glass-bg)]">
            <div className="h-full rounded-full bg-gradient-to-l from-[#C5A55A] to-[#E8D5A3] transition-all duration-500" style={{ width: `${((completedSteps.length) / steps.length) * 100}%` }} />
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div key={currentStep} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-6">

          {currentStep === "personal" && (
            <div>
              <div className="flex items-center gap-2 mb-4 sm:mb-6">
                <User size={18} className="t-gold" />
                <h3 className="text-sm sm:text-base font-bold t-primary">{isAr ? 'المعلومات الشخصية' : 'Personal Info'}</h3>
              </div>
              <div className="bg-[var(--status-blue)]/5 border border-[var(--status-blue)]/10 rounded-lg p-3 mb-4">
                <div className="flex items-center gap-2">
                  <Info size={12} className="text-[var(--status-blue)] flex-shrink-0" />
                  <p className="text-[12px] sm:text-xs t-tertiary">{isAr ? 'يجب أن تتطابق المعلومات مع بيانات أبشر' : 'Information must match Absher records'}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <InputField label={isAr ? 'الاسم الكامل' : 'Full Name'} placeholder={isAr ? 'أدخل الاسم الرباعي' : 'Enter full name'} icon={User} field="fullName" />
                <InputField label={isAr ? 'رقم الهوية' : 'ID Number'} placeholder="1XXXXXXXXX" icon={Hash} field="idNumber" />
                <InputField label={isAr ? 'رقم الجوال' : 'Phone'} placeholder="+966 5X XXX XXXX" icon={Phone} field="phone" />
                <InputField label={isAr ? 'البريد الإلكتروني' : 'Email'} placeholder="email@example.com" icon={Mail} field="email" type="email" />
                <InputField label={isAr ? 'تاريخ الميلاد' : 'Date of Birth'} placeholder="YYYY-MM-DD" icon={Calendar} field="dob" type="date" />
                <InputField label={isAr ? 'الجنسية' : 'Nationality'} placeholder={isAr ? 'مثال: سعودي' : 'e.g. Saudi'} icon={Globe} field="nationality" />
                <InputField label={isAr ? 'المدينة' : 'City'} placeholder={isAr ? 'مثال: جدة' : 'e.g. Jeddah'} icon={MapPin} field="city" />
                <InputField label={isAr ? 'العنوان' : 'Address'} placeholder={isAr ? 'العنوان التفصيلي' : 'Detailed address'} icon={MapPin} field="address" />
              </div>
            </div>
          )}

          {currentStep === "business" && (
            <div>
              <div className="flex items-center gap-2 mb-4 sm:mb-6">
                <Building2 size={18} className="t-gold" />
                <h3 className="text-sm sm:text-base font-bold t-primary">{isAr ? 'معلومات الشركة' : 'Business Info'}</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <InputField label={isAr ? 'اسم الشركة' : 'Company Name'} placeholder={isAr ? 'اسم المنشأة' : 'Company name'} icon={Building2} field="companyName" />
                <InputField label={isAr ? 'رقم السجل التجاري' : 'CR Number'} placeholder="XXXXXXXXXX" icon={Hash} field="crNumber" />
                <div>
                  <label className="text-[11px] t-tertiary mb-1.5 block font-medium">{isAr ? 'نوع النشاط' : 'Business Type'}</label>
                  <select value={formData.businessType} onChange={(e) => updateField("businessType", e.target.value)} className="w-full bg-[var(--modal-bg)] border border-[var(--glass-border)] rounded-xl px-4 py-3 text-sm t-secondary focus:outline-none focus:border-[var(--gold-border)] transition-colors">
                    <option value="">{isAr ? 'اختر نوع النشاط' : 'Select business type'}</option>
                    <option value="food_beverage">{isAr ? 'أغذية ومشروبات' : 'Food & Beverage'}</option>
                    <option value="retail">{isAr ? 'تجزئة' : 'Retail'}</option>
                    <option value="tech">{isAr ? 'تقنية' : 'Technology'}</option>
                    <option value="realestate">{isAr ? 'عقارات' : 'Real Estate'}</option>
                    <option value="entertainment">{isAr ? 'ترفيه' : 'Entertainment'}</option>
                    <option value="health">{isAr ? 'صحة' : 'Health'}</option>
                    <option value="fashion">{isAr ? 'أزياء' : 'Fashion'}</option>
                    <option value="auto">{isAr ? 'سيارات' : 'Automotive'}</option>
                    <option value="education">{isAr ? 'تعليم' : 'Education'}</option>
                    <option value="other">{isAr ? 'أخرى' : 'Other'}</option>
                  </select>
                </div>
                <InputField label={isAr ? 'سنة التأسيس' : 'Founded'} placeholder="2020" icon={Calendar} field="founded" />
                <InputField label={isAr ? 'الرقم الضريبي' : 'VAT Number'} placeholder="3XXXXXXXXXXXXX003" icon={Hash} field="vatNumber" />
                <InputField label={isAr ? 'العنوان الوطني' : 'National Address'} placeholder={isAr ? 'رمز العنوان الوطني' : 'National address code'} icon={MapPin} field="nationalAddress" optional={true} />
                <InputField label={isAr ? 'عدد الموظفين' : 'Employees'} placeholder="10-50" icon={User} field="employees" />
                <InputField label={isAr ? 'الموقع الإلكتروني' : 'Website'} placeholder="www.example.com" icon={Globe} field="website" />
              </div>
            </div>
          )}

          {currentStep === "bank" && (
            <div>
              <div className="flex items-center gap-2 mb-4 sm:mb-6">
                <CreditCard size={18} className="t-gold" />
                <h3 className="text-sm sm:text-base font-bold t-primary">{isAr ? 'الحساب البنكي' : 'Bank Account'}</h3>
              </div>
              <div className="bg-gold-subtle border border-[var(--gold-border)]/10 rounded-lg p-3 mb-4">
                <div className="flex items-center gap-2">
                  <Lock size={12} className="t-gold flex-shrink-0" />
                  <p className="text-[12px] sm:text-xs t-gold/70">{isAr ? 'بياناتك البنكية مشفرة بأعلى معايير الأمان' : 'Your bank data is encrypted with the highest security standards'}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <InputField label={isAr ? 'اسم البنك' : 'Bank Name'} placeholder={isAr ? 'مثال: البنك الأهلي' : 'e.g. Al Ahli Bank'} icon={Building2} field="bankName" />
                <InputField label={isAr ? 'رقم الآيبان' : 'IBAN'} placeholder="SA XXXX XXXX XXXX XXXX XXXX" icon={Hash} field="iban" />
                <InputField label={isAr ? 'اسم صاحب الحساب' : 'Account Holder'} placeholder={isAr ? 'كما في البنك' : 'As registered with bank'} icon={User} field="accountHolder" />
                <InputField label={isAr ? 'رقم الحساب' : 'Account Number'} placeholder="XXXXXXXXXXXX" icon={Hash} field="accountNumber" />
              </div>
              <div className="mt-4 bg-[var(--status-blue)]/5 border border-[var(--status-blue)]/10 rounded-lg p-3">
                <p className="text-[12px] sm:text-xs t-tertiary">{isAr ? 'يجب أن يكون الحساب البنكي باسم الشركة أو صاحب السجل التجاري' : 'Bank account must be in the name of the company or CR holder'}</p>
              </div>
            </div>
          )}

          {currentStep === "documents" && (
            <div>
              <div className="flex items-center gap-2 mb-4 sm:mb-6">
                <FileText size={18} className="t-gold" />
                <h3 className="text-sm sm:text-base font-bold t-primary">{isAr ? 'المستندات' : 'Documents'}</h3>
              </div>
              <div className="bg-[var(--status-red)]/5 border border-[var(--status-red)]/10 rounded-lg p-3 mb-4">
                <div className="flex items-start gap-2">
                  <FileWarning size={12} className="text-[var(--status-red)] flex-shrink-0 mt-0.5" />
                  <p className="text-[12px] sm:text-xs t-tertiary">{isAr ? 'يجب رفع جميع المستندات المطلوبة بصيغة PDF أو صورة واضحة' : 'All required documents must be uploaded as PDF or clear image'}</p>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { id: "national_id", label: isAr ? 'الهوية الوطنية' : 'National ID', desc: isAr ? 'صورة واضحة من الوجهين' : 'Clear copy from both sides', required: true },
                  { id: "cr", label: isAr ? 'السجل التجاري' : 'Commercial Registration', desc: isAr ? 'نسخة سارية المفعول' : 'Valid copy', required: true },
                  { id: "vat_cert", label: isAr ? 'شهادة ضريبة القيمة المضافة' : 'VAT Certificate', desc: isAr ? 'شهادة التسجيل في ضريبة القيمة المضافة' : 'VAT registration certificate', required: true },
                  { id: "auth_letter", label: isAr ? 'خطاب التفويض' : 'Authorization Letter', desc: isAr ? 'خطاب تفويض رسمي مختوم' : 'Official stamped authorization letter', required: true },
                  { id: "national_address", label: isAr ? 'العنوان الوطني' : 'National Address', desc: isAr ? 'إثبات العنوان الوطني' : 'National address proof', required: false },
                  { id: "bank_letter", label: isAr ? 'خطاب البنك' : 'Bank Letter', desc: isAr ? 'خطاب تعريف من البنك' : 'Bank identification letter', required: false },
                  { id: "company_profile", label: isAr ? 'ملف الشركة' : 'Company Profile', desc: isAr ? 'نبذة عن الشركة ونشاطها' : 'Company overview and activities', required: true },
                  { id: "product_catalog", label: isAr ? 'كتالوج المنتجات' : 'Product Catalog', desc: isAr ? 'كتالوج المنتجات أو الخدمات' : 'Products or services catalog', required: true },
                ].map((doc) => (
                  <div key={doc.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)] hover:border-[var(--gold-border)] transition-colors gap-2 sm:gap-0">
                    <div className="flex items-start gap-3 min-w-0">
                      {uploadedDocs[doc.id] ? (
                        <CheckCircle2 size={16} className="text-[var(--status-green)] flex-shrink-0 mt-0.5" />
                      ) : (
                        <FileText size={16} className="t-tertiary flex-shrink-0 mt-0.5" />
                      )}
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm t-secondary font-medium">{doc.label}</p>
                        <p className="text-[11px] t-muted mt-0.5">{doc.desc}</p>
                      </div>
                      {doc.required && !uploadedDocs[doc.id] && (
                        <span className="text-[11px] sm:text-[11px] text-[var(--status-red)] bg-[var(--status-red)]/10 px-1.5 py-0.5 rounded flex-shrink-0">{isAr ? 'مطلوب' : 'Required'}</span>
                      )}
                      {!doc.required && !uploadedDocs[doc.id] && (
                        <span className="text-[11px] sm:text-[11px] t-muted bg-[var(--glass-bg)] px-1.5 py-0.5 rounded flex-shrink-0 border border-[var(--glass-border)]">{isAr ? 'اختياري' : 'Optional'}</span>
                      )}
                    </div>
                    <button onClick={() => handleUpload(doc.id)} className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] sm:text-xs transition-colors flex-shrink-0 self-end sm:self-auto ${uploadedDocs[doc.id] ? "bg-[var(--status-green)]/10 text-[var(--status-green)]" : "bg-gold-subtle t-gold hover:bg-[#C5A55A]/20"}`}>
                      {uploadedDocs[doc.id] ? (<><CheckCircle2 size={12} /> {isAr ? 'تم الرفع' : 'Uploaded'}</>) : (<><Upload size={12} /> {isAr ? 'رفع الملف' : 'Upload File'}</>)}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentStep === "declaration" && (
            <div>
              <div className="flex items-center gap-2 mb-4 sm:mb-6">
                <Gavel size={18} className="t-gold" />
                <h3 className="text-sm sm:text-base font-bold t-primary">{isAr ? 'الإقرار القانوني' : 'Legal Declaration'}</h3>
              </div>

              <div className="solid-modal rounded-xl p-4 sm:p-5 mb-4 border border-[var(--status-red)]/10">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle size={14} className="text-[var(--status-red)]/70 flex-shrink-0" />
                  <h4 className="text-xs sm:text-sm font-bold text-[var(--status-red)]/70">{isAr ? 'الشروط والأحكام العامة' : 'General Terms & Conditions'}</h4>
                </div>
                <div className="space-y-2.5 text-xs sm:text-sm t-secondary leading-relaxed">
                  <p>{isAr ? 'بالتسجيل في منصة ماهم إكسبو، يوافق العارض على الالتزام بجميع الشروط والأحكام التالية:' : 'By registering on Maham Expo platform, the exhibitor agrees to comply with all the following terms and conditions:'}</p>
                  <p><strong>1.</strong> {isAr ? 'يلتزم العارض بدفع كامل رسوم الحجز قبل موعد الفعالية بمدة لا تقل عن 30 يومًا.' : 'The exhibitor commits to paying all booking fees at least 30 days before the event date.'}</p>
                  <p><strong>2.</strong> {isAr ? 'في حال الإلغاء قبل 15 يومًا من الفعالية، يتم خصم 50% من قيمة الحجز.' : 'In case of cancellation within 15 days of the event, 50% of the booking value will be deducted.'}</p>
                  <p><strong>3.</strong> {isAr ? 'يمنع منعًا باتًا عرض أو بيع أي منتجات مخالفة للأنظمة واللوائح المعمول بها في المملكة العربية السعودية.' : 'It is strictly prohibited to display or sell any products that violate the regulations and laws in force in the Kingdom of Saudi Arabia.'}</p>
                </div>
              </div>

              <div className="solid-modal rounded-xl p-4 sm:p-5 mb-4 border border-[var(--gold-border)]/10">
                <div className="flex items-center gap-2 mb-3">
                  <Scale size={14} className="t-gold flex-shrink-0" />
                  <h4 className="text-xs sm:text-sm font-bold t-gold">{isAr ? 'الالتزامات والمسؤوليات' : 'Obligations & Responsibilities'}</h4>
                </div>
                <div className="space-y-2.5 text-xs sm:text-sm t-secondary leading-relaxed">
                  <p><strong>4.</strong> {isAr ? 'يلتزم العارض بالحضور والتواجد في الجناح المخصص له طوال أيام الفعالية.' : 'The exhibitor commits to being present at the allocated booth throughout the event days.'}</p>
                  <p><strong>5.</strong> {isAr ? 'يتحمل العارض كامل المسؤولية عن أي أضرار تلحق بالجناح أو المرافق المشتركة.' : 'The exhibitor bears full responsibility for any damage to the booth or shared facilities.'}</p>
                  <p><strong>6.</strong> {isAr ? 'يجب الحصول على جميع التصاريح والتراخيص اللازمة من الجهات الحكومية المختصة.' : 'All necessary permits and licenses must be obtained from the relevant government authorities.'}</p>
                  <p><strong>7.</strong> {isAr ? 'يلتزم العارض بمعايير السلامة والأمان المعتمدة في موقع الفعالية.' : 'The exhibitor commits to the safety and security standards adopted at the event venue.'}</p>
                  <p><strong>8.</strong> {isAr ? 'يمنع استخدام أي مواد قابلة للاشتعال أو مواد خطرة داخل الأجنحة.' : 'The use of any flammable or hazardous materials inside the booths is prohibited.'}</p>
                  <p><strong>9.</strong> {isAr ? 'يلتزم العارض بتسليم الجناح في حالته الأصلية عند انتهاء الفعالية.' : 'The exhibitor commits to returning the booth in its original condition at the end of the event.'}</p>
                  <p><strong>10.</strong> {isAr ? 'يحق لإدارة المعرض تغيير موقع الجناح في حالات الضرورة مع إخطار العارض مسبقًا.' : 'The exhibition management reserves the right to change the booth location in case of necessity with prior notice to the exhibitor.'}</p>
                  <p><strong>11.</strong> {isAr ? 'يلتزم العارض بعدم إحداث أي ضوضاء أو إزعاج يؤثر على العارضين الآخرين.' : 'The exhibitor commits to not causing any noise or disturbance that affects other exhibitors.'}</p>
                </div>
              </div>

              <div className="solid-modal rounded-xl p-4 sm:p-5 mb-4 border border-purple-400/10">
                <div className="flex items-center gap-2 mb-3">
                  <BadgeCheck size={14} className="text-purple-400 flex-shrink-0" />
                  <h4 className="text-xs sm:text-sm font-bold text-purple-400">{isAr ? 'حقوق الملكية الفكرية' : 'Intellectual Property Rights'}</h4>
                </div>
                <div className="space-y-2.5 text-xs sm:text-sm t-secondary leading-relaxed">
                  <p><strong>12.</strong> {isAr ? 'يضمن العارض أن جميع المنتجات والمواد المعروضة لا تنتهك حقوق الملكية الفكرية لأي طرف آخر.' : 'The exhibitor guarantees that all displayed products and materials do not violate the intellectual property rights of any other party.'}</p>
                  <p><strong>13.</strong> {isAr ? 'يتحمل العارض كامل المسؤولية القانونية في حال ثبوت انتهاك حقوق الملكية الفكرية.' : 'The exhibitor bears full legal responsibility if intellectual property rights violation is proven.'}</p>
                  <p><strong>14.</strong> {isAr ? 'يحق لإدارة المعرض إزالة أي منتجات مشتبه بانتهاكها لحقوق الملكية الفكرية فورًا.' : 'The exhibition management reserves the right to immediately remove any products suspected of violating intellectual property rights.'}</p>
                  <p><strong>15.</strong> {isAr ? 'يلتزم العارض بعدم تصوير أو نسخ منتجات العارضين الآخرين دون إذن مسبق.' : 'The exhibitor commits to not photographing or copying other exhibitors products without prior permission.'}</p>
                  <p><strong>16.</strong> {isAr ? 'جميع المحتويات الإعلانية يجب أن تكون أصلية أو مرخصة.' : 'All advertising content must be original or licensed.'}</p>
                </div>
              </div>

              <div className="solid-modal rounded-xl p-4 sm:p-5 mb-4 border border-[var(--status-blue)]/10">
                <div className="flex items-center gap-2 mb-3">
                  <Eye size={14} className="text-[var(--status-blue)] flex-shrink-0" />
                  <h4 className="text-xs sm:text-sm font-bold text-[var(--status-blue)]">{isAr ? 'سياسة الخصوصية' : 'Privacy Policy'}</h4>
                </div>
                <div className="space-y-2.5 text-xs sm:text-sm t-secondary leading-relaxed">
                  <p><strong>17.</strong> {isAr ? 'تلتزم المنصة بحماية البيانات الشخصية للعارضين وفقًا لنظام حماية البيانات الشخصية في المملكة.' : 'The platform commits to protecting exhibitors personal data in accordance with the Personal Data Protection Law in the Kingdom.'}</p>
                  <p><strong>18.</strong> {isAr ? 'لن يتم مشاركة البيانات الشخصية مع أي طرف ثالث دون موافقة مسبقة.' : 'Personal data will not be shared with any third party without prior consent.'}</p>
                  <p><strong>19.</strong> {isAr ? 'يحق للعارض طلب حذف بياناته الشخصية في أي وقت.' : 'The exhibitor has the right to request deletion of their personal data at any time.'}</p>
                  <p><strong>20.</strong> {isAr ? 'يتم تخزين جميع البيانات على خوادم آمنة داخل المملكة العربية السعودية.' : 'All data is stored on secure servers within the Kingdom of Saudi Arabia.'}</p>
                </div>
              </div>

              <div className="solid-modal rounded-xl p-4 sm:p-5 mb-4 border border-[var(--glass-border)]">
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen size={14} className="t-tertiary flex-shrink-0" />
                  <h4 className="text-xs sm:text-sm font-bold t-secondary">{isAr ? 'جدول المخالفات والجزاءات' : 'Violations & Penalties Schedule'}</h4>
                </div>
                <div className="space-y-2.5 text-xs sm:text-sm t-secondary leading-relaxed">
                  <p><strong>21.</strong> {isAr ? 'مخالفة الأنظمة: غرامة مالية تتراوح بين 5,000 - 50,000 ريال حسب نوع المخالفة.' : 'Regulation violation: Fine ranging from 5,000 - 50,000 SAR depending on the type of violation.'}</p>
                  <p><strong>22.</strong> {isAr ? 'عدم الحضور: خصم كامل قيمة الحجز وحظر المشاركة في الفعاليات القادمة لمدة عام.' : 'No-show: Full booking value deduction and ban from participating in upcoming events for one year.'}</p>
                  <p><strong>23.</strong> {isAr ? 'الإضرار بالممتلكات: تحمل كامل تكاليف الإصلاح أو الاستبدال بالإضافة إلى غرامة إدارية.' : 'Property damage: Full repair or replacement costs plus administrative fine.'}</p>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <label className="flex items-start gap-3 p-4 sm:p-5 rounded-xl bg-gold-subtle border-2 border-[var(--gold-border)]/30 cursor-pointer hover:border-[var(--gold-border)] transition-all">
                  <input type="checkbox" checked={agreedAll} onChange={(e) => {
                    setAgreedAll(e.target.checked);
                    setAgreedTerms(e.target.checked);
                    setAgreedPrivacy(e.target.checked);
                    setAgreedIP(e.target.checked);
                    setAgreedPenalty(e.target.checked);
                  }} className="mt-0.5 accent-[#C5A55A] w-5 h-5 flex-shrink-0" />
                  <div>
                    <p className="text-sm sm:text-base t-gold font-bold mb-1">{isAr ? 'أوافق على جميع الشروط' : 'I Agree to All Terms'}</p>
                    <p className="text-[12px] sm:text-xs t-tertiary leading-relaxed">
                      {isRTL
                        ? "بالموافقة على هذا الإقرار، أؤكد اطلاعي الكامل على جميع الشروط والأحكام وسياسة الخصوصية وحقوق الملكية الفكرية وجدول المخالفات والجزاءات المنصوص عليها أعلاه، وأوافق على الالتزام بها جميعاً."
                        : "By agreeing, I confirm that I have fully read and understood all terms & conditions, privacy policy, intellectual property rights, and the violations & penalties schedule stated above, and I agree to comply with all of them."}
                    </p>
                  </div>
                </label>
              </div>

              <div className="bg-[var(--glass-bg)] rounded-xl p-3 sm:p-4 border border-[var(--glass-border)]">
                <div className="flex items-center gap-2 mb-2">
                  <Lock size={12} className="t-gold flex-shrink-0" />
                  <p className="text-[12px] sm:text-xs t-tertiary font-medium">{isAr ? 'التوقيع الرقمي' : 'Digital Signature'}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[12px] sm:text-xs t-muted">
                  <p>{isAr ? 'الاسم الكامل' : 'Full Name'}: <span className="t-secondary">{formData.fullName || "—"}</span></p>
                  <p>{isAr ? 'رقم الهوية' : 'ID Number'}: <span className="t-secondary">{formData.idNumber || "—"}</span></p>
                  <p>{isAr ? 'رقم الجوال' : 'Phone'}: <span className="t-secondary">{formData.phone || "—"}</span></p>
                  <p>{isAr ? 'التاريخ' : 'Date'}: <span className="t-secondary">{new Date().toLocaleDateString("ar-SA")}</span></p>
                  <p>IP: <span className="t-secondary font-['Inter']">{isAr ? 'يُسجّل تلقائيًا' : 'Auto-recorded'}</span></p>
                  <p>{isAr ? 'اسم الشركة' : 'Company Name'}: <span className="t-secondary">{formData.companyName || "—"}</span></p>
                </div>
              </div>
            </div>
          )}

          {currentStep === "complete" && (
            <div className="text-center py-6 sm:py-8">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }}>
                <CheckCircle2 size={56} className="mx-auto text-[var(--status-green)] mb-4" />
              </motion.div>
              <h3 className="text-lg sm:text-xl font-bold t-primary mb-2">{isAr ? 'تم التوثيق بنجاح!' : 'Verification Complete!'}</h3>
              <p className="text-xs sm:text-sm t-tertiary mb-1">{isAr ? 'تم التحقق من حسابك بنجاح. يمكنك الآن حجز الأجنحة في المعارض.' : 'Your account has been verified successfully. You can now book booths at expos.'}</p>
              <div className="flex items-center justify-center gap-2 mt-4">
                <Award size={16} className="t-gold" />
                <span className="text-sm t-gold font-bold">{isAr ? 'تاجر موثّق' : 'Verified Trader'}</span>
              </div>
              <div className="mt-4 p-3 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)] max-w-sm mx-auto">
                <p className="text-[12px] sm:text-xs t-muted">{isAr ? 'سيتم مراجعة مستنداتك خلال 24-48 ساعة عمل' : 'Your documents will be reviewed within 24-48 business hours'}</p>
              </div>
              <button onClick={() => router.push("/dashboard/expos")} className="inline-block mt-6 btn-gold px-6 py-3 rounded-xl text-sm font-bold">
                {isAr ? 'تصفح المعارض الآن' : 'Browse Expos Now'}
              </button>
            </div>
          )}

          {currentStep !== "complete" && (
            <div className="flex items-center justify-between mt-6 sm:mt-8 pt-4 sm:pt-5 border-t border-[var(--glass-border)]">
              <button onClick={handlePrev} disabled={currentIndex === 0} className="flex items-center gap-2 text-xs t-tertiary hover:t-secondary disabled:opacity-20 transition-colors">
                {isRTL ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                {isAr ? 'السابق' : 'Previous'}
              </button>
              <button onClick={handleNext} disabled={currentStep === "declaration" && !allAgreed} className="btn-gold px-5 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm flex items-center gap-2 disabled:opacity-30 font-bold">
                {currentIndex === steps.length - 1 ? (isAr ? 'تأكيد وإكمال' : 'Confirm & Complete') : (isAr ? 'حفظ والتالي' : 'Save & Next')}
                {isRTL ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
