import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MdSearch } from "react-icons/md";

const Search = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const inputRef = useRef(null);
  const timeoutRef = useRef(null);
  const wasSearchingRef = useRef(false);

  useEffect(() => {
    if (!location.pathname.startsWith("/search")) {
      setQuery("");
    }
  }, [location.pathname]);

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (query.trim()) {
      wasSearchingRef.current = true;
      timeoutRef.current = setTimeout(() => {
        navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      }, 500);
    } else if (
      wasSearchingRef.current &&
      location.pathname.startsWith("/search")
    ) {
      wasSearchingRef.current = false;
      navigate("/charts");
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [query, navigate, location.pathname]);

  return (
    <div className="relative w-full">
      <div className="flex items-center w-full">
        <MdSearch
          className="pl-45 mt-45 pr-2 text-[#ffffff] flex-shrink-0"
          size={35}
        />
        <input
          ref={inputRef}
          className="
            p-1
            bg-transparent
            outline-none
            font-[300]
            placeholder-[#ffffff]
            text-[#FFFFFF]
            w-full
            flex-1
          "
          placeholder="Search for artists, tracks, albums, and more..."
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
    </div>
  );
};

export default Search;
