'use client';

import Widget from '../OS/Widget';

export default function ClockWidget({ instanceId, initialX = 64, initialY = 200, initialWidth, initialHeight, preview, time }) {
  if (!time) return null;

  return (
    <Widget instanceId={instanceId} initialX={initialX} initialY={initialY} initialWidth={initialWidth} initialHeight={initialHeight} preview={preview}>
      <div className="bg-base-200/50 backdrop-blur-xl p-6 rounded-[var(--radius-widget)] border-2 border-white/10 w-full h-full min-w-[250px] min-h-[180px] text-base-content drop-shadow-md transition-all duration-300">
        <p className="text-2xl font-bold opacity-80 uppercase tracking-widest">
          {time.toLocaleDateString('en-US', { weekday: 'long' })}
        </p>
        <h1 className="text-7xl font-extrabold uppercase leading-none mt-2 font-heading tracking-tight text-primary">
          {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).replace(' AM', '').replace(' PM', '')}
        </h1>
        <p className="text-lg font-bold mt-2 opacity-60 uppercase">
          {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).includes('AM') ? 'AM' : 'PM'} // {time.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </p>
      </div>
    </Widget>
  );
}
