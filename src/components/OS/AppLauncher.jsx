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
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`} onClick={onClose}>
      <div 
        className="w-112.5 bg-base-100 border-2 border-white/20 shadow-2xl rounded-xl flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 p-4 bg-base-200/50 border-b border-white/10">
          <Search size={20} className="text-base-content/50" />
          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-transparent outline-none text-base-content text-lg placeholder-base-content/30"
            placeholder="Search apps..."
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
          />
        </div>
        <div className="max-h-100 overflow-y-auto p-2">
          {filteredApps.length > 0 ? filteredApps.map((app, index) => (
            <div
              key={app.id}
              className={`p-3 flex items-center gap-3 rounded-lg cursor-pointer transition-all ${index === selectedIndex ? 'bg-primary text-primary-content shadow-lg' : 'hover:bg-base-200'}`}
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
              <span className="font-heading uppercase">{app.title}</span>
            </div>
          )) : (
            <div className="p-4 text-center font-heading uppercase text-base-content/70">No matching apps found.</div>
          )}
        </div>
      </div>
    </div>
  );
}
