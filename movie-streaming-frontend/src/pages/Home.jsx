import React, { useContext } from "react";

import {
  fetchMovies,
  fetchPopularMovies,
  fetchTopRatedMovies,
  fetchTrendingTVToday,
  getContinueWatchingMovies,
  getRecommendedMovies,
} from "../api/tmdb";
import MovieCard from "../components/MovieCard";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../context/Contexts";

const Home = () => {
  const { userinfo } = useContext(AuthContext);

  const { data: continueWatchingMovies = [] } = useQuery({
    queryKey: ["continueWatching", userinfo?.user_id],
    queryFn: () => getContinueWatchingMovies(userinfo?.user_id),
    enabled: !!userinfo?.user_id,
  });

  const { data: recommendMovies = [] } = useQuery({
    queryKey: ["recommendMovies"],
    queryFn: () => getRecommendedMovies(userinfo?.user_id),
    enabled: !!userinfo?.user_id,
  });

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
    <div className=" md:w-[90%] mx-auto min-h-screen mt-4 px-2 overflow-x-hidden md:space-y-8  md:py-6">
      {continueWatchingMovies.length > 0 && (
        <MovieCard
          title="Continue Watching"
          movies={continueWatchingMovies.map((movie) => ({
            id: movie.id,
            title: movie.title,
            media_type: movie.media_type || "movie",
            poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            progress: movie.progress,
            totalDuration: movie.totalDuration,
            completed: movie.completed,
          }))}
        />
      )}

      <MovieCard
        title="Movies Might you Like"
        movies={recommendMovies.map((movie) => ({
          id: movie.id,
          title: movie.title,
          media_type: movie.media_type,
          poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        }))}
      />

      <MovieCard
        title="Today's Hot Movies"
        movies={hotMovies.map((movie) => ({
          id: movie.id,
          title: movie.title,
          media_type: movie.media_type,
          poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        }))}
      />
      <MovieCard
        title="Popular Movies"
        movies={popularMovies.map((movie) => ({
          id: movie.id,
          title: movie.title,
          media_type: movie.media_type,
          poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        }))}
      />
      <MovieCard
        title="Today's Hot TV Shows"
        movies={hotTvShows.map((movie) => ({
          id: movie.id,
          title: movie.name,
          media_type: movie.media_type,
          poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        }))}
      />
      <MovieCard
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
