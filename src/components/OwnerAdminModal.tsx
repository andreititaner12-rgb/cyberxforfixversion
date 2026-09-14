import React, { useState, useEffect, useRef } from 'react';
import { 
  DEFAULT_PRICES, 
  DEFAULT_LINKS, 
  ARENAS, 
  ZONES, 
  UPCOMING_TOURNAMENT, 
  PROMOTIONS 
} from '../data/arenaData';
import { 
  ArenaLocation, 
  ZoneType, 
  Tournament, 
  Promotion, 
  SiteLinks, 
  AllPricesData, 
  PriceCategory, 
  PriceRow 
} from '../types';
import { 
  X, 
  Save, 
  Download, 
  Upload, 
  RotateCcw, 
  CheckCircle2, 
  Tag, 
  Trophy, 
  Shield, 
  Link as LinkIcon, 
  Copy, 
  CheckCheck, 
  LogOut, 
  Layers, 
  Plus, 
  Trash2, 
  Image as ImageIcon, 
  DollarSign, 
  Monitor, 
  Gamepad2, 
  Building2, 
  Sparkles 
} from 'lucide-react';
import { sound } from '../utils/sound';
import { MASTER_SECRET_KEY } from './OwnerSecurityGate';

interface OwnerAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPrices: AllPricesData;
  onSaveLivePrices: (prices: AllPricesData) => void;
  currentLinks: SiteLinks;
  onSaveLiveLinks: (links: SiteLinks) => void;
  currentArenas: ArenaLocation[];
  onSaveLiveArenas: (arenas: ArenaLocation[]) => void;
  currentZones: ZoneType[];
  onSaveLiveZones: (zones: ZoneType[]) => void;
  currentTournament: Tournament;
  onSaveLiveTournament: (tournament: Tournament) => void;
  currentPromos: Promotion[];
  onSaveLivePromos: (promos: Promotion[]) => void;
  onRestoreAllDefaults: () => void;
  onImportAllData: (data: {
    prices?: AllPricesData;
    links?: SiteLinks;
    arenas?: ArenaLocation[];
    zones?: ZoneType[];
    tournament?: Tournament;
    promotions?: Promotion[];
  }) => void;
  onLogout: () => void;
}

const PRESET_GALLERY_IMAGES = [
  {
    group: 'CyberX Arena (ул. Ленина, 19)',
    images: [
      { label: 'Фасад Ленина', url: '/images/arena/01-facade.jpg' },
      { label: 'Бар и Ресепшн', url: '/images/arena/02-bar.jpg' },
      { label: 'Главный ПК Зал', url: '/images/arena/03-pc-hall.jpg' },
      { label: 'Эскалатор и Вход', url: '/images/arena/04-escalator.jpg' },
      { label: 'Лестница 2 этаж', url: '/images/arena/05-stair-top.jpg' },
      { label: 'ПК Сеты Blue Neon', url: '/images/arena/06-pc-blue.jpg' },
      { label: 'Pink Dragon Арт', url: '/images/arena/07-pink-dragon.jpg' },
      { label: 'Gamer Zone VIP', url: '/images/arena/08-gamer-zone.jpg' },
      { label: 'Gamer Zone TV', url: '/images/arena/09-gamer-zone-tv.jpg' },
      { label: 'Purple Lounge Girl', url: '/images/arena/10-purple-girl.jpg' },
      { label: 'PS5 NHL Console', url: '/images/arena/11-nhl-console.jpg' },
      { label: 'PS5 Pink Room', url: '/images/arena/12-pink-girl-console.jpg' },
      { label: 'Blue Cyber Girl', url: '/images/arena/13-blue-cyber-girl.jpg' },
      { label: 'Gamer Zone Blue', url: '/images/arena/14-gamer-zone-blue.jpg' },
      { label: 'Кино-Лаунж 150"', url: '/images/arena/15-bar-lounge.jpg' },
      { label: 'PS5 Red Mural Room', url: '/images/arena/16-ps5-red-mural.jpg' },
      { label: 'Карточка Ленина', url: '/images/arena-lenina-card.jpg' },
    ]
  },
  {
    group: 'CyberX Европа (просп. Мира, 42к1)',
    images: [
      { label: 'Фасад Мира', url: '/images/evropa/01-facade.jpg' },
      { label: 'Бар и Напитки', url: '/images/evropa/02-bar.jpg' },
      { label: 'ПК Зал Европа', url: '/images/evropa/03-pc-hall.jpg' },
      { label: 'Сетап ПК Крупно', url: '/images/evropa/04-pc-closeup.jpg' },
      { label: 'Solo Room 600Hz', url: '/images/evropa/05-mural-solo.jpg' },
      { label: 'Игровой стол Pro', url: '/images/evropa/06-desk.jpg' },
      { label: 'Входная группа', url: '/images/evropa/07-entrance.jpg' },
      { label: 'VIP ПК Зал', url: '/images/evropa/08-pc-room.jpg' },
    ]
  },
  {
    group: 'CyberX Октябрь (ул. Серова, 19А)',
    images: [
      { label: 'Вход ТК Октябрь', url: '/images/oktyabr/01-exterior.jpg' },
      { label: 'Бар и Ресепшн', url: '/images/oktyabr/02-bar.jpg' },
      { label: 'Ряд ПК Октябрь', url: '/images/oktyabr/03-pc-row.jpg' },
      { label: 'Колонна и Подсветка', url: '/images/oktyabr/04-pc-column.jpg' },
      { label: 'Сетап Dark Project', url: '/images/oktyabr/05-pc-closeup.jpg' },
      { label: 'Лестница на 2 уровень', url: '/images/oktyabr/06-stairs.jpg' },
      { label: 'PS5 Лаунж Зона', url: '/images/oktyabr/07-lounge.jpg' },
      { label: 'Общий Зал Октябрь', url: '/images/oktyabr/08-hall.jpg' },
    ]
  },
  {
    group: 'Спец-Оборудование',
    images: [
      { label: 'Автосимуляторы Moza', url: '/images/sim-racing-real.jpg' },
      { label: 'Дисплей BenQ 600Hz', url: '/images/hardware/benq-monitor.png' },
    ]
  }
];

export const OwnerAdminModal: React.FC<OwnerAdminModalProps> = ({
  isOpen,
  onClose,
  currentPrices,
  onSaveLivePrices,
  currentLinks,
  onSaveLiveLinks,
  currentArenas,
  onSaveLiveArenas,
  currentZones,
  onSaveLiveZones,
  currentTournament,
  onSaveLiveTournament,
  currentPromos,
  onSaveLivePromos,
  onRestoreAllDefaults,
  onImportAllData,
  onLogout,
}) => {
  type AdminTab = 'prices' | 'media' | 'links' | 'zones' | 'tournaments' | 'promos' | 'backup_security';
  const [activeTab, setActiveTab] = useState<AdminTab>('prices');

  // Local state replicas
  const [pricesState, setPricesState] = useState<AllPricesData>(currentPrices || DEFAULT_PRICES);
  const [linksState, setLinksState] = useState<SiteLinks>(currentLinks || DEFAULT_LINKS);
  const [arenasState, setArenasState] = useState<ArenaLocation[]>(currentArenas || ARENAS);
  const [zonesState, setZonesState] = useState<ZoneType[]>(currentZones || ZONES);
  const [tournamentState, setTournamentState] = useState<Tournament>(currentTournament || UPCOMING_TOURNAMENT);
  const [promosState, setPromosState] = useState<Promotion[]>(currentPromos || PROMOTIONS);

  // Pricing tab selections
  const [selectedPricingClub, setSelectedPricingClub] = useState<string>('cyberx-arena');
  const [selectedPricingTab, setSelectedPricingTab] = useState<'pc' | 'lounge'>('pc');
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState<number>(0);

  // Arenas & Zones tab sub-selection
  const [selectedArenaIndex, setSelectedArenaIndex] = useState<number>(0);
  const [selectedZoneIndex, setSelectedZoneIndex] = useState<number>(0);
  const [arenaOrZoneMode, setArenaOrZoneMode] = useState<'arenas' | 'zones'>('zones');

  // Media manager state
  const [mediaTargetType, setMediaTargetType] = useState<'arena-cover' | 'arena-gallery' | 'zone-cover' | 'zone-gallery'>('zone-cover');
  const [mediaTargetId, setMediaTargetId] = useState<string>('premium-squad');
  const [customImageUrl, setCustomImageUrl] = useState<string>('');
  const [uploadedBase64Preview, setUploadedBase64Preview] = useState<string | null>(null);

  // UI state
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [newPin, setNewPin] = useState('');
  const [pinChangeSuccess, setPinChangeSuccess] = useState(false);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const jsonImportInputRef = useRef<HTMLInputElement>(null);

  // Simulated live CRM analytics metrics
  const [crmMetrics] = useState({
    todayVisits: 842,
    weekVisits: 5890,
    bookingClicks: 314,
    gisRouteClicks: 268,
    phoneCallClicks: 89,
    tournamentRegs: 47,
    arenaShares: {
      lenina: 52, // %
      evropa: 27, // %
      oktyabr: 21, // %
    }
  });

  // Keep local states synced with props when modal opens
  useEffect(() => {
    if (isOpen) {
      setPricesState(currentPrices || DEFAULT_PRICES);
      setLinksState(currentLinks || DEFAULT_LINKS);
      setArenasState(currentArenas || ARENAS);
      setZonesState(currentZones || ZONES);
      setTournamentState(currentTournament || UPCOMING_TOURNAMENT);
      setPromosState(currentPromos || PROMOTIONS);
    }
  }, [isOpen, currentPrices, currentLinks, currentArenas, currentZones, currentTournament, currentPromos]);

  // Lock background scroll & close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Save changes handler
  const handleSaveAll = () => {
    sound.playTrigger();
    onSaveLivePrices(pricesState);
    onSaveLiveLinks(linksState);
    onSaveLiveArenas(arenasState);
    onSaveLiveZones(zonesState);
    onSaveLiveTournament(tournamentState);
    onSaveLivePromos(promosState);

    // Save to localStorage for instant persistence across reloads
    localStorage.setItem('cyberx_live_prices', JSON.stringify(pricesState));
    localStorage.setItem('cyberx_live_links', JSON.stringify(linksState));
    localStorage.setItem('cyberx_live_arenas', JSON.stringify(arenasState));
    localStorage.setItem('cyberx_live_zones', JSON.stringify(zonesState));
    localStorage.setItem('cyberx_live_tournament', JSON.stringify(tournamentState));
    localStorage.setItem('cyberx_live_promos', JSON.stringify(promosState));

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  // Full JSON Export
  const handleExportJSON = () => {
    sound.playClick();
    const exportData = {
      version: '2026.1',
      exportedAt: new Date().toISOString(),
      siteName: 'CyberX Community Omsk',
      prices: pricesState,
      links: linksState,
      arenas: arenasState,
      zones: zonesState,
      tournament: tournamentState,
      promotions: promosState,
      crmMetrics,
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `cyberx_omsk_cms_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // JSON Import handler
  const handleImportJSONFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.prices) setPricesState(parsed.prices);
        if (parsed.links) setLinksState(parsed.links);
        if (parsed.arenas) setArenasState(parsed.arenas);
        if (parsed.zones) setZonesState(parsed.zones);
        if (parsed.tournament) setTournamentState(parsed.tournament);
        if (parsed.promotions) setPromosState(parsed.promotions);

        onImportAllData(parsed);
        sound.playTrigger();
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      } catch (err) {
        alert('Ошибка при чтении JSON файла: неверный формат.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Direct image upload to Base64
  const handleDirectImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      alert('Размер файла слишком большой (макс. 8 МБ).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setUploadedBase64Preview(base64);
      setCustomImageUrl(base64);
      sound.playClick();
    };
    reader.readAsDataURL(file);
  };

  // Apply selected image URL to chosen destination
  const handleApplyImageToTarget = (imageUrl: string) => {
    if (!imageUrl) return;
    sound.playTrigger();

    if (mediaTargetType === 'arena-cover') {
      setArenasState(prev => prev.map(a => a.id === mediaTargetId ? { ...a, image: imageUrl } : a));
    } else if (mediaTargetType === 'arena-gallery') {
      setArenasState(prev => prev.map(a => {
        if (a.id === mediaTargetId) {
          const currentGallery = a.gallery ? [...a.gallery] : [a.image];
          if (!currentGallery.includes(imageUrl)) {
            currentGallery.push(imageUrl);
          }
          return { ...a, gallery: currentGallery };
        }
        return a;
      }));
    } else if (mediaTargetType === 'zone-cover') {
      setZonesState(prev => prev.map(z => z.id === mediaTargetId ? { ...z, image: imageUrl } : z));
    } else if (mediaTargetType === 'zone-gallery') {
      setZonesState(prev => prev.map(z => {
        if (z.id === mediaTargetId) {
          const currentGallery = z.gallery ? [...z.gallery] : [z.image];
          if (!currentGallery.includes(imageUrl)) {
            currentGallery.push(imageUrl);
          }
          return { ...z, gallery: currentGallery };
        }
        return z;
      }));
    }

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const copySecretLink = () => {
    sound.playClick();
    const url = `${window.location.origin}/#admin?key=${MASTER_SECRET_KEY}`;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(url);
      } else {
        const ta = document.createElement('textarea');
        ta.value = url;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        ta.remove();
      }
    } catch {
      // Handled
    }
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleUpdatePin = () => {
    if (newPin.trim().length >= 4) {
      sound.playTrigger();
      localStorage.setItem('cyberx_owner_pin', newPin.trim());
      setPinChangeSuccess(true);
      setTimeout(() => setPinChangeSuccess(false), 3000);
    }
  };

  // Helper getters for current pricing tab
  const currentClubPricesObj = pricesState[selectedPricingClub] || DEFAULT_PRICES['cyberx-arena'];
  const currentPriceCategories = (selectedPricingTab === 'pc' ? currentClubPricesObj.pc : currentClubPricesObj.lounge) || [];
  const safeCatIndex = Math.min(selectedCategoryIndex, Math.max(0, currentPriceCategories.length - 1));
  const currentCategory = currentPriceCategories[safeCatIndex];

  // Helper to update current price category
  const updateCurrentCategoryField = (field: keyof PriceCategory, value: unknown) => {
    setPricesState(prev => {
      const clubCopy = { ...prev[selectedPricingClub] };
      const listCopy = selectedPricingTab === 'pc' ? [...clubCopy.pc] : [...clubCopy.lounge];
      listCopy[safeCatIndex] = {
        ...listCopy[safeCatIndex],
        [field]: value
      };
      if (selectedPricingTab === 'pc') {
        clubCopy.pc = listCopy;
      } else {
        clubCopy.lounge = listCopy;
      }
      return {
        ...prev,
        [selectedPricingClub]: clubCopy
      };
    });
  };

  // Helper to update row in price category
  const updatePriceRowField = (rowIdx: number, field: keyof PriceRow, value: string) => {
    if (!currentCategory) return;
    const newRows = [...currentCategory.rows];
    newRows[rowIdx] = {
      ...newRows[rowIdx],
      [field]: value
    };
    updateCurrentCategoryField('rows', newRows);
  };

  const addPriceRow = () => {
    if (!currentCategory) return;
    const newRow: PriceRow = {
      period: 'НОВЫЙ ТАРИФ',
      subtext: 'Пакетное время',
      weekday: '200 ₽',
      weekend: '250 ₽',
      filterKey: '1h'
    };
    updateCurrentCategoryField('rows', [...currentCategory.rows, newRow]);
  };

  const deletePriceRow = (rowIdx: number) => {
    if (!currentCategory || currentCategory.rows.length <= 1) return;
    const newRows = [...currentCategory.rows];
    newRows.splice(rowIdx, 1);
    updateCurrentCategoryField('rows', newRows);
  };

  return (
    <div 
      onClick={onClose} 
      data-lenis-prevent="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/95 backdrop-blur-2xl animate-fadeIn select-none overscroll-contain"
    >
      <div 
        data-lenis-prevent="true"
        className="relative w-full max-w-6xl max-h-[94vh] flex flex-col bg-[#08080f] border border-[#E32124]/40 rounded-3xl shadow-[0_0_90px_rgba(227,33,36,0.25)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        onWheel={(e) => e.stopPropagation()}
      >
        {/* Top neon strip */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#E32124] to-transparent z-30" />

        {/* Modal Header Bar */}
        <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between shrink-0 bg-[#0c0c16]">
          <div className="font-mono">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E32124]/15 border border-[#E32124]/30 text-[#E32124] text-[10px] font-bold uppercase tracking-wider mb-1">
              <span className="w-2 h-2 rounded-full bg-[#E32124] animate-ping" />
              <span>CYBERX ROOT CONTROL PANEL // CMS ОМСК 2026</span>
            </div>
            <h3 className="font-display font-black text-xl sm:text-2xl uppercase tracking-tight text-white flex items-center gap-2">
              <span>Центр управления экосистемой CyberX</span>
              <span className="text-xs font-mono font-normal text-zinc-400 bg-white/5 px-2 py-0.5 rounded-lg border border-white/10">
                Live Dynamic Sync
              </span>
            </h3>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-2.5 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] text-zinc-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Horizontal Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto p-3 sm:px-6 bg-[#07070d] border-b border-white/10 font-mono scrollbar-none shrink-0">
          {[
            { id: 'prices', label: 'Прайс-лист тарифов', icon: <DollarSign className="w-4 h-4" /> },
            { id: 'media', label: 'Медиа & Фото-галерея', icon: <ImageIcon className="w-4 h-4" /> },
            { id: 'links', label: 'Ссылки & Контакты', icon: <LinkIcon className="w-4 h-4" /> },
            { id: 'zones', label: 'Клубы & Зоны', icon: <Layers className="w-4 h-4" /> },
            { id: 'tournaments', label: 'Турниры & Призы', icon: <Trophy className="w-4 h-4" /> },
            { id: 'promos', label: 'Акции & Бонусы', icon: <Tag className="w-4 h-4" /> },
            { id: 'backup_security', label: 'Бэкап & Безопасность', icon: <Shield className="w-4 h-4" /> },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  sound.playClick();
                  setActiveTab(tab.id as AdminTab);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer border ${
                  isActive
                    ? 'bg-[#E32124] text-white border-[#E32124] shadow-md shadow-red-600/30'
                    : 'bg-white/[0.03] text-zinc-400 border-white/[0.06] hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6 overscroll-contain">

          {/* TAB 1: PRICING EDITOR */}
          {activeTab === 'prices' && (
            <div className="space-y-6 font-mono">
              
              {/* Club Selector */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[#12121e] border border-white/10">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#E32124]" />
                  <span className="text-xs font-bold text-white uppercase">Выберите клуб:</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {arenasState.map((arena) => (
                    <button
                      key={arena.id}
                      onClick={() => {
                        sound.playClick();
                        setSelectedPricingClub(arena.id);
                        setSelectedCategoryIndex(0);
                      }}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                        selectedPricingClub === arena.id
                          ? 'bg-[#E32124] text-white border-[#E32124] shadow-md shadow-red-600/30'
                          : 'bg-white/[0.04] text-zinc-400 border-white/10 hover:text-white'
                      }`}
                    >
                      {arena.name.split('//')[0].trim()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Tab Switcher (PC vs Lounge) */}
              <div className="flex items-center justify-between gap-4 p-2 rounded-xl bg-black/60 border border-white/10">
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      sound.playClick();
                      setSelectedPricingTab('pc');
                      setSelectedCategoryIndex(0);
                    }}
                    className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all flex items-center gap-2 cursor-pointer ${
                      selectedPricingTab === 'pc' ? 'bg-[#E32124] text-white shadow-md' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Monitor className="w-3.5 h-3.5" />
                    <span>ПК Зоны ({currentClubPricesObj.pc?.length || 0})</span>
                  </button>

                  <button
                    onClick={() => {
                      sound.playClick();
                      setSelectedPricingTab('lounge');
                      setSelectedCategoryIndex(0);
                    }}
                    className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all flex items-center gap-2 cursor-pointer ${
                      selectedPricingTab === 'lounge' ? 'bg-[#E32124] text-white shadow-md' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Gamepad2 className="w-3.5 h-3.5" />
                    <span>Lounge & Симуляторы ({currentClubPricesObj.lounge?.length || 0})</span>
                  </button>
                </div>

                <span className="text-[11px] text-zinc-500 hidden sm:inline-block">
                  Все тарифы в реальном времени отображаются на сайте
                </span>
              </div>

              {/* Category Cards Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {currentPriceCategories.map((cat, idx) => (
                  <button
                    key={cat.id || idx}
                    onClick={() => {
                      sound.playClick();
                      setSelectedCategoryIndex(idx);
                    }}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border shrink-0 cursor-pointer ${
                      safeCatIndex === idx
                        ? 'bg-[#E32124] text-white border-[#E32124] shadow-md shadow-red-600/30'
                        : 'bg-white/[0.04] text-zinc-400 border-white/[0.08] hover:text-white'
                    }`}
                  >
                    <span>{cat.title}</span>
                  </button>
                ))}
              </div>

              {/* Edit Selected Category Form */}
              {currentCategory && (
                <div className="p-5 rounded-2xl bg-[#12121e] border border-white/10 space-y-4">
                  
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <span className="text-xs font-bold text-[#E32124] uppercase">
                      Настройки карточки тарифа: {currentCategory.title}
                    </span>
                    <span className="text-[10px] text-zinc-500">ID: {currentCategory.id}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] text-zinc-400 block mb-1">Заголовок тарифа</label>
                      <input
                        type="text"
                        value={currentCategory.title}
                        onChange={(e) => updateCurrentCategoryField('title', e.target.value)}
                        className="w-full bg-[#0a0a0f] border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-zinc-400 block mb-1">Бейдж / Статус</label>
                      <input
                        type="text"
                        value={currentCategory.badge || ''}
                        onChange={(e) => updateCurrentCategoryField('badge', e.target.value)}
                        placeholder="БАЗОВЫЙ / ФЛАГМАН"
                        className="w-full bg-[#0a0a0f] border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-zinc-400 block mb-1">Иконка карточки</label>
                      <select
                        value={currentCategory.iconType || 'Monitor'}
                        onChange={(e) => updateCurrentCategoryField('iconType', e.target.value)}
                        className="w-full bg-[#0a0a0f] border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
                      >
                        <option value="Monitor">Monitor (ПК / Экран)</option>
                        <option value="Zap">Zap (Молния / Скорость)</option>
                        <option value="Crown">Crown (Корона / VIP)</option>
                        <option value="Flame">Flame (Огонь / Топ)</option>
                        <option value="ShieldCheck">Shield (Щит / Solo)</option>
                        <option value="Gauge">Gauge (Спидометр / Автосим)</option>
                        <option value="Tv">Tv (Телевизор / PS5)</option>
                        <option value="Users">Users (Команда / Bootcamp)</option>
                        <option value="Gamepad2">Gamepad (Геймпад / Лаунж)</option>
                        <option value="Coffee">Coffee (Бар / Кальян)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-zinc-400 block mb-1">Краткая сводка железа / девайсов</label>
                    <input
                      type="text"
                      value={currentCategory.specs}
                      onChange={(e) => updateCurrentCategoryField('specs', e.target.value)}
                      placeholder="RTX 4070 Ti • 360Hz • ZOWIE • Dark Project"
                      className="w-full bg-[#0a0a0f] border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>

                  {/* Rows Table Editor */}
                  <div className="pt-2">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold text-white uppercase flex items-center gap-1.5">
                        <DollarSign className="w-3.5 h-3.5 text-[#E32124]" />
                        <span>Строки цен и временные пакеты ({currentCategory.rows.length}):</span>
                      </label>
                      <button
                        type="button"
                        onClick={addPriceRow}
                        className="text-[11px] text-[#E32124] hover:text-white flex items-center gap-1 cursor-pointer font-bold"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Добавить строку цены</span>
                      </button>
                    </div>

                    <div className="space-y-2">
                      {currentCategory.rows.map((row, rIdx) => (
                        <div key={rIdx} className="p-3 rounded-xl bg-[#0a0a0f] border border-white/10 grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
                          <div className="sm:col-span-3">
                            <span className="text-[9px] text-zinc-500 uppercase block">Период / Тариф</span>
                            <input
                              type="text"
                              value={row.period}
                              onChange={(e) => updatePriceRowField(rIdx, 'period', e.target.value)}
                              className="w-full bg-[#12121e] border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white font-bold"
                            />
                          </div>

                          <div className="sm:col-span-3">
                            <span className="text-[9px] text-zinc-500 uppercase block">Подзаголовок / Часы</span>
                            <input
                              type="text"
                              value={row.subtext || ''}
                              onChange={(e) => updatePriceRowField(rIdx, 'subtext', e.target.value)}
                              placeholder="08:00 – 14:00"
                              className="w-full bg-[#12121e] border border-white/10 rounded-lg px-2.5 py-1 text-xs text-zinc-300"
                            />
                          </div>

                          <div className="sm:col-span-2">
                            <span className="text-[9px] text-zinc-500 uppercase block">ПН-ЧТ</span>
                            <input
                              type="text"
                              value={row.weekday}
                              onChange={(e) => updatePriceRowField(rIdx, 'weekday', e.target.value)}
                              className="w-full bg-[#12121e] border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white"
                            />
                          </div>

                          <div className="sm:col-span-2">
                            <span className="text-[9px] text-red-400 uppercase block font-bold">ПТ-ВС</span>
                            <input
                              type="text"
                              value={row.weekend}
                              onChange={(e) => updatePriceRowField(rIdx, 'weekend', e.target.value)}
                              className="w-full bg-[#12121e] border border-red-500/30 rounded-lg px-2.5 py-1 text-xs text-[#E32124] font-bold"
                            />
                          </div>

                          <div className="sm:col-span-1">
                            <span className="text-[9px] text-zinc-500 uppercase block">Фильтр</span>
                            <select
                              value={row.filterKey || '1h'}
                              onChange={(e) => updatePriceRowField(rIdx, 'filterKey', e.target.value)}
                              className="w-full bg-[#12121e] border border-white/10 rounded-lg px-1 py-1 text-[10px] text-zinc-300"
                            >
                              <option value="morning">Утро</option>
                              <option value="1h">1 Час</option>
                              <option value="3h">3 Часа</option>
                              <option value="5h">5 Часов</option>
                              <option value="night">Ночь</option>
                            </select>
                          </div>

                          <div className="sm:col-span-1 text-right">
                            <button
                              type="button"
                              onClick={() => deletePriceRow(rIdx)}
                              className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-white/5 cursor-pointer"
                              title="Удалить строку"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

            </div>
          )}

          {/* TAB 2: MEDIA & GALLERY MANAGER (BASE64 UPLOAD + PRESETS) */}
          {activeTab === 'media' && (
            <div className="space-y-6 font-mono">
              
              {/* Target Assignment Box */}
              <div className="p-5 rounded-2xl bg-[#12121e] border border-white/10 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <span className="text-xs font-bold text-[#E32124] uppercase flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    <span>Куда назначить выбранную фотографию?</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] text-zinc-400 block mb-1">Тип назначения</label>
                    <select
                      value={mediaTargetType}
                      onChange={(e) => setMediaTargetType(e.target.value as typeof mediaTargetType)}
                      className="w-full bg-[#0a0a0f] border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
                    >
                      <option value="zone-cover">Обложка зоны (Главное фото зоны)</option>
                      <option value="zone-gallery">Добавить в галерею зоны</option>
                      <option value="arena-cover">Обложка клуба (Главное фото клуба)</option>
                      <option value="arena-gallery">Добавить в галерею клуба</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] text-zinc-400 block mb-1">
                      {mediaTargetType.startsWith('arena') ? 'Выберите клуб' : 'Выберите зону'}
                    </label>
                    <select
                      value={mediaTargetId}
                      onChange={(e) => setMediaTargetId(e.target.value)}
                      className="w-full bg-[#0a0a0f] border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
                    >
                      {mediaTargetType.startsWith('arena') ? (
                        arenasState.map(a => (
                          <option key={a.id} value={a.id}>{a.name}</option>
                        ))
                      ) : (
                        zonesState.map(z => (
                          <option key={z.id} value={z.id}>{z.name} ({z.category})</option>
                        ))
                      )}
                    </select>
                  </div>
                </div>

                {/* Direct Upload from Device & URL input */}
                <div className="pt-2">
                  <span className="text-[11px] text-zinc-400 block mb-2">Загрузить фото со своего устройства (ПК / Телефон) или ввести URL:</span>
                  
                  <div className="flex flex-wrap items-center gap-3">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleDirectImageUpload}
                      accept="image/*"
                      className="hidden"
                    />

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-white text-xs font-bold uppercase transition-all flex items-center gap-2 cursor-pointer border border-white/10"
                    >
                      <Upload className="w-4 h-4 text-[#E32124]" />
                      <span>Выбрать файл на устройстве</span>
                    </button>

                    <input
                      type="text"
                      placeholder="Или вставьте URL / путь (/images/...)"
                      value={customImageUrl}
                      onChange={(e) => {
                        setCustomImageUrl(e.target.value);
                        setUploadedBase64Preview(e.target.value);
                      }}
                      className="flex-1 min-w-[240px] bg-[#0a0a0f] border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white"
                    />

                    <button
                      type="button"
                      onClick={() => handleApplyImageToTarget(customImageUrl)}
                      disabled={!customImageUrl}
                      className="px-5 py-2.5 rounded-xl bg-[#E32124] hover:bg-[#FF2A2E] disabled:opacity-40 text-white text-xs font-bold uppercase transition-all cursor-pointer shadow-md shadow-red-600/30"
                    >
                      Применить фото
                    </button>
                  </div>

                  {uploadedBase64Preview && (
                    <div className="mt-3 p-3 rounded-xl bg-black/60 border border-white/10 flex items-center gap-4">
                      <div className="w-20 h-14 rounded-lg overflow-hidden border border-[#E32124] shrink-0 bg-black">
                        <img src={uploadedBase64Preview} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                      <div className="text-xs text-zinc-300">
                        <span className="font-bold text-white block">Превью выбранного фото</span>
                        <span className="text-[10px] text-emerald-400">Готово к сохранению в один клик</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Preset Visual Photo Library */}
              <div className="space-y-4">
                <span className="text-xs font-bold uppercase text-white block">
                  Библиотека встроенных клубных фотографий CyberX Омск ({PRESET_GALLERY_IMAGES.reduce((acc, g) => acc + g.images.length, 0)} фото):
                </span>

                <div className="space-y-4">
                  {PRESET_GALLERY_IMAGES.map((group, gIdx) => (
                    <div key={gIdx} className="p-4 rounded-2xl bg-[#12121e] border border-white/10 space-y-3">
                      <div className="text-xs font-bold text-[#E32124] uppercase">
                        {group.group}
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                        {group.images.map((img, iIdx) => (
                          <div
                            key={iIdx}
                            onClick={() => {
                              sound.playClick();
                              setCustomImageUrl(img.url);
                              setUploadedBase64Preview(img.url);
                              handleApplyImageToTarget(img.url);
                            }}
                            className="group relative rounded-xl overflow-hidden border border-white/10 hover:border-[#E32124] transition-all cursor-pointer bg-black aspect-video flex flex-col justify-end"
                          >
                            <img src={img.url} alt={img.label} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-80 group-hover:opacity-100" />
                            <div className="absolute bottom-1 left-1.5 right-1.5 text-[9px] text-white font-bold truncate z-10">
                              {img.label}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: LINKS & CONTACTS EDITOR */}
          {activeTab === 'links' && (
            <div className="space-y-6 font-mono">
              <div className="p-5 rounded-2xl bg-[#12121e] border border-white/10 space-y-4">
                <span className="text-xs font-bold text-[#E32124] uppercase block pb-2 border-b border-white/10">
                  Основные социальные сети и онлайн-сервисы
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] text-zinc-400 block mb-1">Telegram Handle (Единый для всех клубов)</label>
                    <input
                      type="text"
                      value={linksState.telegramHandle}
                      onChange={(e) => setLinksState({ ...linksState, telegramHandle: e.target.value })}
                      className="w-full bg-[#0a0a0f] border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-zinc-400 block mb-1">Telegram Прямой URL</label>
                    <input
                      type="text"
                      value={linksState.telegramUrl}
                      onChange={(e) => setLinksState({ ...linksState, telegramUrl: e.target.value })}
                      className="w-full bg-[#0a0a0f] border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-zinc-400 block mb-1">VK Группа URL</label>
                    <input
                      type="text"
                      value={linksState.vkUrl}
                      onChange={(e) => setLinksState({ ...linksState, vkUrl: e.target.value })}
                      className="w-full bg-[#0a0a0f] border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-zinc-400 block mb-1">Google Форма для Турниров URL</label>
                    <input
                      type="text"
                      value={linksState.googleFormUrl}
                      onChange={(e) => setLinksState({ ...linksState, googleFormUrl: e.target.value })}
                      className="w-full bg-[#0a0a0f] border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Club Direct Contacts & Addresses */}
              <div className="p-5 rounded-2xl bg-[#12121e] border border-white/10 space-y-4">
                <span className="text-xs font-bold text-[#E32124] uppercase block pb-2 border-b border-white/10">
                  Телефоны и адреса клубов
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Lenina */}
                  <div className="p-3.5 rounded-xl bg-[#0a0a0f] border border-white/10 space-y-2">
                    <span className="text-xs font-bold text-white block">1. CyberX Arena (Ленина, 19)</span>
                    <div>
                      <label className="text-[10px] text-zinc-500 block">Телефон</label>
                      <input
                        type="text"
                        value={linksState.phoneLenina}
                        onChange={(e) => setLinksState({ ...linksState, phoneLenina: e.target.value })}
                        className="w-full bg-[#14141e] border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-zinc-500 block">Адрес</label>
                      <input
                        type="text"
                        value={linksState.addressLenina}
                        onChange={(e) => setLinksState({ ...linksState, addressLenina: e.target.value })}
                        className="w-full bg-[#14141e] border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white"
                      />
                    </div>
                  </div>

                  {/* Evropa */}
                  <div className="p-3.5 rounded-xl bg-[#0a0a0f] border border-white/10 space-y-2">
                    <span className="text-xs font-bold text-white block">2. CyberX Европа (Мира, 42к1)</span>
                    <div>
                      <label className="text-[10px] text-zinc-500 block">Телефон</label>
                      <input
                        type="text"
                        value={linksState.phoneEvropa}
                        onChange={(e) => setLinksState({ ...linksState, phoneEvropa: e.target.value })}
                        className="w-full bg-[#14141e] border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-zinc-500 block">Адрес</label>
                      <input
                        type="text"
                        value={linksState.addressEvropa}
                        onChange={(e) => setLinksState({ ...linksState, addressEvropa: e.target.value })}
                        className="w-full bg-[#14141e] border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white"
                      />
                    </div>
                  </div>

                  {/* Oktyabr */}
                  <div className="p-3.5 rounded-xl bg-[#0a0a0f] border border-white/10 space-y-2">
                    <span className="text-xs font-bold text-white block">3. CyberX Октябрь (Серова, 19А)</span>
                    <div>
                      <label className="text-[10px] text-zinc-500 block">Телефон</label>
                      <input
                        type="text"
                        value={linksState.phoneOktyabr}
                        onChange={(e) => setLinksState({ ...linksState, phoneOktyabr: e.target.value })}
                        className="w-full bg-[#14141e] border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-zinc-500 block">Адрес</label>
                      <input
                        type="text"
                        value={linksState.addressOktyabr}
                        onChange={(e) => setLinksState({ ...linksState, addressOktyabr: e.target.value })}
                        className="w-full bg-[#14141e] border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ARENAS & ZONES EDITOR */}
          {activeTab === 'zones' && (
            <div className="space-y-6 font-mono">
              <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                <button
                  onClick={() => setArenaOrZoneMode('zones')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    arenaOrZoneMode === 'zones' ? 'bg-[#E32124] text-white shadow-md' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Зоны & Комнаты ({zonesState.length})
                </button>
                <button
                  onClick={() => setArenaOrZoneMode('arenas')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    arenaOrZoneMode === 'arenas' ? 'bg-[#E32124] text-white shadow-md' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Клубы & Локации ({arenasState.length})
                </button>
              </div>

              {arenaOrZoneMode === 'zones' ? (
                <>
                  {/* Zone selector */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                    {zonesState.map((z, idx) => (
                      <button
                        key={z.id}
                        onClick={() => {
                          sound.playClick();
                          setSelectedZoneIndex(idx);
                        }}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border shrink-0 cursor-pointer ${
                          selectedZoneIndex === idx
                            ? 'bg-[#E32124] text-white border-[#E32124] shadow-md shadow-red-600/30'
                            : 'bg-white/[0.04] text-zinc-400 border-white/[0.08] hover:text-white'
                        }`}
                      >
                        {z.name.split('//')[0].trim()}
                      </button>
                    ))}
                  </div>

                  {/* Selected zone edit */}
                  {zonesState[selectedZoneIndex] && (
                    <div className="p-5 rounded-2xl bg-[#12121e] border border-white/10 space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-white/10">
                        <span className="text-xs font-bold text-[#E32124] uppercase">
                          Редактирование: {zonesState[selectedZoneIndex].name}
                        </span>
                        <span className="text-[10px] text-zinc-500">ID: {zonesState[selectedZoneIndex].id}</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="text-[11px] text-zinc-400 block mb-1">Название зоны</label>
                          <input
                            type="text"
                            value={zonesState[selectedZoneIndex].name}
                            onChange={(e) => {
                              const newZones = [...zonesState];
                              newZones[selectedZoneIndex].name = e.target.value;
                              setZonesState(newZones);
                            }}
                            className="w-full bg-[#0a0a0f] border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] text-zinc-400 block mb-1">Категория / Бейдж</label>
                          <input
                            type="text"
                            value={zonesState[selectedZoneIndex].category}
                            onChange={(e) => {
                              const newZones = [...zonesState];
                              newZones[selectedZoneIndex].category = e.target.value;
                              setZonesState(newZones);
                            }}
                            className="w-full bg-[#0a0a0f] border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] text-zinc-400 block mb-1">Вместимость (гостей)</label>
                          <input
                            type="text"
                            value={zonesState[selectedZoneIndex].capacity}
                            onChange={(e) => {
                              const newZones = [...zonesState];
                              newZones[selectedZoneIndex].capacity = e.target.value;
                              setZonesState(newZones);
                            }}
                            className="w-full bg-[#0a0a0f] border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="text-[11px] text-zinc-400 block mb-1">Подзаголовок</label>
                          <input
                            type="text"
                            value={zonesState[selectedZoneIndex].tagline}
                            onChange={(e) => {
                              const newZones = [...zonesState];
                              newZones[selectedZoneIndex].tagline = e.target.value;
                              setZonesState(newZones);
                            }}
                            className="w-full bg-[#0a0a0f] border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] text-zinc-400 block mb-1">Цена за 1 час (руб)</label>
                          <input
                            type="number"
                            value={zonesState[selectedZoneIndex].pricePerHour}
                            onChange={(e) => {
                              const newZones = [...zonesState];
                              newZones[selectedZoneIndex].pricePerHour = parseInt(e.target.value) || 0;
                              setZonesState(newZones);
                            }}
                            className="w-full bg-[#0a0a0f] border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] text-zinc-400 block mb-1">Ночной пакет (руб)</label>
                          <input
                            type="number"
                            value={zonesState[selectedZoneIndex].priceNight}
                            onChange={(e) => {
                              const newZones = [...zonesState];
                              newZones[selectedZoneIndex].priceNight = parseInt(e.target.value) || 0;
                              setZonesState(newZones);
                            }}
                            className="w-full bg-[#0a0a0f] border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] text-zinc-400 block mb-1">Подробное описание</label>
                        <textarea
                          rows={3}
                          value={zonesState[selectedZoneIndex].description}
                          onChange={(e) => {
                            const newZones = [...zonesState];
                            newZones[selectedZoneIndex].description = e.target.value;
                            setZonesState(newZones);
                          }}
                          className="w-full bg-[#0a0a0f] border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] text-zinc-400 block mb-1">Главное фото зоны (URL)</label>
                        <div className="flex items-center gap-3">
                          <input
                            type="text"
                            value={zonesState[selectedZoneIndex].image}
                            onChange={(e) => {
                              const newZones = [...zonesState];
                              newZones[selectedZoneIndex].image = e.target.value;
                              setZonesState(newZones);
                            }}
                            className="w-full bg-[#0a0a0f] border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
                          />
                          {zonesState[selectedZoneIndex].image && (
                            <div className="w-12 h-10 rounded-lg overflow-hidden border border-white/20 shrink-0 bg-black">
                              <img src={zonesState[selectedZoneIndex].image} alt="" className="w-full h-full object-cover" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  {/* Arena selector */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                    {arenasState.map((a, idx) => (
                      <button
                        key={a.id}
                        onClick={() => {
                          sound.playClick();
                          setSelectedArenaIndex(idx);
                        }}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border shrink-0 cursor-pointer ${
                          selectedArenaIndex === idx
                            ? 'bg-[#E32124] text-white border-[#E32124] shadow-md shadow-red-600/30'
                            : 'bg-white/[0.04] text-zinc-400 border-white/[0.08] hover:text-white'
                        }`}
                      >
                        {a.name.split('//')[0].trim()}
                      </button>
                    ))}
                  </div>

                  {/* Selected arena edit */}
                  {arenasState[selectedArenaIndex] && (
                    <div className="p-5 rounded-2xl bg-[#12121e] border border-white/10 space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-white/10">
                        <span className="text-xs font-bold text-[#E32124] uppercase">
                          Редактирование клуба: {arenasState[selectedArenaIndex].name}
                        </span>
                        <span className="text-[10px] text-zinc-500">ID: {arenasState[selectedArenaIndex].id}</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] text-zinc-400 block mb-1">Название клуба</label>
                          <input
                            type="text"
                            value={arenasState[selectedArenaIndex].name}
                            onChange={(e) => {
                              const newArenas = [...arenasState];
                              newArenas[selectedArenaIndex].name = e.target.value;
                              setArenasState(newArenas);
                            }}
                            className="w-full bg-[#0a0a0f] border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] text-zinc-400 block mb-1">Адрес клуба</label>
                          <input
                            type="text"
                            value={arenasState[selectedArenaIndex].address}
                            onChange={(e) => {
                              const newArenas = [...arenasState];
                              newArenas[selectedArenaIndex].address = e.target.value;
                              setArenasState(newArenas);
                            }}
                            className="w-full bg-[#0a0a0f] border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="text-[11px] text-zinc-400 block mb-1">Количество ПК</label>
                          <input
                            type="number"
                            value={arenasState[selectedArenaIndex].rigsCount}
                            onChange={(e) => {
                              const newArenas = [...arenasState];
                              newArenas[selectedArenaIndex].rigsCount = parseInt(e.target.value) || 0;
                              setArenasState(newArenas);
                            }}
                            className="w-full bg-[#0a0a0f] border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] text-zinc-400 block mb-1">Количество залов PS5</label>
                          <input
                            type="number"
                            value={arenasState[selectedArenaIndex].ps5RoomsCount}
                            onChange={(e) => {
                              const newArenas = [...arenasState];
                              newArenas[selectedArenaIndex].ps5RoomsCount = parseInt(e.target.value) || 0;
                              setArenasState(newArenas);
                            }}
                            className="w-full bg-[#0a0a0f] border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] text-zinc-400 block mb-1">Телефон бронирования</label>
                          <input
                            type="text"
                            value={arenasState[selectedArenaIndex].phone}
                            onChange={(e) => {
                              const newArenas = [...arenasState];
                              newArenas[selectedArenaIndex].phone = e.target.value;
                              setArenasState(newArenas);
                            }}
                            className="w-full bg-[#0a0a0f] border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* TAB 5: TOURNAMENTS */}
          {activeTab === 'tournaments' && (
            <div className="space-y-5 font-mono">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-zinc-300 block mb-1">Название турнира</label>
                  <input
                    type="text"
                    value={tournamentState.title}
                    onChange={(e) => setTournamentState({ ...tournamentState, title: e.target.value })}
                    className="w-full bg-[#14141e] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-xs text-zinc-300 block mb-1">Призовой фонд</label>
                  <input
                    type="text"
                    value={tournamentState.prizePool}
                    onChange={(e) => setTournamentState({ ...tournamentState, prizePool: e.target.value })}
                    className="w-full bg-[#14141e] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-xs text-zinc-300 block mb-1">Дата проведения</label>
                  <input
                    type="text"
                    value={tournamentState.date}
                    onChange={(e) => setTournamentState({ ...tournamentState, date: e.target.value })}
                    className="w-full bg-[#14141e] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-xs text-zinc-300 block mb-1">Занято слотов (из {tournamentState.slotsTotal || 16})</label>
                  <input
                    type="number"
                    value={tournamentState.slotsRegistered}
                    onChange={(e) => setTournamentState({ ...tournamentState, slotsRegistered: parseInt(e.target.value) || 0 })}
                    className="w-full bg-[#14141e] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-zinc-300 block mb-1">Краткое описание турнира</label>
                <textarea
                  rows={3}
                  value={tournamentState.description}
                  onChange={(e) => setTournamentState({ ...tournamentState, description: e.target.value })}
                  className="w-full bg-[#14141e] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white"
                />
              </div>
            </div>
          )}

          {/* TAB 6: PROMOTIONS */}
          {activeTab === 'promos' && (
            <div className="space-y-4 font-mono">
              {promosState.map((promo, idx) => (
                <div key={promo.id} className="p-4 rounded-2xl bg-[#14141e] border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#E32124]">АКЦИЯ #{idx + 1}</span>
                    <span className="text-[10px] text-zinc-500">Код: {promo.code}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-zinc-400 block mb-1">Заголовок</label>
                      <input
                        type="text"
                        value={promo.title}
                        onChange={(e) => {
                          const newPromos = [...promosState];
                          newPromos[idx].title = e.target.value;
                          setPromosState(newPromos);
                        }}
                        className="w-full bg-[#0a0a0f] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-zinc-400 block mb-1">Скидка / Бейдж</label>
                      <input
                        type="text"
                        value={promo.discount}
                        onChange={(e) => {
                          const newPromos = [...promosState];
                          newPromos[idx].discount = e.target.value;
                          setPromosState(newPromos);
                        }}
                        className="w-full bg-[#0a0a0f] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-zinc-400 block mb-1">Описание</label>
                    <input
                      type="text"
                      value={promo.description}
                      onChange={(e) => {
                        const newPromos = [...promosState];
                        newPromos[idx].description = e.target.value;
                        setPromosState(newPromos);
                      }}
                      className="w-full bg-[#0a0a0f] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 7: BACKUP, RESTORE & SECURITY */}
          {activeTab === 'backup_security' && (
            <div className="space-y-6 font-mono">
              
              {/* Instant JSON Backup Export & Import */}
              <div className="p-5 rounded-2xl bg-[#12121e] border border-white/10 space-y-4">
                <span className="text-xs font-bold text-white uppercase block">
                  Резервное копирование и восстановление всей базы CMS:
                </span>
                <p className="text-xs text-zinc-400">
                  Вы можете в 1 клик скачать файл бэкапа с полным прайс-листом всех 3 клубов, галереями фото, контактами и турнирами, либо загрузить ранее сохраненный бэкап.
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={handleExportJSON}
                    className="px-4 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-xs text-white font-bold uppercase transition-all flex items-center gap-2 cursor-pointer border border-white/10"
                  >
                    <Download className="w-4 h-4 text-[#E32124]" />
                    <span>Скачать JSON бэкап</span>
                  </button>

                  <input
                    type="file"
                    ref={jsonImportInputRef}
                    onChange={handleImportJSONFile}
                    accept=".json,application/json"
                    className="hidden"
                  />

                  <button
                    onClick={() => jsonImportInputRef.current?.click()}
                    className="px-4 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-xs text-white font-bold uppercase transition-all flex items-center gap-2 cursor-pointer border border-white/10"
                  >
                    <Upload className="w-4 h-4 text-sky-400" />
                    <span>Загрузить JSON из файла</span>
                  </button>

                  <button
                    onClick={() => setResetConfirmOpen(true)}
                    className="px-4 py-2.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-xs text-red-300 font-bold uppercase transition-all flex items-center gap-2 cursor-pointer border border-red-500/30 ml-auto"
                  >
                    <RotateCcw className="w-4 h-4 text-red-400" />
                    <span>Сбросить к заводским настройкам</span>
                  </button>
                </div>
              </div>

              {/* Secret Direct URL */}
              <div className="p-5 rounded-2xl bg-[#12121e] border border-white/10 space-y-3">
                <span className="text-xs font-bold text-white block">Секретная ссылка владельца для прямого входа:</span>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={`${window.location.origin}/#admin?key=${MASTER_SECRET_KEY}`}
                    className="w-full bg-[#0a0a0f] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-zinc-300 select-all"
                  />
                  <button
                    onClick={copySecretLink}
                    className="px-4 py-2.5 rounded-xl bg-[#E32124] hover:bg-[#FF2A2E] text-white text-xs font-bold uppercase transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
                  >
                    {copiedLink ? (
                      <>
                        <CheckCheck className="w-4 h-4 text-emerald-300" />
                        <span>Скопировано!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Скопировать</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Change PIN Code */}
              <div className="p-5 rounded-2xl bg-[#12121e] border border-white/10 space-y-3">
                <span className="text-xs font-bold text-white block">Сменить PIN-код администратора:</span>
                <div className="flex items-center gap-3">
                  <input
                    type="password"
                    maxLength={8}
                    placeholder="Новый PIN (мин. 4 цифры)"
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value)}
                    className="w-48 bg-[#0a0a0f] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white"
                  />
                  <button
                    onClick={handleUpdatePin}
                    className="px-4 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-white text-xs font-bold uppercase transition-all cursor-pointer"
                  >
                    Обновить PIN
                  </button>
                  {pinChangeSuccess && (
                    <span className="text-xs text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      PIN успешно изменён!
                    </span>
                  )}
                </div>
              </div>

              {/* Logout */}
              <div className="pt-2">
                <button
                  onClick={onLogout}
                  className="px-5 py-3 rounded-2xl bg-red-950/60 hover:bg-red-900/80 border border-red-500/40 text-red-300 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Завершить сессию владельца (Выйти)</span>
                </button>
              </div>

            </div>
          )}

        </div>

        {/* Modal Bottom Save Bar */}
        <div className="p-4 sm:p-5 border-t border-white/10 bg-[#0c0c16] flex flex-wrap items-center justify-between gap-3 font-mono shrink-0">
          <button
            onClick={handleExportJSON}
            className="px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs text-zinc-300 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#E32124]" />
            <span>Экспорт JSON</span>
          </button>

          <div className="flex items-center gap-3">
            {savedSuccess && (
              <span className="text-xs text-emerald-400 flex items-center gap-1.5 animate-pulse font-bold">
                <CheckCircle2 className="w-4 h-4" />
                Все данные успешно сохранены и применены!
              </span>
            )}

            <button
              onClick={handleSaveAll}
              className="py-2.5 px-6 rounded-2xl font-bold text-xs uppercase tracking-[0.15em] text-white bg-[#E32124] hover:bg-[#FF2A2E] transition-all shadow-lg shadow-red-600/30 flex items-center gap-2 active:scale-95 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Сохранить всё и применить</span>
            </button>
          </div>
        </div>

      </div>

      {/* Reset Confirmation Dialog */}
      {resetConfirmOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#12121e] border border-red-500/50 rounded-2xl p-6 max-w-md w-full space-y-4 font-mono shadow-2xl">
            <h4 className="text-base font-bold text-white uppercase flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-red-500" />
              <span>Подтверждение сброса</span>
            </h4>
            <p className="text-xs text-zinc-300">
              Вы действительно хотите сбросить все прайс-листы, ссылки, зоны и настройки к исходным заводским данным? Это действие перезапишет локальные изменения.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setResetConfirmOpen(false)}
                className="px-4 py-2 rounded-xl bg-white/10 text-xs text-zinc-300 hover:text-white"
              >
                Отмена
              </button>
              <button
                onClick={() => {
                  setResetConfirmOpen(false);
                  onRestoreAllDefaults();
                  setPricesState(DEFAULT_PRICES);
                  setLinksState(DEFAULT_LINKS);
                  setArenasState(ARENAS);
                  setZonesState(ZONES);
                  setTournamentState(UPCOMING_TOURNAMENT);
                  setPromosState(PROMOTIONS);
                  sound.playTrigger();
                  setSavedSuccess(true);
                  setTimeout(() => setSavedSuccess(false), 2000);
                }}
                className="px-4 py-2 rounded-xl bg-[#E32124] text-xs text-white font-bold"
              >
                Сбросить к умолчанию
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
