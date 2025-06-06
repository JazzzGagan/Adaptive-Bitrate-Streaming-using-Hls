import React, { useRef, useEffect } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "videojs-hls-quality-selector";
import "videojs-contrib-quality-levels";

const VideoPlayer = ({ options, initialOptions }) => {
  const videoNode = useRef(null);
  const player = useRef(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (videoNode.current && !initialized.current) {
      initialized.current = true; //prevent duplicate initialization
      player.current = videojs(videoNode.current, {
        ...options,
        ...initialOptions,
      }).ready(function () {
        console.log("Player Ready");
      });
    }
    //clear up player on dismount
    return () => {
      if (player.current) {
        player.current.dispose();
      }
    };
  }, []);

  return (
    <div data-vjs-player>
      <video
        ref={videoNode}
        className="video-js vjs-big-play-centered w-full h-full"
        controls
        preload="auto"
      />
    </div>
  );
};

export default VideoPlayer;
