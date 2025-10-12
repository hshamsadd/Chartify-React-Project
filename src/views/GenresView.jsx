// src/views/GenresView.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getGenres } from "../api/music";

const GenresView = () => {
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    (async () => {
      const data = await getGenres();
      setGenres(data);
    })();
  }, []);

  return (
    <div className="p-8 text-white">
      <h1 className="text-2xl font-bold mb-6">Genres</h1>
      <div className="grid grid-cols-6 gap-6">
        {genres.map((genre) => (
          <Link
            key={genre.id}
            to={`/genre/${genre.id}`}
            className="group cursor-pointer"
          >
            <div className="relative">
              <img
                src={genre.cover}
                alt={genre.name}
                className="rounded-md w-full aspect-square object-cover"
              />
              <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/70 to-transparent rounded-md p-2">
                <h2 className="text-sm font-semibold group-hover:text-[#EF5465]">
                  {genre.name}
                </h2>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default GenresView;
