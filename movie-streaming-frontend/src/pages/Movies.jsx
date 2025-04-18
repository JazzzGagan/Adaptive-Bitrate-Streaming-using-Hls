import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";

const Movies = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [trailer, setTrailer] = useState(null);
  const apiKey = import.meta.env.VITE_API_KEY;

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const movie = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=en-US`
        );
        setMovie(movie.data);

        const videoRes = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${apiKey}&language=en-US`
        );
        const youtubeTrailer = videoRes.data.results.find(
          (vid) => vid.site === "YouTube" && vid.type === "Trailer"
        );
        setTrailer(youtubeTrailer);
      } catch (error) {
        console.error("Failed to fetch movie details", error);
      }
    };
    fetchDetails();
  }, [id]);

  if (!id) return <p>id not found</p>;
  if (!movie) return <p className="text-white text-center mt-10">Loading...</p>;

  return (
    <div className="w-full  bg-black text-white font-custom">
      {/* BACKDROP */}
      <div
        className="relative w-full h-[60vh] bg-cover bg-center"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original/${movie.backdrop_path})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/90"></div>
      </div>

      {/* CONTENT */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 -mt-40 relative z-10 flex flex-col md:flex-row items-start gap-6">
        {/* POSTER */}
        <div className="w-40 md:w-60 shrink-0 shadow-lg">
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className="w-full rounded-lg"
          />
        </div>

        {/* DETAILS */}
        <div className="flex-1 mt-4 md:mt-0">
          <h1 className="text-3xl md:text-5xl font-bold mb-2">
            {movie?.title?.replace(/\*/g, "")}{" "}
            <span className="text-gray-400 text-xl">
              ({movie.release_date?.split("-")[0]})
            </span>
          </h1>
          <div className="flex items-center text-sm text-gray-300 gap-4 mt-2">
            <span>{movie.runtime} mins</span>
            <span className="uppercase">{movie.original_language}</span>
            <span>{movie.vote_average} ⭐</span>
          </div>

          {/* GENRES */}
          <div className="mt-3 flex flex-wrap gap-2 text-sm">
            {movie.genres?.map((genre) => (
              <span
                key={genre.id}
                className="bg-white/10 px-2 py-1 rounded-full"
              >
                {genre.name}
              </span>
            ))}
          </div>

          {/* OVERVIEW */}
          <p className="mt-4 text-gray-200 leading-relaxed">{movie.overview}</p>

          {/* PLAY BUTTON */}
          <button className="mt-6 bg-background2 px-6 py-2 rounded-full text-white font-semibold shadow-lg flex items-center gap-2">
            <FontAwesomeIcon icon={faPlay} /> Play
          </button>
        </div>
      </div>

      {/* TRAILER */}
      {trailer && (
        <div className="max-w-6xl mx-auto px-4 md:px-8 mt-16 mb-6">
          <h2 className="text-2xl font-semibold mb-4">Trailer</h2>
          <div className="w-full aspect-video">
            <iframe
              src={`https://www.youtube.com/embed/${trailer.key}`}
              className="w-full h-full rounded-lg"
              frameBorder="0"
              allowFullScreen
              title="Trailer"
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
};

export default Movies;
