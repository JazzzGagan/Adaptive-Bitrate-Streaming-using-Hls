import React, { useRef, useEffect } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import httpSourceSelector from "videojs-http-source-selector";
import "videojs-contrib-quality-levels";

if (!videojs.getPlugin("httpSourceSelector")) {
  videojs.registerPlugin("httpSourceSelector", httpSourceSelector);
}

const VideoPlayer = ({ options, initialOptions }) => {
  const videoNode = useRef(null);
  const player = useRef(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (videoNode.current && !initialized.current) {
      initialized.current = true;
      player.current = videojs(videoNode.current, {
        ...options,
        ...initialOptions,
      }).ready(function () {
        console.log("Player Ready");
        this.httpSourceSelector();
      });
    }

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
        data-setup='{ "playbackRates": [0.5, 1, 1.25, 1.5, 1.75, 2] }'
      />
    </div>
  );
};

export default VideoPlayer;
