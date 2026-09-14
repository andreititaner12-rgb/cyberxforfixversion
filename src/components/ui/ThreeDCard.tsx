import React, { createContext, useState, useRef } from 'react';

const MouseEnterContext = createContext<[boolean, React.Dispatch<React.SetStateAction<boolean>>]>([
  false,
  () => {},
]);

/**
 * Stable, high-performance CardContainer
 * Pure CSS/GPU transforms without preserve-3d z-buffer tearing or DOM mutation bugs.
 */
export const CardContainer = ({
  children,
  className = '',
  containerClassName = '',
  onHoverChange,
}: {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  onHoverChange?: (isHovered: boolean) => void;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMouseEntered, setIsMouseEntered] = useState(false);

  const handleMouseEnter = () => {
    setIsMouseEntered(true);
    if (onHoverChange) onHoverChange(true);
  };

  const handleMouseLeave = () => {
    setIsMouseEntered(false);
    if (onHoverChange) onHoverChange(false);
  };

  return (
    <MouseEnterContext.Provider value={[isMouseEntered, setIsMouseEntered]}>
      <div
        ref={containerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`relative ${containerClassName}`}
      >
        <div className={`w-full h-full ${className}`}>
          {children}
        </div>
      </div>
    </MouseEnterContext.Provider>
  );
};

export const CardItem = ({
  as: Tag = 'div',
  children,
  className = '',
  ...rest
}: any) => {
  return (
    <Tag className={className} {...rest}>
      {children}
    </Tag>
  );
};
