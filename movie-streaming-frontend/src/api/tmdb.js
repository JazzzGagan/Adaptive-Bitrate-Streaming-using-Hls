const apiKey = import.meta.env.VITE_API_KEY;
const baseUrl = import.meta.env.VITE_BASE_URL;

export const fetchMovies = async () => {
  const res = await fetch(`${baseUrl}/trending/movie/day?api_key=${apiKey}`);
  const data = await res.json();
  return data.results;
};
