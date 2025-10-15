import React, { useState, useEffect, useRef, useCallback } from "react";
import {
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
import FavouriteButton from "./FavouriteButton.jsx";

// Image resolver (only normalizes image/cover objects into a URL; no style changes)
const getImageUrl = (...candidates) => {
  const sizeOrder = ["medium", "large", "xl", "small"];

  const extract = (c) => {
    if (!c) return undefined;
    if (typeof c === "string") return c;

    // Common direct keys that may already be URL strings
    for (const k of ["cover", "picture", "image", "albumCover", "url", "src"]) {
      if (typeof c[k] === "string") return c[k];
    }

    // Deezer-style size maps: { small, medium, large, xl }
    for (const k of sizeOrder) {
      if (typeof c[k] === "string") return c[k];
    }

    // Deezer album keys may be string or nested objects
    for (const k of ["cover_small", "cover_medium", "cover_big", "cover_xl"]) {
      const v = c[k];
      if (!v) continue;
      const nested = extract(v);
      if (nested) return nested;
    }

    // Sometimes nested under album/artist
    for (const k of ["album", "artist"]) {
      const v = c[k];
      if (!v) continue;
      const nested = extract(v);
      if (nested) return nested;
    }

    // Fallback: first string value found
    for (const v of Object.values(c)) {
      if (typeof v === "string") return v;
    }

    return undefined;
  };

  for (const cand of candidates) {
    const url = extract(cand);
    if (url) return url;
  }
  return undefined;
};

const MusicPlayer = () => {
  const {
    isPlaying,
    audio,
    currentTrack,
    currentArtist,
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

  // Only resolve image URLs (no style/layout changes)
  const favImage =
    getImageUrl(
      currentTrack?.albumCover,
      currentTrack?.cover,
      currentTrack?.album?.cover_medium,
      currentTrack?.album?.cover_big,
      currentTrack?.album?.cover_small,
      currentTrack?.album?.cover_xl,
      currentArtist?.albumCover,
      currentArtist?.album?.cover_medium,
      currentArtist?.album?.cover_big,
      currentArtist?.album?.cover_small,
      currentArtist?.album?.cover_xl,
      currentArtist?.picture
    ) || "/images/default-album.png";

  const queueImage =
    getImageUrl(
      currentArtist?.albumCover,
      currentArtist?.album?.cover_medium,
      currentArtist?.album?.cover_big,
      currentArtist?.album?.cover_small,
      currentArtist?.album?.cover_xl,
      currentTrack?.album?.cover_medium,
      currentTrack?.album?.cover_big,
      currentTrack?.album?.cover_small,
      currentTrack?.album?.cover_xl
    ) || "/images/default-album.png";

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
        bg-[#ffffff]
        border-t
        border-t-[#0ea5e9]
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
                currentTrack?.id === 1
                  ? "text-[#0ea5e9] hover:text-[#0ea5e9] hover:bg-[#ffffff]"
                  : "text-white hover:text-[#0ea5e9] hover:bg-[#ffffff]"
              }
              size={25}
            />
          </button>
          <button
            type="button"
            className="p-2 rounded-full hover:bg-[#0ea5e9]"
            onClick={() => playOrPauseThisSong(currentArtist, currentTrack)}
          >
            {!isPlaying ? (
              <MdPlayArrow
                className="text-[#0ea5e9] hover:text-[#ffffff]"
                size={45}
              />
            ) : (
              <MdPause
                className="text-[#0ea5e9] hover:text-[#ffffff]"
                size={45}
              />
            )}
          </button>
          <button
            type="button"
            className="mx-2 p-2 rounded-full hover:bg-[#0ea5e9] "
            onClick={handleNextSong}
          >
            <MdSkipNext
              className="text-[#0ea5e9] hover:text-[#ffffff]"
              size={25}
            />
          </button>
        </div>
      </div>

      <div className="mb-2.5 w-full max-w-[50%] mx-10">
        <div className="flex items-center justify-between pl-1 relative top-1 mx-7">
          <div className="flex items-center">
            <div className="bg-[#0ea5e9] py-0.5 px-1 text-[10px] text-[#ffffff]">
              ALBUM
            </div>
            <div className="text-[#0ea5e9] text-[14px] font-[300] ml-3">
              {currentTrack?.name}
            </div>
            <div className="text-[#0ea5e9] relative -top-1 left-[6px]">.</div>
            <div className="text-[#0ea5e9] text-[14px] font-[300] ml-3">
              {currentArtist?.name}
            </div>
          </div>
          <div className="flex items-center">
            <FavouriteButton
              type="track"
              id={currentTrack?.id}
              title={currentTrack?.name || currentTrack?.title}
              subtitle={currentArtist?.name}
              image={favImage}
              size={20}
              className="text-[#0ea5e9] p-2 m-0 bg-transparent border-0"
              activeClassName="text-[#0ea5e9] [&>svg]:fill-none [&>svg]:stroke-[#0ea5e9] [&>svg]:stroke-[1.5] hover:text-[#0ea5e9]"
              inactiveClassName="text-[#0ea5e9]"
            />
          </div>
        </div>

        <div className="flex items-center">
          {isTrackTimeCurrent && (
            <div className="text-[#0ea5e9] text-[10px] pr-2 relative -bottom-[5px]">
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
                ${isHover ? "rangeDot" : ""}
              `}
              readOnly
            />
            <div
              className="pointer-events-none rounded-full absolute z-10 inset-y-0 left-0 w-0"
              style={{
                width: `${range}%`,
                backgroundColor: "#0ea5e9",
                height: isHover ? "4px" : "2px",
                marginTop: isHover ? "5px" : "6px",
              }}
            />
            <div
              className={`absolute z-[-0] inset-y-0 left-0 w-full bg-[#0ea5e9] rounded-full ${
                isHover ? "h-[4px] mt-[5px]" : "h-[2px] mt-[6px]"
              }`}
            />
          </div>
          {isTrackTimeTotal && (
            <div className="text-[#0ea5e9] text-[10px] pl-2 relative -bottom-[5px]">
              {isTrackTimeTotal}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center w-1/4 justify-end pr-6">
        <div className="flex items-center">
          <div
            onMouseEnter={() => setIsVolumeHover(true)}
            onMouseLeave={() => setIsVolumeHover(false)}
            className="relative"
          >
            <div className="p-2 ml-2 hover:bg-[#0ea5e9] hover:bg-opacity-50 rounded-full cursor-pointer">
              {currentVolume > 0 ? (
                <MdVolumeUp className="text-[#0ea5e9]" size={17} />
              ) : (
                <MdVolumeOff className="text-[#0ea5e9]" size={17} />
              )}
            </div>
            {isVolumeHover && (
              <div className="absolute -top-12 -left-20 p-2 px-4 bg-[#ffffff]  rounded-xl shadow-xl bg-opacity-60 backdrop-blur-lg">
                <MusicPlayerVolume />
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center ml-6 border-l border-l-[#0ea5e9]">
          <img
            className="rounded-sm ml-6 border border-[#0ea5e9]"
            width="28"
            src={queueImage}
            alt="Album cover"
          />
          <div className="text-xs ml-1.5 text-[#0ea5e9] font-light">Queue</div>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
