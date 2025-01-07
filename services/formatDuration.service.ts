const formatDuration = (durationInSeconds: number): string => {
  const hours = Math.floor(durationInSeconds / 3600); // 3600 seconds in an hour
  const minutes = Math.floor((durationInSeconds % 3600) / 60); // Remaining minutes after hours are accounted for

  // Return formatted duration
  return `${hours} hour${hours !== 1 ? "s" : ""} ${minutes} minute${
    minutes !== 1 ? "s" : ""
  }`;
};

export default formatDuration;
