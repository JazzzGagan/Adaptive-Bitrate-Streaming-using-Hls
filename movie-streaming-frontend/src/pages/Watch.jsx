import React from "react";
import VideoPlayer from "../components/VideoPlayer";

const Watch = () => {
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
        src: "http://192.168.101.2:9000/moviebox/Daphe/master.m3u8",
        type: "application/x-mpegURL",
      },
    ],
  };

  return (
    <div className="w-full h-full z-[1000] relative">
      <VideoPlayer options={videoJsOptions} initialOptions={initialOptions} />
    </div>
  );
};

export default Watch;
