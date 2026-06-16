'use client';

import { useState, useEffect } from 'react';
import { useWindowStore } from '@/lib/stores/windowStore';
import { useWidgetStore } from '@/lib/stores/widgetStore';
import { useThemeStore, THEMES, BACKGROUNDS } from '@/lib/stores/themeStore';
import Window from './Window';
import AppLauncher from './AppLauncher';
import Widget from './Widget';

import { Dock, DockIcon } from '@/components/ui/dock';
import GameDirectory from '@/components/Apps/GameDirectory';
import CalculatorApp from '@/components/Apps/Calculator';
import MusicPlayer from '@/components/Apps/MusicPlayer';
import SettingsApp from '@/components/Apps/Settings';
import WidgetApp from '@/components/Apps/WidgetApp';
import BrowserApp from '@/components/Apps/BrowserApp';
import { APP_REGISTRY } from '@/lib/appRegistry';
import { WIDGET_REGISTRY } from '@/lib/widgetRegistry';
import DesktopIcon from '@/components/OS/DesktopIcon';
import SystemAudio from '@/components/OS/SystemAudio';
import { Box } from 'lucide-react';
import TopBar from './TopBar';

export default function Desktop() {
  const { windows, restoreWindow, focusWindow, openWindow, closeWindow } = useWindowStore();
  const { activeWidgets } = useWidgetStore();
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
      <TopBar 
        hasActiveWindows={hasActiveWindows} 
        time={time} 
        setIsLauncherOpen={setIsLauncherOpen} 
        isCalendarOpen={isCalendarOpen} 
        setIsCalendarOpen={setIsCalendarOpen} 
      />


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

      <SystemAudio />

      {/* Desktop Area */}
      <div className="relative flex-1 w-full"
        onClick={() => {
          setIsLauncherOpen(false);
          setIsCalendarOpen(false);
        }}
      >
        {/* Draggable Desktop Widgets */}
        <div className="absolute inset-0 pointer-events-none z-0">
          {activeWidgets.map(widgetInstance => {
            const widgetDef = WIDGET_REGISTRY[widgetInstance.widgetId];
            if (!widgetDef) return null;
            const WidgetComponent = widgetDef.component;
            return (
              <WidgetComponent 
                key={widgetInstance.instanceId} 
                instanceId={widgetInstance.instanceId}
                initialX={widgetInstance.x}
                initialY={widgetInstance.y}
                initialWidth={widgetInstance.width}
                initialHeight={widgetInstance.height}
                time={time} 
              />
            );
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
            {w.type === 'widgets' && (
              <WidgetApp />
            )}
            {w.type === 'browser' && (
              <BrowserApp />
            )}
          </Window>
          );
        })}
      </div>

      <AppLauncher isOpen={isLauncherOpen} onClose={() => setIsLauncherOpen(false)} />
    </div>
  );
}
