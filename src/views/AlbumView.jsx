import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import SongRow from "../components/SongRow.jsx";
import { MdSearch, MdPlayArrow, MdPause, MdSchedule } from "react-icons/md";
import { useSong } from "../context/SongContext.jsx";
import FavouriteButton from "../components/FavouriteButton.jsx";
import * as musicApi from "../api/music.js";

const AlbumView = () => {
  const { id } = useParams();
  const { isPlaying, playOrPauseThisSong } = useSong();

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
            ...t.album,
            cover_small:
              t.album?.cover_small || album.cover_small || album.cover,
            cover_medium:
              t.album?.cover_medium || album.cover_medium || album.cover,
            cover_big: t.album?.cover_big || album.cover_big || album.cover,
            cover_xl: t.album?.cover_xl || album.cover_xl || album.cover,
            release_date: tracks.album?.release_date || null,
          },
          artist: {
            id: t.artist?.id || album.artist?.id,
            name: t.artist?.name || album.artist?.name || "Unknown Artist",
            picture: t.artist?.picture_medium || t.artist?.picture || null,
            nb_fan: t.artist?.nb_fan || 0,
          },
        }));

        setAlbumData({
          title: album.title,
          name: album.title,
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
      <div className="max-w-[1500px] mx-auto mt-6 px-8 min-w-[650px] flex items-center">
        <img
          width="175"
          className="rounded-full"
          src={
            albumData.albumCover?.medium ||
            albumData.albumCover?.large ||
            albumData.cover
          }
          alt={albumData.title}
        />
        <div className="ml-8">
          <div className="text-white text-3xl w-full hover:underline cursor-pointer font-semibold">
            {albumData.title}
          </div>
          <div className="text-[#d8d5d5] text-[12px] py-1.5 font-light">
            by {albumData.artistName} · {albumData.nb_tracks} tracks
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
              type="album"
              id={id}
              title={albumData.title}
              subtitle={albumData.artistName}
              image={
                albumData.albumCover ||
                albumData.album?.cover ||
                albumData.albumCover_medium ||
                albumData.albumCover?.large ||
                albumData.album.cover_big ||
                albumData.album.cover_medium ||
                albumData.track.album.cover_small ||
                albumData.track.album.cover_medium ||
                albumData.track.album.cover
              }
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
            {albumData.title}
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

        <ul className="w-850 mx-8 pr-16 min-w-[650px]">
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
