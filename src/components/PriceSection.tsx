import React, { useState } from 'react';
import { 
  Monitor, 
  Crown, 
  Flame, 
  Tv, 
  Gamepad2, 
  Gauge, 
  Clock, 
  Moon, 
  Sun, 
  Coffee, 
  CheckCircle2, 
  ChevronRight, 
  ShieldCheck, 
  Filter, 
  Users, 
  Zap 
} from 'lucide-react';
import { ARENAS, DEFAULT_PRICES } from '../data/arenaData';
import { AllPricesData } from '../types';
import { sound } from '../utils/sound';

interface PriceSectionProps {
  prices?: AllPricesData;
  onOpenBooking: (arenaId?: string, zoneId?: string) => void;
}

const getCategoryIcon = (iconType?: string) => {
  switch (iconType) {
    case 'Monitor': return <Monitor className="w-5 h-5 text-zinc-300" />;
    case 'Zap': return <Zap className="w-5 h-5 text-[#E32124]" />;
    case 'Crown': return <Crown className="w-5 h-5 text-amber-400" />;
    case 'Flame': return <Flame className="w-5 h-5 text-[#E32124]" />;
    case 'ShieldCheck': return <ShieldCheck className="w-5 h-5 text-emerald-400" />;
    case 'Gauge': return <Gauge className="w-5 h-5 text-[#E32124]" />;
    case 'Tv': return <Tv className="w-5 h-5 text-blue-400" />;
    case 'Users': return <Users className="w-5 h-5 text-red-400" />;
    case 'Gamepad2': return <Gamepad2 className="w-5 h-5 text-purple-400" />;
    case 'Coffee': return <Coffee className="w-5 h-5 text-orange-400" />;
    default: return <Monitor className="w-5 h-5 text-zinc-300" />;
  }
};

const getRowIcon = (filterKey?: string) => {
  switch (filterKey) {
    case 'morning': return <Sun className="w-3.5 h-3.5 text-amber-400 shrink-0" />;
    case '1h': return <Clock className="w-3.5 h-3.5 text-zinc-400 shrink-0" />;
    case '3h': return <Zap className="w-3.5 h-3.5 text-red-400 shrink-0" />;
    case '5h': return <Flame className="w-3.5 h-3.5 text-[#E32124]" />;
    case 'night': return <Moon className="w-3.5 h-3.5 text-indigo-400 shrink-0" />;
    default: return <Clock className="w-3.5 h-3.5 text-zinc-400 shrink-0" />;
  }
};

export const PriceSection: React.FC<PriceSectionProps> = ({ prices = DEFAULT_PRICES, onOpenBooking }) => {
  const [selectedArenaId, setSelectedArenaId] = useState<string>('cyberx-arena');
  const [activeTab, setActiveTab] = useState<'pc' | 'lounge'>('pc');
  const [selectedTimeFilter, setSelectedTimeFilter] = useState<'all' | 'morning' | '1h' | '3h' | '5h' | 'night'>('all');
  
  // Spotlight focus state (Dims other cards when hovering one card)
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);

  const currentClubPrices = prices[selectedArenaId] || DEFAULT_PRICES[selectedArenaId] || DEFAULT_PRICES['cyberx-arena'];
  const currentPCCategories = currentClubPrices.pc || [];
  const currentLoungeCategories = currentClubPrices.lounge || [];
  const displayedCategories = activeTab === 'pc' ? currentPCCategories : currentLoungeCategories;

  return (
    <section id="pricing" className="relative py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-24 select-none">

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E32124]/10 border border-[#E32124]/30 text-[#E32124] text-xs font-mono uppercase tracking-widest mb-3">
          <Clock className="w-3.5 h-3.5 text-[#E32124]" />
          <span>ПРОЗРАЧНЫЕ ТАРИФЫ // 24/7 БРОНИРОВАНИЕ</span>
        </div>
        <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl tracking-tight uppercase text-white">
          ПРАЙС-<span className="text-[#E32124] drop-shadow-[0_0_20px_rgba(227,33,36,0.6)]">ЛИСТ</span> АРЕН
        </h2>
        <p className="mt-2 text-zinc-400 text-sm sm:text-base">
          Честные цены без скрытых доплат. Выберите интересующий клуб и категорию.
        </p>
      </div>

      {/* 1. Arena Switcher Tabs (Европа, Ленина, Октябрь) */}
      <div className="flex justify-center mb-5">
        <div className="inline-flex p-1.5 rounded-2xl bg-[#0B0B12] border border-white/10 shadow-2xl max-w-full overflow-x-auto">
          {ARENAS.map((arena) => {
            const isSelected = selectedArenaId === arena.id;
            return (
              <button
                key={arena.id}
                onClick={() => {
                  sound.playClick();
                  setHoveredCardId(null);
                  setSelectedArenaId(arena.id);
                }}
                onMouseEnter={() => sound.playHover()}
                className={`px-4 sm:px-6 py-2 rounded-xl font-mono text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors duration-150 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-[#E32124] text-white shadow-[0_0_25px_rgba(227,33,36,0.7)]'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>{arena.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Sub-Category Tabs & Quick Time Filter Toolbar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 mb-6 bg-[#07070d]/90 border border-white/10 p-2.5 sm:p-3 rounded-2xl backdrop-blur-md">
        
        {/* Category Switcher */}
        <div className="inline-flex p-1 rounded-xl bg-black/50 border border-white/10 w-full md:w-auto justify-center">
          <button
            onClick={() => {
              sound.playClick();
              setHoveredCardId(null);
              setActiveTab('pc');
            }}
            onMouseEnter={() => sound.playHover()}
            className={`px-4 py-2 rounded-lg font-mono text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors duration-150 flex items-center gap-2 cursor-pointer ${
              activeTab === 'pc'
                ? 'bg-[#E32124] text-white shadow-md shadow-red-600/30 font-extrabold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Monitor className="w-4 h-4" />
            <span>ПК ЗОНЫ ({currentPCCategories.length})</span>
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setHoveredCardId(null);
              setActiveTab('lounge');
            }}
            onMouseEnter={() => sound.playHover()}
            className={`px-4 py-2 rounded-lg font-mono text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors duration-150 flex items-center gap-2 cursor-pointer ${
              activeTab === 'lounge'
                ? 'bg-[#E32124] text-white shadow-md shadow-red-600/30 font-extrabold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Gauge className="w-4 h-4" />
            <span>LOUNGE & СИМУЛЯТОРЫ ({currentLoungeCategories.length})</span>
          </button>
        </div>

        {/* Quick Spotlight / Time Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          <span className="text-[11px] font-mono font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1 mr-1 shrink-0">
            <Filter className="w-3.5 h-3.5 text-[#E32124]" />
            <span>Фокус:</span>
          </span>

          {[
            { id: 'all', label: 'Все' },
            { id: 'morning', label: '🌅 Утро' },
            { id: '1h', label: '⚡ 1 Час' },
            { id: '3h', label: '✨ 3 Часа' },
            { id: '5h', label: '🔥 5 Часов' },
            { id: 'night', label: '🌙 Ночь' }
          ].map((filter) => {
            const isFilterActive = selectedTimeFilter === filter.id;
            return (
              <button
                key={filter.id}
                onClick={() => {
                  sound.playClick();
                  setSelectedTimeFilter(isFilterActive && filter.id !== 'all' ? 'all' : filter.id as typeof selectedTimeFilter);
                }}
                onMouseEnter={() => sound.playHover()}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-semibold transition-colors duration-150 shrink-0 cursor-pointer border ${
                  isFilterActive
                    ? 'bg-white/20 text-white border-white/40 shadow-sm ring-1 ring-white/30'
                    : 'bg-white/[0.03] text-zinc-400 border-white/5 hover:text-white hover:bg-white/[0.07]'
                }`}
              >
                {filter.label}
              </button>
            );
          })}
        </div>

      </div>

      {/* 3. High-Performance GPU Spotlight Price Grid with Sibling Dimming for Focus */}
      <div 
        onMouseLeave={() => setHoveredCardId(null)}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {displayedCategories.map((category) => {
          const isThisCardHovered = hoveredCardId === category.id;
          const hasCardHover = hoveredCardId !== null;
          const cardDimmed = hasCardHover && !isThisCardHovered;

          return (
            <div
              key={category.id}
              onMouseEnter={() => {
                sound.playHover();
                setHoveredCardId(category.id);
              }}
              className={`group relative rounded-3xl p-6 border flex flex-col justify-between transition-all duration-200 ease-out ${
                isThisCardHovered
                  ? 'bg-[#0f1018] border-[#E32124] shadow-[0_0_35px_rgba(227,33,36,0.35)] scale-[1.01] z-10'
                  : category.highlight
                  ? 'border-[#E32124]/50 shadow-[0_0_20px_rgba(227,33,36,0.15)] bg-[#0a0a10]'
                  : 'bg-[#06060c] border-white/10'
              } ${
                cardDimmed 
                  ? 'opacity-40 scale-[0.99]' 
                  : 'opacity-100'
              }`}
            >
              {/* Top Card Bar */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className={`p-2.5 rounded-2xl border transition-colors duration-200 ${
                      isThisCardHovered
                        ? 'bg-[#E32124]/20 border-[#E32124] text-white shadow-lg shadow-red-600/30'
                        : 'bg-white/[0.05] border-white/10 text-zinc-300'
                    }`}>
                      {getCategoryIcon(category.iconType)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className={`font-sans font-black text-lg sm:text-xl tracking-wide uppercase transition-colors duration-200 ${
                          isThisCardHovered ? 'text-[#E32124]' : 'text-white'
                        }`}>
                          {category.title}
                        </h3>
                      </div>
                      <p className="text-[11px] font-mono text-zinc-400 truncate max-w-[200px] sm:max-w-[240px]">
                        {category.specs}
                      </p>
                    </div>
                  </div>
                  
                  {category.badge && (
                    <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full uppercase tracking-wider transition-colors duration-200 ${
                      isThisCardHovered || category.highlight
                        ? 'bg-[#E32124] text-white shadow-[0_0_15px_rgba(227,33,36,0.6)]'
                        : 'bg-white/10 text-zinc-300 border border-white/10'
                    }`}>
                      {category.badge}
                    </span>
                  )}
                </div>

                {/* Table Column Headers */}
                <div className="grid grid-cols-12 gap-1 sm:gap-2 py-2 px-2.5 sm:px-3 rounded-xl bg-white/[0.03] border border-white/[0.05] text-[10px] sm:text-[11px] font-mono text-zinc-400 uppercase tracking-wider mb-2">
                  <div className="col-span-6 flex items-center gap-1">ТАРИФ // ВРЕМЯ</div>
                  <div className="col-span-3 text-right">ПН-ЧТ</div>
                  <div className="col-span-3 text-right text-zinc-200 font-bold">ПТ-ВС</div>
                </div>

                {/* Table Rows: Fast GPU CSS Hover Transitions */}
                <div className="space-y-1.5 mb-6">
                  {category.rows.map((row, idx) => {
                    const matchesFilter = selectedTimeFilter === 'all' || row.filterKey === selectedTimeFilter;

                    return (
                      <div
                        key={idx}
                        className={`grid grid-cols-12 gap-1 sm:gap-2 py-2 px-2.5 sm:px-3 rounded-xl transition-all duration-150 items-center text-[11px] sm:text-xs font-mono cursor-default relative min-h-[40px] sm:min-h-[44px] hover:bg-[#E32124]/10 hover:border-l-4 hover:border-[#E32124] ${
                          !matchesFilter ? 'opacity-35' : 'opacity-100 hover:opacity-100'
                        } ${
                          selectedTimeFilter !== 'all' && matchesFilter
                            ? 'bg-gradient-to-r from-[#E32124]/20 via-[#E32124]/10 to-transparent border-l-4 border-[#E32124]'
                            : 'hover:bg-white/[0.06]'
                        }`}
                      >
                        <div className="col-span-6 flex items-center gap-1.5 sm:gap-2 min-w-0">
                          {getRowIcon(row.filterKey)}
                          <div className="truncate">
                            <div className="text-zinc-200 font-medium truncate">
                              {row.period}
                            </div>
                            {row.subtext && (
                              <div className="text-[9px] sm:text-[10px] text-zinc-500 truncate">
                                {row.subtext}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Weekday Price */}
                        <div className="col-span-3 text-right font-bold text-zinc-300 tabular-nums">
                          {row.weekday}
                        </div>

                        {/* Weekend Price */}
                        <div className="col-span-3 text-right font-bold text-[#E32124] tabular-nums">
                          {row.weekend}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Booking CTA Button */}
              <div>
                <button
                  onClick={() => {
                    sound.playClick();
                    onOpenBooking(selectedArenaId, category.id);
                  }}
                  className={`w-full py-2.5 px-4 rounded-xl font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-150 cursor-pointer ${
                    isThisCardHovered || category.highlight
                      ? 'bg-[#E32124] hover:bg-[#FF2A2E] text-white shadow-[0_0_20px_rgba(227,33,36,0.6)] active:scale-95'
                      : 'bg-white/10 hover:bg-[#E32124] text-white hover:text-white border border-white/10 hover:border-[#E32124] active:scale-95'
                  }`}
                >
                  <span>ЗАБРОНИРОВАТЬ МЕСТО</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Important Weekend Policy Note */}
      <div className="mt-6 p-4 rounded-2xl bg-white/[0.02] border border-white/10 flex items-start sm:items-center gap-3 max-w-4xl mx-auto text-xs font-mono text-zinc-400">
        <CheckCircle2 className="w-4 h-4 text-[#E32124] shrink-0 mt-0.5 sm:mt-0" />
        <div>
          <span className="text-zinc-200 font-bold">* Выходные дни:</span> с 22:00 пятницы (или предпраздничного дня) до 22:00 воскресенья (или предпраздничного дня). Оплата услуг осуществляется по действующим тарифам клуба.
        </div>
      </div>

    </section>
  );
};
