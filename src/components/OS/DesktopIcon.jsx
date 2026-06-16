'use client';

import { useRef, useEffect, useState } from 'react';
import { useWindowStore } from '@/lib/stores/windowStore';
import { useDesktopStore } from '@/lib/stores/desktopStore';
import { useContextMenuStore } from '@/lib/stores/contextMenuStore';
import { APP_REGISTRY } from '@/lib/appRegistry';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function DesktopIcon({ instance }) {
  const app = APP_REGISTRY[instance.appId];
  const { openWindow } = useWindowStore();
  const { selectedIconIds, selectIcon, updateMultipleIconPositions, removeIcon } = useDesktopStore();
  const { openMenu } = useContextMenuStore();
  
  const [isMounted, setIsMounted] = useState(false);
  const dragRef = useRef({ isDragging: false, hasMoved: false, startX: 0, startY: 0, lastX: 0, lastY: 0 });
  const isSelected = selectedIconIds.includes(instance.instanceId);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handlePointerDown = (e) => {
    if (e.button !== 0) return; // Only left click
    e.stopPropagation(); // Prevent desktop from clearing selection

    // If we click an unselected icon, select ONLY it. 
    // If we click a selected icon, keep current selection (so we can drag multiple).
    // If shift/ctrl is held, toggle selection.
    if (e.shiftKey || e.ctrlKey || e.metaKey) {
      selectIcon(instance.instanceId, true);
    } else if (!isSelected) {
      selectIcon(instance.instanceId, false);
    }

    dragRef.current = {
      isDragging: true,
      hasMoved: false,
      startX: e.clientX,
      startY: e.clientY,
      lastX: e.clientX,
      lastY: e.clientY
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

    // Calculate delta since last move
    const stepDx = e.clientX - dragRef.current.lastX;
    const stepDy = e.clientY - dragRef.current.lastY;

    dragRef.current.lastX = e.clientX;
    dragRef.current.lastY = e.clientY;

    if (stepDx !== 0 || stepDy !== 0) {
      // Get all currently selected icons from the store to move them together
      const selectedIds = useDesktopStore.getState().selectedIconIds;
      // If we are dragging but this icon isn't actually selected (weird edge case), just move this one
      const idsToMove = selectedIds.includes(instance.instanceId) ? selectedIds : [instance.instanceId];
      
      const updates = idsToMove.map(id => ({ instanceId: id, dx: stepDx, dy: stepDy }));
      updateMultipleIconPositions(updates);
    }
  };

  const handlePointerUp = () => {
    dragRef.current.isDragging = false;
    document.removeEventListener('pointermove', handlePointerMove);
    document.removeEventListener('pointerup', handlePointerUp);
  };

  const handleDoubleClick = (e) => {
    e.stopPropagation();
    if (app) {
      openWindow({ 
        id: app.id, 
        title: app.title, 
        type: app.type, 
        width: app.defaultWidth, 
        height: app.defaultHeight 
      });
    }
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isSelected) {
      selectIcon(instance.instanceId, false);
    }
    openMenu(e.clientX, e.clientY, [
      { label: 'Open App', icon: app?.icon, onClick: () => {
        if (app) openWindow({ id: app.id, title: app.title, type: app.type, width: app.defaultWidth, height: app.defaultHeight });
      }},
      { divider: true },
      { label: 'Delete Icon', icon: X, onClick: () => removeIcon(instance.instanceId) }
    ]);
  };

  if (!isMounted || !app) return null;

  const Icon = app.icon;
  const color = app.color || '#ffffff';

  return (
    <div 
      className={cn(
        "absolute flex flex-col items-center gap-2 w-24 transition-transform group cursor-pointer z-10 p-2 rounded-xl",
        isSelected ? "bg-primary/30 outline outline-2 outline-primary shadow-[0_0_15px_rgba(var(--color-primary),0.5)]" : "hover:bg-base-content/10 outline outline-2 outline-transparent"
      )}
      style={{ left: `${instance.x}px`, top: `${instance.y}px` }}
      onPointerDown={handlePointerDown}
      onDoubleClick={handleDoubleClick}
      onContextMenu={handleContextMenu}
      data-icon-id={instance.instanceId} // Used for bounding box detection
    >
      <div 
        className={cn(
          "w-16 h-16 backdrop-blur-md rounded-(--radius-widget) border-2 flex items-center justify-center shadow-[4px_4px_0px_rgba(0,0,0,0.5)] transition-all duration-300",
          isSelected ? "brightness-110 scale-105" : "group-hover:scale-105 group-hover:brightness-110"
        )}
        style={{
          backgroundColor: `${color}33`,
          borderColor: `${color}80`,
          color: color
        }}
      >
        <Icon size={32} />
      </div>
      <span 
        className={cn(
          "font-bold text-shadow-sm text-center leading-tight select-none pointer-events-none rounded px-1",
          isSelected ? "bg-primary text-primary-content text-shadow-none" : ""
        )}
      >
        {app.title}
      </span>
    </div>
  );
}
