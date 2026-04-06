import React from 'react';
import logolib31 from "../../assets/logoLib3-1.png";

export default function RobotLayout({ children }) {
  return (
    <div 
      className="flex flex-col w-full h-[100dvh] overflow-hidden"
      style={{
        // A lighter, more modern blue/cyan gradient
        background: 'linear-gradient(135deg, #6b8cce 0%, #8cb0c9 50%, #c4e0e5 100%)',
        fontFamily: "'Aldrich', Helvetica, sans-serif"
      }}
    >
      {/* Modern Glass Header */}
      <header 
        className="sticky top-0 z-50 flex items-center w-full gap-4 px-6 py-4 border-b shadow-sm border-white/20"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }}
      >
        <img
          src={logolib31}
          alt="Smart Library Assistant"
          className="h-[50px] w-auto drop-shadow-md"
        />
        <h2 className="m-0 text-xl font-light tracking-wide text-white md:text-2xl drop-shadow-sm">
          Smart Library Assistant
        </h2>
      </header>

      {/* Main Content Area */}
      <main className="relative flex flex-col flex-1 w-full overflow-y-auto">
        {children}
      </main>
    </div>
  );
}