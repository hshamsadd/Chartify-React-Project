import React, { useState, useEffect, useMemo } from "react";
import MixesInspiredBy from "../components/MixesInspiredBy.jsx";
import MultiArtistSelect from "../components/MultiArtistSelect.jsx";
import CustomCarousel from "../components/CustomCarousel.jsx";
import Highlights from "../components/Highlights.jsx";
import { getChart } from "../api/music.js";

const HomeView = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChart = async () => {
      try {
        const data = await getChart();
        setChartData(data);
      } catch (err) {
        console.error("Failed to fetch chart:", err);
        setError("Failed to load chart data");
      } finally {
        setLoading(false);
      }
    };

    fetchChart();
  }, []);

  // const mapTrackToSlide = (track) => ({
  //   url: track.cover,
  //   song: track.title,
  //   by: track.artist,
  //   releasedOn: track.release_date || "Unknown",
  //   track: track, // Include full track data for playing
  // });

  const mapPlaylistCard = (playlist) => ({
    url: playlist.cover_medium,
    title: playlist.title,
    creator: playlist.creator?.name,
    link: playlist.link,
  });

  const popularPlaylistData = useMemo(
    () => chartData?.playlists?.slice(0, 10).map(mapPlaylistCard) || [],
    [chartData]
  );

  const newReleasesData = useMemo(
    () => chartData?.tracks?.slice(0, 4).map(mapTrackToSlide) || [],
    [chartData]
  );

  const newReleasesData2 = useMemo(
    () => chartData?.tracks?.slice(8, 10).map(mapTrackToSlide) || [],
    [chartData]
  );

  const mixesInspiredByData = useMemo(
    () =>
      chartData?.artists?.slice(0, 6).map((artist) => ({
        text: `Mix inspired by ${artist.name}`,
        by: artist.name,
        to: `/artist/${artist.id}`,
        image: artist.picture_medium || artist.picture,
      })) || [],
    [chartData]
  );

  const highlightsData = useMemo(
    () =>
      chartData?.tracks?.slice(0, 2).map((track) => ({
        by: track.artist,
        song: track.title,
        image: track.cover,
      })) || [],
    [chartData]
  );

  const playlistsData = useMemo(
    () =>
      chartData?.artists
        ? [
            {
              category: "daily",
              text: `Featuring ${chartData.artists
                .slice(0, 4)
                .map((a) => a.name)
                .join(", ")}`,
              to: "/artist",
              images: {
                one:
                  chartData.artists[0]?.picture_medium ||
                  "https://picsum.photos/id/45/300/300",
                two:
                  chartData.artists[1]?.picture_medium ||
                  "https://picsum.photos/id/55/300/300",
                three:
                  chartData.artists[2]?.picture_medium ||
                  "https://picsum.photos/id/54/300/300",
                four:
                  chartData.artists[3]?.picture_medium ||
                  "https://picsum.photos/id/76/300/300",
              },
            },
            {
              category: "daily",
              text: `Featuring ${chartData.artists
                .slice(4, 8)
                .map((a) => a.name)
                .join(", ")}`,
              to: "/artist",
              images: {
                one:
                  chartData.artists[4]?.picture_medium ||
                  "https://picsum.photos/id/123/300/300",
                two:
                  chartData.artists[5]?.picture_medium ||
                  "https://picsum.photos/id/141/300/300",
                three:
                  chartData.artists[6]?.picture_medium ||
                  "https://picsum.photos/id/111/300/300",
                four:
                  chartData.artists[7]?.picture_medium ||
                  "https://picsum.photos/id/212/300/300",
              },
            },
            {
              category: "daily",
              text: `Featuring ${chartData.artists
                .slice(8, 12)
                .map((a) => a.name)
                .join(", ")}`,
              to: "/artist",
              images: {
                one:
                  chartData.artists[8]?.picture_medium ||
                  "https://picsum.photos/id/65/300/300",
                two:
                  chartData.artists[9]?.picture_medium ||
                  "https://picsum.photos/id/98/300/300",
                three:
                  chartData.artists[10]?.picture_medium ||
                  "https://picsum.photos/id/78/300/300",
                four:
                  chartData.artists[11]?.picture_medium ||
                  "https://picsum.photos/id/74/300/300",
              },
            },
            {
              category: "daily",
              text: `Featuring ${chartData.artists
                .slice(12, 16)
                .map((a) => a.name)
                .join(", ")}`,
              to: "/artist",
              images: {
                one:
                  chartData.artists[12]?.picture_medium ||
                  "https://picsum.photos/id/242/300/300",
                two:
                  chartData.artists[13]?.picture_medium ||
                  "https://picsum.photos/id/121/300/300",
                three:
                  chartData.artists[14]?.picture_medium ||
                  "https://picsum.photos/id/221/300/300",
                four:
                  chartData.artists[15]?.picture_medium ||
                  "https://picsum.photos/id/188/300/300",
              },
            },
          ]
        : [],
    [chartData]
  );

  const circularArtistsData =
    chartData?.artists
      ?.slice(0, 5)
      .map((artist) => artist.picture_medium || artist.picture) || [];

  return (
    <div className="max-w-[1500px] mx-auto">
      <div className="px-8 mt-8 min-w-[800px] w-full">
        <div className="text-white text-xl font-semibold inline-block">
          Mixes inspired by...
          <div className="text-sm font-light text-[#A2A2AD]">
            Discover new tracks similar to your favourites
          </div>
        </div>

        <div className="py-3"></div>

        <div className="flex justify-between w-full gap-8">
          <div className="xl:w-1/3 w-1/2">
            {mixesInspiredByData.slice(0, 3).map((mix, index) => (
              <MixesInspiredBy
                key={index}
                className="pb-1.5"
                text={mix.text}
                by={mix.by}
                to={mix.to}
                image={mix.image}
              />
            ))}
          </div>
          <div className="xl:w-1/3 w-1/2">
            {mixesInspiredByData.slice(3, 6).map((mix, index) => (
              <MixesInspiredBy
                key={index + 3}
                className="pb-1.5"
                text={mix.text}
                by={mix.by}
                to={mix.to}
                image={mix.image}
              />
            ))}
          </div>
          <div className="xl:block hidden xl:w-1/3">
            {/* Can add more dynamic mixes here if needed */}
          </div>
        </div>
      </div>

      <div className="px-8 mt-8 min-w-[800px]">
        <div className="text-white text-xl font-semibold inline-block">
          Made for you
        </div>

        <div className="py-3"></div>

        <div className="flex justify-start gap-7">
          {playlistsData.map((playlist, index) => (
            <MultiArtistSelect
              key={index}
              className="w-1/4"
              category={playlist.category}
              text={playlist.text}
              to={playlist.to}
              images={playlist.images}
            />
          ))}
        </div>
      </div>

      <div className="px-8 mt-8 min-w-[800px]">
        <div className="py-3"></div>

        <p className="text-center pb-6 text-[#D1D1D6] text-sm">
          Unlock Flow by selecting your favourite artists for improved
          recommendations.
        </p>

        <div className="flex justify-center gap-7 full">
          <div className="flex items-center justify-center relative">
            {circularArtistsData.map((image, index) => {
              const positions = [
                {
                  width: 100,
                  className:
                    "absolute -left-36 rounded-full z-0 cursor-pointer",
                },
                {
                  width: 115,
                  className:
                    "absolute -left-[80px] rounded-full z-10 cursor-pointer",
                },
                { width: 160, className: "rounded-full z-20 cursor-pointer" },
                {
                  width: 115,
                  className:
                    "absolute -right-[80px] rounded-full z-10 cursor-pointer",
                },
                {
                  width: 100,
                  className:
                    "absolute -right-36 rounded-full z-0 cursor-pointer",
                },
              ];
              const pos = positions[index] || positions[0];
              return (
                <img
                  key={index}
                  width={pos.width}
                  className={pos.className}
                  src={image}
                  alt={`Artist ${index + 1}`}
                />
              );
            })}
          </div>
        </div>
        <div className="w-full flex justify-center p-3">
          <button
            type="button"
            className="text-white text-[15px] font-semibold rounded-full bg-[#EF5465] hover:bg-[#d8384a] px-8 py-2 text-center"
          >
            ADD ARTISTS
          </button>
        </div>
      </div>

      <div className="mt-8 min-w-[800px]">
        <CustomCarousel
          category="New releases for you"
          data={newReleasesData}
        />
      </div>

      <div className="px-8 mt-8 min-w-[800px]">
        <div className="text-white text-xl font-semibold inline-block">
          Highlights
        </div>

        <div className="py-3"></div>

        <div className="flex items-center gap-8">
          {highlightsData.map((highlight, index) => (
            <div key={index} className="rounded-lg w-1/2">
              <Highlights
                by={highlight.by}
                song={highlight.song}
                image={highlight.image}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 min-w-[800px]">
        <CustomCarousel
          category="Popular playlist"
          data={popularPlaylistData}
        />
      </div>

      <div className="px-8 mt-8 min-w-[800px]">
        <div className="text-white text-xl font-semibold inline-block">
          Highlights
        </div>

        <div className="py-3"></div>

        <div className="flex items-center gap-8">
          {highlightsData.map((highlight, index) => (
            <div key={index} className="rounded-lg w-1/2">
              <Highlights
                by={highlight.by}
                song={highlight.song}
                image={highlight.image}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 min-w-[800px]">
        <CustomCarousel
          category="New releases for you"
          data={newReleasesData2}
        />
      </div>

      <div className="pb-40"></div>
    </div>
  );
};

export default HomeView;
