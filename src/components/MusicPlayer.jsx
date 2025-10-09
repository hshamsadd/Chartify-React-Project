import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  MdShuffle,
  MdFavoriteBorder,
  MdMic,
  MdAdd,
  MdTune,
  MdPictureInPictureAlt,
  MdPlayArrow,
  MdPause,
  MdSkipPrevious,
  MdSkipNext,
  MdVolumeUp,
  MdVolumeOff,
} from "react-icons/md";

import MusicPlayerVolume from "./MusicPlayerVolume.jsx";
import uniqolor from "uniqolor";
import { useSong } from "../context/SongContext.jsx";

const MusicPlayer = () => {
  const {
    isPlaying,
    audio,
    currentTrack,
    currentArtist,
    trackTime,
    isLyrics,
    currentVolume,
    playOrPauseThisSong,
    prevSong,
    nextSong,
    setTrackTime,
  } = useSong();

  // Create a stable callback for nextSong to avoid infinite loops
  const handleNextSong = useCallback(() => {
    if (currentTrack) {
      nextSong(currentTrack);
    }
  }, [currentTrack]);

  const [randColor, setRandColor] = useState("");
  const [isHover, setIsHover] = useState(false);
  const [isVolumeHover, setIsVolumeHover] = useState(false);
  const [isTrackTimeCurrent, setIsTrackTimeCurrent] = useState("0:00");
  const [isTrackTimeTotal, setIsTrackTimeTotal] = useState("0:00");
  const [range, setRange] = useState(0);

  const seekerRef = useRef(null);
  const seekerContainerRef = useRef(null);

  useEffect(() => {
    setRandColor(uniqolor.random().color);
  }, []);

  useEffect(() => {
    if (audio) {
      const timeUpdateHandler = () => {
        const dur = Number(audio.duration);
        const cur = Number(audio.currentTime);
        if (!isFinite(dur) || dur <= 0 || !isFinite(cur) || cur < 0) {
          return; // avoid NaN and invalid states
        }
        const minutes = Math.floor(cur / 60);
        const seconds = Math.floor(cur - minutes * 60);
        const currentTime = minutes + ":" + seconds.toString().padStart(2, "0");
        // only update when changed to avoid render storms
        setIsTrackTimeCurrent((prev) =>
          prev === currentTime ? prev : currentTime
        );
        setTrackTime(currentTime);
        const value = (100 / dur) * cur;
        setRange((prev) => (prev === value ? prev : value));
        if (seekerRef.current) {
          seekerRef.current.value = value;
        }
      };

      const loadMetadataHandler = () => {
        const duration = Number(audio.duration);
        if (!isFinite(duration) || duration <= 0) return;
        const minutes = Math.floor(duration / 60);
        const seconds = Math.floor(duration % 60);
        const total = minutes + ":" + seconds.toString().padStart(2, "0");
        setIsTrackTimeTotal((prev) => (prev === total ? prev : total));
      };

      audio.addEventListener("timeupdate", timeUpdateHandler);
      audio.addEventListener("loadedmetadata", loadMetadataHandler);

      return () => {
        audio.removeEventListener("timeupdate", timeUpdateHandler);
        audio.removeEventListener("loadedmetadata", loadMetadataHandler);
      };
    }
  }, [audio, setTrackTime]);

  useEffect(() => {
    if (
      currentTrack &&
      audio &&
      seekerRef.current &&
      seekerContainerRef.current
    ) {
      const seeker = seekerRef.current;
      const seekerContainer = seekerContainerRef.current;

      const handleChange = () => {
        const dur = Number(audio.duration);
        if (!isFinite(dur) || dur <= 0) return;
        const value = Number(seeker.value);
        const time = dur * (value / 100);
        audio.currentTime = time;
      };

      const handleMouseDown = () => {
        audio.pause();
      };

      const handleMouseUp = () => {
        audio.play();
      };

      const handleClick = (e) => {
        const dur = Number(audio.duration);
        if (!isFinite(dur) || dur <= 0) return;
        const rect = seekerContainer.getBoundingClientRect();
        const clickPosition = (e.clientX - rect.left) / rect.width;
        const time = dur * Math.min(Math.max(clickPosition, 0), 1);
        audio.currentTime = time;
        const value = (100 / dur) * audio.currentTime;
        seeker.value = value;
        setRange(value);
      };

      seeker.addEventListener("change", handleChange);
      seeker.addEventListener("mousedown", handleMouseDown);
      seeker.addEventListener("mouseup", handleMouseUp);
      seekerContainer.addEventListener("click", handleClick);

      return () => {
        seeker.removeEventListener("change", handleChange);
        seeker.removeEventListener("mousedown", handleMouseDown);
        seeker.removeEventListener("mouseup", handleMouseUp);
        seekerContainer.removeEventListener("click", handleClick);
      };
    }
  }, [currentTrack, audio]);

  const hasTriggeredNext = useRef(false);

  useEffect(() => {
    if (
      typeof isTrackTimeCurrent === "string" &&
      typeof isTrackTimeTotal === "string" &&
      isTrackTimeCurrent.length > 0 &&
      isTrackTimeTotal.length > 0 &&
      isTrackTimeTotal !== "0:00" &&
      isTrackTimeCurrent === isTrackTimeTotal &&
      !hasTriggeredNext.current
    ) {
      hasTriggeredNext.current = true;
      handleNextSong();
    }
  }, [isTrackTimeCurrent, isTrackTimeTotal, handleNextSong]);

  // Reset the trigger when track changes
  useEffect(() => {
    hasTriggeredNext.current = false;
  }, [currentTrack?.id]);

  useEffect(() => {
    if (currentTrack) {
      setRandColor(uniqolor.random().color);
    }
  }, [currentTrack?.id]);

  if (!audio) {
    return null;
  }

  return (
    <div
      id="MusicPlayer"
      className="
        fixed
        flex
        min-w-[1000px]
        items-center
        justify-between
        bottom-0
        w-full
        z-50
        h-[80px]
        bg-[#23232D]
        border-t
        border-t-[#383838]
      "
    >
      <div className="flex items-center w-2/12">
        <div className="flex items-center justify-center h-[30px] pl-4">
          <button
            type="button"
            disabled={currentTrack?.id === 1}
            className={`mx-2 p-2 ${
              currentTrack?.id !== 1 ? "rounded-full hover:bg-[#363636]" : ""
            }`}
            onClick={() => prevSong(currentTrack)}
          >
            <MdSkipPrevious
              className={
                currentTrack?.id === 1 ? "text-[#747474]" : "text-white"
              }
              size={25}
            />
          </button>
          <button
            type="button"
            className="p-2 rounded-full hover:bg-[#363636]"
            onClick={() => playOrPauseThisSong(currentArtist, currentTrack)}
          >
            {!isPlaying ? (
              <MdPlayArrow className="text-white" size={45} />
            ) : (
              <MdPause className="text-white" size={45} />
            )}
          </button>
          <button
            type="button"
            className="mx-2 p-2 rounded-full hover:bg-[#363636]"
            onClick={handleNextSong}
          >
            <MdSkipNext className="text-white" size={25} />
          </button>
        </div>
      </div>

      <div className="mb-2.5 w-full max-w-[50%] mx-10">
        <div className="flex items-center justify-between pl-1 relative top-1 mx-7">
          <div className="flex items-center">
            <div className="bg-[#2E2E39] py-0.5 px-1 text-[10px] text-[#72727D]">
              ALBUM
            </div>
            <div className="text-white text-[14px] font-[300] ml-3">
              {currentTrack?.name}
            </div>
            <div className="text-white relative -top-1 left-[6px]">.</div>
            <div className="text-white text-[14px] font-[300] ml-3">
              {currentArtist?.name}
            </div>
          </div>
          <div className="flex items-center">
            <div className="p-1.5 ml-2 hover:bg-[#5a5a5a] hover:bg-opacity-50 rounded-full cursor-pointer">
              <MdAdd className="text-white" size={20} />
            </div>
            <div className="p-1.5 ml-2 hover:bg-[#5a5a5a] hover:bg-opacity-50 rounded-full cursor-pointer">
              <MdFavoriteBorder className="text-white" size={20} />
            </div>
            <div className="p-1.5 ml-2 hover:bg-[#5a5a5a] hover:bg-opacity-50 rounded-full cursor-pointer">
              <MdTune className="text-white" size={20} />
            </div>
          </div>
        </div>

        <div className="flex items-center">
          {isTrackTimeCurrent && (
            <div className="text-[#8a8a8a] text-[10px] pr-2 relative -bottom-[5px]">
              {isTrackTimeCurrent}
            </div>
          )}
          <div
            ref={seekerContainerRef}
            className="w-full relative mt-2 mb-3"
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
          >
            <input
              value={Number.isFinite(range) ? range : 0}
              ref={seekerRef}
              type="range"
              className={`
                absolute
                rounded-full
                my-[7px]
                w-full
                h-0
                z-40
                appearance-none
                bg-opacity-100
                focus:outline-none
                cursor-pointer
                ${isHover ? "rangeDot" : "rangeDotHidden"}
              `}
              readOnly
            />
            <div
              className="pointer-events-none rounded-full absolute z-10 inset-y-0 left-0 w-0"
              style={{
                width: `${range}%`,
                backgroundColor: randColor,
                height: isHover ? "4px" : "2px",
                marginTop: isHover ? "5px" : "6px",
              }}
            />
            <div
              className={`absolute z-[-0] inset-y-0 left-0 w-full bg-[#c4c4c4] rounded-full ${
                isHover ? "h-[4px] mt-[5px]" : "h-[2px] mt-[6px]"
              }`}
            />
          </div>
          {isTrackTimeTotal && (
            <div className="text-[#8a8a8a] text-[10px] pl-2 relative -bottom-[5px]">
              {isTrackTimeTotal}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center w-1/4 justify-end pr-6">
        <div className="flex items-center">
          <div className="p-2 ml-2 hover:bg-[#5a5a5a] hover:bg-opacity-50 rounded-full cursor-pointer">
            <MdPictureInPictureAlt className="text-white" size={17} />
          </div>
          <div className="p-2 ml-2 hover:bg-[#5a5a5a] hover:bg-opacity-50 rounded-full cursor-pointer">
            <MdShuffle className="text-white" size={17} />
          </div>
          <div
            onMouseEnter={() => setIsVolumeHover(true)}
            onMouseLeave={() => setIsVolumeHover(false)}
            className="relative"
          >
            <div className="p-2 ml-2 hover:bg-[#5a5a5a] hover:bg-opacity-50 rounded-full cursor-pointer">
              {currentVolume > 0 ? (
                <MdVolumeUp className="text-white" size={17} />
              ) : (
                <MdVolumeOff className="text-white" size={17} />
              )}
            </div>
            {isVolumeHover && (
              <div className="absolute -top-12 -left-20 p-2 px-4 bg-[#2a2a37] rounded-xl shadow-xl">
                <MusicPlayerVolume />
              </div>
            )}
          </div>
          <div className="p-2 ml-2 hover:bg-[#5a5a5a] hover:bg-opacity-50 rounded-full cursor-pointer">
            <MdTune className="text-white" size={17} />
          </div>
        </div>
        <div className="flex items-center ml-6 border-l border-l-[#363636]">
          <img
            className="rounded-sm ml-6"
            width="28"
            src={currentArtist?.albumCover}
            alt="Album cover"
          />
          <div className="text-xs ml-1.5 text-white font-light">Queue</div>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
