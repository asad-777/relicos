'use client';

import { useState, useEffect } from 'react';
import { useWindowStore } from '@/lib/stores/windowStore';
import { useThemeStore, THEMES, BACKGROUNDS } from '@/lib/stores/themeStore';
import Window from './Window';
import AppLauncher from './AppLauncher';
import Widget from './Widget';
import CalendarPopup from '@/components/OS/CalendarPopup';
import { Dock, DockIcon } from '@/components/ui/dock';
import GameDirectory from '@/components/Apps/GameDirectory';
import CalculatorApp from '@/components/Apps/Calculator';
import MusicPlayer from '@/components/Apps/MusicPlayer';
import SettingsApp from '@/components/Apps/Settings';
import { APP_REGISTRY } from '@/lib/appRegistry';
import { WIDGET_REGISTRY } from '@/lib/widgetRegistry';
import DesktopIcon from '@/components/OS/DesktopIcon';
import { Search, Globe, Box } from 'lucide-react';

const GithubIcon = ({ size, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.379.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z"/>
  </svg>
);

const LinkedinIcon = ({ size, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const XIcon = ({ size, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.008 5.96H5.078z"/>
  </svg>
);

export default function Desktop() {
  const { windows, restoreWindow, focusWindow, openWindow, closeWindow } = useWindowStore();
  const { theme, background } = useThemeStore();

  const [time, setTime] = useState(new Date());
  const [isLauncherOpen, setIsLauncherOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [cpuLoad, setCpuLoad] = useState(12);
  const [ramLoad, setRamLoad] = useState(45);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Check for 'h' or 'H' + Space
      if (e.code === 'Space' && (e.ctrlKey || e.metaKey || e.altKey || e.key.toLowerCase() === 'h')) {
        // Just in case they meant regular Cmd+Space but wrote H+Space, or literally H+Space
        // Wait, standard browser events don't easily track H + Space unless we track keydown/keyup
      }
    };
    
    // Simpler: Just track 'H' and 'Space' combo
    const keysPressed = {};
    const downHandler = (e) => {
      keysPressed[e.key.toLowerCase()] = true;
      if (keysPressed['h'] && keysPressed[' ']) {
        e.preventDefault();
        setIsLauncherOpen(true);
      }
    };
    const upHandler = (e) => {
      keysPressed[e.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);

    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    const mockStats = setInterval(() => {
      setCpuLoad(Math.floor(Math.random() * 20) + 10);
      setRamLoad(Math.floor(Math.random() * 5) + 40);
    }, 3000);
    
    return () => {
      clearInterval(timer);
      clearInterval(mockStats);
    };
  }, []);



  const hasActiveWindows = windows.some(w => !w.isMinimized);

  return (
    <div 
      className="relative w-full h-screen overflow-hidden flex flex-col bg-cover bg-center transition-all duration-700"
      style={{ backgroundImage: `url('/wallpapers/${BACKGROUNDS.includes(background) ? background : BACKGROUNDS[0]}.png')` }}
    >
      {/* Floating Waybar */}
      <div className={`absolute left-1/2 -translate-x-1/2 top-4 z-9999 backdrop-blur-xl flex items-center justify-between shadow-[4px_4px_0px_rgba(0,0,0,0.3)] transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group/topbar border-2 border-white/10 ${
        hasActiveWindows 
          ? 'w-[60%] max-w-3xl h-12 rounded-[24px] px-6 bg-base-200/40 hover:w-[calc(100%-2rem)] hover:max-w-none hover:h-16 hover:rounded-[32px] hover:bg-base-200/50 hover:px-8' 
          : 'w-[calc(100%-2rem)] max-w-none h-16 rounded-[32px] px-8 bg-base-200/50'
      }`}>
        
        {/* Left Side: Spotlight */}
        <div className={`flex items-center gap-4 h-full pl-2 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
          hasActiveWindows ? 'opacity-0 scale-95 pointer-events-none blur-sm group-hover/topbar:opacity-100 group-hover/topbar:scale-100 group-hover/topbar:pointer-events-auto group-hover/topbar:blur-0' : 'opacity-100 scale-100 blur-0'
        }`}>
          <button 
            onClick={() => setIsLauncherOpen(true)}
            className="flex items-center opacity-80 hover:opacity-100 hover:text-primary transition-all cursor-pointer group/search text-sm font-bold uppercase tracking-wider"
          >
            <Search size={22} className="group-hover/search:scale-110 transition-transform mr-4" />
            <span className="hidden sm:inline text-lg">Spotlight</span>
            <div className="hidden sm:flex items-center gap-3 ml-6 opacity-80">
              <kbd className="flex items-center justify-center bg-base-300 border-2 border-white/20 text-base font-black px-3 py-1.5 rounded-lg shadow-sm min-w-[32px]">H</kbd>
              <kbd className="flex items-center justify-center bg-base-300 border-2 border-white/20 text-base font-black px-3 py-1.5 rounded-lg shadow-sm">Space</kbd>
            </div>
          </button>
        </div>

        {/* Center: Clock & Date */}
        <div 
          onClick={() => setIsCalendarOpen(!isCalendarOpen)}
          role="button"
          tabIndex={0}
          className={`absolute left-1/2 -translate-x-1/2 font-black flex items-center tracking-wider transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:text-primary cursor-pointer ${
            hasActiveWindows ? 'text-sm group-hover/topbar:text-xl' : 'text-xl'
          }`}
        >
          {time.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
          
          <div className={`flex items-center overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
            hasActiveWindows ? 'max-w-0 opacity-0 group-hover/topbar:max-w-[200px] group-hover/topbar:opacity-100' : 'max-w-[200px] opacity-100'
          }`}>
            <span className="opacity-50 mx-2">|</span>
            {time.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
          </div>
          {isCalendarOpen && <CalendarPopup />}
        </div>

        {/* Right Side: Links */}
        <div className={`flex items-center gap-6 h-full text-lg font-bold uppercase tracking-wider pr-2 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
          hasActiveWindows ? 'opacity-0 scale-95 pointer-events-none blur-sm group-hover/topbar:opacity-100 group-hover/topbar:scale-100 group-hover/topbar:pointer-events-auto group-hover/topbar:blur-0' : 'opacity-100 scale-100 blur-0'
        }`}>
          <a href="https://x.com/_asad_777" target="_blank" rel="noreferrer" className="flex items-center justify-center opacity-80 hover:opacity-100 hover:text-primary transition-all cursor-pointer group/link w-8 h-8">
            <XIcon size={22} className="group-hover/link:scale-110 transition-transform" />
          </a>
          <span className="opacity-30">|</span>
          <a href="https://www.linkedin.com/in/masadamir" target="_blank" rel="noreferrer" className="flex items-center justify-center opacity-80 hover:opacity-100 hover:text-primary transition-all cursor-pointer group/link w-8 h-8">
            <LinkedinIcon size={24} className="group-hover/link:scale-110 transition-transform" />
          </a>
          <span className="opacity-30">|</span>
          <a href="https://github.com/asad-777" target="_blank" rel="noreferrer" className="flex items-center justify-center opacity-80 hover:opacity-100 hover:text-primary transition-all cursor-pointer group/link w-8 h-8">
            <GithubIcon size={26} className="group-hover/link:scale-110 transition-transform" />
          </a>
          <span className="opacity-30">|</span>
          <a href="https://asadamir.vercel.app" target="_blank" rel="noreferrer" className="flex items-center gap-3 opacity-80 hover:opacity-100 hover:text-primary transition-all cursor-pointer group/link ml-2">
            <Globe size={24} className="group-hover/link:scale-110 transition-transform" />
            <span className="hidden sm:inline">Portfolio</span>
          </a>
        </div>
      </div>


      {/* Bottom Floating Task List (MagicUI Dock) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-9999">
        <Dock direction="middle" iconSize={80} iconMagnification={110} iconDistance={150} className="bg-base-200/20 backdrop-blur-2xl border-2 border-white/10 shadow-2xl mx-auto mt-0 h-auto py-4 px-6 flex gap-6 rounded-3xl">
          {Object.values(APP_REGISTRY).map((app) => {
            const w = windows.find(win => win.id === app.id);
            const isOpen = !!w;
            const isTop = isOpen && !w.isMinimized && w.zIndex === Math.max(...windows.map(win => win.zIndex));
            const Icon = app.icon;

            let stateClass = '';
            if (isTop) {
              stateClass = 'bg-primary/10 border-primary shadow-[0_0_20px_rgba(var(--color-primary),0.3)] font-bold text-base-content';
            } else if (isOpen) {
              stateClass = 'bg-base-200 border-primary/60 font-bold text-base-content';
            } else {
              stateClass = 'bg-base-200/80 border-white/10 text-base-content hover:bg-base-100 hover:border-white/30';
            }

            return (
              <DockIcon
                key={app.id}
                onClick={() => {
                  if (isOpen) {
                    if (w.isMinimized) restoreWindow(w.id);
                    else focusWindow(w.id);
                  } else {
                    openWindow({
                      id: app.id,
                      title: app.title,
                      type: app.type,
                      width: app.defaultWidth,
                      height: app.defaultHeight
                    });
                  }
                }}
                onContextMenu={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (isOpen) closeWindow(app.id);
                }}
                className={`border-2 rounded-2xl relative group transition-colors duration-300 ${stateClass}`}
              >
                <div className="flex items-center justify-center w-full h-full">
                  {Icon ? <Icon size={32} color={app.color} /> : <span className="text-lg font-black uppercase text-center">{app.title.slice(0, 3)}</span>}
                </div>
                {/* Tooltip */}
                <div className="absolute -top-14 left-1/2 -translate-x-1/2 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-base-200 text-base-content font-black text-sm px-4 py-2 rounded-xl border-2 border-base-content shadow-[4px_4px_0px_var(--color-base-content)] pointer-events-none whitespace-nowrap z-50">
                  {app.title}
                </div>
              </DockIcon>
            );
          })}

          {/* Separator if there are open windows not in registry */}
          {windows.filter(w => !Object.values(APP_REGISTRY).some(app => app.id === w.id)).length > 0 && (
            <div className="w-px h-8 bg-white/20 mx-2"></div>
          )}

          {/* Render open windows that are NOT in APP_REGISTRY (e.g. Games) */}
          {windows.filter(w => !Object.values(APP_REGISTRY).some(app => app.id === w.id)).map((w) => {
            const isTop = !w.isMinimized && w.zIndex === Math.max(...windows.map(win => win.zIndex));
            
            let stateClass = '';
            if (isTop) {
              stateClass = 'bg-primary/10 border-primary shadow-[0_0_20px_rgba(var(--color-primary),0.3)] font-bold text-base-content';
            } else {
              stateClass = 'bg-base-200 border-primary/60 font-bold text-base-content';
            }

            return (
              <DockIcon
                key={w.id}
                onClick={() => {
                  if (w.isMinimized) restoreWindow(w.id);
                  else focusWindow(w.id);
                }}
                onContextMenu={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  closeWindow(w.id);
                }}
                className={`border-2 rounded-2xl relative group transition-colors duration-300 ${stateClass}`}
              >
                <div className="flex items-center justify-center w-full h-full">
                  <Box size={32} />
                </div>
                {/* Tooltip */}
                <div className="absolute -top-14 left-1/2 -translate-x-1/2 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-base-200 text-base-content font-black text-sm px-4 py-2 rounded-xl border-2 border-base-content shadow-[4px_4px_0px_var(--color-base-content)] pointer-events-none whitespace-nowrap z-50">
                  {w.title}
                </div>
              </DockIcon>
            );
          })}
        </Dock>
      </div>

      {/* Desktop Area */}
      <div className="relative flex-1 w-full"
        onClick={() => {
          setIsLauncherOpen(false);
          setIsCalendarOpen(false);
        }}
      >
        {/* Draggable Desktop Widgets */}
        <div className="absolute inset-0 pointer-events-none z-0">
          {Object.values(WIDGET_REGISTRY).map(widget => {
            const WidgetComponent = widget.component;
            return <WidgetComponent key={widget.id} time={time} />;
          })}
        </div>

        {/* Desktop Icons Removed */}

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
