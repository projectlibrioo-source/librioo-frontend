import React from "react";
import { useNavigate } from "react-router-dom";

const CancelButton = ({ className = "" }) => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(-1)}
      className={`relative transition-all duration-300 group rounded-2xl hover:-translate-y-1 focus:outline-none flex-1 ${className}`}
    >
      <div className="h-full min-h-[50px] md:min-h-[66px] w-full relative bg-black/10 backdrop-blur-md border border-white/40 rounded-2xl flex items-center justify-center transition-colors duration-300 group-hover:bg-white/20 px-6">
        <span className="text-[clamp(14px,1.6vh,20px)] text-white font-bold tracking-wide" style={{ fontFamily: "'Aldrich', sans-serif" }}>
          CANCEL
        </span>
      </div>
    </button>
  );
};

export default CancelButton;