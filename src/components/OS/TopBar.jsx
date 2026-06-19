'use client';

import { Search, Volume3, Lightbulb, Globe, Play, Square, CloudSun, ChevronRight, ArrowRight, MessageText, User, GitMerge } from 'pixelarticons/react';
import CalendarPopup from '@/components/OS/CalendarPopup';
import ControlCenter from '@/components/OS/ControlCenter';
import { useSystemStore } from '@/lib/stores/systemStore';
import { useMusicStore } from '@/lib/stores/musicStore';
import { useWindowStore } from '@/lib/stores/windowStore';
import { APP_REGISTRY } from '@/lib/appRegistry';

const GithubIcon = ({ size, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.45-1.15-1.11-1.46-1.11-1.46-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"></path>
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


const Equalizer = ({ isPlaying }) => (
  <div className="flex items-end gap-[2px] h-[16px] w-[16px]">
    <div className={`w-[4px] bg-primary rounded-sm transition-all ${isPlaying ? 'animate-eq' : 'h-[4px]'}`} />
    <div className={`w-[4px] bg-primary rounded-sm transition-all ${isPlaying ? 'animate-eq-2' : 'h-[4px]'}`} />
    <div className={`w-[4px] bg-primary rounded-sm transition-all ${isPlaying ? 'animate-eq-3' : 'h-[4px]'}`} />
  </div>
);


export default function TopBar({ 
  hasActiveWindows, time, 
  setIsLauncherOpen, 
  isCalendarOpen, setIsCalendarOpen,
  isControlCenterOpen, setIsControlCenterOpen
}) {
  const { isPlaying, togglePlay, currentTrackIndex, tracks, nextTrack } = useMusicStore();
  const { windows, activeZIndex } = useWindowStore();
  const currentTrack = tracks.length > 0 ? tracks[currentTrackIndex] : null;

  // Find active window
  const activeWindow = windows.find(w => w.zIndex === activeZIndex && !w.isMinimized);
  const activeAppName = activeWindow ? (APP_REGISTRY[activeWindow.type]?.title || activeWindow.title || 'App') : null;

  return (
    <div className={`absolute left-1/2 -translate-x-1/2 top-4 z-9999 backdrop-blur-xl flex items-center justify-between shadow-[4px_4px_0px_var(--color-base-content)] transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group/topbar border-2 border-base-content/10 ${
      hasActiveWindows 
        ? 'w-[60%] max-w-3xl h-12 rounded-[24px] px-6 bg-base-200/40 hover:w-[calc(100%-2rem)] hover:max-w-none hover:h-16 hover:rounded-[32px] hover:bg-base-200/50 hover:px-8' 
        : 'w-[calc(100%-2rem)] max-w-none h-16 rounded-[32px] px-8 bg-base-200/50'
    }`}>
      
      {/* Left Side: Spotlight & Socials */}
      <div className={`flex items-center gap-6 h-full pl-2 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
        hasActiveWindows ? 'opacity-0 scale-95 pointer-events-none blur-sm group-hover/topbar:opacity-100 group-hover/topbar:scale-100 group-hover/topbar:pointer-events-auto group-hover/topbar:blur-none' : 'opacity-100 scale-100 blur-none'
      }`}>
        <button 
          onClick={() => setIsLauncherOpen(true)}
          className="flex items-center opacity-80 hover:opacity-100 hover:text-primary transition-all cursor-pointer group/search text-sm font-bold uppercase tracking-wider"
        >
          <Search size={28} className="group-hover/search:scale-110 transition-transform mr-4" />
          <span className="hidden xl:inline text-lg">Spotlight</span>
        </button>

        <span className="opacity-30">|</span>

        <div className="flex items-center gap-4">
          <div className="tooltip tooltip-bottom before:text-xs before:font-bold before:uppercase" data-tip="X (Twitter)">
            <a href="https://x.com/_asad_777" target="_blank" rel="noreferrer" className="opacity-80 hover:opacity-100 hover:text-primary transition-all group/link block">
              <XIcon size={24} className="group-hover/link:scale-110 transition-transform" />
            </a>
          </div>
          <div className="tooltip tooltip-bottom before:text-xs before:font-bold before:uppercase" data-tip="LinkedIn">
            <a href="https://www.linkedin.com/in/masadamir" target="_blank" rel="noreferrer" className="opacity-80 hover:opacity-100 hover:text-primary transition-all group/link block">
              <LinkedinIcon size={24} className="group-hover/link:scale-110 transition-transform" />
            </a>
          </div>
          <div className="tooltip tooltip-bottom before:text-xs before:font-bold before:uppercase" data-tip="GitHub">
            <a href="https://github.com/asad-777" target="_blank" rel="noreferrer" className="opacity-80 hover:opacity-100 hover:text-primary transition-all group/link block">
              <GithubIcon size={26} className="group-hover/link:scale-110 transition-transform" />
            </a>
          </div>
          <div className="tooltip tooltip-bottom before:text-xs before:font-bold before:uppercase" data-tip="Portfolio">
            <a href="https://asadamir.vercel.app" target="_blank" rel="noreferrer" className="opacity-80 hover:opacity-100 hover:text-primary transition-all group/link flex items-center gap-2">
              <Globe size={24} className="group-hover/link:scale-110 transition-transform" />
            </a>
          </div>
        </div>

        {activeAppName && (
          <>
            <span className="opacity-30">|</span>
            <div className="flex items-center gap-2 font-black text-primary">
              <ChevronRight size={20} className="opacity-50" />
              <span className="uppercase text-sm tracking-widest">{activeAppName}</span>
            </div>
          </>
        )}
      </div>

      {/* Center: Clock & Date */}
      <div 
        onClick={(e) => {
          e.stopPropagation();
          setIsCalendarOpen(!isCalendarOpen);
        }}
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

      {/* Right Side: Extras & System Tray */}
      <div 
        className={`flex items-center gap-4 h-full pr-2 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
        hasActiveWindows ? 'opacity-0 scale-95 pointer-events-none blur-sm group-hover/topbar:opacity-100 group-hover/topbar:scale-100 group-hover/topbar:pointer-events-auto group-hover/topbar:blur-none' : 'opacity-100 scale-100 blur-none'
      }`}>
        
        {/* Now Playing */}
        <div className="hidden lg:flex items-center gap-4 bg-base-300/60 px-4 py-2 rounded-2xl border border-base-content/10 w-full max-w-[260px] shadow-sm">
          <Equalizer isPlaying={isPlaying} />
          <span className="text-xs font-black uppercase truncate opacity-90 flex-1 tracking-wider" title={currentTrack}>
            {currentTrack ? currentTrack.replace('.mp3', '') : 'No tracks'}
          </span>
          <div className="flex items-center gap-2">
            <button onClick={togglePlay} className="hover:text-primary transition-all hover:scale-110 flex-shrink-0 bg-base-100 p-1.5 rounded-xl border border-base-content/5 shadow-sm">
              {isPlaying ? <Square size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
            </button>
            <button onClick={nextTrack} className="hover:text-primary transition-all hover:scale-110 flex-shrink-0 bg-base-100 p-1.5 rounded-xl border border-base-content/5 shadow-sm">
              <ArrowRight size={20} fill="currentColor" />
            </button>
          </div>
        </div>

        {/* Weather */}
        <div className="hidden md:flex items-center gap-3 bg-base-300/60 px-5 py-2.5 rounded-2xl border border-base-content/10 text-sm font-bold uppercase opacity-90 shadow-sm">
          <CloudSun size={24} className="text-warning" />
          <span>72°F</span>
        </div>

        {/* System Tray */}
        <div 
          onClick={(e) => {
            e.stopPropagation();
            setIsControlCenterOpen(!isControlCenterOpen);
          }}
          role="button"
          tabIndex={0}
          className="flex items-center gap-3 bg-base-300/60 px-4 py-2 rounded-2xl border border-base-content/10 shadow-sm transition-colors hover:border-primary/50 cursor-pointer"
        >
          <div className="flex items-center gap-3 hover:text-primary transition-colors opacity-80">
            <Volume3 size={24} strokeWidth={2.5} />
            <Lightbulb size={24} strokeWidth={2.5} />
          </div>
        </div>
      </div>
      
      {isControlCenterOpen && <ControlCenter />}
    </div>
  );
}
