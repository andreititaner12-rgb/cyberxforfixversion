import React, { useMemo, useRef, useState, useEffect } from "react";
import { cn } from "../../lib/utils";

export const BackgroundRippleEffect = ({
  rows: customRows,
  cols: customCols,
  cellSize = 56,
  borderColor = "rgba(255, 255, 255, 0.08)",
  fillColor = "rgba(227, 33, 36, 0.22)",
  className,
}: {
  rows?: number;
  cols?: number;
  cellSize?: number;
  borderColor?: string;
  fillColor?: string;
  className?: string;
}) => {
  const [clickedCell, setClickedCell] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const [rippleKey, setRippleKey] = useState(0);
  const [dimensions, setDimensions] = useState({ rows: 14, cols: 28 });
  const ref = useRef<HTMLDivElement>(null);

  // Dynamically calculate grid dimensions to fill viewport
  useEffect(() => {
    const updateSize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const calculatedCols = Math.ceil(w / cellSize) + 2;
      const calculatedRows = Math.ceil(h / cellSize) + 2;
      setDimensions({
        cols: customCols || Math.max(calculatedCols, 24),
        rows: customRows || Math.max(calculatedRows, 14),
      });
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, [cellSize, customRows, customCols]);

  return (
    <div
      ref={ref}
      className={cn(
        "fixed inset-0 w-full h-full overflow-hidden pointer-events-none select-none z-0 flex items-center justify-center",
        className
      )}
      style={{
        maskImage: "radial-gradient(ellipse 85% 75% at 50% 50%, black 45%, transparent 95%)",
        WebkitMaskImage: "radial-gradient(ellipse 85% 75% at 50% 50%, black 45%, transparent 95%)",
      }}
    >
      <DivGrid
        key={rippleKey}
        rows={dimensions.rows}
        cols={dimensions.cols}
        cellSize={cellSize}
        borderColor={borderColor}
        fillColor={fillColor}
        clickedCell={clickedCell}
        onCellClick={(row, col) => {
          setClickedCell({ row, col });
          setRippleKey((k) => k + 1);
        }}
        interactive
      />
    </div>
  );
};

type DivGridProps = {
  className?: string;
  rows: number;
  cols: number;
  cellSize: number; // in pixels
  borderColor: string;
  fillColor: string;
  clickedCell: { row: number; col: number } | null;
  onCellClick?: (row: number, col: number) => void;
  interactive?: boolean;
};

type CellStyle = React.CSSProperties & {
  ["--delay"]?: string;
  ["--duration"]?: string;
};

const DivGrid = ({
  className,
  rows,
  cols,
  cellSize = 56,
  borderColor = "rgba(255, 255, 255, 0.08)",
  fillColor = "rgba(227, 33, 36, 0.22)",
  clickedCell = null,
  onCellClick = () => {},
  interactive = true,
}: DivGridProps) => {
  const cells = useMemo(
    () => Array.from({ length: rows * cols }, (_, idx) => idx),
    [rows, cols]
  );

  const gridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
    gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
    width: cols * cellSize,
    height: rows * cellSize,
    marginInline: "auto",
  };

  return (
    <div className={cn("relative pointer-events-auto", className)} style={gridStyle}>
      {cells.map((idx) => {
        const rowIdx = Math.floor(idx / cols);
        const colIdx = idx % cols;
        const distance = clickedCell
          ? Math.hypot(clickedCell.row - rowIdx, clickedCell.col - colIdx)
          : 0;
        const delay = clickedCell ? Math.max(0, distance * 45) : 0; // ms
        const duration = 240 + distance * 65; // ms

        const style: CellStyle = clickedCell
          ? {
              "--delay": `${delay}ms`,
              "--duration": `${duration}ms`,
            }
          : {};

        return (
          <div
            key={idx}
            className={cn(
              "cell relative border border-white/[0.07] transition-all duration-200 will-change-transform",
              interactive && "cursor-pointer hover:border-[#E32124]/70 hover:bg-[#E32124]/15 hover:shadow-[0_0_15px_rgba(227,33,36,0.4)]",
              clickedCell && "animate-cell-ripple"
            )}
            style={{
              borderColor,
              backgroundColor: clickedCell ? undefined : fillColor,
              ...style,
            }}
            onClick={
              interactive ? () => onCellClick?.(rowIdx, colIdx) : undefined
            }
          >
            {/* Subtle Tech corner crosshair accents on grid intersections */}
            {rowIdx % 3 === 0 && colIdx % 3 === 0 && (
              <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-white/20 pointer-events-none" />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default BackgroundRippleEffect;
