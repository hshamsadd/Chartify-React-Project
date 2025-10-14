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

const TopTrackView = () => {
  const { id } = useParams(); // track ID
  const {
    isPlaying,
    currentTrack,
    currentArtist,
    playOrPauseThisSong,
    playFromFirst,
  } = useSong();

  const [trackData, setTrackData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTrackData = async () => {
      if (!id) return;

      setLoading(true);
      try {
        // Fetch the track itself
        const track = await musicApi.getTrack(id);

        // Try to fetch artist top tracks
        let topTracks = [];
        if (track.artist?.id) {
          try {
            topTracks = await musicApi.getArtistTopTracks(track.artist.id, 10);
          } catch (err) {
            console.warn("No top tracks found for this artist:", err);
          }
        }

        // Always show at least the clicked track
        const tracksToShow =
          topTracks.length > 0
            ? topTracks.map((t, index) => ({
                ...t,
                id: index + 1,
                lyrics: false,
              }))
            : [{ ...track, id: 1, name: track.title, lyrics: false }];

        setTrackData({
          name: track.title,
          albumCover:
            track.album?.cover_medium || track.cover || track.artist?.picture,
          nb_fan: track.artist?.nb_fan || 0,
          artistName: track.artist?.name || "Unknown Artist",
          tracks: tracksToShow,
        });
      } catch (err) {
        console.error("Failed to fetch track data:", err);
        setError("Failed to load track data.");
      } finally {
        setLoading(false);
      }
    };

    fetchTrackData();
  }, [id]);

  const playFunc = () => {
    if (currentTrack) {
      playOrPauseThisSong(currentArtist, currentTrack);
      return;
    }
    playFromFirst();
  };

  if (loading) return <div className="text-white p-8">Loading track...</div>;
  if (error) return <div className="text-red-500 p-8">{error}</div>;
  if (!trackData) return null;

  return (
    <>
      {/* Header Section */}
      <div id="HeaderSection" className="max-w-[1500px] mx-auto">
        <div className="flex items-center w-full relative h-full px-8 mt-6 min-w-[650px]">
          <img
            width="175"
            className="rounded-full"
            src={trackData.albumCover}
            alt={trackData.name}
          />

          <div className="ml-8">
            <div className="text-white text-3xl w-full hover:underline cursor-pointer font-semibold">
              {trackData.name}
            </div>

            <div className="text-[#bfbfbf] text-[12px] py-1.5 font-light">
              {trackData.artistName} • {trackData.nb_fan.toLocaleString()} fans
            </div>

            <div className="flex gap-4 items-center justify-start bottom-0 mb-1.5">
              <button
                className="p-2.5 px-6 rounded-full bg-[#EF5465]"
                onClick={playFunc}
              >
                {!isPlaying ? (
                  <div className="flex items-center">
                    <MdPlayArrow className="text-white" size={20} />
                    <div className="text-white font-bold text-xs pr-1">
                      PLAY
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <MdPause className="text-white" size={20} />
                    <div className="text-white font-bold text-xs pr-1">
                      PAUSE
                    </div>
                  </div>
                )}
              </button>
              {/* Heart: now generic FavouriteButton, same classes/colors */}
              <FavouriteButton
                type="track"
                id={id}
                title={trackData.name}
                subtitle={trackData.artistName}
                image={trackData.albumCover}
                size={20}
                className="rounded-full p-2 border border-[#52525D] hover:bg-[#2b2b30]"
                activeClassName="text-[#EAEAEA]"
                inactiveClassName="text-[#EAEAEA]"
              />
              <button
                type="button"
                className="rounded-full p-2 border border-[#52525D] hover:bg-[#2b2b30]"
              >
                <MdMoreHoriz className="text-[#EAEAEA]" size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="border-b border-b-[#302d2d]"></div>
      <div className="mb-10"></div>

      {/* Tracks Section */}
      <div id="SongsSection" className="max-w-[1500px] mx-auto">
        <div className="pl-8">
          <div className="text-white text-3xl font-semibold mb-7">
            Top tracks
          </div>

          <div className="flex items-center border border-[#525254] bg-[#23232D] rounded-sm text-[#c9c9c9] w-[300px]">
            <MdSearch className="text-[#9B9BA1] px-1" size={24} />
            <input
              className="w-full py-[5px] bg-[#23232D] text-sm placeholder-[#7e7e7e] outline-none ring-0 hover:ring-0"
              type="text"
              placeholder="Search within tracks"
            />
          </div>
        </div>

        <div className="mb-4"></div>

        <div className="flex items-center justify-between min-w-[590px] mx-8 border-b border-b-[#302d2d] py-2.5 px-1.5">
          <div className="text-xs font-light text-[#aeaeae]">TRACK</div>
          <MdSchedule className="text-[#aeaeae]" size={20} />
        </div>

        <ul className="w-full mx-8 pr-16 min-w-[650px]">
          {trackData.tracks.map(
            (track) =>
              track && (
                <SongRow key={track.id} track={track} artistData={trackData} />
              )
          )}
        </ul>
      </div>

      <div className="mb-40"></div>
    </>
  );
};

export default TopTrackView;
