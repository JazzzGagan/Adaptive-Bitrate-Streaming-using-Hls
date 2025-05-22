import React, { useRef, useEffect } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "videojs-hls-quality-selector";
import "videojs-contrib-quality-levels";

const VideoPlayer = ({ options, src }) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    let frameId;

    if (!playerRef.current) {
      frameId = requestAnimationFrame(() => {
        if (videoRef.current) {
          const player = videojs(videoRef.current, options, () => {
            console.log("Video.js player ready");

            playerRef.current = player;

            player.ready(() => {
              if (typeof player.hlsQualitySelector === "function") {
                player.tech().vhs({
                  displayCurrentQuality: true,
                });
              }

              player.src({
                src: src,
                type: "application/x-mpegURL",
              });
            });
          });
        }
      });
    }

    return () => {
      cancelAnimationFrame(frameId);
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [options, src]);

  return (
    <div data-vjs-player>
      <video
        ref={videoRef}
        className="video-js vjs-big-play-centered w-full h-full"
        controls
        preload="auto"
      />
    </div>
  );
};

export default VideoPlayer;
