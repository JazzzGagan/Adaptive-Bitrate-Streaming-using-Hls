// pages/Watch.jsx
import React from "react";
import VideoPlayer from "../components/VideoPlayer";

const Watch = () => {
  const videoJsOptions = {
    autoplay: true,
    controls: true,
    responsive: true,
    fluid: true,
    sources: [
      {
        src: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8", // Replace with your HLS URL
        type: "application/x-mpegURL",
      },
    ],
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Now Playing</h2>
      <VideoPlayer options={videoJsOptions} />
    </div>
  );
};

export default Watch;
