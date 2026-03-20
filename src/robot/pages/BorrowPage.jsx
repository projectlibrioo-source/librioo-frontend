import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import RobotLayout from "../layouts/RobotLayout";
import robotImage from "../../assets/pixverse-image-effect-prompt-give-me-three-pic-removebg-preview-1-2.png";

export default function BorrowPage() {

  const [bookId, setBookId] = useState("");
  const [bookName, setBookName] = useState("");
  const navigate = useNavigate();

  const handleBorrow = (e) => {
    e.preventDefault();
    console.log("Borrowing:", { bookId, bookName });
    // Add your backend logic here
  };

  const handleCancel = () => {
    setBookId("");
    setBookName("");
    // Optional: navigate back if needed, e.g., navigate("/robot/search");
  };

  return (
    <RobotLayout>

      {/* Safe Float Animation */}
      <style>
        {`
          @keyframes safeFloat {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
          }
          .animate-safe-float {
            animation: safeFloat 6s ease-in-out infinite;
          }
        `}
      </style>

      <div className="relative flex flex-col items-center justify-center w-full h-full p-4 overflow-x-hidden md:p-8">

        {/* --- HOLOGRAPHIC BACKGROUND ORBS --- */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyan-400/20 blur-[120px] rounded-full z-0 pointer-events-none animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-[#ff7421]/15 blur-[120px] rounded-full z-0 pointer-events-none animate-pulse" style={{ animationDelay: '2s' }}></div>

        {/* --- MAIN CONTENT WRAPPER --- */}
        <div className="z-10 w-full max-w-[1200px] flex flex-col md:flex-row items-center justify-center gap-10 lg:gap-[100px] h-full">

          {/* LEFT SIDE: Text and Form Container */}
          <div className="flex-1 flex flex-col w-full max-w-[650px] justify-center pt-8 md:pt-0">
            
            <h1 className="
              [font-family:'ADLaM_Display-Regular',Helvetica] 
              text-[#caf9ff] 
              text-[clamp(32px,5vw,55px)] 
              leading-tight 
              drop-shadow-lg 
              mb-6 md:mb-10 
              text-center md:text-left
            ">
              Borrow Book
            </h1>

            <form 
              onSubmit={handleBorrow} 
              className="flex flex-col w-full gap-6"
            >

               {/* GLASSMORPHIC FORM CARD */}
              <div className="bg-black/30 backdrop-blur-xl border border-white/10 p-6 sm:p-8 rounded-[30px] shadow-[0_0_40px_rgba(0,0,0,0.5)] flex flex-col gap-4 sm:gap-6">

                {/* Book ID Input */}
                <div className="w-full flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-6 bg-white/5 border border-white/10 rounded-[20px] p-3 sm:p-4 transition-all focus-within:bg-white/10 focus-within:border-cyan-400/50">
                  <label className="w-[120px] sm:w-[150px] flex-shrink-0 text-[#caf9ff] [font-family:'Aldrich',sans-serif] text-[18px] sm:text-[22px] whitespace-nowrap pl-2">
                    Book ID :
                  </label>
                  <div className="flex-1 w-full bg-black/50 rounded-[12px] flex items-center shadow-inner border border-white/5 overflow-hidden transition-colors">
                    <input
                      type="text"
                      value={bookId}
                      onChange={(e) => setBookId(e.target.value)}
                      required
                      className="w-full h-[45px] sm:h-[50px] bg-transparent px-4 text-white [font-family:'Aldrich',sans-serif] text-[16px] sm:text-[20px] focus:outline-none placeholder-gray-500"
                      placeholder="Enter ID..."
                    />
                  </div>
                </div>

                 {/* Book Name Input */}
                <div className="w-full flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-6 bg-white/5 border border-white/10 rounded-[20px] p-3 sm:p-4 transition-all focus-within:bg-white/10 focus-within:border-cyan-400/50">
                  <label className="w-[120px] sm:w-[150px] flex-shrink-0 text-[#caf9ff] [font-family:'Aldrich',sans-serif] text-[18px] sm:text-[22px] whitespace-nowrap pl-2">
                    Book Name :
                  </label>
                  <div className="flex-1 w-full bg-black/50 rounded-[12px] flex items-center shadow-inner border border-white/5 overflow-hidden transition-colors">
                    <input
                      type="text"
                      value={bookName}
                      onChange={(e) => setBookName(e.target.value)}
                      required
                      className="w-full h-[45px] sm:h-[50px] bg-transparent px-4 text-white [font-family:'Aldrich',sans-serif] text-[16px] sm:text-[20px] focus:outline-none placeholder-gray-500"
                      placeholder="Enter Name..."
                    />
                  </div>
                </div>

              </div> 

              {/* ACTION BUTTONS */}
              <div className="z-10 w-full max-w-[1200px] flex flex-col md:flex-row items-center justify-center gap-10 lg:gap-[100px] h-full">

                {/* Cancel Button */}
                <button
                  type="button"
                  onClick={handleCancel}
                  className="
                    flex-1 max-w-[200px] h-[60px] 
                    flex items-center justify-center 
                    bg-red-500/10 backdrop-blur-md border border-red-500/30 rounded-[20px] shadow-lg
                    cursor-pointer transition-all duration-300
                    hover:bg-red-500/20 hover:border-red-500/50 hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]
                    focus:outline-none focus:ring-2 focus:ring-red-500
                  "
                >
                  <span className="text-[#fcfbfa] [font-family:'Aldrich',sans-serif] text-[16px] sm:text-[18px] tracking-widest font-bold">
                    CANCEL
                  </span>
                </button>

                {/* Borrow Button */}
                <button
                  type="submit"
                  className="
                    flex-1 max-w-[200px] h-[60px] 
                    flex items-center justify-center 
                    bg-cyan-500/20 backdrop-blur-md border border-cyan-400 rounded-[20px] shadow-lg
                    cursor-pointer transition-all duration-300
                    hover:bg-cyan-400/30 hover:shadow-[0_0_20px_rgba(34,211,238,0.5)]
                    focus:outline-none focus:ring-2 focus:ring-cyan-400
                  "
                >
                  <span className="text-[#caf9ff] [font-family:'Aldrich',sans-serif] text-[16px] sm:text-[18px] tracking-widest font-bold drop-shadow-md">
                    BORROW
                  </span>
                </button>

              </div>
            </form>
        </div>

        {/* RIGHT SIDE: Floating Robot Image (Desktop Only) */}
            <div className="hidden md:flex flex-1 items-center justify-center w-full max-w-[350px] lg:max-w-[450px] shrink-0 animate-safe-float">
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
}