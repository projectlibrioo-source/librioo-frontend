import React from "react";
import { useNavigate } from "react-router-dom"; 
import RobotLayout from "../layouts/RobotLayout"; 
import robotLeft from "../../assets/pixverse-image-effect-prompt-give-me-three-pic-removebg-preview-1-1.png";
import robotRight from "../../assets/pixverse-image-effect-prompt-give-me-three-pic-removebg-preview-1-2.png";

const EndingPage = () => {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate("/"); 
  };

  const handleEndSessionClick = () => {
    navigate("/robot/login"); 
  };

  return (
    <RobotLayout>
      {/* Custom CSS for a safe, restricted floating animation. */}
      <style>
        {`
          @keyframes safeFloat {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
          }
          .animate-safe-float {
            animation: safeFloat 6s ease-in-out infinite;
          }
          .animate-safe-float-delayed {
            animation: safeFloat 6s ease-in-out 3s infinite;
          }
        `}
      </style>

      {/* MAIN CONTAINER */}
      <div className="flex-1 min-h-[80vh] w-full relative flex flex-col items-center justify-center overflow-hidden p-4">

        {/* --- HOLOGRAPHIC BACKGROUND ORBS --- */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyan-400/20 blur-[120px] rounded-full z-0 pointer-events-none animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-[#03fcba]/15 blur-[120px] rounded-full z-0 pointer-events-none animate-pulse" style={{ animationDelay: '2s' }}></div>

        {/* --- CENTERED CONTENT WRAPPER (Now a Flex Row to enforce gaps!) --- */}
        <div className="relative w-full max-w-[1600px] flex flex-row items-center justify-center gap-2 sm:gap-6 lg:gap-12 px-2 md:px-8">

          {/* LEFT ROBOT (No longer absolute. Forced to sit on the left with a gap) */}
          <div className="flex justify-end z-0 w-[80px] sm:w-[150px] md:w-[220px] lg:w-[320px] shrink-0 opacity-40 animate-safe-float pointer-events-none">
            <img
              className="w-full h-auto scale-125 max-h-[45vh] object-contain drop-shadow-2xl"
              alt="Robot Left"
              src={robotLeft}
            />
          </div>

          {/* --- GLASSMORPHIC CONTENT CARD (z-10) --- */}
          <div className="z-10 flex flex-col items-center bg-black/40 backdrop-blur-xl border border-white/10 p-6 sm:p-8 md:p-12 lg:p-16 rounded-[40px] shadow-[0_0_50px_rgba(0,0,0,0.6)] w-full max-w-[90%] md:max-w-[600px] lg:max-w-[800px] text-center shrink">
            
            {/* Text Group */}
            <div className="flex flex-col items-center gap-4 mb-8 lg:gap-8 lg:mb-12">
              <h1 className="
                [font-family:'ADLaM_Display-Regular',Helvetica] 
                text-[#03fcba] 
                text-[clamp(26px,3.5vw,55px)]
                leading-tight
                drop-shadow-[0_0_20px_rgba(3,252,186,0.4)]
              ">
                Transaction Complete!
              </h1>

              <p className="
                [font-family:'Aldrich',sans-serif] 
                text-[#fcfbfa] 
                text-[clamp(16px,2vw,32px)]
                leading-normal
                opacity-95
              ">
                Thank you for using our Library Assistance.
              </p>

              <p className="
                [font-family:'ADLaM_Display-Regular',Helvetica] 
                text-[#caf9ff]
                text-[clamp(14px,1.5vw,24px)]
                leading-relaxed
                max-w-[500px]
                opacity-80
              ">
                The return date has been sent via SMS to your mobile phone.
              </p>
            </div>

            {/* --- BUTTONS SECTION --- */}
            <div className="flex flex-col sm:flex-row gap-5 lg:gap-[40px] w-full justify-center items-center">
              
              {/* Button 1: Return to Home */}
              <button
                onClick={handleHomeClick}
                className="
                  group w-full sm:w-[180px] lg:w-[240px] h-[55px] lg:h-[65px]
                  flex items-center justify-center 
                  bg-[#03fcba] rounded-[20px] 
                  shadow-[0_0_20px_rgba(3,252,186,0.3)] 
                  cursor-pointer transition-all duration-300 ease-out
                  hover:scale-105 hover:bg-[#04ffbc] hover:shadow-[0_0_30px_rgba(3,252,186,0.6)]
                  focus:outline-none focus:ring-4 focus:ring-white/50
                "
              >
                <span className="
                  text-[#111212] font-['Orbitron',sans-serif] 
                  text-[14px] lg:text-[18px] font-bold tracking-widest whitespace-nowrap
                ">
                  RETURN HOME
                </span>
              </button>

              {/* Button 2: End Session */}
              <button
                onClick={handleEndSessionClick}
                className="
                  group w-full sm:w-[180px] lg:w-[240px] h-[55px] lg:h-[65px]
                  flex items-center justify-center 
                  bg-[#ff7421] rounded-[20px] 
                  shadow-[0_0_20px_rgba(255,116,33,0.3)] 
                  cursor-pointer transition-all duration-300 ease-out
                  hover:scale-105 hover:bg-[#ff853a] hover:shadow-[0_0_30px_rgba(255,116,33,0.6)]
                  focus:outline-none focus:ring-4 focus:ring-white/50
                "
              >
                <span className="
                  text-[#111212] font-['Orbitron',sans-serif] 
                  text-[14px] lg:text-[18px] font-bold tracking-widest whitespace-nowrap
                ">
                  END SESSION
                </span>
              </button>

            </div>
          </div>

          {/* RIGHT ROBOT (Forced to sit on the right with a gap) */}
          <div className="flex justify-start z-0 w-[80px] sm:w-[150px] md:w-[220px] lg:w-[320px] shrink-0 opacity-40 animate-safe-float-delayed pointer-events-none">
            <img
              className="w-full h-auto scale-125 max-h-[45vh] object-contain drop-shadow-2xl"
              alt="Robot Right"
              src={robotRight}
            />
          </div>

        </div>
      </div>
    </RobotLayout>
  );
};

export default EndingPage;