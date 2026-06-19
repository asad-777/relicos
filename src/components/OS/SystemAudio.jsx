'use client';

import { useRef, useEffect } from 'react';

import { useMusicStore } from '@/lib/stores/musicStore';
import { useSystemStore } from '@/lib/stores/systemStore';

export default function SystemAudio() {
  const audioRef = useRef(null);
  
  const { 
    currentTrackIndex, 
    isPlaying, 
    seekRequest, 
    setProgress, 
    setDuration, 
    nextTrack, 
    clearSeekRequest,
    tracks 
  } = useMusicStore();

  const { volume, isMuted } = useSystemStore();

  const currentTrack = tracks.length > 0 ? tracks[currentTrackIndex] : null;

  useEffect(() => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.play().catch(e => console.error("Playback prevented", e));
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.muted = isMuted;
    audioRef.current.volume = volume / 100;
  }, [isMuted, volume]);

  useEffect(() => {
    if (seekRequest !== null && audioRef.current) {
      audioRef.current.currentTime = seekRequest;
      setProgress(seekRequest);
      clearSeekRequest();
    }
  }, [seekRequest, setProgress, clearSeekRequest]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0);
    }
  };

  return (
    <>
      {currentTrack && (
        <audio 
          ref={audioRef} 
          src={`/music/${currentTrack}`} 
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={nextTrack}
        />
      )}
    </>
  );
}
