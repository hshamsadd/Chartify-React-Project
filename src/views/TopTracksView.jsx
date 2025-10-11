import React, { useState, useEffect, useMemo } from "react";
import CustomCarousel from "../components/CustomCarousel.jsx";
import { getChart } from "../api/music.js";
import { useSong } from "../context/SongContext.jsx";

export const TopTracksView = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const {
    audio,
    isPlaying,
    currentTrack,
    playOrPauseThisSong,
    loadSong,
    playOrPauseSong,
    setIsLyrics,
  } = useSong();

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const data = await getChart();
        setChartData(data);
      } catch (err) {
        console.error("Failed to fetch chart:", err);
        setError("Failed to load top tracks");
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, []);

  // Top 10 tracks from chart
  const topTracksData = useMemo(
    () => chartData?.tracks?.slice(0, 10) || [],
    [chartData]
  );

  // Play first track
  const handlePlayAll = () => {
    if (topTracksData.length > 0) {
      const firstTrack = topTracksData[0];
      loadSong({ name: firstTrack.artist }, firstTrack);
    }
  };

  if (loading) return <p>Loading top tracks...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-[1500px] mx-auto mt-8">
      {topTracksData.length > 0 && (
        <CustomCarousel
          category="Top Tracks 🎧"
          data={topTracksData.map((track) => ({
            id: track.id,
            title: track.title,
            artist: track.artist,
            albumCover: track.cover,
            path: track.path,
            track: track,
          }))}
          onPlay={(trackData) =>
            playOrPauseThisSong({ name: trackData.artist }, trackData.track)
          }
        />
      )}

      {/* Optional: "Play All" button */}
      <div className="mt-4 flex justify-end">
        <button
          onClick={handlePlayAll}
          className="bg-[#EF5464] text-white px-4 py-2 rounded hover:bg-[#d8434f]"
        >
          Play All
        </button>
      </div>
    </div>
  );
};

export default TopTracksView;
