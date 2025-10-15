import React, { useState } from "react";
import { MdPlayArrow } from "react-icons/md";
import FavouriteButton from "./FavouriteButton.jsx";

const GenreItem = ({ slide }) => {
  const [isHover, setIsHover] = useState(false);

  const handlePlayClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const fav = {
    id: slide.id,
    type: "genre",
    title: slide.name,
    subtitle: "",
    image: slide.cover,
  };

  return (
    <div
      className="pl-8 cursor-pointer"
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <div className="relative shadow-lg hover:shadow-2xl hover:scale-x-[1.02] transition-all duration-300 ease-in-out z-40 origin-left">
        <div
          className={`absolute w-full h-full bg-black z-10 rounded-md transition ${
            isHover
              ? "ease-in duration-150 bg-opacity-25"
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
          className={`absolute z-50 bottom-3 right-3 rounded-full bg-white p-1.5 cursor-pointer transition w-10 h-10 flex items-center justify-center ${
            isHover
              ? "ease-in duration-150 bg-opacity-100"
              : "ease-out duration-150 bg-opacity-0"
          }`}
        >
          <FavouriteButton
            fav={fav}
            size={23}
            className="p-0 m-0 bg-transparent border-0"
            activeClassName={`transition ${
              isHover
                ? "ease-in duration-150 opacity-100"
                : "ease-out duration-150 opacity-0"
            }`}
            inactiveClassName={`transition ${
              isHover
                ? "ease-in duration-150 opacity-100"
                : "ease-out duration-150 opacity-0"
            }`}
          />
        </div>

        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div className="text-white text-2xl font-bold text-center px-4">
            {slide.name}
          </div>
        </div>

        <img
          className="rounded-md aspect-square"
          src={slide.cover}
          alt={slide.name}
        />
      </div>
    </div>
  );
};

export default GenreItem;
