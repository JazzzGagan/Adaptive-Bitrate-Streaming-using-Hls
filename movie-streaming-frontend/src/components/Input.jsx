import React, { useContext, useState, useEffect } from "react";
import { searchByQuery } from "../api/movieServices";
import MovieSection from "./MovieSlider";
import { SearchContext } from "../context/Contexts";
import { Link, useNavigate } from "react-router-dom";

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
      setIsSearchActive(false);
      const query = inputValue.trim().toLowerCase();
      if (!query) return;

      if (!prevSearch.includes(query)) {
        setPrevSearch((prevItems) => [...prevItems, query]);
      }
      sendValue();
    }
  };
  useEffect(() => {
    localStorage.setItem("searchHistory", JSON.stringify(prevSearch));
  }, [prevSearch]);

  const sendValue = async () => {
    const query = inputValue.trim();
    if (query !== "") {
      try {
        const response = await searchByQuery(query);
        setSearchResult(response.data.results);

        setHasSearched(true);

        navigate("/search");
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setInputValue("");
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
        className="w-[80%] bg-black text-white h-12 text-lg px-4 z-[500] outline-none"
      />
      <div className=" w-[80%] h-auto flex space-x-4  absolute z-[1000] top-20">
        {prevSearch &&
          prevSearch
            .slice()
            .reverse()
            .map((item, index) => (
              <div
                key={index}
                className="text-white   cursor-pointer   "
                onClick={() => {
                  setInputValue(item), sendValue();
                }}
              >
                {item}
              </div>
            ))}
      </div>
    </>
  );
};

export default Input;
