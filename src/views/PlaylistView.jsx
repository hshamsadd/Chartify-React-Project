import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import SongRow from "../components/SongRow.jsx";
import { MdSearch, MdPlayArrow, MdPause, MdSchedule } from "react-icons/md";
import FavouriteButton from "../components/FavouriteButton.jsx";
import { useSong } from "../context/SongContext.jsx";
import * as musicApi from "../api/music.js";

const PlaylistView = () => {
  const { id } = useParams();
  const { isPlaying, playOrPauseThisSong } = useSong();

  const [playlistData, setPlaylistData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlaylistData = async () => {
      try {
        if (id) {
          const data = await musicApi.getPlaylist(id);

          setPlaylistData({
            title: data.title,
            name: data.title,
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

  if (loading) return <div>Loading playlist...</div>;
  if (!playlistData) return <div>Playlist not found</div>;
  if (error) return <div>{error}</div>;

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
      <div className="max-w-[1500px] mx-auto mt-6 px-8 min-w-[650px] flex items-center">
        <img
          width="175"
          className="rounded-full"
          src={playlistData.cover}
          alt={playlistData.title}
        />
        <div className="ml-8">
          <div className="text-white text-3xl w-full hover:underline cursor-pointer font-semibold">
            {playlistData.title}
          </div>
          <div className="text-[#d8d5d5] text-[12px] py-1.5 font-light">
            by {playlistData.creator || "Unknown"} · {playlistData.nb_tracks}{" "}
            tracks
          </div>

          <div className="flex gap-4 items-center justify-start bottom-0 mb-1.5">
            <button
              className="p-2.5 px-6 rounded-full bg-[#FFFFFF]"
              onClick={playFunc}
            >
              {!isPlaying ? (
                <div className="flex items-center">
                  <MdPlayArrow className="text-[#0ea5e9]" size={20} />
                  <div className="text-[#0ea5e9] font-bold text-xs pr-1">
                    PLAY
                  </div>
                </div>
              ) : (
                <div className="flex items-center">
                  <MdPause className="text-[#0ea5e9]" size={20} />
                  <div className="text-[#0ea5e9] font-bold text-xs pr-1">
                    PAUSE
                  </div>
                </div>
              )}
            </button>
            <FavouriteButton
              type="playlist"
              id={id}
              title={playlistData.title}
              subtitle={playlistData.creator || "Unknown"}
              image={playlistData.cover}
              size={20}
              className="rounded-full p-2 border border-[#ffffff] hover:bg-[#ffffff]"
              activeClassName="text-[#0ea5e9] bg-[#ffffff] border-0 hover:bg-[#ffffff]"
              inactiveClassName="[&>svg]:fill-none [&>svg]:stroke-[#0ea5e9] [&>svg]:stroke-[1.5] hover:text-[#0ea5e9]"
            />
          </div>
        </div>
      </div>

      <div className="mb-10"></div>

      {/* Tracks Section */}
      <div
        id="SongsSection"
        className="max-w-[1500px] mx-auto max-h-[calc(100vh-200px)]"
      >
        <div className="pl-8">
          <div className="text-white text-3xl font-semibold mb-7">
            {playlistData.title}
          </div>

          <div className="flex items-center border border-[#FFFFFF] bg-[#0ea5e9] rounded-sm text-[#ffffff] w-[300px]">
            <MdSearch className="text-[#ffffff] px-1" size={24} />
            <input
              className="w-full py-[5px] bg-[#0ea5e9] text-sm placeholder-[#FFFFFF] outline-none ring-0 hover:ring-0"
              type="text"
              placeholder="Search within tracks"
            />
          </div>
        </div>

        <div className="mb-4"></div>

        <div className="flex items-center justify-between min-w-[590px] mx-8 border-b border-b-[#FFFFFF] py-2.5 px-1.5">
          <div className="text-xs font-light text-[#ffffff]">TRACKS</div>
          <MdSchedule className="text-[#ffffff]" size={20} />
        </div>

        {/* Track rows */}
        <ul className="w-850 mx-8 pr-16 min-w-[650px]">
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
