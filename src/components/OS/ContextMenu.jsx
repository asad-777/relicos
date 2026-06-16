'use client';

import { useEffect, useRef } from 'react';
import { useContextMenuStore } from '@/lib/stores/contextMenuStore';

export default function ContextMenu() {
  const { isOpen, x, y, items, closeMenu } = useContextMenuStore();
  const menuRef = useRef(null);

  // Close menu on click outside or escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        closeMenu();
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeMenu();
      }
    };

    // Use mousedown instead of click to catch it before click events bubble
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, closeMenu]);

  // Adjust position if it goes off screen
  const getPositionStyles = () => {
    if (!isOpen || !menuRef.current || typeof window === 'undefined') {
      return { top: y, left: x };
    }

    const menuRect = menuRef.current.getBoundingClientRect();
    let finalX = x;
    let finalY = y;

    if (x + menuRect.width > window.innerWidth) {
      finalX = x - menuRect.width;
    }
    if (y + menuRect.height > window.innerHeight) {
      finalY = y - menuRect.height;
    }

    return { top: finalY, left: finalX };
  };

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className="fixed z-[99999] min-w-48 bg-base-100 border-2 border-base-content shadow-[4px_4px_0px_var(--color-base-content)] overflow-hidden font-body animate-in fade-in zoom-in-95 duration-100"
      style={{ ...getPositionStyles(), position: 'fixed' }}
      onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); }}
    >
      <ul className="flex flex-col py-1">
        {items.map((item, i) => {
          if (item.divider) {
            return <li key={i} className="my-1 h-[2px] bg-base-content/20 w-full" />;
          }

          const Icon = item.icon;
          return (
            <li key={i}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  item.onClick();
                  closeMenu();
                }}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm font-bold text-left hover:bg-primary hover:text-primary-content transition-colors"
              >
                {Icon && <Icon size={16} strokeWidth={2.5} />}
                {item.label}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
