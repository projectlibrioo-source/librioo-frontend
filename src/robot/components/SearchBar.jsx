import React from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";

const SearchBar = ({ query, onChange, onSubmit, className = "", placeholder = "Search..." }) => (
  <form
    onSubmit={onSubmit}
    className={`w-full h-[60px] md:h-[70px] bg-white/20 backdrop-blur-xl border-2 border-white/30 hover:bg-white/30 transition-all rounded-2xl flex items-center px-4 shadow-inner overflow-hidden ${className}`}
  >
    <input
      type="search"
      value={query}
      onChange={onChange}
      placeholder={placeholder}
      className="flex-1 px-2 bg-transparent outline-none text-white placeholder-white/60 text-[18px] md:text-xl font-medium tracking-wide"
      style={{ fontFamily: "'Aldrich', sans-serif" }}
    />
    <button
      type="submit"
      aria-label="Search"
      className="w-[45px] h-[45px] flex items-center justify-center bg-white/20 text-white rounded-xl hover:bg-white/40 transition-all shadow-sm"
    >
      <MagnifyingGlassIcon className="w-6 h-6 text-white" />
    </button>
  </form>
);

export default SearchBar;