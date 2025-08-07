import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faTimes,
  faThumbsUp,
  faThumbsDown,
  faStar,
} from "@fortawesome/free-solid-svg-icons";

import Watch from "./Watch.jsx";
import {
  getMediaById,
  getMediaTrailer,
  getTvSeasonEpisodes,
} from "../api/movieServices.js";

const Movies = () => {
  const { id, type } = useParams();
  const [movie, setMovie] = useState(null);
<<<<<<< HEAD
=======
  console.log("movies", movie);

>>>>>>> 9c939ad (Recommend movies using tf-idf vector spacing method and find movie similarity using cosine)
  const [trailer, setTrailer] = useState(null);
  const [showPlayer, setShowPlayer] = useState(false);
  const [expandedSeason, setExpandedSeason] = useState(1);
  const [seasonEpisodes, setSeasonEpisodes] = useState({});
  const location = useLocation();
  const progress = location.state?.progress || false;

  useEffect(() => {
    if (progress) {
      setShowPlayer(true);
    }
  }, [progress]);

  useEffect(() => {
    setMovie(null);
    setTrailer(null);
    setExpandedSeason(null);
    setSeasonEpisodes({});

    const fetchDetails = async () => {
      try {
        const movieRes = await getMediaById(id, type);
        setMovie(movieRes.data);

        const trailerRes = await getMediaTrailer(id, type);
        const youtubeTrailer = trailerRes?.data?.results?.find(
          (vid) => vid.site === "YouTube" && vid.type === "Trailer"
        );
        setTrailer(youtubeTrailer);
      } catch (error) {
        console.error("Failed to fetch movie details", error);
      }
    };

    fetchDetails();
  }, [id, type]);

  useEffect(() => {
    const fetchEpisodes = async () => {
      if (!seasonEpisodes[expandedSeason]) {
        try {
          const res = await getTvSeasonEpisodes(id, expandedSeason);
          setSeasonEpisodes((prev) => ({
            ...prev,
            [expandedSeason]: res.data.episodes,
          }));
        } catch (err) {
          console.error("Failed to fetch episodes:", err);
        }
      }
    };
    if (type === "tv") fetchEpisodes();
  }, [expandedSeason, id, seasonEpisodes, type]);

  if (!movie) return <p className="text-white text-center mt-10">Loading...</p>;

  return (
    <div className="w-full bg-black text-white font-custom">
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
        <div className="w-40 md:w-60 shrink-0 shadow-lg">
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className="w-full rounded-lg"
          />
        </div>

        <div className="flex-1 mt-4 md:mt-0">
          <h1 className="text-3xl md:text-5xl font-bold mb-2">
            {(movie?.title || movie.name)?.replace(/\*/g, "")}{" "}
            <span className="text-gray-400 text-xl">
              ({(movie.release_date || movie.first_air_date)?.split("-")[0]})
            </span>
          </h1>

          <div className="flex items-center text-sm text-gray-300 gap-4 mt-2">
            <span>{movie.runtime || movie.episode_run_time?.[0]} mins</span>
            <span className="uppercase">{movie.original_language}</span>
            <span>
              {movie.vote_average} <FontAwesomeIcon icon={faStar} />
            </span>
          </div>

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

          <p className="mt-4 text-gray-200 leading-relaxed">{movie.overview}</p>

          <button
            className="mt-6 bg-background2 px-6 py-2 rounded-full text-white font-semibold shadow-lg flex items-center gap-2"
            onClick={() => setShowPlayer(true)}
          >
            <FontAwesomeIcon icon={faPlay} /> Play
          </button>
        </div>
      </div>

      {type === "tv" && movie?.seasons?.length > 0 && (
        <div className="mt-10 px-4 md:px-8 max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">
              {expandedSeason
                ? `Season ${expandedSeason}/${movie?.number_of_seasons}`
                : "Select a season"}
            </h2>
            <select
              value={expandedSeason || ""}
              onChange={(e) => setExpandedSeason(Number(e.target.value))}
              className="bg-white/10 text-white px-3 py-1 rounded"
            >
              <option value="" disabled>
                Select Season
              </option>
              {movie?.seasons?.map((s) => (
                <option key={s.id} value={s.season_number}>
                  Season {s.season_number}
                </option>
              ))}
            </select>
          </div>

          {/* Episodes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {seasonEpisodes[expandedSeason]?.map((ep) => (
              <div
                key={ep.id}
                className="bg-white/5 p-3 rounded-lg hover:bg-white/10 transition"
              >
                <div className="relative">
                  <img
                    src={`https://image.tmdb.org/t/p/w500${ep.still_path}`}
                    alt={ep.name}
                    className="rounded w-full h-40 object-cover mb-2"
                  />
                  <span className="absolute bottom-2 right-2 bg-black/60 text-white text-sm px-2 py-0.5 rounded">
                    <FontAwesomeIcon icon={faStar} />{" "}
                    {ep.vote_average?.toFixed(1) || "N/A"}
                  </span>
                </div>
                <h3 className="text-md font-bold">
                  S{ep.season_number}E{ep.episode_number} — {ep.name}
                </h3>
                <p className="text-sm text-gray-400 mt-1">
                  {new Date(ep.air_date).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}{" "}
                  • {ep.runtime || "N/A"} minutes
                </p>
                <p className="text-sm text-gray-300 mt-2 line-clamp-3">
                  {ep.overview || "No description available."}
                </p>
                <div className="mt-2 flex gap-4 text-gray-400 text-sm">
                  <button className="hover:text-white">
                    <FontAwesomeIcon icon={faThumbsUp} /> Like
                  </button>
                  <button className="hover:text-white">
                    <FontAwesomeIcon icon={faThumbsDown} /> Dislike
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TRAILER */}
      {trailer && (
        <div className="max-w-6xl mx-auto px-4 md:px-8 mt-16 mb-6">
          <h2 className="text-2xl font-semibold mb-4">Trailer</h2>
          <div className="w-full aspect-video">
            <iframe
<<<<<<< HEAD
              src={`https://www.youtube.com/embed/${trailer.key}`}
=======
              src={`https://www.youtube-nocookie.com/embed/${trailer.key}?autoplay=0&rel=0&modestbranding=1`}
>>>>>>> 9c939ad (Recommend movies using tf-idf vector spacing method and find movie similarity using cosine)
              className="w-full h-full rounded-lg"
              frameBorder="0"
              allowFullScreen
              title="Trailer"
            ></iframe>
          </div>
        </div>
      )}
<<<<<<< HEAD

=======
>>>>>>> 9c939ad (Recommend movies using tf-idf vector spacing method and find movie similarity using cosine)
      {/* PLAYER OVERLAY */}
      {showPlayer && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-[9999] flex items-center justify-center">
          <button
            onClick={() => setShowPlayer(false)}
            className="absolute top-4 right-6 text-white text-3xl z-[10000]"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
          <div className="relative w-full max-w-5xl h-[70vh] z-[10001]  p-4">
            <Watch title={movie.title} movieId={id} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Movies;
