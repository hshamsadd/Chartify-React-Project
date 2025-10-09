import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MdPlayArrow } from "react-icons/md";

const MixesInspiredBy = ({ by, image, text, to }) => {
  const [isHover, setIsHover] = useState(false);

  return (
    <div>
      <Link to={to} className="relative">
        <div className="flex items-center bg-[#23232D] rounded-sm h-[54px] relative">
          <div
            className="flex items-center w-[54px]"
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
          >
            <div
              className={`absolute h-full z-10 w-[54px] bg-black rounded-sm transition ${
                isHover
                  ? "ease-in duration-100 bg-opacity-40"
                  : "ease-out duration-100 bg-opacity-5"
              }`}
            />
            <div
              className={`absolute z-20 p-1.5 rounded-full bg-white left-[6px] transition ${
                isHover
                  ? "ease-in duration-100 opacity-100"
                  : "ease-out duration-100 opacity-0"
              }`}
            >
              <MdPlayArrow size={30} />
            </div>
            <img
              className="min-h-[54px] min-w-[54px] rounded-sm z-0"
              src={image}
              alt={text}
            />
          </div>
          <div className="truncate w-full ml-4">
            <p className="hover:underline truncate max-w-[95%] text-gray-200 font-light text-[15px] cursor-pointer">
              {text}
            </p>
            <p className="text-[#787882] truncate text-[12px] max-w-[95%] font-light">
              by <span className="hover:underline cursor-pointer">{by}</span>
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default MixesInspiredBy;
