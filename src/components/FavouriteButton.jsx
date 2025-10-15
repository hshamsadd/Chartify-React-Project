import React from "react";
import { MdFavoriteBorder, MdFavorite } from "react-icons/md";
import { useFavourites } from "../context/FavouritesContext.jsx";

const defaultMappers = {
  track: (t) => ({
    id: t.id,
    type: "track",
    title: t.title || t.name,
    subtitle: t.artist?.name || t.artistName,
    image: t.album?.cover || t.cover || t.picture || t.picture_medium,
  }),
  album: (a) => ({
    id: a.id,
    type: "album",
    title: a.title || a.name,
    subtitle: a.artist?.name || a.artistName,
    image: a.cover || a.cover_medium || a.picture,
  }),
  artist: (a) => ({
    id: a.id,
    type: "artist",
    title: a.name || a.title,
    image: a.picture || a.picture_medium || a.image,
  }),
  playlist: (p) => ({
    id: p.id,
    type: "playlist",
    title: p.title || p.name,
    subtitle: p.user?.name || p.creator?.name,
    image: p.picture || p.picture_medium || p.image,
  }),
};

export default function FavouriteButton({
  fav,
  type,
  item,
  id,
  title,
  subtitle,
  image,
  size = 20,
  className = "",
  activeClassName = "text-[#0ea5e9]",
  inactiveClassName = "",
  stopPropagation = true,
  onToggle,
  ariaLabelAdd = "Add to favourites",
  ariaLabelRemove = "Remove from favourites",
}) {
  const { isFavourite, toggleFavourite } = useFavourites();

  const resolvedFav =
    fav ||
    (item && type && defaultMappers[type]?.(item)) ||
    (id && type ? { id, type, title, subtitle, image } : null);

  if (!resolvedFav?.id || !resolvedFav?.type) return null;

  const faved = isFavourite(resolvedFav.id, resolvedFav.type);

  const handleClick = (e) => {
    if (stopPropagation) {
      e.preventDefault?.();
      e.stopPropagation?.();
    }
    toggleFavourite(resolvedFav);
    onToggle?.(!faved, resolvedFav);
  };

  return (
    <button
      aria-label={faved ? ariaLabelRemove : ariaLabelAdd}
      onClick={handleClick}
      className={className}
      title={faved ? ariaLabelRemove : ariaLabelAdd}
    >
      {faved ? (
        <MdFavorite size={size} className={activeClassName} />
      ) : (
        <MdFavoriteBorder size={size} className={inactiveClassName} />
      )}
    </button>
  );
}
