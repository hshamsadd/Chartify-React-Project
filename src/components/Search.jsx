import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MdSearch } from "react-icons/md";

const Search = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
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
          onKeyDown={handleKeyDown}
        />
      </div>
    </form>
  );
};

export default Search;
