import React, { useState, useEffect } from "react";
import {
  fetchMovies,
  fetchPopularMovies,
  fetchTopRatedMovies,
  fetchTrendingTVToday,
} from "../api/tmdb";
import MovieSection from "../components/MovieSection";

const Home = () => {
  const [hotMovies, setHoMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [hotTvshows, setHotTvshows] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);

  useEffect(() => {
    const loadMovies = async () => {
      const hotMovies = await fetchMovies();
      const popularMovies = await fetchPopularMovies();
      const hotTvShows = await fetchTrendingTVToday();
      const topRatedMovies = await fetchTopRatedMovies();

      setHoMovies(hotMovies);
      setPopularMovies(popularMovies);
      setHotTvshows(hotTvShows);
      setTopRatedMovies(topRatedMovies);
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
          media_type: movie.media_type,
          poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        }))}
        movieid={hotMovies.map((movie) => ({
          id: movie.id,
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
        movieid={popularMovies.map((movie) => ({
          id: movie.id,
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
        movieid={hotTvshows.map((movie) => ({
          id: movie.id,
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
        movieid={topRatedMovies.map((movie) => ({
          id: movie.id,
        }))}
      />
    </div>
  );
};

export default Home;
