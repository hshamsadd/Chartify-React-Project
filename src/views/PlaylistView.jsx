import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import SongRow from "../components/SongRow.jsx";
import {
  MdSearch,
  MdPlayArrow,
  MdPause,
  MdMoreHoriz,
  MdFavoriteBorder,
  MdSchedule,
} from "react-icons/md";
import { useSong } from "../context/SongContext.jsx";
import * as musicApi from "../api/music.js";

const PlaylistView = () => {
  const { id } = useParams();
  const {
    isPlaying,
    currentTrack,
    currentArtist,
    playOrPauseThisSong,
    playFromFirst,
  } = useSong();

  // ...existing code...

  const [playlistData, setPlaylistData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Add this line

  useEffect(() => {
    const fetchPlaylistData = async () => {
      try {
        if (id) {
          const data = await musicApi.getPlaylist(id);

          setPlaylistData({
            title: data.title,
            name: data.title, // <- provide a name for the player context
            cover: data.cover,
            albumCover: data.cover,
            creator: data.creator?.name,
            nb_tracks: data.nb_tracks,
            tracks: data.tracks.map((track) => ({
              ...track,
              name: track.title,
            })),
          });
        }
      } catch (err) {
        console.error("Failed to fetch playlist:", err);
        setError("Failed to fetch playlist");
      } finally {
        setLoading(false);
      }
    };
    fetchPlaylistData();
  }, [id]);

  if (loading) return <div>Loading playlist...</div>; // Fixed typo
  if (!playlistData) return <div>Playlist not found</div>;
  if (error) return <div>{error}</div>; // Display error message

  // Play first track of playlist
  const playFunc = () => {
    if (playlistData.tracks.length > 0) {
      playOrPauseThisSong(
        { name: playlistData.title, tracks: playlistData.tracks },
        playlistData.tracks[0]
      );
    }
  };

  return (
    <>
      {/* Header Section */}
      <div className="max-w-[1500px] mx-auto mt-6 px-8 min-w-[650px] flex items-center">
        <img
          width="175"
          className="rounded-md"
          src={playlistData.cover}
          alt={playlistData.title}
        />
        <div className="ml-8">
          <div className="text-white text-3xl font-semibold">
            {playlistData.title}
          </div>
          <div className="text-[#bfbfbf] text-[12px] py-1.5 font-light">
            by {playlistData.creator || "Unknown"} · {playlistData.nb_tracks}{" "}
            tracks
          </div>

          <div className="flex gap-4 items-center mt-2">
            <button
              className="p-2.5 px-6 rounded-full bg-[#EF5465]"
              onClick={playFunc}
            >
              {!isPlaying ? (
                <div className="flex items-center">
                  <MdPlayArrow className="text-white" size={20} />
                  <div className="text-white font-bold text-xs pr-1">PLAY</div>
                </div>
              ) : (
                <div className="flex items-center">
                  <MdPause className="text-white" size={20} />
                  <div className="text-white font-bold text-xs pr-1">PAUSE</div>
                </div>
              )}
            </button>

            <button
              type="button"
              className="rounded-full p-2 border border-[#52525D] hover:bg-[#2b2b30]"
            >
              <MdFavoriteBorder className="text-[#EAEAEA]" size={20} />
            </button>

            <button
              type="button"
              className="rounded-full p-2 border border-[#52525D] hover:bg-[#2b2b30]"
            >
              <MdMoreHoriz className="text-[#EAEAEA]" size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-10 pl-8">
        {/* Search within tracks */}
        <div className="flex items-center border border-[#525254] bg-[#23232D] rounded-sm text-[#c9c9c9] w-[300px] mb-6">
          <MdSearch className="text-[#9B9BA1] px-1" size={24} />
          <input
            className="w-full py-[5px] bg-[#23232D] text-sm placeholder-[#7e7e7e] outline-none"
            type="text"
            placeholder="Search within tracks"
          />
        </div>

        {/* Track list header */}
        <div className="flex items-center justify-between min-w-[590px] border-b border-b-[#302d2d] py-2.5 px-1.5">
          <div className="text-xs font-light text-[#aeaeae]">TRACK</div>
          <MdSchedule className="text-[#aeaeae]" size={20} />
        </div>

        {/* Track rows */}
        <ul className="w-full pr-16 min-w-[650px]">
          {playlistData.tracks.map((track) => (
            <SongRow key={track.id} track={track} artistData={playlistData} />
          ))}
        </ul>
      </div>

      <div className="mb-40"></div>
    </>
  );
};

export default PlaylistView;
