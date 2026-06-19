import { Volume3, Volume, Lightbulb, Moon, Wifi, Battery, BatteryFull, Bell, Globe, Close } from 'pixelarticons/react';
import { useSystemStore } from '@/lib/stores/systemStore';

export default function ControlCenter() {
  const { 
    brightness, setBrightness, 
    volume, setVolume, 
    isMuted, toggleMute, 
    notifications, clearNotifications, dismissNotification
  } = useSystemStore();

  return (
    <div 
      className="absolute right-0 top-14 w-80 bg-base-200/90 backdrop-blur-2xl border-2 border-base-content/20 shadow-[8px_8px_0px_var(--color-base-content)] rounded-[32px] p-6 flex flex-col gap-6 text-base-content z-[100] animate-in slide-in-from-top-4 fade-in duration-300 origin-top-right"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Sliders */}
      <div className="flex flex-col gap-4">
        {/* Brightness */}
        <div className="flex items-center gap-3 bg-base-300/50 p-3 rounded-2xl border border-base-content/10 relative overflow-hidden group">
          <div className="w-8 flex items-center justify-center text-base-content/70">
            {brightness > 50 ? <Lightbulb size={20} /> : <Moon size={20} />}
          </div>
          <input 
            type="range" 
            min="0" max="100" 
            value={brightness} 
            onChange={(e) => setBrightness(Number(e.target.value))}
            className="flex-1 h-3 bg-base-100 rounded-full appearance-none outline-none overflow-hidden [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-0 [&::-webkit-slider-thumb]:shadow-[-100vw_0_0_100vw_var(--color-primary)] cursor-pointer"
          />
        </div>

        {/* Volume */}
        <div className="flex items-center gap-3 bg-base-300/50 p-3 rounded-2xl border border-base-content/10 relative overflow-hidden group">
          <button 
            onClick={toggleMute}
            className="w-8 flex items-center justify-center text-base-content/70 hover:text-primary transition-colors cursor-pointer"
          >
            {isMuted || volume === 0 ? <Volume size={20} /> : <Volume3 size={20} />}
          </button>
          <input 
            type="range" 
            min="0" max="100" 
            value={isMuted ? 0 : volume} 
            onChange={(e) => {
              if (isMuted && e.target.value > 0) toggleMute();
              setVolume(Number(e.target.value));
            }}
            className="flex-1 h-3 bg-base-100 rounded-full appearance-none outline-none overflow-hidden [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-0 [&::-webkit-slider-thumb]:shadow-[-100vw_0_0_100vw_var(--color-primary)] cursor-pointer"
          />
        </div>
      </div>

      {/* Notifications */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center px-1">
          <span className="text-xs font-black uppercase tracking-wider opacity-60 flex items-center gap-1">
            <Bell size={12} /> Notifications
          </span>
          {notifications.length > 0 && (
            <button 
              onClick={clearNotifications}
              className="text-xs font-bold uppercase hover:text-primary opacity-60 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
        
        <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1" data-lenis-prevent="true">
          {notifications.length === 0 ? (
            <div className="text-center py-4 opacity-40 text-sm font-bold uppercase">
              No new notifications
            </div>
          ) : (
            notifications.map(note => (
              <div key={note.id} className="bg-base-300/80 p-3 rounded-xl border border-base-content/5 relative group">
                <button 
                  onClick={() => dismissNotification(note.id)}
                  className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 bg-base-100 rounded-full hover:text-error"
                >
                  <Close size={10} />
                </button>
                <div className="flex justify-between items-start mb-1 pr-6">
                  <span className={`text-xs font-black uppercase ${note.type === 'success' ? 'text-success' : note.type === 'error' ? 'text-error' : 'text-primary'}`}>
                    {note.title}
                  </span>
                  <span className="text-xs opacity-50 font-bold whitespace-nowrap">{note.time}</span>
                </div>
                <p className="text-sm opacity-80 leading-tight">{note.message}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
