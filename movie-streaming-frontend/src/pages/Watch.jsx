import React from "react";
import VideoPlayer from "../components/VideoPlayer";

const Watch = () => {
  const videoJsOptions = {
    autoplay: true,
    controls: true,
    responsive: true,
    fluid: true,
    techOrder: ["html5"],
    html5: {
      vhs: {
        overrideNative: true,
      },
      nativeAudioTracks: false,
      nativeVideoTracks: false,
    },
    sources: [
      {
        src: "http://172.16.3.135:9000/moviebox/Interstellar/master.m3u8",
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
