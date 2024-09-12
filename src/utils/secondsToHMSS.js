export function secondsToHms(seconds) {
  // Calculate hours, minutes, seconds, and milliseconds
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const millisecs = Math.floor((seconds % 1) * 1000); // Get the milliseconds

  // Pad the values with leading zeros if necessary
  const formattedHrs = hrs.toString().padStart(2, '0');
  const formattedMins = mins.toString().padStart(2, '0');
  const formattedSecs = secs.toString().padStart(2, '0');
  const formattedMillisecs = millisecs.toString().padStart(3, '0');

  // Return the formatted time with milliseconds
  return `${formattedHrs}:${formattedMins}:${formattedSecs}.${formattedMillisecs}`;
}
