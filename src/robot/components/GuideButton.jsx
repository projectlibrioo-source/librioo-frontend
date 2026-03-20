import React from "react";
import { useNavigate } from "react-router-dom";
import { navigateByBookName } from "../../BackendFunctions";

const GuideButton = ({ onClick, className = "", bookName, disabled }) => {
  const navigate = useNavigate();

  const handleClick = async (e) => {
    if (disabled) return;
    if (onClick) {
      onClick(e);
      return;
    }
    if (bookName) {
      await navigateByBookName(bookName);
    }
    navigate("/robot/follow");
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`relative group rounded-2xl p-[2px] overflow-hidden transition-transform focus:outline-none flex-1 ${disabled ? 'opacity-50 cursor-not-allowed grayscale' : 'hover:scale-[1.02]'} ${className}`}
    >
      <span className="absolute inset-0 bg-gradient-to-r from-[#ff7421] via-[#ffaa77] to-[#ff7421] rounded-2xl opacity-80 group-hover:opacity-100 transition-opacity duration-300"></span>
      <div className="h-full min-h-[50px] md:min-h-[66px] w-full relative bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl flex items-center justify-center transition-colors duration-300 group-hover:bg-white/30 px-6">
        <span className="text-[clamp(14px,1.6vh,20px)] text-white font-bold tracking-wide shadow-black drop-shadow-md whitespace-nowrap" style={{ fontFamily: "'Aldrich', sans-serif" }}>
          GUIDE ME
        </span>
      </div>
    </button>
  );
};

export default GuideButton;