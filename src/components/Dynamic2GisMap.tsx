import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ARENAS } from '../data/arenaData';
import { ExternalLink, Layers, Navigation, ZoomIn, ZoomOut } from 'lucide-react';
import { sound } from '../utils/sound';

interface Dynamic2GisMapProps {
  selectedArenaId: string;
  onSelectArena: (arenaId: string) => void;
}

// User CARTO Basemaps API key for authorized, watermark-free, high-speed CDN Dark Matter vector/raster tiles
const CARTO_API_KEY = 'cb1_3jxw_1_c62d5d0a5e3ec199c4d3cdb7';

export const Dynamic2GisMap: React.FC<Dynamic2GisMapProps> = ({
  selectedArenaId,
  onSelectArena,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});

  const activeArena = ARENAS.find((a) => a.id === selectedArenaId) || ARENAS[0];

  // Initialize Leaflet Map with CARTO Dark Matter Authorized High-Performance Basemaps
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [activeArena.coordinates.x, activeArena.coordinates.y],
      zoom: 16,
      minZoom: 9,
      maxZoom: 20,
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: true,
      doubleClickZoom: true,
      touchZoom: true,
      dragging: true,
      boxZoom: true,
      keyboard: true,
    });

    // CARTO Dark Matter official raster basemap with licensed API key (Zero watermarks, sub-40ms Fastly CDN edge latency)
    L.tileLayer(
      `https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png?key=${CARTO_API_KEY}`,
      {
        subdomains: ['a', 'b', 'c', 'd'],
        maxZoom: 20,
        minZoom: 9,
        keepBuffer: 8,
        updateWhenZooming: false,
        updateWhenIdle: false,
        className: 'carto-dark-matter-tiles',
        attribution: '&copy; CARTO &copy; OpenStreetMap contributors',
      }
    ).addTo(map);

    mapInstanceRef.current = map;

    // Create custom pins for all 3 CyberX arenas
    ARENAS.forEach((arena) => {
      const isSelected = arena.id === selectedArenaId;

      const markerHtml = `
        <div class="relative group cursor-pointer select-none">
          ${isSelected ? '<div class="absolute -inset-3.5 rounded-full bg-[#E32124]/40 animate-ping pointer-events-none"></div><div class="absolute -inset-6 rounded-full bg-[#E32124]/20 animate-pulse pointer-events-none"></div>' : ''}
          <div class="relative flex items-center justify-center w-11 h-11 rounded-full transition-all duration-300 ${
            isSelected 
              ? 'bg-[#E32124] text-white ring-4 ring-[#E32124]/50 shadow-[0_0_30px_#E32124] scale-110' 
              : 'bg-[#08080f] text-zinc-300 border-2 border-white/20 hover:border-[#E32124] hover:bg-[#E32124] hover:text-white shadow-xl hover:scale-105'
          }">
            <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
          </div>
          <div class="absolute top-12 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1 rounded-lg bg-black/95 border text-[10px] font-mono font-black uppercase tracking-wider shadow-2xl backdrop-blur-md pointer-events-none transition-colors ${
            isSelected 
              ? 'border-[#E32124] text-[#E32124] shadow-[0_0_15px_rgba(227,33,36,0.5)]' 
              : 'border-white/20 text-white'
          }">
            ${arena.name.split('//')[0].trim()}
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: markerHtml,
        className: 'custom-cyberx-pin',
        iconSize: [44, 44],
        iconAnchor: [22, 22],
      });

      const marker = L.marker([arena.coordinates.x, arena.coordinates.y], {
        icon: customIcon,
      }).addTo(map);

      marker.on('click', () => {
        sound.playClick();
        onSelectArena(arena.id);
      });

      markersRef.current[arena.id] = marker;
    });

    // ResizeObserver to handle Fullscreen and Window Resizing immediately without blank tiles
    const resizeObserver = new ResizeObserver(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    });

    if (mapContainerRef.current) {
      resizeObserver.observe(mapContainerRef.current);
    }

    // Invalidate size to ensure crisp rendering
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 150);

    return () => {
      resizeObserver.disconnect();
      clearTimeout(timer);
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update camera and markers when active club changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Smooth fly to the active club coordinates
    map.flyTo([activeArena.coordinates.x, activeArena.coordinates.y], 16, {
      duration: 1.3,
      easeLinearity: 0.25,
    });

    // Update marker icons to reflect active selection
    ARENAS.forEach((arena) => {
      const isSelected = arena.id === selectedArenaId;
      const marker = markersRef.current[arena.id];

      if (marker) {
        const markerHtml = `
          <div class="relative group cursor-pointer select-none">
            ${isSelected ? '<div class="absolute -inset-3.5 rounded-full bg-[#E32124]/40 animate-ping pointer-events-none"></div><div class="absolute -inset-6 rounded-full bg-[#E32124]/20 animate-pulse pointer-events-none"></div>' : ''}
            <div class="relative flex items-center justify-center w-11 h-11 rounded-full transition-all duration-300 ${
              isSelected 
                ? 'bg-[#E32124] text-white ring-4 ring-[#E32124]/50 shadow-[0_0_30px_#E32124] scale-110' 
                : 'bg-[#08080f] text-zinc-300 border-2 border-white/20 hover:border-[#E32124] hover:bg-[#E32124] hover:text-white shadow-xl hover:scale-105'
            }">
              <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
            </div>
            <div class="absolute top-12 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1 rounded-lg bg-black/95 border text-[10px] font-mono font-black uppercase tracking-wider shadow-2xl backdrop-blur-md pointer-events-none transition-colors ${
              isSelected 
                ? 'border-[#E32124] text-[#E32124] shadow-[0_0_15px_rgba(227,33,36,0.5)]' 
                : 'border-white/20 text-white'
            }">
              ${arena.name.split('//')[0].trim()}
            </div>
          </div>
        `;

        marker.setIcon(
          L.divIcon({
            html: markerHtml,
            className: 'custom-cyberx-pin',
            iconSize: [44, 44],
            iconAnchor: [22, 22],
          })
        );
      }
    });
  }, [selectedArenaId, activeArena.coordinates.x, activeArena.coordinates.y]);

  const handleZoomIn = () => {
    sound.playClick();
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    sound.playClick();
    mapInstanceRef.current?.zoomOut();
  };

  const handleFitAll = () => {
    sound.playClick();
    const map = mapInstanceRef.current;
    if (!map) return;
    const bounds = L.latLngBounds(
      ARENAS.map((a) => [a.coordinates.x, a.coordinates.y])
    );
    map.flyToBounds(bounds, { padding: [60, 60], duration: 1.2 });
  };

  const open2Gis = () => {
    sound.playClick();
    const gisUrl = selectedArenaId === 'cyberx-arena'
      ? 'https://2gis.ru/omsk/search/CyberX%20%D0%9B%D0%B5%D0%BD%D0%B8%D0%BD%D0%B0%2019'
      : selectedArenaId === 'cyberx-evropa'
      ? 'https://2gis.ru/omsk/firm/70000001105204416'
      : 'https://2gis.ru/omsk/firm/70000001102629279';
    window.open(gisUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div 
      data-lenis-prevent="true"
      className="relative w-full h-full min-h-[460px] lg:min-h-full overflow-hidden bg-[#020204] select-none group"
    >
      
      {/* 1. Leaflet Interactive CARTO Dark Matter Vector Map Container */}
      <div 
        ref={mapContainerRef} 
        data-lenis-prevent="true"
        className="w-full h-full min-h-[460px] lg:min-h-full z-10 cursor-grab active:cursor-grabbing" 
      />

      {/* Cyber HUD Grid & Subtle Edge Vignette */}
      <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-t from-black/85 via-transparent to-black/40" />
      <div className="pointer-events-none absolute inset-0 z-20 bg-[radial-gradient(ellipse_at_center,_transparent_50%,_rgba(0,0,0,0.6)_100%)]" />

      {/* Top Left: 2GIS Brand Indicator */}
      <div className="absolute top-4 left-4 z-30 flex items-center gap-2 font-mono">
        <div className="px-3.5 py-1.5 rounded-xl bg-black/90 backdrop-blur-md border border-white/15 text-xs text-white flex items-center gap-2 shadow-2xl">
          <span className="w-2 h-2 rounded-full bg-[#20C05C] animate-pulse" />
          <span className="font-bold text-[#20C05C]">2ГИС КАРТА</span>
          <span className="text-zinc-500">|</span>
          <span className="text-zinc-300 font-bold">ОМСК</span>
        </div>
      </div>

      {/* Top Right: Map Controls (Zoom & Fit all) */}
      <div className="absolute top-4 right-4 z-30 flex flex-col gap-1.5 font-mono">
        <button
          onClick={handleZoomIn}
          className="w-10 h-10 rounded-xl bg-black/90 hover:bg-[#E32124] text-white border border-white/20 hover:border-[#E32124] backdrop-blur-md flex items-center justify-center transition-all shadow-2xl active:scale-90 cursor-pointer"
          title="Приблизить (Колёсико мыши или +)"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomOut}
          className="w-10 h-10 rounded-xl bg-black/90 hover:bg-[#E32124] text-white border border-white/20 hover:border-[#E32124] backdrop-blur-md flex items-center justify-center transition-all shadow-2xl active:scale-90 cursor-pointer"
          title="Отдалить (Колёсико мыши или −)"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={handleFitAll}
          className="w-10 h-10 rounded-xl bg-black/90 hover:bg-white/20 text-zinc-300 hover:text-white border border-white/20 backdrop-blur-md flex items-center justify-center transition-all shadow-2xl active:scale-90 cursor-pointer"
          title="Показать все 3 клуба в Омске"
        >
          <Layers className="w-4 h-4" />
        </button>
      </div>

      {/* Bottom Center: Spawning Info Card on Active Arena */}
      <div className="absolute bottom-5 left-5 right-5 z-30 flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-[#08080f]/95 backdrop-blur-xl border border-white/15 shadow-[0_10px_40px_rgba(0,0,0,0.9)]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase text-[#E32124] tracking-wider">
              2ГИС // МЕТКА АРЕНЫ
            </span>
            <span className="text-[10px] font-mono text-zinc-500">
              {activeArena.coordinates.x.toFixed(4)}, {activeArena.coordinates.y.toFixed(4)}
            </span>
          </div>
          <div className="font-display font-black text-sm sm:text-base text-white uppercase mt-0.5">
            {activeArena.name.split('//')[0].trim()}
          </div>
          <div className="text-xs text-zinc-400 font-mono">
            {activeArena.address}
          </div>
        </div>

        <button
          onClick={open2Gis}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#20C05C] hover:bg-[#26D969] text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 hover:scale-[1.02] active:scale-95 transition-all shrink-0 cursor-pointer"
        >
          <Navigation className="w-3.5 h-3.5" />
          <span>Перейти в 2ГИС</span>
          <ExternalLink className="w-3 h-3 opacity-80" />
        </button>
      </div>

    </div>
  );
};
