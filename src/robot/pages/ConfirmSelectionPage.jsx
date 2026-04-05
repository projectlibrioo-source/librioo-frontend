import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import RobotLayout from "../layouts/RobotLayout";

const TIMEOUT_SECONDS = 30;

const ConfirmSelectionPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // The intent and user are passed as route state from SelectionPage
  const intent = location.state?.intent || "read";
  const userData = location.state?.user || {};

  const [secondsLeft, setSecondsLeft] = useState(TIMEOUT_SECONDS);

  // Countdown timer — times out to login if no action taken
  useEffect(() => {
    if (secondsLeft <= 0) {
      navigate("/robot/login");
      return;
    }
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft, navigate]);

  // --- YES: User wants to change selection → go to the appropriate search page ---
  const handleYes = () => {
    if (intent === "read") {
      navigate("/robot/read-search", { state: { user: userData } });
    } else {
      navigate("/robot/borrow-search", { state: { user: userData } });
    }
  };

  // --- NO: User is happy with their selection → proceed directly to EndingPage ---
  // The robot already guided them to the right shelf — no form re-entry needed.
  const handleNo = () => {
    navigate("/robot/ending");
  };

  // SVG ring progress (counts down from full circle to 0)
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (secondsLeft / TIMEOUT_SECONDS) * circumference;

  // Ring colour transitions: cyan → orange → red
  const ringColor =
    secondsLeft > 20
      ? "#22d3ee"
      : secondsLeft > 10
      ? "#ff7421"
      : "#ef4444";

  return (
    <RobotLayout>
      <div className="flex-1 min-h-[80vh] w-full relative flex flex-col items-center justify-center p-4 overflow-hidden">

        {/* Holographic background orbs */}
        <div className="absolute top-[-10%] right-[-10%] w-[clamp(250px,40vw,500px)] h-[clamp(250px,40vw,500px)] bg-red-500/10 blur-[120px] rounded-full z-0 pointer-events-none animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[clamp(200px,30vw,400px)] h-[clamp(200px,30vw,400px)] bg-cyan-400/15 blur-[120px] rounded-full z-0 pointer-events-none animate-pulse" style={{ animationDelay: '2s' }}></div>

        {/* Glassmorphic card */}
        <div className="z-10 flex flex-col items-center bg-black/30 backdrop-blur-xl border border-white/20 px-10 py-14 md:px-20 md:py-16 rounded-[40px] shadow-[0_0_60px_rgba(0,0,0,0.5)] max-w-[700px] w-full text-center gap-10">

          {/* Question heading */}
          <div className="flex flex-col gap-3">
            <h1
              className="text-[#caf9ff] text-[clamp(26px,4vw,48px)] leading-tight drop-shadow-lg"
              style={{ fontFamily: "'ADLaM Display', Helvetica" }}
            >
              Want to change your{" "}
              <span className="text-white">selection?</span>
            </h1>
            <p
              className="text-white/60 text-[clamp(14px,1.8vw,22px)] tracking-wide"
              style={{ fontFamily: "'Aldrich', sans-serif" }}
            >
              {intent === "read"
                ? "You chose to Read Here — want to pick a different book instead?"
                : "You chose to Borrow a Book — want to search for a different one?"}
            </p>
          </div>

          {/* YES / NO buttons */}
          <div className="flex flex-col sm:flex-row gap-6 w-full justify-center">

            {/* YES button */}
            <button
              id="confirm-yes-btn"
              onClick={handleYes}
              className="
                flex-1 w-full max-w-full sm:max-w-[240px] h-[70px]
                flex items-center justify-center
                bg-cyan-500/20 backdrop-blur-md border border-cyan-400 rounded-[20px] shadow-lg
                cursor-pointer transition-all duration-300
                hover:bg-cyan-400/30 hover:scale-105 hover:shadow-[0_0_25px_rgba(34,211,238,0.5)]
                focus:outline-none focus:ring-2 focus:ring-cyan-400
              "
            >
              <span
                className="text-[#caf9ff] text-[22px] tracking-widest font-bold"
                style={{ fontFamily: "'Aldrich', sans-serif" }}
              >
                YES
              </span>
            </button>

            {/* NO button */}
            <button
              id="confirm-no-btn"
              onClick={handleNo}
              className="
                flex-1 w-full max-w-full sm:max-w-[240px] h-[70px]
                flex items-center justify-center
                bg-[#ff7421]/20 backdrop-blur-md border border-[#ff7421] rounded-[20px] shadow-lg
                cursor-pointer transition-all duration-300
                hover:bg-[#ff7421]/30 hover:scale-105 hover:shadow-[0_0_25px_rgba(255,116,33,0.5)]
                focus:outline-none focus:ring-2 focus:ring-[#ff7421]
              "
            >
              <span
                className="text-[#ff7421] text-[22px] tracking-widest font-bold"
                style={{ fontFamily: "'Aldrich', sans-serif" }}
              >
                NO
              </span>
            </button>
          </div>

          {/* Countdown timer ring */}
          <div className="flex flex-col items-center gap-2">
            <div className="relative w-[100px] h-[100px]">
              <svg
                className="w-full h-full -rotate-90"
                viewBox="0 0 100 100"
                aria-label={`Session timeout in ${secondsLeft} seconds`}
              >
                {/* Background track */}
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="none"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="8"
                />
                {/* Animated progress ring */}
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="none"
                  stroke={ringColor}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  style={{ transition: "stroke-dashoffset 1s linear, stroke 0.5s ease" }}
                />
              </svg>
              {/* Number inside ring */}
              <span
                className="absolute inset-0 flex items-center justify-center text-white text-[28px] font-bold"
                style={{ fontFamily: "'Aldrich', sans-serif", color: ringColor }}
              >
                {secondsLeft}
              </span>
            </div>
            <p
              className="text-white/40 text-[13px] tracking-widest uppercase"
              style={{ fontFamily: "'Aldrich', sans-serif" }}
            >
              Session ends if no action
            </p>
          </div>

        </div>
      </div>
    </RobotLayout>
  );
};

export default ConfirmSelectionPage;
