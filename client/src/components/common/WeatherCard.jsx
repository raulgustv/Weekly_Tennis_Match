import { Card, Skeleton } from "antd"

import { useState, useEffect } from "react";
import { getWeatherForecast } from "../../actions/weather";

const WeatherCard = () => {

    const [forecast, setForecast] = useState(null);

    useEffect(() => {
        const loadWeather = async () => {
            const data = await getWeatherForecast();
            setForecast(data);
        };
        loadWeather();
    }, []);

    return (
        <div>
            <Card
                size="small"
                hoverable
                style={{
                    borderRadius: 14,
                    padding: "8px 12px",
                    minWidth: 230,
                    //maxHeight: '25%',
                    overflowY: "auto",
                    boxShadow: "0 6px 14px rgba(0,0,0,0.12)"
                }}
                title="Weather forecast"

            >
                {!forecast ? (
                    <Skeleton active />
                ) : (
                    forecast.slice(0, 7).map((day, i) => (
                        <div
                            key={i}
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: 4,
                                paddingBottom: 4,
                                borderBottom: "1px solid #f0f0f0"
                            }}
                        >
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <span style={{ fontSize: 11, fontWeight: 600 }}>
                                    {new Date(day.date).toLocaleDateString("en-EN", { weekday: "short" })}
                                </span>

                                <span style={{ fontSize: 10, color: "#888" }}>
                                    {new Date(day.date).toLocaleDateString("en-EN", {
                                        day: "2-digit",
                                        month: "2-digit"
                                    })}
                                </span>
                            </div>

                            <span style={{ fontSize: 14 }}>
                                {day.rain ? "🌧️" : "☀️"}
                            </span>

                            <span style={{ fontSize: 12, fontWeight: 600 }}>
                                {day.max}° / {day.min}°
                            </span>
                        </div>
                    ))
                )}
            </Card>
        </div>
    )
}

export default WeatherCard
