import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MdSearch } from "react-icons/md";

const Search = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const wasSearchingRef = useRef(false);

  useEffect(() => {
    if (query.trim()) {
      wasSearchingRef.current = true;
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    } else if (wasSearchingRef.current) {
      wasSearchingRef.current = false;
      navigate("/");
    }
  }, [query, navigate]);

  return (
    <div className="relative">
      <div className="flex items-center w-full">
        <MdSearch className="pl-6 mt-1 pr-2 text-[#7E7E88]" size={22} />
        <input
          ref={inputRef}
          className="
            p-1
            bg-transparent
            outline-none
            font-[300]
            placeholder-[#BEBEC7]
            text-[#FFFFFF]
            w-full
            max-w-xl
          "
          placeholder="Search for songs, artists, albums..."
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
    </div>
  );
};

export default Search;
