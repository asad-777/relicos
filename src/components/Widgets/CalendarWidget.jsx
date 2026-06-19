'use client';

import Widget from '../OS/Widget';
import { Calendar } from 'pixelarticons/react';

export default function CalendarWidget({ instanceId, initialX = 300, initialY = 64, initialWidth, initialHeight, preview, time }) {
  if (!time) return null;

  const currentMonth = time.getMonth();
  const currentYear = time.getFullYear();
  const currentDay = time.getDate();
  
  // Get first day of month and total days
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  
  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  return (
    <Widget instanceId={instanceId} initialX={initialX} initialY={initialY} initialWidth={initialWidth} initialHeight={initialHeight} preview={preview}>
      <div className="bg-base-200/80 backdrop-blur-xl p-4 rounded-[var(--radius-widget)] border-2 border-base-content/10 w-full min-w-[250px] h-full min-h-[200px] flex flex-col justify-between text-base-content drop-shadow-md">
        <div className="flex items-center justify-between mb-4 pb-2 border-b-2 border-base-content/10">
          <h2 className="text-lg font-bold uppercase tracking-widest text-primary">
            {time.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h2>
          <Calendar size={20} className="opacity-70" />
        </div>
        
        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {weekDays.map(d => (
            <div key={d} className="text-xs font-bold opacity-50 uppercase">{d}</div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1 text-center">
          {days.map((day, i) => (
            <div 
              key={i} 
              className={`text-sm font-bold p-1 rounded-sm ${day === currentDay ? 'bg-primary text-primary-content scale-110 shadow-sm' : ''} ${!day ? 'opacity-0' : 'opacity-80'}`}
            >
              {day}
            </div>
          ))}
        </div>
      </div>
    </Widget>
  );
}
