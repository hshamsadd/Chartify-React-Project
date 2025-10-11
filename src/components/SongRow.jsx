import React, { useState, useEffect } from "react";
import {
  MdMoreHoriz,
  MdFavoriteBorder,
  MdMic,
  MdPlayArrow,
  MdPause,
} from "react-icons/md";
import { useSong } from "../context/SongContext.jsx";

const SongRow = ({ track, artistData }) => {
  const {
    audio,
    isPlaying,
    currentTrack,
    isLyrics,
    playOrPauseThisSong,
    loadSong,
    playOrPauseSong,
    setIsLyrics,
  } = useSong();

  const [isHover, setIsHover] = useState(false);
  const [isHoverGif, setIsHoverGif] = useState(false);
  const [isTrackTime, setIsTrackTime] = useState("00:00");

  useEffect(() => {
    console.log("SongRow received track:", track); // Add this
    if (track && track.path) {
      console.log("Track has path:", track.path); // And this
      const audioMeta = new Audio(track.path);
      audioMeta.addEventListener("loadedmetadata", () => {
        const duration = audioMeta.duration;
        const minutes = Math.floor(duration / 60);
        const seconds = Math.floor(duration % 60);
        setIsTrackTime(minutes + ":" + seconds.toString().padStart(2, "0"));
      });
    } else {
      console.log("Track missing path!"); // Add this too
    }
  }, [track]);

  const openLyrics = (track, artistData) => {
    if (audio && !audio.paused && track.id === currentTrack?.id) {
      setIsLyrics(true);
    } else if (audio && audio.paused && track.id === currentTrack?.id) {
      playOrPauseSong();
      setIsLyrics(true);
    } else {
      playOrPauseThisSong(artistData, track);
      setTimeout(() => setIsLyrics(true), 500);
    }
  };

  return (
    <li
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      className="flex items-center justify-between p-2 hover:bg-[#979797] hover:bg-opacity-5"
    >
      <div className="flex items-center">
        <div className="relative">
          {isHover && (
            <div className="p-1 mt-[2px] ml-[3px] absolute rounded-full bg-white cursor-pointer">
              {!isPlaying ? (
                <MdPlayArrow
                  size={25}
                  onClick={() => playOrPauseThisSong(artistData, track)}
                />
              ) : isPlaying && currentTrack?.name !== track.name ? (
                <MdPlayArrow
                  size={25}
                  onClick={() => loadSong(artistData, track)}
                />
              ) : null}
            </div>
          )}

          {track && currentTrack && currentTrack.name === track.name && (
            <div className="p-1 mt-[2px] ml-[3px] absolute rounded-full bg-white cursor-pointer">
              {!isHover && isPlaying && (
                <MdPause size={25} onClick={playOrPauseSong} />
              )}
            </div>
          )}

          {isPlaying &&
            track &&
            currentTrack &&
            currentTrack.name === track.name && (
              <div
                onMouseEnter={() => setIsHoverGif(true)}
                onMouseLeave={() => setIsHoverGif(false)}
                className="p-1 mt-[2px] ml-[3px] absolute rounded-full bg-white cursor-pointer"
              >
                {!isHoverGif ? (
                  <img src="/images/audio-wave.gif" alt="Audio wave" />
                ) : (
                  <MdPause size={25} onClick={playOrPauseSong} />
                )}
              </div>
            )}

          <img
            width="37"
            className="border border-[#494949]"
            src={artistData.albumCover}
            alt="Album cover"
          />
        </div>

        {track && (
          <div
            className={`text-sm pl-4 hover:underline cursor-pointer ${
              track && currentTrack && currentTrack.name === track.name
                ? "text-[#EF5464]"
                : "text-[#d4d4d4]"
            }`}
          >
            {track.name}
          </div>
        )}
      </div>

      <div className="flex items-center">
        {track.lyrics && (
          <div
            onClick={() => openLyrics(track, artistData)}
            className="rotate-45 rounded-full p-1.5 mr-3 hover:bg-[#979797] hover:bg-opacity-20 cursor-pointer"
          >
            <MdMic className="text-[#CCCCCC]" size={21} />
          </div>
        )}

        <div className="rounded-full p-1.5 mr-3 hover:bg-[#979797] hover:bg-opacity-20 cursor-pointer">
          <MdFavoriteBorder className="text-[#CCCCCC]" size={21} />
        </div>

        <div className="rounded-full p-1.5 hover:bg-[#979797] hover:bg-opacity-20 cursor-pointer">
          <MdMoreHoriz className="text-[#CCCCCC]" size={21} />
        </div>

        {isTrackTime && (
          <div
            className={`text-[13px] pl-10 font-[200] ${
              track && currentTrack && currentTrack.name === track.name
                ? "text-[#EF5464]"
                : "text-[#d4d4d4]"
            }`}
          >
            {isTrackTime}
          </div>
        )}
      </div>
    </li>
  );
};

export default SongRow;
