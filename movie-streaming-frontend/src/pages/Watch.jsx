import React from "react";
import VideoPlayer from "../components/VideoPlayer";

const Watch = ({ title }) => {
  

  const videoJsOptions = {
    autoplay: true,
    controls: true,
    responsive: true,
    fluid: true,
    techOrder: ["html5"],
    html5: {
      hls: {
        overrideNative: true, // Required!
      },
      nativeAudioTracks: false,
      nativeVideoTracks: false,
    },
    sources: [
      {
        src: `http://192.168.101.3:9000/moviebox/${title}/master.m3u8`,
        type: "application/x-mpegURL",
      },
    ],
  };

  return (
    <div className="w-full h-full z-[1000] relative">
      <VideoPlayer options={videoJsOptions} />
    </div>
  );
};

export default Watch;
