import * as musicApi from "./music.js";
import { DEEZER_API_BASE } from "./music.js";

// Search types
export const SEARCH_TYPES = {
  ALL: "all",
  TRACK: "track",
  ARTIST: "artist",
  ALBUM: "album",
  PLAYLIST: "playlist",
};

// Search order options
export const SEARCH_ORDERS = {
  RANKING: "RANKING",
  TRACK_ASC: "TRACK_ASC",
  TRACK_DESC: "TRACK_DESC",
  ARTIST_ASC: "ARTIST_ASC",
  ARTIST_DESC: "ARTIST_DESC",
  ALBUM_ASC: "ALBUM_ASC",
  ALBUM_DESC: "ALBUM_DESC",
  RATING_ASC: "RATING_ASC",
  RATING_DESC: "RATING_DESC",
  DURATION_ASC: "DURATION_ASC",
  DURATION_DESC: "DURATION_DESC",
};

/**
 * General search function that searches across all content types
 * @param {string} query - Search query
 * @param {Object} options - Search options
 * @param {string} options.type - Search type (all, track, artist, album, playlist)
 * @param {boolean} options.strict - Enable strict mode
 * @param {string} options.order - Sort order
 * @param {number} options.limit - Number of results to return
 * @returns {Promise<Object>} Search results
 */
export const search = async (query, options = {}) => {
  const {
    type = SEARCH_TYPES.ALL,
    strict = false,
    order = SEARCH_ORDERS.RANKING,
    limit = 25,
  } = options;

  if (!query || query.trim().length === 0) {
    return { data: [] };
  }

  let searchQuery = query.trim();

  // Build the search URL
  let url = `${DEEZER_API_BASE}/search`;

  // Add query parameter
  url += `?q=${encodeURIComponent(searchQuery)}`;

  // Add strict parameter if enabled
  if (strict) {
    url += `&strict=on`;
  }

  // Add order parameter
  if (order !== SEARCH_ORDERS.RANKING) {
    url += `&order=${order}`;
  }

  // Add limit
  url += `&limit=${limit}`;

  try {
    const data = await musicApi.fetchJson(url);
    return data;
  } catch (error) {
    console.error("Search failed:", error);
    throw error;
  }
};

/**
 * Search for tracks specifically
 * @param {string} query - Search query
 * @param {Object} options - Search options
 * @returns {Promise<Array>} Array of normalized tracks
 */
export const searchTracks = async (query, options = {}) => {
  const data = await search(query, { ...options, type: SEARCH_TYPES.TRACK });
  return data.data.map(musicApi.normalizeDeezerTrack);
};

/**
 * Search for artists specifically
 * @param {string} query - Search query
 * @param {Object} options - Search options
 * @returns {Promise<Array>} Array of normalized artists
 */
export const searchArtists = async (query, options = {}) => {
  const data = await search(query, { ...options, type: SEARCH_TYPES.ARTIST });
  return data.data.map(musicApi.normalizeDeezerArtist);
};

/**
 * Search for albums specifically
 * @param {string} query - Search query
 * @param {Object} options - Search options
 * @returns {Promise<Array>} Array of normalized albums
 */
export const searchAlbums = async (query, options = {}) => {
  const data = await search(query, { ...options, type: SEARCH_TYPES.ALBUM });
  return data.data.map(normalizeDeezerAlbum);
};

/**
 * Search for playlists specifically
 * @param {string} query - Search query
 * @param {Object} options - Search options
 * @returns {Promise<Array>} Array of normalized playlists
 */
export const searchPlaylists = async (query, options = {}) => {
  const data = await search(query, { ...options, type: SEARCH_TYPES.PLAYLIST });
  return data.data.map(normalizeDeezerPlaylist);
};

/**
 * Advanced search with specific field targeting
 * @param {Object} criteria - Search criteria
 * @param {string} criteria.artist - Artist name
 * @param {string} criteria.album - Album title
 * @param {string} criteria.track - Track title
 * @param {string} criteria.label - Label name
 * @param {number} criteria.dur_min - Minimum duration in seconds
 * @param {number} criteria.dur_max - Maximum duration in seconds
 * @param {number} criteria.bpm_min - Minimum BPM
 * @param {number} criteria.bpm_max - Maximum BPM
 * @param {Object} options - Additional search options
 * @returns {Promise<Object>} Search results
 */
export const advancedSearch = async (criteria, options = {}) => {
  const queryParts = [];

  if (criteria.artist) {
    queryParts.push(`artist:"${criteria.artist}"`);
  }
  if (criteria.album) {
    queryParts.push(`album:"${criteria.album}"`);
  }
  if (criteria.track) {
    queryParts.push(`track:"${criteria.track}"`);
  }
  if (criteria.label) {
    queryParts.push(`label:"${criteria.label}"`);
  }
  if (criteria.dur_min) {
    queryParts.push(`dur_min:${criteria.dur_min}`);
  }
  if (criteria.dur_max) {
    queryParts.push(`dur_max:${criteria.dur_max}`);
  }
  if (criteria.bpm_min) {
    queryParts.push(`bpm_min:${criteria.bpm_min}`);
  }
  if (criteria.bpm_max) {
    queryParts.push(`bpm_max:${criteria.bpm_max}`);
  }

  if (queryParts.length === 0) {
    throw new Error("At least one search criterion must be provided");
  }

  const query = queryParts.join(" ");
  return search(query, options);
};

// Normalization functions for different content types
const normalizeDeezerAlbum = (album) => ({
  id: album.id,
  title: album.title,
  artist: album.artist.name,
  artistId: album.artist.id,
  cover: album.cover_medium,
  cover_small: album.cover_small,
  cover_big: album.cover_big,
  cover_xl: album.cover_xl,
  tracklist: album.tracklist,
  type: album.type,
});

const normalizeDeezerPlaylist = (playlist) => ({
  id: playlist.id,
  title: playlist.title,
  description: playlist.description,
  duration: playlist.duration,
  public: playlist.public,
  is_loved_track: playlist.is_loved_track,
  collaborative: playlist.collaborative,
  nb_tracks: playlist.nb_tracks,
  fans: playlist.fans,
  link: playlist.link,
  picture: playlist.picture_medium,
  picture_small: playlist.picture_small,
  picture_big: playlist.picture_big,
  picture_xl: playlist.picture_xl,
  checksum: playlist.checksum,
  creator: playlist.creator
    ? {
        id: playlist.creator.id,
        name: playlist.creator.name,
        tracklist: playlist.creator.tracklist,
        type: playlist.creator.type,
      }
    : null,
  type: playlist.type,
});
