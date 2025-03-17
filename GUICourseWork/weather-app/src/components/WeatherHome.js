import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchWeatherData } from "../utils/api"; // We'll create this file later

const WeatherHome = () => {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    fetchWeatherData("London").then((data) => setWeather(data));
  }, []);

  return (
    <div className="container">
      <h1>Weather App</h1>
      {weather && (
        <div className="weather-card">
          <h2>{weather.name}</h2>
          <p>{weather.main.temp}°C</p>
          <p>Feels like {weather.main.feels_like}°C</p>
          <p>{weather.weather[0].description}</p>
        </div>
      )}
      <div className="buttons">
        <Link to="/today">Today's Weather</Link>
        <Link to="/demand">Check Demand</Link>
        <Link to="/weekly">7-Day Forecast</Link>
      </div>
    </div>
  );
};

export default WeatherHome;
