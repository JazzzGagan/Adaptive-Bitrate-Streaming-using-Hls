import React, { useState } from "react";
import { SearchContext } from "./Contexts";

export const SearchProvider = ({ children }) => {
  const [searchResult, setSearchResult] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  return (
    <SearchContext.Provider
      value={{ searchResult, setSearchResult, hasSearched, setHasSearched }}
    >
      {children}
    </SearchContext.Provider>
  );
};
