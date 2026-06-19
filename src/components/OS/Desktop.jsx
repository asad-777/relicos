'use client';

import { useState, useEffect, useRef } from 'react';

import { useWindowStore } from '@/lib/stores/windowStore';
import { useWidgetStore } from '@/lib/stores/widgetStore';
import { useThemeStore, THEMES, BACKGROUNDS } from '@/lib/stores/themeStore';
import { useContextMenuStore } from '@/lib/stores/contextMenuStore';
import { useDesktopStore } from '@/lib/stores/desktopStore';
import { useSystemStore } from '@/lib/stores/systemStore';
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
import YoutubeApp from '@/components/Apps/YoutubeApp';
import { APP_REGISTRY } from '@/lib/appRegistry';
import { WIDGET_REGISTRY } from '@/lib/widgetRegistry';
import DesktopIcon from '@/components/OS/DesktopIcon';
import SystemAudio from '@/components/OS/SystemAudio';
import { Box, Settings, LayoutDashboard, Image as ImageIcon, X } from 'lucide-react';
import TopBar from './TopBar';
import ContextMenu from './ContextMenu';

export default function Desktop() {
  const { windows, restoreWindow, focusWindow, openWindow, closeWindow } = useWindowStore();
  const { activeWidgets, addWidget } = useWidgetStore();
  const { theme, background } = useThemeStore();
  const { openMenu } = useContextMenuStore();
  const { icons, selectedIconIds, clearSelection, setSelection, addIcon } = useDesktopStore();
  const { brightness } = useSystemStore();

  const [time, setTime] = useState(new Date());
  const [isLauncherOpen, setIsLauncherOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isControlCenterOpen, setIsControlCenterOpen] = useState(false);
  const [isDockHovered, setIsDockHovered] = useState(false);
  
  const [selectionBox, setSelectionBox] = useState(null);
  const desktopRef = useRef(null);
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

  const handleDesktopContextMenu = (e) => {
    // Only trigger if clicking directly on the desktop background (not an icon or window)
    if (e.target.id === 'desktop-bg' || e.target === e.currentTarget) {
      e.preventDefault();
      e.stopPropagation();
      openMenu(e.clientX, e.clientY, [
        { label: 'Open App Launcher', icon: Box, onClick: () => setIsLauncherOpen(true) },
        { divider: true },
        { label: 'Add Clock Widget', icon: LayoutDashboard, onClick: () => addWidget('clock', e.clientX, e.clientY) },
        { label: 'Add Weather Widget', icon: LayoutDashboard, onClick: () => addWidget('weather', e.clientX + 20, e.clientY + 20) },
        { divider: true },
        { label: 'Change Wallpaper', icon: ImageIcon, onClick: () => openWindow({
          id: APP_REGISTRY.settings.id,
          title: APP_REGISTRY.settings.title,
          type: APP_REGISTRY.settings.type,
          width: APP_REGISTRY.settings.defaultWidth,
          height: APP_REGISTRY.settings.defaultHeight
        })}
      ]);
    }
  };

  const handlePointerDown = (e) => {
    // Only start selection box if clicking on the background itself, left click
    if (e.button !== 0) return;
    if (e.target.id === 'desktop-bg' || e.target === e.currentTarget) {
      clearSelection();
      setSelectionBox({
        startX: e.clientX,
        startY: e.clientY,
        currentX: e.clientX,
        currentY: e.clientY
      });
      document.addEventListener('pointermove', handlePointerMove);
      document.addEventListener('pointerup', handlePointerUp);
    }
  };

  const handlePointerMove = (e) => {
    setSelectionBox(prev => {
      if (!prev) return null;
      return { ...prev, currentX: e.clientX, currentY: e.clientY };
    });
  };

  useEffect(() => {
    if (!selectionBox) return;
    
    const left = Math.min(selectionBox.startX, selectionBox.currentX);
    const right = Math.max(selectionBox.startX, selectionBox.currentX);
    const top = Math.min(selectionBox.startY, selectionBox.currentY);
    const bottom = Math.max(selectionBox.startY, selectionBox.currentY);
    
    const boxRect = { left, right, top, bottom };
    
    const intersectingIds = [];
    const iconElements = document.querySelectorAll('[data-icon-id]');
    
    iconElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (
        rect.left < boxRect.right &&
        rect.right > boxRect.left &&
        rect.top < boxRect.bottom &&
        rect.bottom > boxRect.top
      ) {
        intersectingIds.push(el.getAttribute('data-icon-id'));
      }
    });
    
    setSelection(intersectingIds);
  }, [selectionBox, setSelection]);

  const handlePointerUp = () => {
    setSelectionBox(null);
    document.removeEventListener('pointermove', handlePointerMove);
    document.removeEventListener('pointerup', handlePointerUp);
  };

  return (
    <div 
      className="relative w-full h-screen overflow-hidden flex flex-col bg-cover bg-center transition-all duration-700"
      style={{ backgroundImage: `url('/wallpapers/${BACKGROUNDS.includes(background) ? background : BACKGROUNDS[0]}.png')` }}
    >
      <ContextMenu />
      <TopBar 
        hasActiveWindows={hasActiveWindows} 
        time={time} 
        setIsLauncherOpen={setIsLauncherOpen} 
        isCalendarOpen={isCalendarOpen} 
        setIsCalendarOpen={setIsCalendarOpen} 
        isControlCenterOpen={isControlCenterOpen}
        setIsControlCenterOpen={setIsControlCenterOpen}
      />


      {/* Bottom Floating Task List (MagicUI Dock) - Auto Hiding */}
      <div 
        className="absolute bottom-0 left-0 w-full h-8 z-[9999]" 
        onMouseEnter={() => setIsDockHovered(true)}
      ></div>

      <div 
        className={`absolute bottom-4 left-1/2 -translate-x-1/2 z-[9999] transition-transform duration-500 ease-out ${
          isDockHovered || !hasActiveWindows ? 'translate-y-0' : 'translate-y-[75%]'
        }`}
        onMouseEnter={() => setIsDockHovered(true)}
        onMouseLeave={() => setIsDockHovered(false)}
      >
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
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('relicos/appId', app.id);
                  e.dataTransfer.effectAllowed = 'copy';
                }}
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
                  const items = [
                    { label: isOpen ? 'Focus App' : 'Open App', icon: app.icon, onClick: () => {
                      if (isOpen) focusWindow(w.id);
                      else openWindow({ id: app.id, title: app.title, type: app.type, width: app.defaultWidth, height: app.defaultHeight });
                    }}
                  ];
                  if (isOpen) {
                    items.push({ divider: true });
                    items.push({ label: 'Force Quit', icon: X, onClick: () => closeWindow(app.id) });
                  }
                  openMenu(e.clientX, e.clientY - 100, items);
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
            <div key="dock-separator" className="w-px h-8 bg-white/20 mx-2"></div>
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
      <div 
        id="desktop-bg"
        ref={desktopRef}
        className="relative flex-1 w-full"
        onContextMenu={handleDesktopContextMenu}
        onPointerDown={handlePointerDown}
        onDragOver={(e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = 'copy';
        }}
        onDrop={(e) => {
          e.preventDefault();
          const appId = e.dataTransfer.getData('relicos/appId');
          if (appId) {
            // center the icon on drop
            addIcon(appId, e.clientX - 48, e.clientY - 48);
          }
        }}
        onClick={() => {
          setIsLauncherOpen(false);
          setIsCalendarOpen(false);
          setIsControlCenterOpen(false);
        }}
      >
        {/* Selection Box */}
        {selectionBox && (
          <div 
            className="absolute bg-primary/20 border border-primary pointer-events-none z-[50]"
            style={{
              left: Math.min(selectionBox.startX, selectionBox.currentX),
              top: Math.min(selectionBox.startY, selectionBox.currentY) - 64, // offset top bar height since container is below it
              width: Math.abs(selectionBox.currentX - selectionBox.startX),
              height: Math.abs(selectionBox.currentY - selectionBox.startY)
            }}
          />
        )}

        {/* Desktop Icons */}
        {icons.map(instance => (
          <DesktopIcon key={instance.instanceId} instance={instance} />
        ))}

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
                <SettingsApp key="settings" />
              )}
            {w.type === 'directory' && (
              <GameDirectory key="directory" />
            )}
            {w.type === 'iframe' && (
              <iframe 
                key="iframe"
                src={w.url} 
                className="w-full h-full border-none rounded-b-xl" 
                allow="autoplay; fullscreen" 
              />
            )}

            {w.type === 'calculator' && (
              <CalculatorApp key="calculator" />
            )}
            {w.type === 'music' && (
              <MusicPlayer key="music" />
            )}
            {w.type === 'widgets' && (
              <WidgetApp key="widgets" />
            )}
            {w.type === 'browser' && (
              <BrowserApp key="browser" />
            )}
            {w.type === 'youtube' && (
              <YoutubeApp key="youtube" />
            )}
          </Window>
          );
        })}

      </div>

      <AppLauncher isOpen={isLauncherOpen} onClose={() => setIsLauncherOpen(false)} />
      
      {/* Brightness Overlay */}
      <div 
        className="absolute inset-0 bg-black pointer-events-none z-[999999] transition-opacity duration-300"
        style={{ opacity: (100 - brightness) / 100 * 0.8 }} 
      />
    </div>
  );
}
