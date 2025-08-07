import React from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import TimeDisplay from "./TimeDisplay";
import { IoIosPlay } from "react-icons/io";
import { IoIosInformationCircleOutline } from "react-icons/io";

const MovieCard = ({ title, movies }) => {
  const navigate = useNavigate();

  const settings = {
    dots: false,
    speed: 500,
    slidesToShow: Math.min(movies.length, 5),
    slidesToScroll: 5,
    infinite: movies.length > 6,
    autoplay: false,
    autoplaySpeed: 1000,
    rtl: false,
    responsive: [
      {
        breakpoint: 700,
        settings: {
          slidesToShow: Math.min(movies.length, 4),
          slidesToScroll: 1,
          infinite: movies.length > 6,

          arrows: false,
          rtl: false,
          swipeToSlide: true,
        },
      },
    ],
  };

  const filterMovies = movies.filter((movie) => movie.completed !== true);

  return (
    <div className="md:px-6  cursor-pointer flex-grow ">
      {filterMovies.length > 0 && (
        <h2 className="text-sm md:text-4xl py-1 md:pt-5 font-bold md:mb-4  text-background2">
          {title}
        </h2>
      )}

      {filterMovies.length < 5 ? (
        <div className="flex">
          {filterMovies.map((movie) => (
            <div
              key={movie.id}
              className="  md:w-[340px]   relative px-1  md:px-3 "
              onClick={() =>
                navigate(
                  movie.media_type
                    ? `/movie/${movie.id}/${movie.media_type}`
                    : `/movie/${movie.id}`,
                  { state: { progress: movie.progress } }
                )
              }
            >
              <img
                src={movie.poster}
                alt={movie.title}
                className="md:rounded-xl rounded-sm  h-36 w-24 md:w-[400px] md:h-[40vh] object-fill shadow-md hover:scale-105 transition-transform"
              />
              {movie.progress && movie.totalDuration && (
                <>
                  <div className="w-11 h-11 md:w-24 md:h-24 absolute rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-50 flex items-center justify-center outline outline-white">
                    <div className="flex text-white ">
                      <IoIosPlay className="text-xl md:text-5xl" />
                    </div>
                  </div>
                  <div className=" w-20 md:w-72 md:h-28  absolute md:bottom-4 bottom-6 text-center space-y-2  font-normal   text-2xl left-1/2 -translate-x-1/2 translate-y-1/2  shadow-black text-white  font-sans ">
                    <div className="w-full md:h-12  flex items-center justify-start  space-x-[10%] md:space-x-[25%]  ">
                      <IoIosInformationCircleOutline className="md:text-3xl text-base" />
                      <TimeDisplay
                        seconds={movie.progress}
                        className="text-sm"
                      />
                    </div>

                    <div className="h-1 w-full rounded-full absolute ">
                      <div
                        className=" h-1 md:h-2.5 md:w-5 bg-white rounded-full "
                        style={{
                          width: `${
                            (movie.progress / movie.totalDuration) * 100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      ) : (
        <Slider {...settings}>
          {filterMovies.map((movie) => (
            <div
              key={movie.id}
              className="   md:min-w-[190px] relative px-1  md:px-3 "
              onClick={() =>
                navigate(
                  movie.media_type
                    ? `/movie/${movie.id}/${movie.media_type}`
                    : `/movie/${movie.id}`,
                  { state: { progress: movie.progress } }
                )
              }
            >
              <img
                src={movie.poster}
                alt={movie.title}
                className="md:rounded-xl rounded-sm  h-36   md:w-[400px] md:h-[40vh] object-fill shadow-md hover:scale-105 transition-transform"
              />
              {movie.progress && movie.totalDuration && (
                <>
                  <div className="w-11 h-11 md:w-24 md:h-24 absolute rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-50 flex items-center justify-center outline outline-white">
                    <div className="flex text-white ">
                      <IoIosPlay className="text-xl md:text-5xl" />
                    </div>
                  </div>
                  <div className=" w-20 md:w-72 md:h-28  absolute md:bottom-4 bottom-6 text-center space-y-2  font-normal   text-2xl left-1/2 -translate-x-1/2 translate-y-1/2  shadow-black text-white  font-sans ">
                    <div className="w-full md:h-12  flex items-center justify-start  space-x-[10%] md:space-x-[25%]  ">
                      <IoIosInformationCircleOutline className="md:text-3xl text-base" />
                      <TimeDisplay
                        seconds={movie.progress}
                        className="text-sm"
                      />
                    </div>

                    <div className="h-1 w-full rounded-full absolute ">
                      <div
                        className=" h-1 md:h-2.5 md:w-5 bg-white rounded-full "
                        style={{
                          width: `${
                            (movie.progress / movie.totalDuration) * 100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </Slider>
      )}
    </div>
  );
};

export default MovieCard;
