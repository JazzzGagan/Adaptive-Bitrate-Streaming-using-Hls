import React from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const MovieSection = ({ title, movies }) => {
  const navigate = useNavigate();
  const settings = {
    dots: false,
    speed: 500,
    slidesToShow: Math.min(movies.length, 5),
    slidesToScroll: 5,
    infinite: movies.length > 6,
    autoplay: false,
    autoplaySpeed: 1000,
  };
  return (
    <div className=" px-6 cursor-pointer flex-grow   ">
      <h2 className="text-4xl pt-5 font-bold mb-4 text-white">{title}</h2>

      <Slider {...settings}>
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="min-w-[190px]  px-6   "
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
              className="rounded-xl w-[350px] h-[40vh]  object-cover shadow-md hover:scale-105 transition-transform"
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default MovieSection;
