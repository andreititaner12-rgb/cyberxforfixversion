import React, { useState, useMemo } from 'react';

interface BackgroundRippleEffectProps {
  rows?: number;
  cols?: number;
  cellSize?: number;
  className?: string;
}

export const BackgroundRippleEffect: React.FC<BackgroundRippleEffectProps> = ({
  rows = 18,
  cols = 32,
  cellSize = 52,
  className = '',
}) => {
  const [clickedCell, setClickedCell] = useState<{
    row: number;
    col: number;
    key: number;
  } | null>(null);

  const handleCellClick = (row: number, col: number) => {
    setClickedCell({ row, col, key: Date.now() });
  };

  const cells = useMemo(() => {
    const grid: { row: number; col: number }[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        grid.push({ row: r, col: c });
      }
    }
    return grid;
  }, [rows, cols]);

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden select-none ${className}`}
      style={{
        maskImage: 'radial-gradient(ellipse 90% 80% at 50% 40%, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 65%, transparent 100%)',
        WebkitMaskImage: 'radial-gradient(ellipse 90% 80% at 50% 40%, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 65%, transparent 100%)',
      }}
    >
      <div
        className="pointer-events-auto absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 grid"
        style={{
          gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
          width: `${cols * cellSize}px`,
          height: `${rows * cellSize}px`,
        }}
      >
        {cells.map(({ row, col }) => {
          let delay = 0;
          let isRippling = false;

          if (clickedCell) {
            const dist = Math.hypot(row - clickedCell.row, col - clickedCell.col);
            delay = dist * 42;
            isRippling = true;
          }

          return (
            <div
              key={`${row}-${col}-${clickedCell?.key || 0}`}
              onClick={() => handleCellClick(row, col)}
              className="relative border border-white/[0.025] hover:border-[#E32124]/40 hover:bg-[#E32124]/[0.04] transition-colors duration-300 cursor-pointer group"
              style={{
                animation: isRippling
                  ? `cyber-cell-ripple 700ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms 1 normal forwards`
                  : undefined,
              }}
            >
              {/* Subtle tech crosshair corner indicator */}
              {(row % 4 === 0 && col % 4 === 0) && (
                <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-white/[0.06] pointer-events-none" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
