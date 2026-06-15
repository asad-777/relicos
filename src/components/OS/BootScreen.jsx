'use client';

import { useEffect, useState } from 'react';

const BOOT_LOGS = [
  "Loading Linux relic-retro-core...",
  "Loading initial ramdisk...",
  ":: running early hook [udev]",
  "Starting systemd-udevd version 255-1",
  ":: running hook [udev]",
  "Triggering uevents...",
  ":: mounting '/dev/disk/by-uuid/' on real root",
  ":: running cleanup hook [udev]",
  "Welcome to Relic OS Linux!",
  "Starting NetworkManager...",
  "Starting Display Manager...",
  "Running neofetch..."
];

export default function BootScreen({ onComplete }) {
  const [logs, setLogs] = useState([]);
  const [showNeofetch, setShowNeofetch] = useState(false);

  useEffect(() => {
    let currentLog = 0;
    const interval = setInterval(() => {
      if (currentLog < BOOT_LOGS.length) {
        setLogs(prev => [...prev, BOOT_LOGS[currentLog]]);
        currentLog++;
      } else {
        clearInterval(interval);
        setTimeout(() => setShowNeofetch(true), 400);
        setTimeout(() => onComplete(), 3000); // give 3 seconds to read neofetch
      }
    }, 120);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div 
      className="fixed inset-0 z-50 flex flex-col bg-black text-[#00FF00] font-mono p-4 cursor-pointer overflow-hidden"
      onClick={onComplete}
      title="Click to skip"
    >
      <div className="flex flex-col gap-1 text-xs sm:text-sm">
        {logs.map((log, i) => (
          <div key={i}>[  <span className="text-white">OK</span>  ] {log}</div>
        ))}
      </div>

      {showNeofetch && (
        <div className="mt-8 flex gap-8 animate-in fade-in duration-500">
          <div className="text-primary hidden sm:block">
            <pre className="text-xs leading-tight font-bold">
{`   _____      .__  .__        
  /  _  \\_.__.|  | |__| ____  
 /  /_\\  \\  __\\  | |  |/ ___\\ 
/    |    \\  | \\  |_|  \\  \\___ 
\\____|__  /__| |____/__|\\___  >
        \\/                  \\/ `}
            </pre>
          </div>
          <div className="flex flex-col gap-1 text-xs sm:text-sm">
            <div><span className="text-primary font-bold">root</span>@<span className="text-primary font-bold">relicos</span></div>
            <div>-------------------</div>
            <div><span className="text-primary font-bold">OS:</span> Relic OS (Arch Linux Base)</div>
            <div><span className="text-primary font-bold">Host:</span> GameBoy Emulator Platform</div>
            <div><span className="text-primary font-bold">Kernel:</span> 6.9.1-retro</div>
            <div><span className="text-primary font-bold">Uptime:</span> 0 mins</div>
            <div><span className="text-primary font-bold">Packages:</span> 404 (pacman)</div>
            <div><span className="text-primary font-bold">Shell:</span> bash 5.2.26</div>
            <div><span className="text-primary font-bold">WM:</span> Custom Tiling (Retro)</div>
            <div><span className="text-primary font-bold">Theme:</span> original</div>
            <div><span className="text-primary font-bold">Terminal:</span> tty1</div>
            <div className="mt-2 flex gap-1">
               <div className="w-4 h-4 bg-black"></div>
               <div className="w-4 h-4 bg-red-500"></div>
               <div className="w-4 h-4 bg-green-500"></div>
               <div className="w-4 h-4 bg-yellow-500"></div>
               <div className="w-4 h-4 bg-blue-500"></div>
               <div className="w-4 h-4 bg-purple-500"></div>
               <div className="w-4 h-4 bg-cyan-500"></div>
               <div className="w-4 h-4 bg-white"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
