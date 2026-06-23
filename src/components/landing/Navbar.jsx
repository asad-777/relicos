'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';

export function Navbar() {
  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[90%] md:w-[80%] max-w-6xl bg-base-100/90 backdrop-blur-sm border-2 border-base-content shadow-[6px_6px_0px_var(--color-base-content)] px-4 py-2 z-50 flex items-center justify-between transition-all">
      <div className="flex-1">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.png" alt="Relic OS Logo" width={32} height={32} className="pixelated" />
          <span className="font-heading text-2xl uppercase text-primary tracking-wider" style={{ textShadow: "2px 2px 0px var(--color-base-content)" }}>
            Relic OS
          </span>
        </Link>
      </div>
      <div className="flex-none flex items-center gap-4">
        <ul className="menu menu-horizontal px-1 font-heading uppercase hidden md:flex font-bold">
          <li><button onClick={(e) => { e.preventDefault(); document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-primary">Features</button></li>
          <li><button onClick={(e) => { e.preventDefault(); document.getElementById('guide')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-primary">Guide</button></li>
        </ul>
        <div className="hidden sm:block">
          <ThemeSwitcher />
        </div>
        <Link href="/os">
          <Button className="font-heading rounded-none py-4 uppercase tracking-widest border-2 border-primary-content bg-primary text-primary-content shadow-[4px_4px_0px_var(--color-base-content)] hover:bg-primary/90 hover:translate-y-1 hover:shadow-none transition-all">
            Boot OS
          </Button>
        </Link>
      </div>
    </nav>
  );
}
