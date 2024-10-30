import { create } from "zustand"
import { Artist } from "./useArtistStore"
import { Song } from "./useSongStore"
import { axiosInstance } from "@/utils"
import { AxiosError } from "axios"

export type Album = {
    id: string
    title: string
    coverImgUrl: string
    releaseDate: Date
    artist: Artist
    songs: Song[]
    createAt: Date
    updateAt: Date
}

type AlbumState = {
    albums: Album[]
    loading: boolean
    error: string | null
}

type AlbumAction = {
    fetchAlbum: () => void
    addSongToAlbum: (albumId: string, songId: string) => void
    createAlbum: (formData: FormData) => Promise<Album>
}

export const useAlbumStore = create<AlbumState & AlbumAction> ((set) => ({
    albums: [],
    loading: false,
    error: null,

    fetchAlbum: async () => {
        set ({ loading: true, error: null })
        try {
            const response = await axiosInstance.get<Album[]>('/album')
            set ({ albums: response.data, loading: false })
        } catch (error) {
            set({ loading: false, error: error instanceof Error ? error.message : 'Failed to fetch album' });
        }
    },
    addSongToAlbum: async (albumId: string, songId: string) => {
        try {
          const response = await axiosInstance.post('/album/add-song', 
            {
              albumId,
              songId
            }, 
            {
              withCredentials: true
            }
          );
          
          set((state) => ({
            albums: state.albums.map((album) =>
              album.id === albumId ? response.data : album
            ),
          }));
      
          return response.data;
        } catch (error) {
          if (error instanceof AxiosError && error.response?.status === 401) {
            // Refresh token
            await axiosInstance.get("/auth/refresh-token", { 
              withCredentials: true 
            });
            // Thử lại request với cookie mới
            return await addSongToAlbum(albumId, songId);
          }
          throw error;
        }
      },
      createAlbum: async (formData: FormData) => {
        try {
          const response = await axiosInstance.post<Album>('/album', formData, {
            withCredentials: true,
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
    
          set((state) => ({
            albums: [...state.albums, response.data],
          }));
    
          return response.data;
        } catch (error) {
          if (error instanceof AxiosError && error.response?.status === 401) {
            // Refresh token
            await axiosInstance.get("/auth/refresh-token", { 
              withCredentials: true 
            });
            return await createAlbum(formData);
          }
          throw error;
        }
      }
}))

