import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { MdPlayArrow, MdSearch } from "react-icons/md";
import * as searchApi from "../api/search.js";
import { useSong } from "../context/SongContext.jsx";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { playOrPauseThisSong } = useSong();

  useEffect(() => {
    if (!query.trim()) {
      setResults(null);
      return;
    }

    const performSearch = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const searchResults = await searchApi.search(query, {
          limit: 50,
          order: searchApi.SEARCH_ORDERS.RANKING,
        });
        setResults(searchResults);
      } catch (error) {
        console.error("Search error:", error);
        setError("Failed to search. Please try again.");
        setResults(null);
      } finally {
        setIsLoading(false);
      }
    };

    performSearch();
  }, [query]);

  const handlePlayTrack = (track, event) => {
    event.preventDefault();
    event.stopPropagation();
    track.path = track.preview;

    const artistData = {
      name: track.artist.name,
      tracks: [track],
    };

    playOrPauseThisSong(artistData, track);
  };

  const renderResultItem = (item) => {
    switch (item.type) {
      case "track":
        return (
          <div
            key={item.id}
            className="flex items-center justify-between px-6 py-3 border-b border-b-[#FFFFFF33] hover:bg-[#0ea5e9] hover:text-white rounded-md transition-all"
          >
            <Link
              to={item.artist?.id ? `/artist/${item.artist.id}` : "#"}
              className="flex items-center flex-1 min-w-0"
            >
              <img
                src={item.album.cover_small}
                alt={item.title}
                className="w-12 h-12 rounded mr-4 flex-shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="text-white font-semibold truncate">
                  {item.title}
                </div>
                <div className="text-[#f0f0f0b3] text-sm truncate">
                  {item.artist.name} • {item.album.title}
                </div>
              </div>
            </Link>
            <button
              onClick={(e) => handlePlayTrack(item, e)}
              className="ml-4 p-2.5 rounded-full bg-[#FFFFFF] hover:scale-105 transition-transform"
              title="Play"
            >
              <MdPlayArrow size={20} className="text-[#0ea5e9]" />
            </button>
          </div>
        );

      case "artist":
        return (
          <Link
            key={item.id}
            to={`/artist/${item.id}`}
            className="flex items-center px-6 py-3 border-b border-b-[#FFFFFF33] hover:bg-[#0ea5e9] hover:text-white rounded-md transition-all"
          >
            <img
              src={item.picture_small}
              alt={item.name}
              className="w-12 h-12 rounded-full mr-4 flex-shrink-0"
            />
            <div className="min-w-0 flex-1">
              <div className="text-white font-semibold truncate">
                {item.name}
              </div>
              <div className="text-[#f0f0f0b3] text-sm">Artist</div>
            </div>
          </Link>
        );

      case "album":
        return (
          <Link
            key={item.id}
            to={`/album/${item.id}`}
            className="flex items-center px-6 py-3 border-b border-b-[#FFFFFF33] hover:bg-[#0ea5e9] hover:text-white rounded-md transition-all"
          >
            <img
              src={item.cover_small}
              alt={item.title}
              className="w-12 h-12 rounded mr-4 flex-shrink-0"
            />
            <div className="min-w-0 flex-1">
              <div className="text-white font-semibold truncate">
                {item.title}
              </div>
              <div className="text-[#f0f0f0b3] text-sm truncate">
                {item.artist.name} • Album
              </div>
            </div>
          </Link>
        );

      case "playlist":
        return (
          <div
            key={item.id}
            className="flex items-center px-6 py-3 border-b border-b-[#FFFFFF33] hover:bg-[#0ea5e9] hover:text-white rounded-md transition-all"
          >
            <img
              src={item.picture_small}
              alt={item.title}
              className="w-12 h-12 rounded mr-4 flex-shrink-0"
            />
            <div className="min-w-0 flex-1">
              <div className="text-white font-semibold truncate">
                {item.title}
              </div>
              <div className="text-[#f0f0f0b3] text-sm truncate">
                Playlist • {item.nb_tracks} tracks
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <div className="max-w-[1500px] mx-auto mt-6 px-8 min-w-[650px]">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-white text-3xl font-semibold mb-2">
              Search Results
            </div>
            {query && (
              <div className="text-[#d8d5d5] text-[12px] font-light">
                Showing results for "{query}"
              </div>
            )}
          </div>

          <div className="flex items-center border border-[#FFFFFF] bg-[#0ea5e9] rounded-sm text-[#ffffff] w-[300px]">
            <MdSearch className="text-[#ffffff] px-1" size={24} />
            <input
              className="w-full py-[5px] bg-[#0ea5e9] text-sm placeholder-[#FFFFFF] outline-none ring-0 hover:ring-0"
              type="text"
              value={query}
              readOnly
              placeholder="Search..."
            />
          </div>
        </div>
      </div>

      <div className="mb-6"></div>

      <div
        id="SearchSection"
        className="max-w-[1500px] mx-auto max-h-[calc(100vh-200px)]"
      >
        {isLoading && (
          <div className="flex items-center justify-center py-16 text-white">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white"></div>
            <span className="ml-4 text-lg">Searching...</span>
          </div>
        )}

        {error && (
          <div className="text-center py-16 text-red-400 text-xl">{error}</div>
        )}

        {!isLoading && !error && results && results.data?.length > 0 && (
          <>
            <div className="flex items-center justify-between min-w-[590px] mx-8 border-b border-b-[#FFFFFF] py-2.5 px-1.5">
              <div className="text-xs font-light text-[#ffffff]">RESULTS</div>
            </div>

            <ul className="w-full mx-8 pr-16 min-w-[650px] mt-4 space-y-2">
              {results.data.map((item) => renderResultItem(item))}
            </ul>

            {results.total > results.data.length && (
              <div className="text-center mt-8 text-[#d8d5d5] text-sm">
                Showing {results.data.length} of {results.total} results
              </div>
            )}
          </>
        )}

        {results && results.data?.length === 0 && !isLoading && (
          <div className="text-center py-16 text-[#d8d5d5]">
            No results found for "{query}"
          </div>
        )}
      </div>

      <div className="mb-40"></div>
    </>
  );
};

export default SearchResults;
