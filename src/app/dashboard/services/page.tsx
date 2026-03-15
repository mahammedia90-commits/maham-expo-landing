'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Paintbrush, Zap, Truck, Megaphone, Coffee, Camera, Languages,
  Shield, Warehouse, Printer, Search, ShoppingCart, Plus, Minus,
  Star, Clock, Package, X, Sparkles, CheckCircle2
} from 'lucide-react';
import { useLanguageStore } from '@/shared/store/useLanguageStore';
import { toast } from 'sonner';

interface Service {
  id: string;
  category: string;
  nameAr: string;
  nameEn: string;
  descAr: string;
  descEn: string;
  price: number;
  unitAr: string;
  unitEn: string;
  rating: number;
  deliveryDays: number;
  isPopular?: boolean;
}

interface CartItem {
  serviceId: string;
  name: string;
  price: number;
  unit: string;
  quantity: number;
}

const categories = [
  { id: 'design', nameAr: 'تصميم وبناء البوث', nameEn: 'Booth Design & Build', icon: Paintbrush },
  { id: 'utilities', nameAr: 'الكهرباء والمرافق', nameEn: 'Electricity & Utilities', icon: Zap },
  { id: 'logistics', nameAr: 'اللوجستيات والشحن', nameEn: 'Logistics & Shipping', icon: Truck },
  { id: 'marketing', nameAr: 'التسويق والإعلان', nameEn: 'Marketing & Advertising', icon: Megaphone },
  { id: 'hospitality', nameAr: 'الضيافة والكاترنج', nameEn: 'Hospitality & Catering', icon: Coffee },
  { id: 'photography', nameAr: 'التصوير والفيديو', nameEn: 'Photography & Video', icon: Camera },
  { id: 'translation', nameAr: 'الترجمة والمضيفين', nameEn: 'Translation & Hosts', icon: Languages },
  { id: 'insurance', nameAr: 'التأمين والتراخيص', nameEn: 'Insurance & Permits', icon: Shield },
  { id: 'storage', nameAr: 'التخزين والمستودعات', nameEn: 'Storage & Warehousing', icon: Warehouse },
  { id: 'printing', nameAr: 'الطباعة والإنتاج', nameEn: 'Printing & Production', icon: Printer },
];

const services: Service[] = [
  // design
  { id: 'd1', category: 'design', nameAr: 'تصميم بوث ثلاثي الأبعاد', nameEn: '3D Booth Design', descAr: 'تصميم احترافي ثلاثي الأبعاد مع تصورات واقعية', descEn: 'Professional 3D design with realistic renders', price: 5000, unitAr: 'تصميم', unitEn: 'design', rating: 4.9, deliveryDays: 5, isPopular: true },
  { id: 'd2', category: 'design', nameAr: 'بناء بوث مخصص', nameEn: 'Custom Booth Build', descAr: 'بناء وتركيب بوث كامل حسب التصميم المعتمد', descEn: 'Full booth construction per approved design', price: 15000, unitAr: 'بوث', unitEn: 'booth', rating: 4.8, deliveryDays: 10 },
  { id: 'd3', category: 'design', nameAr: 'أثاث معرضي فاخر', nameEn: 'Premium Exhibition Furniture', descAr: 'طاولات وكراسي وأرفف عرض فاخرة', descEn: 'Premium tables, chairs and display shelves', price: 3500, unitAr: 'طقم', unitEn: 'set', rating: 4.7, deliveryDays: 3 },
  { id: 'd4', category: 'design', nameAr: 'إضاءة LED متقدمة', nameEn: 'Advanced LED Lighting', descAr: 'نظام إضاءة LED ذكي مع تحكم بالألوان', descEn: 'Smart LED lighting system with color control', price: 2500, unitAr: 'نظام', unitEn: 'system', rating: 4.6, deliveryDays: 2, isPopular: true },
  // utilities
  { id: 'u1', category: 'utilities', nameAr: 'توصيل كهرباء 220 فولت', nameEn: '220V Power Connection', descAr: 'توصيل كهربائي قياسي مع مقابس متعددة', descEn: 'Standard power connection with multiple outlets', price: 800, unitAr: 'توصيلة', unitEn: 'connection', rating: 4.5, deliveryDays: 1 },
  { id: 'u2', category: 'utilities', nameAr: 'إنترنت فائق السرعة', nameEn: 'High-Speed Internet', descAr: 'إنترنت فايبر مخصص بسرعة عالية', descEn: 'Dedicated fiber internet high-speed', price: 1200, unitAr: 'اشتراك', unitEn: 'subscription', rating: 4.4, deliveryDays: 1, isPopular: true },
  { id: 'u3', category: 'utilities', nameAr: 'مكيف هواء إضافي', nameEn: 'Extra AC Unit', descAr: 'وحدة تكييف إضافية لتبريد الجناح', descEn: 'Additional AC unit for booth cooling', price: 1500, unitAr: 'وحدة', unitEn: 'unit', rating: 4.3, deliveryDays: 1 },
  // logistics
  { id: 'l1', category: 'logistics', nameAr: 'نقل وشحن المعدات', nameEn: 'Equipment Transport', descAr: 'نقل وتوصيل المعدات من وإلى المعرض', descEn: 'Equipment transport to and from venue', price: 2000, unitAr: 'رحلة', unitEn: 'trip', rating: 4.6, deliveryDays: 2 },
  { id: 'l2', category: 'logistics', nameAr: 'تركيب وتفكيك', nameEn: 'Setup & Dismantling', descAr: 'فريق متخصص لتركيب وتفكيك البوث', descEn: 'Specialized team for booth setup & dismantling', price: 3000, unitAr: 'خدمة', unitEn: 'service', rating: 4.7, deliveryDays: 1, isPopular: true },
  { id: 'l3', category: 'logistics', nameAr: 'خدمة الاستقبال', nameEn: 'Reception Service', descAr: 'موظفي استقبال وتوجيه للزوار', descEn: 'Reception staff for visitor guidance', price: 1800, unitAr: 'يوم', unitEn: 'day', rating: 4.5, deliveryDays: 1 },
  // marketing
  { id: 'm1', category: 'marketing', nameAr: 'إعلان رقمي', nameEn: 'Digital Advertising', descAr: 'حملة إعلانية رقمية على منصات التواصل', descEn: 'Digital ad campaign on social media', price: 4000, unitAr: 'حملة', unitEn: 'campaign', rating: 4.8, deliveryDays: 3, isPopular: true },
  { id: 'm2', category: 'marketing', nameAr: 'هدايا ترويجية', nameEn: 'Promotional Gifts', descAr: 'هدايا مخصصة بشعار الشركة', descEn: 'Custom branded promotional gifts', price: 2500, unitAr: 'طقم', unitEn: 'set', rating: 4.5, deliveryDays: 7 },
  { id: 'm3', category: 'marketing', nameAr: 'شاشة عرض رقمية', nameEn: 'Digital Display Screen', descAr: 'شاشة عرض تفاعلية 55-85 بوصة', descEn: 'Interactive display screen 55-85 inch', price: 1500, unitAr: 'شاشة', unitEn: 'screen', rating: 4.6, deliveryDays: 1 },
  // hospitality
  { id: 'h1', category: 'hospitality', nameAr: 'ضيافة VIP', nameEn: 'VIP Hospitality', descAr: 'قهوة وحلويات ومشروبات فاخرة', descEn: 'Premium coffee, pastries & beverages', price: 2000, unitAr: 'يوم', unitEn: 'day', rating: 4.9, deliveryDays: 1, isPopular: true },
  { id: 'h2', category: 'hospitality', nameAr: 'بوفيه غداء', nameEn: 'Lunch Buffet', descAr: 'بوفيه غداء متنوع للفريق والزوار', descEn: 'Diverse lunch buffet for team and visitors', price: 3500, unitAr: 'يوم', unitEn: 'day', rating: 4.7, deliveryDays: 1 },
  { id: 'h3', category: 'hospitality', nameAr: 'طاقم ضيافة', nameEn: 'Hospitality Staff', descAr: 'فريق ضيافة محترف لخدمة الزوار', descEn: 'Professional hospitality team', price: 1200, unitAr: 'شخص/يوم', unitEn: 'person/day', rating: 4.6, deliveryDays: 1 },
  // photography
  { id: 'p1', category: 'photography', nameAr: 'تصوير احترافي', nameEn: 'Professional Photography', descAr: 'تصوير فوتوغرافي احترافي للجناح والفعاليات', descEn: 'Professional photography for booth and events', price: 3000, unitAr: 'يوم', unitEn: 'day', rating: 4.8, deliveryDays: 1, isPopular: true },
  { id: 'p2', category: 'photography', nameAr: 'إنتاج فيديو', nameEn: 'Video Production', descAr: 'تصوير وإنتاج فيديو ترويجي', descEn: 'Promotional video shooting and production', price: 5000, unitAr: 'فيديو', unitEn: 'video', rating: 4.7, deliveryDays: 5 },
  { id: 'p3', category: 'photography', nameAr: 'بث مباشر', nameEn: 'Live Streaming', descAr: 'بث مباشر للفعاليات على منصات التواصل', descEn: 'Live streaming events on social media', price: 4000, unitAr: 'يوم', unitEn: 'day', rating: 4.5, deliveryDays: 1 },
  // translation
  { id: 't1', category: 'translation', nameAr: 'مترجم فوري', nameEn: 'Simultaneous Interpreter', descAr: 'مترجم فوري محترف عربي-إنجليزي', descEn: 'Professional Arabic-English interpreter', price: 2500, unitAr: 'يوم', unitEn: 'day', rating: 4.8, deliveryDays: 1 },
  { id: 't2', category: 'translation', nameAr: 'مقدم فعاليات', nameEn: 'Event MC', descAr: 'مقدم فعاليات محترف ثنائي اللغة', descEn: 'Professional bilingual event MC', price: 3000, unitAr: 'يوم', unitEn: 'day', rating: 4.7, deliveryDays: 1 },
  { id: 't3', category: 'translation', nameAr: 'مضيفات المعرض', nameEn: 'Exhibition Hostesses', descAr: 'فريق مضيفات محترفات للاستقبال', descEn: 'Professional hostess team for reception', price: 1500, unitAr: 'شخص/يوم', unitEn: 'person/day', rating: 4.6, deliveryDays: 1, isPopular: true },
  // insurance
  { id: 'i1', category: 'insurance', nameAr: 'تأمين شامل', nameEn: 'Comprehensive Insurance', descAr: 'تأمين شامل للمعدات والممتلكات', descEn: 'Full insurance for equipment and property', price: 1000, unitAr: 'بوليصة', unitEn: 'policy', rating: 4.5, deliveryDays: 2 },
  { id: 'i2', category: 'insurance', nameAr: 'تراخيص تجارية', nameEn: 'Business Permits', descAr: 'استخراج التراخيص والتصاريح التجارية', descEn: 'Business permits and licenses processing', price: 1500, unitAr: 'ترخيص', unitEn: 'permit', rating: 4.4, deliveryDays: 5 },
  { id: 'i3', category: 'insurance', nameAr: 'تأمين مسؤولية مدنية', nameEn: 'Liability Insurance', descAr: 'تأمين المسؤولية المدنية تجاه الزوار', descEn: 'Civil liability insurance for visitors', price: 800, unitAr: 'بوليصة', unitEn: 'policy', rating: 4.3, deliveryDays: 2 },
  // storage
  { id: 's1', category: 'storage', nameAr: 'مستودع مكيف', nameEn: 'Climate-Controlled Storage', descAr: 'تخزين مكيف للمواد والمعدات', descEn: 'Climate-controlled storage for materials', price: 500, unitAr: 'م²/شهر', unitEn: 'm²/month', rating: 4.5, deliveryDays: 1 },
  { id: 's2', category: 'storage', nameAr: 'خزن مؤقت', nameEn: 'Temporary Storage', descAr: 'تخزين مؤقت خلال فترة المعرض', descEn: 'Temporary storage during expo period', price: 300, unitAr: 'م²/يوم', unitEn: 'm²/day', rating: 4.4, deliveryDays: 1 },
  { id: 's3', category: 'storage', nameAr: 'نقل من المستودع', nameEn: 'Warehouse Delivery', descAr: 'نقل المواد من المستودع للمعرض', descEn: 'Material transport from warehouse to venue', price: 800, unitAr: 'رحلة', unitEn: 'trip', rating: 4.3, deliveryDays: 1 },
  // printing
  { id: 'pr1', category: 'printing', nameAr: 'طباعة بانرات', nameEn: 'Banner Printing', descAr: 'طباعة بانرات عالية الجودة بمقاسات مختلفة', descEn: 'High-quality banner printing in various sizes', price: 500, unitAr: 'بانر', unitEn: 'banner', rating: 4.6, deliveryDays: 3 },
  { id: 'pr2', category: 'printing', nameAr: 'بروشورات ومطبوعات', nameEn: 'Brochures & Print', descAr: 'طباعة بروشورات وكتالوجات ومطبوعات', descEn: 'Brochures, catalogs and print materials', price: 1200, unitAr: '1000 نسخة', unitEn: '1000 copies', rating: 4.5, deliveryDays: 5, isPopular: true },
  { id: 'pr3', category: 'printing', nameAr: 'بطاقات أعمال', nameEn: 'Business Cards', descAr: 'بطاقات أعمال فاخرة مع تصميم مخصص', descEn: 'Premium business cards with custom design', price: 300, unitAr: '500 بطاقة', unitEn: '500 cards', rating: 4.4, deliveryDays: 3 },
];

export default function ServicesPage() {
  const { language, isRtl } = useLanguageStore();
  const isAr = language === 'ar';

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [showCart, setShowCart] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);

  const filtered = useMemo(() =>
    services.filter(s => {
      const text = (isAr ? s.nameAr : s.nameEn).toLowerCase().includes(searchQuery.toLowerCase()) ||
        (isAr ? s.descAr : s.descEn).toLowerCase().includes(searchQuery.toLowerCase());
      const cat = activeCategory === 'all' || s.category === activeCategory;
      return text && cat;
    }), [searchQuery, activeCategory, isAr]);

  const cartTotal = cart.reduce((a, b) => a + b.price * b.quantity, 0);
  const cartCount = cart.reduce((a, b) => a + b.quantity, 0);
  const isInCart = (id: string) => cart.some(c => c.serviceId === id);

  const addToCart = (s: Service) => {
    const existing = cart.find(c => c.serviceId === s.id);
    if (existing) {
      setCart(cart.map(c => c.serviceId === s.id ? { ...c, quantity: c.quantity + 1 } : c));
    } else {
      setCart([...cart, { serviceId: s.id, name: isAr ? s.nameAr : s.nameEn, price: s.price, unit: isAr ? s.unitAr : s.unitEn, quantity: 1 }]);
    }
    toast.success(isAr ? 'تمت الإضافة للسلة' : 'Added to cart');
  };

  const updateQuantity = (id: string, qty: number) => {
    if (qty <= 0) {
      setCart(cart.filter(c => c.serviceId !== id));
    } else {
      setCart(cart.map(c => c.serviceId === id ? { ...c, quantity: qty } : c));
    }
  };

  const removeFromCart = (id: string) => setCart(cart.filter(c => c.serviceId !== id));
  const clearCart = () => setCart([]);

  return (
    <div className="space-y-5 pb-20 lg:pb-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', 'Noto Sans Arabic', serif" }}>
            {isAr ? 'خدمات العارضين' : 'Exhibitor Services'}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isAr ? `${services.length} خدمة متاحة في ${categories.length} فئة` : `${services.length} services in ${categories.length} categories`}
          </p>
        </div>
        <button
          onClick={() => setShowCart(!showCart)}
          className="relative px-4 py-2 rounded-lg text-sm border border-border/50 bg-card hover:bg-accent/50 transition-all flex items-center gap-2"
        >
          <ShoppingCart className="w-4 h-4" />
          {isAr ? 'السلة' : 'Cart'}
          {cartCount > 0 && (
            <span className="absolute -top-2 -end-2 w-5 h-5 rounded-full bg-[#C5A55A] text-[#0A0A12] text-[10px] font-bold flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>
      </div>

      {/* Cart Sidebar */}
      <AnimatePresence>
        {showCart && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className="p-5 rounded-xl bg-card border border-[#C5A55A]/20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4 text-[#C5A55A]" />
                  {isAr ? 'السلة' : 'Cart'} ({cartCount})
                </h3>
                {cart.length > 0 && (
                  <button onClick={clearCart} className="text-xs text-destructive hover:underline">
                    {isAr ? 'مسح الكل' : 'Clear All'}
                  </button>
                )}
              </div>

              {cart.length === 0 ? (
                <div className="p-6 text-center">
                  <Package className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">{isAr ? 'السلة فارغة' : 'Cart is empty'}</p>
                </div>
              ) : (
                <>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {cart.map(item => (
                      <div key={item.serviceId} className="flex items-center justify-between text-sm p-3 rounded-lg bg-accent/30">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{item.name}</p>
                          <p className="text-xs text-muted-foreground">{item.price.toLocaleString()} {isAr ? 'ر.س' : 'SAR'} / {item.unit}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button onClick={() => updateQuantity(item.serviceId, item.quantity - 1)} className="w-6 h-6 rounded-md bg-accent flex items-center justify-center hover:bg-accent/80">
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center font-medium">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.serviceId, item.quantity + 1)} className="w-6 h-6 rounded-md bg-accent flex items-center justify-center hover:bg-accent/80">
                            <Plus className="w-3 h-3" />
                          </button>
                          <span className="text-[#C5A55A] font-bold w-20 text-end">{(item.price * item.quantity).toLocaleString()}</span>
                          <button onClick={() => removeFromCart(item.serviceId)}>
                            <X className="w-4 h-4 text-destructive" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-border/30">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-muted-foreground">{isAr ? 'المجموع الفرعي' : 'Subtotal'}</span>
                      <span>{cartTotal.toLocaleString()} {isAr ? 'ر.س' : 'SAR'}</span>
                    </div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-muted-foreground">{isAr ? 'ضريبة القيمة المضافة (15%)' : 'VAT (15%)'}</span>
                      <span>{Math.round(cartTotal * 0.15).toLocaleString()} {isAr ? 'ر.س' : 'SAR'}</span>
                    </div>
                    <div className="flex items-center justify-between font-bold text-lg mt-2 pt-2 border-t border-border/30">
                      <span>{isAr ? 'الإجمالي' : 'Total'}</span>
                      <span className="text-[#C5A55A]">{Math.round(cartTotal * 1.15).toLocaleString()} {isAr ? 'ر.س' : 'SAR'}</span>
                    </div>
                    <button
                      className="w-full mt-3 py-2.5 rounded-lg bg-gradient-to-r from-[#C5A55A] to-[#E8D5A3] text-[#0A0A12] hover:opacity-90 font-semibold text-sm"
                      onClick={() => { toast.success(isAr ? 'تم إرسال طلب عرض السعر بنجاح' : 'Quote request sent successfully'); clearCart(); setShowCart(false); }}
                    >
                      {isAr ? 'طلب عرض سعر' : 'Request Quote'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute top-1/2 -translate-y-1/2 start-3 w-4 h-4 text-muted-foreground" />
        <input
          placeholder={isAr ? 'ابحث عن خدمة...' : 'Search services...'}
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full ps-10 pe-4 py-2.5 rounded-lg bg-card border border-border/50 text-sm focus:outline-none focus:border-[#C5A55A]/50"
        />
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-all border ${activeCategory === 'all' ? 'bg-[#C5A55A]/10 text-[#C5A55A] border-[#C5A55A]/30 font-medium' : 'bg-accent/30 text-muted-foreground border-border/30'}`}
        >
          {isAr ? 'الكل' : 'All'} ({services.length})
        </button>
        {categories.map(cat => {
          const count = services.filter(s => s.category === cat.id).length;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-all border flex items-center gap-1.5 ${activeCategory === cat.id ? 'bg-[#C5A55A]/10 text-[#C5A55A] border-[#C5A55A]/30 font-medium' : 'bg-accent/30 text-muted-foreground border-border/30'}`}
            >
              <cat.icon className="w-3.5 h-3.5" />
              {isAr ? cat.nameAr : cat.nameEn} ({count})
            </button>
          );
        })}
      </div>

      <p className="text-xs text-muted-foreground">
        {isAr ? `عرض ${filtered.length} خدمة` : `Showing ${filtered.length} services`}
      </p>

      {/* Services Grid */}
      {filtered.length === 0 ? (
        <div className="p-12 rounded-xl bg-card border border-border/50 text-center">
          <Search className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">{isAr ? 'لا توجد خدمات مطابقة' : 'No matching services'}</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              whileHover={{ y: -3 }}
              className="p-4 rounded-xl bg-card border border-border/50 hover:border-[#C5A55A]/30 transition-all group"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-sm truncate">{isAr ? s.nameAr : s.nameEn}</h3>
                    {s.isPopular && (
                      <span className="bg-[#C5A55A]/10 text-[#C5A55A] text-[10px] border-0 shrink-0 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                        <Sparkles className="w-2.5 h-2.5" />
                        {isAr ? 'شائع' : 'Popular'}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">{isAr ? s.descAr : s.descEn}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs text-muted-foreground my-3">
                <span className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  {s.rating}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {s.deliveryDays} {isAr ? 'أيام' : 'days'}
                </span>
                {isInCart(s.id) && (
                  <span className="flex items-center gap-1 text-green-400">
                    <CheckCircle2 className="w-3 h-3" />
                    {isAr ? 'في السلة' : 'In cart'}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border/30">
                <div>
                  <span className="text-lg font-bold text-[#C5A55A]">{s.price.toLocaleString()}</span>
                  <span className="text-xs text-muted-foreground ms-1">{isAr ? 'ر.س' : 'SAR'} / {isAr ? s.unitAr : s.unitEn}</span>
                </div>
                <button
                  onClick={() => addToCart(s)}
                  className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#C5A55A] to-[#E8D5A3] text-[#0A0A12] hover:opacity-90 text-xs font-semibold flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  {isAr ? 'أضف للسلة' : 'Add to Cart'}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
