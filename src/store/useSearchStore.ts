import { create } from "zustand";
import { Album } from "./useAlbumStore";
import { Artist } from "./useArtistStore";
import { Song } from "./useSongStore";
import { axiosInstance } from "@/utils";

interface FormattedSearchResults {
    bestResult: {
        id: string;
        title: string;
        category: string;
        image: string | null;
        fileUrl: string | null;
        artist: string[] | null;
    } | null;
    tracks: Song[];
    artists: Artist[];
    albums: Album[];
}

interface SearchResults {
    songs: Song[];
    artists: Artist[];
    albums: Album[];
}

type SearchState = {
    searchResults: FormattedSearchResults | null;
    isLoading: boolean;
    error: string | null;
}

type SearchAction = {
    fetchSearchResults: (searchQuery: string) => Promise<void>;
}

export const useSearchStore = create<SearchState & SearchAction>((set) => ({
    searchResults: null,
    isLoading: false,
    error: null,
    fetchSearchResults: async (query: string) => {
      if (!query) {
        set({ searchResults: null });
        return;
      }
  
      set({ isLoading: true, error: null });
      
      try {
        const response = await axiosInstance.get<SearchResults>(`/search?keyword=${query}`);
        
        const formattedResults: FormattedSearchResults = {
          bestResult: response.data.songs[0] ? {
            id: response.data.songs[0].id,
            title: response.data.songs[0].title,
            category: 'Song',
            image: response.data.songs[0].coverImgUrl || null,
            fileUrl: response.data.songs[0].fileUrl,
            artist: response.data.songs[0].artists.map((artist) => artist.name) || null
          } : null,
          tracks: response.data.songs,
          artists: response.data.artists,
          albums: response.data.albums,
        };
  
        console.log('Formatted results:', formattedResults);
        set({ searchResults: formattedResults, isLoading: false });
      } catch (error) {
        set({ 
          error: 'Có lỗi xảy ra khi tìm kiếm',
          isLoading: false 
        });
      }
    },
}));
