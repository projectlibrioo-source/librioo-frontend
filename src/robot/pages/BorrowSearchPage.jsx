import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import RobotLayout from "../layouts/RobotLayout";
import SearchBar from "../components/SearchBar";
import BookCard from "../components/BookCard";
import { searchBooksByName, borrowBookWithRobot } from "../../BackendFunctions";

const TIMEOUT_SECONDS = 60;

const BorrowSearchPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [bookData, setBookData] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isBorrowing, setIsBorrowing] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const userData = location.state?.user || {};

  // --- Session timeout: reset on any user interaction ---
  const resetTimeout = useCallback(() => {
    if (timeoutId) clearTimeout(timeoutId);
    const id = setTimeout(() => {
      navigate("/robot/login");
    }, TIMEOUT_SECONDS * 1000);
    setTimeoutId(id);
  }, [timeoutId, navigate]);

  // Start timeout on mount, clear on unmount
  useEffect(() => {
    resetTimeout();
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- Search handler ---
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setSelectedBook(null);
    resetTimeout();
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    resetTimeout();

    setIsLoading(true);
    setSelectedBook(null);
    try {
      const results = await searchBooksByName(searchQuery);
      setBookData(results || []);
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookClick = (book) => {
    setSelectedBook(book);
    resetTimeout();
  };

  // --- BORROW: call the API then go to EndingPage ---
  const handleBorrow = async () => {
    if (!selectedBook) {
      alert("Please select a book first!");
      return;
    }

    const libraryId = userData.id || userData.libraryID || userData.libraryId;
    const bookId = selectedBook.bookId || selectedBook.id;
    const category = userData.category || selectedBook.category || "Standard";

    if (!libraryId || !bookId) {
      alert("Missing user or book information. Cannot process borrow.");
      console.error("Missing data — libraryId:", libraryId, "bookId:", bookId);
      return;
    }

    setIsBorrowing(true);
    try {
      const result = await borrowBookWithRobot(libraryId, bookId, category);

      if (result?.error === "NOT_ELIGIBLE") {
        alert("You are not eligible to borrow: you may have reached your loan limit or have overdue books.");
        return;
      } else if (result?.error) {
        alert("Failed to record borrow: " + result.message);
        return;
      }

      // Success — navigate to ending
      navigate("/robot/ending");
    } catch (e) {
      console.error("Borrow error:", e);
      alert("An unexpected error occurred. Please try again.");
    } finally {
      setIsBorrowing(false);
    }
  };

  // --- Cancel: end session ---
  const handleCancel = () => {
    navigate("/robot/login");
  };

  return (
    <RobotLayout>
      <div className="h-full flex flex-col px-[20px] md:px-[65px] pb-[clamp(12px,2vh,24px)] overflow-hidden relative">

        {/* Holographic glowing background orb */}
        <div className="absolute top-0 right-0 w-[clamp(250px,40vw,500px)] h-[clamp(250px,40vw,500px)] bg-cyan-400/10 blur-[120px] rounded-full z-0 pointer-events-none" />

        <h1 className="z-10 flex-shrink-0 ml-[80px] mb-[clamp(8px,1.5vh,16px)] [font-family:'ADLaM_Display-Regular',Helvetica] font-normal text-[#caf9ff] text-[clamp(20px,3.5vh,40px)] leading-tight drop-shadow-lg">
          Select a Book to{" "}
          <span className="text-white">Borrow</span>
        </h1>

        {/* Glassmorphic container */}
        <div className="z-10 relative flex flex-col flex-1 min-h-0 overflow-hidden bg-black/10 backdrop-blur-md border border-white/20 rounded-[30px] shadow-2xl">
          <div className="w-full h-full overflow-y-auto custom-scrollbar pl-[40px] pr-6 pt-[clamp(15px,2.5vh,30px)]">

            {/* Search and action buttons row */}
            <div className="flex flex-col lg:flex-row items-center lg:items-start w-full gap-6 lg:gap-[clamp(30px,5vw,60px)] pr-4 lg:pr-0">
              <div className="w-full ml-0 lg:ml-[40px] flex-1 max-w-[630px] min-w-0 lg:mt-2">
                <SearchBar
                  query={searchQuery}
                  onChange={handleSearchChange}
                  onSubmit={handleSearchSubmit}
                  placeholder="Enter book title..."
                  className="w-full"
                />
              </div>

              {/* Action buttons */}
              <div className="w-full lg:w-[clamp(180px,20vw,240px)] mr-0 lg:mr-[40px] flex-shrink-0 flex flex-row lg:flex-col gap-4 lg:mt-2">

                {/* Cancel button */}
                <button
                  id="borrow-search-cancel-btn"
                  type="button"
                  onClick={handleCancel}
                  className="
                    relative transition-all duration-300 rounded-2xl hover:-translate-y-1
                    focus:outline-none flex-1 min-h-[50px] md:min-h-[66px]
                    bg-black/10 backdrop-blur-md border border-white/40
                    flex items-center justify-center
                    hover:bg-white/20 px-6
                  "
                >
                  <span
                    className="text-[clamp(14px,1.6vh,20px)] text-white font-bold tracking-wide"
                    style={{ fontFamily: "'Aldrich', sans-serif" }}
                  >
                    CANCEL
                  </span>
                </button>

                {/* BORROW button */}
                <button
                  id="borrow-search-borrow-btn"
                  type="button"
                  onClick={handleBorrow}
                  disabled={!selectedBook || isBorrowing}
                  className={`
                    relative group rounded-2xl p-[2px] overflow-hidden transition-transform
                    focus:outline-none flex-1 min-h-[50px] md:min-h-[66px]
                    ${!selectedBook || isBorrowing
                      ? "opacity-50 cursor-not-allowed grayscale"
                      : "hover:scale-[1.02]"
                    }
                  `}
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-[#ff7421] via-[#ffaa77] to-[#ff7421] rounded-2xl opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="h-full min-h-[50px] md:min-h-[66px] w-full relative bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl flex items-center justify-center transition-colors duration-300 group-hover:bg-white/30 px-6">
                    <span
                      className="text-[clamp(14px,1.6vh,20px)] text-white font-bold tracking-wide drop-shadow-md whitespace-nowrap"
                      style={{ fontFamily: "'Aldrich', sans-serif" }}
                    >
                      {isBorrowing ? "BORROWING..." : "BORROW"}
                    </span>
                  </div>
                </button>

              </div>
            </div>

            {/* Book grid */}
            <section className="mt-[clamp(30px,4vh,80px)] mr-[60px] mb-[40px] grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-[30px] gap-y-[clamp(30px,4vh,80px)] pr-4 pb-10">

              {/* Loading */}
              {isLoading && (
                <div className="col-span-full flex flex-col items-center justify-center text-[#caf9ff] opacity-80 animate-pulse gap-4 pt-10">
                  <div className="w-10 h-10 border-4 border-[#ff7421] border-t-transparent rounded-full animate-spin" />
                  <span className="text-xl" style={{ fontFamily: "'Aldrich', sans-serif" }}>
                    Scanning Library...
                  </span>
                </div>
              )}

              {/* Empty after search */}
              {!isLoading && bookData.length === 0 && searchQuery !== "" && (
                <div className="pt-10 text-xl text-center col-span-full text-white/60" style={{ fontFamily: "'Aldrich', sans-serif" }}>
                  No books found named "{searchQuery}".
                </div>
              )}

              {/* Initial state */}
              {!isLoading && bookData.length === 0 && searchQuery === "" && (
                <div className="pt-10 text-xl text-center col-span-full text-white/40" style={{ fontFamily: "'Aldrich', sans-serif" }}>
                  Type a title above to find your book.
                </div>
              )}

              {/* Book cards */}
              {!isLoading &&
                bookData.map((book) => {
                  const isSelected =
                    selectedBook &&
                    (selectedBook.id === book.id || selectedBook.title === book.title);
                  return (
                    <div
                      key={book.id || Math.random()}
                      onClick={() => handleBookClick(book)}
                      className="flex justify-center min-w-0 cursor-pointer rounded-xl transition-all duration-300"
                    >
                      <BookCard
                        title={book.title || book.bookName || "Unknown Title"}
                        author={book.author || book.writer || "Unknown Author"}
                        image={book.image || book.imgUrl || null}
                        className={
                          isSelected
                            ? "ring-4 ring-[#ff7421] shadow-[0_0_25px_rgba(255,116,33,0.5)]"
                            : ""
                        }
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

export default BorrowSearchPage;
