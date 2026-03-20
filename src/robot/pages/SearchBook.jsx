import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import RobotLayout from "../layouts/RobotLayout";
import SearchBar from "../components/SearchBar";
import BookCard from "../components/BookCard";
import GuideButton from "../components/GuideButton";
import CancelButton from "../components/CancelButton";

import { searchBooksByName, navigateByBookName } from "../../BackendFunctions";

const SearchBook = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [bookData, setBookData] = useState([]); 
  const [selectedBook, setSelectedBook] = useState(null); // <-- Added selected state
  const [isLoading, setIsLoading] = useState(false); 
  const [isCheckingLocation, setIsCheckingLocation] = useState(false);
  
  const navigate = useNavigate();

  // Reset selection if they start typing a new query
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setSelectedBook(null); 
  };

  // SEARCH HANDLER
  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setSelectedBook(null); // Reset selection on new search

    try {
        console.log("Searching backend for:", searchQuery);
        const results = await searchBooksByName(searchQuery);
        console.log("Backend results:", results);
        
        // Update the screen, fallback to empty array if null
        setBookData(results || []); 

    } catch (error) {
        console.error("Error fetching books:", error);
        alert("Failed to connect to the library server.");
    } finally {
        setIsLoading(false);
    }
  };

  // BOOK CLICK HANDLER
  const handleBookClick = (book) => {
      setSelectedBook(book);
      // Optional: Update the search bar to show the selected book's name
      // setSearchQuery(book.title || book.bookName); 
  };

  // GUIDE ME HANDLER
  const handleGuideMe = async () => {
    if (!selectedBook) {
        alert("Please select a book from the list first!");
        return;
    }

    setIsCheckingLocation(true);
    
    // Safely get the name of the selected book based on your data structure
    const targetBookName = selectedBook.title || selectedBook.bookName;
    console.log("Guiding to book:", targetBookName);

    try {
      await navigateByBookName(targetBookName);
      navigate("/robot/follow");
    } catch (error) {
      console.error("Error sending command:", error);
      alert("System Error: Could not connect to robot.");
    } finally {
      setIsCheckingLocation(false);
    }
  };

  return (
    <RobotLayout>
      <div className="h-full flex flex-col px-[20px] md:px-[65px] pb-[clamp(12px,2vh,24px)] overflow-hidden relative">
        
        {/* Holographic glowing background orb */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-400/10 blur-[120px] rounded-full z-0 pointer-events-none"></div>

        <h1 className="z-10 flex-shrink-0 ml-[80px] mb-[clamp(8px,1.5vh,16px)] [font-family:'ADLaM_Display-Regular',Helvetica] font-normal text-[#caf9ff] text-[clamp(20px,3.5vh,40px)] leading-tight drop-shadow-lg">
          Search Book By <span className="text-white">Name</span>
        </h1>

        {/* The Glassmorphic Container */}
        <div className="z-10 relative flex flex-col flex-1 min-h-0 overflow-hidden bg-black/10 backdrop-blur-md border border-white/20 rounded-[30px] shadow-2xl">
          <div className="w-full h-full overflow-y-auto custom-scrollbar pl-[40px] pr-6 pt-[clamp(15px,2.5vh,30px)]">
            
            {/* Search and buttons */}
            <div className="flex flex-row items-start w-full gap-[clamp(30px,5vw,60px)]">
              <div className="ml-[40px] flex-1 max-w-[630px] min-w-0 mt-2"> 
                <SearchBar
                  query={searchQuery}
                  onChange={handleSearchChange}
                  onSubmit={handleSearchSubmit}
                  placeholder="Enter book title..."
                  className="w-full"
                />
              </div>

              <div className="mr-[40px] w-[clamp(180px,20vw,240px)] flex-shrink-0 flex flex-col gap-4 mt-2">
                <CancelButton className="w-full" />
                <GuideButton 
                    // Disabled if no book is selected OR location is checking
                    disabled={!selectedBook || isCheckingLocation} 
                    onClick={handleGuideMe} 
                    className="w-full" 
                />
                
                {isCheckingLocation && <p className="text-sm font-bold tracking-wide text-[#ff7421] text-center animate-pulse" style={{ fontFamily: "'Aldrich', sans-serif" }}>Calculating Route...</p>}
              </div>
            </div>

            {/* Grid section */}
            <section className="mt-[clamp(30px,4vh,80px)] mr-[60px] mb-[40px] grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-[30px] gap-y-[clamp(30px,4vh,80px)] pr-4 pb-10">
              
              {/* LOADING STATE */}
              {isLoading && (
                <div className="col-span-full flex flex-col items-center justify-center text-[#caf9ff] opacity-80 animate-pulse gap-4 pt-10">
                  <div className="w-10 h-10 border-4 border-[#ff7421] border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-xl" style={{ fontFamily: "'Aldrich', sans-serif" }}>Scanning Library...</span>
                </div>
              )}

              {/* EMPTY STATE */}
              {!isLoading && bookData.length === 0 && searchQuery !== "" && (
                <div className="pt-10 text-xl text-center col-span-full text-white/60" style={{ fontFamily: "'Aldrich', sans-serif" }}>
                  No books found named "{searchQuery}".
                </div>
              )}
              
              {/* INITIAL STATE */}
              {!isLoading && bookData.length === 0 && searchQuery === "" && (
                <div className="pt-10 text-xl text-center col-span-full text-white/40" style={{ fontFamily: "'Aldrich', sans-serif" }}>
                  Type a title above to begin your search.
                </div>
              )}

              {/* BOOK CARDS */}
              {!isLoading && bookData.map((book) => {
                // Determine if this specific book is the one currently selected
                const isSelected = selectedBook && (selectedBook.id === book.id || selectedBook.title === book.title);

                return (
                  <div 
                    key={book.id || Math.random()} 
                    onClick={() => handleBookClick(book)}
                    className={`
                      flex justify-center min-w-0 cursor-pointer rounded-xl transition-all duration-300}
                    `}
                  >
                    <BookCard
                      title={book.title || book.bookName || "Unknown Title"} 
                      author={book.author || book.writer || "Unknown Author"}
                      image={book.image || book.imgUrl || null} 
                      className={isSelected ? 'ring-4 ring-[#ff7421] shadow-[0_0_25px_rgba(255,116,33,0.5)]' : ''} // Passed down just in case BookCard uses it
                    />
                  </div>
                );
              })}
            </section>

          </div>
        </div>
      </div>
    </RobotLayout>
  );
};

export default SearchBook;