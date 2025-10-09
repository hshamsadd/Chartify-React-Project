const DEEZER_API_BASE = "/api/deezer";

export { DEEZER_API_BASE };

// Simple in-memory cache
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const fetchJson = async (url) => {
  console.log("Fetching URL:", url);
  console.log("Full URL being fetched:", url);
  const cached = cache.get(url);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    console.log("Using cached data for:", url);
    return cached.data;
  }

  try {
    console.log("Making fetch request to:", url);
    const response = await fetch(url);
    console.log("Response received:", response);
    console.log("Response status:", response.status);
    console.log("Response headers:", response.headers);
    if (!response.ok) {
      console.error("Response not ok:", response.status, response.statusText);
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    const data = await response.json();
    console.log("Fetched data:", data);
    cache.set(url, { data, timestamp: Date.now() });
    return data;
  } catch (error) {
    console.error("API fetch error for", url, ":", error);
    throw error;
  }
};

export {
  fetchJson,
  normalizeDeezerTrack,
  normalizeDeezerArtist,
  normalizeDeezerAlbum,
  normalizeDeezerPlaylist,
};

const normalizeDeezerTrack = (track) => ({
  id: track.id,
  title: track.title,
  artist: track.artist.name,
  artistId: track.artist.id, // Include artist ID for navigation
  album: track.album.title,
  duration: track.duration,
  path: track.preview, // 30s preview
  cover: track.album.cover_medium,
  release_date: track.album.release_date,
});

const normalizeDeezerArtist = (artist) => ({
  id: artist.id,
  name: artist.name,
  picture: artist.picture_medium,
  nb_fan: artist.nb_fan,
});

const normalizeDeezerAlbum = (album) => ({
  id: album.id,
  title: album.title,
  artist: album.artist.name,
  cover: album.cover_medium,
  release_date: album.release_date,
});

const normalizeDeezerPlaylist = (playlist) => ({
  id: playlist.id,
  title: playlist.title,
  description: playlist.description,
  cover: playlist.picture_medium,
  creator: playlist.creator.name,
  nb_tracks: playlist.nb_tracks,
});

export const getTrack = async (trackId) => {
  const data = await fetchJson(`${DEEZER_API_BASE}/track/${trackId}`);
  return normalizeDeezerTrack(data);
};

export const getArtistTopTracks = async (artistId) => {
  const data = await fetchJson(`${DEEZER_API_BASE}/artist/${artistId}/top`);
  return data.data.map(normalizeDeezerTrack);
};

export const searchTracks = async (query) => {
  const data = await fetchJson(
    `${DEEZER_API_BASE}/search/?q=${encodeURIComponent(query)}`
  );
  return data.data.map(normalizeDeezerTrack);
};

export const getChart = async () => {
  const data = await fetchJson(`${DEEZER_API_BASE}/chart`);
  console.log("getChart: raw API response:", data);
  console.log("getChart: tracks data length:", data.tracks?.data?.length);
  return {
    tracks: data.tracks.data.map(normalizeDeezerTrack),
    artists: data.artists.data.map(normalizeDeezerArtist),
  };
};

export const getArtist = async (artistId) => {
  const data = await fetchJson(`${DEEZER_API_BASE}/artist/${artistId}`);
  return normalizeDeezerArtist(data);
};

export const searchArtists = async (query) => {
  const data = await fetchJson(
    `${DEEZER_API_BASE}/search/artist/?q=${encodeURIComponent(query)}`
  );
  return data.data.map(normalizeDeezerArtist);
};
