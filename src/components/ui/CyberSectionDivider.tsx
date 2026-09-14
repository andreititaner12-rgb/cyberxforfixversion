import React from 'react';

interface CyberSectionDividerProps {
  tag?: string;
}

export const CyberSectionDivider: React.FC<CyberSectionDividerProps> = ({ 
  tag,
}) => {
  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-3 sm:my-5 select-none pointer-events-none z-10">
      <div className="relative flex items-center justify-center">
        
        {/* Left Glowing Crimson Line */}
        <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#E32124]/30 to-[#E32124] shadow-[0_0_8px_#E32124]" />

        {/* Center Cyber Telemetry Pill */}
        {tag ? (
          <div className="mx-4 px-3.5 py-1 rounded-full bg-[#0d0910] border border-[#E32124]/40 flex items-center justify-center shadow-[0_0_15px_rgba(227,33,36,0.25)]">
            <span className="font-mono text-[10px] sm:text-[11px] font-bold text-[#E32124] tracking-[0.25em] uppercase">
              {tag}
            </span>
          </div>
        ) : (
          <div className="mx-4 h-[1px] w-6 bg-[#E32124]/40" />
        )}

        {/* Right Glowing Crimson Line */}
        <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent via-[#E32124]/30 to-[#E32124] shadow-[0_0_8px_#E32124]" />

      </div>
    </div>
  );
};
