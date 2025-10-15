import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPodcast } from "../api/music.js";
import CustomCarousel from "../components/CustomCarousel.jsx";

const PodcastView = () => {
  const { podcastId } = useParams();
  const [podcast, setPodcast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!podcastId) return;

    const fetchPodcast = async () => {
      setLoading(true);
      try {
        const data = await getPodcast(podcastId);
        setPodcast(data);
      } catch (err) {
        console.error("Error fetching podcast:", err);
        setError(err.message || "Failed to load podcast");
      } finally {
        setLoading(false);
      }
    };

    fetchPodcast();
  }, [podcastId]);

  if (loading) return <div className="text-white p-4">Loading...</div>;
  if (error) return <div className="text-red-500 p-4">{error}</div>;
  if (!podcast) return <div className="text-white p-4">Podcast not found</div>;

  return (
    <div className="p-8">
      <div className="flex items-center space-x-6">
        <img
          src={podcast.cover || "/images/default.png"}
          alt={podcast.title}
          className="w-48 h-48 rounded-md object-cover"
        />
        <div>
          <h1 className="text-3xl font-bold text-white">{podcast.title}</h1>
          <p className="text-white mt-2">{podcast.description}</p>
          <p className="text-gray-300 mt-1">{podcast.fans} fans</p>
          <a
            href={podcast.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:underline"
          >
            Listen on Deezer
          </a>
        </div>
      </div>

      {podcast.tracks && podcast.tracks.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-white mb-4">Episodes</h2>
          <CustomCarousel
            category="Episodes"
            data={podcast.tracks}
            type="track"
          />
        </div>
      )}
    </div>
  );
};

export default PodcastView;
