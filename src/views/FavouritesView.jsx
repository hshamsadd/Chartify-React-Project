import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useFavourites } from "../context/FavouritesContext.jsx";
import FavouriteButton from "../components/FavouriteButton.jsx";

const routeFor = (f) => {
  switch (f.type) {
    case "track":
      return `/track/${f.id}`;
    case "artist":
      return `/artist/${f.id}`;
    case "album":
      return `/album/${f.id}`;
    case "playlist":
      return `/playlist/${f.id}`;
    case "podcast":
      return `/podcast/${f.id}`;
    case "genres":
      return `/genres/${f.id}`;
    default:
      return "/";
  }
};

const getImageUrl = (...candidates) => {
  const sizeOrder = ["medium", "large", "xl", "small"];

  const extract = (c) => {
    if (!c) return undefined;
    if (typeof c === "string") return c;

    for (const k of ["cover", "picture", "image", "albumCover", "url", "src"]) {
      if (typeof c[k] === "string") return c[k];
    }

    for (const k of sizeOrder) {
      if (typeof c[k] === "string") return c[k];
    }

    for (const k of ["cover_small", "cover_medium", "cover_big", "cover_xl"]) {
      const v = c[k];
      if (!v) continue;
      const nested = extract(v);
      if (nested) return nested;
    }

    for (const k of ["album", "artist"]) {
      const v = c[k];
      if (!v) continue;
      const nested = extract(v);
      if (nested) return nested;
    }

    for (const v of Object.values(c)) {
      if (typeof v === "string") return v;
    }
    return undefined;
  };

  for (const cand of candidates) {
    const url = extract(cand);
    if (url) return url;
  }
  return undefined;
};

const FavouritesView = () => {
  const { favourites, removeFavourite } = useFavourites();
  const [isHover, setIsHover] = useState(false);

  return (
    <div className="p-6 text-[#FFFFFF]">
      <h1 className="text-2xl font-semibold mb-4">Favourites</h1>
      {favourites.length === 0 ? (
        <div className="opacity-70">No favourites yet.</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
          {favourites.map((f) => (
            <div
              key={`${f.type}:${f.id}`}
              className={`transition ${
                isHover ? "ease-in duration-150" : "ease-out duration-150"
              }`}
              onMouseEnter={() => setIsHover(true)}
              onMouseLeave={() => setIsHover(false)}
            >
              <Link to={routeFor(f)}>
                <img
                  alt={f.title}
                  src={
                    getImageUrl(
                      f.image,
                      f.cover,
                      f.albumCover,
                      f.album,
                      f.album?.cover_medium,
                      f.album?.cover_big,
                      f.album?.cover_small,
                      f.album?.cover_xl,
                      f.picture,
                      f.artist,
                      f.artist?.picture
                    ) || "/images/albumCovers/Amadeus.jpg"
                  }
                  className="w-60 h-60 object-cover rounded mb-2 hover:scale-105 transition-transform duration-200"
                />
                <div className="font-medium truncate">{f.title}</div>
                {f.subtitle && (
                  <div className="text-sm opacity-80 truncate">
                    {f.subtitle}
                  </div>
                )}
              </Link>

              <FavouriteButton
                fav={f}
                size={23}
                className="mt-2 text-red-400 hover:text-white p-0 m-0 bg-transparent border-0"
                activeClassName="text-red-400 hover:text-white"
                inactiveClassName="text-red-400 hover:text-white"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavouritesView;
