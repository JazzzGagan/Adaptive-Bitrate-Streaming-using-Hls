import React, { useRef, useEffect } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "videojs-hls-quality-selector";

const VideoPlayer = ({ options }) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    let frameId;

    if (!playerRef.current) {
      frameId = requestAnimationFrame(() => {
        if (videoRef.current) {
          const player = videojs(videoRef.current, options, () => {
            console.log("Video.js player ready");

            if (typeof player.hlsQualitySelector === "function") {
              player.hlsQualitySelector({
                displayCurrentQuality: true,
              });
            } else {
              console.warn("hlsQualitySelector plugin not found");
            }
          });

          playerRef.current = player;
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
  }, [options]);

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
