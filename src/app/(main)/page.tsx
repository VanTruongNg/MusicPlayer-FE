"use client";

import { Song, useSongStore } from "@/store/useSongStore";
import HomeLayout from "@/components/homepage/HomeLayout";
import HomeSection from "@/components/homepage/HomeSection";
import MusicCard from "@/components/shared/MusicCard";
import useResizeObserver from "@/hooks/useResizeObserver";
import { useAlbumStore } from "@/store/useAlbumStore";
import { useArtistStore } from "@/store/useArtistStore";
import { useEffect, useRef, useState } from "react";
import { usePlaybackStore } from "@/store/usePlaybackStore";
import { useAuthStore } from "@/store/useAuthStore";

const Home = () => {
  const WIDTH_LIMIT = 200;
  const containerRef = useRef(null);
  const dimensions = useResizeObserver(containerRef);
  const [cardsNumberPerRow, setCardsNumberPerRow] = useState(4);
  const { artists, fetchArtist } = useArtistStore();
  const { albums, fetchAlbum } = useAlbumStore();
  const { songs, fetchSong, setCurrentSongs } = useSongStore();
  const { setPlaying } = usePlaybackStore();

  useEffect(() => {
    const { width } = dimensions || { width: 900 };
    const cardsNumber = Math.max(
      2,
      Math.min(Math.floor(width / WIDTH_LIMIT), 9)
    );
    setCardsNumberPerRow(cardsNumber);
  }, [dimensions]);

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([fetchArtist(), fetchAlbum(), fetchSong()]);
    };

    fetchData();
  }, [fetchArtist, fetchAlbum, fetchSong]);

  const handleOnClick = (song: Song) => {
    setCurrentSongs(song);
    setPlaying(true);
  };

  return (
    <HomeLayout>
      <div ref={containerRef}>
        {artists.length > 0 && (
          <HomeSection
            title="Top Artists"
            cardsNumberPerRow={cardsNumberPerRow}
          >
            {artists.slice(0, cardsNumberPerRow).map((artist) => (
              <MusicCard
                title={artist.name}
                coverImgUrl={artist.avatarUrl}
                description="Artist"
                key={artist.id}
                isRoundImage
              />
            ))}
          </HomeSection>
        )}
        {albums && (
          <HomeSection
            title="Trending Albums"
            cardsNumberPerRow={cardsNumberPerRow}
          >
            {albums.slice(0, cardsNumberPerRow).map((album) => (
              <MusicCard
                title={album.title}
                coverImgUrl={album.coverImgUrl}
                description={album.artist.name}
                key={album.id}
              />
            ))}
          </HomeSection>
        )}
        {songs && (
          <HomeSection title="Top Hit" cardsNumberPerRow={cardsNumberPerRow}>
            {songs.slice(0, cardsNumberPerRow).map((song) => (
              <MusicCard
                title={song.title}
                coverImgUrl={song.coverImgUrl}
                description={song.artists
                  .map((artist) => artist.name)
                  .join(", ")}
                key={song.id}
                onClick={() => {
                  handleOnClick(song);
                }}
              />
            ))}
          </HomeSection>
        )}
      </div>
    </HomeLayout>
  );
};

export default Home;
