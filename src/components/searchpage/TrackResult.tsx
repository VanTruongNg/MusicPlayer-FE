import styled from "styled-components";
import Track from "./BestResultTrack";
import { Song } from "@/store/useSongStore";

const Container = styled.div`
  grid-column: 3 / -1;
`;

const TopTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff;
  padding-bottom: 16px;
  font-family: "CircularSpTitle", "Roboto", sans-serif;
  line-height: 1.6;
`;

const TracksContainer = styled.div`
  width: 100%;
  position: relative;
`;

interface TrackResultsProps {
  tracks: Song[] | null;
  onTrackClick?: (song: Song) => void;
}

export default function TrackResults({
  tracks,
  onTrackClick,
}: TrackResultsProps) {
  if (!tracks) {
    return null;
  }

  return (
    <Container>
      <TopTitle>Bài hát</TopTitle>
      <TracksContainer>
        {tracks.slice(0, 4).map((track) => (
          <Track
            key={track.id}
            title={track.title}
            artist={track.artists.map((artist) => artist.name).join(", ")}
            cover_url={track.coverImgUrl}
            onClick={() => onTrackClick?.(track)}
          />
        ))}
      </TracksContainer>
    </Container>
  );
}
