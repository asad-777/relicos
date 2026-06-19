'use client';

import { useState } from 'react';
import { useThemeStore, THEMES } from '@/lib/stores/themeStore';
import { Monitor, Image, Grid3x3, Square, Circle } from 'pixelarticons/react';

export default function Settings() {
  const { theme, setTheme, background, backgrounds, setBackground, corners, setCorners } = useThemeStore();
  const [activeTab, setActiveTab] = useState('appearance');

  return (
    <div className="flex h-full w-full bg-base-100/90 text-base-content overflow-hidden rounded-b-(--radius-window)">
      {/* Sidebar */}
      <div className="w-auto border-r border-base-content/10 bg-base-200/50 flex flex-col p-4 gap-2">
        <button 
          onClick={() => setActiveTab('appearance')}
          className={`flex items-center gap-3 px-3 py-2 rounded-(--radius-widget) font-bold transition-all ${activeTab === 'appearance' ? 'bg-primary text-primary-content scale-105' : 'hover:bg-base-300/50'}`}
        >
          <Monitor size={18} />
          Theme
        </button>
        <button 
          onClick={() => setActiveTab('background')}
          className={`flex items-center gap-3 px-3 py-2 rounded-(--radius-widget) font-bold transition-all ${activeTab === 'background' ? 'bg-primary text-primary-content scale-105' : 'hover:bg-base-300/50'}`}
        >
          <Image size={18} />
          Wallpaper
        </button>
        <button 
          onClick={() => setActiveTab('interface')}
          className={`flex items-center gap-3 px-3 py-2 rounded-(--radius-widget) font-bold transition-all ${activeTab === 'interface' ? 'bg-primary text-primary-content scale-105' : 'hover:bg-base-300/50'}`}
        >
          <Grid3x3 size={18} />
          Interface
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 p-8 overflow-y-auto" data-lenis-prevent="true">
        {activeTab === 'appearance' && (
          <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-2xl font-bold border-b border-base-content/10 pb-2">Theme Selector</h2>
            <p className="opacity-70 font-body">Choose the color palette for your Relic OS experience.</p>
            
            <div className="grid grid-cols-2 gap-4">
              {THEMES.map(t => (
                <button 
                  key={t}
                  onClick={() => setTheme(t)}
                  className={`p-4 rounded-(--radius-widget) font-bold uppercase transition-all flex flex-col items-start gap-4 border-2 ${theme === t ? 'border-primary bg-primary/10 scale-[1.02]' : 'border-base-content/10 hover:border-primary/50 bg-base-200/30 hover:scale-[1.01]'}`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span>{t}</span>
                    {theme === t && <div className="w-3 h-3 rounded-full bg-primary animate-pulse"></div>}
                  </div>
                  
                  {/* Theme Preview Mini */}
                  <div className="flex w-full h-8 rounded border border-base-content/20 overflow-hidden" data-theme={t}>
                    <div className="flex-1 bg-base-100"></div>
                    <div className="flex-1 bg-primary"></div>
                    <div className="flex-1 bg-secondary"></div>
                    <div className="flex-1 bg-accent"></div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'background' && (
          <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-2xl font-bold border-b border-base-content/10 pb-2">Desktop Wallpaper</h2>
            <p className="opacity-70 font-body">Select the background image for your desktop.</p>
            
            <div className="grid grid-cols-2 gap-4">
              {backgrounds.map(bg => (
                <button 
                  key={bg}
                  onClick={() => setBackground(bg)}
                  className={`relative overflow-hidden aspect-video rounded-(--radius-widget) font-bold transition-all border-4 flex items-end p-2 ${background === bg ? 'border-primary scale-[1.02]' : 'border-base-content/10 hover:border-primary/50 hover:scale-[1.01]'}`}
                >
                  <img src={`/wallpapers/${bg}`} alt={bg} className="absolute inset-0 w-full h-full object-cover z-0" />
                  <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.8),transparent)] z-10"></div>
                  <span className="relative z-20 text-base-content drop-shadow-md capitalize text-left text-xs break-all">{bg.replace('wallhaven-', '').replace(/\.[^/.]+$/, "")}</span>
                  {background === bg && <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-primary animate-pulse z-20 shadow-[0_0_10px_currentColor]"></div>}
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'interface' && (
          <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-2xl font-bold border-b border-base-content/10 pb-2">Interface Elements</h2>
            <p className="opacity-70 font-body">Customize the shape and feel of OS components.</p>
            
            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-bold">Corner Radius</h3>
              <div className="flex gap-4">
                <button 
                  onClick={() => setCorners('round')}
                  className={`flex-1 flex flex-col items-center justify-center p-6 gap-4 border-2 transition-all ${corners === 'round' ? 'border-primary bg-primary/10' : 'border-base-content/10 hover:border-primary/50'} rounded-2xl`}
                >
                  <div className="w-16 h-16 border-4 border-current rounded-2xl flex items-center justify-center">
                    <Circle size={24} />
                  </div>
                  <span className="font-bold">Rounded</span>
                </button>
                <button 
                  onClick={() => setCorners('square')}
                  className={`flex-1 flex flex-col items-center justify-center p-6 gap-4 border-2 transition-all ${corners === 'square' ? 'border-primary bg-primary/10' : 'border-base-content/10 hover:border-primary/50'} rounded-none`}
                >
                  <div className="w-16 h-16 border-4 border-current rounded-none flex items-center justify-center">
                    <Square size={24} />
                  </div>
                  <span className="font-bold">Square</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
