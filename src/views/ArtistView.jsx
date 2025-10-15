import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import SongRow from "../components/SongRow.jsx";
import { MdSearch, MdPlayArrow, MdPause, MdSchedule } from "react-icons/md";
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
      <div className="max-w-[1500px] mx-auto mt-6 px-8 min-w-[650px] flex items-center">
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

          <div className="text-[#d8d5d5] text-[12px] py-1.5 font-light">
            {artistData.nb_fan
              ? `${artistData.nb_fan.toLocaleString()} fans`
              : "Unknown fans"}
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
              type="artist"
              id={id}
              title={artistData.name}
              image={artistData.albumCover}
              size={20}
              className="rounded-full p-2 border border-[#ffffff] hover:bg-[#ffffff]"
              activeClassName="text-[#0ea5e9] bg-[#ffffff] border-0 hover:bg-[#ffffff]"
              inactiveClassName="[&>svg]:fill-none [&>svg]:stroke-[#0ea5e9] [&>svg]:stroke-[1.5] hover:text-[#0ea5e9]"
            />
          </div>
        </div>
      </div>

      <div className="mb-10"></div>

      <div className="max-w-[1500px] mx-auto px-8 min-w-[650px]">
        <ul className="flex items-center justify-start w-full text-[#ffffff] h-9 border-b border-b-[#ffffff] pb-[8px]">
          <li className="pr-10">
            <button className="font-light cursor-pointer text-[#ceccccb3] hover:text-[#ffffff] border-b-2 border-b-transparent hover:border-b-[#ffffff]">
              Discogs
            </button>
          </li>
          <li className="pr-10">
            <button className="font-semibold cursor-pointer text-[#ffffff] border-b-2 border-b-[#ffffff]">
              Top hits
            </button>
          </li>
          <li className="pr-10">
            <button className="font-light cursor-pointer text-[#ceccccb3] hover:text-[#ffffff] border-b-2 border-b-transparent hover:border-b-[#ffffff]">
              Similar artists
            </button>
          </li>
          <li className="pr-10">
            <button className="font-light cursor-pointer text-[#ceccccb3] hover:text-[#ffffff] border-b-2 border-b-transparent hover:border-b-[#ffffff]">
              Playlists
            </button>
          </li>
          <li className="pr-10">
            <button className="font-light cursor-pointer text-[#ceccccb3] hover:text-[#ffffff] border-b-2 border-b-transparent hover:border-b-[#ffffff]">
              Bio
            </button>
          </li>
        </ul>
      </div>

      <div className="mb-10"></div>

      <div
        id="SongsSection"
        className="max-w-[1500px] mx-auto max-h-[calc(100vh-200px)]"
      >
        <div className="pl-8">
          <div className="text-white text-3xl font-semibold mb-7">
            Top tracks
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
