import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import RobotLayout from "../layouts/RobotLayout"; 
import robotImage from "../../assets/pixverse-image-effect-prompt-give-me-three-pic-removebg-preview-1-1.png";

const UserDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 1. Get the user data AND the userType ('member' or 'guest')
  const passedUser = location.state?.user || {};
  const userType = location.state?.userType || "member"; // Default to member if undefined

  console.log("Current User:", passedUser);
  console.log("User Type:", userType);

  // 2. Prepare the ID Label and Value dynamically
  const idLabel = userType === "guest" ? "Guest ID :" : "Library ID :";
  
  // 3. Map the data based on what your backend sends
  const formData = {
    name: passedUser.fullName || passedUser.name || "", 
    id: userType === "guest" 
        ? (passedUser.guestID || passedUser.guestId || "") 
        : (passedUser.libraryID || passedUser.ID || ""), 
    email: passedUser.email || "", 
    contactNo: passedUser.phoneNumber || passedUser.contactNo || passedUser.mobile || "",   
  };

  // 4. Handle Back Button Logic
  const handleBack = () => {
    if (userType === "guest") {
        navigate("/robot/guest-login"); 
    } else {
        navigate("/robot/member-login"); 
    }
  };

  useEffect(() => {
    if (!passedUser.libraryId && !passedUser.id) {
        // navigate("/robot/member-login"); // Secure the page if needed
    }
  }, [passedUser, navigate]);

  const handleProceed = () => {
      console.log("Proceeding with user:", formData);
      navigate("/robot/search", { state: { user: formData } }); 
  };

  const formFields = [
    { id: "name", label: "Name :", value: formData.name, type: "text" },
    { id: "id", label: idLabel, value: formData.id, type: "text" },
    { id: "email", label: "Email :", value: formData.email, type: "email" },
    { id: "contactNo", label: "Contact No :", value: formData.contactNo, type: "tel" },
  ];

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

      <div className="relative flex flex-col items-center justify-center w-full min-h-full p-4 overflow-x-hidden md:p-8">
        
        {/* --- HOLOGRAPHIC BACKGROUND ORBS --- */}
        <div className="absolute top-[-10%] left-[-10%] w-[clamp(250px,40vw,500px)] h-[clamp(250px,40vw,500px)] bg-cyan-400/20 blur-[120px] rounded-full z-0 pointer-events-none animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[clamp(200px,30vw,400px)] h-[clamp(200px,30vw,400px)] bg-[#ff7421]/15 blur-[120px] rounded-full z-0 pointer-events-none animate-pulse" style={{ animationDelay: '2s' }}></div>

        {/* --- MAIN CONTENT WRAPPER --- */}
        <div className="z-10 w-full max-w-[1200px] flex flex-col md:flex-row items-center justify-center gap-6 lg:gap-[clamp(2.5rem,5vw,5rem)] h-full">
          
          {/* LEFT SIDE: Text and Form Container */}
          <div className="flex-1 flex flex-col w-full max-w-[650px] justify-center pt-8 md:pt-0">
            
            <h1 className="
              [font-family:'ADLaM_Display-Regular',Helvetica] 
              text-[#caf9ff] 
              text-[clamp(28px,5vw,45px)] 
              leading-tight 
              drop-shadow-lg 
              mb-4 md:mb-6 
              text-center md:text-left
            ">
              User Details
            </h1>

            <form 
              className="flex flex-col w-full gap-4 sm:gap-6"
              onSubmit={(e) => { e.preventDefault(); handleProceed(); }}
            >
              
              {/* GLASSMORPHIC FORM CARD */}
              <div className="bg-black/30 backdrop-blur-xl border border-white/10 p-4 sm:p-5 rounded-[30px] shadow-[0_0_40px_rgba(0,0,0,0.5)] flex flex-col gap-2 sm:gap-3">
                {formFields.map((field) => (
                  <div 
                    key={field.id}
                    className="
                      w-full flex flex-col sm:flex-row items-start sm:items-center 
                      gap-1 sm:gap-3 bg-white/5 border border-white/10 rounded-[20px] 
                      p-1 sm:p-2 transition-all hover:bg-white/10 hover:border-cyan-400/30
                    "
                  >
                    {/* Label */}
                    <label
                      htmlFor={field.id}
                      className="
                        w-[120px] sm:w-[150px] flex-shrink-0 
                        text-[#caf9ff] 
                        [font-family:'Aldrich',sans-serif] 
                        text-[clamp(14px,1.5vw,18px)]
                        whitespace-nowrap
                        pl-2
                      "
                    >
                      {field.label}
                    </label>

                    {/* Input Container (Darker inner shadow) */}
                    <div className="flex-1 w-full bg-black/50 rounded-[12px] flex items-center shadow-inner border border-white/5 overflow-hidden">
                      <input
                        id={field.id}
                        type={field.type}
                        value={field.value}
                        readOnly
                        className="
                          w-full h-[30px] sm:h-[35px]
                          bg-transparent px-4
                          text-white
                          [font-family:'Aldrich',sans-serif] 
                          text-[clamp(12px,1.5vw,16px)]
                          focus:outline-none cursor-default
                        "
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* ACTION BUTTONS */}
              <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mt-4">
                {/* Back Button */}
                <button
                  type="button"
                  onClick={handleBack}
                  className="
                    flex-1 max-w-[clamp(150px,25vw,200px)] h-[clamp(50px,8vh,60px)] 
                    flex items-center justify-center 
                    bg-red-500/10 backdrop-blur-md border border-red-500/30 rounded-[20px] shadow-lg
                    cursor-pointer transition-all duration-300
                    hover:bg-red-500/20 hover:border-red-500/50 hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]
                    focus:outline-none focus:ring-2 focus:ring-red-500
                  "
                >
                  <span className="text-[#fcfbfa] [font-family:'Aldrich',sans-serif] text-[clamp(14px,2vw,18px)] tracking-widest font-bold">
                    BACK
                  </span>
                </button>

                {/* Proceed Button */}
                <button
                  type="submit"
                  className="
                    flex-1 max-w-[clamp(150px,25vw,200px)] h-[clamp(50px,8vh,60px)] 
                    flex items-center justify-center 
                    bg-cyan-500/20 backdrop-blur-md border border-cyan-400 rounded-[20px] shadow-lg
                    cursor-pointer transition-all duration-300
                    hover:bg-cyan-400/30 hover:shadow-[0_0_20px_rgba(34,211,238,0.5)]
                    focus:outline-none focus:ring-2 focus:ring-cyan-400
                  "
                >
                  <span className="text-[#caf9ff] [font-family:'Aldrich',sans-serif] text-[clamp(14px,2vw,18px)] tracking-widest font-bold drop-shadow-md">
                    PROCEED
                  </span>
                </button>

              </div>
            </form>

          </div>

          {/* RIGHT SIDE: Floating Robot Image (Desktop Only) */}
          <div className="hidden md:flex flex-1 items-center justify-center w-full max-w-[350px] lg:max-w-[450px] shrink-0 animate-safe-float">
            <img
              className="w-full h-auto max-h-[50vh] object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
              alt="Smart Library Assistant Robot"
              src={robotImage}
            />
          </div>

        </div>
      </div>
    </RobotLayout>
  );
};

export default UserDetails;