'use client';

import { usePathname } from 'next/navigation';
import PixelSnow from './PixelSnow';

export default function PixelSnowWrapper() {
  const pathname = usePathname();

  // Do not render PixelSnow on the /os route or any of its subpaths
  if (pathname === '/os' || pathname?.startsWith('/os/')) {
    return null;
  }

  return <PixelSnow />;
}
