import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import RobotLayout from "../layouts/RobotLayout"; 
import robotImage from "../../assets/pixverse-image-effect-prompt-give-me-three-pic-removebg-preview-1-2.png";
import { memberLogin } from "../../BackendFunctions";

const MemberLogin = () => {
  const [libraryId, setLibraryId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!libraryId.trim()) return;

    setIsLoading(true);

    try {
      const member = await memberLogin(libraryId);

      if (member) {
        navigate("/robot/user-details", { state: { user: member } });
      } else {
        alert("Invalid ID");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/robot/login");
  };

  return (
    <RobotLayout>
      <div className="h-full w-full flex flex-col lg:flex-row items-center justify-center px-[clamp(1.5rem,5vw,6rem)] gap-6 lg:gap-[clamp(2.5rem,5vw,5rem)] flex-1">
        
        {/* LEFT COLUMN: Form & Text */}
        <div className="z-10 flex flex-col w-full max-w-2xl lg:w-1/2">
          
          {/* Title Section */}
          <div className="mb-[clamp(1.5rem,4vh,2.5rem)]">
            <h1 
              className="mb-4 font-bold text-white text-[clamp(2.5rem,5vw,4.5rem)] leading-tight drop-shadow-lg"
              style={{ fontFamily: "'ADLaM_Display-Regular', Helvetica" }}
            >
              Member <span className="text-[#e0f7fa]">Login</span>
            </h1>
            <p className="font-light text-white/90 drop-shadow-sm text-[clamp(1.125rem,2.5vw,1.5rem)]">
              Please enter your Library ID to access your account.
            </p>
          </div>

          {/* Form Area */}
          <form onSubmit={handleLogin} className="flex flex-col w-full gap-8 lg:max-w-md">
            
            {/* Modern Glass Input Field */}
            <div className="flex flex-col gap-3">
              <label 
                htmlFor="library-id"
                className="font-medium tracking-wide text-white drop-shadow-md text-[clamp(1.2rem,2vw,1.5rem)]"
                style={{ fontFamily: "'Aldrich', Helvetica, sans-serif" }}
              >
                Library ID
              </label>
              <input
                type="text"
                id="library-id"
                value={libraryId}
                onChange={(e) => setLibraryId(e.target.value)}
                placeholder="Enter your ID..."
                className="w-full h-[clamp(50px,7vh,70px)] bg-white/20 backdrop-blur-xl border-2 border-white/30 rounded-2xl px-6 text-white placeholder-white/50 shadow-inner transition-all focus:outline-none focus:bg-white/30 focus:border-white/70 text-[clamp(1rem,2vw,1.5rem)]"
                style={{ fontFamily: "'Aldrich', Helvetica, sans-serif" }}
                required
              />
            </div>

            {/* Navigation Buttons Grid */}
            <div className="flex flex-row w-full gap-4 mt-2">
              
              {/* BACK Button (Glassy Outline Style) */}
              <button
                type="button"
                onClick={handleBack}
                className="relative flex-1 transition-all duration-300 group rounded-2xl hover:-translate-y-1 focus:outline-none"
              >
                <div className="h-[clamp(55px,8vh,70px)] relative bg-black/10 backdrop-blur-md border-2 border-white/40 rounded-2xl flex items-center justify-center transition-colors duration-300 group-hover:bg-white/20 group-hover:border-white/70">
                  <span className="font-bold tracking-wide text-white drop-shadow-md text-[clamp(1.2rem,2vw,1.5rem)]" style={{ fontFamily: "'Aldrich', sans-serif" }}>
                    BACK
                  </span>
                </div>
              </button>

              {/* LOGIN Button (Glowing Primary Style) */}
              <button
                type="submit"
                disabled={isLoading || !libraryId.trim()}
                className={`flex-1 relative group rounded-2xl p-[2px] overflow-hidden transition-transform focus:outline-none ${isLoading || !libraryId.trim() ? 'opacity-70 cursor-not-allowed' : 'hover:scale-[1.02]'}`}
              >
                {/* Glowing border layer */}
                <span className="absolute inset-0 bg-gradient-to-r from-[#ff7421] via-[#ffaa77] to-[#ff7421] rounded-2xl opacity-80 group-hover:opacity-100 transition-opacity duration-300"></span>
                
                {/* Inner button surface */}
                <div className="h-[clamp(51px,calc(8vh-4px),66px)] relative bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl flex items-center justify-center transition-colors duration-300 group-hover:bg-white/30">
                  <span className="font-bold tracking-wide text-white shadow-black drop-shadow-md text-[clamp(1.2rem,2vw,1.5rem)]" style={{ fontFamily: "'Aldrich', sans-serif" }}>
                    {isLoading ? "LOADING..." : "LOGIN"}
                  </span>
                </div>
              </button>
            </div>

          </form>
        </div>

        {/* RIGHT COLUMN: Robot Image */}
        <div className="relative items-center justify-center hidden w-full h-full lg:flex lg:w-1/2">
          {/* Holographic glowing orb behind the robot */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[clamp(250px,35vw,400px)] h-[clamp(250px,35vw,400px)] bg-cyan-100/30 blur-[100px] rounded-full z-0 pointer-events-none"></div>
          
          <img
            src={robotImage}
            alt="Smart Library Assistant Robot"
            className="relative z-10 scale-110 lg:scale-[1.15] max-h-[60vh] object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.3)] animate-fade-in hover:scale-105 transition-transform duration-700 ease-out"
          />
        </div>


      </div>

    </RobotLayout>
  );
};
export default MemberLogin;