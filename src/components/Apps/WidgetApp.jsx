'use client';

import { useState, useEffect } from 'react';
import { useWidgetStore } from '@/lib/stores/widgetStore';
import { WIDGET_REGISTRY } from '@/lib/widgetRegistry';
import { Plus } from 'pixelarticons/react';

export default function WidgetApp() {
  const { addWidget } = useWidgetStore();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full h-full bg-base-100 flex flex-col rounded-b-xl overflow-x-hidden p-6 text-base-content overflow-y-auto" data-lenis-prevent="true">
      <h1 className="text-3xl font-black mb-6 uppercase tracking-widest border-b-2 border-base-content/20 pb-4">
        Widget Gallery
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {Object.entries(WIDGET_REGISTRY).map(([key, widget]) => {
          const WidgetComponent = widget.component;
          return (
            <div key={key} className="relative group/preview flex flex-col h-full">
              <div 
                className="flex-1 border-4 border-base-300 rounded-3xl p-4 bg-base-200/50 relative overflow-hidden transition-all duration-300 hover:border-primary min-h-[300px] flex items-center justify-center cursor-pointer group/card shadow-sm hover:shadow-xl"
                onClick={() => addWidget(key, widget.defaultX, widget.defaultY)}
              >
                
                {/* Top right Plus button */}
                <div className="absolute top-4 right-4 z-50 opacity-0 group-hover/card:opacity-100 transition-opacity">
                  <button 
                    className="w-12 h-12 rounded-full bg-success text-success-content flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-transform cursor-pointer border-2 border-success-content/20"
                    title={`Add ${key} widget`}
                  >
                    <Plus size={24} strokeWidth={3} />
                  </button>
                </div>

                {/* Render the widget component in preview mode */}
                <div className="relative w-max pointer-events-none transition-transform duration-300 group-hover/card:scale-[1.02]">
                  <WidgetComponent preview={true} time={time} />
                </div>
              </div>
              <p className="mt-4 text-center font-bold uppercase tracking-widest text-sm opacity-70">
                {key} Widget
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
