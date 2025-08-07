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
        src: `http://127.0.0.1:9000/moviebox/Three Robots/master.m3u8`,
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
      />
    </div>
  );
};

export default Watch;
