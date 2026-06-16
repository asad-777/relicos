'use client';

import { useRef, useEffect } from 'react';

import { useMusicStore, TRACKS } from '@/lib/stores/musicStore';
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
    clearSeekRequest 
  } = useMusicStore();

  const { volume, isMuted } = useSystemStore();

  const currentTrack = TRACKS[currentTrackIndex];

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
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleEnded = () => {
    nextTrack();
  };

  return (
    <audio 
      ref={audioRef} 
      src={`/music/${currentTrack}`} 
      onTimeUpdate={handleTimeUpdate}
      onEnded={handleEnded}
    />
  );
}
