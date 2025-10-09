import React, { useEffect } from "react";
import { MdMusicNote } from "react-icons/md"; // Using MdMusicNote as replacement for GuitarElectric
import lyrics from "../lyrics.json";
import { useSong } from "../context/SongContext.jsx";

const LyricRow = ({ time, words }) => {
  const { trackTime, currentTrack, lyricsPosition, setLyricsPosition } =
    useSong();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentTrack && lyrics[currentTrack.id]) {
        lyrics[currentTrack.id].forEach((res) => {
          if (res.time === trackTime && res.time !== lyricsPosition) {
            setLyricsPosition(res.time);
          }
        });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [trackTime, currentTrack, lyricsPosition, setLyricsPosition]);

  return (
    <div
      id={time}
      className={`my-10 text-white opacity-100 ${
        lyricsPosition !== time ? "opacity-30" : ""
      }`}
    >
      {words === "INSTRAMENTAL SECTION" ? (
        <div className="flex w-full">
          <MdMusicNote size={200} className="mx-auto" />
        </div>
      ) : (
        <div>{words}</div>
      )}
    </div>
  );
};

export default LyricRow;
