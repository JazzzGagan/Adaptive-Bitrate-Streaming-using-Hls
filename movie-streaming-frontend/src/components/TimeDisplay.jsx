import React from "react";
import { formatSecondsToHHMMSS } from "../Utils/ProgressTime";

const TimeDisplay = ({ seconds }) => {
<<<<<<< HEAD
  return <p>{formatSecondsToHHMMSS(seconds)}</p>;
=======
  return <p className="text-xs md:text-2xl">{formatSecondsToHHMMSS(seconds)}</p>;
>>>>>>> 9c939ad (Recommend movies using tf-idf vector spacing method and find movie similarity using cosine)
};

export default TimeDisplay;
