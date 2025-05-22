import React, { useContext } from "react";
import { SearchContext } from "../context/Contexts";
import MovieSection from "../components/MovieSection";

const Search = () => {
  const { searchResult, hasSearched } = useContext(SearchContext);

  const hasResults = searchResult && searchResult.length > 0;

  return (
    <div className="w-[90%] mx-auto min-h-screen py-10 space-y-8  text-white">
      <div className="text-center">
        <h1 className="text-3xl font-semibold mb-2">Search Results</h1>
      </div>
      {hasSearched && (
        <div className="text-center">
          <p className="text-gray-400">
            {hasResults
              ? `Found ${searchResult.length} result(s)`
              : "No results found."}
          </p>
        </div>
      )}

      {hasResults && (
        <MovieSection
          title="Search Results"
          movies={searchResult.map((movie) => ({
            id: movie.id,
            title: movie.title || movie.name,
            media_type: movie.media_type,
            poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
          }))}
        />
      )}
    </div>
  );
};

export default Search;
