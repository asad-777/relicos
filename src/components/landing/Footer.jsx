'use client';

import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
  return (
    <footer className="w-full py-16 bg-base-200 text-base-content">
      <div className="py-16 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="flex flex-col w-full min-w-full md:flex-row justify-between items-center md:items-center gap-12 border-b pb-16 border-base-content/20 text-center md:text-left">
          
          {/* Logo and Name Side */}
          <div className="flex flex-col md:flex-row items-center gap-4">
            <Image src="/logo.png" alt="Relic OS Logo" width={56} height={56} className="pixelated" />
            <h2 className="text-3xl md:text-5xl font-black font-heading uppercase tracking-widest text-base-content">
                Relic OS
            </h2>
          </div>

          {/* Links Side */}
          <div className="flex flex-wrap justify-center md:justify-between items-center w-full md:w-fit gap-x-4 md:gap-x-8 gap-y-4 font-heading text-sm sm:text-base md:text-lg tracking-widest uppercase text-base-content/80">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span className="hidden sm:inline">|</span>
            <Link href="/os" className="hover:text-primary transition-colors">Boot OS</Link>
            <span className="hidden sm:inline">|</span>
            <a href="#guide" className="hover:text-primary transition-colors">Manual</a>
          </div>

        </div>

        {/* Copyright Text */}
        <div className="mt-16 text-center font-body text-xs text-base-content/50 uppercase tracking-widest">
          <p>© {new Date().getFullYear()} Relic OS. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
