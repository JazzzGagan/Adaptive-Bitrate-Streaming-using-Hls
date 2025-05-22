import React from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const MovieSection = ({ title, movies }) => {
  const navigate = useNavigate();
  const settings = {
    dots: true,
    speed: 500,
    slidesToShow: Math.min(movies.length, 4),
    slidesToScroll: Math.min(movies.length, 4),
    infinite: true,
    autoplay: false,
    autoplaySpeed: 1000,
  };
  return (
    <div className="my-0 px-6  cursor-pointer">
      <h2 className="text-4xl pt-5 font-bold mb-4 text-white">{title}</h2>

      <Slider {...settings}>
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="min-w-[170px] "
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
              className="rounded-md w-[239px] h-4/5  object-cover shadow-md hover:scale-105 transition-transform"
            />
            <p className="text-sm  w-[239px] text-center mt-2  text-white">
              {movie.title}
            </p>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default MovieSection;
