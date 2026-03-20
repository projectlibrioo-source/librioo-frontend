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
      <div className="h-full w-full flex flex-col lg:flex-row items-center justify-center px-6 lg:px-[120px] gap-10 lg:gap-20 flex-1">
        
        {/* LEFT COLUMN: Form & Text */}
        <div className="z-10 flex flex-col w-full max-w-2xl lg:w-1/2">
          
          {/* Title Section */}
          <div className="mb-10">
            <h1 
              className="mb-4 text-5xl font-bold text-white lg:text-7xl drop-shadow-lg"
              style={{ fontFamily: "'ADLaM_Display-Regular', Helvetica" }}
            >
              Member <span className="text-[#e0f7fa]">Login</span>
            </h1>
            <p className="text-xl font-light text-white/90 drop-shadow-sm">
              Please enter your Library ID to access your account.
            </p>
          </div>

          {/* Form Area */}
          <form onSubmit={handleLogin} className="flex flex-col w-full gap-8 lg:max-w-md">
            
            {/* Modern Glass Input Field */}
            <div className="flex flex-col gap-3">
              <label 
                htmlFor="library-id"
                className="text-2xl font-medium tracking-wide text-white drop-shadow-md"
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
                className="w-full h-[70px] bg-white/20 backdrop-blur-xl border-2 border-white/30 rounded-2xl px-6 text-2xl text-white placeholder-white/50 shadow-inner transition-all focus:outline-none focus:bg-white/30 focus:border-white/70"
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
                <div className="h-[70px] relative bg-black/10 backdrop-blur-md border-2 border-white/40 rounded-2xl flex items-center justify-center transition-colors duration-300 group-hover:bg-white/20 group-hover:border-white/70">
                  <span className="text-xl font-bold tracking-wide text-white lg:text-2xl drop-shadow-md" style={{ fontFamily: "'Aldrich', sans-serif" }}>
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
                <div className="h-[66px] relative bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl flex items-center justify-center transition-colors duration-300 group-hover:bg-white/30">
                  <span className="text-xl font-bold tracking-wide text-white lg:text-2xl shadow-black drop-shadow-md" style={{ fontFamily: "'Aldrich', sans-serif" }}>
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
export default MemberLogin;