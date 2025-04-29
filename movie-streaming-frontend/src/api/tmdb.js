const apiKey = import.meta.env.VITE_API_KEY;
const baseUrl = import.meta.env.VITE_BASE_URL;

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
