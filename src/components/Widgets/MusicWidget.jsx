'use client';

import Widget from '../OS/Widget';
import { useMusicStore } from '@/lib/stores/musicStore';
import { Play, Square, ArrowLeft, ArrowRight, Music } from 'pixelarticons/react';

export default function MusicWidget({ instanceId, initialX = 64, initialY = 500, initialWidth, initialHeight, preview }) {
  const { 
    currentTrackIndex, 
    isPlaying, 
    progress, 
    duration, 
    togglePlay, 
    nextTrack, 
    prevTrack,
    tracks 
  } = useMusicStore();

  const currentTrack = tracks[currentTrackIndex];
  const progressPercent = duration > 0 ? (progress / duration) * 100 : 0;
  
  return (
    <Widget instanceId={instanceId} initialX={initialX} initialY={initialY} initialWidth={initialWidth} initialHeight={initialHeight} preview={preview}>
      <div className="bg-base-200/80 backdrop-blur-xl p-5 rounded-[var(--radius-widget)] border-2 border-base-content/10 w-full min-w-[280px] h-full min-h-[160px] flex flex-col justify-between text-base-content drop-shadow-md">
        <div className="flex items-center gap-4 mb-5">
          <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center text-primary border-2 border-primary/30">
            <Music size={28} />
          </div>
          <div className="flex-1 overflow-hidden">
            <h3 className="font-bold text-sm truncate uppercase tracking-widest text-primary mb-1">
              {tracks.length > 0 ? tracks[currentTrackIndex].replace('.mp3', '') : 'No tracks loaded'}
            </h3>
            <p className="text-xs font-bold opacity-60 truncate uppercase">System Audio</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2.5 bg-base-300 rounded-full overflow-hidden mb-5 border border-base-content/5">
          <div className="h-full bg-primary transition-all duration-1000 linear" style={{ width: `${progressPercent}%` }} />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-8 px-2">
          <button onClick={prevTrack} className="opacity-70 hover:opacity-100 hover:scale-110 hover:text-primary transition-all pointer-events-auto">
            <ArrowLeft size={24} fill="currentColor" />
          </button>
          
          <button onClick={togglePlay} className="w-12 h-12 rounded-full bg-primary text-primary-content flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-[0_0_15px_rgba(var(--color-primary),0.5)] pointer-events-auto">
            {isPlaying ? <Square size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
          </button>
          
          <button onClick={nextTrack} className="opacity-70 hover:opacity-100 hover:scale-110 hover:text-primary transition-all pointer-events-auto">
            <ArrowRight size={24} fill="currentColor" />
          </button>
        </div>
      </div>
    </Widget>
  );
}
