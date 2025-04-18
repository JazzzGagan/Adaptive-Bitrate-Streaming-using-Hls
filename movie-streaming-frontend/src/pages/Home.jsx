import React, { useState, useEffect } from "react";
import { fetchMovies } from "../api/tmdb";
import MovieSection from "../components/MovieSection";

const Home = () => {
  const [hotMovies, setHoMovies] = useState([]);

  useEffect(() => {
    const loadMovies = async () => {
      const movies = await fetchMovies();
      setHoMovies(movies);
    };
    loadMovies();
  }, []);

  return (
    <div className="bg-black min-h-screen my-0">
      <MovieSection
        title="Today's Hot Movies"
        movies={hotMovies.map((movie) => ({
          id: movie.id,
          title: movie.title,
          poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        }))}
        movieid={hotMovies.map((movie) => ({
          id: movie.id,
        }))}
      />
    </div>
  );
};

export default Home;
