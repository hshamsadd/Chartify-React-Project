import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { MdPlayArrow, MdPerson, MdAlbum, MdQueueMusic } from "react-icons/md";
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

    const artistData = {
      name: track.artist.name,
      tracks: [track],
    };

    playOrPauseThisSong(artistData, track);
  };

  const renderResultItem = (item) => {
    const type = item.type;

    switch (type) {
      case "track":
        return (
          <div
            key={item.id}
            className="flex items-center justify-between p-4 hover:bg-[#2a2a2a] rounded-lg transition-colors group"
          >
            <Link
              to={`/artist/${item.artist.id}`}
              className="flex items-center flex-1 min-w-0"
            >
              <img
                src={item.album.cover_small}
                alt={item.title}
                className="w-12 h-12 rounded mr-4 flex-shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="text-white text-lg font-medium truncate">
                  {item.title}
                </div>
                <div className="text-gray-400 text-sm truncate">
                  {item.artist.name} • {item.album.title}
                </div>
              </div>
            </Link>
            <button
              onClick={(e) => handlePlayTrack(item, e)}
              className="ml-4 p-3 rounded-full bg-green-500 hover:bg-green-600 transition-colors"
              title="Play"
            >
              <MdPlayArrow size={16} className="text-white" />
            </button>
          </div>
        );

      case "artist":
        return (
          <Link
            key={item.id}
            to={`/artist/${item.id}`}
            className="flex items-center p-4 hover:bg-[#2a2a2a] rounded-lg transition-colors"
          >
            <img
              src={item.picture_small}
              alt={item.name}
              className="w-12 h-12 rounded-full mr-4 flex-shrink-0"
            />
            <div className="min-w-0 flex-1">
              <div className="text-white text-lg font-medium truncate">
                {item.name}
              </div>
              <div className="text-gray-400 text-sm">Artist</div>
            </div>
          </Link>
        );

      case "album":
        return (
          <div
            key={item.id}
            className="flex items-center p-4 hover:bg-[#2a2a2a] rounded-lg transition-colors"
          >
            <img
              src={item.cover_small}
              alt={item.title}
              className="w-12 h-12 rounded mr-4 flex-shrink-0"
            />
            <div className="min-w-0 flex-1">
              <div className="text-white text-lg font-medium truncate">
                {item.title}
              </div>
              <div className="text-gray-400 text-sm truncate">
                {item.artist.name} • Album
              </div>
            </div>
          </div>
        );

      case "playlist":
        return (
          <div
            key={item.id}
            className="flex items-center p-4 hover:bg-[#2a2a2a] rounded-lg transition-colors"
          >
            <img
              src={item.picture_small}
              alt={item.title}
              className="w-12 h-12 rounded mr-4 flex-shrink-0"
            />
            <div className="min-w-0 flex-1">
              <div className="text-white text-lg font-medium truncate">
                {item.title}
              </div>
              <div className="text-gray-400 text-sm truncate">
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
    <div className="min-h-screen bg-[#121216] text-white">
      <div className="max-w-4xl mx-auto px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Search Results</h1>
          {query && (
            <p className="text-gray-400 text-lg">
              Showing results for "{query}"
            </p>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            <span className="ml-4 text-xl">Searching...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-16">
            <div className="text-red-400 text-xl mb-4">{error}</div>
            <Link
              to="/"
              className="text-blue-400 hover:text-blue-300 underline"
            >
              Go back to home
            </Link>
          </div>
        )}

        {/* No Query State */}
        {!query && !isLoading && (
          <div className="text-center py-16">
            <div className="text-gray-400 text-xl mb-4">
              Enter a search term to find music
            </div>
            <Link
              to="/"
              className="text-blue-400 hover:text-blue-300 underline"
            >
              Go back to home
            </Link>
          </div>
        )}

        {/* Results */}
        {results && results.data && results.data.length > 0 && (
          <div>
            <div className="mb-6">
              <span className="text-gray-400">
                {results.total} results found
              </span>
            </div>

            <div className="space-y-2">
              {results.data.map((item) => renderResultItem(item))}
            </div>

            {results.total > results.data.length && (
              <div className="text-center mt-8">
                <div className="text-gray-400">
                  Showing {results.data.length} of {results.total} results
                </div>
              </div>
            )}
          </div>
        )}

        {/* No Results */}
        {results && results.data && results.data.length === 0 && !isLoading && (
          <div className="text-center py-16">
            <div className="text-gray-400 text-xl mb-4">
              No results found for "{query}"
            </div>
            <div className="text-gray-500 mb-6">
              Try searching for artists, songs, albums, or playlists
            </div>
            <Link
              to="/"
              className="text-blue-400 hover:text-blue-300 underline"
            >
              Go back to home
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
