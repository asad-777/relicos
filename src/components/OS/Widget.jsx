'use client';

import { useRef, useEffect, useState } from 'react';

export default function Widget({ id, defaultX = 100, defaultY = 100, children }) {
  const [pos, setPos] = useState({ x: defaultX, y: defaultY, width: "auto", height: 'auto' });
  const posRef = useRef(pos);
  const widgetRef = useRef(null);
  const dragRef = useRef({ isDragging: false, startX: 0, startY: 0, initialX: 0, initialY: 0 });

  // Keep ref up to date
  useEffect(() => {
    posRef.current = pos;
  }, [pos]);

  // Try to load position from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`widget_pos_${id}`);
    if (saved) {
      try {
        setPos(JSON.parse(saved));
      } catch (e) {}
    }
  }, [id]);

  // Save position to localStorage
  const savePosition = (newPos) => {
    setPos(newPos);
    localStorage.setItem(`widget_pos_${id}`, JSON.stringify(newPos));
  };

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
    
    const newX = dragRef.current.initialX + dx;
    const newY = Math.max(0, dragRef.current.initialY + dy); // Prevent dragging off top

    // We don't save to localStorage on every move to avoid performance issues,
    // just update state
    setPos(prev => ({ ...prev, x: newX, y: newY }));
  };

  const handlePointerUp = () => {
    dragRef.current.isDragging = false;
    document.removeEventListener('pointermove', handlePointerMove);
    document.removeEventListener('pointerup', handlePointerUp);
    
    // Save final position
    savePosition(posRef.current);
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
            savePosition(newPos);
          }
        }, 300);
      }
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [id]);

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
      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-1.5 rounded-full bg-white/40 opacity-0 group-hover/widget:opacity-100 transition-opacity backdrop-blur-md cursor-move z-50"></div>
      
      {children}
    </div>
  );
}
