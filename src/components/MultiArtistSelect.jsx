import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MdPlayArrow } from "react-icons/md";

const MultiArtistSelect = ({ category, images, text, to }) => {
  const [isHover, setIsHover] = useState(false);

  return (
    <div>
      <Link to={to} className="relative">
        <div
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
          className="flex justify-center items-center contrast-[2] brightness-[0.87] rounded-md aspect-square overflow-hidden"
        >
          <div
            className={`absolute w-full h-full bg-black z-10 rounded-md transition ${
              isHover
                ? "ease-in duration-150 bg-opacity-20"
                : "ease-out duration-150 bg-opacity-5"
            }`}
          />
          <img
            className="absolute contrast-[0.55] right-0 top-0 w-1/2"
            src={images.one}
            alt="Artist 1"
          />
          <img
            className="absolute contrast-[0.55] left-0 top-0 w-1/2"
            src={images.two}
            alt="Artist 2"
          />
          <img
            className="absolute contrast-[0.55] right-0 bottom-0 w-1/2"
            src={images.three}
            alt="Artist 3"
          />
          <img
            className="absolute contrast-[0.55] left-0 bottom-0 w-1/2"
            src={images.four}
            alt="Artist 4"
          />
          <div className="absolute z-10 p-2 rounded-full bg-white inline-block">
            <MdPlayArrow size={33} />
          </div>
          <div className="absolute z-30 flex items-center bottom-1 left-0 h-7 ml-1 bg-black rounded-full px-2 bg-opacity-10">
            <img
              width="30"
              className="pr-2 opacity-[0.75] brightness-[1.2]"
              src="/images/deezer-sound-icon.png"
              alt="Deezer Sound"
            />
            <div className="text-white font-bold text-[21px]">{category}</div>
          </div>
        </div>
      </Link>
      <div className="h-2"></div>
      <Link to={to}>
        <div className="hover:underline text-gray-200 font-light text-sm">
          {text}
        </div>
      </Link>
    </div>
  );
};

export default MultiArtistSelect;
