import React, { useState, useEffect } from "react";
import { MdMoreHoriz, MdPlayArrow, MdPause } from "react-icons/md";
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

  // Build favourite payload (uses same image fallbacks as the row)
  const coverForFav =
    artistData.albumCover?.medium ||
    artistData.albumCover?.large ||
    artistData.cover ||
    artistData.albumCover ||
    track?.album?.cover_medium?.medium ||
    track?.album?.cover_big?.large ||
    track?.album?.cover_small?.small ||
    track?.album?.cover_xl?.xl ||
    "/images/default-album.png";

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
                  <img src="/images/audio-wave.gif" alt="Audio wave" />
                ) : (
                  <MdPause size={25} onClick={playOrPauseSong} />
                )}
              </div>
            )}

          <img
            width="37"
            className="border border-[#494949]"
            src={
              // Track-specific album covers
              artistData.albumCover?.medium ||
              artistData.albumCover?.large ||
              artistData.cover ||
              // Fallback to track's album cover if available
              artistData.albumCover ||
              track.album?.cover_medium?.medium ||
              track.album?.cover_big?.large ||
              track.album?.cover_small?.small ||
              track.album?.cover_xl?.xl ||
              // Fallback: a default image if nothing is found
              "/images/default-album.png"
            }
            alt={track.name || "Album cover"}
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
        {/* Favourite button kept intact */}
        <div className="rounded-full p-1.5 mr-3 hover:bg-[#979797] hover:bg-opacity-20 cursor-pointer">
          <FavouriteButton
            fav={fav}
            size={21}
            className="p-0 m-0 bg-transparent border-0"
            activeClassName="text-[#CCCCCC]"
            inactiveClassName="text-[#CCCCCC]"
          />
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
