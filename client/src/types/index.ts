// Voice types
export interface IVoiceClone {
  id: string;
  name: string;
  language: string;
  duration: number;
  size: number;
  created_at: string;
  updated_at: string;
}

export interface AudioContent {
  id: string;
  title: string;
  language: string;
  duration: number;
  created_at: string;
  audio_url?: string;
}

export interface ContentFilters {
  search: string;
  sortBy: 'recent' | 'duration' | 'alphabetical';
}

export interface AudioPlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isLoading: boolean;
  isRepeat: boolean;
  isShuffle: boolean;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  onboardingCompleted?: boolean;
  created_at?: string;
  updated_at?: string;
}