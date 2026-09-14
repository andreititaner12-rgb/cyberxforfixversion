import { useState, useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { BrandManifesto } from './components/BrandManifesto';
import { ArenaEcosystem } from './components/ArenaEcosystem';
import { ZonesShowcase } from './components/ZonesShowcase';
import { SimRacingBanner } from './components/SimRacingBanner';
import { HardwareVisualizer } from './components/HardwareVisualizer';
import { TournamentCard } from './components/TournamentCard';
import { PriceSection } from './components/PriceSection';
import { PromoSection } from './components/PromoSection';
import { LocationMapSection } from './components/LocationMapSection';
import { Footer } from './components/Footer';
import { BookingModal } from './components/BookingModal';
import { TournamentModal } from './components/TournamentModal';
import { OwnerAdminModal } from './components/OwnerAdminModal';
import { OwnerSecurityGate, MASTER_SECRET_KEY } from './components/OwnerSecurityGate';
import { CustomCrosshairCursor } from './components/CustomCrosshairCursor';
import { Preloader } from './components/Preloader';
import { CyberSectionDivider } from './components/ui/CyberSectionDivider';
import { CyberBackground } from './components/ui/CyberBackground';
import { 
  UPCOMING_TOURNAMENT, 
  PROMOTIONS, 
  ZONES, 
  ARENAS, 
  DEFAULT_PRICES, 
  DEFAULT_LINKS 
} from './data/arenaData';
import { 
  ZoneType, 
  ArenaLocation, 
  SiteLinks, 
  AllPricesData, 
  Tournament, 
  Promotion 
} from './types';
import { sound } from './utils/sound';
import { Shield } from 'lucide-react';

export function App() {
  const [loading, setLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const audioPlayedRef = useRef(false);
  const lenisRef = useRef<Lenis | null>(null);

  // Smooth Top Scroll Progress Tracker
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    restDelta: 0.001,
  });
  const progressOpacity = useTransform(scrollYProgress, [0, 0.003], [0, 1]);

  // Modal states
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingArenaId, setBookingArenaId] = useState<string | undefined>(undefined);
  const [bookingZoneId, setBookingZoneId] = useState<string | undefined>(undefined);

  const [tournamentsOpen, setTournamentsOpen] = useState(false);
  const [targetTournamentId, setTargetTournamentId] = useState<string | undefined>(undefined);

  // Security Gate & Owner Dashboard State
  const [gateOpen, setGateOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [isOwnerAuth, setIsOwnerAuth] = useState(false);

  // Selected arena in the ecosystem (Default to CyberX Arena - Flagship)
  const [selectedArenaId] = useState<string>('cyberx-arena');

  // Dynamic state for live prices with localStorage persistence
  const [livePrices, setLivePrices] = useState<AllPricesData>(() => {
    try {
      const saved = localStorage.getItem('cyberx_live_prices');
      return saved ? JSON.parse(saved) : DEFAULT_PRICES;
    } catch {
      return DEFAULT_PRICES;
    }
  });

  // Dynamic state for live links & contacts with localStorage persistence
  const [liveLinks, setLiveLinks] = useState<SiteLinks>(() => {
    try {
      const saved = localStorage.getItem('cyberx_live_links');
      return saved ? JSON.parse(saved) : DEFAULT_LINKS;
    } catch {
      return DEFAULT_LINKS;
    }
  });

  // Dynamic state for live arenas with localStorage persistence
  const [liveArenas, setLiveArenas] = useState<ArenaLocation[]>(() => {
    try {
      const saved = localStorage.getItem('cyberx_live_arenas');
      return saved ? JSON.parse(saved) : ARENAS;
    } catch {
      return ARENAS;
    }
  });

  // Dynamic state for live zones with localStorage persistence
  const [liveZones, setLiveZones] = useState<ZoneType[]>(() => {
    try {
      const saved = localStorage.getItem('cyberx_live_zones');
      if (saved) {
        const parsed: ZoneType[] = JSON.parse(saved);
        return parsed.map(z => {
          const fresh = ZONES.find(f => f.id === z.id);
          return fresh && z.image?.includes('langame.ru') ? { ...z, image: fresh.image } : z;
        });
      }
      return ZONES;
    } catch {
      return ZONES;
    }
  });

  // Dynamic state for live tournament with localStorage persistence
  const [liveTournament, setLiveTournament] = useState<Tournament>(() => {
    try {
      const saved = localStorage.getItem('cyberx_live_tournament');
      return saved ? JSON.parse(saved) : UPCOMING_TOURNAMENT;
    } catch {
      return UPCOMING_TOURNAMENT;
    }
  });

  // Dynamic state for live promotions with localStorage persistence
  const [livePromos, setLivePromos] = useState<Promotion[]>(() => {
    try {
      const saved = localStorage.getItem('cyberx_live_promos');
      return saved ? JSON.parse(saved) : PROMOTIONS;
    } catch {
      return PROMOTIONS;
    }
  });

  // Reset to factory defaults handler
  const handleRestoreAllDefaults = () => {
    localStorage.removeItem('cyberx_live_prices');
    localStorage.removeItem('cyberx_live_links');
    localStorage.removeItem('cyberx_live_arenas');
    localStorage.removeItem('cyberx_live_zones');
    localStorage.removeItem('cyberx_live_tournament');
    localStorage.removeItem('cyberx_live_promos');

    setLivePrices(DEFAULT_PRICES);
    setLiveLinks(DEFAULT_LINKS);
    setLiveArenas(ARENAS);
    setLiveZones(ZONES);
    setLiveTournament(UPCOMING_TOURNAMENT);
    setLivePromos(PROMOTIONS);
  };

  // Import full JSON data handler
  const handleImportAllData = (data: {
    prices?: AllPricesData;
    links?: SiteLinks;
    arenas?: ArenaLocation[];
    zones?: ZoneType[];
    tournament?: Tournament;
    promotions?: Promotion[];
  }) => {
    if (data.prices) {
      setLivePrices(data.prices);
      localStorage.setItem('cyberx_live_prices', JSON.stringify(data.prices));
    }
    if (data.links) {
      setLiveLinks(data.links);
      localStorage.setItem('cyberx_live_links', JSON.stringify(data.links));
    }
    if (data.arenas) {
      setLiveArenas(data.arenas);
      localStorage.setItem('cyberx_live_arenas', JSON.stringify(data.arenas));
    }
    if (data.zones) {
      setLiveZones(data.zones);
      localStorage.setItem('cyberx_live_zones', JSON.stringify(data.zones));
    }
    if (data.tournament) {
      setLiveTournament(data.tournament);
      localStorage.setItem('cyberx_live_tournament', JSON.stringify(data.tournament));
    }
    if (data.promotions) {
      setLivePromos(data.promotions);
      localStorage.setItem('cyberx_live_promos', JSON.stringify(data.promotions));
    }
  };

  // Voice Intro Welcome audio (Single-trigger guarantee)
  const playWelcomeVoice = () => {
    if (audioPlayedRef.current || isMuted || sound.hasVoiceStarted()) return;
    audioPlayedRef.current = true;
    sound.playVoiceGreeting().catch(() => {});
  };

  // Check URL hash & session for secret admin access
  useEffect(() => {
    const isAuthed = localStorage.getItem('cyberx_owner_session') === 'authenticated';
    setIsOwnerAuth(isAuthed);

    const checkSecretUrl = () => {
      const hash = window.location.hash || '';
      const search = window.location.search || '';
      
      if (hash.includes('admin') || search.includes(MASTER_SECRET_KEY) || hash.includes(MASTER_SECRET_KEY)) {
        if (isAuthed) {
          setAdminOpen(true);
        } else {
          setGateOpen(true);
        }
      }
    };

    checkSecretUrl();
    window.addEventListener('hashchange', checkSecretUrl);
    return () => window.removeEventListener('hashchange', checkSecretUrl);
  }, []);

  // Smooth scroll using Lenis (with strict RAF cancellation)
  useEffect(() => {
    if (loading) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    let reqId: number;
    function raf(time: number) {
      lenis.raf(time);
      reqId = requestAnimationFrame(raf);
    }

    reqId = requestAnimationFrame(raf);

    // Handle resize / fullscreen transitions seamlessly
    const handleResize = () => {
      lenis.resize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener('resize', handleResize);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [loading]);

  // Pause / Resume Lenis when any modal is opened / closed
  useEffect(() => {
    const isAnyModalOpen = tournamentsOpen || bookingOpen || adminOpen || gateOpen;
    if (isAnyModalOpen) {
      lenisRef.current?.stop();
    } else {
      lenisRef.current?.start();
    }
  }, [tournamentsOpen, bookingOpen, adminOpen, gateOpen]);

  const handleOpenBooking = (arenaId?: string, zoneId?: string) => {
    setBookingArenaId(arenaId);
    setBookingZoneId(zoneId);
    setBookingOpen(true);
  };

  const handleOpenTournaments = (tournamentId?: string) => {
    setTargetTournamentId(tournamentId);
    setTournamentsOpen(true);
  };

  const handleOwnerLogout = () => {
    localStorage.removeItem('cyberx_owner_session');
    setIsOwnerAuth(false);
    setAdminOpen(false);
    setGateOpen(false);
    window.location.hash = '';
  };

  const handlePreloaderComplete = () => {
    setLoading(false);
    if (!audioPlayedRef.current && !sound.hasVoiceStarted()) {
      playWelcomeVoice();
    }
  };

  return (
    <div 
      onClick={() => {
        // Enable Web-Audio UI sounds on user gesture
        sound.setEnabled(!isMuted);
        if (!audioPlayedRef.current && !loading && !sound.hasVoiceStarted()) {
          playWelcomeVoice();
        }
      }}
      className="relative min-h-screen bg-[#020204] text-[#FEFEFE] selection:bg-[#E32124] selection:text-white cursor-default overflow-x-hidden"
    >
      
      {/* 1. CyberX CS2 Tactical Crosshair Reticle Cursor */}
      <CustomCrosshairCursor />

      {/* 2. Global Neon CyberX Top Scroll Progress Indicator (Replaces standard right scrollbar, 0 initial flicker) */}
      {!loading && (
        <motion.div
          style={{ scaleX, opacity: progressOpacity }}
          className="fixed top-0 left-0 right-0 h-[3px] sm:h-[3.5px] bg-gradient-to-r from-[#8B0000] via-[#E32124] to-[#FF4D4D] shadow-[0_0_14px_#E32124,0_0_24px_rgba(227,33,36,0.85)] z-[100] origin-left pointer-events-none"
        />
      )}

      {/* 3. CyberX Sleek Loading Screen */}
      {loading && <Preloader onComplete={handlePreloaderComplete} />}

      {/* 4. Top Header with macOS Blurry Mask & Retractable Navigation */}
      <Header
        onOpenBooking={() => handleOpenBooking()}
        onOpenTournaments={() => handleOpenTournaments()}
        isMuted={isMuted}
        onToggleMute={() => {
          const next = !isMuted;
          setIsMuted(next);
          sound.setEnabled(!next);
        }}
      />

      {/* 4. Full-Screen Cinematic Hero */}
      <Hero isReady={!loading} />

      {/* 5. Main Content Curtain with Smooth Native Scrolling (Deep Obsidian / Dark Titanium Canvas with Dot Matrix & Ambient Glows) */}
      <div 
        id="content-curtain"
        className="relative z-20 border-t border-white/[0.08] rounded-t-[32px] sm:rounded-t-[40px] shadow-[0_-30px_90px_rgba(0,0,0,0.98)] overflow-hidden bg-[#020204]"
      >
        {/* High-Tech Cyber Background with Dot Matrix, Ambient Glow Orbs & Gradient Canvas */}
        <CyberBackground />

        <main className="relative z-10 pt-4 pb-12">
          
          {/* A. Brand Manifesto */}
          <BrandManifesto />

          {/* Section Divider 01 */}
          <CyberSectionDivider tag="01" />

          {/* B. Three Arenas Ecosystem */}
          <ArenaEcosystem
            onOpenBooking={(arenaId) => handleOpenBooking(arenaId)}
            selectedArenaId={selectedArenaId}
            arenasList={liveArenas}
          />

          {/* Section Divider 02 */}
          <CyberSectionDivider tag="02" />

          {/* C. Spaces & Rooms Bento Showcase */}
          <ZonesShowcase
            onOpenBooking={(arenaId, zoneId) => handleOpenBooking(arenaId, zoneId)}
            zonesList={liveZones}
          />

          {/* Section Divider 03 */}
          <CyberSectionDivider tag="03" />

          {/* D. Dedicated Sim-Racing Banner */}
          <div id="sim-racing">
            <SimRacingBanner
              onOpenBooking={(arenaId, zoneId) => handleOpenBooking(arenaId, zoneId)}
            />
          </div>

          {/* Section Divider 04 */}
          <CyberSectionDivider tag="04" />

          {/* E. Interactive Hardware Visualizer */}
          <HardwareVisualizer />

          {/* Section Divider 05 */}
          <CyberSectionDivider tag="05" />

          {/* F. Standalone Upcoming Tournament Spotlight Card */}
          <TournamentCard
            onOpenRegister={(tId) => handleOpenTournaments(tId)}
            onOpenAllTournaments={() => handleOpenTournaments()}
            tournamentData={liveTournament}
          />

          {/* Section Divider 06 */}
          <CyberSectionDivider tag="06" />

          {/* G. Interactive Price List Section */}
          <PriceSection
            prices={livePrices}
            onOpenBooking={(arenaId, zoneId) => handleOpenBooking(arenaId, zoneId)}
          />

          {/* Section Divider 07 */}
          <CyberSectionDivider tag="07" />

          {/* H. Exclusive Offers & Promos */}
          <PromoSection
            onOpenBooking={() => handleOpenBooking()}
            promotionsList={livePromos}
          />

          {/* Section Divider 08 */}
          <CyberSectionDivider tag="08" />

          {/* I. Interactive 2GIS Navigation Map Section ("Как добраться?") */}
          <LocationMapSection
            onOpenBooking={(arenaId) => handleOpenBooking(arenaId)}
            arenasList={liveArenas}
          />

        </main>

        {/* Footer */}
        <Footer
          onOpenBooking={() => handleOpenBooking()}
          onOpenTournaments={() => handleOpenTournaments()}
          arenasList={liveArenas}
          siteLinks={liveLinks}
        />

      </div>

      {/* Floating Owner Badge (Only visible when authenticated as owner) */}
      {isOwnerAuth && (
        <div className="fixed bottom-6 right-6 z-40">
          <button
            onClick={() => setAdminOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-[#E32124] hover:bg-[#FF2A2E] text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-[0_0_30px_rgba(227,33,36,0.7)] hover:scale-105 active:scale-95 transition-all cursor-pointer border border-white/20"
          >
            <Shield className="w-4 h-4" />
            <span>⚡ РЕЖИМ ВЛАДЕЛЬЦА // CMS</span>
          </button>
        </div>
      )}

      {/* Interactive Booking Modal */}
      <BookingModal
        isOpen={bookingOpen}
        onClose={() => setBookingOpen(false)}
        defaultArenaId={bookingArenaId}
        defaultZoneId={bookingZoneId}
      />

      {/* Tournament Hub Modal */}
      <TournamentModal
        isOpen={tournamentsOpen}
        onClose={() => setTournamentsOpen(false)}
        targetTournamentId={targetTournamentId}
      />

      {/* Owner Security Gate Terminal (Triggered by Secret URL) */}
      {gateOpen && (
        <OwnerSecurityGate
          onSuccessAuth={() => {
            setIsOwnerAuth(true);
            setGateOpen(false);
            setAdminOpen(true);
          }}
          onCancel={() => {
            setGateOpen(false);
            window.location.hash = '';
          }}
        />
      )}

      {/* Owner Management Live CMS Panel */}
      <OwnerAdminModal
        isOpen={adminOpen}
        onClose={() => setAdminOpen(false)}
        currentPrices={livePrices}
        onSaveLivePrices={(updated) => setLivePrices(updated)}
        currentLinks={liveLinks}
        onSaveLiveLinks={(updated) => setLiveLinks(updated)}
        currentArenas={liveArenas}
        onSaveLiveArenas={(updated) => setLiveArenas(updated)}
        currentZones={liveZones}
        onSaveLiveZones={(updated) => setLiveZones(updated)}
        currentTournament={liveTournament}
        onSaveLiveTournament={(updated) => setLiveTournament(updated)}
        currentPromos={livePromos}
        onSaveLivePromos={(updated) => setLivePromos(updated)}
        onRestoreAllDefaults={handleRestoreAllDefaults}
        onImportAllData={handleImportAllData}
        onLogout={handleOwnerLogout}
      />

    </div>
  );
}
export default App;
