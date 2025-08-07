const apiKey = import.meta.env.VITE_API_KEY;
const baseUrl = import.meta.env.VITE_BASE_URL;

export const getContinueWatchingMovies = async (userId) => {
  const res = await fetch(
    `http://127.0.0.1:5000/watchprogress?userId=${userId}`
  );
  const data = await res.json();

  const movieDetailPromises = data.map(async (item) => {
    const tmdbRes = await fetch(
      `${baseUrl}/movie/${item.movieId}?api_key=${apiKey}`
    );
    const movieData = await tmdbRes.json();

    return {
      ...movieData,
      progress: item.progress,
      totalDuration: item.totalDuration,
      completed: item.completed,
    };
  });
  return Promise.all(movieDetailPromises);
};
<<<<<<< HEAD
=======

export const getRecommendedMovies = async (userId) => {
  const res = await fetch(`http://127.0.0.1:5000/recommend?userId=${userId}`);

  const data = await res.json();

  const movieDetailPromises = data.map(async (movie) => {
    const tmdbRes = await fetch(
      `${baseUrl}/movie/${movie.id}?api_key=${apiKey}`
    );
    const movieData = await tmdbRes.json();
    return movieData;
  });
  const movies = await Promise.all(movieDetailPromises);
  return movies;
};

>>>>>>> 9c939ad (Recommend movies using tf-idf vector spacing method and find movie similarity using cosine)
export const fetchMovies = async () => {
  const res = await fetch(`${baseUrl}/trending/movie/day?api_key=${apiKey}`);
  const data = await res.json();

  return data.results;
};

export const fetchPopularMovies = async () => {
  const res = await fetch(`${baseUrl}/movie/popular?api_key=${apiKey}`);
  const data = await res.json();
  return data.results;
};
export const fetchTopRatedMovies = async () => {
  const res = await fetch(`${baseUrl}/movie/top_rated?api_key=${apiKey}`);
  const data = await res.json();
  return data.results;
};
export const fetchTrendingTVToday = async () => {
  const res = await fetch(`${baseUrl}/trending/tv/day?api_key=${apiKey}`);
  const data = await res.json();
  return data.results;
};
