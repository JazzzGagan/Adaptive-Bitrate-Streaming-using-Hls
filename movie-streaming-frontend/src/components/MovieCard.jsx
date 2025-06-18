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
  };
  console.log("movieprogress", movies.progress);
  console.log("movietotalduration", movies.totalDuration);

  return (
    <div className="px-6 cursor-pointer flex-grow">
      <h2 className="text-4xl pt-5 font-bold mb-4 text-background2">{title}</h2>
      {movies.length < 5 ? (
        <div className="flex">
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="w-[340px] relative  px-3 "
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
                className="rounded-xl w-[400px] h-[40vh] object-fill shadow-md hover:scale-105 transition-transform"
              />
              {movie.progress && movie.totalDuration && (
                <>
                  <div className="w-24 h-24 absolute rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-50 flex items-center justify-center outline outline-white">
                    <div className="flex text-white ">
                      <IoIosPlay className="text-5xl" />
                    </div>
                  </div>
                  <div className=" w-72 h-28  absolute bottom-4 text-center space-y-2  font-normal    text-2xl left-1/2 -translate-x-1/2 translate-y-1/2  shadow-black text-white  font-sans ">
                    <div className="w-full h-12  flex items-center justify-start space-x-[25%]  ">
                      <IoIosInformationCircleOutline className="text-3xl" />
                      <TimeDisplay seconds={movie.progress} />
                    </div>

                    <div className="h-2.5 w-full rounded-full absolute ">
                      <div
                        className="h-2.5 w-5 bg-white rounded-full "
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
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="min-w-[190px] relative  px-3 "
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
                className="rounded-xl w-[400px] h-[40vh] object-fill shadow-md hover:scale-105 transition-transform"
              />
              {movie.progress && movie.totalDuration && (
                <>
                  <div className="w-24 h-24 absolute rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-50 flex items-center justify-center outline outline-white">
                    <div className="flex text-white ">
                      <IoIosPlay className="text-5xl" />
                    </div>
                  </div>
                  <div className=" w-72 h-28  absolute bottom-4 text-center space-y-2  font-normal    text-2xl left-1/2 -translate-x-1/2 translate-y-1/2  shadow-black text-white  font-sans ">
                    <div className="w-full h-12  flex items-center justify-start space-x-[25%]  ">
                      <IoIosInformationCircleOutline className="text-3xl" />
                      <TimeDisplay seconds={movie.progress} />
                    </div>

                    <div className="h-2.5 w-full rounded-full absolute ">
                      <div
                        className="h-2.5 w-5 bg-white rounded-full "
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
