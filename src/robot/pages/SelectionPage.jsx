import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import RobotLayout from "../layouts/RobotLayout";
import robotImage from "../../assets/pixverse-image-effect-prompt-give-me-three-pic-removebg-preview-1-2.png";

const SelectionPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userData = location.state?.user || {};
  
  // 1. ADD STATE TO TRACK SELECTION
  const [selectedOption, setSelectedOption] = useState(null);

  // 2. UPDATE HANDLERS TO SET STATE INSTEAD OF NAVIGATING
  const handleReadHereClick = () => {
    setSelectedOption("read");
  };

  const handleBorrowBookClick = () => {
    setSelectedOption("borrow");
  };

  // 3. PROCEED → always go to ConfirmSelectionPage first, passing the intent as state
  const handleProceedClick = () => {
    if (selectedOption) {
      navigate("/robot/confirm-selection", { state: { intent: selectedOption, user: userData } });
    }
  };

  const handleBackClick = () => {
    navigate("/robot/user-details");
  };

  return (
    <RobotLayout>
      <div className="h-full w-full relative flex flex-col items-center justify-center overflow-hidden px-6 md:px-16">
        
        {/* Holographic glowing background orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[clamp(250px,40vw,500px)] h-[clamp(250px,40vw,500px)] bg-cyan-400/20 blur-[120px] rounded-full z-0 pointer-events-none animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[clamp(200px,30vw,400px)] h-[clamp(200px,30vw,400px)] bg-[#ff7421]/15 blur-[120px] rounded-full z-0 pointer-events-none animate-pulse" style={{ animationDelay: '2s' }}></div>

        {/* Main Content Container */}
        <div className="z-10 w-full max-w-7xl flex flex-col md:flex-row items-center justify-between gap-10 lg:gap-20 h-full py-10">
          
          {/* Left Side: Text and Buttons */}
          <div className="flex-1 flex flex-col w-full max-w-2xl justify-center h-full">
            <h1 className="[font-family:'ADLaM_Display-Regular',Helvetica] font-normal text-[#caf9ff] text-[clamp(28px,6vw,60px)] leading-tight drop-shadow-lg mb-6 md:mb-8 text-center md:text-left">
              What would you <br className="hidden md:block" />
              like to <span className="text-white">do?</span>
            </h1>

            {/* Selection Buttons Container */}
            <div className="flex flex-col gap-6 md:gap-8 w-full">
              
              {/* Button 1: Read Here */}
              <button
                onClick={handleReadHereClick}
                className={`
                  group relative w-full h-[100px] sm:h-[130px]
                  flex items-center justify-center 
                  backdrop-blur-xl border rounded-[30px] shadow-2xl
                  cursor-pointer transition-all duration-300 ease-out
                  hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(202,249,255,0.2)]
                  focus:outline-none focus:ring-2 focus:ring-[#ff7421]
                  /* DYNAMIC CLASSES FOR SELECTION STATE */
                  ${selectedOption === "read" 
                    ? "bg-white/10 border-cyan-400 shadow-[0_0_30px_rgba(34,211,238,0.4)]" 
                    : "bg-black/20 border-white/20 hover:bg-white/5 hover:border-cyan-400/50"}
                `}
              >
                <span className="
                  [-webkit-text-stroke:1px_#ff7421] 
                  [font-family:'Aldrich',sans-serif] 
                  text-[#fcfbfa] text-[28px] sm:text-[40px] tracking-widest
                  drop-shadow-[0_0_10px_rgba(255,116,33,0.5)]
                  group-hover:drop-shadow-[0_0_15px_rgba(255,116,33,0.8)] transition-all
                ">
                  Read Here
                </span>
              </button>

              {/* Button 2: Borrow Book */}
              <button
                onClick={handleBorrowBookClick}
                className={`
                  group relative w-full h-[100px] sm:h-[130px]
                  flex items-center justify-center 
                  backdrop-blur-xl border rounded-[30px] shadow-2xl
                  cursor-pointer transition-all duration-300 ease-out
                  hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(202,249,255,0.2)]
                  focus:outline-none focus:ring-2 focus:ring-[#ff7421]
                  /* DYNAMIC CLASSES FOR SELECTION STATE */
                  ${selectedOption === "borrow" 
                    ? "bg-white/10 border-cyan-400 shadow-[0_0_30px_rgba(34,211,238,0.4)]" 
                    : "bg-black/20 border-white/20 hover:bg-white/5 hover:border-cyan-400/50"}
                `}
              >
                <span className="
                  [-webkit-text-stroke:1px_#ff7421] 
                  [font-family:'Aldrich',sans-serif] 
                  text-[#fcfbfa] text-[28px] sm:text-[40px] tracking-widest
                  drop-shadow-[0_0_10px_rgba(255,116,33,0.5)]
                  group-hover:drop-shadow-[0_0_15px_rgba(255,116,33,0.8)] transition-all
                ">
                  Borrow Book
                </span>
              </button>

            </div>

            {/* Back & Proceed Buttons Container */}
            <div className="flex flex-row gap-4 justify-center md:justify-start w-full mt-6 md:mt-8">
              
              {/* Back Button */}
              <button
                type="button"
                onClick={handleBackClick}
                className="
                  flex-1 max-w-[160px] h-[60px] 
                  flex items-center justify-center 
                  bg-red-500/10 backdrop-blur-md border border-red-500/30 rounded-[20px] shadow-lg
                  cursor-pointer transition-all duration-300
                  hover:bg-red-500/20 hover:border-red-500/50 hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]
                  focus:outline-none focus:ring-2 focus:ring-red-500
                "
              >
                <span className="text-[#fcfbfa] [font-family:'Aldrich',sans-serif] text-[18px] tracking-widest font-bold opacity-90">
                  BACK
                </span>
              </button>

              {/* Proceed Button */}
              <button
                type="button"
                onClick={handleProceedClick}
                disabled={!selectedOption}
                className={`
                  flex-1 max-w-[200px] h-[60px] 
                  flex items-center justify-center 
                  backdrop-blur-md border rounded-[20px] shadow-lg
                  transition-all duration-300
                  [font-family:'Aldrich',sans-serif] text-[18px] tracking-widest font-bold
                  ${selectedOption 
                    ? "bg-cyan-500/20 border-cyan-400 text-[#caf9ff] cursor-pointer hover:bg-cyan-400/30 hover:shadow-[0_0_20px_rgba(34,211,238,0.5)] focus:ring-2 focus:ring-cyan-400" 
                    : "bg-gray-500/10 border-gray-500/30 text-gray-500 cursor-not-allowed"}
                `}
              >
                PROCEED
              </button>

            </div>

          </div>

          {/* RIGHT SIDE: Floating Robot Image (Desktop Only) */}
          <div className="hidden md:flex flex-1 items-center justify-center w-full max-w-[400px] shrink-0 animate-safe-float">
            <img
              className="w-full h-auto max-h-[70vh] object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
              alt="Smart Library Assistant Robot"
              src={robotImage}
            />
          </div>

        </div>
      </div>
    </RobotLayout>
  );
};

export default SelectionPage;