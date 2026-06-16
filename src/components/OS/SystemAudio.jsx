'use client';

import { useRef, useEffect } from 'react';
import { useMusicStore, TRACKS } from '@/lib/stores/musicStore';

export default function SystemAudio() {
  const audioRef = useRef(null);
  
  const { 
    currentTrackIndex, 
    isPlaying, 
    isMuted, 
    seekRequest, 
    setProgress, 
    setDuration, 
    nextTrack, 
    clearSeekRequest 
  } = useMusicStore();

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
  }, [isMuted]);

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
