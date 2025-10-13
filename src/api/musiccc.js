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

// ---------------- Normalizers ----------------

const normalizeDeezerTrack = (track) => ({
  id: track.id,
  title: track.title,
  track_link: track.link,
  artist: track.artist?.name,
  artistId: track.artist?.id,
  artist_link: track.artist?.link,
  artist_picture: track.artist?.picture_medium,
  album: track.album?.title,
  albumId: track.album?.id,
  album_link: track.album?.link,
  cover: track.album?.cover_medium,
  duration: track.duration,
  position: track.position,
  rank: track.rank,
  path: track.preview,
  release_date: track.release_date || track.album?.release_date,
});

const normalizeTopChartTrack = (track) => ({
  id: track.id,
  title: track.title,
  link: track.link,
  duration: track.duration,
  rank: track.rank,
  position: track.position,
  release_date: track.release_date || null,
  path: track.preview, // playback source
  explicit: track.explicit_lyrics || false,
  artist: {
    id: track.artist?.id,
    name: track.artist?.name,
    link: track.artist?.link,
    picture: track.artist?.picture_medium,
  },
  album: {
    id: track.album?.id,
    title: track.album?.title,
    link: track.album?.link,
    cover: track.album?.cover_medium,
  },
  cover: track.album?.cover_medium,
  picture: track.album?.cover_medium, // for SongRow compatibility
  // id: track.id,
  // title: track.title,
  // link: track.link,
  // artist: {
  //   id: track.artist?.id,
  //   name: track.artist?.name,
  //   link: track.artist?.link,
  //   picture: track.artist?.picture_medium,
  // },
  // album: track.album?.title,
  // albumId: track.album?.id,
  // album_link: track.album?.link,
  // cover: track.album?.cover_medium, // ✅ image for display
  // picture: track.album?.cover_medium, // ✅ backup for SongRow compatibility
  // duration: track.duration,
  // rank: track.rank,
  // position: track.position,
  // path: track.preview, // ✅ playback source
  // release_date: track.release_date || null,
});

const normalizeDeezerAlbum = (album) => ({
  id: album.id,
  title: album.title,
  link: album.link,
  duration: album.duration,
  totalTracks: album.nb_tracks,
  fans: album.fans,
  label: album.label,
  releaseDate: album.release_date,
  explicit: album.explicit_lyrics,
  genre: album.genres?.data?.[0]?.name || null,
  cover: {
    small: album.cover_small,
    medium: album.cover_medium,
    large: album.cover_big,
    xl: album.cover_xl,
  },
  artist: {
    id: album.artist?.id,
    name: album.artist?.name,
    picture: album.artist?.picture_medium,
  },
  tracks: album.tracks?.data?.map(normalizeTopChartTrack) || [],
});

const normalizeTopChartAlbum = (album) => ({
  id: album.id,
  title: album.title,
  link: album.link,
  duration: album.duration,
  cover: album.cover_medium,
  position: album.position,
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
  top_tracks: artist.tracks?.data?.map(normalizeDeezerTrack) || [],
});

const normalizeTopChartArtist = (artist) => ({
  id: artist.id,
  name: artist.name,
  link: artist.link,
  picture: artist.picture_medium,
  position: artist.position,
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
  position: playlist.position,
  public: playlist.public,
  creator: {
    id: playlist.user?.id,
    name: playlist.user?.name,
  },
});

const normalizeDeezerPodcast = (podcast) => ({
  id: podcast.id,
  title: podcast.title,
  description: podcast.description,
  cover: podcast.picture_medium || podcast.picture || podcast.picture_small,
  link: podcast.link,
  fans: podcast.fans,
  position: podcast.position,
  available_podcasts: true,
});

const normalizeTopChartPodcast = (podcast) => ({
  id: podcast.id,
  title: podcast.title,
  description: podcast.description,
  cover: podcast.picture_medium || podcast.picture || podcast.picture_small,
  link: podcast.link,
  fans: podcast.fans,
  position: podcast.position,
  available_podcasts: true,
});

const normalizeDeezerGenre = (genre) => ({
  id: genre.id,
  name: genre.name,
  picture: genre.picture_medium || genre.picture || genre.picture_small,
});

// ---------------- API functions ----------------

// Fetch chart data (TopChart normalizers)
export const getChart = async () => {
  const data = await fetchJson(`${DEEZER_API_BASE}/chart`);
  return {
    tracks: data.tracks?.data?.map(normalizeTopChartTrack) || [],
    artists: data.artists?.data?.map(normalizeTopChartArtist) || [],
    albums: data.albums?.data?.map(normalizeTopChartAlbum) || [],
    playlists: data.playlists?.data?.map(normalizeTopChartPlaylist) || [],
    podcasts: data.podcasts?.data?.map(normalizeTopChartPodcast) || [],
  };
};

// Fetch only top tracks directly
export async function getTopTracks(limit = 10) {
  const response = await fetch(`/api/deezer/chart`);
  const data = await response.json();
  if (!data?.tracks?.data) throw new Error("No top tracks found");
  return data.tracks.data.slice(0, limit).map(normalizeTopChartTrack);
}

export const getTopGenresFromTracks = async () => {
  const chartData = await getChart();
  const genreMap = new Map();

  chartData.tracks.forEach((track) => {
    const genreId = track?.genre_id;
    const genreName = track?.genre_name || "Unknown";
    if (genreId && !genreMap.has(genreId)) {
      genreMap.set(genreId, { id: genreId, name: genreName });
    }
  });

  return Array.from(genreMap.values());
};

// ---------------- Artist / Album / Playlist Pages ----------------

// Fetch a single track
export const getTrack = async (trackId) => {
  const data = await fetchJson(`${DEEZER_API_BASE}/track/${trackId}`);
  return normalizeDeezerTrack(data);
};

// Fetch artist details
export const getArtist = async (artistId) => {
  const data = await fetchJson(`${DEEZER_API_BASE}/artist/${artistId}`);
  return normalizeDeezerArtist(data);
};

// Fetch artist top tracks
export const getArtistTopTracks = async (artistId, limit = 20) => {
  const data = await fetchJson(
    `${DEEZER_API_BASE}/artist/${artistId}/top?limit=${limit}`
  );
  return data.data?.map(normalizeDeezerTrack) || [];
};

// Fetch album details
export const getAlbum = async (albumId) => {
  const data = await fetchJson(`${DEEZER_API_BASE}/album/${albumId}`);
  return normalizeDeezerAlbum(data);
};

// Fetch playlist details
export const getPlaylist = async (playlistId) => {
  const data = await fetchJson(`${DEEZER_API_BASE}/playlist/${playlistId}`);
  return normalizeDeezerPlaylist(data);
};

// Fetch podcast details
export const getPodcast = async (podcastId) => {
  const data = await fetchJson(`${DEEZER_API_BASE}/podcast/${podcastId}`);
  return normalizeDeezerPodcast(data);
};

// Fetch genres (general Deezer list)
export const getTopGenres = async () => {
  const data = await fetchJson(`${DEEZER_API_BASE}/chart/0/genres`);
  return data.data?.map(normalizeDeezerGenre) || [];
};

// ---------------- Search ----------------
const searchTracks = async (query) => {
  const data = await fetchJson(
    `${DEEZER_API_BASE}/search/?q=${encodeURIComponent(query)}`
  );
  return data.data.map(normalizeDeezerTrack);
};

const searchArtists = async (query) => {
  const data = await fetchJson(
    `${DEEZER_API_BASE}/search/artist/?q=${encodeURIComponent(query)}`
  );
  return data.data.map(normalizeDeezerArtist);
};

// ---------------- Exports ----------------
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
  searchTracks,
  searchArtists,
};
