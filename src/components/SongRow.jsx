import React, { useState, useEffect } from "react";
import { MdPlayArrow, MdPause } from "react-icons/md";
import { useSong } from "../context/SongContext.jsx";
import FavouriteButton from "./FavouriteButton.jsx";

const SongRow = ({ track, artistData }) => {
  const {
    isPlaying,
    currentTrack,
    playOrPauseThisSong,
    loadSong,
    playOrPauseSong,
  } = useSong();

  const [isHover, setIsHover] = useState(false);
  const [isHoverGif, setIsHoverGif] = useState(false);
  const [isTrackTime, setIsTrackTime] = useState("00:00");

  useEffect(() => {
    if (track && track.path) {
      const audioMeta = new Audio(track.path);
      audioMeta.addEventListener("loadedmetadata", () => {
        const duration = audioMeta.duration;
        const minutes = Math.floor(duration / 60);
        const seconds = Math.floor(duration % 60);
        setIsTrackTime(minutes + ":" + seconds.toString().padStart(2, "0"));
      });
    }
  }, [track]);

  const coverForFav =
    artistData.albumCover?.medium ||
    artistData.albumCover?.large ||
    artistData.cover ||
    artistData.albumCover ||
    track?.album?.cover_medium?.medium ||
    track?.album?.cover_big?.large ||
    track?.album?.cover_small?.small ||
    track?.album?.cover_xl?.xl ||
    "/images/default-album.jpg";

  const fav = {
    id:
      track?.id ??
      `${track?.name || "unknown"}-${
        artistData?.artistName || artistData?.name || "unknown"
      }`,
    type: "track",
    title: track?.name || track?.title || "Unknown",
    subtitle: artistData?.artistName || artistData?.name || "Unknown Artist",
    image: coverForFav,
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
                  <img src="/images/audio.gif" alt="Audio wave" />
                ) : (
                  <MdPause size={25} onClick={playOrPauseSong} />
                )}
              </div>
            )}

          <img
            width="45"
            className="border border-[#ffffff]"
            src={
              artistData.albumCover?.medium ||
              artistData.albumCover?.large ||
              artistData.cover ||
              artistData.albumCover ||
              track.album?.cover_medium?.medium ||
              track.album?.cover_big?.large ||
              track.album?.cover_small?.small ||
              track.album?.cover_xl?.xl ||
              "/images/default-album.jpg"
            }
            alt={track.name || "Album cover"}
          />
        </div>

        {track && (
          <div
            className={`text-md pl-4 hover:underline cursor-pointer ${
              track && currentTrack && currentTrack.name === track.name
                ? "text-[#ffffff]"
                : "text-[#ffffff]"
            }`}
          >
            {track.name}
          </div>
        )}
      </div>

      <div className="flex items-center">
        <FavouriteButton
          fav={fav}
          size={21}
          className="rounded-full p-1.5 bg-[#FFFFFF] border-2 border-[#0ea5e9]"
          activeClassName="text-[#0ea5e9]"
          inactiveClassName="[&>svg]:fill-none [&>svg]:stroke-[#0ea5e9] [&>svg]:stroke-[1.5] hover:text-[#0ea5e9]"
        />

        {isTrackTime && (
          <div
            className={`text-[13px] pl-10 font-[200] ${
              track && currentTrack && currentTrack.name === track.name
                ? "text-[#ffffff]"
                : "text-[#ffffff]"
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
