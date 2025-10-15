import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const SideMenuItem = ({ icon, iconSize, pageUrl, name }) => {
  const location = useLocation();
  const [isHovered, setIsHovered] = useState(false);

  const isActive = location.pathname === pageUrl;

  return (
    <div className="flex items-center w-full my-[20px]">
      <Link
        to={pageUrl}
        className={`border-l-4 w-full hover:text-[#FFFFFF] ${
          isActive
            ? "border-l-[#FFFFFF] text-[#FFFFFF]"
            : "border-l-[#0ea5e9] text-[#FFFFFF]"
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex items-center pl-3 mx-3 cursor-pointer">
          <div
            className={`transition-all ${
              isActive || isHovered
                ? "text-[#0ea5e9] bg-white rounded-full p-0.5"
                : "text-white"
            }`}
            style={{
              fontSize: iconSize,
              display: "flex",
              alignItems: "center",
            }}
          >
            {icon}
          </div>
          <div className="pl-3.5 font-[600] text-[17px]">{name}</div>
        </div>
      </Link>
    </div>
  );
};

export default SideMenuItem;
