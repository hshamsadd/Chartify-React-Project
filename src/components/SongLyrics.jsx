import React, { useEffect, useRef } from "react";
import { MdClose } from "react-icons/md";
import LyricRow from "./LyricRow.jsx";
import lyrics from "../lyrics.json";
import artist from "../artist.json";
import { useSong } from "../context/SongContext.jsx";

const SongLyrics = ({ className = "" }) => {
  const { currentTrack, currentArtist, trackTime, isLyrics, setIsLyrics } =
    useSong();
  const lyricsDivRef = useRef(null);

  useEffect(() => {
    if (
      currentTrack &&
      lyrics[currentTrack.id] &&
      trackTime < lyrics[currentTrack.id][0].time
    ) {
      if (lyricsDivRef.current) {
        lyricsDivRef.current.scrollTop = 0;
      }
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (
        currentTrack &&
        lyrics[currentTrack.id] &&
        trackTime < lyrics[currentTrack.id][0].time
      ) {
        if (lyricsDivRef.current) {
          lyricsDivRef.current.scrollTop = 0;
        }
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [trackTime, currentTrack]);

  useEffect(() => {
    if (currentTrack) {
      const hasLyrics = artist.tracks?.[currentTrack.id - 1]?.lyrics;
      // Close the lyrics panel if this track doesn't have lyrics
      if (isLyrics && hasLyrics === false) {
        setIsLyrics(false);
      }
    }
  }, [currentTrack, isLyrics, setIsLyrics]);

  const snapToPosition = (res) => {
    if (res && res.time < trackTime) {
      const position = document.getElementById(res.time);
      if (position) {
        position.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "center",
        });
      }
    }
  };

  if (!currentTrack || !currentArtist) {
    return null;
  }

  return (
    <div
      className={`fixed w-full h-[calc(100%-80px)] flex items-center mx-auto bg-gradient-to-r from-blue-400 to-transparent bg-purple-600 min-w-[1000px] ${className}`}
    >
      <button
        onClick={() => setIsLyrics(false)}
        type="button"
        className="absolute top-0 m-8 p-2 bg-black bg-opacity-20 hover:bg-opacity-40 rounded-full"
      >
        <MdClose size={30} className="text-white" />
      </button>

      <div className="w-1/2 max-w-[400px] mx-auto relative flex items-center">
        <div className="absolute z-20 font-bold rounded-xl text-white text-[20px] py-1.5 px-3 m-1">
          {currentArtist.name}
        </div>
        <div className="absolute right-0 z-20 font-bold rounded-xl text-white text-[20px] py-1.5 px-3 m-1">
          {currentTrack.name}
        </div>
        <div className="relative">
          <img
            className="rounded-3xl shadow-2xl"
            src={currentArtist.albumCover}
            alt={`${currentArtist.name} album cover`}
          />
          <div className="absolute z-10 blur-2xl rounded-3xl top-0 w-full h-full bg-black bg-opacity-10" />
        </div>
      </div>

      <div
        id="LyricsDiv"
        ref={lyricsDivRef}
        className="w-1/2 max-w-[600px] mx-auto relative h-[calc(100%-1px)] overflow-auto scrollbar-hide"
      >
        <div className="my-[90%]"></div>

        {currentTrack &&
          lyrics[currentTrack.id] &&
          lyrics[currentTrack.id].map(
            (res, index) =>
              res && (
                <div
                  key={index}
                  className="text-center text-[40px] font-semibold opacity-100"
                  ref={(el) => {
                    if (el) snapToPosition(res);
                  }}
                >
                  <LyricRow time={res.time} words={res.words} />
                </div>
              )
          )}

        <div className="my-[90%]"></div>
      </div>
    </div>
  );
};

export default SongLyrics;
