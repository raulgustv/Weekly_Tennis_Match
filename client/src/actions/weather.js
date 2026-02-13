// src/api/getWeatherForecast.js

const isRain = (code) => {
  const rainyCodes = [51,53,55,61,63,65,80,81,82,95,96,99];
  return rainyCodes.includes(code);
};

export const getWeatherForecast = async (lat = 40.4167, lon = -3.7033) => {
  try {
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weathercode,temperature_2m_max,temperature_2m_min&forecast_days=7&timezone=auto`
    );

    const data = await res.json();

    return data.daily.time.map((date, i) => ({
      date,
      max: data.daily.temperature_2m_max[i],
      min: data.daily.temperature_2m_min[i],
      rain: isRain(data.daily.weathercode[i])  // <<<<<<<<<< AQUI
    }));

  } catch (err) {
    console.error("Weather error:", err);
    return [];
  }
};
