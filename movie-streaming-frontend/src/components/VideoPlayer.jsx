import { useRef, useEffect, useContext, useState } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import httpSourceSelector from "videojs-http-source-selector";
import "videojs-contrib-quality-levels";
import axios from "axios";
import { AuthContext } from "../context/Contexts";
import { getContinueWatchingMovies } from "../api/tmdb";

if (!videojs.getPlugin("httpSourceSelector")) {
  videojs.registerPlugin("httpSourceSelector", httpSourceSelector);
}

const VideoPlayer = ({ options, initialOptions, title, movieId }) => {
  const { userinfo } = useContext(AuthContext);

  const videoNode = useRef(null);
  const player = useRef(null);
  const initialized = useRef(false);
  const [progress, setProgress] = useState(null);
  const totalDurationRef = useRef(0);

  useEffect(() => {
    const getProgress = async () => {
      try {
        const savedProgress = await getContinueWatchingMovies(
          userinfo?.user_id
        );
        const movie = savedProgress.find((item) => item.id == movieId);
        if (movie && movie.progress) {
          setProgress(movie.progress);
        } else {
          setProgress(0);
        }
      } catch (error) {
        console.error("Error fetching progress:", error);
        setProgress(0);
      }
    };

    if (userinfo?.user_id && movieId) {
      getProgress();
    }
  }, [movieId, userinfo?.user_id]);

  useEffect(() => {
    if (videoNode.current && !initialized.current && progress !== null) {
      initialized.current = true;
      player.current = videojs(videoNode.current, {
        ...options,
        ...initialOptions,
      }).ready(function () {
        if (progress > 0) {
          this.currentTime(progress);
        }

        this.httpSourceSelector();

        this.on("loadedmetadata", () => {
          totalDurationRef.current = this.duration();
        });

        this.on("pause", () => {
          const currentTime = this.currentTime();

          const payload = {
            userId: userinfo?.user_id,
            movieTitle: title || "Three Robots",
            movieId: movieId,
            progress: currentTime,
            totalTime: totalDurationRef.current,
          };

          axios
            .post("http://127.0.0.1:5000/saveprogress", payload)
            .then((res) => console.log("Progress Saved: ", res.data))
            .catch((err) => console.error("Error saving progress", err));
        });
      });
    }

    return () => {
      if (player.current) {
        player.current.dispose();
        player.current = null;
        initialized.current = false;
      }
    };
  }, [progress, userinfo, options, initialOptions, movieId, title]);

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
