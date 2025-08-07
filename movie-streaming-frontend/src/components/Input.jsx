import React, { useContext, useState, useEffect } from "react";
import { searchByQuery } from "../api/movieServices";

import { SearchContext } from "../context/Contexts";
import { useNavigate } from "react-router-dom";

const Input = ({ setIsSearchActive }) => {
  const [inputValue, setInputValue] = useState("");

  const [prevSearch, setPrevSearch] = useState(() => {
    const stored = localStorage.getItem("searchHistory");

    return stored ? JSON.parse(stored) : [];
  });

  const { setSearchResult, setHasSearched } = useContext(SearchContext);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputValue(val);

    /*   if (val.trim() === "") {
      setSearchResult([]);
    } */
  };

  const handleKeyPress = (e) => {
    if (e.key == "Enter") {
      const query = inputValue.trim();
      console.log(query);
      
      if (!query) return;
      setIsSearchActive(false);

      if (!prevSearch.includes(query)) {
        const updateSearch = [...prevSearch, query];
        setPrevSearch(updateSearch);
        localStorage.setItem("searchHistory", JSON.stringify(updateSearch));
      }
      sendValue(query);
      setInputValue("");
    }
  };

  const handleSuggestionClick = (item) => {
    setInputValue(item);
    setIsSearchActive(false);
    sendValue(item);
  };

  const sendValue = async (query) => {
    if (query !== "") {
      try {
        const response = await searchByQuery(query);
        setSearchResult(response.data.results);
        setHasSearched(true);
        navigate("/search");
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    }
  };
  return (
    <>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyPress}
        placeholder="Search item here"
<<<<<<< HEAD
        className="w-[80%] bg-black text-white h-12 text-lg px-4 z-[500] outline-none"
      />
      <div className=" w-[80%] h-auto flex space-x-4  absolute z-[1000] top-20">
=======
        className="w-[80%] bg-black text-white h-12 text-base md:text-lg px-4 z-[500] outline-none"
      />
      <div className=" hidden  md:w-[80%] h-auto md:flex md:space-x-4 text-sm absolute z-[1000] top-20">
>>>>>>> 9c939ad (Recommend movies using tf-idf vector spacing method and find movie similarity using cosine)
        {prevSearch &&
          prevSearch
            .slice()
            .reverse()
            .map((item, index) => (
              <div
                key={index}
                className="text-white   cursor-pointer   "
                onClick={() => handleSuggestionClick(item)}
              >
                {item}
              </div>
            ))}
      </div>
    </>
  );
};

export default Input;
