import { create } from "zustand"
import { Album } from "./useAlbumStore"
import { Artist } from "./useArtistStore"
import { Genre } from "./useGenreStore"
import { axiosInstance } from "@/utils"
import { AxiosError } from "axios"

export type Song = {
    id: string
    title: string
    coverImgUrl: string
    fileUrl: string
    genres: Genre[]
    artists: Artist[]
    album: Album | null
    createAt: Date
    updateAt: Date
}

type SongState = {
    songs: Song[]
    currentSong: Song | null
    songHistory: Song[];
    loading: boolean
    error: string | null
}

type SongAction = {
    fetchSong: () => void,
    setSongs: (songs: Song[]) => void
    setCurrentSongs: (song: Song) => void
    addToHistory: (song: Song) => void;
    removeLastFromHistory: () => void
    updateSongGenres: (songId: string, newGenres: Genre[]) => void
    createSong: (formData: FormData) => Promise<void>;
    updateSongFile: (songId: string, mp3File: File) => Promise<void>;
    deleteSong: (id: string) => Promise<void>;
}

export const useSongStore = create<SongState & SongAction> ((set) => ({
    songs: [],
    currentSong: null,
    loading: false,
    error: null,
    songHistory: [],

    fetchSong: async () => {
        set({loading: true, error: null})
        try {
            const response = await axiosInstance.get<Song[]>('/song')
            set({ songs: response.data, loading: false})
        } catch (error) {
            set({ loading: false, error: error instanceof Error ? error.message : 'Failed to fetch album' });
        }
    },
    setSongs: (songs: Song[]) => set ({ songs: songs }),
    setCurrentSongs: (song: Song) => set ({ currentSong: song }),
    addToHistory: (song) => set((state) => ({
        songHistory: [...state.songHistory, song].slice(-10)
    })),
    removeLastFromHistory: () => set((state) => ({
        songHistory: state.songHistory.slice(0, -1)
    })),
    updateSongGenres: async (songId, newGenres) => {
        const genreIds = newGenres.map(genre => genre.id);
        try {
            await axiosInstance.patch(`/song/${songId}/update-genres`, { genreIds: genreIds }, { withCredentials: true });
        } catch (error: unknown) {
            if (error instanceof AxiosError && error.response && error.response.status === 401) {
                try {
                    await axiosInstance.get('/auth/refresh-token', { withCredentials: true });
                    await axiosInstance.patch(`/song/${songId}/update-genres`, { genreIds: genreIds }, { withCredentials: true });
                } catch (refreshError) {
                    console.error('Failed to refresh token:', refreshError);
                }
            } else {
                console.error('Failed to update genres:', error);
            }
        }
    },
    createSong: async (formData: FormData) => {
        try {
          const response = await axiosInstance.post('/song/create-song', formData, { 
            withCredentials: true,
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          
          set((state) => ({
            songs: [...state.songs, response.data]
          }));
        } catch (error: unknown) {
          if (error instanceof AxiosError && error.response && error.response.status === 401) {
            try {
              await axiosInstance.get('/auth/refresh-token', { withCredentials: true });
              const response = await axiosInstance.post('/song/create-song', formData, { 
                withCredentials: true,
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
              });
              set((state) => ({
                songs: [...state.songs, response.data]
              }));
            } catch (refreshError) {
              console.error('Failed to refresh token:', refreshError);
              throw refreshError;
            }
          } else {
            console.error('Failed to create song:', error);
            throw error;
          }
        }
      },
      updateSongFile: async (songId: string, mp3File: File) => {
        try {
            const formData = new FormData();
            formData.append('mp3File', mp3File);

            await axiosInstance.put(`/song/${songId}/file`, formData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
        } catch (error: unknown) {
            if (error instanceof AxiosError && error.response?.status === 401) {
                await axiosInstance.get('/auth/refresh-token', { withCredentials: true });
                await axiosInstance.put(`/song/${songId}/file`, formData, {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
            }
            throw error;
        }
    },
    deleteSong: async (id: string) => {
        try {
          await axiosInstance.delete(`/song/${id}`, { withCredentials: true });
          // Cập nhật state sau khi xóa thành công
          set((state) => ({
            songs: state.songs.filter((song) => song.id !== id)
          }));
        } catch (error: unknown) {
          if (error instanceof AxiosError && error.response?.status === 401) {
            try {
              await axiosInstance.get('/auth/refresh-token', { withCredentials: true });
              await axiosInstance.delete(`/song/${id}`, { withCredentials: true });
              set((state) => ({
                songs: state.songs.filter((song) => song.id !== id)
              }));
            } catch (refreshError) {
              console.error('Failed to refresh token:', refreshError);
              throw refreshError;
            }
          }
          throw error;
        }
      },
}))