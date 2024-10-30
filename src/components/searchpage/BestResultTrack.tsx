import styled from "styled-components";
import Image from "next/image";
import PlayLogo from "../../../public/tracks_logos/play_logo_small.svg";

const OptionsContainer = styled.button`
  height: 16px;
  width: 16px;
  background-color: transparent;
  border: none;
  color: #fff;
  opacity: 0;
  pointer-events: none;
`;
const PlayButtonContainer = styled.div`
  height: 100%;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  color: #fff;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  pointer-events: none;
`;
const TrackArtist = styled.span`
  font-size: 0.875rem;
  font-weight: 400;
  color: #a7a7a7;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
  &:hover {
    color: #fff;
    text-decoration: underline;
  }
`;
const EmptyHeartLogoContainer = styled.div`
  opacity: 0;
  color: #fff;
`;
const Container = styled.div`
  height: 56px;
  width: 100%;
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid transparent;
  border-radius: 4px;
  position: relative;
  color: #b3b3b3;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  &:hover {
    background-color: hsla(0, 0%, 100%, 0.1);
    ${OptionsContainer} {
      opacity: 1;
      pointer-events: auto;
    }
    ${TrackArtist} {
      color: #fff;
    }
    ${PlayButtonContainer} {
      opacity: 1;
      pointer-events: auto;
    }
    ${EmptyHeartLogoContainer} {
      opacity: 0.7;
    }
  }
`;

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  min-width: 0px;
`;

const TrackCover = styled.div`
  height: 100%;
  margin-right: 16px;
  display: flex;
  align-items: center;
  position: relative;
  flex-shrink: 0;
`;

const TracksInformations = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  line-height: 1.6;
  position: relative;
  overflow: hidden;
`;
const TrackTitle = styled.div`
  font-size: 1rem;
  font-weight: 400;
  color: #fff;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
  padding-right: 8px;
`;

interface BestResultsTrackProps {
  key: string;
  title: string;
  artist: string;
  cover_url: string;
  onClick?: () => void;
}

export default function BestResultsTrack({
  key,
  title,
  artist,
  cover_url,
  onClick
}: BestResultsTrackProps) {
  return (
    <Container key={key} onClick={onClick}>
      <TitleContainer>
        <TrackCover>
          <PlayButtonContainer>
            <PlayLogo />
          </PlayButtonContainer>
          <Image
            src={cover_url}
            width={40}
            height={40}
            alt={`Ảnh bìa bài hát ${title}`}
          />
        </TrackCover>
        <TracksInformations>
          <TrackTitle>{title}</TrackTitle>
          <TrackArtist>{artist}</TrackArtist>
        </TracksInformations>
      </TitleContainer>
    </Container>
  );
}
