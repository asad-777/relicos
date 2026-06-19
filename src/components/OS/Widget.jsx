'use client';

import { useRef, useEffect, useState } from 'react';
import { useWidgetStore } from '@/lib/stores/widgetStore';
import { Close } from 'pixelarticons/react';

export default function Widget({ instanceId, initialX = 100, initialY = 100, initialWidth = 'auto', initialHeight = 'auto', preview = false, children }) {
  const [pos, setPos] = useState({ x: initialX, y: initialY, width: initialWidth, height: initialHeight });
  const posRef = useRef(pos);
  const widgetRef = useRef(null);
  const dragRef = useRef({ isDragging: false, startX: 0, startY: 0, initialX: 0, initialY: 0 });
  const { updateWidgetPosition, updateWidgetSize, removeWidget } = useWidgetStore();

  // Keep ref up to date
  useEffect(() => {
    if (!preview) posRef.current = pos;
  }, [pos, preview]);

  if (preview) {
    return (
      <div className="relative w-max h-max rounded-[var(--radius-widget)] overflow-hidden pointer-events-none flex items-center justify-center">
        {children}
      </div>
    );
  }

  const handlePointerDown = (e) => {
    if (e.button !== 0) return; // Only left click
    
    // Prevent dragging if clicking on an interactive element inside the widget
    if (e.target.closest('button') || e.target.closest('a') || e.target.closest('input')) return;

    if (widgetRef.current) {
      const rect = widgetRef.current.getBoundingClientRect();
      // Let native CSS resize handle clicks in the bottom-right corner
      if (e.clientX > rect.right - 25 && e.clientY > rect.bottom - 25) {
        return;
      }
    }

    e.preventDefault();
    dragRef.current = {
      isDragging: true,
      startX: e.clientX,
      startY: e.clientY,
      initialX: posRef.current.x,
      initialY: posRef.current.y
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

    if (widgetRef.current && typeof window !== 'undefined') {
      const w = widgetRef.current.offsetWidth;
      const h = widgetRef.current.offsetHeight;
      
      // Sides: 50% can go off-screen
      const minX = -(w * 0.5);
      const maxX = window.innerWidth - (w * 0.5);
      
      // Top/Bottom: 20% can go off-screen
      const minY = -(h * 0.2);
      const maxY = window.innerHeight - (h * 0.8);

      newX = Math.max(minX, Math.min(newX, maxX));
      newY = Math.max(minY, Math.min(newY, maxY));
    } else {
      newY = Math.max(0, newY); // Fallback
    }

    // We don't save to global store on every move to avoid performance issues,
    // just update state
    setPos(prev => ({ ...prev, x: newX, y: newY }));
  };

  const handlePointerUp = () => {
    dragRef.current.isDragging = false;
    document.removeEventListener('pointermove', handlePointerMove);
    document.removeEventListener('pointerup', handlePointerUp);
    
    // Save final position
    updateWidgetPosition(instanceId, posRef.current.x, posRef.current.y);
  };

  // ResizeObserver to handle widget resizing
  useEffect(() => {
    const el = widgetRef.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        if (dragRef.current.isResizingTimeout) clearTimeout(dragRef.current.isResizingTimeout);
        
        dragRef.current.isResizingTimeout = setTimeout(() => {
          const newWidth = el.offsetWidth;
          const newHeight = el.offsetHeight;
          if (newWidth !== posRef.current.width || newHeight !== posRef.current.height) {
            const newPos = { ...posRef.current, width: newWidth, height: newHeight };
            setPos(newPos);
            updateWidgetSize(instanceId, newWidth, newHeight);
          }
        }, 300);
      }
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [instanceId, updateWidgetSize]);

  useEffect(() => {
    return () => {
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerup', handlePointerUp);
    };
  }, []);

  return (
    <div
      ref={widgetRef}
      onPointerDown={handlePointerDown}
      className="absolute group/widget pointer-events-auto rounded-(--radius-widget)"
      style={{
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        width: pos.width !== 'auto' ? `${pos.width}px` : undefined,
        height: pos.height !== 'auto' ? `${pos.height}px` : undefined,
        zIndex: 0,
        resize: 'both',
        overflow: 'hidden'
      }}
    >
      {/* Draggable overlay handle that shows on hover */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-1.5 rounded-full bg-base-content/40 opacity-0 group-hover/widget:opacity-100 transition-opacity backdrop-blur-md cursor-move z-50"></div>
      
      {/* Remove Button */}
      <button 
        onClick={(e) => {
          e.stopPropagation();
          removeWidget(instanceId);
        }}
        className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full bg-error/90 text-error-content opacity-0 group-hover/widget:opacity-100 hover:bg-error transition-all z-[60] cursor-pointer shadow-md border border-base-content/20 hover:scale-110"
        title="Remove Widget"
      >
        <Close size={14} strokeWidth={3} />
      </button>

      {children}
    </div>
  );
}
