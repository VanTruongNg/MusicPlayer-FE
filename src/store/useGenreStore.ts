import { axiosInstance } from "@/utils/axiosInstance"
import { create } from "zustand"
import { Song } from "./useSongStore"

export type Genre = {
    id: string
    name: string
    songs: Song[]
    createAt: Date
    updateAt: Date
}

type GenreState = {
    genres: Genre[],
    loading: boolean,
    error: string | null
}

type GenreAction = {
    fetchGenres: () => void
}

export const useGenreStore = create<GenreState & GenreAction>((set) => ({
    genres: [],
    loading: false,
    error: null,

    fetchGenres: async () => {
        set({ loading: true, error: null });
        try {
            const response = await axiosInstance.get<Genre[]>('/genre', { withCredentials: true });
            set({ genres: response.data, loading: false });
        } catch (error) {
            set({ loading: false, error: error instanceof Error ? error.message : 'Failed to fetch genres' });
        }
    }
}));