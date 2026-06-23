'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Smartphone } from 'pixelarticons/react';
import Image from 'next/image';
import Link from 'next/link';

const BOOT_LOGS = [
  "Relic OS BIOS v1.0.4",
  "Copyright (C) 2024 Relic Systems Inc.",
  "Checking RAM... 640K OK",
  "Reticulating splines...",
  "Warming up pixels...",
  "Tuning the flux capacitor...",
  "Loading kernel...",
  "Mounting virtual filesystem...",
  "Initializing window manager...",
  "Boot sequence complete."
];

export default function BootScreen({ onComplete }) {
  const [logs, setLogs] = useState([]);
  const [showButton, setShowButton] = useState(false);
  const [isMobile, setIsMobile] = useState(null);

  useEffect(() => {
    const checkDimensions = () => {
      if (window.innerWidth < 1080 || window.innerHeight < 720) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    };

    checkDimensions();
    window.addEventListener('resize', checkDimensions);
    return () => window.removeEventListener('resize', checkDimensions);
  }, []);

  useEffect(() => {
    if (isMobile === true || isMobile === null) return;

    let currentLog = 0;
    const interval = setInterval(() => {
      if (currentLog < BOOT_LOGS.length) {
        setLogs(prev => [...prev, BOOT_LOGS[currentLog]]);
        currentLog++;
      } else {
        clearInterval(interval);
        setTimeout(() => setShowButton(true), 500);
      }
    }, 200);

    return () => clearInterval(interval);
  }, [isMobile]);

  if (isMobile === null) return <div className="fixed inset-0 bg-base-300 z-50"></div>;

  if (isMobile) {
    return (
      <>
      <div className="absolute top-8 left-8 z-51">
        <Link href="/">
          <Button variant="outline" className="font-heading uppercase tracking-widest border-2 border-base-content bg-base-100 text-base-content hover:bg-base-300 shadow-[4px_4px_0px_var(--color-base-content)] hover:translate-y-1 hover:shadow-none transition-all p-6">
            &lt;- Go Back
          </Button>
        </Link>
      </div>
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-base-300 p-8 text-center">
        <div className="bg-base-200 border-4 border-error p-8 max-w-screen shadow-[8px_8px_0px_var(--color-error)] flex flex-col items-center">
          <Smartphone className="w-16 h-16 text-error mb-4 animate-pulse" />
          <h1 className="text-3xl font-black mb-4 uppercase font-heading text-error">Screen Too Small</h1>
          <p className="text-lg text-base-content font-body font-bold uppercase">
            Relic OS requires a minimum resolution of 1080 x 720. 
            <br/><br/>
            Please use a larger device like an iPad or a computer to boot the OS.
          </p>
        </div>
      </div>
      </>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center  text-success font-mono p-8 overflow-hidden">
      
      {/* Absolute Go Back Button */}
      <div className="absolute top-8 left-8 z-50">
        <Link href="/">
          <Button variant="outline" className="font-heading uppercase tracking-widest border-2 border-base-content bg-base-100 text-base-content hover:bg-base-300 shadow-[4px_4px_0px_var(--color-base-content)] hover:translate-y-1 hover:shadow-none transition-all p-6">
            &lt;- Go Back
          </Button>
        </Link>
      </div>

      <div className="max-w-2xl w-full flex flex-col items-center">
        
        {/* Header containing Logo and ASCII */}
        <div className="flex items-center justify-center gap-8 mb-8 animate-in slide-in-from-bottom-8 duration-700 flex-wrap">
          <Image src="/logo - FullSize.png" alt="Relic OS Logo" width={128} height={128} className="drop-shadow-[4px_4px_0px_var(--color-base-content)]" />
          <div className="text-primary hidden sm:block">
            <pre className="text-xs md:text-sm leading-tight font-bold text-left">
{`  _____  ______ _      _____ _____    ____   _____ 
 |  __ \\|  ____| |    |_   _/ ____|  / __ \\ / ____|
 | |__) | |__  | |      | || |      | |  | | (___  
 |  _  /|  __| | |      | || |      | |  | |\\___ \\ 
 | | \\ \\| |____| |____ _| || |____  | |__| |____) |
 |_|  \\_\\______|______|_____\\_____|  \\____/|_____/ `}
            </pre>
          </div>
        </div>

        {/* Fake BIOS Screen */}
        <div className="flex flex-col bg-base-200 gap-2 text-sm md:text-base mb-12 w-full min-w-1/2  bg-base-100 p-6 border-2 border-success shadow-[4px_4px_0px_var(--color-success)] h-88 overflow-y-auto">
          {logs.map((log, i) => (
            <div key={i}>[ <span className="text-primary font-bold">OK</span> ] {log}</div>
          ))}
          {!showButton && (
            <div className="animate-pulse">_</div>
          )}
        </div>

        {/* Start Button */}
        {showButton && (
          <div className="animate-in fade-in zoom-in duration-500">
            <Button 
              onClick={onComplete}
              size="lg"
              className="text-2xl py-8 px-12 animate-pulse shadow-[8px_8px_0px_var(--color-base-content)] hover:shadow-[4px_4px_0px_var(--color-base-content)] hover:translate-y-1 font-heading uppercase tracking-widest border-4 border-base-content bg-primary text-primary-content transition-all"
            >
              Start OS
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
