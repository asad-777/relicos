'use client';

import Widget from '../OS/Widget';
import { Sun } from 'lucide-react';

export default function WeatherWidget({ instanceId, initialX = 64, initialY = 360, initialWidth, initialHeight, preview, time }) {
  if (!time) return null;


  return (
    <Widget instanceId={instanceId} initialX={initialX} initialY={initialY} initialWidth={initialWidth} initialHeight={initialHeight} preview={preview}>
      <div className="bg-base-200/50 backdrop-blur-xl p-6 rounded-[var(--radius-widget)] border-2 border-white/10 w-full min-w-[250px] h-full min-h-[120px] text-base-content drop-shadow-md transition-all duration-300">
          <div className="flex items-center gap-3  opacity-90">
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
