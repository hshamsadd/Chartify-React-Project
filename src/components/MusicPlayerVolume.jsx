import React, { useState, useEffect, useRef } from "react";
import { useSong } from "../context/SongContext.jsx";

const MusicPlayerVolume = () => {
  const { audio, currentVolume, setCurrentVolume } = useSong();
  const [isHover, setIsHover] = useState(false);
  const volumeRef = useRef(null);

  useEffect(() => {
    const volumeElement = volumeRef.current;
    if (volumeElement) {
      const handleInput = (e) => {
        if (audio) {
          audio.volume = e.target.value / 100;
        }
      };

      volumeElement.addEventListener("input", handleInput);

      return () => {
        volumeElement.removeEventListener("input", handleInput);
      };
    }
  }, [audio]);

  useEffect(() => {
    if (audio) {
      setTimeout(() => {
        audio.volume = currentVolume / 100;
      }, 200);
    }
  }, [audio, currentVolume]);

  return (
    <div
      className="flex items-center ml-2 w-[150px] relative mt-2 mb-[23px]"
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <input
        value={currentVolume}
        onChange={(e) => setCurrentVolume(e.target.value)}
        ref={volumeRef}
        type="range"
        className={`
          mt-[24px]
          absolute
          rounded-full
          my-2
          w-full
          h-0
          z-40
          appearance-none
          bg-opacity-100
          focus:outline-none
          accent-white
          cursor-pointer
          ${isHover ? "rangeDot" : "rangeDotHidden"}
        `}
      />
      <div
        className="pointer-events-none mt-[6px] absolute h-[4px] z-10 inset-y-0 left-0 w-0 bg-white"
        style={{ width: `${currentVolume}%` }}
      />
      <div className="absolute h-[4px] z-[-0] mt-[6px] inset-y-0 left-0 w-full bg-gray-500 rounded-full" />
    </div>
  );
};

export default MusicPlayerVolume;
