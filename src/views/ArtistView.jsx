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

const ArtistView = () => {
  const { id } = useParams();
  if (!id || id === "undefined") {
    return <div>Invalid artist ID</div>;
  }
  const {
    isPlaying,
    currentTrack,
    currentArtist,
    playOrPauseThisSong,
    playFromFirst,
  } = useSong();

  const [artistData, setArtistData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchArtistData = async () => {
      if (!id || id === "undefined") return;

      setLoading(true);
      try {
        const artist = await musicApi.getArtistWithTopTracks(id, 10);

        setArtistData({
          name: artist.name,
          albumCover: artist.picture_medium || artist.picture,
          nb_fan: artist.nb_fan,
          tracks: artist.top_tracks.map((t, index) => ({
            ...t,
            name: t.title,
            id: index + 1,
            lyrics: false,
          })),
        });
      } catch (err) {
        console.error("Failed to fetch artist with top tracks:", err);
        setError("Failed to load artist data.");
      } finally {
        setLoading(false);
      }
    };

    fetchArtistData();
  }, [id]);

  const playFunc = () => {
    if (currentTrack) {
      playOrPauseThisSong(currentArtist, currentTrack);
      return;
    }
    playFromFirst();
  };

  if (loading) return <div className="text-white p-8">Loading artist...</div>;
  if (error) return <div className="text-red-500 p-8">{error}</div>;
  if (!artistData) return null;

  return (
    <>
      <div id="HeaderSection" className="max-w-[1500px] mx-auto">
        <div className="flex items-center w-full relative h-full px-8 mt-6 min-w-[650px]">
          <img
            width="175"
            className="rounded-full"
            src={artistData.albumCover}
            alt={artistData.name}
          />

          <div className="ml-8">
            <div className="text-white text-3xl w-full hover:underline cursor-pointer font-semibold">
              {artistData.name}
            </div>

            <div className="text-[#bfbfbf] text-[12px] py-1.5 font-light">
              {artistData.nb_fan
                ? `${artistData.nb_fan.toLocaleString()} fans`
                : "Unknown fans"}
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
              {/* Keep the original wrapper styles; swap icon for FavouriteButton */}
              <FavouriteButton
                type="artist"
                id={id}
                title={artistData.name}
                image={artistData.albumCover}
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

        <div className="mt-11"></div>
        <div className="flex justify-between pt-2 min-w-[650px]">
          <ul className="flex items-center justify-start w-full text-gray-400 h-9">
            <li className="pl-8">
              <button className="font-light cursor-pointer text-[#bebebe] border-b-2 border-b-[#121216] hover:border-b-[#FFFFFF] pb-[8px] hover:text-[#FFFFFF]">
                Discography
              </button>
            </li>
            <li className="text-[#FFFFFF] pl-10">
              <button className="font-semibold cursor-pointer border-b-2 border-b-[#EF5465] pb-[8px]">
                Top tracks
              </button>
            </li>
            <li className="pl-10">
              <button className="font-light cursor-pointer text-[#bebebe] border-b-2 border-b-[#121216] hover:border-b-[#FFFFFF] pb-[8px] hover:text-[#FFFFFF]">
                Similar artists
              </button>
            </li>
            <li className="pl-10">
              <button className="font-light cursor-pointer text-[#bebebe] border-b-2 border-b-[#121216] hover:border-b-[#FFFFFF] pb-[8px] hover:text-[#FFFFFF]">
                Playlists
              </button>
            </li>
            <li className="pl-10">
              <button className="font-light cursor-pointer text-[#bebebe] border-b-2 border-b-[#121216] hover:border-b-[#FFFFFF] pb-[8px] hover:text-[#FFFFFF]">
                Bio
              </button>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-b border-b-[#302d2d]"></div>
      <div className="mb-10"></div>

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
          {artistData.tracks.map(
            (track) =>
              track && (
                <SongRow key={track.id} track={track} artistData={artistData} />
              )
          )}
        </ul>
      </div>

      <div className="mb-40"></div>
    </>
  );
};

export default ArtistView;
