'use client';

import { useRef, useEffect, useState } from 'react';
import { useWindowStore } from '@/lib/stores/windowStore';

export default function DesktopIcon({ app, index, onOpenLauncher }) {
  const [pos, setPos] = useState({ x: 0, y: 0 }); // init with 0 to prevent hydration mismatch
  const [isMounted, setIsMounted] = useState(false);
  const posRef = useRef(pos);
  const dragRef = useRef({ isDragging: false, hasMoved: false, startX: 0, startY: 0, initialX: 0, initialY: 0 });
  const { openWindow } = useWindowStore();

  useEffect(() => {
    posRef.current = pos;
  }, [pos]);

  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem(`icon_pos_${app.id}`);
    if (saved) {
      try {
        setPos(JSON.parse(saved));
      } catch (e) {}
    } else {
      // Stack on right side
      setPos({
        x: window.innerWidth - 120,
        y: 120 + (index * 110)
      });
    }
  }, [app.id, index]);

  const savePosition = (newPos) => {
    setPos(newPos);
    localStorage.setItem(`icon_pos_${app.id}`, JSON.stringify(newPos));
  };

  const handlePointerDown = (e) => {
    if (e.button !== 0) return; // Only left click
    e.preventDefault();
    dragRef.current = {
      isDragging: true,
      hasMoved: false,
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
    
    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
      dragRef.current.hasMoved = true;
    }
    
    const newX = dragRef.current.initialX + dx;
    const newY = Math.max(0, dragRef.current.initialY + dy); // Prevent dragging off top

    setPos({ x: newX, y: newY });
  };

  const handlePointerUp = () => {
    dragRef.current.isDragging = false;
    document.removeEventListener('pointermove', handlePointerMove);
    document.removeEventListener('pointerup', handlePointerUp);
    
    savePosition(posRef.current);
    
    // Only open app if we didn't drag it
    if (!dragRef.current.hasMoved) {
      if (app.id === 'apps_launcher') {
        onOpenLauncher();
      } else {
        openWindow({ 
          id: app.id, 
          title: app.title, 
          type: app.type, 
          width: app.defaultWidth, 
          height: app.defaultHeight 
        });
      }
    }
  };

  const Icon = app.icon;
  const color = app.color || '#ffffff';

  if (!isMounted) return null; // Avoid SSR hydration mismatch

  return (
    <div 
      className="absolute flex flex-col items-center gap-2 w-24 hover:scale-105 transition-transform group cursor-pointer z-10"
      style={{ left: `${pos.x}px`, top: `${pos.y}px`, zIndex: 1 }}
      onPointerDown={handlePointerDown}
    >
      <div 
        className="w-16 h-16 backdrop-blur-md rounded-(--radius-widget) border-2 flex items-center justify-center shadow-[4px_4px_0px_rgba(0,0,0,0.5)] group-hover:brightness-110 transition-all duration-300"
        style={{
          backgroundColor: `${color}33`,
          borderColor: `${color}80`,
          color: color
        }}
      >
        <Icon size={32} />
      </div>
      <span className="font-bold text-shadow-sm text-center leading-tight select-none pointer-events-none">
        {app.title}
      </span>
    </div>
  );
}
