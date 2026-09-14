import React, { useState, useRef, useEffect, useCallback } from 'react';
import { sound } from '../../utils/sound';
import { Zap, MousePointerClick, RefreshCw } from 'lucide-react';

interface Shockwave {
  x: number;
  y: number;
  radius: number;
  opacity: number;
}

export const DisplaySmoothnessSimulator: React.FC = () => {
  const [hzValue, setHzValue] = useState<number>(600);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isHoveredRef = useRef<boolean>(false);
  const isVisibleRef = useRef<boolean>(false);
  const statusBadgeRef = useRef<HTMLSpanElement>(null);

  const hzRef = useRef<number>(600);
  hzRef.current = hzValue;

  const physicsRef = useRef({
    x: 200,
    y: 80,
    vx: 3.5,
    vy: 1.5,
  });

  const shockwavesRef = useRef<Shockwave[]>([]);
  const trailRef = useRef<{ x: number; y: number }[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set stable canvas internal buffer dimensions matching container
    const updateCanvasSize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      if (rect.width > 0 && rect.height > 0) {
        canvas.width = Math.floor(rect.width * dpr);
        canvas.height = Math.floor(rect.height * dpr);
      }
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    // Observer to completely pause rendering when offscreen
    const observer = new IntersectionObserver(([entry]) => {
      isVisibleRef.current = entry.isIntersecting;
    }, { threshold: 0.05 });

    observer.observe(canvas);

    let animId: number;
    let lastTime = performance.now();

    const render = (time: number) => {
      animId = requestAnimationFrame(render);
      
      // Zero rendering when offscreen
      if (!isVisibleRef.current) return;

      const dt = Math.min(32, time - lastTime);
      lastTime = time;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;

      if (width <= 0 || height <= 0) return;

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      const phys = physicsRef.current;
      const hz = hzRef.current;
      const speedMult = dt / 16.67;

      // Update position
      phys.x += phys.vx * speedMult;
      phys.y += phys.vy * speedMult;

      // Friction & glide
      const friction = isHoveredRef.current ? 0.996 : 0.985;
      phys.vx *= friction;
      phys.vy *= friction;

      // Maintain minimum ambient glide so ball stays lively
      const currentSpeed = Math.sqrt(phys.vx * phys.vx + phys.vy * phys.vy);
      if (currentSpeed < 1.2) {
        const angle = Math.atan2(phys.vy, phys.vx) || 0.5;
        phys.vx = Math.cos(angle) * 1.8;
        phys.vy = Math.sin(angle) * 1.8;
      }

      const radius = 18;

      // Boundary collisions with smooth bounce
      if (phys.x - radius <= 0) {
        phys.x = radius;
        phys.vx = Math.abs(phys.vx) * 0.95 + 0.4;
      } else if (phys.x + radius >= width) {
        phys.x = width - radius;
        phys.vx = -Math.abs(phys.vx) * 0.95 - 0.4;
      }

      if (phys.y - radius <= 0) {
        phys.y = radius;
        phys.vy = Math.abs(phys.vy) * 0.95 + 0.4;
      } else if (phys.y + radius >= height) {
        phys.y = height - radius;
        phys.vy = -Math.abs(phys.vy) * 0.95 - 0.4;
      }

      // Trail calculation
      const maxTrail = hz === 600 ? 10 : hz >= 360 ? 14 : 22;
      trailRef.current.push({ x: phys.x, y: phys.y });
      if (trailRef.current.length > maxTrail) {
        trailRef.current.shift();
      }

      // 1. Draw Shockwaves
      shockwavesRef.current = shockwavesRef.current
        .map((sw) => ({
          ...sw,
          radius: sw.radius + 5.5,
          opacity: sw.opacity - 0.04,
        }))
        .filter((sw) => sw.opacity > 0);

      shockwavesRef.current.forEach((sw) => {
        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(227, 33, 36, ${sw.opacity * 0.85})`;
        ctx.lineWidth = 2.5;
        ctx.stroke();
      });

      // 2. Draw Motion Trail
      const trail = trailRef.current;
      for (let i = 0; i < trail.length; i++) {
        const pt = trail[i];
        const ratio = (i + 1) / trail.length;
        const alpha = ratio * (hz >= 480 ? 0.25 : 0.45);

        ctx.beginPath();
        ctx.arc(pt.x, pt.y, radius * (0.6 + ratio * 0.4), 0, Math.PI * 2);
        ctx.fillStyle = hz >= 360 ? `rgba(227, 33, 36, ${alpha})` : `rgba(140, 140, 150, ${alpha})`;
        ctx.fill();
      }

      // 3. Draw Sphere
      ctx.beginPath();
      ctx.arc(phys.x, phys.y, radius, 0, Math.PI * 2);
      const grad = ctx.createRadialGradient(phys.x - 4, phys.y - 4, 2, phys.x, phys.y, radius);
      grad.addColorStop(0, '#FF4D50');
      grad.addColorStop(0.7, '#E32124');
      grad.addColorStop(1, '#8A0E10');
      ctx.fillStyle = grad;
      ctx.fill();

      // Center white glint
      ctx.beginPath();
      ctx.arc(phys.x - 4, phys.y - 4, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();

      ctx.restore();
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', updateCanvasSize);
      observer.disconnect();
    };
  }, []);

  const handleMouseEnter = () => {
    isHoveredRef.current = true;
    if (statusBadgeRef.current) {
      statusBadgeRef.current.textContent = 'АКТИВЕН';
      statusBadgeRef.current.className = 'text-[10px] px-2 py-0.5 rounded-full border flex items-center gap-1 font-bold bg-emerald-500/10 border-emerald-500/30 text-emerald-400';
    }
  };

  const handleMouseLeave = () => {
    isHoveredRef.current = false;
    if (statusBadgeRef.current) {
      statusBadgeRef.current.textContent = 'ОЖИДАНИЕ НАВЕДЕНИЯ';
      statusBadgeRef.current.className = 'text-[10px] px-2 py-0.5 rounded-full border flex items-center gap-1 font-bold bg-zinc-800/80 border-white/10 text-zinc-500';
    }
  };

  const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    sound.playClick();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Add Shockwave
    shockwavesRef.current.push({
      x: clickX,
      y: clickY,
      radius: 6,
      opacity: 1,
    });

    // Apply immediate physics momentum impulse
    const phys = physicsRef.current;
    const dx = phys.x - clickX;
    const dy = phys.y - clickY;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    const force = Math.max(16, Math.min(36, 450 / dist));

    phys.vx += (dx / dist) * force;
    phys.vy += (dy / dist) * force;
  }, []);

  const handleCanvasTouch = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    sound.playClick();
    const canvas = canvasRef.current;
    if (!canvas || e.touches.length === 0) return;
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const clickX = touch.clientX - rect.left;
    const clickY = touch.clientY - rect.top;

    isHoveredRef.current = true;

    // Add Shockwave
    shockwavesRef.current.push({
      x: clickX,
      y: clickY,
      radius: 6,
      opacity: 1,
    });

    // Apply immediate physics momentum impulse
    const phys = physicsRef.current;
    const dx = phys.x - clickX;
    const dy = phys.y - clickY;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    const force = Math.max(16, Math.min(36, 450 / dist));

    phys.vx += (dx / dist) * force;
    phys.vy += (dy / dist) * force;
  }, []);

  const resetBall = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playClick();
    const canvas = canvasRef.current;
    const w = canvas ? canvas.clientWidth : 500;
    const h = canvas ? canvas.clientHeight : 160;

    physicsRef.current = {
      x: w / 2,
      y: h / 2,
      vx: 4.8,
      vy: -2.2,
    };
  };

  return (
    <div className="space-y-4 font-mono select-none">
      
      {/* Top Controls & Matrix Smoothness Readout */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-[#E32124]" />
          <span className="text-xs uppercase tracking-wider text-zinc-300 font-bold">
            Симулятор плавности матрицы:
          </span>
          <span 
            ref={statusBadgeRef}
            className="text-[10px] px-2 py-0.5 rounded-full border flex items-center gap-1 font-bold bg-zinc-800/80 border-white/10 text-zinc-500"
          >
            ОЖИДАНИЕ НАВЕДЕНИЯ
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#E32124] bg-[#E32124]/10 px-3 py-1 rounded-xl border border-[#E32124]/30 shadow-sm shadow-red-600/20">
            {hzValue} FPS // {(1000 / hzValue).toFixed(2)} мс
          </span>
        </div>
      </div>

      {/* High-Performance Canvas Sandbox (Rock-Solid Fixed Height, 0 Layout Shifts, 0 Lag) */}
      <div 
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="group relative h-44 sm:h-48 rounded-3xl border border-white/10 hover:border-[#E32124]/60 bg-[#07070d] hover:bg-[#090912] transition-colors duration-200 overflow-hidden shadow-2xl flex items-center justify-center transform-gpu"
      >
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          onTouchStart={handleCanvasTouch}
          onTouchMove={handleCanvasTouch}
          className="w-full h-full cursor-crosshair block"
        />

        {/* Bottom Interactive Hint */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[10px] text-zinc-400 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 pointer-events-none">
          <span className="flex items-center gap-1.5 text-zinc-200 truncate">
            <MousePointerClick className="w-3.5 h-3.5 text-[#E32124] shrink-0" />
            <span className="truncate">
              Кликайте или коснитесь поля для создания ударной волны
            </span>
          </span>
          
          <button
            onClick={resetBall}
            className="pointer-events-auto p-1 rounded hover:bg-white/10 text-zinc-400 hover:text-white transition-colors flex items-center gap-1 cursor-pointer shrink-0 ml-2"
            title="Сбросить шар в центр"
          >
            <RefreshCw className="w-3 h-3 text-[#E32124]" />
            <span>В центр</span>
          </button>
        </div>
      </div>

      {/* Hz Frequency Selector Tabs */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        {[60, 144, 240, 360, 480, 600].map((val) => (
          <button
            key={val}
            onClick={() => {
              sound.playClick();
              setHzValue(val);
            }}
            className={`flex-1 min-w-[70px] py-2 text-xs font-mono font-bold rounded-xl transition-all border cursor-pointer ${
              hzValue === val
                ? 'bg-[#E32124] text-white border-[#E32124] shadow-lg shadow-red-600/40 scale-105'
                : 'bg-white/[0.04] text-zinc-400 border-white/[0.08] hover:bg-white/[0.08] hover:text-white'
            }`}
          >
            {val}Hz
          </button>
        ))}
      </div>

    </div>
  );
};
