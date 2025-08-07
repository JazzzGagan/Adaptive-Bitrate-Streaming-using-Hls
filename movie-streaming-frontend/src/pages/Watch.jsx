import React from "react";
import VideoPlayer from "../components/VideoPlayer";

const Watch = ({ title, movieId }) => {
  const initialOptions = {
    autoplay: true,
    controls: true,
    fluid: true,
    responsive: true,

    controlBar: {
      volumePanel: {
        inline: false,
      },
    },
  };
  const videoJsOptions = {
    sources: [
      {
<<<<<<< HEAD
        src: `http://127.0.0.1:9000/moviebox/Dune/master.m3u8`,
=======
        src: `http://127.0.0.1:9000/moviebox/Three Robots/master.m3u8`,
>>>>>>> 9c939ad (Recommend movies using tf-idf vector spacing method and find movie similarity using cosine)
        type: "application/x-mpegURL",
      },
    ],
  };

  return (
    <div className="w-full h-full z-[1000] relative">
      <VideoPlayer
        options={videoJsOptions}
        initialOptions={initialOptions}
        movieId={movieId}
        title={title}
<<<<<<< HEAD
=======
        


>>>>>>> 9c939ad (Recommend movies using tf-idf vector spacing method and find movie similarity using cosine)
      />
    </div>
  );
};

export default Watch;
