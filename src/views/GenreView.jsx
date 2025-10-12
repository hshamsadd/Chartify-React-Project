// src/views/GenreView.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getGenre, getGenreTop } from "../api/music"; // ✅ your existing fetchers
import SliderItem from "../components/SliderItem";

const GenreView = () => {
  const { id } = useParams();
  const [genre, setGenre] = useState(null);
  const [artists, setArtists] = useState([]);
  const [radios, setRadios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadGenreData = async () => {
      try {
        setLoading(true);
        const genreData = await getGenre(id);
        const { artists, radios } = await getGenreTop(id);

        setGenre(genreData);
        setArtists(artists);
        setRadios(radios);
      } catch (err) {
        console.error("Failed to fetch genre:", err);
        setError("Failed to load genre data");
      } finally {
        setLoading(false);
      }
    };

    loadGenreData();
  }, [id]);

  if (loading)
    return <div className="text-white p-8 text-lg">Loading genre...</div>;
  if (error) return <div className="text-red-500 p-8">{error}</div>;

  return (
    <div className="text-white">
      {/* ---------- Genre Header ---------- */}
      <div className="relative h-[280px] w-full overflow-hidden">
        <img
          src={genre.cover}
          alt={genre.name}
          className="absolute w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#191922] to-transparent" />
        <div className="absolute bottom-8 left-8">
          <h1 className="text-4xl font-bold mb-1">{genre.name}</h1>
          <p className="text-sm text-[#A2A2AD]">Top Artists & Radios</p>
        </div>
      </div>

      {/* ---------- Top Artists ---------- */}
      <div className="p-8">
        <h2 className="text-xl font-semibold mb-4">Top Artists</h2>
        <div className="flex space-x-5 overflow-x-auto pb-3">
          {artists.map((artist) => (
            <div key={artist.id}>
              <SliderItem
                slide={{
                  id: artist.id,
                  url: artist.cover,
                  song: artist.name,
                  creator: "",
                  releasedOn: "",
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ---------- Top Radios ---------- */}
      <div className="px-8 pb-8">
        <h2 className="text-xl font-semibold mb-4">Top Radios</h2>
        <div className="flex space-x-5 overflow-x-auto pb-3">
          {radios.map((radio) => (
            <div key={radio.id}>
              <SliderItem
                slide={{
                  id: radio.id,
                  url: radio.cover,
                  song: radio.title,
                  creator: "",
                  releasedOn: "",
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GenreView;
