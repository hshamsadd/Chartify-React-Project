// src/views/GenreView.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getGenre, getGenreTop } from "../api/music";
import CustomCarousel from "../components/CustomCarousel.jsx";

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
        const topData = await getGenreTop(id);

        setGenre(genreData);
        setArtists(topData?.artists || []);
        setRadios(topData?.radios || []);
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
  if (!genre) return <div className="text-white p-8">No genre data found</div>;

  // Transform artists data to match SliderItem format
  const formattedArtists = artists.map((artist) => ({
    id: artist.id,
    cover:
      artist.cover ||
      artist.picture_big ||
      artist.picture_medium ||
      artist.picture,
    picture:
      artist.cover ||
      artist.picture_big ||
      artist.picture_medium ||
      artist.picture,
    title: artist.name,
    creator: "",
    type: "artist",
  }));

  // Transform radios data to match SliderItem format
  const formattedRadios = radios.map((radio) => ({
    id: radio.id,
    cover:
      radio.cover || radio.picture_big || radio.picture_medium || radio.picture,
    picture:
      radio.cover || radio.picture_big || radio.picture_medium || radio.picture,
    title: radio.title,
    creator: "",
    type: "playlist",
  }));

  return (
    <div>
      {/* ---------- Genre Header ---------- */}
      <div className="relative h-[280px] w-full overflow-hidden">
        <img
          src={
            genre.cover ||
            genre.picture_big ||
            genre.picture_medium ||
            genre.picture
          }
          alt={genre.name}
          className="absolute w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#191922] to-transparent" />
        <div className="absolute bottom-8 left-8 text-white">
          <h1 className="text-4xl font-bold mb-1">{genre.name}</h1>
          <p className="text-sm text-[#A2A2AD]">Top Artists & Radios</p>
        </div>
      </div>

      {/* ---------- Top Artists ---------- */}
      {formattedArtists.length > 0 && (
        <div className="text-[#0ea5e9]">
          <CustomCarousel
            category="Top Artists"
            data={formattedArtists}
            type="artist"
          />
        </div>
      )}

      {/* ---------- Top Radios ---------- */}
      {formattedRadios.length > 0 && (
        <div className="text-[#0ea5e9]">
          <CustomCarousel
            category="Top Radios"
            data={formattedRadios}
            type="playlist"
          />
        </div>
      )}
    </div>
  );
};

export default GenreView;
