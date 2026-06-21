'use client';

import { useMusicStore } from '@/lib/stores/musicStore';
import BaseApp from './BaseApp';
import { Play, Square, ArrowRight, ArrowLeft, Volume3, Volume, Music } from 'pixelarticons/react';

export default function MusicPlayer() {
  const { 
    currentTrackIndex, 
    isPlaying, 
    progress, 
    duration, 
    isMuted, 
    toggleMute,
    togglePlay, 
    nextTrack, 
    prevTrack, 
    seekRequest, 
    clearSeekRequest, 
    setSeekRequest, 
    tracks 
  } = useMusicStore();

  const currentTrack = tracks.length > 0 ? tracks[currentTrackIndex] : null;

  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    setSeekRequest(time);
  };

  const formatTime = (time) => {
    if (!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <BaseApp>
      <div className="flex flex-col h-full bg-base-100 p-6 overflow-hidden items-center justify-between">
        {/* Album Art Placeholder */}
        <div className="w-48 h-48 sm:w-64 sm:h-64 rounded-[var(--radius-widget)] bg-base-300 border-4 border-base-content/20 flex items-center justify-center shadow-lg relative overflow-hidden group">
          <div className="absolute inset-0 bg-[linear-gradient(to_top_right,var(--color-primary)_0%,var(--color-secondary)_100%)] opacity-50 mix-blend-overlay"></div>
          {isPlaying ? (
            <div className="flex gap-2 items-end h-16 z-10">
              <div className="w-3 bg-primary-content rounded-full animate-bounce h-full" style={{ animationDelay: '0ms' }}></div>
              <div className="w-3 bg-primary-content rounded-full animate-bounce h-2/3" style={{ animationDelay: '200ms' }}></div>
              <div className="w-3 bg-primary-content rounded-full animate-bounce h-4/5" style={{ animationDelay: '400ms' }}></div>
              <div className="w-3 bg-primary-content rounded-full animate-bounce h-1/2" style={{ animationDelay: '600ms' }}></div>
            </div>
          ) : (
            <Music size={64} className="opacity-50 text-base-content z-10" />
          )}
        </div>

        {/* Track Info */}
        <div className="w-full text-center space-y-2 mt-4">
          <span className="font-bold uppercase tracking-widest text-primary truncate max-w-[200px]" title={currentTrack ? currentTrack.replace('.mp3', '') : 'No tracks'}>
            {currentTrack ? currentTrack.replace('.mp3', '') : 'No tracks loaded'}
          </span>
          <p className="text-base-content/70 font-bold uppercase text-xs tracking-widest">Relic OS Audio</p>
        </div>

        {/* Scrubber */}
        <div className="w-full max-w-sm flex flex-col gap-2 mt-4">
          <input 
            type="range" 
            min={0} 
            max={duration || 100} 
            value={progress} 
            onChange={handleSeek}
            className="w-full accent-primary h-2 bg-base-300 rounded-full appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs font-bold opacity-70">
            <span>{formatTime(progress)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-6 mt-4 w-full max-w-sm">
          <button 
            onClick={toggleMute}
            className="p-3 rounded-full hover:bg-base-200 transition-colors opacity-70 hover:opacity-100"
          >
            {isMuted ? <Volume size={20} /> : <Volume3 size={20} />}
          </button>
          
          <button 
            onClick={prevTrack}
            className="p-4 rounded-full bg-base-200 hover:bg-base-300 transition-colors shadow-md active:scale-95"
          >
            <ArrowLeft size={24} className="fill-current" />
          </button>

          <button 
            onClick={togglePlay}
            className="p-6 rounded-full bg-primary text-primary-content hover:brightness-110 transition-all shadow-[4px_4px_0px_rgba(0,0,0,0.5)] active:translate-y-1 active:shadow-[0px_0px_0px_rgba(0,0,0,0.5)]"
          >
            {isPlaying ? <Square size={32} className="fill-current" /> : <Play size={32} className="fill-current ml-1" />}
          </button>

          <button 
            onClick={nextTrack}
            className="p-4 rounded-full bg-base-200 hover:bg-base-300 transition-colors shadow-md active:scale-95"
          >
            <ArrowRight size={24} className="fill-current" />
          </button>
        </div>
      </div>
    </BaseApp>
  )
}
