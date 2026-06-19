'use client';

import { useRef, useEffect, useState } from 'react';
import { useWindowStore } from '@/lib/stores/windowStore';
import { useContextMenuStore } from '@/lib/stores/contextMenuStore';
import { Close, Minus, Expand } from 'pixelarticons/react';
import { cn } from '@/lib/utils';

export default function Window({ id, title, type, url, x, y, width, height, isMinimized, isMaximized, isActive, isClosing, isAnimating, zIndex, children }) {
  const windowRef = useRef(null);
  const { focusWindow, updateWindowSize, updateWindowPosition, closeWindow, minimizeWindow, toggleMaximize } = useWindowStore();
  const { openMenu } = useContextMenuStore();
  const dragRef = useRef({ isDragging: false, startX: 0, startY: 0, initialX: 0, initialY: 0 });
  const [isMounting, setIsMounting] = useState(true);

  useEffect(() => {
    // Trigger smooth mount animation
    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => setIsMounting(false));
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  const handlePointerDown = (e) => {
    // Only drag on left click
    if (e.button !== 0) return;
    
    // Bring to front
    focusWindow(id);

    // If click is on buttons, don't drag
    if (e.target.closest('button')) return;

    e.preventDefault();
    dragRef.current = {
      isDragging: true,
      startX: e.clientX,
      startY: e.clientY,
      initialX: x,
      initialY: y
    };

    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerup', handlePointerUp);
  };

  const handlePointerMove = (e) => {
    if (!dragRef.current.isDragging) return;

    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    
    let newX = dragRef.current.initialX + dx;
    let newY = dragRef.current.initialY + dy;

    if (typeof window !== 'undefined') {
      // Allow 70% of the window to slide off the sides and bottom
      // Top boundary is strictly locked at 64px to prevent hiding behind the top bar
      const minX = -(width * 0.7);
      const maxX = window.innerWidth - (width * 0.3);
      const minY = 64;
      const maxY = window.innerHeight - (height * 0.3);
      
      newX = Math.max(minX, Math.min(newX, maxX));
      newY = Math.max(minY, Math.min(newY, maxY));
    } else {
      newY = Math.max(64, newY);
    }
    
    updateWindowPosition(id, {
      x: newX,
      y: newY
    });
  };

  const handlePointerUp = () => {
    dragRef.current.isDragging = false;
    document.removeEventListener('pointermove', handlePointerMove);
    document.removeEventListener('pointerup', handlePointerUp);
  };

  // ResizeObserver to update store if native resize is used
  useEffect(() => {
    const el = windowRef.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      if (isAnimating || isMaximized) return;
      for (let entry of entries) {
        // use offsetWidth/Height to include borders if any
        if (el.offsetWidth !== width || el.offsetHeight !== height) {
          updateWindowSize(id, { width: el.offsetWidth, height: el.offsetHeight });
        }
      }
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [width, height, id, updateWindowSize]);

  useEffect(() => {
    return () => {
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerup', handlePointerUp);
    };
  }, []);

  // We no longer return null for minimized windows to prevent iframe reloads
  // Instead we hide them with CSS transitions

  return (
    <div
      ref={windowRef}
      onPointerDown={() => focusWindow(id)}
      className={cn(
        "fixed flex flex-col bg-base-100 rounded-(--radius-window) border border-base-content/20 shadow-2xl overflow-hidden",
        isAnimating 
          ? "transition-[opacity,transform,filter,width,height,left,top] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" 
          : "transition-[opacity,transform,filter] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
        (isMinimized || isClosing || isMounting) ? "opacity-0 scale-95 pointer-events-none translate-y-8" : "opacity-100 scale-100 translate-y-0",
        !isActive && !(isMinimized || isClosing || isMounting) ? "opacity-60 grayscale-30 hover:opacity-80" : ""
      )}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        left: `${x}px`,
        top: `${y}px`,
        zIndex: zIndex,
        resize: isMinimized ? 'none' : 'both',
      }}
    >
      {/* Title Bar */}
      <div 
        className="relative flex items-center justify-between bg-base-300/50 text-base-content px-3 py-3 select-none shrink-0 border-b border-base-content/10"
        onPointerDown={handlePointerDown}
        onContextMenu={(e) => {
          e.preventDefault();
          e.stopPropagation();
          openMenu(e.clientX, e.clientY, [
            { label: 'Minimize', icon: Minus, onClick: () => minimizeWindow(id) },
            { label: isMaximized ? 'Restore Down' : 'Maximize', icon: Maximize2, onClick: () => toggleMaximize(id) },
            { divider: true },
            { label: 'Close Window', icon: X, onClick: () => closeWindow(id) }
          ]);
        }}
      >
        <div className="flex gap-2 items-center group/controls px-1 z-10">
          <button 
            onClick={(e) => { e.stopPropagation(); closeWindow(id); }}
            className="w-4 h-4 rounded-full bg-[#FF5F56] border border-[#E0443E] hover:brightness-90 flex items-center justify-center transition-all cursor-default"
            title="Close"
          >
            <Close size={10} className="text-base-content/60 opacity-0 group-hover/controls:opacity-100 transition-opacity" strokeWidth={3} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); minimizeWindow(id); }}
            className="w-4 h-4 rounded-full bg-[#FFBD2E] border border-[#DEA123] hover:brightness-90 flex items-center justify-center transition-all cursor-default"
            title="Minimize"
          >
            <Minus size={10} className="text-base-content/60 opacity-0 group-hover/controls:opacity-100 transition-opacity" strokeWidth={4} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); toggleMaximize(id); }}
            className="w-4 h-4 rounded-full bg-[#27C93F] border border-[#1AAB29] hover:brightness-90 flex items-center justify-center transition-all cursor-default"
            title="Maximize"
          >
            <Expand size={9} className="text-base-content/60 opacity-0 group-hover/controls:opacity-100 transition-opacity" strokeWidth={3} />
          </button>
        </div>
        
        <div className="absolute left-1/2 -translate-x-1/2 font-heading text-sm uppercase truncate pointer-events-none w-1/2 text-center">
          {title}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto bg-transparent relative min-h-0">
        {children}
      </div>
    </div>
  );
}
