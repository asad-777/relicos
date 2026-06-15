'use client';

import { useState } from 'react';
import BootScreen from '@/components/OS/BootScreen';
import Desktop from '@/components/OS/Desktop';

export default function OSPage() {
  const [isBooting, setIsBooting] = useState(true);

  return (
    <main className="min-h-screen w-full bg-base-100 font-body overflow-hidden">
      {isBooting ? (
        <BootScreen onComplete={() => setIsBooting(false)} />
      ) : (
        <Desktop />
      )}
    </main>
  );
}
