'use client';

import Widget from '../OS/Widget';

export default function AnalogClockWidget({ instanceId, initialX = 350, initialY = 64, initialWidth, initialHeight, preview, time }) {
  if (!time) return null;

  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours();

  const secondDegrees = (seconds / 60) * 360 - 90;
  const minuteDegrees = ((minutes / 60) * 360) + ((seconds/60)*6) - 90;
  const hourDegrees = ((hours / 12) * 360) + ((minutes/60)*30) - 90;

  return (
    <Widget instanceId={instanceId} initialX={initialX} initialY={initialY} initialWidth={initialWidth} initialHeight={initialHeight} preview={preview}>
      <div className="bg-base-200/80 backdrop-blur-xl rounded-full border-4 border-base-content w-full h-full min-w-[150px] min-h-[150px] aspect-square drop-shadow-md flex items-center justify-center relative shadow-[4px_4px_0px_rgba(0,0,0,0.2)]">
        
        {/* Tick marks */}
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(deg => (
          <div 
            key={deg} 
            className="absolute w-full h-1 flex justify-end px-2"
            style={{ transform: `rotate(${deg}deg)` }}
          >
            <div className={`h-full bg-base-content ${deg % 90 === 0 ? 'w-4' : 'w-2 opacity-50'}`} />
          </div>
        ))}
        
        {/* Hands Container */}
        <div className="absolute w-full h-full top-0 left-0">
          {/* Hour Hand */}
          <div 
            className="absolute left-1/2 bg-primary rounded-full"
            style={{ 
              top: 'calc(50% - 3px)',
              height: '6px',
              width: '25%',
              transformOrigin: '0% 50%',
              transform: `rotate(${hourDegrees}deg)`,
              zIndex: 10
            }}
          />
          {/* Minute Hand */}
          <div 
            className="absolute left-1/2 bg-base-content rounded-full"
            style={{ 
              top: 'calc(50% - 2px)',
              height: '4px',
              width: '35%',
              transformOrigin: '0% 50%',
              transform: `rotate(${minuteDegrees}deg)`,
              zIndex: 20
            }}
          />
          {/* Second Hand */}
          <div 
            className="absolute left-1/2 bg-error rounded-full"
            style={{ 
              top: 'calc(50% - 1px)',
              height: '2px',
              width: '40%',
              transformOrigin: '0% 50%',
              transform: `rotate(${secondDegrees}deg)`,
              zIndex: 30
            }}
          />
        </div>
        
        {/* Center Dot */}
        <div className="w-4 h-4 rounded-full bg-base-content z-40 border-2 border-base-200" />
      </div>
    </Widget>
  );
}
