import { create } from 'zustand';

export const TRACKS = [
  "L.mp3",
  "fast.mp3",
  "funky.mp3",
  "just do it.mp3",
  "kkkkk.mp3",
  "Kiss my lips nigga.mp3"
];

export const useMusicStore = create((set, get) => ({
  currentTrackIndex: 0,
  isPlaying: false,
  progress: 0,
  duration: 0,
  isMuted: false,
  seekRequest: null, // used to signal the audio element to seek to a specific time
  
  togglePlay: () => set(state => ({ isPlaying: !state.isPlaying })),
  play: () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),
  
  nextTrack: () => set(state => ({ 
    currentTrackIndex: (state.currentTrackIndex + 1) % TRACKS.length,
    isPlaying: true 
  })),
  
  prevTrack: () => set(state => ({ 
    currentTrackIndex: (state.currentTrackIndex - 1 + TRACKS.length) % TRACKS.length,
    isPlaying: true 
  })),
  
  setProgress: (progress) => set({ progress }),
  setDuration: (duration) => set({ duration }),
  setSeekRequest: (time) => set({ seekRequest: time }),
  clearSeekRequest: () => set({ seekRequest: null }),
  
  toggleMute: () => set(state => ({ isMuted: !state.isMuted })),
}));
