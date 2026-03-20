import React from "react";
import { useNavigate } from "react-router-dom";
import RobotLayout from "../layouts/RobotLayout";
import robotImage from "../../assets/pixverse-image-effect-prompt-give-me-three-pic-removebg-preview-1-1.png";

export default function LoginPage() {
  const navigate = useNavigate();

  return(
    <RobotLayout>

      <div className="h-full w-full flex flex-col lg:flex-row items-center justify-center px-6 lg:px-[100px] gap-10 lg:gap-20 flex-1">
        
        {/* LEFT COLUMN: Welcome Text & Actions */}
        <div className="z-10 flex flex-col w-full max-w-2xl lg:w-1/2">
          
          {/* Typography Section */}
          <div className="mb-10">
            <h1 
              className="mb-4 text-5xl font-bold text-white lg:text-7xl drop-shadow-lg"
              style={{ fontFamily: "'ADLaM_Display-Regular', Helvetica" }}
            >
              Welcome to <br />
              {/* React Bits tip: You could wrap this span in a <ShinyText> component here */}
              <span className="text-[#e0f7fa]">The Library</span>
            </h1>
            <p className="text-xl font-light lg:text-2xl text-white/90 drop-shadow-sm">
              Your Librioo library assistant is ready to help. <br/>
              Please select how you'd like to proceed.
            </p>
          </div>

          {/* React Bits Style Action Buttons */}
          <div className="flex flex-col w-full gap-6 lg:max-w-md">
            
            {/* Primary Button: Member Login */}
            <button
              onClick={() => navigate("/robot/member-login")}
              className="group relative w-full rounded-2xl p-[2px] overflow-hidden transition-transform hover:scale-[1.02] focus:outline-none"
            >
              {/* Glowing animated background layer (React Bits style gradient border) */}
              <span className="absolute inset-0 bg-gradient-to-r from-[#ff7421] via-[#ffaa77] to-[#ff7421] rounded-2xl opacity-80 group-hover:opacity-100 transition-opacity duration-300"></span>
              
              {/* Inner button surface */}
              <div className="relative flex items-center justify-between px-6 py-5 transition-colors duration-300 border bg-white/20 backdrop-blur-xl border-white/30 rounded-2xl group-hover:bg-white/30">
                <span className="text-2xl font-bold tracking-wide text-white shadow-black drop-shadow-md">

                  Member Login
                </span>
                <span className="text-2xl text-white transition-transform duration-300 transform group-hover:translate-x-2">
                  ➜
                </span>
              </div>
            </button>

            {/* Secondary Button: Guest Access */}
            <button
              onClick={() => navigate("/robot/guest-login")}
              className="relative w-full transition-all duration-300 group rounded-2xl hover:-translate-y-1 focus:outline-none"
            >
              <div className="relative flex items-center justify-between px-6 py-5 transition-colors duration-300 border-2 bg-black/10 backdrop-blur-md border-white/40 rounded-2xl group-hover:bg-white/20 group-hover:border-white/70">
                <span className="text-2xl font-bold tracking-wide text-white drop-shadow-md">
                  Guest Access
                </span>
                <span className="text-2xl text-white transition-transform duration-300 transform group-hover:translate-x-2">
                  ➜
                </span>
              </div>
            </button>

          </div>
        </div>

             {/* RIGHT COLUMN: Robot Image */}
        <div className="relative items-end justify-center hidden w-full h-full lg:flex lg:w-1/2">
          {/* Holographic glowing orb behind the robot */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-cyan-100/30 blur-[100px] rounded-full z-0"></div>
          
          <img
            src={robotImage}
            alt="Smart Library Assistant Robot"
            className="relative z-10 scale-125 max-h-[85vh] object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.3)] hover:scale-105 transition-transform duration-700 ease-out"
          />



        </div>


      </div>

          


    </RobotLayout>

  );
}
