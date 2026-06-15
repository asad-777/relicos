'use client';

import { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { useWindowStore } from '@/lib/stores/windowStore';

import { APP_REGISTRY } from '@/lib/appRegistry';

const APPS = Object.values(APP_REGISTRY);

export default function AppLauncher({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const { openWindow } = useWindowStore();

  const filteredApps = APPS.filter(app => app.title.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        setSelectedIndex((prev) => (prev + 1) % filteredApps.length);
        e.preventDefault();
      } else if (e.key === 'ArrowUp') {
        setSelectedIndex((prev) => (prev - 1 + filteredApps.length) % filteredApps.length);
        e.preventDefault();
      } else if (e.key === 'Enter') {
        if (filteredApps[selectedIndex]) {
          openWindow({
            id: filteredApps[selectedIndex].id,
            title: filteredApps[selectedIndex].title,
            type: filteredApps[selectedIndex].type,
            width: filteredApps[selectedIndex].defaultWidth,
            height: filteredApps[selectedIndex].defaultHeight
          });
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredApps, selectedIndex, openWindow, onClose]);

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-start justify-center pt-[20vh] bg-black/30 backdrop-blur-md transition-all duration-200 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose}>
      <div 
        className="w-[90%] max-w-2xl bg-base-100/90 backdrop-blur-2xl border border-white/20 shadow-[0_30px_60px_rgba(0,0,0,0.5)] rounded-2xl flex flex-col overflow-hidden transform transition-transform duration-200"
        style={{ transform: isOpen ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(-20px)' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-4 p-5 border-b border-white/10 bg-base-200/30">
          <Search size={28} className="text-base-content/50" />
          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-transparent outline-none text-base-content text-2xl placeholder-base-content/30 font-light"
            placeholder="Spotlight Search..."
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-base-content/50 hover:text-base-content transition-colors">
              <span className="text-sm font-bold bg-base-300 px-2 py-1 rounded">ESC</span>
            </button>
          )}
        </div>
        <div className="max-h-[50vh] overflow-y-auto p-3 flex flex-col gap-1">
          {filteredApps.length > 0 ? filteredApps.map((app, index) => (
            <div
              key={app.id}
              className={`p-3 px-4 flex items-center justify-between gap-4 rounded-xl cursor-pointer transition-all ${index === selectedIndex ? 'bg-primary text-primary-content shadow-md scale-[1.02]' : 'hover:bg-base-200/50'}`}
              onMouseEnter={() => setSelectedIndex(index)}
              onClick={() => {
                openWindow({ 
                  id: app.id, 
                  title: app.title, 
                  type: app.type, 
                  width: app.defaultWidth, 
                  height: app.defaultHeight 
                });
                onClose();
              }}
            >
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg ${index === selectedIndex ? 'bg-primary-content/20' : 'bg-base-300'}`}>
                  {app.icon && <app.icon size={24} color={index === selectedIndex ? 'currentColor' : app.color} />}
                </div>
                <span className="font-bold text-lg">{app.title}</span>
              </div>
              {index === selectedIndex && <span className="text-xs font-bold opacity-70">Enter ↵</span>}
            </div>
          )) : (
            <div className="p-4 text-center font-heading uppercase text-base-content/70">No matching apps found.</div>
          )}
        </div>
      </div>
    </div>
  );
}
