import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ref, onValue } from "firebase/database";
import { db } from "../../admin/firebase";
import RobotLayout from "../layouts/RobotLayout";

const FollowPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userData = location.state?.user || {};

  useEffect(() => {
    // Listen to Firebase Realtime Database for robot status
    const statusRef = ref(db, "/robot/status");
    const unsubscribe = onValue(statusRef, (snapshot) => {
      const status = snapshot.val();
      if (status === "ARRIVED") {
        navigate("/robot/selection", { state: { user: userData } });
      }
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, [navigate]);

  return (
    <RobotLayout>
      <div className="flex-1 min-h-[80vh] w-full relative flex flex-col items-center justify-center p-4 overflow-hidden">
        
        {/* Holographic glowing background orbs */}
        <div className="absolute top-[-10%] right-[-10%] w-[clamp(250px,40vw,500px)] h-[clamp(250px,40vw,500px)] bg-cyan-400/20 blur-[120px] rounded-full z-0 pointer-events-none animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[clamp(200px,30vw,400px)] h-[clamp(200px,30vw,400px)] bg-[#ff7421]/15 blur-[120px] rounded-full z-0 pointer-events-none animate-pulse" style={{ animationDelay: '2s' }}></div>

        {/* Pulsing "Radar" Rings to indicate movement */}
        <div className="absolute w-[clamp(200px,40vw,400px)] h-[clamp(200px,40vw,400px)] border-2 border-[#ff7421]/30 rounded-full animate-[ping_3s_linear_infinite] z-0"></div>
        <div className="absolute w-[clamp(250px,60vw,600px)] h-[clamp(250px,60vw,600px)] border-2 border-cyan-400/20 rounded-full animate-[ping_4s_linear_infinite] z-0" style={{ animationDelay: '1.5s' }}></div>

        {/* Main Content Container (Glassmorphic) */}
        <div className="z-10 flex flex-col items-center justify-center bg-black/20 backdrop-blur-xl border border-white/20 px-10 py-16 md:px-24 md:py-20 rounded-[40px] shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          
          {/* Animated Bouncing Dots (Visualizer for movement) */}
          <div className="flex mb-6 space-x-4">
             <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-[#caf9ff] animate-bounce shadow-[0_0_15px_#caf9ff]"></div>
             <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-[#ff7421] animate-bounce shadow-[0_0_15px_#ff7421]" style={{ animationDelay: '0.2s' }}></div>
             <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-[#caf9ff] animate-bounce shadow-[0_0_15px_#caf9ff]" style={{ animationDelay: '0.4s' }}></div>
          </div>

          {/* "FOLLOW ME" TEXT (Your original styling upgraded with a drop shadow) */}
          <h1 
            className="
              text-[#fcfbfa] 
              text-center
              leading-tight
              drop-shadow-[0_0_25px_rgba(255,116,33,0.8)]
              /* Responsive Styles */
              text-[clamp(2.5rem,8vw,5.5rem)]
              tracking-[clamp(4px,1vw,15px)]
            "
            style={{
              fontFamily: "'Aldrich', sans-serif"
              
            }}
          >
            FOLLOW ME
          </h1>

          {/* Subtitle to add context */}
          <p className="mt-6 text-[#caf9ff] text-sm md:text-xl tracking-widest uppercase opacity-80 animate-pulse font-bold" style={{ fontFamily: "'Aldrich', sans-serif" }}>
            Navigating to destination...
          </p>
          
        </div>
        
      </div>
    </RobotLayout>
  );
};

export default FollowPage;