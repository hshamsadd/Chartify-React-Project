import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const FavouritesContext = createContext(null);

export const FavouritesProvider = ({ children }) => {
  const [favourites, setFavourites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("favourites")) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("favourites", JSON.stringify(favourites));
  }, [favourites]);

  const keyOf = (id, type) => `${type}:${id}`;

  const indexOf = (id, type) =>
    favourites.findIndex((f) => keyOf(f.id, f.type) === keyOf(id, type));

  const isFavourite = (id, type) => indexOf(id, type) !== -1;

  const addFavourite = (fav) => {
    if (!fav?.id || !fav?.type) return;
    if (isFavourite(fav.id, fav.type)) return;
    setFavourites((prev) => [fav, ...prev]);
  };

  const removeFavourite = (id, type) => {
    setFavourites((prev) =>
      prev.filter((f) => !(f.id === id && f.type === type))
    );
  };

  const toggleFavourite = (fav) => {
    if (!fav?.id || !fav?.type) return;
    if (isFavourite(fav.id, fav.type)) {
      removeFavourite(fav.id, fav.type);
    } else {
      addFavourite(fav);
    }
  };

  const value = useMemo(
    () => ({
      favourites,
      isFavourite,
      addFavourite,
      removeFavourite,
      toggleFavourite,
    }),
    [favourites]
  );

  return (
    <FavouritesContext.Provider value={value}>
      {children}
    </FavouritesContext.Provider>
  );
};

export const useFavourites = () => {
  const favContext = useContext(FavouritesContext);
  if (!favContext)
    throw new Error("useFavourites must be used within FavouritesProvider");
  return favContext;
};
