const DEEZER_API_BASE = "/api/deezer";

export { DEEZER_API_BASE };

// Simple in-memory cache // can be replaced with more robust caching if needed
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Helper function to fetch and cache API responses
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
    if (data.error) {
      throw new Error(data.error.message || "API Error");
    }
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
  normalizeDeezerPodcast,
  normalizeDeezerGenre,
  normalizeTopChartTrack,
  normalizeTopChartArtist,
  normalizeTopChartAlbum,
  normalizeTopChartPlaylist,
  normalizeTopChartPodcast,
  getTopGenres,
  getTopGenresFromTracks,
};

const normalizeDeezerTrack = (track) => ({
  id: track.id,
  title: track.title,
  track_link: track.link, // Link to track page
  artist: track.artist?.name,
  artistId: track.artist?.id, // Include artist ID for navigation
  artist_link: track.artist?.link, // Link to artist page
  artist_picture: track.artist?.picture_medium, // Artist picture
  album: track.album?.title,
  albumId: track.album?.id, // Include album ID for navigation
  album_link: track.album?.link, // Link to album page
  picture: track.album?.cover_medium, // Album cover as picture
  cover: track.album?.cover_medium,
  duration: track.duration,
  position: track.track_position, // Position in album
  rank: track.rank,
  path: track.preview, // 30s preview audio URL
  release_date: track.release_date || track.album?.release_date,
});

const normalizeTopChartTrack = (track) => ({
  id: track.id,
  title: track.title,
  link: track.link, // Link to track page
  artist: track.artist?.name,
  album: track.album?.title,
  duration: track.duration,
  rank: track.rank,
  position: track.position, // Position in charts
  path: track.preview, // 30s preview audio URL
});

const normalizeDeezerAlbum = (album) => ({
  id: album.id,
  title: album.title,
  artist: {
    id: album.artist?.id,
    name: album.artist?.name,
    picture: album.artist?.picture_medium,
  },
  cover: {
    small: album.cover_small,
    medium: album.cover_medium,
    large: album.cover_big,
    xl: album.cover_xl,
  },
  genre: album.genres?.data?.[0]?.name || null,
  label: album.label,
  releaseDate: album.release_date,
  totalTracks: album.nb_tracks,
  duration: album.duration,
  fans: album.fans,
  explicit: album.explicit_lyrics,
  link: album.link,
  tracks:
    album.tracks?.data?.map((track) => ({
      id: track.id,
      title: track.title,
      duration: track.duration,
      preview: track.preview,
      link: track.link,
      explicit: track.explicit_lyrics,
      rank: track.rank,
      artist: {
        id: track.artist?.id,
        name: track.artist?.name,
      },
    })) || [],
});

const normalizeTopChartAlbum = (album) => ({
  id: album.id,
  title: album.title,
  link: album.link, // Link to album page
  duration: album.duration,
  cover: album.cover_medium,
  position: album.position, // Position in charts
  artist: album.artist.name,
});

const normalizeDeezerArtist = (artist) => ({
  id: artist.id,
  name: artist.name,
  link: artist.link,
  picture: artist.picture_medium,
  nb_fan: artist.nb_fan,
  nb_albums: artist.nb_album,
  position: artist.position,
  top_tracks: artist.tracks
    ? artist.tracks.data.map(normalizeDeezerTrack) // use your track normalizer
    : [],
});

const normalizeTopChartArtist = (artist) => ({
  id: artist.id,
  name: artist.name,
  link: artist.link, // Link to artist page
  picture: artist.picture_medium,
  position: artist.position, // Position in charts
});

const normalizeDeezerPlaylist = (playlist) => ({
  id: playlist.id,
  title: playlist.title,
  description: playlist.description,
  duration: playlist.duration,
  public: playlist.public,
  is_loved_track: playlist.is_loved_track,
  fans: playlist.fans,
  playlist_link: playlist.link,
  cover: playlist.picture_medium || playlist.picture || playlist.picture_small,
  nb_tracks: playlist.nb_tracks,
  position: playlist.position || null,
  checksum: playlist.checksum,
  creator: {
    id: playlist.user?.id,
    name: playlist.user?.name,
  },
  tracks: playlist.tracks?.data?.map(normalizeDeezerTrack) || [],
  share: playlist.share,
  creation_date: playlist.creation_date,
  mod_date: playlist.mod_date,
});

const normalizeTopChartPlaylist = (playlist) => ({
  id: playlist.id,
  title: playlist.title,
  link: playlist.link,
  cover_small: playlist.picture_small,
  cover_medium: playlist.picture_medium,
  cover_big: playlist.picture_big,
  cover_xl: playlist.picture_xl,
  position: playlist.position, // Position in charts
  public: playlist.public,
  creator: {
    id: playlist.user.id,
    name: playlist.user.name,
  },
});

const normalizeDeezerPodcast = (podcast) => ({
  id: podcast.id,
  title: podcast.title,
  description: podcast.description,
  cover: podcast.picture_medium || podcast.picture || podcast.picture_small,
  link: podcast.link, // Link to podcast page
  fans: podcast.fans,
  position: podcast.position,
  available_podcasts: true,
});

const normalizeTopChartPodcast = (podcast) => ({
  id: podcast.id,
  title: podcast.title,
  description: podcast.description,
  cover: podcast.picture_medium || podcast.picture || podcast.picture_small,
  link: podcast.link, // Link to podcast page
  fans: podcast.fans,
  position: podcast.position, // Position in charts
  available_podcasts: true,
});

//1️⃣ Use the /chart endpoint and infer top genres
//The /chart endpoint includes tracks, albums, artists, and podcasts, and each of those has a genre_id. You can:
const normalizeDeezerGenre = (genre) => ({
  id: genre.id,
  name: genre.name,
  picture: genre.picture_medium || genre.picture || genre.picture_small,
});

// API functions to fetch data from Deezer API //
// Please chatGPT, do not remove this comment but continue from here and edit or add new functions as needed based on the above normalization functions //

export const getTrack = async (trackId) => {
  const data = await fetchJson(`${DEEZER_API_BASE}/track/${trackId}`);
  return normalizeDeezerTrack(data);
};

export const getArtistTopTracks = async (artistId) => {
  const data = await fetchJson(`${DEEZER_API_BASE}/artist/${artistId}/top`);
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

// Fetch top genres from Deezer
const getTopGenres = async () => {
  const data = await fetchJson(`${DEEZER_API_BASE}/chart/0/genres`);
  return data.data.map(normalizeDeezerGenre);
};

const getTopGenresFromTracks = async () => {
  const chartData = await getChart();
  const genreMap = new Map();

  chartData.tracks.forEach((track) => {
    const genreId = track.genre_id;
    if (genreId && !genreMap.has(genreId)) {
      genreMap.set(genreId, { id: genreId, name: track.genre_name });
    }
  });

  return Array.from(genreMap.values());
};

export const searchTracks = async (query) => {
  const data = await fetchJson(
    `${DEEZER_API_BASE}/search/?q=${encodeURIComponent(query)}`
  );
  return data.data.map(normalizeDeezerTrack);
};

export const searchArtists = async (query) => {
  const data = await fetchJson(
    `${DEEZER_API_BASE}/search/artist/?q=${encodeURIComponent(query)}`
  );
  return data.data.map(normalizeDeezerArtist);
};
