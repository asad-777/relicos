'use client';

import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
  return (
    <footer className="w-full py-16 bg-base-200 text-base-content">
      <div className="py-16 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="flex flex-col w-full  min-w-full md:flex-row justify-between items-start md:items-center gap-12 border-b pb-16 border-base-content/20">
          
          {/* Logo and Name Side */}
          <div className="flex items-center gap-4">
            <Image src="/logo.png" alt="Relic OS Logo" width={56} height={56} className="pixelated" />
            <h2 className="text-4xl md:text-5xl font-black font-heading uppercase tracking-widest text-base-content">
                Relic OS
            </h2>
          </div>

          {/* Links Side */}
          <div className="flex justify-between  w-fit gap-x-8 gap-y-4 font-heading text-lg tracking-widest uppercase text-base-content/80">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            |
            <Link href="/os" className="hover:text-primary transition-colors">Boot OS</Link>
            |
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
