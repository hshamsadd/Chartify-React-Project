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
import artist from "../artist.json";
import { useSong } from "../context/SongContext.jsx";
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

  const [artistData, setArtistData] = useState(artist);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtistData = async () => {
      try {
        if (id) {
          // Fetch specific artist by ID
          console.log("ArtistView: Fetching artist by ID:", id);
          const artistDetails = await musicApi.getArtist(id);
          const topTracks = await musicApi.getArtistTopTracks(id);
          console.log("ArtistView: Artist details:", artistDetails);
          console.log("ArtistView: Top tracks:", topTracks);
          setArtistData({
            name: artistDetails.name,
            albumCover: artistDetails.picture_medium || artistDetails.picture,
            nb_fan: artistDetails.nb_fan,
            tracks: topTracks.map((t, index) => ({
              ...t,
              name: t.title,
              id: index + 1,
              lyrics: false,
            })),
          });
          console.log("ArtistView: Set specific artist data successfully");
        } else {
          // No ID provided, show top artist from chart
          console.log(
            "ArtistView: No artist ID provided, using top artist from chart"
          );
          const chartData = await musicApi.getChart();
          if (chartData.artists && chartData.artists.length > 0) {
            const topArtist = chartData.artists[0];
            console.log("ArtistView: Using top artist from chart:", topArtist);
            const topTracks = await musicApi.getArtistTopTracks(
              topArtist.id,
              20
            );
            console.log("ArtistView: Top tracks:", topTracks);
            setArtistData({
              name: topArtist.name,
              albumCover: topArtist.picture_medium || topArtist.picture,
              nb_fan: topArtist.nb_fan,
              tracks: topTracks.map((t, index) => ({
                ...t,
                name: t.title,
                id: index + 1,
                lyrics: false,
              })),
            });
            console.log("ArtistView: Set dynamic artist data successfully");
          } else {
            // Fallback to static data
            console.log("ArtistView: No chart data, using static fallback");
          }
        }
      } catch (error) {
        console.error("ArtistView: Failed to fetch artist data:", error);
        // Keep static fallback
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
                : "167,026 fans"}
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
