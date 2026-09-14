import React from 'react';

interface ElegantDarkPatternProps {
  children?: React.ReactNode;
  className?: string;
  variant?: 'subtle' | 'crimson' | 'nebula' | 'grid';
}

export const ElegantDarkPattern: React.FC<ElegantDarkPatternProps> = ({
  children,
  className = '',
  variant = 'crimson',
}) => {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      
      {/* 1. Base Deep Obsidian Background */}
      <div className="absolute inset-0 bg-[#040407] pointer-events-none" />

      {/* 2. Seamless Mathematical Radial Gradients (100% Smooth, Zero Boxy Tile Artifacts) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        {variant === 'crimson' && (
          <>
            {/* Top-Left Ambient Orb */}
            <div 
              className="absolute -top-40 -left-40 w-[650px] h-[650px] opacity-70 pointer-events-none"
              style={{
                background: 'radial-gradient(circle at 35% 35%, rgba(227, 33, 36, 0.12) 0%, rgba(227, 33, 36, 0.04) 45%, transparent 70%)',
              }}
            />
            {/* Center-Right Crimson Glow */}
            <div 
              className="absolute top-1/4 -right-32 w-[750px] h-[750px] opacity-60 pointer-events-none"
              style={{
                background: 'radial-gradient(circle at 65% 50%, rgba(180, 20, 24, 0.10) 0%, rgba(120, 10, 14, 0.03) 50%, transparent 75%)',
              }}
            />
            {/* Bottom-Center Subtle Warmth */}
            <div 
              className="absolute -bottom-32 left-1/4 w-[700px] h-[700px] opacity-60 pointer-events-none"
              style={{
                background: 'radial-gradient(circle at 50% 50%, rgba(227, 33, 36, 0.08) 0%, rgba(140, 15, 18, 0.02) 50%, transparent 70%)',
              }}
            />
          </>
        )}

        {variant === 'nebula' && (
          <>
            <div 
              className="absolute top-0 right-1/4 w-[800px] h-[600px] opacity-70 pointer-events-none"
              style={{
                background: 'radial-gradient(circle at 50% 40%, rgba(200, 25, 28, 0.09) 0%, rgba(100, 10, 15, 0.03) 50%, transparent 70%)',
              }}
            />
            <div 
              className="absolute bottom-0 left-1/4 w-[800px] h-[550px] opacity-60 pointer-events-none"
              style={{
                background: 'radial-gradient(circle at 50% 60%, rgba(147, 14, 16, 0.08) 0%, rgba(30, 20, 45, 0.04) 50%, transparent 70%)',
              }}
            />
          </>
        )}

        {variant === 'subtle' && (
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] opacity-60 pointer-events-none"
            style={{
              background: 'radial-gradient(circle at 50% 50%, rgba(227, 33, 36, 0.07) 0%, rgba(227, 33, 36, 0.02) 50%, transparent 70%)',
            }}
          />
        )}

        {/* 3. Subtle Cyber Dot Mesh Pattern Overlay */}
        <div 
          className="absolute inset-0 opacity-[0.035] mix-blend-screen pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)`,
            backgroundSize: '32px 32px',
          }}
        />

        {/* 4. Elegant Soft Vignette Mask */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 40%, rgba(4, 4, 7, 0.85) 100%)',
          }}
        />
      </div>

      {/* Content Container */}
      <div className="relative z-10">
        {children}
      </div>

    </div>
  );
};
