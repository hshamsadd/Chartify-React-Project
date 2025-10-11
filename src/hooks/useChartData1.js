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

  const mapTopPlaylists = (playlist) => ({
    id: playlist.id, // <-- add this
    url: playlist.cover_medium,
    title: playlist.title,
    creator: playlist.creator?.name,
    link: playlist.link,
    tracks: playlist.tracks, // also include tracks if you want to play
  });

  const topPlaylistData = useMemo(
    () => chartData?.playlists?.slice(0, 10).map(mapTopPlaylists) || [],
    [chartData]
  );
  return { loading, error, topPlaylistData };
};

export default useChartData;
