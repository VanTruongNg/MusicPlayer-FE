import { create } from "zustand";

type PlaybackState = {
    isPlaying: boolean;
    isLoop: boolean;
    isShuffle: boolean;
};

type PlaybackAction = {
    togglePlay: () => void;
    toggleLoop: () => void;
    toggleShuffle: () => void;
    setPlaying: (isPlaying: boolean) => void;
};

export const usePlaybackStore = create<PlaybackState & PlaybackAction>((set) => ({
    isPlaying: false,
    isLoop: false,
    isShuffle: false,

    togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
    toggleLoop: () => set((state) => ({ isLoop: !state.isLoop })),
    toggleShuffle: () => set((state) => ({ isShuffle: !state.isShuffle })),
    setPlaying: (isPlaying: boolean) => set({ isPlaying }),
}));
