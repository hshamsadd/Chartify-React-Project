import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MdPlayArrow } from "react-icons/md";

const Highlights = ({ by, song, image }) => {
  const [isHover, setIsHover] = useState(false);

  return (
    <Link to="/artist" className="cursor-pointer">
      <div
        className="relative"
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
      >
        <div
          className={`absolute w-full h-full bg-black z-10 rounded-md transition ${
            isHover
              ? "ease-in duration-150 bg-opacity-30"
              : "ease-out duration-150 bg-opacity-5"
          }`}
        />
        <div className="absolute z-50 pl-4 pt-4">
          <div className="bg-black bg-opacity-40 rounded-md text-white px-2 py-1 text-sm text-center inline-block">
            Album
          </div>
          <div className="text-white text-xl mt-2 font-[700]">{by}</div>
          <div className="text-white mt-2 font-[400]">{song}</div>
        </div>
        <div className="absolute z-50 bottom-3 left-3 rounded-full bg-white p-1.5">
          <MdPlayArrow size={27} />
        </div>
        <img className="rounded-lg" src={image} alt={`${by} - ${song}`} />
      </div>
    </Link>
  );
};

export default Highlights;
