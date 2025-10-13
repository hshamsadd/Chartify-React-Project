import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  NavLink,
} from "react-router-dom";
import { MdNotifications } from "react-icons/md";

import SideMenuItem from "./components/SideMenuItem.jsx";
import MusicPlayer from "./components/MusicPlayer.jsx";
import Search from "./components/Search.jsx";
import HomeView from "./views/HomeView.jsx";
import TopTracksView from "./views/TopTracksView.jsx";
import ArtistView from "./views/ArtistView.jsx";
import AlbumView from "./views/AlbumView.jsx";
import PlaylistView from "./views/PlaylistView.jsx";
import SearchResults from "./views/SearchResults.jsx";
import GenresView from "./views/GenresView.jsx";
import GenreView from "./views/GenreView.jsx";
import PodcastsView from "./views/PodcastsView.jsx";
import PodcastView from "./views/PodcastView.jsx";

import { SongProvider, useSong } from "./context/SongContext.jsx";

const AppContent = () => {
  const {
    isPlaying,
    currentTrack,
    isLyrics,
    trackTime,
    setPlaying,
    setIsLyrics,
    setTrackTime,
  } = useSong();

  useEffect(() => {
    setPlaying(false);
    setIsLyrics(false);
    setTrackTime("0:00");
  }, [setPlaying, setIsLyrics, setTrackTime]);

  return (
    <Router>
      <div>
        {/* Top Navigation */}
        <div
          id="TopNav"
          className="fixed right-0 flex items-center justify-between w-[calc(100%-240px)] h-[56px] border-b border-b-[#32323D]"
        >
          <div className="flex items-center w-full">
            <Search />
          </div>
          <div className="flex items-center pr-10">
            <div className="mr-4 p-1 hover:bg-gray-600 rounded-full cursor-pointer">
              <MdNotifications className="text-white" size={20} />
            </div>
            <img
              className="rounded-full w-[33px]"
              src="https://yt3.ggpht.com/e9o-24_frmNSSVvjS47rT8qCHgsHNiedqgXbzmrmpsj6H1ketcufR1B9vLXTZRa30krRksPj=s88-c-k-c0x00ffffff-no-rj-mo"
              alt="Profile"
            />
          </div>
        </div>

        {/* Side Navigation */}
        <div
          id="SideNav"
          className="fixed w-[240px] bg-[#191922] h-[100vh] border-r border-r-[#32323D]"
        >
          <div className="w-full pl-6 pt-3 cursor-pointer">
            <Link to="/charts">
              <img
                width="130"
                src="/images/deezer-logo.png"
                alt="Deezer Logo"
              />
            </Link>
          </div>

          <div className="mt-[53px]"></div>

          <SideMenuItem
            iconString="explore"
            iconSize={20}
            pageUrl="/charts"
            name="Music Charts"
          />
          <SideMenuItem
            iconString="music"
            iconSize={20}
            pageUrl="/genres"
            name="Genres & Moods"
          />
          <SideMenuItem
            iconString="podcast"
            iconSize={20}
            pageUrl="/podcasts"
            name="Podcasts"
          />
          <SideMenuItem
            iconString="favourite"
            iconSize={20}
            pageUrl="/favourites"
            name="Favourites"
          />
        </div>

        {/* Main Content */}
        <div className="fixed w-[calc(100%-240px)] h-[calc(100%-56px)] ml-[240px] mt-[56px] overflow-x-auto">
          <Routes>
            <Route path="/charts" element={<HomeView />} />
            <Route path="/track/:id" element={<TopTracksView />} />
            <Route path="/artist/:id?" element={<ArtistView />} />
            <Route path="/album/:id" element={<AlbumView />} />
            <Route path="/playlist/:id" element={<PlaylistView />} />
            <Route path="/genres" element={<GenresView />} />
            <Route path="/genre/:id" element={<GenreView />} />
            <Route path="/podcasts" element={<PodcastsView />} />
            <Route path="/podcasts/:podcastId" element={<PodcastView />} />
            <Route path="/podcast/:podcastId" element={<PodcastView />} />
            <Route path="/search" element={<SearchResults />} />
          </Routes>
        </div>

        {/* Music Player */}
        {currentTrack && <MusicPlayer />}
      </div>
    </Router>
  );
};

const App = () => {
  return (
    <SongProvider>
      <AppContent />
    </SongProvider>
  );
};

export default App;
