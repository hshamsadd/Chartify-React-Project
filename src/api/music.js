const DEEZER_API_BASE = "/api/deezer";

export { DEEZER_API_BASE };

// Simple in-memory cache
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const fetchJson = async (url) => {
  console.log("Fetching URL:", url);
  const cached = cache.get(url);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    console.log("Using cached data for:", url);
    return cached.data;
  }

  try {
    console.log("Making fetch request to:", url);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    const data = await response.json();
    if (data.error) throw new Error(data.error.message || "API Error");
    cache.set(url, { data, timestamp: Date.now() });
    return data;
  } catch (error) {
    console.error("API fetch error for", url, ":", error);
    throw error;
  }
};

// ---------------- Top Chart Normalizers ----------------
const normalizeTopChartTrack = (track) => ({
  type: "track",
  id: track.id,
  title: track.title,
  name: track.title, // add name so the player UI has a track.name
  link: track.link,
  duration: track.duration ?? null,
  rank: track.rank ?? null,
  position: track.position ?? null,
  path: track.preview || null,
  explicit: track.explicit_lyrics || false,
  cover:
    track.album?.cover_medium ||
    track.album?.cover ||
    track.album?.cover_big ||
    null,
  picture:
    track.album?.cover_medium ||
    track.album?.cover ||
    track.album?.cover_big ||
    null,
  album: track.album
    ? {
        id: track.album.id,
        title: track.album.title,
        link: track.album.link,
        cover:
          track.album.cover_medium ||
          track.album.cover ||
          track.album.cover_big ||
          null,
      }
    : null,
  artist: track.artist
    ? {
        id: track.artist.id,
        name: track.artist.name,
        link: track.artist.link,
        picture:
          track.artist.picture_medium ||
          track.artist.picture ||
          track.artist.picture_big ||
          null,
      }
    : null,
  release_date: track.release_date || null,
});

const normalizeTopChartAlbum = (album) => ({
  type: "album",
  id: album.id,
  title: album.title,
  link: album.link,
  duration: album.duration ?? null,
  cover:
    album.cover_medium ||
    album.cover ||
    album.cover_big ||
    album.cover_small ||
    null,
  picture:
    album.cover_medium ||
    album.cover ||
    album.cover_big ||
    album.cover_small ||
    null,
  position: album.position ?? null,
  artist: album.artist
    ? {
        id: album.artist.id,
        name: album.artist.name,
        link: album.artist.link,
        picture:
          album.artist.picture_medium ||
          album.artist.picture ||
          album.artist.picture_big ||
          null,
      }
    : null,
});

const normalizeTopChartArtist = (artist) => ({
  type: "artist",
  id: artist.id,
  name: artist.name,
  link: artist.link,
  picture:
    artist.picture_medium ||
    artist.picture ||
    artist.picture_big ||
    artist.picture_small ||
    null,
  position: artist.position ?? null,
});

const normalizeTopChartPlaylist = (playlist) => ({
  type: "playlist",
  id: playlist.id,
  title: playlist.title,
  link: playlist.link,
  cover:
    playlist.picture_medium ||
    playlist.picture ||
    playlist.picture_big ||
    playlist.picture_small ||
    null,
  picture:
    playlist.picture_medium ||
    playlist.picture ||
    playlist.picture_big ||
    playlist.picture_small ||
    null,
  position: playlist.position ?? null,
  public: !!playlist.public,
  creator: playlist.user
    ? {
        id: playlist.user.id,
        name: playlist.user.name,
      }
    : null,
});

const normalizeTopChartPodcast = (podcast) => ({
  type: "podcast",
  id: podcast.id,
  title: podcast.title,
  description: podcast.description || "",
  cover:
    podcast.picture_medium ||
    podcast.picture ||
    podcast.picture_big ||
    podcast.picture_small ||
    null,
  link: podcast.link,
  fans: podcast.fans ?? 0,
  position: podcast.position ?? null,
  available_podcasts: true,
});

// Normalizers for playlist/details payloads
const normalizeDeezerTrack = (track) => ({
  type: "track",
  id: track.id,
  title: track.title,
  artist: {
    id: track.artist?.id,
    name: track.artist?.name,
  },
  album: {
    id: track.album?.id,
    title: track.album?.title,
    cover_small: track.album?.cover_small,
    cover_medium: track.album?.cover_medium,
    cover_big: track.album?.cover_big,
    cover_xl: track.album?.cover_xl,
  },
  duration: track.duration,
  rank: track.rank,
  explicit: track.explicit_lyrics,
  preview: track.preview,
  path: track.preview, // used by the player
  cover: track.album?.cover_medium || track.artist?.picture_medium || null,
});

const normalizeDeezerPlaylist = (playlist) => ({
  type: "playlist",
  id: playlist.id,
  title: playlist.title,
  description: playlist.description || "",
  duration: playlist.duration ?? null,
  public: !!playlist.public,
  nb_tracks: playlist.nb_tracks ?? 0,
  link: playlist.link,
  cover:
    playlist.picture_medium ||
    playlist.picture ||
    playlist.picture_big ||
    playlist.picture_small ||
    null,
  creator: playlist.creator
    ? { id: playlist.creator.id, name: playlist.creator.name }
    : playlist.user
    ? { id: playlist.user.id, name: playlist.user.name }
    : null,
  tracks: playlist.tracks?.data?.map(normalizeDeezerTrack) || [],
});

// ---------------- Top Chart Fetchers ----------------

// Fetch the full chart using Top Chart normalizers
export const getChart = async () => {
  const data = await fetchJson(`${DEEZER_API_BASE}/chart`);
  return {
    tracks: data.tracks?.data?.map(normalizeTopChartTrack) || [],
    albums: data.albums?.data?.map(normalizeTopChartAlbum) || [],
    artists: data.artists?.data?.map(normalizeTopChartArtist) || [],
    playlists: data.playlists?.data?.map(normalizeTopChartPlaylist) || [],
    podcasts: data.podcasts?.data?.map(normalizeTopChartPodcast) || [],
  };
};

// Fetch only top tracks directly
export const getTopTracks = async (limit = 10) => {
  const data = await fetchJson(`${DEEZER_API_BASE}/chart`);
  if (!data?.tracks?.data) throw new Error("No top tracks found");
  return data.tracks.data.slice(0, limit).map(normalizeTopChartTrack);
};

// Fetch only top albums directly
export const getTopAlbums = async (limit = 10) => {
  const data = await fetchJson(`${DEEZER_API_BASE}/chart`);
  if (!data?.albums?.data) throw new Error("No top albums found");
  return data.albums.data.slice(0, limit).map(normalizeTopChartAlbum);
};

// Fetch only top artists directly
export const getTopArtists = async (limit = 10) => {
  const data = await fetchJson(`${DEEZER_API_BASE}/chart`);
  if (!data?.artists?.data) throw new Error("No top artists found");
  return data.artists.data.slice(0, limit).map(normalizeTopChartArtist);
};

// Fetch only top playlists directly
export const getTopPlaylists = async (limit = 10) => {
  const data = await fetchJson(`${DEEZER_API_BASE}/chart`);
  if (!data?.playlists?.data) throw new Error("No top playlists found");
  return data.playlists.data.slice(0, limit).map(normalizeTopChartPlaylist);
};

// Fetch only top podcasts directly
export const getTopPodcasts = async (limit = 10) => {
  const data = await fetchJson(`${DEEZER_API_BASE}/chart`);
  if (!data?.podcasts?.data) throw new Error("No top podcasts found");
  return data.podcasts.data.slice(0, limit).map(normalizeTopChartPodcast);
};

// Fetch playlist details by ID
export const getPlaylist = async (playlistId) => {
  if (!playlistId) throw new Error("Playlist ID is required");
  const data = await fetchJson(`${DEEZER_API_BASE}/playlist/${playlistId}`);
  return normalizeDeezerPlaylist(data);
};

// ---------------- Exports ----------------
export {
  fetchJson,
  normalizeTopChartTrack,
  normalizeTopChartArtist,
  normalizeTopChartAlbum,
  normalizeTopChartPlaylist,
  normalizeTopChartPodcast,
};
