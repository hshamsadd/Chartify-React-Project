import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import SongRow from "../components/SongRow.jsx";
import {
  MdSearch,
  MdPlayArrow,
  MdPause,
  MdMoreHoriz,
  MdSchedule,
} from "react-icons/md";
import { useSong } from "../context/SongContext.jsx";
import FavouriteButton from "../components/FavouriteButton.jsx";
import * as musicApi from "../api/music.js";

const AlbumView = () => {
  const { id } = useParams(); // album ID
  const {
    isPlaying,
    currentTrack,
    currentArtist,
    playOrPauseThisSong,
    playFromFirst,
  } = useSong();

  const [albumData, setAlbumData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAlbumData = async () => {
      if (!id) return;

      setLoading(true);
      try {
        const album = await musicApi.getAlbum(id);

        // Fetch tracks
        let tracks = [];
        try {
          tracks = await musicApi.getAlbumTracks(id);
        } catch (err) {
          console.warn("No tracks found for this album:", err);
        }

        // Normalize tracks with their own album covers
        const tracksToShow = tracks.map((t, index) => ({
          ...t,
          id: index + 1,
          name: t.title,
          lyrics: false,
          album: {
            ...t.album, // use the track’s own album object with all covers
            cover_small:
              t.album?.cover_small || album.cover_small || album.cover,
            cover_medium:
              t.album?.cover_medium || album.cover_medium || album.cover,
            cover_big: t.album?.cover_big || album.cover_big || album.cover,
            cover_xl: t.album?.cover_xl || album.cover_xl || album.cover,
          },
          artist: {
            id: t.artist?.id || album.artist?.id,
            name: t.artist?.name || album.artist?.name || "Unknown Artist",
            picture: t.artist?.picture_medium || t.artist?.picture || null,
          },
        }));

        setAlbumData({
          title: album.title,
          name: album.title, // for player context
          albumCover:
            album.cover_medium ||
            album.cover ||
            album.cover_big ||
            album.cover_small,
          cover: album.cover_medium || album.cover,
          artistName: album.artist?.name || "Unknown Artist",
          nb_tracks: tracksToShow.length,
          tracks: tracksToShow,
        });
      } catch (err) {
        console.error("Failed to fetch album data:", err);
        setError("Failed to load album data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAlbumData();
  }, [id]);

  const playFunc = () => {
    if (albumData?.tracks.length > 0) {
      playOrPauseThisSong(albumData, albumData.tracks[0]);
    }
  };

  if (loading) return <div className="text-white p-8">Loading album...</div>;
  if (error) return <div className="text-red-500 p-8">{error}</div>;
  if (!albumData) return null;

  return (
    <>
      {/* Header */}
      <div className="max-w-[1500px] mx-auto mt-6 px-8 min-w-[650px] flex items-center">
        <img
          width="175"
          className="rounded-md"
          src={
            albumData.albumCover?.medium ||
            albumData.albumCover?.large ||
            albumData.cover // fallback
          }
          alt={albumData.title}
        />
        <div className="ml-8">
          <div className="text-white text-3xl font-semibold">
            {albumData.title}
          </div>
          <div className="text-[#bfbfbf] text-[12px] py-1.5 font-light">
            by {albumData.artistName} · {albumData.nb_tracks} tracks
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

            {/* Keep wrapper styles; replace icon with FavouriteButton */}
            <FavouriteButton
              type="album"
              id={id}
              title={albumData.title}
              subtitle={albumData.artistName}
              image={
                albumData.albumCover ||
                albumData.album?.cover ||
                albumData.albumCover_medium ||
                albumData.albumCover?.large ||
                albumData.album.cover_big || // fallback
                albumData.album.cover_medium ||
                albumData.track.album.cover_small ||
                albumData.track.album.cover_medium ||
                albumData.track.album.cover // last fallback
              }
              size={20}
              className="rounded-full p-2 border border-[#52525D] hover:bg-[#2b2b30]"
              activeClassName="text-[#EAEAEA]"
              inactiveClassName="text-[#EAEAEA]"
            />

            <button className="rounded-full p-2 border border-[#52525D] hover:bg-[#2b2b30]">
              <MdMoreHoriz className="text-[#EAEAEA]" size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mt-10 pl-8">
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

        {/* Tracks */}
        <ul className="w-full pr-16 min-w-[650px]">
          {albumData.tracks.map((track) => (
            <SongRow key={track.id} track={track} artistData={albumData} />
          ))}
        </ul>
      </div>

      <div className="mb-40"></div>
    </>
  );
};

export default AlbumView;
