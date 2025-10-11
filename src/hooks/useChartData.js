import { useState, useEffect, useMemo } from "react";
import { getChart } from "../api/music.js";

const useChartData = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChart = async () => {
      try {
        const data = await getChart();
        setChartData(data);
      } catch (err) {
        console.error("Failed to fetch chart:", err);
        setError("Failed to load chart data");
      } finally {
        setLoading(false);
      }
    };

    fetchChart();
  }, []);

  // Memoize top playlists, albums, tracks, artists, podcasts if needed
  const topPlaylistData = useMemo(
    () => chartData?.playlists?.slice(0, 10) || [],
    [chartData]
  );

  const topAlbumData = useMemo(
    () => chartData?.albums?.slice(0, 10) || [],
    [chartData]
  );

  const topTrackData = useMemo(
    () => chartData?.tracks?.slice(0, 10) || [],
    [chartData]
  );

  const topArtistData = useMemo(
    () => chartData?.artists?.slice(0, 10) || [],
    [chartData]
  );

  const topPodcastData = useMemo(
    () => chartData?.podcasts?.slice(0, 10) || [],
    [chartData]
  );

  return {
    loading,
    error,
    chartData,
    topPlaylistData,
    topAlbumData,
    topTrackData,
    topArtistData,
    topPodcastData,
  };
};

export default useChartData;
