import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const SideMenuItem = ({ iconString, iconSize, pageUrl, name }) => {
  const location = useLocation();
  const [icon, setIcon] = useState(iconString + "-white");

  useEffect(() => {
    if (location.pathname === pageUrl && icon === iconString + "-red") return;

    if (location.pathname === pageUrl) {
      setIcon(iconString + "-red");
    } else {
      setIcon(iconString + "-white");
    }
  }, [location.pathname, pageUrl, iconString, icon]);

  const handleHover = () => {
    if (icon === iconString + "-red") {
      setIcon(iconString + "-white");
    } else if (icon === iconString + "-white") {
      setIcon(iconString + "-red");
    }
  };

  return (
    <div className="flex items-center w-full my-[20px]">
      <Link
        to={pageUrl}
        className={`border-l-4 w-full hover:text-[#EF5465] ${
          pageUrl === location.pathname
            ? "border-l-[#EF5465] text-[#EF5465]"
            : "border-l-[#191922] text-[#FFFFFF]"
        }`}
        onMouseEnter={handleHover}
        onMouseLeave={handleHover}
      >
        <div className="flex items-center pl-3 mx-3 cursor-pointer">
          <img width={iconSize} src={`/images/icons/${icon}.png`} alt={name} />
          <div className="pl-3.5 font-[600] text-[17px]">{name}</div>
        </div>
      </Link>
    </div>
  );
};

export default SideMenuItem;
