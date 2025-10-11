import React, { useEffect, useState } from "react";
import CustomCarousel from "../components/CustomCarousel.jsx";
import { getChart } from "../api/music.js";

export const HomeView = () => {
  const [chartData, setChartData] = useState({
    tracks: [],
    albums: [],
    artists: [],
    playlists: [],
    podcasts: [],
  });

  useEffect(() => {
    const fetchChart = async () => {
      try {
        const data = await getChart();
        setChartData(data);
      } catch (error) {
        console.error("Failed to fetch chart data:", error);
      }
    };

    fetchChart();
  }, []);

  return (
    <div className="max-w-[1500px] mx-auto">
      <div className="mt-8 min-w-[800px]">
        {chartData.tracks.length > 0 && (
          <CustomCarousel
            category="Top Tracks"
            data={chartData.tracks}
            type="track"
          />
        )}

        {chartData.albums.length > 0 && (
          <CustomCarousel
            category="Top Albums"
            data={chartData.albums}
            type="album"
          />
        )}

        {chartData.artists.length > 0 && (
          <CustomCarousel
            category="Top Artists"
            data={chartData.artists}
            type="artist"
          />
        )}

        {chartData.playlists.length > 0 && (
          <CustomCarousel
            category="Top Playlists"
            data={chartData.playlists}
            type="playlist"
          />
        )}

        {chartData.podcasts.length > 0 && (
          <CustomCarousel
            category="Top Podcasts"
            data={chartData.podcasts}
            type="podcast"
          />
        )}
      </div>
    </div>
  );
};

export default HomeView;
