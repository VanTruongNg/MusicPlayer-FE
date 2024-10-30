import { create } from "zustand"
import { Album } from "./useAlbumStore"
import { Song } from "./useSongStore"
import { axiosInstance } from "@/utils"

export type Artist = {
    id: string
    name: string
    avatarUrl: string
    songs: Song[]
    albums: Album[]
    createAt: Date
    updateAt: Date
}

type ArtistState = {
    artists: Artist[],
    loading: boolean,
    error: string | null
}

type ArtistAction = {
    fetchArtist: () => void
}

export const useArtistStore = create<ArtistState & ArtistAction> ((set) => ({
    artists: [],
    loading: false,
    error: null,

    fetchArtist: async () => {
        set ({ loading: true, error: null })
        try {
            const response = await axiosInstance.get<Artist[]>('/artist', { withCredentials: true })
            set({ artists: response.data, loading: false})
        } catch (error) {
            set({ loading: false, error: error instanceof Error ? error.message : 'Failed to fetch artists' });
        }
    }
}))