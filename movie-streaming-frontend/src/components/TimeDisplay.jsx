import React from "react";
import { formatSecondsToHHMMSS } from "../Utils/ProgressTime";

const TimeDisplay = ({ seconds }) => {
  return <p>{formatSecondsToHHMMSS(seconds)}</p>;
};

export default TimeDisplay;
