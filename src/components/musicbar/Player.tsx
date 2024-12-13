import { usePlaybackStore } from "@/store/usePlaybackStore";
import { useSongStore } from "@/store/useSongStore";
import Image from "next/image";
import ShuffleOutlinedIcon from "@mui/icons-material/ShuffleOutlined";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import LoopIcon from "@mui/icons-material/Loop";
import VolumeDownIcon from "@mui/icons-material/VolumeDown";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import GetAppIcon from "@mui/icons-material/GetApp";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

const PlayerContainer = styled.div`
  height: 5rem;
  color: white;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  font-size: 0.75rem;
  padding: 1rem 1rem 0;
  width: 100%;
  position: relative;

  @media (min-width: 768px) {
    font-size: 1rem;
    padding: 1rem 2rem 0;
  }
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const SongCover = styled(Image)<{ isPlaying: boolean }>`
  display: none;
  width: 3rem;
  border-radius: 9999px;

  @media (min-width: 768px) {
    display: inline;
  }

  animation: ${(props) =>
    props.isPlaying ? "spin 20s linear infinite" : "none"};

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const SongInfo = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  width: 75%;

  @media (min-width: 1024px) {
    font-size: 1.125rem;
  }
`;

const SongTitle = styled.h3`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ArtistName = styled.p`
  font-size: 0.875rem;
  color: #bbb;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const CenterSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10;
  gap: 0.5rem;
`;

const ControlButton = styled.button`
  cursor: pointer;
  transition: transform 0.2s;
  &:hover {
    transform: scale(1.1);
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 1.25rem;
  gap: 0.75rem;
  z-index: 10;

  @media (min-width: 768px) {
    gap: 1rem;
  }
`;

const VolumeSlider = styled.input`
  width: 3.5rem;

  @media (min-width: 768px) {
    width: 7rem;
  }
`;

const SongCoverContainer = styled.div<{ isPlaying: boolean }>`
  display: none;
  width: 3rem;
  height: 3rem;
  border-radius: 9999px;
  overflow: hidden;

  @media (min-width: 768px) {
    display: block;
  }

  animation: ${(props) =>
    props.isPlaying ? "spin 20s linear infinite" : "none"};

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const StyledImage = styled(Image)`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const DEFAULT_VOLUME = 50;
const VOLUME_KEY = "music_player_volume";

const DownloadButton = styled(ControlButton)`
  display: none;
  @media (min-width: 768px) {
    display: block;
  }
`;

const ProgressContainer = styled.div`
  width: 100%;
  max-width: 400px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: #b3b3b3;
  padding: 0 1rem;
`;

interface ProgressBarProps {
  'data-progress': number;
}

const ProgressBar = styled.input<ProgressBarProps>`
  width: 100%;
  height: 4px;
  -webkit-appearance: none;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  cursor: pointer;
  margin: 0;
  position: relative;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: white;
    cursor: pointer;
    opacity: 0;
    transition: opacity 0.2s;
    margin-top: -4px;
  }

  &:hover::-webkit-slider-thumb {
    opacity: 1;
  }

  &::-webkit-slider-runnable-track {
    height: 4px;
    background: linear-gradient(
      to right,
      #1ed760 ${props => props['data-progress']}%,
      rgba(255, 255, 255, 0.1) ${props => props['data-progress']}%
    );
    border-radius: 2px;
  }

  &::-moz-range-thumb {
    width: 12px;
    height: 12px;
    border: none;
    border-radius: 50%;
    background: white;
    cursor: pointer;
    opacity: 0;
    transition: opacity 0.2s;
  }

  &:hover::-moz-range-thumb {
    opacity: 1;
  }

  &::-moz-range-track {
    height: 4px;
    background: linear-gradient(
      to right,
      #1ed760 ${(props) => props["data-progress"]}%,
      rgba(255, 255, 255, 0.1) ${(props) => props["data-progress"]}%
    );
    border-radius: 2px;
  }
`;

const TimeText = styled.span`
  min-width: 40px;
  text-align: center;
`;

const ControlButtons = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  width: 100%;
`;

const Player = () => {
  const {
    currentSong,
    songs,
    setCurrentSongs,
    songHistory,
    addToHistory,
    removeLastFromHistory,
  } = useSongStore();
  const { isPlaying, setPlaying, toggleLoop, isLoop } = usePlaybackStore();
  const [volume, setVolume] = useState(() => {
    if (typeof window !== "undefined") {
      const savedVolume = localStorage.getItem(VOLUME_KEY);
      return savedVolume ? Number(savedVolume) : DEFAULT_VOLUME;
    }
    return DEFAULT_VOLUME;
  });
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (currentSong?.fileUrl) {
      if (audioRef.current) {
        audioRef.current.src = currentSong.fileUrl;
        if (isPlaying) {
          audioRef.current.play();
        }
      }
    }
  }, [currentSong]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  const handlePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setPlaying(!isPlaying);
  };

  useEffect(() => {
    localStorage.setItem(VOLUME_KEY, volume.toString());
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(e.target.value);
    setVolume(newVolume);
  };

  const handleEnded = () => {
    if (isLoop) {
      if (audioRef.current) {
        audioRef.current.play();
      }
    } else {
      handleNextSong();
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.loop = isLoop;
    }
  }, [isLoop]);

  const getRandomSong = () => {
    if (!songs || songs.length === 0) return null;
    const currentIndex = songs.findIndex((song) => song.id === currentSong?.id);
    let randomIndex;

    do {
      randomIndex = Math.floor(Math.random() * songs.length);
    } while (randomIndex === currentIndex && songs.length > 1);

    return songs[randomIndex];
  };

  const handleNextSong = () => {
    if (!songs || songs.length === 0) return;

    const nextSong = getRandomSong();
    if (nextSong) {
      if (currentSong) {
        addToHistory(currentSong);
      }
      setCurrentSongs(nextSong);
      setPlaying(true);
    }
  };

  const handlePrevSong = () => {
    if (!currentSong) return;

    if (
      !songHistory.length ||
      (audioRef.current && audioRef.current.currentTime > 3)
    ) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        if (!isPlaying) {
          setPlaying(true);
          audioRef.current.play();
        }
      }
      return;
    }

    const prevSong = songHistory[songHistory.length - 1];
    removeLastFromHistory();
    setCurrentSongs(prevSong);
    setPlaying(true);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.addEventListener("timeupdate", handleTimeUpdate);
      return () => audio.removeEventListener("timeupdate", handleTimeUpdate);
    }
  }, []);

  return (
    <PlayerContainer>
      <audio
        ref={audioRef}
        onEnded={handleEnded}
        onLoadedMetadata={handleTimeUpdate}
        onError={() => {
          console.error("Lỗi phát nhạc");
          setPlaying(false);
        }}
      />
      <LeftSection>
        {currentSong ? (
          <>
            <SongCoverContainer isPlaying={isPlaying}>
              <StyledImage
                src={currentSong.coverImgUrl || "/default-cover.jpg"}
                alt="Song cover"
                width={48}
                height={48}
              />
            </SongCoverContainer>
            <SongInfo>
              <SongTitle title={currentSong.title}>
                {currentSong.title}
              </SongTitle>
              <ArtistName>
                {currentSong.artists?.length > 1
                  ? `${currentSong.artists[0].name} (ft. ${currentSong.artists[1].name})`
                  : currentSong.artists?.[0]?.name}
              </ArtistName>
            </SongInfo>
          </>
        ) : (
          <>
            <SongCover
              isPlaying={false}
              src="/default_image.png"
              alt="Default cover"
              width={48}
              height={48}
            />
            <SongInfo>
              <SongTitle>Chưa chọn bài hát</SongTitle>
              <ArtistName>Chọn một bài hát để phát</ArtistName>
            </SongInfo>
          </>
        )}
      </LeftSection>

      <CenterSection>
        <ControlButtons>
          <ControlButton>
            <ShuffleOutlinedIcon />
          </ControlButton>

          <ControlButton onClick={handlePrevSong}>
            <SkipPreviousIcon style={{ width: "2rem", height: "2rem" }} />
          </ControlButton>

          <ControlButton onClick={handlePlayPause}>
            {isPlaying ? (
              <PauseCircleIcon style={{ width: "2.5rem", height: "2.5rem" }} />
            ) : (
              <PlayCircleIcon style={{ width: "2.5rem", height: "2.5rem" }} />
            )}
          </ControlButton>

          <ControlButton onClick={handleNextSong}>
            <SkipNextIcon style={{ width: "2rem", height: "2rem" }} />
          </ControlButton>

          <ControlButton>
            <LoopIcon
              onClick={() => toggleLoop()}
              style={{ color: isLoop ? "#1ed760" : "inherit" }}
            />
          </ControlButton>
        </ControlButtons>

        <ProgressContainer>
          <TimeText>{formatTime(currentTime)}</TimeText>
          <ProgressBar
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={handleProgressChange}
            data-progress={(currentTime / duration) * 100 || 0}
          />
          <TimeText>{formatTime(duration)}</TimeText>
        </ProgressContainer>
      </CenterSection>

      <RightSection>
        {currentSong?.fileUrl && (
          <DownloadButton as="a" href={currentSong.fileUrl} download>
            <GetAppIcon />
          </DownloadButton>
        )}
        <ControlButton>
          {volume === 0 && <VolumeOffIcon />}
          {volume > 0 && volume < 50 && <VolumeDownIcon />}
          {volume >= 50 && <VolumeUpIcon />}
        </ControlButton>
        <VolumeSlider
          type="range"
          value={volume}
          onChange={handleVolumeChange}
          min={0}
          max={100}
        />
      </RightSection>
    </PlayerContainer>
  );
};

export default Player;
