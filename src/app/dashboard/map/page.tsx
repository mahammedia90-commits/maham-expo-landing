'use client';

import { useState, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ZoomIn, ZoomOut, Maximize2, Layers, Scale, Timer,
  Sparkles, X, CheckCircle2
} from 'lucide-react';
import { useLanguageStore } from '@/shared/store/useLanguageStore';
import { toast } from 'sonner';

interface Booth {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zone: string;
  type: 'standard' | 'premium' | 'corner' | 'island';
  status: 'available' | 'reserved' | 'sold';
  area: number;
  price: number;
  pricePerSqm?: number;
  trafficScore?: number;
  amenities?: string[];
}

interface Zone {
  id: string;
  name: string;
  nameEn: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}

const zones: Zone[] = [
  { id: 'A', name: 'المنطقة A — مميزة', nameEn: 'Zone A — Premium', x: 50, y: 50, width: 350, height: 280, color: '#C5A55A' },
  { id: 'B', name: 'المنطقة B — رئيسية', nameEn: 'Zone B — Main', x: 430, y: 50, width: 340, height: 280, color: '#4ADE80' },
  { id: 'C', name: 'المنطقة C — اقتصادية', nameEn: 'Zone C — Economy', x: 800, y: 50, width: 350, height: 280, color: '#60A5FA' },
  { id: 'D', name: 'المنطقة D — فعاليات', nameEn: 'Zone D — Events', x: 50, y: 380, width: 350, height: 270, color: '#F472B6' },
  { id: 'E', name: 'المنطقة E — خدمات', nameEn: 'Zone E — Services', x: 430, y: 380, width: 340, height: 270, color: '#A78BFA' },
  { id: 'F', name: 'المنطقة F — VIP', nameEn: 'Zone F — VIP', x: 800, y: 380, width: 350, height: 270, color: '#FB923C' },
];

function generateBooths(): Booth[] {
  const booths: Booth[] = [];
  const types: Booth['type'][] = ['standard', 'premium', 'corner', 'island'];
  const statuses: Booth['status'][] = ['available', 'available', 'available', 'reserved', 'sold'];
  let counter = 1;

  zones.forEach(zone => {
    const cols = zone.id === 'A' || zone.id === 'F' ? 4 : 5;
    const rows = 3;
    const bw = (zone.width - 40) / cols;
    const bh = (zone.height - 60) / rows;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const type = types[Math.floor(Math.random() * types.length)];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const area = type === 'island' ? 24 : type === 'corner' ? 16 : type === 'premium' ? 12 : 9;
        const basePrice = type === 'island' ? 42000 : type === 'corner' ? 22000 : type === 'premium' ? 15000 : 9000;
        const price = basePrice + Math.floor(Math.random() * 5000);

        booths.push({
          id: `${zone.id}${String(counter).padStart(2, '0')}`,
          x: zone.x + 20 + c * bw,
          y: zone.y + 30 + r * bh,
          width: bw - 6,
          height: bh - 6,
          zone: zone.id,
          type, status, area, price,
          pricePerSqm: Math.round(price / area),
          trafficScore: 60 + Math.floor(Math.random() * 35),
          amenities: type === 'island' ? ['WiFi', 'Power', 'AC', 'Storage'] : type === 'corner' ? ['WiFi', 'Power', 'AC'] : ['WiFi', 'Power'],
        });
        counter++;
      }
    }
  });
  return booths;
}

const HOLD_TIME = 1800;

export default function MapPage() {
  const { language } = useLanguageStore();
  const isAr = language === 'ar';

  const allBooths = useMemo(() => generateBooths(), []);

  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [selected, setSelected] = useState<Booth | null>(null);
  const [hovered, setHovered] = useState<Booth | null>(null);
  const [hoverPos, setHoverPos] = useState({ x: 0, y: 0 });
  const [compareList, setCompareList] = useState<Booth[]>([]);
  const [showCompare, setShowCompare] = useState(false);
  const [filterZone, setFilterZone] = useState('all');
  const [holdTimer, setHoldTimer] = useState(0);
  const [heldBooth, setHeldBooth] = useState<Booth | null>(null);

  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const filteredBooths = useMemo(() =>
    filterZone === 'all' ? allBooths : allBooths.filter(b => b.zone === filterZone)
  , [allBooths, filterZone]);

  const stats = useMemo(() => ({
    total: allBooths.length,
    available: allBooths.filter(b => b.status === 'available').length,
    reserved: allBooths.filter(b => b.status === 'reserved').length,
    sold: allBooths.filter(b => b.status === 'sold').length,
  }), [allBooths]);

  const getColor = useCallback((b: Booth) => {
    if (heldBooth?.id === b.id || selected?.id === b.id) return '#C5A55A';
    if (compareList.some(c => c.id === b.id)) return '#A78BFA';
    if (b.status === 'reserved') return '#F59E0B';
    if (b.status === 'sold') return '#EF4444';
    if (b.type === 'island') return '#A78BFA';
    if (b.type === 'corner') return '#38BDF8';
    if (b.type === 'premium') return '#4ADE80';
    return '#22C55E';
  }, [selected, heldBooth, compareList]);

  const handleBoothClick = useCallback((b: Booth) => {
    if (b.status !== 'available') {
      toast.error(isAr ? 'هذا الجناح غير متاح' : 'This booth is not available');
      return;
    }
    setSelected(b);
  }, [isAr]);

  const holdBooth = useCallback(() => {
    if (!selected) return;
    setHeldBooth(selected);
    setHoldTimer(HOLD_TIME);
    toast.success(isAr ? 'تم حجز الجناح مؤقتا لمدة 30 دقيقة' : 'Booth held for 30 minutes');
    setSelected(null);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setHoldTimer(prev => {
        if (prev <= 1) {
          setHeldBooth(null);
          if (timerRef.current) clearInterval(timerRef.current);
          toast.error(isAr ? 'انتهى وقت الحجز المؤقت' : 'Hold time expired');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [selected, isAr]);

  const confirmBooking = useCallback(() => {
    const booth = heldBooth || selected;
    if (!booth) return;
    toast.success(isAr ? 'تم إرسال طلب الحجز بنجاح!' : 'Booking request submitted!');
    setSelected(null);
    setHeldBooth(null);
    setHoldTimer(0);
    if (timerRef.current) clearInterval(timerRef.current);
  }, [heldBooth, selected, isAr]);

  const toggleCompare = useCallback((b: Booth) => {
    setCompareList(prev =>
      prev.some(c => c.id === b.id)
        ? prev.filter(c => c.id !== b.id)
        : prev.length >= 3 ? (toast.info(isAr ? 'الحد الأقصى 3 أجنحة للمقارنة' : 'Max 3 booths for comparison'), prev) : [...prev, b]
    );
  }, [isAr]);

  const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  const handleMouseDown = (e: React.MouseEvent) => { isDragging.current = true; dragStart.current = { x: e.clientX, y: e.clientY }; };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    setPan(prev => ({ x: prev.x + e.clientX - dragStart.current.x, y: prev.y + e.clientY - dragStart.current.y }));
    dragStart.current = { x: e.clientX, y: e.clientY };
  };
  const handleMouseUp = () => { isDragging.current = false; };

  const legend = [
    { color: '#22C55E', label: isAr ? 'متاح (عادي)' : 'Available (Standard)' },
    { color: '#4ADE80', label: isAr ? 'متاح (مميز)' : 'Available (Premium)' },
    { color: '#38BDF8', label: isAr ? 'متاح (زاوية)' : 'Available (Corner)' },
    { color: '#A78BFA', label: isAr ? 'متاح (جزيرة)' : 'Available (Island)' },
    { color: '#F59E0B', label: isAr ? 'محجوز' : 'Reserved' },
    { color: '#EF4444', label: isAr ? 'مباع' : 'Sold' },
    { color: '#C5A55A', label: isAr ? 'محدد' : 'Selected' },
  ];

  return (
    <div className="space-y-4 pb-20 lg:pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', 'Noto Sans Arabic', serif" }}>
            {isAr ? 'خريطة المعرض' : 'Expo Map'}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isAr ? 'معرض الرياض الدولي للتقنية' : 'Riyadh International Tech Expo'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {compareList.length > 0 && (
            <button onClick={() => setShowCompare(true)} className="px-3 py-1.5 rounded-lg border border-border/50 text-xs flex items-center gap-1 hover:bg-accent/50">
              <Scale className="w-3.5 h-3.5" />
              {isAr ? `مقارنة (${compareList.length})` : `Compare (${compareList.length})`}
            </button>
          )}
          <button onClick={() => setZoom(z => Math.min(z + 0.2, 3))} className="p-2 rounded-lg border border-border/50 hover:bg-accent/50"><ZoomIn className="w-4 h-4" /></button>
          <button onClick={() => setZoom(z => Math.max(z - 0.2, 0.5))} className="p-2 rounded-lg border border-border/50 hover:bg-accent/50"><ZoomOut className="w-4 h-4" /></button>
          <button onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }} className="p-2 rounded-lg border border-border/50 hover:bg-accent/50"><Maximize2 className="w-4 h-4" /></button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: isAr ? 'إجمالي' : 'Total', value: stats.total, color: '#C5A55A' },
          { label: isAr ? 'متاح' : 'Available', value: stats.available, color: '#22C55E' },
          { label: isAr ? 'محجوز' : 'Reserved', value: stats.reserved, color: '#F59E0B' },
          { label: isAr ? 'مباع' : 'Sold', value: stats.sold, color: '#EF4444' },
        ].map((s, i) => (
          <div key={i} className="p-3 rounded-lg bg-card border border-border/50 text-center">
            <p className="text-lg font-bold" style={{ color: s.color }}>{s.value}</p>
            <p className="text-[10px] text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Zone Filter */}
      <div className="flex flex-wrap gap-2">
        <button onClick={() => setFilterZone('all')}
          className={`px-3 py-1.5 rounded-lg text-xs border transition-all flex items-center gap-1 ${filterZone === 'all' ? 'bg-primary/10 text-primary border-primary/30 font-medium' : 'bg-accent/30 text-muted-foreground border-border/30'}`}>
          <Layers className="w-3 h-3" />{isAr ? 'جميع المناطق' : 'All Zones'}
        </button>
        {zones.map(z => (
          <button key={z.id} onClick={() => setFilterZone(z.id)}
            className={`px-3 py-1.5 rounded-lg text-xs border transition-all flex items-center gap-1 ${filterZone === z.id ? 'bg-primary/10 text-primary border-primary/30 font-medium' : 'bg-accent/30 text-muted-foreground border-border/30'}`}>
            <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: z.color }} />
            {isAr ? z.name : z.nameEn}
          </button>
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs">
        {legend.map(l => (
          <div key={l.label} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: l.color }} />
            <span className="text-muted-foreground">{l.label}</span>
          </div>
        ))}
      </div>

      {/* Hold Timer Banner */}
      <AnimatePresence>
        {heldBooth && holdTimer > 0 && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="p-3 rounded-xl bg-[#C5A55A]/10 border border-[#C5A55A]/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Timer className="w-5 h-5 text-[#C5A55A]" />
              <div>
                <p className="text-sm font-medium">{isAr ? `الجناح ${heldBooth.id} محجوز مؤقتا` : `Booth ${heldBooth.id} on hold`}</p>
                <p className="text-xs text-muted-foreground">{isAr ? 'أكمل الحجز قبل انتهاء الوقت' : 'Complete booking before time expires'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-lg font-mono font-bold ${holdTimer < 300 ? 'text-red-400' : 'text-[#C5A55A]'}`}>{formatTime(holdTimer)}</span>
              <button onClick={confirmBooking} className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#C5A55A] to-[#E8D5A3] text-[#0A0A12] text-xs font-semibold">
                {isAr ? 'تأكيد الحجز' : 'Confirm'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Map Canvas */}
      <div
        className="relative rounded-xl bg-card border border-border/50 overflow-hidden"
        style={{ height: 'calc(100vh - 420px)', minHeight: '400px' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => { handleMouseUp(); setHovered(null); }}
      >
        <svg width="100%" height="100%" viewBox="0 0 1200 700"
          style={{ transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`, cursor: isDragging.current ? 'grabbing' : 'grab' }}>
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.3" opacity="0.08" />
            </pattern>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          <rect width="1200" height="700" fill="url(#grid)" />

          {/* Zone outlines */}
          {zones.map(z => {
            const visible = filterZone === 'all' || filterZone === z.id;
            return (
              <g key={z.id} opacity={visible ? 1 : 0.2}>
                <rect x={z.x} y={z.y} width={z.width} height={z.height} rx="8" fill={`${z.color}08`} stroke={z.color} strokeWidth="1.5" strokeDasharray="8 4" opacity="0.6" />
                <text x={z.x + z.width / 2} y={z.y - 8} textAnchor="middle" fill={z.color} fontSize="12" fontWeight="700">
                  {isAr ? z.name : z.nameEn} ({z.id})
                </text>
              </g>
            );
          })}

          {/* Booths */}
          {filteredBooths.map(b => {
            const isSelected = selected?.id === b.id;
            const isHeld = heldBooth?.id === b.id;
            const isCompared = compareList.some(c => c.id === b.id);
            const color = getColor(b);
            return (
              <g key={b.id}
                onClick={() => handleBoothClick(b)}
                onMouseEnter={e => { setHovered(b); setHoverPos({ x: e.clientX, y: e.clientY }); }}
                onMouseLeave={() => setHovered(null)}
                style={{ cursor: b.status === 'available' ? 'pointer' : 'not-allowed' }}>
                <rect
                  x={b.x} y={b.y} width={b.width} height={b.height} rx="4"
                  fill={color}
                  opacity={b.status === 'sold' ? 0.2 : (isSelected || isHeld) ? 0.9 : isCompared ? 0.8 : 0.5}
                  stroke={(isSelected || isHeld) ? '#C5A55A' : isCompared ? '#A78BFA' : 'transparent'}
                  strokeWidth={(isSelected || isHeld) ? 2.5 : isCompared ? 2 : 0}
                  filter={(isSelected || isHeld) ? 'url(#glow)' : undefined}
                />
                <text x={b.x + b.width / 2} y={b.y + b.height / 2 - 5} textAnchor="middle" fill="white" fontSize="9" fontWeight="700">{b.id}</text>
                <text x={b.x + b.width / 2} y={b.y + b.height / 2 + 7} textAnchor="middle" fill="white" fontSize="7" opacity="0.7">{b.area}m</text>
                {b.status === 'available' && b.trafficScore && b.trafficScore > 85 && (
                  <circle cx={b.x + b.width - 5} cy={b.y + 5} r="3" fill="#C5A55A" opacity="0.9" />
                )}
              </g>
            );
          })}

          {/* Entrance */}
          <rect x="560" y="320" width="80" height="40" rx="6" fill="#1a1d27" stroke="#C5A55A" strokeWidth="1" opacity="0.8" />
          <text x="600" y="344" textAnchor="middle" fill="#C5A55A" fontSize="10" fontWeight="600">{isAr ? 'المدخل' : 'Entrance'}</text>
        </svg>
      </div>

      {/* Hover Tooltip */}
      <AnimatePresence>
        {hovered && !selected && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
            className="fixed z-50 p-3 rounded-xl bg-card border border-border/50 shadow-2xl backdrop-blur-xl pointer-events-none"
            style={{ top: hoverPos.y - 120, left: hoverPos.x + 15, maxWidth: 220 }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-sm">{hovered.id}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent/50">{hovered.type}</span>
            </div>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between"><span className="text-muted-foreground">{isAr ? 'المساحة' : 'Area'}</span><span>{hovered.area} m</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">{isAr ? 'السعر' : 'Price'}</span><span className="text-[#C5A55A] font-medium">{hovered.price.toLocaleString()} {isAr ? 'ر.س' : 'SAR'}</span></div>
              {hovered.trafficScore && <div className="flex justify-between"><span className="text-muted-foreground">{isAr ? 'حركة المرور' : 'Traffic'}</span><span className={hovered.trafficScore > 85 ? 'text-green-400' : 'text-muted-foreground'}>{hovered.trafficScore}%</span></div>}
            </div>
            {hovered.status === 'available' && <p className="text-[10px] text-[#C5A55A] mt-2 pt-2 border-t border-border/30">{isAr ? 'انقر للتحديد' : 'Click to select'}</p>}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selected Booth Panel */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-20 lg:bottom-6 start-4 end-4 lg:start-auto lg:end-6 lg:w-96 z-50 p-5 rounded-xl bg-card border border-[#C5A55A]/30 shadow-2xl backdrop-blur-xl"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-bold text-lg">{isAr ? 'الجناح' : 'Booth'} {selected.id}</h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-accent/50 mt-1 inline-block">{selected.type}</span>
              </div>
              <button onClick={() => setSelected(null)} className="p-1 rounded-lg hover:bg-accent/50"><X className="w-4 h-4 text-muted-foreground" /></button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm mb-4">
              <div className="p-2 rounded-lg bg-accent/30"><span className="text-[10px] text-muted-foreground block">{isAr ? 'المنطقة' : 'Zone'}</span><span className="font-medium">{zones.find(z => z.id === selected.zone)?.[isAr ? 'name' : 'nameEn']}</span></div>
              <div className="p-2 rounded-lg bg-accent/30"><span className="text-[10px] text-muted-foreground block">{isAr ? 'المساحة' : 'Area'}</span><span className="font-medium">{selected.area} m</span></div>
              <div className="p-2 rounded-lg bg-accent/30"><span className="text-[10px] text-muted-foreground block">{isAr ? 'حركة المرور' : 'Traffic'}</span><span className="font-medium">{selected.trafficScore || 'N/A'}%</span></div>
              <div className="p-2 rounded-lg bg-accent/30"><span className="text-[10px] text-muted-foreground block">{isAr ? 'سعر/م' : 'Price/m'}</span><span className="font-medium">{selected.pricePerSqm?.toLocaleString() || 'N/A'} {isAr ? 'ر.س' : 'SAR'}</span></div>
            </div>

            {selected.amenities && selected.amenities.length > 0 && (
              <div className="mb-4">
                <span className="text-xs text-muted-foreground block mb-1.5">{isAr ? 'المرافق المتضمنة' : 'Included Amenities'}</span>
                <div className="flex flex-wrap gap-1.5">
                  {selected.amenities.map((a, i) => <span key={i} className="text-[10px] px-2 py-0.5 rounded-full border border-border/50">{a}</span>)}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between mb-4 p-3 rounded-lg bg-[#C5A55A]/5 border border-[#C5A55A]/20">
              <span className="text-sm text-muted-foreground">{isAr ? 'السعر' : 'Price'}</span>
              <span className="text-xl font-bold text-[#C5A55A]">{selected.price.toLocaleString()} {isAr ? 'ر.س' : 'SAR'}</span>
            </div>

            <div className="flex gap-2">
              <button onClick={holdBooth} className="flex-1 px-3 py-2 rounded-lg border border-border/50 text-sm flex items-center justify-center gap-1 hover:bg-accent/50">
                <Timer className="w-4 h-4" />{isAr ? 'حجز مؤقت 30 د' : 'Hold 30min'}
              </button>
              <button onClick={confirmBooking} className="flex-1 px-3 py-2 rounded-lg bg-gradient-to-r from-[#C5A55A] to-[#E8D5A3] text-[#0A0A12] hover:opacity-90 font-semibold text-sm">
                {isAr ? 'احجز الآن' : 'Book Now'}
              </button>
            </div>

            <button onClick={() => toggleCompare(selected)} className="w-full mt-2 text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-1 py-1.5">
              <Scale className="w-3 h-3" />
              {compareList.some(c => c.id === selected.id) ? (isAr ? 'إزالة من المقارنة' : 'Remove from Compare') : (isAr ? 'إضافة للمقارنة' : 'Add to Compare')}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Compare Modal */}
      <AnimatePresence>
        {showCompare && compareList.length > 0 && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-50" onClick={() => setShowCompare(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[95vw] max-w-2xl max-h-[80vh] overflow-auto p-6 rounded-xl bg-card border border-border/50 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <Scale className="w-5 h-5 text-[#C5A55A]" />{isAr ? 'مقارنة الأجنحة' : 'Compare Booths'}
                </h3>
                <button onClick={() => setShowCompare(false)}><X className="w-5 h-5 text-muted-foreground" /></button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="text-start p-2 text-muted-foreground font-medium">{isAr ? 'المعيار' : 'Criteria'}</th>
                      {compareList.map(b => <th key={b.id} className="text-center p-2 font-semibold text-[#C5A55A]">{b.id}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { label: isAr ? 'النوع' : 'Type', getValue: (b: Booth) => b.type },
                      { label: isAr ? 'المنطقة' : 'Zone', getValue: (b: Booth) => zones.find(z => z.id === b.zone)?.[isAr ? 'name' : 'nameEn'] || '' },
                      { label: isAr ? 'المساحة' : 'Area', getValue: (b: Booth) => `${b.area} m` },
                      { label: isAr ? 'السعر' : 'Price', getValue: (b: Booth) => `${b.price.toLocaleString()} ${isAr ? 'ر.س' : 'SAR'}` },
                      { label: isAr ? 'سعر/م' : 'Price/m', getValue: (b: Booth) => `${b.pricePerSqm?.toLocaleString() || 'N/A'} ${isAr ? 'ر.س' : 'SAR'}` },
                      { label: isAr ? 'حركة المرور' : 'Traffic', getValue: (b: Booth) => `${b.trafficScore || 'N/A'}%` },
                    ].map((row, i) => (
                      <tr key={i} className="border-b border-border/30">
                        <td className="p-2 text-muted-foreground">{row.label}</td>
                        {compareList.map(b => <td key={b.id} className="p-2 text-center">{row.getValue(b)}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button onClick={() => { setCompareList([]); setShowCompare(false); }} className="w-full mt-4 px-4 py-2 rounded-lg border border-border/50 text-sm hover:bg-accent/50">
                {isAr ? 'مسح الكل' : 'Clear All'}
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
