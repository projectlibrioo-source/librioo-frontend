import React from "react";

const BookCard = ({ title, author, image, coverText, className = "" }) => (
  <article className={`box-border w-full max-w-[min(260px,40vh)] flex flex-col shadow-2xl transition-transform hover:-translate-y-2 cursor-pointer mx-auto rounded-[5px] ${className}`}>
    
    {/* Cover Area */}
    <div className="box-border w-full aspect-[260/360] bg-black/20 backdrop-blur-md rounded-t-[5px] overflow-hidden border border-white/20 flex items-center justify-center relative">
      {image ? (
        <img src={image} alt={title} className="object-cover w-full h-full" />
      ) : (
        <div className={`w-full h-full flex items-center justify-center bg-white/10 p-4 text-center ${coverText ? "text-white text-[clamp(16px,2vw,30px)] font-bold tracking-wider" : "text-white/30"}`} style={{ fontFamily: "'Aldrich', sans-serif" }}>
            {coverText || "No Image"}
        </div>
      )}
    </div>
    
    {/* Label Area */}
    <div className="box-border w-full bg-white/90 backdrop-blur-md rounded-b-[5px] py-2 px-3 text-center h-[clamp(50px,8vh,70px)] flex flex-col justify-center">
      <div className="font-bold text-black text-[clamp(12px,1.5vw,20px)] truncate leading-tight" style={{ fontFamily: "'Aldrich', sans-serif" }}>
        {title}
      </div>
      {author && (
        <div className="font-normal text-gray-700 text-[clamp(10px,1.2vw,16px)] truncate" style={{ fontFamily: "'Aldrich', sans-serif" }}>
          {author}
        </div>
      )}
    </div>
  </article>
);

export default BookCard;