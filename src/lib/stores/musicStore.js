import { create } from 'zustand';

// Tracks are fetched dynamically from /api/assets

export const useMusicStore = create((set, get) => ({
  tracks: [],
  currentTrackIndex: 0,
  isPlaying: false,
  progress: 0,
  duration: 0,
  isMuted: false,
  seekRequest: null, // used to signal the audio element to seek to a specific time
  
  setTracks: (tracks) => set({ tracks }),

  togglePlay: () => set(state => ({ isPlaying: !state.isPlaying })),
  play: () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),
  
  nextTrack: () => set(state => ({ 
    currentTrackIndex: state.tracks.length > 0 ? (state.currentTrackIndex + 1) % state.tracks.length : 0,
    isPlaying: true 
  })),
  
  prevTrack: () => set(state => ({ 
    currentTrackIndex: state.tracks.length > 0 ? (state.currentTrackIndex - 1 + state.tracks.length) % state.tracks.length : 0,
    isPlaying: true 
  })),
  
  setProgress: (progress) => set({ progress }),
  setDuration: (duration) => set({ duration }),
  setSeekRequest: (time) => set({ seekRequest: time }),
  clearSeekRequest: () => set({ seekRequest: null }),
  
  toggleMute: () => set(state => ({ isMuted: !state.isMuted })),
}));
