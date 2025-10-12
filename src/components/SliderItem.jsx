import React, { useState } from "react";
import { MdPlayArrow, MdFavoriteBorder, MdMoreHoriz } from "react-icons/md";
import { useSong } from "../context/SongContext.jsx";

const SliderItem = ({ slide }) => {
  const [isHover, setIsHover] = useState(false);
  const { playOrPauseThisSong } = useSong();

  const handlePlayClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (slide.tracks && slide.tracks.length > 0) {
      playOrPauseThisSong(slide, slide.tracks[0]);
      return;
    }

    const isTrack = !!(slide.path || slide.preview || slide.title);
    if (isTrack) {
      const singleTrack = {
        ...slide,
        name: slide.name || slide.title,
        path: slide.path || slide.preview || null,
        cover:
          slide.cover ||
          slide.picture ||
          slide.album?.cover ||
          slide.album?.cover_medium ||
          null,
        albumCover:
          slide.album?.cover ||
          slide.album?.cover_medium ||
          slide.cover ||
          slide.picture ||
          null,
      };
      if (!singleTrack.path) return;

      const context = {
        name: slide.artist?.name || "Top Tracks",
        tracks: [singleTrack],
      };

      playOrPauseThisSong(context, singleTrack);
    }
  };

  const title = slide.title || slide.song || "Unknown";
  const creator =
    slide.artist?.name || slide.creator?.name || slide.artist || "Unknown";
  const releasedOn = slide.release_date || slide.releasedOn || "Unknown";
  const imgUrl =
    slide.cover || slide.picture || slide.url || "/images/default.png";

  return (
    <div
      className="pl-8 cursor-pointer"
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <div className="relative">
        <div
          className={`absolute w-full h-full bg-black z-10 rounded-md transition ${
            isHover
              ? "ease-in duration-150 bg-opacity-30"
              : "ease-out duration-150 bg-opacity-5"
          }`}
        />
        <div
          className="absolute z-50 bottom-3 left-3 rounded-full bg-white p-1.5 cursor-pointer"
          onClick={handlePlayClick}
        >
          <MdPlayArrow size={27} />
        </div>
        <div
          className={`absolute z-50 bottom-3 left-[60px] rounded-full bg-white p-2 transition ${
            isHover
              ? "ease-in duration-150 bg-opacity-100"
              : "ease-out duration-150 bg-opacity-0"
          }`}
        >
          <MdFavoriteBorder
            className={`transition ${
              isHover
                ? "ease-in duration-150 opacity-100"
                : "ease-out duration-150 opacity-0"
            }`}
            size={23}
          />
        </div>
        <div
          className={`absolute z-50 bottom-3 left-[107px] rounded-full bg-white p-1.5 transition ${
            isHover
              ? "ease-in duration-150 bg-opacity-100"
              : "ease-out duration-150 bg-opacity-0"
          }`}
        >
          <MdMoreHoriz
            className={`transition ${
              isHover
                ? "ease-in duration-150 opacity-100"
                : "ease-out duration-150 opacity-0"
            }`}
            size={27}
          />
        </div>
        <img
          width="25"
          className="absolute z-40 right-0 bottom-0 pb-3 mr-3 contrast-[1.4] brightness-[1.1]"
          src="/images/deezer-sound-icon.png"
          alt="Deezer Sound"
        />
        <img className="rounded-md aspect-square" src={imgUrl} alt={title} />
      </div>

      <div className="text-white text-left mt-2">
        <div className="text-sm hover:underline">{title}</div>
        <div className="text-[13px] flex hover:underline text-[#858590] pt-0.5">
          by {creator}
        </div>
        <div className="text-[11px] pt-0.5 text-[#858590]">
          Released on {releasedOn}
        </div>
      </div>
    </div>
  );
};

export default SliderItem;
