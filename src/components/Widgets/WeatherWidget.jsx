'use client';

import Widget from '../OS/Widget';
import { Sun } from 'lucide-react';

export default function WeatherWidget({ time }) {
  if (!time) return null;

  const getGreeting = () => {
    const hour = time.getHours();
    if (hour < 12) return 'MORNING';
    if (hour < 18) return 'AFTERNOON';
    return 'EVENING';
  };

  return (
    <Widget id="weather" defaultX={64} defaultY={450}>
      <div className="bg-base-200/40 backdrop-blur-sm p-6 rounded-(--radius-widget) border-2 border-white/10 w-full h-full text-base-content drop-shadow-md transition-all duration-300">
        <h2 className="text-2xl font-bold uppercase leading-tight">
          GOOD {getGreeting()},<br/>USER!
        </h2>
        <div className="flex items-center gap-3 mt-4 opacity-90">
          <div className="bg-warning text-warning-content p-2 rounded-xl">
            <Sun size={24} />
          </div>
          <div>
            <div className="text-xl font-bold">24°C / SUNNY</div>
            <div className="text-sm font-bold opacity-60 uppercase">High 26° / Low 18°</div>
          </div>
        </div>
      </div>
    </Widget>
  );
}
