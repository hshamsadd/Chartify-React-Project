import React, { useEffect, useState } from "react";
import { getGenres } from "../api/music";
import CustomCarousel from "../components/CustomCarousel";

const GenresView = () => {
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    const fetchGenres = async () => {
      const data = await getGenres();
      setGenres(data);
    };
    fetchGenres();
  }, []);

  return (
    <div className="p-8">
      {genres.length === 0 ? (
        <p className="text-white">Loading genres...</p>
      ) : (
        <div className="text-[#0ea5e9]">
          <CustomCarousel category="Browse Genres" data={genres} type="genre" />
        </div>
      )}
    </div>
  );
};

export default GenresView;
