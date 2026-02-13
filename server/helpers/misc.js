export const hoursToMatch = (date, startTime) => {
    const matchDate = new Date(date);
    const [hours, minutes] = startTime.split(':').map(Number);
    matchDate.setHours(hours, minutes, 0, 0);

    const now = new Date();
    return (matchDate.getTime() - now.getTime()) / (1000 * 60 * 60);
};

export const isLessThan48h = (date, startTime) => {
    const diffHours = hoursToMatch(date, startTime);
    return diffHours <= 48 && diffHours > 0;
};

export const isLessThan24h = (date, startTime) => {
    const diffHours = hoursToMatch(date, startTime);
    return diffHours <= 24 && diffHours > 0;
};


export const formatDate = (date) => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0"); // meses empiezan en 0
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};
