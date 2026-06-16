'use client';

import { Search, Globe } from 'lucide-react';
import CalendarPopup from '@/components/OS/CalendarPopup';

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

export default function TopBar({ hasActiveWindows, time, setIsLauncherOpen, isCalendarOpen, setIsCalendarOpen }) {
  return (
    <div className={`absolute left-1/2 -translate-x-1/2 top-4 z-9999 backdrop-blur-xl flex items-center justify-between shadow-[4px_4px_0px_rgba(0,0,0,0.3)] transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group/topbar border-2 border-white/10 ${
      hasActiveWindows 
        ? 'w-[60%] max-w-3xl h-12 rounded-[24px] px-6 bg-base-200/40 hover:w-[calc(100%-2rem)] hover:max-w-none hover:h-16 hover:rounded-[32px] hover:bg-base-200/50 hover:px-8' 
        : 'w-[calc(100%-2rem)] max-w-none h-16 rounded-[32px] px-8 bg-base-200/50'
    }`}>
      
      {/* Left Side: Spotlight */}
      <div className={`flex items-center gap-4 h-full pl-2 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
        hasActiveWindows ? 'opacity-0 scale-95 pointer-events-none blur-sm group-hover/topbar:opacity-100 group-hover/topbar:scale-100 group-hover/topbar:pointer-events-auto group-hover/topbar:blur-none' : 'opacity-100 scale-100 blur-none'
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

      {/* Right Side: Links */}
      <div className={`flex items-center gap-6 h-full text-lg font-bold uppercase tracking-wider pr-2 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
        hasActiveWindows ? 'opacity-0 scale-95 pointer-events-none blur-sm group-hover/topbar:opacity-100 group-hover/topbar:scale-100 group-hover/topbar:pointer-events-auto group-hover/topbar:blur-none' : 'opacity-100 scale-100 blur-none'
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
  );
}
