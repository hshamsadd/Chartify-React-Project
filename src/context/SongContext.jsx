import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useMemo,
} from "react";
import artist from "../singer.json";
import * as musicApi from "../api/music.js";

// Action types
const ACTIONS = {
  SET_PLAYING: "SET_PLAYING",
  SET_AUDIO: "SET_AUDIO",
  SET_CURRENT_ARTIST: "SET_CURRENT_ARTIST",
  SET_CURRENT_TRACK: "SET_CURRENT_TRACK",
  SET_TRACK_TIME: "SET_TRACK_TIME",
  SET_CURRENT_VOLUME: "SET_CURRENT_VOLUME",
  // SET_IS_LYRICS: "SET_IS_LYRICS",           // removed
  // SET_LYRICS_POSITION: "SET_LYRICS_POSITION", // removed
  RESET_STATE: "RESET_STATE",
  LOAD_SONG: "LOAD_SONG",
};

// Initial state
const initialState = {
  isPlaying: false,
  audio: null,
  currentArtist: null,
  currentTrack: null,
  trackTime: null,
  currentVolume: 80,
  // isLyrics: false,          // removed
  // lyricsPosition: "0:00",   // removed
};

// Load state from localStorage
const loadStateFromStorage = () => {
  try {
    const saved = localStorage.getItem("song-storage");
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...initialState,
        ...parsed,
        audio: null, // Don't restore audio object
      };
    }
  } catch (error) {
    console.log("Failed to load state from storage:", error);
  }
  return initialState;
};

// Save state to localStorage
const saveStateToStorage = (state) => {
  try {
    const stateToSave = {
      isPlaying: state.isPlaying,
      currentArtist: state.currentArtist,
      currentTrack: state.currentTrack,
      currentVolume: state.currentVolume,
      // isLyrics: state.isLyrics,              // removed
      // lyricsPosition: state.lyricsPosition,  // removed
    };
    localStorage.setItem("song-storage", JSON.stringify(stateToSave));
  } catch (error) {
    console.log("Failed to save state to storage:", error);
  }
};

// Reducer function
const songReducer = (state, action) => {
  let newState;

  switch (action.type) {
    case ACTIONS.SET_PLAYING:
      newState = { ...state, isPlaying: action.payload };
      break;
    case ACTIONS.SET_AUDIO:
      newState = { ...state, audio: action.payload };
      break;
    case ACTIONS.SET_CURRENT_ARTIST:
      newState = { ...state, currentArtist: action.payload };
      break;
    case ACTIONS.SET_CURRENT_TRACK:
      newState = { ...state, currentTrack: action.payload };
      break;
    case ACTIONS.SET_TRACK_TIME:
      if (state.trackTime === action.payload) {
        return state; // avoid unnecessary updates
      }
      newState = { ...state, trackTime: action.payload };
      break;
    case ACTIONS.SET_CURRENT_VOLUME:
      newState = { ...state, currentVolume: action.payload };
      break;
    // case ACTIONS.SET_IS_LYRICS:
    //   newState = { ...state, isLyrics: action.payload };
    //   break;
    // case ACTIONS.SET_LYRICS_POSITION:
    //   newState = { ...state, lyricsPosition: action.payload };
    //   break;
    case ACTIONS.RESET_STATE:
      newState = {
        ...initialState,
        currentVolume: state.currentVolume, // Keep volume setting
      };
      break;
    case ACTIONS.LOAD_SONG:
      newState = {
        ...state,
        currentArtist: action.payload.artistData,
        currentTrack: action.payload.track,
        audio: action.payload.audio || null,
        isPlaying: false,
      };
      break;
    default:
      return state;
  }

  // Save to localStorage (excluding audio). Skip frequent trackTime-only updates.
  if (action.type !== ACTIONS.SET_TRACK_TIME) {
    saveStateToStorage(newState);
  }
  return newState;
};

// Context
const SongContext = createContext();

// Custom hook to use the context
export const useSong = () => {
  const context = useContext(SongContext);
  if (!context) {
    throw new Error("useSong must be used within a SongProvider");
  }
  return context;
};

// Provider component
export const SongProvider = ({ children }) => {
  const [state, dispatch] = useReducer(songReducer, loadStateFromStorage());

  // Action creators - memoized to avoid infinite loops
  const loadSong = useCallback(
    (artistData, track) => {
      // Clean up previous audio (side-effect outside reducer)
      if (state.audio && state.audio.src) {
        try {
          state.audio.pause();
        } catch {}
        state.audio.src = "";
      }

      // Create new audio object
      const newAudio = new Audio();
      newAudio.src = track.path;

      // Use a single dispatch to set all the song data at once
      dispatch({
        type: ACTIONS.LOAD_SONG,
        payload: {
          artistData,
          track,
          audio: newAudio,
        },
      });
    },
    [state.audio]
  );

  const playOrPauseSong = useCallback(() => {
    if (state.audio && state.audio.paused) {
      dispatch({ type: ACTIONS.SET_PLAYING, payload: true });
      state.audio
        .play()
        .catch(() => dispatch({ type: ACTIONS.SET_PLAYING, payload: false }));
    } else if (state.audio) {
      dispatch({ type: ACTIONS.SET_PLAYING, payload: false });
      state.audio.pause();
    }
  }, [state.audio]);

  const prevSong = useCallback(
    (currentTrack) => {
      if (currentTrack && currentTrack.id > 1) {
        const track = artist.tracks[currentTrack.id - 2];
        loadSong(artist, track);
      }
    },
    [loadSong]
  );

  const nextSong = useCallback(
    (currentTrack) => {
      if (currentTrack) {
        let track;
        if (currentTrack.id >= artist.tracks.length) {
          track = artist.tracks[0];
        } else {
          track = artist.tracks[currentTrack.id];
        }
        loadSong(artist, track);
      }
    },
    [loadSong]
  );

  const playOrPauseThisSong = useCallback(
    (artistData, track) => {
      if (
        !state.audio ||
        !state.audio.src ||
        state.currentTrack?.id !== track.id
      ) {
        return loadSong(artistData, track);
      }
      return playOrPauseSong();
    },
    [state.audio, state.currentTrack, loadSong, playOrPauseSong]
  );

  const playFromFirst = useCallback(() => {
    dispatch({ type: ACTIONS.RESET_STATE });
    const track = artist.tracks[0];
    loadSong(artist, track);
  }, [loadSong]);

  const loadRemoteTrack = useCallback(
    async (trackTitle, artistName) => {
      try {
        const results = await musicApi.searchTracks(
          `${trackTitle} ${artistName}`
        );
        if (results.length > 0) {
          const track = results[0];
          const artistData = { name: track.artist, tracks: [track] };
          loadSong(artistData, track);
          return true;
        }
      } catch (error) {
        console.error("Failed to load remote track:", error);
      }
      // Fallback to local
      const localTrack = artist.tracks.find((t) =>
        t.title.toLowerCase().includes(trackTitle.toLowerCase())
      );
      if (localTrack) {
        loadSong(artist, localTrack);
        return true;
      }
      return false;
    },
    [loadSong]
  );

  const fetchArtistTopTracks = useCallback(async (artistId) => {
    try {
      const tracks = await musicApi.getArtistTopTracks(artistId);
      return { name: tracks[0]?.artist || "Unknown", tracks };
    } catch (error) {
      console.error("Failed to fetch artist top tracks:", error);
      return artist; // fallback
    }
  }, []);

  // Stable action creators
  const setPlaying = useCallback(
    (isPlaying) => dispatch({ type: ACTIONS.SET_PLAYING, payload: isPlaying }),
    []
  );
  const setAudio = useCallback(
    (audio) => dispatch({ type: ACTIONS.SET_AUDIO, payload: audio }),
    []
  );
  const setCurrentArtist = useCallback(
    (artist) => dispatch({ type: ACTIONS.SET_CURRENT_ARTIST, payload: artist }),
    []
  );
  const setCurrentTrack = useCallback(
    (track) => dispatch({ type: ACTIONS.SET_CURRENT_TRACK, payload: track }),
    []
  );
  const setTrackTime = useCallback(
    (time) => dispatch({ type: ACTIONS.SET_TRACK_TIME, payload: time }),
    []
  );
  const setCurrentVolume = useCallback(
    (volume) => dispatch({ type: ACTIONS.SET_CURRENT_VOLUME, payload: volume }),
    []
  );
  // const setIsLyrics = useCallback(                 // removed
  //   (isLyrics) => dispatch({ type: ACTIONS.SET_IS_LYRICS, payload: isLyrics }),
  //   []
  // );
  // const setLyricsPosition = useCallback(           // removed
  //   (position) =>
  //     dispatch({ type: ACTIONS.SET_LYRICS_POSITION, payload: position }),
  //   []
  // );
  const resetState = useCallback(
    () => dispatch({ type: ACTIONS.RESET_STATE }),
    []
  );

  const actions = useMemo(
    () => ({
      setPlaying,
      setAudio,
      setCurrentArtist,
      setCurrentTrack,
      setTrackTime,
      setCurrentVolume,
      // setIsLyrics,         // removed
      // setLyricsPosition,   // removed
      resetState,
      loadSong,
      playOrPauseSong,
      playOrPauseThisSong,
      prevSong,
      nextSong,
      playFromFirst,
      loadRemoteTrack,
      fetchArtistTopTracks,
    }),
    [
      setPlaying,
      setAudio,
      setCurrentArtist,
      setCurrentTrack,
      setTrackTime,
      setCurrentVolume,
      // setIsLyrics,        // removed
      // setLyricsPosition,  // removed
      resetState,
      loadSong,
      playOrPauseSong,
      playOrPauseThisSong,
      prevSong,
      nextSong,
      playFromFirst,
      loadRemoteTrack,
      fetchArtistTopTracks,
    ]
  );

  const value = useMemo(
    () => ({
      ...state,
      ...actions,
    }),
    [state, actions]
  );

  return <SongContext.Provider value={value}>{children}</SongContext.Provider>;
};
