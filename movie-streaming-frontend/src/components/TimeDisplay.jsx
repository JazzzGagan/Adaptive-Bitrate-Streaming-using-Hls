import React from "react";
import { formatSecondsToHHMMSS } from "../Utils/ProgressTime";

const TimeDisplay = ({ seconds }) => {
  return <p className="text-xs md:text-2xl">{formatSecondsToHHMMSS(seconds)}</p>;
};

export default TimeDisplay;
