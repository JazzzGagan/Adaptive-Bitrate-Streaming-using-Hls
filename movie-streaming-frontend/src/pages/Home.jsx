import React, { useState, useEffect, useContext } from "react";

import {
  fetchMovies,
  fetchPopularMovies,
  fetchTopRatedMovies,
  fetchTrendingTVToday,
} from "../api/tmdb";
import MovieSection from "../components/MovieSection";
import { SearchContext } from "../context/Contexts";

const Home = () => {
  

  const [hotMovies, setHotMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [hotTvshows, setHotTvshows] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);

  useEffect(() => {
    const loadMovies = async () => {
      const hotMovies = await fetchMovies();
      const popularMovies = await fetchPopularMovies();
      const hotTvShows = await fetchTrendingTVToday();
      const topRatedMovies = await fetchTopRatedMovies();

      setHotMovies(hotMovies);
      setPopularMovies(popularMovies);
      setHotTvshows(hotTvShows);
      setTopRatedMovies(topRatedMovies);
    };
    loadMovies();
  }, []);

  return  (
    <div className="w-[90%] mx-auto bg-black flex-grow-5 min-h-screen space-y-8 py-6">
      <MovieSection
        title="Today's Hot Movies"
        movies={hotMovies.map((movie) => ({
          id: movie.id,
          title: movie.title,
          media_type: movie.media_type,
          poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        }))}
      />
      <MovieSection
        title="Popular Movies"
        movies={popularMovies.map((movie) => ({
          id: movie.id,
          title: movie.title,
          media_type: movie.media_type,
          poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        }))}
      />
      <MovieSection
        title="Today's Hot TV Shows"
        movies={hotTvshows.map((movie) => ({
          id: movie.id,
          title: movie.name,
          media_type: movie.media_type,
          poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        }))}
      />
      <MovieSection
        title="Top IMDB Rated Movies"
        movies={topRatedMovies.map((movie) => ({
          id: movie.id,
          title: movie.title,
          media_type: movie.media_type,
          poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        }))}
      />
    </div>
  );
};

export default Home;
