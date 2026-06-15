'use client';

import { useState, useRef, useEffect } from 'react';
import BaseApp from './BaseApp';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Music as MusicIcon } from 'lucide-react';

const TRACKS = [
  "L.mp3",
  "fast.mp3",
  "funky.mp3",
  "just do it.mp3",
  "kkkkk.mp3",
  "Kiss my lips nigga.mp3"
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  
  const audioRef = useRef(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(e => console.error("Playback prevented", e));
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setProgress(time);
    }
  };

  const handleEnded = () => {
    nextTrack();
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
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
        <audio 
          ref={audioRef} 
          src={`/music/${currentTrack}`} 
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
        />
        
        {/* Album Art Placeholder */}
        <div className="w-48 h-48 sm:w-64 sm:h-64 rounded-(--radius-widget) bg-base-300 border-4 border-base-content/20 flex items-center justify-center shadow-lg relative overflow-hidden group">
          <div className="absolute inset-0 bg-linear-to-tr from-primary/40 to-secondary/40 opacity-50"></div>
          {isPlaying ? (
            <div className="flex gap-2 items-end h-16">
              <div className="w-3 bg-primary rounded-full animate-bounce h-full" style={{ animationDelay: '0ms' }}></div>
              <div className="w-3 bg-primary rounded-full animate-bounce h-2/3" style={{ animationDelay: '200ms' }}></div>
              <div className="w-3 bg-primary rounded-full animate-bounce h-4/5" style={{ animationDelay: '400ms' }}></div>
              <div className="w-3 bg-primary rounded-full animate-bounce h-1/2" style={{ animationDelay: '600ms' }}></div>
            </div>
          ) : (
            <MusicIcon size={64} className="opacity-50 text-base-content" />
          )}
        </div>

        {/* Track Info */}
        <div className="w-full text-center space-y-2 mt-4">
          <h2 className="text-xl sm:text-2xl font-bold truncate px-4">{currentTrack.replace('.mp3', '')}</h2>
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
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
          
          <button 
            onClick={prevTrack}
            className="p-4 rounded-full bg-base-200 hover:bg-base-300 transition-colors shadow-md active:scale-95"
          >
            <SkipBack size={24} className="fill-current" />
          </button>

          <button 
            onClick={togglePlay}
            className="p-6 rounded-full bg-primary text-primary-content hover:brightness-110 transition-all shadow-[4px_4px_0px_rgba(0,0,0,0.5)] active:translate-y-1 active:shadow-[0px_0px_0px_rgba(0,0,0,0.5)]"
          >
            {isPlaying ? <Pause size={32} className="fill-current" /> : <Play size={32} className="fill-current ml-1" />}
          </button>

          <button 
            onClick={nextTrack}
            className="p-4 rounded-full bg-base-200 hover:bg-base-300 transition-colors shadow-md active:scale-95"
          >
            <SkipForward size={24} className="fill-current" />
          </button>
        </div>
      </div>
    </BaseApp>
  );
}
