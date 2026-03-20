import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import RobotLayout from "../layouts/RobotLayout";
import robotImage from "../../assets/pixverse-image-effect-prompt-give-me-three-pic-removebg-preview-1-2.png";

const SearchPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userData = location.state?.user || {};

  // 1. State to track which button is selected ('name' or 'category')
  const [selectedOption, setSelectedOption] = useState(null);

  const handleBackClick = () => {
    navigate("/robot/user-details", { state: { user: userData } });
  };

  // 2. Button Click Handlers (Select Only)
  const selectNameSearch = () => {
    setSelectedOption("name");
  };

  const selectCategorySearch = () => {
    setSelectedOption("category");
  };

  // 3. Proceed Button Logic (Navigates based on selection)
  const handleProceedClick = () => {
    if (selectedOption === "name") {
      navigate("/robot/search-book", { state: { user: userData } });
    } else if (selectedOption === "category") {
      navigate("/robot/search-category", { state: { user: userData } });
    }
  };

  return (
    <RobotLayout>
      <div className="h-full w-full flex flex-col lg:flex-row items-center justify-center px-6 lg:px-[100px] gap-10 lg:gap-20 flex-1">
        
        {/* LEFT COLUMN: Options & Buttons */}
        <div className="z-10 flex flex-col w-full max-w-2xl lg:w-1/2">
          
          {/* Title Section */}
          <div className="mb-10">
            <h1 
              className="mb-4 text-5xl font-bold text-white lg:text-7xl drop-shadow-lg"
              style={{ fontFamily: "'ADLaM_Display-Regular', Helvetica" }}
            >
              Search <span className="text-[#e0f7fa]">Books</span>
            </h1>
            <p className="text-xl font-light text-white/90 drop-shadow-sm">
              How would you like to find your next read?
            </p>
          </div>

          {/* Selection Area */}
          <div className="flex flex-col w-full gap-6 lg:max-w-md">
            
            {/* Search By Name Option */}
            <button
              onClick={selectNameSearch}
              className={`w-full h-[80px] rounded-2xl flex items-center justify-center transition-all duration-300 border-2 backdrop-blur-md focus:outline-none ${
                selectedOption === 'name' 
                  ? 'bg-white/30 border-[#ff7421] shadow-[0_0_20px_rgba(255,116,33,0.4)] scale-[1.02]' 
                  : 'bg-black/20 border-white/30 hover:bg-white/10'
              }`}
            >
              <span className="text-2xl font-medium tracking-wide text-white drop-shadow-md" style={{ fontFamily: "'Aldrich', sans-serif" }}>
                Search by Name
              </span>
            </button>

            {/* Search By Category Option */}
            <button
              onClick={selectCategorySearch}
              className={`w-full h-[80px] rounded-2xl flex items-center justify-center transition-all duration-300 border-2 backdrop-blur-md focus:outline-none ${
                selectedOption === 'category' 
                  ? 'bg-white/30 border-[#ff7421] shadow-[0_0_20px_rgba(255,116,33,0.4)] scale-[1.02]' 
                  : 'bg-black/20 border-white/30 hover:bg-white/10'
              }`}
            >
              <span className="text-2xl font-medium tracking-wide text-white drop-shadow-md" style={{ fontFamily: "'Aldrich', sans-serif" }}>
                Search by Category
              </span>
            </button>

            {/* Navigation Buttons Grid */}
            <div className="flex flex-row w-full gap-4 mt-6">
              
              {/* BACK Button (Glassy Outline Style) */}
              <button
                type="button"
                onClick={handleBackClick}
                className="relative flex-1 transition-all duration-300 group rounded-2xl hover:-translate-y-1 focus:outline-none"
              >
                <div className="h-[70px] relative bg-black/10 backdrop-blur-md border-2 border-white/40 rounded-2xl flex items-center justify-center transition-colors duration-300 group-hover:bg-white/20 group-hover:border-white/70">
                  <span className="text-xl font-bold tracking-wide text-white lg:text-2xl drop-shadow-md" style={{ fontFamily: "'Aldrich', sans-serif" }}>
                    BACK
                  </span>
                </div>
              </button>

              {/* PROCEED Button (Glowing Primary Style - Only active if an option is selected) */}
              <button
                type="button"
                onClick={handleProceedClick}
                disabled={!selectedOption}
                className={`flex-1 relative group rounded-2xl p-[2px] overflow-hidden transition-transform focus:outline-none ${!selectedOption ? 'opacity-50 cursor-not-allowed grayscale' : 'hover:scale-[1.02]'}`}
              >
                {/* Glowing border layer */}
                <span className="absolute inset-0 bg-gradient-to-r from-[#ff7421] via-[#ffaa77] to-[#ff7421] rounded-2xl opacity-80 group-hover:opacity-100 transition-opacity duration-300"></span>
                
                {/* Inner button surface */}
                <div className="h-[66px] relative bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl flex items-center justify-center transition-colors duration-300 group-hover:bg-white/30">
                  <span className="text-xl font-bold tracking-wide text-white lg:text-2xl shadow-black drop-shadow-md" style={{ fontFamily: "'Aldrich', sans-serif" }}>
                    PROCEED
                  </span>
                </div>
              </button>
            </div>

          </div>
        </div>

        {/* RIGHT COLUMN: Robot Image */}
        <div className="relative items-center justify-center hidden w-full h-full lg:flex lg:w-1/2">
          {/* Holographic glowing orb behind the robot */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-cyan-100/30 blur-[100px] rounded-full z-0 pointer-events-none"></div>
          
          <img
            src={robotImage}
            alt="Smart Library Assistant Robot"
            className="relative z-10 scale-125 max-h-[85vh] object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.3)] animate-fade-in hover:scale-105 transition-transform duration-700 ease-out"
          />
        </div>

      </div>
    </RobotLayout>
  );
};

export default SearchPage;