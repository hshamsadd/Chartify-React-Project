import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getTopPodcasts } from "../api/music.js";

const PodcastsView = () => {
  const [podcasts, setPodcasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPodcasts = async () => {
      setLoading(true);
      try {
        const data = await getTopPodcasts(24); // fetch top 24 podcasts
        setPodcasts(data);
      } catch (err) {
        console.error("Error fetching podcasts:", err);
        setError(err.message || "Failed to load podcasts");
      } finally {
        setLoading(false);
      }
    };

    fetchPodcasts();
  }, []);

  if (loading) return <div className="text-white p-4">Loading...</div>;
  if (error) return <div className="text-red-500 p-4">{error}</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-white mb-6">Podcasts</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {podcasts.map((podcast) => (
          <Link
            key={podcast.id}
            to={`/podcasts/${podcast.id}`}
            className="hover:scale-105 transition-transform duration-200"
          >
            <div className="flex flex-col items-center">
              <img
                src={podcast.cover || "/images/default.png"}
                alt={podcast.title}
                className="w-32 h-32 rounded-md object-cover mb-2"
              />
              <p className="text-white text-center">{podcast.title}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PodcastsView;
