import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RobotLayout from "../layouts/RobotLayout";
import SearchBar from "../components/SearchBar";
import BookCard from "../components/BookCard";
import GuideButton from "../components/GuideButton";
import CancelButton from "../components/CancelButton";
import { getCategories, navigateByCategory } from "../../BackendFunctions";

const SearchCategory = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState([]); 
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingLocation, setIsCheckingLocation] = useState(false);

  useEffect(() => {
    async function fetchCats() {
        setIsLoading(true);
        const data = await getCategories();
        if (data && data.length > 0) {
            setCategories(data);
        } else {
            setCategories(["SCIENCE", "FICTION", "HISTORY", "TECHNOLOGY"]); 
        }
        setIsLoading(false);
    }
    fetchCats();
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setSelectedCategory(null);
  };

  const handleManualSubmit = (e) => {
      e.preventDefault();
      if (visibleCategories.length > 0) {
          setSelectedCategory(visibleCategories[0]);
      }
  };

  const handleCategoryClick = (catName) => {
      setSearchQuery(catName);
      setSelectedCategory(catName); 
  };

  const handleGuideClick = async () => {
    if (!selectedCategory) {
        alert("Please select a category first!");
        return;
    }

    setIsCheckingLocation(true); 
    console.log("Sending navigation command for:", selectedCategory);

    try {
      const success = await navigateByCategory(selectedCategory);
      if (success) {
        navigate("/robot/follow"); 
      } 
    } catch (error) {
      console.error("Error sending command:", error);
      alert("System Error: Could not connect to robot.");
    } finally {
      setIsCheckingLocation(false);
    }
  };

  const visibleCategories = categories.filter(c => 
      c.toUpperCase().includes(searchQuery.toUpperCase())
  );

  return (
    <RobotLayout>
      <div className="h-full flex flex-col px-[20px] md:px-[65px] pb-[clamp(12px,2vh,24px)] overflow-hidden relative">
        
        {/* Holographic glowing background orb */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-400/10 blur-[120px] rounded-full z-0 pointer-events-none"></div>

        <h1 className="z-10 flex-shrink-0 ml-[80px] mb-[clamp(8px,1.5vh,16px)] [font-family:'ADLaM_Display-Regular',Helvetica] font-normal text-[#caf9ff] text-[clamp(20px,3.5vh,40px)] leading-tight drop-shadow-lg">
          Search Book By <span className="text-white">Category</span>
        </h1>

        {/* The Glassmorphic Container replacing BackgroundContainer */}
        <div className="z-10 relative flex flex-col flex-1 min-h-0 overflow-hidden bg-black/10 backdrop-blur-md border border-white/20 rounded-[30px] shadow-2xl">
          <div className="w-full h-full overflow-y-auto custom-scrollbar pl-[40px] pr-6 pt-[clamp(15px,2.5vh,30px)]">
            
            {/* Search and buttons */}
            <div className="flex flex-row items-start w-full gap-[clamp(30px,5vw,60px)]">
              <div className="ml-[40px] flex-1 max-w-[630px] min-w-0 mt-2">
                <SearchBar
                  query={searchQuery}
                  onChange={handleSearchChange}
                  onSubmit={handleManualSubmit}
                  placeholder="Search categories..."
                  className="w-full"
                />
              </div>

              <div className="mr-[40px] w-[clamp(180px,20vw,240px)] flex-shrink-0 flex flex-col gap-4 mt-2">
                <CancelButton className="w-full" />
                <GuideButton 
                    disabled={!selectedCategory || isCheckingLocation} 
                    onClick={handleGuideClick}
                    className="w-full" 
                />
                
                {isCheckingLocation && <p className="text-sm font-bold tracking-wide text-[#ff7421] text-center animate-pulse" style={{ fontFamily: "'Aldrich', sans-serif" }}>Checking Shelf...</p>}
              </div>
            </div>

            {/* Grid section */}
            <section className="mt-[clamp(30px,4vh,80px)] mr-[60px] mb-[40px] grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-[30px] gap-y-[clamp(30px,4vh,80px)] pr-4 pb-10">
              
              {/* LOADING STATE */}
              {isLoading && (
                <div className="col-span-full flex flex-col items-center justify-center text-[#caf9ff] opacity-80 animate-pulse gap-4 pt-10">
                  <div className="w-10 h-10 border-4 border-[#ff7421] border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-xl" style={{ fontFamily: "'Aldrich', sans-serif" }}>Loading Categories...</span>
                </div>
              )}

              {/* CATEGORY CARDS */}
              {!isLoading && visibleCategories.map((category, index) => (
                <div key={index} className="flex justify-center min-w-0" onClick={() => handleCategoryClick(category)}>
                  <BookCard
                    title={category}
                    image={null}
                    coverText={category} 
                    author=""
                    className={`
                      ${selectedCategory === category ? 'ring-4 ring-[#ff7421] scale-105 shadow-[0_0_25px_rgba(255,116,33,0.5)]' : ''}
                    `}                  
                  />
                </div>
              ))}

              {/* No Results Message */}
              {!isLoading && visibleCategories.length === 0 && (
                <div className="pt-10 text-xl text-center col-span-full text-white/60" style={{ fontFamily: "'Aldrich', sans-serif" }}>
                  No categories found matching "{searchQuery}".
                </div>
              )}

            </section>
          </div>
        </div>
      </div>
    </RobotLayout>
  );
};

export default SearchCategory;