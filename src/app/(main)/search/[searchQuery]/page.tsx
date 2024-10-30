"use client";

import BestResult from "@/components/searchpage/BestResult";
import NoResults from "@/components/searchpage/NoResult";
import SearchResultLayout from "@/components/searchpage/SearchResultLayout";
import SearchResultSection from "@/components/searchpage/SearchResultSection";
import TrackResults from "@/components/searchpage/TrackResult";
import MusicCard from "@/components/shared/MusicCard";
import useResizeObserver from "@/hooks/useResizeObserver";
import { usePlaybackStore } from "@/store/usePlaybackStore";
import { Song, useSearchStore } from "@/store/useSearchStore";
import { useSongStore } from "@/store/useSongStore";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  grid-template-rows: auto;
  column-gap: 24px;
  row-gap: 32px;
  max-width: 1955px;
  margin-top: -15px;
  padding-right: 8px;
`;

const SearchResult = () => {
  const params = useParams();
  const searchQuery = params.searchQuery as string;

  const WIDTH_LIMIT = 200;
  const containerRef = useRef(null);
  const dimensions = useResizeObserver(containerRef);
  const [cardsNumberPerRow, setCardsNumberPerRow] = useState(4);

  const { searchResults, isLoading, fetchSearchResults } = useSearchStore();
  const { setCurrentSongs } = useSongStore();
  const { setPlaying } = usePlaybackStore();

  useEffect(() => {
    if (searchQuery) {
      fetchSearchResults(searchQuery);
    }
  }, [searchQuery, fetchSearchResults]);

  useEffect(() => {
    const { width } = dimensions || { width: 900 };
    const cardsNumber = Math.floor(width / WIDTH_LIMIT);
    if (cardsNumber >= 3 && cardsNumber <= 9) {
      setCardsNumberPerRow(cardsNumber);
    }
  }, [dimensions]);

  if (isLoading || !searchResults) return null;

  if (
    !searchResults.tracks?.length &&
    !searchResults.artists?.length &&
    !searchResults.albums?.length
  ) {
    return <NoResults searchValue={searchQuery} />;
  }

  const handleTrackClick = (track: Song) => {
    setCurrentSongs(track);
    setPlaying(true);
  };

  return (
    <SearchResultLayout>
      <Container ref={containerRef}>
        {/* Best Result */}
        {searchResults.bestResult && (
          <BestResult
            title={searchResults.bestResult.title}
            category={searchResults.bestResult.category}
            cover_url={searchResults.bestResult.image}
          />
        )}

        {/* Tracks Section */}
        {searchResults.tracks && searchResults.tracks.length > 0 && (
          <TrackResults tracks={searchResults.tracks} onTrackClick={handleTrackClick}/>
        )}

        {/* Artists Section */}
        {searchResults.artists && searchResults.artists.length > 0 && (
          <SearchResultSection
            title="Nghệ sĩ"
            data={searchResults.artists}
            cardsNumberPerRow={cardsNumberPerRow}
          >
            {searchResults.artists.slice(0, cardsNumberPerRow).map((artist) => (
              <MusicCard
                key={artist.id}
                title={artist.name}
                description="Artist"
                coverImgUrl={artist.avatarUrl}
                isRoundImage
              />
            ))}
          </SearchResultSection>
        )}

        {/* Albums Section */}
        {searchResults.albums && searchResults.albums.length > 0 && (
          <SearchResultSection
            title="Album"
            data={searchResults.albums}
            cardsNumberPerRow={cardsNumberPerRow}
          >
            {searchResults?.albums &&
              searchResults.albums
                .slice(0, cardsNumberPerRow)
                .map((album) => (
                  <MusicCard
                    title={album.title}
                    description={album.artist.name}
                    coverImgUrl={album.coverImgUrl}
                    key={album.id}
                  />
                ))}
          </SearchResultSection>
        )}
      </Container>
    </SearchResultLayout>
  );
};

export default SearchResult;
