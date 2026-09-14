import React, { useState } from 'react';
import { ZONES } from '../data/arenaData';
import { ZoneType } from '../types';
import {
  Users,
  Monitor,
  Check,
  ArrowRight,
  Layers,
  Coffee,
  Zap,
  X,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { sound } from '../utils/sound';
import { motion, AnimatePresence } from 'framer-motion';

interface ZonesShowcaseProps {
  onOpenBooking: (arenaId?: string, zoneId?: string) => void;
  zonesList?: ZoneType[];
}

export const ZonesShowcase: React.FC<ZonesShowcaseProps> = ({ onOpenBooking, zonesList }) => {
  const [expandedZoneId, setExpandedZoneId] = useState<string | null>(null);

  const displayZones = zonesList && zonesList.length >= 6 ? zonesList : ZONES;
  const expandedZone = displayZones.find((z) => z.id === expandedZoneId) || null;

  const handleCardClick = (zone: ZoneType) => {
    sound.playClick();

    // Автосимы → перенаправляем в отдельный блок SIM-RACING (#sim-racing)
    if (zone.id === 'sim-racing') {
      const el = document.getElementById('sim-racing');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    setExpandedZoneId((prev) => (prev === zone.id ? null : zone.id));
  };

  const closeExpanded = () => {
    sound.playClick();
    setExpandedZoneId(null);
  };

  return (
    <section id="zones" className="relative py-8 sm:py-12 bg-transparent overflow-hidden scroll-mt-24">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E32124]/10 border border-[#E32124]/30 text-[#E32124] text-xs font-mono font-bold tracking-wider uppercase mb-3.5">
            <Layers className="w-3.5 h-3.5" />
            Архитектура пространств CyberX Омск
          </div>
          <h2 className="font-display font-black text-3xl sm:text-5xl tracking-tight uppercase text-white">
            ЗОНЫ <span className="text-[#E32124]">//</span> И ЭКСКЛЮЗИВЫ
          </h2>
          <p className="mt-3 text-zinc-400 text-sm sm:text-base leading-relaxed">
            Интерактивная карта игровых пространств. Нажмите на любую зону, чтобы раскрыть детальную спецификацию прямо в окне. При клике на Автосимы — откроется отдельный раздел.
          </p>
        </div>

        {/* Creative Asymmetric Bento Grid (100% Reliable across all viewports) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 lg:gap-5 mb-4">

          {/* 1. PREMIUM — большой вертикальный герой (md: 7 cols) */}
          <div className="col-span-1 md:col-span-12 lg:col-span-7 min-h-[340px] lg:min-h-[380px]">
            <BentoZoneCard
              zone={displayZones[0]}
              isExpanded={expandedZoneId === displayZones[0].id}
              onClick={() => handleCardClick(displayZones[0])}
              accentBadge="ХИТ // ЭКСКЛЮЗИВ ARENA"
              tall
            />
          </div>

          {/* 2. SIM-RACING — открывает отдельный раздел (md: 5 cols) */}
          <div className="col-span-1 md:col-span-12 lg:col-span-5 min-h-[340px] lg:min-h-[380px]">
            <BentoZoneCard
              zone={displayZones[1]}
              isExpanded={false}
              onClick={() => handleCardClick(displayZones[1])}
              accentBadge="MOZA DIRECT DRIVE"
              redirectTo="sim-racing"
            />
          </div>

          {/* 3. SOLO ROOM (md: 4 cols / 6 cols on tablet) */}
          <div className="col-span-1 md:col-span-6 lg:col-span-4 min-h-[260px] lg:min-h-[290px]">
            <BentoZoneCard
              zone={displayZones[3]}
              isExpanded={expandedZoneId === displayZones[3].id}
              onClick={() => handleCardClick(displayZones[3])}
              accentBadge="600HZ BENQ SPEED"
            />
          </div>

          {/* 4. КИНО-ЛАУНЖ (md: 4 cols / 6 cols on tablet) */}
          <div className="col-span-1 md:col-span-6 lg:col-span-4 min-h-[260px] lg:min-h-[290px]">
            <BentoZoneCard
              zone={displayZones[2]}
              isExpanded={expandedZoneId === displayZones[2].id}
              onClick={() => handleCardClick(displayZones[2])}
              accentBadge='150" ЭКРАН + СЦЕНА'
            />
          </div>

          {/* 5. PS5 DELUXE ЗАЛЫ (md: 4 cols / 12 cols on tablet) */}
          <div className="col-span-1 md:col-span-12 lg:col-span-4 min-h-[260px] lg:min-h-[290px]">
            <BentoZoneCard
              zone={displayZones[4]}
              isExpanded={expandedZoneId === displayZones[4].id}
              onClick={() => handleCardClick(displayZones[4])}
              accentBadge="10 ЗАЛОВ // ВСЕ КЛУБЫ"
            />
          </div>

          {/* 6. ОТКРЫТЫЙ ЗАЛ (md: 12 cols) */}
          <div className="col-span-1 md:col-span-12 min-h-[200px] lg:min-h-[220px]">
            <BentoZoneCard
              zone={displayZones[5]}
              isExpanded={expandedZoneId === displayZones[5].id}
              onClick={() => handleCardClick(displayZones[5])}
              accentBadge="182 ИГРОВЫХ ПК В ОМСКЕ"
            />
          </div>

        </div>

      </div>

      {/* Full-Screen Lightbox Modal */}
      <AnimatePresence>
        {expandedZone && (
          <motion.div
            className="fixed inset-0 z-[200] flex items-center justify-center pt-20 pb-4 px-3 sm:px-6 sm:py-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Затемнение фона */}
            <div
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
              onClick={closeExpanded}
            />

            {/* Окно */}
            <motion.div
              key={expandedZone.id}
              initial={{ opacity: 0, scale: 0.92, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 12 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-6xl max-h-[calc(100vh-6rem)] sm:max-h-[88vh] overflow-hidden rounded-2xl sm:rounded-3xl border border-[#E32124]/50 bg-[#0a0a12] shadow-[0_0_80px_rgba(227,33,36,0.35)] flex flex-col z-10"
            >
              <ExpandedZoneModal
                zone={expandedZone}
                onClose={closeExpanded}
                onOpenBooking={onOpenBooking}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

// ===== Expanded Zone Modal (Full-Screen Detail with Pure CSS Double-Buffered Gallery) =====
interface ExpandedZoneModalProps {
  zone: ZoneType;
  onClose: () => void;
  onOpenBooking: (arenaId?: string, zoneId?: string) => void;
}

const ExpandedZoneModal: React.FC<ExpandedZoneModalProps> = ({ zone, onClose, onOpenBooking }) => {
  const gallery = zone.gallery && zone.gallery.length > 0 ? zone.gallery : [zone.image];
  const [activeImage, setActiveImage] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-play slideshow every 4.0 seconds
  React.useEffect(() => {
    if (gallery.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      setActiveImage((prev) => (prev + 1) % gallery.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [gallery.length, isPaused]);

  const next = () => {
    sound.playClick();
    setActiveImage((i) => (i + 1) % gallery.length);
  };
  
  const prev = () => {
    sound.playClick();
    setActiveImage((i) => (i - 1 + gallery.length) % gallery.length);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 w-full h-full overflow-y-auto lg:overflow-hidden">
      {/* Mobile Absolute Close Button */}
      <button
        onClick={onClose}
        className="lg:hidden absolute top-3 right-3 z-30 p-2 rounded-xl bg-black/80 hover:bg-[#E32124] text-white border border-white/20 hover:border-[#E32124] transition-all shadow-xl active:scale-95 cursor-pointer"
        aria-label="Закрыть"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Media Side (Stable Double-Buffered Stack) */}
      <div 
        className="lg:col-span-5 relative min-h-[240px] sm:min-h-[320px] lg:min-h-full bg-black flex flex-col justify-between group/gallery shrink-0"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="absolute inset-0 overflow-hidden bg-black pointer-events-none">
          {gallery.map((imgUrl, idx) => {
            const isActive = idx === activeImage;
            return (
              <div
                key={idx}
                className={`absolute inset-0 transition-opacity duration-600 ease-in-out ${
                  isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                }`}
              >
                <img
                  src={imgUrl}
                  alt={`${zone.name} ${idx + 1}`}
                  className={`w-full h-full object-cover transition-transform duration-[5500ms] ease-out ${
                    isActive ? 'scale-105' : 'scale-100'
                  }`}
                  loading="eager"
                />
              </div>
            );
          })}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#000000] via-[#000000]/40 to-transparent pointer-events-none z-20" />

        {/* Верхние бейджи, счётчик фото и индикатор авто-слайдшоу */}
        <div className="relative z-30 p-4 sm:p-5 flex items-start justify-between gap-2 font-mono pr-12 lg:pr-5">
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-[#000000]/80 border border-white/15 text-xs text-white flex items-center gap-1.5 shadow-md">
              <Users className="w-3.5 h-3.5 text-[#E32124]" />
              {zone.capacity}
            </span>
            {zone.badge && (
              <span className="px-3 py-1.5 rounded-xl bg-[#E32124] text-white text-xs font-bold shadow-lg shadow-red-600/30">
                {zone.badge}
              </span>
            )}
          </div>

          {gallery.length > 1 && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-black/80 border border-white/15 text-xs font-mono text-zinc-300 shrink-0 shadow-md">
              <span className={`w-1.5 h-1.5 rounded-full ${isPaused ? 'bg-zinc-400' : 'bg-[#E32124] animate-ping'}`} />
              <span>{activeImage + 1} / {gallery.length}</span>
            </div>
          )}
        </div>

        {/* Стрелки навигации по галерее */}
        {gallery.length > 1 && (
          <div className="relative z-30 px-3 flex items-center justify-between pointer-events-none">
            <button
              onClick={(e) => { 
                e.stopPropagation(); 
                prev(); 
              }}
              className="p-2.5 rounded-full bg-black/70 hover:bg-[#E32124] text-white border border-white/20 hover:border-[#E32124] transition-all pointer-events-auto active:scale-90 shadow-lg cursor-pointer"
              aria-label="Предыдущее фото"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => { 
                e.stopPropagation(); 
                next(); 
              }}
              className="p-2.5 rounded-full bg-black/70 hover:bg-[#E32124] text-white border border-white/20 hover:border-[#E32124] transition-all pointer-events-auto active:scale-90 shadow-lg cursor-pointer"
              aria-label="Следующее фото"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Нижний ряд миниатюр */}
        {gallery.length > 1 && (
          <div className="relative z-30 p-3 sm:p-4 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
            <div className="flex flex-wrap gap-2">
              {gallery.map((g, i) => (
                <button
                  key={g + i}
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    sound.playClick(); 
                    setActiveImage(i); 
                  }}
                  className={`w-10 sm:w-12 h-10 sm:h-12 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                    i === activeImage 
                      ? 'border-[#E32124] ring-2 ring-[#E32124]/50 scale-105' 
                      : 'border-white/20 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={g} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Информация (Детали и описание) */}
      <div className="lg:col-span-7 p-5 sm:p-8 lg:p-10 flex flex-col lg:max-h-[88vh] lg:overflow-y-auto">
        <div>
          {/* Верхняя строка с кнопкой закрытия (Desktop) */}
          <div className="hidden lg:flex items-center justify-between gap-4 mb-4 pb-3 border-b border-white/[0.08]">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#E32124] flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              Спецификация пространства CyberX
            </span>
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-[#E32124] text-zinc-300 hover:text-white transition-colors text-xs font-mono flex items-center gap-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Свернуть</span>
            </button>
          </div>

          {/* Заголовок и подзаголовок зоны */}
          <div className="mb-5 sm:mb-6">
            <h3 className="text-xl sm:text-3xl lg:text-4xl font-display font-black text-white uppercase tracking-tight">
              {zone.name}
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300 mt-1 font-light">
              {zone.tagline}
            </p>
          </div>

          {/* Описание */}
          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed mb-5 sm:mb-6">
            {zone.description}
          </p>

          {/* Железо */}
          <div className="mb-5 sm:mb-6">
            <span className="text-xs font-mono font-bold tracking-wider text-zinc-300 uppercase block mb-3 flex items-center gap-2">
              <Monitor className="w-3.5 h-3.5 text-[#E32124]" />
              Оснащение и конфигурация:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {zone.hardwareBrief.map((hw, i) => (
                <div key={i} className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs font-mono text-zinc-300 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E32124] shrink-0" />
                  <span className="truncate">{hw}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Особенности */}
          <div className="mb-5 sm:mb-6">
            <span className="text-xs font-mono font-bold tracking-wider text-zinc-300 uppercase block mb-2.5 flex items-center gap-2">
              <Coffee className="w-3.5 h-3.5 text-[#E32124]" />
              Особенности и сервис:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {zone.features.map((feat, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-zinc-400 font-mono">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Цена и CTA */}
        <div className="pt-5 sm:pt-6 border-t border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono mt-auto">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-display font-black text-xl sm:text-2xl text-white">
                {zone.pricePerHour} ₽
              </span>
              <span className="text-xs text-zinc-400">/ час</span>
            </div>
            <div className="text-[11px] text-zinc-400">
              Ночной пакет (10 ч): <span className="text-white font-bold">{zone.priceNight} ₽</span>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playTrigger();
              onOpenBooking(
                zone.id.includes('premium') || zone.id.includes('sim-racing') || zone.id.includes('projector')
                  ? 'cyberx-arena'
                  : undefined,
                zone.id,
              );
            }}
            onMouseEnter={() => sound.playHover()}
            className="py-3 sm:py-3.5 px-6 sm:px-8 rounded-2xl font-mono font-bold text-xs uppercase tracking-[0.15em] sm:tracking-[0.2em] text-white bg-[#E32124] hover:bg-[#FF2A2E] shadow-lg shadow-red-600/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Zap className="w-4 h-4" />
            <span>Забронировать {zone.name.split('//')[0].trim()}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// ===== Bento Zone Card =====
interface BentoZoneCardProps {
  zone: ZoneType;
  className?: string;
  isExpanded?: boolean;
  onClick: () => void;
  accentBadge?: string;
  tall?: boolean;
  redirectTo?: string;
}

const BentoZoneCard: React.FC<BentoZoneCardProps> = ({
  zone,
  isExpanded = false,
  onClick,
  accentBadge,
  tall = false,
  redirectTo,
}) => {
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => sound.playHover()}
      className={`group relative overflow-hidden cursor-pointer rounded-3xl transition-all duration-300 border bg-[#090910] flex flex-col justify-between p-5 sm:p-6 select-none shadow-xl h-full ${
        isExpanded
          ? 'border-[#E32124] ring-1 ring-[#E32124]/60 shadow-[0_0_35px_rgba(227,33,36,0.3)]'
          : 'border-white/[0.08] hover:border-[#E32124]/60 hover:shadow-[0_0_30px_rgba(227,33,36,0.2)]'
      }`}
    >
      {/* Фото фонового слоя */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-[#07070b] pointer-events-none">
        <img
          src={zone.image}
          alt={zone.name}
          className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105 opacity-75 group-hover:opacity-95"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-black/45 to-transparent pointer-events-none" />
      </div>

      {/* Верхние бейджи */}
      <div className="relative z-10 flex items-start justify-between gap-2 font-mono">
        <div className="flex flex-wrap items-center gap-2">
          {accentBadge && (
            /эксклюзив/i.test(accentBadge) ? (
              <span className="badge-gold-shimmer px-2.5 py-1 rounded-lg text-[9px] font-extrabold tracking-wider uppercase shadow-md">
                {accentBadge}
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-lg bg-[#E32124] text-white text-[9px] font-bold tracking-wider uppercase shadow-md shadow-red-600/40">
                {accentBadge}
              </span>
            )
          )}
          {(!accentBadge || !/эксклюзив/i.test(accentBadge)) && (
            /эксклюзив/i.test(zone.category) ? (
              <span className="badge-gold-shimmer px-2.5 py-1 rounded-lg text-[9px] font-extrabold tracking-wider uppercase">
                {zone.category}
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-lg bg-black/80 border border-white/15 text-white text-[9px] font-semibold uppercase">
                {zone.category}
              </span>
            )
          )}
        </div>

        {redirectTo ? (
          <div className="p-2 rounded-xl bg-[#E32124] text-white shadow-md shadow-red-600/40 group-hover:scale-110 transition-transform">
            <ExternalLink className="w-3.5 h-3.5" />
          </div>
        ) : (
          <div className="p-2 rounded-xl bg-black/60 border border-white/15 text-white group-hover:text-[#E32124] group-hover:bg-white transition-all">
            <Maximize2 className="w-3.5 h-3.5" />
          </div>
        )}
      </div>

      {/* Нижний контент и цена */}
      <div className="relative z-10 mt-auto pt-8 font-mono">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <h3 className={`font-display font-black text-white group-hover:text-[#E32124] transition-colors leading-tight uppercase ${tall ? 'text-2xl sm:text-3xl' : 'text-lg sm:text-xl'}`}>
              {zone.name}
            </h3>
            <p className="text-xs text-zinc-300 mt-1 max-w-xl font-light line-clamp-1 sm:line-clamp-2">
              {zone.tagline}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 pt-2 sm:pt-0">
            <div className="text-right">
              <span className="text-[10px] text-zinc-400 uppercase block">Тариф</span>
              <span className="text-base sm:text-lg font-display font-black text-white">
                {zone.pricePerHour} ₽ <span className="text-[10px] font-normal text-zinc-400">/ час</span>
              </span>
            </div>

            <div className={`px-3.5 py-2 rounded-xl font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md ${
              redirectTo
                ? 'bg-[#E32124] text-white'
                : isExpanded
                  ? 'bg-[#E32124] text-white'
                  : 'bg-white/10 group-hover:bg-[#E32124] text-white'
            }`}>
              {redirectTo ? (
                <>
                  <span>Открыть раздел</span>
                  <ExternalLink className="w-3 h-3" />
                </>
              ) : (
                <>
                  <span>{isExpanded ? 'Закрыть' : 'Обзор'}</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
