import axios from "axios";

const baseUrl = import.meta.env.VITE_BASE_URL;
const apiKey = import.meta.env.VITE_API_KEY;

export const getMediaById = (id, type) =>
  axios.get(
    `${baseUrl}/${type ? type : "movie"}/${id}?api_key=${apiKey}&language=en-US`
  );

export const getMediaTrailer = (id, type) =>
  axios.get(
    `${baseUrl}/${
      type ? type : "movie"
    }/${id}/videos?api_key=${apiKey}&language=en-US`
  );

export const searchByQuery = (query) =>
  axios.get(`${baseUrl}/search/movie?query=${query}&api_key=${apiKey}`);

export const movieDetail = (id) =>
  axios.get(`${baseUrl}/movie/${id}?api_key=${apiKey}`);
