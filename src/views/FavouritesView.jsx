import React from "react";
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
    default:
      return "/";
  }
};

// Image resolver (only normalizes image/cover objects into a URL; no style changes)
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

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-semibold mb-4">Favourites</h1>
      {favourites.length === 0 ? (
        <div className="opacity-70">No favourites yet.</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {favourites.map((f) => (
            <div
              key={`${f.type}:${f.id}`}
              className="bg-[#23232D] rounded p-3 hover:bg-[#2a2a36] transition"
            >
              <Link to={routeFor(f)}>
                <img
                  alt={f.title}
                  src={
                    getImageUrl(
                      // Prefer explicit image first
                      f.image,
                      f.cover,
                      f.albumCover,
                      // Album-shaped objects with nested sizes
                      f.album,
                      f.album?.cover_medium,
                      f.album?.cover_big,
                      f.album?.cover_small,
                      f.album?.cover_xl,
                      // Artist pictures as fallback
                      f.picture,
                      f.artist,
                      f.artist?.picture
                    ) || "/images/albumCovers/default.jpg"
                  }
                  className="w-full h-40 object-cover rounded mb-2"
                />
                <div className="font-medium truncate">{f.title}</div>
                {f.subtitle && (
                  <div className="text-sm opacity-70 truncate">
                    {f.subtitle}
                  </div>
                )}
              </Link>

              {/* Use FavouriteButton instead of text "Remove" */}
              <FavouriteButton
                fav={f}
                size={18}
                className="mt-2 text-red-400 hover:text-red-300 p-0 m-0 bg-transparent border-0"
                activeClassName="text-red-400 hover:text-red-300"
                inactiveClassName="text-red-400 hover:text-red-300"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavouritesView;
