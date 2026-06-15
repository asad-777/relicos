'use client';

import { useState, useEffect } from 'react';
import { useWindowStore } from '@/lib/stores/windowStore';
import { useThemeStore, THEMES, BACKGROUNDS } from '@/lib/stores/themeStore';
import Window from './Window';
import AppLauncher from './AppLauncher';
import Widget from './Widget';
import { Dock, DockIcon } from '@/components/ui/dock';
import GameDirectory from '@/components/Apps/GameDirectory';
import CalculatorApp from '@/components/Apps/Calculator';
import SettingsApp from '@/components/Apps/Settings';
import MusicPlayer from '@/components/Apps/MusicPlayer';
import { APP_REGISTRY } from '@/lib/appRegistry';
import { WIDGET_REGISTRY } from '@/lib/widgetRegistry';
import DesktopIcon from '@/components/OS/DesktopIcon';
import { Cpu, Activity, Clock, TerminalSquare, Box, Calculator } from 'lucide-react';

export default function Desktop() {
  const { windows, restoreWindow, focusWindow } = useWindowStore();
  const { theme, background } = useThemeStore();

  const [time, setTime] = useState(new Date());
  const [isLauncherOpen, setIsLauncherOpen] = useState(false);
  const [cpuLoad, setCpuLoad] = useState(12);
  const [ramLoad, setRamLoad] = useState(45);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    const mockStats = setInterval(() => {
      setCpuLoad(Math.floor(Math.random() * 20) + 10);
      setRamLoad(Math.floor(Math.random() * 5) + 40);
    }, 3000);
    
    const handleKeyDown = (e) => {
      if ((e.metaKey && e.key === 'Space') || (e.altKey && e.key === ' ')) {
        e.preventDefault();
        setIsLauncherOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearInterval(timer);
      clearInterval(mockStats);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);



  const hasActiveWindows = windows.some(w => !w.isMinimized);

  return (
    <div 
      className="relative w-full h-screen overflow-hidden flex flex-col bg-cover bg-center transition-all duration-700"
      style={{ backgroundImage: `url('/wallpapers/${BACKGROUNDS.includes(background) ? background : BACKGROUNDS[0]}.png')` }}
    >
      {/* Floating Waybar */}
      <div className={`absolute backdrop-blur-xl flex items-center justify-between z-9999 shadow-[4px_4px_0px_rgba(0,0,0,0.3)] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] delay-150 hover:delay-150 group/topbar border-2 border-white/20 ${hasActiveWindows ? 'left-1/2 -translate-x-1/2 w-[70%] max-w-4xl h-10 top-4 rounded-(--radius-widget) px-6 bg-base-300/60 hover:w-[85%] hover:max-w-6xl hover:h-16 hover:rounded-(--radius-widget) hover:bg-base-300/80 hover:px-8' : 'left-4 w-[calc(100%-2rem)] h-16 top-4 rounded-(--radius-widget) px-8 bg-base-300/50'}`}>
        
        {/* Left Side: Menu & Workspaces */}
        <div className="flex items-center gap-4 h-full">
          <button 
            onClick={() => setIsLauncherOpen(true)}
            className="flex items-center gap-3 hover:text-primary transition-colors text-lg font-bold uppercase tracking-wide"
          >
            <TerminalSquare size={24} />
            <span className="hidden sm:inline">Start Menu</span>
          </button>
          
          <div className="flex items-center gap-2 h-full">
            <div className="w-2.5 h-2.5 rounded-(--radius-widget) bg-primary shadow-[0_0_8px_var(--color-primary)]"></div>
            <div className="w-2.5 h-2.5 rounded-(--radius-widget) bg-base-content/30 hover:bg-base-content/60 cursor-pointer transition-colors"></div>
            <div className="w-2.5 h-2.5 rounded-(--radius-widget) bg-base-content/30 hover:bg-base-content/60 cursor-pointer transition-colors"></div>
            <div className="w-2.5 h-2.5 rounded-(--radius-widget) bg-base-content/30 hover:bg-base-content/60 cursor-pointer transition-colors"></div>
          </div>
        </div>

        {/* Center: Clock */}
        <div className={`absolute left-1/2 -translate-x-1/2 font-black flex items-center gap-2 tracking-wider transition-all duration-500 ease-in-out delay-150 group-hover/topbar:delay-150 ${hasActiveWindows ? 'text-sm group-hover/topbar:text-xl' : 'text-xl'}`}>
          {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>

        {/* Right Side: Tray */}
        <div className="flex items-center gap-6 h-full text-sm font-bold uppercase tracking-wider">
          <div className="flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity">
            <Box size={18} />
            <span>0</span>
          </div>
          <div className="w-px h-6 bg-white/20"></div>
          <div className="flex items-center gap-2 opacity-80">
            <Cpu size={18} />
            <span>{cpuLoad}%</span>
          </div>
          <div className="flex items-center gap-2 opacity-80">
            <Activity size={18} />
            <span>{ramLoad}%</span>
          </div>
        </div>
      </div>


      {/* Bottom Floating Task List (MagicUI Dock) */}
      {windows.length > 0 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-9999">
          <Dock direction="middle" className="bg-base-300/60 backdrop-blur-md border-2 border-white/20 shadow-2xl mx-auto mt-0 h-auto! py-2">
            {windows.map((w) => {
              const isTop = !w.isMinimized && w.zIndex === Math.max(...windows.map(win => win.zIndex));
              return (
                <DockIcon
                  key={w.id}
                  onClick={() => {
                    if (w.isMinimized) restoreWindow(w.id);
                    else focusWindow(w.id);
                  }}
                  className={`border-2 border-transparent relative group ${isTop ? 'bg-primary/20 text-primary border-primary/50 font-extrabold' : 'bg-base-300/50 text-base-content font-bold hover:bg-base-100'}`}
                >
                  <span className="text-sm font-black uppercase pointer-events-none whitespace-nowrap text-center tracking-tight">{w.title}</span>
                  
                  {/* Tooltip */}
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl border border-white/10 z-50">
                    {w.title}
                  </div>
                </DockIcon>
              );
            })}
          </Dock>
        </div>
      )}

      {/* Desktop Area */}
      <div className="relative flex-1 w-full"
        onClick={() => setIsLauncherOpen(false)}
      >
        {/* Draggable Desktop Widgets */}
        <div className="absolute inset-0 pointer-events-none z-0">
          {Object.values(WIDGET_REGISTRY).map(widget => {
            const WidgetComponent = widget.component;
            return <WidgetComponent key={widget.id} time={time} />;
          })}
        </div>

        {/* Desktop Icons - Absolute positioned and draggable */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="pointer-events-auto">
            <DesktopIcon 
              index={0}
              onOpenLauncher={() => setIsLauncherOpen(true)}
              app={{
                id: 'apps_launcher',
                title: 'Apps',
                icon: Box,
                color: '#ffffff'
              }} 
            />
            
            {Object.values(APP_REGISTRY)
              .filter(app => app.isDesktopIcon)
              .map((app, i) => (
                <DesktopIcon 
                  key={app.id} 
                  index={i + 1} 
                  app={app} 
                />
            ))}
          </div>
        </div>

        {/* Windows */}
        {windows.map((w) => {
          const isActive = w.zIndex === Math.max(...windows.map(win => win.zIndex));
          return (
            <Window key={w.id} {...w} isActive={isActive}>
              {w.type === 'settings' && (
                <SettingsApp />
              )}
            {w.type === 'directory' && (
              <GameDirectory />
            )}
            {w.type === 'iframe' && (
              <iframe 
                src={w.url} 
                className="w-full h-full border-none rounded-b-xl" 
                allow="autoplay; fullscreen" 
              />
            )}
            {w.type === 'terminal' && (
               <div className="p-4 bg-black/80 text-[#00FF00] font-mono text-sm h-full w-full rounded-b-xl">
                 <p>root@relicos ~ # uname -a</p>
                 <p>Linux relicos 6.9.1-rice x86_64 GNU/Linux</p>
                 <p className="mt-2">root@relicos ~ # <span className="animate-pulse">_</span></p>
               </div>
            )}
            {w.type === 'calculator' && (
              <CalculatorApp />
            )}
            {w.type === 'music' && (
              <MusicPlayer />
            )}
          </Window>
          );
        })}
      </div>

      <AppLauncher isOpen={isLauncherOpen} onClose={() => setIsLauncherOpen(false)} />
    </div>
  );
}
