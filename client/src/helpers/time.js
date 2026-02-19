import dayjs from "dayjs";

export const formatTimeMs = (ms) => {
  const totalSeconds = Math.ceil(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};



export const getMatchStartDateTime = (match) => {
  if (!match?.date || !match?.startTime) return null;

  const [hours, minutes] = match.startTime.split(":").map(Number);

  return dayjs(match.date)
    .hour(hours)
    .minute(minutes)
    .second(0)
    .millisecond(0)
    .valueOf(); // ← importante para el Timer (ms)
};

export const countdownFormatter = ({ days, hours, minutes, seconds }) => {
  return `${days} days ${hours} hours ${minutes} min ${seconds} sec`;
};

