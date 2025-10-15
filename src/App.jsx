import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import {
  MdOutlineNotificationsActive,
  MdAccountCircle,
  MdSsidChart,
  MdMusicNote,
  MdPodcasts,
  MdFavorite,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
} from "react-icons/md";
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
import FavouritesView from "./views/FavouritesView.jsx";
import { FavouritesProvider } from "./context/FavouritesContext.jsx";
import { SongProvider, useSong } from "./context/SongContext.jsx";

const AppContent = () => {
  const { currentTrack, setPlaying, setTrackTime } = useSong();
  const [showScrollDown, setShowScrollDown] = useState(true);
  const [showScrollUp, setShowScrollUp] = useState(false);
  useSong();

  useEffect(() => {
    setPlaying(false);
    setTrackTime("0:00");
  }, [setPlaying, setTrackTime]);

  useEffect(() => {
    const mainContent = document.querySelector("#MainContent");

    const handleScroll = () => {
      if (mainContent) {
        const isAtTop = mainContent.scrollTop < 100;
        const isAtBottom =
          mainContent.scrollHeight - mainContent.scrollTop <=
          mainContent.clientHeight + 100;

        setShowScrollDown(!isAtBottom);
        setShowScrollUp(!isAtTop);
      }
    };

    if (mainContent) {
      mainContent.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (mainContent) {
        mainContent.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  const scrollDown = () => {
    const mainContent = document.querySelector("#MainContent");
    if (mainContent) {
      mainContent.scrollBy({
        top: window.innerHeight - 200,
        behavior: "smooth",
      });
    }
  };

  const scrollUp = () => {
    const mainContent = document.querySelector("#MainContent");
    if (mainContent) {
      mainContent.scrollBy({
        top: -(window.innerHeight - 200),
        behavior: "smooth",
      });
    }
  };

  return (
    <Router>
      <div>
        <div
          id="TopNav"
          className="fixed right-0 flex items-center justify-between w-[calc(100%-240px)] h-[56px] shadow-lg hover:shadow-2xl hover:scale-x-[1.02] transition-all duration-300 ease-in-out z-40 origin-left"
        >
          <div className="flex items-center w-full">
            <Search />
          </div>
          <div className="flex items-center pr-10">
            <div className="mr-4 p-1 hover:bg-blue-200 hover:bg-opacity-90 text-[#0ea5e9] rounded-full cursor-pointer">
              <MdOutlineNotificationsActive className="text-white" size={25} />
            </div>
            <div className="mr-4 p-1 hover:bg-blue-200 hover:bg-opacity-90 text-[#0ea5e9] rounded-full cursor-pointer">
              <MdAccountCircle className="text-white" size={25} />
            </div>
          </div>
        </div>

        <div
          id="SideNav"
          className="fixed w-[240px] bg-[#0ea5e9] h-[100vh] shadow-lg hover:shadow-2xl hover:scale-x-[1.02] transition-all duration-300 ease-in-out z-40 origin-left"
        >
          <div className="w-full pl-6 pt-3 cursor-pointer">
            <Link to="/charts">
              <img
                width="40"
                src="/images/audio-wave-512.png"
                alt="Chartify Logo"
              />
              <span className="text-white text-xl font-semibold">Chartify</span>
            </Link>
          </div>

          <div className="mt-[53px]"></div>

          <SideMenuItem
            iconString="explore music"
            iconSize={20}
            icon={<MdSsidChart />}
            pageUrl="/charts"
            name="Music Charts"
          />
          <SideMenuItem
            iconString="music genres"
            iconSize={20}
            icon={<MdMusicNote />}
            pageUrl="/genres"
            name="Genres & Moods"
          />
          <SideMenuItem
            iconString="podcast"
            iconSize={20}
            icon={<MdPodcasts />}
            pageUrl="/podcasts"
            name="Podcasts"
          />
          <SideMenuItem
            iconString="favourite"
            iconSize={20}
            icon={<MdFavorite />}
            pageUrl="/favourites"
            name="Favourites"
          />
        </div>

        <div
          id="MainContent"
          className="fixed w-[calc(100%-240px)] h-[calc(100%-56px)] ml-[240px] mt-[56px] overflow-x-auto shadow-lg hover:shadow-2xl hover:scale-x-[1.02] transition-all duration-300 ease-in-out z-40 origin-left"
        >
          <Routes>
            <Route path="/" element={<HomeView />} />
            <Route path="/charts" element={<HomeView />} />
            <Route path="/favourites" element={<FavouritesView />} />
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

        {showScrollUp && (
          <button
            onClick={scrollUp}
            className="fixed top-24 right-3 bg-[#ffffff] text-[#0ea5e9] p-1 rounded-full shadow-lg hover:shadow-2xl hover:scale-110 transition-all duration-300 ease-in-out z-50"
          >
            <MdKeyboardArrowUp size={27} />
          </button>
        )}

        {showScrollDown && (
          <button
            onClick={scrollDown}
            className="fixed bottom-24 right-3 bg-[#ffffff] text-[#0ea5e9] p-1 rounded-full shadow-lg hover:shadow-2xl hover:scale-110 transition-all duration-300 ease-in-out z-50 animate-bounce"
          >
            <MdKeyboardArrowDown size={27} />
          </button>
        )}

        {currentTrack && <MusicPlayer />}
      </div>
    </Router>
  );
};

const App = () => {
  return (
    <FavouritesProvider>
      <SongProvider>
        <AppContent />
      </SongProvider>
    </FavouritesProvider>
  );
};

export default App;
