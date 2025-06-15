import React from "react";

import {
  fetchMovies,
  fetchPopularMovies,
  fetchTopRatedMovies,
  fetchTrendingTVToday,
} from "../api/tmdb";
import MovieSection from "../components/MovieSlider";
import { useQuery } from "@tanstack/react-query";

const Home = () => {
  const { data: hotMovies = [] } = useQuery({
    queryKey: ["hotMovies"],
    queryFn: fetchMovies,
  });

  const { data: popularMovies = [] } = useQuery({
    queryKey: ["popularMovies"],
    queryFn: fetchPopularMovies,
  });

  const { data: hotTvShows = [] } = useQuery({
    queryKey: ["hotTvShows"],
    queryFn: fetchTrendingTVToday,
  });

  const { data: topRatedMovies = [] } = useQuery({
    queryKey: ["topRatedMovies"],
    queryFn: fetchTopRatedMovies,
  });

  return (
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
        movies={hotTvShows.map((movie) => ({
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
