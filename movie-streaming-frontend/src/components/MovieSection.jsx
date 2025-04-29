import React from "react";
import { useNavigate } from "react-router-dom";

const MovieSection = ({ title, movies }) => {
  const navigate = useNavigate();

  return (
    <div className="my-0 px-6 cursor-pointer">
      <h2 className="text-4xl pt-5 font-bold mb-4 text-white">{title}</h2>
      <div className="flex gap-4 overflow-x-auto pt-10">
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="min-w-[160px]"
            onClick={() =>
              navigate(
                movie.media_type
                  ? `/movie/${movie.id}/${movie.media_type}`
                  : `/movie/${movie.id}`
              )
            }
          >
            <img
              src={movie.poster}
              alt={movie.title}
              className="rounded-md w-full h-60 object-cover shadow-md hover:scale-105 transition-transform"
            />
            <p className="text-sm text-center mt-2 text-white">{movie.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovieSection;
