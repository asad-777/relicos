import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'pixelarticons/react';

export default function CalendarPopup() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const prevMonth = (e) => {
    e.stopPropagation();
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };
  const nextMonth = (e) => {
    e.stopPropagation();
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const jumpToMonth = (monthIndex, e) => {
    e.stopPropagation();
    setCurrentDate(new Date(currentDate.getFullYear(), monthIndex, 1));
  };

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
  const today = new Date();
  const isCurrentMonth = today.getMonth() === currentDate.getMonth() && today.getFullYear() === currentDate.getFullYear();

  // Auto-scroll the active month into view
  const monthListRef = useRef(null);
  useEffect(() => {
    if (monthListRef.current) {
      const activeMonth = monthListRef.current.children[currentDate.getMonth()];
      if (activeMonth) {
        activeMonth.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [currentDate]);

  return (
    <div 
      className="absolute top-full left-1/2 -translate-x-1/2 mt-4 z-[9999] w-max flex flex-row items-start filter drop-shadow-[6px_6px_0px_var(--color-base-content)] cursor-default"
      onClick={(e) => e.stopPropagation()}
      onWheel={(e) => e.stopPropagation()}
    >
      {/* Left Pocket (Months) */}
      <div 
        className="w-fit px-2 bg-base-300 border-2 border-base-content border-r-0 rounded-l-xl relative z-10"
        style={{ height: '260px' }}
      >
        {/* Cover line to hide the calendar's left border where they connect */}
        <div className="absolute -right-[2px] top-0 bottom-0 w-[2px] bg-base-300 pointer-events-none"></div>

        <div className="overflow-y-auto overflow-x-hidden h-full p-2 flex flex-col gap-1 overscroll-contain" ref={monthListRef} data-lenis-prevent="true">
          {monthNames.map((month, idx) => (
            <button
              key={month}
              onClick={(e) => jumpToMonth(idx, e)}
              className={`p-2 rounded-lg text-left transition-colors text-sm whitespace-nowrap font-bold ${currentDate.getMonth() === idx ? 'bg-primary text-primary-content border-2 border-base-content shadow-[2px_2px_0px_var(--color-base-content)]' : 'border-2 border-transparent hover:bg-base-content/10'}`}
            >
              {month}
            </button>
          ))}
        </div>
      </div>

      {/* Main Calendar Area */}
      <div className="w-[380px] bg-base-300 border-2 border-base-content rounded-r-xl rounded-bl-xl p-6 relative z-0 flex flex-col text-base-content font-bold">
        <div className="flex justify-between items-center mb-6 px-1 border-b-2 border-base-content/20 pb-4">
          <button onClick={prevMonth} className="hover:bg-base-content/20 p-2 rounded-lg transition-colors cursor-pointer border-2 border-transparent hover:border-base-content"><ChevronLeft size={20} /></button>
          <span className="text-xl tracking-wider uppercase">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</span>
          <button onClick={nextMonth} className="hover:bg-base-content/20 p-2 rounded-lg transition-colors cursor-pointer border-2 border-transparent hover:border-base-content"><ChevronRight size={20} /></button>
        </div>
        
        <div className="grid grid-cols-7 gap-2 text-center text-xs opacity-70 mb-3 font-black uppercase">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => <div key={d}>{d}</div>)}
        </div>
        
        <div className="grid grid-cols-7 gap-2 text-center text-base">
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} className="p-2"></div>
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const isToday = isCurrentMonth && day === today.getDate();
            return (
              <div 
                key={day} 
                className={`p-2 rounded-lg flex items-center justify-center aspect-square font-black transition-all border-2 ${isToday ? 'bg-primary text-primary-content border-base-content shadow-[2px_2px_0px_var(--color-base-content)] scale-110' : 'border-transparent hover:border-base-content hover:bg-base-content/10 cursor-pointer hover:scale-110'}`}
              >
                {day}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
